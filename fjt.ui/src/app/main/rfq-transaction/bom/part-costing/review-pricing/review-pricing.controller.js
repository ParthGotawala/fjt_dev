(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('ReviewPricingController', ReviewPricingController);

  /** @ngInject */
  function ReviewPricingController($filter, $state, $scope, $timeout, $stateParams, $mdSidenav, RFQTRANSACTION, BOMFactory, PartCostingFactory,
    DialogFactory, NotificationFactory, CORE, $mdDialog, PRICING, BaseService, uiGridGroupingConstants, socketConnectionService) {

    const vm = this;
    vm.isshowImportExport = false;
    vm.assyLoading = false;
    vm.status = null;
    vm.PRICING_STATUS = PRICING.PRICING_STATUS;
    vm.bom = {};
    active();
    vm.NotQuotedState = RFQTRANSACTION.RFQ_NOTQUOTED_PRICING_STATE;
    vm.ReviewPricingState = RFQTRANSACTION.RFQ_REVIEW_PRICING_STATE;
    vm.CustomRulesState = RFQTRANSACTION.RFQ_RULES_PRICING_STATE;
    vm.currentState = $state.current.name;
    vm.DateTimeFormat = _dateDisplayFormat;

    vm.goBack = () => {
      $state.go(RFQTRANSACTION.RFQ_PART_COSTING_STATE, { id: $stateParams.id });
    }

    function active() {
      getAssyBOMDetails();
    }
    function getAssyBOMDetails() {
      return BOMFactory.getAssyDetails().query({ id: $stateParams.id }).$promise.then((response) => {
        if (response && response.data) {
          var rfqAssy = response.data;
          vm.bom = {
            assemblyName: rfqAssy.assemblyName,
            assemblyNumber: rfqAssy.assemblyNumber,
            assemblyRev: rfqAssy.assemblyRev,
            assemblyDescription: rfqAssy.assemblyDescription,
            reqAssyID: rfqAssy.id,
            status: rfqAssy.status,
            isBOMVerified: rfqAssy.isBOMVerified,
            isReadyForPricing: rfqAssy.isReadyForPricing,
            isSummaryComplete: rfqAssy.isSummaryComplete,
          };

          if (rfqAssy.rfqForms) {
            vm.bom.quoteindate = rfqAssy.rfqForms.quoteindate;
            vm.bom.rfqNo = rfqAssy.rfqForms.id;
            if (rfqAssy.rfqForms.customer) {
              vm.bom.companyName = rfqAssy.rfqForms.customer.companyName;
            }
          }
        }
      })
    }
    vm.menus = PRICING.REVIEW_PRICING;
    vm.isShowSideNav = true;
    // hide/show side nav bar
    vm.HideShowSideNav = (componentId) => {
      $mdSidenav(componentId).toggle();
      vm.isShowSideNav = !vm.isShowSideNav;
    };

    //route
    vm.getActiveNavigation = (item) => {
      if (item && item.route) {
        vm.currentState = item.route;
        $state.go(item.route);
      }
      switch (vm.currentState) {
        case RFQTRANSACTION.RFQ_REVIEW_PRICING_STATE:
          vm.selectedNavItem = vm.menus[0].name;
          break;

        case RFQTRANSACTION.RFQ_NOTQUOTED_PRICING_STATE:
          vm.selectedNavItem = vm.menus[0].name;
          break;

        case RFQTRANSACTION.RFQ_RULES_PRICING_STATE:
          vm.selectedNavItem = vm.menus[1].name;
          break;

        case RFQTRANSACTION.RFQ_EXCESS_PRICING_STATE:
          vm.selectedNavItem = vm.menus[2].name;
          break;

        case RFQTRANSACTION.RFQ_ATRISK_PRICING_STATE:
          vm.selectedNavItem = vm.menus[3].name;
          break;

        case RFQTRANSACTION.RFQ_LEADTIME_PRICING_STATE:
          vm.selectedNavItem = vm.menus[4].name;
          break;

        case RFQTRANSACTION.RFQ_ALTERNATIVE_PRICING_STATE:
          vm.selectedNavItem = vm.menus[5].name;
          break;

        default:
          vm.selectedNavItem = vm.menus[0].name;
      }

    }

    vm.getActiveNavigation();
    // Open Price Selector from details section of grid data
    let openPriceSelector = $scope.$on(RFQTRANSACTION.EVENT_NAME.OpenPriceSelector, (event, data) => {
      vm.row = data;
      vm.ispriceSelectorSideNavOpen = true;
      $scope.$applyAsync();
    });

    // Close Price Selector on click of outside popup
    let closePriceSelector = $scope.$on(RFQTRANSACTION.EVENT_NAME.ClosePriceSelector, (event, data) => {
      vm.ispriceSelectorSideNavOpen = false;
      $scope.$applyAsync();
    });

    // hide/show import export buttons event called from not quoted price filter page
    let hideImportExport = $scope.$on(RFQTRANSACTION.EVENT_NAME.HideImportExport, (event, data) => {
      vm.isshowImportExport = data;
      $scope.$applyAsync();
    });

    // [S] Socket Listeners
    function connectSocket() {
      socketConnectionService.on(PRICING.EventName.AskDigiKeyAuthentication, askForDigikeyAuthentication);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener(PRICING.EventName.AskDigiKeyAuthentication, askForDigikeyAuthentication);
    }

    function askForDigikeyAuthentication(message) {
      if (!vm.openDigikeyPopup && message.userID == loginUser.userid) {
        $timeout(askForDigikeyVerification(message));
      }
    }
    function askForDigikeyVerification(message) {
      let event = angular.element.Event('click');
      angular.element('body').trigger(event);
      vm.verfiyDigikey(event);
    }

    // method to update pricing status loader
    let updateStatus = $scope.$on(PRICING.EventName.UpdateStatus, function (name, data) {
      if (data) {
        vm.status = data.status;
        if (data.status != vm.PRICING_STATUS.SendRequest) {
          vm.assyLoading = false;
        } else {
          vm.assyLoading = true;
        }
      }
    });


    // Update all lineitem pricing
    vm.UpdateAllPricing = (ev) => {
      $scope.$broadcast(PRICING.EventName.UpdateAllPricing, ev);
    }

    // stop all pricing request
    vm.StopAllPricing = (ev) => {
      vm.cgBusyLoading = PartCostingFactory.stopPricingRequests().query({
        pricingApiObj: {
          rfqAssyID: $state.params.id,
        }
      }).$promise.then((res) => {
        vm.assyLoading = false;
        NotificationFactory.somethingWrong(res.data.msg);
        $scope.$broadcast('refeshGrid');
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }


    //export document for pricing
    vm.exportPricing = (ev) => {
      $scope.$broadcast(RFQTRANSACTION.EVENT_NAME.ExportPricing, vm.bom.assemblyNumber);
    }
    //import document for pricing detail
    vm.importPricing = (ev) => {
      $scope.$broadcast(RFQTRANSACTION.EVENT_NAME.ImportPricing, ev);
    }

    // on move to other controller destory all event
    $scope.$on('$destroy', function () {
      // Remove socket listeners
      removeSocketListener();
      updateStatus();
      openPriceSelector();
      closePriceSelector();
      hideImportExport();
      $mdDialog.cancel();
    });

    // on disconnect socket.io
    socketConnectionService.on('disconnect', function () {
      removeSocketListener();
    });

  }
})();
