angular.module('starter')
  .controller('GuestJoinGameCtrl', function ($scope, $state, SessionService, $stateParams, Player, Trivia, $location, FirebaseService, $q, $ionicPopup, $ionicHistory, $ionicScrollDelegate, UserService, IonicPopupService, $timeout, $ionicPlatform, $ionicConfig, ElectionService,$http,RESOURCES,sharedUtils) {


    $scope.$on('$ionicView.enter', function () {
      $scope.userObj = SessionService.getUser();
    });

    $ionicPlatform.registerBackButtonAction(function (event) {

      if ($scope.game.state == 'waitingForPlayers' || $scope.game.state == 'question') {
        event.preventDefault();
        IonicPopupService.alert("Back", "You can't go back until you finish the game");
      } else if ($scope.game.state == 'leaderboard') {
        $ionicHistory.clearCache().then(function () {
          $state.go('tabsController.joinelection');
        });
      } else {

      }
    }, 100);


    $scope.goBack = function () {
      if ($scope.game.state === 'leaderboard') {
        var confirmPopup = $ionicPopup.confirm({
          title: 'stop game',
          template: `Are you sure you want to stop game?`
        });
        confirmPopup.then(function (res) {
          if (res) {
            $ionicHistory.clearCache().then(function () {
              $state.go('tabsController.joinelection');
            });
          }
        })

      } else {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Back',
          template: `You can't go back until you finish the game`
        });
        confirmPopup.then(function (res) {
          if (res) {
            // $state.go('hostgame');
          }
        })
      }
    }


    $scope.verifyUserOtp=function(code){
      sharedUtils.showLoading();
      $http.get(RESOURCES.URL + '/verifyOtp?number=' + $scope.game.users[$scope.playerId].phone_no+"&otp="+code )
      .then(function (response) {
        if(response.data=="OTP verified successfully"){
          $scope.playerstatus = {
            status: 'Verify'
          }
          ElectionService.updateGameStatus($stateParams.PIN, $scope.playerId, $scope.playerstatus).then(function (ref) {}).catch(function (error) {
            console.log(error);
          });
          sharedUtils.hideLoading();
          IonicPopupService.alert("Sucess","OTP verified successfully");
        }
        else{
          sharedUtils.hideLoading();
          IonicPopupService.alert("Opps!","OTP verification failed");
        }
        $scope.myWelcome = response.data;
        console.log($scope.myWelcome);
       });
    }

    $scope.resendOtp=function(){
      $http.get(RESOURCES.URL + '/resendOtp?number=' + $scope.game.users[$scope.playerId].phone_no )
      .then(function (response) {

        $scope.myWelcome = response.data;
        console.log($scope.myWelcome);
       });
    }
    $scope.waitingplayer = function () {
      $scope.waitingforplayer = 'Waiting Area';
    }

    //GAME CODE STARTS

    $scope.username = '';
    $scope.enrollment_number = $stateParams.enrollment_number;


    $scope.email = $stateParams.email;
    $scope.resultIndex = 0;
    $scope.join = function (pin, name) {
      var deffered = $q.defer();
      $scope.currentPin = FirebaseService.getFBObject('currentPinNumber');
      $scope.currentPin.$loaded().then(function (resp) {
        $scope.joining = true;
        UserService.getStudentData($scope.enrollment_number).$loaded().then(function(ref){
        console.log(ref.phone_no);
        Player.join(resp.$value, name,$scope.email,ref.phone_no)
          .then(function () {
            $scope.username = $scope.enrollment_number;
            $scope.submitanswer = 0;
            deffered.resolve($scope.enrollment_number);
            //$location.path('/guestjoingame/' + resp.$value) // game.data.users[playerId].questions
          });
         })
      });
      return deffered.promise;
    };

    $scope.join($stateParams.PIN, $scope.enrollment_number, $scope.email).then(function () {
      var date = new Date();
      $scope.starttime = new Date(date).getTime();
      Player.init($stateParams.PIN)
        .then(function () {
          //$scope.clearAnswer();
        })
        .then(function () {
          Player.syncObject.$bindTo($scope, 'game')
            .then(function () {
              // $scope.questions_data = $scope.game.data.users[playerId].questions;
              // $scope.currentQuestion = $scope.game.data.questions[$scope.game.data.currentQuestion];

              // $scope.$watch('game.data.currentQuestion' , function(newValue, oldValue) {
              //   // $scope.clearAnswer();
              //   $scope.currentQuestion = $scope.game.data.questions[$scope.game.data.currentQuestion];
              // });
              $scope.playerId = Player.getUniqId();
              console.log($scope.playerId);
              $scope.$watch('game.state', function (newValue, oldValue) {
                // $scope.clearAnswer();
                $scope.otp={}
                if (newValue == 'stopgame') {
                  IonicPopupService.alert("sorry", "Your game has been stopped by host");
                  $ionicHistory.clearCache().then(function () {
                    $state.go('tabsController.joinelection');
                  });
                }
                if (newValue === 'waitingForPlayers') {
                  $scope.playerstatus = {
                    status: 'Waiting'
                  }
                  $ionicConfig.views.swipeBackEnabled(false);
                  ElectionService.updateGameStatus($stateParams.PIN, $scope.playerId, $scope.playerstatus).then(function (ref) {}).catch(function (error) {
                    console.log(error);
                  });
                }
                console.log($scope.game);
                if (newValue === 'question') {
                  $scope.waitingforplayer = 'digilyceum';
                  $scope.playerstatus = {
                    status: 'Playing'
                  }
                  $ionicConfig.views.swipeBackEnabled(false);
                  ElectionService.updateGameStatus($stateParams.PIN, $scope.playerId, $scope.playerstatus).then(function (ref) {}).catch(function (error) {
                    console.log(error);
                  });

                }
                if (newValue === 'leaderboard') {
                  $scope.calculateResult();
                }

              });

            });

        });
    });

    $scope.finishElection = function () {

      var confirmPopup = $ionicPopup.confirm({
        title: 'Finish Game',
        template: `Are you sure? After you finish you can't review or change your answers`
      });
      confirmPopup.then(function (res) {
        if (res) {
          $scope.submitanswer = 1;
          $scope.status = "Finished";
          Player.saveSelfAttr('status', $scope.status);
        }
      });
    }


    $scope.clearAnswer = function () {
      Player.saveSelfAttr('answer', null);
    }
    $scope.saveAnswer = function (answer) {
      Player.saveSelfAttr('answer', answer);
    };

    $scope.calculateResult = function () {
      ElectionService.getCrCandidatedetails($stateParams.PIN).$loaded().then(function (ref) {
        var candidate = ref;

        for (i = 0; i < candidate.length; i++) {

          var temp = 0;
          for (var playerid in candidate[i].vote) {
            if (candidate[i].vote[playerid] == true) {
              temp = temp + 1
            }
          }
          var count = {
            totalvote: temp
          }
          ElectionService.setResult($stateParams.PIN, i, count).then(function (ref) {

          }).catch(function (error) {

          });
        }
        for (var i = 0; i < candidate.length; i++) { //Number of passes

          for (var j = 0; j < (candidate.length - i - 1); j++) { //Notice that j < (length - i)
            //Compare the adjacent positions
            if (candidate[j].totalvote < candidate[j + 1].totalvote) {
              //Swap the numbers
              var tmp = candidate[j]; //Temporary variable to hold the current number
              candidate[j] = candidate[j + 1]; //Replace current number with adjacent number
              candidate[j + 1] = tmp; //Replace adjacent number with current number
            }
          }
        }
        $scope.candidates = candidate;
      }).catch(function (error) {

      })


    }

    $scope.goToHomePage = function () {
      $state.go('tabsController.startPage');
    }
  });
