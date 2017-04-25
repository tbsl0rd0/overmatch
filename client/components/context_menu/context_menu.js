require('./context_menu.less');
var template = require('./context_menu.html');

angular.module('context_menu', [])
.component('contextMenu', {
  template: template,
  controller: function(alert, $http, $scope, user_state, context_menu, matching_room_board) {
    var inviting_time_stamps = [];

    context_menu.show_context_menu = function(data) {
      event.stopPropagation();

      $scope.x = data.event.pageX;
      $scope.y = data.event.pageY;

      $scope.battletag = data.event.currentTarget.innerHTML;

      $scope.items = data.items;

      $scope.active = true;
    }

    context_menu.hide_context_menu = function() {
      $scope.active = false;
    }

    $scope.jdfellaf = function() {
      event.stopPropagation();
    }

    $scope.execute = function(item) {
      context_menu.hide_context_menu();

      if (item == '배틀태그 복사') {
        clipboard.copy($scope.battletag);

        alert.alert('클립보드에 복사되었습니다');

        return;
      }

      if (item == '자세히 보기') {
        open('https://playoverwatch.com/ko-kr/career/pc/kr/' + $scope.battletag.replace('#', '-'));

        return;
      }

      if (item == '초대') {
        if (!matching_room_board.current_matching_room) {
          alert.alert('초대할 방이 없습니다');

          return;
        }

        if (matching_room_board.current_matching_room.members.length >= matching_room_board.current_matching_room.max_personnel) {
          alert.alert('현재 방의 인원이 꽉 찼습니다');

          return;
        }

        if (_.some(matching_room_board.current_matching_room.members, function(member) {
          return member.battletag == $scope.battletag;
        })) {
          alert.alert('현재 방에 참여중인 사용자입니다');

          return;
        }

        if (user_state.user.battletag == $scope.battletag) {
          alert.alert('자신은 초대할 수 없습니다');

          return;
        }

        inviting_time_stamps.unshift((new Date()).getTime());

        if (inviting_time_stamps.length > 5) {
          inviting_time_stamps.pop();

          if (inviting_time_stamps[0] - inviting_time_stamps[4] < 2000) {
            alert.alert('초대가 너무 많습니다');

            return;
          }
        }

        $http({
          url: '/invite',
          method: 'post',
          data: {
            battletag: $scope.battletag,
            invited_by: user_state.user,
            invited_to: matching_room_board.current_matching_room
          }
        })
        .then(function(res) {
          if (res.data.state == 'fail') {
            alert.alert(res.data.message);

            return;
          }

          alert.alert('초대했습니다');
        });

        return;
      }

      if (item == '방장임명') {
        $http({
          url: '/appointment_owner',
          method: 'post',
          data: {
            battletag: $scope.battletag,
            matching_room_uuid: matching_room_board.current_matching_room.uuid
          }
        })
        .then(function(res) {
          if (res.data.state == 'fail') {
            alert.alert(res.data.message);
          }
        });

        return;
      }

      if (item == '강퇴') {
        if (user_state.user.battletag == $scope.battletag) {
          alert.alert('자기자신은 강퇴할 수 없습니다');

          return;
        }

        $http({
          url: '/force_out',
          method: 'post',
          data: {
            battletag: $scope.battletag,
            matching_room_uuid: matching_room_board.current_matching_room.uuid
          }
        })
        .then(function(res) {
          if (res.data.state == 'fail') {
            alert.alert(res.data.message);
          }
        });
      }
    }
  }
})
.factory('context_menu', function() {
  return {};
});
