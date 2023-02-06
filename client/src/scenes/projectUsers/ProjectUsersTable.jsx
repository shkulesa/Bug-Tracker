import { Box, Paper, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CustomGridToolbar from 'components/CustomGridToolbar';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProjectTeam } from 'state';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

const ProjectUsersTable = ({ team, project }) => {
  const { palette } = useTheme();
  const [managers, setManagers] = useState([]);
  // const { team, managers } = useSelector((state) => state.editProject);
  // const team = useSelector((state) => state.project.team);
  // const { managers } = useSelector((state) => state.content.project);
  // console.log(team);
  // console.log(managers);
  // console.log(rows)

  useEffect(() => {
    setManagers(project.managers);
  }, [project, team]);

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      valueGetter: ({ row: { firstName, lastName } }) => {
        // console.log(row);
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
      {/* <DataGrid columns={columns} rows={ || []}/> */}
      <DataGrid
        getRowId={(row) => {
          // console.log(row);
          return row._id;
        }}
        rows={team || []}
        columns={columns}
        sx={{ m: '0', backgroundColor: palette.background.alt, p: '0' }}
      />
    </Box>
  );
};

export default ProjectUsersTable;
