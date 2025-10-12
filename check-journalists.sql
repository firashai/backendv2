-- Check all journalists and their availability/status
SELECT 
    j.id,
    j.isAvailable,
    j.isApproved,
    u.firstName,
    u.lastName,
    u.email,
    u.status as user_status,
    u.role,
    j.rating,
    j.totalProjects,
    j.createdAt
FROM journalists j
LEFT JOIN users u ON j.userId = u.id
ORDER BY j.createdAt DESC;

-- Check if there are any journalists with isAvailable = true
SELECT COUNT(*) as available_journalists
FROM journalists 
WHERE isAvailable = true;

-- Check if there are any active users
SELECT COUNT(*) as active_users
FROM users 
WHERE status = 'active';

-- Check journalists with both conditions
SELECT COUNT(*) as available_active_journalists
FROM journalists j
LEFT JOIN users u ON j.userId = u.id
WHERE j.isAvailable = true AND u.status = 'active';
