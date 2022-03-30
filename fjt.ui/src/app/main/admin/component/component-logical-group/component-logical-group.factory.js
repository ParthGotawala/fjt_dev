(function () {
  'use strict';

  angular
    .module('app.admin.componentLogicalGroup')
    .factory('ComponentLogicalGroupFactory', ComponentLogicalGroupFactory);

  /** @ngInject */

  function ComponentLogicalGroupFactory($resource, CORE) {
    return {
      retriveComponentLogicalGroup: () => $resource(CORE.API_URL + 'componentLogicalGroup/retriveComponentLogicalGroup', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          },
          update: {
            method: 'PUT'
          }
        }),
      deleteComponentLogicalGroup: () => $resource(CORE.API_URL + 'componentLogicalGroup/deleteComponentLogicalGroup', {
        objIDs: '@_objIDs'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      createComponentLogicalGroup: () => $resource(CORE.API_URL + 'componentLogicalGroup/createComponentLogicalGroup', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      updateComponentLogicalGroup: () => $resource(CORE.API_URL + 'componentLogicalGroup/updateComponentLogicalGroup/:id', { id: '@_id' },
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      getMountingTypeList: () => $resource(CORE.API_URL + 'componentLogicalGroup/getMountingTypeList', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      saveLogicalGroupAlias: () => $resource(CORE.API_URL + 'componentLogicalGroup/saveLogicalGroupAlias',
        {
          query: {
            method: 'POST',
            isArray: true
          }
        }),
      getLogicalGroupAlias: () => $resource(CORE.API_URL + 'componentLogicalGroup/getLogicalGroupAlias', { listObj: '@_listObj' },
        {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
      checkMountingGroupAlreadyExists: () => $resource(CORE.API_URL + 'componentLogicalGroup/checkMountingGroupAlreadyExists',
        { objs: '@_objs' }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retrieveMountingTypesNotAddedInGroup: () => $resource(CORE.API_URL + 'componentLogicalGroup/retrieveMountingTypesNotAddedInGroup', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        })
    };
  }
})();
