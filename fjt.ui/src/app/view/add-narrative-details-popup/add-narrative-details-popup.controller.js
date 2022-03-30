(function () {
  'use strict';
  angular
    .module('app.rfqtransaction')
    .controller('AddHistoryNarrativePopupController', AddHistoryNarrativePopupController);
  /** @ngInject */
  function AddHistoryNarrativePopupController($scope, $q, $mdColorPicker, $mdDialog, data, CORE, RFQTRANSACTION, USER,
    DialogFactory, TravelersFactory, BaseService, WorkorderOperationEmployeeFactory, MasterFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.taToolbar = CORE.Toolbar;
    vm.allLabelConstant = CORE.LabelConstant;
    vm.OperationTimePattern = CORE.OperationTimePattern;
    vm.OperationTimeMask = CORE.OperationTimeMask;
    vm.categoryArray = angular.copy(CORE.RequitementCategory);
    vm.history = {};
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    const loginUserDetails = BaseService.loginUser;
    vm.minLengthMessage = CORE.MESSAGE_CONSTANT.MIN_LENGTH_MESSAGE;
    /*
    * Author :  Vaibhav Shah
    * Purpose : go to assy list
    */
    vm.goToAssyList = () => {
        BaseService.goToPartList();
      return false;
    };

    /*
    * Author :  Vaibhav Shah
    * Purpose : go to manage part number
    */
    vm.goToAssyMaster = () => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG.toLowerCase(), vm.history.partID, USER.PartMasterTabs.Detail.Name);
      return false;
    };

    /* redirect to work order list */
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };
    /* redirect to work order detail page */
    vm.goToWorkorderDetails = (woData) => {
      BaseService.goToWorkorderDetails(woData.woID);
      return false;
    };


    /*
    * Author :  Vaibhav Shah
    * Purpose : Init Auto complete while add narrative details
    */
    const initAutoCompleteWO = () => {
      vm.autoCompleteWO = {
        columnName: 'woNumber',
        controllerName: null,
        viewTemplateURL: null,
        keyColumnName: 'woID',
        keyColumnId: data.woID ? data.woID : null,
        inputName: 'WorkOrder',
        placeholderName: CORE.LabelConstant.Workorder.WO,
        isRequired: true,
        isAddnew: false,
        isDisabled: data.woID ? true : false,
        callbackFn: getWorkOrderListWithDetail,
        onSelectCallbackFn: function (selectedItem) {
          vm.headerdata = [];
          if (!selectedItem) {
            vm.selectedWO = null;
            vm.history.woID = null;
            vm.history.partID = null;
            vm.history.woOPID = null;
            vm.history.opID = null;
          }
          else {
            vm.selectedWO = selectedItem;
            vm.history.woID = selectedItem.woID;
            vm.history.partID = selectedItem.partID;
            vm.headerdata.push({
              label: vm.allLabelConstant.Assembly.PIDCode,
              value: vm.selectedWO.componentAssembly.PIDCode,
              displayOrder: 1,
              labelLinkFn: vm.goToAssyList,
              valueLinkFn: vm.goToAssyMaster,
              isCopy: true,
              isCopyAheadLabel: true,
              isAssy: true,
              imgParms: {
                imgPath: stringFormat('{0}{1}', vm.rohsImagePath, vm.selectedWO.rohs.rohsIcon),
                imgDetail: vm.selectedWO.rohs.name
              },
              isCopyAheadOtherThanValue: true,
              copyAheadLabel: vm.allLabelConstant.MFG.MFGPN,
              copyAheadValue: vm.selectedWO.componentAssembly.mfgPN
            });
            vm.headerdata.push({
              label: vm.allLabelConstant.Workorder.WO,
              value: vm.selectedWO.woNumber,
              displayOrder: 2,
              labelLinkFn: vm.goToWorkorderList,
              valueLinkFn: vm.goToWorkorderDetails,
              valueLinkFnParams: { woID: vm.selectedWO.woID }
            });
            getAllOperation();
          }
        }
      }
    };

    /*
    * Author :  Vaibhav Shah
    * Purpose : get work order list
    */
    let getWorkOrderListWithDetail = () => {
      vm.woList = [];
      return MasterFactory.getWorkorderWithAssyDetails().query({}).$promise.then((response) => {
        if (response && response.data) {
          vm.woList = response.data;
          return vm.woList;
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    }

    /*
    * Author :  Vaibhav Shah
    * Purpose : init autocomplete for work order wise operation
    */
    let initAutoCompleteWOOperation = () => {
      vm.autoCompleteWorkorderOperation = {
        columnName: 'opName',
        keyColumnName: 'woOPID',
        keyColumnId: data.woOPID ? data.woOPID : null,
        inputName: 'WorkorderOperation',
        placeholderName: 'Work Order Operation',
        isRequired: true,
        isAddnew: false,
        isDisabled: data.woOPID ? true : false,
        callbackFn: getAllOperation,
        onSelectCallbackFn: function (opItem) {
          if (!opItem) {
            vm.selectedWOOP = null;
            vm.history.woOPID = null;
            vm.history.opID = null;
          }
          else {
            vm.selectedWOOP = opItem;
            vm.history.woOPID = opItem.woOPID;
            vm.history.opID = opItem.opID;
          }
        }
      };
    };

    /*
    * Author :  Vaibhav Shah
    * Purpose : get operation list work order wise
    */
    let getAllOperation = () => {
      vm.WorkorderOperationList = [];
      return WorkorderOperationEmployeeFactory.retriveOperationListbyWoID().query({ woID: vm.selectedWO.woID }).$promise.then((operationlist) => {
        if (operationlist && operationlist.data) {
          operationlist.data = _.sortBy(operationlist.data, 'opNumber');
          _.each(operationlist.data, (item) => {
            item.opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, item.opName, item.opNumber);
            vm.WorkorderOperationList.push(item);
          });
          initAutoCompleteWOOperation();
        }
        return vm.WorkorderOperationList;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      })
    }


    var detailPromise = [getWorkOrderListWithDetail()];
    vm.cgBusyLoading = $q.all(detailPromise).then((responses) => {
      init();
      initAutoCompleteWO();
    });

    /*
    * Author :  Vaibhav Shah
    * Purpose : init
    */
    function init() {
      if (data) {
        if (data.id) {
          return TravelersFactory.NarrativeHistory().query({ id: data.id }).$promise.then((historydata) => {
            if (historydata && historydata.data) {
              vm.history = {
                id: data.id ? data.id : null,
                partID: historydata.data.partID,
                woID: historydata.data.woID,
                opID: historydata.data.opID,
                woOPID: historydata.data.woOPID,
                employeeID: historydata.data.employeeID,
                woTransID: historydata.data.woTransID,
                totalTimeConsume: historydata.data.totalTimeConsume,
                totalTimeConsumeDisplay: historydata.data.totalTimeConsume ? convertDisplayTime(historydata.data.totalTimeConsume) : null,
                narrativeDescription: historydata.data.narrativeDescription
              }
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        } else {
          vm.history = {
            id: data.id ? data.id : null,
            partID: data.partID,
            woID: data.woID,
            opID: data.opID,
            woOPID: data.woOPID,
            employeeID: data.employeeID,
            woTransID: data.woTransID,
            totalTimeConsume: data.totalTimeConsume,
            totalTimeConsumeDisplay: data.totalTimeConsume ? convertDisplayTime(data.totalTimeConsume) : null,
            narrativeDescription: data.narrativeDescription
          }
        }
      }
    }

    /*
    * Author :  Vaibhav Shah
    * Purpose : to open template for narrative
    */
    vm.OpenNarrativeTemplateList = (ev, form) => {
      var obj = {};
      obj.isNarrative = true;
      DialogFactory.dialogService(
        RFQTRANSACTION.ADDITIONAL_REQUIREMENT_SELECT_POPUP_CONTROLLER,
        RFQTRANSACTION.ADDITIONAL_REQUIREMENT_SELECT_POPUP_VIEW,
        ev,
        obj).then(() => {
        }, (template) => {
          if (template) {
            if (vm.history.narrativeDescription) {
              vm.history.narrativeDescription = vm.history.narrativeDescription + angular.copy(template);
            } else {
              vm.history.narrativeDescription = angular.copy(template);
            }
            form.$setDirty();
            // description field not being dirty after assign from template . so set it manually
            form.narrativeDescription.$setDirty();
          }
        },
          (err) => {
          });
    }

    /*
    * Author :  Vaibhav Shah
    * Purpose : Save Narrative template details
    */
    vm.save = () => {
      vm.saveDisable = true;
      vm.isSubmit = false;
      if (BaseService.focusRequiredField(vm.NarrativeHistoryForm)) {
        vm.isSubmit = true;
        vm.saveDisable = false;
        return;
      }

      //if (vm.NarrativeHistoryForm.$dirty || vm.isChange) {
      vm.history.totalTimeConsume = vm.history.totalTimeConsumeDisplay ? timeToSeconds(vm.history.totalTimeConsumeDisplay) : null;
      vm.history.employeeID = vm.history.employeeID ? vm.history.employeeID : (loginUserDetails.employee ? loginUserDetails.employee.id : null);
      if (vm.history.employeeID) {
        if (vm.history.id) {
          vm.cgBusyLoading = TravelersFactory.NarrativeHistory().update({
            id: vm.history.id,
          }, vm.history).$promise.then((res) => {
            vm.saveDisable = false;
            if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
              BaseService.currentPagePopupForm.pop();
              $mdDialog.hide();
            }
          }).catch((error) => {
            vm.saveDisable = false;
            return BaseService.getErrorLog(error);
          });
        } else {
          vm.cgBusyLoading = TravelersFactory.NarrativeHistory().save(vm.history).$promise.then((response) => {
            vm.saveDisable = false;
            if (response && response.data) {
              BaseService.currentPagePopupForm.pop();
              $mdDialog.hide(response.data);
            }
          }).catch((error) => {
            vm.saveDisable = false;
            BaseService.getErrorLog(error);
          });
        }
      }
    }


    /*
    * Author :  Vaibhav Shah
    * Purpose : Cancel Popup
    */
    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.NarrativeHistoryForm);
      if (isdirty) {
        let data = {
          form: vm.NarrativeHistoryForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    //Set as current form when page loaded
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.NarrativeHistoryForm);
    });
    /*
    * Author :  Vaibhav Shah
    * Purpose : Check form dirty or not
    */
    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      // console.log('check dirty: ' + checkDirty);
      return checkDirty;
    };

    /*
    * Author :  Vaibhav Shah
    * Purpose : called for max length validation
    */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }

    /*
    * Author :  Vaibhav Shah
    * Purpose : redirect to work order list
    */
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    }

    /*
    * Author :  Vaibhav Shah
    * Purpose : redirect to work order operation list
    */
    vm.goToOperationList = () => {
      BaseService.goToOperationList(vm.selectedWO.woID);
      return false;
    }

    /* called for max length validation */
    vm.getDescrLengthValidation = (maxLength, enterTextLength) => {
      vm.entertext = vm.htmlToPlaintext(enterTextLength)
      return BaseService.getDescrLengthValidation(maxLength, vm.entertext.length);
    }
    /* Used to convert html to plain text*/
    vm.htmlToPlaintext = (text) => {
      return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    }
  }
})();
