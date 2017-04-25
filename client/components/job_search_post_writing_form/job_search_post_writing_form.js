var template = require('./job_search_post_writing_form.html');

angular.module('job_search_post_writing_form', [])
.component('jobSearchPostEditingForm', {
  template: template,
  controller: function(alert, $http, $scope, user_state) {
    var writing_time_stamps = [];

    $scope.write = function() {
      if (!user_state.user) {
        alert.alert('로그인이 필요합니다');

        return;
      }

      if (!$scope.comment) {
        alert.alert('코멘트를 적어주세요');

        return;
      }

      writing_time_stamps.unshift((new Date()).getTime());

      if (writing_time_stamps.length > 5) {
        writing_time_stamps.pop();

        if (writing_time_stamps[0] - writing_time_stamps[4] < 2000) {
          alert.alert('전송이 너무 많습니다');

          return;
        }
      }

      if ($scope.type.quick == -1 && $scope.type.competitive == -1 && $scope.type.etc == -1) {
        alert.alert('게임타입을 적어도 하나 선택해주세요');

        return;
      }

      if ($scope.position.dealer == -1 && $scope.position.tanker == -1 && $scope.position.healer == -1) {
        alert.alert('포지션을 적어도 하나 선택해주세요');

        return;
      }

      $http({
        url: '/write_job_search_post',
        method: 'post',
        data: {
          comment: $('#job_search_post_writing_form_comment_input').val(),
          type: {
            quick: $scope.type.quick == 1 ? true : false,
            competitive: $scope.type.competitive == 1 ? true : false,
            etc: $scope.type.etc == 1 ? true : false
          },
          position: {
            dealer: $scope.position.dealer == 1 ? true : false,
            tanker: $scope.position.tanker == 1 ? true : false,
            healer: $scope.position.healer == 1 ? true : false
          },
          mic: $scope.mic == 1 ? true : false
        }
      })
      .then(function(res) {
        if (res.data.state == 'fail') {
          alert.alert(res.data.message);
        }
      });
    }

    $scope.delete = function() {
      if (!user_state.user) {
        alert.alert('로그인이 필요합니다');

        return;
      }

      writing_time_stamps.unshift((new Date()).getTime());

      if (writing_time_stamps.length > 5) {
        writing_time_stamps.pop();

        if (writing_time_stamps[0] - writing_time_stamps[4] < 2000) {
          alert.alert('전송이 너무 많습니다');

          return;
        }
      }

      $http({
        url: '/delete_job_search_post',
        method: 'get'
      })
      .then(function(res) {
        if (res.data.state == 'fail') {
          alert.alert(res.data.message);

          return;
        }

        alert.alert('포스트가 삭제되었습니다');
      });
    }
  }
});
