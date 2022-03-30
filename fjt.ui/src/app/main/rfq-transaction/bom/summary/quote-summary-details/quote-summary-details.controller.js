(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('QuoteSummaryDetailsController', QuoteSummaryDetailsController);

  /** @ngInject */
  function QuoteSummaryDetailsController($scope, $q, $state, $stateParams, $timeout, PartCostingFactory, GenericCategoryFactory, PRICING, CustomerConfirmationPopupFactory, CustomerFactory, ECORequestFactory, BOMFactory, RFQTRANSACTION, CORE, DialogFactory, USER, BaseService, MasterFactory, socketConnectionService, SupplierInvoiceFactory, TRANSACTION) {
    const vm = this;
    vm.DateFormatArray = _dateDisplayFormat;
    vm.Entity = CORE.Entity.RFQ;
    vm.entityID = CORE.AllEntityIDS.RFQ.ID;
    vm.quoteSubmittedID = $state.params.quoteSubmittedID;
    vm.InputeFieldKeys = CORE.InputeFieldKeys;
    vm.LabelConstant = CORE.LabelConstant;
    vm.RoHSLeadFreeText = CORE.RoHSLeadFreeText;
    vm.NotApplicableText = CORE.DefaultNotApplicable;
    vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE;
    vm.statusGridHeaderDropdown = CORE.RFQStatusGridHeaderDropdown;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.isSummaryView = true;
    vm.categoryArray = CORE.ECOTypeCategory;
    vm.taToolbar = CORE.Toolbar;
    const CategoryTypeObjList = CORE.CategoryType;
    vm.quoteStatus = RFQTRANSACTION.RFQ_ASSY_QUOTE_STATUS;
    vm.rfqAssyStatus = RFQTRANSACTION.RFQ_ASSY_STATUS;
    vm.pageType = $stateParams.pageType;
    vm.quotePageType = RFQTRANSACTION.QUOTE_PAGE_TYPE;
    vm.FullDateTimeFormat = _dateTimeFullTimeDisplayFormat;
    vm.isShowAvailableStock = true;
    vm.reportFormat = 1;
    vm.comapnyCode = '';
    vm.isPrintDisable = false;
    vm.isDownloadDisabled = false;
    const APIProjectURLconfig = _configWebUrl;
    vm.transactionType = TRANSACTION.StartStopActivityTransactionType;
    vm.actionType = TRANSACTION.StartStopActivityActionType;
    // Check if user is admin or executive
    vm.loginUser = BaseService.loginUser;
    vm.loginUserId = vm.loginUser.userid;
    vm.isStartAndStopRequestFromThisPage = false;
    vm.fileList = {};
    vm.custAddrViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
    vm.contPersonViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);
    vm.custShipAddrViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
    vm.contShipPersonViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);

    const getECOCategoryWithValues = (refresh) => {
      const category = vm.categoryArray[1].id;
      if (category) {
        return ECORequestFactory.getECOCategoryWithValues().query({
          category: category
        }).$promise.then((response) => {
          vm.termsDetails = response.data;
          if (refresh) {
            getTermsselected();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    const initPaymentTermsAutoComplete = () => {
      vm.autoCompletePaymentTerms = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.assyData ? (vm.assyData.custTermsID ? vm.assyData.custTermsID : null) : null,
        inputName: CORE.CategoryType.Terms.Name,
        addData: {
          headerTitle: CategoryTypeObjList.Terms.Title,
          popupAccessRoutingState: [USER.ADMIN_TERMS_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CategoryTypeObjList.Terms.Title
        },
        isAddnew: true,
        placeholderName: CORE.CategoryType.Terms.Name,
        callbackFn: getPaymentTermsValues,
        onSelectCallbackFn: getPaymentTermDetail
      };
    };
    const getPaymentTermDetail = (item) => {
      if (item) {
        vm.assyData.custTermsID = item.gencCategoryID;
        vm.assyData.termsDays = item.termsDays;
        vm.assyData.selectedPaymentTerm = _.find(vm.GenericCategoryList, { gencCategoryID: vm.assyData.custTermsID });
      } else {
        vm.assyData.custTermsID = null;
        vm.assyData.termsDays = null;
        vm.assyData.selectedPaymentTerm = null;
      }
    };
    const getPaymentTermsValues = () => {
      const category = CORE.CategoryType.Terms.Name;
      return GenericCategoryFactory.getAllGenericCategoryByCategoryType().query({
        categoryType: category
      }).$promise.then((genericcategorylist) => {
        vm.GenericCategoryList = [];
        if (genericcategorylist && genericcategorylist.data) {
          vm.GenericCategoryList = genericcategorylist.data;

          vm.assyData.selectedPaymentTerm = _.find(vm.GenericCategoryList, { gencCategoryID: vm.assyData.custTermsID });
          initPaymentTermsAutoComplete();
        }
        return $q.resolve(vm.GenericCategoryList);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /*
     * Author :  Champak Chaudhary
     * Purpose : Get customer address
     */
    const getCustomerAddress = (id) => CustomerFactory.customerAddressList().query({
      customerId: id,
      addressType: [CORE.AddressType.ShippingAddress, CORE.AddressType.BillingAddress],
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST
    }).$promise.then((customeraddress) => {
      vm.BillingAddressList = _.filter(customeraddress.data, (item) => item.addressType === 'B');
      vm.ShippingAddressList = _.filter(customeraddress.data, (item) => item.addressType === 'S');
      if (!vm.assyData.custBillingAddressID && !vm.assyData.custShippingAddressID) {
        // bill to address

        const defaultBillToAddrDet = _.find(vm.BillingAddressList, (addrItem) => addrItem.isDefault);
        if (defaultBillToAddrDet) {
          setBillToAddrContDetForApplied(defaultBillToAddrDet);
        }
        // ship to address
        const defaultShipToAddrDet = _.find(vm.ShippingAddressList, (addrItem) => addrItem.isDefault);
        if (defaultShipToAddrDet) {
          setShipToAddrContDetForApplied(defaultShipToAddrDet);
        }
      } else if (!vm.assyData.custBillingAddressID || !vm.assyData.custShippingAddressID) {
        if (!vm.assyData.custBillingAddressID) {
          const defaultBillToAddrDet = _.find(vm.BillingAddressList, (addrItem) => addrItem.isDefault);
          if (defaultBillToAddrDet) {
            setBillToAddrContDetForApplied(defaultBillToAddrDet);
          }
        }
        if (!vm.assyData.custShippingAddressID) {
          const defaultShipToAddrDet = _.find(vm.ShippingAddressList, (addrItem) => addrItem.isDefault);
          if (defaultShipToAddrDet) {
            setShipToAddrContDetForApplied(defaultShipToAddrDet);
          }
        }
      } else if (vm.assyData.custBillingAddressID && vm.assyData.custShippingAddressID) {
        // bill to address
        const selectedBillToAddrDet = _.find(vm.BillingAddressList, (addrItem) => addrItem.id === vm.assyData.custBillingAddressID);
        if (selectedBillToAddrDet) {
          vm.billingAddress = selectedBillToAddrDet;
          if (vm.viewCustAddrOtherDet) {
            vm.viewCustAddrOtherDet.alreadySelectedAddressID = selectedBillToAddrDet.id;
          }
        }
        // ship to address
        const selectedShipToAddrDet = _.find(vm.ShippingAddressList, (addrItem) => addrItem.id === vm.assyData.custShippingAddressID);
        if (selectedShipToAddrDet) {
          vm.shippingAddress = selectedShipToAddrDet;
          if (vm.viewShipCustAddrOtherDet) {
            vm.viewShipCustAddrOtherDet.alreadySelectedAddressID = selectedShipToAddrDet.id;
          }
        }
      }
      vm.custAddrViewActionBtnDet.AddNew.isDisable = vm.contPersonViewActionBtnDet.AddNew.isDisable = vm.custShipAddrViewActionBtnDet.AddNew.isDisable = vm.contShipPersonViewActionBtnDet.AddNew.isDisable = vm.isDisable;
      vm.custAddrViewActionBtnDet.ApplyNew.isDisable = vm.custShipAddrViewActionBtnDet.ApplyNew.isDisable = (!vm.isDisable) ? false : true;
      vm.custAddrViewActionBtnDet.Update.isDisable = (vm.billingAddress && !vm.isDisable) ? false : true;
      vm.custShipAddrViewActionBtnDet.Update.isDisable = (vm.shippingAddress && !vm.isDisable) ? false : true;
      vm.custAddrViewActionBtnDet.Delete.isVisible = false;
      vm.custShipAddrViewActionBtnDet.Delete.isVisible = false;
      return $q.resolve(vm.BillingAddressList);
    }).catch((error) => BaseService.getErrorLog(error));

    /*
    * Author :  Champak Chaudhary
    * Purpose : Get customer contact person detail
    */
    const getCustomerContactPersonList = () => CustomerFactory.getCustomerContactPersons().query({
      refTransID: vm.assyData.customerid,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST
    }).$promise.then((contactperson) => {
      if (contactperson && contactperson.data) {
        vm.ContactPersonList = contactperson.data;
        if (vm.assyData.custBillingContactPersonID) {
          const selectedContPersonDet = _.find(vm.ContactPersonList, (contItem) => contItem.personId === vm.assyData.custBillingContactPersonID);
          if (selectedContPersonDet) {
            vm.selectedContactPerson = selectedContPersonDet;
            if (vm.viewCustAddrOtherDet) {
              vm.viewCustAddrOtherDet.alreadySelectedPersonId = vm.selectedContactPerson.personId;
            }
          }
        }
        if (vm.assyData.custShippingContactPersonID) {
          const selectedShipContPersonDet = _.find(vm.ContactPersonList, (contItem) => contItem.personId === vm.assyData.custShippingContactPersonID);
          if (selectedShipContPersonDet) {
            vm.selectedShipContactPerson = selectedShipContPersonDet;
            if (vm.viewShipCustAddrOtherDet) {
              vm.viewShipCustAddrOtherDet.alreadySelectedPersonId = vm.selectedShipContactPerson.personId;
            }
          }
        }
        vm.contPersonViewActionBtnDet.Update.isDisable = (!vm.isDisable && vm.selectedContactPerson) ? false : true;
        vm.contShipPersonViewActionBtnDet.Update.isDisable = (!vm.isDisable && vm.selectedShipContactPerson) ? false : true;
        vm.contPersonViewActionBtnDet.ApplyNew.isDisable = vm.contShipPersonViewActionBtnDet.ApplyNew.isDisable = (!vm.isDisable) ? false : true;
        vm.contPersonViewActionBtnDet.Delete.isVisible = vm.contShipPersonViewActionBtnDet.Delete.isVisible = false;
        return $q.resolve(vm.ContactPersonList);
      }
    }).catch((error) => BaseService.getErrorLog(error));
    // get Component Internal Version
    function getComponentInternalVersion() {
      if (vm.assyData.partID) {
        return MasterFactory.getComponentInternalVersion().query({
          id: vm.assyData.partID
        }).$promise.then((component) => {
          if (component && component.data) {
            vm.liveInternalVersion = component.data.liveVersion;
          }
          return vm.liveInternalVersion;
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }


    const getComment = () => {
      const model = {
        partID: vm.assyData.partID,
        externalIssue: true
      };
      vm.copyBomIssue = '';
      vm.cgBusyLoading = CustomerConfirmationPopupFactory.getRfqLineItemsCopyDescription().save(model).$promise.then((response) => {
        if (response && response.data) {
          if (response.data && response.data.length > 0) {
            _.each(response.data, (copyData) => {
              vm.copyBomIssue += stringFormat('{0}: {1}<br/>', copyData.assyID, copyData.description);
            });
            vm.assyData.BOMIssues = stringFormat('{0} <br/> {1} <br/> {2}', '<b>Issues Require Customer Engineering Resolution</b>', vm.copyBomIssue, vm.assyData.BOMIssues);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };


    // open addEdit Addresses popup
    vm.addEditAddress = (ev, callBackAddress) => {
      if (callBackAddress) {
        vm.billingAddress = callBackAddress;
        vm.assyData.custBillingAddressID = vm.billingAddress.id;
        const addressPromise = [getCustomerAddress(vm.assyData.customerid)];
        vm.cgBusyLoading = $q.all(addressPromise).then(() => {
          // Static code to enable save button
          vm.summaryDetailForm.$$controls[0].$setDirty();
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    // open addEdit Addresses popup
    vm.addEditShipAddress = (ev, callBackAddress) => {
      if (callBackAddress) {
        vm.shippingAddress = callBackAddress;
        vm.assyData.custShippingAddressID = vm.shippingAddress.id;
        const addressPromise = [getCustomerAddress(vm.assyData.customerid)];
        vm.cgBusyLoading = $q.all(addressPromise).then(() => {
          // Static code to enable save button
          vm.summaryDetailForm.$$controls[0].$setDirty();
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    // open addEdit Addresses popup
    vm.selectShipToAddressDet = (ev, callBackAddress) => {
      if (callBackAddress) {
        setShipToAddrContDetForApplied(callBackAddress);
        vm.summaryDetailForm.$setDirty();
      }
    };
    // open addEdit Addresses popup
    vm.selectAddress = (ev, callBackAddress) => {
      if (callBackAddress) {
        setBillToAddrContDetForApplied(callBackAddress);
        vm.summaryDetailForm.$setDirty();
      }
    };

    const setBillToAddrContDetForApplied = (newApplyAddrDet) => {
      vm.assyData.custBillingAddressID = newApplyAddrDet.id;
      if (newApplyAddrDet.contactPerson) {
        vm.assyData.custBillingContactPersonID = newApplyAddrDet.contactPerson.personId;
        vm.assyData.custBillingContactPerson = BaseService.generateContactPersonDetFormat(newApplyAddrDet.contactPerson);
        vm.selectedContactPerson = angular.copy(newApplyAddrDet.contactPerson);
        if (vm.viewCustAddrOtherDet) {
          vm.viewCustAddrOtherDet.alreadySelectedPersonId = vm.selectedContactPerson.personId;
        }
      } else {
        vm.assyData.custBillingContactPersonID = null;
        vm.assyData.custBillingContactPerson = null;
        vm.selectedContactPerson = null;
      }
      vm.billingAddress = newApplyAddrDet;
      vm.custAddrViewActionBtnDet.Update.isDisable = (vm.billingAddress && !vm.isDisable) ? false : true;
      vm.custAddrViewActionBtnDet.ApplyNew.isDisable = (!vm.isDisable) ? false : true;
      vm.contPersonViewActionBtnDet.Update.isDisable = (vm.selectedContactPerson && !vm.isDisable) ? false : true;
      vm.contPersonViewActionBtnDet.ApplyNew.isDisable = (!vm.isDisable) ? false : true;
      vm.contPersonViewActionBtnDet.Delete.isVisible = false;
      vm.custAddrViewActionBtnDet.Delete.isVisible = false;
    };
    // set ship to address
    const setShipToAddrContDetForApplied = (newApplyAddrDet) => {
      vm.assyData.custShippingAddressID = newApplyAddrDet.id;
      if (newApplyAddrDet.contactPerson) {
        vm.assyData.custShippingContactPersonID = newApplyAddrDet.contactPerson.personId;
        vm.assyData.custShippingContactPerson = BaseService.generateContactPersonDetFormat(newApplyAddrDet.contactPerson);
        vm.selectedShipContactPerson = angular.copy(newApplyAddrDet.contactPerson);
        if (vm.viewShipCustAddrOtherDet) {
          vm.viewCustAddrOtherDet.alreadySelectedPersonId = vm.selectedContactPerson.personId;
        }
      } else {
        vm.assyData.custShippingContactPersonID = null;
        vm.assyData.custShippingContactPerson = null;
        vm.selectedShipContactPerson = null;
      }
      vm.shippingAddress = newApplyAddrDet;
      vm.custShipAddrViewActionBtnDet.Update.isDisable = (vm.shippingAddress && !vm.isDisable) ? false : true;
      vm.custShipAddrViewActionBtnDet.ApplyNew.isDisable = (!vm.isDisable) ? false : true;
      vm.contShipPersonViewActionBtnDet.Update.isDisable = (vm.selectedShipContactPerson && !vm.isDisable) ? false : true;
      vm.contShipPersonViewActionBtnDet.ApplyNew.isDisable = (!vm.isDisable) ? false : true;
      vm.custShipAddrViewActionBtnDet.Delete.isVisible = false;
      vm.contShipPersonViewActionBtnDet.Delete.isVisible = false;
    };
    // set data for customer address directive
    const setShipOtherDetForCustAddrDir = (custID) => {
      vm.viewShipCustAddrOtherDet = {
        customerId: custID || vm.assyData.customerid,
        addressType: CORE.AddressType.ShippingAddress,
        addressBlockTitle: vm.LabelConstant.Address.ShippingFromAddress,
        refTransID: custID || vm.assyData.customerid,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
        alreadySelectedAddressID: (vm.shippingAddress && vm.shippingAddress.id) || null,
        mfgType: CORE.MFG_TYPE.CUSTOMER,
        alreadySelectedPersonId: (vm.selectedShipContactPerson && vm.selectedShipContactPerson.personId) || null,
        showAddressEmptyState: !(vm.ShippingAddressList && vm.ShippingAddressList.length)
      };
      vm.viewShipCustAddrOtherDet.companyName = vm.assyData.mfgName;
      vm.viewShipCustAddrOtherDet.companyNameWithCode = vm.assyData.mfrCompanyName;
    };
    // set data for customer address directive
    const setOtherDetForCustAddrDir = (custID) => {
      vm.viewCustAddrOtherDet = {
        customerId: custID || vm.assyData.customerid,
        addressType: CORE.AddressType.BillingAddress,
        addressBlockTitle: vm.LabelConstant.Address.BillingAddress,
        refTransID: custID || vm.assyData.customerid,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
        alreadySelectedAddressID: (vm.billingAddress && vm.billingAddress.id) || null,
        mfgType: CORE.MFG_TYPE.CUSTOMER,
        alreadySelectedPersonId: (vm.selectedContactPerson && vm.selectedContactPerson.personId) || null,
        showAddressEmptyState: !(vm.BillingAddressList && vm.BillingAddressList.length)
      };

      vm.viewCustAddrOtherDet.companyName = vm.assyData.mfgName;
      vm.viewCustAddrOtherDet.companyNameWithCode = vm.assyData.mfrCompanyName;
    };
    function getCustomerList() {
      return MasterFactory.getCustomerByEmployeeID().query().$promise.then((customer) => {
        if (customer && customer.data) {
          vm.CustomerList = customer.data;
        }
        return vm.CustomerList;
      }).catch((error) => BaseService.getErrorLog(error));
    }
    function getCompayDetails() {
      vm.cgBusyLoading = SupplierInvoiceFactory.companyConfigurationCheck().query({}).$promise.then((response) => {
        if (response && response.data) {
          vm.comapnyCode = response.data.mfgCode;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    getCustomerList();
    getCompayDetails();
    function getAssyDetails() {
      const model = {
        APIProjectURL: APIProjectURLconfig,
        id: $state.params.id,
        quoteSubmittedID: $state.params.quoteSubmittedID
      };
      vm.cgBusyLoading = BOMFactory.getAssyQuoteSummaryDetails().query(model).$promise.then((response) => {
        if (response && response.data) {
          if (vm.CustomerList.length > 0) {
            const assyDetail = response.data.AssyDetail[0];
            if (assyDetail) {
              const CustomerObj = _.find(vm.CustomerList, { id: assyDetail.customerid });
              if (CustomerObj) {
                vm.isCustomerAccess = true;
              } else {
                vm.isCustomerAccess = false;
              }
              vm.isActivityStart = assyDetail.isActivityStart;
              vm.ActivityStartAt = assyDetail.activityStartAt;
              vm.activityStartBy = assyDetail.activityStartBy;
              vm.CostingActivityStartedByUserName = assyDetail.userName;
              if (vm.isActivityStart) {
                vm.startCostingTimer();
              }
            }
          }

          switch (vm.pageType) {
            case vm.quotePageType.QUOTE.Name:
              vm.isQuotePage = true;
              vm.isSummaryView = true;

              if (!response.data.AssyDetail[0].isSummaryComplete) {
                if (!response.data.revisedQuoteDetail[0].quoteNumber) {
                  const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.QUOTE_NOT_AVAILABLE);
                  const obj = {
                    messageContent: messgaeContent
                  };

                  return DialogFactory.messageAlertDialog(obj).then(() => {
                    $state.go(RFQTRANSACTION.RFQ_QUOTE_STATE, { id: $stateParams.id, pageType: vm.quotePageType.PREVIEW_QUOTE.Name }, { reload: true });
                  }, () => {
                  }).catch((error) => BaseService.getErrorLog(error));
                }
                else {
                  binddata(response);
                  vm.isQuoteCompleted = true;
                }
              } else {
                if (response.data.AssyDetail[0].quoteFinalStatus === vm.quoteStatus.COMPLETED.VALUE) {
                  binddata(response);
                  vm.isQuoteCompleted = true;
                } else {
                  binddata(response);
                }
              }
              break;
            case vm.quotePageType.PREVIEW_QUOTE.Name:
              if (response.data.AssyDetail.length > 0 && response.data.AssyDetail[0].isSummaryComplete) {
                if (response.data.AssyDetail[0].quoteFinalStatus === vm.quoteStatus.COMPLETED.VALUE || !vm.isActivityStart) {
                  vm.isQuotePage = false;
                  vm.isSummaryView = true;
                  vm.isQuoteCompleted = true;
                } else {
                  vm.isQuotePage = false;
                  vm.isSummaryView = false;
                  vm.isQuoteCompleted = false;
                }
              } else {
                vm.isQuotePage = false;
                vm.isSummaryView = false;
                vm.isQuoteCompleted = false;
                if (!vm.isActivityStart && vm.activityStartBy === vm.loginUserId) {
                  vm.isSummaryView = true;
                }
              }
              binddata(response);
              break;
          }
        }
      });
    }
    function bindPriceGroupMatrix(rfqPriceGroupDetail) {
      vm.PriceGroupMatrix = _.chain(rfqPriceGroupDetail).groupBy('PIDCode').map((value) => {
        var partDeail = _.first(value) || {};
        return {
          priceGroupDetail: value,
          PIDCode: partDeail.PIDCode,
          partID: partDeail.partID,
          RoHSIcon: vm.rohsImagePath + partDeail.rohsIcon,
          rohsName: partDeail.rohsName,
          mfgPN: partDeail.mfgPN
        };
      }).value();
    }
    function binddata(response) {
      if (response && response.data) {
        vm.assyData = response.data.AssyDetail[0];
        vm.assyData.isCustomPartDetShowInReport = vm.assyData.isCustomPartDetShowInReport ? true : false;
        vm.revisedQuoteData = response.data.revisedQuoteDetail[0];
        vm.StandardClass = response.data.StandardClass;
        vm.partStandardClass = response.data.partStandardClass;
        vm.quoteDetails = response.data.QuoteDetails;
        vm.termsDetails = response.data.terms;
        vm.selectedTerms = response.data.selectedTerms;
        vm.lastQuotedetail = response.data.lastSubmitedQuote[0];
        vm.reQuoteCount = response.data.reQuoteCount;
        vm.NREDetails = response.data.NREDetails;
        vm.CustomPartDetails = response.data.CustomPartDetails;
        vm.ToolingDetails = response.data.ToolingDetails;
        vm.BOMIssues = response.data.BOMIssue;
        vm.rfqPriceGroup = response.data.rfqPriceGroup;
        vm.rfqPriceGroupDetail = response.data.rfqPriceGroupDetail;
        bindPriceGroupMatrix(vm.rfqPriceGroupDetail);
        if (vm.BOMIssues && vm.BOMIssues.LongLeadTime && vm.BOMIssues.LongLeadTime.length > 0) {
          vm.BOMIssues.LongLeadTimeCustomPart = angular.copy(_.filter(vm.BOMIssues.LongLeadTime, { isCustom: 1 }));
          vm.BOMIssues.LongLeadTime = _.filter(vm.BOMIssues.LongLeadTime, { isCustom: 0 });
        }
        vm.isEdit = (vm.lastQuotedetail.id === vm.revisedQuoteData.id && vm.assyData.isSummaryComplete) ? true : !vm.revisedQuoteData.quoteNumber ? true : false;
        const autocompleteCustomerPromise = [getCustomerAddress(vm.assyData.customerid), getCustomerContactPersonList(), getPaymentTermsValues(), getComponentInternalVersion()];
        vm.cgBusyLoading = $q.all(autocompleteCustomerPromise).then(() => {
          setOtherDetForCustAddrDir(vm.assyData.customerid);
          setShipOtherDetForCustAddrDir(vm.assyData.customerid);
        }).catch((error) => BaseService.getErrorLog(error));
        getPaymentTermsValues();
        getComponentInternalVersion();
        if (!vm.assyData.isReadyForPricing) {
          getComment();
        }

        vm.selectedTerm = _.filter(vm.termsDetails, (termObj) => {
          const selectedvalues = _.filter(termObj.ecoTypeValues, (termValue) => {
            const objterm = _.find(vm.selectedTerms, { termsconditionTypeValueID: termValue.ecoTypeValID });
            if (objterm) {
              termValue.id = objterm.id;
              termValue.selected = true;
              termValue.note = objterm.note;
              return true;
            }
          });
          if (selectedvalues.length > 0) {
            return true;
          }
        });
        switch (parseInt(vm.assyData.quoteFinalStatus)) {
          case vm.quoteStatus.PENDING.VALUE:
            vm.assyData.quoteProgress = vm.quoteStatus.PENDING.NAME;
            break;
          case vm.quoteStatus.RE_QUOTE.VALUE:
            vm.assyData.quoteProgress = vm.quoteStatus.RE_QUOTE.NAME;
            break;
          case vm.quoteStatus.SUBMITTED.VALUE:
            vm.assyData.quoteProgress = vm.quoteStatus.SUBMITTED.NAME;
            break;
          case vm.quoteStatus.COMPLETED.VALUE:
            vm.assyData.quoteProgress = vm.quoteStatus.COMPLETED.NAME;
            break;
        };
      }
    }
    vm.editSummary = (form) => {
      if (vm.assyData.quoteFinalStatus == vm.quoteStatus.COMPLETED.VALUE || !vm.isActivityStart) { return false;}
      if (vm.isQuotePage && !vm.isSummaryView) {
        if (form.$valid && !form.$dirty) {
          BaseService.focusRequiredField(form);
          return;
        }
      } if (vm.isQuotePage && vm.isSummaryView) {
        vm.isSummaryView = vm.isSummaryView ? false : true;
        return;
      } else {
        if (form.$valid && !form.$dirty) {
          BaseService.focusRequiredField(form);
          return;
        }
      }
      if (!vm.isSummaryView) {
        if (vm.assyData.custBillingAddressID && !vm.assyData.custBillingContactPersonID) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
          messageContent.message = stringFormat(messageContent.message, CORE.LabelConstant.COMMON.BillingAddressContactPerson);
          const model = {
            multiple: true,
            messageContent: messageContent
          };
          return DialogFactory.messageAlertDialog(model);
        } else if (vm.assyData.custShippingAddressID && !vm.assyData.custShippingContactPersonID) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
          messageContent.message = stringFormat(messageContent.message, CORE.LabelConstant.COMMON.ShippingAddressContactPerson);
          const model = {
            multiple: true,
            messageContent: messageContent
          };
          return DialogFactory.messageAlertDialog(model);
        } else {
          vm.summaryDetail = {
            quoteNotes: vm.assyData.quoteNote,
            quoteID: vm.assyData.quoteID,
            additionalRequirement: vm.assyData.additionalRequirement,
            isCustomPartDetShowInReport: vm.assyData.isCustomPartDetShowInReport,
            assyNote: vm.assyData.assyNote,
            rfqAssyID: vm.assyData.rfqAssyID,
            BOMIssues: vm.assyData.BOMIssues,
            promotions: vm.assyData.promotions,
            refSubmittedQuoteID: vm.assyData.quoteSubmittedID,
            OtherNotes: vm.assyData.OtherNotes,
            custBillingAddressID: vm.assyData.custBillingAddressID,
            custShippingAddressID: vm.assyData.custShippingAddressID,
            custTermsID: vm.assyData.custTermsID,
            custBillingContactPerson: BaseService.generateContactPersonDetFormat(vm.selectedContactPerson),
            custBillingContactPersonID: vm.assyData.custBillingContactPersonID,
            custBillingAddress: BaseService.generateAddressFormateToStoreInDB(vm.billingAddress),
            custShippingContactPerson: BaseService.generateContactPersonDetFormat(vm.selectedShipContactPerson),
            custShippingContactPersonID: vm.assyData.custShippingContactPersonID,
            custShippingAddress: BaseService.generateAddressFormateToStoreInDB(vm.shippingAddress)
          };
          const selectedterms = [];
          _.each(vm.termsDetails, (terms) => {
            _.each(terms.ecoTypeValues, (type) => {
              if (type.selected) {
                const obj = {
                  id: type.id | null,
                  RefSubmittedQuoteID: vm.assyData.quoteSubmittedID,
                  termsconditionCatID: terms.ecoTypeCatID,
                  termsconditionTypeValueID: type.ecoTypeValID,
                  note: type.note
                };
                selectedterms.push(obj);
              }
            });
          });
          vm.summaryDetail.AssyTermsAndConditions = selectedterms;
          vm.cgBusyLoading = BOMFactory.saveQuoteSubmittedSummaryDetails().save(vm.summaryDetail).$promise.then(() => {
            vm.selectedTerm = _.filter(vm.termsDetails, (terms) => {
              var obj = angular.copy(terms);
              var selectedvalue = _.filter(terms.ecoTypeValues, (type) => type.selected);
              form.$setPristine();
              obj.ecoTypeValues = selectedvalue;
              if (selectedvalue.length > 0) {
                return true;
              }
            });
            getAssyDetails();
          }).catch((error) => {
            BaseService.getErrorLog(error);
          });
        }
      }
      if (vm.isQuotePage) {
        vm.isSummaryView = vm.isSummaryView ? false : true;
      }
    };

    vm.cancelChanges = (form) => {
      getAssyDetails();
      if (vm.isQuotePage) {
        vm.isSummaryView = vm.isSummaryView ? false : true;
      }
      form.$setPristine();
    };

    getAssyDetails();
    vm.printProfile = (printSectionId) => {
      var innerContents = document.getElementById(printSectionId).innerHTML;
      var popupWinindow = window.open('', '_blank', 'width=700,height=700,scrollbars=yes,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
      popupWinindow.document.open();
      popupWinindow.document.write('\
                <html>\
                    <head>\
                        <style>\
                            @page {\
                                size: A4;\
                                margin: 0;\
                             }\
                         </style>\
                      </head>\
                 <body onload="window.print()">' + innerContents + '\
              </html>');
      popupWinindow.document.close();
    };
    vm.revisedQuote = () => {
      if (vm.assyData.quoteFinalStatus == vm.quoteStatus.COMPLETED.VALUE || !vm.isActivityStart) { return false; }
      vm.cgBusyLoading = PartCostingFactory.revisedQuote().query({ rfqAssyID: $state.params.id }).$promise.then(() => {
        $state.go(RFQTRANSACTION.RFQ_SUMMARY2_STATE, { id: $stateParams.id });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.generateSummary = () => {
      vm.cgBusyLoading = BOMFactory.generateAssyQuoteSummary().query({ id: $state.params.id, quoteSubmittedID: $stateParams.quoteSubmittedID }).$promise.then((response) => {
        if (response && response.status === CORE.ApiResponseTypeStatus.FAILED) {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.QUOTE_VERSION_CHANGED_BY_REVISED_QUOTE);
          const obj = {
            messageContent: messgaeContent
          };

          return DialogFactory.messageAlertDialog(obj).then(() => {
            $state.go(RFQTRANSACTION.QUOTE_SUMMARY_DETAIL_STATE, { id: $stateParams.id, quoteSubmittedID: response.data.quoteSubmittedID, pageType: $stateParams.pageType }, { reload: true });
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        } else if (response && response.data && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (!response.data.dataCount) {
            const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.PART_COSTING_NOT_SUBMITTED);
            const obj = {
              messageContent: messgaeContent
            };
            return DialogFactory.messageAlertDialog(obj).then(() => {
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            vm.quoteDetails = response.data.generatedSummary;
            vm.CustomPartDetails = response.data.generatedCustomPart;
            vm.NREDetails = response.data.generatedNRE;
            vm.ToolingDetails = response.data.generatedTooling;
            vm.rfqPriceGroup = response.data.rfqPriceGroup;
            vm.rfqPriceGroupDetail = response.data.rfqPriceGroupDetail;
            bindPriceGroupMatrix(vm.rfqPriceGroupDetail);
          }
        }
      });
    };

    vm.addTermsAndCondition = (ev, item) => {
      let data = {};
      if (item) {
        data = item;
        data.categoryType = vm.categoryArray[1].id;
      } else {
        data = {
          categoryType: vm.categoryArray[1].id,
          multiSelect: false
        };
      }
      const popUpData = { popupAccessRoutingState: [USER.ADMIN_RFQ_CATEGORY_STATE], pageNameAccessLabel: CORE.PageName.quote_terms_and_conditions_categories };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        DialogFactory.dialogService(
          USER.ADMIN_ECO_CATEGORY_ADD_UPDATE_MODAL_CONTROLLER,
          USER.ADMIN_ECO_CATEGORY_ADD_UPDATE_MODAL_VIEW,
          ev,
          data).then(() => {
            getECOCategoryWithValues();
          }, () => {
          },
            (error) => BaseService.getErrorLog(error));
      }
    };

    vm.addTermsAndConditionValue = (ev, data) => {
      const obj = {
        categoryType: data.category,
        ecoTypeCatID: data.ecoTypeCatID
      };
      const popUpData = { popupAccessRoutingState: [USER.ADMIN_RFQ_CATEGORY_VALUES_STATE], pageNameAccessLabel: CORE.PageName.quote_terms_and_conditions_attributes };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        DialogFactory.dialogService(
          USER.ADMIN_ECO_CATEGORY_VALUES_ADD_UPDATE_MODAL_CONTROLLER,
          USER.ADMIN_ECO_CATEGORY_VALUES_ADD_UPDATE_MODAL_VIEW,
          ev,
          obj).then(() => {
            getECOCategoryWithValues();
          }, () => { },
            (error) => BaseService.getErrorLog(error));
      }
    };

    vm.ViewQuoteHistory = (ev) => {
      const obj = {
        rfqAssyID: $state.params.id,
        Customer: vm.assyData.mfrCompanyName,
        PIDCode: vm.assyData.PIDCode,
        mfgPN: vm.assyData.mfgPN,
        partID: vm.assyData.partID,
        quoteGroup: vm.assyData.quoteID,
        rohsIcon: vm.assyData.rohsIcon,
        rohsName: vm.assyData.rohsComplientConvertedValue
      };
      DialogFactory.dialogService(
        RFQTRANSACTION.ASSEMBLY_REQUOTE_HISTORY_CONTROLLER,
        RFQTRANSACTION.ASSEMBLY_REQUOTE_HISTORY_VIEW,
        ev,
        obj).then(() => {
          vm.loadData();
        }, (err) => BaseService.getErrorLog(err));
    };

    function getTermsselected() {
      vm.selectedTerm = _.filter(vm.termsDetails, (termObj) => {
        const selectedvalues = _.filter(termObj.ecoTypeValues, (termValue) => {
          const objterm = _.find(vm.selectedTerms, { termsconditionTypeValueID: termValue.ecoTypeValID });
          if (objterm) {
            termValue.id = objterm.id;
            termValue.selected = true;
            termValue.note = objterm.note;
            return true;
          }
        });
        if (selectedvalues.length > 0) {
          return true;
        }
      });
    };
    vm.RefreshTermsAndConditionValue = () => {
      getECOCategoryWithValues(true);
    };
    vm.goToPaymentTermsList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_TERMS_STATE, { category: CORE.CategoryType.Terms.Name });
    };
    vm.goToQouteTC = () => {
      BaseService.openInNew(USER.ADMIN_RFQ_CATEGORY_STATE, { categoryType: vm.categoryArray[1].id });
    };
    vm.TermsAndConditionValueList = () => {
      BaseService.openInNew(USER.ADMIN_RFQ_CATEGORY_VALUES_STATE, { categoryType: vm.categoryArray[1].id });
    };
    vm.backToSummary = () => {
      $state.go(RFQTRANSACTION.RFQ_SUMMARY2_STATE, { id: $stateParams.id });
    };
    vm.goBack = () => {
      if (vm.summaryDetailForm.$dirty) {
        showWithoutSavingAlertforBackButton();
      } else {
        vm.summaryDetailForm.$setPristine();
        BaseService.currentPageForms = [];
        $state.go(RFQTRANSACTION.RFQ_SUMMARY2_STATE, { id: $stateParams.id });
      }
    };

    // Don't allow to select multiple class from same standard it should work like radio button
    vm.AllowToSelect = (termAttributeValue, termItem) => {
      if (!termItem.multiSelect) {
        const val = termAttributeValue.selected;
        termItem.ecoTypeValues = _.each(termItem.ecoTypeValues, (item) => { item.selected = false; });
        termAttributeValue.selected = val;

        /* select/deselect class and standard if required */
        if (termAttributeValue.selected) {
          termItem.selected = true;
        }
        else {
          termItem.selected = false;
        }
      }
    };

    vm.quoteSummaryReport = (isDownload) => {
      if (isDownload && vm.isDownloadDisabled) { return false; }
      if (!isDownload && vm.isPrintDisable) { return false; }
      if (isDownload) {
        vm.isDownloadDisabled = true;
      } else {
        vm.isPrintDisable = true;
      }
      BOMFactory.downloadQuoteSummaryReport({
        RFQAssyID: $stateParams.id,
        AssyQuoteSubmittedID: $stateParams.quoteSubmittedID,
        APIProjectURL: APIProjectURLconfig,
        ShowAvailableStock: vm.isShowAvailableStock,
        CompanyCode: vm.comapnyCode,
        isCustomPartDetShowInReport: vm.assyData.isCustomPartDetShowInReport,
        format: vm.reportFormat,
        QuoteData: {
          quoteNumber: vm.revisedQuoteData.quoteNumber,
          bomLastVersion: vm.revisedQuoteData.bomLastVersion,
          mfgCode: vm.assyData.mfgCode
        }
      }).then((response) => {
        const QuoteData = response.config.data.QuoteData;
        if (isDownload) {
          vm.isDownloadDisabled = false;
        } else {
          vm.isPrintDisable = false;
        }
        BaseService.downloadReport(response, stringFormat('{0}-{1}-{2}-{3}', CORE.REPORT_SUFFIX.QUOTE, QuoteData.quoteNumber, QuoteData.bomLastVersion, QuoteData.mfgCode), isDownload, isDownload);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength, editorText) => {
      if (editorText) {
        vm.entertext = vm.htmlToPlaintext(editorText);
        return BaseService.getDescrLengthValidation(maxLength, vm.entertext.length);
      } else {
        return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
      }
    };

    // display pop-up for form dirty on click back button
    function showWithoutSavingAlertforBackButton() {
      var messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messgaeContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.summaryDetailForm.$setPristine();
          BaseService.currentPageForms = [];
          if (vm.assyData.isReadyForPricing) {
            $state.go(RFQTRANSACTION.RFQ_SUMMARY2_STATE, { id: $stateParams.id });
          } else {
            $state.go(RFQTRANSACTION.RFQ_IMPORT_BOM_STATE, { id: $stateParams.id, partId: vm.assyData.partID });
          }
        }
      }, (error) => BaseService.getErrorLog(error));
    }

    // call back to refresh details
    vm.refreshAddress = (ev, callBackData) => {
      const autocompleteCustomerPromise = [getCustomerAddress(vm.assyData.customerid)];
      vm.cgBusyLoading = $q.all(autocompleteCustomerPromise).then(() => {
        if (callBackData.addressType === CORE.AddressType.BillingAddress) {
          setOtherDetForCustAddrDir(vm.assyData.customerid);
        } else {
          setShipOtherDetForCustAddrDir(vm.assyData.customerid);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.ChangeAssyStatus = () => {
      if (vm.assyData.status == vm.rfqAssyStatus.CANCEL.VALUE || !vm.isActivityStart) { return false;}
      const obj = {
        rfqAssyID: $state.params.id,
        Customer: vm.assyData.mfrCompanyName,
        PIDCode: vm.assyData.PIDCode,
        mfgPN: vm.assyData.mfgPN,
        partID: vm.assyData.partID,
        quoteGroup: vm.assyData.quoteID,
        rohsIcon: vm.assyData.rohsIcon,
        rohsName: vm.assyData.rohsComplientConvertedValue,
        quoteProgress: vm.assyData.quoteProgress,
        status: vm.assyData.rfq_statusID,
        winPrice: vm.assyData.winPrice,
        winQuantity: vm.assyData.winQuantity,
        reason: vm.assyData.reason,
        isActivityStart: vm.assyData.isActivityStart
      };
      vm.isStartAndStopRequestFromThisPage = true;
      DialogFactory.dialogService(
        RFQTRANSACTION.ASSEMBLY_QUOTE_STATUS_CHANGE_POPUP_CONTROLLER,
        RFQTRANSACTION.ASSEMBLY_QUOTE_STATUS_CHANGE_POPUP_VIEW,
        null,
        obj).then(() => {
          $state.go(RFQTRANSACTION.QUOTE_SUMMARY_DETAIL_STATE, { id: $stateParams.id, quoteSubmittedID: $stateParams.quoteSubmittedID, pageType: $stateParams.pageType }, { reload: true });
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.goTocustomerList = () => {
      BaseService.goToCustomerList();
    };
    vm.goToCustomer = () => {
      BaseService.goToCustomer(vm.autoCompleteCustomer.keyColumnId);
    };
    vm.employeelist = () => {
      BaseService.openInNew(USER.ADMIN_EMPLOYEE_STATE, {});
    };
    vm.goToAssyTypeList = () => {
      BaseService.goToAssyTypeList();
    };
    vm.goToJobList = () => {
      BaseService.openInNew(USER.ADMIN_JOB_TYPE_STATE, {});
    };
    vm.goToRFQType = () => {
      BaseService.openInNew(USER.ADMIN_RFQ_TYPE_STATE, {});
    };
    vm.goTocomponentList = () => {
      BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE, {});
    };
    vm.goToRequirementTemplate = () => {
      BaseService.openInNew(USER.ADMIN_ADDITIONAL_REQUIREMENT_STATE, {});
    };
    vm.goToBOM = (rfqAssyID, partID) => {
      BaseService.openInNew(RFQTRANSACTION.RFQ_IMPORT_BOM_STATE, { id: rfqAssyID, partId: partID });
    };
    vm.goToComponent = (partID) => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG.toLowerCase(), partID, USER.PartMasterTabs.Detail.Name);
    };
    vm.htmlToPlaintext = (text) => {
      text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPageForms = [vm.summaryDetailForm];
    });

    function connectSocket() {
      socketConnectionService.on(PRICING.EventName.sendSubmittedQuote, sendSubmittedQuote);
      socketConnectionService.on(PRICING.EventName.revisedQuote, revisedQuote);
      socketConnectionService.on(PRICING.EventName.sendCostingStartStopActivity, startStopCostingActivityListener);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener(PRICING.EventName.sendSubmittedQuote, sendSubmittedQuote);
      socketConnectionService.removeListener(PRICING.EventName.revisedQuote, revisedQuote);
      socketConnectionService.removeListener(PRICING.EventName.sendCostingStartStopActivity, startStopCostingActivityListener);
    }

    $scope.$on('$destroy', () => {
      BaseService.currentPageForms = [];
      removeSocketListener();
    });
    vm.obsoletePartReport = () => {
      vm.cgBusyLoading = BOMFactory.downloadObsoletePartReport({
        customerID: '',
        isObsolete: false,
        whereClause: '',
        DateFormat: _dateDisplayFormat,
        DateTimeFormat: ''
      }).then((response) => {
        var model = {
          multiple: true
        };
        if (response.status === 404) {
          model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
          DialogFactory.messageAlertDialog(model);
        } else if (response.status === 403) {
          model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
          DialogFactory.messageAlertDialog(model);
        } else if (response.status === 401) {
          model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
          DialogFactory.messageAlertDialog(model);
        } else if (response.status === -1) {
          model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_SERVICEUNAVAILABLE);
          DialogFactory.messageAlertDialog(model);
        } else {
          const blob = new Blob([response.data], {
            type: 'application/pdf'
          });
          if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, 'Obsolete Part Detail.pdf');
          } else {
            const link = document.createElement('a');
            if (link.download !== undefined) {
              const url = URL.createObjectURL(blob);
              link.setAttribute('href', url);
              // if (true) {
              link.setAttribute('download', 'Obsolete Part Detail.pdf');
              // } else {
              //  link.setAttribute("target", "_blank");
              // }
              link.style = 'visibility:hidden';
              document.body.appendChild(link);
              $timeout(() => {
                link.click();
                document.body.removeChild(link);
              });
            }
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });

    function sendSubmittedQuote(data) {
      if (vm.assyData && data.assyID === vm.assyData.rfqAssyID) {
        vm.assyData.isSummaryComplete = true;
        vm.assyData.status = vm.statusGridHeaderDropdown[2].value;
      }
    }
    function revisedQuote(assyid) {
      if (vm.assyData && assyid === vm.assyData.rfqAssyID) {
        vm.assyData.isSummaryComplete = false;
        vm.assyData.status = vm.statusGridHeaderDropdown[1].value;
      }
    }
    let isopen = false;
    // Costing Start Stop Activity receiver
    function startStopCostingActivityReceive(message, isActivityStart) {
      var textMessageContent = '';
      if (!isActivityStart && !isopen) {
        isopen = true;
        textMessageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.START_STOP_COSTING_ACTIVITY_TEXT);
        textMessageContent.message = stringFormat(textMessageContent.message, message.isActivityStart ? 'started' : 'stopped', message.userName);

        const alertModel = {
          messageContent: textMessageContent
        };

        DialogFactory.messageAlertDialog(alertModel).then(() => {
          isopen = false;
          getAssyDetails();
        });
      }
    }

    // [S] Socket Listeners for Costing activity
    function startStopCostingActivityListener(data) {
      if (vm.assyData && data.rfqAssyID === vm.assyData.rfqAssyID && !vm.isStartAndStopRequestFromThisPage) {
        vm.isStartAndStopRequestFromThisPage = false;
        startStopCostingActivityReceive(data, false);
      } else {
        getAssyDetails();
      }
    };


    /* Start Timer after checkin start */
    vm.startCostingTimer = () => {
      vm.currentTimerDiff = '';
      vm.tickCostingActivity = setInterval(() => {
        vm.ActivityStartAt = vm.ActivityStartAt + 1;
        vm.currentTimerDiff = secondsToTime(vm.ActivityStartAt, true);
      }, _configSecondTimeout);
    };

    /* Start Costing Activity */
    vm.startCostingActivity = (isActivityStart) => {
      if (vm.isBOMChanged) {
        const obj = {
          title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
          textContent: stringFormat(CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_BODY_MESSAGE_BOM_Activity, isActivityStart ? 'start' : 'stop'),
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        return DialogFactory.confirmDiolog(obj).then(() => {
          vm.CheckSuperAdminPosibility(isActivityStart);
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.CheckSuperAdminPosibility(isActivityStart);
      }
    };

    vm.CheckSuperAdminPosibility = (isActivityStart) => {
      if (!isActivityStart && vm.loginUserId !== vm.activityStartBy && vm.loginUser.isUserSuperAdmin) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.COSTING_STOP_BY_SA_FROM_RFQ_LIST_MESSAGE);
        let message = '<br/><br/><table style=\'width:100%\'><thead><tr><th class=\'border-bottom padding-5\'>#</th><th class=\'border-bottom padding-5\'>' + vm.LabelConstant.Assembly.PIDCode + '</th><th class=\'border-bottom padding-5\'>Activity Started By</th></tr></thead><tbody>{0}</tbody></table>';
        const subMessage = '<tr><td class="border-bottom padding-5">1 </td><td class="border-bottom padding-5">' + vm.assyData.PIDCode + '</td><td class="border-bottom padding-5">' + vm.CostingActivityStartedByUserName + '</td></tr>';
        message = stringFormat(message, subMessage);
        messageContent.message = stringFormat(messageContent.message, vm.CostingActivityStartedByUserName, message);

        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.startStopUpdate(isActivityStart);
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.startStopUpdate(isActivityStart);
      }
    };
    // Open add/edit contact persopn popup
    vm.addEditShipContactPerson = (ev, callBackContactPerson) => {
      if (callBackContactPerson) {
        setShipContPersonDetAfterApply(callBackContactPerson);
      }
    };
    // open select contact person  list
    vm.selectContactPerson = (ev, callBackContactPerson) => {
      if (callBackContactPerson) {
        setContPersonDetAfterApply(callBackContactPerson);
      }
    };
    // open select contact person  list
    vm.selectShipContactPerson = (ev, callBackContactPerson) => {
      if (callBackContactPerson) {
        setShipContPersonDetAfterApply(callBackContactPerson);
      }
    };
    // set contact person details in current scope modal
    const setContPersonDetAfterApply = (callBackContactPerson) => {
      if (callBackContactPerson) {
        vm.selectedContactPerson = callBackContactPerson;
        vm.viewCustAddrOtherDet.alreadySelectedPersonId = vm.selectedContactPerson.personId;
        vm.assyData.custBillingContactPersonID = vm.selectedContactPerson.personId;
        vm.assyData.custBillingContactPerson = BaseService.generateContactPersonDetFormat(callBackContactPerson);
        vm.contPersonViewActionBtnDet.Update.isDisable = (!vm.isDisable && vm.selectedContactPerson) ? false : true;
        vm.contPersonViewActionBtnDet.ApplyNew.isDisable = (!vm.isDisable) ? false : true;
        // Static code to enable save button
        vm.summaryDetailForm.$$controls[0].$setDirty();
      }
    };
    // set contact person details in current scope modal
    const setShipContPersonDetAfterApply = (callBackContactPerson) => {
      if (callBackContactPerson) {
        vm.selectedShipContactPerson = callBackContactPerson;
        vm.viewShipCustAddrOtherDet.alreadySelectedPersonId = vm.selectedShipContactPerson.personId;
        vm.assyData.custShippingContactPersonID = vm.selectedShipContactPerson.personId;
        vm.assyData.custShippingContactPerson = BaseService.generateContactPersonDetFormat(callBackContactPerson);
        vm.contShipPersonViewActionBtnDet.Update.isDisable = (!vm.isDisable && vm.selectedShipContactPerson) ? false : true;
        vm.contShipPersonViewActionBtnDet.ApplyNew.isDisable = (!vm.isDisable) ? false : true;
        // Static code to enable save button
        vm.summaryDetailForm.$$controls[0].$setDirty();
      }
    };
    vm.startStopUpdate = (isActivityStart) => {
      const data = {
        refTransID: parseInt($state.params.id),
        isActivityStart: isActivityStart,
        transactionType: vm.transactionType[1].id,
        actionType: vm.actionType[0].id
      };
      vm.isStartAndStopRequestFromThisPage = true;
      vm.cgBusyLoading = BOMFactory.startStopCostingActivity().save(data).$promise.then(() => {
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    };
  }
})();
