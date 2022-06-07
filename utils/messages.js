const moment = require('moment');
function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().add(1, 'hours').format('hh:mm A')
    }
}


module.exports = formatMessage;