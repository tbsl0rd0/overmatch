var template = require('./matching_room_editing_form.html');

angular.module('matching_room_editing_form', [])
.component('matchingRoomEditingForm', {
  template: template,
  controller: function(alert, $http, $scope, matching_room_board, matching_room_editing_form) {
    var editing_time_stamps = [];

    matching_room_editing_form.set_matching_room_editing_form = function() {
      $scope.title = matching_room_board.current_matching_room.title;
      $scope.max_personnel = matching_room_board.current_matching_room.max_personnel;
      $scope.category = matching_room_board.current_matching_room.category;
      $scope.mic = matching_room_board.current_matching_room.mic == true ? 1 : -1;
      $scope.wanted = {
        all: matching_room_board.current_matching_room.wanted.all == true ? 1 : -1,
        dealer: matching_room_board.current_matching_room.wanted.dealer == true ? 1 : -1,
        tanker: matching_room_board.current_matching_room.wanted.tanker == true ? 1 : -1,
        healer: matching_room_board.current_matching_room.wanted.healer == true ? 1 : -1
      }
    };

    $scope.edit = function() {
      if (!$scope.title) {
        alert.alert('방제를 적어주세요');

        return;
      }

      if (!(parseInt($scope.max_personnel) >= 2 && parseInt($scope.max_personnel) <= 12)) {
        alert.alert('인원은 2 ~ 12만 가능합니다');

        return;
      }

      editing_time_stamps.unshift((new Date()).getTime());

      if (editing_time_stamps.length > 5) {
        editing_time_stamps.pop();

        if (editing_time_stamps[0] - editing_time_stamps[4] < 2000) {
          alert.alert('수정이 너무 많습니다');

          return;
        }
      }

      if ($scope.wanted.dealer == 1 && $scope.wanted.tanker == 1 && $scope.wanted.healer == 1) {
        $scope.wanted.all = 1;
      }
      else {
        $scope.wanted.all = -1;
      }

      $http({
        url: '/edit_matching_room',
        method: 'post',
        data: {
          matching_room_uuid: matching_room_board.current_matching_room.uuid,
          title: $('#matching_room_editing_form_title_input').val(),
          max_personnel: parseInt($scope.max_personnel),
          category: $scope.category,
          mic: $scope.mic == 1 ? true : false,
          wanted: {
            all: $scope.wanted.all == 1 ? true : false,
            dealer: $scope.wanted.dealer == 1 ? true : false,
            tanker: $scope.wanted.tanker == 1 ? true : false,
            healer: $scope.wanted.healer == 1 ? true : false
          }
        }
      })
      .then(function(res) {
        if (res.data.state == 'fail') {
          alert.alert(res.data.message);
        }
      });
    }
  }
})
.factory('matching_room_editing_form', function() {
  return {};
});
