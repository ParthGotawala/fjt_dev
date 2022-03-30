(function () {
  'use strict';

  angular
    .module('app.workorder')
    .factory('ComponentNicknameWOBuildDetailFactory', ComponentNicknameWOBuildDetailFactory);

  /** @ngInject */
  function ComponentNicknameWOBuildDetailFactory($resource, CORE) {
    return {
      getCompNicknameWObuildSummaryInfo: () => $resource(CORE.API_URL + 'compNicknameWOBuildDet/getCompNicknameWObuildSummaryInfo', {
        obj: '@_obj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getWOBuildDetailInfoByByAssyNickName: () => $resource(CORE.API_URL + 'compNicknameWOBuildDet/getWOBuildDetailInfoByByAssyNickName', {
        obj: '@_obj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getLastWOBuildDetByCompNickname: () => $resource(CORE.API_URL + 'compNicknameWOBuildDet/getLastWOBuildDetByCompNickname', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
