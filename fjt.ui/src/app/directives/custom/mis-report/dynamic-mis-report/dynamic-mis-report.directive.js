(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('dynamicMisReport', dynamicMisReport);

  /** @ngInject */
  function dynamicMisReport() {
    let directive = {
      restrict: 'E',
      scope: {
        reportId: "=?",
        reportName: "=?",
        filterOptionInPagingInfo: "=?"
      },
      templateUrl: 'app/directives/custom/mis-report/dynamic-mis-report/dynamic-mis-report.html',
      controller: dynamicMisReportCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */

    function dynamicMisReportCtrl($timeout, $scope, CORE, REPORTS, BaseService, DialogFactory, $filter
      , WidgetFactory, $q, USER, DynamicReportMstFactory, uiGridGroupingConstants) {
      var vm = this;
      vm.setScrollClass = 'gridScrollHeight_MISReport';
      var Filteroption = null;
      vm.isFilter = false;
      var groupCount = 0;
      var count = 0;
      var sublevelCount = 0;
      vm.OptionTypeArr = CORE.OPTIONTYPES;
      vm.datatypes = CORE.DATATYPE;
      vm.isHideDelete = true;
      let emptyState = REPORTS.REPORTS_EMPTYSTATE;
      vm.commonReportEmptyState = emptyState.MIS_COMMON_REPORT;
      vm.defaultDateFormat = _dateDisplayFormat;
      vm.defaultTimeFormat = _timeWithoutSecondDisplayFormat;
      vm.defaultDateTimeFormat = _dateTimeDisplayFormat;
      vm.misReportFilterDetails = {};
      vm.ReportOperation = REPORTS.ReportOperation;
      let FIELD_DATATYPES = REPORTS.FIELD_DATATYPES;
      let fieldsListToMatch = [];


      vm.pagingInfoForMISCommonReport = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: []
      };

      vm.gridOptionsForMISCommonReport = {
        showColumnFooter: true,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: true,
        multiSelect: true,
        filterOptions: vm.pagingInfoForMISCommonReport.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'MIS Report.csv',
        enableGrouping: true,
      };

      let clearMISReportData = () => {
        vm.sourceDataForMISCommonReport = [];
        vm.sourceHeaderForMISCommonReport = [];
        //vm.isNoDataFoundForMISCommonReport = true;
        vm.emptyStateForMISCommonReport = null;
        vm.pagingInfoForMISCommonReport.SortColumns = [];
        vm.pagingInfoForMISCommonReport.SearchColumns = [];
      }
      clearMISReportData();

      /* get all report columns for selected data source (db-view) */
      let getReportColumnList = (chartRawDataCatID) => {
        if (!chartRawDataCatID) {
          return;
        }
        return WidgetFactory.getChartRawViewColumns().query({ id: chartRawDataCatID }).$promise.then((response) => {
          if (response && response.data) {
            return response.data;
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      vm.loadDataForMISCommonReport = (pagingInfo) => {
        if ($scope.reportId) {
          //let objSelectedReport = {
          //    ID: $scope.reportId,
          //    ReportName: $scope.reportName
          //}

          vm.pagingInfoForMISCommonReport.filteroption = $scope.filterOptionInPagingInfo;

          // format data as per api call variable
          vm.pagingInfoForMISCommonReport.id = $scope.reportId;
          vm.pagingInfoForMISCommonReport.reportName = $scope.reportName;
          vm.pagingInfoForMISCommonReport.page = vm.pagingInfoForMISCommonReport.Page || 1;
          vm.pagingInfoForMISCommonReport.pageSize = CORE.UIGrid.ItemsPerPage();
          vm.pagingInfoForMISCommonReport.order = vm.pagingInfoForMISCommonReport.SortColumns ? JSON.stringify(vm.pagingInfoForMISCommonReport.SortColumns) : null;
          vm.pagingInfoForMISCommonReport.search = vm.pagingInfoForMISCommonReport.SearchColumns ? JSON.stringify(vm.pagingInfoForMISCommonReport.SearchColumns) : null;
          vm.pagingInfoForMISCommonReport.filterOption = vm.pagingInfoForMISCommonReport.filteroption || null;

          getMISReportDataBySelectedReport();
        }
        else {
          clearMISReportData();
          vm.isNoDataFoundForMISCommonReport = true;
          vm.pagingInfoForMISCommonReport.filteroption = null;
          Filteroption = null;
          $scope.expressionui = null;
          //selectedReportNameFromAutoComplete = null;
          return;
        }
      };

      /* [S] get mis report by selected report */
      let getMISReportDataBySelectedReport = () => {
        //vm.isNoDataFoundForMISCommonReport = true;
        //selectedReportNameFromAutoComplete = selectedReport.ReportName;
        vm.cgBusyLoading = DynamicReportMstFactory.getDynamicReportDetailsByReportID().query(vm.pagingInfoForMISCommonReport).$promise.then((res) => {
          if (res.data && res.data.dynamicReportMstdet) {
            fieldsListToMatch = [];
            var cgPromise = [getReportColumnList(res.data.dynamicReportMstdet.chartRawDataCatID)];
            vm.cgBusyLoading = $q.all(cgPromise).then((fieldListResponses) => {
              fieldsListToMatch = angular.copy(fieldListResponses[0]) || [];

              if (res.data.reportDatalist.length > 0)
                vm.sourceDataForMISCommonReport = res.data.reportDatalist;
              //_.each(vm.sourceDataForMISCommonReport, (data) => {
              //    _.each(data, (value, key) => {
              //        key = key.replace(/`/g, "");
              //    });
              //});
              vm.totalSourceDataCountForMISCommonReport = res.data.reportDatalist.length;
              vm.misReportFilterDetails = res.data.dynamicReportMstdet;
              if (!Filteroption) {
                DisplayExpression(JSON.parse(vm.misReportFilterDetails.Filter));
                vm.isFilter = false;
              } else {
                DisplayExpression(JSON.parse(Filteroption));
                vm.isFilter = true;
              }

              //let fieldsSelectionList = _.map(res.data.dynamicReportMstdet.dynamicReportFields, 'Fields');
              let fieldsSelectionList = _.keys(vm.sourceDataForMISCommonReport[0]);
              setGridOptionsAfterGetMISReportData(fieldsSelectionList);
              vm.gridOptionsForMISCommonReport.exporterCsvFilename = vm.misReportFilterDetails ? vm.misReportFilterDetails.ReportName + ".csv" : vm.gridOptionsForMISCommonReport.exporterCsvFilename;
            });
          }
          else {
            let fieldsSelectionList = [];
            if (!res.data && vm.pagingInfoForMISCommonReport.SearchColumns.length == 0) {
              vm.misReportFilterDetails = {};
            }
            vm.misReportFilterDetails = res.data ? res.data.dynamicReportMstdet : null;
            vm.sourceDataForMISCommonReport = [];
            vm.totalSourceDataCountForMISCommonReport = 0;
            setGridOptionsAfterGetMISReportData(fieldsSelectionList);
            //clearMISReportData();
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      /* [E] get mis report by selected report */

      /* [S] set grid column definitions and other options */
      let setGridOptionsAfterGetMISReportData = (fieldsSelectionList) => {
        if (!vm.gridOptionsForMISCommonReport.enablePaging) {
          vm.currentdataForMISCommonReport = vm.sourceDataForMISCommonReport.length;
          vm.gridOptionsForMISCommonReport.gridApi.infiniteScroll.resetScroll();
        }
        vm.gridOptionsForMISCommonReport.clearSelectedRows();

        if (vm.totalSourceDataCountForMISCommonReport == 0) {
          vm.gridOptionsForMISCommonReport.showColumnFooter = false;
          if (vm.pagingInfoForMISCommonReport.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
            vm.isNoDataFoundForMISCommonReport = false;
            vm.emptyStateForMISCommonReport = 0;
          }
          else {
            vm.isNoDataFoundForMISCommonReport = true;
            vm.emptyStateForMISCommonReport = null;
          }
        }
        else {
          vm.gridOptionsForMISCommonReport.showColumnFooter = true; /* to display column footer like "total" */

          /* [S] Set code to bind header fields */
          let notAddedFieldList = [], removeAlreadyAddedFieldList = [];
          let notAddedFieldListAllDetails = [];

          let sourceHeaderAvailableFieldList = _.map(vm.sourceHeaderForMISCommonReport, 'field');
          // fieldsSelectionList is come from view means fields from view
          notAddedFieldList = fieldsSelectionList.filter(val => !sourceHeaderAvailableFieldList.includes(val));
          removeAlreadyAddedFieldList = sourceHeaderAvailableFieldList.filter(val => !fieldsSelectionList.includes(val));


          if (notAddedFieldList.length > 0) {
            /* set order by column as defined in db */
            let filteredList = [];
            let filterOrderlist = [];

            filteredList = fieldsListToMatch.map(function (data) {
              vm.misReportFilterDetails.dynamicReportFields.map(function (item) {
                if (data.field == item.Fields) {
                  data.orderBy = item.orderBy;
                }
              });
              return data;
            });

            filterOrderlist = filteredList.filter(function (data) {
              if (data.orderBy) {
                return data;
              }
            });


            filterOrderlist.sort(sortAlphabatically('orderBy', 'displayName', true)); // sorting of fields
            let notAddedFieldSortedList = _.map(filterOrderlist, 'field');
            let totLengthOfNotAddedFields = notAddedFieldList.length;
            // sorting of actual not added fields based on sorted fields with details
            notAddedFieldSortedList = _.map(notAddedFieldSortedList, _.method('toLowerCase'));
            notAddedFieldList = _.sortBy(notAddedFieldList, function (item) {
              return notAddedFieldSortedList.indexOf(item.toLowerCase()) !== -1 ? notAddedFieldSortedList.indexOf(item.toLowerCase()) : totLengthOfNotAddedFields;
            });

            /* set not added fields in header with formation */
            if (sourceHeaderAvailableFieldList.length == 0) {
              // vm.sourceHeaderForMISCommonReport = [];
              let _obj = {};
              _obj.field = '#';
              _obj.width = '70';
              _obj.cellTemplate = '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>';
              _obj.enableFiltering = false;
              _obj.enableSorting = false;
              _obj.enableGrouping = false;
              vm.sourceHeaderForMISCommonReport.push(_obj);
            }

            _.each(notAddedFieldList, (fielditem) => {
              //fielditem = fielditem.replace(/`/g, "");

              let _matchField = _.find(fieldsListToMatch, (item) => {
                //item.field = item.field.replace(/`/g, "");
                return fielditem.toLowerCase() == item.field.toLowerCase();
              });
              if (_matchField) {
                let _obj = {};
                _obj.field = fielditem;
                _obj.displayName = _matchField.displayName;
                _obj.width = _matchField.fieldWidth ? _matchField.fieldWidth : REPORTS.Mis_report_default_field_width;

                if (_matchField.dataType == FIELD_DATATYPES.TEXT || _matchField.dataType == FIELD_DATATYPES.LONGTEXT) {
                  _obj.cellTemplate = '<md-button class="md-warn md-hue-1 margin-0" ng-click="grid.appScope.$parent.vm.showDescription(row.entity,\'' + fielditem.replace(/'/g, "\\'") + '\', $event)"> \
                                   View \
                                </md-button>';
                  _obj.exporterSuppressExport = true;
                }
                else if (_matchField.dataType == FIELD_DATATYPES.DATE) {
                  _obj.cellTemplate = '<div class="ui-grid-cell-contents">{{row.entity[\'' + fielditem + '\'] | date:grid.appScope.$parent.vm.defaultDateFormat}}</div>';
                  _obj.type = 'date';
                }
                else if (_matchField.dataType == FIELD_DATATYPES.TIME) {
                  _obj.cellTemplate = '<div class="ui-grid-cell-contents">{{row.entity[\'' + fielditem + '\'] | date:grid.appScope.$parent.vm.defaultTimeFormat}}</div>';
                  _obj.type = 'time';
                }
                else if (_matchField.dataType == FIELD_DATATYPES.DATETIME) {
                  _obj.cellTemplate = '<div class="ui-grid-cell-contents">{{row.entity[\'' + fielditem + '\'] | date:grid.appScope.$parent.vm.defaultDateTimeFormat}}</div>';
                  _obj.type = 'datetime';
                }
                else if (_matchField.dataType == FIELD_DATATYPES.INT || _matchField.dataType == FIELD_DATATYPES.DECIMAL || _matchField.dataType == FIELD_DATATYPES.BIGINT) {
                  _obj.cellTemplate = '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD ? grid.appScope.$parent.vm.NegativeNumAsPositive(row.entity,\'' + fielditem.replace(/'/g, "\\'") + '\') : COL_FIELD}}</div>';
                }
                if (_matchField.aggregate == CORE.CHART_RAWDATA_CATEGORY_FIELDS.AGGREGATE.SUM) {
                  _obj.treeAggregationType = uiGridGroupingConstants.aggregation.SUM;
                  _obj.footerCellTemplate = '<div class="ui-grid-cell-contents" >{{col.getAggregationValue() ? grid.appScope.$parent.vm.NegativeNumAsPositiveForFooter(col.getAggregationValue()) : ""}}</div>';
                }
                vm.sourceHeaderForMISCommonReport.push(_obj);
              }
            });
          }

          if (removeAlreadyAddedFieldList.length > 0) {
            _.each(removeAlreadyAddedFieldList, (removeitem) => {
              return _.remove(vm.sourceHeaderForMISCommonReport, (obj) => {
                return obj.field == removeitem && obj.field != "#";
              });
            });
          }
          /* [E] Set code to bind header fields */

          vm.isNoDataFoundForMISCommonReport = false;
          vm.emptyStateForMISCommonReport = null;
        }

        $timeout(() => {
          vm.resetSourceGridForMISCommonReport();
          if (!vm.gridOptionsForMISCommonReport.enablePaging && vm.totalSourceDataCountForMISCommonReport == vm.currentdataForMISCommonReport) {
            vm.gridOptionsForMISCommonReport.gridApi.infiniteScroll.dataLoaded(false, false);
          }
          vm.gridOptionsForMISCommonReport.gridApi.grid.queueGridRefresh();
        });
      }


      /* Show Description*/
      vm.showDescription = (object, field, ev) => {
        let data = {
          title: 'Operation',
          description: object[field],
          name: object["OP Name"]
        }
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          data).then(() => {
          }, (err) => {
            return BaseService.getErrorLog(err);
          });
      }

      vm.NegativeNumAsPositive = (object, field) => {
        return parseInt(object[field]) < 0 ? "(" + Math.abs(object[field]) + ")" : object[field];
      }

      vm.NegativeNumAsPositiveForFooter = (value) => {
        let valueWithText, formattedValue = null;
        valueWithText = value.split(':');  // like Total: -1021 so split
        if (valueWithText && valueWithText[0] && valueWithText[1]) {
          formattedValue = parseInt(valueWithText[1].trim()) < 0 ? "(" + Math.abs(valueWithText[1].trim()) + ")" : valueWithText[1];
          return valueWithText[0] + ": " + formattedValue;
        }
        else {
          return "";
        }
      }

      function DisplayExpression(data) {
        $scope.expressionui = "";
        groupCount = 0;
        count = 0;
        sublevelCount = 0;
        _.each(data, function (group) {
          if (group.Nodes.length > 0) {
            DisplaySubExpression(group);
          }
        });
        if (sublevelCount > 0) {
          for (var o = 0; o < sublevelCount; o++) {
            $scope.expressionui += ' ) ';
          }
        }
      };

      function DisplaySubExpression(group) {
        _.each(group.Nodes, function (node, index) {

          if (index > 0 && group.Condition) {
            $scope.expressionui += ' ' + '<span style="color:red;">' + (node.Condition || group.Condition) + '</span>';
          }
          if (node.Selected) {
            if (groupCount > 0 && count !== groupCount) {
              count = groupCount;
              $scope.expressionui += ' ( ';
            }
            if (node.Selected.OptionType == vm.OptionTypeArr[0]) {
              var valText = "";
              if (vm.datatypes.NUMBER.indexOf(node.datatype) != -1) {
                valText = node.OperatorValue != null ? node.OperatorValue : "";
              }
              else if (vm.datatypes.STRING.indexOf(node.datatype) != -1) {
                valText = node.OperatorValue != null ? stringFormat("'{0}'", node.OperatorValue) : "";
              }
              else if (vm.datatypes.DATE.indexOf(node.datatype) != -1) {
                valText = node.OperatorValue != null ? stringFormat("'{0}'", $filter('date')(new Date(node.OperatorValue), vm.defaultDateFormat)) : "";
              }
              else if (vm.datatypes.TIME.indexOf(node.datatype) != -1) {
                valText = node.OperatorValue != null ? stringFormat("'{0}'", node.OperatorValue) : "";
              }
              else {
                valText = node.Selected.BooleanVal != null ? node.Selected.BooleanVal.Name : "";
              }
              $scope.expressionui += ' ' + node.Selected.FieldName.displayName + ' ' + node.Selected.Operator.Value + ' ' + valText;
            }
            if (node.Selected.OptionType == vm.OptionTypeArr[1]) {
              $scope.expressionui += ' ( ' + node.Selected.SelectedExpression.Expression + ' ' + node.Selected.Operator.Value + ' ' + node.OperatorValue + ' ) ';
            }
          }
          if (groupCount > 0 && group.ParentGroupLevel != null && index == group.Nodes.length - 1) {
            if (group.SubLevel == 1) {
              $scope.expressionui += ' ) ';
            }
            if (group.SubLevel > 1) {
              sublevelCount++;
            }
          }
          if (node.Nodes && node.Nodes.length > 0) {
            groupCount++;
            DisplaySubExpression(node);
          }
        });
      };


    }
  }
})();
