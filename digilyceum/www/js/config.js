var myApp = angular.module("starter");

myApp.constant('RESOURCES', (function () {

  const url = "https://us-central1-digilyceum-15c27.cloudfunctions.net/api";
  return {
    URL: url,

  }
})());
