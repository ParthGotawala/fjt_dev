(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  /** @ngInject */
  function DashboardController($rootScope, $timeout, $filter, CORE, WIDGET, DialogFactory, BaseService, WidgetFactory, UserFactory,
    EmployeeFactory, store, uiSortableMultiSelectionMethods, $q, $mdDialog, $scope, DynamicReportMstFactory) {
    const vm = this;
    vm.analyticsMainList = [];
    vm.chartCategoryList = [];
    vm.isAnyChartContainData = false;
    vm.selectedIndex = 0;

    vm.chartType = WIDGET.CHART_TYPE;
    vm.EmptyMesssage = WIDGET.WIDGET_EMPTYSTATE.WIDGET;
    vm.loginUser = BaseService.loginUser;
    vm.isUserSuperAdmin = vm.loginUser.isUserSuperAdmin;
    $rootScope.pageTitle = 'Dashboard';


    // $rootScope.manager.getUser().then((info) => console.log('info ', info))


    // $rootScope.manager.events.addAccessTokenExpiring(function () {

    //   $rootScope.manager.signinSilentCallback()
    //     .catch((err) => {
    //       $rootScope.manager.getUser().then((info) => console.log('info err=> ', info))

    //     });
    // })
    ///////////////////////

    const init = () => {
      if (vm.isUserSuperAdmin) {
        return WidgetFactory.getAllChartTemplete().save({ isPinToDashboard: true }).$promise.then((response) => response);
      }
      else {
        return WidgetFactory.getEmployeewiseAllChartTemplete().save({
          isPinToDashboard: true, employeeID: vm.loginUser.employee.id
        }).$promise.then((response) => response);
      }
    };

    vm.onTabChanges = (item) => {
      const analyticsList = _.filter(vm.analyticsMainList, (obj) => obj.chartCategoryID === item.id);
      _.each(analyticsList, (item) => {
        var objAssign = _.find(vm.employeeTemplate, (data) => data.chartTemplateID === item.chartTemplateID);
        if (objAssign) {
          item.displayOrder = objAssign.displayOrder;
        }
      });
      vm.analyticsList = _.sortBy(analyticsList, [function (o) { return o.displayOrder; }]);

      vm.isAnyChartContainData = vm.analyticsList.some((item) => item.isRenderTable);

      vm.dynamicReportMstList = _.filter(vm.dynamicReportMstMainList, (obj) => obj.chartCategoryID === item.id);
    };

    //get employee associate widget with its display order
    const getEmployeeWidget = () => WidgetFactory.getChartTemplateEmployeeList().query({ employeeID: vm.loginUser.employee.id }).$promise.then((response) => {
      vm.employeeTemplate = response.data;
      return response;
    });


    /* [S] get report names to set in autocomplete */
    const getDynamicReportsEmployeewise = () => DynamicReportMstFactory.getPinnedToDashboardMISReports().save({
      EmployeeID: vm.loginUser.employee.id, isUserSuperAdmin: vm.isUserSuperAdmin
    }).$promise.then((res) => {
      if (res.data && res.data.pinnedReportList.length > 0) {
        vm.dynamicReportMstMainList = res.data.pinnedReportList;
      }
      else {
        vm.dynamicReportMstMainList = [];
      }
      return vm.dynamicReportMstMainList;
    }).catch((error) => BaseService.getErrorLog(error));
    /* [E] get report names to set in autocomplete */

    const autocompletePromise = [init(), getEmployeeWidget(), getDynamicReportsEmployeewise()];
    //get promise data for dash board widget and employee associate list
    vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
      var response = responses[0];
      var emplyeeAssign = responses[1];
      if (response && response.data) {
        /* [S] - set collection of tabs that contain widget and MIS report */
        vm.analyticsMainList = response.data;
        _.each(vm.analyticsMainList, (item) => {
          if (item.chartCategory) {
            const obj = vm.chartCategoryList.find((x) => x.id === item.chartCategory.id);
            if (!obj) {
              vm.chartCategoryList.push(item.chartCategory);
            }
          }
        });

        _.each(vm.dynamicReportMstMainList, (item) => {
          if (item.chartCategory) {
            const obj = vm.chartCategoryList.find((x) => x.id === item.chartCategory.id);
            if (!obj) {
              vm.chartCategoryList.push(item.chartCategory);
            }
          }
        });
        /* [E] - set collection of tabs that contain widget and MIS report */

        vm.chartCategoryList = $filter('orderBy')(vm.chartCategoryList, ['order', 'name']);

        /* default tab wise widget and reports */
        if (vm.chartCategoryList[0]) {
          vm.analyticsList = _.filter(vm.analyticsMainList, (item) => item.chartCategoryID === vm.chartCategoryList[0].id);
          vm.dynamicReportMstList = _.filter(vm.dynamicReportMstMainList, (item) => item.chartCategoryID === vm.chartCategoryList[0].id);
        }

        /* for selected default tab of chart_category */
        if (vm.chartCategoryList.length > 0 && vm.loginUser.employee.defaultChartCategoryID) {
          const indexForChartCategoryTab = _.findIndex(vm.chartCategoryList, (item) => item.id === vm.loginUser.employee.defaultChartCategoryID);
          /* if no tab found then set first tab as default */
          if (indexForChartCategoryTab < 0) {
            vm.selectedIndex = 0;
            vm.chartCategoryTabSelectedIndex = null;
          }
          else {
            vm.selectedIndex = indexForChartCategoryTab;
            vm.chartCategoryTabSelectedIndex = indexForChartCategoryTab;
          }
        }
      }
      if (emplyeeAssign && emplyeeAssign.data) {
        vm.employeeTemplate = emplyeeAssign.data;
        _.each(vm.analyticsList, (item) => {
          var objAssign = _.find(vm.employeeTemplate, (data) => data.chartTemplateID === item.chartTemplateID);
          if (objAssign) {
            item.displayOrder = objAssign.displayOrder;
          }
        });
        vm.analyticsList = _.sortBy(vm.analyticsList, [function (o) { return o.displayOrder; }]);
      }
    }).catch((error) => BaseService.getErrorLog(error));

    vm.updateCategory = (item, $event) => {
      $event.preventDefault();
      $event.stopPropagation();

      const data = {
        id: item.id
      };

      DialogFactory.dialogService(
        WIDGET.WIDGET_CATEGORY_MODAL_CONTROLLER,
        WIDGET.WIDGET_CATEGORY_MODAL_VIEW,
        $event,
        data).then(() => {
          // Block for Success Result
        }, (insertedData) => {
          if (insertedData) {
            const index = _.findIndex(vm.chartCategoryList, (x) => x.id === item.id);
            if (index !== -1) {
              vm.chartCategoryList.splice(index, 1, {
                id: insertedData.id,
                name: insertedData.name,
                order: insertedData.order
              });

              const currentActive = vm.chartCategoryList[vm.selectedIndex];

              vm.chartCategoryList = $filter('orderBy')(vm.chartCategoryList, ['order', 'name']);

              $timeout(() => {
                vm.selectedIndex = _.findIndex(vm.chartCategoryList, (x) => x.id === currentActive.id);
              }, _configTimeout);
            }
          }
        }, (error) => BaseService.getErrorLog(error));
    };

    vm.fullDrillDown = (data, ev) => {
      DialogFactory.dialogService(
        CORE.MANAGE_WIDGET_DETAIL_MODAL_CONTROLLER,
        CORE.MANAGE_WIDGET_DETAIL_MODAL_VIEW,
        ev,
        data).then(() => {
          // Block for Success Result
        }, (data) => {
          if (data) {
            vm.loadData();
          }
        });
    };

    vm.updateChartCategoryTabAsDefault = (item, event, isSetDefault) => {
      event.preventDefault();
      event.stopPropagation();
      const chartCategoryInfo = {
        defaultChartCategoryID: isSetDefault ? item.id : null,
        employeeID: vm.loginUser.employee.id
      };
      vm.cgBusyLoading = EmployeeFactory.updateEmployeeDefaultChartCategory().save(chartCategoryInfo).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          const loginUserData = getLocalStorageValue('loginuser');
          loginUserData.employee.defaultChartCategoryID = isSetDefault ? item.id : null;
        /* only for debug purpose - [S]*/
        const tractActivityLog = getLocalStorageValue('tractActivityLog');
        if (tractActivityLog && Array.isArray(tractActivityLog)) {
          const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, '') , message: 'Set Loginuser: dashboard' };
          tractActivityLog.push(obj);
          setLocalStorageValue('tractActivityLog', tractActivityLog);
        }
        /* [E]*/
          BaseService.setLoginUser(loginUserData, null);

          /* for selected default tab of chart_category */
          if (vm.loginUser.employee.defaultChartCategoryID) {
            const indexForChartCategoryTab = _.findIndex(vm.chartCategoryList, (chartCatitem) => chartCatitem.id === item.id);
            /* if no tab found then set first tab as default */
            if (indexForChartCategoryTab < 0) {
              vm.selectedIndex = 0;
              vm.chartCategoryTabSelectedIndex = null;
            }
            else {
              vm.selectedIndex = indexForChartCategoryTab;
              vm.chartCategoryTabSelectedIndex = indexForChartCategoryTab;
            }
          }
          else {
            vm.chartCategoryTabSelectedIndex = null;
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //add option for widget drap and drop employee wise
    vm.sortableOptions = uiSortableMultiSelectionMethods.extendOptions({
      cancel: '.cursor-not-allow',
      placeholder: 'beingDragged',
      'ui-floating': true,
      axis: 'y',
      items: '.sortable-item',
      //appendTo: 'body',
      scroll: false,
      cursorAt: {
        top: 0, left: 0
      },
      start: function (e, ui) {
        //ui.item.show().addClass('original-placeholder');
        ui.placeholder.addClass('flex-33 original-placeholder');
      },
      sort: function () {
      },
      update: function (e, ui) {
        vm.selectModel = ui.item.sortable.model;
        if (ui.item.sortable.droptarget) {
          const sourceTarget = ui.item.sortable.source[0];
          const dropTarget = ui.item.sortable.droptarget[0]; // get drop target element
          if (sourceTarget.id === dropTarget.id) {
            if (dropTarget.id !== 'widgetCharts') {
              ui.item.sortable.cancel();
              return;
            }
          }
        }
      },
      stop: function (e, ui) {
        ui.placeholder.removeClass('flex-33');
        $('.original-placeholder').remove();
        if (ui.item.sortable.droptarget) {
          // get drop target element
          const employeeTemplate = [];

          _.each(vm.analyticsList, (tempaltes, index) => {
            const objEmployeeTemplate = {
              employeeID: vm.loginUser.employee.id,
              chartTemplateID: tempaltes.chartTemplateID,
              displayOrder: index + 1
            };
            employeeTemplate.push(objEmployeeTemplate);
          });
          vm.cgBusyLoading = WidgetFactory.saveChartTemplateEmployeeList().query({ templateEmployeeList: employeeTemplate }).$promise.then(() => {
            getEmployeeWidget();
          }).catch((error) => BaseService.getErrorLog(error));
        }
      },
      connectWith: '.items-container'
    });

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide('', { closeAll: true });
    });


  }
})();
