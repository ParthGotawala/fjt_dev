(function () {
  'use strict';

  angular
    .module('app.admin',
      [
        'app.admin.user',
        'app.admin.role',
        'app.admin.customer',
        'app.admin.employee',
        'app.admin.errorLogs',
        'app.admin.supplierlimit',
        //'app.admin.otherPermission',
        'app.admin.certificate-standard',
        'app.admin.standardClass',
        'app.admin.assyType',
        'app.admin.department',
        'app.admin.equipment',
        'app.admin.genericcategory',
        'app.admin.inputfield',
        'app.admin.labeltemplates',
        'app.admin.standardmessage',
        'app.admin.defectCategory',
        'app.admin.assemblyStock',
        'app.admin.eco',
        'app.admin.page',
        'app.admin.pageright',
        'app.admin.assignrightsandfetures',
        'app.admin.component',
        'app.admin.manufacturer',
        'app.admin.unit',
        'app.admin.barcode-label-template',
        'app.admin.rfqsetting',
        'app.admin.whoacquiredwho',
        'app.admin.componentStandardDetails',
        'app.admin.dynamicmessage',
        'app.admin.country',
        'app.admin.unitconversion',
        'app.admin.componentLogicalGroup',
        'app.admin.scanner',
        'app.admin.aliasPartsValidation',
        'app.admin.componentpricebreakdetails',
        'app.admin.operatingtemperatureconversion',
        'app.admin.purchaseincominginspectionreq',
        'app.admin.calibrationdetails',
        'app.admin.supplierattributetemplate',
        'app.admin.fob',
        'app.admin.releasenotes',
        'app.admin.bank',
        'app.admin.camera',
        'app.admin.picturestation',
        'app.admin.chartofaccounts',
        'app.admin.accounttype',
        'app.admin.transactionmodes',
        'app.admin.cotactPerson',
        'app.admin.datecodeformat'
      ]
    )
    .config(config);

  /** @ngInject */
  function config($stateProvider, USER) {
    $stateProvider.state(USER.ADMIN_STATE, {
      url: USER.ADMIN_ROUTE,
      views: {
        'content@app': {
          template: '<div ui-view></div>'
        }
      }
    });
  }
})();
