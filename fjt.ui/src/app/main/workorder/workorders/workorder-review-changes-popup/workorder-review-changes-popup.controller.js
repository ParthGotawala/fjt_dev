(function () {
  'use strict';

  angular
    .module('app.workorder')
    .controller('WorkorderReviewChangesPopupController', WorkorderReviewChangesPopupController);

  /** @ngInject */
  function WorkorderReviewChangesPopupController($mdDialog, WORKORDER, data, WorkorderReviewFactory, CORE, BaseService, DialogFactory, $q, WorkorderFactory, USER) {

    const vm = this;
    vm.woNumber = data.woNumber;
    vm.woVersion = data.woVersion;
    vm.PIDCode = data.PIDCode;
    vm.rohsIcon = data.rohsIcon;
    vm.rohsName = data.rohsIcon;
    vm.partID = data.partID;
    vm.emptyState = false;
    //vm.woID = data.woID;
    let woId = data.woID;
    vm.WorkorderReviewStatus = CORE.WorkorderReviewStatus;
    vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.WORKORDER_REVIEW_EMPTY;
    vm.dateTimeDisplayFormat = _dateTimeDisplayFormat;
    vm.LabelConstant = CORE.LabelConstant;
    vm.loginEmpID = BaseService.loginUser.employee.id;
    vm.coOwnerList = [];
    vm.RequestForReviewList = [];
    vm.WorkorderReviewStatusData = angular.copy(CORE.WorkorderReviewStatusData);
    vm.changeRequestFinalStatusList = _.values(vm.WorkorderReviewStatusData);
    vm.isViewPendingReviewCmtCountReq = data.isViewPendingReviewCmtCountReq;
    vm.selectedChangeRequestStatus = data.isViewPendingReviewCmtCountReq ? vm.WorkorderReviewStatusData.Pending.Value : vm.WorkorderReviewStatusData.All.Value;
    vm.CommonEmptyMesssage = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.headerdata = [];

    //get co owner employee list
    let getCoOwnerlist = () => {
      return WorkorderFactory.getCoOwnerEmpList().query({ woID: woId }).$promise.then((response) => {
        if (response && response.data) {
          vm.coOwnerList = response.data;
          return response;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let GetRequestForReviewList = (woId) => {
      return WorkorderReviewFactory.getRequestForReviewBywoID().save({
        woID: woId,
        reqForReviewStatus: vm.isViewPendingReviewCmtCountReq ? vm.WorkorderReviewStatusData.Pending.Value : null
      }).$promise.then((res) => {
        vm.RequestForReviewList = res && res.data ? res.data : [];
        // when display pending review comment count list then display data having more then 0 pending comment
        if (vm.isViewPendingReviewCmtCountReq && vm.RequestForReviewList.length > 0) {
          _.remove(vm.RequestForReviewList, (reqrevItem) => {
            return reqrevItem.totalPendingComment == 0;
          })
        }
        return res;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let pageInit = () => {
      var pageInitPromise = [getCoOwnerlist(), GetRequestForReviewList(woId)];
      vm.cgBusyLoading = $q.all(pageInitPromise).then((responses) => {

        let isLoginUserIsCoOwner = _.some(vm.coOwnerList, (coownerItem) => {
          return coownerItem.employeeID == vm.loginEmpID
        });

        if (vm.RequestForReviewList && vm.RequestForReviewList.length > 0) {
          vm.emptyState = false;
          _.each(vm.RequestForReviewList, (itemData) => {
            if (itemData.accRejStatus) {
              if (itemData.accRejStatus == vm.WorkorderReviewStatus.Pending) {
                itemData.accRejStatusText = vm.WorkorderReviewStatusData.Pending.Key;
              }
              else if (itemData.accRejStatus == vm.WorkorderReviewStatus.Accepted) {
                itemData.accRejStatusText = vm.WorkorderReviewStatusData.Accepted.Key;
              }
              else if (itemData.accRejStatus == vm.WorkorderReviewStatus.Rejected) {
                itemData.accRejStatusText = vm.WorkorderReviewStatusData.Rejected.Key;
              }
            }
            itemData.totalInvitedMembersForReview = _.unionBy(vm.coOwnerList, itemData.workorderReqRevInvitedEmp, 'employeeID').length; // include co-owner in review group member count
            if (itemData.reqGenEmployee) {
              itemData.fullName = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, itemData.reqGenEmployee.initialName, itemData.reqGenEmployee.firstName, itemData.reqGenEmployee.lastName);
            }
            itemData.isDisableViewChangeRequest = !isLoginUserIsCoOwner && itemData.woAuthorID != vm.loginEmpID && !itemData.isLoginUserInvitedForReview;
          });
        }
        else {
          vm.emptyState = true;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    pageInit();
    /* hyperlink go for list page */
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    /* go to particular assy */
    vm.goToPartDetails = () => {
        BaseService.goToComponentDetailTab(null, vm.partID);
      return false;
    };
    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };
    //redirect to work order details
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(woId);
      return false;
    };

    vm.headerdata = [{
      value: vm.PIDCode,
      label: CORE.LabelConstant.Assembly.ID,
      displayOrder: (vm.headerdata.length + 1),
      labelLinkFn: vm.goToPartList,
      valueLinkFn: vm.goToPartDetails,
      isCopy: true,
      imgParms: {
        imgPath: vm.rohsIcon,
        imgDetail: vm.rohsName
      }
    }, {
      label: CORE.LabelConstant.Workorder.WO, value: vm.woNumber,
        displayOrder: (vm.headerdata.length + 1), labelLinkFn: vm.goToWorkorderList,
      valueLinkFn: vm.goToWorkorderDetails
    }, {
        label: CORE.LabelConstant.Workorder.Version, value: vm.woVersion, displayOrder: (vm.headerdata.length + 1)
    }
    ];


    //redirect to work order list
    vm.goToWorkorderReviewDetails = (woID, woRevReqID) => {
      BaseService.goToWorkorderReviewDetails(woID, woRevReqID);
      return false;
    }

    //redirect to work order details
    vm.goToWorkorderOperationReviewDetails = (woID, woOPID, woRevReqID) => {
      BaseService.goToWorkorderOperationReviewDetails(woID, woOPID, woRevReqID);
      return false;
    }

    vm.gotoWorkorder = (woID, woOPID, woRevReqID, isDisableViewChangeRequest) => {
      if (isDisableViewChangeRequest) {
        return false;
      }
      //$mdDialog.cancel(null);
      if (woID && !woOPID) {
        vm.goToWorkorderReviewDetails(woID, woRevReqID);
        //$state.go(WORKORDER.WORKORDER_MANAGE_STATE, { woID: woID, woRevReqID: woRevReqID, openRevReq: true });
        //$state.go(WORKORDER.MANAGE_WORKORDER_DETAILS_STATE, { woID: woID, woRevReqID: woRevReqID, openRevReq: true });
      }
      if (woID && woOPID) {
        vm.goToWorkorderOperationReviewDetails(woID, woOPID, woRevReqID);
        //$state.go(WORKORDER.MANAGE_WORKORDER_OPERATION_DETAILS_STATE, { woID: woID, woOPID: woOPID, woRevReqID: woRevReqID, openRevReq: true });
        //$state.go(WORKORDER.UPDATE_WORKORDER_OPERATION_STATE, { woID: woID, woOPID: woOPID, woRevReqID: woRevReqID, openRevReq: true });
      }

    };

    vm.cancel = () => {
      $mdDialog.cancel(null);
    };



    // view invited employee popup
    vm.displayInvitedPersonnel = (woRevReqID, isDisableViewChangeRequest, woAuthorID) => {
      if (!woRevReqID || isDisableViewChangeRequest) {
        return;
      }

      let data = {
        woID: woId,
        woNumber: vm.woNumber,
        woRevReqID: woRevReqID,
        woAuthorID: woAuthorID
      }
      DialogFactory.dialogService(
        CORE.WO_REQ_REV_INVITED_EMP_MODAL_CONTROLLER,
        CORE.WO_REQ_REV_INVITED_EMP_MODAL_VIEW,
        event,
        data).then(() => {
        }, (cancel) => {
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    }

    // refresh all review list 
    vm.refreshRequestForReviewList = () => {
      vm.selectedChangeRequestStatus = vm.WorkorderReviewStatusData.All.Value;
      pageInit();
    }

  }

})();
