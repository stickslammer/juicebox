const {
    client,
    createUser,
    getAllUsers // new
} = require('./index');

async function createInitialUsers() {
    try {
        console.log("Starting to create users...");

        const albert = await createUser({ username: 'sandra', password: 'glamgal' });
        console.log(albert);

        console.log("Finished creating users!");
    } catch (error) {
        console.error("Error creating users!");
        throw error;
    }
}

async function dropTables() {
    try {
        console.log("Starting to drop tables...");
        await client.query(`
        DROP TABLE IF EXISTS users;
        

    `);
        console.log("Finished dropping tables!");
    } catch (error) {
        console.error("Error dropping tables!");
        throw error; // we pass the error up to the function that calls dropTables
    }
}

async function createTables() {
    try {
        console.log("Starting to build tables...");
        await client.query(`
       CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL
        );
    `);
    } catch (error) {
        throw error; // we pass the error up to the function that calls createTables
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

        const users = await getAllUsers();
        console.log("All users: ",users);
    } catch (error) {
        console.error(error);
    } finally {
        client.end();
    }
}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());
