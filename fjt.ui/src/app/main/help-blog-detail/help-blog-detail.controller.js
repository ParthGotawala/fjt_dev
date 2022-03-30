(function () {
  'use strict';

  angular
    .module('app.helpblogdetail')
    .controller('HelpBlogDetailController', HelpBlogDetailController);

  /** @ngInject */
  function HelpBlogDetailController($state, HelpBlogDetailFactory, HelpBlogFactory, PageDetailFactory, HELP_BLOG_DETAIL, BaseService, $stateParams, CONFIGURATION, $scope, USER, $timeout) {
    const vm = this;
    vm.pageID = $stateParams.pageID;
    vm.isAllExpanded = false;
    vm.loginUser = BaseService.loginUser;
    vm.helpBlogState = HELP_BLOG_DETAIL.HELPBLOGDETAIL_STATE;
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    $scope.$on(USER.LoginUserPageListBroadcast, (event, data) => {
      vm.hasAccessHelpBlogManagePage = data.filter((a) => a.PageDetails !== null && a.PageDetails.pageRoute === CONFIGURATION.CONFIGURATION_HELPBLOG_STATE);
    });
    vm.selectedItemChange = (item) => {
      $state.go(vm.helpBlogState, { pageID: item.pageName.pageID });
    };

    /* get details of particular help page */
    const getHelpBlogPageDetail = () => {
      vm.cgBusyLoading = HelpBlogDetailFactory.getHelpBlogDetailByPageId().query({ pageID: vm.pageID }).$promise.then((res) => {
        if (res && res.data) {
          vm.title = res.data.title;
          vm.ID = res.data.id;
          vm.descriptionList = res.data.helpBlogDetail && res.data.helpBlogDetail.length > 0 ? res.data.helpBlogDetail : [];
          _.map(vm.descriptionList, (data) => data.lastModified = BaseService.getUIFormatedDateTime(data.updatedAt, vm.DefaultDateTimeFormat));
          vm.descriptionList = _.orderBy(vm.descriptionList, [(o) => o.displayOrder || ''], ['asc']);
          vm.copyDescriptionList = angular.copy(vm.descriptionList);
          vm.isAllExpanded = false;
          vm.setHBExpandCollapse();
          $timeout(() => {
            if (BaseService.loginUserPageList) {
              const isPage = _.find(BaseService.loginUserPageList, (data) => data.PageID === parseInt(res.data.pageID));
              if (isPage && isPage.PageDetails) {
                vm.MenuName = isPage.PageDetails.menuName;
              }
            }
          }, _configSecondTimeout);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Download help blog note individual */
    vm.downloadNote = (data) => {
      const obj = {
        helpBlogId: data.helpBlogId,
        helpBlogDetailID: data.Id,
        displayOrder: data.displayOrder,
        isFromPrint: false
      };
      if (obj) {
        vm.Download(obj);
      }
    };

  /* Download or Print common code */
    vm.Download = (obj) => {
      vm.cgBusyLoading = HelpBlogFactory.getHelpBlogTemplateDetails(obj).then((res) => {
        if (res && res.data) {
          if (res.data.byteLength > 0) {
            const blob = new Blob([res.data], {
              type: 'application/pdf'
            });
            const fileName = vm.title + (obj.displayOrder ? '-' + obj.displayOrder : '') + '.pdf';
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            if (obj.isFromPrint) {
              window.open(link);
            } else {
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


    /* Print feature */
    vm.printNote = (data) => {
      let selectedIDs = [];
      if (data) {
        const obj = {
          helpBlogId: data.helpBlogId,
          helpBlogDetailID: data.Id,
          isFromPrint: true
        };

        if (obj) {
          vm.Download(obj);
        }
      } else {
        vm.selectedRows = vm.descriptionList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((Item) => Item.Id);
        }
        if (selectedIDs && selectedIDs.length > 0) {
          const obj = {
            helpBlogId: vm.ID,
            helpBlogDetailID: selectedIDs,
            isFromPrint: true
          };
          vm.Download(obj);
        }
      }
    };


    /* get listof all pages */
    const getPageDetail = (obj) => {
      const searchObj = obj;
      searchObj.userID = vm.loginUser.userid;
      searchObj.roleID = vm.loginUser.defaultLoginRoleID;

      return vm.cgBusyLoading = HelpBlogFactory.getHelpBlogDetailList().query(searchObj).$promise.then((helpBlogDetails) => {
        if (helpBlogDetails && helpBlogDetails.data) {
          return helpBlogDetails.data;
        }
      }).catch((err) => BaseService.getErrorLog(err));
    };

    vm.initAutoComplete = () => {
      vm.autoCompleteHelpBlogdetail = {
        columnName: 'searchHeaderMenu',
        keyColumnName: 'pageID',
        keyColumnId: 'pageID',
        inputName: 'searchHeaderMenu',
        placeholderName: 'Page Name',
        isRequired: false,
        isAddnew: false,
        callbackFn: getPageDetail,
        onSelectCallbackFn: (item) => {
          if (item) {
            $timeout(() => {
              $scope.$broadcast(vm.autoCompleteHelpBlogdetail.inputName + "searchText", null);
            });

            vm.autoCompleteHelpBlogdetail.keyColumnId = null;
            if (item.pageID !== parseInt(vm.pageID)) {
              vm.goToHelpBlogPageDetail(item.pageID);
            }
            else {
              //to refresh
              getHelpBlogPageDetail();
            }
          }
        },
        onSearchFn: function (query) {
          const searchObj = {
            searchquery: query
          };
          return getPageDetail(searchObj);
        }
      };
    };

    const initHelpBlog = () => {
      getHelpBlogPageDetail();
      vm.initAutoComplete();
    };

    initHelpBlog();


    /* Redirect To Page */
    vm.redirectToPage = () => {
      const isPage = _.find(BaseService.loginUserPageList, (data) => data.PageID === parseInt(vm.pageID));
      if (isPage) {
        if (isPage.PageDetails && isPage.PageDetails.pageRoute) {
          if (isPage.PageDetails.paramDet) {
            BaseService.openInNew(isPage.PageDetails.pageRoute, eval(isPage.PageDetails.paramDet));
          }
          else {
            BaseService.openInNew(isPage.PageDetails.pageRoute);
          }
        }
        //if (isPage.PageDetails) { BaseService.openInNew(isPage.PageDetails.pageRoute); }
      }
    };

    /* Used to redirect to selected help blog page */
    vm.goToHelpBlogPageDetail = (id) => {
      $state.go(vm.helpBlogState, { pageID: id });
    };

    /* Used to redirect to edit help blog page */
    vm.gotoHelpBlog = () => {
      BaseService.goToHelpBlogDetail(vm.ID);
    };

    /* Hide/Show accordian*/
    vm.toggleHBOperation = (item) => {
      item.isShow = !item.isShow;
      _.some(vm.descriptionList, (item) => !item.isShow);
      const collapsAll = _.every(vm.descriptionList, (det) => (det.isShow));
      if (collapsAll) {
        vm.isAllExpanded = true;
      } else {
        vm.isAllExpanded = false;
      }
    };

    /* Search conent from notes */
    vm.searchPageName = (item) => {
      vm.helpBlogList = [];
      if (item) {
        const searchTxt = angular.copy(item).toLowerCase();
        const searchList = _.filter(vm.copyDescriptionList, (doc) =>
          (doc.description.replace(/<[^>]*>/g, '').toLowerCase().indexOf(searchTxt) !== -1)
        );
        vm.descriptionList = searchList;
      }
      else {
        vm.descriptionList = vm.copyDescriptionList;
      }
      const collapsAll = _.every(vm.descriptionList, (det) => (det.isShow));
      if (collapsAll) {
        vm.isAllExpanded = true;
      } else {
        vm.isAllExpanded = false;
      }
    };

    /* Refresh Content Search */
    vm.refreshSearch = () => { vm.clearSearch(); getHelpBlogPageDetail(); };

    /* Clear Content Search */
    vm.clearSearch = () => { vm.searchQuery = null; getHelpBlogPageDetail(); };

    /* Expand/collapse Feature */
    vm.setHBExpandCollapse = () => {
      vm.isAllExpanded = !vm.isAllExpanded;
      vm.descriptionList = _.each(vm.descriptionList, (item) => { item.isShow = vm.isAllExpanded; });
    };
  }
})();
