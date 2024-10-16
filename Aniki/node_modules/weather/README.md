[![install size](https://packagephobia.now.sh/badge?p=weather)](https://packagephobia.now.sh/result?p=weather)  

# node-weather
Weather is a node module that makes it easy to get the weather for anywhere in the world.

## Install
You can install Weather from npm or yarn:
```
npm install weather
yarn add weather
```

## Getting started
Weather uses the here.com weather API. You'll need an appID and appCode from here.com before using the Weather module. When you have them, import the module, and pass them through.

### Getting a here.com appID and appCode
Click [here](https://developer.here.com/plans?create=Freemium-Basic&keepState=true&step=account) to create a free here.com account. Once finished and confirmed, get your appID and appCode.

### Example
Here's a quick example of getting the weather for Brisbane, Australia:
```js
const Weather = require('weather');

const appID = ''; // here.com appID
const appCode = ''; // here.com appCode

const weather = new Weather({
    appID,
    appCode
});

// now(<location>) returns a Promise
weather.now('Brisbane, Australia').then((results) => {
    console.log(results);
});
```

## Licence
(c) 2019 ThatTonybo. Licenced under the GNU GPL v3 license, do not modify and republish without explicit permission.