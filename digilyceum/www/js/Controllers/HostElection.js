angular.module('starter')
  .controller('HostElectionCtrl', function ($scope, $state, $ionicHistory, sharedUtils, SessionService, IonicPopupService, CommonService,
    UserService, ImageUploadService, $sce, _, FirebaseService, RESOURCES,$http) {
    // $ionicPlatform.ready(function (SessionService, $ionicHistory, $state) {
    //   window.FirebasePlugin.setScreenName("Election Screen");
    // });

    $scope.$on('$ionicView.enter', function () {
      // window.FirebasePlugin.setScreenName("Host");

    });
    $scope.goBack = function () {
      $ionicHistory.clearCache().then(function () {
        $state.go('tabsController.startPage');
      });
    }

    $scope.startElection = function (data) {
      if (data.branch == undefined) {
        IonicPopupService.alert("opps", "please enter the enrollment number");
      } else if (data.sem == undefined) {
        IonicPopupService.alert("opps", "please enter the semester");
      } else if (data.batch == undefined) {
        IonicPopupService.alert("opps", "please enter the batch");
      } else {
        $scope.creatingGame = true;
        // Generate random 6 digit pincode for the game
        var PIN = _.random(100000, 999999);
        FirebaseService.set('currentPinNumber', PIN, {}).then(function (pinRef) {
          var data = {
              'state': 'waitingForPlayers',
          };
          FirebaseService.set('games/$pin', data, {
            pin: PIN
          }).then(function (gameRef) {

            // $location.path('/host/' + PIN); //TODO: do $state.go
          });

        });
        $state.go('gamehostview', {
          'PIN': PIN,
          'sem': data.sem,
          'branch': data.branch,
        });
      }
    }

    // $scope.otpCall=function(){
    //   $http.get(RESOURCES.URL + '/sendOtpUsingTwillo')
    //   .then(function (response) {
    //   debugger
    //   $scope.myWelcome = response.data;
    //   console.log($scope.myWelcome);
    //  });
    // }






  });
