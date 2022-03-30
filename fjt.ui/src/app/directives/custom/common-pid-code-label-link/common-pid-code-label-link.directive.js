(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('commonPidCodeLabelLink', commonPidCodeLabelLink);

  /** @ngInject */
  function commonPidCodeLabelLink($state, BaseService, RFQTRANSACTION, USER, CORE) {
    var directive = {
      restrict: 'E',
      scope: {
        componentId: '=',
        label: '=?',
        value: '=?',
        isCopy: '=?',
        isMfg: '=?',
        mfgLabel: '=?',
        mfgValue: '=?',
        rohsIcon: '=?',
        rohsStatus: '=?',
        isFormated: '=?',
        isCopyAheadLabel: '=?',
        isFromTraveler: '=?',
        isSearchDigiKey: '=?',
        isSupplier: '=?',
        redirectionDisable: '=?',
        isSearchFindchip: '=?',
        isHideCopyPidCode: '=?',
        supplierName: '=?',
        isGoodPart: '=?',
        restrictUsePermanently: '=?',
        restrictUseWithPermission: '=?',
        restrictPackagingUsePermanently: '=?',
        restrictPackagingUseWithPermission: '=?',
        restrictUseInBomPermanently: '=?',
        isAssembly: '=?',
        isShowInRed: '=?',
        isCustomPart: '=?',
        custPartNumber: '=?',
        copyAheadLabelOtherValueArray: '=?',
        copyAfterLabelOtherValueArray: '=?',
        hasSubAssembly: '=?'
      },
      replace: true,
      templateUrl: 'app/directives/custom/common-pid-code-label-link/common-pid-code-label-link.html',
      link: function (scope) {
        /*managed this condition if want to hide search in special cases (like in part master Header not want to show)*/
        if (scope.isSearchFindchip !== false) {
          scope.isSearchFindchip = true;
        }
        // condition added for packing slip page based on supplier we are displaying part
        if (scope.isSearchDigiKey !== false) {/*managed this condition if want to hide search in special cases (like in part master Header not want to show)*/
          scope.isSearchDigiKey = scope.supplierName ? false : true;
        }
        scope.commonPidCodeLabelLength = 32;
        //// Assembly
        //scope.goToPartList = (data) => {
        //    BaseService.goToPartList();
        //    return false;
        //}
        scope.getpidCodeLength = () => stringFormat('{0}ch', scope.commonPidCodeLabelLength);
        scope.apiConstant = RFQTRANSACTION.API_LINKS;
        scope.showSupplierName = CORE.DefaultSupplier;
        scope.goToComponentDetail = (ev) => {
          if (!scope.redirectionDisable) {
            //BaseService.goToComponentDetail(scope.componentId);
            BaseService.goToComponentDetailTab(scope.isSupplier ? CORE.MFG_TYPE.DIST : CORE.MFG_TYPE.MFG, scope.componentId, USER.PartMasterTabs.Detail.Name);
            ev.preventDefault();
            ev.stopPropagation();
            return false;
          }
        };

        scope.searchToDigikey = () => {
          BaseService.searchToDigikey(encodeURIComponent(scope.mfgValue || scope.value));
          return false;
        };

        scope.searchToArrow = () => {
          BaseService.searchToArrow(encodeURIComponent(scope.mfgValue || scope.value));
          return false;
        };

        scope.searchToAvnet = () => {
          BaseService.searchToAvnet(encodeURIComponent(scope.mfgValue || scope.value));
          return false;
        };

        scope.searchToMouser = () => {
          BaseService.searchToMouser(encodeURIComponent(scope.mfgValue || scope.value));
          return false;
        };

        scope.searchToNewark = () => {
          BaseService.searchToNewark(encodeURIComponent(scope.mfgValue || scope.value));
          return false;
        };

        scope.searchToTTI = () => {
          BaseService.searchToTTI(encodeURIComponent(scope.mfgValue || scope.value));
          return false;
        };

        scope.searchToFindChip = () => {
          BaseService.searchToFindChip(encodeURIComponent(scope.mfgValue || scope.value));
          return false;
        };
        scope.gotoGoogle = () => {
          BaseService.searchToGoogle(scope.mfgValue || scope.value);
          return false;
        };
      }
    };
    return directive;
  }
})();



