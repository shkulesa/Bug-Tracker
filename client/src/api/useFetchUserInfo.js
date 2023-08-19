import { useDispatch } from 'react-redux';
import { API_BASE_URL } from 'config';
import { setUsers } from 'state/slices/userSlice';

const useFetchUserInfo = () => {
  const dispatch = useDispatch();

  const updateUserRole = async (userId, values, token) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(values),
    });
    const updatedUsers = await response.json();

    //update list of users
    dispatch(
      setUsers({
        users: updatedUsers,
      })
    );
  };

  return updateUserRole;
};

export default useFetchUserInfo;
