const express = require('express');
const tagsRouter = express.Router();
const { getAllTags} = require('../db');

tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /tags");

    next();
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    // read the tagname from the params
    try {
        // use our method to get posts by tag name from the db
        const tags = await getAllTags();
        // send out an object to the client { posts: // the posts }
        res.send({
            tags
        });
    } catch ({ name, message }) {
        console.log(error);
        next(error);
    }
        
});

module.exports = tagsRouter;