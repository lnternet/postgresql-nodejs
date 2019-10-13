const pg = require('pg');
const { createDb, migrate } = require("postgres-migrations");
var parse = require('pg-connection-string').parse;

// Database config
const connectionString = process.env.DATABASE_URL || `postgres://bc4035:1234@localhost:5432/localDBB`;
let db_config = parse(connectionString);
db_config.port = parseInt(db_config.port); // Port is a string, needs to be int

// PostgreSQL client
var client = new pg.Client(connectionString);

// Migrations
async function createDatabase() {
    console.log('Attempting to create database with following config: ', db_config);
    return await createDb(db_config.database, {
        user: db_config.user,
        password: db_config.password,
        host: db_config.host,
        port: db_config.port
      })
      .then(() => {
        console.log('Database created successfully.');
        return true;
      })
      .catch((err) => {
        console.error('Database creation failed. Error: ', err);
        return false;
      });
}

async function migrateDatabase() {
    console.log('Attempting to migrate database');
    return await migrate(db_config, "./sql_migrations/")
    .then(() => {
        console.log('Database migration completed successfully.');
        return true;
    })    
    .catch((err) => {
        console.error('Migrating database failed. Error: ', err);
        return false;
    });
}

// Connection
async function connectToDatabase() {
    console.log(`Attempting to connecto to databse with following connection string: ${connectionString}`);
    return await client.connect()
        .then(() => {
            console.log('Connected to database successfully.');
            return true;
        })
        .catch((err) => {
            console.error('Connection to database failed. Error: ', err);
            return false;
        });
}

// Functions
async function getAllUsers() {
    return await new Promise(function(resolve, reject) {
        client.query('SELECT * FROM users', (error, result) => {
            if (error) { 
                reject({ error: error }); 
            }
            if (!result) { 
                reject(null); 
            }
            resolve({ data: result.rows});
        })
    }).catch((err) => { return err; }); 
}

async function addUser(firstName, lastName) {
    return await new Promise(function(resolve, reject) {
        client.query(`INSERT INTO users(FirstName, LastName) VALUES ('${firstName}', '${lastName}');`, (error, result) => {
            if (error) { 
                reject({ error: error }); 
            }
            if (!result) { 
                reject(null); 
            }
            resolve();
        })
    }).catch((err) => { return err; }); 
}


module.exports = { createDatabase, migrateDatabase, connectToDatabase, getAllUsers, addUser }
