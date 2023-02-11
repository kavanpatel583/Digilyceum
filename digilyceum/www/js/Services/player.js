'use strict';

/**
 * @ngdoc service
 * @name kahootCloneApp.Player
 * @description
 * # Player
 * Service in the kahootCloneApp.
 */
angular.module('starter')
  .service('Player', function (FirebaseService, _, $q, Trivia, ElectionService) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var self = this,
      _so;

    self.getUniqId = function () {
      // generate a unique idenftifier for the player and save it in a cookie to allow refreshes
      if (localStorage.getItem('playerId')) {
        return self._id = localStorage.getItem('playerId');
      } else {
        localStorage.setItem('playerId', _.random(0, 999999999));
        return self._id = localStorage.getItem('playerId');
      }
    };

    self._connect = function () {
      // common function between self.join, and self.init
      // creates a connection to firebase backend
      self.syncObject = FirebaseService.getFBObject('/games/$pin', {
        pin: self.PIN
      }); //fbutil.syncObject('games/' + self.PIN);
      _so = self.syncObject;
      return _so.$loaded()
    }

    self.join = function (PIN, screenName, email,phone_no) {
      // register this user to a specific game (identified by PIN)
      var deffered = $q.defer();
      self.PIN = PIN;
      self.screenName = screenName;
      return self._connect(PIN)
        .then(function () {
          // if a /users  node doesn't exist yet, create it
          if (!_so.hasOwnProperty('users')) {
            _so.users = {};
          }
          ElectionService.getGameObject(PIN).$loaded().then(function (ref) {
            var game = ref;
            debugger
            _so.users[self.getUniqId()] = {
              screen_name: screenName,
              questions: game.questions,
              email: email,
              phone_no:phone_no,

            };
            _so.$save().then(function (ref) {
              deffered.resolve(ref);
            }).catch(function (err) {
              console.log('err : ' + err);
            });

          }).catch(function (error) {
            console.log(error);
          });



          // register this players info on the /users node
          // so host and other players are aware of them
          // _so.data.users[self.getUniqId()] = {
          // 	screen_name : screenName
          // };
          return deffered.promise;
          // return _so.$save();
        });

    };

    self.init = function (PIN) {
      // get unique id from cookie store and connect to backend
      self.getUniqId();
      self.PIN = PIN;
      return self._connect()
    };

    self.saveSelfAttr = function (attr, val) {
      console.log(_so);
      if (!_so.hasOwnProperty('users')) {
        _so.users = {};
        console.log(_so.users);
      }
      _so.users[self._id][attr] = val;
      return _so.$save();
    }

    self.saveSelfAttr1 = function (attr, val, selfid) {
      console.log(_so);
      console.log(selfid);
      if (!_so.hasOwnProperty('users')) {
        _so.users = {};
        console.log(_so.users);
      }
      _so.users[selfid][attr] = val;
      return _so.$save();
    }
    self.getUserName = function () {
      return self.screenName;
    }

  });
