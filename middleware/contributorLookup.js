const airtable = require('airtable');
require('dotenv').config();
const base = new airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE
);

module.exports = function(req, res, next) {
    contributors = [];
    base('contributors')
        .select({
            view: 'Grid view'
        })
        .eachPage(
            function page(records, fetchNextPage) {
                records.forEach(record => {
                    contributors.push(record.fields);
                });

                fetchNextPage();
            },
            function done(err) {
                if (err) {
                    console.error(err);
                    return;
                }
                req.contributors = contributors;
                next();
            }
        );
};
