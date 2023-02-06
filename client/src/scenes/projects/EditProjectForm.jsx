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
import { setEditProject, setProject, setProjects, setUsers } from 'state';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';

const projectSchema = yup.object().shape({
  title: yup.string().required('required'),
  description: yup.string().required('required'),
  priority: yup.string(),
  // endDate: yup.date(),
  // teamUsers: yup.array().min(1, 'There must be at least one team member'),
  // managersUsers: yup.array().min(1, 'There must be at least one manager'),
});

// const date = new Date();
// const currentDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];

const EditProjectForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const { id } = useParams();
  const users = useSelector((state) => state.content.users);
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const project = useSelector((state) => state.editProject);

  const initialValues = {
    title: project.title,
    description: project.description,
    priority: project.priority,
    // startDate: project.startDate,
    // endDate: project.endDate,
    // teamUsers,
    // managersUsers,
  };

  useEffect(() => {
    getProject().then(() => {
      console.log(project);
      console.log(project.endDate);
      console.log(project.startDate);
      // console.log(project['startDate']);
      initialValues.startDate = correctDate(project.startDate);
      initialValues.endDate = correctDate(project.endDate);
    });

    // console.log(users);
  }, []);

  // const managersUsers = users.map(({ _id }) => project.managers.includes(_id));
  // const teamUsers = users.map(({ _id }) => project.team.includes(_id));
  console.log(project);

  console.log(project);

  const correctDate = (date) => {
    // console.log(date);
    const hold = new Date(date);
    // console.log(hold);
    return new Date(hold.getTime() + hold.getTimezoneOffset() * 60000).toISOString();
  };

  // initialValues.startDate = correctDate(project.startDate);
  // initialValues.endDate = correctDate(project.endDate);

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
    const response = await fetch(`http://localhost:3001/projects/${project._id}/update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(values),
    });

    console.log(response);

    const newProject = await response.json();
    if (newProject) {
      console.log('!');
      onSubmitProps.resetForm();
      // dispatch(setProjects(projects));
      navigate(`/projects/info/${newProject}`);
    }
    console.log(newProject);
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    console.log(values);

    const finalValues = JSON.parse(JSON.stringify(values));

    // finalValues.team = finalValues.teamUsers.map((teamUser) => {
    //   return teamUser._id;
    // });
    // finalValues.managers = finalValues.managersUsers.map((managersUser) => {
    //   return managersUser._id;
    // });

    // console.log(finalValues);

    // //check that user is on team & managers.
    // if (!finalValues.team.includes(user._id)) finalValues.team.push(user._id);
    // if (!finalValues.managers.includes(user._id)) finalValues.managers.push(user._id);
    // delete finalValues.teamUsers;
    // delete finalValues.managersUsers;

    const end = new Date(finalValues.endDate);
    const start = new Date(finalValues.startDate);
    finalValues.endDate = new Date(end.getTime() - end.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    finalValues.startDate = new Date(start.getTime() - start.getTimezoneOffset() * 60000).toISOString().split('T')[0];

    console.log(finalValues);
    await updateProject(finalValues, onSubmitProps);
  };

  const getProject = async () => {
    const response = await fetch(`http://localhost:3001/projects/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const project = await response.json();
    console.log(project);

    // const adjustedStartDate = new Date(project.startDate);
    // project.startDate = new Date(
    //   adjustedStartDate.getTime() + adjustedStartDate.getTimezoneOffset() * 60000
    // ).toISOString();
    // const adjustedEndDate = new Date(project.endDate);
    // project.endDate = new Date(adjustedEndDate.getTime() + adjustedEndDate.getTimezoneOffset() * 60000).toISOString();
    // // project.startDate = adjustedDate;
    // console.log(project);

    dispatch(setEditProject({ editProject: project }));
    return project;
  };

  const getUsers = async () => {
    const response = await fetch('http://localhost:3001/users/all', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const users = await response.json();
    dispatch(setUsers({ users: users }));
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
            title='Edit Project'
            subtitle={project.title}
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
              navigate(`/projects/info/${project._id}`);
            }}
          >
            Project Details
          </Button>
        </Box>
      </FlexBetween>

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={projectSchema}
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
                {/* <FormControl>
                <InputLabel id='team-label'>Team</InputLabel>
                <Select
                  fullWidth
                  multiple
                  sx={{ gridColumn: 'span 1' }}
                  value={values.teamUsers}
                  onChange={handleChange}
                  labelId='team-label'
                  label='Team'
                  name='teamUsers'
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value._id}
                          label={value.firstName + ' ' + value.lastName}
                        />
                      ))}
                    </Box>
                  )}
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
              <FormControl>
                <InputLabel id='managers-label'>Managers</InputLabel>
                <Select
                  fullWidth
                  multiple
                  sx={{ gridColumn: 'span 1' }}
                  value={values.managersUsers}
                  onChange={handleChange}
                  labelId='managers-label'
                  label='Managers'
                  name='managersUsers'
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value._id}
                          label={value.firstName + ' ' + value.lastName}
                        />
                      ))}
                    </Box>
                  )}
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
              </FormControl> */}
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ gridColumn: 'span 1' }}
                    label='Start Date'
                    id='startDate'
                    name='startDate'
                    value={values.startDate}
                    onChange={(value) => {
                      setFieldValue('startDate', Date.parse(value));
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ gridColumn: 'span 1' }}
                    label='End Date'
                    id='endDate'
                    name='endDate'
                    value={values.endDate}
                    onChange={(value) => {
                      setFieldValue('endDate', Date.parse(value));
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Box>
              <Box>
                <Button
                  fullWidth
                  type='submit'
                  // onClick={() => {
                  //   console.log(values);
                  //   handleSubmit()
                  //   // handleFormSubmit(values, onSubmitProps);
                  // }}
                  sx={{
                    m: '2rem 0',
                    p: '1rem',
                    backgroundColor: palette.primary.main,
                    color: palette.background.alt,
                    '&:hover': { color: palette.primary.main },
                  }}
                >
                  Update Project
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

export default EditProjectForm;
