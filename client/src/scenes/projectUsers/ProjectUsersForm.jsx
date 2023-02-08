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
import { current } from '@reduxjs/toolkit';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import React, { useEffect, useState } from 'react';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUsers, setEditUser, updateProject, setProjectTeam, setEditProject } from 'state';
import ProjectUsersTable from './ProjectUsersTable';

const ProjectUsersForm = ({ linkToProject = true }) => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.content.users);
  const token = useSelector((state) => state.token);
  const project = useSelector((state) => state.editProject);
  const team = useSelector((state) => state.project.team);
  const [pageType, setPageType] = useState('INFO');
  const [projectUserId, setProjectUserId] = useState('-CHOOSE A USER-');
  // const [user, setUser] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [isManager, setIsManager] = useState(false);
  const [isIncluded, setIsIncluded] = useState(false);
  // const [managers, setManagers] = useState([]);
  // const { managers } = useSelector((state) => state.content.project);

  // console.log(users);

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

    // setCurrentTeam(team);
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
    // let newUser = users.filter(({ _id }) => _id === event.target.value);

    // if (newUser.length > 0) {
    //   setUser(newUser[0]);
    // }
  };

  const toggleMember = async () => {
    // console.log('above if');
    // console.log('project:', project);
    // console.log('currentProject:', currentProject);
    // console.log('projectUserId:', projectUserId);
    if (projectUserId && currentProject && projectUserId !== '-CHOOSE A USER-') {
      // console.log('Making toggleMember request');
      const response = await fetch(`http://localhost:3001/projects/${currentProject._id}/team`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(values),
      });
      // console.log('toggleMember response received');
      const updatedProject = await response.json();
      // console.log('TOGGLE MEMEBER');
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
      setCurrentTeam(updatedProject.project.team);
      // setUser(updatedProject.user);
      getTeamMembers(updatedProject.project._id);
      // setManagers(updatedProject.managers);
      // setIsIncluded(currentTeam.includes(projectUserId));
      // setIsManager(currentProject.managers.includes(projectUserId));
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
      // setCurrentTeam(updatedProject.team);
      // setManagers(updatedProject.managers);
    }
  };

  // useEffect(() => {
  //   if (!project) return;

  //   setCurrentProject(project);
  //   setCurrentTeam(project.team);

  //   // This will make sure the hook runs only once on component mount or when `project` changes
  // }, [project]);

  // useEffect(() => {
  //   getUsers();
  //   // if (project) setManagers(project.managers);
  //   if (linkToProject && project) {
  //     setCurrentProject(project);
  //     setCurrentTeam(project.team);
  //   } else {
  //     setCurrentProject(null);
  //     setCurrentTeam(null);
  //   }
  //   // console.log('empty');
  //   // console.log(team);
  //   // console.log(managers);
  //   // console.log(project);
  // }, []);

  // useLayoutEffect(() => {
  //   // console.log('PROJECT CHANGED');
  //   // console.log(project);
  //   setProjectUserId('-CHOOSE A USER-');
  // }, [project, team]);

  // useEffect(() => {
  //   if (!currentProject || !currentTeam) return;
  //   setIsIncluded(currentTeam.includes(projectUserId));
  //   setIsManager(currentProject.managers.includes(projectUserId));
  // }, [projectUserId, currentProject, currentTeam]);

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
            title={!currentProject ? 'SELECT A PROJECT' : pageType === 'INFO' ? 'Project Users' : 'Edit Project Users'}
            subtitle={!currentProject ? 'No project selected' : currentProject.title}
          />
          {linkToProject && (
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
                    // disabled={projectUserId === '-CHOOSE A USER-'}
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
                      disabled={projectUserId === '-CHOOSE A USER-'}
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
