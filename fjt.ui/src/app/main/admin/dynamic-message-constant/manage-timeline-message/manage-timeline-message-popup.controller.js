(function () {
    'use strict';

    angular
        .module('app.admin.dynamicmessage')
        .controller('ManageTimelineMessagePopupController', ManageTimelineMessagePopupController);

    /** @ngInject */
    function ManageTimelineMessagePopupController($mdDialog, data, CORE, DialogFactory, BaseService, DynamicMessageFactory) {
        const vm = this;
        vm.isSubmit = false;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.isContainDynamicVariableTitle = false;
        vm.isContainDynamicVariableDesc = false;
        vm.manageDynamicMessage = {};
        vm.manageDynamicMessage = angular.copy(data);

        // get default dynamic message based on key and module 
        vm.getDefaultMessageByKeyAndModuelName = () => {
            if (vm.manageDynamicMessage.key && vm.manageDynamicMessage.primarykey) {
                let objMessageData = {
                    primarykey: vm.manageDynamicMessage.primarykey,
                    key: vm.manageDynamicMessage.key,
                    firstLevelPrimarykey: vm.manageDynamicMessage.firstLevelPrimarykey
                };

                return DynamicMessageFactory.getDefaultMessageForEmpTimelineMessage().query({
                    objMessageData: objMessageData
                }).$promise.then((message) => {
                    vm.manageDynamicMessage.defaultMessage = message.data;
                    if (vm.manageDynamicMessage.defaultMessage && vm.manageDynamicMessage.defaultMessage.title.includes("{0}")) {
                        vm.isContainDynamicVariableTitle = true;
                    }
                    if (vm.manageDynamicMessage.defaultMessage && vm.manageDynamicMessage.defaultMessage.description.includes("{0}")) {
                        vm.isContainDynamicVariableDesc = true;
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
        }

        // copy message to clipboard
        vm.copyTextToClipBoard = (event, copyMsgFor) => {
            var $temp = $("<input>");
            $("body").append($temp);
            if (copyMsgFor == "title") {
                $temp.val(vm.manageDynamicMessage.defaultMessage.title).select();
            }
            else if (copyMsgFor == "description") {
                $temp.val(vm.manageDynamicMessage.defaultMessage.description).select();
            }
            else {
                return;
            }
            document.execCommand("copy");
            $temp.remove();
            
            var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.DYNAMIC_MESSAGE_COPY_CLIPBOARD);
            messageContent.message = stringFormat(messageContent.message, "Default");
            var model = {
              messageContent: messageContent,              
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
        }

        vm.getDefaultMessageByKeyAndModuelName();

        // save dynamic message based on key and module combination
        vm.saveDynamicMessage = () => {
            vm.isSubmit = false;
            if (!vm.ManageDynamicMessageTimelineForm.$valid) {
                vm.isSubmit = true;
                BaseService.focusRequiredField(vm.ManageDynamicMessageTimelineForm);
                return;
            }

            if (vm.ManageDynamicMessageTimelineForm.$dirty || vm.isChange) {
                let oldCount = vm.manageDynamicMessage.defaultMessage.title.match(/{\d}/g);
                oldCount = oldCount ? oldCount : [];
                let newCount = vm.manageDynamicMessage.title.match(/{\d}/g);
                newCount = newCount ? newCount : [];
                if (vm.isContainDynamicVariableTitle && oldCount.length > 0 && oldCount.length != newCount.length) {
                   
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
        }

        // update message
        let updateDynamicMessage = () => {
            const objDynamicMessage = {
                primarykey: vm.manageDynamicMessage.primarykey,
                key: vm.manageDynamicMessage.key,
                keyValueList: [{ key: 'title', oldTitle: data.title, newTitle: vm.manageDynamicMessage.title },
                        { key: 'description', oldTitle: data.description, newTitle: vm.manageDynamicMessage.description }],
            }


            if (vm.manageDynamicMessage && vm.manageDynamicMessage.key) {
                vm.cgBusyLoading = DynamicMessageFactory.timelinedynamicmessages().update({
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
        }

        // on cancel popup
        vm.cancel = () => {
            let isdirty = vm.checkFormDirty(vm.ManageDynamicMessageTimelineForm);
            if (isdirty) {
                let data = {
                    form: vm.ManageDynamicMessageTimelineForm
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
        }
        /** Validate max size */
        vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
            return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
        };
        //on load submit form 
      angular.element(() => {
        //check load
        BaseService.currentPagePopupForm.push(vm.ManageDynamicMessageTimelineForm);
      });
    }
})();
