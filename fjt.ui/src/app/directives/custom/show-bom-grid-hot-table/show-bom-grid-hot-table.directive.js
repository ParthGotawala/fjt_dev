(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('showBomGridHotTable', showBomGridHotTable);

  /** @ngInject */
  function showBomGridHotTable($timeout, $q, CORE, USER, BaseService, RFQTRANSACTION, hotRegisterer) {
    const directive = {
      restrict: 'E',
      replace: false,
      scope: {
        bomSupportDetail: '=?',
        searchBomList: '=',
        visibilityField: '=?'
      },
      templateUrl: 'app/directives/custom/show-bom-grid-hot-table/show-bom-grid-hot-table.html',
      controller: showBomGridHotTableCtrl,
      controllerAs: 'vm',
      link: function (scope, element, attrs) {
      }
    };
    return directive;
    /** @ngInject */
    /**
    * Controller for view data of alternative details
    *
    * @param
    */
    function showBomGridHotTableCtrl($scope, MasterFactory, $element, $attrs, $filter) {
      const vm = this;
      vm.LabelConstant = CORE.LabelConstant;
      vm.searchBOMList = $scope.searchBomList;
      vm.gridConfig = CORE.gridConfig;
      vm.searchBOMModel = [];
      vm.refSearchBOMModel = vm.searchBOMModel;
      vm.isLoadSourceHeader = false;
      vm.SEARCH_MATERIAL_CONTEXT_MENU = CORE.SEARCH_MATERIAL_CONTEXT_MENU;
      vm.settings = {
        rowHeaders: true,
        licenseKey: 'non-commercial-and-evaluation',
        colHeaders: true,
        renderAllRows: false,
        fixedColumnsLeft: 1,
        minSpareRows: 1,
        stretchH: 'all',
        contextMenu: {
          items: {
            'updateMFR': {
              name: vm.SEARCH_MATERIAL_CONTEXT_MENU.updateMFR.name,
              disabled: () => {
                let selected = hotSearchMaterial.getSelected();
                if (!selected) { return true; };

                selected = selected[0];

                const row = selected[0];
                const col = selected[1];

                if (row === null) {
                  return true;
                } else if (col !== colAssyIdIndex && col !== colMfgPNIndex && col !== colDistPNIndex && col !== colCPNIndex) {
                  return true;
                } else if ((col === colAssyIdIndex && !vm.searchBOMModel[row].assyPIDCode) || (col === colMfgPNIndex && !vm.searchBOMModel[row].mfgPN) || (col === colDistPNIndex && !vm.searchBOMModel[row].distPN) || (col === colCPNIndex && !vm.searchBOMModel[row].custPN)) {
                  return true;
                }
              },
              callback: function (key, options) {
                options = options[0];
                if (!options.start) {
                  return;
                }

                const bomObj = vm.searchBOMModel[options.start.row];
                switch (options.start.col) {
                  case colAssyIdIndex: {
                    BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG.toLowerCase(), bomObj.assyId, USER.PartMasterTabs.Detail.Name);
                    break;
                  }
                  case colMfgPNIndex: {
                    BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG.toLowerCase(), bomObj.mfgPNID, USER.PartMasterTabs.Detail.Name);
                    break;
                  }
                  case colDistPNIndex: {
                    BaseService.goToComponentDetailTab(CORE.MFG_TYPE.DIST.toLowerCase(), bomObj.distMfgPNID, USER.PartMasterTabs.Detail.Name);
                    break;
                  }
                  case colCPNIndex: {
                    BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG.toLowerCase(), bomObj.custPNID, USER.PartMasterTabs.Detail.Name);
                    break;
                  }
                }
              }
            }
          }
        },
        mergeCells: true,
        manualColumnResize: true,
        autoRowSize: { syncLimit: 300 },
        selectionMode: 'single',
        fillHandle: false,
        cells: () => {
          const cellProperties = {
            renderer: 'cellRenderer'
          };
          return cellProperties;
        },
        afterInit: () => {
          window.setTimeout(() => {
            hotSearchMaterial = hotRegisterer.getInstance('hot-search-material');
            setHandsontableHeight();
          });
        },
        beforeCreateRow: () => {
          if (vm.searchBOMModel.length > 0) {
            return false;
          } else {
            return true;
          }
        }
      };

      const bomSupportDetail = $scope.bomSupportDetail;
      const bomHeaderList = bomSupportDetail && bomSupportDetail.bomHeaderList.length > 0 ? bomSupportDetail.bomHeaderList : [];
      const rohsList = bomSupportDetail && bomSupportDetail.rohsList.length > 0 ? bomSupportDetail.rohsList : [];;
      const attributeList = bomSupportDetail && bomSupportDetail.attributeList.length > 0 ? bomSupportDetail.attributeList : [];
      const typeList = bomSupportDetail && bomSupportDetail.typeList.length > 0 ? bomSupportDetail.typeList : [];
      const mountingTypeList = bomSupportDetail && bomSupportDetail.mountingTypeList.length > 0 ? bomSupportDetail.mountingTypeList : [];
      const partTypeList = bomSupportDetail && bomSupportDetail.partTypeList.length > 0 ? bomSupportDetail.partTypeList : [];
      const errorCodeList = bomSupportDetail && bomSupportDetail.errorCodeList.length > 0 ? bomSupportDetail.errorCodeList : [];
      const multiFields = RFQTRANSACTION.MULTI_FIELDS;
      const errorColor = RFQTRANSACTION.ERROR_COLOR;
      const logicCategoryDropdown = CORE.LogicCategoryDropdown;
      const logicCategoryDropdownDet = _.mapValues(_.keyBy(logicCategoryDropdown, 'id'), 'value');
      const dropDownTypes = [];
      const checkBoxTypes = [];
      const partInvalidMatchList = [false, 0];

      let qpaDesignatorError, mfgInvalidError, mfgVerificationError, distVerificationError, mfgDistMappingError, getMFGPNError, obsoletePartError, mfgGoodPartMappingError, mfgPNInvalidError, distInvalidError, distPNInvalidError, distGoodPartMappingError, lineMergeError, rohsStatusError, epoxyError, duplicateRefDesError, invalidRefDesError, invalidConnectorTypeError, duplicateMPNInSameLineError, matingPartRequiredError, driverToolsRequiredError, pickupPadRequiredError, restrictUseWithPermissionError, restrictUsePermanentlyError, mismatchMountingTypeError, mismatchRequiredProgrammingError, mappingPartProgramError, mismatchFunctionalCategoryError, mismatchCustomPartError, mismatchPitchError, mismatchToleranceError, mismatchVoltageError, mismatchPackageError, mismatchValueError, duplicateCPNError, functionalTestingRequiredError, requireMountingTypeError, requireFunctionalTypeError, uomMismatchedError, programingRequiredError, mismatchColorError, restrictUseInBOMError, customerApprovalForQPAREFDESError, customerApprovalForBuyError, customerApprovalForPopulateError, mismatchNumberOfRowsError, partPinIsLessthenBOMPinError, tbdPartError, restrictCPNUseInBOMError, restrictCPNUseWithPermissionError, restrictCPNUsePermanentlyError, exportControlledError, restrictUseInBOMWithPermissionError, unknownPartError, defaultInvalidMFRError, restrictUseInBOMExcludingAliasError, restrictUseInBOMExcludingAliasWithPermissionError, restrictUseExcludingAliasError, restrictUseExcludingAliasWithPermissionError, dnpQPARefDesError, customerApprovalForDNPQPAREFDESError, customerApprovalForDNPBuyError, dnpInvalidREFDESError, suggestedGoodPartError, suggestedGoodDistPartError;
      qpaDesignatorError, mfgInvalidError, mfgVerificationError, distVerificationError, mfgDistMappingError, getMFGPNError, obsoletePartError, mfgGoodPartMappingError, mfgPNInvalidError, distInvalidError, distPNInvalidError, distGoodPartMappingError, lineMergeError, rohsStatusError, epoxyError, duplicateRefDesError, invalidRefDesError, invalidConnectorTypeError, duplicateMPNInSameLineError, matingPartRequiredError, driverToolsRequiredError, pickupPadRequiredError, restrictUseWithPermissionError, restrictUsePermanentlyError, mismatchMountingTypeError, mismatchRequiredProgrammingError, mappingPartProgramError, mismatchFunctionalCategoryError, mismatchCustomPartError, mismatchPitchError, mismatchToleranceError, mismatchVoltageError, mismatchPackageError, mismatchValueError, duplicateCPNError, functionalTestingRequiredError, requireMountingTypeError, requireFunctionalTypeError, uomMismatchedError, programingRequiredError, mismatchColorError, restrictUseInBOMError, customerApprovalForQPAREFDESError, customerApprovalForBuyError, customerApprovalForPopulateError, mismatchNumberOfRowsError, partPinIsLessthenBOMPinError, tbdPartError, restrictCPNUseInBOMError, restrictCPNUseWithPermissionError, restrictCPNUsePermanentlyError, exportControlledError, restrictUseInBOMWithPermissionError, unknownPartError, defaultInvalidMFRError, restrictUseInBOMExcludingAliasError, restrictUseInBOMExcludingAliasWithPermissionError, restrictUseExcludingAliasError, restrictUseExcludingAliasWithPermissionError, dnpQPARefDesError, customerApprovalForDNPQPAREFDESError, customerApprovalForDNPBuyError, dnpInvalidREFDESError, suggestedGoodPartError, suggestedGoodDistPartError = { errorColor: errorColor };
      let customerApprovalError = { errorColor: errorColor, displayOrder: 1 };
      let colMfgPNIndex, colDistPNIndex, colAssyIdIndex, colCPNIndex;

      let hotSearchMaterial = null;
      let sourceHeaderVisible = [];
      let htmlTypes = [];

      const exportIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.EXPORT_CONTROLLED_ICON);
      const badPartIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.BAD_PART_ICON);
      const partCorrectList = CORE.PartCorrectList;
      const nrndIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.OBSOLETE_NRND_ICON);
      const wrenchIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.WRENCH_ICON);
      const tmaxIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.TMAX_ICON);
      const tmaxYellowIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.TMAX_YELLOW_ICON);
      const custPartIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.CUST_PART_ICON);
      const operationalImagePath = CORE.WEB_URL + USER.DYNAMIC_ATTRIBUTE_BASE_PATH;
      const mismatchMountingTypeIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.MISMATCH_MOUNTING_TYPE_ICON);
      const approveMountingTypeIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.APPROVE_MOUNTING_TYPE_ICON);

      const rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      const rohsImageElem = ' <img class="rohs-bom-image" src="rohsImagePath" title="rohsTitle">';
      const lockIconElem = '<md-icon class="font-size-20 material-icons icon icon-lock color-black" role="img" aria-hidden="true" title="Lock Approved Part"></md-icon>';
      const unlockIconElem = '<md-icon class="font-size-20 icon icon-lock-unlocked material-icons color-black" role="img" aria-hidden="true" title="Unlock Approved Part"></md-icon>';
      const exportControlledIconElem = ' <img class="pt-5" src="' + exportIcon + '" title="Export Controlled">';
      const badPartIconElem = ' <img class="pt-5" src="' + badPartIcon + '" title="Incorrect Part">';
      const wrenchIconElem = ' <img class="rohs-bom-image" src="' + wrenchIcon + '" title="wrenchTitle">';
      const matingPartIconElem = ' <md-icon md-font-icon="icons-require-mating-part" role="img" class="cm-custom-icon-font icons-require-mating-part color-black" title="matingPartTitle"></md-icon>';
      const pickupPadIconElem = ' <md-icon md-font-icon="icons-required-pickup-pad" role="img" class="cm-custom-icon-font icons-required-pickup-pad color-black" title="pickupPadTitle"></md-icon>';
      const partStatusIconElem = ' <img class="pt-5" src="' + nrndIcon + '" title="partStatusTitle">';
      const mismatchMountingTypeIconElem = ' <img class="pt-5" src="' + mismatchMountingTypeIcon + '" title="mismatchMountingTypeTitle">';
      const approveMountingTypeIconElem = ' <img class="pt-5" src="' + approveMountingTypeIcon + '" title="approveMountingTypeTitle">';
      const programingIconElem = ' <md-icon md-font-icon="icons-required-program" role="img" class="cm-custom-icon-font icons-required-program color-black" title="programingTitle"></md-icon>';
      const tmaxIconElem = ' <img class="pt-5" src="' + tmaxIcon + '" title="tmaxTitle">';
      const tmaxYellowIconElem = ' <img class="pt-5" src="' + tmaxYellowIcon + '" title="Tmax is not defined.">';
      const customPartIcon = ' <img class="pt-5" src="' + custPartIcon + '" title="Custom Part">';

      const successColor = RFQTRANSACTION.SUCCESS_COLOR;

      Handsontable.renderers.registerRenderer('cellRenderer', function (instance, td, row, col, prop, value, cellProperties) {
        if (dropDownTypes.indexOf(prop) !== -1) {
          Handsontable.renderers.AutocompleteRenderer.apply(this, arguments);
        }
        else if (checkBoxTypes.indexOf(prop) !== -1) {
          Handsontable.renderers.CheckboxRenderer.apply(this, arguments);
        }
        else if (htmlTypes.indexOf(prop) !== -1) {
          if (prop === 'rohsComplient') {
            Handsontable.renderers.HtmlRenderer.apply(this, arguments);
            const bomObj = vm.searchBOMModel[row];
            let isInValid = true;
            if (bomObj) {
              isInValid = isBOMObjInValid(partInvalidMatchList, bomObj);
            }

            if (!isInValid && (!bomObj.restrictCPNUsePermanentlyStep || !bomObj.restrictCPNUseWithPermissionStep || bomObj.restrictCPNUseInBOMStep)) {
              isInValid = true;
            }

            if (bomObj && bomObj.RoHSStatusID !== null && bomObj.RoHSStatusID !== undefined) {
              const rohsDet = _.find(rohsList, { id: bomObj.RoHSStatusID });
              let icon = '';

              if (rohsDet && !rohsDet.rohsIcon) {
                rohsDet.rohsIcon = CORE.DEFAULT_IMAGE;
              }

              if (rohsDet && rohsDet.rohsIcon) {
                icon += rohsImageElem.replace('rohsImagePath', (rohsImagePath + rohsDet.rohsIcon)).replace('rohsTitle', rohsDet.name);
              }
              if (bomObj.mfgPNID !== CORE.TBDMFRPNID && bomObj.mfgPNID !== CORE.NOTAVAILABLEMFRPNID && !isInValid && !bomObj.isUnlockApprovedPart) {
                icon += lockIconElem;
              }
              if (bomObj.mfgPNID !== CORE.TBDMFRPNID && bomObj.mfgPNID !== CORE.NOTAVAILABLEMFRPNID && !isInValid && bomObj.isUnlockApprovedPart) {
                icon += unlockIconElem;
              }
              if (bomObj.isMFGGoodPart === partCorrectList.IncorrectPart || bomObj.isDistGoodPart === partCorrectList.IncorrectPart) {
                icon += badPartIconElem;
              }
              if (bomObj.isExportControlled) {
                icon += exportControlledIconElem;
              }
              if (bomObj.driverToolRequired) {
                let toolTipMessage = CORE.WRENCH_TOOLTIP;
                if (bomObj.driveToolIDs && bomObj.driveToolIDs.length > 0) {
                  const driveToolIds = _.split(bomObj.driveToolIDs, ',');
                  _.each(driveToolIds, (componentID) => {
                    if (componentID) {
                      const drivetool = _.find(vm.refSearchBOMModel, { 'mfgPNID': parseInt(componentID) });
                      if (drivetool) {
                        toolTipMessage = stringFormat(CORE.WRENCH_LINE_TOOLTIP, drivetool.lineID ? drivetool.lineID : drivetool._lineID);
                      }
                    }
                  });
                }
                icon += wrenchIconElem.replace('wrenchTitle', toolTipMessage);
              }
              if (bomObj.matingPartRquired) {
                const toolTipMessage = bomObj.matingPartRquiredStep ? CORE.MATING_LINE_TOOLTIP : CORE.MATING_TOOLTIP;
                icon += matingPartIconElem.replace('matingPartTitle', toolTipMessage);
              }
              if (bomObj.pickupPadRequired) {
                const toolTipMessage = bomObj.pickupPadRequiredStep ? CORE.PICKUPPAD_LINE_TOOLTIP : CORE.PICKUPPAD_TOOLTIP;
                icon += pickupPadIconElem.replace('pickupPadTitle', toolTipMessage);
              }
              if (bomObj.isObsolete) {
                const toolTipMessage = bomObj.partStatus;
                icon += partStatusIconElem.replace('partStatusTitle', toolTipMessage);
              }
              if ((!bomObj.mismatchMountingTypeStep && bomObj.mismatchMountingTypeError) || bomObj.approvedMountingType) {
                const toolTipMessage = bomObj.mismatchMountingTypeError;
                icon += mismatchMountingTypeIconElem.replace('mismatchMountingTypeTitle', toolTipMessage);
                if (bomObj.approvedMountingType) {
                  const approveMountingTypeTitle = bomObj.mountingtypeID;
                  icon += approveMountingTypeIconElem.replace('approveMountingTypeTitle', approveMountingTypeTitle);
                }
              }
              if (bomObj.programingRequired) {
                const toolTipMessage = CORE.PROGRAMING_REQUIRED_TOOLTIP;
                icon += programingIconElem.replace('programingTitle', toolTipMessage);
              }
              if (bomObj.isTemperatureSensitive) {
                icon += tmaxIconElem.replace('tmaxTitle', stringFormat(CORE.TMAX_TOOLTIP, bomObj.maxSolderingTemperature, bomObj.maxTemperatureTime && bomObj.maxTemperatureTime > 0 ? bomObj.maxTemperatureTime : '?'));
              }
              else if (bomObj.isFunctionalTemperatureSensitive) {
                icon += tmaxYellowIconElem;
              }
              if (bomObj.operationalAttributeIDs && bomObj.operationalAttributeIDs.length > 0) {
                const operationalAttributeIDs = _.split(bomObj.operationalAttributeIDs, ',');
                _.each(operationalAttributeIDs, (attributeID) => {
                  if (attributeID) {
                    const attribute = _.find(attributeList, { 'id': parseInt(attributeID) });
                    if (attribute) {
                      if (attribute && !attribute.icon) {
                        attribute.icon = CORE.DEFAULT_IMAGE;
                      }
                      icon += rohsImageElem.replace('rohsImagePath', (operationalImagePath + attribute.icon)).replace('rohsTitle', attribute.description ? attribute.description : '');
                    }
                  }
                });
              }
              if (bomObj.isCustom) {
                icon += customPartIcon;
              }

              $(td).html(icon);
            } else {
              $(td).empty();
              return false;
            }
          }
          else {
            return Handsontable.renderers.HtmlRenderer.apply(this, arguments);
          }
        }
        else {
          Handsontable.renderers.TextRenderer.apply(this, arguments);
        }

        if (hotSearchMaterial && hotSearchMaterial.isEmptyRow(row)) {
          return;
        }

        switch (prop) {
          case 'lineID': {
            td.style.textAlign = 'right';
            break;
          }
          case 'mfgCode': {
            const bomObj = vm.searchBOMModel[row];
            if (bomObj) {
              td.style.background = bomObj.mfgErrorColor;
              if (!bomObj.mfgCodeID) {
                td.style.textDecoration = 'underline dashed';
              }
              if (bomObj.mfgPNID && (bomObj.restrictUseInBOMWithPermissionStep || bomObj.restrictUseInBOMExcludingAliasWithPermissionStep)) {
                td.style.textDecoration = 'double line-through';
              }
              if (bomObj.mfgPNID && (bomObj.restrictCPNUseInBOMStep || bomObj.restrictUseInBOMStep || bomObj.restrictUseExcludingAliasStep === false || bomObj.restrictUseInBOMExcludingAliasStep || bomObj.restrictUsePermanentlyStep === false || bomObj.restrictUseWithPermissionStep === false || bomObj.restrictUseExcludingAliasWithPermissionStep === false || bomObj.restrictCPNUsePermanentlyStep === false || bomObj.restrictCPNUseWithPermissionStep === false)) {
                td.style.textDecoration = 'line-through';
              }
              if (bomObj.mfgTooltip) {
                td.title = stringFormat('{0}{1}', bomObj.mfgCode ? (bomObj.mfgCode + '\n') : '', bomObj.mfgTooltip);
              } else {
                td.title = bomObj.mfgCode ? bomObj.mfgCode : '';
              }
            }
            break;
          }
          case 'mfgPN': {
            const bomObj = vm.searchBOMModel[row];
            if (bomObj) {
              td.style.background = bomObj.mfgErrorColor;
              if (bomObj.mfgTooltip) {
                td.title = bomObj.mfgTooltip;
              } else if (bomObj.mfgPN && !bomObj.mfgPNID) {
                td.title = stringFormat(CORE.MESSAGE_CONSTANT.NOT_CONFIGURED_OR_VERIFIED, vm.LabelConstant.MFGPN);
              } else {
                td.title = '';
              }
              if (!bomObj.mfgPNID) {
                td.style.textDecoration = 'underline dashed';
              }
              if (bomObj.createdBy && bomObj.createdBy.toLowerCase() !== 'auto') {
                td.style.fontWeight = 700;
              }
              if (bomObj.mfgPNID && (bomObj.restrictCPNUseInBOMStep || bomObj.restrictUseInBOMStep || bomObj.restrictUseExcludingAliasStep === false || bomObj.restrictUseExcludingAliasWithPermissionStep === false || bomObj.restrictUseInBOMExcludingAliasStep || bomObj.restrictUsePermanentlyStep === false || bomObj.restrictUseWithPermissionStep === false || bomObj.restrictCPNUsePermanentlyStep === false || bomObj.restrictCPNUseWithPermissionStep === false)) {
                td.style.textDecoration = 'line-through';
              }
              if (bomObj.mfgPNID && (bomObj.restrictUseInBOMWithPermissionStep || bomObj.restrictUseInBOMExcludingAliasWithPermissionStep)) {
                td.style.textDecoration = 'double line-through';
              }
            }
            break;
          }
        }
      });

      const defaultBomSourceHeader = [
        {
          field: 'id',
          header: 'id',
          hidden: true,
          isDefault: true
        },
        {
          field: 'rfqAlternatePartID',
          header: 'rfqAlternatePartID',
          hidden: true,
          isDefault: true
        },
        {
          field: '_lineID',
          header: '_lineID',
          hidden: true,
          isDefault: true
        },
        {
          field: 'mergeLines',
          header: 'Merged Item',
          hidden: true,
          isDefault: true
        },
        {
          field: 'ltbDate',
          header: 'LTB Date',
          hidden: true,
          isDefault: true
        },
        {
          field: 'suggestedPart',
          header: 'Suggested Part',
          hidden: true,
          isDefault: true
        },
        {
          field: 'duplicateLineID',
          header: 'Duplicate LineID',
          hidden: true,
          isDefault: true
        },
        {
          field: 'duplicateRefDesig',
          header: 'Duplicate ' + vm.LabelConstant.BOM.REF_DES,
          hidden: true,
          isDefault: true
        },
        {
          field: 'refDesigCount',
          header: vm.LabelConstant.BOM.REF_DES + ' Count',
          hidden: true,
          isDefault: true
        },
        {
          field: 'dnpDesigCount',
          header: vm.LabelConstant.BOM.DNP_REF_DES + ' Count',
          hidden: true,
          isDefault: true
        },
        {
          field: 'partRoHSStatus',
          header: 'Part RoHS Status',
          hidden: true,
          isDefault: true
        },
        {
          field: 'assyRoHSStatus',
          header: 'Assy RoHS Status',
          hidden: true,
          isDefault: true
        },
        {
          field: 'invalidDNPREFDES',
          header: 'Invalid ' + vm.LabelConstant.BOM.DNP_REF_DES,
          hidden: true,
          isDefault: true
        },
        {
          field: 'invalidRefDesig',
          header: 'Invalid ' + vm.LabelConstant.BOM.REF_DES,
          hidden: true,
          isDefault: true
        },
        {
          field: 'aliasMFGPN',
          header: 'Distributor Alias',
          hidden: true,
          isDefault: true
        },
        {
          field: 'connectorType',
          header: 'Connector Type',
          hidden: true,
          isDefault: true
        }, {
          field: 'refRFQLineItemID',
          header: 'Parent Line',
          hidden: true,
          isDefault: true
        }, {
          field: 'level',
          header: 'Level',
          hidden: true,
          isDefault: true
        }, {
          field: 'mountingtypes',
          header: 'Mounting Types',
          hidden: true,
          isDefault: true
        }, {
          field: 'functionaltypes',
          header: 'Functional Types',
          hidden: true,
          isDefault: true
        }, {
          field: 'partMFGCode',
          header: 'Part MFR',
          hidden: true,
          isDefault: true
        }, {

          field: 'partDistributor',
          header: 'Part Supplier',
          hidden: true,
          isDefault: true
        }, {
          field: 'partStatus',
          header: 'Part Status',
          hidden: true,
          isDefault: true
        }
      ];

      const setHandsontableHeight = () => {
        const offset = $('#hot-search-material-container').offset();
        if (!offset) {
          return;
        }
        const docHeight = $('#searchMaterialForms').height();
        const handsontableHeight = (docHeight - offset.top) - 314;
        $('#hot-search-material-container').height(handsontableHeight).css({
          overflow: 'hidden'
        });
        $('#hot-search-material-container .wtHolder').height(handsontableHeight);
      };

      const handsontableresize = () => {
        const offset = $('#hot-search-material-container').offset();
        if (!offset) {
          return;
        }
        const docHeight = $('#searchMaterialForms').height();
        const handsontableHeight = (docHeight - offset.top) - 314;
        $('#hot-search-material-container').height(handsontableHeight).css({
          overflow: 'hidden'
        });
        $('#hot-search-material-container .wtHolder').height(handsontableHeight);
      };

      const initBomSourceHeader = () => $timeout(() => {
        vm.bomSourceHeader = defaultBomSourceHeader;

        return MasterFactory.getUIGridColumnDetail({ gridId: vm.gridConfig.gridSearchMaterialHotTable }).query().$promise.then((listOfColumn) => {
          if (listOfColumn && listOfColumn.data && listOfColumn.data.columnDefList.length > 0) {
            vm.bomSourceHeader = [];
            vm.bomSourceHeader = [...defaultBomSourceHeader, ...listOfColumn.data.columnDefList];
            callAfterGetSourceHeader();
            return true;
          } else {
            bomHeaderList.forEach((header) => {
              switch (header.field) {
                case 'lineID': {
                  vm.bomSourceHeader.push({
                    field: 'lineID',
                    header: header.name,
                    title: header.name,
                    type: 'numeric',
                    width: 40,
                    readOnly: true,
                    hidden: false
                  });
                  vm.bomSourceHeader.push({
                    field: 'cust_lineID',
                    header: 'Cust BOM Line#',
                    title: 'Cust BOM Line#',
                    type: 'text',
                    width: 50,
                    readOnly: true,
                    hidden: false
                  });
                  vm.bomSourceHeader.push({
                    field: 'assyPIDCode',
                    header: CORE.LabelConstant.Assembly.PIDCode,
                    title: CORE.LabelConstant.Assembly.PIDCode,
                    type: 'text',
                    width: 180,
                    readOnly: true,
                    hidden: false
                  });
                  break;
                }
                case 'custPN': {
                  vm.bomSourceHeader.push({
                    field: 'custPN',
                    header: header.name,
                    title: header.name,
                    type: 'text',
                    width: 125,
                    readOnly: true,
                    hidden: false
                  });
                  break;
                }
                case 'customerRev': {
                  vm.bomSourceHeader.push({
                    field: 'customerRev',
                    header: header.name,
                    title: header.name,
                    type: 'text',
                    width: 45,
                    readOnly: true,
                    hidden: false
                  });
                  break;
                }
                case 'customerDescription': {
                  vm.bomSourceHeader.push({
                    field: 'customerDescription',
                    header: header.name,
                    title: header.name,
                    type: 'text',
                    width: 125,
                    readOnly: true,
                    hidden: false
                  });
                  break;
                }
                case 'customerPartDesc': {
                  vm.bomSourceHeader.push({
                    field: 'customerPartDesc',
                    header: header.name,
                    title: header.name,
                    type: 'text',
                    width: 120,
                    readOnly: true,
                    hidden: false
                  });
                  break;
                }
                case 'qpa': {
                  vm.bomSourceHeader.push({
                    field: 'qpa',
                    header: header.name,
                    title: header.name,
                    type: 'text',
                    width: 50,
                    readOnly: true,
                    hidden: false
                  });
                  break;
                }
                case 'refDesig': {
                  vm.bomSourceHeader.push({
                    field: 'refDesig',
                    header: header.name,
                    title: header.name,
                    type: 'text',
                    width: 125,
                    readOnly: true,
                    hidden: false
                  });
                  break;
                }
                case 'numOfPosition': {
                  vm.bomSourceHeader.push({
                    field: 'numOfPosition',
                    header: header.name,
                    title: header.name,
                    type: 'text',
                    width: 90,
                    readOnly: true,
                    hidden: true
                  });
                  break;
                }
                case 'numOfRows': {
                  vm.bomSourceHeader.push({
                    field: 'numOfRows',
                    header: header.name,
                    title: header.name,
                    type: 'text',
                    width: 60,
                    readOnly: true,
                    hidden: true
                  });
                  break;
                }
                case 'uomID': {
                  vm.bomSourceHeader.push({
                    field: 'uomID',
                    header: header.name,
                    title: header.name,
                    type: 'text',
                    width: 60,
                    readOnly: true,
                    hidden: false
                  });
                  break;
                }
                case 'dnpQty': {
                  vm.bomSourceHeader.push({
                    field: 'dnpQty',
                    header: header.name,
                    title: header.name,
                    type: 'text',
                    width: 50,
                    readOnly: true,
                    hidden: false
                  });
                  break;
                }
                case 'dnpDesig': {
                  vm.bomSourceHeader.push({
                    field: 'dnpDesig',
                    header: header.name,
                    title: header.name,
                    type: 'text',
                    width: 90,
                    readOnly: true,
                    hidden: false
                  });
                  break;
                }
                case 'isBuyDNPQty': {
                  vm.bomSourceHeader.push({
                    field: 'isBuyDNPQty',
                    header: header.name,
                    title: header.name,
                    type: 'text',
                    width: 90,
                    readOnly: true,
                    hidden: false
                  });
                  break;
                }
                case 'isInstall': {
                  vm.bomSourceHeader.push({
                    field: 'isInstall',
                    header: header.name,
                    title: header.name,
                    type: 'checkbox',
                    width: 70,
                    readOnly: true,
                    className: 'htCenter',
                    hidden: false
                  });
                  break;
                }
                case 'isPurchase': {
                  vm.bomSourceHeader.push({
                    field: 'isPurchase',
                    header: header.name,
                    title: header.name,
                    type: 'checkbox',
                    width: 40,
                    readOnly: true,
                    className: 'htCenter',
                    hidden: false
                  });
                  break;
                }
                case 'isNotRequiredKitAllocation': {
                  vm.bomSourceHeader.push({
                    field: 'isNotRequiredKitAllocation',
                    header: header.name,
                    title: header.name,
                    type: 'checkbox',
                    width: 100,
                    readOnly: true,
                    className: 'htCenter',
                    hidden: true
                  });
                  break;
                }
                case 'isSupplierToBuy': {
                  vm.bomSourceHeader.push({
                    field: 'isSupplierToBuy',
                    header: header.name,
                    title: header.name,
                    type: 'checkbox',
                    width: 65,
                    readOnly: true,
                    className: 'htCenter',
                    hidden: false
                  });
                  break;
                }
                case 'programingStatus': {
                  vm.bomSourceHeader.push({
                    field: 'programingStatus',
                    header: header.name,
                    title: header.name,
                    type: 'text',
                    width: 150,
                    readOnly: true,
                    hidden: false
                  });
                  break;
                }
                case 'substitutesAllow': {
                  vm.bomSourceHeader.push({
                    field: 'substitutesAllow',
                    header: header.name,
                    title: header.name,
                    type: 'text',
                    width: 90,
                    readOnly: true,
                    hidden: true
                  });
                  break;
                }
                case 'mfgPNDescription': {
                  vm.bomSourceHeader.push({
                    field: 'mfgPNDescription',
                    header: header.name,
                    title: header.name,
                    type: 'text',
                    width: 120,
                    readOnly: true,
                    hidden: false
                  });
                  break;
                }
                case 'mfgCode': {
                  vm.bomSourceHeader.push({
                    field: 'mfgCode',
                    header: header.name,
                    title: header.name,
                    type: 'text',
                    width: 135,
                    readOnly: true,
                    hidden: false
                  });
                  break;
                }
                case 'mfgPN': {
                  vm.bomSourceHeader.push({
                    field: 'mfgPN',
                    header: header.name,
                    title: header.name,
                    type: 'text',
                    width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
                    readOnly: true,
                    hidden: false
                  });

                  vm.bomSourceHeader.push({
                    field: 'rohsComplient',
                    header: 'RoHS & Misc',
                    title: 'RoHS & Misc',
                    type: 'text',
                    width: 200,
                    readOnly: true,
                    hidden: false
                  });
                  break;
                }
                case 'description': {
                  vm.bomSourceHeader.push({
                    field: 'description',
                    header: header.name,
                    title: header.name,
                    type: 'text',
                    width: 500,
                    readOnly: true,
                    hidden: false
                  });
                  vm.bomSourceHeader.push({
                    field: 'additionalComment',
                    header: 'Additional Comment',
                    title: 'Additional Comment',
                    type: 'text',
                    width: 500,
                    readOnly: true,
                    hidden: false
                  });
                  vm.bomSourceHeader.push({
                    field: 'partcategoryID',
                    header: 'Type',
                    title: 'Type',
                    type: 'text',
                    width: 150,
                    readOnly: true,
                    source: typeList.map((x) => x.Value),
                    hidden: false
                  });
                  vm.bomSourceHeader.push({
                    field: 'mountingtypeID',
                    header: 'Mounting Type',
                    title: 'Mounting Type',
                    type: 'text',
                    width: 150,
                    readOnly: true,
                    source: mountingTypeList.map((x) => x.name),
                    hidden: false
                  });

                  vm.bomSourceHeader.push({
                    field: 'parttypeID',
                    header: 'Part Type',
                    title: 'Functional Type',
                    type: 'text',
                    width: 150,
                    readOnly: true,
                    source: partTypeList.map((x) => x.partTypeName),
                    hidden: false
                  });
                  vm.bomSourceHeader.push({
                    field: 'partPackage',
                    header: 'Package',
                    title: 'Package/Case(Shape) Type',
                    type: 'text',
                    className: 'htCenter',
                    readOnly: true,
                    width: 100,
                    hidden: false
                  });

                  vm.bomSourceHeader.push({
                    field: 'deviceMarking',
                    header: 'Device Marking',
                    title: 'Device Marking',
                    type: 'text',
                    className: 'htCenter',
                    readOnly: true,
                    width: 100,
                    hidden: false
                  });
                  break;
                }
                case 'distributor': {
                  vm.bomSourceHeader.push({
                    field: 'distributor',
                    header: header.name,
                    title: header.name,
                    type: 'text',
                    width: 140,
                    readOnly: vm.isBOMReadOnly,
                    hidden: false
                  });
                  break;
                }
                case 'distPN': {
                  vm.bomSourceHeader.push({
                    field: 'distPN',
                    header: header.name,
                    title: header.name,
                    type: 'text',
                    width: 210,
                    readOnly: true,
                    hidden: false
                  });
                  vm.bomSourceHeader.push({
                    field: 'badMfgPN',
                    header: 'Suggested Correct Part',
                    title: 'Suggested Correct Part',
                    type: 'text',
                    readOnly: true,
                    width: 160,
                    hidden: false
                  });
                  vm.bomSourceHeader.push({
                    field: 'uom',
                    header: 'Part UOM',
                    title: 'Part UOM',
                    type: 'text',
                    className: 'htCenter',
                    readOnly: true,
                    width: 120,
                    hidden: false
                  });
                  vm.bomSourceHeader.push({
                    field: 'color',
                    header: 'Color',
                    title: 'Color',
                    type: 'text',
                    className: 'htCenter',
                    readOnly: true,
                    width: 80,
                    hidden: false
                  });
                  vm.bomSourceHeader.push({
                    field: 'pitch',
                    header: 'Pitch',
                    title: 'Pitch',
                    type: 'text',
                    className: 'htCenter',
                    readOnly: true,
                    width: 80,
                    hidden: false
                  });
                  vm.bomSourceHeader.push({
                    field: 'noOfRows',
                    header: 'Part No. of Rows',
                    title: 'Part No. of Rows',
                    type: 'text',
                    className: 'htCenter',
                    readOnly: true,
                    width: 120,
                    hidden: false
                  });
                  break;
                }
                case 'componentLead': {
                  vm.bomSourceHeader.push({
                    field: 'componentLead',
                    header: header.name,
                    title: header.name,
                    type: 'text',
                    width: 80,
                    readOnly: true,
                    hidden: false
                  });
                  vm.bomSourceHeader.push({
                    field: 'packaging',
                    header: 'Packaging',
                    title: 'Packaging',
                    type: 'text',
                    className: 'htCenter',
                    readOnly: true,
                    width: 100,
                    hidden: false
                  });
                  vm.bomSourceHeader.push({
                    field: 'value',
                    header: 'Value',
                    title: 'Value',
                    type: 'text',
                    className: 'htCenter',
                    readOnly: true,
                    width: 80,
                    hidden: false
                  });
                  vm.bomSourceHeader.push({
                    field: 'tolerance',
                    header: 'Tolerance',
                    title: 'Tolerance',
                    type: 'text',
                    className: 'htCenter',
                    readOnly: true,
                    width: 80,
                    hidden: false
                  });
                  vm.bomSourceHeader.push({
                    field: 'voltage',
                    header: 'Voltage',
                    title: 'Voltage',
                    type: 'text',
                    className: 'htCenter',
                    readOnly: true,
                    width: 70,
                    hidden: false
                  });
                  vm.bomSourceHeader.push({
                    field: 'powerRating',
                    header: 'Power (Watts)',
                    title: 'Power (Watts)',
                    type: 'text',
                    className: 'htCenter',
                    readOnly: true,
                    width: 70,
                    hidden: false
                  });
                  vm.bomSourceHeader.push({
                    field: 'maxSolderingTemperature',
                    header: 'Max Soldering Temperature (C)',
                    title: 'Max Soldering Temperature (C)',
                    type: 'text',
                    className: 'htCenter',
                    readOnly: true,
                    width: 120,
                    hidden: false
                  });
                  vm.bomSourceHeader.push({
                    field: 'minOperatingTemp',
                    header: 'Min. Temp.',
                    title: 'Min. Temp.',
                    type: 'text',
                    className: 'htCenter',
                    readOnly: true,
                    width: 70,
                    hidden: false
                  });
                  vm.bomSourceHeader.push({
                    field: 'maxOperatingTemp',
                    header: 'Max. Temp.',
                    title: 'Max. Temp.',
                    type: 'text',
                    className: 'htCenter',
                    readOnly: true,
                    width: 70,
                    hidden: false
                  });
                  vm.bomSourceHeader.push({
                    field: 'customerApprovalComment',
                    header: 'Customer Approval/Unapproved Comments',
                    title: 'Customer Approval/Unapproved Comments',
                    type: 'text',
                    width: 250,
                    readOnly: true,
                    hidden: false
                  });
                  break;
                }
              }
            });

            const filterBomHeaderList = _.filter(vm.bomSourceHeader, (data) => !data.isDefault);

            MasterFactory.saveUIGridColumnDetail().query({ gridId: vm.gridConfig.gridSearchMaterialHotTable, columnDefList: filterBomHeaderList }).$promise.then(() => {
              callAfterGetSourceHeader();
              return true;
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      });

      const callAfterGetSourceHeader = () => {
        sourceHeaderVisible = [];
        vm.bomSourceHeader.forEach((item) => {
          if (item.type === 'dropdown') {
            dropDownTypes.push(item.field);
          }
          else if (item.type === 'checkbox') {
            checkBoxTypes.push(item.field);
          }

          if (!item.hidden) {
            sourceHeaderVisible.push(item);
          }
        });

        htmlTypes = ['badMfgPN', 'rohsComplient', 'customerApprovalComment'];

        colAssyIdIndex = _.findIndex(sourceHeaderVisible, (x) => x.field === 'assyPIDCode');
        colCPNIndex = _.findIndex(sourceHeaderVisible, (x) => x.field === 'custPN');
        colMfgPNIndex = _.findIndex(sourceHeaderVisible, (x) => x.field === 'mfgPN');
        colDistPNIndex = _.findIndex(sourceHeaderVisible, (x) => x.field === 'distPN');

        $scope.visibilityField = [];
        $scope.visibilityField = angular.copy(vm.bomSourceHeader);
      };

      const active = () => {
        $q.all([initBomSourceHeader()]).then(() => {
          if (vm.searchBOMList && vm.searchBOMList.length > 0) {
            vm.isLoadSourceHeader = true;
            displayBOMDetail(vm.searchBOMList);
          }
        });
      };

      active();

      const displayBOMDetail = (bomLineList) => {
        getErrorCode();
        generateModelFromDB(bomLineList);
        mergeCommonCells();
      };

      const generateModelFromDB = (bomLineList) => {
        vm.refBomModel = [];
        _.each(bomLineList, (modelRow) => {
          modelRow._lineID = modelRow.lineID;
          modelRow.isInstall = modelRow.isInstall === 1 ? true : false;
          modelRow.isPurchase = modelRow.isPurchase === 1 ? true : false;
          modelRow.isNotRequiredKitAllocation = modelRow.isNotRequiredKitAllocation === 1 ? true : false;
          modelRow.isSupplierToBuy = modelRow.isSupplierToBuy === 1 ? true : false;
          modelRow.approvedMountingType = modelRow.approvedMountingType === 1 ? true : false;
          modelRow.isBuyDNPQty = modelRow.isBuyDNPQty ? modelRow.isBuyDNPQty : null;
          modelRow.isUnlockCustomerBOMLine = modelRow.isUnlockCustomerBOMLine || false;
          const errorArr = modelRow.description ? modelRow.description.split('\n') : [];
          _.map(errorArr, (err) => {
            const match = err.match(/(.*?:)/);
            if (!match) {
              return true;
            }

            const errorCode = (match[0]).slice(0, -1);
            if (qpaDesignatorError.errorCode === errorCode || duplicateRefDesError.errorCode === errorCode || invalidRefDesError.errorCode === errorCode) {
              if (modelRow.qpaDesignatorStepError) {
                modelRow.qpaDesignatorStepError += ('\n' + err.split(': ').slice(1));
              } else {
                modelRow.qpaDesignatorStepError = err.split(': ').slice(1);
              }
            } else if (lineMergeError.errorCode === errorCode) {
              modelRow.lineMergeStepError = err.split(': ').slice(1);
            } else if (customerApprovalForQPAREFDESError.errorCode === errorCode) {
              modelRow.customerApprovalForQPAREFDESError = err.split(': ').slice(1);
            } else if (customerApprovalForBuyError.errorCode === errorCode) {
              modelRow.customerApprovalForBuyError = err.split(': ').slice(1);
            } else if (customerApprovalForDNPQPAREFDESError.errorCode === errorCode) {
              modelRow.customerApprovalForDNPQPAREFDESError = err.split(': ').slice(1);
            } else if (customerApprovalForDNPBuyError.errorCode === errorCode) {
              modelRow.customerApprovalForDNPBuyError = err.split(': ').slice(1);
            } else if (customerApprovalForPopulateError.errorCode === errorCode) {
              modelRow.customerApprovalForPopulateError = err.split(': ').slice(1);
            } else if (dnpQPARefDesError.errorCode === errorCode) {
              modelRow.dnpQPARefDesError = err.split(': ').slice(1);
            } else if (customerApprovalForDNPQPAREFDESError.errorCode === errorCode) {
              modelRow.customerApprovalForDNPQPAREFDESError = err.split(': ').slice(1);
            } else if (dnpInvalidREFDESError.errorCode === errorCode) {
              modelRow.dnpInvalidREFDESError = err.split(': ').slice(1);
            }
          });

          const errorArrAlternate = modelRow.descriptionAlternate ? modelRow.descriptionAlternate.split('\n') : [];
          _.map(errorArrAlternate, (err) => {
            const match = err.match(/(.*?:)/);
            if (!match) {
              return true;
            }

            const errorCodeAlternate = (match[0]).slice(0, -1);
            if (errorCodeAlternate) {
              if (mfgInvalidError && mfgInvalidError.errorCode === errorCodeAlternate) {
                modelRow.mfgCodeStepError = err.split(': ').slice(1);
              } else if (mfgVerificationError && mfgVerificationError.errorCode === errorCodeAlternate) {
                modelRow.mfgVerificationStepError = err.split(': ').slice(1);
              } else if (distInvalidError && distInvalidError.errorCode === errorCodeAlternate) {
                modelRow.distCodeStepError = err.split(': ').slice(1);
              } else if (distVerificationError && distVerificationError.errorCode === errorCodeAlternate) {
                modelRow.distVerificationStepError = err.split(': ').slice(1);
              } else if (getMFGPNError && getMFGPNError.errorCode === errorCodeAlternate) {
                modelRow.getMFGPNStepError = err.split(': ').slice(1);
              } else if (obsoletePartError && obsoletePartError.errorCode === errorCodeAlternate) {
                modelRow.obsoletePartStepError = err.split(': ').slice(1);
              } else if (mfgGoodPartMappingError && mfgGoodPartMappingError.errorCode === errorCodeAlternate) {
                modelRow.mfgGoodPartMappingStepError = err.split(': ').slice(1);
              } else if (suggestedGoodPartError && suggestedGoodPartError.errorCode === errorCodeAlternate) {
                modelRow.suggestedGoodPartError = err.split(': ').slice(1);
              } else if (suggestedGoodDistPartError && suggestedGoodDistPartError.errorCode === errorCodeAlternate) {
                modelRow.suggestedGoodDistPartError = err.split(': ').slice(1);
              } else if (distGoodPartMappingError && distGoodPartMappingError.errorCode === errorCodeAlternate) {
                modelRow.distGoodPartMappingStepError = err.split(': ').slice(1);
              } else if (mfgDistMappingError && mfgDistMappingError.errorCode === errorCodeAlternate) {
                modelRow.mfgDistMappingStepError = err.split(': ').slice(1);
              } else if (mfgPNInvalidError && mfgPNInvalidError.errorCode === errorCodeAlternate) {
                modelRow.mfgPNStepError = err.split(': ').slice(1);
              } else if (distPNInvalidError && distPNInvalidError.errorCode === errorCodeAlternate) {
                modelRow.distPNStepError = err.split(': ').slice(1);
              } else if (customerApprovalError && customerApprovalError.errorCode === errorCodeAlternate) {
                modelRow.customerApprovalStepError = err.split(': ').slice(1);
              } else if (rohsStatusError && rohsStatusError.errorCode === errorCodeAlternate) {
                modelRow.nonRohsStepError = err.split(': ').slice(1);
              } else if (invalidConnectorTypeError && invalidConnectorTypeError.errorCode === errorCodeAlternate) {
                modelRow.invalidConnectorTypeError = err.split(': ').slice(1);
              } else if (mismatchNumberOfRowsError && mismatchNumberOfRowsError.errorCode === errorCodeAlternate) {
                modelRow.mismatchNumberOfRowsError = err.split(': ').slice(1);
              } else if (epoxyError && epoxyError.errorCode === errorCodeAlternate) {
                modelRow.epoxyStepError = err.split(': ').slice(1);
              } else if (duplicateMPNInSameLineError && duplicateMPNInSameLineError.errorCode === errorCodeAlternate) {
                modelRow.duplicateMPNInSameLineError = err.split(': ').slice(1);
              } else if (matingPartRequiredError && matingPartRequiredError.errorCode === errorCodeAlternate) {
                modelRow.matingPartRequiredError = err.split(': ').slice(1);
              } else if (driverToolsRequiredError && driverToolsRequiredError.errorCode === errorCodeAlternate) {
                modelRow.driverToolsRequiredError = err.split(': ').slice(1);
              } else if (pickupPadRequiredError && pickupPadRequiredError.errorCode === errorCodeAlternate) {
                modelRow.pickupPadRequiredError = err.split(': ').slice(1);
              } else if (functionalTestingRequiredError && functionalTestingRequiredError.errorCode === errorCodeAlternate) {
                modelRow.functionalTestingRequiredError = err.split(': ').slice(1);
              } else if (restrictUseWithPermissionError && restrictUseWithPermissionError.errorCode === errorCodeAlternate && !modelRow.restrictUseWithPermissionStep) {
                modelRow.restrictUseWithPermissionError = err.split(': ').slice(1);
              } else if (restrictUsePermanentlyError && restrictUsePermanentlyError.errorCode === errorCodeAlternate && !modelRow.restrictUsePermanentlyStep) {
                modelRow.restrictUsePermanentlyError = err.split(': ').slice(1);
              } else if (mismatchMountingTypeError && mismatchMountingTypeError.errorCode === errorCodeAlternate && (!modelRow.mismatchMountingTypeStep || modelRow.approvedMountingType)) {
                modelRow.mismatchMountingTypeError = err.split(': ').slice(1);
              } else if (mismatchRequiredProgrammingError && mismatchRequiredProgrammingError.errorCode === errorCodeAlternate && !modelRow.mismatchRequiredProgrammingStep) {
                modelRow.mismatchRequiredProgrammingError = err.split(': ').slice(1);
              } else if (mappingPartProgramError && mappingPartProgramError.errorCode === errorCodeAlternate && !modelRow.mappingPartProgramStep) {
                modelRow.mappingPartProgramError = err.split(': ').slice(1);
              } else if (mismatchFunctionalCategoryError && mismatchFunctionalCategoryError.errorCode === errorCodeAlternate && !modelRow.mismatchFunctionalCategoryStep) {
                modelRow.mismatchFunctionalCategoryError = err.split(': ').slice(1);
              } else if (mismatchCustomPartError && mismatchCustomPartError.errorCode === errorCodeAlternate && !modelRow.mismatchCustomPartStep) {
                modelRow.mismatchCustomPartError = err.split(': ').slice(1);
              } else if (mismatchPitchError && mismatchPitchError.errorCode === errorCodeAlternate) {
                modelRow.mismatchPitchError = err.split(': ').slice(1);
              } else if (mismatchToleranceError && mismatchToleranceError.errorCode === errorCodeAlternate) {
                modelRow.mismatchToleranceError = err.split(': ').slice(1);
              } else if (mismatchVoltageError && mismatchVoltageError.errorCode === errorCodeAlternate) {
                modelRow.mismatchVoltageError = err.split(': ').slice(1);
              } else if (mismatchPackageError && mismatchPackageError.errorCode === errorCodeAlternate) {
                modelRow.mismatchPackageError = err.split(': ').slice(1);
              } else if (mismatchValueError && mismatchValueError.errorCode === errorCodeAlternate) {
                modelRow.mismatchValueError = err.split(': ').slice(1);
              } else if (duplicateCPNError && duplicateCPNError.errorCode === errorCodeAlternate) {
                modelRow.duplicateCPNError = err.split(': ').slice(1);
              } else if (requireMountingTypeError && requireMountingTypeError.errorCode === errorCodeAlternate) {
                modelRow.requireMountingTypeError = err.split(': ').slice(1);
              } else if (requireFunctionalTypeError && requireFunctionalTypeError.errorCode === errorCodeAlternate) {
                modelRow.requireFunctionalTypeError = err.split(': ').slice(1);
              } else if (uomMismatchedError && uomMismatchedError.errorCode === errorCodeAlternate) {
                modelRow.uomMismatchedError = err.split(': ').slice(1);
              } else if (programingRequiredError && programingRequiredError.errorCode === errorCodeAlternate) {
                modelRow.programingRequiredError = err.split(': ').slice(1);
              } else if (mismatchColorError && mismatchColorError.errorCode === errorCodeAlternate) {
                modelRow.mismatchColorError = err.split(': ').slice(1);
              } else if (restrictUseInBOMError && restrictUseInBOMError.errorCode === errorCodeAlternate) {
                modelRow.restrictUseInBOMError = err.split(': ').slice(1);
              } else if (partPinIsLessthenBOMPinError && partPinIsLessthenBOMPinError.errorCode === errorCodeAlternate) {
                modelRow.partPinIsLessthenBOMPinError = err.split(': ').slice(1);
              } else if (tbdPartError && tbdPartError.errorCode === errorCodeAlternate) {
                modelRow.tbdPartError = err.split(': ').slice(1);
              } else if (restrictCPNUseWithPermissionError && restrictCPNUseWithPermissionError.errorCode === errorCodeAlternate) {
                modelRow.restrictCPNUseWithPermissionError = err.split(': ').slice(1);
              } else if (restrictCPNUsePermanentlyError && restrictCPNUsePermanentlyError.errorCode === errorCodeAlternate) {
                modelRow.restrictCPNUsePermanentlyError = err.split(': ').slice(1);
              } else if (restrictCPNUseInBOMError && restrictCPNUseInBOMError.errorCode === errorCodeAlternate) {
                modelRow.restrictCPNUseInBOMError = err.split(': ').slice(1);
              } else if (exportControlledError && exportControlledError.errorCode === errorCodeAlternate) {
                modelRow.exportControlledError = err.split(': ').slice(1);
              } else if (restrictUseInBOMWithPermissionError && restrictUseInBOMWithPermissionError.errorCode === errorCodeAlternate) {
                modelRow.restrictUseInBOMWithPermissionError = err.split(': ').slice(1);
              } else if (unknownPartError && unknownPartError.errorCode === errorCodeAlternate) {
                modelRow.unknownPartError = err.split(': ').slice(1);
              } else if (defaultInvalidMFRError && defaultInvalidMFRError.errorCode === errorCodeAlternate) {
                modelRow.defaultInvalidMFRError = err.split(': ').slice(1);
              } else if (restrictUseInBOMExcludingAliasError && restrictUseInBOMExcludingAliasError.errorCode === errorCodeAlternate) {
                modelRow.restrictUseInBOMExcludingAliasError = err.split(': ').slice(1);
              } else if (restrictUseInBOMExcludingAliasWithPermissionError && restrictUseInBOMExcludingAliasWithPermissionError.errorCode === errorCodeAlternate) {
                modelRow.restrictUseInBOMExcludingAliasWithPermissionError = err.split(': ').slice(1);
              } else if (restrictUseExcludingAliasError && restrictUseExcludingAliasError.errorCode === errorCodeAlternate && !modelRow.restrictUseExcludingAliasStep) {
                modelRow.restrictUseExcludingAliasError = err.split(': ').slice(1);
              } else if (restrictUseExcludingAliasWithPermissionError && restrictUseExcludingAliasWithPermissionError.errorCode === errorCodeAlternate && !modelRow.restrictUseExcludingAliasWithPermissionStep) {
                modelRow.restrictUseExcludingAliasWithPermissionError = err.split(': ').slice(1);
              }
            }
          });

          modelRow.description = getDescriptionForLine(modelRow);

          setLineColorBaseOnError(modelRow);

          vm.refBomModel.push(modelRow);
        });
        vm.searchBOMModel = vm.refBomModel;
      };

      const mergeCommonCells = () => {
        const bomGroup = _.groupBy(vm.searchBOMModel, (data) => data._lineID && data.id);
        const mergeCells = [];
        let mergeColCount = 0;

        _.each(sourceHeaderVisible, (item) => {
          if (multiFields.indexOf(item.field) === -1) {
            mergeColCount++;
          }
        });

        _.map(bomGroup, (obj) => {
          if (obj.length > 1) {
            const index = vm.searchBOMModel.indexOf(obj[0]);
            obj[0].isMergedRow = true;

            _.each(obj, (item) => {
              bindCustomerApprovedComments(item);
            });

            for (let col = 0; col < mergeColCount; col++) {
              mergeCells.push({
                row: index, col: col, rowspan: obj.length, colspan: 1
              });
            }
          } else if (obj.length === 1) {
            bindCustomerApprovedComments(obj[0]);
          }
        });

        if (hotSearchMaterial) {
          hotSearchMaterial.updateSettings({
            mergeCells: mergeCells
          });
        }
        vm.settings.mergeCells = mergeCells;
        $timeout(() => {
          if (hotSearchMaterial) {
            hotSearchMaterial.render();
          }
        });
      };

      const bindCustomerApprovedComments = (bomObj) => {
        bomObj.customerApprovalComment = ((bomObj.qpaCustomerApprovalComment ? stringFormat(CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALDISPLAYFORMAT, bomObj.qpaCustomerApprovalComment, bomObj.isCustomerApprovedQPA ? CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVEDNAME : CORE.MESSAGE_CONSTANT.ENGINEERAPPROVEDNAME) + '\n' : '') +
          (bomObj.dnpqpaCustomerApprovalComment ? stringFormat(CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALDISPLAYFORMAT, bomObj.dnpqpaCustomerApprovalComment, bomObj.isCustomerApprovedDNPQPA ? CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVEDNAME : CORE.MESSAGE_CONSTANT.ENGINEERAPPROVEDNAME) + '\n' : '') +
          (bomObj.buyCustomerApprovalComment ? stringFormat(CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALDISPLAYFORMAT, bomObj.buyCustomerApprovalComment, bomObj.isCustomerApprovedBuy ? CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVEDNAME : CORE.MESSAGE_CONSTANT.ENGINEERAPPROVEDNAME) + '\n' : '') +
          (bomObj.buyDNPCustomerApprovalComment ? stringFormat(CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALDISPLAYFORMAT, bomObj.buyDNPCustomerApprovalComment, bomObj.isCustomerApprovedBuyDNP ? CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVEDNAME : CORE.MESSAGE_CONSTANT.ENGINEERAPPROVEDNAME) + '\n' : '') +
          (bomObj.populateCustomerApprovalComment ? stringFormat(CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALDISPLAYFORMAT, bomObj.populateCustomerApprovalComment, bomObj.isCustomerApprovedPopulate ? CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVEDNAME : CORE.MESSAGE_CONSTANT.ENGINEERAPPROVEDNAME) + '\n' : '') +
          (bomObj.cpnCustomerApprovalComment ? stringFormat(CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALDISPLAYFORMAT, bomObj.cpnCustomerApprovalComment, bomObj.isCustomerApprovedCPN ? CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVEDNAME : CORE.MESSAGE_CONSTANT.ENGINEERAPPROVEDNAME) + '\n' : '') +
          (bomObj.partCustomerApprovalComment ? stringFormat(CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALDISPLAYFORMAT, bomObj.partCustomerApprovalComment, bomObj.isCustomerApprovedPart ? CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVEDNAME : CORE.MESSAGE_CONSTANT.ENGINEERAPPROVEDNAME) + '\n' : '') +
          (bomObj.kitAllocationNotRequiredComment && bomObj.isNotRequiredKitAllocation ? stringFormat(CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVALDISPLAYFORMAT, bomObj.kitAllocationNotRequiredComment, bomObj.isNotRequiredKitAllocationApproved ? CORE.MESSAGE_CONSTANT.CUSTOMERAPPROVEDNAME : CORE.MESSAGE_CONSTANT.ENGINEERAPPROVEDNAME) : ''));
      };

      const getDescriptionForLine = (bomObj) => Array.from(
        new Set([
          bomObj.qpaDesignatorStepError,
          bomObj.lineMergeStepError,
          bomObj.customerApprovalForQPAREFDESError,
          bomObj.customerApprovalForBuyError,
          bomObj.customerApprovalForPopulateError,
          bomObj.dnpQPARefDesError,
          bomObj.dnpInvalidREFDESError,
          bomObj.customerApprovalForDNPQPAREFDESError,
          bomObj.customerApprovalForDNPBuyError,
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
          (bomObj.mfgPNID && (bomObj.restrictUsePermanentlyStep || bomObj.restrictUseExcludingAliasStep) && bomObj.isMFGGoodPart === partCorrectList.CorrectPart || bomObj.distMfgPNID && bomObj.isDistGoodPart === partCorrectList.CorrectPart) ? bomObj.customerApprovalStepError : null,
          bomObj.nonRohsStepError,
          bomObj.epoxyStepError,
          bomObj.mismatchNumberOfRowsError,
          bomObj.partPinIsLessthenBOMPinError,
          bomObj.tbdPartError,
          bomObj.invalidConnectorTypeError,
          bomObj.duplicateMPNInSameLineError,
          bomObj.mismatchMountingTypeError,
          bomObj.mismatchRequiredProgrammingError,
          bomObj.mappingPartProgramError,
          bomObj.mismatchFunctionalCategoryError,
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
          bomObj.mismatchCustomPartError
        ].filter((item) => item !== null && item !== '' && item !== undefined))
      ).join('\n');

      const setLineColorBaseOnError = (bomObj) => {
        let isInValid = false;
        if (bomObj) {
          isInValid = isBOMObjInValid(partInvalidMatchList, bomObj);
          if (bomObj && bomObj.mfgPNID !== CORE.TBDMFRPNID && bomObj.mfgPNID !== CORE.NOTAVAILABLEMFRPNID && !isInValid && !bomObj.isUnlockApprovedPart) {
            bomObj.mfgErrorColor = successColor;
            bomObj.mfgPNErrorColor = successColor;
            bomObj.mfgTooltip = null;
          }
        }
      };

      const getErrorCode = () => {
        _.each(logicCategoryDropdown, (item) => {
          const obj = _.find(errorCodeList, (obj) => obj.logicID === item.id);

          if (obj) {
            switch (item.value) {
              case logicCategoryDropdownDet[1]: {
                qpaDesignatorError = obj;
                break;
              }
              case logicCategoryDropdownDet[2]: {
                mfgInvalidError = obj;
                break;
              }
              case logicCategoryDropdownDet[3]: {
                mfgVerificationError = obj;
                break;
              }
              case logicCategoryDropdownDet[4]: {
                distVerificationError = obj;
                break;
              }
              case logicCategoryDropdownDet[5]: {
                mfgDistMappingError = obj;
                break;
              }
              case logicCategoryDropdownDet[6]: {
                getMFGPNError = obj;
                break;
              }
              case logicCategoryDropdownDet[7]: {
                mfgGoodPartMappingError = obj;
                break;
              }
              case logicCategoryDropdownDet[8]: {
                obsoletePartError = obj;
                break;
              }
              case logicCategoryDropdownDet[9]: {
                mfgPNInvalidError = obj;
                break;
              }
              case logicCategoryDropdownDet[10]: {
                distInvalidError = obj;
                break;
              }
              case logicCategoryDropdownDet[11]: {
                distPNInvalidError = obj;
                break;
              }
              case logicCategoryDropdownDet[12]: {
                customerApprovalError = obj;
                break;
              }
              case logicCategoryDropdownDet[13]: {
                distGoodPartMappingError = obj;
                break;
              }
              case logicCategoryDropdownDet[14]: {
                lineMergeError = obj;
                break;
              }
              case logicCategoryDropdownDet[15]: {
                rohsStatusError = obj;
                break;
              }
              case logicCategoryDropdownDet[16]: {
                epoxyError = obj;
                break;
              }
              case logicCategoryDropdownDet[17]: {
                duplicateRefDesError = obj;
                break;
              }
              case logicCategoryDropdownDet[18]: {
                invalidRefDesError = obj;
                break;
              }
              case logicCategoryDropdownDet[20]: {
                invalidConnectorTypeError = obj;
                break;
              }
              case logicCategoryDropdownDet[21]: {
                duplicateMPNInSameLineError = obj;
                break;
              }
              case logicCategoryDropdownDet[22]: {
                matingPartRequiredError = obj;
                break;
              }
              case logicCategoryDropdownDet[23]: {
                driverToolsRequiredError = obj;
                break;
              }
              case logicCategoryDropdownDet[24]: {
                pickupPadRequiredError = obj;
                break;
              }
              case logicCategoryDropdownDet[25]: {
                restrictUseWithPermissionError = obj;
                break;
              }
              case logicCategoryDropdownDet[26]: {
                restrictUsePermanentlyError = obj;
                break;
              }
              case logicCategoryDropdownDet[27]: {
                mismatchMountingTypeError = obj;
                break;
              }
              case logicCategoryDropdownDet[28]: {
                mismatchFunctionalCategoryError = obj;
                break;
              }
              case logicCategoryDropdownDet[29]: {
                mismatchPitchError = obj;
                break;
              }
              case logicCategoryDropdownDet[30]: {
                mismatchToleranceError = obj;
                break;
              }
              case logicCategoryDropdownDet[31]: {
                mismatchVoltageError = obj;
                break;
              }
              case logicCategoryDropdownDet[32]: {
                mismatchPackageError = obj;
                break;
              }
              case logicCategoryDropdownDet[33]: {
                mismatchValueError = obj;
                break;
              }
              case logicCategoryDropdownDet[34]: {
                duplicateCPNError = obj;
                break;
              }
              case logicCategoryDropdownDet[35]: {
                functionalTestingRequiredError = obj;
                break;
              }
              case logicCategoryDropdownDet[36]: {
                requireMountingTypeError = obj;
                break;
              }
              case logicCategoryDropdownDet[37]: {
                requireFunctionalTypeError = obj;
                break;
              }
              case logicCategoryDropdownDet[39]: {
                uomMismatchedError = obj;
                break;
              }
              case logicCategoryDropdownDet[40]: {
                programingRequiredError = obj;
                break;
              }
              case logicCategoryDropdownDet[41]: {
                mismatchColorError = obj;
                break;
              }
              case logicCategoryDropdownDet[50]: {
                restrictUseInBOMError = obj;
                break;
              }
              case logicCategoryDropdownDet[51]: {
                customerApprovalForQPAREFDESError = obj;
                break;
              }
              case logicCategoryDropdownDet[52]: {
                customerApprovalForBuyError = obj;
                break;
              }
              case logicCategoryDropdownDet[53]: {
                customerApprovalForPopulateError = obj;
                break;
              }
              case logicCategoryDropdownDet[54]: {
                mismatchNumberOfRowsError = obj;
                break;
              }
              case logicCategoryDropdownDet[55]: {
                partPinIsLessthenBOMPinError = obj;
                break;
              }
              case logicCategoryDropdownDet[56]: {
                tbdPartError = obj;
                break;
              }
              case logicCategoryDropdownDet[57]: {
                restrictCPNUseWithPermissionError = obj;
                break;
              }
              case logicCategoryDropdownDet[58]: {
                restrictCPNUsePermanentlyError = obj;
                break;
              }
              case logicCategoryDropdownDet[59]: {
                restrictCPNUseInBOMError = obj;
                break;
              }
              case logicCategoryDropdownDet[60]: {
                exportControlledError = obj;
                break;
              }
              case logicCategoryDropdownDet[61]: {
                restrictUseInBOMWithPermissionError = obj;
                break;
              }
              case logicCategoryDropdownDet[62]: {
                unknownPartError = obj;
                break;
              }
              case logicCategoryDropdownDet[63]: {
                defaultInvalidMFRError = obj;
                break;
              }
              case logicCategoryDropdownDet[64]: {
                restrictUseInBOMExcludingAliasWithPermissionError = obj;
                break;
              }
              case logicCategoryDropdownDet[65]: {
                restrictUseInBOMExcludingAliasError = obj;
                break;
              }
              case logicCategoryDropdownDet[66]: {
                restrictUseExcludingAliasError = obj;
                break;
              }
              case logicCategoryDropdownDet[67]: {
                restrictUseExcludingAliasWithPermissionError = obj;
                break;
              }
              case logicCategoryDropdownDet[68]: {
                dnpQPARefDesError = obj;
                break;
              }
              case logicCategoryDropdownDet[69]: {
                customerApprovalForDNPQPAREFDESError = obj;
                break;
              }
              case logicCategoryDropdownDet[70]: {
                customerApprovalForDNPBuyError = obj;
                break;
              }
              case logicCategoryDropdownDet[71]: {
                dnpInvalidREFDESError = obj;
                break;
              }
              case logicCategoryDropdownDet[72]: {
                suggestedGoodPartError = obj;
                break;
              }
              case logicCategoryDropdownDet[73]: {
                suggestedGoodDistPartError = obj;
                break;
              }
              case logicCategoryDropdownDet[74]: {
                mismatchRequiredProgrammingError = obj;
                break;
              }
              case logicCategoryDropdownDet[75]: {
                mismatchCustomPartError = obj;
                break;
              }
              case logicCategoryDropdownDet[76]: {
                mappingPartProgramError = obj;
                break;
              }
            }
          }
        });
      };

      const isBOMObjInValid = (validationArr, bomObj) => {
        if (bomObj) {
          return validationArr.indexOf(bomObj.mfgVerificationStep) !== -1 && mfgVerificationError.isAllowToEngrApproved === 0 ||
            validationArr.indexOf(bomObj.mfgDistMappingStep) !== -1 && mfgDistMappingError.isAllowToEngrApproved === 0 ||
            validationArr.indexOf(bomObj.obsoletePartStep) !== -1 && bomObj.isObsoleteLine && !obsoletePartError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.mfgGoodPartMappingStep) !== -1 && !mfgGoodPartMappingError.isAllowToEngrApproved ||
            bomObj.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING ||
            validationArr.indexOf(bomObj.lineMergeStep) !== -1 && !lineMergeError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.nonRohsStep) !== -1 && !rohsStatusError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.epoxyStep) !== -1 && !epoxyError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.mfgCodeStep) !== -1 && !mfgInvalidError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.mfgPNStep) !== -1 && !mfgPNInvalidError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.distVerificationStep) !== -1 && !distVerificationError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.getMFGPNStep) !== -1 && !getMFGPNError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.distGoodPartMappingStep) !== -1 && !distGoodPartMappingError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.distCodeStep) !== -1 && !distInvalidError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.distPNStep) !== -1 && !distPNInvalidError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.duplicateMPNInSameLineStep) !== -1 && !duplicateMPNInSameLineError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.mismatchMountingTypeStep) !== -1 && !mismatchMountingTypeError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.invalidConnectorTypeStep) !== -1 && !invalidConnectorTypeError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.mismatchFunctionalCategoryStep) !== -1 && !mismatchFunctionalCategoryError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.mismatchCustomPartStep) !== -1 && !mismatchCustomPartError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.restrictUseWithPermissionStep) !== -1 && !restrictUseWithPermissionError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.restrictUseExcludingAliasStep) !== -1 && !restrictUseExcludingAliasError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.restrictUseExcludingAliasWithPermissionStep) !== -1 && !restrictUseExcludingAliasWithPermissionError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.restrictUsePermanentlyStep) !== -1 && !restrictUsePermanentlyError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.pickupPadRequiredStep) !== -1 && !pickupPadRequiredError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.matingPartRquiredStep) !== -1 && !matingPartRequiredError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.suggestedGoodPartStep) !== -1 && !suggestedGoodPartError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.suggestedGoodDistPartStep) !== -1 && !suggestedGoodDistPartError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.driverToolsRequiredStep) !== -1 && !driverToolsRequiredError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.functionalTestingRequiredStep) !== -1 && !functionalTestingRequiredError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.exportControlledStep) !== -1 && !exportControlledError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.uomMismatchedStep) !== -1 && !uomMismatchedError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.programingRequiredStep) !== -1 && !programingRequiredError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.mismatchColorStep) !== -1 ||
            validationArr.indexOf(!bomObj.restrictUseInBOMStep) !== -1 && !restrictUseInBOMError.isAllowToEngrApproved ||
            validationArr.indexOf(!bomObj.restrictUseInBOMWithPermissionStep) !== -1 && !restrictUseInBOMWithPermissionError.isAllowToEngrApproved ||
            validationArr.indexOf(!bomObj.restrictUseInBOMExcludingAliasStep) !== -1 && !restrictUseInBOMExcludingAliasError.isAllowToEngrApproved ||
            validationArr.indexOf(!bomObj.restrictUseInBOMExcludingAliasWithPermissionStep) !== -1 && !restrictUseInBOMExcludingAliasWithPermissionError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.unknownPartStep) !== -1 && !unknownPartError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.defaultInvalidMFRStep) !== -1 && !defaultInvalidMFRError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.partPinIsLessthenBOMPinStep) !== -1 && !partPinIsLessthenBOMPinError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.tbdPartStep) !== -1 && !tbdPartError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.mismatchNumberOfRowsStep) !== -1 && !mismatchNumberOfRowsError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.mismatchRequiredProgrammingStep) !== -1 && !mismatchRequiredProgrammingError.isAllowToEngrApproved ||
            validationArr.indexOf(bomObj.mappingPartProgramStep) !== -1 && !mappingPartProgramError.isAllowToEngrApproved;
        }
        else {
          return true;
        }
      };

      $scope.$on('searchMaterialVisibilityColumn', () => {
        //vm.bomSourceHeader = data;
        //callAfterGetSourceHeader();
        //if (vm.searchBOMList && vm.searchBOMList.length > 0) {
        //  vm.isLoadSourceHeader = true;
        //  displayBOMDetail(vm.searchBOMList);
        //}
        vm.isLoadSourceHeader = false;
        $q.all([initBomSourceHeader()]).then(() => {
          if (vm.searchBOMList && vm.searchBOMList.length > 0) {
            vm.isLoadSourceHeader = true;
            displayBOMDetail(vm.searchBOMList);
            $timeout(() => {
              if (hotSearchMaterial) {
                hotSearchMaterial.render();
              }
            }, true);
          }
        });
      });

      $(window).resize(() => {
        handsontableresize();
      });
    }
  }
})();
