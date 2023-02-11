angular.module('starter')
.service('IonicPopupService', ['$ionicPopup', function($ionicPopup) {

  this.alert = function(title, message) {
    return $ionicPopup.alert({
      title: title,
      template: message
    });
  };

  this.confirm = function(title, message) {
    return $ionicPopup.confirm({
      title: title,
      template: message
    });
  };


  // this.showPopup = function() {

  //   // An elaborate, custom popup
  //   var myPopup = $ionicPopup.show({
  //     template: '<input type="checkbox" ng-model="data.album">',
  //     title: 'Rsvp',
  //     subTitle: 'I would like to attend',
  //     // scope: $scope,
  //     buttons: [{
  //       text: 'Cancel'
  //     }, {
  //       text: '<b>Save</b>',
  //       type: 'button-positive',
  //       onTap: function(e) {
  //         // if (!$scope.data.album) {
  //         //   //don't allow the user to close unless he enters wifi password
  //         //   e.preventDefault();
  //         // } else {
  //         return;
  //         // }
  //       }
  //     }, ]
  //   });

  // };

}]);
