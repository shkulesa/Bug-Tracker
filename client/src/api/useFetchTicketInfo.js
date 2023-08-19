import { API_BASE_URL } from 'config';
import { useDispatch } from 'react-redux';
import { setTicket, setTicketAssigned, setTicketNotes } from 'state/slices/ticketSlice';

const useFetchTicketInfo = () => {
  const dispatch = useDispatch();

  //create

  const createTicket = async (values, token) => {
    const response = await fetch(`${API_BASE_URL}/tickets/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(values),
    });

    const newTicketId = await response.json();
    return newTicketId;
  };

  //read

  const fetchTicket = async (ticketId, token) => {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const ticket = await response.json();

    dispatch(setTicket({ ticket: ticket }));
    return ticket;
  };

  const fetchTicketNotes = async (ticketId, token) => {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/notes`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const notes = await response.json();
    dispatch(setTicketNotes({ notes: notes }));
  };

  const fetchTicketAssigned = async (ticketId, token) => {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/assigned`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const assigned = await response.json();

    dispatch(setTicketAssigned({ assigned: assigned }));
  };

  //update

  const updateTicketStatus = async (ticketId, token) => {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });

    const updatedTicket = await response.json();
    dispatch(
      setTicket({
        ticket: updatedTicket,
      })
    );
  };

  const updateTicket = async (values, ticketId, token) => {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(values),
    });

    const newTicket = await response.json();
    return newTicket;
  };

  //delete

  const deleteTicket = async (user, ticketId, token) => {
    if (user.role === 'ADMIN') {
      const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  };

  return {
    createTicket,
    fetchTicket,
    fetchTicketNotes,
    fetchTicketAssigned,
    updateTicketStatus,
    updateTicket,
    deleteTicket,
  };
};

export default useFetchTicketInfo;
