import { Box, Button, Paper, Typography, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  return (
    <Box
      m='1.5rem 2.5rem'
      height='75vh'
    >
      <FlexBetween>
        <Header
          title='Your Account'
          subtitle={user.firstName + ' ' + user.lastName}
        />
        <Button
          sx={{
            m: '1rem 1rem 0 0',
            p: '1rem',
            backgroundColor: palette.primary.main,
            color: palette.background.alt,
            '&:hover': { color: palette.primary.main },
          }}
          onClick={() => {
            navigate('/tickets/new');
          }}
        >
          Go to Dashboard
        </Button>
      </FlexBetween>
      <Box
        width='400px'
        mt='1rem'
      >
        <Paper>
          <Box
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
          >
            <Box p='1.5rem'>
              <Typography
                variant='h5'
                fontWeight='bold'
                color={palette.neutral.main}
              >
                ID
              </Typography>
              <Typography
                variant='h3'
                fontWeight='bold'
                color={palette.primary.main}
              >
                {user._id}
              </Typography>
            </Box>
            <Box p='1.5rem'>
              <Typography
                variant='h5'
                fontWeight='bold'
                color={palette.neutral.main}
              >
                Name
              </Typography>
              <Typography
                variant='h3'
                fontWeight='bold'
                color={palette.primary.main}
              >
                {user.firstName + ' ' + user.lastName}
              </Typography>
            </Box>
            <Box p='1.5rem'>
              <Typography
                variant='h5'
                fontWeight='bold'
                color={palette.neutral.main}
              >
                Email
              </Typography>
              <Typography
                variant='h3'
                fontWeight='bold'
                color={palette.primary.main}
              >
                {user.email}
              </Typography>
            </Box>
            <Box p='1.5rem'>
              <Typography
                variant='h5'
                fontWeight='bold'
                color={palette.neutral.main}
              >
                Role
              </Typography>
              <Typography
                variant='h3'
                fontWeight='bold'
                color={palette.primary.main}
              >
                {user.role}
              </Typography>
            </Box>
            {user.role !== 'SUBMITTER' && (
              <>
                <Box p='1.5rem'>
                  <Typography
                    variant='h5'
                    fontWeight='bold'
                    color={palette.neutral.main}
                  >
                    Tickets
                  </Typography>
                  <Typography
                    variant='h3'
                    fontWeight='bold'
                    color={palette.primary.main}
                  >
                    {user.tickets.length}
                  </Typography>
                </Box>
                <Box p='1.5rem'>
                  <Typography
                    variant='h5'
                    fontWeight='bold'
                    color={palette.neutral.main}
                  >
                    Projects
                  </Typography>
                  <Typography
                    variant='h3'
                    fontWeight='bold'
                    color={palette.primary.main}
                  >
                    {user.projects.length}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Account;
