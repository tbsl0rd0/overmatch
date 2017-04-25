require('./invitation_modal.less');
var template = require('./invitation_modal.html');

angular.module('invitation_modal', [])
.component('invitationModal', {
  template: template,
  controller: function($scope, user_state, matching_room_board) {
    client_socket.on('invite_to_party_matching_room', function(data) {
      $scope.invited_by = data.invited_by;
      $scope.invited_to = data.invited_to;

      $scope.active = true;

      var audio = document.createElement('audio');
      audio.src = 'https://s3.ap-northeast-2.amazonaws.com/overmatch-dtfu90ku/sounds/invitation_sound.mp3';
      audio.play();

      $scope.$apply();
    });

    $scope.confirm = function() {
      if (matching_room_board.current_matching_room) {
        client_socket.emit('leave_matching_room', {
          matching_room_uuid: matching_room_board.current_matching_room.uuid
        });

        matching_room_board.current_matching_room = null;
      }

      client_socket.emit('join_matching_room', {
        matching_room_uuid: $scope.invited_to.uuid
      });

      $scope.active = false;
    };
  }
});
