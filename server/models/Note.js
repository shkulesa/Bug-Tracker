import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },
    writtenDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    content: {
      type: String,
      required: true,
    },
    kind: {
      type: String,
      enum: ['TICKET', 'PROJECT'],
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamp: true }
);

const Note = mongoose.model('Note', NoteSchema);

export default Note;
