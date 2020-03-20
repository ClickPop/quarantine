var express = require('express');
var router = express.Router();
var getActivity = require('../middleware/getActivity');
var getActivityContributors = require('../middleware/getActivityContributors');
var sendActivity = require('../middleware/sendActivity');

router.post('/', getActivity, getActivityContributors, sendActivity);

module.exports = router;