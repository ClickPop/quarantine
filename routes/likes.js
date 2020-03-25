var express = require('express');
var router = express.Router();
var checkLike = require('../middleware/checkLike');
var upsertLike = require('../middleware/upsertLike');
var removeDuplicateLikes = require('../middleware/removeDuplicateLikes');
var getActivityScore = require('../middleware/getActivityScore');
var getActivityUserScore = require('../middleware/getActivityUserScore');
var sendActivityScore = require('../middleware/sendActivityScore');

router.post('/add', 
    checkLike,
    upsertLike,
    removeDuplicateLikes,
    getActivityScore,
    sendActivityScore
);
router.get('/:id',
    getActivityUserScore,
    removeDuplicateLikes,
    getActivityScore,
    sendActivityScore
);

module.exports = router;
