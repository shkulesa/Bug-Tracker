import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  getProject,
  getAllProjects,
  createProject,
  addRemoveManager,
  setProjectPriority,
  deleteProject,
  getTeamMembers,
  getTickets,
  getNotes,
  updateProject,
  addRemoveTeamMember,
} from '../controllers/projects.js';
// import { verify } from 'jsonwebtoken';

const router = express.Router();

//CREATE
router.post('/create', verifyToken, createProject);

// READ
router.get('/all', verifyToken, getAllProjects);
router.get('/:projectId', verifyToken, getProject);
router.get('/:projectId/team', verifyToken, getTeamMembers);
router.get('/:projectId/tickets', verifyToken, getTickets);
router.get('/:projectId/notes', verifyToken, getNotes);

// UPDATE
router.patch('/:projectId/update', verifyToken, updateProject);
router.patch('/:projectId/managers', verifyToken, addRemoveManager);
router.patch('/:projectId/team', verifyToken, addRemoveTeamMember);
router.patch('/:projectId/priority', verifyToken, setProjectPriority);
//update description

//DELETE
router.delete('/:projectId', verifyToken, deleteProject);

export default router;
