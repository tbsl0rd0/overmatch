var _ = require('underscore');
var cheerio = require('cheerio');
var request = require('request');

exports.handler = function(event, context, callback) {
  request({
    url: 'http://fow.tv/linklist.php',
    method: 'post',
    headers: {
      Connection: 'keep-alive',
      Accept: 'text/html, */*; q=0.01',
      Origin: 'http://fow.tv',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': 'ozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
      Referer: 'http://fow.tv/',
      'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.6,en;q=0.4',
      'Cookie': 'LL_SS=e994569b2aca76e687aa90985b6658ea; PHPSESSID=losusogrmtsa9gbpaq395eolm1; DETECT=c0a54788%7C46b2ea30%7Cc464a959%7Ca9991311; C_NAME=c22a5845bd601343ca2c636387ac19f1; _gat=1; wcs_bt=eb8a543fecfb8:1491102601; _ga=GA1.2.827432760.1489271539'
    },
    form: {
      subtype: 1,
      page: 0,
      sname: 'ByTime'
    }
  }, function(error, res, body) {
    var $ = cheerio.load(body);

    var video_posts = [];

    $('.linkbox').each(function(index, element) {
      var category = null;

      var emotions = {
        humorous: false,
        angry: false,
        sad: false,
        exciting: false,
        lovely: false,
        touching: false,
        academic: false
      };

      switch ($(element).find('div:nth-of-type(4) > div > span:nth-of-type(2)').text()) {
        case '분류: LoL':
          category = 'game';
          emotions.humorous = true;

          break;

        case '분류: 유머':
          category = 'etc';
          emotions.humorous = true;

          break;

        case '분류: 오버워치':
          category = 'overwatch';
          emotions.humorous = true;

          break;

        case '분류: 음악':
          category = 'music';
          emotions.touching = true;

          break;

        case '분류: 게임':
          category = 'game';
          emotions.humorous = true;

          break;

        case '분류: 감동':
          category = 'etc';
          emotions.touching = true;

          break;

        case '분류: 기타':
          category = 'etc';
          emotions.humorous = true;

          break;

        default:
          category = 'etc';
          emotions.humorous = true;
      }

      video_posts.unshift({
        title: $(element).find('.ell > a > span > b').text().replace('포우', '오매').replace('응디', '빵디'),
        battletag: '오버워치#' + _.random(10000, 99999),
        is_anonymous: true,
        url: $(element).find('.ell > a').attr('href'),
        category: category,
        emotions: emotions,
        from_lambda: true
      });
    });

    for(var i in video_posts) {
      request({
        url: 'http://overmatch.co.kr/write_video_post',
        method: 'post',
        json: true,
        body: video_posts[i]
      }, function(error, res, body) {});
    }

    callback(null, 'success');
  });
};

// exports.handler(null, null, function() {});
