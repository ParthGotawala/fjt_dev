(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('TransferStockPopupController', TransferStockPopupController);

  /** @ngInject */
  function TransferStockPopupController($scope, $q, $timeout, $stateParams, $mdDialog, data, CORE, USER, TRANSACTION, RFQTRANSACTION, DialogFactory, BaseService, ReceivingMaterialFactory, MasterFactory) {
    const vm = this;
    vm.TRANSACTION = TRANSACTION;
    vm.CORE = CORE;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    var loginUser = BaseService.loginUser;
    vm.headerdata = [];

    vm.goToAssemblyList = (data) => {
      BaseService.goToPartList();
      return false;
    }
    vm.goToAssemblyDetails = (data) => {
      BaseService.goToComponentDetailTab(null, data.partID);
      return false;
    }

    //get workorder list
    //let getWorkorderlist = () => {
    //	return MasterFactory.getWorkorderWithAssyDetails().query({}).$promise.then((workorder) => {
    //		if (workorder && workorder.data) {
    //			_.each(workorder.data, (item) => {
    //				item.woNumber = stringFormat("{0}-{1}", item.woNumber, item.woVersion);
    //			});
    //			vm.workorderList = workorder.data;
    //			return vm.workorderList;
    //		}
    //	}).catch((error) => {
    //		return BaseService.getErrorLog(error);
    //	});
    //}

    let getAllBin = () => {
      return ReceivingMaterialFactory.getAllBin().query().$promise.then((bin) => {
        if (bin && bin.data) {
          vm.binList = bin.data;
          _.map(vm.binList, (item) => {
            if (item.warehousemst) {
              item.binName = stringFormat("{0} ({1})", item.Name, item.warehousemst.Name);
            }
          });
          return vm.binList;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.goToUMIDList = (data) => {
      BaseService.goToUMIDList();
      return false;
    }

    vm.goToUMIDDetail = (data) => BaseService.goToUMIDDetail(data.id);

    vm.goToManufacturerList = () => {
      BaseService.goToManufacturerList();
      return false;
    }

    vm.goToCustomer = (data) => {
      BaseService.goToCustomer(data.id);
      return false;
    }

    //get detail of component stock.
    let ReceivingMaterialDetails = () => {
      vm.component = angular.copy(data);
      vm.component.availableQty = vm.component.pkgQty;
      vm.component.location_bin = stringFormat('{0} ({1}) ', vm.component.location, vm.component.warehouse);
      vm.rohsIcon = vm.component.rohsIcon;
      vm.componentCopy = angular.copy(vm.component);
      vm.checkDirtyObject = {
        oldModelName: vm.componentCopy,
        newModelName: vm.component
      }
      vm.headerdata.push({
        label: 'UMID',
        value: vm.component.uid,
        displayOrder: 1,
        labelLinkFn: vm.goToUMIDList,
        valueLinkFn: vm.goToUMIDDetail,
        valueLinkFnParams: { id: vm.component.id }
      },
        {
          label: vm.CORE.LabelConstant.MFG.MFG,
          value: vm.component.mfg,
          displayOrder: 2,
          labelLinkFn: vm.goToManufacturerList,
          valueLinkFn: vm.goToCustomer,
          valueLinkFnParams: { id: vm.component.mfgcodeID }
        },
        {
          label: vm.CORE.LabelConstant.MFG.MFGPN,
          value: vm.component.mfgPN,
          displayOrder: 3,
          labelLinkFn: vm.goToAssemblyList,
          valueLinkFn: vm.goToAssemblyDetails,
          valueLinkFnParams: { partID: vm.component.refcompid },
          isCopy: true,
          isCopyAheadLabel: false,
          imgParms: {
            imgPath: vm.rohsIcon,
            imgDetail: vm.component.rohsName
          }
        });
      return vm.component;
    };

    //ReceivingMaterialDetails(data.id)
    //getWorkorderlist(), 
    var autocompletePromise = [getAllBin(), ReceivingMaterialDetails()];
    vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
      InitAutocomplete();
    }).catch((error) => {
      return BaseService.getErrorLog(error);
    });

    function InitAutocomplete() {
      vm.autoCompleteWorkOrder = {
        columnName: 'woNumber',
        keyColumnName: 'woID',
        keyColumnId: vm.component ? vm.component.woID : null,
        inputName: 'WO#',
        placeholderName: 'WO#',
        isRequired: false,
        isAddnew: false
      }

      vm.autoTransferBin = {
        columnName: 'binName',
        keyColumnName: 'id',
        controllerName: TRANSACTION.TRANSACTION_BIN_ADD_UPDATE_MODAL_CONTROLLER,
        viewTemplateURL: TRANSACTION.TRANSACTION_BIN_ADD_UPDATE_MODAL_VIEW,
        keyColumnId: vm.component && vm.component.toBin ? vm.component.toBin : null,
        inputName: 'Transfer To Location/Bin',
        placeholderName: 'Transfer To Location/Bin',
        isRequired: true,
        isAddnew: true,
        callbackFn: getAllBin,
        onSelectCallback: getAllBin,
      };
    }

    vm.transferStock = (e) => {
      if (vm.transferstockForm.$invalid) {
        BaseService.focusRequiredField(vm.transferstockForm);
        return;
      }
      if (vm.component.pkgQty < vm.component.availableQty) {
        var model = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: TRANSACTION.AVAILABLE_QTY_GREATER,
          multiple: true
        };
        return DialogFactory.alertDialog(model).then((yes) => {
          if (yes) {
            vm.component.availableQty = null;
            let myEl = angular.element(document.querySelector('#availableQty'));
            myEl.focus();
          }
        }, (cancel) => {

        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
        return;
      }

      let transferData = {
        id: vm.component.id,
        binID: vm.autoTransferBin && vm.autoTransferBin.keyColumnId ? vm.autoTransferBin.keyColumnId : null,
        pkgQty: vm.component.availableQty
      }
      vm.cgBusyLoading = ReceivingMaterialFactory.updateTransferDetail().query(transferData).$promise.then((response) => {
        if (response && response.data) {
          $mdDialog.cancel(true);
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.transferstockForm);
      if (isdirty || vm.checkDirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }

    vm.goToLocationList = () => {
      BaseService.openInNew(TRANSACTION.TRANSACTION_BIN_STATE, {});
    }

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    };

    vm.searchToDigikey = () => {
      BaseService.openURLInNew(RFQTRANSACTION.API_LINKS.DIGIKEY + vm.component.mfgPN);
    }

    vm.goToUomList = () => {
      BaseService.openInNew(USER.ADMIN_UNIT_STATE, {})
    };
  }
})();
