-- Check if lookup tables have data
SELECT 'Skills' as table_name, COUNT(*) as count FROM skills
UNION ALL
SELECT 'Countries' as table_name, COUNT(*) as count FROM countries  
UNION ALL
SELECT 'Languages' as table_name, COUNT(*) as count FROM languages
UNION ALL
SELECT 'Media Work Types' as table_name, COUNT(*) as count FROM media_work_types;

-- If any of these return 0, you need to run the seed script
-- Run: mysql -u root -p wesourceyou < seed-new-tables.sql
