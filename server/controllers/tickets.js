import Project from '../models/Project.js';
import Ticket from '../models/Ticket.js';
import Note from '../models/Note.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const updateHistory = (ticket, operation) => {
  const date = new Date();
  const currentDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();

  const newHistory = {
    title: ticket.title,
    description: ticket.description,
    changedDate: currentDate,
    assigned: ticket.assigned,
    assignedName: ticket.assignedName,
    status: ticket.status,
    category: ticket.category,
    project: ticket.project,
    operation: operation,
  };

  ticket.history.push(newHistory);
};

//CREATE

export const createTicket = async (req, res) => {
  try {
    const { title, description, submitter, submitterName, assigned, assignedName, category, projectId } = req.body;

    const project = await Project.findById(projectId);
    const currentDate = new Date().toISOString();

    const newTicket = new Ticket({
      title,
      description,
      submitter,
      submitterName,
      submittedDate: currentDate,
      assigned,
      assignedName,
      category,
      notes: [],
      status: 'OPEN',
      history: [],
      project: projectId,
    });

    await Project.findByIdAndUpdate(
      projectId,
      {
        $push: { tickets: newTicket._id },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(assigned, { $push: { tickets: newTicket._id } });

    updateHistory(newTicket, 'Ticket Creation');

    await newTicket.save();

    res.status(201).json(newTicket._id);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

//READ

export const getTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId);
    res.status(200).json(ticket);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({});
    res.status(200).json(tickets);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getNotes = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { notes } = await Ticket.findById(ticketId);
    const ticketNotes = await Note.find({ _id: { $in: notes } });
    res.status(200).json(ticketNotes);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getAssigned = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { assigned } = await Ticket.findById(ticketId);
    const assignedDev = await User.findById(assigned);

    res.status(200).json(assignedDev);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

//UPDATE

export const updateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { title, description, category, submittedDate, assigned, assignedName, status, project } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      { $set: { title, description, category, submittedDate, assigned, assignedName, status, project } },
      { new: true }
    );
    updateHistory(ticket, 'Edited');
    await ticket.save();
    res.status(200).json(ticketId);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId);
    const newStatus = ticket.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    ticket.status = newStatus;
    updateHistory(ticket, 'Status');
    await ticket.save();
    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//DELETE

export const deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Find the ticket to be deleted
    const ticket = await Ticket.findById(ticketId);
    const ticketIdObject = mongoose.Types.ObjectId(ticketId);

    // Update the assigned user's `tickets` array
    await User.findByIdAndUpdate(ticket.assigned, { $pull: { tickets: ticketIdObject } });

    // Update the parent project's `tickets` array
    await Project.findByIdAndUpdate(ticket.project, { $pull: { tickets: ticketIdObject } });

    // Delete all associated notes
    await Note.deleteMany({ parent: ticket._id });

    // Remove the ticket
    await ticket.remove();

    // Send a successful response
    res.status(204).send();
  } catch (err) {
    // Send an error response
    res.status(500).json({ message: err.message });
  }
};
