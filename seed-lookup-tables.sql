-- Seed lookup tables if they don't exist or are empty
-- This script ensures all lookup tables have data

-- Check and insert Skills if empty
INSERT IGNORE INTO `skills` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Video Production', 'Professional video creation and editing', NOW(), NOW()),
(2, 'Photojournalism', 'News and documentary photography', NOW(), NOW()),
(3, 'Content Writing', 'Article and editorial writing', NOW(), NOW()),
(4, 'Audio Production', 'Podcast and audio content creation', NOW(), NOW()),
(5, 'Digital Marketing', 'Online marketing and social media', NOW(), NOW()),
(6, 'SEO Writing', 'Search engine optimized content', NOW(), NOW()),
(7, 'Conflict Reporting', 'War and conflict zone journalism', NOW(), NOW()),
(8, 'Political Analysis', 'Political commentary and analysis', NOW(), NOW()),
(9, 'Cultural Reporting', 'Cultural and social issues coverage', NOW(), NOW()),
(10, 'Data Journalism', 'Data-driven investigative reporting', NOW(), NOW());

-- Check and insert Countries if empty
INSERT IGNORE INTO `countries` (`id`, `name`, `code`, `createdAt`, `updatedAt`) VALUES
(1, 'United States', 'US', NOW(), NOW()),
(2, 'United Kingdom', 'GB', NOW(), NOW()),
(3, 'Germany', 'DE', NOW(), NOW()),
(4, 'France', 'FR', NOW(), NOW()),
(5, 'Canada', 'CA', NOW(), NOW()),
(6, 'Australia', 'AU', NOW(), NOW()),
(7, 'Egypt', 'EG', NOW(), NOW()),
(8, 'Spain', 'ES', NOW(), NOW()),
(9, 'Italy', 'IT', NOW(), NOW()),
(10, 'Netherlands', 'NL', NOW(), NOW());

-- Check and insert Languages if empty
INSERT IGNORE INTO `languages` (`id`, `name`, `code`, `nativeName`, `createdAt`, `updatedAt`) VALUES
(1, 'English', 'en', 'English', NOW(), NOW()),
(2, 'Spanish', 'es', 'Español', NOW(), NOW()),
(3, 'French', 'fr', 'Français', NOW(), NOW()),
(4, 'German', 'de', 'Deutsch', NOW(), NOW()),
(5, 'Arabic', 'ar', 'العربية', NOW(), NOW()),
(6, 'Italian', 'it', 'Italiano', NOW(), NOW()),
(7, 'Dutch', 'nl', 'Nederlands', NOW(), NOW()),
(8, 'Portuguese', 'pt', 'Português', NOW(), NOW()),
(9, 'Russian', 'ru', 'Русский', NOW(), NOW()),
(10, 'Chinese', 'zh', '中文', NOW(), NOW());

-- Check and insert Media Work Types if empty
INSERT IGNORE INTO `media_work_types` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Video Producer', 'Professional video production services', NOW(), NOW()),
(2, 'Photo Journalist', 'Documentary and news photography', NOW(), NOW()),
(3, 'Content Writer', 'Written articles and editorial content', NOW(), NOW()),
(4, 'Audio Producer', 'Podcast and audio content creation', NOW(), NOW()),
(5, 'TV Cameraman', 'Television and broadcast production', NOW(), NOW()),
(6, 'News Reporter', 'Breaking news and investigative reporting', NOW(), NOW()),
(7, 'Documentary Filmmaker', 'Long-form documentary production', NOW(), NOW()),
(8, 'Social Media Manager', 'Digital marketing and social media', NOW(), NOW());

-- Show counts after seeding
SELECT 'Skills' as table_name, COUNT(*) as count FROM skills
UNION ALL
SELECT 'Countries' as table_name, COUNT(*) as count FROM countries  
UNION ALL
SELECT 'Languages' as table_name, COUNT(*) as count FROM languages
UNION ALL
SELECT 'Media Work Types' as table_name, COUNT(*) as count FROM media_work_types;
