(function () {
  'use strict';

  angular
    .module('app.customforms.entity')
    .controller('ManageCustomFormsDataElementController', ManageCustomFormsDataElementController);

  /** @ngInject */
  function ManageCustomFormsDataElementController(CORE, $timeout, $scope, BaseService, $state, EntityFactory,
    DataElementTransactionValueFactory, DataElementTransactionValuesManualFactory, CUSTOMFORMS) {
    //const vm = this;
    // Don't Remove this code
    // Don't add any code before this
    $scope.vm = $scope.$parent.$parent.vm;
    const vm = $scope.vm;
    // add code after this only
    // Don't Remove this code

    vm.fileList = {};
    vm.dataElementList = [];
    vm.entityID = $state.params.entityID;
    vm.RefTransID = $state.params.refTransID;
    const DynamicMasterEntityTreeTabs = CORE.DynamicMasterEntityTreeTabs;
    vm.DisplayStatusConst = CORE.DisplayStatus;

    //get custom forms entity status by id
    vm.getEntityStatus = (statusID) => BaseService.getOpStatus(statusID);

    if (vm.entityID) {
      vm.selectedEntity = _.find(vm.ManualEntities, (item) => item.entityID === parseInt(vm.entityID));
      if (!vm.selectedEntity) {
        $state.go(CUSTOMFORMS.CUSTOMFORMS_ENTITY_STATE);
        return;
      }
      else {
        vm.selectedTabFromTree = '1'; // static code case : while refresh manage data element page;
      }
      vm.SelectedEntityNameToDisplay = 'Manage' + ' ' + vm.selectedEntity.entityName;
      vm.isDisableEntityAccess = vm.selectedEntity.entityStatus === vm.DisplayStatusConst.Draft.ID;
      vm.headerdata = [
        { label: 'Status', value: vm.getEntityStatus(vm.selectedEntity.entityStatus), displayOrder: 1 }
      ];
      vm.SelectedEntityId = vm.selectedEntity.entityID;
    }
    //Set as current form when page loaded
    angular.element(() => {
      BaseService.currentPageForms = [vm.dynamicMasterEntityDetailForm];
    });


    vm.saveElementTransctionValuesManual = () => {
      //Used to focus on first error filed of form
      if (vm.dynamicMasterEntityDetailForm && BaseService.focusRequiredField(vm.dynamicMasterEntityDetailForm)) {
        return;
      }
      const dynamicControlList = DataElementTransactionValuesManualFactory.getDataElementTransactionList(vm.dataElementList);
      //console.log(dynamicControlList);
      DataElementTransactionValuesManualFactory.saveTransctionValue({
        referenceTransID: vm.RefTransID,
        entityID: vm.entityID,
        dataElementList: dynamicControlList.dataElementList,
        removeElementList: dynamicControlList.removeElementList,
        subFormTransList: dynamicControlList.subFormTransList,
        deletedsubFormTransIDs: dynamicControlList.deletedsubFormTransIDs,
        removeSubFormTransListConditional: dynamicControlList.removeSubFormTransListConditional,
        entityName: vm.selectedEntity ? vm.selectedEntity.entityName : 'field values'
      }, vm.fileList).then((res) => {
        if (res.data && res.data.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          //vm.selectedTab = 0;
          vm.fileList = {};
          if (vm.dynamicMasterEntityDetailForm) {
            vm.dynamicMasterEntityDetailForm.$setPristine();
          }
          $state.go(CUSTOMFORMS.CUSTOMFORMS_ENTITY_LIST_STATE, { entityID: vm.entityID }, { reload: true });
          DataElementTransactionValuesManualFactory.displaySuccessMessage(dynamicControlList.dataElementList);
          $scope.$emit('bindDynamicMasterTreeViewMain', { entityID: vm.entityID, tabTypeToSelect: DynamicMasterEntityTreeTabs.DataElementList.Type });
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
  }
})();
