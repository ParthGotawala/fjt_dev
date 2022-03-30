(function () {
    'use strict';

    angular.module('app.admin.page')
        .controller('ManagePageDetailController', ManagePageDetailController);

    /** @ngInject */
    function ManagePageDetailController($state, $mdDialog, $scope, $q, $stateParams, $timeout, USER, CORE, PageDetailFactory,
        GenericCategoryFactory, DataElementTransactionValueFactory, DialogFactory, $filter, BaseService) {
        const vm = this;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.isSubmit = false;
        vm.pageDetail = {};
        vm.pageID = $stateParams.pageID ? $stateParams.pageID : null;
        vm.selectedParentpage = false;
        vm.isDisablePageDetails = _configIsDisablePageDetails;
        vm.UserId = BaseService.loginUser.userid;
        /* Text angular tool */
        /* Message Object */
        const pageDetail = {
            pageName: null,
            RO: false,
            RW: false,
            pageRoute: null,
            menuRoute: null,
            pageURL: null,
            menuName: null,
            parentPageRoute: null,
            parentPageID: null,
            hasChild: false,
            orderBy: null,
            tabLevel: null,
            iconClass: null,
            isActive: true,
            keywords: [],
            isAllowAsHomePage: false,
            deletedKeywords : []
        };
        vm.deletedKeywords = [];
        let page_Detail = () => {
            /* Get Page details */
            if (vm.pageID) {
                return PageDetailFactory.pageDetail().query({ pageID: vm.pageID }).$promise.then((response) => {
                    vm.pageDetail = angular.copy(response.data);
                    vm.pageDetail.keywords = response.data.pageDetailsKeywords && response.data.pageDetailsKeywords.length > 0 ? response.data.pageDetailsKeywords : [];
                    vm.pageDetail.Oldkeywords = angular.copy(response.data.pageDetailsKeywords && response.data.pageDetailsKeywords.length > 0 ? response.data.pageDetailsKeywords : []);
                    $timeout(() => {
                        if (vm.pageID && vm.pageDetailForm) {
                            BaseService.checkFormValid(vm.pageDetailForm, false);
                        }
                    }, 0);
                    return $q.resolve(vm.pageDetail);
                }).catch((err) => {

                });
            }
            else {
                vm.pageDetail = Object.assign({}, pageDetail);
            }
        }

        //get defect category list auto complete
        let getParentPageDetails = (insertedDataFromPopup) => {
            return PageDetailFactory.getParentPageDetails().query().$promise.then((parentPageDetail) => {
                vm.parentPageDetailList = parentPageDetail.data;

                return vm.parentPageDetailList;
            }).catch((err) => {
            });
        }
        //vm.parentPageDetailList = getParentPageDetails();
        var autocompletePromise = [getParentPageDetails(), page_Detail()];
        vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
            initAutoComplete();
        });
        let initAutoComplete = () => {
            vm.autoCompleteParentPage = {
                columnName: 'pageName',
                keyColumnName: 'pageID',
                keyColumnId: vm.pageDetail.parentPageID ? vm.pageDetail.parentPageID : null,
                inputName: 'Parent Page',
                placeholderName: 'Parent Page',
                isRequired: false,
                isAddnew: false,
                callbackFn: getParentPageDetails,
                onSelectCallbackFn: vm.bindDependentData
            }

            vm.autoCompleteParentTab = {
                columnName: 'pageName',
                keyColumnName: 'pageID',
                keyColumnId: vm.pageDetail.parentTabID ? vm.pageDetail.parentTabID : null,
                inputName: 'Parent Tab',
                placeholderName: 'Parent Tab',
                isRequired: false,
                isAddnew: false,
                callbackFn: getParentPageDetails
            }
        }
        vm.bindDependentData = (item) => {
           
        };
        /* Save Page details */
        vm.savePageDetail = () => {
            vm.isSubmit = false;
            // Used to focus on first error filed of form
            if (!vm.pageDetailForm.$valid) {
                BaseService.focusRequiredField(vm.pageDetailForm);
                vm.isSubmit = true;
                return;
            }
            //if (vm.pageDetailForm.$dirty) {
            let pageObj = {
                pageName: vm.pageDetail.pageName,
                RO: vm.pageDetail.RO ? vm.pageDetail.RO : false,
                RW: vm.pageDetail.RW ? vm.pageDetail.RW : false,
                menuRoute: vm.pageDetail.menuRoute,
                pageRoute: vm.pageDetail.pageRoute,
                pageURL: vm.pageDetail.pageURL,
                menuName: vm.pageDetail.menuName,
                //parentPageRoute: vm.pageDetail.parentPageRoute ? vm.pageDetail.parentPageRoute : null,
                parentPageID: vm.autoCompleteParentPage.keyColumnId ? vm.autoCompleteParentPage.keyColumnId : null,
                parentTabID: vm.autoCompleteParentTab.keyColumnId ? vm.autoCompleteParentTab.keyColumnId : null,
                hasChild: vm.pageDetail.hasChild ? vm.pageDetail.hasChild : false,
                orderBy: vm.pageDetail.orderBy,
                tabLevel: vm.pageDetail.tabLevel ? vm.pageDetail.tabLevel : null,
                iconClass: vm.pageDetail.iconClass ? vm.pageDetail.iconClass : null,
                isActive: vm.pageDetail.isActive ? vm.pageDetail.isActive : false,
                isCheckUnique: true,
                displayMenuName: vm.pageDetail.displayMenuName,
                keywords: vm.pageDetail.keywords,
                Oldkeywords: vm.pageDetail.Oldkeywords,
                userID: vm.UserId,
                isAllowAsHomePage: vm.pageDetail.isAllowAsHomePage ? vm.pageDetail.isAllowAsHomePage : false,
                deletedKeywords: vm.deletedKeywords ? vm.deletedKeywords : []
            }
            if (vm.pageDetail.pageID && vm.pageDetail.pageID > 0) {
                vm.cgBusyLoading = PageDetailFactory.pageDetail().update({
                    pageID: vm.pageDetail.pageID,
                }, pageObj, (res) => {
                    //alert message for viewing changes effect
                    if (res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                        BaseService.currentPageForms = [];
                        $state.go(USER.ADMIN_PAGE_STATE);
                        /*Pop-up used to show confrimation pop-up, need to add this in timeout because after redirect on list page this pop-up was closed automatically.*/
                        $timeout(() => {
                            let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.PAGE_DETAIL_UPDATION_ALERT);
                            var model = {
                                messageContent : messageContent,
                            };
                            DialogFactory.messageAlertDialog(model);
                        }, 1000);
                    }
                }, (error) => {
                    return BaseService.getErrorLog(error);
                });
            }
            else {
                vm.cgBusyLoading = PageDetailFactory.pageDetail().save(pageObj, (res) => {
                    if (res.data.pageID) {
                        BaseService.currentPageForms = [];
                        vm.pageDetail.pageID = res.data.pageID;
                        $state.go(USER.ADMIN_PAGE_STATE);
                    }
                    
                }, (error) => {
                    return BaseService.getErrorLog(error);
                });
            }
           
        };

        /* go to back standard message list page */
        vm.goBack = () => {
            if (vm.pageDetailForm.$dirty) {
                showWithoutSavingAlertforBackButton();
            } else {
                $state.go(USER.ADMIN_PAGE_STATE);
            }
        };
        function showWithoutSavingAlertforBackButton() {            
            let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
            let obj = {
              messageContent : messageContent,
              btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
              canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
            };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {            
              if (yes)                  
                vm.pageDetailForm.$setPristine();
                $state.go(USER.ADMIN_PAGE_STATE);
            }, (error) => {
                return BaseService.getErrorLog(error);
            });
        }
        /*Add new keywords*/
        vm.newKeyword = (chip) => {
            return {
                pageID: vm.pageID,
                keywords: chip
            };
        }
        /*Delete keywords*/
        vm.deleteKeywords = (chip) => {
            vm.deletedKeywords.push(chip.keywords);
        }
        /* called for max length validation */
        vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
            return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
        }

        /* Set as current form when page loaded */
      angular.element(() => {
        BaseService.currentPageForms = [vm.pageDetailForm];
      });

        

        //close popup on page destroy 
        $scope.$on('$destroy', function () {
            $mdDialog.hide(false, { closeAll: true });
        });
        /**Used to check max length Validate*/
        vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
            return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
        };
    }
})();
