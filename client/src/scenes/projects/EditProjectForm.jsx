import { useEffect } from 'react';
import { Box, Button, TextField, useTheme, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import useFetchProjectInfo from 'api/useFetchProjectInfo';

const projectSchema = yup.object().shape({
  title: yup.string().required('required'),
  description: yup.string().required('required'),
  priority: yup.string(),
});

const EditProjectForm = () => {
  const navigate = useNavigate();
  const { palette } = useTheme();
  const { id } = useParams();
  const token = useSelector((state) => state.user.token);
  const editProject = useSelector((state) => state.edit.project);
  const { fetchProjectForEdit, updateProject } = useFetchProjectInfo();

  const initialValues = {
    title: editProject.title,
    description: editProject.description,
    priority: editProject.priority,
  };

  useEffect(() => {
    fetchProjectForEdit(id, token).then(() => {
      initialValues.startDate = correctDate(editProject.startDate);
      initialValues.endDate = correctDate(editProject.endDate);
    });
  }, []);

  const correctDate = (date) => {
    const hold = new Date(date);
    return new Date(hold.getTime() + hold.getTimezoneOffset() * 60000).toISOString();
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    const finalValues = JSON.parse(JSON.stringify(values));

    const end = new Date(finalValues.endDate);
    const start = new Date(finalValues.startDate);
    finalValues.endDate = new Date(end.getTime() - end.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    finalValues.startDate = new Date(start.getTime() - start.getTimezoneOffset() * 60000).toISOString().split('T')[0];

    await updateProject(finalValues, id, token);
    onSubmitProps.resetForm();
    navigate(`/projects/info/${id}`);
  };

  return (
    <Box
      m='1.5rem 2.5rem'
      height='75vh'
    >
      <FlexBetween>
        <Box>
          <Header
            title='Edit Project'
            subtitle={editProject.title}
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
              navigate(`/projects/info/${editProject._id}`);
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
              </Box>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default EditProjectForm;
