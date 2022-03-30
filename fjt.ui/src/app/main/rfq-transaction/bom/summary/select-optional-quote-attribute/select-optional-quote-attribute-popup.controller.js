(function () {
    'use strict';

    angular
      .module('app.rfqtransaction')
      .controller('SelectOptionalQuoteAttributePopupController', SelectOptionalQuoteAttributePopupController);

    /** @ngInject */
    function SelectOptionalQuoteAttributePopupController($scope, $q, $state, data, $timeout, RFQSettingFactory, BOMFactory, RFQTRANSACTION, CORE, $mdDialog, DialogFactory, USER, $filter, $window, BaseService) {
        const vm = this;
        vm.CostingType = data.CostingType;
        let costingSummaryData = data.costingSummaryData;
        vm.view = false;
        vm.isHideDelete = true;
        vm.type = CORE.PaymentMode;
        vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.QUOTE_DYNAMIC_FIELDS;
        vm.StatusGridHeaderDropdown = CORE.StatusGridHeaderDropdown;
        vm.DisplayMarginStatusGridHeaderDropdown = CORE.DisplayMarginStatusGridHeaderDropdown;
        vm.CostingTypeStatusGridHeaderDropdown = CORE.CostingTypeStatusGridHeaderDropdown;
        vm.isEditIntigrate = false;
        vm.DefaultDateFormat = _dateTimeDisplayFormat;
        vm.selectedAttributeList = [];
        vm.headerdata = [];
        vm.headerdata.push({
            label: "Costing Type",
            value: vm.CostingType
        })
        /* retrieve Users list*/
        vm.getQuoteAttribute = () => {
            vm.cgBusyLoading = RFQSettingFactory.retriveQuoteDynamicFieldsListByCostingType({ CostingType: vm.CostingType }).query().$promise.then((quoteDynamicFields) => {
                if (quoteDynamicFields.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                    vm.QuoteAttributeList = quoteDynamicFields.data;
                    vm.QuoteAttributeList = _.filter(vm.QuoteAttributeList, (objAttribute) => {
                        let objCostdata = _.find(data.costingSummaryData, a=>a.quoteChargeDynamicFieldID == objAttribute.id);
                        if (objCostdata) {
                            objAttribute.selected = true;
                            vm.selectedAttributeList.push(objCostdata);
                        }
                        else
                            objAttribute.selected = false;

                        return true;
                    })
                    let isAllOpSelected = !_.some(vm.QuoteAttributeList, function (item) { return item.selected == false; })
                    vm.SelectAllOp = isAllOpSelected;
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        vm.getQuoteAttribute();
        vm.SelectAllOpFn = () => {
            let isAllOpSelected = !_.some(vm.QuoteAttributeList, function (item) { return item.selected == false; })
            vm.SelectAllOp = isAllOpSelected ? true : false;
        }


        vm.AddToSelectedAttribute = (attribute) => {

            vm.selectedAttributeList = $filter('filter')(vm.QuoteAttributeList, { selected: true });
            let isAllOpSelected = !_.some(vm.QuoteAttributeList, function (item) { return item.selected == false; })
            vm.SelectAllOp = isAllOpSelected ? true : false;
            //$scope.selectedOperationList = _.filter(vm.OperationList, (item) => { return item.selected == true; })
        }

        //add functionality for select/deselect all operation.
        vm.SelectAllAttribute = (ev) => {
            vm.SelectAllOp = !vm.SelectAllOp;
            _.each(vm.QuoteAttributeList, (em) => {
                if (vm.SelectAllOp) {
                    em.selected = true;
                } else {
                    em.selected = false;
                }
            });
            vm.selectedAttributeList = $filter('filter')(vm.QuoteAttributeList, { selected: true });
        }

      vm.save = (event) => {
            let deleteditem = _.filter(vm.QuoteAttributeList, (objquote) => {
                if (!objquote.selected) {
                    let iscostsummaryobj = _.find(costingSummaryData, x=>x.quoteChargeDynamicFieldID == objquote.id);
                    if (iscostsummaryobj)
                        return true;
                }
            });
            if (deleteditem.length > 0) {
                deleteditem = _.map(deleteditem, x=>x.fieldName).join();
                let obj = {
                    title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
                    textContent: stringFormat(RFQTRANSACTION.SUMMARY_MESSAGE.DELETE_QUOTE_ATTRIBUTE_MSG, deleteditem),
                    btnText: CORE.MESSAGE_CONSTANT.BUTTON_CONFIRM_TEXT,
                    canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                return DialogFactory.confirmDiolog(obj).then(() => {
                    if (!vm.SelectAllAttribute || vm.SelectAllAttribute.length == 0) {
                        let alertModel = {
                            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                            textContent: stringFormat(CORE.MESSAGE_CONSTANT.SELECT_ONE, "Attribute"),
                            multiple: true
                        };
                        DialogFactory.alertDialog(alertModel);
                        return;
                    } else {
                        vm.refAttributeMapping();
                        $mdDialog.hide(vm.QuoteAttributeList);
                        return;
                    }
                }, (cancel) => {
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            } else {
                if (!vm.SelectAllAttribute || vm.SelectAllAttribute.length == 0) {
                    let alertModel = {
                        title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                        textContent: stringFormat(CORE.MESSAGE_CONSTANT.SELECT_ONE, "Attribute"),
                        multiple: true
                    };
                    DialogFactory.alertDialog(alertModel);
                    return;
                } else {
                    vm.refAttributeMapping();
                    $mdDialog.hide(vm.QuoteAttributeList);
                    return;
                }
            }

      }

      vm.refAttributeMapping = () => {
        _.each(vm.QuoteAttributeList, (attribute) => {
          if (attribute.selected) {
            vm.refAttributeSelection(attribute);
          }
        })
      }

      vm.refAttributeSelection = (attribute) => {
        if (attribute.isIncludeInOtherAttribute && attribute.refAttributeID) {
          let refAttribute = _.find(vm.QuoteAttributeList, { id: attribute.refAttributeID });
          if (refAttribute) {
            refAttribute.selected = true;
            if (refAttribute.isIncludeInOtherAttribute && refAttribute.refAttributeID) {
              vm.refAttributeSelection(refAttribute);
            }
            else {
              return true;
            }
          }
        }
      }

        vm.addQuoteAttribute = (ev) => {
            var data = {
              costingCategory: vm.CostingType,
              quoteAttributeType: "R"
            };
            DialogFactory.dialogService(
           CORE.MANAGE_QUOTE_DYNAMIC_FIELDS_MODAL_CONTROLLER,
           CORE.MANAGE_QUOTE_DYNAMIC_FIELDS_MODAL_VIEW,
           ev,
           data).then(() => {
           }, (data) => {
               vm.getQuoteAttribute();
           }, (err) => {
           });
        }
        vm.GoToQuoteAttributelist = () => {
            BaseService.goToQuoteAttributeList();
        }
        vm.cancel = () => {
            $mdDialog.cancel();
        };
    }

})();
