require('./matching_room_chat.less');
var template = require('./matching_room_chat.html');

angular.module('matching_room_chat', [])
.component('matchingRoomChat', {
  template: template,
  controller: function(alert, $http, $scope, settings, user_state, context_menu, matching_room_chat, matching_room_board) {
    $scope.matching_room_board = matching_room_board;

    $scope.messages = [];

    var message_time_stamps = [];

    matching_room_chat.reset_matching_room_chat = function() {
      $scope.message = '';
      $scope.messages = [];
    };

    $scope.leave_matching_room = function() {
      client_socket.emit('leave_matching_room', {
        matching_room_uuid: matching_room_board.current_matching_room.uuid
      });

      matching_room_board.current_matching_room = null;

      matching_room_board.location = 'matching_room_board';
    };

    $scope.send_message = function($event) {
      if (arguments.length == 1 && $event.key != 'Enter') {
        return;
      }

      if (!$scope.message) {
        return;
      }

      message_time_stamps.unshift((new Date()).getTime());

      if (message_time_stamps.length > 1) {
        if (message_time_stamps[0] - message_time_stamps[1] < 200) {
          return;
        }
      }

      if (message_time_stamps.length > 5) {
        message_time_stamps.pop();

        if (message_time_stamps[0] - message_time_stamps[4] < 2000) {
          alert.alert('채팅이 너무 많습니다');

          return;
        }
      }

      $http({
        url: '/send_message_to_matching_room_chat',
        method: 'post',
        data: {
          stat_by: settings.stat_by,
          message: $('#matching_room_chat_message_input').val(),
          matching_room_uuid: matching_room_board.current_matching_room.uuid
        }
      })
      .then(function(res) {
        if (res.data.state == 'fail') {
          alert.alert(res.data.message);
        }
      });

      $scope.message = '';
    };

    client_socket.on('send_message_to_matching_room_chat', function(data) {
      $scope.messages.unshift(data.message);

      if ($scope.messages.length > 100) {
        $scope.messages.pop();
      }

      $scope.$apply();
    });

    $scope.show_context_menu = function($event) {
      context_menu.show_context_menu({
        event: $event,
        items: user_state.user.battletag == matching_room_board.current_matching_room.owner.battletag ? [
          '배틀태그 복사',
          '자세히 보기',
          '방장임명',
          '강퇴'
        ] : [
          '배틀태그 복사',
          '자세히 보기'
        ]
      });
    };
  }
})
.factory('matching_room_chat', function() {
  return {};
});
