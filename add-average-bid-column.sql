-- Add averageBid column to jobs table
ALTER TABLE jobs ADD COLUMN averageBid DECIMAL(10,2) DEFAULT 0;
