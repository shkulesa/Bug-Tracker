import { useState } from 'react';
import { Box, Button, TextField, useMediaQuery, Typography, useTheme } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from 'state';

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
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery('(min-width:600px)');
  const isLogin = pageType === 'LOGIN';
  const isRegister = pageType === 'REGISTER';

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  const login = async (values, onSubmitProps) => {
    const loginResponse = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    console.log(loginResponse);

    if (loginResponse.ok) {
      const loggedIn = await loginResponse.json();
      console.log(loggedIn);
      onSubmitProps.resetForm();
      dispatch(setLogin({ user: loggedIn.user, token: loggedIn.token }));
      navigate('/dashboard');
    }
  };

  const register = async (values, onSubmitProps) => {
    const savedUserResponse = await fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) setPageType('LOGIN');
  };

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
                // variant=''
                onClick={() => {
                  setPageType(isLogin ? 'REGISTER' : 'LOGIN');
                  resetForm();
                }}
                sx={{
                  textDecoration: 'underline',
                  color: palette.primary.main,
                  '&:hover': { cursor: 'pointer', color: palette.primary.light },
                }}
              >
                {isLogin ? "Don't have an account? Register here" : 'Already have an account? Login here'}
              </Typography>
            </Box>
          </form>
        );
      }}
    </Formik>
  );
};

export default Form;
