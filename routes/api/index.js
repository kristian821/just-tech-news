const router = require('express').Router();

const { use } = require('./user-routes');
const userRoutes = require('./user-routes');

router.use('/users', userRoutes);

module.exports = router;