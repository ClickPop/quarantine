require('dotenv').config();
const createError = require('http-errors');
const airtable = require('airtable');
const api_key = process.env.AIRTABLE_API_KEY;
const api_base = process.env.AIRTABLE_BASE;
const helpers = require('../helpers/helpers');

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base(api_base);

module.exports = (req, res, next) => {
    let activity_id = (typeof res.locals.activity_id !== 'undefined') ? res.locals.activity_id : req.params.id;
    let user_score = res.locals.user_score;
    let field_name = (req.app.get('env') === 'production') ? 'current_score' : 'dev_current_score';
    let score_data = { id: activity_id, user_score: user_score }

    if (helpers.validateRecordID(activity_id)) {
        base('activities').find(activity_id, (err, record) => {
            if (err) { 
                helpers.apiError(res, err); 
                return; 
            }
            
            if (typeof record === 'object'
            && record.hasOwnProperty('fields')
            && record.fields.hasOwnProperty(field_name)) {
                score_data.current_score = record.fields[field_name];
            } else {
                score_data.current_score = false
            }

            res.locals.score_data = score_data;
            next();
        });
    } else {
        // invalid activity_id
        helpers.apiError(res, createError(400, 'Invalid [activity_id] value submitted'));
        return;
    }
};