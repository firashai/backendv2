-- Additional dummy data script for existing database (FIXED VERSION)
-- This script adds more test data to the existing database structure
-- Based on the current schema from db_abd28e_wesy(1).sql
-- FIXED: All enum values match the database schema

-- Add more users (continuing from existing IDs)
INSERT INTO `users` (`id`, `email`, `password`, `role`, `status`, `firstName`, `lastName`, `phoneNumber`, `city`, `profilePicture`, `emailVerified`, `countryId`, `createdAt`, `updatedAt`) VALUES
(7, 'sarah.wilson@example.com', '$2b$10$UqU5SSLefxUWRflJPmlKbu8W6vba8GvFixRWZn76j2ODe6tW/d0f6', 'journalist', 'active', 'Sarah', 'Wilson', '+1234567892', 'London', 'https://example.com/profiles/sarah.jpg', 1, 2, NOW(), NOW()),
(8, 'michael.brown@example.com', '$2b$10$UqU5SSLefxUWRflJPmlKbu8W6vba8GvFixRWZn76j2ODe6tW/d0f6', 'journalist', 'active', 'Michael', 'Brown', '+1234567893', 'Berlin', 'https://example.com/profiles/michael.jpg', 1, 4, NOW(), NOW()),
(9, 'emily.davis@example.com', '$2b$10$UqU5SSLefxUWRflJPmlKbu8W6vba8GvFixRWZn76j2ODe6tW/d0f6', 'journalist', 'active', 'Emily', 'Davis', '+1234567894', 'Paris', 'https://example.com/profiles/emily.jpg', 1, 3, NOW(), NOW()),
(10, 'david.miller@example.com', '$2b$10$UqU5SSLefxUWRflJPmlKbu8W6vba8GvFixRWZn76j2ODe6tW/d0f6', 'journalist', 'active', 'David', 'Miller', '+1234567895', 'Madrid', 'https://example.com/profiles/david.jpg', 1, 5, NOW(), NOW()),
(11, 'lisa.anderson@example.com', '$2b$10$UqU5SSLefxUWRflJPmlKbu8W6vba8GvFixRWZn76j2ODe6tW/d0f6', 'journalist', 'active', 'Lisa', 'Anderson', '+1234567896', 'Rome', 'https://example.com/profiles/lisa.jpg', 1, 6, NOW(), NOW()),
(12, 'robert.taylor@example.com', '$2b$10$UqU5SSLefxUWRflJPmlKbu8W6vba8GvFixRWZn76j2ODe6tW/d0f6', 'journalist', 'active', 'Robert', 'Taylor', '+1234567897', 'Brussels', 'https://example.com/profiles/robert.jpg', 1, 7, NOW(), NOW()),
(13, 'jennifer.martinez@example.com', '$2b$10$UqU5SSLefxUWRflJPmlKbu8W6vba8GvFixRWZn76j2ODe6tW/d0f6', 'journalist', 'active', 'Jennifer', 'Martinez', '+1234567898', 'Damascus', 'https://example.com/profiles/jennifer.jpg', 1, 8, NOW(), NOW()),
(14, 'william.garcia@example.com', '$2b$10$UqU5SSLefxUWRflJPmlKbu8W6vba8GvFixRWZn76j2ODe6tW/d0f6', 'journalist', 'active', 'William', 'Garcia', '+1234567899', 'Baghdad', 'https://example.com/profiles/william.jpg', 1, 9, NOW(), NOW()),
(15, 'maria.rodriguez@example.com', '$2b$10$UqU5SSLefxUWRflJPmlKbu8W6vba8GvFixRWZn76j2ODe6tW/d0f6', 'journalist', 'active', 'Maria', 'Rodriguez', '+1234567800', 'Sanaa', 'https://example.com/profiles/maria.jpg', 1, 10, NOW(), NOW()),
(16, 'james.lee@example.com', '$2b$10$UqU5SSLefxUWRflJPmlKbu8W6vba8GvFixRWZn76j2ODe6tW/d0f6', 'journalist', 'active', 'James', 'Lee', '+1234567801', 'Cairo', 'https://example.com/profiles/james.jpg', 1, 11, NOW(), NOW()),
(17, 'patricia.white@example.com', '$2b$10$UqU5SSLefxUWRflJPmlKbu8W6vba8GvFixRWZn76j2ODe6tW/d0f6', 'company', 'active', 'Patricia', 'White', '+1234567802', 'Riyadh', 'https://example.com/profiles/patricia.jpg', 1, 12, NOW(), NOW()),
(18, 'christopher.harris@example.com', '$2b$10$UqU5SSLefxUWRflJPmlKbu8W6vba8GvFixRWZn76j2ODe6tW/d0f6', 'company', 'active', 'Christopher', 'Harris', '+1234567803', 'Dubai', 'https://example.com/profiles/christopher.jpg', 1, 13, NOW(), NOW()),
(19, 'linda.clark@example.com', '$2b$10$UqU5SSLefxUWRflJPmlKbu8W6vba8GvFixRWZn76j2ODe6tW/d0f6', 'company', 'active', 'Linda', 'Clark', '+1234567804', 'Amman', 'https://example.com/profiles/linda.jpg', 1, 14, NOW(), NOW()),
(20, 'daniel.lewis@example.com', '$2b$10$UqU5SSLefxUWRflJPmlKbu8W6vba8GvFixRWZn76j2ODe6tW/d0f6', 'company', 'active', 'Daniel', 'Lewis', '+1234567805', 'Beirut', 'https://example.com/profiles/daniel.jpg', 1, 15, NOW(), NOW());

-- Add more registered users
INSERT INTO `registered_users` (`id`, `firstName`, `lastName`, `bio`, `phoneNumber`, `city`, `profilePicture`, `website`, `socialMedia`, `skills`, `interests`, `totalMediaUploads`, `totalMediaViews`, `totalMediaSales`, `totalEarnings`, `createdAt`, `updatedAt`, `userId`, `countryId`) VALUES
(2, 'Sarah', 'Wilson', 'Experienced broadcast journalist with 8+ years in international news coverage', '+1234567892', 'London', 'https://example.com/profiles/sarah.jpg', 'https://sarahwilson.news', '{"twitter": "@sarahwilson", "linkedin": "sarah-wilson-journalist"}', '["Broadcast Journalism", "International Relations", "Live Reporting"]', '["Politics", "International Affairs", "Documentary"]', 25, 15000, 8, 2500.00, NOW(), NOW(), 7, 2),
(3, 'Michael', 'Brown', 'Award-winning photojournalist specializing in conflict zones and humanitarian crises', '+1234567893', 'Berlin', 'https://example.com/profiles/michael.jpg', 'https://michaelbrown.photos', '{"instagram": "@michaelbrown_photos", "twitter": "@mbrown_photo"}', '["Photojournalism", "Conflict Reporting", "Documentary Photography"]', '["Human Rights", "Conflict Resolution", "Visual Storytelling"]', 45, 25000, 15, 4500.00, NOW(), NOW(), 8, 4),
(4, 'Emily', 'Davis', 'Digital media expert with strong background in social media and content creation', '+1234567894', 'Paris', 'https://example.com/profiles/emily.jpg', 'https://emilydavis.media', '{"linkedin": "emily-davis-media", "youtube": "EmilyDavisMedia"}', '["Digital Marketing", "Content Creation", "Social Media Management"]', '["Technology", "Digital Trends", "Media Innovation"]', 30, 18000, 12, 3200.00, NOW(), NOW(), 9, 3),
(5, 'David', 'Miller', 'Investigative journalist with expertise in political corruption and corporate malfeasance', '+1234567895', 'Madrid', 'https://example.com/profiles/david.jpg', 'https://davidmiller.investigations', '{"twitter": "@davidmiller_inv", "linkedin": "david-miller-investigations"}', '["Investigative Journalism", "Data Analysis", "Research"]', '["Politics", "Corruption", "Transparency"]', 20, 12000, 6, 1800.00, NOW(), NOW(), 10, 5);

-- Add more journalists
INSERT INTO `journalists` (`id`, `hasCamera`, `cameraType`, `hasAudioEquipment`, `audioEquipmentType`, `canTravel`, `bio`, `rating`, `totalReviews`, `completedProjects`, `isAvailable`, `hourlyRate`, `dailyRate`, `projectRate`, `createdAt`, `updatedAt`, `userId`, `isApproved`, `approvedBy`, `approvedAt`, `approvalNotes`, `experienceLevel`, `socialMediaAccounts`, `previousWorkLinks`, `certifications`, `portfolio`) VALUES
(3, 1, 'Canon EOS R5', 1, 'Rode NTG5', 1, 'Experienced broadcast journalist with 8+ years covering international news and political developments across Europe and the Middle East.', 4.7, 28, 85, 1, 70.00, 560.00, 4200.00, NOW(), NOW(), 7, 1, 5, NOW(), 'Excellent broadcast experience', 'senior', '{"twitter": "@sarahwilson", "linkedin": "sarah-wilson-journalist"}', '{"portfolio": "https://sarahwilson.news/portfolio", "samples": "https://sarahwilson.news/samples"}', '["Broadcast Journalism Certificate", "International Reporting Safety"]', '{"highlights": ["BBC Coverage", "CNN International", "Sky News"]}'),
(4, 1, 'Sony FX6', 1, 'Sennheiser MKH416', 1, 'Award-winning photojournalist with extensive experience in conflict zones, humanitarian crises, and documentary photography across Europe and the Middle East.', 4.9, 35, 120, 1, 80.00, 640.00, 5000.00, NOW(), NOW(), 8, 1, 5, NOW(), 'Outstanding photojournalism skills', 'expert', '{"instagram": "@michaelbrown_photos", "twitter": "@mbrown_photo"}', '{"portfolio": "https://michaelbrown.photos/portfolio", "awards": "https://michaelbrown.photos/awards"}', '["Conflict Zone Safety", "First Aid", "Satellite Communication"]', '{"awards": ["Pulitzer Prize Nominee", "World Press Photo"]}'),
(5, 0, NULL, 0, NULL, 0, 'Digital media expert with strong background in social media management, content creation, and digital marketing strategies for media organizations.', 4.5, 22, 65, 1, 55.00, 440.00, 3500.00, NOW(), NOW(), 9, 1, 5, NOW(), 'Strong digital media skills', 'mid', '{"linkedin": "emily-davis-media", "youtube": "EmilyDavisMedia"}', '{"portfolio": "https://emilydavis.media/portfolio", "case_studies": "https://emilydavis.media/cases"}', '["Digital Marketing Certificate", "Social Media Management"]', '{"clients": ["Major News Networks", "Media Companies"]}'),
(6, 1, 'Panasonic GH5', 1, 'Zoom H4n', 1, 'Investigative journalist with expertise in political corruption, corporate malfeasance, and data-driven investigative reporting across Europe.', 4.8, 30, 95, 1, 75.00, 600.00, 4500.00, NOW(), NOW(), 10, 1, 5, NOW(), 'Excellent investigative skills', 'senior', '{"twitter": "@davidmiller_inv", "linkedin": "david-miller-investigations"}', '{"portfolio": "https://davidmiller.investigations/portfolio", "investigations": "https://davidmiller.investigations/work"}', '["Investigative Journalism", "Data Analysis", "Research Methods"]', '{"investigations": ["Major Corruption Cases", "Corporate Scandals"]}');

-- Add more companies
INSERT INTO `companies` (`id`, `name`, `website`, `description`, `mission`, `vision`, `logo`, `rating`, `totalReviews`, `completedProjects`, `isActive`, `isVerified`, `createdAt`, `updatedAt`, `userId`, `companySize`, `industry`, `specializations`, `socialMediaAccounts`, `contactPersons`, `paymentMethods`, `preferredCommunication`) VALUES
(3, 'European Broadcasting Corporation', 'https://ebc.eu', 'Leading European broadcasting company specializing in news, documentaries, and cultural programming across the continent.', 'To provide comprehensive European news coverage and cultural programming to diverse audiences.', 'To be the premier source of European news and cultural content worldwide.', 'https://example.com/logos/ebc.png', 4.8, 45, 120, 1, 1, NOW(), NOW(), 17, 'Large', 'Media & Broadcasting', '["News Production", "Documentary Films", "Cultural Programming"]', '{"twitter": "@EBC_News", "facebook": "EuropeanBroadcastingCorp", "linkedin": "european-broadcasting-corp"}', '{"primary": {"name": "Patricia White", "email": "patricia.white@ebc.eu", "phone": "+1234567802"}, "secondary": {"name": "James Smith", "email": "james.smith@ebc.eu", "phone": "+1234567803"}}', '["Bank Transfer", "PayPal", "Credit Card"]', '["Email", "Phone", "Video Conference"]'),
(4, 'Middle East Media Network', 'https://memnetwork.com', 'Comprehensive media network covering Middle Eastern affairs, politics, culture, and social issues across the region.', 'To provide accurate, unbiased coverage of Middle Eastern affairs and promote regional understanding.', 'To be the leading source of Middle Eastern news and analysis globally.', 'https://example.com/logos/memnetwork.png', 4.6, 38, 95, 1, 1, NOW(), NOW(), 18, 'Medium', 'Media & Broadcasting', '["Political Analysis", "Cultural Reporting", "Social Issues"]', '{"twitter": "@MEMNetwork", "instagram": "@memnetwork", "youtube": "MEMNetwork"}', '{"primary": {"name": "Christopher Harris", "email": "christopher.harris@memnetwork.com", "phone": "+1234567803"}, "secondary": {"name": "Sarah Johnson", "email": "sarah.johnson@memnetwork.com", "phone": "+1234567804"}}', '["Bank Transfer", "PayPal"]', '["Email", "WhatsApp", "Video Conference"]'),
(5, 'Global Documentary Productions', 'https://globaldocprod.com', 'Independent production company specializing in documentary films, investigative journalism, and educational content worldwide.', 'To produce compelling documentaries that educate, inform, and inspire global audiences.', 'To be recognized as a leading producer of high-quality documentary content.', 'https://example.com/logos/globaldoc.png', 4.7, 42, 110, 1, 1, NOW(), NOW(), 19, 'Medium', 'Entertainment & Media', '["Documentary Production", "Investigative Journalism", "Educational Content"]', '{"twitter": "@GlobalDocProd", "vimeo": "GlobalDocProd", "linkedin": "global-documentary-productions"}', '{"primary": {"name": "Linda Clark", "email": "linda.clark@globaldocprod.com", "phone": "+1234567804"}, "secondary": {"name": "Robert Wilson", "email": "robert.wilson@globaldocprod.com", "phone": "+1234567805"}}', '["Bank Transfer", "PayPal", "Cryptocurrency"]', '["Email", "Phone", "In-Person Meetings"]');

-- Add more jobs (FIXED: Using correct enum values)
INSERT INTO `jobs` (`id`, `title`, `description`, `jobType`, `status`, `experienceLevel`, `projectDetails`, `startDate`, `endDate`, `applicationDeadline`, `numberOfPositions`, `applicationsCount`, `viewsCount`, `additionalInfo`, `isUrgent`, `isFeatured`, `isVerified`, `createdAt`, `updatedAt`, `companyId`, `isApproved`, `approvedBy`, `approvedAt`, `approvalNotes`, `salary`, `benefits`, `requirements`, `tags`, `categories`, `contactInfo`, `applicationQuestions`) VALUES
(3, 'European Political Correspondent', 'Seeking experienced journalist to cover European Union politics, policy developments, and institutional news from Brussels and other EU capitals.', 'full_time', 'published', 'senior', 'Cover EU political developments, policy changes, and institutional news. Produce analytical pieces and live reports for European audiences. Regular travel to Brussels and other EU capitals required.', '2024-03-01', '2024-12-31', '2024-02-25', 1, 0, 0, 'Position requires fluency in multiple European languages and deep understanding of EU institutions.', 0, 1, 1, NOW(), NOW(), 3, 1, 5, NOW(), 'Approved for publication', '{"min": 60000, "max": 80000, "currency": "EUR", "period": "yearly"}', '["Health Insurance", "Travel Allowance", "Professional Development"]', '["EU Politics Experience", "Multilingual Skills", "Live Reporting"]', '["Politics", "EU", "Correspondent"]', '["News", "Politics", "Europe"]', '{"email": "jobs@ebc.eu", "phone": "+1234567802"}', '[{"question": "Describe your experience covering EU politics", "required": true}, {"question": "What languages do you speak fluently?", "required": true}]'),
(4, 'Middle East Cultural Reporter', 'Looking for experienced journalist to cover cultural events, social issues, and community stories across the Middle East region.', 'contract', 'published', 'mid', 'Cover cultural festivals, social movements, and community stories. Produce photo essays and written articles for Middle Eastern audiences. Travel across the region required.', '2024-04-01', '2024-10-31', '2024-03-25', 1, 0, 0, 'Position requires cultural sensitivity and understanding of regional dynamics.', 0, 0, 1, NOW(), NOW(), 4, 1, 5, NOW(), 'Approved for publication', '{"min": 3000, "max": 5000, "currency": "USD", "period": "monthly"}', '["Travel Allowance", "Equipment Budget"]', '["Cultural Reporting", "Photojournalism", "Regional Knowledge"]', '["Culture", "Middle East", "Reporting"]', '["News", "Culture", "Middle East"]', '{"email": "jobs@memnetwork.com", "phone": "+1234567803"}', '[{"question": "Describe your experience with Middle Eastern cultures", "required": true}, {"question": "Provide examples of your cultural reporting work", "required": true}]'),
(5, 'Documentary Producer - Environmental Series', 'Seeking experienced documentary producer for environmental documentary series focusing on climate change and sustainability issues.', 'contract', 'published', 'senior', 'Produce 6-part documentary series on environmental issues. Coordinate filming, interviews, and post-production. Work with international team of filmmakers and researchers.', '2024-05-01', '2025-02-28', '2024-04-25', 1, 0, 0, 'This is a long-term project requiring extensive travel and coordination with international teams.', 0, 1, 1, NOW(), NOW(), 5, 1, 5, NOW(), 'Approved for publication', '{"min": 8000, "max": 12000, "currency": "USD", "period": "monthly"}', '["Travel Budget", "Equipment Access", "Creative Freedom"]', '["Documentary Production", "Environmental Issues", "Project Management"]', '["Documentary", "Environment", "Production"]', '["Media", "Environment", "Documentary"]', '{"email": "jobs@globaldocprod.com", "phone": "+1234567804"}', '[{"question": "Describe your documentary production experience", "required": true}, {"question": "What environmental issues are you most passionate about?", "required": true}]');

-- Add journalist skills relationships
INSERT INTO `journalist_skills` (`id`, `journalistId`, `skillId`, `proficiencyLevel`, `yearsOfExperience`, `createdAt`, `updatedAt`) VALUES
(7, 3, 5, 'advanced', 8, NOW(), NOW()),
(8, 3, 3, 'advanced', 8, NOW(), NOW()),
(9, 3, 8, 'expert', 8, NOW(), NOW()),
(10, 3, 9, 'advanced', 8, NOW(), NOW()),
(11, 4, 2, 'expert', 10, NOW(), NOW()),
(12, 4, 3, 'expert', 10, NOW(), NOW()),
(13, 4, 1, 'advanced', 10, NOW(), NOW()),
(14, 4, 14, 'expert', 10, NOW(), NOW()),
(15, 5, 12, 'expert', 6, NOW(), NOW()),
(16, 5, 6, 'advanced', 6, NOW(), NOW()),
(17, 5, 7, 'advanced', 6, NOW(), NOW()),
(18, 5, 11, 'intermediate', 6, NOW(), NOW()),
(19, 6, 3, 'expert', 12, NOW(), NOW()),
(20, 6, 9, 'expert', 12, NOW(), NOW()),
(21, 6, 8, 'advanced', 12, NOW(), NOW()),
(22, 6, 10, 'advanced', 12, NOW(), NOW());

-- Add journalist languages relationships
INSERT INTO `journalist_languages` (`id`, `journalistId`, `languageId`, `proficiencyLevel`, `createdAt`, `updatedAt`) VALUES
(8, 3, 2, 'native', NOW(), NOW()),
(9, 3, 3, 'fluent', NOW(), NOW()),
(10, 3, 4, 'fluent', NOW(), NOW()),
(11, 3, 5, 'intermediate', NOW(), NOW()),
(12, 4, 2, 'native', NOW(), NOW()),
(13, 4, 1, 'fluent', NOW(), NOW()),
(14, 4, 3, 'intermediate', NOW(), NOW()),
(15, 4, 5, 'intermediate', NOW(), NOW()),
(16, 5, 2, 'native', NOW(), NOW()),
(17, 5, 3, 'fluent', NOW(), NOW()),
(18, 5, 4, 'intermediate', NOW(), NOW()),
(19, 6, 2, 'native', NOW(), NOW()),
(20, 6, 3, 'fluent', NOW(), NOW()),
(21, 6, 4, 'fluent', NOW(), NOW()),
(22, 6, 5, 'intermediate', NOW(), NOW());

-- Add journalist media work types relationships
INSERT INTO `journalist_media_work_types` (`id`, `journalistId`, `mediaWorkTypeId`, `createdAt`, `updatedAt`) VALUES
(5, 3, 2, NOW(), NOW()),
(6, 3, 11, NOW(), NOW()),
(7, 4, 2, NOW(), NOW()),
(8, 4, 4, NOW(), NOW()),
(9, 5, 3, NOW(), NOW()),
(10, 5, 8, NOW(), NOW()),
(11, 6, 2, NOW(), NOW()),
(12, 6, 11, NOW(), NOW());

-- Add journalist analyst specialties relationships
INSERT INTO `journalist_analyst_specialty` (`id`, `journalistId`, `analystSpecialtyId`, `createdAt`, `updatedAt`) VALUES
(3, 3, 2, NOW(), NOW()),
(4, 3, 4, NOW(), NOW()),
(5, 3, 9, NOW(), NOW()),
(6, 4, 1, NOW(), NOW()),
(7, 4, 4, NOW(), NOW()),
(8, 4, 8, NOW(), NOW()),
(9, 5, 3, NOW(), NOW()),
(10, 5, 6, NOW(), NOW()),
(11, 6, 1, NOW(), NOW()),
(12, 6, 4, NOW(), NOW());

-- Add job locations
INSERT INTO `job_locations` (`id`, `jobId`, `countryId`, `city`, `isRemote`, `travelRequired`, `createdAt`, `updatedAt`) VALUES
(7, 3, 7, 'Brussels', 0, 1, NOW(), NOW()),
(8, 3, 4, 'Berlin', 0, 1, NOW(), NOW()),
(9, 3, 3, 'Paris', 0, 1, NOW(), NOW()),
(10, 4, 8, 'Damascus', 0, 1, NOW(), NOW()),
(11, 4, 11, 'Cairo', 0, 1, NOW(), NOW()),
(12, 4, 12, 'Riyadh', 0, 1, NOW(), NOW()),
(13, 5, 1, 'New York', 0, 1, NOW(), NOW()),
(14, 5, 2, 'London', 0, 1, NOW(), NOW()),
(15, 5, 3, 'Paris', 0, 1, NOW(), NOW());

-- Add job required skills
INSERT INTO `job_required_skills` (`id`, `jobId`, `skillId`, `isRequired`, `importanceLevel`, `createdAt`, `updatedAt`) VALUES
(6, 3, 3, 1, 'high', NOW(), NOW()),
(7, 3, 4, 1, 'high', NOW(), NOW()),
(8, 3, 8, 1, 'high', NOW(), NOW()),
(9, 4, 2, 1, 'high', NOW(), NOW()),
(10, 4, 3, 1, 'high', NOW(), NOW()),
(11, 4, 9, 1, 'medium', NOW(), NOW()),
(12, 5, 1, 1, 'high', NOW(), NOW()),
(13, 5, 6, 1, 'high', NOW(), NOW()),
(14, 5, 9, 1, 'high', NOW(), NOW());

-- Add job required languages
INSERT INTO `job_required_languages` (`id`, `jobId`, `languageId`, `isRequired`, `importanceLevel`, `createdAt`, `updatedAt`) VALUES
(6, 3, 2, 1, 'high', NOW(), NOW()),
(7, 3, 3, 1, 'high', NOW(), NOW()),
(8, 3, 4, 1, 'high', NOW(), NOW()),
(9, 4, 1, 1, 'high', NOW(), NOW()),
(10, 4, 2, 1, 'high', NOW(), NOW()),
(11, 5, 2, 1, 'high', NOW(), NOW()),
(12, 5, 3, 1, 'medium', NOW(), NOW());

-- Add job media work types
INSERT INTO `job_media_work_types` (`id`, `jobId`, `mediaWorkTypeId`, `createdAt`, `updatedAt`) VALUES
(5, 3, 2, NOW(), NOW()),
(6, 3, 11, NOW(), NOW()),
(7, 4, 2, NOW(), NOW()),
(8, 4, 4, NOW(), NOW()),
(9, 5, 1, NOW(), NOW()),
(10, 5, 7, NOW(), NOW());

-- Add job applications
INSERT INTO `job_applications` (`id`, `coverLetter`, `resumeUrl`, `resumeFilename`, `resumeSize`, `portfolio`, `samples`, `status`, `proposedRate`, `proposedRateCurrency`, `proposedRatePeriod`, `availableStartDate`, `availability`, `answers`, `references`, `additionalInfo`, `skills`, `equipment`, `experience`, `education`, `notes`, `rejectionReason`, `rejectedAt`, `rejectedBy`, `acceptanceNotes`, `acceptedAt`, `acceptedBy`, `createdAt`, `updatedAt`, `jobId`, `journalistId`, `companyId`, `mediaWorkTypeId`, `analystSpecialtyId`) VALUES
(3, 'I am excited to apply for the European Political Correspondent position. With 8+ years of experience covering European politics and EU institutions, I bring deep expertise in policy analysis, multilingual communication, and live reporting. My previous work includes coverage of EU summits, policy developments, and institutional news for major European broadcasters.', 'https://example.com/resumes/sarah-wilson-resume.pdf', 'sarah-wilson-resume.pdf', 1876543, 'https://example.com/portfolios/sarah-wilson-portfolio.pdf', 'https://example.com/samples/sarah-wilson-samples.zip', 'pending', 6500.00, 'EUR', 'monthly', '2024-03-01', '{\"days\": [\"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\"], \"hours\": \"8:00 AM - 6:00 PM\", \"timezone\": \"GMT+1\"}', '[{\"question\": \"Describe your experience covering EU politics\", \"answer\": \"I have covered EU institutions for 8 years, including the European Parliament, Commission, and Council. I understand the legislative process, policy-making procedures, and inter-institutional dynamics.\"}, {\"question\": \"What languages do you speak fluently?\", \"answer\": \"I am fluent in English, French, and German, with intermediate Spanish skills. This allows me to conduct interviews and report in multiple European languages.\"}]', '[{\"name\": \"James Thompson\", \"position\": \"News Director\", \"company\": \"BBC\", \"email\": \"james.thompson@bbc.co.uk\", \"phone\": \"+44123456789\"}]', 'I have extensive contacts within EU institutions and can provide insider perspectives on policy developments.', '[\"Political Analysis\", \"EU Policy\", \"Live Broadcasting\", \"Multilingual Communication\", \"Policy Research\"]', '[\"Professional Broadcast Equipment\", \"Satellite Communication\", \"Mobile Studio Setup\"]', '8+ years covering European politics, policy analysis experience, multiple language skills', 'Master of European Studies, London School of Economics; Bachelor of Journalism, University of London', 'Can provide additional EU policy analysis samples and references from EU officials.', NULL, NULL, NULL, NULL, NULL, NULL, NOW(), NOW(), 3, 3, 3, 2, 4),
(4, 'I am applying for the Middle East Cultural Reporter position with strong background in cultural journalism and regional expertise. My experience includes covering cultural festivals, social movements, and community stories across the Middle East. I am fluent in Arabic and English, with deep understanding of regional cultural dynamics.', 'https://example.com/resumes/michael-brown-resume.pdf', 'michael-brown-resume.pdf', 2234567, 'https://example.com/portfolios/michael-brown-portfolio.pdf', 'https://example.com/samples/michael-brown-samples.zip', 'pending', 4500.00, 'USD', 'monthly', '2024-04-01', '{\"days\": [\"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\", \"Saturday\"], \"hours\": \"9:00 AM - 7:00 PM\", \"timezone\": \"GMT+3\"}', '[{\"question\": \"Describe your experience with Middle Eastern cultures\", \"answer\": \"I have covered Middle Eastern cultures for 10 years, including cultural festivals, social movements, and community stories. I understand regional dynamics, cultural sensitivities, and local traditions.\"}, {\"question\": \"Provide examples of your cultural reporting work\", \"answer\": \"I have produced photo essays on cultural festivals, documented social movements, and covered community stories across Syria, Egypt, and other Middle Eastern countries.\"}]', '[{\"name\": \"Ahmed Al-Rashid\", \"position\": \"Editor\", \"company\": \"Al Jazeera\", \"email\": \"ahmed.alrashid@aljazeera.net\", \"phone\": \"+97412345678\"}]', 'I have extensive contacts within Middle Eastern cultural communities and can provide authentic perspectives on regional issues.', '[\"Cultural Reporting\", \"Photojournalism\", \"Regional Knowledge\", \"Arabic Language\", \"Community Engagement\"]', '[\"Professional Camera Equipment\", \"Audio Recording Gear\", \"Mobile Studio Setup\"]', '10+ years covering Middle Eastern cultures, photojournalism experience, regional expertise', 'Bachelor of Journalism, American University of Cairo; Certificate in Middle Eastern Studies', 'Can provide additional cultural reporting samples and references from regional cultural leaders.', NULL, NULL, NULL, NULL, NULL, NULL, NOW(), NOW(), 4, 4, 4, 2, 4),
(5, 'I am excited to apply for the Documentary Producer position. With 6+ years of experience in digital media and content creation, I bring strong skills in project management, creative direction, and multimedia production. My previous work includes successful social media campaigns and digital content strategies for major media organizations.', 'https://example.com/resumes/emily-davis-resume.pdf', 'emily-davis-resume.pdf', 1654321, 'https://example.com/portfolios/emily-davis-portfolio.pdf', 'https://example.com/samples/emily-davis-samples.zip', 'pending', 4000.00, 'USD', 'monthly', '2024-05-01', '{\"days\": [\"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\"], \"hours\": \"9:00 AM - 5:00 PM\", \"timezone\": \"GMT+1\"}', '[{\"question\": \"Describe your documentary production experience\", \"answer\": \"I have produced digital documentaries and multimedia content for 6 years, including social media campaigns, educational content, and promotional videos for media organizations.\"}, {\"question\": \"What environmental issues are you most passionate about?\", \"answer\": \"I am passionate about climate change, renewable energy, and sustainable development. I have produced content on these topics and believe in the power of media to drive environmental awareness.\"}]', '[{\"name\": \"Robert Green\", \"position\": \"Creative Director\", \"company\": \"Green Media Productions\", \"email\": \"robert.green@greenmedia.com\", \"phone\": \"+12345678901\"}]', 'I have strong project management skills and can coordinate international teams effectively.', '[\"Digital Media\", \"Project Management\", \"Content Creation\", \"Social Media\", \"Environmental Awareness\"]', '[\"Digital Production Equipment\", \"Video Editing Software\", \"Collaboration Tools\"]', '6+ years in digital media, content creation experience, project management skills', 'Bachelor of Media Studies, University of Paris; Certificate in Digital Marketing', 'Can provide additional digital media samples and references from international clients.', NULL, NULL, NULL, NULL, NULL, NULL, NOW(), NOW(), 5, 5, 5, 1, 8);

-- Add more media content
INSERT INTO `media_content` (`id`, `title`, `description`, `mediaType`, `status`, `fileUrl`, `thumbnailUrl`, `previewUrl`, `price`, `licenseType`, `recordedDate`, `duration`, `resolution`, `fileSize`, `rating`, `totalViews`, `totalDownloads`, `totalSales`, `totalRevenue`, `isFeatured`, `isVerified`, `createdAt`, `updatedAt`, `journalistId`, `isApproved`, `approvedBy`, `approvedAt`, `approvalNotes`, `companyId`, `tags`, `categories`, `metadata`, `usageRights`, `reviews`, `watermarks`, `alternativeFormats`) VALUES
(5, 'European Union Summit Coverage - March 2024', 'Comprehensive video coverage of the European Union summit in Brussels, including interviews with EU officials and analysis of policy developments.', 'video', 'published', 'https://example.com/media/eu-summit-march2024.mp4', 'https://example.com/thumbnails/eu-summit-thumb.jpg', 'https://example.com/previews/eu-summit-preview.mp4', 800.00, 'non_exclusive', '2024-03-15', '00:25:45', '1920x1080', '3.2GB', 0.00, 0, 0, 0, 0.00, 1, 0, NOW(), NOW(), 3, 0, NULL, NULL, NULL, NULL, '["EU", "Politics", "Summit", "Brussels"]', '["News", "Politics", "Europe"]', '{"location": "Brussels", "event": "EU Summit", "language": "English"}', '{"allowedUses": ["News", "Documentary"], "restrictions": ["No Commercial Use"], "attribution": true}', NULL, NULL, NULL),
(6, 'Middle East Cultural Festival Photo Essay', 'Photo essay documenting traditional cultural festivals across the Middle East, showcasing local traditions, music, and celebrations.', 'photo', 'published', 'https://example.com/media/me-cultural-festival-photos.zip', 'https://example.com/thumbnails/me-cultural-thumb.jpg', 'https://example.com/previews/me-cultural-preview.pdf', 600.00, 'non_exclusive', '2024-02-20', '00:00:00', '4000x3000', '250MB', 0.00, 0, 0, 0, 0.00, 1, 0, NOW(), NOW(), 4, 0, NULL, NULL, NULL, NULL, '["Culture", "Middle East", "Festival", "Traditions"]', '["Culture", "Photography", "Middle East"]', '{"location": "Multiple Middle Eastern Countries", "event": "Cultural Festivals", "language": "Arabic/English"}', '{"allowedUses": ["Editorial", "Cultural"], "restrictions": ["No Commercial Use"], "attribution": true}', NULL, NULL, NULL),
(7, 'Digital Media Trends Analysis', 'Comprehensive analysis of current digital media trends, social media strategies, and content creation best practices for media organizations.', 'document', 'published', 'https://example.com/media/digital-media-trends-2024.pdf', 'https://example.com/thumbnails/digital-trends-thumb.jpg', 'https://example.com/previews/digital-trends-preview.pdf', 300.00, 'non_exclusive', '2024-01-30', '00:00:00', 'A4', '5.2MB', 0.00, 0, 0, 0, 0.00, 0, 0, NOW(), NOW(), 5, 0, NULL, NULL, NULL, NULL, '["Digital Media", "Trends", "Analysis", "Strategy"]', '["Media", "Digital", "Analysis"]', '{"topic": "Digital Media Trends", "year": "2024", "language": "English"}', '{"allowedUses": ["Research", "Education"], "restrictions": ["No Redistribution"], "attribution": true}', NULL, NULL, NULL);

-- Add media content locations
INSERT INTO `media_content_locations` (`id`, `mediaContentId`, `countryId`, `city`, `createdAt`, `updatedAt`) VALUES
(4, 5, 7, 'Brussels', NOW(), NOW()),
(5, 5, 4, 'Berlin', NOW(), NOW()),
(6, 5, 3, 'Paris', NOW(), NOW()),
(7, 6, 8, 'Damascus', NOW(), NOW()),
(8, 6, 11, 'Cairo', NOW(), NOW()),
(9, 6, 12, 'Riyadh', NOW(), NOW()),
(10, 7, 1, 'New York', NOW(), NOW()),
(11, 7, 2, 'London', NOW(), NOW());

-- Add company locations
INSERT INTO `company_locations` (`id`, `companyId`, `countryId`, `city`, `isHeadquarter`, `createdAt`, `updatedAt`) VALUES
(3, 3, 2, 'London', 1, NOW(), NOW()),
(4, 3, 4, 'Berlin', 0, NOW(), NOW()),
(5, 3, 3, 'Paris', 0, NOW(), NOW()),
(6, 4, 11, 'Cairo', 1, NOW(), NOW()),
(7, 4, 8, 'Damascus', 0, NOW(), NOW()),
(8, 4, 12, 'Riyadh', 0, NOW(), NOW()),
(9, 5, 1, 'New York', 1, NOW(), NOW()),
(10, 5, 2, 'London', 0, NOW(), NOW()),
(11, 5, 3, 'Paris', 0, NOW(), NOW());

-- Add company required skills
INSERT INTO `company_required_skills` (`id`, `companyId`, `skillId`, `importanceLevel`, `createdAt`, `updatedAt`) VALUES
(1, 3, 3, 'high', NOW(), NOW()),
(2, 3, 4, 'high', NOW(), NOW()),
(3, 3, 8, 'high', NOW(), NOW()),
(4, 3, 9, 'medium', NOW(), NOW()),
(5, 4, 2, 'high', NOW(), NOW()),
(6, 4, 3, 'high', NOW(), NOW()),
(7, 4, 9, 'medium', NOW(), NOW()),
(8, 5, 1, 'high', NOW(), NOW()),
(9, 5, 6, 'high', NOW(), NOW()),
(10, 5, 9, 'high', NOW(), NOW());

-- Add company required languages
INSERT INTO `company_required_languages` (`id`, `companyId`, `languageId`, `importanceLevel`, `createdAt`, `updatedAt`) VALUES
(1, 3, 2, 'high', NOW(), NOW()),
(2, 3, 3, 'high', NOW(), NOW()),
(3, 3, 4, 'high', NOW(), NOW()),
(4, 4, 1, 'high', NOW(), NOW()),
(5, 4, 2, 'high', NOW(), NOW()),
(6, 5, 2, 'high', NOW(), NOW()),
(7, 5, 3, 'medium', NOW(), NOW());

-- Update existing data for consistency (after adding the new columns)
UPDATE `journalists` SET `totalProjects` = 85, `totalClients` = 65, `yearsExperience` = 8 WHERE `id` = 3;
UPDATE `journalists` SET `totalProjects` = 120, `totalClients` = 90, `yearsExperience` = 10 WHERE `id` = 4;
UPDATE `journalists` SET `totalProjects` = 65, `totalClients` = 45, `yearsExperience` = 6 WHERE `id` = 5;
UPDATE `journalists` SET `totalProjects` = 95, `totalClients` = 70, `yearsExperience` = 12 WHERE `id` = 6;

-- Update job application counts
UPDATE `jobs` SET `applicationsCount` = 1 WHERE `id` = 3;
UPDATE `jobs` SET `applicationsCount` = 1 WHERE `id` = 4;
UPDATE `jobs` SET `applicationsCount` = 1 WHERE `id` = 5;

-- Update company project counts
UPDATE `companies` SET `completedProjects` = 120 WHERE `id` = 3;
UPDATE `companies` SET `completedProjects` = 95 WHERE `id` = 4;
UPDATE `companies` SET `completedProjects` = 110 WHERE `id` = 5;
