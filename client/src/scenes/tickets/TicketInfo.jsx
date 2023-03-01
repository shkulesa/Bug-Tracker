import { Box, Button, Paper, Typography, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import NewNoteForm from 'scenes/notes/NewNoteForm';
import { setEditTicket, setNotes, setTicket, setTicketAssigned } from 'state';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TicketNotes from './TicketNotes';
import TicketHistory from './TicketHistory';

const TicketInfo = () => {
  const { palette } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const ticket = useSelector((state) => state.content.ticket);
  const notes = useSelector((state) => state.content.notes);
  const [correctedTime, setCorrectedTime] = useState('');
  const [projectName, setProjectName] = useState('');
  const isDev = user.role !== 'SUBMITTER' && user.tickets.includes(id);

  const getTicket = async () => {
    const response = await fetch(`http://localhost:3001/tickets/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const ticket = await response.json();

    dispatch(setTicket({ ticket: ticket }));
    getProjectName(ticket.project);
    return ticket;
  };

  const getAssigned = async () => {
    const response = await fetch(`http://localhost:3001/tickets/${id}/assigned`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const assigned = await response.json();

    dispatch(setTicketAssigned({ assigned: assigned }));
  };

  const getProjectName = async (projectId) => {
    const response = await fetch(`http://localhost:3001/projects/${projectId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const project = await response.json();

    setProjectName(project.title);
  };

  const getNotes = async () => {
    const response = await fetch(`http://localhost:3001/tickets/${id}/notes`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const notes = await response.json();
    dispatch(setNotes({ notes: notes }));
  };

  const updateStatus = async () => {
    const response = await fetch(`http://localhost:3001/tickets/${id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });

    const updatedTicket = await response.json();
    dispatch(
      setTicket({
        ticket: updatedTicket,
      })
    );
  };

  const deleteTicket = async () => {
    if (user.role === 'ADMIN') {
      const response = await fetch(`http://localhost:3001/tickets/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate('/tickets');
    }
  };

  useEffect(() => {
    getTicket()
      .then(() => {
        getNotes();
        getAssigned();
        const date = new Date(ticket.submittedDate);
        setCorrectedTime(
          new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('.')[0].replace('T', ' ')
        );
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Box
      m='1.5rem 2.5rem'
      height='75vh'
    >
      <FlexBetween>
        <Header
          title='Ticket Details'
          subtitle={ticket && ticket.title}
        />
        <Box>
          {ticket && isDev && (
            <Button
              disabled={ticket.status === 'CLOSED'}
              sx={{
                m: '1rem',
                p: '1rem',
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                '&:hover': { color: palette.primary.main },
              }}
              onClick={() => {
                dispatch(
                  setEditTicket({
                    editTicket: ticket,
                  })
                );
                navigate(`/tickets/edit/${id}`);
              }}
            >
              Edit Ticket
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
              navigate('/tickets');
            }}
          >
            Back to Tickets
          </Button>
        </Box>
      </FlexBetween>
      <Box>
        <Box height='100%'>
          <Paper>
            <FlexBetween>
              <Box
                p='1rem 1rem 0rem 1rem'
                width='16%'
                textAlign='center'
              >
                <Typography
                  textAlign='center'
                  variant='h5'
                  fontWeight='bold'
                  color={palette.neutral.main}
                >
                  Project
                </Typography>
              </Box>
              <Box
                p='1rem 1rem 0rem 1rem'
                width='16%'
                textAlign='center'
              >
                <Typography
                  textAlign='center'
                  variant='h5'
                  fontWeight='bold'
                  color={palette.neutral.main}
                >
                  Category
                </Typography>
              </Box>
              <Box
                p='1rem 1rem 0rem 1rem'
                width='16%'
                textAlign='center'
              >
                <Typography
                  textAlign='center'
                  variant='h5'
                  fontWeight='bold'
                  color={palette.neutral.main}
                >
                  Assigned Dev
                </Typography>
              </Box>
              <Box
                p='1rem 1rem 0rem 1rem'
                width='16%'
                textAlign='center'
              >
                <Typography
                  textAlign='center'
                  variant='h5'
                  fontWeight='bold'
                  color={palette.neutral.main}
                >
                  Submitted On
                </Typography>
              </Box>
              <Box
                p='1rem 1rem 0rem 1rem'
                width='16%'
                textAlign='center'
              >
                <Typography
                  textAlign='center'
                  variant='h5'
                  fontWeight='bold'
                  color={palette.neutral.main}
                >
                  Submitted By
                </Typography>
              </Box>
              <Box
                p='1rem 1rem 0rem 1rem'
                width='16%'
                textAlign='center'
              >
                <Typography
                  textAlign='center'
                  variant='h5'
                  fontWeight='bold'
                  color={palette.neutral.main}
                >
                  Status
                </Typography>
              </Box>
            </FlexBetween>
            {ticket && (
              <FlexBetween>
                <Box
                  p='.25rem 1rem 1rem 1rem'
                  width='16%'
                  textAlign='center'
                >
                  <Button variant='text'>
                    <Typography
                      textAlign='center'
                      variant='h3'
                      fontWeight='bold'
                      // textAlign='center'
                      color={palette.primary.main}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        navigate(`/projects/info/${ticket.project}`);
                      }}
                    >
                      {projectName !== '' && projectName}
                    </Typography>
                  </Button>
                </Box>
                <Box
                  p='.25rem 1rem 1rem 1rem'
                  width='16%'
                  textAlign='center'
                >
                  <Typography
                    textAlign='center'
                    variant='h3'
                    fontWeight='bold'
                    color={palette.primary.main}
                  >
                    {ticket.category}
                  </Typography>
                </Box>
                <Box
                  p='.25rem 1rem 1rem 1rem'
                  width='16%'
                  textAlign='center'
                >
                  <Typography
                    textAlign='center'
                    variant='h3'
                    fontWeight='bold'
                    color={palette.primary.main}
                  >
                    {ticket.assignedName}
                  </Typography>
                </Box>
                <Box
                  p='.25rem 1rem 1rem 1rem'
                  width='16%'
                  textAlign='center'
                >
                  <Typography
                    textAlign='center'
                    variant='h3'
                    fontWeight='bold'
                    color={palette.primary.main}
                  >
                    {correctedTime}
                  </Typography>
                </Box>
                <Box
                  p='.25rem 1rem 1rem 1rem'
                  width='16%'
                  textAlign='center'
                >
                  <Typography
                    textAlign='center'
                    variant='h3'
                    fontWeight='bold'
                    color={palette.primary.main}
                  >
                    {ticket.submitterName}
                  </Typography>
                </Box>
                <Box
                  p='.25rem 1rem 1rem 1rem'
                  width='16%'
                  textAlign='center'
                >
                  <Typography
                    textAlign='center'
                    variant='h3'
                    fontWeight='bold'
                    color={ticket ? (ticket.status === 'OPEN' ? 'green' : 'red') : palette.primary.main}
                  >
                    {ticket.status}
                    {(user.role === 'ADMIN' || isDev) && (
                      <Box mt='.2rem'>
                        <Button
                          variant='outlined'
                          onClick={updateStatus}
                          sx={{
                            color: ticket.status === 'OPEN' ? '#FF7572' : '#55C35D',
                            borderColor: ticket.status === 'OPEN' ? '#FF7572' : '#55C35D',
                            '&:hover': {
                              borderColor: ticket.status === 'OPEN' ? '#FF7572' : '#55C35D',
                              backgroundColor: ticket.status === 'OPEN' ? '#FFABA92C' : '#55C35C2D',
                            },
                          }}
                        >
                          {ticket.status === 'OPEN' ? <LockOutlinedIcon /> : <LockOpenOutlinedIcon />}
                        </Button>
                      </Box>
                    )}
                  </Typography>
                </Box>
              </FlexBetween>
            )}
          </Paper>
        </Box>

        <Box mt='.5rem'>
          <Paper sx={{ height: '100%' }}>
            <Box p='1rem'>
              <Typography
                variant='h5'
                fontWeight='bold'
                color={palette.neutral.main}
              >
                Description
              </Typography>
              <Typography
                variant='h4'
                fontWeight='bold'
                color={palette.primary.main}
              >
                {ticket && ticket.description}
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Row 2 */}
        <Box
          mt='1rem'
          height='400px'
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
                <Box
                  height='20%'
                  mt='-1.5rem'
                >
                  <NewNoteForm
                    kind='TICKET'
                    parent={id}
                  />
                </Box>
              )}
              <Box height='70%'>
                <TicketNotes
                  notes={notes}
                  isDev={isDev}
                />
              </Box>
            </Box>
          </Paper>
        </Box>
        {/* row 3 */}
        <Box
          mt='1rem'
          height='400px'
        >
          <Paper sx={{ height: '100%' }}>
            <Box height='100%'>
              <Box height='15%'>
                <Typography
                  variant='h3'
                  fontWeight='bold'
                  color={palette.neutral.main}
                  p='.5rem 0 0 .5rem'
                >
                  Ticket History
                </Typography>
              </Box>
              <Box height='85%'>{ticket && <TicketHistory history={ticket.history} />}</Box>
            </Box>
          </Paper>
        </Box>
        {user.role === 'ADMIN' && (
          <Box mt='.5rem'>
            <Button
              sx={{
                m: '1rem 1',
                p: '1rem',
                backgroundColor: 'red',
                color: palette.background.alt,
                '&:hover': { backgroundColor: 'pink' },
              }}
              onClick={deleteTicket}
            >
              Delete Ticket
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TicketInfo;
