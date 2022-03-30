(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('DuplicatePackingslipStockPopupController', DuplicatePackingslipStockPopupController);

  function DuplicatePackingslipStockPopupController($mdDialog, CORE, USER, BaseService, data, TRANSACTION, DialogFactory, $timeout) {
    const vm = this;
    vm.packingslipDetail = data;
    vm.packingSlipLineList = data ? data.packingSlipDetail : [];
    vm.umidSPQ = vm.packingSlipLineList && vm.packingSlipLineList[0].partPackagingMinQty;
    vm.LabelConstant = CORE.LabelConstant;
    vm.packingSlipReceivedStatus = TRANSACTION.PackingSlipReceivedStatus;
    vm.PackingSlipModeStatus = CORE.PackingSlipModeStatus;
    vm.packingSlipNote = stringFormat(CORE.MESSAGE_CONSTANT.SELECT_PENDING_STOCK_NOTE);
    vm.isDisable = true;
    vm.headerdata = [];

    vm.query = {
      order: ''
    };

    if (vm.packingSlipLineList && vm.packingSlipLineList.length > 0) {
      _.map(vm.packingSlipLineList, (item) => {
        item.orgBalanceQty = angular.copy(item.BalanceQty);
        item.umidCount = 0;
        item.isLineCustConsigned = item.isLineCustConsigned ? true : false;
      });
    }

    vm.goToManagePackingSlipDetail = (id) => {
      BaseService.goToManagePackingSlipDetail(id);
    };

    vm.goToBinList = () => {
      BaseService.goToBinList();
    };

    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    vm.goToComponentDetail = () => {
      BaseService.goToComponentDetailTab(vm.packingslipDetail.mfgType, vm.packingslipDetail.mfrPnId, USER.PartMasterTabs.Detail.Name);
    };

    const redirectToPartDetail = (pId, pMfrPN) => {
      const redirectToPartUrl = WebsiteBaseUrl + CORE.URL_PREFIX + USER.ADMIN_COMPONENT_ROUTE + USER.ADMIN_MANAGECOMPONENT_ROUTE + USER.ADMIN_MANAGECOMPONENT_DETAIL_TAB_ROUTE.replace(':mfgType', CORE.MFG_TYPE.MFG.toLowerCase()).replace(':coid', pId);
      return stringFormat('<a href=\'{0}\' target=\'_blank\' tabindex=\'-1\' class=\'underline\'>{1}</a>', redirectToPartUrl, pMfrPN);
    };

    vm.headerdata.push(
      {
        label: vm.LabelConstant.MFG.PID,
        value: vm.packingslipDetail.PIDCode,
        displayOrder: 1,
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToComponentDetail,
        isCopy: true,
        isCopyAheadLabel: true,
        imgParms: {
          imgPath: vm.packingslipDetail.rohsIcon !== null ? stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, vm.packingslipDetail.rohsIcon) : null,
          imgDetail: vm.packingslipDetail.rohsName
        },
        isCopyAheadOtherThanValue: true,
        copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
        copyAheadValue: vm.packingslipDetail.mfgPN
      },
      {
        label: vm.LabelConstant.UMIDManagement.Bin,
        value: vm.packingslipDetail.binName,
        displayOrder: 2,
        labelLinkFn: vm.goToBinList,
        isCopy: true
      },
      {
        label: 'UMID SPQ',
        value: vm.umidSPQ,
        displayOrder: 3
      }
    );

    const errorValidation = (selectedLine) => {
      let isPopupOpen = true;
      if (isPopupOpen && selectedLine.umidCount && selectedLine && selectedLine.sourceName === TRANSACTION.Packaging.TapeAndReel && selectedLine.umidCount !== selectedLine.partPackagingMinQty) {
        if (selectedLine.umidCount < selectedLine.partPackagingMinQty) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CONFIRMATION_CONNTINUE_TR_NON_UMID_COUNT);
          messageContent.message = stringFormat(messageContent.message, 'Count', redirectToPartDetail(vm.packingslipDetail.mfrPnId, vm.packingslipDetail.PIDCode), selectedLine.packagingType, 'COUNT', selectedLine.partPackagingMinQty);
          const buttonsList = [{
            name: 'Continue'
          },
          {
            name: 'Change Count'
          }
          ];

          const data = {
            messageContent: messageContent,
            buttonsList: buttonsList,
            buttonIndexForFocus: 0
          };
          DialogFactory.dialogService(
            CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_CONTROLLER,
            CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_VIEW,
            null,
            data).then(() => { }, (response) => {
              if (response === buttonsList[0].name) {
                item.inValidCount = false;
                vm.isDisable = false;
                isPopupOpen = false;
              } else if (response === buttonsList[1].name) {
                setFocus('line' + selectedLine.packingSlipDetID);
                isPopupOpen = false;
              }
            }, (err) => BaseService.getErrorLog(err));
        }
        else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.EXISTING_STK_COUNT_NOT_MORE_THAN_SPQ);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model).then(() => {
            setFocus('line' + selectedLine.packingSlipDetID);
            item.inValidCount = true;
            vm.isDisable = true;
            selectedLine.isSelect = false;
            isPopupOpen = false;
          });
        }
      }
      const checkAnySelect = _.some(vm.packingSlipLineList, (data) => data.isSelect);
      if (checkAnySelect) {
        vm.isDisable = false;
      } else {
        vm.isDisable = true;
      }
    };

    vm.checkCountValueChange = (item) => {
      if (item.umidCount > item.orgBalanceQty) {
        item.inValidCount = true;
        vm.isDisable = true;
      } else {
        if (item.isSelect) {
          item.inValidCount = false;
          errorValidation(item);
          if (vm.packingslipDetail && vm.packingslipDetail.uomClassID === CORE.MEASUREMENT_TYPES.COUNT.ID && (item.umidCount % 1 !== 0)) {
            item.inValidCount = true;
            vm.isDisable = true;
          } else {
            item.inValidCount = false;
            vm.isDisable = false;
          }
        }
      }
      _.map(vm.packingSlipLineList, (data) => {
        data.BalanceQty = CalcSumofArrayElement([data.orgBalanceQty, ((data.umidCount || 0) * -1)], _unitFilterDecimal);
        data.BalanceQty = data.BalanceQty > 0 ? data.BalanceQty : 0;
      });
    };

    vm.selectPackingSlipLine = (item) => {
      if (item) {
        setFocus('line' + item.packingSlipDetID);
        vm.selectedRow = item;
        _.map(vm.packingSlipLineList, (data) => {
          data.inValidCount = false;
          if (data.packingSlipDetID !== item.packingSlipDetID) {
            data.isSelect = false;
            data.umidCount = 0;
          } else {
            data.isSelect = true;
            if (item.sourceName === TRANSACTION.Packaging.TapeAndReel) {
              item.umidCount = item.partPackagingMinQty;
            }
          }
          data.BalanceQty = CalcSumofArrayElement([data.orgBalanceQty, ((data.umidCount || 0) * -1)], _unitFilterDecimal);
          data.BalanceQty = data.BalanceQty > 0 ? data.BalanceQty : 0;
        });
        vm.isDisable = !item.isSelect;
      }
    };

    vm.confirmSelect = () => {
      const selectLine = _.find(vm.packingSlipLineList, { packingSlipDetID: vm.selectedRow.packingSlipDetID });
      if (selectLine.umidCount && !vm.isDisable && !selectLine.inValidCount) {
        vm.formPackingSlipStock.$setPristine();
        vm.formPackingSlipStock.$setUntouched();
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel(selectLine);
      } else {
        setFocus('line' + selectLine.packingSlipDetID);
        selectLine.inValidCount = true;
        vm.isDisable = true;
      }
    };

    vm.cancel = () => {
      if (vm.formPackingSlipStock.$dirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        vm.formPackingSlipStock.$setPristine();
        vm.formPackingSlipStock.$setUntouched();
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel(false);
      }
    };

    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.formPackingSlipStock];
    });
  }
})();
