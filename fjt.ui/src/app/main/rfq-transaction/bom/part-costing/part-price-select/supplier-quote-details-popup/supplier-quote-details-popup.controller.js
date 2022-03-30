(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('SupplierQuoteDetailsPopupController', SupplierQuoteDetailsPopupController);

  /** @ngInject */
  function SupplierQuoteDetailsPopupController($mdDialog, $q, CORE, RFQTRANSACTION, TRANSACTION, data, PartCostingFactory, BaseService, ManageMFGCodePopupFactory, SalesOrderFactory, USER, DialogFactory) {
    const vm = this;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.SUPPLIER_QUOTES;
    vm.isNoDataFound = true;
    vm.pnDetailList = data.pnDetailList;
    vm.existingSupplierQuoteId = data.existingSupplierQuoteId;
    vm.parentData = data.parentScope;
    vm.parentLineData = data.selectedLine;
    vm.iscustomComponent = vm.parentData.isCustom;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.CustomReeling = RFQTRANSACTION.SUPPLIER_QUOTE_CUSTOM_STATUS;
    vm.Rohs = RFQTRANSACTION.CUSTOM_STATUS;
    vm.Ncnr = RFQTRANSACTION.SUPPLIER_QUOTE_NCNR_STATUS;
    const alternatePart = data.mfgPN;
    active();
    vm.refreshSupplierQuotes = () => {
      active();
    };

    //page load event
    function active() {
      if (vm.pnDetailList && vm.pnDetailList.length > 0) {
        const partIDS = _.map(vm.pnDetailList, 'mfgPNID');
        vm.cgBusyLoading = PartCostingFactory.getSupplierQuotes().query({ partID: partIDS }).$promise.then((quote) => {
          if (quote.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.supplierQuoteList = quote.data.quote;
            if (vm.existingSupplierQuoteId && vm.existingSupplierQuoteId.length > 0) {
              vm.supplierQuoteList = _.filter(vm.supplierQuoteList, (item) => {
                if (!vm.existingSupplierQuoteId.includes(item.supplierQuoteID)) {
                  return item;
                }
              });
            }
            vm.supplierQuoteDetList = quote.data.quoteDet;
            if (vm.supplierQuoteList && vm.supplierQuoteList.length > 0) {
              vm.isNoDataFound = false;
              vm.selectAll = true;
              vm.changeSelectAll();
              bindHeaderData();
            }
            else {
              vm.isNoDataFound = true;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.updateSelectedAllQuote = () => {
      const selectedRecordList = _.filter(vm.supplierQuoteList, { selected: true });
      if (vm.supplierQuoteList.length === selectedRecordList.length) {
        vm.selectAll = true;
      }
      else {
        vm.selectAll = false;
      }
    };

    vm.changeSelectAll = () => {
      _.each(vm.supplierQuoteList, (item) => {
        item.selected = vm.selectAll;
      });
    };
    vm.cancel = () => {
      $mdDialog.cancel();
    };

    //go to part master
    vm.goToPartMaster = (item) => {
      BaseService.goToComponentDetailTab(null, item.mfgPNID);
    };
    //go to part master list
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    //go to Supplier Quote page
    vm.gotoSupplierQuote = () => {
      const obj = {
        mfgPN: alternatePart
      };
      DialogFactory.dialogService(
        TRANSACTION.ADD_SUPPLIER_QUOTE_MODAL_CONTROLLER,
        TRANSACTION.ADD_SUPPLIER_QUOTE_MODAL_VIEW,
        null,
        obj).then((resData) => {
          BaseService.goToSupplierQuoteWithPartDetail(resData.id, resData.component);
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    //get price break
    function callbackFunction() {
      var pricingObj = {
        componentID: [vm.parentLineData.PartNumberId],
        UpdatedTimeStamp: vm.parentLineData.UpdatedTimeStamp,
        Packaging: vm.parentLineData.Packaging,
        Type: vm.parentLineData.SourceOfPrice,
        qtySupplierID: vm.parentLineData._id,
        supplierID: vm.parentLineData.SupplierID
      };
      vm.cgBusyLoading = PartCostingFactory.retrievePriceBreak().query({ pricingObj: pricingObj }).$promise.then((qtyBreak) => {
        if (qtyBreak && qtyBreak.data) {
          const qtyBreakList = _.sortBy(qtyBreak.data.qtyBreak, (o) => o.qty);
          _.each(qtyBreakList, (item) => {
            item.ext = (parseInt(item.qty) * parseFloat(item.price)).toFixed(_amountFilterDecimal);
            item.price = (parseFloat(item.price)).toFixed(_unitPriceFilterDecimal);
            item.isDisable = false;
          });
          vm.qtyBreakList = qtyBreakList;
          vm.addnewRecord();
          checkValidationMessage();
          //if (vm.qtyBreakList.length == 1)
          //    vm.qtyBreakList[0].isDisable = false;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //get alternate part number list
    function getLineItemParts() {
      return PartCostingFactory.getAlternatePartList().query({ consolidateID: vm.parentData.id, pisPurchaseApi: false }).$promise.then((lineitems) => {
        var mfgList = [];
        vm.pnDetailList = [];
        vm.AlternateParts = angular.copy(lineitems.data.alternateParts);
        // if part is non rohs and not approved then no need to do manual price
        lineitems.data.alternateParts = _.filter(lineitems.data.alternateParts, (alternate) => ((alternate.RoHSStatusID === RFQTRANSACTION.NON_RoHS && alternate.customerApproval === 'A') || alternate.RoHSStatusID !== RFQTRANSACTION.NON_RoHS));
        // if part have any tbd then no price
        lineitems.data.alternateParts = _.filter(lineitems.data.alternateParts, (alternate) => (alternate.RoHSStatusID !== RFQTRANSACTION.TBD && alternate.partStatus !== RFQTRANSACTION.TBD && alternate.functionalCategoryID !== RFQTRANSACTION.TBD && alternate.mountingtypeID !== RFQTRANSACTION.TBD));
        _.each(lineitems.data.alternateParts, (mfg) => {
          if (!_.find(mfgList, (item) => item.id === mfg.mfgCodeID)) {
            const obj = {
              mfgName: mfg.mfgName,
              mfgCode: mfg.mfgCode,
              name: stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, mfg.mfgCode, mfg.mfgName),
              id: mfg.mfgCodeID
            };
            mfgList.push(obj);
          }
          //check if part is restricted then no need to add manual price for same.
          if (!_.find(vm.parentData.restrictedParts, (restrict) => restrict.mfgPNID === mfg.mfgPNID)) {//&& restrict.consolidateID == vm.parentData.id
            if (!_.find(vm.pnDetailList, (pn) => pn.mfgCodeID === mfg.mfgCodeID && pn.mfgPNID === mfg.mfgPNID)) {
              vm.pnDetailList.push(mfg);
            }
          }
        });
        vm.mfgCodeList = mfgList;
        vm.partNumberList = [];
        return lineitems.data.alternateParts;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    const getUnitList = () => SalesOrderFactory.getUnitList().query().$promise.then((unitlist) => {
      vm.UnitList = unitlist.data;
      return unitlist.data;
    }).catch((error) => BaseService.getErrorLog(error));


    const getpackaging = () => PartCostingFactory.getPackaging().query().$promise.then((packaging) => {
      if (packaging && packaging.data) {
        vm.packagingAll = packaging.data;
        return packaging.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    function getMfgSearch() {
      return ManageMFGCodePopupFactory.getMfgcodeList().query({ type: CORE.MFG_TYPE.DIST }).$promise.then((mfgcodes) => {
        vm.mfgCodeDetail = mfgcodes.data;
        return mfgcodes.data;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function getnonQuoteQtyItems() {
      return PartCostingFactory.getnonQuotedQty().query({ rfqAssyID: vm.parentData.rfqAssyID, isPurchaseApi: false }).$promise.then((list) => {
        if (list && list.data) {
          vm.pricingsetting = list.data;
          return list.data;
        }
        return list.data;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    const autocompletePromise = [getMfgSearch(), getLineItemParts(), getpackaging(), getUnitList(), getnonQuoteQtyItems()];
    if (vm.parentLineData && vm.parentLineData._id) {
      autocompletePromise.push(getPriceDetail());
      autocompletePromise.push(callbackFunction());
    }

    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
    });

    //save manual price create time
    vm.savePrice = () => {
      vm.qtyBreakList = _.filter(vm.qtyBreakList, (breakPrice) => breakPrice.qty && breakPrice.price);
      const bomUom = _.find(vm.UnitList, (uom) => uom.id === vm.parentData.uomID);
      const selectedQuoteDet = _.filter(vm.supplierQuoteList, { selected: true });
      const objSupplierPrice = [];
      if (vm.pnDetailList.length > 0 && vm.AlternateParts.length > 0) {
        _.each(selectedQuoteDet, (supplierQuote) => {
          const supplierQuoteDet = _.filter(vm.supplierQuoteDetList, { id: supplierQuote.supplierQuoteID });
          if (supplierQuoteDet && supplierQuoteDet.length > 0) {
            _.each(supplierQuoteDet, (SuppQuoteDet) => {
              if (SuppQuoteDet.supplier_quote_parts_det && SuppQuoteDet.supplier_quote_parts_det.length > 0) {
                const SupplierQuotePartDetail = _.filter(SuppQuoteDet.supplier_quote_parts_det, { partID: supplierQuote.partID });
                _.each(SupplierQuotePartDetail, (quotePartDet) => {
                  const selectedCompDet = _.find(vm.pnDetailList, { mfgPNID: quotePartDet.partID });
                  if (selectedCompDet && quotePartDet && quotePartDet.supplier_quote_part_price_det && quotePartDet.supplier_quote_part_price_det.length > 0) {
                    const firstPriceDetail = _.head(quotePartDet.supplier_quote_part_price_det);
                    if (firstPriceDetail) {
                      const pkg = _.find(vm.packagingAll, (packg) => packg.id === firstPriceDetail.packageID);
                      if (quotePartDet.component && quotePartDet.component.noOfPosition && quotePartDet.component.connecterTypeID === RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) {
                        vm.parentData.uomID = RFQTRANSACTION.DEFAULT_ID.PINUOM; //pin uom default
                      }
                      const compUom = _.find(vm.UnitList, (uom) => uom.id === quotePartDet.component.uom);
                      let stock = firstPriceDetail.stock;
                      if (bomUom && compUom) {
                        stock = stock * (quotePartDet.component.packageQty ? quotePartDet.component.packageQty : 1);
                        const fromBasedUnitValues = (compUom.baseUnitConvertValue);
                        const toBasedUnitValues = bomUom.baseUnitConvertValue;
                        const ConvertFromValueIntoBasedValue = (stock / fromBasedUnitValues);
                        stock = ConvertFromValueIntoBasedValue * toBasedUnitValues;
                      }
                      if (quotePartDet.component.noOfPosition && quotePartDet.component.connecterTypeID === RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) {
                        stock = stock * (quotePartDet.component.noOfPosition);
                      }
                      let firstLeadTime = firstPriceDetail.leadTime ? parseFloat(firstPriceDetail.leadTime) : 0;
                      if (firstPriceDetail.UnitOfTime === 'B' && firstLeadTime > 0) {
                        firstLeadTime = (firstLeadTime / 5);
                      } else if (firstPriceDetail.UnitOfTime === 'D' && firstLeadTime > 0) {
                        firstLeadTime = (firstLeadTime / 7);
                      }
                      const pricingObject = {
                        ConsolidateID: vm.parentData.id,
                        refSupplierQuoteID: supplierQuote.supplierQuoteID,
                        refSupplierQuoteNumber: supplierQuote.quoteNumber,
                        refSupplierQuoteDate: supplierQuote.quoteDate,
                        refSupplierQuoteDateValue: supplierQuote.quoteDateValue,
                        additionalAttributeDetails: null,
                        MinimumBuy: firstPriceDetail.min,
                        Active: true,
                        PartNumberId: quotePartDet.component.id,
                        ProductUrl: null,
                        SupplierPN: null,
                        Packaging: pkg ? pkg.name : null,
                        SourceOfPrice: RFQTRANSACTION.PART_COSTING.Manual,
                        Authorized_Reseller: true,
                        ManufacturerPartNumber: quotePartDet.component.mfgPN,
                        APILeadTime: firstLeadTime.toFixed(2),
                        Multiplier: firstPriceDetail.mult,
                        ManufacturerName: quotePartDet.component.mfgCodemst.mfgName,
                        SupplierName: SuppQuoteDet.mfgCodemst ? SuppQuoteDet.mfgCodemst.mfgName : null,
                        PurchaseUom: compUom ? compUom.abbreviation : null,
                        OrgInStock: firstPriceDetail.stock,
                        NCNR: _.find(vm.Ncnr, { ID: firstPriceDetail.NCNR }).VALUE,
                        RoHS: quotePartDet.component.rfq_rohsmst.name,
                        rohsIcon: quotePartDet.component.rfq_rohsmst.rohsIcon,
                        MountingTypeID: quotePartDet.component.mountingtypeID,
                        FunctionalTypeID: quotePartDet.component.functionalCategoryID,
                        MountingType: quotePartDet.component.rfqMountingType.name,
                        FunctionalType: quotePartDet.component.rfqPartType.partTypeName,
                        Reeling: _.find(vm.CustomReeling, { ID: firstPriceDetail.reeling }).VALUE,
                        CurrencyName: RFQTRANSACTION.PART_COSTING.USD,
                        PartStatus: quotePartDet.component.gencCategoryName,
                        LTBDate: null,
                        IsDeleted: false,
                        PIDCode: quotePartDet.component.PIDCode,
                        PriceType: 'Standard',
                        rfqAssyID: vm.parentData.rfqAssyID,
                        ApiNoOfPosition: quotePartDet.component.noOfPosition,
                        NoOfPosition: quotePartDet.component.numOfPosition,
                        noOfRows: quotePartDet.component.noOfRows,
                        partPackage: selectedCompDet.partPackage,
                        isPackaging: selectedCompDet.isPackaging ? true : false,
                        mfgPNDescription: quotePartDet.component.mfgPNDescription,
                        mfgCodeID: quotePartDet.component.mfgcodeID,
                        packageID: firstPriceDetail.packageID,
                        SupplierID: SuppQuoteDet.supplierID,
                        OtherStock: stock,
                        PartAbbrivation: compUom ? compUom.abbreviation : null,
                        BOMAbbrivation: bomUom ? bomUom.abbreviation : null,
                        packageQty: selectedCompDet.unit,
                        PackageSPQQty: selectedCompDet.packageQty,
                        bomUnitID: vm.parentData.uomID,
                        componentUnitID: quotePartDet.component.uom,
                        qpa: vm.parentData.qpa ? vm.parentData.qpa : 0,
                        connectorTypeID: quotePartDet.component.connecterTypeID,
                        AuthorizeSupplier: SuppQuoteDet.mfgCodemst ? SuppQuoteDet.mfgCodemst.authorizeType : null,
                        isPurchaseApi: false,
                        AdditionalValueFee: 0,
                        isCustom: quotePartDet.isCustom,
                        custAssyPN: quotePartDet.custAssyPN
                      };
                      const priceBreakList = [];
                      const assyPrice = [];
                      _.each(quotePartDet.supplier_quote_part_price_det, (priceBreaks) => {
                        if (priceBreaks.qty && priceBreaks.UnitPrice) {
                          let leadTime = priceBreaks.leadTime ? parseFloat(priceBreaks.leadTime) : 0;
                          if (priceBreaks.UnitOfTime === 'B' && leadTime > 0) {
                            leadTime = (leadTime / 5);
                          } else if (priceBreaks.UnitOfTime === 'D' && leadTime > 0) {
                            leadTime = (leadTime / 7);
                          }
                          const breakprice = {
                            componentID: quotePartDet.component.id,
                            mfgPN: selectedCompDet.mfgPN,
                            supplier: SuppQuoteDet.mfgCodemst ? SuppQuoteDet.mfgCodemst.mfgName : null,
                            price: parseFloat(priceBreaks.UnitPrice),
                            qty: parseInt(priceBreaks.qty),
                            Packaging: pkg ? pkg.name : null,
                            leadTime: leadTime.toFixed(2),
                            isCustomPrice: false,
                            Type: RFQTRANSACTION.PART_COSTING.Manual,
                            packagingID: pkg ? pkg.id : null,
                            supplierPN: quotePartDet.supplierComponent ? quotePartDet.supplierComponent.mfgPN : null,
                            supplierID: SuppQuoteDet.supplierID
                          };
                          priceBreakList.push(breakprice);
                        }
                      });

                      let supplierQuotePartPriceID;
                      _.each(vm.parentData.quantityTotals, (assyQty) => {
                        let unitPrice;
                        let price;
                        let leadTime;
                        let requestQty = assyQty.requestQty * (vm.parentData.qpa ? vm.parentData.qpa : 0);
                        if (bomUom && compUom) { // changed code for each
                          const fromBasedUnitValues = (bomUom.baseUnitConvertValue) * (selectedCompDet.unit ? selectedCompDet.unit : 1);
                          const toBasedUnitValues = compUom.baseUnitConvertValue;
                          const ConvertFromValueIntoBasedValue = (requestQty / fromBasedUnitValues);
                          requestQty = parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues)) === 0 ? 1 : parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues));
                        }
                        if (quotePartDet.component.numOfPosition && quotePartDet.component.connecterTypeID === RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) {
                          vm.parentData.numOfPosition = vm.parentData.numOfPosition ? vm.parentData.numOfPosition : 1;
                          requestQty = requestQty * (vm.parentData.numOfPosition);
                          const noOfPositionDiff = parseFloat((quotePartDet.component.noOfPosition) - ((quotePartDet.component.noOfPosition) % (vm.parentData.numOfPosition)));
                          if (noOfPositionDiff === 0) {
                            return;
                          }
                          requestQty = requestQty / noOfPositionDiff;
                        }
                        let ordQty = Math.max((Math.ceil((requestQty) / firstPriceDetail.mult) * firstPriceDetail.mult), firstPriceDetail.min);
                        const ActualQty = ordQty;
                        let ActualPrice = 0;
                        let priceBreakDetail;
                        if (vm.iscustomComponent) {
                          const settingType = RFQTRANSACTION.PRICE_SELECTEION_SETTING_TYPE.CUSTOM_PART_SELECTION.value;
                          const setting = _.find(vm.pricingsetting.priceSetting, (set) => set.requestQty === assyQty.requestQty && set.settingType === settingType);
                          if (setting && setting.isLeadTime) {
                            const consolidateList = _.filter(quotePartDet.supplier_quote_part_price_det, (consolidate) => {
                              if (consolidate.qty === ordQty) {
                                let leadTime = consolidate.leadTime ? parseFloat(consolidate.leadTime) : 0;
                                if (consolidate.UnitOfTime === 'B' && leadTime > 0) {
                                  leadTime = (leadTime / 5);
                                } else if (consolidate.UnitOfTime === 'D' && leadTime > 0) {
                                  leadTime = (leadTime / 7);
                                }
                                if (leadTime <= (setting.leadTime ? setting.leadTime : 1)) {
                                  return consolidate;
                                }
                                //return consolidate.qty == ordQty && leadTime <= (setting.leadTime ? setting.leadTime : 1)
                              }
                            });
                            if (consolidateList.length === 0) {
                              let pricelst = _.orderBy(_.filter(quotePartDet.supplier_quote_part_price_det, (consolidate) => {
                                if (consolidate.qty === ordQty) {
                                  let leadTime = consolidate.leadTime ? parseFloat(consolidate.leadTime) : 0;
                                  if (consolidate.UnitOfTime === 'B' && leadTime > 0) {
                                    leadTime = (leadTime / 5);
                                  } else if (consolidate.UnitOfTime === 'D' && leadTime > 0) {
                                    leadTime = (leadTime / 7);
                                  }
                                  if (leadTime <= (setting.leadTime ? setting.leadTime : 1)) {
                                    return consolidate;
                                  }
                                  //return consolidate.qty == ordQty && leadTime <= (setting.leadTime ? setting.leadTime : 1)
                                }
                              }), ['qty', 'price'], ['ASC', 'ASC']);
                              if (pricelst.length > 0) {
                                priceBreakDetail = pricelst[pricelst.length - 1];
                              }
                              else {
                                pricelst = _.orderBy(_.filter(quotePartDet.supplier_quote_part_price_det, (consolidate) => consolidate.qty < ordQty), ['qty', 'UnitPrice'], ['ASC', 'ASC']);
                                if (pricelst.length > 0) {
                                  priceBreakDetail = pricelst[pricelst.length - 1];
                                } else {
                                  priceBreakDetail = _.orderBy(quotePartDet.supplier_quote_part_price_det, ['qty', 'UnitPrice'], ['ASC', 'ASC'])[0];
                                }
                              }
                            } else {
                              priceBreakDetail = _.minBy(consolidateList, 'price');
                            }
                          }
                          else {
                            const consolidateList = _.filter(quotePartDet.supplier_quote_part_price_det, (consolidate) => consolidate.qty === ordQty);
                            if (consolidateList.length === 0) {
                              const pricelst = _.orderBy(_.filter(quotePartDet.supplier_quote_part_price_det, (consolidate) => consolidate.qty < ordQty), ['qty', 'UnitPrice'], ['ASC', 'ASC']);
                              if (pricelst.length > 0) {
                                priceBreakDetail = pricelst[pricelst.length - 1];
                              } else {
                                priceBreakDetail = _.orderBy(quotePartDet.supplier_quote_part_price_det, ['qty', 'UnitPrice'], ['ASC', 'ASC'])[0];
                              }
                            } else {
                              priceBreakDetail = _.minBy(consolidateList, 'UnitPrice');
                            }
                          }
                        } else {
                          priceBreakDetail = _.find(quotePartDet.supplier_quote_part_price_det, (qtyBreak) => qtyBreak.qty === ordQty);
                        }
                        if (priceBreakDetail) {
                          let leadTimeDet = priceBreakDetail.leadTime ? parseFloat(priceBreakDetail.leadTime) : 0;
                          if (priceBreakDetail.UnitOfTime === 'B' && leadTimeDet > 0) {
                            leadTimeDet = (leadTimeDet / 5);
                          } else if (priceBreakDetail.UnitOfTime === 'D' && leadTimeDet > 0) {
                            leadTimeDet = (leadTimeDet / 7);
                          }
                          unitPrice = parseFloat(priceBreakDetail.UnitPrice);
                          supplierQuotePartPriceID = parseInt(priceBreakDetail.id);
                          price = parseFloat((priceBreakDetail.UnitPrice * ordQty).toFixed(_unitPriceFilterDecimal));
                          leadTime = leadTimeDet;
                        } else {
                          let priceList = _.sortBy(_.filter(quotePartDet.supplier_quote_part_price_det, (qtyBreak) => qtyBreak.qty < ordQty), (o) => o.qty);
                          if (priceList.length === 0) {
                            priceList = _.sortBy(quotePartDet.supplier_quote_part_price_det, (qtyBreak) => qtyBreak.qty);
                          }
                          unitPrice = parseFloat(priceList[priceList.length - 1].UnitPrice);
                          supplierQuotePartPriceID = parseInt(priceList[priceList.length - 1].id);
                          price = parseFloat((priceList[priceList.length - 1].UnitPrice * ordQty).toFixed(_unitPriceFilterDecimal));
                          let leadTimeDet = priceList[priceList.length - 1].leadTime ? parseFloat(priceList[priceList.length - 1].leadTime) : 0;
                          if (priceList[priceList.length - 1].UnitOfTime === 'B' && leadTimeDet > 0) {
                            leadTimeDet = (leadTimeDet / 5);
                          } else if (priceList[priceList.length - 1].UnitOfTime === 'D' && leadTimeDet > 0) {
                            leadTimeDet = (leadTimeDet / 7);
                          }
                          leadTime = leadTimeDet;
                        }
                        ActualPrice = unitPrice;
                        if (compUom && compUom) {
                          unitPrice = (unitPrice * (compUom.baseUnitConvertValue ? compUom.baseUnitConvertValue : 1)) / ((selectedCompDet.unit ? selectedCompDet.unit : 1) * (bomUom.baseUnitConvertValue ? bomUom.baseUnitConvertValue : 1));
                          const toBasedUnitValues = (bomUom.baseUnitConvertValue) * (selectedCompDet.unit ? selectedCompDet.unit : 1);
                          const fromBasedUnitValues = compUom.baseUnitConvertValue;
                          const ConvertFromValueIntoBasedValue = (ordQty / fromBasedUnitValues);
                          ordQty = parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues)) === 0 ? 1 : parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues));
                          //require quantity for price
                          // ConvertFromValueIntoBasedValue = (requestQty / fromBasedUnitValues);
                          requestQty = parseInt(assyQty.requestQty * (vm.parentData.qpa ? vm.parentData.qpa : 0));
                        }
                        if (quotePartDet.component.noOfPosition && quotePartDet.component.connecterTypeID === RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) {
                          ordQty = ordQty * (quotePartDet.component.noOfPosition);
                          unitPrice = unitPrice / (quotePartDet.component.noOfPosition);
                          requestQty = requestQty * (vm.parentData.numOfPosition);
                        }
                        if (pricingObject.AdditionalValueFee) {
                          //Add value for additional value
                          const additionalValue = parseFloat(pricingObject.AdditionalValueFee) / parseInt(ordQty);
                          unitPrice = unitPrice + additionalValue;
                          ActualPrice = ActualPrice + additionalValue;
                        }
                        const assyQtyObj = {
                          RfqAssyQtyId: assyQty.qtyID,
                          isDeleted: false,
                          ConsolidateID: vm.parentData.id,
                          CurrentQty: assyQty.requestQty,
                          OrderQty: parseInt(ordQty),
                          leadTime: leadTime.toFixed(2),
                          PricePerPart: unitPrice,
                          TotalDollar: parseFloat((parseFloat(unitPrice) * parseFloat(ordQty)).toFixed(6)),
                          RequireQty: requestQty,
                          ActualPrice: ActualPrice,
                          ActualQty: ActualQty
                        };
                        assyPrice.push(assyQtyObj);
                      });
                      pricingObject.refSupplierQuotePartPriceID = supplierQuotePartPriceID;
                      const manualPriceObj = {
                        pricingObject: pricingObject,
                        priceBreakList: priceBreakList,
                        assyPrice: assyPrice
                      };
                      objSupplierPrice.push(manualPriceObj);
                    }
                  }
                });
              }
            });
          }
        });
      } else {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.PRICE_CANT_SELECT_DUE_TO_TBD);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      }
      if (objSupplierPrice && objSupplierPrice.length > 0) {
        vm.cgBusyLoading = PartCostingFactory.saveSupplierQuotePrice().query({ supplierQuoteObj: objSupplierPrice }).$promise.then((manualprice) => {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.cancel(manualprice);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    function bindHeaderData() {
      vm.headerdata = [];
      _.each(vm.pnDetailList, (part, index) => {
        vm.headerdata.push({
          label: vm.LabelConstant.MFG.PID,
          value: part.PIDCode,
          displayOrder: (index + 1),
          labelLinkFn: vm.goToPartList,
          valueLinkFn: vm.goToPartMaster,
          valueLinkFnParams: part,
          isCopy: true,
          isCopyAheadLabel: true,
          isAssy: true,
          imgParms: {
            imgPath: (vm.rohsImagePath + part.rohsIcon),
            imgDetail: part.name
          },
          isCopyAheadOtherThanValue: true,
          copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
          copyAheadValue: part.mfgName
        });
      });
    }

    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.manualpriceform);
    });
  }
})();
