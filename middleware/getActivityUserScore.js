require('dotenv').config();
const createError = require('http-errors');
const airtable = require('airtable');
const api_key = process.env.AIRTABLE_API_KEY;
const api_base = process.env.AIRTABLE_BASE;
const helpers = require('../helpers/helpers');

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base(api_base);

module.exports = (req, res, next) => {
    let activity_id = req.params.id;
    let ip = req.ip;
    let ua = req.useragent;
    let formula = '';
    let likes = [];
    let selectArgs = { view: 'Grid view' };
    let user_score = 0;
    let base_name = (req.app.get('env') === 'production') ? 'likes' : 'dev-likes';

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
                    if (Array.isArray(likes) && likes.length > 0) {
                        let like = likes.shift();
                        res.locals.user_score = like.user_score;
                        res.locals.likes = likes;
                        res.locals.activity_id = activity_id;
    
                        next();
                    } else {
                        helpers.apiError(res, createError(500));
                        return;
                    }
                }
            }
        );
    } else {
        // Invalid useragent or ip address
        helpers.apiError(res, createError(400, 'Invalid [user-agent] or [IP Address] detected.'));
        return;
    }
};