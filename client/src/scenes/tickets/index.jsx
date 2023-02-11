import { Box, Button, Paper, useTheme } from '@mui/material';
import Header from 'components/Header';
import { useNavigate } from 'react-router-dom';
import TicketsTable from './TicketsTable';

const Tickets = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      m='1.5rem 2.5rem'
      height='75vh'
    >
      <Header
        title='Tickets'
        subtitle='View your tickets'
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
          navigate('/tickets/new');
        }}
      >
        Create new Ticket
      </Button>
      <Box height='65vh'>
        <Paper sx={{ height: '100%' }}>
          <TicketsTable />
        </Paper>
      </Box>
    </Box>
  );
};

export default Tickets;
