(function () {
    'use strict';

    angular
        .module('app.transaction.requestforship')
        .controller('AddRequestForShipController', AddRequestForShipController);

    /** @ngInject */
    function AddRequestForShipController($mdDialog, data, CORE, RequestForShipFactory, BaseService, DialogFactory) {
        const vm = this;

        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.statusFlag = false;
        vm.requestForShipModel = {
            id: null,
            note: null,
            status: null
        };

        if (data && data.id) {
            init();
        }

        function init() {
            vm.cgBusyLoading = RequestForShipFactory.getShippingRequest().query({ id: data.id }).$promise.then((response) => {
                if (response && response.data) {
                    vm.requestForShipModel.id = data.id;
                    vm.requestForShipModel.note = response.data.note;
                    vm.requestForShipModel.status = response.data.status;

                    vm.statusFlag = vm.requestForShipModel.status == CORE.SHIPPING_REQUEST_STATUS.PUBLISHED;
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        vm.cancel = () => {
            let isdirty = vm.checkFormDirty(vm.frmRequestForShip);
            if (isdirty) {
                let data = {
                    form: vm.frmRequestForShip
                }
                BaseService.showWithoutSavingAlertForPopUp(data);
            } else {
                BaseService.currentPagePopupForm.pop();
                $mdDialog.cancel();
            }
        };

        vm.checkFormDirty = (form, columnName) => {
            let checkDirty = BaseService.checkFormDirty(form, columnName);
            return checkDirty;
        }

        vm.save = function () {
            //Used to focus on first error filed of form
            if (vm.frmRequestForShip.$invalid) {
                BaseService.focusRequiredField(vm.frmRequestForShip);
                return;
            }
            if (vm.frmRequestForShip.$dirty) {
                if (vm.statusFlag)
                    vm.requestForShipModel.status = CORE.SHIPPING_REQUEST_STATUS.PUBLISHED;
                else
                    vm.requestForShipModel.status = CORE.SHIPPING_REQUEST_STATUS.DRAFT;

                vm.cgBusyLoading = RequestForShipFactory.saveRequestForShip().save(vm.requestForShipModel).$promise.then((response) => {
                    if (response && response.data) {
                        BaseService.currentPagePopupForm.pop();
                        $mdDialog.hide(response.data);
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
            else {
                BaseService.currentPagePopupForm.pop();
                DialogFactory.closeDialogPopup();
            }
        }

        //Set as current form when page loaded 
      angular.element(() => {
        BaseService.currentPagePopupForm.push(vm.frmRequestForShip);
      });
        /** Validate max size */
        vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
            return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
        };
    }
})();
