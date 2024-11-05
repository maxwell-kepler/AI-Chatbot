USE `mental_health_support`;

INSERT INTO users (
    user_id, 
    email, 
    password_hash,
    username,
    first_name,
    last_name
) VALUES (
    UUID(),
    'test@example.com',
    '$2b$10$ExampleHashedPassword',
    'testuser',
    'Test',
    'User'
);

INSERT INTO categories (name, icon) VALUES
	('Crisis Support', 'alert-circle'),
	('Counseling', 'message-circle'),
	('Support Groups', 'users'),
	('Mental Health', 'heart'),
	('Addiction', 'help-circle'),
	('Youth Services', 'smile');

INSERT INTO tags (name) VALUES
	('Free'), ('Confidential'), ('Crisis Support'), ('Sliding Scale'),
	('Professional'), ('Multiple Languages'), ('Youth'), ('Family Services'),
	('Referrals'), ('Assessment'), ('Education'), ('Recovery'), ('Residential'),
	('Walk-in'), ('Family'), ('No Appointment'), ('Women'), ('Immigrant Services'),
	('Counselling'), ('Addiction'), ('Shelter'), ('Outreach'), ('Treatment'),
	('Therapy');

INSERT INTO resources (id, name, description, category_id, phone, address, hours, website) VALUES
(1, 'Distress Centre Calgary', '24/7 crisis support, professional counselling and referrals.', 
    (SELECT id FROM categories WHERE name = 'Crisis Support'),
    '403-266-4357', 'Calgary, AB', '24/7', 'https://www.distresscentre.com'),
(2, 'Calgary Counselling Centre', 'Professional counselling services with sliding scale fees.',
    (SELECT id FROM categories WHERE name = 'Counseling'),
    '403-691-5991', '1000 6 Ave SW, Calgary, AB T2P 0W3', 'Mon-Fri: 8:30AM-5:00PM', 'https://calgarycounselling.com'),
(3, 'Woods Homes', 'Crisis support and counselling services for youth and families.',
    (SELECT id FROM categories WHERE name = 'Youth Services'),
    '403-299-9699', '805 37 St NW, Calgary, AB T2N 4N8', '24/7', 'https://www.woodshomes.ca'),
(4, 'Access Mental Health', 'Central access point for mental health services in Calgary.',
    (SELECT id FROM categories WHERE name = 'Mental Health'),
    '403-943-1500', 'Calgary, AB', 'Mon-Fri: 8:00AM-5:00PM', 'https://www.albertahealthservices.ca'),
(5, 'CMHA Calgary', 'Mental health education, support groups, and recovery programs.',
    (SELECT id FROM categories WHERE name = 'Support Groups'),
    '403-297-1700', '400, 105 12 Ave SE, Calgary, AB T2G 1A1', 'Mon-Fri: 9:00AM-4:30PM', 'https://calgary.cmha.ca'),
(6, 'Fresh Start Recovery Centre', 'Comprehensive addiction treatment and recovery programs.',
    (SELECT id FROM categories WHERE name = 'Addiction'),
    '403-387-6266', '411 41 Ave NE, Calgary, AB T2E 2N4', '24/7', 'https://www.freshstartrecovery.ca'),
(7, 'Eastside Family Centre', 'Walk-in counselling services for individuals and families.',
    (SELECT id FROM categories WHERE name = 'Counseling'),
    '403-299-9696', '255, 495 36 St NE, Calgary, AB T2A 6K3', 'Mon-Thu: 11:00AM-7:00PM, Fri: 11:00AM-6:00PM', 'https://www.woodshomes.ca/programs/eastside-family-centre'),
(8, 'Calgary Immigrant Women''s Association', 'Mental health support and counselling for immigrant women.',
    (SELECT id FROM categories WHERE name = 'Support Groups'),
    '403-263-4414', '138, 4th Ave SE, Calgary, AB T2G 4Z6', 'Mon-Fri: 9:00AM-4:00PM', 'https://www.ciwa-online.com'),
(9, 'Alpha House Society', 'Support for individuals affected by alcohol and drug dependencies.',
    (SELECT id FROM categories WHERE name = 'Addiction'),
    '403-234-7388', '203 15 Ave SE, Calgary, AB T2G 1G4', '24/7', 'https://alphahousecalgary.com'),
(10, 'Hull Services', 'Mental health services for children, youth and families.',
    (SELECT id FROM categories WHERE name = 'Youth Services'),
    '403-251-8000', '2266 Woodpark Ave SW, Calgary, AB T2W 2Y9', 'Mon-Fri: 8:30AM-4:30PM', 'https://www.hullservices.ca'),
(11, 'Carya Therapy Services', 'Counselling and therapy services for individuals and families.',
    (SELECT id FROM categories WHERE name = 'Counseling'),
    '403-269-9888', '200, 1000 8 Ave SW, Calgary, AB T2P 3M7', 'Mon-Thu: 8:30AM-8:00PM, Fri: 8:30AM-4:30PM', 'https://caryacalgary.ca'),
(12, 'ConnecTeen', 'Crisis support and resources specifically for teens.',
    (SELECT id FROM categories WHERE name = 'Crisis Support'),
    '403-264-8336', 'Calgary, AB', '24/7', 'https://www.distresscentre.com/connectteen');

INSERT INTO resource_tags (resource_id, tag_id)
SELECT 1, id FROM tags WHERE name IN ('Free', 'Confidential', 'Crisis Support');

INSERT INTO resource_tags (resource_id, tag_id)
SELECT 2, id FROM tags WHERE name IN ('Sliding Scale', 'Professional', 'Multiple Languages');

INSERT INTO resource_tags (resource_id, tag_id)
SELECT 3, id FROM tags WHERE name IN ('Youth', 'Crisis Support', 'Family Services');

INSERT INTO resource_tags (resource_id, tag_id)
SELECT 4, id FROM tags WHERE name IN ('Free', 'Referrals', 'Assessment');

INSERT INTO resource_tags (resource_id, tag_id)
SELECT 5, id FROM tags WHERE name IN ('Support Groups', 'Education', 'Recovery');

INSERT INTO resource_tags (resource_id, tag_id)
SELECT 6, id FROM tags WHERE name IN ('Addiction', 'Recovery', 'Residential');

INSERT INTO resource_tags (resource_id, tag_id)
SELECT 7, id FROM tags WHERE name IN ('Walk-in', 'Family', 'No Appointment');

INSERT INTO resource_tags (resource_id, tag_id)
SELECT 8, id FROM tags WHERE name IN ('Women', 'Immigrant Services', 'Counselling');

INSERT INTO resource_tags (resource_id, tag_id)
SELECT 9, id FROM tags WHERE name IN ('Addiction', 'Shelter', 'Outreach');

INSERT INTO resource_tags (resource_id, tag_id)
SELECT 10, id FROM tags WHERE name IN ('Youth', 'Family', 'Treatment');

INSERT INTO resource_tags (resource_id, tag_id)
SELECT 11, id FROM tags WHERE name IN ('Therapy', 'Family', 'Sliding Scale');

INSERT INTO resource_tags (resource_id, tag_id)
SELECT 12, id FROM tags WHERE name IN ('Youth', 'Crisis Support', 'Confidential');

SELECT * FROM users;
SELECT * FROM categories;
SELECT * FROM tags;
SELECT * FROM resources;
SELECT * FROM resource_tags;
