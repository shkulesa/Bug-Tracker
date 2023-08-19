import { Box, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

const ProjectUsersTable = ({ editTeam, editProject }) => {
  const { palette } = useTheme();
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    setManagers(editProject.managers);
  }, [editProject, editTeam]);

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      valueGetter: ({ row: { firstName, lastName } }) => {
        return firstName + ' ' + lastName;
      },
    },
    {
      field: 'isManager',
      headerName: 'Role',
      flex: 0.75,
      renderCell: ({ row: { _id, role } }) => {
        const isManager = managers.includes(_id);

        return (
          <Box
            width='60%'
            m='0 auto'
            p='5px'
            display='flex'
            justifyContent='center'
            backgroundColor={isManager || role === 'ADMIN' ? palette.primary.mediumMain : palette.primary.medium}
            borderRadius='4px'
          >
            {role === 'ADMIN' ? (
              <AdminPanelSettingsOutlinedIcon />
            ) : isManager ? (
              <ManageAccountsOutlinedIcon />
            ) : (
              <PersonOutlineOutlinedIcon />
            )}
            <Typography
              color={palette.neutral.main}
              variant='h6'
              sx={{ ml: '5px', display: { xs: 'none', sm: 'none', md: 'none', lg: 'block', xl: 'block' } }}
            >
              {role === 'ADMIN' ? 'Admin' : isManager ? 'Manager' : 'Developer'}
            </Typography>
          </Box>
        );
      },
    },
  ];
  // console.log(team);

  return (
    <Box height='100%'>
      <DataGrid
        getRowId={(row) => {
          // console.log(row);
          return row._id;
        }}
        rows={editTeam || []}
        columns={columns}
        sx={{ m: '0', backgroundColor: palette.background.alt, p: '0' }}
      />
    </Box>
  );
};

export default ProjectUsersTable;
