const express = require('express');
const router = express.Router();
const getContributors = require('../middleware/getContributors');

router.get('/', getContributors, (req, res) => {
    res.render('contributors', {
        contributors: req.contributors
    });
});

module.exports = router;
