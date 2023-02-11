angular.module('starter')
  .controller('ChatbotCtrl', function ($scope, $state,$ionicHistory) {

    $scope.goBack = function () {
      $ionicHistory.clearCache().then(function () {
        $state.go('tabsController.startPage');
      });
    }
  });
