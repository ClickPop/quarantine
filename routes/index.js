var express = require('express');
var router = express.Router();
var getActivityTypes = require('../middleware/getActivityTypes');
var getAudiences = require('../middleware/getAudiences');
var getActivity = require('../middleware/getActivity');

/* GET home page. */
router.get('/', getActivityTypes, getAudiences, function(req, res, next) {
  res.render('index', { 
    title: 'Express', 
    types: req.types, 
    audiences: req.audiences 
  });
});

router.post('/search', getActivity, function(req, res, next) { res.redirect('/'); });

module.exports = router;
