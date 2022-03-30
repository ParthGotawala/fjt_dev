(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('alternativeComponentDetails', alternativeComponentDetails);

  /** @ngInject */
  function alternativeComponentDetails(BaseService, RFQTRANSACTION, USER, CORE) {
    const directive = {
      restrict: 'E',
      replace: true,
      scope: {
        rowData: '=',
        isExpand: '=?',
        isHistory: '=?',
        isHideLoa: '=?'
      },
      templateUrl: 'app/directives/custom/alternative-component-details/alternative-component-details.html',
      controller: alternativeComponentDetailsCtrl,
      controllerAs: 'vm',
      link: function (scope) {
        scope.erroricon = stringFormat('{0}{1}{2}', CORE.WEB_URL, USER.BOM_DEFAULT_IMAGE_PATH, RFQTRANSACTION.ERROR_ICON);
        scope.tbdicon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, RFQTRANSACTION.TBD_ICON);
        scope.mismatchMountingTypeIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.MISMATCH_MOUNTING_TYPE_ICON);
        scope.mismatchFunctionalTypeIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.MISMATCH_FUNCTIONAL_TYPE_ICON);
        scope.approveMountingTypeIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.APPROVE_MOUNTING_TYPE_ICON);
        scope.$watch('rowData', (newValue) => {
          scope.rowData = newValue;
          scope.mfgAlterparts = [];
          const groupConcatSeparatorValue = _groupConcatSeparatorValue;
          const rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
          scope.Label = CORE.LabelConstant.MFG;
          if (scope.isExpand) {
            if (!(isNaN(scope.rowData.restrictCPNUseInBOMStep) || isNaN(scope.rowData.restrictCPNUsePermanentlyStep) || isNaN(scope.rowData.restrictCPNUseWithPermissionStep))) {
              scope.isCPNRestrict = (scope.rowData.restrictCPNUseInBOMStep || !scope.rowData.restrictCPNUsePermanentlyStep || !scope.rowData.restrictCPNUseWithPermissionStep);
            }
            const mfgAlterpartsData = scope.rowData.mfgPN ? scope.rowData.mfgPN.split(groupConcatSeparatorValue) : '';
            const componentdata = scope.rowData.component ? scope.rowData.component.split(',') : '';
            _.each(mfgAlterpartsData, (rohsData, index) => {
              if (_.includes(rohsData, '@@@')) {
                const mfgData = {};
                mfgData.customerID = scope.rowData.customerID;
                mfgData.rfqAssyID = scope.rowData.rfqAssyID;
                mfgData.refLineitemID = scope.rowData.rfqLineItemID;
                const component = componentdata[index] ? componentdata[index].split('###') : '';
                const txtValue = rohsData ? rohsData.split('@@@') : '';
                let part = '';
                mfgData.part = '';
                if (txtValue.length > 0 && txtValue[0]) {
                  part = txtValue[0].split('***').join(',');
                  if (part) {
                    mfgData.part = part.split('..').join(',');
                  }
                }
                mfgData.componentID = component ? Number(component[3]) : txtValue.length > 24 ? Number(txtValue[24]) : null;
                mfgData.LOAStatus = component ? component[4] : txtValue.length > 25 ? Number(txtValue[25]) : 0;
                let mfgpartNumber = '';
                mfgData.mfgpartNumber = '';
                if (component.length > 0 && component[0]) {
                  mfgpartNumber = component[0].split('***').join(',');
                  if (mfgpartNumber) {
                    mfgData.mfgpartNumber = mfgpartNumber.split('..').join(',');
                  }
                }
                else if (txtValue.length > 22 && txtValue[22]) {
                  mfgpartNumber = txtValue[22].split('***').join(',');
                  if (mfgpartNumber) {
                    mfgData.mfgpartNumber = mfgpartNumber.split('..').join(',');
                  }
                }
                mfgData.mfgpartNumber = mfgpartNumber ? mfgpartNumber.replace('..', ',') : '';
                mfgData.rohsStatus = txtValue.length > 1 ? txtValue[1] : false;
                mfgData.rohsName = txtValue.length > 2 ? txtValue[2] : null;
                mfgData.rohsIcon = txtValue.length > 3 ? stringFormat('{0}{1}', rohsImagePath, txtValue[3] ? txtValue[3] : CORE.NO_IMAGE_ROHS) : null;
                mfgData.isCustom = txtValue.length > 4 ? Number(txtValue[4]) : 0;
                mfgData.isEpoxy = txtValue.length > 5 ? (_.includes(txtValue[5].toLowerCase(), 'epoxy')) ? true : false : false;
                mfgData.Epoxy = txtValue.length > 5 ? txtValue[5] : '';
                mfgData.isObsolate = txtValue.length > 6 ? txtValue[6] !== 'Active' ? true : false : false;
                mfgData.partStatus = txtValue.length > 6 ? txtValue[6] : '';
                mfgData.partStatusColor = txtValue.length > 7 ? txtValue[7].replace('***', ',').replace('***', ',') : '';
                mfgData.partTBD = txtValue.length > 8 ? (txtValue[8].replace('***', ',').replace('***', ',').replace('***', ',')).split(',') : '';
                mfgData.partTBDDetails = '';
                if (mfgData.partTBD) {
                  _.each(mfgData.partTBD, (tbd) => {
                    if (tbd) {
                      mfgData.partTBDDetails = stringFormat('{0}{1}<br/>', mfgData.partTBDDetails, tbd);
                    }
                  });
                }
                const restrictParts = _.find(scope.rowRestrictPart, (restPart) => restPart.mfgPNID === mfgData.componentID);
                mfgData.bomRestrict = restrictParts ? true : false;
                if (scope.rowData.pricingList) {
                  mfgData.priced = true;
                  mfgData.isPriceFetched = false;
                  const priceFetch = _.filter(scope.rowData.pricingList, (price) => price.ConsolidateID === scope.rowData.id && price.PartNumberId === mfgData.componentID);
                  if (priceFetch.length > 0) {
                    _.each(priceFetch, (pricelst) => {
                      if (_.find(pricelst.assemblyQtyBreak, (price) => price.isDeleted === false && price.ConsolidateID === scope.rowData.id && parseFloat(price.PricePerPart) > 0)) {
                        mfgData.isPriceFetched = true;
                        return;
                      }
                    });
                  }
                }
                mfgData.bomRestrictStep = txtValue.length > 9 ? Number(txtValue[9]) : 1;
                mfgData.restrictUseInBOMWithPermissionStep = txtValue.length > 10 ? Number(txtValue[10]) : 1;
                mfgData.restrictPermenentlystep = txtValue.length > 11 ? Number(txtValue[11]) : 0;
                mfgData.restrictwithPermissionStep = txtValue.length > 12 ? Number(txtValue[12]) : 0;

                mfgData.restrictUseInBOMExcludingAliasStep = txtValue.length > 13 ? Number(txtValue[13]) : 1;
                mfgData.restrictUseInBOMExcludingAliasWithPermissionStep = txtValue.length > 14 ? Number(txtValue[14]) : 1;
                mfgData.restrictUseExcludingAliasStep = txtValue.length > 15 ? Number(txtValue[15]) : 0;
                mfgData.restrictUseExcludingAliasWithPermissionStep = txtValue.length > 16 ? Number(txtValue[16]) : 0;

                //mfgData.restrictPackagingUsePermanently = txtValue.length > 12 ? Number(txtValue[12]) : 0;
                //mfgData.restrictPackagingUseWithpermission = txtValue.length > 13 ? Number(txtValue[13]) : 0;
                mfgData.partIssue = txtValue.length > 17 ? txtValue[17].replace('***', ',') : null;
                mfgData.mfgPNDescription = txtValue.length > 18 ? txtValue[18].replace('***', ',') : null;
                mfgData.lineLevelCustomerApproval = txtValue.length > 19 ? Number(txtValue[19]) : '';
                mfgData.approvedMountingType = txtValue.length > 20 ? Number(txtValue[20]) : 0;
                mfgData.mismatchMountingTypeStep = txtValue.length > 21 ? Number(txtValue[21]) : 1;
                mfgData.custAssyPN = txtValue.length > 26 ? txtValue[26] : 1;
                mfgData.mismatchFunctionalCategoryStep = txtValue.length > 27 ? Number(txtValue[27]) : 1;
                mfgData.leadTime = txtValue.length > 28 ? Number(txtValue[28]) : 0;
                if (_.find(scope.mfgAlterparts, (mAlter) => mAlter.restrictUseInBOMWithPermissionStep)) {
                  mfgData.restrictUseInBOMWithPermissionStep = 1;
                }
                mfgData.MountingType = scope.rowData.name;
                mfgData.FunctionaType = scope.rowData.partTypeName;
                scope.mfgAlterparts.push(mfgData);
              }
            });
          }
          else {
            const mfgAlterpartsData = scope.rowData.alternateParts ? scope.rowData.alternateParts.split('###') : '';
            _.each(mfgAlterpartsData, (mfgData) => {
              const mfgDataItem = {};
              const txtValue = mfgData ? mfgData.split('@@@') : '';
              mfgDataItem.part = '';
              if (txtValue.length > 0 && txtValue[0]) {
                mfgDataItem.part = txtValue[0].split('***').join(',');
              }
              mfgDataItem.mfgpartNumber = '';
              if (txtValue.length > 1 && txtValue[1]) {
                mfgDataItem.mfgpartNumber = txtValue[1].split('***').join(',');
              }
              mfgDataItem.componentID = txtValue.length > 2 ? Number(txtValue[2]) : null;
              mfgDataItem.rohsIcon = txtValue.length > 3 ? stringFormat('{0}{1}', rohsImagePath, txtValue[3] ? txtValue[3] : CORE.NO_IMAGE_ROHS) : '';
              mfgDataItem.rohsName = txtValue.length > 4 ? txtValue[4] : '';
              mfgDataItem.isCustom = txtValue.length > 5 ? Number(txtValue[5]) : 0;
              mfgDataItem.restrictUseInBOMStep = txtValue.length > 6 ? Number(txtValue[6]) : 0;
              mfgDataItem.restrictUseWithPermissionStep = txtValue.length > 7 ? Number(txtValue[7]) : 1;
              mfgDataItem.restrictUsePermanentlyStep = txtValue.length > 8 ? Number(txtValue[8]) : 1;
              mfgDataItem.lineLevelRestrictUseInBOMWithPermissionStep = txtValue.length > 9 ? Number(txtValue[9]) : 0;
              mfgDataItem.lineLevelCustomerApproval = txtValue.length > 10 ? txtValue[10] : '';
              mfgDataItem.rfqLevelRestrictCPNUseWithPermissionStep = txtValue.length > 11 ? Number(txtValue[11]) : 0;
              mfgDataItem.rfqLevelRestrictCPNUsePermanentlyStep = txtValue.length > 12 ? Number(txtValue[12]) : 0;
              const objRestrict = _.find(scope.mfgAlterparts, (mAlter) => mAlter.lineLevelRestrictUseInBOMWithPermissionStep);
              if (objRestrict) {
                mfgDataItem.lineLevelRestrictUseInBOMWithPermissionStep = 1;
                mfgDataItem.lineLevelCustomerApproval = objRestrict.lineLevelCustomerApproval;
              }
              scope.mfgAlterparts.push(mfgDataItem);
            });
          }
        });
      }
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of alternative details
    *
    * @param
    */
    function alternativeComponentDetailsCtrl($scope, DialogFactory, RFQTRANSACTION) {
      const vm = this;
      vm.isHideLoa = $scope.isHideLoa;
      vm.apiConstant = RFQTRANSACTION.API_LINKS;

      //remove copied status on hover
      vm.checkPIDStatus = () => {
        vm.showpidStatus = false;
      };

      vm.ImportLOA = (item, ev) => {
        var data = {
          componentID: item.componentID,
          rfqAssyID: item.rfqAssyID,
          customerID: item.customerID,
          refLineitemID: item.refLineitemID
        };
        DialogFactory.dialogService(
          RFQTRANSACTION.COMPONENT_CUSTOMER_LOA_POPUP_CONTROLLER,
          RFQTRANSACTION.COMPONENT_CUSTOMER_LOA_POPUP_VIEW,
          ev,
          data).then(() => { }, () => {
            //$scope.$parent.col.grid.appScope.$parent.vm.loadData();
          }, () => {
            //$scope.$parent.col.grid.appScope.$parent.vm.loadData();
          });
      };
      $scope.goToPartMaster = (item) => {
        BaseService.goToComponentDetailTab(null, item.componentID);
      };
      //go to supplier page
      vm.gotoSupplier = (partNumber, link) => {
        partNumber = encodeURIComponent(partNumber);
        // partNumber = partNumber.substring(partNumber.indexOf("+") + 1, partNumber.length);
        link = stringFormat('{0}{1}', link, partNumber);
        BaseService.openURLInNew(link);
      };

      vm.packagingAlias = (item, ev) => {
        var data = {
          componentID: item.componentID,
          mfgPN: item.part.replace('+', ':').split(':')[1],
          pid: item.part,
          rohsName: item.rohsName,
          rohsIcon: item.rohsIcon
        };
        DialogFactory.dialogService(
          RFQTRANSACTION.COMPONENT_PACKAGING_ALIAS_POPUP_CONTROLLER,
          RFQTRANSACTION.COMPONENT_PACKAGING_ALIAS_POPUP_VIEW,
          ev,
          data).then(() => {
          }, () => {
          });
      };
    }
  }
})();
