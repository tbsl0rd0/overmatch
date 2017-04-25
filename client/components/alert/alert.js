require('./alert.less');
var template = require('./alert.html');

angular.module('alert', [])
.component('alert', {
  template: template,
  controller: function(alert, $scope) {
    $scope.alerts = [];

    alert.alert = function(message) {
      if ($scope.alerts.length > 5) {
        $scope.alerts.pop();
      }

      $scope.alerts.unshift({
        message: message,
        date: new Date()
      });

      setTimeout(function() {
        if ($scope.alerts.length == 0) {
          return;
        }

        $scope.alerts.pop();

        $scope.$apply();
      }, 4000);
    };
  }
})
.factory('alert', function() {
  return {};
});
