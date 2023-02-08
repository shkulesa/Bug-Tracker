import User from '../models/User.js';
import Project from '../models/Project.js';
import Ticket from '../models/Ticket.js';

//READ

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  // console.log('GAU');
  try {
    // console.log('try');
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    // console.log('catch');
    res.status(404).json({ msg: err.message });
  }
};

export const getUserProjects = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const projects = await Promise.all(user.projects.map((id) => Project.findById(id)));

    const formattedProjects = projects.map(({ _id, title, description, startDate, endDate, priority }) => {
      return { _id, title, description, startDate, endDate, priority };
    });
    res.status(200).json(formattedProjects);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

export const getUserTickets = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const tickets = await Promise.all(user.tickets.map((id) => Ticket.findById(id)));
    // const tickets = await Ticket.find({ _id: { $in: user.tickets } });
    console.log(tickets);
    const formattedTickets = tickets.map(({ _id, title, category, submittedDate, submitter, status, history }) => {
      return { _id, title, category, submittedDate, submitter, status, history };
    });
    console.log(formattedTickets);
    res.status(200).json(formattedTickets);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

//UPDATE

export const addRemoveUserFromProject = async (req, res) => {
  try {
    const { id, projectId } = req.params;
    const user = await User.findById(id);
    const project = await Project.findById(projectId);

    if (user.projects.includes(projectId)) {
      //remove user from project
      user.projects = user.projects.filter((id) => id !== projectId);
      project.team = project.team.filter((userId) => userId !== id);
      project.managers = projects.managers.filter((userId) => userId !== id);
    } else {
      //add user to project
      user.projects.push(projectId);
      project.team.push(id);
    }

    await user.save();
    await project.save();

    const projects = await Promise.all(user.projects.map((id) => Project.findById(id)));

    const formattedProjects = projects.map(({ _id, description, startDate, endDate, priority }) => {
      return { _id, description, startDate, endDate, priority };
    });

    const team = project.team;

    res.status(200).json({ projects: formattedProjects, team: team });
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

export const addRemoveUserFromTicket = async (req, res) => {
  try {
    const { id, ticketId } = req.params;
    const user = await User.findById(id);
    const ticket = await Ticket.findById(ticketId);

    if (user.tickets.includes(ticketId)) {
      //remove user from ticket
      user.tickets = user.tickets.filter((id) => id !== ticketId);
      ticket.assigned = ticket.assigned.filter((userId) => userId !== id);
      ticket.managers = tickets.managers.filter((userId) => userId !== id);
    } else {
      //add user to ticket
      user.tickets.push(ticketId);
      ticket.assigned.push(id);
    }

    await user.save();
    await ticket.save();

    const tickets = await Promise.all(user.tickets.map((id) => Ticket.findById(id)));

    const formattedTickets = tickets.map(({ _id, title, submittedDate, status }) => {
      return { _id, title, submittedDate, status };
    });

    const assigned = ticket.assigned;

    res.status(200).json({ tickets: formattedTickets, assigned: assigned });
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

export const updateRole = async (req, res) => {
  console.log('UR');
  try {
    console.log('Try');
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      {
        role: role,
      },
      { new: true }
    );

    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.log('catch');
    res.status(404).json({ msg: err.message });
  }
};
