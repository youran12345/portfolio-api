/**
 * Seed script — creates a demo admin user and some sample projects / blog posts.
 * Usage:  npm run seed   (requires a working MONGO_URI in .env)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const BlogPost = require('./models/BlogPost');
const Comment = require('./models/Comment');

const users = [
  { username: 'admin', email: 'admin@example.com', password: 'admin123' },
  { username: 'wangyouran', email: 'wangyouran@example.com', password: 'password123' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Project.deleteMany(),
      BlogPost.deleteMany(),
      Comment.deleteMany(),
    ]);

    // Create users (passwords are hashed automatically by the model)
    const createdUsers = await User.create(users);
    const admin = createdUsers[0];
    const writer = createdUsers[1];

    // Sample projects
    await Project.create([
      {
        title: 'Full-Stack Portfolio & Blog',
        description:
          'This very project — a production-ready portfolio and blog built with React, Node.js, Express and MongoDB. Features JWT authentication, a protected admin dashboard and a REST API.',
        imageUrl: '',
        repoUrl: 'https://github.com/yourname/portfolio',
        liveUrl: 'https://yourname.vercel.app',
        user: admin._id,
      },
      {
        title: 'E-Commerce Storefront',
        description:
          'A responsive online store with a product catalogue, cart and Stripe checkout. Built with the MERN stack and deployed to a cloud host.',
        imageUrl: '',
        repoUrl: 'https://github.com/yourname/store',
        liveUrl: 'https://store.vercel.app',
        user: admin._id,
      },
      {
        title: 'Task Manager API',
        description:
          'A REST API for managing tasks and teams with role-based permissions, rate limiting and automated tests.',
        imageUrl: '',
        repoUrl: 'https://github.com/yourname/task-api',
        liveUrl: '',
        user: admin._id,
      },
    ]);

    // Sample blog posts
    const posts = await BlogPost.create([
      {
        title: 'Why I Love Building With the MERN Stack',
        content:
          'The MERN stack (MongoDB, Express, React, Node) lets one developer own the entire product journey... In this post I share why it remains my favourite toolkit for full-stack work, from rapid prototyping to production deployment.',
        author: admin._id,
      },
      {
        title: 'Securing Your Express API With JWT',
        content:
          'Authentication is the backbone of any real application. This article walks through hashing passwords with bcrypt, issuing JWTs on login and protecting routes with a reusable middleware guard.',
        author: writer._id,
      },
    ]);

    // A sample comment
    await Comment.create({
      body: 'Great write-up! The JWT middleware example was exactly what I needed.',
      author: writer._id,
      post: posts[0]._id,
    });

    console.log('[seed] Data inserted successfully!');
    console.log('Admin login -> email: admin@example.com | password: admin123');
    process.exit(0);
  } catch (error) {
    console.error(`[seed] Failed: ${error.message}`);
    process.exit(1);
  }
};

seed();
