-- Test script to check journalists count and status
-- Run this on your local database to verify the data

-- 1. Check total journalists count
SELECT COUNT(*) as total_journalists FROM journalists;

-- 2. Check available journalists
SELECT COUNT(*) as available_journalists FROM journalists WHERE isAvailable = true;

-- 3. Check active users
SELECT COUNT(*) as active_users FROM users WHERE status = 'active';

-- 4. Check journalists with both conditions
SELECT 
    COUNT(*) as available_active_journalists,
    GROUP_CONCAT(j.id) as journalist_ids
FROM journalists j
LEFT JOIN users u ON j.userId = u.id
WHERE j.isAvailable = true AND u.status = 'active';

-- 5. Show all journalists with their status
SELECT 
    j.id,
    j.isAvailable,
    j.isApproved,
    u.firstName,
    u.lastName,
    u.status as user_status,
    u.role,
    j.rating,
    j.createdAt
FROM journalists j
LEFT JOIN users u ON j.userId = u.id
ORDER BY j.createdAt DESC;

-- 6. Check if there are any constraints or foreign key issues
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE REFERENCED_TABLE_NAME = 'journalists' 
   OR TABLE_NAME = 'journalists';
