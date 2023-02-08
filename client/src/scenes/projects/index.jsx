import { Box, Button, Paper, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProjectsTable from './ProjectsTable';

const Projects = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  // const token = useSelector((state) => state.token);
  // const user = useSelector((state) => state.user);
  // const projects = useSelector((state) => state.user.projects);

  return (
    <Box
      m='1.5rem 2.5rem'
      height='75vh'
    >
      <Header
        title='Projects'
        subtitle='View your projects'
      />
      <Button
        sx={{
          m: '1rem 0',
          p: '1rem',
          backgroundColor: palette.primary.main,
          color: palette.background.alt,
          '&:hover': { color: palette.primary.main },
        }}
        onClick={() => {
          navigate('/projects/new');
        }}
      >
        Create new Project
      </Button>
      {/* <FlexBetween gap='30px'> */}
      <Box
        height='65vh'
        // flexGrow={1}
      >
        <Paper sx={{ height: '100%' }}>
          <ProjectsTable page='PROJECTS' />
        </Paper>
      </Box>
      {/* <Box
          height='600px'
          flexGrow={0.5}
        >
          <EditProjectForm />
        </Box> */}
      {/* </FlexBetween> */}
      {/* </Box> */}
    </Box>
  );
};

export default Projects;
