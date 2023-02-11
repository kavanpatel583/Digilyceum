// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function ($window) {
  return $window._; // assumes underscore has already been loaded on the page
}]);
angular.module('starter', ['ionic', 'firebase', 'underscore', 'starter.routes', 'starter.directives', 'ngCordova'])
  .constant('firebaseURL', 'https://digilyceum-15c27.firebaseio.com')
  .config(function ($ionicConfigProvider, $sceDelegateProvider, $urlRouterProvider) {

    $ionicConfigProvider.tabs.position('bottom');
    $sceDelegateProvider.resourceUrlWhitelist(['self', '*://www.youtube.com/**', '*://player.vimeo.com/video/**']);


  })

  .run(function ($ionicPlatform, $state, SessionService,$ionicSideMenuDelegate) {
    $ionicPlatform.ready(function () {

      $ionicSideMenuDelegate.canDragContent(false);
      let userObject = SessionService.getUser();
      if (!!userObject) {
        $state.go('tabsController.startPage');
      } else {
        $state.go('login');
      }

      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          // User is signed in.
        } else {
          $state.go('login');
        }
      });
      document.addEventListener('onSMSArrive', function (e) {
        var sms = e.data;

        console.log("sms" + sms);
      });
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs).
      // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
      // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
      // useful especially with forms, though we would prefer giving the user a little more room
      // to interact with the app.
      if (window.cordova && window.Keyboard) {
        window.Keyboard.hideKeyboardAccessoryBar(true);
      }

      if (window.StatusBar) {
        // Set the statusbar to use the default style, tweak this to
        // remove the status bar on iOS or change it to use white instead of dark colors.
        StatusBar.styleDefault();
      }
    });
  })
