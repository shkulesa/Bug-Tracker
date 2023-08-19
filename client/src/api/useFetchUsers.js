import { API_BASE_URL } from 'config';
import { useDispatch } from 'react-redux';
import { setUsers } from 'state/slices/userSlice';

const useFetchUsers = () => {
  const dispatch = useDispatch();

  const fetchUsers = async (token) => {
    const response = await fetch(`${API_BASE_URL}/users/all`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const users = await response.json();
    dispatch(setUsers({ users: users }));
  };

  return fetchUsers;
};

export default useFetchUsers;
