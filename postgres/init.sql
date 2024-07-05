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
    CONSTRAINT chk_currentStatus CHECK (currentStatus IN ('pending', 'confirmed', 'checkedin', 'completed'))
);

INSERT INTO person
VALUES (1234567, 'email', 'name', 'school', 'faculty');

-- space 1 will have a booking at that time
INSERT INTO space (id, name, type)
VALUES (1, 'k17', 'room');

INSERT INTO booking (zid, starttime, endtime, spaceid, currentstatus, description)
VALUES (1234567, '2025-06-25T12:00:00Z', '2025-06-25T13:00:00Z', 1, 'confirmed', 'description');

-- space 2 will have a booking half intersecting
INSERT INTO space (id, name, type)
VALUES (2, 'j17', 'room');

INSERT INTO booking (zid, starttime, endtime, spaceid, currentstatus, description)
VALUES (1234567, '2025-06-25T12:30:00Z', '2025-06-25T13:30:00Z', 2, 'confirmed', 'description');

-- space 3 will have a booking encompassing
INSERT INTO space (id, name, type)
VALUES (3, 'l17', 'room');

INSERT INTO booking (zid, starttime, endtime, spaceid, currentstatus, description)
VALUES (1234567, '2025-06-25T11:30:00Z', '2025-06-25T13:30:00Z', 3, 'confirmed', 'description');



