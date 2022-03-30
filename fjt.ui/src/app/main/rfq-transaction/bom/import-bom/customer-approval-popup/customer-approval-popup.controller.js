(function () {
    'use strict';

    angular
        .module('app.rfqtransaction')
        .controller('CustomerApprovalPopupController', CustomerApprovalPopupController);

    /** @ngInject */
    function CustomerApprovalPopupController($mdDialog, CORE, RFQTRANSACTION, USER, data, BaseService, DialogFactory, ComponentFactory) {
        const vm = this;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.comment = { comment: null, requiredToShowOnQuoteSummary: false, isCustomerApproved: false };
        vm.isApproved = data.isApproved ? data.isApproved : false;
        vm.LabelConstant = CORE.LabelConstant;
        vm.title = data.title ? data.title : 'Part Approval Engineering Comment';
        vm.isShowMFGPN = data.isShowMFGPN ? data.isShowMFGPN : false;
        if (vm.isShowMFGPN) {
            getComponentdetailByID();
        }
        function getComponentdetailByID() {
            vm.cgBusyLoading = ComponentFactory.getComponentByID().query({ id: data.mfgPNID }).$promise.then((response) => {
                vm.selectedComponent = {
                    id: response.data.id,
                    MFGPN: response.data.mfgPN,
                    MFG: response.data.mfgCodemst.mfgCode,
                    CustomerID: response.data.mfgCodemst.id,
                    Customer: stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, response.data.mfgCodemst.mfgCode, response.data.mfgCodemst.mfgName),
                    Component: stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, response.data.mfgCodemst.mfgCode, response.data.mfgPN),
                    RoHSStatusIcon: response.data.rfq_rohsmst !== null ? stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, response.data.rfq_rohsmst.rohsIcon) : null,
                    RoHSName: response.data.rfq_rohsmst !== null ? response.data.rfq_rohsmst.name : null,
                    PIDCode: response.data.PIDCode
                };
                bindHeaderData();
            }).catch((error) => BaseService.getErrorLog(error));
        }

        vm.save = () => {
            if (vm.customerApprovalForm.$invalid) {
                BaseService.focusRequiredField(vm.customerApprovalForm);
                return;
            }
            $mdDialog.hide(vm.comment);
        };

        vm.cancel = () => {
            const isdirty = vm.checkFormDirty(vm.customerApprovalForm);
            if (isdirty) {
                BaseService.showWithoutSavingAlertForPopUp();
            } else {
                $mdDialog.cancel();
            }
        };

        vm.OpenTemplateList = ($event) => {
            DialogFactory.dialogService(
                RFQTRANSACTION.CUSTOMER_DEFAULT_APPROVAL_POPUP_CONTROLLER,
                RFQTRANSACTION.CUSTOMER_DEFAULT_APPROVAL_POPUP_VIEW,
                $event,
                CORE.Reason_Type.BOM).then((result) => {
                    if (result) {
                        vm.comment.comment = (vm.comment.comment ? (vm.comment.comment + '\n') : '') + result;
                    }
                }, () => {
                    // Empty
                }, (err) => {
                    BaseService.getErrorLog(err);
                });
        };

        vm.checkFormDirty = (form, columnName) => {
            const checkDirty = BaseService.checkFormDirty(form, columnName);
            return checkDirty;
        };
        /* called for max length validation */
        vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

        //go to manage part number
        vm.goToAssyMaster = () => {
            BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG.toLowerCase(), vm.selectedComponent.id, USER.PartMasterTabs.Detail.Name);
            return false;
        };
        //go to assy list
        vm.goToAssyList = () => {
            BaseService.goToPartList();
            return false;
        };
        // go to customer
        vm.goToCustomer = () => {
            BaseService.goToCustomer(vm.selectedComponent.CustomerID);
            return false;
        };
        //redirect to customer list
        vm.goToCustomerList = () => {
            BaseService.goToCustomerList();
            return false;
        };

        function bindHeaderData() {
            vm.headerdata = [];
            vm.headerdata.push({
                label: vm.LabelConstant.MFG.PID,
                value: vm.selectedComponent.PIDCode,
                displayOrder: 1,
                labelLinkFn: vm.goToAssyList,
                valueLinkFn: vm.goToAssyMaster,
                isCopy: true,
                isCopyAheadLabel: true,
                isAssy: true,
                imgParms: {
                    imgPath: vm.selectedComponent.RoHSStatusIcon,
                    imgDetail: vm.selectedComponent.RoHSName
                },
                isCopyAheadOtherThanValue: true,
                copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
                copyAheadValue: vm.selectedComponent.MFGPN
            });
        }
    }
})();
