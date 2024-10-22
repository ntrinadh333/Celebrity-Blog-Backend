const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/celebrity_blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
    userId: { type: Number, unique: true },
    name: String,
    email: { type: String, unique: true },
    password: String
});
const User = mongoose.model('User', userSchema);

// Blog Schema
const blogSchema = new mongoose.Schema({
    title: String,
    details: String,
    userId: { type: Number, ref: 'User' } // Reference to User
});
const Blog = mongoose.model('Blog', blogSchema);

// Insert User Function
async function insertUser(name, email, password) {
    try {
        const maxUser = await User.findOne().sort({ userId: -1 }).exec();
        const newUserId = maxUser ? maxUser.userId + 1 : 1;

        const user = new User({ userId: newUserId, name, email, password });
        await user.save();
        console.log('User inserted:', user);
    } catch (error) {
        console.error('Error inserting user:', error);
    }
}

// Insert Blog Function
async function insertBlog(title, details, userId) {
    try {
        const blog = new Blog({ title, details, userId });
        await blog.save();
        console.log('Blog inserted:', blog);
    } catch (error) {
        console.error('Error inserting blog:', error);
    }
}

// Sample data to insert
const name = 'John Doe';
const email = 'john@example.com';
const password = 'password123';
const blogTitle = 'My First Blog';
const blogDetails = 'This is the content of my first blog.';
const blogUserId = 1; // Assuming the userId is 1

insertUser(name, email, password);
insertBlog(blogTitle, blogDetails, blogUserId);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
