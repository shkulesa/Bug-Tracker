import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CustomGridToolbar from 'components/CustomGridToolbar';
import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import { useNavigate } from 'react-router-dom';

const ProjectTickets = ({ tickets }) => {
  const { palette } = useTheme();
  const navigate = useNavigate();

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
      hide: true,
    },
    {
      field: 'submitter',
      headerName: 'Submitter',
      flex: 0.5,
      hide: true,
    },
    {
      field: 'assignedName',
      headerName: 'Assigned Dev',
      flex: 0.5,
      hide: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.4,
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
                // console.log('TICKET: ');
                // console.log(ticket);
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

  return (
    <Box height='100%'>
      <DataGrid
        getRowId={(row) => row._id}
        initialState={{
          sorting: {
            sortModel: [{ field: 'status', sort: 'desc' }],
          },
        }}
        rows={tickets || []}
        columns={columns}
        density={tickets && tickets.length > 5 ? 'compact' : 'standard'}
        components={{ Toolbar: CustomGridToolbar }}
        sx={{ border: 'none', m: '0' }}
      />
    </Box>
  );
};

export default ProjectTickets;
