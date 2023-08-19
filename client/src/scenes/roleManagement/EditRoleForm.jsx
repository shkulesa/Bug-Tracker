import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Typography, useTheme } from '@mui/material';
import useFetchUserInfo from 'api/useFetchUserInfo';
import Header from 'components/Header';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEditUser } from 'state/slices/editSlice';

const ROLES = ['ADMIN', 'DEVELOPER', 'SUBMITTER'];

const EditRoleForm = ({ isNonMobile }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const editUser = useSelector((state) => state.edit.user);
  const token = useSelector((state) => state.user.token);
  const [newRole, setNewRole] = useState('');
  const updateUserRole = useFetchUserInfo();

  const values = {
    role: newRole,
  };

  const handleChange = (event) => {
    setNewRole(event.target.value);
  };

  const updateRole = async () => {
    await updateUserRole(editUser._id, values, token);
  };

  useEffect(() => {
    dispatch(
      setEditUser({
        editUser: null,
      })
    );
  }, []);

  return (
    <Paper sx={{ height: '100%', backgroundColor: theme.palette.background.main }}>
      <Box
        height='100%'
        mt='2rem'
        p='1rem'
        sx={{
          borderRadius: '4px',
        }}
      >
        <Box
          borderBottom={`1px solid ${theme.palette.neutral.medium}`}
          pb='1rem'
        >
          <Header
            title='EDIT ROLE'
            subtitle={editUser ? editUser.firstName + ' ' + editUser.lastName : 'No user selected'}
          />
        </Box>
        <Box
          width='100%'
          mt='1rem'
        >
          <Typography
            variant='h5'
            color={theme.palette.neutral.main}
            sx={{ pb: '.5rem', m: '.5rem' }}
          >
            Select a Role:
          </Typography>
          <FormControl fullWidth>
            <InputLabel id='role-label'>Role</InputLabel>
            <Select
              labelId='role-label'
              label='Role'
              value={newRole}
              onChange={handleChange}
            >
              {/* <MenuItem
                    // key={role}
                    value=''
                  >
                    <em>Select a role</em>
                  </MenuItem> */}
              {ROLES.map((role) => {
                return (
                  <MenuItem
                    key={role}
                    value={role}
                  >
                    {role}
                  </MenuItem>
                );
              })}
            </Select>
            <Box textAlign='center'>
              <Button
                disabled={editUser === null || newRole === '-CHOOSE A ROLE-'}
                onClick={updateRole}
                sx={{
                  width: isNonMobile ? '60%' : '100%',
                  m: '2rem 0',
                  p: '1rem',
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.background.alt,
                  '&:hover': { color: theme.palette.primary.main },
                }}
              >
                Update Role
              </Button>
            </Box>
          </FormControl>
        </Box>
      </Box>
    </Paper>
  );
};

export default EditRoleForm;
