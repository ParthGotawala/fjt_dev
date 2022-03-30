(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('bomPartProgramMapping', bomPartProgramMapping);

  /** @ngInject */
  function bomPartProgramMapping() {
    var directive = {
      restrict: 'E',
      scope: {
        partId: '=',
        parentPageForm: '='
      },
      templateUrl: 'app/directives/custom/bom-part-program-mapping/bom-part-program-mapping.html',
      controller: bomPartProgramMappingCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function bomPartProgramMappingCtrl($scope, $q, CORE, USER, RFQTRANSACTION, BOMFactory, ImportBOMFactory, DialogFactory, BaseService, ComponentFactory) {
      var vm = this;
      vm.partID = $scope.partId;
      vm.LabelConstant = CORE.LabelConstant;
      vm.TBDMFRPNID = CORE.TBDMFRPNID;
      vm.NOTAVAILABLEMFRPNID = CORE.NOTAVAILABLEMFRPNID;
      vm.isChanged = false;
      vm.rohsBasePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.PART_PROGRAMM_MAPPING;
      vm.PartSuggestType = CORE.PartSuggestType;
      vm.LogicCategoryDropdown = CORE.LogicCategoryDropdown;
      vm.RoHSMainCategory = CORE.RoHSMainCategory;
      const partInvalidMatchList = [false, 0];
      vm.LogicCategoryDropdownDet = _.mapValues(_.keyBy(vm.LogicCategoryDropdown, 'id'), 'value');
      vm.LogicCategoryDropdownID = _.mapValues(_.keyBy(vm.LogicCategoryDropdown, 'id'), 'id');
      let _errorCodeList = [];
      const _successColor = RFQTRANSACTION.SUCCESS_COLOR;
      const _errorColor = RFQTRANSACTION.ERROR_COLOR;
      const _nonRoHSColor = RFQTRANSACTION.NON_ROHS_COLOR;
      let _obsoleteColor = RFQTRANSACTION.SUCCESS_COLOR;
      //// List of all validation steps
      const _logicCategoryDropdown = CORE.LogicCategoryDropdown;
      // Add default error codes so if not added into database then we can have default error color
      let _qpaDesignatorError, _mfgInvalidError, _mfgVerificationError, _distVerificationError, _mfgDistMappingError, _getMFGPNError, _obsoletePartError, _mfgGoodPartMappingError, _mfgPNInvalidError, _distInvalidError, _distPNInvalidError, _distGoodPartMappingError, _lineMergeError, _rohsStatusError, _epoxyError, _duplicateRefDesError, _invalidRefDesError, _invalidConnectorTypeError, _duplicateMPNInSameLineError, _matingPartRequiredError, _driverToolsRequiredError, _pickupPadRequiredError, _restrictUseWithPermissionError, _restrictUsePermanentlyError, _mismatchMountingTypeError, _mismatchRequiredProgrammingError, _mismatchProgrammingStatusError, _mappingPartProgramError, _mismatchFunctionalCategoryError, _mismatchCustomPartError, _mismatchPitchError, _mismatchToleranceError, _mismatchVoltageError, _mismatchPackageError, _mismatchValueError, _duplicateCPNError, _functionalTestingRequiredError, _requireMountingTypeError, _requireFunctionalTypeError, _uomMismatchedError, _programingRequiredError, _mismatchColorError, _restrictUseInBOMError, _customerApprovalForQPAREFDESError, _customerApprovalForBuyError, _customerApprovalForPopulateError, _mismatchNumberOfRowsError, _partPinIsLessthenBOMPinError, _tbdPartError, _restrictCPNUseInBOMError, _restrictCPNUseWithPermissionError, _restrictCPNUsePermanentlyError, _exportControlledError, _restrictUseInBOMWithPermissionError, _unknownPartError, _defaultInvalidMFRError, _restrictUseInBOMExcludingAliasError, _restrictUseInBOMExcludingAliasWithPermissionError, _restrictUseExcludingAliasError, _restrictUseExcludingAliasWithPermissionError, _dnpQPARefDesError, _customerApprovalForDNPQPAREFDESError, _customerApprovalForDNPBuyError, _dnpInvalidREFDESError, _suggestedGoodPartError, _suggestedGoodDistPartError, _suggestMFRMappingError, _suggestAlternatePartError, _suggestPackagingPartError, _suggestProcessMaterialPartError, _suggestRoHSReplacementPartError, _dnpQPAREFDESChangeError, _QPAREFDESChangeError;
      _qpaDesignatorError = _mfgInvalidError = _mfgVerificationError = _distVerificationError = _mfgDistMappingError = _getMFGPNError = _obsoletePartError = _mfgGoodPartMappingError = _mfgPNInvalidError = _distInvalidError = _distPNInvalidError = _distGoodPartMappingError = _lineMergeError = _rohsStatusError = _epoxyError = _duplicateRefDesError = _invalidRefDesError = _invalidConnectorTypeError = _duplicateMPNInSameLineError = _matingPartRequiredError = _driverToolsRequiredError = _pickupPadRequiredError = _restrictUseWithPermissionError = _restrictUsePermanentlyError = _mismatchMountingTypeError = _mismatchRequiredProgrammingError = _mismatchProgrammingStatusError = _mappingPartProgramError = _mismatchFunctionalCategoryError = _mismatchCustomPartError = _mismatchPitchError = _mismatchToleranceError = _mismatchVoltageError = _mismatchPackageError = _mismatchValueError = _duplicateCPNError = _functionalTestingRequiredError = _requireMountingTypeError = _requireFunctionalTypeError = _uomMismatchedError = _programingRequiredError = _mismatchColorError = _restrictUseInBOMError = _customerApprovalForQPAREFDESError = _customerApprovalForBuyError = _customerApprovalForPopulateError = _mismatchNumberOfRowsError = _partPinIsLessthenBOMPinError = _tbdPartError = _restrictCPNUseInBOMError = _restrictCPNUseWithPermissionError = _restrictCPNUsePermanentlyError = _exportControlledError = _restrictUseInBOMWithPermissionError = _unknownPartError = _defaultInvalidMFRError = _restrictUseInBOMExcludingAliasError = _restrictUseInBOMExcludingAliasWithPermissionError = _restrictUseExcludingAliasError = _restrictUseExcludingAliasWithPermissionError = _dnpQPARefDesError = _customerApprovalForDNPQPAREFDESError = _customerApprovalForDNPBuyError = _dnpInvalidREFDESError = _suggestedGoodPartError = _suggestedGoodDistPartError = _suggestMFRMappingError = _suggestAlternatePartError = _suggestPackagingPartError = _suggestProcessMaterialPartError = _suggestRoHSReplacementPartError = _dnpQPAREFDESChangeError = _QPAREFDESChangeError = { errorColor: _errorColor };
      let _customerApprovalError = { errorColor: _errorColor, displayOrder: 1 };

      const autoCompleteProgramRefDesg = {
        columnName: 'partRefDesg',
        keyColumnName: 'partRefDesg',
        keyColumnId: null,
        inputName: 'Software RefDes',
        placeholderName: 'Software RefDes',
        isRequired: false,
        isAddnew: false,
        callbackFn: getPartRefDesgMapping,
        onSelectCallbackFn: getSelectedRefDesgDetail
      };

      // Get Oddly ref Des list
      function getOddelyRefDesList() {
        if (vm.partID) {
          return ComponentFactory.getOddelyRefDesList().query({ id: vm.partID }).$promise.then((resOddRefDes) => {
            if (resOddRefDes && resOddRefDes.data) {
              vm.oddelyRefDesList = resOddRefDes.data;
              vm.DisplayOddelyRefDes = _.map(vm.oddelyRefDesList, 'refDes');
              return vm.oddelyRefDesList;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
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
                  case vm.LogicCategoryDropdownDet[34]: {
                    _duplicateCPNError = obj;
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
                }
              }
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      init();
      function init() {
        vm.cgBusyLoading = $q.all([getErrorCode(), getOddelyRefDesList()]).then(() => {
          getPartRefDesgMapping(true);
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
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
      // Check BOM line Object is valid or invalid to approved part
      function isBOMObjInValid(validationArr, bomObj) {
        if (bomObj) {
          return ((validationArr.indexOf(bomObj.mfgVerificationStep) !== -1 && _mfgVerificationError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.mfgDistMappingStep) !== -1 && _mfgDistMappingError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.obsoletePartStep) !== -1 && bomObj.isObsoleteLine && !_obsoletePartError.isAllowToEngrApproved) ||
            //(validationArr.indexOf(bomObj.mfgGoodPartMappingStep) !== -1 && !_mfgGoodPartMappingError.isAllowToEngrApproved )||
            (bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) ||
            (validationArr.indexOf(bomObj.lineMergeStep) !== -1 && !_lineMergeError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.nonRohsStep) !== -1 && !_rohsStatusError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.epoxyStep) !== -1 && !_epoxyError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.mfgCodeStep) !== -1 && !_mfgInvalidError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.mfgPNStep) !== -1 && !_mfgPNInvalidError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.distVerificationStep) !== -1 && !_distVerificationError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.getMFGPNStep) !== -1 && !_getMFGPNError.isAllowToEngrApproved) ||
            //(validationArr.indexOf(bomObj.distGoodPartMappingStep) !== -1 && !_distGoodPartMappingError.isAllowToEngrApproved) ||
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
            //(validationArr.indexOf(bomObj.suggestedGoodPartStep) !== -1 && !_suggestedGoodPartError.isAllowToEngrApproved) ||
            //(validationArr.indexOf(bomObj.suggestedGoodDistPartStep) !== -1 && !_suggestedGoodDistPartError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.driverToolsRequiredStep) !== -1 && !_driverToolsRequiredError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.functionalTestingRequiredStep) !== -1 && !_functionalTestingRequiredError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.exportControlledStep) !== -1 && !_exportControlledError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.uomMismatchedStep) !== -1 && !_uomMismatchedError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.programingRequiredStep) !== -1 && !_programingRequiredError.isAllowToEngrApproved) ||
            (validationArr.indexOf(bomObj.mismatchColorStep) !== -1) ||
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
            (validationArr.indexOf(bomObj.mappingPartProgramStep) !== -1 && !_mappingPartProgramError.isAllowToEngrApproved));
        }
        else {
          return true;
        }
      }

      // Get Ref DES detail from DB
      function getPartRefDesgMapping(isFromLoad) {
        return BOMFactory.getPartRefDesgMapping().query({ partID: vm.partID }).$promise.then((response) => {
          if (response && response.data) {
            vm.programmingRequirePartLines = response.data.partRefDesg;
            _.each(response.data.partRefDesg, (objProgramPart) => {
              mfgVerificationStepFn(objProgramPart);
            });
            vm.programmingRequirePartLines_new = _.chain(response.data.partRefDesg).groupBy('lineID').map((value) => {
              var lineDetail = _.first(value) || {};
              return {
                partList: value,
                lineID: lineDetail.lineID,
                refDesig: lineDetail.refDesig,
                dnpDesig: lineDetail.dnpDesig,
                id: lineDetail.id,
                isBuyDNPQty: lineDetail.isBuyDNPQty,
                isInstall: lineDetail.isInstall,
                isPurchase: lineDetail.isPurchase,
                programingStatus: lineDetail.programingStatus
              };
            }).value();

            vm.programPartLines = response.data.programRefDesg;
            _.each(response.data.programRefDesg, (objProgramPart) => {
              mfgVerificationStepFn(objProgramPart);
            });
            vm.programPartLines_new = _.chain(response.data.programRefDesg).groupBy('lineID').map((value) => {
              var lineDetail = _.first(value) || {};
              return {
                partList: value,
                lineID: lineDetail.lineID,
                refDesig: lineDetail.refDesig,
                dnpDesig: lineDetail.dnpDesig,
                id: lineDetail.id,
                isBuyDNPQty: lineDetail.isBuyDNPQty,
                isInstall: lineDetail.isInstall,
                isPurchase: lineDetail.isPurchase,
                programingStatus: lineDetail.programingStatus,
                customerPartDesc: lineDetail.customerPartDesc
              };
            }).value();

            if (!vm.isChanged || isFromLoad) {
              bindData();
            }
            else {
              bindProgramPartRefDesg();
            }
            return true;
          } else {
            return false;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      // Bind Detail for Part Ref DES Detail
      function getPartProgramMappingDetail() {
        vm.cgBusyLoading = BOMFactory.getPartProgramMappingDetail().query({ partID: vm.partID }).$promise.then((response) => {
          if (response && response.data) {
            vm.mappingpartDetail = response.data;
            _.each(vm.partProgrammingMapping, (item) => {
              const mappedRefDesg = _.find(vm.mappingpartDetail, (x) => x.partRefDesg === item.partRefDesg);
              if (mappedRefDesg) {
                item.id = mappedRefDesg.id;
                item.autoCompleteProgramRefDesg.keyColumnId = mappedRefDesg.softwareRefDesg;
              }
            });
            return vm.mappingpartDetail;
          } else {
            return false;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      function bindData() {
        bindprogrammingRequirePartLines();
        bindProgramPartRefDesg();
        getPartProgramMappingDetail();
      };
      // Bind Detail For Program Ref DES Detail
      function bindprogrammingRequirePartLines() {
        vm.partProgrammingMapping = [];
        _.each(vm.programmingRequirePartLines_new, (objLine) => {
          let partRefDesgArr = [];
          partRefDesgArr = getDesignatorFromLineItem(objLine.refDesig, vm.DisplayOddelyRefDes);
          if (objLine.isBuyDNPQty === CORE.BuyDNPQTYDropdown[3].id) {
            partRefDesgArr = partRefDesgArr.concat(getDesignatorFromLineItem(objLine.dnpDesig, vm.DisplayOddelyRefDes));
          }
          _.each(partRefDesgArr, (refDesg) => {
            const obj = {
              partID: vm.partID,
              partRefDesg: refDesg,
              rfqLineItemID: objLine.id,
              lineID: objLine.lineID,
              autoCompleteProgramRefDesg: angular.copy(autoCompleteProgramRefDesg),
              selectedLinePartDetail: objLine.partList
            };
            vm.partProgrammingMapping.push(obj);
          });
        });
      };
      // Bind Mapping Detail from Both Part and Program
      function bindProgramPartRefDesg() {
        vm.ProgramPartRefDesg = [];
        _.each(vm.programPartLines_new, (objLine) => {
          let partRefDesgArr = [];
          if (objLine.isInstall) {
            partRefDesgArr = getDesignatorFromLineItem(objLine.refDesig, vm.DisplayOddelyRefDes);
          }
          _.each(partRefDesgArr, (refDesg) => {
            const obj = {
              partRefDesg: refDesg,
              rfqLineItemID: objLine.id,
              lineID: objLine.lineID,
              customerPartDesc: objLine.customerPartDesc,
              selectedLinePartDetail: objLine
            };
            vm.ProgramPartRefDesg.push(obj);
          });
        });
      };
      //  Set Data After select any Ref DES with Selected Obj
      function getSelectedRefDesgDetail(item, data) {
        if (data) {
          vm.isChanged = true;
          if (item) {
            let duplicateRefDes = false;
            const duplicateMapping = _.filter(vm.partProgrammingMapping, (objItem) => data.partRefDesg !== objItem.partRefDesg && item.partRefDesg === objItem.softwareRefDesg);
            if (duplicateMapping.length > 0) {
              duplicateRefDes = true;
            }
            if (duplicateRefDes) {
              const textMessageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.DUPLICATE_REF_DES_MAPPING_NOT_ALLOWED);
              const alertModel = {
                messageContent: textMessageContent
              };
              return DialogFactory.messageAlertDialog(alertModel).then(() => {
                data.autoCompleteProgramRefDesg.keyColumnId = null;
              });
            } else {
              data.softwareRefDesg = item.partRefDesg;
              data.softwareRFQLineItemID = item.rfqLineItemID;
              data.softwareLineID = item.lineID;
              data.softwareLineDescription = item.customerPartDesc;
              data.softwarePartList = item.selectedLinePartDetail ? item.selectedLinePartDetail.partList : [];
            }
          } else {
            data.softwareRefDesg = null;
            data.softwareRFQLineItemID = null;
            data.softwareLineID = null;
            data.softwareLineDescription = null;
            data.softwarePartList = [];
          }
        } else {
          return true;
        }
      };

      // MFR and MFR PN Error
      function mfgVerificationStepFn(bomObj) {
        const errorList = [];
        const tooltipList = [];
        let errorMFG = null;
        let errorMFGPN = null;
        if (bomObj.mfgVerificationStep === false || bomObj.mfgVerificationStep === 0) {
          errorList.push(_mfgVerificationError);
        }
        if (bomObj.mfgDistMappingStep === false || bomObj.mfgDistMappingStep === 0) {
          errorList.push(_mfgDistMappingError);
        }
        if (bomObj.obsoletePartStep === false || bomObj.obsoletePartStep === 0) {
          errorList.push(_obsoletePartError);
        }
        if (bomObj.mfgGoodPartMappingStep === false || bomObj.mfgGoodPartMappingStep === 0) {
          errorList.push(_mfgGoodPartMappingError);
        }
        if (bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING && bomObj.mfgPNID && (bomObj.restrictUsePermanentlyStep && bomObj.restrictUseExcludingAliasStep)) {
          errorList.push(_customerApprovalError);
        }
        if (bomObj.nonRohsStep === false || bomObj.nonRohsStep === 0) {
          errorList.push(_rohsStatusError);
        }
        if (bomObj.epoxyStep === false || bomObj.epoxyStep === 0) {
          errorList.push(_epoxyError);
        }
        if (bomObj.mfgCodeStep === false || bomObj.mfgCodeStep === 0) {
          errorMFG = _mfgInvalidError;
          errorList.push(_mfgInvalidError);
        }
        if (bomObj.mfgPNStep === false || bomObj.mfgPNStep === 0) {
          errorMFGPN = _mfgPNInvalidError;
          errorList.push(_mfgPNInvalidError);
        }
        if (bomObj.invalidConnectorTypeStep === false || bomObj.invalidConnectorTypeStep === 0) {
          errorList.push(_invalidConnectorTypeError);
        }
        if (bomObj.mismatchNumberOfRowsStep === false || bomObj.mismatchNumberOfRowsStep === 0) {
          errorList.push(_mismatchNumberOfRowsError);
        }
        if (bomObj.partPinIsLessthenBOMPinStep === false || bomObj.partPinIsLessthenBOMPinStep === 0) {
          errorList.push(_partPinIsLessthenBOMPinError);
        }
        if (bomObj.exportControlledStep === false || bomObj.exportControlledStep === 0) {
          errorList.push(_exportControlledError);
        }
        if (bomObj.unknownPartStep === false || bomObj.unknownPartStep === 0) {
          errorList.push(_unknownPartError);
        }
        if (bomObj.defaultInvalidMFRStep === false || bomObj.defaultInvalidMFRStep === 0) {
          errorList.push(_defaultInvalidMFRError);
        }
        if (bomObj.tbdPartStep === false || bomObj.tbdPartStep === 0) {
          errorList.push(_tbdPartError);
        }
        if (bomObj.duplicateMPNInSameLineStep === false || bomObj.duplicateMPNInSameLineStep === 0) {
          errorList.push(_duplicateMPNInSameLineError);
        }
        if (bomObj.mismatchMountingTypeStep === false || bomObj.mismatchMountingTypeStep === 0) {
          if (!bomObj.approvedMountingType) {
            errorList.push(_mismatchMountingTypeError);
          }
        }
        if (bomObj.mismatchRequiredProgrammingStep === false || bomObj.mismatchRequiredProgrammingStep === 0) {
          errorList.push(_mismatchRequiredProgrammingError);
        }
        if (bomObj.mappingPartProgramStep === false || bomObj.mappingPartProgramStep === 0) {
          errorList.push(_mappingPartProgramError);
        }
        if (bomObj.mismatchFunctionalCategoryStep === false || bomObj.mismatchFunctionalCategoryStep === 0) {
          if (!bomObj.approvedMountingType) {
            errorList.push(_mismatchFunctionalCategoryError);
          }
        }
        if (bomObj.mismatchCustomPartStep === false || bomObj.mismatchCustomPartStep === 0) {
          errorList.push(_mismatchCustomPartError);
        }
        if (bomObj.restrictUseWithPermissionStep === false || bomObj.restrictUseWithPermissionStep === 0) {
          errorList.push(_restrictUseWithPermissionError);
        }
        if (bomObj.restrictUsePermanentlyStep === false || bomObj.restrictUsePermanentlyStep === 0) {
          bomObj.customerApprovalStepError = null;
          errorList.push(_restrictUsePermanentlyError);
        }
        if (bomObj.pickupPadRequiredStep === false || bomObj.pickupPadRequiredStep === 0) {
          errorList.push(_pickupPadRequiredError);
        }
        if (bomObj.matingPartRquiredStep === false || bomObj.matingPartRquiredStep === 0) {
          errorList.push(_matingPartRequiredError);
        }
        if (bomObj.suggestedGoodPartStep === false || bomObj.suggestedGoodPartStep === 0) {
          errorList.push(_suggestedGoodPartError);
        }
        if (bomObj.driverToolsRequiredStep === false || bomObj.driverToolsRequiredStep === 0) {
          errorList.push(_driverToolsRequiredError);
        }
        if (bomObj.functionalTestingRequiredStep === false || bomObj.functionalTestingRequiredStep === 0) {
          errorList.push(_functionalTestingRequiredError);
        }
        if (bomObj.uomMismatchedStep === false || bomObj.uomMismatchedStep === 0) {
          errorList.push(_uomMismatchedError);
        }
        if (bomObj.programingRequiredStep === false || bomObj.programingRequiredStep === 0) {
          errorList.push(_programingRequiredError);
        }
        if (bomObj.mismatchProgrammingStatusStep === false || bomObj.mismatchProgrammingStatusStep === 0) {
          errorList.push(_mismatchProgrammingStatusError);
        }
        if (bomObj.restrictUseInBOMStep) {
          errorList.push(_restrictUseInBOMError);
        }
        if (bomObj.restrictUseInBOMExcludingAliasStep) {
          errorList.push(_restrictUseInBOMExcludingAliasError);
        }
        if (bomObj.restrictUseInBOMExcludingAliasWithPermissionStep) {
          errorList.push(_restrictUseInBOMExcludingAliasWithPermissionError);
        }
        if (bomObj.restrictUseInBOMWithPermissionStep) {
          errorList.push(_restrictUseInBOMWithPermissionError);
        }
        if (bomObj.restrictUseExcludingAliasStep === false || bomObj.restrictUseExcludingAliasStep === 0) {
          bomObj.customerApprovalStepError = null;
          errorList.push(_restrictUseExcludingAliasError);
        }
        if (bomObj.restrictUseExcludingAliasWithPermissionStep === false || bomObj.restrictUseExcludingAliasWithPermissionStep === 0) {
          errorList.push(_restrictUseExcludingAliasWithPermissionError);
        }
        bomObj.restrictCPNUseWithPermissionError = null;
        if (bomObj.mfgPNID && (bomObj.restrictCPNUseWithPermissionStep === false || bomObj.restrictCPNUseWithPermissionStep === 0)) {
          bomObj.customerApprovalStepError = null;
          errorList.push(_restrictCPNUseWithPermissionError);
        }
        bomObj.restrictCPNUsePermanentlyError = null;
        if (bomObj.mfgPNID && (bomObj.restrictCPNUsePermanentlyStep === false || bomObj.restrictCPNUsePermanentlyStep === 0)) {
          errorList.push(_restrictCPNUsePermanentlyError);
        }
        if (bomObj.mfgPNID && bomObj.restrictCPNUseInBOMStep) {
          errorList.push(_restrictCPNUseInBOMError);
        }
        if (bomObj.acquisitionDetail && bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) {
          tooltipList.push(bomObj.acquisitionDetail);
        }
        if (bomObj.suggestedByApplicationStep !== vm.PartSuggestType.default.id) {
          switch (bomObj.suggestedByApplicationStep) {
            case vm.PartSuggestType.suggestedAlternatePart.id: {
              errorList.push(_suggestAlternatePartError);
              break;
            }
            case vm.PartSuggestType.suggestedMFRMapping.id: {
              errorList.push(_suggestMFRMappingError);
              break;
            }
            case vm.PartSuggestType.suggestedPackagingPart.id: {
              errorList.push(_suggestPackagingPartError);
              break;
            }
            case vm.PartSuggestType.suggestedProcessMaterialPart.id: {
              errorList.push(_suggestProcessMaterialPartError);
              break;
            }
            case vm.PartSuggestType.suggestedRoHSReplacementPart.id: {
              errorList.push(_suggestRoHSReplacementPartError);
              break;
            }
          }
        }
        if (errorMFG || errorMFGPN) {
          const priorErrorObj = _.sortBy(errorList, (x) => x.displayOrder || 0)[0];
          bomObj.mfgErrorColor = priorErrorObj.errorColor;
          bomObj.mfgPNErrorColor = priorErrorObj.errorColor;
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
        }
        else {
          if (bomObj.mfgVerificationStep || bomObj.mfgDistMappingStep || bomObj.obsoletePartStep || bomObj.mfgGoodPartMappingStep || bomObj.nonRohsStep || bomObj.invalidConnectorTypeStep || bomObj.duplicateMPNStep || bomObj.mismatchMountingTypeStep || bomObj.mismatchRequiredProgrammingStep || bomObj.mismatchFunctionalCategoryStep || bomObj.restrictUsePermanentlyStep || bomObj.restrictUseWithPermissionStep || bomObj.restrictUseExcludingAliasStep || bomObj.restrictUseExcludingAliasWithPermissionStep || bomObj.pickupPadRequiredStep || bomObj.matingPartRquiredStep || bomObj.driverToolsRequiredStep || bomObj.functionalTestingRequiredStep || bomObj.exportControlledStep || bomObj.unknownPartStep || bomObj.defaultInvalidMFRStep) {
            if (bomObj.mfrCode && bomObj.mfgPN) {
              if (bomObj.refMainCategoryID === vm.RoHSMainCategory.NonRoHS && _isAssyRoHS && bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED) {
                bomObj.mfgPNErrorColor = _nonRoHSColor;
                bomObj.mfgErrorColor = _nonRoHSColor;
              }
              else if (!bomObj.mfgPNID && bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) {
                bomObj.mfgErrorColor = null;
                bomObj.mfgPNErrorColor = null;
              }
              else if (bomObj.mfgCodeID && bomObj.mfgPNID && bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) {
                bomObj.mfgErrorColor = _;
                bomObj.mfgPNErrorColor = null;
              }
              else if (bomObj.mfgCodeID && bomObj.mfgPNID && bomObj.mfgVerificationStep) {
                bomObj.mfgErrorColor = _successColor;
                bomObj.mfgPNErrorColor = _successColor;
              }
            }
            else {
              bomObj.mfgErrorColor = null;
              bomObj.mfgPNErrorColor = null;
            }
            //setHeaderStyle();
          }
          else if (bomObj.mfgCodeStep && bomObj.mfgPNStep) {
            bomObj.mfgErrorColor = _successColor;
            bomObj.mfgPNErrorColor = _successColor;
          } else {
            bomObj.mfgErrorColor = null;
            bomObj.mfgPNErrorColor = null;
          }
        }
        //Remove Error Color if part only for allow customer approval
        if (bomObj.customerApproval !== RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING && !isBOMObjInValid(partInvalidMatchList, bomObj) && (bomObj.suggestedByApplicationStep === vm.PartSuggestType.default.id) && bomObj.mfgErrorColor !== _mappingPartProgramError.errorColor) {
          bomObj.mfgErrorColor = _successColor;
          bomObj.mfgPNErrorColor = _successColor;
        }

        if (errorList.length > 0 && !isBOMObjInValidForCPN(partInvalidMatchList, bomObj)) {
          const priorErrorObj = _.sortBy(errorList, (x) => x.displayOrder || 0)[0];
          bomObj.mfgErrorColor = priorErrorObj.errorColor;
          bomObj.mfgPNErrorColor = priorErrorObj.errorColor;
        }

        if (!bomObj.mfrCode) {
          bomObj.mfgErrorColor = _errorColor;
        }

        if (!bomObj.mfgPN) {
          bomObj.mfgPNErrorColor = _errorColor;
        }
        if (bomObj) {
          bomObj.isInValid = isBOMObjInValid(partInvalidMatchList, bomObj);
          if (!bomObj.isInValid && (!bomObj.restrictCPNUsePermanentlyStep || !bomObj.restrictCPNUseWithPermissionStep || bomObj.restrictCPNUseInBOMStep)) {
            bomObj.isInValid = true;
          }
        }
      }

      const savePartProgramMapping = $scope.$on('savePartProgramMapping', savePartMappingDetail);
      // Save Part Program Mapping Detail
      function savePartMappingDetail() {
        let duplicateRefDes = false;
        const newPartProgrammingMapping = [];
        const deletedPartProgrammingMapping = [];
        const updatedPartProgrammingMapping = [];
        const unapprovedPart = [];
        const unapprovedSoftwarePart = [];
        _.each(vm.partProgrammingMapping, (objItem) => {
          const objApprovedProgramPart = _.find(objItem.selectedLinePartDetail, (item) => (item.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED || item.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.NONE));
          if (!objApprovedProgramPart && objItem.autoCompleteProgramRefDesg.keyColumnId) {
            unapprovedPart.push(objItem);
          }
          const objApprovedSoftwarePart = _.find(objItem.softwarePartList, (item) => (item.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.APPROVED || item.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.NONE));
          if (!objApprovedSoftwarePart && objItem.autoCompleteProgramRefDesg.keyColumnId) {
            unapprovedSoftwarePart.push(objItem);
          }

          const duplicateMapping = _.filter(vm.partProgrammingMapping, (item) => item.partRefDesg !== objItem.partRefDesg && item.softwareRefDesg === objItem.softwareRefDesg);
          if (duplicateMapping.length > 0 && objItem.softwareRefDesg) {
            duplicateRefDes = true;
          } else {
            if (objItem.softwareRefDesg && objItem.id) {
              updatedPartProgrammingMapping.push(objItem);
            } else if (objItem.softwareRefDesg && !objItem.id) {
              newPartProgrammingMapping.push(objItem);
            } else if (!objItem.softwareRefDesg && objItem.id) {
              deletedPartProgrammingMapping.push(objItem);
            }
          }
        });
        if (unapprovedPart.length > 0 || unapprovedSoftwarePart.length > 0) {
          const textMessageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.APPROVE_PART_PRIOR_TO_MAPPING);
          const alertModel = {
            messageContent: textMessageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
        } else {
          if (duplicateRefDes) {
            const textMessageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.DUPLICATE_REF_DES_MAPPING_NOT_ALLOWED);
            const alertModel = {
              messageContent: textMessageContent
            };
            return DialogFactory.messageAlertDialog(alertModel);
          } else {
            const mappingSaveObj = {
              newPartProgrammingMapping: newPartProgrammingMapping,
              deletedPartProgrammingMapping: deletedPartProgrammingMapping,
              updatedPartProgrammingMapping: updatedPartProgrammingMapping,
              partID: vm.partID
            };

            vm.cgBusyLoading = BOMFactory.savePartProgramMappingDetail().save(mappingSaveObj).$promise.then((res) => {
              if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                $scope.$emit('setMappingFrom', res.status);
              } else {
                return false;
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      };
      // Go to Part List
      vm.GotoPartList = () => {
        BaseService.goToPartList();
      };
      // Go to MFR list
      vm.GotoMFRList = () => {
        BaseService.goToManufacturerList();
      };
      // Go to MFR Detail
      vm.GotoMFR = (item) => {
        BaseService.goToManufacturer(item.mfgcodeID);
      };

      // destroy on event on controller destroy
      $scope.$on('$destroy', () => {
        savePartProgramMapping();
      });
    }
  };
})();
