var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var cheerio = require('cheerio');
var express = require('express');
var request = require('request');
var router = express.Router();
var mongodb = require('../server/mongodb/mongodb');
var passport = require('../server/passport/passport');

router.get('/', function(req, res, next) {
  req.user = {
    // battletag: 'gx5u3s8m#3373'
    battletag: 'DevjlCloudVN#1911'
  };

  mongodb.get_db(function(db) {
    db.collection('sessions').deleteOne({ session: { $regex: '\"battletag\":\"' + req.user.battletag + '\"' } })
    .then(function(result) {
      db.close();

      request(encodeURI('https://playoverwatch.com/ko-kr/career/pc/kr/' + req.user.battletag.replace('#', '-')), function(error, res_2, body) {
        var $ = cheerio.load(body);

        var bottom_icon_style = $('.masthead-player-progression.show-for-lg > .player-level > .player-rank').attr('style');
        var bottom_icon_url = null;

        if (bottom_icon_style) {
          bottom_icon_url = bottom_icon_style.replace('background-image:url(', '').replace(')', '');
        }

        var level_color = '';
        var level_star_number = 0;

        var callback = function(color, star_number) {
          req.session.user = {
            portrait: $('.masthead-player > img').attr('src') || 'https://blzgdapipro-a.akamaihd.net/game/unlocks/0x02500000000002F7.png',
            // battletag: req.user.battletag,
            battletag: _.random(10000, 99999) + '#' + _.random(10000, 99999),
            level: {
              color: color,
              star_number: star_number,
              level: $('.masthead-player-progression.show-for-lg > .player-level > .u-vertical-center').text() || '0'
            },
            rank: {
              rank_icon: $('.masthead-player-progression.show-for-lg > .competitive-rank > img').attr('src') || 'https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-1.png',
              rank: $('.masthead-player-progression.show-for-lg > .competitive-rank > div').text() || '0'
            },
            quick_play: [],
            competitive_play: [],
            type: req.user.battletag != 'gx5u3s8m#3373' ? 'normal' : 'admin'
          };

          var play_error = [
            'https://blzgdapipro-a.akamaihd.net/game/heroes/small/0x02E0000000000002.png',
            'https://blzgdapipro-a.akamaihd.net/game/heroes/small/0x02E0000000000003.png',
            'https://blzgdapipro-a.akamaihd.net/game/heroes/small/0x02E0000000000004.png'
          ];

          for (var i = 0; i < 3; i++) {
            req.session.user.quick_play.push({
              hero_icon: $('#quickplay > .hero-comparison-section > div > div').eq(1).children('div').eq(i).children('img').attr('src') || play_error[i],
              play_time: $('#quickplay > .hero-comparison-section > div > div').eq(1).children('div').eq(i).find('div > .bar-text > .description').text() || '--'
            });
          }

          for (var i = 0; i < 3; i++) {
            req.session.user.competitive_play.push({
              hero_icon: $('#competitive > .hero-comparison-section > div > div').eq(1).children('div').eq(i).children('img').attr('src') || play_error[i],
              play_time: $('#competitive > .hero-comparison-section > div > div').eq(1).children('div').eq(i).find('div > .bar-text > .description').text() || '--'
            });
          }

          req.session.user.level.level = parseInt(req.session.user.level.level);
          req.session.user.rank.rank = parseInt(req.session.user.rank.rank);

          for (var i in req.session.user.quick_play) {
            req.session.user.quick_play[i].play_time = req.session.user.quick_play[i].play_time.replace('--', '0m').replace(' 분', 'm').replace(' 시간', 'h');
          }

          for (var i in req.session.user.competitive_play) {
            req.session.user.competitive_play[i].play_time = req.session.user.competitive_play[i].play_time.replace('--', '0m').replace(' 분', 'm').replace(' 시간', 'h');
          }

          res.redirect('/');
        };

        if (!bottom_icon_url) {
          level_color = 'brown';
          level_star_number = 0;

          callback(level_color, level_star_number);
        }
        else if (/(22|2B|24|25|26|27|28|29|4C|50)_Rank/.test(bottom_icon_url)) {
          level_color = 'brown';
          level_star_number = 1;

          callback(level_color, level_star_number);
        }
        else if (/(2C|23|33|37|3B|3F|44|48|2A|51)_Rank/.test(bottom_icon_url)) {
          level_color = 'brown';
          level_star_number = 2;

          callback(level_color, level_star_number);
        }
        else if (/(2D|30|34|38|3C|40|45|49|4D|52)_Rank/.test(bottom_icon_url)) {
          level_color = 'brown';
          level_star_number = 3;

          callback(level_color, level_star_number);
        }
        else if (/(2E|31|35|39|3D|41|46|4A|4E|53)_Rank/.test(bottom_icon_url)) {
          level_color = 'brown';
          level_star_number = 4;

          callback(level_color, level_star_number);
        }
        else if (/(2F|32|36|3A|3E|42|47|4B|4F|54)_Rank/.test(bottom_icon_url)) {
          level_color = 'brown';
          level_star_number = 5;

          callback(level_color, level_star_number);
        }
        else if (/(56|5D|5E|5F|60|61|62|63|5C|64)_Rank/.test(bottom_icon_url)) {
          level_color = 'silver';
          level_star_number = 0;

          callback(level_color, level_star_number);
        }
        else if (/(94|95|96|97|98|99|9A|9B|92|93)_Rank/.test(bottom_icon_url)) {
          level_color = 'gold';
          level_star_number = 0;

          callback(level_color, level_star_number);
        }
        else {
          request(bottom_icon_url, function(error, res_2, body) {
            var color = ['silver', 'gold'];
            var star_number = [1, 2, 3, 4, 5];

            var is_found = false;

            for (var i in color) {
              for (var j in star_number) {
                if (body == fs.readFileSync(path.join(__dirname, '../server/images/user_level_' + color[i] + '_star_' + star_number[j] + '.png'), 'utf8')) {
                  level_color = color[i];
                  level_star_number = star_number[j];

                  is_found = true;

                  break;
                }
              }

              if (is_found == true)  {
                break;
              }
            }

            callback(level_color, level_star_number);
          });
        }
      });
    });
  });
});

module.exports = router;
