import type { SoundcloudOembedFilter } from "../types";
import { API } from "../API";
export declare class Oembed {
    private readonly api;
    constructor(api: API);
    /**
     * Gets the Oembed for a track, playlist, or user.
     */
    get: (params: SoundcloudOembedFilter) => Promise<string>;
}
