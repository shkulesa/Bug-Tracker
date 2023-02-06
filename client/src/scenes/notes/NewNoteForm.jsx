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
import { addNote, setProjects, setUsers } from 'state';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';

const noteSchema = yup.object().shape({
  content: yup.string().required('required'),
});

const NewNoteForm = ({ kind, parent }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const users = useSelector((state) => state.content.users);
  const projects = useSelector((state) => state.content.projects);
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const { projectId } = useParams();
  const hasProject = projectId !== undefined && projectId !== 'none';
  // console.log(projectId);

  const initialValues = {
    content: '',
  };

  const createNote = async (values, onSubmitProps) => {
    const response = await fetch('http://localhost:3001/notes/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(values),
    });

    const newNote = await response.json();
    console.log(newNote);
    if (newNote) {
      console.log('!');
      onSubmitProps.resetForm();
      dispatch(addNote({ note: newNote }));
      // navigate(`/projects/info/${projectId}`);
    }
    // console.log(newTicket);
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    console.log(values);
    values.author = user.firstName + ' ' + user.lastName;
    values.kind = kind;
    values.parentId = parent;

    console.log(values);
    await createNote(values, onSubmitProps);
  };

  // const getUsers = async () => {
  //   const response = await fetch('http://localhost:3001/users/all', {
  //     method: 'GET',
  //     headers: { Authorization: `Bearer ${token}` },
  //   });

  //   const users = await response.json();
  //   dispatch(setUsers({ users: users }));
  // };

  // const getProjects = async () => {
  //   const url = 'http://localhost:3001/projects/all';

  //   const response = await fetch(url, {
  //     method: 'GET',
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   const userProjects = await response.json();

  //   console.log(userProjects);

  //   dispatch(setProjects({ projects: userProjects }));
  // };

  // useEffect(() => {
  //   getUsers();
  //   getProjects();
  //   // console.log(users);
  // }, []);

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
      // m='.5rem 0'
      // mb='50rem'
      height='100%'
    >
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={noteSchema}
        // validator={() => ({})}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Box
                display='flex'
                m='.5rem'
                gap='.25rem'
                justifyContent='start'
                alignItems='center'
              >
                {/* <Typography
                variant='h5'
                fontWeight='bold'
                color={palette.neutral.main}
                p='.5rem'
              >
                Write a note:
              </Typography> */}
                {/* <Box> */}
                <TextField
                  fullWidth
                  // label='Title'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.content}
                  name='content'
                  // error={Boolean(touched.title) && Boolean(errors.title)}
                  // helperText={touched.title && errors.title}
                  // sx={{ p: '.5rem' }}
                />
                {/* </Box> */}
                <Box>
                  <Button
                    type='submit'
                    sx={{
                      m: '2rem 0',
                      p: '.75rem',
                      width: '90px',
                      backgroundColor: palette.primary.main,
                      color: palette.background.alt,
                      '&:hover': { color: palette.primary.main },
                    }}
                  >
                    New Note
                  </Button>
                </Box>
              </Box>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default NewNoteForm;
