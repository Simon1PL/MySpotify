export interface Music {
    title: string;
    videoId: string;
    channelTitle: string;
    thumbnails: URL|string;
    date: Date;
    duration: string; // iso8601 format
    views: number;
}
