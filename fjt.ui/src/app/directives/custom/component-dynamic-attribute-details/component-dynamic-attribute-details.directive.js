(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('componentDynamicAttribute', componentDynamicAttribute);

  /** @ngInject */
  function componentDynamicAttribute(CORE, DialogFactory, USER, RFQTRANSACTION, $filter, $q, $timeout, ComponentFactory, BaseService, $mdDialog, ComponentPriceBreakDetailsFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        id: '=?',
        isReadOnly: '=?'
      },
      templateUrl: 'app/directives/custom/component-dynamic-attribute-details/component-dynamic-attribute-details.html',
      controller: componentDynamicAttributeDetailsCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function componentDynamicAttributeDetailsCtrl($scope, $element, $attrs) {
      var vm = this;
      vm.componentpartId = $scope.id ? parseInt($scope.id) : null;
      var updatedOn = new Date();
      vm.partAttributedetails = {
        id: 0,
        mfgPNID: vm.componentpartId,
        attributeID: null,
        attributeValue: null
      }
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.LabelConstant = angular.copy(CORE.LabelConstant);
      vm.attributeTypeList = CORE.AttributeTypeDropdown;
      vm.boolValueList = CORE.AttributeBoolValueDropdown;
      vm.PartOperationalAttributeDetailsData;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.attributeList = [];
      var curDate = $filter('date')(updatedOn, "MM-dd-yyyy");
      let isExits;
      vm.IsDeleteDisable = false;

      vm.checkFormDirty = (form, columnName) => {
        let checkDirty = BaseService.checkFormDirty(form, columnName);
        return checkDirty;
      }

      /** Validate max size */
      vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
        return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
      };

      /** Load data in directive */
      vm.getPartDynamicAttributeDetails = (ev) => {
        vm.hlOperanalAttribute = false;
        vm.cgBusyLoading = ComponentFactory.getPartDynamicAttributeDetails().query({ id: vm.componentpartId }).$promise.then((res) => {
          vm.hlOperanalAttribute = true;
          if (res && res.data) {
            vm.attributeList = _.filter(vm.attributeList, (item) => { return item.isActive });
            vm.PartOperationalAttributeDetailsData = res.data;
            vm.PartOperationalAttributeDetailsData.map(item => {
              if (!item.icon || item.icon == "") {
                item.icon = CORE.WEB_URL + USER.DYNAMIC_ATTRIBUTE_BASE_PATH + CORE.NO_IMAGE_ROHS;
              } else {
                item.icon = CORE.WEB_URL + USER.DYNAMIC_ATTRIBUTE_BASE_PATH + item.icon;
              }
              if (item.fieldType == vm.attributeTypeList[3].fieldType && item.attributeValue) {
                item.attributeStrValue = $filter('date')(new Date(item.attributeValue), _dateDisplayFormat);
              }
            });
            $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateComponentHeader, vm.PartOperationalAttributeDetailsData);
          }
          return res;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      /** Load data in directive */
      vm.getPartDynamicAttributeList = (ev) => {
        return vm.cgBusyLoading = ComponentFactory.getPartDynamicAttributeList().query().$promise.then((res) => {
          if (res && res.data) {
            vm.attributeListAll = angular.copy(res.data);
            vm.attributeList = _.filter(res.data, (item) => { return item.isActive });
          }
          else {
            vm.attributeList = [];
          }

          return vm.attributeList;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      function init() {
        vm.cgBusyLoading = $q.all([vm.getPartDynamicAttributeDetails(), vm.getPartDynamicAttributeList()]).then((responses) => {
          initAutoComplete();
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      }
      init();

      let getDefaultValue = (item) => {
        if (item) {
          vm.partAttributedetails.attributeValue = item.defaultValue;
        }
      }

      let getPartAttribute = (item) => {
        if (item) {
          vm.autoCompleteAttributes.keyColumnId = item.id;
          vm.partAttributedetails.attributeID = item.id;
          vm.partAttributedetails.fieldType = item.fieldType;
          if (vm.partAttributedetails.attributeValue == null) {
            if (vm.partAttributedetails.fieldType == vm.attributeTypeList[1].fieldType) {
              vm.partAttributedetails.attributeValue = Number(item.defaultValue);
            }
            else {
              vm.partAttributedetails.attributeValue = item.defaultValue;
            }
          }
          vm.partAttributedetails.defaultValue = vm.partAttributedetails.attributeValue;
          if (vm.partAttributedetails.fieldType == vm.attributeTypeList[0].fieldType && !vm.autoCompleteBoolValue) {
            vm.autoCompleteBoolValue = {
              columnName: 'defaultValue',
              keyColumnName: 'defaultValue',
              keyColumnId: vm.partAttributedetails.attributeValue ? vm.partAttributedetails.attributeValue : null,
              inputName: 'defaultValue',
              placeholderName: 'Value',
              isRequired: true,
              isAddnew: false,
              onSelectCallbackFn: getDefaultValue
            }
          }
          if (vm.autoCompleteBoolValue)
            vm.autoCompleteBoolValue.keyColumnId = vm.partAttributedetails.attributeValue;
        }
        else {
          vm.Cancel();
        }
      }

      let initAutoComplete = () => {
        vm.autoCompleteAttributes = {
          columnName: 'attributeName',
          keyColumnName: 'id',
          controllerName: USER.ADMIN_PART_DYNAMIC_ATTRIBUTE_ADD_UPDATE_MODAL_CONTROLLER,
          viewTemplateURL: USER.ADMIN_PART_DYNAMIC_ATTRIBUTE_ADD_UPDATE_MODAL_VIEW,
          keyColumnId: vm.partAttributedetails ? vm.partAttributedetails.attributeID : null,
          inputName: 'Attribute',
          placeholderName: 'Attribute',
          isRequired: false,
          isAddnew: true,
          callbackFn: vm.getPartDynamicAttributeList,
          onSelectCallbackFn: getPartAttribute,
          addData: {
            isActive: true
          },
        }
      };
      /** Check unique price break validation */
      vm.CheckUniquePriceBreak = () => {
        isExits = _.some(vm.PartOperationalAttributeDetailsData, (existsItem) => {
          return vm.pricebreakdetails.priceBreak == existsItem.priceBreak
            && vm.pricebreakdetails.id != existsItem.id && curDate == existsItem.updatedOn;
        })
        return isExits;
      }

      /** Clear inputs */
      vm.Cancel = () => {
        vm.autoCompleteAttributes.focus = false;
        vm.autoCompleteAttributes.keyColumnId = null;
        if (vm.autoCompleteBoolValue)
          vm.autoCompleteBoolValue.keyColumnId = null;
        vm.partAttributedetails = {
          id: 0,
          mfgPNID: vm.componentpartId,
          attributeID: null,
          attributeValue: null,
          fieldType: null
        }
        vm.partOperationalAttributeForm.$setPristine();
        vm.partOperationalAttributeForm.$setUntouched();
        vm.IsDeleteDisable = false;
        vm.FocusAttribute();
      }

      /** Save/Update attribute mapping details */
      vm.SavePartAttributeMappingDetails = () => {
        isExits = false;
        if (vm.partAttributedetails.fieldType == vm.attributeTypeList[3].fieldType &&
          vm.partAttributedetails.attributeValue &&
          vm.partAttributedetails.attributeValue instanceof Date) {
          vm.partAttributedetails.attributeValue = BaseService.getAPIFormatedDate(vm.partAttributedetails.attributeValue);
        }
        if (vm.partAttributedetails.id != 0) {
          vm.cgBusyLoading = ComponentFactory.getComponentDynamicAttributeMappingPartList()
            .update({
              id: vm.partAttributedetails.id,
            }, vm.partAttributedetails).$promise.then((res) => {
              if (res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                vm.getPartDynamicAttributeDetails();
                vm.Cancel();
              }
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
        }
        else {

          vm.cgBusyLoading = ComponentFactory.getComponentDynamicAttributeMappingPartList()
            .save(vm.partAttributedetails).$promise.then((res) => {
              if (res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                vm.getPartDynamicAttributeDetails();
                vm.Cancel();
              }
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
        }
      }
      /** Edit price break details */
      vm.EditRecord = (item) => {
        vm.attributeList = angular.copy(vm.attributeListAll);/*this is to enable edit for disabled attributes, need to remove disabled attributes on save click*/
        vm.partAttributedetails.id = item.id;
        vm.autoCompleteAttributes.keyColumnId = item.attributeID;
        vm.partAttributedetails.mfgPNID = item.mfgPNID;
        vm.partAttributedetails.attributeID = item.attributeID;
        vm.partAttributedetails.fieldType = item.fieldType;
        if (vm.partAttributedetails.fieldType == vm.attributeTypeList[1].fieldType) {
          vm.partAttributedetails.attributeValue = Number(item.attributeValue);
        }
        else if (vm.partAttributedetails.fieldType == vm.attributeTypeList[3].fieldType) {
          vm.partAttributedetails.attributeValue = item.attributeStrValue;//BaseService.getUIFormatedDate(item.attributeValue, _dateDisplayFormat);
        }
        else {
          vm.partAttributedetails.attributeValue = item.attributeValue;
        }
        if (vm.autoCompleteBoolValue)
          vm.autoCompleteBoolValue.keyColumnId = vm.partAttributedetails.attributeValue;
        vm.IsDeleteDisable = true;
        vm.FocusAttribute()
      };
      /** Delete price break details */
      vm.deleteRecord = (item) => {
        if (item.id) {
          var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, "Operational Attribute", 1);
          let obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          let objIDs = {
            id: item.id,
            CountList: false,
          }
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.cgBusyLoading = ComponentFactory.deleteComponentAttributeMapping().query({ objIDs: objIDs }).$promise.then((res) => {
                if (res && res.data) {
                  vm.FocusAttribute();
                  vm.getPartDynamicAttributeDetails();
                }
              }).catch((error) => {
                return BaseService.getErrorLog(error);
              });
            }
          }, (cancel) => {
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
      };
      angular.element(() => {
        BaseService.currentPageForms.push(vm.partOperationalAttributeForm);
      });

      // focus on attribute
      vm.FocusAttribute = () => {
        vm.autoCompleteAttributes.focus = false;
        $timeout(() => {
          vm.autoCompleteAttributes.focus = true;
        })
      }

      vm.goToOperationalAttributes = () => {
        BaseService.openInNew(USER.ADMIN_PART_DYNAMIC_ATTRIBUTE_STATE, {});
      };

    }
  }
})();
