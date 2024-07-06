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
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    type          TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS hotdesk (
    id            TEXT PRIMARY KEY,
    floor         TEXT NOT NULL,
    room          TEXT NOT NULL,
    deskNumber    INTEGER NOT NULL,
    FOREIGN KEY(id) REFERENCES space(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS room (
    id            TEXT PRIMARY KEY,
    capacity      INTEGER NOT NULL,
    roomNumber    TEXT NOT NULL,
    usage         TEXT NOT NULL,
    FOREIGN KEY(id) REFERENCES space(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS booking (
    id            SERIAL PRIMARY KEY,
    zId           INT NOT NULL,
    startTime     TIMESTAMP NOT NULL,
    endTime       TIMESTAMP NOT NULL,
    spaceId       TEXT NOT NULL,
    currentStatus TEXT NOT NULL,
    description   TEXT NOT NULL,
    checkInTime   TIMESTAMP,
    checkOutTime  TIMESTAMP,
    FOREIGN KEY(zId) REFERENCES person(zId),
    FOREIGN KEY(spaceId) REFERENCES space(id),
    CONSTRAINT chk_currentStatus CHECK (currentStatus IN ('Pending', 'Accepted', 'Declined', 'checkedin', 'completed'))
);

-- Insert the room data into the space table and the room table
INSERT INTO space (id, name, type) VALUES
    (1, 'K17 CSE Basement', 'Seminar Room'),
    (2, 'K17 CSE Basement Board Room', 'Meeting Room'),
    (3, 'K17 G01', 'Consultation Room'),
    (4, 'K17 G02', 'Consultation Room'),
    (5, 'K17 103', 'Meeting Room'),
    (6, 'K17 113', 'Seminar Room'),
    (7, 'K17 201-B', 'Meeting Room'),
    (8, 'K17 302', 'Meeting Room'),
    (9, 'K17 401 K', 'Meeting Room'),
    (10, 'K17 402', 'Conference Room'),
    (11, 'K17 403', 'Conference Room'),
    (12, 'K17 501M', 'Meeting Room'),
    (13, 'K17 508', 'Conference Room'),
    (14, 'J17 Design Next Studio', 'Seminar Room');

INSERT INTO room (id, capacity, roomNumber, usage) VALUES
    (1, 100, 'CSE Basement', 'CSE staff'),
    (2, 12, 'CSE Basement Board Room', 'CSE staff'),
    (3, 3, 'G01', 'HDR students and CSE staff'),
    (4, 3, 'G02', 'HDR students and CSE staff'),
    (5, 8, '103', 'CSE staff'),
    (6, 90, '113', 'CSE staff'),
    (7, 14, '201-B', 'CSE staff'),
    (8, 15, '302', 'CSE staff'),
    (9, 15, '401 K', 'CSE staff'),
    (10, 5, '402', 'HDR students and CSE staff'),
    (11, 5, '403', 'HDR students and CSE staff'),
    (12, 15, '501M', 'CSE staff'),
    (13, 6, '508', 'CSE staff'),
    (14, 110, 'Design Next Studio', 'CSE staff');

INSERT INTO person (zId, email, fullname, school, faculty) VALUES
    (1111111, 'z1111111@ad.unsw.edu.au', 'Bob Smith', 'UNSW', 'CSE');

INSERT INTO booking (id, zId, startTime, endTime, spaceId, currentStatus, description) VALUES
    (1, 1111111, '2022-01-01T10:30:00', '2022-01-01T10:30:00', 1, 'Accepted', 'studying'),
    (2, 1111111, '2022-01-01T10:30:00', '2022-01-01T10:30:00', 2, 'Accepted', 'studying'),
    (3, 1111111, '2022-01-01T10:30:00', '2022-01-01T10:30:00', 3, 'Accepted', 'studying'),
    (4, 1111111, '2022-01-01T10:30:00', '2022-01-01T10:30:00', 4, 'Accepted', 'studying'),
    (5, 1111111, '2025-01-01T10:30:00', '2025-01-01T10:30:00', 5, 'Accepted', 'studying'),
    (6, 1111111, '2025-01-01T10:30:00', '2025-01-01T10:30:00', 1, 'Accepted', 'studying'),
    (7, 1111111, '2025-01-01T10:30:00', '2025-01-01T10:30:00', 2, 'Accepted', 'studying'),
    (9, 1111111, '2025-01-01T10:30:00', '2025-01-01T10:30:00', 3, 'Accepted', 'studying'),
    (10, 1111111, '2024-01-01T10:30:00', '2025-01-01T10:30:00', 2, 'Accepted', 'studying');