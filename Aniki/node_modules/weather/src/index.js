const constants = require('./constants');
const phin = require('phin');

const Now = require('./functions/now');

module.exports = class Weather {
    constructor(options) {
        if (!options || typeof (options) != 'object') throw constants.ERRORS.NO_OPTIONS_PROVIDED;
        if (!options.appID || typeof (options.appID) != 'string') throw constants.ERRORS.NO_APPID_PROVIDED;
        if (!options.appCode || typeof (options.appCode) != 'string') throw constants.ERRORS.NO_APPCODE_PROVIDED;

        this.auth = {
            appID: options.appID,
            appCode: options.appCode,
            base: `https://weather.api.here.com`,
            uri: `app_id=${encodeURIComponent(options.appID)}&app_code=${encodeURIComponent(options.appCode)}`
        }
        
        this.get = phin.defaults({
            method: 'GET',
            parse: 'json',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async now(location = '') {
        return new Promise(async (resolve, reject) => {
            if (!location || typeof (location) != 'string') return reject(constants.ERRORS.NO_LOCATION_PROVIDED);

            try {
                const res = Now(this, location);
                return resolve(res);
            } catch(err) {
                return reject(err);
            }
        });
    }
}