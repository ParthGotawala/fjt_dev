(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('TreeViewPopupController', TreeViewPopupController);

    /** @ngInject */
    function TreeViewPopupController($mdDialog, data) {
        const vm = this;
        vm.data = data;
        _.each(data.certificateData.standardType.standardType, (standardclass) => {
            if (standardclass.certificateStandardID == vm.data.certificateId)
                standardclass.isActive = true;
            else
                standardclass.isActive = false;
            if (vm.data.selectedClass) {
                _.each(standardclass.CertificateStandard_Class, (clas) => {
                    if (clas.classID == vm.data.selectedClass.classID) {
                        clas.isActive = true;
                    }
                    else {
                        clas.isActive = false;
                    }
                });
            }
        });
        vm.treeData = data.certificateData;
        vm.cancel = () => {
            $mdDialog.cancel();
        };
    }
})();