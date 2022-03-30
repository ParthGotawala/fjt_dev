(function () {
  'use strict';

  angular
    .module('app.admin.labeltemplates')
    .factory('LabelTemplatesFactory', LabelTemplatesFactory);

  /** @ngInject */
  function LabelTemplatesFactory($resource, $http, CORE) {
    return {
      labeltemplates: () => $resource(CORE.API_URL + 'labeltemplates/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false
        },
        update: {
          method: 'PUT'
        }
      }),
      retriveLabelTemplatesList: () => $resource(CORE.API_URL + 'labeltemplates/retriveLabelTemplatesList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteLabelTemplates: () => $resource(CORE.API_URL + 'labeltemplates/deleteLabelTemplates', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      createLabelTemplate: () => $resource(CORE.API_URL + 'labeltemplates/createLabelTemplate', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      updateLabelTemplate: () => $resource(CORE.API_URL + 'labeltemplates/updateLabelTemplate', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      verifyLabelTemplate: () => $resource(CORE.API_URL + 'labeltemplates/verifyLabelTemplate', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPrinterAndLabelTemplateData: () => $resource(CORE.API_URL + 'labeltemplates/getPrinterAndLabelTemplateData', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      downloadSampleFileIntegration: (downloadDocObj) => $http.post(CORE.API_URL + 'labeltemplates/downloadSampleFileIntegration', downloadDocObj,{ responseType: 'arraybuffer' }).then((response) =>  response, (error) => error)
    };
  }
})();
