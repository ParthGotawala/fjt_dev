(function () {
  'use strict';
  angular.module('app.core').directive('bomPartToWatch', bomPartToWatch);

  /** @ngInject */
  function bomPartToWatch() {
    const directive = {
      restrict: 'E',
      replace: true,
      scope: {
        partId: '=',
        showLable: '='
      },
      templateUrl: 'app/directives/custom/bom-part-to-watch/bom-part-to-watch.html',
      controller: BOMPartToWatchController,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for view data of Part to watch Icon list
    * @param
    */
    function BOMPartToWatchController($scope, $rootScope, USER, CORE, BOMFactory, RFQTRANSACTION) {
      const vm = this;
      vm.partid = $scope.partId;
      vm.showLable = $scope.showLable;
      vm.LabelConstant = angular.copy(CORE.LabelConstant);
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.tmaxIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.TMAX_ICON);
      vm.tmaxYellowIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.TMAX_YELLOW_ICON);
      vm.exportControlledIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.EXPORT_CONTROLLED_ICON);
      vm.inActiveImagePath = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.IN_ACTIVE_IMAGE);
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.operationalImagePath = CORE.WEB_URL + USER.DYNAMIC_ATTRIBUTE_BASE_PATH;
      vm.wrenchIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.WRENCH_ICON);
      vm.nrndIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.OBSOLETE_NRND_ICON);
      vm.exportIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.EXPORT_CONTROLLED_ICON);
      vm.mismatchMountingTypeIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.MISMATCH_MOUNTING_TYPE_ICON);
      vm.mismatchFunctionalTypeIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.MISMATCH_FUNCTIONAL_TYPE_ICON);
      vm.approveMountingTypeIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.APPROVE_MOUNTING_TYPE_ICON);
      vm.CPNmappingPending = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.MPN_MAPPING_PENDING_IN_CPN_ICON);
      vm.badPartIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.BAD_PART_ICON);
      vm.badSupplierPartIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.BAD_SUPPLIER_PART_ICON);
      vm.custPartIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.CUST_PART_ICON);
      vm.pickuppadRequireIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.PICKUP_PAD_REQUIRE_ICON);
      vm.programmingRequireIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.PROGRAMMING_REQUIRED_ICON);
      vm.programmingMappingFullIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.PROGRAMMING_MAPPING_FULL_ICON);
      vm.programmingMappingPartialIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.PROGRAMMING_MAPPING_PARTIAL_ICON);
      vm.programmingMappingPengingIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.PROGRAMMING_MAPPING_PENDING_ICON);

      const approvemountingTypeIconTooltip = RFQTRANSACTION.APPROVE_MOUNTING_TYPE_ICON_TOOLTIP;
      vm.documentFolderName = ''; // Put file in Operator for docOpenType = 2
      const _rohsImageElem = '<div class="ph-5"><img class="rohs-bom-image" src="rohsImagePath" title="rohsTitle"></div>';
      const _wrenchIconElem = '<div class="ph-5"><img class="rohs-bom-image" src="' + vm.wrenchIcon + '" title="wrenchTitle"></div>';
      //const _programingIconElem = '<div md-font-icon="icons-required-program" role="img" class="mh-5 margin-top-3 cm-custom-icon-font icons-required-program color-black" title="programingTitle"></div>';
      const _programingIconElem = '  <img class="pt-5" src="' + vm.programmingRequireIcon + '" title="programingTitle">';
      const _programmingMappingFullIcon = '  <img class="pt-5" src="' + vm.programmingMappingFullIcon + '" title="programingTitle">';
      const _programmingMappingPartialIcon = '  <img class="pt-5" src="' + vm.programmingMappingPartialIcon + '" title="programingTitle">';
      const _programmingMappingPengingIcon = '  <img class="pt-5" src="' + vm.programmingMappingPengingIcon + '" title="programingTitle">';

      const _matingPartIconElem = '<div md-font-icon="icons-require-mating-part" role="img" class="mh-5 margin-top-3 cm-custom-icon-font icons-require-mating-part color-black" title="matingPartTitle"></div>';
      //const _pickupPadIconElem = ' <md-icon md-font-icon="icons-required-pickup-pad" role="img" class="cm-custom-icon-font icons-required-pickup-pad color-black" title="pickupPadTitle"></md-icon>';
      const _pickupPadIconElem = '  <img class="pt-5" src="' + vm.pickuppadRequireIcon + '" title="pickupPadTitle">';
      const _partStatusIconElem = '<div class="ph-5"><img src="' + vm.nrndIcon + '" title="Obsolete or Not Recommended for New Design Part"></div>';
      const _tmaxIconElem = '<div class="ph-5"><img class="pt-5" src="' + vm.tmaxIcon + '" title="Tmax"></div>';
      const _tmaxYellowIconElem = '<div class="ph-5"><img class="pt-5" src="' + vm.tmaxYellowIcon + '" title="Tmax is not defined."></div>';
      const _exportControlledIconElem = '<div class="ph-5"><img src="' + vm.exportIcon + '" title="Export Controlled"></div>';
      const _mismatchMountingTypeIconElem = ' <img class="pt-5" src="' + vm.mismatchMountingTypeIcon + '" title="Mismatched Mounting Type">';
      const _mismatchFunctionalTypeIconElem = ' <img class="pt-5" src="' + vm.mismatchFunctionalTypeIcon + '" title="Mismatched Functional Type">';
      const _approveMountingTypeIconElem = ' <img class="pt-5" src="' + vm.approveMountingTypeIcon + '" title="' + approvemountingTypeIconTooltip + '">';
      const _cpnMappingPending = ' <img class="pt-5" src="' + vm.CPNmappingPending + '" title="MPN Mapping Pending in CPN">';
      const _badPartIconElem = ' <img class="pt-5" src="' + vm.badPartIcon + '" title="Incorrect Part">';
      const _badSupplierPartIconElem = ' <img class="pt-5" src="' + vm.badSupplierPartIcon + '" title="Incorrect Supplier Part">';
      const _custPartIconElem = '<div class="ph-5"><img class="pt-5" src="' + vm.custPartIcon + '" title="Custom Part"></div>';


      function getBOMIconList() {
        return BOMFactory.getBOMIconList().query({ id: vm.partid }).$promise.then((response) => {
          if (response && response.data) {
            vm.iconHtml = '';
            vm.bomIConList = response.data;
            if (vm.bomIConList.length > 0) {
              _.each(vm.bomIConList, (item) => {
                switch (item.iconType) {
                  case CORE.BOMIconType.RoHS: {
                    vm.iconHtml += _rohsImageElem.replace('rohsImagePath', (vm.rohsImagePath + (item.icon ? item.icon : CORE.DEFAULT_IMAGE))).replace('rohsTitle', item.tooltip);
                    break;
                  }
                  case CORE.BOMIconType.BadPart: {
                    vm.iconHtml += _badPartIconElem;
                    break;
                  }
                  case CORE.BOMIconType.BadSupplierPart: {
                    vm.iconHtml += _badSupplierPartIconElem;
                    break;
                  }
                  case CORE.BOMIconType.ExportControl: {
                    vm.iconHtml += _exportControlledIconElem;
                    break;
                  }
                  case CORE.BOMIconType.DriverTool: {
                    vm.iconHtml += _wrenchIconElem.replace('wrenchTitle', CORE.WRENCH_TOOLTIP);
                    break;
                  }
                  case CORE.BOMIconType.MatingPart: {
                    vm.iconHtml += _matingPartIconElem.replace('matingPartTitle', CORE.MATING_TOOLTIP);
                    break;
                  }
                  case CORE.BOMIconType.PickupPad: {
                    vm.iconHtml += _pickupPadIconElem.replace('pickupPadTitle', CORE.PICKUPPAD_TOOLTIP);
                    break;
                  }
                  case CORE.BOMIconType.Obsolete: {
                    vm.iconHtml += _partStatusIconElem;
                    break;
                  }
                  case CORE.BOMIconType.PendingtoMapPartwithProgram: {
                    vm.iconHtml += _programmingMappingPengingIcon.replace('programingTitle', CORE.PROGRAMMING_MAPPING_PENDING_TOOLTIP);
                    break;
                  }
                  case CORE.BOMIconType.PartiallyMapPartwithProgram: {
                    vm.iconHtml += _programmingMappingPartialIcon.replace('programingTitle', CORE.PROGRAMMING_MAPPING_PARTIAL_TOOLTIP);
                    break;
                  }
                  case CORE.BOMIconType.FullyMapPartwithProgram: {
                    vm.iconHtml += _programmingMappingFullIcon.replace('programingTitle', CORE.PROGRAMMING_MAPPING_FULL_TOOLTIP);
                    break;
                  }
                  case CORE.BOMIconType.NotRequiretoMapPartwithProgram: {
                    vm.iconHtml += _programingIconElem.replace('programingTitle', CORE.PROGRAMING_REQUIRED_TOOLTIP);
                    break;
                  }
                  case CORE.BOMIconType.TmaxRed: {
                    vm.iconHtml += _tmaxIconElem;
                    break;
                  }
                  case CORE.BOMIconType.TmaxWarn: {
                    vm.iconHtml += _tmaxYellowIconElem;
                    break;
                  }
                  case CORE.BOMIconType.OperationalAttribute: {
                    vm.iconHtml += _rohsImageElem.replace('rohsImagePath', (vm.operationalImagePath + (item.icon ? item.icon : CORE.DEFAULT_IMAGE))).replace('rohsTitle', item.tooltip ? item.tooltip : '');
                    break;
                  }
                  case CORE.BOMIconType.MismatchMountingType: {
                    vm.iconHtml += _mismatchMountingTypeIconElem;
                    break;
                  }
                  case CORE.BOMIconType.MismatchFunctionalType: {
                    vm.iconHtml += _mismatchFunctionalTypeIconElem;
                    break;
                  }
                  case CORE.BOMIconType.ApproveMountingType: {
                    vm.iconHtml += _approveMountingTypeIconElem;
                    break;
                  }
                  case CORE.BOMIconType.CustomPart: {
                    vm.iconHtml += _custPartIconElem;
                    break;
                  }
                  case CORE.BOMIconType.MPNNotMappedInCPN: {
                    vm.iconHtml += _cpnMappingPending;
                    break;
                  }
                }
              });
            }
            return response.data;
          }
        });
      }
      getBOMIconList();
      const UpdateBOMIcon = $rootScope.$on(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion, () => {
        if (vm.partid) {
          getBOMIconList();
        }
      });
      //close pop-up on destroy page
      $scope.$on('$destroy', () => {
        UpdateBOMIcon();
      });
    }
  }
})();
