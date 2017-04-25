require('./settings.less');
var template = require('./settings.html');

angular.module('settings', [])
.component('settings', {
  template: template,
  controller: function($scope, settings) {
    $scope.settings = settings;
  }
})
.factory('settings', function() {
  return {
    stat_by: 'competitive_play',
    is_anonymous: -1
  };
});
