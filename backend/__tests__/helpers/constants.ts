
export const API_URL = 'http://localhost:2001';

export const BASE_TIME = new Date("2024-07-01T12:00:00+10:00");

export const ADMINS = [
  {
    zid: 1111111,
    email: 'admin1@email.com',
    fullname: 'Admin One',
    title: 'Mr',
    school: 'CSE',
    faculty: 'ENG',
    role: 'Professional',
    usergrp: 'admin'
  },
  {
    zid: 2222222,
    email: 'admin2@email.com',
    fullname: 'Admin Two',
    title: 'Ms',
    school: 'CSE',
    faculty: 'ENG',
    role: 'Professional',
    usergrp: 'admin'
  },
];

export const STAFF = [
  {
    zid: 3333333,
    email: 'staff1@email.com',
    fullname: 'Staff One',
    title: 'Mr',
    school: 'CSE',
    faculty: 'ENG',
    role: 'Academic',
    usergrp: 'csestaff'
  },
  {
    zid: 4444444,
    email: 'staff2@email.com',
    fullname: 'Staff Two',
    title: 'Ms',
    school: 'CSE',
    faculty: 'ENG',
    role: 'Academic',
    usergrp: 'csestaff'
  },
];

export const HDR = [
  {
    zid: 5555555,
    email: 'hdr1@email.com',
    fullname: 'Hdr One',
    title: 'Mr',
    school: 'CSE',
    faculty: 'ENG',
    role: 'PhD',
    usergrp: 'hdr'
  },
  {
    zid: 6666666,
    email: 'hdr2@email.com',
    fullname: 'Hdr Two',
    title: 'Ms',
    school: 'CSE',
    faculty: 'ENG',
    role: 'MRes',
    usergrp: 'hdr'
  },
];

export const OTHER = [
  {
    zid: 7777777,
    email: 'other1@email.com',
    fullname: 'Other One',
    title: 'Mr',
    school: 'CSE',
    faculty: 'ENG',
    role: null,
    usergrp: 'other'
  },
  {
    zid: 8888888,
    email: 'other2@email.com',
    fullname: 'Other Two',
    title: 'Ms',
    school: 'MECH',
    faculty: 'ENG',
    role: null,
    usergrp: 'other'
  },
];

export const ROOM = [
  {
    id: 'K-K17-111',
    name: 'Room 1',
    minreqgrp: 'hdr',
    minbookgrp: 'admin',
    capacity: 5,
    roomnumber: '111',
    type: 'Meeting Room'
  },
  {
    id: 'K-K17-222',
    name: 'Room 2',
    minreqgrp: 'csestaff',
    minbookgrp: 'csestaff',
    capacity: 100,
    roomnumber: '222',
    type: 'Seminar Room'
  },
];

export const DESK = [
  {
    id: 'K-K17-333-1',
    name: 'Desk 1',
    minreqgrp: 'hdr',
    minbookgrp: 'hdr',
    floor: 'K17L3',
    room: '333',
    desknumber: 1
  },
  {
    id: 'K-K17-444-1',
    name: 'Desk 2',
    minreqgrp: 'csestaff',
    minbookgrp: 'admin',
    floor: 'K17L4',
    room: '444',
    desknumber: 1
  },
];
