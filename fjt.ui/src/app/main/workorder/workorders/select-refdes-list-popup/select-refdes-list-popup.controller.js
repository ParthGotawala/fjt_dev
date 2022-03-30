(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('SelectRefDesListPopupController', SelectRefDesListPopupController);

  /** @ngInject */
  function SelectRefDesListPopupController($scope, $q, data, USER, CORE,
    WorkorderOperationFactory, $mdDialog, BaseService, RFQTRANSACTION) {
    // let loginUserDetails = BaseService.loginUser;
    const vm = this;
    // vm.data = data;
    vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.BOM;
    // var cgPromise = [];
    vm.labelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.DisplayOddelyRefDes = angular.copy(data.displayOddelyRefDes);
    vm.assyDetails = angular.copy(data.assyDetails);
    vm.itemPerBOMLineList = [];
    vm.disableScroll = false;
    vm.scrollEle = '#dataSection';
    // vm.bomRefDesList = angular.copy(data.bomRefDesList);
    // vm.operationRefDesList = angular.copy(data.operationRefDesList);
    vm.headerdata = [];

    const initPaging = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        pageSize: 25
      };
    };
    initPaging();

    // Get BOM LineItems by Assembly Id
    vm.getRFQLineItemsByID = () => {
      vm.disableScroll = true;
      vm.pagingInfo.Page = vm.itemPerBOMLineList && vm.itemPerBOMLineList.length === 0 ? vm.pagingInfo.Page : vm.pagingInfo.Page + 1
      const searchObj = {
        page: vm.pagingInfo.Page,
        pageSize: vm.pagingInfo.pageSize,
        id: vm.assyDetails.partID
      };
      return WorkorderOperationFactory.getRFQLineItemsByIDWithSubAssembly().query(searchObj).$promise.then((response) => {
        if (response && response.data && response.data.length) {
          _.each(response.data, (item) => {
            // this need to be added to show value on check box
            item.isInstall = item.isInstall > 0 ? true : false;
            item.isSelectedItem = vm.isAllSelect;
          });
          // vm.itemPerBOMLineList = response.data;
          vm.addItemPerBomLine = angular.copy(response.data);
          // return vm.itemPerBOMLineList;
          if (vm.itemPerBOMLineList) {
            vm.itemPerBOMLineList.push(...vm.addItemPerBomLine);
          }
          vm.disableScroll = false;
        } else if (vm.itemPerBOMLineList && vm.itemPerBOMLineList.length === 0) {
          vm.isNoDataFound = true;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // getRFQLineItemsByID();

    // Get Oddly ref Des list
    //const getOddelyRefDesList = () => {
    //  if (vm.operation.workorder.partID) {
    //    return ComponentFactory.getOddelyRefDesList().query({ id: vm.data.partID }).$promise.then((resOddRefDes) => {
    //      if (resOddRefDes && resOddRefDes.data) {
    //        vm.oddelyRefDesList = resOddRefDes.data;
    //        vm.DisplayOddelyRefDes = _.map(vm.oddelyRefDesList, 'refDes');
    //        return vm.oddelyRefDesList;
    //      }
    //    }).catch((error) => BaseService.getErrorLog(error));
    //  }
    //};
    // getOddelyRefDesList();

    // select already entered ref des.
    //vm.cgBusyLoading = $q.all([getRFQLineItemsByID(), getOddelyRefDesList()]).then(() => {
    //  const bomList = getDesignatorFromLineItem(vm.itemPerBOMLineList ? vm.itemPerBOMLineList.join(',') : [], vm.DisplayOddelyRefDes);

    //});

    // select-deselect all ref des
    vm.selectAllRefDes = () => {
      _.each(vm.itemPerBOMLineList, (item) => {
        item.isSelectedItem = vm.isAllSelect;
      });
    };

    /* goto Assembly List Page */
    vm.goToAssemblyList = () => BaseService.goToPartList();

    /* goto assembly detail page */
    vm.goToAssemblyDetailsHeader = () => BaseService.goToComponentDetailTab(null, vm.assyDetails.partID);
    /* go to workorder list */
    vm.goToWorkorderList = () => BaseService.goToWorkorderList();

    /* go to particular workorder detail */
    vm.goToWorkorderDetails = () => BaseService.goToWorkorderDetails(data.woID);

    /* to move at operation update page */
    vm.goToManageOperation = (operationID) => BaseService.goToManageOperation(operationID);

    // go to manufacturer list page
    vm.gotoManufacturerList = () => BaseService.goToManufacturerList();

    // go to manufacturer manage page
    vm.goToManufacturer = (id) => BaseService.goToManufacturer(id);

    if (vm.assyDetails) {
      vm.headerdata.push(
        {
          label: vm.labelConstant.Assembly.PIDCode,
          value: vm.assyDetails.PIDCode,
          displayOrder: 1,
          isCopy: true,
          isAssy: true,
          labelLinkFn: vm.goToAssemblyList,
          valueLinkFn: vm.goToAssemblyDetailsHeader,
          imgParms: {
            imgPath: vm.rohsImagePath + vm.assyDetails.rohsIcon,
            imgDetail: vm.assyDetails.rohsName
          }
        },
        {
          label: vm.labelConstant.Assembly.MFGPN,
          value: vm.assyDetails.mfgPN,
          displayOrder: 2,
          isCopy: true,
          isAssy: true,
          labelLinkFn: vm.goToAssemblyList,
          valueLinkFn: vm.goToAssemblyDetailsHeader,
          imgParms: {
            imgPath: vm.rohsImagePath + vm.assyDetails.rohsIcon,
            imgDetail: vm.assyDetails.rohsName
          }
        }
      );
    }
    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);


    // close pop -up
    vm.cancel = () => {
      $mdDialog.cancel();
    };

    vm.addToOperation = () => {
      // Pass the selected line data for fetching upadated record
      const retObj = _.filter(vm.itemPerBOMLineList, (item) => item.isSelectedItem && item.bomLineIndex === 1);
      BaseService.currentPagePopupForm.pop();
      $mdDialog.cancel(retObj);
    };

    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.refDesListForm);
    });
  }

})();
