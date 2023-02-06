import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
      min: 2,
      max: 64,
    },
    description: {
      type: String,
      required: true,
      min: [2, 'Last name is too short'],
      max: 16,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: Array,
      default: [],
    },
    tickets: {
      type: Array,
      default: [],
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'LOW',
      required: true,
    },
    team: {
      type: Array,
      default: [],
      required: true,
    },
    managers: {
      type: Array,
      default: [],
      required: true,
    },
  },
  { timestamp: true }
);

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
