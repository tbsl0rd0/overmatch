require('./public_chat.less');
var template = require('./public_chat.html');

angular.module('public_chat', [])
.component('publicChat', {
  template: template,
  controller: function(alert, $http, $scope, settings, user_state, public_chat, context_menu) {
    $scope.messages = [];

    var message_time_stamps = [];
    var message_time_stamps_2 = [];
    var is_subscribing_public_chat = false;

    public_chat.get_public_chat_messages = function() {
      $http({
        url: '/get_public_chat_messages',
        method: 'get'
      })
      .then(function(res) {
        $scope.messages = res.data.messages;
      });
    };

    public_chat.remove_all_public_chat_messages = function() {
      $scope.messages = [];
    };

    public_chat.subscribe_public_chat = function() {
      if (is_subscribing_public_chat == false) {
        client_socket.emit('join', {
          channel: 'public_chat'
        });

        is_subscribing_public_chat = true;
      }
    };

    public_chat.unsubscribe_public_chat = function() {
      if (is_subscribing_public_chat == true) {
        client_socket.emit('leave', {
          channel: 'public_chat'
        });

        is_subscribing_public_chat = false;
      }
    };

    $scope.send_message = function($event) {
      if (arguments.length == 1 && $event.key != 'Enter') {
        return;
      }

      if (!$scope.message) {
        return;
      }

      message_time_stamps_2.unshift((new Date()).getTime());

      if (message_time_stamps_2.length > 1) {
        if (message_time_stamps_2[0] - message_time_stamps_2[1] < 200) {
          return;
        }
      }

      if (message_time_stamps_2.length > 2) {
        message_time_stamps_2.pop();
      }

      if (!user_state.user) {
        alert.alert('로그인이 필요합니다');

        return;
      }

      message_time_stamps.unshift((new Date()).getTime());

      if (message_time_stamps.length > 5) {
        message_time_stamps.pop();

        if (message_time_stamps[0] - message_time_stamps[4] < 2000) {
          alert.alert('채팅이 너무 많습니다');

          return;
        }
      }

      $http({
        url: '/send_message_to_public_chat',
        method: 'post',
        data: {
          message: $('#public_chat_message_input').val(),
          stat_by: settings.stat_by,
          is_anonymous: settings.is_anonymous == 1 ? true : false
        }
      })
      .then(function(res) {
        if (res.data.state == 'fail') {
          alert.alert(res.data.message);

          return;
        }

        $scope.message = '';
      });
    };

    client_socket.on('add_message_to_public_chat', function(data) {
      $scope.messages.unshift(data.message);

      if ($scope.messages.length > 50) {
        $scope.messages.pop();
      }

      $scope.$apply();
    });

    $scope.show_context_menu = function($event, is_anonymous) {
      if (is_anonymous == true) {
        return;
      }

      context_menu.show_context_menu({
        event: $event,
        items: [
          '배틀태그 복사',
          '자세히 보기',
          '초대'
        ]
      });
    };
  }
})
.factory('public_chat', function() {
  return {};
});
