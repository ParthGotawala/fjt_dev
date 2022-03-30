(function () {
  'use strict';

  angular
    .module('app.widget')
    .controller('WidgetDetailController', WidgetDetailController);

  /** @ngInject */
  function WidgetDetailController($scope, $mdDialog, $q, $state, $stateParams, $mdSidenav, $timeout, CORE, BaseService, WIDGET, DialogFactory, WidgetFactory) {
    const vm = this;

    var groupCount = 0;
    var count = 0;
    var sublevelCount = 0;

    vm.isDataFound = false;
    vm.employeeDetails = BaseService.loginUser.employee;
    vm.chartTypeList = [];
    let chartAllRawDataList = [];
    vm.xAxisList = [];
    vm.yAxisList = [];
    vm.axisList = [];
    vm.chartCategoryList = [];
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.analyticDashState = WIDGET.WIDGET_DASHBOARD_STATE;
    vm.EmptyMesssage = WIDGET.WIDGET_EMPTYSTATE.DETAIL;
    vm.chartType = WIDGET.CHART_TYPE;

    vm.analyticsTypeObj = WIDGET.WIDGET_TYPE;
    vm.analyticsType = [];
    vm.analyticsType = Object.keys(vm.analyticsTypeObj).map((key) => vm.analyticsTypeObj[key]);

    vm.workOrderProductionID = WIDGET.CHART_RAWDATA_CATEGORY.WORKORDER_PRODUCTION;

    vm.OptionTypeArr = CORE.OPTIONTYPES;
    $scope.booleanList = CORE.BOOLEANLIST;
    vm.datatypes = CORE.DATATYPE;
    vm.DateAndNumberOperator = CORE.DATE_AND_NUMBER_OPERATOR;
    vm.TextOperator = CORE.TEXT_OPERATOR;
    vm.BooleanOperator = CORE.BOOLEAN_OPERATOR;

    vm.dateDispFormatList = CORE.DATE_FORMATES;

    vm.analyticConfigModel = {
      chartTemplateID: $stateParams.chartTemplateID,
      employeeID: vm.employeeDetails.id,
      chartTypeID: null,
      nameOfChart: null,
      xAxisVal: null,
      yAxisVal: null,
      xAxisName: null,
      yAxisName: null,
      chartCatID: null,
      chartRawDataCatID: null,
      filterData: null,
      compareVariables: [],
      drilldown: [],
      xAxisFormat: null,
      chartCategoryID: null,
      isRenderTable: false
    };

    vm.goBack = () => {
      if (vm.frmAnalytics.$dirty) {
        showWithoutSavingAlertforBackButton();
      } else {
        $state.go(WIDGET.WIDGET_DASHBOARD_STATE);
      }
    };
    function showWithoutSavingAlertforBackButton() {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.frmAnalytics.$setPristine();
          $state.go(WIDGET.WIDGET_DASHBOARD_STATE);
        }
      }, (error) => BaseService.getErrorLog(error));
    }

    init();

    function init() {
      var promises = [getChartTemplateDetail(), getAllChartTypeList(), getAllChartRawDataList(),
      getChartCategoryList(), getUserRolewiseChartAllRawDataList(true)];
      vm.cgBusyLoading = $q.all(promises).then((responses) => {
        var getChartTemplateDetailResp = responses[0];
        setSelectedDataSource();

        if (getChartTemplateDetailResp) {
          vm.autoCompleteChartType.keyColumnId = vm.analyticConfigModel.chartTypeID;
          vm.autoCompleteChartRawData.keyColumnId = vm.analyticConfigModel.chartRawDataCatID;
          vm.autoCompleteChartCategory.keyColumnId = vm.analyticConfigModel.chartCategoryID;

          if (getChartTemplateDetailResp.filterData) {
            vm.analyticConfigModel.filterData = JSON.parse(getChartTemplateDetailResp.filterData);
          }
        }
      });
    }

    /* Manage data source for chart category */
    function setSelectedDataSource() {
      const selectedDataSourceItem = _.find(vm.chartRawDataList, (item) => item.chartRawDataCatID === vm.analyticConfigModel.chartRawDataCatID);

      /* if selected chart category not found from data list by access role then check in main list */
      if (!selectedDataSourceItem) {
        const selectedDataSourceFromMainList = _.find(chartAllRawDataList, (item) => item.chartRawDataCatID === vm.analyticConfigModel.chartRawDataCatID);
        if (selectedDataSourceFromMainList) {
          vm.chartRawDataList.push(selectedDataSourceFromMainList);
          vm.isChartRawDataIsDisable = true;
        }
        else {
          vm.isChartRawDataIsDisable = false;
        }
      }
    }

    function getChartTemplateDetail() {
      vm.isDataFound = false;

      return WidgetFactory.getChartTemplateDetail().query({ chartTemplateID: vm.analyticConfigModel.chartTemplateID }).$promise.then((response) => {
        if (response && response.data) {
          const analyticDet = response.data;

          vm.analyticConfigModel.chartTypeID = analyticDet.chartTypeID;
          vm.analyticConfigModel.nameOfChart = analyticDet.nameOfChart;
          vm.analyticConfigModel.xAxisVal = analyticDet.xAxisVal;
          vm.analyticConfigModel.yAxisVal = analyticDet.yAxisVal;
          vm.analyticConfigModel.xAxisName = analyticDet.xAxisName;
          vm.analyticConfigModel.yAxisName = analyticDet.yAxisName;
          vm.analyticConfigModel.chartCatID = analyticDet.chartCatID;
          vm.analyticConfigModel.chartRawDataCatID = analyticDet.chartRawDataCatID;
          vm.analyticConfigModel.compareVariablesString = analyticDet.compareVariables;
          vm.analyticConfigModel.compareVariables = analyticDet.compareVariables ? JSON.parse(analyticDet.compareVariables) : null;
          vm.analyticConfigModel.drilldownString = analyticDet.drilldown;
          vm.analyticConfigModel.xAxisFormat = analyticDet.xAxisFormat;
          vm.analyticConfigModel.chartCategoryID = analyticDet.chartCategoryID;
          vm.analyticConfigModel.isRenderTable = analyticDet.isRenderTable;

          if (analyticDet.filterData) {
            vm.analyticConfigModel.filterData = JSON.parse(analyticDet.filterData);
            DisplayExpression(vm.analyticConfigModel.filterData);
          }
          bindOperationChilps();

          vm.isDataFound = true;
          window.setTimeout(chartresize);
          return analyticDet;
        }
        else {
          vm.isDataFound = false;
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    }

    function getChartCategoryList() {
      return WidgetFactory.getChartCategoryList().query().$promise.then((response) => {
        if (response && response.data) {
          vm.chartCategoryList = response.data;
          return vm.chartCategoryList;
        }
      }).catch(() => null);
    }

    // [S] Method for getting ViewTable column list for selected DB View
    const getSelectedViewTable = (item) => {
      // Clear 'X-Y axis List and selected Item' for new selected DBViewName
      vm.xAxisList = [];
      vm.yAxisList = [];
      vm.autoCompleteXAxis.keyColumnId = null;
      vm.autoCompleteYAxis.keyColumnId = null;

      if (item) {
        vm.cgBusyLoading = getAxisColumnList(item.chartRawDataCatID);
      }
      else {
        // empty compare variable chip
        vm.analyticConfigModel.compareVariables = [];
        vm.frmAnalytics.$dirty = true;
      }
      if (vm.frmAnalytics.$dirty) {
        vm.clearCondition();
      }
    };
    // [E] Method for getting ViewTable column list for selected DB View

    // AutoComplete for Chart Type list
    vm.autoCompleteChartType = {
      columnName: 'name',
      keyColumnName: 'chartTypeID',
      keyColumnId: null,
      inputName: 'Widget Type',
      placeholderName: 'Widget Type',
      isRequired: true,
      isAddnew: false,
      callbackFn: getAllChartTypeList
    };

    // AutoComplete for Chart Raw Data list
    vm.autoCompleteChartRawData = {
      columnName: 'name',
      keyColumnName: 'chartRawDataCatID',
      keyColumnId: null,
      inputName: 'Datasource',
      placeholderName: 'Data Source',
      isRequired: true,
      isAddnew: false,
      callbackFn: getUserRolewiseChartAllRawDataList,
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

    vm.addCondition = function ($event) {
      var data = {
        axisList: vm.axisList,
        filterData: _.cloneDeep(vm.analyticConfigModel.filterData)
      };

      DialogFactory.dialogService(
        CORE.WIDGET_FILTER_MODAL_CONTROLLER,
        CORE.WIDGET_FILTER_MODAL_VIEW,
        $event,
        data).then((response) => {
          if (response) {
            vm.frmAnalytics.nameOfChart.$setDirty(); // manually set form dirty to make save button enable
            vm.analyticConfigModel.filterData = response.filterdata;
            DisplayExpression(vm.analyticConfigModel.filterData);
          }
        }, () => {
          /* empty */
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.clearCondition = function () {
      vm.analyticConfigModel.filterData = null;
      $scope.expressionui = null;
      vm.frmAnalytics.nameOfChart.$setDirty(); // manually set form dirty to make save button enable
    };

    vm.addDrilldown = function () {
      vm.analyticConfigModel.drilldown.push({
        columnName: 'displayName',
        keyColumnName: 'field',
        keyColumnId: null,
        inputName: 'Field',
        placeholderName: 'Field',
        isRequired: true,
        isAddnew: false
      });
    };

    vm.removeDrilldown = function ($index) {
      vm.analyticConfigModel.drilldown.splice($index, 1);
      vm.frmAnalytics.nameOfChart.$setDirty(); // manually set form dirty to make save button enable
    };

    function DisplayExpression(data) {
      $scope.expressionui = '';
      groupCount = 0;
      count = 0;
      sublevelCount = 0;
      _.each(data, (group) => {
        if (group.Nodes.length > 0) {
          DisplaySubExpression(group);
        }
      });
      if (sublevelCount > 0) {
        for (let o = 0; o < sublevelCount; o++) {
          $scope.expressionui += ' ) ';
        }
      }
    };

    function DisplaySubExpression(group) {
      _.each(group.Nodes, (node, index) => {
        if (index > 0 && group.Condition) {
          $scope.expressionui += `${' <span style="color:red;">'}${node.Condition || group.Condition}</span>`;
        }
        if (node.Selected) {
          if (groupCount > 0 && count !== groupCount) {
            count = groupCount;
            $scope.expressionui += ' ( ';
          }
          if (node.Selected.OptionType === vm.OptionTypeArr[0]) {
            let valText = '';
            if (vm.datatypes.NUMBER.indexOf(node.datatype) !== -1) {
              valText = node.OperatorValue !== null ? node.OperatorValue : '';
            }
            else if (vm.datatypes.STRING.indexOf(node.datatype) !== -1) {
              valText = node.OperatorValue !== null ? stringFormat('\'{0}\'', node.OperatorValue) : '';
            }
            else if (vm.datatypes.DATE.indexOf(node.datatype) !== -1) {
              //valText = node.OperatorValue != null ? stringFormat("'{0}'", $filter('date').format(node.OperatorValue, vm.DefaultDateFormat)) : "";
              valText = node.OperatorValue !== null ? BaseService.getAPIFormatedDate(node.OperatorValue) : '';
            }
            else if (vm.datatypes.TIME.indexOf(node.datatype) !== -1) {
              valText = node.OperatorValue !== null ? stringFormat('\'{0}\'', node.OperatorValue) : '';
            }
            else {
              valText = node.Selected.BooleanVal !== null ? node.Selected.BooleanVal.Name : '';
            }
            $scope.expressionui += ' ' + node.Selected.FieldName.displayName + ' ' + node.Selected.Operator.Value + ' ' + valText;
          }
          if (node.Selected.OptionType === vm.OptionTypeArr[1]) {
            $scope.expressionui += ' ( ' + node.Selected.SelectedExpression.Expression + ' ' + node.Selected.Operator.Value + ' ' + node.OperatorValue + ' ) ';
          }
        }
        if (groupCount > 0 && group.ParentGroupLevel !== null && index === group.Nodes.length - 1) {
          if (group.SubLevel === 1) {
            $scope.expressionui += ' ) ';
          }
          if (group.SubLevel > 1) {
            //console.log(group.SubLevel);
            sublevelCount++;
          }
        }
        if (node.Nodes && node.Nodes.length > 0) {
          groupCount++;
          DisplaySubExpression(node);
        }
      });
    };

    // [S] Method for Chart Type list
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
    };
    // [E] Method for Chart Type list

    // [S] Method for Chart Raw data list
    function getAllChartRawDataList() {
      return WidgetFactory.getChartRawDataList().query().$promise.then((response) => {
        if (response && response.data) {
          chartAllRawDataList = response.data;
        }
        else {
          chartAllRawDataList = [];
        }
        return chartAllRawDataList;
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // [E] Method for Chart Raw data list

    // [S] Method for Chart Raw data list
    function getUserRolewiseChartAllRawDataList(isCalledFromInitFun) {
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

        /* refresh auto complete case */
        if (!isCalledFromInitFun && vm.analyticConfigModel && vm.analyticConfigModel.chartRawDataCatID) {
          setSelectedDataSource();
        }
        return vm.chartRawDataList;
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // [E] Method for Chart Raw data list

    // [S] Method for Axis column list
    function getAxisColumnList(chartRawdataCatID) {
      return WidgetFactory.getChartRawViewColumns().query({ id: chartRawdataCatID }).$promise.then((response) => {
        if (response && response.data) {
          // Store original list into main list
          vm.axisList = response.data;

          // Store axisList into "X-Y" Axis list
          vm.xAxisList = angular.copy(response.data);
          vm.yAxisList = angular.copy(_.filter(response.data, (item) => vm.datatypes.NUMBER.indexOf(item.dataType) !== -1));

          vm.autoCompleteXAxis.keyColumnId = vm.analyticConfigModel.xAxisVal;
          vm.autoCompleteYAxis.keyColumnId = vm.analyticConfigModel.yAxisVal;

          bindOperationChilps();
          bindDrilldownDropdowns();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // [E] Method for Axis column list

    function bindOperationChilps() {
      if (vm.analyticConfigModel.compareVariablesString) {
        vm.analyticConfigModel.compareVariables = [];
        let compareVariablesArr = JSON.parse(vm.analyticConfigModel.compareVariablesString);
        compareVariablesArr = _.uniqBy(compareVariablesArr, (item) => item.field);
        compareVariablesArr.forEach((x) => {
          var axisObj = _.find(vm.axisList, (item) => item.field === x.field);
          if (axisObj) {
            vm.analyticConfigModel.compareVariables.push(axisObj);
          }
        });
      }
    };

    function bindDrilldownDropdowns() {
      if (vm.analyticConfigModel.drilldownString) {
        vm.analyticConfigModel.drilldown = [];
        vm.analyticConfigModel.drilldownString.split(',').forEach((item) => {
          vm.analyticConfigModel.drilldown.push({
            columnName: 'displayName',
            keyColumnName: 'field',
            keyColumnId: item || 'field',
            inputName: 'Field',
            placeholderName: 'Field',
            isRequired: true,
            isAddnew: false
          });
        });
      }
    }

    // [S] Method for getting filter column from 'X-Axis' drop-dwon list base on selected column in 'Y-Axis' drop-down
    function filterXAxisList(item) {
      if (item) {
        vm.xAxisList = angular.copy(vm.axisList);               // Getting List from main list
        if (vm.xAxisList && vm.xAxisList.length > 0) {
          // remove item from 'XAxisList' which is selected into 'Y-AxisList'
          _.remove(vm.xAxisList, (column) => column.field === item.field);
        }
      }
    };
    // Ends

    // [S] Method for getting filter column from 'Y-Axis' drop-dwon list base on selected column in 'X-Axis' drop-down
    function filterYAxisList(item) {
      if (item) {
        vm.yAxisList = angular.copy(vm.axisList);
        if (vm.yAxisList && vm.yAxisList.length > 0) {
          // remove item from 'Y-AxisList' which is selected into 'X-AxisList'. Keep only number type column
          _.remove(vm.yAxisList, (column) => column.field === item.field || vm.datatypes.NUMBER.indexOf(column.dataType) === -1);
        }

        if (CORE.DATATYPE.DATE.indexOf(item.dataType) !== -1) {
          vm.isDateTimeXAxis = true;
        }
        else {
          vm.isDateTimeXAxis = false;
          vm.analyticConfigModel.xAxisFormat = null;
        }
      }
    };
    // Ends

    // [S] multiple operations chips
    vm.querySearch = (criteria) => {
      criteria = criteria.toLowerCase();
      return criteria ? _.filter(vm.axisList, (item) => vm.datatypes.NUMBER.indexOf(item.dataType) !== -1 && item.field.toLowerCase().indexOf(criteria) !== -1) : [];
    };
    // [S] multiple operations chips

    vm.saveAnalytics = () => {
      if (BaseService.focusRequiredField(vm.frmAnalytics)) {
        return;
      }
      if (vm.analyticConfigModel) {
        let compareVariables = [{
          displayName: vm.analyticConfigModel.yAxisName,
          field: vm.autoCompleteYAxis.keyColumnId
        }];
        _.each(vm.analyticConfigModel.compareVariables, (x) => {
          const obj = {
            displayName: x.displayName,
            field: x.field
          };
          compareVariables.push(obj);
        });

        compareVariables = _.uniqBy(compareVariables, (item) => item.field);

        let drilldown = vm.analyticConfigModel.drilldown.map((x) => x.keyColumnId).toString();
        if (drilldown === '') {
          drilldown = null;
        }

        const analyticsInfo = {
          chartTemplateID: $stateParams.chartTemplateID,
          woID: null,
          opID: null,
          employeeID: vm.employeeDetails.id,
          nameOfChart: vm.analyticConfigModel.nameOfChart,
          xAxisVal: vm.autoCompleteXAxis.keyColumnId,
          yAxisVal: vm.autoCompleteYAxis.keyColumnId,
          xAxisName: vm.analyticConfigModel.xAxisName,
          yAxisName: vm.analyticConfigModel.yAxisName,
          chartTypeID: vm.autoCompleteChartType.keyColumnId,
          chartRawDataCatID: vm.autoCompleteChartRawData.keyColumnId,
          filterData: vm.analyticConfigModel.filterData ? JSON.stringify(vm.analyticConfigModel.filterData) : null,
          compareVariables: JSON.stringify(compareVariables),
          drilldown: drilldown,
          xAxisFormat: vm.analyticConfigModel.xAxisFormat,
          chartCategoryID: vm.autoCompleteChartCategory.keyColumnId,
          isRenderTable: vm.analyticConfigModel.isRenderTable
        };

        vm.cgBusyLoading = WidgetFactory.saveChartTemplateDetail().save(analyticsInfo).$promise.then((response) => {
          if (response && response.data) {
            getChartTemplateDetail();
            vm.frmAnalytics.$setPristine();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.fullDrillDown = (data, ev) => {
      DialogFactory.dialogService(
        CORE.MANAGE_WIDGET_DETAIL_MODAL_CONTROLLER,
        CORE.MANAGE_WIDGET_DETAIL_MODAL_VIEW,
        ev,
        data).then(() => {
          // Block for Sucees Result
        }, (data) => {
          if (data) {
            vm.loadData();
          }
        });
    };

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.checkFormDirty = (form, columnName) => {
      const result = BaseService.checkFormDirty(form, columnName);
      return result;
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });

    $(window).resize(() => {
      chartresize();
    });
    function chartresize() {
      const chartDetail = $('#chartDetail');

      var docHeight = 0;
      if (chartDetail && chartDetail.length > 0) {
        docHeight = chartDetail.height() - 50;
      }
      const isRenderTable = vm.analyticConfigModel ? vm.analyticConfigModel.isRenderTable : false;
      const chartHeight = isRenderTable ? docHeight / 2 : docHeight;

      $('.chart-container').height(chartHeight);
    };

    //Set as current form when page loaded
    angular.element(() => {
      BaseService.currentPageForms = [vm.frmAnalytics];
    });
  }
})();
