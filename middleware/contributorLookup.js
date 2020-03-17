const airtable = require('airtable');
require('dotenv').config();
const base = new airtable({ apiKey: process.env.api_key }).base(
    process.env.base_id
);

module.exports = function(req, res, next) {
    if (req.id !== undefined) {
    } else {
        req.c = [];
        base('contributors')
            .select({
                view: 'Grid view'
            })
            .eachPage(
                function page(records, fetchNextPage) {
                    records.forEach(record => {
                        let contributor = {};
                        if (record.get('name') !== undefined) {
                            contributor.name = record.get('name');
                        }
                        if (record.get('showcase-website') !== undefined) {
                            contributor.website = record.get(
                                'showcase-website'
                            );
                        }
                        if (record.get('showcase-twitter') !== undefined) {
                            contributor.twitter = record.get(
                                'showcase-twitter'
                            );
                        }
                        if (record.get('showcase-other') !== undefined) {
                            contributor.other = record.get('showcase-other');
                        }
                        if (record.get('bio') !== undefined) {
                            contributor.bio = record.get('bio');
                        }
                        if (record.get('headshot') !== undefined) {
                            contributor.headshot = record.get('headshot');
                        }
                        req.c.push(contributor);
                    });

                    fetchNextPage();
                },
                function done(err) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                }
            );
    }
    next();
};
