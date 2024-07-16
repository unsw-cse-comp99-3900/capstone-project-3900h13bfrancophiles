
-- Disable triggers to permit past bookings for testing
ALTER TABLE booking DISABLE TRIGGER trg_chk_create_booking_start_future;
ALTER TABLE booking DISABLE TRIGGER trg_chk_start_future_limit;

-- hdr student franco reyes
INSERT INTO person VALUES (
    7654321,
    'z7654321@ad.unsw.edu.au',
    'Franco Reyes',
    'Mr',
    'CSE',
    'ENG',
    'Academic',
    'hdr',
    null
);

INSERT INTO booking (zId, startTime, endTime, spaceId, currentStatus, description) VALUES
    -- Admin past bookings
    (1234567, '2024-01-01T11:30', '2024-01-01T12:30', 'K-K17-B01', 'confirmed', 'studying'),
    (1234567, '2024-01-02T11:30', '2024-01-02T12:30', 'K-K17-B01', 'confirmed', 'meeting'),
    (1234567, '2024-01-08T13:30', '2024-01-08T14:30', 'K-K17-301-11', 'confirmed', 'studying'),
    (1234567, '2024-01-09T13:30', '2024-01-09T14:30', 'K-J17-504', 'confirmed', 'class'),
    (1234567, '2024-01-10T13:30', '2024-01-010T14:30', 'K-K17-103', 'confirmed', 'studying'),
    (1234567, '2024-01-11T13:30', '2024-01-011T14:30', 'K-K17-B01', 'confirmed', 'event'),
    (1234567, '2024-01-12T13:30', '2024-01-012T14:30', 'K-K17-501M', 'confirmed', 'studying'),
    (1234567, '2024-01-13T13:30', '2024-01-013T14:30', 'K-K17-B01', 'confirmed', 'workshop'),
    (1234567, '2024-01-14T13:30', '2024-01-014T14:30', 'K-K17-B01', 'confirmed', 'meeting'),

    -- Admin upcoming room bookings
    (1234567, '2024-07-20T10:30', '2024-07-20T11:30', 'K-K17-B01', 'confirmed', 'class'),
    (1234567, '2024-07-21T11:30', '2024-07-21T12:30', 'K-K17-B01', 'confirmed', 'studying'),

    -- Admin upcoming desk bookings
    (1234567, '2024-07-20T03:00', '2024-07-20T05:00', 'K-K17-301-11', 'confirmed', 'studying'),

    --------------------------------------------------------------------------------------------
    -- HDR upcoming room bookings
    (7654321, '2024-07-22T16:30', '2024-07-22T17:30', 'K-K17-402', 'pending', 'meeting'),
    (7654321, '2024-07-23T16:30', '2024-07-23T17:30', 'K-K17-402', 'pending', 'event'),
    (7654321, '2024-07-24T16:30', '2024-07-24T17:30', 'K-K17-402', 'pending', 'studying'),
    (7654321, '2024-07-25T16:30', '2024-07-25T17:30', 'K-K17-402', 'declined', 'workshop'),

    -- HDR upcoming desk bookings
    (7654321, '2024-07-18T03:00', '2024-07-18T05:00', 'K-K17-201-1', 'confirmed', 'doing research'),
    (7654321, '2024-07-19T03:00', '2024-07-19T05:00', 'K-K17-201-2', 'confirmed', 'studying'),
    (7654321, '2024-07-20T03:00', '2024-07-20T05:00', 'K-K17-201-3', 'confirmed', 'doing research'),
    (7654321, '2024-07-21T03:00', '2024-07-21T05:00', 'K-K17-201-1', 'confirmed', 'studying'),
    (7654321, '2024-07-22T03:00', '2024-07-22T05:00', 'K-K17-201-1', 'confirmed', 'doing research'),
    (7654321, '2024-07-23T03:00', '2024-07-23T05:00', 'K-K17-201-3', 'confirmed', 'studying'),
    (7654321, '2024-07-24T03:00', '2024-07-24T05:00', 'K-K17-201-2', 'confirmed', 'doing research'),

    --------------------------------------------------------------------------------------------
    -- DEMO B BOOKINGS
    -- Current bookings- wk 8 thursday 12pm - 4pm SYD time
    (7654321, '2024-07-18T02:00', '2024-07-18T06:00', 'K-K17-402', 'confirmed', 'current booking demo B'),
    (1234567, '2024-07-18T02:00', '2024-07-18T06:00', 'K-J17-504', 'confirmed', 'current booking demo B');


-- Reenable triggers for prod
ALTER TABLE booking ENABLE TRIGGER trg_chk_create_booking_start_future;
ALTER TABLE booking ENABLE TRIGGER trg_chk_start_future_limit;
