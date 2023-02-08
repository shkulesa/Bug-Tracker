import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    submitter: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    submitterName: {
      type: String,
      required: true,
    },
    submittedDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: {
      type: Array,
      default: [],
    },
    assigned: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    assignedName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['OPEN', 'CLOSED'],
      default: 'OPEN',
    },
    category: {
      type: String,
      enum: ['Bugs/Issues', 'Development', 'Other'],
      required: true,
    },
    history: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        changedDate: {
          type: Date,
          required: true,
          default: Date.now,
        },
        assigned: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        assignedName: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ['OPEN', 'CLOSED'],
          required: true,
        },
        category: {
          type: String,
          enum: ['Bugs/Issues', 'Development', 'Other'],
          required: true,
        },
        project: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        operation: {
          type: String,
          required: true,
        },
      },
    ],
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamp: true }
);

const Ticket = mongoose.model('Ticket', TicketSchema);

export default Ticket;
