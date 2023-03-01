import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
// import multer from 'multer';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import projectRoutes from './routes/projects.js';
import ticketRoutes from './routes/tickets.js';
import noteRoutes from './routes/notes.js';
import { login, register } from './controllers/auth.js';
import { users, projects, tickets, notes } from './data/fakeData.js';
import User from './models/User.js';
import Project from './models/Project.js';
import Ticket from './models/Ticket.js';
import Note from './models/Note.js';

// Config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
// app.use(cors());
const corsOptions = {
  origin: process.env.FRONTEND_DOMAIN,
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
// app.use(cors(corsOptions));
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }))
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//   })
// );

/* FILE STORAGE */
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/assets');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage });

// AUTH?

app.post('/auth/register', register);
// app.post('/auth/login', login);

//ROUTES

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/tickets', ticketRoutes);
app.use('/notes', noteRoutes);

// MONGOOSE SETUP

const PORT = process.env.PORT || 9000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log('now listening on Port: ' + PORT));

    // User.insertMany(users);
    // Project.insertMany(projects);
    // Ticket.insertMany(tickets);
    // Note.insertMany(notes);
  })
  .catch((err) => {
    console.log('ERROR CONNECTING: ' + err);
  });
