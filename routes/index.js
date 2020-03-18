var express = require('express');
var router = express.Router();
var getActivityTypes = require('../middleware/getActivityTypes');
var getAudiences = require('../middleware/getAudiences');

/* GET home page. */
router.get('/', getActivityTypes, getAudiences, function(req, res, next) {
  res.render('index', { 
    title: 'Quarantine Fun!', 
    types: req.types, 
    audiences: req.audiences,
    layout: 'fullscreen'
  });
});

module.exports = router;
