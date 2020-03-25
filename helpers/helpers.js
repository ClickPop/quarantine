module.exports = {
    validateRecordID: (string) => {
        return (typeof string === 'string'
            && string.length > 10
            && string.length < 20
            && string.indexOf('rec') === 0);
    },
    validateLikeType: (value, get = false) => {
        const upValues = ["up", "thumbs-up", "like", "1", "yay"];
        const downValues = ["down", "thumbs-down", "dislike", "-1", "boo"];
        const removeValues = ["remove", "delete", "0", "unlike", "undislike", "meh"];
        let rVal = false;
        
        get = (typeof get === 'boolean') ? get : false;

        switch (typeof value) {
            case "string":
                if (upValues.includes(value)) {
                    if (get === true) {
                        rVal = 1;
                    } else {
                        rVal = true;
                    }
                } else if (downValues.includes(value)) {
                    if (get === true) {
                        rVal = -1;
                    } else {
                        rVal = true;
                    }
                } else if (removeValues.includes(value)) {
                    if (get === true) {
                        rVal = 0;
                    } else {
                        rVal = true;
                    }
                } else {
                    rVal = false;
                }
                break;
            case "number":
                if (value === 1 || value === -1 || value === 0) {
                    if (get === true) {
                        rVal = value;
                    }
                    rVal = true;
                } else {
                    rVal = false;
                }
                break;
            default:
                rVal = false;
        }

        return rVal;
    },
    apiError: (res, err) => {
        let data = { success: false, message: 'Unknown error' };
        let status = 500;
  
        res.setHeader('Content-Type', 'application/json');

        if (typeof err === 'object') {
            if (err.hasOwnProperty('status')) {
                status = err.status;
            }
            if (err.hasOwnProperty('message')) {
                data.message = err.message
            }
        }

        res.status(status).send(JSON.stringify(data));
    }
};