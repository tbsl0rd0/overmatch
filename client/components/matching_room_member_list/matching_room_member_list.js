require('./matching_room_member_list.less');
var template = require('./matching_room_member_list.html');

angular.module('matching_room_member_list', [])
.component('matchingRoomMemberList', {
  template: template,
  controller: function(alert, $scope, user_state, context_menu, matching_room_board) {
    $scope.matching_room_board = matching_room_board;

    client_socket.on('force_out', function(data) {
      client_socket.emit('leave_matching_room', {
        matching_room_uuid: data.matching_room_uuid
      });

      matching_room_board.current_matching_room = null;

      matching_room_board.location = 'matching_room_board';

      alert.alert('강퇴당했습니다');

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
});
