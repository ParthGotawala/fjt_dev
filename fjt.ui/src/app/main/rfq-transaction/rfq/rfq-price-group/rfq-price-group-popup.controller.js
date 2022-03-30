(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('RFQPriceGroupController', RFQPriceGroupController);

  /** @ngInject */
  function RFQPriceGroupController($mdDialog, RFQFactory, CORE, RFQTRANSACTION, data, BaseService, DialogFactory) {
    const vm = this;

    vm.rfq = angular.copy(data.rfq);
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.unitOfTime = RFQTRANSACTION.RFQ_TURN_TYPE;
    const pgIndex = data.pgIndex;
    vm.headerData = [];
    vm.headerData = [{
      label: vm.LabelConstant.Assembly.QuoteGroup,
      value: vm.rfq.id
    }];
    vm.rfqPriceGroup = {
      id: null,
      name: null,
      refRFQID: vm.rfq.id,
      rfqPriceGroupDetail: []
    };
    if (data.rfqPriceGroup) {
      vm.rfqPriceGroup = angular.copy(data.rfqPriceGroup);
    }
    _.each(vm.rfq.rfqAssembly, (objrfqAssy) => {
      if (objrfqAssy.id) {
        const objPricceGroupDetail = _.find(vm.rfqPriceGroup.rfqPriceGroupDetail, (x) => x.rfqAssyID === objrfqAssy.id);
        if (!objPricceGroupDetail) {
          const priceGroupAssyObj = {
            rfqPriceGroupID: vm.rfqPriceGroup.id,
            refRFQID: vm.rfq.id,
            rfqAssyID: objrfqAssy.id,
            partID: objrfqAssy.partID,
            PIDCode: objrfqAssy.PIDCode,
            RoHSIcon: objrfqAssy.RoHSIcon,
            rohsName: objrfqAssy.rohsName,
            custAssyPN: objrfqAssy.custAssyPN,
            isCustom: objrfqAssy.isCustom,
            mfgPN: objrfqAssy.mfgPN,
            unitOfTime: vm.unitOfTime.BUSINESS_DAY.VALUE
          };
          vm.rfqPriceGroup.rfqPriceGroupDetail.push(priceGroupAssyObj);
        }
      }
    });

    vm.save = () => {
      if (BaseService.focusRequiredField(vm.RFQPriceGroupForm)) {
        return;
      }
      if (validatePriceGroup()) {
        return;
      }
      BaseService.currentPagePopupForm = [];
      vm.RFQPriceGroupForm.$setPristine();
      $mdDialog.hide(vm.rfqPriceGroup);
    };
    vm.CheckDuplicateGroupName = () => {
      if (vm.rfqPriceGroup.name) {
        const findDuplicatePriceGroup = _.find(vm.rfq.rfqPriceGroup, (objPriceGroup, index) => {
          if (!objPriceGroup.id && !vm.rfqPriceGroup.id && index !== pgIndex) {
            return objPriceGroup.name.trim() === vm.rfqPriceGroup.name.trim();
          } else {
            return objPriceGroup.id !== vm.rfqPriceGroup.id && objPriceGroup.name.trim() === vm.rfqPriceGroup.name.trim();
          }
        });
        if (findDuplicatePriceGroup) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
          messageContent.message = stringFormat(messageContent.message, 'Price group');
          const alertModel = {
            messageContent: messageContent
          };
          return DialogFactory.messageAlertDialog(alertModel).then(() => {
            setFocus('name');
            vm.rfqPriceGroup.name = null;
          });
        }
        else {
          const findDeletedDuplicatePriceGroup = _.find(vm.rfq.deletedrfqPriceGroup, (objPriceGroup) => objPriceGroup.name.trim() === vm.rfqPriceGroup.name.trim());
          if (!findDeletedDuplicatePriceGroup) {
            const obj = {
              id: vm.rfqPriceGroup.id || null,
              name: vm.rfqPriceGroup.name,
              refRFQID: vm.rfq.id
            };
            vm.cgBusyLoading = RFQFactory.findSamePriceGroup().save(obj).$promise.then((res) => {
              if (res && res.status === CORE.ApiResponseTypeStatus.FAILED) {
                if (checkResponseHasCallBackFunctionPromise(res)) {
                  res.alretCallbackFn.then(() => {
                    setFocus('name');
                  });
                }
                vm.rfqPriceGroup.name = null;
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      }
    };
    function validatePriceGroup() {
      const similarPriceGroup = [];
      _.each(vm.rfq.rfqPriceGroup, (priceGroupObj) => {
        if (!vm.rfqPriceGroup.id || vm.rfqPriceGroup.id !== priceGroupObj.id) {
          if (((!vm.rfqPriceGroup.id && !priceGroupObj.id) && vm.rfqPriceGroup.name !== priceGroupObj.name) || ((!vm.rfqPriceGroup.id && priceGroupObj.id) || vm.rfqPriceGroup.id !== priceGroupObj.id)) {
            let count = 0;
            _.each(priceGroupObj.rfqPriceGroupDetail, (priceGroupDetailObj) => {
              const currPriceGroupDetailObj = _.find(vm.rfqPriceGroup.rfqPriceGroupDetail, (x) => x.rfqAssyID === priceGroupDetailObj.rfqAssyID);
              if (currPriceGroupDetailObj.qty === priceGroupDetailObj.qty) {
                count++;
              }
            });
            if (_.isArray(priceGroupObj.rfqPriceGroupDetail) && count === priceGroupObj.rfqPriceGroupDetail.length && priceGroupObj.rfqPriceGroupDetail.length > 0) {
              similarPriceGroup.push(priceGroupObj);
            }
          }
        }
      });
      if (similarPriceGroup.length > 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.SIMILAR_PRICE_GROUP_EXISTS);
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
        return similarPriceGroup;
      } else {
        return false;
      }
    }
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.removePriceGroupValue = (item) => {
      item.qty = null;
      item.turnTime = null;
      vm.RFQPriceGroupForm.$setDirty();
    };
    // close pop up
    vm.cancel = () => {
      const isdirty = vm.RFQPriceGroupForm.$dirty;
      if (isdirty) {
        const data = {
          form: vm.RFQPriceGroupForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm = [];
        vm.RFQPriceGroupForm.$setPristine();
        $mdDialog.cancel(data.rfqAssyMiscBuild);
      }
    };
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.RFQPriceGroupForm);
    });
  }
})();
