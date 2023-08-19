import { API_BASE_URL } from 'config';
import { useDispatch } from 'react-redux';
import { setEditProject, setEditProjectUser, setEditTeam } from 'state/slices/editSlice';
import { setProject, setProjectNotes, setProjectTeam, setProjectTickets } from 'state/slices/projectSlice';
import { updateManagedProjects } from 'state/slices/userSlice';

const useFetchProjectInfo = () => {
  const dispatch = useDispatch();

  // create

  const createProject = async (values, token) => {
    const response = await fetch(`${API_BASE_URL}/projects/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(values),
    });

    const newProjectId = await response.json();
    return newProjectId;
  };

  // read

  const fetchProject = async (projectId, token) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const project = await response.json();

    dispatch(setProject({ project: project }));
    //return project for managers list and project name
    return project;
  };

  const fetchProjectForEdit = async (projectId, token) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const project = await response.json();

    dispatch(setEditProject({ editProject: project }));
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

  const fetchTeamMembersForEdit = async (projectId, token) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/team`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const team = await response.json();

    dispatch(setEditTeam({ editTeam: team }));
  };

  const fetchProjectTickets = async (projectId, token) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tickets`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const tickets = await response.json();

    dispatch(setProjectTickets({ tickets: tickets }));
  };

  const fetchProjectNotes = async (projectId, token) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/notes`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const notes = await response.json();

    dispatch(setProjectNotes({ notes: notes }));
  };

  // update

  const updateProject = async (values, projectId, token) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(values),
    });
  };

  const toggleProjectManager = async (values, projectId, token) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/managers`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(values),
    });
    const updatedProject = await response.json();
    dispatch(
      updateManagedProjects({
        updatedProject: updatedProject,
      })
    );
    dispatch(
      setEditProject({
        editProject: updatedProject,
      })
    );
    return updatedProject;
  };

  const toggleProjectMember = async (values, projectId, token) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/team`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(values),
    });
    const updatedProject = await response.json();
    dispatch(
      updateManagedProjects({
        updatedProject: updatedProject.project,
      })
    );
    dispatch(
      setEditProject({
        editProject: updatedProject.project,
      })
    );
    dispatch(
      setEditProjectUser({
        projectUser: updatedProject.user,
      })
    );

    fetchTeamMembersForEdit(projectId, token);
    return updatedProject;
  };

  // delete

  const deleteProject = async (projectId, user, token) => {
    if (user.role === 'ADMIN') {
      await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  };

  return {
    createProject,
    fetchProject,
    fetchProjectForEdit,
    fetchTeamMembers,
    fetchTeamMembersForEdit,
    fetchProjectTickets,
    fetchProjectNotes,
    deleteProject,
    updateProject,
    toggleProjectManager,
    toggleProjectMember,
  };
};

export default useFetchProjectInfo;
