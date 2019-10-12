const express = require('express');
const Pool = require('pg').Pool;
const { createDb, migrate } = require("postgres-migrations");

// Database config
const db_host = process.env.DB_HOST || 'localhost';
const db_name = process.env.DB_NAME || 'localDBB';
const db_user = process.env.DB_USER || 'bc4035';
const db_password = process.env.DB_PASSWORD || '1234';
const db_port = process.env.DB_PORT || 5432;



// Migrate database
createDb(db_name, {
    user: db_user,
    password: db_password,
    host: db_host,
    port: db_port
  })
  .then(() => {
    return migrate({
      database: db_name,
      user: db_user,
      password: db_password,
      host: db_host,
      port: db_port,
    }, "./sql_migrations/")
  })
  .then(() => {
      console.log('successful migration');
  })
  .catch((err) => {
    console.log(err)
  })




// API:
const app = express();

const postgreSQL_pool = new Pool({
    user: db_user,
    host: db_host,
    database: db_name,
    password: db_password,
    port: db_port,
  });

app.get('/', (request, response) => {
    postgreSQL_pool.query('SELECT * FROM users', (error, result) => {
        if (error) {
            response.status(500).send(error);
        }

        response.send(result.rows);
    });
});

app.listen({ port: process.env.PORT || 3000 }, () => {
    console.log(`API running.`);
});
