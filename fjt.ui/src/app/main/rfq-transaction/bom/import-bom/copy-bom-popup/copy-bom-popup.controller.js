(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('CopyBOMPopupController', CopyBOMPopupController);

  /** @ngInject */
  function CopyBOMPopupController($mdDialog, $scope, $timeout, $q, CORE, USER, RFQTRANSACTION, data, BaseService, CopyBOMPopupFactory, DialogFactory, MasterFactory) {
    const vm = this;
    vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.BOM;
    vm.setScrollClass = 'gridScrollHeight_Unit';
    vm.customerConfirmationModel = {};
    let rfqAssyID = data.rfqAssyID;
    const partID = data.partID;
    const quoteGroup = data.quoteGroup;
    vm.isCopyBOM = data.isCopyBOM;
    const _dummyEvent = null;
    vm.selectedRowsList = [];
    $scope.supported = false;
    vm.isHideDelete = true;
    vm.isAddAssymbly = true;
    vm.assykeyColumnId = null;
    vm.COPY_BOM_NOTES = RFQTRANSACTION.BOM.COPY_BOM_NOTES;
    vm.COPY_RFQ_NOTES = RFQTRANSACTION.BOM.COPY_RFQ_NOTES;
    vm.BOM_MESSAGE_CONSTANT = RFQTRANSACTION.BOM;
    vm.LabelConstant = CORE.LabelConstant;
    vm.DateFormatArray = _dateDisplayFormat;
    vm.PartCategory = CORE.PartCategory;
    vm.copyModel = {
      isBOM: vm.isCopyBOM,
      fromAssyID: null,
      toAssyID: null,
      isCopyPricing: data.IsCopyPricing,
      isExistingRFQ: false,
      fromRFQAssyID: rfqAssyID
    };

    vm.RadioGroup = {
      searchOption: {
        array: CORE.AssyBOMRFQRadioGroup
      }
    };
    //redirect to customer
    vm.goToCustomer = () => {
      BaseService.goToCustomerList();
      return false;
    };
    //go to assy list
    vm.goToAssyList = () => {
      BaseService.goToPartList();
      return false;
    };
    //go to manage part number
    vm.goToAssyMaster = () => {
      BaseService.goToComponentDetailTab(null, partID);
      return false;
    };
    // go to customer details
    vm.goToCustomerDet = () => {
      BaseService.goToCustomer(vm.customerID);
      return false;
    };
    // go to customer details
    vm.goToCustDet = () => {
      BaseService.goToCustomer(vm.copyModel.customerID);
      return false;
    };
    // Go To RFQ detail
    vm.goToRFQ = () => {
      BaseService.openInNew(RFQTRANSACTION.RFQ_MANAGE_STATE, { id: quoteGroup, rfqAssyId: rfqAssyID });
      return false;
    };
    vm.changeRFQBOM = () => {
      vm.assyList = vm.allAssyList;
      // vm.autoCompleteAssy = null;
      // vm.autoCompleteRFQ = null;
      vm.copyModel.partID = null;
      vm.copyModel.PIDCode = null;
      vm.copyModel.RoHSStatusID = null;
      vm.copyModel.RoHSIcon = CORE.WEB_URL + USER.ROHS_BASE_PATH + CORE.NO_IMAGE_ROHS;
      vm.copyModel.rohsName = null;
      vm.copyModel.customerID = null;
      vm.copyModel.customerName = null;
      vm.copyModel.mfgPN = null;
      vm.copyModel.nickName = null;
      if (vm.copyModel.isBOM) {
        vm.assyList = _.filter(vm.allAssyList, (item) => {
          if (item.lineItemCount === 0) {
            return item;
          }
        });
        vm.isAddAssymbly = true;
        vm.assykeyColumnId = null;
      }
      else {
        vm.assyList = _.filter(vm.allAssyList, (item) => {
          if (item.QuoteGroup) {
            return item;
          }
        });
        vm.isAddAssymbly = false;
        //vm.selectedAssembly = _.find(vm.assyList, { 'id': vm.assykeyColumnId  });
        vm.assykeyColumnId = partID;
      }
      $timeout(() => {
        initAutoComplete();
      });
    };
    //Get Assembly List
    const getAssyList = () => MasterFactory.getAssyPartList().query({ customerID: null }).$promise.then((response) => {
      vm.allAssyList = response.data;
      if (vm.copyModel.isBOM) {
        vm.assyList = _.filter(response.data, (item) => {
          if (item.lineItemCount === 0) {
            return item;
          }
        });
      }
      else {
        vm.assyList = _.filter(response.data, (item) => {
          if (item.QuoteGroup) {
            return item;
          }
        });
        vm.CopyAssyBOMForm.$setDirty();
      }
      vm.changeRFQBOM();
    }).catch((error) => BaseService.getErrorLog(error));

    //Get RFQ Quote Number List
    const getRFQQuoteGroupList = () => MasterFactory.getQuoteNumberList().query({ customerID: vm.copyModel.customerID, partID: vm.copyModel.partID }).$promise.then((response) => {
      vm.QuoteGroupNumberList = response.data;
      if (vm.QuoteGroupNumberList.length === 1 && vm.copyModel.isExistingRFQ) {
        vm.autoCompleteRFQ.keyColumnId = vm.QuoteGroupNumberList[0].id;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    // on page load bind autocomplete of customer.
    const autocompletePromise = [getAssyList(), getAssemblyComponentDetailById()];

    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
      $timeout(() => {
        initAutoComplete();
      }, _configSelectListTimeout);
    }).catch((error) => BaseService.getErrorLog(error));

    function getAssemblyComponentDetailById() {
      return MasterFactory.getAssemblyComponentDetailById().query({ id: partID }).$promise.then((response) => {
        if (response && response.data) {
          const rfqAssy = response.data;
          vm.bom = {
            mfgPNDescription: rfqAssy.mfgPNDescription,
            mfgPN: rfqAssy.mfgPN,
            PIDCode: rfqAssy.PIDCode,
            RoHSStatusID: rfqAssy.RoHSStatusID,
            isBOMVerified: rfqAssy.componentbomSetting && rfqAssy.componentbomSetting[0].isBOMVerified,
            RoHSStatusIcon: CORE.WEB_URL + USER.ROHS_BASE_PATH + 'rohs.jpg'
          };

          if (rfqAssy && rfqAssy.rfqAssemblies && rfqAssy.rfqAssemblies.length > 0) {
            let rfqAssemblyDetails = {};
            if (rfqAssyID) {
              rfqAssemblyDetails = _.find(rfqAssy.rfqAssemblies, (item) => item.id === rfqAssyID);
            }
            else {
              rfqAssemblyDetails = _.head(rfqAssyBOMModel.rfqAssemblies);
              rfqAssyID = rfqAssemblyDetails.id;
            }
            if (rfqAssemblyDetails) {
              vm.bom.reqAssyID = rfqAssemblyDetails.id;
              vm.bom.status = rfqAssemblyDetails.status;
              vm.bom.isSummaryComplete = rfqAssemblyDetails.isSummaryComplete;
              vm.bom.isReadyForPricing = rfqAssemblyDetails.isReadyForPricing;
              vm.bom.quoteFinalStatus = rfqAssemblyDetails.quoteFinalStatus || null;
              vm.bom.quoteindate = rfqAssemblyDetails.quoteInDate;
              vm.bom.rfqNo = rfqAssemblyDetails.rfqForms.id;
              vm.customerID = rfqAssemblyDetails.rfqForms.customerId;
              if (rfqAssemblyDetails.rfqForms.customer) {
                vm.bom.companyName = rfqAssemblyDetails.rfqForms.customer.mfgCodeName;
              }
            }
          }
          else {
            rfqAssyID = 0;
          }
          if (vm.bom.RoHSStatusID && rfqAssy.rfq_rohsmst && rfqAssy.rfq_rohsmst.rohsIcon) {
            vm.bom.displayRohsIcon = stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, rfqAssy.rfq_rohsmst.rohsIcon);
            vm.bom.RoHSName = rfqAssy.rfq_rohsmst.name;
          }
          bindHeaderData();
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
        return null;
      });
    };

    const initAutoComplete = () => {
      vm.autoCompleteAssy = {
        columnName: 'PIDCode',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.assykeyColumnId,
        inputName: 'Assembly',
        placeholderName: 'Assy ID',
        isRequired: true,
        isAddnew: vm.isAddAssymbly,
        callbackFn: getAssyList,
        onSelectCallbackFn: onSelectAssemblyCallbackFn,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: vm.PartCategory.SubAssembly,
          customerID: vm.autoCompleteCustomer ? vm.autoCompleteCustomer.keyColumnId : null,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName
        }
      };
      vm.autoCompleteRFQ = {
        columnName: 'id',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'id',
        placeholderName: 'Quote Group',
        isRequired: false,
        isAddnew: false,
        callbackFn: getRFQQuoteGroupList,
        onSelectCallbackFn: function () { vm.isformDirty = true; }
      };
    };

    function onSelectAssemblyCallbackFn(item) {
      if (vm.copyModel) {
        vm.autoCompleteRFQ.keyColumnId = null;
        vm.QuoteGroupNumberList = [];
        if (!item) {
          vm.copyModel.partID = null;
          vm.copyModel.PIDCode = null;
          vm.copyModel.RoHSStatusID = null;
          vm.copyModel.RoHSIcon = CORE.WEB_URL + USER.ROHS_BASE_PATH + CORE.NO_IMAGE_ROHS;
          vm.copyModel.rohsName = null;
          vm.copyModel.customerID = null;
          vm.copyModel.customerName = null;
          vm.copyModel.mfgPN = null;
          vm.copyModel.nickName = null;
          vm.copyModel.isCustom = null;
          vm.copyModel.custAssyPN = null;
        }
        else {
          vm.copyModel.partID = item.id;
          vm.copyModel.PIDCode = item.PIDCode;
          vm.copyModel.toAssyID = item.PIDCode;
          vm.copyModel.RoHSStatusID = item.RoHSStatusID;
          vm.copyModel.RoHSIcon = item.rohsIcon ? CORE.WEB_URL + USER.ROHS_BASE_PATH + item.rohsIcon : CORE.WEB_URL + USER.ROHS_BASE_PATH + CORE.NO_IMAGE_ROHS;
          vm.copyModel.rohsName = item.rohsName;
          vm.copyModel.customerID = item.mfgCodeID;
          vm.copyModel.customerName = item.mfgNameWithCode;
          vm.copyModel.mfgPN = item.mfgPN;
          vm.copyModel.nickName = item.nickName;
          vm.copyModel.isCustom = item.isCustom;
          vm.copyModel.custAssyPN = item.custAssyPN;
          getRFQQuoteGroupList();
        }
      }
      if (vm.copyModel.isBOM) {
        vm.isformDirty = true;
      }
    }

    vm.searchAssy = () => {
      if (vm.autoCompleteAssemblyNumber.keyColumnId) {
        vm.isSearch = true;
        vm.pagingInfo.assyNumber = vm.autoCompleteAssemblyNumber.keyColumnId;
        vm.pagingInfo.assyID = rfqAssyID;
        vm.loadRFQData();
      } else {
        vm.isSearch = false;
      }
    };

    vm.save = () => {
      if (vm.CopyAssyBOMForm.$invalid || !vm.CopyAssyBOMForm.$dirty) {
        BaseService.focusRequiredField(vm.CopyAssyBOMForm);
        return;
      }
      vm.copyModel.fromPartID = partID;
      vm.copyModel.fromAssyID = vm.bom.PIDCode;
      vm.copyModel.fromCustomerID = vm.customerID;
      if (!vm.copyModel.isBOM) {
        if (vm.copyModel.isExistingRFQ) {
          vm.copyModel.rfqFormID = vm.autoCompleteRFQ.keyColumnId;
        }

        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.COPY_RFQ_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.copyModel.isExistingRFQ ? vm.copyModel.rfqFormID : 'New');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = CopyBOMPopupFactory.copyAssyBOM().query(vm.copyModel).$promise.then((response) => {
              if (response && response.data && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                $mdDialog.hide();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => { }, (error) => BaseService.getErrorLog(error));
      } else {
        if (vm.copyModel.customerID !== vm.customerID) {
          DialogFactory.dialogService(
            RFQTRANSACTION.COPY_BOM_CUSTOMER_APPROVAL_POPUP_CONTROLLER,
            RFQTRANSACTION.COPY_BOM_CUSTOMER_APPROVAL_POPUP_VIEW,
            _dummyEvent,
            { mfgPNID: vm.copyModel.partID, isBOM: vm.copyModel.isBOM }).then((result) => {
              if (result) {
                vm.copyModel.customerApprovalComment = result;
                vm.cgBusyLoading = CopyBOMPopupFactory.copyAssyBOM().query(vm.copyModel).$promise.then((response) => {
                  if (response && response.data && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                    $mdDialog.hide();
                  }
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }, () => {
              // Empty
            }, (err) => {
              BaseService.getErrorLog(err);
            });
        }
        else {
          vm.cgBusyLoading = CopyBOMPopupFactory.copyAssyBOM().query(vm.copyModel).$promise.then((response) => {
            if (response && response.data && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              $mdDialog.hide();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.CopyAssyBOMForm);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };

    function bindHeaderData() {
      vm.headerdata = [];
      vm.headerdata.push({
        label: vm.LabelConstant.Assembly.QuoteGroup,
        value: quoteGroup,
        displayOrder: 1,
        labelLinkFn: null,
        valueLinkFn: vm.goToRFQ,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      }, {
        label: vm.LabelConstant.Customer.Customer,
        value: vm.bom.companyName,
        displayOrder: 1,
        labelLinkFn: vm.goToCustomer,
        valueLinkFn: vm.goToCustomerDet,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      }, {
        label: vm.LabelConstant.Assembly.ID,
        value: vm.bom.PIDCode,
        displayOrder: 1,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: null,
        isCopy: true,
        isCopyAheadLabel: false,
        isAssy: true,
        imgParms: {
          imgPath: vm.bom.displayRohsIcon,
          imgDetail: vm.bom.RoHSName
        }
      }, {
        label: vm.LabelConstant.Assembly.MFGPN,
        value: vm.bom.mfgPN,
        displayOrder: 1,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: null,
        isCopy: true,
        isCopyAheadLabel: false,
        isAssy: true,
        imgParms: {
          imgPath: vm.bom.displayRohsIcon,
          imgDetail: vm.bom.RoHSName
        }
      });
    }
    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
  }
})();
