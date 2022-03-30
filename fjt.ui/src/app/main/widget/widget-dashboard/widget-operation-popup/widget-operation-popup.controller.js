(function () {
  'use strict';

  angular
    .module('app.widget')
    .controller('WidgetOperationPopupController', WidgetOperationPopupController);

  /** @ngInject */
  function WidgetOperationPopupController($filter, WidgetOperationPopupFactory, $mdDialog, data, BaseService, WORKORDER, OperationFactory, CORE) {
    const vm = this;
    vm.chartTemplateID = data.chartTemplateID;
    vm.isAll = false;
    vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.OPERATION;
    let _OperationList = [];
    vm.OperationList = [];
    vm.SearchOperationText = null;
    vm.selectedOperationList = [];
    vm.selectedOperation = () => {
      if (vm.isAll) {
        vm.selectedOperationList = [];
        _.each(vm.OperationList, (opItem) => {
          opItem.selected = false;
        });
      }
    };

    vm.chartOperationModel = {
      opID: [],
      chartTemplateID: data.chartTemplateID,
      chaartTempOPID: null
    };

    const getOperationList = () => {
      vm.cgBusyLoading = OperationFactory.getOperationList().query({}).$promise.then((operation) => {
        _OperationList = vm.OperationList = [];
        _.mapValues(operation.data, (val) => {
          val.selected = false;
        });

        _.each(operation.data, (opItem) => {
          opItem.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, opItem.opName, opItem.opNumber);
        });

        _OperationList = vm.OperationList = operation.data;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getSelectedOperationList = () => {
      vm.cgBusyLoading = WidgetOperationPopupFactory.getChartTempOperation().query({ chartTemplateID: vm.chartOperationModel.chartTemplateID }).$promise.then((response) => {
        if (response && response.data) {
          if (data.isPinToTraveler && response.data.length === 0) {
            vm.isAll = true;
          }
          else {
            _.each(response.data, (item) => {
              _.each(vm.OperationList, (x) => {
                if (x.opID === item.opID) {
                  x.selected = true;
                }
              });
            });
            vm.selectedOperationList = $filter('filter')(_OperationList, { selected: true });
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    getOperationList();
    getSelectedOperationList();

    vm.SearchOperation = (list, searchText) => {
      if (!searchText) {
        vm.SearchOperationText = null;
        vm.OperationList = _OperationList;
        vm.FilterOperation = true;
        return;
      }
      vm.OperationList = $filter('filter')(_OperationList, { opFullName: searchText });
      vm.FilterOperationList = vm.OperationList.length > 0;
    };

    vm.AddToSelectedOperation = () => {
      vm.selectedOperationList = $filter('filter')(_OperationList, { selected: true });
      if (vm.OperationList.length === vm.selectedOperationList.length) {
        vm.isAll = true;
        vm.selectedOperation();
      }
    };

    vm.save = () => {
      if (vm.selectedOperationList.length > 0) {
        const opID = [];
        _.each(vm.selectedOperationList, (item) => { opID.push(item.opID); });
        vm.chartOperationModel.opID = opID;
        vm.cgBusyLoading = WidgetOperationPopupFactory.saveChartTempOperation().save(vm.chartOperationModel).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            $mdDialog.hide(true);
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      }
      else if (vm.isAll) {
        vm.cgBusyLoading = WidgetOperationPopupFactory.saveChartTempOperation().save(vm.chartOperationModel).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            $mdDialog.cancel(true);
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      }
    };

    vm.setFocus = (text) => {
      const someElement = angular.element(document.querySelector('#' + text));
      if (someElement && someElement.length > 0) {
        someElement[0].focus();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.SelectChartOperations);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };

    /* to move at operation update page */
    vm.goToManageOperation = (operationID) => {
      BaseService.goToManageOperation(operationID);
    };
  }
})();
