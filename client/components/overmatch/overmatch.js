require('./overmatch.less');
var template = require('./overmatch.html');

angular.module('overmatch', [
  'init',
  'alert',
  'footer',
  'notice',
  'settings',
  'top_menu',
  'ngAnimate',
  'user_state',
  'video_post',
  'public_chat',
  'context_menu',
  'videos_board',
  'speech_bubble',
  'job_search_post',
  'invitation_modal',
  'job_search_board',
  'video_post_reply',
  'matching_room_chat',
  'matching_room_board',
  'video_post_writing_form',
  'matching_room_member_list',
  'matching_room_editing_form',
  'matching_room_creating_form',
  'job_search_post_writing_form'
])
.component('overmatch', {
  template: template,
  controller: function($scope, top_menu, user_state, context_menu, videos_board, matching_room_board) {
    $scope.top_menu = top_menu;
    $scope.user_state = user_state;
    $scope.context_menu = context_menu;
    $scope.videos_board = videos_board;
    $scope.matching_room_board = matching_room_board;
  }
});
