angular.module('starter')
  .service('SessionService', [function SessionFunction($rootScope, $ionicHistory) {

    var Session = {
      user: null,

      getUser: function () {
        let user = localStorage.getItem("user");
        return JSON.parse(user);
      },
      setUser: function (data) {
        let user = JSON.stringify(data);
        localStorage.setItem("user", user);
      },
      getFirstTimeLogin: function () {
        return localStorage.getItem("firstTimeLogin");
      },
      setFirstTimeLogin: function () {
        localStorage.setItem("firstTimeLogin", "yes");
      },
      getUserLocation: function () {
        Session.userLocation = localStorage.getItem("userLocation");
        return JSON.parse(Session.userLocation);
      },
      setUserLocation: function (data) {
        Session.userLocation = JSON.stringify(data);
        localStorage.setItem("userLocation", Session.userLocation);
      },
      getTotalPrice: function () {
        Session.price = localStorage.getItem("price");
        return JSON.parse(Session.price);
      },
      setTotalPrice: function (data) {
        Session.price = JSON.stringify(data);
        localStorage.setItem("price", Session.price);
      },
      getTotalItem: function () {
        Session.item = localStorage.getItem("item");
        return JSON.parse(Session.item);
      },
      setTotalItem: function (data) {
        Session.item = JSON.stringify(data);
        localStorage.setItem("item", Session.item);
      },
      getTotalWeight: function () {
        Session.weight = localStorage.getItem("weight");
        return JSON.parse(Session.weight);
      },
      setTotalWeight: function (data) {
        Session.weight = JSON.stringify(data);
        localStorage.setItem("weight", Session.weight);
      },
      getLocation: function () {
        let loc = localStorage.getItem("location");
        return JSON.parse(loc);
      },
      setLocation: function (data) {
        let loc = JSON.stringify(data);
        localStorage.setItem("location", loc);
      },

      isLoggedIn: function () {
        if (!!Session.getUser()) {
          return true;
        } else {
          return false;
        }
      },
      cache: {},

    };
    return Session;
  }]);
