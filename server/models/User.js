import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String },
    mobile: { type: String },
    address: { type: String },
    image: { type: String },
});

const User = mongoose.model('User', userSchema);

export default User;
