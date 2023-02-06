import mongoose from 'mongoose';
import ROLES from '../util/ROLES.js';

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: [2, 'First name is too short'],
      max: 16,
    },
    lastName: {
      type: String,
      required: true,
      min: [2, 'Last name is too short'],
      max: 16,
    },
    email: {
      type: String,
      required: true,
      max: 16,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
      max: 16,
    },
    projects: {
      type: Array,
      default: [],
    },
    tickets: {
      type: Array,
      default: [],
    },
    role: {
      type: String,
      enum: ROLES.list,
      default: 'SUBMITTER',
    },
  },
  { timestamp: true }
);

const User = mongoose.model('User', UserSchema);

export default User;
