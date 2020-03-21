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
  let subPage = false;
  let title = 'Things to do when the world gets cancelled.'
  let siteName = 'Things to do when the world gets cancelled.';
  if (activity !== null) {
    subPage = true;
    title = res.locals.activity.title;
  }

  res.render('index', {
    title: title,
    subPage: subPage,
    siteName: siteName,
    types: req.types,
    audiences: req.audiences,
    activity: activity,
    layout: 'fullscreen'
  });
});

module.exports = router;
