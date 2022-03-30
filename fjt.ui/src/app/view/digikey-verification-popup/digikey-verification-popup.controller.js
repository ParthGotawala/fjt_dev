(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('DigikeyVerificationPopupController', DigikeyVerificationPopupController);

  /** @ngInject */
  function DigikeyVerificationPopupController($mdDialog,
    PRICING, CORE,
    PricingFactory, data, BaseService, DialogFactory) {
    const vm = this;
    vm.pricingAPI = PRICING.DigikeyPartApi;
    vm.digiKeyObj = PRICING.DigiKey;
    vm.msStepperCtrl = {};
    vm.isNewVersion = data.isNewVersion;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.cancel = () => {
      $mdDialog.cancel();
    };
    // On click of link of digikey open link in new window
    vm.NextAndGoToDigikey = () => {
      //vm.msStepperCtrl.gotoNextStep();
      BaseService.openURLInNew(vm.keyURL);
    };
    const initForm = () => {
      // Reset the form model
      vm.verificationSteps = {
        step1: {},
        step2: {},
        step3: {}
      };
    };
    //get digikey client id
    const getDigikeyClientID = () => {
      if (data && data.appID) {
        vm.cgBusyLoading = PricingFactory.getDigikeyExternalCardential().query({ appID: data.appID }).$promise.then((token) => {
          vm.digikey = token.data;
          if (data.isNewVersion) {
            vm.keyURL = stringFormat(vm.digiKeyObj.KeyURLV3, vm.digikey.clientID, vm.digikey.redirectUrl);
          }
          else {
            vm.keyURL = stringFormat(vm.digiKeyObj.KeyURL, vm.digiKeyObj.ResponseType, vm.digikey.clientID, vm.digikey.redirectUrl);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    getDigikeyClientID();
    /**
     * Submit Digikey Code and Get Tokens and Update in configurration tables
     * @param event
     */
    vm.getAndUpdateTokens = () => {
      if (!vm.verificationSteps.step3.digikeyURL) {
        BaseService.focusRequiredField(vm.verificationSteps);
        return;
      }
      const url = vm.verificationSteps.step3.digikeyURL;
      const strArray = url.split('code=');
      if (!strArray || strArray.length < 2) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INVALID_DYNAMIC);
        messageContent.message = stringFormat(messageContent.message, 'URL');
        const model = {
          multiple: true,
          messageContent: messageContent
        };
        return DialogFactory.messageAlertDialog(model).then(() => {
          setFocus('digikeyURL');
        });
      }
      let accessCode = '';
      if (!data.isNewVersion) {
        accessCode = strArray[1];
      }
      else {
        const code = strArray[1].split('&');
        accessCode = code[0];
      }
      if (accessCode) {
        const settings = {
          code: accessCode,
          id: vm.digikey.id,
          isNewVersion: data.isNewVersion ? true : false
        };
        vm.cgBusyLoading = PricingFactory.getAndUpdateAccessTokenExternalDK().query({ setting: settings }).$promise.then((token) => {
          if (token.status === 'FAILED') {
            vm.verificationSteps.step3.digikeyURL = '';
            initForm();
          }
          else {
            $mdDialog.hide();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    //get max length validartion
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    // initialize all forms
    initForm();
  }
})();
