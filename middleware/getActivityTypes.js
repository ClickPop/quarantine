const airtable = require('airtable');
require('dotenv').config();
const api_key = process.env.AIRTABLE_API_KEY;
const api_base = process.env.AIRTABLE_BASE;

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base(api_base);

module.exports = function(req, res, next) {
    var types = [];

    base('activity-types')
    .select({
        view: 'Grid view'
    })
    .eachPage(
        function page(records, fetchNextPage) {
            records.forEach(function(record) {
                tempType = record.fields;
                tempType.id = record.getId();
                types.push(tempType);
            });
            fetchNextPage();
        },
        function done(err) {
            if (err) {
                next(err);
            }
            res.locals.types = types;
            req.types = types;
            next();
        }
    );
};