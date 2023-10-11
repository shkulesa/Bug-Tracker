import { useEffect } from 'react';
import { Box, Button, TextField, useTheme, Chip, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Header from 'components/Header';
import useFetchUsers from 'api/useFetchUsers';
import useFetchProjectInfo from 'api/useFetchProjectInfo';

const projectSchema = yup.object().shape({
  title: yup.string().required('required'),
  description: yup.string().required('required'),
  priority: yup.string(),
  teamUsers: yup.array().min(1, 'There must be at least one team member'),
  managersUsers: yup.array().min(1, 'There must be at least one manager'),
});

const date = new Date();
const currentDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];

const NewProjectForm = () => {
  const navigate = useNavigate();
  const { palette } = useTheme();
  const users = useSelector((state) => state.user.users);
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const fetchUsers = useFetchUsers();
  const { createProject } = useFetchProjectInfo();

  const initialValues = {
    title: '',
    description: '',
    endDate: currentDate,
    priority: 'LOW',
    teamUsers: [],
    managersUsers: [],
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    const finalValues = JSON.parse(JSON.stringify(values));

    finalValues.team = finalValues.teamUsers.map((teamUser) => {
      return teamUser._id;
    });
    finalValues.managers = finalValues.managersUsers.map((managersUser) => {
      return managersUser._id;
    });

    //check that user is on team & managers.
    if (!finalValues.team.includes(user._id)) finalValues.team.push(user._id);
    if (!finalValues.managers.includes(user._id)) finalValues.managers.push(user._id);
    delete finalValues.teamUsers;
    delete finalValues.managersUsers;

    //creation date
    const date = new Date(finalValues.endDate);
    finalValues.endDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString().split('T')[0];

    const newProjectId = await createProject(finalValues, token);
    onSubmitProps.resetForm();
    navigate(`/projects/info/${newProjectId}`);
  };

  useEffect(() => {
    fetchUsers(token);
  }, []);

  return (
    <Box
      m='1.5rem 2.5rem'
      height='75vh'
    >
      <Box>
        <Header title='CREATE A PROJECT' />
      </Box>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={projectSchema}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => {
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
                  sx={{
                    m: '2rem 0',
                    p: '1rem',
                    backgroundColor: palette.primary.main,
                    color: palette.background.alt,
                    '&:hover': { color: palette.primary.main },
                  }}
                >
                  Create New Project
                </Button>
              </Box>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default NewProjectForm;
