module.exports = function(req, res) {
    let score_data = res.locals.score_data;
    let data = { success: false, message: 'Unknown error' };
    let status = 500;
  
    res.setHeader('Content-Type', 'application/json');
  
    if (typeof score_data === 'object') {
      status = 201;
      data = {
        success: true,
        data: score_data
      };
    } else if (score_data === undefined) {
      status = 400;
      data = {
        success: false,
        data: 'Could not retreive score data.'
      };
    }
    res.status(status).send(JSON.stringify(data));
  };
  