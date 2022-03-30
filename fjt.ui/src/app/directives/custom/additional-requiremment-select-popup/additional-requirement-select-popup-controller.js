(function () {
    'use strict';

    angular
        .module('app.rfqtransaction')
        .controller('AdditionalRequirementSelectPopupController', AdditionalRequirementSelectPopupController);

    /** @ngInject */
    function AdditionalRequirementSelectPopupController($mdDialog, $scope, $timeout, $filter, RFQSettingFactory, $q, uiSortableMultiSelectionMethods, CORE, USER, RFQTRANSACTION, data, BaseService, RFQFactory, BOMFactory, CopyBOMPopupFactory, CustomerConfirmationPopupFactory, CustomerFactory, DialogFactory, MasterFactory) {
        const vm = this;
        vm.EmptyMesssage = angular.copy(USER.ADMIN_EMPTYSTATE.ADDITIONAL_REQUIREMENT);
        vm.requirementCategory = CORE.RequitementCategory;

        let type = null;
        // currently category means narrative master only
        if (data.isNarrative) {
            vm.EmptyMesssage.MESSAGE = stringFormat(vm.EmptyMesssage.MESSAGE, "Narrative Master Template");
            vm.EmptyMesssage.ADDNEWMESSAGE = stringFormat(vm.EmptyMesssage.MESSAGE, "Narrative Master Template");
        } else {
            vm.EmptyMesssage.MESSAGE = stringFormat(vm.EmptyMesssage.MESSAGE, "RFQ Requirement Template");
            vm.EmptyMesssage.ADDNEWMESSAGE = stringFormat(vm.EmptyMesssage.MESSAGE, "RFQ Requirement Template");
        }
        vm.isAssy = data.isAssy || false;
        vm.isQuote = data.isQuote || false;
        vm.isNarrative = data.isNarrative || false;
        // select category default file category is narrative.
        if (vm.isAssy) {
            type = vm.requirementCategory[1].id;
            vm.title = "Assembly Requirements";
        }
        if (vm.isQuote) {
            type = vm.requirementCategory[0].id;
            vm.title = "Customer Quote Notes";
        }
        if (vm.isNarrative) {
            type = vm.requirementCategory[2].id;
            vm.title = "Narrative Master Template";
        }


        // get Additional requirement List
        let getAdditionalRequirementList = (type) => {
            return RFQSettingFactory.getAdditionalRequirementList().query({ category: type }).$promise.then((requirement) => {
                vm.RequirementList = requirement.data;
                vm.RequirementList = _.filter(vm.RequirementList, (requirement) => {
                    return requirement.isActive;
                })
                if (vm.RequirementList.length > 0) {
                    vm.selectedReq = [];
                    vm.isNoaddreqFound = false;
                }
                else {
                    vm.selectedReq = [];
                    vm.isNoaddreqFound = true;
                }
                return $q.resolve(vm.RequirementList);
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        var autocompletePromise = [getAdditionalRequirementList(type)];

        vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
        }).catch((error) => {
            return BaseService.getErrorLog(error);
        });
        /* open addtional requirement popup to add new */
        vm.addNewAdditionalRequirement = (reqFor) => {
            let popUpData = { popupAccessRoutingState: [USER.ADMIN_ADDITIONAL_REQUIREMENT_STATE], pageNameAccessLabel: CORE.PageName.requirement };
            let isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
            if (isAccessPopUp) {
                var obj = {};
                obj.isQuote = vm.isQuote;
                obj.isAssy = vm.isAssy;
                obj.isNarrative = vm.isNarrative;
                DialogFactory.dialogService(
                    CORE.MANAGE_ADDITIONAL_REQUIREMENT_MODAL_CONTROLLER,
                    CORE.MANAGE_ADDITIONAL_REQUIREMENT_MODAL_VIEW,
                    null,
                    obj).then(() => {
                    }, (data) => {
                        if (data) {
                            getAdditionalRequirementList(type);
                        }
                    },
                        (err) => {
                        });
            }
        };

        // logic to bind change event of additional requirement
        vm.selectAssyreq = (selectedreq) => {
            vm.ischange = true;
            if (vm.selectedReq) {
                let index = vm.selectedReq.indexOf(selectedreq);
                if (index == -1) {
                    if (vm.selectedReq) {
                        vm.selectedReq.push(selectedreq);
                    } else {
                        vm.selectedReq = [];
                        vm.selectedReq.push(selectedreq);
                    }
                } else {
                    vm.selectedReq.splice(index, 1);
                }
            } else {
                vm.selectedReq = [];
                vm.selectedReq.push(selectedreq);
            }
            vm.selectRequirementForm.$setDirty();
        }

        // add selected data in Internal Quote Note
        vm.setQuoteAdditionalReq = () => {
            var rfqassyreq = vm.selectedReq;
            let areq = [];
            _.each(rfqassyreq, (assyreq) => {
                let addreq
                addreq = _.find(vm.RequirementList, (req) => { return req.id == assyreq; });
                if (addreq)
                    areq.push(addreq.name);
            })


            var string1 = "<ul><li>";
            var string2 = "</li><li>";
            var string3 = "</li></ul>";
            if (areq.length > 0) {
                //if (vm.isNarrative) {
                //    $mdDialog.cancel(areq.join(", "));
                //} else {
                let reqstring = areq.join(string2);
                let str = string1 + reqstring + string3;
                vm.selectedReq = [];
                BaseService.currentPagePopupForm = [];
                vm.selectRequirementForm.$setPristine();
                $mdDialog.cancel(str);
                //}
            } else {
                vm.selectedReq = [];
                BaseService.currentPagePopupForm = [];
                vm.selectRequirementForm.$setPristine();
                $mdDialog.cancel();
            }
        };

        vm.refreshAdditionalQuoteRequirement = () => {
            getAdditionalRequirementList(type);
        }

        vm.cancel = () => {
            let isdirty = vm.selectRequirementForm.$dirty;
            if (!isdirty || !vm.ischange)
                $mdDialog.cancel();
            else {
                let data = {
                    form: vm.selectRequirementForm
                }
                BaseService.showWithoutSavingAlertForPopUp(data);
            }
        };

      vm.checkFormDirty = (form, columnName) => {
        const checkDirty = BaseService.checkFormDirty(form, columnName);
        return checkDirty;
      };

        // Check Form Dirty state on state change and reload browser
      angular.element(() => {
        BaseService.currentPagePopupForm = [vm.selectRequirementForm];
      });
    }

})();
