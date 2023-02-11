'use strict';

/**
 * @ngdoc service
 * @name kahootCloneApp.Host
 * @description
 * # Host
 * Service in the kahootCloneApp.
 */
angular.module('starter')
  .service('Host', function (FirebaseService, Trivia, $q) {
    var self = this,
      _so;

    self.init = function (PIN) {
      self.syncObject = FirebaseService.getFBObject('/games/$pin', {

        pin: PIN
      }); //fbutil.syncObject('games/' + PIN);
      _so = self.syncObject;
      return self.syncObject.$loaded();
    };

    self.setupGame = function (sem) {
      var deffered = $q.defer();
      if (!_so.hasOwnProperty('questions')) {
        Trivia.getQuestions(sem).then(function (que) {
          _so.questions = que;
          _so.currentQuestion = 0;
          _so.$save().then(function (ref) {
            deffered.resolve(ref);
          }).catch(function (err) {
            console.log('err : ' + err);
          });
          // deffered.resolve(_so.data.questions);
        });
      } else {
        deffered.resolve(_so.questions);
      }
      return deffered.promise;
    };

    self.getCurrentQuestion = function () {
      return _so.questions[_so.currentQuestion];
    };

    self.setGameState = function (state) {
      _so.state = state;
      return _so.$save();
    };

    self.nextQuestion = function () {
      _so.state = 'preQuestion';
      _so.currentQuestion++;
      return _so.$save();
    }

  });
