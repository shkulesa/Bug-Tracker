import { Box, Button, TextField, useTheme } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addNote } from 'state';

const noteSchema = yup.object().shape({
  content: yup.string().required('required'),
});

const NewNoteForm = ({ kind, parent }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);

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
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    console.log(values);
    values.author = user.firstName + ' ' + user.lastName;
    values.kind = kind;
    values.parentId = parent;

    console.log(values);
    await createNote(values, onSubmitProps);
  };

  return (
    <Box height='100%'>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={noteSchema}
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
                <TextField
                  fullWidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.content}
                  name='content'
                />
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
