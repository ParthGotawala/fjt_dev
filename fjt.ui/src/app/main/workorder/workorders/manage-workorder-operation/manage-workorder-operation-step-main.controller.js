(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ManageWorkorderOperationMainController', ManageWorkorderOperationMainController);

  /** @ngInject */
  function ManageWorkorderOperationMainController($scope, $state, $timeout,
    CORE, WORKORDER, TRAVELER, USER, OPERATION,
    DialogFactory, $mdDialog,
    $mdSidenav, BaseService, WorkorderFactory, NotificationSocketFactory, WorkorderOperationFactory,
    socketConnectionService) {

    const vm = this;
    vm.previousState = null;
    vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.LOADDETAILS;
    vm.DisplayStatus = CORE.DisplayStatus;
    vm.OpStatus = CORE.OpStatus;
    let currSelectedWoOPID = null;
    //let OpStatusForTimeLine = CORE.OpStatus;

    // on state change success for select index of tabs
    let stateChangeSuccessCall = $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      // console.log('stateChanged 8');
      //if (toState == fromState) {
      vm.selectedTab = null;
      //}
      $timeout(() => {
        // Check Feature Rights
        vm.enableToggleOperation = BaseService.checkFeatureRights(CORE.FEATURE_NAME.ToggleOperation);
        vm.selectedTab = toState.data.selectedTab;
        if (fromState) {
          // If any route change in same page than do not consider as previous route
          if (fromState.name.indexOf(WORKORDER.MANAGE_WORKORDER_OPERATION_STATE) == -1) {
            vm.previousState = fromState.name;
            vm.previousStateParams = fromParams;
          }
        }
      }, _configWOTimeout);
      vm.operation.woOPID = $state.params.woOPID;
      if (currSelectedWoOPID != vm.operation.woOPID) {
        vm.isWoOpChanged = false;
      }
      operationDetails();
      //if ($state.params.woOPID > 0 && vm.operation.woOPID != $state.params.woOPID) {
      //    vm.operation.woOPID = $state.params.woOPID;
      //    operationDetails();
      //}
    });


    let loginUserDetails = BaseService.loginUser;
    vm.TabTitles = CORE.Workorder_Operation_Tabs;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.DisplayStatus = CORE.DisplayStatus;
    vm.OpStatus = CORE.OpStatus;
    vm.OperationTimePattern = CORE.OperationTimePattern;
    vm.OperationTimeMask = CORE.OperationTimeMask;
    vm.OperationType = CORE.CategoryType.OperationType;
    vm.entityName = CORE.AllEntityIDS.Operation.Name;
    vm.woOpListForHeader = [];
    /*Used in other field*/
    vm.Entity = CORE.Entity;

    vm.operation = {};
    vm.operation.woOPID = $state.params.woOPID;
    // store original data
    vm.operationMain = {};

    vm.ALLEntities = CORE.AllEntityIDS;
    vm.Workorder_operationEntity = vm.ALLEntities.Workorder_operation.Name;
    vm.operation_Entity = vm.ALLEntities.Operation.Name;
    vm.Component_Entity = vm.ALLEntities.Component.Name;
    vm.isWorkorderPublished = false;

    vm.taToolbar = CORE.Toolbar;

    /* retreive Operation Details*/
    let operationDetails = () => {
      let woOPID = vm.operation.woOPID ? vm.operation.woOPID : null;
      vm.cgBusyLoading = WorkorderOperationFactory.getOperationDet().query({ id: woOPID }).$promise.then((operation) => {
        if (operation && operation.data) {
          // update child table data to workorder obj
          if (operation.data.workorder) {
            if (operation.data.workorder.componentAssembly) {
              operation.data.workorder.PIDCode = operation.data.workorder.componentAssembly.PIDCode;
              operation.data.workorder.nickName = operation.data.workorder.componentAssembly.nickName;
            }
            vm.isWorkorderPublished = operation.data.workorder.woSubStatus == CORE.WOSTATUS.PUBLISHED;
            vm.isWOUnderTermination = (operation.data.workorder.woSubStatus == CORE.WOSTATUS.UNDER_TERMINATION || operation.data.workorder.woSubStatus == CORE.WOSTATUS.TERMINATED);
            vm.isWoInSpecificStatusNotAllowedToChange = (operation.data.workorder.woSubStatus == CORE.WOSTATUS.TERMINATED || operation.data.workorder.woSubStatus == CORE.WOSTATUS.COMPLETED || operation.data.workorder.woSubStatus == CORE.WOSTATUS.VOID) ? true : false;
          }
          vm.isWorkorderOperationPublished = operation.data.opStatus == vm.DisplayStatus.Published.ID;
          operation.data.opNumberText = operation.data.opNumber ? operation.data.opNumber.toFixed(3) : (0).toFixed(3);
          vm.operation = angular.copy(operation.data);

          vm.operationDisplayFormat = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, vm.operation.opName, vm.operation.opNumber);
          vm.dataLoaded = true;
          vm.operationMain = operation.data;
          vm.operation.processTime = convertDisplayTime(vm.operation.processTime);
          vm.operation.setupTime = convertDisplayTime(vm.operation.setupTime);
          vm.operation.perPieceTime = convertDisplayTime(vm.operation.perPieceTime);
          vm.IsProductionStart = vm.operation.workorderTransEmpinout.length > 0;
          vm.IsProductionComplete = vm.IsProductionOngoing = vm.IsFirstTrackingWOOP = false;
          if (vm.operation.operationProductionDetList.length > 0) {
            let operationProductionDet = _.first(vm.operation.operationProductionDetList);
            vm.IsProductionComplete = operationProductionDet.IsProductionComplete;
            vm.IsProductionOngoing = operationProductionDet.IsProductionOngoing;
            vm.trackBySerialFromWOOPNumber = operationProductionDet.trackBySerialFromWOOPNumber;
            vm.IsFirstTrackingWOOP = operationProductionDet.IsFirstTrackingWOOP;
          }

          vm.operation.workorderTransOperationHoldUnhold = _.first(vm.operation.workorderTransOperationHoldUnhold);
          if (vm.employeeDetails) {
            vm.getWORevReqForReview(vm.operation.woID);
          }
          getWorkOrderAllOperation() // to get work order all operation for work order header auto complete

          if (currSelectedWoOPID != vm.operation.woOPID) {
            currSelectedWoOPID = vm.operation.woOPID;
            vm.isWoOpChanged = true;
          }

          if (vm.operation.opStatus == 1) {
            vm.isPublishDisabled = true;
            vm.label = CORE.OPSTATUSLABLEDRAFT;
          }
          else if (vm.operation.opStatus == 0) {
            vm.label = CORE.OPSTATUSLABLEPUBLISH;
          }
          else {
            vm.label = "";
          }
          vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;
          vm.woReviewOtherDetails = {
            woVersion: vm.operation.workorder.woVersion,
            opName: vm.operation.opName
          }
          if (vm.operation.isFluxNotApplicable === true) {
            vm.isNCWSDisabled = true;
          } else {
            vm.isNCWSDisabled = false;
          }

          // to pass details in directive of wo op verification
          vm.woDetailsForWOOPVerification = {
            isWoInSpecificStatusNotAllowedToChange: vm.isWoInSpecificStatusNotAllowedToChange
          };
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
      //  };
    }

    /* key type template*/
    vm.goBack = () => {
      if (vm.selectedTab == 0) {
        // Check vm.isChange flag for color picker dirty object 
        if (vm.frmOperationDetails.$dirty || vm.isChange && !vm.isWorkorderPublished) {
          showWithoutSavingAlertforBackButton(vm.frmOperationDetails);
        } else {
          if (vm.previousState) {
            $state.go(vm.previousState, vm.previousStateParams);
          } else {
            $state.go(WORKORDER.MANAGE_WORKORDER_OPERATIONS_STATE, { woID: vm.operation.woID });
          }
        }
      } else if (vm.selectedTab == 1) {
        if (vm.frmOperationInstruction.$dirty) {
          showWithoutSavingAlertforBackButton(vm.frmOperationInstruction);
        } else {
          if (vm.previousState) {
            $state.go(vm.previousState, vm.previousStateParams);
          } else {
            $state.go(WORKORDER.MANAGE_WORKORDER_OPERATIONS_STATE, { woID: vm.operation.woID });
          }
        }
      }
      else if (vm.selectedTab == 4) {
        if (vm.woOpPartsForm.$dirty) {
          showWithoutSavingAlertforBackButton(vm.woOpPartsForm);
        } else {
          if (vm.previousState) {
            $state.go(vm.previousState, vm.previousStateParams);
          } else {
            $state.go(WORKORDER.MANAGE_WORKORDER_OPERATIONS_STATE, { woID: vm.operation.woID });
          }
        }
      }
      else if (vm.selectedTab == 5) {
        if (vm.operationEquipments.$dirty) {
          showWithoutSavingAlertforBackButton(vm.operationEquipments);
        } else {
          if (vm.previousState) {
            $state.go(vm.previousState, vm.previousStateParams);
          } else {
            $state.go(WORKORDER.MANAGE_WORKORDER_OPERATIONS_STATE, { woID: vm.operation.woID });
          }
        }
      } else if (vm.selectedTab == 7) {
        if (vm.FirstArticleForm.$dirty) {
          showWithoutSavingAlertforBackButton(vm.FirstArticleForm);
        } else {
          if (vm.previousState) {
            $state.go(vm.previousState, vm.previousStateParams);
          } else {
            $state.go(WORKORDER.MANAGE_WORKORDER_OPERATIONS_STATE, { woID: vm.operation.woID });
          }
        }
      } else if (vm.selectedTab == 8) {
        if (vm.operationOtherDetail.$dirty) {
          showWithoutSavingAlertforBackButton(vm.operationOtherDetail);
        } else if (vm.workorderDetailForm && vm.workorderDetailForm.$dirty) {
          showWithoutSavingAlertforBackButton(vm.workorderDetailForm);
        } else {
          if (vm.previousState) {
            $state.go(vm.previousState, vm.previousStateParams);
          } else {
            $state.go(WORKORDER.MANAGE_WORKORDER_OPERATIONS_STATE, { woID: vm.operation.woID });
          }
        }
      } else if (vm.selectedTab == 9) {
        if (vm.operationStatusForm.$dirty) {
          showWithoutSavingAlertforBackButton(vm.operationStatusForm);
        } else if (vm.workorderDetailForm && vm.workorderDetailForm.$dirty) {
          showWithoutSavingAlertforBackButton(vm.workorderDetailForm);
        } else {
          if (vm.previousState) {
            $state.go(vm.previousState, vm.previousStateParams);
          } else {
            $state.go(WORKORDER.MANAGE_WORKORDER_OPERATIONS_STATE, { woID: vm.operation.woID });
          }
        }
      } else {
        if (vm.previousState) {
          $state.go(vm.previousState, vm.previousStateParams);
        } else {
          $state.go(WORKORDER.MANAGE_WORKORDER_OPERATIONS_STATE, { woID: vm.operation.woID });
        }
      }
    }

    //get operation status by id
    vm.getOpStatus = (statusID) => {
      return BaseService.getOpStatus(statusID);
    }

    //On change operation status
    vm.changeOpStatus = (statusID, oldStatusID, event) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      if (vm.isWOUnderTermination || vm.isWorkorderPublished) {
        var model = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: WORKORDER.CHANGE_STATUS_WORKORDER_OPERATION,
          multiple: true
        };
        DialogFactory.alertDialog(model);
        return;
      }
      if (vm.operation.isLoopOperation && vm.operation.LoopOperationError && statusID == vm.DisplayStatus.Published.ID) {
        var model = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: vm.operation.LoopOperationError,
          multiple: true
        };
        DialogFactory.alertDialog(model).then((respOfOk) => {
          if (vm.autoCompleteLoopToOp) {
            setFocusByName(vm.autoCompleteLoopToOp.inputName);
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
        statusID = oldStatusID;
        return;
      }
      else if (statusID != oldStatusID) {
        let obj = {
          title: USER.DELETE_CONFIRM,
          textContent: stringFormat(OPERATION.OP_STATUS_CHANGE, vm.getOpStatus(oldStatusID), vm.getOpStatus(statusID)),
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.confirmDiolog(obj).then((yes) => {
          if (yes) {
            if (statusID == 0) {
              vm.label = CORE.OPSTATUSLABLEPUBLISH;
            }
            else if (statusID == 1) {
              vm.label = CORE.OPSTATUSLABLEDRAFT;
            }
            else {
              vm.label = "";
            }
            vm.operation.opStatus = statusID;
            if (vm.selectedTab == 0) {
              vm.frmOperationDetails.$setDirty();
              let requiredData = {
                isWOOPStatusChangeAction: true,
                oldStatusID: oldStatusID
              }
              vm.SaveWorkorderOperation(event, requiredData);
            } else {
              const operationStatus = {
                woOPID: vm.operation.woOPID,
                woID: vm.operation.woID,
                opID: vm.operation.opID,
                opStatus: vm.operation.opStatus,
                woNumber: vm.operation.workorder.woNumber,
                opName: vm.operation.opName,
                opTypeForWOOPTimeLineLog: CORE.Operations_Type_For_WOOPTimeLineLog.WoOpStatus
              }
              if (vm.operation.opID) {
                vm.IsDocumentTab = false;
                vm.cgBusyLoading = WorkorderOperationFactory.updateOperation().update({
                  id: vm.operation.woOPID,
                }, operationStatus).$promise.then((res) => {
                  vm.IsDocumentTab = true;
                  if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                    vm.isWorkorderOperationPublished = vm.operation.opStatus == vm.DisplayStatus.Published.ID;
                    vm.refreshWorkOrderHeaderDetails();
                    if (vm.operationStatusForm) {
                      vm.operationStatusForm.$setPristine();
                    }
                    let sentData = {
                      isOperationsVerified: false,
                      isOperationAvailable: true
                    }
                    $scope.$broadcast('operationChangedMain', sentData);
                  }
                }).catch((error) => {
                  return BaseService.getErrorLog(error);
                });
              }
            }
          }
        }, (cancel) => {
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }
    function showWithoutSavingAlertforBackButton(form) {
      let obj = {
        title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
        textContent: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_BODY_MESSAGE,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.confirmDiolog(obj).then((res) => {
        if (res) {
          if (form) {
            form.$setPristine();
          }
          if (vm.previousState) {
            $state.go(vm.previousState, vm.previousStateParams);
          } else {
            $state.go(WORKORDER.MANAGE_WORKORDER_OPERATIONS_STATE, { woID: vm.operation.woID });
          }
        }
      }, (error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.employeeDetails = BaseService.loginUser.employee;
    // [S] code for checking wo change review sidebar
    vm.woRevReqForReview = null;
    var woRevReqID = isNaN(parseInt($state.params.woRevReqID)) ? null : $state.params.woRevReqID;

    vm.getWORevReqForReview = (woID) => {
      WorkorderFactory.getDefaultWORevReqForReview().query({ woID: woID, woRevReqID: woRevReqID, empID: vm.employeeDetails.id }).$promise.then((response) => {
        if (response && response.data) {
          vm.woRevReqForReview = response.data;
          if ($state.params.openRevReq == 'true')
            vm.openWorkorderReviewModel();
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    // Work Order review sidenav
    vm.openWorkorderReviewModel = ($event) => {

      $mdSidenav('workorder-review').open();
      vm.isWorkorderReviewSideNavOpen = true;

      $mdSidenav('workorder-review').onClose(function () {
        vm.isWorkorderReviewSideNavOpen = false;
      });
    }
    // ENDS

    // [E]


    /* On change of processTime , calculate perPieceTime and display */
    vm.setPerPieceTime = () => {
      if (vm.operation && vm.operation.processTime) {
        let processTimeInSeconds = timeToSeconds(vm.operation.processTime)
        //parseInt(vm.operation.workorder.excessQty || 0)
        let totalQty = parseInt(vm.operation.workorder.buildQty || 0);
        if (totalQty > 0) {
          let perPieceTimeInSeconds = processTimeInSeconds / totalQty;
          vm.operation.perPieceTime = secondsToTime(perPieceTimeInSeconds);
        }
        else {
          vm.operation.perPieceTime = "00:00";
        }
      }
      else {
        vm.operation.perPieceTime = "00:00";
      }
    }

    /* On change of perPieceTime , calculate total processTime and display */
    vm.setTotalProcessTime = () => {
      if (vm.operation && vm.operation.perPieceTime) {
        let perPieceTimeInSeconds = timeToSeconds(vm.operation.perPieceTime)
        //parseInt(vm.operation.workorder.excessQty || 0)
        let totalQty = parseInt(vm.operation.workorder.buildQty || 0);
        let totalProcessTimeInSeconds = perPieceTimeInSeconds * totalQty;
        vm.operation.processTime = secondsToTime(totalProcessTimeInSeconds);
      }
      else {
        vm.operation.processTime = "00:00";
      }
    }


    // Don't Remove this code - For Start/Stop Work Order Operation
    ///*Onclick of start workorder operation*/
    vm.toggleWorkorderOperation = (operation, ev) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      if (!vm.enableToggleOperation) {
        var model = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: WORKORDER.HALT_RESUME_NOT_ALLOW_WORKORDER_OPERATION,
          multiple: true
        };
        DialogFactory.alertDialog(model);
        return;
      }
      let opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, operation.opName, operation.opNumber);
      let obj = {
        title: stringFormat(CORE.MESSAGE_CONSTANT.ALERT_HEADER),
        textContent: stringFormat(CORE.MESSAGE_CONSTANT.START_WORKORDER_OPERATION_CONFIRM, opFullName),
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };

      var employeeDetail = BaseService.loginUser.employee;

      if (operation.woOPID) {
        const operationStatus = {
          woOPID: operation.woOPID,
          woID: operation.woID,
          opID: operation.opID,
          woTransOpHoldUnholdId: operation.workorderTransOperationHoldUnhold ? operation.workorderTransOperationHoldUnhold.woTransOpHoldUnholdId : null,
          unHoldEmployeeId: employeeDetail.id,
          holdEmployeeId: employeeDetail.id,
          woNumber: operation.workorder.woNumber,
          opName: operation.opName,
          isWoInSpecificStatusNotAllowedToChange: vm.isWoInSpecificStatusNotAllowedToChange,
          opNumber: operation.opNumberText
        }
        operationStatus.isStopOperation = !operation.isStopOperation;
        DialogFactory.dialogService(
          TRAVELER.OPERATION_HOLD_UNHOLD_MODEL_CONTROLLER,
          TRAVELER.OPERATION_HOLD_UNHOLD_MODEL_VIEW,
          ev,
          operationStatus).then((response) => {
            operation.workorderTransOperationHoldUnhold = response;
            operation.isStopOperation = operationStatus.isStopOperation;       // Bind Model with Added history detail of Halt Resume operation
          }, (err) => {
            return BaseService.getErrorLog(err);
          });
      }
    }
    // Don't Remove this code - For Start/Stop Work Order Operation

    vm.sendNotification = (versionModel) => {
      if (versionModel) {
        versionModel.employeeID = loginUserDetails.employee.id;
        versionModel.messageType = CORE.NOTIFICATION_MESSAGETYPE.WO_OP_VERSION_CHANGE.TYPE;
        NotificationSocketFactory.sendNotification().save(versionModel).$promise.then((response) => {
          /* empty */
        }).catch((error) => {
          /* empty */
        });
      }
    }

    vm.openWOOPRevisionPopup = (callbackFn, event) => {
      var model = {
        woOPID: vm.operation.woOPID
      };
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_OPERATION_REVISION_POPUP_CONTROLLER,
        WORKORDER.WORKORDER_OPERATION_REVISION_POPUP_VIEW,
        event,
        model).then((versionModel) => {
          // Added for close revision dialog popup
          if (versionModel && versionModel.isCancelled) {
            callbackFn(versionModel);
            return;
          }
          if (versionModel.opVersion && versionModel.woVersion) {
            vm.operation.opVersion = versionModel.opVersion;
            vm.operation.workorder.woVersion = versionModel.woVersion;
          }
          callbackFn(versionModel);
        }, (versionModel) => {
          callbackFn(versionModel);
        }, (error) => {
          callbackFn();
        });
    }

    //update on validated from header
    let operationVerified = $scope.$on("operationVerifiedMain", function (evt, data) {
      if (data) {
        vm.operation.workorder.isOperationsVerified = data;
      }
    });
    //catch if any change in operation
    let operationChange = $scope.$on("operationChanged", function (evt, data) {
      $scope.$broadcast('operationChangedMain', data);
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

    $scope.$on('$destroy', function () {
      // Remove socket listeners
      removeSocketListener();
      refreshTree();
      refreshWOHeaderDetails();
      operationVerified();
      operationChange();
      $mdDialog.hide(false, {
        closeAll: true
      });
    });

    // on disconnect socket.io
    socketConnectionService.on('disconnect', function () {
      removeSocketListener();
    });

    function notificationReceiveListener(message) { $timeout(notificationReceive(message)); }

    function notificationReceive(message) {
      switch (message.event) {
        case CORE.NOTIFICATION_MESSAGETYPE.WO_OP_HOLD.TYPE:
        case CORE.NOTIFICATION_MESSAGETYPE.WO_OP_UNHOLD.TYPE: {
          if (message.data) {
            vm.operation.isStopOperation = message.data.isStopOperation;
            vm.operation.workorderTransOperationHoldUnhold = {};
            if (vm.operation.isStopOperation) {
              vm.operation.workorderTransOperationHoldUnhold.woTransOpHoldUnholdId = message.data.woTransOpHoldUnholdId;
            }
            if (message.data.notificationMst.senderID != loginUserDetails.employee.id) {
              var model = {
                title: message.data.subject,
                textContent: message.data.isStopOperation ? message.data.reason : message.data.resumeReason,
                multiple: true
              };
              return DialogFactory.alertDialog(model, function () {
                var model = {
                  notificationID: message.data.notificationMst.id,
                  receiverID: loginUserDetails.employee.id,
                  requestStatus: CORE.NotificationRequestStatus.Accepted
                };
                NotificationSocketFactory.ackNotification().save(model).$promise.then((response) => {
                  /* empty */
                }).catch((error) => {
                  /* empty */
                });
              });
            }
          }
          break;
        }
      }
    }

    // bind on event to refresh tree view
    let refreshTree = $scope.$on('bindWorkorderTreeViewMain', function (event, args) {
      $scope.$broadcast('bindWorkorderTreeView', args);
      if (!vm.isShowSideNav) {
        vm.HideShowSideNav();
      }
    });


    $scope.$on('$destroy', function () {
      stateChangeSuccessCall();
    });

    vm.HideShowSideNav = () => {
      $mdSidenav('workorder-tree').open();
      // added for custom apply z-index
      var myEl = angular.element(document.querySelector('workorder-tree'));
      if (myEl.length > 0)
        myEl.removeClass('workorder-tree-hide');
      // added for custom apply z-index
      vm.isShowSideNav = true;
    }

    let refreshWOHeaderDetails = $scope.$on('refreshWorkOrderHeaderDetails', function (event, args) {
      vm.isWOHeaderDetailsChanged = !vm.isWOHeaderDetailsChanged;
    });

    vm.refreshWorkOrderHeaderDetails = () => {
      $timeout(() => {
        //console.log("isWOHeaderDetailsChanged - " + vm.isWOHeaderDetailsChanged);
        vm.isWOHeaderDetailsChanged = !vm.isWOHeaderDetailsChanged;
      }, _configBreadCrumbTimeout);
    }

    // go to work order operation list
    vm.goToWorkorderOperations = () => {
      BaseService.goToWorkorderOperations(vm.operation.woID);
      return false;
    }
    vm.goToWorkorderOperationDetails = (woOPID) => {
      BaseService.goToWorkorderOperationDetails(woOPID);
      return false;
    }

    // to check form is dirty or not
    vm.checkFormDirty = (form, columnName) => {
      let result = BaseService.checkFormDirty(form, columnName);
      return result;
    }

    // get work order operation detail
    let getWorkOrderAllOperation = () => {
      if (vm.operation.woID) {
        return WorkorderOperationFactory.retriveOPListbyWoID().query({ woID: vm.operation.woID }).$promise.then((response) => {
          if (response && response.data) {
            vm.woOpListForHeader = response.data;
            _.each(vm.woOpListForHeader, (item) => {
              item.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, item.opName, item.opNumber)
            })
          }
          return response;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

    }

    // when user select work order operation from auto complete
    let onSelectedWOOP = (selectedItem) => {
      if (selectedItem && selectedItem.woOPID && vm.operation.woOPID != selectedItem.woOPID) {
        $state.go(WORKORDER.MANAGE_WORKORDER_OPERATION_DETAILS_STATE, { woOPID: selectedItem.woOPID }, { reload: true });
        $timeout(() => {
          vm.autoCompleteGoToWOOP.keyColumnId = null;
        }, true);
      }

    }

    // auto complete for work order operation - display at header
    vm.autoCompleteGoToWOOP = {
      columnName: 'opFullName',
      keyColumnName: 'woOPID',
      keyColumnId: null,
      inputName: 'WorkOrderOperation',
      placeholderName: 'Work Order Operation',
      isRequired: false,
      isAddnew: false,
      callbackFn: getWorkOrderAllOperation,
      onSelectCallbackFn: onSelectedWOOP,
    }

    // to move at work order operation list page for adding new operations
    vm.addNewOperationInWO = () => {
      if (vm.operation && vm.operation.woID) {
        $state.go(WORKORDER.MANAGE_WORKORDER_OPERATIONS_STATE, { woID: vm.operation.woID });
      }
    }



  };
})();
