-- Add experienceLevel column to journalists table
ALTER TABLE `journalists` ADD COLUMN `experienceLevel` ENUM('junior', 'mid_level', 'senior', 'expert') NULL;

-- Update existing journalists with experience levels
UPDATE `journalists` SET `experienceLevel` = 'senior' WHERE `id` = 1;
UPDATE `journalists` SET `experienceLevel` = 'mid_level' WHERE `id` = 2;
