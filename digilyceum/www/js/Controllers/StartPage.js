angular.module('starter')
  .controller('StartPageCtrl', function ($scope, $state, $ionicHistory, sharedUtils, SessionService, IonicPopupService, CommonService,
    UserService, $ionicSideMenuDelegate,$ionicPlatform,$ionicModal) {
    // $ionicPlatform.ready(function (SessionService, $ionicHistory, $state) {
    //   window.FirebasePlugin.setScreenName("Home Screen");
    // });
    $scope.$on('$ionicView.enter', function () {
      $scope.currentUser = SessionService.getUser();
      $scope.data={};
    });

    $scope.toggleLeft = function () {
      $scope.currentUser = SessionService.getUser();
      console.log($scope.currentUser);
      $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.login = function () {
      $ionicHistory.clearCache().then(function () {
        $state.go('login');
      });
    }

    $scope.goToChatbotPage=function(){
      $ionicHistory.clearCache().then(function () {
        $state.go('tabsController.chatbot');
      });
    }

    $scope.goToSignUpPage = function () {
      $ionicHistory.clearCache().then(function () {
        $state.go('signup');
      });
    }
    $scope.goToCrDetailPage = function () {
      $ionicHistory.clearCache().then(function () {
        $state.go('tabsController.crdetails');
      });
    }
    $scope.logout = function () {
      var obj = {
        prevent: false
      }
      UserService.setUserPreventButton($scope.currentUser.uid, obj).then(function (ref) {

      }).catch(function (error) {

      });

      SessionService.setUser(null);;
      firebase.auth().signOut().then(function () {
          $ionicHistory.clearCache().then(function () {
            $state.go('login');
          });
        },
        function (error) {
          sharedUtils.showAlert("Error", "Logout Failed")
        });
    };

    $scope.goToHostElectionPage = function () {
      $state.go('hostelection');
    }
    $scope.goToGsDetailsPage = function () {
      $state.go('gsdetails');
    }
    $scope.goToJoinElectionPage = function () {
      $ionicHistory.clearCache().then(function () {
        $state.go('tabsController.joinelection');
      });
    }
    $scope.goToMyAccountPage = function () {
      $ionicHistory.clearCache().then(function () {
        $state.go('myaccount');
      });
    }
    $scope.goToLocalEvent = function () {
      IonicPopupService.alert("opps!", "Functionality coming soon");
    }

    $scope.openFeedbackPage = function () {

      $ionicModal.fromTemplateUrl('templates/complain.html', {
        scope: $scope,
        animation: 'slide-in-up',
      }).then(function (modal) {
        $scope.feedback = modal;
        $scope.feedback.show();
      });
    }
    $scope.closeFeedbackModal = function () {
      $scope.feedback.hide();
    }

  })
