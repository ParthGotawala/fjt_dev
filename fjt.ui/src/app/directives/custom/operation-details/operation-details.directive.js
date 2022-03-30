(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('operationDetails', operationDetails);

  /** @ngInject */
  function operationDetails(CORE, $q, OperationFactory, BaseService, GenericCategoryFactory, ComponentFactory, USER, GenericCategoryConstant,
    $timeout, RFQTRANSACTION, OPERATION, $mdColorPicker, DialogFactory, $state) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        operationData: '='
      },
      templateUrl: 'app/directives/custom/operation-details/operation-details.html',
      controller: operationDetailsCtrl,
      controllerAs: 'vm'
    };

    return directive;

    /** @ngInject */
    function operationDetailsCtrl($scope) {
      var vm = this;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.LOOP_OPERATION_ALLOW_AT_TRAVELER = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.LOOP_OPERATION_INFO;
      vm.OperationType = CORE.CategoryType.OperationType;
      vm.OperationTimePattern = CORE.OperationTimePattern;
      vm.OperationTimeMask = CORE.OperationTimeMask;
      vm.LabelConstant = CORE.LabelConstant;
      vm.isPublishDisabled = false;//$scope.$parent.vm.isPublishDisabled;
      vm.isFluxNotApplicableDisabled = vm.isPublishDisabled;
      vm.OpStatus = CORE.OpStatus;
      vm.maxLengthForDescription = _maxLengthForDescription;
      let oldOperatationNumber = '';
      vm.operation = $scope.operationData ? $scope.operationData : null;
      vm.taToolbar = CORE.Toolbar;
      let GenericCategoryAllData = [];

      const updateOperationStatus = () => {
        if (vm.operation) {
          vm.isPublishDisabled = (vm.operation.opStatus === vm.OpStatus[1].ID);
          vm.isFluxNotApplicableDisabled = vm.isPublishDisabled;
        }
      };

      updateOperationStatus();

      //Get Operation type list
      const getOperationTypeList = () => {
        const GencCategoryType = [];
        GencCategoryType.push(vm.OperationType.Name);
        const listObj = {
          GencCategoryType: GencCategoryType,
          isActive: vm.operation.opID ? true : false
        };
        return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((genericCategories) => {
          GenericCategoryAllData = genericCategories.data;
          vm.OperationTypeList = _.filter(GenericCategoryAllData, (item) => item.parentGencCategoryID === null && item.categoryType === vm.OperationType.Name);
          return $q.resolve(vm.OperationTypeList);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //Get parent operation list
      const getParentOperationList = () => {
        const filter = {};
        if (vm.operation.opID) {
          filter.excludeOpID = vm.operation.opID;
        }
        return OperationFactory.getOperationList().query(filter).$promise.then((operation) => {
          //OperationAllData = operation.data;
          vm.ParentOperationList = _.filter(operation.data, (item) => !item.parentOPID);
          _.each(vm.ParentOperationList, (item) => {
            item.opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, item.opName, item.opNumber);
          });
          return $q.resolve(vm.ParentOperationList);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // get mounting type list
      const getMountingTypeList = () => ComponentFactory.getMountingTypeList().query().$promise.then((res) => {
        vm.mountingTypeList = res && res.data ? res.data : [];
        return res.data;
      }).catch((error) => BaseService.getErrorLog(error));

      // get selected operation type object on select of autocomplete icon
      const getSelectedOperationType = (obj) => {
        if (obj && obj.gencCategoryName === GenericCategoryConstant.OPERATION_TYPE.INSPECTION_PROCESS.gencCategoryName) {
          vm.operation.qtyControl = true;
          vm.IsInspectionProcess = true;
          vm.operation.isRework = false;
          vm.operation.isMoveToStock = false;
          vm.operation.isPlacementTracking = false;
          vm.operation.isAllowMissingPartQty = false;
        }
        else {
          vm.IsInspectionProcess = false;
        }
      };

      const initAutoComplete = () => {
        vm.autoCompleteOperationType = {
          columnName: 'gencCategoryName',
          controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
          viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
          keyColumnName: 'gencCategoryID',
          keyColumnId: vm.operation.operationTypeID ? vm.operation.operationTypeID : null,
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
          keyColumnId: vm.operation.parentOPID ? vm.operation.parentOPID : null,
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
      };

      const autoComplete = () => {
        var autocompletePromise = [getOperationTypeList(), getParentOperationList(), getMountingTypeList()];
        vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
          initAutoComplete();
        }).catch((error) => BaseService.getErrorLog(error));
      };
      autoComplete();

      // go to operation type list page
      vm.goToOperationType = () => BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_OPTYPE_STATE, {});

      // go to operation list page
      vm.goToOperation = () => BaseService.openInNew(OPERATION.OPERATION_OPERATIONS_STATE, {});


      //Use color picker to set color for the operation
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
            $scope.$parent.vm.isChange = true;
            vm.operationDetailsForm.$dirty = true;
          }
          vm.operation.colorCode = '#' + vm.color;
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //Update radio button selection in Transaction Level Setting on change of check-box selection from Operation Detail
      vm.setAllSettings = () => {
        if (vm.operation.isMoveToStock) {
          vm.operation.qtyControl = true;
          vm.operation.isRework = false;
          vm.operation.isLoopOperation = false;
          vm.operation.isAllowMissingPartQty = vm.operation.isAllowBypassQty = false;
        }
      };

      //Update radio button selection in Transaction Level Setting on change of check-box selection from Operation Detail
      vm.loopOperationChanged = () => {
        if (vm.operation.isLoopOperation) {
          vm.operation.isRework = true;
          vm.operation.isIssueQty = true;
          vm.operation.qtyControl = true;
          vm.operation.isAllowMissingPartQty = vm.operation.isAllowBypassQty = false;
        }
      };

      vm.checkboxButtonGroup = {
        isAllowMissingPartQty: {
          checkDisable: () => vm.isPublishDisabled
            || vm.operation.isRework
            || vm.IsInspectionProcess
            || !vm.operation.qtyControl
            || vm.operation.isMoveToStock
        },
        isAllowBypassQty: {
          checkDisable: () => vm.isPublishDisabled
            || vm.operation.isRework
            || !vm.operation.qtyControl
            || vm.operation.isMoveToStock
        },
        isEnablePreProgrammingPart: {
          checkDisable: () => vm.isPublishDisabled
        },
        fluxType: {
          checkDisable: () => vm.isPublishDisabled || vm.operation.isFluxNotApplicable,
          onChange: () => {
            if (vm.operation.isFluxNotApplicable === true) {
              vm.operation.isNoClean = false;
              vm.operation.isWaterSoluble = false;
            }
            setFluxTypeValue();
          }
        }
      };

      //Get radio button values in Transaction Level Setting
      vm.radioButtonGroup = {
        qtyControl: {
          array: CORE.OperationRadioGroup.qtyControl,
          checkDisable: () => (vm.operation.isMoveToStock || vm.IsInspectionProcess || vm.isPublishDisabled),
          onChange: () => {
            if (vm.operation.qtyControl) {
              //vm.operation.isPreProgrammingComponent = false;
            } else {
              vm.operation.isIssueQty = vm.operation.isRework = false;
              vm.operation.isLoopOperation = false;
              vm.operation.isAllowMissingPartQty = vm.operation.isAllowBypassQty = false;
            }
          }
        },
        isRework: {
          array: CORE.OperationRadioGroup.isRework,
          checkDisable: () => (vm.operation.isMoveToStock || vm.IsInspectionProcess || vm.isPublishDisabled || !vm.operation.qtyControl),
          onChange: () => {
            if (vm.operation.isRework) {
              vm.operation.isIssueQty = true;
              vm.operation.isAllowMissingPartQty = vm.operation.isAllowBypassQty = false;
            }
            else {
              vm.operation.isLoopOperation = false;
            }
          }
        },
        isIssueQty: {
          array: CORE.OperationRadioGroup.isIssueQty,
          checkDisable: () => (vm.operation.isRework || vm.isPublishDisabled) || (!vm.operation.qtyControl),
          onChange: () => {
          }
        },
        isTeamOperation: {
          array: CORE.OperationRadioGroup.isTeamOperation,
          checkDisable: () => vm.isPublishDisabled,
          onChange: () => {
          }
        }
      };

      //convert html text to plain text to calculate max length validation
      vm.htmlToPlaintext = (text) => text ? String(text).replace(/<[^>]+>/gm, '') : '';

      /* called for max length validation */
      vm.getDescrLengthValidation = (maxLength, enteredText) => {
        const enteredPlainText = vm.htmlToPlaintext(enteredText);
        return BaseService.getDescrLengthValidation(maxLength, enteredPlainText.length);
      };

      //convert operation# to 3 decimal place value
      vm.convertThreeDecimal = (opNumber) => {
        vm.operation.opNumberText = convertToThreeDecimal(opNumber);
        if (parseFloat(vm.operation.opNumberText) === 0) {
          vm.operationDetailsForm.opNumber.$setValidity('invalid', false);
        } else {
          vm.operationDetailsForm.opNumber.$setValidity('invalid', true);
          if (oldOperatationNumber !== vm.operation.opNumberText) {
            if (vm.operationDetailsForm && vm.operationDetailsForm.opNumber.$dirty && vm.operation.opNumberText) {
              vm.cgBusyLoading = OperationFactory.checkDuplicateOpNumber().query({
                opID: vm.operation.opID,
                opNumber: vm.operation.opNumberText
              }).$promise.then((res) => {
                vm.cgBusyLoading = false;
                oldOperatationNumber = angular.copy(vm.operation.opNumberText);
                if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateOpNumber) {
                  displayOperationNumberNameUniqueMessage();
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }
        }
      };

      const displayOperationNumberNameUniqueMessage = () => {
        oldOperatationNumber = '';
        vm.operation.opNumberText = null;
        //let opNumberEle = angular.element(document.querySelector('#opNumber'));
        //opNumberEle.focus();
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.Operation.OP);
        const obj = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(obj).then(() => {
          setFocus('opNumber');
        });
      };

      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

      vm.setToTop = () => {
        $timeout(() => {
          const ContentDiv = document.querySelector('#content > .ps-scrollbar-y-rail');
          if (ContentDiv) {
            ContentDiv.style.top = '0px';
          }
        }, _configSelectListTimeout);
      };

      //Save operation data- when clicked on Save button
      vm.SaveOperation = (isCheckUnique) => {
        setFluxTypeValue();
        if (vm.operation.isMoveToStock) {
          // when last move to stock op then not allowed MissingPart/Bypass qty
          vm.operation.isAllowMissingPartQty = vm.operation.isAllowBypassQty = false;
        }
        //if (vm.operation.isFluxNotApplicable === false && vm.operation.isNoClean === false && vm.operation.isWaterSoluble === false) {
        //  vm.operation.isFluxNotApplicable = true;
        //}
        if (vm.operationDetailsForm.$dirty && BaseService.focusRequiredField(vm.operationDetailsForm)) {
          $scope.$parent.vm.saveDisable = false;
          return;
        }
        const operationInfo = {
          opID: vm.operation.opID,
          opName: vm.operation.opName,
          opNumber: vm.operation.opNumberText,
          opDescription: vm.operation.opDescription,
          opOrder: vm.operation.opNumberText,
          opStatus: vm.operation.opStatus,
          tabLimitAtTraveler: vm.operation.tabLimitAtTraveler,
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
          isCheckUnique: isCheckUnique ? isCheckUnique : false,
          isIssueQty: vm.operation.qtyControl ? vm.operation.isIssueQty : false,
          isMoveToStock: vm.operation.isMoveToStock ? vm.operation.isMoveToStock : false,
          isPlacementTracking: vm.operation.isPlacementTracking ? vm.operation.isPlacementTracking : false,
          isRework: vm.IsInspectionProcess ? false : (vm.operation.qtyControl ? vm.operation.isRework : false),
          isTeamOperation: vm.operation.isTeamOperation,
          colorCode: vm.operation.colorCode ? vm.operation.colorCode : null,
          isAllowMissingPartQty: vm.operation.isAllowMissingPartQty,
          isAllowBypassQty: vm.operation.isAllowBypassQty,
          isEnablePreProgrammingPart: vm.operation.isEnablePreProgrammingPart,
          isFluxNotApplicable: vm.operation.isFluxNotApplicable,
          isNoClean: vm.operation.isNoClean,
          isWaterSoluble: vm.operation.isWaterSoluble,
          shortDescription: vm.operation.shortDescription
        };
        operationInfo.isLoopOperation = operationInfo.isRework ? vm.operation.isLoopOperation : false;

        if (vm.operation.opID) {
          vm.cgBusyLoading = OperationFactory.operation().update({
            id: vm.operation.opID
          }, operationInfo).$promise.then((res) => {
            if (res && res.data && res.data.opID) {
              vm.setToTop();
              //vm.operationDetails(vm.operation.opID);
              $scope.$emit('updateOperationDetailsData', vm.operation);
              vm.operationDetailsForm.$setPristine();
            }
            else if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.data && res.data.isDuplicateOpNumber) {
              displayOperationNumberNameUniqueMessage();
            }

            updateOperationStatus();

            $scope.$parent.vm.saveDisable = false;
          }).catch((error) => {
            $scope.$parent.vm.saveDisable = false;
            return BaseService.getErrorLog(error);
          });
        }
        else {
          vm.cgBusyLoading = OperationFactory.operation().save(operationInfo).$promise.then((res) => {
            if (res && res.data) {
              if (res.data.opID) {
                vm.operation.opID = res.data.opID;
                // msWizard.nextStep();
                vm.isChange = false;
                //vm.operationDetails(vm.operation.opID);
                $scope.$emit('updateOperationDetailsData', vm.operation);
                vm.operationDetailsForm.$setPristine();
                $state.transitionTo($state.$current, { opID: vm.operation.opID }, { location: true, inherit: true, notify: false });
                updateOperationStatus();
                vm.setToTop();
              }
              else {
                if (res.data.fieldName) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.UNIQUE_CONFIRM_MESSAGE);
                  messageContent.message = stringFormat(messageContent.message, res.data.fieldName);
                  const obj = {
                    messageContent: messageContent,
                    btnText: CORE.MESSAGE_CONSTANT.BUTTON_CREATENEW_TEXT,
                    canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                  };
                  DialogFactory.messageConfirmDialog(obj).then((yes) => {
                    if (yes) {
                      vm.SaveOperation(false);
                      // Check vm.isChange flag for color picker dirty object
                      vm.isChange = false;
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                }
              }
            }
            $scope.$parent.vm.saveDisable = false;
          }).catch((error) => {
            $scope.$parent.vm.saveDisable = false;
            return BaseService.getErrorLog(error);
          });
        }
      };

      vm.changedOperationDetails = () => {

      };

      //Save Operation Data before tab change
      $scope.$on('saveOperationDetailsTabChanges', (eve, data) => {
        if (typeof data !== 'undefined') {
          vm.operation.opStatus = data;
        }
        vm.SaveOperation(true);
      });

      /**
      * Set required field for Flux Type
      **/
      function setFluxTypeValue() {
        if (!vm.operation.isNoClean && !vm.operation.isWaterSoluble && !vm.operation.isFluxNotApplicable) {
          vm.operationDetailsForm.fluxType.$setValidity('isFluxTypeRequired', false);
        } else {
          vm.operationDetailsForm.fluxType.$setValidity('isFluxTypeRequired', true);
        }
      }

      //go to mounting type
      vm.goToMountingTypeList = () => {
        BaseService.openInNew(USER.ADMIN_MOUNTING_TYPE_STATE, {});
      };

      angular.element(() => {
        BaseService.currentPageForms.push(vm.operationDetailsForm);
        $scope.$parent.vm.operationDetailsForm = vm.operationDetailsForm;
      });
    }
  }
})();
