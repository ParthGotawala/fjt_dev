(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('equipmentHeaderDetails', equipmentHeaderDetails);

  /** @ngInject */
  function equipmentHeaderDetails() {
    var directive = {
      restrict: 'E',
      scope: {
        headerDetails: "=",
      },
      templateUrl: 'app/directives/custom/equipment-header-details/equipment-header-details.html',
      controller: equipmentHeaderDetailsCtrl,
      controllerAs: 'vm'
    };
    return directive;
    /** @ngInject */
    function equipmentHeaderDetailsCtrl($scope, CORE, USER, DialogFactory, RFQTRANSACTION, BaseService) {
      var vm = this;
      vm.headerObj = $scope.headerDetails;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.LabelConstant = CORE.LabelConstant;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;

      // operation name
      vm.headerObj.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, vm.headerObj.opName, vm.headerObj.opNumber);
      vm.headerObj.rohsIcon = vm.headerObj.isTraveler ? vm.headerObj.rohsIcon : stringFormat('{0}{1}', vm.rohsImagePath, vm.headerObj.rohsIcon);
      // vm.Wo_Op_Cleaning_Type = CORE.Wo_Op_Cleaning_Type;
      vm.headerObj.fluxTypeList = [];
      vm.headerObj.fluxTypeList.push({
        value: vm.headerObj.opFluxNotApplicable, icon: CORE.FluxTypeIcon.notApplicableIcon, toolTip: CORE.FluxTypeToolTip.notApplicable, isShowIcon: true
      });
      vm.headerObj.fluxTypeList.push({
        value: vm.headerObj.opNoClean, icon: CORE.FluxTypeIcon.noCleanIcon, toolTip: CORE.FluxTypeToolTip.noClean, isShowIcon: true
      });
      vm.headerObj.fluxTypeList.push({
        value: vm.headerObj.opWaterSoluble, icon: CORE.FluxTypeIcon.waterSolubleIcon, toolTip: CORE.FluxTypeToolTip.waterSoluble, isShowIcon: true
      });

      /*Used to goto equipment list*/
      vm.goToEquipmentList = () => {
        BaseService.goToEquipmentWorkstationList();
      }

      /*Move to equipment page*/
      vm.goToManageEquipmentWorkstation = (equip) => {
        BaseService.goToManageEquipmentWorkstation(equip.eqpID);
      }

      /*
     * Author :  Vaibhav Shah
     * Purpose : View BOM assy. tab
     */
      vm.goToComponentBOM = () => {
        BaseService.goToComponentBOM(vm.headerObj.partID);
        return false;
      }

      /*
     * Author :  Vaibhav Shah
     * Purpose : go to assy list 
     */
      vm.goToAssyList = () => {
          BaseService.goToPartList();
        return false;
      }

      /*
      * Author :  Vaibhav Shah
      * Purpose : go to manage part number
      */
      vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG.toLowerCase(), vm.headerObj.partID, USER.PartMasterTabs.Detail.Name);
        return false;
      }

      /*
       * Author :  Vaibhav Shah
       * Purpose : Go to Work Order List
       */
      vm.goToWorkorderList = () => {
        BaseService.goToWorkorderList();
        return false;
      }

      /*
      * Author :  Vaibhav Shah
      * Purpose : Go to Work Order Details page
      */
      vm.goToWorkorderDetails = () => {
        BaseService.goToWorkorderDetails(vm.headerObj.woID);
        return false;
      }

      /*Move to Work Order operation detail page*/
      vm.goToWorkorderOperationDetails = () => {
        BaseService.goToWorkorderOperationDetails(vm.headerObj.woOPID);
      }

      /*Move to Work Order operation list page*/
      vm.goToWorkorderOperations = () => {
        BaseService.goToWorkorderOperations(vm.headerObj.woID);
      }

      // view assembly at glance from costing module
      vm.AssyAtGlance = (e) => {
        let obj = {
          partID: vm.headerObj.partID,
          mfgPNDescription: vm.headerObj.mfgPNDescription
        };
        DialogFactory.dialogService(
          RFQTRANSACTION.ASSEMBLY_AT_GLANCE_CONTROLLER,
          RFQTRANSACTION.ASSEMBLY_AT_GLANCE_VIEW,
          e,
          obj).then(() => {
          }, (data) => {
          }, (err) => {
            return BaseService.getErrorLog(err);
          });
      }


      // go to kit allocation list
      vm.goToKitList = () => {
        BaseService.goToKitList(vm.headerObj.salesOrderDetID, vm.headerObj.partID, null);
        return false;
      }
      //go to sales order list page
      vm.gotoSalesorderList = () => {
        BaseService.goToSalesOrderList();
      }

      /* display work order sales order header all details while click on that link*/
      vm.gotoMangeSalesorder = (ev) => {
        if (vm.headerObj.poNumber && vm.headerObj.salesOrderNumber) {
          let data = angular.copy(vm.headerObj);
          DialogFactory.dialogService(
            CORE.WO_SO_HEADER_DETAILS_MODAL_CONTROLLER,
            CORE.WO_SO_HEADER_DETAILS_MODAL_VIEW,
            ev,
            data).then(() => {

            }, ((result) => {

            }), (error) => {
              return BaseService.getErrorLog(error);
            });
        }
      }

    }
  }
})();
