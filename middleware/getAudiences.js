require('dotenv').config();
const airtable = require('airtable');
const api_key = process.env.AIRTABLE_API_KEY;
const api_base = process.env.AIRTABLE_BASE;

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base(api_base);

module.exports = function(req, res, next) {
    let audiences = [];

    base('with-whom')
    .select({
        view: 'Grid view'
    })
    .eachPage(
        function page(records, fetchNextPage) {
            records.forEach(function(record) {
                tempAudience = record.fields;
                tempAudience.id = record.getId();
                audiences.push(tempAudience);
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