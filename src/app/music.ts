export interface Music {
    title: string;
    videoId: string;
    channelTitle: string;
    thumbnails: URL|string;
    date: Date;
    duration: string; // iso8601 format
    views: number;
    like: boolean;
    download: string; // in the future :P save mp3 files in database
    playlists: string[]; // list of playlists name as their unique ID
}
