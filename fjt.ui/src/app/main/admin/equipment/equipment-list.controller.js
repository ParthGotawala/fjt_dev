(function () {
  'use strict';

  angular
    .module('app.admin.equipment')
    .controller('EquipmentController', EquipmentController);

  /** @ngInject */
  function EquipmentController($timeout, $q, $state, $stateParams, $scope, $rootScope, $mdDialog, CORE, USER, EquipmentFactory, DialogFactory, GenericCategoryFactory, BaseService) {
    const vm = this;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.isUpdatable = true;
    vm.isCalibrationDetail = true;
    vm.view = true;
    vm.popoverPlacement = 'left';
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.EQUIPMENT;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    vm.DateFormatArray = _dateDisplayFormat;
    vm.defaultDateTimeFormat = _dateTimeDisplayFormat;
    const IsPermanentDelete = CORE.IsPermanentDelete;
    let GenericCategoryAllData;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.equipmentType = CORE.EquipmentType;
    vm.Module = CORE.Import_export.Equipment.FileName;
    vm.Model = CORE.Import_export.Equipment.Model;
    vm.EntityTableName = CORE.Import_export.Equipment.Table_Name;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.isImport = false;
    let allEquipmentFilter = [];
    vm.import = () => {
      vm.isImport = true;
    };
    const defaultObj = {
      id: null,
      value: 'All'
    };
    vm.entityID = CORE.AllEntityIDS.Equipment.ID;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.GetCategoryName = (id) => {
      const catType = _.find(GenericCategoryAllData, (cat) => cat.gencCategoryID === id);
      return catType ? catType.gencCategoryName : '';
    };

    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '120',
      cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="3"></grid-action-view>',
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
      exporterSuppressExport: true,
      allowCellFocus: false
    },
    {
      field: 'equipmentAsConvertedValue',
      displayName: 'Category',
      cellTemplate: '<div class="ui-grid-cell-contents">'
        + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.equipmentAs == \'E\', \
                            \'label-warning\':row.entity.equipmentAs == \'W\', \
                            \'label-primary\':row.entity.equipmentAs == \'S\'}"> \
                                 {{COL_FIELD}}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.equipmentType
      },
      ColumnDataType: 'StringEquals',
      width: '150'
    }, {
      field: 'assetName',
      displayName: 'Name',
      width: '200'
    },
    {
      field: 'eqpMake',
      displayName: 'Make',
      width: '250'
    }, {
      field: 'eqpModel',
      displayName: 'Model',
      width: '130'
    }, {
      field: 'eqpYear',
      displayName: 'Year',
      width: '65'
    }, {
      field: 'assetNumber',
      displayName: 'Workstation/Asset#',
      width: '150'
    },
    {
      field: 'serialNumber',
      displayName: 'MFR Serial#',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200'
    }, {
      field: 'department',
      displayName: 'Department',
      width: '130'
    }, {
      field: 'locationName',
      displayName: 'Geolocation',
      width: '130'
    }, {
      field: 'equipmentSetupMethod',
      displayName: 'Setup Method',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200'
    }, {
      field: 'warehouseName',
      displayName: 'Warehouse',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200'
    },
    {
      field: 'PIDCode',
      displayName: 'Ref Assembly',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200'
    },
    {
      field: 'binName',
      displayName: 'Current ' + vm.LabelConstant.TransferStock.Bin,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200'
    },
    {
      field: 'binWarehouseName',
      displayName: 'Current ' + vm.LabelConstant.TransferStock.WH,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200'
    },
    {
      field: 'binParentWarehouseName',
      displayName: 'Current ' + vm.LabelConstant.TransferStock.ParentWH,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200'
    },
    {
      field: 'eqpTypeIDConvertedValue',
      displayName: 'Type',
      cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: allEquipmentFilter
      },
      ColumnDataType: 'StringEquals',
      width: '200'
    }, {
      field: 'eqpGroupIDConvertedValue',
      displayName: 'Group',
      cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
      width: '130'
    }, {
      field: 'eqpSubGroupIDConvertedValue',
      displayName: 'Sub Group',
      cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
      width: '130'
    }, {
      field: 'eqpOwnershipTypeIDConvertedValue',
      displayName: 'Ownership',
      cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
      width: '130'
    }, {
      field: 'placedInServiceDate',
      displayName: 'Placed In Service Date',
      type: 'date',
      cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.placedInServiceDate | date:grid.appScope.$parent.vm.DateFormatArray}}</div>',
      enableFiltering: false,
      enableSorting: false,
      width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN
    },
    {
      field: 'outOfServiceDate',
      displayName: 'Out Of Service Date',
      type: 'date',
      cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.outOfServiceDate | date:grid.appScope.$parent.vm.DateFormatArray}}</div>',
      enableFiltering: false,
      enableSorting: false,
      width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN
    }, {
      field: 'calibrationRequiredValue',
      width: 120,
      displayName: 'Require Calibration',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.calibrationRequiredValue ==\'Yes\', \
                            \'label-warning\':row.entity.calibrationRequiredValue == \'No\'}"> \
                                {{ COL_FIELD }}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.KeywordStatusGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals'
    }, {
      field: 'calibrationDate',
      displayName: 'Calibration Date',
      cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.calibrationDate | date:grid.appScope.$parent.vm.DateFormatArray}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
      type: 'date',
      enableFiltering: false
    },
    {
      field: 'calibrationExpirationDate',
      displayName: 'Calibration Expiration Date',
      cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.calibrationExpirationDate | date:grid.appScope.$parent.vm.DateFormatArray}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
      type: 'date',
      enableFiltering: false
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
      width: 130
    }, {
      field: 'updatedAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false
    }, {
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
    }
      , {
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
        SortColumns: [['assetName', 'ASC']],
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
      exporterCsvFilename: 'Equipment Workstation & Sample.csv'
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
    const setDataAfterGetAPICall = (equipment, isGetDataDown) => {
      if (equipment && equipment.data && equipment.data.equipment) {
        if (!isGetDataDown) {
          vm.sourceData = equipment.data.equipment;
          vm.currentdata = vm.sourceData.length;
        }
        else if (equipment.data.equipment.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(equipment.data.equipment);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = equipment.data.Count;
        vm.sourceData.map((item) => {
          item.isActiveStatus = (item.isActive) ? 'Active' : 'Inactive';
          item.placedInServiceDate = BaseService.getUIFormatedDate(item.placedInServiceDate, vm.DefaultDateFormat);
          item.outOfServiceDate = BaseService.getUIFormatedDate(item.outOfServiceDate, vm.DefaultDateFormat);
          item.calibrationDate = BaseService.getUIFormatedDate(item.calibrationDate, vm.DefaultDateFormat);
          item.calibrationExpirationDate = BaseService.getUIFormatedDate(item.calibrationExpirationDate, vm.DefaultDateFormat);
          if (item.equipmentAs === 'E') {
            item.equipmentSetupMethod = item.equipmentSetupMethod === CORE.EQUIPMENT_METHODS.SMTPickAndPlaceSetupAndVerfication ? CORE.EQUIPMENT_SETUP_METHODS.SMTPickAndPlaceSetupAndVerfication.Key : '';
          }
          else {
            item.equipmentSetupMethod = '';
          }
          setProfileImageInGrid(item);
        });

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
            const filterEquipmentType = _.find(vm.pagingInfo.SearchColumns, (col) => col.ColumnName === 'equipmentAs');
            if (vm.pagingInfo.SearchColumns.length === 1 && filterEquipmentType) {
              vm.isNoDataFound = true;
              vm.emptyState = null;
            }
            else {
              vm.isNoDataFound = false;
              vm.emptyState = 0;
            }
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

    const getGenericCategoryList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.EquipmentType.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: true
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((genericCategories) => {
        if (genericCategories && genericCategories.data) {
          GenericCategoryAllData = genericCategories.data;
          const EquipmentTypeList = _.filter(GenericCategoryAllData, (item) => item.parentGencCategoryID === null && item.categoryType === CategoryTypeObjList.EquipmentType.Name);
          allEquipmentFilter = [];
          allEquipmentFilter[0] = defaultObj;
          _.map(EquipmentTypeList, (data) => {
            const _obj = {};
            _obj.id = data.gencCategoryName;
            _obj.value = data.gencCategoryName;
            allEquipmentFilter.push(_obj);
          });
        }
        const eqpTypeIDConvertedIndex = vm.sourceHeader.indexOf(_.find(vm.sourceHeader, (item) => item.field === 'eqpTypeIDConvertedValue'));
        vm.sourceHeader[eqpTypeIDConvertedIndex].filter.options = allEquipmentFilter;
        return allEquipmentFilter;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const initGirdBinding = () => {
      vm.pagingInfo.SearchColumnName = 'equipmentAs';
      vm.pagingInfo.whereStatus = ['E', 'W', 'S'];
      return EquipmentFactory.retriveEquipmentList().query(vm.pagingInfo).$promise.then((equipment) => {
        if (equipment && equipment.data) {
          setDataAfterGetAPICall(equipment, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };


    /* retrieve Equipment list*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      const gridAndDropDownPromise = [initGirdBinding(), getGenericCategoryList()];
      vm.cgBusyLoading = $q.all(gridAndDropDownPromise).then(() => {
        $timeout(() => {
          setPopover();
        }, _configSecondTimeout);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* to get data on scroll down in grid */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = EquipmentFactory.retriveEquipmentList().query(vm.pagingInfo).$promise.then((equipment) => {
        if (equipment && equipment.data) {
          setDataAfterGetAPICall(equipment, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const setProfileImageInGrid = (item) => {
      if (!item.gencFileNameAsProfileImage) {
        item.imageURL = CORE.WEB_URL + CORE.NO_IMAGE_EQUIPMENT;
      }
      else {
        item.imageURL = CORE.WEB_URL + USER.EQUIPMENT_BASE_PATH + item.gencFileNameAsProfileImage;
      }
    };

    vm.selectedEquipment = () => vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;

    vm.fab = {
      Status: false
    };


    vm.addRecord = () => {
    };

    vm.updateRecord = (row) => {
      $state.go(USER.ADMIN_MANAGEEQUIPMENT_DETAIL_STATE, { eqpID: row ? row.entity.eqpID : null });
    };

    /* view equipment profile*/
    vm.viewRecord = (row) => {
      BaseService.goToEquipmentProfile(row.entity.eqpID);
    };

    // delete
    vm.deleteRecord = (equipment) => {
      let selectedIDs = [];
      if (equipment) {
        //selectedIDs = equipment.eqpID;
        selectedIDs.push(equipment.eqpID);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((equipmentItem) => equipmentItem.eqpID);
        }
      }

      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Equipment, Workstation & Sample', selectedIDs.length);
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
            vm.cgBusyLoading = EquipmentFactory.deleteEquipment().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res && res.data) {
                if (res.data.length > 0 || res.data.transactionDetails) {
                  const data = {
                    TotalCount: res.data.transactionDetails[0].TotalCount,
                    pageName: CORE.PageName.equipmentsandworkstations
                  };
                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const objIDs = {
                      id: selectedIDs,
                      CountList: true
                    };
                    return EquipmentFactory.deleteEquipment().query({ objIDs: objIDs }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.pageTitle = equipment ? equipment.assetName : null;
                      data.PageName = CORE.PageName.equipmentsandworkstations;
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
        messageContent.message = stringFormat(messageContent.message, 'equipment');
        const alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
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
    //Down-load equipment & workstation template
    vm.downloadDocument = () => {
      let messageContent;
      vm.cgBusyLoading = EquipmentFactory.downloadequipmentAndworkstationTemplate(vm.Model).then((response) => {
        if (response.status === 404) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
          DialogFactory.messageAlertDialog({ messageContent: messageContent, multiple: true });
        } else if (response.status === 403) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
          DialogFactory.messageAlertDialog({ messageContent: messageContent, multiple: true });
        } else if (response.status === 401) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
          DialogFactory.messageAlertDialog({ messageContent: messageContent, multiple: true });
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
    vm.openAddCalibrationDetailPopup = (row, event) => {
      const data = {};
      data.eqpId = row.entity.eqpID;
      const equipmentAsList = _.filter(CORE.EquipmentRadioGroup.equipmentAs, (item) => item.DefaultValue === row.entity.equipmentAs);
      data.equipmentAs = equipmentAsList[0].Value;

      const popUpData = { popupAccessRoutingState: [USER.ADMIN_MANAGE_CALIBRATION_DETAILS_POPUP_STATE], pageNameAccessLabel: CORE.PageName.CalibrationDetails };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        DialogFactory.dialogService(
          USER.ADMIN_ADD_UPDATE_CALIBRATION_DETAILS_MODAL_CONTROLLER,
          USER.ADMIN_ADD_UPDATE_CALIBRATION_DETAILS_MODAL_VIEW,
          event,
          data).then(() => {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }, (err) => BaseService.getErrorLog(err));
      }
    };
  }
})();
