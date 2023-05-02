//imports
import express from 'express';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Post from '../models/Post.js';

//setting up express router + dotenv
const router = express.Router();
dotenv.config();

//environmental variables
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
      resource_type: "auto",
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
          case "video/mp4":
            format = "mp4";
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
router.post('/create', upload.single("postFile"), async (req, res) => {
    const {title, desc, postFile, createdById, createdByName, createdByPicture} = req.body;

    const newPost = new Post({
        title,
        desc,
        postFile,
        createdById,
        createdByName,
        createdByPicture,
    })

    try {
        await newPost.save();

        let result;

        if(req.file.mimetype.startsWith("image/")){
            result = await cloudinary.uploader.upload(req.file.path, {
                recourse_type: "image",
                public_id: `post_media_${newPost._id}`,
                folder: `posts/${newPost.createdById}/${newPost._id}`,
            })

        } else if(req.file.mimetype.startsWith("video/")){
             result = await cloudinary.uploader.upload(req.file.path, {
                recourse_type: "video",
                public_id: `post_media_${newPost._id}`,
                folder: `posts/${newPost.createdById}/${newPost._id}`,
            })
            
        }

        newPost.postFile = result.secure_url;
        await newPost.save();

        res.status(201).send(`new post created`);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "Server error"});
    }
}).get('/all', async(req, res) => {
    try {
        const result = await Post.find()
        res.send(result);
    } catch (error) {
        res.send(error);
    }
}).get('/byTitle', async(req,res) =>{
    const titleName = req.query.q;
    try {
        const result = await Post.find({title: titleName});
        res.send(result);
    } catch (error) {
        res.send(error);
    }
}).get('/:id', async(req,res) =>{
    const id = req.params.id;
    try {
        const result = await Post.findById(id);
        res.send(result);
    } catch (error) {
        res.send(error);
    }
}).patch('/update/:id', async(req,res) =>{
    const id = req.params.id;
    const filter = {_id: id};

    const updates = req.body;

    try {
        const result = await Post.findOneAndUpdate(filter, req.body, {new: true})
        res.send(result);
    } catch (error) {
        res.send(error);
    }
}).patch('/createComment/:id', async(req, res) => {
    const id = req.params.id;
    const filter = {_id: id};

    const updates = req.body;

    try {
        const result = await Post.findOneAndUpdate(filter, { $push: {comments: updates}})
        res.send(result);
    } catch (error) {
        res.send(error);
    }
}).patch('/deleteComment/:id', async(req, res) => {
    const id = req.params.id;
    const filter = {_id: id};

    const commentId = req.body.commentId;

    const commentDeletion = {
        $pull: {
            comments: { _id: commentId }
        }
    }; 

    try {
        const result = await Post.findOneAndUpdate(filter, commentDeletion);
        res.send(result);
    } catch (error) {
        res.send(error);
    }
}).delete('/delete/:id', async(req, res) => {
    const id = req.params.id;
    try {
        const result = await Post.findByIdAndDelete(id);
        res.send(result);
    } catch (error) {
        res.send(error);
    }
})

//export
export default router;