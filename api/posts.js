const express = require('express');
const postsRouter = express.Router();
const { getAllPosts, createPost, updatePost, getPostById } = require('../db');

const { requireUser } = require('./utils');

postsRouter.use((req, res, next) => {
    console.log("A request is being made to /posts");

    next();
});
postsRouter.get('/', async (req, res) => {
    const post = await getAllPosts();
    res.send({
        post
    });
});
postsRouter.post('/', requireUser, async (req, res, next) => {
    const { title, content, tags = "" } = req.body;

    const tagArr = tags.trim().split(/\s+/)
    const postData = { authorId: req.user.id, title, content, tagArr };

    if (tagArr.length) {
        postData.tags = tagArr;
    }

    try {
        const post = await createPost(postData);
        if (post) {
            res.send({ post });
        } else {
            next({
                name: "AuthorizationError",
                message: "You're not logged in"
            })
        }

    } catch ({ name, message }) {
        next({ name, message });
    }
});

module.exports = postsRouter;