//imports
import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import User from '../models/User.js';
import Post from '../models/Post.js';

//setting up express router + dotenv
const router = express.Router();
dotenv.config();

//environmental variables
const saltRounds = Number(process.env.SALT_ROUNDS);
const jwtSecret = process.env.JWT_SECRET;
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

//setting up Cloudinary configuration
cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
})

//setting up Multer and Cloudinary storage engine
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "delete",
      format: async (req, file) => {
        let format;
        switch (file.mimetype) {
          case "image/jpeg":
            format = "jpg";
            break;
          case "image/png":
            format = "png";
            break;
          case "image/gif":
            format = "gif";
            break;
            
          default:
            format = "jpg";
            break;
        }
        return format;
      },
    },
  });

//setting up Multer middleware for handling file uploads
const upload = multer({ storage: storage });


//Routes
router.post('/register', upload.single("profilePicture"), async (req, res) => {
    const {username, email, password, profilePicture} = req.body;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);


    const newUser = new User({
        username,
        email,
        password: hash,
        profilePicture
    })

    try {
        await newUser.save();

        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path, {
                public_id: `profile_picture_${newUser._id}`,
                folder: `avatar/${newUser._id}`,
            })

            newUser.profilePicture = result.secure_url;
        }

        await newUser.save();

        res.status(201).json(newUser);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "Server error"});
    }
}).post('/login', async (req, res) => {
    const {email, password} = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const passAuth = bcrypt.compareSync(password, user.password);
    if(passAuth){
        jwt.sign({ 
            email, 
            id: user._id, 
            username: user.username, 
            profilePicture: user.profilePicture 
        }, jwtSecret, {expiresIn: "1h"}, (err, token) => {
            /* console.log(err); */
            if (err) throw err;
            res.cookie("token", token).json({
              id: user._id,
              email,
              token,
              username: user.username,
              profilePicture: user.profilePicture,
              maxAge: 60 * 60 * 1000 // 60 minutes
            });
          });
    }else {
        res.status(400).json("wrong credentials");
    }
}).post('/logout', (req, res) => {
    res.cookie("token", "").json("ok");
}).get('/all', async(req, res) => {
    try {
        const result = await User.find()
        res.send(result);
    } catch (error) {
        res.send(error);
    }
}).get('/byName', async(req,res) =>{
    const name = req.query.q;
    try {
        const result = await User.find({username: name});
        res.send(result);
    } catch (error) {
        res.send(error);
    }
}).get('/:id', async(req,res) =>{
    const id = req.params.id;
    try {
        const result = await User.findById(id);
        res.send(result);
    } catch (error) {
        res.send(error);
    }
}).patch('/update/:id', upload.single("profilePicture") ,async(req,res) =>{
    const id = req.params.id;
    const filter = {_id: id};

    const postFilter = {createdById: id};

    // Define the array filter to match the user's comments in all posts
    const arrayFilter = {
    'elem.commentById': id
    };

    const updates = req.body;

    try {

        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path, {
                public_id: `profile_picture_${id}`,
                folder: `avatar/${id}`,
            })

            updates.profilePicture = result.secure_url;
        }

        const postUpdates = {
            createdByName: updates.username,
            createdByPicture: updates.profilePicture
        }

        const commentUpdates = {
            $set: {
              'comments.$[elem].commentByName': updates.username,
              'comments.$[elem].commentByPicture': updates.profilePicture
            }
          };

        const result = await User.findOneAndUpdate(filter, updates, {new: true})
        await Post.updateMany(postFilter, postUpdates, {new: true})
        await Post.updateMany({}, commentUpdates, { arrayFilters: [arrayFilter] });

        res.send(result);
    } catch (error) {
        res.send(error);
    }
});

//export
export default router;