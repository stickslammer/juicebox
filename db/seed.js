const {
    client,
    getAllUsers,
    createUser,
    updateUser
} = require('./index');

async function dropTables() {
    try {
        console.log("Starting to drop tables...");
        await client.query(`
        DROP TABLE IF EXISTS posts, users;
        

    `);
        console.log("Finished dropping tables!");
    } catch (error) {
        console.error("Error dropping tables!");
        throw error;
    }
}

async function createPosts() {
    try {
        console.log("Starting to create posts...");
        await client.query(`
       CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES user(id) NOT NULL
            title varchar(255) NOT NULL,
            content VARCHAR(255) NOT NULL,
            active BOOLEAN DEFAULT true
        );
    `);
        console.log("Finished building tables!");
    } catch (error) {
        console.error("Error building tables!");
        throw error; // we pass the error up to the function that calls createTables
    }
}

async function createTables() {
    try {
        console.log("Starting to build tables...");
        await client.query(`
       CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            active BOOLEAN DEFAULT true
        );
    `);
        console.log("Finished building tables!");
    } catch (error) {
        console.error("Error building tables!");
        throw error; // we pass the error up to the function that calls createTables
    }
}

async function createInitialUsers() {
    try {
        console.log("Starting to create users...");

        await createUser({ username: 'albert', password: 'bertie99', name: 'Al Bert', location: 'Sidney, Australia', active: true });
        await createUser({ username: 'sandra', password: '2sandy4me', name: 'Just Sandra', location: "Ain't Telling", active: true });
        await createUser({ username: 'glamgal', password: 'soglam', name: 'Joshua', location: 'Upper East Side', active: true });   

        console.log("Finished creating users!");
    } catch (error) {
        console.error("Error creating users!");
        throw error;
    }
}

async function rebuildDB() {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
    } catch (error) {
        throw error;
    }
}

async function testDB() {
    try {
        console.log("Starting to test database...");
        console.log("Calling getAllUsers");
        const users = await getAllUsers();
        console.log("All users: ", users);
        console.log("Calling updateUser on users[0]")
        const updateUserResult = await updateUser(users[0].id, {
            name: "Newname Sogood",
            location: "Lesterville, KY"
        });
        console.log("Result:", updateUserResult);
        console.log("Finished database tests!");
    } catch (error) {
        console.error("Error testing database!");
        console.error(error);
    } finally {
        client.end();
    }
}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());
