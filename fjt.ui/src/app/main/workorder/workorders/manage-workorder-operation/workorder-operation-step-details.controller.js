(function () {
  'use strict';
  angular
    .module('app.workorder.workorders')
    .controller('WorkorderOperationDetailsController', WorkorderOperationDetailsController);

  /** @ngInject */
  function WorkorderOperationDetailsController($scope, $timeout, $q, $mdColorPicker,
    CORE, USER, BaseService, GenericCategoryConstant, DialogFactory,
    GenericCategoryFactory, OperationFactory, WorkorderOperationFactory, ComponentFactory, RFQTRANSACTION, OPERATION) {
    // Don't Remove this code
    // Don't add any code before this
    $scope.vm = $scope.$parent.$parent.vm;
    //Add form name for check form dirty
    $scope.vm.CurrentForm = 'frmOperationDetails';
    const vm = $scope.vm;
    vm.OperationType = CORE.CategoryType.OperationType;
    // add code after this only
    // Check vm.isChange flag for color picker dirty object
    vm.isChange = false;
    vm.IsInspectionProcess = false;
    vm.IsFirstOperation = false;
    let GenericCategoryAllData = [];
    let OperationAllData = [];
    vm.minLengthMessage = CORE.MESSAGE_CONSTANT.MIN_LENGTH_MESSAGE;
    vm.OperationRadioGroup = CORE.OperationRadioGroup;
    vm.opAllLabelConstant = CORE.LabelConstant.Operation;
    vm.SERIAL_MAPPING_ALLOW_AT_TRAVELER = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SERIAL_MAPPING_ALLOW_AT_TRAVELER;
    vm.LOOP_OPERATION_ALLOW_AT_TRAVELER = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.LOOP_OPERATION_INFO;
    const WoStatusConst = angular.copy(CORE.WoStatus);
    const woStatusPublishedDet = _.find(WoStatusConst, (item) => {
      return item.ID == CORE.WOSTATUS.PUBLISHED;
    });
    vm.loopToOperationList = [];
    vm.autoCompleteLoopToOp = null;
    vm.LabelConstant = CORE.LabelConstant;
    vm.maxLengthForDescription = _maxLengthForDescription;
    vm.isMoveToStockChanged = vm.isTrackBySerialNoChanged = vm.isAllowFinalSerialMappingChanged = vm.isLoopOperationChanged = vm.isQtyControlChanged = vm.isReworkChanged = vm.isIssueQtyChanged = vm.isPreProgrammingComponentChanged = vm.isAllowMissingPartQtyChanged = vm.isAllowBypassQtyChanged = vm.isEnablePreProgrammingPartChanged = vm.isPlacementTrackingChanged = false;

    // add validation not allow to set true for operation
    const resetLoopOperation = () => {
      vm.operation.LoopOperationError = '';
      vm.operation.isLoopOperation = false;
      vm.operation.refLoopWOOPID = null;
      if (vm.autoCompleteLoopToOp) {
        vm.autoCompleteLoopToOp.keyColumnId = null;
      }
    };

    // get previous operation details
    const getPreviousWorkOrderOperationDetails = () => {
      return WorkorderOperationFactory.getPreviousWorkOrderOperationDetails().save({
        woID: vm.operation.woID,
        woOPID: vm.operation.woOPID
      }).$promise.then((response) => {
        vm.loopToOperationList = [];
        if (response && response.status == CORE.ApiResponseTypeStatus.FAILED) {
          vm.operation.isLoopOperation = false;
          vm.IsFirstOperation = true;
          vm.operation.LoopOperationError = (response.data && response.data.messageContent) ? response.data.messageContent : '';
        }
        if (response && response.data && response.data.previousOperationDetList && response.data.previousOperationDetList.length > 0) {
          const previousOperationDet = _.first(response.data.previousOperationDetList);
          if (previousOperationDet) {
            vm.operation.LoopOperationError = previousOperationDet.isError ? previousOperationDet.errorText : '';

            vm.loopToOperationList.push(previousOperationDet);
            vm.loopToOperationList[0].opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, previousOperationDet.opName, previousOperationDet.opNumber);
          }
        }
        else {
          //resetLoopOperation();
          vm.resetPreviousWorkOrderOperationDetails();
        }
        return response;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };
    // Restrict changes into all fields if work order status is 'under termination'
    // vm.isWOUnderTermination = (vm.operation.workorder.woStatus == CORE.WOSTATUS.UNDER_TERMINATION || vm.operation.workorder.woStatus == CORE.WOSTATUS.TERMINATED);

    const getParentOperationList = () => {
      const filter = {};
      if (vm.operation.opID) {
        filter.excludeOpID = vm.operation.opID;
      }
      return OperationFactory.getOperationList().query(filter).$promise.then((operation) => {
        OperationAllData = operation.data;
        _.each(vm.ParentOperationList, (item) => {
          item.opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, item.opName, item.opNumber);
        });
        vm.ParentOperationList = _.filter(OperationAllData, (item) => {
          return item.parentOPID == null;
        });
        return $q.resolve(vm.ParentOperationList);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };
    // get selected operation type object on select of autocomplete icon
    const getSelectedOperationType = (obj) => {
      if (obj && obj.gencCategoryName == GenericCategoryConstant.OPERATION_TYPE.INSPECTION_PROCESS.gencCategoryName) {
        vm.operation.isRework = false;
        resetLoopOperation();
        vm.operation.qtyControl = true;
        if (vm.trackBySerialFromWOOPNumber
          && (vm.operation.opNumber > vm.trackBySerialFromWOOPNumber)) {
          vm.operation.isTrackBySerialNo = true;
        }
        vm.IsInspectionProcess = true;
        vm.operation.isMoveToStock = false;
        vm.operation.isPlacementTracking = false;
        vm.operation.isAllowMissingPartQty = false;
      }
      else {
        vm.IsInspectionProcess = false;
      }
      checkAndSetChangeFlag();
    };

    const getOperationTypeList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(vm.OperationType.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: vm.operation.opID ? true : false
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((genericCategories) => {
        GenericCategoryAllData = genericCategories.data;
        vm.OperationTypeList = _.filter(GenericCategoryAllData, (item) => {
          return item.parentGencCategoryID == null && item.categoryType == vm.OperationType.Name;
        });
        return $q.resolve(vm.OperationTypeList);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    // get mounting type list
    const getMountingTypeList = () => {
      return ComponentFactory.getMountingTypeList().query().$promise.then((res) => {
        vm.mountingTypeList = res.data;
        return res.data;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    const autocompletePromise = [getOperationTypeList(), getParentOperationList(), getMountingTypeList()];
    if (vm.operation) { // && vm.operation.isLoopOperation) {
      const requiredDet = {
        isLoopToOpSelectAction: false
      };
      autocompletePromise.push(getPreviousWorkOrderOperationDetails(requiredDet));
    }
    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
      $timeout(() => {
        initAutoComplete();
      }, _configSelectListTimeout);
    }).catch((error) => {
      return BaseService.getErrorLog(error);
    });

    const initAutoComplete = () => {
      vm.autoCompleteOperationType = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.operation ? (vm.operation.operationTypeID ? vm.operation.operationTypeID : null) : null,
        inputName: vm.OperationType.Name,
        placeholderName: vm.OperationType.Title,
        addData: { headerTitle: vm.OperationType.Title },
        isRequired: true,
        isAddnew: true,
        callbackFn: getOperationTypeList,
        onSelectCallbackFn: getSelectedOperationType
      };
      vm.autoCompleteParentOperation = {
        columnName: 'opName',
        keyColumnName: 'opID',
        keyColumnId: vm.operation ? (vm.operation.parentOPID ? vm.operation.parentOPID : null) : null,
        inputName: 'ParentOperation',
        placeholderName: 'Parent Operation',
        isRequired: false,
        isAddnew: false,
        callbackFn: getParentOperationList
      };
      vm.autoCompleteMountingType = {
        columnName: 'name',
        keyColumnName: 'id',
        controllerName: USER.ADMIN_MOUNTING_TYPE_ADD_UPDATE_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_MOUNTING_TYPE_ADD_UPDATE_MODAL_VIEW,
        keyColumnId: vm.operation.mountingTypeID ? vm.operation.mountingTypeID : null,
        inputName: 'Mounting Type',
        placeholderName: 'Mounting Type',
        isRequired: true,
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_MOUNTING_TYPE_STATE],
          pageNameAccessLabel: CORE.PageName.mounting_type
        },
        callbackFn: getMountingTypeList
      };
      vm.autoCompleteLoopToOp = {
        columnName: 'opFullName',
        keyColumnName: 'woopid',
        keyColumnId: vm.operation ? (vm.operation.refLoopWOOPID ? vm.operation.refLoopWOOPID : null) : null,
        inputName: 'LoopToOperation',
        placeholderName: 'Loop to Operation',
        isRequired: false,
        isAddnew: false,
        callbackFn: getPreviousWorkOrderOperationDetails,
        onSelectCallbackFn: onSelectLoopToOperation
      };
    };

    /**
    * Step 1 General Details
    *
    * @param
    */

    vm.SaveWorkorderOperation = (event, requiredData) => {
      setFluxTypeValidity();
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.frmOperationDetails, false)) {
        vm.saveDisable = false;
        return;
      }

      if (vm.isWorkorderOperationPublished && (!requiredData || !requiredData.isWOOPStatusChangeAction)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.NOT_ALLOWED_FOR_WO_OP_STATUS);
        messageContent.message = stringFormat(messageContent.message, woStatusPublishedDet.Name);
        const obj = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(obj);
        vm.saveDisable = false;
        return;
      }
      // Validate RefDes List entered or not
      if (_.filter(vm.operation.refDesigList, (det) => det.isDeleted === 0 || (!det.isDeleted)).length === 0) {
        if (vm.operation.addRefDesig && (!vm.operation.isStrictlyLimitRefDes)) {
          vm.operation.addRefDesig = false;
          vm.operation.isRequireRefDesWithUMID = false;
        } else if (vm.operation.isStrictlyLimitRefDes) {
          vm.saveDisable = false;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.REF_DES_LIST_REQUIRED);
          const obj = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(obj).then(() => {
            vm.operation.opStatus = requiredData ? requiredData.oldStatusID : vm.operation.opStatus;
            setFocusByName('refDesigValue');
          }).catch((error) => {
            vm.saveDisable = false;
            return BaseService.getErrorLog(error);
          });
          return;
        }
      }
      if (vm.operation.isLoopOperation && vm.operation.opStatus == vm.DisplayStatus.Published.ID) {
        if (!vm.autoCompleteLoopToOp.keyColumnId) {
          vm.saveDisable = false;
          const messageContent = Object.assign({}, CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.LOOP_TO_OP_REQUIRED_FOR_WOOP_PUBLISH);
          const obj = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(obj).then(() => {
            setFocusByName(vm.autoCompleteLoopToOp.inputName);
          }).catch((error) => {
            vm.saveDisable = false;
            return BaseService.getErrorLog(error);
          });
          return;
        }
        else if (vm.operation.LoopOperationError) {
          const model = {
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: vm.operation.LoopOperationError,
            multiple: true
          };
          vm.saveDisable = false;
          DialogFactory.alertDialog(model).then(() => {
            setFocusByName(vm.autoCompleteLoopToOp.inputName);
          }).catch((error) => {
            vm.saveDisable = false;
            return BaseService.getErrorLog(error);
          });
          return;
        }
      }
      if (vm.operation.workorder.woStatus == CORE.WOSTATUS.PUBLISHED || vm.operation.workorder.woStatus == CORE.WOSTATUS.COMPLETED_WITH_MISSING_PARTS) {
        //if (vm.operation.workorder.woStatus == CORE.WOSTATUS.PUBLISHED) {
        let isOperationDetailsChanged = false;
        if (vm.frmOperationDetails.$dirty) {
          vm.frmOperationDetails.$$controls.forEach((control) => {
            if (control.$dirty && control.$name) {
              if (control.$$controls) {
                control.$$controls.forEach((childControl) => {
                  if (childControl.$dirty) {
                    //console.log(childControl.$name);
                    isOperationDetailsChanged = true;
                  }
                });
              }
              else {
                if (control.$$element.is('text-angular')) {
                  if (vm.operation[control.$name] != vm.operationMain[control.$name]) {
                    //console.log(control.$name);
                    isOperationDetailsChanged = true;
                  }
                }
                else {
                  //console.log(control.$name);
                  isOperationDetailsChanged = true;
                }
              }
            }
          });
        }
        if (isOperationDetailsChanged) {
          vm.saveDisable = false;
          vm.openWOOPRevisionPopup((versionModel) => {
            // Added for close revision dialog popup
            if (versionModel && versionModel.isCancelled) {
              return;
            }
            if (versionModel) {
              saveOperationInfo(versionModel);
            }
            else {
              saveOperationInfo();
            }
          }, event);
        }
        else {
          saveOperationInfo();
        }
      }
      else {
        saveOperationInfo();
      }
      const sentData = {
        isOperationsVerified: false,
        isOperationAvailable: true
      };
      $scope.$emit("operationChanged", sentData);
    };

    const saveOperationInfo = (versionModel) => {
      if (vm.operation.isMoveToStock) {
        // when last move to stock op then not allowed MissingPart/Bypass qty
        vm.operation.isAllowMissingPartQty = vm.operation.isAllowBypassQty = false;
      }


      // set default from code for inspection process than rework must be false and MFG Qty must be true
      const operationInfo = {
        woOPID: vm.operation.woOPID,
        woID: vm.operation.woID,
        opID: vm.operation.opID,
        opName: vm.operation.opName,
        opNumber: vm.operation.opNumberText,
        opDescription: vm.operation.opDescription,
        opOrder: vm.operation.opNumberText,
        opVersion: vm.operation.opVersion,
        woVersion: vm.operation.woVersion,
        opStatus: vm.operation.opStatus,
        operationTypeID: vm.autoCompleteOperationType.keyColumnId ? vm.autoCompleteOperationType.keyColumnId : null,
        mountingTypeID: vm.autoCompleteMountingType.keyColumnId ? vm.autoCompleteMountingType.keyColumnId : null,
        parentOPID: vm.autoCompleteParentOperation.keyColumnId ? vm.autoCompleteParentOperation.keyColumnId : null,
        qtyControl: vm.IsInspectionProcess ? true : vm.operation.qtyControl,
        processTime: vm.operation.processTime ? timeToSeconds(vm.operation.processTime) : null,
        setupTime: vm.operation.setupTime ? timeToSeconds(vm.operation.setupTime) : null,
        perPieceTime: vm.operation.perPieceTime ? timeToSeconds(vm.operation.perPieceTime) : null,
        opWorkingCondition: vm.operation.opWorkingCondition,
        opManagementInstruction: vm.operation.opManagementInstruction,
        opDeferredInstruction: vm.operation.opDeferredInstruction,
        //isNoClean: vm.operation.isNoClean,
        //isWatersoluble: vm.operation.isWatersoluble,
        isIssueQty: vm.operation.qtyControl ? vm.operation.isIssueQty : false,
        isRework: vm.IsInspectionProcess ? false : (vm.operation.qtyControl ? vm.operation.isRework : false),
        isTeamOperation: vm.operation.isTeamOperation,
        isStopOperation: vm.operation.isStopOperation,
        isMoveToStock: vm.operation.isMoveToStock,
        isPlacementTracking: vm.operation.isPlacementTracking,
        isTrackBySerialNo: vm.operation.isTrackBySerialNo,
        isLoopOperation: vm.operation.isLoopOperation,
        //refLoopWOOPID: vm.operation.refLoopWOOPID,
        refLoopWOOPID: vm.operation.isLoopOperation ? (vm.autoCompleteLoopToOp.keyColumnId ? vm.autoCompleteLoopToOp.keyColumnId : null) : null,
        isAllowFinalSerialMapping: vm.operation.isAllowFinalSerialMapping,
        isPreProgrammingComponent: (vm.operation.qtyControl || vm.operation.isIssueQty) ? false : vm.operation.isPreProgrammingComponent,
        woStatus: vm.operation.workorder.woStatus,
        colorCode: vm.operation.colorCode,
        tabLimitAtTraveler: vm.operation.tabLimitAtTraveler,
        woNumber: vm.operation.workorder.woNumber,
        opTypeForWOOPTimeLineLog: null,
        // cleaningType: vm.operation.cleaningType,
        isAllowMissingPartQty: vm.operation.isAllowMissingPartQty,
        isAllowBypassQty: vm.operation.isAllowBypassQty,
        isEnablePreProgrammingPart: vm.operation.isEnablePreProgrammingPart,
        isFluxNotApplicable: vm.operation.isFluxNotApplicable,
        isNoClean: vm.operation.isNoClean,
        isWaterSoluble: vm.operation.isWaterSoluble,
        refDesigList: vm.operation.refDesigList,
        addRefDesig: vm.operation.addRefDesig,
        isRequireMachineVerification: vm.operation.isRequireMachineVerification,
        doNotReqApprovalForScan: vm.operation.doNotReqApprovalForScan,
        isRequireRefDesWithUMID: vm.operation.isRequireRefDesWithUMID,
        isStrictlyLimitRefDes: vm.operation.isStrictlyLimitRefDes,
        shortDescription: vm.operation.shortDescription
      };

      if (vm.operation.woOPID) {
        vm.cgBusyLoading = WorkorderOperationFactory.updateOperation().update({
          id: vm.operation.woOPID,
        }, operationInfo).$promise.then((res) => {
          if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.sendNotification(versionModel);
            vm.frmOperationDetails.$setPristine();
            vm.operationMain = angular.copy(vm.operation);
            vm.ResetFlagChange();
            $scope.$emit('bindWorkorderTreeViewMain', { woID: vm.operation.woID });
            vm.isWorkorderOperationPublished = vm.operation.opStatus == vm.DisplayStatus.Published.ID;
            vm.refreshWorkOrderHeaderDetails();
            // Check vm.isChange flag for color picker dirty object 
            vm.isChange = false;
            $scope.$broadcast('refreshRefDesgDirectiveList', {});
            //if (versionModel && (versionModel.woVersion || versionModel.opVersion)) {
            //    vm.refreshWorkOrderHeaderDetails();
            //}
          }
          vm.saveDisable = false;
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
    };

    vm.getColor = ($event, colorCode) => {
      var color = CORE.DEFAULT_STANDARD_CLASS_COLOR;
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
        if (vm.operation.colorCode !== '#' + vm.color) {
          vm.isChange = true;
          vm.frmOperationDetails.$setDirty(true);
        }
        vm.operation.colorCode = '#' + vm.color;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    vm.checkboxButtonGroup = {
      isMoveToStock: {
        checkDisable: () => {
          return (vm.isWorkorderOperationPublished
            || vm.isWOUnderTermination
            || vm.IsProductionComplete || vm.isWoInSpecificStatusNotAllowedToChange);
        },
        onChange: () => {
          if (vm.operation.isMoveToStock) {
            vm.operation.qtyControl = true;
            if (vm.trackBySerialFromWOOPNumber
              && (vm.operation.opNumber > vm.trackBySerialFromWOOPNumber)) {
              vm.operation.isTrackBySerialNo = true;
            }
            vm.operation.isRework = false;
            resetLoopOperation();
            vm.operation.isPreProgrammingComponent = false;
            vm.operation.isAllowMissingPartQty = false;
            vm.operation.isAllowBypassQty = false;
          }
          checkAndSetChangeFlag();
        }
      },
      isTrackBySerialNo: {
        checkDisable: () => {
          if (vm.operation.isTrackBySerialNo && (vm.IsProductionComplete || !vm.IsFirstTrackingWOOP)) {
            return true;
          } else {
            // disable parallel cluster operation
            return (vm.isWorkorderOperationPublished
              || vm.isWorkorderPublished
              || vm.isWOUnderTermination
              || vm.IsProductionStart
              // || vm.operation.workorder.isOperationTrackBySerialNo 
              || (vm.operation && vm.operation.workorder ? vm.operation.workorder.isOperationTrackBySerialNo : false)
              || vm.operation.isParallelCluster
              || vm.trackBySerialFromWOOPNumber
              || vm.isWoInSpecificStatusNotAllowedToChange);
          }
        },
        onChange: () => {
          if (vm.operation.isTrackBySerialNo) {
            vm.IsFirstTrackingWOOP = true;
            //getPreviousOperationDetails
            vm.operation.qtyControl = true;
            //vm.operation.isRework = false;
            //resetLoopOperation();
            vm.operation.isPreProgrammingComponent = false;
          }
          checkAndSetChangeFlag();
        }
      },
      isAllowFinalSerialMapping: {
        // disable parallel cluster operation
        checkDisable: () => {
          return (vm.isWorkorderOperationPublished
            || vm.isWOUnderTermination
            || vm.IsProductionComplete
            || vm.operation.isParallelCluster || vm.operation.isLoopOperation
            || vm.isWoInSpecificStatusNotAllowedToChange);
        },
        onChange: () => {
          if (vm.operation.isAllowFinalSerialMapping) {
            vm.operation.isRework = false;
            resetLoopOperation();
            vm.operation.isPreProgrammingComponent = false;
          }
          checkAndSetChangeFlag();
        }
      },
      isLoopOperation: {
        checkDisable: () => {
          return (vm.isWorkorderOperationPublished
            || vm.isWOUnderTermination
            || vm.IsProductionComplete
            || vm.operation.isParallelCluster
            || vm.IsInspectionProcess || vm.isWoInSpecificStatusNotAllowedToChange);
        },
        onChange: () => {
          if (vm.operation.isLoopOperation) {
            const requiredDet = {
              isLoopToOpSelectAction: false
            };
            getPreviousWorkOrderOperationDetails(requiredDet);
          } else {
            resetLoopOperation();
          }
          checkAndSetChangeFlag();
        }
      },
      isAllowMissingPartQty: {
        checkDisable: () => {
          return vm.isWorkorderOperationPublished
            || vm.isWorkorderPublished
            || vm.isWOUnderTermination
            || vm.IsProductionStart
            || vm.operation.isRework
            || vm.IsInspectionProcess
            || (!vm.operation.qtyControl)
            || vm.operation.isMoveToStock
            || vm.isWoInSpecificStatusNotAllowedToChange;
        }
      },
      isAllowBypassQty: {
        checkDisable: () => {
          return vm.isWorkorderOperationPublished
            || vm.isWorkorderPublished
            || vm.isWOUnderTermination
            || vm.IsProductionStart
            || vm.operation.isRework
            || (!vm.operation.qtyControl)
            || vm.operation.isMoveToStock
            || vm.isWoInSpecificStatusNotAllowedToChange;
        }
      },
      isEnablePreProgrammingPart: {
        checkDisable: () => {
          return vm.isWorkorderOperationPublished
            || vm.isWorkorderPublished
            || vm.isWOUnderTermination
            || vm.IsProductionStart
            || vm.isWoInSpecificStatusNotAllowedToChange;
        },
        onChange: () => {
          if (vm.operation.isEnablePreProgrammingPart) {
            vm.operation.isPreProgrammingComponent = false;
          }
          checkAndSetChangeFlag();
        }
      },
      isPlacementTracking: {
        checkDisable: () => {
          return vm.isWorkorderOperationPublished || vm.isWOUnderTermination || vm.IsProductionComplete || vm.operation.isRequireRefDesWithUMID || vm.operation.isStrictlyLimitRefDes;
        },
        onChange: () => {
          checkAndSetChangeFlag();
        }
      },
      fluxType: {
        checkDisable: () => vm.isWorkorderOperationPublished
          || vm.isWorkorderPublished
          || vm.isWOUnderTermination
          || vm.isWoInSpecificStatusNotAllowedToChange,
        onChange: () => {
          if (vm.operation.isFluxNotApplicable === true) {
            vm.operation.isNoClean = 0;
            vm.operation.isWaterSoluble = 0;
            vm.isNCWSDisabled = true;
          } else {
            vm.isNCWSDisabled = false;
          }
          setFluxTypeValidity();
        }
      }
    };

    // on change event and validation for radio button enable/disable
    vm.radioButtonGroup = {
      qtyControl: {
        array: CORE.OperationRadioGroup.qtyControl,
        checkDisable: () => {
          return (vm.isWorkorderOperationPublished
            || vm.isWorkorderPublished
            || vm.isWOUnderTermination
            || vm.IsProductionStart
            || vm.operation.isMoveToStock
            || vm.IsInspectionProcess
            || vm.isWoInSpecificStatusNotAllowedToChange
            || (!vm.trackBySerialFromWOOPNumber && vm.operation.isTrackBySerialNo));
        },
        onChange: () => {
          if (vm.operation.qtyControl) {
            if (vm.trackBySerialFromWOOPNumber && (vm.operation.opNumber > vm.trackBySerialFromWOOPNumber)) {
              vm.operation.isTrackBySerialNo = true;
            }
            vm.operation.isPreProgrammingComponent = false;
          } else {
            vm.operation.isIssueQty = vm.operation.isRework = false;
            vm.operation.isTrackBySerialNo = false;
            resetLoopOperation();
            vm.operation.isAllowMissingPartQty = vm.operation.isAllowBypassQty = false;
          }
          checkAndSetChangeFlag();
        }
      },
      isRework: {
        array: CORE.OperationRadioGroup.isRework,
        checkDisable: () => {
          return (vm.isWorkorderOperationPublished
            || vm.isWorkorderPublished
            || vm.isWOUnderTermination
            || vm.IsProductionStart
            || vm.operation.isMoveToStock
            || vm.IsInspectionProcess)
            || vm.isWoInSpecificStatusNotAllowedToChange
            || (!vm.operation.qtyControl);
        },
        onChange: () => {
          if (vm.operation.isRework) {
            vm.operation.isIssueQty = true;
            vm.operation.isAllowFinalSerialMapping = false;
            vm.operation.isMoveToStock = false;
            vm.operation.isAllowMissingPartQty = vm.operation.isAllowBypassQty = false;
          } else {
            vm.operation.isRework = false;
            resetLoopOperation();
          }
          checkAndSetChangeFlag();
        }
      },
      isIssueQty: {
        array: CORE.OperationRadioGroup.isIssueQty,
        checkDisable: () => {
          //if (vm.operation.isIssueQty) {
          return (vm.isWorkorderOperationPublished
            || vm.isWorkorderPublished
            || vm.isWOUnderTermination
            || vm.IsProductionStart
            || vm.operation.isRework) || (!vm.operation.qtyControl)
            || vm.isWoInSpecificStatusNotAllowedToChange;
          //} else {
          //return (vm.IsProductionComplete || vm.isWOUnderTermination || vm.operation.isRework) || (!vm.operation.qtyControl)
          //}
        },
        onChange: () => {
        }
      },
      isTeamOperation: {
        array: CORE.OperationRadioGroup.isTeamOperation,
        checkDisable: () => {
          return vm.isWorkorderOperationPublished
            || vm.isWorkorderPublished
            || vm.isWOUnderTermination
            || vm.IsProductionStart
            || vm.isWoInSpecificStatusNotAllowedToChange;
        },
        onChange: () => {
        }
      },
      isPreProgrammingComponent: {
        array: CORE.OperationRadioGroup.isPreProgrammingComponent,
        checkDisable: () => {
          return (vm.isWorkorderOperationPublished
            || vm.isWorkorderPublished
            || vm.isWOUnderTermination
            || vm.IsProductionStart
            || vm.operation.isMoveToStock) || (vm.operation.qtyControl || vm.operation.isIssueQty)
            || vm.isWoInSpecificStatusNotAllowedToChange;
        },
        onChange: () => {
          if (vm.operation.isPreProgrammingComponent) {
            vm.operation.isEnablePreProgrammingPart = false;
            resetLoopOperation();
          };
          checkAndSetChangeFlag();
        }
      },
      isRequireMachineVerification: {
        array: CORE.OperationRadioGroup.isRequireMachineVerification,
        checkDisable: () => (vm.isWorkorderOperationPublished
          || vm.isWorkorderPublished
          || vm.isWOUnderTermination
          || vm.IsProductionStart)
          || vm.isWoInSpecificStatusNotAllowedToChange,
        onChange: () => {
          checkAndSetChangeFlag();
        }
      },
      doNotReqApprovalForScan: {
        array: CORE.OperationRadioGroup.doNotReqApprovalForScan,
        checkDisable: () => (vm.isWorkorderOperationPublished
          || vm.isWorkorderPublished
          || vm.isWOUnderTermination
          || vm.IsProductionStart)
          || vm.isWoInSpecificStatusNotAllowedToChange,
        onChange: () => {
          checkAndSetChangeFlag();
        }
      }
    };

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    };

    vm.convertThreeDecimal = (opNumber) => {
      vm.operation.opNumberText = convertToThreeDecimal(opNumber);
      if (parseFloat(vm.operation.opNumberText) === 0) {
        vm.frmOperationDetails.opNumber.$setValidity('invalid', false);
      } else {
        vm.frmOperationDetails.opNumber.$setValidity('invalid', true);
      }
    };

    // go to operation type list page
    vm.goToOperationType = () => BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_OPTYPE_STATE);

    // go to operation list page
    vm.goToOperation = () => {
      BaseService.openInNew(OPERATION.OPERATION_OPERATIONS_STATE)
    };

    /* called for max length validation */
    vm.getDescrLengthValidation = (maxLength, enterTextLength) => {
      const enteredText = vm.htmlToPlaintext(enterTextLength);
      return BaseService.getDescrLengthValidation(maxLength, enteredText.length);
    };

    vm.htmlToPlaintext = (text) => {
      return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };

    //vm.checkLoopOperation = () => {
    //  vm.getPreviousWorkOrderOperationDetails();
    //}


    // to reset work order operation details
    vm.resetPreviousWorkOrderOperationDetails = () => {
      //vm.operation.LoopOperationError = "";
      vm.operation.isLoopOperation = false;
      vm.operation.refLoopWOOPID = null;
      if (vm.autoCompleteLoopToOp) {
        vm.autoCompleteLoopToOp.keyColumnId = null;
      }
    };

    // on select loop to/prev wo op from auto complete
    const onSelectLoopToOperation = (selectedWOOPItem) => {
      if (selectedWOOPItem) {
        vm.operation.isLoopOperation = true;
        const requiredDet = {
          isLoopToOpSelectAction: true
        };
        getPreviousWorkOrderOperationDetails(requiredDet);
        vm.operation.isRework = vm.operation.isIssueQty = true;
        vm.operation.qtyControl = true;
        vm.operation.isAllowMissingPartQty = vm.operation.isAllowBypassQty = false;
        if (vm.trackBySerialFromWOOPNumber && (vm.operation.opNumber > vm.trackBySerialFromWOOPNumber)) {
          vm.operation.isTrackBySerialNo = true;
        }
        vm.operation.isAllowFinalSerialMapping = false;
        vm.operation.isPreProgrammingComponent = false;
        vm.operation.refLoopWOOPID = selectedWOOPItem.woopid;
      }
      else {
        vm.operation.isLoopOperation = false;
        vm.resetPreviousWorkOrderOperationDetails();
        resetLoopOperation();
      }
      setTimeout(() => { checkAndSetChangeFlag(); }, 0);
    };


    if (vm.operation) {
      vm.operation.isParallelCluster = _.find(vm.operation.workorderOperationCluster, (item) => { return item.clusterWorkorder.isParellelOperation; });
    }

    // Set required field for Flux Type
    const setFluxTypeValidity = () => {
      if (!vm.operation.isNoClean && !vm.operation.isWaterSoluble && !vm.operation.isFluxNotApplicable) {
        vm.frmOperationDetails.fluxType.$setValidity('isFluxTypeRequired', false);
      } else {
        vm.frmOperationDetails.fluxType.$setValidity('isFluxTypeRequired', true);
      }
    };

    //Reset flags for field change
    vm.ResetFlagChange = () => {
      vm.isMoveToStockChanged = vm.isTrackBySerialNoChanged = vm.isAllowFinalSerialMappingChanged = vm.isLoopOperationChanged = vm.isQtyControlChanged = vm.isReworkChanged = vm.isIssueQtyChanged = vm.isPreProgrammingComponentChanged = vm.isAllowMissingPartQtyChanged = vm.isAllowBypassQtyChanged = vm.isEnablePreProgrammingPartChanged = vm.isPlacementTrackingChanged = false;
    };

    const checkAndSetChangeFlag = () => {
      vm.isReworkChanged = (vm.operationMain.isRework !== vm.operation.isRework);
      vm.isIssueQtyChanged = (vm.operationMain.isIssueQty !== vm.operation.isIssueQty);
      vm.isAllowMissingPartQtyChanged = (vm.operationMain.isAllowMissingPartQty !== vm.operation.isAllowMissingPartQty);
      vm.isAllowBypassQtyChanged = (vm.operationMain.isAllowBypassQty !== vm.operation.isAllowBypassQty);
      vm.isAllowFinalSerialMappingChanged = (vm.operationMain.isAllowFinalSerialMapping !== vm.operation.isAllowFinalSerialMapping);
      vm.isPreProgrammingComponentChanged = (vm.operationMain.isPreProgrammingComponent !== vm.operation.isPreProgrammingComponent);
      vm.isEnablePreProgrammingPartChanged = (vm.operationMain.isEnablePreProgrammingPart !== vm.operation.isEnablePreProgrammingPart);
      vm.isLoopOperationChanged = (vm.autoCompleteLoopToOp && vm.operationMain.refLoopWOOPID !== vm.autoCompleteLoopToOp.keyColumnId);
      vm.isTrackBySerialNoChanged = (vm.operationMain.isTrackBySerialNo !== vm.operation.isTrackBySerialNo);
      vm.isMoveToStockChanged = (vm.operationMain.isMoveToStock !== vm.operation.isMoveToStock);
      vm.isQtyControlChanged = (vm.operationMain.qtyControl !== vm.operation.qtyControl);
      vm.isPlacementTrackingChanged = (vm.operationMain.isPlacementTracking !== vm.operation.isPlacementTracking);
    };

    //Go to mounting type
    vm.goToMountingTypeList = () => {
      BaseService.openInNew(USER.ADMIN_MOUNTING_TYPE_STATE, {});
    };

    angular.element(() => {
      BaseService.currentPageForms = [vm.frmOperationDetails];
    });
  };

  //angular
  //   .module('app.workorder.workorders').WorkorderOperationDetailsController = function () {
  //   };
})();
