import { useEffect, useState } from 'react';
import { Box, Button, TextField, useMediaQuery, Typography, useTheme } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { setLogin } from 'state/slices/userSlice';
import { API_BASE_URL } from 'config';

const registerSchema = yup.object().shape({
  firstName: yup.string().required('required'),
  lastName: yup.string().required('required'),
  email: yup.string().email('invalid email').required('required'),
  password: yup.string().required('required'),
});

const loginSchema = yup.object().shape({
  email: yup.string().email('invalid email').required('required'),
  password: yup.string().required('required'),
});

const registerInitialValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

const loginInitialValues = {
  email: '',
  password: '',
};

const Form = () => {
  const [pageType, setPageType] = useState('LOGIN');
  const [connectionStatus, setConnectionStatus] = useState('Wating for render.com...');
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery('(min-width:600px)');
  const isLogin = pageType === 'LOGIN';
  const isRegister = pageType === 'REGISTER';

  const demoLogin = () => {
    const demoValues = { email: 'demoViewer@email.com', password: 'viewer' };
    handleFormSubmit(demoValues, { setSubmitting: () => {} });
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  const login = async (values, onSubmitProps) => {
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (loginResponse.ok) {
      const loggedIn = await loginResponse.json();
      // onSubmitProps.resetForm();
      dispatch(setLogin({ user: loggedIn.user, token: loggedIn.token }));
      navigate('/dashboard');
    }
  };

  const register = async (values, onSubmitProps) => {
    const savedUserResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) setPageType('LOGIN');
  };

  const pingBackend = async () => {
    const response = await fetch(API_BASE_URL, { mode: 'no-cors' });
    console.log('Pinged backend. Waiting on response...');
    if (response.status === 0) {
      setConnectionStatus('Connected');
    }
  };

  useEffect(() => {
    pingBackend();
  });

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? loginInitialValues : registerInitialValues}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Box
              display='grid'
              gap='30px'
              gridTemplateColumns='(4, minmax(0, 1fr))'
              sx={{ '& div': { gridColumn: isNonMobile ? undefined : 'span 4' } }}
            >
              {isRegister && (
                <>
                  <TextField
                    label='First Name'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name='firstName'
                    error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                    sx={{ gridColumn: 'span 2' }}
                  />
                  <TextField
                    label='Last Name'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    name='lastName'
                    error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                    sx={{ gridColumn: 'span 2' }}
                  />
                </>
              )}
              <TextField
                label='Email'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name='email'
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: 'span 4' }}
              />
              <TextField
                label='Password'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name='password'
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: 'span 4' }}
              />
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
                {isLogin ? 'LOGIN' : 'REGISTER'}
              </Button>
              <Typography
                fontWeight='bold'
                onClick={() => {
                  setPageType(isLogin ? 'REGISTER' : 'LOGIN');
                  resetForm();
                }}
                sx={{
                  color: palette.primary.main,
                  '&:hover': { cursor: 'pointer', color: palette.primary.light },
                }}
              >
                {isLogin ? "Don't have an account? Register here" : 'Already have an account? Login here'}
              </Typography>
              {isLogin && (
                <Typography
                  mt='.5rem'
                  onClick={demoLogin}
                  sx={{
                    textDecoration: 'underline',
                    color: palette.primary.main,
                    '&:hover': { cursor: 'pointer', color: palette.primary.light },
                  }}
                >
                  Click here to view the app on a demo account
                </Typography>
              )}
              <Box>
                <Typography
                  mt='.5rem'
                  mb='-1rem'
                  sx={{ color: palette.neutral.medium, fontSize: '12px' }}
                >
                  Note: Render.com takes a minute to load when first accessing the site
                </Typography>
                <Box
                  mt='1.5rem'
                  display='flex'
                >
                  {connectionStatus === 'Wating for render.com...' ? (
                    <CancelOutlinedIcon sx={{ color: 'red' }} />
                  ) : (
                    <CheckCircleOutlinedIcon sx={{ color: 'green' }} />
                  )}
                  <Typography ml='.5rem'>{connectionStatus}</Typography>
                </Box>
              </Box>
            </Box>
          </form>
        );
      }}
    </Formik>
  );
};

export default Form;
