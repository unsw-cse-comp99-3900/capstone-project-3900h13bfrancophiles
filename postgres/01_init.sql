-- store configuration values that can be changed at runtime
CREATE TABLE IF NOT EXISTS config (
    key     TEXT PRIMARY KEY,
    value   TEXT
);

CREATE OR REPLACE FUNCTION get_now() RETURNS TIMESTAMP AS $$
SELECT COALESCE(
    (SELECT value::TIMESTAMP FROM config WHERE key = 'current_timestamp'),
    CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
);
$$ LANGUAGE SQL;

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
    xCoord        REAL NOT NULL,
    yCoord        REAL NOT NULL,
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
    'pending', 'confirmed', 'declined', 'checkedin', 'completed', 'deleted'
);

CREATE TABLE IF NOT EXISTS booking (
    id              SERIAL PRIMARY KEY,
    zId             INT NOT NULL,
    startTime       TIMESTAMP NOT NULL,
    endTime         TIMESTAMP NOT NULL,
    spaceId         TEXT NOT NULL,
    currentStatus   BookingStatusEnum NOT NULL,
    description     VARCHAR(255) NOT NULL,
    checkInTime     TIMESTAMP,
    checkOutTime    TIMESTAMP,
    created         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

CREATE OR REPLACE FUNCTION set_timestamp_log()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        NEW.created = CURRENT_TIMESTAMP;
        NEW.modified = CURRENT_TIMESTAMP;
    ELSIF (TG_OP = 'UPDATE') THEN
        NEW.created = OLD.created;
        NEW.modified = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_log_before_insert
BEFORE INSERT ON booking FOR EACH ROW EXECUTE FUNCTION set_timestamp_log();

CREATE TRIGGER set_timestamp_log_before_update
BEFORE UPDATE ON booking FOR EACH ROW EXECUTE FUNCTION set_timestamp_log();

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
              and b.currentStatus <> 'deleted'
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
begin
    if new.starttime <= get_now() then
        raise exception 'Booking start time must be in the future';
    end if;

    return new;
end;
$$ language plpgsql;

create trigger trg_chk_create_booking_start_future before insert
on booking for each row execute procedure trg_chk_create_booking_start_future();

create function trg_chk_edit_booking_started() returns trigger as $$
begin
    if old.starttime <= get_now() then
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

create trigger trg_chk_edit_booking_started before insert or update
on booking for each row execute procedure trg_chk_edit_booking_started();

create function trg_chk_start_future_limit() returns trigger as $$
declare
    today timestamp := date_trunc('day', get_now());
begin
    if new.starttime > today + interval '14 days' then
        raise exception 'Booking start time cannot be more than 14 days in the future';
    end if;

    return new;
end;
$$ language plpgsql;

create trigger trg_chk_start_future_limit before insert or update
on booking for each row execute procedure trg_chk_start_future_limit();
