
-- Disable triggers to permit past bookings for testing
ALTER TABLE booking DISABLE TRIGGER trg_chk_create_booking_start_future;
ALTER TABLE booking DISABLE TRIGGER trg_chk_start_future_limit;
    -- people
INSERT INTO person VALUES (
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
    (1234567, '2024-10-07T16:30', '2024-10-07T17:30', 'K-K17-402', 'declined', 'workshop'),

    -- upcoming desk bookings
    (1234567, '2024-07-18T06:30', '2024-07-18T08:30', 'K-K17-201-1', 'confirmed', 'studying'),
    (7654321, '2024-07-18T06:30', '2024-07-18T08:30', 'K-K17-201-2', 'confirmed', 'studying');

-- Reenable triggers for prod
ALTER TABLE booking ENABLE TRIGGER trg_chk_create_booking_start_future;
ALTER TABLE booking ENABLE TRIGGER trg_chk_start_future_limit;
