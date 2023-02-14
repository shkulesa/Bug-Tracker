import { Box, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CustomGridToolbar from 'components/CustomGridToolbar';
import React from 'react';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

const ProjectTeam = ({ team, managers }) => {
  const { palette } = useTheme();

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
            backgroundColor={isManager ? palette.primary.mediumMain : palette.primary.medium}
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
              sx={{ ml: '5px', display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' } }}
            >
              {role === 'ADMIN' ? 'Admin' : isManager ? 'Manager' : 'Developer'}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box height='100%'>
      <DataGrid
        getRowId={(row) => row._id}
        rows={team || []}
        columns={columns}
        density={team && team.length > 5 ? 'compact' : 'standard'}
        components={{ Toolbar: CustomGridToolbar }}
        sx={{ border: 'none', m: '0' }}
      />
    </Box>
  );
};

export default ProjectTeam;
