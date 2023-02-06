import { Box, Button, IconButton, Paper, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CustomGridToolbar from 'components/CustomGridToolbar';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { useNavigate } from 'react-router-dom';
import { removeNote } from 'state';

const ProjectNotes = ({ notes, isManager }) => {
  const { palette } = useTheme();
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);

  const deleteNote = async (id) => {
    console.log(id);
    await fetch(`http://localhost:3001/notes/${id}/delete`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch(removeNote({ note: id }));
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
          // {
          //   field: 'submitter',
          //   headerName: 'Submitter',
          //   flex: 0.5,
          // },
          // {
          //   field: 'assigned',
          //   headerName: 'Assigned Devs',
          //   flex: 0.5,
          // },
          // {
          //   field: 'status',
          //   headerName: 'Status',
          //   flex: 0.5,
          //   renderCell: ({ row: { status } }) => {
          //     const isOpen = status === 'OPEN';

          //     return (
          //       <Box
          //         width='60%'
          //         m='0 auto'
          //         p='5px'
          //         display='flex'
          //         justifyContent='center'
          //         backgroundColor={isOpen ? palette.primary.mediumMain : palette.primary.medium}
          //         borderRadius='4px'
          //       >
          //         {isOpen ? <ConstructionOutlinedIcon /> : <DoneOutlineOutlinedIcon />}
          //         <Typography
          //           color={palette.neutral.main}
          //           variant='h6'
          //           sx={{ ml: '5px', display: { xs: 'none', sm: 'none', md: 'block' } }}
          //         >
          //           {isOpen ? 'OPEN' : 'CLOSED'}
          //         </Typography>
          //       </Box>
          //     );
          //   },
          // },
          {
            field: 'delete',
            headerName: 'Delete',
            flex: 0.2,
            renderCell: ({ row: { _id } }) => {
              return (
                <Box
                // backgroundColor='red'
                // sx={{ height: '100%', width: '100%' }}
                >
                  <Button
                    // sx={{ height: '100%', width: '100%' }}
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
