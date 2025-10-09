-- Drop existing tables in correct order (due to foreign key constraints)
DROP TABLE IF EXISTS `job_applications`;
DROP TABLE IF EXISTS `media_purchases`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `media_content`;
DROP TABLE IF EXISTS `journalists`;
DROP TABLE IF EXISTS `companies`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `typeorm_metadata`;

-- Create tables with the new optimized schema
-- This will be handled by TypeORM when synchronize is enabled
