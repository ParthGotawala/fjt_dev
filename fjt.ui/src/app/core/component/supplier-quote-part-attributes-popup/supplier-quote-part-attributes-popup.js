(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('SupplierQuotePartAttributesPopupController', SupplierQuotePartAttributesPopupController);

  /** @ngInject */
  function SupplierQuotePartAttributesPopupController(data, SupplierQuoteFactory, CORE, $mdDialog, DialogFactory, USER, $filter, BaseService) {
    const vm = this;
    vm.costingType = data.costingType;
    const selectedAttributes = data.selectedAttributes;
    vm.isFromUpdate = data.isFromUpdate;
    vm.view = false;
    vm.isHideDelete = true;
    vm.type = CORE.PaymentMode;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.SUPPLIER_QUOTE_DYNAMIC_FIELDS;
    vm.StatusGridHeaderDropdown = CORE.StatusGridHeaderDropdown;
    vm.DisplayMarginStatusGridHeaderDropdown = CORE.DisplayMarginStatusGridHeaderDropdown;
    vm.CostingTypeStatusGridHeaderDropdown = CORE.CostingTypeStatusGridHeaderDropdown;
    vm.isEditIntigrate = false;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.selectedAttributeList = [];


    vm.getQuoteAttribute = () => {
      vm.cgBusyLoading = SupplierQuoteFactory.retrieveSupplierQuoteAttributes().query().$promise.then((quoteDynamicFields) => {
        if (quoteDynamicFields.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          //  vm.QuoteAttributeList = quoteDynamicFields.data;
          vm.QuoteAttributeList = _.filter(quoteDynamicFields.data, (objAttribute) => {
            const objCostdata = _.find(selectedAttributes, (a) => a.id === objAttribute.id);
            const isAlreadySelected = _.find(vm.QuoteAttributeList, (item) => item.id === objAttribute.id && item.selected === true);
            if (objCostdata) {
              objAttribute.isFromUpdate = objCostdata.supplierQuotePartDetID ? true : false;
              objAttribute.isPricingDone = objCostdata.isPricingDone ? true : false;
              objAttribute.selected = true;
              vm.selectedAttributeList.push(objCostdata);
            }
            else {
              if (isAlreadySelected) {
                objAttribute.selected = true;
              } else {
                objAttribute.selected = false;
              }
            }
            return true;
          });
          const isAllOpSelected = !_.some(vm.QuoteAttributeList, (item) => item.selected === false);
          vm.SelectAllOp = isAllOpSelected;

          if (data.supplierQuotePartDetailID) {
            vm.cgBusyLoading = SupplierQuoteFactory.checkSupplierQuotePartDetailLinePricingAttributes().query({ id: data.supplierQuotePartDetailID }).$promise.then((response) => {
              if (response && response.data) {
                _.map(vm.QuoteAttributeList, (item) => {
                  const isExist = _.find(response.data, { attributeID: item.id });
                  if (isExist) {
                    item.isPricingDone = true;
                  }
                });
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getQuoteAttribute();


    vm.SelectAllOpFn = () => {
      const isAllOpSelected = !_.some(vm.QuoteAttributeList, (item) => item.selected === false);
      vm.SelectAllOp = isAllOpSelected ? true : false;
    };


    vm.AddToSelectedAttribute = (attribute) => {
      if (attribute.isPricingDone) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PRICING_ADDED_FOR_ATTRIBUTE);
        messageContent.message = stringFormat(messageContent.message, attribute.fieldName);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            attribute.selected = true;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.selectedAttributeList = $filter('filter')(vm.QuoteAttributeList, { selected: true });
        const isAllOpSelected = !_.some(vm.QuoteAttributeList, (item) => item.selected === false);
        vm.SelectAllOp = isAllOpSelected ? true : false;
      }
    };

    //add functionality for select/deselect all operation.
    vm.SelectAllAttribute = () => {
      vm.SelectAllOp = !vm.SelectAllOp;
      _.each(vm.QuoteAttributeList, (em) => {
        if (vm.SelectAllOp) {
          em.selected = true;
        } else {
          if (!em.isPricingDone) {
            em.selected = false;
          }
        }
      });
      vm.selectedAttributeList = $filter('filter')(vm.QuoteAttributeList, { selected: true });
    };

    vm.save = () => {
      if (vm.isFromUpdate) {
        _.map(vm.QuoteAttributeList, (objquote) => {
          if (!objquote.selected) {
            if (objquote.isFromUpdate) {
              objquote.isDelete = true;
            }
          } else {
            if (!objquote.isFromUpdate) {
              objquote.isCreate = true;
            }
          }
        });
      }
      const deleteditem = _.filter(vm.QuoteAttributeList, (objquote) => {
        if (!objquote.selected) {
          const iscostsummaryobj = _.find(selectedAttributes, (a) => a.id === objquote.id);
          if (iscostsummaryobj) {
            return true;
          }
        }
      });
      if (deleteditem.length > 0) {
        const deleted = _.map(deleteditem, (x) => x.fieldName).join();
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.DELETE_QUOTE_ATTRIBUTE_MSG);
        messageContent.message = stringFormat(messageContent.message, deleted);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_CONFIRM_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        return DialogFactory.messageConfirmDialog(obj).then(() => {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.hide(vm.QuoteAttributeList);
        }, () => {
            _.each(vm.QuoteAttributeList, (objAttribute) => {
            const objAttributeData = _.find(deleteditem, (a) => a.id === objAttribute.id);
            if (objAttributeData) {
              objAttribute.selected = true;
            }
          });
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.hide(vm.QuoteAttributeList);
      }
    };

    vm.addQuoteAttribute = (ev) => {
      const data = { quoteAttributeType: CORE.QUOTE_DB_ATTRIBUTE_TYPE.SUPPLIER };
      DialogFactory.dialogService(
        CORE.MANAGE_QUOTE_DYNAMIC_FIELDS_MODAL_CONTROLLER,
        CORE.MANAGE_QUOTE_DYNAMIC_FIELDS_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (data) => {
          if (data) {
            vm.getQuoteAttribute();
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.GoToQuoteAttributelist = () => {
      BaseService.openInNew(USER.ADMIN_SUPPLIER_DYNAMIC_FIELDS_STATE, { type: CORE.QUOTE_DB_ATTRIBUTE_TYPE.SUPPLIER });
    };

    vm.cancel = () => {
      if (vm.supplierQuoteAttributesForm.$dirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.supplierQuoteAttributesForm);
    });
  }
})();
