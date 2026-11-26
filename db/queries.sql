DECLARE @region NVARCHAR(20) = N'All Regions';
DECLARE @experience NVARCHAR(30) = N'All Experiences';

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
