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
      hide: true,
    },
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
  ];

  return (
    <Box
      mt='.5rem'
      height='100%'
    >
      <Paper sx={{ height: '100%', backgroundColor: palette.background.main }}>
        <DataGrid
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
