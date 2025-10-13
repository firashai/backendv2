-- Add coverPhoto field to users table
ALTER TABLE users ADD COLUMN coverPhoto VARCHAR(255) NULL;

-- Update existing users to have NULL coverPhoto (optional)
-- This is already handled by the NULL constraint above

