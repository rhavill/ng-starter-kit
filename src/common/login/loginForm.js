angular.module('login.form', ['ui.directives'])
    .directive('loginForm', function () {
      return {
        templateUrl: 'login/loginForm.tpl.html'
      };
    })
// The LoginFormController provides the behaviour behind a reusable form to allow users to authenticate.
// This controller and its template (login/form.tpl.html) are used in a modal dialog box by the security service.
    .controller('LoginFormController', ['$scope', 'login', function ($scope, login) {
      // The model for this form
      $scope.user = null;
      // Any error message from failing to login
      $scope.authError = null;

      // Attempt to authenticate the user specified in the form's model
      $scope.login = function () {

        // Try to login
        login.login($scope.user.username, $scope.user.password).then(function () {
          if (!login.isAuthenticated()) {
            // If we get here then the login failed due to bad credentials
            $scope.user = null;
            $scope.authError = 'Bad username or password.';
          }
          else {
            $scope.authError = null;
            $scope.user = login.user;
          }
        }, function (x) {
          // If we get here then there was a problem with the login request to the server
          $scope.user = null;
          $scope.authError = 'Error logging in. Problem contacting server.';
        });
      };

    }])
;