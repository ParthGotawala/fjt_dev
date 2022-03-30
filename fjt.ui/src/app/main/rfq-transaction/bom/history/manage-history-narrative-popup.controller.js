(function () {
    'use strict';
    angular
        .module('app.rfqtransaction')
        .controller('ManageHistoryNarrativePopupController', ManageHistoryNarrativePopupController);
    /** @ngInject */
    function ManageHistoryNarrativePopupController( $mdDialog, data, CORE, RFQTRANSACTION, DialogFactory, BOMFactory, BaseService) {
        const vm = this;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.TimePattern = CORE.OperationTimePattern;
        vm.TimeMask = CORE.OperationTimeMask;
        vm.taToolbar = CORE.Toolbar;
        vm.history = {};
        init();
        function init() {
            if (data) {
                vm.history = {
                    id: data.id,
                    time: data.time,
                    narrative: data.narrative,
                }
                vm.history.time = vm.history.time ? convertDisplayTime(vm.history.time * 60) : null;
            }
        }


        vm.saveErrorCode = () => {
            if (vm.NarrativeHistoryForm.$invalid || !vm.checkFormDirty(vm.NarrativeHistoryForm) && !vm.isChange) {
                BaseService.focusRequiredField(vm.NarrativeHistoryForm);
                return;
            }
            vm.isSubmit = false;
            if (!vm.NarrativeHistoryForm.$valid) {
                vm.isSubmit = true;
                return;

            }
            var historyTime = vm.history.time ? timeToSeconds(vm.history.time) : null;
            if (vm.history && !historyTime) {
                let obj = {
                    title: CORE.MESSAGE_CONSTANT.CONFIRMATION,
                    textContent: RFQTRANSACTION.BOM.NARRATIVE_TIME_NOT_ADDED_CONFIRAMTION,
                    btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                    canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };

                DialogFactory.confirmDiolog(obj).then((yes) => {
                    if (yes) {
                        vm.saveData();
                    }
                }, (cancel) => {
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
            else {
                vm.saveData();
            }
        }

        vm.saveData = () => {
            vm.history.time = vm.history.time ? timeToMinite(vm.history.time) : null,
            vm.cgBusyLoading = BOMFactory.saveNarrativeHistory().save(vm.history).$promise.then((response) => {
                if (response && response.data) {
                    $mdDialog.hide(response.data);
                }
            }).catch((error) => {
                BaseService.getErrorLog(error);
            });
        }

        vm.cancel = () => {
            // Check vm.isChange flag for color picker dirty object 
            let isdirty = vm.checkFormDirty(vm.NarrativeHistoryForm) || vm.isChange;
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

        /* called for max length validation */
        vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
            return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
        }
    }
})();
