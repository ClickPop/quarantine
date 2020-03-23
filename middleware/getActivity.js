require('dotenv').config();
const airtable = require('airtable');
const api_key = process.env.AIRTABLE_API_KEY;
const api_base = process.env.AIRTABLE_BASE;

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base(api_base);

module.exports = function(req, res, next) {
  var { type, audience, free, pastResults } = req.body;
  var formula = false;
  var formulaParts = ['{approved} = 1'];
  var selectArgs = {};
  var activities = [];
  var pastResults = [];

  if (typeof free !== 'undefined' && free === 'true') {
    formulaParts.push(`{is_free} = 1`);
  }
  if (typeof type === 'string' && type.length > 0) {
    formulaParts.push(`FIND('${type}', ARRAYJOIN({type_ids}, ', '))`);
  }
  if (typeof audience === 'string' && audience.length > 0) {
    formulaParts.push(`FIND('${audience}', ARRAYJOIN({audience_ids}, ', '))`);
  }
  if (req.params.id !== undefined) {
    formulaParts.push(`RECORD_ID() = '${req.params.id}'`);
  }
  if (req.body.pastResults !== undefined 
    && Array.isArray(req.body.pastResults)
    && req.body.pastResults.length > 0) {
    pastResults = req.body.pastResults;
  }
  console.log('Past Results <post init>', pastResults);
  selectArgs.view = 'Grid view';
  if (formulaParts.length > 0) {
    selectArgs.filterByFormula = `AND(${formulaParts.join(', ')})`;
  }

  base('activities')
    .select(selectArgs)
    .eachPage(
      function page(records, fetchNextPage) {
        records.forEach(function(record) {
          tempActivity = {
            id: record.getId(),
            title: record.fields.activity,
            description: record.fields.description,
            url: record.fields.url,
            free: record.fields.is_free,
            approved: record.fields.approved
          };
          tempActivity.contributors = record.fields.contributor;

          activities.push(tempActivity);
        });
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          next(err);
        }

        let exists;
        let allUsed = true;
        let checkPastResults = false;
        let allowedActivities = [];

        if (
          Array.isArray(pastResults) &&
          pastResults.length > 0
        ) { checkPastResults = true; }
        console.log('check past results?', checkPastResults);
          
        if (checkPastResults) {
          activities.forEach((tempActivity, tempActivityIndex) => {
            if (pastResults.indexOf(tempActivity.id) === -1) {
              allUsed = false;
              allowedActivities.push(tempActivityIndex);
              console.log(tempActivity.id, 'allowed');
            } else {
              console.log(tempActivity.id, 'NOT allowed');
            }
          });
        }

        if (checkPastResults && res.locals.activity !== undefined) {
          if (allUsed) {
            exists = false;
          } else if (pastResults.indexOf(res.locals.activity.id) === -1) {
            let index = Math.round(Math.random() * (allowedActivities.length - 1));
            res.locals.activity = 
              activities[Math.round(Math.random() * (allowedActivities.length - 1))];
          }
        } else {
          res.locals.activity =
            activities[Math.round(Math.random() * (activities.length - 1))];
        }

        next();
      }
    );
};
