import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import CustomGridToolbar from 'components/CustomGridToolbar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import { useNavigate } from 'react-router-dom';
import useFetchTickets from 'api/useFetchTickets';

const TicketsTable = ({ isDashboard = false }) => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const tickets = useSelector((state) => state.user.tickets);
  const [isLoading, setIsLoading] = useState(true);
  const fetchTickets = useFetchTickets();

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
          field: 'priority',
          headerName: 'Priority',
          flex: 0.25,
          renderCell: ({ row: { priority } }) => {
            return (
              <Typography
                color={
                  priority === 'HIGH'
                    ? palette.priority.high
                    : priority === 'MEDIUM'
                    ? palette.priority.medium
                    : palette.priority.low
                }
                fontWeight='600'
              >
                {priority}
              </Typography>
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

  useEffect(() => {
    fetchTickets(user, token).then(() => {
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
