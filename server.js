// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const PORT = 5000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true, useUnifiedTopology: true });

// Blog post schema
const blogPostSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    createdAt: { type: Date, default: Date.now },
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// Routes

// Create a blog post
app.post('/posts', async (req, res) => {
    const { title, content, author } = req.body;
    const newPost = new BlogPost({ title, content, author });
    await newPost.save();
    res.status(201).json(newPost);
});

// Read all blog posts
app.get('/posts', async (req, res) => {
    const posts = await BlogPost.find();
    res.status(200).json(posts);
});

// Read a single blog post
app.get('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const post = await BlogPost.findById(id);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
});

// Update a blog post
app.put('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, author } = req.body;
    const updatedPost = await BlogPost.findByIdAndUpdate(id, { title, content, author }, { new: true });
    if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(updatedPost);
});

// Delete a blog post
app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const deletedPost = await BlogPost.findByIdAndDelete(id);
    if (!deletedPost) {
        return res.status(404).json({ message: 'Post not found' });
    }
    res.status(204).send();
});

// Start the server
app.listen(PORT , ()=>{
    console.log(`Server running at port ${PORT}`);
    
})