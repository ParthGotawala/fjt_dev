(function () {
  'use strict';
  angular.module('app.admin.genericcategory')
    .controller('GenericCategoryAddPopupController', GenericCategoryAddPopupController);

  /** @ngInject */
  function GenericCategoryAddPopupController($mdDialog, $q, data, CORE, GenericCategoryFactory, DialogFactory, BaseService, $timeout, USER, BankFactory) {
    const vm = this;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
    vm.title = data.isSalesOrder ? data.saleName : data.Title;
    vm.headerTitle = data.headerTitle;
    let oldgencCategoryName = '';
    let oldCategoryCode = '';
    vm.IsHideActiveDeActiveFields = data.IsHideActiveDeActiveFields;
    vm.CategoryTypeList = angular.copy(CORE.Category_Type);
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.paymentterm = CategoryTypeObjList.Terms.Title;
    vm.payablePaymentMethod = CategoryTypeObjList.PayablePaymentMethods.Title;
    vm.receivablePaymentMethod = CategoryTypeObjList.ReceivablePaymentMethods.Title;
    vm.categoryType = _.find(vm.CategoryTypeList, (cateType) => cateType.displayName === vm.title);
    vm.isBarcodeSeparator = data.Title === CORE.CategoryType.BarcodeSeparator.Name;
    vm.ShippingType = CORE.CategoryType.ShippingType.Name;
    vm.PaymentTypeCategory = CORE.CategoryType.PaymentTypeCategory.Name;
    vm.ShippingTypeID = CORE.CategoryType.ShippingType.ID;
    vm.ReportCategoryID = CORE.CategoryType.ReportCategory.ID;
    vm.ReportCategory = CORE.CategoryType.ReportCategory.Name;
    vm.descriptionMaxLength = _maxLengthForDescription;
    vm.PartRequirementCategory = CORE.CategoryType.PartRequirementCategory.Name;
    vm.HomeCategory = CORE.CategoryType.HomeMenu.Name;
    vm.DocumentTypeCategory = CORE.CategoryType.DocumentType.Name;
    vm.Printers = CORE.CategoryType.Printer.Name;
    vm.LabelConstant = CORE.LabelConstant;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.RadioGroup = {
      isActive: {
        array: CORE.ActiveRadioGroup
      }
    };
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
    vm.allGenericCategoryModel = { searchText: null, searchType: CORE.CustomSearchTypeForList.Contains };
    vm.CustomSearchTypeForList = CORE.CustomSearchTypeForList;
    vm.EmptyMessage = USER.ADMIN_EMPTYSTATE.GENERICCATEGORY;
    vm.imageUrl = stringFormat(vm.EmptyMessage.IMAGEURL, vm.categoryType.categoryType.split(' ').join('-') + '.png');
    vm.emptyStateMessageForList = stringFormat(vm.EmptyMessage.MESSAGE, vm.headerTitle);
    vm.isNoDataFound = true;
    vm.sourceData = [];
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.isSubmit = false;
    vm.initData = data ? data : {};
    vm.initData.isActive = true;
    vm.initData.isEOM = false;
    vm.emptyState = null;
    vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;
    vm.checkUniqueCode = false;
    vm.pageInit = (data) => {
      vm.parentGencCategoryID = data && data.parentGencCategoryID ? data.parentGencCategoryID : data && data.parentId ? data.parentId : vm.parentGencCategoryID;
      vm.gencCategoryName = data && data.Name ? data.Name : data && data.gencCategoryName ? data.gencCategoryName : null;
      vm.gencCategoryCode = data && data.gencCategoryCode ? vm.gencCategoryCode : null;
      vm.gencCategoryID = data && data.gencCategoryID ? data.gencCategoryID : null;
      vm.termDay = data && data.termsDays ? data.termsDays : null;
      vm.isEOM = data ? data.isEOM : false;
      vm.isActive = data ? data.isActive : true;
      vm.description = data && data.description ? data.description : '';
    };
    vm.pageInit(vm.initData);

    vm.saveAndProceed = (buttonCategory, data) => {
      if (data) {
        vm.data = data;
      }
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.otherPermissionForm.$setPristine();
        vm.gencCategoryID = data ? data.gencCategoryID : vm.gencCategoryID;
        genericcategoryDetails();
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.checkFormDirty(vm.otherPermissionForm);
        if (isdirty) {
          const data = {
            form: vm.otherPermissionForm
          };
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            if (data) {
              vm.pageInit();
              vm.otherPermissionForm.$setPristine();
              if (vm.autoCompletePaymentTypeCategory) {
                vm.autoCompletePaymentTypeCategory.keyColumnId = null;
              }
              if (vm.autoCompleteBank) {
                vm.autoCompleteBank.keyColumnId = null;
              }
              if (vm.autoCompleteCarriers) {
                vm.autoCompleteCarriers.keyColumnId = null;
              }
              if (vm.autoCompletePayableReceivable) {
                vm.autoCompletePayableReceivable.keyColumnId = null;
              }
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.pageInit();
          vm.otherPermissionForm.$setPristine();
          if (vm.autoCompletePaymentTypeCategory) {
            vm.autoCompletePaymentTypeCategory.keyColumnId = null;
          }
          if (vm.autoCompleteBank) {
            vm.autoCompleteBank.keyColumnId = null;
          }
          if (vm.autoCompleteCarriers) {
            vm.autoCompleteCarriers.keyColumnId = null;
          }
          if (vm.autoCompletePayableReceivable) {
            vm.autoCompletePayableReceivable.keyColumnId = null;
          }
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(vm.data);
      }
      setFocusByName('categoryName');
    };

    vm.AddgenCategory = (isCheckUnique, buttonCategory) => {
      if (BaseService.focusRequiredField(vm.otherPermissionForm)) {
        if (vm.gencCategoryID && !vm.otherPermissionForm.$dirty && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          $mdDialog.cancel(vm.data);
        }
        return;
      }
      vm.isSubmit = false;
      const genericCategoryInfo = {
        gencCategoryName: vm.gencCategoryName,
        gencCategoryCode: vm.gencCategoryCode ? vm.gencCategoryCode : null,
        categoryType: vm.categoryType ? vm.categoryType.categoryType : null,
        displayName: vm.categoryType ? vm.categoryType.displayName : null,
        displayOrder: null,
        singleLabel: vm.categoryType ? vm.categoryType.singleLabel : null,
        termsDays: vm.termDay,
        parentGencCategoryID: vm.parentGencCategoryID,
        isActive: vm.isActive ? vm.isActive : false,
        systemGenerated: 0,
        isCheckUnique: isCheckUnique ? isCheckUnique : false,
        carrierID: (vm.autoCompleteCarriers && vm.autoCompleteCarriers.keyColumnId) ? vm.autoCompleteCarriers.keyColumnId : null,
        description: vm.description,
        isEOM: vm.isEOM || false,
        paymentTypeCategoryId: vm.autoCompletePaymentTypeCategory ? vm.autoCompletePaymentTypeCategory.keyColumnId : null,
        bankid: vm.autoCompleteBank ? vm.autoCompleteBank.keyColumnId : null
      };

      //Save or update generic category
      if (vm.gencCategoryID) {
        vm.cgBusyLoading = GenericCategoryFactory.genericcategory().update({
          id: vm.gencCategoryID
        }, genericCategoryInfo).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.saveAndProceed(buttonCategory, res.data);
          } else if (res && res.status !== CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.saveBtnFlag = false;
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.otherPermissionForm);
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.cgBusyLoading = GenericCategoryFactory.genericcategory().save(genericCategoryInfo).$promise.then((res) => {
          if (res.data && res.data.gencCategoryID) {
            vm.saveAndProceed(buttonCategory, res.data);
          }
          else {
            if (res.data && res.data.fieldName) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.UNIQUE_CONFIRM_MESSAGE);
              messageContent.message = stringFormat(messageContent.message, res.data.fieldName);
              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_CREATENEW_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes) {
                  vm.AddgenCategory(false, buttonCategory);
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            } else if (res.errors) {
              vm.saveBtnFlag = false;
              if (checkResponseHasCallBackFunctionPromise(res)) {
                res.alretCallbackFn.then(() => {
                  BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.otherPermissionForm);
                });
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.otherPermissionForm);
      if (isdirty) {
        const data = {
          form: vm.otherPermissionForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(true);
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    //check Generic Category Already Exists
    vm.checkGenericCategoryAlreadyExists = () => {
      if ((oldgencCategoryName !== vm.gencCategoryName || oldCategoryCode !== vm.gencCategoryCode) && (vm.gencCategoryCode || vm.gencCategoryName)) {
        if (!vm.checkUniqueCode) {
          vm.checkUniqueCode = true;
          const objs = {
            gencCategoryName: vm.gencCategoryName ? vm.gencCategoryName : null,
            gencCategoryCode: vm.gencCategoryCode ? vm.gencCategoryCode : null,
            singleLabel: vm.categoryType ? vm.categoryType.singleLabel : null,
            categoryType: vm.categoryType ? vm.categoryType.categoryType : null,
            gencCategoryID: vm.gencCategoryID,
            termsDays: vm.termDay
          };
          vm.cgBusyLoading = GenericCategoryFactory.checkGenericCategoryAlreadyExists().query({ objs: objs }).$promise.then((res) => {
            vm.cgBusyLoading = false;
            if (res.status !== 'SUCCESS') {
              // previous alert dialog code commented as error message will be pop up through custom interceptor
              if (checkResponseHasCallBackFunctionPromise(res)) {
                res.alretCallbackFn.then(() => {
                  vm.checkUniqueCode = false;
                  if (res && res.errors && res.errors.data) {
                    if (res.errors.data.isDuplicateGencCategoryCode) {
                      vm.gencCategoryCode = null;
                      vm.SetFocusOnField('gencCategoryCode');
                    }
                    else {
                      vm.gencCategoryName = null;
                      vm.SetFocusOnField('categoryName');
                    }
                  }
                });
              }
            }
            else {
              vm.checkUniqueCode = false;
              oldgencCategoryName = angular.copy(vm.gencCategoryName);
              oldCategoryCode = angular.copy(vm.gencCategoryCode);
            }
          }).catch((error) => {
            vm.checkUniqueCode = false;
            return BaseService.getErrorLog(error);
          });
        }
      }
    };

    // focus on textbox
    vm.SetFocusOnField = (fieldName) => {
      const element = document.getElementById(fieldName);
      if (element) {
        element.focus();
      }
    };

    /* manually set save button enable for category type - Standard Types */
    if (vm.categoryType && vm.categoryType.categoryType === CORE.CategoryType.StandardType.Name
      && vm.gencCategoryName) {
      $timeout(() => {
        vm.otherPermissionForm.$setDirty();
        vm.otherPermissionForm.categoryName.$dirty = true;
      }, true);
    }

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: [], /* for default - directly set in sp */
        genericCategoryType: vm.categoryType.categoryType
      };
    };
    initPageInfo();

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      enableCellEdit: false,
      enableCellEditOnFocus: true,
      exporterCsvFilename: vm.categoryType.displayName + '.csv',
      CurrentPage: CORE.PAGENAME_CONSTANT[0].PageName
    };

    function setDataAfterGetAPICall(genericcategory, isGetDataDown) {
      if (genericcategory && genericcategory.data.genericcategory) {
        if (!isGetDataDown) {
          vm.sourceData = genericcategory.data.genericcategory;
          vm.currentdata = vm.sourceData.length;
        }
        else if (genericcategory.data.genericcategory.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(genericcategory.data.genericcategory);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = genericcategory.data.Count;
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

    /* retrieve generic category list*/
    vm.loadData = () => {
      if (vm.allGenericCategoryModel.searchText) {
        setExternalSearchFilter();
      }
      vm.pagingInfo.searchText = vm.allGenericCategoryModel.searchText;
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = GenericCategoryFactory.retriveGenericCategoryList().query(vm.pagingInfo).$promise.then((genericcategory) => {
        if (genericcategory.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(genericcategory, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };


    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = GenericCategoryFactory.retriveGenericCategoryList().query(vm.pagingInfo).$promise.then((genericcategory) => {
        if (genericcategory) {
          setDataAfterGetAPICall(genericcategory, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* manual search by user to search exact or contains matching records */
    vm.SearchCategory = (isReset) => {
      if (isReset) {
        initPageInfo();
        vm.allGenericCategoryModel.searchText = null;
        vm.allGenericCategoryModel.searchType = vm.CustomSearchTypeForList.Contains;
        vm.gridOptions.gridApi.grid.clearAllFilters();
      }
      else {
        vm.pagingInfo.Page = CORE.UIGrid.Page();
        if (!vm.allGenericCategoryModel.searchText) {
          /* to avoid duplicate filter data adding in list */
          if (vm.pagingInfo.SearchColumns.length > 0) {
            _.remove(vm.pagingInfo.SearchColumns, (item) => item.isExternalSearch);
          }
        }
      }
      vm.loadData();
    };
    const setExternalSearchFilter = () => {
      /* to avoid duplicate filter data adding in list */
      if (vm.pagingInfo.SearchColumns.length > 0) {
        _.remove(vm.pagingInfo.SearchColumns, (item) => item.isExternalSearch);
      }
      if (vm.allGenericCategoryModel.searchType === CORE.CustomSearchTypeForList.Exact) {
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'gencCategoryName', SearchString: vm.allGenericCategoryModel.searchText, ColumnDataType: 'StringEquals', isExternalSearch: true });
      }
      else if (vm.allGenericCategoryModel.searchType === CORE.CustomSearchTypeForList.Contains) {
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'gencCategoryName', SearchString: vm.allGenericCategoryModel.searchText, ColumnDataType: null, isExternalSearch: true });
      }
    };
    vm.isHideDelete = true;
    vm.sourceHeader = [
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false,
        enableCellEdit: false
      },
      {
        field: 'gencCategoryName',
        displayName: 'Name',
        width: 350,
        enableCellEdit: false
      },
      {
        field: 'isActiveConvertedValue',
        displayName: 'Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span  class="label-box" \
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
        width: 100,
        enableCellEdit: false
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

    // to move at selected generic category list page
    vm.goToGenericCategoryList = () => {
      if (vm.categoryType && vm.categoryType.categoryTypeID) {
        switch (parseInt(vm.categoryType.categoryTypeID)) {
          case CategoryTypeObjList.EquipmentGroup.ID:
            BaseService.goToGenericCategoryEquipmentGroupList();
            break;
          case CategoryTypeObjList.EquipmentType.ID:
            BaseService.goToGenericCategoryEquipmentTypeList();
            break;
          case CategoryTypeObjList.EquipmentOwnership.ID:
            BaseService.goToGenericCategoryEquipmentOwnershipList();
            break;
          case CategoryTypeObjList.StandardType.ID:
            BaseService.goToGenericCategoryStandardTypeList();
            break;
          case CategoryTypeObjList.EmployeeTitle.ID:
            BaseService.goToGenericCategoryTitleList();
            break;
          case CategoryTypeObjList.OperationType.ID:
            BaseService.goToGenericCategoryOperationTypeList();
            break;
          case CategoryTypeObjList.ShippingStatus.ID:
            BaseService.goToGenericCategoryShippingStatusList();
            break;
          case CategoryTypeObjList.OperationVerificationStatus.ID:
            BaseService.goToGenericCategoryOperationVerificationStatusList();
            break;
          case CategoryTypeObjList.LocationType.ID:
            BaseService.goToGenericCategoryLocationsList();
            break;
          case CategoryTypeObjList.WorkArea.ID:
            BaseService.goToGenericCategoryWorkAreaList();
            break;
          case CategoryTypeObjList.ShippingType.ID:
            BaseService.goToGenericCategoryShippingTypeList();
            break;
          case CategoryTypeObjList.Terms.ID:
            BaseService.goToGenericCategoryTermsList();
            break;
          case CategoryTypeObjList.Printer.ID:
            BaseService.goToGenericCategoryPrinterList();
            break;
          case CategoryTypeObjList.PartStatus.ID:
            BaseService.goToGenericCategoryPartStatusList();
            break;
          case CategoryTypeObjList.BarcodeSeparator.ID:
            BaseService.goToGenericCategoryBarcodeSeparatorList();
            break;
          case CategoryTypeObjList.HomeMenu.ID:
            BaseService.goToGenericCategoryHomeMenuList();
            break;
          case CategoryTypeObjList.DocumentType.ID:
            BaseService.goToGenericCategoryDocumentTypeList();
            break;
          case CategoryTypeObjList.ECO_DFMType.ID:
            BaseService.goToGenericCategoryECO_DFMTypeList();
            break;
          case CategoryTypeObjList.ChargesType.ID:
            BaseService.goToGenericCategoryChargeTypeList();
            break;
          case CategoryTypeObjList.PayablePaymentMethods.ID:
            BaseService.goToGenericCategoryPayablePaymentMethodList();
            break;
          case CategoryTypeObjList.Carriers.ID:
            BaseService.goToGenericCategoryCarrierList();
            break;
          case CategoryTypeObjList.ReportCategory.ID:
            BaseService.goToReportCategoryList();
            break;
          case CategoryTypeObjList.PartRequirementCategory.ID:
            BaseService.goToGenericCategoryPartRequirementCategoryList();
            break;
          case CategoryTypeObjList.ReceivablePaymentMethods.ID:
            BaseService.goToGenericCategoryReceivablePaymentMethodList();
            break;
          case CategoryTypeObjList.PaymentTypeCategory.ID:
            BaseService.goToGenericCategoryPaymentTypeCategoryList();
            break;
        }
      }
    };

    /* retrieve generic category Details*/
    const genericcategoryDetails = () => {
      if (vm.gencCategoryID) {
        GenericCategoryFactory.genericcategory().query({ id: vm.gencCategoryID }).$promise.then((genericcategory) => {
          vm.manageGenericCategory = angular.copy(genericcategory.data);
          vm.data = vm.manageGenericCategory;
          vm.pageInit(vm.data);
          vm.gencCategoryName = vm.manageGenericCategory.gencCategoryName;
          oldgencCategoryName = angular.copy(vm.manageGenericCategory.gencCategoryName);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    genericcategoryDetails();


    //carrier details
    /*
   * Author :  Champak Chaudhary
   * Purpose : Get carrier list
   */
    const getCarrierList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.Carriers.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: true
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((carrier) => {
        if (carrier && carrier.data) {
          vm.carrierlist = carrier.data;
          _.each(carrier.data, (item) => {
            if (item.gencCategoryCode) {
              item.gencCategoryDisplayName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName);
            }
            else {
              item.gencCategoryDisplayName = item.gencCategoryName;
            }
          });
          if (!vm.autoCompleteCarriers) {
            initAutocompleteCarrier();
          }
          return vm.carrierlist;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getPaymentTypeCategoryList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.PaymentTypeCategory.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: true
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((paymentTypeCategory) => {
        if (paymentTypeCategory && paymentTypeCategory.data) {
          vm.paymentTypeCategoryList = paymentTypeCategory.data;
          _.each(paymentTypeCategory.data, (item) => item.gencCategoryDisplayName = item.gencCategoryCode ? stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName) : item.gencCategoryName);
          if (!vm.autoCompletePaymentTypeCategory) {
            initAutoComplete();
          }
          return $q.resolve(vm.paymentTypeCategoryList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    const getBank = () => BankFactory.getBankList().query().$promise.then((bank) => {
      if (bank && bank.data) {
        vm.bankList = bank.data;
        return $q.resolve(vm.bankList);
      }
    }).catch((error) => BaseService.getErrorLog(error));

    //auto complete for carrier
    const initAutocompleteCarrier = () => {
      vm.autoCompleteCarriers = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: null,
        inputName: CategoryTypeObjList.Carriers.Title,
        placeholderName: CategoryTypeObjList.Carriers.singleLabel,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_CARRIERMST_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.Carrier,
          headerTitle: CategoryTypeObjList.Carriers.Name
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getCarrierList,
        inputId: 'carrier'
      };
    };
    if (vm.categoryType && vm.categoryType.categoryTypeID === CategoryTypeObjList.ShippingType.ID) {
      getCarrierList();
    }

    const initAutoComplete = () => {
      vm.autoCompletePaymentTypeCategory = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: null,
        inputName: CategoryTypeObjList.PaymentTypeCategory.Title,
        placeholderName: CategoryTypeObjList.PaymentTypeCategory.Title,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_PAYMENT_TYPE_CATEGORY_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.PaymentTypeCategory,
          headerTitle: CategoryTypeObjList.PaymentTypeCategory.Name
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getPaymentTypeCategoryList
      };
      vm.autoCompleteBank = {
        columnName: 'accountCode',
        controllerName: USER.ADMIN_BANK_ADD_UPDATE_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_BANK_ADD_UPDATE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Bank Account Code',
        placeholderName: vm.LabelConstant.Bank.BankAccountCode,
        addData: {
          headerTitle: USER.ADMIN_BANK_LABEL,
          popupAccessRoutingState: [USER.ADMIN_BANK_STATE],
          pageNameAccessLabel: USER.ADMIN_BANK_LABEL
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getBank
      };
      vm.autoCompletePayableReceivable = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Payable Receivable',
        placeholderName: 'Payable/Receivable',
        isRequired: true,
        isAddnew: false
      };
    };

    if (vm.categoryType) {
      if (vm.categoryType.categoryTypeID === CategoryTypeObjList.PayablePaymentMethods.ID) {
        getPaymentTypeCategoryList();
        getBank();
      }
      else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.ReceivablePaymentMethods.ID) {
        getPaymentTypeCategoryList();
      }
    }

    vm.onEOMChange = () => {
      if (vm.isEOM) {
        vm.termDay = 0;
      }
    };

    //go to carrier list page
    vm.goTocarrierList = () => {
      BaseService.goToGenericCategoryCarrierList();
    };
    vm.goToPaymentTypeCategoryList = () => BaseService.goToGenericCategoryPaymentTypeCategoryList();
    vm.goToBankList = () => {
      BaseService.goToBankList();
    };
    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.otherPermissionForm];
      if (data && data.Name) {
        vm.otherPermissionForm.$setDirty();
      }
    });
  }
})();
