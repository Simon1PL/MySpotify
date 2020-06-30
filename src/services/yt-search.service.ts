import { Injectable } from '@angular/core';
import { Music } from 'src/app/music';
import { Subject, Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class YtSearchService {
  private nextPageToken: string;
  results: Music[] = [];
  private resultList = new Subject<Music[]>();

  getResults(): Music[] {
    return this.results;
  }
  getResultList(): Observable<Music[]> {
    return this.resultList.asObservable();
  }
  private setResultList() {
    this.resultList.next(this.results);
  }

  constructor(private httpService: HttpService) {
    window['gapi'.toString()]?.load('client:auth2', () => {
      window['gapi'.toString()].auth2.init({
        client_id: '559639076556-1tb7esmahomq1qg2m739jcaqe90ie05c.apps.googleusercontent.com',
        /* '694429461676-6ka7t7f3rkmumih6agavc162a9eb7okj.apps.googleusercontent.com', */
        events: {
          onReady: this.loadClient()
        }
      });
    });
  }

  private loadClient() {
    window['gapi'.toString()].client.setApiKey('AIzaSyDZYT0lJQGSSr3MEUDP-klf2gllrpUs1YA'/* 'AIzaSyDlKeUFJIuOtRvuKf7kuvvPAV3wZI0klgU' */);
    return window['gapi'.toString()].client.load('https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest')
      .then(() => { console.log('GAPI client loaded for API (YtSearchService ready)'); },
        (err) => { console.error('Error loading GAPI client for API', err); });
  }

  // YT Data api - Videos: list
  // It returns duration time and view count of given video (as promise), is used below in this.search()
  private getDetailInfo(videoItem: any): any {

    // uncomment this to dont waste limit and comment below!! limit: 10,000 cost of one this: 4(4*5=20)
    /* return {
      duration: limit2.items[0].contentDetails.duration,
      views: limit2.items[0].statistics.viewCount
    }; */
    return window['gapi'.toString()].client.youtube.videos.list({
      part: [
        'contentDetails,statistics'
      ],
      id: [
        videoItem.id.videoId
      ]
    })
      .then((response) => {
        // Handle the results here (response.result has the parsed body).
        console.log('Response', response);
        return {
          duration: response.result.items[0].contentDetails.duration,
          views: response.result.items[0].statistics.viewCount
        };
      },
        (err) => {
          console.error('Execute error', err);
          return {
            duration: limit2.items[0].contentDetails.duration,
            views: limit2.items[0].statistics.viewCount
          };
        });
  }

  // YT Data api - Search: list
  // arguments: text - searched phrase, token - next page token
  // assigns to this.results first 5 search results, if token is true just add 5 more results
  async search(text: string, token: boolean) {
    let error = false;
    if (text === '') { text = 'piosenki'; }
    this.setResultList();
    let searchResult: any;

    // uncomment this to dont waste limit and comment below!! limit: 10,000 cost of one this: 100
    /* searchResult = limitBle; */
    await window['gapi'.toString()].client.youtube.search.list({
      part: [
        'snippet'
      ],
      maxResults: 5,
      q: text,
      type: 'video',
      safeSearch: 'none',
      videoEmbeddable: true,
      pageToken: token ? this.nextPageToken : null
    }).then((respond) => {
      // Handle the results here (response.result has the parsed body).
      console.log('Response', this.results);
      searchResult = respond.result;
    },
      (err) => {
        console.error('Execute error', err);
        if (!token) {
          this.results = limitExceded;
        }
        else {
          this.results = this.results.concat(limitExceded);
        }
        error = true;
        this.nextPageToken = 'limitExceded';
      });
    if (!error) {
    const length = this.results.length;
    if (token === false) { while (this.results.length) { this.results.pop(); } }
    searchResult.items.forEach(async (item, index) => {
      const videoDetail = await this.getDetailInfo(item);
      if (token === true) {
        this.results[index + length] = (this.createMusic(item, videoDetail));
      }
      else {
        this.results[index] = (this.createMusic(item, videoDetail));
      }
    });
    this.nextPageToken = searchResult.nextPageToken;
    }
    this.setResultList();
  }

  private createMusic(item: any, details: { duration: string, views: number }): Music {
    while (item.snippet.title.indexOf('&quot;') !== -1) {
      item.snippet.title = item.snippet.title.replace('&quot;', '\"');
    }
    return {
      title: item.snippet.title,
      videoId: item.id.videoId,
      channelTitle: item.snippet.channelTitle,
      thumbnails: item.snippet.thumbnails.medium.url,
      date: item.snippet.publishedAt,
      duration: details.duration,
      views: details.views,
      like: false,
      playlists: [],
      download: null
    };
  }

}

// to load date when limit is reached (YT api has limit to 100,000 request per day or sth like that)
const limitExceded = [
  {channelTitle: 'Ziejsonek1',
  date: new Date('2010-07-30T13:01:04Z'),
  download: null,
  duration: 'PT3M42S',
  like: false,
  playlists: [],
  thumbnails: 'https://i.ytimg.com/vi/Qu_1c57gLH0/mqdefault.jpg',
  title: 'Rotary - Lubiła Tańczyć',
  videoId: 'Qu_1c57gLH0',
  views: 35591826},
  {channelTitle: 'santao111',
  date: new Date('2008-02-26T16:08:20Z'),
  download: null,
  duration: 'PT3M41S',
  like: false,
  playlists: [],
  thumbnails: 'https://i.ytimg.com/vi/vSv6w4tyQXs/mqdefault.jpg',
  title: 'ROTARY - Na jednej z dzikich plaż',
  videoId: 'vSv6w4tyQXs',
  views: 2511816
  },
  {channelTitle: 'MyMusic',
  date: new Date('2009-05-08T14:59:35Z'),
  download: null,
  duration: 'PT4M14S',
  like: false,
  playlists: [],
  thumbnails: 'https://i.ytimg.com/vi/X_NfwMopzWM/mqdefault.jpg',
  title: 'Rotary - Pomyśl o mnie jeden raz',
  videoId: 'X_NfwMopzWM',
  views: 227660},
  {channelTitle: 'Rotary',
  date: new Date('2020-06-20T14:45:00Z'),
  download: null,
  duration: 'PT1H58M30S',
  like: false,
  playlists: [],
  thumbnails: 'https://i.ytimg.com/vi/NRQqlPbQdE0/mqdefault.jpg',
  title: 'General Session 1 - Together, We Connect | 2020 Rotary Virtual Convention',
  videoId: 'NRQqlPbQdE0',
  views: 84096},
  {channelTitle: 'AdamC3046',
  date: new Date('2018-12-01T20:36:28Z'),
  download: null,
  duration: 'PT15M34S',
  like: false,
  playlists: [],
  thumbnails: 'https://i.ytimg.com/vi/0OGsMvR2e28/mqdefault.jpg',
  title: 'BEST-OF Rotary Sounds 2018!',
  videoId: '0OGsMvR2e28',
  views: 614188}
];

const limit2 = {
  kind: 'youtube#videoListResponse',
  etag: '7M_Utb44aI9PmocfuQoajrJ59jo',
  items: [
    {
      kind: 'youtube#video',
      etag: '77-QgRrOjn4TpSsm6jhmGNU6iNQ',
      id: 'Ks-_Mh1QhMc',
      contentDetails: {
        duration: 'PT21M3S',
        dimension: '2d',
        definition: 'hd',
        caption: 'true',
        licensedContent: true,
        contentRating: {},
        projection: 'rectangular'
      },
      statistics: {
        viewCount: '18171337',
        likeCount: '259065',
        dislikeCount: '5105',
        favoriteCount: '0',
        commentCount: '8128'
      }
    }
  ],
  pageInfo: {
    totalResults: 1,
    resultsPerPage: 1
  }
};