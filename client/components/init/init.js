angular.module('init', [])
.component('init', {
  controller: function() {}
})
.config(function($httpProvider) {
  $httpProvider.defaults.headers.common = {
    pragma: 'no-cache'
  };
});
