// require the routes for read the index.js files in each folder
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
// require the express package
const express = require('express');
// require the json data
const {animals} = require ('./data/animals.json');
// require the file system
const fs = require('fs');
// require for working with file and directory paths
const path = require('path');

// set an enviornment to use the port neccessary for Heroku since it runs on port 80
const PORT = process.env.PORT || 3001;
// first thing is to instantiate the server and start express with app const
const app = express();

// app.use is middleware, which is a method executed by our Express.js server that mounts a function to the server that our requests will pass through before getting to the intended endpoint. Both methods below are needed to be set up every time you create a server that's looking to accept POST data
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));

// parse incoming JSON data
app.use(express.json());


// middleware to the server that uses the express.static method taking in the file path to the location in the application and instructing the server to make the files static resources to be accessed without creating a endpoint
app.use(express.static('public'));

// middleware for the api and html routes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// start listening
app.listen(PORT, ()=> {
    console.log(`API server now on port ${PORT}!`);
})