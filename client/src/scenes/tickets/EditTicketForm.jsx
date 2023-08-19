import { useEffect } from 'react';
import { Box, Button, TextField, useTheme, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import useFetchTicketInfo from 'api/useFetchTicketInfo';
import useFetchUsers from 'api/useFetchUsers';

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
  const { palette } = useTheme();
  const { id } = useParams();
  const users = useSelector((state) => state.user.users);
  const token = useSelector((state) => state.user.token);
  const editTicket = useSelector((state) => state.edit.ticket);
  const assigned = useSelector((state) => state.ticket.assigned);
  const projects = useSelector((state) => state.user.projects);
  const { fetchTicket, updateTicket } = useFetchTicketInfo();
  const fetchUsers = useFetchUsers();

  const initialValues = {
    title: editTicket.title,
    description: editTicket.description,
    category: editTicket.category,
    project: editTicket.project,
    assignedId: assigned._id,
    priority: editTicket.priority,
    status: editTicket.status,
  };

  useEffect(() => {
    fetchTicket(id, token);
    fetchUsers(token);
  }, []);

  const handleFormSubmit = async (values, onSubmitProps) => {
    const finalValues = JSON.parse(JSON.stringify(values));
    const assignedUser = users.find((user) => user._id === values.assignedId);

    finalValues.assigned = assignedUser._id;
    finalValues.assignedName = assignedUser.firstName + ' ' + assignedUser.lastName;
    delete finalValues.assignedId;

    const updatedTicket = await updateTicket(finalValues, id, token);
    if (updatedTicket) {
      onSubmitProps.resetForm();
      navigate(`/tickets/info/${updatedTicket}`);
    }
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
            subtitle={editTicket.title}
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
              navigate(`/tickets/info/${editTicket._id}`);
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
