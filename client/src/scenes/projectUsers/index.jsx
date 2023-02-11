import { Box, Paper, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import { useParams } from 'react-router-dom';
import ProjectsTable from 'scenes/projects/ProjectsTable';
import ProjectUsersForm from './ProjectUsersForm';

const ProjectUsers = () => {
  const { palette } = useTheme();
  const { id } = useParams();

  return (
    <Box
      m='1.5rem 2.5rem'
      height='75vh'
    >
      <Header
        title='PROJECT USERS'
        subtitle='Manage project users'
      />
      <FlexBetween gap='20px'>
        <Box
          height='600px'
          width='60%'
        >
          <Paper sx={{ height: '100%' }}>
            <ProjectsTable
              page='USERS'
              project={id}
            />
          </Paper>
        </Box>
        <Box
          height='600px'
          width='40%'
        >
          <ProjectUsersForm
            sx={{ borderColor: palette.primary.main, borderRadius: '4px', borderWeight: '5px' }}
            linkToProject={id !== 'none'}
          />
        </Box>
      </FlexBetween>
    </Box>
  );
};

export default ProjectUsers;
