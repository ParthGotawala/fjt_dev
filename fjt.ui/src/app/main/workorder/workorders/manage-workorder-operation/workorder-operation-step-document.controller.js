(function () {
    'use strict';

    angular
       .module('app.workorder.workorders')
       .controller('WorkorderOperationDocumentsController', WorkorderOperationDocumentsController);

    /** @ngInject */
    function WorkorderOperationDocumentsController($scope,
        OPERATION) {
        // Don't Remove this code
        // Don't add any code before this
        $scope.vm = $scope.$parent.$parent.vm;
        //Add form name for check form dirty
        $scope.vm.CurrentForm = null;
        let vm = $scope.vm;
        // add code after this only
        // Don't Remove this code

        vm.previewDocument = false;
        vm.IsDocumentTab = true;
        vm.id = vm.operation.woOPID;
        vm.entity = vm.Workorder_operationEntity;

        vm.title = { "clusterName": null, "operation": vm.operation.opName }
        vm.fileList = {
        };
        vm.EmptyMesssageFileUpload = OPERATION.OPERATION_EMPTYSTATE.DOCUMENT_UPLOAD;
        /**
        * Step 3 Image Upload
        *
        * @param
        */
        vm.selected = {};
    };

    //angular
    //   .module('app.workorder.workorders'). = function () {
    //   };
})();