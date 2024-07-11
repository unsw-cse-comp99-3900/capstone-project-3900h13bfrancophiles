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
declare
    now timestamp := CURRENT_TIMESTAMP at time zone 'UTC';
begin
    if new.starttime <= now then
        raise exception 'Booking start time must be in the future';
    end if;

    if old.starttime <= now then
        raise exception 'Cannot edit a booking that has already started';
    end if;

    return new;
end;
$$ language plpgsql;

create trigger trg_chk_start_future before insert or update
on booking for each row execute procedure trg_chk_start_future();

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
