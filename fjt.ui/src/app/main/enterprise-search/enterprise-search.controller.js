(function () {
  'use strict';

  angular
    .module('app.enterprisesearch')
    .controller('EnterpriseSearchController', EnterpriseSearchController);

  /** @ngInject */
  function EnterpriseSearchController($scope, ENTERPRISE_SEARCH, CHAT, CORE, BaseService, EnterpriseSearchFactory, DialogFactory, $rootScope, $sce, $state, $stateParams) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.CORE_OR_CONDITIONS = CORE.CONDITIONS[1];
    vm.SupplierList = ENTERPRISE_SEARCH.SUPPLIER_NAME;
    vm.customprice = false;
    vm.tags = [];
    vm.typeWiseResponse = [];
    vm.searchList = [];
    vm.advanceSearch = false;
    vm.isDisplaySearchCriteria = false;
    vm.ENTERPRISE_ADVANCE_SEARCH_FORMULA_TOOLTIP_LABEL = CORE.ENTERPRISE_ADVANCE_SEARCH_FORMULA_TOOLTIP_LABEL;
    vm.ENTERPRISE_ADVANCE_SEARCH_FORMULA_TOOLTIP = CORE.ENTERPRISE_ADVANCE_SEARCH_FORMULA_TOOLTIP;
    vm.getAllResponse = {};

    vm.EmptyMesssage = ENTERPRISE_SEARCH.SEARCH_RESULT;
    vm.showAllType = true;
    vm.AnySearchCriteria = false;
    vm.pageRange = 16;
    vm.pagination = {
      pagesize: 10,
      pageindex: 1,
      type: 'Parts',
      startIndex: 1,
      endIndex: vm.pageRange,
      nextIndexing: vm.pageRange + 1,
      previousIndexing: 1,
      pageNumber: []
    };
    vm.searchCriteria = $stateParams.searchText ? decodeURIComponent($stateParams.searchText) : null;
    vm.resultCount = 0;
    vm.clearFilter = () => {
      vm.searchCriteria = null;
      vm.SearchModel = vm.advanceSearchFilterData = [];
      vm.AnySearchCriteria = false;
      vm.tags = [];
      vm.typeWiseResponse = [];
      vm.searchList = [];
      $state.transitionTo($state.$current, { searchText: '' }, { location: true, inherit: true, notify: false });
    };

    vm.clearTypeFilter = () => {
      vm.searchType = '';
      setFocus('searchTag');
    };

    //------------------------------------ Advance Search Popup ---------------------------------------
    vm.advanceSearchFilterData = [];
    vm.openAdvanceSerachPopup = () => {
      if (vm.searchCriteria !== null && vm.searchCriteria !== '') {
        vm.removeSearchCriteriaConfirmation();
      } else {
        vm.openAdvanceSerachPopupAfterConfirmation();
      }
    };

    //-------------------------- Close ----------------------------

    vm.openAdvanceSerachPopupAfterConfirmation = () => {
      vm.isDisplaySearchCriteria = false;
      DialogFactory.dialogService(
        ENTERPRISE_SEARCH.ENTERPRISE_ADVANCE_SEARCH_POPUP_CONTROLLER,
        ENTERPRISE_SEARCH.ENTERPRISE_ADVANCE_SEARCH_POPUP_VIEW,
        event,
        vm.advanceSearchFilterData)
        .then((response) => {
          vm.SearchModel = vm.advanceSearchFilterData = response || [];
          vm.pagination.pageindex = 1;
          vm.pagination.pagesize = 10;
          vm.searchCriteria = null;
          vm.pagination.type = null;
          vm.advanceSearch = vm.SearchModel.length > 0 ? true : false;
          vm.showAllType = true;
          retriveSearchList();
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.removeSearchCriteriaConfirmation = () => {
      const obj = {
        messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MAIN_SEARCH_REMOVED),
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };

      DialogFactory.messageConfirmDialog(obj).then((resposne) => {
        if (resposne) {
          vm.clearFilter();
          vm.openAdvanceSerachPopupAfterConfirmation();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //--------------------- Clear Advance Search ------------------
    vm.clearAdvanceSerachPopup = () => {
      vm.searchCriteria = null;
      vm.SearchModel = vm.advanceSearchFilterData = [];
      vm.AnySearchCriteria = false;
      vm.isDisplaySearchCriteria = false;
    };
    //-------------------------- End --------------------------------
    vm.removeAdvanceSerachGroup = (index) => {
      vm.advanceSearchFilterData.splice(index, 1);
      vm.SearchModel = vm.advanceSearchFilterData || [];
      if (vm.SearchModel.length > 0) {
        retriveSearchList();
      } else {
        vm.AnySearchCriteria = false;
        vm.isDisplaySearchCriteria = false;
      }
    };

    // ----------------------------------- [S] - Get Search Result base on parameter with pagination detail ------------------------------
    function retriveSearchList() {
      var params = {
        PageIndex: ((vm.pagination.pageindex - 1) * vm.pagination.pagesize),
        PageSize: vm.pagination.pagesize,
        SearchQuery: vm.searchCriteria,
        Type: vm.pagination.type,
        SearchModel: vm.SearchModel
      };
      vm.tags = [];
      vm.typeWiseResponse = [];
      vm.searchList = [];
      vm.AnySearchCriteria = (params.SearchQuery) || vm.advanceSearch ? true : false;
      if (params.SearchQuery) {
        params.SearchQuery = BaseService.validateEnterpriseSearchCriteria(params.SearchQuery);
        if (vm.showAllType) {
          vm.cgBusyLoading = EnterpriseSearchFactory.retriveAll().query(params).$promise.then((response) => {
            if (response) {
              if (response.isSuccess) {
                vm.getAllResponse = response.model;
                bindSearchListWithPagination(response.model);
              } else {
                BaseService.retriveSearchRecord(response.message);
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          vm.cgBusyLoading = EnterpriseSearchFactory.retriveTypeWise().query(params).$promise.then((response) => {
            if (response) {
              if (response.isSuccess) {
                bindSearchListWithPagination(response.model);
              } else {
                BaseService.retriveSearchRecord(response.message);
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      } else
        if (vm.advanceSearch) {
          if (vm.showAllType) {
            vm.cgBusyLoading = EnterpriseSearchFactory.retriveAdvanceSearch().query(params).$promise.then((response) => {
              if (response) {
                if (response.isSuccess) {
                  vm.isDisplaySearchCriteria = true;
                  vm.getAllResponse = response.model;
                  bindSearchListWithPagination(response.model);
                } else {
                  BaseService.retriveSearchRecord(response.message);
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            vm.cgBusyLoading = EnterpriseSearchFactory.retriveTypeWiseAdvanceSearch().query(params).$promise.then((response) => {
              if (response) {
                if (response.isSuccess) {
                  vm.isDisplaySearchCriteria = true;
                  bindSearchListWithPagination(response.model);
                } else {
                  BaseService.retriveSearchRecord(response.message);
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
    }
    // ----------------------------------- [E] - Get Search Result base on parameter with pagination detail ------------------------------

    // ------------ Retrive Search result on page load
    retriveSearchList();

    // ----------------------------------- [S] Bind List of Search Result/Bind Filter Tag list/Pagination ------------------------------
    function bindSearchListWithPagination(response) {
      vm.tags = vm.getAllResponse.aggregation.buckets;
      vm.typeWiseResponse = response.aggregation.buckets;
      vm.resultCount = 0;
      if (vm.tags.length > 0) {
        _.map(vm.tags, (item) => {
          item.selected = vm.pagination.type === item.typeID ? true : false;
          if (Array.isArray(response.aggregation.buckets) && response.aggregation.buckets.length > 0) {
            const currentTypeDet = response.aggregation.buckets.find((a) => a.key === item.key);
            if (currentTypeDet) {
              item.count = currentTypeDet.count;
            }
          } else if (vm.pagination.type === item.key) {
            item.count = 0;
          }
        });
      }
      if (vm.typeWiseResponse.length > 0) {
        _.map(vm.typeWiseResponse, (item) => {
          // When View all Type then we will count of all type result count as a single
          if (vm.showAllType) {
            vm.resultCount += item.count;
          }
        });
      }
      if ((!vm.showAllType) && vm.typeWiseResponse && vm.typeWiseResponse.length > 0) {
        vm.resultCount = vm.typeWiseResponse[0].count;
      }

      response.results.forEach((item) => {
        item.title = $sce.trustAsHtml(item.title);

        if ($rootScope.textAngularKeyCode) {
          const textAngularKeyCode = JSON.parse($rootScope.textAngularKeyCode);

          item.content = item.content.replace(new RegExp(textAngularKeyCode.textAngularAPIKeyCode, 'g'), textAngularKeyCode.FJTAPIUrl);
          item.content = item.content.replace(new RegExp(textAngularKeyCode.textAngularWebKeyCode, 'g'), textAngularKeyCode.FJTWebUrl);
          item.content = $sce.trustAsHtml(item.content);
        }
        else {
          item.title = $sce.trustAsHtml(item.title);
          item.content = $sce.trustAsHtml(item.content);
        }
      });
      vm.searchList = response.results;

      vm.pagination.startPosition = vm.searchList.length > 0 ? ((vm.pagination.pageindex - 1) * vm.pagination.pagesize) + 1 : 0;
      vm.pagination.endPosition = vm.searchList.length > 0 ? vm.pagination.startPosition + (response.results.length) - 1 : 0;

      vm.pageCount = Math.ceil(vm.resultCount / vm.pagination.pagesize);
      vm.calculatePages();
    }
    // ----------------------------------- [E] Bind List of Search Result/Bind Filter Tag list/Pagination ------------------------------

    // ----------------------------------- [S] Get Search result on press enter in Search TextBox ------------------------------
    vm.search = (event) => {
      if ((!event || event.keyCode === 13)) {
        $state.transitionTo($state.$current, { searchText: encodeURIComponent(vm.searchCriteria) }, { reload: true, location: true, inherit: true, notify: true });
      }
    };
    // ----------------------------------- [E] Get Search result on press enter in Search TextBox ------------------------------

    // ----------------------------------- [S] Get Search result on press enter in Search TextBox & Clear Filter of Chat Message ------------------------------
    vm.chatSearch = (event) => {
      if ((!event || event.keyCode === 13)) {
        const data = {
          chatsearch: vm.charSearchCriteria
        };

        DialogFactory.dialogService(
          CHAT.CHAT_CONTROLLER,
          CHAT.CHAT_VIEW,
          event,
          data).then(() => {
            vm.clearChatFilter();
          }, () => {
            vm.clearChatFilter();
          }, (error) => BaseService.getErrorLog(error));
        //$state.transitionTo($state.$current, { searchText: encodeURIComponent(vm.searchCriteria) }, { reload: true, location: true, inherit: true, notify: true });
      }
    };

    vm.clearChatFilter = () => {
      vm.charSearchCriteria = null;
      setFocus('chateSearchTxt');
    };
    // ----------------------------------- [E] Get Search result on press enter in Search TextBox & Clear Filter of Chat Message ------------------------------


    vm.getNumber = function (num) {
      return new Array(num);
    };

    // ----------------------------------- [S] Get Search result on Retrive all Type for (All Task or selected) ------------------------------
    vm.getAllType = function () {
      vm.showAllType = true;
      vm.pagination.type = null;
      retriveSearchList();
    };
    // ----------------------------------- [E] Get Search result on Reset Filter for (All Task or selected) ------------------------------

    // ----------------------------------- [S] Get Search result on  Reset Filte ------------------------------

    vm.resetFilters = function () {
      vm.showAllType = true;
      vm.pagination.type = null;
      vm.pagination.pagesize = 10;
      vm.pagination.pageindex = 1;
      vm.pagination.startIndex = 1;
      vm.pagination.endIndex = vm.pageRange;
      vm.pagination.nextIndexing = vm.pageRange + 1;
      vm.pagination.previousIndexing = 1;
    };
    // ----------------------------------- [E] Get Search result on Reset Filter ------------------------------

    // ----------------------------------- [E] Get Search result on press enter in Search TextBox ------------------------------
    vm.pageChange = function (page) {
      if (page && vm.pagination.pageindex !== page.pageNumber) {
        vm.pagination.pageindex = page.pageNumber;
        retriveSearchList();
      }
    };
    vm.nextPage = function (pageIndex) {
      if (vm.pagination.pageindex !== pageIndex) {
        vm.pagination.pageindex = pageIndex;
        retriveSearchList();
      }
    };
    vm.previousPage = function (pageIndex) {
      if (vm.pagination.pageindex !== pageIndex) {
        vm.pagination.pageindex = pageIndex;
        retriveSearchList();
      }
    };

    vm.toggleTagFilter = function (tagDetail) {
      vm.resetFilters();
      vm.pagination.type = tagDetail.typeID;
      vm.showAllType = false;
      retriveSearchList();
    };
    // ----------------------------------- [E] Get Search result on press enter in Search TextBox ------------------------------

    vm.calculatePages = function () {
      if (vm.pageCount > vm.pageRange) {
        if (vm.pagination.pageindex === vm.pagination.nextIndexing) {
          const diffPageRange = vm.pageCount - vm.pagination.endIndex;
          vm.pagination.startIndex = vm.pagination.nextIndexing;
          vm.pagination.endIndex = diffPageRange > vm.pageRange ? (vm.pagination.startIndex + (vm.pageRange - 1)) : vm.pageCount;

          vm.pagination.nextIndexing = vm.pagination.endIndex + 1;
          vm.pagination.previousIndexing = (vm.pagination.endIndex >= vm.pageRange) ? vm.pagination.startIndex - 1 : 1;
        }
        else if (vm.pagination.pageindex === vm.pagination.previousIndexing) {
          vm.pagination.endIndex = vm.pagination.startIndex === 1 ? vm.pagination.nextIndexing - 1 : vm.pagination.previousIndexing;
          vm.pagination.startIndex = (vm.pagination.endIndex - (vm.pageRange - 1)) > 0 ? vm.pagination.endIndex - (vm.pageRange - 1) : 1;

          vm.pagination.nextIndexing = vm.pagination.endIndex + 1;
          vm.pagination.previousIndexing = (vm.pagination.endIndex >= 1) ? vm.pagination.startIndex - 1 : 1;
        }
      }
      else {
        vm.pagination.endIndex = vm.pageCount;
      }
      vm.pagination.pageNumber = [];
      if (vm.pagination.startIndex > 1) {
        vm.pagination.pageNumber = [{
          isPreviousIndex: true,
          pageNumber: vm.pagination.previousIndexing,
          isNextIndexing: false
        }];
      }
      for (let i = vm.pagination.startIndex; i <= vm.pagination.endIndex; i++) {
        const pageDetail = {
          isPreviousIndex: false,
          pageNumber: i,
          isNextIndexing: false
        };
        vm.pagination.pageNumber.push(pageDetail);
      }
      if (vm.pageCount > vm.pageRange && vm.pageCount > vm.pagination.nextIndexing) {
        vm.pagination.pageNumber.push({
          isPreviousIndex: false,
          pageNumber: vm.pagination.nextIndexing,
          isNextIndexing: true
        });
      }
    };
  }
})();
