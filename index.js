const express = require('express');
const pg = require('pg');
const { createDb, migrate } = require("postgres-migrations");
var parse = require('pg-connection-string').parse;

startup();

async function startup() {
    // Database config
    const connectionString = process.env.DATABASE_URL || `postgres://bc4035:1234@localhost:5432/localDBB`;
    let db_config = parse(connectionString);
    db_config.port = parseInt(db_config.port); // Port is a string, needs to be int

    var isDatabaseCreated = await createDatabase(db_config);

    if (isDatabaseCreated == true || isDatabaseCreated == false) // Try to continue both if successful or not
        var isDatabaseMigrated = await migrateDatabase(db_config);

    if (isDatabaseMigrated) 
        await startAPI(connectionString);
}

async function createDatabase(db_config) {
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

async function migrateDatabase(db_config) {
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

async function connectToDatabase(client, connectionString) {
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

async function startAPI(connectionString) {
    const app = express();

    var client = new pg.Client(connectionString);
    var isConnectedToDB = await connectToDatabase(client, connectionString);

    if (isConnectedToDB) {
        app.get('/', (request, response) => {
            client.query('SELECT * FROM users', (error, result) => {
                if (error) {
                    response.status(500).send(error);
                }
        
                if (!result) {
                    response.status(500).send('No result!');
                }
        
                response.send(result.rows);
            });
        });
        
        app.listen({ port: process.env.PORT || 3000 }, () => {
            console.log(`API running.`);
        });
    } else {
        console.error('Unable to start API.');
    }

    

}

