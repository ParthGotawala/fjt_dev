(function () {
  'use strict';

  angular
    .module('app.reports.misreport')
    .controller('MISReportController', MISReportController);

  /** @ngInject */
  function MISReportController($timeout, $scope, CORE, REPORTS, BaseService, DialogFactory, $filter
    , WidgetFactory, $q, DynamicReportMstFactory, $mdDialog) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.setScrollClass = 'gridScrollHeight_MISReport';
    let loginUserDetails = BaseService.loginUser;
    //vm.loginUserID = loginUserDetails.userid;
    vm.isUserSuperAdmin = loginUserDetails.isUserSuperAdmin ? loginUserDetails.isUserSuperAdmin : false;
    //vm.containRoleOtherThanOperator = _.some(loginUserDetails.roles, (role) => {
    //    return role.name.toLowerCase() != CORE.Role.Operator.toLowerCase();
    //});

    //let loginUserRoleDet = _.find(loginUserDetails.roles,(item)=>{
    //    return item.id == loginUserDetails.defaultLoginRoleID;
    //})
    //if(loginUserRoleDet){
    //    vm.containRoleOtherThanOperator = loginUserRoleDet.name.toLowerCase() != CORE.Role.Operator.toLowerCase();
    //}

    var Filteroption = null;
    vm.isFilter = false;
    var groupCount = 0;
    var count = 0;
    var sublevelCount = 0;
    vm.OptionTypeArr = CORE.OPTIONTYPES;
    vm.datatypes = CORE.DATATYPE;
    vm.isHideDelete = true;

    // // on state change success for select index of tabs
    // let stateChangeSuccessCall = $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    //     console.log('stateChanged');
    //     $timeout(() => {
    //         // Check Feature Rights
    //         vm.enableEditMISReport = BaseService.checkFeatureRights(CORE.FEATURE_NAME.EditMISReport);
    //         vm.enableDeleteMISReport = BaseService.checkFeatureRights(CORE.FEATURE_NAME.DeleteMISReport);
    //     }, _configTimeout);
    // });

    let reTryCount = 0;
    let getAllRights = () => {
      vm.enableAddMISReport = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AddMISReport);
      vm.enableEditMISReport = BaseService.checkFeatureRights(CORE.FEATURE_NAME.EditMISReport);
      vm.enableDeleteMISReport = BaseService.checkFeatureRights(CORE.FEATURE_NAME.DeleteMISReport);
      if ((vm.enableAddMISReport == null || vm.enableAddMISReport == undefined ||
        vm.enableEditMISReport == null || vm.enableEditMISReport == undefined ||
        vm.enableDeleteMISReport == null || vm.enableDeleteMISReport == undefined)
        && (reTryCount < _configGetFeaturesRetryCount)) {
        getAllRights(); //put for hard reload option as it will not get data from feature rights
        reTryCount++;
        // console.log(reTryCount);
      }
    }

    // on reload
    let stateChangeSuccessCall = $scope.$on('$viewContentLoaded', function () {
      $timeout(() => {
        getAllRights();
      }, _configTimeout);
    });

    let emptyState = REPORTS.REPORTS_EMPTYSTATE;
    vm.commonReportEmptyState = emptyState.MIS_COMMON_REPORT;
    vm.defaultDateFormat = _dateDisplayFormat;
    vm.defaultTimeFormat = _timeWithoutSecondDisplayFormat;
    vm.defaultDateTimeFormat = _dateTimeDisplayFormat;
    // console.log('3 - _dateTimeDisplayFormat : ' + _dateTimeDisplayFormat);
    //vm.misReportFilterDetails = {};
    vm.ReportOperation = REPORTS.ReportOperation;
    let FIELD_DATATYPES = REPORTS.FIELD_DATATYPES;
    let fieldsListToMatch = [];
    vm.selectedReportNameFromAutoComplete = null;

    /* ****[S] MIS Common report related code  **** */

    //vm.pagingInfoForMISCommonReport = {
    //    Page: CORE.UIGrid.Page(),
    //    //ItemsPerPage: CORE.UIGrid.ItemsPerPage(),
    //    SortColumns: [],
    //    SearchColumns: []
    //};

    //vm.gridOptionsForMISCommonReport = {
    //    showColumnFooter: true,
    //    enableRowHeaderSelection: false,
    //    enableFullRowSelection: false,
    //    enableRowSelection: true,
    //    multiSelect: true,
    //    filterOptions: vm.pagingInfoForMISCommonReport.SearchColumns,
    //    exporterMenuCsv: true,
    //    exporterCsvFilename: 'MIS Report.csv',
    //    enableGrouping: true,
    //};

    //let clearMISReportData = () => {
    //    vm.sourceDataForMISCommonReport = [];
    //    vm.sourceHeaderForMISCommonReport = [];
    //    vm.isNoDataFoundForMISCommonReport = true;
    //    vm.emptyStateForMISCommonReport = null;
    //    vm.pagingInfoForMISCommonReport.SortColumns = [];
    //    vm.pagingInfoForMISCommonReport.SearchColumns = [];
    //}

    let clearMISReportDetails = () => {
      vm.reportID = null;
      vm.selectedReportNameFromAutoComplete = null;
      Filteroption = null;
      $scope.expressionui = null;
      vm.misReportFilterDetails = {};
      vm.autoCompleteDynamicReportName.keyColumnId = null;
    }

    /* get all report columns for selected data source (db-view) */
    let retrieveDynamicReportMstDetByReportID = (reportParam) => {
      return DynamicReportMstFactory.getDynamicReportMstDetByReportID().save(reportParam).$promise.then((response) => {
        return response;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    /* get all report columns for selected data source (db-view) */
    let getReportColumnList = (chartRawDataCatID) => {

      if (!chartRawDataCatID) {
        return;
      }
      return WidgetFactory.getChartRawViewColumns().query({ id: chartRawDataCatID }).$promise.then((response) => {
        if (response && response.data) {
          return response;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    //vm.loadDataForMISCommonReport = (pagingInfo) => {
    //    if (vm.misReportFilterDetails.ID) {
    //        let objSelectedReport = {
    //            ID: vm.misReportFilterDetails.ID,
    //            ReportName: vm.misReportFilterDetails.ReportName
    //        }
    //        getMISReportDataBySelectedReport(objSelectedReport);
    //    }
    //    else {
    //        clearMISReportData();
    //    }
    //}

    /* [S] get mis report by selected report */
    let getMISReportDataBySelectedReport = (selectedReport) => {
      vm.isLoadReport = false;
      if (!selectedReport || !selectedReport.ID) {
        clearMISReportDetails();
      }
      else {
        vm.reportID = selectedReport.ID;
        vm.selectedReportNameFromAutoComplete = selectedReport.ReportName;
        let reportParam = {
          id: selectedReport.ID, reportName: selectedReport.ReportName
        }
        let selectedReportDetails = _.find(vm.dynamicReportMstlist, (item) => {
          return item.ID == selectedReport.ID;
        });
        if (!selectedReportDetails || !selectedReportDetails.chartRawDataCatID) {
          clearMISReportDetails();
        }

        let reportMstAllPromise = [retrieveDynamicReportMstDetByReportID(reportParam), getReportColumnList(selectedReportDetails.chartRawDataCatID)];
        vm.cgBusyLoading = $q.all(reportMstAllPromise).then((allResponses) => {
          if (allResponses && allResponses.length > 0 && allResponses && allResponses[0] && allResponses[1]
            && allResponses[0].status == CORE.ApiResponseTypeStatus.SUCCESS && allResponses[1].status == CORE.ApiResponseTypeStatus.SUCCESS) {

            vm.misReportFilterDetails = allResponses[0].data.dynamicReportMstdet;
            fieldsListToMatch = [];
            fieldsListToMatch = angular.copy(allResponses[1].data);

            if (!Filteroption) {
              DisplayExpression(JSON.parse(vm.misReportFilterDetails.Filter));
              vm.isFilter = false;
            } else {
              DisplayExpression(JSON.parse(Filteroption));
              vm.isFilter = true;
            }
            if (selectedReport && selectedReport.isOpenEditReportActionManual) {
              // open edit details popup in case of copy report action performed
              let createdNewCopiedReoprtDet = _.find(vm.dynamicReportMstlist, (reportItem) => {
                return reportItem.ID == selectedReport.ID
              })
              if (createdNewCopiedReoprtDet) {
                delete createdNewCopiedReoprtDet.isOpenEditReportActionManual;
              }
              let dummyEvent = angular.element.Event('click');
              angular.element('body').trigger(dummyEvent);
              vm.openReportFilterDetailPopup(dummyEvent, vm.ReportOperation.Update);
            }
          }
          else {
            clearMISReportDetails();
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      $timeout(() => {
        vm.isLoadReport = true;
      }, 500);

      ////vm.isNoDataFoundForMISCommonReport = true;
      //if (!selectedReport || !selectedReport.ID) {
      //    clearMISReportData();
      //    selectedReportNameFromAutoComplete = null;
      //    vm.pagingInfoForMISCommonReport.filteroption = null;
      //    Filteroption = null;
      //    $scope.expressionui = null;
      //    return;
      //}
      //selectedReportNameFromAutoComplete = selectedReport.ReportName;
      //vm.cgBusyLoading = DynamicReportMstFactory.getDynamicReportDetailsByReportID(vm.pagingInfoForMISCommonReport).query({ id: selectedReport.ID, reportName: selectedReport.ReportName }).$promise.then((res) => {
      //if (res.data && res.data.dynamicReportMstdet) {
      //    fieldsListToMatch = [];
      //    var cgPromise = [getReportColumnList(res.data.dynamicReportMstdet.chartRawDataCatID)];
      //    vm.cgBusyLoading = $q.all(cgPromise).then((fieldListResponses) => {
      //        fieldsListToMatch = angular.copy(fieldListResponses[0]);
      //        if (res.data.reportDatalist.length > 0)
      //            vm.sourceDataForMISCommonReport = res.data.reportDatalist;
      //        //_.each(vm.sourceDataForMISCommonReport, (data) => {
      //        //    _.each(data, (value, key) => {
      //        //        key = key.replace(/`/g, "");
      //        //    });
      //        //});
      //        vm.totalSourceDataCountForMISCommonReport = res.data.reportDatalist.length;
      //        vm.misReportFilterDetails = res.data.dynamicReportMstdet;
      //        if (!Filteroption) {
      //            DisplayExpression(JSON.parse(vm.misReportFilterDetails.Filter));
      //            vm.isFilter = false;
      //        } else {
      //            DisplayExpression(JSON.parse(Filteroption));
      //            vm.isFilter = true;
      //        }

      //        //let fieldsSelectionList = _.map(res.data.dynamicReportMstdet.dynamicReportFields, 'Fields');
      //        let fieldsSelectionList = _.keys(vm.sourceDataForMISCommonReport[0]);
      //        setGridOptionsAfterGetMISReportData(fieldsSelectionList);
      //        vm.gridOptionsForMISCommonReport.exporterCsvFilename = vm.misReportFilterDetails ? vm.misReportFilterDetails.ReportName + ".csv" : vm.gridOptionsForMISCommonReport.exporterCsvFilename;
      //    });
      //}
      //else {
      //    let fieldsSelectionList = [];
      //    if (!res.data && vm.pagingInfoForMISCommonReport.SearchColumns.length == 0) {
      //        vm.misReportFilterDetails = {};
      //    }
      //    vm.misReportFilterDetails = res.data ? res.data.dynamicReportMstdet : null;
      //    vm.sourceDataForMISCommonReport = [];
      //    vm.totalSourceDataCountForMISCommonReport = 0;
      //    setGridOptionsAfterGetMISReportData(fieldsSelectionList);
      //    //clearMISReportData();
      //}
      //}).catch((error) => {
      //    return BaseService.getErrorLog(error);
      //});
    }
    /* [E] get mis report by selected report */

    ///* [S] set grid column definitions and other options */
    //let setGridOptionsAfterGetMISReportData = (fieldsSelectionList) => {

    //    if (!vm.gridOptionsForMISCommonReport.enablePaging) {
    //        vm.currentdataForMISCommonReport = vm.sourceDataForMISCommonReport.length;
    //        vm.gridOptionsForMISCommonReport.gridApi.infiniteScroll.resetScroll();
    //    }
    //    vm.gridOptionsForMISCommonReport.clearSelectedRows();

    //    if (vm.totalSourceDataCountForMISCommonReport == 0) {
    //        vm.gridOptionsForMISCommonReport.showColumnFooter = false;
    //        if (vm.pagingInfoForMISCommonReport.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
    //            vm.isNoDataFoundForMISCommonReport = false;
    //            vm.emptyStateForMISCommonReport = 0;
    //        }
    //        else {
    //            vm.isNoDataFoundForMISCommonReport = true;
    //            vm.emptyStateForMISCommonReport = null;
    //        }
    //    }
    //    else {
    //        vm.gridOptionsForMISCommonReport.showColumnFooter = true; /* to display column footer like "total" */

    //        /* [S] Set code to bind header fields */
    //        let notAddedFieldList = [], removeAlreadyAddedFieldList = [];
    //        let notAddedFieldListAllDetails = [];

    //        let sourceHeaderAvailableFieldList = _.map(vm.sourceHeaderForMISCommonReport, 'field');
    //        notAddedFieldList = fieldsSelectionList.filter(val => !sourceHeaderAvailableFieldList.includes(val));
    //        removeAlreadyAddedFieldList = sourceHeaderAvailableFieldList.filter(val => !fieldsSelectionList.includes(val));


    //        if (notAddedFieldList.length > 0) {
    //            /* set order by column as defined in db */
    //            notAddedFieldListAllDetails = fieldsListToMatch.filter(e => (_.map(notAddedFieldList, _.method('toLowerCase'))).includes(e.field.toLowerCase()));
    //            notAddedFieldListAllDetails.sort(sortAlphabatically('displayOrder', 'displayName', true)); // sorting of fields
    //            let notAddedFieldSortedList = _.map(notAddedFieldListAllDetails, 'field');
    //            let totLengthOfNotAddedFields = notAddedFieldList.length;
    //            // sorting of actual not added fields based on sorted fields with details
    //            notAddedFieldList = _.sortBy(notAddedFieldList, function (item) {
    //                return notAddedFieldSortedList.indexOf(item) !== -1 ? notAddedFieldSortedList.indexOf(item) : totLengthOfNotAddedFields;
    //            });

    //            /* set not added fields in header with formation */
    //            if (sourceHeaderAvailableFieldList.length == 0) {
    //                // vm.sourceHeaderForMISCommonReport = [];
    //                let _obj = {};
    //                _obj.field = '#';
    //                _obj.width = '70';
    //                _obj.cellTemplate = '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>';
    //                _obj.enableFiltering = false;
    //                _obj.enableSorting = false;
    //                _obj.enableGrouping = false;
    //                vm.sourceHeaderForMISCommonReport.push(_obj);
    //            }

    //            _.each(notAddedFieldList, (fielditem) => {
    //                //fielditem = fielditem.replace(/`/g, "");

    //                let _matchField = _.find(fieldsListToMatch, (item) => {
    //                    //item.field = item.field.replace(/`/g, "");
    //                    return fielditem.toLowerCase() == item.field.toLowerCase();
    //                });
    //                if (_matchField) {
    //                    let _obj = {};
    //                    _obj.field = fielditem;
    //                    _obj.displayName = _matchField.displayName;
    //                    _obj.width = _matchField.fieldWidth ? _matchField.fieldWidth : REPORTS.Mis_report_default_field_width;

    //                    if (_matchField.dataType == FIELD_DATATYPES.TEXT || _matchField.dataType == FIELD_DATATYPES.LONGTEXT) {
    //                        _obj.cellTemplate = '<md-button class="md-warn md-hue-1 margin-0" ng-click="grid.appScope.$parent.vm.showDescription(row.entity,\'' + fielditem.replace(/'/g, "\\'") + '\', $event)"> \
    //                           View \
    //                        </md-button>';
    //                    }
    //                    else if (_matchField.dataType == FIELD_DATATYPES.DATE) {
    //                        _obj.cellTemplate = '<div class="ui-grid-cell-contents">{{row.entity[\'' + fielditem + '\'] | date:grid.appScope.$parent.vm.defaultDateFormat}}</div>'
    //                    }
    //                    else if (_matchField.dataType == FIELD_DATATYPES.TIME) {
    //                        _obj.cellTemplate = '<div class="ui-grid-cell-contents">{{row.entity[\'' + fielditem + '\'] | date:grid.appScope.$parent.vm.defaultTimeFormat}}</div>'
    //                    }
    //                    else if (_matchField.dataType == FIELD_DATATYPES.DATETIME) {
    //                        _obj.cellTemplate = '<div class="ui-grid-cell-contents">{{row.entity[\'' + fielditem + '\'] | date:grid.appScope.$parent.vm.defaultDateTimeFormat}}</div>'
    //                    }
    //                    else if (_matchField.dataType == FIELD_DATATYPES.INT || _matchField.dataType == FIELD_DATATYPES.DECIMAL || _matchField.dataType == FIELD_DATATYPES.BIGINT) {
    //                        _obj.cellTemplate = '<div class="ui-grid-cell-contents text-left">{{COL_FIELD ? grid.appScope.$parent.vm.NegativeNumAsPositive(row.entity,\'' + fielditem.replace(/'/g, "\\'") + '\') : COL_FIELD}}</div>';
    //                    }
    //                    if (_matchField.aggregate == CORE.CHART_RAWDATA_CATEGORY_FIELDS.AGGREGATE.SUM) {
    //                        _obj.treeAggregationType = uiGridGroupingConstants.aggregation.SUM;
    //                        _obj.footerCellTemplate = '<div class="ui-grid-cell-contents" >{{col.getAggregationValue() ? grid.appScope.$parent.vm.NegativeNumAsPositiveForFooter(col.getAggregationValue()) : ""}}</div>';
    //                    }
    //                    vm.sourceHeaderForMISCommonReport.push(_obj);
    //                }
    //            });
    //        }

    //        if (removeAlreadyAddedFieldList.length > 0) {
    //            _.each(removeAlreadyAddedFieldList, (removeitem) => {
    //                return _.remove(vm.sourceHeaderForMISCommonReport, (obj) => {
    //                    return obj.field == removeitem && obj.field != "#";
    //                });
    //            });
    //        }
    //        /* [E] Set code to bind header fields */

    //        vm.isNoDataFoundForMISCommonReport = false;
    //        vm.emptyStateForMISCommonReport = null;
    //    }

    //    $timeout(() => {
    //        vm.resetSourceGridForMISCommonReport();
    //        if (!vm.gridOptionsForMISCommonReport.enablePaging && vm.totalSourceDataCountForMISCommonReport == vm.currentdataForMISCommonReport) {
    //            vm.gridOptionsForMISCommonReport.gridApi.infiniteScroll.dataLoaded(false, false);
    //        }
    //        vm.gridOptionsForMISCommonReport.gridApi.grid.queueGridRefresh();
    //    });
    //}
    ///* [E] set grid column definitions and other options */

    /* [S] get report names to set in autocomplete */
    let getDynamicReportNames = () => {
      return DynamicReportMstFactory.getDynamicReportNames().query({ EmployeeID: loginUserDetails.employee.id, isUserSuperAdmin: vm.isUserSuperAdmin }).$promise.then((res) => {
        if (res.data && res.data.dynamicReportMstlist.length > 0) {
          vm.dynamicReportMstlist = res.data.dynamicReportMstlist;
        }
        else {
          vm.dynamicReportMstlist = [];
        }
        return vm.dynamicReportMstlist;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    /* [E] get report names to set in autocomplete */

    vm.autoCompleteDynamicReportName = {
      columnName: 'ReportName',
      keyColumnName: 'ID',
      keyColumnId: vm.misReportFilterDetails ? vm.misReportFilterDetails.ID : null,
      inputName: 'ReportName',
      placeholderName: 'Report Name',
      isRequired: false,
      isAddnew: false,
      callbackFn: getDynamicReportNames,
      onSelectCallbackFn: getMISReportDataBySelectedReport
    }

    getDynamicReportNames();

    /* [S] Open popup for filter report details */
    vm.openReportFilterDetailPopup = (ev, ReportOperation) => {
      let data = null;
      if (ReportOperation == vm.ReportOperation.Update) {
        data = {};
        data.misReportFilterDetails = vm.misReportFilterDetails;
      }

      DialogFactory.dialogService(
        REPORTS.MANAGE_REPORT_DETAIL_MODAL_CONTROLLER,
        REPORTS.MANAGE_REPORT_DETAIL_MODAL_VIEW,
        ev,
        data).then((dynamicReportID) => {
          if (dynamicReportID) {
            let accessDynamicReportID = dynamicReportID;
            vm.autoCompleteDynamicReportName.keyColumnId = null;
            var cgPromise = [getDynamicReportNames()];
            vm.cgBusyLoading = $q.all(cgPromise).then((responses) => {
              if (vm.dynamicReportMstlist.length > 0) {
                vm.autoCompleteDynamicReportName.keyColumnId = accessDynamicReportID;
                vm.autoCompleteDynamicReportNameForPivotReport.keyColumnId = null;
              }
            });
          }
          else {
            //clearMISReportData();
            clearMISReportDetails();
          }
        }, (error) => {
          return BaseService.getErrorLog(error);
        });
    }
    /* [E] Open popup for filter report details */

    /* [S] - delete selected mis report (from auto complete) */
    vm.deleteMISReport = () => {
      if (vm.autoCompleteDynamicReportName && vm.autoCompleteDynamicReportName.keyColumnId) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, vm.selectedReportNameFromAutoComplete, 1);
        let obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = DynamicReportMstFactory.deleteDynamicReportDetailsByReportID().delete({
              id: vm.autoCompleteDynamicReportName.keyColumnId, reportName: vm.selectedReportNameFromAutoComplete
            }).$promise.then((res) => {
              if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                //clearMISReportData();
                //vm.autoCompleteDynamicReportName.keyColumnId = null;
                clearMISReportDetails();
                $timeout(() => {
                  getDynamicReportNames();
                }, true);
              }
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }

        }, (cancel) => {
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else {
        //show validation message no data selected
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, "report");
        let alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    }
    /* [E] - delete selected (from auto complete) mis report details */


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

    /* open popup to add employee for view mis reports */
    vm.selectMISReportEmployee = (ev) => {
      let data = {
        dynamicReportID: vm.misReportFilterDetails.ID,
        reportName: vm.misReportFilterDetails.ReportName,
        reportCreatedByUserDet: vm.misReportFilterDetails.user
      }
      DialogFactory.dialogService(
        REPORTS.MANAGE_MIS_REPORT_EMPLOYEE_CONTROLLER,
        REPORTS.MANAGE_MIS_REPORT_EMPLOYEE_VIEW,
        ev,
        data).then(() => {
        }, (data) => {

        },
          (err) => {
          });
    }

    /* pin/unpin mis report to dashboard */
    vm.pinUnpinMISReportToDashboard = () => {

      const pinnReportInfo = {
        ID: vm.misReportFilterDetails.ID,
        ReportName: vm.misReportFilterDetails.ReportName,
        isPinToDashboard: !vm.misReportFilterDetails.isPinToDashboard
      };

      vm.cgBusyLoading = DynamicReportMstFactory.pinMisReportToDashBoard().save(pinnReportInfo).$promise.then((res) => {
        if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.misReportFilterDetails.isPinToDashboard = !vm.misReportFilterDetails.isPinToDashboard
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    // open popup to copy existing report all details with new name
    vm.openCopyReportDetailPopup = () => {
      if (vm.autoCompleteDynamicReportName && vm.autoCompleteDynamicReportName.keyColumnId) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.COPY_MIS_REPORT_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.misReportFilterDetails.ReportName);
        let obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            let copyFromReportData = {
              copyFromDynamicReportMstID: vm.autoCompleteDynamicReportName.keyColumnId,
            }
            vm.cgBusyLoading = DynamicReportMstFactory.copyMISReportFromExistingReport().save(copyFromReportData).$promise.then((res) => {
              if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS && res.data && res.data.createdReportDet) {
                vm.autoCompleteDynamicReportName.keyColumnId = null;
                var cgPromise = [getDynamicReportNames()];
                vm.cgBusyLoading = $q.all(cgPromise).then((responses) => {
                  if (vm.dynamicReportMstlist.length > 0) {
                    let createdNewCopiedReoprtDet = _.find(vm.dynamicReportMstlist, (reportItem) => {
                      return reportItem.ID == res.data.createdReportDet.ID
                    })
                    if (createdNewCopiedReoprtDet) {
                      createdNewCopiedReoprtDet.isOpenEditReportActionManual = true;
                      vm.autoCompleteDynamicReportName.keyColumnId = res.data.createdReportDet.ID;
                    }
                    vm.autoCompleteDynamicReportNameForPivotReport.keyColumnId = null;
                  }
                });
              }
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }
        }, (cancel) => {
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }

    /* *************** Pivot Report **************** */

    let sourceDataForMISPivotReport = [];
    let pivotReportFilterDetails = {};
    vm.isDataFoundForPivotReport = false;

    /* on click of "View Pivot Report" button from general report tab */
    vm.loadPivotUiForSelectedReport = (msWizard) => {
      if (vm.misReportFilterDetails && vm.misReportFilterDetails.ID) {
        /* if autocomplete contain same report then need to get updated data as selected index change will not call automatic */
        if (vm.autoCompleteDynamicReportNameForPivotReport.keyColumnId == vm.misReportFilterDetails.ID) {
          clearDataForPivotReport();
          vm.autoCompleteDynamicReportNameForPivotReport.keyColumnId = vm.misReportFilterDetails.ID;
          let objSelectedReport = {
            ID: vm.misReportFilterDetails.ID,
            ReportName: vm.misReportFilterDetails.ReportName
          }
          getPivotReportDataBySelectedReport(objSelectedReport);
        }
        else {
          clearDataForPivotReport();
          vm.autoCompleteDynamicReportNameForPivotReport.keyColumnId = vm.misReportFilterDetails.ID;
        }
      }
      msWizard.nextStep();
    }

    /* to get selected report data for apply in pivot report */
    let getPivotReportDataBySelectedReport = (selectedReport) => {
      if (!selectedReport || !selectedReport.ID) {
        clearDataForPivotReport();
        return;
      }

      vm.cgBusyLoading = DynamicReportMstFactory.getDynamicReportDetailsByReportID().query({ id: selectedReport.ID, reportName: selectedReport.ReportName }).$promise.then((res) => {
        if (res.data && res.data.reportDatalist.length > 0 && res.data.dynamicReportMstdet) {
          vm.isDataFoundForPivotReport = true;
          sourceDataForMISPivotReport = res.data.reportDatalist;
          pivotReportFilterDetails = res.data.dynamicReportMstdet;
          if (sourceDataForMISPivotReport && sourceDataForMISPivotReport.length > 0
            && pivotReportFilterDetails.chartRawdataCategory && pivotReportFilterDetails.chartRawdataCategory.chartRawdataCategoryFields && pivotReportFilterDetails.chartRawdataCategory.chartRawdataCategoryFields.length > 0) {
            sourceDataForMISPivotReport = sourceDataForMISPivotReport.map(item => {
              return _.mapKeys(item, (value, key) => {
                var objDisplayField = _.find(pivotReportFilterDetails.chartRawdataCategory.chartRawdataCategoryFields, { field: key });
                if (objDisplayField) {
                  return objDisplayField.displayName;
                }
              })
            });
          }
          $timeout(() => {
            pivotUiForSelectedPivotReport();
          });
        }
        else {
          clearDataForPivotReport();
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    /* pivot report different renderers to apply with data source  */
    let pivotUiForSelectedPivotReport = () => {
      let renderersForSelectedReport = $.extend(
        $.pivotUtilities.renderers,
        $.pivotUtilities.c3_renderers,
        $.pivotUtilities.d3_renderers,
        $.pivotUtilities.export_renderers,
        $.pivotUtilities.plotly_renderers
      );

      if (pivotReportFilterDetails.pivotJsonData) {
        $("#outputForPivotReport").pivotUI(sourceDataForMISPivotReport, JSON.parse(pivotReportFilterDetails.pivotJsonData), true);
      } else {
        let fieldsSelectionListForPivotReport = _.map(pivotReportFilterDetails.dynamicReportFields, 'Fields');

        $("#outputForPivotReport").pivotUI(sourceDataForMISPivotReport, {
          renderers: renderersForSelectedReport,
          rows: [fieldsSelectionListForPivotReport[0]],
          cols: [fieldsSelectionListForPivotReport[1]],
          rendererName: "Table",
        });
      }
    }

    vm.saveReportData = (event) => {
      let config = $("#outputForPivotReport").data("pivotUIOptions");
      if (config) {
        var config_copy = JSON.parse(JSON.stringify(config));
        //delete some values which will not serialize to JSON
        delete config_copy["aggregators"];
        delete config_copy["renderers"];
        let pivot_json = JSON.stringify(config_copy);
        if (pivot_json && vm.autoCompleteDynamicReportNameForPivotReport && vm.autoCompleteDynamicReportNameForPivotReport.keyColumnId) {
          const reportInfo = {
            pivotJsonData: pivot_json,
            ReportName: pivotReportFilterDetails.ReportName,
            ID: vm.autoCompleteDynamicReportNameForPivotReport.keyColumnId
          };
          vm.cgBusyLoading = DynamicReportMstFactory.updateDynamicReportPivotJsonData().save(reportInfo).$promise.then((res) => {
            // message appear after save succesfully
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
      }
    };

    vm.autoCompleteDynamicReportNameForPivotReport = {
      columnName: 'ReportName',
      keyColumnName: 'ID',
      keyColumnId: pivotReportFilterDetails.ID ? pivotReportFilterDetails.ID : null,
      inputName: 'ReportName',
      placeholderName: 'Report Name',
      isRequired: false,
      isAddnew: false,
      callbackFn: getDynamicReportNames,
      onSelectCallbackFn: getPivotReportDataBySelectedReport
    }

    let clearDataForPivotReport = () => {
      sourceDataForMISPivotReport = [];
      pivotReportFilterDetails = {};
      vm.isDataFoundForPivotReport = false;
    }

    /* on click of "Pivot Report" Tab */
    vm.loadPivotReportTab = () => {
      if (vm.autoCompleteDynamicReportNameForPivotReport && vm.autoCompleteDynamicReportNameForPivotReport.keyColumnId) {
        vm.autoCompleteDynamicReportNameForPivotReport.keyColumnId = null;
      }
    }

    $scope.$on('$destroy', function () {
      stateChangeSuccessCall();
      $mdDialog.hide(false, { closeAll: true });
    });

    /* open popup to add filter condition */
    vm.addCondition = function ($event) {
      let FilterData = null;
      if (!Filteroption) {
        if (vm.misReportFilterDetails.Filter) {
          FilterData = JSON.parse(vm.misReportFilterDetails.Filter);
        }
      } else {
        FilterData = JSON.parse(Filteroption);
      }
      var data = {
        axisList: fieldsListToMatch,
        filterData: _.cloneDeep(FilterData)
      };

      DialogFactory.dialogService(
        CORE.WIDGET_FILTER_MODAL_CONTROLLER,
        CORE.WIDGET_FILTER_MODAL_VIEW,
        $event,
        data).then((response) => {
          if (response.isDirty) {
            vm.isLoadReport = false;
            vm.filterOptionInPagingInfo = null;
            if (!vm.misReportFilterDetails.Filter) {
              if (response.filterdata[0].Nodes.length > 0) {
                Filteroption = JSON.stringify(response.filterdata);
                vm.isFilter = true;
              }
              else {
                Filteroption = null;
                vm.isFilter = false;
              }
            } else {
              Filteroption = JSON.stringify(response.filterdata);
              vm.isFilter = true;
            }

            var where = JSON.stringify(response.filterdata);
            //vm.pagingInfoForMISCommonReport.filteroption = where;
            vm.filterOptionInPagingInfo = where;
            $timeout(() => {
              vm.isLoadReport = true;
            }, 500);
            //vm.loadDataForMISCommonReport(vm.pagingInfoForMISCommonReport);
            DisplayExpression(response.filterdata);
          }
        }, (response) => {
          /* empty */
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    };


    /* open popup to add filter condition */
    vm.clearCondition = function ($event) {
      vm.isLoadReport = false;
      Filteroption = null;
      //vm.pagingInfoForMISCommonReport.filteroption = null;
      vm.filterOptionInPagingInfo = null;
      $timeout(() => {
        vm.isLoadReport = true;
      }, 500);
      //vm.loadDataForMISCommonReport(vm.pagingInfoForMISCommonReport);
      DisplayExpression(null);

    };

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

    //close popup on page destroy 
    $scope.$on('$destroy', function () {
      $mdDialog.hide('', { closeAll: true });
    });
    //print pivot table details
    vm.printReport = (printsectionClass) => {
      var innerContents = document.getElementsByClassName(printsectionClass);
      if (innerContents && innerContents.length > 0) {
        innerContents = innerContents[0].innerHTML;
        var popupWinindow = window.open('', '_blank', 'width=700,height=700,scrollbars=yes,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        popupWinindow.document.open();
        popupWinindow.document.write('\
                <html>\
                    <head>\
          <h2>'+ pivotReportFilterDetails.ReportName+'</h2>\
                        <style>\
                            @page {\
                                size: A4;\
                                margin: 0;\
                             }\
          .pvtUi { color: #333; }\
   table.pvtTable {\
          font-size: 8pt;\
        text-align: left;\
        border-collapse: collapse;\
      }\
      table.pvtTable thead tr th, table.pvtTable tbody tr th {\
        background-color: #e6EEEE;\
        border: 1px solid #CDCDCD;\
        font-size: 8pt;\
        padding: 5px;\
      }\
      table.pvtTable.pvtColLabel { text-align: center; } \
      table.pvtTable.pvtTotalLabel { text-align: right; }\
      table.pvtTable tbody tr td {\
        color: #3D3D3D;\
        padding: 5px;\
        background - color: #FFF;\
        border: 1px solid #CDCDCD;\
        vertical-align: top;\
        text-align: right;\
      }\
.pvtTotal, .pvtGrandTotal { font-weight: bold; }\
.pvtVals { text-align: center; white-space: nowrap; }\
.pvtRowOrder, .pvtColOrder {\
        cursor: pointer;\
        width: 15px;\
        margin-left: 5px;\
        display: inline-block;\
      }\
.pvtAggregator { margin - bottom: 5px; }\
.pvtAxisContainer, .pvtVals {\
        border: 1px solid gray;\
        background: #EEE;\
        padding: 5px;\
        min-width: 20px;\
        min-height: 20px;\
        user-select: none;\
        -webkit-user-select: none;\
        -moz-user-select: none;\
        -khtml-user-select: none;\
        -ms-user-select: none;\
      }\
.pvtAxisContainer li {\
        padding: 8px 6px;\
        list-style-type: none;\
        cursor: move;\
      }\
.pvtAxisContainer li.pvtPlaceholder {\
        -webkit-border-radius: 5px;\
        padding: 3px 15px;\
        -moz-border-radius: 5px;\
        border-radius: 5px;\
        border: 1px dashed #aaa;\
      }\
.pvtAxisContainer li span.pvtAttr {\
        -webkit-text-size-adjust: 100 %;\
        background: #F3F3F3;\
        border: 1px solid #DEDEDE;\
        padding: 2px 5px;\
        white-space: nowrap;\
        -webkit-border-radius: 5px;\
        -moz-border-radius: 5px;\
        border-radius: 5px;\
      }\
.pvtTriangle {\
        cursor: pointer;\
        color: grey;\
      }\
.pvtHorizList li { display: inline; }\
.pvtVertList { vertical-align: top; }\
.pvtFilteredAttribute { font-style: italic }\
.pvtFilterBox{\
        z-index: 100;\
        width: 300px;\
        border: 1px solid gray;\
        background-color: #fff;\
        position: absolute;\
        text-align: center;\
      }\
.pvtFilterBox h4{ margin: 15px; }\
.pvtFilterBox p { margin: 10px auto; }\
.pvtFilterBox label { font-weight: normal; }\
.pvtFilterBox input[type = \'checkbox\'] { margin - right: 10px; margin-left: 10px; }\
.pvtFilterBox input[type = \'text\'] { width: 230px; }\
.pvtFilterBox.count { color: gray; font-weight: normal; margin-left: 3px; }\
.pvtCheckContainer{\
        text-align: left;\
        font-size: 14px;\
        white-space: nowrap;\
        overflow-y: scroll;\
        width: 100 %;\
        max-height: 250px;\
        border-top: 1px solid lightgrey;\
        border-bottom: 1px solid lightgrey;\
      }\
.pvtCheckContainer p{ margin: 5px; }\
.pvtRendererArea { padding: 5px; }\
                         </style>\
                      </head>\
                 <body onload="window.print()">' + innerContents + '\
              </html>');
        popupWinindow.document.close();
      }
    }

  }
})();
