(function () {
    'use strict';

    angular
        .module('app.traveler.travelers')
        .controller('ViewExpirePartsPopUpController', ViewExpirePartsPopUpController);

    /** @ngInject */
    function ViewExpirePartsPopUpController($mdDialog, data, CORE, DialogFactory, BaseService, $filter) {
        const vm = this;
        if (!data || !data.expirePartList) {
            DialogFactory.closeDialogPopup();
            return;
        }
        vm.selectedItems = [];
        vm.LabelConstant = CORE.LabelConstant;
        vm.expirePartDet = data;
        let expirePartListCopy = [];
        expirePartListCopy = angular.copy(vm.expirePartDet.expirePartList);
        vm.dateDisplayFormat = _dateDisplayFormat;
        vm.debounceConstant = CORE.Debounce;
        vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;

        vm.queryPartExpiry = {
            order: '',
            search: '',
            limit: 5,
            page: 1,
            isPagination: false,
        };

        /* search from part expiry details */
        vm.searchPartExpiryInfo = () => {
            if (vm.queryPartExpiry.search) {
                let searchTxt = angular.copy(vm.queryPartExpiry.search).toLowerCase();

                vm.expirePartDet.expirePartList = _.filter(expirePartListCopy, (umidPartDetails) => {
                    return (umidPartDetails.uid.toLowerCase().indexOf(searchTxt) != -1)
                        || (umidPartDetails.PIDCode.toLowerCase().indexOf(searchTxt) != -1)
                        || (umidPartDetails.Warehouse.toLowerCase().indexOf(searchTxt) != -1)
                        || (umidPartDetails.Location_Bin.toLowerCase().indexOf(searchTxt) != -1)
                        || (($filter('date')(umidPartDetails.expiryDate, vm.dateDisplayFormat)).indexOf(searchTxt) != -1)
                        || (umidPartDetails.currStatus.toLowerCase().indexOf(searchTxt) != -1);
                });
            }
            else {
                vm.expirePartDet.expirePartList = angular.copy(expirePartListCopy);
            }
        }

        /* go to selected umid details  */
        vm.goToUMIDDetail = (selectedExpirePartData) => BaseService.goToUMIDDetail(selectedExpirePartData.componentSIDStockID);

        // go to bin list
        vm.goToBinList = () => {
            BaseService.goToBinList();
        }

        vm.cancel = () => {
            $mdDialog.cancel();
        };
    }
})();
