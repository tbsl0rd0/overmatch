require('./top_menu.less');
var template = require('./top_menu.html');

angular.module('top_menu', [])
.component('topMenu', {
  template: template,
  controller: function(alert, $scope, top_menu, user_state, public_chat, videos_board, job_search_board, matching_room_board) {
    $scope.top_menu = top_menu;
    $scope.user_state = user_state;

    var moving_time_stamps = [];

    var stamp_moving_time = function() {
      moving_time_stamps.unshift((new Date()).getTime());

      if (moving_time_stamps.length > 5) {
        moving_time_stamps.pop();

        if (moving_time_stamps[0] - moving_time_stamps[4] < 2000) {
          alert.alert('이동이 너무 많습니다');

          return false;
        }
      }

      return true;
    };

    $scope.move_to_public_chat = function() {
      if (!stamp_moving_time()) {
        return;
      }

      job_search_board.unsubscribe_job_search_board();
      job_search_board.remove_all_job_search_posts();
      matching_room_board.unsubscribe_matching_room_board();

      public_chat.get_public_chat_messages();
      public_chat.subscribe_public_chat();

      top_menu.location = 'public_chat';
    };

    $scope.move_to_job_search_board = function() {
      if (!stamp_moving_time()) {
        return;
      }

      public_chat.unsubscribe_public_chat();
      public_chat.remove_all_public_chat_messages();
      matching_room_board.unsubscribe_matching_room_board();

      job_search_board.get_all_job_search_posts();
      job_search_board.subscribe_job_search_board();

      top_menu.location = 'job_search_board';
    };

    $scope.move_to_matching_room_board = function() {
      if (!stamp_moving_time()) {
        return;
      }

      public_chat.unsubscribe_public_chat();
      public_chat.remove_all_public_chat_messages();
      job_search_board.unsubscribe_job_search_board();
      job_search_board.remove_all_job_search_posts();

      matching_room_board.get_all_matching_rooms();
      matching_room_board.subscribe_matching_room_board();

      top_menu.location = 'matching_room_board';
    };

    $scope.move_to_videos_board = function() {
      if (!stamp_moving_time()) {
        return;
      }

      public_chat.unsubscribe_public_chat();
      public_chat.remove_all_public_chat_messages();
      job_search_board.unsubscribe_job_search_board();
      job_search_board.remove_all_job_search_posts();
      matching_room_board.unsubscribe_matching_room_board();

      top_menu.location = 'videos_board';
    };
  }
})
.factory('top_menu', function() {
  return {
    location: 'videos_board'
  };
});
