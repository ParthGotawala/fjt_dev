(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('laborSummary', laborSummary);

  /** @ngInject */
  function laborSummary() {
    var directive = {
      restrict: 'E',
      scope: {
        id: '=',
        partId: '=',
        pidCode: '=',
        isCurrentComponent: '='
      },
      templateUrl: 'app/directives/custom/labor/labor-summary.html',
      controller: laborSummaryCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function laborSummaryCtrl($scope, $state, $timeout, $q, $filter, CORE, USER, RFQTRANSACTION, DialogFactory, BaseService, LaborFactory, BOMFactory, NotificationFactory, RFQSettingFactory, socketConnectionService, PRICING) {
      var vm = this;
      var _rfqAssyID = $scope.id;
      var _partID = parseInt($scope.partId);
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.LabelConstant = CORE.LabelConstant;
      vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.LABOR;
      //var assyObj = _.find($scope.assyQtyList, (assyQty) => { return assyQty.subAssyID == _partID });
      vm.pidCode = $scope.pidCode;
      vm.isCurrentComponent = $scope.isCurrentComponent;
      vm.RFQTRANSACTION = RFQTRANSACTION;
      vm.UIAlternateColor = RFQTRANSACTION.LABOR.UI_ALTERNATE_COLOR;
      vm.timeType = RFQTRANSACTION.RFQ_TURN_TYPE;
      vm.enableDraftSave = true;
      vm.enableSubmitSave = true;
      vm.priceMatrixPriceTypes = _.values(CORE.PRICE_MATRIX_TYPES);
      vm.laborAttribute = RFQTRANSACTION.LABOR_ATTRIBUTE;
      vm.loginUser = BaseService.loginUser;
      vm.loginUserId = vm.loginUser.userid;

      if (vm.isCurrentComponent) {
        $scope.splitPaneProperties = {
          firstComponentSize: 450,
          lastComponentSize: 300
        };
      }
      else {
        $scope.splitPaneProperties = {
          firstComponentSize: 800,
          lastComponentSize: 0
        };
      }
      //get labor mounting type detail
      function getLaborMountingDetail() {
        return LaborFactory.getLaborMountingTypeDetails().query({ pPartID: _partID, prfqAssyID: _rfqAssyID }).$promise.then((response) => response.data).catch((error) => BaseService.getErrorLog(error));
      }

      //save internal version for labor
      function saveInternalVersion(isSubmit) {
        var objSubmit = {
          pAssyId: _rfqAssyID,
          isPricing: false,
          issubmit: isSubmit
        };
        BOMFactory.saveInternalVersionAssy().query(objSubmit).$promise.then(() => {
          if (isSubmit) {
            $state.go(RFQTRANSACTION.RFQ_SUMMARY2_STATE, { id: _rfqAssyID }, { reload: true });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      getRFQAssyDetailsByID();
      //labor detail disable
      function getRFQAssyDetailsByID(isSave) {
        BOMFactory.getAssyDetails().query({ id: _rfqAssyID }).$promise.then((response) => {
          if (response && response.data) {
            vm.pidCode = response.data.componentAssembly.PIDCode;
            vm.isSummaryComplete = response.data.isSummaryComplete;
            if (vm.isSummaryComplete && vm.isSaveClick) {
              if (BOMFactory.isBOMChanged) {
                const obj = {
                  title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                  textContent: stringFormat(RFQTRANSACTION.QUOTE.QUOTE_ALREADY_SUBMIT, vm.pidCode, 'labor cost'),
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK
                };
                return DialogFactory.alertDialog(obj).then(() => {
                  BOMFactory.isBOMChanged = false;
                  BaseService.currentPageFlagForm = [];
                  commonPromise();
                }, () => {
                  BaseService.currentPageFlagForm = [];
                  BOMFactory.isBOMChanged = false;
                }).catch((error) => BaseService.getErrorLog(error));
              }
              else {
                BaseService.currentPageFlagForm = [];
                commonPromise();
              }
              vm.isSaveClick = false;
            }
            else if (!vm.isSummaryComplete && vm.isSaveClick) {
              vm.isSaveClick = false;
              saveLaborCost(isSave);
            }
            if (response.data.jobType) {
              vm.isLaborAllow = response.data.jobType.isLaborCosting;
            }
            vm.isActivityStart = response.data.isActivityStart ||  false;
            vm.activityStartBy = response.data.activityStartBy ||  1;
            if (response.user) {
              vm.CostingActivityStartedByUserName = response.data.user.firstName + ' ' + response.data.user.lastName;
            }
            vm.activityStartAt = response.data.activityStartAt;
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
          return null;
        });
      };
      // get all assy qty detail
      function getAssyQPADetail() {
        return LaborFactory.getLaborAssyQty().query({ pPartID: _partID, prfqAssyID: _rfqAssyID }).$promise.then((response) => {
          if (response.data) {
            vm.requestQtyList = response.data.requestQtyList;
            vm.assyList = _.filter(response.data.assyList, (assyId) => assyId.subAssyID !== _partID);
            _.each(response.data.turnTimeQtyList, (summary) => {
              var total = 0;
              if (summary.unitOfTime === vm.timeType.WEEK_DAY.VALUE) {
                total = summary.turnTime / 7;
              }
              else if (summary.unitOfTime === vm.timeType.BUSINESS_DAY.TYPE) {
                total = summary.turnTime / 5;
              }
              else {
                total = summary.turnTime;
              }
              summary.totalDays = total;
            });
            vm.turnTimeQtyList = response.data.turnTimeQtyList;
            vm.qtyWiseCost = response.data.qtyWiseCost;
            return response.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      //getLaborMountingDetail();
      function commonPromise() {
        var autocompletePromise = [getLaborMountingDetail(), getAssyQPADetail()];
        vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
          vm.laborList = responses[0];
          vm.laborList = _.orderBy(vm.laborList, ['rfqMountingType.name'], ['asc']);
          vm.listField = [];
          const objTotal = {
            rfqMountingType: { name: RFQTRANSACTION.LABOR.TotalLabor },
            id: null,
            rfqAssyBOMLaborCostingDetail: []
          };
          vm.laborList.push(objTotal);
          _.each(vm.laborList, (item) => {
            if (item.subAssyID) {
              const assyObj = _.find(vm.assyList, (assy) => parseInt(assy.subAssyID) === parseInt(item.subAssyID));
              if (assyObj) {
                item.rfqMountingType = { name: assyObj.pidCode };
              }
            }
            item.overHeadPrice = item.rfqAssyBOMLaborCostingDetail.length > 0 ? ((parseFloat(item.rfqAssyBOMLaborCostingDetail[0].overHeadPrice ? item.rfqAssyBOMLaborCostingDetail[0].overHeadPrice : 0)).toFixed(_amountFilterDecimal)) : parseFloat(0).toFixed(_amountFilterDecimal);
            item.overHeadAssyPrice = item.rfqAssyBOMLaborCostingDetail.length > 0 ? (item.lineCount * parseFloat(item.rfqAssyBOMLaborCostingDetail[0].overHeadPrice)) : 0;
            item.perAssyOverHeadPrice = item.rfqAssyBOMLaborCostingDetail.length > 0 ? $filter('amount')((parseFloat(item.rfqAssyBOMLaborCostingDetail[0].overHeadPrice ? item.rfqAssyBOMLaborCostingDetail[0].overHeadPrice : 0) * item.lineCount).toFixed(_amountFilterDecimal)) : parseFloat(0).toFixed(_amountFilterDecimal);
            _.each(vm.requestQtyList, (assyQty) => {
              var qtyObj = _.find(item.rfqAssyBOMLaborCostingDetail, (bomLabor) => parseInt(bomLabor.rfqAssyQtyID) === parseInt(assyQty.id));
              if (qtyObj) {
                qtyObj.qty = assyQty.requestQty;
                qtyObj.price = (parseFloat(qtyObj.price ? qtyObj.price : 0)).toFixed(_amountFilterDecimal);
                qtyObj.assyPrice = (item.totalQPA * parseFloat(qtyObj.price));
                qtyObj.perAssyPrice = $filter('amount')((parseFloat(qtyObj.price ? qtyObj.price : 0) * item.totalQPA).toFixed(_amountFilterDecimal));

                qtyObj.overHeadPrice = (parseFloat(qtyObj.overHeadPrice ? qtyObj.overHeadPrice : 0)).toFixed(_amountFilterDecimal);
                qtyObj.overHeadAssyPrice = (item.lineCount * parseFloat(qtyObj.overHeadPrice));
                qtyObj.overheadperextprice = (parseFloat(qtyObj.assyPrice ? qtyObj.assyPrice : 0) + parseFloat(qtyObj.overHeadAssyPrice ? qtyObj.overHeadAssyPrice : 0)).toFixed(_amountFilterDecimal);
                qtyObj.extprice = $filter('amount')((parseFloat(qtyObj.overheadperextprice ? qtyObj.overheadperextprice : 0) * assyQty.requestQty).toFixed(_amountFilterDecimal));

                qtyObj.perAssyOverHeadPrice = $filter('amount')((parseFloat(qtyObj.overHeadPrice ? qtyObj.overHeadPrice : 0) * item.lineCount).toFixed(_amountFilterDecimal));
                qtyObj.subAssyID = item.subAssyID;
                qtyObj.overheadextprice = $filter('amount')((parseFloat(qtyObj.assyPrice ? qtyObj.assyPrice : 0) + parseFloat(qtyObj.overHeadAssyPrice ? qtyObj.overHeadAssyPrice : 0)).toFixed(_amountFilterDecimal));

                qtyObj.extendedPrice = (parseFloat(qtyObj.overheadperextprice ? qtyObj.overheadperextprice : 0) * assyQty.requestQty).toFixed(_amountFilterDecimal);
                vm.listField.push(qtyObj);
              }
              else {
                const dynamic = {
                  id: null,
                  rfqAssyQtyID: assyQty.id,
                  rfqAssyBOMMountingID: item.id,
                  subAssyID: item.subAssyID,
                  price: '0.00',
                  overHeadPrice: '0.00',
                  perAssyPrice: '$0.00',
                  perAssyOverHeadPrice: '$0.00',
                  extprice: '$0.00',
                  qty: assyQty.requestQty,
                  assyPrice: 0,
                  overHeadAssyPrice: 0,
                  overheadextprice: '$0.00',
                  isPricePending: false
                };
                vm.listField.push(dynamic);
              }
            });
          });
          lineItemCount();
          vm.copyListField = angular.copy(vm.listField);
          vm.copyLaborField = angular.copy(vm.laborList);
          if (vm.isCurrentComponent) {
            showSummaryDetail();
          }
          $timeout(() => {
            vm.applybgColor();
          });
        });
      }
      //show summary detail for labor
      function showSummaryDetail() {
        vm.laborSummaryAssyDetail = [];
        _.each(vm.turnTimeQtyList, (turnTime) => {
          var objTime = _.find(vm.qtyWiseCost, (cost) => parseInt(cost.rfqAssyQtyID) === parseInt(turnTime.rfqAssyQtyID) && parseInt(cost.rfqAssyQtyTurnTimeID) === parseInt(turnTime.qtyTimeID));
          //if (objTime) {
          //material cost
          var obj = {
            id: RFQTRANSACTION.LABOR_ATTRIBUTE[0].id,
            price: objTime && objTime.materialCost ? objTime.materialCost.toFixed(2) : '0.00',
            qtyID: objTime ? objTime.id : turnTime.rfqAssyQtyID,
            Qty: turnTime.requestQty
          };
          vm.laborSummaryAssyDetail.push(obj);
          //labor cost
          const objLabor = {
            id: RFQTRANSACTION.LABOR_ATTRIBUTE[1].id,
            price: objTime ? objTime.laborCost.toFixed(2) : '0.00',
            //price: (vm.getTotalAssyOverHeadPrice(objTime ? objTime.rfqAssyQtyID : turnTime.rfqAssyQtyID)).toFixed(2),
            qtyID: objTime ? objTime.id : turnTime.rfqAssyQtyID,
            attributeLabor: '0.00',//objTime ? objTime.attributelabor : "0.00",
            Qty: turnTime.requestQty
          };
          vm.laborSummaryAssyDetail.push(objLabor);
          //overhead cost
          const objOverhead = {
            id: RFQTRANSACTION.LABOR_ATTRIBUTE[2].id,
            price: objTime && objTime.overheadcost ? objTime.overheadcost.toFixed(2) : '0.00',
            qtyID: objTime ? objTime.id : turnTime.rfqAssyQtyID,
            Qty: turnTime.requestQty
          };
          vm.laborSummaryAssyDetail.push(objOverhead);
          //Sub Total cost
          const objnreDet = {
            id: RFQTRANSACTION.LABOR_ATTRIBUTE[3].id,
            price: objTime ? (parseFloat(obj.price) + parseFloat(objLabor.price) + parseFloat(objOverhead.price)).toFixed(2) : '0.00',
            qtyID: objTime ? objTime.id : turnTime.rfqAssyQtyID,
            Qty: turnTime.requestQty
          };
          vm.laborSummaryAssyDetail.push(objnreDet);
          //NRE cost
          const objnre = {
            id: RFQTRANSACTION.LABOR_ATTRIBUTE[4].id,
            price: objTime && objTime.nreCost ? objTime.nreCost.toFixed(2) : '0.00',
            qtyID: objTime ? objTime.id : turnTime.rfqAssyQtyID,
            Qty: turnTime.requestQty
          };
          vm.laborSummaryAssyDetail.push(objnre);

          //Tooling cost
          const objTooling = {
            id: RFQTRANSACTION.LABOR_ATTRIBUTE[5].id,
            price: objTime && objTime.toolingCost ? objTime.toolingCost.toFixed(2) : '0.00',
            qtyID: objTime ? objTime.id : turnTime.id,
            Qty: turnTime.requestQty
          };
          vm.laborSummaryAssyDetail.push(objTooling);
          //}
        });
        _.each(vm.laborSummaryAssyDetail, (lbor) => {
          if (lbor.id === RFQTRANSACTION.LABOR_ATTRIBUTE[1].id) {
            const lborQty = _.find(vm.laborSummaryAssyDetail, (lborSummary) => lborSummary.id === lbor.id && (parseInt(lbor.Qty) > parseInt(lborSummary.Qty) && parseFloat(lbor.price) > parseFloat(lborSummary.price)));
            if (lborQty) {
              lbor.isIssue = true;
            }
          }
        });
      }
      commonPromise();
      //change labor price
      vm.changeprice = (item, qpa, qty, overheadPrice) => {
        if (item) {
          const objOldPrice = _.find(vm.copyListField, (lst) => lst.rfqAssyQtyID === item.rfqAssyQtyID && lst.rfqAssyBOMMountingID === item.rfqAssyBOMMountingID);
          if (parseFloat(item.price) > parseFloat(RFQTRANSACTION.UnitMaxValue)) {
            item.price = RFQTRANSACTION.UnitMaxValue;
          }
          item.price = (parseFloat(item.price ? item.price : 0)).toFixed(_amountFilterDecimal);
          item.perAssyPrice = $filter('amount')((parseFloat(item.price ? item.price : 0) * qpa).toFixed(_amountFilterDecimal));
          item.assyPrice = parseFloat(item.price ? item.price : 0) * qpa;
          item.overheadextprice = $filter('amount')((parseFloat(item.assyPrice ? item.assyPrice : 0) + parseFloat(overheadPrice ? overheadPrice : 0)).toFixed(_amountFilterDecimal));
          item.overheadperextprice = (parseFloat(item.assyPrice ? item.assyPrice : 0) + parseFloat(overheadPrice ? overheadPrice : 0)).toFixed(_amountFilterDecimal);
          item.extprice = $filter('amount')((parseFloat(item.overheadperextprice ? item.overheadperextprice : 0) * qty).toFixed(_amountFilterDecimal));
          item.extendedPrice = (parseFloat(item.overheadperextprice ? item.overheadperextprice : 0) * qty).toFixed(_amountFilterDecimal);

          if (objOldPrice && parseFloat(objOldPrice.price) !== parseFloat(item.price)) {
            BOMFactory.isBOMChanged = true;
            vm.enableDraftSave = true;
            vm.enableSubmitSave = false;
            if (vm.isCurrentComponent) {
              showSummaryDetail();
            }
            BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];
          }
        }
      };

      //get total qpa
      vm.totalQPA = () => {
        var laborlist = _.filter(vm.laborList, (lst) => lst.totalQPA);
        return (_.sumBy(laborlist, (sum) => parseFloat(sum.totalQPA ? sum.totalQPA : 0))).toFixed(2);
      };

      //get total item count
      vm.totalLineCount = () => {
        var laborlist = _.filter(vm.laborList, (lst) => lst.lineCount);
        return (_.sumBy(laborlist, (sum) => parseFloat(sum.lineCount ? sum.lineCount : 0))).toFixed(2);
      };

      //get total ext cost
      vm.getTotalExtPrice = (qtyid) => {
        var laborlist = _.filter(vm.listField, (lst) => parseInt(lst.rfqAssyQtyID) === parseInt(qtyid) && lst.extendedPrice);
        return (_.sumBy(laborlist, (sum) => parseFloat(sum.extendedPrice ? sum.extendedPrice : 0)));
      };
      //get total assy price
      vm.getTotalAssyPrice = (qtyid) => {
        var laborlist = _.filter(vm.listField, (lst) => parseInt(lst.rfqAssyQtyID) === parseInt(qtyid) && lst.price);
        return (_.sumBy(laborlist, (sum) => parseFloat(sum.assyPrice ? sum.assyPrice : 0)));
      };

      //get total assy over head price
      vm.getTotalAssyOverHeadPrice = (qtyid) => {
        var laborlist = _.filter(vm.listField, (lst) => parseInt(lst.rfqAssyQtyID) === parseInt(qtyid) && lst.overheadperextprice);
        return (_.sumBy(laborlist, (sum) => parseFloat(sum.overheadperextprice ? sum.overheadperextprice : 0)));
      };
      //check back ground color
      vm.getbackColor = (item, qpa, qty, isprice) => {
        if (isprice) {
          const pObj = _.filter(vm.listField, (lst) => lst.rfqAssyBOMMountingID === item.rfqAssyBOMMountingID && (parseFloat(item.price) > parseFloat(lst.price)));
          if (_.find(pObj, (lst) => lst.qty < qty)) {
            return RFQTRANSACTION.LABOR_BG_COLOR.PRICE_MINIMAL;
          }
        }
        else {
          const pObj = _.filter(vm.listField, (lst) => lst.rfqAssyBOMMountingID === item.rfqAssyBOMMountingID && (parseFloat(item.extendedPrice) < parseFloat(lst.extendedPrice)));
          if (_.find(pObj, (lst) => lst.qty < qty)) {
            return RFQTRANSACTION.LABOR_BG_COLOR.PRICE_MINIMAL;
          }
        }
      };
      vm.priceMatrixTypes = [];
      //get labor template detail from db
      function getLaborTemplateDetail() {
        if (vm.priceType) {
          return RFQSettingFactory.getTemplateDetail().query({ pPriceType: vm.priceType }).$promise.then((response) => {
            if (response && response.data) {
              vm.priceMatrixTypes = response.data;
            }
            return response;
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
      //get detail for selected labor template
      function selectLaborTemplate(item) {
        if (item) {
          LaborFactory.getLaborTemplateWisePriceDetail().query({ laborTemplateID: item.id }).$promise.then((response) => {
            if (response && response.data) {
              vm.laborPriceMatrixDetail = response.data;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
      //select price type
      function selectLaborTemplatePriceType(item) {
        if (item) {
          vm.priceType = item.Value;
          getLaborTemplateDetail();
        } else {
          vm.priceType = null;
          vm.laborPriceMatrixDetail = [];
          vm.autoCompleteLaborMatrix.keyColumnId = null;
        }
      }
      initAutoLaborAutoComplete();
      function initAutoLaborAutoComplete() {
        vm.autoCompleteLaborPriceTypeMatrix = {
          columnName: 'Key',
          keyColumnName: 'Value',
          keyColumnId: null,
          inputName: 'Price Type',
          placeholderName: 'Price Type',
          isRequired: false,
          isAddnew: false,
          onSelectCallbackFn: selectLaborTemplatePriceType
        },
          vm.autoCompleteLaborMatrix = {
            columnName: 'templateName',
            keyColumnName: 'id',
            keyColumnId: null,
            inputName: 'Labor Template',
            placeholderName: 'Labor Template',
            isRequired: false,
            isAddnew: true,
            callbackFn: getLaborTemplateDetail,
            onSelectCallbackFn: selectLaborTemplate,
            isAddFromRoute: true,
            routeName: USER.ADMIN_MANAGE_LABOR_COST_TEMPLATE_STATE,
            addData: {
              routeParams: {
                id: vm.autoCompleteLaborPriceTypeMatrix.keyColumnId
              }
            }
          };
      }
      //apply labor template to give detail.
      vm.applyLaborTemplate = () => {
        if (vm.isSummaryComplete || !vm.isLaborAllow || !vm.autoCompleteLaborMatrix.keyColumnId || !vm.autoCompleteLaborPriceTypeMatrix.keyColumnId || !vm.isActivityStart || vm.activityStartBy != vm.loginUserId) { return false;}
        if (CORE.PRICE_MATRIX_TYPES.QPA_PRICE_MATRIX_TEMPLATE.Value === parseInt(vm.priceType || 0)) {
          checkImportLaborTempaltePrice(vm.laborPriceMatrixDetail);
        }
        else {
          checkImportLaborTempaltePOverHeadPrice(vm.laborPriceMatrixDetail);
        }
      };

      //save labor detail
      vm.saveLabor = (isdraft) => {
        if (!isdraft && (vm.isSummaryComplete || !vm.isLaborAllow || !vm.enableDraftSave || !vm.isActivityStart || vm.activityStartBy != vm.loginUserId)) { return false; }
        if (isdraft && (vm.isSummaryComplete || !vm.isLaborAllow || !vm.enableSubmitSave || !vm.isActivityStart || vm.activityStartBy != vm.loginUserId)) { return false; }
        vm.isSaveClick = true;
        getRFQAssyDetailsByID(isdraft);
      };
      function saveLaborCost(isdraft) {
        var listField = _.filter(vm.listField, (lst) => lst.rfqAssyBOMMountingID);
        var objAssyObj = { rfqAssyID: _rfqAssyID, partID: _partID };
        var objLaborDet = {
          laborList: listField,
          objLabor: objAssyObj,
          isSubmit: isdraft,
          laborQuoteList: []
        };
        if (!isdraft) {
          savelaborDetail(objLaborDet);
        }
        else {
          _.each(vm.turnTimeQtyList, (quote) => {
            var total = _.sumBy(_.filter(listField, (fields) => parseInt(fields.rfqAssyQtyID) === quote.rfqAssyQtyID), (sum) => parseFloat(sum.overheadperextprice));
            var quoteObj = {
              rfqAssyID: _rfqAssyID,
              rfqAssyQtyID: quote.rfqAssyQtyID,
              rfqAssyQtyTurnTimeID: quote.qtyTimeID,
              requestedQty: quote.requestQty,
              turnTime: quote.turnTime,
              timeType: quote.unitOfTime,
              laborunitPrice: total,
              laborday: 0
            };
            objLaborDet.laborQuoteList.push(quoteObj);
          });
          savelaborDetail(objLaborDet);
        }
      }
      //common function for drft and final submit
      function savelaborDetail(objLaborDet) {
        vm.cgBusyLoading = LaborFactory.saveLaborDetail().query({ objLaborDet: objLaborDet }).$promise.then(() => {
          vm.enableDraftSave = false;
          vm.enableSubmitSave = true;
          BaseService.currentPageFlagForm = [];
          saveInternalVersion(objLaborDet.isSubmit ? true : false);
          BOMFactory.isBOMChanged = false;
          lineItemCount();
          //else {
          //    commonPromise();
          //}
        }).catch((error) => BaseService.getErrorLog(error));
      }

      // clear All labor Cost
      vm.clearAllLabor = () => {
        if (vm.isSummaryComplete || !vm.isLaborAllow || !vm.isActivityStart || vm.activityStartBy != vm.loginUserId) {
          return false;
        }
        const obj = {
          title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
          textContent: RFQTRANSACTION.LABOR_MESSAGE.CLEAR_ALL_LABOR_COST_MSG,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_CONFIRM_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        return DialogFactory.confirmDiolog(obj).then(() => {
          _.each(vm.laborList, (laborObj) => {
            if (laborObj.mountingTypeID) {
              laborObj.overHeadPrice = '0.00';
              laborObj.perAssyOverHeadPrice = '$0.00';
              laborObj.overHeadAssyPrice = '0.00';
              updateOverHead(laborObj.id, laborObj.perAssyOverHeadPrice, laborObj.overHeadPrice, laborObj.overHeadAssyPrice);
            }
            if (!laborObj.mountingTypeID && laborObj.subAssyID) {
              laborObj.overHeadPrice = '0.00';
              laborObj.perAssyOverHeadPrice = '$0.00';
              laborObj.overHeadAssyPrice = '0.00';
              updateOverHead(laborObj.id, laborObj.perAssyOverHeadPrice, laborObj.overHeadPrice, laborObj.overHeadAssyPrice);
            }
          });
          _.each(vm.listField, (lborDetail) => {
            if (!lborDetail.subAssyID) {
              lborDetail.price = '0.00';
              lborDetail.extendedPrice = '0.00';
              lborDetail.extprice = '0.00';
              lborDetail.overHeadPrice = '0.00';
              lborDetail.overheadextprice = '0.00';
              lborDetail.overheadperextprice = '0.00';
              lborDetail.perAssyOverHeadPrice = '0.00';
              lborDetail.perAssyPrice = '0.00';
              vm.changeprice(lborDetail, 0, 0, 0);
            }
          });
          BOMFactory.isBOMChanged = true;
          vm.enableDraftSave = true;
          vm.enableSubmitSave = false;
          BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      };
      //check assy price added or not
      vm.checkPrice = () => {
        var lst = _.filter(vm.listField, (lst) => lst.subAssyID && parseFloat(lst.price) === 0);
        if ((lst.length) > 0) {
          return true;
        }
        else {
          return false;
        }
      };
      //line Item Count
      function lineItemCount() {
        var totalPriced = [];
        vm.totalLineItem = vm.laborList.length - 1;
        _.each(vm.laborList, (pricePercentage) => {
          if (!_.find(pricePercentage.rfqAssyBOMLaborCostingDetail, (prce) => prce.price && parseFloat(prce.price) === 0)) {
            totalPriced.push(pricePercentage);
          }
        });
        vm.PricedPercentage = stringFormat('Labor Items {0}/{1}', totalPriced.length - 1, vm.totalLineItem); //(totalPriced.length * 100 / totalItems.length);
      }

      //apply all labor
      vm.applyalllabor = (item) => {
        if (vm.isSummaryComplete) {
          return;
        }
        const laborQty = _.filter(vm.listField, (lborQty) => parseInt(lborQty.rfqAssyBOMMountingID) === parseInt(item.id));
        _.each(laborQty, (lborDetail) => {
          if (lborDetail.rfqAssyQtyID !== laborQty[0].rfqAssyQtyID) {
            lborDetail.price = laborQty[0].price;
            const qty = _.find(vm.requestQtyList, (qtyl) => parseInt(qtyl.id) === parseInt(lborDetail.rfqAssyQtyID));
            vm.changeprice(lborDetail, item.totalQPA, qty.requestQty, item.overHeadAssyPrice);
          }
        });
      };
      vm.applyAllLaborVertically = (rfqAssyQtyID) => {
        if (vm.isSummaryComplete) {
          return;
        }
        if (!rfqAssyQtyID) {
          const firstLaborDetails = _.head(vm.laborList);
          if (firstLaborDetails && firstLaborDetails.overHeadPrice) {
            _.each(vm.laborList, (lborDetail) => {
              lborDetail.overHeadPrice = firstLaborDetails.overHeadPrice ? firstLaborDetails.overHeadPrice : 0;
              vm.changeOverHeadprice(lborDetail);
            });
          }
        }
        else {
          const firstLaborDetails = _.head(_.filter(vm.listField, { 'rfqAssyQtyID': rfqAssyQtyID.id }));
          if (firstLaborDetails && firstLaborDetails.price) {
            const laborQty = _.filter(vm.listField, (lborQty) => parseInt(lborQty.rfqAssyQtyID) === parseInt(rfqAssyQtyID.id) && !lborQty.subAssyID);
            _.each(laborQty, (lborDetail) => {
              lborDetail.price = firstLaborDetails.price ? firstLaborDetails.price : 0;
              const qty = _.find(vm.requestQtyList, (qtyl) => parseInt(qtyl.id) === parseInt(lborDetail.rfqAssyQtyID));
              const item = _.find(vm.laborList, { 'id': lborDetail.rfqAssyBOMMountingID });
              if (item) {
                vm.changeprice(lborDetail, item.totalQPA, qty.requestQty, item.overHeadAssyPrice);
              }
            });
          }
        }
      };
      //total over head cost
      vm.totalOverHead = () => {
        var laborlist = _.filter(vm.laborList, (lst) => lst.overHeadAssyPrice);
        return (_.sumBy(laborlist, (sum) => parseFloat(sum.overHeadAssyPrice))).toFixed(2);
      };
      //change overhead cost
      vm.changeOverHeadprice = (item) => {
        if (item) {
          const objOldPrice = _.find(vm.copyLaborField, (lst) => parseInt(lst.id) === parseInt(item.id));
          if (parseFloat(item.overHeadPrice) > parseFloat(RFQTRANSACTION.UnitMaxValue)) {
            item.overHeadPrice = RFQTRANSACTION.UnitMaxValue;
          }
          item.perAssyOverHeadPrice = $filter('amount')((parseFloat(item.overHeadPrice ? item.overHeadPrice : 0) * item.lineCount).toFixed(_amountFilterDecimal));
          item.overHeadPrice = (parseFloat(item.overHeadPrice ? item.overHeadPrice : 0)).toFixed(_amountFilterDecimal);
          item.overHeadAssyPrice = parseFloat(item.overHeadPrice ? item.overHeadPrice : 0) * item.lineCount;
          updateOverHead(item.id, item.perAssyOverHeadPrice, item.overHeadPrice, item.overHeadAssyPrice);
          if (objOldPrice && objOldPrice.overHeadPrice !== item.overHeadPrice) {
            BOMFactory.isBOMChanged = true;
            vm.enableDraftSave = true;
            vm.enableSubmitSave = false;
            if (vm.isCurrentComponent) {
              showSummaryDetail();
            }
            BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];
          }
        }
      };
      //over head price
      function updateOverHead(id, perAssyOverHeadPrice, overHeadPrice, overHeadAssyPrice) {
        var laborQty = _.filter(vm.listField, (lborQty) => parseInt(lborQty.rfqAssyBOMMountingID) === parseInt(id));
        _.each(laborQty, (lbor) => {
          lbor.perAssyOverHeadPrice = perAssyOverHeadPrice;
          lbor.overHeadPrice = overHeadPrice;
          lbor.overHeadAssyPrice = overHeadAssyPrice;
          lbor.overheadextprice = $filter('amount')((parseFloat(lbor.assyPrice ? lbor.assyPrice : 0) + parseFloat(lbor.overHeadAssyPrice ? lbor.overHeadAssyPrice : 0)).toFixed(_amountFilterDecimal));
          lbor.overheadperextprice = (parseFloat(lbor.assyPrice ? lbor.assyPrice : 0) + parseFloat(lbor.overHeadAssyPrice ? lbor.overHeadAssyPrice : 0)).toFixed(_amountFilterDecimal);
          lbor.extprice = $filter('amount')((parseFloat(lbor.overheadperextprice ? lbor.overheadperextprice : 0) * lbor.qty).toFixed(_amountFilterDecimal));
          lbor.extendedPrice = (parseFloat(lbor.overheadperextprice ? lbor.overheadperextprice : 0) * lbor.qty).toFixed(_amountFilterDecimal);
        });
      }

      //import file
      vm.importPricing = (event) => {
        if (vm.isSummaryComplete || !vm.isLaborAllow || !vm.isActivityStart || vm.activityStartBy != vm.loginUserId) { return false;}
        if (BOMFactory.isBOMChanged) {
          const model = {
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: RFQTRANSACTION.LABOR_MESSAGE.IMPORT_LABOR_WITHOUT_SAVING_ALERT_MESSAGE,
            multiple: true
          };
          DialogFactory.alertDialog(model);
        }
        else {
          vm.event = event;
          angular.element('#fiexcel').trigger('click');
        }
      };
      vm.eroOptions = {
        workstart: function () {
        },
        workend: function () { },
        sheet: function (json, sheetnames, select_sheet_cb, files) {
          var type = files.name.split('.');
          if (_.find(CORE.UPLOAD_DOCUMENT_TYPE, (docType) => docType === type[type.length - 1])) {
            NotificationFactory.success(CORE.MESSAGE_CONSTANT.LABOR_UPLOAD);
            generateModel(json);
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_TYPE_NOT_ALLOWED);
            messageContent.message = stringFormat(messageContent.message, (CORE.UPLOAD_DOCUMENT_TYPE).join());
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
          }
        },
        badfile: function () {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_UPLOAD_FAIL_TEXT);
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
        },
        pending: function () {
          // console.log('Pending');
        },
        failed: function () {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_TYPE_NOT_ALLOWED);
          messageContent.message = stringFormat(messageContent.message, (CORE.UPLOAD_DOCUMENT_TYPE).join());
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        },
        large: function () {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_UPLOAD_FAIL_SIZE_TEXT);
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
        },
        multiplefile: function () {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SINGLE_FILE_UPLOAD);
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
        }
      };
      //generate model
      function generateModel(json) {
        var header = json[0];
        var Qty = [];
        var dataList = [];
        if (header.length > 0) {
          _.each(json, (data, index) => {
            if (index > 0) {
              let i = 0;
              const pObj = {};
              _.each(data, (pricedata) => {
                if (header[i]) {
                  if (header[i].toLowerCase() !== 'Mounting Type'.toLowerCase() && header[i].toLowerCase() !== 'QPA'.toLowerCase()) {
                    if (!_.find(Qty, (qty) => qty === parseInt(header[i]))) {
                      Qty.push(parseInt(header[i]));
                    }
                    pObj[parseInt(header[i])] = pricedata;
                  }
                  else {
                    pObj[header[i]] = pricedata;
                  }
                }
                i++;
              });
              if (!pObj['Mounting Type'] && dataList.length > 0) {
                pObj['Mounting Type'] = dataList[dataList.length - 1]['Mounting Type'];
              }
              dataList.push(pObj);
            }
          });
          checkPriceDetail(dataList, Qty);
        }
      }
      //check Price while import form labor excel
      const checkPriceDetail = (priceList, Qty) => {
        _.each(vm.laborList, (labor) => {
          var laborMountPriceList = _.filter(priceList, (price) => price['Mounting Type'] && price['Mounting Type'].toLowerCase() === labor.rfqMountingType.name.toLowerCase());
          if (laborMountPriceList.length > 0) {
            const lstDetails = _.filter(vm.listField, (lst) => parseInt(lst.rfqAssyBOMMountingID) === parseInt(labor.id));
            _.each(lstDetails, (lstDet) => {
              var lMount = _.find(laborMountPriceList, (mountPrice) => mountPrice['QPA'] && !isNaN(mountPrice['QPA']) && parseFloat(mountPrice['QPA']) === parseFloat(labor.totalQPA));
              if (lMount) {
                lstDet.price = checkQpaPrice(Qty, lMount, lstDet.qty);
                vm.changeprice(lstDet, labor.totalQPA, lstDet.qty);
              }
              else {
                laborMountPriceList = _.sortBy((_.filter(laborMountPriceList, (mountPrice) => mountPrice['QPA'] < labor.totalQPA)), (o) => o['QPA']);// _.sortBy(users, [function (o) { return o.user; }]);
                if (laborMountPriceList.length > 0) {
                  lstDet.price = checkQpaPrice(Qty, laborMountPriceList[laborMountPriceList.length - 1], lstDet.qty);
                }
                else {
                  lstDet.price = '0.00';
                }
                vm.changeprice(lstDet, labor.totalQPA, lstDet.qty);
              }
            });
          }
        });
      };

      //check price while import from labor template
      const checkImportLaborTempaltePrice = (priceList) => {
        _.each(vm.laborList, (labor) => {
          var laborMountPriceList = _.filter(priceList, (price) => parseInt(price.mountingtypeID) === parseInt(labor.mountingTypeID));
          if (laborMountPriceList.length > 0) {
            const lstDetails = _.filter(vm.listField, (lst) => parseInt(lst.rfqAssyBOMMountingID) === parseInt(labor.id));
            _.each(lstDetails, (lstDet) => {
              var lMount = _.filter(laborMountPriceList, (mountPrice) => mountPrice.qpa === labor.totalQPA);
              if (lMount.length > 0) {
                lstDet.price = checkLaborTempalateQpaPrice(lMount, lstDet.qty);
                vm.changeprice(lstDet, labor.totalQPA, lstDet.qty);
              }
              else {
                lMount = _.sortBy((_.filter(laborMountPriceList, (mountPrice) => mountPrice.qpa < labor.totalQPA)), (o) => o.qpa);// _.sortBy(users, [function (o) { return o.user; }]);
                if (lMount.length > 0) {
                  lMount = _.filter(laborMountPriceList, (mountPrice) => mountPrice.qpa === lMount[lMount.length - 1].qpa);
                  lstDet.price = checkLaborTempalateQpaPrice(lMount, lstDet.qty);
                }
                else {
                  lMount = _.sortBy(laborMountPriceList, (o) => o.qpa);
                  lMount = _.filter(laborMountPriceList, (mountPrice) => mountPrice.qpa === lMount[0].qpa);
                  lstDet.price = checkLaborTempalateQpaPrice(lMount, lstDet.qty);
                }
                vm.changeprice(lstDet, labor.totalQPA, lstDet.qty);
              }
            });
          }
        });
      };
      //check qpa price for labor template
      const checkLaborTempalateQpaPrice = (Mountinglist, mainQty) => {
        if (Mountinglist.length > 0) {
          const qtyObj = _.find(Mountinglist, (qtyDet) => qtyDet.orderedQty === mainQty);
          if (qtyObj) {
            return qtyObj.price;
          }
          else {
            let lstMounting = _.sortBy((_.filter(Mountinglist, (qtyPrice) => qtyPrice.orderedQty < mainQty)), (o) => o.orderedQty);
            if (lstMounting.length > 0) {
              return lstMounting[lstMounting.length - 1].price;
            }
            else {
              lstMounting = _.sortBy(Mountinglist, (o) => o.orderedQty);
              return lstMounting[0].price;
            }
          }
        }
        else {
          return '0.00';
        }
      };

      //check price while import from labor template for overhead
      const checkImportLaborTempaltePOverHeadPrice = (priceList) => {
        _.each(vm.laborList, (labor) => {
          var laborMountPriceList = _.filter(priceList, (price) => parseInt(price.mountingtypeID) === parseInt(labor.mountingTypeID));
          if (laborMountPriceList.length > 0) {
            const mountOverHead = _.find(laborMountPriceList, (overhead) => overhead.qpa === labor.totalQPA);
            if (mountOverHead) {
              labor.overHeadPrice = mountOverHead.price;
              vm.changeOverHeadprice(labor);
            } else {
              let overHeadPrice = _.sortBy((_.filter(laborMountPriceList, (mountPrice) => mountPrice.qpa < labor.totalQPA)), (o) => o.qpa);
              if (overHeadPrice.length > 0) {
                labor.overHeadPrice = overHeadPrice[overHeadPrice.length - 1].price;
                vm.changeOverHeadprice(labor);
              } else {
                overHeadPrice = _.sortBy(laborMountPriceList, (o) => o.qpa);
                labor.overHeadPrice = overHeadPrice[0].price;
                vm.changeOverHeadprice(labor);
              }
            }
          }
        });
      };
      //check qpa price for excel file
      const checkQpaPrice = (Qty, objprice, mainQty) => {
        if (Qty.length > 0) {
          const qtyObj = _.find(Qty, (qtyDet) => qtyDet && mainQty && parseInt(qtyDet) === parseInt(mainQty));
          if (qtyObj && !_.isNaN(parseFloat(objprice[qtyObj]))) {
            return objprice[qtyObj];
          }
          else {
            Qty = _.sortBy((_.filter(Qty, (qtyPrice) => qtyPrice < mainQty)), (o) => o);
            if (Qty.length > 0 && !_.isNaN(parseFloat(objprice[Qty[Qty.length - 1]]))) {
              return objprice[Qty[Qty.length - 1]];
            }
            else {
              return '0.00';
            }
          }
        }
        else {
          return '0.00';
        }
      };

      //export template for labor sample data
      vm.exportTemplate = () => {
        if (vm.isSummaryComplete || !vm.isLaborAllow || !vm.isActivityStart || vm.activityStartBy != vm.loginUserId) { return false;}
        const laborIds = {
          pPartID: _partID,
          prfqAssyID: _rfqAssyID
        };
        vm.cgBusyLoading = LaborFactory.exportLaborTemplate(laborIds).then((response) => {
          if (response.data) {
            const TimeStamp = $filter('date')(new Date(), CORE.DateFormatArray[0].format);
            const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
            if (navigator.msSaveOrOpenBlob) {
              navigator.msSaveOrOpenBlob(blob, stringFormat('ExportLaborTemplate-{0}.xls', TimeStamp));
            } else {
              const link = document.createElement('a');
              if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', stringFormat('ExportLaborTemplate-{0}.xls', TimeStamp));
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

      vm.applybgColor = () => {
        var colors = vm.UIAlternateColor;
        _.each(vm.requestQtyList, (x, i) => {
          var random_color = colors[i % 2];
          if (document.getElementById('qty_' + i)) {
            document.getElementById('qty_' + i).style.background = random_color;
            document.getElementById('title_' + i).style.background = random_color;
            document.getElementById('total_' + i).style.background = random_color;
          }
        });
      };

      //dynamic height increase for feeder location
      //$scope.$watch('splitPaneProperties.firstComponentSize',(newValue)=> {
      //  if (newValue < 450) {
      //    const gridclientHeight = document.getElementById('laborsummary');
      //    const clientHeight = $scope.splitPaneProperties.firstComponentSize - 115;
      //    if (gridclientHeight && gridclientHeight) {
      //      gridclientHeight.setAttribute('style', 'height:' + clientHeight + 'px !important;');
      //    }
      //  }
      //});

      //vm.laborPartReport = () => {
      //  vm.cgBusyLoading = BOMFactory.downloadLaborReport({
      //    customerID: 223,
      //    fromDate: "2019-06-20",
      //    toDate: "2019-08-20",
      //    pPartIds: "6868,10280"
      //  }).then((response) => {
      //    var model = {
      //      title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
      //      textContent: '',
      //      multiple: true
      //    };
      //    if (response.status == 404) {
      //      model.textContent = CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.NotFound;
      //      DialogFactory.alertDialog(model);
      //    } else if (response.status == 403) {
      //      model.textContent = CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.AccessDenied;
      //      DialogFactory.alertDialog(model);
      //    } else if (response.status == 401) {
      //      model.textContent = CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.Unauthorized;
      //      DialogFactory.alertDialog(model);
      //    } else if (response.status == -1) {
      //      model.textContent = CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.ServiceUnavailable;
      //      DialogFactory.alertDialog(model);
      //    } else {
      //      let blob = new Blob([response.data], {
      //        type: 'application/pdf'
      //      });
      //      if (navigator.msSaveOrOpenBlob) {
      //        navigator.msSaveOrOpenBlob(blob, 'Labor Assy Comparison.pdf')
      //      } else {
      //        let link = document.createElement("a");
      //        if (link.download !== undefined) {
      //          let url = URL.createObjectURL(blob);
      //          link.setAttribute("href", url);
      //          if (true) {
      //            link.setAttribute("download", 'Labor Assy Comparison.pdf');
      //          } else {
      //            link.setAttribute("target", "_blank");
      //          }
      //          link.style = "visibility:hidden";
      //          document.body.appendChild(link);
      //          $timeout(() => {
      //            link.click();
      //            document.body.removeChild(link);
      //          });
      //        }
      //      }
      //    }
      //  }).catch((error) => BaseService.getErrorLog(error));
      //};
      vm.goToLaborCostTemplateList = () => {
        BaseService.goToLaborCostTemplateList();
      };

      function connectSocket() {
        socketConnectionService.on(PRICING.EventName.revisedQuote, revisedQuote);
        socketConnectionService.on(PRICING.EventName.sendCostingStartStopActivity, CostingStartStopActivity);
      }
      connectSocket();

      socketConnectionService.on('reconnect', () => {
        connectSocket();
      });

      function revisedQuote(assyid) {
        if (parseInt(assyid || 0) === parseInt(_rfqAssyID) && vm.isSummaryComplete) {
          vm.isSummaryComplete = false;
        }
      }

      function CostingStartStopActivity(data) {
        if (parseInt(data.rfqAssyID || 0) === parseInt(_rfqAssyID)) {
          vm.isActivityStart = !vm.isActivityStart;
          vm.activityStartBy = data.loginUserId;
        }
      }
      function removeSocketListener() {
        socketConnectionService.removeListener(PRICING.EventName.revisedQuote, revisedQuote);
        socketConnectionService.removeListener(PRICING.EventName.sendCostingStartStopActivity, CostingStartStopActivity);
      }
      //close popup on destroy page
      $scope.$on('$destroy', ()=> {
        removeSocketListener();
      });
      socketConnectionService.on('disconnect', ()=> {
        removeSocketListener();
      });
    }
  }
})();
