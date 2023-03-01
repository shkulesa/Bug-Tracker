import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { setTickets } from 'state';
import { useEffect, useState } from 'react';
import CustomGridToolbar from 'components/CustomGridToolbar';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import { useNavigate } from 'react-router-dom';

const TicketsTable = ({ isDashboard = false }) => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const tickets = useSelector((state) => state.content.tickets);
  const [isLoading, setIsLoading] = useState(true);
  const apiURL = process.env.REACT_APP_API_BASE_URL;

  const columns = isDashboard
    ? [
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
          hide: true,
        },
        {
          field: 'submitterName',
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
          headerName: 'Details',
          flex: 0.2,
          renderCell: ({ row: ticket }) => {
            return (
              <Box>
                <IconButton
                  variant='outlined'
                  onClick={() => {
                    navigate(`/tickets/info/${ticket._id}`);
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
            );
          },
        },
      ]
    : [
        {
          field: 'title',
          headerName: 'Title',
          flex: 0.75,
        },
        {
          field: 'description',
          headerName: 'Description',
          flex: 1.5,
        },
        {
          field: 'category',
          headerName: 'Category',
          flex: 0.5,
        },
        {
          field: 'submitterName',
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
            return history[history.length - 1].changedDate.split('.')[0].replace('T', ' ');
          },
          hide: true,
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
          headerName: 'Details',
          flex: 0.3,
          renderCell: ({ row: ticket }) => {
            return (
              <Box>
                <IconButton
                  variant='outlined'
                  onClick={() => {
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

  const getTickets = async () => {
    const url = user.role !== 'DEVELOPER' ? `${apiURL}/tickets/all` : `${apiURL}/users/${user._id}/tickets`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    let userTickets;
    if (user.role === 'SUBMITTER') {
      const allTickets = response.status === 404 ? [] : await response.json();
      userTickets = allTickets.filter((ticket) => ticket.submitter === user._id);
    } else {
      userTickets = response.status === 404 ? [] : await response.json();
    }

    dispatch(setTickets({ tickets: userTickets }));
  };

  useEffect(() => {
    getTickets().then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <Box
      mt='.5rem'
      height='100%'
    >
      <DataGrid
        loading={isLoading}
        initialState={{
          sorting: {
            sortModel: [{ field: 'status', sort: 'desc' }],
          },
        }}
        getRowId={(row) => row._id}
        rows={tickets || []}
        columns={columns}
        density={!isDashboard && tickets && tickets.length > 5 ? 'compact' : 'standard'}
        components={{ Toolbar: CustomGridToolbar }}
        sx={{ border: 'none' }}
      />
    </Box>
  );
};

export default TicketsTable;
