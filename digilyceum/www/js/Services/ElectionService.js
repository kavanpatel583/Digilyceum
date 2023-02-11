angular.module('starter')

  .service('ElectionService', function ($q, FirebaseService) {


    this.getCrCandidate = function (sem) {
      var ref = FirebaseService.getFBRef('/candidate_details', {}, {
        "orderByChild": "semester",
        "equalTo": sem
      });
      return FirebaseService.getFBArrayFromRef(ref);
    }
    this.getGameObject = function (pin) {
      return FirebaseService.getFBObject('/games/$pin', {
        pin: pin
      });
    }
    this.updateGameStatus = function (pin, playerid, status) {
      return FirebaseService.update('/games/$pin/users/$playerid', status, {
        pin: pin,
        playerid: playerid
      });
    }
    this.getCrCandidatedetails = function (pin) {
      return FirebaseService.getFBArray('/games/$pin/questions', {
        pin: pin
      });
    }
    this.setResult = function (pin, index, data) {
      return FirebaseService.update('/games/$pin/questions/$index', data, {
        pin: pin,
        index: index
      });
    }
  })
