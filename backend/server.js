import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.js';
import postRoutes from './routes/post.js';

dotenv.config();

const port = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);
app.use("/post", postRoutes);

const main = async() => {
    mongoose.set("strictQuery", false);
    await mongoose.connect(`${process.env.MONGODB_CONNECTION}/ImageBoard`);
}
main().catch((err) => console.log(`Connection Failed!: ${err}`));

app.listen(port, () => console.log(`Server listening on ${port}`));