var express = require('express');
var router = express.Router();
var getActivityTypes = require('../middleware/getActivityTypes');
var getAudiences = require('../middleware/getAudiences');
var getActivity = require('../middleware/getActivity');
var getActivityContributors = require('../middleware/getActivityContributors');
var sendActivity = require('../middleware/sendActivity');

router.post('/', getActivity, getActivityContributors, sendActivity);
router.get('/:id', getActivityTypes, getAudiences, getActivity, getActivityContributors, (req, res) => {
  let activity = (typeof res.locals.activity === 'object' 
  && res.locals.activity.hasOwnProperty('title'))
    ? JSON.stringify(res.locals.activity)
    : null;
  res.render('index', {
    title: 'Things to do when the world gets cancelled.', 
    types: req.types,
    audiences: req.audiences,
    activity: activity,
    layout: 'fullscreen'
  });
});

module.exports = router;
