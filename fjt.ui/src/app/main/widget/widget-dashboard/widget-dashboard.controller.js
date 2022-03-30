(function () {
  'use strict';

  angular
    .module('app.widget')
    .controller('WidgetDashboardController', WidgetDashboardController);

  /** @ngInject */
  function WidgetDashboardController($state, $scope, $mdDialog, $timeout, USER, CORE, WIDGET, DialogFactory, BaseService,
    WidgetFactory, WidgetOperationPopupFactory, EmployeeFactory) {
    const vm = this;
    vm.analyticsList = [];
    vm.chartType = WIDGET.CHART_TYPE;
    vm.EmptyMesssage = WIDGET.WIDGET_EMPTYSTATE.WIDGET;
    vm.searchEmptyMesssage = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.chartTypeIcon = WIDGET.CHART_TYPE_ICON;
    const loginUserDetails = BaseService.loginUser;
    let analyticsListAllData = [];
    vm.isAnyChartContainData = false;
    vm.employee = {};
    vm.isUserSuperAdmin = loginUserDetails.isUserSuperAdmin;

    const analyticsTypeObj = WIDGET.WIDGET_TYPE;
    vm.analyticsType = [];
    vm.analyticsType = Object.keys(analyticsTypeObj).map((key) => analyticsTypeObj[key]);

    vm.selectedItems = [];
    vm.Show = {
      listView: false
    };
    vm.limitOptions = [25, 50, 75, 100];
    vm.query = {
      order: '',
      search: {
      },
      limit: 15,
      page: 1,
      isPagination: vm.ispagination === undefined ? CORE.isPagination : vm.ispagination
    };

    vm.init = () => {
      /* if super admin user than get all widget */
      if (loginUserDetails.isUserSuperAdmin) {
        vm.cgBusyLoading = WidgetFactory.getAllChartTemplete().save();
      }
      else {
        /* if other than super admin user than get only widgets that created by that user */
        vm.cgBusyLoading = WidgetFactory.getAllChartTemplete().save({
          createdBy: loginUserDetails.userid
        });
      }
      vm.cgBusyLoading.$promise.then((response) => {
        if (response && response.data) {
          analyticsListAllData = response.data;
          vm.analyticsList = angular.copy(analyticsListAllData);
          setIndexForList(vm.analyticsList);
        }
        else {
          vm.isDataFound = false;
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    };

    vm.init();

    /* add new analytics*/
    vm.addAnalytics = (data, ev) => {
      DialogFactory.dialogService(
        WIDGET.WIDGET_ADD_MODAL_CONTROLLER,
        WIDGET.WIDGET_ADD_MODAL_VIEW,
        ev,
        data).then((chartTemplateDetail) => {
          $state.go(WIDGET.WIDGET_DETAIL_STATE, { chartTemplateID: chartTemplateDetail.chartTemplateID });
        }, (err) => BaseService.getErrorLog(err));
    };

    /* Delete analytics*/
    vm.removeAnalytics = (chart) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_DETAILS_MESSAGE);
      messageContent.message = stringFormat(messageContent.message, WIDGET.WIDGET_LABEL);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.cgBusyLoading = WidgetFactory.deleteChartTemplete().save({
            chartTemplateID: chart.chartTemplateID
          }).$promise.then((res) => {
            if (res.data && res.data.TotalCount > 0) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_ALERT_MESSAGE);
              const alertModel = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(alertModel);
            }
            else {
              _.remove(vm.analyticsList, (item) => item.chartTemplateID === chart.chartTemplateID);
            }

            vm.isAnyChartContainData = vm.analyticsList.some((item) => item.isRenderTable);
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.pinToDashboard = (chartModel) => {
      vm.cgBusyLoading = WidgetFactory.setWidgetToDashboard().save({
        chartTemplateID: chartModel.chartTemplateID,
        isPinToDashboard: !chartModel.isPinToDashboard
      }).$promise.then(() => {
        chartModel.isPinToDashboard = !chartModel.isPinToDashboard;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    function pinToTraveler(chartModel) {
      vm.cgBusyLoading = WidgetFactory.setWidgetToTraveler().save({
        chartTemplateID: chartModel.chartTemplateID,
        isPinToTraveler: !chartModel.isPinToTraveler
      }).$promise.then(() => {
        chartModel.isPinToTraveler = !chartModel.isPinToTraveler;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function deleteOperations(chartTemplateID) {
      var chartOperationModel = {
        opID: [],
        chartTemplateID: chartTemplateID,
        chaartTempOPID: null
      };
      vm.cgBusyLoading = WidgetOperationPopupFactory.saveChartTempOperation().save(chartOperationModel).$promise.then(() => {
        // Block of Success Result
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    }

    vm.pinToTraveler = (chartModel, ev) => {
      if (!chartModel.isPinToTraveler) {
        vm.selectOperations(chartModel, ev);
      }
      else {
        pinToTraveler(chartModel);
        deleteOperations(chartModel.chartTemplateID);
      }
    };

    vm.selectOperations = (chartModel, ev) => {
      DialogFactory.dialogService(
        CORE.MANAGE_WIDGET_OPERATION_CONTROLLER,
        CORE.MANAGE_WIDGET_OPERATION_VIEW,
        ev,
        chartModel).then((data) => {
          if (data) {
            if (chartModel.isPinToTraveler) {
              chartModel.isPinToTraveler = !chartModel.isPinToTraveler;
            }
            pinToTraveler(chartModel);
          }
        }, () => {
          // Block for Error Result
        });
    };

    vm.goToWidgetDetailPage = (chartTemplateID) => {
      BaseService.openInNew(WIDGET.WIDGET_DETAIL_STATE, { chartTemplateID: chartTemplateID });
    };

    vm.fullDrillDown = (data, ev) => {
      DialogFactory.dialogService(
        CORE.MANAGE_WIDGET_DETAIL_MODAL_CONTROLLER,
        CORE.MANAGE_WIDGET_DETAIL_MODAL_VIEW,
        ev,
        data).then(() => {
          // Block for Success Result
        }, () => {
          // Block for Error Result
        });
    };

    /* open popup to add employee for view widget */
    vm.selectEmployee = (chartModel, ev) => {
      DialogFactory.dialogService(
        WIDGET.MANAGE_WIDGET_EMPLOYEE_CONTROLLER,
        WIDGET.MANAGE_WIDGET_EMPLOYEE_VIEW,
        ev,
        chartModel).then(() => {
          vm.init();
        }, () => {
          // Block of Error Result
        });
    };


    const initAutoComplete = () => {
      vm.autoCompleteEmployeeDetail = {
        columnName: 'name',
        controllerName: USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.employee.employeeID ? vm.employee.employeeID : null,
        inputName: 'Personnel',
        placeholderName: 'Personnel',
        isRequired: false,
        isAddnew: false,
        callbackFn: null,
        onSelectCallbackFn: showSelectedEmployeeWidgetList
      };
    };
    /* Employee dropdown fill up */
    const getEmployeeList = () => {
      vm.cgBusyLoading = EmployeeFactory.GetEmployeeDetail().query({ isOnlyActive: true }).$promise.then((employees) => {
        vm.employeeList = angular.copy(employees.data);
        _.each(vm.employeeList, (item) => {
          let deptName = '';
          let gencCategoryName = '';
          if (item.deptName) {
            deptName = ' (' + item.deptName + ')';
          }
          if (item.gencCategoryName) {
            gencCategoryName = ' ' + item.gencCategoryName;
          }
          item.name = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, item.initialName, item.firstName, item.lastName) + deptName + gencCategoryName;
          if (item.profileImg && item.profileImg !== null) {
            item.ProfilePic = `${CORE.WEB_URL}${USER.EMPLOYEE_BASE_PATH}${item.profileImg}`;
          }
          else {
            item.ProfilePic = `${CORE.WEB_URL}${USER.EMPLOYEE_DEFAULT_IMAGE_PATH}profile.jpg`;
          }
        });
        initAutoComplete();
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getEmployeeList();

    /* filter widget based on employee */
    const showSelectedEmployeeWidgetList = (selectedEmp) => {
      if (!selectedEmp || !selectedEmp.id) {
        vm.autoCompleteEmployeeDetail.keyColumnId = null;
        vm.analyticsList = angular.copy(analyticsListAllData);
      }
      else {
        vm.autoCompleteEmployeeDetail.keyColumnId = selectedEmp.id;
        const analyticsListAllDataForEmpFilter = angular.copy(analyticsListAllData);
        vm.analyticsList = _.filter(analyticsListAllDataForEmpFilter, (widgetItem) => widgetItem.createdBy === _.first(selectedEmp.user).id);
      }
      setIndexForList(vm.analyticsList);
    };

    const setIndexForList = (list) => {
      _.each(list, (item, $index) => {
        item.index = $index + 1;
      });
      vm.isAnyChartContainData = vm.analyticsList.some((item) => item.isRenderTable);
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
  }
})();
