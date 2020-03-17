const airtable = require('airtable');
require('dotenv').config();
const base = new airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE
);

module.exports = function(req, res, next) {
    contributors = [];
    headshots = [];
    base('contributors')
        .select({
            view: 'Grid view'
        })
        .eachPage(
            function page(records, fetchNextPage) {
                records.forEach(record => {
                    console.log(record.fields);
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
                req.headshots = headshots;
                next();
            }
        );
};
