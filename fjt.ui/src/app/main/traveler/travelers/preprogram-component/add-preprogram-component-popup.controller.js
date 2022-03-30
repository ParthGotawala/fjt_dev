(function () {
  'use strict';

  angular
    .module('app.admin.defectCategory')
    .controller('AddPreprogramComponentPopupController', AddPreprogramComponentPopupController);

  /** @ngInject */
  function AddPreprogramComponentPopupController($mdDialog, data, CORE, USER,
    WorkorderOperationFactory, PreProgramComponentFactory, BaseService, $q) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    //vm.isSubmit = false;
    vm.preProgComData = data ? angular.copy(data) : {};

    vm.preProgramComponent = {
      woID: data.woID,
      woPreProgCompID: data.woPreProgCompID
    };

    const getWorkOrderOperation = () => {
      vm.workOperationList = [];
      if (vm.preProgramComponent.woID) {
        return WorkorderOperationFactory.retriveOPListWithTransbyWoID().query({ woID: vm.preProgramComponent.woID }).$promise.then((operationlist) => {
          // Get opNumber of current operation
          const opDataNumber = _.find(operationlist.data, (opItem) => opItem.woOPID === data.woOPID);
          // set display name filter for workorder operation
          // Remove operation which has qtyControl false and self operation and previous operation
          const isAnyEnablePreProgrammingPartOP = _.some(operationlist.data, (opItem) => opItem.isEnablePreProgrammingPart);
          if (isAnyEnablePreProgrammingPartOP) {
            operationlist.data = _.filter(operationlist.data, (opItem) => {
              opItem.opNameDisplay = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, opItem.opName, opItem.opNumber);
              return opItem.woOPID !== data.woOPID && opItem.qtyControl && opItem.opNumber > opDataNumber.opNumber
                && opItem.isEnablePreProgrammingPart;
            });
          }
          else {
            operationlist.data = _.filter(operationlist.data, (opItem) => {
              opItem.opNameDisplay = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, opItem.opName, opItem.opNumber);
              return opItem.woOPID !== data.woOPID && opItem.qtyControl && opItem.opNumber > opDataNumber.opNumber;
            });
          }
          vm.workOperationList = operationlist.data;

          vm.autoCompleteWorkorderOperation = {
            columnName: 'opNameDisplay',
            keyColumnName: 'woOPID',
            keyColumnId: vm.preProgramComponent ? (vm.preProgramComponent.refStkWOOPID ? vm.preProgramComponent.refStkWOOPID : null) : null,
            inputName: 'Work Order Operation',
            placeholderName: 'Operation',
            isRequired: false,
            isAddnew: false,
            isDisabled: false,
            callbackFn: getWorkOrderOperation,
            onSelectCallbackFn: getSelectedOperation
          };
          return $q.resolve(operationlist);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // get selected operation
    const getSelectedOperation = (item) => {
      if (item) {
        vm.autoCompleteWorkorderOperation.isDisabled = item.OPProdQty > 0 ? true : false;
        vm.autoCompleteWorkorderOperation.keyColumnId = item.woOPID;
      } else {
        vm.autoCompleteWorkorderOperation.keyColumnId = null;
      }
      vm.preProgramComponent.refStkWOOPID = vm.autoCompleteWorkorderOperation.keyColumnId;
    };

    if (vm.preProgramComponent.woPreProgCompID) {
      PreProgramComponentFactory.getPreProgComponent().query({ woPreProgCompID: vm.preProgramComponent.woPreProgCompID }).$promise.then((res) => {
        if (res && res.data) {
          vm.preProgramComponent = res.data;
          getWorkOrderOperation();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    /* create Preprogram Comopnent */
    vm.savePreprogramComponent = () => {
      vm.isSaveButtonDisable = true;
      if (BaseService.focusRequiredField(vm.preProgramComponentForm)) {
        vm.isSaveButtonDisable = false;
        return;
      }

      vm.preProgramComponent.objTimelinelog = {
        woNumber: data.woNumber,
        opName: data.opName,
        woOPID: data.woOPID,
        employeeID: data.employeeID
      };

      PreProgramComponentFactory.updateWOPreProgramComponent().save(vm.preProgramComponent).$promise.then((res) => {
        if (res && res.data && res.data.woPreProgCompID) {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.cancel(res.data);
        }
        vm.isSaveButtonDisable = false;
      }).catch((error) => {
        vm.isSaveButtonDisable = false;
        return BaseService.getErrorLog(error);
      });
    };

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    /*check dirty form object while close*/
    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
    /*Used to close the popup*/
    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.preProgramComponentForm);
      if (isdirty) {
        const data = {
          form: vm.preProgramComponentForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    /*Add form on load*/
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.preProgramComponentForm);
    });
  }
})();
