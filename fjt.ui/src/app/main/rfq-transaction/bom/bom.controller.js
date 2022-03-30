(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('BOMController', BOMController);

  /** @ngInject */
  function BOMController($filter, $state, $scope, $timeout, RFQTRANSACTION, BOMFactory, MasterFactory,
    DialogFactory, CORE, USER, PRICING, socketConnectionService, BaseService, CONFIGURATION, ComponentPriceBreakDetailsFactory, TRANSACTION) {
    const vm = this;
    vm.assyLoading = false;
    vm.status = null;
    vm.PRICING_STATUS = PRICING.PRICING_STATUS;
    vm.entityName = CORE.AllEntityIDS.BOM;
    vm.QuoteStatus = RFQTRANSACTION.RFQ_ASSY_QUOTE_STATUS;
    vm.EmptyMesssageInOut = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.COSTING_ACTIVITY;
    vm.InternalName = CORE.FCA.Name;
    vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE;
    vm.bom = {};
    vm.PricingFilters = _.clone(RFQTRANSACTION.PRICING_FILTER);
    vm.FullDateTimeFormat = _dateTimeFullTimeDisplayFormat;
    vm.bomProgress = 0;
    vm.openDigikeyPopup = false;
    vm.assyid = $state.params.id;
    vm.DateTimeFormat = _dateDisplayFormat;
    var strParam = '({id: ' + $state.params.id + ', partId: 1})';
    vm.packaging = true;
    vm.quotePageType = RFQTRANSACTION.QUOTE_PAGE_TYPE;
    vm.isCustomerAccess = false;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.CustomerList = [];
    vm.CostingActivityStartedByUserName = null;
    vm.isCostingActivityStart = true;
    vm.AssyActivityStartedBy = 1;
    vm.AssyActivityStartedByUserName = null;
    vm.AssyActivityStart = true;
    vm.isStartAndStopRequestFromThisTab = false;
    vm.AssyActivityStartedBy = 1;
    // Check if user is admin or executive
    vm.loginUser = BaseService.loginUser;
    vm.transactionType = TRANSACTION.StartStopActivityTransactionType;
    vm.actionType = TRANSACTION.StartStopActivityActionType;
    vm.loginUserId = vm.loginUser.userid;
    // go back to rfq list
    vm.goBack = () => {
      $state.go(RFQTRANSACTION.RFQ_RFQ_STATE);
    };

    active();

    function active() {
      getRoHSList();
      getCustomerList();
    }

    // get RoHS List
    function getRoHSList() {
      return MasterFactory.getRohsList().query().$promise.then((requirement) => {
        vm.RohsList = requirement.data;
        getAssyDetails();
      }).catch((error) => BaseService.getErrorLog(error));
    }

    // get Component Internal Version
    function getComponentInternalVersion() {
      if (vm.bom && vm.bom.partID) {
        MasterFactory.getComponentInternalVersion().query({ id: vm.bom.partID }).$promise.then((requirement) => {
          if (requirement && requirement.data) {
            vm.bom.liveInternalVersion = requirement.data.liveVersion;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    function getCustomerList() {
      return MasterFactory.getCustomerByEmployeeID().query().$promise.then((customer) => {
        if (customer && customer.data) {
          vm.CustomerList = customer.data;
        }
        return vm.CustomerList;
      }).catch((error) => BaseService.getErrorLog(error));
    }
    function getAssyDetails() {
      if ($state.params.id) {
        return BOMFactory.getAssyDetails().query({ id: $state.params.id }).$promise.then((response) => {
          if (response && response.data) {
            const rfqAssy = vm.rfqAssyDetail = response.data;
            vm.currentTimerCositngDiff = '';
            vm.CostingActivityStart = rfqAssy.isActivityStart ? rfqAssy.isActivityStart : false;
            vm.CostingActivityStartedBy = rfqAssy.activityStartBy ? rfqAssy.activityStartBy : 1;
            if (rfqAssy.user) {
              vm.CostingActivityStartedByUserName = rfqAssy.user.firstName + ' ' + rfqAssy.user.lastName;
            }
            vm.CostingActivityStartedAt = rfqAssy.activityStartAt;
            if (rfqAssy.TotalConsumptionTime >= 0) {
              vm.stopCostingTimer(rfqAssy);
              vm.startCostingTimer(rfqAssy);
            }
            var bomImportParam = '({id: ' + $state.params.id + ', partId: ' + rfqAssy.partID + '})';
            var quoteParam = '({id: ' + $state.params.id + ', pageType: "' + vm.quotePageType.QUOTE.Name + '"})';
            var quotePreviewParam = '({id: ' + $state.params.id + ', pageType: "' + vm.quotePageType.PREVIEW_QUOTE.Name + '"})';
            vm.tabList = [
              { id: 0, title: RFQTRANSACTION.RFQ_IMPORT_BOM_LABEL, src: RFQTRANSACTION.RFQ_IMPORT_BOM_STATE + bomImportParam, viewsrc: 'importbom', isDisabled: false },
              { id: 1, title: RFQTRANSACTION.RFQ_PLANNED_BOM_LABEL, src: RFQTRANSACTION.RFQ_PLANNED_BOM_STATE + strParam, viewsrc: 'plannedbom', isDisabled: true },
              { id: 2, title: RFQTRANSACTION.RFQ_PART_COSTING_LABEL, src: RFQTRANSACTION.RFQ_PART_COSTING_STATE + strParam, viewsrc: 'partcosting', isDisabled: true },
              { id: 3, title: RFQTRANSACTION.RFQ_LABOR_LABEL, src: RFQTRANSACTION.RFQ_LABOR_STATE + bomImportParam, viewsrc: 'labor', isDisabled: true },
              //{ id: 4, title: RFQTRANSACTION.RFQ_SUMMARY_LABEL, src: RFQTRANSACTION.RFQ_SUMMARY_STATE + strParam, viewsrc: 'summary', isDisabled: false },
              { id: 4, title: RFQTRANSACTION.RFQ_SUMMARY2_LABEL, src: RFQTRANSACTION.RFQ_SUMMARY2_STATE + strParam, viewsrc: 'summary2', isDisabled: false },
              { id: 5, title: RFQTRANSACTION.RFQ_QUOTE_PREVIEW_LABEL, src: RFQTRANSACTION.RFQ_QUOTE_STATE + quotePreviewParam, viewsrc: 'previewquote', isDisabled: false },
              { id: 6, title: RFQTRANSACTION.RFQ_QUOTE_LABEL, src: RFQTRANSACTION.RFQ_QUOTE_STATE + quoteParam, viewsrc: 'quote', isDisabled: false },
              { id: 7, title: RFQTRANSACTION.RFQ_DOCUMENT_LABEL, src: RFQTRANSACTION.RFQ_DOCUMENT_STATE + strParam, viewsrc: 'document', isDisabled: false }
            ];
            if (rfqAssy.rfqForms) {
              vm.bom.quoteindate = rfqAssy.quoteInDate;
              vm.bom.rfqNo = rfqAssy.rfqForms.id;
              vm.customerID = rfqAssy.rfqForms.customerId;
              vm.bom = {
                mfgPNDescription: rfqAssy.componentAssembly != null ? rfqAssy.componentAssembly.mfgPNDescription : '',
                mfgPN: rfqAssy.componentAssembly != null ? rfqAssy.componentAssembly.mfgPN : '',
                rev: rfqAssy.componentAssembly != null ? rfqAssy.componentAssembly.rev : '',
                assyCode: rfqAssy.componentAssembly != null ? rfqAssy.componentAssembly.assyCode : '',
                nickName: rfqAssy.componentAssembly != null ? rfqAssy.componentAssembly.nickname : '',
                PIDCode: rfqAssy.componentAssembly != null ? rfqAssy.componentAssembly.PIDCode : '',
                RoHSStatusID: rfqAssy.componentAssembly != null ? rfqAssy.componentAssembly.RoHSStatusID : null,
                partID: rfqAssy.componentAssembly != null ? rfqAssy.componentAssembly.id : null,
                reqAssyID: rfqAssy.id,
                status: rfqAssy.status,
                isBOMVerified: rfqAssy.isBOMVerified,
                isReadyForPricing: rfqAssy.isReadyForPricing,
                isSummaryComplete: rfqAssy.isSummaryComplete,
                //liveInternalVersion: rfqAssy.componentAssembly != null ? rfqAssy.componentAssembly.liveInternalVersion : null,
                RoHSStatusIcon: CORE.WEB_URL + USER.ROHS_BASE_PATH + 'rohs.jpg',
                quoteFinalStatus: rfqAssy.quoteFinalStatus || null,
                partCostingBOMInternalVersion: rfqAssy.partCostingBOMInternalVersion
              };
              if (rfqAssy.rfqForms.customer) {
                vm.bom.companyName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, rfqAssy.rfqForms.customer.mfgCode, rfqAssy.rfqForms.customer.mfgName); //rfqAssy.rfqForms.customer.companyName;
                if (rfqAssy.rfqForms.customer.employeeMFGMapping.length > 0) {
                  vm.isCustomerAccess = true;
                } else {
                  if (vm.CustomerList.length > 0) {
                    const CustomerObj = _.find(vm.CustomerList, (custObj) => custObj.id == vm.customerID);
                    if (CustomerObj) {
                      vm.isCustomerAccess = true;
                    } else {
                      vm.isCustomerAccess = false;
                    }
                  }
                }
              }

              vm.quoteparam = null;
              if (rfqAssy.rfqAssyQuoteSubmitted && rfqAssy.rfqAssyQuoteSubmitted.length > 0) {
                var rfqAssyQuoteSubmitted = _.orderBy(rfqAssy.rfqAssyQuoteSubmitted, 'id', 'desc');
                vm.bom.quoteSubmittedID = rfqAssyQuoteSubmitted[0].id;
              }

              if (vm.bom.RoHSStatusID != null) {
                var rohsStatus = _.find(vm.RohsList, { id: vm.bom.RoHSStatusID });
                if (rohsStatus && rohsStatus.rohsIcon) {
                  vm.bom.RoHSStatusIcon = CORE.WEB_URL + USER.ROHS_BASE_PATH + rohsStatus.rohsIcon;
                  vm.bom.RoHSName = rohsStatus.name;
                }
              }
              if (vm.bom.isBOMVerified) {
                vm.tabList[1].isDisabled = false;
              }

              if (vm.bom.isReadyForPricing) {
                vm.tabList[2].isDisabled = false;
                vm.tabList[3].isDisabled = false;
                vm.tabList[4].isDisabled = false;
                //vm.tabList[5].isDisabled = false;
              }

              if (rfqAssy.rfqForms) {
                vm.bom.quoteindate = rfqAssy.quoteInDate;
                vm.bom.rfqNo = rfqAssy.rfqForms.id;
                vm.customerID = rfqAssy.rfqForms.customerId;
                if (rfqAssy.rfqForms.customer) {
                  vm.bom.companyName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, rfqAssy.rfqForms.customer.mfgCode, rfqAssy.rfqForms.customer.mfgName); //rfqAssy.rfqForms.customer.companyName;
                }
              }

              $timeout(() => {
                $scope.$broadcast('isCustomerAccess', vm.isCustomerAccess);
                $scope.$applyAsync();
                getBOMProgress();
                getComponentInternalVersion();
                var item = $filter('filter')(vm.tabList, { src: $state.current.name + strParam }, true);
                if (item[0]) {
                  vm.activeTab = item[0].id;
                  vm.title = item[0].title;
                }
                else if ($state.current.name == RFQTRANSACTION.RFQ_IMPORT_BOM_STATE) {
                  vm.activeTab = 0;
                  vm.title = vm.tabList[0].title;
                } else {
                  vm.activeTab = 3;
                  vm.title = vm.tabList[3].title;
                }
              });
            }
            vm.CostingActivityStart = rfqAssy.isActivityStart != null ? rfqAssy.isActivityStart : false;
            vm.CostingActivityStartedBy = rfqAssy.activityStartBy != null ? rfqAssy.activityStartBy : 1;
            if (rfqAssy.user) {
              vm.CostingActivityStartedByUserName = rfqAssy.user.firstName + ' ' + rfqAssy.user.lastName;
            }
            vm.CostingActivityStartedAt = rfqAssy.activityStartAt;
            if (rfqAssy.TotalConsumptionTime >= 0) {
              vm.stopCostingTimer(rfqAssy);
              vm.startCostingTimer(rfqAssy);
            }
            vm.isCostingReadOnly = true;
            if (vm.AssyActivityStart && vm.loginUserId == vm.CostingActivityStartedBy) {
              vm.isCostingReadOnly = false;
            }
          }
        });
      }
    }

    function getBOMProgress() {
      return BOMFactory.getBOMProgress().query({ id: vm.bom.partID }).$promise.then((response) => {
        if (response && response.data) {
          vm.bomProgress = response.data[0].pProgress;
        }
      });
    }

    /* open popup for activity log*/
    vm.cositngActivityLog = (ev) => {
      var data = {
        rfqAssyID: parseInt(vm.assyid),
        transactionType: vm.transactionType[1].id
      };
      DialogFactory.dialogService(
        RFQTRANSACTION.BOM_ACTIVITY_HISTORY_POPUP_CONTROLLER,
        RFQTRANSACTION.BOM_ACTIVITY_HISTORY_POPUP_VIEW,
        ev,
        data).then(() => {
          //sucess
        }, (err) => BaseService.getErrorLog(err));
    };
    // on tab changes set title for selected tab
    var lastActiveTab = null;
    vm.onTabChanges = (item) => {
      //  -------------- restrict tab change if BOM is changed ------------------ code is not working so commented
      //if (lastActiveTab == 0 && BOMFactory.isBOMChanged) {
      //    var model = {
      //        title: RFQTRANSACTION.BOM.BOM_CHANGED,
      //        textContent: RFQTRANSACTION.BOM.BOM_CHANGED_TEXT,
      //        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
      //        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      //    };
      //    DialogFactory.confirmDiolog(model).then(() => {
      //        lastActiveTab = item.id;
      //        vm.activeTab = item.id;
      //    }, () => {
      //        vm.activeTab = 0;
      //    });
      //    vm.activeTab = 0;
      //}
      //else {
      //    lastActiveTab = item.id;
      //    vm.title = item.title;
      //}

      vm.title = item.title;
      vm.PriceType = RFQTRANSACTION.PRICE_FILTER.GetRFQConsolidateRfqLineItem.ID;
      $scope.$emit(RFQTRANSACTION.EVENT_NAME.UpdateBOMIcon);
    };
    // re calculate price for existing detail
    vm.recalculatePrice = (event) => {
      $scope.$broadcast(RFQTRANSACTION.EVENT_NAME.RecalculateLogic, event);
    };

    // verify digikey
    vm.verfiyDigikey = (ev) => {
      vm.openDigikeyPopup = true;
      MasterFactory.getSelectedGlobalSettingKeyValues().query({ allKeys: [CONFIGURATION.SETTING.DKVersion] }).$promise.then((response) => {
        if (response.data) {
          _.each(response.data, (item) => {
            switch (item.key) {
              case CONFIGURATION.SETTING.DKVersion:
                _DkVersion = item.values;
                break;
            }
          });
          var data = {
            appID: _DkVersion == CORE.DKVersion.DKV2 ? PRICING.APP_DK_TYPE.FJT : PRICING.APP_DK_TYPE.FJTV3,
            isNewVersion: _DkVersion == CORE.DKVersion.DKV2 ? false : true
          };
          DialogFactory.dialogService(
            CORE.DIGIKEY_VERIFICATION_MODAL_CONTROLLER,
            CORE.DIGIKEY_VERIFICATION_MODAL_VIEW,
            ev,
            data).then(() => {
              vm.openDigikeyPopup = false;
            }, () => {
              vm.openDigikeyPopup = false;
            }, () => {
              vm.openDigikeyPopup = false;
            });
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // [S] Socket Listeners
    function connectSocket() {
      socketConnectionService.on(PRICING.EventName.AskDigiKeyAuthentication, askForDigikeyAuthentication);
      socketConnectionService.on(PRICING.EventName.sendSubmittedQuote, sendSubmittedQuote);
      socketConnectionService.on(PRICING.EventName.revisedQuote, revisedQuote);
      socketConnectionService.on(PRICING.EventName.sendCostingStartStopActivity, startStopCostingActivityListener);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener(PRICING.EventName.AskDigiKeyAuthentication, askForDigikeyAuthentication);
      socketConnectionService.removeListener(PRICING.EventName.sendSubmittedQuote, sendSubmittedQuote);
      socketConnectionService.removeListener(PRICING.EventName.revisedQuote, revisedQuote);
      socketConnectionService.removeListener(PRICING.EventName.sendCostingStartStopActivity, startStopCostingActivityListener);
    }


    // on disconnect socket.io
    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });

    function askForDigikeyAuthentication(message) {
      if (!vm.openDigikeyPopup && message.AssyID == vm.assyid) {
        $timeout(askForDigikeyVerification(message));
      }
    }
    function askForDigikeyVerification() {
      const event = angular.element.Event('click');
      angular.element('body').trigger(event);
      vm.verfiyDigikey(event);
    }
    // method to update pricing status loader
    const updateStatus = $scope.$on(PRICING.EventName.UpdateStatus, (name, data) => {
      if (data) {
        vm.status = data.status;
        if (data.status != vm.PRICING_STATUS.SendRequest) {
          vm.assyLoading = false;
          if (data.remainTime && data.remainTime.length > 0) {
            vm.remainTime = seconds_to_days_hours_mins_secs_str(data.remainTime[0].remainTime);
          }
        } else {
          vm.assyLoading = true;
          vm.disabledSubmit = true;
        }
      }
    });
    const isBOMVerified = $scope.$on('isBOMVerified', (event, data) => {
      vm.tabList[1].isDisabled = (data == false);
      $scope.$applyAsync();
    });

    const isSummaryNotAttributes = $scope.$on(RFQTRANSACTION.EVENT_NAME.isSummaryNotAttributes, (event, data) => {
      if (vm.bom) {
        vm.bom.isSummaryNotAttributes = data.isSummaryNotAttributes;
        vm.bom.isSubmitDisable = data.isSubmitDisable;
      }
      $scope.$applyAsync();
    });
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
        return DialogFactory.messageAlertDialog(alertModel).then(() => {
          isopen = false;
          getAssyDetails();
        });
      }
    }

    // [S] Socket Listeners for Costing activity
    function startStopCostingActivityListener(message) {
      if (message && message.rfqAssyID == vm.assyid && !vm.isStartAndStopRequestFromThisTab) {//&& vm.loginUserId != message.loginUserId
        vm.isStartAndStopRequestFromThisTab = false;
        startStopCostingActivityReceive(message, false);
      } else {
        getAssyDetails();
      }
    }

    const isPricingStop = $scope.$on(PRICING.EventName.Costing_Button_EnableDisable, (event, data) => {
      vm.assyLoading = false;
    });
    vm.isChange = false;

    function sendSubmittedQuote(data) {
      if (data.assyID == $state.params.id) {
        if (vm.bom) {
          vm.bom.quoteSubmittedID = data.quoteID;
        }
        vm.quoteparam = '({id: ' + $state.params.id + ', quqoteSubmittedID: ' + data.quoteID + '})';
        var customID = _.clone(vm.customerID);
        vm.customerID = null;
        vm.customerID = customID;
        vm.bom.isSummaryComplete = true;
        $scope.$applyAsync();
      }
    }
    function revisedQuote(assyid) {
      if (assyid == $state.params.id) {
        vm.bom.isSummaryComplete = false;
        vm.clickSubmit = false;
        $scope.$applyAsync();
      }
    }
    const updateTime = $scope.$on(PRICING.EventName.updateExpectedTimePrice, (event, data) => {
      if (data && data.remainTime && data.remainTime.length > 0) {
        vm.remainTime = seconds_to_days_hours_mins_secs_str(data.remainTime[0].remainTime);
      }
    });
    const isReadyForPricing = $scope.$on('isReadyForPricing', (event, data) => {
      vm.tabList[2].isDisabled = (data == false);
      vm.tabList[3].isDisabled = vm.tabList[1].isDisabled || vm.tabList[2].isDisabled;
      $scope.$applyAsync();
    });

    const OpenPriceSelector = $scope.$on(RFQTRANSACTION.EVENT_NAME.OpenPriceSelector, (event, data) => {
      vm.row = data;
      vm.ispriceSelectorSideNavOpen = true;
      $scope.$applyAsync();
    });

    const ClosePriceSelector = $scope.$on(RFQTRANSACTION.EVENT_NAME.ClosePriceSelector, (event, data) => {
      vm.ispriceSelectorSideNavOpen = false;
      $scope.$applyAsync();
    });

    const ShowSummary = $scope.$on(RFQTRANSACTION.EVENT_NAME.ShowSummary, (event, data) => {
      vm.isShowSummary = data ? data.summary : data;
      vm.noParts = data.totalItems.length > 0 ? false : true;
      $scope.$applyAsync();
    });
    const HideSummarySave = $scope.$on(RFQTRANSACTION.EVENT_NAME.HideSummarySave, (event, data) => {
      vm.isShowSummarySave = data;
      $scope.$applyAsync();
    });

    const UpdateInternalVersion = $scope.$on(RFQTRANSACTION.EVENT_NAME.UpdateInternalVersion, (event, data) => {
      if (vm.bom && vm.bom.partID) {
        getComponentInternalVersion();
      }
      getBOMProgress();
      $scope.$applyAsync();
    });

    // on move to other controller destory all event
    $scope.$on('$destroy', () => {
      // Remove socket listeners
      removeSocketListener();
      updateStatus();
      isBOMVerified();
      isReadyForPricing();
      OpenPriceSelector();
      ClosePriceSelector();
      ShowSummary();
      HideSummarySave();
      UpdateInternalVersion();
      isSummaryNotAttributes();
      isPricingStop();
      updateTime();
      //SummarySubmittedID();
    });
    // [E] Socket Listeners

    // Update all linitem pricing
    vm.UpdateAllPricing = (ev) => {
      $scope.$broadcast(PRICING.EventName.UpdateAllPricing, ev);
    };
    //show packaging  or not
    vm.showPackaging = (packaging) => {
      $scope.$broadcast(RFQTRANSACTION.EVENT_NAME.Packaging, packaging);
    };
    //clear all pricing
    vm.clearAllPricing = (ev) => {
      $scope.$broadcast(PRICING.EventName.ClearPricing, ev);
    };
    // go to review pricing page
    vm.ReviewPricing = () => {
      $state.go(RFQTRANSACTION.RFQ_REVIEW_PRICING_STATE);
    };

    $scope.$on(PRICING.EventName.ChangeClickSubmitStatus, () => {
      vm.clickSubmit = false;
      vm.clickedSubmit = false;
    });

    //save summary tab price for all for summary tab
    vm.submitPricingAll = (ev, isfinal) => {
      if (isfinal && !vm.clickSubmit) {
        vm.clickSubmit = true;
        $scope.$broadcast(PRICING.EventName.SaveSummaryTab, isfinal);
        vm.clickedSubmit = true;
      }
      else if (!isfinal) {
        $scope.$broadcast(PRICING.EventName.SaveSummaryTab, isfinal);
        vm.clickedSubmit = true;
      }
    };
    //draft save  history of pricing
    vm.saveDraftPricing = (ev) => {
      $scope.$broadcast(RFQTRANSACTION.EVENT_NAME.DraftSave, ev);
    };

    vm.pushQuoteToPartMaster = () => {
      const obj = {
        messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.PUSH_QUOTE_TO_PART_MASTER_CONFIRMATION,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };

      DialogFactory.messageConfirmDialog(obj).then(() => {
        const searchObj = {
          partId: vm.bom.partID,
          rfqQuoteNumber: vm.rfqAssyDetail.quoteNumber,
          isPushToPartMaster: true,
          proceedOverriderQuote: false,
          isCallFromPartMaster: false
        };

        vm.cgBusyLoading = ComponentPriceBreakDetailsFactory.getSalesCommissionDetailsFromRfq().query(searchObj).$promise.then(() => { });
      }, () => {
        // cancel
      });
    };

    /* open popup for add-edit Rawdatacategory */
    vm.openAdditionalComment = (ev) => {
      var data = {
        rfqAssyID: $state.params.id
      };
      DialogFactory.dialogService(
        RFQTRANSACTION.RFQ_LINEITEMS_DESCRIPTION_CONTROLLER,
        RFQTRANSACTION.RFQ_LINEITEMS_DESCRIPTION_VIEW,
        ev,
        data).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };
    //open quote attribute popup
    vm.assQuoteAttributes = (ev) => {
      if (BOMFactory.isBOMChanged && vm.activeTab == 4) {
        var model = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_BODY_MESSAGE_SUMMARY,
          multiple: true
        };
        DialogFactory.alertDialog(model);
      }
      else {
        openQuoteAttribute(ev);
      }
    };

    function openQuoteAttribute(ev) {
      var data = {};
      DialogFactory.dialogService(
        CORE.MANAGE_QUOTE_DYNAMIC_FIELDS_MODAL_CONTROLLER,
        CORE.MANAGE_QUOTE_DYNAMIC_FIELDS_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (data) => {
          if (data) {
            BaseService.currentPageFlagForm = [true];
            BOMFactory.isBOMChanged = true;
            $scope.$broadcast('quoteAddAttribute');
          }
        }, () => { });
    }

    //export summary boardcast call
    vm.exportSummary = (ev) => {
      $scope.$broadcast(PRICING.EventName.ExportSummary, ev);
    };

    /* fun to check form dirty on tab change */
    vm.isStepValid = function (step) {
      var isDirty = BOMFactory.isBOMChanged;
      if (isDirty) {
        return showWithoutSavingAlertforTabChange(step);
      } else {
        BOMFactory.bomSelectedFilter = null;
        return true;
      }
    };

    /* Show save alert popup when performing tab change*/
    function showWithoutSavingAlertforTabChange() {
      var messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messgaeContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then(() => {
        BOMFactory.isBOMChanged = false;
        BOMFactory.bomSelectedFilter = null;
        BaseService.currentPageFlagForm = [];
        return true;
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    }

    /* Open popup for display history of entry change */
    vm.rfqShowHistory = ($event) => {
      var data = {
        partID: vm.bom.partID,
        assemblyNumber: vm.bom.PIDCode,
        assemblyRev: vm.bom.assemblyRev,
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
    };

    /* Open popup for display history of narrative */
    vm.showNarrativeHistory = ($event) => {
      var data = {
        partID: vm.bom.partID,
        assemblyNumber: vm.bom.PIDCode,
        assemblyRev: vm.bom.assemblyRev,
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
    };


    /* open popup for Assembly at Glance */
    vm.getAssemblyAtGlance = (ev) => {
      const obj = vm.bom;
      obj.Customer = vm.bom.companyName;
      DialogFactory.dialogService(
        RFQTRANSACTION.ASSEMBLY_AT_GLANCE_CONTROLLER,
        RFQTRANSACTION.ASSEMBLY_AT_GLANCE_VIEW,
        ev,
        obj).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    /* Start Costing Activity */
    vm.startCostingActivity = (isActivityStart) => {
      if (BOMFactory.isBOMChanged) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.WITHOUT_SAVING_ALERT_BODY_MESSAGE_ACTIVITY);
        messageContent.message = stringFormat(messageContent.message, isActivityStart ? 'start' : 'stop');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        return DialogFactory.messageConfirmDialog(obj).then(() => {
          vm.CheckSuperAdminPosibility(isActivityStart);
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.CheckSuperAdminPosibility(isActivityStart);
      }
    };

    vm.CheckSuperAdminPosibility = (isActivityStart) => {
      if (!isActivityStart && vm.loginUserId != vm.CostingActivityStartedBy && vm.loginUser.isUserSuperAdmin) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.COSTING_STOP_BY_SA_FROM_RFQ_LIST_MESSAGE);
        let message = '<br/><br/><table style=\'width:100%\'><thead><tr><th class=\'border-bottom padding-5\'>#</th><th class=\'border-bottom padding-5\'>' + vm.LabelConstant.Assembly.PIDCode + '</th><th class=\'border-bottom padding-5\'>Activity Started By</th></tr></thead><tbody>{0}</tbody></table>';
        const subMessage = '<tr><td class="border-bottom padding-5">1 </td><td class="border-bottom padding-5">' + vm.bom.PIDCode + '</td><td class="border-bottom padding-5">' + vm.CostingActivityStartedByUserName + '</td></tr>';
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

    vm.startStopUpdate = (isActivityStart) => {
      var data = {
        refTransID: parseInt(vm.assyid),
        isActivityStart: isActivityStart,
        transactionType: vm.transactionType[1].id,
        actionType: vm.actionType[0].id
      };
      vm.isStartAndStopRequestFromThisTab = true;
      vm.cgBusyLoading = BOMFactory.startStopCostingActivity().save(data).$promise.then(() => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Start Costing Timer after checkin start */
    vm.startCostingTimer = (rfqAssyDetail) => {
      vm.currentTimerCositngDiff = '';
      vm.tickCostingActivity = setInterval(() => {
        rfqAssyDetail.TotalConsumptionTime = rfqAssyDetail.TotalConsumptionTime + 1;
        vm.currentTimerCositngDiff = secondsToTime(rfqAssyDetail.TotalConsumptionTime, true);
      }, _configSecondTimeout);
    };

    /* Stop Timer after stop Costing activity */
    vm.stopCostingTimer = () => {
      vm.currentTimerCositngDiff = '';
      clearInterval(vm.tickCostingActivity);
    };

    //copy Assembly on click
    vm.copyPIDCode = (item) => {
      var copytext = item;
      var $temp = $('<input>');
      $('body').append($temp);
      $temp.val(copytext).select();
      document.execCommand('copy');
      $temp.remove();
      vm.showstatus = true;
    };

    //copy Assembly on click
    vm.copyAssyPN = (item) => {
      var copytext = item;
      var $temp = $('<input>');
      $('body').append($temp);
      $temp.val(copytext).select();
      document.execCommand('copy');
      $temp.remove();
      vm.showstatus = true;
    };
    //remove copied status on hover
    vm.checkStatus = () => {
      vm.showstatus = false;
    };
  }
})();
