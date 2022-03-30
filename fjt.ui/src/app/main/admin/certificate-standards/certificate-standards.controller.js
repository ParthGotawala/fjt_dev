(function () {
  'use strict';

  angular.module('app.admin.certificate-standard')
    .controller('CertificateStandardController', CertificateStandardController);

  /** @ngInject */
  function CertificateStandardController($q, $scope, $rootScope, $stateParams, $state, $timeout, $mdDialog, USER, CORE, CertificateStandardFactory, DialogFactory, BaseService) {
    var vm = this;
    vm.isUpdatable = true;
    vm.popoverPlacement = 'left';
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.CERTIFICATE_STANDARD;
    vm.StatusGridHeaderDropdown = CORE.StatusGridHeaderDropdown;
    vm.BindGridHeaderDropdownForFlag = CORE.KeywordStatusGridHeaderDropdown;
    const CertificateStandardCertifiedStatusGridHeaderDropdown = CORE.CertificateStandardCertifiedStatusGridHeaderDropdown;
    vm.isEditIntigrate = false;
    vm.DateFormatArray = _dateDisplayFormat;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    const IsPermanentDelete = CORE.IsPermanentDelete;
    vm.StandardsTabs = USER.StandardsTabs;
    vm.isCopy = true;
    vm.LabelConstant = CORE.LabelConstant;
    vm.gridConfig = CORE.gridConfig;
    vm.entityID = CORE.AllEntityIDS.CertificateStandard.ID;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '90',
      cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: true,
      enableCellEdit: false
    }, {
      field: '#',
      width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
      cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
      enableFiltering: false,
      enableSorting: false,
      enableCellEdit: false
    },
    {
      field: 'imageURL',
      width: 80,
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
      allowCellFocus: false
    },
    {
      field: 'fullName',
      displayName: 'Standard',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '230',
      enableCellEdit: false
    }, {
      field: 'shortName',
      displayName: 'Code',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      enableCellEdit: false
    }, {
      field: 'gencCategoryNameOfStandardType',
      displayName: 'Standard Type',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{row.entity.gencCategoryNameOfStandardType}}</div>',
      width: '230',
      enableCellEdit: false
    }, {
      field: 'priority',
      displayName: 'Priority' + CORE.Modify_Grid_column_Allow_Change_Message,
      cellTemplate: CORE.DISPLAYORDER.CellTemplate,
      editableCellTemplate: CORE.DISPLAYORDER.EditableCellTemplate,
      //cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | number: 2}}</div>',
      width: CORE.DISPLAYORDER.Width,
      maxWidth: CORE.DISPLAYORDER.MaxWidth,
      type: 'number',
      enableCellEdit: true
    }, {
      field: 'description',
      displayName: 'Description',
      cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
        '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
        '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.description && row.entity.description !== \'-\'" ng-click="grid.appScope.$parent.vm.showDescription(row.entity, $event, \'Standard\')">' +
        '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
        '<md-tooltip>View</md-tooltip>' +
        '</button>' +
        '</div>',
      enableFiltering: false,
      enableSorting: false,
      width: '200',
      enableCellEdit: false
    }, {
      field: 'standardInfo',
      displayName: 'Standard Info',
      cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-click="grid.appScope.$parent.vm.showStandardInfo(row.entity, $event)"> \
                                   View \
                                </md-button>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      width: '100',
      enableCellEdit: false
    },
    {
      field: 'displayOrder',
      displayName: vm.LabelConstant.COMMON.DisplayOrder + CORE.Modify_Grid_column_Allow_Change_Message,
      cellTemplate: CORE.DISPLAYORDER.CellTemplate,
      editableCellTemplate: CORE.DISPLAYORDER.EditableCellTemplate,
      width: CORE.DISPLAYORDER.Width,
      maxWidth: CORE.DISPLAYORDER.MaxWidth,
      enableCellEdit: true,
      type: 'number'
    }, {
      field: 'className',
      displayName: 'Standard Category Tree',
      cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-click="grid.appScope.$parent.vm.showStandardClass(row.entity, $event)"> \
                                   View \
                                </md-button>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      width: '100',
      enableCellEdit: false
    }, {
      field: 'isCertifiedConvertedValue',
      displayName: 'Certificate',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isCertified == true, \
                            \'label-warning\':row.entity.isCertified == false}"> \
                                {{ COL_FIELD }}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: CertificateStandardCertifiedStatusGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      width: 145,
      enableCellEdit: false
    }, {
      field: 'cerificateIssueDate',
      displayName: 'Issue Date',
      type: 'date',
      cellTemplate: '<div class="ui-grid-cell-contents" \
                             style="text-align:center">{{row.entity.cerificateIssueDate | date:grid.appScope.$parent.vm.DateFormatArray}}</div>',
      enableFiltering: false,
      enableSorting: false,
      width: '120',
      enableCellEdit: false
    }, {
      field: 'certificateDate',
      displayName: 'Expiration Date',
      type: 'date',
      cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{\'color-red\':row.entity.isCertiExpired }" \
                             style="text-align:center">{{row.entity.certificateDate | date:grid.appScope.$parent.vm.DateFormatArray}}</div>',
      enableFiltering: false,
      enableSorting: false,
      width: '130',
      enableCellEdit: false
    }, {
      field: 'isActiveConvertedValue',
      displayName: 'Status',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isActive == true, \
                            \'label-warning\':row.entity.isActive == false}"> \
                                {{ COL_FIELD }}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.StatusGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      width: 120,
      enableCellEdit: false
    }, {
      field: 'isExportControlledConvertedValue',
      displayName: 'Export Controlled',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isExportControlled == true, \
                            \'label-warning\':row.entity.isExportControlled == false}"> \
                                {{ COL_FIELD }}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.BindGridHeaderDropdownForFlag
      },
      ColumnDataType: 'StringEquals',
      width: 120,
      enableCellEdit: false
    }, {
      field: 'isRestrictDataAccessConvertedValue',
      displayName: 'Restricted Data Access to Authorized Users Only',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isRestrictDataAccess == true, \
                            \'label-warning\':row.entity.isRestrictDataAccess == false}"> \
                                {{ COL_FIELD }}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.BindGridHeaderDropdownForFlag
      },
      ColumnDataType: 'StringEquals',
      width: 180,
      enableCellEdit: false
    }, {
      field: 'updatedAt',
      displayName: 'Modified Date',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD |date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
      enableFiltering: false,
      type: 'datetime',
      visible: false
    },
    {
      field: 'updatedby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: false
    }, {
      field: 'updatedbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: false
    }, {
      field: 'createdAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false
    }
      , {
      field: 'createdby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      enableSorting: true,
      enableFiltering: true
    }, {
      field: 'createdbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: false
    }
    ];
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [], /* for default - directly set in sp */
        SearchColumns: [],
        roleId: null
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
      allowToExportAllData: true,
      exporterCsvFilename: 'Standards.csv',
      /* Calls everytime for Export All Data [rowType = ALL] */
      exporterAllDataFn: () => {
        /* For scrolling pagination vm.pagingInfo.Page is increase everytime so we have to set API side pagePerReocrds as NULL for Export All Data */
        vm.gridOptions.isExport =  true;
        return CertificateStandardFactory.retriveCertificateStandardsList().query().$promise.then((standards) => {
          if (standards && standards.data && standards.data.standards) {
            return standards.data.standards;
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
    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (standards, isGetDataDown) => {
      if (standards && standards.data && standards.data.standards) {
        if (!isGetDataDown) {
          vm.sourceData = standards.data.standards;
          vm.currentdata = vm.sourceData.length;
        }
        else if (standards.data.standards.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(standards.data.standards);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        const todayDate = new Date().setHours(0, 0, 0, 0);
        _.each(vm.sourceData, (item) => {
          if (item.isCertified && item.certificateDate) {
            item.isCertiExpired = (new Date(item.certificateDate) < todayDate) ? true : false;
          }
          item.imageURL = item.imageURL ? (CORE.WEB_URL + USER.CERTIFICATE_STANDARDS_BASE_PATH + item.imageURL) : (CORE.WEB_URL + CORE.NO_IMAGE_STANDARD);
          item.certificateDate = item.certificateDate ? BaseService.getUIFormatedDate(item.certificateDate, vm.DateFormatArray) : null;
        });

        // must set after new data comes
        vm.totalSourceDataCount = standards.data.Count;
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
          if (!vm.isEditIntigrate) {
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
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = CertificateStandardFactory.retriveCertificateStandardsList().query(vm.pagingInfo).$promise.then((standards) => {
        if (standards && standards.data) {
          setDataAfterGetAPICall(standards, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* to get data on scroll down in grid */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = CertificateStandardFactory.retriveCertificateStandardsList().query(vm.pagingInfo).$promise.then((standards) => {
        if (standards && standards.data) {
          setDataAfterGetAPICall(standards, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.selectedCertificateStd = () => vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;

    vm.fab = {
      Status: false
    };



    /* delete standard*/
    vm.deleteRecord = (row) => {
      let selectedIDs = [];
      if (row) {
        selectedIDs.push(row.certificateStandardID);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((item) => item.certificateStandardID);
        }
      }

      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Standard(s)', selectedIDs.length);
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
            vm.cgBusyLoading = CertificateStandardFactory.deleteCertificateStandard().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res && res.data) {
                if (res.data.length > 0 || res.data.transactionDetails) {
                  const data = {
                    TotalCount: res.data.transactionDetails[0].TotalCount,
                    pageName: CORE.PageName.certificate_standards
                  };
                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const objIDs = {
                      id: selectedIDs,
                      isPermanentDelete: IsPermanentDelete,
                      CountList: true
                    };
                    return CertificateStandardFactory.deleteCertificateStandard().query({ objIDs: objIDs }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.pageTitle = row ? row.fullName : null;
                      data.PageName = CORE.PageName.certificate_standards;
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
        messageContent.message = stringFormat(messageContent.message, 'Standard');
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    /* Update Certificate Standard*/
    vm.updateRecord = (row) => {
      $state.go(USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_DETAIL_STATE, { tabname: vm.StandardsTabs.Detail.Name, id: row.entity.certificateStandardID });
    };

    /* Add/Update Certificate Standard*/
    vm.addEditCertificateStd = () => {
      $state.go(USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_DETAIL_STATE, { tabname: vm.StandardsTabs.Detail.Name, id: null });
    };

    //copy standard recoerd open pop-up
    vm.copyRecord = (data, ev) => {
      const objData = { data: data.entity };
      if (objData.data.certificateStandardID) {
        return CertificateStandardFactory.retriveCertificateStandards().query({ id: $stateParams.id ? $stateParams.id : objData.data.certificateStandardID }).$promise.then((response) => {
          vm.objresData = response.data;
          const obj = vm.objresData;
          DialogFactory.dialogService(
            USER.ADMIN_CERTIFICATE_STANDARD_COPY_MODAL_CONTROLLER,
            USER.ADMIN_CERTIFICATE_STANDARD_COPY_MODAL_VIEW,
            ev,
            obj).then((copiedStdDet) => {
              if (copiedStdDet) {
                $state.go(USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_DETAIL_STATE, { id: copiedStdDet.certificateStandardID });
              }
            }, (err) => BaseService.getErrorLog(err));
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, {
        closeAll: true
      });
    });


    //Update cell for display order field
    function cellEdit() {
      vm.isEditIntigrate = true;
      vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
        var obj = _.find(vm.sourceData, (item) => item.certificateStandardID === rowEntity.certificateStandardID);
        var index = vm.sourceData.indexOf(obj);
        if (newvalue !== oldvalue) {
          if (colDef.field === 'displayOrder') {
            if (!BaseService.setInvalidDisplayOrder(oldvalue, newvalue, index, (colDef.colInitIndex - 1), vm.gridOptions, vm.sourceData, vm.sourceHeader, rowEntity, 0)) {
              rowEntity.displayOrder = null;
              return;
            }
            vm.objData = {
              certificateDetail: null,
              standardClassDetail: null
            };
            const categoryInfo = {
              displayOrder: rowEntity.displayOrder,
              certificateStandardID: rowEntity.certificateStandardID
            };
            vm.objData.certificateDetail = categoryInfo;
          }
          else {
            if (!BaseService.setInvalidDisplayOrder(oldvalue, newvalue, index, (colDef.colInitIndex - 1), vm.gridOptions, vm.sourceData, vm.sourceHeader, rowEntity, 0)) {
              rowEntity.priority = null;
              return;
            }
            if (colDef.field === 'priority') {
              vm.objData = {
                certificateDetail: null,
                standardClassDetail: null
              };
              const categoryInfo = {
                priority: rowEntity.priority,
                certificateStandardID: rowEntity.certificateStandardID
              };
              vm.objData.certificateDetail = categoryInfo;
            }
          }

          vm.cgBusyLoading = CertificateStandardFactory.updateCertificateStandard().update({
            id: rowEntity.certificateStandardID
          }, vm.objData).$promise.then((res) => {
            if (res) {
              if (res.status === CORE.ApiResponseTypeStatus.FAILED) {
                if (colDef.field === 'priority') {
                  rowEntity.priority = oldvalue;
                }
                else if (colDef.field === 'displayOrder') {
                  rowEntity.displayOrder = oldvalue;
                }
              }
              else if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      });
    }

    /* Show Description*/
    vm.showDescription = (certobject, ev, callFrom) => {
      let data = {};
      if (callFrom === 'Standard') {
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
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => BaseService.getErrorLog(err));
    };

    /* Show StandardInfo*/
    vm.showStandardInfo = (object, ev) => {
      const obj = {
        title: 'Standards',
        description: object.standardInfo,
        name: object.fullName
      };
      const data = obj;
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data).then(() => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => BaseService.getErrorLog(err));
    };
    const getTrivewData = () => CertificateStandardFactory.treeviewData().query({ id: vm.StandardtypeId }).$promise.then((response) => {
      vm.standardDet = angular.copy(response.data);
      return $q.resolve(vm.standardDet);
    }).catch((error) => BaseService.getErrorLog(error));

    /* Show StandardInfo*/
    vm.showStandardClass = (object, ev) => {
      vm.StandardtypeId = object.gencCategoryIDOfStandardType ? object.gencCategoryIDOfStandardType : null;
      if (vm.StandardtypeId) {
        vm.cgBusyLoading = $q.all([getTrivewData()]).then((res) => {
          if (vm.standardDet) {
            const obj = {
              title: 'Standard',
              certificateData: res[0],
              name: object.fullName,
              certificateId: object.certificateStandardID
            };
            const data = obj;
            DialogFactory.dialogService(
              CORE.TREE_MODAL_CONTROLLER,
              CORE.TREE_MODAL_VIEW,
              ev,
              data).then(() => {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
              }, (err) => BaseService.getErrorLog(err));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.STANDARD_TYPE_ERROR);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
  }
})();
