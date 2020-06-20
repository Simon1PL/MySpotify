import { Injectable } from '@angular/core';
import { Music } from 'src/app/music';
import { Subject, Observable } from 'rxjs';

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

  constructor() {
    window['gapi'.toString()]?.load('client:auth2', () => {
      window['gapi'.toString()].auth2.init({
        client_id: '559639076556-gm40i1bq280ukks6c1cpp5fjd45r5fjh.apps.googleusercontent.com',
        events: {
          onReady: this.loadClient()
        }
      });
    });
  }

  private loadClient() {
    window['gapi'.toString()].client.setApiKey('AIzaSyAyAGXF70GiuS0UmVzSfd-oj2HTaFTl8TY'); // AIzaSyANLfneVXla87P6kcHGMpQ1_oG8dg3lvBA
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
        searchResult = limitBle;
      });

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
const limitBle = {
  kind: 'youtube#searchListResponse',
  etag: 'nOfJLGnFdGI4hZczUSjoMEvxaB0',
  nextPageToken: 'CAoQAA',
  regionCode: 'PL',
  pageInfo: {
    totalResults: 1000000,
    resultsPerPage: 10
  },
  items: [
    {
      kind: 'youtube#searchResult',
      etag: 'NtBXg4B4w0trK0tOBfAeFIBHHaY',
      id: {
        kind: 'youtube#video',
        videoId: 'rtyfH-WXDRk'
      },
      snippet: {
        publishedAt: '2020-05-01T15:07:13Z',
        channelId: 'UClm3zvzYNqeVwpzFGsDUOkg',
        title: 'Taco Hemingway #hot16challenge2',
        description: 'Lekarzu, lekarko, pielęgniarzu, pielęgniarko; cały personelu medyczny — dziękujemy z całego serca. My, raperzyny, możemy pomóc tylko tak jak umiemy ...',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/rtyfH-WXDRk/default.jpg',
            width: 120,
            height: 90
          },
          medium: {
            url: 'https://i.ytimg.com/vi/rtyfH-WXDRk/mqdefault.jpg',
            width: 320,
            height: 180
          },
          high: {
            url: 'https://i.ytimg.com/vi/rtyfH-WXDRk/hqdefault.jpg',
            width: 480,
            height: 360
          }
        },
        channelTitle: 'Taco Hemingway',
        liveBroadcastContent: 'none',
        publishTime: '2020-05-01T15:07:13Z'
      }
    },
    {
      kind: 'youtube#searchResult',
      etag: 'ts7o82DbP5N86ChAP0kghpTlWIk',
      id: {
        kind: 'youtube#video',
        videoId: '3ah4t1P9yFA'
      },
      snippet: {
        publishedAt: '2019-07-23T20:03:05Z',
        channelId: 'UClm3zvzYNqeVwpzFGsDUOkg',
        title: 'Taco Hemingway - W PIĄTKI LEŻĘ W WANNIE feat. Dawid Podsiadło (prod. Borucci)',
        description: 'POCZTÓWKA Z WWA, LATO \'19 Oto kilka opowieści z Warszawy. Ode mnie, dla was. Niechaj umili wam to kolejne burzliwe lato. Utwór dostępny na platformach ...',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/3ah4t1P9yFA/default.jpg',
            width: 120,
            height: 90
          },
          medium: {
            url: 'https://i.ytimg.com/vi/3ah4t1P9yFA/mqdefault.jpg',
            width: 320,
            height: 180
          },
          high: {
            url: 'https://i.ytimg.com/vi/3ah4t1P9yFA/hqdefault.jpg',
            width: 480,
            height: 360
          }
        },
        channelTitle: 'Taco Hemingway',
        liveBroadcastContent: 'none',
        publishTime: '2019-07-23T20:03:05Z'
      }
    },
    {
      kind: 'youtube#searchResult',
      etag: 'NcsMwpNUi5lJkp_vROSbvo8SU8w',
      id: {
        kind: 'youtube#video',
        videoId: 'vuMiAmMdpdE'
      },
      snippet: {
        publishedAt: '2020-05-04T22:52:30Z',
        channelId: 'UClm3zvzYNqeVwpzFGsDUOkg',
        title: 'TACONAFIDE #hot16challenge2',
        description: 'Zbiórka: https://www.siepomaga.pl/hot16challenge bit: Urb rapik: @quebahombre & @tacohemingway realizacja, mix & master: Jan Kwapisz ...',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/vuMiAmMdpdE/default.jpg',
            width: 120,
            height: 90
          },
          medium: {
            url: 'https://i.ytimg.com/vi/vuMiAmMdpdE/mqdefault.jpg',
            width: 320,
            height: 180
          },
          high: {
            url: 'https://i.ytimg.com/vi/vuMiAmMdpdE/hqdefault.jpg',
            width: 480,
            height: 360
          }
        },
        channelTitle: 'Taco Hemingway',
        liveBroadcastContent: 'none',
        publishTime: '2020-05-04T22:52:30Z'
      }
    },
    {
      kind: 'youtube#searchResult',
      etag: 'f679hGdZOjirYumy52378gVNjiU',
      id: {
        kind: 'youtube#video',
        videoId: 'PCQs3vSJ6xA'
      },
      snippet: {
        publishedAt: '2016-07-05T17:52:55Z',
        channelId: 'UClm3zvzYNqeVwpzFGsDUOkg',
        title: 'Taco Hemingway - &quot;Deszcz na betonie&quot; (prod. Rumak)',
        description: 'Wideo: takie.pany (Tomasz Domański, Mikołaj Olizar-Zakrzewski), Łukasz Partyka Produkcja: Rumak Mastering: Eprom Sounds Studio Rap: Taco ...',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/PCQs3vSJ6xA/default.jpg',
            width: 120,
            height: 90
          },
          medium: {
            url: 'https://i.ytimg.com/vi/PCQs3vSJ6xA/mqdefault.jpg',
            width: 320,
            height: 180
          },
          high: {
            url: 'https://i.ytimg.com/vi/PCQs3vSJ6xA/hqdefault.jpg',
            width: 480,
            height: 360
          }
        },
        channelTitle: 'Taco Hemingway',
        liveBroadcastContent: 'none',
        publishTime: '2016-07-05T17:52:55Z'
      }
    },
    {
      kind: 'youtube#searchResult',
      etag: 'FS84F4YfZGcpkfChV9Oa-NJ69y8',
      id: {
        kind: 'youtube#video',
        videoId: 'O2wWRAW2Rhg'
      },
      snippet: {
        publishedAt: '2019-07-23T20:04:03Z',
        channelId: 'UClm3zvzYNqeVwpzFGsDUOkg',
        title: 'Taco Hemingway - LECI NOWY FUTURE (prod. 2K &amp; Sergiusz)',
        description: 'POCZTÓWKA Z WWA, LATO \'19 Oto kilka opowieści z Warszawy. Ode mnie, dla was. Niechaj umili wam to kolejne burzliwe lato. Utwór dostępny na platformach ...',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/O2wWRAW2Rhg/default.jpg',
            width: 120,
            height: 90
          },
          medium: {
            url: 'https://i.ytimg.com/vi/O2wWRAW2Rhg/mqdefault.jpg',
            width: 320,
            height: 180
          },
          high: {
            url: 'https://i.ytimg.com/vi/O2wWRAW2Rhg/hqdefault.jpg',
            width: 480,
            height: 360
          }
        },
        channelTitle: 'Taco Hemingway',
        liveBroadcastContent: 'none',
        publishTime: '2019-07-23T20:04:03Z'
      }
    },
    {
      kind: 'youtube#searchResult',
      etag: 'zmtjUL7J6PkXCE9SCpUj_nb6b1k',
      id: {
        kind: 'youtube#video',
        videoId: 'M0wiq9gk6KE'
      },
      snippet: {
        publishedAt: '2020-06-08T20:26:03Z',
        channelId: 'UCdi3RSAWq7-HwFqpGR8SJAQ',
        title: 'Taco Hemingway - Zapach Perfum (SzUsty Blend REUPLOAD)',
        description: 'Z tego, co widziałem, filmik spadł z kanału SzUstego, tak więc wrzucam go znowu, bo kawałek jest świetny. Teledysku niestety nie mam :/',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/M0wiq9gk6KE/default.jpg',
            width: 120,
            height: 90
          },
          medium: {
            url: 'https://i.ytimg.com/vi/M0wiq9gk6KE/mqdefault.jpg',
            width: 320,
            height: 180
          },
          high: {
            url: 'https://i.ytimg.com/vi/M0wiq9gk6KE/hqdefault.jpg',
            width: 480,
            height: 360
          }
        },
        channelTitle: 'Kacper Szczęsny',
        liveBroadcastContent: 'none',
        publishTime: '2020-06-08T20:26:03Z'
      }
    },
    {
      kind: 'youtube#searchResult',
      etag: '9hs-WDQ3m4QAcjLuW5PQF__0zr0',
      id: {
        kind: 'youtube#video',
        videoId: 'TKO8zmF98nI'
      },
      snippet: {
        publishedAt: '2015-06-06T17:34:30Z',
        channelId: 'UClm3zvzYNqeVwpzFGsDUOkg',
        title: 'Taco Hemingway - &quot;6 zer&quot; (prod. Rumak)',
        description: 'Zamów płytę: http://tacohemingway.com/preorder/ Tekst: http://genius.com/Taco-hemingway-6-zer-lyrics/ Animacje & montaż: Łukasz Partyka Kamera: Jonasz ...',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/TKO8zmF98nI/default.jpg',
            width: 120,
            height: 90
          },
          medium: {
            url: 'https://i.ytimg.com/vi/TKO8zmF98nI/mqdefault.jpg',
            width: 320,
            height: 180
          },
          high: {
            url: 'https://i.ytimg.com/vi/TKO8zmF98nI/hqdefault.jpg',
            width: 480,
            height: 360
          }
        },
        channelTitle: 'Taco Hemingway',
        liveBroadcastContent: 'none',
        publishTime: '2015-06-06T17:34:30Z'
      }
    },
    {
      kind: 'youtube#searchResult',
      etag: 'WW4uhggc63ahjF5HTJR94Yo83kg',
      id: {
        kind: 'youtube#video',
        videoId: 'lk70ee3UMAc'
      },
      snippet: {
        publishedAt: '2018-07-12T18:09:38Z',
        channelId: 'UClm3zvzYNqeVwpzFGsDUOkg',
        title: 'Taco Hemingway - Fiji (prod. Borucci)',
        description: '"CAFÉ BELGA" - drugi długogrający album w dorobku Taco Hemingwaya, wyprodukowany w całości przez Rumaka i Borucciego. Zamów/pobierz: ...',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/lk70ee3UMAc/default.jpg',
            width: 120,
            height: 90
          },
          medium: {
            url: 'https://i.ytimg.com/vi/lk70ee3UMAc/mqdefault.jpg',
            width: 320,
            height: 180
          },
          high: {
            url: 'https://i.ytimg.com/vi/lk70ee3UMAc/hqdefault.jpg',
            width: 480,
            height: 360
          }
        },
        channelTitle: 'Taco Hemingway',
        liveBroadcastContent: 'none',
        publishTime: '2018-07-12T18:09:38Z'
      }
    },
    {
      kind: 'youtube#searchResult',
      etag: 'Hg-JOLmUd8smwHIhNqxIu1ceopc',
      id: {
        kind: 'youtube#video',
        videoId: '0mITRbhgVCk'
      },
      snippet: {
        publishedAt: '2017-07-30T21:28:53Z',
        channelId: 'UClm3zvzYNqeVwpzFGsDUOkg',
        title: 'Taco Hemingway - &quot;Tlen&quot; (prod. Rumak)',
        description: 'Zamów/pobierz: http://www.tacohemingway.com Spotify: http://open.spotify.com/album/33loeuvtDJ4ptPJawMW6Le Mastering: Rafał Smoleń Nagrania: Jan ...',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/0mITRbhgVCk/default.jpg',
            width: 120,
            height: 90
          },
          medium: {
            url: 'https://i.ytimg.com/vi/0mITRbhgVCk/mqdefault.jpg',
            width: 320,
            height: 180
          },
          high: {
            url: 'https://i.ytimg.com/vi/0mITRbhgVCk/hqdefault.jpg',
            width: 480,
            height: 360
          }
        },
        channelTitle: 'Taco Hemingway',
        liveBroadcastContent: 'none',
        publishTime: '2017-07-30T21:28:53Z'
      }
    },
    {
      kind: 'youtube#searchResult',
      etag: 'O3DfKcx-jULzsXLZQk3TLCuHQbw',
      id: {
        kind: 'youtube#video',
        videoId: 'treilTnAA8c'
      },
      snippet: {
        publishedAt: '2018-11-18T16:27:29Z',
        channelId: 'UCRuCgABFXzVdtx9lzM8lR6w',
        title: 'Taco Hemingway   Bardzo Proszę! SzUsty Blend prod  Nick Badza',
        description: '',
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/treilTnAA8c/default.jpg',
            width: 120,
            height: 90
          },
          medium: {
            url: 'https://i.ytimg.com/vi/treilTnAA8c/mqdefault.jpg',
            width: 320,
            height: 180
          },
          high: {
            url: 'https://i.ytimg.com/vi/treilTnAA8c/hqdefault.jpg',
            width: 480,
            height: 360
          }
        },
        channelTitle: 'wszystko.TV',
        liveBroadcastContent: 'none',
        publishTime: '2018-11-18T16:27:29Z'
      }
    }
  ]
};

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
