import type { SoundcloudPlaylistFilterV2, SoundcloudPlaylistSearchV2, SoundcloudPlaylistV2 } from "../types";
import { API } from "../API";
export declare class Playlists {
    private readonly api;
    private readonly tracks;
    private readonly resolve;
    constructor(api: API);
    /**
     * Return playlist with all tracks fetched.
     */
    fetch: (playlist: SoundcloudPlaylistV2) => Promise<SoundcloudPlaylistV2>;
    /**
     * Searches for playlists using the v2 API.
     */
    searchV2: (params?: SoundcloudPlaylistFilterV2) => Promise<SoundcloudPlaylistSearchV2>;
    /**
     * Fetches a playlist from URL or ID using Soundcloud v2 API.
     */
    getV2: (playlistResolvable: string | number) => Promise<SoundcloudPlaylistV2>;
    /**
     * Searches for playlists (web scraping)
     */
    searchAlt: (query: string) => Promise<SoundcloudPlaylistV2[]>;
    /**
     * Gets a playlist by URL (web scraping)
     */
    getAlt: (url: string) => Promise<SoundcloudPlaylistV2>;
}
