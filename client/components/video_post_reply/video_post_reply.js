require('./video_post_reply.less');
var template = require('./video_post_reply.html');

angular.module('video_post_reply', [])
.component('videoPostReply', {
  bindings: {
    videoPostId: '<',
    videoPostReply: '<'
  },
  template: template,
  controller: function(alert, $http, $scope, user_state) {
    $scope.update_points = function(_id, reply, type) {
      if (!user_state.user) {
        alert.alert('로그인이 필요합니다');

        return;
      }

      if (reply.user.battletag == user_state.user.battletag) {
        if (type == 'plus') {
          alert.alert('자신의 글은 플러스할 수 없습니다');
        }
        else {
          alert.alert('자신의 글은 마이너스할 수 없습니다');
        }

        return;
      }

      if (_.indexOf(reply.plus_list, user_state.user.battletag) != -1) {
        alert.alert('이미 플러스했습니다');

        return;
      }

      if (_.indexOf(reply.minus_list, user_state.user.battletag) != -1) {
        alert.alert('이미 마이너스했습니다');

        return;
      }

      $http({
        url: '/update_video_post_reply_points',
        method: 'post',
        data: {
          video_post__id: _id,
          reply__id: reply._id,
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
  }
});
