require('./user_state.less');
var template = require('./user_state.html');

angular.module('user_state', [])
.component('userState', {
  template: template,
  controller: function($http, $scope, settings, user_state, context_menu) {
    $scope.settings = settings;
    $scope.user_state = user_state;

    $http({
      url: '/get_session',
      method: 'get'
    })
    .then(function(res) {
      if (!res.data.user) {
        return;
      }

      user_state.user = res.data.user;

      user_state.user.anonymous_battletag = user_state.user.battletag.replace(/#\d+/, '');
    });

    $scope.show_context_menu = function($event) {
      context_menu.show_context_menu({
        event: $event,
        items: [
          '배틀태그 복사',
          '자세히 보기'
        ]
      });
    };
  }
})
.factory('user_state', function() {
  return {
    user: null
  };
});
