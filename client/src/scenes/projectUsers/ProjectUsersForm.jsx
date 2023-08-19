import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProjectUsersTable from './ProjectUsersTable';
import { setEditProject } from 'state/slices/editSlice';
import useFetchProjectInfo from 'api/useFetchProjectInfo';
import useFetchUsers from 'api/useFetchUsers';

const ProjectUsersForm = ({ linkToProject }) => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const users = useSelector((state) => state.user.users);
  const token = useSelector((state) => state.user.token);
  //project, to be edited
  const editProject = useSelector((state) => state.edit.project);
  //team, to be edited
  const editTeam = useSelector((state) => state.edit.team);

  //selected user
  const [projectUserId, setProjectUserId] = useState('');

  //selected project
  const [currentProject, setCurrentProject] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [isManager, setIsManager] = useState(false);
  //is selected user in team
  const [isIncluded, setIsIncluded] = useState(false);
  const { fetchTeamMembersForEdit, toggleProjectMember, toggleProjectManager } = useFetchProjectInfo();
  const fetchUsers = useFetchUsers();

  const values = {
    projectUserId,
  };

  const handleChange = (event) => {
    setProjectUserId(event.target.value);
  };

  const toggleMember = async () => {
    if (projectUserId && currentProject) {
      const updatedProject = await toggleProjectMember(values, editProject._id, token);

      setCurrentProject(updatedProject.project);
      setCurrentTeam(updatedProject.project.team);
      console.log(editTeam);
      fetchTeamMembersForEdit(updatedProject.project._id, token);
    }
  };

  const toggleManager = async () => {
    if (projectUserId && currentProject) {
      const updatedProject = await toggleProjectManager(values, editProject._id, token);
      setCurrentProject(updatedProject);
    }
  };

  useEffect(() => {
    //form loaded, generate users
    fetchUsers(token);
    //if a coming from projectInfo page
    if (linkToProject && editProject) {
      setCurrentProject(editProject);
      setCurrentTeam(editProject.team);
    } else {
      setCurrentProject(null);
      setCurrentTeam(null);
      dispatch(setEditProject({ editProject: null }));
    }
  }, []);

  //update table to reflect projectUser's manager status
  useEffect(() => {
    if (!currentProject || !currentTeam || !projectUserId) return;

    setIsIncluded(currentTeam.includes(projectUserId));
    setIsManager(currentProject.managers.includes(projectUserId));
  }, [currentProject, currentTeam, projectUserId, toggleMember]);

  //reset projectUserId when editProject or editTeam are changed
  useEffect(() => {
    setProjectUserId('');

    if (editProject) {
      setCurrentProject(editProject);
      setCurrentTeam(editProject.team);
    }
  }, [editProject, editTeam]);

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
              mb='1rem'
              borderBottom={`1px solid ${palette.neutral.medium}`}
            >
              <ProjectUsersTable
                editTeam={editTeam}
                editProject={currentProject}
              />
            </Box>
            {/* <Typography
              variant='h5'
              color={palette.neutral.main}
              sx={{ pb: '.5rem', m: '.5rem' }}
            >
              Select a User:
            </Typography> */}
            <FormControl fullWidth>
              <InputLabel id='user-label'>Select User</InputLabel>
              <Select
                labelId='user-label'
                label='Select User'
                id='user'
                autoWidth
                value={projectUserId}
                onChange={handleChange}
              >
                <MenuItem value=''>
                  <em>Select User</em>
                </MenuItem>
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
            {projectUserId && (
              <Box
                p='0rem 4rem'
                justifyContent='space-around'
                display='flex'
                align-items='center'
                width='90%'
              >
                <Box textAlign='center'>
                  <Button
                    disabled={user.role === 'VIEWER' || !projectUserId}
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
                      disabled={user.role === 'VIEWER' || !projectUserId}
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
