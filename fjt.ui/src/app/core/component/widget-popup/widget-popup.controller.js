(function () {
    'use strict';

    angular
       .module('app.core')
        .controller('WidgetPopupController', WidgetPopupController);

    /** @ngInject */
    function WidgetPopupController(WIDGET, $mdDialog,data, BaseService) {
        const vm = this;      
        vm.chartTemplateID = data.chartTemplateID;
        vm.nameOfChart = data.nameOfChart;
        vm.cancel = () => {
            $mdDialog.cancel();
        };
        if (!vm.chartTemplateID) {
          vm.cancel();
        }
    }
})();
