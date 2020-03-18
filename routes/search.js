var express = require('express');
var router = express.Router();
var getActivity = require('../middleware/getActivity');
var sendActivity = require('../middleware/sendActivity');

router.post('/', getActivity, sendActivity);

module.exports = router;