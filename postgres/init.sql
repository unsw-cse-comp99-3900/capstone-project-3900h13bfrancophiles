CREATE TABLE IF NOT EXISTS space (
    id SERIAL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS hotdesk (
    id         SERIAL PRIMARY KEY,
    floor      INTEGER NOT NULL,
    deskNumber INTEGER NOT NULL,
    CONSTRAINT fk_space_id
      FOREIGN KEY(id)
        REFERENCES space(id)
);

CREATE TABLE IF NOT EXISTS room (
    id         SERIAL PRIMARY KEY,
    capacity   INTEGER NOT NULL,
    roomNumber INTEGER NOT NULL,
    usage      INTEGER NOT NULL,
    CONSTRAINT fk_space_id
      FOREIGN KEY(id)
        REFERENCES space(id)
);

CREATE TABLE IF NOT EXISTS booking (
    id         SERIAL PRIMARY KEY,
    startTime  TIMESTAMP NOT NULL,
    endTime    TIMESTAMP NOT NULL,
    space_id   INTEGER NOT NULL,
    CONSTRAINT fk_space_id
      FOREIGN KEY(space_id)
        REFERENCES space(id)
);
