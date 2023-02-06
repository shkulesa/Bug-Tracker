import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import FlexBetween from 'components/FlexBetween';
import { useDispatch, useSelector } from 'react-redux';
import { setEditProject, setEditUser, setProjects, setProjectTeam, setTickets, setUsers } from 'state';
import { useEffect, useState } from 'react';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
// import KeyboardDoubleArrowUpOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';
// import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
// // import AdminPanelSettingsOutlined from '@mui/icons-material/AdminPanelSettingsOutlined';
// // import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
// // import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CustomGridToolbar from 'components/CustomGridToolbar';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import { useNavigate } from 'react-router-dom';

const TicketsTable = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const tickets = useSelector((state) => state.content.tickets);
  const [isLoading, setIsLoading] = useState(true);
  const isNonMobile = useMediaQuery('(min-width:600px)');

  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 0.5,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 0.5,
    },
    {
      field: 'submitter',
      headerName: 'Submitter',
      flex: 0.5,
      hide: true,
    },
    {
      field: 'submittedDate',
      headerName: 'Submitted Date',
      flex: 0.5,
      renderCell: ({ row: { submittedDate } }) => {
        const date = new Date(submittedDate);
        return new Date(date.getTime() + date.getTimezoneOffset() * 60000)
          .toISOString()
          .split('.')[0]
          .replace('T', ' ');
      },
      hide: true,
    },
    {
      field: 'changedDate',
      headerName: 'Last Changed',
      flex: 0.5,
      renderCell: ({ row: { history } }) => {
        // console.log(history[history.length - 1]);
        return history[history.length - 1].changedDate.split('.')[0].replace('T', ' ');
      },
    },
    {
      field: 'assignedName',
      headerName: 'Assigned Dev',
      flex: 0.5,
      hide: user.role === 'ADMIN' ? false : true,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.5,
      renderCell: ({ row: { status } }) => {
        const isOpen = status === 'OPEN';

        return (
          <Box
            width='80%'
            m='0 auto'
            p='5px'
            display='flex'
            justifyContent='center'
            backgroundColor={isOpen ? palette.primary.mediumMain : palette.primary.medium}
            borderRadius='4px'
          >
            {isOpen ? <ConstructionOutlinedIcon /> : <DoneOutlineOutlinedIcon />}
            <Typography
              color={palette.neutral.main}
              variant='h6'
              sx={{ ml: '5px', display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' } }}
            >
              {isOpen ? 'OPEN' : 'CLOSED'}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'details',
      headerName: 'More',
      flex: 0.3,
      renderCell: ({ row: ticket }) => {
        return (
          <Box>
            <IconButton
              variant='outlined'
              onClick={() => {
                console.log('TICKET: ');
                console.log(ticket);
                navigate(`/tickets/info/${ticket._id}`);
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  // const handleEditProject = (project) => {
  //   // console.log('USER: ');
  //   // console.log(user);
  //   dispatch(
  //     setEditProject({
  //       editProject: project,
  //     })
  //   );
  // };

  const getTickets = async () => {
    const url =
      user.role === 'ADMIN' ? 'http://localhost:3001/tickets/all' : `http://localhost:3001/user/${user._id}/tickets`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const userTickets = await response.json();

    // console.log(userProjects);

    dispatch(setTickets({ tickets: userTickets }));
    setIsLoading(false);
  };

  const getTeamMembers = async (projectId) => {
    const response = await fetch(`http://localhost:3001/projects/${projectId}/team`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const team = await response.json();

    dispatch(setProjectTeam({ team: team }));
  };

  const handleEditProject = (project) => {
    // console.log('USER: ');
    // console.log(user);
    dispatch(
      setEditProject({
        editProject: project,
      })
    );
  };

  const handleEditProjectUsers = (project) => {
    dispatch(
      setEditProject({
        editProject: project,
      })
    );
    console.log(project._id);
    getTeamMembers(project._id);
  };

  useEffect(() => {
    getTickets();
  }, []);

  return (
    <Box
      mt='.5rem'
      height='100%'
    >
      <Paper sx={{ height: '100%', backgroundColor: palette.background.main }}>
        <DataGrid
          loading={isLoading}
          getRowId={(row) => row._id}
          rows={tickets || []}
          columns={columns}
          components={{ Toolbar: CustomGridToolbar }}
          sx={{ border: 'none' }}
        />
      </Paper>
    </Box>
  );
};

export default TicketsTable;
