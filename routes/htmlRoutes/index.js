const path = require('path');
const router = require('express').Router();

// route to access the main api and loads the html. the '/' is the base of the route. Change app to router so that it listens on the same server
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });

// route that goes to the animals html page and not the api. using api will expect json data to return
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
  });

// route that goes to the zookeepers html page and not the api. using api will expect json data to return
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
  });

// route that is a wildcard meaning any route that wasn't previously defined will fall under this request and will receive the homepage as the response. This always come last in the route order
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });

module.exports = router;