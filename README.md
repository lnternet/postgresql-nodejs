# postresql-nodejs
Simple Node.js app connecting to PostgreSQL database serving data with Express.js

---

## Postgres commands

- `psql posgres` -  administrative tool
- `\du` - lists all DB users (roles)
- `\l` - list databases
- `\c database` - switch to database
- `\dt` - list tables
- `\q` - quit psql


## Prerequisites

- PostgreSQL 
- node & npm

## Install and run

- Run PostgreSQL database locally.
- Edit configurations in `database.js` to connect to local db.
- Install packages by running `npm install`
- Start API by running `npm start`

## API contracts

- Get all users from database
 ```
 curl -X GET \
   http://localhost:3000/ 
 ```
 - Add new user
 ```
 curl -X POST \
   http://localhost:3000/user \
   -H 'Content-Type: application/json' \
   -d '{
	 "firstName": "John",
	 "lastName": "Cena"
   }'
 ```
## postgres-migrations

`postgres-migrations` npm package manages migration scripts for PostgreSQL database. It creates separate `migrations` table where checksums of scripts are stored so it knows which scripts where executed and which not.

There are two main methods when using postgres-migrations - `createDb` and `migrate`. Both of these need database configuration object, not a connection string, therefore in this project `pg-connection-string` is used to parse connection string into separate fields. 

Syntax:

```
createDb('database', {
    user: 'user',
    password: 'password',
    host: 'host',
    port: 'port'
})
.then(() => {
    // success
})
.catch((err) => {
    // failure
});
```

```
migrate(db_config, "./path/to/migration/scripts")
.then(() => {
    // success
})    
.catch((err) => {
    // failure
});
```
## Heroku Postgre

Heroku provides PostgreSQL service. Free option has limitation of 10,000 rows and 0 bytes of RAM. Once **Heroku Postgre** add-on is added to the app, Heroku automatically adds `DATABASE_URL` environment variable to the app which can be used from the app itself to connect to the database.

User created automatically does not have access to create database, therefore `createDb` from `postgres-migrations` package will fail. However, since database is also automatically created, this failure can be safely ignored in code. 
