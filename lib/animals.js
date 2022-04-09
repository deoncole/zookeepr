const fs = require('fs');
const path = require('path');

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
          console.log(personalityTraitsArray);
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
        // method the file to the subdirectory using the path.join() method which takes in the directory of the file we execute the code in, with the path to the json file 
        path.join(__dirname, '../data/animals.json'),
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

  module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
  };