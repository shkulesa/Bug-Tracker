import { Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CustomGridToolbar from 'components/CustomGridToolbar';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { removeProjectNote } from 'state/slices/projectSlice';

const ProjectNotes = ({ notes, isManager }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const apiURL = process.env.REACT_APP_API_BASE_URL;

  const deleteNote = async (id) => {
    await fetch(`${apiURL}/notes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch(removeProjectNote({ note: id }));
  };

  const columns =
    user.role === 'ADMIN' || isManager
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
                      console.log('Delete note: ');
                      console.log(_id);
                      deleteNote(_id);
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

export default ProjectNotes;
