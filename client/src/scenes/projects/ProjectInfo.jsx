import { Box, Button, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import NewNoteForm from 'scenes/notes/NewNoteForm';
import RoleManagement from 'scenes/roleManagement';
import { setEditProject, setNotes, setProject, setProjectTeam, setProjectTickets } from 'state';
import EditProjectForm from './EditProjectForm';
import ProjectNotes from './ProjectNotes';
import ProjectTeam from './ProjectTeam';
import ProjectTickets from './ProjectTickets';

const ProjectInfo = () => {
  const { palette } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const project = useSelector((state) => state.content.project);
  const team = useSelector((state) => state.project.team);
  const tickets = useSelector((state) => state.project.tickets);
  const notes = useSelector((state) => state.content.notes);

  const [managers, setManagers] = useState([]);
  const isNonMobile = useMediaQuery('(min-width:600px)');
  const isManager = managers.includes(user._id);

  const getProject = async () => {
    const response = await fetch(`http://localhost:3001/projects/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const project = await response.json();

    dispatch(setProject({ project: project }));
    return project;
  };

  const getTeamMembers = async () => {
    const response = await fetch(`http://localhost:3001/projects/${id}/team`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const team = await response.json();

    dispatch(setProjectTeam({ team: team }));
  };

  const getTickets = async () => {
    const response = await fetch(`http://localhost:3001/projects/${id}/tickets`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const tickets = await response.json();

    dispatch(setProjectTickets({ tickets: tickets }));
  };

  const getNotes = async () => {
    const response = await fetch(`http://localhost:3001/projects/${id}/notes`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const notes = await response.json();

    dispatch(setNotes({ notes: notes }));
  };

  const deleteProject = async () => {
    if (user.role === 'ADMIN') {
      const response = await fetch(`http://localhost:3001/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate('/projects');
    }
  };

  useEffect(() => {
    getProject()
      .then(({ managers }) => {
        setManagers(managers);
        getTeamMembers();
        getTickets();
        getNotes();
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Box
      m='1.5rem 2.5rem'
      height='125vh'
    >
      <FlexBetween>
        <Header
          title='Project Details'
          subtitle={project && project.title}
        />
        <Box>
          {(isManager || user.role === 'ADMIN') && (
            <Button
              sx={{
                m: '1rem',
                p: '1rem',
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                '&:hover': { color: palette.primary.main },
              }}
              onClick={() => {
                dispatch(
                  setEditProject({
                    editProject: project,
                  })
                );
                navigate(`/projects/edit/${id}`);
              }}
            >
              Edit Project
            </Button>
          )}
          {/* <Box> */}
          <Button
            sx={{
              m: '1rem 0',
              p: '1rem',
              backgroundColor: palette.primary.main,
              color: palette.background.alt,
              '&:hover': { color: palette.primary.main },
            }}
            onClick={() => {
              navigate('/projects');
            }}
          >
            Back to Projects
          </Button>
          {/* </Box> */}
        </Box>
      </FlexBetween>
      <Box
        display='grid'
        // height='75vh'
        gridTemplateColumns='repeat(9, 1fr)'
        gridTemplateRows='repeat(9, 1fr)'
        gridAutoRows='75px'
        gap='20px'
      >
        <Box
          gridColumn='span 3'
          gridRow='span 9'
          height='100%'
          // height='75vh'
        >
          <Paper>
            <Box
              height='657px'
              // height='100%'
              display='flex'
              flexDirection='column'
              justifyContent='space-between'
            >
              {/* <Box
                p='2rem 0'
                height='100%'
              > */}
              <Box p='1rem'>
                <Typography
                  variant='h5'
                  fontWeight='bold'
                  color={palette.neutral.main}
                >
                  Project Title
                </Typography>
                <Typography
                  variant='h3'
                  fontWeight='bold'
                  color={palette.primary.main}
                >
                  {project && project.title}
                </Typography>
              </Box>
              <Box
                p='1rem'

                // gap='.5rem'
              >
                <Typography
                  variant='h5'
                  fontWeight='bold'
                  color={palette.neutral.main}
                >
                  Project Description
                </Typography>
                <Typography
                  variant='h3'
                  fontWeight='bold'
                  color={palette.primary.main}
                >
                  {project && project.description}
                </Typography>
              </Box>
              <Box
                p='1rem'

                // gap='.5rem'
              >
                <Typography
                  variant='h5'
                  fontWeight='bold'
                  color={palette.neutral.main}
                >
                  Start Date
                </Typography>
                <Typography
                  variant='h3'
                  fontWeight='bold'
                  color={palette.primary.main}
                >
                  {project && project.startDate.split('T')[0]}
                </Typography>
              </Box>
              <Box
                p='1rem'

                // gap='.5rem'
              >
                <Typography
                  variant='h5'
                  fontWeight='bold'
                  color={palette.neutral.main}
                >
                  End Date
                </Typography>
                <Typography
                  variant='h3'
                  fontWeight='bold'
                  color={palette.primary.main}
                >
                  {project && project.endDate.split('T')[0]}
                </Typography>
              </Box>
              <Box
                p='1rem'

                // gap='.5rem'
              >
                <Typography
                  variant='h5'
                  fontWeight='bold'
                  color={palette.neutral.main}
                >
                  Priority
                </Typography>
                <Typography
                  variant='h3'
                  fontWeight='bold'
                  color={
                    project
                      ? project.priority === 'HIGH'
                        ? 'red'
                        : project.priority === 'MEDIUM'
                        ? 'yellow'
                        : 'green'
                      : palette.primary.main
                  }
                >
                  {project && project.priority}
                </Typography>
              </Box>

              {/* </Box> */}
            </Box>
          </Paper>
        </Box>
        <Box
          // height='100%'
          gridColumn='span 6'
          gridRow='span 4'
        >
          <Paper sx={{ height: '100%' }}>
            <Box
              // display='flex'
              // flexDirection='column'
              // justifyContent='space-between'
              height='100%'
            >
              <FlexBetween height='15%'>
                <Typography
                  variant='h3'
                  fontWeight='bold'
                  color={palette.neutral.main}
                  p='.5rem 0 0 .5rem'
                >
                  Team Members
                </Typography>
                <Button
                  sx={{
                    m: '1rem .5rem 0 0',
                    p: '.5rem',
                    backgroundColor: palette.primary.main,
                    color: palette.background.alt,
                    '&:hover': { color: palette.primary.main },
                  }}
                  onClick={() => {
                    dispatch(
                      setEditProject({
                        editProject: project,
                      })
                    );
                    dispatch(
                      setProjectTeam({
                        team: team,
                      })
                    );
                    navigate(`/manage-users/${id}`);
                  }}
                >
                  Edit Project Users
                </Button>
              </FlexBetween>
              <Box height='85%'>
                <ProjectTeam
                  team={team}
                  managers={managers}
                />
              </Box>
            </Box>
          </Paper>
        </Box>
        <Box
          gridColumn='span 6'
          gridRow='span 5'
        >
          <Paper sx={{ height: '100%' }}>
            <Box
              // display='flex'
              // flexDirection='column'
              // justifyContent='space-between'
              height='100%'
            >
              <FlexBetween height='15%'>
                <Typography
                  variant='h3'
                  fontWeight='bold'
                  color={palette.neutral.main}
                  p='.5rem 0 0 .5rem'
                >
                  Tickets
                </Typography>
                <Button
                  sx={{
                    m: '1rem .5rem 0 0',
                    p: '.5rem',
                    backgroundColor: palette.primary.main,
                    color: palette.background.alt,
                    '&:hover': { color: palette.primary.main },
                  }}
                  onClick={() => {
                    navigate(`/projects/${id}/tickets/new`);
                  }}
                >
                  Submit Ticket
                </Button>
              </FlexBetween>
              <Box height='85%'>
                <ProjectTickets tickets={tickets} />
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Row 2 */}
        <Box
          gridColumn='span 9'
          gridRow='span 5'
          // gap='10px'
        >
          <Paper sx={{ height: '100%' }}>
            <Box
              // display='flex'
              // flexDirection='column'
              // justifyContent='space-between'
              height='100%'
            >
              <Box height='10%'>
                <Typography
                  variant='h3'
                  fontWeight='bold'
                  color={palette.neutral.main}
                  p='.5rem 0 0 .5rem'
                >
                  Notes
                </Typography>
              </Box>
              <Box
                height='20%'
                // mt='-1.5rem'
              >
                <NewNoteForm
                  kind='PROJECT'
                  parent={id}
                />
              </Box>
              <Box height='70%'>
                <ProjectNotes
                  notes={notes}
                  isManager={isManager}
                />
              </Box>
            </Box>
          </Paper>
        </Box>
        {user.role === 'ADMIN' && (
          <Box>
            <Button
              sx={{
                m: '1rem 1',
                p: '1rem',
                backgroundColor: 'red',
                color: palette.background.alt,
                '&:hover': { backgroundColor: 'pink' },
              }}
              onClick={deleteProject}
            >
              Delete Project
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProjectInfo;
