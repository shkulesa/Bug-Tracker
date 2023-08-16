import { API_BASE_URL } from 'config';
import { useDispatch } from 'react-redux';
import { setProject, setProjectTeam } from 'state/slices/projectSlice';

const useFetchProjectInfo = () => {
  const dispatch = useDispatch();

  const fetchProject = async (projectId, token) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const project = await response.json();

    dispatch(setProject({ project: project }));
    // return project;
  };

  const fetchTeamMembers = async (projectId, token) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/team`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const team = await response.json();

    dispatch(setProjectTeam({ team: team }));
  };

  return { fetchProject, fetchTeamMembers };
};

export default useFetchProjectInfo;
