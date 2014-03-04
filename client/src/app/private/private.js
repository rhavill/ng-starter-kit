angular.module('ngStarterKit.private', [
      'ui.router',
      //'placeholders',
      'ui.bootstrap'
    ])

    .config(function config($stateProvider) {
      $stateProvider.state('private', {
        url: '/private',
        views: {
          "main": {
            controller: 'PrivateCtrl',
            templateUrl: 'private/private.tpl.html'
          }
        },
        data: { pageTitle: 'Private' }
      });
    })

    .controller('PrivateCtrl', function PrivateCtrl($scope) {
      // This is simple a demo for UI Boostrap.
      $scope.dropdownDemoItems = [
        "The first choice!",
        "And another choice for you.",
        "but wait! A third!"
      ];
    })

;
