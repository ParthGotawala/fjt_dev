
(function () {
  'use strict';

  angular
    .module('app.admin.genericcategory')
    .controller('ManageGenericCategoryController', ManageGenericCategoryController);

  /** @ngInject */
  function ManageGenericCategoryController($state, $q, $mdDialog, $scope, $stateParams, $timeout, $mdColorPicker, USER, CORE, RFQTRANSACTION, GenericCategoryFactory, DialogFactory, BaseService, BankFactory) {
    const vm = this;
    vm.loginUser = BaseService.loginUser;
    vm.categoryTypeID = $stateParams.categoryTypeID ? parseInt($stateParams.categoryTypeID) : null;
    vm.gencCategoryID = $stateParams.gencCategoryID ? parseInt($stateParams.gencCategoryID) : null;
    vm.isVisibleParent = false;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.CategoryTypeList = angular.copy(CORE.Category_Type);
    vm.disabledSystemGenerated = false;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.HomeCategory = CORE.CategoryType.HomeMenu.ID;
    vm.EquipmentOwnership = CategoryTypeObjList.EquipmentOwnership.ID;
    vm.paymenterm = CategoryTypeObjList.Terms.ID;
    vm.payablePaymentMethod = CategoryTypeObjList.PayablePaymentMethods.ID;
    vm.receivablePaymentMethod = CategoryTypeObjList.ReceivablePaymentMethods.ID;
    vm.printertype = CategoryTypeObjList.Printer.ID;
    vm.barcodeSeparator = CategoryTypeObjList.BarcodeSeparator.ID;
    vm.partsatatus = CategoryTypeObjList.PartStatus.ID;
    vm.DocumentType = CategoryTypeObjList.DocumentType.ID;
    vm.notificationCategoryID = CategoryTypeObjList.NotificationCategory.ID;
    vm.shippingType = CategoryTypeObjList.ShippingType.ID;
    vm.paymentTypeCategory = CategoryTypeObjList.PaymentTypeCategory.ID;
    vm.Carrier = CategoryTypeObjList.Carriers.ID;
    vm.categoryType = _.find(vm.CategoryTypeList, (cateType) => cateType.categoryTypeID === vm.categoryTypeID);
    vm.saveBtnFlag = false;
    vm.showconfiguration = false;
    if (vm.categoryType && vm.categoryType.categoryTypeID === CategoryTypeObjList.EquipmentGroup.ID) {
      vm.isVisibleParent = true;
    }
    vm.shippingTypeId = CategoryTypeObjList.ShippingStatus.ID;
    vm.title = vm.gencCategoryID ? 'Update Generic Category' : 'Add Generic Category';
    vm.isSubmit = false;
    vm.manageGenericCategory = {
      isActive: true,
      isEOM: false
    };
    vm.selectedGenericCategory = null;
    vm.isDisableToAddUpdate = vm.categoryType.categoryTypeID === CategoryTypeObjList.HomeMenu.ID && !vm.loginUser.isUserAdmin ? true : false;
    vm.reportCategory = CategoryTypeObjList.ReportCategory.ID;
    vm.descriptionMaxLength = _maxLengthForDescription;
    vm.RadioGroup = {
      isActive: {
        array: CORE.ActiveRadioGroup
      }
    };

    // Get details of site map crumb
    $timeout(() => vm.crumbs = BaseService.getCrumbs(), _configBreadCrumbTimeout);

    vm.goBack = () => vm.changeRoute();

    vm.changeRoute = () => {
      if (vm.categoryType) {
        if (vm.categoryType.categoryTypeID === CategoryTypeObjList.EquipmentGroup.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_EQPGROUP_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.EquipmentType.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_EQPTYPE_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.EquipmentOwnership.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_EQPOWNER_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.StandardType.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_STANDTYPE_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.EmployeeTitle.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_EMPTITLE_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.OperationType.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_OPTYPE_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.ShippingStatus.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_SHIPSTATUS_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.OperationVerificationStatus.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_VERISTATUS_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.LocationType.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_LOCATIONTYPE_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.WorkArea.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_WORKAREA_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.Terms.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_TERMS_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.ShippingType.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_SHIPPINGTYPE_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.Printer.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_PRINTER_TYPE_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.PartStatus.ID) {
          $state.go(USER.ADMIN_PART_STATUS_STATE);
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.BarcodeSeparator.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_BARCODE_SEPARATOR_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.HomeMenu.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_HOME_MENU_CATEGORY_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.DocumentType.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_DOCUMENTTYPE_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.ECO_DFMType.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_ECO_DFM_TYPE_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.ChargesType.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_CHARGES_TYPE_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.NotificationCategory.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_NOTIFICATION_CATEGORY_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.PayablePaymentMethods.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_PAYMENT_METHODS_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.Carriers.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_CARRIERMST_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.ReportCategory.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_REPORTCATEGORY_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.PartRequirementCategory.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_PARTREQUIREMENTCATEGORY_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.ReceivablePaymentMethods.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_RECEIVABLE_PAYMENT_METHODS_STATE, { categoryTypeID: vm.categoryTypeID });
        } else if (vm.categoryType.categoryTypeID === CategoryTypeObjList.PaymentTypeCategory.ID) {
          $state.go(USER.ADMIN_GENERICCATEGORY_PAYMENT_TYPE_CATEGORY_STATE, { categoryTypeID: vm.categoryTypeID });
        } else {
          $state.go(USER.ADMIN_GENERICCATEGORY_EQPTYPE_STATE, { categoryTypeID: vm.categoryTypeID });
        }
      } else {
        $state.go(USER.ADMIN_GENERICCATEGORY_EQPTYPE_STATE, { categoryTypeID: vm.categoryTypeID });
      }
    };
    // get tooltip name
    vm.getTitleName = () => {
      let titleNameText = vm.manageGenericCategory.gencCategoryName ? ': ' + angular.copy(vm.manageGenericCategory.gencCategoryName) : ' ';
      if (vm.categoryType.categoryTypeID === CategoryTypeObjList.BarcodeSeparator.ID && vm.manageGenericCategory.gencCategoryCode) {
        titleNameText = titleNameText + ' (' + vm.manageGenericCategory.gencCategoryCode + ')';
      }
      return titleNameText;
    };
    // get tooltip name
    vm.getTooltipName = () => {
      let tooltipText = vm.manageGenericCategory.gencCategoryName ? angular.copy(vm.manageGenericCategory.gencCategoryName) : ' ';
      if (vm.categoryType.categoryTypeID === CategoryTypeObjList.BarcodeSeparator.ID && vm.manageGenericCategory.gencCategoryCode) {
        tooltipText = tooltipText + ' (' + vm.manageGenericCategory.gencCategoryCode + ')';
      }
      return tooltipText;
    };
    const genericcategoryTemplate = {
      gencCategoryID: vm.gencCategoryID,
      gencCategoryName: null,
      gencCategoryCode: null,
      categoryType: vm.categoryType.categoryType,
      displayOrder: null,
      parentGencCategoryID: null,
      isActive: true
    };
    vm.clearGenericCategory = () => {
      vm.manageGenericCategory = Object.assign({}, genericcategoryTemplate);
    };
    vm.getColor = ($event, colorCode) => {
      let color = CORE.DEFAULT_STANDARD_CLASS_COLOR;
      if (colorCode) {
        const rgbColor = new tinycolor(colorCode).toRgb();
        color = stringFormat(RFQTRANSACTION.RGB_COLOR_FORMAT, rgbColor.r, rgbColor.g, rgbColor.b);
      }
      $mdColorPicker.show({
        value: color,
        genericPalette: true,
        $event: $event,
        mdColorHistory: false,
        mdColorAlphaChannel: false,
        mdColorSliders: false,
        mdColorGenericPalette: false,
        mdColorMaterialPalette: false
      }).then((color) => {
        vm.color = new tinycolor(color).toHex();
        vm.manageGenericCategory.colorCode = '#' + vm.color;
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // show category type wise generic category

    /* Parent Generic Category dropdown fill up */
    const getGenericCategoryList = () => {
      vm.GenericCategoryList = [];
      const GencCategoryType = [];
      GencCategoryType.push(vm.categoryType.categoryType);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: vm.manageGenericCategory.isActive ? vm.manageGenericCategory.isActive : false
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((genericCategories) => {
        vm.GenericCategoryList = _.filter(genericCategories.data, (categoryitem) => !categoryitem.parentGencCategoryID && categoryitem.categoryType === vm.categoryType.categoryType && categoryitem.gencCategoryID !== vm.manageGenericCategory.gencCategoryID);
        return $q.resolve(vm.GenericCategoryList);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Manually put as load "ViewDataElement directive" only on other details tab   */
    vm.onTabChanges = (TabName, msWizard) => {
      BaseService.currentPageForms = [msWizard.currentStepForm()];
    };

    /* retrieve generic category Details*/
    const genericcategoryDetails = () => {
      if (vm.gencCategoryID) {
        return GenericCategoryFactory.retrieveGenericCategory().query({ id: vm.gencCategoryID }).$promise.then((genericcategory) => {
          vm.manageGenericCategory = angular.copy(genericcategory.data);
          if (vm.manageGenericCategory && vm.manageGenericCategory.systemGenerated) {
            vm.disabledSystemGenerated = true;
          }
          vm.PrinterFormatName = vm.manageGenericCategory.gencCategoryName;
          if (!vm.isVisibleParent) {
            vm.manageGenericCategory.parentGencCategoryID = null;
          }
          if (vm.autoCompleteCarriers && vm.categoryType.categoryTypeID === vm.shippingType) {
            vm.autoCompleteCarriers.keyColumnId = vm.manageGenericCategory.carrierID;
          }
          $timeout(() => {
            if (vm.gencCategoryID && vm.manageGenericCategoryForm) {
              BaseService.checkFormValid(vm.manageGenericCategoryForm, false);
            }
          }, 0);
          return getGenericCategoryList();
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        if (!vm.isVisibleParent) {
          vm.manageGenericCategory.parentGencCategoryID = null;
        }
        return getGenericCategoryList();
      }
    };

    const getAllGenericCategoryByCategoryType = (searchObj) => {
      if (vm.categoryTypeID) {
        return GenericCategoryFactory.getAllGenericCategoryByCategoryType().query({
          categoryType: vm.categoryType.categoryType,
          searchObj: (searchObj ? searchObj.searchquery : null)
        }).$promise.then((genericcategory) => {
          vm.gencCatHeaderList = angular.copy(genericcategory.data);
          return $q.resolve(vm.gencCatHeaderList);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

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
          _.each(carrier.data, (item) => item.gencCategoryDisplayName = item.gencCategoryCode ? stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName) : item.gencCategoryName);
          return $q.resolve(vm.carrierlist);
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

    const autocompletePromise = [genericcategoryDetails()];
    if (vm.categoryType && vm.categoryType.categoryTypeID === vm.shippingType) {
      autocompletePromise.push(getCarrierList());
    }
    if (vm.categoryType && vm.categoryType.categoryTypeID === vm.payablePaymentMethod) {
      autocompletePromise.push(getPaymentTypeCategoryList());
      autocompletePromise.push(getBank());
    }
    if (vm.categoryType && vm.categoryType.categoryTypeID === vm.receivablePaymentMethod) {
      autocompletePromise.push(getPaymentTypeCategoryList());
    }
    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
      initAutoComplete();
    }).catch((error) => BaseService.getErrorLog(error));

    const initAutoComplete = () => {
      vm.autoCompleteGenericCategory = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.manageGenericCategory.parentGencCategoryID || null,
        inputName: vm.categoryType.categoryType,
        placeholderName: 'Parent Name',
        addData: { headerTitle: 'Parent ' + vm.categoryType.singleLabel },
        isRequired: false,
        isAddnew: true,
        callbackFn: getGenericCategoryList
      };
      vm.autoCompleteGenericCategoryList = {
        columnName: 'gencCategoryName',
        keyColumnName: 'gencCategoryID',
        keyColumnId: null,
        inputName: 'gencCategoryID',
        placeholderName: 'gencCategoryID',
        isRequired: false,
        isDisabled: false,
        isAddnew: false,
        onSelectCallbackFn: selectGenericCategoryData,
        onSearchFn: function (query) {
          const searchobj = {
            searchquery: query
          };
          return getAllGenericCategoryByCategoryType(searchobj);
        }
      };
      vm.autoCompleteCarriers = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.manageGenericCategory.carrierID || null,
        inputName: CategoryTypeObjList.Carriers.Title,
        placeholderName: CategoryTypeObjList.Carriers.singleLabel,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_CARRIERMST_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.Carrier,
          headerTitle: CategoryTypeObjList.Carriers.Name
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getCarrierList
      };
      vm.autoCompletePaymentTypeCategory = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.manageGenericCategory.paymentTypeCategoryId || null,
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
        keyColumnId: vm.manageGenericCategory && vm.manageGenericCategory.bankid ? vm.manageGenericCategory.bankid : null,
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
    };

    const selectGenericCategoryData = (item) => {
      if (item) {
        let manageGenericCategoryState = null;
        switch (parseInt(vm.categoryTypeID)) {
          case CategoryTypeObjList.EquipmentGroup.ID:
            manageGenericCategoryState = USER.ADMIN_EQPGROUP_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.EquipmentType.ID:
            manageGenericCategoryState = USER.ADMIN_EQPTYPE_TYPE_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.EquipmentOwnership.ID:
            manageGenericCategoryState = USER.ADMIN_EQPOWNER_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.StandardType.ID:
            manageGenericCategoryState = USER.ADMIN_STANDTYPE_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.EmployeeTitle.ID:
            manageGenericCategoryState = USER.ADMIN_EMPTITLE_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.OperationType.ID:
            manageGenericCategoryState = USER.ADMIN_OPTYPE_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.ShippingStatus.ID:
            manageGenericCategoryState = USER.ADMIN_SHIPSTATUS_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.OperationVerificationStatus.ID:
            manageGenericCategoryState = USER.ADMIN_VERISTATUS_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.LocationType.ID:
            manageGenericCategoryState = USER.ADMIN_LOCATIONTYPE_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.WorkArea.ID:
            manageGenericCategoryState = USER.ADMIN_WORKAREA_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.ShippingType.ID:
            manageGenericCategoryState = USER.ADMIN_SHIPPINGTYPE_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.Terms.ID:
            manageGenericCategoryState = USER.ADMIN_TERMS_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.Printer.ID:
            manageGenericCategoryState = USER.ADMIN_PRINTER_TYPE_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.PartStatus.ID:
            manageGenericCategoryState = USER.ADMIN_PART_STATUS_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.BarcodeSeparator.ID:
            manageGenericCategoryState = USER.ADMIN_BARCODE_SEPARATOR_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.HomeMenu.ID:
            manageGenericCategoryState = USER.ADMIN_HOME_MENU_CATEGORY_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.DocumentType.ID:
            manageGenericCategoryState = USER.ADMIN_DOCUMENT_TYPE_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.ECO_DFMType.ID:
            manageGenericCategoryState = USER.ADMIN_ECO_DFM_TYPE_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.ChargesType.ID:
            manageGenericCategoryState = USER.ADMIN_CHARGES_TYPE_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.NotificationCategory.ID:
            manageGenericCategoryState = USER.ADMIN_NOTIFICATION_CATEGORY_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.PayablePaymentMethods.ID:
            manageGenericCategoryState = USER.ADMIN_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.Carriers.ID:
            manageGenericCategoryState = USER.ADMIN_CARRIERMST_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.ReportCategory.ID:
            manageGenericCategoryState = USER.ADMIN_REPORTCATEGORY_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.PartRequirementCategory.ID:
            manageGenericCategoryState = USER.ADMIN_PARTREQUIREMENTCATEGORY_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.ReceivablePaymentMethods.ID:
            manageGenericCategoryState = USER.ADMIN_RECEIVABLE_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE;
            break;
          case CategoryTypeObjList.PaymentTypeCategory.ID:
            manageGenericCategoryState = USER.ADMIN_PAYMENT_TYPE_CATEGORY_MANAGEGENERICCATEGORY_STATE;
            break;
        }

        $state.go(manageGenericCategoryState, {
          categoryTypeID: vm.categoryTypeID,
          gencCategoryID: item.gencCategoryID
        });

        $timeout(() => {
          vm.autoCompleteGenericCategoryList.keyColumnId = null;
        }, true);
      }
    };

    vm.addGenericCategoryType = () => selectGenericCategoryData({ gencCategoryID: null }, null);

    /* save Generic Category */
    vm.SaveGenericCategory = (msWizard, isCheckUnique) => {
      vm.saveBtnFlag = true;
      vm.isSubmit = false;
      if (BaseService.focusRequiredField(vm.manageGenericCategoryForm)) {
        vm.isSubmit = true;
        vm.saveBtnFlag = false;
        return;
      }

      const genericCategoryInfo = {
        gencCategoryID: vm.manageGenericCategory.gencCategoryID,
        gencCategoryName: vm.manageGenericCategory.gencCategoryName,
        gencCategoryCode: vm.manageGenericCategory.gencCategoryCode ? (vm.manageGenericCategory.gencCategoryCode).toUpperCase() : null,
        categoryType: vm.categoryType.categoryType,
        singleLabel: vm.categoryType.singleLabel,
        parentGencCategoryID: vm.autoCompleteGenericCategory.keyColumnId || null,
        isActive: vm.manageGenericCategory.isActive || false,
        colorCode: vm.manageGenericCategory.colorCode,
        isCheckUnique: isCheckUnique || false,
        termsDays: vm.manageGenericCategory.termsDays,
        carrierID: vm.autoCompleteCarriers.keyColumnId || null,
        description: vm.manageGenericCategory.description || null,
        isEOM: vm.manageGenericCategory.isEOM || false,
        paymentTypeCategoryId: vm.autoCompletePaymentTypeCategory ? vm.autoCompletePaymentTypeCategory.keyColumnId : null,
        bankid: vm.autoCompleteBank ? vm.autoCompleteBank.keyColumnId : null
      };

      if (vm.manageGenericCategory && vm.manageGenericCategory.gencCategoryID) {
        vm.cgBusyLoading = GenericCategoryFactory.genericcategory().update({
          id: vm.manageGenericCategory.gencCategoryID
        }, genericCategoryInfo).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.manageGenericCategoryForm.$setPristine();
            vm.saveBtnFlag = false;
          } else if (res && res.status !== CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.saveBtnFlag = false;
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.manageGenericCategoryForm);
              });
            }
          }
        }).catch((error) => {
          vm.saveBtnFlag = false;
          return BaseService.getErrorLog(error);
        });
      } else {
        vm.cgBusyLoading = GenericCategoryFactory.genericcategory().save(genericCategoryInfo).$promise.then((res) => {
          if (res.data && res.data.gencCategoryID) {
            vm.gencCategoryID = res.data.gencCategoryID;
            $state.transitionTo($state.$current, { gencCategoryID: vm.gencCategoryID }, { location: true, inherit: true, notify: false });
            genericcategoryDetails(); // get latest details
            if (vm.categoryType && vm.categoryType.categoryTypeID === vm.shippingType) {
              getCarrierList();
            }
            vm.saveBtnFlag = false;
            vm.manageGenericCategoryForm.$setPristine();
          } else {
            if (res.data && res.data.fieldName) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.UNIQUE_CONFIRM_MESSAGE);
              messageContent.message = stringFormat(messageContent.message, res.data.fieldName);
              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_CREATENEW_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(obj).then(() => {
                vm.saveBtnFlag = false;
                vm.SaveGenericCategory(msWizard, false);
              }, () => {
              }).catch((error) => {
                vm.saveBtnFlag = false;
                return BaseService.getErrorLog(error);
              });
            } else if (res.errors) {
              vm.saveBtnFlag = false;
              if (checkResponseHasCallBackFunctionPromise(res)) {
                res.alretCallbackFn.then(() => {
                  BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.manageGenericCategoryForm);
                });
              }
            }
          }
        }).catch((error) => {
          vm.saveBtnFlag = false;
          return BaseService.getErrorLog(error);
        });
      }
    };

    // close popup on page destroy
    $scope.$on('$destroy', () => $mdDialog.hide(false, { closeAll: true }));

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    // check Generic Category Already Exists
    vm.checkGenericCategoryAlreadyExists = () => {
      if (vm.manageGenericCategoryForm && (vm.manageGenericCategoryForm.gencCategoryName.$dirty && vm.manageGenericCategory.gencCategoryName)) {
        const objs = {
          gencCategoryName: vm.manageGenericCategory.gencCategoryName || null,
          gencCategoryCode: vm.manageGenericCategory.gencCategoryCode || null,
          singleLabel: vm.categoryType.singleLabel,
          categoryType: vm.categoryType.categoryType,
          gencCategoryID: vm.gencCategoryID
        };
        vm.cgBusyLoading = GenericCategoryFactory.checkGenericCategoryAlreadyExists().query({ objs: objs }).$promise.then((res) => {
          vm.cgBusyLoading = false;
          if (res.status !== CORE.ApiResponseTypeStatus.SUCCESS) {
            // as alert for duplicate will popup from custom interceptor as per new format

            if (res && res.errors && res.errors.data) {
              if (checkResponseHasCallBackFunctionPromise(res)) {
                res.alretCallbackFn.then(() => {
                  if (res.errors.data.isDuplicateGencCategoryCode) {
                    vm.manageGenericCategory.gencCategoryCode = null;
                    setFocusByName('gencCategoryCode');
                  } else {
                    vm.manageGenericCategory.gencCategoryName = null;
                    setFocusByName('gencCategoryName');
                  }
                });
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // check Generic Category Already Exists
    vm.checkGenericCategoryAlreadyExistsForCode = () => {
      if (vm.manageGenericCategoryForm &&
        vm.manageGenericCategoryForm.gencCategoryCode.$dirty && vm.manageGenericCategory.gencCategoryCode) {
        const objs = {
          gencCategoryCode: vm.manageGenericCategory.gencCategoryCode || null,
          singleLabel: vm.categoryType.singleLabel,
          categoryType: vm.categoryType.categoryType,
          gencCategoryID: vm.gencCategoryID
        };
        vm.cgBusyLoading = GenericCategoryFactory.checkGenericCategoryAlreadyExists().query({ objs: objs }).$promise.then((res) => {
          vm.cgBusyLoading = false;
          if (res.status !== CORE.ApiResponseTypeStatus.SUCCESS) {
            // as alert for duplicate will popup from custom interceptor as per new format
            if (res && res.errors && res.errors.data) {
              if (checkResponseHasCallBackFunctionPromise(res)) {
                res.alretCallbackFn.then(() => {
                  if (res.errors.data.isDuplicateGencCategoryCode) {
                    vm.manageGenericCategory.gencCategoryCode = null;
                    setFocusByName('gencCategoryCode');
                  } else {
                    vm.manageGenericCategory.gencCategoryName = null;
                    setFocusByName('gencCategoryName');
                  }
                });
              }
            }
            // oldgencCategoryName = angular.copy(vm.manageGenericCategory.gencCategoryName);
            // oldCategoryCode = angular.copy(vm.manageGenericCategory.gencCategoryCode);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.onEOMChange = () => {
      if (vm.manageGenericCategory.isEOM) {
        vm.manageGenericCategory.termsDays = 0;
      }
    };

    // redirect to parent Group master
    vm.goToParentGroupList = () => BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_EQPGROUP_STATE, {});

    angular.element(() => BaseService.currentPageForms = [vm.manageGenericCategoryForm]);

    vm.configureBartender = () => vm.showconfiguration = true;
    vm.closeConfiguration = () => vm.showconfiguration = false;

    // go to carrier list
    vm.goTocarrierList = () => BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_CARRIERMST_STATE);
    vm.goToPaymentTypeCategoryList = () => BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_PAYMENT_TYPE_CATEGORY_STATE);
    vm.goToBankList = () => {
      BaseService.goToBankList();
    };
  }
})();
