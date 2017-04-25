var template = require('./matching_room_creating_form.html');

angular.module('matching_room_creating_form', [])
.component('matchingRoomCreatingForm', {
  template: template,
  controller: function(alert, $scope, user_state, matching_room_chat, matching_room_board, matching_room_editing_form) {
    $scope.matching_room_board = matching_room_board;

    var creating_time_stamps = [];

    $scope.create = function() {
      if (!$scope.title) {
        alert.alert('방제를 적어주세요');

        return;
      }

      if (!(parseInt($scope.max_personnel) >= 2 && parseInt($scope.max_personnel) <= 12)) {
        alert.alert('인원은 2 ~ 12만 가능합니다');

        return;
      }

      creating_time_stamps.unshift((new Date()).getTime());

      if (creating_time_stamps.length > 5) {
        creating_time_stamps.pop();

        if (creating_time_stamps[0] - creating_time_stamps[4] < 2000) {
          alert.alert('생성이 너무 많습니다');

          return;
        }
      }

      if ($scope.wanted.dealer == 1 && $scope.wanted.tanker == 1 && $scope.wanted.healer == 1) {
        $scope.wanted.all = 1;
      }
      else {
        $scope.wanted.all = -1;
      }

      client_socket.emit('create_matching_room', {
        title: $('#matching_room_creating_form_title_input').val(),
        max_personnel: parseInt($scope.max_personnel),
        category: $scope.category,
        mic: $scope.mic == 1 ? true : false,
        wanted: {
          all: $scope.wanted.all == 1 ? true : false,
          dealer: $scope.wanted.dealer == 1 ? true : false,
          tanker: $scope.wanted.tanker == 1 ? true : false,
          healer: $scope.wanted.healer == 1 ? true : false
        }
      });
    }

    client_socket.on('create_matching_room', function(data) {
      if (data.state == 'fail') {
        alert.alert(data.message);

        return;
      }

      matching_room_board.current_matching_room = data.matching_room;

      matching_room_chat.reset_matching_room_chat();
      matching_room_editing_form.set_matching_room_editing_form();

      matching_room_board.location = 'matching_room';

      $scope.$apply();
    });
  }
});
