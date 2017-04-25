require('./speech_bubble.less');
var template = require('./speech_bubble.html');

angular.module('speech_bubble', [])
.component('speechBubble', {
  bindings: {
    title: '@',
    content: '@',
    position: '<',
    arrowPosition: '@'
  },
  template: template,
  controller: function($scope) {
    setTimeout(function() {
      $scope.active = true;
    }, 500);

    $scope.inactivate = function() {
      $scope.active = false;
    };
  }
});
