"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tracks = void 0;
var index_1 = require("./index");
var undici_1 = require("undici");
var Tracks = /** @class */ (function () {
    function Tracks(api) {
        var _this = this;
        this.api = api;
        this.resolve = new index_1.Resolve(this.api);
        /**
         * Searches for tracks using the v2 API.
         */
        this.searchV2 = function (params) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.getV2("search/tracks", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        }); };
        /**
         * Fetches a track from URL or ID using Soundcloud v2 API.
         */
        this.getV2 = function (trackResolvable) { return __awaiter(_this, void 0, void 0, function () {
            var trackID, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resolve.getV2(trackResolvable)];
                    case 1:
                        trackID = _a.sent();
                        return [4 /*yield*/, this.api.getV2("/tracks/".concat(trackID))];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        }); };
        /**
         * Fetches tracks from an array of ID using Soundcloud v2 API.
         */
        this.getArrayV2 = function (trackIds_1) {
            var args_1 = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args_1[_i - 1] = arguments[_i];
            }
            return __awaiter(_this, __spreadArray([trackIds_1], args_1, true), void 0, function (trackIds, keepOrder) {
                var chunks, i, response, tracks, result;
                var _this = this;
                if (keepOrder === void 0) { keepOrder = false; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (trackIds.length === 0)
                                return [2 /*return*/, []
                                    // Max 50 ids per request => split into chunks of 50 ids
                                ];
                            chunks = [];
                            i = 0;
                            while (i < trackIds.length)
                                chunks.push(trackIds.slice(i, (i += 50)));
                            response = [];
                            return [4 /*yield*/, Promise.all(chunks.map(function (chunk) { return _this.api.getV2("/tracks", { ids: chunk.join(",") }); }))];
                        case 1:
                            tracks = _a.sent();
                            result = response.concat.apply(response, tracks);
                            if (keepOrder)
                                return [2 /*return*/, result.sort(function (a, b) { return trackIds.indexOf(a.id) - trackIds.indexOf(b.id); })];
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        /**
         * Searches for tracks (web scraping)
         */
        this.searchAlt = function (query) { return __awaiter(_this, void 0, void 0, function () {
            var headers, html, urls, scrape, i, songHTML, json, track;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        headers = this.api.headers;
                        return [4 /*yield*/, (0, undici_1.request)("https://soundcloud.com/search/sounds?q=".concat(query), { headers: headers }).then(function (r) { return r.body.text(); })];
                    case 1:
                        html = _b.sent();
                        urls = (_a = html.match(/(?<=<li><h2><a href=")(.*?)(?=">)/gm)) === null || _a === void 0 ? void 0 : _a.map(function (u) { return "https://soundcloud.com".concat(u); });
                        if (!urls)
                            return [2 /*return*/, []];
                        scrape = [];
                        i = 0;
                        _b.label = 2;
                    case 2:
                        if (!(i < urls.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, (0, undici_1.request)(urls[i], { headers: headers }).then(function (r) { return r.body.text(); })];
                    case 3:
                        songHTML = _b.sent();
                        json = JSON.parse(songHTML.match(/(\[{)(.*)(?=;)/gm)[0]);
                        track = json[json.length - 1].data;
                        scrape.push(track);
                        _b.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, scrape];
                }
            });
        }); };
        /**
         * Gets a track by URL (web scraping)
         */
        this.getAlt = function (url) { return __awaiter(_this, void 0, void 0, function () {
            var headers, songHTML, json, track;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!url.startsWith("https://soundcloud.com/"))
                            url = "https://soundcloud.com/".concat(url);
                        headers = this.api.headers;
                        return [4 /*yield*/, (0, undici_1.request)(url, { headers: headers }).then(function (r) { return r.body.text(); })];
                    case 1:
                        songHTML = _a.sent();
                        json = JSON.parse(songHTML.match(/(\[{)(.*)(?=;)/gm)[0]);
                        track = json[json.length - 1].data;
                        return [2 /*return*/, track];
                }
            });
        }); };
        /**
         * Gets all related tracks of a track using the v2 API.
         */
        this.relatedV2 = function (trackResolvable, limit) { return __awaiter(_this, void 0, void 0, function () {
            var trackID, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resolve.getV2(trackResolvable)];
                    case 1:
                        trackID = _a.sent();
                        return [4 /*yield*/, this.api.getV2("/tracks/".concat(trackID, "/related"), { limit: limit })];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.collection];
                }
            });
        }); };
    }
    return Tracks;
}());
exports.Tracks = Tracks;
