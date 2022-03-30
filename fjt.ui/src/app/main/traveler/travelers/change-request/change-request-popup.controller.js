(function () {
  'use strict';

  angular
    .module('app.traveler.travelers')
    .controller('ChangeRequestPopupController', ChangeRequestPopupController);

  /** @ngInject */
  function ChangeRequestPopupController($mdDialog, CORE, BaseService, ChangeRequestFactory, data, TRAVELER, WORKORDER, DialogFactory) {
    const vm = this;
    var employeeDetails = BaseService.loginUser.employee;
    var woID = data.woID;
    var opID = data.opID;
    var woOPID = data.woOPID;
    var loginUserFullName = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, employeeDetails.initialName, employeeDetails.firstName, employeeDetails.lastName);
    vm.taToolbar = CORE.Toolbar;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.woNumber = null;
    vm.opName = null;
    vm.opNumber = null;
    vm.woDetails = null;
    vm.changeRequestComeFrom = WORKORDER.AccessFrom.TravelerChangeRequestPage;
    vm.selectOneRequestTypeNote = stringFormat(vm.CORE_MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE.message, "change request type");

    vm.workorderChangeTypeList = [];
    var workorderChangeType = CORE.WorkorderChangeType;
    for (var prop in workorderChangeType) {
      vm.workorderChangeTypeList.push({ id: prop, name: workorderChangeType[prop] });
    }

    vm.changeRequestModel = {
      woRevReqID: null,
      woID: woID,
      opID: opID,
      woOPID: woOPID,
      reqGenEmployeeID: employeeDetails.id,
      requestType: 'C',
      accRejStatus: 'P',
      woAuthorID: null,
      woRevnumber: null,
      changeType: null,
      woOpRevNumber: null,
      threadTitle: null,
      description: null,
      workorderReqRevInvitedEmp: []
    };

    /* hyperlink go for part list page */
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    /* go to particular assy */
    vm.goToPartDetails = () => {
        BaseService.goToComponentDetailTab(null, data.partID);
      return false;
    };
    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };
    //redirect to work order details
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(woID);
      return false;
    };

    // go to work order operation list page
    vm.goToWorkorderOperations = () => {
      BaseService.goToWorkorderOperations(woID);
      return false;
    };

    // go to particular operation of work order
    vm.goToWorkorderOperationDetails = () => {
      BaseService.goToWorkorderOperationDetails(woOPID);
      return false;
    };

    getWorkorderOperationDetails();

    function getWorkorderOperationDetails() {

      vm.cgBusyLoading = ChangeRequestFactory.getWorkorderOperationDetails().query({ woID: woID, opID: opID }).$promise.then((response) => {
        if (response && response.data) {
          vm.changeRequestModel.woAuthorID = response.data.workorder.createdBy;
          vm.changeRequestModel.woRevnumber = response.data.workorder.woVersion;
          vm.changeRequestModel.woOpRevNumber = response.data.opVersion;

          vm.woNumber = response.data.workorder.woNumber;
          vm.woVersion = response.data.workorder.woVersion;
          vm.opName = response.data.opName;
          vm.opNumber = response.data.opNumber;


          vm.headerdata = [
            {
              value: data.PIDCode,
              label: CORE.LabelConstant.Assembly.ID,
              displayOrder: 1,
              labelLinkFn: vm.goToPartList,
              valueLinkFn: vm.goToPartDetails,
              isCopy: true,
              imgParms: {
                imgPath: data.rohsIcon,
                imgDetail: data.rohsName
              }
            },
            {
              label: CORE.LabelConstant.Workorder.WO, value: response.data.workorder.woNumber, displayOrder: 2, labelLinkFn: vm.goToWorkorderList,
              valueLinkFn: vm.goToWorkorderDetails
            },
            { label: CORE.LabelConstant.Workorder.Version, value: response.data.workorder.woVersion, displayOrder: 3 },
            {
              label: CORE.LabelConstant.Operation.OP, value: operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT,
                response.data.opName, response.data.opNumber), displayOrder: 4, labelLinkFn: vm.goToWorkorderOperations,
              valueLinkFn: vm.goToWorkorderOperationDetails
            }
          ];

          vm.changeRequestModel.threadTitle = stringFormat(TRAVELER.CHANGE_REQUEST_MESSAGE, loginUserFullName,
            response.data.workorder.woNumber, response.data.workorder.woVersion, convertToThreeDecimal(vm.opNumber), vm.changeRequestModel.woOpRevNumber);

          vm.woDetails = {
            woID: woID,
            woNumber: response.data.workorder.woNumber,
            woVersion: response.data.workorder.woVersion,
            woRevReqID: null
          }
        }

      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.changeTypeSelected = () => {
      if (!vm.changeRequestForm.threadTitle.$dirty) {
        vm.changeRequestModel.threadTitle = stringFormat(TRAVELER.CHANGE_REQUEST_WITH_TYPE_MESSAGE, workorderChangeType[vm.changeRequestModel.changeType],
          loginUserFullName, vm.woDetails.woNumber, vm.woDetails.woVersion,
          convertToThreeDecimal(vm.opNumber), vm.changeRequestModel.woOpRevNumber);
      }
    }

    vm.save = (isClose) => {

      if (!vm.changeRequestModel.changeType) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, "change request type");
        let alertModel = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
        return;
      }

      if (vm.changeRequestForm.$invalid) {
        BaseService.focusRequiredField(vm.changeRequestForm);
        return;
      }
      vm.changeRequestModel.workorderReqRevInvitedEmp = [];

      vm.changeRequestModel.workorderReqRevInvitedEmp.push({
        employeeID: employeeDetails.id,
        timeLine: null,
        isCompulsory: false,
        empRequestType: vm.changeRequestModel.woAuthorID == employeeDetails.id ? TRAVELER.INVITE_USER_TYPE.Owner : TRAVELER.INVITE_USER_TYPE.InviteUser  // actually change req generated emp
      });

      _.each(vm.employeeReviewList, (emp) => {
        vm.changeRequestModel.workorderReqRevInvitedEmp.push({
          employeeID: emp.id,
          timeLine: emp.timeLine,
          isCompulsory: emp.isCompulsory ? emp.isCompulsory : false,
          empRequestType: TRAVELER.INVITE_USER_TYPE.InviteUser
        });
      });

      vm.changeRequestModel.timelineObj = {};
      vm.changeRequestModel.timelineObj.woNumber = vm.woNumber;
      vm.changeRequestModel.timelineObj.opName = vm.opName;

      var woAuthorObj = _.find(vm.changeRequestModel.workorderReqRevInvitedEmp, function (item) { return item.employeeID == vm.changeRequestModel.woAuthorID; });
      if (!woAuthorObj) {
        vm.changeRequestModel.workorderReqRevInvitedEmp.push({
          employeeID: vm.changeRequestModel.woAuthorID,
          timeLine: null,
          isCompulsory: false,
          empRequestType: TRAVELER.INVITE_USER_TYPE.Owner
        });
      }

      vm.cgBusyLoading = ChangeRequestFactory.saveChangeRequest().save(vm.changeRequestModel).$promise.then((response) => {
        if (response && response.data) {
          if (isClose) {
            BaseService.currentPagePopupForm.pop();
            $mdDialog.cancel(response.data.data);
          }
          else {
            if (response.data.data && response.data.data.woRevReqID) {
              vm.changeRequestModel.woRevReqID = response.data.data.woRevReqID;
            }
            vm.changeRequestForm.$setPristine();
          }
        }

      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    // vm.cancel = (data) => {
    //     $mdDialog.cancel(data);
    // };


    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.changeRequestForm) || vm.changeRequestForm.$dirty;
      if (isdirty) {
        let data = {
          form: vm.changeRequestForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(vm.changeRequestModel.woRevReqID);
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }

    let htmlToPlaintext = (text) => {
      return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    }

    /* called for max length validation - editor */
    vm.getDescrLengthValidation = (maxLength, enterTextData) => {
      let entertext = htmlToPlaintext(enterTextData);
      return BaseService.getDescrLengthValidation(maxLength, entertext.length);
    }

    //on load submit form 
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.changeRequestForm);
    });
    /** Validate max size */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    };
  }
})();
