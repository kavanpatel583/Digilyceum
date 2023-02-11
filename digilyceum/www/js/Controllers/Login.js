angular.module('starter')
  .controller('LoginCtrl', function ($scope, $state, $ionicHistory, SessionService, IonicPopupService, sharedUtils, UserService) {
    // $ionicPlatform.ready(function (SessionService, $ionicHistory, $state) {
    //   window.FirebasePlugin.setScreenName("Login Screen");
    // });


    $scope.loginwithEmail = function (user) {
      sharedUtils.showLoading();
      if (!!user) {
        UserService.getUserData(user.enrollment_number).$loaded().then(function (resp) {

          if (!!resp.email) {
            firebase.auth().signInWithEmailAndPassword(resp.email, user.password).then(function (result) {
              let userObject = $scope.setUserObject(resp);
              SessionService.setUser(userObject);
              sharedUtils.hideLoading();
              $ionicHistory.clearCache().then(function () {
                $state.go('tabsController.startPage');
              });
            }).catch(function (error) {
              IonicPopupService.alert("opps!", error);
            });
          } else {
            debugger
            sharedUtils.hideLoading();
            IonicPopupService.alert("opps!", "Invalid Data");
          }
        }).catch(function (error) {
          IonicPopupService.alert("opps!", error);
        });
      }
      else{
        sharedUtils.hideLoading();
        IonicPopupService.alert("opps!", "Please fill the data");
      }
    }


    $scope.setUserObject = function (Obj) {
      let userObject = {
        adhar_no: Obj.adhar_no,
        admission_year: Obj.admission_year,
        city: Obj.city,
        date_of_birth: Obj.date_of_birth,
        email: Obj.email,
        enrollment_number: Obj.enrollment_number,
        first_name: Obj.first_name,
        gender: Obj.gender,
        last_name: Obj.last_name,
        phone_no: Obj.phone_no,
        state: Obj.state,
        zip_code: Obj.zip_code,
        uid: Obj.uid
      }
      return userObject;
    }

    $scope.goToSignUpPage = function () {
      $ionicHistory.clearCache().then(function () {
        $state.go('signup');
      });
    }

  })
