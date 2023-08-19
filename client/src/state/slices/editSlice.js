import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  projectUser: null,
  project: null,
  team: [],
  ticket: null,
};

const editSlice = createSlice({
  name: 'edit',
  initialState,
  reducers: {
    setEditUser: (state, action) => {
      state.user = action.payload.editUser;
    },
    setEditProjectUser: (state, action) => {
      state.projectUser = action.payload.editProjectUser;
    },
    setEditProject: (state, action) => {
      state.project = action.payload.editProject;
    },
    setEditTeam: (state, action) => {
      state.team = action.payload.editTeam;
    },
    setEditTicket: (state, action) => {
      state.ticket = action.payload.editTicket;
    },
  },
});

export const { setEditUser, setEditProjectUser, setEditProject, setEditTeam, setEditTicket } = editSlice.actions;

export default editSlice.reducer;
