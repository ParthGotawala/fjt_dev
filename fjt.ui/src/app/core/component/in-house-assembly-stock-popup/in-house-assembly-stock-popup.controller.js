(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('InHouseAssemblyStockPopupController', InHouseAssemblyStockPopupController);

  /** @ngInject */
  function InHouseAssemblyStockPopupController($timeout, $scope, data, CORE, USER, BaseService, MasterFactory, DialogFactory, InHouseAssemblyStockPopupFactory, GenericCategoryFactory, $q) {
    const vm = this;

    var woID = data.woID;
    var isDataChanged = false;
    vm.headerdata = [];
    vm.woAllLabelConstant = CORE.LabelConstant.Workorder;
    vm.assyAllLabelConstant = CORE.LabelConstant.Assembly;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    const geoLocationCategoryTypeObj = angular.copy(CORE.CategoryType.LocationType);
    vm.inHouseAssyModel = {
      location: null,
      serialNoDescription: null,
      notes: null
    };
    vm.workorder = null;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    const searchColumn = {
      ColumnDataType: 'Number',
      ColumnName: 'woID',
      SearchString: woID
    };

    // Assembly
    vm.goToAssemblyList = () => {
      BaseService.goToPartList();
      return false;
    };
    vm.goToAssemblyDetails = (data) => {
      BaseService.goToComponentDetailTab(null, data.partID);
      return false;
    };

    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };

    //redirect to work order details
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(woID);
      return false;
    };

    getWorkorderDetails();

    function getWorkorderDetails() {
      vm.headerdata = [];
      vm.cgBusyLoading = MasterFactory.getWODetails().query({ woID: woID }).$promise.then((response) => {
        if (response && response.data) {
          vm.workorder = {
            woNumber: response.data.woNumber,
            partID: response.data.partID,
            woVersion: response.data.woVersion,
            PIDCode: response.data.componentAssembly ? response.data.componentAssembly.PIDCode : null,
            nickName: response.data.componentAssembly ? response.data.componentAssembly.nickName : null,
            mfgPN: response.data.componentAssembly ? response.data.componentAssembly.mfgPN : null,
            rohsIcon: response.data.rohs ? response.data.rohs.rohsIcon : null,
            rohsStatus: response.data.rohs ? response.data.rohs.name : null
          };

          vm.headerdata.push({
            label: vm.woAllLabelConstant.WO,
            value: angular.copy(vm.workorder.woNumber),
            displayOrder: 1,
            labelLinkFn: vm.goToWorkorderList,
            valueLinkFn: vm.goToWorkorderDetails
          }, {
            label: vm.woAllLabelConstant.Version,
            value: angular.copy(vm.workorder.woVersion),
            displayOrder: 2
          }, {
            label: vm.assyAllLabelConstant.PIDCode,
            value: angular.copy(vm.workorder.PIDCode),
            displayOrder: 3,
            labelLinkFn: vm.goToAssemblyList,
            valueLinkFn: vm.goToAssemblyDetails,
            valueLinkFnParams: { partID: vm.workorder.partID },
            isCopy: true,
            isCopyAheadLabel: true,
            isAssy: true,
            isCopyAheadOtherThanValue: true,
            copyAheadLabel: vm.assyAllLabelConstant.MFGPN,
            copyAheadValue: vm.workorder.mfgPN,
            imgParms: {
              imgPath: vm.rohsImagePath + vm.workorder.rohsIcon,
              imgDetail: vm.workorder.rohsStatus
            }
          }, {
            label: vm.assyAllLabelConstant.NickName,
            value: angular.copy(vm.workorder.nickName),
            displayOrder: 4
          });
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    }
    // [S] UI-GRID

    vm.isUpdatable = true;

    // Hide delete button if user is not admin and super admin
    const userDetails = BaseService.loginUser;
    vm.isHideDelete = !userDetails.isUserAdmin && !userDetails.isUserSuperAdmin;

    vm.EmptyMesssage = CORE.EMPTYSTATE.IN_HOUSE_ASSEMBLY_STOCK;

    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '70',
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
      }, {
        field: 'location',
        displayName: 'Geolocation',
        width: 250,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      }, {
        field: 'serialNoDescription',
        displayName: 'Serial# Description',
        width: 270,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      }, {
        field: 'notes',
        displayName: 'Notes',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 270
      },
      {
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
      }, {
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
        enableFiltering: true
      }
    ];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['id', 'DESC']],
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
      exporterCsvFilename: 'Assembly Stock Details.csv'
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (response, isGetDataDown) => {
      if (response && response.data && response.data.data) {
        if (!isGetDataDown) {
          vm.sourceData = response.data.data;
          vm.currentdata = vm.sourceData.length;
        }
        else if (response.data.data.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(response.data.data);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = response.data.Count;
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
            const filterCategoryType = _.find(vm.pagingInfo.SearchColumns, (col) => col.ColumnName === 'woID');
            if (vm.pagingInfo.SearchColumns.length === 1 && filterCategoryType) {
              vm.isNoDataFound = true;
              vm.emptyState = null;
            }
            else if (vm.pagingInfo.SearchColumns.length > 1 || !_.isEmpty(vm.SearchMode)) {
              vm.isNoDataFound = false;
              vm.emptyState = 0;
            }
            else {
              vm.isNoDataFound = true;
              vm.emptyState = null;
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
      }
    };

    /* retrieve Users list*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.pagingInfo.SearchColumns.push(searchColumn);
      vm.cgBusyLoading = InHouseAssemblyStockPopupFactory.getWOAssyExcessStockLocationList().query(vm.pagingInfo).$promise.then((response) => {
        if (response && response.data) {
          setDataAfterGetAPICall(response, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.pagingInfo.SearchColumns.push(searchColumn);
      vm.cgBusyLoading = InHouseAssemblyStockPopupFactory.getWOAssyExcessStockLocationList().query(vm.pagingInfo).$promise.then((response) => {
        if (response && response.data) {
          setDataAfterGetAPICall(response, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.updateRecord = (row) => {
      vm.inHouseAssyModel = {
        id: row.entity.id,
        serialNoDescription: row.entity.serialNoDescription,
        notes: row.entity.notes
      };
      vm.autoCompleteGeolocation.keyColumnId = row.entity.geolocationId;
    };

    vm.deleteRecord = (entity) => {
      let selectedIDs = [];
      let locations = null;
      if (entity) {
        selectedIDs.push(entity.id);
        locations = entity.location;
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((item) => item.id);
          locations = vm.selectedRows.map((item) => item.location);
        }
      }

      if (selectedIDs) {
        const obj = {
          title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, 'Location Assembly stock'),
          textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_MESSAGE, selectedIDs.length, 'Location Assembly stock'),
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.confirmDiolog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = InHouseAssemblyStockPopupFactory.deleteWOAssyExcessStockLocation().save({
              woID: woID,
              ids: selectedIDs,
              woNumber: vm.workorder ? vm.workorder.woNumber : '-',
              partID: vm.workorder ? vm.workorder.partID : '-',
              location: locations
            }).$promise.then(() => {
              reloadUIGrid();
              isDataChanged = true;
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    // [E] UI-GRID

    // retrieve Geolocation list
    const getGeolocationList = () => {
      vm.geolocationList = [];
      const GencCategoryType = [];
      GencCategoryType.push(geoLocationCategoryTypeObj.Name);
      const listObj = {
        GencCategoryType: GencCategoryType
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((genericCategories) => {
        vm.geolocationList = genericCategories && genericCategories.data ? genericCategories.data : [];
        return $q.resolve(vm.geolocationList);
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getGeolocationList();

    vm.autoCompleteGeolocation = {
      columnName: 'gencCategoryName',
      keyColumnName: 'gencCategoryID',
      keyColumnId: null,
      inputName: geoLocationCategoryTypeObj.Name,
      placeholderName: 'Geolocation',
      isRequired: true,
      isAddnew: true,
      isAddFromRoute: true,
      routeName: USER.ADMIN_LOCATIONTYPE_MANAGEGENERICCATEGORY_STATE,
      addData: {
        routeParams: {
          categoryTypeID: geoLocationCategoryTypeObj.ID
        }
      },
      callbackFn: getGeolocationList,
      onSelectCallbackFn: (item) => {
        vm.inHouseAssyModel.location = item ? item.gencCategoryName : null;
        vm.inHouseAssyModel.geolocationId = item ? item.gencCategoryID : null;
      }
    };

    vm.cancelInHouseAssyStock = () => {
      clearModel();
      clearFormErrors();
    };

    function clearModel() {
      vm.inHouseAssyModel = {
        location: null,
        geolocationId: null,
        serialNoDescription: null,
        notes: null
      };
      $scope.$broadcast(vm.autoCompleteGeolocation.inputName + 'searchText', null);
    }

    function clearFormErrors() {
      $timeout(() => {
        vm.frmInhouseAssyStock.$setPristine();
        vm.frmInhouseAssyStock.$setUntouched();
        setFocusByName(vm.autoCompleteGeolocation.inputName);
      });
    }

    vm.save = () => {
      if (vm.frmInhouseAssyStock.$invalid) {
        BaseService.focusRequiredField(vm.frmInhouseAssyStock);
        vm.isSubmit = true;
        return;
      }
      vm.inHouseAssyModel.woID = woID;
      vm.inHouseAssyModel.woNumber = vm.workorder ? vm.workorder.woNumber : '-';
      vm.inHouseAssyModel.partID = vm.workorder ? vm.workorder.partID : '-';
      vm.cgBusyLoading = InHouseAssemblyStockPopupFactory.saveWOAssyExcessStockLocation().save(vm.inHouseAssyModel).$promise.then((response) => {
        if (response && response.data) {
          vm.cancelInHouseAssyStock();
          BaseService.currentPagePopupForm.pop();
          reloadUIGrid();
          isDataChanged = true;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    function reloadUIGrid() {
      BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
    }
    /*Check form dirty*/
    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
    /*Cancel button event*/
    vm.cancel = () => {
      // Check vm.isChange flag for color picker dirty object
      vm.inHouseAssyModel = {
        location: null,
        serialNoDescription: null,
        notes: null
      };
      const isdirty = vm.checkFormDirty(vm.frmInhouseAssyStock, vm.inHouseAssyModel);
      if (isdirty) {
        const data = {
          form: vm.frmInhouseAssyStock
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        DialogFactory.closeDialogPopup(isDataChanged);
      }
    };

    //Redirect to Geolocation master
    vm.goToLocationList = () => {
      BaseService.goToGenericCategoryLocationsList();
    };

    /**Used to validate max size*/
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    //on load submit form
    angular.element(() => BaseService.currentPagePopupForm.push(vm.frmInhouseAssyStock));
  }
})();
