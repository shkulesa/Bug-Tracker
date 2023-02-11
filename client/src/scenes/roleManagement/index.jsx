import React from 'react';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import RoleTable from './RoleTable';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import EditRoleForm from './EditRoleForm';

const RoleManagement = () => {
  const isNonMobile = useMediaQuery('(min-width: 600px)');
  const theme = useTheme();

  return (
    <Box
      m='1.5rem 2.5rem'
      height='75vh'
    >
      <Header
        title='ROLE MANAGEMENT'
        subtitle='Manage User Roles'
      />
      <FlexBetween gap='30px'>
        <Box
          height='600px'
          flexGrow={1}
        >
          <RoleTable />
        </Box>
        <Box
          height='600px'
          flexGrow={0.5}
        >
          <EditRoleForm
            sx={{ borderColor: theme.palette.primary.main, borderRadius: '4px', borderWeight: '5px' }}
            isNonMobile={isNonMobile}
          />
        </Box>
      </FlexBetween>
    </Box>
  );
};

export default RoleManagement;
