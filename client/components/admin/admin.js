var template = require('./admin.html');

angular.module('admin', [
  'init',
  'alert'
])
.component('admin', {
  template: template,
  controller: function(alert, $http, $scope) {
    $http({
      url: '/get_users_number',
      method: 'get'
    })
    .then(function(res) {
      if (res.data.state == 'fail') {
        alert.alert(res.data.message);

        return;
      }

      $scope.users_number = res.data.users_number;
    });

    $http({
      url: '/get_all_notices',
      method: 'get'
    })
    .then(function(res) {
      $scope.notices = res.data.notices;
    });

    $scope.add_notice = function() {
      $http({
        url: '/add_notice',
        method: 'post',
        data: {
          notice: $('#admin_notice_input').val()
        }
      })
      .then(function(res) {
        if (res.data.state == 'fail') {
          alert.alert(res.data.message);

          return;
        }

        $scope.notices.push(res.data.notice);
      });

      $scope.notice = '';
    };

    $scope.delete_notice = function(_id) {
      $http({
        url: '/delete_notice',
        method: 'post',
        data: {
          notice__id: _id
        }
      })
      .then(function(res) {
        if (res.data.state == 'fail') {
          alert.alert(res.data.message);

          return;
        }

        $scope.notices = _.reject($scope.notices, function(notice) {
          return notice._id == _id;
        });
      });
    };

    $scope.broadcast_notice = function() {
      $http({
        url: '/broadcast_notice',
        method: 'post',
        data: {
          notice: $('#admin_broadcasting_notice_input').val()
        }
      })
      .then(function(res) {
        if (res.data.state == 'fail') {
          alert.alert(res.data.message);

          return;
        }

        $scope.broadcasting_notice = '';
      });
    };
  }
});
