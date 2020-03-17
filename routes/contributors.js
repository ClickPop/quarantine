const express = require('express');
const router = express.Router();
const contributorLookup = require('../middleware/contributorLookup');

router.get('/', contributorLookup, (req, res) => {
    console.log(req.c);
    res.render('contributors', {
        contributors: JSON.stringify(req.c)
    });
});

router.get('/:id', contributorLookup, (req, res) => {
    res.render('contributor');
});

module.exports = router;
