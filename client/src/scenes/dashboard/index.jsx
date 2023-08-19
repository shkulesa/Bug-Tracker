import { Box, Button, Paper, Typography, useTheme } from '@mui/material';
import useFetchProjects from 'api/useFetchProjects';
import useFetchTickets from 'api/useFetchTickets';
import PieChart from 'components/charts/PieChart';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProjectsTable from 'scenes/projects/ProjectsTable';
import TicketsTable from 'scenes/tickets/TicketsTable';

const Dashboard = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const tickets = useSelector((state) => state.user.tickets);
  const projects = useSelector((state) => state.user.projects);
  const [statusTicketData, setStatusTicketData] = useState([]);
  const [categoryTicketData, setCategoryTicketData] = useState([]);
  const [priorityProjectData, setPriorityProjectData] = useState([]);
  const { fetchProjects } = useFetchProjects();
  const fetchTickets = useFetchTickets();

  const computeTicketData = (tickets) => {
    console.log(tickets);
    //status
    let open = 0;
    let closed = 0;
    for (const ticket of tickets) {
      if (ticket.status === 'OPEN') {
        open++;
      } else {
        closed++;
      }
    }

    const statusData = [
      {
        id: 'open',
        label: 'Open',
        value: open,
        color: palette.primary.main,
      },
      {
        id: 'closed',
        label: 'Closed',
        value: closed,
        color: palette.primary.medium,
      },
    ];

    setStatusTicketData(statusData);

    //category
    let bugs = 0;
    let dev = 0;
    let other = 0;
    for (const ticket of tickets) {
      // console.log(ticket);
      if (ticket.category === 'Bugs/Issues') {
        bugs++;
      } else if (ticket.category === 'Other') {
        other++;
      } else {
        dev++;
      }
    }

    const categoryData = [
      {
        id: 'Bugs/Issues',
        label: 'Bugs/Issues',
        value: bugs,
        color: '#F71735',
      },
      {
        id: 'Other',
        label: 'Other',
        value: other,
        color: '#FF9F1C',
      },
      {
        id: 'Development',
        label: 'Development',
        value: dev,
        color: '#7A9B76',
      },
    ];

    // console.log(categoryData);
    setCategoryTicketData(categoryData);
  };

  const computeProjectData = (projects) => {
    console.log(projects);
    let low = 0;
    let med = 0;
    let high = 0;
    for (const project of projects) {
      if (project.priority === 'LOW') {
        low++;
      } else if (project.priority === 'MEDIUM') {
        med++;
      } else {
        high++;
      }
    }

    const priorityData = [
      {
        id: 'Low',
        label: 'Low',
        value: low,
        color: palette.priority.low,
      },
      {
        id: 'Medium',
        label: 'Medium',
        value: med,
        color: palette.priority.medium,
      },
      {
        id: 'High',
        label: 'High',
        value: high,
        color: palette.priority.high,
      },
    ];

    setPriorityProjectData(priorityData);
  };

  useEffect(() => {
    fetchTickets(user, token).then(() => {
      computeTicketData(tickets);
    });
    fetchProjects(user, token).then(() => {
      computeProjectData(projects);
    });
  }, []);

  return (
    <Box m='1.5rem 2.5rem'>
      <Header
        title={user.role === 'ADMIN' || user.role === 'VIEWER' ? 'ADMIN DASHBOARD' : 'DASHBOARD'}
        subtitle={
          user.role === 'ADMIN' || user.role === 'VIEWER'
            ? 'View all projects and tickets'
            : 'View your projects and tickets'
        }
      />
      {/* GRID */}
      <Box
        mt='20px'
        display='grid'
        gridTemplateColumns='repeat(12, 1fr)'
        gridTemplateRows='repeat(12, 1fr)'
        gridAutoRows='160px'
        gap='20px'
      >
        {/* ROW 1 */}
        <Box
          gridColumn={user.role === 'SUBMITTER' ? 'span 12' : 'span 6'}
          gridRow='span 4'
        >
          <Paper sx={{ height: '100%' }}>
            <Box height='86%'>
              <FlexBetween>
                <Typography
                  variant='h2'
                  color={palette.neutral.main}
                  fontWeight='bold'
                  p='1rem 0 0 1rem'
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    navigate('/tickets');
                  }}
                >
                  Tickets
                </Typography>
                {user.role === 'SUBMITTER' && (
                  <Button
                    sx={{
                      m: '.75rem 1rem 0 0',
                      p: '.75rem',
                      backgroundColor: palette.primary.main,
                      color: palette.background.alt,
                      '&:hover': { color: palette.primary.main },
                    }}
                    onClick={() => {
                      navigate('/tickets/new');
                    }}
                  >
                    Submit new Ticket
                  </Button>
                )}
              </FlexBetween>
              <TicketsTable
                isDashboard={true}
                isSubmitter={user.role === 'SUBMITTER'}
              />
            </Box>
          </Paper>
        </Box>
        {user.role !== 'SUBMITTER' && (
          <Box
            gridColumn='span 6'
            gridRow='span 4'
          >
            <Paper sx={{ height: '100%' }}>
              <Box height='86%'>
                <Typography
                  variant='h2'
                  color={palette.neutral.main}
                  fontWeight='bold'
                  p='1rem 0 0 1rem'
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    navigate('/projects');
                  }}
                >
                  Projects
                </Typography>
                <ProjectsTable page='DASHBOARD' />
              </Box>
            </Paper>
          </Box>
        )}
        {/* ROW 2 */}
        <Box
          gridColumn={user.role === 'SUBMITTER' ? 'span 6 ' : 'span 4'}
          gridRow='span 4'
        >
          <Paper>
            <Box p='.5rem'></Box>
            <Typography
              variant='h2'
              color={palette.neutral.main}
              fontWeight='bold'
              pl='1rem'
            >
              Tickets by Status
            </Typography>
            {tickets.length === 0 ? <Box height='400px'>No tickets</Box> : <PieChart data={statusTicketData} />}
          </Paper>
        </Box>
        <Box
          gridColumn={user.role === 'SUBMITTER' ? 'span 6 ' : 'span 4'}
          gridRow='span 4'
        >
          <Paper>
            <Box p='.5rem'></Box>
            <Typography
              variant='h2'
              color={palette.neutral.main}
              fontWeight='bold'
              pl='1rem'
            >
              Tickets by Category
            </Typography>
            {tickets.length === 0 ? <Box height='400px'>No tickets</Box> : <PieChart data={categoryTicketData} />}
          </Paper>
        </Box>
        {user.role !== 'SUBMITTER' && (
          <Box
            gridColumn='span 4'
            gridRow='span 4'
          >
            <Paper>
              <Box p='.5rem'></Box>
              <Typography
                variant='h2'
                color={palette.neutral.main}
                fontWeight='bold'
                pl='1rem'
              >
                Projects by Priority
              </Typography>
              {projects.length === 0 ? <Box height='100%'>'No projects'</Box> : <PieChart data={priorityProjectData} />}
            </Paper>
          </Box>
        )}
      </Box>
      {/* END GRID */}
    </Box>
  );
};

export default Dashboard;
