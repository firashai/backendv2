-- Add postedByUserId column to jobs table to track who posted the job
ALTER TABLE `jobs` ADD `postedByUserId` INT NULL;

-- Add foreign key constraint
ALTER TABLE `jobs` ADD CONSTRAINT `FK_jobs_posted_by_user` FOREIGN KEY (`postedByUserId`) REFERENCES `users`(`id`) ON DELETE SET NULL;

-- Add index for better performance
CREATE INDEX `IDX_jobs_posted_by_user` ON `jobs`(`postedByUserId`);

