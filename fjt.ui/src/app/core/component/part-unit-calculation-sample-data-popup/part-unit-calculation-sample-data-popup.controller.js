(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('PartUnitCalculationSampleDataPopupController', PartUnitCalculationSampleDataPopupController);

  /** @ngInject */
  function PartUnitCalculationSampleDataPopupController($mdDialog, DialogFactory, data, CORE) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.headerdata = [];
    const usedOperationDet = angular.copy(data);

    let assyHeaderObj = {};
    if (usedOperationDet.assyDetail.assyID) {
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
    }

    vm.sampleData = [{ MFG: 'MGCHEM', 'MFG PN': '8331S-15G', Unit: 15, UOM: 'Gram', Min: 1, Mult: 1, 'SPQ': 3, '1 Count = (1 * Unit)(UOM)': '1 Count = 15 Unit (Gram)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 45 Unit (Gram)', 'SPQ = ? Count': 'SPQ = 3 Count', 'Part# = ? gram': 'Part# = 15 Gram' }
      , { MFG: 'CHIPQUIK', 'MFG PN': 'SMD291150G', Unit: 150, UOM: 'Gram', Min: 1, Mult: 1, 'SPQ': 1, '1 Count = (1 * Unit)(UOM)': '1 Count = 150 Unit (Gram)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 150 Unit (Gram)', 'SPQ = ? Count': 'SPQ = 1 Count', 'Part# = ? gram': 'Part# = 150 Gram' },
    { MFG: 'CHIPQUIK', 'MFG PN': 'CQ4LF-128', Unit: 3.62, UOM: 'KG', Min: 1, Mult: 1, 'SPQ': 1, '1 Count = (1 * Unit)(UOM)': '1 Count = 3.62 Unit (KG)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 3.62 Unit (KG)', 'SPQ = ? Count': 'SPQ = 1 Count', 'Part# = ? gram': 'Part# = 3.62 KG' },
    { MFG: 'Stackpole Electronics Inc', 'MFG PN': 'RMCF0402ZT0R00', Unit: 3, UOM: 'EACH', Min: 10000, Mult: 10000, 'SPQ': 10000, '1 Count = (1 * Unit)(UOM)': '1 Count = 3 Unit (EACH)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 30000 Unit (EACH)', 'SPQ = ? Count': 'SPQ = 10000 Count', 'Part# = ? gram': 'Part# = 3 EACH' },
    { MFG: 'Brady Corporation', 'MFG PN': 'THT-2-423-10', Unit: 10000, UOM: 'EACH', Min: 1, Mult: 1, 'SPQ': 10000, '1 Count = (1 * Unit)(UOM)': '1 Count = 10000 Unit (EACH)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 100000000 Unit (EACH)', 'SPQ = ? Count': 'SPQ = 10000 Count', 'Part# = ? gram': 'Part# = 10000 EACH' },
    { MFG: 'CHIPQUIK', 'MFG PN': 'CQNRM', Unit: 10, UOM: 'MiliGram', Min: 1, Mult: 1, 'SPQ': 1, '1 Count = (1 * Unit)(UOM)': '1 Count = 10 Unit (MiliGram)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 10 Unit (MiliGram)', 'SPQ = ? Count': 'SPQ = 1 Count', 'Part# = ? gram': 'Part# = 10 MiliGram' },
    { MFG: 'CHIPQUIK', 'MFG PN': '78162 SL001', Unit: 30, UOM: 'MiliGram', Min: 1, Mult: 1, 'SPQ': 1, '1 Count = (1 * Unit)(UOM)': '1 Count = 30 Unit (MiliGram)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 30 Unit (MiliGram)', 'SPQ = ? Count': 'SPQ = 1 Count', 'Part# = ? gram': 'Part# = 30 MiliGram' },
    { MFG: 'TechSpray', 'MFG PN': '1638-5G', Unit: 5, UOM: 'Gallon', Min: 1, Mult: 1, 'SPQ': 1, '1 Count = (1 * Unit)(UOM)': '1 Count = 5 Unit (Gallon)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 5 Unit (Gallon)', 'SPQ = ? Count': 'SPQ = 1 Count', 'Part# = ? gram': 'Part# = 5 Gallon' },
    { MFG: 'TechSpray', 'MFG PN': '1638-G', Unit: 1, UOM: 'Gallon', Min: 1, Mult: 1, 'SPQ': 1, '1 Count = (1 * Unit)(UOM)': '1 Count = 1 Unit (Gallon)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 1 Unit (Gallon)', 'SPQ = ? Count': 'SPQ = 1 Count', 'Part# = ? gram': 'Part# = 1 Gallon' },
    { MFG: 'Jonard tools', 'MFG PN': 'R28BLK-0100', Unit: 100, UOM: 'Foot', Min: 1, Mult: 1, 'SPQ': 1, '1 Count = (1 * Unit)(UOM)': '1 Count = 100 Unit (Foot)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 100 Unit (Foot)', 'SPQ = ? Count': 'SPQ = 1 Count', 'Part# = ? gram': 'Part# = 100 Foot' },
    { MFG: 'Jonard tools', 'MFG PN': 'KSW28BLK-0100', Unit: 100, UOM: 'Foot', Min: 1, Mult: 1, 'SPQ': 100, '1 Count = (1 * Unit)(UOM)': '1 Count = 100 Unit (Foot)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 10000 Unit (Foot)', 'SPQ = ? Count': 'SPQ = 100 Count', 'Part# = ? gram': 'Part# = 100 Foot' },
    { MFG: 'Vector Electronics', 'MFG PN': 'W28-6HU', Unit: 45.72, UOM: 'Meter', Min: 1, Mult: 1, 'SPQ': 1, '1 Count = (1 * Unit)(UOM)': '1 Count = 45.72 Unit (Meter)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 45.72 Unit (Meter)', 'SPQ = ? Count': 'SPQ = 1 Count', 'Part# = ? gram': 'Part# = 45.72 Meter' },
    { MFG: 'Murata', 'MFG PN': 'GRM21BC81H475KE11L', Unit: 1, UOM: 'EACH', Min: 3000, Mult: 3000, 'SPQ': 3000, '1 Count = (1 * Unit)(UOM)': '1 Count = 1 Unit (EACH)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 3000 Unit (EACH)', 'SPQ = ? Count': 'SPQ = 3000 Count', 'Part# = ? gram': 'Part# = 1 EACH' },
    { MFG: 'TDK', 'MFG PN': 'C2012X6S1H475K125AC', Unit: 1, UOM: 'EACH', Min: 2000, Mult: 2000, 'SPQ': 2000, '1 Count = (1 * Unit)(UOM)': '1 Count = 1 Unit (EACH)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 2000 Unit (EACH)', 'SPQ = ? Count': 'SPQ = 2000 Count', 'Part# = ? gram': 'Part# = 1 EACH' },
    { MFG: 'Texas Instruments', 'MFG PN': 'TAS5630DKD', Unit: 1, UOM: 'EACH', Min: 29, Mult: 29, 'SPQ': 29, '1 Count = (1 * Unit)(UOM)': '1 Count = 1 Unit (EACH)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 29 Unit (EACH)', 'SPQ = ? Count': 'SPQ = 29 Count', 'Part# = ? gram': 'Part# = 1 EACH' },
    { MFG: 'Texas Instruments', 'MFG PN': 'TAS5630BDKD', Unit: 1, UOM: 'EACH', Min: 1, Mult: 1, 'SPQ': 29, '1 Count = (1 * Unit)(UOM)': '1 Count = 1 Unit (EACH)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 29 Unit (EACH)', 'SPQ = ? Count': 'SPQ = 29 Count', 'Part# = ? gram': 'Part# = 1 EACH' },
    { MFG: 'Texas Instruments', 'MFG PN': 'TAS5630BDKDR', Unit: 1, UOM: 'EACH', Min: 500, Mult: 500, 'SPQ': 500, '1 Count = (1 * Unit)(UOM)': '1 Count = 1 Unit (EACH)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 500 Unit (EACH)', 'SPQ = ? Count': 'SPQ = 500 Count', 'Part# = ? gram': 'Part# = 1 EACH' },
    { MFG: 'HellermannTyton', 'MFG PN': '596-00376', Unit: 250, UOM: 'EACH', Min: 1, Mult: 1, 'SPQ': 250, '1 Count = (1 * Unit)(UOM)': '1 Count = 250 Unit (EACH)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 62500 Unit (EACH)', 'SPQ = ? Count': 'SPQ = 250 Count', 'Part# = ? gram': 'Part# = 250 EACH' },
    { MFG: 'HellermannTyton', 'MFG PN': '596-00621', Unit: 250, UOM: 'EACH', Min: 1, Mult: 1, 'SPQ': 250, '1 Count = (1 * Unit)(UOM)': '1 Count = 250 Unit (EACH)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 62500 Unit (EACH)', 'SPQ = ? Count': 'SPQ = 250 Count', 'Part# = ? gram': 'Part# = 250 EACH' },
    { MFG: 'HellermannTyton', 'MFG PN': 'TAG76T1-795', Unit: 1000, UOM: 'EACH', Min: 1, Mult: 1, 'SPQ': 1000, '1 Count = (1 * Unit)(UOM)': '1 Count = 1000 Unit (EACH)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 1000000 Unit (EACH)', 'SPQ = ? Count': 'SPQ = 1000 Count', 'Part# = ? gram': 'Part# = 1000 EACH' },
    { MFG: 'TE Connectivity AMP Connectors', 'MFG PN': '5-146280-4', Unit: 1, UOM: 'EACH', Min: 1, Mult: 1, 'SPQ': 1, '1 Count = (1 * Unit)(UOM)': '1 Count = 1 Unit (EACH)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 1 Unit (EACH)', 'SPQ = ? Count': 'SPQ = 1 Count', 'Part# = ? gram': 'Part# = 1 EACH' },
    { MFG: 'TE Connectivity AMP Connectors', 'MFG PN': '5-146280-2', Unit: 1, UOM: 'EACH', Min: 1, Mult: 1, 'SPQ': 1, '1 Count = (1 * Unit)(UOM)': '1 Count = 1 Unit (EACH)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 1 Unit (EACH)', 'SPQ = ? Count': 'SPQ = 1 Count', 'Part# = ? gram': 'Part# = 1 EACH' },
    { MFG: 'TE Connectivity AMP Connectors', 'MFG PN': '5-146280-8', Unit: 1, UOM: 'EACH', Min: 1, Mult: 1, 'SPQ': 1, '1 Count = (1 * Unit)(UOM)': '1 Count = 1 Unit (EACH)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 1 Unit (EACH)', 'SPQ = ? Count': 'SPQ = 1 Count', 'Part# = ? gram': 'Part# = 1 EACH' },
    { MFG: 'MG Chemicals', 'MFG PN': '4860P-35G', Unit: 35, UOM: 'gram', Min: 5, Mult: 5, 'SPQ': 5, '1 Count = (1 * Unit)(UOM)': '1 Count = 35 Unit (gram)', 'SPQ = (SPQ * Unit) Units (UOM)': 'SPQ = 175 Unit (gram)', 'SPQ = ? Count': 'SPQ = ?? Count', 'Part# = ? gram': 'Part# = 35 gram' }];

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
