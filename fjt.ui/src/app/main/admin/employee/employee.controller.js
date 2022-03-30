(function () {
  'use strict';

  angular
    .module('app.admin.employee')
    .controller('EmployeeController', EmployeeController);

  /** @ngInject */
  function EmployeeController($timeout, $state, $window, $scope, $rootScope, store, $mdDialog, CORE, USER, EmployeeFactory, DialogFactory, BaseService) {
    const vm = this;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.popoverPlacement = 'left';
    vm.isUpdatable = true;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.EMPLOYEE;
    vm.paymentmode = CORE.PaymentMode;
    vm.view = true;
    vm.isTimeline = true;
    vm.isViewOperaiton = true;
    const IsPermanentDelete = CORE.IsPermanentDelete;
    vm.Module = CORE.Import_export.Personnel.FileName;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.Model = CORE.Import_export.Personnel.Model;
    vm.EntityTableName = CORE.Import_export.Personnel.Table_Name;
    vm.isImport = false;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
    vm.PaymentModeOptionDropdown = CORE.PaymentModeOptionDropdown;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.entityID = CORE.AllEntityIDS.Employee.ID;
    vm.PersonnelTypeGridHeaderDropdown = CORE.PersonnelTypeGridHeaderDropdown;
    vm.personneltTypeObj = _.reduce(CORE.personnelTypeRadio, (obj, item) => { obj[item['objectKey']] = item; return obj; }, {});

    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'layout-align-center-center',
      displayName: 'Action',
      width: '120',
      cellTemplate: '<grid-action-view grid="grid" row="row" style="overflow: hidden;padding:1px !important;overflow: hidden; white-space: nowrap;" class="height-grid ui-grid-cell-contents"></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: false
    },
    {
      field: '#',
      width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
      cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
      enableFiltering: false,
      enableSorting: false
    },
    {
      field: 'imageURL',
      width: 90,
      displayName: 'Image',
      cellTemplate: '<div class="ui-grid-cell-contents">'
        + '<img class="cm-grid-images image-popover" ng-src="{{COL_FIELD}}"'
        + ' uib-popover-template="\'imagePreviewTemplate.html\'" '
        + ' popover-trigger="\'mouseenter\'" '
        + ' popover-append-to-body ="true" '
        + ' popover-class= "width-400 height-400 cm-center-screen-location cm-component-img" '
        + ' popover-placement="{{grid.appScope.$parent.vm.popoverPlacement}}" '
        + ' /> </div>',
      enableFiltering: false,
      enableSorting: false,
      allowCellFocus: false,
      exporterSuppressExport: true
    },
    {
      field: 'isActiveConvertedValue',
      displayName: 'Status',
      cellTemplate: '<div class="ui-grid-cell-contents">'
        + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isActive == true, \
                            \'label-warning\':row.entity.isActive == false}"> \
                                {{ COL_FIELD }}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.StatusOptionsGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      width: '110'
    },
    {
      field: 'firstName',
      displayName: 'First Name',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '150'
    },
    {
      field: 'middleName',
      displayName: 'Middle Name',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '100'
    },
    {
      field: 'lastName',
      displayName: 'Last Name',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '150'
    },
    {
      field: 'initialName',
      displayName: 'Initial',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                       <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.updateRecord(row);$event.preventDefault();">{{COL_FIELD}}</a>\
                                    </div>',
      width: '150'
    },
    {
      field: 'visibleCode',
      displayName: 'User ID',
      cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.visibleCode">XXXXXX-{{row.entity.visibleCode}}</div>',
      width: '150'
    },
    {
      field: 'userAccountType',
      displayName: 'User Account Type',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center"><span class="label-box" ng-class="{\'label-success\':row.entity.personnelType === grid.appScope.$parent.vm.personneltTypeObj.personal.value, \'label-warning\':row.entity.personnelType === grid.appScope.$parent.vm.personneltTypeObj.functional.value}"> {{ COL_FIELD }}</span></div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.PersonnelTypeGridHeaderDropdown
      },
      width: '150'
    },
    {
      field: 'contactPerson',
      displayName: 'Current Contact Person Assigned',
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents">\
                      <span>{{COL_FIELD}}</span>&nbsp; \
                      <md-icon md-font-icon="icon-history" ng-if="row.entity.contactPerson" ng-click="grid.appScope.$parent.vm.openContactPersonHistory(row.entity, $event)"><md-tooltip>Assigned Contact Person History</md-tooltip></md-icon> \
                    </div>',
      width: '200'
    },
    {
      field: 'assignedAt',
      displayName: 'Contact Person Assigned At',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: 160,
      type: 'datetime',
      enableFiltering: false
    },
    {
      field: 'email',
      displayName: 'Email',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '250'
    },
    {
      field: 'employeeResponsibility',
      width: '300',
      displayName: 'Responsibilities',
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents layout-wrap"> '
        + ' <span class="label-box margin-left-2 label-primary mb-5" '
        + ' ng-repeat="objResponsibility in row.entity.empResponsibility track by $index">{{objResponsibility}}</sapn> '
        + ' </div> ',
      enableFiltering: false,
      enableSorting: false
    },
    {
      field: 'empCertificationList',
      width: '300',
      displayName: 'Certified Standard',
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents layout-wrap"> '
        + ' <span class="label-box margin-left-2 mb-5" ng-style = "{\'background-color\': standardItem.colorCode}" '
        + ' ng-repeat="standardItem in row.entity.empCertificationDetListWithNewLine track by $index">{{standardItem.stdClassName}}</span> '
        + ' </div> ',
      enableFiltering: false,
      enableSorting: false
    },
    {
      field: 'contact',
      displayName: 'Phone',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '170'
    },
    {
      field: 'phExtension',
      displayName: 'Ext.',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '100'
    },
    {
      field: 'managerEmployeeName',
      displayName: 'Manager',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '170'
    },
    {
      field: 'paymentMode',
      displayName: 'Payment Mode',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box label-warning" ng-if="row.entity.paymentMode==grid.appScope.$parent.vm.paymentmode.Exempt" >'
        + 'Exempt'
        + '</span>'
        + '<span class="label-box label-success" ng-if="row.entity.paymentMode==grid.appScope.$parent.vm.paymentmode.Non_exempt">'
        + 'Non-exempt'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.PaymentModeOptionDropdown
      },
      ColumnDataType: 'StringEquals',
      width: '140'
    },
    {
      field: 'burdenRate',
      displayName: 'Burden Rate',
      cellTemplate:
        '<div flex="100" class="text-right" layout="column" layout-align="center end">{{row.entity[col.field]}}</div>',
      width: '100'
    },
    {
      field: 'updatedAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false,
      visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
    },
    {
      field: 'updatedby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: CORE.UIGrid.VISIBLE_MODIFIED_BY
    },
    {
      field: 'updatedbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: CORE.UIGrid.VISIBLE_MODIFIED_BYROLE
    },
    {
      field: 'createdAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false,
      visible: CORE.UIGrid.VISIBLE_CREATED_AT
    },
    {
      field: 'createdby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: CORE.UIGrid.VISIBLE_CREATED_BY
    },
    {
      field: 'createdbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: CORE.UIGrid.VISIBLE_CREATED_BYROLE
    }
    ];


    vm.sourceHeader.unshift(
      {
        field: 'Apply',
        headerCellTemplate: '<md-checkbox class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" ng-model="grid.appScope.$parent.vm.Apply" \
                            ng-change="grid.appScope.$parent.vm.applyAll(grid.appScope.$parent.vm.Apply)"></md-checkbox>',
        width: '75',
        cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" style="overflow:initial"><md-checkbox  ng-disabled="row.entity.isDisabledDelete"  ng-model="row.entity.isRecordSelectedForRemove" \
                            ng-change="grid.appScope.$parent.vm.setEmpRemove(row.entity)"></md-checkbox></div>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: false,
        allowCellFocus: false,
        maxWidth: '80',
        enableColumnMoving: false,
        manualAddedCheckbox: true
      }
    );

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['firstName', 'ASC']],
        SearchColumns: []
      };
    };
    initPageInfo();

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: `${CORE.PAGENAME_CONSTANT[60].PageName}.csv`,
      CurrentPage: CORE.PAGENAME_CONSTANT[60].PageName,
      allowToExportAllData: true,
      exporterAllDataFn: () => {
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return EmployeeFactory.retrieveEmployeeList().query(pagingInfoOld).$promise.then((employees) => {
          if (employees.status === CORE.ApiResponseTypeStatus.SUCCESS && employees.data && employees.data.employees) {
            return employees.data.employees;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    function setPopover() {
      $('.image-popover').on('mouseenter', (e) => {
        vm.popoverPlacement = (e.view.innerWidth / 2);
        if (vm.popoverPlacement < e.clientX) {
          vm.popoverPlacement = 'left';
        }
        else {
          vm.popoverPlacement = 'right';
        }
      });
    };

    $timeout(() => {
      $rootScope.$on(CORE.GRID_COL_PINNED_AND_VISIBLE_CHANGE, () => {
        $timeout(() => {
          setPopover();
        }, _configSecondTimeout);
      });
    });

    /* to set data in grid after data is retrived from API in loadData() and getDataDown() function */
    const setDataAfterGetAPICall = (employees, isGetDataDown) => {
      if (employees && employees.data && employees.data.employees) {
        formatEmpCertiOfGridData(employees.data.employees);
        if (!isGetDataDown) {
          vm.sourceData = employees.data.employees;
          vm.currentdata = vm.sourceData.length;
        }
        else if (employees.data.employees.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(employees.data.employees);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = employees.data.Count;
        setFormattedDataInGrid(vm.sourceData);
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
        $timeout(() => {
          if (!isGetDataDown) {
            vm.resetSourceGrid();
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          }
          else {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
          }
        });
        $timeout(() => {
          setPopover();
        }, _configSecondTimeout);
      }
    };

    /* to bind data in grid on load */
    vm.loadData = () => {
      //vm.Apply manually set at setEmpRemove ,need to reset.
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.Apply = false;
      vm.cgBusyLoading = EmployeeFactory.retrieveEmployeeList().query(vm.pagingInfo).$promise.then((employees) => {
        if (employees && employees.data) {
          setDataAfterGetAPICall(employees, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //format Alias (all in new line) Of Grid Data
    const formatEmpCertiOfGridData = (empList) => {
      const existsCertiOfEmpList = _.filter(empList, (empItem) => empItem.empCertificationList);

      _.each(existsCertiOfEmpList, (empCertiItem) => {  // emp wise certi
        const empCertificationDetListWithNewLine = [];
        const classWithColorCode = empCertiItem.empCertificationList.split('@@@@@@');
        _.each(classWithColorCode, (item) => {
          if (item) {
            const objItem = item.split('######');
            const standardClassObj = {};
            standardClassObj.stdClassName = objItem[0].trim();
            standardClassObj.colorCode = objItem[1] ? objItem[1] : CORE.DefaultStandardTagColor;
            empCertificationDetListWithNewLine.push(standardClassObj);
          }
        });
        empCertiItem.empCertificationDetListWithNewLine = empCertificationDetListWithNewLine;
        empCertiItem.empCertificationList = _.map(empCertificationDetListWithNewLine, 'stdClassName').toString();
      });
    };

    //apply all details
    vm.applyAll = (applyAll) => {
      if (applyAll) {
        _.map(vm.sourceData, selectEmp);
      } else {
        _.map(vm.sourceData, unselectEmp);
      }
    };
    const selectEmp = (row) => {
      row.isRecordSelectedForRemove = row.isDisabledDelete ? false : true;
      if (row.isRecordSelectedForRemove) {
        vm.gridOptions.gridApi.selection.selectRow(row);
      }
    };
    const unselectEmp = (row) => {
      row.isRecordSelectedForRemove = false;
      vm.gridOptions.clearSelectedRows();
    };
    vm.setEmpRemove = (row) => {
      var totalItem = _.filter(vm.sourceData, (data) => !data.isDisabledDelete);
      var selectItem = _.filter(vm.sourceData, (data) => data.isRecordSelectedForRemove === true);
      if (row.isRecordSelectedForRemove) {
        vm.gridOptions.gridApi.selection.selectRow(row);
      } else {
        vm.gridOptions.gridApi.selection.unSelectRow(row);
      }
      if (totalItem.length === selectItem.length) {
        vm.Apply = true;
      } else {
        vm.Apply = false;
      }
    };

    /* to get data on scroll down in grid */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = EmployeeFactory.retrieveEmployeeList().query(vm.pagingInfo).$promise.then((employees) => {
        if (employees && employees.data) {
          setDataAfterGetAPICall(employees, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const setFormattedDataInGrid = (gridlist) => {
      _.each(gridlist, (obj) => {
        if (obj.burdenRate) {
          obj.burdenRate = stringFormat('{0}{1}', '$', obj.burdenRate);
        }
        if (!obj.profileImg) {
          obj.imageURL = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
        }
        else {
          obj.imageURL = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + obj.profileImg;
        }

        if (obj.employeeResponsibility) {
          let empResponsibility = [];
          empResponsibility = obj.employeeResponsibility.split('@@@');

          obj.empResponsibility = empResponsibility;
          obj.employeeResponsibility = _.map(empResponsibility).toString();
        }
        obj.contactPerson = (!obj.contactPerson && (obj.personnelType === vm.personneltTypeObj.functional.value)) ? obj.fullName : obj.contactPerson;
      });
    };

    vm.selectedEmployee = () => vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;

    vm.fab = {
      Status: false
    };



    /* update employee*/
    vm.updateRecord = (row) => {
      BaseService.goToManagePersonnel(row.entity.id);
    };

    /* update employee*/
    vm.viewRecord = (row) => {
      BaseService.goToEmployeeProfile(row.entity.id);
    };

    /* view employee timeline */
    vm.viewEmployeeTimeline = (row) => {
      if (row.entity.userID) {
        BaseService.openInNew(USER.ADMIN_EMPLOYEE_TIMELINE_STATE, { id: row.entity.userID });
      }
    };
    /**/
    vm.showOperationAssigned = (data) => {
      BaseService.openInNew(USER.MANAGE_EMPLOYEE_OPERATIONS_STATE, { id: data.id });
    };
    vm.import = () => {
      vm.isImport = true;
    };
    /* delete employee*/
    vm.deleteRecord = (row) => {
      let selectedIDs = [];
      if (row) {
        selectedIDs.push(row.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((item) => item.id);
        }
      }

      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Personnel', selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs,
          isPermanentDelete: IsPermanentDelete,
          CountList: false
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = EmployeeFactory.deleteEmployee().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res && res.data) {
                if (res.data.length > 0 || res.data.transactionDetails) {
                  const data = {
                    TotalCount: res.data.transactionDetails[0].TotalCount,
                    pageName: CORE.PageName.employees
                  };
                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const objIDs = {
                      id: selectedIDs,
                      CountList: true
                    };
                    return EmployeeFactory.deleteEmployee().query({ objIDs: objIDs }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.pageTitle = row ? row.firstName : null;
                      data.PageName = CORE.PageName.employees;
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
                else {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.gridOptions.clearSelectedRows();
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'employee');
        const alertModel = {
          messageContent: messageContent,
          multiple: true
        };

        DialogFactory.messageAlertDialog(alertModel);
      }
    };


    /* add/edit employee*/
    vm.addEditRecord = () => {
      //$state.go(USER.ADMIN_EMPLOYEE_MANAGE_STATE, { id: null });
      BaseService.openInNew(USER.ADMIN_EMPLOYEE_MANAGE_STATE, { id: null });
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };
    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
    //Down-load employee template
    vm.downloadDocument = () => {
      var messageContent = '';
      vm.cgBusyLoading = EmployeeFactory.downloadPersonnelTemplate(vm.Module).then((response) => {
        if (response.status === 404) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
          DialogFactory.messageAlertDialog({ messageContent, multiple: true });
        } else if (response.status === 403) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
          DialogFactory.messageAlertDialog({ messageContent, multiple: true });
        } else if (response.status === 401) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
          DialogFactory.messageAlertDialog({ messageContent, multiple: true });
        }
        else {
          const blob = new Blob([response.data], { type: 'text/xlsx' });
          if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, vm.Module + '.xls');
          } else {
            const link = document.createElement('a');
            if (link.download !== undefined) {
              const url = URL.createObjectURL(blob);
              link.setAttribute('href', url);
              link.setAttribute('download', vm.Module + '.xls');
              link.style = 'visibility:hidden';
              document.body.appendChild(link);
              $timeout(() => {
                link.click();
                document.body.removeChild(link);
              });
            }
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Open contact person history popup.
    vm.openContactPersonHistory = (row, ev) => {
      const data = {
        title:  CORE.LabelConstant.EmployeeContPersonHistory.EmployeePopupTitle,
        employeeId: row.id,
        headerData: [{
          label: CORE.MainTitle.Employee,
          value: row.fullName,
          displayOrder: 1,
          labelLinkFn: vm.goToPersonnelList,
          valueLinkFn: vm.goToManagePersonnel,
          valueLinkFnParams: row.id
        }]
      };
      DialogFactory.dialogService(
        USER.ADMIN_EMPLOYEE_CONTACTPERSON_HISTORY_MODAL_CONTROLLER,
        USER.ADMIN_EMPLOYEE_CONTACTPERSON_HISTORY_MODAL_VIEW,
        ev,
        data).then(() => { // Empty Block.
        }, () => { // Empty Block.
        }, (err) => BaseService.getErrorLog(err));
    };

    // Go to Employee List Page.
    vm.goToPersonnelList = () => {
      BaseService.goToPersonnelList();
    };
    // Go to Employee Manage Page.
    vm.goToManagePersonnel = (empId) => {
      BaseService.goToManagePersonnel(empId);
    };
  }
})();
