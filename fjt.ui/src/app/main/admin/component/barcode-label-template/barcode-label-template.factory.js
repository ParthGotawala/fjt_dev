(function () {
  'use strict';

  angular
    .module('app.admin.barcode-label-template')
    .factory('BarcodeLabelTemplateFactory', BarcodeLabelTemplateFactory);

  /** @ngInject */
  function BarcodeLabelTemplateFactory($resource, CORE) {
    return {
      barcode_label_template: () => $resource(CORE.API_URL + 'barcode_label_template/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        },
        update: {
          method: 'PUT'
        }
      }),
      retrieveBarcodeLabelTemplateList: () => $resource(CORE.API_URL + 'barcode_label_template/retrieveBarcodeLabelTemplateList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteBarcodeLabelTemplateDelimiter: () => $resource(CORE.API_URL + 'barcode_label_template/deleteBarcodeLabelTemplateDelimiter', {
        id: '@_id'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getDataElementFields: () => $resource(CORE.API_URL + 'barcode_label_template/getDataElementFields', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      deleteBarcodeLabelTemplate: () => $resource(CORE.API_URL + 'barcode_label_template/deleteBarcodeLabelTemplate', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
