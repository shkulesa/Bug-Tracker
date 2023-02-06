import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { themeSettings } from 'theme';
import Layout from 'scenes/layout';
import Dashboard from 'scenes/dashboard';
import LoginPage from 'scenes/loginPage';
import RoleManagement from 'scenes/roleManagement';
import Projects from 'scenes/projects';
import NewProjectForm from 'scenes/projects/NewProjectForm';
import ProjectInfo from 'scenes/projects/ProjectInfo';
import NewTicketForm from 'scenes/tickets/NewTicketForm';
import EditProjectForm from 'scenes/projects/EditProjectForm';
import ProjectUsers from 'scenes/projectUsers';
import Tickets from 'scenes/tickets';
import TicketInfo from 'scenes/tickets/TicketInfo';
import EditTicketForm from 'scenes/tickets/EditTicketForm';

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  return (
    <div className='app'>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route
              path='/'
              element={
                isAuth ? (
                  <Navigate
                    to='/dashboard'
                    replace
                  />
                ) : (
                  <Navigate to='/login' />
                )
              }
            />
            <Route
              path='/login'
              element={<LoginPage />}
            />
            <Route element={<Layout />}>
              <Route
                path='/dashboard'
                element={isAuth ? <Dashboard /> : <Navigate to='/login' />}
              />
              <Route
                path='/projects'
                element={isAuth ? <Projects /> : <Navigate to='/login' />}
              />
              <Route
                path='/projects/new'
                element={isAuth ? <NewProjectForm /> : <Navigate to='/login' />}
              />
              <Route
                path='/projects/info/:id'
                element={isAuth ? <ProjectInfo /> : <Navigate to='/login' />}
              />
              <Route
                path='/projects/edit/:id'
                element={isAuth ? <EditProjectForm /> : <Navigate to='/login' />}
              />
              <Route
                path='projects/:projectId/tickets/new'
                element={isAuth ? <NewTicketForm /> : <Navigate to='/login' />}
              />
              <Route
                path='/tickets'
                element={isAuth ? <Tickets /> : <Navigate to='/login' />}
              />
              <Route
                path='/tickets/new'
                element={isAuth ? <NewTicketForm /> : <Navigate to='/login' />}
              />
              <Route
                path='/tickets/info/:id'
                element={isAuth ? <TicketInfo /> : <Navigate to='/login' />}
              />
              <Route
                path='/tickets/edit/:id'
                element={isAuth ? <EditTicketForm /> : <Navigate to='/login' />}
              />
              <Route
                path='/manage-roles'
                element={
                  isAuth ? (
                    user.role === 'ADMIN' ? (
                      <RoleManagement />
                    ) : (
                      <Navigate to='/profile' />
                    )
                  ) : (
                    <Navigate to='/login' />
                  )
                }
              />
              <Route
                path='/manage-users/:id'
                element={
                  isAuth ? (
                    user.role === 'ADMIN' ? (
                      <ProjectUsers />
                    ) : (
                      <Navigate to='/profile' />
                    )
                  ) : (
                    <Navigate to='/login' />
                  )
                }
              />
            </Route>
          </Routes>
        </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;
