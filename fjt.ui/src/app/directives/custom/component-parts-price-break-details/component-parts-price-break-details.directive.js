(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('componentPriceBreak', componentPriceBreak);

  /** @ngInject */
  function componentPriceBreak(CORE, DialogFactory, USER, $filter, ComponentFactory, BaseService, $mdDialog, ComponentPriceBreakDetailsFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        partId: '=?',
        partCategory: '=?',
        isGoodPart: '=?',
        isCustom: '=?',
        isCpn: '=?',
        isReadOnly: '=?'
      },
      templateUrl: 'app/directives/custom/component-parts-price-break-details/component-parts-price-break-details.html',
      controller: componentPriceBreakDetailsCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function componentPriceBreakDetailsCtrl($scope, $element, $attrs) {
      var vm = this;
      vm.isReadOnly = $scope.isReadOnly;
      vm.componentpartId = $scope.partId ? parseInt($scope.partId) : null;
      vm.partCategoryId = $scope.partCategory ? $scope.partCategory : null;
      vm.isCustom = $scope.isCustom ? $scope.isCustom : null;
      vm.isCPN = $scope.isCpn ? $scope.isCpn : null;
      vm.PartCorrectList = CORE.PartCorrectList;
      vm.isInCorrectPart = $scope.isGoodPart === vm.PartCorrectList.IncorrectPart ? true : false;
      $scope.$watch('isGoodPart', (value) => {
        vm.isInCorrectPart = (value === vm.PartCorrectList.IncorrectPart ? true : false);
      });
      $scope.$watch('isCustom', (value) => {
        vm.isCustom = value;
      });
      $scope.$watch('isCpn', (value) => {
        vm.isCPN = value;
      });
      vm.Core_PartCategory = CORE.PartCategory;
      vm.COMPONENT_PRICE_BREAK_TOOLTIP = CORE.COMPONENT_PRICE_BREAK_TOOLTIP;
      const updatedOn = new Date();
      vm.pricebreakdetails = {
        id: null,
        priceBreak: null,
        unitPrice: null,
        updatedOn: updatedOn,
        mfgPNID: null
      };
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.LabelConstant = angular.copy(CORE.LabelConstant);
      vm.PartPriceBreakDetailsData;
      let curDate = $filter('date')(updatedOn, "MM-dd-yyyy");
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
      vm.getPartPriceBreakDetails = (ev) => {
        vm.hlSalesPriceMatrix = false;
        vm.cgBusyLoading = ComponentFactory.getPartPriceBreakDetails().query({ id: vm.componentpartId }).$promise.then((res) => {
          vm.hlSalesPriceMatrix = true;
          if (res && res.data) {
            vm.PartPriceBreakDetailsData = res.data;
          }
          var t = _dateDisplayFormat
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      vm.getPartPriceBreakDetails();

      /** Check unique price break validation */
      vm.CheckUniquePriceBreak = () => {
        isExits = _.some(vm.PartPriceBreakDetailsData, (existsItem) => {
          return vm.pricebreakdetails.priceBreak == existsItem.priceBreak
            && vm.pricebreakdetails.id != existsItem.id && curDate == existsItem.updatedOn;
        })
        return isExits;
      }

      /** Clear inputs */
      vm.Cancel = () => {
        vm.pricebreakdetails = {
          id: null,
          priceBreak: null,
          unitPrice: null,
          updatedOn: updatedOn,
          mfgPNID: null
        }
        vm.priceBreakForm.$setPristine();
        vm.priceBreakForm.$setUntouched();
        vm.IsDeleteDisable = false;
        vm.FocusPriceBreak();
      }

      /** Save/Update price break details */
      vm.SavePartPriceBreakDetails = () => {
        isExits = false;
        vm.pricebreakdetails.mfgPNID = vm.componentpartId;
        if (vm.pricebreakdetails.id != null) {
          isExits = vm.CheckUniquePriceBreak();
          if (isExits) {
            var model = {
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: CORE.MESSAGE_CONSTANT.UNIQUE_PRICE_BREAK,
              multiple: true
            };
            var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.UNIQUE_PRICE_BREAK);

            let alertModel = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(alertModel);
            return false;
          }

          var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.PRICE_BREAK_UPDATE_CONFIRMATION);
          messageContent.message = stringFormat(messageContent.message, vm.pricebreakdetails.priceBreak, vm.pricebreakdetails.unitPrice);
          let obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };

          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.cgBusyLoading = ComponentPriceBreakDetailsFactory.getComponentPriceBreakDetailsList()
                .update({
                  id: vm.pricebreakdetails.id,
                }, vm.pricebreakdetails).$promise.then((res) => {
                  if (res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                    vm.pricebreakdetails = {};
                    vm.getPartPriceBreakDetails();
                    vm.pricebreakdetails.id = null;
                    vm.pricebreakdetails.priceBreak = null;
                    vm.pricebreakdetails.unitPrice = null;
                    curDate = $filter('date')(updatedOn, _dateDisplayFormat);
                    vm.priceBreakForm.$setPristine();
                    vm.priceBreakForm.$setUntouched();
                    vm.IsDeleteDisable = false;
                    vm.FocusPriceBreak();
                  }
                  else if (res.status == CORE.ApiResponseTypeStatus.FAILED && res.data && res.data.ValidatioMesssage) {
                    var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.PRICE_BREAK_VALIDATION_MESSAGE);
                    messageContent.message = stringFormat(messageContent.message, vm.pricebreakdetails.priceBreak);
                    let alertModel = {
                      messageContent: messageContent,
                      multiple: true
                    };
                    return DialogFactory.messageAlertDialog(alertModel).then((yes) => {
                      if (yes) {
                        vm.FocusPriceBreak()
                      }
                    }, (cancel) => {

                    }).catch((error) => {
                      return BaseService.getErrorLog(error);
                    });
                    return;
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
        else {

          isExits = vm.CheckUniquePriceBreak();
          if (isExits) {
            vm.pricebreakdetails.id = null;
            var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.UNIQUE_PRICE_BREAK);
            let alertModel = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(alertModel);
            return false;
          }

          vm.pricebreakdetails.id = null;
          vm.pricebreakdetails.updatedOn = $filter('date')(updatedOn, "yyyy-MM-dd");
          vm.cgBusyLoading = ComponentPriceBreakDetailsFactory.getComponentPriceBreakDetailsList()
            .save(vm.pricebreakdetails).$promise.then((res) => {
              if (res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                vm.getPartPriceBreakDetails();
                vm.pricebreakdetails.id = null;
                vm.pricebreakdetails.priceBreak = null;
                vm.pricebreakdetails.unitPrice = null;
                vm.priceBreakForm.$setPristine();
                vm.priceBreakForm.$setUntouched();
                curDate = $filter('date')(updatedOn, "MM-dd-yyyy");
                vm.FocusPriceBreak();
              }
              else if (res.status == CORE.ApiResponseTypeStatus.FAILED && res.data && res.data.ValidatioMesssage) {
                var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.PRICE_BREAK_VALIDATION_MESSAGE);
                messageContent.message = stringFormat(messageContent.message, vm.pricebreakdetails.priceBreak);
                let alertModel = {
                  messageContent: messageContent,
                  multiple: true
                };
                return DialogFactory.messageAlertDialog(alertModel).then((yes) => {
                  if (yes) {
                    vm.FocusPriceBreak();
                  }
                }, (cancel) => {

                }).catch((error) => {
                  return BaseService.getErrorLog(error);
                });
                return;
              }

            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
        }
      }
      /** Edit price break details */
      vm.EditRecord = (item) => {
        vm.pricebreakdetails.id = item.id;
        vm.pricebreakdetails.mfgPNID = item.mfgPNID;
        vm.pricebreakdetails.priceBreak = item.priceBreak;
        vm.pricebreakdetails.unitPrice = item.unitPrice;
        vm.pricebreakdetails.updatedOn = $filter('date')(item.updatedOn, "yyyy-MM-dd");
        curDate = $filter('date')(item.updatedOn, "MM-dd-yyyy");
        vm.IsDeleteDisable = true;
        vm.FocusPriceBreak()
      };
      /** Delete price break details */
      vm.deleteRecord = (item) => {
        if (item.id) {
          var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, "Sales Price Break", 1);
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
              vm.cgBusyLoading = ComponentPriceBreakDetailsFactory.deletePriceBreakDetails().query({ objIDs: objIDs }).$promise.then((res) => {
                if (res && res.data) {
                  vm.FocusPriceBreak();
                  vm.getPartPriceBreakDetails();
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
        BaseService.currentPageForms.push(vm.priceBreakForm);
      });

      // focus on price break after save
      vm.FocusPriceBreak = () => {
        let element = document.getElementById('priceBreak');
        if (element)
          element.focus();
      }

      vm.goToPartPriceBreakDetails = () => {
        BaseService.openInNew(USER.ADMIN_COMPONENT_PRICE_BREAK_DETAILS_STATE, {});
      };
    }
  }
})();
