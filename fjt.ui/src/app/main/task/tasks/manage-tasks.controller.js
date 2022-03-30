(function () {
  'use strict';

  angular
    .module('app.task.tasklist')
    .controller('ManageTasksController', ManageTasksController);

  /** @ngInject */
  function ManageTasksController($timeout, $scope, CORE, TASK, USER,
    WorkorderOperationEmployeeFactory, BaseService, DialogFactory, socketConnectionService) {
    const vm = this;
    let activeOperations = [];
    vm.loginUserDetails = BaseService.loginUser;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;

    vm.WOEmptyMesssage = TASK.TASK_EMPTYSTATE.TASK;
    const EmptyMesssage = TASK.TASK_EMPTYSTATE;
    vm.WOEmptyMesssage = EmptyMesssage.WORKORDER;
    vm.WoOpEmptyMesssage = EmptyMesssage.OPERATION;
    vm.WoActiveOpEmptyMesssage = EmptyMesssage.ACTIVEOPERATION;
    vm.LabelConstant = CORE.LabelConstant;
    //vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.rohsImagePath = stringFormat('{0}{1}', CORE.WEB_URL, USER.ROHS_BASE_PATH);
    vm.FullDateTimeFormat = _dateTimeFullTimeDisplayFormat;
    vm.debounceConstant = CORE.Debounce;
    vm.headerdata = [];
    let wolistDetail = [];
    vm.opStatus = CORE.OPSTATUS;
    vm.productionWONumberPatternConst = CORE.ProductionWONumberPattern;

    vm.selectedItems = [];
    vm.query = {
      order: '',
      Active_op_search: '',
      workorder_search: '',
      operation_search: '',
      limit: 5,
      page: 1
    };

    vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.taskStepper = {
      step1: {
      },
      step2: {
      },
      step3: {
      },
      step4: {},
      step5: {}
    };


    vm.Show = {
      ActiveOperation: true,
      Workorder: true,
      listView: false,
      opList: false,
      woList: true
    };
    /*get employee work order details and active operations details */
    vm.getEmployeeWorkorderDetails = () => {
      vm.Show.workorder = true;
      vm.Show.woList = true;
      vm.Show.opList = true;
      vm.selectedEmployee = null;
      vm.taskStepper.step1.nickname = null;// on load nickname filter null
      vm.headerdata = [];
      if (vm.taskStepper.step1.employeeCode) {
        const _objList = {};
        _objList.employeeCode = (vm.taskStepper.step1.employeeCode).toUpperCase();

        vm.headerdata.push({
          label: 'User ID',
          value: vm.taskStepper.step1.employeeCode,
          displayOrder: 1
        });

        //28/04/2018 - Added condition if login user scan his own code than only display data as admin otherwise show only employee data
        _objList.isUserAdmin = false;
        if (vm.loginUserDetails.isUserAdmin && vm.loginUserDetails.username.toUpperCase() === _objList.employeeCode) {
          _objList.isUserAdmin = true;
        }
        //28/04/2018 - Added condition if login user scan his own code than only display data as admin otherwise show only employee data

        vm.cgBusyLoading = WorkorderOperationEmployeeFactory.getWorkorderEmployeeDetailsByEmpCode().query({ listObj: _objList }).$promise.then((response) => {
          if (response.data) {
            vm.selectedEmployee = _.first(response.data.employeeDetails);
            if (vm.selectedEmployee) {
              if (vm.selectedEmployee.profileImg) {
                vm.selectedEmployee.profileImg = stringFormat('{0}{1}{2}', CORE.WEB_URL, USER.EMPLOYEE_BASE_PATH, vm.selectedEmployee.profileImg);
              }
              else {
                vm.selectedEmployee.profileImg = stringFormat('{0}{1}profile.jpg', CORE.WEB_URL, USER.EMPLOYEE_DEFAULT_IMAGE_PATH);
              }
              _.each(response.data.workorderDetails, (item) => {
                const standardClassArray = [];
                if (item.woAllStandardsWithClass) {
                  const classWithColorCode = item.woAllStandardsWithClass.split('@@@@@@');
                  _.each(classWithColorCode, (classItems) => {
                    if (classItems) {
                      const objItem = classItems.split('######');
                      const standardClassObj = {};
                      standardClassObj.colorCode = CORE.DefaultStandardTagColor;
                      standardClassObj.className = objItem[0];
                      if (objItem[1]) {
                        standardClassObj.colorCode = objItem[1];
                      }
                      standardClassArray.push(standardClassObj);
                    }
                  });
                  if (classWithColorCode.length > 0) {
                    item.woAllStandardsWithClass = standardClassArray;
                  }
                  // show color code in background of class and default color of "label-primary"
                }
                item.rohsIcon = vm.rohsImagePath + item.rohsIcon;
                item.statusClassName = vm.getWoStatusClassName(item.woSubStatus);
                item.statusTxt = vm.getWoStatus(item.woSubStatus);
                if (!item.imageURL) {
                  item.imageURL = CORE.WEB_URL + USER.COMPONENT_DEFAULT_IMAGE_PATH + 'profile.jpg';
                } else {
                  if (!item.imageURL.startsWith('http://') && !item.imageURL.startsWith('https://')) {
                    item.imageURL = BaseService.getPartMasterImageURL(item.documentPath, item.imageURL);
                  }
                }
                item.isWorkOrderDetails = true;
                _.each(response.data.activeOperations, (operation) => {
                  if (!item.isRunningWorkorder) {
                    item.isRunningWorkorder = false;
                  }
                  if (operation.woID === item.woID) {
                    item.isRunningWorkorder = true;
                    operation.employeeID = vm.selectedEmployee.employeeID;
                    operation.woNumber = item.woNumber;
                    operation.woVersion = item.woVersion;
                    operation.fullWoNumber = item.woNumber + '-' + item.woVersion;
                    operation.isStopWorkorder = item.isStopWorkorder;
                    operation.mfgPN = item.mfgPN;
                    operation.PIDCode = item.PIDCode;
                    operation.rev = item.rev;
                    operation.nickName = item.nickName;
                    operation.liveVersion = item.liveVersion;
                    operation.imageURL = item.imageURL;
                    operation.rohsStatus = item.rohsStatus;
                    operation.rohsIcon = item.rohsIcon;
                    operation.partID = item.partID;
                    operation.isCustom = item.isCustom;  // isCustom Assy/part
                    if (!operation.isStopOperation) {
                      operation.isRunningOperation = true;
                    }
                  }
                  operation.isActiveOperationDetails = true;
                });
              });
            }
            vm.workorderDetails = _.sortBy(response.data.workorderDetails, ['PIDCode', 'woNumber']);
            vm.activeOperations = _.sortBy(response.data.activeOperations, ['PIDCode', 'woNumber']);
            activeOperations = angular.copy(vm.activeOperations);
            wolistDetail = angular.copy(vm.workorderDetails);

            ClearWoOpDetails();
            $timeout(() => {
              angular.element(document.getElementById('nickname')).focus();
            }, 0);
          }
          else {
            angular.element(document.getElementById('employeeCode')).focus();
            ClearWoOpDetails();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    vm.dateFormat = _dateDisplayFormat;

    // clear workorder operation details
    const ClearWoOpDetails = () => {
      vm.operationDetails = [];
      vm.taskStepper.step2.woNumber = null;
      vm.taskStepper.step3.opNumber = null;
      $timeout(() => {
        if (vm.StartupTaskForm) {
          vm.StartupTaskForm.$setPristine();
          vm.StartupTaskForm.$setUntouched();
        }
      }, 0);
    };

    // clear operation details
    const ClearOpDetails = () => {
      vm.operationDetails = [];
      vm.selectedWorkorder = null;
      vm.taskStepper.step3.opNumber = null;
      vm.StartupTaskForm.$setPristine();
      vm.StartupTaskForm.$setUntouched();
    };

    /*get employee operation details*/
    vm.getWorkorderOperationDetails = (msWizard) => {
      if (vm.taskStepper.step2.woNumber) {
        if (vm.selectedEmployee) {
          vm.selectedWorkorder = _.find(vm.workorderDetails, (wo) => wo.woNumber === vm.taskStepper.step2.woNumber);
          if (vm.selectedWorkorder) {
            const _objList = {};
            _objList.woID = vm.selectedWorkorder.woID;
            _objList.employeeID = vm.selectedEmployee.employeeID;
            _objList.isUserAdmin = vm.loginUserDetails.isUserAdmin;
            vm.cgBusyLoading = WorkorderOperationEmployeeFactory.getWorkorderEmployeeOperationByWoID().query({ listObj: _objList }, (response) => {
              if (response.data) {
                vm.activeOperations = _.filter(vm.activeOperations, { 'woID': vm.selectedWorkorder.woID });
                _.each(response.data.operationDetails, (operation) => {
                  // Assign Active Operation details to operation for paused checkin time
                  const operationObj = _.find(vm.activeOperations, (op) => operation.woOPID === op.woOPIDs);
                  operation.employeeID = vm.selectedEmployee.employeeID;
                  operation.isRunningOperation = false;
                  operation.statusClassName = vm.getOpStatusClassName(operation.opStatus);
                  operation.statusTxt = vm.getOpStatus(operation.opStatus);
                  if (operationObj && !operation.isStopOperation) {
                    operation.isRunningOperation = true;
                    if (operationObj.employeeID === operation.employeeID) {
                      operation.isPaused = operationObj.isPaused;
                      operation.pausedTime = operationObj.pausedTime;
                      operation.checkinTime = operationObj.checkinTime;
                    }
                  }
                  // Assign Workorder/Assembly Details to operation
                  operation.imageURL = vm.selectedWorkorder.imageURL;
                  operation.woNumber = vm.selectedWorkorder.woNumber;
                  operation.woVersion = vm.selectedWorkorder.woVersion;
                  operation.PIDCode = vm.selectedWorkorder.PIDCode;
                  operation.rohsIcon = vm.selectedWorkorder.rohsIcon;
                  operation.rohsStatus = vm.selectedWorkorder.rohsStatus;
                  operation.nickName = vm.selectedWorkorder.nickName;
                  operation.liveVersion = vm.selectedWorkorder.liveVersion;
                  operation.partID = vm.selectedWorkorder.partID;
                  operation.mfgPN = vm.selectedWorkorder.mfgPN;
                  operation.isCustom = vm.selectedWorkorder.isCustom;  // isCustom Assy/part
                  operation.isOperationDetails = true;
                });
              }
              vm.operationDetails = _.sortBy(response.data.operationDetails, ['PIDCode', 'opNumber']);

              angular.element(document.getElementById('opNumber')).focus();
              if (msWizard && vm.operationDetails.length > 0) {
                _.each(vm.workorderDetails, (item) => {
                  item.isActive = false;
                  item.statusClassName = vm.getWoStatusClassName(item.woSubStatus);
                  item.statusTxt = vm.getWoStatus(item.woSubStatus);
                });
                vm.selectedWorkorder.isActive = true;
                vm.Show.woList = false;
                vm.Show.opList = true;

                vm.selectedIndex = 2;  /* set operation tab selected */
              }
            }, (error) => BaseService.getErrorLog(error));
          }
          else {
            ClearOpDetails();
            workorderAlert();
          }
        } else {
          workorderAlert();
          $timeout(() => {
            angular.element(document.getElementById('employeeCode')).focus();
          }, 0);
        }
      }
      else {
        ClearOpDetails();
      }
    };
    // alert workorder
    const workorderAlert = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INVALID_WORKORDERCODE);
      const obj = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(obj);
    };
    // alert operation
    const operationAlert = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INVALID_OPERATIONCODE);
      const obj = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(obj);
    };
    vm.setItemActive = (item, msWizard) => {
      if (item.isWorkOrderDetails) {
        vm.setChipActive(vm.workorderDetails, item, 'Work Orders', msWizard);
        vm.Show.woList = false;
      }
      else if (item.isOperationDetails) {
        vm.setChipActive(vm.operationDetails, item, 'Operation', msWizard);
      }
      else if (item.isActiveOperationDetails) {
        vm.setChipActive(vm.activeOperations, item, 'Active Operations', msWizard);
      }
    };

    /*select operation*/
    vm.selectOperationForCheckIn = () => {
      if (vm.taskStepper.step3.opNumber) {
        vm.selectedOperation = _.find(vm.operationDetails, (op) => op.opNumber === vm.taskStepper.step3.opNumber);
        if (vm.operationDetails && vm.selectedOperation) {
          // Added condition to allow click to admin user for work order operation details
          if (vm.loginUserDetails.isUserAdmin) {
            vm.goToTravelerDetails(vm.selectedOperation.woOPID, vm.selectedEmployee.employeeID);
            return true;
          } else {
            const opEmployeeDetails = _.find(vm.operationDetails, (op) => op.woID === vm.selectedWorkorder.woID && op.opID === vm.selectedOperation.opID
              && op.employeeID === vm.selectedEmployee.employeeID);

            if (opEmployeeDetails && opEmployeeDetails.employeeID) {
              vm.goToTravelerDetails(opEmployeeDetails.woOPID, opEmployeeDetails.employeeID);
              return true;
            }
          }
        }
        else {
          operationAlert();
          $timeout(() => {
            angular.element(document.getElementById('opNumber')).focus();
          }, 0);
          return false;
        }
      }
    };

    /*select active operation */
    vm.selectActiveOperationForCheckIn = (activeOpItem) => {
      if (activeOpItem && activeOpItem.woOPID && activeOpItem.employeeID) {
        vm.goToTravelerDetails(activeOpItem.woOPID, activeOpItem.employeeID);
      }
      else {
        operationAlert();
        return false;
      }
    };

    /*get wo status*/
    vm.getWoStatus = (statusID) => BaseService.getWoStatus(statusID);

    vm.getWoStatusClassName = (statusID) => BaseService.getWoStatusClassName(statusID);

    /*get op status*/
    vm.getOpStatus = (statusID) => BaseService.getOpStatus(statusID);

    vm.getOpStatusClassName = (statusID) => BaseService.getOpStatusClassName(statusID);

    /* on click of workorder chip */
    vm.SetWorkorderNumber = (workorder, msWizard) => {
      vm.taskStepper.step2.woNumber = workorder.woNumber;
      angular.element(document.getElementById('woNumber')).focus();
      vm.getWorkorderOperationDetails(msWizard);
    };

    /* on click of operation chip */
    vm.SetOperationNumber = (operation) => {
      vm.taskStepper.step3.opNumber = operation.opNumber;
      angular.element(document.getElementById('opNumber')).focus();
      vm.selectOperationForCheckIn();
    };

    vm.taskStepper.step1.employeeCode = vm.loginUserDetails.username.toUpperCase();
    vm.getEmployeeWorkorderDetails();

    vm.gotoWorkorderProfile = (woID) => {
      if (woID) {
        BaseService.goToWorkorderProfile(woID);
      }
    };

    const objListView = getLocalStorageValue('TaskListView');
    if (objListView) {
      vm.Show.listView = objListView.isListView;
    }
    if (!vm.Show.listView) {
      setLocalStorageValue('TaskListView', { isListView: false });
    }
    //vm.Show.listView = getLocalStorageValue('TaskListView');

    vm.setChipActive = (list, selectedItem, type, msWizard) => {
      if (type === 'Active Operations') {
        _.each(list, (item) => {
          item.isActive = false;
        });
        selectedItem.isActive = true;
        vm.selectActiveOperationForCheckIn(selectedItem);
      }
      else if (type === 'Work Orders') {
        _.each(list, (item) => {
          item.isActive = false;
        });
        selectedItem.isActive = true;
        if (selectedItem.isActive) {
          vm.Show.opList = true;
        }
        else {
          vm.Show.opList = false;
        }
        vm.SetWorkorderNumber(selectedItem, msWizard);
      } else {
        _.each(list, (item) => {
          item.isActive = false;
        });
        selectedItem.isActive = true;
        vm.SetOperationNumber(selectedItem);
      }
    };

    vm.checkStopWorkorder = (key, operation) => {
      const findObj = _.find(operation, (woDetail) => woDetail.woNumber === key);
      return findObj ? findObj.isStopWorkorder : false;
    };

    // get assembly details
    vm.getAssemblyDetails = (key, woDetails) => {
      const findObj = _.find(woDetails, (woDetail) => woDetail.woNumber === key);
      return findObj ? '-' + findObj.woVersion + ' (' + findObj.nickName + '-' + findObj.rev + ')' : '';
    };

    //vm.pauseEmployeeOperation = (employeeDetails, ev) => {
    //    let opHistory = {};
    //    opHistory.checkinTime = employeeDetails.checkinTime;
    //    opHistory.woTransinoutID = employeeDetails.woTransinoutID;
    //    opHistory.woID = employeeDetails.woID;
    //    opHistory.opID = employeeDetails.opID;
    //    opHistory.woOPID = employeeDetails.woOPID;
    //    opHistory.employeeID = employeeDetails.employeeID;
    //    vm.cgBusyLoading = WorkorderTransFactory.pauseEmployeeFromOperation().save(opHistory).$promise.then((res) => {
    //        if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
    //            vm.getEmployeeWorkorderDetails();
    //        }
    //    }).catch((error) => {
    //        return BaseService.getErrorLog(error);
    //    });
    //}

    //// resuem employee operation
    //vm.resumeEmployeeOperation = (employeeDetails, ev) => {
    //    let opHistory = {};
    //    opHistory.woTransinoutID = employeeDetails.woTransinoutID;
    //    opHistory.woTransemppausedID = employeeDetails.woTransemppausedID;
    //    opHistory.pausedTime = employeeDetails.pausedTime;
    //    // used for notification into controller
    //    opHistory.woID = employeeDetails.woID;
    //    opHistory.opID = employeeDetails.opID;
    //    opHistory.woOPID = employeeDetails.woOPID;
    //    opHistory.employeeID = employeeDetails.employeeID;

    //    vm.cgBusyLoading = WorkorderTransFactory.resumeEmployeeForOperation().save(opHistory).$promise.then((res) => {
    //        if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
    //            vm.getEmployeeWorkorderDetails();
    //        }
    //    }).catch((error) => {
    //        return BaseService.getErrorLog(error);
    //    });
    //}


    // [S] Socket Listeners
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
      if (vm.selectedEmployee) {
        if (message.data.employeeID == vm.selectedEmployee.employeeID) {
          $timeout(notificationReceive(message));
        }
      }
    }
    function notificationReceive(message) {
      switch (message.event) {
        case CORE.NOTIFICATION_MESSAGETYPE.WO_OP_TEAM_CHECKIN.TYPE:
        case CORE.NOTIFICATION_MESSAGETYPE.WO_OP_TEAM_CHECKOUT.TYPE:
        case CORE.NOTIFICATION_MESSAGETYPE.WO_OP_TEAM_PAUSE.TYPE:
        case CORE.NOTIFICATION_MESSAGETYPE.WO_OP_TEAM_RESUME.TYPE:
          {
            if (!vm.Show.listView || vm.selectedIndex == 0) {
              vm.getEmployeeWorkorderDetails();
            }
            break;
          }
      }
    }
    // [E] Socket Listeners

    $scope.$on('$destroy', () => {
      // Remove socket listeners
      removeSocketListener();
    });

    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });

    // Workorder
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };
    vm.goToWorkorderDetails = (data) => {
      BaseService.goToWorkorderDetails(data.woID);
      return false;
    };

    // Assembly
    vm.goToAssemblyList = () => {
        BaseService.goToPartList();
      return false;
    };
    vm.goToAssemblyDetails = (data) => {
        BaseService.goToComponentDetailTab(null, data.partID);
      return false;
    };

    // Operation/Traveler
    vm.goToOperationList = (data) => {
      BaseService.goToOperationList(data.woID);
      return false;
    };

    vm.goToTravelerOperationDetails = (data) => {
      BaseService.goToTravelerOperationDetails(data.woOPID, data.employeeID, data.woOPID);
      return false;
    };

    vm.goToTravelerDetails = (woOPID, employeeID) => {
      BaseService.goToTravelerOperationDetails(woOPID, employeeID, woOPID);
      return false;
    };

    /* display work order sales order header all details while click on that link*/
    vm.showSalesOrderDetails = (ev, workOrderDet) => {
      if (workOrderDet.poNumber && workOrderDet.salesOrderNumber) {
        const data = {
          poNumber: workOrderDet.poNumber,
          totalPOQty: workOrderDet.totalPOQty,
          soPOQty: workOrderDet.soPOQty,
          totalMRPQty: workOrderDet.totalMRPQty,
          soMRPQty: workOrderDet.soMRPQty,
          salesOrderNumber: workOrderDet.salesOrderNumber,
          lineID: workOrderDet.lineID,
          salesOrderMstIDs: workOrderDet.salesOrderMstIDs,
          SOPOQtyValues: workOrderDet.SOPOQtyValues
        };
        DialogFactory.dialogService(
          CORE.WO_SO_HEADER_DETAILS_MODAL_CONTROLLER,
          CORE.WO_SO_HEADER_DETAILS_MODAL_VIEW,
          ev,
          data).then(() => {

          }, (() => {

          }), (error) => BaseService.getErrorLog(error));
      }
    };

    //show color legend on click of pallet icon
    vm.showColorLengend = (ev) => {
      const data = {
        pageName: CORE.LabelConstant.TaskList.PageName,
        legendList: CORE.LegendList.TaskList
      };
      DialogFactory.dialogService(
        CORE.LEGEND_MODAL_CONTROLLER,
        CORE.LEGEND_MODAL_VIEW,
        ev,
        data).then(() => {
          //sucess section
        },
          (error) => BaseService.getErrorLog(error));
    };

    //on work order change
    vm.woChange = () => {
      vm.Show.woList = true;
    };

    // on change of view task list
    vm.ChangeListView = (listView, ev) => {
      vm.Show.listView = listView;
      setLocalStorageValue('TaskListView', { isListView: listView });
    };

    //check max length validation
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    //filter nickname and assy wise detail of work order
    vm.getnicknameAssywiseFilterWo = () => {
      vm.workorderDetails = wolistDetail.filter((item) => (item.nickName.toUpperCase().includes(vm.taskStepper.step1.nickname)) || (item.mfgPN.toUpperCase().includes(vm.taskStepper.step1.nickname)));
      vm.activeOperations = activeOperations.filter((item) => (item.nickName.toUpperCase().includes(vm.taskStepper.step1.nickname)) || (item.mfgPN.toUpperCase().includes(vm.taskStepper.step1.nickname)));
    };
    //show rack current status
    vm.showRackStatus = (event) => {
      const data = {};
      DialogFactory.dialogService(
        CORE.RACK_STATUS_MODAL_CONTROLLER,
        CORE.RACK_STATUS_MODAL_VIEW,
        event,
        data).then(() => {
          // success section
        }, (err) => BaseService.getErrorLog(err));
    };

    //open popup to show available rack list page
    vm.openAvailableRack = (item) => {
      const data = angular.copy(item);
      DialogFactory.dialogService(
        CORE.SHOW_AVAILABLE_RACK_MODAL_CONTROLLER,
        CORE.SHOW_AVAILABLE_RACK_MODAL_VIEW,
        event,
        data).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };
  }
})();
