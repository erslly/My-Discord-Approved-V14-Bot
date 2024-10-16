"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Soundcloud = void 0;
var API_1 = require("./API");
var entities_1 = require("./entities");
/**
 * The main class for interacting with the Soundcloud API.
 */
var Soundcloud = /** @class */ (function () {
    function Soundcloud(clientId, oauthToken, options) {
        this.api = new API_1.API(Soundcloud.clientId, Soundcloud.oauthToken);
        this.apps = new entities_1.Apps(this.api);
        this.comments = new entities_1.Comments(this.api);
        this.me = new entities_1.Me(this.api);
        this.oembed = new entities_1.Oembed(this.api);
        this.playlists = new entities_1.Playlists(this.api);
        this.resolve = new entities_1.Resolve(this.api);
        this.tracks = new entities_1.Tracks(this.api);
        this.users = new entities_1.Users(this.api);
        this.util = new entities_1.Util(this.api);
        if (clientId) {
            Soundcloud.clientId = clientId;
            if (oauthToken)
                Soundcloud.oauthToken = oauthToken;
        }
        if (options === null || options === void 0 ? void 0 : options.proxy)
            Soundcloud.proxy = options.proxy;
        this.api = new API_1.API(Soundcloud.clientId, Soundcloud.oauthToken, Soundcloud.proxy);
        this.apps = new entities_1.Apps(this.api);
        this.comments = new entities_1.Comments(this.api);
        this.me = new entities_1.Me(this.api);
        this.oembed = new entities_1.Oembed(this.api);
        this.playlists = new entities_1.Playlists(this.api);
        this.resolve = new entities_1.Resolve(this.api);
        this.tracks = new entities_1.Tracks(this.api);
        this.users = new entities_1.Users(this.api);
        this.util = new entities_1.Util(this.api);
    }
    return Soundcloud;
}());
exports.Soundcloud = Soundcloud;
__exportStar(require("./entities"), exports);
__exportStar(require("./types"), exports);
__exportStar(require("./API"), exports);
exports.default = Soundcloud;
module.exports.default = Soundcloud;
