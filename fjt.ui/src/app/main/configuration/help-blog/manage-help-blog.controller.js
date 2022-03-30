(function () {
    'use strict';

    angular
        .module('app.configuration.helpblog')
        .controller('ManageHelpBlogController', ManageHelpBlogController);

    /** @ngInject */
    function ManageHelpBlogController($mdDialog, $state, $stateParams, $scope,
        CORE, USER, CONFIGURATION, DialogFactory, HelpBlogFactory, PageDetailFactory, BaseService, $q) {
        const vm = this;
        vm.manageBlog = {
            keywords: [],
            title: null
        };
        //vm.EmptyMesssage = CONFIGURATION.CONFIGURATION_EMPTYSTATE.HELPBLOG;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.taToolbar = CORE.Toolbar;
        vm.helpBlogId = $stateParams.pageID ? $stateParams.pageID : null;
        vm.isAnyUnpublish = false;
        vm.viewVersion = !vm.helpBlogId ? true : false;
        vm.selectedBlog = [];
        vm.dateFormat = _dateDisplayFormat;        
        vm.oldTitle = null;
        vm.desciption = CORE.LabelConstant.HELP_BLOG_MESSAGES.DESCRIPTION;
        vm.oldKeyColumnId = null;
        vm.setFocusOnChange = true;
        /*Used to get help blog details*/
        vm.getHelpBlogPageDetailsById = (pageID) => {
            vm.manageBlog = {
                keywords: []
            };
            vm.cgBusyLoading = HelpBlogFactory.getHelpBlogById().query({ pageID: pageID }).$promise.then((res) => {
                vm.manageBlog.title = null;
                if (res && res.data) {
                    res.data.forEach((item) => {
                        var keywords = item.helpBlogKeyword || [];
                        delete item.helpBlogKeyword;
                        item.keywords = keywords;
                    });
                    vm.id = res.data[0].id;
                    vm.selectedBlog = res.data[0];
                    vm.versionHistory = _.sortBy(res.data, function (item) { if (item.version == 0) { return Infinity } else { return item.version } }).reverse();
                    vm.isAnyUnpublish = _.some(vm.versionHistory, function (item) { return item.version == 0 });
                    vm.manageBlog = vm.versionHistory[0];
                    vm.oldTitle = angular.copy(vm.manageBlog.title);
                    vm.oldKeyColumnId = vm.manageBlog.pageID;
                    vm.versionModel = vm.manageBlog ? vm.manageBlog.version : null;
                    vm.viewVersion = false;
                    vm.autoCompletepagedetail.keyColumnId = null;
                    vm.autoCompletepagedetail.keyColumnId = vm.selectedBlog.pageID;
                    vm.helpBlogId = vm.selectedBlog.id;
                    focustOnAutoComplete('#autoCompletepagedetail');
                    SearchPage({ searchStr: "", id: vm.selectedBlog.id });
                }
            }).catch((err) => {
                return BaseService.getErrorLog(err);
            })
        }

        /*Used to Search record*/
        let SearchPage = (searchStr) => {
            vm.SearchPageList = [];
            return HelpBlogFactory.SearchPageTitle().save(searchStr).$promise.then((pagesList) => {
                if (pagesList && pagesList.data && pagesList.data.data) {
                    vm.SearchPageList = pagesList.data.data;
                    //$timeout(function () {
                    //    $scope.$broadcast(vm.autoCompleteSearchPageDetail.inputName, vm.SearchPageList[0]);
                    //});
                }
                return $q.resolve(vm.SearchPageList);
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        /*Used to fill help blog page title*/
        let initSearchPageDetailAutocomplete = () => {
            vm.autoCompleteSearchPageDetail = {
                columnName: 'title',
                keyColumnName: 'id',
                keyColumnId: null,
                inputName: 'title',
                placeholderName: "Type here to search page",
                isRequired: false,
                isAddnew: false,
                isAddnew: false,
                onSelectCallbackFn: (helpBlogDetail) => {
                    if (helpBlogDetail) {
                        let isdirty = vm.checkFormDirty(vm.helpBlogFrom);
                        if (isdirty) {
                            showWithoutSavingAlertforBackButton(null, isdirty, helpBlogDetail.pageID);
                        } else {
                            vm.getHelpBlogPageDetailsById(helpBlogDetail.pageID);
                            //let element = angular.element(document.querySelector('#autoCompletepagedetail'));
                            //if (element)
                            //    element.focus();
                            focustOnAutoComplete('#autoCompletepagedetail');
                            $state.transitionTo($state.$current, { pageID: helpBlogDetail.pageID }, { location: true, inherit: true, notify: false });
                        }
                    }
                },
                onSearchFn: (query) => {
                    let searchObj = {
                        searchStr: query,
                        id: null
                    }
                    return SearchPage(searchObj);
                }
            }
        };

        /*declare auto complete*/
        vm.initAutoCompletepagedetail = () => {
            vm.autoCompletepagedetail = {
                columnName: 'menuName',
                keyColumnName: 'pageID',
                keyColumnId: vm.manageBlog ? vm.manageBlog.pageID : null,
                inputName: 'Menu Name',
                placeholderName: 'Menu Name',
                isRequired: true,
                isAddnew: false,
                callbackFn: getPageDetail,
                onSelectCallbackFn: (item) => {
                    if (item) {
                        checkUnique(item);
                    }
                }
            }
        }

        if (vm.helpBlogId) {
            let cgPromiseResponse = [vm.initAutoCompletepagedetail(), initSearchPageDetailAutocomplete()];
            vm.cgBusyLoading = $q.all(cgPromiseResponse).then((responses) => {
                vm.autoCompletepagedetail.keyColumnId = null;
                vm.getHelpBlogPageDetailsById(vm.helpBlogId)
            });
        } else {
            vm.initAutoCompletepagedetail();
            initSearchPageDetailAutocomplete();
        }

        // add new keywords
        vm.newKeyword = (chip) => {
            return {
                id: null,
                keyword: chip
            };
        }

        // bind page detail dropdown
        function getPageDetail() {
            return vm.cgBusyLoading = PageDetailFactory.getPageList().query().$promise.then((res) => {
                vm.pageList = res.data;
            }).catch((err) => {
                return BaseService.getErrorLog(err);
            });
        }

        getPageDetail();

        /*Used to check uniqe help blog page on select page*/
        let checkUnique = (item) => {
            if (vm.oldKeyColumnId != item.pageID) {
                vm.cgBusyLoading = HelpBlogFactory.checkUniqueHelpBlog().save(item).$promise.then((response) => {
                    vm.cgBusyLoading = false;
                  if (response && response.status != CORE.ApiResponseTypeStatus.SUCCESS && vm.autoCompletepagedetail.keyColumnId != null
                        && response.errors && response.errors.data && response.errors.data.isNotUnique) {
                        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
                        messageContent.message = stringFormat(messageContent.message, "Help blog");
                        let alertModel = {
                          messageContent: messageContent,
                          multiple: true
                        };
                        return DialogFactory.messageAlertDialog(alertModel).then((yes) => {
                            if (yes) {
                                vm.autoCompletepagedetail.keyColumnId = null;
                            }
                        }, (cancel) => {

                        }).catch((error) => {
                            return BaseService.getErrorLog(error);
                        });
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
        }

        /*Used to check uniqe help blog help blog title*/
        vm.checkDuplicateTitle = () => {
            vm.manageBlog.title = vm.manageBlog.title ? vm.manageBlog.title : "";
            if (vm.manageBlog.title != "" && angular.lowercase(vm.oldTitle) != angular.lowercase(vm.manageBlog.title)) {
                vm.cgBusyLoading = HelpBlogFactory.checkUniqueHelpBlogTitle().save(vm.manageBlog).$promise.then((response) => {
                    vm.cgBusyLoading = false;
                  if (response && response.status != CORE.ApiResponseTypeStatus.SUCCESS && response.errors && response.errors.data && response.errors.data.isNotUnique) {
                        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
                        messageContent.message = stringFormat(messageContent.message, "Help blog title");
                        let alertModel = {
                          messageContent: messageContent,
                          multiple: true
                        };
                        return DialogFactory.messageAlertDialog(alertModel).then((yes) => {
                            if (yes) {
                                vm.manageBlog.title = "";
                                /*Global fucntion*/
                                setFocus("blogTitle");
                            }
                        }, (cancel) => {

                        }).catch((error) => {
                            return BaseService.getErrorLog(error);
                        });
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
        }

        /*Used to go back*/
        vm.goBack = () => {
            vm.agreementList = [];
            vm.selectedAgreementTypeId = 0;
            let isdirty = vm.checkFormDirty(vm.helpBlogFrom);
            if (isdirty) {
                showWithoutSavingAlertforBackButton();
            } else {
                $state.go(CONFIGURATION.CONFIGURATION_HELPBLOG_STATE, {});
            }
        }

        /*Used to show confirmation pop-up in dirty state */
        function showWithoutSavingAlertforBackButton(callback, isdirty, helpBlogDetailId) {
            let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);         
            let obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
                canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes) {
                    if (callback) {
                        callback();
                    }
                    else if (isdirty) { /*Chnage help blog details*/
                        vm.getHelpBlogPageDetailsById(helpBlogDetailId);
                        //vm.helpBlogFrom.$pristine();
                    }
                    else {
                        BaseService.currentPageForms = [];
                        $state.go(CONFIGURATION.CONFIGURATION_HELPBLOG_STATE);
                    }
                }
            }, (error) => {
                return BaseService.getErrorLog(error);
            });
        }
        /*Used to save new help blog*/
        vm.SaveNewTemplate = () => {
            if (!vm.helpBlogFrom.$valid) {
                BaseService.focusRequiredField(vm.helpBlogFrom);
                return;
            }
            vm.manageBlog.version = 0;
            vm.manageBlog.isPublished = false;
            vm.manageBlog.pageID = vm.autoCompletepagedetail.keyColumnId;
            vm.manageBlog.id = null;
            _.each(vm.manageBlog.keywords, function (item) {
                item.id = null;
            })
            vm.cgBusyLoading = HelpBlogFactory.blog().save(vm.manageBlog).$promise.then((response) => {
              if (response && response.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                    BaseService.currentPageForms.pop();
                    $state.go(CONFIGURATION.CONFIGURATION_HELPBLOG_STATE, {});
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }
        /*Used to update help blog*/
        vm.UpdateTemplate = () => {
            if (!vm.helpBlogFrom.$valid) {
                BaseService.focusRequiredField(vm.helpBlogFrom);
                return;
            }
            vm.manageBlog.isPublished = false;
            vm.manageBlog.pageID = vm.autoCompletepagedetail.keyColumnId;
            vm.cgBusyLoading = HelpBlogFactory.blog().save(vm.manageBlog).$promise.then((response) => {
              if (response && response.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                    BaseService.currentPageForms.pop();
                    $state.go(CONFIGURATION.CONFIGURATION_HELPBLOG_STATE, {});
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        /*Used to set template*/
        vm.getTemplate = () => {
            vm.manageBlog = _.find(vm.versionHistory, function (item) { return item.version == vm.versionModel; });
        }
        /*Used to check form dirty*/
        vm.checkFormDirty = (form, columnName) => {
            let checkDirty = BaseService.checkFormDirty(form, columnName);
            return checkDirty;
        };
        /*Used to on add help blog page*/
        vm.gotoAddBlogPage = () => {
            $state.go(CONFIGURATION.CONFIGURATION_MANAGE_HELP_BLOG_STATE, { pageID: null });
        }

        /*close popup on page destroy */
        $scope.$on('$destroy', function () {
            $mdDialog.hide(false, { closeAll: true });
        });

        //Set as current form when page loaded
      angular.element(() => {
        BaseService.currentPageForms = [vm.helpBlogFrom];
      });

        /** Validate max size */
        vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
            return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
        };
        /*Used to focus on autocomlete*/
        let focustOnAutoComplete = (id) => {
            let element = angular.element(document.querySelector(id));
            if (element)
                element.focus();
        }
    }
})();
