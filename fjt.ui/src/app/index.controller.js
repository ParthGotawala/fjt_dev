(function () {
  'use strict';

  angular
    .module('fuse')
    .controller('IndexController', IndexController);

  /** @ngInject */
  function IndexController(fuseTheming, $timeout, msApi, CORE, WORKORDER, USER
    , OPERATION, REPORTS, TASK, TRANSACTION, TRAVELER, RFQTRANSACTION, MasterFactory, BaseService,
    dynamicMessageService, WIDGET, CONFIGURATION, $rootScope)//
  {
    var vm = this;
    // Data
    vm.themes = fuseTheming.themes;
    //vm.isMessageLoaded = false;
    ////let loginUser = BaseService.loginUser;
    //console.log('1');
    //dynamicMessageService.getAllModuleDynamicMessages().then(function (response) {
    //    vm.isMessageLoaded = true;
    //    console.log('3');
    //    if (response.data && response.data.dynamicMessageList) {
    //        CORE.MESSAGE_CONSTANT = _.assign(CORE.MESSAGE_CONSTANT, response.data.dynamicMessageList.CORE);
    //        WORKORDER = _.assign(WORKORDER, response.data.dynamicMessageList.WORKORDER);
    //        USER = _.assign(USER, response.data.dynamicMessageList.USER);
    //        OPERATION = _.assign(OPERATION, response.data.dynamicMessageList.OPERATION);
    //        REPORTS = _.assign(REPORTS, response.data.dynamicMessageList.REPORTS);
    //        TASK = _.assign(TASK, response.data.dynamicMessageList.TASK);
    //        TRANSACTION = _.assign(TRANSACTION, response.data.dynamicMessageList.TRANSACTION);
    //        TRAVELER = _.assign(TRAVELER, response.data.dynamicMessageList.TRAVELER);
    //        RFQTRANSACTION = _.assign(RFQTRANSACTION, response.data.dynamicMessageList.RFQTRANSACTION);
    //        WIDGET = _.assign(WIDGET, response.data.dynamicMessageList.WIDGET);
    //        CONFIGURATION = _.assign(CONFIGURATION, response.data.dynamicMessageList.CONFIGURATION);
    //    }
    //});
    if (_allDynamicMessages) {
      CORE.MESSAGE_CONSTANT = _.assign(CORE.MESSAGE_CONSTANT, _allDynamicMessages.CORE);
      WORKORDER = _.assign(WORKORDER, _allDynamicMessages.WORKORDER);
      USER = _.assign(USER, _allDynamicMessages.USER);
      OPERATION = _.assign(OPERATION, _allDynamicMessages.OPERATION);
      REPORTS = _.assign(REPORTS, _allDynamicMessages.REPORTS);
      TASK = _.assign(TASK, _allDynamicMessages.TASK);
      TRANSACTION = _.assign(TRANSACTION, _allDynamicMessages.TRANSACTION);
      TRAVELER = _.assign(TRAVELER, _allDynamicMessages.TRAVELER);
      RFQTRANSACTION = _.assign(RFQTRANSACTION, _allDynamicMessages.RFQTRANSACTION);
      WIDGET = _.assign(WIDGET, _allDynamicMessages.WIDGET);
      CONFIGURATION = _.assign(CONFIGURATION, _allDynamicMessages.CONFIGURATION);
      CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE = _.assign(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE, _allDynamicMessages.DYNAMIC_MESSAGE);
      _allDynamicMessages = [];
    }
    if (_globalSettingKeyValueList && _globalSettingKeyValueList.length > 0) {
      const allSettingKeys = CONFIGURATION.SETTING;
      _.each(_globalSettingKeyValueList, (item) => {
        switch (item.key) {
          case allSettingKeys.DatePickerDateFormat:
            const dateObj = JSON.parse(item.values);
            _configUIMask.date.mask = dateObj.mask;
            _configUIMask.date.placeholder = dateObj.placeholder;
            //_configUIMask.date.format = dateObj.format;
            _dateDisplayFormat = dateObj.format;
            break;
          case allSettingKeys.TimePickerTimeFormat:
            const timeObj = JSON.parse(item.values);
            _configUIMask.time.mask = timeObj.mask;
            _configUIMask.time.placeholder = timeObj.placeholder;
            //_configUIMask.time.format = timeObj.format;
            _timeWithoutSecondDisplayFormat = timeObj.format;
            break;
          case allSettingKeys.DateTimePickerDateTimeFormat:
            const dateTimeObj = JSON.parse(item.values);
            _configUIMask.datetime.mask = dateTimeObj.mask;
            _configUIMask.datetime.placeholder = dateTimeObj.placeholder;
            //_configUIMask.datetime.format = dateTimeObj.format;
            _dateTimeDisplayFormat = dateTimeObj.format;
            break;
          case allSettingKeys.CommonNumberFormat:
            const commonNumberFormatData = JSON.parse(item.values);
            if (commonNumberFormatData) {
              _.each(commonNumberFormatData, (value, key) => {
                switch (key) {
                  case allSettingKeys.CommonNumberFormat_Label.Amount:
                    _.each(value, (amountValue, amountKey) => {
                      switch (amountKey) {
                        case allSettingKeys.CommonNumberFormat_Label.Decimal:
                          _amountFilterDecimal = parseInt(amountValue);
                          break;
                        case allSettingKeys.CommonNumberFormat_Label.Step:
                          _amountInputStep = parseFloat(amountValue);
                          break;
                        default:
                          break;
                      }
                    });
                    break;
                  case allSettingKeys.CommonNumberFormat_Label.Unit:
                    _.each(value, (unitValue, unitKey) => {
                      switch (unitKey) {
                        case allSettingKeys.CommonNumberFormat_Label.Decimal:
                          _unitFilterDecimal = parseInt(unitValue);
                          break;
                        case allSettingKeys.CommonNumberFormat_Label.Step:
                          _unitInputStep = parseFloat(unitValue);
                          break;
                        default:
                          break;
                      }
                    });
                    break;
                  case allSettingKeys.CommonNumberFormat_Label.UnitPrice:
                    _.each(value, (unitPriceValue, unitPriceKey) => {
                      switch (unitPriceKey) {
                        case allSettingKeys.CommonNumberFormat_Label.Decimal:
                          _unitPriceFilterDecimal = parseInt(unitPriceValue);
                          break;
                        case allSettingKeys.CommonNumberFormat_Label.Step:
                          _unitPriceInputStep = parseFloat(unitPriceValue);
                          break;
                        default:
                          break;
                      }
                    });
                    break;
                  case allSettingKeys.CommonNumberFormat_Label.SixDigitUnit:
                    _.each(value, (unitValue, unitKey) => {
                      switch (unitKey) {
                        case allSettingKeys.CommonNumberFormat_Label.Decimal:
                          _sixDigitUnitFilterDecimal = parseInt(unitValue);
                          break;
                        case allSettingKeys.CommonNumberFormat_Label.Step:
                          _sixDigitUnitInputStep = parseFloat(unitValue);
                          break;
                        default:
                          break;
                      }
                    });
                    break;
                  default:
                    break;
                }
              });
            }
            break;
          case allSettingKeys.FeederStatusAccess:
            _FeederAccessRole = item.values;
            break;
          case allSettingKeys.ForceToBuyPriceDifferenceXTimeLess:
            _ForceToBuyPriceDifferenceXTimeLess = item.values ? item.values : CONFIGURATION.DefaultPurchasePriceTimes;
            break;
          case allSettingKeys.AccountingYear:
            const accountingYearData = JSON.parse(item.values);
            if (accountingYearData) {
              _.each(accountingYearData, (value, key) => {
                switch (key) {
                  case allSettingKeys.AccountingYear_Label.Type:
                    _.each(value, (yearTypeValue, yearTypeKey) => {
                      switch (yearTypeKey) {
                        case allSettingKeys.AccountingYear_Label.Value:
                          _accountingYear = yearTypeValue;
                          break;
                        default:
                          break;
                      }
                    });
                    break;
                  case allSettingKeys.AccountingYear_Label.StartingMonth:
                    _.each(value, (startingMonthValue, startingMonthKey) => {
                      switch (startingMonthKey) {
                        case allSettingKeys.AccountingYear_Label.Value:
                          _accountingYearStartingMonth = parseInt(startingMonthValue);
                          break;
                        default:
                          break;
                      }
                    });
                    break;
                  default:
                    break;
                }
              });
            }
            break;
          case allSettingKeys.Timezone:
            _timeZoneOffset = item.values;
            break;
          case allSettingKeys.DKVersion:
            _DkVersion = item.values;
            break;
          case allSettingKeys.TextAngularKeyCode:
            _textAngularKeyCode = item.values;
            break;
          case allSettingKeys.UploadDocumentSize:
            _configDocumentSize = item.values;
            break;
          case allSettingKeys.GroupConcatSeparator:
            _groupConcatSeparatorValue = item.values;
            break;
          case allSettingKeys.ProductionPNLength:
            _productionPNLength = parseInt(item.values);
            break;
          case allSettingKeys.CustomerReceiptInvoiceAutoSelect:
            _customerReceiptInvoiceAutoSelect = parseInt(item.values);
            break;
          case allSettingKeys.CustomerAllowPaymentDays:
            _customerAllowPaymentDays = parseInt(item.values);
            break;
          case allSettingKeys.DefaultTheme:
            _DefaultTheme = item.values;
            break;
          case allSettingKeys.DemoTheme:
            _DemoTheme = item.values;
            break;
          case allSettingKeys.AuthenticateCheckNumberDuplication:
            _authenticateCheckNumberDuplication = parseInt(item.values);
            break;
          case allSettingKeys.MfgCodeNameFormat:
            _mfgCodeNameFormat = parseInt(item.values);
            break;
          case allSettingKeys.ShowDigikeyAccessTokenPopupOnLogin:
            _configShowDigikeyAccessTokenPopupOnLogin = parseInt(item.values);
            break;
          case allSettingKeys.ContactPersonDisplayNameFormat:
            _contactPersonDisplayNameFormat = parseInt(item.values);
            break;
          case allSettingKeys.PersonnelNameFormat:
            _personnelNameFormat = parseInt(item.values);
            break;
          case allSettingKeys.MaxUMID:
            _maxUMID = parseInt(item.values);
            break;
          case allSettingKeys.UMIDInternalDateCodeFormat:
            _umidInternalDateCodeFormat = parseInt(item.values);
            break;
          case allSettingKeys.KitReleaseWithOtherKitStock:
            _kitReleaseWithOtherKitStock = parseInt(item.values);
            break;
          default:
            break;
        }
      });
      _dateTimeFullTimeDisplayFormat = stringFormat(CORE.DateTimeDisplayFormat, _dateDisplayFormat, _timeDisplayFormat);
      $rootScope.dateDisplayFormat = _dateDisplayFormat;
      $rootScope.uimaskFormat = _configUIMask;
      $rootScope.dateTimeDisplayFormat = _dateTimeDisplayFormat;
      $rootScope.timeWithoutSecondDisplayFormat = _timeWithoutSecondDisplayFormat;
      $rootScope.unitInputStep = _unitInputStep;
      $rootScope.sixDigitUnitInputStep = _sixDigitUnitInputStep;
      $rootScope.amountInputStep = _amountInputStep;
      $rootScope.unitPriceInputStep = _unitPriceInputStep;
      $rootScope.textAngularKeyCode = _textAngularKeyCode;
      $rootScope.isDemoApplication = _DemoTheme == '1' ? true : false;
      fuseTheming.setActiveTheme(_DefaultTheme);
      _globalSettingKeyValueList = [];
    }
    // console.log('2 - index controller fully loaded');
  }
})();
