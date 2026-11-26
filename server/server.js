require('dotenv').config();
const express = require('express');
const path = require('path');
const sql = require('mssql');

const app = express();
const port = Number(process.env.PORT) || 3000;
const webDirectory = path.join(__dirname, '..', 'web');
const requiredDatabase = 'aakasb_myapp';
const regions = new Set(['All Regions', 'Europe', 'North America', 'Asia']);
const experiences = new Set([
  'All Experiences',
  'Thrill Rides',
  'Family Attractions',
  'Immersive Theming'
]);
let poolPromise;

function getPool() {
  if (process.env.DB_NAME !== requiredDatabase) {
    const error = new Error(`DB_NAME must be set to ${requiredDatabase}.`);
    error.code = 'DB_NOT_CONFIGURED';
    throw error;
  }

  if (!poolPromise) {
    const pool = new sql.ConnectionPool({
      server: process.env.DB_SERVER,
      port: Number(process.env.DB_PORT || 1433),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: requiredDatabase,
      options: { encrypt: true, trustServerCertificate: true }
    });
    poolPromise = pool.connect().catch((error) => {
      poolPromise = null;
      throw error;
    });
  }

  return poolPromise;
}

app.get('/api/parks', async (req, res) => {
  const region = req.query.region === undefined ? 'All Regions' : req.query.region;
  const experience = req.query.experience === undefined ? 'All Experiences' : req.query.experience;

  if (typeof region !== 'string' || !regions.has(region)) {
    return res.status(400).json({ error: 'Select a valid region.' });
  }
  if (typeof experience !== 'string' || !experiences.has(experience)) {
    return res.status(400).json({ error: 'Select a valid experience.' });
  }

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('region', sql.NVarChar(20), region)
      .input('experience', sql.NVarChar(30), experience)
      .query(`
        SELECT
          p.park_id,
          p.park_name,
          c.country_name,
          c.region,
          p.experience_type,
          p.rating,
          p.description,
          p.roller_coaster_count
        FROM dbo.Countries AS c
        INNER JOIN dbo.ThemeParks AS p
          ON p.country_id = c.country_id
        WHERE (@region = N'All Regions' OR c.region = @region)
          AND (@experience = N'All Experiences' OR p.experience_type = @experience)
        ORDER BY p.rating DESC, p.park_name ASC;
      `);

    return res.json({ parks: result.recordset });
  } catch (error) {
    console.error('GET /api/parks failed:', error.message);
    const status = error.code === 'DB_NOT_CONFIGURED' ? 503 : 500;
    const message = status === 503
      ? error.message
      : 'Unable to load parks. Check the database connection and try again.';
    return res.status(status).json({ error: message });
  }
});

app.use(express.static(webDirectory));

app.listen(port, () => {
  console.log(`ParkFinder is running at http://localhost:${port}`);
});
