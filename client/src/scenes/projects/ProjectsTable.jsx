import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import FlexBetween from 'components/FlexBetween';
import { useDispatch, useSelector } from 'react-redux';
import { setEditProject, setEditUser, setProjects, setProjectTeam, setUsers } from 'state';
import { useEffect, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import KeyboardDoubleArrowUpOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
// import AdminPanelSettingsOutlined from '@mui/icons-material/AdminPanelSettingsOutlined';
// import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CustomGridToolbar from 'components/CustomGridToolbar';
import { useNavigate } from 'react-router-dom';

const ProjectsTable = ({ page, project }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const projects = useSelector((state) => state.content.projects);
  const [isLoading, setIsLoading] = useState(true);
  const isNonMobile = useMediaQuery('(min-width:600px)');

  const columns =
    page === 'PROJECTS'
      ? [
          {
            field: 'title',
            headerName: 'Title',
            flex: 0.5,
          },
          {
            field: 'description',
            headerName: 'Description',
            flex: 0.75,
          },
          {
            field: 'startDate',
            headerName: 'Start date',
            flex: 0.5,
            renderCell: ({ row: { startDate } }) => {
              return startDate.split('T')[0];
            },
          },
          {
            field: 'endDate',
            headerName: 'End Date',
            flex: 0.5,
            renderCell: ({ row: { endDate } }) => {
              return endDate.split('T')[0];
            },
          },
          {
            field: 'priority',
            headerName: 'Priority',
            flex: 0.75,
            renderCell: ({ row: { priority } }) => {
              return (
                <Box
                  width='60%'
                  m='0 auto'
                  p='5px'
                  display='flex'
                  justifyContent='center'
                  backgroundColor={
                    priority === 'HIGH'
                      ? theme.palette.primary.mediumMain
                      : priority === 'MEDIUM'
                      ? theme.palette.primary.medium
                      : theme.palette.primary.light
                  }
                  borderRadius='4px'
                >
                  {priority === 'HIGH' && <PriorityHighOutlinedIcon />}
                  {priority === 'MEDIUM' && <KeyboardDoubleArrowUpOutlinedIcon />}
                  {priority === 'LOW' && <KeyboardArrowUpOutlinedIcon />}
                  <Typography
                    color={theme.palette.neutral.main}
                    variant='h6'
                    sx={{ ml: '5px', display: { xs: 'none', sm: 'none', md: 'block' } }}
                  >
                    {priority}
                  </Typography>
                </Box>
              );
            },
          },
          {
            field: 'more',
            headerName: 'More',
            flex: 0.3,
            renderCell: ({ row: project }) => {
              return (
                <Box>
                  <IconButton
                    variant='outlined'
                    onClick={() => {
                      console.log('PROJECT: ');
                      console.log(project);
                      navigate(`/projects/info/${project._id}`);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              );
            },
          },
        ]
      : [
          {
            field: 'title',
            headerName: 'Title',
            flex: 0.5,
          },
          {
            field: 'description',
            headerName: 'Description',
            flex: 0.75,
          },
          {
            field: 'edit',
            headerName: 'Select',
            flex: 0.4,
            renderCell: ({ row: project }) => {
              return (
                <Box>
                  <Button
                    variant='outlined'
                    onClick={() => {
                      console.log('PROJECT: ');
                      console.log(project);
                      handleEditProjectUsers(project);
                    }}
                  >
                    <SettingsOutlinedIcon />
                  </Button>
                </Box>
              );
            },
          },
        ];

  const seeProjectDetails = (project) => {};

  // const handleEditProject = (project) => {
  //   // console.log('USER: ');
  //   // console.log(user);
  //   dispatch(
  //     setEditProject({
  //       editProject: project,
  //     })
  //   );
  // };

  const getProjects = async () => {
    const url =
      user.role === 'ADMIN' ? 'http://localhost:3001/projects/all' : `http://localhost:3001/users/${user._id}/projects`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const userProjects = await response.json();

    // console.log(userProjects);

    dispatch(setProjects({ projects: userProjects }));
  };

  const getTeamMembers = async (projectId) => {
    const response = await fetch(`http://localhost:3001/projects/${projectId}/team`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const team = await response.json();

    dispatch(setProjectTeam({ team: team }));
  };

  const handleEditProject = (project) => {
    // console.log('USER: ');
    // console.log(user);
    dispatch(
      setEditProject({
        editProject: project,
      })
    );
  };

  const handleEditProjectUsers = (project) => {
    dispatch(
      setEditProject({
        editProject: project,
      })
    );
    console.log(project._id);
    getTeamMembers(project._id);
  };

  useEffect(() => {
    getProjects();
    setIsLoading(false);
    if (!project) {
      dispatch(
        setEditProject({
          editProject: null,
        })
      );
      dispatch(
        setProjectTeam({
          team: null,
        })
      );
    }
  }, []);

  return (
    <Box
      mt='.5rem'
      height='100%'
    >
      <Paper sx={{ height: '100%', backgroundColor: theme.palette.background.main }}>
        <DataGrid
          loading={isLoading}
          getRowId={(row) => row._id}
          rows={projects || []}
          columns={columns}
          components={{ Toolbar: CustomGridToolbar }}
          sx={{ border: 'none' }}
        />
      </Paper>
    </Box>
  );
};

export default ProjectsTable;
