angular.module('starter')
.service('CommonService', ['$http', 'IonicPopupService', function( $http, IonicPopupService) {

  this.validateEmpty = function(value, failTitle, failMessage) {
    if (!!value && value !== '') {
      return true;
    } else {
      IonicPopupService.alert(failTitle, failMessage);
      return false;
    }
  };

  this.validateEmail = function(email, failTitle, failMessage) {
    console.log('email: ' + email);
    var re = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (re.test(email) !== true) {
      console.log('its false');
      IonicPopupService.alert(failTitle, failMessage);
      return false;
    } else {
      console.log('its true');
      return true;
    }
  };

  this.compairePassword = function(password, confirmPassword, failTitle, failMessage) {
    if (password != confirmPassword) {
      console.log('its false');
      IonicPopupService.alert(failTitle, failMessage);
      return false;
    } else if (!!password && !!confirmPassword) {
      console.log('yes true');
      return true;
    }
  };
}]);
