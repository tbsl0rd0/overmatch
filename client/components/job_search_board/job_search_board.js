require('./job_search_board.less');
var template = require('./job_search_board.html');

angular.module('job_search_board', [])
.component('jobSearchBoard', {
  template: template,
  controller: function(alert, $http, $scope, job_search_board) {
    $scope.posts = [];

    var is_subscribing = false;

    job_search_board.get_all_job_search_posts = function() {
      $http({
        url: '/get_job_search_posts',
        method: 'get'
      })
      .then(function(res) {
        $scope.posts = res.data.job_search_posts.reverse();
      });
    };

    job_search_board.remove_all_job_search_posts = function() {
      $scope.posts = [];
    };

    job_search_board.subscribe_job_search_board = function() {
      if (is_subscribing == false) {
        client_socket.emit('join', {
          channel: 'job_search_board'
        });

        is_subscribing = true;
      }
    };

    job_search_board.unsubscribe_job_search_board = function() {
      if (is_subscribing == true) {
        client_socket.emit('leave', {
          channel: 'job_search_board'
        });

        is_subscribing = false;
      }
    };

    client_socket.on('job_search_board', function(data) {
      if (data.command == 'add_job_search_post') {
        $scope.posts = _.reject($scope.posts, function(post) {
          return post.user.battletag == data.job_search_post.user.battletag;
        });

        $scope.posts.unshift(data.job_search_post);

        $scope.$apply();

        return;
      }

      if (data.command == 'remove_job_search_post') {
        $scope.posts = _.reject($scope.posts, function(post) {
          return post.user.battletag == data.battletag;
        });

        $scope.$apply();
      }
    });
  }
})
.factory('job_search_board', function() {
  return {};
});
