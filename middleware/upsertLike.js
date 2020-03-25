require('dotenv').config();
const createError = require('http-errors');
const airtable = require('airtable');
const api_key = process.env.AIRTABLE_API_KEY;
const api_base = process.env.AIRTABLE_BASE;
const helpers = require('../helpers/helpers');

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base(api_base);

module.exports = (req, res, next) => {
    let ip = req.ip;
    let ua = req.useragent;
    let likes = res.locals.likes;
    let activity_id = res.locals.activity_id;
    let user_score = res.locals.user_score;
    
    let base_name = (req.app.get('env') === 'production') ? 'likes' : 'dev-likes';
    if (user_score !== false) {
        if (Array.isArray(likes) && likes.length > 0) {
            likes = likes.filter(() => {return true;})
            let like = likes.shift();
            let fields = {
                'activity': like.activity,
                'user_agent': ua.source,
                'ip_address': ip,
                'user_score': user_score
            };
            let updateArgs = [{
                'id': like.id,
                'fields': fields
            }];
    
            base(base_name).update(updateArgs, (err, records) => {
                if (err) {
                    helpers.apiError(res, err);
                    return;
                } else {
                    res.locals.likes = likes;
                    next();
                }
            });
        } else {
            let createArgs = [{
                'fields': {
                    'activity': [ activity_id ],
                    'user_agent': ua.source,
                    'ip_address': ip,
                    'user_score': user_score
                }
            }];
            base(base_name).create(createArgs, (err, records) => {
                if (err) {
                    helpers.apiError(res, err);
                    return;
                } else {
                    res.locals.likes = [];
                    next();
                }
                
            });
        }
    } else {
        // Invalid user_score
        helpers.apiError(res, createError(400, 'Invalid [user_score] value'));
        return;
    }
    
};