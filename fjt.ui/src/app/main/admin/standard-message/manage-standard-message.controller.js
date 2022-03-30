(function () {
    'use strict';

    angular.module('app.admin.standardmessage')
        .controller('ManageStandardMessageController', ManageStandardMessageController);

    /** @ngInject */
    function ManageStandardMessageController($state, $q, $stateParams, $timeout, USER, CORE, StandardMessageFactory,
        GenericCategoryFactory, DataElementTransactionValueFactory, DialogFactory, $filter, BaseService, $mdDialog, $scope) {
        const vm = this;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.isSubmit = false;
        vm.standardMessage = {};
        vm.standardMessage.standardMessageID = $stateParams.id;
        /* Text angular tool */
        /* Message Object */
        const standardMessage = {
            standardMessageTxt: null,
            workAreaID: null,
            isActive: true,
        };
        vm.WorkArea = CORE.CategoryType.WorkArea;

        let GenericCategoryAllData = [];
        
        /* Get Responsibilities list */
        let getWorkAreaList = () => {
            let GencCategoryType = [];
            GencCategoryType.push(vm.WorkArea.Name);
            let listObj = {
                GencCategoryType: GencCategoryType,
                isActive: vm.standardMessage.standardMessageID ? true : false
            }
            return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((genericCategories) => {
                GenericCategoryAllData = genericCategories.data;
                vm.WorkAreaList = _.filter(GenericCategoryAllData, (item) => {
                    return item.parentGencCategoryID == null && item.categoryType == vm.WorkArea.Name;
                });
                return $q.resolve(vm.WorkAreaList);
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }
        let standardMessageDetail = () => {
            /* Get Standard Message details */
            if (vm.standardMessage.standardMessageID) {
                return StandardMessageFactory.standardmessage().query({ id: vm.standardMessage.standardMessageID }).$promise.then((response) => {
                    vm.standardMessage = angular.copy(response.data);
                    // getWorkAreaList();
                    $timeout(() => {
                        if (vm.standardMessage.standardMessageID && vm.standardMessageDetailForm) {
                            BaseService.checkFormValid(vm.standardMessageDetailForm, false);
                        }
                    }, 0);
                    return $q.resolve(vm.standardMessage);
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
            else {
                vm.standardMessage = Object.assign({}, standardMessage);
                // getWorkAreaList();
            }
        }
        var autocompletePromise = [getWorkAreaList(), standardMessageDetail()];
        vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
            initAutoComplete();
        }).catch((error) => {
            return BaseService.getErrorLog(error);
        });

        let initAutoComplete = () => {
            vm.autoCompleteWorkAreaDetail = {
                columnName: 'gencCategoryName',
                controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
                viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
                keyColumnName: 'gencCategoryID',
                keyColumnId: vm.standardMessage.workAreaID ? vm.standardMessage.workAreaID : 0,
                inputName:vm.WorkArea.Name,
                placeholderName: vm.WorkArea.Title,
                addData: { headerTitle: vm.WorkArea.Title },
                isRequired: true,
                isAddnew: true,
                callbackFn: getWorkAreaList
            }
        }
        /* Save Standard Message details */
        vm.saveStandardMessage = () => {
            
            vm.isSubmit = false;
            if (!vm.standardMessageDetailForm.$valid) {
                BaseService.focusRequiredField(vm.standardMessageDetailForm);
                vm.isSubmit = true;
                return;
            }
            vm.standardMessage.workAreaID = vm.autoCompleteWorkAreaDetail.keyColumnId ? vm.autoCompleteWorkAreaDetail.keyColumnId : 0;
            if (vm.standardMessage.standardMessageID && vm.standardMessage.standardMessageID > 0) {
                vm.cgBusyLoading = StandardMessageFactory.standardmessage().update({
                    id: vm.standardMessage.standardMessageID,
                }, vm.standardMessage).$promise.then(() => {
                    vm.standardMessageDetailForm.$setPristine();
                    BaseService.currentPageForms = [];
                    $state.go(USER.STANDARDMESSAGE_STATE);
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
            else {
                vm.cgBusyLoading = StandardMessageFactory.standardmessage().save(vm.standardMessage).$promise.then((res) => {
                    if (res.data.standardMessageID) {
                        vm.standardMessage.standardMessageID = res.data.standardMessageID;
                        vm.standardMessageDetailForm.$setPristine();
                        BaseService.currentPageForms = [];
                        $state.go(USER.STANDARDMESSAGE_STATE);
                    }
                    
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
        };
        //Set as current form when page loaded
      angular.element(() => {
        BaseService.currentPageForms = [vm.standardMessageDetailForm];
      });

        /* go to back standard message list page */
        vm.goBack = () => {
            if (vm.standardMessageDetailForm.$dirty) {
                showWithoutSavingAlertforBackButton();
            } else {
                $state.go(USER.STANDARDMESSAGE_STATE);
            }
        };
        function showWithoutSavingAlertforBackButton() {
            let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);

            let obj = {
                messageContent: messageContent ,
                btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
                canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes) {
                    BaseService.currentPageForms = [];
                    $state.go(USER.STANDARDMESSAGE_STATE);
                }
            }, (error) => {
                return BaseService.getErrorLog(error);
            });
        }

        /*check Unique Message*/
        vm.checkUniqueMessage = () => {
            if (vm.standardMessage.standardMessageTxt) {
                let objs = {
                    standardMessageTxt: vm.standardMessage.standardMessageTxt,
                    standardMessageID: vm.standardMessage.standardMessageID ? vm.standardMessage.standardMessageID : 0
                };
                vm.cgBusyLoading = StandardMessageFactory.checkUniqueForMessage().query({ objs: objs }).$promise.then((res) => {
                    vm.cgBusyLoading = false;
                    if (res && res.status != CORE.ApiResponseTypeStatus.SUCCESS) {                       
                        
                        vm.standardMessage.standardMessageTxt = null;
                        if (checkResponseHasCallBackFunctionPromise(res)) {
                          res.alretCallbackFn.then(() => {
                            setFocus("standardMessageTxt");
                          });
                        }                                
                        
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
        }

        


        /* called for max length validation */
        vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
            return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
        }

        //redirect to Responsibility master
        vm.goToResponsibilityList = () => {
            BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_WORKAREA_STATE, {});
        }

        //close popup on page destroy 
        $scope.$on('$destroy', function () {
            $mdDialog.hide(false, { closeAll: true });
        });
    }
})();
