const airtable = require('airtable');
require('dotenv').config();
const api_key = process.env.AIRTABLE_API_KEY;
const api_base = process.env.AIRTABLE_BASE;

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base(api_base);

module.exports = function(req, res, next) {
    var { type, audience, free } = req.body;
    var formula = false;
    var activities = [];
    free =
        typeof free !== 'undefined' && (free === '1' || free === 1)
            ? true
            : false;
    type = typeof type === 'string' && type.length > 0 ? type : false;
    audience =
        typeof audience === 'string' && audience.length > 0 ? audience : false;

    if (type !== false && audience !== false) {
        formula = 'AND(';
        formula += `FIND('${audience}', ARRAYJOIN({audience_ids}, ', ')), FIND('${type}', ARRAYJOIN({type_ids}, ', '))`;
        if (free) {
            formula += `, {is_free} = 1`;
        }
        if (false) {
            formula += `, {approved} = 1`;
        }
        formula += ')';

        base('activities')
            .select({
                view: 'Grid view',
                filterByFormula: formula
            })
            .eachPage(
                function page(records, fetchNextPage) {
                    records.forEach(function(record) {
                        tempActivity = record.fields;
                        tempActivity.id = record.getId();
                        activities.push(tempActivity);
                    });
                    fetchNextPage();
                },
                function done(err) {
                    if (err) {
                        next(err);
                    }
                    res.locals.activity =
                        activities[
                            Math.round(Math.random() * (activities.length - 1))
                        ];
                    next();
                }
            );
    } else {
        next();
    }
};
