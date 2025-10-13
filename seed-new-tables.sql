-- Seed data for new tables in the updated schema
-- This script adds basic data for the new normalized tables

-- Countries
INSERT INTO `countries` (`id`, `name`, `code`, `createdAt`, `updatedAt`) VALUES
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

-- Languages
INSERT INTO `languages` (`id`, `name`, `code`, `createdAt`, `updatedAt`) VALUES
(1, 'English', 'en', NOW(), NOW()),
(2, 'Spanish', 'es', NOW(), NOW()),
(3, 'French', 'fr', NOW(), NOW()),
(4, 'German', 'de', NOW(), NOW()),
(5, 'Arabic', 'ar', NOW(), NOW()),
(6, 'Italian', 'it', NOW(), NOW()),
(7, 'Dutch', 'nl', NOW(), NOW()),
(8, 'Portuguese', 'pt', NOW(), NOW()),
(9, 'Russian', 'ru', NOW(), NOW()),
(10, 'Chinese', 'zh', NOW(), NOW());

-- Skills
INSERT INTO `skills` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
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

-- Media Work Types
INSERT INTO `media_work_types` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Video Producer', 'Professional video production services', NOW(), NOW()),
(2, 'Photo Journalist', 'Documentary and news photography', NOW(), NOW()),
(3, 'Content Writer', 'Written articles and editorial content', NOW(), NOW()),
(4, 'Audio Producer', 'Podcast and audio content creation', NOW(), NOW()),
(5, 'TV Cameraman', 'Television and broadcast production', NOW(), NOW()),
(6, 'News Reporter', 'Breaking news and investigative reporting', NOW(), NOW()),
(7, 'Documentary Filmmaker', 'Long-form documentary production', NOW(), NOW()),
(8, 'Social Media Manager', 'Digital marketing and social media', NOW(), NOW());

-- Analyst Specialties
INSERT INTO `analyst_specialty` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Middle Eastern Affairs', 'Expertise in Middle East politics and conflicts', NOW(), NOW()),
(2, 'European Affairs', 'EU politics and European policy analysis', NOW(), NOW()),
(3, 'Economic Analysis', 'Financial and economic reporting', NOW(), NOW()),
(4, 'Political Analysis', 'Political commentary and analysis', NOW(), NOW()),
(5, 'Cultural Analysis', 'Cultural and social issues expertise', NOW(), NOW()),
(6, 'International Relations', 'Global politics and diplomacy', NOW(), NOW()),
(7, 'Technology Analysis', 'Tech industry and innovation reporting', NOW(), NOW()),
(8, 'Environmental Analysis', 'Climate and environmental issues', NOW(), NOW());

