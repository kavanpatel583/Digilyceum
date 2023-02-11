angular.module('starter')
  .controller('GsdetailsCtrl', function ($scope, $state, $ionicHistory, sharedUtils, SessionService, IonicPopupService, CommonService,
    UserService, ImageUploadService, $sce, $cordovaSms) {

    $scope.goBack = function () {
      $ionicHistory.clearCache().then(function () {
        $state.go('tabsController.startPage');
      });
    }
    // UserService.getstudent().$loaded().then(function (ref) {
    //   debugger
    //   $scope.data = ref;
    //   for (i = 0; i < $scope.data.length; i++) {
    //     var obj = {
    //       adhar_no: $scope.data[i].AadharNo,
    //       admission_year: $scope.data[i].AdmissionYear,
    //       date_of_birth: $scope.data[i].BirthDate,
    //       email: $scope.data[i].Email,
    //       first_name: $scope.data[i].FirstName,
    //       last_name: $scope.data[i].LastName,
    //       enrollment_number: $scope.data[i].column0,
    //       gender: $scope.data[i].Gender,
    //       state: $scope.data[i].PermanentState,
    //       city: $scope.data[i].PermanentCity,
    //       zip_code: $scope.data[i].BirthDate,
    //       phone_no: $scope.data[i].PermanentZipCode
    //     }
    //     UserService.setdata($scope.data[i].column0,obj).then(function (ref) {}).catch(function (error) {
    //       console.log("error" + error);
    //     });
    //   }

    //   debugger
    // }).catch(function (error) {
    //   console.log("error" + error);
    // });
    // $scope.a1 = [76, 89, 65, 64, 78, 76, 61, 72, 79, 67, 68, 74, 82, 56];
    // UserService.getStudentResult().$loaded().then(function (ref) {
    //   var data = ref;
    //   debugger
    //   for (i = 0; i < data.length; i++) {
    //     var obj = {
    //       attendence:$scope.a1[i]
    //     }
    //     UserService.setattendance(data[i].$id,obj).then(function (ref) {

    //     }).catch(function (error) {
    //       console.log("error" + error);
    //     });
    //   }
    // }).catch(function (error) {
    //   console.log("error" + error);
    // });



    $scope.storedata = function (user) {

      var obj = {
        enrollment_number: user.enrollment_number,
        branch: user.branch,
        semester: user.semester,
        cgpa: user.cgpa,
        cpi: user.cpi,
        spi: user.spi,
        fee_payment: user.fee_payment,
        attendence: user.attendence
      }
      UserService.setStudentResult(obj).$loaded().then(function (ref) {
        IonicPopupService.alert("sucess","data store sucessfully");
      }).catch(function (error) {
        console.log("error" + error);
      });
      // var userObj = {
      //   first_name: user.first_name,
      //   last_name: user.last_name,
      //   email: user.email,
      //   phone_no: user.phone_no,
      //   enrollment_number: user.enrollment_number,
      //   gender: user.gender,
      //   city: user.city,
      //   state: user.state,
      //   pincode: user.pincode,
      //   adhar_no: user.adhar_no,
      //   date_of_birth: user.date_of_birth
      // }
      // UserService.setdata(user.enrollment_number, userObj).then(function (error) {

      // }).catch(function (error) {
      //   console.log("error" + error);
      // });
    }


    $scope.sendotp = function () {
      var url = "https://us-central1-digilyceum-15c27.cloudfunctions.net/sendOtp";
      UserService.senotp(url).then(function (ref) {
        $scope.data = ref;
      }).catch(function (error) {
        console.log(error);
      });

      // document.addEventListener("deviceready", function () {
      //   var options = {
      //     replaceLineBreaks: false, // true to replace \n by a new line, false by default
      //     android: {
      //       intent: 'INTENT' // send SMS with the default SMS app
      //       //intent: ''        // send SMS without open any other app
      //     }
      //   }

      //   $cordovaSms.send('+917567648784', 'SMS content', options)
      //     .then(function () {
      //       debugger
      //       // Success! SMS was sent
      //     }, function (error) {
      //       alert(error);
      //       // An error occurred
      //     });

      // });
    }


  });
