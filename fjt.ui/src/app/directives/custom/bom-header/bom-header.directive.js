
(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('bomHeader', bomHeader);

  /** @ngInject */
  function bomHeader() {
    var directive = {
      restrict: 'E',
      scope: {
        rfqAssyid: '=',
        customerid: '=',
        partid: '='
      },
      templateUrl: 'app/directives/custom/bom-header/bom-header.html',
      controller: bomHeaderDetailsCtrl,
      controllerAs: 'vm'
    };
    return directive;
    /** @ngInject */
    function bomHeaderDetailsCtrl($scope, $state, BaseService, BOMFactory, CORE, DialogFactory, USER, TRANSACTION, MasterFactory, RFQTRANSACTION, $rootScope, PartCostingFactory, socketConnectionService, PRICING, $q) {
      var vm = this;
      const rfqAssyID = $scope.rfqAssyid;
      const customerID = $scope.customerid;
      const partID = $scope.partid;
      vm.LabelConstant = CORE.LabelConstant;
      vm.DefaultVersion = CORE.MESSAGE_CONSTANT.INITAL_UPLOAD_STATUS;
      vm.DateTimeFormat = _dateDisplayFormat;
      vm.QuoteStatus = RFQTRANSACTION.RFQ_ASSY_QUOTE_STATUS;
      vm.statusGridHeaderDropdown = CORE.RFQStatusGridHeaderDropdown;
      vm.quoteProgressGridHeaderDropdown = CORE.RFQQuoteProgressGridHeaderDropdown;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.operationalImagePath = CORE.WEB_URL + USER.DYNAMIC_ATTRIBUTE_BASE_PATH;
      vm.loginUser = BaseService.loginUser;
      vm.loginUserId = vm.loginUser.userid;
      vm.transactionType = TRANSACTION.StartStopActivityTransactionType;

      /* open popup for activity log*/
      vm.cositngActivityLog = (ev) => {
        var data = {
          refTransID: parseInt(rfqAssyID),
          transactionType: vm.transactionType[1].id
        };
        DialogFactory.dialogService(
          RFQTRANSACTION.BOM_ACTIVITY_HISTORY_POPUP_CONTROLLER,
          RFQTRANSACTION.BOM_ACTIVITY_HISTORY_POPUP_VIEW,
          ev,
          data).then(() => { //success
          }, (err) => BaseService.getErrorLog(err));
      };
      /* get bom header all details */
      const getbomHeaderDetails = () => {
        const bomInfo = {
          rfqAssyID: rfqAssyID
        };
        return BOMFactory.getAssemblyHeaderDetails().query(bomInfo).$promise.then((res) => {
          if (res && res.data) {
            vm.bom = res.data.bomHeader[0];
            // show color code in background of class and default color of "label-primary (CORE.DefaultStandardTagColor)"
            const standardClassArray = [];
            if (vm.bom && vm.bom.standards) {
              const classWithColorCode = vm.bom.standards.split('@@@@@@');
              _.each(classWithColorCode, (item) => {
                if (item) {
                  const objItem = item.split('######');
                  const standardClassObj = {};
                  standardClassObj.className = objItem[0];
                  standardClassObj.colorCode = CORE.DefaultStandardTagColor;
                  if (objItem[1]) {
                    standardClassObj.colorCode = objItem[1];
                  }
                  const classObj = _.find(standardClassArray, { className: standardClassObj.className });
                  if (!classObj) {
                    standardClassArray.push(standardClassObj);
                  }
                }
              });
              if (classWithColorCode.length > 0) {
                vm.standards = standardClassArray;
              }
            }
            vm.bom.RoHSStatusIcon = stringFormat('{0}{1}{2}', CORE.WEB_URL, USER.ROHS_BASE_PATH, (vm.bom.rohsIcon ? vm.bom.rohsIcon : CORE.DEFAULT_IMAGE));
            return res.data;
            //getComponentInternalVersion();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      //if ((!$scope.isChange && !vm.loadDetails) || ($scope.isChange != isChange)) {
      //
      //}
      function getCustomerList() {
        return MasterFactory.getCustomerByEmployeeID().query().$promise.then((customer) => {
          if (customer && customer.data) {
            vm.CustomerList = customer.data;
            const CustomerObj = _.find(vm.CustomerList, { id: customerID });
            if (CustomerObj) {
              vm.isCustomerAccess = true;
            }
          }
          return vm.CustomerList;
        }).catch((error) => BaseService.getErrorLog(error));
      }

      //remove MFG PN copied status on hover
      vm.MFGPNStatus = () => {
        vm.showMFGPNstatus = false;
      };
      function getBOMProgress() {
        return BOMFactory.getBOMProgress().query({ id: partID }).$promise.then((response) => {
          if (response && response.data) {
            vm.bomProgress = response.data[0].pProgress;
            return response.data;
          }
        });
      }
      //getBOMProgress();
      callCommonFunction();
      // get Component Internal Version
      // function getComponentInternalVersion() {
      //  if (vm.bom && vm.bom.partID) {
      //    MasterFactory.getComponentInternalVersion().query({ id: vm.bom.partID }).$promise.then((requirement) => {
      //      if (requirement && requirement.data) {
      //        vm.bom.liveInternalVersion = requirement.data.liveVersion;
      //      }
      //    }).catch((error) => BaseService.getErrorLog(error));
      //  }
      // }

      /* open popup for Assembly at Glance */
      vm.getAssemblyAtGlance = (ev) => {
        const obj = vm.bom;
        obj.Customer = vm.bom.customerName;
        obj.PIDCode = vm.bom.assyID;
        obj.nickName = vm.bom.nickname;
        obj.rohsComplientConvertedValue = vm.bom.rohs;
        obj.mfgPN = vm.bom.assyNumber;
        obj.id = vm.bom.quoteGroupNumber;
        obj.customerID = customerID;
        DialogFactory.dialogService(
          RFQTRANSACTION.ASSEMBLY_AT_GLANCE_CONTROLLER,
          RFQTRANSACTION.ASSEMBLY_AT_GLANCE_VIEW,
          ev,
          obj).then(() => {

          }, (err) => BaseService.getErrorLog(err));
      };

      //go to manage RFQ page in edit version
      vm.gotoRFQ = () => {
        BaseService.goToRFQUpdate(vm.bom.quoteGroupNumber, rfqAssyID);
        return false;
      };

      /* Open popup for display history of entry change */
      vm.rfqShowHistory = ($event) => {
        if (!vm.bom.liveInternalVersion) { return false;}
        if (vm.bom.liveInternalVersion) {
          const data = {
            partID: vm.bom.partID,
            assemblyNumber: vm.bom.assyID,
            assemblyRev: vm.bom.rev,
            narrative: false,
            title: CORE.BOMVersionHistoryPopUpTitle.ASSY_BOM
          };

          DialogFactory.dialogService(
            RFQTRANSACTION.BOM_HISTORY_POPUP_CONTROLLER,
            RFQTRANSACTION.BOM_HISTORY_POPUP_VIEW,
            $event,
            data).then(() => {
            }, () => {

            }, (error) => BaseService.getErrorLog(error));
        }
      };

      //save summary in history and copy summary detail as new.
      vm.revisedQuote = () => {
        vm.cgBusyLoading = PartCostingFactory.getAssemblyCurrentStatus().query({ rfqAssyID: rfqAssyID }).$promise.then((response) => {
          if (response && response.data && response.data.status === CORE.RFQAssyStatus.FOLLOWUP.ID) {
            vm.cgBusyLoading = PartCostingFactory.revisedQuote().query({ rfqAssyID: rfqAssyID }).$promise.then((responseQuote) => {
              if (responseQuote && responseQuote.data) {
                callCommonFunction();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
          else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.ASSY_STATUS_CHECK_VERIFICATION);
            messageContent.message = stringFormat(messageContent.message, vm.bom.assyID, (response.data.status === CORE.RFQAssyStatus.WON.ID ? CORE.RFQAssyStatus.WON.Name : (response.data.status === CORE.RFQAssyStatus.Lost.ID ? CORE.RFQAssyStatus.Lost.Name : (response.data.status === CORE.RFQAssyStatus.INPROGRESS.ID ? CORE.RFQAssyStatus.INPROGRESS.Name : CORE.RFQAssyStatus.Lost.CANCEL))), 'revise');
            const model = {
              multiple: true,
              messageContent: messageContent
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                callCommonFunction();
              }
            }).catch(() => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      function callCommonFunction() {
        var autocompletePromise = [getbomHeaderDetails(), getBOMProgress(), getCustomerList()];
        vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
          $scope.$applyAsync();
        }).catch((error) => BaseService.getErrorLog(error));
        //getbomHeaderDetails();
        //getBOMProgress();
      };
      /* Open popup for display history of narrative */
      vm.showNarrativeHistory = ($event) => {
        if (vm.bom.liveInternalVersion) {
          const data = {
            partID: vm.bom.partID,
            assemblyNumber: vm.bom.assyID,
            assemblyRev: vm.bom.rev,
            narrative: true,
            title: CORE.BOMVersionHistoryPopUpTitle.RANDD_STATUS
          };
          DialogFactory.dialogService(
            RFQTRANSACTION.BOM_HISTORY_POPUP_CONTROLLER,
            RFQTRANSACTION.BOM_HISTORY_POPUP_VIEW,
            $event,
            data).then(() => {
            }, () => {

            }, (error) => BaseService.getErrorLog(error));
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
        BaseService.goToComponentDetailTab(null, vm.bom.partID);
        return false;
      };
      //go to assy type list
      vm.goToAssyTypeList = () => {
        BaseService.goToAssyTypeList();
        return false;
      };
      // go to customer details
      vm.goToCustomerDetails = () => {
        BaseService.goToCustomer(customerID);
        return false;
      };
      ///go to standard list
      vm.goToStandardList = () => {
        BaseService.goToStandardList();
        return false;
      };

      const UpdateInternalVersion = $rootScope.$on(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion, () => {
        callCommonFunction();
      });

      function connectSocket() {
        socketConnectionService.on(PRICING.EventName.sendSubmittedQuote, sendSubmittedQuote);
        socketConnectionService.on(PRICING.EventName.revisedQuote, revisedQuote);
        socketConnectionService.on(PRICING.EventName.sendCostingStartStopActivity, CostingStartStopActivity);
      }
      connectSocket();

      socketConnectionService.on('reconnect', () => {
        connectSocket();
      });

      function removeSocketListener() {
        socketConnectionService.removeListener(PRICING.EventName.sendSubmittedQuote, sendSubmittedQuote);
        socketConnectionService.removeListener(PRICING.EventName.revisedQuote, revisedQuote);
        socketConnectionService.removeListener(PRICING.EventName.sendCostingStartStopActivity, CostingStartStopActivity);
      }
      socketConnectionService.on('disconnect', () => {
        removeSocketListener();
      });

      function sendSubmittedQuote(data) {
        if (data.assyID === rfqAssyID) {
          callCommonFunction();
        }
      }
      function revisedQuote(assyid) {
        if (assyid === rfqAssyID) {
          callCommonFunction();
        }
      }
      function CostingStartStopActivity(data) {
        if (data.rfqAssyID === rfqAssyID) {
          callCommonFunction();
        }
      }

      vm.goToJobList = () => {
        BaseService.openInNew(USER.ADMIN_JOB_TYPE_STATE, {});
        return false;
      };
      //Open part master doument directive on click of sample image count
      vm.openDocumentTab = (mfgType, partId) => {
        const routeState = mfgType.toUpperCase() === CORE.MFG_TYPE.MFG ? USER.ADMIN_MANAGECOMPONENT_DOCUMENT_STATE : USER.ADMIN_MANAGEDISTCOMPONENT_DOCUMENT_STATE;
        BaseService.openInNew(routeState, { coid: partId, docOpenType: 1 });
      };

      // on move to other controller destory all event
      $scope.$on('$destroy', () => {
        removeSocketListener();
        UpdateInternalVersion();
      });
      // go to quote page
      vm.goToQuote = () => {
        BaseService.openInNew(RFQTRANSACTION.QUOTE_SUMMARY_DETAIL_STATE, { id: rfqAssyID, quoteSubmittedID: vm.bom.lastQuoteID, pageType: RFQTRANSACTION.QUOTE_PAGE_TYPE.QUOTE.Name });
      };

      // go to sales price matrix
      vm.goToSalesPriceMatrix = () => {
        BaseService.goToComponentSalesPriceMatrixTab(partID);
      };
    }
  }
})();
