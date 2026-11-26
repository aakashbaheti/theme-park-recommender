IF OBJECT_ID(N'dbo.Countries', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Countries (
        country_id INT IDENTITY(1,1) NOT NULL,
        country_name NVARCHAR(100) NOT NULL,
        region NVARCHAR(20) NOT NULL,
        CONSTRAINT PK_Countries PRIMARY KEY (country_id),
        CONSTRAINT UQ_Countries_CountryName UNIQUE (country_name),
        CONSTRAINT CK_Countries_Region CHECK (region IN (N'Europe', N'North America', N'Asia'))
    );
END;

IF OBJECT_ID(N'dbo.ThemeParks', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ThemeParks (
        park_id INT IDENTITY(1,1) NOT NULL,
        country_id INT NOT NULL,
        park_name NVARCHAR(150) NOT NULL,
        experience_type NVARCHAR(30) NOT NULL,
        rating DECIMAL(3,1) NOT NULL,
        description NVARCHAR(500) NOT NULL,
        roller_coaster_count SMALLINT NOT NULL,
        CONSTRAINT PK_ThemeParks PRIMARY KEY (park_id),
        CONSTRAINT FK_ThemeParks_Countries FOREIGN KEY (country_id)
            REFERENCES dbo.Countries (country_id),
        CONSTRAINT UQ_ThemeParks_Country_ParkName UNIQUE (country_id, park_name),
        CONSTRAINT CK_ThemeParks_ExperienceType CHECK (
            experience_type IN (N'Thrill Rides', N'Family Attractions', N'Immersive Theming')
        ),
        CONSTRAINT CK_ThemeParks_Rating CHECK (rating >= 0.0 AND rating <= 10.0),
        CONSTRAINT CK_ThemeParks_RollerCoasterCount CHECK (roller_coaster_count >= 0)
    );
END;
