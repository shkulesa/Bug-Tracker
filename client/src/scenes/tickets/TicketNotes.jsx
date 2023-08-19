import { Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CustomGridToolbar from 'components/CustomGridToolbar';
import React from 'react';
import { useSelector } from 'react-redux';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import useFetchNotes from 'api/useFetchNotes';

const TicketNotes = ({ notes, isDev }) => {
  const token = useSelector((state) => state.user.token);
  const { deleteNote } = useFetchNotes();

  const columns = isDev
    ? [
        {
          field: 'content',
          headerName: 'Note',
          flex: 1,
        },
        {
          field: 'author',
          headerName: 'Writer',
          flex: 0.3,
        },
        {
          field: 'writtenDate',
          headerName: 'Written',
          flex: 0.3,
          renderCell: ({ row: { writtenDate } }) => {
            return writtenDate.split('.')[0].replace('T', ' ');
          },
        },
        {
          field: 'delete',
          headerName: 'Delete',
          flex: 0.2,
          renderCell: ({ row: { _id } }) => {
            return (
              <Box>
                <Button
                  variant='outlined'
                  onClick={() => {
                    deleteNote(_id, token);
                  }}
                  sx={{
                    color: '#FF7572',
                    borderColor: '#FF7572',
                    '&:hover': { borderColor: '#FF7572', backgroundColor: '#FFABA92C' },
                  }}
                >
                  <DeleteForeverOutlinedIcon />
                </Button>
              </Box>
            );
          },
        },
      ]
    : [
        {
          field: 'content',
          headerName: 'Note',
          flex: 1,
        },
        {
          field: 'author',
          headerName: 'Writer',
          flex: 0.3,
        },
        {
          field: 'writtenDate',
          headerName: 'Written',
          flex: 0.3,
          renderCell: ({ row: { writtenDate } }) => {
            return writtenDate.split('.')[0].replace('T', ' ');
          },
        },
      ];

  return (
    <Box height='100%'>
      <DataGrid
        getRowId={(row) => row._id}
        getRowHeight={() => 'auto'}
        rows={notes || []}
        columns={columns}
        components={{ Toolbar: CustomGridToolbar }}
        sx={{ border: 'none', m: '0' }}
      />
    </Box>
  );
};

export default TicketNotes;
