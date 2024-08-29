import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './Routes/userRoutes';

const app: Application = express();

app.use(cors());

app.use(express.json());

app.use('/pocts/v1/users', userRoutes);

export default app;
