CREATE TABLE IF NOT EXISTS person (
    zId           INT PRIMARY KEY,
    email         TEXT NOT NULL,
    fullname      TEXT NOT NULL,
    school        TEXT NOT NULL,
    faculty       TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS staff (
    zId           INT PRIMARY KEY,
    isAdmin       BOOLEAN,
    FOREIGN KEY(zId) REFERENCES person(zId)
);

CREATE TABLE IF NOT EXISTS hdr (
    zId           INT PRIMARY KEY,
    degree        TEXT,
    FOREIGN KEY(zId) REFERENCES person(zId)
);

CREATE TABLE IF NOT EXISTS space (
    id            SERIAL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS hotdesk (
    id            SERIAL PRIMARY KEY,
    floor         INTEGER NOT NULL,
    room          INTEGER NOT NULL,
    deskNumber    INTEGER NOT NULL,
    FOREIGN KEY(id) REFERENCES space(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS room (
    id            SERIAL PRIMARY KEY,
    capacity      INTEGER NOT NULL,
    roomNumber    INTEGER NOT NULL,
    usage         INTEGER NOT NULL,
    FOREIGN KEY(id) REFERENCES space(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS booking (
    id            SERIAL PRIMARY KEY,
    zId           INT NOT NULL,
    startTime     TIMESTAMP NOT NULL,
    endTime       TIMESTAMP NOT NULL,
    spaceId       INTEGER NOT NULL,
    currentStatus TEXT NOT NULL,
    FOREIGN KEY(zId) REFERENCES person(zId),
    FOREIGN KEY(spaceId) REFERENCES space(id)
);

-- Insert test data into person table
INSERT INTO person (zId, email, fullname, school, faculty) VALUES
(1234567, 'user1@example.com', 'User One', 'School A', 'Faculty X'),
(2, 'user2@example.com', 'User Two', 'School B', 'Faculty Y'),
(3, 'user3@example.com', 'User Three', 'School C', 'Faculty Z');

-- Insert test data into staff table
INSERT INTO staff (zId, isAdmin) VALUES
(1234567, TRUE),
(2, FALSE);

-- Insert test data into hdr table
INSERT INTO hdr (zId, degree) VALUES
(3, 'PhD in Computer Science');

-- Insert test data into space table
INSERT INTO space (id) VALUES
(DEFAULT), (DEFAULT), (DEFAULT), (DEFAULT), (DEFAULT), (DEFAULT), (DEFAULT), (DEFAULT), (DEFAULT), (DEFAULT);

-- Insert test data into hotdesk table
INSERT INTO hotdesk (id, floor, room, deskNumber) VALUES
(1, 1, 101, 1),
(2, 1, 101, 2),
(3, 2, 201, 1),
(4, 2, 201, 2);

-- Insert test data into room table
INSERT INTO room (id, capacity, roomNumber, usage) VALUES
(5, 10, 102, 1),
(6, 15, 202, 2),
(7, 20, 302, 1),
(8, 25, 402, 2);

-- Insert test data into booking table
INSERT INTO booking (zId, startTime, endTime, spaceId, currentStatus) VALUES
(1234567, '2024-06-01T09:00:00.000Z', '2024-06-01T10:00:00.000Z', 1, 'completed'),
(1234567, '2024-06-02T11:00:00.000Z', '2024-06-02T12:00:00.000Z', 2, 'completed'),
(1234567, '2024-06-03T13:00:00.000Z', '2024-06-03T14:00:00.000Z', 3, 'completed'),
(1234567, '2024-06-04T15:00:00.000Z', '2024-06-04T16:00:00.000Z', 4, 'completed'),
(1234567, '2024-06-05T17:00:00.000Z', '2024-06-05T18:00:00.000Z', 5, 'completed'),
(1234567, '2024-06-06T09:00:00.000Z', '2024-06-06T10:00:00.000Z', 6, 'completed'),
(1234567, '2024-06-07T11:00:00.000Z', '2024-06-07T12:00:00.000Z', 7, 'completed'),
(1234567, '2024-06-08T13:00:00.000Z', '2024-06-08T14:00:00.000Z', 8, 'completed'),
(1234567, '2024-06-09T15:00:00.000Z', '2024-06-09T16:00:00.000Z', 9, 'completed'),
(1234567, '2024-06-10T17:00:00.000Z', '2024-06-10T18:00:00.000Z', 10, 'completed'),
(1234567, '2024-06-11T09:00:00.000Z', '2024-06-11T10:00:00.000Z', 1, 'completed'),
(1234567, '2024-06-12T11:00:00.000Z', '2024-06-12T12:00:00.000Z', 2, 'completed'),
(1234567, '2024-06-13T13:00:00.000Z', '2024-06-13T14:00:00.000Z', 3, 'completed'),
(1234567, '2024-06-14T15:00:00.000Z', '2024-06-14T16:00:00.000Z', 4, 'completed'),
(1234567, '2024-06-15T17:00:00.000Z', '2024-06-15T18:00:00.000Z', 5, 'completed'),
(1234567, '2024-06-16T09:00:00.000Z', '2024-06-16T10:00:00.000Z', 6, 'completed'),
(1234567, '2024-06-17T11:00:00.000Z', '2024-06-17T12:00:00.000Z', 7, 'completed'),
(1234567, '2024-06-18T13:00:00.000Z', '2024-06-18T14:00:00.000Z', 8, 'completed'),
(1234567, '2024-06-19T15:00:00.000Z', '2024-06-19T16:00:00.000Z', 9, 'completed'),
(1234567, '2024-06-20T17:00:00.000Z', '2024-06-20T18:00:00.000Z', 10, 'completed'),
(1234567, '2024-06-21T09:00:00.000Z', '2024-06-21T10:00:00.000Z', 1, 'completed'),
(1234567, '2024-06-22T11:00:00.000Z', '2024-06-22T12:00:00.000Z', 2, 'completed'),
(1234567, '2024-06-23T13:00:00.000Z', '2024-06-23T14:00:00.000Z', 3, 'completed'),
(1234567, '2024-06-24T15:00:00.000Z', '2024-06-24T16:00:00.000Z', 4, 'completed'),
(1234567, '2024-06-25T17:00:00.000Z', '2024-06-25T18:00:00.000Z', 5, 'completed'),
(1234567, '2024-06-26T09:00:00.000Z', '2024-06-26T10:00:00.000Z', 6, 'completed'),
(1234567, '2024-06-27T11:00:00.000Z', '2024-06-27T12:00:00.000Z', 7, 'completed'),
(1234567, '2024-06-20T13:00:00.000Z', '2024-06-28T14:00:00.000Z', 8, 'completed'),
(1234567, '2024-06-29T15:00:00.000Z', '2024-06-29T16:00:00.000Z', 9, 'completed'),
(1234567, '2024-06-30T17:00:00.000Z', '2024-06-30T18:00:00.000Z', 10, 'completed');
