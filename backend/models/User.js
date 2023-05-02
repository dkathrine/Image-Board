import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type: String, unqiue:true, set: a => a === '' ? undefined : a},
    email: {type: String, unqiue:true, set: b => b === '' ? undefined : b},
    password: {type: String, set: c => c === '' ? undefined : c},
    profilePicture: {type: String, default: "https://res.cloudinary.com/dhdugvhj3/image/upload/v1680609327/default_profile_picture/default_profile_picture_qssq71.jpg", set: d => d === 'undefined' ? undefined : d}
})

const User = new mongoose.model('User', userSchema);

export default User;