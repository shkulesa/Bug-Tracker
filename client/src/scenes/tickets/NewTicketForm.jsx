import { useEffect } from 'react';
import { Box, Button, TextField, useTheme, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setProjects, setUsers } from 'state';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';

const ticketSchema = yup.object().shape({
  title: yup.string().required('required'),
  description: yup.string().required('required'),
  category: yup.string().oneOf(['Bugs/Issues', 'Development', 'Other']).required('required'),
  priority: yup.string(),
  submitter: yup.string().required('required'),
  projectId: yup.string().required('required'),
  assignedUser: yup.object().shape({
    _id: yup.string(),
    firstName: yup.string(),
    lastName: yup.string(),
    email: yup.string(),
    tickets: yup.array(),
    projects: yup.array(),
    role: yup.string(),
  }),
});

const NewTicketForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const users = useSelector((state) => state.user.users);
  const projects = useSelector((state) => state.user.projects);
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const { projectId } = useParams();
  const hasProject = projectId !== undefined && projectId !== 'none';
  const apiURL = process.env.REACT_APP_API_BASE_URL;

  const initialValues = {
    title: '',
    description: '',
    category: '',
    priority: 'LOW',
    submitter: user._id,
    submitterName: user.firstName + ' ' + user.lastName,
    projectId: hasProject ? projectId : '',
    assignedUser: '',
  };

  const createTicket = async (values, onSubmitProps) => {
    const response = await fetch(`${apiURL}/tickets/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(values),
    });

    const newTicket = await response.json();
    if (newTicket) {
      onSubmitProps.resetForm();
      navigate(hasProject ? `/projects/info/${projectId}` : `/tickets/info/${newTicket}`);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    const finalValues = JSON.parse(JSON.stringify(values));
    console.log(finalValues);

    finalValues.assigned = finalValues.assignedUser._id;
    finalValues.assignedName = finalValues.assignedUser.firstName + ' ' + finalValues.assignedUser.lastName;

    delete finalValues.assignedUser;

    await createTicket(finalValues, onSubmitProps);
  };

  const getUsers = async () => {
    const response = await fetch(`${apiURL}/users/all`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const users = await response.json();
    dispatch(setUsers({ users: users }));
  };

  const getProjects = async () => {
    const url = `${apiURL}/projects/all`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const userProjects = await response.json();

    dispatch(setProjects({ projects: userProjects }));
  };

  useEffect(() => {
    getUsers();
    getProjects();
  }, []);

  return (
    <Box
      m='1.5rem 2.5rem'
      height='75vh'
    >
      <FlexBetween>
        <Box>
          <Header title='SUBMIT A TICKET' />
        </Box>
        {hasProject && (
          <Box>
            <Button
              onClick={() => {
                navigate(`/projects/info/${projectId}`);
              }}
              sx={{
                m: '2rem 0',
                p: '1rem',
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                '&:hover': { color: palette.primary.main },
              }}
            >
              Back To Project
            </Button>
          </Box>
        )}
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
                  <InputLabel id='assigned-label'>Assign A Developer</InputLabel>
                  <Select
                    fullWidth
                    sx={{ gridColumn: 'span 1' }}
                    value={values.assignedUser}
                    onChange={handleChange}
                    labelId='assigned-label'
                    label='Assign A Developer'
                    name='assignedUser'
                  >
                    {users.map((user) => (
                      <MenuItem
                        key={user._id}
                        value={user}
                      >
                        {user.firstName + ' ' + user.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {!hasProject && (
                  <FormControl>
                    <InputLabel id='project-label'>Project</InputLabel>
                    <Select
                      fullWidth
                      sx={{ gridColumn: 'span 1' }}
                      value={values.projectId}
                      onChange={handleChange}
                      labelId='project-label'
                      label='Project'
                      name='projectId'
                    >
                      {user.role === 'SUBMITTER' ? (
                        <MenuItem value='63e278c8e586c654c380091c'>Ticket Submission</MenuItem>
                      ) : (
                        projects.map(({ _id, title }) => {
                          return (
                            <MenuItem
                              key={_id}
                              value={_id}
                            >
                              {title}
                            </MenuItem>
                          );
                        })
                      )}
                    </Select>
                  </FormControl>
                )}
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
                  Create New Ticket
                </Button>
              </Box>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default NewTicketForm;
