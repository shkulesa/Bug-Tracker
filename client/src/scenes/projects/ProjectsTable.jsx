import { Box, Button, IconButton, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { setEditProject, setProjects, setProjectTeam } from 'state';
import { useEffect, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import KeyboardDoubleArrowUpOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
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

  const priorityComparator = (a, b) => {
    const priorities = { LOW: 0, MEDIUM: 1, HIGH: 2 };
    return priorities[b] - priorities[a];
  };

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
                    sx={{ ml: '5px', display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' } }}
                  >
                    {priority}
                  </Typography>
                </Box>
              );
            },
            sortComparator: priorityComparator,
          },
          {
            field: 'details',
            headerName: 'Details',
            flex: 0.3,
            renderCell: ({ row: project }) => {
              return (
                <Box>
                  <IconButton
                    variant='outlined'
                    onClick={() => {
                      // console.log('PROJECT: ');
                      // console.log(project);
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
      : page === 'DASHBOARD'
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
                    sx={{ ml: '5px', display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' } }}
                  >
                    {priority}
                  </Typography>
                </Box>
              );
            },
            sortComparator: priorityComparator,
          },
          {
            field: 'details',
            headerName: 'Details',
            flex: 0.2,
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

  const getProjects = async () => {
    const url =
      user.role === 'ADMIN' ? 'http://localhost:3001/projects/all' : `http://localhost:3001/users/${user._id}/projects`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    let userProjects;
    if (page === 'USERS' && user.role === 'DEVELOPER') {
      const allProjects = response.status === 404 ? [] : await response.json();
      userProjects = allProjects.filter(({ managers }) => managers.includes(user._id));
    } else {
      userProjects = response.status === 404 ? [] : await response.json();
    }

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
      <DataGrid
        loading={isLoading}
        initialState={{
          sorting: {
            sortModel: [{ field: 'priority', sort: 'asc' }],
          },
        }}
        getRowId={(row) => row._id}
        rows={projects || []}
        columns={columns}
        density={(!page === 'DASHBOARD' && projects && projects.length) > 5 ? 'compact' : 'standard'}
        components={{ Toolbar: CustomGridToolbar }}
        sx={{ border: 'none' }}
      />
    </Box>
  );
};

export default ProjectsTable;
