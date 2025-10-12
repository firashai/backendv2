-- Make all journalists available
UPDATE journalists 
SET isAvailable = true 
WHERE isAvailable = false;

-- Make all users active
UPDATE users 
SET status = 'active' 
WHERE status != 'active';

-- Verify the changes
SELECT 
    j.id,
    j.isAvailable,
    u.firstName,
    u.lastName,
    u.status as user_status,
    j.rating,
    j.totalProjects
FROM journalists j
LEFT JOIN users u ON j.userId = u.id
ORDER BY j.createdAt DESC;
