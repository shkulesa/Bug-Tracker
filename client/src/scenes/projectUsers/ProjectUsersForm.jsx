import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Typography,
  useTheme,
} from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUsers, setEditUser, updateProject, setProjectTeam, setEditProject } from 'state';
import ProjectUsersTable from './ProjectUsersTable';

const ProjectUsersForm = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.content.users);
  const token = useSelector((state) => state.token);
  const project = useSelector((state) => state.editProject);
  const [pageType, setPageType] = useState('INFO');
  const [projectUserId, setProjectUserId] = useState('-CHOOSE A USER-');
  const [user, setUser] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [isManager, setIsManager] = useState(false);
  const [isIncluded, setIsIncluded] = useState(false);
  const team = useSelector((state) => state.project.team);
  const [managers, setManagers] = useState([]);
  // const { managers } = useSelector((state) => state.content.project);

  console.log(users);

  const values = {
    projectUserId: projectUserId,
  };

  const togglePageType = () => {
    setPageType(pageType === 'INFO' ? 'EDIT' : 'INFO');
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

  // const getTeamMembers = async (projectId) => {
  //   const response = await fetch(`http://localhost:3001/projects/${projectId}/team`, {
  //     method: 'GET',
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   const team = await response.json();

  //   dispatch(setProjectTeam({ team: team }));
  // };

  const handleChange = (event) => {
    setProjectUserId(event.target.value);
    let newUser = users.filter(({ _id }) => _id === event.target.value);

    if (newUser.length > 0) {
      setUser(newUser[0]);
    }
  };

  const toggleMember = async () => {
    if (projectUserId && project && projectUserId !== '-CHOOSE A USER-') {
      const response = await fetch(`http://localhost:3001/projects/${project._id}/team`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(values),
      });
      const updatedProject = await response.json();
      // console.log(updatedProject);
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
      setUser(updatedProject.user);
      getTeamMembers(updatedProject.project._id);
      setManagers(updatedProject.managers);
    }
  };

  const toggleManager = async () => {
    if (projectUserId && project && projectUserId !== '-CHOOSE A USER-') {
      const response = await fetch(`http://localhost:3001/projects/${project._id}/managers`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(values),
      });
      const updatedProject = await response.json();
      // console.log(updatedProject);
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
      setManagers(updatedProject.managers);
    }
  };

  useEffect(() => {
    setProjectUserId('-CHOOSE A USER-');
    // the useEffect body is empty
    // console.log('team UE');
    // console.log(team);
    // console.log(project);
    // console.log(currentProject);
    console.log('project');
    // setManagers(project.managers)
    // console.log(project);
    // if (currentProject !== project) setCurrentProject(project);
    // if (currentProject) {
    //   setManagers(currentProject.managers);
    //   setIsManager(managers.includes(projectUserId));
    //   console.log('real isMan: ' + isManager);
    //   console.log('upper ue isMan? ' + currentProject.managers.includes(projectUserId));
    //   if (user) setIsIncluded(currentProject.team.includes(user._id));
    // }
    // if (currentProject) setManagers(currentProject.managers);
    // if (currentProject && user) setIsIncluded(currentProject.team.includes(user._id));
    // setIsManager(managers.includes(projectUserId));
    // console.log('upper ue isMan? ' + currentProject.managers.includes(projectUserId));
  }, [project, team]);

  useEffect(() => {
    getUsers();
    // if (project) setManagers(project.managers);
    // setCurrentProject(project);
    // console.log(currentProject);
    // console.log(team);
    // console.log(managers);
  }, []);

  useEffect(() => {
    console.log('PROJECT CHANGED');
  }, [project]);

  useEffect(() => {
    console.log('proj: ' + (project !== null) + ', user: ' + (user !== null));
    if (user === null || project === null) return;
    console.log('executed');
    setIsIncluded(project.team.includes(projectUserId));
    setIsManager(project.managers.includes(projectUserId));
    console.log('isMan? ' + project.managers.includes(projectUserId));
    console.log('isInc? ' + project.team.includes(projectUserId));
  }, [projectUserId, user, project]);

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
            title={project === null ? 'SELECT A PROJECT' : pageType === 'INFO' ? 'Project Users' : 'Edit Project Users'}
            subtitle={project === null ? 'No project selected' : project.title}
          />
          <Button
            sx={{
              m: '1rem .5rem 0 0',
              p: '.5rem',
              backgroundColor: palette.primary.main,
              color: palette.background.alt,
              '&:hover': { color: palette.primary.main },
            }}
            onClick={() => {
              navigate(`/projects/info/${project._id}`);
            }}
          >
            Go To Project
          </Button>
        </FlexBetween>
        {project !== null && (
          <Box
            width='100%'
            mt='1rem'
          >
            {project && (
              <Box
                height='300px'
                pb='1rem'
                borderBottom={`1px solid ${palette.neutral.medium}`}
              >
                <ProjectUsersTable
                  team={team}
                  project={project}
                />
              </Box>
            )}
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
            {user !== null && projectUserId !== '-CHOOSE A USER-' && (
              <Box
                p='0rem 4rem'
                justifyContent='space-around'
                display='flex'
                align-items='center'
                width='90%'
              >
                <Box textAlign='center'>
                  <Button
                    disabled={user === null || projectUserId === '-CHOOSE A USER-'}
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
                      disabled={user === null || projectUserId === '-CHOOSE A USER-'}
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
