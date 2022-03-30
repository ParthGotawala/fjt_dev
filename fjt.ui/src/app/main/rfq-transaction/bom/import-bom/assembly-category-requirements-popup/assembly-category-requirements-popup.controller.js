(function () {
    'use strict';

    angular
        .module('app.rfqtransaction')
        .controller('AssemblyCategoryRequirementsController', AssemblyCategoryRequirementsController);

    /** @ngInject */
    function AssemblyCategoryRequirementsController($mdDialog, CORE, RFQTRANSACTION, USER, data, BaseService, DialogFactory, ComponentFactory) {

        const vm = this;
        vm.EmptyMesssagePart = USER.ADMIN_EMPTYSTATE.RFQ_SPECIFIC_PART_REQUIREMENTS;
        vm.mountingTypes = data.mountingTypes;
        vm.functionalTypes = data.functionalTypes;
        vm.LabelConstant = CORE.LabelConstant;
        vm.usedFunctionalType = [];
        vm.usedMountingTypes = [];
        vm.partID = data.partID;
        vm.sectionFlex = 100;
        init();

        vm.cancel = () => {
            $mdDialog.cancel();
        };

        function init() {
            if (vm.functionalTypes && vm.functionalTypes.length) {
                var unUsedFunctionalType = _.filter(vm.functionalTypes, { isUsed: false });
                vm.usedFunctionalType = _.filter(vm.functionalTypes, { isUsed: true });
                if (unUsedFunctionalType && unUsedFunctionalType.length > 0) {
                    vm.unUsedFunctionalTypeString = stringFormat(CORE.MESSAGE_CONSTANT.FUNCTIONAL_TYPE_ERROR_DESCRIPTION, _.join(_.map(unUsedFunctionalType, 'name'), ', '));

                }
            }
            if (vm.mountingTypes && vm.mountingTypes.length) {
                var unUsedMountingTypes = _.filter(vm.mountingTypes, { isUsed: false });
                vm.usedMountingTypes = _.filter(vm.mountingTypes, { isUsed: true });
                if (unUsedMountingTypes && unUsedMountingTypes.length > 0) {
                    vm.unUsedMountingTypesString = stringFormat(CORE.MESSAGE_CONSTANT.MOUNTING_TYPE_ERROR_DESCRIPTION, _.join(_.map(unUsedMountingTypes, 'name'), ', '));
                }
            }
            if (vm.usedFunctionalType && vm.usedFunctionalType.length && vm.usedMountingTypes && vm.usedMountingTypes.length) {
                vm.sectionFlex = 50;
            }
        }

        //go to manage part number
        vm.goToAssyMaster = () => {
            BaseService.goToComponentDetailTab(null, vm.partID);
            return false;
        }

        
    }

})();
