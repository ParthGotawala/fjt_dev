(function () {
    'use strict';
    angular
        .module('app.core')
        .directive('excelReader', excelReader);

    /** @ngInject */
    function excelReader() {
        return {
            scope: {
                erOptions: '='
            },
            restrict: 'A',
            link: function ($scope, $element, attrs) {

                $scope.erOptions = $scope.erOptions ||$scope.eroOptions ||{};
                var fileElem = $element.find('#fi-excel')[0] || $element.find('#fiexcel')[0];
                DropSheet({
                    file: fileElem,
                    drop: $element[0],
                    multiple: false,
                    on: {
                        workstart: $scope.erOptions.workstart || $scope.eroOptions.workstart || angular.noop,
                        workend: $scope.erOptions.workend || $scope.eroOptions.workend || angular.noop,
                        sheet: function (json, sheetnames, select_sheet_cb, file) {
                            $(fileElem).val('');
                            if ($scope.erOptions.sheet)
                                $scope.erOptions.sheet(json, sheetnames, select_sheet_cb, file);
                        }
                    },
                    errors: {
                        badfile: $scope.erOptions.badfile  || angular.noop,
                        pending: $scope.erOptions.pending  || angular.noop,
                        failed: $scope.erOptions.failed  || angular.noop,
                        large: $scope.erOptions.large  || angular.noop,
                        multiplefile: $scope.erOptions.multiplefile  || angular.noop
                    }
                })
            }
        }
    }
})();
