require('./notice.less');
var template = require('./notice.html');

angular.module('notice', [])
.component('notice', {
  template: template,
  controller: function(alert, $http, $scope) {
    var notices = [];

    $http({
      url: '/get_all_notices',
      method: 'get'
    })
    .then(function(res) {
      notices = res.data.notices;

      if (notices.length == 0) {
        return;
      }

      if (notices.length == 1) {
        $('.notice_items').append('<div></div>');
        $('.notice_items').append('<div style="top: 1px;">' + notices[0].notice + '</div>');

        return;
      }

      notices = notices.reverse();
      notices.unshift(notices.pop());

      $('.notice_items').append('<div></div>');
      $('.notice_items').append('<div style="top: 1px;">' + notices[0].notice + '</div>');

      notices.unshift(notices.pop());

      $('.notice_items').append('<div style="top: 31px;">' + notices[0].notice + '</div>');
    });

    setInterval(function() {
      if (notices.length == 0) {
        $('.notice_items > div').remove();

        return;
      }

      if (notices.length == 1) {
        $('.notice_items > div').remove();

        $('.notice_items').append('<div></div>');
        $('.notice_items').append('<div style="top: 1px;">' + notices[0].notice + '</div>');

        return;
      }

      $('.notice_items > div:nth-of-type(1)').remove();

      $('.notice_items > div:nth-of-type(1)').css('top', '-29px');
      $('.notice_items > div:nth-of-type(2)').css('top', '1px');

      notices.unshift(notices.pop());

      $('.notice_items').append('<div style="top: 31px;">' + notices[0].notice + '</div>');
    }, 10000);

    client_socket.on('notice', function(data) {
      if (data.command == 'add_notice') {
        if (notices.length == 1) {
          notices.push(data.notice);

          notices.unshift(notices.pop());

          $('.notice_items').append('<div style="top: 31px;">' + notices[0].notice + '</div>');

          $scope.$apply();

          return;
        }

        notices.push(data.notice);

        $scope.$apply();

        return;
      }

      if (data.command == 'remove_notice') {
        notices = _.reject(notices, function(notice) {
          return notice._id == data.notice__id;
        });

        $scope.$apply();

        return;
      }

      if (data.command == 'broadcast_notice') {
        alert.alert(data.notice);

        $scope.$apply();
      }
    });
  }
});
