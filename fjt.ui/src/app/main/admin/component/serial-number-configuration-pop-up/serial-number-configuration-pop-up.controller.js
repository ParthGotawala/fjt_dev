(function () {
  'use strict';

  angular
    .module('app.admin.component')
    .controller('SerialNumberConfigurationPopupController', SerialNumberConfigurationPopupController);

  /** @ngInject */
  function SerialNumberConfigurationPopupController($mdDialog, CORE, data, BaseService, $mdMenu, DialogFactory, SerialNumberConfigurationFactory, $timeout, USER, GenericCategoryFactory, $q) {
    const vm = this;
    vm.assembly = data;

    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.labelConstant = CORE.LabelConstant;
    vm.configurationLevel = CORE.SerialNumberGenerateLevel;
    vm.assyDateCodeFormats = CORE.AssyDateCodeFormats;
    vm.configuration = {};
    vm.serialHistoryList = [];
    vm.PREFIX_OR_SUFFIX_REQUIRED_MESSAGE = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PREFIX_OR_SUFFIX_REQUIRED_MESSAGE;
    vm.WorkorderSerialNoConst = CORE.WorkorderSerialNo;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.restrictLikOperatoreWildCardChar = CORE.restrictLikOperatoreWildCardChar;
    vm.checkFormDirty = (form) => BaseService.checkFormDirty(form);
    vm.headerNote = stringFormat('<ol><li>{0}</li> <li>{1}</li> </ol>', vm.PREFIX_OR_SUFFIX_REQUIRED_MESSAGE.message, vm.labelConstant.Workorder.WorkorderSerialNoSuffixPreFixNote);
    vm.isReadOnly = true;
    function setTabWisePageRights(pageList) {
      if (pageList && pageList.length > 0) {
        const pageDetail = pageList.find((a) => a.PageDetails && ((a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE)));
        if (pageDetail) {
          vm.isReadOnly = pageDetail.RO ? true : false;
        }
      }
    }

    if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
      setTabWisePageRights(BaseService.loginUserPageList);
    }

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.manageConfigurationForm);
      if (isdirty) {
        const data = {
          form: vm.manageConfigurationForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };
    // Check Form Dirty state on state change and reload browser
    angular.element(() => BaseService.currentPagePopupForm = [vm.manageConfigurationForm]);

    vm.openMenu = function ($mdMenu, ev) {
      //'originatorEv = ev;
      $mdMenu.open(ev);
    };

    vm.configurationList = [];

    /* delete component*/
    vm.deleteRecord = () => {
      if (!vm.configurationList || (Array.isArray(vm.configurationList) && !vm.configurationList[0].id)) {
        return;
      }
      $mdMenu.hide();
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.DELETE_CONFIRM_CONFIGURE_SERIAL);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          const objIDs = {
            id: vm.configurationList[0].id,
            CountList: false
          };

          vm.cgBusyLoading = SerialNumberConfigurationFactory.deleteConfiguration().query(objIDs).$promise.then((response) => {
            if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.manageConfigurationForm.$setPristine();
            }
            retriveConfiguration();
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, () => { }).catch((error) => BaseService.getErrorLog(error));
    };

    //go to manage part number
    vm.goToAssyMaster = (partID) => {
      BaseService.goToComponentDetailTab(null, partID);
      return false;
    };
    //go to assy list
    vm.goToAssyList = () => {
      BaseService.goToPartList();
      return false;
    };
    // go to customer
    vm.goToCustomer = () => {
      BaseService.goToCustomer(vm.assembly.customerID);
      return false;
    };
    //redirect to customer list
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
      return false;
    };
    ///go to standard list
    vm.goToStandardList = () => {
      BaseService.goToStandardList();
      return false;
    };
    // init auto complete for barcode separator
    const initAutoComplete = () => {
      vm.defaultAutoCompleteSeparator = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: null,
        inputName: CategoryTypeObjList.BarcodeSeparator.Name,
        placeholderName: CategoryTypeObjList.BarcodeSeparator.Title,
        addData: { headerTitle: CategoryTypeObjList.BarcodeSeparator.Title },
        isRequired: false,
        isDisabled: false,
        isAddnew: true,
        callbackFn: getGenericCategoryList,
        onSelectCallbackFn: selectGenericCategory
      };
    };
    function retriveConfiguration() {
      var reqeustModel = {
        partId: vm.assembly.PIDCode,
        nickname: vm.assembly.nickName
      };

      vm.cgBusyLoading = SerialNumberConfigurationFactory.retriveConfiguration(reqeustModel).query().$promise.then((response) => {
        if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (response.data) {
            vm.configurationList = Array.isArray(response.data.configurationList) && response.data.configurationList.length > 0 ? response.data.configurationList : [];
            vm.serialHistoryList = Array.isArray(response.data.historyList) ? response.data.historyList : [];
            _.each(vm.configurationList, (item) => {
              item.autoCompleteSeparator = angular.copy(vm.defaultAutoCompleteSeparator);
              item.separatorList = angular.copy(vm.separatorList);
              if (item.autoCompleteSeparator) {
                item.autoCompleteSeparator.keyColumnId = item.barcodeSeparatorID;
              }
            });
          }
          if (vm.configurationList.length === 0) {
            vm.addNewLine();
          }
          $timeout(() => {
            vm.manageConfigurationForm.$setPristine();
          }, 300);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    vm.headerdata = [];
    function initHeaderdata() {
      vm.headerdata.push({
        label: vm.labelConstant.Assembly.ID,
        value: vm.assembly.PIDCode,
        displayOrder: 1,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: vm.assembly.id,
        isCopy: true,
        isCopyAheadLabel: false,
        isAssy: true,
        imgParms: {
          imgPath: vm.assembly.rohsIcon,
          imgDetail: vm.assembly.rohsName
        }
      }, {
        label: vm.labelConstant.Assembly.MFGPN,
        value: vm.assembly.mfgPN,
        displayOrder: 2,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: vm.assembly.id,
        isCopy: true,
        isCopyAheadLabel: false,
        isAssy: true,
        imgParms: {
          imgPath: vm.assembly.rohsIcon,
          imgDetail: vm.assembly.rohsName
        }
      }, {
        label: vm.labelConstant.Assembly.NickName,
        value: vm.assembly.nickName,
        displayOrder: 3
      }
      );
    }
    initHeaderdata();

    vm.addNewLine = () => {
      if (vm.configurationList.length === 0) {
        vm.configurationList.push({
          configurationLevel: CORE.SerialNumberGenerateLevel[0].id,
          nickname: vm.assembly.nickName,
          startNumber: 1,
          noofDigits: 1,
          autoCompleteSeparator: angular.copy(vm.defaultAutoCompleteSeparator),
          separatorList: angular.copy(vm.separatorList)
          //assyDateCodeFormat:null
        });
      }
    };

    vm.SaveSerialNoConfiguration = () => {
      if (BaseService.focusRequiredField(vm.manageConfigurationForm)) {
        return;
      }

      const details = vm.configurationList.find((item) => item.configurationLevel
        && Number.isInteger(parseInt(item.noofDigits)) && Number.isInteger(parseInt(item.startNumber)));

      if (details.isInValidDatecode || details.invalidDigitNumber) {
        const invalidField = details.isInValidDatecode ? 'assyDateCode0' : 'startNumber0';
        $('#' + invalidField).focus();
        return;
      }
      details.assyDateCodeFormat = details.assyDateCodeFormat ? details.assyDateCodeFormat : null;

      vm.cgBusyLoading = SerialNumberConfigurationFactory.saveConfiguration().save(details).$promise.then((response) => {
        if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.manageConfigurationForm.$setPristine();
          $mdDialog.hide();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.checkAssyDateCode = (item) => {
      item.isInValidDatecode = false;
      item.isInValidDatecode = BaseService.validateDateCode(item.assyDateCodeFormat, item.assyDateCode);
    };

    vm.checkStartNumber = (item) => {
      item.invalidDigitNumber = Number.isInteger(parseInt(item.startNumber)) ?
        (item.noofDigits < item.startNumber.toString().length) : true;
      item.invalidDigit = (!Number.isInteger(parseInt(item.noofDigits)));
    };

    vm.goToWorkorderDetails = (woID) => {
      BaseService.goToWorkorderDetails(woID);
      return false;
    };

    // check datecode format require
    vm.isRequiredDateCodeFormat = () => {
      const dateFormatSelected = _.find(vm.configurationList, (confParams) => confParams.assyDateCodeFormat);
      return dateFormatSelected ? true : false;
    };

    // get barcode separator list
    const getGenericCategoryList = () => {
      const listObj = {
        GencCategoryType: [CategoryTypeObjList.BarcodeSeparator.Name],
        isActive: true
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((genericCategories) => {
        vm.separatorList = genericCategories.data;
        _.each(genericCategories.data, (item) => {
          item.gencCategoryDisplayName = item.gencCategoryCode ? stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName) : item.gencCategoryName;
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // select barcode separator
    const selectGenericCategory = (item, configItem) => {
      if (item) {
        configItem.barcodeSeparatorID = item.gencCategoryID;
        configItem.barcodeSepCode = item.gencCategoryCode;
        configItem.barcodeSepValue = item.gencCategoryName;
      }
      else {
        configItem.barcodeSeparatorID = null;
        configItem.barcodeSepCode = null;
        configItem.barcodeSepValue = null;
      }
    };

    vm.checkPrefixSuffix = (item, fieldName) => {
      if (fieldName === 'suffix') {
        if (item.suffix && !new RegExp(vm.restrictLikOperatoreWildCardChar).test(item.suffix)) {
          item.isInvalidSuffix = true;
        } else {
          item.isInvalidSuffix = false;
        }
      } else if (fieldName === 'prefix') {
        if (item.prefix && !new RegExp(vm.restrictLikOperatoreWildCardChar).test(item.prefix)) {
          item.isInvalidPrefix = true;
        } else {
          item.isInvalidPrefix = false;
        }
      }
    };

    // first get barcode separator list then  retrieve configuration
    const initPromise = [getGenericCategoryList()];
    vm.cgBusyLoading = $q.all(initPromise).then(() => {
      initAutoComplete();
      retriveConfiguration();
    }).catch((error) => BaseService.getErrorLog(error));
  }
})();
