const express = require('express');
const bodyParser = require('body-parser');
var db = require('./database');

async function startAPI() {
    const app = express();
    app.use(bodyParser.json())

    app.get('/', async (request, response) => {
        const result = await db.getAllUsers();

        if ( !result || result.error ) 
            response.status(500).send();
        
        response.send(result.data);
    });

    app.post('/user', async (request, response) => {
        if (!request.body.firstName || !request.body.lastName)
            response.status(400).send('Either first name or last name is missing');

        const result = await db.addUser( request.body.firstName, request.body.lastName );

        if ( result && result.error ) 
            response.status(500).send();
    
        response.send();
    });
    
    app.listen({ port: process.env.PORT || 3000 }, () => {
        console.log(`API running.`);
    });
}

module.exports = { startAPI }