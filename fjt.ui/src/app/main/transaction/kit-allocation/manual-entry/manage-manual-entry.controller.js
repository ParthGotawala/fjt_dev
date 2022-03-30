(function () {
  'use strict';

  angular
    .module('app.transaction.manualentry')
    .controller('ManageManualEntryController', ManageManualEntryController);

  /** @ngInject */
  function ManageManualEntryController($stateParams, $timeout, $state, $scope, CORE, $filter, $q, EmployeeFactory, DialogFactory, BaseService, ComponentFactory, TRANSACTION, ReceivingMaterialFactory, BOMFactory) {
    const vm = this;
    vm.isUpdatable = true;
    vm.todayDate = new Date();
    vm.taToolbar = CORE.Toolbar;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.TimePattern = CORE.OperationTimePattern;
    vm.TimeMask = CORE.OperationTimeMask;
    vm.DateTimeFormat = _dateTimeDisplayFormat;
    vm.transactionType = TRANSACTION.StartStopActivityTransactionType;
    vm.activityTransactionType = TRANSACTION.StartStopActivityActionType;
    const convertDateFormat = CORE.DateFormatArray[11].format;
    vm.paymentMode = CORE.PaymentMode;
    vm.saveBtnDisableFlag = false;
    vm.activity = {
      id: $stateParams && $stateParams.id ? $stateParams.id : null,
      startDate: vm.todayDate,
      endDate: vm.todayDate,
      refTransID: $stateParams && $stateParams.refTransId ? $stateParams.refTransId : null,
      transactionType: $stateParams && $stateParams.transType ? $stateParams.transType : null,
      isSetup: true,
      paymentMode: vm.paymentMode.Exempt,
      activityType: vm.activityTransactionType[0].id
    };
    vm.headerdata = [];

    vm.startDateOptions = {
      maxDate: vm.todayDate,
      appendToBody: true,
      startDateOpenFlag: false
    };

    vm.endDateOptions = {
      maxDate: vm.todayDate,
      appendToBody: true,
      endDateOpenFlag: false
    };

    vm.startTimeOptions = {
      startTimeOpenFlag: false,
      appendToBody: true
    };

    vm.endTimeOptions = {
      endTimeOpenFlag: false,
      appendToBody: true
    };

    // get max length validations
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    // hyperlink go personnel list page
    vm.goToPersonnelList = () => BaseService.goToPersonnelList();

    /* hyperlink go kit list page */
    vm.goToKitList = () => BaseService.openInNew(TRANSACTION.KIT_LIST_STATE);

    /* hyperlink go part list page */
    vm.goToPartList = () => BaseService.goToPartList();

    function showWithoutSavingAlertforBackButton() {
      const obj = {
        title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
        textContent: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_BODY_MESSAGE,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.confirmDiolog(obj).then((yes) => {
        if (yes) {
          $state.go(TRANSACTION.MANUAL_ENTRY_LIST_STATE);
        }
      }, (error) => BaseService.getErrorLog(error));
    }

    const initAutoComplete = () => {
      vm.autoCompleteEmployee = {
        columnName: 'empCodeName',
        keyColumnName: 'userID',
        keyColumnId: vm.activity.userID ? vm.activity.userID : null,
        inputName: 'Personnel',
        placeholderName: 'Personnel',
        isRequired: true,
        isAddnew: false,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.activity.paymentMode = item.paymentMode || null;
            vm.activity.burdenRate = item.burdenRate || null;
            vm.activity.userID = item.userID || null;
          }
        },
        callbackFn: getEmployeeList
      };

      vm.autoCompleteSO = {
        columnName: 'salescolumn',
        keyColumnName: 'SalesOrderDetailId',
        keyColumnId: vm.activity && vm.activity.refTransID ? vm.activity.refTransID : null,
        inputName: 'Kit#',
        placeholderName: 'Kit#',
        isRequired: true,
        isAddnew: false,
        callbackFn: (query) => getSalesOrderList(query),
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.activity.refTransID = item.SalesOrderDetailId;
          }
        },
        onSearchFn: (query) => getSalesOrderList(query)
      };

      vm.autoCompleteAssy = {
        columnName: 'PIDCode',
        keyColumnName: 'id',
        keyColumnId: vm.activity && vm.activity.refTransID ? vm.activity.refTransID : null,
        inputName: 'SearchAssy',
        placeholderName: 'Type here to search assembly',
        isRequired: true,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.activity.refTransID = item.id;
          }
        }
      };
    };

    // get Personnel List
    const getEmployeeList = () => EmployeeFactory.GetEmployeeDetail().query({ isOnlyActive: true }).$promise.then((employees) => {
      vm.EmployeeList = employees.data;
      return vm.EmployeeList;
    }).catch((error) => BaseService.getErrorLog(error));

    // get kit List
    const getSalesOrderList = (query) => {
      const searchObj = {
        salesOrderDetailID: vm.activity.refTransID || null,
        search: query
      };
      return ReceivingMaterialFactory.get_PO_SO_Assembly_List().query(searchObj).$promise.then((response) => {
        vm.SalesOrderNumberList = [];
        if (response.data) {
          vm.SalesOrderNumberList = response.data;
          if (searchObj.salesOrderDetailID) {
            $timeout(() => {
              if (vm.autoCompleteSO && vm.autoCompleteSO.inputName) {
                $scope.$broadcast(vm.autoCompleteSO.inputName, vm.SalesOrderNumberList[0]);
                vm.autoCompleteSO.keyColumnId = vm.activity.refTransID;
              }
            }, true);
          }
        }
        return vm.SalesOrderNumberList;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getPartSearch = (query) => {
      const searchObj = {
        id: vm.activity.refTransID,
        query: query,
        type: 'AssyID'
      };
      return ComponentFactory.getAllAssemblyBySearch().save({ listObj: searchObj }).$promise.then((assyIDList) => {
        vm.assyList = [];
        if (assyIDList.data.data) {
          vm.assyList = assyIDList.data.data;
          if (searchObj.id) {
            $timeout(() => {
              if (vm.autoCompleteAssy && vm.autoCompleteAssy.inputName) {
                $scope.$broadcast(vm.autoCompleteAssy.inputName, vm.assyList[0]);
                vm.autoCompleteAssy.keyColumnId = vm.activity.refTransID;
              }
            });
          }
        }
        return vm.assyList;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getAssyDetails = () => {
      BOMFactory.getAllRFQListByID().query({ id: vm.activity.refTransID }).$promise.then((response) => {
        vm.assyList = [];
        if (response.data) {
          vm.assyList = response.data;
          if (vm.activity.refTransID) {
            $timeout(() => {
              if (vm.autoCompleteAssy && vm.autoCompleteAssy.inputName) {
                $scope.$broadcast(vm.autoCompleteAssy.inputName, vm.assyList[0]);
                vm.autoCompleteAssy.keyColumnId = vm.activity.refTransID;
              }
            });
          }
        }
        return vm.assyList;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Get assembly history details by ID
    const getAssemblyHistoryByID = () => {
      BOMFactory.getAssemblyHistoryByID().query({ id: vm.activity.id }).$promise.then((response) => {
        if (response && response.data) {
          vm.AssemblyDetails = response.data;
          if (vm.AssemblyDetails) {
            vm.activity.transactionType = vm.AssemblyDetails.transactionType;
            vm.activity.userID = vm.AssemblyDetails.userID;
            vm.activity.activityType = vm.AssemblyDetails.activityType;
            vm.activity.remark = vm.AssemblyDetails.remark;
            vm.activity.paymentMode = vm.AssemblyDetails.paymentMode || vm.paymentMode.Exempt;
            vm.activity.burdenRate = vm.AssemblyDetails.burdenRate;
            vm.activity.startTime = new Date(vm.AssemblyDetails.checkinTime).getTime();
            vm.activity.endTime = new Date(vm.AssemblyDetails.checkoutTime).getTime();
            vm.activity.totalTime = vm.AssemblyDetails.totalTime;
            vm.activity.refTransID = vm.AssemblyDetails.refTransID;
            vm.activity.startDate = new Date(vm.AssemblyDetails.checkinTime);
            vm.activity.endDate = new Date(vm.AssemblyDetails.checkoutTime);
            getAutoCompleteData();
          }
        }
      });
    };

    const getAutoCompleteData = () => {
      const autoCompletePromise = [getEmployeeList()];
      vm.cgBusyLoading = $q.all(autoCompletePromise).then(() => {
        if (vm.activity.transactionType === vm.transactionType[0].id) {
          autoCompletePromise.push(getPartSearch());
        } else if (vm.activity.transactionType === vm.transactionType[1].id) {
          autoCompletePromise.push(getAssyDetails());
        } else {
          autoCompletePromise.push(getSalesOrderList());
        }
        initAutoComplete();
      });
    };

    const pageInit = () => {
      if (vm.activity.id) {
        getAssemblyHistoryByID();
      } else {
        getAutoCompleteData();
      }
    };
    pageInit();

    vm.goBack = () => {
      if (BaseService.checkFormDirty(vm.manualEntryForm, vm.checkDirtyObject)) {
        showWithoutSavingAlertforBackButton();
      } else {
        $state.go(TRANSACTION.MANUAL_ENTRY_LIST_STATE);
      }
    };

    vm.onChangeDate = () => {
      if (vm.activity.startDate && vm.activity.endDate) {
        const startDate = new Date(vm.activity.startDate.setHours(0, 0, 0, 0));
        const endDate = new Date(vm.activity.endDate.setHours(0, 0, 0, 0));
        vm.isInvalid = false;
        if (startDate > endDate) {
          vm.isInvalid = true;
          $scope.$applyAsync(() => {
            vm.manualEntryForm.startDate.$setValidity('valid', false);
            vm.manualEntryForm.endDate.$setValidity('valid', false);
          });
        } else {
          vm.isInvalid = false;
          $scope.$applyAsync(() => {
            vm.manualEntryForm.startDate.$setValidity('valid', true);
            vm.manualEntryForm.endDate.$setValidity('valid', true);
          });
        }
      } else {
        vm.isInvalid = false;
        $scope.$applyAsync(() => {
          vm.manualEntryForm.startDate.$setValidity('valid', true);
          vm.manualEntryForm.endDate.$setValidity('valid', true);
        });
      }
    };

    function ConverDateAndTimeToDateTime(date, time) {
      const pdate = $filter('date')(new Date(date), convertDateFormat);
      const ptime = $filter('date')(time, CORE.MOMENT_TIME_FORMAT_UI);
      const pDateTime = new Date(pdate + ' ' + ptime);
      return pDateTime;
    }

    // Save FOB Details
    vm.saveManualActivity = () => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.manualEntryForm)) {
        vm.saveBtnDisableFlag = false;
        return;
      }
      const checkinTime = ConverDateAndTimeToDateTime(vm.activity.startDate, vm.activity.startTime);
      const checkoutTime = ConverDateAndTimeToDateTime(vm.activity.endDate, vm.activity.endTime);
      const saveData = {
        id: vm.activity.id || null,
        refTransID: vm.activity.refTransID,
        transactionType: vm.activity.transactionType || null,
        checkinTime: checkinTime,
        checkoutTime: checkoutTime,
        totalTime: calculateSeconds(checkinTime, checkoutTime),
        activityType: vm.activity.activityType || null,
        userID: vm.activity.userID || null,
        remark: vm.activity.remark || null,
        paymentMode: vm.activity.paymentMode || null,
        burdenRate: vm.activity.burdenRate || null
      };
      vm.cgBusyLoading = BOMFactory.saveManualActivityTracking().save(saveData).$promise.then((res) => {
        if (res.data && res.data.id) {
          vm.activity.id = res.data.id;
          vm.manualEntryForm.$setUntouched();
          vm.manualEntryForm.$setPristine();
          BaseService.currentPagePopupForm = [];
          vm.saveBtnDisableFlag = false;
          $state.transitionTo($state.$current, { transType: vm.activity.transactionType, refTransId: vm.activity.refTransID, id: vm.activity.id }, { location: true, inherit: true, notify: true });
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
  }
})();
