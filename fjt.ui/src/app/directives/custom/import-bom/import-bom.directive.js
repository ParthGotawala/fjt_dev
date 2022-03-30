(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('importBom', importBom);

  /** @ngInject */
  function importBom() {
    var directive = {
      restrict: 'E',
      scope: {
        id: '=',
        partId: '=',
        isFromComponent: '='
      },
      templateUrl: 'app/directives/custom/import-bom/import-bom.html',
      controller: importBomCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function importBomCtrl($scope, $rootScope, $state, $location, $timeout, $q, $filter, CORE, USER, hotRegisterer, MasterFactory, ManufacturerFactory, RFQTRANSACTION, BOMFactory, ImportBOMFactory, DialogFactory, BaseService, $mdDialog, ComponentFactory, CustomerConfirmationPopupFactory, NotificationFactory, socketConnectionService, PRICING, APIVerificationErrorPopupFactory, CONFIGURATION, TRANSACTION) {
      var vm = this;
      var _rfqAssyID = $scope.id;
      var _partID = parseInt($scope.partId);
      var PartCorrectList = CORE.PartCorrectList;
      var maxREFDESAllow = CORE.MaxREFDESAllow;
      var getPartProgramMappingDetail = [];
      let isMergeCell = false;
      vm.socketmsgwasOpened = false;
      vm.partUpdatefromThisTab = false;
      vm.DisableDeleteBOM = false;
      vm.configTimeout = _configTimeout;
      vm.disableSearchbox = false;
      vm.QPAREFDESValidationStepsFlag = RFQTRANSACTION.QPA_VALIDATION_STEP;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.operationalImagePath = CORE.WEB_URL + USER.DYNAMIC_ATTRIBUTE_BASE_PATH;
      vm.InternalName = CORE.FCA.Name;
      vm.liveInternalVersion = CORE.MESSAGE_CONSTANT.INITAL_UPLOAD_STATUS;
      vm.VerifyPNExternalTooltip = RFQTRANSACTION.VERIFY_PN_EXTERNALLY_TOOLTIP;
      vm.RefDesTooltip = RFQTRANSACTION.REF_DES_TOOLTIP;
      vm.rfqStatus = RFQTRANSACTION.RFQ_ASSY_STATUS;
      vm.rfqFinalStatus = RFQTRANSACTION.RFQ_ASSY_QUOTE_STATUS;
      vm.VerifiedConfirm = false;
      vm.passwordApproval = false;
      $scope.loaderVisible = undefined;
      vm.mfgPN = null;
      vm.isFromComponent = $scope.isFromComponent;
      vm.LabelConstant = CORE.LabelConstant.MFG;
      vm.LabelConstantBOM = CORE.LabelConstant.BOM;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.FullDateTimeFormat = _dateTimeFullTimeDisplayFormat;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.CORE_RFQ_MOUNTINGTYPE = CORE.RFQ_MOUNTINGTYPE;
      //vm.BOMExportName = CORE.BOMExportName;
      //vm.BOMExportWithStockName = CORE.BOMExportWithStockName;
      vm.CORE_ConnectorType = CORE.ConnectorType;
      vm.LogicCategoryDropdown = CORE.LogicCategoryDropdown;
      vm.PartSuggestType = CORE.PartSuggestType;
      vm.BOM_SUB_MENU_OPTION = CORE.BOM_SUB_MENU_OPTION;
      vm.LogicCategoryDropdownDet = _.mapValues(_.keyBy(vm.LogicCategoryDropdown, 'id'), 'value');
      vm.LogicCategoryDropdownID = _.mapValues(_.keyBy(vm.LogicCategoryDropdown, 'id'), 'id');
      vm.DecimalNmberPattern = CORE.DecimalNmberPattern;
      vm.TBDMFGAndMFGPNList = CORE.TBDMFGAndMFGPN;
      vm.NotComponentPart = CORE.NOT_A_COMPONENT;
      vm.RoHSMainCategory = CORE.RoHSMainCategory;
      vm.RoHSDeviationDet = CORE.RoHSDeviationDet;
      vm.isBOMVerifyStart = false;
      vm.enabledSuggestAlternatePartOnBOM = false;
      vm.enabledSuggestRoHSReplacementPartOnBOM = false;
      vm.enabledIncorrectPartOnBOM = false;
      vm.cutomerID = null;
      vm.AssyRoHSStatusID = null;
      vm.AssyRoHSMainCategory = null;
      vm.AssyRoHSDeviation = null;
      vm.AssyLock = false;
      vm.AssyActivityStartedByUserName = null;
      vm.isFromQPA = false;
      vm.AssyActivityStart = true;
      vm.isStartAndStopRequestFromThisTab = false;
      vm.AssyActivityStartedBy = 1;
      vm.assemblyLevelRequiredErrorCount = 0;
      vm.enabledDeleteBOM = BaseService.checkFeatureRights(CORE.FEATURE_NAME.DeleteBOM);
      const partInvalidMatchList = [false, 0];
      vm.transactionType = TRANSACTION.StartStopActivityTransactionType;
      vm.actionType = TRANSACTION.StartStopActivityActionType;
      //vm.fromRefereshButton = false;
      // Check if user is Admin or Executive
      vm.loginUser = BaseService.loginUser;
      vm.loginUserId = vm.loginUser.userid;
      // get handsontable object
      let _hotRegisterer = null;

      // Dropdown list
      let _unitList = [];
      const _programingStatusList = CORE.ProgramingStatusDropdown;
      const _buyDNPQTYList = CORE.BuyDNPQTYDropdown;
      const _substitutesAllowList = CORE.SubstitutesAllowDropdown;
      // Part type list with mounting type
      // const _partCategoryList = [];
      let _typeList = [];
      let _partTypeList = [];
      let _mountingTypeList = [];
      let _errorCodeList = [];

      const _successColor = RFQTRANSACTION.SUCCESS_COLOR;
      const _errorColor = RFQTRANSACTION.ERROR_COLOR;
      const _errorTextColor = RFQTRANSACTION.ERROR_TEXT_COLOR;
      const _nonRoHSColor = RFQTRANSACTION.NON_ROHS_COLOR;
      let _obsoleteColor = RFQTRANSACTION.SUCCESS_COLOR;

      // Add default error codes so if not added into database then we can have default error color
      let _qpaDesignatorError, _mfgInvalidError, _mfgVerificationError, _distVerificationError, _mfgDistMappingError, _getMFGPNError, _obsoletePartError, _mfgGoodPartMappingError, _mfgPNInvalidError, _distInvalidError, _distPNInvalidError, _distGoodPartMappingError, _lineMergeError, _rohsStatusError, _epoxyError, _duplicateRefDesError, _invalidRefDesError, _invalidConnectorTypeError, _duplicateMPNInSameLineError, _matingPartRequiredError, _driverToolsRequiredError, _pickupPadRequiredError, _restrictUseWithPermissionError, _restrictUsePermanentlyError, _mismatchMountingTypeError, _mismatchRequiredProgrammingError, _mismatchProgrammingStatusError, _mappingPartProgramError, _mismatchFunctionalCategoryError, _mismatchCustomPartError, _mismatchPitchError, _mismatchToleranceError, _mismatchVoltageError, _mismatchPackageError, _mismatchValueError, _functionalTestingRequiredError, _requireMountingTypeError, _requireFunctionalTypeError, _uomMismatchedError, _programingRequiredError, _mismatchColorError, _restrictUseInBOMError, _customerApprovalForQPAREFDESError, _customerApprovalForBuyError, _customerApprovalForPopulateError, _mismatchNumberOfRowsError, _partPinIsLessthenBOMPinError, _tbdPartError, _restrictCPNUseInBOMError, _restrictCPNUseWithPermissionError, _restrictCPNUsePermanentlyError, _exportControlledError, _restrictUseInBOMWithPermissionError, _unknownPartError, _defaultInvalidMFRError, _restrictUseInBOMExcludingAliasError, _restrictUseInBOMExcludingAliasWithPermissionError, _restrictUseExcludingAliasError, _restrictUseExcludingAliasWithPermissionError, _dnpQPARefDesError, _customerApprovalForDNPQPAREFDESError, _customerApprovalForDNPBuyError, _dnpInvalidREFDESError, _suggestedGoodPartError, _suggestedGoodDistPartError, _suggestMFRMappingError, _suggestAlternatePartError, _suggestPackagingPartError, _suggestProcessMaterialPartError, _suggestRoHSReplacementPartError, _dnpQPAREFDESChangeError, _QPAREFDESChangeError, _MPNNotAddedinCPNError, _mismatchCustpartRevError, _mismatchCPNandCustpartRevError;
      _qpaDesignatorError = _mfgInvalidError = _mfgVerificationError = _distVerificationError = _mfgDistMappingError = _getMFGPNError = _obsoletePartError = _mfgGoodPartMappingError = _mfgPNInvalidError = _distInvalidError = _distPNInvalidError = _distGoodPartMappingError = _lineMergeError = _rohsStatusError = _epoxyError = _duplicateRefDesError = _invalidRefDesError = _invalidConnectorTypeError = _duplicateMPNInSameLineError = _matingPartRequiredError = _driverToolsRequiredError = _pickupPadRequiredError = _restrictUseWithPermissionError = _restrictUsePermanentlyError = _mismatchMountingTypeError = _mismatchRequiredProgrammingError = _mismatchProgrammingStatusError = _mappingPartProgramError = _mismatchFunctionalCategoryError = _mismatchCustomPartError = _mismatchPitchError = _mismatchToleranceError = _mismatchVoltageError = _mismatchPackageError = _mismatchValueError = _functionalTestingRequiredError = _requireMountingTypeError = _requireFunctionalTypeError = _uomMismatchedError = _programingRequiredError = _mismatchColorError = _restrictUseInBOMError = _customerApprovalForQPAREFDESError = _customerApprovalForBuyError = _customerApprovalForPopulateError = _mismatchNumberOfRowsError = _partPinIsLessthenBOMPinError = _tbdPartError = _restrictCPNUseInBOMError = _restrictCPNUseWithPermissionError = _restrictCPNUsePermanentlyError = _exportControlledError = _restrictUseInBOMWithPermissionError = _unknownPartError = _defaultInvalidMFRError = _restrictUseInBOMExcludingAliasError = _restrictUseInBOMExcludingAliasWithPermissionError = _restrictUseExcludingAliasError = _restrictUseExcludingAliasWithPermissionError = _dnpQPARefDesError = _customerApprovalForDNPQPAREFDESError = _customerApprovalForDNPBuyError = _dnpInvalidREFDESError = _suggestedGoodPartError = _suggestedGoodDistPartError = _suggestMFRMappingError = _suggestAlternatePartError = _suggestPackagingPartError = _suggestProcessMaterialPartError = _suggestRoHSReplacementPartError = _dnpQPAREFDESChangeError = _QPAREFDESChangeError = _MPNNotAddedinCPNError = _mismatchCustpartRevError = _mismatchCPNandCustpartRevError = { errorColor: _errorColor };
      let _customerApprovalError = { errorColor: _errorColor, displayOrder: 1 };

      //// List of all validation steps
      const _logicCategoryDropdown = CORE.LogicCategoryDropdown;

      // MFG context menu items
      // let _menuItemsAddMFG = [];
      // DIST context menu items
      let _menuItemsAddDIST = [];
      // Search context menu items
      // let _menuItemsSearch = [];
      // Collection to store invalid cells
      // Contains Array of [row, col]
      let _invalidCells = [];
      // Multiple fields for same line item
      const _multiFields = RFQTRANSACTION.MULTI_FIELDS;
      // Collection of fields which are type of dropdown
      const _dropdownTypes = [];
      // Collection of fields which are type of check-box
      const _checkBoxTypes = [];
      // Collection of fields which are type of HTML
      let _htmlTypes = [];

      // Header columns for handsontable
      let _lineItemsHeaders = null;

      // store set time out of header style to speedup the rendering
      let _setHeaderStyleTimeout = null;
      vm.isSubAssembly = false;
      let _isAssyRoHS = false;
      let _componentRequireFunctionalType = [];
      let _componentRequireMountingType = [];

      vm.wrenchIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.WRENCH_ICON);
      vm.tmaxIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.TMAX_ICON);
      vm.tmaxYellowIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.TMAX_YELLOW_ICON);
      vm.custPartIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.CUST_PART_ICON);
      vm.waringCommentIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.WARNING_COMMENT_ICON);
      vm.nrndIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.OBSOLETE_NRND_ICON);
      vm.exportIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.EXPORT_CONTROLLED_ICON);
      vm.mismatchMountingTypeIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.MISMATCH_MOUNTING_TYPE_ICON);
      vm.mismatchFunctionalTypeIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.MISMATCH_FUNCTIONAL_TYPE_ICON);
      vm.CPNmappingPending = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.MPN_MAPPING_PENDING_IN_CPN_ICON);
      vm.approveMountingTypeIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.APPROVE_MOUNTING_TYPE_ICON);
      vm.badPartIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.BAD_PART_ICON);
      vm.badSupplierPartIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.BAD_SUPPLIER_PART_ICON);
      vm.pickuppadRequireIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.PICKUP_PAD_REQUIRE_ICON);
      vm.programmingRequireIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.PROGRAMMING_REQUIRED_ICON);
      vm.programmingMappingFullIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.PROGRAMMING_MAPPING_FULL_ICON);
      vm.programmingMappingPartialIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.PROGRAMMING_MAPPING_PARTIAL_ICON);
      vm.programmingMappingPengingIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.PROGRAMMING_MAPPING_PENDING_ICON);

      // HTML to display icons into column
      let _refDesTooltip;
      const _rohsImageElem = ' <img class="rohs-bom-image" src="rohsImagePath" title="rohsTitle">';
      const _wrenchIconElem = ' <img class="rohs-bom-image" src="' + vm.wrenchIcon + '" title="wrenchTitle">';
      //var _wrenchIconElem = ' <md-icon md-font-icon="icons-drive-tools" role="img" class="cm-custom-icon-font icons-drive-tools color-black" title="wrenchTitle"></md-icon>';
      //const _programingIconElem = ' <md-icon md-font-icon="icons-required-program" role="img" class="cm-custom-icon-font icons-required-program color-black" title="programingTitle"></md-icon>';
      const _programingIconElem = '  <img class="pt-5" src="' + vm.programmingRequireIcon + '" title="programingTitle">';
      const _programmingMappingFullIcon = '  <img class="pt-5" src="' + vm.programmingMappingFullIcon + '" title="programingTitle">';
      const _programmingMappingPartialIcon = '  <img class="pt-5" src="' + vm.programmingMappingPartialIcon + '" title="programingTitle">';
      const _programmingMappingPengingIcon = '  <img class="pt-5" src="' + vm.programmingMappingPengingIcon + '" title="programingTitle">';
      const _matingPartIconElem = ' <md-icon md-font-icon="icons-require-mating-part" role="img" class="cm-custom-icon-font icons-require-mating-part color-black" title="matingPartTitle"></md-icon>';
      //const _pickupPadIconElem = ' <md-icon md-font-icon="icons-required-pickup-pad" role="img" class="cm-custom-icon-font icons-required-pickup-pad color-black" title="pickupPadTitle"></md-icon>';
      const _pickupPadIconElem = '  <img class="pt-5" src="' + vm.pickuppadRequireIcon + '" title="pickupPadTitle">';
      const _partStatusIconElem = ' <img class="pt-5" src="' + vm.nrndIcon + '" title="partStatusTitle">';
      const _tmaxIconElem = ' <img class="pt-5" src="' + vm.tmaxIcon + '" title="tmaxTitle">';
      const _tmaxYellowIconElem = ' <img class="pt-5" src="' + vm.tmaxYellowIcon + '" title="Tmax is not defined.">';
      const _customPartIcon = ' <img class="pt-5" src="' + vm.custPartIcon + '" title="Custom Part">';
      const _lockIconElem = '<md-icon class="font-size-20 material-icons icon icon-lock color-black" role="img" aria-hidden="true" title="Locked & Engineering Approved"></md-icon>';
      const _unlockIconElem = '<md-icon class="font-size-20 icon icon-lock-unlocked material-icons color-black" role="img" aria-hidden="true" title="Unlocked (Can Edit) & Engineering Approved"></md-icon>';
      const _exportControlledIconElem = ' <img class="pt-5" src="' + vm.exportIcon + '" title="Export Controlled">';
      const _mismatchMountingTypeIconElem = ' <img class="pt-5" src="' + vm.mismatchMountingTypeIcon + '" title="mismatchMountingTypeTitle">';
      const _mismatchFunctionalTypeIconElem = ' <img class="pt-5" src="' + vm.mismatchFunctionalTypeIcon + '" title="mismatchFunctionalTypeTitle">';
      const _approveMountingTypeIconElem = ' <img class="pt-5" src="' + vm.approveMountingTypeIcon + '" title="approveMountingTypeTitle">';
      const _cpnMappingPending = ' <img class="pt-5" src="' + vm.CPNmappingPending + '" title="MPNMappingPendinginCPN">';
      const _badPartIconElem = ' <img class="pt-5" src="' + vm.badPartIcon + '" title="badPartTitle">';
      const _badSupplierPartIconElem = ' <img class="pt-5" src="' + vm.badSupplierPartIcon + '" title="badSupplierPartTitle">';

      let _sourceHeaderVisible = [];
      let _colItemIndex, _colCustItemIndex, _colQPAIndex, _colRefDesigIndex, _colMfgCodeIndex, _colMfgPNIndex, _colDistributorIndex, _colDistPNIndex, _colUOMIDIndex, _colDNPQty, _colDNPDesig, _colCPNIndex, _colBuyIndex, _colPopulateIndex, _colDNPBuyIndex, _colMountingTypeIDIndex, _colFunctionalTypeIDIndex, _colPartPackageIndex, _colPackagingIndex;//, _colPartUOMIndex;
      let _dummyEvent = null;

      // On click of cancel API verification button set this flag to true
      // and if flag is true then do not display API verification pop-up
      let isStopAPIVerification = false;

      const lineItemFields = ['custPNID', 'qpaDesignatorStep', '_lineID', 'qpaErrorColor', 'customerApprovalForDNPQPAREFDESError',
        'customerApprovalForDNPQPAREFDESStep', 'customerApprovalForDNPBuyError', 'customerApprovalForDNPBuyStep', 'dnpInvalidREFDESError', 'dnpQPARefDesStep',
        'dnpQPARefDesError', 'qpaDesignatorStepError', 'mergeLines', 'lineMergeStep', 'requireMountingTypeStep', 'requireMountingTypeError',
        'requireFunctionalTypeStep', 'requireFunctionalTypeError', 'customerApprovalForQPAREFDESStep', 'customerApprovalForBuyStep', 'customerApprovalForPopulateStep', 'restrictCPNUseWithPermissionStep', 'restrictCPNUsePermanentlyStep', 'restrictCPNUseInBOMStep'];

      const alternateLineItemFields = ['mfgCodeID', 'mfgPNID', 'distMfgCodeID', 'mfgCode',
        'distMfgPNID', 'description', 'descriptionAlternate', 'mfgVerificationStep', 'mfgDistMappingStep', 'mfgCodeStep', 'customerApproval', 'programingRequiredStep',
        'distVerificationStep', 'distCodeStep', 'getMFGPNStep', 'obsoletePartStep', 'mfgGoodPartMappingStep', 'mfgPNStep', 'distPNStep', 'badMfgPN',
        'distGoodPartMappingStep', 'nonRohsStep', 'epoxyStep', 'rohsComplient', 'RoHSStatusID', 'mfgErrorColor', 'mfgPNErrorColor', 'distErrorColor',
        'approvedMountingType', 'mismatchMountingTypeStep', 'mismatchRequiredProgrammingStep', 'mappingPartProgramStep', 'mismatchCustomPartStep',
        'mismatchCustomPartError', 'distPNErrorColor', 'epoxyStepError', 'mfgCodeStepError', 'mfgPNStepError', 'mfgVerificationStepError',
        'mfgGoodPartMappingStepError', 'nonRohsStepError', 'connectorTypeID', 'unknownPartStep', 'unknownPartError', 'defaultInvalidMFRStep',
        'defaultInvalidMFRError', 'isMPNAddedinCPN', 'MPNNotAddedinCPNError', 'invalidConnectorTypeStep', 'duplicateMPNInSameLineStep',
        'mismatchFunctionalCategoryStep', 'restrictUseWithPermissionStep', 'restrictUsePermanentlyStep', 'pickupPadRequiredStep', 'matingPartRquiredStep',
        'driverToolsRequiredStep', 'functionalTestingRequiredStep', 'mismatchValueStep', 'mismatchPackageStep', 'mismatchToleranceStep', 'mismatchTempratureStep',
        'mismatchPowerStep', 'uomMismatchedStep', 'mismatchColorStep', 'isCustomerUnAppoval',
        'customerUnAppovalDate', 'restrictUseInBOMStep', 'mismatchNumberOfRowsStep', 'partPinIsLessthenBOMPinStep', 'tbdPartStep', 'exportControlledStep',
        'restrictUseInBOMWithPermissionStep', 'isUnlockApprovedPart', 'restrictUseInBOMExcludingAliasStep',
        'restrictUseInBOMExcludingAliasWithPermissionStep', 'restrictUseExcludingAliasStep', 'restrictUseExcludingAliasWithPermissionStep',
        'suggestedGoodPartStep', 'suggestedGoodDistPartStep', 'suggestedByApplicationMsg', 'suggestedByApplicationStep', 'mismatchProgrammingStatusStep',
        'mismatchCustpartRevStep', 'mismatchCPNandCustpartRevStep'];

      // bind model data
      vm.bomModel = [];
      //vm.refBomModel = vm.bomModel = [];
      vm.refBomModel = vm.bomModel; //Manage one more bom model for all line maintain in case of filter
      // Insert Delete Row Id
      let bomDelete = []; //Manage delete alternate part line of BOM Array
      let rowDeleted = []; //Manage delete line of BOM Array
      let isFilterApply = false;
      let searchtext = null;
      vm.sourceHeader = null;
      // Store dynamic menu items
      vm.dynamicContextMenu = {};

      vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.BOM;
      vm.isNoDataFound = true;
      // Filter Flag for when filter is enable used for empty state hide.
      vm.isFilterEnable = false;

      vm.pricingStatus = CORE.PRICING_STATUS;
      vm.APIVerifiedFlag = null;
      vm.isBOMVerified = true;
      vm.isNewRowAdd = false;
      vm.isFromInternalPartVerification = false;
      vm.apiVerifiedAlternatePartsCount = 0;
      vm.RadioGroup = {
        searchOption: {
          array: CORE.SearchRadioGroup
        }
      };
      vm.searchOptionValue = false;
      // if flag is true then auto draft save on each validation button click
      vm.isAutoDraftSave = false;

      // bom filter implementation
      const _bomFilters = RFQTRANSACTION.BOM_FILTERS;
      vm.allFilterID = _bomFilters.ALL.CODE;
      vm.selectedFilter = vm.allFilterID;
      vm.selectedFilterNameWithCount = vm.allFilterID;
      vm.SearchResult = 0;
      vm.qpaCounts = 0;
      vm.dnpQtyCounts = 0;
      vm.filters = [];
      _.each(_bomFilters, (value) => {
        vm.filters.push(value);
      });
      //for (var prop in _bomFilters) {
      //    vm.filters.push(_bomFilters[prop]);
      //};

      let isBOMInserted = false;
      vm.erOptions = {
        workstart: function () {
          if (!vm.isNoDataFound) {
            isBOMInserted = true;
          }

          vm.isNoDataFound = true;
          $scope.$apply();
        },
        workend: function () {
        },
        sheet: function (json, sheetnames, select_sheet_cb, files) {
          var type = files.name.split('.');
          if (_.find(CORE.UPLOAD_DOCUMENT_TYPE, (docType) => docType === type[type.length - 1])) {
            columnMappingStepFn(json);
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_TYPE_NOT_ALLOWED);
            messageContent.message = stringFormat(messageContent.message, (CORE.UPLOAD_DOCUMENT_TYPE).join());
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
          }
        },
        badfile: function () {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_UPLOAD_FAIL_TEXT);
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
        },
        failed: function () {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_TYPE_NOT_ALLOWED);
          messageContent.message = stringFormat(messageContent.message, (CORE.UPLOAD_DOCUMENT_TYPE).join());
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        },
        multiplefile: function () {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SINGLE_FILE_UPLOAD);
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
        },
        large: function () {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_UPLOAD_FAIL_SIZE_TEXT);
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
        }
      };

      // Added custom cell renderer
      // It will be call after all cell change and render events
      // Add cells color based on error code here
      Handsontable.renderers.registerRenderer('cellRenderer', function (instance, td, row, col, prop, value, cellProperties) {
        if (_dropdownTypes.indexOf(prop) !== -1) {
          Handsontable.renderers.AutocompleteRenderer.apply(this, arguments);
        }
        else if (_checkBoxTypes.indexOf(prop) !== -1) {
          Handsontable.renderers.CheckboxRenderer.apply(this, arguments);
        }
        else if (_htmlTypes.indexOf(prop) !== -1) {
          // If RoHS column then display icon based on flag
          if (prop === 'rohsComplient') {
            Handsontable.renderers.HtmlRenderer.apply(this, arguments);
            const bomObj = vm.bomModel[row];
            let isInValid = true;
            if (bomObj) {
              isInValid = isBOMObjInValid(partInvalidMatchList, bomObj);
              if (!isInValid && (!bomObj.restrictCPNUsePermanentlyStep || !bomObj.restrictCPNUseWithPermissionStep || bomObj.restrictCPNUseInBOMStep)) {
                isInValid = true;
              }
            }

            if (bomObj && bomObj.RoHSStatusID !== null) {
              const rohsDet = _.find(vm.RohsList, { id: bomObj.RoHSStatusID });
              let icon = '';
              if (rohsDet && !rohsDet.rohsIcon) {
                rohsDet.rohsIcon = CORE.DEFAULT_IMAGE;
              }
              if (rohsDet && rohsDet.rohsIcon) {
                icon += _rohsImageElem.replace('rohsImagePath', (vm.rohsImagePath + rohsDet.rohsIcon)).replace('rohsTitle', rohsDet.name);
              }
              if (bomObj.mfgPNID !== CORE.TBDMFRPNID && bomObj.mfgPNID !== CORE.NOTAVAILABLEMFRPNID && !isInValid && !bomObj.isUnlockApprovedPart) {
                icon += _lockIconElem;
              }
              if (bomObj.mfgPNID !== CORE.TBDMFRPNID && bomObj.mfgPNID !== CORE.NOTAVAILABLEMFRPNID && !isInValid && bomObj.isUnlockApprovedPart) {
                icon += _unlockIconElem;
              }
              if (bomObj.isMFGGoodPart === PartCorrectList.IncorrectPart || bomObj.isDistGoodPart === PartCorrectList.IncorrectPart) {
                let title = '';
                if (bomObj.isMFGGoodPart === PartCorrectList.IncorrectPart) {
                  title = 'Incorrect MPN.';
                  icon += _badPartIconElem.replace('badPartTitle', title);
                }
                if (bomObj.isDistGoodPart === PartCorrectList.IncorrectPart) {
                  title = 'Incorrect SPN.';
                  icon += _badSupplierPartIconElem.replace('badSupplierPartTitle', title);
                }
              }
              if (bomObj.isExportControlled) {
                icon += _exportControlledIconElem;
              }
              if (bomObj.driverToolRequired) {
                let toolTipMessage = CORE.WRENCH_TOOLTIP;
                if (bomObj.driveToolIDs && bomObj.driveToolIDs.length > 0) {
                  const driveToolIds = _.split(bomObj.driveToolIDs, ',');
                  _.each(driveToolIds, (componentID) => {
                    if (componentID) {
                      const drivetool = _.find(vm.refBomModel, { 'mfgPNID': parseInt(componentID) });
                      if (drivetool) {
                        toolTipMessage = stringFormat(CORE.WRENCH_LINE_TOOLTIP, drivetool.lineID ? drivetool.lineID : drivetool._lineID);
                      }
                    }
                  });
                }
                icon += _wrenchIconElem.replace('wrenchTitle', toolTipMessage);
              }
              if (bomObj.matingPartRquired) {
                const toolTipMessage = bomObj.matingPartRquiredStep ? CORE.MATING_LINE_TOOLTIP : CORE.MATING_TOOLTIP;
                icon += _matingPartIconElem.replace('matingPartTitle', toolTipMessage);
              }
              if (bomObj.pickupPadRequired) {
                const toolTipMessage = bomObj.pickupPadRequiredStep ? CORE.PICKUPPAD_LINE_TOOLTIP : CORE.PICKUPPAD_TOOLTIP;
                icon += _pickupPadIconElem.replace('pickupPadTitle', toolTipMessage);
              }
              if (bomObj.isObsolete) {
                const toolTipMessage = bomObj.partStatus;
                icon += _partStatusIconElem.replace('partStatusTitle', toolTipMessage);
              }
              if (!bomObj.mismatchMountingTypeStep && bomObj.mismatchMountingTypeError) {
                const toolTipMessage = bomObj.mismatchMountingTypeError;
                icon += _mismatchMountingTypeIconElem.replace('mismatchMountingTypeTitle', toolTipMessage);
              }
              if (!bomObj.mismatchFunctionalCategoryStep && bomObj.mismatchFunctionalCategoryError) {
                const toolTipMessage = bomObj.mismatchFunctionalCategoryError;
                icon += _mismatchFunctionalTypeIconElem.replace('mismatchFunctionalTypeTitle', toolTipMessage);
              }
              if (bomObj.approvedMountingType) {
                const approveMountingTypeTitle = bomObj.mountingtypeID + ' & ' + bomObj.parttypeID;
                icon += _approveMountingTypeIconElem.replace('approveMountingTypeTitle', approveMountingTypeTitle);
              }
              let lineProgramingStatus = bomObj.programingStatus;
              if (bomObj.programingRequired) {
                if (!bomObj.lineID && bomObj._lineID) {
                  const bomDet = _.find(vm.refBomModel, { lineID: bomObj._lineID });
                  if (bomDet && bomDet.programingStatus) {
                    lineProgramingStatus = bomDet.programingStatus;
                  }
                }
                if (lineProgramingStatus !== _programingStatusList[4].value && lineProgramingStatus !== _programingStatusList[5].value) {
                  const toolTipMessage = CORE.PROGRAMING_REQUIRED_TOOLTIP;
                  icon += _programingIconElem.replace('programingTitle', toolTipMessage);
                }
              }
              if (((bomObj.mountingID === -2 || bomObj.functionalID === -2) || bomObj.programingRequired) && bomObj.mappingPartProgramStep && bomObj.mismatchProgrammingStatusStep && bomObj.mismatchRequiredProgrammingStep) {
                let refdescount = bomObj.refDesigCount;
                if (bomObj.isBuyDNPQty === _buyDNPQTYList[3].value) {
                  refdescount += bomObj.dnpDesigCount;
                }
                if ((bomObj.mountingID === -2 || bomObj.functionalID === -2) && refdescount > bomObj.programmingMappingPendingRefdesCount && bomObj.programmingMappingPendingRefdesCount === 0) {
                  const toolTipMessage = CORE.PROGRAMMING_MAPPING_FULL_TOOLTIP;
                  icon += _programmingMappingFullIcon.replace('programingTitle', toolTipMessage);
                }
                if (bomObj.programingRequired && (lineProgramingStatus === _programingStatusList[4].value || lineProgramingStatus === _programingStatusList[5].value) && refdescount > bomObj.programmingMappingPendingRefdesCount && bomObj.programmingMappingPendingRefdesCount === 0) {
                  const toolTipMessage = CORE.PROGRAMMING_MAPPING_FULL_TOOLTIP;
                  icon += _programmingMappingFullIcon.replace('programingTitle', toolTipMessage);
                }
              }
              if (((bomObj.mountingID === -2 || bomObj.functionalID === -2) || bomObj.programingRequired) && !bomObj.mappingPartProgramStep) {
                let refdescount = bomObj.refDesigCount;
                if (bomObj.isBuyDNPQty === _buyDNPQTYList[3].value) {
                  refdescount += bomObj.dnpDesigCount;
                }
                if (refdescount > bomObj.programmingMappingPendingRefdesCount && bomObj.programmingMappingPendingRefdesCount !== 0) {
                  const toolTipMessage = CORE.PROGRAMMING_MAPPING_PARTIAL_TOOLTIP;
                  icon += _programmingMappingPartialIcon.replace('programingTitle', toolTipMessage);
                } else if (refdescount === bomObj.programmingMappingPendingRefdesCount) {
                  const toolTipMessage = CORE.PROGRAMMING_MAPPING_PENDING_TOOLTIP;
                  icon += _programmingMappingPengingIcon.replace('programingTitle', toolTipMessage);
                }
              }
              if (bomObj.mfgPNID && (bomObj.isMPNAddedinCPN === false || bomObj.isMPNAddedinCPN === 0)) {
                const toolTipMessage = CORE.MPN_MAPPING_PENDING_IN_CPN_TOOLTIP;
                icon += _cpnMappingPending.replace('MPNMappingPendinginCPN', toolTipMessage);
              }
              if (bomObj.isTemperatureSensitive) {
                icon += _tmaxIconElem.replace('tmaxTitle', stringFormat(CORE.TMAX_TOOLTIP, bomObj.maxSolderingTemperature, bomObj.maxTemperatureTime && bomObj.maxTemperatureTime > 0 ? bomObj.maxTemperatureTime : '?'));
              }
              else if (bomObj.isFunctionalTemperatureSensitive) {
                icon += _tmaxYellowIconElem;
              }
              if (bomObj.operationalAttributeIDs && bomObj.operationalAttributeIDs.length > 0) {
                const operationalAttributeIDs = _.split(bomObj.operationalAttributeIDs, ',');
                _.each(operationalAttributeIDs, (attributeID) => {
                  if (attributeID) {
                    const attribute = _.find(vm.attributeList, { 'id': parseInt(attributeID) });
                    if (attribute) {
                      if (attribute && !attribute.icon) {
                        attribute.icon = CORE.DEFAULT_IMAGE;
                      }
                      icon += _rohsImageElem.replace('rohsImagePath', (vm.operationalImagePath + attribute.icon)).replace('rohsTitle', attribute.description ? attribute.description : '');
                    }
                  }
                });
              }
              if (bomObj.isCustom) {
                icon += _customPartIcon;
              }

              $(td).html(icon);
            }
            else {
              $(td).empty();
            }
            return;
          }
          else {
            return Handsontable.renderers.HtmlRenderer.apply(this, arguments);
          }
        }
        else {
          Handsontable.renderers.TextRenderer.apply(this, arguments);
        }

        if (_hotRegisterer && _hotRegisterer.isEmptyRow(row)) {
          return;
        }
        switch (prop) {
          case 'lineID': {
            td.style.textAlign = 'right';
            if (!value || !vm.DecimalNmberPattern.test(value)) {
              td.title = 'Invalid item, Please enter Digit only.';
            } else {
              td.title = '';
            }
            break;
          }
          // Customer BOM LineEnable Cases
          case 'cust_lineID': {
            const bomObj = vm.bomModel[row];
            if (bomObj) {
              cellProperties.readOnly = true;
              if (bomObj && bomObj.isUnlockCustomerBOMLine) {
                cellProperties.readOnly = false;
              }
            }
            break;
          }
          case 'custPN':
          case 'customerRev': {
            const bomObj = vm.bomModel[row];
            if (bomObj && bomObj.cpnErrorColor) {
              td.style.background = bomObj.cpnErrorColor;
              if (bomObj.cpnTooltip) {
                td.title = bomObj.cpnTooltip;
              }
            }
            else if (bomObj && !bomObj.cpnTooltip) {
              td.title = '';
            }
            if (bomObj && bomObj.custPNID && (bomObj.restrictCPNUseInBOMStep || bomObj.restrictCPNUsePermanentlyStep === false || bomObj.restrictCPNUsePermanentlyStep === 0 || bomObj.restrictCPNUseWithPermissionStep === false || bomObj.restrictCPNUseWithPermissionStep === 0)) {
              td.style.textDecoration = 'line-through';
            }
            if (!vm.isBOMReadOnly) {
              cellProperties.readOnly = false;
            }
            if (bomObj && bomObj && bomObj.custPNID && bomObj.allocatedInKit) {
              cellProperties.readOnly = true;
            }
            break;
          }
          case 'qpa':
          case 'refDesig': {
            const bomObj = vm.bomModel[row];
            td.title = '';
            if (bomObj && bomObj.qpaErrorColor !== _successColor) {
              td.style.background = bomObj.qpaErrorColor;
              if (bomObj.qpaTooltip) {
                td.title = bomObj.qpaTooltip;
              }
            }
            if (prop === 'qpa') {
              td.style.textAlign = 'right';
            }
            break;
          }
          case 'dnpQty':
          case 'dnpDesig': {
            const bomObj = vm.bomModel[row];
            if (bomObj && bomObj.dnpqpaErrorColor && bomObj.dnpqpaErrorColor !== _successColor) {
              td.style.background = bomObj.dnpqpaErrorColor;
              if (bomObj.dnpqpaTooltip) {
                td.title = bomObj.dnpqpaTooltip;
              }
            }
            else if (bomObj && !bomObj.dnpqpaTooltip) {
              td.title = '';
            }
            if (prop === 'dnpQty') {
              td.style.textAlign = 'right';
            }
            break;
          }
          case 'isBuyDNPQty': {
            const bomObj = vm.bomModel[row];
            cellProperties.readOnly = true;
            if (bomObj && (bomObj.dnpDesig || bomObj.dnpQty || bomObj.isBuyDNPQty === _buyDNPQTYList[1].value) && !vm.isBOMReadOnly) {
              cellProperties.readOnly = false;
            }
            if (bomObj && bomObj.dnpBuyErrorColor) {
              td.style.background = bomObj.dnpBuyErrorColor;
              if (bomObj.dnpBuyTooltip) {
                td.title = bomObj.dnpBuyTooltip;
              }
            }
            else if (bomObj && !bomObj.dnpBuyTooltip) {
              td.title = '';
            }
            if (bomObj && bomObj.isBuyDisable) {
              cellProperties.readOnly = true;
            }
            break;
          }
          case 'isInstall': {
            const bomObj = vm.bomModel[row];
            if (bomObj && bomObj.populateErrorColor) {
              td.style.background = bomObj.populateErrorColor;
              if (bomObj.populateTooltip) {
                td.title = bomObj.populateTooltip;
              }
            }
            else if (bomObj && !bomObj.populateTooltip) {
              td.title = '';
            }
            break;
          }
          case 'isPurchase': {
            const bomObj = vm.bomModel[row];
            if (bomObj && bomObj.buyErrorColor) {
              td.style.background = bomObj.buyErrorColor;
              if (bomObj.buyTooltip) {
                td.title = bomObj.buyTooltip;
              }
            }
            else if (bomObj && !bomObj.buyTooltip) {
              td.title = '';
            }
            if (bomObj && bomObj.isBuyDisable) {
              cellProperties.readOnly = true;
            }
            break;
          }
          case 'mfgCode': {
            const bomObj = vm.bomModel[row];
            if (bomObj) {
              td.style.background = bomObj.mfgErrorColor;
              if (bomObj.mfgCodeID === null || bomObj.mfgCodeID === undefined) {
                td.style.textDecoration = 'underline dashed';
              }
              if (bomObj.mfgPNID && (bomObj.restrictUseInBOMWithPermissionStep || bomObj.restrictUseInBOMExcludingAliasWithPermissionStep)) {
                td.style.textDecoration = 'double line-through';
              }
              if (bomObj.mfgPNID && (bomObj.restrictCPNUseInBOMStep || bomObj.restrictUseInBOMStep || bomObj.restrictUseExcludingAliasStep === false || bomObj.restrictUseExcludingAliasStep === 0 || bomObj.restrictUseInBOMExcludingAliasStep || bomObj.restrictUsePermanentlyStep === false || bomObj.restrictUsePermanentlyStep === 0 || bomObj.restrictUseWithPermissionStep === false || bomObj.restrictUseWithPermissionStep === 0 || bomObj.restrictUseExcludingAliasWithPermissionStep === false || bomObj.restrictUseExcludingAliasWithPermissionStep === 0 || bomObj.restrictCPNUsePermanentlyStep === false || bomObj.restrictCPNUsePermanentlyStep === 0 || bomObj.restrictCPNUseWithPermissionStep === false || bomObj.restrictCPNUseWithPermissionStep === 0)) {
                td.style.textDecoration = 'line-through';
              }
              if (bomObj.mfgTooltip) {
                td.title = stringFormat('{0}{1}', bomObj.org_mfgCode ? (bomObj.org_mfgCode + '\n') : '', bomObj.mfgTooltip);
              } else if (bomObj.mfgCode && bomObj.mfgCodeID === null) {
                td.title = stringFormat('{0}{1}', bomObj.org_mfgCode ? (bomObj.org_mfgCode + '\n') : '', stringFormat(CORE.MESSAGE_CONSTANT.NOT_CONFIGURED_OR_VERIFIED, vm.LabelConstant.MFG));
              } else {
                td.title = bomObj.org_mfgCode ? bomObj.org_mfgCode : '';
              }
              if (!vm.isBOMReadOnly) {
                cellProperties.readOnly = false;
              }
              if (bomObj && bomObj.mfgPNID && bomObj.mfgPNID !== CORE.TBDMFRPNID && bomObj.mfgPNID !== CORE.NOTAVAILABLEMFRPNID && !bomObj.isUnlockApprovedPart) {
                const isInValid = isBOMObjInValid(partInvalidMatchList, bomObj);
                if (!isInValid && (bomObj.restrictCPNUsePermanentlyStep && bomObj.restrictCPNUseWithPermissionStep && !bomObj.restrictCPNUseInBOMStep)) {
                  cellProperties.readOnly = true;
                }
              }
            }
            break;
          }
          case 'mfgPN': {
            const bomObj = vm.bomModel[row];
            if (bomObj) {
              td.style.background = bomObj.mfgPNErrorColor;
              if (bomObj.mfgTooltip) {
                td.title = bomObj.mfgTooltip;
              } else if (bomObj.mfgPN && (bomObj.mfgPNID === null || bomObj.mfgPNID === undefined)) {
                td.title = stringFormat(CORE.MESSAGE_CONSTANT.NOT_CONFIGURED_OR_VERIFIED, vm.LabelConstant.MFGPN);
              } else {
                td.title = '';
              }
              if (bomObj.mfgPNID === null || bomObj.mfgPNID === undefined) {
                td.style.textDecoration = 'underline dashed';
              }
              if (bomObj.createdBy && bomObj.createdBy.toLowerCase() !== 'auto') {
                td.style.fontWeight = 700;
              }
              if (bomObj.mfgPNID && (bomObj.restrictCPNUseInBOMStep || bomObj.restrictUseInBOMStep || bomObj.restrictUseExcludingAliasStep === false || bomObj.restrictUseExcludingAliasStep === 0 || bomObj.restrictUseExcludingAliasWithPermissionStep === false || bomObj.restrictUseExcludingAliasWithPermissionStep === 0 || bomObj.restrictUseInBOMExcludingAliasStep || bomObj.restrictUsePermanentlyStep === false || bomObj.restrictUsePermanentlyStep === 0 || bomObj.restrictUseWithPermissionStep === false || bomObj.restrictUseWithPermissionStep === 0 || bomObj.restrictCPNUsePermanentlyStep === false || bomObj.restrictCPNUsePermanentlyStep === 0 || bomObj.restrictCPNUseWithPermissionStep === false || bomObj.restrictCPNUseWithPermissionStep === 0)) {
                td.style.textDecoration = 'line-through';
              }
              if (bomObj.mfgPNID && (bomObj.restrictUseInBOMWithPermissionStep || bomObj.restrictUseInBOMExcludingAliasWithPermissionStep)) {
                td.style.textDecoration = 'double line-through';
              }
              if (!vm.isBOMReadOnly) {
                cellProperties.readOnly = false;
              }
              if (bomObj && bomObj.mfgPNID && bomObj.mfgPNID !== CORE.TBDMFRPNID && bomObj.mfgPNID !== CORE.NOTAVAILABLEMFRPNID && !bomObj.isUnlockApprovedPart) {
                const isInValid = isBOMObjInValid(partInvalidMatchList, bomObj);
                if (!isInValid && (bomObj.restrictCPNUsePermanentlyStep && bomObj.restrictCPNUseWithPermissionStep && !bomObj.restrictCPNUseInBOMStep)) {
                  cellProperties.readOnly = true;
                }
              }
            }
            break;
          }
          case 'mountingtypeID': {
            if (vm.bomModel[row]) {
              const mountingtypeID = vm.bomModel[row].mountingtypeID;
              if (mountingtypeID !== null && mountingtypeID !== '' && mountingtypeID !== undefined) {
                let colorCode = null;
                const mountingTypeObj = _.find(_mountingTypeList, (item) => item.name === mountingtypeID);
                if (mountingTypeObj) {
                  colorCode = mountingTypeObj.colorCode;
                }
                td.style.background = colorCode;
              }
            }
            break;
          }
          case 'distributor': {
            const bomObj = vm.bomModel[row];
            if (bomObj) {
              td.style.background = bomObj.distErrorColor;
              if (bomObj.distTooltip) {
                td.title = bomObj.distTooltip;
              } else if (bomObj.distributor && (bomObj.distMfgCodeID === null || bomObj.distMfgCodeID === undefined)) {
                td.title = stringFormat(CORE.MESSAGE_CONSTANT.NOT_CONFIGURED_OR_VERIFIED, 'Supplier');
              } else {
                td.title = '';
              }
              if (bomObj.distMfgCodeID === null || bomObj.distMfgCodeID === undefined) {
                td.style.textDecoration = 'underline dashed';
              }
              if (bomObj && bomObj.mfgPNID && bomObj.mfgPNID !== CORE.TBDMFRPNID && bomObj.mfgPNID !== CORE.NOTAVAILABLEMFRPNID && !bomObj.isUnlockApprovedPart) {
                const isInValid = isBOMObjInValid(partInvalidMatchList, bomObj);
                if (!isInValid && (bomObj.restrictCPNUsePermanentlyStep && bomObj.restrictCPNUseWithPermissionStep && !bomObj.restrictCPNUseInBOMStep)) {
                  cellProperties.readOnly = true;
                }
              }
            }
            break;
          }
          case 'distPN': {
            const bomObj = vm.bomModel[row];
            if (bomObj) {
              td.style.background = bomObj.distPNErrorColor;
              if (bomObj.distPNTooltip) {
                td.title = bomObj.distPNTooltip;
              } else if (bomObj.distPN && (bomObj.distMfgPNID === null || bomObj.distMfgPNID === undefined)) {
                td.title = stringFormat(CORE.MESSAGE_CONSTANT.NOT_CONFIGURED_OR_VERIFIED, 'Supplier PN');
              }
              else {
                td.title = '';
              }
              if (bomObj.distMfgPNID === null || bomObj.distMfgPNID === undefined) {
                td.style.textDecoration = 'underline dashed';
              }
              if (!vm.isBOMReadOnly) {
                cellProperties.readOnly = false;
              }
              if (bomObj && bomObj.mfgPNID && bomObj.mfgPNID !== CORE.TBDMFRPNID && bomObj.mfgPNID !== CORE.NOTAVAILABLEMFRPNID && !bomObj.isUnlockApprovedPart) {
                const isInValid = isBOMObjInValid(partInvalidMatchList, bomObj);
                if (!isInValid && (bomObj.restrictCPNUsePermanentlyStep && bomObj.restrictCPNUseWithPermissionStep && !bomObj.restrictCPNUseInBOMStep)) {
                  cellProperties.readOnly = true;
                }
              }
            }
            break;
          }
          case 'description': {
            let data = '';
            if (value) {
              _.each(value.split('\n'), (item) => {
                if (item) {
                  if (item.split(':').length > 1) {
                    data += item.split(':').slice(1).join(':') + '\n\n';
                  }
                  else {
                    data += item + '\n\n';
                  }
                  //data += item.replace(/^.+:/, '') + "\n";
                }
              });
              $(td).html(data);
            }
            break;
          }
          case 'partPackage': {
            const bomObj = vm.bomModel[row];
            td.title = '';
            if (bomObj && (bomObj.mismatchPackageStep === false || bomObj.mismatchPackageStep === 0)) {
              td.style.background = _errorColor;
              td.style.color = _errorTextColor;
              if (bomObj.mfgPackageTooltip) {
                td.title = bomObj.mfgPackageTooltip;
              } else {
                td.title = '';
              }
            }
            break;
          }
          case 'pitch': {
            const bomObj = vm.bomModel[row];
            td.title = '';
            if (bomObj && (bomObj.mismatchPitchStep === false || bomObj.mismatchPitchStep === 0)) {
              td.style.background = _errorColor;
              td.style.color = _errorTextColor;
              if (bomObj.mfgColorTooltip) {
                td.title = bomObj.mfgColorTooltip;
              } else {
                td.title = '';
              }
            }
            break;
          }
          case 'componentLead':
          case 'numOfPosition': {
            td.title = '';
            if (vm.selectedFilter && _bomFilters && vm.selectedFilter === _bomFilters.MISMATCHEDPIN.CODE) {
              td.style.background = _errorColor;
              td.style.color = _errorTextColor;
            }
            break;
          }
          case 'color': {
            const bomObj = vm.bomModel[row];
            td.title = '';
            if (bomObj && (bomObj.mismatchColorStep === false || bomObj.mismatchColorStep === 0)) {
              td.style.background = _errorColor;
              td.style.color = _errorTextColor;
              if (bomObj.mfgColorTooltip) {
                td.title = bomObj.mfgColorTooltip;
              } else {
                td.title = '';
              }
            }
            break;
          }
          case 'value': {
            const bomObj = vm.bomModel[row];
            td.title = '';
            if (bomObj && (bomObj.mismatchValueStep === false || bomObj.mismatchValueStep === 0)) {
              td.style.background = _errorColor;
              td.style.color = _errorTextColor;
              if (bomObj.mfgValueTooltip) {
                td.title = bomObj.mfgValueTooltip;
              } else {
                td.title = '';
              }
            }
            break;
          }
          case 'tolerance': {
            const bomObj = vm.bomModel[row];
            td.title = '';
            if (bomObj && (bomObj.mismatchToleranceStep === false || bomObj.mismatchToleranceStep === 0)) {
              td.style.background = _errorColor;
              td.style.color = _errorTextColor;
              if (bomObj.mfgToleranceTooltip) {
                td.title = bomObj.mfgToleranceTooltip;
              } else {
                td.title = '';
              }
            }
            break;
          }
          case 'powerRating': {
            const bomObj = vm.bomModel[row];
            td.title = '';
            if (bomObj && (bomObj.mismatchPowerStep === false || bomObj.mismatchPowerStep === 0)) {
              td.style.background = _errorColor;
              td.style.color = _errorTextColor;
              if (bomObj.mfgpowerTooltip) {
                td.title = bomObj.mfgpowerTooltip;
              } else {
                td.title = '';
              }
            }
            break;
          }
          case 'uom': {
            const bomObj = vm.bomModel[row];
            td.title = '';
            if (bomObj && (bomObj.uomMismatchedStep === false || bomObj.uomMismatchedStep === 0)) {
              td.style.background = _errorColor;
              td.style.color = _errorTextColor;
              if (bomObj.uomMismatchedError) {
                td.title = bomObj.uomMismatchedError;
              } else {
                td.title = '';
              }
            }
            break;
          }
          case 'maxOperatingTemp':
          case 'minOperatingTemp': {
            const bomObj = vm.bomModel[row];
            td.title = '';
            if (bomObj && (bomObj.mismatchTempratureStep === false || bomObj.mismatchTempratureStep === 0)) {
              td.style.background = _errorColor;
              td.style.color = _errorTextColor;
              if (bomObj.mfgTempratureTooltip) {
                td.title = bomObj.mfgTempratureTooltip;
              } else {
                td.title = '';
              }
            }
            break;
          }
        }
      });

      // call Search BOM text change to check for dirty state
      vm.SearchInBOMdata = (isSearch, searchTypeChange) => {
        vm.serachObj = $location.search();
        if (vm.serachObj && vm.serachObj.keywords) {
          vm.serachObj.keywords = null;
        }
        if (vm.isBOMChanged || (_.some(vm.refBomModel, (x) => x.isUpdate === true))) {
          const model = {
            title: RFQTRANSACTION.BOM.CHANGES_REMOVE,
            textContent: RFQTRANSACTION.BOM.CHANGES_REMOVE_TEXT,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.confirmDiolog(model).then((yes) => {
            if (yes) {
              if (!isSearch) {
                vm.globalSearchText = '';
                $state.params.keywords = null;
                $state.transitionTo($state.$current, $state.params, { location: true, inherit: true, notify: false });
              }
              if (isSearch && searchtext && searchtext !== vm.globalSearchText) {
                $state.params.keywords = null;
                $state.transitionTo($state.$current, $state.params, { location: true, inherit: true, notify: false });
              }
              applySearchFilter();
            }
          }, () => {
            if (searchtext !== vm.globalSearchText) {
              vm.globalSearchText = searchtext;
            }
            if (searchTypeChange) {
              if (vm.searchOptionValue === vm.RadioGroup.searchOption.array[0].Value) {
                vm.searchOptionValue = vm.RadioGroup.searchOption.array[1].Value;
              } else if (vm.searchOptionValue === vm.RadioGroup.searchOption.array[1].Value) {
                vm.searchOptionValue = vm.RadioGroup.searchOption.array[0].Value;
              }
            }
          });
        }
        else {
          if (searchtext && isSearch && searchtext !== vm.globalSearchText) {
            $state.params.keywords = null;
            $state.transitionTo($state.$current, $state.params, { location: true, inherit: true, notify: false });
          }
          if (!isSearch) {
            vm.globalSearchText = '';
            $state.params.keywords = null;
            $state.transitionTo($state.$current, $state.params, { location: true, inherit: true, notify: false });
          }
          applySearchFilter();
        }
      };

      // Get New data from DB then apply filter
      function applySearchFilter() {
        vm.disableSearchbox = true;
        isFilterApply = false;
        if (vm.selectedFilter !== _bomFilters.ALL.CODE) {
          isFilterApply = true;
        }
        vm.isNoDataFound = true;
        vm.isFilterEnable = true;
        vm.cgBusyLoading = getRFQLineItemsByID().then((response) => {
          if (response) {
            if (vm.selectedFilter !== _bomFilters.ALL.CODE || vm.globalSearchText) {
              vm.settings.minSpareRows = 0;
              vm.settings.className = 'applyFilter';
            } else {
              vm.settings.minSpareRows = 1;
              vm.settings.className = '';
            }

            displayRFQLineItemsByID(response, false);
            applyFilteronData();
            ApplySearchFilterData();

            //Clone Object
            updateCloneObject(isFilterApply);
            vm.settings.mergeCells = false;
            mergeCommonCells();
            vm.isNoDataFound = false;
            vm.disableSearchbox = false;
            _hotRegisterer.render();
          }
        });
      };

      // Filter data as per search criteria
      function ApplySearchFilterData() {
        var bomModelClone = angular.copy(vm.bomModel);
        const searchTxt = vm.globalSearchText ? vm.globalSearchText.toLowerCase() : '';
        if (searchTxt) {
          isFilterApply = true;
          const searchedlineIDs = [];
          searchtext = vm.globalSearchText;
          bomModelClone.forEach((bomObj) => {
            if (bomObj.hidden !== true) {
              const copiedDescription = bomObj.description ? removeCodeFromDEscription(bomObj.description) : '';

              if (vm.searchOptionValue) {
                if ((bomObj.additionalComment && bomObj.additionalComment.toString().replaceAll('\n', ' ').replaceAll('"', '').toLowerCase() === searchTxt.toString().replaceAll('"', '').toLowerCase()) ||
                  (bomObj.allocatedInKit && bomObj.allocatedInKit.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.approvedMountingType && bomObj.approvedMountingType.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.badMfgPN && bomObj.badMfgPN.toString().replaceAll('\n', ' ').replaceAll('"', '').toLowerCase() === searchTxt.toString().replaceAll('"', '').toLowerCase()) ||
                  (bomObj.buyCustomerApprovalComment && bomObj.buyCustomerApprovalComment.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.buyDNPCustomerApprovalComment && bomObj.buyDNPCustomerApprovalComment.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.buyErrorColor && bomObj.buyErrorColor.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.color && bomObj.color.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.componentLead && bomObj.componentLead.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.connecterTypeID && bomObj.connecterTypeID.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.cpnCustomerApprovalComment && bomObj.cpnCustomerApprovalComment.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.custPN && bomObj.custPN.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.cust_lineID && bomObj.cust_lineID.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.customerApproval && bomObj.customerApproval.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.customerApprovalCPN && bomObj.customerApprovalCPN.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.customerApprovalComment && bomObj.customerApprovalComment.toString().replaceAll('\n', ' ').replaceAll('"', '').toLowerCase() === searchTxt.toString().replaceAll('"', '').toLowerCase()) ||
                  (bomObj.customerDescription && bomObj.customerDescription.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.customerPartDesc && bomObj.customerPartDesc.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.customerRev && bomObj.customerRev.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (copiedDescription && copiedDescription.toString().replaceAll('\n', ' ').replaceAll('"', '').toLowerCase() === searchTxt.toString().replaceAll('"', '').toLowerCase()) ||
                  (bomObj.descriptionAlternate && bomObj.descriptionAlternate.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.deviceMarking && bomObj.deviceMarking.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.distPN && bomObj.distPN.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.distributor && bomObj.distributor.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.dnpDesig && bomObj.dnpDesig.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.dnpQty && bomObj.dnpQty.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.dnpqpaCustomerApprovalComment && bomObj.dnpqpaCustomerApprovalComment.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.driveToolIDs && bomObj.driveToolIDs.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.isBuyDNPQty && bomObj.isBuyDNPQty.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.isInstall.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.isBuyDNPQty && bomObj.isPurchase.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.isSupplierToBuy.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.isNotRequiredKitAllocation.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.kitAllocationNotRequiredComment && bomObj.kitAllocationNotRequiredComment.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.lineID && bomObj.lineID.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.maxOperatingTemp && bomObj.maxOperatingTemp.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.maxSolderingTemperature && bomObj.maxSolderingTemperature.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.maxTemperatureTime && bomObj.maxTemperatureTime.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.mfgCode && bomObj.mfgCode.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.mfgPN && bomObj.mfgPN.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.mfgPNDescription && bomObj.mfgPNDescription.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.minOperatingTemp && bomObj.minOperatingTemp.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.mountingtypeID && bomObj.mountingtypeID.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.noOfRows && bomObj.noOfRows.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.numOfPosition && bomObj.numOfPosition.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.operationalAttributeIDs && bomObj.operationalAttributeIDs.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.packaging && bomObj.packaging.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.partCustomerApprovalComment && bomObj.partCustomerApprovalComment.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.partPackage && bomObj.partPackage.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.partStatus && bomObj.partStatus.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.partcategoryID && bomObj.partcategoryID.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.parttypeID && bomObj.parttypeID.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.pitch && bomObj.pitch.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.populateCustomerApprovalComment && bomObj.populateCustomerApprovalComment.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.powerRating && bomObj.powerRating.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.programingRequiredIDs && bomObj.programingRequiredIDs.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.programingStatus && bomObj.programingStatus.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.qpa && bomObj.qpa.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.qpaCustomerApprovalComment && bomObj.qpaCustomerApprovalComment.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.refDesig && bomObj.refDesig.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.requireFunctionalTypeError && bomObj.requireFunctionalTypeError.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.requireFunctionalTypeStep && bomObj.requireFunctionalTypeStep.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.requireMountingTypeError && bomObj.requireMountingTypeError.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.substitutesAllow && bomObj.substitutesAllow.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.suggestedByApplicationMsg && bomObj.suggestedByApplicationMsg.replaceAll('\n', ' ').replaceAll('"', '').toString().toLowerCase().trim() === searchTxt.toString().replaceAll('"', '').toLowerCase()) ||
                  (bomObj.tolerance && bomObj.tolerance.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.uom && bomObj.uom.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.uomID && bomObj.uomID.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.userData1 && bomObj.userData1.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.userData2 && bomObj.userData2.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.userData3 && bomObj.userData3.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.userData4 && bomObj.userData4.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.userData5 && bomObj.userData5.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.userData6 && bomObj.userData6.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.userData7 && bomObj.userData7.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.userData8 && bomObj.userData8.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.userData9 && bomObj.userData9.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.userData10 && bomObj.userData10.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.value && bomObj.value.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj.voltage && bomObj.voltage.toString().toLowerCase() === searchTxt.toString().toLowerCase()) ||
                  (bomObj._lineID && bomObj._lineID.toString().toLowerCase() === searchTxt.toString().toLowerCase())) {
                  bomObj.hidden = false;
                  searchedlineIDs.push(bomObj.lineID);
                } else {
                  bomObj.hidden = true;
                  const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                  _.map(hiddenData, (data) => { data.hidden = true; });
                }
              } else {
                if ((bomObj.additionalComment && bomObj.additionalComment.toString().replaceAll('\n', ' ').replaceAll('"', '').toLowerCase().includes(searchTxt.replaceAll('"', ''))) ||
                  (bomObj.allocatedInKit && bomObj.allocatedInKit.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.approvedMountingType && bomObj.approvedMountingType.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.badMfgPN && bomObj.badMfgPN.replaceAll('\n', ' ').replaceAll('"', '').toString().toLowerCase().includes(searchTxt.replaceAll('"', ''))) ||
                  (bomObj.buyCustomerApprovalComment && bomObj.buyCustomerApprovalComment.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.buyDNPCustomerApprovalComment && bomObj.buyDNPCustomerApprovalComment.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.buyErrorColor && bomObj.buyErrorColor.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.color && bomObj.color.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.componentLead && bomObj.componentLead.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.connecterTypeID && bomObj.connecterTypeID.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.cpnCustomerApprovalComment && bomObj.cpnCustomerApprovalComment.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.custPN && bomObj.custPN.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.cust_lineID && bomObj.cust_lineID.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.customerApproval && bomObj.customerApproval.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.customerApprovalCPN && bomObj.customerApprovalCPN.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.customerApprovalComment && bomObj.customerApprovalComment.toString().replaceAll('\n', ' ').replaceAll('"', '').toLowerCase().includes(searchTxt.replaceAll('"', ''))) ||
                  (bomObj.customerDescription && bomObj.customerDescription.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.customerPartDesc && bomObj.customerPartDesc.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.customerRev && bomObj.customerRev.toString().toLowerCase().includes(searchTxt)) ||
                  (copiedDescription && copiedDescription.toString().replaceAll('\n', ' ').replaceAll('"', '').toLowerCase().includes(searchTxt.replaceAll('"', ''))) ||
                  (bomObj.descriptionAlternate && bomObj.descriptionAlternate.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.deviceMarking && bomObj.deviceMarking.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.distPN && bomObj.distPN.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.distributor && bomObj.distributor.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.dnpDesig && bomObj.dnpDesig.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.dnpQty && bomObj.dnpQty.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.dnpqpaCustomerApprovalComment && bomObj.dnpqpaCustomerApprovalComment.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.driveToolIDs && bomObj.driveToolIDs.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.isBuyDNPQty && bomObj.isBuyDNPQty.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.isInstall.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.isBuyDNPQty && bomObj.isPurchase.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.isSupplierToBuy.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.isNotRequiredKitAllocation.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.kitAllocationNotRequiredComment && bomObj.kitAllocationNotRequiredComment.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.lineID && bomObj.lineID.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.maxOperatingTemp && bomObj.maxOperatingTemp.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.maxSolderingTemperature && bomObj.maxSolderingTemperature.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.maxTemperatureTime && bomObj.maxTemperatureTime.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.mfgCode && bomObj.mfgCode.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.mfgPN && bomObj.mfgPN.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.mfgPNDescription && bomObj.mfgPNDescription.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.minOperatingTemp && bomObj.minOperatingTemp.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.mountingtypeID && bomObj.mountingtypeID.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.noOfRows && bomObj.noOfRows.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.numOfPosition && bomObj.numOfPosition.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.operationalAttributeIDs && bomObj.operationalAttributeIDs.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.packaging && bomObj.packaging.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.partCustomerApprovalComment && bomObj.partCustomerApprovalComment.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.partPackage && bomObj.partPackage.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.partStatus && bomObj.partStatus.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.partcategoryID && bomObj.partcategoryID.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.parttypeID && bomObj.parttypeID.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.pitch && bomObj.pitch.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.populateCustomerApprovalComment && bomObj.populateCustomerApprovalComment.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.powerRating && bomObj.powerRating.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.programingRequiredIDs && bomObj.programingRequiredIDs.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.programingStatus && bomObj.programingStatus.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.qpa && bomObj.qpa.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.qpaCustomerApprovalComment && bomObj.qpaCustomerApprovalComment.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.refDesig && bomObj.refDesig.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.requireFunctionalTypeError && bomObj.requireFunctionalTypeError.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.requireFunctionalTypeStep && bomObj.requireFunctionalTypeStep.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.requireMountingTypeError && bomObj.requireMountingTypeError.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.substitutesAllow && bomObj.substitutesAllow.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.suggestedByApplicationMsg && bomObj.suggestedByApplicationMsg.toString().replaceAll('\n', ' ').replaceAll('"', '').toLowerCase().includes(searchTxt.replaceAll('"', ''))) ||
                  (bomObj.tolerance && bomObj.tolerance.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.uom && bomObj.uom.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.uomID && bomObj.uomID.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.userData1 && bomObj.userData1.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.userData2 && bomObj.userData2.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.userData3 && bomObj.userData3.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.userData4 && bomObj.userData4.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.userData5 && bomObj.userData5.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.userData6 && bomObj.userData6.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.userData7 && bomObj.userData7.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.userData8 && bomObj.userData8.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.userData9 && bomObj.userData9.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.userData10 && bomObj.userData10.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.value && bomObj.value.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj.voltage && bomObj.voltage.toString().toLowerCase().includes(searchTxt)) ||
                  (bomObj._lineID && bomObj._lineID.toString().toLowerCase().includes(searchTxt))) {
                  bomObj.hidden = false;
                  searchedlineIDs.push(bomObj.lineID);
                } else {
                  bomObj.hidden = true;
                  const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                  _.map(hiddenData, (data) => { data.hidden = true; });
                }
              }
            }
          });

          _.each(searchedlineIDs, (objLineID) => {
            const hiddenData = _.filter(vm.bomModel, { 'lineID': objLineID });
            _.map(hiddenData, (data) => { data.hidden = false; });
          });
        } else {
          if (vm.selectedFilter !== _bomFilters.ALL.CODE) {
            isFilterApply = true;
          } else {
            isFilterApply = false;
          }
          searchtext = vm.globalSearchText;
        }
        bomModelClone = _.filter(vm.bomModel, (x) => !x.hidden);

        if (bomModelClone.length === 0) {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.SEARCH_DATA_NOT_FOUND);
          const model = {
            messageContent: messgaeContent
          };
          DialogFactory.messageAlertDialog(model);
          _.map(vm.bomModel, (data) => { data.hidden = undefined; });
          applyFilteronData();
        }
      }

      vm.clearHandsonTableSearchData = function () {
        vm.SearchInBOMdata(false);
      };
      vm.getHandsonTableData = function () {
        var search = _hotRegisterer.getPlugin('search');
        var queryResult = search.query(vm.globalSearchText);
        const qList = [];
        queryResult.forEach((item) => {
          const bomObj = vm.bomModel[item.row];
          if (bomObj && bomObj.isMergedRow) {
            // Manage Merge case: in Merge cell do not count 2 item.
            const foundItem = _.find(qList, (qData) => (qData.col === item.col) && qData.lineID && (qData.lineID === bomObj.lineID));
            if (!foundItem || (foundItem && foundItem.col > 20)) {
              item.lineID = bomObj.lineID;
              qList.push(item);
            }
          } else {
            qList.push(item);
          }
        });
        vm.SearchResult = qList.length;
        window.setTimeout(setHandsontableHeight);
      };

      function removeCodeFromDEscription(description) {
        let copiedDescription = '';
        if (description) {
          description = description.split('\n');
          _.each(description, (item) => {
            if (item) {
              if (item.split(':').length > 1) {
                copiedDescription += item.split(':').slice(1).join(':');
              }
              else {
                copiedDescription += item;
              }
            }
          });
          copiedDescription = copiedDescription.trim();
        }
        else {
          copiedDescription = description;
        }
        return copiedDescription;
      }

      // Handson table data search result
      function searchResult(queryStr, value, colDef) {
        if (colDef && colDef.prop === 'description' && value) {
          value = removeCodeFromDEscription(value);
        }

        if (queryStr && colDef && (colDef.prop === 'isNotRequiredKitAllocation' || colDef.prop === 'isSupplierToBuy' || colDef.prop === 'isPurchase' || colDef.prop === 'isInstall')) {
          if (vm.searchOptionValue) {
            return value.toString().replaceAll('\n', ' ').replaceAll('"', '').toLowerCase() === queryStr.toString().replaceAll('"', '').toLowerCase();
          } else {
            return value.toString().replaceAll('\n', ' ').replaceAll('"', '').toLowerCase().includes(queryStr.toString().replaceAll('"', '').toLowerCase());
          }
        } else {
          if (value && queryStr) {
            if (vm.searchOptionValue) {
              return value.toString().replaceAll('\n', ' ').replaceAll('"', '').toLowerCase() === queryStr.toString().replaceAll('"', '').toLowerCase();
            } else {
              return value.toString().replaceAll('\n', ' ').replaceAll('"', '').toLowerCase().includes(queryStr.toString().replaceAll('"', '').toLowerCase());
            }
          }
        }
      };
      // Check MFR and MFR PN cell is valid or not
      function isValidCellError(bomObj) {
        if (bomObj.mfgErrorColor && bomObj.mfgErrorColor !== _successColor && bomObj.mfgErrorColor !== _nonRoHSColor) {
          // Dharam [01/19/2021]: Added below condition to exclude error for suggested part
          if ([_successColor, _suggestAlternatePartError.errorColor, _suggestMFRMappingError.errorColor, _suggestPackagingPartError.errorColor, _suggestProcessMaterialPartError.errorColor, _suggestRoHSReplacementPartError.errorColor, _suggestedGoodPartError.errorColor, _suggestedGoodDistPartError.errorColor].indexOf(bomObj.mfgErrorColor) === -1 && !bomObj.obsoleteErrorOnly) {
            return true;
          }
          else if (bomObj.isObsoleteLine) {
            return false;
          }
        }
        return false;
      };
      // On search option change event (Contains/Exact)
      vm.changeSerchOption = function () {
        if (vm.globalSearchText) {
          vm.serachObj = $location.search();
          if (vm.serachObj && vm.serachObj.keywords) {
            vm.serachObj.keywords = null;
          }
          vm.SearchInBOMdata(true, true);
        }
      };
      // handsontable settings
      vm.settings = {
        rowHeaders: true,
        licenseKey: 'non-commercial-and-evaluation',
        search: {
          queryMethod: searchResult,
          searchResultClass: 'handsontableSearch'
        },
        colHeaders: true,
        renderAllRows: false,
        fixedColumnsLeft: 1,
        minSpareRows: 1,
        stretchH: 'all',
        contextMenu: false,
        mergeCells: true,
        manualColumnResize: true,
        autoRowSize: { syncLimit: 25 },
        selectionMode: 'multiple', // 'single', 'range' or 'multiple'
        //manualRowResize: true,
        // Disabled drag and fill functionality
        fillHandle: false,
        beforeCopy: (data, coords) => {
          const headerList = _.filter(angular.copy(vm.sourceHeader), (item) => item.hidden !== true);
          const copyColumnsHeaderList = _.map(_.filter(headerList, (item, colIndex) => { item.colIndex = colIndex; return colIndex >= coords[0].startCol && colIndex <= coords[0].endCol; }), (obj) => ({ index: obj.colIndex, field: obj.field, header: obj.header }));

          const descriptionIndex = _.findIndex(copyColumnsHeaderList, { field: 'description' });
          if (descriptionIndex !== -1) {
            _.each(data, (item) => {
              item[descriptionIndex] = removeCodeFromDEscription(item[descriptionIndex]);
            });
          }
          const badMfgPNIndex = _.findIndex(copyColumnsHeaderList, { field: 'badMfgPN' });
          if (badMfgPNIndex !== -1) {
            _.each(data, (item) => {
              item[badMfgPNIndex] = item[badMfgPNIndex] ? item[badMfgPNIndex].replaceAll('\n', ' ').replaceAll('"', ' ') : '';
            });
          }
        },
        afterChange: function (changes, source) {
          // if user copy-paste
          switch (source) {
            case 'CopyPaste.paste': {
              // update row data on copy/paste
              changes.forEach((item) => {
                const row = item[0];
                const field = item[1];

                if (_hotRegisterer && _hotRegisterer.isEmptyRow(row)) {
                  return;
                }

                const bomObj = vm.bomModel[row];
                if (bomObj) {
                  if (!bomObj.uomID) {
                    bomObj.uomID = CORE.UOM_DEFAULTS.EACH.NAME;
                    const unit = _.find(_unitList, (y) => {
                      if (y.unitName && y.unitName.toUpperCase() === bomObj.uomID.toUpperCase() || y.alias && y.alias.length > 0 && y.alias.find((x) => x.alias.toUpperCase() === bomObj.uomID.toUpperCase())) {
                        return y;
                      }
                    });
                    bomObj.uomID = unit ? unit.unitName : bomObj.uomID;
                  }
                  if (!bomObj.programingStatus) {
                    bomObj.programingStatus = _programingStatusList[0].value;
                  }
                  if (bomObj.isPurchase === null || bomObj.isPurchase === undefined) {
                    bomObj.isPurchase = true;
                  }
                  if (bomObj.isNotRequiredKitAllocation === null || bomObj.isNotRequiredKitAllocation === undefined) {
                    bomObj.isNotRequiredKitAllocation = false;
                  }
                  if (bomObj.isSupplierToBuy === null || bomObj.isSupplierToBuy === undefined) {
                    bomObj.isSupplierToBuy = false;
                  }
                  if (bomObj.isInstall === null || bomObj.isInstall === undefined) {
                    bomObj.isInstall = true;
                  }
                  if (bomObj.substitutesAllow === null || bomObj.isInstall === undefined) {
                    bomObj.substitutesAllow = _substitutesAllowList[0].value;
                  }
                  if (!bomObj.isBuyDNPQty) {
                    bomObj.isBuyDNPQty = _buyDNPQTYList[0].value;
                  }
                }

                // If value is blank string then convert to null. Ternary operator used as value can be 0 so directly cannot use ||
                let oldVal = item[2] === '' || item[2] === undefined ? null : item[2];
                const newVal = item[3] === '' || item[3] === undefined ? null : item[3];

                if (oldVal === newVal) {
                  return;
                }

                vm.isBOMChanged = BOMFactory.isBOMChanged = true;
                BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];

                if ((bomObj.id || bomObj.rfqAlternatePartID) && oldVal !== newVal) {
                  bomObj.isUpdate = true;
                }

                switch (field) {
                  case 'lineID': {
                    bomObj.lineID = parseFloat(bomObj[field]);
                    bomObj._lineID = parseFloat(bomObj[field]);
                    if (!bomObj.id) {
                      bomObj.cust_lineID = bomObj[field] ? bomObj[field].toString() : null;
                    }
                    break;
                  }
                  case 'qpa': {
                    bomObj.qpaDesignatorStep = vm.QPAREFDESValidationStepsFlag.Change;
                    bomObj.qpaDesignatorStepError = generateDescription(bomObj, _QPAREFDESChangeError);
                    onQPAChange();
                    onQPAREFDESChange(bomObj, row, field);
                    qpaDesignatorStepFn(bomObj, row);
                    break;
                  }
                  case 'refDesig': {
                    bomObj.qpaDesignatorStep = vm.QPAREFDESValidationStepsFlag.Change;
                    bomObj.qpaDesignatorStepError = generateDescription(bomObj, _QPAREFDESChangeError);
                    if (bomObj[field]) {
                      bomObj[field] = bomObj[field].toUpperCase();
                    }
                    onQPAREFDESChange(bomObj, row, field);
                    qpaDesignatorStepFn(bomObj, row);
                    break;
                  }
                  case 'dnpQty': {
                    bomObj.dnpQPARefDesStep = vm.QPAREFDESValidationStepsFlag.Change;
                    bomObj.dnpQPARefDesError = generateDescription(bomObj, _dnpQPAREFDESChangeError);
                    onQPAChange();
                    onDNPQPAREFDESChange(bomObj, row, field);
                    dnpqpaDesignatorStepFn(bomObj, row);
                    break;
                  }
                  case 'dnpDesig': {
                    if (bomObj[field]) {
                      bomObj[field] = bomObj[field].toUpperCase();
                    }
                    bomObj.dnpQPARefDesStep = vm.QPAREFDESValidationStepsFlag.Change;
                    bomObj.dnpQPARefDesError = generateDescription(bomObj, _dnpQPAREFDESChangeError);
                    onDNPQPAREFDESChange(bomObj, row, field);
                    dnpqpaDesignatorStepFn(bomObj, row);
                    break;
                  }
                  case 'mfgCode':
                  case 'mfgPN': {
                    if (bomObj[field]) {
                      bomObj[field] = bomObj[field].toString().toUpperCase().trim();
                      bomObj[field] = replaceHiddenSpecialCharacter(bomObj[field]);
                      bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                    }
                    onMfgChange(bomObj, row, field);
                    break;
                  }
                  case 'distributor':
                  case 'distPN': {
                    if (bomObj[field]) {
                      bomObj[field] = bomObj[field].toString().toUpperCase().trim();
                      bomObj[field] = replaceHiddenSpecialCharacter(bomObj[field]);
                      bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                    }
                    onDistributorChange(bomObj, row, field);
                    break;
                  }
                  case 'custPN':
                  case 'customerRev': {
                    onCPNAndRevChange(bomObj, row, field, oldVal);
                    break;
                  }
                  case 'isInstall': {
                    bomObj[field] = bomObj[field] && bomObj[field].toString().toLowerCase() === 'true' ? true : false;
                    onPopulateChange(bomObj, row, field);
                    populateStepFn(bomObj, row);
                    break;
                  }
                  case 'isNotRequiredKitAllocation': {
                    bomObj[field] = bomObj[field] && bomObj[field].toString().toLowerCase() === 'true' ? true : false;
                    if (oldVal === null || oldVal === undefined || oldVal === '') {
                      oldVal = false;
                    }
                    if (bomObj[field] !== oldVal) {
                      vm.kitAllocationNotRequiredCommentPopup(bomObj);
                    }
                    break;
                  }
                  case 'isPurchase': {
                    bomObj[field] = bomObj[field] && bomObj[field].toString().toLowerCase() === 'true' ? true : false;
                    onBuyChange(bomObj, row, field);
                    buyStepFn(bomObj, row);
                    break;
                  }
                  case 'isBuyDNPQty': {
                    if (bomObj[field] === null || bomObj[field] === undefined || bomObj[field] === '') {
                      bomObj[field] = _buyDNPQTYList[0].value;
                    }
                    if (oldVal !== newVal) {
                      onDNPBuyChange(bomObj, row, field);
                      buyStepFn(bomObj, row);
                    }
                    break;
                  }
                  case 'programingStatus': {
                    if (bomObj[field] === null || bomObj[field] === undefined || bomObj[field] === '') {
                      bomObj[field] = _programingStatusList[0].value;
                    }
                    if (oldVal !== newVal) {
                      onProgrammingStatusChange(bomObj, row, field);
                      mfgVerificationStepFn(bomObj, row);
                      setHeaderStyle();
                    }
                    break;
                  }
                }
              });
              break;
            }
            case 'edit':
            case 'CopyPaste.cut': {
              changes.forEach((item) => {
                const row = item[0];
                const field = item[1];

                if (_hotRegisterer && _hotRegisterer.isEmptyRow(row)) {
                  return;
                }

                const bomObj = vm.bomModel[row];
                // For add default data of UOM and Programing Status
                if (bomObj) {
                  if (!bomObj.uomID) {
                    bomObj.uomID = CORE.UOM_DEFAULTS.EACH.NAME;
                    const unit = _.find(_unitList, (y) => {
                      if (y.unitName && y.unitName.toUpperCase() === bomObj.uomID.toUpperCase() || y.alias && y.alias.length > 0 && y.alias.find((x) => x.alias.toUpperCase() === bomObj.uomID.toUpperCase())) {
                        return y;
                      }
                    });
                    bomObj.uomID = unit ? unit.unitName : bomObj.uomID;
                  }
                  if (!bomObj.programingStatus) {
                    bomObj.programingStatus = _programingStatusList[0].value;
                  }
                  if (bomObj.isPurchase === null || bomObj.isPurchase === undefined) {
                    bomObj.isPurchase = true;
                  }
                  if (bomObj.isNotRequiredKitAllocation === null || bomObj.isNotRequiredKitAllocation === undefined) {
                    bomObj.isNotRequiredKitAllocation = false;
                  }
                  if (bomObj.isSupplierToBuy === null || bomObj.isSupplierToBuy === undefined) {
                    bomObj.isSupplierToBuy = false;
                  }
                  if (bomObj.isInstall === null || bomObj.isInstall === undefined) {
                    bomObj.isInstall = true;
                  }
                  if (bomObj.substitutesAllow === null || bomObj.substitutesAllow === undefined) {
                    bomObj.substitutesAllow = _substitutesAllowList[0].value;
                  }
                  if (!bomObj.isBuyDNPQty) {
                    bomObj.isBuyDNPQty = _buyDNPQTYList[0].value;
                  }
                }

                // If value is blank string then convert to null. Ternary operator used as value can be 0 so directly cannot use ||
                let oldVal = item[2] === '' || item[2] === undefined ? null : item[2];
                let newVal = item[3] === '' || item[3] === undefined ? null : item[3];

                oldVal = oldVal ? oldVal.toString().trim() : oldVal;
                newVal = newVal ? newVal.toString().trim() : newVal;

                if (oldVal === newVal) {
                  return;
                }

                vm.isBOMChanged = BOMFactory.isBOMChanged = true;
                BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];

                if ((bomObj.id || bomObj.rfqAlternatePartID) && oldVal !== newVal) {
                  bomObj.isUpdate = true;
                }
                switch (field) {
                  case 'lineID': {
                    const mergedCellInfo = getMergeCellInfoByRow(row);
                    let mergedLineList = [];
                    if (vm.bomModel[row].id !== null && vm.bomModel[row].id !== undefined && vm.bomModel[row].id !== 0) {
                      mergedLineList = _.filter(vm.bomModel, { id: vm.bomModel[row].id });
                    }

                    if (mergedCellInfo) {
                      const mergedRowCounts = mergedCellInfo.rowspan;
                      for (let i = 0; i < mergedRowCounts; i++) {
                        vm.bomModel[mergedCellInfo.row + i]._lineID = newVal ? parseFloat(newVal) : null;
                        vm.bomModel[mergedCellInfo.row + i].lineID = null;
                      }
                    }
                    else if (!mergedCellInfo && mergedLineList.length > 0) {
                      _.each(mergedLineList, (item) => {
                        item._lineID = newVal ? parseFloat(newVal) : null;
                        item.lineID = null;
                      });
                    }
                    else {
                      vm.bomModel[row]._lineID = newVal ? parseFloat(newVal) : null;
                    }
                    vm.bomModel[row].lineID = newVal ? parseFloat(newVal) : null;

                    if (!vm.bomModel[row].id) {
                      vm.bomModel[row].cust_lineID = newVal ? newVal.toString() : null;
                    }
                    break;
                  }
                  case 'cust_lineID': {
                    const mergedCellInfo = getMergeCellInfoByRow(row);
                    let mergedLineList = [];
                    if (vm.bomModel[row].id !== null && vm.bomModel[row].id !== undefined && vm.bomModel[row].id !== 0) {
                      mergedLineList = _.filter(vm.bomModel, { _lineID: vm.bomModel[row]._lineID });
                    }

                    if (mergedCellInfo) {
                      const mergedRowCounts = mergedCellInfo.rowspan;
                      for (let i = 0; i < mergedRowCounts; i++) {
                        vm.bomModel[mergedCellInfo.row + i].cust_lineID = newVal;
                      }
                    }
                    else if (!mergedCellInfo && mergedLineList.length > 0) {
                      _.each(mergedLineList, (item) => {
                        item.cust_lineID = newVal;
                      });
                    }
                    else {
                      vm.bomModel[row].cust_lineID = newVal;
                    }
                    vm.bomModel[row].cust_lineID = newVal;

                    if (!vm.bomModel[row].id) {
                      vm.bomModel[row].cust_lineID = newVal ? newVal.toString() : null;
                    }
                    break;
                  }
                  case 'qpa':
                  case 'refDesig':
                  case 'dnpQty':
                  case 'dnpDesig':
                  case 'uomID': {
                    // if we change into given field then also change event of alternate rows call. As we do not care about alternate row values for these field return if alternate row
                    const mergedCellInfo = getMergeCellInfoByRow(row);
                    if (mergedCellInfo && mergedCellInfo.row !== row) {
                      return;
                    }
                    let mergedLineList = [];
                    if (vm.bomModel[row].id !== null && vm.bomModel[row].id !== undefined && vm.bomModel[row].id !== 0) {
                      mergedLineList = _.filter(vm.bomModel, { _lineID: vm.bomModel[row]._lineID });
                    }

                    if (mergedCellInfo && mergedLineList.length > 0 && field === 'uomID') {
                      _.each(mergedLineList, (item) => {
                        item.uomID = newVal;
                      });
                    }

                    if (field === 'refDesig' || field === 'dnpDesig') {
                      oldVal = oldVal ? oldVal.toString().trim() : '';
                      newVal = newVal ? newVal.toString().trim() : '';
                    }

                    // remove extra multiple comma
                    if (field === 'refDesig' && bomObj.refDesig) {
                      bomObj.refDesig = bomObj.refDesig.toUpperCase().replace(/(,|\s)+/g, ',');
                    }
                    if (field === 'dnpDesig' && bomObj.dnpDesig) {
                      bomObj.dnpDesig = bomObj.dnpDesig.toUpperCase().replace(/(,|\s)+/g, ',');
                    }

                    if (field === 'qpa' || field === 'dnpQty') {
                      onQPAChange();
                    }

                    // As field is changed make all validation flags NULL, as user has to again reverify all details
                    if (field === 'refDesig' || field === 'qpa') {//  || field === 'uomID'
                      // if (field !== 'uomID') { Dharam: Pending to test this case
                      bomObj.qpaDesignatorStep = vm.QPAREFDESValidationStepsFlag.Change;
                      bomObj.qpaDesignatorStepError = generateDescription(bomObj, _QPAREFDESChangeError);
                      onQPAREFDESChange(bomObj, row, field);
                      _.remove(_invalidCells, (x) => x[0] === row && (x[1] === _colQPAIndex || x[1] === _colRefDesigIndex));
                      //}
                    }
                    if (field === 'dnpDesig' || field === 'dnpQty') {//  || field === 'uomID'
                      // if (field !== 'uomID') { Dharam: Pending to test this case
                      bomObj.dnpQPARefDesStep = vm.QPAREFDESValidationStepsFlag.Change;
                      bomObj.dnpQPARefDesError = generateDescription(bomObj, _dnpQPAREFDESChangeError);
                      onDNPQPAREFDESChange(bomObj, row, field);
                      _.remove(_invalidCells, (x) => x[0] === row && (x[1] === _colDNPQty || x[1] === _colDNPDesig));
                      //}
                    }
                    qpaDesignatorStepFn(bomObj, row);
                    dnpqpaDesignatorStepFn(bomObj, row);
                    break;
                  }
                  case 'mfgCode':
                  case 'mfgPN': {
                    if (bomObj[field]) {
                      bomObj[field] = bomObj[field].toString().trim().toUpperCase();
                      bomObj[field] = replaceHiddenSpecialCharacter(bomObj[field]);
                      bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                    }
                    onMfgChange(bomObj, row, field);
                    break;
                  }
                  case 'distributor':
                  case 'distPN': {
                    if (bomObj[field]) {
                      bomObj[field] = bomObj[field].toString().trim().toUpperCase();
                      bomObj[field] = replaceHiddenSpecialCharacter(bomObj[field]);
                      bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                    }
                    onDistributorChange(bomObj, row, field);
                    break;
                  }
                  case 'custPN':
                  case 'customerRev': {
                    const mergedCellInfo = getMergeCellInfoByRow(row);
                    let mergedLineList = [];
                    if (vm.bomModel[row].id !== null && vm.bomModel[row].id !== undefined && vm.bomModel[row].id !== 0) {
                      mergedLineList = _.filter(vm.bomModel, { _lineID: vm.bomModel[row]._lineID });
                    }

                    if (mergedCellInfo) {
                      const mergedRowCounts = mergedCellInfo.rowspan;
                      for (let i = 0; i < mergedRowCounts; i++) {
                        vm.bomModel[mergedCellInfo.row + i].custPNID = null;
                      }
                    }
                    else if (!mergedCellInfo && mergedLineList.length > 0) {
                      _.each(mergedLineList, (item) => {
                        item.custPNID = null;
                      });
                    }
                    else {
                      vm.bomModel[row].custPNID = null;
                    }
                    vm.bomModel[row].custPNID = null;

                    if (!vm.bomModel[row].id) {
                      vm.bomModel[row].custPNID = null;
                    }
                    onCPNAndRevChange(bomObj, row, field, oldVal);
                    break;
                  }
                  case 'isInstall': {
                    bomObj[field] = bomObj[field] && bomObj[field].toString().toLowerCase() === 'true' ? true : false;
                    onPopulateChange(bomObj, row, field);
                    populateStepFn(bomObj, row);
                    break;
                  }
                  case 'isNotRequiredKitAllocation': {
                    bomObj[field] = bomObj[field] && bomObj[field].toString().toLowerCase() === 'true' ? true : false;
                    if (oldVal === null || oldVal === undefined || oldVal === '') {
                      oldVal = false;
                    }
                    if (bomObj[field] !== oldVal) {
                      vm.kitAllocationNotRequiredCommentPopup(bomObj);
                    }
                    break;
                  }
                  case 'isPurchase': {
                    bomObj[field] = bomObj[field] && bomObj[field].toString().toLowerCase() === 'true' ? true : false;
                    onBuyChange(bomObj, row, field);
                    buyStepFn(bomObj, row);
                    break;
                  }
                  case 'isBuyDNPQty': {
                    if (bomObj[field] === null || bomObj[field] === undefined || bomObj[field] === '') {
                      bomObj[field] = _buyDNPQTYList[0].value;
                    }
                    if (oldVal !== newVal) {
                      onDNPBuyChange(bomObj, row, field);
                      buyStepFn(bomObj, row);
                    }
                    break;
                  }
                  case 'programingStatus': {
                    if (bomObj[field] === null || bomObj[field] === undefined || bomObj[field] === '') {
                      bomObj[field] = _programingStatusList[0].value;
                    }
                    if (oldVal !== newVal) {
                      onProgrammingStatusChange(bomObj, row, field);
                      setHeaderStyle();
                    }
                    break;
                  }
                }
              });
              break;
            }
            case 'UndoRedo.undo': {
              vm.isBOMChanged = BOMFactory.isBOMChanged = true;
              BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];
              let isLineIDChanged = false;

              changes.forEach((item) => {
                var field = item[1];
                var row = item[0];
                var bomObj = vm.bomModel[row];

                const mergedCellInfo = getMergeCellInfoByRow(row);

                // on undo alternate parts rows values are override into main line item
                // So on undo make all common properties of same line item alternate lines NULL
                if (mergedCellInfo && mergedCellInfo.row !== row && _multiFields.indexOf(field) === -1) {
                  bomObj[field] = null;
                }
                else if ((!mergedCellInfo || mergedCellInfo.row === row) && field === 'lineID') {
                  bomObj._lineID = item[3];    // set value of lineID into _lineID
                  isLineIDChanged = true;
                }
              });

              if (isLineIDChanged) {
                mergeCommonCells();
              }
              break;
            }
          }
        },
        afterInit: function () {
          $scope.loaderVisible = true;
          window.setTimeout(() => {
            // Apply scrollbar theme CSS. Commented as it is giving fixed row height issue on left bottom section
            _hotRegisterer = hotRegisterer.getInstance('hot-bom');
            if (_hotRegisterer) {
              _hotRegisterer.addHookOnce('afterRender', () => {
                vm.getHandsonTableData();
              });
              _hotRegisterer.validateCells();
              _hotRegisterer.render();
            }
            vm.serachObj = $location.search();
            if (vm.serachObj && vm.serachObj.keywords) {
              vm.searchOptionValue = vm.RadioGroup.searchOption.array[1].Value;
              vm.keywords = decodeURIComponent(vm.serachObj.keywords);
              vm.globalSearchText = vm.keywords;
              vm.SearchInBOMdata(true);
              window.setTimeout(setHandsontableHeight);
            }
          });
        },
        cells: function () {
          var cellProperties = {
            renderer: 'cellRenderer'
          };
          return cellProperties;
        },
        afterValidate: function (isValid, value, row, prop) {
          // If first row (header row) or empty row then return
          if (!_hotRegisterer || _hotRegisterer.isEmptyRow(row)) {
            return true;
          }

          // If invalid cell then make row header and column header red
          // If valid cell and no other errors into same column or row then remove red background color from headers
          const bomObj = vm.bomModel[row];
          if (bomObj) {
            switch (prop) {
              case 'qpa':
              case 'refDesig':
                {
                  if (bomObj.qpaErrorColor && bomObj.qpaErrorColor !== _successColor) {
                    isValid = false;
                  }
                  break;
                }
              case 'dnpQty':
              case 'dnpDesig':
                {
                  if (bomObj.dnpqpaErrorColor && bomObj.dnpqpaErrorColor !== _successColor) {
                    isValid = false;
                  }
                  break;
                }
              case 'mfgCode':
              case 'mfgPN': {
                if (isValidCellError(bomObj)) {
                  isValid = false;
                }
                break;
              }
              case 'distributor': {
                if (bomObj.distErrorColor && bomObj.distErrorColor !== _successColor) {
                  isValid = false;
                }
                break;
              }
              case 'distPN': {
                if (bomObj.distPNErrorColor && bomObj.distPNErrorColor !== _successColor) {
                  isValid = false;
                }
                break;
              }
              case 'isInstall': {
                if (bomObj.populateErrorColor && bomObj.populateErrorColor !== _successColor) {
                  isValid = false;
                }
                break;
              }
              case 'isPurchase': {
                if (bomObj.buyErrorColor && bomObj.buyErrorColor !== _successColor) {
                  isValid = false;
                }
                break;
              }
              case 'isBuyDNPQty': {
                if (bomObj.dnpBuyErrorColor && bomObj.dnpBuyErrorColor !== _successColor) {
                  isValid = false;
                }
                break;
              }
              case 'custPN':
              case 'customerRev': {
                if (bomObj.cpnErrorColor && bomObj.cpnErrorColor !== _successColor) {
                  isValid = false;
                }
                break;
              }
            }
          }
          afterCellValidate(isValid, row, prop);
        },
        // Discussion with Shirish on 14-10-2021 Not in Use as he told as we are now removing row from Array
        // instead of handson table internal function

        //beforeRemoveRow: function (index, amount) {
        //  vm.isBOMChanged = BOMFactory.isBOMChanged = true;
        //  BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];

        //  var row = index;
        //  var lastRow = index + amount;

        //  // If first row of merge line is removed then we need to bind all property of first line into second next visible line.
        //  var mergedCellInfo = getMergeCellInfoByRow(index);
        //  if (mergedCellInfo) {
        //    if (mergedCellInfo.row == index) {
        //      var currentItem = vm.bomModel[index];
        //      var nextItem = vm.bomModel[index + amount];

        //      if (nextItem && currentItem._lineID == nextItem._lineID) {
        //        _sourceHeaderVisible.forEach((item) => {
        //          if (_multiFields.indexOf(item.field) == -1) {
        //            nextItem[item.field] = currentItem[item.field];
        //          }
        //        });
        //      }
        //    }
        //    // As on merge cells we do not have value of lineID of other rows we need to assign lineID before deleting them.
        //    // on undo we will use this lineID to re merge the cells.
        //    else {
        //      vm.bomModel[index].lineID = vm.bomModel[mergedCellInfo.row].lineID;
        //    }
        //  }

        //  // As on merge cells we do not have value of lineID of other rows we need to assign lineID before deleting them.
        //  // on undo we will use this lineID to re merge the cells.
        //  while (++row < lastRow) {
        //    var mergedCellInfo = getMergeCellInfoByRow(row);
        //    if (mergedCellInfo && mergedCellInfo.row != row) {
        //      vm.bomModel[row].lineID = vm.bomModel[mergedCellInfo.row].lineID;
        //    }
        //  }

        //  // if last deleting row is first row of any merge rows
        //  if (index != lastRow) {
        //    // If first row of merge line is removed then we need to bind all property of first line into second next visible line.
        //    mergedCellInfo = getMergeCellInfoByRow(lastRow);
        //    if (mergedCellInfo) {
        //      if (mergedCellInfo.row < lastRow && (mergedCellInfo.row + mergedCellInfo.rowspan) - 1 >= lastRow) {
        //        var currentItem = vm.bomModel[mergedCellInfo.row];
        //        var nextItem = vm.bomModel[lastRow];

        //        if (nextItem && currentItem._lineID == nextItem._lineID) {
        //          _sourceHeaderVisible.forEach((item) => {
        //            if (_multiFields.indexOf(item.field) == -1) {
        //              nextItem[item.field] = currentItem[item.field];
        //            }
        //          });
        //        }
        //      }
        //    }
        //  }
        //},

        // Discussion with Shirish on 14-10-2021 Not in Use as he told as we are now removing row from Array
        // instead of handson table internal function

        //afterRemoveRow: function (index, amount) {
        //  var updateIndex = [];

        //  for (var i = index; i < index + amount; i++) {
        //    _.remove(_invalidCells, (x) => x[0] == i);
        //    updateIndex.push(i);
        //  }

        //  updateIndex.forEach((index) => {
        //    _invalidCells.forEach((obj) => {
        //      if (obj[0] > index) {
        //        obj[0]--;
        //      }
        //    });
        //  });

        //  $timeout(() => {
        //    if (_hotRegisterer) {
        //      _hotRegisterer.validateCells();
        //    }
        //    setHeaderStyle();
        //  });
        //},
        afterMergeCells: function (mergeCells) {
          var fromRow = mergeCells.from.row;
          var toRow = mergeCells.to.row;
          var fromBOMModel = vm.bomModel[fromRow];

          // _lineID set as 'temp' from context menu (add alternate line) because of issue on merging new row to empty new row
          if (fromBOMModel._lineID === 'temp') {
            fromBOMModel._lineID = null;
          }
          for (let i = fromRow + 1; i <= toRow; i++) {
            const bomObj = vm.bomModel[i];
            bomObj.lineID = fromBOMModel.lineID;
            bomObj._lineID = fromBOMModel._lineID;
            bomObj.custPNID = fromBOMModel.custPNID;
            bomObj.custPN = fromBOMModel.custPN;
            bomObj.customerRev = fromBOMModel.customerRev;
          }
        },
        afterGetColHeader: function (col, th) {
          th.className = 'h-col-' + col;
          if (col === _colItemIndex) {
            th.innerHTML = th.innerHTML.replace(_sourceHeaderVisible[_colItemIndex].header, _sourceHeaderVisible[_colItemIndex].header + ' <span class="red"> *</span>');
          }
          if (col === _colQPAIndex) {
            th.innerHTML = th.innerHTML.replace(_sourceHeaderVisible[_colQPAIndex].header, _sourceHeaderVisible[_colQPAIndex].header + ' <span class="red"> *</span>');
          }
          if (col === _colRefDesigIndex) {
            th.innerHTML = th.innerHTML.replace(_sourceHeaderVisible[_colRefDesigIndex].header, _sourceHeaderVisible[_colRefDesigIndex].header + ' <span class="red"> *</span>');
          }
          if (col === _colUOMIDIndex) {
            th.innerHTML = th.innerHTML.replace(_sourceHeaderVisible[_colUOMIDIndex].header, '<a onclick="openUrl(\'#!/unit\')" class="text-underline cursor-pointer handsontable-th-color">' + _sourceHeaderVisible[_colUOMIDIndex].header + '</a><span class="red"> *</span>');
          }
          if (col === _colMfgCodeIndex) {
            th.innerHTML = th.innerHTML.replace(_sourceHeaderVisible[_colMfgCodeIndex].header, '<a onclick="openUrl(\'#!/manufacturer\')" class="text-underline cursor-pointer handsontable-th-color">' + _sourceHeaderVisible[_colMfgCodeIndex].header + '</a><span class="red"> *</span>');
          }
          if (col === _colMfgPNIndex) {
            th.innerHTML = th.innerHTML.replace(_sourceHeaderVisible[_colMfgPNIndex].header, '<a onclick="openUrl(\'#!/component/mfg\')" class="text-underline cursor-pointer handsontable-th-color">' + _sourceHeaderVisible[_colMfgPNIndex].header + '</a><span class="red"> *</span>');
          }
          if (col === _colDistributorIndex) {
            th.innerHTML = th.innerHTML.replace(_sourceHeaderVisible[_colDistributorIndex].header, '<a onclick="openUrl(\'#!/supplier/0\')" class="text-underline cursor-pointer handsontable-th-color">' + _sourceHeaderVisible[_colDistributorIndex].header + '</a>');
          }
          if (col === _colDistPNIndex) {
            th.innerHTML = th.innerHTML.replace(_sourceHeaderVisible[_colDistPNIndex].header, '<a onclick="openUrl(\'#!/component/dist\')" class="text-underline cursor-pointer handsontable-th-color">' + _sourceHeaderVisible[_colDistPNIndex].header + '</a>');
          }
          if (col === _colMountingTypeIDIndex) {
            th.innerHTML = th.innerHTML.replace('Mounting Type', '<a onclick="openUrl(\'#!/rfqsetting/mountingtype\')" class="text-underline cursor-pointer handsontable-th-color">Mounting Type</a>');
          }
          if (col === _colFunctionalTypeIDIndex) {
            th.innerHTML = th.innerHTML.replace('Functional Type', '<a onclick="openUrl(\'#!/rfqsetting/parttype\')" class="text-underline cursor-pointer handsontable-th-color">Functional Type</a>');
          }
          if (col === _colPartPackageIndex) {
            th.innerHTML = th.innerHTML.replace('Package/Case(Shape) Type', '<a onclick="openUrl(\'#!/rfqsetting/packagecasetype\')" class="text-underline cursor-pointer handsontable-th-color">Package/Case(Shape) Type</a>');
          }
          if (col === _colPackagingIndex) {
            th.innerHTML = th.innerHTML.replace('Packaging', '<a onclick="openUrl(\'#!/rfqsetting/packagingtype\')" class="text-underline cursor-pointer handsontable-th-color">Packaging</a>');
          }

          //$timeout(() => {
          //  setHeaderStyle();
          //});
        },
        afterGetRowHeader: function (row, th) {
          th.className = 'h-row-' + row;
        },
        afterScrollHorizontally: function () {
          setHeaderStyle();
        },
        afterScrollVertically: function () {
          setHeaderStyle();
        },
        afterCreateRow: function (index, range, type) {
          let isRowAdded = false;
          let mergedCellInfo = null;
          let bomObj = null;
          /* for get new effect from handsontable
             added for Resolve issue get while addeing alternate line above when filter applied
           */
          vm.bomModel = this.getSourceData();
          if (!type || type === 'ContextMenu.rowAbove' || type === 'ContextMenu.rowBelow') {
            isRowAdded = true;
            mergedCellInfo = getMergeCellInfoByRow(index);
            bomObj = vm.bomModel[index];
            if (mergedCellInfo) {
              const lineID = vm.bomModel[mergedCellInfo.row]._lineID;
              bomObj._lineID = lineID;
            }
            if (bomObj) {
              const mainlineObj = _.find(vm.bomModel, (x) => x.lineID === bomObj._lineID);
              if (mainlineObj) {
                bomObj.isCustPN = mainlineObj.isCustPN;
              }
              bomObj.suggestedGoodPartStep = bomObj.suggestedGoodDistPartStep = bomObj.mfgGoodPartMappingStep = bomObj.distGoodPartMappingStep = bomObj.mismatchMountingTypeStep = bomObj.mismatchFunctionalCategoryStep = bomObj.isMPNAddedinCPN = true;
              bomObj.approvedMountingType = false;
            }
            // Resolve issue for row merged in case of add new row case.
            if (vm.isNewRowAdd) {
              bomObj.isNewAdd = true;
              vm.isNewRowAdd = false;
            }
            /* it create issue for all new row.(shirish) */
            // window.setTimeout(mergeCommonCells);
          }
          else if (_hotRegisterer && _hotRegisterer.isEmptyRow(index) && index < (vm.bomModel.length - 1)) {
            isRowAdded = true;
            bomObj = vm.bomModel[index];
            if (bomObj) {
              bomObj.suggestedGoodPartStep = bomObj.suggestedGoodDistPartStep = bomObj.mfgGoodPartMappingStep = bomObj.distGoodPartMappingStep = bomObj.mismatchMountingTypeStep = bomObj.mismatchFunctionalCategoryStep = bomObj.isMPNAddedinCPN = true;
              bomObj.approvedMountingType = false;
              mergedCellInfo = getMergeCellInfoByRow(index);
              bomObj.isNewAdd = true;
            }
          }

          if (isRowAdded) {
            vm.isBOMChanged = BOMFactory.isBOMChanged = true;
            BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];

            if (bomObj) {
              if (!bomObj._lineID || !mergedCellInfo) {
                bomObj.isInstall = bomObj.isInstall === undefined || bomObj.isInstall === null ? true : bomObj.isInstall;
                bomObj.isPurchase = bomObj.isPurchase === undefined || bomObj.isPurchase === null ? true : bomObj.isPurchase;
                bomObj.isBuyDNPQty = _buyDNPQTYList[0].value;
                bomObj.uomID = CORE.UOM_DEFAULTS.EACH.NAME;
                const unit = _.find(_unitList, (y) => {
                  if (y.unitName && y.unitName.toUpperCase() === bomObj.uomID.toUpperCase() || y.alias && y.alias.length > 0 && y.alias.find((x) => x.alias.toUpperCase() === bomObj.uomID.toUpperCase())) {
                    return y;
                  }
                });
                bomObj.uomID = unit ? unit.unitName : bomObj.uomID;
                bomObj.programingStatus = _programingStatusList[0].value;
                bomObj.suggestedGoodPartStep = bomObj.suggestedGoodDistPartStep = bomObj.mfgGoodPartMappingStep = bomObj.distGoodPartMappingStep = bomObj.mismatchMountingTypeStep = bomObj.mismatchFunctionalCategoryStep = bomObj.isMPNAddedinCPN = true;
                bomObj.approvedMountingType = false;
                bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
              }
              _invalidCells.forEach((item) => {
                if (item[0] >= index) {
                  item[0]++;
                }
              });
            }
          }
        },
        beforeKeyDown: function (event) {
          if (event.keyCode === 46) {
            event.stopImmediatePropagation();
          }
        },
        beforeChange: function (changes) {
          var col = changes[0][1], oldValue = changes[0][2], newValue = changes[0][3];
          if (col === 'lineID' && oldValue !== undefined && oldValue !== newValue && !vm.DecimalNmberPattern.test(newValue)) {
            const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.LINE_ITEMS_INVALID);
            const model = {
              messageContent: messgaeContent
            };
            vm.isBOMChanged = BOMFactory.isBOMChanged = true;
            BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];
            DialogFactory.messageAlertDialog(model);
            // deselected current cell so we can have a focus on pop-up element
            $timeout(() => {
              if (_hotRegisterer) {
                _hotRegisterer.deselectCell();
              }
            });
          }
        },
        afterColumnResize: function (colIndex, newWidth, isDoubleClick) {
          if (isDoubleClick) {
            $timeout(() => {
              setHeaderStyle();
            });
          }
        },
        beforeCreateRow: function () {
          if (!vm.AssyActivityStart) {
            return false;
          } else {
            return true;
          }
        }
      };

      // On load get assembly details and supplier API error
      getAssemblyComponentDetailById();
      getApierror();
      // Refresh BOM Master details
      vm.refreshBOMMaster = function () {
        vm.cgBusyLoading = $q.all([getUnits(), getRfqLineitemsHeaders(), getErrorCode(), getApiVerifiedAlternatePartsCount(), getAccessLavel(), getRoHSList(), getTypeList(), getPartTypeList(), getMountingTypeList(), getBOMProgress(), getRfqAdditionalColumnList(), getComponentInternalVersion(), getAssemblyComponentDetailById(true), getPartDynamicAttributeList(), getOddelyRefDesList()]).then((responses) => {
          var getRfqLineitemsHeadersResp = responses[1];
          if (getRfqLineitemsHeadersResp) {
            _lineItemsHeaders = getRfqLineitemsHeadersResp;
          }
          initSourceHeader(_lineItemsHeaders);
          if (_hotRegisterer) {
            _hotRegisterer.render();
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      };
      // Check feature given for suggest alternate part, Incorrect part and Suggest RoHS Replacement Part
      function getSuggestAlternatePartOnBOMStatus() {
        vm.enabledSuggestAlternatePartOnBOM = BaseService.checkFeatureRights(CORE.FEATURE_NAME.SuggestAlternatePartOnBOM);
        vm.enabledIncorrectPartOnBOM = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowIncorrectPartCreation);
        vm.enabledSuggestRoHSReplacementPartOnBOM = BaseService.checkFeatureRights(CORE.FEATURE_NAME.SuggestRoHSReplacementPartOnBOM);
      }
      // Get Oddely ref Des list
      function getOddelyRefDesList() {
        if (_partID) {
          return ComponentFactory.getOddelyRefDesList().query({ id: _partID }).$promise.then((resOddRefDes) => {
            if (resOddRefDes && resOddRefDes.data) {
              vm.oddelyRefDesList = resOddRefDes.data;
              vm.DisplayOddelyRefDes = _.map(vm.oddelyRefDesList, 'refDes');
              if (vm.DisplayOddelyRefDes.length > 0) {
                vm.RefDesTooltipwithOddely = vm.RefDesTooltip + '\nValid Oddly Named RefDes: \'' + vm.DisplayOddelyRefDes.join('\', \'') + '\'';
              } else {
                vm.RefDesTooltipwithOddely = vm.RefDesTooltip;
              }
              _refDesTooltip = '<md-icon class="icon-question-mark-circle help-icon" title="' + vm.RefDesTooltipwithOddely + '"></md-icon>';
              return vm.oddelyRefDesList;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      //Initialize function to get all details
      function init() {
        // Create dummy Event and added in _dummyEvent variable
        $timeout(() => {
          angular.element('#btndummy').triggerHandler('click');
        });

        vm.cgBusyLoading = $q.all([getRFQLineItemsByID(), getUnits(), getRfqLineitemsHeaders(), getErrorCode(), getApiVerifiedAlternatePartsCount(), getAccessLavel(), getRoHSList(), getTypeList(), getPartTypeList(), getMountingTypeList(), getBOMProgress(), getRfqAdditionalColumnList(), getComponentInternalVersion(), getFilters(), getSuggestAlternatePartOnBOMStatus(), getPartDynamicAttributeList(), getAllRFQAssemblyByPartID(), getUserBOMFiltersSequence(), getOddelyRefDesList()]).then((responses) => {
          vm.getRFQLineItemsByIDResp = responses[0];
          const getRfqLineitemsHeadersResp = responses[2];
          if (getRfqLineitemsHeadersResp) {
            _lineItemsHeaders = getRfqLineitemsHeadersResp;
          }
          if (vm.getRFQLineItemsByIDResp) {
            displayRFQLineItemsByID(vm.getRFQLineItemsByIDResp);
          }
          _.each(vm.filters, (objfilter) => {
            const objFilterOrder = _.find(vm.bomFiltersSequence, (x) => x.filterId === objfilter.id);
            if (objFilterOrder) {
              objfilter.displayOrder = objFilterOrder.displayOrder;
            }
          });

          vm.filters = _.sortBy(vm.filters, 'displayOrder');
          setFilterCount();
          initfilterautocomplete();
          vm.autoCompleteFilter.keyColumnId = vm.allFilterID;
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      }

      // Initialize Filter detail
      function initFilter() {
        return $q.all([getFilters(), getUserBOMFiltersSequence()]).then(() => {
          _.each(vm.filters, (objfilter) => {
            const objFilterOrder = _.find(vm.bomFiltersSequence, (x) => x.filterId === objfilter.id);
            if (objFilterOrder) {
              objfilter.displayOrder = objFilterOrder.displayOrder;
            }
          });
          vm.filters = _.sortBy(vm.filters, 'displayOrder');
          setFilterCount();
          return $q.resolve(vm.filters);
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      }
      // Get BOM Progress Status in percentage
      function getBOMProgress() {
        return BOMFactory.getBOMProgress().query({ id: _partID }).$promise.then((response) => {
          if (response && response.data) {
            vm.bomProgress = response.data[0].pProgress;
          }
        });
      };
      // Get BOM Additional column list
      function getRfqAdditionalColumnList() {
        return CustomerConfirmationPopupFactory.getRfqAdditionalColumnList().query({ id: _partID }).$promise.then((res) => {
          if (res && res.data) {
            vm.additoinalHeaderList = res.data;
            vm.additoinalConfiguredHeaderList = _.filter(res.data, 'isConfigured');
            _.each(vm.additoinalConfiguredHeaderList, (item) => {
              if (item.isConfigured) {
                item.isConfigured = true;
              }
            });
          }
        });
      };

      const UpdateInternalVersion = $scope.$on(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion, () => {
        getComponentInternalVersion();
        getBOMProgress();
        $scope.$applyAsync();
      });
      // Get BOM LineItems by Assembly Id
      function getRFQLineItemsByID() {
        vm.bomModel = [];
        return BOMFactory.getRFQLineItemsByID().query({
          id: _partID
        }).$promise.then((response) => {
          //If any detail of BOM is changed then update the flag
          vm.isBOMChanged = BOMFactory.isBOMChanged = false;
          BaseService.currentPageFlagForm = [];
          if (response && response.data && response.data.length) {
            $scope.$emit('bomLineItemCount', response.data.length);
            return response.data;
          }
          else {
            $scope.$emit('bomLineItemCount', 0);
            vm.isNoDataFound = true;
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
          return null;
        });
      }

      // Get RFQ Assembly list by PartID
      function getAllRFQAssemblyByPartID() {
        return BOMFactory.getAllRFQAssemblyByPartID().query({ id: _partID }).$promise.then((response) => {
          if (response && response.data) {
            vm.RFQAssemblies = response.data;
            if (vm.RFQAssemblies && vm.RFQAssemblies.length > 1) {
              vm.DisableDeleteBOM = true;
            } else if (vm.RFQAssemblies && vm.RFQAssemblies.length === 1) {
              if (vm.RFQAssemblies[0].quoteFinalStatus === vm.rfqFinalStatus.SUBMITTED.VALUE || vm.RFQAssemblies[0].quoteFinalStatus === vm.rfqFinalStatus.COMPLETED.VALUE) {
                vm.DisableDeleteBOM = true;
              }
            }
          }
        });
      }

      // Get Supplier API verified parts count
      function getApiVerifiedAlternatePartsCount() {
        if (_partID) {
          return ImportBOMFactory.getApiVerifiedAlternatePartsCount().query({
            partID: _partID
          }).$promise.then((response) => {
            if (response && response.data) {
              vm.apiVerifiedAlternatePartsCount = response.data;
            }
            else {
              vm.apiVerifiedAlternatePartsCount = 0;
            }
          }).catch((error) => {
            BaseService.getErrorLog(error);
            return null;
          });
        }
        else {
          vm.apiVerifiedAlternatePartsCount = 0;
          return null;
        }
      }

      // Initialize handsontable header and data bind in handsontable data list
      function displayRFQLineItemsByID(lineItemModel, isFilter) {
        $scope.loaderVisible = true;
        initSourceHeader(_lineItemsHeaders);
        generateModelFromDB(lineItemModel);
        //  if filter is applied then we are manually merging cells so do not run this code
        if (isFilter !== false) {
          vm.isNoDataFound = false;
          mergeCommonCells();
        }
        else {
          // if filter is applied then clear all invalid cells details
          _invalidCells = [];
          setHeaderStyle();
        }

        setContextMenuSubItems();
        //setFilterCount();
        if (_hotRegisterer) {
          _hotRegisterer.render();
        }
        // set height to the handson table container
        window.setTimeout(setHandsontableHeight);
      }

      // Create model from array
      function generateModelFromDB(uploadedBOM) {
        var i = 0;
        var len = uploadedBOM.length;
        vm.refBomModel = [];
        // loop through excel data and bind into model
        for (i, len; i < len; i++) {
          const modelRow = uploadedBOM[i];

          modelRow._lineID = modelRow.lineID;
          modelRow.isInstall = modelRow.isInstall === 1 || modelRow.isInstall === true ? true : false;
          modelRow.isPurchase = modelRow.isPurchase === 1 || modelRow.isPurchase === true ? true : false;
          modelRow.isNotRequiredKitAllocation = modelRow.isNotRequiredKitAllocation === 1 || modelRow.isNotRequiredKitAllocation === true ? true : false;
          modelRow.isSupplierToBuy = modelRow.isSupplierToBuy === 1 || modelRow.isSupplierToBuy === true ? true : false;
          modelRow.approvedMountingType = modelRow.approvedMountingType === 1 || modelRow.approvedMountingType === true ? true : false;
          modelRow.isBuyDNPQty = modelRow.isBuyDNPQty ? modelRow.isBuyDNPQty : _buyDNPQTYList[0].value;
          modelRow.isUnlockCustomerBOMLine = modelRow.isUnlockCustomerBOMLine || false;
          const lineErrorArr = modelRow.description ? modelRow.description.split('\n') : [];
          lineErrorArr.forEach((err) => {
            var match = err.match(/(.*?:)/);
            if (!match) {
              return true;
            }

            const errorCode = (match[0]).slice(0, -1);
            if (_qpaDesignatorError.errorCode === errorCode || _duplicateRefDesError.errorCode === errorCode || _invalidRefDesError.errorCode === errorCode) {
              if (modelRow.qpaDesignatorStepError) {
                modelRow.qpaDesignatorStepError += ('\n' + err);
              } else {
                modelRow.qpaDesignatorStepError = err;
              }
            }
            else if (_lineMergeError.errorCode === errorCode) {
              modelRow.lineMergeStepError = err;
            } else if (_customerApprovalForQPAREFDESError.errorCode === errorCode) {
              modelRow.customerApprovalForQPAREFDESError = err;
            } else if (_customerApprovalForBuyError.errorCode === errorCode) {
              modelRow.customerApprovalForBuyError = err;
            } else if (_customerApprovalForDNPQPAREFDESError.errorCode === errorCode) {
              modelRow.customerApprovalForDNPQPAREFDESError = err;
            } else if (_customerApprovalForDNPBuyError.errorCode === errorCode) {
              modelRow.customerApprovalForDNPBuyError = err;
            } else if (_customerApprovalForPopulateError.errorCode === errorCode) {
              modelRow.customerApprovalForPopulateError = err;
            } else if (_dnpQPARefDesError.errorCode === errorCode) {
              modelRow.dnpQPARefDesError = err;
            } else if (_customerApprovalForDNPQPAREFDESError.errorCode === errorCode) {
              modelRow.customerApprovalForDNPQPAREFDESError = err;
            } else if (_dnpInvalidREFDESError.errorCode === errorCode) {
              modelRow.dnpQPARefDesError = err;
            } else if (_dnpQPAREFDESChangeError.errorCode === errorCode) {
              modelRow.dnpQPARefDesError = err;
            } else if (_QPAREFDESChangeError.errorCode === errorCode) {
              modelRow.qpaDesignatorStepError = err;
            }
          });

          const alternatePartErrorArr = modelRow.descriptionAlternate ? modelRow.descriptionAlternate.split('\n') : [];
          alternatePartErrorArr.forEach((err) => {
            var match = err.match(/(.*?:)/);
            if (!match) {
              return true;
            }
            const errorCodeAlternate = (match[0]).slice(0, -1);
            if (errorCodeAlternate) {
              if (_mfgInvalidError.errorCode === errorCodeAlternate) {
                modelRow.mfgCodeStepError = err;
              } else if (_mfgVerificationError.errorCode === errorCodeAlternate) {
                modelRow.mfgVerificationStepError = err;
              } else if (_distInvalidError.errorCode === errorCodeAlternate) {
                modelRow.distCodeStepError = err;
              } else if (_distVerificationError.errorCode === errorCodeAlternate) {
                modelRow.distVerificationStepError = err;
              } else if (_getMFGPNError.errorCode === errorCodeAlternate) {
                modelRow.getMFGPNStepError = err;
              } else if (_obsoletePartError.errorCode === errorCodeAlternate) {
                modelRow.obsoletePartStepError = err;
              } else if (_mfgGoodPartMappingError.errorCode === errorCodeAlternate) {
                modelRow.mfgGoodPartMappingStepError = err;
              } else if (_suggestedGoodPartError.errorCode === errorCodeAlternate) {
                modelRow.suggestedGoodPartError = err;
              } else if (_suggestedGoodDistPartError.errorCode === errorCodeAlternate) {
                modelRow.suggestedGoodDistPartError = err;
              } else if (_distGoodPartMappingError.errorCode === errorCodeAlternate) {
                modelRow.distGoodPartMappingStepError = err;
              } else if (_mfgDistMappingError.errorCode === errorCodeAlternate) {
                modelRow.mfgDistMappingStepError = err;
              } else if (_mfgPNInvalidError.errorCode === errorCodeAlternate) {
                modelRow.mfgPNStepError = err;
              } else if (_distPNInvalidError.errorCode === errorCodeAlternate) {
                modelRow.distPNStepError = err;
              } else if (_customerApprovalError.errorCode === errorCodeAlternate) {
                modelRow.customerApprovalStepError = err;
              } else if (_rohsStatusError.errorCode === errorCodeAlternate) {
                modelRow.nonRohsStepError = err;
              } else if (_invalidConnectorTypeError.errorCode === errorCodeAlternate) {
                modelRow.invalidConnectorTypeError = err;
              } else if (_mismatchNumberOfRowsError.errorCode === errorCodeAlternate) {
                modelRow.mismatchNumberOfRowsError = err;
              } else if (_epoxyError.errorCode === errorCodeAlternate) {
                modelRow.epoxyStepError = err;
              } else if (_duplicateMPNInSameLineError.errorCode === errorCodeAlternate) {
                modelRow.duplicateMPNInSameLineError = err;
              } else if (_matingPartRequiredError.errorCode === errorCodeAlternate) {
                modelRow.matingPartRequiredError = err;
              } else if (_driverToolsRequiredError.errorCode === errorCodeAlternate) {
                modelRow.driverToolsRequiredError = err;
              } else if (_pickupPadRequiredError.errorCode === errorCodeAlternate) {
                modelRow.pickupPadRequiredError = err;
              } else if (_functionalTestingRequiredError.errorCode === errorCodeAlternate) {
                modelRow.functionalTestingRequiredError = err;
              } else if (_restrictUseWithPermissionError.errorCode === errorCodeAlternate && !modelRow.restrictUseWithPermissionStep) {
                modelRow.restrictUseWithPermissionError = err;
              } else if (_restrictUsePermanentlyError.errorCode === errorCodeAlternate && !modelRow.restrictUsePermanentlyStep) {
                modelRow.restrictUsePermanentlyError = err;
              } else if (_mismatchMountingTypeError.errorCode === errorCodeAlternate && (!modelRow.mismatchMountingTypeStep || modelRow.approvedMountingType)) {
                modelRow.mismatchMountingTypeError = err;
              } else if (_mismatchRequiredProgrammingError.errorCode === errorCodeAlternate && !modelRow.mismatchRequiredProgrammingStep) {
                modelRow.mismatchRequiredProgrammingError = err;
              } else if (_mismatchProgrammingStatusError.errorCode === errorCodeAlternate && !modelRow.mismatchProgrammingStatusStep) {
                modelRow.mismatchProgrammingStatusError = err;
              } else if (_mappingPartProgramError.errorCode === errorCodeAlternate && !modelRow.mappingPartProgramStep) {
                modelRow.mappingPartProgramError = err;
              } else if (_mismatchFunctionalCategoryError.errorCode === errorCodeAlternate && !modelRow.mismatchFunctionalCategoryStep) {
                modelRow.mismatchFunctionalCategoryError = err;
              } else if (_mismatchCustomPartError.errorCode === errorCodeAlternate && !modelRow.mismatchCustomPartStep) {
                modelRow.mismatchCustomPartError = err;
              } else if (_mismatchPitchError.errorCode === errorCodeAlternate) {
                modelRow.mismatchPitchError = err;
              } else if (_mismatchToleranceError.errorCode === errorCodeAlternate) {
                modelRow.mismatchToleranceError = err;
              } else if (_mismatchVoltageError.errorCode === errorCodeAlternate) {
                modelRow.mismatchVoltageError = err;
              } else if (_mismatchPackageError.errorCode === errorCodeAlternate) {
                modelRow.mismatchPackageError = err;
              } else if (_mismatchValueError.errorCode === errorCodeAlternate) {
                modelRow.mismatchValueError = err;
              } else if (_requireMountingTypeError.errorCode === errorCodeAlternate) {
                modelRow.requireMountingTypeError = err;
              } else if (_requireFunctionalTypeError.errorCode === errorCodeAlternate) {
                modelRow.requireFunctionalTypeError = err;
              } else if (_uomMismatchedError.errorCode === errorCodeAlternate) {
                modelRow.uomMismatchedError = err;
              } else if (_programingRequiredError.errorCode === errorCodeAlternate) {
                modelRow.programingRequiredError = err;
              } else if (_mismatchColorError.errorCode === errorCodeAlternate) {
                modelRow.mismatchColorError = err;
              } else if (_restrictUseInBOMError.errorCode === errorCodeAlternate) {
                modelRow.restrictUseInBOMError = err;
              } else if (_partPinIsLessthenBOMPinError.errorCode === errorCodeAlternate) {
                modelRow.partPinIsLessthenBOMPinError = err;
              } else if (_tbdPartError.errorCode === errorCodeAlternate) {
                modelRow.tbdPartError = err;
              } else if (_restrictCPNUseWithPermissionError.errorCode === errorCodeAlternate) {
                modelRow.restrictCPNUseWithPermissionError = err;
              } else if (_restrictCPNUsePermanentlyError.errorCode === errorCodeAlternate) {
                modelRow.restrictCPNUsePermanentlyError = err;
              } else if (_restrictCPNUseInBOMError.errorCode === errorCodeAlternate) {
                modelRow.restrictCPNUseInBOMError = err;
              } else if (_exportControlledError.errorCode === errorCodeAlternate) {
                modelRow.exportControlledError = err;
              } else if (_restrictUseInBOMWithPermissionError.errorCode === errorCodeAlternate) {
                modelRow.restrictUseInBOMWithPermissionError = err;
              } else if (_unknownPartError.errorCode === errorCodeAlternate) {
                modelRow.unknownPartError = err;
              } else if (_defaultInvalidMFRError.errorCode === errorCodeAlternate) {
                modelRow.defaultInvalidMFRError = err;
              } else if (_restrictUseInBOMExcludingAliasError.errorCode === errorCodeAlternate) {
                modelRow.restrictUseInBOMExcludingAliasError = err;
              } else if (_restrictUseInBOMExcludingAliasWithPermissionError.errorCode === errorCodeAlternate) {
                modelRow.restrictUseInBOMExcludingAliasWithPermissionError = err;
              } else if (_restrictUseExcludingAliasError.errorCode === errorCodeAlternate && !modelRow.restrictUseExcludingAliasStep) {
                modelRow.restrictUseExcludingAliasError = err;
              } else if (_restrictUseExcludingAliasWithPermissionError.errorCode === errorCodeAlternate && !modelRow.restrictUseExcludingAliasWithPermissionStep) {
                modelRow.restrictUseExcludingAliasWithPermissionError = err;
              } else if (_mismatchCustpartRevError.errorCode === errorCodeAlternate && !modelRow.mismatchCustpartRevStep) {
                modelRow.mismatchCustpartRevError = err;
              } else if (_mismatchCPNandCustpartRevError.errorCode === errorCodeAlternate && !modelRow.mismatchCPNandCustpartRevStep) {
                modelRow.mismatchCPNandCustpartRevStepError = err;
              }
            }
          });
          if (modelRow.mfgPN && modelRow.mfgPN.toUpperCase() === vm.NotComponentPart.toUpperCase()) {
            modelRow.isPurchase = false;
            modelRow.isBuyDNPQty = _buyDNPQTYList[0].value;
            modelRow.isBuyDisable = true;
            const buyDisableDBData = _.filter(uploadedBOM, { '_lineID': modelRow._lineID });
            _.map(buyDisableDBData, (data) => { data.isBuyDisable = true; });
            const buyDisableModelData = _.filter(vm.refBomModel, { '_lineID': modelRow._lineID });
            _.map(buyDisableModelData, (data) => { data.isBuyDisable = true; });
          }

          // bind Customer Approval Comment
          bindCustomerApprovedComments(modelRow);
          qpaDesignatorStepFn(modelRow, i);
          dnpqpaDesignatorStepFn(modelRow, i);
          cpnDuplicateStepFn(modelRow, i);
          populateStepFn(modelRow, i);
          buyStepFn(modelRow, i);
          mfgVerificationStepFn(modelRow, i);
          distVerificationStepFn(modelRow, i);
          vm.refBomModel.push(modelRow);
        };
        vm.copyRefBomModel = angular.copy(vm.refBomModel);
        //Code removed from loop and added outside loop
        $timeout(() => {
          setHeaderStyle();
          if (vm.refBomModel && vm.refBomModel.length > 0) {
            const bomObj = _.head(vm.refBomModel);
            vm.calculateAssemblyLevelErrorCount(bomObj);
          }
          initRefBomModelWatch();
        });
        //if (!vm.isBOMReadOnly)
        updateCloneObject(false);
      }

      const initRefBomModelWatch = () => {
        // Code to set isUpdate as true on each items if any field is changed
        $scope.$watch('vm.refBomModel', (newVal, oldVal) => {
          if (_hotRegisterer) {
            if (newVal && oldVal && newVal.length && oldVal.length) {
              newVal.forEach((newBomObj, index) => {
                if (!newBomObj.id || !newBomObj.rfqAlternatePartID || newBomObj.isUpdate) {
                  return;
                }
                const oldBomObj = _.find(oldVal, { rfqAlternatePartID: newBomObj.rfqAlternatePartID });

                if (oldBomObj) {
                  const mergedCellInfo = getMergeCellInfoByRow(index);
                  const isMainRow = (mergedCellInfo && mergedCellInfo.row === index) || !mergedCellInfo;
                  if (isMainRow) {
                    for (let i = 0, len = lineItemFields.length; i < len; i++) {
                      const prop = lineItemFields[i];
                      if ((newBomObj[prop] !== undefined && oldBomObj[prop] !== undefined) && ((newBomObj[prop] === true ? 1 : newBomObj[prop]) !== (oldBomObj[prop] === true ? 1 : oldBomObj[prop]))) {
                        newBomObj.isUpdate = true;
                        vm.isBOMChanged = BOMFactory.isBOMChanged = true;
                        BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];
                        break;
                      }
                    }
                  }

                  for (let i = 0, len = alternateLineItemFields.length; i < len; i++) {
                    const prop = alternateLineItemFields[i];
                    if ((newBomObj[prop] !== undefined && oldBomObj[prop] !== undefined) && ((newBomObj[prop] === true ? 1 : newBomObj[prop]) !== (oldBomObj[prop] === true ? 1 : oldBomObj[prop]))) {
                      newBomObj.isUpdate = true;
                      vm.isBOMChanged = BOMFactory.isBOMChanged = true;
                      BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];
                      break;
                    }
                  }
                }
              });
            }
          }
        }, true);
      }

      //Watch created for Loader
      $scope.$watch('loaderVisible', (newValue) => {
        if (newValue) {
          vm.timeoutWatch = $timeout(() => {
            /*max time to show infinite loader*/
          }, _configMaxTimeout);
          vm.cgBusyLoading = vm.timeoutWatch;
        }
        else {
          if (vm.timeoutWatch) {
            $timeout.cancel(vm.timeoutWatch);
          }
        }
      });
      // Create customer or engineer approved comment as per format
      function bindCustomerApprovedComments(bomObj) {
        bomObj.customerApprovalComment = '<ul>' + ((bomObj.qpaCustomerApprovalComment ? stringFormat(CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALDISPLAYFORMAT, bomObj.qpaCustomerApprovalComment, bomObj.isCustomerApprovedQPA ? CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVEDNAME : CORE.MESSAGE_CONSTANT.ENGINEERAPPROVEDNAME) : '') +
          (bomObj.dnpqpaCustomerApprovalComment ? stringFormat(CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALDISPLAYFORMAT, bomObj.dnpqpaCustomerApprovalComment, bomObj.isCustomerApprovedDNPQPA ? CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVEDNAME : CORE.MESSAGE_CONSTANT.ENGINEERAPPROVEDNAME) : '') +
          (bomObj.buyCustomerApprovalComment ? stringFormat(CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALDISPLAYFORMAT, bomObj.buyCustomerApprovalComment, bomObj.isCustomerApprovedBuy ? CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVEDNAME : CORE.MESSAGE_CONSTANT.ENGINEERAPPROVEDNAME) : '') +
          (bomObj.buyDNPCustomerApprovalComment ? stringFormat(CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALDISPLAYFORMAT, bomObj.buyDNPCustomerApprovalComment, bomObj.isCustomerApprovedBuyDNP ? CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVEDNAME : CORE.MESSAGE_CONSTANT.ENGINEERAPPROVEDNAME) : '') +
          (bomObj.populateCustomerApprovalComment ? stringFormat(CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALDISPLAYFORMAT, bomObj.populateCustomerApprovalComment, bomObj.isCustomerApprovedPopulate ? CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVEDNAME : CORE.MESSAGE_CONSTANT.ENGINEERAPPROVEDNAME) : '') +
          (bomObj.cpnCustomerApprovalComment ? stringFormat(CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALDISPLAYFORMAT, bomObj.cpnCustomerApprovalComment, bomObj.isCustomerApprovedCPN ? CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVEDNAME : CORE.MESSAGE_CONSTANT.ENGINEERAPPROVEDNAME) : '') +
          (bomObj.partCustomerApprovalComment ? stringFormat(CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALDISPLAYFORMAT, bomObj.partCustomerApprovalComment, bomObj.isCustomerApprovedPart ? CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVEDNAME : CORE.MESSAGE_CONSTANT.ENGINEERAPPROVEDNAME) : '') +
          (bomObj.kitAllocationNotRequiredComment && bomObj.isNotRequiredKitAllocation ? stringFormat(CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALDISPLAYFORMAT, bomObj.kitAllocationNotRequiredComment, bomObj.isNotRequiredKitAllocationApproved ? CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVEDNAME : CORE.MESSAGE_CONSTANT.ENGINEERAPPROVEDNAME) : '') +
          (bomObj.ApprovedMountingTypeComment ? bomObj.ApprovedMountingTypeComment : '')) + '</ul>';
      }

      // get RoHS List
      function getRoHSList() {
        return MasterFactory.getRohsList().query().$promise.then((requirement) => {
          vm.RohsList = requirement.data;
          _.each(vm.RohsList, (item) => {
            vm.RoHSMapping = [];
            UpdateRoHSMapping(item, false);
            item.RoHSMapping = _.uniq(vm.RoHSMapping);
          });
          return requirement.data;
        }).catch((error) => BaseService.getErrorLog(error));
      }
      // Update RoHS Mapping for check validation on BOM tab as per Parent and Peer RoHS
      function UpdateRoHSMapping(rohs, fromParent) {
        vm.RoHSMapping.push(rohs.id);
        if (!fromParent) {
          vm.RoHSMapping = _.concat(vm.RoHSMapping, _.map(rohs.referenceRoHS, 'rohsPeerID'));
        }
        if (rohs && !rohs.refParentID) {
          return vm.RoHSMapping;
        }
        else {
          vm.RoHSMapping.push(rohs.refParentID);
          const parentRoHS = _.find(vm.RohsList, { id: rohs.refParentID });
          UpdateRoHSMapping(parentRoHS, true);
        }
      }

      // get Operational Attribute List
      function getPartDynamicAttributeList() {
        return ComponentFactory.getPartDynamicAttributeList().query().$promise.then((requirement) => {
          vm.attributeList = requirement.data;
          return requirement.data;
        }).catch((error) => BaseService.getErrorLog(error));
      }

      // Get unit list to bind into cell dropdown
      function getUnits() {
        return MasterFactory.getUOMsList().query().$promise.then((response) => {
          if (response && response.data) {
            _unitList = _.filter(response.data, (x) => parseInt(x.id) !== 0);
            return _unitList;
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
          return null;
        });
      }

      // Get Filters list to bind into filter dropdown
      function getFilters() {
        return MasterFactory.getFilters().query().$promise.then((response) => {
          if (response && response.data) {
            const bomFilters = response.data;
            vm.filters = [];
            vm.allFilterID = _.find(bomFilters, { filterCode: 'ALL' }).filterCode;
            vm.selectedFilter = vm.allFilterID;
            vm.selectedFilterNameWithCount = vm.allFilterID;
            _.each(bomFilters, (value) => {
              value.filterCount = 0;
              vm.filters.push(value);
            });
          }
          return $q.resolve(vm.filters);
        }).catch((error) => {
          BaseService.getErrorLog(error);
          return null;
        });
      }

      function initfilterautocomplete() {
        vm.autoCompleteFilter = {
          columnName: 'filternamtewithCount',
          keyColumnName: 'filterCode',
          keyColumnId: null,
          inputName: 'AutocompleteFilter',
          placeholderName: 'AutocompleteFilter',
          callbackFn: initFilter,
          onSelectCallbackFn: function (item) {
            vm.onFilterClick(true, item);
          }
        };
      }

      // Get current login user wise BOM Filters Sequence
      function getUserBOMFiltersSequence() {
        return ImportBOMFactory.getUserBOMFiltersSequence().query().$promise.then((resBOMFilterSequence) => {
          if (resBOMFilterSequence && resBOMFilterSequence.data) {
            vm.bomFiltersSequence = resBOMFilterSequence.data;
          }
          return $q.resolve(vm.bomFiltersSequence);
        }).catch((error) => {
          BaseService.getErrorLog(error);
          return null;
        });
      }

      // Get part category master list
      function getTypeList() {
        return MasterFactory.getPartCategoryMstList().query().$promise.then((response) => {
          if (response && response.data) {
            _typeList = response.data.map((item) => ({ id: item.id, Value: item.categoryName }));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

      /* Part Types dropdown fill up */
      function getPartTypeList() {
        return ComponentFactory.getPartTypeList().query().$promise.then((res) => {
          _partTypeList = res.data;
          return res.data;
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* mountingType dropdown fill up */
      function getMountingTypeList() {
        return ComponentFactory.getMountingTypeList().query().$promise.then((res) => {
          _mountingTypeList = res.data;
          return res.data;
        }).catch((error) => BaseService.getErrorLog(error));
      };
      // Get BOM Header
      function getRfqLineitemsHeaders() {
        return ImportBOMFactory.getRfqLineitemsHeaders().query({
        }).$promise.then((response) => {
          if (response && response.data && response.data.length) {
            return response.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      // Get Error Code list
      function getErrorCode() {
        return ImportBOMFactory.getErrorCode().query({
        }).$promise.then((response) => {
          if (response && response.data) {
            _errorCodeList = response.data;

            // Pre-bind all error object on load
            _logicCategoryDropdown.forEach((item) => {
              var obj = _.find(_errorCodeList, (obj) => obj.logicID === item.id);

              if (obj) {
                switch (item.value) {
                  case vm.LogicCategoryDropdownDet[1]: {
                    _qpaDesignatorError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[2]: {
                    _mfgInvalidError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[3]: {
                    _mfgVerificationError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[4]: {
                    _distVerificationError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[5]: {
                    _mfgDistMappingError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[6]: {
                    _getMFGPNError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[7]: {
                    _mfgGoodPartMappingError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[8]: {
                    _obsoletePartError = obj;
                    _obsoleteColor = _obsoletePartError.errorColor;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[9]: {
                    _mfgPNInvalidError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[10]: {
                    _distInvalidError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[11]: {
                    _distPNInvalidError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[12]: {
                    //obj.priority = 1;
                    _customerApprovalError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[13]: {
                    _distGoodPartMappingError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[14]: {
                    _lineMergeError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[15]: {
                    _rohsStatusError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[16]: {
                    _epoxyError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[17]: {
                    _duplicateRefDesError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[18]: {
                    _invalidRefDesError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[20]: {
                    _invalidConnectorTypeError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[21]: {
                    _duplicateMPNInSameLineError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[22]: {
                    _matingPartRequiredError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[23]: {
                    _driverToolsRequiredError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[24]: {
                    _pickupPadRequiredError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[25]: {
                    _restrictUseWithPermissionError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[26]: {
                    _restrictUsePermanentlyError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[27]: {
                    _mismatchMountingTypeError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[28]: {
                    _mismatchFunctionalCategoryError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[29]: {
                    _mismatchPitchError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[30]: {
                    _mismatchToleranceError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[31]: {
                    _mismatchVoltageError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[32]: {
                    _mismatchPackageError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[33]: {
                    _mismatchValueError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[35]: {
                    _functionalTestingRequiredError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[36]: {
                    _requireMountingTypeError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[37]: {
                    _requireFunctionalTypeError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[39]: {
                    _uomMismatchedError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[40]: {
                    _programingRequiredError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[41]: {
                    _mismatchColorError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[50]: {
                    _restrictUseInBOMError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[51]: {
                    _customerApprovalForQPAREFDESError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[52]: {
                    _customerApprovalForBuyError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[53]: {
                    _customerApprovalForPopulateError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[54]: {
                    _mismatchNumberOfRowsError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[55]: {
                    _partPinIsLessthenBOMPinError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[56]: {
                    _tbdPartError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[57]: {
                    _restrictCPNUseWithPermissionError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[58]: {
                    _restrictCPNUsePermanentlyError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[59]: {
                    _restrictCPNUseInBOMError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[60]: {
                    _exportControlledError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[61]: {
                    _restrictUseInBOMWithPermissionError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[62]: {
                    _unknownPartError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[63]: {
                    _defaultInvalidMFRError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[64]: {
                    _restrictUseInBOMExcludingAliasWithPermissionError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[65]: {
                    _restrictUseInBOMExcludingAliasError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[66]: {
                    _restrictUseExcludingAliasError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[67]: {
                    _restrictUseExcludingAliasWithPermissionError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[68]: {
                    _dnpQPARefDesError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[69]: {
                    _customerApprovalForDNPQPAREFDESError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[70]: {
                    _customerApprovalForDNPBuyError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[71]: {
                    _dnpInvalidREFDESError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[72]: {
                    _suggestedGoodPartError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[73]: {
                    _suggestedGoodDistPartError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[74]: {
                    _mismatchRequiredProgrammingError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[75]: {
                    _mismatchCustomPartError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[76]: {
                    _mappingPartProgramError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[77]: {
                    _suggestMFRMappingError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[78]: {
                    _suggestAlternatePartError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[79]: {
                    _suggestPackagingPartError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[80]: {
                    _suggestProcessMaterialPartError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[81]: {
                    _suggestRoHSReplacementPartError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[82]: {
                    _mismatchProgrammingStatusError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[83]: {
                    _QPAREFDESChangeError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[84]: {
                    _dnpQPAREFDESChangeError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[85]: {
                    _MPNNotAddedinCPNError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[86]: {
                    _mismatchCustpartRevError = obj;
                    break;
                  }
                  case vm.LogicCategoryDropdownDet[87]: {
                    _mismatchCPNandCustpartRevError = obj;
                    break;
                  }
                }
              }
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      // Get BOM Assembly Details by Assembly ID
      function getAssemblyComponentDetailById(isNotRefereshDet) {
        return MasterFactory.getAssemblyComponentDetailById().query({ id: _partID }).$promise.then((response) => {
          if (response && response.data) {
            vm.rfqAssyBOMModel = response.data;
            //---------------------- Part Attribute ------------------
            // vm.APIVerifiedFlag = External call for get part details which available in BOM but not in part master.
            vm.APIVerifiedFlag = vm.rfqAssyBOMModel && vm.rfqAssyBOMModel.componentbomSetting && vm.rfqAssyBOMModel.componentbomSetting[0].exteranalAPICallStatus; // Move to part level (Confirmation pending)
            //vm.isBOMVerified = we use for clean BOM
            vm.isBOMVerified = vm.rfqAssyBOMModel && vm.rfqAssyBOMModel.componentbomSetting && vm.rfqAssyBOMModel.componentbomSetting[0].isBOMVerified; // Move to part level
            _isAssyRoHS = vm.rfqAssyBOMModel.rfq_rohsmst ? vm.rfqAssyBOMModel.rfq_rohsmst.refMainCategoryID === vm.RoHSMainCategory.RoHS ? true : false : false;
            vm.AssyRoHSStatusID = vm.rfqAssyBOMModel.RoHSStatusID;
            vm.cutomerID = vm.rfqAssyBOMModel.mfgcodeID;
            vm.AssyRoHSMainCategory = vm.rfqAssyBOMModel.rfq_rohsmst ? vm.rfqAssyBOMModel.rfq_rohsmst.refMainCategoryID : vm.RoHSMainCategory.NotApplicable;
            vm.AssyRoHSDeviation = vm.rfqAssyBOMModel.rohsDeviation || vm.RoHSDeviationDet.Yes;
            vm.AssyActivityStart = (vm.rfqAssyBOMModel && vm.rfqAssyBOMModel.componentbomSetting && vm.rfqAssyBOMModel.componentbomSetting[0].isActivityStart) || false;
            vm.AssyActivityStartedBy = (vm.rfqAssyBOMModel && vm.rfqAssyBOMModel.componentbomSetting && vm.rfqAssyBOMModel.componentbomSetting[0].activityStartBy) ? vm.rfqAssyBOMModel.componentbomSetting[0].activityStartBy : 1;
            vm.AssyLock = (vm.rfqAssyBOMModel && vm.rfqAssyBOMModel.componentbomSetting && vm.rfqAssyBOMModel.componentbomSetting[0].bomLock) || false;
            if (vm.rfqAssyBOMModel.componentbomSetting && vm.rfqAssyBOMModel.componentbomSetting[0].user) {
              vm.AssyActivityStartedByUserName = `${vm.rfqAssyBOMModel.componentbomSetting[0].user.firstName} ${vm.rfqAssyBOMModel.componentbomSetting[0].user.lastName}`;
            }
            vm.AssyActivityStartedAt = BaseService.getUIFormatedDateTimeInCompanyTimeZone(((vm.rfqAssyBOMModel && vm.rfqAssyBOMModel.componentbomSetting && vm.rfqAssyBOMModel.componentbomSetting[0].activityStartAt) || null), vm.FullDateTimeFormat);
            //if (vm.rfqAssyBOMModel.TotalConsumptionTime >= 0) {
            vm.stopTimer();
            vm.startTimer(vm.rfqAssyBOMModel);
            //}
            vm.isBOMReadOnly = true;
            if (vm.AssyActivityStart && vm.loginUserId === vm.AssyActivityStartedBy) {
              vm.isBOMReadOnly = false;
            }
            vm.PIDCode = vm.rfqAssyBOMModel.PIDCode;
            vm.mfgPN = vm.rfqAssyBOMModel.mfgPN;
            vm.mfgPNwithOutSpacialChar = vm.rfqAssyBOMModel.mfgPNwithOutSpacialChar;
            vm.mfg = vm.rfqAssyBOMModel.mfgCodemst ? vm.rfqAssyBOMModel.mfgCodemst.mfgCode : null;
            vm.Rev = vm.rfqAssyBOMModel.rev;
            // Check certificate standard type
            // it is use for assembly required functional type
            _componentRequireFunctionalType = [];
            if (vm.rfqAssyBOMModel.functionalTypePartRequired) {
              _componentRequireFunctionalType = _.map(vm.rfqAssyBOMModel.component_requirefunctionaltype, (item) => ({ id: item.partTypeID, name: item.rfq_parttypemst.partTypeName }));
            }
            // it is use for assembly required mounting type
            _componentRequireMountingType = [];
            if (vm.rfqAssyBOMModel.mountingTypePartRequired) {
              _componentRequireMountingType = _.map(vm.rfqAssyBOMModel.component_requiremountingtype, (item) => ({ id: item.partTypeID, name: item.rfq_mountingtypemst.name }));
            }
            if (vm.refBomModel && vm.refBomModel.length > 0) {
              assemblyLevelErrorUpdate();
              const bomObj = _.head(vm.refBomModel);
              vm.calculateAssemblyLevelErrorCount(bomObj);
            }
            // ------------ RFQ Assembly Attribute -----------------
            if (vm.rfqAssyBOMModel && vm.rfqAssyBOMModel.rfqAssemblies && vm.rfqAssyBOMModel.rfqAssemblies.length > 0) {
              let rfqAssemblyDetails = {};
              if (_rfqAssyID) {
                rfqAssemblyDetails = _.find(vm.rfqAssyBOMModel.rfqAssemblies, { id: _rfqAssyID });
              }
              else {
                rfqAssemblyDetails = _.head(vm.rfqAssyBOMModel.rfqAssemblies);
                _rfqAssyID = rfqAssemblyDetails.id;
              }
              vm.readyForPricingRFQList = _.filter(vm.rfqAssyBOMModel.rfqAssemblies, (data) => data.isReadyForPricing && data.id === _rfqAssyID);
              if ((rfqAssemblyDetails && rfqAssemblyDetails.id !== _rfqAssyID) || !rfqAssemblyDetails) {
                vm.isSubAssembly = true;
              }
            }
            else if (_rfqAssyID) {
              vm.readyForPricingRFQList = [];
              vm.isSubAssembly = true;
            } else {
              _rfqAssyID = 0;
              vm.isSubAssembly = true;
              vm.readyForPricingRFQList = [];
            }
            if (!isNotRefereshDet) {
              init();
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // get Component Internal Version
      function getComponentInternalVersion() {
        if (_partID) {
          MasterFactory.getComponentInternalVersion().query({ id: _partID }).$promise.then((requirement) => {
            if (requirement && requirement.data && requirement.data.liveVersion) {
              vm.liveInternalVersion = requirement.data.liveVersion;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      // Initialize BOM Header
      function initSourceHeader(headersArr) {
        // Add hidden columns into so we can generate model based on source header
        vm.sourceHeader = [{
          field: 'id',
          header: 'id',
          hidden: true
        },
        {
          field: 'rfqAlternatePartID',
          header: 'rfqAlternatePartID',
          hidden: true
        },
        {
          field: '_lineID',
          header: '_lineID',
          hidden: true
        },
        {
          field: 'mergeLines',
          header: 'Merged Item',
          hidden: true
        },
        {
          field: 'ltbDate',
          header: 'LTB Date',
          hidden: true
        },
        {
          field: 'suggestedPart',
          header: 'Suggested Part',
          hidden: true
        },
        {
          field: 'duplicateLineID',
          header: 'Duplicate LineID',
          hidden: true
        },
        {
          field: 'duplicateRefDesig',
          header: 'Duplicate ' + vm.LabelConstantBOM.REF_DES,
          hidden: true
        },
        {
          field: 'refDesigCount',
          header: vm.LabelConstantBOM.REF_DES + ' Count',
          hidden: true
        },
        {
          field: 'dnpDesigCount',
          header: vm.LabelConstantBOM.DNP_REF_DES + ' Count',
          hidden: true
        },
        {
          field: 'partRoHSStatus',
          header: 'Part RoHS Status',
          hidden: true
        },
        {
          field: 'assyRoHSStatus',
          header: 'Assy RoHS Status',
          hidden: true
        },
        {
          field: 'invalidDNPREFDES',
          header: 'Invalid ' + vm.LabelConstantBOM.DNP_REF_DES,
          hidden: true
        },
        {
          field: 'invalidRefDesig',
          header: 'Invalid ' + vm.LabelConstantBOM.REF_DES,
          hidden: true
        },
        {
          field: 'aliasMFGPN',
          header: 'Distributor Alias',
          hidden: true
        },
        {
          field: 'connectorType',
          header: 'Connector Type',
          hidden: true
        }, {
          field: 'mountingtypes',
          header: 'Mounting Types',
          hidden: true
        }, {
          field: 'functionaltypes',
          header: 'Functional Types',
          hidden: true
        }, {
          field: 'partMFGCode',
          header: 'Part MFR',
          hidden: true
        }, {

          field: 'partDistributor',
          header: 'Part Supplier',
          hidden: true
        }, {
          field: 'partStatus',
          header: 'Part Status',
          hidden: true
        }];

        // Added headers by configuration
        headersArr.forEach((header) => {
          switch (header.field) {
            case 'lineID': {
              vm.sourceHeader.push({
                field: 'lineID',
                header: header.name,
                title: header.name,
                type: 'numeric',
                width: 100,
                readOnly: vm.isBOMReadOnly,
                validator: function (value, callback) {
                  var isValid = true;

                  var mergeCellsPlugin = this.instance.getPlugin('MergeCells');
                  var mergedCellInfo = mergeCellsPlugin.mergedCellsCollection.get(this.row, this.col);

                  if (mergedCellInfo && mergedCellInfo.row !== this.row) {
                    isValid = true;
                  } else if (!value || !vm.DecimalNmberPattern.test(value)) {
                    isValid = false;
                  }
                  callback(isValid);
                }
              });
              vm.sourceHeader.push({
                field: 'cust_lineID',
                header: 'Cust BOM Line#',
                title: 'Cust BOM Line#',
                type: 'text',
                width: 80,
                readOnly: true,
                validator: function (value, callback) {
                  callback(true);
                }
              });
              break;
            }
            case 'custPN': {
              vm.sourceHeader.push({
                field: 'custPN',
                header: header.name,
                title: header.name,
                type: 'text',
                width: 125,
                readOnly: vm.isBOMReadOnly,
                validator: function (value, callback) {
                  if (!value || value.length <= 150) {
                    callback(true);
                  } else {
                    callback(false);
                  }
                }
              });
              break;
            }
            case 'customerRev': {
              vm.sourceHeader.push({
                field: 'customerRev',
                header: header.name,
                title: header.name,
                type: 'text',
                width: 45,
                readOnly: vm.isBOMReadOnly,
                validator: function (value, callback) {
                  if (!value || value.length <= 10) {
                    callback(true);
                  } else {
                    callback(false);
                  }
                }
              });
              break;
            }
            case 'customerDescription': {
              vm.sourceHeader.push({
                field: 'customerDescription',
                header: header.name,
                title: header.name,
                type: 'text',
                width: 125,
                readOnly: vm.isBOMReadOnly,
                validator: function (value, callback) {
                  if (!value || value.length <= 500) {
                    callback(true);
                  } else {
                    callback(false);
                  }
                }
              });
              break;
            }
            case 'customerPartDesc': {
              vm.sourceHeader.push({
                field: 'customerPartDesc',
                header: header.name,
                title: header.name,
                type: 'text',
                width: 120,
                readOnly: vm.isBOMReadOnly,
                validator: function (value, callback) {
                  callback(true);
                }
              });
              break;
            }
            case 'qpa': {
              vm.sourceHeader.push({
                field: 'qpa',
                header: header.name,
                title: header.name,
                type: 'numeric',
                width: 50,
                readOnly: vm.isBOMReadOnly,
                validator: function (value, callback) {
                  var isValid = true;
                  var mergeCellsPlugin = this.instance.getPlugin('MergeCells');
                  var mergedCellInfo = mergeCellsPlugin.mergedCellsCollection.get(this.row, this.col);
                  if (mergedCellInfo && mergedCellInfo.row !== this.row) {
                    isValid = true;
                  } else if (value && value < 0) {
                    isValid = false;
                  } else {
                    const bomModel = vm.bomModel[this.row];
                    if (bomModel) {
                      const dnpQty = Number((bomModel['dnpQty'] === null || bomModel['dnpQty'] === undefined || bomModel['dnpQty'] === '') ? 0 : bomModel['dnpQty']);
                      const buyQty = bomModel['isPurchase'];
                      const uomID = bomModel['uomID'];
                      const val = Number(value);
                      if (!bomModel['dnpQty'] && !value) {
                        isValid = false;
                      }
                      else if ((buyQty === true || buyQty === 'true') && (isNaN(val) || val === 0)) {
                        isValid = false;
                      }
                      else if (isNaN(val) && isNaN(dnpQty)) {
                        isValid = false;
                      }
                      else if (uomID === CORE.UOM_DEFAULTS.EACH.NAME && (val % 1 !== 0 && dnpQty % 1 !== 0 || val === 0 && dnpQty === 0)) {
                        isValid = false;
                      }
                    }
                  }
                  callback(isValid);
                }
              });
              break;
            }
            case 'refDesig': {
              vm.sourceHeader.push({
                field: 'refDesig',
                header: header.name,
                title: header.name + _refDesTooltip,
                type: 'text',
                width: 200,
                readOnly: vm.isBOMReadOnly,
                validator: function (value, callback) {
                  const mergeCellsPlugin = this.instance.getPlugin('MergeCells');
                  const mergedCellInfo = mergeCellsPlugin.mergedCellsCollection.get(this.row, this.col);

                  const bomObj = vm.bomModel[this.row];
                  if (mergedCellInfo && mergedCellInfo.row !== this.row) {
                    callback(true);
                  } else if (!value && bomObj) {
                    const dnpQty = Number((bomObj['dnpQty'] === null || bomObj['dnpQty'] === undefined || bomObj['dnpQty'] === '') ? 0 : bomObj['dnpQty']);
                    const buyQty = bomObj['isPurchase'];
                    const uomID = bomObj['uomID'];
                    if (!bomObj['dnpQty'] && uomID === CORE.UOM_DEFAULTS.EACH.NAME) {
                      callback(false);
                    }
                    else if ((buyQty === true || buyQty === 'true') && uomID === CORE.UOM_DEFAULTS.EACH.NAME) {
                      callback(false);
                    }
                    else if (uomID === CORE.UOM_DEFAULTS.EACH.NAME && dnpQty === 0) {
                      callback(false);
                    }
                    else {
                      callback(true);
                    }
                  }
                  else if (value && value.length > 3000) {
                    callback(false);
                  } else {
                    callback(true);
                  }
                }
              });
              break;
            }
            case 'numOfPosition': {
              vm.sourceHeader.push({
                field: 'numOfPosition',
                header: header.name,
                title: header.name,
                type: 'numeric',
                width: 90,
                readOnly: vm.isBOMReadOnly,
                validator: function (value, callback) {
                  let isValid = true;
                  if (!value) {
                    isValid = true;
                  } else {
                    const val = Number(value);
                    if (isNaN(val) || val < 0) {
                      isValid = false;
                    }
                  }
                  callback(isValid);
                }
              });
              break;
            }
            case 'numOfRows': {
              vm.sourceHeader.push({
                field: 'numOfRows',
                header: header.name,
                title: header.name,
                type: 'numeric',
                width: 60,
                readOnly: vm.isBOMReadOnly,
                validator: function (value, callback) {
                  let isValid = true;
                  if (!value) {
                    isValid = true;
                  } else {
                    const val = Number(value);
                    if (isNaN(val) || val < 0) {
                      isValid = false;
                    }
                  }
                  callback(isValid);
                }
              });
              break;
            }
            case 'uomID': {
              vm.sourceHeader.push({
                field: 'uomID',
                header: header.name,
                title: header.name,
                type: 'dropdown',
                width: 120,
                readOnly: vm.isBOMReadOnly,
                source: _unitList.map((x) => x.unitName),
                validator: function (value, callback) {
                  const mergeCellsPlugin = this.instance.getPlugin('MergeCells');
                  const mergedCellInfo = mergeCellsPlugin.mergedCellsCollection.get(this.row, this.col);

                  if (mergedCellInfo && mergedCellInfo.row !== this.row) {
                    callback(true);
                  } else if (!value) {
                    callback(false);
                  } else {
                    const unit = _.find(_unitList, (y) => {
                      if (y.unitName && y.unitName.toUpperCase() === value.toUpperCase() || y.alias && y.alias.length > 0 && y.alias.find((x) => x.alias.toUpperCase() === value.toUpperCase())) {
                        return y;
                      }
                    });
                    value = unit ? unit.unitName : value;
                    const bomModel = vm.bomModel[this.row];
                    if (bomModel) {
                      bomModel['uomID'] = value;
                    }
                    const isExists = _.some(_unitList, (x) => x.unitName === value);
                    callback(isExists);
                  }
                }
              });
              break;
            }
            case 'dnpQty': {
              vm.sourceHeader.push({
                field: 'dnpQty',
                header: header.name,
                title: header.name,
                type: 'numeric',
                width: 50,
                readOnly: vm.isBOMReadOnly,
                validator: function (value, callback) {
                  const mergeCellsPlugin = this.instance.getPlugin('MergeCells');
                  const mergedCellInfo = mergeCellsPlugin.mergedCellsCollection.get(this.row, this.col);
                  if (mergedCellInfo && mergedCellInfo.row !== this.row) {
                    callback(true);
                  } else {
                    let isValid = true;
                    const bomObj = vm.bomModel[this.row];
                    if (bomObj) {
                      const uomID = bomObj['uomID'];
                      const val = Number(value || null);
                      if (bomObj && bomObj.isBuyDNPQty && bomObj.isBuyDNPQty !== _buyDNPQTYList[0].value && !value) {
                        isValid = false;
                      } else if (isNaN(val)) {
                        isValid = false;
                      }
                      else if (uomID === CORE.UOM_DEFAULTS.EACH.NAME && val % 1 !== 0) {
                        isValid = false;
                      }
                    }
                    callback(isValid);
                  }
                }
              });
              break;
            }
            case 'dnpDesig': {
              vm.sourceHeader.push({
                field: 'dnpDesig',
                header: header.name,
                title: header.name + _refDesTooltip,
                type: 'text',
                width: 100,
                readOnly: vm.isBOMReadOnly,
                validator: function (value, callback) {
                  const mergeCellsPlugin = this.instance.getPlugin('MergeCells');
                  const mergedCellInfo = mergeCellsPlugin.mergedCellsCollection.get(this.row, this.col);
                  if (mergedCellInfo && mergedCellInfo.row !== this.row) {
                    callback(true);
                  } else {
                    const bomObj = vm.bomModel[this.row];
                    if (bomObj) {
                      const uomID = bomObj['uomID'];
                      const dnpQty = bomObj['dnpQty'];
                      if (!bomObj['qpa'] && dnpQty && !value && uomID === CORE.UOM_DEFAULTS.EACH.NAME) {
                        callback(false);
                      } else if (bomObj && bomObj.isBuyDNPQty && bomObj.isBuyDNPQty !== _buyDNPQTYList[0].value && !value && uomID === CORE.UOM_DEFAULTS.EACH.NAME) {
                        callback(false);
                      } else if (!value || value.length <= 500) {
                        callback(true);
                      } else {
                        callback(false);
                      }
                    }
                    else {
                      callback(true);
                    }
                  }
                }
              });
              break;
            }
            case 'isBuyDNPQty': {
              vm.sourceHeader.push({
                field: 'isBuyDNPQty',
                header: header.name,
                title: header.name,
                type: 'dropdown',
                width: 90,
                readOnly: vm.isBOMReadOnly,
                source: _buyDNPQTYList.map((x) => x.value),
                validator: function (value, callback) {
                  var mergeCellsPlugin = this.instance.getPlugin('MergeCells');
                  var mergedCellInfo = mergeCellsPlugin.mergedCellsCollection.get(this.row, this.col);
                  var bomModel = vm.bomModel[this.row];

                  if (mergedCellInfo && mergedCellInfo.row !== this.row) {
                    callback(true);
                  } else {
                    if (!_hotRegisterer) {
                      callback(true);
                      // 'false' comes on copy-paste full row
                    } else if (bomModel && value && value !== _buyDNPQTYList[0].id) {
                      //var uomID = bomModel['uomID'];
                      //setCellValidation(this.row, _colDNPQty, !(bomModel.dnpQty == null || bomModel.dnpQty == ''));
                      //setCellValidation(this.row, _colDNPDesig, !((bomModel.dnpDesig == null || bomModel.dnpDesig == '') && uomID == CORE.UOM_DEFAULTS.EACH.NAME));
                    }
                    else {
                      setCellValidation(this.row, _colDNPQty, true);
                      setCellValidation(this.row, _colDNPDesig, true);
                    }
                    setHeaderStyle();
                    callback(true);
                  }
                }
              });
              break;
            }
            case 'isInstall': {
              vm.sourceHeader.push({
                field: 'isInstall',
                header: header.name,
                title: header.name,
                type: 'checkbox',
                width: 70,
                readOnly: vm.isBOMReadOnly,
                className: 'htCenter',
                validator: function (value, callback) {
                  callback(true);
                }
              });
              break;
            }
            case 'isPurchase': {
              vm.sourceHeader.push({
                field: 'isPurchase',
                header: header.name,
                title: header.name,
                type: 'checkbox',
                width: 40,
                readOnly: vm.isBOMReadOnly,
                className: 'htCenter',
                validator: function (value, callback) {
                  callback(true);
                }
              });
              break;
            }
            case 'isNotRequiredKitAllocation': {
              vm.sourceHeader.push({
                field: 'isNotRequiredKitAllocation',
                header: header.name,
                title: header.name,
                type: 'checkbox',
                width: 100,
                readOnly: vm.isBOMReadOnly,
                className: 'htCenter',
                validator: function (value, callback) {
                  callback(true);
                }
              });
              break;
            }
            case 'isSupplierToBuy': {
              vm.sourceHeader.push({
                field: 'isSupplierToBuy',
                header: header.name,
                title: header.name,
                type: 'checkbox',
                width: 65,
                readOnly: vm.isBOMReadOnly,
                className: 'htCenter',
                validator: function (value, callback) {
                  callback(true);
                }
              });
              break;
            }
            case 'programingStatus': {
              vm.sourceHeader.push({
                field: 'programingStatus',
                header: header.name,
                title: header.name,
                type: 'dropdown',
                width: 150,
                readOnly: vm.isBOMReadOnly,
                source: _programingStatusList.map((x) => x.value),
                validator: function (value, callback) {
                  const mergeCellsPlugin = this.instance.getPlugin('MergeCells');
                  const mergedCellInfo = mergeCellsPlugin.mergedCellsCollection.get(this.row, this.col);
                  if (mergedCellInfo && mergedCellInfo.row !== this.row) {
                    callback(true);
                  } else if (!value) {
                    callback(false);
                  } else {
                    const isExists = _.some(_programingStatusList, (x) => x.value === value);
                    callback(isExists);
                  }
                }
              });
              break;
            }
            case 'substitutesAllow': {
              vm.sourceHeader.push({
                field: 'substitutesAllow',
                header: header.name,
                title: header.name,
                type: 'dropdown',
                width: 90,
                readOnly: vm.isBOMReadOnly,
                source: _substitutesAllowList.map((x) => x.value),
                validator: function (value, callback) {
                  const mergeCellsPlugin = this.instance.getPlugin('MergeCells');
                  const mergedCellInfo = mergeCellsPlugin.mergedCellsCollection.get(this.row, this.col);

                  if (mergedCellInfo && mergedCellInfo.row !== this.row) {
                    callback(true);
                  } else {
                    const isExists = _.some(_substitutesAllowList, (x) => x.value === value);
                    callback(isExists);
                  }
                }
              });
              break;
            }
            case 'mfgPNDescription': {
              vm.sourceHeader.push({
                field: 'mfgPNDescription',
                header: header.name,
                title: header.name,
                type: 'text',
                width: 120,
                readOnly: true,
                validator: function (value, callback) {
                  callback(true);
                }
              });
              break;
            }
            case 'mfgCode': {
              vm.sourceHeader.push({
                field: 'mfgCode',
                header: header.name,
                title: header.name,//header.name + ' <span class="red"> *</span>',
                type: 'text',
                width: 135,
                readOnly: vm.isBOMReadOnly,
                validator: function (value, callback) {
                  if (!value || value.length > 500) {
                    callback(false);
                  } else {
                    callback(true);
                  }
                }
              });
              break;
            }
            case 'mfgPN': {
              vm.sourceHeader.push({
                field: 'mfgPN',
                header: header.name,
                title: header.name,
                type: 'text',
                width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
                readOnly: vm.isBOMReadOnly,
                validator: function (value, callback) {
                  if (!value || value.length > 150) {
                    callback(false);
                  } else {
                    callback(true);
                  }
                }
              });

              vm.sourceHeader.push({
                field: 'rohsComplient',
                header: 'RoHS & Misc',
                title: 'RoHS & Misc',
                type: 'text',
                //className: "htCenter",
                readOnly: true,
                validator: function (value, callback) {
                  callback(true);
                },
                width: 300
              });
              break;
            }
            case 'description': {
              vm.sourceHeader.push({
                field: 'description',
                header: header.name,
                title: header.name,
                type: 'text',
                width: 500,
                readOnly: true,
                validator: function (value, callback) {
                  callback(true);
                }
              });
              vm.sourceHeader.push({
                field: 'additionalComment',
                header: 'Additional Comment <br/> (Right click to edit)',
                title: 'Additional Comment <br/> (Right click to edit)',
                type: 'text',
                width: 500,
                readOnly: true,
                validator: function (value, callback) {
                  callback(true);
                }
              });
              vm.sourceHeader.push({
                field: 'partcategoryID',
                header: 'Type',
                title: 'Type',
                type: 'text',
                width: 150,
                readOnly: true,
                source: _typeList.map((x) => x.Value),
                validator: function (value, callback) {
                  //var isValid = _.some(_typeList, x=> x.Value == value);
                  callback(true);
                }
              });

              vm.sourceHeader.push({
                field: 'mountingtypeID',
                header: 'Mounting Type',
                title: 'Mounting Type',
                type: 'text',
                width: 150,
                readOnly: true,
                source: _mountingTypeList.map((x) => x.name),
                validator: function (value, callback) {
                  //var isValid = _.some(_mountingTypeList, x=> x.name == value);
                  callback(true);
                }
              });

              vm.sourceHeader.push({
                field: 'parttypeID',
                header: 'Part Type',
                title: 'Functional Type',
                type: 'text',
                width: 150,
                readOnly: true,
                source: _partTypeList.map((x) => x.partTypeName),
                validator: function (value, callback) {
                  //var isValid = _.some(_partTypeList, x=> x.partTypeName == value);
                  callback(true);
                }
              });

              vm.sourceHeader.push({
                field: 'partPackage',
                header: 'Package',
                title: 'Package/Case(Shape) Type',
                type: 'text',
                className: 'htCenter',
                readOnly: true,
                validator: function (value, callback) {
                  callback(true);
                },
                width: 100
              });

              vm.sourceHeader.push({
                field: 'deviceMarking',
                header: 'Device Marking',
                title: 'Device Marking',
                type: 'text',
                className: 'htCenter',
                readOnly: true,
                validator: function (value, callback) {
                  callback(true);
                },
                width: 100
              });
              break;
            }
            case 'distributor': {
              vm.sourceHeader.push({
                field: 'distributor',
                header: header.name,
                title: header.name,
                type: 'text',
                width: 140,
                readOnly: vm.isBOMReadOnly,
                validator: function (value, callback) {
                  if (!value || value.length <= 500) {
                    callback(true);
                  } else {
                    callback(false);
                  }
                }
              });
              break;
            }
            case 'distPN': {
              vm.sourceHeader.push({
                field: 'distPN',
                header: header.name,
                //title: header.name,
                title: header.name,
                type: 'text',
                width: 210,
                readOnly: vm.isBOMReadOnly,
                validator: function (value, callback) {
                  if (!value || value.length <= 150) {
                    callback(true);
                  } else {
                    callback(false);
                  }
                }
              });

              vm.sourceHeader.push({
                field: 'badMfgPN',
                header: 'Suggested Correct Part',
                title: 'Suggested Correct Part',
                type: 'text',
                readOnly: true,
                width: 160
              });
              vm.sourceHeader.push({
                field: 'suggestedByApplicationMsg',
                header: 'Suggested By Application',
                title: 'Suggested By Application',
                type: 'text',
                readOnly: true,
                width: 250
              });
              vm.sourceHeader.push({
                field: 'uom',
                header: 'Part UOM',
                title: 'Part UOM',
                type: 'text',
                className: 'htCenter',
                readOnly: true,
                validator: function (value, callback) {
                  callback(true);
                },
                width: 120
              });
              vm.sourceHeader.push({
                field: 'color',
                header: 'Color',
                title: 'Color',
                type: 'text',
                className: 'htCenter',
                readOnly: true,
                validator: function (value, callback) {
                  callback(true);
                },
                width: 80
              });
              vm.sourceHeader.push({
                field: 'pitch',
                header: 'Pitch',
                title: 'Pitch',
                type: 'text',
                className: 'htCenter',
                readOnly: true,
                validator: function (value, callback) {
                  callback(true);
                },
                width: 80
              });
              vm.sourceHeader.push({
                field: 'noOfRows',
                header: 'Part No. of Rows',
                title: 'Part No. of Rows',
                type: 'text',
                className: 'htCenter',
                readOnly: true,
                validator: function (value, callback) {
                  callback(true);
                },
                width: 120
              });
              break;
            }
            case 'componentLead': {
              vm.sourceHeader.push({
                field: 'componentLead',
                header: header.name,
                title: header.name,
                type: 'text',
                width: 80,
                readOnly: true,
                validator: function (value, callback) {
                  callback(true);
                }
              });
              vm.sourceHeader.push({
                field: 'packaging',
                header: 'Packaging',
                title: 'Packaging',
                type: 'text',
                className: 'htCenter',
                readOnly: true,
                validator: function (value, callback) {
                  callback(true);
                },
                width: 100
              });
              vm.sourceHeader.push({
                field: 'value',
                header: 'Value',
                title: 'Value',
                type: 'text',
                className: 'htCenter',
                readOnly: true,
                validator: function (value, callback) {
                  callback(true);
                },
                width: 80
              });
              vm.sourceHeader.push({
                field: 'tolerance',
                header: 'Tolerance',
                title: 'Tolerance',
                type: 'text',
                className: 'htCenter',
                readOnly: true,
                validator: function (value, callback) {
                  callback(true);
                },
                width: 80
              });
              vm.sourceHeader.push({
                field: 'voltage',
                header: 'Voltage',
                title: 'Voltage',
                type: 'text',
                className: 'htCenter',
                readOnly: true,
                validator: function (value, callback) {
                  callback(true);
                },
                width: 70
              });
              vm.sourceHeader.push({
                field: 'powerRating',
                header: 'Power (Watts)',
                title: 'Power (Watts)',
                type: 'text',
                className: 'htCenter',
                readOnly: true,
                validator: function (value, callback) {
                  callback(true);
                },
                width: 70
              });
              vm.sourceHeader.push({
                field: 'maxSolderingTemperature',
                header: 'Max Soldering Temperature (C)',
                title: 'Max Soldering Temperature (C)',
                type: 'text',
                className: 'htCenter',
                readOnly: true,
                validator: function (value, callback) {
                  callback(true);
                },
                width: 120
              });
              vm.sourceHeader.push({
                field: 'minOperatingTemp',
                header: 'Min. Temp.',
                title: 'Min. Temp.',
                type: 'text',
                className: 'tCenter',
                readOnly: true,
                validator: function (value, callback) {
                  callback(true);
                },
                width: 70
              });
              vm.sourceHeader.push({
                field: 'maxOperatingTemp',
                header: 'Max. Temp.',
                title: 'Max. Temp.',
                type: 'text',
                className: 'htCenter',
                readOnly: true,
                validator: function (value, callback) {
                  callback(true);
                },
                width: 70
              });
              vm.sourceHeader.push({
                field: 'org_mfgCode',
                header: 'Imported BOM MFR',
                title: 'Imported BOM MFR',
                type: 'text',
                width: 135,
                readOnly: true,
                validator: function (value, callback) {
                  callback(true);
                }
              });
              vm.sourceHeader.push({
                field: 'customerApprovalComment',
                header: 'Customer Approval/Disapproval Comments',
                title: 'Customer Approval/Disapproval Comments',
                type: 'text',
                width: 600,
                readOnly: true,
                validator: function (value, callback) {
                  callback(true);
                }
              });
              break;
            }
          }
        });
        // Bind Additional field in header
        _.each(vm.additoinalHeaderList, (header) => {
          vm.sourceHeader.push({
            field: header.field,
            header: header.name,
            title: header.name,
            hidden: !header.isConfigured,
            type: 'text',
            className: 'htCenter',
            readOnly: false,
            validator: function (value, callback) {
              callback(true);
            },
            width: 100
          });
        });

        _sourceHeaderVisible = [];
        vm.sourceHeader.forEach((item) => {
          if (item.type === 'dropdown') {
            _dropdownTypes.push(item.field);
          } else if (item.type === 'checkbox') {
            _checkBoxTypes.push(item.field);
          }
          if (!item.hidden) {
            _sourceHeaderVisible.push(item);
          }
        });

        _htmlTypes = ['badMfgPN', 'rohsComplient', 'customerApprovalComment'];

        // Store index of columns into variables as used many times into code
        _colQPAIndex = _.findIndex(_sourceHeaderVisible, (x) => x.field === 'qpa');
        _colCPNIndex = _.findIndex(_sourceHeaderVisible, (x) => x.field === 'custPN');
        _colRefDesigIndex = _.findIndex(_sourceHeaderVisible, (x) => x.field === 'refDesig');
        _colMfgCodeIndex = _.findIndex(_sourceHeaderVisible, (x) => x.field === 'mfgCode');
        _colMfgPNIndex = _.findIndex(_sourceHeaderVisible, (x) => x.field === 'mfgPN');
        _colDistributorIndex = _.findIndex(_sourceHeaderVisible, (x) => x.field === 'distributor');
        _colDistPNIndex = _.findIndex(_sourceHeaderVisible, (x) => x.field === 'distPN');
        _colItemIndex = _.findIndex(_sourceHeaderVisible, (x) => x.field === 'lineID');
        _colCustItemIndex = _.findIndex(_sourceHeaderVisible, (x) => x.field === 'cust_lineID');
        _colUOMIDIndex = _.findIndex(_sourceHeaderVisible, (x) => x.field === 'uomID');
        _colDNPQty = _.findIndex(_sourceHeaderVisible, (x) => x.field === 'dnpQty');
        _colDNPDesig = _.findIndex(_sourceHeaderVisible, (x) => x.field === 'dnpDesig');
        _colPopulateIndex = _.findIndex(_sourceHeaderVisible, (x) => x.field === 'isInstall');
        _colBuyIndex = _.findIndex(_sourceHeaderVisible, (x) => x.field === 'isPurchase');
        _colDNPBuyIndex = _.findIndex(_sourceHeaderVisible, (x) => x.field === 'isBuyDNPQty');
        _colMountingTypeIDIndex = _.findIndex(_sourceHeaderVisible, (x) => x.field === 'mountingtypeID');
        _colFunctionalTypeIDIndex = _.findIndex(_sourceHeaderVisible, (x) => x.field === 'parttypeID');
        _colPartPackageIndex = _.findIndex(_sourceHeaderVisible, (x) => x.field === 'partPackage');
        _colPackagingIndex = _.findIndex(_sourceHeaderVisible, (x) => x.field === 'packaging');
        // _colPartUOMIndex = _.findIndex(_sourceHeaderVisible, (x) => x.field === 'uom');
      };
      // Manufacturer list page URL from Handsontable header
      vm.goToManufacturerList = () => {
        BaseService.goToManufacturerList();
      };

      // Create model from array
      function generateModel(uploadedBOM, bomHeaders) {
        vm.bomModel = [];
        vm.newAppendBOM = [];
        vm.isAppendBOM = vm.refBomModel.length > 0 ? true : false;
        if (uploadedBOM && uploadedBOM.length > 0) {
          const headerRowArr = uploadedBOM[0];
          // loop through excel data and bind into model
          for (let i = 1, len = uploadedBOM.length; i < len; i++) {
            const item = uploadedBOM[i];
            const modelRow = {};
            const alternateParts = [];

            bomHeaders.forEach((objBomHeader) => {
              if (!objBomHeader.column) {
                return;
              }
              const matchingIndexList = [];
              headerRowArr.forEach((header, index) => {
                if (header && header.toUpperCase() === objBomHeader.column.toUpperCase()) {
                  matchingIndexList.push(index);
                }
              });

              if (!matchingIndexList.length) {
                return;
              }

              const field = vm.sourceHeader.find((x) => x.header === objBomHeader.header).field;

              if (!modelRow[field]) {
                const columnValue = item[matchingIndexList[0]];
                modelRow[field] = columnValue === '' || columnValue === null || columnValue === undefined ? null : (typeof columnValue === 'string' ? columnValue.trim() : columnValue);
              }

              if (matchingIndexList.length > 1 && _multiFields.indexOf(field) !== -1) {
                matchingIndexList.splice(0, 1);

                matchingIndexList.forEach((index) => {
                  var value = item[index];
                  if (!value) {
                    return;
                  }
                  value = value.toString().toUpperCase();
                  switch (field) {
                    case 'mfgCode': {
                      const filterObj = alternateParts.find((x) => !x.mfgCode && x.mfgPN);
                      if (filterObj) {
                        filterObj.mfgCode = value;
                      }
                      else {
                        const obj = { mfgCode: value, mfgPN: null };
                        alternateParts.push(obj);
                      }
                      break;
                    }
                    case 'mfgPN': {
                      const filterObj = alternateParts.find((x) => x.mfgCode && !x.mfgPN);
                      if (filterObj) {
                        filterObj.mfgPN = value;
                      }
                      else {
                        const obj = { mfgCode: null, mfgPN: value };
                        alternateParts.push(obj);
                      }
                      break;
                    }
                    case 'distributor': {
                      const filterObj = alternateParts.find((x) => !x.distributor && x.distPN);
                      if (filterObj) {
                        filterObj.distributor = value;
                      }
                      else {
                        const obj = { distributor: value, distPN: null };
                        alternateParts.push(obj);
                      }
                      break;
                    }
                    case 'distPN': {
                      const filterObj = alternateParts.find((x) => x.distributor && !x.distPN);
                      if (filterObj) {
                        filterObj.distPN = value;
                      }
                      else {
                        const obj = { distributor: null, distPN: value };
                        alternateParts.push(obj);
                      }
                      break;
                    }
                  }
                });
              }
            });

            let isAllPropNull = true;

            // if all properties are null then do not take line item
            for (const prop in modelRow) {
              if (modelRow[prop]) {
                isAllPropNull = false;
                break;
              }
            }

            if (!isAllPropNull) {
              /* If line item has distributor details then remove it and add into separate array as we are creating new
                  line items for distributor */
              if (modelRow.distributor || modelRow.distPN) {
                alternateParts.splice(0, 0, {
                  distributor: modelRow.distributor ? modelRow.distributor.toString().trim().toUpperCase() : null,
                  distPN: modelRow.distPN ? modelRow.distPN.toString().trim().toUpperCase() : null
                });

                modelRow.distributor = null;
                modelRow.distPN = null;
              };

              const isExists = _.some(vm.bomModel, { lineID: modelRow.lineID });
              // If line with same lineID not exist then create new line
              if (!isExists) {
                modelRow._lineID = modelRow.lineID;
                modelRow.refDesig = modelRow.refDesig ? modelRow.refDesig.toString().toUpperCase() : null;

                if (!modelRow.uomID) {
                  modelRow.uomID = CORE.UOM_DEFAULTS.EACH.NAME;
                  const unit = _.find(_unitList, (y) => {
                    if (y.unitName && y.unitName.toUpperCase() === modelRow.uomID.toUpperCase() || y.alias && y.alias.length > 0 && y.alias.find((x) => x.alias.toUpperCase() === modelRow.uomID.toUpperCase())) {
                      return y;
                    }
                  });
                  modelRow.uomID = unit ? unit.unitName : modelRow.uomID;
                }
                // make true only if null. Do not change if false value
                if ((modelRow.isPurchase === null || modelRow.isPurchase === undefined) && (modelRow.qpa && modelRow.qpa > 0 || modelRow.refDesig)) {
                  modelRow.isPurchase = true;
                }
                else {
                  modelRow.isPurchase = (modelRow.isPurchase === null || modelRow.isPurchase === undefined) ? false : modelRow.isPurchase;
                }

                modelRow.isNotRequiredKitAllocation = (modelRow.isNotRequiredKitAllocation === null || modelRow.isNotRequiredKitAllocation === undefined || modelRow.isNotRequiredKitAllocation === 0 || modelRow.isNotRequiredKitAllocation === false) ? false : modelRow.isNotRequiredKitAllocation;
                modelRow.isSupplierToBuy = (modelRow.isSupplierToBuy === null || modelRow.isSupplierToBuy === undefined || modelRow.isSupplierToBuy === 0 || modelRow.isSupplierToBuy === false) ? false : modelRow.isSupplierToBuy;

                // make true only if null. Do not change if false value
                if ((modelRow.isInstall === null || modelRow.isInstall === undefined) && (modelRow.qpa && modelRow.qpa > 0 || modelRow.refDesig)) {
                  modelRow.isInstall = true;
                }
                else {
                  modelRow.isInstall = (modelRow.isInstall === null || modelRow.isInstall === undefined) ? false : modelRow.isInstall;
                }

                modelRow.isBuyDNPQty = modelRow.isBuyDNPQty || _buyDNPQTYList[0].value;

                // Dharam [12/28/2021]: If MFG, NFG PN, Supplier and Supplier PN not available in line and only have CPN or Rev then allow to add line during Import BOM or Append BOM
                if (modelRow.mfgCode || modelRow.mfgPN || (!modelRow.mfgCode && !modelRow.mfgPN && !modelRow.distributor && !modelRow.distPN && (modelRow.custPN || modelRow.customerRev))) {
                  if (modelRow.mfgCode) {
                    modelRow.mfgCode = modelRow.mfgCode.toString().trim().toUpperCase();
                  }

                  if (modelRow.mfgPN) {
                    modelRow.mfgPN = modelRow.mfgPN.toString().trim().toUpperCase();
                  }

                  vm.refBomModel.push(modelRow);
                  vm.newAppendBOM.push(modelRow);
                  //Clone Object
                  updateCloneObject(false);
                }
              }
              // Add MFG/DIST into array to create new line as same lineID is already exists
              else {
                if (modelRow.mfgCode || modelRow.mfgPN || modelRow.distributor || modelRow.distPN) {
                  alternateParts.splice(0, 0, {
                    mfgCode: !modelRow.mfgCode ? null : modelRow.mfgCode.toString().trim().toUpperCase(),
                    mfgPN: !modelRow.mfgPN ? null : modelRow.mfgPN.toString().trim().toUpperCase()
                  });
                }
              }

              // Append all alternate lines into main array
              if (alternateParts.length) {
                alternateParts.forEach((parts) => {
                  var alternateModelRow = angular.copy(modelRow);
                  alternateModelRow.mfgCode = !parts.mfgCode ? null : parts.mfgCode.toString().trim();
                  alternateModelRow.mfgPN = !parts.mfgPN ? null : parts.mfgPN.toString().trim();
                  alternateModelRow.distributor = !parts.distributor ? null : parts.distributor.toString().trim();
                  alternateModelRow.distPN = !parts.distPN ? null : parts.distPN.toString().trim();
                  alternateModelRow._lineID = modelRow.lineID;
                  vm.refBomModel.push(alternateModelRow);
                  vm.newAppendBOM.push(alternateModelRow);
                });
                //Clone Object
                updateCloneObject(false);
              }
            };
          };
        }
      }

      // Merge same lineID line items into one.
      function mergeCommonCells() {
        // Resolve issue for row merged in case of add new row case.
        //bomModelList = _.filter(vm.bomModel, function (data) { return !data.isNewAdd; });
        var bomGroup = _.groupBy(vm.bomModel, '_lineID');
        var mergeCells = [];
        const mergeColCount = _sourceHeaderVisible.filter(e => !_multiFields.includes(e.field)).length; // Get Count for Merge column. first {mergeColCount} Row will be merged.

        // for loop added for move position of same line item together in line by lineID
        for (const prop in bomGroup) {
          const obj = bomGroup[prop];
          if (obj.length > 1) {
            let index = vm.bomModel.indexOf(obj[0]);
            _.each(obj, (lineObject) => {
              const lineIndex = vm.bomModel.indexOf(lineObject);
              if (index !== lineIndex) {
                index += 1;
                vm.bomModel.splice(lineIndex, 1);
                vm.bomModel.splice(index, 0, lineObject);
              }
            });
          }
        }

        // Loop for merge same line by _lineID
        for (const prop in bomGroup) {
          const obj = bomGroup[prop];
          if (prop !== 'null' && prop !== 'undefined' && obj.length > 1) { //Dharam: added null and undefined condition to resolved issue if we remove line and that  if in BOM there is more then one line which  does not have Item # then all those line merged.
            const index = vm.bomModel.indexOf(obj[0]);
            obj[0].isMergedRow = true;//Maintain for merge line issue manage in case of filter
            for (let row = 0; row < obj.length - 1; row++) {
              const currBomObj = vm.bomModel[index + row + 1];
              currBomObj.qpaDesignatorStepError = null;
              currBomObj.dnpQPARefDesError = null;
              currBomObj.customerApprovalForQPAREFDESError = null;
              currBomObj.dnpInvalidREFDESError = null;
              currBomObj.duplicateCPNError = null;
              currBomObj.requireFunctionalTypeError = null;
              currBomObj.requireFunctionalTypeStep = true;
              currBomObj.requireMountingTypeError = null;
              currBomObj.requireMountingTypeStep = true;
              currBomObj.qpaCustomerApprovalComment = null;
              currBomObj.buyCustomerApprovalComment = null;
              currBomObj.buyDNPCustomerApprovalComment = null;
              currBomObj.populateCustomerApprovalComment = null;
              currBomObj.cpnCustomerApprovalComment = null;
              currBomObj.kitAllocationNotRequiredComment = null;
              currBomObj.isMergedRow = true; //Maintain for merge line issue manage in case of filter
              currBomObj.description = getDescriptionForLine(currBomObj);
              bindCustomerApprovedComments(currBomObj);
              mfgVerificationStepFn(currBomObj, row);
            }

            for (let col = 0; col < mergeColCount; col++) {
              mergeCells.push({
                row: index, col: col, rowspan: obj.length, colspan: 1
              });
            }
          }
        }

        if (_hotRegisterer) {
          _hotRegisterer.updateSettings({
            mergeCells: mergeCells
          });
        }

        vm.settings.mergeCells = mergeCells;

        //  If filter is applied then display handsontable by disabling isNoDataFound flag and set height of handsontable
        if (vm.selectedFilter !== _bomFilters.ALL.CODE) {
          vm.isNoDataFound = false;

          // set height to the handsontable container
          window.setTimeout(setHandsontableHeight);
        }
        vm.isFilterEnable = false;
        onQPAChange();
        $timeout(() => {
          if (_hotRegisterer) {
            _hotRegisterer.render();
            setHeaderStyle();
            //var myCell = _hotRegisterer.getDataAtCell(0, 0);
            //_hotRegisterer.setDataAtCell(0, 0, myCell);
          }
        });
      }

      // Set Sub menu of Context menu
      function setContextMenuSubItems() {
        // Set add menu sub items for DIST Code
        var subMenuDISTCode = {
          key: vm.BOM_SUB_MENU_OPTION.add_dist1.value,
          name: vm.BOM_SUB_MENU_OPTION.add_dist1.name,
          disabled: function () {
            var selected = _hotRegisterer.getSelected();
            if (!selected) { return true; }

            selected = selected[0];
            const row = selected[0];
            const col = selected[1];

            if (row === null || row === undefined || col !== _colDistributorIndex || !vm.bomModel[row].distributor || vm.bomModel[row].distMfgCodeID) {
              return true;
            }
          },
          callback: function (key, options) {
            options = options[0];
            if (!options.start) {
              return;
            }

            const bomObj = vm.bomModel[options.start.row];
            addDISTCode(bomObj, options.start.row, options.start.col, CORE.MESSAGE_CONSTANT.ADD_NEW);
          }
        };

        // Set add menu sub items for DIST PN
        var subMenuDISTPN = {
          key: vm.BOM_SUB_MENU_OPTION.add_dist3.value,
          name: vm.BOM_SUB_MENU_OPTION.add_dist3.name,
          disabled: function () {
            var selected = _hotRegisterer.getSelected();
            if (!selected) {
              return true;
            }

            selected = selected[0];
            const row = selected[0];
            const col = selected[1];

            if (row === null || row === undefined || col !== _colDistPNIndex || !vm.bomModel[row].distPN || vm.bomModel[row].distMfgPNID) {
              return true;
            }
          },
          callback: function (key, options) {
            options = options[0];
            if (!options.start) {
              return;
            }

            const bomObj = vm.bomModel[options.start.row];
            addDISTPN(bomObj, options.start.row, options.start.col, PartCorrectList.CorrectPart);
          }
        };

        var subMenuDISTBadPN = {
          key: vm.BOM_SUB_MENU_OPTION.add_dist4.value,
          name: vm.BOM_SUB_MENU_OPTION.add_dist4.name,
          disabled: function () {
            var selected = _hotRegisterer.getSelected();
            if (!selected) {
              return true;
            }

            if (!vm.enabledIncorrectPartOnBOM) {
              return true;
            }
            selected = selected[0];

            const row = selected[0];
            const col = selected[1];

            if (row === null || row === undefined || row === '' || !vm.bomModel[row].distPN || col !== _colDistPNIndex || vm.bomModel[row].distMfgPNID) {
              return true;
            }
          },
          callback: function (key, options) {
            options = options[0];
            if (!options.start) {
              return;
            }
            const bomObj = vm.bomModel[options.start.row];
            addDISTPN(bomObj, options.start.row, options.start.col, PartCorrectList.IncorrectPart);
          }
        };

        var subMenuDISTUnknownPN = {
          key: vm.BOM_SUB_MENU_OPTION.add_dist5.value,
          name: vm.BOM_SUB_MENU_OPTION.add_dist5.name,
          disabled: function () {
            var selected = _hotRegisterer.getSelected();
            if (!selected) {
              return true;
            }

            selected = selected[0];

            const row = selected[0];
            const col = selected[1];

            if ((!row && row !== 0) || !vm.bomModel[row].distPN || col !== _colDistPNIndex || vm.bomModel[row].distMfgPNID) {
              return true;
            }
          },
          callback: function (key, options) {
            options = options[0];
            if (!options.start) {
              return;
            }

            const bomObj = vm.bomModel[options.start.row];
            addDISTPN(bomObj, options.start.row, options.start.col, PartCorrectList.UnknownPart);
          }
        };

        // [E] Search context menu items

        // _menuItemsAddMFG = [subMenuMFGCode, subMenuMFGPN, subMenuMFGBadPN, subMenuMFGUnknownPN];
        _menuItemsAddDIST = [subMenuDISTCode, subMenuDISTPN, subMenuDISTBadPN, subMenuDISTUnknownPN];
        // _menuItemsSearch = [subMenuComponent];

        initDynamicContextMenu();
      }
      // Open Kit Allocation not required pop-up
      vm.kitAllocationNotRequiredCommentPopup = (bomObj) => {
        // Deselected current cell so we can have a focus on pop-up element
        _hotRegisterer.deselectCell();
        if (bomObj.isNotRequiredKitAllocation) {
          customerApprovalPopup(bomObj, CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALTITLE.APPROVEKITALLOCATIONNOTREQUIREDCOMMENT, false, CORE.CUSTOMERAPPROVALFOR.KitAllocationNotRequired).then((response) => {
            if (response) {
              bomObj.isKitAllocationNotRequiredApprove = bomObj.isNotRequiredKitAllocation;
            }
          });
        }
        else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_KIT_ALLOCATION_REQUIRED_CONFIRAMTION);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              bomObj.kitAllocationNotRequiredComment = null;
              bomObj.isKitAllocationNotRequiredApprove = false;
              bindCustomerApprovedComments(bomObj);
            }
          }, () => {
            bomObj.isNotRequiredKitAllocation = true;
          });
        }
      };

      // Create dynamic context list
      function initDynamicContextMenu() {
        // context menu object

        vm.dynamicContextMenu = {
          contextMenu: {
            items: {
              'search_google': {
                name: vm.BOM_SUB_MENU_OPTION.search_google.name,
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 1) {
                    return true;
                  }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || row === undefined) {
                    return true;
                  } else if (col !== _colMfgPNIndex && col !== _colDistPNIndex && col !== _colMfgCodeIndex && col !== _colDistributorIndex) {
                    return true;
                  } else if ((col === _colMfgPNIndex && !vm.bomModel[row].mfgPN) || (col === _colDistPNIndex && !vm.bomModel[row].distPN)
                    || (col === _colMfgCodeIndex && !vm.bomModel[row].mfgCode) || (col === _colDistributorIndex && !vm.bomModel[row].distributor)) {
                    return true;
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }
                  const bomObj = vm.bomModel[options.start.row];
                  switch (options.start.col) {
                    case _colMfgPNIndex: {
                      const mfgPN = bomObj.mfgPN;
                      BaseService.searchToGoogle(mfgPN);
                      break;
                    }
                    case _colDistPNIndex: {
                      const distPN = bomObj.distPN;
                      BaseService.searchToGoogle(distPN);
                      break;
                    }
                    case _colMfgCodeIndex: {
                      const mfgCode = bomObj.mfgCode;
                      BaseService.searchToGoogle(mfgCode);
                      break;
                    }
                    case _colDistributorIndex: {
                      const distributor = bomObj.distributor;
                      BaseService.searchToGoogle(distributor);
                      break;
                    }
                  }
                }
              },
              'search_dk': {
                name: vm.BOM_SUB_MENU_OPTION.search_dk.name,
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 1) {
                    return true;
                  }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || row === undefined) {
                    return true;
                  } else if (col !== _colMfgPNIndex && col !== _colDistPNIndex) {
                    return true;
                  } else if ((col === _colMfgPNIndex && !vm.bomModel[row].mfgPN) || (col === _colDistPNIndex && !vm.bomModel[row].distPN)) {
                    return true;
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }
                  const bomObj = vm.bomModel[options.start.row];
                  switch (options.start.col) {
                    case _colMfgPNIndex: {
                      const mfgPN = encodeURIComponent(bomObj.mfgPN);
                      BaseService.openURLInNew(RFQTRANSACTION.API_LINKS.DIGIKEY + mfgPN);
                      break;
                    }
                    case _colDistPNIndex: {
                      const distPN = encodeURIComponent(bomObj.distPN);
                      BaseService.openURLInNew(RFQTRANSACTION.API_LINKS.DIGIKEY + distPN);
                      break;
                    }
                  }
                }
              },
              'search_fc': {
                name: vm.BOM_SUB_MENU_OPTION.search_fc.name,
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 0) {
                    return true;
                  }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || row === undefined) {
                    return true;
                  } else if (col !== _colMfgPNIndex && col !== _colDistPNIndex) {
                    return true;
                  } else if ((col === _colMfgPNIndex && !vm.bomModel[row].mfgPN) || (col === _colDistPNIndex && !vm.bomModel[row].distPN)) {
                    return true;
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }
                  const bomObj = vm.bomModel[options.start.row];
                  switch (options.start.col) {
                    case _colMfgPNIndex: {
                      const mfgPN = encodeURIComponent(bomObj.mfgPN);
                      BaseService.openURLInNew(RFQTRANSACTION.API_LINKS.FINDCHIPS + mfgPN);
                      break;
                    }
                    case _colDistPNIndex: {
                      const distPN = encodeURIComponent(bomObj.distPN);
                      BaseService.openURLInNew(RFQTRANSACTION.API_LINKS.FINDCHIPS + distPN);
                      break;
                    }
                  }
                }
              },
              'search_part': {
                name: vm.BOM_SUB_MENU_OPTION.search_part.name,
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 0) {
                    return true;
                  }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || row === undefined) {
                    return true;
                  } else if (col !== _colMfgPNIndex && col !== _colDistPNIndex && col !== _colCPNIndex) {
                    return true;
                  } else if ((col === _colMfgPNIndex && !vm.bomModel[row].mfgPN) || (col === _colDistPNIndex && !vm.bomModel[row].distPN) || (col === _colCPNIndex && !vm.bomModel[row].custPN)) {
                    return true;
                  } else {
                    return false;
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }
                  const bomObj = vm.bomModel[options.start.row];
                  switch (options.start.col) {
                    case _colMfgPNIndex: {
                      const mfgPN = encodeURIComponent(bomObj.mfgPN);
                      BaseService.goToPartList(mfgPN);
                      break;
                    }
                    case _colDistPNIndex: {
                      const distPN = encodeURIComponent(bomObj.distPN);
                      BaseService.goToSupplierPartList(distPN);
                      break;
                    }
                    case _colCPNIndex: {
                      const custPN = encodeURIComponent(bomObj.custPN);
                      BaseService.goToPartList(custPN);
                      break;
                    }
                  }
                }
              },
              'searchmfg': {
                name: vm.BOM_SUB_MENU_OPTION.searchmfg.name,
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 1) {
                    return true;
                  }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || row === undefined) {
                    return true;
                  } else if (col !== _colMfgCodeIndex) {
                    return true;
                  } else if (col === _colMfgCodeIndex && !vm.bomModel[row].mfgCode) {
                    return true;
                  } else {
                    const bomObj = vm.bomModel[row];
                    if (col === _colMfgCodeIndex && bomObj.mfgCodeID && bomObj.mfgCodeID > 0) {
                      return false;
                    } else {
                      return true;
                    }
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }
                  const bomObj = vm.bomModel[options.start.row];
                  if (options.start.col === _colMfgCodeIndex) {
                    OpenMFGCodePopup(bomObj.mfgCodeID, CORE.MFG_TYPE.MFG);
                  }
                }
              },
              'searchdisty': {
                name: vm.BOM_SUB_MENU_OPTION.searchdisty.name,
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 1) {
                    return true;
                  }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || row === undefined) {
                    return true;
                  } else if (col !== _colDistributorIndex) {
                    return true;
                  } else if (col === _colDistributorIndex && !vm.bomModel[row].distributor) {
                    return true;
                  } else {
                    const bomObj = vm.bomModel[row];
                    if (col === _colDistributorIndex && bomObj.distMfgCodeID) {
                      return false;
                    } else {
                      return true;
                    }
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }
                  const bomObj = vm.bomModel[options.start.row];
                  if (options.start.col === _colDistributorIndex) {
                    OpenMFGCodePopup(bomObj.distMfgCodeID, CORE.MFG_TYPE.DIST);
                  }
                }
              },
              'search': {
                name: vm.BOM_SUB_MENU_OPTION.search.name,
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 1) {
                    return true;
                  }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || row === undefined) {
                    return true;
                  } else if (col !== _colMfgPNIndex && col !== _colDistPNIndex && col !== _colCPNIndex) {
                    return true;
                  } else if ((col === _colMfgPNIndex && !vm.bomModel[row].mfgPN) || (col === _colDistPNIndex && !vm.bomModel[row].distPN) || (col === _colCPNIndex && !vm.bomModel[row].custPN)) {
                    return true;
                  } else {
                    const bomObj = vm.bomModel[row];
                    if (col === _colDistPNIndex && bomObj.distMfgPNID) {
                      return false;
                    } else if (col === _colMfgPNIndex && bomObj.mfgPNID && bomObj.mfgPNID > 0) {
                      return false;
                    } else if (col === _colCPNIndex && bomObj.custPNID && bomObj.custPNID > 0) {
                      return false;
                    } else {
                      return true;
                    }
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }
                  const bomObj = vm.bomModel[options.start.row];
                  switch (options.start.col) {
                    case _colMfgPNIndex: {
                      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG.toLowerCase(), bomObj.mfgPNID, USER.PartMasterTabs.Detail.Name);
                      break;
                    }
                    case _colDistPNIndex: {
                      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.DIST.toLowerCase(), bomObj.distMfgPNID, USER.PartMasterTabs.Detail.Name);
                      break;
                    }
                    case _colCPNIndex: {
                      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG.toLowerCase(), bomObj.custPNID, USER.PartMasterTabs.Detail.Name);
                      break;
                    }
                  }
                }
              },
              'update_part_attribute': {
                name: vm.BOM_SUB_MENU_OPTION.update_part_attribute.name,
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 1) {
                    return true;
                  }
                  if (vm.isBOMReadOnly) {
                    return true;
                  }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || row === undefined) {
                    return true;
                  } else if (col !== _colMfgPNIndex && col !== _colDistPNIndex && col !== _colCPNIndex) {
                    return true;
                  } else if ((col === _colMfgPNIndex && !vm.bomModel[row].mfgPN)) {
                    return true;
                  } else {
                    const bomObj = vm.bomModel[row];
                    if (col === _colMfgPNIndex && bomObj.mfgPNID && bomObj.mfgPNID > 0) {
                      return false;
                    } else {
                      return true;
                    }
                  }
                },
                callback: function () {
                  var selected = _hotRegisterer.getSelected()[0];
                  var row = selected[0];

                  var bomObj = vm.bomModel[row];
                  if (bomObj) {
                    vm.updatePartAttribute(bomObj);
                  }
                }
              },
              'search_cpn': {
                name: vm.BOM_SUB_MENU_OPTION.search_cpn.name,
                hidden: function () {
                  let selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 1) {
                    return true;
                  }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || col !== _colCPNIndex || (col === _colCPNIndex && !vm.bomModel[row].custPN)) {
                    return true;
                  } else {
                    return false;
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }

                  const bomObj = vm.bomModel[options.start.row];
                  const custPN = encodeURIComponent(bomObj.custPN);
                  if (vm.cutomerID !== null) {
                    BaseService.goToCustomerCPNList(vm.cutomerID, custPN);
                  }
                }
              },
              'show_data_sheet': {
                name: vm.BOM_SUB_MENU_OPTION.show_data_sheet.name,
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 1) {
                    return true;
                  }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row !== null && row !== undefined && col === _colMfgPNIndex && vm.bomModel[row].mfgPN && vm.bomModel[row].mfgPNID && vm.bomModel[row].dataSheetLink) {
                    return false;
                  } else {
                    return true;
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }
                  const bomObj = vm.bomModel[options.start.row];
                  if (bomObj && bomObj.dataSheetLink) {
                    BaseService.openURLInNew(bomObj.dataSheetLink);
                  }
                }
              },
              'additional_comment': {
                name: vm.BOM_SUB_MENU_OPTION.additional_comment.name,
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 1) {
                    return true;
                  }
                  selected = selected[0];
                  const row = selected[0];
                  if (row === null || row === undefined) {
                    return true;
                  } else {
                    const bomObj = vm.bomModel[row];
                    if ((bomObj && !bomObj.id) || vm.isBOMReadOnly) {
                      return true;
                    }
                  }
                },
                callback: function (key, options, event) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }
                  const bomObj = vm.bomModel[options.start.row];
                  vm.addAdditionalComment(event, bomObj);
                }
              },
              'show_issue': {
                name: vm.BOM_SUB_MENU_OPTION.show_issue.name,
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 1) {
                    return true;
                  }
                  selected = selected[0];
                  const row = selected[0];
                  if (row === null || row === undefined) {
                    return true;
                  } else {
                    const bomObj = vm.bomModel[row];
                    if (!vm.liveInternalVersion || !bomObj.id) {
                      return true;
                    }
                  }
                },
                callback: function (key, options, event) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }
                  const bomObj = vm.bomModel[options.start.row];
                  vm.showNarrativeHistory(event, bomObj._lineID);
                }
              },
              'add_mfr': {
                key: vm.BOM_SUB_MENU_OPTION.add_mfr.value,
                name: vm.BOM_SUB_MENU_OPTION.add_mfr.name,
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 1) { return true; }

                  selected = selected[0];
                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || row === undefined || col !== _colMfgCodeIndex || !vm.bomModel[row].mfgCode || (vm.bomModel[row].mfgCode && vm.bomModel[row].mfgCode.toLowerCase() === 'flextron') || vm.bomModel[row].mfgCodeID) {
                    return true;
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }
                  const bomObj = vm.bomModel[options.start.row];
                  addMFGCode(bomObj, options.start.row, options.start.col, CORE.MESSAGE_CONSTANT.ADD_NEW);
                }
              },
              'add_correct_part': {
                key: vm.BOM_SUB_MENU_OPTION.add_correct_part.value,
                name: vm.BOM_SUB_MENU_OPTION.add_correct_part.name,
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 1) { return true; }

                  selected = selected[0];
                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || row === undefined || col !== _colMfgPNIndex || !vm.bomModel[row].mfgPN || vm.bomModel[row].mfgPNID) {
                    return true;
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }

                  const bomObj = vm.bomModel[options.start.row];
                  addMFGPN(bomObj, options.start.row, options.start.col, PartCorrectList.CorrectPart);
                }
              },
              'add_incorrect_part': {
                key: vm.BOM_SUB_MENU_OPTION.add_incorrect_part.value,
                name: vm.BOM_SUB_MENU_OPTION.add_incorrect_part.name,
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 1) { return true; }
                  if (!vm.enabledIncorrectPartOnBOM) {
                    return true;
                  }
                  selected = selected[0];
                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || row === undefined || col !== _colMfgPNIndex || !vm.bomModel[row].mfgPN || vm.bomModel[row].mfgPNID) {
                    return true;
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }

                  const bomObj = vm.bomModel[options.start.row];
                  addMFGPN(bomObj, options.start.row, options.start.col, PartCorrectList.IncorrectPart);
                }
              },
              'add_tbd_part': {
                key: vm.BOM_SUB_MENU_OPTION.add_tbd_part.value,
                name: vm.BOM_SUB_MENU_OPTION.add_tbd_part.name,
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 1) { return true; }

                  selected = selected[0];
                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || row === undefined || col !== _colMfgPNIndex || !vm.bomModel[row].mfgPN || vm.bomModel[row].mfgPNID) {
                    return true;
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }

                  const bomObj = vm.bomModel[options.start.row];
                  addMFGPN(bomObj, options.start.row, options.start.col, PartCorrectList.UnknownPart);
                }
              },
              'add_dist': {
                name: vm.BOM_SUB_MENU_OPTION.add_dist.name,
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 1) {
                    return true;
                  }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || row === undefined || (col !== _colDistributorIndex && col !== _colDistPNIndex) || vm.isBOMReadOnly) {
                    return true;
                  }
                  if ((!vm.bomModel[row].distributor || vm.bomModel[row].distMfgCodeID) && (!vm.bomModel[row].distPN || vm.bomModel[row].distMfgPNID)) {
                    return true;
                  }
                  if ((col === _colDistributorIndex && vm.bomModel[row].distributor && vm.bomModel[row].distMfgCodeID) || (col === _colDistPNIndex && vm.bomModel[row].distPN && vm.bomModel[row].distMfgPNID) || (col === _colDistributorIndex && !vm.bomModel[row].distributor) || (col === _colDistPNIndex && !vm.bomModel[row].distPN)) {
                    return true;
                  }
                },
                submenu: {
                  items: _menuItemsAddDIST
                }
              },
              'hsep1': '---------',
              'row_above': {
                name: vm.BOM_SUB_MENU_OPTION.row_above.name,
                disabled: function () {
                  const selected = _hotRegisterer.getSelected();
                  if (selected && selected.length > 1) {
                    return true;
                  }
                  return vm.isBOMReadOnly ? vm.isBOMReadOnly : vm.selectedFilter !== _bomFilters.ALL.CODE;
                },
                callback: function () {
                  vm.isNewRowAdd = true;
                  const index = _hotRegisterer.getSelected()[0][0];
                  const mergedCellInfo = getMergeCellInfoByRow(index);
                  if (mergedCellInfo) {
                    _hotRegisterer.alter('insert_row', mergedCellInfo.row, 1);
                  } else {
                    _hotRegisterer.alter('insert_row', index, 1);
                  }
                }
              },
              'row_below': {
                name: vm.BOM_SUB_MENU_OPTION.row_below.name,
                disabled: function () {
                  /*  for disable context menu for last row */
                  var rowcount = _hotRegisterer.countRows();
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1) {
                    return true;
                  }
                  const index = selectedRange[0][0];
                  return vm.isBOMReadOnly ? vm.isBOMReadOnly : vm.selectedFilter !== _bomFilters.ALL.CODE || (rowcount === index + 1);
                },
                callback: function () {
                  vm.isNewRowAdd = true;
                  const index = _hotRegisterer.getSelected()[0][0];
                  const mergedCellInfo = getMergeCellInfoByRow(index);
                  if (mergedCellInfo) {
                    _hotRegisterer.alter('insert_row', mergedCellInfo.row + mergedCellInfo.rowspan, 1);
                  } else {
                    _hotRegisterer.alter('insert_row', index + 1, 1);
                  }
                }
              },
              'hsep6': '---------',
              'row_lineitem_above': {
                name: function () {
                  if (_hotRegisterer && _hotRegisterer.getSelected()) {
                    const selectedRange = _hotRegisterer.getSelected();
                    const row = selectedRange[0][0];
                    let bomObj = vm.bomModel[row];
                    if (bomObj) {
                      const issubstitutesAllow = _.find(vm.bomModel, (data) => { if (data._lineID === bomObj._lineID && data.substitutesAllow === _substitutesAllowList[1].value) { return data; } });
                      if (!bomObj.substitutesAllow && issubstitutesAllow) {
                        bomObj = issubstitutesAllow;
                      }
                      if (bomObj.substitutesAllow === _substitutesAllowList[1].value) {
                        return stringFormat('{0} ({1})', vm.BOM_SUB_MENU_OPTION.row_lineitem_above.name, 'Substitution Not Allowed');
                      }
                    }
                  }
                  return vm.BOM_SUB_MENU_OPTION.row_lineitem_above.name;
                },
                hidden: function () {
                  if (_hotRegisterer && _hotRegisterer.getSelected()) {
                    return false;
                  }
                  else {
                    return true;
                  }
                },
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const range = selectedRange[0];
                  //if (range[0] != range[2] || range[0] == (vm.bomModel.length - 1))
                  if (range[0] !== range[2]) {
                    return true;
                  }

                  const mergedCellInfo = getMergeCellInfoByRow(range[0]);
                  if (mergedCellInfo && mergedCellInfo.row !== range[0]) {
                    return true;
                  }

                  const row = selectedRange[0][0];

                  let bomObj = vm.bomModel[row];
                  if (bomObj && bomObj.partcategoryID) {
                    const partCategoryObj = _typeList.find((y) => y.Value === bomObj.partcategoryID);
                    if (partCategoryObj && partCategoryObj.id !== CORE.PartCategory.Component) {
                      return true;
                    }
                  }
                  const issubstitutesAllow = _.find(vm.bomModel, (data) => { if (data._lineID === bomObj._lineID && data.substitutesAllow === _substitutesAllowList[1].value) { return data; } });
                  if (!bomObj.substitutesAllow && issubstitutesAllow) {
                    bomObj = issubstitutesAllow;
                  }
                  if (bomObj && (bomObj.mfgPNID && (bomObj.isMFGGoodPart === PartCorrectList.IncorrectPart || bomObj.mfgPNID === CORE.NOTAVAILABLEMFRPNID))) { //bomObj.isMFGGoodPart == PartCorrectList.IncorrectPart ||  || bomObj.distMfgPNID && bomObj.isDistGoodPart == PartCorrectList.IncorrectPart
                    return true;
                  } else if (bomObj.substitutesAllow === _substitutesAllowList[1].value) {
                    return true;
                  }
                  else {
                    return false;
                  }
                },
                callback: function () {
                  if (checkInvalidLineItem()) {
                    return true;
                  }
                  const index = _hotRegisterer.getSelected()[0][0];
                  if (!vm.bomModel[index]._lineID) {
                    const model = {
                      title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                      textContent: RFQTRANSACTION.BOM.ITEM_REQUIRED,
                      multiple: true
                    };
                    DialogFactory.alertDialog(model);
                  } else {
                    _hotRegisterer.alter('insert_row', index, 1);
                    const newItem = vm.bomModel[index];
                    const previousItem = vm.bomModel[index + 1];

                    // _lineID set as 'temp' because of issue on merging new row to empty new row
                    const mergedCellInfo = getMergeCellInfoByRow(index + 1);
                    if (mergedCellInfo) {
                      if (!vm.bomModel[mergedCellInfo.row]._lineID) {
                        for (let i = mergedCellInfo.row; i < mergedCellInfo.row + mergedCellInfo.rowspan; i++) {
                          vm.bomModel[i]._lineID = 'temp';
                        }
                      }
                    }
                    else {
                      if (previousItem && !previousItem._lineID) {
                        previousItem._lineID = 'temp';
                      }
                    }
                    if (previousItem) {
                      newItem._lineID = previousItem._lineID;
                      newItem.cust_lineID = previousItem.cust_lineID;
                      newItem.isNewAdd = false;
                      newItem.suggestedGoodPartStep = newItem.suggestedGoodDistPartStep = newItem.mfgGoodPartMappingStep = newItem.distGoodPartMappingStep = true;
                      newItem.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                      _sourceHeaderVisible.forEach((item) => {
                        if (_multiFields.indexOf(item.field) === -1) {
                          newItem[item.field] = previousItem[item.field];
                        }
                      });
                    }
                    _invalidCells.forEach((item) => {
                      if (item[0] >= index) {
                        item[0]++;
                      }
                    });
                    // if filter apply then have to call for update actual object of BOM model
                    if (isFilterApply) {
                      newItem.hidden = false;
                      vm.refBomModel.splice(vm.refBomModel.indexOf(vm.bomModel[index + 1]), 0, newItem);
                      updateCloneObject(isFilterApply);
                    }

                    $timeout(() => {
                      mergeCommonCells();
                    });
                  }
                }
              },
              'row_lineitem_below': {
                name: function () {
                  if (_hotRegisterer && _hotRegisterer.getSelected()) {
                    const selectedRange = _hotRegisterer.getSelected();
                    const row = selectedRange[0][0];
                    let bomObj = vm.bomModel[row];
                    if (bomObj) {
                      const issubstitutesAllow = _.find(vm.bomModel, (data) => { if (data._lineID === bomObj._lineID && data.substitutesAllow === _substitutesAllowList[1].value) { return data; } });
                      if (!bomObj.substitutesAllow && issubstitutesAllow) {
                        bomObj = issubstitutesAllow;
                      }
                      if (bomObj.substitutesAllow === _substitutesAllowList[1].value) {
                        return stringFormat('{0} ({1})', vm.BOM_SUB_MENU_OPTION.row_lineitem_below.name, 'Substitution Not Allowed');
                      }
                    }
                  }
                  return vm.BOM_SUB_MENU_OPTION.row_lineitem_below.name;
                },
                hidden: function () {
                  if (_hotRegisterer && _hotRegisterer.getSelected()) {
                    return false;
                  }
                  else {
                    return true;
                  }
                },
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const range = selectedRange[0];
                  if (range[0] !== range[2] || range[0] === (vm.bomModel.length - 1)) {
                    return true;
                  }

                  const mergedCellInfo = getMergeCellInfoByRow(range[0]);
                  if (mergedCellInfo && (mergedCellInfo.row + mergedCellInfo.rowspan - 1) !== range[0]) {
                    return true;
                  }
                  const row = selectedRange[0][0];

                  let bomObj = vm.bomModel[row];

                  if (bomObj && bomObj.partcategoryID) {
                    const partCategoryObj = _typeList.find((y) => y.Value === bomObj.partcategoryID);
                    if (partCategoryObj && partCategoryObj.id !== CORE.PartCategory.Component) {
                      return true;
                    }
                  }
                  const issubstitutesAllow = _.find(vm.bomModel, (data) => { if (data._lineID === bomObj._lineID && data.substitutesAllow === _substitutesAllowList[1].value) { return data; } });
                  if (!bomObj.substitutesAllow && issubstitutesAllow) {
                    bomObj = issubstitutesAllow;
                  }


                  if (bomObj && (bomObj.mfgPNID && (bomObj.isMFGGoodPart === PartCorrectList.IncorrectPart || bomObj.mfgPNID === CORE.NOTAVAILABLEMFRPNID))) { //bomObj.isMFGGoodPart == PartCorrectList.IncorrectPart || || bomObj.distMfgPNID && bomObj.isDistGoodPart == PartCorrectList.IncorrectPart
                    return true;
                  } else if (bomObj.substitutesAllow === _substitutesAllowList[1].value) {
                    return true;
                  }
                  else {
                    return false;
                  }
                },
                callback: function () {
                  if (checkInvalidLineItem()) {
                    return true;
                  }
                  const index = _hotRegisterer.getSelected()[0][0];
                  if (!vm.bomModel[index]._lineID) {
                    const model = {
                      title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                      textContent: RFQTRANSACTION.BOM.ITEM_REQUIRED,
                      multiple: true
                    };
                    DialogFactory.alertDialog(model);
                  } else {
                    _hotRegisterer.alter('insert_row', index + 1, 1);

                    // _lineID set as 'temp' because of issue on merging new row to empty new row
                    const mergedCellInfo = getMergeCellInfoByRow(index);
                    if (mergedCellInfo) {
                      if (!vm.bomModel[mergedCellInfo.row]._lineID) {
                        for (let i = mergedCellInfo.row; i <= mergedCellInfo.row + mergedCellInfo.rowspan; i++) {
                          vm.bomModel[i]._lineID = 'temp';
                        }
                      }
                    }
                    else {
                      if (!vm.bomModel[index]._lineID) {
                        vm.bomModel[index]._lineID = 'temp';
                      }
                    }

                    vm.bomModel[index + 1]._lineID = vm.bomModel[index]._lineID;
                    vm.bomModel[index + 1].cust_lineID = vm.bomModel[index].cust_lineID;
                    vm.bomModel[index + 1].isNewAdd = false;
                    vm.bomModel[index + 1].suggestedGoodPartStep = vm.bomModel[index + 1].suggestedGoodDistPartStep = vm.bomModel[index + 1].mfgGoodPartMappingStep = vm.bomModel[index + 1].distGoodPartMappingStep = true;
                    vm.bomModel[index + 1].customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                    _invalidCells.forEach((item) => {
                      if (item[0] >= index + 1) {
                        item[0]++;
                      }
                    });
                    // if filter apply then have to call for update actual object of BOM model
                    if (isFilterApply) {
                      const newItem = vm.bomModel[index + 1];
                      newItem.hidden = false;
                      vm.refBomModel.splice(vm.refBomModel.indexOf(vm.bomModel[index]) + 1, 0, newItem);
                    }
                    updateCloneObject(isFilterApply);
                    $timeout(() => {
                      mergeCommonCells();
                    });
                  }
                }
              },
              'hsep2': '---------',
              'enable_cust_line': {
                name: vm.BOM_SUB_MENU_OPTION.enable_cust_line.name,
                hidden: function () {
                  if (_hotRegisterer && _hotRegisterer.getSelected()) {
                    const selectedRange = _hotRegisterer.getSelected();
                    const col = selectedRange[0][1];
                    if (col !== _colCustItemIndex) {
                      return true;
                    }
                  }
                  else {
                    return false;
                  }
                },
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();

                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  // const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  if (col !== _colCustItemIndex) {
                    return true;
                  } else {
                    return false;
                  }
                },
                callback: function () {
                  var row = _hotRegisterer.getSelected()[0][0];
                  var bomObj = vm.bomModel[row];
                  bomObj.isUnlockCustomerBOMLine = true;
                }
              },
              'suggest_alternate_parts': {
                name: vm.BOM_SUB_MENU_OPTION.suggest_alternate_parts.name,
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!vm.enabledSuggestAlternatePartOnBOM) {
                    return true;
                  }
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const bomObj = vm.bomModel[row];
                  if (bomObj.substitutesAllow === _substitutesAllowList[1].value) {
                    return true;
                  }
                  if (!bomObj || !bomObj.mfgPNID || !bomObj._lineID) {
                    return true;
                  }
                  if (bomObj && bomObj.partcategoryID) {
                    const partCategoryObj = _typeList.find((y) => y.Value === bomObj.partcategoryID);
                    if (partCategoryObj && partCategoryObj.id !== CORE.PartCategory.Component) {
                      return true;
                    }
                  }
                  if ((col === _colMfgCodeIndex || col === _colMfgPNIndex) && bomObj.mfgPNID && bomObj.isMFGGoodPart === PartCorrectList.CorrectPart) {
                    return false;
                  } else if ((col === _colDistributorIndex || col === _colDistPNIndex) && bomObj.distMfgPNID && bomObj.isDistGoodPart === PartCorrectList.CorrectPart) {
                    return false;
                  } else {
                    return true;
                  }
                },
                callback: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  var row = selectedRange[0][0];
                  var col = selectedRange[0][1];
                  var bomObj = vm.bomModel[row];
                  alternatePartsPopup(bomObj, false, col);
                }
              },
              'suggest_rohs_replacement_parts': {
                name: vm.BOM_SUB_MENU_OPTION.suggest_rohs_replacement_parts.name,
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!vm.enabledSuggestRoHSReplacementPartOnBOM) {
                    return true;
                  }
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const bomObj = vm.bomModel[row];
                  if (bomObj.substitutesAllow === _substitutesAllowList[1].value) {
                    return true;
                  }
                  if (!bomObj || !bomObj.mfgPNID || !bomObj._lineID) {
                    return true;
                  }
                  if (bomObj && bomObj.partcategoryID) {
                    const partCategoryObj = _typeList.find((y) => y.Value === bomObj.partcategoryID);
                    if (partCategoryObj && partCategoryObj.id !== CORE.PartCategory.Component) {
                      return true;
                    }
                  }
                  if ((col === _colMfgCodeIndex || col === _colMfgPNIndex) && bomObj.mfgPNID && bomObj.isMFGGoodPart === PartCorrectList.CorrectPart) { // &
                    return false;
                  }
                  else if ((col === _colDistributorIndex || col === _colDistPNIndex) && bomObj.distMfgPNID && bomObj.isDistGoodPart === PartCorrectList.CorrectPart) { //
                    return false;
                  }
                  else {
                    return true;
                  }
                },
                callback: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  var row = selectedRange[0][0];
                  var col = selectedRange[0][1];
                  var bomObj = vm.bomModel[row];
                  alternatePartsPopup(bomObj, true, col);
                }
              },
              'suggest_good_parts': {
                name: vm.BOM_SUB_MENU_OPTION.suggest_good_parts.name,
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];

                  const bomObj = vm.bomModel[row];

                  if (!bomObj) {
                    return true;
                  }
                  if ((col === _colMfgCodeIndex || col === _colMfgPNIndex) && bomObj.mfgPNID && bomObj.isMFGGoodPart === PartCorrectList.IncorrectPart) {
                    return false;
                  } else if ((col === _colDistributorIndex || col === _colDistPNIndex) && bomObj.distMfgPNID && bomObj.isDistGoodPart === PartCorrectList.IncorrectPart) {
                    return false;
                  } else {
                    return true;
                  }
                },
                callback: function () {
                  var selected = _hotRegisterer.getSelected()[0];
                  var row = selected[0];
                  var col = selected[1];

                  var bomObj = vm.bomModel[row];
                  suggestGoodPart(bomObj, col);
                }
              },
              'add_cpn_mapping': {
                name: vm.BOM_SUB_MENU_OPTION.add_cpn_mapping.name,
                hidden: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const bomObj = vm.bomModel[row];
                  if (bomObj && bomObj.mfgPNID && bomObj.custPNID && !bomObj.isMPNAddedinCPN && bomObj.mismatchCustpartRevStep && bomObj.mismatchCPNandCustpartRevStep) {
                    return false;
                  } else {
                    return true;
                  }
                },
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];

                  const bomObj = vm.bomModel[row];

                  if (!bomObj) {
                    return true;
                  }
                  if ((col === _colMfgCodeIndex || col === _colMfgPNIndex) && bomObj.mfgPNID && bomObj.isMFGGoodPart !== PartCorrectList.IncorrectPart && !bomObj.isMPNAddedinCPN && bomObj.mismatchCustpartRevStep && bomObj.mismatchCPNandCustpartRevStep) {
                    return false;
                  } else if ((col === _colDistributorIndex || col === _colDistPNIndex) && bomObj.distMfgPNID && bomObj.isDistGoodPart !== PartCorrectList.IncorrectPart) {
                    return false;
                  } else {
                    return true;
                  }
                },
                callback: function () {
                  var selected = _hotRegisterer.getSelected()[0];
                  var row = selected[0];

                  var bomObj = vm.bomModel[row];
                  if (bomObj) {
                    bomObj.isMPNAddedinCPN = true;
                    bomObj.AddedinCPN = true;
                    bomObj.MPNNotAddedinCPNError = null;
                    mfgVerificationStepFn(bomObj, row);
                  }
                }
              },
              'part_program_mapping': {
                name: vm.BOM_SUB_MENU_OPTION.part_program_mapping.name,
                hidden: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const bomObj = vm.bomModel[row];
                  if (bomObj && bomObj.mfgPNID && (bomObj.programingRequired || (bomObj.mountingID === -2 || bomObj.functionalID === -2))) {
                    return false;
                  } else {
                    return true;
                  }
                },
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];

                  const bomObj = vm.bomModel[row];

                  if (!bomObj) {
                    return true;
                  }
                  if (col !== _colMfgCodeIndex && col !== _colMfgPNIndex) {
                    return true;
                  }
                  if ((bomObj.mountingID === -2 || bomObj.functionalID === -2) && bomObj.programingStatus === _programingStatusList[0].value) {
                    return false;
                  }
                  if (bomObj.mfgPNID && bomObj.programingRequired && (bomObj.programingStatus === _programingStatusList[4].value || bomObj.programingStatus === _programingStatusList[5].value)) {
                    return false;
                  } else {
                    return true;
                  }
                },
                callback: function () {
                  var selected = _hotRegisterer.getSelected()[0];
                  var row = selected[0];

                  var bomObj = vm.bomModel[row];
                  if (bomObj) {
                    vm.partProgramMapping();
                  }
                }
              },
              'suggest_epoxy_parts': {
                name: vm.BOM_SUB_MENU_OPTION.suggest_epoxy_parts.name,
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const bomObj = vm.bomModel[row];
                  if (!bomObj || !bomObj.mfgPNID) {
                    return true;
                  }
                  if (col !== _colMfgCodeIndex && col !== _colMfgPNIndex && col !== _colDistributorIndex && col !== _colDistPNIndex) {
                    return true;
                  }
                  if (bomObj.isEpoxyMount) {
                    return false;
                  } else {
                    return true;
                  }
                },
                callback: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  var row = selectedRange[0][0];
                  var col = selectedRange[0][1];
                  var bomObj = vm.bomModel[row];
                  epoxyMaterialProcessPopup(bomObj, col);
                }
              },
              'suggest_packaging_alias': {
                name: vm.BOM_SUB_MENU_OPTION.suggest_packaging_alias.name,
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }
                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const bomObj = vm.bomModel[row];
                  if (!bomObj || !bomObj.mfgPNID || !bomObj._lineID) {
                    return true;
                  }
                  if (bomObj && bomObj.partcategoryID) {
                    const partCategoryObj = _typeList.find((y) => parseInt(y.Value) === parseInt(bomObj.partcategoryID));
                    if (partCategoryObj && partCategoryObj.id !== CORE.PartCategory.Component) {
                      return true;
                    }
                  }
                  if ((col === _colMfgCodeIndex || col === _colMfgPNIndex) && bomObj.mfgPNID && bomObj.isMFGGoodPart === PartCorrectList.CorrectPart && !isBOMObjInValid(partInvalidMatchList, bomObj)) {
                    return false;
                  } else if ((col === _colDistributorIndex || col === _colDistPNIndex) && bomObj.distMfgPNID && bomObj.isDistGoodPart === PartCorrectList.CorrectPart && !isBOMObjInValid(partInvalidMatchList, bomObj)) {
                    return false;
                  } else {
                    return true;
                  }
                },
                callback: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  var row = selectedRange[0][0];
                  var col = selectedRange[0][1];
                  var bomObj = vm.bomModel[row];
                  packagingAliasPartsPopup(bomObj, col);
                }
              },
              'unlock_part': {
                name: vm.BOM_SUB_MENU_OPTION.unlock_part.name,
                hidden: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const bomObj = vm.bomModel[row];
                  const existIndexs = [_colMfgCodeIndex, _colMfgPNIndex, _colDistributorIndex, _colDistPNIndex];
                  if (!existIndexs.includes(col)) {
                    return true;
                  }
                  if (bomObj && bomObj.mfgPNID && bomObj.mfgPNID !== CORE.TBDMFRPNID && bomObj.mfgPNID !== CORE.NOTAVAILABLEMFRPNID && !isBOMObjInValid(partInvalidMatchList, bomObj) && !bomObj.isUnlockApprovedPart) {
                    return false;
                  } else {
                    return true;
                  }
                },
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];

                  const existIndexs = [_colMfgCodeIndex, _colMfgPNIndex, _colDistributorIndex, _colDistPNIndex];

                  if (!existIndexs.includes(col)) {
                    return true;
                  }
                  const bomObj = vm.bomModel[row];
                  if (bomObj && bomObj.mfgPNID !== CORE.TBDMFRPNID && bomObj.mfgPNID !== CORE.NOTAVAILABLEMFRPNID && !isBOMObjInValid(partInvalidMatchList, bomObj) && !bomObj.isUnlockApprovedPart) {
                    return false;
                  } else {
                    return true;
                  }
                },
                callback: function () {
                  var row = _hotRegisterer.getSelected()[0][0];
                  var bomObj = vm.bomModel[row];

                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();

                  passwordApproval().then((response) => {
                    if (response) {
                      bomObj.isUnlockApprovedPart = true;
                      bomObj.isUpdate = true;
                      //If any detail of BOM is changed then update the flag
                      vm.isBOMChanged = BOMFactory.isBOMChanged = true;
                      BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];
                    }
                  });
                }
              },
              'lock_part': {
                name: vm.BOM_SUB_MENU_OPTION.lock_part.name,
                hidden: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const bomObj = vm.bomModel[row];
                  const existIndexs = [_colMfgCodeIndex, _colMfgPNIndex, _colDistributorIndex, _colDistPNIndex];
                  if (!existIndexs.includes(col)) {
                    return true;
                  }
                  if (bomObj && bomObj.mfgPNID !== CORE.TBDMFRPNID && bomObj.mfgPNID !== CORE.NOTAVAILABLEMFRPNID && !isBOMObjInValid(partInvalidMatchList, bomObj) && bomObj.isUnlockApprovedPart) {
                    return false;
                  } else {
                    return true;
                  }
                },
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];

                  const existIndexs = [_colMfgCodeIndex, _colMfgPNIndex, _colDistributorIndex, _colDistPNIndex];

                  if (!existIndexs.includes(col)) {
                    return true;
                  }
                  const bomObj = vm.bomModel[row];
                  if (bomObj && bomObj.mfgPNID !== CORE.TBDMFRPNID && bomObj.mfgPNID !== CORE.NOTAVAILABLEMFRPNID && !isBOMObjInValid(partInvalidMatchList, bomObj) && bomObj.isUnlockApprovedPart) {
                    return false;
                  } else {
                    return true;
                  }
                },
                callback: function () {
                  var row = _hotRegisterer.getSelected()[0][0];
                  var bomObj = vm.bomModel[row];

                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();

                  if (bomObj) {
                    bomObj.isUnlockApprovedPart = false;
                    bomObj.isUpdate = true;
                    //If any detail of BOM is changed then update the flag
                    vm.isBOMChanged = BOMFactory.isBOMChanged = true;
                    BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];
                  }
                }
              },
              'approve_mounting_part': {
                name: vm.BOM_SUB_MENU_OPTION.approve_mounting_part.name,
                hidden: function () {
                  const selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }
                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const existIndexs = [_colMfgCodeIndex, _colMfgPNIndex];
                  if (!existIndexs.includes(col)) {
                    return true;
                  }
                  const bomObj = vm.bomModel[row];
                  if (bomObj && bomObj.mfgPNID && !bomObj.approvedMountingType && (bomObj.mismatchMountingTypeStep === false || bomObj.mismatchMountingTypeStep === 0 || bomObj.mismatchFunctionalCategoryStep === false || bomObj.mismatchFunctionalCategoryStep === 0)) {
                    return false;
                  } else {
                    return true;
                  }
                },
                disabled: function () {
                  const selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }
                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const existIndexs = [_colMfgCodeIndex, _colMfgPNIndex];

                  if (!existIndexs.includes(col)) {
                    return true;
                  }
                  const bomObj = vm.bomModel[row];
                  if (bomObj && bomObj.mfgPNID && (!bomObj.mismatchRequiredProgrammingStep || (bomObj.programingRequiredStep || (bomObj.programingStatus === _programingStatusList[4].value || bomObj.programingStatus === _programingStatusList[5].value || bomObj.programingStatus === _programingStatusList[1].value || bomObj.programingStatus === _programingStatusList[0].value || bomObj.isBuyDNPQty === _buyDNPQTYList[3].value))) && checkAbletoApproveMoutingType(bomObj)) {
                    if (!bomObj.mismatchRequiredProgrammingStep || !bomObj.mismatchProgrammingStatusStep) {
                      return true;
                    }
                  }
                  if (bomObj && bomObj.mfgPNID && (!bomObj.restrictUsePermanentlyStep || !bomObj.restrictUseExcludingAliasStep)) {
                    return true;
                  }

                  if (!bomObj || !bomObj.mfgPNID || bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) {
                    return true;
                  } else if (bomObj.mfgPNID && bomObj.isMFGGoodPart === PartCorrectList.IncorrectPart || bomObj.restrictUseInBOMStep || bomObj.restrictUseInBOMExcludingAliasStep || bomObj.restrictCPNUseInBOMStep) {
                    return true;
                  }
                  if ((!bomObj.restrictUseWithPermissionStep || (vm.AssyRoHSDeviation !== vm.RoHSDeviationDet.WithApproval && !bomObj.nonRohsStep))) {
                    return true;
                  }

                  if (bomObj && bomObj.mfgPNID && !bomObj.approvedMountingType && (bomObj.mismatchMountingTypeStep === false || bomObj.mismatchMountingTypeStep === 0 || bomObj.mismatchFunctionalCategoryStep === false || bomObj.mismatchFunctionalCategoryStep === 0) && checkAbletoApproveMoutingType(bomObj)) {
                    return false;
                  } else {
                    return true;
                  }
                },
                callback: function () {
                  const row = _hotRegisterer.getSelected()[0][0];
                  const bomObj = vm.bomModel[row];

                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();

                  customerApprovalPopup(bomObj, CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALTITLE.APPROVE_MOUNTING_TYPE, false, CORE.CUSTOMERAPPROVALFOR.ApprovedMountingType).then((response) => {
                    if (response) {
                      bomObj.approvedMountingType = true;
                      bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED;
                      bindCustomerApprovedComments(bomObj);
                      setAsApprovedPart(bomObj, row, true);
                    }
                  });
                }
              },
              'unapprove_mounting_part': {
                name: vm.BOM_SUB_MENU_OPTION.unapprove_mounting_part.name,
                hidden: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }
                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const existIndexs = [_colMfgCodeIndex, _colMfgPNIndex];
                  if (!existIndexs.includes(col)) {
                    return true;
                  }
                  const bomObj = vm.bomModel[row];
                  if (bomObj && bomObj.mfgPNID && bomObj.approvedMountingType) {
                    return false;
                  } else {
                    return true;
                  }
                },
                disabled: function () {
                  const selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const existIndexs = [_colMfgCodeIndex, _colMfgPNIndex];

                  if (!existIndexs.includes(col)) {
                    return true;
                  }
                  const bomObj = vm.bomModel[row];

                  if (bomObj && bomObj.mfgPNID && bomObj.approvedMountingType) {
                    return false;
                  } else {
                    return true;
                  }
                },
                callback: function () {
                  const row = _hotRegisterer.getSelected()[0][0];
                  const bomObj = vm.bomModel[row];

                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();
                  customerApprovalPopup(bomObj, CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALTITLE.DISAPPROVE_MOUNTING_TYPE, false, CORE.CUSTOMERAPPROVALFOR.ApprovedMountingType).then((response) => {
                    if (response) {
                      bomObj.approvedMountingType = false;
                      bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                      bindCustomerApprovedComments(bomObj);
                      setAsApprovedPart(bomObj, row, false);
                    }
                  });
                }
              },
              'approve_part': {
                name: vm.BOM_SUB_MENU_OPTION.approve_part.name,
                hidden: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const bomObj = vm.bomModel[row];
                  if (bomObj && !isBOMObjInValid(partInvalidMatchList, bomObj) && !bomObj.isUnlockApprovedPart) {
                    return true;
                  }
                  if (bomObj && bomObj.mfgPNID && bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED && bomObj.restrictCPNUseWithPermissionStep) {
                    return false;
                  } else {
                    return true;
                  }
                },
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];

                  const existIndexs = [_colMfgCodeIndex, _colMfgPNIndex, _colDistributorIndex, _colDistPNIndex];

                  if (!existIndexs.includes(col)) {
                    return true;
                  }
                  const bomObj = vm.bomModel[row];

                  if (bomObj && !bomObj.approvedMountingType && (bomObj.mismatchMountingTypeStep === false || bomObj.mismatchMountingTypeStep === 0) && checkAbletoApproveMoutingType(bomObj)) {
                    return true;
                  }
                  if (bomObj && bomObj.mfgPNID && (!bomObj.restrictUsePermanentlyStep || !bomObj.restrictUseExcludingAliasStep) && checkAbletoApproveMoutingType(bomObj)) {
                    return true;
                  }
                  if (bomObj && bomObj.mfgPNID && (!bomObj.mismatchRequiredProgrammingStep || (bomObj.programingRequiredStep || (bomObj.programingStatus === _programingStatusList[4].value || bomObj.programingStatus === _programingStatusList[5].value || bomObj.programingStatus === _programingStatusList[1].value || bomObj.programingStatus === _programingStatusList[0].value || bomObj.isBuyDNPQty === _buyDNPQTYList[3].value))) && checkAbletoApproveMoutingType(bomObj)) {
                    if (!bomObj.mismatchRequiredProgrammingStep || !bomObj.mismatchProgrammingStatusStep) {
                      return true;
                    }
                  }
                  if (bomObj && bomObj.mfgPNID && (!bomObj.restrictUseWithPermissionStep || vm.AssyRoHSDeviation === vm.RoHSDeviationDet.WithApproval && !bomObj.nonRohsStep) && checkAbletoApproveMoutingType(bomObj)) {
                    return false;
                  }
                  if (bomObj && vm.checkErrorIsAllowEgnrApproved(bomObj) && checkAbletoApproveMoutingType(bomObj)) {
                    return false;
                  }

                  if (!bomObj || !bomObj.mfgPNID || bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) {
                    return true;
                  } else if (bomObj.mfgPNID && bomObj.isMFGGoodPart === PartCorrectList.IncorrectPart || bomObj.restrictUseInBOMStep || bomObj.restrictUseInBOMExcludingAliasStep || bomObj.restrictCPNUseInBOMStep) {
                    return true;
                  }
                  else {
                    return true;
                  }
                },
                callback: function () {
                  var row = _hotRegisterer.getSelected()[0][0];
                  var bomObj = vm.bomModel[row];

                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();

                  customerApprovalPopup(bomObj, CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALTITLE.APPROVEPART, true).then((response) => {
                    if (response) {
                      if (_isAssyRoHS && bomObj.refMainCategoryID === vm.RoHSMainCategory.NonRoHS) {
                        passwordApproval().then((response) => {
                          if (response) {
                            bindCustomerApprovedComments(bomObj);
                            setAsApprovedPart(bomObj, row, true);
                          }
                        });
                      }
                      else {
                        bindCustomerApprovedComments(bomObj);
                        setAsApprovedPart(bomObj, row, true);
                      }
                    }
                  });
                }
              },
              'unapprove_part': {
                name: vm.BOM_SUB_MENU_OPTION.unapprove_part.name,
                hidden: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const bomObj = vm.bomModel[row];
                  if (bomObj && bomObj.mfgPNID && (bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING)) {
                    return false;
                  } else {
                    return true;
                  }
                },
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const bomObj = vm.bomModel[row];

                  if (!bomObj || !bomObj.mfgPNID) {
                    return true;
                  } else if (bomObj && !vm.checkErrorIsAllowEgnrApproved(bomObj)) {
                    return true;
                  } else if (bomObj.mfgPNID && (bomObj.isMFGGoodPart && parseInt(bomObj.isMFGGoodPart) === PartCorrectList.IncorrectPart) || bomObj.restrictUseInBOMStep || bomObj.restrictUseInBOMExcludingAliasStep || bomObj.restrictUseInBOMExcludingAliasWithPermissionStep || bomObj.restrictUseInBOMWithPermissionStep || bomObj.restrictCPNUseInBOMStep || !bomObj.restrictUsePermanentlyStep || !bomObj.restrictUseExcludingAliasStep) {
                    return true;
                  }
                  if (bomObj && bomObj.approvedMountingType && (bomObj.mismatchMountingTypeStep === false || bomObj.mismatchMountingTypeStep === 0 || bomObj.mismatchFunctionalCategoryStep === false || bomObj.mismatchFunctionalCategoryStep === 0)) {
                    return true;
                  }
                  if ((col === _colMfgCodeIndex || col === _colMfgPNIndex)) {
                    return false;
                  } else if ((col === _colDistributorIndex || col === _colDistPNIndex)) {
                    return false;
                  } else {
                    return true;
                  }
                },
                callback: function () {
                  var row = _hotRegisterer.getSelected()[0][0];
                  var bomObj = vm.bomModel[row];

                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();
                  customerApprovalPopup(bomObj, CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALTITLE.DISAPPROVEDPART, true).then((response) => {
                    if (response) {
                      if (_isAssyRoHS && bomObj.refMainCategoryID === vm.RoHSMainCategory.NonRoHS) {
                        passwordApproval().then((response) => {
                          if (response) {
                            bindCustomerApprovedComments(bomObj);
                            setAsApprovedPart(bomObj, row, false);
                          }
                        });
                      }
                      else {
                        bindCustomerApprovedComments(bomObj);
                        setAsApprovedPart(bomObj, row, false);
                      }
                    }
                  });
                }
              },
              'hsep7': '---------',
              'restrict_cpn_use_in_BOM': {
                name: vm.BOM_SUB_MENU_OPTION.restrict_cpn_use_in_BOM.name,
                hidden: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const bomObj = vm.bomModel[row];
                  if (col !== _colCPNIndex) {
                    return true;
                  }
                  if (!bomObj.restrictCPNUsePermanentlyStep) {
                    return true;
                  }
                  if (bomObj && bomObj.custPNID && bomObj.custPNID !== '' && !bomObj.restrictCPNUseInBOMStep && bomObj.restrictCPNUsePermanentlyStep && bomObj.restrictCPNUseWithPermissionStep) {
                    return false;
                  } else {
                    return true;
                  }
                },
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const bomObj = vm.bomModel[row];

                  if (bomObj && bomObj.custPN && bomObj.custPNID) {
                    return false;
                  }
                  return true;
                },
                callback: function () {
                  var row = _hotRegisterer.getSelected()[0][0];
                  var bomObj = vm.bomModel[row];

                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();
                  customerApprovalPopup(bomObj, CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALTITLE.RESTICTCPNBOMPART, false, CORE.CUSTOMERAPPROVALFOR.CPN).then((response) => {
                    if (response) {
                      setAsCPNRestrictPart(bomObj, row, true);
                    }
                  });
                }
              },
              'Unrestrict_cpn_use_in_BOM': {
                name: vm.BOM_SUB_MENU_OPTION.Unrestrict_cpn_use_in_BOM.name,
                hidden: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const bomObj = vm.bomModel[row];
                  if (col !== _colCPNIndex) {
                    return true;
                  }
                  if (bomObj && bomObj.custPNID && bomObj.restrictCPNUseInBOMStep && bomObj.restrictCPNUsePermanentlyStep && bomObj.restrictCPNUseWithPermissionStep) {
                    return false;
                  } else {
                    return true;
                  }
                },
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const bomObj = vm.bomModel[row];

                  if (bomObj && bomObj.custPN && bomObj.custPNID) {
                    return false;
                  }
                  return true;
                },
                callback: function () {
                  var row = _hotRegisterer.getSelected()[0][0];
                  var bomObj = vm.bomModel[row];

                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();
                  customerApprovalPopup(bomObj, CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALTITLE.UNRESTICTCPNBOMPART, false, CORE.CUSTOMERAPPROVALFOR.CPN).then((response) => {
                    if (response) {
                      setAsCPNRestrictPart(bomObj, row, false);
                    }
                  });
                }
              },
              'restrict_use_in_BOM': {
                name: vm.BOM_SUB_MENU_OPTION.restrict_use_in_BOM.name,
                hidden: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const bomObj = vm.bomModel[row];
                  if (bomObj && bomObj.mfgPNID && !bomObj.restrictUseInBOMStep) {
                    return false;
                  } else {
                    return true;
                  }
                },
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const bomObj = vm.bomModel[row];
                  if (!(col === _colMfgCodeIndex || col === _colMfgPNIndex) || (!bomObj && bomObj.mfgPNID && (bomObj.restrictUseInBOMStep || bomObj.restrictUseInBOMWithPermissionStep || bomObj.restrictUseInBOMExcludingAliasStep || bomObj.restrictUseInBOMExcludingAliasWithPermissionStep))) {
                    return true;
                  }
                  if (!bomObj.restrictUsePermanentlyStep || !bomObj.restrictUseExcludingAliasStep) {
                    return true;
                  }
                  if ((col === _colMfgCodeIndex || col === _colMfgPNIndex) && bomObj && bomObj.mfgPNID && !bomObj.restrictUseInBOMStep && bomObj.partcategoryID && bomObj.partcategoryID.toLowerCase() !== CORE.PartCategoryName.Assembly.toLowerCase()) {
                    return false;
                  } else {
                    return true;
                  }
                },
                callback: function () {
                  var row = _hotRegisterer.getSelected()[0][0];
                  var bomObj = vm.bomModel[row];

                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();
                  customerApprovalPopup(bomObj, CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALTITLE.RESTICTBOMPART, true).then((response) => {
                    if (response) {
                      setAsRestrictPart(bomObj, row, true);
                    }
                  });
                }
              },
              'unrestrict_use_in_BOM': {
                name: vm.BOM_SUB_MENU_OPTION.unrestrict_use_in_BOM.name,
                hidden: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const bomObj = vm.bomModel[row];
                  if (bomObj && bomObj.mfgPNID && bomObj.restrictUseInBOMStep) {
                    return false;
                  } else {
                    return true;
                  }
                },
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const bomObj = vm.bomModel[row];

                  if (!(col === _colMfgCodeIndex || col === _colMfgPNIndex)) {
                    return true;
                  }
                  if ((col === _colMfgCodeIndex || col === _colMfgPNIndex) && bomObj && bomObj.mfgPNID && bomObj.restrictUseInBOMStep) {
                    return false;
                  } else {
                    return true;
                  }
                },
                callback: function () {
                  var row = _hotRegisterer.getSelected()[0][0];
                  var bomObj = vm.bomModel[row];

                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();
                  customerApprovalPopup(bomObj, CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALTITLE.UNRESTICTBOMPART, true).then((response) => {
                    if (response) {
                      setAsRestrictPart(bomObj, row, false);
                    }
                  });
                }
              },
              'restrict_use_in_BOM_with_permission': {
                name: vm.BOM_SUB_MENU_OPTION.restrict_use_in_BOM_with_permission.name,
                hidden: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const bomObj = vm.bomModel[row];
                  if (bomObj && bomObj.mfgPNID && !bomObj.restrictUseInBOMWithPermissionStep) {
                    return false;
                  } else {
                    return true;
                  }
                },
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const bomObj = vm.bomModel[row];

                  if (!(col === _colMfgCodeIndex || col === _colMfgPNIndex) || (bomObj && bomObj.mfgPNID && (bomObj.restrictUseInBOMStep || bomObj.restrictUseInBOMWithPermissionStep || bomObj.restrictUseInBOMExcludingAliasStep || bomObj.restrictUseInBOMExcludingAliasWithPermissionStep))) {
                    return true;
                  }
                  if (!bomObj.restrictUsePermanentlyStep || !bomObj.restrictUseExcludingAliasStep) {
                    return true;
                  }
                  if ((col === _colMfgCodeIndex || col === _colMfgPNIndex) && bomObj && bomObj.mfgPNID && bomObj.restrictUsePermanentlyStep && (!bomObj.restrictUseInBOMStep || !bomObj.restrictUseInBOMExcludingAliasStep) && !bomObj.restrictUseInBOMWithPermissionStep && bomObj.partcategoryID && bomObj.partcategoryID.toLowerCase() !== CORE.PartCategoryName.Assembly.toLowerCase()) {
                    return false;
                  } else {
                    return true;
                  }
                },
                callback: function () {
                  var row = _hotRegisterer.getSelected()[0][0];
                  var bomObj = vm.bomModel[row];

                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();
                  customerApprovalPopup(bomObj, CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALTITLE.RESTICTBOMWITHPERMISSIOMPART, true).then((response) => {
                    if (response) {
                      setAsRestrictWithPermissionPart(bomObj, row, true);
                    }
                  });
                }
              },
              'unrestrict_use_in_BOM_with_permission': {
                name: vm.BOM_SUB_MENU_OPTION.unrestrict_use_in_BOM_with_permission.name,
                hidden: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const bomObj = vm.bomModel[row];
                  if (bomObj && bomObj.mfgPNID && bomObj.restrictUseInBOMWithPermissionStep) {
                    return false;
                  } else {
                    return true;
                  }
                },
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const bomObj = vm.bomModel[row];

                  if (!(col === _colMfgCodeIndex || col === _colMfgPNIndex)) {
                    return true;
                  }
                  if ((col === _colMfgCodeIndex || col === _colMfgPNIndex) && bomObj && bomObj.mfgPNID && (!bomObj.restrictUseInBOMStep || !bomObj.restrictUseInBOMExcludingAliasStep) && bomObj.restrictUseInBOMWithPermissionStep) {
                    return false;
                  } else {
                    return true;
                  }
                },
                callback: function () {
                  var row = _hotRegisterer.getSelected()[0][0];
                  var bomObj = vm.bomModel[row];

                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();
                  customerApprovalPopup(bomObj, CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALTITLE.UNRESTICTBOMWITHPERMISSIOMPART, true).then((response) => {
                    if (response) {
                      setAsRestrictWithPermissionPart(bomObj, row, false);
                    }
                  });
                }
              },
              'restrict_part_excluding_alias_use_in_BOM': {
                name: vm.BOM_SUB_MENU_OPTION.restrict_part_excluding_alias_use_in_BOM.name,
                hidden: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const bomObj = vm.bomModel[row];
                  if (bomObj && bomObj.mfgPNID && !bomObj.restrictUseInBOMExcludingAliasStep) {
                    return false;
                  } else {
                    return true;
                  }
                },
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const bomObj = vm.bomModel[row];

                  if (!bomObj.restrictUsePermanentlyStep || !bomObj.restrictUseExcludingAliasStep) {
                    return true;
                  }
                  if (!(col === _colMfgCodeIndex || col === _colMfgPNIndex) || (bomObj && bomObj.mfgPNID && (bomObj.restrictUseInBOMStep || bomObj.restrictUseInBOMWithPermissionStep || bomObj.restrictUseInBOMExcludingAliasStep || bomObj.restrictUseInBOMExcludingAliasWithPermissionStep))) {
                    return true;
                  }
                  if ((col === _colMfgCodeIndex || col === _colMfgPNIndex) && bomObj && bomObj.mfgPNID && bomObj.restrictUsePermanentlyStep && bomObj.restrictUseExcludingAliasStep && (!bomObj.restrictUseInBOMStep || !bomObj.restrictUseExcludingAliasStep) && bomObj.partcategoryID && bomObj.partcategoryID.toLowerCase() !== CORE.PartCategoryName.Assembly.toLowerCase()) {
                    return false;
                  } else {
                    return true;
                  }
                },
                callback: function () {
                  var row = _hotRegisterer.getSelected()[0][0];
                  var bomObj = vm.bomModel[row];
                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();
                  customerApprovalPopup(bomObj, CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALTITLE.RESTICTBOMEXPACKAINGALIASPART, true).then((response) => {
                    if (response) {
                      setAsRestrictExcludingAliasPart(bomObj, row, true);
                    }
                  });
                  //}
                }
              },
              'unrestrict_part_excluding_alias_use_in_BOM': {
                name: vm.BOM_SUB_MENU_OPTION.unrestrict_part_excluding_alias_use_in_BOM.name,
                hidden: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const bomObj = vm.bomModel[row];
                  if (bomObj && bomObj.mfgPNID && bomObj.restrictUseInBOMExcludingAliasStep) {
                    return false;
                  } else {
                    return true;
                  }
                },
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const bomObj = vm.bomModel[row];

                  if (!(col === _colMfgCodeIndex || col === _colMfgPNIndex)) {
                    return true;
                  }
                  if ((col === _colMfgCodeIndex || col === _colMfgPNIndex) && bomObj && bomObj.mfgPNID && bomObj.restrictUseInBOMExcludingAliasStep) {
                    return false;
                  } else {
                    return true;
                  }
                },
                callback: function () {
                  var row = _hotRegisterer.getSelected()[0][0];
                  var bomObj = vm.bomModel[row];
                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();
                  customerApprovalPopup(bomObj, CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALTITLE.UNRESTICTBOMEXPACKAINGALIASPART, true).then((response) => {
                    if (response) {
                      setAsRestrictExcludingAliasPart(bomObj, row, false);
                    }
                  });
                  //}
                }
              },
              'restrict_part_excluding_alias_use_in_BOM_with_permission': {
                name: vm.BOM_SUB_MENU_OPTION.restrict_part_excluding_alias_use_in_BOM_with_permission.name,
                hidden: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const bomObj = vm.bomModel[row];
                  if (!bomObj.restrictUsePermanentlyStep || !bomObj.restrictUseExcludingAliasStep) {
                    return true;
                  }
                  if (bomObj && bomObj.mfgPNID && !bomObj.restrictUseInBOMExcludingAliasWithPermissionStep) {
                    return false;
                  } else {
                    return true;
                  }
                },
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const bomObj = vm.bomModel[row];

                  if (!(col === _colMfgCodeIndex || col === _colMfgPNIndex) || (bomObj && bomObj.mfgPNID && (bomObj.restrictUseInBOMStep || bomObj.restrictUseInBOMWithPermissionStep || bomObj.restrictUseInBOMExcludingAliasStep || bomObj.restrictUseInBOMExcludingAliasWithPermissionStep || !bomObj.restrictUseExcludingAliasStep))) {
                    return true;
                  }
                  if ((col === _colMfgCodeIndex || col === _colMfgPNIndex) && bomObj && bomObj.mfgPNID && bomObj.restrictUsePermanentlyStep && (!bomObj.restrictUseInBOMStep || !bomObj.restrictUseExcludingAliasStep) && bomObj.partcategoryID && bomObj.partcategoryID.toLowerCase() !== CORE.PartCategoryName.Assembly.toLowerCase()) {
                    return false;
                  } else {
                    return true;
                  }
                },
                callback: function () {
                  var row = _hotRegisterer.getSelected()[0][0];
                  var bomObj = vm.bomModel[row];
                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();
                  customerApprovalPopup(bomObj, CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALTITLE.RESTICTBOMEXPACKAINGALIASWITHPERMISSIOMPART, true).then((response) => {
                    if (response) {
                      setAsRestrictExcludingAliasPartWithPermissionPart(bomObj, row, true);
                    }
                  });
                  //}
                }
              },
              'unrestrict_part_excluding_alias_use_in_BOM_with_permission': {
                name: vm.BOM_SUB_MENU_OPTION.unrestrict_part_excluding_alias_use_in_BOM_with_permission.name,
                hidden: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const bomObj = vm.bomModel[row];
                  if (bomObj && bomObj.mfgPNID && bomObj.restrictUseInBOMExcludingAliasWithPermissionStep) {
                    return false;
                  } else {
                    return true;
                  }
                },
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const bomObj = vm.bomModel[row];

                  if (!(col === _colMfgCodeIndex || col === _colMfgPNIndex)) {
                    return true;
                  }
                  if ((col === _colMfgCodeIndex || col === _colMfgPNIndex) && bomObj && bomObj.mfgPNID && bomObj.restrictUseInBOMExcludingAliasWithPermissionStep) {
                    return false;
                  } else {
                    return true;
                  }
                },
                callback: function () {
                  var row = _hotRegisterer.getSelected()[0][0];
                  var bomObj = vm.bomModel[row];
                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();
                  customerApprovalPopup(bomObj, CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALTITLE.UNRESTICTBOMEXPACKAINGALIASWITHPERMISSIOMPART, true).then((response) => {
                    if (response) {
                      setAsRestrictExcludingAliasPartWithPermissionPart(bomObj, row, false);
                    }
                  });
                  //}
                }
              },
              'hsep8': '---------',
              'ca_cpn': {
                name: vm.BOM_SUB_MENU_OPTION.ca_cpn.name,
                hidden: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const bomObj = vm.bomModel[row];
                  if (!(col === _colCPNIndex || col === _colMfgCodeIndex || col === _colMfgPNIndex)) {
                    return true;
                  }
                  if (bomObj && bomObj.custPNID && (bomObj.restrictCPNUseWithPermissionStep === false || bomObj.restrictCPNUseWithPermissionStep === 0)) {
                    return false;
                  } else {
                    return true;
                  }
                },
                callback: function () {
                  var row = _hotRegisterer.getSelected()[0][0];
                  var bomObj = vm.bomModel[row];
                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();
                  customerApprovalPopup(bomObj, CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALTITLE.CPN, false, CORE.CUSTOMERAPPROVALFOR.CPN).then((response) => {
                    if (response) {
                      customerapprovalItem(bomObj, row, CORE.CUSTOMERAPPROVALFOR.CPN, true);
                    }
                  });
                }
              },
              'cust_unapproved_cpn': {
                name: vm.BOM_SUB_MENU_OPTION.cust_unapproved_cpn.name,
                hidden: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length !== 1 || vm.isBOMReadOnly) {
                    return true;
                  }

                  const row = selectedRange[0][0];
                  const col = selectedRange[0][1];
                  const bomObj = vm.bomModel[row];
                  if (!(col === _colCPNIndex || col === _colMfgCodeIndex || col === _colMfgPNIndex)) {
                    return true;
                  }
                  if (bomObj && bomObj.custPNID && (bomObj.restrictCPNUseWithPermissionStep === true || bomObj.restrictCPNUseWithPermissionStep === 1) && bomObj.customerApprovalCPN === RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                    return false;
                  } else {
                    return true;
                  }
                },
                callback: function () {
                  var row = _hotRegisterer.getSelected()[0][0];
                  var bomObj = vm.bomModel[row];
                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();
                  customerApprovalPopup(bomObj, CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALTITLE.CPNDISAPPROVED, false, CORE.CUSTOMERAPPROVALFOR.CPN).then((response) => {
                    if (response) {
                      customerapprovalItem(bomObj, row, CORE.CUSTOMERAPPROVALFOR.CPN, false);
                    }
                  });
                }
              },
              'ca_qparefdes': {
                name: vm.BOM_SUB_MENU_OPTION.ca_qparefdes.name,
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 1) {
                    return true;
                  }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];
                  if (row === null || (col !== _colQPAIndex && col !== _colRefDesigIndex) || vm.isBOMReadOnly || (vm.bomModel[row] && vm.bomModel[row].qpaDesignatorStep !== vm.QPAREFDESValidationStepsFlag.Verifyed)) {
                    return true;
                  }
                  if ((col === _colQPAIndex || col === _colRefDesigIndex) && !(vm.bomModel[row].customerApprovalForQPAREFDESStep === false || vm.bomModel[row].customerApprovalForQPAREFDESStep === 0)) {
                    return true;
                  }
                },
                callback: function () {
                  var row = _hotRegisterer.getSelected()[0][0];
                  var bomObj = vm.bomModel[row];
                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();
                  customerApprovalPopup(bomObj, CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALTITLE.QPA, false, CORE.CUSTOMERAPPROVALFOR.QPA_REFDES).then((response) => {
                    if (response) {
                      customerapprovalItem(bomObj, row, CORE.CUSTOMERAPPROVALFOR.QPA_REFDES, true);
                    }
                  });
                }
              },
              'oddly_named_refdes': {
                name: vm.BOM_SUB_MENU_OPTION.oddly_named_refdes.name,
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 1) {
                    return true;
                  }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];
                  if (row === null || (col !== _colQPAIndex && col !== _colRefDesigIndex && col !== _colDNPQty && col !== _colDNPDesig) || vm.isBOMReadOnly || (vm.bomModel[row] && (vm.bomModel[row].qpaDesignatorStep === vm.QPAREFDESValidationStepsFlag.Verifyed && vm.bomModel[row].dnpQPARefDesStep === vm.QPAREFDESValidationStepsFlag.Verifyed))) {
                    return true;
                  }

                  if ((col === _colQPAIndex || col === _colRefDesigIndex) && vm.bomModel[row] && (vm.bomModel[row].customerApprovalForQPAREFDESStep === false || vm.bomModel[row].customerApprovalForQPAREFDESStep === 0) && (vm.bomModel[row].qpaDesignatorStep === vm.QPAREFDESValidationStepsFlag.Verifyed)) {
                    return true;
                  }
                  if ((col === _colDNPQty || col === _colDNPDesig) && vm.bomModel[row] && (vm.bomModel[row].customerApprovalForDNPQPAREFDESStep === false || vm.bomModel[row].customerApprovalForDNPQPAREFDESStep === 0) && (vm.bomModel[row].dnpQPARefDesStep === vm.QPAREFDESValidationStepsFlag.Verifyed)) {
                    return true;
                  }
                },
                callback: function () {
                  //var row = _hotRegisterer.getSelected()[0][0];
                  //var bomObj = vm.bomModel[row];
                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();
                  vm.openOddlyNamedRefdes();
                }
              },
              'ca_dnp_qparefdes': {
                name: vm.BOM_SUB_MENU_OPTION.ca_dnp_qparefdes.name,
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 1) {
                    return true;
                  }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];
                  if (row === null || (col !== _colDNPQty && col !== _colDNPDesig) || vm.isBOMReadOnly || (vm.bomModel[row] && vm.bomModel[row].dnpQPARefDesStep !== vm.QPAREFDESValidationStepsFlag.Verifyed)) {
                    return true;
                  }
                  if ((col === _colDNPQty || col === _colDNPDesig) && (!(vm.bomModel[row].customerApprovalForDNPQPAREFDESStep === false || vm.bomModel[row].customerApprovalForDNPQPAREFDESStep === 0) || vm.bomModel[row].dnpQPARefDesStep !== vm.QPAREFDESValidationStepsFlag.Verifyed)) {
                    return true;
                  }
                },
                callback: function () {
                  var row = _hotRegisterer.getSelected()[0][0];
                  var bomObj = vm.bomModel[row];
                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();
                  customerApprovalPopup(bomObj, CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALTITLE.DNP_QPA_REFDES, false, CORE.CUSTOMERAPPROVALFOR.DNP_QPA_REFDES).then((response) => {
                    if (response) {
                      customerapprovalItem(bomObj, row, CORE.CUSTOMERAPPROVALFOR.DNP_QPA_REFDES, true);
                    }
                  });
                }
              },
              'ca_buy': {
                name: vm.BOM_SUB_MENU_OPTION.ca_buy.name,
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 1) {
                    return true;
                  }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];
                  if (row === null || row === undefined || col !== _colBuyIndex || vm.isBOMReadOnly) {
                    return true;
                  }
                  if (col === _colBuyIndex && !(vm.bomModel[row].customerApprovalForBuyStep === false || vm.bomModel[row].customerApprovalForBuyStep === 0)) {
                    return true;
                  }
                },
                callback: function () {
                  var row = _hotRegisterer.getSelected()[0][0];
                  var bomObj = vm.bomModel[row];
                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();
                  customerApprovalPopup(bomObj, CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALTITLE.BUY, false, CORE.CUSTOMERAPPROVALFOR.BUY).then((response) => {
                    if (response) {
                      customerapprovalItem(bomObj, row, CORE.CUSTOMERAPPROVALFOR.BUY, true);
                    }
                  });
                }
              },
              'ca_dnp_buy': {
                name: vm.BOM_SUB_MENU_OPTION.ca_dnp_buy.name,
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 1) {
                    return true;
                  }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];
                  if (row === null || row === undefined || col !== _colDNPBuyIndex || vm.isBOMReadOnly) {
                    return true;
                  }
                  if (col === _colDNPBuyIndex && !(vm.bomModel[row].customerApprovalForDNPBuyStep === false || vm.bomModel[row].customerApprovalForDNPBuyStep === 0)) {
                    return true;
                  }
                },
                callback: function () {
                  var row = _hotRegisterer.getSelected()[0][0];
                  var bomObj = vm.bomModel[row];
                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();
                  customerApprovalPopup(bomObj, CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALTITLE.DNP_BUY, false, CORE.CUSTOMERAPPROVALFOR.DNP_BUY).then((response) => {
                    if (response) {
                      customerapprovalItem(bomObj, row, CORE.CUSTOMERAPPROVALFOR.DNP_BUY, true);
                    }
                  });
                }
              },
              'ca_populate': {
                name: vm.BOM_SUB_MENU_OPTION.ca_populate.name,
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected || selected.length > 1) {
                    return true;
                  }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];
                  if (row === null || row === undefined || col !== _colPopulateIndex || vm.isBOMReadOnly) {
                    return true;
                  }
                  if (col === _colPopulateIndex && !(vm.bomModel[row].customerApprovalForPopulateStep === false || vm.bomModel[row].customerApprovalForPopulateStep === 0)) {
                    return true;
                  }
                },
                callback: function () {
                  var row = _hotRegisterer.getSelected()[0][0];
                  var bomObj = vm.bomModel[row];
                  // deselected current cell so we can have a focus on pop-up element
                  _hotRegisterer.deselectCell();
                  customerApprovalPopup(bomObj, CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALTITLE.POPULATE, false, CORE.CUSTOMERAPPROVALFOR.POPULATE).then((response) => {
                    if (response) {
                      customerapprovalItem(bomObj, row, CORE.CUSTOMERAPPROVALFOR.POPULATE, true);
                    }
                  });
                }
              },
              'hsep3': '---------',
              'empty_menu': {
                name: vm.BOM_SUB_MENU_OPTION.empty_menu.name,
                disabled: true
              },
              'hsep4': '---------',
              'remove_row': {
                name() { // `name` can be a string or a function
                  return '' + vm.BOM_SUB_MENU_OPTION.remove_row.name + ' <md-icon class=\'icon-question-mark-circle help-icon\' title=\'Use Shortcut Keys to Select Rows. Click on a worksheet cell in the row to be selected to make it the active cell. Press and hold the Shift/CTRL key on the keyboard. Press and release the Arrow key on the keyboard. Release the Shift/CTRL key. All cells in the selected row are highlighted\'></md-icon>';
                },
                //name: vm.BOM_SUB_MENU_OPTION.remove_row.name,
                hidden: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || vm.isBOMReadOnly) {
                    return true;
                  }
                  selectedRange.forEach((removeBomObj) => {
                    const row = removeBomObj[0];
                    const bomObj = vm.bomModel[row];
                    if (bomObj && bomObj.custPNID && bomObj.allocatedInKit) {
                      return true;
                    };
                  });
                  return false;
                },
                disabled: function () {
                  var selectedRange = _hotRegisterer.getSelected();
                  if (!selectedRange || selectedRange.length < 1) {
                    return true;
                  }
                  selectedRange.forEach((removeBomObj) => {
                    const row = removeBomObj[0];
                    const status = vm.isBOMReadOnly ? vm.isBOMReadOnly : (!isFilterApply ? vm.bomModel.length - 1 === row : false);
                    if (status) {
                      return status;
                    }
                  });
                  return false;
                },
                callback: function () {
                  const selectedRange = [];
                  var selectedRangeList = _hotRegisterer.getSelectedRange(); // _hotRegisterer.getSelected();
                  _.each(selectedRangeList, (data) => {
                    for (let i = (data.from.row < data.to.row ? data.from.row : data.to.row); i <= (data.from.row > data.to.row ? data.from.row : data.to.row); i++) {
                      selectedRange.push([i, 0, i, 0]);
                    }
                  });
                  const allLineID = [];
                  let invalidLineID = false;
                  _.each(selectedRange, (data) => {
                    const row = data[0];
                    const bomObj = vm.bomModel[row];
                    if (bomObj && bomObj.cust_lineID) {
                      allLineID.push(bomObj);
                    } else { invalidLineID = true; }
                  });
                  _hotRegisterer.deselectCell();
                  // deselected current cell so we can have a focus on pop-up element
                  if (invalidLineID || _.filter(vm.bomModel, (bomModel) => !bomModel.cust_lineID).length > 1) {
                    const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_REMOVE_ALL_BLANK_ITEM_CONFIRM);
                    messgaeContent.message = stringFormat(messgaeContent.message, 'Blank');
                    const model = {
                      messageContent: messgaeContent,
                      btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                      canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                    };
                    return DialogFactory.messageConfirmDialog(model).then((yes) => {
                      if (yes) {
                        _.each(vm.bomModel, (item, index) => {
                          if (!item.cust_lineID) {
                            selectedRange.push([index, 0, index, 0]);
                          }
                        });
                        commonRemovalFunction(allLineID, selectedRange, true);
                      }
                    }, () => {
                      if (_hotRegisterer) {
                        _hotRegisterer.validateCells();
                      }
                      setHeaderStyle();
                    }).catch((error) => BaseService.getErrorLog(error));


                    //DialogFactory.messageAlertDialog(model).then(() => {
                    //  if (_hotRegisterer) {
                    //    _hotRegisterer.validateCells();
                    //  }
                    //  setHeaderStyle();
                    //});
                  } else {
                    commonRemovalFunction(allLineID, selectedRange);
                    //const sIDS = _.map(_.uniqBy(_.sortBy(allLineID, (msgID) => msgID.cust_lineID), 'cust_lineID'), 'cust_lineID').join(',');
                    //const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.DELETE_ROW_CONFIRMATION_MESSAGE_RFQ_BOM);
                    //messgaeContent.message = stringFormat(messgaeContent.message, sIDS ? sIDS : 'Blank');
                    //const obj = {
                    //  messageContent: messgaeContent,
                    //  btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                    //  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                    //};
                    //const AllRemoveDetails = [];
                    //return DialogFactory.messageConfirmDialog(obj).then((yes) => {
                    //  if (yes) {
                    //    _hotRegisterer.deselectCell();
                    //    _.each(selectedRange, (data) => {
                    //      if (vm.bomModel && vm.bomModel.length >= data[0] && vm.bomModel[data[0]] && vm.bomModel[data[0]].rfqAlternatePartID) {
                    //        // Manage delete part array in case of exiting line delete
                    //        bomDelete.push(vm.bomModel[data[0]].rfqAlternatePartID);
                    //        const listOfDeleteRow = _.map(_.filter(vm.bomModel, { 'id': vm.bomModel[data[0]].id }), 'rfqAlternatePartID');
                    //        if (_.difference(listOfDeleteRow, bomDelete).length === 0) {
                    //          // Manage delete line array in case of exiting line delete
                    //          rowDeleted.push(vm.bomModel[data[0]].id);
                    //        }
                    //      }

                    //      //_hotRegisterer.alter(event, (data[0] - i), 1);
                    //      const row = data[0];
                    //      const bomObj = vm.bomModel[row];
                    //      if (bomObj) {
                    //        if (bomObj.lineID) {
                    //          const lineGroupdetail = _.find(vm.refBomModel, (x) => x._lineID === bomObj._lineID && !x.lineID);
                    //          if (lineGroupdetail) {
                    //            lineGroupdetail.qpa = bomObj.qpa;
                    //            lineGroupdetail.lineID = bomObj.lineID;
                    //            lineGroupdetail.additionalComment = bomObj.additionalComment;
                    //            lineGroupdetail.additionalCommentId = bomObj.additionalCommentId;
                    //            lineGroupdetail.allocatedInKit = bomObj.allocatedInKit;
                    //            lineGroupdetail.assyRoHSStatus = bomObj.assyRoHSStatus;
                    //            lineGroupdetail.buyCustomerApprovalComment = bomObj.buyCustomerApprovalComment;
                    //            lineGroupdetail.buyDNPCustomerApprovalComment = bomObj.buyDNPCustomerApprovalComment;
                    //            lineGroupdetail.buyErrorColor = bomObj.buyErrorColor;
                    //            lineGroupdetail.buyTooltip = bomObj.buyTooltip;
                    //            lineGroupdetail.color = bomObj.color;
                    //            lineGroupdetail.componentLead = bomObj.componentLead;
                    //            lineGroupdetail.cpnCustomerApprovalComment = bomObj.cpnCustomerApprovalComment;
                    //            lineGroupdetail.cpnErrorColor = bomObj.cpnErrorColor;
                    //            lineGroupdetail.cpnTooltip = bomObj.cpnTooltip;
                    //            lineGroupdetail.custPN = bomObj.custPN;
                    //            lineGroupdetail.custPNID = bomObj.custPNID;
                    //            lineGroupdetail.cust_lineID = bomObj.cust_lineID;
                    //            lineGroupdetail.customerApprovalCPN = bomObj.customerApprovalCPN;
                    //            lineGroupdetail.customerApprovalForBuyStep = bomObj.customerApprovalForBuyStep;
                    //            lineGroupdetail.customerApprovalForDNPBuyStep = bomObj.customerApprovalForDNPBuyStep;
                    //            lineGroupdetail.customerApprovalForDNPQPAREFDESStep = bomObj.customerApprovalForDNPQPAREFDESStep;
                    //            lineGroupdetail.customerApprovalForPopulateStep = bomObj.customerApprovalForPopulateStep;
                    //            lineGroupdetail.customerApprovalForQPAREFDESStep = bomObj.customerApprovalForQPAREFDESStep;
                    //            lineGroupdetail.customerDescription = bomObj.customerDescription;
                    //            lineGroupdetail.customerPartDesc = bomObj.customerPartDesc;
                    //            lineGroupdetail.customerRev = bomObj.customerRev;
                    //            lineGroupdetail.deviceMarking = bomObj.deviceMarking;
                    //            lineGroupdetail.dnpBuyErrorColor = bomObj.dnpBuyErrorColor;
                    //            lineGroupdetail.dnpBuyTooltip = bomObj.dnpBuyTooltip;
                    //            lineGroupdetail.dnpDesig = bomObj.dnpDesig;
                    //            lineGroupdetail.dnpDesigCount = bomObj.dnpDesigCount;
                    //            lineGroupdetail.dnpQPARefDesStep = bomObj.dnpQPARefDesStep;
                    //            lineGroupdetail.dnpQty = bomObj.dnpQty;
                    //            lineGroupdetail.dnpqpaCustomerApprovalComment = bomObj.dnpqpaCustomerApprovalComment;
                    //            lineGroupdetail.dnpqpaErrorColor = bomObj.dnpqpaErrorColor;
                    //            lineGroupdetail.dnpqpaTooltip = bomObj.dnpqpaTooltip;
                    //            lineGroupdetail.duplicateCPNError = bomObj.duplicateCPNError;
                    //            lineGroupdetail.isBuyDNPQty = bomObj.isBuyDNPQty;
                    //            lineGroupdetail.isCPN = bomObj.isCPN;
                    //            lineGroupdetail.isCustPN = bomObj.isCustPN;
                    //            lineGroupdetail.isCustPNProgrammingRequire = bomObj.isCustPNProgrammingRequire;
                    //            lineGroupdetail.isCustom = bomObj.isCustom;
                    //            lineGroupdetail.isCustomerApprovedBuy = bomObj.isCustomerApprovedBuy;
                    //            lineGroupdetail.isCustomerApprovedBuyDNP = bomObj.isCustomerApprovedBuyDNP;
                    //            lineGroupdetail.isCustomerApprovedCPN = bomObj.isCustomerApprovedCPN;
                    //            lineGroupdetail.isCustomerApprovedDNPQPA = bomObj.isCustomerApprovedDNPQPA;
                    //            lineGroupdetail.isCustomerApprovedPopulate = bomObj.isCustomerApprovedPopulate;
                    //            lineGroupdetail.isCustomerApprovedQPA = bomObj.isCustomerApprovedQPA;
                    //            lineGroupdetail.isInstall = bomObj.isInstall;
                    //            lineGroupdetail.isMergedRow = bomObj.isMergedRow;
                    //            lineGroupdetail.isNotRequiredKitAllocation = bomObj.isNotRequiredKitAllocation;
                    //            lineGroupdetail.isNotRequiredKitAllocationApproved = bomObj.isNotRequiredKitAllocationApproved;
                    //            lineGroupdetail.isPurchase = bomObj.isPurchase;
                    //            lineGroupdetail.isSupplierToBuy = bomObj.isSupplierToBuy;
                    //            lineGroupdetail.isUnlockCustomerBOMLine = bomObj.isUnlockCustomerBOMLine;
                    //            lineGroupdetail.kitAllocationNotRequiredComment = bomObj.kitAllocationNotRequiredComment;
                    //            lineGroupdetail.noOfRows = bomObj.noOfRows;
                    //            lineGroupdetail.numOfPosition = bomObj.numOfPosition;
                    //            lineGroupdetail.numOfRows = bomObj.numOfRows;
                    //            lineGroupdetail.populateCustomerApprovalComment = bomObj.populateCustomerApprovalComment;
                    //            lineGroupdetail.populateErrorColor = bomObj.populateErrorColor;
                    //            lineGroupdetail.populateTooltip = bomObj.populateTooltip;
                    //            lineGroupdetail.programingStatus = bomObj.programingStatus;
                    //            lineGroupdetail.qpaCustomerApprovalComment = bomObj.qpaCustomerApprovalComment;
                    //            lineGroupdetail.qpaDesignatorStep = bomObj.qpaDesignatorStep;
                    //            lineGroupdetail.qpaErrorColor = bomObj.qpaErrorColor;
                    //            lineGroupdetail.qpaTooltip = bomObj.qpaTooltip;
                    //            lineGroupdetail.refDesig = bomObj.refDesig;
                    //            lineGroupdetail.refDesigCount = bomObj.refDesigCount;
                    //            lineGroupdetail.restrictCPNUseInBOMStep = bomObj.restrictCPNUseInBOMStep;
                    //            lineGroupdetail.restrictCPNUsePermanentlyError = bomObj.restrictCPNUsePermanentlyError;
                    //            lineGroupdetail.restrictCPNUsePermanentlyStep = bomObj.restrictCPNUsePermanentlyStep;
                    //            lineGroupdetail.restrictCPNUseWithPermissionError = bomObj.restrictCPNUseWithPermissionError;
                    //            lineGroupdetail.restrictCPNUseWithPermissionStep = bomObj.restrictCPNUseWithPermissionStep;
                    //            lineGroupdetail.substitutesAllow = bomObj.substitutesAllow;
                    //            lineGroupdetail.uom = bomObj.uom;
                    //            lineGroupdetail.uomID = bomObj.uomID;
                    //            lineGroupdetail.uomMismatchedError = bomObj.uomMismatchedError;
                    //            lineGroupdetail.uomMismatchedStep = bomObj.uomMismatchedStep;
                    //          }
                    //        }
                    //        const objBOM = {
                    //          bomObj: bomObj,
                    //          row: row
                    //        };
                    //        AllRemoveDetails.push(objBOM);
                    //        //const lineIndex = vm.refBomModel.indexOf(bomObj);
                    //        //if (lineIndex >= 0) {
                    //        //  vm.refBomModel.splice(lineIndex, 1);
                    //        //}
                    //      }
                    //      i++;
                    //    });
                    //    _.each(AllRemoveDetails, (removeItem) => {
                    //      const lineIndex = vm.refBomModel.indexOf(removeItem.bomObj);
                    //      if (lineIndex >= 0) {
                    //        vm.refBomModel.splice(lineIndex, 1);
                    //      }
                    //      _.remove(_invalidCells, (x) => x[0] === removeItem.row);

                    //      _.map(_invalidCells, (item) => {
                    //        item[0] = parseInt(item[0]);
                    //        if (item[0] > removeItem.row) {
                    //          item[0]--;
                    //        }
                    //      });
                    //    });
                    //    //vm.refBomModel = _.filter(vm.refBomModel, (modl) => modl.cust_lineID);
                    //    updateCloneObject(isFilterApply);
                    //    if (_hotRegisterer) {
                    //      _hotRegisterer.validateCells();
                    //    }
                    //    setHeaderStyle();
                    //    mergeCommonCells();
                    //    vm.isBOMChanged = BOMFactory.isBOMChanged = true;
                    //  }
                    //  else {
                    //    return false;
                    //  }
                    //}, () => {
                    //}).catch((error) => BaseService.getErrorLog(error));
                  }
                }
              }
            }
          }
        };
      }

      // common code function for
      const commonRemovalFunction = (allLineID, selectedRange, isremoveAll) => {
        const sIDS = _.map(_.uniqBy(_.sortBy(allLineID, (msgID) => msgID.cust_lineID), 'cust_lineID'), 'cust_lineID').join(',');
        const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.DELETE_ROW_CONFIRMATION_MESSAGE_RFQ_BOM);
        messgaeContent.message = stringFormat(messgaeContent.message, sIDS ? sIDS : 'Blank');
        const obj = {
          messageContent: messgaeContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const AllRemoveDetails = [];
        return DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            _.each(selectedRange, (data) => {
              if (vm.bomModel && vm.bomModel.length >= data[0] && vm.bomModel[data[0]] && vm.bomModel[data[0]].rfqAlternatePartID) {
                // Manage delete part array in case of exiting line delete
                bomDelete.push(vm.bomModel[data[0]].rfqAlternatePartID);
                const listOfDeleteRow = _.map(_.filter(vm.bomModel, { 'id': vm.bomModel[data[0]].id }), 'rfqAlternatePartID');
                if (_.difference(listOfDeleteRow, bomDelete).length === 0) {
                  // Manage delete line array in case of exiting line delete
                  rowDeleted.push(vm.bomModel[data[0]].id);
                }
              }

              //_hotRegisterer.alter(event, (data[0] - i), 1);
              const row = data[0];
              const bomObj = vm.bomModel[row];
              if (bomObj) {
                if (bomObj.lineID) {
                  const lineGroupdetail = _.find(vm.refBomModel, (x) => x._lineID === bomObj._lineID && !x.lineID);
                  if (lineGroupdetail) {
                    lineGroupdetail.qpa = bomObj.qpa;
                    lineGroupdetail.lineID = bomObj.lineID;
                    lineGroupdetail.additionalComment = bomObj.additionalComment;
                    lineGroupdetail.additionalCommentId = bomObj.additionalCommentId;
                    lineGroupdetail.allocatedInKit = bomObj.allocatedInKit;
                    lineGroupdetail.assyRoHSStatus = bomObj.assyRoHSStatus;
                    lineGroupdetail.buyCustomerApprovalComment = bomObj.buyCustomerApprovalComment;
                    lineGroupdetail.buyDNPCustomerApprovalComment = bomObj.buyDNPCustomerApprovalComment;
                    lineGroupdetail.buyErrorColor = bomObj.buyErrorColor;
                    lineGroupdetail.buyTooltip = bomObj.buyTooltip;
                    lineGroupdetail.color = bomObj.color;
                    lineGroupdetail.componentLead = bomObj.componentLead;
                    lineGroupdetail.cpnCustomerApprovalComment = bomObj.cpnCustomerApprovalComment;
                    lineGroupdetail.cpnErrorColor = bomObj.cpnErrorColor;
                    lineGroupdetail.cpnTooltip = bomObj.cpnTooltip;
                    lineGroupdetail.custPN = bomObj.custPN;
                    lineGroupdetail.custPNID = bomObj.custPNID;
                    lineGroupdetail.cust_lineID = bomObj.cust_lineID;
                    lineGroupdetail.customerApprovalCPN = bomObj.customerApprovalCPN;
                    lineGroupdetail.customerApprovalForBuyStep = bomObj.customerApprovalForBuyStep;
                    lineGroupdetail.customerApprovalForDNPBuyStep = bomObj.customerApprovalForDNPBuyStep;
                    lineGroupdetail.customerApprovalForDNPQPAREFDESStep = bomObj.customerApprovalForDNPQPAREFDESStep;
                    lineGroupdetail.customerApprovalForPopulateStep = bomObj.customerApprovalForPopulateStep;
                    lineGroupdetail.customerApprovalForQPAREFDESStep = bomObj.customerApprovalForQPAREFDESStep;
                    lineGroupdetail.customerDescription = bomObj.customerDescription;
                    lineGroupdetail.customerPartDesc = bomObj.customerPartDesc;
                    lineGroupdetail.customerRev = bomObj.customerRev;
                    lineGroupdetail.deviceMarking = bomObj.deviceMarking;
                    lineGroupdetail.dnpBuyErrorColor = bomObj.dnpBuyErrorColor;
                    lineGroupdetail.dnpBuyTooltip = bomObj.dnpBuyTooltip;
                    lineGroupdetail.dnpDesig = bomObj.dnpDesig;
                    lineGroupdetail.dnpDesigCount = bomObj.dnpDesigCount;
                    lineGroupdetail.dnpQPARefDesStep = bomObj.dnpQPARefDesStep;
                    lineGroupdetail.dnpQty = bomObj.dnpQty;
                    lineGroupdetail.dnpqpaCustomerApprovalComment = bomObj.dnpqpaCustomerApprovalComment;
                    lineGroupdetail.dnpqpaErrorColor = bomObj.dnpqpaErrorColor;
                    lineGroupdetail.dnpqpaTooltip = bomObj.dnpqpaTooltip;
                    lineGroupdetail.duplicateCPNError = bomObj.duplicateCPNError;
                    lineGroupdetail.isBuyDNPQty = bomObj.isBuyDNPQty;
                    lineGroupdetail.isCPN = bomObj.isCPN;
                    lineGroupdetail.isCustPN = bomObj.isCustPN;
                    lineGroupdetail.isCustPNProgrammingRequire = bomObj.isCustPNProgrammingRequire;
                    lineGroupdetail.isCustom = bomObj.isCustom;
                    lineGroupdetail.isCustomerApprovedBuy = bomObj.isCustomerApprovedBuy;
                    lineGroupdetail.isCustomerApprovedBuyDNP = bomObj.isCustomerApprovedBuyDNP;
                    lineGroupdetail.isCustomerApprovedCPN = bomObj.isCustomerApprovedCPN;
                    lineGroupdetail.isCustomerApprovedDNPQPA = bomObj.isCustomerApprovedDNPQPA;
                    lineGroupdetail.isCustomerApprovedPopulate = bomObj.isCustomerApprovedPopulate;
                    lineGroupdetail.isCustomerApprovedQPA = bomObj.isCustomerApprovedQPA;
                    lineGroupdetail.isInstall = bomObj.isInstall;
                    lineGroupdetail.isMergedRow = bomObj.isMergedRow;
                    lineGroupdetail.isNotRequiredKitAllocation = bomObj.isNotRequiredKitAllocation;
                    lineGroupdetail.isNotRequiredKitAllocationApproved = bomObj.isNotRequiredKitAllocationApproved;
                    lineGroupdetail.isPurchase = bomObj.isPurchase;
                    lineGroupdetail.isSupplierToBuy = bomObj.isSupplierToBuy;
                    lineGroupdetail.isUnlockCustomerBOMLine = bomObj.isUnlockCustomerBOMLine;
                    lineGroupdetail.kitAllocationNotRequiredComment = bomObj.kitAllocationNotRequiredComment;
                    lineGroupdetail.noOfRows = bomObj.noOfRows;
                    lineGroupdetail.numOfPosition = bomObj.numOfPosition;
                    lineGroupdetail.numOfRows = bomObj.numOfRows;
                    lineGroupdetail.populateCustomerApprovalComment = bomObj.populateCustomerApprovalComment;
                    lineGroupdetail.populateErrorColor = bomObj.populateErrorColor;
                    lineGroupdetail.populateTooltip = bomObj.populateTooltip;
                    lineGroupdetail.programingStatus = bomObj.programingStatus;
                    lineGroupdetail.qpaCustomerApprovalComment = bomObj.qpaCustomerApprovalComment;
                    lineGroupdetail.qpaDesignatorStep = bomObj.qpaDesignatorStep;
                    lineGroupdetail.qpaErrorColor = bomObj.qpaErrorColor;
                    lineGroupdetail.qpaTooltip = bomObj.qpaTooltip;
                    lineGroupdetail.refDesig = bomObj.refDesig;
                    lineGroupdetail.refDesigCount = bomObj.refDesigCount;
                    lineGroupdetail.restrictCPNUseInBOMStep = bomObj.restrictCPNUseInBOMStep;
                    lineGroupdetail.restrictCPNUsePermanentlyError = bomObj.restrictCPNUsePermanentlyError;
                    lineGroupdetail.restrictCPNUsePermanentlyStep = bomObj.restrictCPNUsePermanentlyStep;
                    lineGroupdetail.restrictCPNUseWithPermissionError = bomObj.restrictCPNUseWithPermissionError;
                    lineGroupdetail.restrictCPNUseWithPermissionStep = bomObj.restrictCPNUseWithPermissionStep;
                    lineGroupdetail.substitutesAllow = bomObj.substitutesAllow;
                    lineGroupdetail.uom = bomObj.uom;
                    lineGroupdetail.uomID = bomObj.uomID;
                    lineGroupdetail.uomMismatchedError = bomObj.uomMismatchedError;
                    lineGroupdetail.uomMismatchedStep = bomObj.uomMismatchedStep;
                  }
                }
                const objBOM = {
                  bomObj: bomObj,
                  row: row
                };
                AllRemoveDetails.push(objBOM);
                //const lineIndex = vm.refBomModel.indexOf(bomObj);
                //if (lineIndex >= 0) {
                //  vm.refBomModel.splice(lineIndex, 1);
                //}
              }
              i++;
            });
            _.each(AllRemoveDetails, (removeItem) => {
              const lineIndex = vm.refBomModel.indexOf(removeItem.bomObj);
              if (lineIndex >= 0) {
                vm.refBomModel.splice(lineIndex, 1);
              }
              _.remove(_invalidCells, (x) => x[0] === removeItem.row);

              _.map(_invalidCells, (item) => {
                item[0] = parseInt(item[0]);
                if (item[0] > removeItem.row) {
                  item[0]--;
                }
              });
            });
            if (isremoveAll) {
              vm.refBomModel = _.filter(vm.refBomModel, (modl) => modl.cust_lineID);
            }
            updateCloneObject(isFilterApply);
            if (_hotRegisterer) {
              _hotRegisterer.validateCells();
            }
            setHeaderStyle();
            mergeCommonCells();
            vm.isBOMChanged = BOMFactory.isBOMChanged = true;
          }
          else {
            return false;
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      };
      // Check validation for able to approved mounting type
      function checkAbletoApproveMoutingType(bomObj) {
        const lineWisepart = _.find(vm.bomModel, { _lineID: bomObj._lineID, approvedMountingType: true });
        if (lineWisepart && lineWisepart.mountingtypeID === bomObj.mountingtypeID && lineWisepart.parttypeID === bomObj.parttypeID) {
          return true;
        }
        else if (!lineWisepart) {
          return true;
        }
        return false;
      }
      // Open MFR Master Pop-up
      function OpenMFGCodePopup(mfgCodeID, selectedMfgType) {
        const mfgInfo = {
          mfgType: selectedMfgType,
          fromPageRequest: selectedMfgType
        };
        vm.cgBusyLoading = ManufacturerFactory.retriveMfgCode(mfgInfo).query({ id: mfgCodeID, refTableName: CORE.TABLE_NAME.MFG_CODE_MST }).$promise.then((response) => {
          if (response && response.data) {
            const data = {
              id: mfgCodeID,
              mfgType: response.data.mfgType,
              mfgName: response.data.mfgName,
              mfgCode: response.data.mfgCode,
              isCodeDisable: response.data.isMfgCodeUsedInFlow ? true : false,
              isCustOrDisty: response.data.isCustOrDisty,
              customerID: response.data.customerID,
              isPricingApi: response.data.isPricingApi,
              isUpdatable: true
            };
            DialogFactory.dialogService(
              CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
              CORE.MANAGE_MFGCODE_MODAL_VIEW,
              null, data).then(() => {
              }, () => {
              },
                (err) => BaseService.getErrorLog(err));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      // After Approved part validation
      function setAsApprovedPart(bomObj, row, isApproved) {
        bomObj.isCustomerUnAppoval = !isApproved;
        bomObj.customerApproval = isApproved ? RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED : RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
        bomObj.customerApprovalStepError = isApproved ? null : generateDescription(bomObj, _customerApprovalError);
        bomObj.isCustomerApprove = true;
        bomObj.isUnlockApprovedPart = !isApproved;
        if (bomObj.isCustomerUnAppoval) {
          bomObj.isCustomerUnAppoved = true;
        }
        if (!bomObj.lineMergeStep) {
          bomObj.lineMergeStep = true;
          bomObj.lineMergeStepError = null;
        }

        if (vm.AssyRoHSDeviation === vm.RoHSDeviationDet.WithApproval) {
          bomObj.nonRohsStep = true;
          bomObj.nonRohsStepError = null;
        }

        if (!bomObj.exportControlledStep) {
          bomObj.exportControlledStep = true;
          bomObj.exportControlledError = null;
        }

        if (!bomObj.restrictUseWithPermissionStep) {
          bomObj.restrictUseWithPermissionStep = true;
          bomObj.restrictUseWithPermissionError = null;
        }

        if (!bomObj.restrictUseExcludingAliasWithPermissionStep) {
          bomObj.restrictUseExcludingAliasWithPermissionStep = true;
          bomObj.restrictUseExcludingAliasWithPermissionError = null;
        }
        if (!bomObj.mismatchCustpartRevStep) {
          bomObj.mismatchCustpartRevStep = true;
          bomObj.mismatchCustpartRevError = null;
        }
        if (!bomObj.mismatchCPNandCustpartRevStep) {
          bomObj.mismatchCPNandCustpartRevStep = false;
          bomObj.mismatchCPNandCustpartRevError = null;
        }
        if (isApproved && vm.checkErrorIsAllowEgnrApproved(bomObj)) {
          bomObj.isUnlockApprovedPart = false;
        }

        mfgVerificationStepFn(bomObj, row);
        distVerificationStepFn(bomObj, row);

        //If any detail of BOM is changed then update the flag
        vm.isBOMChanged = BOMFactory.isBOMChanged = true;
        BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];
        $timeout(() => {
          setHeaderStyle();
        });
        if (_hotRegisterer) {
          _hotRegisterer.validateCells();
        }
      }
      // Restrict part
      function setAsRestrictPart(bomObj, row, isRestricted) {
        vm.cgBusyLoading = ComponentFactory.getComponentPackagingAliasByID().query({ id: bomObj.mfgPNID }).$promise.then((response) => {
          if (response && response.data && response.data.length) {
            const packagingAliasPart = _.map(response.data, 'ID');
            const objBOMList = _.filter(vm.refBomModel, (item) => {
              if (item && item.mfgPNID) {
                const isExists = _.find(packagingAliasPart, (data) => data === item.mfgPNID);
                if (isExists) {
                  return item;
                }
              }
            });
            if (objBOMList && objBOMList.length) {
              _.each(objBOMList, (objBOM) => {
                if (objBOM) {
                  objBOM.isUpdate = true;
                  objBOM.partCustomerApprovalComment = bomObj.partCustomerApprovalComment;
                  objBOM.requiredToShowOnQuoteSummary = bomObj.requiredToShowOnQuoteSummary;
                  bomObj.isCustomerApprovedQPA = bomObj.isCustomerApprovedPart;
                  objBOM.isRestrictUseInBOMStep = isRestricted;
                  objBOM.restrictUseInBOMStep = isRestricted;
                  objBOM.restrictUseInBOMError = null;
                  if (objBOM.isRestricted) {
                    objBOM.restrictUseInBOMError = generateDescription(objBOM, _restrictUseInBOMError);
                  }
                  if (isRestricted && objBOM.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                    objBOM.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED;
                    objBOM.customerApprovalStepError = null;
                  }
                  bindCustomerApprovedComments(objBOM);
                  mfgVerificationStepFn(objBOM, row);
                }
              });
            }
          }
          bomObj.isUpdate = true;
          bomObj.isRestrictUseInBOMStep = isRestricted;
          bomObj.restrictUseInBOMStep = isRestricted;
          bomObj.restrictUseInBOMError = null;
          if (bomObj.isRestricted) {
            bomObj.restrictUseInBOMError = generateDescription(bomObj, _restrictUseInBOMError);
          }
          if (isRestricted && bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
            bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED;
            bomObj.customerApprovalStepError = null;
          }
          mfgVerificationStepFn(bomObj, row);

          //If any detail of BOM is changed then update the flag
          vm.isBOMChanged = BOMFactory.isBOMChanged = true;
          BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];
          $timeout(() => {
            setHeaderStyle();
          });
          if (_hotRegisterer) {
            _hotRegisterer.validateCells();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      // Restrict with  permission
      function setAsRestrictWithPermissionPart(bomObj, row, isRestricted) {
        vm.cgBusyLoading = ComponentFactory.getComponentPackagingAliasByID().query({ id: bomObj.mfgPNID }).$promise.then((response) => {
          if (response && response.data && response.data.length) {
            const packagingAliasPart = _.map(response.data, 'ID');
            const objBOMList = _.filter(vm.refBomModel, (item) => {
              if (item && item.mfgPNID) {
                const isExists = _.find(packagingAliasPart, (data) => data === item.mfgPNID);
                if (isExists) {
                  return item;
                }
              }
            });
            if (objBOMList && objBOMList.length) {
              _.each(objBOMList, (objBOM) => {
                if (objBOM) {
                  objBOM.partCustomerApprovalComment = bomObj.partCustomerApprovalComment;
                  objBOM.requiredToShowOnQuoteSummary = bomObj.requiredToShowOnQuoteSummary;
                  bomObj.isCustomerApprovedQPA = bomObj.isCustomerApprovedPart;
                  objBOM.isUpdate = true;
                  objBOM.isRestrictUseInBOMWithPermissionStep = isRestricted;
                  objBOM.restrictUseInBOMWithPermissionStep = isRestricted;
                  objBOM.restrictUseInBOMWithPermissionError = null;
                  if (objBOM.isRestricted) {
                    objBOM.restrictUseInBOMWithPermissionError = generateDescription(objBOM, _restrictUseInBOMWithPermissionError);
                  }
                  if (isRestricted && objBOM.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                    objBOM.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED;
                    objBOM.customerApprovalStepError = null;
                  }
                  bindCustomerApprovedComments(objBOM);
                  mfgVerificationStepFn(objBOM, row);
                }
              });
            }
          }
          bomObj.isUpdate = true;
          bomObj.isRestrictUseInBOMWithPermissionStep = isRestricted;
          bomObj.restrictUseInBOMWithPermissionStep = isRestricted;
          bomObj.restrictUseInBOMWithPermissionError = null;
          if (bomObj.isRestricted) {
            bomObj.restrictUseInBOMWithPermissionError = generateDescription(bomObj, _restrictUseInBOMWithPermissionError);
          }
          if (isRestricted && bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
            bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED;
            bomObj.customerApprovalStepError = null;
          }
          mfgVerificationStepFn(bomObj, row);

          //If any detail of BOM is changed then update the flag
          vm.isBOMChanged = BOMFactory.isBOMChanged = true;
          BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];
          $timeout(() => {
            setHeaderStyle();
          });
          if (_hotRegisterer) {
            _hotRegisterer.validateCells();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      // Restrict part excluding packaging alias
      function setAsRestrictExcludingAliasPart(bomObj, row, isRestricted) {
        bomObj.isUpdate = true;
        bomObj.isRestrictUseInBOMExcludingAliasStep = isRestricted;
        bomObj.restrictUseInBOMExcludingAliasStep = isRestricted;
        bomObj.restrictUseInBOMExcludingAliasError = null;
        if (bomObj.isRestricted) {
          bomObj.restrictUseInBOMExcludingAliasError = generateDescription(bomObj, _restrictUseInBOMExcludingAliasError);
        }
        if (isRestricted && bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
          bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED;
          bomObj.customerApprovalStepError = null;
        }
        mfgVerificationStepFn(bomObj, row);

        //If any detail of BOM is changed then update the flag
        vm.isBOMChanged = BOMFactory.isBOMChanged = true;
        BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];
        $timeout(() => {
          setHeaderStyle();
        });
        if (_hotRegisterer) {
          _hotRegisterer.validateCells();
        }
      }
      // Restrict part excluding packaging alias with permission
      function setAsRestrictExcludingAliasPartWithPermissionPart(bomObj, row, isRestricted) {
        bomObj.isUpdate = true;
        bomObj.isRestrictUseInBOMExcludingAliasWithPermissionStep = isRestricted;
        bomObj.restrictUseInBOMExcludingAliasWithPermissionStep = isRestricted;
        bomObj.restrictUseInBOMExcludingAliasWithPermissionError = null;
        if (bomObj.isRestricted) {
          bomObj.restrictUseInBOMExcludingAliasWithPermissionError = generateDescription(bomObj, _restrictUseInBOMExcludingAliasWithPermissionError);
        }
        if (isRestricted && bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
          bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED;
          bomObj.customerApprovalStepError = null;
        }
        mfgVerificationStepFn(bomObj, row);

        //If any detail of BOM is changed then update the flag
        vm.isBOMChanged = BOMFactory.isBOMChanged = true;
        BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];
        $timeout(() => {
          setHeaderStyle();
        });
        if (_hotRegisterer) {
          _hotRegisterer.validateCells();
        }
      }
      // Assembly Level error Validation (Required Mounting Type and Functional Type)
      function assemblyLevelErrorUpdate() {
        // Mounting type and Functional Type validation
        var notUseMountingTypes = [];
        var notUseFunctionalTypes = [];
        _.each(_componentRequireMountingType, (item) => {
          if (!_.some(vm.refBomModel, (x) => x.mountingtypeID === item.name)) {
            notUseMountingTypes.push(item);
          }
        });
        _.each(_componentRequireFunctionalType, (item) => {
          if (!_.some(vm.refBomModel, (x) => x.parttypeID === item.name)) {
            notUseFunctionalTypes.push(item);
          }
        });
        vm.refBomModel[0].requireMountingTypeStep = true;
        vm.refBomModel[0].requireMountingTypeError = null;
        vm.refBomModel[0].requireFunctionalTypeStep = true;
        vm.refBomModel[0].requireFunctionalTypeError = null;
        if (vm.refBomModel.length > 1 && (notUseMountingTypes.length > 0 || notUseFunctionalTypes.length > 0)) {
          if (notUseMountingTypes.length > 0) {
            vm.refBomModel[0].mountingtypes = _.map(notUseMountingTypes, 'name').join(', ');
            vm.refBomModel[0].requireMountingTypeStep = false;
            vm.refBomModel[0].requireMountingTypeError = generateDescription(vm.refBomModel[0], _requireMountingTypeError);
          }
          if (notUseFunctionalTypes.length > 0) {
            vm.refBomModel[0].functionaltypes = _.map(notUseFunctionalTypes, 'name').join(', ');
            vm.refBomModel[0].requireFunctionalTypeStep = false;
            vm.refBomModel[0].requireFunctionalTypeError = generateDescription(vm.refBomModel[0], _requireFunctionalTypeError);
          }
        }
        mfgVerificationStepFn(vm.refBomModel[0]);
      }
      // Check CPN Restrict validation
      function checkCPNRestrictCase() {
        var listOfCPNRestictWithPermision = _.filter(vm.bomModel, { 'restrictCPNUseWithPermissionStep': false });
        var listOfCPNRestictPermanently = _.filter(vm.bomModel, { 'restrictCPNUsePermanentlyStep': false });
        _.each(listOfCPNRestictWithPermision, (objCPNRestictWithPermision) => {
          var objBOMList = _.filter(vm.bomModel, { '_lineID': objCPNRestictWithPermision._lineID });
          var firstObjOfCPNRestictWithPermision = _.head(objBOMList);
          _.each(objBOMList, (objBOM, row) => {
            if (objBOM) {
              objBOM.custPN = firstObjOfCPNRestictWithPermision.custPN;
              objBOM.customerRev = firstObjOfCPNRestictWithPermision.customerRev;
              objBOM.isUpdate = true;
              objBOM.restrictCPNUseWithPermissionStep = false;
              cpnDuplicateStepFn(objBOM, row);
              mfgVerificationStepFn(objBOM, row);
            }
          });
        });
        _.each(listOfCPNRestictPermanently, (objOfCPNRestictPermanently) => {
          var objBOMList = _.filter(vm.bomModel, { '_lineID': objOfCPNRestictPermanently._lineID });
          var firstObjOfCPNRestictPermanently = _.head(objBOMList);
          _.each(objBOMList, (objBOM, row) => {
            if (objBOM) {
              objBOM.custPN = firstObjOfCPNRestictPermanently.custPN;
              objBOM.customerRev = firstObjOfCPNRestictPermanently.customerRev;
              objBOM.isUpdate = true;
              objBOM.restrictCPNUsePermanentlyStep = false;
              cpnDuplicateStepFn(objBOM, row);
              mfgVerificationStepFn(objBOM, row);
            }
          });
        });
      }
      // Approved CPN part which is restricted
      function setAsCPNRestrictPart(bomObj, row, isRestricted) {
        var objBOMList = _.filter(vm.bomModel, { '_lineID': bomObj._lineID });
        bomObj.isRestrictCPNUseInBOMStep = isRestricted;
        _.each(objBOMList, (objBOM) => {
          if (objBOM) {
            objBOM.isUpdate = true;
            if (!isRestricted) {
              objBOM.restrictCPNUseInBOMError = null;
            }
            objBOM.restrictCPNUseInBOMStep = isRestricted;
            cpnDuplicateStepFn(objBOM, row);
            mfgVerificationStepFn(objBOM, row);
          }
        });

        //If any detail of BOM is changed then update the flag
        vm.isBOMChanged = BOMFactory.isBOMChanged = true;
        BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];
        $timeout(() => {
          setHeaderStyle();
        });
        if (_hotRegisterer) {
          _hotRegisterer.validateCells();
        }
      }
      // Customer approved comment of Line Item
      function customerapprovalItem(bomObj, row, from, isApproved) {
        bomObj.isUpdate = true;
        if (from === CORE.CUSTOMERAPPROVALFOR.QPA_REFDES) {
          bomObj.isQPACustomerApprove = true;
          bomObj.customerApprovalForQPAREFDESStep = true;
          bomObj.customerApprovalForQPAREFDESError = null;
          qpaDesignatorStepFn(bomObj, row);
        }
        if (from === CORE.CUSTOMERAPPROVALFOR.DNP_QPA_REFDES) {
          bomObj.isDNPQPACustomerApprove = true;
          bomObj.customerApprovalForDNPQPAREFDESStep = true;
          bomObj.customerApprovalForDNPQPAREFDESError = null;
          dnpqpaDesignatorStepFn(bomObj, row);
        }
        if (from === CORE.CUSTOMERAPPROVALFOR.BUY) {
          bomObj.isBuyCustomerApprove = true;
          bomObj.customerApprovalForBuyStep = true;
          bomObj.customerApprovalForBuyError = null;
          if (from === CORE.CUSTOMERAPPROVALFOR.QPA_REFDES) {
            bomObj.buyCustomerApprovalComment = bomObj.qpaCustomerApprovalComment;
            bomObj.requiredToShowBuyOnQuoteSummary = bomObj.requiredToShowQPAOnQuoteSummary;
            bomObj.isCustomerApprovedBuy = bomObj.isCustomerApprovedQPA;
          }
          buyStepFn(bomObj, row);
        }
        if (from === CORE.CUSTOMERAPPROVALFOR.DNP_BUY) {
          bomObj.isBuyDNPCustomerApprove = true;
          bomObj.customerApprovalForDNPBuyStep = true;
          bomObj.customerApprovalForDNPBuyError = null;
          buyStepFn(bomObj, row);
        }
        if (from === CORE.CUSTOMERAPPROVALFOR.POPULATE) {
          bomObj.isPopulateCustomerApprove = true;
          bomObj.customerApprovalForPopulateStep = true;
          bomObj.customerApprovalForPopulateError = null;
          if (from === CORE.CUSTOMERAPPROVALFOR.QPA_REFDES) {
            bomObj.populateCustomerApprovalComment = bomObj.qpaCustomerApprovalComment;
            bomObj.requiredToShowPopulateOnQuoteSummary = bomObj.requiredToShowQPAOnQuoteSummary;
            bomObj.isCustomerApprovedPopulate = bomObj.isCustomerApprovedQPA;
          }
          populateStepFn(bomObj, row);
        }

        if (from === CORE.CUSTOMERAPPROVALFOR.CPN) {
          bomObj.customerApprovalCPN = isApproved ? RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED : RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
          bomObj.customerApproval = isApproved ? RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED : RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
          bomObj.isCPNCustomerApprove = isApproved;
          const objBOMList = _.filter(vm.bomModel, { '_lineID': bomObj._lineID });
          _.each(objBOMList, (objBOM) => {
            if (objBOM) {
              objBOM.isUpdate = true;
              objBOM.restrictCPNUseWithPermissionStep = isApproved;
              objBOM.restrictCPNUseWithPermissionError = isApproved ? null : generateDescription(objBOM, _restrictCPNUseWithPermissionError);
              objBOM.customerApproval = isApproved ? RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED : RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
              cpnDuplicateStepFn(objBOM, row);
              mfgVerificationStepFn(objBOM, row);
            }
          });
        }

        //If any detail of BOM is changed then update the flag
        vm.isBOMChanged = BOMFactory.isBOMChanged = true;
        BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];
        $timeout(() => {
          setHeaderStyle();
        });
        if (_hotRegisterer) {
          _hotRegisterer.validateCells();
        }
      }
      // On QPAor DNP Qty change event to calculate QPA and DNP Qty
      function onQPAChange() {
        const objBOMModel = _.groupBy(vm.bomModel, '_lineID');
        const bomModel = [];
        const dnpBomModel = [];
        _.each(objBOMModel, (mergedRows) => {
          const item = _.first(mergedRows);
          if (item && item.qpa && !isNaN(item.qpa)) {
            bomModel.push(Number(item.qpa));
          }
          if (item && item.dnpQty && !isNaN(item.dnpQty)) {
            dnpBomModel.push(Number(item.dnpQty));
          }
        });
        vm.qpaCounts = _.sum(bomModel).toFixed(_unitFilterDecimal);
        vm.dnpQtyCounts = _.sum(dnpBomModel).toFixed(_unitFilterDecimal);
      }
      // QPA or RefDes change event for validate error
      function onQPAREFDESChange(bomObj, row) {
        if (_hotRegisterer && _hotRegisterer.isEmptyRow(row)) {
          return;
        }
        if (bomObj) {
          bomObj.customerApprovalForQPAREFDESStep = false;
          bomObj.customerApprovalForQPAREFDESError = null;
        }
        if (vm.liveInternalVersion !== CORE.MESSAGE_CONSTANT.INITAL_UPLOAD_STATUS && bomObj) { // Required for new line also so removed id from validation
          bomObj.refDesigCount = 0;
          if (bomObj.refDesig) {
            const itemDesigArr = getDesignatorFromLineItem(bomObj.refDesig, vm.DisplayOddelyRefDes);
            bomObj.refDesigCount = itemDesigArr.length;
          }

          bomObj.qpaDesignatorStep = vm.QPAREFDESValidationStepsFlag.Change;
          bomObj.qpaDesignatorStepError = generateDescription(bomObj, _QPAREFDESChangeError);
          bomObj.qpaErrorColor = _QPAREFDESChangeError.errorColor;
        }
        if (!bomObj.qpa && !bomObj.refDesig && (bomObj.isInstall || bomObj.isPurchase)) {
          if (bomObj.isPurchase) {
            bomObj.isPurchase = false;
            if (bomObj.id) {
              bomObj.customerApprovalForBuyStep = false;
              bomObj.customerApprovalForBuyError = generateDescription(bomObj, _customerApprovalForBuyError);
              buyStepFn(bomObj, row);
            }
          }
          if (bomObj.isInstall) {
            bomObj.isInstall = false;
            if (bomObj.id) {
              bomObj.customerApprovalForPopulateStep = false;
              bomObj.customerApprovalForPopulateError = generateDescription(bomObj, _customerApprovalForPopulateError);
              populateStepFn(bomObj, row);
            }
          }
        }
      };
      // DNP RefDes change event for validate error
      function onDNPQPAREFDESChange(bomObj, row) {
        if (_hotRegisterer && _hotRegisterer.isEmptyRow(row)) {
          return;
        }
        if (vm.liveInternalVersion !== CORE.MESSAGE_CONSTANT.INITAL_UPLOAD_STATUS && bomObj) { // Required for new line also so removed id from validation
          bomObj.dnpDesigCount = 0;
          if (bomObj.dnpDesig) {
            const itemDNPDesigArr = getDesignatorFromLineItem(bomObj.dnpDesig, vm.DisplayOddelyRefDes);
            bomObj.dnpDesigCount = itemDNPDesigArr.length;
          }
          bomObj.dnpQPARefDesStep = vm.QPAREFDESValidationStepsFlag.Change;
          bomObj.dnpQPARefDesError = generateDescription(bomObj, _dnpQPAREFDESChangeError);
          bomObj.dnpqpaErrorColor = _dnpQPAREFDESChangeError.errorColor;
          bomObj.customerApprovalForDNPQPAREFDESStep = false;
          bomObj.customerApprovalForDNPQPAREFDESError = null;
        }
        if (!bomObj.dnpQty && !bomObj.dnpDesig && bomObj.isBuyDNPQty !== _buyDNPQTYList[0].value) {
          bomObj.isBuyDNPQty = _buyDNPQTYList[0].value;
        }
      };
      // Buy flag change event for validate error
      function onBuyChange(bomObj, row) {
        if (_hotRegisterer && _hotRegisterer.isEmptyRow(row)) {
          return;
        }
        if (bomObj.id) {
          bomObj.customerApprovalForBuyStep = false;
          bomObj.customerApprovalForBuyError = generateDescription(bomObj, _customerApprovalForBuyError);
        }
      };
      // Buy DNP flag change event for validate error
      function onDNPBuyChange(bomObj, row) {
        if (_hotRegisterer && _hotRegisterer.isEmptyRow(row)) {
          return;
        }
        if (bomObj.id) {
          bomObj.customerApprovalForDNPBuyStep = false;
          bomObj.customerApprovalForDNPBuyError = generateDescription(bomObj, _customerApprovalForDNPBuyError);
        }
      };
      // Program Status change event for validate error
      function onProgrammingStatusChange(bomObj, row) {
        if (_hotRegisterer && _hotRegisterer.isEmptyRow(row)) {
          return;
        }
        if (bomObj.id) {
          const lineAlternatePartList = _.filter(vm.bomModel, { '_lineID': bomObj._lineID });
          _.map(lineAlternatePartList, (data) => {
            data.programingStatus = bomObj.programingStatus;
            data.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
            data.customerApprovalStepError = generateDescription(data, _customerApprovalError);
            if (data.mfgPNID && !data.programingRequired && !bomObj.isCustPNProgrammingRequire) {
              let lineProgramingStatus = data.programingStatus;
              if (!data.lineID && data._lineID) {
                const bomDet = _.find(vm.refBomModel, { lineID: data._lineID });
                if (bomDet && bomDet.programingStatus) {
                  data.programingStatus = lineProgramingStatus = bomDet.programingStatus;
                }
              }
              if (lineProgramingStatus !== _programingStatusList[0].value) {
                data.mismatchProgrammingStatusStep = false;
                data.mismatchProgrammingStatusError = generateDescription(data, _mismatchProgrammingStatusError);
                if (data.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) {
                  data.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                  data.customerApprovalStepError = generateDescription(data, _customerApprovalError);
                }
              } else {
                data.mismatchProgrammingStatusStep = true;
                data.mismatchProgrammingStatusError = null;
              }
            }
            mfgVerificationStepFn(data, null);
          });
        }
      };
      // Populate change event for validate error
      function onPopulateChange(bomObj, row) {
        if (_hotRegisterer && _hotRegisterer.isEmptyRow(row)) {
          return;
        }
        if (bomObj.id) {
          bomObj.customerApprovalForPopulateStep = false;
          bomObj.customerApprovalForPopulateError = generateDescription(bomObj, _customerApprovalForPopulateError);
        }
      };
      // Change Customer PN or Rev for validate error
      function onCPNAndRevChange(bomObj, row, field, oldVal) {
        if (bomObj) {
          if (bomObj.custPN !== null && bomObj.custPN !== undefined && bomObj.custPN !== '') {
            bomObj.custPN = replaceHiddenSpecialCharacter(bomObj.custPN);
            bomObj.customerRev = (bomObj.customerRev !== null && bomObj.customerRev !== undefined && bomObj.customerRev !== '') ? replaceHiddenSpecialCharacter(bomObj.customerRev) : '-';
            if (vm.isCPNChecking) {
              return;
            }
            const cpn = `${bomObj.custPN} Rev${bomObj.customerRev}`;
            const model = {
              pPartID: _partID,
              pCPN: cpn.replace(/"/g, '\\"').replace(/'/g, '\\\'')
            };
            vm.isCPNChecking = true;
            vm.cgBusyLoading = ImportBOMFactory.GetCustPNListFromPN().save(model).$promise.then((response) => {
              if (response && response.data && response.data.length > 0) {
                vm.isCPNChecking = false;
                const obj = {
                  title: CORE.MESSAGE_CONSTANT.CONFIRMATION,
                  textContent: stringFormat(RFQTRANSACTION.BOM.CPN_ALTERNATE_CHANGE_IN_BOM_CONFIRAMTION),
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                DialogFactory.confirmDiolog(obj).then((yes) => {
                  if (yes) {
                    onCPNChange(bomObj, row, field);
                    addCPNAlternateParts(bomObj, response.data, false);
                    setHeaderStyle();
                    mergeCommonCells();
                    if (_hotRegisterer) {
                      _hotRegisterer.validateCells();
                    }
                  }
                  else {
                    if (field === 'custPN') {
                      bomObj.custPN = oldVal;
                    }
                    else if (field === 'customerRev') {
                      bomObj.customerRev = oldVal;
                    }
                  }
                }, () => {
                  if (field === 'custPN') {
                    bomObj.custPN = oldVal;
                  }
                  else if (field === 'customerRev') {
                    bomObj.customerRev = oldVal;
                  }
                }).catch((error) => BaseService.getErrorLog(error));
                // deselected current cell so we can have a focus on pop-up element
                $timeout(() => {
                  if (_hotRegisterer) {
                    _hotRegisterer.deselectCell();
                  }
                });
              }
              else {
                vm.isCPNChecking = false;
                onCPNChange(bomObj, row, field);
              }
            }).catch((error) => {
              vm.isCPNChecking = false;
              BaseService.getErrorLog(error);
            });
          }
          else {
            vm.isCPNChecking = false;
            onCPNChange(bomObj, row, field);
          }
        }
      }
      // Customer PN change event for validate error
      function onCPNChange(bomObj, row) {
        if (_hotRegisterer && _hotRegisterer.isEmptyRow(row)) {
          return;
        }
        bomObj.custPNID = null;
        bomObj.custPNWithRev = null;
        bomObj.customerApprovalCPN = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
        bomObj.restrictCPNUsePermanentlyStep = bomObj.restrictCPNUseWithPermissionStep = true;
        bomObj.restrictCPNUseInBOMStep = false;
        bomObj.duplicateCPNError = bomObj.restrictCPNUsePermanentlyError = bomObj.restrictCPNUseWithPermissionError = bomObj.restrictCPNUseInBOMError = null;
        cpnDuplicateStepFn(bomObj, row);
        setHeaderStyle();
      }
      // MFR change event for validate error
      function onMfgChange(bomObj, row, field) {
        if (_hotRegisterer && _hotRegisterer.isEmptyRow(row)) {
          return;
        }
        // As field is changed make all validation flags NULL, as user has to again reverify all details
        bomObj.mfgVerificationStep = bomObj.mfgDistMappingStep = bomObj.obsoletePartStep = bomObj.mfgGoodPartMappingStep = bomObj.suggestedGoodPartStep = bomObj.distGoodPartMappingStep = bomObj.suggestedGoodDistPartStep = bomObj.nonRohsStep = bomObj.epoxyStep = bomObj.invalidConnectorTypeStep = bomObj.duplicateMPNInSameLineStep = bomObj.mismatchFunctionalCategoryStep = bomObj.mismatchMountingTypeStep = bomObj.mismatchRequiredProgrammingStep = bomObj.mismatchProgrammingStatusStep = bomObj.mismatchCustomPartStep = bomObj.driverToolsRequiredStep = bomObj.functionalTestingRequiredStep = bomObj.requireFunctionalTypeStep = bomObj.requireMountingTypeStep = bomObj.partPinIsLessthenBOMPinStep = bomObj.tbdPartStep = bomObj.exportControlledStep = bomObj.unknownPartStep = bomObj.defaultInvalidMFRStep = bomObj.mappingPartProgramStep = bomObj.mismatchCustpartRevStep = bomObj.mismatchCPNandCustpartRevStep = bomObj.isMPNAddedinCPN = true;

        bomObj.mfgVerificationStepError = bomObj.mfgDistMappingStepError = bomObj.obsoletePartStepError = bomObj.mfgGoodPartMappingStepError = bomObj.suggestedGoodPartError = bomObj.nonRohsStepError = bomObj.epoxyStepError = bomObj.invalidConnectorTypeError = bomObj.duplicateMPNInSameLineError = bomObj.mismatchMountingTypeError = bomObj.mismatchRequiredProgrammingError = bomObj.mismatchProgrammingStatusError = bomObj.mappingPartProgramError = bomObj.mismatchFunctionalCategoryError = bomObj.mismatchCustomPartError = bomObj.functionalTestingRequiredError = bomObj.matingPartRequiredError = bomObj.driverToolsRequiredError = bomObj.requireFunctionalTypeError = bomObj.requireMountingTypeError = bomObj.restrictUsePermanentlyError = bomObj.restrictUseWithPermissionError = bomObj.uomMismatchedError = bomObj.restrictUseInBOMError = bomObj.partPinIsLessthenBOMPinError = bomObj.tbdPartError = bomObj.exportControlledError = bomObj.unknownPartError = bomObj.defaultInvalidMFRError = bomObj.restrictUseInBOMWithPermissionError = bomObj.distGoodPartMappingStepError = bomObj.pickupPadRequiredError = bomObj.programingRequiredError = bomObj.mismatchNumberOfRowsError = bomObj.restrictUseInBOMExcludingAliasError = bomObj.restrictUseInBOMExcludingAliasWithPermissionError = bomObj.restrictUseExcludingAliasError = bomObj.restrictUseExcludingAliasWithPermissionError = bomObj.pickupPadRequiredError = bomObj.programingRequiredError = bomObj.matingPartRequiredError = bomObj.mismatchColorError = bomObj.mismatchCustpartRevError = bomObj.mismatchCPNandCustpartRevError = bomObj.MPNNotAddedinCPNError = null;

        bomObj.mismatchValueStep = bomObj.mismatchPackageStep = bomObj.mismatchToleranceStep = bomObj.mismatchPowerStep = bomObj.mismatchTempratureStep = bomObj.mismatchColorStep = bomObj.matingPartRquiredStep = bomObj.restrictUsePermanentlyStep = bomObj.restrictUseWithPermissionStep = bomObj.uomMismatchedStep = bomObj.pickupPadRequiredStep = bomObj.programingRequiredStep = bomObj.mismatchNumberOfRowsStep = bomObj.restrictUseExcludingAliasStep = bomObj.restrictUseExcludingAliasWithPermissionStep = true;

        bomObj.restrictUseInBOMStep = bomObj.restrictUseInBOMWithPermissionStep = bomObj.restrictCPNUseInBOMStep = bomObj.restrictUseInBOMWithPermissionStep = bomObj.restrictUseInBOMExcludingAliasStep = bomObj.restrictUseInBOMExcludingAliasWithPermissionStep = false;

        bomObj.approvedMountingType = false;
        bomObj.rohsComplient = null;
        bomObj.mfgPNDescription = null;
        bomObj.mfgCodeStep = true;
        bomObj.mfgCodeID = bomObj.mfgCodeStepError = null;
        bomObj.mfgPNStep = true;
        bomObj.mfgPNID = bomObj.mfgPNStepError = null;
        if (field === 'mfgCode') {
          _.remove(_invalidCells, (x) => x[0] === row && x[1] === _colMfgCodeIndex);
        }
        else if (field === 'mfgPN') {
          _.remove(_invalidCells, (x) => x[0] === row && x[1] === _colMfgPNIndex);
        }
        bomObj.acquisitionDetail = null;
        bomObj.distAcquisitionDetail = null;
        bomObj.RoHSStatusID = null;
        bomObj.pickupPadRequired = null;
        bomObj.matingPartRquired = null;
        bomObj.driverToolRequired = null;
        bomObj.programingRequired = null;
        bomObj.functionalTestingRequired = null;
        bomObj.componentAlterPN = null;
        bomObj.refDriveToolAlias = null;
        bomObj.partcategoryID = null;
        bomObj.mountingtypeID = null;
        bomObj.parttypeID = null;
        bomObj.isFunctionalTemperatureSensitive = false;
        bomObj.pitch = null;
        bomObj.noOfRows = null;
        bomObj.componentLead = null;
        bomObj.value = null;
        bomObj.partPackage = null;
        bomObj.deviceMarking = null;
        bomObj.packaging = null;
        bomObj.tolerance = null;
        bomObj.maxOperatingTemp = null;
        bomObj.minOperatingTemp = null;
        bomObj.powerRating = null;
        bomObj.serialNumber = null;
        bomObj.maxSolderingTemperature = null;
        bomObj.maxTemperatureTime = null;
        bomObj.isTemperatureSensitive = false;
        bomObj.mfgPNDescription = null;
        bomObj.createdBy = null;
        bomObj.voltage = null;
        bomObj.partUOMID = null;
        bomObj.uom = null;
        bomObj.color = null;
        bomObj.isUnlockApprovedPart = false;
        bomObj.isUnlockCustomerBOMLine = false;
        bomObj.distVerificationStep = bomObj.mfgDistMappingStep = bomObj.getMFGPNStep = bomObj.mfgGoodPartMappingStep = bomObj.suggestedGoodPartStep = bomObj.distGoodPartMappingStep = bomObj.suggestedGoodDistPartStep = bomObj.unknownPartStep = bomObj.defaultInvalidMFRStep = true;
        bomObj.distVerificationStepError = bomObj.mfgDistMappingStepError = bomObj.getMFGPNStepError = bomObj.mfgGoodPartMappingStepError = bomObj.suggestedGoodPartError = bomObj.distGoodPartMappingStepError = bomObj.suggestedGoodDistPartError = bomObj.unknownPartError = bomObj.defaultInvalidMFRError = null;
        bomObj.distMfgCodeID = null;
        bomObj.distCodeStep = true;
        bomObj.distCodeStepError = null;
        bomObj.distMfgPNID = null;
        bomObj.distPNStep = true;
        bomObj.distPNStepError = null;
        bomObj.mfgPNrev = null;
        bomObj.badMfgPN = null;
        bomObj.suggestedByApplicationStep = vm.PartSuggestType.default.id;
        bomObj.suggestedByApplicationMsg = null;

        if (bomObj.mfgCode && bomObj.mfgPN) {
          if ((!bomObj.customerApproval || bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) && (bomObj.mfgCode !== bomObj.org_mfgCode || bomObj.mfgPN !== bomObj.org_mfgPN)) {
            bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
            bomObj.customerApprovalStepError = generateDescription(bomObj, _customerApprovalError);
          }
          else if (bomObj.mfgCode === bomObj.org_mfgCode && bomObj.mfgPN === bomObj.org_mfgPN) {
            bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.NONE;
            bomObj.customerApprovalStepError = null;
          }
        }
        else {
          bomObj.customerApproval = bomObj.customerApproval ? bomObj.customerApproval : RFQTRANSACTION.CUSTOMER_APPROVAL.NONE;
          bomObj.customerApprovalStepError = null;
        }

        distVerificationStepFn(bomObj, row);
        mfgVerificationStepFn(bomObj, row);
        setHeaderStyle();
      }
      // Dist change event for validate error
      function onDistributorChange(bomObj, row, field) {
        if (_hotRegisterer && _hotRegisterer.isEmptyRow(row)) {
          return;
        }

        bomObj.mfgCodeID = null;
        bomObj.mfgPNID = null;
        bomObj.RoHSStatusID = null;
        if (field === 'distributor') {
          _.remove(_invalidCells, (x) => x[0] === row && x[1] === _colDistributorIndex);
        }
        else if (field === 'distPN') {
          _.remove(_invalidCells, (x) => x[0] === row && x[1] === _colDistPNIndex);
        }
        // Added by Shirish 27-11-2020 for reset MFR/MFRPN validation on supplier/suppllierPN change
        onMfgChange(bomObj, row, field);
      }
      // MFG add from context menu
      function addMFGCode(bomObj, row, col, type) {
        // deselected current cell so we can have a focus on pop-up element
        _hotRegisterer.deselectCell();

        const data = {
          Name: bomObj.mfgCode,
          Title: vm.LabelConstant.MFG,
          id: bomObj.mfgCodeID,
          parentId: null,
          Button: type,
          mfgType: CORE.MFG_TYPE.MFG
        };

        DialogFactory.dialogService(
          CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
          CORE.MANAGE_MFGCODE_MODAL_VIEW,
          _dummyEvent,
          data).then(() => {
          }, (insertedData) => {
            var mfgType = CORE.MFGTypeDropdown.find((x) => x.Key === 'MFG').Value;
            if (insertedData && insertedData.mfgType === mfgType) {
              const isExists = _.some(insertedData.alias, (item) => item.alias === bomObj.mfgCode);
              if (insertedData.mfgCode === bomObj.mfgCode || isExists) {
                const sameMFGCodeBOMList = _.filter(vm.bomModel, (item) => item.mfgCode && item.mfgCode === bomObj.mfgCode);
                sameMFGCodeBOMList.forEach((bomObj) => {
                  bomObj.mfgCodeID = insertedData.id;

                  bomObj.mfgCodeStep = true;
                  bomObj.mfgCodeStepError = null;
                  mfgVerificationStepFn(bomObj);
                });
                $timeout(() => {
                  setHeaderStyle();
                });
              }
            }
          }, (error) => BaseService.getErrorLog(error));
      }

      // MFG PN add from context menu
      function addMFGPN(bomObj, row, col, isBadPart) {
        // deselected current cell so we can have a focus on pop-up element
        _hotRegisterer.deselectCell();
        const data = {
          Name: bomObj.mfgPN,
          Title: vm.LabelConstant.MFGPN,
          parentId: bomObj.mfgCodeID,
          isBadPart: isBadPart,
          mfgType: CORE.MFG_TYPE.MFG,
          description: bomObj.customerDescription
        };
        const popUpData = { popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE], pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName };
        const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
        if (isAccessPopUp) {
          DialogFactory.dialogService(
            CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
            CORE.MANAGE_COMPONENT_MODAL_VIEW,
            _dummyEvent,
            data).then(() => {
            }, (insertedData) => {
              if (insertedData && insertedData.id) {
                bomObj.isMFGGoodPart = isBadPart;
                const mfgType = CORE.MFGTypeDropdown.find((x) => x.Key === 'MFG').Value;
                if (insertedData.mfgCodemst.mfgType !== mfgType || (bomObj.mfgCodeID && bomObj.mfgCodeID !== insertedData.mfgCodemst.id)) {
                  return;
                }

                if (insertedData.isGoodPart === PartCorrectList.IncorrectPart && insertedData.componentGoodBadPartMapping) {
                  const goodPartObj = insertedData.componentGoodBadPartMapping;

                  const model = {
                    mfgCode: goodPartObj.mfgCodemst.mfgName,
                    mfgCodeID: goodPartObj.mfgCodemst.id,
                    mfgPN: goodPartObj.mfgPN,
                    mfgPNID: goodPartObj.goodComponentID,
                    badMfgPN: insertedData.mfgCodemst.mfgName + '\n' + insertedData.mfgPN
                  };

                  if (bomObj.distributor || bomObj.distPN) {
                    bomObj.mfgCodeStep = bomObj.mfgPNStep = bomObj.mfgVerificationStep = bomObj.mfgGoodPartMappingStep = bomObj.distGoodPartMappingStep = bomObj.suggestedGoodPartStep = bomObj.suggestedGoodDistPartStep = bomObj.unknownPartStep = bomObj.defaultInvalidMFRStep = true;
                    bomObj.mfgCodeStepError = bomObj.mfgPNStepError = bomObj.mfgVerificationStepError = bomObj.mfgGoodPartMappingStepError = bomObj.distGoodPartMappingStepError = bomObj.suggestedGoodPartError = bomObj.suggestedGoodDistPartError = bomObj.unknownPartError = bomObj.defaultInvalidMFRError = null;
                    bomObj.mfgCode = bomObj.mfgCodeID = bomObj.mfgPN = bomObj.mfgPNID = null;

                    addAlternateParts(bomObj, [model], false);
                  }
                  else {
                    addAlternateParts(bomObj, [model], true);
                  }
                }
                else if (!bomObj.mfgCode) {
                  bomObj.mfgCode = insertedData.mfgCodemst.mfgName;
                  bomObj.mfgCodeID = insertedData.mfgCodemst.id;
                  //  bomObj.mfgPNID = insertedData.id;
                  bomObj.mfgPN = insertedData.mfgPN;

                  bomObj.mfgCodeStep = bomObj.mfgPNStep = bomObj.mfgVerificationStep = true;
                  bomObj.mfgCodeStepError = bomObj.mfgPNStepError = bomObj.mfgVerificationStepError = null;
                  bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                  bomObj.customerApprovalStepError = generateDescription(bomObj, _customerApprovalError);
                }
                else if (insertedData.mfgPN) {
                  if (bomObj.mfgCode && insertedData.mfgCodemst && (insertedData.mfgCodemst.mfgCode && insertedData.mfgCodemst.mfgCode.toUpperCase() === bomObj.mfgCode.toUpperCase() || insertedData.mfgCodemst.mfgName && insertedData.mfgCodemst.mfgName.toUpperCase() === bomObj.mfgCode.toUpperCase())) {
                    bomObj.mfgCodeID = insertedData.mfgCodemst.id;
                    bomObj.mfgCode = insertedData.mfgCodemst.mfgName;
                    bomObj.mfgCodeStep = true;
                    bomObj.mfgCodeStepError = null;
                  }
                  // bomObj.mfgPNID = insertedData.id;
                  bomObj.mfgPN = insertedData.mfgPN;

                  bomObj.mfgPNStep = false;
                  //bomObj.mfgPNStepError = null;
                }

                mfgVerificationStepFn(bomObj);
                $timeout(() => {
                  setHeaderStyle();
                });
              }
            }, (error) => BaseService.getErrorLog(error));
        }
      }

      // DIST code add from context menu
      function addDISTCode(bomObj, row, col, type) {
        // deselected current cell so we can have a focus on pop-up element
        _hotRegisterer.deselectCell();

        const data = {
          Name: bomObj.distributor,
          Title: vm.LabelConstant.MFG,
          id: bomObj.distMfgCodeID,
          parentId: null,
          Button: type,
          mfgType: CORE.MFG_TYPE.DIST
        };

        DialogFactory.dialogService(
          CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
          CORE.MANAGE_MFGCODE_MODAL_VIEW,
          _dummyEvent,
          data).then(() => {
          }, (insertedData) => {
            var mfgType = CORE.MFGTypeDropdown.find((x) => x.Key === 'DIST').Value;
            if (insertedData && insertedData.mfgType === mfgType) {
              const isExists = _.some(insertedData.alias, (item) => item.alias === bomObj.mfgCode);
              if (insertedData.mfgCode === bomObj.mfgCode || isExists) {
                const sameMFGCodeBOMList = _.filter(vm.bomModel, (item) => item.distributor && item.distributor === bomObj.distributor);
                sameMFGCodeBOMList.forEach((bomObj) => {
                  bomObj.distMfgCodeID = insertedData.id;

                  bomObj.distCodeStep = true;
                  bomObj.distCodeStepError = null;
                  distVerificationStepFn(bomObj);
                });
              }
            }
          }, (error) => BaseService.getErrorLog(error));
      }

      // DIST PN add from context menu
      function addDISTPN(bomObj, row, col, isBadPart) {
        // deselected current cell so we can have a focus on pop-up element
        _hotRegisterer.deselectCell();

        const data = {
          Name: bomObj.distPN,
          Title: vm.LabelConstant.MFGPN,
          parentId: bomObj.distMfgCodeID,
          isBadPart: isBadPart,
          mfgType: CORE.MFG_TYPE.DIST,
          description: bomObj.customerDescription
        };
        const popUpData = { popupAccessRoutingState: [USER.ADMIN_MANAGEDISTCOMPONENT_DETAIL_STATE], pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName };
        const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
        if (isAccessPopUp) {
          DialogFactory.dialogService(
            CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
            CORE.MANAGE_COMPONENT_MODAL_VIEW,
            _dummyEvent,
            data).then(() => {
            }, (insertedData) => {
              if (insertedData) {
                const distType = CORE.MFGTypeDropdown.find((x) => x.Key === 'DIST').Value;
                if (insertedData.mfgCodemst.mfgType !== distType || (bomObj.distMfgCodeID && parseInt(bomObj.distMfgCodeID) !== parseInt(insertedData.mfgCodemst.id))) {
                  return;
                }
                if (insertedData.isGoodPart && parseInt(insertedData.isGoodPart) === PartCorrectList.IncorrectPart && insertedData.componentGoodBadPartMapping) {
                  const goodPartObj = insertedData.componentGoodBadPartMapping;
                  const alternatePartArr = [{
                    mfgPNID: goodPartObj.id,
                    mfgPN: goodPartObj.mfgPN,
                    mfgCode: goodPartObj.mfgCodemst.mfgName,
                    mfgCodeID: goodPartObj.mfgCodemst.id
                  }];

                  if (bomObj.mfgCode || bomObj.mfgPN) {
                    bomObj.distCodeStep = bomObj.distPNStep = bomObj.distVerificationStep = bomObj.distGoodPartMappingStep = true;
                    bomObj.distCodeStepError = bomObj.distPNStepError = bomObj.distVerificationStepError = bomObj.distGoodPartMappingStepError = null;

                    //alternatePartArr[0].badMfgPN = insertedData.mfgCodemst.mfgName + "\n" + insertedData.mfgPN;
                    bomObj.distributor = bomObj.distMfgCodeID = bomObj.distMfgPNID = bomObj.distPN = null;

                    addAlternateParts(bomObj, alternatePartArr, false);
                  }
                  else {
                    //alternatePartArr[0].badMfgPN = insertedData.mfgCodemst.mfgName + "\n" + insertedData.mfgPN;
                    addAlternateParts(bomObj, alternatePartArr, true);
                  }
                }
                else if (!bomObj.distributor) {
                  bomObj.distributor = insertedData.mfgCodemst.mfgName;
                  bomObj.distPN = insertedData.mfgPN;

                  bomObj.distCodeStep = bomObj.distPNStep = bomObj.distVerificationStep = true;
                  bomObj.distCodeStepError = bomObj.distPNStepError = bomObj.distVerificationStepError = null;
                }
                else {
                  //  bomObj.distMfgPNID = insertedData.id;
                  bomObj.distPN = insertedData.mfgPN;

                  bomObj.distPNStep = true;
                  bomObj.distPNStepError = null;
                }
                onDistributorChange(bomObj, row);
                //distVerificationStepFn(bomObj);
              }
            }, (error) => BaseService.getErrorLog(error));
        }
      }

      // Add header background color for given cell
      function setHeaderStyle() {
        window.clearTimeout(_setHeaderStyleTimeout);
        _setHeaderStyleTimeout = window.setTimeout(setHeaderStyleFn);
      }
      // Add header color for given cell
      function setHeaderStyleFn() {
        return $timeout(() => {
          $('.ht_clone_top').find('th').children().removeClass('hot-err');
          $('.ht_clone_top_left_corner').find('th').children().removeClass('hot-err');
          $('.ht_clone_left tbody tr th').children().removeClass('hot-err');
          $('.ht_clone_top').find('th').children().removeClass('hot-suc');
          $('.ht_clone_top_left_corner').find('th').children().removeClass('hot-suc');
          $('.ht_clone_left tbody tr th').children().removeClass('hot-suc');

          const rowArr = _.uniq(_.map(_invalidCells, (item) => item[0]));
          const colArr = _.uniq(_.map(_invalidCells, (item) => item[1]));

          rowArr.forEach((row) => {
            $('.h-row-' + row).children().addClass('hot-err');
          });

          colArr.forEach((col) => {
            $('.h-col-' + col).children().addClass('hot-err');
          });

          // Success color if no any error there.
          if (!vm.isQPADesigStepPending()) {
            if (!colArr.includes(_colQPAIndex)) {
              $('.h-col-' + _colQPAIndex).children().addClass('hot-suc');
              $('.h-col-' + _colRefDesigIndex).children().addClass('hot-suc');
            }
            if (!colArr.includes(_colDNPQty)) {
              $('.h-col-' + _colDNPQty).children().addClass('hot-suc');
              $('.h-col-' + _colDNPDesig).children().addClass('hot-suc');
            }
          }

          if (!vm.isVerificationStepPending()) {
            if (!colArr.includes(_colMfgCodeIndex)) {
              $('.h-col-' + _colMfgCodeIndex).children().addClass('hot-suc');
            }
            if (!colArr.includes(_colMfgPNIndex)) {
              $('.h-col-' + _colMfgPNIndex).children().addClass('hot-suc');
            }
            if (!colArr.includes(_colDistributorIndex)) {
              $('.h-col-' + _colDistributorIndex).children().addClass('hot-suc');
            }
            if (!colArr.includes(_colDistPNIndex)) {
              $('.h-col-' + _colDistPNIndex).children().addClass('hot-suc');
            }
          }
          if ($scope.loaderVisible) {
            $scope.loaderVisible = false;
          };
        });
      }

      // Call form afterCellValidate event
      function afterCellValidate(isValid, row, prop) {
        row = parseInt(row);
        const col = _.findIndex(_sourceHeaderVisible, (x) => x.field === prop);
        _.remove(_invalidCells, (x) => x[0] === row && x[1] === col);

        if (!isValid) {
          _invalidCells.push([row, col]);
        }
        setHeaderStyle();
      }

      // Modify cell valid property manually
      function setCellValidation(row, col, isValid) {
        if (_hotRegisterer) {
          _hotRegisterer.setCellMeta(row, col, 'valid', isValid);
        }
        afterCellValidate(isValid, row, _sourceHeaderVisible[col].field);
      }

      // Check all line Have same description or not
      function checkInvalidLineDescription() {
        const bomDataArray = _.filter(vm.newAppendBOM, (bomItem, index) => {
          if (!((!isFilterApply && _hotRegisterer && _hotRegisterer.isEmptyRow(index)) || _.isEmpty(_.pickBy(bomItem, _.identity)))) {
            return true;
          }
        });
        var lineIDGroup = _.groupBy(bomDataArray, '_lineID');
        var invalidLineDescriptionList = [];
        for (const prop in lineIDGroup) {
          const lineItemPartsGroup = lineIDGroup[prop];
          const lineDescriptionGroup = _.chain(lineItemPartsGroup).groupBy('customerPartDesc').map((value, key) => key).value();;
          if (lineDescriptionGroup.length > 1) {
            invalidLineDescriptionList.push(prop);
          }
        }
        if (invalidLineDescriptionList.length > 0) {
          const invalidLineItems = _.uniq(invalidLineDescriptionList);
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.LINE_DESCRIPTION_MISMATCH);
          messgaeContent.message = stringFormat(messgaeContent.message, invalidLineItems.join(', ').replace('null', '--'));
          const model = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(model).then(() => {
            vm.draftSave(true, false, true);
          }, () => {
            if (!vm.isAppendBOM) {
              vm.refBomModel = [];
            } else {
              vm.cgBusyLoading = getRFQLineItemsByID().then((response) => {
                if (response) {
                  displayRFQLineItemsByID(response);
                }
              });
            }
          });
        } else {
          vm.draftSave(true, false, true);
        }
      }


      // Check same assembly not use in same BOM as MFR PN
      function checkDuplicateSubAssembly() {
        if (vm.mfgPN) {
          const duplicateAssembly = _.uniq(_.map(_.filter(vm.refBomModel, (item) => (((item.mfgCode && item.mfgCode.toUpperCase() === vm.mfg.toUpperCase()) || !item.mfgCode) && (item.mfgPN && item.mfgPN.toUpperCase() === vm.mfgPN.toUpperCase()))), (item) => ({ _lineID: (item._lineID) || 'Blank', mfgCodeMfgPN: `${item.mfgCode ? `(${item.mfgCode}) ` : ''}${item.mfgPN}` })));

          if (duplicateAssembly.length > 0) {
            const line = _.uniq(_.map(duplicateAssembly, '_lineID')).join(', ');
            const mfgCodeMfgPN = _.uniq(_.map(duplicateAssembly, 'mfgCodeMfgPN')).join(', ');

            const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.ASSEMBLY_CURR_EXISTS);
            messgaeContent.message = stringFormat(messgaeContent.message, mfgCodeMfgPN, vm.mfg, vm.mfgPN, line);
            const model = {
              messageContent: messgaeContent
            };
            DialogFactory.messageAlertDialog(model);
            return true;
          }
        }
        return false;
      }
      // Check all line is valid or not / Buy and Buy DNP Qty Mismatched Case
      function checkInvalidLineItem() {
        const bomDataArray = _.filter(vm.refBomModel, (bomItem, index) => {
          if (!((!isFilterApply && _hotRegisterer && _hotRegisterer.isEmptyRow(index)) || _.isEmpty(_.pickBy(bomItem, _.identity)))) {
            return true;
          }
        });
        var lineIDGroup = _.groupBy(bomDataArray, '_lineID');
        var invalidLineItemList = [];
        var invalidBuyAndDNPQTYBuyList = [];
        for (const prop in lineIDGroup) {
          const items = lineIDGroup[prop];
          if ((isNaN(prop) || prop === '') && (_hotRegisterer && !_hotRegisterer.isEmptyRow(items[0]))) {
            if (prop === '' || prop === 'undefined') {
              invalidLineItemList.push('null');
            }
            else {
              invalidLineItemList.push(prop);
            }
          }
          const LineDet = _.find(items, (x) => x.lineID);
          if (LineDet && (((LineDet.qpa > 0 || LineDet.refDesigCount > 0) && LineDet.isPurchase && (LineDet.dnpQty > 0 || LineDet.dnpDesigCount > 0) && LineDet.isBuyDNPQty === CORE.BuyDNPQTYDropdown[2].value) || ((LineDet.qpa > 0 || LineDet.refDesigCount > 0) && !LineDet.isPurchase && (LineDet.dnpQty > 0 || LineDet.dnpDesigCount > 0) && (LineDet.isBuyDNPQty === CORE.BuyDNPQTYDropdown[1].value || LineDet.isBuyDNPQty === CORE.BuyDNPQTYDropdown[3].value)))) {
            invalidBuyAndDNPQTYBuyList.push(prop);
          }
        }
        if (invalidLineItemList.length > 0) {
          const invalidLineItems = _.uniq(invalidLineItemList);
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.LINE_ITEMS_INVALID_DETAIL);
          messgaeContent.message = stringFormat(messgaeContent.message, invalidLineItems.join(', ').replace('null', 'Blank'));
          const model = {
            messageContent: messgaeContent
          };
          DialogFactory.messageAlertDialog(model);
          return true;
        }
        else if (invalidBuyAndDNPQTYBuyList.length > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BUY_AND_BUY_DNP_QTY_INVALID);
          messageContent.message = stringFormat(messageContent.message, _.uniqBy(invalidBuyAndDNPQTYBuyList).join(', '));
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
          return true;
        }
        else {
          // Added Validation for Customer BOM Line Number not empty.
          lineIDGroup = _.groupBy(bomDataArray, 'cust_lineID');
          for (const prop in lineIDGroup) {
            const items = lineIDGroup[prop];
            _.each(items, (objItem) => {
              if ((prop === '' || prop === null || prop === 'null' || prop === 'undefined')) {
                invalidLineItemList.push(objItem._lineID);
              }
            });
          }
          if (invalidLineItemList.length > 0) {
            const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.CUSTOMER_LINE_NUMBER_REQUIRED);
            const invalidLineItems = _.uniq(invalidLineItemList);
            messgaeContent.message = stringFormat(messgaeContent.message, _.uniq(invalidLineItems).join(', ').replace('null', '--'));
            const model = {
              messageContent: messgaeContent
            };
            DialogFactory.messageAlertDialog(model);
            return true;
          }
          return false;
        }
      }

      // Check all line UOM is valid or not
      function checkInvalidLineUOM() {
        const bomDataArray = _.filter(vm.refBomModel, (bomItem, index) => {
          if (!((!isFilterApply && _hotRegisterer && _hotRegisterer.isEmptyRow(index)) || _.isEmpty(_.pickBy(bomItem, _.identity)))) {
            return true;
          }
        });
        var lineIDGroup = _.groupBy(bomDataArray, '_lineID');
        var invalidLineUOMList = [];
        for (const prop in lineIDGroup) {
          const items = lineIDGroup[prop];
          if ((_hotRegisterer && !_hotRegisterer.isEmptyRow(items[0]))) {
            const unit = _.find(_unitList, (y) => {
              if (y.unitName && y.unitName.toUpperCase() === items[0].uomID.toUpperCase() || y.alias && y.alias.length > 0 && y.alias.find((x) => x.alias.toUpperCase() === items[0].uomID.toUpperCase())) {
                return y;
              }
            });
            if (!unit) {
              invalidLineUOMList.push({ lineID: prop, uom: items[0].uomID });
            }
          }
        }
        if (invalidLineUOMList.length > 0) {
          const invalidLineItems = _.uniq(invalidLineUOMList);
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.LINE_UOM_INVALID_DETAIL);
          const message = messageContent.message + '<br/><br/><table style=\'width:100%\'><thead><tr><th class=\'border-bottom padding-5\'>Item(Line#)</th><th class=\'border-bottom padding-5\'>UOM</th></tr></thead><tbody>{0}</tbody></table>';
          const subMessage = [];
          invalidLineItems.forEach((item) => {
            subMessage.push('<tr><td class=\'border-bottom padding-5\'>' + item.lineID + '</td><td class=\'border-bottom padding-5\'>' + item.uom + '</td></tr>');
          });

          messageContent.message = stringFormat(message, subMessage.join(''));
          const model = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(model);
          return true;
        }
        return false;
      }

      // Check added BOM CPN part is valid or not
      function checkInvalidCPN() {
        var notValidCPN = [];
        _.each(vm.refBomModel, (item) => {
          if ((item.custPN && _.size(item.custPN) > 20) || (item.customerRev && _.size(item.customerRev) > 10) || (item.custPN && item.custPNID && !item.isCustPN)) {
            const lineObj = _.find(vm.refBomModel, (objline) => objline.lineID === item._lineID && objline._lineID === item._lineID);
            if (lineObj && lineObj.isCPN) {
              notValidCPN.push(lineObj);
            }
          }
        });
        if (notValidCPN.length > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.LINE_CPN_INVALID);
          const invalidLineCPN = _.uniqBy(_.map(notValidCPN, (a) => a.custPN + ' Rev' + a.customerRev), (e) => e);
          messageContent.message = stringFormat(messageContent.message, invalidLineCPN.join(', '));
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
          return true;
        }
        return false;
      }
      // Check CPN and MFR PN both are not same
      function checkInvalidCPNMapping() {
        var notValidCPN = [];
        _.each(vm.refBomModel, (item) => {
          if ((item.custPN || item.custPNID) && item.mfgPNID && item.custPNID !== item.mfgPNID) {
            const lineObj = _.find(vm.refBomModel, (objline) => objline.lineID === item._lineID && objline._lineID === item._lineID);
            if (lineObj && lineObj.isCPN) {
              notValidCPN.push(lineObj);
            }
          }
        });
        if (notValidCPN.length > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.INVALID_CPN_MFRPN_MAPPING);
          const invalidLineCPN = _.uniqBy(_.map(notValidCPN, (a) => a.custPN + ' Rev' + a.customerRev), (e) => e);
          messageContent.message = stringFormat(messageContent.message, invalidLineCPN.join(', '));
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
          return true;
        }
        return false;
      }
      // Check any CPN have not added part as assembly
      function checkCPNWithAssembly() {
        var cpnWithAssy = [];
        vm.refBomModel.forEach((bomObj) => {
          if (bomObj && bomObj.custPN && bomObj.mfgPNID && bomObj.partcategoryID && bomObj.partcategoryID.toLowerCase() !== CORE.PartCategoryName.Component.toLowerCase()) {
            if (!cpnWithAssy.includes(bomObj._lineID)) {
              cpnWithAssy.push(
                bomObj._lineID
              );
            }
          }
        });
        if (cpnWithAssy.length) {
          let message = RFQTRANSACTION.BOM.ASSY_EXISTS_IN_CPN_TEXT;
          message = stringFormat(message, cpnWithAssy.join(', ').replace('null', '--'));
          const model = {
            title: RFQTRANSACTION.BOM.ASSY_EXISTS_IN_CPN,
            textContent: message,
            multiple: true
          };
          DialogFactory.alertDialog(model);
          return true;
        }
        return false;
      }

      // Check CPN part is Not Available part then no any alternate part added for this CPN
      function checkCPNWithAlternatePartForNotAvailable() {
        var cpnWithAssy = [];
        vm.refBomModel.forEach((bomObj) => {
          if (bomObj && bomObj.mfgPNID && bomObj.mfgPNID === CORE.NOTAVAILABLEMFRPNID) {
            const sameLinePart = _.filter(vm.refBomModel, { _lineID: bomObj._lineID });
            if (sameLinePart && sameLinePart.length > 1) {
              const CustPNExist = _.filter(sameLinePart, (item) => item.custPN !== null && item.custPN !== '' && item.custPN !== undefined);
              if (CustPNExist && CustPNExist.length && !cpnWithAssy.includes(bomObj._lineID)) {
                cpnWithAssy.push(bomObj._lineID);
              }
            }
          }
        });
        if (cpnWithAssy.length) {
          let message = RFQTRANSACTION.BOM.NOT_AVAILABLE_EXISTS_IN_CPN_WITH_ALTERNATE_TEXT;
          message = stringFormat(message, cpnWithAssy.join(', ').replace('null', '--'));
          const model = {
            title: RFQTRANSACTION.BOM.ASSY_EXISTS_IN_CPN,
            textContent: message,
            multiple: true
          };
          DialogFactory.alertDialog(model);
          return true;
        }
        return false;
      }

      // Check duplicate item Number added in same BOM
      function checkDuplicateItemNumber() {
        const bomDataArray = _.filter(vm.refBomModel, (bomItem, index) => {
          if (!((!isFilterApply && _hotRegisterer && _hotRegisterer.isEmptyRow(index)) || _.isEmpty(_.pickBy(bomItem, _.identity)))) {
            return true;
          }
        });
        const lineIDGroup = _.groupBy(bomDataArray, '_lineID');
        const lineItemList = [];
        for (const prop in lineIDGroup) {
          const items = lineIDGroup[prop];
          if (items.length > 1) {
            const CustlineGroup = _.groupBy(items, 'cust_lineID');
            for (const custLineprop in CustlineGroup) {
              if (CustlineGroup[custLineprop].length !== items.length) {
                lineItemList.push(prop);
              } else {
                const mergedRow = _.filter(items, { 'isMergedRow': true }).length;
                if (mergedRow !== items.length) {
                  lineItemList.push(prop);
                }
              }
            }
            const mergedRow = _.filter(items, { 'isMergedRow': true }).length;
            if (mergedRow !== items.length) {
              lineItemList.push(prop);
            }
          }
        }
        if (lineItemList.length > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.LINE_ITEMS_EXISTS);
          messageContent.message = stringFormat(messageContent.message, _.uniq(lineItemList).join(', ').replace('null', '--'));
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
          return true;
        }
        return false;
      }

      // Check duplicate item Number added in same BOM
      function checkDuplicateCustBOMLine() {
        //var lineIDGroup = _.groupBy(vm.refBomModel, '_lineID');
        const bomDataArray = _.filter(vm.refBomModel, (bomItem, index) => {
          if (!((!isFilterApply && _hotRegisterer && _hotRegisterer.isEmptyRow(index)) || _.isEmpty(_.pickBy(bomItem, _.identity)))) {
            return true;
          }
        });
        const custLinesGroup = _.groupBy(bomDataArray, 'cust_lineID');
        const custLines = _.uniq(_.map(bomDataArray, 'cust_lineID'));
        const custlineItemList = [];
        for (const prop in custLinesGroup) {
          const items = custLinesGroup[prop];
          if (items.length > 1) {
            const lineGroup = _.groupBy(items, '_lineID');
            for (const lineprop in lineGroup) {
              if (lineGroup[lineprop].length !== items.length) {
                custlineItemList.push(prop);
              } else {
                const mergedRow = _.filter(items, { 'isMergedRow': true }).length;
                if (mergedRow !== items.length) {
                  custlineItemList.push(prop);
                }
              }
            }
          }
          _.each(custLines, (line) => {
            if (line) {
              _.each(custLines, (innerline) => {
                if (innerline && innerline !== line) {
                  const objCustLines = line.toString().split(',');
                  const objInnerCustLines = innerline.toString().split(',');
                  _.each(objCustLines, (objOutLine) => {
                    if (_.find(objInnerCustLines, (objInLine) => objInLine === objOutLine) && !custlineItemList.some((el) => el === objOutLine)) {
                      custlineItemList.push(objOutLine);
                    }
                  });
                }
              });
            }
          });
        }

        // Check Duplicate Customer BOM Line Number
        _.each(custLines, (line) => {
          if (line) {
            const duplicateCustLineNumber = _.uniq(_.map(_.filter(bomDataArray, (custItem) => {
              if (custItem.cust_lineID === line) {
                return custItem;
              }
            }), 'cust_lineID'));
            if (duplicateCustLineNumber.length > 1 && !custlineItemList.some((el) => el === line)) {
              custlineItemList.push(line);
            }
          }
        });

        if (custlineItemList.length > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.CUST_BOM_LINE_EXISTS);
          messageContent.message = stringFormat(messageContent.message, _.uniq(custlineItemList).join(', ').replace('null', '--'));
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
          return true;
        }
        return false;
      }

      // Check duplicate CPN added in same BOM
      function checkDuplicateCPN() {
        const bomDataArray = _.filter(vm.refBomModel, (bomItem, index) => {
          if (!((!isFilterApply && _hotRegisterer && _hotRegisterer.isEmptyRow(index)) || _.isEmpty(_.pickBy(bomItem, _.identity)))) {
            if (bomItem._lineID && bomItem.lineID && bomItem.custPN) {
              return true;
            }
          }
        });
        const CPNGroup = _.groupBy(bomDataArray, (x) => x.custPN + ' Rev' + x.customerRev);
        const DuplicateCPNList = [];
        for (const prop in CPNGroup) {
          const items = CPNGroup[prop];
          if (_.map(_.groupBy(items, '_lineID')).length > 1) {
            const objlist = {
              CPN: prop,
              lineIDs: _.map(items, 'lineID').join()
            };
            DuplicateCPNList.push(objlist);
          }
        }
        if (DuplicateCPNList.length > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.DUPLICATE_CPN_EXISTS);
          const message = messageContent.message + '<br/><br/><table style="width:100%;"><thead><tr><th class="border-bottom padding-5">CPN</th><th class="border-bottom padding-5">Item(Line#)</th></tr></thead><tbody>{0}</tbody></table>';

          const subMessage = [];
          DuplicateCPNList.forEach((item) => {
            subMessage.push('<tr><td class="border-bottom padding-5">' + item.CPN + '</td><td class="border-bottom padding-5">' + item.lineIDs + '</td></tr>');
          });
          messageContent.message = stringFormat(message, subMessage.join(''));

          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
          return true;
        }
        return false;
      }

      // Check any Assembly have not any alternate part
      function checkSubAssyInAlternateDetails() {
        var alternateAssy = [];
        var levelGroup = _.groupBy(vm.refBomModel, '_lineID');
        for (const prop in levelGroup) {
          if (levelGroup[prop] && levelGroup[prop].length > 1) {
            const list = _.filter(levelGroup[prop], (bomObj) => bomObj.mfgPNID && bomObj.partcategoryID && bomObj.partcategoryID.toLowerCase() !== CORE.PartCategoryName.Component.toLowerCase());
            if (list && list.length > 0) {
              alternateAssy.push(list[0]._lineID);
            }
          }
        }

        if (alternateAssy.length) {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.ASSY_EXISTS_ALTERNATE_TEXT);
          messgaeContent.message = stringFormat(messgaeContent.message, alternateAssy.join(', ').replace('null', '--'));
          const model = {
            messageContent: messgaeContent
          };
          DialogFactory.messageAlertDialog(model);
          return true;
        }
        return false;
      }

      // Get duplicate CPN with line Item#
      function getDuplicateCustomerPN() {
        const multipleCPN = [];
        _.each(vm.refBomModel, (item) => {
          if (item.custPN) {
            item.custPNWithRev = stringFormat('{0} Rev{1}', item.custPN, (item.customerRev === null || item.customerRev === undefined || item.customerRev === '' ? '-' : item.customerRev));
          }
        });
        const cpnGroup = _.groupBy(vm.refBomModel, 'custPNWithRev');
        _.each(cpnGroup, (cpnValue, cpnKey) => {
          if (cpnKey !== 'null' && cpnKey !== 'undefined' && cpnKey !== undefined && cpnKey !== '' && cpnValue.length > 1) {
            const linewiseGroup = _.groupBy(cpnValue, '_lineID');
            if (cpnValue.length > 1) {
              _.each(cpnValue, (value) => {
                if (!multipleCPN.some((el) => el.lineID === value.lineID) && linewiseGroup[value.lineID] && linewiseGroup[value.lineID].length !== cpnValue.length) {
                  multipleCPN.push({
                    lineID: value.lineID,
                    cpn: value.custPN
                  });
                }
              });
            }
          }
        });
        return multipleCPN;
      }
      // Get Duplicate MGF MFGPN
      function getDuplicatePID() {
        const multipleMfgPN = [];
        const lineIDGroup = _.groupBy(vm.refBomModel, '_lineID');
        for (const prop in lineIDGroup) {
          const items = lineIDGroup[prop];
          if (prop !== 'null' && prop !== 'undefined' && prop !== undefined && prop !== '' && items.length > 1) {
            const mfgPNGroup = _.groupBy(_.filter(items, (mfgpn) => mfgpn.mfgPNID), 'mfgPNID');
            for (const propPN in mfgPNGroup) {
              const itemsPN = mfgPNGroup[propPN];
              if (propPN !== 'null' && propPN !== 'undefined' && propPN !== undefined && propPN !== '' && itemsPN.length > 1) {
                multipleMfgPN.push({ lineID: parseFloat(prop), mfgPN: parseInt(propPN) });
              }
            }
          }
        }
        return multipleMfgPN;
      }

      // Get Duplicate MGF
      function getDuplicateMFG() {
        const multipleMfgPN = [];
        const lineIDGroup = _.groupBy(vm.refBomModel, '_lineID');
        for (const prop in lineIDGroup) {
          const items = lineIDGroup[prop];
          if (prop !== 'null' && prop !== 'undefined' && prop !== undefined && prop !== '' && items.length > 1) {
            const mfgPNGroup = _.groupBy(items, 'mfgPN');
            for (const propPN in mfgPNGroup) {
              const itemsPN = mfgPNGroup[propPN];
              if (propPN !== 'null' && propPN !== 'undefined' && propPN !== undefined && propPN !== '' && itemsPN.length > 1) {
                const mfgCodeGroup = _.groupBy(itemsPN, 'mfgCode');
                for (const propCode in mfgCodeGroup) {
                  const itemsCode = mfgCodeGroup[propCode];
                  if (itemsCode.length > 1) {
                    multipleMfgPN.push({
                      lineID: parseFloat(prop),
                      mfgPN: propPN
                    });
                  }
                }
              }
            }
          }
        }
        return multipleMfgPN;
      };
      // Check Duplicate MGF
      function checkDuplicateMFG() {
        const multipleMfgPN = getDuplicateMFG();

        if (multipleMfgPN.length) {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.MFG_EXISTS_TEXT);
          const message = messgaeContent.message + '<br/><br/><table style="width:100%;"><thead><tr><th class="border-bottom padding-5">Item</th><th class="border-bottom padding-5">MFR PN</th></tr></thead><tbody>{0}</tbody></table>';

          const subMessage = [];
          multipleMfgPN.forEach((item) => {
            subMessage.push('<tr><td class="border-bottom padding-5">' + item.lineID + '</td><td class="border-bottom padding-5">' + item.mfgPN + '</td></tr>');
          });
          messgaeContent.message = stringFormat(message, subMessage.join(''));


          const model = {
            messageContent: messgaeContent
          };
          DialogFactory.messageAlertDialog(model);
          return true;
        }
        return false;
      }
      // Check Same MFR and MFR PN in different line
      function checkSamePartsInDiffLine() {
        var lineIDGroup = _.groupBy(vm.refBomModel, '_lineID');
        var partArr = [];

        Object.keys(lineIDGroup).forEach((prop) => {
          let items = lineIDGroup[prop];
          if (prop !== 'null' && prop !== 'undefined' && prop !== '') {
            items = _.sortBy(items, (x) => x.mfgCode + ':' + x.mfgPN).map((x) => {
              if (x.mfgCode && x.mfgPN && vm.TBDMFGAndMFGPNList.indexOf(x.mfgCode.toUpperCase()) === -1 && vm.TBDMFGAndMFGPNList.indexOf(x.mfgPN.toUpperCase()) === -1) {
                return {
                  numOfPosition: x.numOfPosition ? x.numOfPosition + '' : null,
                  mfgCode: x.mfgCode.toUpperCase(),
                  mfgPN: x.mfgPN.toUpperCase(),
                  isInstall: !x.lineID ? true : Boolean(x.isInstall) || false,
                  isPurchase: !x.lineID ? true : Boolean(x.isPurchase) || false
                };
              }
            });
            if (items[0]) {
              partArr.push({
                lineID: parseFloat(prop),
                custLineID: lineIDGroup[prop][0].cust_lineID,
                componentAssembly: items
              });
            }
          }
        });
        const duplicateMfgArr = [];
        partArr.forEach((item) => {
          partArr.forEach((subItem) => {
            if (item.lineID !== subItem.lineID) {
              if (_.isEqual(item.componentAssembly, subItem.componentAssembly)) {
                const existingIndex = _.indexOf(duplicateMfgArr, _.find(duplicateMfgArr, (x) => _.find(x, (y) => y.lineID === item.lineID)));
                if (existingIndex !== -1) {
                  // Added push by index as value not update on reference obj
                  duplicateMfgArr[existingIndex] = [...duplicateMfgArr[existingIndex], ...[{ lineID: item.lineID, custLineID: item.custLineID }, { lineID: subItem.lineID, custLineID: subItem.custLineID }]];
                  duplicateMfgArr[existingIndex] = _.uniqWith(duplicateMfgArr[existingIndex], _.isEqual);
                }
                else {
                  duplicateMfgArr.push([{ lineID: item.lineID, custLineID: item.custLineID }, { lineID: subItem.lineID, custLineID: subItem.custLineID }]);
                }
              }
            }
          });
        });

        if (duplicateMfgArr.length === 0) {
          return false;
        }

        let message = '<br/><br/><div class="cm-BOM-merge-validation">{0}</div>';
        const subMessage = [];
        duplicateMfgArr.forEach((item) => {
          const mergeLines = _.map(item.filter((x) => x.lineID !== item[0].lineID), 'lineID').join(', ');
          subMessage.push(`<strong>Item(s) ${mergeLines} will merge with item ${item[0].lineID}</strong>`);
        });

        message = stringFormat(message, subMessage.join('<br/>'));

        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.DUPLICATE_PART_IN_DIFFERENT_LINE);
        messageContent.message = stringFormat('{0} {1}', messageContent.message, message);
        const model = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(model).then((yes) => {
          if (yes) {
            duplicateMfgArr.forEach((item) => {
              const bomObjArr = vm.refBomModel.filter((x) => x._lineID && x._lineID === item[0].lineID);
              const bomObj = bomObjArr[0];
              const mergeLines = item.filter((x) => x.custLineID !== item[0].custLineID);
              if (bomObj) {
                item.forEach((line, index) => {
                  if (index > 0) {
                    const currentBomObjArr = vm.refBomModel.filter((x) => x._lineID && x._lineID === line.lineID);
                    const currentBomObj = currentBomObjArr[0];

                    if (currentBomObj.refDesig) {
                      if (bomObj.refDesig) {
                        bomObj.refDesig = `${bomObj.refDesig},${currentBomObj.refDesig}`;
                      } else {
                        bomObj.refDesig = currentBomObj.refDesig;
                      }
                    }
                    if (currentBomObj.cust_lineID) {
                      if (bomObj.mergedcustLineID) {
                        bomObj.mergedcustLineID = `${bomObj.mergedcustLineID},${currentBomObj.cust_lineID}`;
                      } else if (bomObj.cust_lineID) {
                        bomObj.mergedcustLineID = `${bomObj.cust_lineID},${currentBomObj.cust_lineID}`;
                      } else {
                        bomObj.mergedcustLineID = currentBomObj.cust_lineID.toString();
                      }
                    }
                    if (currentBomObj.customerPartDesc) {
                      if (bomObj.customerPartDesc) {
                        bomObj.customerPartDesc = `${bomObj.customerPartDesc}\n${currentBomObj.customerPartDesc}`;
                      } else {
                        bomObj.customerPartDesc = currentBomObj.customerPartDesc.toString();
                      }
                    }
                    const bomQPA = Number(bomObj.qpa);
                    const currentQPA = Number(currentBomObj.qpa);
                    bomObj.qpa = (Number.isNaN(bomQPA) ? 0 : bomQPA) + (Number.isNaN(currentQPA) ? 0 : currentQPA);

                    //Start DNP QTY and RefDes Merge
                    if (currentBomObj.dnpDesig) {
                      if (bomObj.dnpDesig) {
                        bomObj.dnpDesig = `${bomObj.dnpDesig},${currentBomObj.dnpDesig}`;
                      }
                      else {
                        bomObj.dnpDesig = currentBomObj.dnpDesig;
                      }
                    }
                    const bomDNPQPA = Number(bomObj.dnpQty);
                    const currentDNPQPA = Number(currentBomObj.dnpQty);
                    if (bomDNPQPA > 0 || currentDNPQPA > 0) {
                      bomObj.dnpQty = (Number.isNaN(bomDNPQPA) ? 0 : bomDNPQPA) + (Number.isNaN(currentDNPQPA) ? 0 : currentDNPQPA);
                    }
                    //End DNP QTY and RefDes Merge

                    bomObj.isUpdate = true;
                    currentBomObjArr.forEach((item) => {
                      if (item.rfqAlternatePartID) {
                        // Manage delete part array in case of exiting line delete
                        bomDelete.push(item.rfqAlternatePartID);
                        const listOfDeleteRow = _.map(_.filter(vm.bomModel, { 'id': item.id }), 'rfqAlternatePartID');
                        if (_.difference(listOfDeleteRow, bomDelete).length === 0) {
                          // Manage delete line array in case of exiting line delete
                          rowDeleted.push(item.id);
                        }
                      }
                      _hotRegisterer.alter('remove_row', vm.refBomModel.indexOf(item));
                    });
                  }
                });
              }

              bomObjArr.forEach((item, index) => {
                item.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                item.customerApprovalStepError = generateDescription(item, _customerApprovalError);
                item.mergeLines = _.map(mergeLines, 'custLineID').join();
                item.lineMergeStep = true;
                if (index === 0) {
                  item.lineMergeStep = false;
                  item.lineMergeStepError = generateDescription(item, _lineMergeError);
                }
                item.cust_lineID = bomObj.mergedcustLineID;
                mfgVerificationStepFn(item, item.index);
                distVerificationStepFn(item, item.index);
              });
            });
            if (vm.isFromQPA) {
              vm.qpaDesignator();
            } else {
              setHeaderStyle();
            }
          }
        }, () => {
          // empty
        });
        return true;
      }
      // Check in valid programing status map with any line
      function checkInvalidProgrammingStatus() {
        var lineIDGroup = _.groupBy(vm.refBomModel, '_lineID');
        var invalidProgramStatusLineItemList = [];
        for (const prop in lineIDGroup) {
          const items = _.head(lineIDGroup[prop]);
          if (items && (_hotRegisterer && !_hotRegisterer.isEmptyRow(items))) {
            if (items.programingRequired || items.isCustPNProgrammingRequire) {
              if ((items.programingStatus !== _programingStatusList[4].value && items.programingStatus !== _programingStatusList[5].value) && items.isBuyDNPQty === CORE.BuyDNPQTYDropdown[3].value) {
                invalidProgramStatusLineItemList.push(items._lineID);
              }
            }
          }
        }
        if (invalidProgramStatusLineItemList.length > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.INVALID_PROGRAMMING_BUY_DNP_MAPPING);
          messageContent.message = messageContent.message + '<br/><br/><strong> Invalid line items(s): {0}</strong>';
          const invalidLineItems = _.uniqBy(invalidProgramStatusLineItemList, (e) => e);
          messageContent.message = stringFormat(messageContent.message, invalidLineItems.join(', ').replace('null', '--'));
          const alertModel = {
            messageContent: messageContent
          };

          DialogFactory.messageAlertDialog(alertModel);
          return true;
        } else {
          return false;
        }
      };
      // Verify and Save BOM click event
      vm.verifyAndSave = function () {
        vm.isBOMVerifyStart = true;
        vm.cgBusyLoading = vm.verifyAndSaveData().then(() => {
          vm.isBOMVerifyStart = false;
        });
      };
      // Verify data and save for BOM level
      vm.verifyAndSaveData = () => new Promise((resolve) => {
        _hotRegisterer.validateCells((valid) => {
          if (valid) {
            if (checkDuplicateCPN() || checkInvalidLineItem() || checkInvalidLineUOM() || checkInvalidProgrammingStatus() || checkDuplicateItemNumber() || checkDuplicateCustBOMLine() || checkSamePartsInDiffLine() || checkDuplicateSubAssembly() || checkSubAssyInAlternateDetails() || checkInvalidCPN() || checkCPNWithAssembly() || checkCPNWithAlternatePartForNotAvailable() || checkInvalidCPNMapping() || checkDuplicateMFG()) {
              resolve();
              return;
            }
            if (!vm.checkCPN) {
              vm.checkCPNExistInDiffrentBOM(false, false, false, false);
              resolve();
              return;
            }
            if (!vm.checkUnlockPN) {
              vm.checkUnlockParts(false, false, false, false);
              resolve();
              return;
            }
            vm.qpaRefDesValidation();

            const bomModel = angular.copy(vm.refBomModel);
            const rowsArr = [];
            let ProgramRequiredRefDesgArray = [];
            let SoftwareRefDESArray = [];

            const mergeCellsPlugin = _hotRegisterer ? _hotRegisterer.getPlugin('MergeCells') : null;
            for (let i = 0, len = bomModel.length; i < len; i++) {
              const item = bomModel[i];
              itemStepVerification(item);

              if (_hotRegisterer && _hotRegisterer.isEmptyRow(i) || _.isEmpty(_.pickBy(item, _.identity))) {
                rowsArr.push(item);
              } else {
                item.lineID = item._lineID;

                // if values of lineID is '' then error generate into API side
                item.dnpQty = item.dnpQty || null;
                item.qpa = item.qpa || null;

                //if (!item.qpaDesignatorStep && item.lineID) {
                //    qpaDesignatorStepError.push(item.lineID);
                //    continue;
                //}

                const uomID = _unitList.find((y) => y.unitName === item.uomID);
                item.uomID = uomID ? uomID.id : null;

                if (item.programingStatus) {
                  const programingStatus = _programingStatusList.find((y) => y.value === item.programingStatus);
                  item.programingStatus = programingStatus ? programingStatus.id : _programingStatusList[0].id;
                }
                if (item.isBuyDNPQty) {
                  const isBuyDNPQty = _buyDNPQTYList.find((y) => y.value === item.isBuyDNPQty).id;
                  item.isBuyDNPQty = isBuyDNPQty ? isBuyDNPQty.id : _buyDNPQTYList[0].id;
                }
                const substitutesAllow = _substitutesAllowList.find((y) => y.value === item.substitutesAllow);
                item.substitutesAllow = substitutesAllow ? substitutesAllow.id : _substitutesAllowList[0].id;

                item.numOfPosition = item.numOfPosition ? Number(item.numOfPosition) : null;
                item.numOfRows = item.numOfRows ? Number(item.numOfRows) : null;

                const partTypeIDObj = _partTypeList.find((y) => y.partTypeName === item.parttypeID);
                if (partTypeIDObj) {
                  item.parttypeID = partTypeIDObj.id;
                  item.isFunctionalTemperatureSensitive = partTypeIDObj.isTemperatureSensitive;
                }
                else {
                  item.parttypeID = null;
                  item.isFunctionalTemperatureSensitive = false;
                }

                const mountingTypeIDObj = _mountingTypeList.find((y) => y.name === item.mountingtypeID);
                item.mountingtypeID = mountingTypeIDObj ? mountingTypeIDObj.id : null;

                const partCategoryObj = _typeList.find((y) => y.Value === item.partcategoryID);
                item.partcategoryID = partCategoryObj ? partCategoryObj.id : null;

                // To remove 0 entry and NULL entry
                item.refRFQLineItemID = item.refRFQLineItemID ? item.refRFQLineItemID : null;

                if (!mergeCellsPlugin) {
                  return;
                }
                const mergedCellInfo = mergeCellsPlugin.mergedCellsCollection.get(i);

                if (mergedCellInfo) {
                  if (mergedCellInfo.row === i) {
                    item.description = getDescriptionForMainLine(item);
                  } else {
                    item.description = null;
                  }
                } else {
                  item.description = getDescriptionForMainLine(item);
                }
                item.descriptionAlternate = getDescriptionForLine(item, true);

                if ((item.programingRequired || item.isCustPNProgrammingRequire) && (item.programingStatus === _programingStatusList[4].id || item.programingStatus === _programingStatusList[5].id)) {
                  ProgramRequiredRefDesgArray = ProgramRequiredRefDesgArray.concat(getDesignatorFromLineItem(item.refDesig, vm.DisplayOddelyRefDes));
                  if (item.isBuyDNPQty === CORE.BuyDNPQTYDropdown[3].id) {
                    ProgramRequiredRefDesgArray = ProgramRequiredRefDesgArray.concat(getDesignatorFromLineItem(item.dnpDesig, vm.DisplayOddelyRefDes));
                  }
                }

                if ((item.mountingID === -2 || item.functionalID === -2) && item.isInstall) {
                  SoftwareRefDESArray = SoftwareRefDESArray.concat(getDesignatorFromLineItem(item.refDesig, vm.DisplayOddelyRefDes));
                }
              }
            }

            rowsArr.forEach((row) => { bomModel.splice(bomModel.indexOf(row), 1); });
            resolve();
            if (bomModel.length) {
              //_partID
              const model = {
                partID: _partID,
                list: bomModel,
                verifiedConfirm: vm.VerifiedConfirm,
                passwordApproval: vm.passwordApproval,
                ProgramRequiredRefDesgArray: ProgramRequiredRefDesgArray,
                SoftwareRefDESArray: SoftwareRefDESArray
              };
              if (vm.VerifiedConfirm) {
                if (vm.readyForPricingRFQList.length > 0) { // have to check for all assembly wise where we used
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.VERIFY_BOM_PRICING_PART_CONFIRMATION_MSG);
                  const obj = {
                    messageContent: messageContent,
                    btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                    canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                  };
                  DialogFactory.messageConfirmDialog(obj).then((yes) => {
                    if (yes) {
                      if (vm.isBOMVerified) {
                        if (!vm.passwordApproval) {
                          passwordApproval().then((response) => {
                            if (response) {
                              vm.passwordApproval = true;
                              model.passwordApproval = vm.passwordApproval;
                              saveBOM(model);
                            }
                          });
                        }
                        else {
                          saveBOM(model);
                        }
                      }
                      else {
                        vm.passwordApproval = true;
                        model.passwordApproval = vm.passwordApproval;
                        saveBOM(model);
                      }
                    }
                  }, () => {
                    // Empty
                  });
                }
                else {
                  if (vm.isBOMVerified) {
                    if (!vm.passwordApproval) {
                      passwordApproval().then((response) => {
                        if (response) {
                          vm.passwordApproval = true;
                          model.passwordApproval = vm.passwordApproval;
                          saveBOM(model);
                        }
                      });
                    }
                    else {
                      saveBOM(model);
                    }
                  }
                  else {
                    vm.passwordApproval = true;
                    model.passwordApproval = vm.passwordApproval;
                    saveBOM(model);
                  }
                }
              }
              else {
                saveBOM(model);
              }
            }
          }
          else {
            resolve();
            const invalidQPAArr = [null, undefined, ''];
            //let invalidLineDetails = [];
            const isError = _.some(vm.refBomModel, (item, index) => {
              if (_hotRegisterer && !_hotRegisterer.isEmptyRow(index)) {
                const mergedCellInfo = getMergeCellInfoByRow(index);
                const parentIndex = mergedCellInfo ? mergedCellInfo.row : index;
                let bomModel = vm.refBomModel[parentIndex];
                if (!bomModel.lineID || invalidQPAArr.indexOf(bomModel.qpa) !== -1 || !bomModel.mfgPNID) {
                  return true;
                }
                if (mergedCellInfo) {
                  for (let i = 1; i < mergedCellInfo.rowspan; i++) {
                    bomModel = vm.refBomModel[parentIndex + i];
                    if (!bomModel.mfgPNID) {
                      return true;
                    }
                  }
                }
              }
            });
            if (isError) {
              const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.VERIFY_SAVE_ERROR_TEXT);
              const model = {
                messageContent: messgaeContent
              };
              DialogFactory.messageAlertDialog(model);
            }
            else {
              if (checkDuplicateMFG()) { return; }

              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.VERIFY_SAVE_TEXT);
              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes) {
                  if (vm.isBOMVerified) {
                    passwordApproval().then((response) => {
                      if (response) {
                        vm.draftSave(false, true);
                      }
                    });
                  }
                  else {
                    vm.draftSave(false, true);
                  }
                }
              }, () => {
                // Empty
              });
            }
          }
        });
      });

      // No need of this now because we don't have to disable
      //let isSummarySubmitted = $rootScope.$on('isSummarySubmitted', function (event, data) {
      //    //vm.isBOMReadOnly = data;
      //    //if (vm.isFromComponent)
      //        vm.isBOMReadOnly = false;
      //});
      // Save verified BOM data
      function saveBOM(model) {
        model.bomDelete = bomDelete;
        model.rowDeleted = rowDeleted;
        vm.cgBusyLoading = ImportBOMFactory.saveRFQLineItems().save(model).$promise.then((response) => {
          if (response && response.data) {
            const data = response.data;
            switch (data.status) {
              // Invalid MFG or DIST entry
              case 'Part': {
                /* Array of: lineID, mfgCode, mfgPN */
                const invalidMFGPNList = data.data.invalidMFGPNList;
                /* Array of: lineID, distributor, distPN */
                const invalidDISTPNList = data.data.invalidDISTPNList;

                const model = {
                  title: CORE.MESSAGE_CONSTANT.BOM_PART_INVALID,
                  textContent: CORE.MESSAGE_CONSTANT.BOM_PART_INVALID_TEXT,
                  multiple: true
                };
                DialogFactory.alertDialog(model);

                invalidMFGPNList.forEach((obj) => {
                  var bomObj = _.find(vm.refBomModel, (item) => item.mfgCode === obj.mfgCode && item.mfgPN === obj.mfgPN);

                  if (!bomObj) {
                    return;
                  }
                  bomObj.distCodeStep = true;
                  if (!obj.mfgCodeID) {
                    bomObj.mfgCodeStep = false;
                    bomObj.mfgCodeStepError = generateDescription(bomObj, _mfgInvalidError);
                  }

                  bomObj.distPNStep = true;
                  if (!obj.mfgPNID) {
                    bomObj.mfgPNStep = false;
                    bomObj.mfgPNStepError = generateDescription(bomObj, _mfgPNInvalidError);
                  }

                  mfgVerificationStepFn(bomObj);
                });

                invalidDISTPNList.forEach((obj) => {
                  var bomObj = _.find(vm.refBomModel, (item) => item.distributor === obj.distributor && item.distPN === obj.distPN);

                  if (!bomObj) {
                    return;
                  }
                  bomObj.distCodeStep = true;
                  if (!bomObj.distMfgCodeID) {
                    bomObj.distCodeStep = false;
                    bomObj.distCodeStepError = generateDescription(bomObj, _distInvalidError);
                  }

                  bomObj.distPNStep = true;
                  if (!bomObj.distMfgPNID) {
                    bomObj.distPNStep = false;
                    bomObj.distPNStepError = generateDescription(bomObj, _distPNInvalidError);
                  }

                  distVerificationStepFn(bomObj);
                });

                setHeaderStyle();
                _hotRegisterer.render();
                break;
              }
              case 'Sub Assembly': {
                const subassemblyList = data.data.subassemblyList;
                const model = {
                  title: RFQTRANSACTION.BOM.SUB_ASSY_NOT_CLEAN,
                  textContent: stringFormat(RFQTRANSACTION.BOM.SUB_ASSY_NOT_CLEAN_TEXT, subassemblyList.map((x) => x.pid).join(', ')),
                  multiple: true
                };
                DialogFactory.alertDialog(model);
                vm.checkCPN = false;
                vm.checkUnlockPN = false;
                break;
              }
              // Number Of Position exist in component but on in line item
              case 'NumOfPosition': {
                const invalidMFGForNumOfPosList = data.data;
                const model = {
                  title: RFQTRANSACTION.BOM.NUM_OF_POS_REQUIRED,
                  textContent: stringFormat(RFQTRANSACTION.BOM.NUM_OF_POS_REQUIRED_TEXT, invalidMFGForNumOfPosList.join(', ')),
                  multiple: true
                };
                DialogFactory.alertDialog(model);
                vm.checkCPN = false;
                vm.checkUnlockPN = false;
                break;
              }
              case 'BOMPinRequired': {
                const bomPinRequiredList = data.data.bomPinRequiredList;
                const message = stringFormat(RFQTRANSACTION.BOM.NUM_OF_POS_REQUIRED_TEXT, bomPinRequiredList.join(', '));
                const model = {
                  title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                  textContent: message,
                  multiple: true
                };
                DialogFactory.alertDialog(model);
                vm.checkCPN = false;
                vm.checkUnlockPN = false;
                break;
              }
              // line item Num. Of Position mismatch with component num of position
              case 'misMatchNumOfPosition': {
                const misMatchNumOfPositionList = data.data;
                let message = RFQTRANSACTION.BOM.LEAD_MISMATCH_TEXT + '<br/><br/><table style="width:100%"><thead><tr><th class="border-bottom padding-5">Item</th><th class="border-bottom padding-5">Part #</th><th class="border-bottom padding-5">Part Pin Count</th><th class="border-bottom padding-5">BOM Pin Count</th></tr></thead><tbody>{0}</tbody></table>';
                const subMessage = [];
                misMatchNumOfPositionList.forEach((item) => {
                  subMessage.push('<tr><td class="border-bottom padding-5">' + item.lineID + '</td><td class="border-bottom padding-5">' + item.mfgPN + '</td><td class="border-bottom padding-5">' + item.partLead + '</td><td class="border-bottom padding-5">' + item.numOfPosition + '</td></tr>');
                });

                message = stringFormat(message, subMessage.join(''));
                const model = {
                  title: RFQTRANSACTION.BOM.NUM_OF_POS_REQUIRED,
                  textContent: message,
                  multiple: true
                };
                DialogFactory.alertDialog(model);
                vm.checkCPN = false;
                vm.checkUnlockPN = false;
                break;
              }
              case 'Epoxy': {
                const model = {
                  title: CORE.MESSAGE_CONSTANT.BOM_PART_INVALID,
                  textContent: CORE.MESSAGE_CONSTANT.BOM_PART_INVALID_TEXT,
                  multiple: true
                };
                DialogFactory.alertDialog(model);

                const invalidEpoxyPartsList = data.data;
                invalidEpoxyPartsList.forEach((item) => {
                  var bomObj = _.find(vm.refBomModel, (obj) => obj._lineID === item.lineID && obj.mfgPN === item.mfgPN);
                  bomObj.epoxyStep = true;
                  if (bomObj) {
                    bomObj.epoxyStep = false;
                    bomObj.epoxyStepError = generateDescription(bomObj, _epoxyError);
                    mfgVerificationStepFn(bomObj);
                  }
                });
                setHeaderStyle();
                vm.checkCPN = false;
                vm.checkUnlockPN = false;
                break;
              }
              case 'VerifyPending': {
                const invalidEpoxyPartsList = data.data.invalidEpoxyPartsList;
                const mountingTypeMismatchList = data.data.mountingTypeMismatchList;
                const functionalValidationMismatchList = data.data.functionalValidationMismatchList;
                const invalidMFGList = data.data.invalidMFGList;
                const invalidDISTList = data.data.invalidDISTList;
                const invalidMappingList = data.data.invalidMappingList;
                const matingPartRequiredList = data.data.matingPartRequiredList;
                const pickupPadRequiredList = data.data.pickupPadRequiredList;
                const driverToolsRequiredList = data.data.driverToolsRequiredList;
                const functionalTestingRequiredList = data.data.functionalTestingRequiredList;
                const restrictUsePermanentlyList = data.data.restrictUsePermanentlyList;
                const restrictUseWithPermissionList = data.data.restrictUseWithPermissionList;
                const restrictUsePermanentlyExcludePackagList = data.data.restrictUsePermanentlyExcludePackagList;
                const restrictUseWithPermissionExcludePackagList = data.data.restrictUseWithPermissionExcludePackagList;
                const notUseMountingTypes = data.data.notUseMountingTypes;
                const notUseFunctionalTypes = data.data.notUseFunctionalTypes;
                const exportControlledMFGPNList = data.data.exportControlledMFGPNList;
                const uomMismatchList = data.data.uomMismatchList;
                const mismatchNumberOfRowsList = data.data.mismatchNumberOfRowsList;
                const partPinIsLessthenBOMPinList = data.data.partPinIsLessthenBOMPinList;
                const tbdPartList = data.data.tbdPartList;
                const restrictCPNUsePermanentlyList = data.data.restrictCPNUsePermanentlyList;
                const restrictCPNUseWithPermissionList = data.data.restrictCPNUseWithPermissionList;
                const partProgramMappingList = data.data.partProgramMappingList;
                const programingStatusMismatchList = data.data.programingStatusMismatchList;
                const CPNCustomPartRevMismatchList = data.data.CPNCustomPartRevMismatchList;
                const CustomPartRevMismatchList = data.data.CustomPartRevMismatchList;

                invalidMFGList.forEach((obj) => {
                  var bomObj = _.find(vm.refBomModel, (item) => item.mfgCode === obj.mfgCode && item.mfgPN === obj.mfgPN);

                  if (!bomObj) {
                    return;
                  }
                  bomObj.distCodeStep = true;
                  if (!obj.mfgCodeID) {
                    bomObj.mfgCodeStep = false;
                    bomObj.mfgCodeStepError = generateDescription(bomObj, _mfgInvalidError);
                  }

                  bomObj.distPNStep = true;
                  if (!obj.mfgPNID) {
                    bomObj.mfgPNStep = false;
                    bomObj.mfgPNStepError = generateDescription(bomObj, _mfgPNInvalidError);
                  }

                  if (obj.mfgCodeID && obj.mfgPNID) {
                    bomObj.mfgVerificationStep = bomObj.mfgGoodPartMappingStep = bomObj.unknownPartStep = bomObj.defaultInvalidMFRStep = true;
                    if (!obj.isVerify) {
                      bomObj.mfgVerificationStep = false;
                      bomObj.mfgVerificationStepError = generateDescription(bomObj, _mfgVerificationError);
                    }
                    // null, false or true
                    else if (obj.isGoodPart === PartCorrectList.IncorrectPart) {
                      bomObj.mfgGoodPartMappingStep = false;
                      bomObj.mfgGoodPartMappingStepError = generateDescription(bomObj, _mfgGoodPartMappingError);
                    }
                    else if (obj.isGoodPart === PartCorrectList.UnknownPart) {
                      bomObj.unknownPartStep = false;
                      bomObj.unknownPartError = generateDescription(bomObj, _unknownPartError);
                    }
                    if (obj.mfgCodeID === CORE.DefaultInvalidMFRID) {
                      bomObj.defaultInvalidMFRStep = false;
                      bomObj.defaultInvalidMFRError = generateDescription(bomObj, _defaultInvalidMFRError);
                    }
                  }

                  mfgVerificationStepFn(bomObj);
                  bomObj.isUpdate = true;
                });

                invalidDISTList.forEach((obj) => {
                  var bomObj = _.find(vm.refBomModel, (item) => item.distributor === obj.distributor && item.distPN === obj.distPN);

                  if (!bomObj) {
                    return;
                  }
                  bomObj.distCodeStep = true;
                  if (!bomObj.distMfgCodeID) {
                    bomObj.distCodeStep = false;
                    bomObj.distCodeStepError = generateDescription(bomObj, _distInvalidError);
                  }

                  bomObj.distPNStep = true;
                  if (!bomObj.distMfgPNID) {
                    bomObj.distPNStep = false;
                    bomObj.distPNStepError = generateDescription(bomObj, _distPNInvalidError);
                  }

                  if (bomObj.distMfgCodeID && bomObj.distMfgPNID) {
                    bomObj.distVerificationStep = bomObj.mfgGoodPartMappingStep = bomObj.unknownPartStep = true;
                    if (!obj.isVerify) {
                      bomObj.distVerificationStep = false;
                      bomObj.distVerificationStepError = generateDescription(bomObj, _distVerificationError);
                    }
                    // null, false or true
                    else if (obj.isGoodPart === PartCorrectList.IncorrectPart) {
                      bomObj.mfgGoodPartMappingStep = false;
                      bomObj.mfgGoodPartMappingStepError = generateDescription(bomObj, _mfgGoodPartMappingError);
                    }
                    else if (obj.isGoodPart === PartCorrectList.UnknownPart) {
                      bomObj.unknownPartStep = false;
                      bomObj.unknownPartError = generateDescription(bomObj, _unknownPartError);
                    }
                  }

                  distVerificationStepFn(bomObj);
                  bomObj.isUpdate = true;
                });

                invalidMappingList.forEach((obj) => {
                  var bomObj = _.find(vm.refBomModel, (item) => item.mfgPN === obj.mfgPN && item.distPN === obj.distPN);
                  bomObj.mfgDistMappingStep = true;
                  if (bomObj) {
                    bomObj.mfgDistMappingStep = false;
                    bomObj.mfgDistMappingStepError = generateDescription(bomObj, _mfgDistMappingError);

                    mfgVerificationStepFn(bomObj);
                    distVerificationStepFn(bomObj);
                    bomObj.isUpdate = true;
                  }
                });

                mountingTypeMismatchList.forEach((item) => {
                  var bomObj = _.find(vm.refBomModel, (obj) => obj._lineID === item.lineID && obj.mfgPN === item.mfgPN);
                  if (bomObj) {
                    if (!bomObj.badMfgPN) {
                      bomObj.mismatchMountingTypeStep = false;
                      bomObj.mismatchMountingTypeError = generateDescription(bomObj, _mismatchMountingTypeError);
                    }
                    if (!bomObj.approvedMountingType && bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) {
                      bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                      bomObj.customerApprovalStepError = generateDescription(bomObj, _customerApprovalError);
                    }
                    mfgVerificationStepFn(bomObj);
                    bomObj.isUpdate = true;
                  }
                });

                programingStatusMismatchList.forEach((item) => {
                  var bomObj = _.find(vm.refBomModel, (obj) => obj._lineID === item.lineID && obj.mfgPN === item.mfgPN);
                  if (bomObj) {
                    bomObj.mismatchProgrammingStatusStep = false;
                    bomObj.mismatchProgrammingStatusError = generateDescription(bomObj, _mismatchProgrammingStatusError);
                    if (bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) {
                      bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                      bomObj.customerApprovalStepError = generateDescription(bomObj, _customerApprovalError);
                    }
                    mfgVerificationStepFn(bomObj);
                    bomObj.isUpdate = true;
                  }
                });

                functionalValidationMismatchList.forEach((item) => {
                  var bomObj = _.find(vm.refBomModel, (obj) => obj._lineID === item.lineID && obj.mfgPN === item.mfgPN);
                  if (bomObj) {
                    if (!bomObj.badMfgPN) {
                      bomObj.mismatchFunctionalCategoryStep = false;
                      bomObj.mismatchFunctionalCategoryError = generateDescription(bomObj, _mismatchFunctionalCategoryError);
                    }
                    if (!bomObj.approvedMountingType && bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) {
                      bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                      bomObj.customerApprovalStepError = generateDescription(bomObj, _customerApprovalError);
                    }
                    mfgVerificationStepFn(bomObj);
                    bomObj.isUpdate = true;
                  }
                });

                exportControlledMFGPNList.forEach((item) => {
                  var bomObj = _.find(vm.refBomModel, (obj) => obj._lineID === item.lineID && obj.mfgPN === item.mfgPN);
                  if (bomObj) {
                    bomObj.exportControlledStep = true;
                    bomObj.exportControlledError = null;
                    if (bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                      bomObj.exportControlledStep = false;
                      bomObj.exportControlledError = generateDescription(bomObj, _exportControlledError);
                      bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                      bomObj.customerApprovalStepError = generateDescription(bomObj, _customerApprovalError);
                    }
                    mfgVerificationStepFn(bomObj);
                    bomObj.isUpdate = true;
                  }
                });

                invalidEpoxyPartsList.forEach((item) => {
                  var bomObj = _.find(vm.refBomModel, (obj) => obj._lineID === item.lineID && obj.mfgPN === item.mfgPN);
                  bomObj.epoxyStep = true;
                  if (bomObj) {
                    bomObj.epoxyStep = false;
                    bomObj.epoxyStepError = generateDescription(bomObj, _epoxyError);
                    mfgVerificationStepFn(bomObj);
                    bomObj.isUpdate = true;
                  }
                });

                restrictUseWithPermissionList.forEach((item) => {
                  var bomObj = _.find(vm.refBomModel, (obj) => obj._lineID === item.lineID && obj.mfgPN === item.mfgPN);
                  if (bomObj && bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                    bomObj.restrictUseWithPermissionStep = false;
                    bomObj.restrictUseWithPermissionError = generateDescription(bomObj, _restrictUseWithPermissionError);
                    mfgVerificationStepFn(bomObj);
                    bomObj.isUpdate = true;
                  }
                });

                restrictUseWithPermissionExcludePackagList.forEach((item) => {
                  var bomObj = _.find(vm.refBomModel, (obj) => obj._lineID === item.lineID && obj.mfgPN === item.mfgPN);
                  if (bomObj && bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                    bomObj.restrictUseExcludingAliasWithPermissionStep = false;
                    bomObj.restrictUseExcludingAliasWithPermissionError = generateDescription(bomObj, _restrictUseExcludingAliasWithPermissionError);
                    mfgVerificationStepFn(bomObj);
                    bomObj.isUpdate = true;
                  }
                });

                uomMismatchList.forEach((item) => {
                  var bomObj = _.find(vm.refBomModel, (obj) => obj._lineID === item.lineID && obj.mfgPN === item.mfgPN);
                  if (bomObj) {
                    let lineUOM = (bomObj.uomID || bomObj.uomID === 0) ? bomObj.uomID : bomObj.uom;
                    const partUOM = bomObj.uom;
                    if (!bomObj.lineID && bomObj._lineID) {
                      const bomDet = _.find(vm.refBomModel, { lineID: bomObj._lineID });
                      if (bomDet && bomDet.uomID) {
                        bomObj.uomID = lineUOM = bomDet.uomID;
                      }
                    }
                    const objLineUOMType = _unitList.find((y) => y.unitName && lineUOM && y.unitName.toUpperCase() === lineUOM.toUpperCase());
                    const lineUOMType = (objLineUOMType && objLineUOMType.measurementType) ? objLineUOMType.measurementType.name : null;

                    const objPartUOMType = _unitList.find((y) => y.unitName && partUOM && y.unitName.toUpperCase() === partUOM.toUpperCase());
                    const partUOMype = objPartUOMType && objPartUOMType.measurementType ? objPartUOMType.measurementType.name : null;

                    if (lineUOMType !== partUOMype) {
                      bomObj.uomMismatchedStep = false;
                      bomObj.uomMismatchedError = generateDescription(bomObj, _uomMismatchedError);
                    }
                    bomObj.isUpdate = true;
                    mfgVerificationStepFn(bomObj);
                  }
                });

                restrictUsePermanentlyList.forEach((item) => {
                  var bomObj = _.find(vm.refBomModel, (obj) => obj._lineID === item.lineID && obj.mfgPN === item.mfgPN);
                  if (bomObj) {
                    bomObj.restrictUsePermanentlyStep = false;
                    bomObj.restrictUsePermanentlyError = generateDescription(bomObj, _restrictUsePermanentlyError);
                    mfgVerificationStepFn(bomObj);
                    bomObj.isUpdate = true;
                  }
                });

                restrictUsePermanentlyExcludePackagList.forEach((item) => {
                  var bomObj = _.find(vm.refBomModel, (obj) => obj._lineID === item.lineID && obj.mfgPN === item.mfgPN);
                  if (bomObj) {
                    bomObj.restrictUseExcludingAliasStep = false;
                    bomObj.restrictUseExcludingAliasError = generateDescription(bomObj, _restrictUseExcludingAliasError);
                    mfgVerificationStepFn(bomObj);
                    bomObj.isUpdate = true;
                  }
                });


                matingPartRequiredList.forEach((item) => {
                  var bomObj = _.find(vm.refBomModel, (obj) => obj._lineID === item.lineID && obj.mfgPN === item.mfgPN);
                  if (bomObj) {
                    bomObj.matingPartRquiredStep = false;
                    bomObj.matingPartRequiredError = generateDescription(bomObj, _matingPartRequiredError);
                    mfgVerificationStepFn(bomObj);
                    bomObj.isUpdate = true;
                  }
                });


                driverToolsRequiredList.forEach((item) => {
                  var bomObj = _.find(vm.refBomModel, (obj) => obj._lineID === item.lineID && obj.mfgPN === item.mfgPN);
                  if (bomObj) {
                    bomObj.driverToolsRequiredStep = false;
                    bomObj.driverToolsRequiredError = generateDescription(bomObj, _driverToolsRequiredError);
                    mfgVerificationStepFn(bomObj);
                    bomObj.isUpdate = true;
                  }
                });

                _.each(vm.refBomModel, (bomObj) => {
                  if (bomObj.programingRequired || bomObj.isCustPNProgrammingRequire) {
                    let lineProgramingStatus = bomObj.programingStatus;
                    bomObj.programingRequiredIDs = null;
                    const nonePrograming = _.head(_programingStatusList);
                    if (!bomObj.lineID && bomObj._lineID) {
                      const bomDet = _.find(vm.refBomModel, { lineID: bomObj._lineID });
                      if (bomDet && bomDet.programingStatus) {
                        lineProgramingStatus = bomDet.programingStatus;
                      }
                    }
                    if (lineProgramingStatus === nonePrograming.value) {
                      bomObj.programingRequiredStep = false;
                      bomObj.programingRequiredError = generateDescription(bomObj, _programingRequiredError);
                      if (bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                        bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                        bomObj.customerApprovalStepError = generateDescription(bomObj, _customerApprovalError);
                      }
                    } else if ((lineProgramingStatus === _programingStatusList[4].value || lineProgramingStatus === _programingStatusList[5].value)) {
                      if (bomObj.programingRequiredStep) {
                        const refDesgArry = getDesignatorFromLineItem(bomObj.refDesig, vm.DisplayOddelyRefDes);
                        const PendingRefdes = [];
                        _.each(refDesgArry, (item) => {
                          const refDesMapping = _.find(partProgramMappingList, (objRefDesgMap) => objRefDesgMap.partRefDesg === item);
                          if (!refDesMapping) {
                            PendingRefdes.push(item);
                          }
                        });
                        if (bomObj.isBuyDNPQty === _buyDNPQTYList[3].value) {
                          const dnpDesgArry = getDesignatorFromLineItem(bomObj.dnpDesig, vm.DisplayOddelyRefDes);
                          _.each(dnpDesgArry, (item) => {
                            const dnpDesMapping = _.find(partProgramMappingList, (objRefDesgMap) => objRefDesgMap.partRefDesg === item);
                            if (!dnpDesMapping) {
                              PendingRefdes.push(item);
                            }
                          });
                        }
                        if (PendingRefdes.length > 0) {
                          bomObj.mappingPartProgramStep = false;
                          bomObj.mappingPartProgramError = generateDescription(bomObj, _mappingPartProgramError);
                          bomObj.mappingPartProgramError = stringFormat(bomObj.mappingPartProgramError, PendingRefdes.join());
                        }
                        bomObj.programmingMappingPendingRefdesCount = PendingRefdes.length;
                      }
                      else if (bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED || (lineProgramingStatus !== nonePrograming.value && bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED)) {
                        // Error programing part
                        bomObj.programingRequiredStep = false;
                        bomObj.programingRequiredError = generateDescription(bomObj, _programingRequiredError);
                      }
                    }
                  }
                  else if (bomObj.mountingID === -2 || bomObj.functionalID === -2) {
                    bomObj.programingRequiredStep = true;
                    if (bomObj.programingRequiredStep) {
                      const PendingRefdes = [];
                      const refDesgArry = getDesignatorFromLineItem(bomObj.refDesig, vm.DisplayOddelyRefDes);
                      _.each(refDesgArry, (item) => {
                        const refDesMapping = _.find(partProgramMappingList, (objRefDesgMap) => objRefDesgMap.softwareRefDesg === item);
                        if (!refDesMapping) {
                          PendingRefdes.push(item);
                        }
                      });
                      if (bomObj.dnpDesig) {
                        const dnpDesgArry = getDesignatorFromLineItem(bomObj.dnpDesig, vm.DisplayOddelyRefDes);
                        _.each(dnpDesgArry, (item) => {
                          const dnpDesMapping = _.find(partProgramMappingList, (objRefDesgMap) => objRefDesgMap.softwareRefDesg === item);
                          if (!dnpDesMapping) {
                            PendingRefdes.push(item);
                          }
                        });
                      }
                      if (PendingRefdes.length > 0) {
                        bomObj.mappingPartProgramStep = false;
                        bomObj.mappingPartProgramError = generateDescription(bomObj, _mappingPartProgramError);
                        bomObj.mappingPartProgramError = stringFormat(bomObj.mappingPartProgramError, PendingRefdes.join());
                      }
                      bomObj.programmingMappingPendingRefdesCount = PendingRefdes.length;
                    }
                    mfgVerificationStepFn(bomObj);
                  }
                });

                pickupPadRequiredList.forEach((item) => {
                  var bomObj = _.find(vm.refBomModel, (obj) => obj._lineID === item.lineID && obj.mfgPN === item.mfgPN);
                  if (bomObj) {
                    bomObj.pickupPadRequiredStep = false;
                    bomObj.pickupPadRequiredError = generateDescription(bomObj, _pickupPadRequiredError);
                    mfgVerificationStepFn(bomObj);
                    bomObj.isUpdate = true;
                  }
                });
                functionalTestingRequiredList.forEach((item) => {
                  var bomObj = _.find(vm.refBomModel, (obj) => obj._lineID === item.lineID && obj.mfgPN === item.mfgPN);
                  if (bomObj) {
                    bomObj.functionalTestingRequiredStep = false;
                    bomObj.functionalTestingRequiredError = generateDescription(bomObj, _functionalTestingRequiredError);
                    mfgVerificationStepFn(bomObj);
                    bomObj.isUpdate = true;
                  }
                });
                mismatchNumberOfRowsList.forEach((item) => {
                  var bomObj = _.find(vm.refBomModel, (obj) => obj._lineID === item.lineID && obj.mfgPN === item.mfgPN);
                  if (bomObj) {
                    bomObj.mismatchNumberOfRowsStep = false;
                    bomObj.mismatchNumberOfRowsError = generateDescription(bomObj, _mismatchNumberOfRowsError);
                    mfgVerificationStepFn(bomObj);
                    bomObj.isUpdate = true;
                  }
                });
                partPinIsLessthenBOMPinList.forEach((item) => {
                  var bomObj = _.find(vm.refBomModel, (obj) => obj._lineID === item.lineID && obj.mfgPN === item.mfgPN);
                  if (bomObj) {
                    bomObj.partPinIsLessthenBOMPinStep = false;
                    bomObj.partPinIsLessthenBOMPinError = generateDescription(bomObj, _partPinIsLessthenBOMPinError);
                    mfgVerificationStepFn(bomObj);
                    bomObj.isUpdate = true;
                  }
                });
                tbdPartList.forEach((item) => {
                  var bomObj = _.find(vm.refBomModel, (obj) => obj._lineID === item.lineID && obj.mfgPN === item.mfgPN);
                  if (bomObj) {
                    bomObj.tbdPartStep = false;
                    bomObj.tbdPartError = generateDescription(bomObj, _tbdPartError);
                    mfgVerificationStepFn(bomObj);
                    bomObj.isUpdate = true;
                  }
                });
                restrictCPNUseWithPermissionList.forEach((item) => {
                  var bomObj = _.find(vm.refBomModel, (obj) => obj._lineID === item.lineID && obj.custPN === item.custPN && obj.customerRev === item.customerRev);
                  if (bomObj) {
                    bomObj.restrictCPNUseWithPermissionStep = false;
                    bomObj.restrictCPNUseWithPermissionError = generateDescription(bomObj, _restrictCPNUseWithPermissionError);
                    bomObj.restrictCPNUsePermanentlyError = generateDescription(bomObj, _restrictCPNUsePermanentlyError);
                    cpnDuplicateStepFn(bomObj);
                    mfgVerificationStepFn(bomObj);
                    bomObj.isUpdate = true;
                  }
                });
                restrictCPNUsePermanentlyList.forEach((item) => {
                  var bomObj = _.find(vm.refBomModel, (obj) => obj._lineID === item.lineID && obj.custPN === item.custPN && obj.customerRev === item.customerRev);
                  if (bomObj) {
                    bomObj.restrictCPNUsePermanentlyStep = false;
                    bomObj.restrictCPNUsePermanentlyError = generateDescription(bomObj, _restrictCPNUsePermanentlyError);
                    cpnDuplicateStepFn(bomObj);
                    mfgVerificationStepFn(bomObj);
                    bomObj.isUpdate = true;
                  }
                });
                CPNCustomPartRevMismatchList.forEach((item) => {
                  var bomObj = _.find(vm.refBomModel, (obj) => obj._lineID === item.lineID && obj.mfgPN === item.mfgPN);
                  if (bomObj) {
                    bomObj.isMPNAddedinCPN = false;
                    bomObj.mismatchCPNandCustpartRevStep = false;
                    bomObj.mismatchCPNandCustpartRevError = generateDescription(bomObj, _mismatchCPNandCustpartRevError);
                    if (bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.NONE) {
                      bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                    }
                    cpnDuplicateStepFn(bomObj);
                    mfgVerificationStepFn(bomObj);
                    bomObj.isUpdate = true;
                  }
                });
                CustomPartRevMismatchList.forEach((item) => {
                  var bomObj = _.find(vm.refBomModel, (obj) => obj._lineID === item.lineID && obj.mfgPN === item.mfgPN);
                  if (bomObj && bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                    bomObj.mismatchCustpartRevStep = false;
                    bomObj.mismatchCustpartRevError = generateDescription(bomObj, _mismatchCustpartRevError);
                    if (bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.NONE) {
                      bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                    }
                    cpnDuplicateStepFn(bomObj);
                    mfgVerificationStepFn(bomObj);
                    bomObj.isUpdate = true;
                  }
                });
                if (restrictCPNUseWithPermissionList.length > 0 || restrictCPNUsePermanentlyList.length > 0) {
                  checkCPNRestrictCase();
                }
                if (vm.refBomModel.length > 1 && (notUseMountingTypes.length > 0 || notUseFunctionalTypes.length > 0)) {
                  if (notUseMountingTypes.length > 0) {
                    vm.refBomModel[0].mountingtypes = notUseMountingTypes.join(', ');
                    vm.refBomModel[0].requireMountingTypeStep = false;
                    vm.refBomModel[0].requireMountingTypeError = generateDescription(vm.refBomModel[0], _requireMountingTypeError);
                  }
                  if (notUseFunctionalTypes.length > 0) {
                    vm.refBomModel[0].functionaltypes = notUseFunctionalTypes.join(', ');
                    vm.refBomModel[0].requireFunctionalTypeStep = false;
                    vm.refBomModel[0].requireFunctionalTypeError = generateDescription(vm.refBomModel[0], _requireFunctionalTypeError);
                  }
                  mfgVerificationStepFn(vm.refBomModel[0]);
                }

                setHeaderStyle();
                _hotRegisterer.render();
                vm.verifyBOMConfirmation();
                break;
              }
              case 'PasswordApproval': {
                vm.passwordApproval = false;
                vm.VerifiedConfirm = true;
                _.each(vm.refBomModel, (bomObj) => {
                  mfgVerificationStepFn(bomObj);
                });
                vm.verifyAndSave();
                break;
              }
              // Success
              default: {
                // send data to parent bom.controller to enable the verify BOM tab
                bomDelete = [];
                rowDeleted = [];
                $scope.$emit('isBOMVerified', true);
                vm.isBOMChanged = BOMFactory.isBOMChanged = false;
                vm.checkCPN = false;
                vm.checkUnlockPN = false;
                BaseService.currentPageFlagForm = [];
                if (!vm.isSubAssembly) {
                  $state.go(RFQTRANSACTION.RFQ_PLANNED_BOM_STATE, { id: _rfqAssyID }, { reload: true });
                }
                else {
                  BOMFactory.bomSelectedFilter = vm.selectedFilter;
                  $scope.$parent.active();
                  $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion);
                }
                break;
              }
            }
          }
          else if (response && response.errors) {
            vm.checkCPN = false;
            vm.checkUnlockPN = false;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_UPLOAD_FAIL);
            const alertModel = {
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(alertModel);
          }
        }).catch((error) => {
          vm.checkCPN = false;
          vm.checkUnlockPN = false;
          BaseService.getErrorLog(error);
        });
      }
      // Verify BOM and Save confirmation pop-up
      vm.verifyBOMConfirmation = function () {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.VERIFY_BOM_CONFIRAMTION);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.VerifiedConfirm = true;
            vm.passwordApproval = false;
            vm.verifyAndSave();
          }
        }, () => {
          vm.checkCPN = false;
          vm.checkUnlockPN = false;
        });
      };
      // Check Same CPN exists in different BOM of same customer
      vm.checkCPNExistInDiffrentBOM = function (isSaveOriginal, isDraftVerified, isFromBOMButton, fromdraft) {
        const cpnModel = [];
        vm.checkCPN = true;
        vm.refBomModel.forEach((item) => {
          // Check Line Updated or not for CPN entry update
          const changeLineCount = _.filter(vm.refBomModel, (data) => (data._lineID === item._lineID && data.mfgPNID && (!data.id || rowDeleted.includes(data.id) || data.isUpdate)));
          if (item.custPN !== null && item.custPN !== '' && item.custPN !== undefined && changeLineCount.length > 0) {
            const cpn = (item.custPN + ' Rev' + (item.customerRev !== null && item.customerRev !== '' && item.customerRev !== undefined ? item.customerRev : '-'));
            cpnModel.push(cpn.replace(/"/g, '\\"').replace(/'/g, '\\\''));
          }
        });
        if (cpnModel.length > 0) {
          const model = {
            pPartID: _partID,
            pCPNList: cpnModel.join(',')
          };
          return vm.cgBusyLoading = ImportBOMFactory.checkCPNExistInOtherBOM().save(model).$promise.then((response) => {
            if (response && response.data && response.data.length > 0) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.CPN_CHANGE_FOR_ALL_BOM_CONFIRAMTION);
              const message = messageContent.message + '<br/><br/><table style="width:100%"><thead><tr><th class="border-bottom padding-5">Assy ID</th><th class="border-bottom padding-5">CPN</th></tr></thead><tbody>{0}</tbody></table>';
              const subMessage = [];
              const differentCPNList = [];
              const cpnListWithRev = _.groupBy(vm.refBomModel, 'custPNWithRev');
              _.each(cpnListWithRev, (item, index) => {
                if (index && item && item.length > 0 && item[0]._lineID) {
                  const cpnDB = _.find(response.data, { 'cpn': index });
                  if (cpnDB && cpnDB.componentIDs) {
                    const cpnDBPartList = cpnDB.componentIDs.split(',');
                    const cpnPartList = _.map(_.filter(vm.refBomModel, { '_lineID': item[0]._lineID }), 'mfgPNID');
                    if (!_.isEqual(_.sortBy(cpnDBPartList.map(Number)), _.sortBy(cpnPartList))) {
                      differentCPNList.push(index);
                    }
                  }
                }
              });
              if (differentCPNList.length > 0) {
                const asslist = _.groupBy(_.filter(response.data, (p) => _.includes(differentCPNList, p.cpn)), 'pIDCode');
                _.each(asslist, (item, index) => {
                  const cpnList = _.map(item, (objitems) => '<a target="_blank" href="' + WebsiteBaseUrl + '/#!/component/managemfg/detail/' + objitems.custPNID + '">' + objitems.cpn + '</a>');
                  const assysID = item[0].partID;
                  subMessage.push('<tr><td class="border-bottom padding-5"> <a target="_blank" href="' + WebsiteBaseUrl + '/#!/component/managemfg/detail/' + assysID + '">' + index + '</a></td><td class="border-bottom padding-5">' + cpnList.join(', ') + '</td></tr>');
                });
                messageContent.message = stringFormat(message, subMessage.join(''));
                const obj = {
                  messageContent: messageContent,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };

                DialogFactory.messageConfirmDialog(obj).then((yes) => {
                  if (yes) {
                    if (fromdraft) {
                      vm.draftSave(isSaveOriginal, isDraftVerified, isFromBOMButton);
                    }
                    else {
                      vm.verifyAndSave();
                    }
                  }
                  else {
                    vm.checkCPN = false;
                  }
                }, () => {
                  vm.checkCPN = false;
                }).catch((error) => BaseService.getErrorLog(error));
              } else {
                if (fromdraft) {
                  vm.draftSave(isSaveOriginal, isDraftVerified, isFromBOMButton);
                }
                else {
                  vm.verifyAndSave();
                }
              }
            }
            else {
              if (fromdraft) {
                vm.draftSave(isSaveOriginal, isDraftVerified, isFromBOMButton);
              }
              else {
                vm.verifyAndSave();
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          if (fromdraft) {
            vm.draftSave(isSaveOriginal, isDraftVerified, isFromBOMButton);
          }
          else {
            vm.verifyAndSave();
          }
        }
      };
      // Check Unlock BOM parts in case of part is approved and only unlock
      vm.checkUnlockParts = function (isSaveOriginal, isDraftVerified, isFromBOMButton, fromdraft) {
        vm.checkUnlockPN = true;
        const unlockParts = _.filter(vm.refBomModel, (bomObj) => !isBOMObjInValid(partInvalidMatchList, bomObj) && bomObj.isUnlockApprovedPart);

        if (unlockParts.length > 0) {
          const model = {
            title: RFQTRANSACTION.BOM.UNLOCK_PART_MFG,
            textContent: RFQTRANSACTION.BOM.UNLOCK_PART_MFG_TEXT,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.confirmDiolog(model).then((yes) => {
            if (yes) {
              unlockParts.forEach((item) => {
                if (item.isUnlockApprovedPart) {
                  item.isUnlockApprovedPart = false;
                  item.isUpdate = true;
                }
              });
            }
            if (fromdraft) {
              vm.draftSave(isSaveOriginal, isDraftVerified, isFromBOMButton);
            }
            else {
              vm.verifyAndSave();
            }
          }, () => {
            if (fromdraft) {
              vm.draftSave(isSaveOriginal, isDraftVerified, isFromBOMButton);
            }
            else {
              vm.verifyAndSave();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          if (fromdraft) {
            vm.draftSave(isSaveOriginal, isDraftVerified, isFromBOMButton);
          }
          else {
            vm.verifyAndSave();
          }
        }
      };
      // Save Draft BOM (Save BOM Changes)
      vm.draftSave = function (isSaveOriginal, isDraftVerified, isFromBOMButton) {
        if (vm.isBOMReadOnly) { return false; }
        const bindBOMDraftSave = [bomDraftSave(isSaveOriginal, isDraftVerified, isFromBOMButton)];
        vm.cgBusyLoading = $q.all(bindBOMDraftSave).then(() => {
        });
      };
      // Save Draft BOM (Save BOM Changes) prepare model for save
      const bomDraftSave = (isSaveOriginal, isDraftVerified, isFromBOMButton) => $timeout(() => {
        // if invalid CPN BOM import then perform this block and gain reload the existing data
        if (isSaveOriginal && checkInvalidCPN()) {
          vm.isNoDataFound = true;
          vm.cgBusyLoading = getRFQLineItemsByID().then((response) => {
            if (response) {
              vm.settings.minSpareRows = 1;
              vm.settings.className = '';
              displayRFQLineItemsByID(response);
            }
          }).catch((error) => {
            BaseService.getErrorLog(error);
          });
          return false;
        }
        if (!vm.checkCPN) {
          vm.checkCPNExistInDiffrentBOM(isSaveOriginal, isDraftVerified, isFromBOMButton, true);
          return false;
        }
        if (!vm.checkUnlockPN) {
          vm.checkUnlockParts(isSaveOriginal, isDraftVerified, isFromBOMButton, true);
          return false;
        }
        if (!isSaveOriginal) {
          if (checkDuplicateCPN() || checkInvalidLineItem() || checkInvalidLineUOM() || checkInvalidProgrammingStatus() || checkDuplicateItemNumber() || checkDuplicateCustBOMLine() || checkDuplicateSubAssembly() || checkSubAssyInAlternateDetails() || checkInvalidCPN() || checkCPNWithAssembly() || checkCPNWithAlternatePartForNotAvailable() || checkInvalidCPNMapping()) {
            return false;
          }
        }
        vm.checkCPN = false;
        vm.checkUnlockPN = false;
        vm.checkCPNCustomRev = false;
        const bomModel = angular.copy(vm.refBomModel);
        const rowsArr = [];

        const mergeCellsPlugin = _hotRegisterer ? _hotRegisterer.getPlugin('MergeCells') : null;

        let ProgramRequiredRefDesgArray = [];
        let SoftwareRefDESArray = [];

        bomModel.forEach((item, index) => {
          if (((!isFilterApply && _hotRegisterer && _hotRegisterer.isEmptyRow(index)) || _.isEmpty(_.pickBy(item, _.identity)))) {
            rowsArr.push(item);
          } else {
            item.mfgCode = item.mfgCode ? replaceHiddenSpecialCharacter(item.mfgCode) : item.mfgCode;
            item.mfgPN = item.mfgPN ? replaceHiddenSpecialCharacter(item.mfgPN) : item.mfgPN;
            item.custPN = item.custPN ? replaceHiddenSpecialCharacter(item.custPN) : item.custPN;

            // if values of lineID and dnpQty is '' then error generate into API side
            //item.lineID = item._lineID || null;
            item._lineID = vm.DecimalNmberPattern.test(item._lineID) ? item._lineID : null;
            item.dnpQty = item.dnpQty || null;

            item.isPurchase = item.isPurchase !== null ? item.isPurchase : true;
            item.isNotRequiredKitAllocation = (item.isNotRequiredKitAllocation !== null && item.isNotRequiredKitAllocation !== undefined) ? item.isNotRequiredKitAllocation : true;
            item.isSupplierToBuy = (item.isSupplierToBuy !== null && item.isSupplierToBuy !== undefined) ? item.isSupplierToBuy : true;
            if (item.isNotRequiredKitAllocation) {
              if (item.isNotRequiredKitAllocation && (item.isNotRequiredKitAllocation === true || item.isNotRequiredKitAllocation.toString().toUpperCase() === 'TRUE' || item.isNotRequiredKitAllocation.toString().toUpperCase() === '1' || item.isNotRequiredKitAllocation.toString().toUpperCase() === 'YES')) {
                item.isNotRequiredKitAllocation = true;
              } else {
                item.isNotRequiredKitAllocation = false;
              }
            }
            if (item.isSupplierToBuy) {
              if (item.isSupplierToBuy && (item.isSupplierToBuy === true || item.isSupplierToBuy.toString().toUpperCase() === 'TRUE' || item.isSupplierToBuy.toString().toUpperCase() === '1' || item.isSupplierToBuy.toString().toUpperCase() === 'YES')) {
                item.isSupplierToBuy = true;
              } else {
                item.isSupplierToBuy = false;
              }
            }
            item.org_isPurchase = item.isPurchase;
            if (item.isPurchase) {
              if (item.isPurchase && (item.isPurchase === true || item.isPurchase.toString().toUpperCase() === 'TRUE' || item.isPurchase.toString().toUpperCase() === '1' || item.isPurchase.toString().toUpperCase() === 'YES')) {
                item.isPurchase = true;
              } else {
                item.isPurchase = false;
              }
            }

            item.isInstall = item.isInstall !== null ? item.isInstall : true;
            item.org_isInstall = item.isInstall;
            if (item.isInstall) {
              if (item.isInstall && (item.isInstall === true || item.isInstall.toString().toUpperCase() === 'TRUE' || item.isInstall.toString().toUpperCase() === '1' || item.isInstall.toString().toUpperCase() === 'YES')) {
                item.isInstall = true;
              } else {
                item.isInstall = false;
              }
            }

            if (item.uomID) {
              item.org_uomName = item.uomID;
              const unit = _.find(_unitList, (y) => {
                if (y.unitName && y.unitName.toUpperCase() === item.uomID.toUpperCase() || y.alias && y.alias.length > 0 && y.alias.find((x) => x.alias.toUpperCase() === item.uomID.toUpperCase())) {
                  return y;
                }
              });
              //var unit = _unitList.find(y => y.unitName && y.unitName.toUpperCase() == item.uomID.toUpperCase());
              item.uomID = unit ? unit.id : null;
            }
            else {
              item.org_uomName = item.uomID = null;
            }

            if (item.programingStatus) {
              const programing = _programingStatusList.find((y) => y.value && y.value.toUpperCase() === item.programingStatus.toUpperCase());
              item.programingStatus = programing ? programing.id : null;
            }

            item.org_buyDNPQty = item.isBuyDNPQty;
            if (item.isBuyDNPQty) {
              const dnpQty = _buyDNPQTYList.find((y) => y.value && y.value.toUpperCase() === item.isBuyDNPQty.toString().trim().toUpperCase());
              item.isBuyDNPQty = dnpQty ? dnpQty.id : _buyDNPQTYList[0].id;
            }

            // substitutes Allow
            if (item.substitutesAllow !== null && item.substitutesAllow !== '' && item.substitutesAllow !== undefined) {
              item.org_substitutesAllow = item.substitutesAllow;
              const substitutesAllow = _.find(_substitutesAllowList, (y) => {
                if (y.value && y.value.toUpperCase() === item.substitutesAllow.toUpperCase() || y.alias && y.alias.length > 0 && y.alias.find((x) => x.alias.toUpperCase() === item.substitutesAllow.toUpperCase())) {
                  return y;
                }
              });
              item.substitutesAllow = substitutesAllow ? substitutesAllow.id : null;
            }
            else {
              item.substitutesAllow = _.head(_substitutesAllowList).id;
            }
            if (item.custPN && (item.customerRev === null || item.customerRev === undefined || item.customerRev === '')) {
              item.customerRev = '-';
            }
            // create substring as per allow max length
            item.customerRev = item.customerRev ? item.customerRev.toString().substring(0, 10) : null;
            item.customerRev = (item.customerRev !== null && item.customerRev !== undefined) ? replaceHiddenSpecialCharacter(item.customerRev) : null;
            item.lineID = item._lineID ? item._lineID.toString().substring(0, 7) : null;
            item.refRFQLineItemID = item.refRFQLineItemID ? item.refRFQLineItemID.substring(0, 7) : null;

            // allow only number
            item.level = item.level ? Number(item.level) : null;
            item.qpa = item.qpa || item.qpa === 0 ? Number(item.qpa) : null;
            item.dnpQty = item.dnpQty || item.dnpQty === 0 ? Number(item.dnpQty) : null;
            item.numOfPosition = item.numOfPosition ? Number(item.numOfPosition) : null;
            item.numOfRows = item.numOfRows ? Number(item.numOfRows) : null;

            const partTypeIDObj = _partTypeList.find((y) => y.partTypeName === item.parttypeID);
            if (partTypeIDObj) {
              item.parttypeID = partTypeIDObj.id;
              item.isFunctionalTemperatureSensitive = partTypeIDObj.isTemperatureSensitive;
            }
            else {
              item.parttypeID = null;
              item.isFunctionalTemperatureSensitive = false;
            }

            const mountingTypeIDObj = _mountingTypeList.find((y) => y.name === item.mountingtypeID);
            if (mountingTypeIDObj) {
              item.mountingtypeID = mountingTypeIDObj.id;
            } else {
              item.mountingtypeID = null;
            }
            const partCategoryObj = _typeList.find((y) => y.Value === item.partcategoryID);
            if (partCategoryObj) {
              item.partcategoryID = partCategoryObj.id;
            } else {
              item.partcategoryID = null;
            }
            item.mismatchCustomPartStep = (item.mismatchCustomPartStep !== null && item.mismatchCustomPartStep !== undefined) ? item.mismatchCustomPartStep : true;
            item.mappingPartProgramStep = item.mappingPartProgramStep !== null ? item.mappingPartProgramStep : true;
            // To remove 0 entry and NULL entry
            item.refRFQLineItemID = item.refRFQLineItemID ? item.refRFQLineItemID : null;

            if (isSaveOriginal) {
              item.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.NONE;
            }
            if (!mergeCellsPlugin) {
              return;
            }
            const mergedCellInfo = mergeCellsPlugin.mergedCellsCollection.get(index);

            if (mergedCellInfo) {
              if (mergedCellInfo.row === index && (item.qpaDesignatorStepError || item.customerApprovalForBuyError || item.customerApprovalForPopulateError || item.customerApprovalForQPAREFDESError || item.dnpQPARefDesError || item.customerApprovalForDNPBuyError)) {
                item.description = getDescriptionForMainLine(item);
              } else {
                item.description = null;
              }
            } else {
              item.description = getDescriptionForMainLine(item);
            }

            if ((item.programingRequired || item.isCustPNProgrammingRequire) && (item.programingStatus === _programingStatusList[4].id || item.programingStatus === _programingStatusList[5].id)) {
              const approvedAltPart = _.find(vm.refBomModel, (objlineItem) => objlineItem._lineID === item._lineID && objlineItem.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING);
              if (approvedAltPart) {
                ProgramRequiredRefDesgArray = ProgramRequiredRefDesgArray.concat(getDesignatorFromLineItem(item.refDesig, vm.DisplayOddelyRefDes));
                if (item.isBuyDNPQty === CORE.BuyDNPQTYDropdown[3].id) {
                  ProgramRequiredRefDesgArray = ProgramRequiredRefDesgArray.concat(getDesignatorFromLineItem(item.dnpDesig, vm.DisplayOddelyRefDes));
                }
              }
            }

            if ((item.mountingID === -2 || item.functionalID === -2) && item.isInstall) {
              const approvedAltPart = _.find(vm.refBomModel, (objlineItem) => objlineItem._lineID === item._lineID && objlineItem.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING);
              if (approvedAltPart) {
                SoftwareRefDESArray = SoftwareRefDESArray.concat(getDesignatorFromLineItem(item.refDesig, vm.DisplayOddelyRefDes));
              }
            }
            item.descriptionAlternate = getDescriptionForLine(item, true);
          }
        });

        rowsArr.forEach((row) => {
          bomModel.splice(bomModel.indexOf(row), 1);
        });
        //if (bomModel.length) {
        //_partID
        const model = {
          partID: _partID,
          list: bomModel,
          isSaveOriginal: isSaveOriginal || false,
          isDraftVerified: vm.isBOMVerified || isDraftVerified || false,
          ProgramRequiredRefDesgArray: ProgramRequiredRefDesgArray,
          SoftwareRefDESArray: SoftwareRefDESArray
        };
        if (isFromBOMButton) {
          model.isDraftVerified = isDraftVerified || false;
        }
        return draftVerifyAll(model);
      });
      // Save Draft BOM (Save BOM Changes)
      function draftVerifyAll(model) {
        var isDraftVerified = model.isDraftVerified;
        model.bomDelete = bomDelete; // Alternate line Id List
        model.rowDeleted = rowDeleted; // Row line Id list
        if (model.isSaveOriginal) {
          model.list = _.filter(model.list, (item) => !item.id);
        }
        return vm.cgBusyLoading = ImportBOMFactory.draftRFQLineItems().save(model).$promise.then((response) => {
          if (response && response.data) {
            const data = response.data;
            switch (data.status) {
              // Invalid MFG or DIST entry
              case 'Part': {
                /* Array of: lineID, mfgCode, mfgPN */
                const invalidMFGList = data.data.invalidMFGList;

                const model = {
                  title: CORE.MESSAGE_CONSTANT.BOM_PART_INVALID,
                  textContent: CORE.MESSAGE_CONSTANT.BOM_PART_INVALID_TEXT,
                  multiple: true
                };
                DialogFactory.alertDialog(model, () => {
                  invalidMFGList.forEach((obj) => {
                    var bomObj = _.find(vm.refBomModel, (item) => item.mfgCode && obj.mfgCode && item.mfgCode.toLowerCase() === obj.mfgCode.toLowerCase() && item.mfgPN && obj.mfgPN && item.mfgPN.toLowerCase() === obj.mfgPN.toLowerCase());

                    if (!bomObj) {
                      return;
                    }
                    bomObj.mfgCodeStep = true;
                    if (!obj.mfgCodeID) {
                      bomObj.mfgCodeStep = false;
                      bomObj.mfgCodeStepError = generateDescription(bomObj, _mfgInvalidError);
                    }
                    bomObj.mfgPNStep = true;
                    if (!obj.mfgPNID) {
                      bomObj.mfgPNStep = false;
                      bomObj.mfgPNStepError = generateDescription(bomObj, _mfgPNInvalidError);
                    }

                    if (obj.mfgCodeID && obj.mfgPNID) {
                      bomObj.mfgVerificationStep = bomObj.mfgGoodPartMappingStep = bomObj.unknownPartStep = bomObj.defaultInvalidMFRStep = true;
                      if (!obj.isVerify) {
                        bomObj.mfgVerificationStep = false;
                        bomObj.mfgVerificationStepError = generateDescription(bomObj, _mfgVerificationError);
                      }
                      // null, false or true
                      else if (obj.isGoodPart && parseInt(obj.isGoodPart) === PartCorrectList.IncorrectPart) {
                        bomObj.mfgGoodPartMappingStep = false;
                        bomObj.mfgGoodPartMappingStepError = generateDescription(bomObj, _mfgGoodPartMappingError);
                      }
                      else if (obj.isGoodPart && parseInt(obj.isGoodPart) === PartCorrectList.UnknownPart) {
                        bomObj.unknownPartStep = false;
                        bomObj.unknownPartError = generateDescription(bomObj, _unknownPartError);
                      }
                      // Invalid MFR error generate
                      if (obj.mfgCodeID && parseInt(obj.mfgCodeID) === CORE.DefaultInvalidMFRID) {
                        bomObj.defaultInvalidMFRStep = false;
                        bomObj.defaultInvalidMFRError = generateDescription(bomObj, _defaultInvalidMFRError);
                      }
                    }

                    mfgVerificationStepFn(bomObj);
                  });
                  $timeout(() => {
                    setHeaderStyle();
                    _hotRegisterer.render();
                    $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion);
                  });
                  //if (!vm.isFromComponent)
                  //    $scope.$parent.active();
                });
                break;
              }
              case 'NumOfPosition': {
                const invalidMFGForNumOfPosList = data.data;
                const model = {
                  title: RFQTRANSACTION.BOM.NUM_OF_POS_REQUIRED,
                  textContent: stringFormat(RFQTRANSACTION.BOM.NUM_OF_POS_REQUIRED_TEXT, invalidMFGForNumOfPosList.join(', ')),
                  multiple: true
                };
                DialogFactory.alertDialog(model, () => {
                  $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion);
                  //if (!vm.isFromComponent)
                  //    $scope.$parent.active();
                });
                break;
              }
              case 'lineID': {
                const invalidLineItemsList = data.data;
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.LINE_ITEMS_EXISTS);
                messageContent.message = stringFormat(messageContent.message, invalidLineItemsList.join(', ').replace('null', '--'));
                const alertModel = {
                  messageContent: messageContent
                };
                DialogFactory.messageAlertDialog(alertModel, () => {
                  if (!vm.isFromComponent) {
                    $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion);
                    BOMFactory.bomSelectedFilter = vm.selectedFilter;
                    $scope.$parent.active();
                  } else {
                    return getRFQLineItemsByID().then((response) => {
                      if (response) {
                        displayRFQLineItemsByID(response);
                        $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion);
                      }
                    });
                  }
                });
                break;
              }
              case 'cust_lineID': {
                const invalidLineItemsList = data.data;
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.CUST_BOM_LINE_EXISTS);
                messageContent.message = stringFormat(messageContent.message, invalidLineItemsList.join(', ').replace('null', '--'));
                const alertModel = {
                  messageContent: messageContent
                };
                DialogFactory.messageAlertDialog(alertModel, () => {
                  if (!vm.isFromComponent) {
                    $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion);
                    BOMFactory.bomSelectedFilter = vm.selectedFilter;
                    $scope.$parent.active();
                  } else {
                    return getRFQLineItemsByID().then((response) => {
                      if (response) {
                        displayRFQLineItemsByID(response);
                        $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion);
                      }
                    });
                  }
                });
                break;
              }
              case 'UPDATE': {
                $scope.$emit('isBOMVerified', false);
                $scope.$emit('isReadyForPricing', false);
                vm.isBOMVerified = false;

                vm.isNoDataFound = true;
                vm.isBOMChanged = BOMFactory.isBOMChanged = false;
                BaseService.currentPageFlagForm = [];
                BOMFactory.bomSelectedFilter = vm.selectedFilter;
                $scope.$parent.active();
                $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion);
                break;
              }
              // Success
              default: {
                // send data to parent bom.controller to enable the verify BOM tab
                // After save BOM null array of delete part and lines
                bomDelete = [];
                rowDeleted = [];
                if (isDraftVerified) {
                  // send data to parent bom.controller to enable the verify BOM tab
                  $scope.$emit('isBOMVerified', true);
                  vm.isBOMChanged = BOMFactory.isBOMChanged = false;
                  BaseService.currentPageFlagForm = [];
                  if (!vm.isSubAssembly) {
                    $state.go(RFQTRANSACTION.RFQ_PLANNED_BOM_STATE, { id: _rfqAssyID }, { reload: true });
                  }
                }
                else {
                  vm.isNoDataFound = true;
                  vm.isBOMChanged = BOMFactory.isBOMChanged = false;
                  BaseService.currentPageFlagForm = [];
                  $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion);
                  BOMFactory.bomSelectedFilter = vm.selectedFilter;
                  $scope.$parent.active();
                }
                break;
              }
            }
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      }

      /* Item step verify in case of null data */
      function itemStepVerification(item) {
        if (!item.dnpQPARefDesStep && item.dnpQPARefDesStep !== false && item.dnpQPARefDesStep !== 0) {
          item.dnpQPARefDesStep = true;
        }
        if (!item.mfgVerificationStep && item.mfgVerificationStep !== false && item.mfgVerificationStep !== 0) {
          item.mfgVerificationStep = true;
        }
        if (!item.mfgDistMappingStep && item.mfgDistMappingStep !== false && item.mfgDistMappingStep !== 0) {
          item.mfgDistMappingStep = true;
        }
        if (!item.mfgCodeStep && item.mfgCodeStep !== false && item.mfgCodeStep !== 0) {
          item.mfgCodeStep = true;
        }
        if (!item.distVerificationStep && item.distVerificationStep !== false && item.distVerificationStep !== 0) {
          item.distVerificationStep = true;
        }
        if (!item.distCodeStep && item.distCodeStep !== false && item.distCodeStep !== 0) {
          item.distCodeStep = true;
        }
        if (!item.getMFGPNStep && item.getMFGPNStep !== false && item.getMFGPNStep !== 0) {
          item.getMFGPNStep = true;
        }
        if (!item.obsoletePartStep && item.obsoletePartStep !== false && item.obsoletePartStep !== 0) {
          item.obsoletePartStep = true;
        }
        if (!item.mfgGoodPartMappingStep && item.mfgGoodPartMappingStep !== false && item.mfgGoodPartMappingStep !== 0) {
          item.mfgGoodPartMappingStep = true;
        }
        if (!item.mfgPNStep && item.mfgPNStep !== false && item.mfgPNStep !== 0) {
          item.mfgPNStep = true;
        }
        if (!item.distPNStep && item.distPNStep !== false && item.distPNStep !== 0) {
          item.distPNStep = true;
        }
        if (!item.distGoodPartMappingStep && item.distGoodPartMappingStep !== false && item.distGoodPartMappingStep !== 0) {
          item.distGoodPartMappingStep = true;
        }
        if (!item.suggestedGoodDistPartStep && item.suggestedGoodDistPartStep !== false && item.suggestedGoodDistPartStep !== 0) {
          item.suggestedGoodDistPartStep = true;
        }
        if (!item.nonRohsStep && item.nonRohsStep !== false && item.nonRohsStep !== 0) {
          item.nonRohsStep = true;
        }
        if (!item.epoxyStep && item.epoxyStep !== false && item.epoxyStep !== 0) {
          item.epoxyStep = true;
        }
        if (!item.invalidConnectorTypeStep && item.invalidConnectorTypeStep !== false && item.invalidConnectorTypeStep !== 0) {
          item.invalidConnectorTypeStep = true;
        }
        if (!item.unknownPartStep && item.unknownPartStep !== false && item.unknownPartStep !== 0) {
          item.unknownPartStep = true;
        }
        if (!item.defaultInvalidMFRStep && item.defaultInvalidMFRStep !== false && item.defaultInvalidMFRStep !== 0) {
          item.defaultInvalidMFRStep = true;
        }
      }
      // Add new BOM to open select BOM file
      vm.addBOM = () => {
        if (vm.isBOMReadOnly) {
          return false;
        }
        if (BOMFactory.isBOMChanged) {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.WITHOUT_SAVING_ALERT_BODY_MESSAGE_APPEND_BOM);
          const model = {
            messageContent: messgaeContent
          };
          DialogFactory.messageAlertDialog(model);
        } else {
          angular.element('#fi-excel').trigger('click');
        }
      };
      // Add new BOM manually
      vm.addBOMManually = () => {
        if (vm.isBOMReadOnly) { return false; }
        // Clear all flags
        const unit = _.find(_unitList, (y) => {
          if (y.unitName && y.unitName.toUpperCase() === CORE.UOM_DEFAULTS.EACH.NAME.toUpperCase() || y.alias && y.alias.length > 0 && y.alias.find((x) => x.alias.toUpperCase() === CORE.UOM_DEFAULTS.EACH.NAME.toUpperCase())) {
            return y;
          }
        });
        vm.isNoDataFound = false;
        vm.bomModel = [{
          item: '',
          uomID: unit ? unit.unitName : CORE.UOM_DEFAULTS.EACH.NAME,
          programingStatus: _programingStatusList[0].value,
          isPurchase: true,
          isInstall: true,
          substitutesAllow: _substitutesAllowList[0].value,
          isBuyDNPQty: _buyDNPQTYList[0].value,
          customerApproval: RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING
        }];
        _invalidCells = [];
        vm.isAutoDraftSave = false;
        vm.refreshBOMMaster();
        vm.isBOMChanged = BOMFactory.isBOMChanged = true;
        BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];
        displayRFQLineItemsByID(vm.bomModel);
      };

      // Download BOM Template
      vm.downloadDocument = () => {
        vm.cgBusyLoading = ImportBOMFactory.downloadBOMTemplate().then((response) => {
          if (response.status === CORE.API_RESPONSE_CODE.PAGE_NOT_FOUND) {
            DialogFactory.alertDialog({ title: CORE.MESSAGE_CONSTANT.ALERT_HEADER, textContent: CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.NotFound, multiple: true });
          } else if (response.status === CORE.API_RESPONSE_CODE.ACCESS_DENIED) {
            DialogFactory.alertDialog({ title: CORE.MESSAGE_CONSTANT.ALERT_HEADER, textContent: CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.AccessDenied, multiple: true });
          } else if (response.status === CORE.API_RESPONSE_CODE.UNAUTHORIZED) {
            DialogFactory.alertDialog({ title: CORE.MESSAGE_CONSTANT.ALERT_HEADER, textContent: CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.Unauthorized, multiple: true });
          }
          else {
            const blob = new Blob([response.data], { type: 'text/csv' });
            if (navigator.msSaveOrOpenBlob) {
              navigator.msSaveOrOpenBlob(blob, 'SampleBOMTemplate.xlsx');
            } else {
              const link = document.createElement('a');
              if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', 'SampleBOMTemplate.xlsx');
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

      // [S] Validation steps
      vm.qpaRefDesValidation = () => {
        Object.keys(vm.refBomModel).some((index) => {
          const item = vm.refBomModel[index];
          let itemDNPDesigArr = [];
          const itemDesigArr = getDesignatorFromLineItem(item.refDesig, vm.DisplayOddelyRefDes);
          if (item.dnpDesig) {
            itemDNPDesigArr = getDesignatorFromLineItem(item.dnpDesig, vm.DisplayOddelyRefDes);
          }
          item.qpaDesignatorStepError = null;
          item.qpaDesignatorStep = vm.QPAREFDESValidationStepsFlag.Verifyed;
          item.dnpQPARefDesStep = vm.QPAREFDESValidationStepsFlag.Verifyed;
          item.dnpQPARefDesError = null;
          item.refDesigCount = itemDesigArr ? itemDesigArr.length : 0;
          item.dnpDesigCount = itemDNPDesigArr ? itemDNPDesigArr.length : 0;
          if (item.refDesigCount > maxREFDESAllow || item.dnpDesigCount > maxREFDESAllow) {
            vm.isValidQPAREFDESValidation = false;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.LONG_REF_DES_IN_BOM);
            messageContent.message = stringFormat(messageContent.message, item.lineID, (item.refDesigCount > maxREFDESAllow ? item.refDesigCount : item.dnpDesigCount), maxREFDESAllow);
            DialogFactory.messageAlertDialog({ messageContent: messageContent });
            return true;
          }
          const unit = _.find(_unitList, (y) => {
            if (y.unitName && y.unitName.toUpperCase() === CORE.UOM_DEFAULTS.EACH.NAME.toUpperCase() || y.alias && y.alias.length > 0 && y.alias.find((x) => x.alias.toUpperCase() === CORE.UOM_DEFAULTS.EACH.NAME.toUpperCase())) {
              return y;
            }
          });
          if (item.uomID === unit.unitName) {
            // Check for QPA Vs RefDes Mismatch validation check
            if (item.qpa || item.refDesig || item.dnpQty || item.dnpDesig) {
              if (itemDesigArr.length !== (item.qpa ? item.qpa : 0)) {
                item.qpaDesignatorStep = vm.QPAREFDESValidationStepsFlag.MisMatch;
                if (item.qpaDesignatorStepError) {
                  item.qpaDesignatorStepError += ('\n' + generateDescription(item, _qpaDesignatorError));
                } else {
                  item.qpaDesignatorStepError = generateDescription(item, _qpaDesignatorError);
                }
              }

              if (itemDNPDesigArr.length !== (item.dnpQty ? item.dnpQty : 0)) {
                item.dnpQPARefDesStep = vm.QPAREFDESValidationStepsFlag.MisMatch;
                item.dnpQPARefDesError = generateDescription(item, _dnpQPARefDesError);
              }
            }
            else {
              item.qpaDesignatorStep = vm.QPAREFDESValidationStepsFlag.Require;
              item.qpaDesignatorStepError = null;
              item.dnpQPARefDesStep = vm.QPAREFDESValidationStepsFlag.Require;
              item.dnpQPARefDesError = null;
            }
          }
          else {
            item.qpaDesignatorStep = vm.QPAREFDESValidationStepsFlag.Verifyed;
            item.qpaDesignatorStepError = null;
            item.dnpQPARefDesStep = vm.QPAREFDESValidationStepsFlag.Verifyed;
            item.dnpQPARefDesError = null;
          }

          itemDNPDesigArr = _.uniq(itemDNPDesigArr);
          let combineItemDesigArr = _.concat(itemDesigArr, itemDNPDesigArr);
          const duplicateDesignator = _.filter(combineItemDesigArr, (val, i, iteratee) => _.includes(iteratee, val, i + 1));
          combineItemDesigArr = _.uniq(combineItemDesigArr);

          _.each(combineItemDesigArr, (itemDesig) => {
            const lineCount = [];
            _.each(vm.refBomModel, (obj) => {
              if (!_.isEqual(obj, item) && obj.lineID !== item.lineID) {
                let ObjDesigArr = _.uniq(getDesignatorFromLineItem(obj.refDesig, vm.DisplayOddelyRefDes));
                if (obj.dnpDesig) {
                  const ObjDNPDesigArr = getDesignatorFromLineItem(obj.dnpDesig, vm.DisplayOddelyRefDes);
                  ObjDesigArr = _.concat(ObjDesigArr, ObjDNPDesigArr);
                }
                if (combineItemDesigArr.length > 0 && _.includes(ObjDesigArr, itemDesig) && obj.lineID) {
                  lineCount.push(obj.lineID);
                }
              }
            });

            if (duplicateDesignator.length > 0) {
              lineCount.push(item.lineID);
            }
            if (lineCount.length > 0) {
              if (_.includes(itemDesigArr, itemDesig)) {
                const lineCountLength = (lineCount.length - 1);
                if (lineCount.length > 0) {
                  let lineString = '';
                  _.each(lineCount, (line, index) => {
                    if (lineString !== '' && (lineCountLength === index)) {
                      lineString += (' And ' + line);
                    }
                    else if (lineString !== '') {
                      lineString += (', ' + line);
                    }
                    else {
                      lineString = ('Item#' + line);
                    }
                  });
                  item.qpaDesignatorStep = vm.QPAREFDESValidationStepsFlag.Duplicate;
                  item.duplicateLineID = lineString;
                  item.duplicateRefDesig = itemDesig;
                  if (item.qpaDesignatorStepError) {
                    item.qpaDesignatorStepError += ('\n' + generateDescription(item, _duplicateRefDesError));
                  }
                  else {
                    item.qpaDesignatorStepError = generateDescription(item, _duplicateRefDesError);
                  }
                }
              }
              if (item.dnpDesig) {
                const ObjDNPDesigArr = _.uniq(getDesignatorFromLineItem(item.dnpDesig, vm.DisplayOddelyRefDes));
                if (ObjDNPDesigArr.length > 0 && _.includes(ObjDNPDesigArr, itemDesig) && item.lineID) {
                  const dnplineCountLength = (lineCount.length - 1);
                  if (lineCount.length > 0) {
                    let lineString = '';
                    _.each(lineCount, (line, index) => {
                      if (lineString !== '' && (dnplineCountLength === index)) {
                        lineString += (' And ' + line);
                      }
                      else if (lineString !== '') {
                        lineString += (', ' + line);
                      }
                      else {
                        lineString = ('Item#' + line);
                      }
                    });

                    item.dnpQPARefDesStep = vm.QPAREFDESValidationStepsFlag.Duplicate;
                    item.duplicateLineID = lineString;
                    item.duplicateRefDesig = itemDesig;
                    if (item.dnpQPARefDesError) {
                      item.dnpQPARefDesError += ('\n' + generateDescription(item, _duplicateRefDesError));
                    }
                    else {
                      item.dnpQPARefDesError = generateDescription(item, _duplicateRefDesError);
                    }
                  }
                }
              }
            }
          });


          // Check DNP designator is valid for special character '?'
          let invalidDesignator = null;
          const DifferencedesArry = _.difference(itemDesigArr, vm.DisplayOddelyRefDes);
          _.each(DifferencedesArry, (item) => {
            if (item.includes('?')) {
              invalidDesignator = item;
            }
          });
          if (invalidDesignator) {
            item.invalidRefDesig = invalidDesignator;
            item.qpaDesignatorStep = vm.QPAREFDESValidationStepsFlag.Invalid;
            if (item.qpaDesignatorStepError) {
              item.qpaDesignatorStepError += ('\n' + generateDescription(item, _invalidRefDesError));
            }
            else {
              item.qpaDesignatorStepError = generateDescription(item, _invalidRefDesError);
            }
          }

          // Check designator is valid for special character '?'
          let invalidDNPDesignator = null;
          const DifferenceDNPdesArry = _.difference(itemDNPDesigArr, vm.DisplayOddelyRefDes);
          _.each(DifferenceDNPdesArry, (item) => {
            if (item.includes('?')) {
              invalidDNPDesignator = item;
            }
          });
          if (invalidDNPDesignator) {
            item.invalidDNPREFDES = invalidDNPDesignator;
            item.dnpQPARefDesStep = vm.QPAREFDESValidationStepsFlag.Invalid;;
            item.dnpQPARefDesError = generateDescription(item, _dnpInvalidREFDESError);
          }

          qpaDesignatorStepFn(item, index);
          dnpqpaDesignatorStepFn(item, index);
        });
        setHeaderStyle();
      };

      const qpaDesignatorDetails = () => new Promise((resolve) => {
        if (!vm.isFromQPA) {
          if (checkDuplicateCPN() || checkInvalidLineItem() || checkInvalidLineUOM() || checkDuplicateItemNumber() || checkDuplicateCustBOMLine() || checkSamePartsInDiffLine()) {
            vm.isFromQPA = false;
            resolve();
            return;
          }
        }
        vm.isFromQPA = false;
        vm.isValidQPAREFDESValidation = true;
        vm.qpaRefDesValidation();

        if (vm.isAutoDraftSave && !vm.isBOMVerified) {
          vm.draftSave();
          resolve();
        }
        else {
          if (_hotRegisterer) {
            _hotRegisterer.validateCells();
          }
          if (vm.isValidQPAREFDESValidation) {
            NotificationFactory.success(CORE.MESSAGE_CONSTANT.QPA_VS_REFDES_VALIDATION_SUCCESS_MESSAGE);
          }
          resolve();
        }
      });

      vm.qpaDesignator = function () {
        if (vm.bomModel.length === 0 || (vm.selectedFilter == vm.allFilterID && vm.bomModel.length === 1 && !vm.globalSearchText) || vm.isBOMReadOnly) {
          return false;
        }
        // Dharam [12/29/20] Added timeout as in this step there is not any API call and to visible loader set timeout. Need to check alternat solution
        $scope.loaderVisible = true; 
        $timeout(() => {
          vm.cgBusyLoading = getOddelyRefDesList().then(() => {
            vm.cgBusyLoading = qpaDesignatorDetails().then(() => {
              $scope.loaderVisible = false;
            }).catch((error) => {
              BaseService.getErrorLog(error);
              $scope.loaderVisible = false;
            });
          }).catch((error) => {
            BaseService.getErrorLog(error);
            $scope.loaderVisible = false;
          });
        });
      };

      // Internal Component verification step
      vm.componentVerification = () => {
        if ((vm.selectedFilter == vm.allFilterID && vm.bomModel.length === 1 && !vm.globalSearchText) || vm.isQPADesigStepPending() == true || vm.isBOMReadOnly) {
          return false;
        }
        const cpnList = [];
        vm.verificationCPNParts = [];
        _.each(vm.refBomModel, (item) => {
          if (item.custPN) {
            const cpn = item.custPN + ' Rev' + (item.customerRev !== null ? (item.customerRev !== '' ? item.customerRev : '-') : '-');
            cpnList.push(cpn.replace(/"/g, '\\"').replace(/'/g, '\\\''));
          }
        });
        if (cpnList.length > 0) {
          const cpnModel = {
            pPartID: _partID,
            pCPN: cpnList
          };
          vm.cgBusyLoading = ImportBOMFactory.GetCustPNListFromPN().save(cpnModel).$promise.then((response) => {
            if (response && response.data) {
              vm.verificationCPNParts = response.data;
              componentVerificationDetails();
            }
          }).catch((error) => {
            BaseService.getErrorLog(error);
          });
        }
        else {
          componentVerificationDetails();
        }
      };
      // Get component details from database and validate part related validation
      const componentVerificationDetails = () => {
        // Check Same part line merged as per discussion with DP on 12-11-2018
        if (checkDuplicateCPN() || checkInvalidLineItem() || checkInvalidLineUOM() || checkSamePartsInDiffLine() || checkDuplicateSubAssembly() || checkDuplicateItemNumber() || checkDuplicateCustBOMLine()) {
          return true;
        }

        const model = [];
        vm.refBomModel.forEach((item) => {
          if (item.mfgCode || item.mfgPN || item.distributor || item.distPN) {
            model.push({
              mfgCode: item.mfgCode,
              mfgPN: item.mfgPN,
              distributor: item.distributor,
              distPN: item.distPN
            });
          }
          if (item.custPN) {
            model.push({
              mfgCode: vm.mfg,
              mfgPN: stringFormat(CORE.CUSTPN_FORMAT, item.custPN, (item.customerRev !== null ? (item.customerRev !== '' ? item.customerRev : '-') : '-'))
            });
          }
        });

        if (!model.length) {
          return;
        }
        return vm.cgBusyLoading = ImportBOMFactory.componentVerification().save({ model: model, partID: _partID }).$promise.then((response) => {
          if (response && response.data) {
            $scope.loaderVisible = true;
            vm.isRevifyInternalVerification = false;
            const mfgCodeList = response.data.mfgCodeList;
            const mfgPNList = response.data.mfgPNList;
            const distributorList = response.data.distributorList;
            const distPNList = response.data.distPNList;
            const allPNList = response.data.allPNList;
            const getDistPNList = response.data.getDistPNList;
            getPartProgramMappingDetail = response.data.partProgramMappingDetail;
            isMergeCell = false;
            // Get MFG/DISTY
            const data = _.filter(vm.refBomModel); //This is used for only loop for existing data only not new added lines.

            data.forEach((bomObj, index) => {
              if (vm.refBomModel.length === (index + (isFilterApply ? 0 : 1))) { // return for empty row
                return;
              }

              bomObj.mfgPNID = bomObj.mfgCodeID = bomObj.distMfgPNID = bomObj.distMfgCodeID = bomObj.rohsComplient = null;
              bomObj = itemErrorStepAndMessageRemove(bomObj);

              // Epoxy flag reset
              delete bomObj.feature;
              delete bomObj.processMaterialgroupID;
              bomObj.epoxyStep = true;
              bomObj.epoxyStepError = null;
              bomObj.isObsoleteLine = false;
              bomObj.isObsolete = false;

              // [S] MFG Verification
              let mfgCodeObj = null;
              let mfgPNObj = null;

              if (bomObj.mfgCode) {
                mfgCodeObj = _.find(mfgCodeList, (item) => ((item.name && item.name.toUpperCase() === bomObj.mfgCode.toUpperCase()) || (item.mfgName && item.mfgName.toUpperCase() === bomObj.mfgCode.toUpperCase())));

                if (mfgCodeObj) {
                  bomObj.mfgCodeID = mfgCodeObj.id;
                  if (mfgCodeObj.mfgName) {
                    bomObj.mfgCode = mfgCodeObj.mfgName;
                    if (!bomObj.acquisitionDetail && mfgCodeObj.acquisitionDetail) {
                      bomObj.acquisitionDetail = mfgCodeObj.acquisitionDetail;
                      if (bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                        bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                      }
                    }
                  }
                  else if (mfgCodeObj.mfgCodemst) {
                    bomObj.mfgCode = mfgCodeObj.mfgCodemst.mfgName;
                    if (!bomObj.acquisitionDetail && mfgCodeObj.mfgCodemst.acquisitionDetail) {
                      bomObj.acquisitionDetail = mfgCodeObj.mfgCodemst.acquisitionDetail;
                      if (bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                        bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                      }
                    }
                  }
                  bomObj.mfgCodeStep = true;
                  bomObj.mfgCodeStepError = null;
                  // Invalid MFR issue generate
                  if (bomObj.mfgCodeID === CORE.DefaultInvalidMFRID) {
                    bomObj.defaultInvalidMFRStep = false;
                    bomObj.defaultInvalidMFRError = generateDescription(bomObj, _defaultInvalidMFRError);
                  }

                  // MFR Mapping alternate part Add
                  if (mfgCodeObj.invalidMfgMapping && mfgCodeObj.invalidMfgMapping.length > 0) {
                    vm.isRevifyInternalVerification = true;
                    addalternateMFR(bomObj, mfgCodeObj.invalidMfgMapping);
                  }
                }
                else {
                  bomObj.mfgCodeStep = false;
                  bomObj.mfgCodeStepError = generateDescription(bomObj, _mfgInvalidError);
                }
              }
              if (bomObj.mfgPN) {
                const mfgPNArr = _.filter(mfgPNList, (item) => item.name && item.name.toUpperCase() === bomObj.mfgPN.toUpperCase());

                if (!mfgCodeObj) {
                  // In case of multiple part we not have to get first MFR user case add from part investigating in part master and then add
                  if (mfgPNArr.length === 1) {
                    mfgPNObj = mfgPNArr[0];
                  }
                }
                else {
                  mfgPNObj = _.find(mfgPNArr, (item) => item.mfgCodemst && item.mfgCodemst.mfgName === bomObj.mfgCode);

                  if (!mfgPNObj) {
                    mfgPNObj = _.find(mfgPNArr, (item) => item.mfgcodeID === mfgCodeObj.id);
                  }

                  // Check for component exist
                  if (!mfgPNObj) {
                    // here we can take first element of filter data (In case of not exist MFR code then take first object of MFR PN which is map with MFR PN Name)
                    mfgPNObj = _.find(mfgPNArr, (item) => item.name && item.name.toUpperCase() === bomObj.mfgPN.toUpperCase());
                  }
                }
                if (mfgPNObj) {
                  bomObj.mfgPNStep = true;
                  bomObj.mfgPNStepError = null;
                  bomObj.partMFGCode = mfgPNObj.mfgCodemst.mfgName;

                  if (!bomObj.mfgCode) {
                    bomObj.mfgCode = mfgPNObj.mfgCodemst.mfgName;
                    if (!bomObj.acquisitionDetail && mfgPNObj.mfgCodemst.acquisitionDetail) {
                      bomObj.acquisitionDetail = mfgPNObj.mfgCodemst.acquisitionDetail;
                      if (bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                        bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                      }
                    }
                    bomObj.mfgCodeID = mfgPNObj.mfgcodeID;
                    bomObj.mfgPNID = mfgPNObj.id;
                    bomObj.mfgCodeStep = bomObj.mfgVerificationStep = true;
                    bomObj.mfgCodeStepError = bomObj.mfgVerificationStepError = null;

                    UpdatePartDetails(bomObj, mfgPNObj);

                    checkAndValidateMFGPNwithBOMLine(bomObj, mfgPNObj);
                  }
                }
                else {
                  bomObj.mfgPNStep = false;
                  bomObj.mfgPNStepError = generateDescription(bomObj, _mfgPNInvalidError);
                  if (bomObj.mfgGoodPartMappingStep) {
                    bomObj.isMFGGoodPart = null;
                    bomObj.RoHSStatusID = null;
                    bomObj.mfgGoodPartMappingStep = false;
                    bomObj.mfgGoodPartMappingStepError = null;
                  }
                }
              }
              if (mfgCodeObj && mfgPNObj) {
                bomObj.mfgCodeID = mfgCodeObj.id;
                if (mfgCodeObj.mfgName) {
                  bomObj.mfgCode = mfgCodeObj.mfgName;
                  if (!bomObj.acquisitionDetail && mfgCodeObj.acquisitionDetail) {
                    bomObj.acquisitionDetail = mfgCodeObj.acquisitionDetail;
                    if (bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                      bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                    }
                  }
                }
                else if (mfgCodeObj.mfgCodemst) {
                  bomObj.mfgCode = mfgCodeObj.mfgCodemst.mfgName;
                  if (!bomObj.acquisitionDetail && mfgCodeObj.mfgCodemst.acquisitionDetail) {
                    bomObj.acquisitionDetail = mfgCodeObj.mfgCodemst.acquisitionDetail;
                    if (bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                      bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                    }
                  }
                }
                bomObj.mfgPNID = mfgPNObj.mfgcodeID === bomObj.mfgCodeID ? mfgPNObj.id : null;
                //// Invalid MFR issue generate
                //if (bomObj.mfgCodeID === CORE.DefaultInvalidMFRID) {
                //  bomObj.defaultInvalidMFRStep = false;
                //  bomObj.defaultInvalidMFRError = generateDescription(bomObj, _defaultInvalidMFRError);
                //}

                if (!bomObj.mfgPNID) {
                  bomObj.mfgPNStep = false;
                  bomObj.mfgPNStepError = generateDescription(bomObj, _mfgPNInvalidError);
                  bomObj.mfgVerificationStep = false;
                  bomObj.mfgVerificationStepError = generateDescription(bomObj, _mfgVerificationError);
                }
                else {
                  bomObj.mfgCodeStep = bomObj.mfgPNStep = bomObj.mfgVerificationStep = true;
                  bomObj.mfgCodeStepError = bomObj.mfgPNStepError = bomObj.mfgVerificationStepError = null;
                  UpdatePartDetails(bomObj, mfgPNObj);
                  checkAndValidateMFGPNwithBOMLine(bomObj, mfgPNObj);
                }
              }
              else if (!mfgCodeObj && mfgPNObj && (bomObj.mfgPNID === null || bomObj.mfgPNID === undefined)) {
                bomObj.partMFGCode = mfgPNObj.mfgCodemst.mfgName;
                bomObj.mfgVerificationStep = false;
                bomObj.mfgVerificationStepError = generateDescription(bomObj, _mfgVerificationError);
              }
              // [E] MFG Verification
              // [S] Dist Verification
              let distributorObj = null;
              let distPNObj = null;
              bomObj.distCodeStep = bomObj.distVerificationStep = bomObj.distPNStep = bomObj.distGoodPartMappingStep = true;
              bomObj.isDistGoodPart = PartCorrectList.CorrectPart;
              bomObj.distCodeStepError = bomObj.distGoodPartMappingStepError = bomObj.distVerificationStepError = null;
              if (bomObj.distributor) {
                distributorObj = _.find(distributorList, (item) => ((item.name && item.name.toUpperCase() === bomObj.distributor.toUpperCase()) || (item.mfgName && item.mfgName.toUpperCase() === bomObj.distributor.toUpperCase())));
                if (distributorObj) {
                  bomObj.distMfgCodeID = distributorObj.id;
                  if (distributorObj.mfgName) {
                    bomObj.distributor = distributorObj.mfgName;
                    if (!bomObj.distAcquisitionDetail && distributorObj.acquisitionDetail) {
                      bomObj.distAcquisitionDetail = distributorObj.acquisitionDetail;
                      if (bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                        bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                      }
                    }
                  }
                  else if (distributorObj.mfgCodemst) {
                    bomObj.distributor = distributorObj.mfgCodemst.mfgName;
                    if (!bomObj.distAcquisitionDetail && distributorObj.mfgCodemst.acquisitionDetail) {
                      bomObj.distAcquisitionDetail = distributorObj.mfgCodemst.acquisitionDetail;
                      if (bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                        bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                      }
                    }
                  }
                  bomObj.distCodeStep = true;
                  bomObj.distCodeStepError = null;
                }
                else {
                  bomObj.distCodeStep = false;
                  bomObj.distCodeStepError = generateDescription(bomObj, _distInvalidError);
                }
              }

              if (bomObj.distPN) {
                const distPNArr = _.filter(distPNList, (item) => item.name.toUpperCase() === bomObj.distPN.toUpperCase());

                if (!distributorObj) {
                  if (distPNArr.length === 1) {
                    distPNObj = distPNArr[0];
                  }
                }
                else {
                  if (!distPNObj && distributorObj) {
                    distPNObj = _.find(distPNArr, (item) => item.mfgcodeID === distributorObj.id);
                  }
                  // Check for supplier exist
                  if (!distPNObj) {
                    distPNObj = _.find(distPNArr, (item) => item.name && item.name.toUpperCase() === bomObj.distPN.toUpperCase());
                  }
                }

                if (distPNObj) {
                  bomObj.distPNStep = true;
                  bomObj.distPNStepError = null;

                  bomObj.partDistributor = distPNObj.mfgCodemst.mfgName;
                  if (!bomObj.distributor) {
                    bomObj.distributor = distPNObj.mfgCodemst.mfgName;
                    if (!bomObj.distAcquisitionDetail && distPNObj.mfgCodemst.acquisitionDetail) {
                      bomObj.distAcquisitionDetail = distPNObj.mfgCodemst.acquisitionDetail;
                      if (bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                        bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                      }
                    }
                    bomObj.distMfgCodeID = distPNObj.mfgcodeID;
                    bomObj.distMfgPNID = distPNObj.mfgcodeID === bomObj.distMfgCodeID ? distPNObj.id : null;
                    bomObj.distCodeStep = bomObj.distVerificationStep = true;
                    bomObj.distCodeStepError = bomObj.distVerificationStepError = null;

                    if (distPNObj.isGoodPart !== PartCorrectList.IncorrectPart) {
                      bomObj.isDistGoodPart = distPNObj.isGoodPart;
                      bomObj.distGoodPartMappingStep = true;
                      bomObj.distGoodPartMappingStepError = null;
                      if (bomObj.isMFGGoodPart !== PartCorrectList.IncorrectPart && bomObj.isDistGoodPart !== PartCorrectList.IncorrectPart) {
                        bomObj.badMfgPN = '';
                      }
                    }
                    else {
                      bomObj.isDistGoodPart = PartCorrectList.IncorrectPart;
                      if (distPNObj.replacementPartID !== null && distPNObj.replacementComponent && distPNObj.replacementComponent.mfgCodemst) {
                        bomObj.badMfgPN = bomObj.suggestedCorrectPart = bomObj.badMfgPN ? bomObj.badMfgPN + '\n' + distPNObj.replacementComponent.mfgCodemst.mfgName + '\n' + distPNObj.replacementComponent.mfgPN : distPNObj.replacementComponent.mfgCodemst.mfgName + '\n' + distPNObj.replacementComponent.mfgPN;
                      } else {
                        bomObj.badMfgPN = bomObj.suggestedCorrectPart = '';
                      }
                      if (bomObj.distGoodPartMappingStep) {
                        bomObj.distGoodPartMappingStep = false;
                        bomObj.distGoodPartMappingStepError = generateDescription(bomObj, _distGoodPartMappingError);
                      }
                    }

                    bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                    bomObj.customerApprovalStepError = generateDescription(bomObj, _customerApprovalError);
                  }
                }
                else {
                  bomObj.distPNStep = false;
                  bomObj.distPNStepError = generateDescription(bomObj, _distPNInvalidError);
                }
              }
              if (distributorObj && distPNObj) {
                bomObj.distMfgCodeID = distributorObj.id;
                if (distributorObj.mfgName) {
                  bomObj.distributor = distributorObj.mfgName;
                  if (!bomObj.distAcquisitionDetail && distributorObj.acquisitionDetail) {
                    bomObj.distAcquisitionDetail = distributorObj.acquisitionDetail;
                    if (bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                      bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                    }
                  }
                }
                else if (distributorObj.mfgCodemst) {
                  bomObj.distributor = distributorObj.mfgCodemst.mfgName;
                  if (!bomObj.distAcquisitionDetail && distributorObj.mfgCodemst.acquisitionDetail) {
                    bomObj.distAcquisitionDetail = distributorObj.mfgCodemst.acquisitionDetail;
                    if (bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                      bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                    }
                  }
                }
                bomObj.distMfgPNID = distPNObj.mfgcodeID === bomObj.distMfgCodeID ? distPNObj.id : null;

                if (bomObj.distMfgPNID === null || bomObj.distMfgPNID === undefined) {
                  bomObj.distPNStep = false;
                  bomObj.distPNStepError = generateDescription(bomObj, _distPNInvalidError);
                  bomObj.distVerificationStep = false;
                  bomObj.distVerificationStepError = generateDescription(bomObj, _distVerificationError);
                }
                else {
                  bomObj.distCodeStep = bomObj.distPNStep = bomObj.distVerificationStep = true;
                  bomObj.distCodeStepError = bomObj.distPNStepError = bomObj.distVerificationStepError = null;

                  if (distPNObj.isGoodPart !== PartCorrectList.IncorrectPart) {
                    bomObj.isDistGoodPart = distPNObj.isGoodPart;
                    bomObj.distGoodPartMappingStep = true;
                    bomObj.distGoodPartMappingStepError = null;
                    if (bomObj.isMFGGoodPart !== PartCorrectList.IncorrectPart && bomObj.isDistGoodPart !== PartCorrectList.IncorrectPart) {
                      bomObj.badMfgPN = '';
                    }
                  }
                  else {
                    bomObj.isDistGoodPart = PartCorrectList.IncorrectPart;
                    if (distPNObj.replacementPartID !== null && distPNObj.replacementComponent && distPNObj.replacementComponent.mfgCodemst) {
                      bomObj.badMfgPN = bomObj.suggestedCorrectPart = distPNObj.replacementComponent.mfgCodemst.mfgName + '\n' + distPNObj.replacementComponent.mfgPN;
                    } else {
                      bomObj.badMfgPN = bomObj.suggestedCorrectPart = '';
                    }
                    if (bomObj.distGoodPartMappingStep) {
                      bomObj.distGoodPartMappingStep = false;
                      bomObj.distGoodPartMappingStepError = generateDescription(bomObj, _distGoodPartMappingError);
                    }
                  }
                }
              } else if (!distributorObj && distPNObj && (bomObj.distMfgPNID === null || bomObj.distMfgPNID === undefined)) {
                bomObj.partDistributor = distPNObj.mfgCodemst.mfgName;
                bomObj.distVerificationStep = false;
                bomObj.distVerificationStepError = generateDescription(bomObj, _distVerificationError);
              }
              // [E] Dist Verification

              // [S] Customer PN
              bomObj.restrictCPNUseWithPermissionStep = true;
              bomObj.restrictCPNUseWithPermissionError = null;
              bomObj.restrictCPNUsePermanentlyStep = true;
              bomObj.restrictCPNUsePermanentlyError = null;
              if (bomObj.custPN) {
                const custPN = stringFormat(CORE.CUSTPN_FORMAT, bomObj.custPN, (bomObj.customerRev !== null && bomObj.customerRev !== undefined && bomObj.customerRev !== '') ? bomObj.customerRev : '-');
                const custPNArr = _.find(allPNList, (item) => item.name && item.mfgCodemst && item.mfgCodemst.mfgCode === vm.mfg && item.name.toUpperCase() === custPN.toUpperCase());

                if (custPNArr && bomObj.lineID) {
                  bomObj.custPNID = custPNArr.id;
                  if (bomObj.mfgPNID && bomObj.mfgPNID === CORE.NOTAVAILABLEMFRPNID) {
                    bomObj.mountingtypeID = custPNArr.rfqMountingType ? custPNArr.rfqMountingType.name : bomObj.mountingtypeID;
                    bomObj.parttypeID = custPNArr.rfqPartType ? custPNArr.rfqPartType.partTypeName : bomObj.parttypeID;
                  }
                  bomObj.isCustPN = custPNArr.isCPN;
                  if (custPNArr.restrictUsePermanently || custPNArr.restrictPackagingUsePermanently) {
                    bomObj.restrictCPNUsePermanentlyStep = false;
                    bomObj.restrictCPNUsePermanentlyError = generateDescription(bomObj, _restrictCPNUsePermanentlyError);
                    bomObj.customerApprovalCPN = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                  } else if ((custPNArr.restrictUSEwithpermission || custPNArr.restrictPackagingUseWithpermission) && bomObj.customerApprovalCPN !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                    bomObj.restrictCPNUseWithPermissionStep = false;
                    bomObj.restrictCPNUseWithPermissionError = generateDescription(bomObj, _restrictCPNUseWithPermissionError);
                    bomObj.customerApprovalCPN = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                  } else {
                    bomObj.customerApprovalCPN = RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED;
                  }
                  bomObj.isCustPNProgrammingRequire = custPNArr.programingRequired;
                }
              }
              else {
                bomObj.customerApprovalCPN = RFQTRANSACTION.CUSTOMER_APPROVAL.NONE;
              }

              // Add CPN alternate parts
              const cpnParts = _.filter(vm.verificationCPNParts, { refCPNPartID: bomObj.custPNID });
              if (cpnParts && cpnParts.length > 0) {
                isMergeCell = true;
                addCPNAlternateParts(bomObj, cpnParts, false);
              } else if (bomObj.custPNID && (bomObj.mfgPN || bomObj.distPN)) {
                isMergeCell = true;
                addCPNAlternateParts(bomObj, [], false);
              }
              if (bomObj.custPN) {
                if (!bomObj.mfgCode && !bomObj.mfgPN) {
                  bomObj.mfgCode = CORE.TBD_MFR_CODE;
                  bomObj.mfgPN = CORE.TO_BE_DETERMINED;
                  vm.isRevifyInternalVerification = true;
                }
              }

              vm.updateSuggestGoodPartDetails(bomObj);
              // [E] Customer PN

              if (bomObj.mountingID === -2 || bomObj.functionalID === -2) {
                let bomDet = null;
                if (!bomObj.lineID && bomObj._lineID) {
                  bomDet = _.find(vm.refBomModel, { lineID: bomObj._lineID });
                } else { bomDet = bomObj; }
                if (!bomDet.isInstall) {
                  const refDesgArry = getDesignatorFromLineItem(bomDet.refDesig, vm.DisplayOddelyRefDes);
                  _.each(refDesgArry, (item) => {
                    const refDesMapping = _.find(getPartProgramMappingDetail, (objRefDesgMap) => objRefDesgMap.softwareRefDesg === item);
                    if (refDesMapping) {
                      getPartProgramMappingDetail.splice(getPartProgramMappingDetail.indexOf(refDesMapping), 1);
                    }
                  });
                }
              }
            });

            vm.bomMfgDistMapping(allPNList, getDistPNList);
            if (vm.continue) {
              vm.bomCleanProgress = 1;
              vm.apiVerification(_dummyEvent);
            }
            else {
              vm.resolveErrorMongoDB();
            }
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      };

      // Shirish: [12-16-2020] added function for validate part detail based on part setting and line detail
      function checkAndValidateMFGPNwithBOMLine(bomObj, mfgPNObj) {
        if (mfgPNObj.rfqConnecterType) {
          bomObj.connectorType = mfgPNObj.rfqConnecterType.name;
        }

        if (bomObj.mfgPN && bomObj.mfgPN.toUpperCase() === vm.NotComponentPart.toUpperCase()) {
          if (bomObj.isBuyDNPQty !== _buyDNPQTYList[0].value) {
            bomObj.isBuyDNPQty = _buyDNPQTYList[0].value;
            bomObj.customerApprovalForDNPBuyStep = false;
            bomObj.customerApprovalForDNPBuyError = generateDescription(bomObj, _customerApprovalForDNPBuyError);
          }
          if (bomObj.isPurchase) {
            bomObj.isPurchase = false;
            bomObj.customerApprovalForBuyStep = false;
            bomObj.customerApprovalForBuyError = generateDescription(bomObj, _customerApprovalForBuyError);
          }
          if (!bomObj.isBuyDisable) {
            bomObj.isBuyDisable = true;
            const buyDisableData = _.filter(vm.bomModel, { '_lineID': bomObj._lineID });
            _.map(buyDisableData, (data) => { data.isBuyDisable = true; });
          }
          buyStepFn(bomObj, null);
        } else {
          bomObj.isBuyDisable = false;
        }

        // Invalid MFR issue generate
        if (bomObj.mfgCodeID === CORE.DefaultInvalidMFRID) {
          bomObj.defaultInvalidMFRStep = false;
          bomObj.defaultInvalidMFRError = generateDescription(bomObj, _defaultInvalidMFRError);
        }

        if (mfgPNObj.isGoodPart !== PartCorrectList.IncorrectPart) {
          bomObj.isMFGGoodPart = mfgPNObj.isGoodPart;
          if (!bomObj.mfgGoodPartMappingStep || !bomObj.suggestedGoodPartStep || !bomObj.distGoodPartMappingStep || !bomObj.suggestedGoodDistPartStep) {
            bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
          }
          bomObj.mfgGoodPartMappingStep = true;
          bomObj.mfgGoodPartMappingStepError = null;
          bomObj.suggestedGoodPartStep = true;
          bomObj.suggestedGoodPartError = null;
          if (mfgPNObj.isGoodPart === PartCorrectList.UnknownPart) {
            bomObj.unknownPartStep = false;
            bomObj.unknownPartError = generateDescription(bomObj, _unknownPartError);
          }
        }
        else {
          bomObj.isMFGGoodPart = PartCorrectList.IncorrectPart;
          vm.updateSuggestGoodPartDetails(bomObj);
          if (bomObj.suggestedGoodPartStep) {
            bomObj.mfgGoodPartMappingStep = false;
            bomObj.mfgGoodPartMappingStepError = generateDescription(bomObj, _mfgGoodPartMappingError);
          } else {
            bomObj.mfgGoodPartMappingStepError = null;
          }
          if (mfgPNObj.replacementComponent) {
            bomObj.suggestedPart = mfgPNObj.replacementComponent.mfgPN;
          }
          else {
            bomObj.suggestedPart = '';
          }
          bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.NONE;
          bomObj.customerApprovalStepError = null;
        }

        // RoHS Status Validation
        if (vm.AssyRoHSMainCategory !== vm.RoHSMainCategory.NotApplicable && !checkPartRoHSValidationWithAssembly(bomObj.RoHSStatusID) && bomObj.refMainCategoryID !== vm.RoHSMainCategory.NotApplicable && (vm.AssyRoHSDeviation === vm.RoHSDeviationDet.No || (vm.AssyRoHSDeviation === vm.RoHSDeviationDet.WithApproval && bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED))) {
          bomObj.nonRohsStep = false;
          bomObj.nonRohsStepError = generateDescription(bomObj, _rohsStatusError);
          if (bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
            bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
            bomObj.customerApprovalStepError = generateDescription(bomObj, _customerApprovalError);
          }
        }
        else {
          bomObj.nonRohsStep = true;
          bomObj.nonRohsStepError = null;
        }

        //restrict Use with/without permission error
        bomObj.restrictUseWithPermissionStep = true;
        bomObj.restrictUseWithPermissionError = null;
        bomObj.restrictUsePermanentlyStep = true;
        bomObj.restrictUsePermanentlyError = null;
        bomObj.restrictUseExcludingAliasStep = true;
        bomObj.restrictUseExcludingAliasError = null;
        bomObj.restrictUseExcludingAliasWithPermissionStep = true;
        bomObj.restrictUseExcludingAliasWithPermissionError = null;
        if (mfgPNObj.restrictUsePermanently || mfgPNObj.restrictPackagingUsePermanently) {
          if (mfgPNObj.restrictUsePermanently) {
            bomObj.restrictUsePermanentlyStep = false;
            bomObj.restrictUsePermanentlyError = generateDescription(bomObj, _restrictUsePermanentlyError);
          }
          else {
            bomObj.restrictUseExcludingAliasStep = false;
            bomObj.restrictUseExcludingAliasError = generateDescription(bomObj, _restrictUseExcludingAliasError);
          }
        } else if ((mfgPNObj.restrictUSEwithpermission || mfgPNObj.restrictPackagingUseWithpermission) && bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
          if (mfgPNObj.restrictUSEwithpermission) {
            bomObj.restrictUseWithPermissionStep = false;
            bomObj.restrictUseWithPermissionError = generateDescription(bomObj, _restrictUseWithPermissionError);
          }
          else {
            bomObj.restrictUseExcludingAliasWithPermissionStep = false;
            bomObj.restrictUseExcludingAliasWithPermissionError = generateDescription(bomObj, _restrictUseExcludingAliasWithPermissionError);
          }
        }

        //UOM Mismatch
        bomObj.uomMismatchedStep = true;
        bomObj.uomMismatchedError = null;
        let lineUOM = (bomObj.uomID || bomObj.uomID === 0) ? bomObj.uomID : bomObj.uom;
        const partUOM = bomObj.uom;
        if (!bomObj.lineID && bomObj._lineID) {
          const bomDet = _.find(vm.refBomModel, { lineID: bomObj._lineID });
          if (bomDet && bomDet.uomID) {
            bomObj.uomID = lineUOM = bomDet.uomID;
          }
        }
        const objLineUOMType = _unitList.find((y) => y.unitName && lineUOM && y.unitName.toUpperCase() === lineUOM.toUpperCase());
        const lineUOMType = (objLineUOMType && objLineUOMType.measurementType) ? objLineUOMType.measurementType.name : null;

        const objPartUOMType = _unitList.find((y) => y.unitName && partUOM && y.unitName.toUpperCase() === partUOM.toUpperCase());
        const partUOMype = objPartUOMType && objPartUOMType.measurementType ? objPartUOMType.measurementType.name : null;

        if (lineUOMType !== partUOMype) {
          bomObj.uomMismatchedStep = false;
          bomObj.uomMismatchedError = generateDescription(bomObj, _uomMismatchedError);
          bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
        }

        // Export Controlled Standard Validation
        bomObj.exportControlledStep = true;
        bomObj.exportControlledError = null;
        if (bomObj.isExportControlled && bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
          bomObj.exportControlledStep = false;
          bomObj.exportControlledError = generateDescription(bomObj, _exportControlledError);
          bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
          bomObj.customerApprovalStepError = generateDescription(bomObj, _customerApprovalError);
        }

        bomObj.invalidConnectorTypeStep = bomObj.mismatchNumberOfRowsStep = bomObj.partPinIsLessthenBOMPinStep = bomObj.tbdPartStep = true;
        bomObj.invalidConnectorTypeError = bomObj.mismatchNumberOfRowsError = bomObj.partPinIsLessthenBOMPinError = bomObj.tbdPartError = null;

        if (!bomObj.lineID && bomObj._lineID) {
          const bomDet = _.find(vm.refBomModel, { lineID: bomObj._lineID });
          bomObj.numOfPosition = (bomDet && bomDet.numOfPosition) ? bomDet.numOfPosition : null;
          bomObj.numOfRows = (bomDet && bomDet.numOfRows) ? bomDet.numOfRows : null;
        }
        const mountingTypeIDObj = _mountingTypeList.find((y) => y.name === bomObj.mountingtypeID);
        if (mfgPNObj.connecterTypeID === vm.CORE_ConnectorType.HEADERBREAKAWAY.ID && mountingTypeIDObj &&
          ((mountingTypeIDObj.id === vm.CORE_RFQ_MOUNTINGTYPE.SMT.ID && (!bomObj.numOfRows || bomObj.noOfRows !== bomObj.numOfRows)) ||
            (mountingTypeIDObj.id === vm.CORE_RFQ_MOUNTINGTYPE.ThruHole.ID && bomObj.numOfRows && bomObj.noOfRows !== bomObj.numOfRows))) {
          bomObj.mismatchNumberOfRowsStep = false;
          bomObj.mismatchNumberOfRowsError = generateDescription(bomObj, _mismatchNumberOfRowsError);
        }

        if (mfgPNObj.connecterTypeID === vm.CORE_ConnectorType.HEADERBREAKAWAY.ID && !bomObj.numOfPosition) {
          bomObj.invalidConnectorTypeStep = false;
          bomObj.connectorType = (mfgPNObj.rfqConnecterType) ? mfgPNObj.rfqConnecterType.name : null;
          bomObj.componentLead = mfgPNObj.noOfPosition;
          bomObj.invalidConnectorTypeError = generateDescription(bomObj, _invalidConnectorTypeError);
        }
        else if (mfgPNObj.connecterTypeID !== vm.CORE_ConnectorType.HEADERBREAKAWAY.ID && bomObj.numOfPosition && (!mfgPNObj.noOfPosition || mfgPNObj.noOfPosition !== bomObj.numOfPosition)) {
          bomObj.invalidConnectorTypeStep = false;
          bomObj.connectorType = (mfgPNObj.rfqConnecterType) ? mfgPNObj.rfqConnecterType.name : null;
          bomObj.componentLead = mfgPNObj.noOfPosition;
          bomObj.invalidConnectorTypeError = generateDescription(bomObj, _invalidConnectorTypeError);
        }

        if (mfgPNObj.connecterTypeID === vm.CORE_ConnectorType.HEADERBREAKAWAY.ID) {
          const bomPinCount = !bomObj.numOfPosition ? 0 : Number(bomObj.numOfPosition);
          const partPinCount = !mfgPNObj.noOfPosition ? 0 : Number(mfgPNObj.noOfPosition);
          if (partPinCount < bomPinCount) {
            bomObj.partPinIsLessthenBOMPinStep = false;
            bomObj.partPinIsLessthenBOMPinError = generateDescription(bomObj, _partPinIsLessthenBOMPinError);
          }
        }
        if (mfgPNObj && mfgPNObj.id === CORE.TBDMFRPNID) {
          bomObj.tbdPartStep = false;
          bomObj.tbdPartError = generateDescription(bomObj, _tbdPartError);
        }
      }

      // Shirish: [12-09-2020] added function for validate part detail based on part setting and line detail
      function validateMFGPNDetails() {
        vm.refBomModel.forEach((bomObj, index) => {
          if ((_hotRegisterer && _hotRegisterer.isEmptyRow(index) && !isFilterApply) || (bomObj.isDeletedFromMapping === true)) {// return for empty row
            return;
          }

          bomObj.pickupPadRequiredStep = bomObj.matingPartRquiredStep = bomObj.driverToolsRequiredStep = bomObj.functionalTestingRequiredStep = bomObj.programingRequiredStep = true;
          bomObj.pickupPadRequiredError = bomObj.matingPartRequiredError = bomObj.driverToolsRequiredError = bomObj.functionalTestingRequiredError = bomObj.programingRequiredError = null;

          // Check Epoxy Parts
          if (bomObj.isEpoxyMount) {
            bomObj.epoxyStep = true;
            if (bomObj.refProcessMaterial && bomObj.refProcessMaterial.length > 0) {
              let validEpoxyPart = false;
              _.each(bomObj.refProcessMaterial, (mfgPad) => {
                if (mfgPad.componentID && _.some(vm.refBomModel, { 'mfgPNID': mfgPad.componentID })) {
                  validEpoxyPart = true;
                }
              });
              if (!validEpoxyPart) {
                // Error Epoxy Material part
                bomObj.epoxyStep = false;
                bomObj.epoxyStepError = generateDescription(bomObj, _epoxyError);
              }
            }
            else {
              // Error Epoxy Material part
              bomObj.epoxyStep = false;
              bomObj.epoxyStepError = generateDescription(bomObj, _epoxyError);
            }
          }

          //check pickup pad required validation
          const checkAlternateCount = _.filter(vm.refBomModel, (item) => parseFloat(item._lineID) === (bomObj._lineID));
          if (bomObj.pickupPadRequired) {
            if (checkAlternateCount && checkAlternateCount.length > 0 && bomObj.componentAlterPN && bomObj.componentAlterPN.length > 0) {
              const pickupPadeAlternate = _.filter(bomObj.componentAlterPN, (item) => item.type === CORE.ComponentAlternatePartType.PickupPadRequired);
              if (pickupPadeAlternate && pickupPadeAlternate.length > 0) {
                let validPickupPad = false;
                _.each(pickupPadeAlternate, (mfgPad) => {
                  if (mfgPad.componentID && _.some(checkAlternateCount, { 'mfgPNID': mfgPad.componentID })) {
                    validPickupPad = true;
                  }
                });
                if (!validPickupPad) {
                  // Error pickup pad
                  bomObj.pickupPadRequiredStep = false;
                  bomObj.pickupPadRequiredError = generateDescription(bomObj, _pickupPadRequiredError);
                }
              }
              else {
                // Error pickup pad
                bomObj.pickupPadRequiredStep = false;
                bomObj.pickupPadRequiredError = generateDescription(bomObj, _pickupPadRequiredError);
              }
            }
            else {
              // Error pickup pad
              bomObj.pickupPadRequiredStep = false;
              bomObj.pickupPadRequiredError = generateDescription(bomObj, _pickupPadRequiredError);
            }
          }

          // Mating part required validation
          if (bomObj.matingPartRquired) {
            if (checkAlternateCount && checkAlternateCount.length > 0 && bomObj.componentAlterPN && bomObj.componentAlterPN.length > 0) {
              const matingPartAlternate = _.filter(bomObj.componentAlterPN, (item) => item.type === CORE.ComponentAlternatePartType.MatingPartRequired);
              if (matingPartAlternate && matingPartAlternate.length > 0) {
                let validMattingPart = false;
                _.each(matingPartAlternate, (mfgPad) => {
                  if (mfgPad.componentID && _.some(checkAlternateCount, { 'mfgPNID': mfgPad.componentID })) {
                    validMattingPart = true;
                  }
                });
                if (!validMattingPart) {
                  // Error mating part
                  bomObj.matingPartRquiredStep = false;
                  bomObj.matingPartRequiredError = generateDescription(bomObj, _matingPartRequiredError);
                }
              }
              else {
                // Error mating part
                bomObj.matingPartRquiredStep = false;
                bomObj.matingPartRequiredError = generateDescription(bomObj, _matingPartRequiredError);
              }
            }
            else {
              // Error mating part
              bomObj.matingPartRquiredStep = false;
              bomObj.matingPartRequiredError = generateDescription(bomObj, _matingPartRequiredError);
            }
          }

          // Driver Tool required validation
          if (bomObj.driverToolRequired) {
            bomObj.driveToolIDs = null;
            if (bomObj.refDriveToolAlias && bomObj.refDriveToolAlias.length > 0) {
              let validDriverToolsPart = false;
              bomObj.driveToolIDs = _.map(bomObj.refDriveToolAlias, 'componentID').join();
              _.each(bomObj.refDriveToolAlias, (mfgPad) => {
                if (mfgPad.componentID && _.some(vm.refBomModel, { 'mfgPNID': mfgPad.componentID })) {
                  validDriverToolsPart = true;
                }
              });
              if (!validDriverToolsPart) {
                // Error Driver Tool part
                bomObj.driverToolsRequiredStep = false;
                bomObj.driverToolsRequiredError = generateDescription(bomObj, _driverToolsRequiredError);
              }
            }
            else {
              // Error Driver Tool part
              bomObj.driverToolsRequiredStep = false;
              bomObj.driverToolsRequiredError = generateDescription(bomObj, _driverToolsRequiredError);
            }
          }

          // Functional Testing Required Validation
          if (bomObj.functionalTestingRequired) {
            if (bomObj.componentAlterPN && bomObj.componentAlterPN.length > 0) {
              const functionalTestingAlternate = _.filter(bomObj.componentAlterPN, (item) => item.type === CORE.ComponentAlternatePartType.FunctionaTestingRequired);
              if (functionalTestingAlternate && functionalTestingAlternate.length > 0) {
                let functionaTestingPart = false;
                _.each(functionalTestingAlternate, (mfgPad) => {
                  if (mfgPad.componentID && _.some(vm.refBomModel, { 'mfgPNID': mfgPad.componentID })) {
                    functionaTestingPart = true;
                  }
                });
                if (!functionaTestingPart) {
                  // Error functional testing
                  bomObj.functionalTestingRequiredStep = false;
                  bomObj.functionalTestingRequiredError = generateDescription(bomObj, _functionalTestingRequiredError);
                }
              }
              else {
                // Error functional testing
                bomObj.functionalTestingRequiredStep = false;
                bomObj.functionalTestingRequiredError = generateDescription(bomObj, _functionalTestingRequiredError);
              }
            }
            else {
              // Error functional testing
              bomObj.functionalTestingRequiredStep = false;
              bomObj.functionalTestingRequiredError = generateDescription(bomObj, _functionalTestingRequiredError);
            }
          }

          // Programing part required validation
          if (bomObj.programingRequired || bomObj.isCustPNProgrammingRequire) {
            let lineProgramingStatus = bomObj.programingStatus;
            let bomDet = bomObj;
            bomObj.mismatchProgrammingStatusStep = true;
            bomObj.mismatchProgrammingStatusError = null;
            bomObj.programingRequiredIDs = null;
            const nonePrograming = _.head(_programingStatusList);
            if (!bomObj.lineID && bomObj._lineID) {
              bomDet = _.find(vm.refBomModel, { lineID: bomObj._lineID });
              if (bomDet && bomDet.programingStatus) {
                lineProgramingStatus = bomDet.programingStatus;
              }
            } else { bomDet = bomObj; }
            if (lineProgramingStatus === nonePrograming.value || lineProgramingStatus === _programingStatusList[1].value) {
              bomObj.programingStatus = lineProgramingStatus = _programingStatusList[1].value;
              bomObj.programingRequiredStep = false;
              bomObj.programingRequiredError = generateDescription(bomObj, _programingRequiredError);
              if (bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                bomObj.customerApprovalStepError = generateDescription(bomObj, _customerApprovalError);
              }
            } else if ((lineProgramingStatus === _programingStatusList[4].value || lineProgramingStatus === _programingStatusList[5].value)) {
              if (bomObj.programingRequiredStep) {
                const PendingRefdes = [];
                const refDesgArry = getDesignatorFromLineItem(bomDet.refDesig, vm.DisplayOddelyRefDes);
                _.each(refDesgArry, (item) => {
                  const refDesMapping = _.find(getPartProgramMappingDetail, (objRefDesgMap) => objRefDesgMap.partRefDesg === item);
                  if (!refDesMapping) {
                    PendingRefdes.push(item);
                  }
                });
                if (bomObj.isBuyDNPQty === _buyDNPQTYList[3].value) {
                  const dnpDesgArry = getDesignatorFromLineItem(bomDet.dnpDesig, vm.DisplayOddelyRefDes);
                  _.each(dnpDesgArry, (item) => {
                    const dnpDesMapping = _.find(getPartProgramMappingDetail, (objRefDesgMap) => objRefDesgMap.partRefDesg === item);
                    if (!dnpDesMapping) {
                      PendingRefdes.push(item);
                    }
                  });
                }
                if (PendingRefdes.length > 0) {
                  bomObj.mappingPartProgramStep = false;
                  bomObj.mappingPartProgramError = generateDescription(bomObj, _mappingPartProgramError);
                  bomObj.mappingPartProgramError = stringFormat(bomObj.mappingPartProgramError, PendingRefdes.join());
                }
                bomObj.programmingMappingPendingRefdesCount = PendingRefdes.length;
              }
              else if (bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED || (lineProgramingStatus !== nonePrograming.value && bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED)) {
                // Error programing part
                bomObj.programingRequiredStep = false;
                bomObj.programingRequiredError = generateDescription(bomObj, _programingRequiredError);
              }
            }
          } else {
            if (bomObj.mfgPNID) {
              let lineProgramingStatus = bomObj.programingStatus;
              if (!bomObj.lineID && bomObj._lineID) {
                const bomDet = _.find(vm.refBomModel, { lineID: bomObj._lineID });
                if (bomDet && bomDet.programingStatus) {
                  bomObj.programingStatus = lineProgramingStatus = bomDet.programingStatus;
                }
              }
              if (lineProgramingStatus !== _programingStatusList[0].value) {
                bomObj.mismatchProgrammingStatusStep = false;
                bomObj.mismatchProgrammingStatusError = generateDescription(bomObj, _mismatchProgrammingStatusError);
                if (bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) {
                  bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                  bomObj.customerApprovalStepError = generateDescription(bomObj, _customerApprovalError);
                }
              } else {
                bomObj.mismatchProgrammingStatusStep = true;
                bomObj.mismatchProgrammingStatusError = null;
              }
            }
          }

          // Programing part required validation
          if (bomObj.mountingID === -2 || bomObj.functionalID === -2) {
            bomObj.programingRequiredStep = true;
            let bomDet = null;
            if (!bomObj.lineID && bomObj._lineID) {
              bomDet = _.find(vm.refBomModel, { lineID: bomObj._lineID });
            } else { bomDet = bomObj; }
            if (bomObj.programingRequiredStep) {
              const PendingRefdes = [];
              if (bomDet.isInstall) {
                const refDesgArry = getDesignatorFromLineItem(bomDet.refDesig, vm.DisplayOddelyRefDes);
                _.each(refDesgArry, (item) => {
                  const refDesMapping = _.find(getPartProgramMappingDetail, (objRefDesgMap) => objRefDesgMap.softwareRefDesg === item);
                  if (!refDesMapping) {
                    PendingRefdes.push(item);
                  }
                });
              }
              if (PendingRefdes.length > 0) {
                bomObj.mappingPartProgramStep = false;
                bomObj.mappingPartProgramError = generateDescription(bomObj, _mappingPartProgramError);
                bomObj.mappingPartProgramError = stringFormat(bomObj.mappingPartProgramError, PendingRefdes.join());
              }
              bomObj.programmingMappingPendingRefdesCount = PendingRefdes.length;
            }
          }
          //  mfgVerificationStepFn(bomObj, index);
        });

        //AlternatePart validation
        const invalidAlternateValidation = vm.alternatePartValidation();
        if (invalidAlternateValidation && invalidAlternateValidation.length > 0) {
          invalidAlternateValidation.forEach((obj) => {
            _.each(vm.refBomModel, (item, itemIndex) => {
              if (vm.refBomModel.length === (itemIndex + (isFilterApply ? 0 : 1))) { // return for empty row
                return;
              } else {
                if (item.mfgPNID && parseFloat(item._lineID) === parseFloat(obj.lineID)) {
                  item.mismatchMountingTypeStep = true;
                  item.mismatchMountingTypeError = null;
                  item.mismatchFunctionalCategoryStep = true;
                  item.mismatchFunctionalCategoryError = null;
                  item.mismatchPitchStep = true;
                  item.mismatchPitchError = null;
                  item.mismatchValueStep = true;
                  item.mismatchColorStep = true;
                  item.mismatchColorError = null;
                  item.mismatchPackageStep = true;
                  item.mismatchToleranceStep = true;
                  item.mismatchPowerStep = true;
                  item.mismatchTempratureStep = true;
                  item.mismatchRequiredProgrammingStep = true;
                  item.mismatchRequiredProgrammingError = null;
                  item.mismatchCustomPartStep = true;
                  item.mismatchCustomPartError = null;
                  item.mismatchCustpartRevStep = true;
                  item.mismatchCustpartRevError = null;
                  if (item.isMFGGoodPart === PartCorrectList.IncorrectPart) {
                    return true;
                  }
                  if (!obj.mountingValidation) {
                    item.mismatchMountingTypeError = generateDescription(item, _mismatchMountingTypeError);
                    item.mismatchMountingTypeStep = false;
                    if (!item.approvedMountingType) {
                      if (!item.mfgGoodPartMappingStep && item.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) {
                        item.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                        item.customerApprovalStepError = generateDescription(item, _customerApprovalError);
                      }
                    } else {
                      if (!item.mfgGoodPartMappingStep && item.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) {
                        item.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED;
                        item.customerApprovalStepError = null;
                      }
                    }
                  }
                  /* condition commented as it remove approved mounting type when add new alternate part on first line */
                  if (!obj.partTypeValidation) {
                    item.mismatchFunctionalCategoryStep = false;
                    item.mismatchFunctionalCategoryError = generateDescription(item, _mismatchFunctionalCategoryError);
                    if (!item.approvedMountingType) {
                      if (!item.mfgGoodPartMappingStep && item.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) {
                        item.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                        item.customerApprovalStepError = generateDescription(item, _customerApprovalError);
                      }
                    } else {
                      if (!item.mfgGoodPartMappingStep && item.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) {
                        item.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED;
                        item.customerApprovalStepError = null;
                      }
                    }
                  }
                  if (!obj.customPartValidation) {
                    const bomlinealternateParts = _.filter(vm.refBomModel, (objbommodel) => parseFloat(objbommodel._lineID) === parseFloat(obj.lineID) && !objbommodel.isCPN);
                    if (_.map(_.groupBy(bomlinealternateParts, 'isCustom')).length > 1) {
                      item.mismatchCustomPartStep = false;
                      item.mismatchCustomPartError = generateDescription(item, _mismatchCustomPartError);
                    }
                  }
                  if (!obj.mismatchCustomPartrevValidation) {
                    const bomlinealternateParts = _.filter(vm.refBomModel, (objbommodel) => parseFloat(objbommodel._lineID) === parseFloat(obj.lineID));
                    if (bomlinealternateParts.length > 1 && item.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                      item.mismatchCustpartRevStep = false;
                      item.mismatchCustpartRevError = generateDescription(item, _mismatchCustpartRevError);
                      if (item.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.NONE) {
                        item.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                      }
                    }
                  }
                  if (!obj.pitchValidation) {
                    item.mismatchPitchStep = false;
                    item.mismatchPitchError = generateDescription(item, _mismatchPitchError);
                  }
                  if (!obj.valueValidation) {
                    item.mismatchValueStep = false;
                    item.isUpdate = true;
                  }
                  if (!obj.colorValidation) {
                    item.mismatchColorStep = false;
                    item.isUpdate = true;
                  }
                  if (!obj.partPackageValidation) {
                    item.mismatchPackageStep = false;
                    item.isUpdate = true;
                  }
                  if (!obj.toleranceValidation) {
                    item.mismatchToleranceStep = false;
                    item.isUpdate = true;
                  }
                  if (!obj.tempratureValidation) {
                    item.mismatchTempratureStep = false;
                    item.isUpdate = true;
                  }
                  if (!obj.powerValidation) {
                    item.mismatchPowerStep = false;
                    item.isUpdate = true;
                  }
                  if (!obj.noOfRowsValidation) {
                    item.mismatchNumberOfRowsStep = false;
                    item.mismatchNumberOfRowsError = generateDescription(item, _mismatchNumberOfRowsError);
                  }
                  if ((!obj.mismatchRequiredProgrammingValidation || !obj.mismatchCPNProgrammingValidation)) {
                    item.mismatchRequiredProgrammingStep = false;
                    item.mismatchRequiredProgrammingError = generateDescription(item, _mismatchRequiredProgrammingError);
                    if (item.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                      item.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                      item.customerApprovalStepError = generateDescription(item, _customerApprovalError);
                    }
                  }
                }
              }
            });
          });
        }
        // Assembly Level Error (Required Mounting Type and Required Functional Type)
        assemblyLevelErrorUpdate();

        checkCPNRestrictCase();

        mergeLineAfterInternalVerification(isMergeCell);
      }
      // Check RoHS validation for parent and peer mapping in RoHS
      function checkPartRoHSValidationWithAssembly(partRoHSStatusID) {
        if (partRoHSStatusID === vm.AssyRoHSStatusID) {
          return true;
        }
        else {
          const objPartRoHS = _.find(vm.RohsList, { id: partRoHSStatusID });
          // if (objRoHS && objRoHS.RoHSMapping && objRoHS.RoHSMapping.includes(vm.AssyRoHSStatusID)) {
          //   return true;
          // }
          const objAssyRoHS = _.find(vm.RohsList, { id: vm.AssyRoHSStatusID });
          if (objPartRoHS && objPartRoHS.RoHSMapping && objAssyRoHS && objAssyRoHS.RoHSMapping && (objPartRoHS.RoHSMapping.includes(vm.AssyRoHSStatusID) || objAssyRoHS.RoHSMapping.includes(partRoHSStatusID))) {
            return true;
          }
        }
        return false;
      };
      // Part Error and Message removed when checking internal part verification
      function itemErrorStepAndMessageRemove(bomObj) {
        bomObj.mismatchValueStep = bomObj.mismatchColorStep = bomObj.mismatchPackageStep = bomObj.mismatchPowerStep = bomObj.mismatchToleranceStep = bomObj.mismatchTempratureStep = bomObj.pickupPadRequiredStep = bomObj.matingPartRquiredStep = bomObj.functionalTestingRequiredStep = bomObj.driverToolsRequiredStep = bomObj.obsoletePartStep = bomObj.mfgPNStep = bomObj.mfgVerificationStep = bomObj.mfgGoodPartMappingStep = bomObj.mfgCodeStep = bomObj.mfgPNStep = bomObj.mfgCodeStep = bomObj.nonRohsStep = bomObj.mfgPNStep = bomObj.mismatchMountingTypeStep = bomObj.mismatchRequiredProgrammingStep = bomObj.mismatchFunctionalCategoryStep = bomObj.requireFunctionalTypeStep = bomObj.requireMountingTypeStep = bomObj.mismatchCustomPartStep = bomObj.exportControlledStep = bomObj.tbdPartStep = bomObj.partPinIsLessthenBOMPinStep = bomObj.unknownPartStep = bomObj.defaultInvalidMFRStep = bomObj.restrictUseWithPermissionStep = bomObj.restrictUsePermanentlyStep = bomObj.restrictUseExcludingAliasWithPermissionStep = bomObj.restrictUseExcludingAliasStep = bomObj.invalidConnectorTypeStep = bomObj.mappingPartProgramStep = bomObj.isMPNAddedinCPN = bomObj.mismatchCustpartRevStep = bomObj.mismatchCPNandCustpartRevStep = true;

        bomObj.mfgPNStepError = bomObj.mfgVerificationStepError = bomObj.mfgGoodPartMappingError = bomObj.mfgCodeError = bomObj.mfgPNError = bomObj.mfgCodeError = bomObj.nonRohsError = bomObj.mfgPNError = bomObj.duplicateCPNError = bomObj.mismatchMountingTypeError = bomObj.mismatchRequiredProgrammingError = bomObj.mappingPartProgramError = bomObj.mismatchFunctionalCategoryError = bomObj.mismatchCustomPartError = bomObj.requireFunctionalTypeError = bomObj.requireMountingTypeError = bomObj.exportControlledError = bomObj.driverToolsRequiredError = bomObj.tbdPartError = bomObj.partPinIsLessthenBOMPinError = bomObj.obsoletePartStepError = bomObj.unknownPartError = bomObj.defaultInvalidMFRError = bomObj.restrictUseWithPermissionError = bomObj.restrictUsePermanentlyError = bomObj.restrictUseExcludingAliasWithPermissionError = bomObj.restrictUseExcludingAliasError = bomObj.pickupPadRequiredError = bomObj.programingRequiredError = bomObj.matingPartRequiredError = bomObj.invalidConnectorTypeError = bomObj.mismatchColorError = bomObj.mismatchCustpartRevError = bomObj.mismatchCPNandCustpartRevError = null;
        bomObj.programmingMappingPendingRefdesCount = 0;
        // Duplicate MPN flag reset
        bomObj.duplicateMPNInSameLineStep = true;
        bomObj.duplicateMPNInSameLineError = null;

        return bomObj;
      };
      // Dist PN and MFR PN Mapping
      vm.bomMfgDistMapping = function (allPNList, getDistPNList) {
        vm.refBomModel.forEach((lineItem, index) => {
          if (vm.refBomModel.length === (index + (isFilterApply ? 0 : 1))) {// return for empty row
            return;
          }
          lineItem.aliasgroupID = null;
          lineItem.mfgDistMappingStep = true;
          lineItem.mfgDistMappingStepError = null;

          if (lineItem.distMfgPNID && lineItem.mfgPNID) {
            const distPNObj = _.find(allPNList, (pn) => pn.id === lineItem.distMfgPNID);
            const mfgPNObj = _.find(allPNList, (pn) => pn.id === lineItem.mfgPNID);

            if (distPNObj && mfgPNObj && (!distPNObj.refSupplierMfgComponent || distPNObj.refSupplierMfgComponent.id !== mfgPNObj.id)) {
              lineItem.mfgDistMappingStep = false;
              lineItem.aliasMFGPN = '';
              if (mfgPNObj && mfgPNObj.aliasMFGPN) {
                lineItem.aliasMFGPN = mfgPNObj.aliasMFGPN;
              }
              lineItem.mfgDistMappingStepError = generateDescription(lineItem, _mfgDistMappingError);
            }
          }
        });
        vm.bomGetMFGPN(getDistPNList);;
      };

      // Get MFR PN step validation
      vm.bomGetMFGPN = function (allPNList) {
        if (allPNList && allPNList.length > 0) {
          vm.refBomModel.forEach((bomObj, index) => {
            if (vm.refBomModel.length === (index + (isFilterApply ? 0 : 1))) { // return for empty row
              return;
            }
            bomObj.getMFGPNStep = true;
            bomObj.getMFGPNStepError = null;
            if (!bomObj.mfgCode && !bomObj.mfgPN && bomObj.distMfgPNID) {
              const pnObj = _.find(allPNList, (pn) => pn.id === bomObj.distMfgPNID);

              if (pnObj && pnObj.refSupplierMfgComponent) {
                // Dharam: [11/05/2020] If supplier part available in BOM and MFR part also in same in line but in alternate part and both match than its not auto merge
                const mfrPartExists = _.find(vm.refBomModel, (item) => item._lineID === bomObj._lineID && item.mfgCodeID === pnObj.refSupplierMfgComponent.mfgcodeID && item.mfgPNID === pnObj.refSupplierMfgComponent.id && !item.distMfgCodeID && !item.distMfgPNID);
                if (mfrPartExists) {
                  mfrPartExists.distAcquisitionDetail = bomObj.distAcquisitionDetail;
                  mfrPartExists.distCodeStep = bomObj.distCodeStep;
                  mfrPartExists.distCodeStepError = bomObj.distCodeStepError;
                  mfrPartExists.distErrorColor = bomObj.distErrorColor;
                  mfrPartExists.distGoodPartMappingStep = bomObj.distGoodPartMappingStep;
                  mfrPartExists.distGoodPartMappingStepError = bomObj.distGoodPartMappingStepError;
                  mfrPartExists.distMfgCodeID = bomObj.distMfgCodeID;
                  mfrPartExists.distMfgPNID = bomObj.distMfgPNID;
                  mfrPartExists.distPN = bomObj.distPN;
                  mfrPartExists.distPNErrorColor = bomObj.distPNErrorColor;
                  mfrPartExists.distPNStep = bomObj.distPNStep;
                  mfrPartExists.distPNTooltip = bomObj.distPNTooltip;
                  mfrPartExists.distributor = bomObj.distributor;
                  mfrPartExists.distTooltip = bomObj.distTooltip;
                  mfrPartExists.distVerificationStep = bomObj.distVerificationStep;
                  mfrPartExists.distVerificationStepError = bomObj.distVerificationStepError;

                  // Remove line if supplier PN updated against MFR PN in same line
                  bomDelete.push(bomObj.rfqAlternatePartID);
                  const listOfDeleteRow = _.map(_.filter(vm.bomModel, { 'id': bomObj.id }), 'rfqAlternatePartID');
                  if (_.difference(listOfDeleteRow, bomDelete).length === 0) {
                    // Manage delete line array in case of existing line delete
                    rowDeleted.push(bomObj.id);
                  }
                  bomObj.isDeletedFromMapping = true;
                }
                else {
                  bomObj.mfgCodeID = pnObj.refSupplierMfgComponent.mfgcodeID;
                  bomObj.mfgPN = pnObj.refSupplierMfgComponent.mfgPN;
                  bomObj.mfgCode = pnObj.refSupplierMfgComponent.mfgCodemst.mfgName;
                  bomObj.mfgPNID = pnObj.refSupplierMfgComponent.id;

                  UpdatePartDetails(bomObj, pnObj.refSupplierMfgComponent);

                  bomObj.mfgCodeStep = bomObj.mfgPNStep = bomObj.getMFGPNStep = true;
                  bomObj.mfgCodeStepError = bomObj.mfgPNStepError = bomObj.getMFGPNStepError = null;

                  bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                  bomObj.customerApprovalStepError = generateDescription(bomObj, _customerApprovalError);
                  checkAndValidateMFGPNwithBOMLine(bomObj, pnObj.refSupplierMfgComponent);
                }
              }
              else {
                bomObj.getMFGPNStep = false;
                bomObj.getMFGPNStepError = generateDescription(bomObj, _getMFGPNError);
              }
            }
          });
        }
        vm.isFromInternalPartVerification = true;
        validateCPNCustomPartRev();
      };
      // Map part details with BOM line items
      function UpdatePartDetails(bomObj, pnObj) {
        bomObj.feature = pnObj.feature;
        bomObj.isEpoxyMount = pnObj.isEpoxyMount;
        bomObj.processMaterialgroupID = pnObj.processMaterialgroupID;
        bomObj.RoHSStatusID = pnObj.RoHSStatusID;
        bomObj.partRoHSStatus = bomObj.RoHSStatusID ? _.find(vm.RohsList, { id: bomObj.RoHSStatusID }).name : '';
        bomObj.assyRoHSStatus = vm.AssyRoHSStatusID ? _.find(vm.RohsList, { id: vm.AssyRoHSStatusID }).name : '';
        bomObj.refMainCategoryID = pnObj.rfq_rohsmst ? pnObj.rfq_rohsmst.refMainCategoryID : vm.RoHSMainCategory.NotApplicable;
        bomObj.PIDCode = pnObj.PIDCode;
        bomObj.pickupPadRequired = pnObj.pickupPadRequired;
        bomObj.matingPartRquired = pnObj.matingPartRquired;
        bomObj.driverToolRequired = pnObj.driverToolRequired;
        bomObj.programingRequired = pnObj.programingRequired;
        bomObj.functionalTestingRequired = pnObj.functionalTestingRequired;
        bomObj.componentAlterPN = pnObj.componentAlterPN;
        bomObj.refDriveToolAlias = pnObj.refDriveToolAlias;
        bomObj.refProcessMaterial = pnObj.refProcessMaterial;
        const objType = _typeList.find((y) => y.id === pnObj.category);
        bomObj.partcategoryID = objType ? objType.Value : null;
        bomObj.mountingtypeID = pnObj.rfqMountingType ? pnObj.rfqMountingType.name : null;
        bomObj.mountingID = pnObj.rfqMountingType ? pnObj.rfqMountingType.id : null;
        bomObj.parttypeID = pnObj.rfqPartType ? pnObj.rfqPartType.partTypeName : null;
        bomObj.functionalID = pnObj.rfqPartType ? pnObj.rfqPartType.id : null;
        bomObj.isFunctionalTemperatureSensitive = pnObj.rfqPartType && pnObj.rfqPartType.isTemperatureSensitive ? pnObj.rfqPartType.isTemperatureSensitive : false;
        bomObj.pitch = pnObj.pitch;
        bomObj.noOfRows = pnObj.noOfRows;
        bomObj.componentLead = pnObj.noOfPosition;
        bomObj.value = pnObj.value;
        bomObj.isCPN = pnObj.isCPN;
        bomObj.isCustom = pnObj.isCustom;
        bomObj.serialNumber = pnObj.serialNumber;
        bomObj.partPackage = pnObj.partPackageID && pnObj.rfq_packagecasetypemst ? pnObj.rfq_packagecasetypemst.name : pnObj.partPackage;
        bomObj.deviceMarking = pnObj.deviceMarking;
        bomObj.tolerance = pnObj.tolerance;
        bomObj.maxOperatingTemp = pnObj.maxOperatingTemp;
        bomObj.minOperatingTemp = pnObj.minOperatingTemp;
        bomObj.powerRating = pnObj.powerRating;
        bomObj.isTemperatureSensitive = pnObj.isTemperatureSensitive;
        bomObj.voltage = pnObj.voltage;
        bomObj.mfgPNDescription = pnObj.mfgPNDescription;
        bomObj.mfgPNrev = pnObj.rev;
        bomObj.createdBy = pnObj.createdBy;
        bomObj.partUOMID = pnObj.uom;
        bomObj.uom = pnObj.uom ? pnObj.UOMs ? pnObj.UOMs.unitName : null : null;
        bomObj.color = pnObj.color;
        bomObj.createdBy = pnObj.createdBy;
        bomObj.packaging = pnObj.packaging;
        bomObj.dataSheetLink = pnObj.dataSheetLink;
        bomObj.isExportControlled = false;
        bomObj.isMFGGoodPart = pnObj.isGoodPart;
        if (pnObj.componetStandardDetail && pnObj.componetStandardDetail.length > 0) {
          const exportControlledCount = _.filter(pnObj.componetStandardDetail, (certificateStandard) => {
            if (certificateStandard.certificateStandard.isExportControlled) {
              return certificateStandard;
            }
          });
          if (exportControlledCount.length > 0) {
            bomObj.isExportControlled = true;
          }
        }
        if (bomObj.isTemperatureSensitive && pnObj.component_temperature_sensitive_data && pnObj.component_temperature_sensitive_data.length > 0) {
          const minTemprature = _.head(_.orderBy(pnObj.component_temperature_sensitive_data, ['pickTemperatureAbove'], ['asc']));
          bomObj.maxSolderingTemperature = minTemprature.pickTemperatureAbove;
          bomObj.maxTemperatureTime = minTemprature.timeLiquidusSecond;
        }
        if (pnObj.componetDynamicAttributeDetails && pnObj.componetDynamicAttributeDetails.length > 0) {
          bomObj.operationalAttributeIDs = _.join(_.map(pnObj.componetDynamicAttributeDetails, 'attributeID'));
        }
        else {
          bomObj.operationalAttributeIDs = '';
        }
        bomObj.replacementPartID = pnObj.replacementPartID;
        if (pnObj.replacementPartID !== null && pnObj.replacementComponent !== null && pnObj.replacementComponent.mfgCodemst !== null) {
          bomObj.badMfgPN = bomObj.suggestedCorrectPart = pnObj.replacementComponent.mfgCodemst.mfgName + '\n' + pnObj.replacementComponent.mfgPN;
        } else if (bomObj.isMFGGoodPart !== PartCorrectList.IncorrectPart && bomObj.isDistGoodPart !== PartCorrectList.IncorrectPart) {
          bomObj.badMfgPN = '';
        }
      }

      //update all error having in mongoDB
      vm.resolveErrorMongoDB = () => {
        getApierror();
      };
      // Suggest Good part Validation step in case of Bad part
      vm.updateSuggestGoodPartDetails = function (bomObj) {
        if (bomObj.isMFGGoodPart === PartCorrectList.IncorrectPart && bomObj.badMfgPN) {
          const findCorrectAlternateMFRPart = _.find(vm.refBomModel, (item) => {
            if (item._lineID === bomObj._lineID && bomObj.suggestedCorrectPart === (item.mfgCode + '\n' + item.mfgPN)) {
              return item;
            }
          });
          if (findCorrectAlternateMFRPart) {
            bomObj.suggestedGoodPartStep = false;
            bomObj.suggestedGoodPartError = generateDescription(bomObj, _suggestedGoodPartError);
          }
          else {
            bomObj.suggestedGoodPartStep = true;
            bomObj.suggestedGoodPartError = null;
          }
        } else if (bomObj.isDistGoodPart === PartCorrectList.IncorrectPart && bomObj.badMfgPN) {
          const findCorrectAlternateDistPart = _.find(vm.refBomModel, (item) => {
            if (item._lineID === bomObj._lineID && bomObj.suggestedCorrectPart === (item.distributor + '\n' + item.distPN)) {
              return item;
            }
          });
          if (findCorrectAlternateDistPart) {
            bomObj.suggestedGoodDistPartStep = false;
            bomObj.suggestedGoodDistPartError = generateDescription(bomObj, _suggestedGoodDistPartError);
          }
        }
      };

      // Alternate part validation mapping
      vm.alternatePartValidation = function () {
        // Here we need to check only correct part
        var bomGroup = _.groupBy(vm.refBomModel, '_lineID');
        var invalidAlternateValidation = [];
        for (const prop in bomGroup) {
          const items = bomGroup[prop];
          if (prop !== 'null' && prop !== 'undefined' && prop !== '') {
            const firstMFG = _.find(items, (i) => i._lineID !== null && i.mfgGoodPartMappingStep && i.suggestedGoodPartStep && i.distGoodPartMappingStep && i.suggestedGoodDistPartStep);
            if (firstMFG) {
              const _mountingtypeID = firstMFG.mountingtypeID;
              const _mountingtypeObj = _mountingTypeList.find((y) => y.name === _mountingtypeID);
              let mountingValidation = true;
              const _parttypeID = firstMFG.parttypeID;
              let partTypeValidation = true;
              const _partIsCustom = firstMFG.isCustom;
              let customPartValidation = true;
              const _pitch = firstMFG.pitch;
              let pitchValidation = true;
              let noOfRowsValidation = true;
              const _value = firstMFG.value;
              let valueValidation = true;
              const _color = firstMFG.color;
              let colorValidation = true;
              const _partPackage = firstMFG.partPackage;
              let partPackageValidation = true;
              const _tolerance = firstMFG.tolerance;
              let toleranceValidation = true;
              const _power = firstMFG.powerRating;
              let powerValidation = true;
              const _minTemp = isNaN(parseFloat(firstMFG.minOperatingTemp)) ? null : parseFloat(firstMFG.minOperatingTemp);
              const _maxTemp = isNaN(parseFloat(firstMFG.maxOperatingTemp)) ? null : parseFloat(firstMFG.maxOperatingTemp);
              let tempratureValidation = true;
              const _programingRequired = firstMFG.programingRequired;
              let mismatchRequiredProgrammingValidation = true;
              let mismatchCPNProgrammingValidation = true;
              const _isCustom = firstMFG.isCustom;
              const _mfgPNrev = firstMFG.mfgPNrev;
              const _custPN = firstMFG.custPN;
              let mismatchCustomPartrevValidation = true;


              if (items.length > 1) {
                if (firstMFG.custPNID && firstMFG.isCustPNProgrammingRequire !== _programingRequired) {
                  mismatchCPNProgrammingValidation = false;
                }
                items.forEach((item) => {
                  if (item.mfgPNID && firstMFG.mfgPNID && item.mfgGoodPartMappingStep && item.suggestedGoodPartStep && item.distGoodPartMappingStep && item.suggestedGoodDistPartStep) {
                    if (item.mountingtypeID !== _mountingtypeID) {
                      mountingValidation = false;
                    }
                    if (item.parttypeID !== _parttypeID) {
                      partTypeValidation = false;
                    }
                    if (item.isCustom !== _partIsCustom) {
                      customPartValidation = false;
                    }
                    if (item.programingRequired !== _programingRequired) {
                      mismatchRequiredProgrammingValidation = false;
                    }
                    if (item.pitch !== _pitch) {
                      if (item.pitch || _pitch) {
                        pitchValidation = false;
                      }
                    }
                    if (item.pitch !== null && _pitch !== null && item.pitch.toLowerCase() === _pitch.toLowerCase()) {
                      pitchValidation = true;
                      item.mismatchPitchStep = true;
                      item.mismatchPitchError = null;
                    }
                    if (item.value !== _value) {
                      if (item.value || _value) {
                        valueValidation = false;
                      }
                      if (item.value !== null && _value !== null && item.value.toLowerCase() === _value.toLowerCase()) {
                        valueValidation = true;
                      }
                    }
                    if (item.color !== _color) {
                      if (item.color || _color) {
                        colorValidation = false;
                      }
                      if (item.color !== null && _color !== null && item.color.toLowerCase() === _color.toLowerCase()) {
                        colorValidation = true;
                      }
                    }
                    if (item.partPackage !== _partPackage) {
                      if (item.partPackage || _partPackage) {
                        partPackageValidation = false;
                      }
                      if (item.partPackage !== null && _partPackage !== null && item.partPackage.toLowerCase() === _partPackage.toLowerCase()) {
                        partPackageValidation = true;
                      }
                    }
                    if (item.tolerance !== _tolerance) {
                      if (item.tolerance || _tolerance) {
                        toleranceValidation = false;
                      }
                      if (item.tolerance !== null && _tolerance !== null && item.tolerance.toLowerCase() === _tolerance.toLowerCase()) {
                        toleranceValidation = true;
                      }
                    }
                    if (item.powerRating !== _power) {
                      if (item.powerRating || _power) {
                        powerValidation = false;
                      }
                      if (item.powerRating !== null && _power !== null && item.powerRating.toLowerCase() === _power.toLowerCase()) {
                        powerValidation = true;
                      }
                    }
                    const _mountingtypeItemObj = _mountingTypeList.find((y) => y.name === item.mountingtypeID);
                    if (item.connectorType === vm.CORE_ConnectorType.HEADERBREAKAWAY.Name && _mountingtypeObj && _mountingtypeObj.id === vm.CORE_RFQ_MOUNTINGTYPE.SMT.ID && item.noOfRows !== firstMFG.noOfRows) {
                      if (_mountingtypeItemObj && _mountingtypeItemObj.id === _mountingtypeObj.id) {
                        noOfRowsValidation = false;
                      }
                    }
                    const itemMinTemp = isNaN(parseFloat(item.minOperatingTemp)) ? null : parseFloat(item.minOperatingTemp);
                    const itemMaxTemp = isNaN(parseFloat(item.maxOperatingTemp)) ? null : parseFloat(item.maxOperatingTemp);
                    if (itemMinTemp !== null || itemMaxTemp !== null || _minTemp !== null || _maxTemp !== null) {
                      tempratureValidation = false;
                      if (itemMinTemp !== null && _minTemp !== null && itemMaxTemp !== null && _maxTemp !== null && itemMinTemp <= _minTemp && itemMaxTemp >= _maxTemp) {
                        tempratureValidation = true;
                      }
                    }
                    if ((_custPN === null || _custPN === undefined) && (item.isCustom !== _isCustom || (item.isCustom && item.mfgPNrev !== _mfgPNrev))) {
                      if (item.mfgPNrev || _mfgPNrev) {
                        mismatchCustomPartrevValidation = false;
                      }
                      if (item.mfgPNrev !== null && _mfgPNrev !== null && item.mfgPNrev.toLowerCase() === _mfgPNrev.toLowerCase()) {
                        mismatchCustomPartrevValidation = true;
                      }
                    }
                    if (!partTypeValidation || !mountingValidation || !pitchValidation || !valueValidation || !colorValidation || !partPackageValidation
                      || !toleranceValidation || !powerValidation || !tempratureValidation || !noOfRowsValidation || !customPartValidation || !mismatchCustomPartrevValidation) {
                      invalidAlternateValidation.push({
                        lineID: parseFloat(prop),
                        mountingValidation: mountingValidation,
                        partTypeValidation: partTypeValidation,
                        customPartValidation: customPartValidation,
                        pitchValidation: pitchValidation,
                        valueValidation: valueValidation,
                        colorValidation: colorValidation,
                        partPackageValidation: partPackageValidation,
                        toleranceValidation: toleranceValidation,
                        powerValidation: powerValidation,
                        tempratureValidation: tempratureValidation,
                        noOfRowsValidation: noOfRowsValidation,
                        mismatchRequiredProgrammingValidation: mismatchRequiredProgrammingValidation,
                        mismatchCPNProgrammingValidation: mismatchCPNProgrammingValidation,
                        mismatchCustomPartrevValidation: mismatchCustomPartrevValidation
                      });
                    }
                  }
                });
              } else if (items.length === 1) {
                const isTBDPart = _.find(CORE.TBDMFGAndMFGPN, (objItem) => items[0].mfgPN === objItem);

                if (!isTBDPart && items[0].custPNID && items[0].isCustPNProgrammingRequire !== _programingRequired) {
                  mismatchCPNProgrammingValidation = false;
                }
                invalidAlternateValidation.push({
                  lineID: parseFloat(prop),
                  mountingValidation: mountingValidation,
                  partTypeValidation: partTypeValidation,
                  customPartValidation: customPartValidation,
                  pitchValidation: pitchValidation,
                  valueValidation: valueValidation,
                  colorValidation: colorValidation,
                  partPackageValidation: partPackageValidation,
                  toleranceValidation: toleranceValidation,
                  powerValidation: powerValidation,
                  tempratureValidation: tempratureValidation,
                  noOfRowsValidation: noOfRowsValidation,
                  mismatchRequiredProgrammingValidation: mismatchRequiredProgrammingValidation,
                  mismatchCPNProgrammingValidation: mismatchCPNProgrammingValidation,
                  mismatchCustomPartrevValidation: mismatchCustomPartrevValidation
                });
              }
            }
          }
        }
        //if (invalidAlternateValidation.lenght > 0)
        //  invalidAlternateValidation
        return invalidAlternateValidation;
      };

      // Get Supplier API error for show API error count
      function getApierror() {
        var objApi = {
          ispartMaster: false,
          partID: _partID
        };
        APIVerificationErrorPopupFactory.getAPIVerificationErrors().query({ objApiError: objApi }).$promise.then((response) => {
          if (response && response.data && response.data.bomError) {
            vm.issueCount = response.data.bomError.length;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // External Verification Step
      vm.apiVerification = function () {
        if ((vm.selectedFilter == vm.allFilterID && vm.bomModel.length === 1 && !vm.globalSearchText) || vm.isQPADesigStepPending() == true || vm.APIVerifiedFlag == vm.pricingStatus.PENDING || (vm.isBOMReadOnly && !vm.issueCount)) {
          return false;
        }
        // Check Same part line merged as per discussion with DP on 12-11-2018
        if (checkSamePartsInDiffLine()) {
          return;
        }
        const model = {
          rfqAssyID: _rfqAssyID,
          partID: _partID,
          parts: [],
          bomMFR: [],
          bomSupplier: [],
          DKVersion: _DkVersion
        };

        vm.bomModel.forEach((item, index) => {
          if (_hotRegisterer && !_hotRegisterer.isEmptyRow(index)) {
            let desc = item.customerDescription;
            if (!desc)  //case for alternate part not showing description
            {
              const customerCmt = _.find(vm.bomModel, (bom) => bom._lineID === item._lineID && bom.customerDescription);
              if (customerCmt) {
                desc = customerCmt.customerDescription;
              }
            }
            if ((item.mfgPNID === null || item.mfgPNID === undefined) && item.mfgPN) {
              model.parts.push({
                lineID: item._lineID ? item._lineID.toString().trim() : null,
                partNumber: item.mfgPN,
                partID: _partID,
                partStatus: 0,
                supplier: 'DK',
                PricingAPIName: PRICING.PricingAPINames.DigiKey,
                type: _DkVersion === CORE.DKVersion.DKV2 ? PRICING.APP_DK_TYPE.FJTCleanBOM : PRICING.APP_DK_TYPE.FJTCleanBOMV3,
                description: desc,
                mfgName: item.mfgCode
              });
            }

            if ((item.distMfgPNID === null || item.distMfgPNID === undefined) && item.distPN) {
              model.parts.push({
                lineID: item._lineID ? item._lineID.toString().trim() : null,
                partNumber: item.distPN,
                partID: _partID,
                partStatus: 0,
                supplier: 'DK',
                PricingAPIName: PRICING.PricingAPINames.DigiKey,
                type: _DkVersion === CORE.DKVersion.DKV2 ? PRICING.APP_DK_TYPE.FJTCleanBOM : PRICING.APP_DK_TYPE.FJTCleanBOMV3,
                description: desc,
                mfgName: item.distributor
              });
            }
            if ((item.mfgCodeID === null || item.mfgCodeID === undefined) && item.mfgCode) {
              model.bomMFR.push({
                lineID: item._lineID ? item._lineID.toString().trim() : null,
                partID: _partID,
                partNumber: item.mfgPN,
                description: desc,
                mfgName: item.mfgCode,
                bomMFG: item.mfgCode
              });
            }
            if ((item.distMfgCodeID === null || item.distMfgCodeID === undefined) && item.distributor) {
              model.bomSupplier.push({
                lineID: item._lineID ? item._lineID.toString().trim() : null,
                partID: _partID,
                partNumber: item.distPN,
                description: desc,
                supplierName: item.distributor,
                bomMFG: item.distributor
              });
            }
          }
        });
        model.parts = _.uniqBy(model.parts, 'partNumber');
        model.bomMFR = _.uniqBy(model.bomMFR, 'mfgName');
        model.bomSupplier = _.uniqBy(model.bomSupplier, 'supplierName');
        if (vm.continue) {
          vm.continue = false;
          vm.bomCleanProgress = 1;
          getComponentVerification(model, _dummyEvent);
          if (model.parts.length === 0) {
            getApierror();
          }
        }
        else {
          vm.bomCleanProgress = 1; //default 1 percentage for clean process
          const objApi = {
            ispartMaster: false,
            partID: _partID
          };
          vm.cgBusyLoading = APIVerificationErrorPopupFactory.getAPIVerificationErrors().query({ objApiError: objApi }).$promise.then((response) => {
            if (response && response.data && response.data.bomError && response.data.bomError.length > 0) {
              vm.issueCount = response.data.bomError.length;
              openErrorListPopup();
            }
            else {
              vm.isBOMChanged = BOMFactory.isBOMChanged = true;
              BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];
              vm.issueCount = response.data.bomError.length;
              getComponentVerification(model, _dummyEvent);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      // Cancel external verification
      vm.cancelAPIVerification = function () {
        if (vm.isBOMReadOnly) {
          return false;
        }
        const obj = {
          title: CORE.MESSAGE_CONSTANT.CONFIRMATION,
          textContent: CORE.MESSAGE_CONSTANT.CANCEL_VERIFY_PN_EXTRNALLY_CONFIRMATION_MESSAGE,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.confirmDiolog(obj).then((yes) => {
          if (yes) {
            isStopAPIVerification = true;
            vm.APIVerifiedFlag = null;
            vm.cgBusyLoading = ImportBOMFactory.cancelAPIVerification().query({ partID: _partID }).$promise.then(() => {
              NotificationFactory.success(CORE.MESSAGE_CONSTANT.CANCEL_VERIFY_PN_EXTRNALLY_SUCCESS_MESSAGE);
              const objApi = {
                ispartMaster: false,
                partID: _partID
              };
              vm.cgBusyLoading = APIVerificationErrorPopupFactory.getAPIVerificationErrors().query({ objApiError: objApi }).$promise.then((response) => {
                if (response && response.data && response.data.bomError && response.data.bomError.length > 0) {
                  vm.issueCount = response.data.bomError.length;
                  openErrorListPopup();
                }
                else {
                  vm.issueCount = 0;
                  vm.componentVerification();
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }).catch((error) => {
              BaseService.getErrorLog(error);
            });
          }
        }, () => {
          // Empty
        });
      };

      // Check Obsolete part using internal verification
      vm.checkObsoleteParts = function () {
        if (vm.selectedFilter == vm.allFilterID && vm.bomModel.length == 1 || vm.selectedFilter != vm.allFilterID || vm.isBOMReadOnly) { return false; }
        checkObsoletePartsDetails();
      };

      // Open Error list pop-up in case of external verification pop-up
      function openErrorListPopup() {
        var data = {
          partID: _partID,
          isReadOnly: vm.isBOMReadOnly
        };
        DialogFactory.dialogService(
          RFQTRANSACTION.API_VERIFICATION_ERROR_CONTROLLER,
          RFQTRANSACTION.API_VERIFICATION_ERROR_VIEW,
          _dummyEvent,
          data).then(() => {
            vm.socketmsgwasOpened = false;
          }, (data) => {
            if (data && data.verifiedErrors && data.verifiedErrors.length > 0) {
              vm.errorList = data.verifiedErrors;
            }
            else {
              vm.errorList = null;
            }
            if (data && data.iscontinue) {
              vm.continue = true;
              vm.bomCleanProgress = 1;
              vm.componentVerification();
            }
            else if (data && !data.iscontinue && data.verifiedErrors && data.verifiedErrors.length > 0) {
              vm.resolveErrorMongoDB();
            }
            else {
              getApierror();
            }
            vm.socketmsgwasOpened = false;
          });
      }

      // Check Obsolete part using internal verification
      const checkObsoletePartsDetails = () => {
        const model = _.map(_.filter(vm.refBomModel, (item) => item.mfgPNID), 'mfgPNID');
        return vm.cgBusyLoading = ImportBOMFactory.checkObsoleteParts().save(model).$promise.then((response) => {
          if (response && response.data && response.data.length > 0) {
            const obsoleteParts = [];
            vm.refBomModel.forEach((bomObj, index) => {
              const isExists = _.some(response.data, (item) => bomObj.mfgPNID === item.id);
              bomObj.isObsoleteLine = false;
              if (isExists) {
                bomObj.obsoletePartStep = false;
                if (bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                  bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                }
                if (bomObj.mfgCode === bomObj.org_mfgCode && bomObj.mfgPN === bomObj.org_mfgPN) {
                  bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.NONE;
                  bomObj.customerApprovalStepError = null;
                }

                bomObj.isObsolete = true;
                const componentData = _.find(response.data, { 'id': bomObj.mfgPNID });
                if (componentData && componentData.ltbDate) {
                  bomObj.ltbDate = $filter('date')(new Date(componentData.ltbDate).setHours(0, 0, 0, 0), vm.DefaultDateFormat);
                }
                else {
                  bomObj.ltbDate = RFQTRANSACTION.DEFAULT_LTB_DATE_TEXT;
                }
                bomObj.partStatus = componentData.partStatus;
                bomObj.partStatuscolorCode = componentData.colorCode;
                bomObj.obsoletePartStepError = generateDescription(bomObj, _obsoletePartError);
                obsoleteParts.push({ index: index, _lineID: bomObj._lineID, mfgPNID: bomObj.mfgPNID });
              }
              else {
                bomObj.isObsolete = false;
                bomObj.obsoletePartStep = true;
                bomObj.obsoletePartStepError = null;
              }
            });
            _.each(obsoleteParts, (obsolateItem) => {
              if (_.countBy(vm.bomModel, { _lineID: obsolateItem._lineID }).true === _.countBy(obsoleteParts, { _lineID: obsolateItem._lineID }).true) {
                const ObsoleteLines = _.filter(vm.refBomModel, (item) => item._lineID === obsolateItem._lineID);
                _.each(ObsoleteLines, (bomObj) => {
                  bomObj.isObsoleteLine = true;
                });
              }
            });
            if (vm.isAutoDraftSave && !vm.isBOMVerified) {
              vm.draftSave();
            }
            else {
              if (_hotRegisterer) {
                _hotRegisterer.validateCells();
              }
              if (vm.isRevifyInternalVerification) {
                vm.componentVerification();
              }
              else if (vm.isFromInternalPartVerification) {
                NotificationFactory.success(CORE.MESSAGE_CONSTANT.VERIFY_PN_INTERNALLY_SUCCESS_MESSAGE);
                vm.isFromInternalPartVerification = false;
                validateMFGPNDetails();
              } else {
                NotificationFactory.success(CORE.MESSAGE_CONSTANT.CHECK_OBSOLETE_PART_SUCCESS_MESSAGE);
                validateMFGPNDetails();
              }
            }
          }
          else if (vm.isFromInternalPartVerification) {
            if (vm.isAutoDraftSave && !vm.isBOMVerified) {
              vm.draftSave();
            }
            else {
              if (_hotRegisterer) {
                _hotRegisterer.validateCells();
              }
              if (vm.isRevifyInternalVerification) {
                vm.componentVerification();
              }
              else if (vm.isFromInternalPartVerification) {
                NotificationFactory.success(CORE.MESSAGE_CONSTANT.VERIFY_PN_INTERNALLY_SUCCESS_MESSAGE);
                vm.isFromInternalPartVerification = false;
                validateMFGPNDetails();
              } else {
                NotificationFactory.success(CORE.MESSAGE_CONSTANT.CHECK_OBSOLETE_PART_SUCCESS_MESSAGE);
                validateMFGPNDetails();
              }
            }
          }
          else if (!vm.isFromInternalPartVerification) {
            const model = {
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: CORE.MESSAGE_CONSTANT.NO_OBSOLETE_PART_SUCCESS_MESSAGE,
              multiple: true
            };
            DialogFactory.alertDialog(model);
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      };

      // Dharam: [11/12/2020] Remove duplicate line or unused lines after MFR mapping
      function mergeLineAfterInternalVerification(isMergeCell) {
        const isLineDeleted = _.some(vm.refBomModel, { isDeletedFromMapping: true });
        if (isLineDeleted) {
          vm.refBomModel = _.filter(vm.refBomModel, (item) => !item.isDeletedFromMapping);
        }
        // Shirish: [12-08-2020] this is to check Duplicate Part in same line after all validation and Dist-MFR mapping
        // Get Duplicate MGF MFGPN
        const duplicateMPN = getDuplicatePID();
        if (duplicateMPN && duplicateMPN.length > 0) {
          duplicateMPN.forEach((obj) => {
            _.each(vm.refBomModel, (item, itemIndex) => {
              if (vm.refBomModel.length === (itemIndex + (isFilterApply ? 0 : 1))) { // return for empty row
                return;
              }
              if (parseFloat(item._lineID) === parseFloat(obj.lineID) && item.mfgPNID === obj.mfgPN) {
                item.duplicateMPNInSameLineStep = false;
                item.duplicateMPNInSameLineError = generateDescription(item, _duplicateMPNInSameLineError);
              }
            });
          });
        }
        // Get Duplicate CPN
        const duplicateCPN = getDuplicateCustomerPN();
        if (duplicateCPN && duplicateCPN.length > 0) {
          _.each(vm.refBomModel, (item, iIndex) => {
            if (vm.refBomModel.length === (iIndex + (isFilterApply ? 0 : 1))) { // return for empty row
              return;
            }
          });
        }
        // Shirish: [12-08-2020] this is to set all validation msg for errors
        _.each(vm.refBomModel, (bomObj, index) => {
          if (vm.refBomModel.length !== (index + (isFilterApply ? 0 : 1))) {
            mfgVerificationStepFn(bomObj, index);
            distVerificationStepFn(bomObj, index);
            cpnDuplicateStepFn(bomObj, index);
          }
        });
        setHeaderStyle();
        if (isLineDeleted || isMergeCell) {
          updateCloneObject(isFilterApply);
          $timeout(() => {
            mergeCommonCells();
            if (_hotRegisterer) {
              _hotRegisterer.validateCells();
              setHeaderStyle();
            }
          }, 1000);
        }
        $scope.loaderVisible = false;
      }

      // Password Approval pop-up
      function passwordApproval() {
        if (!vm.allowAccess) {
          return DialogFactory.dialogService(
            CORE.VERIFY_USER_PASSWORD_POPUP_CONTROLLER,
            CORE.VERIFY_USER_PASSWORD_POPUP_VIEW,
            _dummyEvent, model).then((data) => {
              if (data) {
                return true;
              }
            }, () => {
              // Empty
              vm.passwordApproval = false;
              vm.VerifiedConfirm = false;
            });
        } else {
          return DialogFactory.dialogService(
            CORE.MANAGE_PASSWORD_POPUP_CONTROLLER,
            CORE.MANAGE_PASSWORD_POPUP_VIEW,
            _dummyEvent, {
              isValidate: true
            }).then((data) => {
              if (data) {
                return true;
              }
            }, () => {
              // Empty
              vm.passwordApproval = false;
              vm.VerifiedConfirm = false;
            });
        }
      }

      // Customer approval pop-up
      function customerApprovalPopup(bomObj, title, isShowMFGPN, type) {
        return DialogFactory.dialogService(
          RFQTRANSACTION.CUSTOMER_APPROVAL_POPUP_CONTROLLER,
          RFQTRANSACTION.CUSTOMER_APPROVAL_POPUP_VIEW,
          _dummyEvent,
          {
            title: title, mfgPNID: bomObj.mfgPNID, isShowMFGPN: isShowMFGPN
          }).then((result) => {
            if (result) {
              if (isShowMFGPN) {
                bomObj.partCustomerApprovalComment = result.comment;
                bomObj.requiredToShowOnQuoteSummary = result.requiredToShowOnQuoteSummary;
                bomObj.isCustomerApprovedPart = result.isCustomerApproved;
              }
              else {
                switch (type) {
                  case CORE.CUSTOMERAPPROVALFOR.QPA_REFDES: {
                    bomObj.qpaCustomerApprovalComment = result.comment;
                    bomObj.requiredToShowQPAOnQuoteSummary = result.requiredToShowOnQuoteSummary;
                    bomObj.isCustomerApprovedQPA = result.isCustomerApproved;
                    break;
                  }
                  case CORE.CUSTOMERAPPROVALFOR.DNP_QPA_REFDES: {
                    bomObj.dnpqpaCustomerApprovalComment = result.comment;
                    bomObj.requiredToShowDNPQPAOnQuoteSummary = result.requiredToShowOnQuoteSummary;
                    bomObj.isCustomerApprovedDNPQPA = result.isCustomerApproved;
                    break;
                  }
                  case CORE.CUSTOMERAPPROVALFOR.BUY: {
                    bomObj.buyCustomerApprovalComment = result.comment;
                    bomObj.requiredToShowBuyOnQuoteSummary = result.requiredToShowOnQuoteSummary;
                    bomObj.isCustomerApprovedBuy = result.isCustomerApproved;
                    break;
                  }
                  case CORE.CUSTOMERAPPROVALFOR.DNP_BUY: {
                    bomObj.buyDNPCustomerApprovalComment = result.comment;
                    bomObj.requiredToShowBuyOnQuoteSummary = result.requiredToShowOnQuoteSummary;
                    bomObj.isCustomerApprovedBuyDNP = result.isCustomerApproved;
                    break;
                  }
                  case CORE.CUSTOMERAPPROVALFOR.POPULATE: {
                    bomObj.populateCustomerApprovalComment = result.comment;
                    bomObj.requiredToShowPopulateOnQuoteSummary = result.requiredToShowOnQuoteSummary;
                    bomObj.isCustomerApprovedPopulate = result.isCustomerApproved;
                    break;
                  }
                  case CORE.CUSTOMERAPPROVALFOR.CPN: {
                    bomObj.cpnCustomerApprovalComment = result.comment;
                    bomObj.requiredToShowCPNOnQuoteSummary = result.requiredToShowOnQuoteSummary;
                    bomObj.isCustomerApprovedCPN = result.isCustomerApproved;
                    break;
                  }
                  case CORE.CUSTOMERAPPROVALFOR.KitAllocationNotRequired: {
                    bomObj.kitAllocationNotRequiredComment = result.comment;
                    bomObj.requiredToShowKitOnQuoteSummary = result.requiredToShowOnQuoteSummary;
                    bomObj.isNotRequiredKitAllocationApproved = result.isCustomerApproved;
                    break;
                  }
                  case CORE.CUSTOMERAPPROVALFOR.ApprovedMountingType: {
                    let comment = null;
                    if (bomObj.mismatchFunctionalCategoryError) {
                      comment = '<li>' + bomObj.mismatchFunctionalCategoryError + '</li>';
                    }
                    if (bomObj.mismatchMountingTypeError) {
                      comment = comment ? '<ul>' + comment + '<li>' + bomObj.mismatchMountingTypeError + '</li></ul>' : '<ul><li>' + bomObj.mismatchMountingTypeError + '</li></ul>';
                    }
                    result.comment = stringFormat(CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALDISPLAYFORMAT, result.comment, bomObj.isCustomerApproved ? CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVEDNAME : CORE.MESSAGE_CONSTANT.ENGINEERAPPROVEDNAME);
                    bomObj.ApprovedMountingTypeComment = result.comment + comment;
                    bomObj.requiredToShowOnQuoteSummary = result.requiredToShowOnQuoteSummary;
                    bomObj.isApproveMountingType = result.isCustomerApproved;
                    break;
                  }
                };
              }
            }
            return bomObj;
          }, () => {
            // cancel
            if (type === CORE.CUSTOMERAPPROVALFOR.KitAllocationNotRequired) {
              bomObj.isNotRequiredKitAllocation = false;
            }
          }, (err) => {
            BaseService.getErrorLog(err);
          });
      }

      /* when filter change */
      let oldSelectedFilter = vm.selectedFilter;

      // On filter change apply filter logic as per selected filter
      vm.onFilterClick = (isDataSaved, item) => {
        if (item && item.filterCode !== oldSelectedFilter) {
          const newSelectedFilter = item.filterCode;
          if (vm.isBOMChanged || (!isDataSaved && _.some(vm.refBomModel, (x) => x.isUpdate === true))) {
            vm.selectedFilter = oldSelectedFilter;
            const model = {
              title: RFQTRANSACTION.BOM.CHANGES_REMOVE,
              textContent: RFQTRANSACTION.BOM.CHANGES_REMOVE_TEXT,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
            };
            DialogFactory.confirmDiolog(model).then((yes) => {
              if (yes) {
                vm.selectedFilter = newSelectedFilter;
                vm.selectedFilterNameWithCount = item.filternamtewithCount;
                getDataForFilter();
              }
            }, () => {
              vm.selectedFilter = oldSelectedFilter;
              vm.autoCompleteFilter.keyColumnId = vm.selectedFilter;
            });
          }
          else {
            vm.selectedFilter = newSelectedFilter;
            vm.selectedFilterNameWithCount = item.filternamtewithCount;
            getDataForFilter();
          }
        }
      };

      // get data from DB then apply filter on data
      function getDataForFilter() {
        vm.isBOMChanged = BOMFactory.isBOMChanged = false;
        BaseService.currentPageFlagForm = [];
        oldSelectedFilter = vm.selectedFilter;
        isFilterApply = false;
        if (vm.selectedFilter !== _bomFilters.ALL.CODE) {
          isFilterApply = true;
        }
        vm.isNoDataFound = true;
        vm.isFilterEnable = true;
        vm.cgBusyLoading = getRFQLineItemsByID().then((response) => {
          if (response) {
            switch (vm.selectedFilter) {
              case _bomFilters.ALL.CODE: {
                vm.settings.minSpareRows = 1;
                vm.settings.className = '';
                displayRFQLineItemsByID(response);
                applyFilteronData();
                if (vm.globalSearchText) {
                  vm.SearchInBOMdata(true);
                }
                break;
              }
              default: {
                vm.settings.minSpareRows = 0;
                vm.settings.className = 'applyFilter';
                displayRFQLineItemsByID(response, false);
                applyFilteronData();
                if (vm.globalSearchText) {
                  vm.SearchInBOMdata(true);
                  break;
                }
                //Clone Object
                updateCloneObject(true);
                vm.settings.mergeCells = false;
                $timeout(mergeCommonCells);
                break;
              }
            };
          }
        });
      }

      // Apply hidden flag for filter data
      function applyFilteronData() {
        switch (vm.selectedFilter) {
          case _bomFilters.QPAREFDES.CODE: {
            const qpaValidMatchList = [true, 1, null, undefined];
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== true) {
                if (qpaValidMatchList.indexOf(bomObj.qpaDesignatorStep) !== -1) {
                  bomObj.hidden = true;
                  const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                  _.map(hiddenData, (data) => { data.hidden = true; });
                } else {
                  bomObj.hidden = false;
                }
              }
            });
            break;
          }
          case _bomFilters.INTERNALPN.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                const isInValid = isBOMObjInValid(partInvalidMatchList, bomObj);
                if (isInValid) {
                  bomObj.hidden = false;
                  const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                  _.map(hiddenData, (data) => { data.hidden = false; });
                } else {
                  bomObj.hidden = true;
                }
              }
            });
            break;
          }
          case _bomFilters.NONROHS.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                const objModelRefMainCategoryID = bomObj.refMainCategoryID !== null ? bomObj.refMainCategoryID : vm.RoHSMainCategory.NotApplicable;
                bomObj.hidden = objModelRefMainCategoryID !== vm.RoHSMainCategory.NonRoHS ? true : false;
                if (!bomObj.hidden) {
                  const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                  _.map(hiddenData, (data) => { data.hidden = false; });
                }
              }
            });
            break;
          }
          case _bomFilters.OBSOLETE.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                bomObj.hidden = !bomObj.isObsolete;
                if (bomObj.isObsolete) {
                  const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                  _.map(hiddenData, (data) => { data.hidden = false; });
                }
              }
            });
            break;
          }
          case _bomFilters.BADPART.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                const isInValid = (bomObj.mfgCode && bomObj.mfgCodeID === null) || (bomObj.distributor && bomObj.distMfgCodeID === null) || (bomObj.mfgPN && (bomObj.mfgPNID === null || bomObj.isMFGGoodPart === PartCorrectList.IncorrectPart)) || (bomObj.distPN && (bomObj.distMfgPNID === null || bomObj.isDistGoodPart === PartCorrectList.IncorrectPart));
                bomObj.hidden = !isInValid;
                if (isInValid) {
                  const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                  _.map(hiddenData, (data) => { data.hidden = false; });
                }
              }
            });
            break;
          }
          case _bomFilters.CUSTOMERAPPROVAL.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                bomObj.hidden = (bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED && bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.NONE) ? true : false;
                if (!bomObj.hidden) {
                  const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                  _.map(hiddenData, (data) => { data.hidden = false; });
                }
              }
            });
            break;
          }
          case _bomFilters.SUGGESTEDGOODPART.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                if (bomObj.badMfgPN) {
                  bomObj.hidden = false;
                  const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                  _.map(hiddenData, (data) => { data.hidden = false; });
                }
                else {
                  bomObj.hidden = true;
                }
              }
            });
            break;
          }
          case _bomFilters.CUSTOMERAPPROVALPENDDING.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                bomObj.hidden = bomObj.mfgPNID && bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING ? false : true;
                if (!bomObj.hidden) {
                  const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                  _.map(hiddenData, (data) => { data.hidden = false; });
                }
              }
            });
            break;
          }
          case _bomFilters.PARTWITHISSUES.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                if (bomObj && !bomObj.mfgPNID || (bomObj.description) || (bomObj.descriptionAlternate) || !bomObj.qpa || !bomObj.refDesig) {
                  bomObj.hidden = false;
                  const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                  _.map(hiddenData, (data) => { data.hidden = false; });
                }
                else {
                  bomObj.hidden = true;
                }
              }
            });
            break;
          }
          case _bomFilters.NONROHSNOAPPROVAL.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                const objModelRefMainCategoryID = bomObj.refMainCategoryID ? bomObj.refMainCategoryID : vm.RoHSMainCategory.NotApplicable;
                if (objModelRefMainCategoryID === vm.RoHSMainCategory.NonRoHS) {
                  const lineApproveActiveAlternatePartObj = _.find(vm.refBomModel, (objItem) => objItem._lineID === bomObj._lineID && (objItem.refMainCategoryID !== null ? objItem.refMainCategoryID : vm.RoHSMainCategory.NotApplicable) !== vm.RoHSMainCategory.NonRoHS && objItem.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING);
                  if (!lineApproveActiveAlternatePartObj) {
                    const hiddenData = _.filter(vm.refBomModel, { 'lineID': bomObj.lineID });
                    _.map(hiddenData, (data) => { data.hidden = false; });
                  } else {
                    bomObj.hidden = true;
                  }
                } else {
                  bomObj.hidden = true;
                }
              }
            });
            break;
          }
          case _bomFilters.NONROHSAPPROVAL.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                const objModelRefMainCategoryID = bomObj.refMainCategoryID ? bomObj.refMainCategoryID : vm.RoHSMainCategory.NotApplicable;
                if (objModelRefMainCategoryID === vm.RoHSMainCategory.NonRoHS) {
                  const lineApproveActiveAlternatePartObj = _.find(vm.refBomModel, (objItem) => objItem._lineID === bomObj._lineID && (objItem.refMainCategoryID !== null ? objItem.refMainCategoryID : vm.RoHSMainCategory.NotApplicable) !== vm.RoHSMainCategory.NonRoHS && objItem.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING);
                  if (lineApproveActiveAlternatePartObj) {
                    const hiddenData = _.filter(vm.refBomModel, { 'lineID': bomObj.lineID });
                    _.map(hiddenData, (data) => { data.hidden = false; });
                  } else {
                    bomObj.hidden = true;
                  }
                } else {
                  bomObj.hidden = true;
                }
              }
            });
            break;
          }
          case _bomFilters.OBSOLETENOAPPROVAL.CODE: {
            vm.refBomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                if (bomObj.isObsolete) {
                  const lineApproveActiveAlternatePartObj = _.find(vm.refBomModel, (objItem) => objItem._lineID === bomObj._lineID && !objItem.isObsolete && objItem.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING);
                  if (!lineApproveActiveAlternatePartObj) {
                    const hiddenData = _.filter(vm.refBomModel, { 'lineID': bomObj.lineID });
                    _.map(hiddenData, (data) => { data.hidden = false; });
                  } else {
                    bomObj.hidden = true;
                  }
                } else {
                  bomObj.hidden = true;
                }
              }
            });
            break;
          }
          case _bomFilters.OBSOLETEAPPROVAL.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                if (bomObj.isObsolete) {
                  const lineApproveActiveAlternatePartObj = _.find(vm.refBomModel, (objItem) => objItem._lineID === bomObj._lineID && !objItem.isObsolete && objItem.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING);
                  if (lineApproveActiveAlternatePartObj) {
                    const hiddenData = _.filter(vm.refBomModel, { 'lineID': bomObj.lineID });
                    _.map(hiddenData, (data) => { data.hidden = false; });
                  } else {
                    bomObj.hidden = true;
                  }
                } else {
                  bomObj.hidden = true;
                }
              }
            });
            break;
          }
          case _bomFilters.MISMATCHEDPIN.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                if (bomObj.mfgPNID && bomObj.componentLead) {
                  if (bomObj.connecterTypeID === vm.CORE_ConnectorType.HEADERBREAKAWAY.ID) {
                    bomObj.hidden = bomObj.componentLead && bomObj.numOfPosition > 0 ? true : false;
                  } else {
                    bomObj.hidden = bomObj.componentLead !== bomObj.numOfPosition ? false : true;
                  }
                  if (!bomObj.hidden) {
                    const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                    _.map(hiddenData, (data) => { data.hidden = false; });
                  }
                  else {
                    bomObj.hidden = true;
                  }
                } else {
                  bomObj.hidden = true;
                }
              }
            });
            break;
          }
          case _bomFilters.NONEACHPART.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                if (bomObj.uom === null || bomObj.uom === undefined) {
                  bomObj.hidden = false;
                }
                else {
                  const partUOM = bomObj.uom;
                  const objUOM = _unitList.find((y) => y.unitName && (partUOM && y.unitName.toUpperCase() === partUOM.toUpperCase()));
                  if (objUOM) {
                    const partUOMype = objUOM.measurementType.id;
                    bomObj.hidden = partUOMype !== -1 ? false : true;
                  }
                }
                if (!bomObj.hidden) {
                  const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                  _.map(hiddenData, (data) => { data.hidden = false; });
                }
                else {
                  bomObj.hidden = true;
                }
              }
            });
            break;
          }
          case _bomFilters.DUPLICATEPID.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                if (bomObj.mfgPNID) {
                  bomObj.hidden = _.filter(vm.bomModel, { 'mfgPNID': bomObj.mfgPNID }).length > 1 ? false : true;
                  if (!bomObj.hidden) {
                    const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                    _.map(hiddenData, (data) => { data.hidden = false; });
                  }
                } else {
                  bomObj.hidden = true;
                }
              }
            });
            break;
          }
          case _bomFilters.TEMPERATUREPARTS.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                if (bomObj.mfgPNID) {
                  bomObj.hidden = (bomObj.isTemperatureSensitive || bomObj.isFunctionalTemperatureSensitive) ? false : true;
                  if (!bomObj.hidden) {
                    const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                    _.map(hiddenData, (data) => { data.hidden = false; });
                  }
                } else {
                  bomObj.hidden = true;
                }
              }
            });
            break;
          }
          case _bomFilters.DRIVETOOLSPARTS.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                if (bomObj.mfgPNID) {
                  bomObj.hidden = bomObj.driverToolRequired ? false : true;
                  if (!bomObj.hidden) {
                    const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                    _.map(hiddenData, (data) => { data.hidden = false; });
                  }
                } else {
                  bomObj.hidden = true;
                }
              }
            });
            break;
          }
          case _bomFilters.DNPQPALINES.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                if (bomObj.dnpQty || bomObj.dnpDesig || bomObj.isBuyDNPQty === _buyDNPQTYList[1].value) {
                  bomObj.hidden = false;
                  const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                  _.map(hiddenData, (data) => { data.hidden = false; });
                } else {
                  bomObj.hidden = true;
                }
              }
            });
            break;
          }
          case _bomFilters.UNLOCKPART.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                if (bomObj.mfgPNID) {
                  bomObj.hidden = bomObj.isUnlockApprovedPart ? false : true;
                  if (!bomObj.hidden) {
                    const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                    _.map(hiddenData, (data) => { data.hidden = false; });
                  }
                } else {
                  bomObj.hidden = true;
                }
              }
            });
            break;
          }
          case _bomFilters.UNKNOWNPART.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                const isInValid = (bomObj.mfgPN && bomObj.mfgPNID && bomObj.isMFGGoodPart && parseInt(bomObj.isMFGGoodPart) === PartCorrectList.UnknownPart || bomObj.distPN && (bomObj.distMfgPNID || bomObj.distMfgPNID === 0) && (bomObj.isDistGoodPart && parseInt(bomObj.isDistGoodPart) === PartCorrectList.UnknownPart));
                bomObj.hidden = !isInValid;
                if (isInValid) {
                  const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                  _.map(hiddenData, (data) => { data.hidden = false; });
                }
              }
            });
            break;
          }
          case _bomFilters.KITALLOCNOTREQUIRED.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                if (bomObj.isNotRequiredKitAllocation) {
                  bomObj.hidden = false;
                  const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                  _.map(hiddenData, (data) => { data.hidden = false; });
                } else {
                  bomObj.hidden = true;
                }
              }
            });
            break;
          }
          case _bomFilters.SUPPLIERTOBUY.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                if (bomObj.isSupplierToBuy) {
                  bomObj.hidden = false;
                  const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                  _.map(hiddenData, (data) => { data.hidden = false; });
                } else {
                  bomObj.hidden = true;
                }
              }
            });
            break;
          }
          case _bomFilters.MISMATCHPITCH.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                if (!bomObj.mismatchPitchStep) {
                  bomObj.hidden = false;
                  const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                  _.map(hiddenData, (data) => { data.hidden = false; });
                } else {
                  bomObj.hidden = true;
                }
              }
            });
            break;
          }
          case _bomFilters.CUSTOMERCONSIGNED.CODE: {
            vm.bomModel.forEach((bomObj) => {
              if (bomObj.hidden !== false) {
                if ((bomObj.qpa && !bomObj.isPurchase) || (bomObj.dnpQty && bomObj.isBuyDNPQty === _buyDNPQTYList[2].value)) {
                  bomObj.hidden = false;
                  const hiddenData = _.filter(vm.bomModel, { 'lineID': bomObj.lineID });
                  _.map(hiddenData, (data) => { data.hidden = false; });
                } else {
                  bomObj.hidden = true;
                }
              }
            });
            break;
          }
        }
      }

      // Set filter count on load data
      function setFilterCount() {
        _.each(vm.filters, (value) => {
          var bomModelClone = null;
          bomModelClone = angular.copy(vm.copyRefBomModel) || [];
          switch (value.filterCode) {
            case _bomFilters.ALL.CODE: {
              value.filterCount = vm.copyRefBomModel ? vm.copyRefBomModel.length : 0;
              value.filternamtewithCount = value.displayName;
              break;
            }
            case _bomFilters.QPAREFDES.CODE: {
              const qpaValidMatchList = [true, 1, null, undefined];
              bomModelClone.forEach((bomObj) => {
                if (qpaValidMatchList.indexOf(bomObj.qpaDesignatorStep) !== -1) {
                  bomObj.hidden = true;
                } else {
                  bomObj.hidden = false;
                }
              });
              bomModelClone = _.filter(bomModelClone, (x) => !x.hidden);
              value.filterCount = _.uniqBy(bomModelClone, '_lineID').length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.INTERNALPN.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  const isInValid = isBOMObjInValid(partInvalidMatchList, bomObj);
                  if (!isInValid) {
                    bomObj.hidden = true;
                  } else {
                    bomObj.hidden = false;
                  }
                }
              });
              value.filterCount = _.filter(bomModelClone, (x) => !x.hidden).length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.NONROHS.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  const objModelRefMainCategoryID = bomObj.refMainCategoryID !== null ? bomObj.refMainCategoryID : vm.RoHSMainCategory.NotApplicable;
                  bomObj.hidden = objModelRefMainCategoryID !== vm.RoHSMainCategory.NonRoHS ? true : false;
                }
              });
              value.filterCount = _.filter(bomModelClone, (x) => !x.hidden).length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.OBSOLETE.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  bomObj.hidden = !bomObj.isObsolete;
                }
              });
              value.filterCount = _.filter(bomModelClone, (x) => !x.hidden).length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.BADPART.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  const isInValid = (bomObj.mfgCode && bomObj.mfgCodeID === null) || (bomObj.distributor && bomObj.distMfgCodeID === null) || (bomObj.mfgPN && (bomObj.mfgPNID === null || bomObj.isMFGGoodPart === PartCorrectList.IncorrectPart)) || (bomObj.distPN && (bomObj.distMfgPNID === null || bomObj.isDistGoodPart === PartCorrectList.IncorrectPart));
                  bomObj.hidden = !isInValid;
                }
              });

              value.filterCount = _.filter(bomModelClone, (x) => !x.hidden).length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.CUSTOMERAPPROVAL.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  bomObj.hidden = (bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED && bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.NONE) ? false : true;
                }
              });
              value.filterCount = _.filter(bomModelClone, (x) => x.hidden).length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.SUGGESTEDGOODPART.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  if (bomObj.badMfgPN) {
                    bomObj.hidden = false;
                  }
                  else {
                    bomObj.hidden = true;
                  }
                }
              });
              value.filterCount = _.filter(bomModelClone, (x) => !x.hidden).length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.CUSTOMERAPPROVALPENDDING.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  bomObj.hidden = bomObj.mfgPNID !== null && bomObj.mfgPNID !== undefined && bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING ? false : true;
                }
              });
              value.filterCount = _.filter(bomModelClone, (x) => !x.hidden).length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.PARTWITHISSUES.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  if (bomObj && !bomObj.mfgPNID || (bomObj.description !== null && bomObj.description !== '') || (bomObj.descriptionAlternate !== null && bomObj.descriptionAlternate !== '') || !bomObj.qpa || !bomObj.refDesig) {
                    bomObj.hidden = false;
                  } else {
                    bomObj.hidden = true;
                  }
                }
              });
              value.filterCount = _.filter(bomModelClone, (x) => !x.hidden).length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.NONROHSNOAPPROVAL.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  const objModelRefMainCategoryID = bomObj.refMainCategoryID !== null ? bomObj.refMainCategoryID : vm.RoHSMainCategory.NotApplicable;
                  if (objModelRefMainCategoryID === vm.RoHSMainCategory.NonRoHS) {
                    const lineApproveActiveAlternatePartObj = _.find(bomModelClone, (objItem) => objItem._lineID === bomObj._lineID && (objItem.refMainCategoryID !== null ? objItem.refMainCategoryID : vm.RoHSMainCategory.NotApplicable) !== vm.RoHSMainCategory.NonRoHS && (objItem.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED || objItem.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.NONE));
                    if (!lineApproveActiveAlternatePartObj) {
                      bomObj.hidden = true;
                    }
                  }
                }
              });
              value.filterCount = _.filter(bomModelClone, (x) => x.hidden).length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.NONROHSAPPROVAL.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  const objModelRefMainCategoryID = bomObj.refMainCategoryID !== null ? bomObj.refMainCategoryID : vm.RoHSMainCategory.NotApplicable;
                  if (objModelRefMainCategoryID === vm.RoHSMainCategory.NonRoHS) {
                    const lineApproveActiveAlternatePartObj = _.find(bomModelClone, (objItem) => objItem._lineID === bomObj._lineID && (objItem.refMainCategoryID !== null ? objItem.refMainCategoryID : vm.RoHSMainCategory.NotApplicable) !== vm.RoHSMainCategory.NonRoHS && objItem.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING);
                    if (lineApproveActiveAlternatePartObj) {
                      bomObj.hidden = true;
                    }
                  }
                }
              });
              value.filterCount = _.filter(bomModelClone, (x) => x.hidden).length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.OBSOLETENOAPPROVAL.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  if (bomObj.isObsolete) {
                    const lineApproveActiveAlternatePartObj = _.find(bomModelClone, (objItem) => objItem._lineID === bomObj._lineID && !objItem.isObsolete && (objItem.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED || objItem.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.NONE));
                    if (!lineApproveActiveAlternatePartObj) {
                      bomObj.hidden = true;
                    }
                  }
                }
              });

              value.filterCount = _.filter(bomModelClone, (x) => x.hidden).length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.OBSOLETEAPPROVAL.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  if (bomObj.isObsolete) {
                    const lineApproveActiveAlternatePartObj = _.find(bomModelClone, (objItem) => objItem._lineID === bomObj._lineID && !objItem.isObsolete && objItem.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING);
                    if (lineApproveActiveAlternatePartObj) {
                      bomObj.hidden = true;
                    }
                  }
                }
              });

              value.filterCount = _.filter(bomModelClone, (x) => x.hidden).length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.MISMATCHEDPIN.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  if (bomObj.hidden !== false && bomObj.mfgPNID && bomObj.componentLead) {
                    if (bomObj.connecterTypeID === vm.CORE_ConnectorType.HEADERBREAKAWAY.ID) {
                      bomObj.hidden = bomObj.componentLead && bomObj.numOfPosition > 0 ? true : false;
                    } else {
                      bomObj.hidden = bomObj.componentLead !== bomObj.numOfPosition ? false : true;
                    }
                  } else {
                    bomObj.hidden = true;
                  }
                }
              });
              value.filterCount = _.filter(bomModelClone, (x) => !x.hidden).length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.NONEACHPART.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  if (bomObj.mfgPNID && bomObj.uom) {
                    const partUOM = bomObj.uom;
                    if (_unitList.find((y) => y.unitName && partUOM && y.unitName.toUpperCase() === partUOM.toUpperCase())) {
                      const partUOMype = _unitList.find((y) => y.unitName && partUOM && y.unitName.toUpperCase() === partUOM.toUpperCase()).measurementType.id;
                      bomObj.hidden = partUOMype !== -1 ? false : true;
                    }
                  }
                }
              });
              value.filterCount = _.filter(bomModelClone, (x) => !x.hidden).length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.DUPLICATEPID.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  if (bomObj.mfgPNID !== null && bomObj.mfgPNID !== undefined) {
                    bomObj.hidden = _.filter(vm.copyRefBomModel, { 'mfgPNID': bomObj.mfgPNID }).length > 1 ? false : true;
                  }
                  else {
                    bomObj.hidden = true;
                  }
                }
              });
              bomModelClone = _.filter(bomModelClone, (x) => !x.hidden);
              value.filterCount = _.uniqBy(bomModelClone, '_lineID').length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.TEMPERATUREPARTS.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  bomObj.hidden = (bomObj.isTemperatureSensitive || bomObj.isFunctionalTemperatureSensitive) ? false : true;
                }
              });
              bomModelClone = _.filter(bomModelClone, (x) => !x.hidden);
              value.filterCount = _.filter(bomModelClone, (obj) => { if (obj.isTemperatureSensitive || obj.isFunctionalTemperatureSensitive) { return obj; } }).length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.DRIVETOOLSPARTS.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  bomObj.hidden = bomObj.driverToolRequired ? false : true;
                }
              });
              bomModelClone = _.filter(bomModelClone, (x) => !x.hidden);
              value.filterCount = _.filter(bomModelClone, (obj) => { if (obj.driverToolRequired) { return obj; } }).length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.DNPQPALINES.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  if (bomObj.dnpQty || bomObj.dnpDesig || bomObj.isBuyDNPQty === _buyDNPQTYList[1].value) {
                    bomObj.hidden = false;
                  } else {
                    bomObj.hidden = true;
                  }
                }
              });
              bomModelClone = _.filter(bomModelClone, (x) => !x.hidden);
              value.filterCount = _.uniqBy(bomModelClone, '_lineID').length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.UNLOCKPART.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  bomObj.hidden = bomObj.isUnlockApprovedPart ? false : true;
                }
              });
              bomModelClone = _.filter(bomModelClone, (x) => !x.hidden);
              value.filterCount = _.filter(bomModelClone, (obj) => { if (obj.isUnlockApprovedPart) { return obj; } }).length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.UNKNOWNPART.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  const isInValid = (bomObj.mfgPN && bomObj.mfgPNID !== null && bomObj.isMFGGoodPart === PartCorrectList.UnknownPart || bomObj.distPN && bomObj.distMfgPNID !== null && bomObj.isDistGoodPart === PartCorrectList.UnknownPart);
                  bomObj.hidden = !isInValid;
                }
              });
              value.filterCount = _.filter(bomModelClone, (x) => !x.hidden).length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.KITALLOCNOTREQUIRED.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  if (bomObj.isNotRequiredKitAllocation) {
                    bomObj.hidden = false;
                  } else {
                    bomObj.hidden = true;
                  }
                }
              });
              bomModelClone = _.filter(bomModelClone, (x) => !x.hidden);
              value.filterCount = _.uniqBy(bomModelClone, '_lineID').length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.SUPPLIERTOBUY.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  if (bomObj.isSupplierToBuy) {
                    bomObj.hidden = false;
                  } else {
                    bomObj.hidden = true;
                  }
                }
              });
              bomModelClone = _.filter(bomModelClone, (x) => !x.hidden);
              value.filterCount = _.uniqBy(bomModelClone, '_lineID').length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.MISMATCHPITCH.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  if (!bomObj.mismatchPitchStep) {
                    bomObj.hidden = false;
                  } else {
                    bomObj.hidden = true;
                  }
                }
              });
              bomModelClone = _.filter(bomModelClone, (x) => !x.hidden);
              value.filterCount = _.uniqBy(bomModelClone, '_lineID').length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
            case _bomFilters.CUSTOMERCONSIGNED.CODE: {
              bomModelClone.forEach((bomObj) => {
                if (!bomObj.hidden) {
                  if ((bomObj.qpa && !bomObj.isPurchase) || (bomObj.dnpQty && bomObj.isBuyDNPQty === _buyDNPQTYList[2].value)) {
                    bomObj.hidden = false;
                  } else {
                    bomObj.hidden = true;
                  }
                }
              });
              bomModelClone = _.filter(bomModelClone, (x) => !x.hidden);
              value.filterCount = _.uniqBy(bomModelClone, '_lineID').length;
              value.filternamtewithCount = value.displayName + ' (' + value.filterCount + ')';
              break;
            }
          }
        });
        $timeout(() => {
          vm.filters = _.filter(vm.filters, (opt) => opt.filterCode === vm.allFilterID || opt.filterCount > 0);
          if (BOMFactory.bomSelectedFilter !== null && BOMFactory.bomSelectedFilter !== vm.allFilterID) {
            const selectedFilter = _.find(vm.filters, { filterCode: BOMFactory.bomSelectedFilter });
            if (selectedFilter.filterCount > 0) {
              vm.autoCompleteFilter.keyColumnId = BOMFactory.bomSelectedFilter;
              getDataForFilter();
            }
            BOMFactory.bomSelectedFilter = null;
          }
        });
      }
      // Check BOM line Object is valid or invalid to approved part
      function isBOMObjInValid(validationArr, bomObj) {
        if (bomObj) {
          return ((validationArr.indexOf(bomObj.mfgVerificationStep) !== -1 && _mfgVerificationError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.mfgDistMappingStep) !== -1 && _mfgDistMappingError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.obsoletePartStep) !== -1 && bomObj.isObsoleteLine && !_obsoletePartError.isAllowToEngrApproved) ||
            (bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) ||
            (validationArr.indexOf(bomObj.lineMergeStep) !== -1 && !_lineMergeError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.nonRohsStep) !== -1 && !_rohsStatusError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.epoxyStep) !== -1 && !_epoxyError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.mfgCodeStep) !== -1 && !_mfgInvalidError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.mfgPNStep) !== -1 && !_mfgPNInvalidError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.distVerificationStep) !== -1 && !_distVerificationError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.getMFGPNStep) !== -1 && !_getMFGPNError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.distCodeStep) !== -1 && !_distInvalidError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.distPNStep) !== -1 && !_distPNInvalidError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.duplicateMPNInSameLineStep) !== -1 && !_duplicateMPNInSameLineError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.mismatchMountingTypeStep) !== -1 && !bomObj.approvedMountingType && !_mismatchMountingTypeError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.invalidConnectorTypeStep) !== -1 && !_invalidConnectorTypeError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.mismatchFunctionalCategoryStep) !== -1 && !bomObj.approvedMountingType && !_mismatchFunctionalCategoryError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.mismatchCustomPartStep) !== -1 && !_mismatchCustomPartError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.restrictUseWithPermissionStep) !== -1 && !_restrictUseWithPermissionError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.restrictUseExcludingAliasStep) !== -1 && !_restrictUseExcludingAliasError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.restrictUseExcludingAliasWithPermissionStep) !== -1 && !_restrictUseExcludingAliasWithPermissionError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.restrictUsePermanentlyStep) !== -1 && !_restrictUsePermanentlyError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.pickupPadRequiredStep) !== -1 && !_pickupPadRequiredError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.matingPartRquiredStep) !== -1 && !_matingPartRequiredError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.driverToolsRequiredStep) !== -1 && !_driverToolsRequiredError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.functionalTestingRequiredStep) !== -1 && !_functionalTestingRequiredError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.exportControlledStep) !== -1 && !_exportControlledError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.uomMismatchedStep) !== -1 && !_uomMismatchedError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.programingRequiredStep) !== -1 && !_programingRequiredError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.mismatchColorStep) !== -1 && !_mismatchColorError.isAllowToEngrApproved) ||
            (validationArr.indexOf(!bomObj.restrictUseInBOMStep) !== -1 && !_restrictUseInBOMError.isAllowToEngrApproved) ||
            (validationArr.indexOf(!bomObj.restrictUseInBOMWithPermissionStep) !== -1 && !_restrictUseInBOMWithPermissionError.isAllowToEngrApproved) ||
            (validationArr.indexOf(!bomObj.restrictUseInBOMExcludingAliasStep) !== -1 && !_restrictUseInBOMExcludingAliasError.isAllowToEngrApproved) ||
            (validationArr.indexOf(!bomObj.restrictUseInBOMExcludingAliasWithPermissionStep) !== -1 && !_restrictUseInBOMExcludingAliasWithPermissionError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.unknownPartStep) !== -1 && !_unknownPartError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.defaultInvalidMFRStep) !== -1 && !_defaultInvalidMFRError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.partPinIsLessthenBOMPinStep) !== -1 && !_partPinIsLessthenBOMPinError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.tbdPartStep) !== -1 && !_tbdPartError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.mismatchNumberOfRowsStep) !== -1 && !_mismatchNumberOfRowsError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.mismatchRequiredProgrammingStep) !== -1 && !_mismatchRequiredProgrammingError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.mismatchProgrammingStatusStep) !== -1 && !_mismatchProgrammingStatusError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.mappingPartProgramStep) !== -1 && !_mappingPartProgramError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.mismatchCustpartRevStep) !== -1 && !_mismatchCustpartRevError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.mismatchCPNandCustpartRevStep) !== -1 && !_mismatchCPNandCustpartRevError.isAllowToEngrApproved));
        }
        else {
          return true;
        }
      }
      // Check BOM line have CPN is valid or invalid to approved
      function isBOMObjInValidForCPN(validationArr, bomObj) {
        if (bomObj) {
          return validationArr.indexOf(bomObj.restrictCPNUseInBOMStep) !== -1 && !_restrictCPNUseInBOMError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.restrictCPNUsePermanentlyStep) !== -1 && !_restrictCPNUsePermanentlyError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.restrictCPNUseWithPermissionStep) !== -1 && !_restrictCPNUseWithPermissionError.isAllowToEngrApproved;
        }
        else {
          return true;
        }
      }

      // [E] Validation steps
      // Generate description from error message
      function generateDescription(bomObj, errorObj) {
        if (!errorObj || !errorObj.description) {
          return '';
        }

        let str = errorObj.errorCode + ': ' + errorObj.description;
        errorObj.description.replace(/(<%.*?%>)/g, (match) => {
          const obj = vm.sourceHeader.find((x) => x.header === match.replace('<% ', '').replace(' %>', ''));
          if (obj) {
            str = str.replace(match, (bomObj[obj.field] || ''));
          }
        });
        return str;
      }

      // Get description for line item to display into Flextron Comment
      function getDescriptionForLine(bomObj, isAlternate) {
        return Array.from(
          new Set([
            isAlternate ? null : bomObj.qpaDesignatorStepError,
            isAlternate ? null : bomObj.lineMergeStepError,
            isAlternate ? null : bomObj.customerApprovalForQPAREFDESError,
            isAlternate ? null : bomObj.customerApprovalForBuyError,
            isAlternate ? null : bomObj.customerApprovalForPopulateError,
            isAlternate ? null : bomObj.dnpQPARefDesError,
            isAlternate ? null : bomObj.customerApprovalForDNPQPAREFDESError,
            isAlternate ? null : bomObj.customerApprovalForDNPBuyError,
            bomObj.mfgCodeStepError,
            bomObj.mfgVerificationStepError,
            bomObj.distCodeStepError,
            bomObj.distVerificationStepError,
            bomObj.getMFGPNStepError,
            bomObj.obsoletePartStepError,
            bomObj.mfgGoodPartMappingStepError,
            bomObj.distGoodPartMappingStepError,
            bomObj.suggestedGoodPartError,
            bomObj.suggestedGoodDistPartError,
            bomObj.mfgDistMappingStepError,
            bomObj.mfgPNStepError,
            bomObj.distPNStepError,
            (bomObj.mfgPNID && (bomObj.restrictUsePermanentlyStep || bomObj.restrictUseExcludingAliasStep) && bomObj.isMFGGoodPart && parseInt(bomObj.isMFGGoodPart) === PartCorrectList.CorrectPart || bomObj.distMfgPNID && bomObj.isDistGoodPart && parseInt(bomObj.isDistGoodPart) === PartCorrectList.CorrectPart) ? bomObj.customerApprovalStepError : null,
            bomObj.nonRohsStepError,
            bomObj.epoxyStepError,
            bomObj.mismatchNumberOfRowsError,
            bomObj.partPinIsLessthenBOMPinError,
            bomObj.tbdPartError,
            bomObj.invalidConnectorTypeError,
            bomObj.duplicateMPNInSameLineError,
            bomObj.approvedMountingType ? null : bomObj.mismatchMountingTypeError,
            bomObj.mismatchRequiredProgrammingError,
            bomObj.mappingPartProgramError,
            bomObj.approvedMountingType ? null : bomObj.mismatchFunctionalCategoryError,
            bomObj.restrictUseWithPermissionError,
            bomObj.restrictUsePermanentlyError,
            bomObj.duplicateCPNError,
            bomObj.restrictCPNUseWithPermissionError,
            bomObj.restrictCPNUsePermanentlyError,
            bomObj.restrictCPNUseInBOMError,
            bomObj.pickupPadRequiredError,
            bomObj.matingPartRequiredError,
            bomObj.functionalTestingRequiredError,
            bomObj.exportControlledError,
            bomObj.uomMismatchedError,
            bomObj.programingRequiredError,
            bomObj.mismatchColorError,
            bomObj.driverToolsRequiredError,
            bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING && bomObj.acquisitionDetail ? bomObj.acquisitionDetail : null,
            bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING && bomObj.distAcquisitionDetail ? bomObj.distAcquisitionDetail : null,
            bomObj.restrictUseInBOMError,
            bomObj.restrictUseInBOMWithPermissionError,
            bomObj.restrictUseExcludingAliasError,
            bomObj.restrictUseExcludingAliasWithPermissionError,
            bomObj.restrictUseInBOMExcludingAliasError,
            bomObj.restrictUseInBOMExcludingAliasWithPermissionError,
            bomObj.unknownPartError,
            bomObj.defaultInvalidMFRError,
            bomObj.mismatchCustomPartError,
            bomObj.mismatchProgrammingStatusError,
            bomObj.MPNNotAddedinCPNError,
            bomObj.mismatchCustpartRevError,
            bomObj.mismatchCPNandCustpartRevError
          ].filter((item) => item !== null && item !== ''))).join('\n');
      }

      // Get Line description for line item to display into Flextron Comment
      function getDescriptionForMainLine(bomObj) {
        return Array.from(
          new Set([
            bomObj.qpaDesignatorStepError,
            bomObj.lineMergeStepError,
            bomObj.customerApprovalForQPAREFDESError,
            bomObj.customerApprovalForBuyError,
            bomObj.customerApprovalForPopulateError,
            bomObj.dnpQPARefDesError,
            bomObj.dnpInvalidREFDESError,
            bomObj.customerApprovalForDNPQPAREFDESError,
            bomObj.customerApprovalForDNPBuyError
          ].filter((item) => item !== null && item !== ''))).join('\n');
      }

      function getComponentVerification(model) {
        vm.partsList = _.clone(model);
        vm.APIVerifiedFlag = vm.pricingStatus.PENDING;
        // Clear all existing errors from MongoDB
        // let partID = model.partID;
        if (isStopAPIVerification) {
          isStopAPIVerification = false;
        }
        vm.isopen = false;
        MasterFactory.getSelectedGlobalSettingKeyValues().query({ allKeys: [CONFIGURATION.SETTING.DKVersion] }).$promise.then((response) => {
          if (response.data) {
            _.each(response.data, (item) => {
              switch (item.key) {
                case CONFIGURATION.SETTING.DKVersion:
                  _DkVersion = item.values;
                  break;
              }
            });
            model.DKVersion = _DkVersion;
            _.each(model.parts, (item) => {
              item.type = PRICING.APP_DK_TYPE.FJTCleanBOMV3;
            });
            vm.remainTime = seconds_to_days_hours_mins_secs_str(model.parts.length * CORE.SUPPLIER_DEFAULT_TIME);
            return ImportBOMFactory.getComponentVerification().save(model).$promise.then((response) => {
              if (isStopAPIVerification && response && response.data && parseInt(response.data) !== vm.pricingStatus.PENDING) {
                isStopAPIVerification = false;
                return;
              }
              if (response.status === 'FAILED') {
                vm.APIVerifiedFlag = vm.pricingStatus.SUCCESS;
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SOMTHING_WRONG);
                const alertModel = {
                  messageContent: messageContent
                };
                if (!response.errors) {
                  DialogFactory.messageAlertDialog(alertModel);
                }
              }
              if (response && response.data === vm.pricingStatus.SUCCESS) {
                vm.APIVerifiedFlag = vm.pricingStatus.SUCCESS;
              }
              else if (response && response.data === vm.pricingStatus.ERROR) {
                vm.APIVerifiedFlag = vm.pricingStatus.ERROR;
                openErrorListPopup();
              }
            }).catch((error) => {
              vm.APIVerifiedFlag = vm.pricingStatus.SUCCESS;
              BaseService.getErrorLog(error);
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      // Socket io connection
      function BOMconnectSocket() {
        socketConnectionService.on(PRICING.EventName.sendBOMStatusVerification, socketStatusListener);
        socketConnectionService.on(PRICING.EventName.sendBOMStatusProgressbarUpdate, sendBOMStatusProgressbarUpdate);
        socketConnectionService.on(PRICING.EventName.sendBOMStartStopActivity, startStopActivityListener);
        socketConnectionService.on(PRICING.EventName.deleteBOMDetails, deleteBOMDetailsListener);
        socketConnectionService.on(PRICING.EventName.updateBOMCPNDetails, updateBOMCPNDetailsListener);
        socketConnectionService.on(PRICING.EventName.sendPartUpdatedNotification, partUpdatedNotificationListener);
        socketConnectionService.on(PRICING.EventName.sendBOMSpecificPartRequirementChanged, specificPartRequirementChangedListener);
      }
      BOMconnectSocket();

      // Socket io reconnect method
      socketConnectionService.on('reconnect', () => {
        BOMremoveSocketListener();
        BOMconnectSocket();
      });

      // Socket io listener remove
      function BOMremoveSocketListener() {
        socketConnectionService.removeListener(PRICING.EventName.sendBOMStatusVerification, socketStatusListener);
        socketConnectionService.removeListener(PRICING.EventName.sendBOMStartStopActivity, startStopActivityListener);
        socketConnectionService.removeListener(PRICING.EventName.deleteBOMDetails, deleteBOMDetailsListener);
        socketConnectionService.removeListener(PRICING.EventName.updateBOMCPNDetails, updateBOMCPNDetailsListener);
        socketConnectionService.removeListener(PRICING.EventName.sendPartUpdatedNotification, partUpdatedNotificationListener);
        socketConnectionService.removeListener(PRICING.EventName.sendBOMStatusProgressbarUpdate, sendBOMStatusProgressbarUpdate);
        socketConnectionService.removeListener(PRICING.EventName.sendBOMSpecificPartRequirementChanged, specificPartRequirementChangedListener);
      }

      // BOM Verification Status listener
      function socketStatusListener(message) {
        if (!vm.socketmsgwasOpened) {
          vm.socketmsgwasOpened = true;
          if (message && message.partID && parseInt(message.partID) === parseInt(_partID)) {
            $timeout(socketCheckStatus(message));
          }
        } else {
          vm.socketmsgwasOpened = false;
        }
      };

      // BOM Verification Status pop-up open
      function socketCheckStatus(message) {
        if (!vm.isopen) {
          vm.isopen = true;
          responseBOMUpdatePart(message);
        }
      }
      // BOM Verification Status pop-up open
      function responseBOMUpdatePart(message) {
        if (isStopAPIVerification) {
          isStopAPIVerification = false;
          vm.socketmsgwasOpened = false;
          vm.isopen = false;
          return;
        }
        if (message && message.status) {
          vm.errorList = null;
          vm.APIVerifiedFlag = vm.pricingStatus.SUCCESS;
          if (vm.partsList && vm.partsList.parts) {
            const partList = _.map(vm.partsList.parts, 'partNumber');
            ComponentFactory.getNoneMountComponent().query({ components: partList }).$promise.then((complist) => {
              vm.socketmsgwasOpened = false;
              if (complist.data && complist.data.componentList.length > 0) {
                const data = _.clone(partList);
                if (!vm.mountpopup) {
                  vm.mountpopup = true;
                  DialogFactory.dialogService(
                    RFQTRANSACTION.RFQ_API_MOUNTPART_CONTROLLER,
                    RFQTRANSACTION.RFQ_API_MOUNTPART_VIEW,
                    _dummyEvent,
                    data).then(() => {
                      vm.mountpopup = false;
                      vm.socketmsgwasOpened = false;
                      vm.isopen = false;
                      vm.componentVerification();
                    }, () => {
                      vm.mountpopup = false;
                      vm.socketmsgwasOpened = false;
                      vm.isopen = false;
                      vm.componentVerification();
                    });
                }
              }
              else {
                vm.socketmsgwasOpened = false;
                vm.isopen = false;
                vm.componentVerification();
              }
            });
          }
          else {
            vm.socketmsgwasOpened = false;
            vm.isopen = false;
            vm.componentVerification();
          }
        }
        else {
          vm.APIVerifiedFlag = vm.pricingStatus.ERROR;
          const objApi = {
            ispartMaster: false,
            partID: _partID
          };
          vm.cgBusyLoading = APIVerificationErrorPopupFactory.getAPIVerificationErrors().query({ objApiError: objApi }).$promise.then((response) => {
            vm.socketmsgwasOpened = false;
            vm.isopen = false;
            if (response && response.data && response.data.bomError && response.data.bomError.length > 0) {
              vm.issueCount = response.data.bomError.length;
              openErrorListPopup();
            }
            else {
              vm.issueCount = 0;
              vm.componentVerification();
            }
          }).catch((error) => {
            vm.socketmsgwasOpened = false;
            vm.isopen = false;
            return BaseService.getErrorLog(error);
          });
        }
      }
      let isactivityAlreadyOpen = false;
      // Start and Stop activity Pop-up
      function startStopActivityReceive(message, isPartUpdate) {
        var textMessageContent = '';
        if (isPartUpdate) {
          const updatedMfgPN = (_.join(_.map(message.updatedParts, 'mfgPN'), ', '));
          if (message.isRestrictionRemoved) {
            textMessageContent = stringFormat(RFQTRANSACTION.BOM.PART_UNRESTRICTED_NOTIFICATION_TEXT, message.messageText, updatedMfgPN, message.userName);
          }
          else {
            textMessageContent = stringFormat(RFQTRANSACTION.BOM.PART_UPDATED_NOTIFICATION_TEXT, updatedMfgPN, message.messageText, message.userName);
          }
        }
        else {
          textMessageContent = stringFormat(RFQTRANSACTION.BOM.START_STOP_ACTIVITY_TEXT, message.isActivityStart ? 'Started' : 'Stopped', message.userName);
        }
        if (!isactivityAlreadyOpen) {
          isactivityAlreadyOpen = true;
          if (message.loginUserId && parseInt(message.loginUserId) === parseInt(vm.loginUserId)) {
            vm.socketmsgwasOpened = false;
            commonActivityFunction();
          } else {
            const model = {
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: textMessageContent,
              multiple: true
            };
            DialogFactory.alertDialog(model, () => {
              vm.socketmsgwasOpened = false;
              commonActivityFunction();
            });
          }
        } else {
          vm.socketmsgwasOpened = false;
        }
      }
      const commonActivityFunction = () => {
        isactivityAlreadyOpen = false;
        if (!vm.isBOMChanged) {
          vm.isNoDataFound = true;
          vm.isBOMChanged = BOMFactory.isBOMChanged = false;
          BaseService.currentPageFlagForm = [];
          $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion);
          $scope.$parent.active();
          $timeout(handsontableresize());
        }
        else {
          vm.draftSave(false, false, true);
        }
      };
      // Start and Stop activity Socket Listeners
      function startStopActivityListener(message) {
        if (!vm.socketmsgwasOpened) {
          vm.socketmsgwasOpened = true;
          if (message && message.partID && parseInt(message.partID) === parseInt(_partID) && !vm.isStartAndStopRequestFromThisTab) {//&& vm.loginUserId != message.loginUserId
            vm.isStartAndStopRequestFromThisTab = false;
            $timeout(startStopActivityReceive(message, false));
          } else {
            vm.socketmsgwasOpened = false;
          }
        }
      }
      // Delete BOM listeners
      function deleteBOMDetailsListener(message) {
        if (!vm.socketmsgwasOpened) {
          vm.socketmsgwasOpened = true;
          // console.log('delete req', message);
          if (message && message.partID && parseInt(message.partID) === parseInt(_partID) && !vm.DeletedFormThisTab) {
            const textMessageContent = stringFormat(RFQTRANSACTION.BOM.BOM_DELETE_TEXT, message.userName);

            const model = {
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: textMessageContent,
              multiple: true
            };
            DialogFactory.alertDialog(model, () => {
              vm.socketmsgwasOpened = false;
              vm.isNoDataFound = true;
              vm.isBOMChanged = BOMFactory.isBOMChanged = false;
              BaseService.currentPageFlagForm = [];
              $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion);
              $scope.$parent.active();
            });
          } else {
            vm.socketmsgwasOpened = false;
            vm.isNoDataFound = true;
            vm.isBOMChanged = BOMFactory.isBOMChanged = false;
            BaseService.currentPageFlagForm = [];
            $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion);
            $scope.$parent.active();
          }
        }
      }
      // Update BOM CPN part details update listeners
      function updateBOMCPNDetailsListener(message) {
        if (!vm.socketmsgwasOpened) {
          vm.socketmsgwasOpened = true;
          if (message && (message.partID && parseInt(message.partID) === parseInt(_partID))) {
            const textMessageContent = stringFormat('Current BOM have CPN part(s) changed by {0}. Please refresh the BOM.', message.userName);
            const model = {
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: textMessageContent,
              multiple: true
            };
            DialogFactory.alertDialog(model, () => {
              vm.socketmsgwasOpened = false;
              if (!vm.isBOMChanged) {
                vm.isNoDataFound = true;
                vm.isBOMChanged = BOMFactory.isBOMChanged = false;
                BaseService.currentPageFlagForm = [];
                $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion);
                $scope.$parent.active();
              }
            });
          }
          else {
            vm.socketmsgwasOpened = false;
          }
        }
      }
      //  Part Attribute changes Listeners
      function partUpdatedNotificationListener(message) {
        if (!vm.socketmsgwasOpened) {
          vm.socketmsgwasOpened = true;
          if (!vm.partUpdatefromThisTab) {
            if (message && message.data && message.data.length > 0) {
              const resultPart = _.find(message.data, (res) => parseInt(res.id) === parseInt(_partID));
              if (resultPart &&
                ((resultPart.partidRfqLineitemsAlternatepart &&
                  resultPart.partidRfqLineitemsAlternatepart.length > 0) ||
                  (resultPart.rfqLineitems &&
                    resultPart.rfqLineitems.length > 0)
                )) {
                const updatedParts = [];
                _.each(resultPart.partidRfqLineitemsAlternatepart, (item) => {
                  updatedParts.push({ mfgPN: item.mfgComponent.mfgPN });
                });
                _.each(resultPart.rfqLineitems, (item) => {
                  updatedParts.push({ mfgPN: item.custPNIDcomponent.mfgPN });
                });
                if (updatedParts && updatedParts.length > 0) {
                  const messageObj = {};
                  messageObj.updatedParts = updatedParts;
                  messageObj.messageText = (message.messageText ? message.messageText : '');
                  messageObj.isRestrictionRemoved = (message.isRestrictionRemoved ? message.isRestrictionRemoved : false);
                  messageObj.bomLock = (message.bomLock ? message.bomLock : false);
                  messageObj.userName = (message.userName ? message.userName : '');
                  $timeout(
                    startStopActivityReceive(messageObj, true)
                  );
                } else {
                  vm.socketmsgwasOpened = false;
                }
              }
            }
            else if (message && parseInt(message.bomPartID) === _partID && Object.prototype.hasOwnProperty.call(message, 'bomLock')) {
              const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_LOCKED_FROM_PART_MASTER);
              messgaeContent.message = stringFormat(messgaeContent.message, message.bomLock ? 'Locked' : 'Unlocked', message.userName);
              const model = {
                messageContent: messgaeContent
              };
              DialogFactory.messageAlertDialog(model, () => {
                vm.socketmsgwasOpened = false;
                vm.isNoDataFound = true;
                vm.isBOMChanged = BOMFactory.isBOMChanged = false;
                BaseService.currentPageFlagForm = [];
                $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion);
                $scope.$parent.active();
              });
              return;
            }
            else if (message && Object.prototype.hasOwnProperty.call(message, 'partDetailUpdate')) {
              const objAltPart = _.find(vm.refBomModel, (objBOM) => objBOM.mfgPNID === parseInt(message.bomPartID));
              if (objAltPart) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_PART_DETAILS_MODIFIED);
                const subMessage = '<br/><br/><table style=\'width:100%\'><thead><tr><th class=\'border-bottom padding-5\'>#</th><th class=\'border-bottom padding-5\'>' + vm.LabelConstant.MFG + '</th><th class=\'border-bottom padding-5\'>' + vm.LabelConstant.MFGPN + '</th></tr></thead><tbody><tr><td class="border-bottom padding-5">1</td><td class="border-bottom padding-5">' + objAltPart.mfgCode + '</td><td class="border-bottom padding-5">' + objAltPart.mfgPN + '</td></tr></tbody></table>';
                messageContent.message = stringFormat(messageContent.message, subMessage);
                const model = {
                  messageContent: messageContent
                };
                DialogFactory.messageAlertDialog(model, () => {
                  vm.socketmsgwasOpened = false;
                  vm.isNoDataFound = true;
                  vm.isBOMChanged = BOMFactory.isBOMChanged = false;
                  BaseService.currentPageFlagForm = [];
                  $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion);
                  $scope.$parent.active();
                });
              }
              return;
            }
            else {
              vm.socketmsgwasOpened = false;
            }
          } else {
            vm.socketmsgwasOpened = false;
            vm.partUpdatefromThisTab = false;
          }
        }
      }
      // Specific part requirements changes listeners
      function specificPartRequirementChangedListener(message) {
        if (!vm.socketmsgwasOpened) {
          vm.socketmsgwasOpened = true;

          if (message && message.partID === _partID) {
            const messageContent = angular.copy(message.type === 'Standard' ? CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_PART_STANDARD_DETAIL_CHANGE_TEXT : CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_SPECIFIC_PART_REQUIREMENT_TEXT);
            if (message.type !== 'Standard') {
              messageContent.message = stringFormat(messageContent.message, message.type);
            }

            const obj = {
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(obj, () => {
              vm.socketmsgwasOpened = false;
              if (!vm.isBOMChanged) {
                vm.isNoDataFound = true;
                vm.isBOMChanged = BOMFactory.isBOMChanged = false;
                BaseService.currentPageFlagForm = [];
                $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion);
                $scope.$parent.active();
              }
            });
          }
          else {
            vm.socketmsgwasOpened = false;
          }
        }
      }
      getBOMStatusUpdate();
      // on disconnect socket
      //update progress for bom clean process
      function sendBOMStatusProgressbarUpdate(message) {
        if (message && message.partID && parseInt(message.partID) === parseInt(_partID)) {
          getBOMStatusUpdate();
        }
      }
      function getBOMStatusUpdate() {
        ImportBOMFactory.retrieveBOMorPMPregressStatus().query({
          partID: _partID
        }).$promise.then((response) => {
          if (response && response.data && response.data.length > 0) {
            vm.bomCleanProgress = response.data[0].percentage ? response.data[0].percentage : 1;
            vm.remainTime = seconds_to_days_hours_mins_secs_str(response.data[0].remainTime);
          } else {
            vm.bomCleanProgress = 1;
          }
        });
      }
      // Socket io disconnect event
      socketConnectionService.on('disconnect', () => {
        BOMremoveSocketListener();
      });
      /* open pop-up for add-edit Raw data category */
      vm.rfqLineitemsHeaders = (ev) => {
        DialogFactory.dialogService(
          RFQTRANSACTION.RFQ_LINEITEMS_HEADER_CONTROLLER,
          RFQTRANSACTION.RFQ_LINEITEMS_HEADER_VIEW,
          ev,
          null).then(() => {
          }, (err) => BaseService.getErrorLog(err));
      };

      /* open pop-up for filter update */
      vm.rfqLineitemsFilter = (ev) => {
        DialogFactory.dialogService(
          RFQTRANSACTION.RFQ_LINEITEMS_FILTER_CONTROLLER,
          RFQTRANSACTION.RFQ_LINEITEMS_FILTER_VIEW,
          ev,
          null).then(() => {
            initFilter();
          }, () => {
            initFilter();
          }, (err) => BaseService.getErrorLog(err));
      };

      /* open pop-up for additional column configuration */
      vm.rfqAdditionalColumnConfiguration = (ev) => {
        var data = {
          rfqAssyID: _rfqAssyID,
          partID: _partID
        };
        DialogFactory.dialogService(
          RFQTRANSACTION.BOM_ADDITONAL_COLUMN_CONFIGURATION_CONTROLLER,
          RFQTRANSACTION.BOM_ADDITONAL_COLUMN_CONFIGURATION_VIEW,
          ev,
          data).then(() => getRfqAdditionalColumnList().then(() => {
          }), (err) => BaseService.getErrorLog(err));
      };

      /* open pop-up for add-edit Raw data category */
      vm.rfqLineitemsDiscription = (ev) => {
        rfqLineitemsDiscription(ev);
      };
      /* open pop-up for add-edit Raw data category */
      function rfqLineitemsDiscription(ev) {
        var data = {
          rfqAssyID: _rfqAssyID,
          partID: _partID,
          isBOMReadOnly: vm.isBOMReadOnly
        };

        DialogFactory.dialogService(
          RFQTRANSACTION.RFQ_LINEITEMS_DESCRIPTION_CONTROLLER,
          RFQTRANSACTION.RFQ_LINEITEMS_DESCRIPTION_VIEW,
          ev,
          data).then((objAdditionalComment) => {
            if (objAdditionalComment && objAdditionalComment.lineitemsDescription && objAdditionalComment.lineitemsDescription.length > 0) {
              _.each(objAdditionalComment.lineitemsDescription, (objLinedesc) => {
                const objAlternateline = _.filter(vm.refBomModel, (objBOMLine) => objBOMLine._lineID === objLinedesc.lineID && objBOMLine.id === objLinedesc.rfqLineItemID);
                _.map(objAlternateline, (data) => { data.additionalComment = objLinedesc.description; data.additionalCommentId = objLinedesc.id; });
              });
            }
            $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion);
          }, (err) => BaseService.getErrorLog(err));
      }

      // Check QPA vs RefDes Step pending or done
      vm.isQPADesigStepPending = function () {
        if (_.find(vm.bomModel, (x) => x.qpaDesignatorStep !== null)) {
          return false;
        }
        return true;
      };
      // Check Component verification step
      vm.isVerificationStepPending = function () {
        const isvalid = _.some(vm.bomModel, (item, index) => _hotRegisterer && !_hotRegisterer.isEmptyRow(index) && ((item.mfgCode && !item.mfgCodeID) || (item.mfgPN && !item.mfgPNID) || (item.distributor && !item.distMfgCodeID) || (item.distPN && !item.distMfgPNID)));
        return isvalid;
      };

      // set handsontable full height to screen
      function setHandsontableHeight() {
        var offset = $('#hot-bom-container').offset();

        if (!offset) {
          return;
        }

        const docHeight = $(document).height();
        const footerHeight = $('.footerfixedbutton').outerHeight();

        const handsontableHeight = docHeight - offset.top - footerHeight - 0;
        $('#hot-bom-container').height(handsontableHeight).css({
          overflow: 'hidden'
        });
        // Resolved Scroll issue in case of read only handsontable
        $('#hot-bom-container .wtHolder').height(handsontableHeight);

        // Set context menu after new handson table generate
        initDynamicContextMenu();
      }

      //Open Good Part pop-up
      function suggestGoodPart(bomObj, col) {
        var data = {
          componentID: (col === _colMfgCodeIndex || col === _colMfgPNIndex) ? bomObj.mfgPNID : bomObj.distMfgPNID
        };
        var row = vm.refBomModel.indexOf(bomObj);
        ComponentFactory.getComponentGoodPart().query({ id: data.componentID }).$promise.then((goodPartResponse) => {
          if (goodPartResponse && goodPartResponse.data) {
            const data = [];
            _.each(goodPartResponse.data, (item) => {
              item.mfgName = item.mfgCodemst.mfgName;
              item.mfgCode = item.mfgCodemst.mfgCode;
              item.mfgCodeID = item.mfgCodemst.id;
              item.mfgPNID = item.id;
              data.push(item);
            });
            addAlternateParts(bomObj, data, false, col);
            if (col === _colMfgCodeIndex || col === _colMfgPNIndex) {
              bomObj.suggestedGoodPartStep = false;
              bomObj.suggestedGoodPartError = generateDescription(bomObj, _suggestedGoodPartError);
              mfgVerificationStepFn(bomObj, row);
            }
            else {
              bomObj.suggestedGoodDistPartStep = false;
              bomObj.suggestedGoodDistPartError = generateDescription(bomObj, _suggestedGoodDistPartError);
              distVerificationStepFn(bomObj, row);
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

      //open pop-up for API verified alternate part Not in Use
      vm.apiVerificationAlternateParts = (ev) => {
        if ((vm.selectedFilter == vm.allFilterID && vm.bomModel.length === 1 && !vm.globalSearchText) || vm.APIVerifiedFlag != vm.pricingStatus.SUCCESS || vm.apiVerifiedAlternatePartsCount == 0 || vm.isBOMReadOnly) {
          return false;
        }
        const unVerifiedParts = [];
        vm.bomModel.forEach((item) => {
          if (!item.mfgPNID && item.mfgPN) {
            unVerifiedParts.push({
              mfgCode: item.mfgCode,
              mfgPN: item.mfgPN
            });
          }
        });

        const data = {
          rfqAssyID: _rfqAssyID,
          parts: unVerifiedParts
        };

        DialogFactory.dialogService(
          RFQTRANSACTION.API_VERIFICATION_ALTERNATEPART_CONTROLLER,
          RFQTRANSACTION.API_VERIFICATION_ALTERNATEPART_VIEW,
          ev,
          data).then(() => {
            vm.componentVerification();
          }, (err) => BaseService.getErrorLog(err));
      };

      // Add alternate MFR in case of Merge MFR
      function addalternateMFR(bomObj, alternateMFRArr) {
        if (bomObj && alternateMFRArr && alternateMFRArr.length > 0) {
          const data = [];
          _.each(alternateMFRArr, (item) => {
            if (item.mfgCodeMst && item.mfgCodeMst.mfgName) {
              // If MFR and MFR PN combination already exists in same line the no need to add in alternate part array
              const partAdded = _.find(vm.refBomModel, (lineObj) => lineObj._lineID === bomObj._lineID && lineObj.mfgCode.toUpperCase() === item.mfgCodeMst.mfgName.toUpperCase() && lineObj.mfgPN.toUpperCase() === bomObj.mfgPN.toUpperCase());
              if (!partAdded) {
                data.push({ mfgCode: item.mfgCodeMst.name.toUpperCase(), mfgName: item.mfgCodeMst.mfgName.toUpperCase(), mfgPN: bomObj.mfgPN.toUpperCase() });
              }
            }
          });

          // If no alternate part found then false internal verification flag to prevent loop for internal verification in case of MFR mapping
          if (data.length === 0) {
            vm.isRevifyInternalVerification = false;
            return;
          }
          _suggestMFRMappingError.description = stringFormat(_suggestMFRMappingError.description, bomObj.mfgCode + ' ' + bomObj.mfgPN);
          const suggestedPartType = {
            partSuggestType: vm.PartSuggestType.suggestedMFRMapping.id,
            partSuggestMsg: _suggestMFRMappingError
          };
          addAlternateParts(bomObj, data, false, null, suggestedPartType);
        }
      }

      // Add alternate part pop-up (Suggest Alternate Part or Suggest RoHS Replacement Part)
      function alternatePartsPopup(bomObj, isRoHSAlternate, col) {
        var data = {
          componentID: bomObj.mfgPNID,
          isRoHSAlternate: isRoHSAlternate
        };
        DialogFactory.dialogService(
          CORE.ALTERNATE_PART_MODAL_CONTROLLER,
          CORE.ALTERNATE_PART_MODAL_VIEW,
          _dummyEvent,
          data).then((data) => {
            if (data) {
              if (isRoHSAlternate) {
                _suggestRoHSReplacementPartError.description = stringFormat(_suggestRoHSReplacementPartError.description, bomObj.mfgCode + ' ' + bomObj.mfgPN);
              } else {
                _suggestAlternatePartError.description = stringFormat(_suggestAlternatePartError.description, bomObj.mfgCode + ' ' + bomObj.mfgPN);
              }

              const suggestedPartType = {
                partSuggestType: isRoHSAlternate ? vm.PartSuggestType.suggestedRoHSReplacementPart.id : vm.PartSuggestType.suggestedAlternatePart.id,
                partSuggestMsg: isRoHSAlternate ? _suggestRoHSReplacementPartError : _suggestAlternatePartError
              };
              addAlternateParts(bomObj, data, false, col, suggestedPartType);
            }
          }, (err) => BaseService.getErrorLog(err));
      };

      // Add Alternate Part Line in BOM
      function addAlternateParts(bomObj, alternatePartArr, isRemove, colIndex, suggestPartType) {
        var row = vm.refBomModel.indexOf(bomObj);
        var mergedCellInfo = _.filter(vm.refBomModel, { '_lineID': (bomObj.lineID ? bomObj.lineID : bomObj._lineID) }); // getMergeCellInfoByRow(row);
        var lineItemParts = [];
        var newItems = [];
        var availableParts = [];

        if (mergedCellInfo && mergedCellInfo.length > 0) {
          _.each(mergedCellInfo, (item) => {
            lineItemParts.push({
              mfgCode: item.mfgCode,
              mfgPN: item.mfgPN,
              distPN: item.distPN,
              distributor: item.distributor
            });
            item.isMergedRow = true;
          });
        }
        else {
          lineItemParts.push({
            mfgCode: bomObj.mfgCode,
            mfgPN: bomObj.mfgPN,
            distPN: item.distPN,
            distributor: item.distributor
          });
        }

        alternatePartArr.forEach((item) => {
          var isExists = _.some(lineItemParts, (part) => {
            if (colIndex === _colMfgCodeIndex || colIndex === _colMfgPNIndex) {
              if (item.mfgName && part.mfgCode && item.mfgName.toUpperCase() === part.mfgCode.toUpperCase() && item.mfgPN && part.mfgPN && item.mfgPN.toUpperCase() === part.mfgPN.toUpperCase()) {
                return part;
              }
              else if ((item.mfgName || item.mfgPN) && item.mfgName === part.mfgCode && item.mfgPN === part.mfgPN) {
                return part;
              }
              else if (part.mfgPNID && item.mfgPNID === part.mfgPNID) {
                return part;
              }
            } else if (colIndex === _colDistributorIndex || colIndex === _colDistPNIndex) {
              if (item.mfgName && part.distributor && item.mfgName.toUpperCase() === part.distributor.toUpperCase() && item.mfgPN && part.distPN && item.mfgPN.toUpperCase() === part.distPN.toUpperCase()) {
                return part;
              }
              else if ((item.mfgName || item.mfgPN) && item.mfgName === part.distributor && item.mfgPN === part.distPN) {
                return part;
              }
              else if (part.distMfgPNID && item.mfgPNID === part.distMfgPNID) {
                return part;
              }
            }
          });
          if (!isExists) {
            newItems.push(item);
          } else {
            availableParts.push(item);
          }
        });
        if (availableParts.length > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.SUGGESTED_PARTS_ALREADY_AVAILABLE);
          if (!suggestPartType) {
            messageContent.message = stringFormat(messageContent.message, 'correct', 'alternate line');
          } else if (suggestPartType.partSuggestType === vm.PartSuggestType.suggestedRoHSReplacementPart.id) {
            messageContent.message = stringFormat(messageContent.message, 'RoHS replacement', 'alternate line');
          } else if (suggestPartType.partSuggestType === vm.PartSuggestType.suggestedAlternatePart.id) {
            messageContent.message = stringFormat(messageContent.message, 'alternate', 'alternate line');
          } else if (suggestPartType.partSuggestType === vm.PartSuggestType.suggestedPackagingPart.id) {
            messageContent.message = stringFormat(messageContent.message, 'packaging alias', 'alternate line');
          }
          const subMessage = [];
          const message = messageContent.message + '<br/><br/><table style=\'width:100%\'><thead><tr><th class=\'border-bottom padding-5\'>#</th><th class=\'border-bottom padding-5\'>' + ((colIndex === _colMfgCodeIndex || colIndex === _colMfgPNIndex) ? vm.LabelConstant.MFG : vm.LabelConstant.Supplier) + '</th><th class=\'border-bottom padding-5\'>' + ((colIndex === _colMfgCodeIndex || colIndex === _colMfgPNIndex) ? vm.LabelConstant.MFGPN : vm.LabelConstant.SupplierPN) + '</th></tr></thead><tbody>{0}</tbody></table>';
          _.each(availableParts, (item, index) => {
            subMessage.push('<tr><td class="border-bottom padding-5">' + (index + 1) + '</td><td class="border-bottom padding-5">' + item.mfgName + '</td><td class="border-bottom padding-5">' + item.mfgPN + '</td></tr>');
          });
          messageContent.message = stringFormat(message, subMessage);

          const obj = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(obj);
        }
        if (!newItems.length) {
          // This case will never comes but still handle here to prevent loop for internal verification in case of MFR mapping
          if (vm.isRevifyInternalVerification) {
            vm.isRevifyInternalVerification = false;
          }
          return;
        }
        newItems.forEach((item, index) => {
          var model = {};
          model._lineID = bomObj._lineID;
          model.lineID = bomObj.lineID;
          model.cust_lineID = bomObj.cust_lineID;
          model.org_mfgCode = model.mfgCode = item.mfgName;
          model.org_mfgPN = model.mfgPN = item.mfgPN;
          model.customerApproval = suggestPartType && suggestPartType.customerApproval ? suggestPartType.customerApproval : RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
          model.mfgPNStep = true;
          model.mfgPNStepError = null;
          model.defaultInvalidMFRStep = true;
          model.defaultInvalidMFRError = null;
          model.suggestedGoodPartStep = true;
          model.suggestedGoodDistPartStep = true;
          model.isMergedRow = true;
          model.suggestedByApplicationStep = suggestPartType ? suggestPartType.partSuggestType : 0;
          model.suggestedByApplicationMsg = suggestPartType ? generateDescription(model, suggestPartType.partSuggestMsg).split(':').slice(1).join(':') : null;
          model.distGoodPartMappingStep = true;
          if (bomObj.isMFGGoodPart === PartCorrectList.IncorrectPart && (colIndex === _colMfgCodeIndex || colIndex === _colMfgPNIndex)) {
            bomObj.badMfgPN = bomObj.suggestedCorrectPart = item.mfgName + '\n' + item.mfgPN;
          } else if (bomObj.isDistGoodPart === PartCorrectList.IncorrectPart && (colIndex === _colDistributorIndex || colIndex === _colDistPNIndex)) {
            bomObj.badMfgPN = bomObj.suggestedCorrectPart = item.mfgName + '\n' + item.mfgPN;
            model.distributor = item.mfgName;
            model.distPN = item.mfgPN;
            model.mfgCode = null;
            model.mfgCodeID = null;
            model.mfgPN = null;
            model.mfgPNID = null;
          }

          const rowIndex = row + 1 + index;
          if (isFilterApply) {
            model.hidden = bomObj.hidden; //in care of filter if line not show in filter and part add as alternate then not show on BOM grid
            vm.refBomModel.splice(rowIndex, 0, model);
            updateCloneObject(true);
          }
          else {
            vm.refBomModel.splice(rowIndex, 0, model);
            updateCloneObject(false);
          }

          _invalidCells.forEach((item) => {
            if (item[0] >= rowIndex) {
              item[0] = item[0] + 1;
            }
          });
          //model.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
          //model.customerApprovalStepError = generateDescription(model, _customerApprovalError);
          mfgVerificationStepFn(model, row);
          distVerificationStepFn(model, row);
        });

        if (isRemove) {
          if (!mergedCellInfo || mergedCellInfo.row === row) {
            const newObj = vm.bomModel[row + 1];

            newObj.id = bomObj.id;
            newObj.rfqAlternatePartID = bomObj.rfqAlternatePartID;
            newObj._lineID = bomObj._lineID;

            if (newObj.id || newObj.rfqAlternatePartID) {
              newObj.isUpdate = true;
            }

            _sourceHeaderVisible.forEach((item) => {
              if (_multiFields.indexOf(item.field) === -1) {
                newObj[item.field] = bomObj[item.field];
              }
            });
          }

          _hotRegisterer.alter('remove_row', row);
          _.remove(_invalidCells, (x) => x[0] === row);
        }
        //If any detail of BOM is changed then update the flag
        vm.isBOMChanged = BOMFactory.isBOMChanged = true;
        BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];

        $timeout(() => {
          setHeaderStyle();
          mergeCommonCells();
        });
        if (_hotRegisterer) {
          _hotRegisterer.validateCells();
        }
      }

      // Packaging alias part pop-up
      function packagingAliasPartsPopup(bomObj, col) {
        var data = {
          componentID: bomObj.mfgPNID
        };
        DialogFactory.dialogService(
          CORE.PACKAGING_ALIAS_PART_MODAL_CONTROLLER,
          CORE.PACKAGING_ALIAS_PART_MODAL_VIEW,
          _dummyEvent,
          data).then((data) => {
            if (data) {
              _suggestPackagingPartError.description = stringFormat(_suggestPackagingPartError.description, bomObj.mfgCode + ' ' + bomObj.mfgPN);
              const suggestedPartType = {
                partSuggestType: vm.PartSuggestType.suggestedPackagingPart.id,
                partSuggestMsg: _suggestPackagingPartError,
                customerApproval: RFQTRANSACTION.CUSTOMER_APPROVAL.NONE
              };
              addAlternateParts(bomObj, data, false, col, suggestedPartType);
            }
          }, () => {
          });
      }


      // Create Tool-tip message form error description
      function getTooltipMessageFromSaveMessages(errorList, error, item) {
        const messages = [];
        if (errorList && errorList.length > 0 && error) {
          _.each(errorList, (msg) => {
            if (msg && msg.split(':')[0] === error.errorCode) {
              messages.push(msg.split(':').slice(1).join(':'));
            }
          });
        }

        if (messages.length === 0 && item) {
          messages.push(generateDescription(item, error).split(':').slice(1).join(':'));
        }

        return messages.length > 0 ? messages.join('\n') : null;
      }

      // [S] Cell validation color
      function qpaDesignatorStepFn(bomObj, row) {
        if (row === null) {
          row = vm.bomModel.indexOf(bomObj);
        }
        row = parseInt(row);
        bomObj.qpaTooltip = null;
        bomObj.qpaErrorColor = null;
        // if not any error in QPA vs RefDes then we remove tool-tip and color code for same
        if (bomObj.qpaDesignatorStep === vm.QPAREFDESValidationStepsFlag.Verifyed && bomObj.customerApprovalForQPAREFDESStep) {
          bomObj.qpaErrorColor = _successColor;
          _.remove(_invalidCells, (x) => x[0] === row && (x[1] === _colQPAIndex || x[1] === _colRefDesigIndex));
        }
        else {
          const errorLists = []; //added condition to check error exist or not (champak:14/05/2019)
          const stepErrorList = (bomObj.qpaDesignatorStepError || '').split('\n');
          const tooltipList = [];
          // QPA vs RefDes Error then we bind tool-tip for same
          if (bomObj.qpaDesignatorStep === vm.QPAREFDESValidationStepsFlag.Change) {
            errorLists.push(_QPAREFDESChangeError);
            const stepErrorList = (bomObj.qpaDesignatorStepError) ? bomObj.qpaDesignatorStepError.split('\n') : null;
            const message = getTooltipMessageFromSaveMessages(stepErrorList, _QPAREFDESChangeError, bomObj);
            if (message) {
              tooltipList.push(message);
            }
          } else if (bomObj.qpaDesignatorStep === vm.QPAREFDESValidationStepsFlag.MisMatch) {
            errorLists.push(_qpaDesignatorError);
            const stepErrorList = (bomObj.qpaDesignatorStepError) ? bomObj.qpaDesignatorStepError.split('\n') : null;
            const message = getTooltipMessageFromSaveMessages(stepErrorList, _qpaDesignatorError, bomObj);
            if (message) {
              tooltipList.push(message);
            }
          } else if (bomObj.qpaDesignatorStep === vm.QPAREFDESValidationStepsFlag.Duplicate) {
            errorLists.push(_duplicateRefDesError);
            const stepErrorList = (bomObj.qpaDesignatorStepError) ? bomObj.qpaDesignatorStepError.split('\n') : null;
            const message = getTooltipMessageFromSaveMessages(stepErrorList, _duplicateRefDesError, bomObj);
            if (message) {
              tooltipList.push(message);
            }
          } else if (bomObj.qpaDesignatorStep === vm.QPAREFDESValidationStepsFlag.Invalid) {
            errorLists.push(_invalidRefDesError);
            const stepErrorList = (bomObj.qpaDesignatorStepError) ? bomObj.qpaDesignatorStepError.split('\n') : null;
            const message = getTooltipMessageFromSaveMessages(stepErrorList, _invalidRefDesError, bomObj);
            if (message) {
              tooltipList.push(message);
            }
          }


          if (bomObj.qpaDesignatorStep === vm.QPAREFDESValidationStepsFlag.Verifyed && (bomObj.customerApprovalForQPAREFDESStep === false || bomObj.customerApprovalForQPAREFDESStep === 0)) {
            errorLists.push(_customerApprovalForQPAREFDESError);
            bomObj.customerApprovalForQPAREFDESError = generateDescription(bomObj, _customerApprovalForQPAREFDESError);
            const message = getTooltipMessageFromSaveMessages(stepErrorList, _customerApprovalForQPAREFDESError, bomObj);
            bomObj.qpaTooltip = bomObj.qpaTooltip ? `${bomObj.qpaTooltip}\n${message}` : message;
          }

          const priorErrorObj = _.sortBy(errorLists, 'displayOrder')[0];
          if (priorErrorObj) {
            bomObj.qpaErrorColor = priorErrorObj.errorColor;
          }
          bomObj.qpaTooltip = tooltipList.join('\n');
          if (bomObj.qpaErrorColor) {
            _invalidCells.push([row, _colQPAIndex]);
            _invalidCells.push([row, _colRefDesigIndex]);
          }
        }

        if (bomObj.lineID && !bomObj.qpa && !bomObj.dnpQty) {
          _invalidCells.push([row, _colQPAIndex]);
        }
        bomObj.description = getDescriptionForLine(bomObj);
      }

      //DNP QPA Vs RefDes Error color and tool - tip bind
      function dnpqpaDesignatorStepFn(bomObj, row) {
        if (row === null) {
          row = vm.bomModel.indexOf(bomObj);
        }
        row = parseInt(row);
        bomObj.dnpqpaTooltip = null;
        bomObj.dnpqpaErrorColor = null;
        const errorLists = [];
        const tooltipList = [];
        if (bomObj.dnpQPARefDesStep === vm.QPAREFDESValidationStepsFlag.Change) {
          errorLists.push(_dnpQPAREFDESChangeError);
          const stepErrorList = (bomObj.dnpQPARefDesError) ? bomObj.dnpQPARefDesError.split('\n') : null;
          const message = getTooltipMessageFromSaveMessages(stepErrorList, _dnpQPAREFDESChangeError, bomObj);
          if (message) {
            tooltipList.push(message);
          }
        } else if (bomObj.dnpQPARefDesStep === vm.QPAREFDESValidationStepsFlag.MisMatch) {
          errorLists.push(_dnpQPARefDesError);
          const stepErrorList = (bomObj.dnpQPARefDesError) ? bomObj.dnpQPARefDesError.split('\n') : null;
          const message = getTooltipMessageFromSaveMessages(stepErrorList, _dnpQPARefDesError, bomObj);
          if (message) {
            tooltipList.push(message);
          }
        } else if (bomObj.dnpQPARefDesStep === vm.QPAREFDESValidationStepsFlag.Duplicate) {
          errorLists.push(_duplicateRefDesError);
          const stepErrorList = (bomObj.dnpQPARefDesError) ? bomObj.dnpQPARefDesError.split('\n') : null;
          const message = getTooltipMessageFromSaveMessages(stepErrorList, _duplicateRefDesError, bomObj);
          if (message) {
            tooltipList.push(message);
          }
        } else if (bomObj.dnpQPARefDesStep === vm.QPAREFDESValidationStepsFlag.Invalid) {
          errorLists.push(_dnpInvalidREFDESError);
          const stepErrorList = (bomObj.dnpQPARefDesError) ? bomObj.dnpQPARefDesError.split('\n') : null;
          const message = getTooltipMessageFromSaveMessages(stepErrorList, _dnpInvalidREFDESError, bomObj);
          if (message) {
            tooltipList.push(message);
          }
        }
        bomObj.dnpqpaTooltip = bomObj.dnpQPARefDesError;

        if (bomObj.dnpQPARefDesStep === vm.QPAREFDESValidationStepsFlag.Verifyed && (bomObj.customerApprovalForDNPQPAREFDESStep === false || bomObj.customerApprovalForDNPQPAREFDESStep === 0)) {
          errorLists.push(_customerApprovalForDNPQPAREFDESError);
          bomObj.customerApprovalForDNPQPAREFDESError = generateDescription(bomObj, _customerApprovalForDNPQPAREFDESError);
          const stepErrorList = (bomObj.customerApprovalForDNPQPAREFDESError) ? bomObj.customerApprovalForDNPQPAREFDESError.split('\n') : null;
          const message = getTooltipMessageFromSaveMessages(stepErrorList, _customerApprovalForDNPQPAREFDESError, bomObj);
          if (message) {
            tooltipList.push(message);
          }
        }

        if (errorLists.length > 0) {
          bomObj.dnpqpaTooltip = tooltipList.join('\n');
          const priorErrorObj = _.sortBy(errorLists, 'displayOrder')[0];
          if (priorErrorObj) {
            bomObj.dnpqpaErrorColor = priorErrorObj.errorColor;
          }
          _invalidCells.push([row, _colDNPQty]);
          _invalidCells.push([row, _colDNPDesig]);
        }
        bomObj.description = getDescriptionForLine(bomObj);
      }

      // Validate CPN Custom Part with Same Rev
      function validateCPNCustomPartRev() {
        const CPNIDs = _.uniq(_.map(_.filter(vm.refBomModel, (x) => x.custPNID), 'custPNID'));

        return vm.cgBusyLoading = ImportBOMFactory.getAllCPNPartDetailListByCPNIDs().query({
          CPNIDs: CPNIDs
        }).$promise.then((resCPNPartsDetail) => {
          _.each(resCPNPartsDetail.data, (objres) => {
            const CPNAVLLinepart = _.find(vm.refBomModel, (bomObj) => bomObj.custPNID === objres.id);
            if (CPNAVLLinepart) {
              const newItems = [];
              const avlLine = _.filter(vm.refBomModel, (bomLineObj) => bomLineObj._lineID === CPNAVLLinepart._lineID);
              objres.ComponentCustAliasRevPart.forEach((item) => {
                var isExists = _.some(avlLine, (part) => {
                  if (item.refComponentID && item.refAVLPart && part.mfgPNID && part.custPNID !== part.mfgPNID && item.refAVLPart.id === part.mfgPNID) {
                    return part;
                  }
                });
                if (!isExists) {
                  const AvlPartsObj = {
                    mfgPN: item.refAVLPart.name,
                    mfgPNrev: item.refAVLPart.rev
                  };
                  newItems.push(AvlPartsObj);
                }
              });
              _.each(avlLine, (objLineAlternate) => {
                if (CPNAVLLinepart.custPNID !== objLineAlternate.mfgPNID) {
                  const AvlPartsObj = {
                    mfgPN: objLineAlternate.mfgPN,
                    mfgPNrev: objLineAlternate.mfgPNrev
                  };
                  newItems.push(AvlPartsObj);
                  if (objLineAlternate.isCustom && objLineAlternate.mfgPNrev !== CPNAVLLinepart.customerRev) {
                    objLineAlternate.isMPNAddedinCPN = false;
                    objLineAlternate.mismatchCPNandCustpartRevStep = false;
                    if (objLineAlternate.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                      objLineAlternate.mismatchCPNandCustpartRevError = generateDescription(objLineAlternate, _mismatchCPNandCustpartRevError);
                    }
                    if (objLineAlternate.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.NONE) {
                      objLineAlternate.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                    }
                  }
                }
              });
              const CPNPartRevGroup = _.map(_.groupBy(newItems, 'mfgPNrev'));
              if (CPNPartRevGroup.length > 1) {
                _.each(avlLine, (objLineAlternate) => {
                  if (objLineAlternate.custPNID !== objLineAlternate.mfgPNID) {
                    if (objLineAlternate.isCustom && objLineAlternate.mfgPNrev !== CPNAVLLinepart.customerRev) {
                      objLineAlternate.isMPNAddedinCPN = false;
                      objLineAlternate.mismatchCPNandCustpartRevStep = false;
                      if (objLineAlternate.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                        objLineAlternate.mismatchCPNandCustpartRevError = generateDescription(objLineAlternate, _mismatchCPNandCustpartRevError);
                      }
                      if (objLineAlternate.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.NONE) {
                        objLineAlternate.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                      }
                    } else {
                      objLineAlternate.isMPNAddedinCPN = objLineAlternate.isMPNAddedinCPN ? objLineAlternate.isMPNAddedinCPN : false;
                    }
                  }
                });
              }
            }
          });
          const CPNAVLLinepart = _.filter(vm.refBomModel, (bomObj) => bomObj.custPN && !bomObj.custPNID && bomObj.lineID);
          _.each(CPNAVLLinepart, (objline) => {
            const newItems = [];
            const avlLine = _.filter(vm.refBomModel, (bomObj) => bomObj._lineID === objline._lineID);
            _.each(avlLine, (objLineAlternate) => {
              const AvlPartsObj = {
                mfgPN: objLineAlternate.mfgPN,
                mfgPNrev: objLineAlternate.mfgPNrev
              };
              newItems.push(AvlPartsObj);
              if (objLineAlternate.isCustom && objLineAlternate.mfgPNrev !== objline.customerRev) {
                objLineAlternate.mismatchCPNandCustpartRevStep = false;
                objLineAlternate.isMPNAddedinCPN = false;
                if (objLineAlternate.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                  objLineAlternate.mismatchCPNandCustpartRevError = generateDescription(objLineAlternate, _mismatchCPNandCustpartRevError);
                }
                if (objLineAlternate.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.NONE) {
                  objLineAlternate.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                }
              }
            });
            const CPNPartRevGroup = _.map(_.groupBy(newItems, 'mfgPNrev'));
            if (CPNPartRevGroup.length > 1) {
              _.each(avlLine, (objLineAlternate) => {
                if (objLineAlternate.isCustom && objLineAlternate.mfgPNrev !== objline.customerRev) {
                  objLineAlternate.isMPNAddedinCPN = false;
                  objLineAlternate.mismatchCPNandCustpartRevStep = false;
                  if (objLineAlternate.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                    objLineAlternate.mismatchCPNandCustpartRevError = generateDescription(objLineAlternate, _mismatchCPNandCustpartRevError);
                  }
                  if (objLineAlternate.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.NONE) {
                    objLineAlternate.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
                  }
                } else {
                  objLineAlternate.isMPNAddedinCPN = false;
                }
              });
            }
          });
          vm.checkObsoleteParts();
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      }

      // Duplicate CPN Error
      function cpnDuplicateStepFn(bomObj, row) {
        if (row === null) {
          row = vm.bomModel.indexOf(bomObj);
        }

        const errorList = [];
        const tooltipList = [];
        bomObj.cpnErrorColor = null;
        bomObj.cpnTooltip = null;

        if (bomObj.restrictCPNUseWithPermissionStep === false || bomObj.restrictCPNUseWithPermissionStep === 0) {
          errorList.push(_restrictCPNUseWithPermissionError);
          tooltipList.push(generateDescription(bomObj, _restrictCPNUseWithPermissionError).split(':').slice(1).join(':').trim());
          if (!bomObj.restrictCPNUseWithPermissionError) {
            bomObj.restrictCPNUseWithPermissionError = generateDescription(bomObj, _restrictCPNUseWithPermissionError);
          }
        }
        if (bomObj.restrictCPNUsePermanentlyStep === false || bomObj.restrictCPNUsePermanentlyStep === 0) {
          errorList.push(_restrictCPNUsePermanentlyError);
          tooltipList.push(generateDescription(bomObj, _restrictCPNUsePermanentlyError).split(':').slice(1).join(':').trim());
          if (!bomObj.restrictCPNUsePermanentlyError) {
            bomObj.restrictCPNUsePermanentlyError = generateDescription(bomObj, _restrictCPNUsePermanentlyError);
          }
        }
        if (bomObj.restrictCPNUseInBOMStep === true || bomObj.restrictCPNUseInBOMStep === 1) {
          errorList.push(_restrictCPNUseInBOMError);
          tooltipList.push(generateDescription(bomObj, _restrictCPNUseInBOMError).split(':').slice(1).join(':').trim());
          bomObj.restrictCPNUseInBOMError = generateDescription(bomObj, _restrictCPNUseInBOMError);
        }
        if (errorList.length > 0) {
          const priorErrorObj = _.sortBy(errorList, (x) => (x.displayOrder || 0))[0];
          bomObj.cpnErrorColor = priorErrorObj.errorColor;
          bomObj.cpnTooltip = tooltipList.join('\n');
          _invalidCells.push([row, _colCPNIndex]);
        }
        bomObj.description = getDescriptionForLine(bomObj);
      }

      // Is Buy Or Populate Error
      function populateStepFn(bomObj, row) {
        if (row === null) {
          row = vm.bomModel.indexOf(bomObj);
        }
        row = parseInt(row);
        bomObj.populateErrorColor = null;
        bomObj.populateTooltip = null;
        if (bomObj.customerApprovalForPopulateStep === false || bomObj.customerApprovalForPopulateStep === 0) {
          bomObj.populateErrorColor = _customerApprovalForPopulateError.errorColor;
          const strError = generateDescription(bomObj, _customerApprovalForPopulateError);
          bomObj.populateTooltip = strError ? strError.split(':').slice(1).join(':') : null;
          _invalidCells.push([row, _colPopulateIndex]);
        }
        bomObj.description = getDescriptionForLine(bomObj);
      }

      // Is Buy Or Populate Error
      function buyStepFn(bomObj, row) {
        if (row === null) {
          row = vm.bomModel.indexOf(bomObj);
        }
        row = parseInt(row);
        bomObj.buyErrorColor = bomObj.buyTooltip = bomObj.dnpBuyErrorColor = bomObj.dnpBuyTooltip = null;
        if (bomObj.customerApprovalForBuyStep === false || bomObj.customerApprovalForBuyStep === 0) {
          bomObj.buyErrorColor = _customerApprovalForBuyError.errorColor;
          const strError = generateDescription(bomObj, _customerApprovalForBuyError);
          bomObj.buyTooltip = strError ? strError.split(':').slice(1).join(':') : null;
          _invalidCells.push([row, _colBuyIndex]);
        }
        if (bomObj.customerApprovalForDNPBuyStep === false || bomObj.customerApprovalForDNPBuyStep === 0) {
          bomObj.dnpBuyErrorColor = _customerApprovalForDNPBuyError.errorColor;
          const strError = generateDescription(bomObj, _customerApprovalForDNPBuyError);
          bomObj.dnpBuyTooltip = strError ? strError.split(':').slice(1).join(':') : null;
          _invalidCells.push([row, _colDNPBuyIndex]);
        }
        bomObj.description = getDescriptionForLine(bomObj);
      }

      // MFR and MFR PN Error
      function mfgVerificationStepFn(bomObj, row) {
        if (vm.selectedFilter === vm.allFilterID && !$scope.loaderVisible && row !== null && _hotRegisterer && _hotRegisterer.isEmptyRow(row)) { // return for empty row
          return;
        }

        if (row === null) {
          row = vm.bomModel.indexOf(bomObj);
        }
        row = parseInt(row);
        const errorList = [];
        const tooltipList = [];
        let errorMFG = null;
        let errorMFGPN = null;
        vm.calculateAssemblyLevelErrorCount(bomObj);
        if (bomObj.mfgVerificationStep === false || bomObj.mfgVerificationStep === 0) {
          errorList.push(_mfgVerificationError);
          tooltipList.push(generateDescription(bomObj, _mfgVerificationError).split(':').slice(1).join(':').trim());
        }
        if (bomObj.mfgDistMappingStep === false || bomObj.mfgDistMappingStep === 0) {
          errorList.push(_mfgDistMappingError);
          tooltipList.push(generateDescription(bomObj, _mfgDistMappingError).split(':').slice(1).join(':').trim());
        }
        if (bomObj.obsoletePartStep === false || bomObj.obsoletePartStep === 0) {
          errorList.push(_obsoletePartError);
          tooltipList.push(generateDescription(bomObj, _obsoletePartError).split(':').slice(1).join(':').trim());
          if (!bomObj.obsoletePartStepError) {
            bomObj.obsoletePartStepError = generateDescription(bomObj, _obsoletePartError);
          }
        }
        if (bomObj.mfgGoodPartMappingStep === false || bomObj.mfgGoodPartMappingStep === 0) {
          errorList.push(_mfgGoodPartMappingError);
          tooltipList.push(generateDescription(bomObj, _mfgGoodPartMappingError).split(':').slice(1).join(':').trim());
        }
        if (bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING && bomObj.mfgPNID && bomObj.isMFGGoodPart === PartCorrectList.CorrectPart && (bomObj.restrictUsePermanentlyStep && bomObj.restrictUseExcludingAliasStep)) {
          errorList.push(_customerApprovalError);
          tooltipList.push(generateDescription(bomObj, _customerApprovalError).split(':').slice(1).join(':').trim());
          bomObj.customerApprovalStepError = generateDescription(bomObj, _customerApprovalError);
        }
        if (bomObj.nonRohsStep === false || bomObj.nonRohsStep === 0) {
          errorList.push(_rohsStatusError);
          tooltipList.push(generateDescription(bomObj, _rohsStatusError).split(':').slice(1).join(':').trim());
        }
        if (bomObj.epoxyStep === false || bomObj.epoxyStep === 0) {
          errorList.push(_epoxyError);
          tooltipList.push(generateDescription(bomObj, _epoxyError).split(':').slice(1).join(':').trim());
        }
        if (bomObj.mfgCodeStep === false || bomObj.mfgCodeStep === 0) {
          errorMFG = _mfgInvalidError;
          errorList.push(_mfgInvalidError);
          tooltipList.push(generateDescription(bomObj, _mfgInvalidError).split(':').slice(1).join(':').trim());
        }
        if (bomObj.mfgPNStep === false || bomObj.mfgPNStep === 0) {
          errorMFGPN = _mfgPNInvalidError;
          errorList.push(_mfgPNInvalidError);
          tooltipList.push(generateDescription(bomObj, _mfgPNInvalidError).split(':').slice(1).join(':').trim());
        }
        if (bomObj.invalidConnectorTypeStep === false || bomObj.invalidConnectorTypeStep === 0) {
          errorList.push(_invalidConnectorTypeError);
          tooltipList.push(generateDescription(bomObj, _invalidConnectorTypeError).split(':').slice(1).join(':').trim());
          bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
        }
        if (bomObj.mismatchNumberOfRowsStep === false || bomObj.mismatchNumberOfRowsStep === 0) {
          errorList.push(_mismatchNumberOfRowsError);
          tooltipList.push(generateDescription(bomObj, _mismatchNumberOfRowsError).split(':').slice(1).join(':').trim());
          bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
        }
        if (bomObj.partPinIsLessthenBOMPinStep === false || bomObj.partPinIsLessthenBOMPinStep === 0) {
          errorList.push(_partPinIsLessthenBOMPinError);
          tooltipList.push(generateDescription(bomObj, _partPinIsLessthenBOMPinError).split(':').slice(1).join(':').trim());
          bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
        }
        if (bomObj.exportControlledStep === false || bomObj.exportControlledStep === 0) {
          errorList.push(_exportControlledError);
          tooltipList.push(generateDescription(bomObj, _exportControlledError).split(':').slice(1).join(':').trim());
        }
        if (bomObj.unknownPartStep === false || bomObj.unknownPartStep === 0) {
          errorList.push(_unknownPartError);
          tooltipList.push(generateDescription(bomObj, _unknownPartError).split(':').slice(1).join(':').trim());
        }
        if (bomObj.defaultInvalidMFRStep === false || bomObj.defaultInvalidMFRStep === 0) {
          errorList.push(_defaultInvalidMFRError);
          tooltipList.push(generateDescription(bomObj, _defaultInvalidMFRError).split(':').slice(1).join(':').trim());
        }
        if (bomObj.tbdPartStep === false || bomObj.tbdPartStep === 0) {
          errorList.push(_tbdPartError);
          tooltipList.push(generateDescription(bomObj, _tbdPartError).split(':').slice(1).join(':').trim());
        }
        if (bomObj.duplicateMPNInSameLineStep === false || bomObj.duplicateMPNInSameLineStep === 0) {
          errorList.push(_duplicateMPNInSameLineError);
          tooltipList.push(generateDescription(bomObj, _duplicateMPNInSameLineError).split(':').slice(1).join(':').trim());
        }
        if (bomObj.mismatchMountingTypeStep === false || bomObj.mismatchMountingTypeStep === 0) {
          if (!bomObj.approvedMountingType) {
            errorList.push(_mismatchMountingTypeError);
            tooltipList.push(generateDescription(bomObj, _mismatchMountingTypeError).split(':').slice(1).join(':').trim());
          }
          if (!bomObj.mismatchMountingTypeError) {
            bomObj.mismatchMountingTypeError = generateDescription(bomObj, _mismatchMountingTypeError);
          }
          if (!bomObj.approvedMountingType && bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) {
            bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
            bomObj.customerApprovalStepError = generateDescription(bomObj, _customerApprovalError);
          }
        }
        if (bomObj.mismatchRequiredProgrammingStep === false || bomObj.mismatchRequiredProgrammingStep === 0) {
          errorList.push(_mismatchRequiredProgrammingError);
          tooltipList.push(generateDescription(bomObj, _mismatchRequiredProgrammingError).split(':').slice(1).join(':').trim());
          if (!bomObj.mismatchRequiredProgrammingError) {
            bomObj.mismatchRequiredProgrammingError = generateDescription(bomObj, _mismatchRequiredProgrammingError);
          }
        }
        if (bomObj.mismatchColorStep === false || bomObj.mismatchColorStep === 0) {
          errorList.push(_mismatchColorError);
          tooltipList.push(generateDescription(bomObj, _mismatchColorError).split(':').slice(1).join(':').trim());
          if (!bomObj.mismatchColorError) {
            bomObj.mismatchColorError = generateDescription(bomObj, _mismatchColorError);
          }
        }
        if (bomObj.mappingPartProgramStep === false || bomObj.mappingPartProgramStep === 0) {
          errorList.push(_mappingPartProgramError);
          tooltipList.push(bomObj.mappingPartProgramError);
        }
        if (bomObj.mismatchFunctionalCategoryStep === false || bomObj.mismatchFunctionalCategoryStep === 0) {
          if (!bomObj.approvedMountingType) {
            errorList.push(_mismatchFunctionalCategoryError);
            tooltipList.push(generateDescription(bomObj, _mismatchFunctionalCategoryError).split(':').slice(1).join(':').trim());
          }
          if (!bomObj.mismatchFunctionalCategoryError) {
            bomObj.mismatchFunctionalCategoryError = generateDescription(bomObj, _mismatchFunctionalCategoryError);
          }
          if (!bomObj.approvedMountingType && bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) {
            bomObj.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
            bomObj.customerApprovalStepError = generateDescription(bomObj, _customerApprovalError);
          }
        }
        if (bomObj.mismatchCustomPartStep === false || bomObj.mismatchCustomPartStep === 0) {
          errorList.push(_mismatchCustomPartError);
          tooltipList.push(generateDescription(bomObj, _mismatchCustomPartError).split(':').slice(1).join(':').trim());
          if (!bomObj.mismatchCustomPartError) {
            bomObj.mismatchCustomPartError = generateDescription(bomObj, _mismatchCustomPartError);
          }
        }
        if (bomObj.restrictUseWithPermissionStep === false || bomObj.restrictUseWithPermissionStep === 0) {
          errorList.push(_restrictUseWithPermissionError);
          tooltipList.push(generateDescription(bomObj, _restrictUseWithPermissionError).split(':').slice(1).join(':').trim());
          if (!bomObj.restrictUseWithPermissionError) {
            bomObj.restrictUseWithPermissionError = generateDescription(bomObj, _restrictUseWithPermissionError);
          }
        }
        if (bomObj.restrictUsePermanentlyStep === false || bomObj.restrictUsePermanentlyStep === 0) {
          bomObj.customerApprovalStepError = null;
          errorList.push(_restrictUsePermanentlyError);
          tooltipList.push(generateDescription(bomObj, _restrictUsePermanentlyError).split(':').slice(1).join(':').trim());
          if (!bomObj.restrictUsePermanentlyError) {
            bomObj.restrictUsePermanentlyError = generateDescription(bomObj, _restrictUsePermanentlyError);
          }
        }
        if (bomObj.pickupPadRequiredStep === false || bomObj.pickupPadRequiredStep === 0) {
          errorList.push(_pickupPadRequiredError);
          tooltipList.push(generateDescription(bomObj, _pickupPadRequiredError).split(':').slice(1).join(':').trim());
        }
        if (bomObj.matingPartRquiredStep === false || bomObj.matingPartRquiredStep === 0) {
          errorList.push(_matingPartRequiredError);
          tooltipList.push(generateDescription(bomObj, _matingPartRequiredError).split(':').slice(1).join(':').trim());
          if (!bomObj.matingPartRequiredError) {
            bomObj.matingPartRequiredError = generateDescription(bomObj, _matingPartRequiredError);
          }
        }
        if (bomObj.suggestedGoodPartStep === false || bomObj.suggestedGoodPartStep === 0) {
          errorList.push(_suggestedGoodPartError);
          tooltipList.push(generateDescription(bomObj, _suggestedGoodPartError).split(':').slice(1).join(':').trim());
        }
        if (bomObj.driverToolsRequiredStep === false || bomObj.driverToolsRequiredStep === 0) {
          errorList.push(_driverToolsRequiredError);
          tooltipList.push(generateDescription(bomObj, _driverToolsRequiredError).split(':').slice(1).join(':').trim());
          if (!bomObj.driverToolsRequiredError) {
            bomObj.driverToolsRequiredError = generateDescription(bomObj, _driverToolsRequiredError);
          }
        }
        if (bomObj.functionalTestingRequiredStep === false || bomObj.functionalTestingRequiredStep === 0) {
          errorList.push(_functionalTestingRequiredError);
          tooltipList.push(generateDescription(bomObj, _functionalTestingRequiredError).split(':').slice(1).join(':').trim());
          if (!bomObj.functionalTestingRequiredError) {
            bomObj.functionalTestingRequiredError = generateDescription(bomObj, _functionalTestingRequiredError);
          }
        }
        if (bomObj.uomMismatchedStep === false || bomObj.uomMismatchedStep === 0) {
          errorList.push(_uomMismatchedError);
          tooltipList.push(generateDescription(bomObj, _uomMismatchedError).split(':').slice(1).join(':').trim());
          //_invalidCells.push([row, _colPartUOMIndex]);
        }
        if (bomObj.programingRequiredStep === false || bomObj.programingRequiredStep === 0) {
          errorList.push(_programingRequiredError);
          tooltipList.push(generateDescription(bomObj, _programingRequiredError).split(':').slice(1).join(':').trim());
          if (!bomObj.programingRequiredError) {
            bomObj.programingRequiredError = generateDescription(bomObj, _programingRequiredError);
          }
        }
        if (bomObj.mismatchProgrammingStatusStep === false || bomObj.mismatchProgrammingStatusStep === 0) {
          errorList.push(_mismatchProgrammingStatusError);
          tooltipList.push(generateDescription(bomObj, _mismatchProgrammingStatusError).split(':').slice(1).join(':').trim());
          if (!bomObj.mismatchProgrammingStatusError) {
            bomObj.mismatchProgrammingStatusError = generateDescription(bomObj, _mismatchProgrammingStatusError);
          }
        }
        if (bomObj.restrictUseInBOMStep) {
          errorList.push(_restrictUseInBOMError);
          tooltipList.push(generateDescription(bomObj, _restrictUseInBOMError).split(':').slice(1).join(':').trim());
          bomObj.restrictUseInBOMError = generateDescription(bomObj, _restrictUseInBOMError);
        }
        if (bomObj.restrictUseInBOMExcludingAliasStep) {
          errorList.push(_restrictUseInBOMExcludingAliasError);
          tooltipList.push(generateDescription(bomObj, _restrictUseInBOMExcludingAliasError).split(':').slice(1).join(':').trim());
          bomObj.restrictUseInBOMExcludingAliasError = generateDescription(bomObj, _restrictUseInBOMExcludingAliasError);
        }
        if (bomObj.restrictUseInBOMExcludingAliasWithPermissionStep) {
          errorList.push(_restrictUseInBOMExcludingAliasWithPermissionError);
          tooltipList.push(generateDescription(bomObj, _restrictUseInBOMExcludingAliasWithPermissionError).split(':').slice(1).join(':').trim());
          bomObj.restrictUseInBOMExcludingAliasWithPermissionError = generateDescription(bomObj, _restrictUseInBOMExcludingAliasWithPermissionError);
        }
        if (bomObj.restrictUseInBOMWithPermissionStep) {
          errorList.push(_restrictUseInBOMWithPermissionError);
          tooltipList.push(generateDescription(bomObj, _restrictUseInBOMWithPermissionError).split(':').slice(1).join(':').trim());
          bomObj.restrictUseInBOMWithPermissionError = generateDescription(bomObj, _restrictUseInBOMWithPermissionError);
        }
        if (bomObj.restrictUseExcludingAliasStep === false || bomObj.restrictUseExcludingAliasStep === 0) {
          bomObj.customerApprovalStepError = null;
          errorList.push(_restrictUseExcludingAliasError);
          tooltipList.push(generateDescription(bomObj, _restrictUseExcludingAliasError).split(':').slice(1).join(':').trim());
          if (!bomObj.restrictUseExcludingAliasError) {
            bomObj.restrictUseExcludingAliasError = generateDescription(bomObj, _restrictUseExcludingAliasError);
          }
        }
        if (bomObj.restrictUseExcludingAliasWithPermissionStep === false || bomObj.restrictUseExcludingAliasWithPermissionStep === 0) {
          errorList.push(_restrictUseExcludingAliasWithPermissionError);
          tooltipList.push(generateDescription(bomObj, _restrictUseExcludingAliasWithPermissionError).split(':').slice(1).join(':').trim());
          if (!bomObj.restrictUseExcludingAliasWithPermissionError) {
            bomObj.restrictUseExcludingAliasWithPermissionError = generateDescription(bomObj, _restrictUseExcludingAliasWithPermissionError);
          }
        }
        if ((bomObj.mismatchCPNandCustpartRevStep === false || bomObj.mismatchCPNandCustpartRevStep === 0) && bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
          errorList.push(_mismatchCPNandCustpartRevError);
          tooltipList.push(generateDescription(bomObj, _mismatchCPNandCustpartRevError).split(':').slice(1).join(':').trim());
          if (!bomObj.mismatchCPNandCustpartRevError) {
            bomObj.mismatchCPNandCustpartRevError = generateDescription(bomObj, _mismatchCPNandCustpartRevError);
          }
        }
        if (bomObj.mismatchCustpartRevStep === false || bomObj.mismatchCustpartRevStep === 0) {
          errorList.push(_mismatchCustpartRevError);
          tooltipList.push(generateDescription(bomObj, _mismatchCustpartRevError).split(':').slice(1).join(':').trim());
          if (!bomObj.mismatchCustpartRevError) {
            bomObj.mismatchCustpartRevError = generateDescription(bomObj, _mismatchCustpartRevError);
          }
        }
        if (bomObj.isMPNAddedinCPN === false || bomObj.isMPNAddedinCPN === 0) {
          if (bomObj.custPN && bomObj.customerRev && bomObj.mfgPNID) {
            bomObj.MPNNotAddedinCPNError = generateDescription(bomObj, _MPNNotAddedinCPNError);
          } else {
            const lineObj = _.find(vm.refBomModel, (x) => x._lineID === bomObj._lineID && (x.lineID !== null || x.lineID !== undefined));
            if (lineObj) {
              bomObj.custPN = lineObj.custPN;
              bomObj.customerRev = lineObj.customerRev;
              bomObj.MPNNotAddedinCPNError = generateDescription(bomObj, _MPNNotAddedinCPNError);
            }
          }
          errorList.push(_MPNNotAddedinCPNError);
        }
        bomObj.restrictCPNUseWithPermissionError = null;
        if (bomObj.mfgPNID && (bomObj.restrictCPNUseWithPermissionStep === false || bomObj.restrictCPNUseWithPermissionStep === 0)) {
          bomObj.customerApprovalStepError = null;
          errorList.push(_restrictCPNUseWithPermissionError);
          tooltipList.push(generateDescription(bomObj, _restrictCPNUseWithPermissionError).split(':').slice(1).join(':').trim());
          if (!bomObj.restrictCPNUseWithPermissionError) {
            bomObj.restrictCPNUseWithPermissionError = generateDescription(bomObj, _restrictCPNUseWithPermissionError);
          }
        }
        bomObj.restrictCPNUsePermanentlyError = null;
        if (bomObj.mfgPNID && (bomObj.restrictCPNUsePermanentlyStep === false || bomObj.restrictCPNUsePermanentlyStep === 0)) {
          errorList.push(_restrictCPNUsePermanentlyError);
          tooltipList.push(generateDescription(bomObj, _restrictCPNUsePermanentlyError).split(':').slice(1).join(':').trim());
          if (!bomObj.restrictCPNUsePermanentlyError) {
            bomObj.restrictCPNUsePermanentlyError = generateDescription(bomObj, _restrictCPNUsePermanentlyError);
          }
        }
        if (bomObj.mfgPNID && bomObj.restrictCPNUseInBOMStep) {
          errorList.push(_restrictCPNUseInBOMError);
          tooltipList.push(generateDescription(bomObj, _restrictCPNUseInBOMError).split(':').slice(1).join(':').trim());
          bomObj.restrictCPNUseInBOMError = generateDescription(bomObj, _restrictCPNUseInBOMError);
        }
        if (bomObj.acquisitionDetail && bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) {
          tooltipList.push(bomObj.acquisitionDetail);
        }
        if (bomObj.suggestedByApplicationStep !== vm.PartSuggestType.default.id) {
          switch (bomObj.suggestedByApplicationStep) {
            case vm.PartSuggestType.suggestedAlternatePart.id: {
              errorList.push(_suggestAlternatePartError);
              tooltipList.push(bomObj.suggestedByApplicationMsg);
              break;
            }
            case vm.PartSuggestType.suggestedMFRMapping.id: {
              errorList.push(_suggestMFRMappingError);
              tooltipList.push(bomObj.suggestedByApplicationMsg);
              break;
            }
            case vm.PartSuggestType.suggestedPackagingPart.id: {
              errorList.push(_suggestPackagingPartError);
              tooltipList.push(bomObj.suggestedByApplicationMsg);
              break;
            }
            case vm.PartSuggestType.suggestedProcessMaterialPart.id: {
              errorList.push(_suggestProcessMaterialPartError);
              tooltipList.push(bomObj.suggestedByApplicationMsg);
              break;
            }
            case vm.PartSuggestType.suggestedRoHSReplacementPart.id: {
              errorList.push(_suggestRoHSReplacementPartError);
              tooltipList.push(bomObj.suggestedByApplicationMsg);
              break;
            }
            default: {
              bomObj.suggestedByApplicationStep = vm.PartSuggestType.default.id;
              bomObj.suggestedByApplicationMsg = null;;
              break;
            }
          }
        }
        if (errorMFG || errorMFGPN) {
          const priorErrorObj = _.sortBy(errorList, (x) => x.displayOrder || 0)[0];
          bomObj.mfgErrorColor = priorErrorObj.errorColor;
          _invalidCells.push([row, _colMfgCodeIndex]);

          bomObj.mfgPNErrorColor = priorErrorObj.errorColor;
          _invalidCells.push([row, _colMfgPNIndex]);

          //bomObj.mfgTooltip = (errorMFG || errorMFGPN).displayName;
          bomObj.mfgTooltip = tooltipList.join('\n');
        }
        else if (errorList.length > 0) {
          const priorErrorObj = _.sortBy(errorList, (x) => x.displayOrder || 0)[0];
          bomObj.mfgErrorColor = priorErrorObj.errorColor;
          bomObj.mfgPNErrorColor = priorErrorObj.errorColor;

          // Obsolete Error Color Show As per Part Status
          if (priorErrorObj.errorColor === _obsoleteColor) {
            bomObj.mfgErrorColor = bomObj.partStatuscolorCode;
            bomObj.mfgPNErrorColor = bomObj.partStatuscolorCode;
          }

          bomObj.mfgTooltip = tooltipList.join('\n\n');
          //bomObj.mfgTooltip = priorErrorObj.displayName;
          bomObj.obsoleteErrorOnly = false;
          if (bomObj.isObsolete) {
            if (!(errorList.length === 1 && !bomObj.obsoletePartStep && !bomObj.isObsoleteLine)) {
              _invalidCells.push([row, _colMfgCodeIndex]);
              _invalidCells.push([row, _colMfgPNIndex]);
            }
            else {
              bomObj.obsoleteErrorOnly = true;
              _.remove(_invalidCells, (x) => x[0] === row && (x[1] === _colMfgCodeIndex || x[1] === _colMfgPNIndex));
            }
          }
        }
        else {
          if (bomObj.mfgVerificationStep || bomObj.mfgDistMappingStep || bomObj.obsoletePartStep || bomObj.mfgGoodPartMappingStep || bomObj.nonRohsStep || bomObj.invalidConnectorTypeStep || bomObj.duplicateMPNStep || bomObj.mismatchMountingTypeStep || bomObj.mismatchRequiredProgrammingStep || bomObj.mismatchFunctionalCategoryStep || bomObj.restrictUsePermanentlyStep || bomObj.restrictUseWithPermissionStep || bomObj.restrictUseExcludingAliasStep || bomObj.restrictUseExcludingAliasWithPermissionStep || bomObj.pickupPadRequiredStep || bomObj.matingPartRquiredStep || bomObj.driverToolsRequiredStep || bomObj.functionalTestingRequiredStep || bomObj.exportControlledStep || bomObj.unknownPartStep || bomObj.defaultInvalidMFRStep) {
            if (bomObj.mfgCode && bomObj.mfgPN) {
              if (bomObj.refMainCategoryID === vm.RoHSMainCategory.NonRoHS && _isAssyRoHS && bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                bomObj.mfgPNErrorColor = _nonRoHSColor;
                bomObj.mfgErrorColor = _nonRoHSColor;
                bomObj.mfgTooltip = null;
              }
              else if (!bomObj.mfgPNID && bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) {
                bomObj.mfgErrorColor = null;
                bomObj.mfgPNErrorColor = null;
                bomObj.mfgTooltip = null;
              }
              else if (bomObj.mfgCodeID && bomObj.mfgPNID && bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) {
                bomObj.mfgErrorColor = _;
                bomObj.mfgPNErrorColor = null;
                bomObj.mfgTooltip = null;
              }
              else if (bomObj.mfgCodeID && bomObj.mfgPNID && bomObj.mfgVerificationStep) {
                bomObj.mfgErrorColor = _successColor;
                bomObj.mfgPNErrorColor = _successColor;
                bomObj.mfgTooltip = null;
              }
              _.remove(_invalidCells, (x) => x[0] === row && (x[1] === _colMfgCodeIndex || x[1] === _colMfgPNIndex));
            }
            else {
              bomObj.mfgErrorColor = null;
              bomObj.mfgPNErrorColor = null;
              bomObj.mfgTooltip = null;
              _.remove(_invalidCells, (x) => x[0] === row && (x[1] === _colMfgCodeIndex || x[1] === _colMfgPNIndex));
            }
            //setHeaderStyle();
          }
          else if (bomObj.mfgCodeStep && bomObj.mfgPNStep) {
            bomObj.mfgErrorColor = _successColor;
            bomObj.mfgPNErrorColor = _successColor;
            bomObj.mfgTooltip = null;
            _.remove(_invalidCells, (x) => x[0] === row && (x[1] === _colMfgCodeIndex || x[1] === _colMfgPNIndex));
            //setHeaderStyle();
          } else {
            bomObj.mfgErrorColor = null;
            bomObj.mfgPNErrorColor = null;
            bomObj.mfgTooltip = null;
            _.remove(_invalidCells, (x) => x[0] === row && (x[1] === _colMfgCodeIndex || x[1] === _colMfgPNIndex));
          }
        }
        //Remove Error Color if part only for allow customer approval
        if (bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED && !isBOMObjInValid(partInvalidMatchList, bomObj) && (bomObj.suggestedByApplicationStep === vm.PartSuggestType.default.id) && bomObj.mfgErrorColor !== _mappingPartProgramError.errorColor && bomObj.mfgErrorColor !== _MPNNotAddedinCPNError.errorColor) {
          bomObj.mfgErrorColor = _successColor;
          bomObj.mfgPNErrorColor = _successColor;
          _.remove(_invalidCells, (x) => x[0] === row && (x[1] === _colMfgCodeIndex || x[1] === _colMfgPNIndex));
        }

        if (errorList.length > 0 && !isBOMObjInValidForCPN(partInvalidMatchList, bomObj)) {
          const priorErrorObj = _.sortBy(errorList, (x) => x.displayOrder || 0)[0];
          bomObj.mfgErrorColor = priorErrorObj.errorColor;
          bomObj.mfgPNErrorColor = priorErrorObj.errorColor;
        }

        if (!bomObj.mfgCode) {
          bomObj.mfgErrorColor = _errorColor;
          _invalidCells.push([row, _colMfgCodeIndex]);
        }

        if (!bomObj.mfgPN) {
          bomObj.mfgPNErrorColor = _errorColor;
          _invalidCells.push([row, _colMfgPNIndex]);
        }

        if (bomObj.mfgPNID && bomObj.mismatchValueStep === false || bomObj.mismatchPackageStep === false || bomObj.mismatchPowerStep === false
          || bomObj.mismatchToleranceStep === false || bomObj.mismatchTempratureStep === false || bomObj.mismatchColorStep === false) {
          if (!bomObj.mismatchValueStep) {
            bomObj.mfgValueTooltip = CORE.MESSAGE_CONSTANT.ALTERNATE_MFGPN_VALUE_MISMATCHED_MESSAGE;
          }
          if (!bomObj.mismatchPackageStep) {
            bomObj.mfgPackageTooltip = CORE.MESSAGE_CONSTANT.ALTERNATE_MFGPN_PACKAGE_MISMATCHED_MESSAGE;
          }
          if (!bomObj.mismatchPowerStep) {
            bomObj.mfgpowerTooltip = CORE.MESSAGE_CONSTANT.ALTERNATE_MFGPN_POWER_MISMATCHED_MESSAGE;
          }
          if (!bomObj.mismatchToleranceStep) {
            bomObj.mfgToleranceTooltip = CORE.MESSAGE_CONSTANT.ALTERNATE_MFGPN_TOLERANCE_MISMATCHED_MESSAGE;
          }
          if (!bomObj.mismatchColorStep) {
            bomObj.mfgColorTooltip = CORE.MESSAGE_CONSTANT.ALTERNATE_MFGPN_COLOR_MISMATCHED_MESSAGE;
          }
          if (!bomObj.mismatchTempratureStep) {
            bomObj.mfgTempratureTooltip = CORE.MESSAGE_CONSTANT.ALTERNATE_MFGPN_TEMPERATURE_MISMATCHED_MESSAGE;
          }
        }

        bomObj.description = getDescriptionForLine(bomObj);
      }

      function distVerificationStepFn(bomObj, row) {
        if (row === null) {
          row = vm.bomModel.indexOf(bomObj);
        }

        row = parseInt(row);
        const errorList = [];
        let errorDist = null;
        let errorDistPN = null;
        const tooltipList = [];
        if (bomObj.distVerificationStep === false || bomObj.distVerificationStep === 0) {
          errorList.push(_distVerificationError);
          tooltipList.push(generateDescription(bomObj, _distVerificationError).split(':').slice(1).join(':').trim());
        }
        if (bomObj.mfgDistMappingStep === false || bomObj.mfgDistMappingStep === 0) {
          errorList.push(_mfgDistMappingError);
          tooltipList.push(generateDescription(bomObj, _mfgDistMappingError).split(':').slice(1).join(':').trim());
        }
        if (bomObj.getMFGPNStep === false || bomObj.getMFGPNStep === 0) {
          errorList.push(_getMFGPNError);
          tooltipList.push(generateDescription(bomObj, _getMFGPNError).split(':').slice(1).join(':').trim());
        }
        if (bomObj.distGoodPartMappingStep === false || bomObj.distGoodPartMappingStep === 0) {
          errorList.push(_distGoodPartMappingError);
          tooltipList.push(generateDescription(bomObj, _distGoodPartMappingError).split(':').slice(1).join(':').trim());
        }
        if (bomObj.suggestedGoodDistPartStep === false || bomObj.suggestedGoodDistPartStep === 0) {
          errorList.push(_suggestedGoodDistPartError);
          tooltipList.push(generateDescription(bomObj, _suggestedGoodDistPartError).split(':').slice(1).join(':').trim());
        }
        if (bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING && bomObj.distMfgPNID) {
          errorList.push(_customerApprovalError);
          bomObj.customerApprovalStepError = generateDescription(bomObj, _customerApprovalError);
          tooltipList.push(generateDescription(bomObj, _customerApprovalError).split(':').slice(1).join(':').trim());
          if (bomObj.distAcquisitionDetail) {
            tooltipList.push(bomObj.distAcquisitionDetail);
          }
        }

        if (bomObj.distCodeStep === false || bomObj.distCodeStep === 0) {
          errorDist = _distInvalidError;
          errorList.push(_distInvalidError);
          tooltipList.push(generateDescription(bomObj, _distInvalidError).split(':').slice(1).join(':').trim());
        }
        if (bomObj.distPNStep === false || bomObj.distPNStep === 0) {
          errorDistPN = _distPNInvalidError;
          errorList.push(_distPNInvalidError);
          tooltipList.push(generateDescription(bomObj, _distPNInvalidError).split(':').slice(1).join(':').trim());
        }
        if (errorDist || errorDistPN) {
          const priorErrorObj = _.sortBy(errorList, 'displayOrder')[0];
          bomObj.distErrorColor = priorErrorObj.errorColor;
          bomObj.distPNErrorColor = priorErrorObj.errorColor;
          bomObj.distTooltip = bomObj.distPNTooltip = tooltipList.join('\n\n');
          _invalidCells.push([row, _colDistributorIndex]);
          _invalidCells.push([row, _colDistPNIndex]);
        }
        else if (errorList.length) {
          const priorErrorObj = _.sortBy(errorList, 'displayOrder')[0];

          // If customer approval error and not any info. or dirty then make cell BG blank
          if (priorErrorObj.displayOrder === _customerApprovalError.displayOrder && !bomObj.distributor && !bomObj.distPN) {
            bomObj.distErrorColor = null;
            bomObj.distPNErrorColor = null;
            bomObj.distTooltip = bomObj.distPNTooltip = null;

            _.remove(_invalidCells, (x) => x[0] === row && (x[1] === _colDistributorIndex || x[1] === _colDistPNIndex));
          }
          else {
            bomObj.distErrorColor = priorErrorObj.errorColor;
            bomObj.distPNErrorColor = priorErrorObj.errorColor;
            bomObj.distPNTooltip = bomObj.distTooltip = tooltipList.join('\n\n');

            _invalidCells.push([row, _colDistributorIndex]);
            _invalidCells.push([row, _colDistPNIndex]);
          }
        }
        else {
          if (bomObj.distVerificationStep || bomObj.mfgDistMappingStep || bomObj.getMFGPNStep || bomObj.distGoodPartMappingStep || bomObj.suggestedGoodDistPartStep) {
            if (bomObj.distributor && bomObj.distPN && bomObj.distMfgPNID) {
              bomObj.distErrorColor = _successColor;
              bomObj.distPNErrorColor = _successColor;
              bomObj.distTooltip = bomObj.distPNTooltip = null;
              _.remove(_invalidCells, (x) => x[0] === row && (x[1] === _colDistributorIndex || x[1] === _colDistPNIndex));
            }
            else {
              bomObj.distErrorColor = null;
              bomObj.distPNErrorColor = null;
              bomObj.distTooltip = bomObj.distPNTooltip = null;
              _.remove(_invalidCells, (x) => x[0] === row && (x[1] === _colDistributorIndex || x[1] === _colDistPNIndex));
            }
          }
          else if (bomObj.distCodeStep && bomObj.distPNStep && bomObj.distMfgPNID) {
            bomObj.distErrorColor = _successColor;
            bomObj.distPNErrorColor = _successColor;
            bomObj.distTooltip = bomObj.distPNTooltip = null;
            _.remove(_invalidCells, (x) => x[0] === row && (x[1] === _colDistributorIndex || x[1] === _colDistPNIndex));
          }
          else {
            bomObj.distErrorColor = null;
            bomObj.distPNErrorColor = null;
            bomObj.distTooltip = bomObj.distPNTooltip = null;
            _.remove(_invalidCells, (x) => x[0] === row && (x[1] === _colDistributorIndex || x[1] === _colDistPNIndex));
          }
        }

        bomObj.description = getDescriptionForLine(bomObj);
      }
      // [E] Cell validation color

      // Get Merge Cell information row wise
      function getMergeCellInfoByRow(row) {
        if (_hotRegisterer) {
          const mergeCellsPlugin = _hotRegisterer.getPlugin('MergeCells');
          const mergedCellInfo = mergeCellsPlugin.mergedCellsCollection.get(row, 0);
          return mergedCellInfo;
        }
      }

      // Create dummy event to bind theme to all pop-ups which are opening from handsontable
      // Handsontable context menu callback does not give event.
      // Temporary solution
      vm.dummyEvent = ($event) => {
        _dummyEvent = $event;
      };

      /* open pop-up for Copy existing bom from other RFQ assembly */
      // Not in Use
      vm.copyBOM = (ev) => {
        const obj = {
          rfqAssyID: _rfqAssyID, IsCopyPricing: false, partID: _partID
        };
        DialogFactory.dialogService(
          RFQTRANSACTION.COPY_BOM_CONTROLLER,
          RFQTRANSACTION.COPY_BOM_VIEW,
          ev,
          obj).then(() => {
            $scope.$emit('isBOMVerified', true);
            return getRFQLineItemsByID().then((response) => {
              if (response) {
                displayRFQLineItemsByID(response);
                $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion);
              }
            });
          }, (err) => BaseService.getErrorLog(err));
      };

      /* open pop-up for Copy existing bom from other RFQ assembly */
      vm.addCustomerAVL = (ev) => {
        if (vm.isBOMReadOnly) {
          return false;
        }
        const obj = {
          rfqAssyID: _rfqAssyID,
          lineItemsHeaders: _lineItemsHeaders,
          partID: _partID
        };
        DialogFactory.dialogService(
          RFQTRANSACTION.IMPORT_CUSTOMER_AVL_CONTROLLER,
          RFQTRANSACTION.IMPORT_CUSTOMER_AVL_VIEW,
          ev,
          obj).then((result) => {
            vm.refreshBOMMaster();
            saveUploadedBOM(result.BOMArray, result.header);
          }, (err) => BaseService.getErrorLog(err));
      };
      // Column mapping for BOM Upload
      function columnMappingStepFn(bomArray) {
        var data = {
          lineItemsHeaders: _lineItemsHeaders,
          excelHeaders: bomArray[0],
          skipFocusOnFirstElement: true
        };

        DialogFactory.dialogService(
          RFQTRANSACTION.BOM_COLUMN_MAPPING_CONTROLLER,
          RFQTRANSACTION.BOM_COLUMN_MAPPING_VIEW,
          _dummyEvent,
          data).then((result) => {
            vm.refreshBOMMaster();
            isBOMInserted = false;
            saveUploadedBOM(bomArray, result);
          }, () => {
            if (isBOMInserted) {
              isBOMInserted = false;
              vm.cgBusyLoading = getRFQLineItemsByID().then((response) => {
                if (response) {
                  displayRFQLineItemsByID(response);
                }
              });
            }
          }, (err) => BaseService.getErrorLog(err));
      };

      //close pop-up on destroy page
      $scope.$on('$destroy', () => {
        //isSummarySubmitted();
        BOMremoveSocketListener();
        revisedquote();
        UpdateInternalVersion();
        $mdDialog.hide(false, {
          closeAll: true
        });
      });
      function saveUploadedBOM(uploadedBOM, bomHeaders) {
        hotRegisterer.removeInstance('hot-bom');
        _hotRegisterer = hotRegisterer.getInstance('hot-bom');

        vm.sourceHeader = null;

        initSourceHeader(_lineItemsHeaders);
        generateModel(uploadedBOM, bomHeaders);
        mergeCommonCells();
        checkInvalidLineDescription();
      }

      /* open pop-up for ErrorCode Legend */
      vm.getErrorCodeColor = (ev) => {
        DialogFactory.dialogService(
          RFQTRANSACTION.RFQ_ERRORCODE_LEGEND_CONTROLLER,
          RFQTRANSACTION.RFQ_ERRORCODE_LEGEND_VIEW,
          ev,
          null).then(() => { }, () => { getErrorCode(); }, (err) => BaseService.getErrorLog(err));
      };
      // Add New line in BOM
      vm.addNewLine = () => {
        const unit = _.find(_unitList, (y) => {
          if (y.unitName && y.unitName.toUpperCase() === CORE.UOM_DEFAULTS.EACH.NAME.toUpperCase() || y.alias && y.alias.length > 0 && y.alias.find((x) => x.alias.toUpperCase() === CORE.UOM_DEFAULTS.EACH.NAME.toUpperCase())) {
            return y;
          }
        });
        if (vm.bomModel && vm.bomModel.length > 0) {
          vm.bomModel.splice(vm.bomModel.length - 1, 0, {
            item: '',
            uomID: unit ? unit.unitName : CORE.UOM_DEFAULTS.EACH.NAME,
            programingStatus: _programingStatusList[0].value,
            isInstall: true,
            isPurchase: true,
            substitutesAllow: _substitutesAllowList[0].value,
            isBuyDNPQty: _buyDNPQTYList[0].value,
            customerApproval: RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING
          });
        }
        else {
          vm.refBomModel.push({
            item: '',
            uomID: unit ? unit.unitName : CORE.UOM_DEFAULTS.EACH.NAME,
            programingStatus: _programingStatusList[0].value,
            isInstall: true,
            isPurchase: true,
            substitutesAllow: _substitutesAllowList[0].value,
            isBuyDNPQty: _buyDNPQTYList[0].value,
            customerApproval: RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING
          });
        }
        vm.isBOMChanged = BOMFactory.isBOMChanged = true;
        BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];
        //Clone Object
        updateCloneObject(false);
      };

      //var model = {
      //  accessRole: null,
      //  accessLevel: null,
      //  isValidate: true
      //};
      //  check and get access level for mfg code change
      function getAccessLavel() {
        return ManufacturerFactory.getAcessLeval().query({ access: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS }).$promise.then((response) => {
          if (response && response.data) {
            //model.accessRole = response.data.name;
            //model.accessLevel = response.data.accessLevel;
            vm.allowAccess = false;
            const currentLoginUserRole = _.find(vm.loginUser.roles, { id: vm.loginUser.defaultLoginRoleID });
            if (currentLoginUserRole && currentLoginUserRole.accessLevel <= response.data.accessLevel) {
              vm.allowAccess = true;
            }
            //_.each(vm.loginUser.roles, function (item) {
            //  if (item.accessLevel <= response.data.accessLevel) { // && vm.loginUser.defaultLoginRoleID == item.id
            //    vm.allowAccess = true;
            //  }
            //});
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      // Windows resize event
      $(window).resize(() => {
        handsontableresize();
      });
      // Handsontable resize function
      function handsontableresize() {
        var offset = $('#hot-bom-container').offset();
        if (!offset) {
          return;
        }
        const docHeight = $(document).height();
        const tableHeight = docHeight - offset.top - 100;
        $('#hot-bom-container').height(tableHeight);
        $timeout(() => {
          setHeaderStyle();
        });
      };

      /* Open pop-up for display history of entry change */
      vm.rfqShowHistory = ($event) => {
        const data = {
          partID: _partID,
          assemblyNumber: vm.PIDCode,
          assemblyRev: vm.Rev,
          narrative: false,
          title: CORE.BOMVersionHistoryPopUpTitle.ASSY_BOM
        };

        DialogFactory.dialogService(
          RFQTRANSACTION.BOM_HISTORY_POPUP_CONTROLLER,
          RFQTRANSACTION.BOM_HISTORY_POPUP_VIEW,
          $event,
          data).then(() => {
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
      };

      /* Open pop-up for display history of narrative */
      vm.showNarrativeHistory = ($event, itemID) => {
        const data = {
          partID: _partID,
          assemblyNumber: vm.PIDCode,
          assemblyRev: vm.Rev,
          narrative: true,
          itemID: itemID,
          title: CORE.BOMVersionHistoryPopUpTitle.RANDD_STATUS
        };

        DialogFactory.dialogService(
          RFQTRANSACTION.BOM_HISTORY_POPUP_CONTROLLER,
          RFQTRANSACTION.BOM_HISTORY_POPUP_VIEW,
          $event,
          data).then(() => {
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
      };
      // Additional comment pop-up
      vm.addAdditionalComment = ($event, objBom) => {
        // deselected current cell so we can have a focus on pop-up element
        _hotRegisterer.deselectCell();

        const data = {
          partID: _partID,
          lineID: objBom._lineID,
          description: objBom.additionalComment,
          rfqLineItemID: objBom.id,
          id: objBom.additionalCommentId
        };

        DialogFactory.dialogService(
          RFQTRANSACTION.BOM_LINE_ADDITIONAL_COMMENT_POPUP_CONTROLLER,
          RFQTRANSACTION.BOM_LINE_ADDITIONAL_COMMENT_POPUP_VIEW,
          _dummyEvent, data).then((objAdditionalComment) => {
            if (objAdditionalComment && objAdditionalComment.lineitemsDescription && objAdditionalComment.lineitemsDescription.length > 0) {
              _.each(objAdditionalComment.lineitemsDescription, (objLinedesc) => {
                const objAlternateline = _.filter(vm.refBomModel, (objBOMLine) => objBOMLine._lineID === objLinedesc.lineID && objBOMLine.id === objLinedesc.rfqLineItemID);
                _.map(objAlternateline, (data) => { data.additionalComment = objLinedesc.description; data.additionalCommentId = objLinedesc.id; });
              });
            }
            $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion);
          }, () => {
            // Empty
          }, (err) => BaseService.getErrorLog(err));
      };
      // Check any changes in BOM
      vm.checkBOMChanged = () => {
        if (vm.isBOMChanged || _.some(vm.bomModel, (x) => x.isUpdate === true)) {
          return true;
        }
        return false;
      };
      // Epoxy material pop-up
      function epoxyMaterialProcessPopup(bomObj) {
        var data = {
          componentID: bomObj.mfgPNID
        };
        DialogFactory.dialogService(
          CORE.EPOXY_PROCESS_MATERIAL_PART_MODAL_CONTROLLER,
          CORE.EPOXY_PROCESS_MATERIAL_PART_MODAL_VIEW,
          _dummyEvent,
          data).then((data) => {
            if (data) {
              addEpoxyProcessMaterialParts(bomObj, data);
            }
          }, () => {
          });
      };
      // Add Epoxy material process part in BOM
      function addEpoxyProcessMaterialParts(bomObj, epoxyPartArr) {
        var row = vm.bomModel.indexOf(bomObj);
        var lineItemParts = [];
        var newItems = [];
        var availableParts = [];

        lineItemParts.push({
          mfgCode: bomObj.mfgCode,
          mfgPN: bomObj.mfgPN
        });

        epoxyPartArr.forEach((item) => {
          var isExists = _.some(vm.refBomModel, (part) => (item.mfgName || item.mfgPN) && item.mfgName === part.mfgCode && item.mfgPN === part.mfgPN);
          if (!isExists) {
            newItems.push(item);
          } else {
            availableParts.push(item);
          }
        });

        if (availableParts.length > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.SUGGESTED_PARTS_ALREADY_AVAILABLE);
          messageContent.message = stringFormat(messageContent.message, 'process material', 'BOM');
          const subMessage = [];
          const message = messageContent.message + '<br/><br/><table style=\'width:100%\'><thead><tr><th class=\'border-bottom padding-5\'>#</th><th class=\'border-bottom padding-5\'>' + vm.LabelConstant.MFG + '</th><th class=\'border-bottom padding-5\'>' + vm.LabelConstant.MFGPN + '</th></tr></thead><tbody>{0}</tbody></table>';
          _.each(availableParts, (item, index) => {
            subMessage.push('<tr><td class="border-bottom padding-5">' + (index + 1) + '</td><td class="border-bottom padding-5">' + item.mfgName + '</td><td class="border-bottom padding-5">' + item.mfgPN + '</td></tr>');
          });
          messageContent.message = stringFormat(message, subMessage);

          const obj = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(obj);
        }
        if (!newItems.length) {
          return;
        }

        _suggestProcessMaterialPartError.description = stringFormat(_suggestProcessMaterialPartError.description, bomObj.mfgCode + ' ' + bomObj.mfgPN);
        const suggestedPartType = {
          partSuggestType: vm.PartSuggestType.suggestedProcessMaterialPart.id,
          partSuggestMsg: _suggestProcessMaterialPartError
        };
        newItems.forEach((item, index) => {
          var lineID = bomObj._lineID + ((index + 1) * 0.1);
          var isValidLineID = false;
          while (!isValidLineID) {
            const isExistLineID = _.some(vm.bomModel, (item) => item.lineID === lineID);
            if (isExistLineID) {
              lineID = Math.round((lineID + 0.1) * 1000) / 1000;
            } else {
              isValidLineID = true;
            }
          }
          const model = {
            _lineID: lineID,
            cust_lineID: lineID,
            lineID: lineID,
            qpa: 1,
            mfgCode: item.mfgName,
            mfgPN: item.mfgPN,
            mfgCodeStep: true,
            mfgCodeStepError: null,
            mfgPNStep: true,
            mfgPNStepError: null,
            defaultInvalidMFRStep: true,
            defaultInvalidMFRError: null,
            customerApproval: RFQTRANSACTION.CUSTOMER_APPROVAL.NONE,
            customerApprovalStepError: null,
            suggestedByApplicationStep: suggestedPartType.partSuggestType,
            isInstall: true,
            isPurchase: true,
            isBuyDNPQty: _buyDNPQTYList[0].value,
            uomID: CORE.UOM_DEFAULTS.EACH.NAME,
            programingStatus: _programingStatusList[0].value,
            substitutesAllow: _substitutesAllowList[0].value
          };
          model.suggestedByApplicationMsg = generateDescription(model, suggestedPartType.partSuggestMsg).split(':').slice(1).join(':');
          const rowIndex = row + 1 + index;
          vm.bomModel.splice(rowIndex, 0, model);

          _invalidCells.forEach((item) => {
            if (item[0] >= rowIndex) {
              item[0] = item[0] + 1;
            }
          });

          mfgVerificationStepFn(model, row);
        });
        if (_hotRegisterer) {
          _hotRegisterer.validateCells();
        }
        $timeout(() => {
          setHeaderStyle();
          mergeCommonCells();
        });
      }
      // Add CPN Alternate part in BOM
      function addCPNAlternateParts(bomObj, alternatePartArr, isRemove, colIndex) {
        var row = vm.refBomModel.indexOf(bomObj);
        var mergedCellInfo = _.filter(vm.refBomModel, { '_lineID': (bomObj.lineID ? bomObj.lineID : bomObj._lineID) }); // getMergeCellInfoByRow(row);
        var lineItemParts = [];
        var lineWithID = [];
        var newItems = [];
        if (mergedCellInfo && mergedCellInfo.length > 0) {
          _.each(mergedCellInfo, (item) => {
            if (item.mfgCode && item.mfgPN) {
              lineItemParts.push(item);
            }
            if (item.id && item.rfqAlternatePartID) {
              lineWithID.push(item);
            }
          });
        }
        else {
          lineItemParts.push(bomObj);
        }

        alternatePartArr.forEach((item) => {
          var isExists = _.some(lineItemParts, (part) => (item.id && item.id === part.mfgPNID || ((item.mfgCode || item.mfgPN) && item.mfgCode.toUpperCase() === part.mfgCode.toUpperCase() && item.mfgPN.toUpperCase() === part.mfgPN.toUpperCase())));
          if (!isExists) {
            newItems.push(item);
          }
        });

        lineItemParts.forEach((part) => {
          var isExists = _.find(alternatePartArr, (item) => (item.id && item.id === part.mfgPNID || ((item.mfgCode || item.mfgPN) && item.mfgCode.toUpperCase() === part.mfgCode.toUpperCase() && item.mfgPN.toUpperCase() === part.mfgPN.toUpperCase())));
          if (!isExists && !part.AddedinCPN && part.custPNID !== part.mfgPNID) {
            if (part.mfgPNID !== CORE.TBDMFRPNID && part.mfgPNID !== CORE.NOTACOMPOONENTMFRPNID && part.mfgPNID !== CORE.NOTAVAILABLEMFRPNID && part.mfgPNID !== CORE.ANYMFRPNID) {
              part.isMPNAddedinCPN = false;
              if (part.custPN && part.customerRev) {
                part.MPNNotAddedinCPNError = generateDescription(part, _MPNNotAddedinCPNError);
              } else {
                const lineObj = _.find(lineItemParts, (x) => x._lineID === part._lineID && (x.lineID !== null || x.lineID !== undefined));
                if (lineObj) {
                  part.custPN = lineObj.custPN;
                  part.customerRev = lineObj.customerRev;
                  part.MPNNotAddedinCPNError = generateDescription(part, _MPNNotAddedinCPNError);
                }
              }
            } else {
              part.isMPNAddedinCPN = true;
              part.MPNNotAddedinCPNError = null;
            }
          } else {
            part.isMPNAddedinCPN = true;
            part.MPNNotAddedinCPNError = null;
          }
        });


        if (newItems.length) {
          newItems.forEach((item, index) => {
            var model = {
              _lineID: bomObj._lineID,
              cust_lineID: bomObj.cust_lineID,
              mfgCode: item.mfgCode,
              mfgCodeID: item.mfgCodeID,
              mfgPN: item.mfgPN,
              mfgPNID: item.mfgPNID,
              customerApproval: RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING,
              //badMfgPN: item.badMfgPN,
              mfgCodeStep: true,
              mfgCodeStepError: null,
              mfgPNStep: true,
              mfgPNStepError: null,
              mfgVerificationStep: true,
              mfgVerificationStepError: null,
              mfgGoodPartMappingStep: true,
              mfgGoodPartMappingStepError: null,
              suggestedGoodPartStep: true,
              suggestedGoodPartError: null,
              distGoodPartMappingStep: true,
              distGoodPartMappingStepError: null,
              suggestedGoodDistPartStep: true,
              suggestedGoodDistPartError: null,
              unknownPartStep: true,
              unknownPartError: null,
              defaultInvalidMFRStep: true,
              defaultInvalidMFRError: null,
              isMFGGoodPart: PartCorrectList.CorrectPart
            };
            // Not in use because we set this for show correct part in case of in-correct part
            if (bomObj.isMFGGoodPart === PartCorrectList.IncorrectPart && (colIndex === _colMfgCodeIndex || colIndex === _colMfgPNIndex)) {
              // model.badMfgPN = bomObj.mfgCode + '\n' + bomObj.mfgPN;
            }
            else if (bomObj.isDistGoodPart === PartCorrectList.IncorrectPart && (colIndex === _colDistributorIndex || colIndex === _colDistPNIndex)) {
              //model.badMfgPN = bomObj.distributor + '\n' + bomObj.distPN;
              model.distributor = item.mfgCode;
              model.distPN = item.mfgPN;
              model.distMfgCodeID = item.mfgCodeID;
              model.distMfgPNID = item.mfgPNID;
              model.mfgCode = null;
              model.mfgCodeID = null;
              model.mfgPN = null;
              model.mfgPNID = null;
            }
            // Added by shirish on 27-11-2020 for resolve CPN add time add remove blank alternate line
            let rowIndex = null;
            if ((lineItemParts.length === 0 && lineWithID.length >= 0)) {
              const lineObj = lineWithID[index];
              model.id = lineObj ? lineObj.id : null;
              model.rfqAlternatePartID = lineObj ? lineObj.rfqAlternatePartID : null;
              model.qpa = bomObj.qpa;
              model.lineID = bomObj.lineID;
              model.additionalComment = bomObj.additionalComment;
              model.additionalCommentId = bomObj.additionalCommentId;
              model.allocatedInKit = bomObj.allocatedInKit;
              model.assyRoHSStatus = bomObj.assyRoHSStatus;
              model.buyCustomerApprovalComment = bomObj.buyCustomerApprovalComment;
              model.buyDNPCustomerApprovalComment = bomObj.buyDNPCustomerApprovalComment;
              model.buyErrorColor = bomObj.buyErrorColor;
              model.buyTooltip = bomObj.buyTooltip;
              model.color = bomObj.color;
              model.componentLead = bomObj.componentLead;
              model.description = bomObj.description;
              model.cust_lineID = bomObj.cust_lineID;
              model.customerApprovalForBuyStep = bomObj.customerApprovalForBuyStep;
              model.customerApprovalForDNPBuyStep = bomObj.customerApprovalForDNPBuyStep;
              model.customerApprovalForDNPQPAREFDESStep = bomObj.customerApprovalForDNPQPAREFDESStep;
              model.customerApprovalForPopulateStep = bomObj.customerApprovalForPopulateStep;
              model.customerApprovalForQPAREFDESStep = bomObj.customerApprovalForQPAREFDESStep;
              model.customerDescription = bomObj.customerDescription;
              model.customerPartDesc = bomObj.customerPartDesc;
              model.custPN = bomObj.custPN;
              model.customerRev = bomObj.customerRev;
              model.deviceMarking = bomObj.deviceMarking;
              model.dnpBuyErrorColor = bomObj.dnpBuyErrorColor;
              model.dnpBuyTooltip = bomObj.dnpBuyTooltip;
              model.dnpDesig = bomObj.dnpDesig;
              model.dnpQPARefDesStep = bomObj.dnpQPARefDesStep;
              model.dnpQty = bomObj.dnpQty;
              model.dnpqpaCustomerApprovalComment = bomObj.dnpqpaCustomerApprovalComment;
              model.dnpqpaErrorColor = bomObj.dnpqpaErrorColor;
              model.dnpqpaTooltip = bomObj.dnpqpaTooltip;
              model.isBuyDNPQty = bomObj.isBuyDNPQty;
              model.isCustom = bomObj.isCustom;
              model.isCustomerApprovedBuy = bomObj.isCustomerApprovedBuy;
              model.isCustomerApprovedBuyDNP = bomObj.isCustomerApprovedBuyDNP;
              model.isCustomerApprovedCPN = bomObj.isCustomerApprovedCPN;
              model.isCustomerApprovedDNPQPA = bomObj.isCustomerApprovedDNPQPA;
              model.isCustomerApprovedPopulate = bomObj.isCustomerApprovedPopulate;
              model.isCustomerApprovedQPA = bomObj.isCustomerApprovedQPA;
              model.isInstall = bomObj.isInstall;
              model.isMergedRow = bomObj.isMergedRow;
              model.isNotRequiredKitAllocation = bomObj.isNotRequiredKitAllocation;
              model.isNotRequiredKitAllocationApproved = bomObj.isNotRequiredKitAllocationApproved;
              model.isPurchase = bomObj.isPurchase;
              model.isSupplierToBuy = bomObj.isSupplierToBuy;
              model.isUnlockCustomerBOMLine = bomObj.isUnlockCustomerBOMLine;
              model.kitAllocationNotRequiredComment = bomObj.kitAllocationNotRequiredComment;
              model.noOfRows = bomObj.noOfRows;
              model.numOfPosition = bomObj.numOfPosition;
              model.numOfRows = bomObj.numOfRows;
              model.populateCustomerApprovalComment = bomObj.populateCustomerApprovalComment;
              model.populateErrorColor = bomObj.populateErrorColor;
              model.populateTooltip = bomObj.populateTooltip;
              model.programingStatus = bomObj.programingStatus;
              model.qpaCustomerApprovalComment = bomObj.qpaCustomerApprovalComment;
              model.qpaDesignatorStep = bomObj.qpaDesignatorStep;
              model.qpaErrorColor = bomObj.qpaErrorColor;
              model.qpaTooltip = bomObj.qpaTooltip;
              model.refDesig = bomObj.refDesig;
              model.substitutesAllow = bomObj.substitutesAllow;
              model.uom = bomObj.uom;
              model.uomID = bomObj.uomID;
              model.uomMismatchedError = bomObj.uomMismatchedError;
              model.uomMismatchedStep = bomObj.uomMismatchedStep;
              model.qpaDesignatorStepError = bomObj.qpaDesignatorStepError;
              model.lineMergeStepError = bomObj.lineMergeStepError;
              model.customerApprovalForQPAREFDESError = bomObj.customerApprovalForQPAREFDESError;
              model.customerApprovalForBuyError = bomObj.customerApprovalForBuyError;
              model.customerApprovalForPopulateError = bomObj.customerApprovalForPopulateError;
              model.dnpQPARefDesError = bomObj.dnpQPARefDesError;
              model.dnpInvalidREFDESError = bomObj.dnpInvalidREFDESError;
              model.customerApprovalForDNPQPAREFDESError = bomObj.customerApprovalForDNPQPAREFDESError;
              model.customerApprovalForDNPBuyError = bomObj.customerApprovalForDNPBuyError;
              rowIndex = row + index;
              vm.refBomModel.splice(rowIndex, 1);
              vm.refBomModel.splice(rowIndex, 0, model);
            } else {
              rowIndex = row + index + (lineWithID.length > lineItemParts.length ? lineWithID.length : lineItemParts.length);
              vm.refBomModel.splice(rowIndex, 0, model);
            }

            _invalidCells.forEach((item) => {
              if (rowIndex && item[0] >= rowIndex) {
                item[0] = item[0] + 1;
              }
            });
            model.customerApproval = RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING;
            model.customerApprovalStepError = generateDescription(model, _customerApprovalError);
            mfgVerificationStepFn(model, row);
            distVerificationStepFn(model, row);
          });
        }
        else {
          if (mergedCellInfo && mergedCellInfo.length > 0) {
            _.each(mergedCellInfo, (item) => {
              item.isUpdate = true;
              mfgVerificationStepFn(item);
              distVerificationStepFn(item);
            });
          }
          else {
            bomObj.isUpdate = true;
            mfgVerificationStepFn(bomObj, row);
            distVerificationStepFn(bomObj, row);
          }
        }
        // this case is used for remove line from BOM in case of not mact MFR and MFR PN but now we not removing any part so this case is not in use
        if (isRemove) {
          if (!mergedCellInfo || mergedCellInfo.row === row) {
            const newObj = vm.bomModel[row + 1];

            newObj.id = bomObj.id;
            newObj.rfqAlternatePartID = bomObj.rfqAlternatePartID;
            newObj._lineID = bomObj._lineID;

            if (newObj.id || newObj.rfqAlternatePartID) {
              newObj.isUpdate = true;
            }
            _sourceHeaderVisible.forEach((item) => {
              if (_multiFields.indexOf(item.field) === -1) {
                newObj[item.field] = bomObj[item.field];
              }
            });
          }

          _hotRegisterer.alter('remove_row', row);
          _.remove(_invalidCells, (x) => x[0] === row);
        }
        vm.isBOMChanged = BOMFactory.isBOMChanged = true;
        BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];
      }

      const revisedquote = $rootScope.$on('requote', () => {
        $state.go(RFQTRANSACTION.RFQ_IMPORT_BOM_STATE, {
          id: $state.params.id, partId: $state.params.partId
        }, {
            reload: true
          });
      });

      /* open pop-up for drive tools parts */
      vm.openDriveToolsParts = (ev) => {
        var data = {
          partID: _partID
        };
        DialogFactory.dialogService(
          RFQTRANSACTION.DRIVE_TOOLS_PARTS_CONTROLLER,
          RFQTRANSACTION.DRIVE_TOOLS_PARTS_VIEW,
          ev,
          data).then(() => {

          }, (err) => BaseService.getErrorLog(err));
      };
      // Object clone method for BOM model and BOM ref model
      function updateCloneObject(isFilter) {
        if (isFilter) {
          vm.bomModel = _.filter(vm.refBomModel, (x) => !x.hidden);

          //[Dharam: 11/04/2020] If filter applied then other row in list will not merge auto as it is not rendered on UI. So for that we have to make merged column detail other then first row of that group to null. This code is added to resolved duplicate line issue after applying filter
          const mergeLineGroup = _.filter(_.groupBy(_.filter(vm.refBomModel, (x) => x.hidden), '_lineID'), (item) => item.length > 1);
          _.each(mergeLineGroup, (lineItems) => {
            _.map(lineItems, (line, index) => {
              line.isMergedRow = true;
              if (index !== 0) {
                line.lineID = null;
                //_sourceHeaderVisible.forEach((item) => {
                //  if (_multiFields.indexOf(item.field) === -1) {
                //    line[item.field] = null;
                //  }
                //});
              }
            });
          });
        } else {
          vm.bomModel = vm.refBomModel;
        }
      }
      /* Start BOM Activity */
      vm.startActivity = (isActivityStart) => {
        if (isActivityStart && vm.AssyLock) {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.UNLOCK_BOM_PRIOR_TO_START_ACTIVITY);
          const model = {
            messageContent: messgaeContent
          };
          DialogFactory.messageAlertDialog(model);
          return;
        }
        if (vm.isBOMChanged) {
          const obj = {
            title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
            textContent: stringFormat(CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_BODY_MESSAGE_BOM_Activity, isActivityStart ? 'start' : 'stop'),
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          return DialogFactory.confirmDiolog(obj).then(() => {
            vm.CheckSuperAdminPosibility(isActivityStart);
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          vm.CheckSuperAdminPosibility(isActivityStart);
        }
      };
      // Check Supper Adman possibility for start and stop activity
      vm.CheckSuperAdminPosibility = (isActivityStart) => {
        if (!isActivityStart && vm.rfqAssyBOMModel.componentbomSetting && vm.loginUserId !== vm.rfqAssyBOMModel.componentbomSetting[0].activityStartBy && vm.loginUser.isUserSuperAdmin) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_STOP_BY_SA_FROM_RFQ_LIST_MESSAGE);
          let message = '<br/><br/><table style=\'width:100%\'><thead><tr><th class=\'border-bottom padding-5\'>#</th><th class=\'border-bottom padding-5\'>' + CORE.LabelConstant.Assembly.PIDCode + '</th><th class=\'border-bottom padding-5\'>Activity Started By</th></tr></thead><tbody>{0}</tbody></table>';
          const subMessage = '<tr><td class="border-bottom padding-5">1 </td><td class="border-bottom padding-5">' + vm.rfqAssyBOMModel.PIDCode + '</td><td class="border-bottom padding-5">' + vm.AssyActivityStartedByUserName + '</td></tr>';
          message = stringFormat(message, subMessage);
          messageContent.message = stringFormat(messageContent.message, vm.AssyActivityStartedByUserName, message);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };

          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.startStopUpdate(isActivityStart);
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          vm.startStopUpdate(isActivityStart);
        }
      };
      // Start Stop activity update DB for same
      vm.startStopUpdate = (isActivityStart) => {
        var data = {
          refTransID: _partID,
          isActivityStart: isActivityStart,
          transactionType: vm.transactionType[0].id,
          actionType: vm.actionType[0].id
        };
        vm.isStartAndStopRequestFromThisTab = true;
        vm.cgBusyLoading = BOMFactory.startStopBOMActivity().save(data).$promise.then((response) => {
          if (response && response.data && ((response.data.updatedUserID && parseInt(response.data.updatedUserID) === vm.loginUserId) || vm.loginUser.isUserSuperAdmin)) {
            vm.isNoDataFound = true;
            vm.isBOMChanged = BOMFactory.isBOMChanged = false;
            BaseService.currentPageFlagForm = [];
            $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion);
            $scope.$parent.active();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* open pop-up for activity log*/
      vm.activityLog = (ev) => {
        var data = {
          refTransID: _partID,
          transactionType: vm.transactionType[0].id
        };
        DialogFactory.dialogService(
          RFQTRANSACTION.BOM_ACTIVITY_HISTORY_POPUP_CONTROLLER,
          RFQTRANSACTION.BOM_ACTIVITY_HISTORY_POPUP_VIEW,
          ev,
          data).then(() => {
            //success
          }, (err) => BaseService.getErrorLog(err));
      };
      //After Check In Start Timer
      let _setTimeoutProduction;

      /* Start Timer after check-in start */
      vm.startTimer = (timerCurrentData) => {
        vm.currentTimerDiff = '';
        const tickProduciton = () => {
          //timerCurrentData.TotalConsumptionTime = timerCurrentData.TotalConsumptionTime + 1;
          const currDate = getCurrentUTC();
          timerCurrentData.TotalConsumptionTime = calculateSeconds((timerCurrentData.componentbomSetting && timerCurrentData.componentbomSetting[0].activityStartAt), currDate);
          vm.currentTimerDiff = secondsToTime(timerCurrentData.TotalConsumptionTime, true);
          _setTimeoutProduction = $timeout(tickProduciton, _configSecondTimeout);
        };
        // update timer every second
        _setTimeoutProduction = $timeout(tickProduciton, _configSecondTimeout);
      };

      /* Stop Timer after stop activity */
      vm.stopTimer = () => {
        $timeout.cancel(_setTimeoutProduction);
      };
      // Calculate Assembly level count
      vm.calculateAssemblyLevelErrorCount = (bomObj) => {
        if (_.head(vm.refBomModel) !== bomObj) {
          return true;
        }
        vm.assemblyLevelRequiredErrorCount = 0;
        if ((!bomObj.requireMountingTypeStep || !bomObj.requireFunctionalTypeStep) && vm.refBomModel && vm.refBomModel.length > 0) {
          if (!bomObj.requireMountingTypeStep) {
            const notUseMountingTypes = _.filter(_componentRequireMountingType, (item) => {
              if (!_.some(vm.refBomModel, (x) => x.mountingtypeID === item.name)) {
                return item;
              }
            });
            vm.assemblyLevelRequiredErrorCount += notUseMountingTypes.length;
          }
          if (!bomObj.requireFunctionalTypeStep) {
            const notUseFunctionalTypes = _.filter(_componentRequireFunctionalType, (item) => {
              if (!_.some(vm.refBomModel, (x) => x.parttypeID === item.name)) {
                return item;
              }
            });
            vm.assemblyLevelRequiredErrorCount += notUseFunctionalTypes.length;
          }
        }
      };

      //Assembly Level error show pop-up
      vm.assemblyLevelRequiredError = () => {
        var mountingTypes = [];
        var functionalTypes = [];
        if (vm.refBomModel && vm.refBomModel.length > 0) {
          const bomObj = _.head(vm.refBomModel);
          if (bomObj) {
            _.each(_componentRequireMountingType, (item) => {
              item.isUsed = true;
              if (!_.some(vm.refBomModel, (x) => x.mountingtypeID === item.name)) {
                item.isUsed = false;
              }
              else {
                const existParts = _.filter(vm.refBomModel, (x) => x.mountingtypeID === item.name);
                item.parts = [];
                _.each(existParts, (existPart) => {
                  var part = {
                    lineID: existPart._lineID,
                    mfgPNID: existPart.mfgPNID,
                    PIDCode: existPart.PIDCode,
                    mfgPN: existPart.mfgPN,
                    isCustom: existPart.isCustom,
                    RoHSStatusID: existPart.RoHSStatusID
                  };
                  if (part.RoHSStatusID !== null) {
                    const rohsDet = _.find(vm.RohsList, { id: part.RoHSStatusID });
                    part.rohsIcon = CORE.DEFAULT_IMAGE;
                    if (rohsDet && rohsDet.rohsIcon) {
                      part.rohsIcon = rohsDet.rohsIcon;
                      part.rohsTitle = rohsDet.name;
                    }
                  }
                  item.parts.push(part);
                });
              }
              mountingTypes.push(item);
            });
            _.each(_componentRequireFunctionalType, (item) => {
              item.isUsed = true;
              if (!_.some(vm.refBomModel, (x) => x.parttypeID === item.name)) {
                item.isUsed = false;
              }
              else {
                const existParts = _.filter(vm.refBomModel, (x) => x.parttypeID === item.name);
                item.parts = [];
                _.each(existParts, (existPart) => {
                  var part = {
                    lineID: existPart._lineID,
                    mfgPNID: existPart.mfgPNID,
                    PIDCode: existPart.PIDCode,
                    mfgPN: existPart.mfgPN,
                    isCustom: existPart.isCustom,
                    RoHSStatusID: existPart.RoHSStatusID
                  };
                  if (part.RoHSStatusID !== null) {
                    const rohsDet = _.find(vm.RohsList, { id: part.RoHSStatusID });
                    part.rohsIcon = CORE.DEFAULT_IMAGE;
                    if (rohsDet && rohsDet.rohsIcon) {
                      part.rohsIcon = rohsDet.rohsIcon;
                      part.rohsTitle = rohsDet.name;
                    }
                  }
                  item.parts.push(part);
                });
              }
              functionalTypes.push(item);
            });
          }
        }
        DialogFactory.dialogService(
          RFQTRANSACTION.ASSEMBLY_CATEGORY_REQUIREMENTS_POPUP_CONTROLLER,
          RFQTRANSACTION.ASSEMBLY_CATEGORY_REQUIREMENTS_POPUP_VIEW,
          _dummyEvent,
          { mountingTypes: mountingTypes, functionalTypes: functionalTypes, partID: _partID }).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };
      // Check open error is allow to engineering approved or not
      vm.checkErrorIsAllowEgnrApproved = (bomObj) => {
        let isAllowApproval = false;
        //let isErrorInBOMLine = false;
        const allowError = _errorCodeList.filter((x) => x.isAllowToEngrApproved === 0 || x.isAllowToEngrApproved === false);
        if (allowError && allowError.length) {
          isAllowApproval = true;
          allowError.forEach((item) => {
            if (item) {
              switch (item.logicID) {
                case parseInt(vm.LogicCategoryDropdownID[1]): {
                  if (bomObj.qpaDesignatorStep === false || bomObj.qpaDesignatorStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[2]): {
                  if (bomObj.mfgCodeStep === false || bomObj.mfgCodeStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[3]): {
                  if (bomObj.mfgVerificationStep === false || bomObj.mfgVerificationStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[4]): {
                  if (bomObj.distVerificationStep === false || bomObj.distVerificationStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[5]): {
                  if (bomObj.mfgDistMappingStep === false || bomObj.mfgDistMappingStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[6]): {
                  if (bomObj.getMFGPNStep === false || bomObj.getMFGPNStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[7]): {
                  if (bomObj.mfgGoodPartMappingStep === false || bomObj.mfgGoodPartMappingStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[8]): {
                  if (bomObj.obsoletePartStep === false || bomObj.obsoletePartStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[9]): {
                  if (bomObj.mfgPNStep === false || bomObj.mfgPNStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[10]): {
                  if (bomObj.distCodeStep === false || bomObj.distCodeStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[11]): {
                  if (bomObj.distPNStep === false || bomObj.distPNStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[13]): {
                  if (bomObj.distGoodPartMappingStep === false || bomObj.distGoodPartMappingStep === 0 || bomObj.badMfgPN) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[14]): {
                  if (bomObj.lineMergeStep === false || bomObj.lineMergeStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[15]): {
                  if (bomObj.nonRohsStep === false || bomObj.nonRohsStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[16]): {
                  if (bomObj.epoxyStep === false || bomObj.epoxyStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[20]): {
                  if (bomObj.invalidConnectorTypeStep === false || bomObj.invalidConnectorTypeStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[21]): {
                  if (bomObj.duplicateMPNInSameLineStep === false || bomObj.duplicateMPNInSameLineStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[22]): {
                  if (bomObj.matingPartRquiredStep === false || bomObj.matingPartRquiredStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[23]): {
                  if (bomObj.driverToolsRequiredStep === false || bomObj.driverToolsRequiredStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[24]): {
                  if (bomObj.pickupPadRequiredStep === false || bomObj.pickupPadRequiredStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[25]): {
                  if (bomObj.restrictUseWithPermissionStep === false || bomObj.restrictUseWithPermissionStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[26]): {
                  if (bomObj.restrictUsePermanentlyStep === false || bomObj.restrictUsePermanentlyStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[27]): {
                  if (bomObj.mismatchMountingTypeStep === false || bomObj.mismatchMountingTypeStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[28]): {
                  if (bomObj.mismatchFunctionalCategoryStep === false || bomObj.mismatchFunctionalCategoryStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[35]): {
                  if (bomObj.functionalTestingRequiredStep === false || bomObj.functionalTestingRequiredStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[39]): {
                  if (bomObj.uomMismatchedStep === false || bomObj.uomMismatchedStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[40]): {
                  if (bomObj.programingRequiredStep === false || bomObj.programingRequiredStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[41]): {
                  if (bomObj.mismatchColorStep === false || bomObj.mismatchColorStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[50]): {
                  if (bomObj.restrictUseInBOMStep) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[54]): {
                  if (bomObj.mismatchNumberOfRowsStep === false || bomObj.mismatchNumberOfRowsStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[55]): {
                  if (bomObj.partPinIsLessthenBOMPinStep === false || bomObj.partPinIsLessthenBOMPinStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[56]): {
                  if (bomObj.tbdPartStep === false || bomObj.tbdPartStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[59]): {
                  if (bomObj.restrictCPNUseInBOMStep) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[60]): {
                  if (bomObj.exportControlledStep === false || bomObj.exportControlledStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[61]): {
                  if (bomObj.restrictUseInBOMWithPermissionStep) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[62]): {
                  if (bomObj.unknownPartStep === false || bomObj.unknownPartStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[63]): {
                  if (bomObj.defaultInvalidMFRStep === false || bomObj.defaultInvalidMFRStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[64]): {
                  if (bomObj.restrictUseInBOMExcludingAliasWithPermissionStep) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[65]): {
                  if (bomObj.restrictUseInBOMExcludingAliasStep) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[66]): {
                  if (bomObj.restrictUseExcludingAliasStep === false || bomObj.restrictUseExcludingAliasStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[67]): {
                  if (bomObj.restrictUseExcludingAliasWithPermissionStep === false || bomObj.restrictUseExcludingAliasWithPermissionStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[72]): {
                  if (bomObj.suggestedGoodPartStep === false || bomObj.suggestedGoodPartStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[73]): {
                  if (bomObj.suggestedGoodDistPartStep === false || bomObj.suggestedGoodDistPartStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[74]): {
                  if (bomObj.mismatchRequiredProgrammingStep === false || bomObj.mismatchRequiredProgrammingStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[75]): {
                  if (bomObj.mismatchCustomPartStep === false || bomObj.mismatchCustomPartStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[76]): {
                  if (bomObj.mappingPartProgramStep === false || bomObj.mappingPartProgramStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
                case parseInt(vm.LogicCategoryDropdownID[82]): {
                  if (bomObj.mismatchRequiredProgrammingStep === false || bomObj.mismatchRequiredProgrammingStep === 0) {
                    isAllowApproval = false;
                  }
                  break;
                }
              }
            }
            else {
              isAllowApproval = false;
            }
          });
        }
        return isAllowApproval;
      };

      /* Export BOM as CSV */
      vm.exportBOM = (ev, format) => {
        let filename = stringFormat(CORE.ExportFormat, vm.mfg, vm.mfgPNwithOutSpacialChar, CORE.BOMExportName.format1, $filter('date')(new Date(), CORE.ExportDateFormat));
        if (format === 2) {
          filename = stringFormat(CORE.ExportFormat, vm.mfg, vm.mfgPNwithOutSpacialChar, CORE.BOMExportName.format2, $filter('date')(new Date(), CORE.ExportDateFormat));
        } else if (format === 3) {
          filename = stringFormat(CORE.ExportFormat, vm.mfg, vm.mfgPNwithOutSpacialChar, CORE.BOMExportName.format3, $filter('date')(new Date(), CORE.ExportDateFormat));
        } else if (format === 4) {
          filename = stringFormat(CORE.ExportFormat, vm.mfg, vm.mfgPNwithOutSpacialChar, CORE.BOMExportName.format4, $filter('date')(new Date(), CORE.ExportDateFormat));
        } else if (format === 5) {
          filename = stringFormat(CORE.ExportFormat, vm.mfg, vm.mfgPNwithOutSpacialChar, CORE.BOMExportName.format5, $filter('date')(new Date(), CORE.ExportDateFormat));
        } else if (format === 6) {
          filename = stringFormat(CORE.ExportFormat, vm.mfg, vm.mfgPNwithOutSpacialChar, CORE.BOMExportName.format6, $filter('date')(new Date(), CORE.ExportDateFormat));
        }
        const paramObj = { assyID: _partID, data: [], mfg: vm.mfg, mfgPN: vm.mfgPN, header: vm.sourceHeader, filename: filename, format: format, mfgPNwithOutSpacialChar: vm.mfgPNwithOutSpacialChar };
        vm.cgBusyLoading = ImportBOMFactory.exportBOM(paramObj).then((response) => {
          if (response.data) {
            exportFileDetail(response, filename);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //vm.exportBOM = (ev, format) => {
      //  let filename = stringFormat(CORE.ExportFormat, vm.mfg, vm.mfgPNwithOutSpacialChar, vm.BOMExportName.format1.Name, $filter('date')(new Date(), CORE.ExportDateFormat));
      //  if (format === vm.BOMExportName.format2.ID) {
      //    filename = stringFormat(CORE.ExportFormat, vm.mfg, vm.mfgPNwithOutSpacialChar, vm.BOMExportName.format2.Name, $filter('date')(new Date(), CORE.ExportDateFormat));
      //  } else if (format === vm.BOMExportName.format3.ID) {
      //    filename = stringFormat(CORE.ExportFormat, vm.mfg, vm.mfgPNwithOutSpacialChar, vm.BOMExportName.format3.Name, $filter('date')(new Date(), CORE.ExportDateFormat));
      //  } else if (format === vm.BOMExportName.format4.ID) {
      //    filename = stringFormat(CORE.ExportFormat, vm.mfg, vm.mfgPNwithOutSpacialChar, vm.BOMExportName.format4.Name, $filter('date')(new Date(), CORE.ExportDateFormat));
      //  } else if (format === vm.BOMExportName.format5.ID) {
      //    filename = stringFormat(CORE.ExportFormat, vm.mfg, vm.mfgPNwithOutSpacialChar, vm.BOMExportName.format5.Name, $filter('date')(new Date(), CORE.ExportDateFormat));
      //  } else if (format === vm.BOMExportName.format6.ID) {
      //    filename = stringFormat(CORE.ExportFormat, vm.mfg, vm.mfgPNwithOutSpacialChar, vm.BOMExportName.format6.Name, $filter('date')(new Date(), CORE.ExportDateFormat));
      //  }
      //  const paramObj = { assyID: _partID, data: [], mfg: vm.mfg, mfgPN: vm.mfgPN, header: vm.sourceHeader, filename: filename, format: format, mfgPNwithOutSpacialChar: vm.mfgPNwithOutSpacialChar };
      //  vm.cgBusyLoading = ImportBOMFactory.exportBOM(paramObj).then((response) => {
      //    if (response.data) {
      //      exportFileDetail(response, filename);
      //    }
      //  }).catch((error) => BaseService.getErrorLog(error));
      //};

      /* Export BOM with Stock as CSV */
      //vm.exportBOMWithStock = (ev, format) => {
      //  let filename = stringFormat(CORE.ExportFormat, vm.mfg, vm.mfgPNwithOutSpacialChar, vm.BOMExportWithStockName.format1.Name, $filter('date')(new Date(), CORE.ExportDateFormat));
      //  if (format === vm.BOMExportWithStockName.format2.ID) {
      //    filename = stringFormat(CORE.ExportFormat, vm.mfg, vm.mfgPNwithOutSpacialChar, vm.BOMExportWithStockName.format2.Name, $filter('date')(new Date(), CORE.ExportDateFormat));
      //  } else if (format === vm.BOMExportWithStockName.format3.ID) {
      //    filename = stringFormat(CORE.ExportFormat, vm.mfg, vm.mfgPNwithOutSpacialChar, vm.BOMExportWithStockName.format3.Name, $filter('date')(new Date(), CORE.ExportDateFormat));
      //  } else if (format === vm.BOMExportWithStockName.format4.ID) {
      //    filename = stringFormat(CORE.ExportFormat, vm.mfg, vm.mfgPNwithOutSpacialChar, vm.BOMExportWithStockName.format4.Name, $filter('date')(new Date(), CORE.ExportDateFormat));
      //  } else if (format === vm.BOMExportWithStockName.format5.ID) {
      //    filename = stringFormat(CORE.ExportFormat, vm.mfg, vm.mfgPNwithOutSpacialChar, vm.BOMExportWithStockName.format5.Name, $filter('date')(new Date(), CORE.ExportDateFormat));
      //  } else if (format === vm.BOMExportWithStockName.format6.ID) {
      //    filename = stringFormat(CORE.ExportFormat, vm.mfg, vm.mfgPNwithOutSpacialChar, vm.BOMExportWithStockName.format6.Name, $filter('date')(new Date(), CORE.ExportDateFormat));
      //  } else if (format === vm.BOMExportWithStockName.format7.ID) {
      //    filename = stringFormat(CORE.ExportFormat, vm.mfg, vm.mfgPNwithOutSpacialChar, vm.BOMExportWithStockName.format7.Name, $filter('date')(new Date(), CORE.ExportDateFormat));
      //  } else if (format === vm.BOMExportWithStockName.format8.ID) {
      //    filename = stringFormat(CORE.ExportFormat, vm.mfg, vm.mfgPNwithOutSpacialChar, vm.BOMExportWithStockName.format8.Name, $filter('date')(new Date(), CORE.ExportDateFormat));
      //  }
      //  const paramObj = {
      //    assyID: _partID,
      //    customerID: vm.cutomerID,
      //    data: [],
      //    mfg: vm.mfg,
      //    mfgPN: vm.mfgPN,
      //    header: vm.sourceHeader,
      //    filename: filename,
      //    format: format,
      //    mfgPNwithOutSpacialChar: vm.mfgPNwithOutSpacialChar
      //  };
      //  vm.cgBusyLoading = ImportBOMFactory.exportBOMWithStock(paramObj).then((response) => {
      //    if (response.data) {
      //      exportFileDetail(response, filename);
      //    }
      //  }).catch((error) => BaseService.getErrorLog(error));
      //};

      //export template details
      function exportFileDetail(res, name) {
        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        if (navigator.msSaveOrOpenBlob) {
          navigator.msSaveOrOpenBlob(blob, name);
        } else {
          const link = document.createElement('a');
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', name);
            link.style = 'visibility:hidden';
            document.body.appendChild(link);
            $timeout(() => {
              link.click();
              document.body.removeChild(link);
            });
          }
        }
      };
      // Manage Part programing mapping
      function ManagePartProgrammingMapping(ev) {
        if (!vm.disablePartProgramming) {
          vm.disablePartProgramming = true;
          const data = {
            partID: _partID
          };
          DialogFactory.dialogService(
            RFQTRANSACTION.PART_PROGRAM_MAPPING_CONTROLLER,
            RFQTRANSACTION.PART_PROGRAM_MAPPING_VIEW,
            ev,
            data).then(() => {
              vm.disablePartProgramming = false;
              vm.componentVerification();
              $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion);
            }, () => {
              vm.disablePartProgramming = false;
            }, (err) => {
              vm.disableOddelyRef = false;
              BaseService.getErrorLog(err);
            });
        }
      };

      vm.partProgramMapping = (ev) => {
        if (vm.isBOMReadOnly || vm.disablePartProgramming) { return false; }
        if (BOMFactory.isBOMChanged) {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.WITHOUT_SAVING_ALERT_BODY_MESSAGE_PROGRAM_MAPPING);
          const model = {
            messageContent: messgaeContent
          };
          DialogFactory.messageAlertDialog(model);
        } else {
          ManagePartProgrammingMapping(ev);
        }
      };
      // delete BOM
      vm.deleteBOM = function () {
        if (!vm.enabledDeleteBOM || vm.DisableDeleteBOM) { return false; }
        vm.DeletedFormThisTab = true;
        const data = {
          rfqAssyID: _rfqAssyID,
          partID: _partID
        };
        DialogFactory.dialogService(
          RFQTRANSACTION.DELETE_BOM_CONFIRMATION_CONTROLLER,
          RFQTRANSACTION.DELETE_BOM_CONFIRMATION_VIEW,
          null,
          data).then(() => {
          }, (err) => BaseService.getErrorLog(err));
      };
      // For Update Part Attribute from Context menu
      vm.updatePartAttribute = (bomObj) => {
        vm.partUpdatefromThisTab = true;
        const objAttributes = {
          isFromBOM: true,
          bomObj: bomObj,
          AssyID: _partID
        };
        DialogFactory.dialogService(
          USER.ADMIN_COMPONENT_UPDATE_MULTIPLE_ATTRIBUTES_POPUP_CONTROLLER,
          USER.ADMIN_COMPONENT_UPDATE_MULTIPLE_ATTRIBUTES_POPUP_VIEW,
          null,
          objAttributes).then(() => {
            vm.componentVerification();
          }, () => {
            vm.componentVerification();
          }, () => {
          });
      };
      // Manage oddly named Refdes
      vm.openOddlyNamedRefdes = () => {
        if (vm.disableOddelyRef || vm.isBOMReadOnly) { return false; }
        if (!vm.disableOddelyRef) {
          vm.disableOddelyRef = true;
          const data = {
            partID: _partID,
            assyID: vm.rfqAssyBOMModel.PIDCode,
            assyPN: vm.rfqAssyBOMModel.mfgPN,
            rohsName: vm.rfqAssyBOMModel.rfq_rohsmst.name,
            rohsIcon: vm.rfqAssyBOMModel.rfq_rohsmst.rohsIcon,
            customer: vm.rfqAssyBOMModel.mfgCodemst.mfgName,
            mfgCode: vm.rfqAssyBOMModel.mfgCodemst.mfgCode,
            customerID: vm.rfqAssyBOMModel.mfgCodemst.id,
            customerNameWithCode: vm.rfqAssyBOMModel.mfgCodemst.mfgCodeName
          };
          DialogFactory.dialogService(
            USER.MANAGE_ODDLY_NAMED_REFDES_POPUP_CONTROLLER,
            USER.MANAGE_ODDLY_NAMED_REFDES_POPUP_VIEW,
            null,
            data).then(() => {
              vm.disableOddelyRef = false;
              vm.qpaDesignator();
              $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion);
            }, () => {
              vm.disableOddelyRef = false;
            }, (err) => {
              vm.disableOddelyRef = false;
              BaseService.getErrorLog(err);
            });
        }
      };
    }
  }
})();
