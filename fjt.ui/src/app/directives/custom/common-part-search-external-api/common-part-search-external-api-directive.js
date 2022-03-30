(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('commonPartSearchExternalApi', commonPartSearchExternalApi);

  /** @ngInject */
  function commonPartSearchExternalApi($state, BaseService, USER, CORE, RFQTRANSACTION) {
    var directive = {
      restrict: 'E',
      scope: {
        mfgpn: '='
      },
      replace: true,
      templateUrl: 'app/directives/custom/common-part-search-external-api/common-part-search-external-api.html',
      link: function (scope, element, attrs) {
        scope.apiConstant = RFQTRANSACTION.API_LINKS;

        scope.searchToDigikey = () => {
            BaseService.searchToDigikey(encodeURIComponent(scope.mfgpn));
        };
        scope.searchToFindChip = () => {
            BaseService.searchToFindChip(encodeURIComponent(scope.mfgpn));
        };
        scope.searchToArrow = () => {
            BaseService.searchToArrow(encodeURIComponent(scope.mfgpn));
        };
        scope.searchToAvnet = () => {
            BaseService.searchToAvnet(encodeURIComponent(scope.mfgpn));
        };
        scope.searchToMouser = () => {
            BaseService.searchToMouser(encodeURIComponent(scope.mfgpn));
        };
        scope.searchToNewark = () => {
            BaseService.searchToNewark(encodeURIComponent(scope.mfgpn));
        };
        scope.searchToTTI = () => {
            BaseService.searchToTTI(encodeURIComponent(scope.mfgpn));
        };
        scope.searchToOctopart = () => {
            BaseService.searchToOctopart(encodeURIComponent(scope.mfgpn));
        };
        scope.searchToGoogle = () => {
          BaseService.searchToGoogle(encodeURIComponent(scope.mfgpn));
        };
        scope.searchToHeilind = () => {
          BaseService.searchToHeilind(encodeURIComponent(scope.mfgpn));
        };
      }
    };
    return directive;
  }
})();
