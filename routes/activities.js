var express = require('express');
var router = express.Router();
var getActivity = require('../middleware/getActivity');
var getActivityContributors = require('../middleware/getActivityContributors');

router.get('/:id', getActivity, getActivityContributors, (req, res) => {
  res.render('activity', {
    layout: 'fullscreen'
  });
});

module.exports = router;
