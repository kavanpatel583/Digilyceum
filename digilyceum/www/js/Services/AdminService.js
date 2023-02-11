angular.module('starter')
  .service('AdminService', function ($q, FirebaseService) {
    admin_id = "WFgstLSVn6SPVt2eF0uDHnZf55L2";
    this.createAdmin = function (user_data) {
      return FirebaseService.update('/admin/$admin_id/', user_data, {
        admin_id: admin_id,
      });
    }
    this.updatetoken = function (data) {
      return FirebaseService.update('/admin/$admin_id/', data, {
        admin_id: admin_id,
      });
    }
    this.getAdminData = function () {
      return FirebaseService.getFBObject('/admin/$admin_id/', {
        admin_id: admin_id,
      });
    }
    this.setPendingList = function (id, data) {
      return FirebaseService.update('/admin/$admin_id/pendingrequest/$id', data, {
        admin_id: admin_id,
        id: id,
      });
    }
    this.setSupporterList=function(cr_id,supporter_id,data){
      return FirebaseService.update('/admin/$admin_id/pendingrequest/$cr_id/supporter/$supporter_id', data, {
        admin_id: admin_id,
        cr_id:cr_id,
        supporter_id:supporter_id
      });
    }
  });
