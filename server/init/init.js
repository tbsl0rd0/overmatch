var uuid = require('uuid/v1');
var events = require('events');
var mongodb = require('../mongodb/mongodb');

events.prototype._maxListeners = 0;

mongodb.get_db(function(db) {
  db.collection('records').findOne({ type: 'db_init' })
  .then(function(doc) {
    if (doc) {
      db.close();

      return;
    }

    db.collection('records').insertOne({
      type: 'db_init'
    })
    // .then(function(result) {
    //   return db.collection('notices').deleteMany({});
    // })
    .then(function(result) {
      return db.collection('sessions').deleteMany({});
    })
    .then(function(result) {
      return db.collection('users').deleteMany({});
    })
    // .then(function(result) {
    //   return db.collection('public_chat_messages').deleteMany({});
    // })
    // .then(function(result) {
    //   return db.collection('job_search_posts').deleteMany({});
    // })
    .then(function(result) {
      return db.collection('matching_rooms').deleteMany({});
    })
    .then(function(result) {
      return db.collection('video_posts').deleteMany({});
    })
    // .then(function(result) {
    //   return db.collection('notices').insertOne({
    //     notice: '안녕하세요! 오버매치입니다'
    //   });
    // })
    .then(function(result) {
      return db.collection('matching_rooms').insertMany([
        {
          uuid: uuid(),
          title: '빠대 즐겜',
          max_personnel: 3,
          category: 'quick',
          mic: false,
          wanted: {
            all: false,
            dealer: false,
            tanker: false,
            healer: false
          },
          owner: {
            portrait: 'https://blzgdapipro-a.akamaihd.net/game/unlocks/0x0250000000000EF5.png',
            battletag: 'Syu#11668',
            level: {
              color: 'brown',
              star_number: 2,
              level: 3
            },
            rank: {
              rank_icon: 'https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-3.png',
              rank: 2013
            }
          },
          members: [1, 2, 3]
        },
        {
          uuid: uuid(),
          title: '경쟁 하드하게',
          max_personnel: 3,
          category: 'competitive',
          mic: true,
          wanted: {
            all: false,
            dealer: false,
            tanker: false,
            healer: true
          },
          owner: {
            portrait: 'https://blzgdapipro-a.akamaihd.net/game/unlocks/0x0250000000000F00.png',
            battletag: 'KIWI#12699',
            level: {
              color: 'brown',
              star_number: 2,
              level: 35
            },
            rank: {
              rank_icon: 'https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-5.png',
              rank: 3000
            }
          },
          members: [1, 2, 3]
        },
        {
          uuid: uuid(),
          title: '경쟁',
          max_personnel: 2,
          category: 'competitive',
          mic: false,
          wanted: {
            all: false,
            dealer: false,
            tanker: true,
            healer: false
          },
          owner: {
            portrait: 'https://blzgdapipro-a.akamaihd.net/game/unlocks/0x0250000000000C22.png',
            battletag: 'DookMyugen#1907',
            level: {
              color: 'brown',
              star_number: 0,
              level: 74
            },
            rank: {
              rank_icon: 'https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-4.png',
              rank: 2620
            }
          },
          members: [1, 2]
        }
      ]);
    })
    .then(function(result) {
      db.collection('public_chat_messages').find({}).toArray(function(error, docs) {
        var public_chat_messages = [];

        for (var i in docs) {
          public_chat_messages.push({
            message: docs[i].message,
            user: docs[i].user,
            stat_by: docs[i].stat_by,
            is_anonymous: docs[i].anony,
            encrypted_ip: docs[i].ip,
            date: docs[i].date
          });
        }

        db.collection('public_chat_messages').deleteMany({})
        .then(function(result) {
          return db.collection('public_chat_messages').insertMany(public_chat_messages);
        })
        .then(function(result) {
          db.close();
        });
      });
    });
  });
});
