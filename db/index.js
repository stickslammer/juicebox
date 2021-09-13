const { Client } = require('pg');

const client = new Client('postgres://localhost:5432/juicebox-dev');

async function createUser({ username, password, name, location }) {
    try {
        const { rows: [user] } = await client.query(`
        INSERT INTO users(username, password, name, location)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;

    `, [username, password, name, location]);

        return user;
    } catch (error) {
        throw error;
    }
}

async function updateUser(id, fields = {}) {
    const { rows: [user] } = await client.query('', []);
    // build the set string
    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');

    // return early if this is called without fields
    if (setString.length === 0) {
        return;
    }

    try {
        const { rows: [user] } = await client.query(`
      UPDATE users
        SET "name"='new name', "location"='new location'
        WHERE id=2;
      RETURNING *;
    `, Object.values(fields));

        return user;
    } catch (error) {
        throw error;
    }
}

async function getAllUsers() {
    try {
        const { rows } = await client.query(`
      SELECT id, username, name, location, active 
      FROM users;
    `);

        return rows;
    } catch (error) {
        throw error;
    }
}

async function getUserById(userId) {
    try {
        const { rows: [user] } = await client.query(`
        SELECT id, username, name, location, active
    FROM users,
    WHERE id=${userId};
    `);
        if (!user) {
            return null
        }

        user.posts = await getPostsByUser(userId);

        return user;
    } catch (error) {
        throw error;
    }
    async function createPost({
        authorId,
        title,
        content,
        tags = [] 
    }) {
        try {
            const { rows: [post] } = await client.query(`
      INSERT INTO posts("authorId", title, content) 
      VALUES($1, $2, $3)
      RETURNING *;
    `, [authorId, title, content]);

            const tagList = await createTags(tags);

            return await addTagsToPost(post.id, tagList);
        } catch (error) {
            throw error;
        }
    }


    async function updatePost(postId, fields = {}) {
        const { tags } = fields; 
        delete fields.tags;

        const setString = Object.keys(fields).map(
            (key, index) => `"${key}"=$${index + 1}`
        ).join(', ');

        try {
            
            if (setString.length > 0) {
                await client.query(`
        UPDATE posts
        SET ${setString}
        WHERE id=${postId}
        RETURNING *;
      `, Object.values(fields));
            }
            if (tags === undefined) {
                return await getPostById(postId);
            }

            const tagList = await createTags(tags);
            const tagListIdString = tagList.map(
                tag => `${tag.id}`
            ).join(', ');

            // delete any post_tags from the database which aren't in that tagList
            await client.query(`
      DELETE FROM post_tags
      WHERE "tagId"
      NOT IN (${tagListIdString})
      AND "postId"=$1;
    `, [postId]);

            // and create post_tags as necessary
            await addTagsToPost(postId, tagList);

            return await getPostById(postId);
        } catch (error) {
            throw error;
        }
    }

    async function getAllPosts() {
        try {
            const { rows: postIds } = await client.query(`
      SELECT id
      FROM posts;
    `);

            const posts = await Promise.all(postIds.map(
                post => getPostById(post.id)
            ));

            return posts;
        } catch (error) {
            throw error;
        }
    }

    async function getPostsByUser(userId) {
        try {
            const { rows: postIds } = await client.query(`
      SELECT id 
      FROM posts 
      WHERE "authorId"=${userId};
    `);

            const posts = await Promise.all(postIds.map(
                post => getPostById(post.id)
            ));

            return posts;
        } catch (error) {
            throw error;
        }
    }

    async function getPostsByTagName(tagName) {
        try {
            const { rows: postIds } = await client.query(`
      SELECT posts.id
      FROM posts
      JOIN post_tags ON posts.id=post_tags."postId"
      JOIN tags ON tags.id=post_tags."tagId"
      WHERE tags.name=$1;
    `, [tagName]);

            return await Promise.all(postIds.map(
                post => getPostById(post.id)
            ));
        } catch (error) {
            throw error;
        }
    }
    module.exports = {
        client,
        createUser,
        updateUser,
        getAllUsers,
        getUserById,
        createPost,
        updatePost,
        getAllPosts,
        getPostsByUser,
        getPostsByTagName,
        addTagsToPost
    }
}