
module.exports = function(req, res) {
    var activity = res.locals.activity;
    console.log(res.locals);
    var data = { success: false, message: 'Unknown error' };
    var status = 500;

    res.setHeader('Content-Type', 'application/json');

    if (typeof activity === 'object') {
        status = 201;
        data = {
            success: true,
            data: activity
        };
    }

    res.status(status).send(JSON.stringify(data));
};