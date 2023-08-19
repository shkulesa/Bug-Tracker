import { useDispatch } from 'react-redux';
import { API_BASE_URL } from 'config';
import { setTickets } from 'state/slices/userSlice';

const useFetchTickets = () => {
  const dispatch = useDispatch();

  const fetchTickets = async (user, token) => {
    const url = user.role !== 'DEVELOPER' ? `${API_BASE_URL}/tickets/all` : `${API_BASE_URL}/users/${user._id}/tickets`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    let userTickets;
    if (user.role === 'SUBMITTER') {
      const allTickets = response.status === 404 ? [] : await response.json();
      userTickets = allTickets.filter((ticket) => ticket.submitter === user._id);
    } else {
      userTickets = response.status === 404 ? [] : await response.json();
    }

    dispatch(setTickets({ tickets: userTickets }));
    // computeTicketData(userTickets);
  };

  return fetchTickets;
};

export default useFetchTickets;
