'use strict';

const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

const connectionString = 'postgress://localhost:5432/userapp'
const client = new pg.Client(connectionString);
client.connect();

app.use(bodyParser.json()); //app.use is capturing request from json and sending out the response of the root
app.use(bodyParser.urlencoded( {extended: true })); //get interpreted before going to the 
app.use(express.static('./public'));

app.get('/', (request, response) => {
    response.sendFile('./public/index.html')
})

app.get('/db/person', (request, response) => {
    client.query('SELECT * FROM persons;')
        .then(function(data) {
            response.send(data);
        })
        .catch(function(err) {
        })
})

app.post('/db/person', (request, response) => {
    client.query(`
        INSERT INTO persons(name, age, ninja)
        VALUES($1, $2, $3);`,
        [
            request.body.name,
            request.body.age,
            request.body.ninja
        ]
    )
    .then(function(data) {
        response.redirect('/');
    })
    .catch(function(err) {
        console.error(err);
    })
});

createTable();
//build the above post without adding anything into it first just to see if it works

app.listen(PORT, () => { //listens for you to type 'node server.js' in the terminal
    console.log(`Currently listening on ${PORT}`); //need to put in template literal to get it working
});

function createTable() {//make sure between the backticks are exact each time
    client.query(`
        CREATE TABLE IF NOT EXISTS persons(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            age INTEGER,
            ninja BOOLEAN
        );
    `)
    .then(function (response) {
        console.log('success! created table!');
    });
}