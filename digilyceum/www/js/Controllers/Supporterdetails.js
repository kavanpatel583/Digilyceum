angular.module('starter')
  .controller('SupporterDetailsCtrl', function ($scope, $state, $ionicHistory, sharedUtils, SessionService, IonicPopupService, CommonService,
    UserService, ImageUploadService, $sce, $stateParams,AdminService) {
    $scope.goBack = function () {
      $ionicHistory.clearCache().then(function () {
        $state.go('uploaddocument', {
          'crenrollmentnumber': $scope.cr_id
        });
      });
    }
    $scope.userObj = SessionService.getUser();

    $scope.cr_id = $stateParams.crenrollmentnumber;

    $scope.user = {};
    $scope.goToUploadDocumentPage = function (user) {

      if (!!user.enrollment_number) {
        UserService.getCrResultData(user.enrollment_number).$loaded().then(function (ref) {
          let data = ref;
          for (i = 0; i < data.length; i++) {
            if (data[i].semester == user.semester) {
              UserService.setSupporterCandidatedata($scope.cr_id,user.enrollment_number, data[i]).then(function (ref) {

              }).catch(function (error) {
                console.log("error" + error);
              });
              AdminService.setSupporterList($scope.cr_id,user.enrollment_number, data[i]).then(function (ref) {}).catch(function (error) {
                console.log("error" + error);
              });
            }
          }
        }).catch(function (error) {
          console.log("error" + error);
        });
        UserService.getStudentData(user.enrollment_number).$loaded().then(function (ref) {
          let data = ref;
          UserService.setSupporterCandidatedata($scope.cr_id,user.enrollment_number, data).then(function (ref) {

          }).catch(function (error) {
            console.log("error" + error);
          });
          AdminService.setSupporterList($scope.cr_id,user.enrollment_number, data).then(function (ref) {}).catch(function (error) {
            console.log("error" + error);
          });
        }).catch(function (error) {
          console.log()
        });
        $ionicHistory.clearCache().then(function () {
          $state.go('uploadsupporterdocument', {
            'supporterenrollmentnumber': user.enrollment_number,
            'crenrollmentnumber': $scope.cr_id
          })
        });

      } else {
        IonicPopupService.alert("opps", "please enter the enrollment number");
      }
    }

  });
