import { Box, Button, IconButton, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import KeyboardDoubleArrowUpOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CustomGridToolbar from 'components/CustomGridToolbar';
import { useNavigate } from 'react-router-dom';
import useFetchProjects from 'api/useFetchProjects';
import useFetchProjectInfo from 'api/useFetchProjectInfo';
import { setEditProject, setEditTeam } from 'state/slices/editSlice';

const ProjectsTable = ({ page }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const projects = useSelector((state) => state.user.projects);
  const managedProjects = useSelector((state) => state.user.managedProjects);
  const editProject = useSelector((state) => state.edit.project);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchProjects, fetchManagedProjects } = useFetchProjects();
  const { fetchTeamMembersForEdit } = useFetchProjectInfo();

  const priorityComparator = (a, b) => {
    const priorities = { LOW: 0, MEDIUM: 1, HIGH: 2 };
    return priorities[b] - priorities[a];
  };

  const commonColumns = [
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
  ];

  const columns =
    page === 'PROJECTS'
      ? [
          ...commonColumns,
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
          ...commonColumns,
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
          ...commonColumns,
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

  useEffect(() => {
    //update state with appropriate projects
    if (page === 'PROJECTS' || page === 'DASHBOARD') {
      fetchProjects(user, token);
    } else {
      fetchManagedProjects(user, token);
    }

    setIsLoading(false);
    if (!editProject) {
      dispatch(
        setEditProject({
          editProject: null,
        })
      );
      dispatch(
        setEditTeam({
          team: null,
        })
      );
    }
  }, []);

  const handleEditProjectUsers = (editProject) => {
    dispatch(
      setEditProject({
        editProject: editProject,
      })
    );
    console.log(editProject._id);
    fetchTeamMembersForEdit(editProject._id, token);
  };

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
        rows={page === 'USERS' ? managedProjects : projects || []}
        columns={columns}
        density={(!page === 'DASHBOARD' && projects && projects.length) > 5 ? 'compact' : 'standard'}
        components={{ Toolbar: CustomGridToolbar }}
        sx={{ border: 'none' }}
      />
    </Box>
  );
};

export default ProjectsTable;
