const moment = require('moment');
function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('LTS')
    }
}


module.exports = formatMessage;