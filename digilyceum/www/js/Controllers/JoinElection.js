angular.module('starter')
  .controller('JoinElectionCtrl', function ($scope, $state, $ionicHistory, sharedUtils, SessionService, IonicPopupService, CommonService,
    UserService, ImageUploadService, $sce, FirebaseService, $ionicPlatform) {
    // $ionicPlatform.ready(function (SessionService, $ionicHistory, $state) {
    //   window.FirebasePlugin.setScreenName("Join Screen");
    // });

    $scope.$on('$ionicView.enter', function () {

    });

    $scope.goBack = function () {
      $ionicHistory.clearCache().then(function () {
        $state.go('tabsController.startPage');
      });
    }

    $scope.joinGame = function (data) {


      if (data != undefined) {
        UserService.getStudentData(data.number).$loaded().then(function (ref) {
          debugger
          $scope.currentPin = FirebaseService.getFBObject('currentPinNumber');
          $scope.currentPin.$loaded().then(function (resp) {
            if (resp.$value != data.game_code) {
              IonicPopupService.alert("Incorrect", "Game code is incorrect..");
            } else {
              $state.go("guestjoingame", {
                "PIN": data.game_code,
                "enrollment_number": data.number,
                "email":ref.email
              });
            }
          });
        });

      } else {
        IonicPopupService.alert("join game", "please enter game code");
      }

    }

  });
