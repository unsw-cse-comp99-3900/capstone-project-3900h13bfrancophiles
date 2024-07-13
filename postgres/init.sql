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
    userGrp       UserGroupEnum NOT NULL,
    image         TEXT
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

create function trg_chk_create_booking_start_future() returns trigger as $$
declare
    now timestamp := CURRENT_TIMESTAMP at time zone 'UTC';
begin
    if new.starttime <= now then
        raise exception 'Booking start time must be in the future';
    end if;

    return new;
end;
$$ language plpgsql;

create trigger trg_chk_create_booking_start_future before insert
on booking for each row execute procedure trg_chk_create_booking_start_future();

create function trg_chk_edit_booking_started() returns trigger as $$
declare
    now timestamp := CURRENT_TIMESTAMP at time zone 'UTC';
begin

    if old.starttime <= now then
        if new.starttime <> old.starttime
            or new.endtime <> old.endtime
            or new.spaceid <> old.spaceid
            or new.description <> old.description then
                raise exception 'Cannot edit booking details other than currentstatus, check-in, and check-out times after the booking has started';
        end if;
    end if;

    return new;
end;
$$ language plpgsql;

create trigger trg_chk_edit_booking_started before update
on booking for each row execute procedure trg_chk_edit_booking_started();

create function trg_chk_start_future_limit() returns trigger as $$
declare
    today timestamp := date_trunc('day', CURRENT_TIMESTAMP at time zone 'UTC');
begin
    if new.starttime > today + interval '14 days' then
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
    'admin',
    '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'
), (
    7654321,
    'z7654321@ad.unsw.edu.au',
    'Franco Reyes',
    'Mr',
    'CSE',
    'ENG',
    'Academic',
    'admin',
    null
);

-- Disable triggers to permit past bookings for testing
ALTER TABLE booking DISABLE TRIGGER trg_chk_create_booking_start_future;
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
    (1234567, '2024-07-12T01:00', '2024-07-12T08:30', 'K-K17-B01', 'confirmed', 'sth'),

-- upcoming bookings
    (1234567, '2024-10-01T10:30', '2024-10-01T11:30', 'K-K17-B01', 'confirmed', 'class'),
    (1234567, '2024-10-02T11:30', '2024-10-02T12:30', 'K-K17-402', 'confirmed', 'studying'),
    (1234567, '2024-10-04T16:30', '2024-10-04T17:30', 'K-K17-402', 'pending', 'meeting'),
    (1234567, '2024-10-05T16:30', '2024-10-05T17:30', 'K-K17-402', 'pending', 'event'),
    (1234567, '2024-10-06T16:30', '2024-10-06T17:30', 'K-K17-402', 'pending', 'studying'),
    (1234567, '2024-10-07T16:30', '2024-10-07T17:30', 'K-K17-402', 'declined', 'workshop');

-- upcoming desk bookings
    (1234567, '2024-10-01T10:30', '2024-10-01T11:30', 'K-K17-301-12', 'confirmed', 'study'),

-- Reenable triggers for prod
ALTER TABLE booking ENABLE TRIGGER trg_chk_create_booking_start_future;
ALTER TABLE booking ENABLE TRIGGER trg_chk_start_future_limit;
