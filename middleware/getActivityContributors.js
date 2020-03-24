require('dotenv').config();
const airtable = require('airtable');
const api_key = process.env.AIRTABLE_API_KEY;
const api_base = process.env.AIRTABLE_BASE;

//Connect to Airtable
const base = new airtable({ apiKey: api_key }).base(api_base);

module.exports = function(req, res, next) {
  let contributors = [];
  let activity = res.locals.activity;
  let searchContributors = null;
  let formula = null;

  if (
    typeof activity === 'object' &&
    activity.hasOwnProperty('contributors') &&
    activity.contributors !== undefined
  ) {
    searchContributors = activity.contributors;
    delete activity.contributors;
  } else {
    next();
  }

  if (typeof searchContributors === 'string') {
    searchContributors = [searchContributors];
  }

  if (Array.isArray(searchContributors) && searchContributors.length > 0) {
    searchContributors = searchContributors.join(',');
    formula = `SEARCH(RECORD_ID(), '${searchContributors}')`;

    base('contributors')
      .select({
        view: 'Grid view',
        filterByFormula: formula
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(record => {
            contributor = record.fields;
            contributor.id = record.getId();
            contributors.push(contributor);
          });
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            next(err);
          }
          if (contributors.length > 0) {
            activity.contributors = contributors;
          }
          res.locals.activity = activity;
          next();
        }
      );
  }
};
