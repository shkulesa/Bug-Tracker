import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: 'light',
  user: null,
  token: null,
  users: [],
  tickets: [],
  projects: [],
  managedProjects: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    //set
    setMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setUsers: (state, action) => {
      state.users = action.payload.users;
    },
    setTickets: (state, action) => {
      state.tickets = action.payload.tickets;
    },
    setProjects: (state, action) => {
      state.projects = action.payload.projects;
    },
    setManagedProjects: (state, action) => {
      state.managedProjects = action.payload.managedProjects;
    },

    //update
    updateProjects: (state, action) => {
      const updatedProjects = state.projects.map((project) => {
        if (project._id !== action.payload.updatedProject) {
          return project;
        } else {
          return action.payload.updatedProject;
        }
      });
      state.projects = updatedProjects;
    },
  },
});

export const { setMode, setLogin, setLogout, setUsers, setTickets, setProjects, setManagedProjects, updateProjects } =
  userSlice.actions;

export default userSlice.reducer;
