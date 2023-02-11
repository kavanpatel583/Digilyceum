angular.module('starter')
  .controller('GameHostViewCtrl', function ($scope, $state, $stateParams, AdminService, SessionService,
    Host, Trivia, $location, $interval, _, $ionicPopup, $ionicModal, Player, ElectionService, $http, RESOURCES) {
    $scope.rank = 0;
    $scope.userObj = SessionService.getUser();
    $scope.goBack = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: 'stop game',
        template: 'Are you sure you want to stop game?'
      });
      confirmPopup.then(function (res) {
        if (res) {
          if ($scope.game.state == 'leaderboard') {
            $state.go('hostelection');
          } else {
            $state.go('hostelection');
            $scope.game.state = 'stopgame';
          }
        }
      })
    }


    $scope.goToHomePage = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: 'stop game',
        template: 'Are you sure you want to stop game?'
      });
      confirmPopup.then(function (res) {
        if (res) {
          $state.go('tabsController.startPage');
        }
      })
    }

    $scope.Game_code = $stateParams.PIN;
    $scope.sem = $stateParams.sem;
    $scope.branch = $stateParams.branch;


    Host.init($stateParams.PIN)
      .then(function (respData) {
        var date = new Date();
        $scope.starttime = new Date(date).getTime();
        console.log($scope.starttime);
        return Host.setupGame($stateParams.sem)
      })
      .then(function () {
        Host.syncObject.$bindTo($scope, 'game');
        $scope.$watch('game.state', function (newValue, oldValue) {

          switch (newValue) {

            case 'preQuestion':
              $scope.countdown = 5;
              $interval(function () {
                  $scope.countdown--;
                }, 1000, $scope.countdown)
                .then(function () {
                  Host.setGameState('question');
                });
              break;

            case 'question':
              ElectionService.getGameObject($scope.Game_code).$loaded().then(function (resp) {
                debugger
                let data = resp;
                Object.keys(data.users).map(function(key, index) {
                  console.log(key);
                });
                // for (const values of data.users) {
                //   console.log(values);
                // }
              }).catch(function (error) {

              })
              $scope.currentQuestion = Host.getCurrentQuestion();
              console.log($scope.currentQuestion);
              $scope.countdown = 7;
              break;

            case 'verification':

             $http.get(RESOURCES.URL + '/sendOtp?electionCode=' + $scope.Game_code)
             .then(function (response) {
               $scope.myWelcome = response.data;
               console.log($scope.myWelcome);
              });
              break;

            case 'leaderboard':
              $scope.calculateResult();

          }
        })
      });

    $scope.startGame = function () {
      $scope.hidestopbtn = true;
      $scope.showtext = true;
      $scope.game.state = 'preQuestion';
    };

    $scope.nextQuestion = function () {
      // $scope.game.data.currentQuestion++;
      Host.nextQuestion();
    };

    $scope.verificationStep=function(){
      $scope.game.state = 'verification';
    }
    $scope.endGame = function () {
      Host.setGameState('leaderboard');
      $scope.showtext = false;
    };
    //HOST GAME LOGIC ENDS


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
