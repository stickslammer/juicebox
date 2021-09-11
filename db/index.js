// inside db/index.js
const { Client } = require('pg'); // imports the pg module

// supply the db name and location of the database
const client = new Client('postgres://localhost:5432/juicebox-dev');


async function createUser({ username, password, name, location }) {
    try {
        const { rows: [user] } = await client.query('', []);
        const { rows } = await client.query(`
        INSERT INTO users(username, password, name, location)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;

    `, [username, password, name, location]);

        return rows;
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
        const result = await client.query(`
      UPDATE users
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `, Object.values(fields));

        return result;
    } catch (error) {
        throw error;
    }
}

async function createPost({
    authorId,
    title,
    content
}) {
    try {
        const { rows: [user] } = await client.query('', []);
        const { rows } = await client.query(`
        INSERT INTO users("authorId", title, content)
      VALUES ($1, $2, $3)
      ON CONFLICT ("authorId") DO NOTHING
      RETURNING *;

    `, [authorId, title, content]);

        return rows;
    } catch (error) {
        throw error;
    }
}

async function updatePost(id, {
    title,
    content,
    active
    }) {
    try {
        const result = await client.query(`
      UPDATE users
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `, Object.values(fields));

        return result;
    } catch (error) {
        throw error;
    }
}

async function getAllPosts() {
    const { rows } = await client.query(
        `SELECT id, title, content, active 
    FROM users;
  `);

    return rows;
}

async function getAllUsers() {
    const { rows } = await client.query(
        `SELECT id, username, name, location, active 
    FROM users;
  `);

    return rows;
}

async function getPostsByUser(userId, posts) {
    try {
        const { rows } = client.query(`
      SELECT * FROM posts
      WHERE "authorId"=${userId};
    `);

        return rows;
    } catch (error) {
        throw error;
    }
}

async function getUserById(userId) {
        `SELECT id, username, name, location, posts
    FROM users;`
    // first get the user (NOTE: Remember the query returns 
    // (1) an object that contains 
    // (2) a `rows` array that (in this case) will contain 
    // (3) one object, which is our user.
    // if it doesn't exist (if there are no `rows` or `rows.length`), return null

    // if it does:
    // delete the 'password' key from the returned object
    // get their posts (use getPostsByUser)
    // then add the posts to the user object with key 'posts'
    // return the user object
}

// and export them
module.exports = {
    client,
    createUser,
    updateUser,
    createPost,
    getAllUsers,
    getPostsByUser,
    getUserById
}