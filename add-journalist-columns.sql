-- Add missing columns to journalists table
-- This script adds totalClients, yearsExperience, and totalProjects columns to the existing journalists table

-- Add totalClients column (number of clients the journalist has worked with)
ALTER TABLE `journalists` 
ADD COLUMN `totalClients` INT DEFAULT 0 COMMENT 'Total number of clients the journalist has worked with';

-- Add yearsExperience column (years of experience in journalism)
ALTER TABLE `journalists` 
ADD COLUMN `yearsExperience` INT DEFAULT 0 COMMENT 'Years of experience in journalism';

-- Add totalProjects column (total number of completed projects)
ALTER TABLE `journalists` 
ADD COLUMN `totalProjects` INT DEFAULT 0 COMMENT 'Total number of completed projects';

-- Update existing journalists with sample data
UPDATE `journalists` SET 
    `totalClients` = 45, 
    `yearsExperience` = 5, 
    `totalProjects` = 65 
WHERE `id` = 1;

UPDATE `journalists` SET 
    `totalClients` = 60, 
    `yearsExperience` = 7, 
    `totalProjects` = 85 
WHERE `id` = 2;

-- Update the new journalists from the additional data script
UPDATE `journalists` SET 
    `totalClients` = 65, 
    `yearsExperience` = 8, 
    `totalProjects` = 85 
WHERE `id` = 3;

UPDATE `journalists` SET 
    `totalClients` = 90, 
    `yearsExperience` = 10, 
    `totalProjects` = 120 
WHERE `id` = 4;

UPDATE `journalists` SET 
    `totalClients` = 45, 
    `yearsExperience` = 6, 
    `totalProjects` = 65 
WHERE `id` = 5;

UPDATE `journalists` SET 
    `totalClients` = 70, 
    `yearsExperience` = 12, 
    `totalProjects` = 95 
WHERE `id` = 6;

-- Verify the changes
SELECT id, name, totalClients, yearsExperience, totalProjects, rating 
FROM `journalists` 
ORDER BY id;

