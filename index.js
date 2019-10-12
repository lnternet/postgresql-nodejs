const express = require('express');
const pg = require('pg');
const { createDb, migrate } = require("postgres-migrations");
var parse = require('pg-connection-string').parse;

// Database config
const connectionString = process.env.DATABASE_URL || `postgres://bc4035:1234@localhost:5432/localDBB`;
let db_config = parse(connectionString);

// Port is a string, needs to be int
db_config.port = parseInt(db_config.port);

console.log(`Attempting to create databse with following config: 
    user: ${db_config.user},
    password: ${db_config.password},
    host: ${db_config.host},
    database: ${db_config.database},
    port: ${db_config.port}`);

// Migrate database
createDb(db_config.database, {
    user: db_config.user,
    password: db_config.password,
    host: db_config.host,
    port: db_config.port
  })
  .then(() => {
    console.log(`Attempting to migrate databse`);
    return migrate(db_config, "./sql_migrations/")
  })
  .then(() => {
    console.log('DB successfully migrated.');
  })
  .catch((err) => {
    console.log(err)
  })


// API:
const app = express();

var client = new pg.Client(connectionString);
console.log(`Attempting to create databse with following connection string: ${connectionString}`);
client.connect();

app.get('/', (request, response) => {
    client.query('SELECT * FROM users', (error, result) => {
        if (error) {
            response.status(500).send(error);
        }

        response.send(result.rows);
    });
});

app.listen({ port: process.env.PORT || 3000 }, () => {
    console.log(`API running.`);
});
