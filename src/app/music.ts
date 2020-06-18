import { Url } from 'url';

export interface Music {
    title: string;
    videoId: string;
    channelTitle: string;
    thumbnails: Url;
    date: Date;
    duration: string; // iso8601 format
    views: number;
}
