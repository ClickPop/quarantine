var express = require('express');
var router = express.Router();
var getActivityTypes = require('../middleware/getActivityTypes');
var getAudiences = require('../middleware/getAudiences');
var getActivity = require('../middleware/getActivity');
var sendActivities = require('../middleware/sendActivities');

/* GET home page. */
router.get('/', getActivityTypes, getAudiences, function(req, res, next) {
  res.render('index', { 
    title: 'Quarantine Fun!', 
    types: req.types, 
    audiences: req.audiences,
    layout: 'fullscreen'
  });
});

router.post('/search', getActivity, sendActivities);

module.exports = router;
