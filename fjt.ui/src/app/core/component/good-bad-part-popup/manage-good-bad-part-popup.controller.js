(function () {
    'use strict';
    angular
        .module('app.core')
        .controller('ManageGoodPartPopupController', ManageGoodPartPopupController);
    /** @ngInject */
    function ManageGoodPartPopupController($mdDialog, $q, ComponentFactory, data, CORE, BaseService, $timeout, DialogFactory, RFQTRANSACTION) {
        const vm = this;
        vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.NO_GOOD_PART;
        vm.isGoodPart = CORE.PartCorrectList.IncorrectPart;
        vm.goodPartsList = [];

        function getGoodBadPart() {
            let listObj = {
                id: data.componentID,
                isGoodPart: vm.isGoodPart
            }
            vm.cgBusyLoading = ComponentFactory.getComponentGoodBadPartGroup().query({ listObj: listObj }).$promise.then((response) => {
                if (response && response.data) {
                    _.each(response.data, function (item) {
                        if (item.ComponentGoodPartMapping) {
                            item.goodBadPart = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.ComponentGoodPartMapping.mfgCode, item.ComponentGoodPartMapping.mfgCodemst.mfgName);
                            item.isGoodPart = item.ComponentGoodPartMapping.isGoodPart;
                            item.isChecked = true;
                            vm.goodPartsList.push(item);
                        }
                    });
                    vm.goodPartsList = _.filter(vm.goodPartsList, function (data) { return data.id != data.componentID });
                }

                vm.isNoDataFound = vm.goodPartsList.length == 0;
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        vm.save = () => {
            var selectedList = _.filter(vm.goodPartsList, function (data) { return data.isChecked == true; }).map((item) => {
                return {
                    mfgCode: item.ComponentGoodPartMapping.mfgCodemst.mfgCode,
                    mfgCodeID: item.ComponentGoodPartMapping.mfgCodemst.id,
                    mfgPN: item.ComponentGoodPartMapping.mfgPN,
                    mfgPNID: item.ComponentGoodPartMapping.id
                };
            });
            DialogFactory.hideDialogPopup(selectedList);
        }

        function getComponentdetailByID() {
            vm.cgBusyLoading = ComponentFactory.getComponentByID().query({ id: data.componentID }).$promise.then((response) => {
                vm.badPart = response.data.mfgPN + " " + "(" + response.data.mfgCodemst.mfgCode + ")";
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        var promise = [];
        promise.push(getGoodBadPart(), getComponentdetailByID());

        init();

        function init() {
            vm.cgBusyLoading = $q.all(promise).then((responses) => {

            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        vm.isAnySelected = () => {
            var goodparts = !_.some(vm.goodPartsList, function (item) { return item.isChecked == true; });
            return goodparts;
        }
        vm.cancel = () => {
            let isdirty = vm.checkFormDirty(vm.GoodBadPartsForm);
            if (isdirty) {
                BaseService.showWithoutSavingAlertForPopUp();
            } else {
                $mdDialog.cancel();
            }
        };

        vm.checkFormDirty = (form, columnName) => {
            let checkDirty = BaseService.checkFormDirty(form, columnName);
            return checkDirty;
        };

    };
})();