(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('displayReportFilterParameter', displayReportFilterParameter);

  /** @ngInject */
  function displayReportFilterParameter(CORE, $timeout, $q, $filter, CONFIGURATION, DialogFactory, ReportMasterFactory, REPORTS, USER, BaseService) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        dataelementList: '=?',
        reportData: '=?',
        setValidateOnClick: '=?',
        reportForm: '='
      },
      templateUrl: 'app/directives/custom/display-report-filter-parameter/display-report-filter-parameter.html',
      controller: displayReportFilterParameterCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for text-angular define before load directive
    *
    * @param
    */

    function displayReportFilterParameterCtrl($scope) {
      var vm = this;
      vm.dataelementList = $scope.dataelementList;
      vm.reportData = $scope.reportData;
      vm.reportForm = $scope.reportForm;
      vm.setValidateOnClick = $scope.setValidateOnClick = false;
      vm.EmptyMesssage = REPORTS.REPORTS_EMPTYSTATE.REPORT_SETTING;
      vm.CORE_INPUT_TYPES = CORE.INPUT_TYPES;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.CORE_ReportParameterFilterDbColumnName = CORE.ReportParameterFilterDbColumnName;
      vm.debounce = _configTimeout;
      vm.EmptyMesssageFilter = USER.ADMIN_EMPTYSTATE.COMPONENT_FILTERS;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.anyFilterApply = $scope.dataelementList.length === 0 ? false : true;

      $scope.$watch('setValidateOnClick', (value) => {
        vm.setValidateOnClick = value;
      });

      vm.dateRange = {
        isDisplayDateRange: false
      };

      //used at save parameter Value
      vm.fromdateParameter = {
        ReportParameterSettingMapping: {
          dbColumnName: vm.CORE_ReportParameterFilterDbColumnName.FromDate,
          type: 'dateRange'
        }
      };

      //used at save parameter Value
      vm.todateParameter = {
        ReportParameterSettingMapping: {
          dbColumnName: vm.CORE_ReportParameterFilterDbColumnName.ToDate,
          type: 'dateRange'
        }
      };

      function displayParameterData() {
        let fromDate = null;
        let todate = null;
        _.each(vm.dataelementList, (dataelement) => {
          const parameterType = dataelement.ReportParameterSettingMapping.type;
          switch (parameterType) {
            case vm.CORE_INPUT_TYPES.AUTOCOMPLETE:
              // dataelement.fieldValue = JSON.parse(dataelement.ReportParameterSettingMapping.options);
              dataelement.displayOrder = 1;
              const searchobj = {
                dataSourceId: dataelement.ReportParameterSettingMapping.dataSourceId
              };
              dataelement.autoCompleteEntity = {
                columnName: dataelement.ReportParameterSettingMapping.FixedEntityDataelement.displayColumnField,
                keyColumnName: dataelement.ReportParameterSettingMapping.FixedEntityDataelement.displayColumnPKField,
                keyColumnId: null,
                inputName: dataelement.id,
                placeholderName: 'type here to search',
                isDisabled: false,
                isAddnew: false,
                isRequired: dataelement.isRequired,
                onSelectCallbackFn: (item) => {
                  dataelement.defaultValue = item ? item[dataelement.ReportParameterSettingMapping.FixedEntityDataelement.displayColumnPKField] : null;
                  dataelement.defaultName = item ? item[dataelement.ReportParameterSettingMapping.FixedEntityDataelement.displayColumnField] : null;
                },
                onSearchFn: (query) => {
                  searchobj.searchText = query;
                  return getSearchValueForAutoCompleteParameterEntity(searchobj);
                }
              };
              break;
            case vm.CORE_INPUT_TYPES.DROPDOWN:
              dataelement.displayOrder = 1;
              const dataListObj = JSON.parse(dataelement.ReportParameterSettingMapping.options);
              dataelement.autoCompleteEntity = {
                dataList: Object.keys(dataListObj).map((it) => dataListObj[it]),
                columnName: 'Key',
                keyColumnName: 'Value',
                keyColumnId: null,
                inputName: dataelement.id,
                placeholderName: 'type here to search',
                isRequired: dataelement.isRequired,
                onSelectCallbackFn: (item) => {
                  dataelement.defaultValue = item ? item['Value'] : null;
                  dataelement.defaultName = item ? dataelement.ReportParameterSettingMapping.dbColumnName : null;
                }
              };
              break;
            case vm.CORE_INPUT_TYPES.MULTI_SELECTION:
              if (_.isUndefined(dataelement.fieldValueToDisplay)) {
                vm.reloadMultiSelectionFieldValueList(dataelement);
              }
              break;
            case vm.CORE_INPUT_TYPES.AUTOCOMPLETE_WITH_MULTISELCTION:
              {
                const searchobj = {
                  dataSourceId: dataelement.ReportParameterSettingMapping.dataSourceId
                };
                dataelement.defaultValue = [];
                dataelement.autoCompleteWithMultiSelectionEntity = {
                  columnName: dataelement.ReportParameterSettingMapping.FixedEntityDataelement.displayColumnField,
                  keyColumnName: dataelement.ReportParameterSettingMapping.FixedEntityDataelement.displayColumnPKField,
                  keyColumnId: null,
                  inputName: dataelement.id,
                  placeholderName: 'Type here to search',
                  isRequired: dataelement.isRequired,
                  callbackFn: () => {
                  },
                  onSearchFn: (query) => {
                    searchobj.searchText = query;
                    return getSearchValueForAutoCompleteParameterEntity(searchobj);
                  },
                  onSelectCallbackFn: (item) => {
                    if (item) {
                      const isAlreadyexists = _.find(dataelement.defaultValue, (objselectdEntity) => objselectdEntity[dataelement.ReportParameterSettingMapping.FixedEntityDataelement.displayColumnPKField] === item[dataelement.ReportParameterSettingMapping.FixedEntityDataelement.displayColumnPKField]);
                      if (!isAlreadyexists) {
                        dataelement.defaultValue.push(item);
                      }
                      dataelement.autoCompleteWithMultiSelectionEntity.keyColumnId = null;
                      $scope.$broadcast(dataelement.autoCompleteWithMultiSelectionEntity.inputName + 'searchText', null);
                    }
                  }
                };
              }
              break;
            case vm.CORE_INPUT_TYPES.DATE_PICKER:
              if (dataelement.ReportParameterSettingMapping.dbColumnName === vm.CORE_ReportParameterFilterDbColumnName.FromDate) {
                vm.dateRange.isDisplayDateRange = true;
                vm.dateRange.isRequired = dataelement.isRequired;
                fromDate = dataelement;
              }
              if (dataelement.ReportParameterSettingMapping.dbColumnName === vm.CORE_ReportParameterFilterDbColumnName.ToDate) {
                todate = dataelement;
              }
              break;
            case vm.CORE_INPUT_TYPES.TIME_PICKER:
              dataelement.displayOrder = 3;
              if (dataelement.ReportParameterSettingMapping.dbColumnName === vm.CORE_ReportParameterFilterDbColumnName.ToTime) {
                vm.defaultToTime = dataelement.defaultValue = (new Date()).setHours(18, 30, 0); //Default end time 6:30 PM
              } else {
                vm.defaultFromTime = dataelement.defaultValue = (new Date()).setHours(9, 0, 0); //Default time 9:00AM
              }
              dataelement.elementDataOption = {
                checkoutTimeOpenFlag: false,
                appendToBody: true
              };
              break;
            case vm.CORE_INPUT_TYPES.CHECKBOX:
              dataelement.displayOrder = 4;
              break;
            case vm.CORE_INPUT_TYPES.MULTISELECT_CHECKBOX:
              dataelement.displayOrder = 5;
              dataelement.defaultValue = 1; //dummy data;
              dataelement.fieldValue = JSON.parse(dataelement.ReportParameterSettingMapping.options);
              break;
            case vm.CORE_INPUT_TYPES.RADIOBUTTON:
              dataelement.displayOrder = 6;
              dataelement.fieldValue = JSON.parse(dataelement.ReportParameterSettingMapping.options);
              dataelement.defaultValue = dataelement.fieldValue[1].Value;
              break;
            case vm.CORE_INPUT_TYPES.TEXTBOX:
              dataelement.displayOrder = 2;
              break;
            default:
              dataelement.displayOrder = 8;
              break;
          }
        });

        if (vm.dataelementList && fromDate && todate) {
          vm.dataelementList.splice(vm.dataelementList.indexOf(fromDate), 1);
          vm.dataelementList.splice(vm.dataelementList.indexOf(todate), 1);
          $scope.dataelementList = $scope.dataelementList.concat(vm.fromdateParameter);
          $scope.dataelementList = $scope.dataelementList.concat(vm.todateParameter);
        }
      }
      displayParameterData();

      /* Get List Values on search for autocomplete entity */
      const getSearchValueForAutoCompleteParameterEntity = (searchObj, obj) => ReportMasterFactory.getAutoCompleteFileterParameterData().query({ listObj: searchObj }).$promise.then((response) => {
        if (response && response.data && response.data.length > 0) {
          response = response.data;
          if (obj) {
            $scope.$broadcast(obj.autoCompleteEntity.inputName, response[0]);
          }
        } else {
          response = [];
        }
        return response;
      }).catch((error) => BaseService.getErrorLog(error));

      // MultiSelection - Reload/Get Data List
      vm.reloadMultiSelectionFieldValueList = (itemElementData) => {
        itemElementData.searchText = undefined;
        const searchObj = {
          dataSourceId: itemElementData.ReportParameterSettingMapping.dataSourceId
        };
        vm.cgBusyLoading = ReportMasterFactory.getAutoCompleteFileterParameterData().query({ listObj: searchObj }).$promise.then((response) => {
          itemElementData.FieldValue = itemElementData.fieldValueToDisplay = [];
          if (response && response.data) {
            //_.each(response.data, (item) => {
            //  item.mfgactualName = item.mfgName;
            //  item.mfgName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName);
            //});
            itemElementData.FieldValue = response.data;
            itemElementData.fieldValueToDisplay = angular.copy(itemElementData.FieldValue);
          }
          return vm.mfgCodeDetail;
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // MultiSelection - on changed.
      vm.multiSelectionChanged = (itemElementData) => {
        itemElementData.defaultValue = [];
        const fieldValueListToFilter = angular.copy(itemElementData.FieldValue);
        itemElementData.fieldValueToDisplay = itemElementData.searchText ? _.filter(fieldValueListToFilter, (item) => item[itemElementData.ReportParameterSettingMapping.FixedEntityDataelement.displayColumnField].toLowerCase().contains(itemElementData.searchText.toLowerCase())) : fieldValueListToFilter;
      };

      // MultiSelection - clear Search Text.
      vm.clearMultiSelectionSearchText = (itemElementData) => {
        itemElementData.searchText = undefined;
        vm.multiSelectionChanged(itemElementData);
      };

      // clear Filter for  MultiSelection / AutoComplete with Multiselection
      vm.clearMultiSelectionFilter = (itemElementData) => {
        itemElementData.defaultValue = [];
      };

      // Remove item From AutoComplete with Multiselcetion input selected item list
      vm.removeselection = (itemElementData, x) => {
        if (x) {
          const isAlreadyexists = _.find(itemElementData.defaultValue, (objselectditem) => objselectditem[itemElementData.ReportParameterSettingMapping.FixedEntityDataelement.displayColumnPKField] === x[itemElementData.ReportParameterSettingMapping.FixedEntityDataelement.displayColumnPKField]);
          if (isAlreadyexists) {
            itemElementData.defaultValue.splice(itemElementData.defaultValue.indexOf(isAlreadyexists), 1);
          }
        }
      };

      // check any checkbox selected
      vm.CheckAnyOneSelected = (itemElementData) => {
        const trues = $filter('filter')(itemElementData.fieldValue, {
          defaultValue: true
        });
        itemElementData.anySelected = trues.length > 0 ? true : false;
      };

      /* called for max length validation */
      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

      // Redirect to Master page list.
      vm.redirectToMasterPage = (itemElementData) => {
        BaseService.openInNew(itemElementData.ReportParameterSettingMapping.pageRouteState, {});
      };

      // Clear All Filter
      vm.clearFilter = () => {
        _.each(vm.dataelementList, (dataelement) => {
          const parameterType = dataelement.ReportParameterSettingMapping.type;
          if (parameterType !== vm.CORE_INPUT_TYPES.RADIOBUTTON) {
            if (parameterType === vm.CORE_INPUT_TYPES.AUTOCOMPLETE) {
              $scope.$broadcast(dataelement.id, null);
            }
            else if (parameterType === vm.CORE_INPUT_TYPES.TIME_PICKER) {
              if (dataelement.ReportParameterSettingMapping.dbColumnName === vm.CORE_ReportParameterFilterDbColumnName.ToTime) {
                dataelement.defaultValue = vm.defaultToTime;
              }
              else {
                dataelement.defaultValue = vm.defaultFromTime;
              }
            }
            else if (parameterType === vm.CORE_INPUT_TYPES.AUTOCOMPLETE_WITH_MULTISELCTION || parameterType === vm.CORE_INPUT_TYPES.MULTI_SELECTION) {
              vm.clearMultiSelectionFilter(dataelement);
            }
            else {
              dataelement.defaultValue = null;
            }
          }
        });
        vm.resetDateFilter();
        $scope.setValidateOnClick = false;
        vm.fromdateParameter.defaultValue = vm.fromDateValue = null;
        vm.todateParameter.defaultValue = vm.toDateValue = null;
        vm.reportForm.$setPristine();
        vm.reportForm.$setUntouched();
      };

      const clearFilterCall = $scope.$on('clearFilterCall', () => {
        // if Condition only till RDLC Report Clear Filter Exists.
        if (vm.reportData && vm.reportData.fileName) {
          vm.clearFilter();
        }
      });

      $scope.$on('$destroy', () => {
        clearFilterCall();
      });

      //Set as current form when page loaded
      angular.element(() => {
        //BaseService.currentPageForms = [vm.reportForm];
      });
    }
  }
})();
