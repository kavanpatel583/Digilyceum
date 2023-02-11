'use strict';

/**
 * @ngdoc service
 * @name kahootCloneApp.Trivia
 * @description
 * # Trivia
 * Service in the kahootCloneApp.
 */
angular.module('starter')
  .service('Trivia', function (_,ElectionService, $q) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var self = this;

    self.getQuestions = function (sem) {
      var deffered = $q.defer();
      ElectionService.getCrCandidate(sem).$loaded().then(function (ref) {

        deffered.resolve(ref);

      }).catch(function (err) {
        deffered.reject(err);
        console.log('Error Occured.');
      });

      return deffered.promise;
    };

    self.getPossibleAnswers = function (question) {
      return _.shuffle([question.answer].concat(question.wrong_answers))
    };

    self.getSuffleWine = function (winelist) {
      return _.shuffle(winelist);
    }

    self.checkAnswer = function (questionText, answer) {
      console.log('Checking:');

      var question = _.find(self.questions, function (q) {
        return q.q == questionText;
      });
      console.log(questionText, answer, question.answer == answer);
      return question.answer == answer;
    }


  });
