require('./job_search_post.less');
var template = require('./job_search_post.html');

angular.module('job_search_post', [])
.component('jobSearchPost', {
  bindings: {
    post: '<'
  },
  template: template,
  controller: function($scope, context_menu) {
    $scope.show_context_menu = function($event) {
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
});
