import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ticket: null,
  assigned: null,
  notes: [],
};

const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    setTicket: (state, action) => {
      state.ticket = action.payload.ticket;
    },
    setTicketAssigned: (state, action) => {
      state.assigned = action.payload.assigned;
    },
    setTicketNotes: (state, action) => {
      state.notes = action.payload.notes;
    },

    //remove
    removeTicketNote: (state, action) => {
      const newNotes = state.notes.filter(({ _id }) => {
        return _id !== action.payload.note;
      });
      state.notes = newNotes;
    },

    //add
    addTicketNote: (state, action) => {
      state.notes.push(action.payload.note);
    },
  },
});

export const { setTicket, setTicketAssigned, setTicketNotes, removeTicketNote, addTicketNote } = ticketSlice.actions;

export default ticketSlice.reducer;
