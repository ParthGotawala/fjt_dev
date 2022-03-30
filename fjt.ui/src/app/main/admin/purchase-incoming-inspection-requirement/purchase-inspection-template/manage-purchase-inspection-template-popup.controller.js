(function () {
  'use restrict';

  angular.module('app.core')
    .controller('ManagePurchaseInspectionTemplateController', ManagePurchaseInspectionTemplateController);

  function ManagePurchaseInspectionTemplateController(data, $mdDialog, DialogFactory, CORE, BaseService, $timeout, PurchaseInspectionRequirementFactory, USER, $scope) {
    var vm = this;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.PURCHASE_INSPECTION_REQUIREMENT;
    vm.REQUIRED_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT.REQUIRED;
    vm.LabelConstant = CORE.LabelConstant;
    vm.themeClass = CORE.THEME;
    vm.gridManagePurchaseInspectionTemplatePopup = CORE.gridConfig.gridManagePurchaseInspectionTemplatePopup;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
    vm.PartRequirementTypeOptionsGridHeaderDropdown = CORE.PartRequirementTypeOptionsGridHeaderDropdown;
    vm.newRequirementList = vm.removeRequirementList = vm.selectedrowDetailList = [];
    const objTemplateDet = angular.copy(data);
    vm.isCheckAll = false;
    const isEnablePagination = false;
    vm.isHideDelete = true;
    vm.inspectionTemplateModel = {
      id: objTemplateDet && objTemplateDet.id ? objTemplateDet.id : null,
      // In Name value comes from auto-complete value when add new record add from auto-complete and in name value comes from edit time
      name: objTemplateDet && objTemplateDet.Name ? objTemplateDet.Name : objTemplateDet && objTemplateDet.name ? objTemplateDet.name : null
    };

    vm.getAllListFilter = () => _.each(vm.sourceData, (item) => item.isSelected = vm.isCheckAll ? true : false);

    vm.checkAllListFilter = () => {
      var allListFilter = _.filter(vm.sourceData, (item) => !item.isSelected);
      vm.isCheckAll = allListFilter && allListFilter.length === 0 ? true : false;
    };

    vm.sourceHeader = [
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false,
        enableCellEdit: false,
        maxWidth: '80'
      },
      {
        field: 'requiementType',
        displayName: 'Type',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span  class="label-box" \
                                            ng-class="{\'label-success\':row.entity.requiementType == grid.appScope.$parent.vm.PartRequirementTypeOptionsGridHeaderDropdown[1].id, \
                                            \'label-warning\':row.entity.requiementType == grid.appScope.$parent.vm.PartRequirementTypeOptionsGridHeaderDropdown[2].id }"> \
                                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.PartRequirementTypeOptionsGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 120,
        enableCellEdit: false
      },
      {
        field: 'requirement',
        displayName: vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.PurchaseRequirement,
        cellTemplate: '<div class="ui-grid-cell-contents text-left cm-white-space-normal">{{COL_FIELD}}</div>',
        width: '670',
        enableCellEdit: false
      },
      {
        field: 'partRequirementCategoryName',
        displayName: vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.PartRequirementCategory,
        cellTemplate: '<div class="ui-grid-cell-contents"><a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManageGenericCategoryPartRequirementCategory(row.entity.gencCategoryID);">{{COL_FIELD}}</a></div>',
        width: 220,
        enableCellEdit: false
      },
      {
        field: 'isActiveConvertedValue',
        displayName: 'Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span  class="label-box" \
                                            ng-class="{\'label-success\':row.entity.isActive, \
                                            \'label-warning\':!row.entity.isActive}"> \
                                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.StatusOptionsGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 130,
        enableCellEdit: false
      },
      {
        field: 'updatedAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false,
        enableCellEdit: false
      }, {
        field: 'updatedBy',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        enableCellEdit: false
      }, {
        field: 'updateByRoleId',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        enableCellEdit: false
      }, {
        field: 'createdAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false,
        enableCellEdit: false
      }, {
        field: 'createdBy',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        enableCellEdit: false
      }, {
        field: 'createByRoleId',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        enableCellEdit: false
      }];
    vm.sourceHeader.unshift({
      field: 'Apply',
      headerCellTemplate: '<md-checkbox class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" ng-model="grid.appScope.$parent.vm.Apply" \
                            ng-change="grid.appScope.$parent.vm.applyAll(grid.appScope.$parent.vm.Apply)"></md-checkbox>',
      width: '75',
      cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" style="overflow:initial"><md-checkbox ng-model="row.entity.isRecordSelectedForRemove" \
                            ng-change="grid.appScope.$parent.vm.setRequirementRemove(row.entity)"></md-checkbox></div>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: false,
      allowCellFocus: false,
      enableColumnMoving: false,
      enableCellEdit: false,
      manualAddedCheckbox: true
    });

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['requiementType', 'DESC'], ['requirement', 'ASC']],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[32].PageName
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
      exporterMenuCsv: false,
      hideMultiDeleteButton: true,
      enableCellEdit: true,
      isAdd: true,
      CurrentPage: CORE.PAGENAME_CONSTANT[32].PageName
    };

    function setDataAfterGetAPICall(requirementType, isGetDataDown) {
      if (requirementType && requirementType.RequirementList) {
        if (!isGetDataDown) {
          vm.sourceData = requirementType.RequirementList;
          vm.currentdata = vm.sourceData.length;
        }
        else if (requirementType.RequirementList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(requirementType.RequirementList);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = requirementType.Count;
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
          vm.resetSourceGrid();
          if (vm.inspectionTemplateModel.id) {
            _.each(vm.sourceData, (item) => {
              if (item.templateId === vm.inspectionTemplateModel.id) {
                item.inspectionDetailId = item.TemplateDetId;
                item.isRecordSelectedForRemove = true;
                vm.selectedrowDetailList.push(item);
              }
            });
          }
          checkUncheckRecords();
          if (!isGetDataDown) {
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          }
          else {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
          }
        });
      }
    }

    vm.loadData = () => {
      vm.Apply = false;
      if (vm.pagingInfo.SortColumns.length === 0) {
        vm.pagingInfo.SortColumns = [['requiementType', 'DESC'], ['requirement', 'ASC']];
      }
      vm.pagingInfo.templateId = vm.inspectionTemplateModel.id || null;
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = PurchaseInspectionRequirementFactory.getpurchaseInspectList().query(vm.pagingInfo).$promise.then((requirementType) => {
        if (requirementType.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(requirementType.data);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const checkUncheckRecords = () => {
      vm.gridOptions.clearSelectedRows();
      _.each(vm.sourceData, (item) => {
        const objReq = _.find(vm.selectedrowDetailList, { id: item.id });
        item.isRecordSelectedForRemove = objReq && (!objReq.isunSelected) ? true : false;
      });
    };
    ///* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = PurchaseInspectionRequirementFactory.getpurchaseInspectList().query(vm.pagingInfo).$promise.then((requirementType) => {
        if (requirementType.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(requirementType.data, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    ////open popup for add edit new purchase requirement
    vm.addEditRecord = (data, ev) => {
      DialogFactory.dialogService(
        CORE.MANAGE_PURCHASE_INSPECTION_REQUIREMENT_MODAL_CONTROLLER,
        CORE.MANAGE_PURCHASE_INSPECTION_REQUIREMENT_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (res) => {
          if (res) {
            vm.loadData();
          }
        }, (error) => BaseService.getErrorLog(error));
    };

    ////apply all details
    vm.applyAll = (applyAll) => {
      if (applyAll) {
        _.map(vm.sourceData, selectRequirement);
        vm.selectedrowDetailList = vm.sourceData;
      } else {
        _.map(vm.sourceData, unselectRequirement);
        vm.selectedrowDetailList = [];
      }
    };

    //function getPurchaseRequirementByTemplateId() {
    //  vm.cgBusyLoading = PurchaseInspectionRequirementFactory.getPurchaseRequirementTemplate().query({ id: vm.inspectionTemplateModel.id }).$promise.then((requirement) => {
    //    vm.inspectionTemplateModel = requirement.data;
    //    manageRequirementList();
    //  }).catch((error) => BaseService.getErrorLog(error));
    //};

    //function manageRequirementList() {
    //  // Edit Template
    //  if (vm.inspectionTemplateModel && vm.inspectionTemplateModel.id && vm.inspectionTemplateModel.inspectionTemplateRequirementMst && vm.inspectionTemplateModel.inspectionTemplateRequirementMst.length > 0) {
    //    _.each(vm.sourceData, (item) => {
    //      var objReq = _.find(vm.inspectionTemplateModel.inspectionTemplateRequirementMst, { inspectionRequirementId: item.id });
    //      if (objReq) {
    //        item.inspectionDetailId = objReq.id;
    //        item.isRecordSelectedForRemove = true;
    //        const reqObj = _.find(vm.selectedrowDetailList, { id: objReq.id });
    //        if (!reqObj) {
    //          vm.selectedrowDetailList.push(item);
    //        }
    //      }
    //    });
    //    checkUncheckRecords();
    //  }
    //}

    const selectRequirement = (row) => row.isRecordSelectedForRemove = row.isDisabledDelete ? false : true;
    const unselectRequirement = (row) => {
      row.isRecordSelectedForRemove = false;
      vm.gridOptions.clearSelectedRows();
    };
    vm.setRequirementRemove = (row) => {
      var totalItem = _.filter(vm.sourceData, (data) => !data.isDisabledDelete);
      var selectItem = _.filter(vm.sourceData, (data) => data.isRecordSelectedForRemove === true);
      const isexistsInList = _.find(vm.selectedrowDetailList, (purchaseDetail) => purchaseDetail.id === row.id);
      if (row.isRecordSelectedForRemove) {
        if (!isexistsInList) {
          vm.selectedrowDetailList.push(row);
        };
      } else {
        if (isexistsInList) {
          row.isunSelected = true;
          vm.selectedrowDetailList.push(row);
        };
      }
      vm.Apply = totalItem.length === selectItem.length;
      vm.inspectionTemplateForm.$setDirty();      vm.inspectionTemplateForm.name.$dirty = true;
    };

    //Check Duplicate Template
    vm.checkDuplicateName = () => {
      vm.isduplicate = false;

      if (vm.inspectionTemplateModel.name) {
        vm.cgBusyLoading = PurchaseInspectionRequirementFactory.checkDuplicateTemplate().save({
          id: (vm.inspectionTemplateModel.id || vm.inspectionTemplateModel.id === 0) ? vm.inspectionTemplateModel.id : null,
          name: vm.inspectionTemplateModel.name,
          refTableName: CORE.TABLE_NAME.PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE
        }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicate) {
            vm.isduplicate = true;

            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, 'Template name');
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
              multiple: true
            };

            vm.inspectionTemplateModel.name = null;
            DialogFactory.messageAlertDialog(obj).then(() => setFocusByName('name'),
              () => {
              }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.addPurchaseInspectionRequirement = (ev) => {
      DialogFactory.dialogService(
        CORE.MANAGE_PURCHASE_INSPECTION_REQUIREMENT_MODAL_CONTROLLER,
        CORE.MANAGE_PURCHASE_INSPECTION_REQUIREMENT_MODAL_VIEW,
        ev,
        null).then(() => {
        }, (data) => {
          if (data) {
            vm.loadData();
          }
        }, (error) => BaseService.getErrorLog(error));
    };

    $scope.$on('AddNew', () => vm.addPurchaseInspectionRequirement());

    // Save Template
    vm.savePurchaseInspection = () => {
      if (BaseService.focusRequiredField(vm.inspectionTemplateForm, true)) {
        return;
      }
      vm.newRequirementList = vm.newRequirementList = [];

      //Check for is any Requirement selected or not
      const anyRequirement = (_.filter(vm.sourceData, (item) => item.isRecordSelectedForRemove)).length > 0 ? true : false;

      if (!anyRequirement) {
        const model = {
          messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ATLEAST_ONE_INSPECTION_REQUIREMENT),
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      } else {
        _.map(vm.sourceData, (req) => {
          if (req.isRecordSelectedForRemove && !req.inspectionDetailId) {
            vm.newRequirementList.push({
              inspectionRequirementId: req.id,
              requirement: req.requirement
            });
          }
          else if (!req.isRecordSelectedForRemove && req.inspectionDetailId) {
            vm.removeRequirementList.push({
              inspectionRequirementId: req.id,
              id: req.inspectionDetailId,
              requirement: req.requirement
            });
          }
        });
      }

      vm.inspectionTemplateModel.newRequirementList = vm.newRequirementList;
      vm.inspectionTemplateModel.removeRequirementList = vm.removeRequirementList;

      vm.cgBusyLoading = PurchaseInspectionRequirementFactory.saveTemplate().save(vm.inspectionTemplateModel).$promise.then((res) => {
        if (res.data && res.data.name) {
          $mdDialog.cancel(res.data);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.goToManageGenericCategoryPartRequirementCategory = (id) => BaseService.goToManageGenericCategoryPartRequirementCategory(id);

    vm.cancel = () => {
      if (vm.inspectionTemplateForm.name.$dirty) {
        BaseService.showWithoutSavingAlertForPopUp({
          form: vm.inspectionTemplateForm
        });
      } else {
        $mdDialog.cancel();
      }
    };
  }
})();
