import Note from '../models/Note.js';
import Project from '../models/Project.js';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// CREATE
export const createProject = async (req, res) => {
  try {
    const { title, description, team, endDate, priority, managers } = req.body;
    // const date = new Date();
    const currentDate = new Date().toISOString().split('T')[0];

    const managerIds = managers.map((manager) => mongoose.Types.ObjectId(manager));
    const teamIds = team.map((teamMember) => mongoose.Types.ObjectId(teamMember));
    // managers = managerIds;
    // team = teamIds;

    const newProject = new Project({
      title,
      description,
      startDate: currentDate,
      endDate: endDate,
      priority: priority ? priority : 'LOW',
      managers: managerIds,
      team: teamIds,
      notes: [],
      tickets: [],
    });

    await newProject.save();

    // //get all team members
    // const teamMembers = await Promise.all(
    //   team.map((userId) => User.findById(userId))
    // );

    // //add project to all team members
    // for (const member of teamMembers) {
    //   member.projects.push(newProject._id);
    //   await member.save();
    // }

    await User.updateMany({ _id: { $in: team } }, { $push: { projects: newProject._id } });
    // const projects = await Project.find();

    res.status(201).json(newProject._id);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

//READ

export const getProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    res.status(200).json(project);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    res.status(200).json(projects);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

export const getTeamMembers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { team } = await Project.findById(projectId);
    const teamMembers = await User.find({ _id: { $in: team } });
    res.status(200).json(teamMembers);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

export const getTickets = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { tickets } = await Project.findById(projectId);
    const projectTickets = await Ticket.find({ _id: { $in: tickets } });
    res.status(200).json(projectTickets);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

export const getNotes = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { notes } = await Project.findById(projectId);
    const projectNotes = await Note.find({ _id: { $in: notes } });
    res.status(200).json(projectNotes);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

//UPDATE

export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, startDate, endDate, priority } = req.body;
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $set: { title, description, startDate, endDate, priority } },
      { new: true }
    );
    res.status(200).json(projectId);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const addRemoveManager = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { projectUserId } = req.body;
    const project = await Project.findById(projectId);
    // const user = await User.findById(projectUserId);

    if (project.managers.includes(projectUserId)) {
      console.log('remove');
      project.managers.pull(mongoose.Types.ObjectId(projectUserId));
      // user.projects.pull(mongoose.Types.ObjectId(projectId));
      //remove manager
    } else {
      console.log('add');
      //add manager
      project.managers.push(mongoose.Types.ObjectId(projectUserId));
      // user.projects.push(mongoose.Types.ObjectId(projectId));
    }

    await project.save();
    // await user.save();
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const addRemoveTeamMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { projectUserId } = req.body;
    const project = await Project.findById(projectId);
    const user = await User.findById(projectUserId);

    if (project.team.includes(projectUserId)) {
      console.log('remove');
      project.team.pull(mongoose.Types.ObjectId(projectUserId));
      project.managers.pull(mongoose.Types.ObjectId(projectUserId));
      user.projects.pull(mongoose.Types.ObjectId(projectId));
      //remove manager
    } else {
      console.log('add');
      //add manager
      project.team.push(mongoose.Types.ObjectId(projectUserId));
      user.projects.push(mongoose.Types.ObjectId(projectId));
    }

    await project.save();
    await user.save();
    res.status(200).json({ project: project, user: user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const setProjectPriority = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { priority } = req.query;

    const project = await Project.findByIdAndUpdate(
      projectId,
      {
        priority: JSON.stringify(priority).toUpperCase,
      },
      { new: true }
    );

    // project.priority = JSON.stringify(priority).toUpperCase;
    // await project.save();

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

//DELETE
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    const projectIdObject = mongoose.Types.ObjectId(projectId);
    // if (!project) {
    //   return res.status(404).json({ msg: "Project not found" });
    // }
    const tickets = await Ticket.find({ _id: { $in: project.tickets } });

    await User.updateMany({ projects: projectIdObject }, { $pull: { projects: projectIdObject } });

    for (const ticket of tickets) {
      const user = await User.findById(ticket.assigned);
      if (!user) {
        continue;
      }
      user.tickets.pull(ticket._id);
      await user.save();
      await ticket.remove();
    }

    // await Ticket.deleteMany({ project: projectId })
    // await User.updateOne({ _id: userId }, { $pull: { tickets: ticketId } })

    await Note.deleteMany({ parent: project._id });

    await project.remove();

    res.status(204).send();
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};
