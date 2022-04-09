const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');

// middleware for the animal routes
router.use(animalRoutes);
router.use(require('./zookeepersRoutes'));

module.exports = router;