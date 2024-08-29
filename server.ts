import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

dotenv.config({ path: './config.env' });

const DB = process.env.CONN_STR as string;

mongoose.connect(DB)
    .then(() => {
        console.log('DB CONNECTION SUCCESSFUL');
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error);
    });
