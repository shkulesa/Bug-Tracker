// useFetchProjects.js
import { useDispatch } from 'react-redux';
import { API_BASE_URL } from '../config';
import { setManagedProjects, setProjects } from 'state/slices/userSlice';

const useFetchProjects = () => {
  const dispatch = useDispatch();

  //fetch a user's projects
  const fetchProjects = async (user, token) => {
    //create appropriate URL based on user's role
    const url =
      user.role === 'ADMIN' || user.role === 'VIEWER'
        ? `${API_BASE_URL}/projects/all`
        : `${API_BASE_URL}/users/${user._id}/projects`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const userProjects = response.status === 404 ? [] : await response.json();

    //update state
    dispatch(setProjects({ projects: userProjects }));
  };

  //fetch projects in which user is a manager
  const fetchManagedProjects = async (user, token) => {
    //create appropriate URL based on user's role
    const url =
      user.role === 'ADMIN' || user.role === 'VIEWER'
        ? `${API_BASE_URL}/projects/all`
        : `${API_BASE_URL}/users/${user._id}/projects`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    let managedProjects;

    //filter users's managed projects
    if (user.role === 'ADMIN' || user.role === 'VIEWER') {
      managedProjects = response.status === 404 ? [] : await response.json();
    } else {
      const allProjects = response.status === 404 ? [] : await response.json();
      managedProjects = allProjects.filter(({ managers }) => managers.includes(user._id));
    }

    //update state
    dispatch(setManagedProjects({ managedProjects: managedProjects }));
  };

  return { fetchProjects, fetchManagedProjects };
};

export default useFetchProjects;
