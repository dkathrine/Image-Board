import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    commentById: String,
    commentByName: {type: String, set: a => a === '' ? undefined : a},
    commentByPicture: {type: String, set: b => b === 'undefined' ? undefined : b},
    comment: String,
    timestamp: {type: Date, default: function() {
        const offset = new Date().getTimezoneOffset();
        const date = new Date(Date.now() - offset * 60 * 1000);
        return date;
    }},
})

const postSchema = new mongoose.Schema({
    createdById: String,
    createdByName: {type: String, set: a => a === '' ? undefined : a},
    createdByPicture: {type: String, set: b => b === 'undefined' ? undefined : b},
    title: {type: String, default: "", set: c => c === '' ? undefined : c},
    desc: {type: String, default: "", set: d => d === '' ? undefined : d},
    postFile: String,
    timestamp: {type: Date, default: function() {
        const offset = new Date().getTimezoneOffset();
        const date = new Date(Date.now() - offset * 60 * 1000);
        return date;
    }},
    comments: {
        type: [commentSchema],
        default: [],
    },
})

const Post = new mongoose.model('Post', postSchema);

export default Post;