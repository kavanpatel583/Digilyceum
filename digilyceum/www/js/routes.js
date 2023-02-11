angular.module('starter.routes', ['ionicUIRouter'])

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      .state('tabsController', {
        url: '/home',
        templateUrl: 'templates/tabs.html',
        controller: 'TabsCtrl',
        abstract: true
      })

      .state('tabsController.startPage', {
        url: '/dashboard',
        views: {
          'tab1': {
            templateUrl: 'templates/startpage.html',
            controller: 'StartPageCtrl'
          }
        }
      })
      .state('tabsController.joinelection', {
        url: '/joinelection',
        views: {
          'tab2': {
            templateUrl: 'templates/joinelection.html',
            controller: 'JoinElectionCtrl'
          }
        }
       })
       .state('tabsController.chatbot', {
        url: '/chatbot',
        views: {
          'tab3': {
            templateUrl: 'templates/chatbot.html',
            controller: 'ChatbotCtrl'
          }
        }
       })
      .state('tabsController.crdetails', {
        url: '/crdetails',
        views: {
          'tab1': {
            templateUrl: 'templates/crdetails.html',
            controller: 'CrDetailsCtrl'
          }
        }
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'SignUpCtrl'
      })
      .state('uploaddocument', {
        url: '/uploaddocument?:crenrollmentnumber:supporterenrollmentnumber',
        templateUrl: 'templates/uploaddocument.html',
        controller: 'UploadDocumentCtrl'
      })
      .state('hostelection', {
        url: '/hostelection',
        templateUrl: 'templates/hostelection.html',
        controller: 'HostElectionCtrl'
      })
      // .state('chatbot', {
      //   url: '/chatbot',
      //   templateUrl: 'templates/chatbot.html',
      //   controller: 'ChatbotCtrl'
      // })
      // .state('joinelection', {
      //   url: '/joinelection',
      //   templateUrl: 'templates/joinelection.html',
      //   controller: 'JoinElectionCtrl'
      // })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })
      .state('myaccount', {
        url: '/myaccount',
        templateUrl: 'templates/myaccount.html',
        controller: 'MyAccountCtrl'
      })
      .state('supporterdetails', {
        url: '/supporterdetails?:crenrollmentnumber',
        templateUrl: 'templates/supporterdetails.html',
        controller: 'SupporterDetailsCtrl'
      })
      .state('uploadsupporterdocument', {
        url: '/uploadsupporterdocument?:supporterenrollmentnumber:crenrollmentnumber',
        templateUrl: 'templates/uploadsupporterdocument.html',
        controller: 'UploadSupporterDocumentCtrl'
      })
      .state('gsdetails', {
        url: '/gsdetails',
        templateUrl: 'templates/gsdetails.html',
        controller: 'GsdetailsCtrl'
      })
      .state('guestjoingame', {
        url: '/guestjoingame?:PIN:enrollment_number:email',
        templateUrl: 'templates/guestjoingame.html',
        controller: 'GuestJoinGameCtrl'
      }).state('gamehostview', {
        url: '/gamehostview?:PIN:sem:branch',
        templateUrl: 'templates/gamehostview.html',
        controller: 'GameHostViewCtrl'
      })


    $urlRouterProvider.otherwise('/home/dashboard')

  });
