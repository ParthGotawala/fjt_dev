(function () {
    'use strict';

    angular
        .module('app.transaction.purchaseorder')
        .controller('PurchaseOrderController', PurchaseOrderController);

    /** @ngInject */
    function PurchaseOrderController($filter, $state, TRANSACTION, BaseService, MyProfileFactory, CORE) {
        const vm = this;
        vm.loginUser = BaseService.loginUser;
        vm.tabList = [
            {
                id: TRANSACTION.PurchaseOrderTabListId.Summary,
                state: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAILLIST_STATE,
                title: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAILLIST_LABEL,
                src: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAILLIST_STATE,
                viewsrc: 'detail',
                isDisabled: false,
                isDefaultTab: vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultPurchaseOrderListTabID) === TRANSACTION.PurchaseOrderTabListId.Summary
            },
            {
                id: TRANSACTION.PurchaseOrderTabListId.DetailPerLine,
                state: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAILLIST_PART_STATE,
                title: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAILLIST_PART_LABEL,
                src: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAILLIST_PART_STATE,
                viewsrc: 'partdetail',
                isDisabled: false,
                isDefaultTab: vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultPurchaseOrderListTabID) === TRANSACTION.PurchaseOrderTabListId.DetailPerLine
            }
        ];

        const setActiveTab = () => {
            if (vm.loginUser) {
                const item = $filter('filter')(vm.tabList, { src: $state.current.name }, true);
                if (item[0]) {
                    vm.activeTab = item[0].id;
                } else if (vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultPurchaseOrderListTabID) === TRANSACTION.PurchaseOrderTabListId.Summary) {
                    vm.activeTab = TRANSACTION.PurchaseOrderTabListId.Summary;
                    $state.go(TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAILLIST_STATE);
                } else if (vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultPurchaseOrderListTabID) === TRANSACTION.PurchaseOrderTabListId.DetailPerLine) {
                    vm.activeTab = TRANSACTION.PurchaseOrderTabListId.DetailPerLine;
                    $state.go(TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAILLIST_PART_STATE);
                } else {
                    vm.activeTab = TRANSACTION.PurchaseOrderTabListId.Summary;
                    $state.go(TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAILLIST_STATE);
                }
            }
        };
        setActiveTab();

        vm.onTabChanges = (item) => vm.title = item.title;

        vm.setCurrentTabAsDefaultForEmp = (selectedIndex) => {
            const objTab = {
                userId: vm.loginUser.userid,
                configurationID: CORE.ConfigurationMasterKeyList.DefaultPurchaseOrderListTabID.id,
                configurationValue: selectedIndex
            };
            vm.cgBusyLoading = MyProfileFactory.saveUserConfiguration().query(objTab).$promise.then((resp) => {
                if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                    BaseService.loginUser.userConfiguration.defaultPurchaseOrderListTabID = objTab.configurationValue;
                     /* only for debug purpose - [S]*/
                    const tractActivityLog = getLocalStorageValue('tractActivityLog');
                    if (tractActivityLog && Array.isArray(tractActivityLog)) {
                    const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, '') , message: 'Set Loginuser: purchase order.' };
                    tractActivityLog.push(obj);
                    setLocalStorageValue('tractActivityLog', tractActivityLog);
                    }
                    /* [E]*/
                    BaseService.setLoginUser(BaseService.loginUser);
                    _.each(vm.tabList, (detItem) => {
                        if (detItem.id === objTab.configurationValue) {
                            detItem.isDefaultTab = true;
                        } else {
                            detItem.isDefaultTab = false;
                        }
                    });
                }
            }).catch((error) => BaseService.getErrorLog(error));
        };

        vm.AddPurchaseOrderButtonObj = {
            buttonText: 'Add Purchase Order',
            buttonRoute: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAIL_STATE,
            buttonParams: { id: null }
        };
    }
})();
