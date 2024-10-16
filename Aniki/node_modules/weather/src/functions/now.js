module.exports = async (api, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await api.get(`${api.auth.base}/weather/1.0/report.json?${api.auth.uri}&product=observation&name=${encodeURIComponent(location)}`);

            if (data.statusCode === 404) {
                return reject({
                    status: 404,
                    message: 'Not Found'
                });
            } else {
                return resolve(data.body.observations.location[0].observation[0]);
            }
        } catch(err) {
            return reject(err);
        }
    });
}