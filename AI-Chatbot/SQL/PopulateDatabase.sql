-- SQL/PopulateDatabase.sql
USE `mental_health_support`;

INSERT INTO Categories (name, icon) VALUES
    ('Crisis Support', 'alert-circle'),
    ('Counseling', 'message-circle'),
    ('Support Groups', 'users'),
    ('Mental Health', 'heart'),
    ('Addiction', 'help-circle'),
    ('Youth Services', 'smile');
    
INSERT INTO Tags (name) VALUES
    ('Free'), ('Confidential'), ('Crisis Support'), ('Sliding Scale'),
    ('Professional'), ('Multiple Languages'), ('Youth'), ('Family Services'),
    ('Referrals'), ('Assessment'), ('Education'), ('Recovery'), ('Residential'),
    ('Walk-in'), ('Family'), ('No Appointment'), ('Women'), ('Immigrant Services'),
    ('Counselling'), ('Addiction'), ('Shelter'), ('Outreach'), ('Treatment'),
    ('Therapy'), ('Crisis Intervention'), ('24/7 Support'), ('Emergency Housing'),
    ('Immediate Access'), ('Crisis Transport'), ('Safety Planning'),
    ('Emergency Services'), ('Immediate Help')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO Resources (resource_ID, name, description, category_ID, phone, address, hours, website_URL) VALUES
(1, 'Distress Centre Calgary', '24/7 crisis support, professional counselling and referrals.', 
    (SELECT category_ID FROM Categories WHERE name = 'Crisis Support'),
    '403-266-4357', 'Calgary, AB', '24/7', 'https://www.distresscentre.com'),
(2, 'Calgary Counselling Centre', 'Professional counselling services with sliding scale fees.',
    (SELECT category_ID FROM Categories WHERE name = 'Counseling'),
    '403-691-5991', '1000 6 Ave SW, Calgary, AB T2P 0W3', 'Mon-Fri: 8:30AM-5:00PM', 'https://calgarycounselling.com'),
(3, 'Woods Homes', 'Crisis support and counselling services for youth and families.',
    (SELECT category_ID FROM Categories WHERE name = 'Youth Services'),
    '403-299-9699', '805 37 St NW, Calgary, AB T2N 4N8', '24/7', 'https://www.woodshomes.ca'),
(4, 'Access Mental Health', 'Central access point for mental health services in Calgary.',
    (SELECT category_ID FROM Categories WHERE name = 'Mental Health'),
    '403-943-1500', 'Calgary, AB', 'Mon-Fri: 8:00AM-5:00PM', 'https://www.albertahealthservices.ca'),
(5, 'CMHA Calgary', 'Mental health education, support groups, and recovery programs.',
    (SELECT category_ID FROM Categories WHERE name = 'Support Groups'),
    '403-297-1700', '400, 105 12 Ave SE, Calgary, AB T2G 1A1', 'Mon-Fri: 9:00AM-4:30PM', 'https://calgary.cmha.ca'),
(6, 'Fresh Start Recovery Centre', 'Comprehensive addiction treatment and recovery programs.',
    (SELECT category_ID FROM Categories WHERE name = 'Addiction'),
    '403-387-6266', '411 41 Ave NE, Calgary, AB T2E 2N4', '24/7', 'https://www.freshstartrecovery.ca'),
(7, 'Eastside Family Centre', 'Walk-in counselling services for individuals and families.',
    (SELECT category_ID FROM Categories WHERE name = 'Counseling'),
    '403-299-9696', '255, 495 36 St NE, Calgary, AB T2A 6K3', 'Mon-Thu: 11:00AM-7:00PM, Fri: 11:00AM-6:00PM', 'https://www.woodshomes.ca/programs/eastside-family-centre'),
(8, 'Calgary Immigrant Women''s Association', 'Mental health support and counselling for immigrant women.',
    (SELECT category_ID FROM Categories WHERE name = 'Support Groups'),
    '403-263-4414', '138, 4th Ave SE, Calgary, AB T2G 4Z6', 'Mon-Fri: 9:00AM-4:00PM', 'https://www.ciwa-online.com'),
(9, 'Alpha House Society', 'Support for individuals affected by alcohol and drug dependencies.',
    (SELECT category_ID FROM Categories WHERE name = 'Addiction'),
    '403-234-7388', '203 15 Ave SE, Calgary, AB T2G 1G4', '24/7', 'https://alphahousecalgary.com'),
(10, 'Hull Services', 'Mental health services for children, youth and families.',
    (SELECT category_ID FROM Categories WHERE name = 'Youth Services'),
    '403-251-8000', '2266 Woodpark Ave SW, Calgary, AB T2W 2Y9', 'Mon-Fri: 8:30AM-4:30PM', 'https://www.hullservices.ca'),
(11, 'Carya Therapy Services', 'Counselling and therapy services for individuals and families.',
    (SELECT category_ID FROM Categories WHERE name = 'Counseling'),
    '403-269-9888', '200, 1000 8 Ave SW, Calgary, AB T2P 3M7', 'Mon-Thu: 8:30AM-8:00PM, Fri: 8:30AM-4:30PM', 'https://caryacalgary.ca'),
(12, 'ConnecTeen', 'Crisis support and resources specifically for teens.',
    (SELECT category_ID FROM Categories WHERE name = 'Crisis Support'),
    '403-264-8336', 'Calgary, AB', '24/7', 'https://www.distresscentre.com/connectteen'),
(13, 'Mobile Response Team', 'Crisis outreach team providing immediate mental health support.',
    (SELECT category_ID FROM Categories WHERE name = 'Crisis Support'),
    '403-266-4357', 'Calgary, AB', '24/7', 'https://www.albertahealthservices.ca/mht/mht.aspx'),
(14, 'Access Mental Health - Urgent', 'Fast-track mental health service access during crisis.',
    (SELECT category_ID FROM Categories WHERE name = 'Crisis Support'),
    '403-943-1500', 'Calgary, AB', 'Mon-Fri: 8AM-5PM', 'https://www.albertahealthservices.ca'),
(15, 'Urgent Mental Health Walk-In', 'Same-day crisis counselling and psychiatric support.',
    (SELECT category_ID FROM Categories WHERE name = 'Crisis Support'),
    '403-955-6200', 'South Calgary Health Centre', 'Mon-Fri: 8AM-10PM', 'https://www.albertahealthservices.ca'),
(16, 'Crisis Housing Program', 'Emergency temporary housing during mental health crisis.',
    (SELECT category_ID FROM Categories WHERE name = 'Crisis Support'),
    '403-299-9699', 'Calgary, AB', '24/7', 'https://www.woodshomes.ca'),
(17, 'Teen Crisis Line', 'Crisis support specifically for teens and young adults.',
    (SELECT category_ID FROM Categories WHERE name = 'Youth Services'),
    '403-264-8336', 'Calgary, AB', '24/7', 'https://www.distresscentre.com/teen-line'),
(18, 'Addiction Crisis Service', 'Immediate support for substance-related crisis.',
    (SELECT category_ID FROM Categories WHERE name = 'Addiction'),
    '403-297-4664', 'Calgary, AB', '24/7', 'https://www.albertahealthservices.ca');

INSERT INTO Used_In (resource_ID, tag_ID)
SELECT 1, tag_ID FROM Tags WHERE name IN ('Free', 'Confidential', 'Crisis Support', '24/7 Support');

INSERT INTO Used_In (resource_ID, tag_ID)
SELECT 2, tag_ID FROM Tags WHERE name IN ('Sliding Scale', 'Professional', 'Multiple Languages');

INSERT INTO Used_In (resource_ID, tag_ID)
SELECT 3, tag_ID FROM Tags WHERE name IN ('Youth', 'Crisis Support', 'Family Services');

INSERT INTO Used_In (resource_ID, tag_ID)
SELECT 4, tag_ID FROM Tags WHERE name IN ('Free', 'Referrals', 'Assessment');

INSERT INTO Used_In (resource_ID, tag_ID)
SELECT 5, tag_ID FROM Tags WHERE name IN ('Support Groups', 'Education', 'Recovery');

INSERT INTO Used_In (resource_ID, tag_ID)
SELECT 6, tag_ID FROM Tags WHERE name IN ('Addiction', 'Recovery', 'Residential');

INSERT INTO Used_In (resource_ID, tag_ID)
SELECT 7, tag_ID FROM Tags WHERE name IN ('Walk-in', 'Family', 'No Appointment');

INSERT INTO Used_In (resource_ID, tag_ID)
SELECT 8, tag_ID FROM Tags WHERE name IN ('Women', 'Immigrant Services', 'Counselling');

INSERT INTO Used_In (resource_ID, tag_ID)
SELECT 9, tag_ID FROM Tags WHERE name IN ('Addiction', 'Shelter', 'Outreach');

INSERT INTO Used_In (resource_ID, tag_ID)
SELECT 10, tag_ID FROM Tags WHERE name IN ('Youth', 'Family', 'Treatment');

INSERT INTO Used_In (resource_ID, tag_ID)
SELECT 11, tag_ID FROM Tags WHERE name IN ('Therapy', 'Family', 'Sliding Scale');

INSERT INTO Used_In (resource_ID, tag_ID)
SELECT 12, tag_ID FROM Tags WHERE name IN ('Youth', 'Crisis Support', 'Confidential');

INSERT INTO Used_In (resource_ID, tag_ID)
SELECT 13, tag_ID FROM Tags WHERE name IN ('Crisis Support', 'Professional', '24/7 Support', 'Crisis Intervention', 'Emergency Services');

INSERT INTO Used_In (resource_ID, tag_ID)
SELECT 14, tag_ID FROM Tags WHERE name IN ('Crisis Support', 'Professional', 'Assessment', 'Immediate Access');

INSERT INTO Used_In (resource_ID, tag_ID)
SELECT 15, tag_ID FROM Tags WHERE name IN ('Crisis Support', 'Walk-in', 'Professional', 'Immediate Help');

INSERT INTO Used_In (resource_ID, tag_ID)
SELECT 16, tag_ID FROM Tags WHERE name IN ('Crisis Support', 'Shelter', 'Residential', 'Emergency Housing');

INSERT INTO Used_In (resource_ID, tag_ID)
SELECT 17, tag_ID FROM Tags WHERE name IN ('Crisis Support', 'Youth', 'Confidential', '24/7 Support');

INSERT INTO Used_In (resource_ID, tag_ID)
SELECT 18, tag_ID FROM Tags WHERE name IN ('Crisis Support', 'Addiction', 'Treatment', 'Immediate Help');

INSERT INTO Used_In (resource_ID, tag_ID)
SELECT r.resource_ID, t.tag_ID
FROM Resources r
CROSS JOIN Tags t
WHERE r.category_ID = (SELECT category_ID FROM Categories WHERE name = 'Crisis Support')
AND t.name IN ('Crisis Support', 'Professional', '24/7 Support', 'Crisis Intervention', 'Safety Planning', 'Immediate Help')
ON DUPLICATE KEY UPDATE resource_ID = VALUES(resource_ID);

INSERT INTO Used_In (resource_ID, tag_ID)
SELECT r.resource_ID, t.tag_ID
FROM Resources r
CROSS JOIN Tags t
WHERE r.name = 'Distress Centre Calgary'
AND t.name IN ('Crisis Support', '24/7 Support', 'Crisis Intervention', 'Safety Planning', 'Immediate Help', 'Emergency Services')
ON DUPLICATE KEY UPDATE resource_ID = VALUES(resource_ID);

INSERT INTO Used_In (resource_ID, tag_ID)
SELECT r.resource_ID, t.tag_ID
FROM Resources r
CROSS JOIN Tags t
WHERE r.name = 'Mobile Response Team'
AND t.name IN ('Crisis Support', 'Emergency Services', 'Crisis Intervention', 'Professional', 'Immediate Help')
ON DUPLICATE KEY UPDATE resource_ID = VALUES(resource_ID);

INSERT INTO Used_In (resource_ID, tag_ID) 
SELECT r.resource_ID, t.tag_ID
FROM Resources r
CROSS JOIN Tags t
WHERE r.name = 'Crisis Housing Program'
AND t.name IN ('Crisis Support', 'Emergency Housing', 'Crisis Intervention', 'Immediate Help')
ON DUPLICATE KEY UPDATE resource_ID = VALUES(resource_ID);

INSERT INTO Used_In (resource_ID, tag_ID)
SELECT r.resource_ID, t.tag_ID
FROM Resources r
CROSS JOIN Tags t
WHERE r.name IN ('Teen Crisis Line', 'ConnecTeen')
AND t.name IN ('Crisis Support', 'Crisis Intervention', 'Youth', 'Immediate Help', 'Safety Planning')
ON DUPLICATE KEY UPDATE resource_ID = VALUES(resource_ID);
