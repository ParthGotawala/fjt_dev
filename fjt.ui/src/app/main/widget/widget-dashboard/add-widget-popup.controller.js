(function () {
  'use strict';

  angular
    .module('app.widget')
    .controller('AddWidgetPopupController', AddWidgetPopupController);

  /** @ngInject */
  function AddWidgetPopupController($mdDialog, $q, data, CORE, Upload, WIDGET, DialogFactory, WidgetFactory, MasterFactory, $filter, BaseService) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.analytics = { isRenderTable: false };
    const analyticsTypeObj = WIDGET.WIDGET_TYPE;
    vm.analyticsType = [];
    vm.analyticsType = Object.keys(analyticsTypeObj).map((key) => analyticsTypeObj[key]);
    vm.analyticsTypeID = vm.analyticsType.length > 0 ? vm.analyticsType[0].ID : null;
    vm.WorkOrderProductionID = WIDGET.CHART_RAWDATA_CATEGORY.WORKORDER_PRODUCTION;

    vm.datatypes = CORE.DATATYPE;
    vm.axisList = [];
    vm.chartCategoryList = [];
    vm.xAxisList = [];
    vm.yAxisList = [];

    // [S] Getting ViewTable column list for selected DB View
    const getSelectedViewTable = (item) => {
      // Clear 'X-Y axis List and selected Item' for new selected DBViewName
      vm.xAxisList = [];
      vm.yAxisList = [];
      vm.autoCompleteXAxis.keyColumnId = null;
      vm.autoCompleteYAxis.keyColumnId = null;
      vm.analytics.xAxisName = null;
      vm.analytics.yAxisName = null;

      if (item) {
        vm.cgBusyLoading = getAxisColumnList(item.chartRawDataCatID);
      }
    };
    // [E] Getting ViewTable column list for selected DB View

    // [S] Getting filter column from 'X-Axis' drop-dwon
    const filterXAxisList = (item) => {
      if (item) {
        vm.analytics.yAxisName = item.displayName;
        vm.xAxisList = angular.copy(vm.axisList);               // Getting List from main list
        if (vm.xAxisList && vm.xAxisList.length > 0) {
          // remove item from 'XAxisList' which is selected into 'Y-AxisList'
          _.remove(vm.xAxisList, (column) => column.field === item.field);
        }
      }
      else {
        vm.analytics.yAxisName = null;
      }
    };
    // [E] Getting filter column from 'X-Axis' drop-dwon

    // [S] Getting filter column from 'Y-Axis' drop-dwon
    const filterYAxisList = (item) => {
      if (item) {
        vm.analytics.xAxisName = item.displayName;
        vm.yAxisList = angular.copy(vm.axisList);
        if (vm.yAxisList && vm.yAxisList.length > 0) {
          // remove item from 'Y-AxisList' which is selected into 'X-AxisList'
          _.remove(vm.yAxisList, (column) => column.field === item.field || vm.datatypes.NUMBER.indexOf(column.dataType) === -1);
        }
      }
      else {
        vm.analytics.xAxisName = null;
      }
    };
    // [E] Getting filter column from 'Y-Axis' drop-dwon

    // AutoComplete for Chart Tyep list
    vm.autoCompleteChartType = {
      columnName: 'name',
      keyColumnName: 'chartTypeID',
      keyColumnId: 'chartTypeID',
      inputName: 'Chart Type',
      placeholderName: 'Chart Type',
      isRequired: true,
      isAddnew: false,
      callbackFn: getAllChartTypeList
    };

    // AutoComplete for Chart Raw Data list
    vm.autoCompleteChartRawData = {
      columnName: 'name',
      keyColumnName: 'chartRawDataCatID',
      keyColumnId: 'chartRawDataCatID',
      inputName: 'Datasource',
      placeholderName: 'Data Source',
      isRequired: true,
      isAddnew: false,
      callbackFn: getAllChartRawDataList,
      onSelectCallbackFn: getSelectedViewTable
    };

    // AutoComplete for X-Axis list
    vm.autoCompleteXAxis = {
      columnName: 'displayName',
      keyColumnName: 'field',
      keyColumnId: null,
      inputName: 'X-Axis',
      placeholderName: 'X-Axis',
      isRequired: true,
      isAddnew: false,
      onSelectCallbackFn: filterYAxisList
    };
    // AutoComplete for Y-Axis list
    vm.autoCompleteYAxis = {
      columnName: 'displayName',
      keyColumnName: 'field',
      keyColumnId: null,
      inputName: 'Y-Axis',
      placeholderName: 'Y-Axis',
      isRequired: true,
      isAddnew: false,
      onSelectCallbackFn: filterXAxisList
    };

    // Autocomplete for chart category
    vm.autoCompleteChartCategory = {
      columnName: 'name',
      keyColumnName: 'id',
      keyColumnId: null,
      controllerName: WIDGET.WIDGET_CATEGORY_MODAL_CONTROLLER,
      viewTemplateURL: WIDGET.WIDGET_CATEGORY_MODAL_VIEW,
      addData: { categoryFor: 'Widget' },
      inputName: 'chartCategory',
      placeholderName: 'Widget Category',
      isRequired: true,
      isAddnew: true,
      callbackFn: getChartCategoryList,
      onSelectCallbackFn: null
    };

    // [S] Getting Chart Type list
    function getAllChartTypeList() {
      return WidgetFactory.getChartTypeList().query().$promise.then((response) => {
        if (response && response.data) {
          vm.chartTypeList = response.data;
        }
        else {
          vm.chartTypeList = [];
        }
        return vm.chartTypeList;
      }).catch((error) => BaseService.getErrorLog(error));
    }
    // [E] Getting Chart Type list

    // [S] Getting Chart Category
    function getChartCategoryList() {
      return WidgetFactory.getChartCategoryList().query().$promise.then((response) => {
        if (response && response.data) {
          vm.chartCategoryList = response.data;
          return vm.chartCategoryList;
        }
      }).catch(() => null);
    }
    // [E] Getting Chart Category

    // [S] Getting Chart Raw data list
    function getAllChartRawDataList() {
      //return WidgetFactory.getChartRawDataList().query().$promise.then((response) => {
      //    if (response && response.data) {
      //        vm.chartRawDataList = response.data;
      //    }
      //    else {
      //        vm.chartRawDataList = [];
      //    }
      //    return vm.chartRawDataList;
      //}).catch((error) => {
      //    return BaseService.getErrorLog(error);
      //});
      return WidgetFactory.getChartRawDataListByAccessRole().save({
        roleID: BaseService.loginUser.defaultLoginRoleID,
        selectedChartRawDataCatID: null
      }).$promise.then((response) => {
        if (response && response.data && response.data.chartRawdataCategoryList.length > 0) {
          vm.chartRawDataList = response.data.chartRawdataCategoryList;
        }
        else {
          vm.chartRawDataList = [];
        }
        return vm.chartRawDataList;
      }).catch((error) => BaseService.getErrorLog(error));
    }
    // [E] Getting Chart Raw data list

    function init() {
      var promises = [getAllChartTypeList(), getAllChartRawDataList(), getChartCategoryList()];
      vm.cgBusyLoading = $q.all(promises);
    }
    init();

    // [S] Getting Axis column list
    function getAxisColumnList(chartRawDataCatID) {
      return WidgetFactory.getChartRawViewColumns().query({ id: chartRawDataCatID }).$promise.then((response) => {
        if (response && response.data) {
          // Store original list into main list
          vm.axisList = angular.copy(response.data);

          // Store axisList into "X-Y" Axis list
          vm.xAxisList = angular.copy(response.data);

          vm.yAxisList = angular.copy(_.filter(response.data, (item) => vm.datatypes.NUMBER.indexOf(item.dataType) !== -1));
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    // [E] Getting Operation list

    /* create/update Analytics */
    vm.saveAnalytics = (buttonCategory) => {
      vm.saveDisable = true;
      //Used to focus on first error filed of form
      if (vm.analyticsForm.$invalid) {
        vm.saveDisable = false;
        BaseService.focusRequiredField(vm.analyticsForm);
        return;
      }

      if (!vm.analyticsForm.$valid) {
        vm.saveDisable = false;
        return;
      }

      const analyticsInfo = {
        nameOfChart: vm.analytics.nameOfChart,
        chartTemplateID: vm.analytics.chartTemplateID,
        xAxisVal: vm.autoCompleteXAxis.keyColumnId,
        yAxisVal: vm.autoCompleteYAxis.keyColumnId,
        chartTypeID: vm.autoCompleteChartType.keyColumnId,
        chartRawDataCatID: vm.autoCompleteChartRawData.keyColumnId,
        chartCatID: vm.analyticsTypeID,
        chartCategoryID: vm.autoCompleteChartCategory.keyColumnId,
        isRenderTable: vm.analytics.isRenderTable
      };

      //analyticsInfo.xAxisName = analyticsInfo.xAxisVal;
      analyticsInfo.xAxisName = vm.analytics.xAxisName;
      //analyticsInfo.yAxisName = analyticsInfo.yAxisVal;
      analyticsInfo.yAxisName = vm.analytics.yAxisName;

      vm.cgBusyLoading = WidgetFactory.saveChartTemplateDetail().save(analyticsInfo).$promise.then((res) => {
        if (res && res.data && res.data.chartTemplateDetail) {
          BaseService.currentPagePopupForm.pop();
          vm.saveAndProceed(buttonCategory, res.data.chartTemplateDetail);
        }
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        BaseService.getErrorLog(error)
      });
    };

    vm.saveAndProceed = (buttonCategory, data) => {
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.analyticsForm.$setPristine();
        vm.analytics.chartTemplateID = data.chartTemplateID;
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.analyticsForm.$dirty;
        if (isdirty) {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
              resetForm();
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          resetForm();
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        $mdDialog.hide(data);
      }
      setFocus('analyticsTypeID');
    };

    /* Reset analyticsForm */
    const resetForm = () => {
      vm.analytics = { isRenderTable: false };
      vm.autoCompleteChartCategory.keyColumnId = null;
      vm.autoCompleteChartType.keyColumnId = null;
      vm.autoCompleteChartRawData.keyColumnId = null;
      vm.autoCompleteXAxis.keyColumnId = null;
      vm.autoCompleteYAxis.keyColumnId = null;
      vm.analyticsForm.$setPristine();
    };

    /* Goto  DataSource List. */
    vm.goToDataSourceList = () => {
      BaseService.goToDataSourceList();
    };

    /*USed to close pop-up*/
    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.analyticsForm);
      if (isdirty) {
        const data = {
          form: vm.analyticsForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    //Set as current form when page loaded
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.analyticsForm);
    });

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
  }
})();
