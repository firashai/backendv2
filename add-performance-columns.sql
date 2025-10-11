-- Add performance columns to journalists table
-- This script adds onTimeRate, onBudgetRate, acceptRate, and repeatHireRate columns to the existing journalists table

-- Add onTimeRate column (percentage of projects completed on time)
ALTER TABLE `journalists` 
ADD COLUMN `onTimeRate` INT DEFAULT 0 COMMENT 'Percentage of projects completed on time';

-- Add onBudgetRate column (percentage of projects completed on budget)
ALTER TABLE `journalists` 
ADD COLUMN `onBudgetRate` INT DEFAULT 0 COMMENT 'Percentage of projects completed on budget';

-- Add acceptRate column (percentage of job applications accepted)
ALTER TABLE `journalists` 
ADD COLUMN `acceptRate` INT DEFAULT 0 COMMENT 'Percentage of job applications accepted';

-- Add repeatHireRate column (percentage of clients who hire again)
ALTER TABLE `journalists` 
ADD COLUMN `repeatHireRate` INT DEFAULT 0 COMMENT 'Percentage of clients who hire again';

-- Add jobSuccessRate column (percentage of successful job completions)
ALTER TABLE `journalists` 
ADD COLUMN `jobSuccessRate` INT DEFAULT 0 COMMENT 'Percentage of successful job completions';

-- Update existing journalists with sample performance data
UPDATE `journalists` SET 
    `onTimeRate` = 95, 
    `onBudgetRate` = 90, 
    `acceptRate` = 85, 
    `repeatHireRate` = 70,
    `jobSuccessRate` = 100
WHERE `id` = 1;

UPDATE `journalists` SET 
    `onTimeRate` = 92, 
    `onBudgetRate` = 88, 
    `acceptRate` = 80, 
    `repeatHireRate` = 65,
    `jobSuccessRate` = 95
WHERE `id` = 2;

-- Verify the changes
SELECT id, name, onTimeRate, onBudgetRate, acceptRate, repeatHireRate, jobSuccessRate, totalProjects, totalClients, yearsExperience 
FROM `journalists` 
ORDER BY id;
