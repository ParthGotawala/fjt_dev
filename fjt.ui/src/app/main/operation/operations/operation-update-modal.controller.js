(function () {
    'use strict';

    angular
        .module('app.operation.operations')
        .controller('OperationUpdateModalController', OperationUpdateModalController);

    /** @ngInject */
    function OperationUpdateModalController(data, OperationFileFactory, Upload, BaseService) {
        const vm = this;
        vm.operation = {};
        vm.operation.operationKeyTypes = {};
        vm.fieldType = ['User', 'Date', 'String', 'Integer'];
        vm.LabelConstant = CORE.LabelConstant;

        /* key and type display */
        vm.operation.operationKeyTypes = {
            items: [],
        };
        const template = {
            created: false,
        };
        vm.operation.operationKeyTypes.items.push(angular.copy(template)); // eslint-disable-line no-undef

        /* file template*/
        vm.operation.operationFiles = {
            items: [],
        };
        const fileTemplate = {
            created: false,
        };
        vm.operation.operationFiles.items.push(angular.copy(fileTemplate)); // eslint-disable-line no-undef

        vm.operation = data;
        vm.key = (keyTypeItem) => {
            if (keyTypeItem.created === false) {
                keyTypeItem.created = true;
                vm.operation.operationKeyTypes.push(angular.copy(template)); // eslint-disable-line no-undef
            }
        };
        vm.operation.operationKeyTypes.push(angular.copy(template)); // eslint-disable-line no-undef
        vm.multiModalFile = (item) => {
            if (item.created === false) {
                item.created = true;
                item.heading = item.heading;
                vm.operation.operationFiles.push(angular.copy(fileTemplate)); // eslint-disable-line no-undef
            }
        };
        vm.operation.operationFiles.push(angular.copy(fileTemplate)); // eslint-disable-line no-undef

        vm.deleteFileRecord = (index) => {
            OperationFileFactory.delete({
                id: vm.operation.operationFiles[index].id,
            }).$promise.then(() => {
                vm.operation.operationFiles.splice(index, 1);
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        };

        vm.clear = () => {
            Object.keys(vm.operation).forEach((key) => {
                vm.operation[key] = '';
            });

            vm.operation = {
                items: [],
            };
            vm.operation.items.push(angular.copy(template));
            vm.operation.operationFiles = {
                items: [],
            };
            vm.operation.operationFiles.items.push(angular.copy(vm.fileTemplate)); // eslint-disable-line
            vm.operationUpdateForm.$setPristine();
            vm.operationUpdateForm.$setUntouched();
        };

        /* update function*/
        vm.ok = () => {
            vm.operation.operationKeyTypes.splice(vm.operation.operationKeyTypes.length - 1, 1);
            vm.operation.operationFiles.splice(vm.operation.operationFiles.length - 1, 1);
            Upload.upload({
                url: `${OPERATION.OPERATION_PATH}/${data.id}`,
                method: 'PUT',
                data: vm.operation,
            }).then(() => {
                $mdDialog.cancel();
                // vm.gridData.data.push(res.data);
                vm.clear();
                // $uibModalInstance.close();
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        };

        /* close modal*/
        vm.cancel = () => {
            $mdDialog.cancel();
        };
    }

})();