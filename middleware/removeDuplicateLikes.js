require('dotenv').config();
const createError = require('http-errors');
const airtable = require('airtable');
const api_key = process.env.AIRTABLE_API_KEY;
const api_base = process.env.AIRTABLE_BASE;
const helpers = require('../helpers/helpers');

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base(api_base);

module.exports = (req, res, next) => {
    let likes = res.locals.likes;
    
    let base_name = (req.app.get('env') === 'production') ? 'likes' : 'dev-likes';
    if (Array.isArray(likes) && likes.length > 0) {
        let deleteArgs = [];
        likes.forEach((like, index) => {
            if (index < 10
            && typeof like === 'object' 
            && like.hasOwnProperty('id')) {
                deleteArgs.push(like.id);
            }
        });

        base(base_name).destroy(deleteArgs, (err, records) => {
            if (err) {
                helpers.apiError(res, err);
                return;
            } else {
                next();
            }
        });
    } else {
        next();
    }
};