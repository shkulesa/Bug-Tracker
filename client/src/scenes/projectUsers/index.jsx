import { Box, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import { useParams } from 'react-router-dom';
import ProjectsTable from 'scenes/projects/ProjectsTable';
import ProjectUsersForm from './ProjectUsersForm';

const ProjectUsers = () => {
  const { palette } = useTheme();
  const { id } = useParams();

  console.log(id);

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
          // flexGrow={4}
          width='60%'
        >
          <ProjectsTable
            page='USERS'
            project={id}
          />
        </Box>
        <Box
          height='600px'
          // flexGrow={0.25}
          width='40%'
        >
          <ProjectUsersForm
            sx={{ borderColor: palette.primary.main, borderRadius: '4px', borderWeight: '5px' }}
            // isNonMobile={isNonMobile}
          />
        </Box>
      </FlexBetween>
    </Box>
  );
};

export default ProjectUsers;
