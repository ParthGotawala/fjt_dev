(function () {
    'use strict';

    angular.module('app.core').controller('GenericConfirmationPopupController', GenericConfirmationPopupController);

    function GenericConfirmationPopupController(data, DialogFactory, CORE, BaseService, MasterFactory, ManufacturerFactory, $mdDialog, $timeout, RFQTRANSACTION) { // eslint-disable-line func-names
        const vm = this;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.accessLevelDetail = { username: null, password: null };
        vm.genericDetailModel = _.clone(data);
        vm.isOnlyPassword = vm.genericDetailModel.isOnlyPassword ? vm.genericDetailModel.isOnlyPassword : false;
        const loginuser = BaseService.loginUser;
        vm.TextAreaRows = CORE.TEXT_AREA_ROWS;
        vm.headerdata = [];
        vm.popupFlex = 35;
        vm.invoiceApprovalreasonType = CORE.Reason_Type.INVOICE_APPROVE;
        if (vm.genericDetailModel.informationMsg) {
            vm.popupFlex = 50;
        } else if (vm.genericDetailModel.isShowHeaderData) {
            vm.popupFlex = 'none';
        }
        if (vm.genericDetailModel.isInvoiceApprovedMsgBtn) {
            vm.popupFlex = 60;
            vm.isShowApprovedReasons = false;
        }

        if (vm.genericDetailModel && vm.genericDetailModel.headerDisplayData) {
            vm.headerdata = vm.genericDetailModel.headerDisplayData;
        }

        // get Access level for Role which is set in data key
        function getAccessLevel() {
            vm.cgBusyLoading = ManufacturerFactory.getAcessLeval().query({ access: vm.genericDetailModel.AccessRole }).$promise.then((response) => {
                if (response && response.data) {
                    vm.accessLevelDetail.accessRole = response.data.name;
                    vm.accessLevelDetail.accessLevel = response.data.accessLevel;
                }
            }).catch((error) => BaseService.getErrorLog(error));
        }

        getAccessLevel();

        //check and verify user and its access level in database.
        vm.checkAndverifyUser = () => {
            if (vm.VerificationForm.$invalid) {
                BaseService.focusRequiredField(vm.VerificationForm);
                return;
            }
            vm.isDisableSubmit = true;

            const encryptedusername = vm.isOnlyPassword ? encryptAES(loginuser.username) : encryptAES(vm.accessLevelDetail.username);
            const encryptedPassword = encryptAES(vm.accessLevelDetail.password);
            const model = {
                username: encryptedusername.toString(),
                password: encryptedPassword.toString(),
                accessLevel: vm.accessLevelDetail.accessLevel,
                isOnlyPasswordCheck: vm.isOnlyPassword || false,
                isSwitchRoleApproval: vm.genericDetailModel.isSwitchRoleApproval || false
            };
            vm.cgBusyLoading = MasterFactory.verifyUser().save(model).$promise.then((response) => {
                vm.isDisableSubmit = false;
                if (response && response.data) {
                    vm.genericDetailModel.approvedBy = response.data.userID;
                    if (!vm.genericDetailModel.isAllowSaveDirect) {
                        BaseService.currentPagePopupForm.pop();
                        vm.genericDetailModel.username = vm.accessLevelDetail.username;
                        $mdDialog.hide(vm.genericDetailModel);
                    }
                    else {
                        //save direct in database for reason
                        saveApprovalReason();
                    }
                }
                else if (response && response.errors && response.errors) {
                    if (checkResponseHasCallBackFunctionPromise(response)) {
                        response.alretCallbackFn.then(() => {
                            BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.VerificationForm);
                        });
                    }
                }
            }).catch((error) => {
                vm.isDisableSubmit = false;
                BaseService.getErrorLog(error);
            });
        };
        //save approval reason
        function saveApprovalReason() {
            vm.cgBusyLoading = MasterFactory.createAuthenticatedApprovalReason().query({ objReason: vm.genericDetailModel }).$promise.then((response) => {
                BaseService.currentPagePopupForm.pop();
                $mdDialog.hide(response);
            }).catch((error) => BaseService.getErrorLog(error));
        }

        vm.cancel = () => {
            vm.isDisablecancel = true;
            // Prevent multiple clicks on cancel button.
            $timeout(() => {
                vm.isDisablecancel = false;
            }, 100);
            if (vm.checkFormDirty(vm.VerificationForm)) {
                const data = {
                    form: vm.VerificationForm
                };
                BaseService.showWithoutSavingAlertForPopUp(data);
            } else {
                BaseService.currentPagePopupForm.pop();
                $mdDialog.cancel();
            }
        };

        vm.selectApprovalReasons = (event, comment) => {
            setFocus('approvalReason');
            vm.genericDetailModel.approvalReason = (vm.genericDetailModel.approvalReason ? (vm.genericDetailModel.approvalReason + '\n') : '') + comment;
        };

        vm.gotoPredefinedComment = () => BaseService.goToInvoiceApprovedMessageTab();

        vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);
        //on load submit form
        angular.element(() => BaseService.currentPagePopupForm.push(vm.VerificationForm));
        vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }
})();
