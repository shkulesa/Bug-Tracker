import { Paper, Box, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CustomGridToolbar from 'components/CustomGridToolbar';

const TicketHistory = ({ history }) => {
  const { palette } = useTheme();

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
    // {
    //   field: 'submitter',
    //   headerName: 'Submitter',
    //   flex: 0.5,
    //   hide: true,
    // },
    // {
    //   field: 'submittedDate',
    //   headerName: 'Submitted Date',
    //   flex: 0.5,
    //   renderCell: ({ row: { submittedDate } }) => {
    //     return submittedDate.split('.')[0].replace('T', ' ');
    //   },
    //   hide: true,
    // },
    {
      field: 'changedDate',
      headerName: 'Last Changed',
      flex: 0.5,
      renderCell: ({ row: { changedDate } }) => {
        return changedDate.split('.')[0].replace('T', ' ');
      },
    },
    {
      field: 'assignedName',
      headerName: 'Assigned Dev',
      flex: 0.5,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.5,
      // renderCell: ({ row: { status } }) => {
      //   const isOpen = status === 'OPEN';

      //   return (
      //     <Box
      //       width='80%'
      //       m='0 auto'
      //       p='5px'
      //       display='flex'
      //       justifyContent='center'
      //       backgroundColor={isOpen ? palette.primary.mediumMain : palette.primary.medium}
      //       borderRadius='4px'
      //     >
      //       {isOpen ? <ConstructionOutlinedIcon /> : <DoneOutlineOutlinedIcon />}
      //       <Typography
      //         color={palette.neutral.main}
      //         variant='h6'
      //         sx={{ ml: '5px', display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' } }}
      //       >
      //         {isOpen ? 'OPEN' : 'CLOSED'}
      //       </Typography>
      //     </Box>
      //   );
      // },
    },
    {
      field: 'project',
      headerName: 'Project',
      flex: 0.5,
      hide: true,
    },
    {
      field: 'operation',
      headerName: 'Changed',
      flex: 0.5,
    },
    // {
    //   field: 'details',
    //   headerName: 'More',
    //   flex: 0.3,
    //   renderCell: ({ row: ticket }) => {
    //     return (
    //       <Box>
    //         <IconButton
    //           variant='outlined'
    //           onClick={() => {
    //             console.log('TICKET: ');
    //             console.log(ticket);
    //             navigate(`/tickets/info/${ticket._id}`);
    //           }}
    //         >
    //           <MoreVertIcon />
    //         </IconButton>
    //       </Box>
    //     );
    //   },
    // },
  ];

  return (
    <Box
      mt='.5rem'
      height='100%'
    >
      <Paper sx={{ height: '100%', backgroundColor: palette.background.main }}>
        <DataGrid
          // loading={isLoading}
          getRowId={(row) => row._id}
          rows={history || []}
          columns={columns}
          components={{ Toolbar: CustomGridToolbar }}
          sx={{ border: 'none' }}
        />
      </Paper>
    </Box>
  );
};

export default TicketHistory;
