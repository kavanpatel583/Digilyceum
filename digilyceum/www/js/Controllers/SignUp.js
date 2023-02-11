angular.module('starter')
  .controller('SignUpCtrl', function ($scope, $state, $ionicHistory, sharedUtils, SessionService, IonicPopupService, CommonService,sharedUtils,UserService, $ionicPlatform) {

    $scope.user = {};
    $scope.enrollment_number;
    $scope.goBack = function () {
      $ionicHistory.clearCache().then(function () {
        $state.go('login');
      });
    }

    // $ionicPlatform.ready(function (SessionService, $ionicHistory, $state) {
    //   window.FirebasePlugin.setScreenName("Signup Screen");
    // });

    $scope.getStudentData = function (enr) {
      UserService.getStudentData(enr).$loaded().then(function (ref) {
        $scope.user = ref;
      }).catch(function (error) {});
    }


    $scope.signwithEmail = function (user, enrollment_number) {
      sharedUtils.showLoading();
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then(function (result) {
        var userObj = {
          first_name: user.first_name,
          last_name: user.last_name,
          user_name: user.user_name,
          email: user.email,
          enrollment_number: enrollment_number,
          branch: user.branch,
          uid: result.uid,
          prevent: true
        }
        UserService.setUserData(enrollment_number, userObj).then(function (ref) {
          SessionService.setUser(userObj);
          IonicPopupService.alert("Sucess", "User Created sucessfully");
          sharedUtils.hideLoading();
          $ionicHistory.clearCache().then(function () {
            $state.go('tabsController.startPage');
          });
        }).catch(function (error) {
          sharedUtils.hideLoading();
          console.log(error);
        });
      }).catch(function (error) {
        console.log(error);
        sharedUtils.hideLoading();
        IonicPopupService.alert("opps!", error);
      });


    }

  })
