const router = require('express').Router();
const { getSchemes } = require('../controllers/schemeController');

router.get('/farmers/:phoneNo/schemes', getSchemes);

module.exports = router;