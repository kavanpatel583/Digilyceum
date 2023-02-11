angular.module('starter')

  .service('UserService', function ($q, FirebaseService, $http) {

    this.setUserData = function (user_id, data) {
      return FirebaseService.update('/users/$user_id', data, {
        user_id: user_id
      });
    };

    this.getUserData = function (user_id) {
      return FirebaseService.getFBObject('/users/$user_id', {
        user_id: user_id
      });
    };
    this.getStudentData = function (enr) {
      return FirebaseService.getFBObject('/student_information/$enr', {
        enr: enr
      });
    }
    this.setFacebookLoginData = function (user_id, data) {
      return FirebaseService.update('/users/$user_id', data, {
        user_id: user_id
      });
    }
    this.setCrData = function (user_id, data) {
      return FirebaseService.update('/computer engineering/$user_id', data, {
        user_id: user_id
      });
    }
    this.getEnrollmentNumberData = function (number) {
      return FirebaseService.getFBObject('/enrollmentnumber/$number', {
        number: number
      });
    }
    this.setdata = function (number, data) {
      return FirebaseService.update('/student_information/$number', data, {
        number: number
      });
    }
    this.getstudent = function () {
      return FirebaseService.getFBArray('/student/', {});
    }
    this.setStudentResult = function (data) {
      return FirebaseService.pushAsFBObject('/student_result', data, {

      });
    }
    this.getStudentResult = function () {
      return FirebaseService.getFBArray('/student_result', {

      });
    }
    this.setattendance = function (id, data) {
      return FirebaseService.update('/student_result/$id', data, {
        id: id
      });
    }
    this.setCrCandidatedata = function (id, data) {
      return FirebaseService.update('/candidate_details/$id', data, {
        id: id
      });
    }
    this.setSupporterCandidatedata = function (cr_id, supporter_id, data) {
      return FirebaseService.update('/candidate_details/$cr_id/supporter/$supporter_id,', data, {
        cr_id: cr_id,
        supporter_id: supporter_id
      });
    }
    this.setCrDocument = function (id, data) {
      return FirebaseService.update('/candidate_details/$id/document', data, {
        id: id
      });
    }
    this.getCrResultData = function (enr_no) {
      debugger
      var ref = FirebaseService.getFBRef('/student_result', {}, {
        "orderByChild": "enrollment_number",
        "equalTo": enr_no
      });
      return FirebaseService.getFBArrayFromRef(ref);
    }
    this.getStudentData = function (enr_no) {
      return FirebaseService.getFBObject('/student_information/$enr_no', {
        enr_no: enr_no
      });
    }
    this.getJoinUserData = function (enrno) {
      var ref = FirebaseService.getFBRef('/student_result', {}, {
        "orderByChild": "enrollment_number",
        "equalTo": enrno
      });
      return FirebaseService.getFBArrayFromRef(ref);
    }
    // this.getUserIsAvailable = function (enrno) {
    //   var ref = FirebaseService.getFBRef('/user', {}, {
    //     "orderByChild": "enrollment_number",
    //     "equalTo": enrno
    //   });
    //   return FirebaseService.getFBArrayFromRef(ref);
    // }

    this.senotp = function (url) {
      return $http.get(url).then(function (data) {
        return data.data;
      });
    };
    this.setUserPreventButton = function (user_id, data) {
      return FirebaseService.update('/users/$user_id/', data, {
        user_id: user_id
      });
    }
  });
