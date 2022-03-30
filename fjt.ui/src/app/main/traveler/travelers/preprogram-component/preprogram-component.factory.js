(function () {
  'use strict';

  angular.module('app.traveler.travelers').factory('PreProgramComponentFactory', PreProgramComponentFactory);

  /** @ngInject */
  function PreProgramComponentFactory
    ($resource, CORE) {
    return {
      // getAllPreProgComponentList: () => $resource(CORE.API_URL + 'workorder_preprogcomp/retrivePreProgComponents/:woID', {
      //   woID: '@_woID'
      // },
      //   {
      //     query: {
      //       isArray: false,
      //       method: 'GET'
      //     }
      //   }),
      getPreProgComponent: () => $resource(CORE.API_URL + 'workorder_preprogcomp/:woPreProgCompID', {
        woPreProgCompID: '@_woPreProgCompID'
      },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      saveWOPreProgramComponent: () => $resource(CORE.API_URL + 'workorder_preprogcomp/saveWOPreProgramComponent', null, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteWOPreProgramComponent: () => $resource(CORE.API_URL + 'workorder_preprogcomp/deleteWOPreProgramComponent', null, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveWOPreprogComp: () => $resource(CORE.API_URL + 'workorder_trasn_preprogram_comp', null, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getWOTransPreprogComponentsList: () => $resource(CORE.API_URL + 'workorder_trasn_preprogram_comp/getWOTransPreprogComponents', null,
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      getAllProgramingPartList: () => $resource(CORE.API_URL + 'component/getAssyWiseAllProgramingComponent', {
      },
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      validateUMIDAndGetPartDetForPreProgram: () => $resource(CORE.API_URL + 'workorder_trasn_preprogram_comp/validateUMIDAndGetPartDetForPreProgram', null, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      updateWOPreProgramComponent: () => $resource(CORE.API_URL + 'workorder_preprogcomp/updateWOPreProgramComponent', null, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
