import { Box, Button, Paper, useTheme } from '@mui/material';
import Header from 'components/Header';
import { useNavigate } from 'react-router-dom';
import ProjectsTable from './ProjectsTable';

const Projects = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();

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
      <Box height='65vh'>
        <Paper sx={{ height: '100%' }}>
          <ProjectsTable page='PROJECTS' />
        </Paper>
      </Box>
    </Box>
  );
};

export default Projects;
