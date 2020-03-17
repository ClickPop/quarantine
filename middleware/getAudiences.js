const airtable = require('airtable');
require('dotenv').config();
const api_key = process.env.AIRTABLE_API_KEY;
const api_base = process.env.AIRTABLE_BASE;

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base(api_base);

module.exports = function(req, res, next) {
    var audiences = [];

    base('with-whom')
    .select({
        view: 'Grid view'
    })
    .eachPage(
        function page(records, fetchNextPage) {
            records.forEach(function(record) {
                audiences.push(record.fields);
            });
            fetchNextPage();
        },
        function done(err) {
            if (err) {
                next(err);
            }
            res.locals.audiences = audiences;
            req.audiences = audiences;
            next();
        }
    );
};