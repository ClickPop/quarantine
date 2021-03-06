module.exports = function(req, res) {
  let activity = res.locals.activity;
  let data = { success: false, message: 'Unknown error' };
  let status = 500;

  res.setHeader('Content-Type', 'application/json');

  if (typeof activity === 'object') {
    status = 201;
    data = {
      success: true,
      data: activity
    };
  } else if (activity === undefined) {
    status = 404;
    data = {
      success: false,
      data: 'No activity found'
    };
  }
  res.status(status).send(JSON.stringify(data));
};
