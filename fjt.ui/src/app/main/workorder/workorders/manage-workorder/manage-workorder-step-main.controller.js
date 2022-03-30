(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ManageWorkorderMainController', ManageWorkorderMainController);

  /** @ngInject */
  function ManageWorkorderMainController($state, $q, $timeout, $scope, $mdSidenav,
    CORE, WORKORDER, USER, TRAVELER, $mdDialog,
    EntityFactory, DialogFactory, WorkorderFactory, socketConnectionService,
    NotificationSocketFactory, BaseService, WorkorderTransFactory) {
    const vm = this;
    var woRevReqID = isNaN(parseInt($state.params.woRevReqID)) ? null : parseInt($state.params.woRevReqID);
    vm.taToolbar = CORE.Toolbar;
    const loginUserDetails = BaseService.loginUser;
    vm.Workorder_Tabs = CORE.Workorder_Tabs;
    vm.DisplayStatus = CORE.DisplayStatus;
    vm.WoStatus = CORE.WoStatus;
    vm.Entity = CORE.Entity;
    const WoStatusForTimeLine = CORE.WoStatus;
    vm.saveBtnDisableFlag = false;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.LOADDETAILS;
    vm.allLabelConstant = CORE.LabelConstant;
    vm.ALLEntities = CORE.AllEntityIDS;
    vm.entity = vm.ALLEntities.Workorder.Name;
    if (!vm.workorder) {
      vm.workorder = {};
    }
    vm.id = vm.workorder.woID = isNaN(parseInt($state.params.woID)) ? null : parseInt($state.params.woID);
    vm.IsEdit = false;
    vm.employeeDetails = loginUserDetails.employee;
    vm.isShowSideNav = false;
    vm.isWOHeaderDetailsChanged = false;

    // get work order details
    const workorderDetails = () => {
      if (vm.workorder.woID) {
        // console.log('w3');
        /* retreive Work Order Details*/
        vm.cgBusyLoading = WorkorderFactory.workorder().query({ id: vm.workorder.woID }).$promise.then((workorder) => {
          // console.log('w4');
          vm.workorder = {};
          if (workorder && workorder.data && workorder.data.length > 0) {
            workorder.data = _.first(workorder.data);
            //getWorkOrderMstDbList();

            // update child table data to workorder obj
            if (workorder.data.componentAssembly) {
              workorder.data.PIDCode = workorder.data.componentAssembly.PIDCode;
              workorder.data.mfgPN = workorder.data.componentAssembly.mfgPN;
              workorder.data.nickName = workorder.data.componentAssembly.nickName;
              workorder.data.isCustom = workorder.data.componentAssembly.isCustom;
              //vm.autoCompleteCustomer.keyColumnId = workorder.data.customerID;
            }

            vm.workorder = angular.copy(workorder.data);
            vm.dataLoaded = true;
            /* start - store copy of quantity */
            vm.prevBuildQty = vm.workorder.buildQty;
            /* end - store copy of quantity */
            vm.oldIsClusterAppliedValue = vm.workorder.isClusterApplied;

            //vm.isOperationTrackBySerialNo = vm.workorder.isOperationTrackBySerialNo;
            vm.masterTemplate = vm.workorder.masterTemplate ? vm.workorder.masterTemplate : {};
            vm.IsClusterDataAvailable = vm.workorder.workordercluster.length > 0;

            vm.IsProductionStart = vm.workorder.workorderTransEmpinout.length > 0;
            const objRunning = _.find(vm.workorder.workorderTransEmpinout, (empInout) => empInout.checkinTime && !empInout.checkoutTime);
            vm.IsProductionRunning = objRunning ? true : false;
            vm.workorder.workorderTransHoldUnhold = _.first(vm.workorder.workorderTransHoldUnhold);
            // Restrict changes into all fields if work order status is 'under termination'            
            vm.isWOUnderTermination = vm.workorder.woStatus === CORE.WOSTATUS.UNDER_TERMINATION;
            vm.isWOPublished = vm.workorder.woStatus === CORE.WOSTATUS.PUBLISHED;
            /* vm.isWOUnderTermination and vm.isWoInSpecificStatusNotAllowedToChange
             *  we need to merge this in to vm.isWoInSpecificStatusNotAllowedToChange and check for all place for disable in work order flow
             *  now  vm.isWOUnderTermination || vm.isWoInSpecificStatusNotAllowedToChange
            */
            vm.isWoInSpecificStatusNotAllowedToChange = (vm.workorder.woStatus === CORE.WOSTATUS.TERMINATED || vm.workorder.woStatus === CORE.WOSTATUS.COMPLETED || vm.workorder.woStatus === CORE.WOSTATUS.VOID) ? true : false;
            vm.isDisableStatusMenu = (vm.enableChangeWOStatus && !vm.IsProductionRunning && !vm.isWoInSpecificStatusNotAllowedToChange) ? false : true;
            //vm.isDisableStatusMenu = checkMenuStatus();

            if (vm.isWOUnderTermination) {
              vm.WoStatus = vm.WoStatus.filter((x) => x.ID === CORE.WOSTATUS.TERMINATED);
            }

            if (vm.workorder.workorderTransEmpinout.length > 0) {
              const getMaximumOpNumberObj = _.maxBy(vm.workorder.workorderTransEmpinout, (hist) => hist.workorderOperation ? hist.workorderOperation.opNumber : false);
              if (getMaximumOpNumberObj && getMaximumOpNumberObj.workorderOperation) {
                vm.getMaximumOpNumber = getMaximumOpNumberObj.workorderOperation.opNumber;
              }
              if (vm.workorder.workorderTransEmpinout && vm.workorder.workorderTransEmpinout.length > 0) {
                const productionContinue = _.find(vm.workorder.workorderTransEmpinout, (item) => item.checkinTime && !item.checkoutTime);
                if (productionContinue) {
                  vm.isCompleted = false;
                } else {
                  const productionFinish = _.find(vm.workorder.workorderTransEmpinout, (item) => item.checkinTime && item.checkoutTime);
                  if (productionFinish) {
                    vm.isCompleted = true;
                  }
                }
              }
            } else {
              vm.isCompleted = true;
            }
            if (vm.workorder.workorderReqForReview.length > 0) {
              vm.workorderReqForReview = _.first(vm.workorder.workorderReqForReview);
            }
            if (vm.workorder.woStatus !== vm.DisplayStatus.Draft.ID) {
              vm.ShowInviteTab = true;
            }
            vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;
            vm.woReviewOtherDetails = {
              woVersion: vm.workorder.woVersion,
              opName: null
            };
            // to pass details in directive of wo op verification
            vm.woDetailsForWOOPVerification = {
              isWoInSpecificStatusNotAllowedToChange: vm.isWoInSpecificStatusNotAllowedToChange
            };
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        initWorkorder();
        vm.masterTemplate = {};
      }
    };
    // on state change success for select index of tabs
    const stateChangeSuccessCall = $scope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
      vm.selectedTab = null;

      $timeout(() => {
        // console.log('w6');
        vm.selectedTab = toState.data.selectedTab;
        // console.log('selectedTab - ' + vm.selectedTab);
        vm.enableToggleOperation = BaseService.checkFeatureRights(CORE.FEATURE_NAME.ToggleOperation);
        vm.enableChangeWOStatus = BaseService.checkFeatureRights(CORE.FEATURE_NAME.ChangeWOStatus);
        vm.enableToggleWorkorder = BaseService.checkFeatureRights(CORE.FEATURE_NAME.ToggleWorkorder);
        vm.isDisableStatusMenu = (vm.enableChangeWOStatus && !vm.IsProductionRunning && !vm.isWoInSpecificStatusNotAllowedToChange && vm.workorder.woID) ? false : true;
        // console.log('w7');
      }, _configWOTimeout);
      vm.id = vm.workorder.woID = isNaN(parseInt($state.params.woID)) ? null : parseInt($state.params.woID);
      if (!$state.params.woID) {
        $scope.$broadcast('bindWorkorderTreeView', {});
      }
      // console.log('w2');
      workorderDetails();
    });

    // [S] code for checking wo change review sidebar
    vm.woRevReqForReview = null;

    function getWORevReqForReview() {
      WorkorderFactory.getDefaultWORevReqForReview().query({ woID: vm.workorder.woID, woRevReqID: woRevReqID, empID: vm.employeeDetails.id }).$promise.then((response) => {
        if (response && response.data) {
          vm.woRevReqForReview = response.data;
          if ($state.params.openRevReq === 'true') {
            vm.openWorkorderReviewModel();
          }
        }
        else {
          vm.woRevReqForReview = null;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    if (vm.employeeDetails && vm.workorder.woID) {
      getWORevReqForReview();
    }

    // Work Order review sidenav
    vm.openWorkorderReviewModel = ($event) => {
      $mdSidenav('workorder-review').open();
      vm.isWorkorderReviewSideNavOpen = true;

      $mdSidenav('workorder-review').onClose(() => vm.isWorkorderReviewSideNavOpen = false);
    };
    // ENDS

    // [E]
    if ($state.params.woID > 0) {
      vm.IsEdit = true;
    }

    vm.getWoStatus = (statusID) => BaseService.getWoStatus(statusID);

    //On change work order status
    vm.changeWoStatus = (statusID, oldStatusID, event) => {
      //if (vm.isDisableStatusMenu) {
      //var model = {
      //  title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
      //  textContent: WORKORDER.CHANGE_STATUS_WORKORDER,
      //  multiple: true
      //};
      //DialogFactory.alertDialog(model);
      //return;
      //if  there is any active orperations then show operation list pop up other wise message pop up
      let messageContent;
      if (BaseService.checkAllFormDirtyValidation()) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WO_STATUS_SAVE_ALL_CHANGES);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }
      const listObj = {
        Page: CORE.UIGrid.Page(),
        pageSize: CORE.UIGrid.ItemsPerPage(),
        SortColumns: [],
        SearchColumns: [],
        woID: vm.workorder.woID,
        count: 1
      };
      vm.cgBusyLoading = WorkorderTransFactory.getActiveOperationList().query(listObj).$promise.then((response) => {
        if (response && response.data) {
          if (response.data.activeOperationList[0].opCount > 0) {
            const data = {
              woID: vm.workorder.woID,
              woNumber: vm.workorder.woNumber,
              woSubStatus: vm.getWoStatus(vm.workorder.woSubStatus),
              messageHeader: CORE.MESSAGE_CONSTANT.WO_STATUS_CHANGE_DENIED,
              messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CHANGE_STATUS_WORKORDER_WITH_ACTIVE_OP.message)
            };
            DialogFactory.dialogService(
              WORKORDER.SHOW_ACTIVE_OPERATION_POPUP_CONTROLLER,
              WORKORDER.SHOW_ACTIVE_OPERATION_POPUP_VIEW,
              event,
              data).then(() => { //Success Section
              }, () => {  // Cancel Section
              });
          }
          else if (!vm.enableChangeWOStatus || vm.isWoInSpecificStatusNotAllowedToChange) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CHANGE_STATUS_WORKORDER_WITHOUT_ACTIVE_OP);
            messageContent.message = CORE.MESSAGE_CONSTANT.WO_STATUS_CHANGE_DENIED_MULTI + messageContent.message;
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
            return;
          }
          else if (statusID !== oldStatusID) {
            if (statusID === CORE.WOSTATUS.UNDER_TERMINATION && !vm.IsProductionStart) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WO_PRODUCTION_NOT_STARTED);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model);
              return;
            } else {
              //Ask for confirmation if production started and changing status except for draft and draft review status.
              if (vm.IsProductionStart && ((statusID === CORE.WOSTATUS.DRAFT) || (statusID === CORE.WOSTATUS.DRAFTREVIEW))) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WO_PRODUCTION_STARTED_NOT_ALLOW_TO_CHANGE);
                messageContent.message = stringFormat(messageContent.message, 'status');
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model);
                return;
              }
              else if (statusID === CORE.WOSTATUS.PUBLISHED || statusID === CORE.WOSTATUS.COMPLETED_WITH_MISSING_PARTS) {
                //else if (statusID == CORE.WOSTATUS.PUBLISHED) {
                if (!vm.workorder.isOperationsVerified) {
                  messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.VERIFY_WORKORDER_FIRST);
                  const model = {
                    messageContent: messageContent,
                    multiple: true
                  };
                  DialogFactory.messageAlertDialog(model);
                  return;
                } else if (!vm.workorder.isRevisedWO && !vm.workorder.buildQty) {
                  messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INVALID_WO_BUILD_QTY);
                  const model = {
                    messageContent: messageContent,
                    multiple: true
                  };
                  DialogFactory.messageAlertDialog(model);
                  return;
                } else {
                  // check for bom added in assembly or not
                  const bomPromise = [validateAssemblyByAssyID(), checkDateCodeOnPublishWO()];
                  vm.cgBusyLoading = $q.all(bomPromise).then((resData) => {
                    const assyResData = resData[0];
                    if (assyResData.errorObjList && assyResData.errorObjList.length > 0) {
                      const errorMessage = _.map(resData.errorObjList, (obj) => { if (obj.isAlert) { return obj.errorText; } }).join('<br/>');
                      if (errorMessage) {
                        const obj = {
                          multiple: true,
                          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                          textContent: errorMessage
                        };
                        DialogFactory.alertDialog(obj);
                        return;
                      }
                    } else {
                      const nonBOMList = [];
                      if (assyResData.length === 0) {
                        // create object for popup details
                        const objAssy = {};
                        objAssy.partID = vm.workorder.partID;
                        objAssy.rohsText = vm.workorder.rohs.name;
                        objAssy.rohsIcon = CORE.WEB_URL + USER.ROHS_BASE_PATH + vm.workorder.rohs.rohsIcon;
                        objAssy.mfgPN = vm.workorder.componentAssembly ? vm.workorder.componentAssembly.mfgPN : '';
                        objAssy.PIDCode = vm.workorder.componentAssembly ? vm.workorder.componentAssembly.PIDCode : '';
                        objAssy.nickName = vm.workorder.componentAssembly ? vm.workorder.componentAssembly.nickName : '';
                        objAssy.description = vm.workorder.componentAssembly ? vm.workorder.componentAssembly.mfgPNDescription : '';
                        objAssy.isCustom = vm.workorder.componentAssembly ? vm.workorder.componentAssembly.isCustom : '';
                        nonBOMList.push(objAssy);
                        const data = {
                          assyList: nonBOMList,
                          assyBOMValidation: true,
                          woNumber: vm.workorder.woNumber,
                          woVersion: vm.workorder.woVersion
                        };
                        DialogFactory.dialogService(
                          CORE.VIEW_ASSY_LIST_WITHOUT_BOM_MODAL_CONTROLLER,
                          CORE.VIEW_ASSY_LIST_WITHOUT_BOM_MODAL_VIEW,
                          event,
                          data).then(() => { //Success Section
                          }, () => { //Cancel Section
                          });
                      } else {
                        const dateCodeDet = resData[1];
                        if (!dateCodeDet) {
                          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.DATECODE_REQUIRED);
                          messageContent.message = stringFormat(messageContent.message, 'status');
                          const model = {
                            messageContent: messageContent,
                            multiple: true
                          };
                          DialogFactory.messageAlertDialog(model);
                        } else {
                          SaveWorkorderStatusDetails(statusID, oldStatusID, event);
                        }
                      }
                    }
                  });
                }
              }
              else if (statusID === CORE.WOSTATUS.COMPLETED && !vm.isCompleted) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WO_PRODUCTION_STARTED_NOT_ALLOW_TO_CHANGE);
                messageContent.message = stringFormat(messageContent.message, 'status');
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model);
                return;
              }
              else if (statusID === CORE.WOSTATUS.TERMINATED || statusID === CORE.WOSTATUS.COMPLETED || statusID === CORE.WOSTATUS.VOID) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WO_STATUS_WITH_VIEW_MODE_CONFM);
                messageContent.message = stringFormat(messageContent.message, vm.getWoStatus(oldStatusID), vm.getWoStatus(statusID));
                const obj = {
                  messageContent: messageContent,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                DialogFactory.messageConfirmDialog(obj).then((yes) => {
                  if (yes) {
                    SaveWorkorderStatusDetails(statusID, oldStatusID, event);
                  }
                }, () => { //Cancel Setion
                }).catch((error) => BaseService.getErrorLog(error));
              }
              else {
                SaveWorkorderStatusDetails(statusID, oldStatusID, event);
              }
            }
          }
        }
      });
    };
    vm.item = {};
    vm.prevBuildQty;
    vm.prevTotalPoQty;

    const initWorkorder = () => {
      vm.workorder = {};
      vm.workorder.woStatus = vm.DisplayStatus.Draft.ID;
      vm.workorder.woSubStatus = vm.DisplayStatus.Draft.ID;
      vm.workorder.woVersion = CORE.DefaultVersion;
      vm.workorder.isSampleAvailable = 0;
      vm.workorder.isClusterApplied = 0;
      vm.workorder.isIncludeSubAssembly = 0;
      vm.workorder.isOperationTrackBySerialNo = 0;
      vm.workorder.isRevisedWO = 0;
      vm.workorder.isOperationsVerified = false;
      vm.dataLoaded = true;
    };

    /*
    * Author :  Vaibhav Shah
    * Purpose : Go back to Work Order List
    */
    vm.goBack = () => {
      if (vm.selectedTab === 0) {
        if (vm.frmWorkOrderDetails && vm.frmWorkOrderDetails.$dirty) {
          showWithoutSavingAlertforBackButton(vm.frmWorkOrderDetails);
        } else {
          $state.go(WORKORDER.WORKORDER_WORKORDERS_STATE);
        }
      } else if (vm.selectedTab === 1) {
        if (vm.frmCertificateDetails.$dirty) {
          showWithoutSavingAlertforBackButton(vm.frmCertificateDetails);
        } else if (vm.workorderDetailForm && vm.workorderDetailForm.$dirty) {
          showWithoutSavingAlertforBackButton(vm.workorderDetailForm);
        } else {
          $state.go(WORKORDER.WORKORDER_WORKORDERS_STATE);
        }
      } else if (vm.selectedTab === 8) {
        if (vm.workorderOtherDetail.$dirty) {
          showWithoutSavingAlertforBackButton(vm.workorderOtherDetail);
        } else if (vm.workorderDetailForm && vm.workorderDetailForm.$dirty) {
          showWithoutSavingAlertforBackButton(vm.workorderDetailForm);
        } else {
          $state.go(WORKORDER.WORKORDER_WORKORDERS_STATE);
        }
      } else {
        $state.go(WORKORDER.WORKORDER_WORKORDERS_STATE);
      }
    };

    function showWithoutSavingAlertforBackButton(form) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (form) {
            form.$setPristine();
          }
          $state.go(WORKORDER.WORKORDER_WORKORDERS_STATE);
        }
      }, (error) => BaseService.getErrorLog(error));
    }

    /**
    * Step 1 General Details
    *
    * @param
    */
    /* for autocomplete of customer */
    vm.CustomerList = [];

    const SaveWODetails = (statusID, oldStatusID, taskConfirmation) => {
      const oldWoStatus = _.find(WoStatusForTimeLine, (item) => item.ID === oldStatusID);

      const newWoStatus = _.find(WoStatusForTimeLine, (item) => item.ID === statusID);
      let woStatus;
      if (statusID === CORE.WOSTATUS.PUBLISHED || statusID === CORE.WOSTATUS.COMPLETED_WITH_MISSING_PARTS) {
        woStatus = CORE.WOSTATUS.PUBLISHED;
      } else if (statusID === CORE.WOSTATUS.DRAFT || statusID === CORE.WOSTATUS.DRAFTREVIEW || statusID === CORE.WOSTATUS.PUBLISHED_DRAFT) {
        woStatus = CORE.WOSTATUS.DRAFT;
      } else {
        woStatus = statusID;
      }
      const workorderStatus = {
        woID: vm.workorder.woID,
        woNumber: vm.workorder.woNumber,
        woStatus: woStatus,
        woSubStatus: statusID,
        taskConfirmationInfo: taskConfirmation,
        oldWoStatusText: oldWoStatus.Name,
        newWoStatusText: newWoStatus.Name
      };
      if (vm.workorder.woID) {
        vm.IsDocumentTab = false;
        vm.cgBusyLoading = WorkorderFactory.workorder().update({
          id: vm.workorder.woID
        }, workorderStatus).$promise.then((res) => {
          if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            $scope.$broadcast('bindWorkorderTreeView', { woID: vm.workorder.woID });
            vm.workorder.woStatus = statusID;
            vm.workorder.woSubStatus = statusID;
            vm.workorder.woStatus = woStatus;
            vm.isWOPublished = (vm.workorder.woStatus === CORE.WOSTATUS.PUBLISHED);
            vm.isWOUnderTermination = (vm.workorder.woStatus === CORE.WOSTATUS.UNDER_TERMINATION);
            vm.IsDocumentTab = true;
            vm.refreshWorkOrderHeaderDetails();
            $state.transitionTo($state.$current, {
              woID: vm.workorder.woID
            }, { reload: true });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    /**
    * Save Work Order Details
    *
    * @param
    */
    const SaveWorkorderStatusDetails = (statusID, oldStatusID, event) => {
      let taskConfirmation = {
        confirmationType: CORE.woQtyApprovalConfirmationTypes.WOStatusChangeRequest,
        signaturevalue: null,
        reason: null,
        autoRemark: 'Work Order Status<br/> Old Status: <b>' + vm.getWoStatus(oldStatusID) + '</b> <br/>\
                          New Status: <b>' + vm.getWoStatus(statusID) + '</b>',
        refTablename: CORE.AllEntityIDS.Workorder.Name,
        refId: vm.workorder.woID
      }
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WO_STATUS_CHANGE);
      messageContent.message = stringFormat(messageContent.message, vm.getWoStatus(oldStatusID), vm.getWoStatus(statusID));
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          const data = {
            woID: taskConfirmation.refId,
            woNumber: vm.workorder.woNumber,
            woVersion: vm.workorder.woVersion,
            IsProductionStart: vm.IsProductionStart,
            confirmationType: taskConfirmation.confirmationType,
            title: 'Status Change Request',
            autoRemark: taskConfirmation.autoRemark
          };
          DialogFactory.dialogService(
            WORKORDER.WORKORDER_QTY_CONFIRMATION_APPROVAl_CONTROLLER,
            WORKORDER.WORKORDER_QTY_CONFIRMATION_APPROVAl_VIEW,
            event,
            data).then(() => { // Success Section
            }, (taskConfirmationDetails) => {
              if (taskConfirmationDetails) {
                taskConfirmation = taskConfirmationDetails;
                SaveWODetails(statusID, oldStatusID, taskConfirmation);
              } else {
                return false;
              }
            });
        }
      }, () => { //Cancel Setion
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.setFocus = (text) => {
      const someElement = angular.element(document.querySelector('#' + text));
      if (someElement && someElement.length > 0) {
        someElement[0].focus();
      }
    };

    if (!vm.workorder.woID) {
      initWorkorder();
    }

    if (vm.Entity.Workorder) {
      EntityFactory.getEntityByName().query({ name: vm.Entity.Workorder }).$promise.then((res) => {
        if (res.data) {
          vm.entityID = res.data.entityID;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.employeeReviewList = [];

    vm.sendNotification = (versionModel) => {
      if (versionModel) {
        versionModel.employeeID = loginUserDetails.employee.id;
        versionModel.messageType = CORE.NOTIFICATION_MESSAGETYPE.WO_VERSION_CHANGE.TYPE;
        NotificationSocketFactory.sendNotification().save(versionModel).$promise.then(() => {
          /* empty */
        }).catch(() => {
          /* empty */
        });
      }
    };

    // WO Revision PopUp
    vm.openWORevisionPopup = (callbackFn, event) => {
      var model = {
        woID: vm.workorder.woID
      };
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_REVISION_POPUP_CONTROLLER,
        WORKORDER.WORKORDER_REVISION_POPUP_VIEW,
        event,
        model).then((versionModel) => {
          // Added for close revision dialog popup
          if (versionModel && versionModel.isCancelled) {
            callbackFn(versionModel);
            return;
          }
          if (versionModel.woVersion) {
            vm.workorder.woVersion = versionModel.woVersion;
          }
          callbackFn(versionModel);
        }, (versionModel) => {
          callbackFn(versionModel);
        }, () => {
          callbackFn();
        });
    };
    // WO Revision PopUp

    // Don't Remove this code - For Start/Stop Work Order
    ///*Onclick of start workorder*/
    vm.toggleWorkorder = (workorder, ev) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      if ((!vm.enableToggleWorkorder || !vm.workorder.woID || vm.workorder.woStatus !== vm.DisplayStatus.Published.ID)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.HALT_RESUME_NOT_ALLOW_WORKORDER);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then(() => { });
        return;
      }
      const obj = {
        title: stringFormat(CORE.MESSAGE_CONSTANT.START_WORKORDER_CONFIRM, workorder.woNumber),
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };

      if (workorder.woID) {
        const workorderStatus = {
          woID: workorder.woID,
          woTransHoldUnholdId: workorder.workorderTransHoldUnhold ? workorder.workorderTransHoldUnhold.woTransHoldUnholdId : null,
          unHoldEmployeeId: vm.employeeDetails.id,
          holdEmployeeId: vm.employeeDetails.id,
          woNumber: workorder.woNumber,
          assyName: workorder.PIDCode,
          rohsIcon: CORE.WEB_URL + USER.ROHS_BASE_PATH + workorder.rohs.rohsIcon,
          rohsName: workorder.rohs.name,
          partID: workorder.partID
        };
        workorderStatus.isStopWorkorder = !workorder.isStopWorkorder;
        DialogFactory.dialogService(
          TRAVELER.WORKORDER_HOLD_UNHOLD_MODEL_CONTROLLER,
          TRAVELER.WORKORDER_HOLD_UNHOLD_MODEL_VIEW,
          ev,
          workorderStatus).then((response) => {
            workorder.workorderTransHoldUnhold = response;
            workorder.isStopWorkorder = workorderStatus.isStopWorkorder;       // Bind Model with Added history detail of Halt Resume operation
          }, (error) => BaseService.getErrorLog(error));
      }
    };
    // Don't Remove this code - For Start/Stop Work Order Operation
    //save button enable on change in invite page
    const saveBtn = $scope.$on('saveButtonEnable', (ev, data) => {
      vm.isinviteSaveBtnDisable = data;
    });

    //save button enable on change in invite page
    const saveBtnowner = $scope.$on('saveButtonOwnerEnable', (ev, data) => {
      vm.isCoownerSaveBtnDisable = data;
    });

    // to make Review Comments & Change Request button enable
    const woRevCommentChangeReqEnable = $scope.$on('woRevCommentChangeReqEnable', (ev, data) => {
      if (data && vm.employeeDetails && vm.workorder.woID) {
        woRevReqID = data.woRevReqID || null;
        getWORevReqForReview();
      }
    });

    //catch if any change in operation
    const operationChange = $scope.$on('operationChanged', (evt, data) => {
      $scope.$broadcast('operationChangedMain', data);
    });

    //catch if any change in operation
    const operationVerified = $scope.$on('operationVerified', (evt, data) => {
      vm.workorder.isOperationsVerified = data;
      $scope.$broadcast('operationVerifiedMain', data);
    });

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
    $scope.$on('$destroy', () => {
      // Remove socket listeners
      removeSocketListener();
      refreshTree();
      saveBtn();
      saveBtnowner();
      woRevCommentChangeReqEnable();
      refreshWOHeaderDetails();
      operationChange();
      operationVerified();
      $mdDialog.hide(false, {
        closeAll: true
      });
    });

    // on disconnect socket.io
    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });

    function notificationReceiveListener(message) { $timeout(notificationReceive(message)); }

    function notificationReceive(message) {
      switch (message.event) {
        case CORE.NOTIFICATION_MESSAGETYPE.WO_OP_HOLD.TYPE:
        case CORE.NOTIFICATION_MESSAGETYPE.WO_OP_UNHOLD.TYPE: {
          _.each(vm.SelectedOperationList, (opObj) => {
            if (opObj.opID === message.data.opID) {
              opObj.isStopOperation = message.data.isStopOperation;
              opObj.workorderTransOperationHoldUnhold = {};
              if (opObj.isStopOperation) {
                opObj.workorderTransOperationHoldUnhold.woTransOpHoldUnholdId = message.data.woTransOpHoldUnholdId;
              }
            }
          });
          _.each(vm.workorderClusterList, (item) => {
            _.each(item.workorderOperationCluster, (clusterop) => {
              if (clusterop.opID === message.data.opID) {
                clusterop.isStopOperation = message.data.isStopOperation;
                clusterop.workorderTransOperationHoldUnhold = {};
                if (clusterop.isStopOperation) {
                  clusterop.workorderTransOperationHoldUnhold.woTransOpHoldUnholdId = message.data.woTransOpHoldUnholdId;
                }
              }
            });
          });
          if (message.data.notificationMst.senderID !== loginUserDetails.employee.id) {
            const model = {
              title: message.data.subject,
              textContent: message.data.isStopOperation ? message.data.reason : message.data.resumeReason,
              multiple: true
            };

            return DialogFactory.alertDialog(model, () => {
              var model = {
                notificationID: message.data.notificationMst.id,
                receiverID: loginUserDetails.employee.id,
                requestStatus: CORE.NotificationRequestStatus.Accepted
              };
              NotificationSocketFactory.ackNotification().save(model).$promise.then(() => {
                /* empty */
              }).catch(() => {
                /* empty */
              });
            });
          }
          break;
        }
        case CORE.NOTIFICATION_MESSAGETYPE.WO_START.TYPE:
        case CORE.NOTIFICATION_MESSAGETYPE.WO_STOP.TYPE: {
          vm.workorder.isStopWorkorder = message.data.isStopWorkorder;
          if (message.data.notificationMst.senderID !== loginUserDetails.employee.id) {
            const model = {
              title: message.data.subject,
              textContent: message.data.isStopWorkorder ? message.data.reason : message.data.resumeReason,
              multiple: true
            };
            return DialogFactory.alertDialog(model, () => {
              var model = {
                notificationID: message.data.notificationMst.id,
                receiverID: loginUserDetails.employee.id,
                requestStatus: CORE.NotificationRequestStatus.Accepted
              };
              NotificationSocketFactory.ackNotification().save(model).$promise.then(() => {
                /* empty */
              }).catch(() => {
                /* empty */
              });
            });
          }
          break;
        }
        case CORE.NOTIFICATION_MESSAGETYPE.WO_PRODUCTION_START_AS_FIRST_CHECKIN.TYPE: {
          if (vm.workorder.woID === message.data.woID) {
            vm.IsProductionStart = true;
          }
          break;
        }
      }
    }

    const refreshTree = $scope.$on('bindWorkorderTreeViewMain', (event, args) => {
      $scope.$broadcast('bindWorkorderTreeView', args);
      if (!vm.isShowSideNav) {
        vm.HideShowSideNav();
      }
      vm.isDisableStatusMenu = (vm.enableChangeWOStatus && !vm.IsProductionRunning && !vm.isWoInSpecificStatusNotAllowedToChange && vm.workorder.woID) ? false : true;
    });

    $scope.$on('$destroy', () => {
      // console.log("destroy event");
      stateChangeSuccessCall();
      $mdDialog.hide();
    });

    vm.HideShowSideNav = () => {
      $mdSidenav('workorder-tree').open();
      // added for custom apply z-index
      const myEl = angular.element(document.querySelector('workorder-tree'));
      if (myEl.length > 0) {
        myEl.removeClass('workorder-tree-hide');
      }
      // added for custom apply z-index
      vm.isShowSideNav = true;
    };

    const refreshWOHeaderDetails = $scope.$on('refreshWorkOrderHeaderDetails', (event, args) => vm.isWOHeaderDetailsChanged = !vm.isWOHeaderDetailsChanged);

    /* refresh work order header */
    vm.refreshWorkOrderHeaderDetails = () => {
      $timeout(() => {
        vm.isWOHeaderDetailsChanged = !vm.isWOHeaderDetailsChanged;
      }, _configBreadCrumbTimeout);
    };


    //check bill of material added for work order assembly or not
    const validateAssemblyByAssyID = () => {
      const objCheckBOM = { partIDs: [vm.workorder.partID], shippingAddressID: null, isFromSalesOrder: false };
      return WorkorderFactory.validateAssemblyByAssyID().update({ obj: objCheckBOM }).$promise.then((response) => {
        if (response && response.data) {
          return response.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.goToComponentBOM = () => {
      BaseService.goToComponentBOM(vm.workorder.partID);
      return false;
    };

    // when search from work order auto complete
    const getWorkOrderSearch = (searchObj) => WorkorderFactory.getAllWOForSearchAutoComplete().query(searchObj).$promise.then((response) => {
      if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
        return response.data;
      }
      else {
        return [];
      }
    }).catch((error) => BaseService.getErrorLog(error));

    // when select work order to move at selected
    const selectedGoToWorkOrder = (selectedItem) => {
      if (selectedItem && selectedItem.woID && selectedItem.woID !== vm.workorder.woID) {
        $state.go(WORKORDER.MANAGE_WORKORDER_DETAILS_STATE, { woID: selectedItem.woID }, { reload: true });
        $timeout(() => {
          vm.autoCompleteGoToWO.keyColumnId = null;
        }, true);
      }
    };

    /*Auto-complete for Search work order */
    vm.autoCompleteGoToWO = {
      columnName: 'woNumerWithDetail',
      keyColumnName: 'woID',
      keyColumnId: null,
      inputName: 'WorkOrder',
      placeholderName: 'WorkOrder',
      isRequired: false,
      isAddnew: false,
      onSelectCallbackFn: selectedGoToWorkOrder,
      onSearchFn: function (query) {
        const searchobj = {
          searchquery: query
        };
        return getWorkOrderSearch(searchobj);
      }
    };

    // open pop-up to add new work order
    vm.addNewWorkOrder = (event) => {
      const pageRightsAccessDet = {
        popupAccessRoutingState: [WORKORDER.WORKORDER_WORKORDERS_STATE],
        pageNameAccessLabel: CORE.PageName.Workorder
      };
      if (BaseService.checkRightToAccessPopUp(pageRightsAccessDet)) {
        const data = {
          woID: null,
          openInNewTab: true
        };

        DialogFactory.dialogService(
          WORKORDER.ADD_WORKORDER_CONTROLLER,
          WORKORDER.ADD_WORKORDER_VIEW,
          event,
          data).then(() => { //Success Section
          }, () => { //Cancel Section
          });
      }
    };

    //check bill of material added for work order assembly or not
    const checkDateCodeOnPublishWO = () => WorkorderFactory.checkDateCodeOnPublishWO({
      woID: vm.workorder.woID
    }).query().$promise.then((response) => {
      if (response && response.data) {
        return response.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));


    // to check form is dirty or not
    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);
  }
})();
