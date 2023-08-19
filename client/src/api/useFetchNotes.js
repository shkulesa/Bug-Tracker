import { API_BASE_URL } from 'config';
import { useDispatch } from 'react-redux';
import { addProjectNote } from 'state/slices/projectSlice';
import { addTicketNote } from 'state/slices/ticketSlice';

const useFetchNotes = () => {
  const dispatch = useDispatch();

  const createTicketNote = async (values, user, token) => {
    if (user.role !== 'VIEWER') {
      const response = await fetch(`${API_BASE_URL}/notes/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(values),
      });

      const newNote = await response.json();
      if (newNote) {
        dispatch(addTicketNote({ note: newNote }));
      }
    }
  };

  const createProjectNote = async (values, user, token) => {
    if (user.role !== 'VIEWER') {
      const response = await fetch(`${API_BASE_URL}/notes/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(values),
      });

      const newNote = await response.json();
      if (newNote) {
        dispatch(addProjectNote({ note: newNote }));
      }
    }
  };

  const deleteNote = async (noteId, token) => {
    await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  return { createTicketNote, createProjectNote, deleteNote };
};

export default useFetchNotes;
