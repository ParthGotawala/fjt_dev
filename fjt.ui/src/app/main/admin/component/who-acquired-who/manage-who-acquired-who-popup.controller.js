(function () {
    'use strict';
    angular
        .module('app.admin.whoacquiredwho')
        .controller('ManageWhoAcquiredWhoPopupController', ManageWhoAcquiredWhoPopupController);
    /** @ngInject */
    function ManageWhoAcquiredWhoPopupController($scope, $mdDialog, $q, data, ManageMFGCodePopupFactory, DialogFactory, CORE, WhoAcquiredWhoFactory, BaseService, $timeout, USER) {
        const vm = this;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.taToolbar = CORE.Toolbar;
        vm.whoBoughtWhoModel = {
            buyBy: null,
            buyTo: null,
            buyDate: new Date(),
            description: null
        };
        vm.DefaultDateFormat = _dateDisplayFormat;
        vm.placeHolderFormat = angular.copy(vm.DefaultDateFormat).toUpperCase();
        vm.DATE_PICKER = CORE.DATE_PICKER;
        vm.IsPickerOpen = {};
        vm.IsPickerOpen[vm.DATE_PICKER.buyDate] = false;
        vm.todayDate = new Date();
        var selectedBuyTo;
        var selectedBuyBy;
        vm.buyDateOptions = {
            maxDate: vm.todayDate,
            appendToBody: true
        };

        function getMfgSearch(searchObj) {
            return ManageMFGCodePopupFactory.getMfgcodeList().query({ type: CORE.MFG_TYPE.MFG, searchQuery: searchObj.searchQuery, mfgcodeID: searchObj.mfgcodeID }).$promise.then((mfgcodes) => {
                var rejectIndex = -1;
                _.each(mfgcodes.data, function (item, index) {
                    if (item.id == 0)
                        rejectIndex = index;

                    item.mfg = item.mfgCode;
                    item.mfgCode = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName);
                })

                if (rejectIndex != -1)
                    mfgcodes.data.splice(rejectIndex, 1);

                if (searchObj.mfgcodeID) {
                    selectedBuyBy = mfgcodes.data[0];
                    $timeout(function () {
                        $scope.$broadcast(vm.autoCompleteBuyBy.inputName, selectedBuyBy);
                    });
                }
                vm.mfgCodeDetail = mfgcodes.data;
                return $q.resolve(vm.mfgCodeDetail);
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }
        function getMfgSearchBuyTo(searchObj) {
            return ManageMFGCodePopupFactory.getMfgcodeList().query({ type: CORE.MFG_TYPE.MFG, searchQuery: searchObj.searchQuery, mfgcodeID: searchObj.mfgcodeID }).$promise.then((mfgcodes) => {
                var rejectIndexArr = [];
                _.each(mfgcodes.data, function (item, index) {

                    if (vm.whoBoughtWhoModel.buyBy == item.id || item.id == 0) {
                        rejectIndexArr.push(item);
                    }

                    item.mfg = item.mfgCode;
                    item.mfgCode = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName);
                });

                if (rejectIndexArr.length) {
                    rejectIndexArr.forEach((item) => {
                        var index = mfgcodes.data.indexOf(item);
                        mfgcodes.data.splice(index, 1);
                    })

                }
                if (searchObj.mfgcodeID) {
                    selectedBuyTo = mfgcodes.data[0];
                    $timeout(function () {
                        $scope.$broadcast(vm.autoCompleteBuyTo.inputName, selectedBuyTo);
                    });
                }
                vm.mfgBuyToDetail = mfgcodes.data;
                return $q.resolve(vm.mfgBuyToDetail);
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        let getBuyByMfg = (item) => {
            if (item) {
                vm.whoBoughtWhoModel.buyBy = item.id;
                vm.autoCompleteBuyTo.keyColumnId = null;
            }
            else {
                $scope.$broadcast(vm.autoCompleteBuyTo.inputName, null);
                vm.whoBoughtWhoModel.buyBy = null;
                vm.autoCompleteBuyTo.keyColumnId = null;
            }
        }

        let getBuyToMfg = (item) => {
            if (item) {
                vm.whoBoughtWhoModel.buyTo = item.id;
            }
        }

        let initAutoComplete = () => {
            vm.autoCompleteBuyBy = {
                columnName: 'mfgCode',
                controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
                viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
                keyColumnName: 'id',
                keyColumnId: vm.whoBoughtWhoModel ? vm.whoBoughtWhoModel.buyBy : null,
                inputName: 'MFG Code',
                placeholderName: 'Acquired By',
                isRequired: true,
                isAddnew: true,
                addData: {
                    mfgType: CORE.MFG_TYPE.MFG,
                    popupAccessRoutingState: [USER.ADMIN_MANAGEMANUFACTURER_DETAIL_STATE],
                    pageNameAccessLabel: CORE.PageName.manufacturer
                },
                callbackFn: function (obj) {
                    let searchObj = {
                        mfgcodeID: obj.id
                    }
                    return getMfgSearch(searchObj);
                },
                onSelectCallbackFn: getBuyByMfg,
                onSearchFn: function (query) {
                    let searchObj = {
                        searchQuery: query,
                        inputName: vm.autoCompleteBuyBy.inputName
                    }
                    return getMfgSearch(searchObj);
                }
            },

                vm.autoCompleteBuyTo = {
                    columnName: 'mfgCode',
                    controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
                    viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
                    keyColumnName: 'id',
                    keyColumnId: vm.whoBoughtWhoModel ? vm.whoBoughtWhoModel.buyTo : null,
                    inputName: 'MFG Code Acquired ' + CORE.LabelConstant.MFG.MFG,
                    placeholderName: 'Acquired ' + CORE.LabelConstant.MFG.MFG,
                    isRequired: true,
                    isAddnew: true,
                    addData: { 
                        mfgType: CORE.MFG_TYPE.MFG,
                        popupAccessRoutingState: [USER.ADMIN_MANAGEMANUFACTURER_DETAIL_STATE],
                        pageNameAccessLabel: CORE.PageName.manufacturer
                     },
                    callbackFn: function (obj) {
                        let searchObj = {
                            mfgcodeID: obj.id
                        }
                        return getMfgSearchBuyTo(searchObj);
                    },
                    onSelectCallbackFn: getBuyToMfg,
                    onSearchFn: function (query) {
                        let searchObj = {
                            searchQuery: query,
                            inputName: vm.autoCompleteBuyTo.inputName
                        }
                        return getMfgSearchBuyTo(searchObj);
                    }
                }

        }

        init();
        function init() {
            if (data && data.id) {
                vm.whoBoughtWhoModel.id = data.id;
            }
            if (vm.whoBoughtWhoModel.id) {
                vm.cgBusyLoading = WhoAcquiredWhoFactory.retriveWhoBoughtWho().query({
                    id: vm.whoBoughtWhoModel.id
                }).$promise.then((response) => {
                    if (response && response.data) {
                        vm.whoBoughtWhoModel.buyBy = response.data.buyBy;
                        vm.whoBoughtWhoModel.buyTo = response.data.buyTo;
                        vm.whoBoughtWhoModel.buyDate = response.data.buyDate;

                        $timeout(() => {
                            initAutoComplete();
                        }, 0);
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
        }

        vm.openPicker = (type, ev) => {
            if (ev.keyCode == 40) {
                vm.IsPickerOpen[type] = true;
            }
        };

        $timeout(() => {
            initAutoComplete();
        }, 0);


        vm.verifyUser = (ev) => {
            if (vm.AddWhoAcquiredWhoForm.$invalid) {
                BaseService.focusRequiredField(vm.AddWhoAcquiredWhoForm);
                return;
            }
            DialogFactory.dialogService(
                CORE.MANAGE_PASSWORD_POPUP_CONTROLLER,
                CORE.MANAGE_PASSWORD_POPUP_VIEW,
                ev, null).then((data) => {
                    if (data) {
                        vm.save(data);
                    }
                },
                    (err) => {
                        // return BaseService.getErrorLog(err);
                    });
        }

        vm.save = (data) => {
            vm.whoBoughtWhoModel.UserPassword = data;
            vm.whoBoughtWhoModel.buyDate = BaseService.getAPIFormatedDate(vm.whoBoughtWhoModel.buyDate);
            vm.cgBusyLoading = WhoAcquiredWhoFactory.WhoBoughtWho().save(vm.whoBoughtWhoModel).$promise.then((res) => {
                if (res.data) {
                    if (res.data.id) {
                        BaseService.currentPagePopupForm.pop();
                        $mdDialog.cancel(res.data);
                    }
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        };

        vm.cancel = () => {
            let isdirty = vm.checkFormDirty(vm.AddWhoAcquiredWhoForm);
            if (isdirty) {
                let data = {
                    form: vm.AddWhoAcquiredWhoForm
                }
                BaseService.showWithoutSavingAlertForPopUp(data);
            } else {
                BaseService.currentPagePopupForm.pop();
                $mdDialog.cancel();
            }
        };

        vm.checkFormDirty = (form, columnName) => {
            let checkDirty = BaseService.checkFormDirty(form, columnName);
            return checkDirty;
        };

        /* called for max length validation */
        vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
            return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
        }
        /* called for max date validation */
        vm.getMaxDateValidation = (FromDate, ToDate) => {
            return BaseService.getMaxDateValidation(FromDate, ToDate);
        }

        /* go to manufacturer list page */
        vm.goToManufacturerList = () => {
            BaseService.goToManufacturerList();
        };

        //on load submit form
      angular.element(() => {
        BaseService.currentPagePopupForm.push(vm.AddWhoAcquiredWhoForm);
      });
    }
})();
