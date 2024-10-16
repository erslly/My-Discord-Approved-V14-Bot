<div align="center">
  <p>
    <a href="https://nodei.co/npm/@distube/soundcloud"><img src="https://nodei.co/npm/@distube/soundcloud.png?downloads=true&downloadRank=true&stars=true"></a>
  </p>
  <p>
    <img alt="npm peer dependency version" src="https://img.shields.io/npm/dependency-version/@distube/soundcloud/peer/distube?style=flat-square">
    <img alt="npm" src="https://img.shields.io/npm/dt/@distube/soundcloud?logo=npm&style=flat-square">
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/distubejs/extractor-plugins?logo=github&logoColor=white&style=flat-square">
    <a href="https://discord.gg/feaDd9h"><img alt="Discord" src="https://img.shields.io/discord/732254550689316914?logo=discord&logoColor=white&style=flat-square"></a>
  </p>
  <p>
    <a href='https://ko-fi.com/skick' target='_blank'><img height='48' src='https://storage.ko-fi.com/cdn/kofi3.png' alt='Buy Me a Coffee at ko-fi.com' /></a>
  </p>
</div>

# @distube/soundcloud

A DisTube extractor plugin for supporting SoundCloud.

## Feature

- Using SoundCloud API
- Support SoundCloud tracks, albums and playlists
- Search tracks/playlists on SoundCloud
- Play tracks directly from SoundCloud

## Installation

```sh
npm install @distube/soundcloud@latest
```

## Usage

### Plugin

```ts
import { Client } from "discord.js";
import { DisTube } from "distube";
import { SoundCloudPlugin } from "@distube/soundcloud";

const client = new Client();

const distube = new DisTube(client, {
  plugins: [new SoundCloudPlugin()],
});
```

### Search

```ts
const scPlugin = new SoundCloudPlugin();
scPlugin.search("A SoundCloud Playlist", "playlist", 3);
```

## Documentation

### new SoundCloudPlugin([SoundCloudPluginOptions])

- `SoundCloudPluginOptions.clientId` [string] _(optional)_: Your account's client id.
- `SoundCloudPluginOptions.oauthToken` [string] _(optional)_: Your account's oauth token. Used to fetch more data with SoundCloud Go+ account.
- How to get `clientId` and `oauthToken`? [See here](https://github.com/Tenpi/soundcloud.ts#getting-started)

#### Example

```js
new SoundCloudPlugin({
  clientId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  oauthToken: "0-000000-000000000-xxxxxxxxxxxxxx",
});
```

### SoundCloudPlugin#search(query, [type], [limit])

Searches for the given query on SoundCloud.

- Parameters

  - `query` [string] Search query.
  - `type` [string]: Type of results (`track` or `playlist`). Default is `track`.
  - `limit` [integer]: Limit the results. Default is `10`.

- Returns a `Promise<Song[]|Playlist[]>`
  - Returns a `Promise<Song[]>` if `type` parameter is `track`
  - Returns a `Promise<Playlist[]>` if `type` parameter is `playlist`
