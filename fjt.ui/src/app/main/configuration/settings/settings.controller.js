(function () {
  'use strict';

  angular
    .module('app.configuration.settings')
    .controller('SettingsController', SettingsController);

  function SettingsController(RoleFactory,
    CORE, USER, CONFIGURATION, DialogFactory, BaseService, SettingsFactory, $scope, $q, DCFormatFactory, NotificationFactory, TRANSACTION) {
    const vm = this;
    //Set as current form when page loaded
    angular.element(() => {
      BaseService.currentPageForms.push(vm.dataKeyForm);
    });
    vm.EmptyMesssage = CONFIGURATION.CONFIGURATION_EMPTYSTATE.SETTINGS;
    vm.dkVersionList = CORE.DKVersionList;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.constantOfSetting = CONFIGURATION.SETTING;
    vm.labelConstantOfSetting = CORE.LabelConstant.Datakey.DATAKEY_LABEL;
    vm.dataKeysHistory = vm.labelConstantOfSetting.DATAKEYSHISTORY;
    vm.dataKeyDescription = vm.labelConstantOfSetting.DATAKEY_DESCRIPTION;
    vm.inputControlName = CORE.LabelConstant.Datakey.DATAKEY_INPUTCONTROLNAME;
    vm.listOfClusters = {};
    vm.CurrentPageName = vm.labelConstantOfSetting.DATAKEYS;
    vm.userroles = [];
    vm.datePickerFormatList = [];
    vm.dateTimePickerList = [];
    vm.dateFormatList = [];
    vm.timeFormatList = [];
    vm.commonNumberListUnit = [];
    vm.contactPersonDisplayFormats = [];
    vm.employeeDisplayFormats = [];
    vm.accountingYearList = [];
    vm.timezoneList = [];
    vm.allExpanded = true;
    vm.isNoDataFound = false;
    vm.isascordering = 0; // Ascending = 0 & Decending = 1
    vm.searchQuery = '';
    vm.ordering = 'clusterName';
    vm.orderingvalue = 'clusterName'; // Cluster Name = 0 & Display Name 1
    vm.commonNumberValueForCopy;
    vm.commonNumberValue = {};
    $scope.orderingoptions = CORE.DatakeyOrderingArray;

    /* Pass value for ordering operation */
    vm.orderingOnField = () => {
      vm.orderingvalue = vm.ordering;
    };

    /* Ascending Descending Datakey List */
    vm.ascendingOrDescendingList = () => {
      if (vm.ordering) {
        while (vm.orderingvalue.charAt(0) === '+' || vm.orderingvalue.charAt(0) === '-') {
          vm.orderingvalue = vm.orderingvalue.substring(1);
        }
        if (parseInt(vm.isascordering) === 0) {
          vm.orderingvalue = '+' + vm.orderingvalue;
        } else {
          vm.orderingvalue = '-' + vm.orderingvalue;
        }
      } else {
        if (parseInt(vm.isascordering) === 0) {
          vm.orderingvalue = '+' + vm.orderingvalue;
        } else {
          vm.orderingvalue = '-' + vm.orderingvalue;
        }
      }
    };

    /* Get role list */
    vm.cgBusyLoading = RoleFactory.rolePermission().query().$promise.then((res) => {
      _.filter(res.data, (data) => {
        if (data.isActive && data.systemGenerated) {
          vm.userroles.push({ id: data.name, value: data.name });
        }
      });
    }).catch((error) => BaseService.getErrorLog(error));

    /* Get data key list */
    vm.getDataKeyList = () => {
      vm.cgBusyLoading = SettingsFactory.retriveDataKeyList().query().$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (response) {
            setDataAfterGetAPICall(response);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.getDataKeyList();

    /* Get all list from configuration and core constant file */
    _.each(CONFIGURATION.SETTINGSDATEFORMAT, (item) => {
      vm.dateFormatList.push({ id: item, value: item });
    });
    _.each(CORE.DateFormatArray, (item) => {
      if (item.type === CORE.DatakeyDateType.TYPE1 && item.isDisplayFullYearFormat) {
        const data = {
          'format': item.format,
          'mask': item.uimaskformat,
          'placeholder': item.placeholder,
          'ReportDateFormat': item.ReportDateFormat,
          'MySQLFormat': item.MySQLFormat
        };
        vm.datePickerFormatList.push({ id: data, value: data.format });
      } else if (item.type === CORE.DatakeyDateType.TYPE0 && item.isDisplayFullYearFormat) {
        const data = {
          'format': item.format,
          'mask': item.uimaskformat,
          'placeholder': item.placeholder,
          'ReportDateFormat': item.ReportDateFormat,
          'MySQLFormat': item.MySQLFormat
        };
        vm.dateTimePickerList.push({ id: data, value: data.format });
      }
    });
    _.each(CORE.TimeFormatArray, (item) => {
      vm.timeFormatList.push({ id: item, value: item.format });
    });
    _.each(CORE.ContactPersonDisplayFormatList, (item) => {
      vm.contactPersonDisplayFormats.push({ id: item.id, value: item.value });
    });
    _.each(CORE.EmployeeDisplayFormatList, (item) => {
      vm.employeeDisplayFormats.push({ id: item.id, value: item.value });
    });
    _.each(CORE.commonNumberUnit, (item) => {
      vm.commonNumberListUnit.push({ id: item, value: item.unitename });
    });
    _.each(CONFIGURATION.ACCOUNTINGYEAR, (item) => {
      vm.accountingYearList.push({ id: item, value: item });
    });

    function getDateCodeFormatList() {
      vm.dateCodeFormatList = [];
      return DCFormatFactory.retriveDateCodeFormatList().query({}).$promise.then((dcFormatList) => {
        if (dcFormatList && dcFormatList.data) {
          _.each(dcFormatList.data, (item) => {
            vm.dateCodeFormatList.push({ id: item.id, value: item.dateCodeFormatValue });
          });
        }
        return $q.resolve(dcFormatList);
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function getAllTimezoneList() {
      return SettingsFactory.getTimezoneList().query().$promise.then((timezones) => {
        vm.timezoneList = [];
        if (timezones && timezones.data && timezones.data.length > 0) {
          _.each(timezones.data, (item) => {
            vm.timezoneList.push({
              id: item.offsetDBValue,
              value: item.value
            });
          });
        }
        return $q.resolve(timezones);
      }).catch((error) => BaseService.getErrorLog(error));
    }

    /* Expand or Collapse to individual data key's in group */
    vm.expandcollapse = (key) => {
      if (vm.listOfClusters[key].expanded) {
        vm.listOfClusters[key].expanded = false;
        const isCollapseAll = _.every(vm.listOfClusters, (isCollapseAll) => isCollapseAll.expanded === false);
        if (isCollapseAll) {
          vm.allExpanded = false;
        }
      } else {
        vm.listOfClusters[key].expanded = true;
        const isCollapseAll = _.every(vm.listOfClusters, (isCollapseAll) => isCollapseAll.expanded === false);
        if (!isCollapseAll) {
          vm.allExpanded = true;
        }
      }
    };

    /* Expand or Collapse to all data key's in group */
    vm.expandOrCollapseAll = () => {
      if (vm.sourceData) {
        vm.allExpanded = !vm.allExpanded;
        Object.keys(vm.listOfClusters).forEach((v) => vm.listOfClusters[v].expanded = vm.allExpanded);
      }
    };

    /* Call to set all clusters expanded true by default */
    function setDataAfterGetAPICall(response) {
      if (response && response.data.settings) {
        vm.sourceData = response.data.settings;
        vm.listOfClusters = setClustersExpanded(vm.sourceData, 'clusterName');
        vm.datakeyList = response.data.settings;
        vm.currentdata = vm.sourceData.length;
        if (vm.sourceData) {
          const autocompletePromise = [getAllTimezoneList(), getDateCodeFormatList()];
          vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
            bindDataAndPatterns();
          });
        }
      } else {
        vm.isNoDataFound = true;
      }
    }
    /* Call to set all clusters expanded true by default */
    const setClustersExpanded = (settingsList, gourpByClusterName) => {
      const data = {};
      return settingsList.reduce((reduceSettingsList, currentValue) => {
        reduceSettingsList[currentValue[gourpByClusterName]] = { expanded: true };
        return data;
      }, {});
    };
    /* Refresh Content Search */
    vm.refreshSearch = () => {
      vm.sourceData = [];
      vm.searchQuery = '';
      vm.allExpanded = true;
      vm.getDataKeyList();
    };
    /* Clear Content Search */
    vm.clearSearch = () => {
      vm.searchQuery = '';
    };

    /* Bind drop down, radio buttons and validation patterns */
    function bindDataAndPatterns() {
      const index = -1;
      _.each(vm.sourceData, (s) => {
        s.index = index + 1;
        switch (s.datakey) {
          case vm.constantOfSetting.VerificationRoleAccess:
            s.dropDownListData = vm.userroles;
            break;
          case vm.constantOfSetting.DeleteRoleAccess:
            s.dropDownListData = vm.userroles;
            break;
          case vm.constantOfSetting.FeederStatusAccess:
            s.dropDownListData = vm.userroles;
            break;
          case vm.constantOfSetting.MFRRemoveAccess:
            s.dropDownListData = vm.userroles;
            break;
          case vm.constantOfSetting.SupervisorApprovalForUMIDScan:
            s.dropDownListData = vm.userroles;
            break;
          case vm.constantOfSetting.RFQInternalVersionDateFormat:
            s.dropDownListData = vm.dateFormatList;
            break;
          case vm.constantOfSetting.DatePickerDateFormat:
            s.dropDownListData = vm.datePickerFormatList;
            break;
          case vm.constantOfSetting.DatePickerPaymentReportDateFormat:
            s.dropDownListData = CORE.DateFormatArrayForPaymentReport;
            break;
          case vm.constantOfSetting.TimePickerTimeFormat:
            s.dropDownListData = vm.timeFormatList;
            break;
          case vm.constantOfSetting.DateTimePickerDateTimeFormat:
            s.dropDownListData = vm.dateTimePickerList;
            break;
          case vm.constantOfSetting.AccountingYear:
            const getAccountingYearData = JSON.parse(s.datavalues);
            const selectedYear = getAccountingYearData.Type.Value;
            s.accountingYearValue = s.datavalues;
            s.datavalues = selectedYear;
            s.dropDownListData = vm.accountingYearList;
            break;
          case vm.constantOfSetting.Timezone:
            s.dropDownListData = vm.timezoneList;
            break;
          case vm.constantOfSetting.ContactPersonDisplayNameFormat:
            s.dropDownListData = vm.contactPersonDisplayFormats;
            break;
          case vm.constantOfSetting.PersonnelNameFormat:
            s.dropDownListData = vm.employeeDisplayFormats;
            break;
          case vm.constantOfSetting.DKVersion:
            s.dropDownListData = vm.dkVersionList;
            break;
          case vm.constantOfSetting.CustomerPackingSlipNumber:
            s.dropDownListData = CORE.CustomerPackingVersionFormat;
            break;
          case vm.constantOfSetting.CommonNumberFormat:
            vm.commonNumberValue = s.datavalues;
            vm.commonNumberValueForCopy = s.datavalues;
            break;
          case vm.constantOfSetting.InovaxeConnection:
            s.datavalues = parseInt(s.datavalues) === 1 ? CORE.InovaxeConnectionEnable[0].id : CORE.InovaxeConnectionEnable[1].id;
            s.dropDownListData = CORE.InovaxeConnectionEnable;
            break;
          case vm.constantOfSetting.MfgCodeNameFormat:
            const mfgCodeFormatDet = CORE.MFGCodeFormatList.find((a) => a.id === s.datavalues);
            s.datavalues = mfgCodeFormatDet.id;
            s.dropDownListData = CORE.MFGCodeFormatList;
            break;
          case vm.constantOfSetting.BartenderServer:
            s.maskingpattern = CORE.IPAddressPattern;
            break;
          case vm.constantOfSetting.BartenderServerPort:
            s.maskingpattern = CORE.DecimalNmberPattern;
            break;
          case vm.constantOfSetting.ServerDBMACAddress:
            s.maskingpattern = CORE.MACAddressPattern;
            break;
          case vm.constantOfSetting.BCCEmailReport:
            s.maskingpattern = CORE.EmailPattern;
            break;
          case vm.constantOfSetting.ComponentUpdateTimeInHrs:
            s.datakeyTimePattern = CORE.TimePattern;
            s.datakeyTimeMask = CORE.TimeMask;
            break;
          case vm.constantOfSetting.RFQInternalVersionMethod: // D or T Date or Text
            s.optionslist = CORE.RFQInternalVersionMethodArray;
            break;
          case vm.constantOfSetting.InoAutoServerHeartbeatStatus:
            s.optionslist = CORE.InoAutoServerHeartbeatStatusArray; // Online or Offline
            break;
          case vm.constantOfSetting.PricingServiceStatus:
            s.optionslist = CORE.PricingServiceStatusArray; // 1 or 0
            break;
          case vm.constantOfSetting.CustomerReceiptInvoiceAutoSelect:
            s.optionslist = CORE.CustomerReceiptInvoiceAutoSelectArray; // 1 or 2
            break;
          case vm.constantOfSetting.DefaultTheme:
            s.optionslist = CORE.DefaultThemeArray; // defaultTheme, pinkTheme, tealTheme
            break;
          case vm.constantOfSetting.DemoTheme:
            s.optionslist = CORE.DemoThemeArray; // 1, 0
            break;
          case vm.constantOfSetting.AuthenticateCheckNumberDuplication:
            s.optionslist = CORE.AuthenticateCheckNumberDuplicationArray; // 1, 0
            break;
          case vm.constantOfSetting.ShowDigikeyAccessTokenPopupOnLogin:
            s.optionslist = CORE.ShowDigikeyAccessTokenPopupOnLoginArray; // 1, 0
            break;
          case vm.constantOfSetting.UMIDInternalDateCodeFormat:
            s.dropDownListData = vm.dateCodeFormatList;
            break;
          case vm.constantOfSetting.KitReleaseWithOtherKitStock:
           s.optionslist = CORE.KitReleaseWithOtherKitStockStatus;
            break;
        }
      });
    }

    //open digikey apis settings popup
    vm.updateDigikeySettings = (ev) => {
      DialogFactory.dialogService(
        USER.EXTERNAL_API_POPUP_CONTROLLER,
        USER.EXTERNAL_API_POPUP_VIEW,
        ev,
        null).then(() => { // Success Section
        }, (() => { // Cancel Section
        }), (err) => BaseService.getErrorLog(err));
    };

    //open configure restrict file types popup
    vm.manageExtension = (ev) => {
      DialogFactory.dialogService(
        USER.CONFIGURE_RESTRICT_FILE_TYPE_POPUP_CONTROLLER,
        USER.CONFIGURE_RESTRICT_FILE_TYPE_POPUP_VIEW,
        ev,
        null).then(() => { // Success Section
        }, (() => { // Success Section
        }), (err) => BaseService.getErrorLog(err));
    };

    /* To display description */
    vm.showDescriptionColumn = (dataOfKey, ev) => {
      const headerData = [{
        label: vm.labelConstantOfSetting.DATAKEY,
        value: dataOfKey.datakey,
        displayOrder: 1
      },
      {
        label: vm.labelConstantOfSetting.DATAKEY_CLUSTERNAME,
        value: dataOfKey.clusterName,
        displayOrder: 2
      }];
      const popupData = {
        title: vm.dataKeyDescription,
        name: dataOfKey.displayName,
        description: dataOfKey.description,
        datakey: dataOfKey.datakey
      };
      popupData.headerData = headerData;
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        popupData).then(() => { // Success Section
        }, (err) => BaseService.getErrorLog(err));
    };
    /* To update or save datakey value */
    vm.saveDataKey = (datakeyupdate) => {
      if (!vm.dataKeyForm[datakeyupdate.id].$dirty) {
        NotificationFactory.information(TRANSACTION.SAVE_ON_NOCHANGES);
        return;
      }
      if (datakeyupdate) {
        if (datakeyupdate.datavalues) {
          const settingsInfo = {
            values: datakeyupdate.datavalues
          };
          vm.cgBusyLoading = SettingsFactory.settings().update({
            id: datakeyupdate.id
          }, settingsInfo).$promise.then(() => {
            vm.dataKeyForm[datakeyupdate.id].$setPristine();
            vm.dataKeyForm[datakeyupdate.id].$setUntouched();
            datakeyupdate.datachange = false;
            if(!BaseService.checkFormDirty(vm.dataKeyForm)){
              vm.dataKeyForm.$setPristine();
            }
          }).catch((error) => {
            BaseService.getErrorLog(error);
          });
        }
      }
    };

    /* To view more details about datakey */
    vm.openToShowMoreDetail = (items, ev) => {
      if (items) {
        DialogFactory.dialogService(
          CORE.DATAKEY_POPUP_CONTROLLER,
          CORE.DATAKEY_POPUP_VIEW,
          ev,
          items).then(() => { // Success Section
          }, (error) => {
            BaseService.getErrorLog(error);
          });
      }
    };

    /* To convert json array data in to csv of datakeys and then download csv file */
    vm.exportcsv = () => {
      // const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
      const keysToKeep = Object.keys(vm.sourceData[0]).filter(
        (key) => key !== 'index' && key !== '$$hashKey');
      const header = keysToKeep;
      const csv = vm.sourceData.map((row) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName]).replace(/,/g, ''))
          .join(',')
      );
      csv.unshift(header.join(','));
      const csvArray = csv.join('\r\n');
      const a = document.createElement('a');
      const blob = new Blob([csvArray], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = 'DataKeys.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    };
  }
})();
