CREATE TABLE IF NOT EXISTS space (
    id SERIAL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS hotdesk (
    id         SERIAL PRIMARY KEY,
    floor      INTEGER NOT NULL,
    deskNumber INTEGER NOT NULL,
    CONSTRAINT fk_spaceId
      FOREIGN KEY(id)
        REFERENCES space(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS room (
    id         SERIAL PRIMARY KEY,
    capacity   INTEGER NOT NULL,
    roomNumber INTEGER NOT NULL,
    usage      INTEGER NOT NULL,
    CONSTRAINT fk_spaceId
      FOREIGN KEY(id)
        REFERENCES space(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS booking (
    id         SERIAL PRIMARY KEY,
    startTime  TIMESTAMP NOT NULL,
    endTime    TIMESTAMP NOT NULL,
    spaceId   INTEGER NOT NULL,
    CONSTRAINT fk_spaceId
      FOREIGN KEY(spaceId)
        REFERENCES space(id)
        ON DELETE CASCADE
);
