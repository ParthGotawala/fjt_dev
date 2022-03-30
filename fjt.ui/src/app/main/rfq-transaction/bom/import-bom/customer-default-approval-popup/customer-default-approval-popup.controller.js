(function () {
    'use strict';

    angular
        .module('app.rfqtransaction')
        .controller('CustomerDefaultApprovalPopupController', CustomerDefaultApprovalPopupController);

    /** @ngInject */
    function CustomerDefaultApprovalPopupController($mdDialog, data, CORE, CHAT, USER, BaseService, DialogFactory, RFQSettingFactory) {
        const vm = this;
        vm.reasonType = data;
        vm.reasonId = vm.reasonType.id;
        if (vm.reasonId === CORE.Reason_Type.BOM.id) {
            vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.BOM_REASON;
            vm.title = 'Predefined Comment';
        } else {
            vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.INVOICE_APPROVE;
            vm.title = 'Invoice Approval Reasons';
        }
        vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;
        vm.comment = null;
        active();

        function active() {
            RFQSettingFactory.getActiveReasonListByReasonType().query({ reason_type: vm.reasonId }).$promise.then((response) => {
                if (response && response.data) {
                    vm.standardReasonList = vm.reasonlist = angular.copy(response.data);
                    vm.isNoDataFound = vm.standardReasonList.length === 0;
                }
            }).catch((error) => BaseService.getErrorLog(error));
        }

        vm.save = () => {
            var selectedReasons = _.filter(vm.standardReasonList, (x) => x.isChecked == true).map((x) => x.reason);

            if (selectedReasons.length) {
                vm.comment = (vm.comment ? (vm.comment + '\n') : '') + selectedReasons.join('\n');
            }
            $mdDialog.hide(vm.comment);
        };

        vm.cancel = () => {
            const isdirty = vm.checkFormDirty(vm.customerDefaultApprovalForm);
            if (isdirty) {
                BaseService.showWithoutSavingAlertForPopUp();
            } else {
                $mdDialog.cancel();
            }
        };

        vm.checkFormDirty = (form, columnName) => form.$dirty;

        vm.refereshComment = () => {
            active();
            vm.searchText = null;
        };
        vm.addComment = () => {
            const popUpData = { popupAccessRoutingState: [vm.reasonId === CORE.Reason_Type.BOM.id ? USER.ADMIN_BOM_REASON_STATE : USER.ADMIN_INVOICE_APPROVED_REASON_STATE], pageNameAccessLabel: vm.reasonType.popupTitle };
            const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
            if (isAccessPopUp) {
                const obj = {
                    reasonId: vm.reasonId
                };
                DialogFactory.dialogService(
                    USER.ADMIN_REASON_ADD_UPDATE_MODAL_CONTROLLER,
                    USER.ADMIN_REASON_ADD_UPDATE_MODAL_VIEW,
                    null,
                    obj).then(() => {
                    }, (data) => {
                        if (data) {
                            active();
                        }
                    }, () => {
                    });
            }
        };
        vm.gotoPredefinedComment = () => {
            if (vm.reasonId === CORE.Reason_Type.BOM.id) {
                BaseService.goToBOMDefaultCommentTab();
            } else {
                BaseService.goToInvoiceApprovedMessageTab();
            }
        }
        vm.searchCommonData = (isReset) => {
            if (isReset) {
                vm.searchText = null;
                vm.standardReasonList = vm.reasonlist;
            }
            else {
                vm.standardReasonList = _.filter(vm.reasonlist, (x) => x.reason.toLowerCase().indexOf(vm.searchText.toLowerCase()) !== -1);
            }
        };
    }
})();
