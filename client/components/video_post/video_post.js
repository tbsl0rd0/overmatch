require('./video_post.less');
var template = require('./video_post.html');

angular.module('video_post', [])
.component('videoPost', {
  bindings: {
    videoPost: '<'
  },
  template: template,
  controller: function(alert, $http, $scope, settings, user_state) {
    $scope.reply_time_stamps = [];
    $scope.reply_time_stamp = null;

    $scope.update_points = function(video_post, type) {
      if (!user_state.user) {
        alert.alert('로그인이 필요합니다');

        return;
      }

      if (video_post.user.battletag == user_state.user.battletag) {
        if (type == 'plus') {
          alert.alert('자신의 글은 플러스할 수 없습니다');
        }
        else {
          alert.alert('자신의 글은 마이너스할 수 없습니다');
        }

        return;
      }

      if (_.indexOf(video_post.plus_list, user_state.user.battletag) != -1) {
        alert.alert('이미 플러스했습니다');

        return;
      }

      if (_.indexOf(video_post.minus_list, user_state.user.battletag) != -1) {
        alert.alert('이미 마이너스했습니다');

        return;
      }

      $http({
        url: '/update_video_post_points',
        method: 'post',
        data: {
          video_post__id: video_post._id,
          type: type
        }
      })
      .then(function(res) {
        if (res.data.state == 'fail') {
          alert.alert(res.data.message);

          return;
        }
      });
    };

    $scope.activate_video = function(_id, type, video_id) {
      $scope.video_state = $scope.video_state * -1;

      if ($scope.video_state == 1) {
        if (type == 'youtube') {
          $('#video_' + _id).attr('src', 'https://www.youtube.com/embed/' + video_id + '?autoplay=1');
        }

        return;
      }

      if ($scope.video_state == -1) {
        $('#video_' + _id).attr('src', '');
      }
    };

    $scope.write_reply = function(_id) {
      if (!user_state.user) {
        alert.alert('로그인이 필요합니다');

        return;
      }

      if ($('#video_post_writing_reply_input_' + _id).val() == '') {
        alert.alert('댓글을 써주세요');

        return;
      }

      $scope.reply_time_stamps.unshift((new Date()).getTime());

      if ($scope.reply_time_stamps.length > 1) {
        if ($scope.reply_time_stamps[0] - $scope.reply_time_stamps[1] < 200) {
          return;
        }
      }

      if ($scope.reply_time_stamps.length > 2) {
        $scope.reply_time_stamps.pop();
      }

      if ($scope.reply_time_stamp) {
        var remained_time = (new Date()).getTime() - $scope.reply_time_stamp;

        if (remained_time < 10000) {
          alert.alert(parseInt(10 - remained_time / 1000) + '초 후에 쓸 수 있습니다');

          return;
        }
      }

      $scope.reply_time_stamp = new Date();

      $http({
        url: '/write_video_post_reply',
        method: 'post',
        data: {
          video_post__id: _id,
          reply: $('#video_post_writing_reply_input_' + _id).val(),
          is_anonymous: settings.is_anonymous == 1 ? true : false
        }
      })
      .then(function(res) {
        if (res.data.state == 'fail') {
          alert.alert(res.data.message);

          return;
        }

        $('#video_post_writing_reply_input_' + _id).val('');
      });
    };
  }
});
