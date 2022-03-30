(function () {
  'use strict';

  angular.module('app.core').factory('GenericFolderFactory', ['$resource', '$http', 'CORE', GenericFolderFactory]);

  /** @ngInject */
  function GenericFolderFactory($resource, $http, CORE) {
    return {
      genericFolderList: () => $resource(CORE.API_URL + 'generic_folder/getGenericFolder', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      createFolder: () => $resource(CORE.API_URL + 'generic_folder/createFolder', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retriveFolderListById: () => $resource(CORE.API_URL + 'generic_folder/retriveFolderListById', {

      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      renameFolder: () => $resource(CORE.API_URL + 'generic_folder/renameFolder', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      removeFileFolder: () => $resource(CORE.API_URL + 'generic_folder/removeFileFolder', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getFolderList: () => $resource(CORE.API_URL + 'generic_folder/getFolderList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      moveFileFolder: () => $resource(CORE.API_URL + 'generic_folder/moveFileFolder', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      moveAllDuplicateDocToDestinationBasedOnConfirmation: () => $resource(CORE.API_URL + 'generic_folder/moveAllDuplicateDocToDestinationBasedOnConfirmation', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getRecycleBinListByRefTransID: () => $resource(CORE.API_URL + 'generic_recycle_bin/getRecycleBinListByRefTransID', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      deleteGenericRecycleBinDetails: () => $resource(CORE.API_URL + 'generic_recycle_bin/deleteGenericRecycleBinDetails', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      restoreGenericRecycleBin: () => $resource(CORE.API_URL + 'generic_recycle_bin/restoreGenericRecycleBin', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getGoToRootFolderID: () => $resource(CORE.API_URL + 'generic_recycle_bin/getGoToRootFolderID', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
