import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  createTicket,
  getAllTickets,
  getNotes,
  getTicket,
  getAssigned,
  updateStatus,
  deleteTicket,
  // updateAssigned,
} from '../controllers/tickets.js';

const router = express.Router();

//CREATE
router.post('/create', verifyToken, createTicket); // get details about project from body

//READ
router.get('/all', verifyToken, getAllTickets);
router.get('/:ticketId', verifyToken, getTicket);
router.get('/:ticketId/notes', verifyToken, getNotes);
router.get('/:ticketId/assigned', verifyToken, getAssigned);

//UPDATE
router.patch('/:ticketId/status', verifyToken, updateStatus);
// router.patch('/assigned/:ticketId/:id', verifyToken, updateAssigned);

//DELETE
router.delete('/:ticketId', verifyToken, deleteTicket);

export default router;
