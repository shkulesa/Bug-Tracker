//not used

import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CustomGridToolbar from 'components/CustomGridToolbar';
import React from 'react';

const TicketAssigned = ({ assigned }) => {
  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 0.5,
      valueGetter: ({ row: { firstName, lastName } }) => {
        return firstName + ' ' + lastName;
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 0.75,
    },
  ];

  return (
    <Box height='100%'>
      <DataGrid
        getRowId={(row) => row._id}
        rows={assigned || []}
        columns={columns}
        components={{ Toolbar: CustomGridToolbar }}
        sx={{ border: 'none', m: '0' }}
      />
    </Box>
  );
};

export default TicketAssigned;
