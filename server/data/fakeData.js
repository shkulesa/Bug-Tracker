import mongoose from 'mongoose';

const ids = {
  admin: new mongoose.Types.ObjectId(),
  project1: new mongoose.Types.ObjectId(),
  ticket1: new mongoose.Types.ObjectId(),
  note1: new mongoose.Types.ObjectId(),
  note2: new mongoose.Types.ObjectId(),
};

export const users = [
  {
    _id: ids.admin,
    firstName: 'Demo',
    lastName: 'Admin',
    email: 'demoAdmin@email.com',
    password: 'admin',
    projects: [ids.project1],
    tickets: [ids.ticket1],
    role: 'ADMIN',
  },
];

export const projects = [
  {
    _id: ids.project1,
    title: 'Bug Tracker',
    description: 'Build a Bug tracker to learn MERN stack',
    startDate: '2023-01-02',
    endDate: '2023-02-28',
    notes: [ids.note1],
    tickets: [ids.ticket1],
    priority: 'HIGH',
    team: [ids.admin],
    managers: [ids.admin],
  },
];

export const tickets = [
  {
    _id: ids.ticket1,
    title: 'Work on front end',
    submitter: ids.admin,
    submittedDate: '2023-01-15',
    notes: [ids.note1],
    assigned: ids.admin,
    status: 'OPEN',
  },
];

export const notes = [
  {
    _id: ids.note1,
    author: ids.admin,
    writtenDate: '2023-01-15',
    content: 'This is a note within a project',
    kind: 'PROJECT',
    parent: ids.project1,
  },
  {
    _id: ids.note2,
    author: ids.admin,
    writtenDate: '2023-01-15',
    content: 'This is a note within a ticket',
    kind: 'TICKET',
    parent: ids.ticket1,
  },
];
