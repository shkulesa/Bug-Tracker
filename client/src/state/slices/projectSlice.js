import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  project: null,
  team: [],
  tickets: [],
  notes: [],
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProject: (state, action) => {
      state.project = action.payload.project;
    },
    setProjectTeam: (state, action) => {
      state.team = action.payload.team;
    },
    setProjectTickets: (state, action) => {
      state.tickets = action.payload.tickets;
    },
    setProjectNotes: (state, action) => {
      state.notes = action.payload.notes;
    },

    //remove
    removeProjectNote: (state, action) => {
      const newNotes = state.notes.filter(({ _id }) => {
        return _id !== action.payload.note;
      });
      state.notes = newNotes;
    },

    //add
    addProjectNote: (state, action) => {
      state.notes.push(action.payload.note);
    },
  },
});

export const { setProject, setProjectNotes, setProjectTeam, setProjectTickets, removeProjectNote, addProjectNote } =
  projectSlice.actions;

export default projectSlice.reducer;
