
module.exports = function(req, res) {
    var activities = res.locals.activities;
    console.log(res.locals);
    var data = { success: false, message: 'Unknown error' };
    var status = 500;

    res.setHeader('Content-Type', 'application/json');

    if (typeof activities === 'object') {
        status = 201;
        data = {
            success: true,
            data: activities
        };
    }

    res.status(status).send(JSON.stringify(data));
};