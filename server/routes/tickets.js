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
  updateTicket,
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
router.patch('/:ticketId/update', verifyToken, updateTicket);

//DELETE
router.delete('/:ticketId', verifyToken, deleteTicket);

export default router;
