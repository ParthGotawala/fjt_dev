(function () {
  'use strict';

  angular
    .module('app.configuration.managetemplate')
    .factory('AgreementFactory', AgreementFactory);

  /** @ngInject */
  function AgreementFactory($resource, CORE, $http) {
    return {
      getAgreementTypes: () => $resource(CORE.IDENTITY_URL + 'Agreement/api/GetAgreementTypes/?templateType=:templateType', {
        templateType: '@_templateType'
      },
        {
          query: {
            isArray: false,
            method: 'GET',
            params: {}
          }
      }),

      getAgreementTemplate: (param) => $resource(CORE.IDENTITY_URL + 'Agreement/api/RetriveAgreementByTypeId/?agreementTypeID=:agreementTypeID', {
        agreementTypeID: '@_agreementTypeID'
      }, {
        query: {
          isArray: false,
          method: 'GET',
          params: param ? {
            agreementTypeID: param && param.agreementTypeID ? param.agreementTypeID : 0
          } : null
        }
      }),

      Agreement: () => $resource(CORE.IDENTITY_URL + 'Agreement/api/CreateUpdateAgreement/?agreementID=:agreementID', {
        agreementID: '@_agreementID'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        },
        update: {
          method: 'POST'
        }
      }),

      PublishAgreementTemplate: () => $resource(CORE.IDENTITY_URL + 'Agreement/api/PublishAgreementTemplate', {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      //getAgreementLatest: () => $resource(CORE.API_URL + 'agreement/retriveAgreement/:agreementTypeID', {
      //  agreementTypeID: '@_agreementTypeID'
      //}, {
      //  query: {
      //    isArray: false,
      //    method: 'GET',
      //    params: {}
      //  }
      //}),

      //called only in login& login response Controller. you can delete after remove that code.(as we move agreement signature in identityserver side , so no need that code)
      //getAgreementLatest: () => $resource(CORE.API_URL + 'agreement/retrivePublishedAgreementById/:agreementTypeID', {
      //  agreementTypeID: '@_agreementTypeID'
      //}, {
      //  query: {
      //    isArray: false,
      //    method: 'GET',
      //    params: {}
      //  }
      //}),

      saveAgreementType: () => $resource(CORE.IDENTITY_URL + 'Agreement/api/SaveAgreementType', {
      }, {
        query: {
          isArray: false
        },
        update: {
          method: 'PUT'
        }
      }),

      //not called anywhere - you can delete this method.
      //saveUserAgreement: () => $resource(CORE.API_URL + 'useragreement/', {
      //}, {
      //  query: {
      //    isArray: false,
      //    method: 'POST'
      //  }
      //}),


      //not called anywhere - you can delete this method.
      //checkUserAgreement: () => $resource(CORE.API_URL + 'checkUserAgreement/:id', {
      //  id: '@_id'
      //}, {
      //  query: {
      //    isArray: false,
      //    method: 'GET',
      //    params: {}
      //  }
      //}),

      retriveAgreementList: () => $resource(CORE.IDENTITY_URL +'Agreement/api/GetAgreementList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      retriveArchieveVersionDetails: () => $resource(CORE.IDENTITY_URL + 'agreement/api/RetriveArchieveVersionDetails', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      getAgreementDetails: (param) => $resource(CORE.IDENTITY_URL +'Agreement/api/GetAgreementDetails/?agreementTypeID=:agreementTypeID', {
        agreementTypeID: '@_agreementTypeID'
      }, {
        query: {
          isArray: false,
          method: 'GET',
          params: param ? {
            agreementTypeID: param && param.agreementTypeID ? param.agreementTypeID : 0
          } : null
        }
      }),

      getAgreedUserList: () => $resource(CORE.IDENTITY_URL + 'Agreement/api/GetAgreedUserList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      retriveUserSignUpAgreementList: () => $resource(CORE.IDENTITY_URL + 'Agreement/api/RetriveUserSignUpAgreementList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      checkDuplicateAgreementType: () => $resource(CORE.IDENTITY_URL + 'Agreement/api/CheckDuplicateAgreementType', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      getAgreementTemplateDetails: (obj) => $http.post(CORE.API_URL + 'agreement/getAgreementTemplateDetails', obj,
        { responseType: 'arraybuffer' }).then((response) => response, (error) => error)

    };
  }
})();
