(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('COFCDocumentController', COFCDocumentController);

  /** @ngInject */
  function COFCDocumentController($stateParams, $scope, CORE, ReceivingMaterialFactory, BaseService) {
    const vm = this;
    $scope.$parent.vm.selectedNavItem = CORE.ReceivingMatirialTab.COFCDocument.Name;
    vm.umidId = $stateParams.id;
    vm.componentSidStockEntityName = CORE.AllEntityIDS.Component_sid_stock.Name;
    vm.extraEntityList = [];
    vm.showFlag = false;
    vm.isSplitUID = false;

    const getUMIDDetailsById = () => {
      if (vm.umidId) {
        vm.cgBusyLoading = ReceivingMaterialFactory.getUMIDDetailsById().query({ id: vm.umidId, uid: null }).$promise.then((response) => {
          if (response && response.data && response.data.umidDetail) {
            vm.uidDetail = response.data.umidDetail;
            getCofcDocumentDetails();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    getUMIDDetailsById();

    const getCofcDocumentDetails = () => {
      var selectedIDs = [];
      selectedIDs.push(vm.uidDetail.id);
      if (vm.uidDetail.parentUIDId) {
        selectedIDs.push(vm.uidDetail.parentUIDId);
      }
      const objIDs = {
        umid: selectedIDs
      };
      vm.cgBusyLoading = ReceivingMaterialFactory.getCofcDocumentDetails().query({ objIDs: objIDs }).$promise.then((response) => {
        if (response) {
          vm.showFlag = true;
          let extraEntityObj = {};
          vm.receiveMaterial = response.data.receiveMaterial;
          vm.genericCategory = response.data.genericCategory;
          extraEntityObj = {
            entityId: CORE.AllEntityIDS.PackingSlip.ID,
            entityName: CORE.AllEntityIDS.PackingSlip.Name,
            refTransId: _.map(response.data.receiveMaterial, (data) => data.packing_slip_material_receive_det.refPackingSlipMaterialRecID).join(','),
            fileGroupBy: _.map(response.data.genericCategory, 'gencCategoryID').join(',')
          };
          vm.extraEntityList.push(extraEntityObj);
          extraEntityObj = {
            entityId: CORE.AllEntityIDS.Component_sid_stock.ID,
            entityName: CORE.AllEntityIDS.Component_sid_stock.Name,
            refTransId: vm.uidDetail.parentUIDId,
            fileGroupBy: _.map(response.data.genericCategory, 'gencCategoryID').join(',')
          };
          vm.extraEntityList.push(extraEntityObj);
          vm.fileGroupBy = _.map(response.data.genericCategory, 'gencCategoryID');
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
  }
})();
