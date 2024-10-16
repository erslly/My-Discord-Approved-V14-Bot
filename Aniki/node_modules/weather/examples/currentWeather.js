const Weather = require('../src/index');

const appID = '';
const appCode = '';

const weather = new Weather({
    appID,
    appCode
});

weather.now('Brisbane, Australia').then((results) => {
    console.log(results);
});