-- CONFIGURATION TABLE--
CREATE TABLE IF NOT EXISTS config (
    key             TEXT PRIMARY KEY,
    value           TEXT NOT NULL,
    description     TEXT NOT NULL
);

-- Insert default configuration options
INSERT INTO config (key, value, description) VALUES
    ('global-email', 'false', 'Enable or disable email sending at a global level, for all users.'),
    ('booking-interval', '15', 'The size unit (and hour offset multiple) of bookings in minutes.'),
    ('booking-future-limit', '14', 'The number of days in the future bookings can be made.');

CREATE FUNCTION enforce_required_keys() RETURNS TRIGGER AS $$
DECLARE
    missing_key TEXT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM config WHERE key = 'global-email') THEN
        missing_key := 'global-email';
    ELSIF NOT EXISTS (SELECT 1 FROM config WHERE key = 'booking-interval') THEN
        missing_key := 'booking-interval';
    ELSIF NOT EXISTS (SELECT 1 FROM config WHERE key = 'booking-future-limit') THEN
        missing_key := 'booking-future-limit';
    END IF;

    IF missing_key IS NOT NULL THEN
        RAISE EXCEPTION 'Missing required configuration key: %', missing_key;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_required_keys
BEFORE INSERT OR UPDATE ON config
FOR EACH ROW
EXECUTE FUNCTION enforce_required_keys();

CREATE OR REPLACE FUNCTION get_booking_interval() RETURNS INT AS $$
DECLARE
    booking_interval INT;
BEGIN
    SELECT value::INT INTO booking_interval
    FROM config
    WHERE key = 'booking-interval';

    RETURN booking_interval;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_booking_future_limit() RETURNS INT AS $$
DECLARE
    booking_future_limit INT;
BEGIN
    SELECT value::INT INTO booking_future_limit
    FROM config
    WHERE key = 'booking-future-limit';

    RETURN booking_future_limit;
END;
$$ LANGUAGE plpgsql;
-- CONFIGURATION TABLE--

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
    CONSTRAINT chk_interval_length CHECK (EXTRACT(epoch FROM (endTime - startTime)) % (get_booking_interval() * 60) = 0),
    CONSTRAINT chk_interval_bounds CHECK (EXTRACT(minute FROM startTime) % get_booking_interval()  = 0),
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
              and b.currentStatus <> 'deleted'
              and b.id != new.id
    ) then
        RAISE EXCEPTION 'Overlapping booking found';
    end if;

    return new;
end;
$$ language plpgsql;

create trigger trg_chk_overlap before insert or update
on booking for each row execute procedure trg_chk_overlap();

create function trg_chk_create_booking_start_future() returns trigger as $$
begin
    if new.starttime <= get_now() then
        RAISE EXCEPTION 'Booking start time must be in the future';
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
                RAISE EXCEPTION 'Cannot edit booking details other than currentstatus, check-in, and check-out times after the booking has started';
        end if;
    end if;

    return new;
end;
$$ language plpgsql;

create function trg_chk_start_future_limit() returns trigger as $$
declare
    today timestamp := date_trunc('day', get_now());
    future_limit INT := get_booking_future_limit();
begin
    if new.starttime > today + (future_limit || ' days')::INTERVAL then
        RAISE EXCEPTION 'Booking start time cannot be more than % days in the future', future_limit;
    end if;

    return new;
end;
$$ language plpgsql;

create trigger trg_chk_start_future_limit before insert or update
on booking for each row execute procedure trg_chk_start_future_limit();
