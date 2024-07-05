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
    type          TEXT NOT NULL,
    FOREIGN KEY(id) REFERENCES space(id) ON DELETE CASCADE
);

CREATE TYPE BookingStatusEnum AS ENUM (
    'pending', 'confirmed', 'checkedin', 'completed'
);

CREATE TABLE IF NOT EXISTS booking (
    id            SERIAL PRIMARY KEY,
    zId           INT NOT NULL,
    startTime     TIMESTAMP NOT NULL,
    endTime       TIMESTAMP NOT NULL,
    spaceId       TEXT NOT NULL,
    currentStatus BookingStatusEnum NOT NULL,
    description   VARCHAR(255) NOT NULL,
    checkInTime   TIMESTAMP,
    checkOutTime  TIMESTAMP,
    FOREIGN KEY(zId) REFERENCES person(zId),
    FOREIGN KEY(spaceId) REFERENCES space(id),
    CONSTRAINT chk_start_lt_end CHECK (startTime < endTime),
    CONSTRAINT chk_interval_length CHECK (EXTRACT(epoch FROM (endTime - startTime)) % 900 = 0),
    CONSTRAINT chk_interval_bounds CHECK (EXTRACT(minute FROM startTime) % 15 = 0),
    CONSTRAINT chk_same_day CHECK (
        date_trunc('day', startTime AT TIME ZONE 'UTC' AT TIME ZONE 'Australia/Sydney') =
        -- Minus 1 second so ending on midnight is okay
        date_trunc('day', (endTime - interval '1 second') AT TIME ZONE 'UTC' AT TIME ZONE 'Australia/Sydney')
    )
);

create function chk_overlap() returns trigger as $$
begin
    if exists (
        select *
        from booking b
        where b.spaceId = new.spaceId
              and b.starttime < new.endtime
              and b.endtime > new.starttime
    ) then
        raise exception 'Overlapping booking found';
    end if;

    return new;
end;
$$ language plpgsql;

create trigger chk_overlap before insert or update
on booking for each row execute procedure chk_overlap();

-- Insert the room data into the space table and the room table
INSERT INTO space (id, name) VALUES
    ('K-K17-B01', 'K17 CSE Basement'),
    ('K-K17-B02', 'K17 CSE Basement Board Room'),
    ('K-K17-G01', 'K17 G01'),
    ('K-K17-G02', 'K17 G02'),
    ('K-K17-103', 'K17 103'),
    ('K-K17-113', 'K17 113'),
    ('K-K17-201B', 'K17 201-B'),
    ('K-K17-302', 'K17 302'),
    ('K-K17-401K', 'K17 401 K'),
    ('K-K17-402', 'K17 402'),
    ('K-K17-403', 'K17 403'),
    ('K-K17-501M', 'K17 501M'),
    ('K-K17-508', 'K17 508'),
    ('K-J17-504', 'J17 Design Next Studio');

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
INSERT INTO person VALUES (1234567, 'email', 'name', 'school', 'faculty');