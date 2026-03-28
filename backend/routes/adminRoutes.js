const router = require('express').Router();
const { getKeypadFarmers, triggerCall } = require('../controllers/adminController');

router.get('/farmers/keypad', getKeypadFarmers);
router.post('/trigger-call', triggerCall);

module.exports = router;