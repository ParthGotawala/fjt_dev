(function () {
  'use strict';

  angular
    .module('app.admin.purchaseincominginspectionreq')
    .factory('PurchaseInspectionRequirementFactory', scanner);
  /** @ngInject */
  function scanner($resource, CORE) {
    return {
      getpurchaseInspectList: () => $resource(CORE.API_URL + 'purchaseinspection/getpurchaseInspectionList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getpurchaseInspectionRequirement: () => $resource(CORE.API_URL + 'purchaseinspection/getpurchaseInspectionRequirement/:id', {
        id: '@_id'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      savePurchaseInspection: () => $resource(CORE.API_URL + 'purchaseinspection/savePurchaseInspection/', {
      }, {
        query: {
          isArray: false
        },
        update: {
          method: 'PUT'
        }
      }),
      getPurchaseInspTemplateList: () => $resource(CORE.API_URL + 'purchaseinspectiontemplate/getPurchaseInspTemplateList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getPurchaseRequirementList: () => $resource(CORE.API_URL + 'purchaseinspection/getPurchaseRequirementList/', {
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      deletePurchaseRequirement: () => $resource(CORE.API_URL + 'purchaseinspection/deletePurchaseRequirement', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkDuplicatePurchaseRequirement: () => $resource(CORE.API_URL + 'purchaseinspection/checkDuplicatePurchaseRequirement', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deletePurchaseRequirementTemplate: () => $resource(CORE.API_URL + 'purchaseinspectiontemplate/deletePurchaseRequirementTemplate', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkDuplicateTemplate: () => $resource(CORE.API_URL + 'purchaseinspectiontemplate/checkDuplicateTemplate', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveTemplate: () => $resource(CORE.API_URL + 'purchaseinspectiontemplate/saveTemplate/', {
      }, {
        query: {
          isArray: false
        },
        update: {
          method: 'PUT'
        }
      }),
      whereUsedRequirementReference: () => $resource(CORE.API_URL + 'purchaseinspection/whereUsedRequirementReference', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      //getPurchaseRequirementTemplate: () => $resource(CORE.API_URL + 'purchaseinspectiontemplate/getPurchaseRequirementTemplate/:id', {
      //  id: '@_id'
      //}, {
      //  query: {
      //    method: 'GET',
      //    isArray: false
      //  }
      //}),
      updatePartRequiremmentCategorys: () => $resource(CORE.API_URL + 'purchaseinspection/updatePartRequiremmentCategorys', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
