import { Box, Button, Paper, Typography, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import NewNoteForm from 'scenes/notes/NewNoteForm';
import ProjectNotes from './ProjectNotes';
import ProjectTeam from './ProjectTeam';
import ProjectTickets from './ProjectTickets';
import useFetchProjectInfo from 'api/useFetchProjectInfo';
import { setEditProject, setEditTeam } from 'state/slices/editSlice';

const ProjectInfo = () => {
  const { palette } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const project = useSelector((state) => state.project.project);
  const team = useSelector((state) => state.project.team);
  const tickets = useSelector((state) => state.project.tickets);
  const notes = useSelector((state) => state.project.notes);
  const { fetchProject, fetchTeamMembers, fetchProjectTickets, fetchProjectNotes, deleteProject } =
    useFetchProjectInfo();

  const [managers, setManagers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isManager = managers.includes(user._id);

  useEffect(() => {
    fetchProject(id, token)
      .then(({ managers }) => {
        setIsLoading(false);
        setManagers(managers);
        fetchTeamMembers(id, token);
        fetchProjectTickets(id, token);
        fetchProjectNotes(id, token);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Box
      m='1.5rem 2.5rem'
      height='125vh'
    >
      {!isLoading && (
        <>
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
            </Box>
          </FlexBetween>
          <Box
            display='grid'
            gridTemplateColumns='repeat(9, 1fr)'
            gridTemplateRows='repeat(9, 1fr)'
            gridAutoRows='75px'
            gap='20px'
          >
            <Box
              gridColumn='span 3'
              gridRow='span 9'
              height='100%'
            >
              <Paper>
                <Box
                  height='657px'
                  display='flex'
                  flexDirection='column'
                  justifyContent='space-between'
                >
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
                  <Box p='1rem'>
                    <Typography
                      variant='h5'
                      fontWeight='bold'
                      color={palette.neutral.main}
                    >
                      Project Description
                    </Typography>
                    <Typography
                      variant='h4'
                      fontWeight='600'
                      color={palette.neutral.dark}
                    >
                      {project && project.description}
                    </Typography>
                  </Box>
                  <Box p='1rem'>
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
                      color={palette.neutral.dark}
                    >
                      {project && project.startDate.split('T')[0]}
                    </Typography>
                  </Box>
                  <Box p='1rem'>
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
                      color={palette.neutral.dark}
                    >
                      {project && project.endDate.split('T')[0]}
                    </Typography>
                  </Box>
                  <Box p='1rem'>
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
                            ? palette.priority.high
                            : project.priority === 'MEDIUM'
                            ? palette.priority.medium
                            : palette.priority.low
                          : palette.primary.main
                      }
                    >
                      {project && project.priority}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
            <Box
              gridColumn='span 6'
              gridRow='span 4'
            >
              <Paper sx={{ height: '100%' }}>
                <Box height='100%'>
                  <FlexBetween height='15%'>
                    <Typography
                      variant='h3'
                      fontWeight='bold'
                      color={palette.neutral.main}
                      p='.5rem 0 0 .5rem'
                    >
                      Team Members
                    </Typography>
                    {(user.role === 'ADMIN' || (project && project.managers.includes(user._id))) && (
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
                            setEditTeam({
                              team: team,
                            })
                          );
                          navigate(`/manage-users/${id}`);
                        }}
                      >
                        Edit Project Users
                      </Button>
                    )}
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
                <Box height='100%'>
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
                      disabled={user.role === 'VIEWER'}
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
            >
              <Paper sx={{ height: '100%' }}>
                <Box height='100%'>
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
                  {user.role !== 'VIEWER' && (
                    <Box height='20%'>
                      <NewNoteForm
                        kind='PROJECT'
                        parent={id}
                      />
                    </Box>
                  )}
                  <Box height={user.role === 'VIEWER' ? '90%' : '70%'}>
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
                  onClick={async () => {
                    await deleteProject(id, user, token);
                    navigate('/projects');
                  }}
                >
                  Delete Project
                </Button>
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ProjectInfo;
