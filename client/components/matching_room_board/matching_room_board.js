require('./matching_room_board.less');
var template = require('./matching_room_board.html');

angular.module('matching_room_board', [])
.component('matchingRoomBoard', {
  template: template,
  controller: function(alert, $http, $scope, top_menu, user_state, matching_room_chat, matching_room_board, matching_room_editing_form) {
    $scope.matching_rooms = [];

    var is_subscribing = false;
    var joining_time_stamps = [];

    var process_matching_rooms = function() {
      var grouped_matching_rooms = _.groupBy($scope.matching_rooms, function(matching_room) {
        return matching_room.members.length < matching_room.max_personnel;
      });

      $scope.matching_rooms = _.union(grouped_matching_rooms.true, grouped_matching_rooms.false);

      $scope.$apply();
    }

    setInterval(process_matching_rooms, 5000);

    matching_room_board.get_all_matching_rooms = function() {
      $http({
        method: 'get',
        url: '/get_all_matching_rooms'
      })
      .then(function(res) {
        $scope.matching_rooms = res.data.matching_rooms.reverse();

        setTimeout(process_matching_rooms, 0);
      });
    };

    matching_room_board.subscribe_matching_room_board = function() {
      if (is_subscribing == false) {
        client_socket.emit('join', {
          channel: 'matching_room_board'
        });

        is_subscribing = true;
      }
    };

    matching_room_board.unsubscribe_matching_room_board = function() {
      if (is_subscribing == true) {
        client_socket.emit('leave', {
          channel: 'matching_room_board'
        });

        is_subscribing = false;
      }
    };

    $scope.move_to_matching_room_creating_form = function() {
      if (!user_state.user) {
        alert.alert('로그인이 필요합니다');

        return;
      }

      matching_room_board.location = 'matching_room_creating_form';
    };

    $scope.join_matching_room = function(uuid) {
      if (!user_state.user) {
        alert.alert('로그인이 필요합니다');

        return;
      }

      var matching_room = _.find($scope.matching_rooms, function(matching_room) {
        return matching_room.uuid == uuid;
      });

      if (!matching_room) {
        alert.alert('존재하지 않는 방입니다');

        return;
      }

      if (matching_room.members.length >= matching_room.max_personnel) {
        alert.alert('인원이 꽉 찼습니다');

        return;
      }

      if (_.some(matching_room.members, function(member) {
        return member.battletag == user_state.user.battletag;
      })) {
        alert.alert('이미 참여중인 방입니다');

        return;
      }

      joining_time_stamps.unshift((new Date()).getTime());

      if (joining_time_stamps.length > 5) {
        joining_time_stamps.pop();

        if (joining_time_stamps[0] - joining_time_stamps[4] < 2000) {
          alert.alert('조인이 너무 많습니다');

          return;
        }
      }

      client_socket.emit('join_matching_room', {
        matching_room_uuid: uuid
      });
    };

    client_socket.on('matching_room_board', function(data) {
      if (data.command == 'join_matching_room') {
        if (data.state == 'fail') {
          alert.alert(data.message);

          $scope.$apply();

          return;
        }

        matching_room_chat.reset_matching_room_chat();

        matching_room_board.current_matching_room = data.matching_room;

        top_menu.location = 'matching_room_board';
        matching_room_board.location = 'matching_room';

        $scope.$apply();

        return;
      }

      if (data.command == 'add_matching_room') {
        console.log(data.matching_room);
        $scope.matching_rooms.unshift(data.matching_room);

        $scope.$apply();

        return;
      }

      if (data.command == 'update_matching_room') {
        var index = _.findIndex($scope.matching_rooms, { uuid: data.matching_room.uuid });

        if (index == -1) {
          return;
        }

        $scope.matching_rooms[index] = data.matching_room;

        $scope.$apply();

        return;
      }

      if (data.command == 'remove_matching_room') {
        $scope.matching_rooms = _.reject($scope.matching_rooms, function(matching_room) {
          return matching_room.uuid == data.matching_room_uuid;
        });

        $scope.$apply();

        return;
      }

      if (data.command == 'update_current_matching_room') {
        if (!matching_room_board.current_matching_room) {
          return;
        }

        if (matching_room_board.current_matching_room.members.length < data.matching_room.members.length) {
          var audio = document.createElement('audio');
          audio.src = 'https://s3.ap-northeast-2.amazonaws.com/overmatch-dtfu90ku/sounds/joining_sound.mp3';
          audio.play();
        }

        if (user_state.user.battletag != matching_room_board.current_matching_room.owner.battletag && user_state.user.battletag == data.matching_room.owner.battletag) {
          alert.alert('방장으로 임명되었습니다');
        }

        matching_room_board.current_matching_room = data.matching_room;

        matching_room_editing_form.set_matching_room_editing_form();

        $scope.$apply();
      }
    });
  }
})
.factory('matching_room_board', function() {
  return {
    location: 'matching_room_board',
    current_matching_room: null
  };
});
