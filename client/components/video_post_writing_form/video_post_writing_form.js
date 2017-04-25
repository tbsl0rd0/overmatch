var template = require('./video_post_writing_form.html');

angular.module('video_post_writing_form', [])
.component('videoPostWritingForm', {
  template: template,
  controller: function(alert, $http, $scope, settings, user_state, videos_board) {
    $scope.videos_board = videos_board;

    $scope.emotions = {
      humorous: 1,
      angry: -1,
      sad: -1,
      exciting: -1,
      lovely: -1,
      touching: -1,
      academic: -1
    };

    $scope.write = function() {
      if (!user_state.user) {
        alert.alert('로그인이 필요합니다');

        return;
      }

      if (!$scope.title) {
        alert.alert('제목을 적어주세요');

        return;
      }

      if (!$scope.url) {
        alert.alert('URL이나 Script를 적어주세요');

        return;
      }

      if ($scope.emotions.humorous == -1 && $scope.emotions.angry == -1 && $scope.emotions.sad == -1 && $scope.emotions.exciting == -1 && $scope.emotions.lovely == -1 && $scope.emotions.touching == -1 && $scope.emotions.academic == -1) {
        alert.alert('감정 태그를 적어도 하나 이상 선택해주세요');

        return;
      }

      $http({
        url: '/write_video_post',
        method: 'post',
        data: {
          title: $('#video_post_writing_form_title_input').val(),
          url: $('#video_post_writing_form_url_input').val(),
          category: $scope.category,
          emotions: {
            humorous: $scope.emotions.humorous == 1 ? true : false,
            angry: $scope.emotions.angry == 1 ? true : false,
            sad: $scope.emotions.sad == 1 ? true : false,
            exciting: $scope.emotions.exciting == 1 ? true : false,
            lovely: $scope.emotions.lovely == 1 ? true : false,
            touching: $scope.emotions.touching == 1 ? true : false,
            academic: $scope.emotions.academic == 1 ? true : false,
          },
          is_anonymous: settings.is_anonymous == 1 ? true : false
        }
      })
      .then(function(res) {
        if (res.data.state == 'fail') {
          alert.alert(res.data.message);

          return;
        }

        alert.alert('등록되었습니다');

        $scope.title = '';
        $scope.url = '';
        $scope.category = 'overwatch';

        $scope.emotions = {
          humorous: 1,
          angry: -1,
          sad: -1,
          exciting: -1,
          lovely: -1,
          touching: -1,
          academic: -1
        };

        videos_board.get_video_posts('recent', 1);

        videos_board.location = 'videos_board';
      });
    };
  }
});
