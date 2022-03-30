(function () {
  'use strict';

  angular
    .module('app.operation.operations')
    .controller('ManageOperationsController', ManageOperationsController);

  /** @ngInject */
  function ManageOperationsController($scope, $state, $stateParams, $timeout, CORE, OPERATION, USER, OperationFactory,
    DialogFactory, MasterFactory, BaseService, $mdDialog, $mdMenu) {
    const vm = this;
    vm.DisplayStatus = CORE.DisplayStatus;
    vm.OpStatus = CORE.OpStatus;
    //vm.isPublishDisabled = false;
    vm.SupplyMaterialtab = CORE.LabelConstant.SuppliesMaterialsAndTools.MenuName;
    vm.EquipmentToolsTab = CORE.LabelConstant.Equipment.MenuName;
    vm.EmployeeTab = CORE.LabelConstant.Personnel.MenuName;
    vm.isDetailsLoaded = false;
    vm.OperationMasterTabs = OPERATION.OperationMasterTabs;
    vm.operationIcon = OPERATION.OPERATION_ICON;
    vm.entityName = CORE.AllEntityIDS.Operation.Name;
    vm.operationLabelConstant = CORE.LabelConstant.Operation;
    const IsPermanentDelete = CORE.IsPermanentDelete;
    let oldOPName = '';

    const initOpBasicDet = () => {
      vm.operation = {
        isIssueQty: false,
        isTeamOperation: true,
        isRework: false,
        isMoveToStock: false,
        isPlacementTracking: false,
        qtyControl: CORE.OperationQtyTrackeing.QtyTrackingNotRequired,
        isLoopOperation: false,
        tabLimitAtTraveler: 1,
        isFluxNotApplicable: true,
        isNoClean: false,
        isWaterSoluble: false
      };
    };
    initOpBasicDet();

    vm.operation.opID = $stateParams.opID;

    vm.pageTabRights =
    {
      DetailsTab: false,
      DoDontTab: false,
      DocumentsTab: false,
      DataFieldsTab: false,
      PartsTab: false,
      EquipmentsTab: false,
      EmployeesTab: false,
      TemplatesTab: false
    };

    vm.stateTransfer = (tabIndex) => {
      var itemTabName = _.find(vm.OperationMasterTabs, (valItem) => valItem.ID === tabIndex);
      if (itemTabName && itemTabName.Name !== vm.tabName) {
        switch (itemTabName.Name) {
          case vm.OperationMasterTabs.Details.Name:
            $state.go(OPERATION.OPERATION_MANAGE_DETAILS_STATE, { opID: vm.operation.opID });
            break;
          case vm.OperationMasterTabs.DoDont.Name:
            $state.go(OPERATION.OPERATION_MANAGE_DODONT_STATE, { opID: vm.operation.opID });
            break;
          case vm.OperationMasterTabs.Documents.Name:
            $state.go(OPERATION.OPERATION_MANAGE_DOCUMENTS_STATE, { opID: vm.operation.opID });
            break;
          case vm.OperationMasterTabs.DataFields.Name:
            $state.go(OPERATION.OPERATION_MANAGE_DATAFIELDS_STATE, { opID: vm.operation.opID });
            break;
          case vm.OperationMasterTabs.Parts.Name:
            $state.go(OPERATION.OPERATION_MANAGE_PARTS_STATE, { opID: vm.operation.opID });
            break;
          case vm.OperationMasterTabs.Equipments.Name:
            $state.go(OPERATION.OPERATION_MANAGE_EQUIPMENTS_STATE, { opID: vm.operation.opID });
            break;
          case vm.OperationMasterTabs.Employees.Name:
            $state.go(OPERATION.OPERATION_MANAGE_EMPLOYEES_STATE, { opID: vm.operation.opID });
            break;
          case vm.OperationMasterTabs.Templates.Name:
            $state.go(OPERATION.OPERATION_MANAGE_TEMPLATES_STATE, { opID: vm.operation.opID });
            break;
          default:
        }
      }
    };

    function setTabWisePageRights(pageList) {
      if (pageList && pageList.length > 0) {
        let tab = pageList.filter((a) => a.PageDetails !== null && a.PageDetails.pageRoute === OPERATION.OPERATION_MANAGE_DETAILS_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.DetailsTab = true;
        }
        tab = pageList.filter((a) => a.PageDetails !== null && a.PageDetails.pageRoute === OPERATION.OPERATION_MANAGE_DODONT_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.DoDontTab = true;
        }
        tab = pageList.filter((a) => a.PageDetails !== null && a.PageDetails.pageRoute === OPERATION.OPERATION_MANAGE_DOCUMENTS_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.DocumentsTab = true;
        }
        tab = pageList.filter((a) => a.PageDetails !== null && a.PageDetails.pageRoute === OPERATION.OPERATION_MANAGE_DATAFIELDS_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.DataFieldsTab = true;
        }
        tab = pageList.filter((a) => a.PageDetails !== null && a.PageDetails.pageRoute === OPERATION.OPERATION_MANAGE_PARTS_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.PartsTab = true;
        }
        tab = pageList.filter((a) => a.PageDetails !== null && a.PageDetails.pageRoute === OPERATION.OPERATION_MANAGE_EQUIPMENTS_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.EquipmentsTab = true;
        }
        tab = pageList.filter((a) => a.PageDetails !== null && a.PageDetails.pageRoute === OPERATION.OPERATION_MANAGE_EMPLOYEES_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.EmployeesTab = true;
        }
        tab = pageList.filter((a) => a.PageDetails !== null && a.PageDetails.pageRoute === OPERATION.OPERATION_MANAGE_TEMPLATES_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.TemplatesTab = true;
        }
      }
    }

    $scope.$on(USER.LoginUserPageListBroadcast, (event, data) => {
      var menudata = data;
      setTabWisePageRights(menudata);
      $scope.$applyAsync();
    });

    $timeout(() => {
      vm.checkDirtyObject = {
        columnName: ['opDescription', 'opWorkingCondition', 'opManagementInstruction', 'opDeferredInstruction', 'opDoes', 'opDonts', 'opStatus'],
        oldModelName: angular.copy(vm.operation),
        newModelName: vm.operation
      };
    }, 2000);

    if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
      setTabWisePageRights(BaseService.loginUserPageList);
    }

    vm.tabName = $stateParams.selectedTab;
    vm.selectedTabIndex = vm.OperationMasterTabs.Details.ID;
    if (vm.tabName) {
      if (!vm.operation.opID) {
        if (vm.tabName !== vm.OperationMasterTabs.Details.Name) {
          $state.go(OPERATION.OPERATION_MANAGE_DETAILS_STATE, { id: vm.operation.opID });
        }
      } else {
        const tab = _.find(vm.OperationMasterTabs, (item) => item.Name === vm.tabName);
        if (tab) {
          vm.selectedTabIndex = tab.ID;
        }
      }
    }

    /* key type template*/
    vm.goBack = (msWizard) => {
      vm.checkDirtyObject.newModelName = vm.operation;
      // Check vm.isChange flag for color picker dirty object
      if (BaseService.checkFormDirty(vm.operationDetailsForm, vm.checkDirtyObject) || vm.isChange) {
        showWithoutSavingAlertforBackButton(msWizard);
      } else if (BaseService.checkFormDirty(vm.operationInstruction, vm.checkDirtyObject)) {
        showWithoutSavingAlertforBackButton(msWizard);
      }
      else {
        BaseService.currentPageForms = [];
        $state.go(OPERATION.OPERATION_OPERATIONS_STATE);
      }
    };

    function showWithoutSavingAlertforBackButton(msWizard) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (msWizard) {
            msWizard.currentStepForm().$setPristine();
            $state.go(OPERATION.OPERATION_OPERATIONS_STATE);
          }
        }
      }, (error) => BaseService.getErrorLog(error));
    }

    const getOperationSearch = (searchObj) => MasterFactory.getAllOperationDetail().query(searchObj).$promise.then((response) => {
      if (response && response.data) {
        vm.OperationList = response.data;
        _.each(vm.OperationList, (opItem) => {
          opItem.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, opItem.opName, opItem.opNumber);
        });

        return vm.OperationList;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    vm.addUpdateOperation = (item, openINSameTab) => {
      BaseService.goToManageOperation(item ? item.opID : null, openINSameTab);
      if (item) {
        $timeout(() => {
          vm.autoCompleteOperation.keyColumnId = null;
        }, true);
      }
    };

    /*Auto-complete for Search Operation */
    vm.autoCompleteOperation = {
      columnName: 'opFullName',
      keyColumnName: 'opID',
      keyColumnId: null,
      inputName: 'Operation',
      placeholderName: 'Operation',
      isRequired: false,
      isAddnew: false,
      onSelectCallbackFn: vm.addUpdateOperation,
      onSearchFn: function (query) {
        const searchobj = {
          searchquery: query
        };
        return getOperationSearch(searchobj);
      }
    };
    const changeFormatedOpName = () => {
      vm.oldOpNumber = angular.copy(vm.operation.opNumberText); // Used in Duplicate operation popup
      vm.oldOpName = angular.copy(vm.operation.opName);
      vm.formatedOpName = stringFormat('({0}) {1}', vm.operation.opNumberText, vm.operation.opName);
    };

    /* retrieve Operation Details*/
    vm.operationDetails = (opID) => {
      vm.cgBusyLoading = OperationFactory.operation().query({ id: opID }).$promise.then((operation) => {
        if (operation && operation.data) {
          operation.data.opNumberText = operation.data.opNumber ? operation.data.opNumber.toFixed(3) : (0).toFixed(3);
          oldOPName = operation.data.opName;
          vm.operation = angular.copy(operation.data);
          if (!vm.operation) {
            initOpBasicDet();
            vm.operation.opID = opID;
            vm.operation.opStatus = vm.DisplayStatus.Draft.ID;
          }
          if (vm.operation.opStatus === vm.OpStatus[1].ID) {
            //vm.isPublishDisabled = true;
            vm.operationStatusLabel = CORE.OPSTATUSLABLEDRAFT;
          }
          else if (vm.operation.opStatus === vm.OpStatus[0].ID) {
            vm.operationStatusLabel = CORE.OPSTATUSLABLEPUBLISH;
          }
          else {
            vm.operationStatusLabel = '';
          }
          changeFormatedOpName();
          vm.operation.processTime = convertDisplayTime(vm.operation.processTime);
          vm.operation.setupTime = convertDisplayTime(vm.operation.setupTime);
          vm.operation.perPieceTime = convertDisplayTime(vm.operation.perPieceTime);
          $timeout(() => {
            if (vm.operation.opID && vm.operationDetails) {
              BaseService.checkFormValid(vm.operationDetails, false);
            }
          }, 0);
          vm.isDetailsLoaded = true;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    if (vm.operation.opID) {
      vm.operationDetails(vm.operation.opID);
    }
    else {
      vm.operation.opStatus = vm.DisplayStatus.Draft.ID;
      //if (vm.operation.opStatus == vm.OpStatus[1].ID) {
      //  vm.isPublishDisabled = true;
      //  vm.operationStatusLabel = CORE.OPSTATUSLABLEDRAFT;
      //}
      //else if (vm.operation.opStatus == vm.OpStatus[0].ID) {
      vm.operationStatusLabel = CORE.OPSTATUSLABLEPUBLISH;
      //}
      //else {
      //  vm.operationStatusLabel = "";
      //}

      vm.isDetailsLoaded = true;
    }


    //#region On change of tab
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
    //#endregion

    vm.checkFormDirty = (form, columnName) => {
      const result = BaseService.checkFormDirty(form, columnName);
      return result;
    };
    /* Next Step Click */
    vm.SaveOperationData = () => {
      vm.saveDisable = true;
      if (vm.selectedTabIndex === vm.OperationMasterTabs.Details.ID) {
        if (BaseService.focusRequiredField(vm.operationDetailsForm)) {
          vm.saveDisable = false;
          return;
        }
        if (vm.operationDetailsForm.$valid) {
          $scope.$broadcast('saveOperationDetailsTabChanges');
          vm.operationDetailsForm.$setPristine();
        }
      }
      else if (vm.selectedTabIndex === vm.OperationMasterTabs.DoDont.ID) {
        if (BaseService.focusRequiredField(vm.operationInstruction)) {
          vm.saveDisable = false;
          return;
        }
        if (vm.operationInstruction.$valid) {
          $scope.$broadcast('saveOperationDoDontTabChanges');
          vm.operationInstruction.$setPristine();
        }
      }
    };

    vm.changeOpStatus = (statusID, oldStatusID) => {
      if (statusID !== oldStatusID) {
        if ((vm.operationDetailsForm && vm.operationDetailsForm.$invalid) || (vm.operationInstruction && vm.operationInstruction.$invalid)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.OPERATION_STATUS_CHANGE);
          const obj = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(obj);
        }
        else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.OP_STATUS_CHANGE);
          messageContent.message = stringFormat(messageContent.message, vm.getOpStatus(oldStatusID), vm.getOpStatus(statusID));
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.operation.opStatus = statusID;
              if (statusID === vm.OpStatus[0].ID) {
                //vm.isPublishDisabled = false;
                vm.operationStatusLabel = CORE.OPSTATUSLABLEPUBLISH;
              }
              else if (statusID === vm.OpStatus[1].ID) {
                //vm.isPublishDisabled = true;
                vm.operationStatusLabel = CORE.OPSTATUSLABLEDRAFT;
              }
              else {
                vm.operationStatusLabel = '';
              }
              if (vm.selectedTabIndex === vm.OperationMasterTabs.Details.ID) {
                //vm.SaveOperation(msWizard, false);
                $scope.$broadcast('saveOperationDetailsTabChanges', statusID);
                vm.operationDetailsForm.$setPristine();
              }
              else if (vm.selectedTabIndex === vm.OperationMasterTabs.DoDont.ID) {
                //vm.saveOperationDoDont(msWizard);
                $scope.$broadcast('saveOperationDoDontTabChanges', statusID);
                vm.operationInstruction.$setPristine();
              }
              else {
                statusUpdate();
              }
            }
          }, () => { // empty
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    function statusUpdate() {
      const operationStatus = {
        opID: vm.operation.opID,
        opNumber: vm.operation.opNumber,
        opStatus: vm.operation.opStatus
      };
      if (vm.operation.opID) {
        vm.cgBusyLoading = OperationFactory.operation().update({
          id: vm.operation.opID
        }, operationStatus).$promise.then(() => {
          if (vm.operationDetailsForm) {
            vm.operationDetailsForm.$setPristine();
          }
          else if (vm.operationInstruction) {
            vm.operationInstruction.$setPristine();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }


    vm.onTabChanges = (TabName, msWizard) => {
      msWizard.selectedIndex = vm.selectedTabIndex;
      vm.stateTransfer(vm.selectedTabIndex);
      $('#content').animate({ scrollTop: 0 }, 200);
    };

    /* fun to check form dirty on tab change */
    vm.isStepValid = function (step) {
      switch (step) {
        case 0: {
          const isDirty = BaseService.checkFormDirty(vm.operationDetailsForm, vm.checkDirtyObject) || vm.isChange;
          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step);
          }
          else {
            return true;
          }
          break;
        }
        case 1: {
          const isDirty = BaseService.checkFormDirty(vm.operationInstruction, vm.checkDirtyObject);
          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step);
          }
          else {
            return true;
          }
          break;
        }
      }
    };

    /* Show save alert popup when performing tab change*/
    function showWithoutSavingAlertforTabChange(step) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.isSave = false;
          if (step === vm.OperationMasterTabs.Details.ID) {
            vm.operationDetails(vm.operation.opID);
            vm.operationDetailsForm.$setPristine();
            return true;
          } else if (step === vm.OperationMasterTabs.DoDont.ID) {
            vm.operationDetails(vm.operation.opID);
            vm.operationInstruction.$setPristine();
            return true;
          }
        }
      }, () => {  // empty
      }).catch((error) => BaseService.getErrorLog(error));
    }

    // Open popup for duplicate Operation.
    vm.duplicateOperation = (ev) => {
      // const data = angular.copy(vm.operation);
      const data = {
        opID: vm.operation.opID
      };
      DialogFactory.dialogService(
        OPERATION.DUPLICATE_OPERATION_POPUP_CONTROLLER,
        OPERATION.DUPLICATE_OPERATION_POPUP_VIEW,
        ev,
        data);
    };

    /* open menu of delete Operation template. */
    vm.openMenu = function ($mdMenu, ev) {
      $mdMenu.open(ev);
    };

    /* delete Operation template */
    vm.deleteRecord = () => {
      if (!vm.operation.opID) {
        return;
      }
      const selectedIDs = [vm.operation.opID];
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE_DET);
      messageContent.message = stringFormat(messageContent.message, 'Operation');
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      const objIDs = {
        id: selectedIDs,
        isPermanentDelete: IsPermanentDelete,
        CountList: false
      };
      $mdMenu.hide();
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.cgBusyLoading = OperationFactory.deleteOperation().query({ objIDs: objIDs }).$promise.then((res) => {
            if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              if (res.data && (res.data.length > 0 || res.data.transactionDetails)) {
                const data = {
                  TotalCount: res.data.transactionDetails[0].TotalCount,
                  pageName: CORE.PageName.operations
                };
                BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                  const objIDs = {
                    id: selectedIDs,
                    CountList: true
                  };
                  return vm.cgBusyLoading = OperationFactory.deleteOperation().save({
                    objIDs: objIDs
                  }).$promise.then((res) => {
                    if (res && res.data) {
                      let data = {};
                      data = res.data;
                      data.pageTitle = oldOPName;
                      data.PageName = CORE.PageName.operations;
                      data.id = selectedIDs;
                      data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                      DialogFactory.dialogService(
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                        ev,
                        data).then(() => {
                        }, () => {
                        }).catch((error) => BaseService.getErrorLog(error));
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                });
              } else {
                BaseService.currentPageForms = [];
                vm.goToOperationList(true);
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //get operation status by id
    vm.getOpStatus = (statusID) => BaseService.getOpStatus(statusID);

    // Go to operation list page.
    vm.goToOperationList = (openInSameTab) => BaseService.goToOperationList(openInSameTab);

    $scope.$on('updateOperationDetailsData', (eve, data) => {
      if (data) {
        vm.operation = angular.copy(data);
        vm.isChange = false;
        changeFormatedOpName();
      }
    });

    $scope.$on('updateOperationDoDontData', (eve, data) => {
      if (data) {
        vm.operation.opDoes = data.opDoes;
        vm.operation.opDonts = data.opDonts;
        vm.isChange = false;
      }
    });

    $scope.$on('statusUpdate', () => {
      statusUpdate();
    });
  }
})();
