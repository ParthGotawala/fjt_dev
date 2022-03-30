(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('isolateForm', isolateForm);

    /** @ngInject */
    function isolateForm() {
    
        return {
            restrict: 'A',
            replace: true,
            require: '?form',
            link: function (scope, element, attrs, formController) {
                if (!formController) {
                    return;
                }

                var parentForm = formController.$$parentForm; // Note this uses private API
                if (!parentForm) {
                    return;
                }

                // Remove this form from parent controller
                parentForm.$removeControl(formController);
            }
        };

    }
})();