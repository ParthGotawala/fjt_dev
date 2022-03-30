(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('WorkorderOperationCleaningDetailListPopUpController', WorkorderOperationCleaningDetailListPopUpController);

  function WorkorderOperationCleaningDetailListPopUpController($mdDialog, CORE, BaseService, data) {
    const vm = this;
    vm.CORE = CORE;

    const NOT_PROCESS_TO_CHANGE_PART_CLEANING_TYPE = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.NOT_PROCESS_TO_CHANGE_PART_CLEANING_TYPE);
    const usedOperationDet = angular.copy(data);
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.FluxTypeIcon = CORE.FluxTypeIcon;
    vm.FluxTypeToolTip = CORE.FluxTypeToolTip;
    const woOpCleaningTypeEnum = CORE.Wo_Op_Cleaning_Type;
    const PROCEED_SAVE_CLEANING_TYPE = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.PROCEED_SAVE_CLEANING_TYPE);
    vm.workorderOperationList = usedOperationDet && usedOperationDet.woOperationList ? usedOperationDet.woOperationList : [];
    vm.waterSolubleWOOperationList = [];
    vm.noCleanWOOperationList = [];
    vm.naCleanWOOperationList = [];
    vm.woOpConfigureWithoutCleanType = [];
    vm.assyID = usedOperationDet && usedOperationDet.assyDetail ? usedOperationDet.assyDetail.assyID : 0;
    vm.partType = usedOperationDet && usedOperationDet.partType ? usedOperationDet.partType : '';

    const newTypeDet = {
      isNoClean: usedOperationDet ? usedOperationDet.isNoClean : false,
      isWaterSoluble: usedOperationDet ? usedOperationDet.isWaterSoluble : false,
      isFluxNotApplicable: usedOperationDet ? usedOperationDet.isFluxNotApplicable : false
    };
    const moduleName = (vm.partType === CORE.PartCategory.SubAssembly ? '' : CORE.LabelConstant.COMPONENT.Part.concat(' ', 'From')).toLowerCase();
    const assyPidCode = usedOperationDet && usedOperationDet.assyDetail ? usedOperationDet.assyDetail.pidCode : '';

    const currentCheckedValue = newTypeDet.isFluxNotApplicable ? vm.LabelConstant.Operation.NotApplicable : (newTypeDet.isNoClean ? vm.LabelConstant.Operation.NoClean : vm.LabelConstant.Operation.WaterSoluble);
    vm.MessageOnRestrictNoCleanChecked = stringFormat(NOT_PROCESS_TO_CHANGE_PART_CLEANING_TYPE.message, assyPidCode, currentCheckedValue, moduleName, vm.LabelConstant.Operation.NoClean);
    vm.MessageOnRestrictWaterSolubleChecked = stringFormat(NOT_PROCESS_TO_CHANGE_PART_CLEANING_TYPE.message, assyPidCode, currentCheckedValue, moduleName, vm.LabelConstant.Operation.WaterSoluble);
    vm.MessageOnRestrictNotApplicableChecked = stringFormat(NOT_PROCESS_TO_CHANGE_PART_CLEANING_TYPE.message, assyPidCode, currentCheckedValue, moduleName, vm.LabelConstant.Operation.NotApplicable);
    vm.headerdata = [];
    //go to assy list
    vm.goToAssyList = () => {
        BaseService.goToPartList();
      return false;
    };

    // go to manage assembly
    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.assyID);
      return false;
    };

    /* to go at work order details page  */
    vm.goToWorkorderDetails = (woID) => {
      BaseService.goToWorkorderDetails(woID);
      return false;
    };

    //manage workorder operation
    vm.manageWorkorderOperation = (woOPID) => {
      BaseService.goToWorkorderOperationDetails(woOPID);
    };
    let assyHeaderObj = {};
    if (vm.partType === CORE.PartCategory.SubAssembly) {
      assyHeaderObj = {
        label: CORE.LabelConstant.Assembly.ID,
        value: usedOperationDet && usedOperationDet.assyDetail ?
          (usedOperationDet.assyDetail.pidCode ? usedOperationDet.assyDetail.pidCode.trim() : usedOperationDet.assyDetail.pidCode) : null,
        displayOrder: 2,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: null,
        isCopy: true,
        isAssy: true,
        isCopyAheadLabel: false,
        imgParms: {
          imgPath: usedOperationDet && usedOperationDet.assyDetail ? usedOperationDet.assyDetail.assyRohsIcon : null,
          imgDetail: usedOperationDet && usedOperationDet.assyDetail ? usedOperationDet.assyDetail.assyRohsName : null
        }
      };
    } else {
      assyHeaderObj = {
        label: vm.LabelConstant.MFG.PID,
        value: usedOperationDet && usedOperationDet.assyDetail ?
          (usedOperationDet.assyDetail.pidCode ? usedOperationDet.assyDetail.pidCode.trim() : usedOperationDet.assyDetail.pidCode) : null,
        displayOrder: 1,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        isCopy: true,
        isCopyAheadLabel: true,
        imgParms: {
          imgPath: usedOperationDet && usedOperationDet.assyDetail ? usedOperationDet.assyDetail.assyRohsIcon : null,
          imgDetail: usedOperationDet && usedOperationDet.assyDetail ? usedOperationDet.assyDetail.assyRohsName : null
        },
        isCopyAheadOtherThanValue: true,
        copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
        copyAheadValue: usedOperationDet && usedOperationDet.assyDetail ? usedOperationDet.assyDetail.MFGPN : null
      };
    };

    vm.headerdata.push(assyHeaderObj);

    let usedMaster = CORE.MasterPage.Workorder;

    vm.woOpConfigureWithoutCleanType = vm.workorderOperationList.filter((x) => x.woOPID === null);
    if (vm.woOpConfigureWithoutCleanType.length === 0) {
      vm.waterSolubleWOOperationList = vm.workorderOperationList.filter((x) => x.cleaningType === woOpCleaningTypeEnum.Water_Soluble);
      vm.noCleanWOOperationList = vm.workorderOperationList.filter((x) => x.cleaningType === woOpCleaningTypeEnum.No_Clean);
      vm.naCleanWOOperationList = vm.workorderOperationList.filter((x) => x.cleaningType === woOpCleaningTypeEnum.Not_Applicable);
      usedMaster = CORE.MasterPage.WorkorderOperation;
    }

    if (vm.partType === CORE.PartCategory.SubAssembly) {
      vm.isNoCleanAndWaterSolubleBothChecked = vm.woOpConfigureWithoutCleanType.length > 0 ? true : (newTypeDet.isNoClean && newTypeDet.isWaterSoluble ? true : false);
    } else {
      vm.isNoCleanAndWaterSolubleBothChecked = newTypeDet.isFluxNotApplicable ? newTypeDet.isFluxNotApplicable : (newTypeDet.isNoClean && newTypeDet.isWaterSoluble ? true : false);
    }
    const ncCleaningType = vm.LabelConstant.Operation.NoClean;
    const wsCleaningType = vm.LabelConstant.Operation.WaterSoluble;
    const isContainNAType = vm.woOpConfigureWithoutCleanType.length > 0 ? 'without' : 'with';

    vm.MessageProceedSaveCleaningType = stringFormat(PROCEED_SAVE_CLEANING_TYPE.message, usedMaster, isContainNAType, ncCleaningType.concat(' or ', wsCleaningType));

    vm.cancel = () => {
      $mdDialog.cancel();
    };
    vm.proceed = (isProceed) => {
      $mdDialog.hide({ Proceed: isProceed });
    };
  }
})();
