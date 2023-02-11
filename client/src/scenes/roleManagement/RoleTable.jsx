import { Box, Button, Paper, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { setEditUser, setUsers } from 'state';
import { useEffect, useState } from 'react';
import AdminPanelSettingsOutlined from '@mui/icons-material/AdminPanelSettingsOutlined';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CustomGridToolbar from 'components/CustomGridToolbar';

const RoleTable = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { role } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const users = useSelector((state) => state.content.users);
  const [isLoading, setIsLoading] = useState(true);

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
      field: 'role',
      headerName: 'Role',
      flex: 0.75,
      renderCell: ({ row: { role } }) => {
        return (
          <Box
            width='60%'
            m='0 auto'
            p='5px'
            display='flex'
            justifyContent='center'
            backgroundColor={role === 'ADMIN' ? theme.palette.primary.mediumMain : theme.palette.primary.medium}
            borderRadius='4px'
          >
            {role === 'ADMIN' && <AdminPanelSettingsOutlined />}
            {role === 'DEVELOPER' && <EngineeringOutlinedIcon />}
            {role === 'SUBMITTER' && <PersonOutlineOutlinedIcon />}
            <Typography
              color={theme.palette.neutral.main}
              variant='h6'
              sx={{ ml: '5px', display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' } }}
            >
              {role}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'edit',
      headerName: 'Select',
      flex: 0.4,
      renderCell: ({ row: user }) => {
        return (
          <Box>
            <Button
              variant='outlined'
              onClick={() => {
                console.log('USER: ');
                console.log(user);
                handleEditUser(user);
              }}
            >
              <SettingsOutlinedIcon />
            </Button>
          </Box>
        );
      },
    },
  ];

  const handleEditUser = (user) => {
    dispatch(
      setEditUser({
        editUser: user,
      })
    );
  };

  const getUsers = async () => {
    const response = await fetch('http://localhost:3001/users/all', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const users = await response.json();
    dispatch(setUsers({ users: users }));
  };

  useEffect(() => {
    getUsers();
    setIsLoading(false);
  }, []);

  return (
    role == 'ADMIN' && (
      <Box
        mt='2rem'
        height='100%'
      >
        <Paper sx={{ height: '100%', backgroundColor: theme.palette.background.main }}>
          <DataGrid
            loading={isLoading}
            getRowId={(row) => row._id}
            rows={users || []}
            columns={columns}
            components={{ Toolbar: CustomGridToolbar }}
            sx={{ border: 'none' }}
          />
        </Paper>
      </Box>
    )
  );
};

export default RoleTable;
