(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('commonDateFilter', commonDateFilter);

  /** @ngInject */
  function commonDateFilter() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        isRequired: '=?',
        isDisabled: '=?',
        fromDate: '=?',
        toDate: '=?',
        resetFilter: '=?',
        dateTypeList: '=?',
        selectedDateType: '=',
        selectedDuration: '='
      },
      templateUrl: 'app/directives/custom/common-date-filter/common-date-filter.html',
      controller: commonDateFilterCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for text-angular define before load directive
    *
    * @param
    */

    function commonDateFilterCtrl($scope, $filter, CORE, CONFIGURATION, $timeout) {
      var vm = this;
      vm.isRequired = $scope.isRequired ? true : false;
      $scope.$watch('isRequired', () => {
        vm.isRequired = $scope.isRequired ? (vm.dateRangeModel === 'LIFE_TIME' ? false : true) : false;
      });
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.CORE_MESSAGE_CONSTANT = angular.copy(CORE.MESSAGE_CONSTANT);
      vm.CORE_MESSAGE_CONSTANT.MAX_DATE_TODAY_DATE = stringFormat(vm.CORE_MESSAGE_CONSTANT.MAX_DATE_TODAY_DATE, 'From Date', 'To Date');
      vm.CORE_MESSAGE_CONSTANT.MIN_DATE_TODAY_DATE = stringFormat(vm.CORE_MESSAGE_CONSTANT.MIN_DATE_TODAY_DATE, 'To Date', 'From Date');
      vm.fromDateFilter = $scope.fromDate;
      vm.toDateFilter = $scope.toDate;
      vm.dateTypeList = $scope.dateTypeList || [];
      vm.commonDateFilterSearchCriteria = CORE.CommonDateFilterSearchCriteria;
      vm.dateRangeModel = $scope.selectedDuration ? $scope.selectedDuration : vm.commonDateFilterSearchCriteria[0].key;
      vm.selectedDateType = $scope.selectedDateType ? $scope.selectedDateType : vm.dateTypeList && vm.dateTypeList.length > 0 ? vm.dateTypeList[0].key : null;
      if (!$scope.selectedDateType && vm.dateTypeList && vm.dateTypeList.length > 0) {
        $scope.selectedDateType = vm.dateTypeList[0].key;
      }
      const oneDayDuration = 24 * 60 * 60 * 1000;

      $scope.resetFilter = () => {
        vm.dateRangeModel = $scope.selectedDuration ? $scope.selectedDuration : vm.commonDateFilterSearchCriteria[0].key;
        // Default set selection of From/To Date value on reset form
        if ($scope.selectedDuration) {
          vm.dateRangeChanged();
        }
        if (vm.filtersInfo['fromDateFilter'].$error.required) {
          vm.fromDateFilter = getCurrentUTC();  // Static Solution: Addeed this code for resettig null vlaue.(Dyncmaic report Page)  => case: If we do not set this then required validation remain even after setting null value.
        }
        $timeout(() => {
          if (!$scope.selectedDuration) {
            vm.fromDateFilter = vm.toDateFilter = null;
          }
          vm.filtersInfo.$setPristine();
          vm.filtersInfo.$setUntouched();
        });
      };

      const resetDateTypeWatch = $scope.$watch('selectedDateType', () => vm.selectedDateType = $scope.selectedDateType);

      const fromDateFilterWatch = $scope.$watch('vm.fromDateFilter', () => {
        $scope.fromDate = vm.fromDateFilter ? new Date($filter('date')(vm.fromDateFilter, vm.DefaultDateFormat)) : null;
        if (vm.dateRangeModel === 'Custom_Date' && !vm.fromDateFilter) {
          vm.toDateFilter = null;
        }
      });

      const toDateFilterWatch = $scope.$watch('vm.toDateFilter', () => $scope.toDate = vm.toDateFilter ? new Date($filter('date')(vm.toDateFilter, vm.DefaultDateFormat)) : null);

      vm.initDateOption = () => {
        vm.fromDateFilterOptions = {
          appendToBody: true,
          fromDateOpenFlag: false,
          maxDate: vm.toDateFilter
        };
        vm.toDateFilterOptions = {
          appendToBody: true,
          toDateOpenFlag: false,
          minDate: vm.fromDateFilter
        };
      };
      vm.initDateOption();

      const getCurrentWeekFromDate = (date) => {
        if (date.getDay() === 0) {
          return date;
        } else {
          const newDate = moment(date).add(-1, 'days').toDate();
          return getCurrentWeekFromDate(newDate);
        }
      };
      const getCurrentWeekToDate = (date) => {
        if (date.getDay() === 6) {
          return date;
        } else {
          const newDate = moment(date).add(1, 'days').toDate();
          return getCurrentWeekToDate(newDate);
        }
      };

      vm.dateRangeChanged = () => {
        $scope.fromDate = vm.fromDateFilter = $scope.toDate = vm.toDateFilter = null;
        const date = new Date();
        const quarter = Math.floor((date.getMonth() / 3));
        const annual = Math.floor((date.getMonth() / 6));
        const fiscalYearStartingMonth = _accountingYearStartingMonth - 1;
        const fiscalYear = date.getMonth() < fiscalYearStartingMonth ? date.getFullYear() - 1 : date.getFullYear();
        vm.isRequired = angular.copy($scope.isRequired);
        switch (vm.dateRangeModel) {
          case 'TODAY':
            vm.fromDateFilter = date;
            vm.toDateFilter = angular.copy(vm.fromDateFilter);
            break;
          case 'TOMORROW':
            vm.fromDateFilter = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
            vm.toDateFilter = angular.copy(vm.fromDateFilter);
            break;
          case 'YESTERDAY':
            vm.fromDateFilter = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
            vm.toDateFilter = angular.copy(vm.fromDateFilter);
            break;
          case 'LAST_SEVEN_DAYS':
            vm.fromDateFilter = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
            vm.toDateFilter = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
            break;
          case 'LAST_FORTEEN_DAYS':
            vm.fromDateFilter = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 14);
            vm.toDateFilter = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
            break;
          case 'LAST_THIRTY_DAYS':
            vm.fromDateFilter = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 30);
            vm.toDateFilter = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
            break;
          case 'NEXT_WEEK':
            vm.toDateFilter = new Date(getCurrentWeekToDate(date).getTime() + (oneDayDuration * 7));
            vm.fromDateFilter = new Date(getCurrentWeekFromDate(date).getTime() + (oneDayDuration * 7));
            break;
          case 'CURRENT_WEEK':
            vm.toDateFilter = getCurrentWeekToDate(date);
            vm.fromDateFilter = getCurrentWeekFromDate(date);
            break;
          case 'LAST_WEEK':
            vm.toDateFilter = getCurrentWeekToDate(date) - (oneDayDuration * 7);
            vm.fromDateFilter = getCurrentWeekFromDate(date) - (oneDayDuration * 7);
            break;
          case 'NEXT_MONTH':
            vm.fromDateFilter = new Date(date.getFullYear(), date.getMonth() + 1, 1);
            vm.toDateFilter = new Date(date.getFullYear(), date.getMonth() + 2, 0);
            break;
          case 'CURRENT_MONTH':
            vm.fromDateFilter = new Date(date.getFullYear(), date.getMonth(), 1);
            vm.toDateFilter = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            break;
          case 'LAST_MONTH':
            vm.fromDateFilter = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            vm.toDateFilter = new Date(date.getFullYear(), date.getMonth(), 0);
            break;
          case 'NEXT_QUARTER':
            vm.fromDateFilter = new Date(date.getFullYear(), (quarter * 3) + 3, 1);
            vm.toDateFilter = new Date(vm.fromDateFilter.getFullYear(), vm.fromDateFilter.getMonth() + 3, 0);
            break;
          case 'CURRENT_QUARTER':
            vm.fromDateFilter = new Date(date.getFullYear(), quarter * 3, 1);
            vm.toDateFilter = new Date(vm.fromDateFilter.getFullYear(), vm.fromDateFilter.getMonth() + 3, 0);
            break;
          case 'LAST_QUARTER':
            vm.fromDateFilter = new Date(date.getFullYear(), (quarter * 3) - 3, 1);
            vm.toDateFilter = new Date(vm.fromDateFilter.getFullYear(), vm.fromDateFilter.getMonth() + 3, 0);
            break;
          case 'NEXT_SEMI_ANNUAL':
            vm.fromDateFilter = new Date(date.getFullYear(), (annual * 6) + 6, 1);
            vm.toDateFilter = new Date(vm.fromDateFilter.getFullYear(), vm.fromDateFilter.getMonth() + 6, 0);
            break;
          case 'CURRENT_SEMI_ANNUAL':
            vm.fromDateFilter = new Date(date.getFullYear(), annual * 6, 1);
            vm.toDateFilter = new Date(vm.fromDateFilter.getFullYear(), vm.fromDateFilter.getMonth() + 6, 0);
            break;
          case 'LAST_SEMI_ANNUAL':
            vm.fromDateFilter = new Date(date.getFullYear(), (annual * 6) - 6, 1);
            vm.toDateFilter = new Date(vm.fromDateFilter.getFullYear(), vm.fromDateFilter.getMonth() + 6, 0);
            break;
          case 'NEXT_YEAR':
            {
              switch (_accountingYear) {
                case CONFIGURATION.ACCOUNTINGYEAR.CALENDARYEAR:
                  vm.fromDateFilter = new Date(date.getFullYear() + 1, 0, 1);
                  vm.toDateFilter = new Date(date.getFullYear() + 2, 0, 0);
                  break;
                case CONFIGURATION.ACCOUNTINGYEAR.FISCALYEAR:
                  vm.fromDateFilter = new Date((fiscalYear + 1), fiscalYearStartingMonth, 1);
                  vm.toDateFilter = new Date((fiscalYear + 2), fiscalYearStartingMonth, 0);
                  break;
              }
            }
            break;
          case 'CURRENT_YEAR':
            {
              switch (_accountingYear) {
                case CONFIGURATION.ACCOUNTINGYEAR.CALENDARYEAR:
                  vm.fromDateFilter = new Date(date.getFullYear(), 0, 1);
                  vm.toDateFilter = new Date(date.getFullYear() + 1, 0, 0);
                  break;
                case CONFIGURATION.ACCOUNTINGYEAR.FISCALYEAR:
                  vm.fromDateFilter = new Date(fiscalYear, fiscalYearStartingMonth, 1);
                  vm.toDateFilter = new Date((fiscalYear + 1), fiscalYearStartingMonth, 0);
                  break;
              }
            }
            break;
          case 'LAST_YEAR':
            {
              switch (_accountingYear) {
                case CONFIGURATION.ACCOUNTINGYEAR.CALENDARYEAR:
                  vm.fromDateFilter = new Date(date.getFullYear() - 1, 0, 1);
                  vm.toDateFilter = new Date(date.getFullYear(), 0, 0);
                  break;
                case CONFIGURATION.ACCOUNTINGYEAR.FISCALYEAR:
                  vm.fromDateFilter = new Date((fiscalYear - 1), fiscalYearStartingMonth, 1);
                  vm.toDateFilter = new Date(fiscalYear, fiscalYearStartingMonth, 0);
                  break;
              }
            }
            break;
          case 'FIRST_QUARTER':
            {
              switch (_accountingYear) {
                case CONFIGURATION.ACCOUNTINGYEAR.CALENDARYEAR:
                  vm.fromDateFilter = new Date(date.getFullYear(), 0, 1);
                  vm.toDateFilter = new Date(vm.fromDateFilter.getFullYear(), vm.fromDateFilter.getMonth() + 3, 0);
                  break;
                case CONFIGURATION.ACCOUNTINGYEAR.FISCALYEAR:
                  vm.fromDateFilter = new Date(fiscalYear, fiscalYearStartingMonth, 1);
                  vm.toDateFilter = new Date(fiscalYear, fiscalYearStartingMonth + 3, 0);
                  break;
              }
            }
            break;
          case 'SECOND_QUARTER':
            {
              switch (_accountingYear) {
                case CONFIGURATION.ACCOUNTINGYEAR.CALENDARYEAR:
                  vm.fromDateFilter = new Date(date.getFullYear(), 3, 1);
                  vm.toDateFilter = new Date(vm.fromDateFilter.getFullYear(), vm.fromDateFilter.getMonth() + 3, 0);
                  break;
                case CONFIGURATION.ACCOUNTINGYEAR.FISCALYEAR:
                  vm.fromDateFilter = new Date(fiscalYear, fiscalYearStartingMonth + 3, 1);
                  vm.toDateFilter = new Date(fiscalYear, fiscalYearStartingMonth + 6, 0);
                  break;
              }
            }
            break;
          case 'THIRD_QUARTER':
            {
              switch (_accountingYear) {
                case CONFIGURATION.ACCOUNTINGYEAR.CALENDARYEAR:
                  vm.fromDateFilter = new Date(date.getFullYear(), 6, 1);
                  vm.toDateFilter = new Date(vm.fromDateFilter.getFullYear(), vm.fromDateFilter.getMonth() + 3, 0);
                  break;
                case CONFIGURATION.ACCOUNTINGYEAR.FISCALYEAR:
                  vm.fromDateFilter = new Date(fiscalYear, fiscalYearStartingMonth + 6, 1);
                  vm.toDateFilter = new Date(fiscalYear, fiscalYearStartingMonth + 9, 0);
                  break;
              }
            }
            break;
          case 'FOURTH_QUARTER':
            {
              switch (_accountingYear) {
                case CONFIGURATION.ACCOUNTINGYEAR.CALENDARYEAR:
                  vm.fromDateFilter = new Date(date.getFullYear(), 9, 1);
                  vm.toDateFilter = new Date(vm.fromDateFilter.getFullYear(), vm.fromDateFilter.getMonth() + 3, 0);
                  break;
                case CONFIGURATION.ACCOUNTINGYEAR.FISCALYEAR:
                  vm.fromDateFilter = new Date(fiscalYear, fiscalYearStartingMonth + 9, 1);
                  vm.toDateFilter = new Date(fiscalYear, fiscalYearStartingMonth + 12, 0);
                  break;
              }
            }
            break;
          case 'WEEK_TO_DATE':
            vm.fromDateFilter = getCurrentWeekFromDate(date);
            vm.toDateFilter = date;
            break;
          case 'MONTH_TO_DATE':
            vm.fromDateFilter = new Date(date.getFullYear(), date.getMonth(), 1);
            vm.toDateFilter = date;
            break;
          case 'QUARTER_TO_DATE':
            vm.fromDateFilter = new Date(date.getFullYear(), quarter * 3, 1);
            vm.toDateFilter = date;
            break;
          case 'YEAR_TO_DATE':
            {
              switch (_accountingYear) {
                case CONFIGURATION.ACCOUNTINGYEAR.CALENDARYEAR:
                  vm.fromDateFilter = new Date(date.getFullYear(), 0, 1);
                  break;
                case CONFIGURATION.ACCOUNTINGYEAR.FISCALYEAR:
                  vm.fromDateFilter = new Date(fiscalYear, fiscalYearStartingMonth, 1);
                  break;
              }
              vm.toDateFilter = date;
            }
            break;
          case 'TTM':
            vm.fromDateFilter = new Date(date.getFullYear() - 1, date.getMonth(), date.getDate());
            vm.toDateFilter = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
            break;
          case 'LIFE_TIME':
            vm.fromDateFilter = vm.toDateFilter = null;
            vm.isRequired = false;
            break;
        }
      };

      // Default set selection of From/To Date value on load directive
      if ($scope.selectedDuration) {
        vm.dateRangeChanged();
      }

      vm.dateTypeChanged = () => {
        $scope.resetFilter();
        $scope.selectedDateType = vm.selectedDateType;
      };

      $scope.$on('$destroy', () => {
        fromDateFilterWatch();
        toDateFilterWatch();
        resetDateTypeWatch();
      });
    }
  }
})();
