import { Box, Button, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import NewNoteForm from 'scenes/notes/NewNoteForm';
import { setEditTicket, setNotes, setProjectTickets, setTicket, setTicketAssigned } from 'state';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TicketAssigned from './TicketAssigned';
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
  const assigned = useSelector((state) => state.ticket.assigned);
  const notes = useSelector((state) => state.content.notes);
  const [correctedTime, setCorrectedTime] = useState('');

  // const [managers, setManagers] = useState([]);
  const isDev = user.role !== 'SUBMITTER';
  const isNonMobile = useMediaQuery('(min-width:600px)');
  // const isManager = managers.includes(user._id);

  const getTicket = async () => {
    const response = await fetch(`http://localhost:3001/tickets/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const ticket = await response.json();

    dispatch(setTicket({ ticket: ticket }));
    return ticket;
  };

  const getAssigned = async () => {
    const response = await fetch(`http://localhost:3001/tickets/${id}/assigned`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const assigned = await response.json();
    // console.log(assigned);

    dispatch(setTicketAssigned({ assigned: assigned }));
  };

  // const getTickets = async (ticketId) => {
  //   const response = await fetch(`http://localhost:3001/projects/${ticketId}/tickets`, {
  //     method: 'GET',
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   const tickets = await response.json();

  //   dispatch(setProjectTickets({ tickets: tickets }));
  // };

  const getNotes = async () => {
    const response = await fetch(`http://localhost:3001/tickets/${id}/notes`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const notes = await response.json();
    // console.log(notes);
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
        // console.log(correctedTime);
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
          {isDev && (
            // <Box p='1rem'>
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
            // </Box>
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
      <Box
      // display='grid'
      // // height='75vh'
      // gridTemplateColumns='repeat(9, 1fr)'
      // gridTemplateRows='repeat(9, 1fr)'
      // gridAutoRows='75px'
      // gap='20px'
      >
        <Box
          // gridColumn='span 3'
          // gridRow='span 9'
          height='100%'
          // height='75vh'
        >
          <Paper>
            <FlexBetween
            // height='657px'
            // height='100%'
            // display='flex'
            // flexDirection='column'
            // justifyContent='space-between'
            >
              {/* <Box
                p='2rem 0'
                height='100%'
              > */}
              <Box
                p='1rem 1rem 0rem 1rem'
                width='20%'
                textAlign='center'
              >
                <Typography
                  textAlign='center'
                  variant='h5'
                  fontWeight='bold'
                  color={palette.neutral.main}
                >
                  Ticket
                </Typography>
                {/* <Typography
                textAlign='center'
                  variant='h3'
                  fontWeight='bold'
                  color={palette.primary.main}
                >
                  {ticket && ticket.title}
                </Typography> */}
              </Box>
              <Box
                p='1rem 1rem 0rem 1rem'
                width='20%'
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
                {/* <Typography
                textAlign='center'
                  variant='h3'
                  fontWeight='bold'
                  color={palette.primary.main}
                >
                  {ticket && ticket.category}
                </Typography> */}
              </Box>
              <Box
                p='1rem 1rem 0rem 1rem'
                width='20%'
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
                {/* <Typography
                textAlign='center'
                  variant='h3'
                  fontWeight='bold'
                  color={palette.primary.main}
                >
                  {ticket && ticket.submitter}
                </Typography> */}
              </Box>
              <Box
                p='1rem 1rem 0rem 1rem'
                width='20%'
                textAlign='center'
              >
                <Typography
                  textAlign='center'
                  variant='h5'
                  fontWeight='bold'
                  color={palette.neutral.main}
                >
                  Submitted
                </Typography>
                {/* <Typography
                textAlign='center'
                  variant='h3'
                  fontWeight='bold'
                  color={palette.primary.main}
                >
                  {ticket && ticket.submittedDate.split('Z')[0].replace('T', ' ')}
                </Typography> */}
              </Box>
              <Box
                p='1rem 1rem 0rem 1rem'
                width='20%'
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
                {/* <Typography
                textAlign='center'
                  variant='h3'
                  fontWeight='bold'
                  color={ticket ? (ticket.status === 'OPEN' ? 'green' : 'red') : palette.primary.main}
                >
                  {ticket && ticket.status}
                </Typography> */}
              </Box>

              {/* </Box> */}
            </FlexBetween>
            {ticket && (
              <FlexBetween
              // height='657px'
              // height='100%'
              // display='flex'
              // flexDirection='column'
              // justifyContent='space-between'
              >
                {/* <Box
                p='2rem 0'
                height='100%'
              > */}
                <Box
                  p='.25rem 1rem 1rem 1rem'
                  width='20%'
                  textAlign='center'
                >
                  {/* <Typography
                textAlign='center'
                  variant='h5'
                  fontWeight='bold'
                  color={palette.neutral.main}
                >
                  Ticket
                </Typography> */}
                  <Typography
                    textAlign='center'
                    variant='h3'
                    fontWeight='bold'
                    // textAlign='center'
                    color={palette.primary.main}
                  >
                    {ticket.title}
                  </Typography>
                </Box>
                <Box
                  p='.25rem 1rem 1rem 1rem'
                  width='20%'
                  textAlign='center'
                >
                  {/* <Typography
                textAlign='center'
                  variant='h5'
                  fontWeight='bold'
                  color={palette.neutral.main}
                >
                  Category
                </Typography> */}
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
                  width='20%'
                  textAlign='center'
                >
                  {/* <Typography
                textAlign='center'
                  variant='h5'
                  fontWeight='bold'
                  color={palette.neutral.main}
                >
                  Submitter
                </Typography> */}
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
                  width='20%'
                  textAlign='center'
                >
                  {/* <Typography
                textAlign='center'
                  variant='h5'
                  fontWeight='bold'
                  color={palette.neutral.main}
                >
                  Submitted
                </Typography> */}
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
                  width='20%'
                  textAlign='center'
                >
                  {/* <Typography
                textAlign='center'
                  variant='h5'
                  fontWeight='bold'
                  color={palette.neutral.main}
                >
                  Status
                </Typography> */}
                  <Typography
                    textAlign='center'
                    variant='h3'
                    fontWeight='bold'
                    color={ticket ? (ticket.status === 'OPEN' ? 'green' : 'red') : palette.primary.main}
                  >
                    {ticket.status}
                    {isDev && (
                      <Box>
                        <Button
                          // sx={{ height: '100%', width: '100%' }}
                          variant='outlined'
                          onClick={updateStatus}
                          sx={{
                            color: ticket.status === 'OPEN' ? '#FF7572' : '#72FF7B',
                            borderColor: ticket.status === 'OPEN' ? '#FF7572' : '#72FF7B',
                            '&:hover': {
                              borderColor: ticket.status === 'OPEN' ? '#FF7572' : '#72FF7B',
                              backgroundColor: ticket.status === 'OPEN' ? '#FFABA92C' : '#72FF7B2C',
                            },
                          }}
                        >
                          {ticket.status === 'OPEN' ? <LockOutlinedIcon /> : <LockOpenOutlinedIcon />}
                        </Button>
                      </Box>
                    )}
                  </Typography>
                </Box>

                {/* </Box> */}
              </FlexBetween>
            )}
          </Paper>
        </Box>

        {/* <Box
          height='250px'
          mt='1rem'
        >
          <Paper sx={{ height: '100%' }}>
            <TicketAssigned assigned={assigned} />
          </Paper>
        </Box> */}

        {/* <Box
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
        </Box> */}
        <Box
          // gridColumn='span 9'
          // gridRow='span 5'
          // // gap='10px'
          mt='.5rem'
          // height='400px'
        >
          <Paper sx={{ height: '100%' }}>
            <Box p='1rem'>
              <Typography
                // textAlign='center'
                variant='h5'
                fontWeight='bold'
                color={palette.neutral.main}
              >
                Description
              </Typography>
              <Typography
                // textAlign='center'
                variant='h3'
                fontWeight='bold'
                color={palette.primary.main}
              >
                {ticket.description}
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Row 2 */}
        <Box
          // gridColumn='span 9'
          // gridRow='span 5'
          // // gap='10px'
          mt='1rem'
          height='400px'
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
                mt='-1.5rem'
              >
                <NewNoteForm
                  kind='TICKET'
                  parent={id}
                />
              </Box>
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
          // gridColumn='span 9'
          // gridRow='span 5'
          // // gap='10px'
          mt='1rem'
          height='400px'
        >
          <Paper sx={{ height: '100%' }}>
            <Box
              // display='flex'
              // flexDirection='column'
              // justifyContent='space-between'
              height='100%'
            >
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
              <Box
                height='85%'
                // mt='-1.5rem'
              >
                {ticket && <TicketHistory history={ticket.history} />}
              </Box>
              {/* <Box height='70%'>
                <TicketNotes
                  notes={notes}
                  isDev={isDev}
                />
              </Box> */}
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
