# What I asked the AI

| What I asked (paste or summarize) | What happened | What I had to fix or check |
| --- | --- | --- |
| Set up my laptop environment, install dependencies, and connect to SQL Server. | Node.js was already installed, npm dependencies were installed, and the .env file was created. | I manually entered the database password and ran npm run create-db and npm run check to verify the connection. |
| Build a theme park recommendation website called ParkFinder using three sample parks. | Created the frontend and Express server with region and experience filters. | I opened the website on localhost and checked the design, filters, and rating order. |
| Connect ParkFinder to SQL Server and populate the database with 20 countries and 50 theme parks. | Created the Countries and ThemeParks tables, SQL queries, loading script, and API endpoint. | I ran the application and checked that selecting Europe and Thrill Rides displayed eight matching parks. |
| Verify the database integration, filters, and application security. | Confirmed that SQL and API results matched and that all 50 parks were stored in the database. | The AI corrected an incorrect expected count in a browser test. I also checked the reported SQL injection tests, parameterized queries, and Git ignore status. |