(function () {
    'use strict';

    angular
        .module('app.transaction.purchaseorder')
        .controller('ManageDuplicatePurchaseOrderPopupController', ManageDuplicatePurchaseOrderPopupController);

    /** @ngInject */
    function ManageDuplicatePurchaseOrderPopupController($mdDialog, CORE, data, BaseService, PurchaseOrderFactory, $q, USER, TRANSACTION, DialogFactory) {
        const vm = this;
        const poID = data.purchaseID;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
        vm.DATE_PICKER = CORE.DATE_PICKER;
        vm.COPY_PO_NOTES = CORE.PO_COPY_NOTES;
        vm.IsPickerOpen = {};
        vm.loginUser = BaseService.loginUser;
        vm.IsPickerOpen[vm.DATE_PICKER.poDate] = false;
        vm.LabelConstant = CORE.LabelConstant;
        vm.poDateOptions = {
            appendToBody: true,
            checkoutTimeOpenFlag: false
        };
        vm.poModel = {
            isPartRequirements: true,
            poDate: new Date()
        };
        vm.cancel = () => {
            const isdirty = BaseService.checkFormDirty(vm.CopyPurchaseOrderForm) || vm.poModel.poDate;
            if (isdirty) {
                BaseService.showWithoutSavingAlertForPopUp();
            } else {
                $mdDialog.cancel();
            }
        };
        // go to purchase order list
        vm.goToPurchaseOrderList = () => {
            BaseService.goToPurchaseOrderList();
        };
        // go to purchase order detail page
        vm.goToPurchaseOrder = () => {
            BaseService.goToPurchaseOrderDetail(poID);
        };
        // go to supplier list page
        vm.goToSupplierList = () => {
            BaseService.goToSupplierList();
        };
        // go to manage supplier page
        vm.goToSupplier = () => {
            BaseService.goToSupplierDetail(vm.purchaseOrder.supplierID);
        };
        // bind header detail
        function bindHeaderData() {
            vm.headerdata = [];
            vm.headerdata.push({
                label: vm.LabelConstant.PURCHASE_ORDER.PO,
                value: vm.purchaseOrder.poNumber,
                displayOrder: 1,
                labelLinkFn: vm.goToPurchaseOrderList,
                valueLinkFn: vm.goToPurchaseOrder,
                isCopy: true
            }, {
                label: vm.LabelConstant.PURCHASE_ORDER.PORevision,
                value: vm.purchaseOrder.poRevision,
                displayOrder: 2
            },
                {
                    label: vm.LabelConstant.MFG.Supplier,
                    value: vm.purchaseOrder.suppliers && vm.purchaseOrder.suppliers.mfgCodeName ? vm.purchaseOrder.suppliers.mfgCodeName : null,
                    displayOrder: 3,
                    labelLinkFn: vm.goToSupplierList,
                    valueLinkFn: vm.goToSupplier,
                    isCopy: true
                }, {
                label: vm.LabelConstant.PURCHASE_ORDER.POPostingStatus,
                value: data.status,
                displayOrder: 4
            });
        }

        // save and create duplicate po
        vm.createDuplicatePurchaseOrder = () => {
            if (BaseService.focusRequiredField(vm.CopyPurchaseOrderForm, true) && !vm.poModel.poDate) {
                return;
            }
            if (data.IsUserAwareOfPartStatus) {
                vm.saveDuplicatePurchaseOrder();
            } else {
                vm.cgBusyLoading = PurchaseOrderFactory.checkPartStatusOfPurchaseOrder().query({ id: poID }).$promise.then((res) => {
                    if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                        if (res.data) {
                            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_CONTAINST_INACTIVE_PART);
                            messageContent.message = stringFormat(messageContent.message, redirectToPOAnchorTag(poID, data.poNumber));
                            const obj = {
                                messageContent: messageContent,
                                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                            };
                            DialogFactory.messageConfirmDialog(obj).then((yes) => {
                                if (yes) {
                                    vm.saveDuplicatePurchaseOrder();
                                }
                            }, () => $mdDialog.cancel()
                            ).catch((error) => BaseService.getErrorLog(error));
                        } else {
                            vm.saveDuplicatePurchaseOrder();
                        }
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            }
        };

        vm.saveDuplicatePurchaseOrder = () => {
            const objDuplicatePO = {
                id: poID,
                employeeID: vm.loginUser.employee.id,
                poDate: (BaseService.getAPIFormatedDate(vm.poModel.poDate)), //moment(vm.poModel.poDate).format('YYYY-MM-DD'),
                pisKeepPO: vm.poModel.isPartRequirements
            };
            vm.cgBusyLoading = PurchaseOrderFactory.copyPurchaseOrderDetail().query(objDuplicatePO).$promise.then((res) => {
                if (res && res.data) {
                    if (vm.CopyPurchaseOrderForm) {
                        vm.CopyPurchaseOrderForm.$setPristine();
                    }
                    $mdDialog.cancel(res.data);
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };
        // get purchase Order detail by ID
        const getPurchaseOrderDetailByID = () => PurchaseOrderFactory.retrievePurchaseOrder().query({ id: poID }).$promise.then((res) => {
            if (res && res.data) {
                vm.purchaseOrder = res.data;
                bindHeaderData();
            }
            return res.data;
        }).catch((error) => BaseService.getErrorLog(error));
        // get Part Requirement detail from part master
        const getPurchaseOrderPartRequirementDetailByPOID = () => PurchaseOrderFactory.getDuplicatePurchaseOrderPartRequirementList().query({ id: poID }).$promise.then((res) => {
            if (res && res.data) {
                vm.purchaseOrderPartRequirement = _.filter(res.data.partRequirements, (partRequirement) => partRequirement.requiementType === 'R');
                vm.purchaseOrderPartComment = _.filter(res.data.partRequirements, (partRequirement) => partRequirement.requiementType === 'C');
                vm.purchaseOrderPartDescription = res.data.partDescription;
            }
            return res.data;
        }).catch((error) => BaseService.getErrorLog(error));
        const partRequirementPromise = [getPurchaseOrderDetailByID(), getPurchaseOrderPartRequirementDetailByPOID()];
        vm.cgBusyLoading = $q.all(partRequirementPromise).then(() => {
            vm.partRequirements = [];
            _.each(vm.purchaseOrder.purchaseOrderDet, (poRequirement) => {
                // check part requirement details matched or not
                const partRequirements = _.filter(vm.purchaseOrderPartRequirement, (partRequirement) => partRequirement.partID === poRequirement.mfgPartID);
                if (partRequirements.length !== poRequirement.purchaseOrderLineRequirementDet.length) {
                    vm.partRequirements.push(poRequirement);
                } else {
                    _.each(poRequirement.purchaseOrderLineRequirementDet, (poPartRequirement) => {
                        const checkPartRequirement = _.find(partRequirements, (pRequirement) => pRequirement.requirement.toLowerCase() === poPartRequirement.instruction.toLowerCase());
                        if (!checkPartRequirement) {
                            const isexists = _.find(vm.partRequirements, (parts) => parts.mfgPartID === poRequirement.mfgPartID);
                            if (!(isexists)) {
                                vm.partRequirements.push(poRequirement);
                            }
                        }
                    });
                }
                // check part comment details matched or not
                const partComments = _.map(_.filter(vm.purchaseOrderPartComment, (partComments) => partComments.partID === poRequirement.mfgPartID), 'requirement').join('\r');
                if ((partComments && poRequirement.lineComment && partComments.toLowerCase() !== poRequirement.lineComment.toLowerCase()) || (!partComments && poRequirement.lineComment) || (partComments && !poRequirement.lineComment)) {
                    const isexists = _.find(vm.partRequirements, (parts) => parts.mfgPartID === poRequirement.mfgPartID);
                    if (!(isexists)) {
                        vm.partRequirements.push(poRequirement);
                    }
                }
                // check part description comment
                const partDescription = _.find(vm.purchaseOrderPartDescription, (partdescr) => partdescr.id === poRequirement.mfgPartID);
                if ((partDescription && partDescription.mfgPNDescription.toLowerCase() !== poRequirement.partDescription.toLowerCase()) || (!partDescription && partDescription.mfgPNDescription) || (partDescription && !partDescription.mfgPNDescription)) {
                    const isexists = _.find(vm.partRequirements, (parts) => parts.mfgPartID === poRequirement.mfgPartID);
                    if (!(isexists)) {
                        vm.partRequirements.push(poRequirement);
                    }
                }
            });
        }).catch((error) => BaseService.getErrorLog(error));
        const redirectToPOAnchorTag = (poid, poNumber) => {
            const redirectToPOUrl = WebsiteBaseUrl + CORE.URL_PREFIX + TRANSACTION.TRANSACTION_ROUTE + TRANSACTION.TRANSACTION_PURCHASE_ORDER_ROUTE + TRANSACTION.TRANSACTION_PURCHASE_ORDER_MAIN_ROUTE + TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAIL_ROUTE.replace(':id', poid);
            return stringFormat('<a href=\'{0}\' target=\'_blank\' tabindex=\'-1\' class=\'underline\'>{1}</a>', redirectToPOUrl, poNumber);
        };
        //page load then it will add forms in page forms
        angular.element(() => {
            BaseService.currentPageForms = [vm.CopyPurchaseOrderForm];
        });
    }
})();
