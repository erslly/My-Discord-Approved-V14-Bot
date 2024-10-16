import type { SoundcloudTrackFilterV2, SoundcloudTrackSearchV2, SoundcloudTrackV2 } from "../types";
import { API } from "../API";
export declare class Tracks {
    private readonly api;
    private readonly resolve;
    constructor(api: API);
    /**
     * Searches for tracks using the v2 API.
     */
    searchV2: (params?: SoundcloudTrackFilterV2) => Promise<SoundcloudTrackSearchV2>;
    /**
     * Fetches a track from URL or ID using Soundcloud v2 API.
     */
    getV2: (trackResolvable: string | number) => Promise<SoundcloudTrackV2>;
    /**
     * Fetches tracks from an array of ID using Soundcloud v2 API.
     */
    getArrayV2: (trackIds: number[], keepOrder?: boolean) => Promise<SoundcloudTrackV2[]>;
    /**
     * Searches for tracks (web scraping)
     */
    searchAlt: (query: string) => Promise<SoundcloudTrackV2[]>;
    /**
     * Gets a track by URL (web scraping)
     */
    getAlt: (url: string) => Promise<SoundcloudTrackV2>;
    /**
     * Gets all related tracks of a track using the v2 API.
     */
    relatedV2: (trackResolvable: string | number, limit?: number) => Promise<SoundcloudTrackV2[]>;
}
