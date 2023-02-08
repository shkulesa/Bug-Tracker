import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  Chip,
  OutlinedInput,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setProject, setProjects, setTicket, setUsers } from 'state';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';

const ticketSchema = yup.object().shape({
  title: yup.string().required('required'),
  description: yup.string().required('required'),
  status: yup.string(),
  // endDate: yup.date(),
  // teamUsers: yup.array().min(1, 'There must be at least one team member'),
  // managersUsers: yup.array().min(1, 'There must be at least one manager'),
});

// const date = new Date();
// const currentDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];

const EditTicketForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const { id } = useParams();
  const users = useSelector((state) => state.content.users);
  const token = useSelector((state) => state.token);
  // const user = useSelector((state) => state.user);
  const ticket = useSelector((state) => state.editTicket);
  const assigned = useSelector((state) => state.ticket.assigned);
  const projects = useSelector((state) => state.content.projects);
  // const [user, setUser] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);

  console.log(users);

  // const managersUsers = users.map(({ _id }) => ticket.managers.includes(_id));
  // const teamUsers = users.map(({ _id }) => ticket.team.includes(_id));

  const initialValues = {
    title: ticket.title,
    description: ticket.description,
    category: ticket.category,
    project: ticket.project,
    assignedId: assigned._id,
    status: ticket.status,
  };

  useEffect(() => {
    getTicket();
    getUsers();

    // console.log(users);
  }, []);

  const correctDate = (date) => {
    const hold = new Date(date);
    return new Date(hold.getTime() + hold.getTimezoneOffset() * 60000).toISOString();
  };

  // initialValues.submittedDate = correctDate(ticket.submittedDate);
  // initialValues.endDate = correctDate(ticket.endDate);

  // const handleTeamChange = (event) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   (
  //     // On autofill we get a stringified value.
  //     typeof value === 'string' ? value.split(',') : value,
  //   );
  // };

  const updateProject = async (values, onSubmitProps) => {
    console.log('CReate: ' + token);
    console.log(values);
    const response = await fetch(`http://localhost:3001/tickets/${ticket._id}/update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(values),
    });

    console.log(response);

    const newTicket = await response.json();
    if (newTicket) {
      console.log('!');
      onSubmitProps.resetForm();
      // dispatch(setProjects(tickets));
      navigate(`/tickets/info/${newTicket}`);
    }
    console.log(newTicket);
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    console.log(values);

    const finalValues = JSON.parse(JSON.stringify(values));
    const assignedUser = users.find((user) => user._id === values.assignedId);

    finalValues.assigned = assignedUser._id;
    finalValues.assignedName = assignedUser.firstName + ' ' + assignedUser.lastName;
    delete finalValues.assignedId;

    console.log(finalValues);
    await updateProject(finalValues, onSubmitProps);
  };

  const getTicket = async () => {
    const response = await fetch(`http://localhost:3001/tickets/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const ticket = await response.json();

    dispatch(setTicket({ ticket: ticket }));
    return ticket;
  };

  const getUser = async (userId) => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = await response.json();
    // dispatch(setUsers({ users: users }));
    // setUser(user);
  };

  const getUsers = async () => {
    const response = await fetch('http://localhost:3001/users/all', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const users = await response.json();
    console.log(users);
    dispatch(setUsers({ users: users }));
  };

  const getProjects = async () => {
    const url = 'http://localhost:3001/projects/all';

    const response = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const projects = await response.json();

    console.log(projects);

    dispatch(setProjects({ projects: projects }));
  };

  // const [pageType, setPageType] = useState('LOGIN');
  // const { palette } = useTheme();
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const isNonMobile = useMediaQuery('(min-width:600px)');
  // const isLogin = pageType === 'LOGIN';
  // const isRegister = pageType === 'REGISTER';

  // const handleFormSubmit = async (values, onSubmitProps) => {
  //   if (isLogin) await login(values, onSubmitProps);
  //   if (isRegister) await register(values, onSubmitProps);
  // };

  // const login = async (values, onSubmitProps) => {
  //   const loginResponse = await fetch('http://localhost:3001/auth/login', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(values),
  //   });

  //   const loggedIn = await loginResponse.json();
  //   onSubmitProps.resetForm();

  //   if (loggedIn) {
  //     dispatch(setLogin({ user: loggedIn.user, token: loggedIn.token }));
  //     navigate('/dashboard');
  //   }
  // };

  // const register = async (values, onSubmitProps) => {
  //   const savedUserResponse = await fetch('http://localhost:3001/auth/register', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(values),
  //   });

  //   const savedUser = await savedUserResponse.json();
  //   onSubmitProps.resetForm();

  //   if (savedUser) setPageType('LOGIN');
  // };

  return (
    <Box
      m='1.5rem 2.5rem'
      height='75vh'
    >
      <FlexBetween>
        <Box>
          <Header
            title='Edit Ticket'
            subtitle={ticket.title}
          />
        </Box>
        <Box>
          <Button
            sx={{
              m: '1rem 0',
              p: '1rem',
              backgroundColor: palette.primary.main,
              color: palette.background.alt,
              '&:hover': { color: palette.primary.main },
            }}
            onClick={() => {
              navigate(`/tickets/info/${ticket._id}`);
            }}
          >
            Ticket Details
          </Button>
        </Box>
      </FlexBetween>

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={ticketSchema}
        // validator={() => ({})}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Box
                // display='flex'
                display='grid'
                gap='20px'
                gridTemplateColumns='(1, minmax(0, 1fr))'
                sx={{ '& div': { gridColumn: 'span 1' } }}
              >
                <TextField
                  label='Title'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.title}
                  name='title'
                  error={Boolean(touched.title) && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                  sx={{ gridColumn: 'span 1' }}
                />
                <TextField
                  label='Description'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                  name='description'
                  error={Boolean(touched.description) && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                  sx={{ gridColumn: 'span 1' }}
                />
                <FormControl>
                  <InputLabel id='category-label'>Category</InputLabel>
                  <Select
                    fullWidth
                    sx={{ gridColumn: 'span 1' }}
                    value={values.category}
                    onChange={handleChange}
                    labelId='category-label'
                    label='Category'
                    name='category'
                  >
                    <MenuItem value='Bugs/Issues'>Bugs/Issues</MenuItem>
                    <MenuItem value='Development'>Development</MenuItem>
                    <MenuItem value='Other'>Other</MenuItem>
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel id='assigned-label'>Assigned Developer</InputLabel>
                  <Select
                    fullWidth
                    sx={{ gridColumn: 'span 1' }}
                    value={values.assignedId}
                    onChange={handleChange}
                    labelId='assigned-label'
                    label='Assigned Developer'
                    name='assignedId'
                  >
                    {users.map((user) => {
                      console.log(values.assignedId);
                      return (
                        <MenuItem
                          key={user._id}
                          value={user._id}
                        >
                          {user.firstName + ' ' + user.lastName}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel id='status-label'>Status</InputLabel>
                  <Select
                    fullWidth
                    sx={{ gridColumn: 'span 1' }}
                    value={values.status}
                    onChange={handleChange}
                    labelId='status-label'
                    label='Status'
                    name='status'
                  >
                    <MenuItem value='OPEN'>OPEN</MenuItem>
                    <MenuItem value='CLOSED'>CLOSED</MenuItem>
                    {/* <MenuItem value='Other'>Other</MenuItem> */}
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel id='project-label'>Project</InputLabel>
                  <Select
                    fullWidth
                    sx={{ gridColumn: 'span 1' }}
                    value={values.project}
                    onChange={handleChange}
                    labelId='project-label'
                    label='Project'
                    name='project'
                  >
                    {projects.map((project) => {
                      console.log(values.project);
                      return (
                        <MenuItem
                          key={project._id}
                          value={project._id}
                        >
                          {project.title}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <Button
                  fullWidth
                  type='submit'
                  sx={{
                    m: '2rem 0',
                    p: '1rem',
                    backgroundColor: palette.primary.main,
                    color: palette.background.alt,
                    '&:hover': { color: palette.primary.main },
                  }}
                >
                  Update Ticket
                </Button>
                {/* {console.log(values)} */}
              </Box>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default EditTicketForm;
