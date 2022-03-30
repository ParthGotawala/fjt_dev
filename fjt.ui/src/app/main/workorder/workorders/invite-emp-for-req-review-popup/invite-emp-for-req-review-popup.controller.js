(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('InviteEmpForReqReviewPopupController', InviteEmpForReqReviewPopupController);

  /** @ngInject */
  function InviteEmpForReqReviewPopupController($mdDialog, CORE, BaseService, data, $scope, ChangeRequestFactory, socketConnectionService) {
    const vm = this;
    vm.woDetails = data;
    var loginEmployeeDetails = BaseService.loginUser.employee;

    // invite new people for review
    vm.inviteEmployeeForReview = () => {
      vm.saveDisable = true;
      if (!vm.isInviteUsersEnable && vm.inviteMembersForReviewReqForm) {
        // case when user write only ks in invite user and not select any user from list
        vm.inviteMembersForReviewReqForm.$setPristine();
        vm.inviteMembersForReviewReqForm.$setUntouched();
      }
      if (BaseService.focusRequiredField(vm.inviteMembersForReviewReqForm, false)) {
        vm.saveDisable = false;
        return;
      }
      
      if (vm.woDetails.woRevRequestType == CORE.WorkorderReviewType.InitalDraft) {
        // save employees for initial draft
        $scope.$broadcast('saveInvitePeople');
      }
      else if (vm.woDetails.woRevRequestType == CORE.WorkorderReviewType.ChangeRequest) {

        // save employees for change request
        vm.changeRequestModel = {
          woRevReqID: vm.woDetails.woRevReqID,
          woID: vm.woDetails.woID,
          woOPID: vm.woDetails.woOPID,
          opName: vm.woDetails.opName,
          opID: vm.woDetails.opID,
          reqGenEmployeeID: loginEmployeeDetails.id,
          threadTitle: vm.woDetails.threadTitle,
          description: vm.woDetails.description,
          changeType: vm.woDetails.changeType,
          requestType: vm.woDetails.requestType,
          woAuthorID: vm.woDetails.woAuthorID,
          workorderReqRevInvitedEmp: []
        }

        //vm.changeRequestModel.workorderReqRevInvitedEmp.push({
        //  employeeID: loginEmployeeDetails.id,
        //  timeLine: null,
        //  isCompulsory: false,
        //});

        _.each(vm.employeeReviewList, (emp) => {
          vm.changeRequestModel.workorderReqRevInvitedEmp.push({
            employeeID: emp.id,
            timeLine: emp.timeLine,
            isCompulsory: emp.isCompulsory ? emp.isCompulsory : false
          });
        });

        vm.changeRequestModel.timelineObj = {};
        vm.changeRequestModel.timelineObj.woNumber = vm.woDetails.woNumber;
        vm.changeRequestModel.timelineObj.opName = vm.woDetails.opName;

        var woAuthorObj = _.find(vm.changeRequestModel.workorderReqRevInvitedEmp, function (item) { return item.employeeID == vm.woDetails.woAuthorID; });
        if (!woAuthorObj) {
          vm.changeRequestModel.workorderReqRevInvitedEmp.push({
            employeeID: vm.woDetails.woAuthorID,
            timeLine: null,
            isCompulsory: false
          });
        }
        vm.cgBusyLoading = ChangeRequestFactory.saveChangeRequest().save(vm.changeRequestModel).$promise.then((response) => {
          if (response && response.status == CORE.ApiResponseTypeStatus.SUCCESS) {
            BaseService.currentPagePopupForm.pop();
            let woReqDet = {
              isRefreshAllReq: false,
              isRefreshInvitedMemberListReq: true
            }
            $mdDialog.cancel(woReqDet);
          }
          vm.saveDisable = false;
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
      else {
        $mdDialog.cancel();
      }
    }

    // to make Review Comments & Change Request button enable
    let InviteEmpSavedDone = $scope.$on('InviteEmpSavedDoneFromInviteMembersSection', function (ev, data) {
      if (data && data.isSuccess) {
        let woReqDet = {
          isRefreshAllReq: false,
          isRefreshInvitedMemberListReq: true
        }
        $mdDialog.cancel(woReqDet);
      }
      vm.saveDisable = false;
    });

    //emp data change in invite user page 
    let InviteUsersEnable = $scope.$on('saveButtonEnable', function (ev, data) {
      vm.isInviteUsersEnable = data;
    });

    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.inviteMembersForReviewReqForm) || vm.inviteMembersForReviewReqForm.$dirty;
      if (isdirty) {
        let data = {
          form: vm.inviteMembersForReviewReqForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }

    // to receive messge from socket io connection
    function connectSocket() {
    socketConnectionService.on('message:receive', notificationReceiveListener);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener('message:receive', notificationReceiveListener);
    }
   
    function notificationReceiveListener(message) {
      notificationReceive(message);
    }

    // on notification message receive, called below one common function
    function notificationReceive(message) {
      switch (message.event) {
        case CORE.NOTIFICATION_MESSAGETYPE.REMOVE_EMP_FROM_WO_REQ_REVIEW.TYPE:
          //if (message.data && message.data.woRevReqID && vm.selectedReviewChange && vm.selectedReviewChange.woRevReqID == message.data.woRevReqID) {
          //  let woReqDet = {
          //    isRefreshAllReq: true
          //  }
          //  $mdDialog.cancel(woReqDet);
          //}
          break;
      }
    }

    $scope.$on('$destroy', function () {
      // Remove socket listeners
      //console.info("Socket $destroy: message:receive");
      InviteEmpSavedDone();
      InviteUsersEnable();
      removeSocketListener();
    });

    //on load submit form 
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.inviteMembersForReviewReqForm);
    });
  }
})();
