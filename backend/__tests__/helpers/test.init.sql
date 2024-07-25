
-- create a bunch of dummy static data to be used in all tests
-- bookings (and nothing else) will be created by the tests
-- if u change any of this data, make sure to change the constants.ts file

-- 2 ppl for each user level
INSERT INTO person(zid, email, fullname, title, school, faculty, role, usergrp)
VALUES (1111111, 'admin1@email.com', 'Admin One', 'Mr', 'CSE', 'ENG', 'Professional', 'admin'),
       (2222222, 'admin2@email.com', 'Admin Two', 'Ms', 'CSE', 'ENG', 'Professional', 'admin'),
       (3333333, 'staff1@email.com', 'Staff One', 'Mr', 'CSE', 'ENG', 'Academic', 'csestaff'),
       (4444444, 'staff2@email.com', 'Staff Two', 'Ms', 'CSE', 'ENG', 'Academic', 'csestaff'),
       (5555555, 'hdr1@email.com', 'Hdr One', 'Mr', 'CSE', 'ENG', 'PhD', 'hdr'),
       (6666666, 'hdr2@email.com', 'Hdr Two', 'Ms', 'CSE', 'ENG', 'MRes', 'hdr'),
       (7777777, 'other1@email.com', 'Other One', 'Mr', 'CSE', 'ENG', null, 'other'),
       (8888888, 'other2@email.com', 'Other Two', 'Ms', 'MECH', 'ENG', null, 'other');

-- 2 rooms and 2 desks - different combinations of min grps
INSERT INTO space(id, name, minreqgrp, minbookgrp)
VALUES ('K-K17-111', 'Room 1', 'hdr', 'admin'),
       ('K-K17-222', 'Room 2', 'csestaff', 'csestaff'),
       ('K-K17-333-1', 'Desk 1', 'hdr', 'hdr'),
       ('K-K17-444-1', 'Desk 2', 'csestaff', 'admin');

INSERT INTO room(id, capacity, roomnumber, type)
VALUES ('K-K17-111', 5, '111', 'Meeting Room'),
       ('K-K17-222', 100, '222', 'Seminar Room');

INSERT INTO hotdesk(id, floor, xcoord, ycoord)
VALUES ('K-K17-333-1', 'K17 L3', 30, 30),
       ('K-K17-444-1', 'K17 L4', 40, 40);
