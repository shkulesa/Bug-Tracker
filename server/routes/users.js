import express from 'express';
import {
  getUser,
  addRemoveUserFromProject,
  getUserProjects,
  getUserTickets,
  addRemoveUserFromTicket,
  getAllUsers,
  updateRole,
} from '../controllers/users.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Read
router.get('/all', verifyToken, getAllUsers);
router.get('/:id', verifyToken, getUser);
router.get('/:id/projects', verifyToken, getUserProjects);
router.get('/:id/tickets', verifyToken, getUserTickets);

// Update
router.patch('/:id/:projectId/manage-projects', verifyToken, addRemoveUserFromProject);
router.patch(':id/:ticketId/manage-tickets/', verifyToken, addRemoveUserFromTicket);
router.patch('/:id/role', verifyToken, updateRole);

//Delete

export default router;
