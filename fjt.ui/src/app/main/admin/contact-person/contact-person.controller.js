(function () {
  'use strict';

  angular
    .module('app.admin.cotactPerson')
    .controller('CotactPersonController', CotactPersonController);

  /** @ngInject */
  function CotactPersonController($mdDialog, $scope, $timeout, $q, CORE, DialogFactory, BaseService, USER, ContactPersonFactory, TRANSACTION, MasterFactory, EmployeeFactory) {
    const vm = this;
    vm.isUpdatable = true;
    vm.showUMIDHistory = true;
    vm.isDeleteFeatureBased = true;
    vm.isCreateDuplicateContactPerson = true;
    vm.loginUser = BaseService.loginUser;
    vm.LabelConstant = CORE.LabelConstant;
    vm.configTimeout = _configTimeout;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    vm.ContactPersonGridHeaderDropdown = CORE.ContactPersonGridHeaderDropdown;
    vm.EamilSettingsForContactPerson = CORE.EmailSettingsforContPersonGridHeaderDropdown;
    vm.EmptyMesssages = USER.ADMIN_EMPTYSTATE.COMPONENT_FILTERS; // common filter empty message.
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.CONTACT_PERSON;
    vm.CheckSearchTypeList = TRANSACTION.CheckSearchType;
    vm.CORE_PhoneMobileFaxCategory = angular.copy(CORE.PhoneMobileFaxCategory);
    vm.gridConfig = CORE.gridConfig;
    vm.currentPageName = CORE.PAGENAME_CONSTANT[67].PageName;
    vm.actionButtonName = `${vm.currentPageName} History`;
    vm.ContactPersonAdvanceFilter = angular.copy(CORE.ContactPersonAdvanceFilter);
    vm.RefEntityTypeRadio = angular.copy(CORE.ContactPersonEntityRadioGroup.RefEntityTypeRadio);
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.updatecontactPersonFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToUpdateContactPerson);
    vm.isDeleteFeatureEnable = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToDeleteContactPerson);
    const convertArrayToObject = (arr, key) => _.reduce(arr, (obj, item) => { obj[item[key]] = item; return obj; }, {});
    vm.emailSettingforContPersonObj = convertArrayToObject(vm.EamilSettingsForContactPerson, 'key');
    vm.PhoneMobileFaxCategory = convertArrayToObject(CORE.PhoneMobileFaxCategory, 'objectKey');

    /* Init Advanced Filter Object. */
    const initFilterObj = () => {
      // Set object name same as "Vm.ContactPersonAdvanceFilter" object name.
      vm.filter = {
        refEntityType: null,
        isPrimary: false,
        isDefault: false,
        mfgIds: null,
        empIds: null,
        additionalComment: null,
        checkNameType: vm.CheckSearchTypeList[1].id,
        nameSearch: null
      };
    };
    initFilterObj();

    /* sourceHeader */
    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '120',
      cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="3"></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: false
    }, {
      field: '#',
      width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
      cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
      enableFiltering: false,
      enableSorting: false
    }, {
      field: 'refName',
      displayName: 'Supplier/Customer/Manufacturer',
      cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.refName">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToRefEntityTypeList(row.entity);" tabindex="-1">{{COL_FIELD}}</a>\
                        </div>',
      width: 250
    }, {
      field: 'refEntityType',
      displayName: 'Contact Person Type ',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center"><span class="label-box" ng-class="grid.appScope.$parent.vm.getLabelClassForEntityType(row.entity.refEntityType)"> {{ COL_FIELD }}</span></div>',
      enableFiltering: false,
      width: 192
    }, {
      field: 'personnel',
      displayName: 'Current Personnel Assigned',
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents">\
                      <a class= "cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToRefEntityTypeList(row.entity);" tabindex = "-1"> {{COL_FIELD}}</a>&nbsp; \
                      <md-icon md-font-icon="icon-history" ng-if="row.entity.personnel" ng-click="grid.appScope.$parent.vm.openContactPersonHistory(row.entity, $event)"><md-tooltip>{{grid.appScope.$parent.vm.LabelConstant.EmployeeContPersonHistory.ContPersonPopupTitle}}</md-tooltip></md-icon> \
                    </div>',
      width: 250
    }, {
      field: 'firstName',
      displayName: 'First Name',
      width: 250
    }, {
      field: 'middleName',
      displayName: 'Middle Name',
      width: 200
    }, {
      field: 'lastName',
      displayName: 'Last Name',
      width: 250
    }, {
      field: 'title',
      displayName: 'Title',
      width: 200
    }, {
      field: 'division',
      displayName: 'Department',
      width: 200
    }, {
      field: 'emailList',
      displayName: 'Email',
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents layout-wrap">'
        + ' <span class="label-box margin-left-2 mb-5 text-transform-none"  ng-class="{\'label-primary\': item.isprimary, \'md-hue-3 md-accent-bg\': !item.isprimary}" '
        + ' ng-repeat="item in row.entity.emailsList track by $index">{{item.email}} '
        + ' <copy-text label="\'Email\'" text="item.email" ng-if="item.email"></copy-text></span> '
        + ' </div> ',
      width: 300
    }, {
      field: 'mailToValue',
      displayName: 'Default Communication To',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center"><span class="label-box" \
                       ng-class="{\'label-primary\':row.entity.mailToValue === grid.appScope.$parent.vm.emailSettingforContPersonObj.primaryEmail.id, \'label-success\':row.entity.mailToValue == grid.appScope.$parent.vm.emailSettingforContPersonObj.allEmail.id,  \'label-warning\':row.entity.mailToValue === grid.appScope.$parent.vm.emailSettingforContPersonObj.none.id}" > \
                       {{ COL_FIELD }}</span ></div > ',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.EamilSettingsForContactPerson
      },
      ColumnDataType: 'StringEquals',
      width: 150
    }, {
      field: 'workNumber',
      displayName: 'Work Number',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents layout-wrap"> <span class="label-box margin-left-2 mb-5 {{grid.appScope.$parent.vm.getClassNameforOtherPhones(item)}}" '
        + 'ng-repeat="item in row.entity.workNumbers track by $index">{{item.phone}}<copy-text label="\'Work Number\'" text="item.phone" ng-if="item.phone"></copy-text><md-tooltip>{{item.category}}</md-tooltip></span> '
        + ' </div> ',
      width: 330
    }, {
      field: 'faxNum',
      displayName: 'Fax Number',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents layout-wrap"> <span class="label-box margin-left-2 mb-5 {{grid.appScope.$parent.vm.getClassNameforOtherPhones(item)}}" '
        + 'ng-repeat="item in row.entity.faxNumbers track by $index">{{item.phone}}<copy-text label="\'Fax Number\'" text="item.phone" ng-if="item.phone"></copy-text><md-tooltip>{{item.category}}</md-tooltip></span> '
        + ' </div> ',
      width: 330
    }, {
      field: 'mobileNumber',
      displayName: 'Mobile Number',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents layout-wrap"> <span class="label-box margin-left-2 mb-5 {{grid.appScope.$parent.vm.getClassNameforOtherPhones(item)}}" '
        + 'ng-repeat="item in row.entity.mobileNumbers track by $index">{{item.phone}}<copy-text label="\'Mobile Number\'" text="item.phone" ng-if="item.phone"></copy-text><md-tooltip>{{item.category}}</md-tooltip></span> '
        + ' </div> ',
      width: 330
    }, {
      field: 'mainNumber',
      displayName: 'Main Number',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents layout-wrap"> <span class="label-box margin-left-2 mb-5 {{grid.appScope.$parent.vm.getClassNameforOtherPhones(item)}}" '
        + 'ng-repeat="item in row.entity.mainNumbers track by $index">{{item.phone}}<copy-text label="\'Main Number\'" text="item.phone" ng-if="item.phone"></copy-text><md-tooltip>{{item.category}}</md-tooltip></span> '
        + ' </div> ',
      width: 330
    }, {
      field: 'otherNum',
      displayName: 'Other Number',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents layout-wrap"> <span class="label-box margin-left-2 mb-5 {{grid.appScope.$parent.vm.getClassNameforOtherPhones(item)}}" '
        + 'ng-repeat="item in row.entity.otherNumbers track by $index">{{item.phone}}<copy-text label="\'Other Number\'" text="item.phone" ng-if="item.phone"></copy-text><md-tooltip>{{item.category}}</md-tooltip></span></span> '
        + ' </div> ',
      width: 330
    }, {
      field: 'isPrimaryValue',
      displayName: 'Primary Person',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center"><span class="label-box" ng-class="{\'label-success\':row.entity.isPrimary == true, \'label-warning\':row.entity.isPrimary == false}"> {{ COL_FIELD }}</span></div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      enableFiltering: false,
      width: 120
    }, {
      field: 'isDefaultValue',
      displayName: 'Default "Attention To"',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center"><span class="label-box" ng-class="{\'label-success\':row.entity.isDefault == true, \'label-warning\':row.entity.isDefault == false}"> {{ COL_FIELD }}</span></div>',
      enableFiltering: false,
      width: 120
    }, {
      field: 'additionalComment',
      displayName: 'Comment',
      cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
        '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
        '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.additionalComment && row.entity.additionalComment !== \'-\'" ng-click="grid.appScope.$parent.vm.showDescription(\'Comment\',row.entity.additionalComment, $event)">' +
        '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
        '<md-tooltip>View</md-tooltip>' +
        '</button>' +
        '</div>',
      width: 300
    }, {
      field: 'isActiveValue',
      displayName: 'Status',
      cellTemplate: '<div class="ui-grid-cell-contents">' +
        '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isActive == true, \
                            \'label-warning\':row.entity.isActive == false}"> \
                                {{ COL_FIELD }}' +
        '</span>' +
        '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.StatusOptionsGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      width: '120'
    }, {
      field: 'syatemGeneratedValue',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_SYSTEM_GENERATED,
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center"><span class="label-box" ng-class="{\'label-success\':row.entity.systemGenerated == true, \'label-warning\':row.entity.systemGenerated == false}"> {{ COL_FIELD }}</span></div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.KeywordStatusGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      width: 120
    }, {
      field: 'updatedAtValue',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false,
      visible: false
    }, {
      field: 'updatedbyValue',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: false
    }, {
      field: 'updatedbyRoleValue',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: false
    }, {
      field: 'createdAtValue',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false
    }, {
      field: 'createdbyValue',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      enableSorting: true,
      enableFiltering: true
    }, {
      field: 'createdbyRoleValue',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: false
    }];

    vm.sourceHeader.unshift(
      {
        field: 'Apply',
        headerCellTemplate: '<md-checkbox class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" ng-model="grid.appScope.$parent.vm.Apply" \
                            ng-change="grid.appScope.$parent.vm.applyAll(grid.appScope.$parent.vm.Apply)"></md-checkbox>',
        width: '75',
        cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" style="overflow:initial"><md-checkbox  ng-disabled="row.entity.isDisabledDelete"  ng-model="row.entity.isRecordSelectedForRemove" \
                            ng-change="grid.appScope.$parent.vm.setContPersonRemove(row.entity)"></md-checkbox></div>',
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

    /* Init Page Info Configuration */
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['isDefault', 'DESC'], ['isPrimary', 'DESC'], ['firstName', 'ASC']],
        SearchColumns: []
      };
    };
    initPageInfo();

    /* Grid Options */
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
      exporterCsvFilename: 'Contact Persons.csv',
      CurrentPage: vm.currentPageName,
      allowToExportAllData: true,
      /* Calls everytime for Export All Data [rowType = ALL] */
      exporterAllDataFn: () => {
        /* For scrolling pagination vm.pagingInfo.Page is increase everytime so we have to set API side pagePerReocrds as NULL for Export All Data */
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return ContactPersonFactory.retrieveContactPersonList().query(pagingInfoOld).$promise.then((contactPerson) => {
          if (contactPerson && contactPerson.status === CORE.ApiResponseTypeStatus.SUCCESS && contactPerson.data && contactPerson.data.ContactPerson) {
            return contactPerson.data.ContactPerson;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* Generate tooltip for Contact Person Type. */
    const getRefEntityTypeFilterTooltip = () => {
      const RefEntityType = _.find(vm.RefEntityTypeRadio, (item) => item.Value === vm.filter.refEntityType);
      return RefEntityType ? RefEntityType.Key : null;
    };

    /* Common code for Gererate Filter. */
    const generateFilter = (name, filterName, tooltip) => {
      if (vm.filter[name]) {
        vm.generateFilter = true;
        vm.pagingInfo[name] = vm.filter[name];
        vm.ContactPersonAdvanceFilter[filterName].isDeleted = false;
        vm.ContactPersonAdvanceFilter[filterName].tooltip = tooltip || vm.filter[name];
      } else {
        vm.pagingInfo[name] = null;
        vm.ContactPersonAdvanceFilter[filterName].isDeleted = true;
      }
    };

    /* Generate Filter for Multiselection*/
    const generateFilterForMultiSelect = (name, filterName, displayList, filterList, keyColumnId, keyColumnName) => {
      if (vm.filter[name] && vm.filter[name].length > 0) {
        vm.generateFilter = true;
        vm.pagingInfo[name] = _.map(vm.filter[name]).join();
        vm.ContactPersonAdvanceFilter[filterName].isDeleted = false;
        vm.ContactPersonAdvanceFilter[filterName].tooltip = getFilterTooltip(displayList, filterList, keyColumnId, keyColumnName);
      } else {
        vm.pagingInfo[name] = null;
        vm.ContactPersonAdvanceFilter[filterName].isDeleted = true;
      }
    };

    /* generate filter for Operation list page */
    const generateSearchFilter = () => {
      vm.generateFilter = false;

      generateFilter('refEntityType', 'RefEntityType', getRefEntityTypeFilterTooltip());   // Contact Person Type Filter.
      generateFilter('isPrimary', 'Primary', 'Yes');    // Is Primary Filter.
      generateFilter('isDefault', 'Default', 'Yes');    // Is Default Filter.
      // generateFilter('refName', 'RefName', null);    // Supplier/Customer/Manufacturer Filter.
      generateFilter('additionalComment', 'Comment', null);    // Comment Filter.
      generateFilter('nameSearch', 'NameSearch', null);    // First Name / Middle Name /Last Name Filter.
      vm.pagingInfo['checkNameType'] = vm.filter.checkNameType; // Check First Name / Middle Name / Last Name Search type.
      generateFilterForMultiSelect('mfgIds', 'MfgIds', vm.customerListToDisplay, vm.filter.mfgIds, 'id', 'mfgCodeName');   // Supplier/Customer/Manufacturer Filter.
      generateFilterForMultiSelect('empIds', 'EmpIds', vm.personnelListToDisplay, vm.filter.empIds, 'id', 'formattedEmpName');   // Current Personnel Assigned filter.

      vm.ContactPersonAdvanceFilter.ClearAll.isDeleted = !vm.generateFilter;
      if (vm.gridOptions && vm.gridOptions.gridApi) {
        vm.isUiGridColumnFiltersApplied = _.some(vm.gridOptions.gridApi.grid.columns, (col) => !_.isEmpty(col.filters[0].term));
      }
    };

    /* Manage Caterory Wise Phone Numbers for Display on Grid. */
    const managePhones = (row) => {
      try {
        if (row.workNum) {
          row.workNumbers = JSON.parse(row.workNum);
          row.workNumber = (_.map(row.workNumbers, 'phone')).join(', ');
        } else {
          row.workNumbers = [];
          row.workNumber = '';
        }
        if (row.mobileNum) {
          row.mobileNumbers = JSON.parse(row.mobileNum);
          row.mobileNumber = (_.map(row.mobileNumbers, 'phone')).join(', ');
        } else {
          row.mobileNumbers = [];
          row.mobileNumber = '';
        }
        if (row.mainNum) {
          row.mainNumbers = JSON.parse(row.mainNum);
          row.mainNumber = (_.map(row.mainNumbers, 'phone')).join(', ');
        } else {
          row.mainNumbers = [];
          row.mainNumber = '';
        }
        if (row.faxNumJson) {
          row.faxNumbers = JSON.parse(row.faxNumJson);
        } else {
          row.faxNumbers = [];
        }
        if (row.otherNumJson) {
          row.otherNumbers = JSON.parse(row.otherNumJson);
        } else {
          row.otherNumbers = [];
        }
      } catch (ex) { /* Catch Error */ }
    };

    /* to set data in grid after data is retrived from API in loadData() and getDataDown() function */
    const setDataAfterGetAPICall = (contactPerson, isGetDataDown) => {
      if (contactPerson && contactPerson.data && contactPerson.data.ContactPerson) {
        _.each(contactPerson.data.ContactPerson, (item) => {
          item.isDisabledDelete = item.systemGenerated || !vm.isDeleteFeatureEnable;
          item.isDisabledUpdate = item.systemGenerated;
          if (item.isDisabledDelete) { item.isRowSelectable = false; }
          managePhones(item);
          try { item.emailsList = item.email ? JSON.parse(item.email) : []; } catch (ex) { /* Catch Error */ }
        });

        if (!isGetDataDown) {
          vm.sourceData = contactPerson.data.ContactPerson;
          vm.currentdata = vm.sourceData.length;
        }
        else if (contactPerson.data.ContactPerson.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(contactPerson.data.ContactPerson);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = contactPerson.data.Count;
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
            if (vm.generateFilter) {
              vm.isNoDataFound = false;
              vm.emptyState = 0;
            } else {
              vm.isNoDataFound = true;
              vm.emptyState = null;
            }
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

    /* to bind data in grid on load */
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      // Add Custom filter
      generateSearchFilter();
      vm.Apply = false;
      vm.cgBusyLoading = ContactPersonFactory.retrieveContactPersonList().query(vm.pagingInfo).$promise.then((contactPerson) => {
        if (contactPerson && contactPerson.data) {
          setDataAfterGetAPICall(contactPerson, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* to get data on scroll down in grid */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = ContactPersonFactory.retrieveContactPersonList().query(vm.pagingInfo).$promise.then((contactPerson) => {
        if (contactPerson && contactPerson.data) {
          setDataAfterGetAPICall(contactPerson, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Get class name for Phone by category. */
    vm.getClassNameforOtherPhones = (categoryObj) => {
      if (categoryObj.isPrimary === 'true') {
        return 'label-primary';
      } else {
        const categoryDet = _.find(vm.CORE_PhoneMobileFaxCategory, (item) => item.key === categoryObj.category);
        return categoryDet ? categoryDet.className : null;
      }
    };

    /* get customer list */
    vm.getCustomerList = () => MasterFactory.getCustMfrDistList().query().$promise.then((response) => {
      if (response && response.data) {
        vm.CustomerList = vm.customerListToDisplay = response.data;
        return vm.CustomerList;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    /* clear customer filter */
    vm.clearCustomerFilter = () => {
      vm.filter.mfgIds = [];
    };

    /* clear customer search text */
    vm.clearCustomerSearchText = () => {
      vm.filter.CustomerSearchText = undefined;
      vm.searchCustomerList();
    };

    /* search customer list */
    vm.searchCustomerList = () => {
      const customerListToFilter = angular.copy(vm.CustomerList);
      vm.customerListToDisplay = vm.filter.CustomerSearchText ? _.filter(customerListToFilter, (item) => item.mfgName.toLowerCase().contains(vm.filter.CustomerSearchText.toLowerCase())) : customerListToFilter;
    };

    /* get Personnel list */
    vm.getPersonnelList = () => EmployeeFactory.employeeList().query().$promise.then((response) => {
      if (response && response.data) {
        vm.PersonnelList = vm.personnelListToDisplay = response.data;
        return vm.PersonnelList;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    /* clear assigned personnel filter */
    vm.clearPersonnelFilter = () => {
      vm.filter.empIds = [];
    };

    /* clear personnel search text */
    vm.clearPersonnelSearchText = () => {
      vm.filter.personnelSearchText = undefined;
      vm.searchPersonnelList();
    };

    /* search Personnel list */
    vm.searchPersonnelList = () => {
      const personnelListToFilter = angular.copy(vm.PersonnelList);
      vm.personnelListToDisplay = vm.filter.personnelSearchText ? _.filter(personnelListToFilter, (item) => item.formattedEmpName.toLowerCase().contains(vm.filter.personnelSearchText.toLowerCase())) : personnelListToFilter;
    };

    const autocompletePromise = [vm.getCustomerList(), vm.getPersonnelList()];
    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => { // Empty Block.
    }).catch((error) => BaseService.getErrorLog(error));

    //apply all details
    vm.applyAll = (applyAll) => {
      if (applyAll) {
        _.map(vm.sourceData, selectContPerson);
      } else {
        _.map(vm.sourceData, unselectContPerson);
      }
    };
    const selectContPerson = (row) => {
      row.isRecordSelectedForRemove = row.isDisabledDelete ? false : true;
      if (row.isRecordSelectedForRemove) {
        vm.gridOptions.gridApi.selection.selectRow(row);
      }
    };
    const unselectContPerson = (row) => {
      row.isRecordSelectedForRemove = false;
      vm.gridOptions.clearSelectedRows();
    };
    vm.setContPersonRemove = (row) => {
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
    vm.selectedContactPerson = () => vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;

    /* Get Label Class for Contat Person type for UI Grid */
    vm.getLabelClassForEntityType = (entityType) => {
      const entityObj = _.find(vm.ContactPersonGridHeaderDropdown, (item) => item.id === entityType);
      return entityObj ? entityObj.labelClass : null;
    };

    /* advance search */
    vm.applyFilters = () => {
      vm.loadData();
    };

    /* On Enter KeyPress Apply Filter. */
    vm.applyFiltersOnEnter = (event) => {
      if (event.keyCode === 13) {
        vm.applyFilters();
      }
    };

    /* clear Selected Filter */
    vm.clearSelection = () => {
      vm.resetAllFilter();  // There is currently no difference between clear or reset filters for a contact person page.
    };

    /* Clear grid Column Filter */
    vm.clearGridColumnFilter = (item) => {
      if (item) {
        item.filters[0].term = undefined;
        if (!item.isFilterDeregistered) {
          //refresh data grid
          vm.gridOptions.gridApi.grid.onClearUnregisteredColumnFilter();
        }
      }
    };

    /* reset filter */
    vm.resetAllFilter = (isfromClear) => {
      initFilterObj();
      if (vm.gridOptions.gridApi) {
        vm.gridOptions.gridApi.core.clearAllFilters();
      }
      if (!isfromClear) {
        vm.loadData();
      }
    };

    /* remove advance search filter */
    vm.removeAppliedFilter = (item) => {
      if (item) {
        item.isDeleted = true;
        if (item.value === vm.ContactPersonAdvanceFilter.ClearAll.value) {
          vm.resetAllFilter(true);
        } else {
          vm.filter[item.name] = null;
        }
        vm.loadData();
      }
    };

    /* update Contact Person */
    vm.updateRecord = (contactPersonData, ev) => {
      const popUpData = { popupAccessRoutingState: [USER.ADMIN_CONTACT_PERSON_STATE], pageNameAccessLabel: CORE.PageName.ContactPerson };
      if (BaseService.checkRightToAccessPopUp(popUpData)) {
        const data = {
          isFromListPage: true,
          isFromMasterpage: true,
          refEntityType: contactPersonData && contactPersonData.entity ? contactPersonData.entity.refEntityType : null,
          personId: contactPersonData && contactPersonData.entity ? contactPersonData.entity.personId : null
        };
        DialogFactory.dialogService(
          USER.ADMIN_MANAGE_CONTACTPERSON_MODAL_CONTROLLER,
          USER.ADMIN_MANAGE_CONTACTPERSON_MODAL_VIEW,
          ev,
          data).then(() => {
          }, (data) => {
            if (data && (data.personId || data.isDuplicateActionPerformed)) {
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          }, (err) => BaseService.getErrorLog(err));
      }
    };

    /* delete operationmastertemplate*/
    vm.deleteRecord = (contactPerson) => {
      if (vm.isDeleteFeatureEnable) {
        let selectedIDs = [];
        if (contactPerson) {
          selectedIDs.push(contactPerson.personId);
        } else {
          vm.selectedRows = vm.selectedRowsList;
          if (vm.selectedRows.length > 0) {
            selectedIDs = vm.selectedRows.map((contactPersonItem) => contactPersonItem.personId);
          }
        }

        if (selectedIDs) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, vm.currentPageName, selectedIDs.length);
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
              vm.cgBusyLoading = ContactPersonFactory.deleteCustomerContactPerson().query({ objIDs: objIDs }).$promise.then((res) => {
                if (res) {
                  if (res.data && (res.data.length > 0 || res.data.transactionDetails)) {
                    const data = {
                      TotalCount: res.data.transactionDetails[0].TotalCount,
                      pageName: vm.currentPageName
                    };
                    BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                      const IDs = {
                        id: selectedIDs,
                        CountList: true
                      };
                      return ContactPersonFactory.deleteCustomerContactPerson().query({
                        objIDs: IDs
                      }).$promise.then((res) => {
                        let data = {};
                        data = res.data;
                        data.pageTitle = contactPerson ? contactPerson.formattedName : null;
                        data.PageName = vm.currentPageName;
                        data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' selected');
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
                  } else {
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
          messageContent.message = stringFormat(messageContent.message, vm.currentPageName);
          const alertModel = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(alertModel);
        }
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    /* Create Duplicate Contact Person. */
    vm.createDuplicateContactPerson = (contactPersonData, ev) => {
      const data = {
        personId: contactPersonData ? contactPersonData.personId : null,
        refEntityType: contactPersonData ? contactPersonData.refEntityType : null,
        isFromListPage: true,
        isFromMasterpage: true
      };

      DialogFactory.dialogService(
        USER.ADMIN_DUPLICATE_CONTACTPERSON_MODAL_CONTROLLER,
        USER.ADMIN_DUPLICATE_CONTACTPERSON_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (data) => {
          if (data && data.personId) {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    /* show phone number color legend on click of pallet icon */
    vm.showColorLengend = (ev) => {
      const data = {
        pageName: 'Phone Type',
        legendList: CORE.LegendList.phoneCategory
      };
      DialogFactory.dialogService(
        CORE.LEGEND_MODAL_CONTROLLER,
        CORE.LEGEND_MODAL_VIEW,
        ev,
        data).then(() => {
          //sucess section
        }, (error) => BaseService.getErrorLog(error));
    };

    /* to display Additional Comment */
    vm.showDescription = (title, description, ev) => {
      const popupData = {
        title: title,
        description: description
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        popupData).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    // Open contact person history popup.
    vm.openContactPersonHistory = (row, ev) => {
      const data = {
        title: CORE.LabelConstant.EmployeeContPersonHistory.ContPersonPopupTitle,
        contactPersonId: row.personId,
        headerData: [{
          label: CORE.PageName.ContactPerson,
          value: row.formattedName,
          displayOrder: 1,
          labelLinkFn: vm.goToContactPersonList
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

    /* Show History Popup */
    vm.UMIDHistory = (row, ev) => {
      const data = angular.copy(row);
      data.id = data.personId;
      data.title = `${vm.currentPageName} History`;
      data.TableName = CORE.DATAENTRYCHANGE_AUDITLOG_TABLENAME.CONTACT_PERSON;
      data.EmptyMesssage = stringFormat(CORE.COMMON_HISTORY.MESSAGE, `${vm.currentPageName} history`);
      data.headerData = [{
        label: vm.currentPageName,
        value: data.formattedName,
        displayOrder: 1,
        labelLinkFn: vm.goToContactPersonList
      }];

      DialogFactory.dialogService(
        CORE.COMMON_HISTORY_POPUP_MODAL_CONTROLLER,
        CORE.COMMON_HISTORY_POPUP_MODAL_VIEW,
        ev,
        data).then(() => { }, (err) => BaseService.getErrorLog(err));
    };

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    /* Go to manage Page of Ref Name. */
    vm.goToRefEntityTypeList = (row) => {
      if (row.refEntityType === CORE.ContactPersonRefEntities.CustomerAndManufacturer) {
        BaseService.goToManufacturer(row.refTransID);
      } else if (row.refEntityType === CORE.ContactPersonRefEntities.Supplier) {
        BaseService.goToSupplierDetail(row.refTransID);
      } else if (row.refEntityType === CORE.ContactPersonRefEntities.Personnel) {
        BaseService.goToManagePersonnel(row.refTransID);
      }
    };

    /* Go to Contact Person List */
    vm.goToContactPersonList = () => {
      BaseService.goToContactPersonList();
    };

    /* close popup on page destroy */
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });

    angular.element(() => {
      vm.updateContactPerson = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToUpdateContactPerson);
    });
  }
})();
