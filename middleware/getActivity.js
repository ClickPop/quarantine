const airtable = require('airtable');
require('dotenv').config();
const api_key = process.env.AIRTABLE_API_KEY;
const api_base = process.env.AIRTABLE_BASE;

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base(api_base);

module.exports = function(req, res, next) {
    var { type, audience, free } = req.body;
    free = (typeof free !== "undefined" && (free === "1" || free === 1)) ? true : false;
    type = (typeof type === "string") ? type : false;
    audience = (typeof audience === "string") ? audience : false;

    next();
};