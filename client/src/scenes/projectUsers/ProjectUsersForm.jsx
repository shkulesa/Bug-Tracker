import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Typography, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUsers, setEditUser, updateProject, setProjectTeam, setEditProject } from 'state';
import ProjectUsersTable from './ProjectUsersTable';

const ProjectUsersForm = ({ linkToProject = true }) => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.content.users);
  const token = useSelector((state) => state.token);
  const project = useSelector((state) => state.editProject);
  const team = useSelector((state) => state.project.team);
  const [projectUserId, setProjectUserId] = useState('-CHOOSE A USER-');
  const [currentProject, setCurrentProject] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [isManager, setIsManager] = useState(false);
  const [isIncluded, setIsIncluded] = useState(false);

  const values = {
    projectUserId: projectUserId,
  };

  const getUsers = async () => {
    const response = await fetch('http://localhost:3001/users/all', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const users = await response.json();
    dispatch(setUsers({ users: users }));
  };

  const getTeamMembers = async (projectId) => {
    const response = await fetch(`http://localhost:3001/projects/${projectId}/team`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const team = await response.json();

    dispatch(setProjectTeam({ team: team }));
  };

  const handleChange = (event) => {
    setProjectUserId(event.target.value);
  };

  const toggleMember = async () => {
    if (projectUserId && currentProject && projectUserId !== '-CHOOSE A USER-') {
      const response = await fetch(`http://localhost:3001/projects/${currentProject._id}/team`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(values),
      });
      const updatedProject = await response.json();
      dispatch(
        updateProject({
          updatedProject: updatedProject.project,
        })
      );
      dispatch(
        setEditProject({
          editProject: updateProject.project,
        })
      );
      dispatch(
        setEditUser({
          user: updatedProject.user,
        })
      );

      setCurrentProject(updatedProject.project);
      setCurrentTeam(updatedProject.project.team);
      getTeamMembers(updatedProject.project._id);
    }
  };

  const toggleManager = async () => {
    if (projectUserId && currentProject && projectUserId !== '-CHOOSE A USER-') {
      const response = await fetch(`http://localhost:3001/projects/${currentProject._id}/managers`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(values),
      });
      const updatedProject = await response.json();
      dispatch(
        updateProject({
          updatedProject: updatedProject,
        })
      );
      dispatch(
        setEditProject({
          editProject: updatedProject,
        })
      );
      setCurrentProject(updatedProject);
    }
  };

  useEffect(() => {
    getUsers();

    if (linkToProject && project) {
      setCurrentProject(project);
      setCurrentTeam(project.team);
    } else {
      setCurrentProject(null);
      setCurrentTeam(null);
    }
  }, []);

  useEffect(() => {
    if (!currentProject || !currentTeam) return;

    setIsIncluded(currentTeam.includes(projectUserId));
    setIsManager(currentProject.managers.includes(projectUserId));
  }, [currentProject, currentTeam, projectUserId, toggleMember]);

  useEffect(() => {
    setProjectUserId('-CHOOSE A USER-');

    if (project) {
      setCurrentProject(project);
      setCurrentTeam(project.team);
    }
  }, [project, team]);

  return (
    <Paper sx={{ height: '100%', backgroundColor: palette.background.main }}>
      <Box
        height='100%'
        mt='.5rem'
        p='1rem'
        sx={{
          borderRadius: '4px',
        }}
      >
        <FlexBetween
          borderBottom={`1px solid ${palette.neutral.medium}`}
          pb='1rem'
        >
          <Header
            title={!currentProject ? 'SELECT A PROJECT' : 'Edit Project Users'}
            subtitle={!currentProject ? 'No project selected' : currentProject.title}
          />
          {currentProject && (
            <Button
              sx={{
                m: '1rem .5rem 0 0',
                p: '.5rem',
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                '&:hover': { color: palette.primary.main },
              }}
              onClick={() => {
                navigate(`/projects/info/${currentProject._id}`);
              }}
            >
              Go To Project
            </Button>
          )}
        </FlexBetween>
        {currentProject && (
          <Box
            width='100%'
            mt='1rem'
          >
            <Box
              height='300px'
              pb='1rem'
              borderBottom={`1px solid ${palette.neutral.medium}`}
            >
              <ProjectUsersTable
                team={team}
                project={currentProject}
              />
            </Box>
            <Typography
              variant='h5'
              color={palette.neutral.main}
              sx={{ pb: '.5rem', m: '.5rem' }}
            >
              Select a User:
            </Typography>
            <FormControl fullWidth>
              <InputLabel id='user-label'>User</InputLabel>
              <Select
                labelId='user-label'
                label='User'
                value={projectUserId}
                onChange={handleChange}
              >
                <MenuItem value={'-CHOOSE A USER-'}>-CHOOSE A USER-</MenuItem>
                {users.map((user) => {
                  return (
                    <MenuItem
                      key={user._id}
                      value={user._id}
                    >
                      {user.firstName + ' ' + user.lastName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {projectUserId !== '-CHOOSE A USER-' && (
              <Box
                p='0rem 4rem'
                justifyContent='space-around'
                display='flex'
                align-items='center'
                width='90%'
              >
                <Box textAlign='center'>
                  <Button
                    disabled={user.role === 'VIEWER' || projectUserId === '-CHOOSE A USER-'}
                    onClick={toggleMember}
                    variant='outlined'
                    sx={{
                      width: '60%',
                      m: '2rem 0',
                      p: '.5rem 3rem',
                      color: isIncluded ? '#FF7572' : '#72FF7B',
                      borderColor: isIncluded ? '#FF7572' : '#72FF7B',
                      '&:hover': {
                        borderColor: isIncluded ? '#FF7572' : '#72FF7B',
                        backgroundColor: isIncluded ? '#FFABA92C' : '#72FF7B2C',
                      },
                    }}
                  >
                    {isIncluded ? 'Remove' : 'Add'}
                  </Button>
                </Box>
                {isIncluded && (
                  <Box textAlign='center'>
                    <Button
                      disabled={user.role === 'VIEWER' || projectUserId === '-CHOOSE A USER-'}
                      onClick={toggleManager}
                      variant='outlined'
                      sx={{
                        width: '60%',
                        m: '2rem 0',
                        p: '.5rem 3rem',
                      }}
                    >
                      {isManager ? 'Demote' : 'Promote'}
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default ProjectUsersForm;
