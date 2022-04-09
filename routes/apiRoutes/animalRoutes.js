// start an instance of Router
const router = require('express').Router();

//require the necessary functions and the json data
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');


//add the route to request the data. get method requires 2 arguments. first one is a string that describes the route to get the data from and the second is a callback that will execute every time the route is accessed. To use router change app to route. This way it will still be on the same instance of the app launched in the server.js
router.get('/animals', (req,res) => {
    let results = animals;
    if(req.query){
        //set the results equal to the filtered array
        results = filterByQuery(req.query, results);
    }
    // response uses the send method, but change to json passing the data as a argument to tell it that it's expecting json data
    res.json(results);
});

// new GET route for the animals that takes in one id
router.get('/animals/:id', (req,res) => {
    const result = findById(req.params.id, animals);
    // if result is true display json data, if not show response as 404 error
    if (result){
        res.json(result);
    } else {
        res.send(404);
    }
});

// create a route for the POST
router.post('/animals', (req, res) =>{
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

//export the router module
module.exports = router;

