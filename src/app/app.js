angular.module('ngStarterKit', [
      'templates-app',
      'templates-common',
      'ngStarterKit.home',
      'ngStarterKit.private',
      'ngStarterKit.login',
      'ui.router',
      'ui.directives',
      'ui.bootstrap',
      'login'
    ])

    .config(function myAppConfig($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/home');
    })

    .run(['$rootScope', '$state', '$stateParams',
      function ($rootScope, $state, $stateParams) {
        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.navIsCollapsed = true;
      }])

    .controller('AppCtrl', ['$scope', '$location', '$state', 'login', function AppCtrl($scope, $location, $state, login) {
      $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        //console.log('new AppCtrl state:'+toState.name);
        if (angular.isDefined(toState.data.pageTitle)) {
          $scope.pageTitle = toState.data.pageTitle;
        }
        $scope.isAuthenticated = login.isAuthenticated();
        if (toState.name == 'private' && !$scope.isAuthenticated) {
          $state.go('login');
        }
     });

    }])

;

