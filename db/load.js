require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sql = require('mssql');

const requiredDatabase = 'aakasb_myapp';
const regions = ['Europe', 'North America', 'Asia'];
const experiences = ['Thrill Rides', 'Family Attractions', 'Immersive Theming'];

const countries = [
  { name: 'Germany', region: 'Europe' },
  { name: 'France', region: 'Europe' },
  { name: 'Netherlands', region: 'Europe' },
  { name: 'Poland', region: 'Europe' },
  { name: 'Spain', region: 'Europe' },
  { name: 'United Kingdom', region: 'Europe' },
  { name: 'Italy', region: 'Europe' },
  { name: 'United States', region: 'North America' },
  { name: 'Canada', region: 'North America' },
  { name: 'Mexico', region: 'North America' },
  { name: 'Costa Rica', region: 'North America' },
  { name: 'Bahamas', region: 'North America' },
  { name: 'Dominican Republic', region: 'North America' },
  { name: 'Jamaica', region: 'North America' },
  { name: 'Japan', region: 'Asia' },
  { name: 'China', region: 'Asia' },
  { name: 'South Korea', region: 'Asia' },
  { name: 'Singapore', region: 'Asia' },
  { name: 'Malaysia', region: 'Asia' },
  { name: 'United Arab Emirates', region: 'Asia' }
];

const parkSeeds = [
  ['Germany', 'Europa-Park', 'Immersive Theming', 9.6, 14],
  ['Germany', 'Phantasialand', 'Thrill Rides', 9.4, 7],
  ['Germany', 'Heide Park', 'Thrill Rides', 8.6, 8],
  ['Germany', 'Hansa-Park', 'Family Attractions', 8.2, 5],
  ['France', 'Disneyland Paris', 'Family Attractions', 9.5, 5],
  ['France', 'Parc Asterix', 'Thrill Rides', 8.8, 7],
  ['France', 'Puy du Fou', 'Immersive Theming', 9.3, 0],
  ['Netherlands', 'Efteling', 'Immersive Theming', 9.4, 6],
  ['Netherlands', 'Walibi Holland', 'Thrill Rides', 8.4, 8],
  ['Poland', 'Energylandia', 'Thrill Rides', 8.9, 17],
  ['Poland', 'Legendia', 'Family Attractions', 7.9, 5],
  ['Spain', 'PortAventura', 'Thrill Rides', 9.0, 8],
  ['Spain', 'Parque Warner Madrid', 'Family Attractions', 8.3, 5],
  ['Spain', 'Puy du Fou España', 'Immersive Theming', 8.8, 0],
  ['United Kingdom', 'Alton Towers', 'Thrill Rides', 9.1, 10],
  ['United Kingdom', 'LEGOLAND Windsor', 'Family Attractions', 8.6, 4],
  ['United Kingdom', 'Thorpe Park', 'Thrill Rides', 8.2, 7],
  ['Italy', 'Gardaland', 'Family Attractions', 8.5, 6],
  ['Italy', 'Cinecittà World', 'Immersive Theming', 7.8, 4],
  ['United States', 'Cedar Point', 'Thrill Rides', 9.4, 18],
  ['United States', 'Dollywood', 'Family Attractions', 9.2, 9],
  ['United States', 'Universal Orlando Resort', 'Immersive Theming', 9.5, 8],
  ['United States', 'Six Flags Magic Mountain', 'Thrill Rides', 8.7, 19],
  ['United States', 'Disneyland Park (Anaheim)', 'Family Attractions', 9.3, 8],
  ['United States', 'Silver Dollar City', 'Immersive Theming', 8.9, 6],
  ['United States', "Knott's Berry Farm", 'Thrill Rides', 8.5, 10],
  ['Canada', "Canada's Wonderland", 'Thrill Rides', 8.7, 17],
  ['Canada', 'La Ronde', 'Family Attractions', 7.7, 7],
  ['Mexico', 'Six Flags Mexico', 'Thrill Rides', 8.1, 7],
  ['Mexico', 'Xcaret Park', 'Immersive Theming', 9.0, 0],
  ['Costa Rica', 'Parque Diversiones', 'Family Attractions', 7.8, 0],
  ['Bahamas', 'Atlantis Aquaventure', 'Family Attractions', 8.4, 0],
  ['Dominican Republic', 'Ocean World Adventure Park', 'Immersive Theming', 7.9, 0],
  ['Jamaica', 'Kool Runnings Water Park', 'Family Attractions', 8.0, 0],
  ['Jamaica', 'Mystic Mountain', 'Immersive Theming', 8.1, 0],
  ['Japan', 'Tokyo DisneySea', 'Immersive Theming', 9.8, 0],
  ['Japan', 'Universal Studios Japan', 'Thrill Rides', 9.7, 6],
  ['Japan', 'Tokyo Disneyland', 'Family Attractions', 9.4, 5],
  ['Japan', 'Fuji-Q Highland', 'Thrill Rides', 8.8, 7],
  ['Japan', 'Nagashima Spa Land', 'Family Attractions', 8.5, 12],
  ['Japan', 'Sanrio Puroland', 'Immersive Theming', 8.2, 0],
  ['China', 'Shanghai Disneyland', 'Family Attractions', 9.2, 0],
  ['China', 'Universal Beijing Resort', 'Immersive Theming', 9.0, 0],
  ['South Korea', 'Everland', 'Family Attractions', 8.7, 4],
  ['South Korea', 'Lotte World', 'Thrill Rides', 8.6, 3],
  ['Singapore', 'Universal Studios Singapore', 'Thrill Rides', 8.8, 4],
  ['Singapore', 'Adventure Cove Waterpark', 'Family Attractions', 8.3, 0],
  ['Malaysia', 'Sunway Lagoon', 'Family Attractions', 8.4, 0],
  ['United Arab Emirates', 'Ferrari World Abu Dhabi', 'Thrill Rides', 8.9, 0],
  ['United Arab Emirates', 'Warner Bros. World Abu Dhabi', 'Immersive Theming', 8.8, 0]
];

const experienceDescriptions = {
  'Thrill Rides': 'Sample data: a destination represented for high-energy rides and coaster experiences.',
  'Family Attractions': 'Sample data: a destination represented for rides and activities for a range of ages.',
  'Immersive Theming': 'Sample data: a destination represented for detailed themed lands and storytelling.'
};

const parks = parkSeeds.map(([country, name, experienceType, rating, rollerCoasterCount]) => ({
  country,
  name,
  experienceType,
  rating,
  description: `${name}: ${experienceDescriptions[experienceType]}`,
  rollerCoasterCount
}));

function validateSeeds() {
  if (countries.length !== 20 || parks.length !== 50) {
    throw new Error('The sample dataset must contain 20 countries and 50 theme parks.');
  }

  const countryNames = new Set(countries.map((country) => country.name));
  if (countryNames.size !== countries.length) {
    throw new Error('Country sample data contains duplicate country names.');
  }

  const parkKeys = new Set();
  const coverage = new Map(regions.map((region) => [region, new Set()]));
  for (const park of parks) {
    const country = countries.find((item) => item.name === park.country);
    if (!country || !experiences.includes(park.experienceType)) {
      throw new Error(`Invalid sample park data for "${park.name}".`);
    }
    const key = `${park.country}:${park.name}`;
    if (parkKeys.has(key)) {
      throw new Error(`Duplicate sample park "${park.name}" in ${park.country}.`);
    }
    parkKeys.add(key);
    coverage.get(country.region).add(park.experienceType);
  }

  for (const region of regions) {
    if (experiences.some((experience) => !coverage.get(region).has(experience))) {
      throw new Error(`Sample parks in ${region} must cover all three experience types.`);
    }
  }
}

function createConnectionConfig() {
  const missing = ['DB_SERVER', 'DB_USER', 'DB_PASSWORD']
    .filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing database settings in .env: ${missing.join(', ')}.`);
  }

  const port = Number(process.env.DB_PORT || 1433);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('DB_PORT must be a valid TCP port number.');
  }

  return {
    server: process.env.DB_SERVER,
    port,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: requiredDatabase,
    options: { encrypt: true, trustServerCertificate: true }
  };
}

async function upsertCountries(transaction) {
  const request = new sql.Request(transaction);
  const rows = countries.map((country, index) => {
    request.input(`countryName${index}`, sql.NVarChar(100), country.name);
    request.input(`countryRegion${index}`, sql.NVarChar(20), country.region);
    return `(@countryName${index}, @countryRegion${index})`;
  });

  await request.query(`
    MERGE dbo.Countries WITH (HOLDLOCK) AS target
    USING (VALUES ${rows.join(', ')}) AS source (country_name, region)
      ON target.country_name = source.country_name
    WHEN MATCHED THEN
      UPDATE SET region = source.region
    WHEN NOT MATCHED BY TARGET THEN
      INSERT (country_name, region)
      VALUES (source.country_name, source.region);
  `);
}

async function upsertParks(transaction) {
  const lookup = await new sql.Request(transaction).query(
    'SELECT country_id, country_name FROM dbo.Countries;'
  );
  const countryIds = new Map(lookup.recordset.map((row) => [row.country_name, row.country_id]));
  const request = new sql.Request(transaction);
  const rows = parks.map((park, index) => {
    request.input(`countryId${index}`, sql.Int, countryIds.get(park.country));
    request.input(`parkName${index}`, sql.NVarChar(150), park.name);
    request.input(`experience${index}`, sql.NVarChar(30), park.experienceType);
    request.input(`rating${index}`, sql.Decimal(3, 1), park.rating);
    request.input(`description${index}`, sql.NVarChar(500), park.description);
    request.input(`coasterCount${index}`, sql.SmallInt, park.rollerCoasterCount);
    return `(@countryId${index}, @parkName${index}, @experience${index}, @rating${index}, @description${index}, @coasterCount${index})`;
  });

  await request.query(`
    MERGE dbo.ThemeParks WITH (HOLDLOCK) AS target
    USING (VALUES ${rows.join(', ')}) AS source
      (country_id, park_name, experience_type, rating, description, roller_coaster_count)
      ON target.country_id = source.country_id
      AND target.park_name = source.park_name
    WHEN MATCHED THEN
      UPDATE SET
        experience_type = source.experience_type,
        rating = source.rating,
        description = source.description,
        roller_coaster_count = source.roller_coaster_count
    WHEN NOT MATCHED BY TARGET THEN
      INSERT (country_id, park_name, experience_type, rating, description, roller_coaster_count)
      VALUES (
        source.country_id,
        source.park_name,
        source.experience_type,
        source.rating,
        source.description,
        source.roller_coaster_count
      );
  `);
}

async function loadSampleData() {
  if (process.env.DB_NAME !== requiredDatabase) {
    throw new Error(`DB_NAME must be exactly "${requiredDatabase}". No other database will be used.`);
  }

  validateSeeds();
  const pool = new sql.ConnectionPool(createConnectionConfig());
  let transaction;
  let transactionStarted = false;

  try {
    await pool.connect();
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.request().query(schema);

    transaction = new sql.Transaction(pool);
    await transaction.begin();
    transactionStarted = true;
    await upsertCountries(transaction);
    await upsertParks(transaction);
    await transaction.commit();
    transactionStarted = false;
    console.log(`Sample data loaded or updated in ${requiredDatabase}: ${countries.length} countries and ${parks.length} theme parks.`);
  } catch (error) {
    if (transactionStarted) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Database rollback failed:', rollbackError.message);
      }
    }
    throw error;
  } finally {
    if (pool.connected) {
      await pool.close();
    }
  }
}

loadSampleData().catch((error) => {
  console.error('Could not load ParkFinder sample data:', error.message);
  process.exitCode = 1;
});
