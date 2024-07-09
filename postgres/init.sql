CREATE TYPE UserGroupEnum AS ENUM (
    'other', 'hdr', 'csestaff', 'admin'
);

CREATE TABLE IF NOT EXISTS person (
    zId           INT PRIMARY KEY,
    email         TEXT NOT NULL,
    fullname      TEXT NOT NULL,
    title         TEXT,
    school        TEXT NOT NULL,
    faculty       TEXT NOT NULL,
    role          TEXT, -- eg Academic, Professional, PhD, MRes
    userGrp       UserGroupEnum NOT NULL
);

CREATE TABLE IF NOT EXISTS space (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    minReqGrp     UserGroupEnum NOT NULL, -- lowest group that can request
    minBookGrp    UserGroupEnum NOT NULL, -- lowest group that can book
    CONSTRAINT chk_id_fmt CHECK (id ~ '^[A-Z]+-[A-Z]+[0-9]+-[A-Za-z0-9]+(-\d+)?$')
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
    'pending', 'confirmed', 'declined', 'checkedin', 'completed'
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

create function trg_chk_overlap() returns trigger as $$
begin
    if exists (
        select *
        from booking b
        where b.spaceId = new.spaceId
              and b.starttime < new.endtime
              and b.endtime > new.starttime
              and b.currentStatus <> 'pending'
              and b.currentStatus <> 'declined'
              and b.id != new.id
    ) then
        raise exception 'Overlapping booking found';
    end if;

    return new;
end;
$$ language plpgsql;

create trigger trg_chk_overlap before insert or update
on booking for each row execute procedure trg_chk_overlap();

create function trg_chk_start_future() returns trigger as $$
begin
    if new.starttime <= CURRENT_TIMESTAMP then
        raise exception 'Booking start time must be in the future';
    end if;

    if old.starttime <= CURRENT_TIMESTAMP then
        raise exception 'Cannot edit a booking that has already started';
    end if;

    return new;
END;
$$ LANGUAGE plpgsql;

create trigger trg_chk_start_future before insert or update
on booking for each row execute procedure trg_chk_start_future();

create function trg_chk_start_future_limit() returns trigger as $$
begin
    if new.starttime > current_timestamp + interval '14 days' then
        raise exception 'Booking start time cannot be more than 14 days in the future';
    end if;

    return new;
end;
$$ language plpgsql;

create trigger trg_chk_start_future_limit before insert or update
on booking for each row execute procedure trg_chk_start_future_limit();

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
