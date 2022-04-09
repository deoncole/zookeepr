// require the express package
const express = require('express');
// require the json data
const {animals} = require ('./data/animals.json');
// first thing is to instantiate the server and start express with app const
const app = express();

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

//add the route to request the data. get method requires 2 arguments. first one is a string that describes the route to get teh data from and the second is a callback that will execute every time the route is accessed
app.get('/api/animals', (req,res) => {
    let results = animals;
    if(req.query){
        //set the results equal to the filtered array
        results = filterByQuery(req.query, results);
    }
    // response uses the send method, but change to json passing the data as a argument to tell it that it's expecting json data
    res.json(results);
});

// start listening
app.listen(3001, ()=> {
    console.log('API server now on port 3001!');
})