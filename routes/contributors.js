const express = require('express');
const router = express.Router();
const contributorLookup = require('../middleware/contributorLookup');

router.get('/', contributorLookup, (req, res) => {
    res.render('contributors', {
        contributors: req.contributors,
        layout: 'layout-simple'
    });
});

module.exports = router;
