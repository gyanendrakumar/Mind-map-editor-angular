'use strict';


// Declare app level module which depends on filters, and services
angular.module('mindmap', [
  'ngCookies',
  'ui.router',
  'LocalStorageModule',
  'mindmap.services',
  'mindmap.directives',
  'mindmap.controllers',
]).
config(function($stateProvider,$urlRouterProvider,USER_ROLES){
    $stateProvider
      .state('login',{
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      // logged state - only authenticated users will be able to see routes that are
      // children of this state
      .state('l', {
        url: '/l',
        abstract: true,
        template: '<ui-view/>',
        data : {
          authorizedRoles: [USER_ROLES.user]
        }
      })
      // this route will only be available to authenticated users
      .state('mindmap', {
        //parent: 'l',
        url: '/mindmap',
        templateUrl: '/views/mindmap.html',
        controller: 'MindMapCtrl'
      });
      $urlRouterProvider.otherwise('/');
}).
run(function ($rootScope, AUTH_EVENTS, AuthService) {
  $rootScope.$on('$stateChangeStart', function (event, next) {
    if(next.data){
      var authorizedRoles = next.data.authorizedRoles;
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        if (AuthService.isAuthenticated()) {
          // user is not allowed
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
        } else {
          // user is not logged in
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        }
      }
    }
  });
})