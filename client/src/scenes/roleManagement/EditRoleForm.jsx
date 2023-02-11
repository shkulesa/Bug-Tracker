import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Typography, useTheme } from '@mui/material';
import Header from 'components/Header';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEditUser, setUsers } from 'state';

const ROLES = ['-CHOOSE A ROLE-', 'ADMIN', 'DEVELOPER', 'SUBMITTER'];

const EditRoleForm = ({ isNonMobile }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.editUser);
  const token = useSelector((state) => state.token);
  const [newRole, setNewRole] = useState('-CHOOSE A ROLE-');

  const values = {
    role: newRole,
  };

  const handleChange = (event) => {
    setNewRole(event.target.value);
  };

  const updateRole = async () => {
    if (newRole && newRole !== '-CHOOSE A ROLE-' && newRole !== user.role) {
      const response = await fetch(`http://localhost:3001/users/${user._id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(values),
      });
      const updatedUsers = await response.json();
      console.log(updatedUsers);
      dispatch(
        setUsers({
          users: updatedUsers,
        })
      );
    }
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
            subtitle={user ? user.firstName + ' ' + user.lastName : 'No user selected'}
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
                disabled={user === null || newRole === '-CHOOSE A ROLE-'}
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
