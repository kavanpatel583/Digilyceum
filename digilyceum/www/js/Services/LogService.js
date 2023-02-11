function LogService($log, $window, $location) {

  this.debugEnabled = $window.DEBUG_ENABLED === 'true';

  this.debug = function() {
    if (this.debugEnabled) {
      $log.debug(arguments);
    }
  };

  this.info = function() {
    if (this.debugEnabled) {
      $log.info(arguments);
    }
  };

  this.error = function() {
    $log.error(arguments);
  };


  return this;
}

angular.module('starter').service('LogService', LogService);
