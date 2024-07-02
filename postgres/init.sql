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
    name          TEXT NOT NULL
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
    FOREIGN KEY(zId) REFERENCES person(zId),
    FOREIGN KEY(spaceId) REFERENCES space(id)
);

-- Insert the room data into the space table and the room table
INSERT INTO space (id, name) VALUES
    ('K17-LG-100', 'K17 CSE Basement'),
    ('K17-LG-12', 'K17 CSE Basement Board Room'),
    ('K17-G-3-1', 'K17 G01'),
    ('K17-G-3-2', 'K17 G02'),
    ('K17-1-8', 'K17 103'),
    ('K17-1-90', 'K17 113'),
    ('K17-2-14', 'K17 201-B'),
    ('K17-3-15', 'K17 302'),
    ('K17-4-15', 'K17 401 K'),
    ('K17-4-5-1', 'K17 402'),
    ('K17-4-5-2', 'K17 403'),
    ('K17-5-15', 'K17 501M'),
    ('K17-5-6', 'K17 508'),
    ('J17-5-110', 'J17 Design Next Studio');

INSERT INTO room (id, capacity, roomNumber, usage) VALUES
    ('K17-LG-100', 100, 'CSE Basement', 'CSE staff'),
    ('K17-LG-12', 12, 'CSE Basement Board Room', 'CSE staff'),
    ('K17-G-3-1', 3, 'G01', 'HDR students and CSE staff'),
    ('K17-G-3-2', 3, 'G02', 'HDR students and CSE staff'),
    ('K17-1-8', 8, '103', 'CSE staff'),
    ('K17-1-90', 90, '113', 'CSE staff'),
    ('K17-2-14', 14, '201-B', 'CSE staff'),
    ('K17-3-15', 15, '302', 'CSE staff'),
    ('K17-4-15', 15, '401 K', 'CSE staff'),
    ('K17-4-5-1', 5, '402', 'HDR students and CSE staff'),
    ('K17-4-5-2', 5, '403', 'HDR students and CSE staff'),
    ('K17-5-15', 15, '501M', 'CSE staff'),
    ('K17-5-6', 6, '508', 'CSE staff'),
    ('J17-5-110', 110, 'Design Next Studio', 'CSE staff');
