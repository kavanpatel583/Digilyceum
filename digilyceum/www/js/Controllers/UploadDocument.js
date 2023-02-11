angular.module('starter')
  .controller('UploadDocumentCtrl', function ($scope, $state, $ionicHistory, sharedUtils, SessionService, IonicPopupService, CommonService,
    UserService, ImageUploadService, $sce, $stateParams) {
    $scope.goBack = function () {

      $ionicHistory.clearCache().then(function () {
        $state.go('tabsController.crdetails');
      });

    }
    $scope.userObj = SessionService.getUser();

    $scope.cr_id = $stateParams.crenrollmentnumber;
    // $scope.supporter_id = $stateParams.supporterenrollmentnumber;
    // $scope.goToSupporterdetailsPage = function () {
    //   $ionicHistory.clearCache().then(function () {
    //     $state.go('supporterdetails', {
    //       'crenrollmentnumber': $scope.cr_id,

    //     });
    //   });
    // }

    $scope.UploadAgeProof = function (event) {
      var files = event.target.files;
      ImageUploadService.uploadImage('UploadedImages/AgeProofImage/', 'winelist_', files[0]).then(function (snapshot) {
        $scope.AgeProofObj = {
          "ageProofPhoto": snapshot.downloadURL
        }
      }).catch(function (error) {
        console.log("Error At file upload : " + angular.toJson(error));
      });
    };

    $scope.UploadResidenceProof = function (event) {
      var files = event.target.files;
      ImageUploadService.uploadImage('UploadedImages/ResidenceProofImage/', 'winelist_', files[0]).then(function (snapshot) {
        $scope.ResidenceProofObj = {
          "residenceProofPhoto": snapshot.downloadURL
        }
      }).catch(function (error) {
        console.log("Error At file upload : " + angular.toJson(error));
      });
    };

    $scope.UploadFessReceipt = function (event) {
      var files = event.target.files;
      ImageUploadService.uploadImage('UploadedImages/FessReceiptImage/', 'winelist_', files[0]).then(function (snapshot) {
        $scope.FessReceiptObj = {
          "fessReceiptPhoto": snapshot.downloadURL
        }
      }).catch(function (error) {
        console.log("Error At file upload : " + angular.toJson(error));
      });
    }
    $scope.UploadRecentMarkSheet = function (event) {
      var files = event.target.files;
      ImageUploadService.uploadImage('UploadedImages/RecentMarkSheetImage/', 'winelist_', files[0]).then(function (snapshot) {
        $scope.RecentMarkSheetObj = {
          "recentMarkSheetPhoto": snapshot.downloadURL
        }
      }).catch(function (error) {
        console.log("Error At file upload : " + angular.toJson(error));
      });
    }
    $scope.UploadHscMarkSheet = function (event) {
      var files = event.target.files;
      ImageUploadService.uploadImage('UploadedImages/HscMarkSheet/', 'winelist_', files[0]).then(function (snapshot) {
        $scope.HscMarkSheetObj = {
          "hscMarkSheetPhoto": snapshot.downloadURL
        }
      }).catch(function (error) {
        console.log("Error At file upload : " + angular.toJson(error));
      });
    }
    $scope.UploadIcard = function (event) {
      var files = event.target.files;
      ImageUploadService.uploadImage('UploadedImages/IcardImage/', 'winelist_', files[0]).then(function (snapshot) {
        $scope.IcardObj = {
          "IcardPhoto": snapshot.downloadURL
        }
      }).catch(function (error) {
        console.log("Error At file upload : " + angular.toJson(error));
      });
    }
    $scope.trustSrc = function (src) {
      return $sce.trustAsResourceUrl(src);
    };


    $scope.goToSupporterdetailsPage = function () {

      $scope.userdata = {
        ageProofPhoto: $scope.AgeProofObj,
        residenceProofPhoto: $scope.ResidenceProofObj,
        fessReceiptPhoto: $scope.FessReceiptObj,
        hscMarkSheetPhoto: $scope.HscMarkSheetObj,
        recentMarkSheetPhoto: $scope.RecentMarkSheetObj,
        icardphoto: $scope.IcardObj,
      }
      UserService.setCrDocument($scope.cr_id, $scope.userdata).then(function (ref) {
        // $scope.AgeProofObj = "";
        // $scope.ResidenceProofObj = "";
        // $scope.FessReceiptObj = "";
        // $scope.HscMarkSheetObj = "";
        // $scope.RecentMarkSheetObj = "";
        // $scope.IcardObj = "";
        $state.go('supporterdetails', {
          'crenrollmentnumber': $scope.cr_id,
        });
        sharedUtils.showAlert("upload", "document upload sucessfully");
      }).catch(function (error) {
        console.log(error);
      })
    }

  });
