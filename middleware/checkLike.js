require('dotenv').config();
const createError = require('http-errors');
const airtable = require('airtable');
const api_key = process.env.AIRTABLE_API_KEY;
const api_base = process.env.AIRTABLE_BASE;
const helpers = require('../helpers/helpers');

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base(api_base);

module.exports = (req, res, next) => {
    const { activity_id, like_type } = req.body;
    let user_score = helpers.validateLikeType(like_type, true);

    if (helpers.validateRecordID(activity_id)) {
        if (user_score !== false) {
            let ip = req.ip;
            let ua = req.useragent;
            let formula = '';
            let base_name = (req.app.get('env') === 'production') ? 'likes' : 'dev-likes';
            let selectArgs = { view: 'Grid view' };
            let likes = [];

            if (typeof ua === 'object' && ua.hasOwnProperty('source')
            && typeof ip === 'string' && ip.length > 0) {
                selectArgs.filterByFormula = `AND({activity_id}='${activity_id}', {user_agent} = '${ua.source}', {ip_address} = '${ip}')`;
                
                base(base_name)
                .select(selectArgs)
                .eachPage(
                    function page(records, fetchNextPage) {
                        records.forEach(function(record) {
                            tempLike = {
                                id: record.getId(),
                                activity: record.fields.activity,
                                user_agent: record.fields.user_agent,
                                ip_address: record.fields.ip_address,
                                user_score: record.fields.user_score
                            };
                            likes.push(tempLike);
                        });

                        fetchNextPage();
                    },
                    function done(err) {
                        if (err) {
                            helpers.apiError(res, err); 
                            return;
                        } else {
                            res.locals.likes = likes;
                            res.locals.user_score = user_score;
                            res.locals.activity_id = activity_id;
                            next();
                        }
                    }
                );
            } else {
                // Invalid useragent or ip address
                helpers.apiError(res, createError(400, 'Invalid [user-agent] or [IP Address] detected.'));
                return;
            }
        } else {
            // invalid like_type
            helpers.apiError(res, createError(400, 'Invalid [like_type] value submitted'));
            return;
        }
    } else {
       // invalid activity_id
       helpers.apiError(res, createError(400, 'Invalid [activity_id] value submitted'));
       return;
    }
};