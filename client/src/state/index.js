// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   mode: 'light',
//   user: null,
//   token: null,
//   users: [],
//   ticket: { ticket: null, assigned: null, notes: [] },
//   project: { project: null, team: [], tickets: [], notes: [] },
//   tickets: [],
//   projects: [],
//   managedProjects: [],
//   edit: {
//     user: null,
//     projectUser: null,
//     project: null,
//     ticket: null,
//   },
//   // content: {
//   //   users: [],
//   //   projects: [],
//   //   project: null,
//   //   tickets: [],
//   //   ticket: null,
//   //   notes: [],
//   // },
//   // project: {
//   //   team: [],
//   //   tickets: [],
//   //   notes: [],
//   // },
//   // ticket: {
//   //   assigned: null,
//   //   notes: [],
//   // },

//   // editUser: null,
//   // editProjectUser: null,
//   // editProject: null,
//   // editTicket: null,
// };

// export const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     //set
//     setMode: (state) => {
//       state.mode = state.mode === 'light' ? 'dark' : 'light';
//     },
//     setLogin: (state, action) => {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//     },
//     setLogout: (state) => {
//       state.user = null;
//       state.token = null;
//     },
//     setUsers: (state, action) => {
//       state.users = action.payload.users;
//     },
//     setTicket: (state, action) => {
//       state.ticket.ticket = action.payload.ticket;
//     },
//     setTickets: (state, action) => {
//       state.tickets = action.payload.tickets;
//     },
//     setTicketAssigned: (state, action) => {
//       state.ticket.assigned = action.payload.assigned;
//     },
//     setTicketNotes: (state, action) => {
//       state.ticket.notes = action.payload.notes;
//     },
//     setProject: (state, action) => {
//       state.project.project = action.payload.project;
//     },
//     setProjects: (state, action) => {
//       state.projects = action.payload.projects;
//     },
//     setProjectTeam: (state, action) => {
//       state.project.team = action.payload.team;
//     },
//     setProjectTickets: (state, action) => {
//       state.project.tickets = action.payload.tickets;
//     },
//     setProjectNotes: (state, action) => {
//       state.project.notes = action.payload.notes;
//     },
//     setEditUser: (state, action) => {
//       state.edit.user = action.payload.editUser;
//     },
//     setEditProjectUser: (state, action) => {
//       state.edit.projectUser = action.payload.editProjectUser;
//     },
//     setEditProject: (state, action) => {
//       state.edit.project = action.payload.editProject;
//     },
//     setEditTicket: (state, action) => {
//       state.edit.ticket = action.payload.editTicket;
//     },

//     //remove
//     removeNote: (state, action) => {
//       const newNotes = state.content.notes.filter(({ _id }) => {
//         return _id !== action.payload.note;
//       });
//       state.content.notes = newNotes;
//     },

//     //add
//     addNote: (state, action) => {
//       state.content.notes.push(action.payload.note);
//     },

//     //update
//     updateProjects: (state, action) => {
//       const updatedProjects = state.content.projects.map((project) => {
//         if (project._id !== action.payload.updatedProject) {
//           return project;
//         } else {
//           return action.payload.updatedProject;
//         }
//       });
//       state.content.projects = updatedProjects;
//     },
//   },
// });

// export const {
//   setMode,
//   setLogin,
//   setLogout,
//   setUsers,
//   setTicket,
//   setTickets,
//   setTicketAssigned,
//   setTicketNotes,
//   setProject,
//   setProjects,
//   setProjectTeam,
//   setProjectTickets,
//   setProjectNotes,
//   setEditUser,
//   setEditProjectUser,
//   setEditProject,
//   setEditTicket,
//   removeNote,
//   addNote,
//   updateProject,
// } = authSlice.actions;
// export default authSlice.reducer;

// //////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////

// // import { createSlice } from '@reduxjs/toolkit';

// // const initialState = {
// //   mode: 'light',
// //   user: null,
// //   token: null,
// //   content: {
// //     users: [],
// //     projects: [],
// //     project: null,
// //     tickets: [],
// //     ticket: null,
// //     notes: [],
// //   },
// //   project: {
// //     team: [],
// //     tickets: [],
// //     notes: [],
// //   },
// //   ticket: {
// //     assigned: null,
// //     notes: [],
// //   },
// //   editUser: null,
// //   editProjectUser: null,
// //   editProject: null,
// //   editTicket: null,
// // };

// // export const authSlice = createSlice({
// //   name: 'auth',
// //   initialState,
// //   reducers: {
// //     setMode: (state) => {
// //       state.mode = state.mode === 'light' ? 'dark' : 'light';
// //     },
// //     setLogin: (state, action) => {
// //       state.user = action.payload.user;
// //       state.token = action.payload.token;
// //     },
// //     setLogout: (state) => {
// //       state.user = null;
// //       state.token = null;
// //     },
// //     setUsers: (state, action) => {
// //       state.content.users = action.payload.users;
// //     },
// //     setTicket: (state, action) => {
// //       state.content.ticket = action.payload.ticket;
// //     },
// //     setTickets: (state, action) => {
// //       state.content.tickets = action.payload.tickets;
// //     },
// //     setTicketAssigned: (state, action) => {
// //       state.ticket.assigned = action.payload.assigned;
// //     },
// //     setProject: (state, action) => {
// //       state.content.project = action.payload.project;
// //     },
// //     setProjects: (state, action) => {
// //       state.content.projects = action.payload.projects;
// //     },
// //     setProjectTeam: (state, action) => {
// //       state.project.team = action.payload.team;
// //     },
// //     setProjectTickets: (state, action) => {
// //       state.project.tickets = action.payload.tickets;
// //     },
// //     setNotes: (state, action) => {
// //       state.content.notes = action.payload.notes;
// //     },
// //     removeNote: (state, action) => {
// //       const newNotes = state.content.notes.filter(({ _id }) => {
// //         return _id !== action.payload.note;
// //       });
// //       state.content.notes = newNotes;
// //     },
// //     addNote: (state, action) => {
// //       state.content.notes.push(action.payload.note);
// //     },
// //     setEditUser: (state, action) => {
// //       state.editUser = action.payload.editUser;
// //     },
// //     setEditProjectUser: (state, action) => {
// //       state.editProjectUser = action.payload.editProjectUser;
// //     },
// //     setEditProject: (state, action) => {
// //       state.editProject = action.payload.editProject;
// //     },
// //     setEditTicket: (state, action) => {
// //       state.editTicket = action.payload.editTicket;
// //     },
// //     updateProject: (state, action) => {
// //       const updatedProjects = state.content.projects.map((project) => {
// //         if (project._id !== action.payload.updatedProject) {
// //           return project;
// //         } else {
// //           return action.payload.updatedProject;
// //         }
// //       });
// //       state.content.projects = updatedProjects;
// //     },
// //   },
// // });

// // export const {
// //   setMode,
// //   setLogin,
// //   setLogout,
// //   setUsers,
// //   setTicket,
// //   setTickets,
// //   setTicketAssigned,
// //   setProject,
// //   setProjects,
// //   setProjectTeam,
// //   setProjectTickets,
// //   setNotes,
// //   removeNote,
// //   addNote,
// //   setEditUser,
// //   setEditProjectUser,
// //   setEditProject,
// //   setEditTicket,
// //   updateProject,
// // } = authSlice.actions;
// // export default authSlice.reducer;
