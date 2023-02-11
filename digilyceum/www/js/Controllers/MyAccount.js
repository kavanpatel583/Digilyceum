angular.module('starter')
    .controller('MyAccountCtrl', function ($scope, $state, $ionicHistory, sharedUtils, SessionService, IonicPopupService,UserService, RESOURCES,  $ionicPopup) {

        $scope.userData = SessionService.getUser();


        //End of update user data

        $scope.goBack = function () {
            $state.go('tabsController.startPage');
        };
        UserService.getUserData($scope.userData.enrollment_number).$loaded().then(function(ref){
          $scope.userObj=ref;
        })
    });
