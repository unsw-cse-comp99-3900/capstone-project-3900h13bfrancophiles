-- Insert the room data into the space table and the room table
INSERT INTO space (id, name, minReqGrp, minBookGrp) VALUES
    ('K-K17-B01', 'K17 CSE Basement', 'csestaff', 'admin'),
    ('K-K17-B02', 'K17 CSE Basement Board Room', 'csestaff', 'admin'),
    ('K-K17-G01', 'K17 G01', 'hdr', 'admin'),
    ('K-K17-G02', 'K17 G02', 'hdr', 'admin'),
    ('K-K17-103', 'K17 103', 'csestaff', 'admin'),
    ('K-K17-113', 'K17 113', 'csestaff', 'admin'),
    ('K-K17-201B', 'K17 201-B', 'csestaff', 'admin'),
    ('K-K17-302', 'K17 302', 'csestaff', 'admin'),
    ('K-K17-401K', 'K17 401 K', 'csestaff', 'admin'),
    ('K-K17-402', 'K17 402', 'hdr', 'admin'),
    ('K-K17-403', 'K17 403', 'hdr', 'admin'),
    ('K-K17-501M', 'K17 501M', 'csestaff', 'admin'),
    ('K-K17-508', 'K17 508', 'csestaff', 'admin'),
    ('K-J17-504', 'J17 Design Next Studio', 'csestaff', 'admin');

INSERT INTO room (id, capacity, roomNumber, type) VALUES
    ('K-K17-B01', 100, 'B01', 'Seminar Room'),
    ('K-K17-B02', 12, 'B02', 'Meeting Room'),
    ('K-K17-G01', 3, 'G01', 'Consultation Room'),
    ('K-K17-G02', 3, 'G02', 'Consultation Room'),
    ('K-K17-103', 8, '103', 'Meeting Room'),
    ('K-K17-113', 90, '113', 'Seminar Room'),
    ('K-K17-201B', 14, '201B', 'Meeting Room'),
    ('K-K17-302', 15, '302', 'Meeting Room'),
    ('K-K17-401K', 15, '401K', 'Meeting Room'),
    ('K-K17-402', 5, '402', 'Conference Room'),
    ('K-K17-403', 5, '403', 'Conference Room'),
    ('K-K17-501M', 15, '501M', 'Meeting Room'),
    ('K-K17-508', 6, '508', 'Conference Room'),
    ('K-J17-504', 110, '504', 'Seminar Room');

-- temporary person, should be populated with the given spreadsheet
-- this is in data rather than dev_data since it's unusable without people
INSERT INTO person VALUES (
    1234567,
    'z1234567@ad.unsw.edu.au',
    'Umar Farooq',
    'Mr',
    'CSE',
    'ENG',
    'Academic',
    'admin'
);
