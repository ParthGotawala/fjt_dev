(function () {
  'use strict';

  angular
    .module('app.admin.dynamicmessage')
    .controller('manageDynamicMessageDBPopUpController', manageDynamicMessageDBPopUpController);

  /** @ngInject */
  function manageDynamicMessageDBPopUpController(CORE, USER, BaseService, DynamicMessageFactory, data, $mdDialog, $timeout, DialogFactory, PageDetailFactory, $q) {
    const vm = this;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.gridConfig = CORE.gridConfig;
    vm.dynamicMessageModel =
      {
        _id: '',
        messageKey: '',
        messageCode: '',
        messageType: '',
        category: '',
        message: '',
        versionNumber: ''
      };
    vm.dynamicArgument = [];
    vm.whereUsedData = [];
    vm.whereUsedHeader = [];
    vm.totalDataCount = 0;
    vm.currentdata = 0;
    vm.isGridVisible = false;
    vm.isDisabledWhereUsed = false;
    vm.isDisabledSave = false;

    let initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: []
      };
    }

    initPageInfo();

    vm.isNoDataFound = false;
    vm.messageTypeList = angular.copy(CORE.DYNAMIC_MESSAGE_TYPE);
    vm.messageCategoryList = angular.copy(CORE.DYNAMIC_MESSAGE_CATEGORY);

    vm.messageNote = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE_VARIABLE_NOTES;// pre defined notes for dynamic message
    vm.CORE_MESSAGE = CORE.MESSAGE_CONSTANT;

    vm.isSubmit = false;
    vm.isContainDynamicVariable = false; //for {0} message validation
    vm.isUpdatable = true;

    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.DYNAMIC_MESSAGE_WHERE_USED;

    vm.headerData = [];// heading lable for popup-header-label 
    vm.gridOptions = {
      showColumnFooter: false,
      enableCellEditOnFocus: true,
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'dynamicmessageWhereUsed.csv',
    };
    vm.totalDataCount = 0;
    vm.pageDetailData = [];

    vm.headerData.push({
      label: CORE.LabelConstant.DYNAMIC_MESSAGE.MessageCode,
      value: data.messageCode,
      displayOrder: (vm.headerData.length + 1)
    });
    vm.headerData.push({
      label: CORE.LabelConstant.DYNAMIC_MESSAGE.MessageType,
      value: data.messageType,
      displayOrder: (vm.headerData.length + 1)
    });
    vm.headerData.push({
      label: CORE.LabelConstant.DYNAMIC_MESSAGE.Category,
      value: data.category,
      displayOrder: (vm.headerData.length + 1)
    });    

    vm.getDynamicMessageByKey = (id) => {      
      vm.cgBusyLoading = DynamicMessageFactory.getDynamiceMessageDBByKey().query({ ObjId: id }).$promise.then((res) => {        
        if (res && res.data) {
          var messageData = res.data.dynamicMessage;
          vm.dynamicMessageModel._id = messageData._id;
          vm.dynamicMessageModel.messageKey = messageData.messageKey;
          vm.dynamicMessageModel.messageCode = messageData.messageCode;
          vm.dynamicMessageModel.messageType = messageData.messageType;
          vm.dynamicMessageModel.category = messageData.category;
          vm.dynamicMessageModel.message = messageData.message;
          vm.dynamicMessageModel.whereUser = messageData.whereUser;
          vm.dynamicMessageModel.versionNumber = messageData.versionNumber;
          if (vm.dynamicMessageModel.message && vm.dynamicMessageModel.message.match(/{[0-9]}/g)) {
            vm.isContainDynamicVariable = true;
          }
        }
      }).catch((err) => { return BaseService.getErrorLog(err); });
    };

    if (data && data._id) {      
      vm.getDynamicMessageByKey(data._id);
    }// load initial data

    vm.saveDynamicMessage = () => {
      vm.isSubmit = false;
      vm.isDisabledSave = true;
    
      if (BaseService.focusRequiredField(vm.manageMessageForm)) {
        $timeout(() => {
          vm.isDisabledSave = false;
        });
        
        $mdDialog.hide();
        return;
      }

      if (vm.manageMessageForm.$dirty) {
        if (vm.dynamicMessageModel && vm.dynamicMessageModel._id  ) {
          vm.cgBusyLoading = DynamicMessageFactory.updateDynamicMessageDB().query(vm.dynamicMessageModel).$promise.then((res) => {
            if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
              BaseService.currentPagePopupForm = [];
              vm.isDisabledSave = false;
              $mdDialog.hide(res);
            }
          }).catch((err) => {
            vm.isDisabledSave = false;
            return BaseService.getErrorLog(err);
          });
        }
      }

    };


    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }

    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.manageMessageForm, vm.checkDirtyObject);

      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      return BaseService.checkFormDirty(form, columnName);
    }

    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.manageMessageForm];
    });

    /***** whereUsed grip operation ***********************************************/
    //source header for grid data
    vm.getPageDetail = () => {
      return vm.cgBusyLoading = PageDetailFactory.getPageNameList().query().$promise.then((res) => {
        if (res && res.data) {
          vm.pageDetailData = angular.copy(res.data);
          vm.pageDetailDropDown = [{
            id: undefined,
            value: "All"
          }];
          _.each(vm.pageDetailData, (item) => {
            var newItem = {};
            newItem.id = item.pageId;
            newItem.value = item.menuName;
            vm.pageDetailDropDown.push(newItem);
          });
        }
      }).catch((err) => {
        return BaseService.getErrorLog(err);
      });
    };

    vm.cgBusyLoading = $q.all([vm.getPageDetail()]).then((res) => {
      vm.whereUsedHeader = [
        {
          field: 'Action',
          cellClass: 'gridCellColor',
          displayName: 'Action',
          width: '80',
          cellTemplate: `<grid-action-view grid="grid" row="row"></grid-action-view>`,
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: true,
          enableCellEdit: false,
        },
        {
          field: '#',
          width: '60',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
          enableSorting: false,
          enableFiltering: false
        },
        {
          field: 'pageName',
          width: '200',
          displayName: 'Page Name',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}}</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.pageDetailDropDown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'description',
          width: '500',
          displayName: 'Description',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'createdDate',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD |date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
          type: 'datetime',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'createdByName',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true
        },
        // createdByRoleId -- commented as discussed with DV            
        {
          field: 'modifiedDate',
          width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD |date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
          type: 'datetime',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'modifiedByName',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true
        },
        // modifiedByRoleId -- commented as discussed with DV            
      ];
      vm.isGridVisible = true;
    }).catch((error) => {
      return BaseService.getErrorLog(error);
    });

    vm.loadUsageData = () => {
      if (data && data._id) {
        var sortOrder = 1;
        //For filter pageId wise , column is "pageName"
        var colName = "";
        if (vm.pagingInfo.SearchColumns.length > 0) {
          colName = vm.pagingInfo.SearchColumns.filter(e => e.ColumnName === "pageName");
          if (colName && colName.length > 0) {
            colName[0].ColumnName = 'pageId';
          }
        }
        if (vm.pagingInfo.SortColumns.length > 0) {
          colName = _.find(vm.pagingInfo.SortColumns[0], (res) => {
            return res === "pageName";
          });
          if (colName) {
            sortOrder = (vm.pagingInfo.SortColumns[0][1] === "asc") ? 1 : -1;
            vm.pagingInfo.SortColumns = [];
          } else sortOrder = 1;
        }
          
        vm.pagingInfo.ObjId = data._id;
        vm.cgBusyLoading = DynamicMessageFactory.getWhereUsedListByMessageId(vm.pagingInfo).query().$promise.then((result) => {          
          vm.whereUsedData = result.data.messageUsageList;
          //for getting page name for pageId
          _.each(vm.whereUsedData, (item) => {
            item["pageName"] = vm.pageDetailData.find(obj => obj.pageId === item.pageId).menuName;
            item["messageCode"] = vm.dynamicMessageModel.messageCode;
          });
          
          //following code is for sorting data "pageName" wise, default sorting
          if (vm.pagingInfo.SortColumns.length === 0) {
            vm.whereUsedData.sort(function (a, b) {
              var nameA = a.pageName.toLowerCase();
              var nameB = b.pageName.toLowerCase();
              if (nameA < nameB) {
                return sortOrder * - 1;
              }
              if (nameA > nameB) {
                return sortOrder * 1;
              }
              return 0;
            });
          }

          vm.totalDataCount = result.data.messageUsageCount;
          vm.currentdata = result.data.messageUsageList.length;
          vm.gridOptions.clearSelectedRows();
          if (vm.totalDataCount == 0) {
            if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.isNoDataFound = false;
              vm.emptyState = 0;
            }
            else {
              if (vm.isNoDatainFilter) {
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
          $timeout(() => { vm.resetSourceGrid(); });
        }).catch((err) => {
          return BaseService.getErrorLog(error);
        });
      }
    };// End of Load

    /* update defect category*/
    vm.updateRecord = (row, ev) => {
      vm.addEditMessageUsageDetail(row.entity, ev);
    };

    //open pop up
    vm.addEditMessageUsageDetail = (data, ev) => {
      vm.isDisabledWhereUsed = true;
      DialogFactory.dialogService(
        USER.ADMIN_DYNAMICMESSAGE_USAGE_POPUP_CONTROLLER,
        USER.ADMIN_DYNAMICMESSAGE_USAGE_POPUP_VIEW,
        ev,
        data).then(() => {
          vm.isDisabledWhereUsed = false;
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadUsageData);
        }, (cancel) => {
            vm.isDisabledWhereUsed = false;
        }, (err) => {
           vm.isDisabledWhereUsed = false;
          return BaseService.getErrorLog(err);
        });
    }

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    }

    // delete message usage
    vm.deleteRecord = (messageDetail) => {
      let selectedIDs = [];
      if (messageDetail) {
        selectedIDs.push(messageDetail._id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((messageDetailItem) => messageDetailItem._id);
        }
      }
      var messageContent = "";
      if (selectedIDs) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, "Where Used detail", selectedIDs.length);
        let obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        let objIDs = {
          id: selectedIDs,
          CountList: false,
        }
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = DynamicMessageFactory.deleteWhereUsedData().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadUsageData);
                vm.gridOptions.clearSelectedRows();
              }
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }

        }, (cancel) => {
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      } else {
        //show validation message no data selected
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, "Where Used detail");
        let alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };
  }
})();
