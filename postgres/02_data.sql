-- Insert the room data into the space table and the room table
INSERT INTO space (id, name, minReqGrp, minBookGrp) VALUES
    ('K-K17-B01', 'K17 CSE Basement', 'csestaff', 'admin'),
    ('K-K17-B02', 'K17 CSE Basement Board Room', 'csestaff', 'admin'),
    ('K-K17-G01', 'K17 Room G01', 'hdr', 'admin'),
    ('K-K17-G02', 'K17 Room G02', 'hdr', 'admin'),
    ('K-K17-103', 'K17 Room 103', 'csestaff', 'admin'),
    ('K-K17-113', 'K17 Room 113', 'csestaff', 'admin'),
    ('K-K17-201B', 'K17 Room 201-B', 'csestaff', 'admin'),
    ('K-K17-302', 'K17 Room 302', 'csestaff', 'admin'),
    ('K-K17-401K', 'K17 Room 401 K', 'csestaff', 'admin'),
    ('K-K17-402', 'K17 Room 402', 'hdr', 'admin'),
    ('K-K17-403', 'K17 Room 403', 'hdr', 'admin'),
    ('K-K17-501M', 'K17 Room 501M', 'csestaff', 'admin'),
    ('K-K17-508', 'K17 Room 508', 'csestaff', 'admin'),
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

INSERT INTO space (id, name, minReqGrp, minBookGrp) VALUES
('K-K17-201-1', 'K17 201 Desk 1', 'hdr', 'hdr'),
('K-K17-201-2', 'K17 201 Desk 2', 'hdr', 'hdr'),
('K-K17-201-3', 'K17 201 Desk 3', 'hdr', 'hdr'),
('K-K17-201-4', 'K17 201 Desk 4', 'hdr', 'hdr'),
('K-K17-201-5', 'K17 201 Desk 5', 'hdr', 'hdr'),
('K-K17-201-6', 'K17 201 Desk 6', 'hdr', 'hdr'),
('K-K17-201-7', 'K17 201 Desk 7', 'hdr', 'hdr'),
('K-K17-201-8', 'K17 201 Desk 8', 'hdr', 'hdr'),
('K-K17-201-9', 'K17 201 Desk 9', 'hdr', 'hdr'),
('K-K17-201-10', 'K17 201 Desk 10', 'hdr', 'hdr'),
('K-K17-201-11', 'K17 201 Desk 11', 'hdr', 'hdr'),
('K-K17-201-12', 'K17 201 Desk 12', 'hdr', 'hdr'),
('K-K17-201-13', 'K17 201 Desk 13', 'hdr', 'hdr'),
('K-K17-201-14', 'K17 201 Desk 14', 'hdr', 'hdr'),
('K-K17-201-15', 'K17 201 Desk 15', 'hdr', 'hdr'),
('K-K17-201-16', 'K17 201 Desk 16', 'hdr', 'hdr'),
('K-K17-201-17', 'K17 201 Desk 17', 'hdr', 'hdr'),
('K-K17-201-18', 'K17 201 Desk 18', 'hdr', 'hdr'),
('K-K17-201-19', 'K17 201 Desk 19', 'hdr', 'hdr'),
('K-K17-201-20', 'K17 201 Desk 20', 'hdr', 'hdr'),
('K-K17-201-21', 'K17 201 Desk 21', 'hdr', 'hdr'),
('K-K17-201-22', 'K17 201 Desk 22', 'hdr', 'hdr'),
('K-K17-201-23', 'K17 201 Desk 23', 'hdr', 'hdr'),
('K-K17-201-24', 'K17 201 Desk 24', 'hdr', 'hdr'),
('K-K17-201-25', 'K17 201 Desk 25', 'hdr', 'hdr'),
('K-K17-201-26', 'K17 201 Desk 26', 'hdr', 'hdr'),
('K-K17-201-27', 'K17 201 Desk 27', 'hdr', 'hdr'),
('K-K17-201-28', 'K17 201 Desk 28', 'hdr', 'hdr'),
('K-K17-201-29', 'K17 201 Desk 29', 'hdr', 'hdr'),
('K-K17-201-30', 'K17 201 Desk 30', 'hdr', 'hdr'),
('K-K17-201-31', 'K17 201 Desk 31', 'hdr', 'hdr'),
('K-K17-201-32', 'K17 201 Desk 32', 'hdr', 'hdr'),
('K-K17-201-33', 'K17 201 Desk 33', 'hdr', 'hdr'),
('K-K17-201-34', 'K17 201 Desk 34', 'hdr', 'hdr'),
('K-K17-201-35', 'K17 201 Desk 35', 'hdr', 'hdr'),

('K-K17-217-1', 'K17 217 Desk 1', 'hdr', 'hdr'),
('K-K17-217-2', 'K17 217 Desk 2', 'hdr', 'hdr'),
('K-K17-217-3', 'K17 217 Desk 3', 'hdr', 'hdr'),
('K-K17-217-4', 'K17 217 Desk 4', 'hdr', 'hdr'),
('K-K17-217-5', 'K17 217 Desk 5', 'hdr', 'hdr'),
('K-K17-217-6', 'K17 217 Desk 6', 'hdr', 'hdr'),
('K-K17-217-7', 'K17 217 Desk 7', 'hdr', 'hdr'),
('K-K17-217-8', 'K17 217 Desk 8', 'hdr', 'hdr'),
('K-K17-217-9', 'K17 217 Desk 9', 'hdr', 'hdr'),
('K-K17-217-10', 'K17 217 Desk 10', 'hdr', 'hdr'),
('K-K17-217-11', 'K17 217 Desk 11', 'hdr', 'hdr'),
('K-K17-217-12', 'K17 217 Desk 12', 'hdr', 'hdr'),
('K-K17-217-13', 'K17 217 Desk 13', 'hdr', 'hdr'),
('K-K17-217-14', 'K17 217 Desk 14', 'hdr', 'hdr'),
('K-K17-217-15', 'K17 217 Desk 15', 'hdr', 'hdr'),
('K-K17-217-16', 'K17 217 Desk 16', 'hdr', 'hdr'),
('K-K17-217-17', 'K17 217 Desk 17', 'hdr', 'hdr'),
('K-K17-217-18', 'K17 217 Desk 18', 'hdr', 'hdr'),

('K-K17-301-1', 'K17 301 Desk 1', 'hdr', 'hdr'),
('K-K17-301-2', 'K17 301 Desk 2', 'hdr', 'hdr'),
('K-K17-301-3', 'K17 301 Desk 3', 'hdr', 'hdr'),
('K-K17-301-4', 'K17 301 Desk 4', 'hdr', 'hdr'),
('K-K17-301-5', 'K17 301 Desk 5', 'hdr', 'hdr'),
('K-K17-301-6', 'K17 301 Desk 6', 'hdr', 'hdr'),
('K-K17-301-7', 'K17 301 Desk 7', 'hdr', 'hdr'),
('K-K17-301-8', 'K17 301 Desk 8', 'hdr', 'hdr'),
('K-K17-301-9', 'K17 301 Desk 9', 'hdr', 'hdr'),
('K-K17-301-10', 'K17 301 Desk 10', 'hdr', 'hdr'),
('K-K17-301-11', 'K17 301 Desk 11', 'hdr', 'hdr'),
('K-K17-301-12', 'K17 301 Desk 12', 'hdr', 'hdr'),
('K-K17-301-13', 'K17 301 Desk 13', 'hdr', 'hdr'),
('K-K17-301-14', 'K17 301 Desk 14', 'hdr', 'hdr'),
('K-K17-301-15', 'K17 301 Desk 15', 'hdr', 'hdr'),
('K-K17-301-16', 'K17 301 Desk 16', 'hdr', 'hdr'),

('K-K17-301K-45', 'K17 301K Desk 45', 'hdr', 'hdr'),
('K-K17-301K-46', 'K17 301K Desk 46', 'hdr', 'hdr'),
('K-K17-301K-47', 'K17 301K Desk 47', 'hdr', 'hdr'),
('K-K17-301K-48', 'K17 301K Desk 48', 'hdr', 'hdr'),
('K-K17-301K-49', 'K17 301K Desk 49', 'hdr', 'hdr'),
('K-K17-301K-50', 'K17 301K Desk 50', 'hdr', 'hdr'),

('K-K17-401-1', 'K17 401 Desk 1', 'hdr', 'hdr'),
('K-K17-401-2', 'K17 401 Desk 2', 'hdr', 'hdr'),
('K-K17-401-3', 'K17 401 Desk 3', 'hdr', 'hdr'),
('K-K17-401-4', 'K17 401 Desk 4', 'hdr', 'hdr'),
('K-K17-401-5', 'K17 401 Desk 5', 'hdr', 'hdr'),
('K-K17-401-6', 'K17 401 Desk 6', 'hdr', 'hdr'),
('K-K17-401-7', 'K17 401 Desk 7', 'hdr', 'hdr'),
('K-K17-401-8', 'K17 401 Desk 8', 'hdr', 'hdr'),
('K-K17-401-9', 'K17 401 Desk 9', 'hdr', 'hdr'),
('K-K17-401-10', 'K17 401 Desk 10', 'hdr', 'hdr'),
('K-K17-401-11', 'K17 401 Desk 11', 'hdr', 'hdr'),
('K-K17-401-12', 'K17 401 Desk 12', 'hdr', 'hdr'),
('K-K17-401-13', 'K17 401 Desk 13', 'hdr', 'hdr'),
('K-K17-401-14', 'K17 401 Desk 14', 'hdr', 'hdr'),
('K-K17-401-15', 'K17 401 Desk 15', 'hdr', 'hdr'),
('K-K17-401-16', 'K17 401 Desk 16', 'hdr', 'hdr'),
('K-K17-401-17', 'K17 401 Desk 17', 'hdr', 'hdr'),
('K-K17-401-18', 'K17 401 Desk 18', 'hdr', 'hdr'),
('K-K17-401-19', 'K17 401 Desk 19', 'hdr', 'hdr'),
('K-K17-401-20', 'K17 401 Desk 20', 'hdr', 'hdr'),
('K-K17-401-21', 'K17 401 Desk 21', 'hdr', 'hdr'),
('K-K17-401-22', 'K17 401 Desk 22', 'hdr', 'hdr'),
('K-K17-401-23', 'K17 401 Desk 23', 'hdr', 'hdr'),
('K-K17-401-24', 'K17 401 Desk 24', 'hdr', 'hdr'),
('K-K17-401-25', 'K17 401 Desk 25', 'hdr', 'hdr'),
('K-K17-401-26', 'K17 401 Desk 26', 'hdr', 'hdr'),
('K-K17-401-27', 'K17 401 Desk 27', 'hdr', 'hdr'),
('K-K17-401-28', 'K17 401 Desk 28', 'hdr', 'hdr'),
('K-K17-401-29', 'K17 401 Desk 29', 'hdr', 'hdr'),
('K-K17-401-30', 'K17 401 Desk 30', 'hdr', 'hdr'),
('K-K17-401-31', 'K17 401 Desk 31', 'hdr', 'hdr'),
('K-K17-401-32', 'K17 401 Desk 32', 'hdr', 'hdr'),
('K-K17-401-33', 'K17 401 Desk 33', 'hdr', 'hdr'),
('K-K17-401-34', 'K17 401 Desk 34', 'hdr', 'hdr'),
('K-K17-401-35', 'K17 401 Desk 35', 'hdr', 'hdr'),
('K-K17-401-37', 'K17 401 Desk 37', 'hdr', 'hdr'),
('K-K17-401-38', 'K17 401 Desk 38', 'hdr', 'hdr'),
('K-K17-401-39', 'K17 401 Desk 39', 'hdr', 'hdr'),

('K-K17-412-1', 'K17 412 Desk 1', 'hdr', 'hdr'),
('K-K17-412-2', 'K17 412 Desk 2', 'hdr', 'hdr'),
('K-K17-412-3', 'K17 412 Desk 3', 'hdr', 'hdr'),
('K-K17-412-4', 'K17 412 Desk 4', 'hdr', 'hdr'),
('K-K17-412-5', 'K17 412 Desk 5', 'hdr', 'hdr'),
('K-K17-412-6', 'K17 412 Desk 6', 'hdr', 'hdr'),
('K-K17-412-7', 'K17 412 Desk 7', 'hdr', 'hdr'),
('K-K17-412-8', 'K17 412 Desk 8', 'hdr', 'hdr'),
('K-K17-412-9', 'K17 412 Desk 9', 'hdr', 'hdr'),
('K-K17-412-10', 'K17 412 Desk 10', 'hdr', 'hdr'),
('K-K17-412-11', 'K17 412 Desk 11', 'hdr', 'hdr'),
('K-K17-412-12', 'K17 412 Desk 12', 'hdr', 'hdr'),
('K-K17-412-13', 'K17 412 Desk 13', 'hdr', 'hdr'),
('K-K17-412-14', 'K17 412 Desk 14', 'hdr', 'hdr'),
('K-K17-412-15', 'K17 412 Desk 15', 'hdr', 'hdr'),
('K-K17-412-16', 'K17 412 Desk 16', 'hdr', 'hdr'),
('K-K17-412-17', 'K17 412 Desk 17', 'hdr', 'hdr'),
('K-K17-412-18', 'K17 412 Desk 18', 'hdr', 'hdr'),

('K-K17-501-1', 'K17 501 Desk 1', 'hdr', 'hdr'),
('K-K17-501-2', 'K17 501 Desk 2', 'hdr', 'hdr'),
('K-K17-501-3', 'K17 501 Desk 3', 'hdr', 'hdr'),
('K-K17-501-4', 'K17 501 Desk 4', 'hdr', 'hdr'),
('K-K17-501-5', 'K17 501 Desk 5', 'hdr', 'hdr'),
('K-K17-501-6', 'K17 501 Desk 6', 'hdr', 'hdr'),
('K-K17-501-7', 'K17 501 Desk 7', 'hdr', 'hdr'),
('K-K17-501-8', 'K17 501 Desk 8', 'hdr', 'hdr'),
('K-K17-501-9', 'K17 501 Desk 9', 'hdr', 'hdr'),
('K-K17-501-10', 'K17 501 Desk 10', 'hdr', 'hdr'),
('K-K17-501-11', 'K17 501 Desk 11', 'hdr', 'hdr'),
('K-K17-501-12', 'K17 501 Desk 12', 'hdr', 'hdr'),
('K-K17-501-13', 'K17 501 Desk 13', 'hdr', 'hdr'),
('K-K17-501-14', 'K17 501 Desk 14', 'hdr', 'hdr'),
('K-K17-501-15', 'K17 501 Desk 15', 'hdr', 'hdr'),
('K-K17-501-16', 'K17 501 Desk 16', 'hdr', 'hdr'),
('K-K17-501-17', 'K17 501 Desk 17', 'hdr', 'hdr'),
('K-K17-501-18', 'K17 501 Desk 18', 'hdr', 'hdr'),
('K-K17-501-19', 'K17 501 Desk 19', 'hdr', 'hdr'),
('K-K17-501-20', 'K17 501 Desk 20', 'hdr', 'hdr'),
('K-K17-501-21', 'K17 501 Desk 21', 'hdr', 'hdr'),
('K-K17-501-22', 'K17 501 Desk 22', 'hdr', 'hdr'),
('K-K17-501-23', 'K17 501 Desk 23', 'hdr', 'hdr'),
('K-K17-501-24', 'K17 501 Desk 24', 'hdr', 'hdr'),
('K-K17-501-25', 'K17 501 Desk 25', 'hdr', 'hdr'),
('K-K17-501-26', 'K17 501 Desk 26', 'hdr', 'hdr'),
('K-K17-501-27', 'K17 501 Desk 27', 'hdr', 'hdr'),
('K-K17-501-28', 'K17 501 Desk 28', 'hdr', 'hdr'),
('K-K17-501-29', 'K17 501 Desk 29', 'hdr', 'hdr'),
('K-K17-501-30', 'K17 501 Desk 30', 'hdr', 'hdr'),
('K-K17-501-31', 'K17 501 Desk 31', 'hdr', 'hdr'),
('K-K17-501-32', 'K17 501 Desk 32', 'hdr', 'hdr'),
('K-K17-501-33', 'K17 501 Desk 33', 'hdr', 'hdr'),
('K-K17-501-34', 'K17 501 Desk 34', 'hdr', 'hdr'),
('K-K17-501-35', 'K17 501 Desk 35', 'hdr', 'hdr'),
('K-K17-501-36', 'K17 501 Desk 36', 'hdr', 'hdr'),
('K-K17-501-37', 'K17 501 Desk 37', 'hdr', 'hdr'),
('K-K17-501-38', 'K17 501 Desk 38', 'hdr', 'hdr'),
('K-K17-501-39', 'K17 501 Desk 39', 'hdr', 'hdr'),
('K-K17-501-40', 'K17 501 Desk 40', 'hdr', 'hdr'),
('K-K17-501-41', 'K17 501 Desk 41', 'hdr', 'hdr'),
('K-K17-501-42', 'K17 501 Desk 42', 'hdr', 'hdr'),
('K-K17-501-43', 'K17 501 Desk 43', 'hdr', 'hdr'),

('K-K17-510-1', 'K17 510 Desk 1', 'hdr', 'hdr'),
('K-K17-510-2', 'K17 510 Desk 2', 'hdr', 'hdr'),
('K-K17-510-3', 'K17 510 Desk 3', 'hdr', 'hdr'),
('K-K17-510-4', 'K17 510 Desk 4', 'hdr', 'hdr'),
('K-K17-510-5', 'K17 510 Desk 5', 'hdr', 'hdr'),
('K-K17-510-6', 'K17 510 Desk 6', 'hdr', 'hdr'),
('K-K17-510-7', 'K17 510 Desk 7', 'hdr', 'hdr'),
('K-K17-510-8', 'K17 510 Desk 8', 'hdr', 'hdr'),
('K-K17-510-9', 'K17 510 Desk 9', 'hdr', 'hdr'),
('K-K17-510-10', 'K17 510 Desk 10', 'hdr', 'hdr'),
('K-K17-510-11', 'K17 510 Desk 11', 'hdr', 'hdr'),
('K-K17-510-12', 'K17 510 Desk 12', 'hdr', 'hdr'),
('K-K17-510-13', 'K17 510 Desk 13', 'hdr', 'hdr'),
('K-K17-510-14', 'K17 510 Desk 14', 'hdr', 'hdr'),
('K-K17-510-15', 'K17 510 Desk 15', 'hdr', 'hdr'),
('K-K17-510-16', 'K17 510 Desk 16', 'hdr', 'hdr'),
('K-K17-510-17', 'K17 510 Desk 17', 'hdr', 'hdr'),
('K-K17-510-18', 'K17 510 Desk 18', 'hdr', 'hdr');

-- Insert data into hotdesk table
INSERT INTO hotdesk (id, floor, xCoord, yCoord) VALUES
('K-K17-201-1', 'K17 L2', 250.2, 687.2),
('K-K17-201-2', 'K17 L2', 250.2, 728.4),
('K-K17-201-3', 'K17 L2', 250.2, 769.7),
('K-K17-201-4', 'K17 L2', 191.9, 769.7),
('K-K17-201-5', 'K17 L2', 191.9, 728.4),
('K-K17-201-6', 'K17 L2', 191.9, 687.2),
('K-K17-201-7', 'K17 L2', 156.2, 687.2),
('K-K17-201-8', 'K17 L2', 156.2, 728.4),
('K-K17-201-9', 'K17 L2', 248.1, 622.3),
('K-K17-201-10', 'K17 L2', 200.2, 622.3),
('K-K17-201-11', 'K17 L2', 200.2, 580.3),
('K-K17-201-12', 'K17 L2', 248.1, 580.3),
('K-K17-201-13', 'K17 L2', 248.1, 500.5),
('K-K17-201-14', 'K17 L2', 200.2, 500.5),
('K-K17-201-15', 'K17 L2', 79.6, 428.4),
('K-K17-201-16', 'K17 L2', 127.5, 428.4),
('K-K17-201-17', 'K17 L2', 200.2, 458.5),
('K-K17-201-18', 'K17 L2', 248.1, 458.5),
('K-K17-201-19', 'K17 L2', 248.1, 378.7),
('K-K17-201-20', 'K17 L2', 200.2, 378.7),
('K-K17-201-21', 'K17 L2', 140.6, 378.7),
('K-K17-201-22', 'K17 L2', 92.6, 378.7),
('K-K17-201-23', 'K17 L2', 92.6, 336.7),
('K-K17-201-24', 'K17 L2', 140.6, 336.7),
('K-K17-201-25', 'K17 L2', 200.2, 336.7),
('K-K17-201-26', 'K17 L2', 248.1, 336.7),
('K-K17-201-27', 'K17 L2', 254.4, 285.7),
('K-K17-201-28', 'K17 L2', 298.0, 278.9),
('K-K17-201-29', 'K17 L2', 345.7, 274.0),
('K-K17-201-30', 'K17 L2', 389.4, 267.2),
('K-K17-201-31', 'K17 L2', 117.6, 769.7),
('K-K17-201-32', 'K17 L2', 117.6, 728.4),
('K-K17-201-33', 'K17 L2', 81.9, 728.4),
('K-K17-201-34', 'K17 L2', 81.9, 769.7),
('K-K17-201-35', 'K17 L2', 156.2, 769.7),

('K-K17-217-1', 'K17 L2', 520.3, 686.8),
('K-K17-217-2', 'K17 L2', 520.3, 716.7),
('K-K17-217-3', 'K17 L2', 520.3, 746.6),
('K-K17-217-4', 'K17 L2', 557.6, 746.6),
('K-K17-217-5', 'K17 L2', 557.6, 716.7),
('K-K17-217-6', 'K17 L2', 557.6, 686.8),
('K-K17-217-7', 'K17 L2', 593.2, 686.8),
('K-K17-217-8', 'K17 L2', 593.2, 716.7),
('K-K17-217-9', 'K17 L2', 593.2, 746.6),
('K-K17-217-10', 'K17 L2', 631.3, 746.6),
('K-K17-217-11', 'K17 L2', 631.3, 716.7),
('K-K17-217-12', 'K17 L2', 631.3, 686.8),
('K-K17-217-13', 'K17 L2', 666.8, 686.8),
('K-K17-217-14', 'K17 L2', 666.8, 716.7),
('K-K17-217-15', 'K17 L2', 666.8, 746.6),
('K-K17-217-16', 'K17 L2', 704.9, 746.6),
('K-K17-217-17', 'K17 L2', 704.9, 716.7),
('K-K17-217-18', 'K17 L2', 704.9, 686.8),

('K-K17-301-1', 'K17 L3', 413.7, 379.2),
('K-K17-301-2', 'K17 L3', 413.7, 337.9),
('K-K17-301-3', 'K17 L3', 413.7, 296.7),
('K-K17-301-4', 'K17 L3', 378.0, 379.2),
('K-K17-301-5', 'K17 L3', 378.0, 337.9),
('K-K17-301-6', 'K17 L3', 378.0, 296.7),
('K-K17-301-7', 'K17 L3', 334.1, 362.2),
('K-K17-301-8', 'K17 L3', 334.1, 320.9),
('K-K17-301-9', 'K17 L3', 298.4, 362.2),
('K-K17-301-10', 'K17 L3', 298.4, 320.9),
('K-K17-301-11', 'K17 L3', 254.5, 379.2),
('K-K17-301-12', 'K17 L3', 254.5, 337.9),
('K-K17-301-13', 'K17 L3', 254.5, 296.7),
('K-K17-301-14', 'K17 L3', 218.8, 379.2),
('K-K17-301-15', 'K17 L3', 218.8, 337.9),
('K-K17-301-16', 'K17 L3', 218.8, 296.7),

('K-K17-301K-45', 'K17 L3', 617.0, 761.5),
('K-K17-301K-46', 'K17 L3', 617.0, 720.2),
('K-K17-301K-47', 'K17 L3', 656.6, 761.5),
('K-K17-301K-48', 'K17 L3', 656.6, 720.2),
('K-K17-301K-49', 'K17 L3', 692.3, 761.5),
('K-K17-301K-50', 'K17 L3', 692.3, 720.2),

('K-K17-401-1', 'K17 L4', 294.8, 326.1),
('K-K17-401-2', 'K17 L4', 253.5, 326.1),
('K-K17-401-3', 'K17 L4', 212.3, 326.1),
('K-K17-401-4', 'K17 L4', 294.8, 361.8),
('K-K17-401-5', 'K17 L4', 253.5, 361.8),
('K-K17-401-6', 'K17 L4', 212.3, 361.8),
('K-K17-401-7', 'K17 L4', 294.8, 404.5),
('K-K17-401-8', 'K17 L4', 253.5, 404.5),
('K-K17-401-9', 'K17 L4', 212.3, 404.5),
('K-K17-401-10', 'K17 L4', 294.8, 440.2),
('K-K17-401-11', 'K17 L4', 253.5, 440.2),
('K-K17-401-12', 'K17 L4', 212.3, 440.2),
('K-K17-401-13', 'K17 L4', 294.8, 482.9),
('K-K17-401-14', 'K17 L4', 253.5, 482.9),
('K-K17-401-15', 'K17 L4', 212.3, 482.9),
('K-K17-401-16', 'K17 L4', 294.8, 518.6),
('K-K17-401-17', 'K17 L4', 253.5, 518.6),
('K-K17-401-18', 'K17 L4', 212.3, 518.6),
('K-K17-401-19', 'K17 L4', 294.8, 561.3),
('K-K17-401-20', 'K17 L4', 253.5, 561.3),
('K-K17-401-21', 'K17 L4', 212.3, 561.3),
('K-K17-401-22', 'K17 L4', 294.8, 597.0),
('K-K17-401-23', 'K17 L4', 253.5, 597.0),
('K-K17-401-24', 'K17 L4', 212.3, 597.0),
('K-K17-401-25', 'K17 L4', 294.8, 639.7),
('K-K17-401-26', 'K17 L4', 253.5, 639.7),
('K-K17-401-27', 'K17 L4', 212.3, 639.7),
('K-K17-401-28', 'K17 L4', 294.8, 675.4),
('K-K17-401-29', 'K17 L4', 253.5, 675.4),
('K-K17-401-30', 'K17 L4', 212.3, 675.4),
('K-K17-401-31', 'K17 L4', 294.8, 718.0),
('K-K17-401-32', 'K17 L4', 253.5, 718.0),
('K-K17-401-33', 'K17 L4', 212.3, 718.0),
('K-K17-401-34', 'K17 L4', 348.7, 276.4),
('K-K17-401-35', 'K17 L4', 392.3, 269.6),
('K-K17-401-37', 'K17 L4', 294.8, 753.7),
('K-K17-401-38', 'K17 L4', 253.5, 753.7),
('K-K17-401-39', 'K17 L4', 212.3, 753.7),

('K-K17-412-1', 'K17 L4', 703.7, 735.9),
('K-K17-412-2', 'K17 L4', 703.7, 694.7),
('K-K17-412-3', 'K17 L4', 703.7, 653.4),
('K-K17-412-4', 'K17 L4', 662.8, 653.4),
('K-K17-412-5', 'K17 L4', 662.8, 694.7),
('K-K17-412-6', 'K17 L4', 662.8, 735.9),
('K-K17-412-7', 'K17 L4', 627.1, 735.9),
('K-K17-412-8', 'K17 L4', 627.1, 694.7),
('K-K17-412-9', 'K17 L4', 627.1, 653.4),
('K-K17-412-10', 'K17 L4', 587.7, 653.4),
('K-K17-412-11', 'K17 L4', 587.7, 694.7),
('K-K17-412-12', 'K17 L4', 587.7, 735.9),
('K-K17-412-13', 'K17 L4', 552.0, 735.9),
('K-K17-412-14', 'K17 L4', 552.0, 694.7),
('K-K17-412-15', 'K17 L4', 552.0, 653.4),
('K-K17-412-16', 'K17 L4', 511.1, 653.4),
('K-K17-412-17', 'K17 L4', 511.1, 694.7),
('K-K17-412-18', 'K17 L4', 511.1, 735.9),

('K-K17-501-1', 'K17 L5', 294.8, 326.1),
('K-K17-501-2', 'K17 L5', 253.5, 326.1),
('K-K17-501-3', 'K17 L5', 212.3, 326.1),
('K-K17-501-4', 'K17 L5', 294.8, 361.8),
('K-K17-501-5', 'K17 L5', 253.5, 361.8),
('K-K17-501-6', 'K17 L5', 212.3, 361.8),
('K-K17-501-7', 'K17 L5', 294.8, 404.5),
('K-K17-501-8', 'K17 L5', 253.5, 404.5),
('K-K17-501-9', 'K17 L5', 212.3, 404.5),
('K-K17-501-10', 'K17 L5', 294.8, 440.2),
('K-K17-501-11', 'K17 L5', 253.5, 440.2),
('K-K17-501-12', 'K17 L5', 212.3, 440.2),
('K-K17-501-13', 'K17 L5', 294.8, 482.9),
('K-K17-501-14', 'K17 L5', 253.5, 482.9),
('K-K17-501-15', 'K17 L5', 212.3, 482.9),
('K-K17-501-16', 'K17 L5', 294.8, 518.6),
('K-K17-501-17', 'K17 L5', 253.5, 518.6),
('K-K17-501-18', 'K17 L5', 212.3, 518.6),
('K-K17-501-19', 'K17 L5', 294.8, 561.3),
('K-K17-501-20', 'K17 L5', 253.5, 561.3),
('K-K17-501-21', 'K17 L5', 212.3, 561.3),
('K-K17-501-22', 'K17 L5', 294.8, 597),
('K-K17-501-23', 'K17 L5', 253.5, 597),
('K-K17-501-24', 'K17 L5', 212.3, 597),
('K-K17-501-25', 'K17 L5', 294.8, 639.7),
('K-K17-501-26', 'K17 L5', 253.5, 639.7),
('K-K17-501-27', 'K17 L5', 212.3, 639.7),
('K-K17-501-28', 'K17 L5', 294.8, 675.4),
('K-K17-501-29', 'K17 L5', 253.5, 675.4),
('K-K17-501-30', 'K17 L5', 212.3, 675.4),
('K-K17-501-31', 'K17 L5', 294.8, 718),
('K-K17-501-32', 'K17 L5', 253.5, 718),
('K-K17-501-33', 'K17 L5', 212.3, 718),
('K-K17-501-34', 'K17 L5', 348.7, 276.4),
('K-K17-501-35', 'K17 L5', 392.3, 269.6),
('K-K17-501-36', 'K17 L5', 448.3, 263.7),
('K-K17-501-37', 'K17 L5', 491.9, 256.9),
('K-K17-501-38', 'K17 L5', 546.7, 250.6),
('K-K17-501-39', 'K17 L5', 590.3, 243.8),
('K-K17-501-40', 'K17 L5', 206.65, 753.7),
('K-K17-501-41', 'K17 L5', 238.05, 753.7),
('K-K17-501-42', 'K17 L5', 269.15, 753.7),
('K-K17-501-43', 'K17 L5', 300.35, 753.7),

('K-K17-510-1', 'K17 L5', 511.1, 735.9),
('K-K17-510-2', 'K17 L5', 511.1, 694.6),
('K-K17-510-3', 'K17 L5', 511.1, 653.4),
('K-K17-510-4', 'K17 L5', 552.0, 735.9),
('K-K17-510-5', 'K17 L5', 552.0, 694.6),
('K-K17-510-6', 'K17 L5', 552.0, 653.4),
('K-K17-510-7', 'K17 L5', 587.7, 735.9),
('K-K17-510-8', 'K17 L5', 587.7, 694.6),
('K-K17-510-9', 'K17 L5', 587.7, 653.4),
('K-K17-510-10', 'K17 L5', 627.1, 735.9),
('K-K17-510-11', 'K17 L5', 627.1, 694.6),
('K-K17-510-12', 'K17 L5', 627.1, 653.4),
('K-K17-510-13', 'K17 L5', 662.8, 735.9),
('K-K17-510-14', 'K17 L5', 662.8, 694.6),
('K-K17-510-15', 'K17 L5', 662.8, 653.4),
('K-K17-510-16', 'K17 L5', 703.7, 735.9),
('K-K17-510-17', 'K17 L5', 703.7, 694.6),
('K-K17-510-18', 'K17 L5', 703.7, 653.4);

-- temporary person, should be populated with the given spreadsheet
-- this is in data rather than dev_data since it's unusable without people
INSERT INTO person VALUES (
    1234567,
    'z1234567@ad.unsw.edu.au',
    'Umar Farooq',
    'Mr',
    'CSE',
    'ENG',
    'Academic',
    'admin',
    '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQQDAAMBAAAAAAAAAAAACgAGBwkEBQgBAwsC/8QAUxAAAQIDBAUHCAQLBQUJAAAAAwQFAQIGAAcREwgSFCExFSMkQVFhcQkiMzRDgZHwFjJEVCU1QlNkc6GxwdHhClJjdPEXJkVitBhyg4SSoqPU4//EAB0BAAICAgMBAAAAAAAAAAAAAAYHBAUDCAABAgn/xAA+EQABAgMFBAcFBgYDAQAAAAABAxECBCEABQYxQRNRYZEHEhRxgaHwIiNDwdEIJDJCseEVM1NiY/FEUoKy/9oADAMBAAIRAxEAPwCcAjLCbCM0nbvHD56t2/tw7YZE0k8Iy4ZfH+54fztnJhyTRmlmjv8A+7v4d8ffxtkTp5YRljHVl375ppY/PXj2d3CwfaRbEDISMPNy5pvydWX6/wDPrwhxw7bZMkqaBNVU4NCMcuXnGcnRK3owjMXJDnrFh0ycPH1fDav0SzJrS8WnLty0wZ+nR8nPCpw5QVHVbPya1tqQyxyXmDvzgJofdulKuyGMLDT6Xema7aQVWpbrUT0/UzQayrnhS4StKMSx8fuRyw+iryHn022IVIOkJU/RVSXhsitZaZKoRKR6bs/XhblraP8At8vdT3nmoC727ZOuRsNQPNN1g6Oygqxvahs68yNXUbasZ4qk7kBMCAXD1r1XCCy3O+lX5TN2oxYOi7uWuUlRS7RI9ODVmjTyc7k7U27YBMoWAU+sdGj/ABtULdveMnuzd7yqXXVTUlSUzVDaoRmeGl2fqLqRqHAXMugUe0c8ePOt7s344Kuj/ed3PL9GKOUrg3udWJ+UIkMzuj8jKn/B/HNznI8FBtpyf8rj12nJysMKnt93dT5fM287T2Wrnl++756a2s0ojym2lCxQUcqPSGrAynIsb2+ohpSKDDDxa1izI2hGhTA6QjT8MAx9atZNcT5RCgr8XCamqup012b8RIzyIVC9wgsa3V4MEIXhvzvsezHgFQk+9WGHpJ9EldVBXl2DMqGDb2lVKQpEbkQPrgsd2SdSnzujRwS8OFpIR33M4TqimbxjIoWI5FSoZMssiABc5GvRx4BdW0/SOPSsndFVvS2yrSynwj51fPj/AKt1AEoi0aj/AEpm+lS9rrNNpIZOzVgWMRzSmp18nDNLNzc4zIDc5nYxiYEPvEf/AKtrEvJTp51egLo54QxmHT9Sg86b8zVzxvh8MertsPvG/wCea1o0dIuEszsGDKoZxqtuFmkRmS9DVGMs9gq+8Jv0dJ0WFrlPJraZujldro/XX6PNT1PybVFHzVAjUFMHLIEjlUaxyD6b0wEwDbP0bh4WkYdiMqqpCqSl7/wOVN36jS0K80FjsjAX13NkfPn4WtqnSzjUTSzST9uru/j747+GMbbAKMk8/myR+Yb+yEP649VpMUU8kWyo3NsLIsb3BGjckKwcpctaiWizgqg5wPzG/DHf1W3CWlJyS4yj+t9b/XDr6+7fHrsbozXWi6j5607hm794tSxJxfj7vJvPKjd9oZKgJAk2I5f28OrhCytMCilSwLNDIm/9PjZWlbcbvXPiOdsNoWAxzS682p/7d+MfDq6rZ8WaeMvo5o7/AK03N6nv3cd/jacIUaaG6M80ZNbfqp/3dvzHvt7I0oaWOEDTQ/vcwL0fH/TDfu99knCpF1gXzpz9avY02fHy/ew8/ld6yZm6iGWnG2ZUOuGd22xK7tawqNQgbzJDBckCzn/QuWfv6Kq2rDodhnQv0qV3aVk6gap0bViedKMk0SEUj380Y2RtAT+m3fCxVnlq7n19I3QNukFTppRysKpPR9eDmQiIT6POf4nEExujh/Cptnw9a/TEth7dCG5UukXeq+KHZtRI2SkEYyDCQWWoXOhoxyQnOGGGRzuKvCMfHHdCwinkbvkJieVPukPqB8zlXuZrTJG71p6cSlkfjtk51G7hu032bdNXj0nTKSZ2UXTmqGqyTEMR4qRyVLGMIzKs7NMjMnTJ9vTHj+lbVu6JjjZp3pr7xb/F4F5GcMsG1r5JbUbG38l5xM0OTnI8eZTpv32uYl0VgPj43tCu75mDKjIQKVYlcl61wRqM3J2oKJYBM35GR0hJtO1e7G1iVxegbQDBOF4qBDNKE0RyNbSIZVGus4be5LDJ+ePDEyj+NgKf6S5C7torAntluYDsdOWo4Wat2dEk/eSycMcZRRcebCvLwrYbW5bybd894zAF4MhUMKOZcOAzKhlIOT/4OO0e63TEvkz6FQL22gqufVTLeA/M6hzYwLJ9nTupEeeEwg9Zt/2eHXxx6yvG+j6SpZqG0IG2UycY9ckw5MuSJPY8zkcfdx7rc26SWjJR2kFSCVCRU7UrXFLug3u7+tGSUQ3SnnDK9Uzs/nkKnntr/XeqKrAyHSneM7PhJVXYIrTAIqOFOLZV8rMtXodui7LtUWSle2TYH9ZzkMtBXup5hv3sXUXgaO9QKqdfJ4BRNK7Y07gqCUmzJwl5lKsDkRzgQB+KVCbakvPffN1t/dhXNTrghO1UAoXPzo+NdMU+uUSiUOC94fy5KNKzs/RnD20ekR9Vztr6Va3HSe0ZNKBwpZ7SXkVRTtVMNLtMDS1JyWlRvhkwccnlNZkc9tPX8bci6IFb3e3ZX/XKKa5plwdqdp+uGed2GGRKQhlrwv5HRr20yxRz3Jp1gVH+VCo977ua8E5yURj2u2VOtHFAxOufrS2tGJbrVu2eUT2ZRSfJy7eOp5iljdLgLua5Y9H651pvOHLNXzLd3T6OqhjGIY0zhEWcFMH88dMhMJOrjHHpUO20tN1Nyykllmlm1Y/8vV4dfH92FugmqmAiSKm6SfaJmeVOjJDk0rfkjWJQrApAh6SCAEwDB9WVKt3ZhbSzMsAKZpoSzeb28e/v64/1sTwrxwxVpXl8vlrWwbGn1oevmXPkfHfTv5RiSkwzzRm1J9/dD+llaZBt+tLCMJJo49uH8/52VpO3PH1/64DlbAw3evQHK0U/RsfGEk00sZtTWll+cOMcPf2Y216mnARmwyiS4yw1eb9pj2/y6+O+3Rs7FGWE2IppdYkPNll4dvd8wtpFTHNL50Bkl3eb53z7/Hd3qPbR9Tqv4/LnXdwsZ7GDjztWrpz6PlNX+aImkBdlUreZUhXXfPFToxpejqJKgokX0kaFWd+jHbTdH98OGERKfJO0c7T3hVI7tYTfRVCyp1LgsmFzZljkbJClzvVwnjjtHhHHqsfgWkkzwFYzL5Jpm9+RuDCuzpcwfJ7ygMzrCmwj6DIWbRxxwwsLBoHXay6K1yOl9Q1ZUwQlbXK6U149JGalyMqOC+KNIZXQaaGdsyjYXNErbVKRR6rsvhjanxPOKQ4dmUnAK0xDLtqxAPW7oWY5Z03g0wFJwqYhSUYxBBAMwce4OQejn6d9u8aduzalMhHtYqSpwkKPVTqCbORy53Oyv16aIfmNp0Qt6QGTBpqNLGZKn/E60gk8JBn5nmc703Wox/we2wpOk/pAX6uFUPDpV2kVLRKwcqf/AHNu3Rq1jdSudnGRtaxZ6uE8cmHrMYq+ZUdltpojaV97bm9sLC+XmVRVwXog+TZqwQbOQqc2cHakjkI8YmAm6/fCyin8ET6N2i9Ip4KpUBlz4EnKnNuFbbI3Lj2QjvMXWZGYejMERUAORkz0OTedioHadjTB2lxqRGMISDCQKFULMnJwNnfmd/H9vZaKal0l9Geh5JUdS3k0i2kDMORYRc8JSLEw4lyc3JAu+zdvZhaufTNpe9ViuqY6rbKiWEbXBKRS4JWMipO4Tp8oOcXO9t88cNw8QKNnTuzTVDncxVVbNdaPRGpvMqdnRScKgy/J2ly3fg2MTmgo2hT9lFxhvjCVhTBMvecHaJtUDdsCHBpm5pQEDdrlbvF+O5y6z2WRkTtVs9vucaDk7+Du5ttdXdXU3/3B1Khoyt2mpmOsKdJIF2aV4iLEaw3qZXIPrCMED5PjYW+6/R0fmDyi+j7o1VclIqdF1913bVEiFLAkixvM88sbeHbAJs4EEKPj27RC1jGgEmDRVRq6cY6NvGuxqZvV7AYbkZ0fbv6wa/8AiSDONtDeY6YENoSKE35i0iaUjKqui8pJoc6TIG6Z2YaFRo71anMIZE5DNd0q83KSUWT7dShcg7J8Vmy2bOGFkbjnFLvVmdrKIoBYb8xR3fjnTdrZK4xuqYxJIyc9Lyw/iKq+xMuBSrEvyd/1axkh6ZRJJ1aZvFMFLFQoMMM05SE9ayc0xjem7vnCN3RlyDkjqcP+X4x44dn78LO66C9mlb87qbvb6KLTKk1K3oU2krBjSrubWI0bkVYHYFgc9TidNk/evCz0c2oamWYsJPrSd3w8IQ3+PCzYTVTVTSWgV/nMaDRh8/NqWQq6CksssgslsVkCx7xvGu6oe0ByJIwhGEZJYRxjxj4WVnspaZxmJLCWP1ox6oce6yt768O/yP0tiYbvXoDlbdEZ4QkmgMqiEsI+dLr+OPsPn3W1aljkkiOM5FE02Mfql/8Aw/fw3cbSGIZITYZU2rDf8/x3b7YipPNCOvInMSEv5MMoe/wz/wB2GFlJ1zuHn9bEkMcXWFfLL1lW0T1JTa5ZTVUI2syxO5KqXqQLWeVRllC4GYXLY1QTQBGIdmPEMcf+qsOXoq0cvvuoK8inL06vdKgqiqLwCOtaVk7LDcsGWtrMZhRqnIwfTHbdjCn6T/OMCaqequda91kwIKaG4PFNU+1vDelcHATendlCwvMpTLOk5IPTfZff1RHLrGWa4TT50zLpoNgabaHBpunvUp9pCs2xHIx141rCvBW31bPCmddsTbR44wsA40l56OW7ciqdkiyPZ31eEuW5u5zezw6Kp+7AordMymO1rTyK6Eyz+4SRU2yD0Z+Jq+/Ph+//AMmotu/TuwmmnaRfKVqww1Kx25UK6ctkEUxkSqpMkKj8KpvWMf6xtHt3ehsyXfztLg9kaeVs5NI3oWVGJG3sDcH7KHN6R0n/AMrawK8vSHbmZmdAt61Kha8zbFRySiUp1PoQ5WSY/M7Th3fxtXbWmlo03YMLhepXFOKKymmzJ2ukZXkTUORH7Jeb7RkJgYqPVVSqMQx64WDpa8b+vaS7EnHMrbUAbAIFgza5aM44cbO2O58M3SuneU2rCgqkQatWoPEnV6sNdxuEebspLz7n28PJSVUNkl5sKoiUadS1o0vTEps6Pp9h3YfMK/4aIV1tSOxXqg6xdqDdkqzp1PykQODeFRm4c82uXPpPbeHDGNuVm/y8FDsl3CN8SUSpRvnKiholpFcNUob9sMEIjJYrAg/FWwwMo2/3bJ1RYV4/lLaCvne0N6zMga7uauQt7OjdKZp1KpGxuqNGLJWFObITZy6MekbQpS+x91rGXw1i2Rk+sknMIJA9xcGtBoN3+hgnsUYEmp1KBaYllllWYoh2/DQkuBXQ86PYgTR2ueZaHDtFRurlVEqVONMnlVESjJmcc0IggSpwgTZ+75jbhPTqqKVmvYudpqDWnWTVYx3wU8qRkIU5ETG8M2SESM3Rsk8ThR9Xb42cmjzpI/7Q6bbXJvcszbk6NYEmZzkg/bBN+ewBh8MbMO9mdivn0+dG27WC9cYZGmsE1QmZZhEcG9G8CbDAKEJvTHxAZOrTpulbLtGx2ucOSM9MKqQzKhWWcAuSaBneuh/Rn30uJ7wu27Dd87K9nSR2xWGR0UagpXTXnYmrQwu0W3OaIGjPdu7Z0XCnbpabMugom6QJY/CM/bKaPrPRQLQwjtOyx7bdYIpYGly/Nmh8wtlPSAKUIU6UOqlb0qRCnHLLDzE6NAjSIxceZ2YAYp9n/nZtoFkUp5Yx1tWabfCPh/Tq8N9ti5CGFGURSOZA4nIDw8Nwtppe0wZ2fmlovjTK+jV20OvcRkMgdLflazRion8zHvwj39mMLKz3lUJTQzMI+d4fzsrT7V2z4+X72ZQhzzRxwJw6+r54f629hgkwmlwm3SfH567eAxklJhCSMsuP1pjR479/Hh/G2STUlhLPGQc3fuy+P6/fv+Hu3p2ItC41y8f2sUbGGE5EHvBtAdbUJe5B0eKmucvMpu7eonptb2pyWVJRAq0bzI20ud+LTHTc/wDdFCbpUVW6wyvlkkt9+i3pLaJukpexeK3XisN7lE1po81tUjNSoqLb5XFhXxqSlUqxtCdSnOBMA6zZVClVu47JYtrUkJCabJDLLrfHf3nj891q/PKg6IQNNjQfvquNb2dvWV+sa0dW3QuBoi2hovQpsvKLCVG5Gj+DQOeUZuWKE29UlWbJsirfbkEKc8grJzIBTXcBxQEhnyNQWNWLhwxtZ3VeC10zkM+j8EotXOoceJcU5UsIZfLee1OV0tWVGxvCeKxhZ1C8gZZkpFCUiL/BMfnjwBw+Nqj2WhbxL6BIXysX6pJWupE/KScLK2qXAexmj98Ns7cE+P8Aw5NtXbxjG0Fvl6d6FCOj/Qtao3JlqinHB4pWtqdWhgjcGypGfOZ3JA8IzQ4psk2/7ob/ACtu4tF6/wBp50uYabtyvCNHUzLKsCy8rc2zm52PJsTerKQbMoNs+0eEIccLdSdzzGGpbaIo7ZVZeh6r0LMx7tLMaPEsliq8wleM1MISiMuO0S6L1pC/B3r4WcVKaHtHPVLkZJrl7wKsUCVDUparXJn5rUIU4fTiR5wEzf0bEx+xVwtqbxNCRczUq5vlPtDLS7Szt+3uXKFYEdHgxAi2zZUYUgFKfBMAO0O20q+i5OyYqlnRLQ3V+mRpGUvUKyiVJXhCZvmOglY08ypY3z87vK2mMux2FSDpG0dabtxs87wdJ19b7iVVKPTmN6r6sJFCZ0yyC2OmG9ZkhyghD7fh+3cq6yCXN6HZwx/hnAxC1WBb/VM+NbeL2mcFBBWG7k5jbSbMT+ag5nInJ9crdK6LWlMwXYXKUHSyecxK2NK4AIsmm5tEMyrODHx2Hfjw/heR5AynXbSP0/tI7S1OkUGoe5O69ru0Z1xwiWJF95FeYRWJQmNtKdGubWRG5OCxQm6Umzow8Ao0Kipp1jegp+C0jgulG2tI5TFJkqFhcngHn/0jw92F7Ggt5SDTh8l1dFVtydyFFXRvTDVV4Sy8KoKgvOuHvWqB8+lCxrC2rEvKSM7a3rUMcg0Uajjj6l6za8uzD0nd0wpH7O3XYsAKcv1YZWXF/YsnbylJeUidFBEAA1NAwHi2fzpb6PRVUkCETKpJZtfdIbx/XeP3rd378GqrQjgabVjLrRjryxk3j+P8OHujYDt4/tHnlW10Zp29p0d0ZIzebyboo1uoy/8AxnJ8TeHd8LM9X/aE/LMr44tzhdmj1oebM3aJuXqY9pnKo/ndjYh2ERi9ilPVPPJtbBO1H9U8x9LHsTKjBmmklmk1YRjGG/HjZW+f6o8vN5b8pZiSVoyilm/IBou01AcPCE67W7o+G6ytm2S27yH0t1tYN/mPrb6BAZVcPPiIOXJNqTdKFmfH4Y9se22ZOdTlzS5QZd/t1whx+fnfuszRzzBmJNGE02XNrzTcB5fHNtsAiWKkp1kgshuTy4leHEwkbWmww+2G2bhrb+G+MMcYxshL5v66Lhk+1XvPy0mkiPvHaCECWbTI09bjVCUWmlBAgCa7s3yD8TQd9tpMtnlhzsEOrqebLMuzdceb1cx8ffjZmVzXLVRVF1HWj0GWZlpBkUVM4J29ZEbgvG2kiJG1tudDcue3QqRmSdW1LNqxxTWwZqjZVRpw0yBReGvlmy5l8ZyslCtxIcCK3csNoeIRhCE2Q2plaZVDGEVMOMNLX6JRUl3NcNLjBCpcFMyM0qVAnKNsh9HFKR4bWxGA208wmUJCHS7ukxjww6NDXK//ALRFzC8pW6MMK9r2x+8T6xGwQYt7hh706Dvsd3DgWcml0o7wBSlVjLAy5BB6pXhcl/aAAOvefZYkAby02ifeAS+180mXluY5q4vh/wB6L3qXott2OnqYeHIXQ2thDkJs4DIxhRt9QuCmG1KnQLgr6VagdKvXMCuYQ1OqFQQaaUg5ojyRwFuLu4H4p4J7HYabSRtvIM7JlkBmlcJdcZJsrM9t2/4/Ru/j22GHvq0Pqfd3ZZM2E+iz0EhPOlHmNawmbjmmD7E++HSI9vdbY7o/6RUbzk0pW9iIlAISImp+Uu7V7gRplpMxv0br3bMdsuV1D2ce4FM2FcvFyM+Nq35LxjFAqIVctmmTzDkGoWKMxZOQMckJc4x9oyE33bqw90NH9IV9RayVLIYmsoHJqDlzM4iPng8OOywwUdnXaUn7RevQQqJUcaUUPCVQoJJIrYVQlCdSPOzg52dsygHdjaxTRj0QGujG9trmukEiiolxtdPTaqQREbJ7EKo3DONu/ZHjZozWILmu+X7QmoFjRmILZaPx4Md1lxd2G79vWaSko3QD/eHfL2X8e8nOtp68mNooKVFXUrezeG2yEUN6xGvplvWJ8wnWE69YjMDZzcwY2xp/vWz2J7X6PrLpUtVXQZXinaNvEu3fGOmLxKLGJUOn6hHWCUzld7W9N7bsydnUVK1JFjO7M6noqp+Z47Gr6TvrguUO30zI1xmnHKomMnxwGJOP0vM5IY8U/Xs/f2WuQ0Y4IX6n9Ju8VFONShfQXYXXo1oxiIndny7ABnEykPBOs5NdqgCDacIw3KNkVw2bdrbjfpWvXC0wriCVLQolxLL/AB5cVWAbXcaZ5tm7Ieje7Zm5EruCX3ugcO+3JQBJ4B3LaVfdx+PyStUx8w7qSU0025Pyflkk7eZL+zw7rOBL5It+1fPdVE+rNqTyytuZGPD57uzG11CF4qOVtSp2xzRgHCUZhsr8FU4Mc/Nb0BlmfygzgU/n231Xf4W56v5pnSOdwkeblb3qquvdZiDjC7msFSCoLtFOMYhMWkL025ApqBl2nco5Pq1i2bGMUm1Q2mGNlgb7VWDcUTKMnPzAuiaWYHt7Qy7jq+5Cx4kUNeLZKbEPRXflwlSOBMzaRy2DlhSpplnuAq+61egvJCOhJYzTr18ZozRxjBvNh/09lbKeai8piwrytq1yvHMcMJYxNT7wgfGc0s2OqRC5MiZ1RHDNhHCO0ymhhzgR4y6ytsHDjXD8cMMQvm7GiAiH3qXyIhI5h+NeAcANzzgLGWmQ2hB4fv6zvRvPVjoOiJauakCJa6mVJkw5HiVSrQJZ5iwlmViQiUpQmUxhNHcvgsS/o1mxLS6Go2tirGr1blWTsZOI6RLUaqCin2eaIeDPS6ISCnkM26HSZWydbHjFTGNlZW+UP2i5+ejvbYxzk3GiXdKOYWiTOWcBjMJ5W2AwZBAYIyYISRMsCYQSB7FAWoLOdSeeWUMsmrJLqwhJJJLCWUMMIehhD0fu/daOHRaphE08CRhMVKWaeMN2JE5I5Rf1kv8Ae4d1lZWQNxk9qQqfxKf/ACLO+6oIP+sP4oPyj+3hahnTxp1rp685LFqFMmDVLBJUzkjhGWKMbznElKqRA1IQSyqYTR2gEsZgE3c3Lhal6+lAmnPIaMmBNWMdaWEkMd3X5scbKyt9B8CRRfw67z1i5l5dy5cuA/PW2O//AOWvwmAB3dYUtDLamEmOlyZYjlnIn1xyx8ybjxl/raXUS4861JJHUhLJHCSWWTCEsIxjw393XZWVmsqT1UqnTU7zYJSggEYaGEd0IGo4Wdt4db1HSlFVE8Mq6KdegYzxRFmlzIJiFkIKUwpIxhLAqeaaJ080cYDPgSMJoQ1bFJ3NUkzXa3L3AXYUwIwqbS0OyPymdWXaHR4e3JhFVrs7PCyWUUite6PaxQoVnkAGMsk+UkglkhZWVkB06k/weXqa9ofjSX+p5mxlhmswo9WiLPVmFOWlusGaeaCZHvxxmwjrb8ebwxj34WkRuWqU8ITBJGTCeeEJYYwl9F+VDHnI9ubr/shZWVtIFYooYBECQQi4IJBBpVxW1/fAEUDRAEdU0IBH5RkaZE87bWUTathFQqY2M555o65SNaeM8+HXNGEsIRj34WVlZW9pXreYTga8Z/KH/mTH+P8AyWA45OUCkYErLt1z8BLfB/bb/9k='
);