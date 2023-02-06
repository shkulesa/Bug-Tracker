import express from 'express';
import { createNote, deleteNote, getNote } from '../controllers/notes.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

//Create

router.post('/create', verifyToken, createNote);

// READ

router.get('/:noteId', verifyToken, getNote);

// DELETE

router.delete('/:noteId/delete', verifyToken, deleteNote);
export default router;
