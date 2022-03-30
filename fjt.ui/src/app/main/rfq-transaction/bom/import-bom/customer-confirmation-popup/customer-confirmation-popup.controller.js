(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('CustomerConfirmationPopupController', CustomerConfirmationPopupController);

  /** @ngInject */
  function CustomerConfirmationPopupController($mdDialog, $scope, $timeout, CORE, USER, data, BaseService, CustomerConfirmationPopupFactory, DialogFactory, RFQTRANSACTION) {
    const vm = this;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.CUSTOMER_CONFIRMATION;

    vm.customerConfirmationModel = {};
    const rfqAssyID = data.rfqAssyID;
    const partID = data.partID;
    vm.isBOMReadOnly = data.isBOMReadOnly || false;
    $scope.supported = false;
    vm.isCopyData = false;
    vm.isExternalIssue = false;
    vm.isHideNote = data.isHideNote;
    vm.LabelConstant = CORE.LabelConstant;

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    init();

    function init() {
      vm.cgBusyLoading = CustomerConfirmationPopupFactory.getRFQLineItemsDescription().query({ id: data.partID }).$promise.then((res) => {
        if (res && res.data) {
          vm.lineitemsDescriptionList = _.sortBy(res.data.response, (x) => parseInt(x.lineID));
          const assemblyLevelError = [];
          _.each(vm.lineitemsDescriptionList, (item) => {
            var level = _.maxBy(_.filter(res.data.asseblyList, { prPerPartID: item.partID }), 'level').level;
            item.assyLevel = level;
            item.assyID = item.component ? item.component.mfgPN : '';
            item.displayDescription = [];
            // This is for assembly level error show but not able to add comment in this case This is added in case of multiple assembly we have to take of all assembly and show this all error assembly wise
            if (item.requireMountingTypeStep === false || item.requireFunctionalTypeStep === false || item.requireMountingTypeStep === 0 || item.requireFunctionalTypeStep === 0) {
              const displayDescription = (item.requireMountingTypeError ? '' : item.requireMountingTypeError.replace(/^.+:/, '')) + (item.requireFunctionalTypeError ? '' : item.requireFunctionalTypeError.replace(/^.+:/, ''));
              const details = { id: 0, assyLevel: item.assyLevel, assyID: item.assyID, partID: item.partID, displayDescription: [] };
              details.displayDescription.push(displayDescription);
              assemblyLevelError.push(details);
            }
            const err = item.description ? item.description.split('\n') : [];
            _.each(err, (error) => {
              if (item.qpaDesignatorStep === false || item.lineMergeStep === false || item.duplicateCPNStep === false || item.customerApprovalForQPAREFDESStep === false || item.customerApprovalForBuyStep === false || item.customerApprovalForPopulateStep === false || item.dnpQPARefDesStep === false || item.customerApprovalForDNPQPAREFDESStep === false || item.customerApprovalForDNPBuyStep === false || item.dnpInvalidREFDESStep === false ||
                item.qpaDesignatorStep === 0 || item.lineMergeStep === 0 || item.duplicateCPNStep === 0 || item.customerApprovalForQPAREFDESStep === 0 || item.customerApprovalForBuyStep === 0 || item.customerApprovalForPopulateStep === 0 || item.dnpQPARefDesStep === 0 || item.customerApprovalForDNPQPAREFDESStep === 0 || item.customerApprovalForDNPBuyStep === 0 || item.dnpInvalidREFDESStep === 0) {
                item.displayDescription.push((item.qpa ? '' : (item.qpa + ':')) + (item.refDesig ? '' : (item.refDesig + ':')) + (error ? '' : error.replace(/^.+:/, '')));
              }
            });
            _.each(item.rfqLineitemsAlternetpart, (data) => {
              var errorArr = data.description ? data.description.split('\n') : [];

              _.each(errorArr, (error) => {
                if (error && (data.mfgVerificationStep === false || data.mfgVerificationStep === 0
                  || data.mfgDistMappingStep === false || data.mfgDistMappingStep === 0
                  || data.mfgCodeStep === false || data.mfgCodeStep === 0
                  || data.obsoletePartStep === false || data.obsoletePartStep === 0
                  || data.mfgGoodPartMappingStep === false || data.mfgGoodPartMappingStep === 0
                  || data.mfgPNStep === false || data.mfgPNStep === 0
                  || data.nonRohsStep === false || data.nonRohsStep === 0
                  || data.epoxyStep === false || data.epoxyStep === 0
                  || data.invalidConnectorTypeStep === false || data.invalidConnectorTypeStep === 0
                  || data.duplicateMPNInSameLineStep === false || data.duplicateMPNInSameLineStep === 0
                  || data.mismatchFunctionalCategoryStep === false || data.mismatchFunctionalCategoryStep === 0
                  || data.mismatchMountingTypeStep === false || data.mismatchMountingTypeStep === 0
                  || data.pickupPadRequiredStep === false || data.pickupPadRequiredStep === 0
                  || data.mismatchCustomPartStep === false || data.mismatchCustomPartStep === 0
                  || data.restrictUseWithPermissionStep === false || data.restrictUseWithPermissionStep === 0
                  || data.restrictUsePermanentlyStep === false || data.restrictUsePermanentlyStep === 0
                  || data.matingPartRquiredStep === false || data.matingPartRquiredStep === 0
                  || data.suggestedGoodPartStep === false || data.suggestedGoodPartStep === 0
                  || data.restrictUseExcludingAliasWithPermissionStep === false || data.restrictUseExcludingAliasWithPermissionStep === 0
                  || data.restrictUseExcludingAliasStep === false || data.restrictUseExcludingAliasStep === 0
                  || data.functionalTestingRequiredStep === false || data.functionalTestingRequiredStep === 0
                  || data.uomMismatchedStep === false || data.uomMismatchedStep === 0
                  || data.programingRequiredStep === false || data.programingRequiredStep === 0
                  || data.mismatchColorStep === false || data.mismatchColorStep === 0
                  || data.restrictUseInBOMStep === true || data.restrictUseInBOMStep === 1
                  || data.restrictUseInBOMWithPermissionStep === true || data.restrictUseInBOMWithPermissionStep === 1
                  || data.restrictUseInBOMExcludingAliasStep === true || data.restrictUseInBOMExcludingAliasStep === 1
                  || data.restrictUseInBOMExcludingAliasWithPermissionStep === true || data.restrictUseInBOMExcludingAliasWithPermissionStep === 1
                  || data.mismatchNumberOfRowsStep === false || data.mismatchNumberOfRowsStep === 0
                  || data.partPinIsLessthenBOMPinStep === false || data.partPinIsLessthenBOMPinStep === 0
                  || data.exportControlledStep === false || data.exportControlledStep === 0
                  || data.unknownPartStep === false || data.unknownPartStep === 0
                  || data.tbdPartStep === false || data.tbdPartStep === 0
                  || data.defaultInvalidMFRStep === false || data.defaultInvalidMFRStep === 0
                  || data.customerApproval === RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING)) {
                  item.displayDescription.push((!data.mfgCode ? '' : (data.mfgCode + ': ')) + (!data.mfgPN ? '' : (data.mfgPN + ': ')) + (!error ? '' : error.replace(/^.+:/, '')));
                }
                if (error && (data.distVerificationStep === false || data.distVerificationStep === 0
                  || data.distCodeStep === false || data.distCodeStep === 0
                  || data.getMFGPNStep === false || data.getMFGPNStep === 0
                  || data.distPNStep === false || data.distPNStep === 0
                  || data.distGoodPartMappingStep === false || data.distGoodPartMappingStep === 0)) {
                  item.displayDescription.push((!data.distributor ? '' : (data.distributor + ': ')) + (!data.distPN ? '' : (data.distPN + ': ')) + (!error ? '' : error.replace(/^.+:/, '')));
                }
              });
            });
          });
          // This is for assembly level error show but not able to add comment in this case
          _.each(assemblyLevelError, (item) => {
            vm.lineitemsDescriptionList.unshift(item);
          });
          vm.lineitemsDescriptionList = _.sortBy(vm.lineitemsDescriptionList, 'assyLevel');
          vm.isNoDataFound = vm.lineitemsDescriptionList.length === 0;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.copyDescription = (isExternalIssue) => {
      vm.isExternalIssue = isExternalIssue;
      const isdirty = vm.checkFormDirty(vm.CustomerConfirmationForm);
      if (isdirty) {
        const obj = {
          title: CORE.MESSAGE_CONSTANT.COMMON_CONFIRMATION,
          textContent: CORE.MESSAGE_CONSTANT.COPY_CHANGE_MSG_CONFIRMATION_MESSAGE,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.confirmDiolog(obj).then((data) => {
          if (data && !vm.CustomerConfirmationForm.$invalid) {
            vm.isCopyData = true;
            vm.save();
          }
        }, () => {
          vm.copyDescriptionDetails(isExternalIssue);
        }).catch((error) => this.getErrorLog(error));
      } else {
        vm.copyDescriptionDetails(isExternalIssue);
      }
    };

    vm.copyDescriptionDetails = (isExternalIssue) => {
      const model = {
        partID: partID,
        externalIssue: isExternalIssue
      };
      vm.formattedStringResultArr = '';
      vm.cgBusyLoading = CustomerConfirmationPopupFactory.getRfqLineItemsCopyDescription().save(model).$promise.then((response) => {
        if (response && response.data) {
          if (response.data && response.data.length > 0) {
            const assemblyCount = _.uniq(_.map(response.data, 'partID')).length;
            if (assemblyCount > 1) {
              _.each(response.data, (copyData) => {
                vm.formattedStringResultArr += stringFormat('{0} : {1}\n', copyData.assyPN, copyData.description);
              });
            }
            else {
              _.each(response.data, (copyData) => {
                vm.formattedStringResultArr += stringFormat('{0}\n', copyData.description);
              });
            }
            // console.log(vm.formattedStringResultArr);
            $timeout(() => {
              copyTextForWindow(vm.formattedStringResultArr);
              const model = {
                title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                textContent: CORE.MESSAGE_CONSTANT.COPY_TO_CLIPBOARD,
                multiple: true
              };
              DialogFactory.alertDialog(model);
            });
          }
          else {
            const model = {
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: CORE.MESSAGE_CONSTANT.Error_NOT_FOUND,
              multiple: true
            };
            DialogFactory.alertDialog(model);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.save = () => {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.CustomerConfirmationForm)) {
        vm.saveDisable = false;
        return;
      } else {
        const lineitemsDescription = [];
        _.each(vm.lineitemsDescriptionList, (lineItem) => {
          if (lineItem.id > 0) {
            const additionalComment = lineItem.rfqLineitemsAddtionalComment[0];
            const model = {
              rfqLineItemID: lineItem.id,
              description: additionalComment ? additionalComment.description || null : null,
              id: additionalComment ? additionalComment.id || null : null,
              lineID: lineItem.lineID,
              rfqAssyID: lineItem.rfqAssyID,
              partID: lineItem.partID
            };
            lineitemsDescription.push(model);
          }
        });

        const model = {
          rfqAssyID: rfqAssyID,
          lineitemsDescription: lineitemsDescription,
          partID: partID,
          fromBOM: false
        };

        vm.cgBusyLoading = CustomerConfirmationPopupFactory.createRFQLineItemsDescription().save(model).$promise.then((response) => {
          if (response && response.data) {
            if (vm.isCopyData) {
              vm.CustomerConfirmationForm.$dirty = false;
              vm.copyDescriptionDetails(vm.isExternalIssue);
            }
            else {
              _.each(response.data, (objRes) => {
                const modelObj = _.find(model.lineitemsDescription, (objModel) => objModel.lineID === objRes.lineID && objModel.rfqLineItemID === objRes.rfqLineItemID);
                if (modelObj) {
                  modelObj.id = objRes.id;
                }
              });
              _.each(model.lineitemsDescription, (objModel) => {
                if (!objModel.description) {
                  objModel.id = null;
                }
              });

              $mdDialog.hide(model);
            }
          }
          vm.saveDisable = false;
        }).catch((error) => {
          vm.saveDisable = false;
          BaseService.getErrorLog(error);
        });
      }
    };
    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.CustomerConfirmationForm);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.isCopyDisabled = () => !_.some(vm.lineitemsDescriptionList, (item) => item.displayDescription.length || (item.rfqLineitemsAddtionalComment[0]) && (item.rfqLineitemsAddtionalComment[0].description));
  }
})();
