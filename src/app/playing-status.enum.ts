// why create this enum when i have window['YT'].PlayerState?
// 1. every time i change player state i need to check information about which video is playing (videoId)
// 2. this is more readable
// 3. on the other hand window['YT'].PlayerState could be a little safer (you can't assign wrong state)
// 4. so dont know why but i did it :D
export enum PlayingStatus {
    Playing,
    Paused, // this is when video id paused or ended
    Loading,
    NotIn
}
