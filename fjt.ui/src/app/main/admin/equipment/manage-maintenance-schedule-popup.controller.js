(function () {
    'use strict';

    angular
        .module('app.admin.equipment')
        .controller('ManageMaintenanceSchedulePopupController', ManageMaintenanceSchedulePopupController);

    /** @ngInject */
    function ManageMaintenanceSchedulePopupController($mdDialog, data, CORE, EquipmentTaskSchedule, BaseService) {
        const vm = this;
        vm.isSubmit = false;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.Maintenance_Schedule_RepeatType = CORE.Maintenance_Schedule_RepeatTypeKey;
        vm.isSubmit = false;
        vm.Iseditable = data.Iseditable;
        vm.taToolbar = CORE.Toolbar;
        vm.Day = CORE.Day;
        vm.Month = CORE.Month;
        vm.DefaultDateFormat = _dateDisplayFormat;
        vm.placeHolderFormat = angular.copy(vm.DefaultDateFormat).toUpperCase();
        /* for down arrow key open datepicker */
        vm.DATE_PICKER = CORE.DATE_PICKER;
        vm.IsPickerOpen = {};
        vm.IsPickerOpen[vm.DATE_PICKER.endOnDate] = false;
        vm.minLengthMessage = CORE.MESSAGE_CONSTANT.MIN_LENGTH_MESSAGE;
        vm.openPicker = (type, ev) => {
            if (ev.keyCode == 40) {
                vm.IsPickerOpen[type] = true;
            }
        };
        vm.todayDate = new Date();
        vm.startTimeOptions = {
            checkoutTimeOpenFlag: false,
            appendToBody: true
        };

        /* for down arrow key open date-picker */


        vm.getNumber = (monthType) => {
            if (monthType == 4 || monthType == 6
                || monthType == 9 || monthType == 11) {
                return new Array(30);
            }
            else if (monthType == 2) {
                return new Array(29);
            }
            else {
                return new Array(31);
            }
        }

        vm.manageTaskSchedule = {};
        vm.manageTaskSchedule = angular.copy(data.TaskSchedule);
        vm.endOnDateOptions = {
            minDate: (vm.manageTaskSchedule.isActive && vm.manageTaskSchedule.eqpTaskScheduleID) ? '' : vm.todayDate,
            appendToBody: true
        };
        // in case of edit allow to select past dates
        vm.getMinDate = () => {
            let mindt = new Date();
            // if schedule is active than check for end date else set min date is today date
            if (vm.manageTaskSchedule.isActive && vm.manageTaskSchedule.endOnDate) {
                if (new Date() < new Date(vm.manageTaskSchedule.endOnDate)) {
                    mindt = new Date();
                } else {
                    mindt = new Date(vm.manageTaskSchedule.endOnDate);
                }
            }
            return mindt;
        }
        vm.mindate = vm.getMinDate();

        vm.manageTaskSchedule.repeatsType = data.repeatsType;
        vm.manageTaskSchedule.repeatEnd = vm.manageTaskSchedule.repeatEnd ? vm.manageTaskSchedule.repeatEnd : "N";  /* default selected - N --> Never*/
        vm.checkFormDirty = (form, columnName) => {
            let checkDirty = BaseService.checkFormDirty(form, columnName);
            return checkDirty;
        }
        vm.cancel = () => {
            // Check vm.isChange flag for color picker dirty object 
            let isdirty = vm.checkFormDirty(vm.equipment_manageMaintenanceScheduleForm);
            if (isdirty) {
                let data = {
                    form: vm.equipment_manageMaintenanceScheduleForm
                }
                BaseService.showWithoutSavingAlertForPopUp(data);
            } else {
                BaseService.currentPagePopupForm.pop();
                $mdDialog.cancel();
            }
        };


        vm.saveMaintenanceTaskSchedule = () => {
            if (vm.equipment_manageMaintenanceScheduleForm.$invalid) {
                BaseService.focusRequiredField(vm.equipment_manageMaintenanceScheduleForm);
                return;
            }
            let equipmentMaintenanceScheduleInfo = {};
            equipmentMaintenanceScheduleInfo.dayType = vm.manageTaskSchedule.repeatsType == vm.Maintenance_Schedule_RepeatType.Weekly ? vm.manageTaskSchedule.dayType : null;
            equipmentMaintenanceScheduleInfo.monthDate = vm.manageTaskSchedule.repeatsType == vm.Maintenance_Schedule_RepeatType.Monthly ? (vm.manageTaskSchedule.monthDate ? Number(vm.manageTaskSchedule.monthDate) : null) : null;
            equipmentMaintenanceScheduleInfo.monthType = vm.manageTaskSchedule.repeatsType == vm.Maintenance_Schedule_RepeatType.Monthly ? vm.manageTaskSchedule.monthType : null;
            equipmentMaintenanceScheduleInfo.scheduleStartTime = vm.manageTaskSchedule.scheduleStartTime ? vm.manageTaskSchedule.scheduleStartTime.toString() : vm.manageTaskSchedule.scheduleStartTime;
            equipmentMaintenanceScheduleInfo.repeatEnd = vm.manageTaskSchedule.repeatEnd;
            equipmentMaintenanceScheduleInfo.endOnDate = vm.manageTaskSchedule.repeatEnd == 'O' ? vm.manageTaskSchedule.endOnDate : null;
            equipmentMaintenanceScheduleInfo.endAfterOccurrence = vm.manageTaskSchedule.repeatEnd == 'A' ? vm.manageTaskSchedule.endAfterOccurrence : null;
            equipmentMaintenanceScheduleInfo.scheduleRemarks = vm.manageTaskSchedule.scheduleRemarks;
            equipmentMaintenanceScheduleInfo.isActive = true;

            if (vm.manageTaskSchedule && vm.manageTaskSchedule.eqpTaskScheduleID) {
                vm.cgBusyLoading = EquipmentTaskSchedule.equipmentTaskSchedule().update({
                    id: vm.manageTaskSchedule.eqpTaskScheduleID,
                }, equipmentMaintenanceScheduleInfo).$promise.then(() => {
                    BaseService.currentPagePopupForm.pop();
                    $mdDialog.cancel(true);
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
        }


        /*Used to check max length*/
        vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
            return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
        }

        /* called for max date validation */
        vm.getMinDateValidation = (FromDate, ToDate) => {
            return BaseService.getMinDateValidation(FromDate, ToDate);
        }
        //on load submit form 
      angular.element(() => {
        //check load
        BaseService.currentPagePopupForm.push(vm.equipment_manageMaintenanceScheduleForm);
      });
    }

})();
