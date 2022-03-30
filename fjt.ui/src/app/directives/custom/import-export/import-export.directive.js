(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('importExport', importExport);

    /** @ngInject */
    function importExport($state, $mdSidenav, $log, $sce, $timeout, $filter, Upload, WORKORDER,
        OperationDataelementFactory, ImportExportFactory, DialogFactory, BaseService, DataElementTransactionValueFactory,
        CORE, OPERATION, USER) {
        var directive = {
            restrict: 'E',
            replace: true,
            scope: {
                entity: '=?',
                model: '=?',
                isImport: '=',
                loadData: '&',
                entityTableName: '=?'
            },
            controller: importExportctrl,
            controllerAs: 'vm'
        };
        return directive;


        /** @ngInject */
        /**
        * Controller for text-angular define before load directive
        *
        * @param
        */

        function importExportctrl($scope, $element, $attrs) {
            var vm = this;
            vm.entity = $scope.entity;
            vm.model = $scope.model;
            let entityTableName = $scope.entityTableName;
            if (vm.model) {
                vm.cgBusyLoading = ImportExportFactory.getEntityFieldListByTableName().query({ entityTableName: entityTableName }).$promise.then((res) => {
                    let data = {};
                    _.each(res.data, (item) => {
                        item['selectedExcelField'] = null;
                    });
                    data.dbfield = res.data;

                    /* Remove unused db fields from mapping -- case : when same table used for different entity */
                    let importExportEntityConst = CORE.Import_export[vm.entity];
                    if (importExportEntityConst && importExportEntityConst.excludeNotUsedMappingDbFields) {
                        data.dbfield = data.dbfield.filter(function (item) {
                            return importExportEntityConst.excludeNotUsedMappingDbFields.indexOf(item.field) === -1;
                        });
                    }

                    data.entity = vm.entity;
                    data.entitymodel = vm.model;

                    //create dummy event for Dialog to follow theam
                    let ev = angular.element.Event('click');
                    angular.element('body').trigger(ev);

                    DialogFactory.dialogService(
                        CORE.IMPORT_FILE_POPUP_CONTROLLER,
                        CORE.IMPORT_FILE_POPUP_VIEW,
                        ev,
                        data).then((val) => {
                            $scope.loadData();
                            $scope.isImport = false;
                        }, (val) => {
                            $scope.isImport = false;
                        },
                            (err) => {
                                return BaseService.getErrorLog(err);
                            });
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }

        }
    }
})();