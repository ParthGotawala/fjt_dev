(function () {
  'use restrict';

  angular.module('app.core')
    .controller('AddEnterpriseRecordPopupController', AddEnterpriseRecordPopupController);

  /* @ngInject */
  function AddEnterpriseRecordPopupController(data, $mdDialog, DialogFactory, CORE, BaseService, $timeout, $filter) {
    var vm = this;
    vm.enterpriseAdvanceSearchCondition = CORE.ENTERPRICE_ADVANCE_SEARCH_CONDITION;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.ADD_ENTERPRISE_WITH_DATE_RANGE_NOTES = CORE.ADD_ENTERPRISE_WITH_DATE_RANGE_NOTES;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.isRemoveCondition = true;
    vm.DatePickerOption = {
      fromDateFlag: false,
      toDateFlag: false
    };

    const initDateOption = () => {
      vm.fromDateOptions = {
        appendToBody: true,
        fromDateOpenFlag: false,
        maxDate: vm.toDate
      };
      vm.toDateOptions = {
        appendToBody: true,
        toDateOpenFlag: false,
        minDate: vm.fromDate
      };
    };
    initDateOption();

    vm.getMaxDateValidation = (fromDate, toDate) => BaseService.getMaxDateValidation(fromDate, toDate);
    vm.getMinDateValidation = (fromDate, toDate) => BaseService.getMinDateValidation(fromDate, toDate);

    vm.addRecord = () => {
      vm.addSearchRecordForm.$setDirty();
      if (BaseService.focusRequiredField(vm.addSearchRecordForm)) {
        return;
      };
      const addData = {
        ids: Array.isArray(data) ? data : [data],
        fromDate: vm.fromDate,
        toDate: vm.toDate
      };

      let messageContent = null;
      messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ADD_TRANSACTION_CONFIRM_MESSAGE);
      messageContent.message = stringFormat(messageContent.message, Array.isArray(data) ? data.length : 1);
      console.log('From/To Date' + vm.fromDate + ',' + vm.toDate);
      console.log('From/To Date Result: ' + vm.fromDate && vm.toDate);
      if (vm.fromDate && vm.toDate) {
        vm.fromDate = $filter('date')(vm.fromDate, vm.DefaultDateFormat);
        vm.toDate = $filter('date')(vm.toDate, vm.DefaultDateFormat);

        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ADD_TRANSACTION_WITH_DATE_RANGE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, Array.isArray(data) ? data.length : 1, vm.fromDate, vm.toDate);
      };

      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_CANCEL_TEXT,
        multiple: true
      };
      DialogFactory.messageConfirmDialog(obj).then(() => {
        if (vm.fromDate && vm.toDate) {
          addData.fromDate = (BaseService.getAPIFormatedDate(vm.fromDate));
          addData.toDate = (BaseService.getAPIFormatedDate(vm.toDate));
        };
        $mdDialog.hide(addData);
      }, () => {
        setFocusByName('fromDate');
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    //Set from date
    vm.fromDateChanged = () => {
      initDateOption();
      vm.checkDateValidation(true);
    };
    //Set to date
    vm.toDateChanged = () => {
      initDateOption();
      vm.checkDateValidation(false);
    };

    // check date vallidation
    vm.checkDateValidation = (type) => {
      const fromDate = vm.fromDate ? new Date($filter('date')(vm.fromDate, vm.DefaultDateFormat)) : vm.addSearchRecordForm.fromDate.$viewValue ? new Date($filter('date')(vm.addSearchRecordForm.fromDate.$viewValue, vm.DefaultDateFormat)) : null;
      const toDate = vm.toDate ? new Date($filter('date')(vm.toDate, vm.DefaultDateFormat)) : vm.addSearchRecordForm.toDate.$viewValue ? new Date($filter('date')(vm.addSearchRecordForm.toDate.$viewValue, vm.DefaultDateFormat)) : null;
      if (vm.addSearchRecordForm) {
        if (vm.addSearchRecordForm.fromDate && vm.addSearchRecordForm.toDate && fromDate && toDate) {
          if (type && fromDate <= toDate) {
            vm.addSearchRecordForm.toDate.$setValidity('minvalue', true);
          }
          if (type && fromDate > toDate) {
            vm.addSearchRecordForm.fromDate.$setValidity('maxvalue', false);
          }
          if (!type && fromDate <= toDate) {
            vm.addSearchRecordForm.fromDate.$setValidity('maxvalue', true);
          }
          if (!type && fromDate > toDate) {
            vm.addSearchRecordForm.toDate.$setValidity('minvalue', false);
          }
        }
      }
    };

    function showWithoutSavingAlertforcancle() {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.WITHOUT_APPLING_FILTER_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.advanceSearchFilterData = [];
        }
        $timeout(() => { $mdDialog.hide(); });
      }, (error) => BaseService.getErrorLog(error));
    }

    vm.cancel = () => {
      const isdirty = vm.addSearchRecordForm.$dirty;
      if (isdirty) {
        showWithoutSavingAlertforcancle();
      } else {
        $mdDialog.cancel();
      }
    };

    vm.clear = () => {
      vm.advanceSearchFilterData = [];
      $timeout(() => $mdDialog.hide());
    };
  }
})();
