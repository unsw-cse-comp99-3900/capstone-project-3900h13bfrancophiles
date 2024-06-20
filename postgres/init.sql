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
    FOREIGN KEY(zId) REFERENCES person(zId)
);
