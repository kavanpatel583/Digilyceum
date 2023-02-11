angular.module('starter')
  .controller('CrDetailsCtrl', function ($scope, $state, $ionicHistory, sharedUtils, SessionService, IonicPopupService, CommonService,
    UserService, ImageUploadService, $sce, AdminService) {
    $scope.goBack = function () {
      $ionicHistory.clearCache().then(function () {
        $state.go('tabsController.startPage');
      });
    }
    $scope.userObj = SessionService.getUser();
    $scope.user = {};
    $scope.goToUploadDocumentPage = function (user) {
      if (!!user.enrollment_number) {
        UserService.getCrResultData(user.enrollment_number).$loaded().then(function (ref) {
          let data = ref;
          for (i = 0; i < data.length; i++) {
            if (data[i].semester == user.semester) {
              UserService.setCrCandidatedata(user.enrollment_number, data[i]).then(function (ref) {

              }).catch(function (error) {
                console.log("error" + error);
              });
              AdminService.setPendingList(user.enrollment_number, data[i]).then(function (ref) {}).catch(function (error) {
                console.log("error" + error);
              });
            }
          }
        }).catch(function (error) {
          console.log("error" + error);
        });
        UserService.getStudentData(user.enrollment_number).$loaded().then(function (ref) {
          let data = ref;

          UserService.setCrCandidatedata(user.enrollment_number, data).then(function (ref) {

          }).catch(function (error) {
            console.log("error" + error);
          });
          AdminService.setPendingList(user.enrollment_number, data).then(function (ref) {}).catch(function (error) {
            console.log("error" + error);
          });
        }).catch(function (error) {
          console.log()
        });
        $ionicHistory.clearCache().then(function () {
          $state.go('uploaddocument', {
            'crenrollmentnumber': user.enrollment_number,

          })
        });

      } else {
        IonicPopupService.alert("opps", "please enter the enrollment number");
      }
    }

  });
