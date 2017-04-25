require('./videos_board.less');
var template = require('./videos_board.html');

angular.module('videos_board', [])
.component('videosBoard', {
  template: template,
  controller: function(alert, $http, $scope, user_state, context_menu, videos_board) {
    $scope.videos_board = videos_board;

    $scope.page = 1;
    $scope.order = 'recent';
    $scope.video_posts = [];

    var is_subscribing_videos_board = false;

    videos_board.get_video_posts = function(order, page) {
      if (order != 'recent' && order != 'best') {
        return;
      }

      $scope.order = order;

      if (page > 0 && page < 1000) {
        $scope.page = page;
      }
      else if (page < 1) {
        $scope.page = 1;
      }
      else if (page > 999) {
        $scope.page = 999;
      }

      $http({
        url: '/get_video_posts',
        method: 'post',
        data: {
          order: order,
          page: $scope.page
        }
      })
      .then(function(res) {
        $scope.video_posts = res.data.video_posts;

        _.each($scope.video_posts, function(element, index, list) {
          if (element.type == 'youtube') {
            element.preview_url = 'https://i.ytimg.com/vi/' + element.video_id + '/hqdefault.jpg';
          }

          element.replies.reverse();

          if (_.isEmpty(element.replies)) {
            element.best_reply = null;
          }
          else {
            var best_reply = _.max(element.replies, function(reply) {
              return reply.points;
            });

            if (best_reply.points < 2) {
              element.best_reply = null;
            }
            else {
              element.best_reply = best_reply;
            }
          }
        });
      });
    };

    videos_board.subscribe_videos_board = function() {
      if (is_subscribing_videos_board == false) {
        client_socket.emit('join', {
          channel: 'videos_board'
        });

        is_subscribing_videos_board = true;
      }
    };

    client_socket.on('update_video_post_points', function(data) {
      var index = _.findIndex($scope.video_posts, { _id: data.video_post__id });

      if (index == -1) {
        return;
      }

      $scope.video_posts[index].points = data.points;
      $scope.video_posts[index].plus_list = data.plus_list;
      $scope.video_posts[index].minus_list = data.minus_list;

      $scope.$apply();
    });

    client_socket.on('add_reply', function(data) {
      var index = _.findIndex($scope.video_posts, { _id: data.video_post__id });

      if (index == -1) {
        return;
      }

      $scope.video_posts[index].replies.unshift(data.reply);

      $scope.$apply();
    });

    client_socket.on('update_video_post_reply_points', function(data) {
      var index = _.findIndex($scope.video_posts, { _id: data.video_post__id });

      if (index == -1) {
        return;
      }

      var index_2 = _.findIndex($scope.video_posts[index].replies, { _id: data.reply__id });

      if (index_2 == -1) {
        return;
      }

      $scope.video_posts[index].replies[index_2].points = data.points;
      $scope.video_posts[index].replies[index_2].plus_list = data.plus_list;
      $scope.video_posts[index].replies[index_2].minus_list = data.minus_list;

      var best_reply = _.max($scope.video_posts[index].replies, function(reply) {
        return reply.points;
      });

      if (best_reply.points < 2) {
        $scope.video_posts[index].best_reply = null;
      }
      else {
        $scope.video_posts[index].best_reply = best_reply;
      }

      $scope.$apply();
    });

    $scope.show_context_menu = function($event) {
      context_menu.show_context_menu({
        event: $event,
        items: [
          '배틀태그 복사',
          '자세히 보기',
          '초대'
        ]
      });
    };
  }
})
.factory('videos_board', function() {
  return {
    location: 'videos_board'
  };
});
