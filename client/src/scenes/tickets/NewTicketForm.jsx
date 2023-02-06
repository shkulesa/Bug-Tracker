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
import { setProjects, setUsers } from 'state';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';

const ticketSchema = yup.object().shape({
  title: yup.string().required('required'),
  description: yup.string().required('required'),
  category: yup.string().oneOf(['Bugs/Issues', 'Development', 'Other']).required('required'),
  submitter: yup.string().required('required'),
  projectId: yup.string().required('required'),
  // endDate: yup.date(),
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
  const users = useSelector((state) => state.content.users);
  const projects = useSelector((state) => state.content.projects);
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const { projectId } = useParams();
  const hasProject = projectId !== undefined && projectId !== 'none';
  console.log(projectId);
  console.log(hasProject);
  console.log(users);

  // const { projectId } = useParams();
  // const needsProject = Boolean(projectId);

  const initialValues = {
    title: '',
    description: '',
    category: '',
    submitter: user.firstName + ' ' + user.lastName,
    projectId: hasProject ? projectId : 'Select a Project',
    assignedUser: '',
  };

  const createTicket = async (values, onSubmitProps) => {
    const response = await fetch('http://localhost:3001/tickets/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(values),
    });

    const newTicket = await response.json();
    console.log(newTicket);
    if (newTicket) {
      console.log('!');
      onSubmitProps.resetForm();
      // dispatch(setProject(projects));
      navigate(hasProject ? `/projects/info/${projectId}` : `/tickets/info/${newTicket}`);
    }
    // console.log(newTicket);
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    console.log(values);

    const finalValues = JSON.parse(JSON.stringify(values));

    finalValues.assigned = finalValues.assignedUser._id;
    finalValues.assignedName = finalValues.assignedUser.firstName + ' ' + finalValues.assignedUser.lastName;

    delete finalValues.assignedUser;

    console.log(finalValues);
    await createTicket(finalValues, onSubmitProps);
  };

  const getUsers = async () => {
    const response = await fetch('http://localhost:3001/users/all', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const users = await response.json();
    dispatch(setUsers({ users: users }));
  };

  const getProjects = async () => {
    const url = 'http://localhost:3001/projects/all';

    const response = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const userProjects = await response.json();

    console.log(userProjects);

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
              // fullWidth
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
                  <InputLabel id='assigned-label'>Assign A Developer</InputLabel>
                  <Select
                    fullWidth
                    sx={{ gridColumn: 'span 1' }}
                    value={values.assignedUser}
                    onChange={handleChange}
                    labelId='assigned-label'
                    label='Assign A Developer'
                    name='assignedUser'
                    // renderValue={(selected) => (
                    //   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    //     {selected.map((value) => (
                    //       <Chip
                    //         key={value._id}
                    //         label={value.firstName + ' ' + value.lastName}
                    //       />
                    //     ))}
                    //   </Box>
                    // )}
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
                      {projects.map(({ _id, title }) => {
                        return (
                          <MenuItem
                            key={_id}
                            value={_id}
                          >
                            {title}
                          </MenuItem>
                        );
                      })}
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
                {/* {console.log(values)} */}
              </Box>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default NewTicketForm;
