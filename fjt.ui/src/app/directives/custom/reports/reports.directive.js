(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('reports', reports);

  /** @ngInject */
  function reports($timeout, $q, $mdDialog, $filter, CORE, USER, REPORTS, DialogFactory, BaseService, EmployeeFactory, MasterFactory, ReportMasterFactory, ManageMFGCodePopupFactory, RFQSettingFactory, ComponentFactory, NotificationFactory, DYNAMIC_REPORTS) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        reportData: '=',
        isDesignerPage: '=',
        isPublishReport: '=',
        stateParamsDet: '='
      },
      templateUrl: 'app/directives/custom/reports/reports.html',
      controller: reportsctrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    /**
    * @param
    */

    function reportsctrl($scope) {
      var vm = this;
      vm.isUpdatable = $scope.isDesignerPage ? true : false;
      vm.isDesignReport = $scope.isDesignerPage;
      // vm.isPrinted = $scope.isDesignerPage;
      vm.isCopyReport = $scope.isDesignerPage;
      vm.isPublishReport = $scope.isPublishReport;

      vm.isViewReport = false;
      vm.isFilterReport = true;
      vm.EmptyMesssage = REPORTS.REPORTS_EMPTYSTATE.REPORT_SETTING;
      vm.StatusOptionsGridHeaderDropdown = CORE.StatusGridHeaderDropdown;
      vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
      vm.CORE_ReportParameterFilterDbColumnName = CORE.ReportParameterFilterDbColumnName;
      vm.reportTypeDropdownForFilter = REPORTS.reportTypeGridHeaderDropdown;
      vm.gridConfig = CORE.gridConfig;
      vm.LabelConstant = CORE.LabelConstant;
      vm.setScrollClass = 'gridScrollHeight_Bom';
      vm.reportStatus = CORE.ReportStatusGridHeaderDropdown;
      vm.systemGenerated = CORE.systemGeneratedGridHeaderDropdown;
      vm.loginUser = BaseService.loginUser;
      vm.userId = vm.loginUser.userid;
      vm.roleId = vm.loginUser.defaultLoginRoleID;
      vm.selectedReportData = {};
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      vm.getReportStatusClassName = (status) => BaseService.getReportStatusClassName(status);
      vm.getsystemGeneratedStatusClassName = (isSystemGenerated) => BaseService.getsystemGeneratedStatusClassName(Number(isSystemGenerated));
      /* BT - Used in RDLC Report Parameter flow. */
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.PartCategory = CORE.PartCategory;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.REPORT_FILTER_FIELD_OPTIONS = REPORTS.REPORT_FILTER_FIELD_OPTIONS;
      vm.selectedPartList = [];
      const allRadioButtonFilters = REPORTS.ReportRadioButtonOption;
      /* BT -E */

      let actionHeader = [];
      let defualtHeader = [];
      if ($scope.isDesignerPage) {
        actionHeader = [{
          field: 'Action',
          cellClass: 'gridCellColor',
          displayName: 'Action',
          width: '155',
          cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="4"></grid-action-view>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false,
          pinnedLeft: true
        }];
      }
      defualtHeader = [{
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false,
        allowCellFocus: false,
        enableCellEdit: false
      },
      {
        field: 'startActivityDate',
        displayName: 'Activity Started From (HH:MM:SS)',
        //cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        cellTemplate: '<div class="ui-grid-cell-contents flex layout-align-center-center" ng-if="row.entity.startActivityDate"><label flex="100" layout-align="start center" layout="row" class="label-box label-warning">{{row.entity.currentTimerDiff}}</label><img class="ml-5 h-22 w-22" src="../../../../../assets/images/logos/stop.png" ng-click="grid.appScope.$parent.vm.stopReportActivity(row.entity);" ng-if = "!row.entity.isDisabledDesignReport" title="Stop Activity"></div>',
        width: 150,
        type: 'date',
        enableCellEdit: false,
        enableFiltering: false,
        exporterSuppressExport: true
      },
      {
        field: 'activityStartBy',
        displayName: 'Activity Start By',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        enableCellEdit: false,
        enableFiltering: true
      },
      {
        field: 'reportName',
        displayName: 'Report Name',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '400',
        enableCellEdit: false,
        allowCellFocus: false
      },
      {
        field: 'category',
        displayName: 'Category',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '400',
        enableCellEdit: false,
        allowCellFocus: false
      },
      {
        field: 'reportTypeConvertedvalue',
        displayName: 'Report Type',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                      ng-class="{\'label-success\':row.entity.reportViewType == true, \
                      \'label-warning\':row.entity.reportViewType == false}"> \
                          {{ COL_FIELD}}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.reportTypeDropdownForFilter,
          width: 150
        },
        enableCellEdit: false,
        allowCellFocus: false
      },
      {
        field: 'reportVersion',
        displayName: 'Report Version',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 140,
        enableCellEdit: false,
        enableFiltering: true
      },
      {
        field: 'cloneFrom',
        displayName: 'Copy From',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '150',
        enableCellEdit: false,
        enableFiltering: true,
        allowCellFocus: false
      },
      {
        field: 'additionalNotes',
        displayName: 'Additional Notes' + CORE.Modify_Grid_column_Allow_Change_Message,
        cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
          '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
          '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.additionalNotes && row.entity.additionalNotes !== \'-\'" ng-click="grid.appScope.$parent.vm.showAdditionalNotes(row.entity, $event)">' +
          '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
          '<md-tooltip>View</md-tooltip>' +
          '</button>' +
          '</div>',
        width: '300',
        enableCellEdit: true,
        validators: { required: false }
      },
      {
        field: 'updatedAtvalue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false,
        enableCellEdit: false,
        visible: false
      }, {
        field: 'updatedbyvalue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableCellEdit: false,
        enableFiltering: true,
        visible: false
      }, {
        field: 'updatedbyRolevalue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableCellEdit: false,
        enableFiltering: true,
        visible: false
      }, {
        field: 'createdAtvalue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableCellEdit: false,
        enableFiltering: false
      }, {
        field: 'createdbyvalue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableSorting: true,
        enableCellEdit: false,
        enableFiltering: true
      }, {
        field: 'createdbyRolevalue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        enableCellEdit: false,
        visible: false
      }];
      actionHeader = actionHeader.concat(defualtHeader);
      if ($scope.isDesignerPage) {
        const entityGridCol = {
          field: 'entityName',
          displayName: 'Entity (Transaction)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '150',
          enableCellEdit: false,
          allowCellFocus: false
        };
        const statusGridCol = {
          field: 'statusConvertedValue',
          displayName: 'Status',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getReportStatusClassName(row.entity.status)">'
            + '{{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.reportStatus,
            width: 150
          },
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true
        };
        const systemGeneratedGridCol = {
          field: 'systemGenerated',
          displayName: 'System Generated',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getsystemGeneratedStatusClassName(row.entity.isSystemGenerated)">'
            + '{{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.systemGenerated,
            width: 150
          },
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true
        };

        actionHeader.splice(6, 0, entityGridCol);
        actionHeader.splice(2, 0, statusGridCol);
        actionHeader.splice(11, 0, systemGeneratedGridCol);
      }
      vm.sourceHeader = actionHeader;

      /* to display Additionalnotes */
      vm.showAdditionalNotes = (row, ev) => {
        const popupData = {
          title: 'Additional Notes',
          description: row.additionalNotes
        };
        showDescription(popupData, ev);
      };

      const showDescription = (popupData, ev) => {
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          popupData).then(() => {
          }, (err) => BaseService.getErrorLog(err));
      };

      /* BT  - Used in RDLC Report Parameter flow. */
      vm.startTimeOptions = {
        checkoutTimeOpenFlag: false,
        appendToBody: true
      };
      vm.endTimeOptions = {
        endTimeOpenFlag: false,
        appendToBody: true
      };
      vm.managefromTime = (new Date()).setHours(9, 0, 0); //Default Start time 9:00AM
      vm.managetoTime = (new Date()).setHours(18, 30, 0); //Default end time 6:30 PM
      // get customer List
      vm.getCustomerList = () => {
        const queryObj = {
          isCustomerCodeRequired: false
        };
        return MasterFactory.getCustomerList().query(queryObj).$promise.then((customer) => {
          if (customer && customer.data) {
            _.each(customer.data, (item) => item.companyName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName));
            vm.CustomerList = customer.data;
          }
          return $q.resolve(vm.CustomerList);
        }).catch((error) => BaseService.getErrorLog(error));
      };
      // get assy list based on customer
      vm.getAssyList = (customer) => {
        let customerID = null;
        if (!customer) {
          if (vm.autoCompleteCustomer && vm.autoCompleteCustomer.keyColumnId) {
            customerID = vm.autoCompleteCustomer.keyColumnId;
          }
        } else {
          customerID = customer;
        }
        return MasterFactory.getAssyPartList().query({ customerID: customerID }).$promise.then((response) => {
          vm.AssemblyList = (response && response.data) ? response.data : [];
          return $q.resolve(vm.AssemblyList);
        }).catch((error) => BaseService.getErrorLog(error));
      };
      // get Supplier List
      vm.getSupplierList = () => {
        var searchObj = { type: 'dist' };
        return ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((Supplier) => {
          if (Supplier && Supplier.data) {
            vm.SupplierList = Supplier.data;
          }
          return $q.resolve(vm.SupplierList);
        }).catch((error) => BaseService.getErrorLog(error));
      };
      // get Manufacturer List
      vm.getManufacturerList = () => {
        var searchObj = { type: 'mfg' };
        return ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((Manufacturer) => {
          if (Manufacturer && Manufacturer.data) {
            vm.ManufacturerList = Manufacturer.data;
          }
          return $q.resolve(vm.ManufacturerList);
        }).catch((error) => BaseService.getErrorLog(error));
      };
      //get list for part status
      vm.getPartStatusList = () => RFQSettingFactory.getPartStatusList().query().$promise.then((partstatus) => {
        vm.PartStatusList = (partstatus && partstatus.data) ? partstatus.data : [];
        return $q.resolve(vm.PartStatusList);
      }).catch((error) => BaseService.getErrorLog(error));

      // get list for Mounting Type
      vm.getMountingTypeList = () => ComponentFactory.getMountingTypeList().query().$promise.then((res) => {
        vm.MountingTypeList = (res && res.data) ? res.data : [];
        return $q.resolve(vm.MountingTypeList);
      }).catch((error) => BaseService.getErrorLog(error));

      /// get list for Functional Type
      vm.getFunctionalTypeList = () => ComponentFactory.getPartTypeList().query().$promise.then((res) => {
        vm.FunctionalTypeList = (res && res.data) ? res.data : [];
        return $q.resolve(vm.FunctionalTypeList);
      }).catch((error) => BaseService.getErrorLog(error));

      // get employee List
      vm.getemployeeList = () => EmployeeFactory.employeeList().query().$promise.then((employees) => {
        vm.employeeList = (employees && employees.data) ? angular.copy(employees.data) : [];
        _.each(vm.employeeList, (item) => {
          item.EmployeeName = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, item.initialName, item.firstName, item.lastName);
        });
        return $q.resolve(vm.employeeList);
      }).catch((error) => BaseService.getErrorLog(error));

      // get Operation List
      vm.getOperationList = () => MasterFactory.getAllOperationDetail().query().$promise.then((response) => {
        vm.OperationList = (response && response.data) ? response.data : [];
        _.each(vm.OperationList, (opItem) => {
          opItem.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, opItem.opName, opItem.opNumber);
        });
        return $q.resolve(vm.OperationList);
      }).catch((error) => BaseService.getErrorLog(error));

      // get work order List
      vm.getWorkOrderList = () => MasterFactory.getAllWorkOrderDetail().query().$promise.then((response) => {
        vm.WorkorderList = (response && response.data) ? response.data : [];
        return $q.resolve(vm.WorkorderList);
      }).catch((error) => BaseService.getErrorLog(error));

      // get selected Customer details
      const getcustomerdetail = (item) => {
        if (item) {
          vm.customer = item.companyName;
          vm.autoCompleteCustomer.keyColumnId = item.id;
          vm.getAssyList();
        } else {
          vm.customer = null;
          vm.autoCompleteCustomer.keyColumnId = null;
          vm.assyList = [];
          vm.clearAssemblyFilter();
          vm.getAssyList();
        }
      };

      vm.fromDateChanged = () => {
        if (vm.toDate && vm.fromDate) {
          vm.toDate = vm.toDate ? $filter('date')(new Date(vm.toDate), vm.DefaultDateFormat) : null;
          vm.fromDate = vm.fromDate ? $filter('date')(new Date(vm.fromDate), vm.DefaultDateFormat) : null;
          if (new Date(vm.fromDate) > new Date(vm.toDate)) {
            vm.toDate = null;
          }
          vm.fromDateOptions = {
            fromDateOpenFlag: false
          };
        }
      };

      vm.toDateChanged = () => {
        if (vm.toDate && vm.fromDate) {
          vm.toDate = vm.toDate ? $filter('date')(new Date(vm.toDate), vm.DefaultDateFormat) : null;
          vm.fromDate = vm.fromDate ? $filter('date')(new Date(vm.fromDate), vm.DefaultDateFormat) : null;
          if (new Date(vm.fromDate) > new Date(vm.toDate)) {
            vm.fromDate = null;
          }
          vm.toDateOptions = {
            toDateOpenFlag: false
          };
        }
      };

      function getPartSearch(searchObj) {
        return ComponentFactory.getComponentMFGAliasSearch().query({ listObj: searchObj }).$promise.then((partList) => {
          if (partList && partList.data.data) {
            vm.partSearchList = partList.data.data;
          }
          else {
            vm.partSearchList = [];
          }
          return vm.partSearchList;
        }).catch((error) => BaseService.getErrorLog(error));
      }

      const initAutoComplete = () => {
        vm.autoCompleteCustomer = {
          columnName: 'companyName',
          keyColumnName: 'id',
          keyColumnId: null,
          inputName: 'Customer',
          placeholderName: 'Customer',
          callbackFn: vm.getCustomerList,
          onSelectCallbackFn: getcustomerdetail
        },
          vm.autoCompleteManufacturer = {
            columnName: 'mfgCodeName',
            keyColumnName: 'id',
            keyColumnId: null,
            inputName: 'Manufacturer',
            placeholderName: 'Manufacturer',
            callbackFn: vm.getManufacturerList
          },
          vm.autoCompleteSupplier = {
            columnName: 'mfgCodeName',
            keyColumnName: 'id',
            keyColumnId: null,
            inputName: 'Supplier',
            placeholderName: 'Supplier',
            callbackFn: vm.getSupplierList
          },
          vm.autoCompleteFunctionalType = {
            columnName: 'partTypeName',
            keyColumnName: 'id',
            keyColumnId: null,
            inputName: 'Functional Type',
            placeholderName: 'Functional Type',
            callbackFn: vm.getFunctionalTypeList
          },
          vm.autoCompleteMountingType = {
            columnName: 'name',
            keyColumnName: 'id',
            keyColumnId: null,
            inputName: 'Mounting Type',
            placeholderName: 'Mounting Type',
            callbackFn: vm.getMountingTypeList
          },
          vm.autoCompletePartStatus = {
            columnName: 'name',
            keyColumnName: 'id',
            keyColumnId: null,
            inputName: 'Part Status',
            placeholderName: 'Part Status',
            callbackFn: vm.getpartStatusList
          },
          vm.autoCompleteWorkOrder = {
            columnName: 'woNumber',
            keyColumnName: 'woID',
            keyColumnId: null,
            inputName: 'Work Order',
            placeholderName: 'Work Order',
            callbackFn: vm.getWorkOrderList
          },
          vm.autoCompleteOperation = {
            columnName: 'opName',
            keyColumnName: 'opID',
            keyColumnId: null,
            inputName: 'Operation',
            placeholderName: 'Operation',
            callbackFn: vm.getOperationList
          },
          vm.autoCompleteEmployee = {
            columnName: 'EmployeeName',
            keyColumnName: 'id',
            keyColumnId: null,
            inputName: 'Personal',
            placeholderName: 'Personal',
            callbackFn: vm.getemployeeList
          };
        vm.autoCompleteAssy = {
          columnName: 'PIDCode',
          keyColumnName: 'id',
          keyColumnId: null,
          inputName: 'Assembly',
          placeholderName: 'Assy ID',
          callbackFn: vm.getAssyList
        };
        vm.autoCompleteSearchPart = {
          columnName: 'mfgPN',
          keyColumnName: 'id',
          keyColumnId: null,
          inputName: 'SearchPart',
          placeholderName: 'Type here to search part',
          callbackFn: (obj) => {
            const searchObj = {
              id: obj.id,
              mfgType: CORE.MFG_TYPE.MFG,
              inputName: vm.autoCompleteSearchPart.inputName,
              isGoodPart: null
            };
            return getPartSearch(searchObj);
          },
          onSearchFn: (query) => {
            const searchObj = {
              mfgType: CORE.MFG_TYPE.MFG,
              query: query,
              inputName: vm.autoCompleteSearchPart.inputName,
              isGoodPart: null
            };
            return getPartSearch(searchObj);
          },
          onSelectCallbackFn: (obj) => {
            if (vm.reportData.partSelectType) {
              if (obj) {
                const isAlreadyexists = _.find(vm.selectedPartList, (objselectdpart) => objselectdpart.id === obj.id);
                if (!isAlreadyexists) {
                  vm.selectedPartList.push(obj);
                }
                vm.autoCompleteSearchPart.keyColumnId = null;
                $scope.$broadcast(vm.autoCompleteSearchPart.inputName + 'searchText', null);
              }
            }
          }
        };
      };
      /* BT -E */

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['reportName', 'ASC']],
          SearchColumns: []
        };
      };

      initPageInfo();

      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: true,
        enableFullRowSelection: false,
        enableFocusRowOnRowHeaderClick: true,
        enableRowSelection: true,
        multiSelect: false,
        enableSelectAll: false,
        noUnselect: true,
        //hideMultiDeleteButton: true,
        enableCellEdit: true,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Report.csv'
      };

      // to set data in grid after data is retrived from API in loadData() and getDataDown() function
      const setDataAfterGetAPICall = (Reports, isGetDataDown) => {
        if (Reports && Reports.data && Reports.data.Reports) {
          if (!isGetDataDown) {
            vm.sourceData = Reports.data.Reports;
            vm.currentdata = vm.sourceData.length;
            _.map(vm.sourceData, (data) => {
              if (parseInt(data.createdBy) === vm.loginUser.userid && data.isEndUserReport) {
                data.isDisabledDesignReport = data.reportGenerationType === CORE.REPORT_CATEGORY.TEMPLATE_REPORT; // false
                data.isDisabledConfigureFilterParameter = data.reportGenerationType === CORE.REPORT_CATEGORY.TEMPLATE_REPORT; // false
                data.isDisabledDelete = false;
              } else {
                data.isDisabledDesignReport = true;
                data.isDisabledConfigureFilterParameter = true;
                data.isDisabledDelete = true;
              }
              if (data.isEndUserReport) {
                data.isDisabledUpdate = data.reportGenerationType === CORE.REPORT_CATEGORY.TEMPLATE_REPORT; // false
                data.isDisabledViewReport = false;
              } else {
                data.isDisabledUpdate = true;
                data.isDisabledViewReport = true;
              }
              data.isDisabledCopyReport = data.reportGenerationType === CORE.REPORT_CATEGORY.TEMPLATE_REPORT; // false
            });
          }
          else if (Reports.data.Reports.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(Reports.data.Reports);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          // must set after new data comes
          vm.totalSourceDataCount = Reports.data.Count;
          if (!vm.gridOptions.enablePaging) {
            if (!isGetDataDown) {
              vm.gridOptions.gridApi.infiniteScroll.resetScroll();
            }
            else {
              vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
            }
          }
          if (!isGetDataDown) {
            vm.gridOptions.clearSelectedRows();
            if (!vm.isEditIntigrate && !vm.customerLOANotFound) {
              cellEdit();
            }
          }
          if (vm.totalSourceDataCount === 0) {
            if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.isNoDataFound = false;
              vm.emptyState = 0;
            }
            else {
              vm.isNoDataFound = true;
              vm.emptyState = null;
            }
          }
          else {
            vm.isNoDataFound = false;
            vm.emptyState = null;
          }
        }
      };

      /* retrieve Users list*/
      vm.loadData = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.pagingInfo.isDynamicReport = $scope.isDesignerPage ? $scope.isDesignerPage : false;
        vm.pagingInfo.isPublishReport = $scope.isPublishReport ? $scope.isPublishReport : false;
        vm.pagingInfo.isTemplateReport = ($scope.stateParamsDet && $scope.stateParamsDet.keywords === CORE.TEMPLATE_REPORTS_KEYWORD);
        $scope.$parent.vm.cgBusyLoading = ReportMasterFactory.retriveReport().query(vm.pagingInfo).$promise.then((Reports) => {
          if (Reports && Reports.status && Reports.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            setDataAfterGetAPICall(Reports, false);
            $timeout(() => {
              let selectedReport = null;
              if (vm.reportID > 0) {
                selectedReport = vm.sourceData.findIndex((a) => a.id === vm.reportID);
              }
              const firstReport = selectedReport && typeof (selectedReport) === 'number' && selectedReport > 0 ? vm.gridOptions.data[selectedReport] : _.head(vm.sourceData);
              if (firstReport) {
                if (firstReport.fileName) {
                  vm.selectedReportData = firstReport;
                  vm.getReportFilterParameterDetail(firstReport.id);
                }
                else {
                  /* BT  - Used in RDLC Report Parameter flow. */
                  vm.getReportDetail(firstReport.id);
                  /* BT -E */
                }
              }
              if (vm.gridOptions.data && vm.gridOptions.data.length > 0) {
                vm.gridOptions.gridApi.selection.selectRow(firstReport);
              }
              _.each(vm.sourceData, (item) => {
                if (item.startActivityDate) {
                  vm.startTimer(item);
                }
              });
            }, 1000);
            $timeout(() => {
              vm.resetSourceGrid();
              if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
                return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            });
          }
        }).catch((error) => {
          vm.reportID = null;
          return BaseService.getErrorLog(error);
        });
      };

      vm.startTimer = (data) => {
        data.currentTimerDiff = '';
        data.tickActivity = setInterval(() => {
          data.startActivityDate = data.startActivityDate + 1;
          data.currentTimerDiff = secondsToTime(data.startActivityDate, true);
        }, _configSecondTimeout);
      };

      //Update cell for LOA price
      function cellEdit() {
        vm.isEditIntigrate = true;
        vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
          var obj = _.find(vm.sourceData, (item) => item.id === rowEntity.id);
          var index = vm.sourceData.indexOf(obj);
          /* Comment By BT on 11-03-2021 (now user can not edit category on ui so.)*/
          //if (colDef.field === 'category') {
          //  if (newvalue !== oldvalue) {
          //    switch (colDef.name) {
          //      case 'category':
          //        if (newvalue.length <= 100) {
          //          vm.gridOptions.gridApi.grid.validate.setValid(vm.gridOptions.data[index], vm.gridOptions.columnDefs[2]);
          //          vm.gridOptions.data[index].category = newvalue;
          //        }
          //        else {
          //          vm.gridOptions.gridApi.grid.validate.setInvalid(vm.gridOptions.data[index], vm.gridOptions.columnDefs[2]);
          //          vm.gridOptions.data[index].category = newvalue;
          //        }
          //        break;
          //    }
          //    const invalidObj = _.find(vm.sourceData, (x) => (x.$$invalidcategory && x.$$invalidcategory === true));
          //    if (!invalidObj) {
          //      const reportModel = {
          //        id: rowEntity.id,
          //        category: newvalue
          //      };
          //      $scope.$parent.vm.cgBusyLoading = ReportMasterFactory.updateReportCategory().save(reportModel).$promise.then((res) => {
          //        if (res) {
          //          if (res.status === CORE.ApiResponseTypeStatus.FAILED || res.status === CORE.ApiResponseTypeStatus.EMPTY) {
          //            rowEntity.category = oldvalue;
          //          }
          //        }
          //      }).catch((error) => BaseService.getErrorLog(error));
          //    }
          //  }
          //}
          if (colDef.field === 'additionalNotes') {
            if (newvalue !== oldvalue) {
              switch (colDef.name) {
                case 'additionalNotes':
                  vm.gridOptions.data[index].additionalNotes = newvalue;
                  break;
              }
              if (newvalue && newvalue.length > 2000) {
                //show validation message no data selected
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MAX_LENGTH);
                messageContent.message = stringFormat(messageContent.message, newvalue.length, 2000);

                const alertModel = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(alertModel);
                const headerIndex = vm.sourceHeader.findIndex((item) => item.field === 'additionalNotes');
                vm.gridOptions.gridApi.grid.validate.setInvalid(rowEntity, vm.sourceHeader[headerIndex]);
              }
              else {
                const reportModel = {
                  id: rowEntity.id,
                  additionalNotes: newvalue
                };
                $scope.$parent.vm.cgBusyLoading = ReportMasterFactory.updateReportAdditionalNotes().save(reportModel).$promise.then((res) => {
                  if (res) {
                    if (res.status === CORE.ApiResponseTypeStatus.FAILED || res.status === CORE.ApiResponseTypeStatus.EMPTY) {
                      rowEntity.additionalNotes = oldvalue;
                    }
                  }
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }
          }
        });
      }

      /* load more data on mouse scroll */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        $scope.$parent.vm.cgBusyLoading = ReportMasterFactory.retriveReport().query(vm.pagingInfo).$promise.then((Reports) => {
          if (Reports && Reports.data) {
            setDataAfterGetAPICall(Reports, true);
            $timeout(() => {
              vm.resetSourceGrid();
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // delete Reports
      vm.deleteRecord = (Reports) => {
        let selectedIDs = [];
        if (Reports) {
          selectedIDs.push(Reports.id);
        } else {
          vm.selectedRows = vm.selectedRowsList;
          if (vm.selectedRows.length > 0) {
            selectedIDs = vm.selectedRows.map((ReportsItem) => ReportsItem.id);
          }
        }
        if (selectedIDs) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, 'Reports', selectedIDs.length);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          const objIDs = {
            id: selectedIDs,
            CountList: false
          };
          DialogFactory.messageConfirmDialog(obj).then((resposne) => {
            if (resposne) {
              $scope.$parent.vm.cgBusyLoading = ReportMasterFactory.deleteReports().query({ objIDs: objIDs }).$promise.then((data) => {
                if (data && data.data && (data.data.length > 0 || data.data.transactionDetails)) {
                  const data = {
                    TotalCount: data.data.transactionDetails[0].TotalCount
                  };
                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const IDs = {
                      id: selectedIDs,
                      CountList: true
                    };
                    return ReportMasterFactory.deleteReports().query({ objIDs: IDs }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.pageTitle = Reports ? Reports.name : null;
                      data.PageName = CORE.PageName.job_type;
                      data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                      if (res.data) {
                        DialogFactory.dialogService(
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                          ev,
                          data).then(() => {
                          }, () => {
                          });
                      }
                    }).catch((error) => BaseService.getErrorLog(error));
                  });
                }
                else if (data && data.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.gridOptions.clearSelectedRows();
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          //show validation message no data selected
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
          messageContent.message = stringFormat(messageContent.message, 'Reports');

          const alertModel = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(alertModel);
        }
      };

      /* delete multiple data called from directive of ui-grid */
      vm.deleteMultipleData = () => {
        vm.deleteRecord();
      };

      vm.getSelectedRow = (row) => {
        if (row && row.id) {
          if (row.fileName) {
            vm.selectedReportData = row;
            vm.getReportFilterParameterDetail(row.id);
          }
          else {
            /* BT  - Used in RDLC Report Parameter flow. */
            vm.getReportDetail(row.id);
            /* BT -E */
          }
        }
      };

      /* BT - Used in RDLC Report Parameter flow. */
      vm.removeselection = (x) => {
        if (x) {
          const isAlreadyexists = _.find(vm.selectedPartList, (objselectdpart) => objselectdpart.id === x.id);
          if (isAlreadyexists) {
            vm.selectedPartList.splice(vm.selectedPartList.indexOf(isAlreadyexists), 1);
          }
        }
      };
      //[s] clear Filters
      vm.clearFilter = () => {
        vm.clearManufacturerFilter();
        vm.clearPartFilter();
        vm.clearCustomerFilter();
        vm.clearEmployeeFilter();
        vm.clearMountingTypeFilter();
        vm.clearFunctionalTypeFilter();
        vm.clearPartStatusFilter();
        vm.clearWorkOrderFilter();
        vm.clearOperationFilter();
        vm.clearAssemblyFilter();
        vm.clearSupplierFilter();
        vm.clearDetailFilter();
      };
      vm.clearDetailFilter = () => {
        var autocompletePromise = [];
        if (vm.reportData.customerID && (vm.CustomerList && vm.CustomerList.length > 0)) {
          vm.autoCompleteCustomer.keyColumnId = null;
          $scope.$broadcast(vm.autoCompleteCustomer.inputName + 'searchText', null);
          autocompletePromise.push(vm.getCustomerList());
        } if (vm.reportData.supplierID && (vm.SupplierList && vm.SupplierList.length > 0)) {
          vm.autoCompleteSupplier.keyColumnId = null;
          $scope.$broadcast(vm.autoCompleteSupplier.inputName + 'searchText', null);
          autocompletePromise.push(vm.getSupplierList());
        } if (vm.reportData.mfgCodeID && (vm.ManufacturerList && vm.ManufacturerList.length > 0)) {
          vm.autoCompleteManufacturer.keyColumnId = null;
          $scope.$broadcast(vm.autoCompleteManufacturer.inputName + 'searchText', null);
          autocompletePromise.push(vm.getManufacturerList());
        } if (vm.reportData.employeeID && (vm.employeeList && vm.employeeList.length > 0)) {
          vm.autoCompleteEmployee.keyColumnId = null;
          $scope.$broadcast(vm.autoCompleteEmployee.inputName + 'searchText', null);
          autocompletePromise.push(vm.getemployeeList());
        } if (vm.reportData.mountingTypeID && (vm.MountingTypeList && vm.MountingTypeList.length > 0)) {
          vm.autoCompleteMountingType.keyColumnId = null;
          $scope.$broadcast(vm.autoCompleteMountingType.inputName + 'searchText', null);
          autocompletePromise.push(vm.getMountingTypeList());
        } if (vm.reportData.functionalTypeID && (vm.FunctionalTypeList && vm.FunctionalTypeList.length > 0)) {
          vm.autoCompleteFunctionalType.keyColumnId = null;
          $scope.$broadcast(vm.autoCompleteFunctionalType.inputName + 'searchText', null);
          autocompletePromise.push(vm.getFunctionalTypeList());
        } if (vm.reportData.partStatusID && (vm.PartStatusList && vm.PartStatusList.length > 0)) {
          vm.autoCompletePartStatus.keyColumnId = null;
          $scope.$broadcast(vm.autoCompletePartStatus.inputName + 'searchText', null);
          autocompletePromise.push(vm.getPartStatusList());
        } if (vm.reportData.workorderID && (vm.WorkOrderList && vm.WorkOrderList.length > 0)) {
          vm.autoCompleteWorkOrder.keyColumnId = null;
          $scope.$broadcast(vm.autoCompleteWorkOrder.inputName + 'searchText', null);
          autocompletePromise.push(vm.getWorkOrderList());
        } if (vm.reportData.operationID && (vm.OperationList && vm.OperationList.length > 0)) {
          vm.autoCompleteOperation.keyColumnId = null;
          $scope.$broadcast(vm.autoCompleteOperation.inputName + 'searchText', null);
          autocompletePromise.push(vm.getOperationList());
        } if (vm.reportData.assyID && (vm.AssemblyList && vm.AssemblyList.length > 0)) {
          vm.autoCompleteAssy.keyColumnId = null;
          $scope.$broadcast(vm.autoCompleteAssy.inputName + 'searchText', null);
          autocompletePromise.push(vm.getAssyList());
        } if (vm.reportData.radioButtonFilter) {
          vm.rbSelectedFilter = allRadioButtonFilters.RadioButtonNoneValue;
        }
        vm.autoCompleteSearchPart.keyColumnId = null;
        $scope.$broadcast(vm.autoCompleteSearchPart.inputName + 'searchText', null);
        vm.fromDate = null;
        vm.toDate = null;
        $scope.$parent.vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
          initAutoComplete();
        }).catch((error) => BaseService.getErrorLog(error));
      };
      // clear part filter
      vm.clearPartFilter = () => {
        vm.partModel = [];
        vm.selectedPartList = [];
        vm.setSelectedFilterValues();
      };
      // clear customer filter
      vm.clearCustomerFilter = () => {
        vm.CustomerModel = [];
        vm.setSelectedFilterValues();
      };
      // clear employee filter
      vm.clearEmployeeFilter = () => {
        vm.EmployeeModel = [];
        vm.setSelectedFilterValues();
      };
      // clear mounting type filter
      vm.clearMountingTypeFilter = () => {
        vm.MountingTypeModel = [];
        vm.setSelectedFilterValues();
      };
      // clear functional type filter
      vm.clearFunctionalTypeFilter = () => {
        vm.FunctionalTypeModel = [];
        vm.setSelectedFilterValues();
      };
      // clear part status filter
      vm.clearPartStatusFilter = () => {
        vm.PartStatusModel = [];
        vm.setSelectedFilterValues();
      };
      // clear work order filter
      vm.clearWorkOrderFilter = () => {
        vm.WorkOrderModel = [];
        vm.setSelectedFilterValues();
      };
      // clear operation filter
      vm.clearOperationFilter = () => {
        vm.OperationModel = [];
        vm.setSelectedFilterValues();
      };
      // clear Assembly filter
      vm.clearAssemblyFilter = () => {
        vm.AssemblyModel = [];
        vm.setSelectedFilterValues();
      };
      // clear manufacturer filter
      vm.clearManufacturerFilter = () => {
        vm.ManufacturerModel = [];
        vm.setSelectedFilterValues();
      };
      // clear supplier filter
      vm.clearSupplierFilter = () => {
        vm.SupplierModel = [];
        vm.setSelectedFilterValues();
      };

      vm.setSelectedFilterValues = (iscustomer) => {
        var returnObject = getSelectedFilters();

        if ($scope.advancedFilterOptions) {
          $scope.advancedFilterOptions = returnObject;
        }
        $timeout(() => {
          if (iscustomer && vm.reportData.assyID) {
            const customer = vm.CustomerModel.join();
            vm.getAssyList(customer);
          }
        });
      };
      // [e] clear Filters

      function getSelectedFilters() {
        var returnObject = [];
        returnObject.Model = vm.mfgCodeDetailModel;
        returnObject.CustomerModel = vm.CustomerModel;
        returnObject.componentOrdering = vm.componentOrderingModel;
        if (vm.attributesSearch && !vm.isMultiplePart) {
          returnObject.attributesSearch = vm.attributesSearch.replace(/\"/g, '\\"').replace(/\'/g, "\\'");
        }
        if (vm.isMultiplePart && vm.multiplePartNumbers) {
          returnObject.multiplePartNumbers = vm.multiplePartNumbers;
          returnObject.multiplePartNumbers = _.map(vm.multiplePartNumbers, (item) => item.replace(/\"/g, '\\"').replace(/\'/g, "\\'"));
        }
        return returnObject;
      }
      /* BT -E */

      // get parameter mapping details
      vm.getReportFilterParameterDetail = (reportID) => {
        vm.bindFilterParameter = false;
        // null Rdlc report data.
        vm.reportData = null;
        if (reportID) {
          vm.dataelementList = null;
          $scope.$parent.vm.cgBusyLoading = ReportMasterFactory.retriveReportFilterParameterDetail({ id: reportID }).query().$promise.then((res) => {
            if (res && res.data) {
              vm.dataelementList = res.data;
              vm.selectedReportData.anyFilterApplied = vm.dataelementList.length === 0 ? false : true;
              $scope.reportData = vm.selectedReportData;
            }
            vm.bindFilterParameter = true;
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      /* BT - Used in RDLC Report Parameter flow. */
      vm.getReportDetail = (reportID) => {
        if (reportID) {
          vm.bindFilterParameter = false;
          /* Parameter from  repotrmasterparameter -s */
          $scope.$parent.vm.cgBusyLoading = ReportMasterFactory.retriveReportFilterParameterDetail({ id: reportID }).query().$promise.then((res) => {
            if (res && res.data) {
              vm.dataelementList = res.data;
            }
          }).catch((error) => BaseService.getErrorLog(error));
          /* -E */
          /* old flow */
          $scope.$parent.vm.cgBusyLoading = ReportMasterFactory.retriveReportById({ id: reportID }).query().$promise.then((res) => {
            if (res && res.data) {
              vm.reportID = res.data.id;
              vm.reportData = res.data;
              $scope.reportData = vm.selectedReportData = vm.reportData;
              const autocompletePromise = [];

              if (vm.reportData.customerID && !(vm.CustomerList && vm.CustomerList.length > 0)) {
                autocompletePromise.push(vm.getCustomerList());
              } if (vm.reportData.supplierID && !(vm.SupplierList && vm.SupplierList.length > 0)) {
                autocompletePromise.push(vm.getSupplierList());
              } if (vm.reportData.mfgCodeID && !(vm.ManufacturerList && vm.ManufacturerList.length > 0)) {
                autocompletePromise.push(vm.getManufacturerList());
              } if (vm.reportData.employeeID && !(vm.employeeList && vm.employeeList.length > 0)) {
                autocompletePromise.push(vm.getemployeeList());
              } if (vm.reportData.mountingTypeID && !(vm.MountingTypeList && vm.MountingTypeList.length > 0)) {
                autocompletePromise.push(vm.getMountingTypeList());
              } if (vm.reportData.functionalTypeID && !(vm.FunctionalTypeList && vm.FunctionalTypeList.length > 0)) {
                autocompletePromise.push(vm.getFunctionalTypeList());
              } if (vm.reportData.partStatusID && !(vm.PartStatusList && vm.PartStatusList.length > 0)) {
                autocompletePromise.push(vm.getPartStatusList());
              } if (vm.reportData.workorderID && !(vm.WorkOrderList && vm.WorkOrderList.length > 0)) {
                autocompletePromise.push(vm.getWorkOrderList());
              } if (vm.reportData.operationID && !(vm.OperationList && vm.OperationList.length > 0)) {
                autocompletePromise.push(vm.getOperationList());
              } if (vm.reportData.assyID && !(vm.AssemblyList && vm.AssemblyList.length > 0)) {
                autocompletePromise.push(vm.getAssyList());
              }

              $scope.$parent.vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
                $scope.$parent.vm.cgBusyLoading = $timeout(() => {
                  initAutoComplete();
                  vm.clearFilter();
                  $('#customerselect,#supplierselect,#manufacturerselect,#partstatusselect,#mountingtypeselect,#functionaltypeselect,#workorderselect,#operationselect,#employeeselect').removeAttr('disabled');
                  if (!vm.reportData.customerID && !vm.reportData.customerSelectType) {
                    $('#customerselect').attr('disabled', 'disabled');
                  } if (!vm.reportData.supplierID && !vm.reportData.supplierSelectType) {
                    $('#supplierselect').attr('disabled', 'disabled');
                  } if (!vm.reportData.mfgCodeID && !vm.reportData.mfgCodeSelectType) {
                    $('#manufacturerselect').attr('disabled', 'disabled');
                  } if (!vm.reportData.employeeID && !vm.reportData.employeeSelectType) {
                    $('#employeeselect').attr('disabled', 'disabled');
                  } if (!vm.reportData.assyID && !vm.reportData.assySelectType) {
                    $('#manufacturerselect').attr('disabled', 'disabled');
                  } if (!vm.reportData.mountingTypeID && !vm.reportData.mountingTypeSelectType) {
                    $('#mountingtypeselect').attr('disabled', 'disabled');
                  } if (!vm.reportData.functionalTypeID && !vm.reportData.functionalTypeSelectType) {
                    $('#functionaltypeselect').attr('disabled', 'disabled');
                  } if (!vm.reportData.partStatusID && !vm.reportData.partStatusSelectType) {
                    $('#partstatusselect').attr('disabled', 'disabled');
                  } if (!vm.reportData.workorderID && !vm.reportData.workorderSelectType) {
                    $('#workorderselect').attr('disabled', 'disabled');
                  } if (!vm.reportData.operationID && !vm.reportData.operationSelectType) {
                    $('#operationselect').attr('disabled', 'disabled');
                  }
                  if (vm.reportData.fromDate && vm.reportData.toDate) {
                    vm.toDate = new Date();
                    vm.fromDate = new Date();
                    vm.fromDate.setDate(vm.fromDate.getDate() - 30);
                  }
                  if ((vm.reportData.operationID && vm.reportData.operationSelectType) || (vm.reportData.workorderID && vm.reportData.workorderSelectType) || (vm.reportData.partStatusID && vm.reportData.partStatusSelectType)
                    || (vm.reportData.functionalTypeID && vm.reportData.functionalTypeSelectType) || (vm.reportData.customerID && vm.reportData.customerSelectType) || (vm.reportData.mountingTypeID && vm.reportData.mountingTypeSelectType)
                    || (vm.reportData.assyID && vm.reportData.assySelectType) || (vm.reportData.employeeID && vm.reportData.employeeSelectType) || (vm.reportData.mfgCodeID && vm.reportData.mfgCodeSelectType)
                    || (vm.reportData.supplierID && vm.reportData.supplierSelectType) || (vm.reportData.partID && vm.reportData.partSelectType)) {
                    vm.noMultifilterApply = false;
                  } else {
                    vm.noMultifilterApply = true;
                  }
                  if ((vm.reportData.operationID && !vm.reportData.operationSelectType) || (vm.reportData.workorderID && !vm.reportData.workorderSelectType) || (vm.reportData.partStatusID && !vm.reportData.partStatusSelectType)
                    || (vm.reportData.functionalTypeID && !vm.reportData.functionalTypeSelectType) || (vm.reportData.customerID && !vm.reportData.customerSelectType) || (vm.reportData.mountingTypeID && !vm.reportData.mountingTypeSelectType)
                    || (vm.reportData.assyID && !vm.reportData.assySelectType) || (vm.reportData.employeeID && !vm.reportData.employeeSelectType) || (vm.reportData.mfgCodeID && !vm.reportData.mfgCodeSelectType)
                    || (vm.reportData.supplierID && !vm.reportData.supplierSelectType) || (vm.reportData.fromDate) || (vm.reportData.toDate) || (vm.reportData.partID)) {
                    vm.noSinglefilterApply = false;
                  } else {
                    vm.noSinglefilterApply = true;
                  }
                  if (vm.reportData.radioButtonFilter) {
                    switch (vm.reportData.reportName) {
                      /* EXtra Note - 1.we can not mange report name 2.if we copy that report then? */
                      case REPORTS.ReportList.ObsoletePartReport:
                        vm.rbFilterOption = allRadioButtonFilters.ObsoletePartReportOption;
                        vm.rbSelectedFilter = vm.rbFilterOption[0].value;
                        break;
                      default:
                        vm.rbFilterOption = [];
                        break;
                    }
                  }
                }, 100);
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      /* BT -E */

      vm.generatereport = (form, isDownload, ev, isCSVDownload) => {
        if (form && form.$invalid) {
          vm.setValidateOnClick = true;
          BaseService.focusRequiredField(form);
          return;
        }
        vm.empPerform = false;
        if (vm.selectedReportData.fileName) {
          const dataelementList = angular.copy(vm.dataelementList);
          const reportmodel = angular.copy(vm.selectedReportData);
          var parameterValueJson = '';
          _.each(dataelementList, (itemElementData) => {
            const parameterDataType = itemElementData.ReportParameterSettingMapping.type;
            if (itemElementData.defaultValue) {
              switch (parameterDataType) {
                case CORE.INPUT_TYPES.MULTI_SELECTION:
                  itemElementData.defaultValue = itemElementData.defaultValue.join();
                  break;
                case CORE.INPUT_TYPES.AUTOCOMPLETE_WITH_MULTISELCTION:
                  {
                    const paramValue = [];
                    const keyColumnName = [itemElementData.ReportParameterSettingMapping.FixedEntityDataelement.displayColumnPKField];
                    _.each(itemElementData.defaultValue, (item) => {
                      paramValue.push(item[keyColumnName]);
                    });
                    itemElementData.defaultValue = paramValue.join();
                  }
                  break;
                case CORE.INPUT_TYPES.DATE_PICKER:
                case 'dateRange':
                  itemElementData.defaultValue = $filter('date')(itemElementData.defaultValue, CORE.MySql_Store_Date_Format);
                  break;
                case CORE.INPUT_TYPES.TIME_PICKER:
                  itemElementData.defaultValue = $filter('date')(itemElementData.defaultValue, CORE.MySql_Store_Time_Format);
                  break;
                case CORE.INPUT_TYPES.MULTISELECT_CHECKBOX:
                  {
                    var checkboxValue = '';
                    _.each(itemElementData.fieldValue, (item) => {
                      checkboxValue += stringFormat(", '{0}':'{1}'", item.Key, item.defaultValue);
                    });
                    itemElementData.defaultValue = angular.copy(checkboxValue.slice(1));
                  }
                  break;
              }
              parameterValueJson += stringFormat(', "{0}":"{1}"', itemElementData.ReportParameterSettingMapping.dbColumnName, itemElementData.defaultValue);
            }
          });
          reportmodel.parameterValueJson = stringFormat('{{0}}', parameterValueJson.slice(1));
          const TimeStamp = $filter('date')(new Date(), CORE.DateFormatArray[0].format);
          reportmodel.reportName = vm.selectedReportData.reportName + ' ' + TimeStamp;
          vm.viewReport(reportmodel, isDownload);
        }
        else {
          const reportmodel = {};
          /* BT - Used in RDLC Report Parameter flow. */
          if (vm.reportData && !vm.reportData.fileName) {
            reportmodel.isEndUserReport = vm.reportData.isEndUserReport;
            if (vm.reportData.customerID && vm.reportData.customerSelectType) {
              reportmodel.customerID = vm.CustomerModel.join();
            } else if (vm.reportData.customerID && !vm.reportData.customerSelectType) {
              reportmodel.customerID = vm.autoCompleteCustomer.keyColumnId;
            }
            if (vm.reportData.supplierID && vm.reportData.supplierSelectType) {
              reportmodel.supplierID = vm.SupplierModel.join();
            } else if (vm.reportData.supplierID && !vm.reportData.supplierSelectType) {
              reportmodel.supplierID = vm.autoCompleteSupplier.keyColumnId;
            }
            if (vm.reportData.mfgCodeID && vm.reportData.mfgCodeSelectType) {
              reportmodel.mfgCodeID = vm.ManufacturerModel.join();
            } else if (vm.reportData.mfgCodeID && !vm.reportData.mfgCodeSelectType) {
              reportmodel.mfgCodeID = vm.autoCompleteManufacturer.keyColumnId;
            }
            if (vm.reportData.employeeID && vm.reportData.employeeSelectType) {
              reportmodel.employeeID = vm.EmployeeModel.join();
            } else if (vm.reportData.employeeID && !vm.reportData.employeeSelectType) {
              reportmodel.employeeID = vm.autoCompleteEmployee.keyColumnId;
            }
            if (vm.reportData.assyID && vm.reportData.assySelectType) {
              reportmodel.assyID = vm.AssemblyModel.join();
            } else if (vm.reportData.assyID && !vm.reportData.assySelectType) {
              reportmodel.assyID = vm.autoCompleteAssy.keyColumnId;
              const assy = _.find(vm.AssemblyList, (x) => x.id === vm.autoCompleteAssy.keyColumnId);
              if (assy) {
                reportmodel.assyPN = assy.mfgPN;
              }
            }
            if (vm.reportData.mountingTypeID && vm.reportData.mountingTypeSelectType) {
              reportmodel.mountingTypeID = vm.MountingTypeModel.join();
            } else if (vm.reportData.mountingTypeID && !vm.reportData.mountingTypeSelectType) {
              reportmodel.mountingTypeID = vm.autoCompleteMountingType.keyColumnId;
            }
            if (vm.reportData.functionalTypeID && vm.reportData.functionalTypeSelectType) {
              reportmodel.functionalTypeID = vm.FunctionalTypeModel.join();
            } else if (vm.reportData.functionalTypeID && !vm.reportData.functionalTypeSelectType) {
              reportmodel.functionalTypeID = vm.autoCompleteFunctionalType.keyColumnId;
            }
            if (vm.reportData.partStatusID && vm.reportData.partStatusSelectType) {
              reportmodel.partStatusID = vm.PartStatusModel.join();
            } else if (vm.reportData.partStatusID && !vm.reportData.partStatusSelectType) {
              reportmodel.partStatusID = vm.autoCompletePartStatus.keyColumnId;
            }
            if (vm.reportData.workorderID && vm.reportData.workorderSelectType) {
              reportmodel.workorderID = vm.WorkOrderModel.join();
            } else if (vm.reportData.workorderID && !vm.reportData.workorderSelectType) {
              reportmodel.workorderID = vm.autoCompleteWorkOrder.keyColumnId;
            }
            if (vm.reportData.operationID && vm.reportData.operationSelectType) {
              reportmodel.operationID = vm.OperationModel.join();
            } else if (vm.reportData.operationID && !vm.reportData.operationSelectType) {
              reportmodel.operationID = vm.autoCompleteOperation.keyColumnId;
            }
            if (vm.reportData.partID && vm.reportData.partSelectType) {
              reportmodel.partID = _.map(vm.selectedPartList, (x) => x.id).join();
            } else if (vm.reportData.partID && !vm.reportData.partSelectType) {
              reportmodel.partID = vm.autoCompleteSearchPart.keyColumnId;
            }
            if (vm.reportData.fromDate && vm.reportData.toDate) {
              reportmodel.toDate = vm.toDate ? $filter('date')(new Date(vm.toDate), CORE.MySql_Store_Date_Format) : null;
              reportmodel.fromDate = vm.fromDate ? $filter('date')(new Date(vm.fromDate), CORE.MySql_Store_Date_Format) : null;
              if (vm.reportData.reportName === 'Obsolete Part Details for Company') {
                if (date_diff_indays(vm.fromDate, vm.toDate) > 31) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DATE_RANGE_VALIDATION_MESSAGE);
                  messageContent.message = stringFormat(messageContent.message, 31);
                  NotificationFactory.error(messageContent.message);
                  return;
                }
              }
            }
            if (vm.reportData.fromTime && vm.reportData.toTime) {
              reportmodel.fromTime = vm.managefromTime;
              reportmodel.toTime = vm.managetoTime;
            }

            if (vm.reportData.isCSVReport) {
              reportmodel.isCSVReport = vm.reportData.isCSVReport;
              reportmodel.csvReportAPI = vm.reportData.csvReportAPI;
            }
            if (vm.reportData.radioButtonFilter) {
              reportmodel.selectedRadioButtonValue = vm.rbSelectedFilter;
              if (vm.rbSelectedFilter) {
                reportmodel.selectedRadioButtonName = _.find(vm.rbFilterOption, (x) => x.value === vm.rbSelectedFilter).name;
              }
            }
            reportmodel.loginUserEmployeeID = vm.loginUser.employee.id;
            reportmodel.reportAPI = vm.reportData.reportAPI;
            reportmodel.isExcel = vm.reportData.isExcel;
            reportmodel.reportName = vm.reportData.reportName;
            reportmodel.withAlternateParts = vm.withAlternateParts;
            //reportmodel.ECODFMRequestType = vm.reportData.ECODFMRequestType
            if (vm.reportData.rdlcReportFileName === REPORTS.PERSONNEL_REPORT_NAME && isDownload) {
              vm.empPerform = true;
              $timeout(() => { $scope.$broadcast('downloadEmpReport'); });
            } else if (vm.reportData.rdlcReportFileName === REPORTS.PERSONNEL_REPORT_NAME && !isDownload) {
              openEmployeePerformanceReport(ev);
            }
            else {
              generateReport(reportmodel, isDownload, isCSVDownload);
            }
          }
          /* -E */
        }
      };

      // Not called from anywhere.
      //vm.onTabChanges = () => {
      //  //vm.clearFilter();
      //};

      function generateReport(paramObj, isDownload, isCSVDownload) {
        if (paramObj.isExcel) {
          $scope.$parent.vm.cgBusyLoading = ReportMasterFactory.ExportExcel(paramObj).then((response) => {
            if (response.data) {
              // const assyName = paramObj.defaultName ? paramObj.defaultName : '';
              let assyName = '';
              if (paramObj.assyID) {
                assyName = _.find(vm.AssemblyList, { 'id': paramObj.assyID }).PIDCode;
              }
              const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
              const link = document.createElement('a');
              if (link.download !== undefined) {
                const TimeStamp = $filter('date')(new Date(), CORE.DateFormatArray[0].format);
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', vm.selectedReportData.reportName + assyName + TimeStamp);
                link.style = 'visibility:hidden';
                document.body.appendChild(link);
                $timeout(() => {
                  link.click();
                  document.body.removeChild(link);
                });
                $scope.$broadcast('clearFilterCall');
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else if (paramObj.isCSVReport && isCSVDownload) {
          $scope.$parent.vm.cgBusyLoading = ReportMasterFactory.generateCSVReport(paramObj).then((response) => {
            var model = {
              messageContent: '',
              multiple: true
            };
            if (response.status === 404) {
              model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
              DialogFactory.messageAlertDialog(model);
            } else if (response.status === 204) {
              model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NOCONTENT);
              DialogFactory.messageAlertDialog(model);
            } else if (response.status === 403) {
              model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
              DialogFactory.messageAlertDialog(model);
            } else if (response.status === 401) {
              model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
              DialogFactory.messageAlertDialog(model);
            } else if (response.status === -1) {
              model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_SERVICEUNAVAILABLE);
              DialogFactory.messageAlertDialog(model);
            } else {
              const blob = new Blob([response.data], { type: 'text/csv' });
              const link = document.createElement('a');
              if (link.download !== undefined) {
                const TimeStamp = $filter('date')(new Date(), CORE.DateFormatArray[0].format);
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', vm.selectedReportData.reportName + TimeStamp + '.csv');
                link.style = 'visibility:hidden';
                document.body.appendChild(link);
                $timeout(() => {
                  link.click();
                  document.body.removeChild(link);
                });
                $scope.$broadcast('clearFilterCall');
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          $scope.$parent.vm.cgBusyLoading = ReportMasterFactory.generateReport(paramObj).then((response) => {
            var model = {
              messageContent: '',
              multiple: true
            };
            if (response.status === 404) {
              model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
              DialogFactory.messageAlertDialog(model);
            } else if (response.status === 204) {
              model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NOCONTENT);
              DialogFactory.messageAlertDialog(model);
            } else if (response.status === 403) {
              model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
              DialogFactory.messageAlertDialog(model);
            } else if (response.status === 401) {
              model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
              DialogFactory.messageAlertDialog(model);
            } else if (response.status === -1) {
              model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_SERVICEUNAVAILABLE);
              DialogFactory.messageAlertDialog(model);
            } else {
              const blob = new Blob([response.data], {
                type: 'application/pdf'
              });
              if (navigator.msSaveOrOpenBlob) {
                navigator.msSaveOrOpenBlob(blob, vm.selectedReportData.reportName + '.pdf');
              } else {
                const TimeStamp = $filter('date')(new Date(), CORE.DateFormatArray[0].format);
                const link = document.createElement('a');
                if (link.download !== undefined) {
                  const url = URL.createObjectURL(blob);
                  link.setAttribute('href', url);
                  if (isDownload) {
                    link.setAttribute('download', vm.selectedReportData.reportName + TimeStamp + '.pdf');
                  } else {
                    link.setAttribute('target', '_blank');
                  }
                  link.style = 'visibility:hidden';
                  document.body.appendChild(link);
                  $timeout(() => {
                    link.click();
                    document.body.removeChild(link);
                  });
                  $scope.$broadcast('clearFilterCall');
                }
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }

      /* BT - Used in RDLC Report Parameter flow. */
      //hyper link go for list page
      vm.goToCustomerList = () => {
        BaseService.goToCustomerList();
      };
      vm.goToMountingTypeList = () => {
        BaseService.goToMountingTypeList();
      };
      vm.goToFunctionalTypeList = () => {
        BaseService.goToFunctionalTypeList();
      };
      vm.goToPartStatusList = () => {
        BaseService.openInNew(USER.ADMIN_PART_STATUS_STATE, {});
      };
      vm.goToWorkOrderList = () => {
        BaseService.goToWorkorderList();
      };
      vm.goToOperationList = () => {
        BaseService.goToOperationList();
      };
      vm.goToManufacturerList = () => {
        BaseService.goToManufacturerList();
      };
      vm.goToSupplierList = () => {
        BaseService.goToSupplierList();
      };
      vm.goToEmployeelist = () => {
        BaseService.goToPersonnelList();
      };
      vm.goToComponentList = () => {
        BaseService.goToPartList();
      };

      const clearFilterCall = $scope.$on('clearFilterCall', () => {
        if (vm.reportData) {
          vm.clearFilter();
        }
      });
      /* BT -E */

      const generateReportCall = $scope.$on('generateReportCall', (event, data) => {
        vm.generatereport(vm.reportForm, data.isDownload, data.ev, data.isCSVDownload);
      });

      const refreshUIGridList = $scope.$on('refreshUIGridList', () => {
        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
      });

      //close popup on page destroy
      $scope.$on('$destroy', () => {
        $mdDialog.hide(false, { closeAll: true });
        generateReportCall();
        /* BT - Used in RDLC Report Parameter flow. */
        clearFilterCall();
        /* BT -E */
        refreshUIGridList();
      });

      /* BT - Used in RDLC Report Parameter flow. */
      //open popup for employee performance report
      const openEmployeePerformanceReport = (ev) => {
        const data = {
          pStartDate: vm.fromDate,
          pendDate: vm.toDate,
          pstartTime: vm.managefromTime,
          pendTime: vm.managetoTime,
          woID: vm.autoCompleteWorkOrder.keyColumnId,
          woOPID: vm.autoCompleteOperation.keyColumnId,
          empID: vm.autoCompleteEmployee.keyColumnId
        };
        DialogFactory.dialogService(
          CORE.EMP_PERFORMANCE_MODAL_CONTROLLER,
          CORE.EMP_PERFORMANCE_MODAL_VIEW,
          ev,
          data).then(() => {
          }, () => {
          });
      };
      /* BT -E */

      /* BT - used when remove RDLC Reports. */
      ////open popup for employee performance report
      //const openEmployeePerformanceReport = (employeeData, ev) => {
      //  const data = {
      //    pStartDate: employeeData[vm.CORE_ReportParameterFilterDbColumnName.FromDate],
      //    pendDate: employeeData[vm.CORE_ReportParameterFilterDbColumnName.ToDate],
      //    pstartTime: employeeData[vm.CORE_ReportParameterFilterDbColumnName.FromTime],
      //    pendTime: employeeData[vm.CORE_ReportParameterFilterDbColumnName.ToTime],
      //    woID: employeeData[vm.CORE_ReportParameterFilterDbColumnName.WorkorderID],
      //    woOPID: employeeData[vm.CORE_ReportParameterFilterDbColumnName.OperationID],
      //    empID: employeeData[vm.CORE_ReportParameterFilterDbColumnName.EmployeeID]
      //  };
      //  DialogFactory.dialogService(
      //    CORE.EMP_PERFORMANCE_MODAL_CONTROLLER,
      //    CORE.EMP_PERFORMANCE_MODAL_VIEW,
      //    ev,
      //    data).then(() => {
      //    }, () => {
      //    });
      //};
      /* BT -E */

      /* add.edit defect category*/
      vm.addEditRecord = (data, ev) => {
        ReportMasterFactory.checkApplicationStatus().query().$promise.then((res) => {
          if (res) {
            DialogFactory.dialogService(
              DYNAMIC_REPORTS.DYNAMIC_REPORTS_ADD_UPDATE_MODAL_CONTROLLER,
              DYNAMIC_REPORTS.DYNAMIC_REPORTS_ADD_UPDATE_MODAL_VIEW,
              ev,
              data).then((response) => {
                if (data && data.isRedirectOnDesigner) {
                  const reportInfo = {
                    reportId: response.id
                  };
                  $scope.$parent.vm.cgBusyLoading = ReportMasterFactory.startActivity().save(reportInfo).$promise.then((res) => {
                    if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data) {
                      BaseService.redirectToDesigner(response.fileName);
                      BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                }
                else {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                }
              }, (err) => BaseService.getErrorLog(err));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* update defect category*/
      vm.updateRecord = (row, ev) => {
        if (row.entity.activityStartBy) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.REPORT.ACTIVITY_ALREADY_STARTED);
          messageContent.message = stringFormat(messageContent.message, row.entity.activityStartBy, row.entity.startDesigningDatevalue);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        } else {
          vm.addEditRecord(row.entity, ev);
        }
      };

      /* add.edit defect category*/
      vm.configureFilterParameter = (data, ev) => {
        DialogFactory.dialogService(
          DYNAMIC_REPORTS.REPORT_PARAMETER_SETTINGS_MAPPING_MODAL_CONTROLLER,
          DYNAMIC_REPORTS.REPORT_PARAMETER_SETTINGS_MAPPING_MODAL_VIEW,
          ev,
          data).then((res) => {
            if (res && res.id === vm.selectedReportData.id) {
              vm.getReportFilterParameterDetail(res.id);
            }
            else {
              vm.gridOptions.gridApi.selection.selectRow(data.entity);
            }
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.designReport = (row) => {
        const reportInfo = {
          reportId: row.entity.id
        };

        $scope.$parent.vm.cgBusyLoading = ReportMasterFactory.startActivity().save(reportInfo).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
            vm.startTimer(row.entity);
            BaseService.redirectToDesigner(row.entity.fileName);
          }
          if (response && response.status === CORE.ApiResponseTypeStatus.FAILED && response.errors.unique) {
            vm.reportModel.reportName = null;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.copyReport = (row, ev) => {
        const data = angular.copy(row.entity);
        data.isDisableRadioBtn = true;
        data.selectedCloneReportId = angular.copy(data.id);
        data.reportName = null;
        data.id = null;
        data.isRedirectOnDesigner = true;
        vm.addEditRecord(data, ev);
      };

      vm.stopReportActivity = (row) => {
        // row.editingBy
        const reportInfo = {
          reportId: row.id
        };
        $scope.$parent.vm.cgBusyLoading = ReportMasterFactory.stopActivity().save(reportInfo).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.viewReport = (row, isDownload) => {
        row.createdBy = vm.userId.toString();
        row.updatedBy = vm.userId.toString();
        row.createByRoleId = vm.roleId;
        row.updateByRoleId = vm.roleId;
        const reportFilterDetails = row;
        $scope.$parent.vm.cgBusyLoading = ReportMasterFactory.saveReportViewerParameter(reportFilterDetails).then((response) => {
          if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (isDownload) {
              $scope.$parent.vm.cgBusyLoading = ReportMasterFactory.downloadReport({ ParameterGuid: response.data }).then((downloadReportRes) => {
                BaseService.downloadReportFromReportingTool(downloadReportRes, row.reportName, false);
              });
            }
            else {
              BaseService.redirectToViewer(response.data);
            }
            //$scope.$broadcast('clearFilterCall');
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      };

      angular.element(() => {
        vm.isDesignReport = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowDesignReport);
      });
    }
  }
})();

