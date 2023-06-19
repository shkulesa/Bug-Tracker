import { useEffect } from 'react';
import { Box, Button, TextField, useTheme, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTicket, setUsers } from 'state';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';

const ticketSchema = yup.object().shape({
  title: yup.string().required('required'),
  description: yup.string().required('required'),
  category: yup.string().required('required'),
  project: yup.string().required('required'),
  assignedId: yup.string().required('required'),
  priority: yup.string(),
  status: yup.string(),
});

const EditTicketForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const { id } = useParams();
  const users = useSelector((state) => state.content.users);
  const token = useSelector((state) => state.token);
  const ticket = useSelector((state) => state.editTicket);
  const assigned = useSelector((state) => state.ticket.assigned);
  const projects = useSelector((state) => state.content.projects);
  const apiURL = process.env.REACT_APP_API_BASE_URL;

  const initialValues = {
    title: ticket.title,
    description: ticket.description,
    category: ticket.category,
    project: ticket.project,
    assignedId: assigned._id,
    priority: ticket.priority,
    status: ticket.status,
  };

  useEffect(() => {
    getTicket();
    getUsers();
  }, []);

  const updateTicket = async (values, onSubmitProps) => {
    const response = await fetch(`${apiURL}/tickets/${ticket._id}/update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(values),
    });

    const newTicket = await response.json();
    if (newTicket) {
      onSubmitProps.resetForm();
      navigate(`/tickets/info/${newTicket}`);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    const finalValues = JSON.parse(JSON.stringify(values));
    const assignedUser = users.find((user) => user._id === values.assignedId);

    finalValues.assigned = assignedUser._id;
    finalValues.assignedName = assignedUser.firstName + ' ' + assignedUser.lastName;
    delete finalValues.assignedId;

    await updateTicket(finalValues, onSubmitProps);
  };

  const getTicket = async () => {
    const response = await fetch(`${apiURL}/tickets/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const ticket = await response.json();

    dispatch(setTicket({ ticket: ticket }));
    return ticket;
  };

  const getUsers = async () => {
    const response = await fetch(`${apiURL}/users/all`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const users = await response.json();
    dispatch(setUsers({ users: users }));
  };

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
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Box
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
                  <InputLabel id='priority-label'>Priority</InputLabel>
                  <Select
                    fullWidth
                    sx={{ gridColumn: 'span 1' }}
                    value={values.priority}
                    onChange={handleChange}
                    labelId='priority-label'
                    label='Priority'
                    name='priority'
                  >
                    <MenuItem value='HIGH'>HIGH</MenuItem>
                    <MenuItem value='MEDIUM'>MEDIUM</MenuItem>
                    <MenuItem value='LOW'>LOW</MenuItem>
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
              </Box>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default EditTicketForm;
