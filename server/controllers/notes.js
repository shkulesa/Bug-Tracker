import Note from '../models/Note.js';
import Project from '../models/Project.js';
import Ticket from '../models/Ticket.js';
import mongoose from 'mongoose';

//  CREATE

export const createNote = async (req, res) => {
  try {
    const { author, content, kind, parentId } = req.body;

    const date = new Date();
    const currentDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();

    const newNote = new Note({
      author,
      content,
      kind,
      parent: parentId,
      writtenDate: currentDate,
    });

    await newNote.save();

    if (kind === 'PROJECT') {
      const parent = await Project.findByIdAndUpdate(parentId, { $push: { notes: newNote._id } }, { new: true });
    } else {
      console.log('ticketNote');
      const parent = await Ticket.findByIdAndUpdate(parentId, { $push: { notes: newNote._id } }, { new: true });
    }

    res.status(201).json(newNote);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

//READ

export const getNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    res.status(200).json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//DELETE

export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const id = mongoose.Types.ObjectId(noteId);
    // console.log(id);
    const note = await Note.findById(id);
    if (!note) {
      console.log('note not found');
      return;
    }
    // console.log(note);
    const project = await Project.findOne({ _id: note.parent });
    if (!project) {
      console.log('project not found');
      return;
    }
    // console.log(project);
    if (!project.notes.includes(id)) {
      console.log('note id not in project notes array');
      return;
    }
    await Project.findOneAndUpdate({ _id: note.parent }, { $pull: { notes: id } }, { new: true });
    await Note.findByIdAndDelete(noteId);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
