import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import projectRoutes from './routes/projects.js';
import ticketRoutes from './routes/tickets.js';
import noteRoutes from './routes/notes.js';
import { register } from './controllers/auth.js';

// Config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const corsOptions = {
  origin: process.env.FRONTEND_DOMAIN,
  credentials: true,
};
app.use(cors(corsOptions));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// AUTH

app.post('/auth/register', register);

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
  })
  .catch((err) => {
    console.log('ERROR CONNECTING: ' + err);
  });
