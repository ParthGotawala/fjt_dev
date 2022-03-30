(function () {
  'use strict';

  angular
    .module('app.admin.inputfield')
    .factory('InputFieldFactory', InputFieldFactory);

  /** @ngInject */
  function InputFieldFactory($resource, CORE) {
    return {
      InputField: () => $resource(CORE.API_URL + 'inputfield/:id', {}, {
        query: {
          isArray: false,
          method: 'GET'
        },
        update: {
          method: 'PUT'
        }
      }),
      retriveInputFieldList: () => $resource(CORE.API_URL + 'inputfield/retriveInputFieldList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteInputField: () => $resource(CORE.API_URL + 'inputfield/deleteInputField', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkUniqueName: () => $resource(CORE.API_URL + 'inputfield/checkUniqueName', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
