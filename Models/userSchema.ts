import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    profileImage?: string;
    profileImageFormat?: string;
}

const userSchema: Schema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    profileImage: { type: String },
    profileImageFormat: { type: String }
});

export default mongoose.model<IUser>('User', userSchema);
