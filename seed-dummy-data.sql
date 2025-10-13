-- Comprehensive dummy data script for testing
-- This script populates all tables with realistic test data

-- Clear existing data (optional - uncomment if you want to reset)
-- DELETE FROM job_applications;
-- DELETE FROM jobs;
-- DELETE FROM companies;
-- DELETE FROM journalists;
-- DELETE FROM registered_users;
-- DELETE FROM users;
-- DELETE FROM media_content;

-- Countries (if not already populated)
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
(10, 'Netherlands', 'NL', NOW(), NOW()),
(11, 'Japan', 'JP', NOW(), NOW()),
(12, 'Brazil', 'BR', NOW(), NOW()),
(13, 'India', 'IN', NOW(), NOW()),
(14, 'South Africa', 'ZA', NOW(), NOW()),
(15, 'Mexico', 'MX', NOW(), NOW());

-- Languages (if not already populated)
INSERT IGNORE INTO `languages` (`id`, `name`, `code`, `createdAt`, `updatedAt`) VALUES
(1, 'English', 'en', NOW(), NOW()),
(2, 'Spanish', 'es', NOW(), NOW()),
(3, 'French', 'fr', NOW(), NOW()),
(4, 'German', 'de', NOW(), NOW()),
(5, 'Arabic', 'ar', NOW(), NOW()),
(6, 'Italian', 'it', NOW(), NOW()),
(7, 'Dutch', 'nl', NOW(), NOW()),
(8, 'Portuguese', 'pt', NOW(), NOW()),
(9, 'Russian', 'ru', NOW(), NOW()),
(10, 'Chinese', 'zh', NOW(), NOW()),
(11, 'Japanese', 'ja', NOW(), NOW()),
(12, 'Hindi', 'hi', NOW(), NOW()),
(13, 'Korean', 'ko', NOW(), NOW()),
(14, 'Turkish', 'tr', NOW(), NOW()),
(15, 'Swedish', 'sv', NOW(), NOW());

-- Skills (if not already populated)
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
(10, 'Data Journalism', 'Data-driven investigative reporting', NOW(), NOW()),
(11, 'Broadcast Journalism', 'Television and radio news reporting', NOW(), NOW()),
(12, 'Investigative Reporting', 'Deep-dive investigative journalism', NOW(), NOW()),
(13, 'Sports Journalism', 'Sports news and analysis', NOW(), NOW()),
(14, 'Business Journalism', 'Financial and business reporting', NOW(), NOW()),
(15, 'Technology Writing', 'Tech industry reporting and analysis', NOW(), NOW());

-- Media Work Types (if not already populated)
INSERT IGNORE INTO `media_work_types` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Video Producer', 'Professional video production services', NOW(), NOW()),
(2, 'Photo Journalist', 'Documentary and news photography', NOW(), NOW()),
(3, 'Content Writer', 'Written articles and editorial content', NOW(), NOW()),
(4, 'Audio Producer', 'Podcast and audio content creation', NOW(), NOW()),
(5, 'TV Cameraman', 'Television and broadcast production', NOW(), NOW()),
(6, 'News Reporter', 'Breaking news and investigative reporting', NOW(), NOW()),
(7, 'Documentary Filmmaker', 'Long-form documentary production', NOW(), NOW()),
(8, 'Social Media Manager', 'Digital marketing and social media', NOW(), NOW()),
(9, 'Broadcast Journalist', 'Television and radio news reporting', NOW(), NOW()),
(10, 'Investigative Reporter', 'Deep-dive investigative journalism', NOW(), NOW());

-- Analyst Specialties (if not already populated)
INSERT IGNORE INTO `analyst_specialty` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Middle Eastern Affairs', 'Expertise in Middle East politics and conflicts', NOW(), NOW()),
(2, 'European Affairs', 'EU politics and European policy analysis', NOW(), NOW()),
(3, 'Economic Analysis', 'Financial and economic reporting', NOW(), NOW()),
(4, 'Political Analysis', 'Political commentary and analysis', NOW(), NOW()),
(5, 'Cultural Analysis', 'Cultural and social issues expertise', NOW(), NOW()),
(6, 'International Relations', 'Global politics and diplomacy', NOW(), NOW()),
(7, 'Technology Analysis', 'Tech industry and innovation reporting', NOW(), NOW()),
(8, 'Environmental Analysis', 'Climate and environmental issues', NOW(), NOW()),
(9, 'Security Analysis', 'National security and defense issues', NOW(), NOW()),
(10, 'Health Analysis', 'Public health and medical reporting', NOW(), NOW());

-- Users
INSERT INTO `users` (`id`, `firstName`, `lastName`, `email`, `password`, `countryId`, `role`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'John', 'Smith', 'john.smith@email.com', '$2b$10$hashedpassword1', 1, 'user', true, '2023-01-15 10:30:00', NOW()),
(2, 'Sarah', 'Johnson', 'sarah.johnson@email.com', '$2b$10$hashedpassword2', 2, 'user', true, '2023-02-20 14:15:00', NOW()),
(3, 'Michael', 'Brown', 'michael.brown@email.com', '$2b$10$hashedpassword3', 3, 'user', true, '2023-03-10 09:45:00', NOW()),
(4, 'Emily', 'Davis', 'emily.davis@email.com', '$2b$10$hashedpassword4', 4, 'user', true, '2023-04-05 16:20:00', NOW()),
(5, 'David', 'Wilson', 'david.wilson@email.com', '$2b$10$hashedpassword5', 5, 'user', true, '2023-05-12 11:30:00', NOW()),
(6, 'Lisa', 'Anderson', 'lisa.anderson@email.com', '$2b$10$hashedpassword6', 6, 'user', true, '2023-06-18 13:45:00', NOW()),
(7, 'Robert', 'Taylor', 'robert.taylor@email.com', '$2b$10$hashedpassword7', 7, 'user', true, '2023-07-22 08:15:00', NOW()),
(8, 'Jennifer', 'Martinez', 'jennifer.martinez@email.com', '$2b$10$hashedpassword8', 8, 'user', true, '2023-08-30 15:30:00', NOW()),
(9, 'William', 'Garcia', 'william.garcia@email.com', '$2b$10$hashedpassword9', 9, 'user', true, '2023-09-14 12:00:00', NOW()),
(10, 'Maria', 'Rodriguez', 'maria.rodriguez@email.com', '$2b$10$hashedpassword10', 10, 'user', true, '2023-10-08 17:45:00', NOW()),
(11, 'James', 'Lee', 'james.lee@email.com', '$2b$10$hashedpassword11', 11, 'user', true, '2023-11-25 14:20:00', NOW()),
(12, 'Patricia', 'White', 'patricia.white@email.com', '$2b$10$hashedpassword12', 12, 'user', true, '2023-12-03 10:15:00', NOW()),
(13, 'Christopher', 'Harris', 'christopher.harris@email.com', '$2b$10$hashedpassword13', 13, 'user', true, '2024-01-10 09:30:00', NOW()),
(14, 'Linda', 'Clark', 'linda.clark@email.com', '$2b$10$hashedpassword14', 14, 'user', true, '2024-02-15 16:45:00', NOW()),
(15, 'Daniel', 'Lewis', 'daniel.lewis@email.com', '$2b$10$hashedpassword15', 15, 'user', true, '2024-03-20 11:20:00', NOW());

-- Registered Users
INSERT INTO `registered_users` (`id`, `userId`, `bio`, `profilePicture`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Experienced journalist with 10+ years in international reporting', 'profile1.jpg', '2023-01-15 10:30:00', NOW()),
(2, 2, 'Award-winning photographer specializing in conflict zones', 'profile2.jpg', '2023-02-20 14:15:00', NOW()),
(3, 3, 'Digital media expert with focus on social media and content creation', 'profile3.jpg', '2023-03-10 09:45:00', NOW()),
(4, 4, 'Investigative reporter with expertise in political corruption', 'profile4.jpg', '2023-04-05 16:20:00', NOW()),
(5, 5, 'Broadcast journalist with extensive experience in live reporting', 'profile5.jpg', '2023-05-12 11:30:00', NOW()),
(6, 6, 'Documentary filmmaker passionate about environmental issues', 'profile6.jpg', '2023-06-18 13:45:00', NOW()),
(7, 7, 'War correspondent with experience in Middle East conflicts', 'profile7.jpg', '2023-07-22 08:15:00', NOW()),
(8, 8, 'Cultural journalist specializing in arts and entertainment', 'profile8.jpg', '2023-08-30 15:30:00', NOW()),
(9, 9, 'Sports journalist with expertise in football and basketball', 'profile9.jpg', '2023-09-14 12:00:00', NOW()),
(10, 10, 'Business reporter covering technology and startup sectors', 'profile10.jpg', '2023-10-08 17:45:00', NOW());

-- Journalists
INSERT INTO `journalists` (`id`, `userId`, `bio`, `experience`, `hourlyRate`, `dailyRate`, `projectRate`, `rating`, `totalReviews`, `totalProjects`, `totalClients`, `yearsExperience`, `hasCamera`, `canTravel`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'International correspondent with extensive experience in conflict zones and political reporting.', '10+ years covering international conflicts, elections, and humanitarian crises.', 75.00, 600.00, 5000.00, 4.8, 45, 120, 85, 10, true, true, '2023-01-15 10:30:00', NOW()),
(2, 2, 'Award-winning photojournalist specializing in documentary photography and visual storytelling.', '8 years of experience in conflict photography, environmental documentation, and cultural reporting.', 65.00, 520.00, 4000.00, 4.9, 38, 95, 70, 8, true, true, '2023-02-20 14:15:00', NOW()),
(3, 3, 'Digital media expert with strong background in social media management and content creation.', '6 years in digital journalism, social media strategy, and multimedia content production.', 55.00, 440.00, 3500.00, 4.7, 32, 80, 60, 6, false, false, '2023-03-10 09:45:00', NOW()),
(4, 4, 'Investigative journalist with expertise in political corruption and corporate malfeasance.', '12 years of investigative reporting, data analysis, and whistleblower protection.', 85.00, 680.00, 6000.00, 4.9, 52, 150, 95, 12, true, true, '2023-04-05 16:20:00', NOW()),
(5, 5, 'Broadcast journalist with extensive experience in live reporting and news anchoring.', '9 years in television news, live reporting, and broadcast production.', 70.00, 560.00, 4500.00, 4.6, 28, 75, 55, 9, true, true, '2023-05-12 11:30:00', NOW()),
(6, 6, 'Documentary filmmaker passionate about environmental issues and social justice.', '7 years creating documentaries on climate change, social inequality, and human rights.', 60.00, 480.00, 4000.00, 4.8, 35, 90, 65, 7, true, true, '2023-06-18 13:45:00', NOW()),
(7, 7, 'War correspondent with extensive experience in conflict zones and humanitarian crises.', '11 years covering wars, conflicts, and humanitarian disasters worldwide.', 80.00, 640.00, 5500.00, 4.9, 48, 130, 90, 11, true, true, '2023-07-22 08:15:00', NOW()),
(8, 8, 'Cultural journalist specializing in arts, entertainment, and social issues.', '5 years covering arts, culture, entertainment, and social movements.', 50.00, 400.00, 3000.00, 4.5, 25, 65, 45, 5, false, false, '2023-08-30 15:30:00', NOW()),
(9, 9, 'Sports journalist with expertise in football, basketball, and Olympic sports.', '8 years covering major sporting events, athlete profiles, and sports analysis.', 45.00, 360.00, 2800.00, 4.4, 22, 55, 40, 8, true, true, '2023-09-14 12:00:00', NOW()),
(10, 10, 'Business reporter covering technology, startups, and financial markets.', '6 years reporting on tech industry, startup ecosystem, and financial markets.', 70.00, 560.00, 4200.00, 4.7, 30, 85, 60, 6, false, true, '2023-10-08 17:45:00', NOW());

-- Companies
INSERT INTO `companies` (`id`, `userId`, `companyName`, `industry`, `companySize`, `website`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 11, 'Global News Network', 'Media & Broadcasting', 'Large', 'https://globalnews.com', 'Leading international news organization covering global events and breaking news.', '2023-11-25 14:20:00', NOW()),
(2, 12, 'Digital Media Solutions', 'Technology & Media', 'Medium', 'https://digitalmedia.com', 'Innovative digital media company specializing in content creation and distribution.', '2023-12-03 10:15:00', NOW()),
(3, 13, 'Independent Productions', 'Entertainment & Media', 'Small', 'https://indieprod.com', 'Independent production company focused on documentary films and investigative journalism.', '2024-01-10 09:30:00', NOW()),
(4, 14, 'Metro Broadcasting', 'Media & Broadcasting', 'Large', 'https://metrobroadcasting.com', 'Regional broadcasting company covering local news, sports, and community events.', '2024-02-15 16:45:00', NOW()),
(5, 15, 'Creative Content Agency', 'Marketing & Media', 'Medium', 'https://creativecontent.com', 'Full-service content creation agency specializing in branded content and social media.', '2024-03-20 11:20:00', NOW());

-- Journalist Skills (Many-to-Many)
INSERT INTO `journalist_skills` (`journalistId`, `skillId`) VALUES
(1, 1), (1, 6), (1, 7), (1, 8),
(2, 2), (2, 7), (2, 9), (2, 12),
(3, 3), (3, 5), (3, 6), (3, 8),
(4, 3), (4, 7), (4, 8), (4, 12),
(5, 1), (5, 6), (5, 11), (5, 12),
(6, 1), (6, 2), (6, 7), (6, 9),
(7, 1), (7, 6), (7, 7), (7, 8),
(8, 3), (8, 9), (8, 13), (8, 14),
(9, 3), (9, 11), (9, 13), (9, 14),
(10, 3), (10, 14), (10, 15), (10, 6);

-- Journalist Languages (Many-to-Many)
INSERT INTO `journalist_languages` (`journalistId`, `languageId`) VALUES
(1, 1), (1, 2), (1, 5),
(2, 1), (2, 4), (2, 5),
(3, 1), (3, 2), (3, 3),
(4, 1), (4, 2), (4, 4),
(5, 1), (5, 3), (5, 4),
(6, 1), (6, 2), (6, 3),
(7, 1), (7, 5), (7, 8),
(8, 1), (8, 2), (8, 6),
(9, 1), (9, 2), (9, 3),
(10, 1), (10, 2), (10, 10);

-- Journalist Media Work Types (Many-to-Many)
INSERT INTO `journalist_media_work_types` (`journalistId`, `mediaWorkTypeId`) VALUES
(1, 6), (1, 10),
(2, 2), (2, 7),
(3, 3), (3, 8),
(4, 6), (4, 10),
(5, 5), (5, 9),
(6, 1), (6, 7),
(7, 6), (7, 10),
(8, 3), (8, 6),
(9, 3), (9, 9),
(10, 3), (10, 6);

-- Journalist Analyst Specialties (Many-to-Many)
INSERT INTO `journalist_analyst_specialties` (`journalistId`, `analystSpecialtyId`) VALUES
(1, 1), (1, 4), (1, 6),
(2, 1), (2, 5), (2, 7),
(3, 3), (3, 5), (3, 7),
(4, 4), (4, 6), (4, 9),
(5, 4), (5, 6), (5, 9),
(6, 5), (6, 8), (6, 10),
(7, 1), (7, 4), (7, 9),
(8, 5), (8, 7), (8, 10),
(9, 3), (9, 5), (9, 7),
(10, 3), (10, 7), (10, 9);

-- Jobs
INSERT INTO `jobs` (`id`, `companyId`, `title`, `description`, `jobType`, `status`, `salaryMin`, `salaryMax`, `salaryCurrency`, `salaryPeriod`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Senior International Correspondent', 'We are seeking an experienced international correspondent to cover global events and breaking news. Must have experience in conflict zones and political reporting.', 'FULL_TIME', 'PUBLISHED', 80000, 120000, 'USD', 'YEARLY', '2024-01-15 10:00:00', NOW()),
(2, 2, 'Digital Content Creator', 'Looking for a creative digital content creator to produce engaging multimedia content for our online platforms. Experience with social media and video production required.', 'PART_TIME', 'PUBLISHED', 25, 40, 'USD', 'HOURLY', '2024-01-20 14:30:00', NOW()),
(3, 3, 'Documentary Producer', 'Independent production company seeks experienced documentary producer for environmental documentary series. Must have strong storytelling skills and technical expertise.', 'CONTRACT', 'PUBLISHED', 15000, 25000, 'USD', 'PROJECT', '2024-02-01 09:15:00', NOW()),
(4, 4, 'Local News Reporter', 'Metro Broadcasting is looking for a local news reporter to cover community events, local politics, and breaking news in the metropolitan area.', 'FULL_TIME', 'PUBLISHED', 45000, 65000, 'USD', 'YEARLY', '2024-02-10 16:45:00', NOW()),
(5, 5, 'Social Media Manager', 'Creative Content Agency needs a social media manager to handle multiple client accounts and create engaging content across various platforms.', 'PART_TIME', 'PUBLISHED', 20, 35, 'USD', 'HOURLY', '2024-02-15 11:20:00', NOW()),
(6, 1, 'Photojournalist - Conflict Zone', 'Global News Network requires an experienced photojournalist for assignment in conflict zones. Must have previous war zone experience and proper safety training.', 'CONTRACT', 'PUBLISHED', 8000, 15000, 'USD', 'PROJECT', '2024-02-20 13:10:00', NOW()),
(7, 2, 'Video Editor', 'Digital Media Solutions is seeking a skilled video editor to work on various projects including documentaries, promotional videos, and social media content.', 'FULL_TIME', 'PUBLISHED', 50000, 75000, 'USD', 'YEARLY', '2024-02-25 15:30:00', NOW()),
(8, 3, 'Investigative Journalist', 'Independent Productions is looking for an investigative journalist to work on a long-term investigation into corporate corruption. Strong research and writing skills required.', 'CONTRACT', 'PUBLISHED', 12000, 20000, 'USD', 'PROJECT', '2024-03-01 10:45:00', NOW()),
(9, 4, 'Sports Reporter', 'Metro Broadcasting seeks a sports reporter to cover local and regional sports events, including high school, college, and professional sports.', 'FULL_TIME', 'PUBLISHED', 40000, 55000, 'USD', 'YEARLY', '2024-03-05 14:20:00', NOW()),
(10, 5, 'Content Writer - Technology', 'Creative Content Agency needs a technology content writer to create articles, blog posts, and marketing materials for tech clients.', 'PART_TIME', 'PUBLISHED', 30, 50, 'USD', 'HOURLY', '2024-03-10 12:00:00', NOW());

-- Job Required Skills (Many-to-Many)
INSERT INTO `job_required_skills` (`jobId`, `skillId`) VALUES
(1, 1), (1, 6), (1, 7), (1, 8),
(2, 1), (2, 3), (2, 5), (2, 6),
(3, 1), (3, 2), (3, 7), (3, 12),
(4, 3), (4, 6), (4, 11), (4, 12),
(5, 3), (5, 5), (5, 6), (5, 8),
(6, 2), (6, 7), (6, 12), (6, 1),
(7, 1), (7, 3), (7, 5), (7, 6),
(8, 3), (8, 7), (8, 8), (8, 12),
(9, 3), (9, 11), (9, 13), (9, 14),
(10, 3), (10, 6), (10, 14), (10, 15);

-- Job Required Languages (Many-to-Many)
INSERT INTO `job_required_languages` (`jobId`, `languageId`) VALUES
(1, 1), (1, 2), (1, 5),
(2, 1), (2, 2),
(3, 1), (3, 2), (3, 3),
(4, 1), (4, 2),
(5, 1), (5, 2), (5, 3),
(6, 1), (6, 5), (6, 8),
(7, 1), (7, 2),
(8, 1), (8, 2), (8, 4),
(9, 1), (9, 2),
(10, 1), (10, 2), (10, 10);

-- Job Media Work Types (Many-to-Many)
INSERT INTO `job_media_work_types` (`jobId`, `mediaWorkTypeId`) VALUES
(1, 6), (1, 10),
(2, 3), (2, 8),
(3, 1), (3, 7),
(4, 6), (4, 9),
(5, 3), (5, 8),
(6, 2), (6, 6),
(7, 1), (7, 3),
(8, 6), (8, 10),
(9, 3), (9, 9),
(10, 3), (10, 6);

-- Job Locations (Many-to-Many)
INSERT INTO `job_locations` (`jobId`, `countryId`) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 5),
(3, 1), (3, 2), (3, 4),
(4, 1),
(5, 1), (5, 2),
(6, 1), (6, 7), (6, 8),
(7, 1), (7, 2),
(8, 1), (8, 2), (8, 3),
(9, 1),
(10, 1), (10, 2), (10, 11);

-- Job Applications
INSERT INTO `job_applications` (`id`, `jobId`, `journalistId`, `coverLetter`, `proposedRate`, `availability`, `mediaWorkTypeId`, `analystSpecialtyId`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 'I am very interested in this position and believe my extensive experience in international reporting makes me an ideal candidate.', 85.00, 'Immediate', 6, 1, 'PENDING', '2024-01-16 11:00:00', NOW()),
(2, 1, 4, 'My investigative background and conflict zone experience would be valuable for this role.', 90.00, '2 weeks', 6, 4, 'PENDING', '2024-01-17 14:30:00', NOW()),
(3, 2, 3, 'I have strong digital media skills and experience with social media content creation.', 60.00, 'Immediate', 3, 3, 'PENDING', '2024-01-21 09:15:00', NOW()),
(4, 3, 6, 'My documentary experience and passion for environmental issues align perfectly with this project.', 65.00, '1 month', 7, 8, 'PENDING', '2024-02-02 16:20:00', NOW()),
(5, 4, 5, 'I have extensive experience in local news reporting and live broadcasting.', 55.00, 'Immediate', 9, 4, 'PENDING', '2024-02-11 10:45:00', NOW()),
(6, 5, 8, 'My cultural journalism background and social media expertise would be perfect for this role.', 45.00, '2 weeks', 8, 5, 'PENDING', '2024-02-16 13:30:00', NOW()),
(7, 6, 2, 'I have extensive experience in conflict zone photography and safety protocols.', 70.00, 'Immediate', 2, 1, 'PENDING', '2024-02-21 15:00:00', NOW()),
(8, 7, 3, 'My video editing skills and digital media experience make me a strong candidate.', 50.00, '1 week', 3, 7, 'PENDING', '2024-02-26 11:20:00', NOW()),
(9, 8, 4, 'My investigative journalism background and research skills are well-suited for this project.', 80.00, '3 weeks', 10, 4, 'PENDING', '2024-03-02 14:15:00', NOW()),
(10, 9, 9, 'I have extensive sports reporting experience and local connections in the sports community.', 40.00, 'Immediate', 9, 3, 'PENDING', '2024-03-06 12:30:00', NOW()),
(11, 10, 10, 'My technology writing experience and business journalism background are perfect for this role.', 55.00, '1 week', 6, 7, 'PENDING', '2024-03-11 16:45:00', NOW());

-- Media Content
INSERT INTO `media_content` (`id`, `journalistId`, `title`, `description`, `contentType`, `filePath`, `fileSize`, `duration`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Syria Conflict Report', 'Comprehensive report on the ongoing conflict in Syria with interviews and on-ground footage.', 'VIDEO', '/uploads/syria_report.mp4', 15728640, 1200, '2024-01-10 14:30:00', NOW()),
(2, 2, 'Climate Change Documentary', 'Documentary exploring the impact of climate change on coastal communities.', 'VIDEO', '/uploads/climate_doc.mp4', 25165824, 1800, '2024-01-15 16:45:00', NOW()),
(3, 3, 'Social Media Campaign Analysis', 'In-depth analysis of viral social media campaigns and their impact on public opinion.', 'ARTICLE', '/uploads/social_media_analysis.pdf', 2048000, NULL, '2024-01-20 11:20:00', NOW()),
(4, 4, 'Corporate Corruption Investigation', 'Investigative report exposing corporate malfeasance in the pharmaceutical industry.', 'ARTICLE', '/uploads/corruption_investigation.pdf', 5120000, NULL, '2024-01-25 09:15:00', NOW()),
(5, 5, 'Local Election Coverage', 'Live coverage of local elections with candidate interviews and analysis.', 'VIDEO', '/uploads/election_coverage.mp4', 8388608, 900, '2024-02-01 19:00:00', NOW()),
(6, 6, 'Environmental Activism', 'Documentary following environmental activists and their fight for climate justice.', 'VIDEO', '/uploads/environmental_activism.mp4', 18874368, 1500, '2024-02-05 13:45:00', NOW()),
(7, 7, 'War Zone Photography', 'Photo essay documenting the human cost of conflict in the Middle East.', 'IMAGE', '/uploads/war_zone_photos.jpg', 3145728, NULL, '2024-02-10 17:30:00', NOW()),
(8, 8, 'Cultural Festival Coverage', 'Coverage of local cultural festivals and their significance to the community.', 'VIDEO', '/uploads/cultural_festival.mp4', 6291456, 600, '2024-02-15 15:20:00', NOW()),
(9, 9, 'Championship Game Report', 'Sports coverage of the regional basketball championship with player interviews.', 'VIDEO', '/uploads/championship_game.mp4', 12582912, 1200, '2024-02-20 20:00:00', NOW()),
(10, 10, 'Tech Startup Interview', 'Interview with successful tech startup founders about their journey and challenges.', 'VIDEO', '/uploads/startup_interview.mp4', 10485760, 900, '2024-02-25 14:10:00', NOW());

-- Media Content Locations (Many-to-Many)
INSERT INTO `media_content_locations` (`mediaContentId`, `countryId`) VALUES
(1, 7), (1, 8), (1, 1),
(2, 1), (2, 2), (2, 5),
(3, 1), (3, 2),
(4, 1), (4, 2), (4, 3),
(5, 1),
(6, 1), (6, 2), (6, 5),
(7, 7), (7, 8), (7, 1),
(8, 1), (8, 2),
(9, 1),
(10, 1), (10, 11);

-- Company Required Skills (Many-to-Many)
INSERT INTO `company_required_skills` (`companyId`, `skillId`) VALUES
(1, 1), (1, 6), (1, 7), (1, 8),
(2, 1), (2, 3), (2, 5), (2, 6),
(3, 1), (3, 2), (3, 7), (3, 12),
(4, 3), (4, 6), (4, 11), (4, 12),
(5, 3), (5, 5), (5, 6), (5, 8);

-- Company Required Languages (Many-to-Many)
INSERT INTO `company_required_languages` (`companyId`, `languageId`) VALUES
(1, 1), (1, 2), (1, 5),
(2, 1), (2, 2),
(3, 1), (3, 2), (3, 3),
(4, 1), (4, 2),
(5, 1), (5, 2), (5, 3);

-- Company Locations (Many-to-Many)
INSERT INTO `company_locations` (`companyId`, `countryId`) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 5),
(3, 1), (3, 2), (3, 4),
(4, 1),
(5, 1), (5, 2);

-- Update timestamps for consistency
UPDATE `users` SET `updatedAt` = NOW() WHERE `updatedAt` IS NULL;
UPDATE `registered_users` SET `updatedAt` = NOW() WHERE `updatedAt` IS NULL;
UPDATE `journalists` SET `updatedAt` = NOW() WHERE `updatedAt` IS NULL;
UPDATE `companies` SET `updatedAt` = NOW() WHERE `updatedAt` IS NULL;
UPDATE `jobs` SET `updatedAt` = NOW() WHERE `updatedAt` IS NULL;
UPDATE `job_applications` SET `updatedAt` = NOW() WHERE `updatedAt` IS NULL;
UPDATE `media_content` SET `updatedAt` = NOW() WHERE `updatedAt` IS NULL;

