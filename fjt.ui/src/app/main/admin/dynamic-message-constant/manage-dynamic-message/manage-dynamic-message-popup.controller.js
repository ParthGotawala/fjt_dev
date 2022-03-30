(function () {
  'use strict';

  angular
    .module('app.admin.dynamicmessage')
    .controller('ManageDynamicmessagePopupController', ManageDynamicmessagePopupController);

  /** @ngInject */
  function ManageDynamicmessagePopupController($mdDialog, data, CORE, DialogFactory, BaseService, DynamicMessageFactory) {
    const vm = this;
    vm.isSubmit = false;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.isContainDynamicVariable = false;
    vm.manageDynamicMessage = {};
    vm.manageDynamicMessage = angular.copy(data);

    // get default dynamic message based on key and module 
    vm.getDefaultMessageByKeyAndModuelName = () => {
      if (vm.manageDynamicMessage.key && vm.manageDynamicMessage.moduleName) {
        let objMessageData = {
          key: vm.manageDynamicMessage.key,
          moduleName: vm.manageDynamicMessage.moduleName
        };

        return DynamicMessageFactory.getDefaultMessageByKeyAndModuelName().query({
          objMessageData: objMessageData
        }).$promise.then((message) => {
          vm.manageDynamicMessage.defaultMessage = message.data.value;
          if (vm.manageDynamicMessage.defaultMessage && vm.manageDynamicMessage.defaultMessage.includes("{0}")) {
            vm.isContainDynamicVariable = true;
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    };

    // copy message to clipboard
    vm.copyTextToClipBoard = (event) => {
      var $temp = $("<input>");
      $("body").append($temp);
      $temp.val(vm.manageDynamicMessage.defaultMessage).select();
      document.execCommand("copy");
      $temp.remove();

      var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.DYNAMIC_MESSAGE_COPY_CLIPBOARD);
      messageContent.message = stringFormat(messageContent.message, "Default");
      var model = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(model);
    };

    vm.getDefaultMessageByKeyAndModuelName();
    // save dynamic message based on key and module combination
    vm.saveDynamicMessage = () => {
      vm.isSubmit = false;
      if (!vm.ManageDynamicMessageForm.$valid) {
        vm.isSubmit = true;
        BaseService.focusRequiredField(vm.ManageDynamicMessageForm);
        return;
      }

      if (vm.ManageDynamicMessageForm.$dirty || vm.isChange) {
        let oldCount = vm.manageDynamicMessage.defaultMessage.match(/{\d}/g);
        oldCount = oldCount ? oldCount : [];
        let newCount = vm.manageDynamicMessage.value.match(/{\d}/g);
        newCount = newCount ? newCount : [];
        if (vm.isContainDynamicVariable && oldCount.length > 0 && oldCount.length != newCount.length) {
          var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.DYNAMIC_MESSAGE_UPDATE_PLACEHOLDER);
          let obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes)
              updateDynamicMessage();
          }, (error) => {
            return BaseService.getErrorLog(error);
          });
        } else {
          updateDynamicMessage();
        }
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    // update message
    let updateDynamicMessage = () => {
      const objDynamicMessage = {
        oldValue: data.value,
        key: vm.manageDynamicMessage.key,
        value: vm.manageDynamicMessage.value,
        moduleName: vm.manageDynamicMessage.moduleName
      };

      if (vm.manageDynamicMessage && vm.manageDynamicMessage.key) {
        vm.cgBusyLoading = DynamicMessageFactory.dynamicmessage().update({
        }, objDynamicMessage).$promise.then((res) => {
          if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
            //CORE.MESSAGE_CONSTANT = res.data.dynamicMessageList;
            BaseService.currentPagePopupForm.pop();
            $mdDialog.hide();
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    };

    // on cancel popup
    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.ManageDynamicMessageForm);
      if (isdirty) {
        let data = {
          form: vm.ManageDynamicMessageForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    // check for form dirty
    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    /** Validate max size */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    };
    //on load submit form 
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.ManageDynamicMessageForm);
    });
  }
})();
