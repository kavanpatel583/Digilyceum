angular.module('starter')
  .controller('TabsCtrl', function ($scope, $state, $ionicHistory, sharedUtils, SessionService, IonicPopupService, CommonService,
    UserService) {

    $scope.goToHomePage = function () {
      $ionicHistory.clearCache().then(function () {
        $state.go('tabsController.startPage');
      });
    }

    $scope.goToElectionPage = function () {
      IonicPopupService.alert("opps!", "Functionality coming soon");
    }

    $scope.goTosubjectSelcetionPage = function () {
      IonicPopupService.alert("opps!", "Functionality coming soon");
    }
    $scope.goToChatbotPage=function(){
      $ionicHistory.clearCache().then(function () {
        $state.go('tabsController.chatbot');
      });
    }
    $scope.goToJoinElectionPage = function () {
      $ionicHistory.clearCache().then(function () {
        $state.go('tabsController.joinelection');
      });
    }

  })
