(function () {
    'use strict';

    angular
        .module('app.rfqtransaction')
        .controller('ManualGoodBadPartMappingPopupController', ManualGoodBadPartMappingPopupController);

    /** @ngInject */
    function ManualGoodBadPartMappingPopupController($q, $scope, $mdDialog, $timeout, $filter, data, USER, CORE, DialogFactory, ManageMFGCodePopupFactory, ComponentFactory, BaseService) {

        var vm = this;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        var selectedGoodComponent;

        window.setTimeout(function () {
            $('.mfg-popup-width').focus();
        });

        //var autocompletePromise = [componentMFGAlias()];
        //vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
        //    initAutoComplete();
        //}).catch((error) => {
        //    return BaseService.getErrorLog(error);
        //});

        //function componentMFGAlias() {
        //    return ComponentFactory.getComponentMFGAlias().query().$promise.then((componentAlias) => {
        //        _.each(componentAlias.data, function (item) {
        //            item.org_mfgPN = item.mfgPN;
        //            item.mfgPN = item.mfgPN + "  (" + item.mfgCodemst.mfgCode + ")";
        //            item.isIcon = true;
        //        });
        //        vm.goodBadMFGPartList = _.filter(componentAlias.data, (item) => { return item.isGoodPart == true });
        //    }).catch((error) => {
        //        BaseService.getErrorLog(error);
        //        return true;
        //    });
        //}
        initAutoComplete();
        function initAutoComplete() {
            vm.autoCompleteGoodBadPart = {
                columnName: 'mfgPN',
                keyColumnName: 'id',
                controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
                viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
                keyColumnId: null,
                inputName: 'Select Good Part',
                placeholderName: 'Select Good Part',
                isRequired: false,
                onSelectCallbackFn: getGoodComponentBySelect,
                callbackFn: function (obj) {
                    let searchObj = {
                        id: obj.id,
                        mfgType: CORE.MFG_TYPE.MFG,
                        inputName: vm.autoCompleteGoodBadPart.inputName
                    }
                    return getAliasSearch(searchObj);
                },
                isAddnew: true,
                addData: { mfgType: CORE.MFG_TYPE.MFG },
                onSearchFn: function (query) {
                    let searchObj = {
                        isGoodPart: true,
                        mfgType: CORE.MFG_TYPE.MFG,
                        query: query,
                        inputName: vm.autoCompleteGoodBadPart.inputName
                    }
                    return getAliasSearch(searchObj);
                }

            }
        }

        function getGoodComponentBySelect(item) {
            if (item) {
                selectedGoodComponent = item;
            }

        }

        function getAliasSearch(searchObj) {
            return ComponentFactory.getComponentMFGAliasSearch().query({ listObj: searchObj }).$promise.then((componentAlias) => {
                if (componentAlias && componentAlias.data.data) {
                    if (searchObj.inputName == vm.autoCompleteGoodBadPart.inputName) {
                        _.each(componentAlias.data.data, function (item) {
                            item.org_mfgPN = item.org_mfgPN;
                            item.isIcon = true;
                        });
                    }
                    if (searchObj.id) {
                        $timeout(function () {
                            $scope.$broadcast(searchObj.inputName, componentAlias.data.data[0]);
                        });
                    }
                    else {
                    }
                }
                return componentAlias.data.data;
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }
        //save good part for selected bad part in mongo db
        vm.save = () => {
            //   var part = _.find(vm.goodBadMFGPartList, (item) => { return item.id == selectedGoodComponent })
            var apiResult = {
                SearchPN: data.SearchPN,
                PN: selectedGoodComponent.orgMfgPN,
                Type: "MFG",
                rfqAssyID: data.rfqAssyID,
                mfgName: selectedGoodComponent.mfgCode,
                mfgCodeID: selectedGoodComponent.mfgCodeId,
                mfgCode: selectedGoodComponent.mfgCode,
                isGoodPart: true
            }
            vm.cgBusyLoading = ComponentFactory.saveApiVerificationResult().query({ apiVerification: apiResult }).$promise.then((componentAlias) => {
                $mdDialog.cancel(apiResult);
            }).catch((error) => {
                BaseService.getErrorLog(error);
                return true;
            });
        };

        vm.cancel = () => {
            $mdDialog.cancel();
        };
    }
})();