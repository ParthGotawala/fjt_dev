(function () {
  'use strict';

  angular.module('app.admin.standardClass')
    .controller('StandardClassController', ['$q', '$scope', '$mdDialog', '$timeout', '$state', 'USER', 'CORE', 'StandardClassFactory', 'DialogFactory', 'BaseService', '$rootScope', StandardClassController]);

  function StandardClassController($q, $scope, $mdDialog, $timeout, $state, USER, CORE, StandardClassFactory, DialogFactory, BaseService) {
    var vm = this;
    vm.isUpdatable = true;
    vm.isEditIntigrate = false;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.STANDARD_CLASS;
    vm.StatusGridHeaderDropdown = CORE.StatusGridHeaderDropdown;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.LabelConstant = CORE.LabelConstant;
    vm.gridConfig = CORE.gridConfig;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.sourceHeader = [{
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: 90,
        cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true
      }, {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'className',
        displayName: 'Standard Category',
        width: '280'
      },

      {
        field: 'fullNameOfCertificateStandards',
        displayName: 'Standard',
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.fullNameOfCertificateStandards}}</div>',
        width: '280'
      },
      {
        field: 'description',
        displayName: 'Description',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
          '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
          '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.description && row.entity.description !== \'-\'" ng-click="grid.appScope.$parent.vm.showDescription(row.entity, $event, \'StandardDescription\')">' +
          '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
          '<md-tooltip>View</md-tooltip>' +
          '</button>' +
          '</div>',
        width: '200'
      },
      {
        field: 'displayOrder',
        displayName: vm.LabelConstant.COMMON.DisplayOrder + CORE.Modify_Grid_column_Allow_Change_Message,
        cellTemplate: CORE.DISPLAYORDER.CellTemplate,
        editableCellTemplate: CORE.DISPLAYORDER.EditableCellTemplate,
        width: CORE.DISPLAYORDER.Width,
        maxWidth: CORE.DISPLAYORDER.MaxWidth,
        type: 'number',
        enableCellEdit: true
      },
      {
        field: 'colorCode',
        displayName: 'Color ',
        cellTemplate: '<span class="label-box label-colorCode" style="background-color:{{COL_FIELD}}" ng-show="row.entity.colorCode">\
                                                    </span><span class="label-box black-500-fg" ng-show="!row.entity.colorCode" style="border-color:gray">\
                                                    </span>',
        width: 75,
        enableFiltering: false
      }, {
        field: 'fullName',
        displayName: 'Standard Category Tree',
        cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-click="grid.appScope.$parent.vm.showStandardClass(row.entity, $event)"> \
                                   View \
                                </md-button>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        width: '110'
      },
      {
        field: 'isActiveConvertedValue',
        displayName: 'Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">' +
          '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isActive == true, \
                            \'label-warning\':row.entity.isActive == false}"> \
                                {{ COL_FIELD }}' +
          '</span>' +
          '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.StatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 120
      },
      {
        field: 'updatedAt',
        displayName: 'Modified Date',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD |date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
        enableFiltering: false,
        enableSorting: false,
        type: 'datetime'
      },
      {
        field: 'updatedby',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'updatedbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'createdAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'createdby',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'createdbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }
    ];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        /* for default - directly set in sp */
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
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      enableCellEdit: false,
      enableCellEditOnFocus: true,
      exporterCsvFilename: 'Standard Category.csv'
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (classData, isGetDataDown) => {
      if (classData && classData.data && classData.data.classData) {
        if (!isGetDataDown) {
          vm.sourceData = classData.data.classData;
          vm.currentdata = vm.sourceData.length;
        } else if (classData.data.classData.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(classData.data.classData);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = classData.data.Count;
        if (!vm.gridOptions.enablePaging) {
          if (!isGetDataDown) {
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          } else {
            vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          }
        }
        if (!isGetDataDown) {
          vm.gridOptions.clearSelectedRows();
          if (!vm.isEditIntigrate) {
            cellEdit();
          }
        }
        if (vm.totalSourceDataCount === 0) {
          if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
            vm.isNoDataFound = false;
            vm.emptyState = 0;
          } else {
            vm.isNoDataFound = true;
            vm.emptyState = null;
          }
        } else {
          vm.isNoDataFound = false;
          vm.emptyState = null;
        }
        $timeout(() => {
          if (!isGetDataDown) {
            vm.resetSourceGrid();
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          } else {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
          }
        });
      }
    };
    /* get all standard Discription */
    vm.showDescription = (certobject, ev, callFrom) => {
      let data = {};
      if (callFrom === 'StandardDescription') {
        data = {
          title: 'Standard Description',
          description: certobject.description,

          headerData: [{
            label: 'Standard',
            value: certobject.fullName,
            displayOrder: 1,
            labelLinkFn: () => {
              BaseService.goToStandardList();
            },
            valueLinkFn: () => {
              BaseService.goToStandardDetails(certobject.certificateStandardID);
            }
          }]
        };
      }
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };
    /* to bind data in grid on load */
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = StandardClassFactory.retriveStandardClassList().query(vm.pagingInfo).$promise.then((classData) => {
        if (classData && classData.data) {
          setDataAfterGetAPICall(classData, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    const getTrivewData = () => StandardClassFactory.standardtreeviewData().query({
      id: vm.certificateStandardID
    }).$promise.then((response) => {
      vm.standardDet = angular.copy(response.data);
      return $q.resolve(vm.standardDet);
    }).catch((error) => BaseService.getErrorLog(error));

    /* Show StandardInfo*/
    vm.showStandardClass = (object, ev) => {
      const classID = {
        'classID': object.classID
      };
      vm.certificateStandardID = object.certificateStandardID;
      vm.cgBusyLoading = $q.all([getTrivewData()]).then((res) => {
        if (res && res[0]) {
          const AscClasslist = _.orderBy(res[0]['standardType']['standardType'][0]['CertificateStandard_Class'], ['priority'], ['asc']);
          res[0]['standardType']['standardType'][0]['CertificateStandard_Class'] = AscClasslist;
          if (vm.standardDet) {
            const obj = {
              title: 'Standard',
              certificateData: res[0],
              name: object.fullNameOfCertificateStandards,
              certificateId: object.certificateStandardID,
              selectedClass: classID,
              selectedClassName: object.className ? object.className : null
            };
            const data = obj;
            DialogFactory.dialogService(
              CORE.TREE_MODAL_CONTROLLER,
              CORE.TREE_MODAL_VIEW,
              ev,
              data).then(() => {
              if (!vm.gridOptions.enablePaging) {
                initPageInfo();
              }
              vm.loadData();
            }, (err) => BaseService.getErrorLog(err));
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* to get data on scroll down in grid */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = StandardClassFactory.retriveStandardClassList().query(vm.pagingInfo).$promise.then((classData) => {
        if (classData && classData.data) {
          setDataAfterGetAPICall(classData, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    /* Update Standard Class*/
    vm.updateRecord = (row, ev) => {
      vm.addEditStandardClass(row.entity, ev);
    };

    /* Add/Update Standard Class*/
    vm.addEditStandardClass = (data, ev) => {
      DialogFactory.dialogService(
        USER.STANDARD_CLASS_CONTROLLER_UPDATE_MODAL_CONTROLLER,
        USER.STANDARD_CLASS_CONTROLLER_UPDATE_MODAL_VIEW,
        ev,
        data).then(() => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, () => {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
      }, (err) => BaseService.getErrorLog(err));
    };
    /* delete Standard Class*/
    vm.deleteRecord = (standardClass) => {
      var selectedIDs = [];
      if (standardClass) {
        selectedIDs.push(standardClass.classID);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((standardClassItem) => standardClassItem.classID);
        }
      }

      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Standard category', selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs,
          CountList: false
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = StandardClassFactory.deleteStandardClass().query({
              objIDs: objIDs
            }).$promise.then((res) => {
              if (res && res.data) {
                if (res.data.length > 0 || res.data.transactionDetails) {
                  const data = {
                    TotalCount: res.data.transactionDetails[0].TotalCount,
                    pageName: CORE.PageName.Standards_Categories
                  };
                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const objIDs = {
                      id: selectedIDs,
                      CountList: true
                    };
                    return StandardClassFactory.deleteStandardClass().query({
                      objIDs: objIDs
                    }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.pageTitle = standardClass ? standardClass.className : null;
                      data.PageName = CORE.PageName.Standards_Categories;
                      data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                      if (res.data) {
                        DialogFactory.dialogService(
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                          ev,
                          data).then(() => {}, () => {});
                      }
                    }).catch((error) => BaseService.getErrorLog(error));
                  });
                } else {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.gridOptions.clearSelectedRows();
                }
              } else {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                vm.gridOptions.clearSelectedRows();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {}).catch((error) => BaseService.getErrorLog(error));
      } else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'Standard category');
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    //Update cell for display order flied
    function cellEdit() {
      vm.isEditIntigrate = true;
      vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
        var obj = _.find(vm.sourceData, (item) => item.classID === rowEntity.classID);
        var index = vm.sourceData.indexOf(obj);
        if (colDef.field === 'displayOrder' && newvalue !== oldvalue) {
          if (!BaseService.setInvalidDisplayOrder(oldvalue, newvalue, index, (colDef.colInitIndex - 1), vm.gridOptions, vm.sourceData, vm.sourceHeader, rowEntity, 0)) {
            return;
          }
          const StandardClassInfo = {
            displayOrder: rowEntity.displayOrder,
            classID: rowEntity.classID,
            isCheckUnique: true
          };
          vm.cgBusyLoading = StandardClassFactory.standardClass().update({
            id: rowEntity.classID
          }, StandardClassInfo).$promise.then((res) => {
            if (res) {
              if (res.status === CORE.ApiResponseTypeStatus.FAILED) {
                if (colDef.field === 'displayOrder') {
                  rowEntity.displayOrder = oldvalue;
                }
              } else if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      });
    }
    vm.openAssignPersonnel = (row) => {
      if (row) {
        BaseService.goToAssignPersonnel(row.certificateStandardID, row.classID);
      }
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, {
        closeAll: true
      });
    });
  }
})();
