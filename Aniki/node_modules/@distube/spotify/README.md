<div align="center">
  <p>
    <a href="https://nodei.co/npm/@distube/spotify"><img src="https://nodei.co/npm/@distube/spotify.png?downloads=true&downloadRank=true&stars=true"></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/@distube/spotify"><img alt="npm peer dependency version" src="https://img.shields.io/npm/dependency-version/@distube/spotify/peer/distube?style=flat-square"></a>
    <a href="https://nodei.co/npm/@distube/spotify"><img alt="npm" src="https://img.shields.io/npm/dt/@distube/spotify?logo=npm&style=flat-square"></a>
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/distubejs/extractor-plugins?logo=github&logoColor=white&style=flat-square">
    <a href="https://discord.gg/feaDd9h"><img alt="Discord" src="https://img.shields.io/discord/732254550689316914?logo=discord&logoColor=white&style=flat-square"></a>
  </p>
  <p>
    <a href='https://ko-fi.com/skick' target='_blank'><img height='48' src='https://storage.ko-fi.com/cdn/kofi3.png' alt='Buy Me a Coffee at ko-fi.com' /></a>
  </p>
</div>

# @distube/spotify

A DisTube info extractor plugin for supporting Spotify.

[_What is an info extractor plugin?_](https://github.com/skick1234/DisTube/wiki/Projects-Hub#plugins)

## Usage

```js
const Discord = require("discord.js");
const client = new Discord.Client();

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const distube = new DisTube(client, {
  plugins: [new SpotifyPlugin()],
});
```

## Documentation

### SpotifyPlugin([SpotifyPluginOptions])

- `SpotifyPluginOptions.api`: (Optional) Spotify API credentials.
  - `SpotifyPluginOptions.api.clientId`: Client ID of your Spotify application (Optional - Used when the plugin cannot get the credentials automatically)
  - `SpotifyPluginOptions.api.clientSecret`: Client Secret of your Spotify application (Optional - Used when the plugin cannot get the credentials automatically)
  - `SpotifyPluginOptions.api.topTracksCountry`: Country code of the top artist tracks (ISO 3166-1 alpha-2 country code). Default is `US`.

#### Example

```js
new SpotifyPlugin({
  api: {
    clientId: "SpotifyAppClientID",
    clientSecret: "SpotifyAppClientSecret",
    topTracksCountry: "VN",
  },
});
```
