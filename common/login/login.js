angular.module('login', [
      'login.link',
      'login.form'])
    .factory('login', ['$http', function ($http) {
      var service = {
        user: null,
        isAuthenticated: function () {
          if (service.user) {
            return true;
          }
          return false;
        },
        login: function (username, password) {
          service.user = null;
          var request = $http.post('/login', {username: username, password: password});
          return request.then(function (response) {
            if (response.data.id) {
              service.user = response.data;
            }
          });
        },
        logout: function () {
          var request = $http.get('/logout');
          return request.then(function (response) {
            if (response.data.success) {
              service.user = null;
            }
          });
        }
      };
      return service;
    }]);
