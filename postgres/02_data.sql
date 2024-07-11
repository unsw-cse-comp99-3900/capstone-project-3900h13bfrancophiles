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

-- temporary person
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

-- Disable triggers to permit past bookings for testing
ALTER TABLE booking DISABLE TRIGGER trg_chk_start_future;
ALTER TABLE booking DISABLE TRIGGER trg_chk_start_future_limit;

INSERT INTO booking (zId, startTime, endTime, spaceId, currentStatus, description) VALUES
    -- past bookings
    (1234567, '2022-01-01T10:30', '2022-01-01T11:30', 'K-K17-B01', 'confirmed', 'studying'),
    (1234567, '2022-01-02T11:30', '2022-01-02T12:30', 'K-K17-B01', 'confirmed', 'studying1'),
    (1234567, '2022-01-04T13:30', '2022-01-04T14:30', 'K-K17-B01', 'declined', 'studying2'),
    (1234567, '2022-01-06T13:30', '2022-01-06T14:30', 'K-K17-B01', 'declined', 'meeting'),
    (1234567, '2022-01-08T13:30', '2022-01-08T14:30', 'K-K17-B01', 'confirmed', 'studying'),
    (1234567, '2022-01-09T13:30', '2022-01-09T14:30', 'K-K17-B01', 'confirmed', 'class'),
    (1234567, '2022-01-10T13:30', '2022-01-010T14:30', 'K-K17-B01', 'confirmed', 'studying'),
    (1234567, '2022-01-11T13:30', '2022-01-011T14:30', 'K-K17-B01', 'confirmed', 'event'),
    (1234567, '2022-01-12T13:30', '2022-01-012T14:30', 'K-K17-B01', 'confirmed', 'studying'),
    (1234567, '2022-01-13T13:30', '2022-01-013T14:30', 'K-K17-B01', 'confirmed', 'workshop'),
    (1234567, '2022-01-14T13:30', '2022-01-014T14:30', 'K-K17-B01', 'confirmed', 'sth'),

    -- upcoming bookings
    (1234567, '2024-10-01T10:30', '2024-10-01T11:30', 'K-K17-B01', 'confirmed', 'class'),
    (1234567, '2024-10-02T11:30', '2024-10-02T12:30', 'K-K17-402', 'confirmed', 'studying'),
    (1234567, '2024-10-04T16:30', '2024-10-04T17:30', 'K-K17-402', 'pending', 'meeting'),
    (1234567, '2024-10-05T16:30', '2024-10-05T17:30', 'K-K17-402', 'pending', 'event'),
    (1234567, '2024-10-06T16:30', '2024-10-06T17:30', 'K-K17-402', 'pending', 'studying'),
    (1234567, '2024-10-07T16:30', '2024-10-07T17:30', 'K-K17-402', 'declined', 'workshop');

-- Reenable triggers for prod
ALTER TABLE booking ENABLE TRIGGER trg_chk_start_future;
ALTER TABLE booking ENABLE TRIGGER trg_chk_start_future_limit;