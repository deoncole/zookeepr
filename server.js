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


//function to handle the filter functionality. Take in the req.query and filter through the array returning a new filtered array
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array.
        // If personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

// function that takes in the id and array of animals and returns a single animal object
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

// function that accepts the POST route's req.body value and the array to add the data to. will be executed inteh app's post route
function createNewAnimal(body, animalsArray){
    const animal = body;
    animalsArray.push(animal);
    // this is a synchronous version of fs.writeFile that doesn't require a callback function
    fs.writeFileSync(
        // method the file to the subdirectory using teh path.join() method which takes in the directory of the file we execute the code in, with the path to the json file 
        path.join(__dirname, './data/animals.json'),
        // save the JavaScript array data as JSON using the stringfy method to convert it. The null argument means we don't want to edit any of our existing data; if we did, we could pass something in there. The 2 indicates we want to create white space between our values to make it more readable
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    return animal;
};

// validation function to be used in the POST. the animal parameter is going to be the content from req.body, and we're going to run its properties through a series of validation checks. If any of them are false, we will return false and not create the animal data.
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
      return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
      return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
    }
    return true;
  }

//add the route to request the data. get method requires 2 arguments. first one is a string that describes the route to get the data from and the second is a callback that will execute every time the route is accessed
app.get('/api/animals', (req,res) => {
    let results = animals;
    if(req.query){
        //set the results equal to the filtered array
        results = filterByQuery(req.query, results);
    }
    // response uses the send method, but change to json passing the data as a argument to tell it that it's expecting json data
    res.json(results);
});

// new GET route for the animals that takes in one id
app.get('/api/animals/:id', (req,res) => {
    const result = findById(req.params.id, animals);
    // if result is true display json data, if not show response as 404 error
    if (result){
        res.json(result);
    } else {
        res.sendStatus(404);
    }
});

// create a route for the POST
app.post('/api/animals', (req, res) =>{
    // req.body is where our incoming content will be
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if(!validateAnimal(req.body)){
        res.status(400).send('The animal is not properly formatted.');
    } else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});

// route to access the main api and loads the html. the '/' is the base of the route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
// route that goes to the animals html page and not the api. using api will expect json data to return
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
  });
// route that goes to the zookeepers html page and not the api. using api will expect json data to return
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
  });
// route that is a wildcard meaning any route that wasn't previously defined will fall under this request and will receive the homepage as the response. This always come last in the route order
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });

// start listening
app.listen(PORT, ()=> {
    console.log(`API server now on port ${PORT}!`);
})