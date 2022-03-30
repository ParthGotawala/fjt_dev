(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('workorderOperationFieldsHistory', workorderOperationFieldsHistory);

  /** @ngInject */
  function workorderOperationFieldsHistory($state, $timeout, $filter, CORE, REPORTS,
    EntityFactory, WorkorderDataelementFactory, BaseService, DialogFactory, WorkorderDataElementTransValueFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        woId: '@',
        woOpId: '@',
        calledFromPage: '=?',  // calledFromPage - not compulsory to pass
        woOpCustomDetails: '='
      },
      templateUrl: 'app/directives/custom/workorder-operation-fields-history/workorder-operation-fields-history.html',
      controller: workorderOperationFieldsHistoryCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for workorder operation fields directive
    *
    * @param
    */

    function workorderOperationFieldsHistoryCtrl($scope, $element, $attrs) {
      var vm = this;
      let OperationEntityID = CORE.AllEntityIDS.Operation.ID;
      vm.opDataelementReportEmptyState = REPORTS.REPORTS_EMPTYSTATE.OPERATION_DATAELEMENT_REPORT;
      vm.sourceHeaderForOpDataelementReport = [];
      let allowedFieldsControlTypesForSortingFiltering = [1, 2, 5, 7, 8, 9, 10, 11, 13, 14, 15]; /* id directly taken from core constant-InputeFields */
      let SelectedOperationEntity = null;
      let DataElementReportTransFields = CORE.DataElementReportTransFields;
      vm.isHideDelete = true;
      let woOpCustomDetails = $scope.woOpCustomDetails ? $scope.woOpCustomDetails : {};
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

      /* get operation entity with its all data elements */
      let getEntityWithDataElement = () => {
        let arr = [];
        arr.push(OperationEntityID);
        vm.cgBusyLoading = EntityFactory.getWithDataElementsByEntityIds().query({
          EntityIds: arr
        }).$promise.then((entity) => {
          if (entity && entity.data) {
            SelectedOperationEntity = _.filter(entity.data.entity, (ent) => {
              return ent.entityID == OperationEntityID;
            });
            SelectedOperationEntity = _.first(SelectedOperationEntity);
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      getEntityWithDataElement();

      vm.pagingInfoForOpDataelementReport = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: [],
        entityID: OperationEntityID,
        subFormDataElementID: null,
        woTransID: null,
        woID: $scope.woId,
        woOPID: $scope.woOpId
      };

      vm.gridOptionsForOpDataelementReport = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: true,
        multiSelect: true,
        filterOptions: vm.pagingInfoForOpDataelementReport.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Work_Order_Operation_DataTrackingEntity_Details.csv',
          flatEntityAccess: true /* To display field data When field contain dot > https://github.com/angular-ui/ui-grid/issues/3900 */,
          hideMultiDeleteButton: true
      };

      vm.loadDataForOpDataelementReport = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfoForOpDataelementReport, vm.gridOptionsForOpDataelementReport);
        vm.cgBusyLoading = WorkorderDataelementFactory.getWoTransactionDataElementValuesList().query(vm.pagingInfoForOpDataelementReport).$promise.then((elements) => {
          vm.gridOptionsForOpDataelementReport.exporterCsvFilename = stringFormat(CORE.FileName_Export_Format.DataTrackingEntity.woOp, woOpCustomDetails.woNumber, woOpCustomDetails.woVersion, woOpCustomDetails.opFullName);
          vm.sourceDataForOpDataelementReport = elements.data.woTransDEValuesList;
          vm.totalSourceDataCountForOpDataelementReport = elements.data.Count;
          let allElementFields = _.keys(vm.sourceDataForOpDataelementReport[0]);
          setGridOptionsAfterGetTransDataelementValuesList(allElementFields);
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      // set grid options after get trans dataelement values
      let setGridOptionsAfterGetTransDataelementValuesList = (fieldsSelectionList) => {
        if (!vm.gridOptionsForOpDataelementReport.enablePaging) {
          vm.currentdataForOpDataelementReport = vm.sourceDataForOpDataelementReport.length;
          vm.gridOptionsForOpDataelementReport.gridApi.infiniteScroll.resetScroll();
        }
        vm.gridOptionsForOpDataelementReport.clearSelectedRows();
        if (vm.totalSourceDataCountForOpDataelementReport == 0) {
          if (vm.pagingInfoForOpDataelementReport.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
            vm.isNoDataFoundForOpDataelementReport = false;
            vm.emptyStateForOpDataelementReport = 0;
          }
          else {
            vm.isNoDataFoundForOpDataelementReport = true;
            vm.emptyStateForOpDataelementReport = null;
          }
        }
        else {
          /* [S] Set code to bind header fields */

          /* as no need to display these fields */
          fieldsSelectionList = _.difference(fieldsSelectionList, ['woTransID', 'woTransDataElementIDs', 'entityID']);

          let notAddedFieldList = [], removeAlreadyAddedFieldList = [];
          let sourceHeaderAvailableFieldList = _.map(vm.sourceHeaderForOpDataelementReport, 'field');
          notAddedFieldList = fieldsSelectionList.filter(val => !sourceHeaderAvailableFieldList.includes(val));
          removeAlreadyAddedFieldList = sourceHeaderAvailableFieldList.filter(val => !fieldsSelectionList.includes(val));
          if (removeAlreadyAddedFieldList.length > 0) {
            removeAlreadyAddedFieldList = _.difference(removeAlreadyAddedFieldList, ['#', 'Action']); /* as no need to remove these fields */
          }

          if (notAddedFieldList.length > 0) {
            if (sourceHeaderAvailableFieldList.length == 0) {
              let _objIndex = {};
              _objIndex.field = '#';
              _objIndex.width = CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN;
              _objIndex.cellTemplate = '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference !== \'P\'">\
                            <span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span>\
                            </div>\
                            <div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference === \'P\'">\
                            <span><b>{{(grid.appScope.$parent.vm.pagingInfoForOpDataelementReport.pageSize * (grid.appScope.$parent.vm.pagingInfoForOpDataelementReport.Page - 1)) + (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1)}}</b></span>\
                            </div>';
              _objIndex.enableFiltering = false;
              _objIndex.enableSorting = false;
              vm.sourceHeaderForOpDataelementReport.push(_objIndex);
            }

            _.each(notAddedFieldList, (fielditem) => {
              let fieldNameWithControlType = fielditem.split('-##-');
              let controlTypeID = parseInt(fieldNameWithControlType[1]);

              let _obj = {};
              _obj.field = fielditem;
              _obj.displayName = fieldNameWithControlType[0];
              _obj.width = '100';

              if (controlTypeID == 1) {
                _obj.width = '300';
              }
              else if (controlTypeID == 2) {  /* number type fields to set decimal places */
                let defaultDecimalNumberItem = _.find(SelectedOperationEntity.dataElement, (item) => {
                  return item.dataElementID == fieldNameWithControlType[2];
                });
                if (defaultDecimalNumberItem && parseInt(defaultDecimalNumberItem.decimal_number) >= 0) {
                  _obj.cellTemplate = '<div flex="100" class="grid-cell-text-right" layout="column" layout-align="center end">{{COL_FIELD || 0 | number: "' + defaultDecimalNumberItem.decimal_number + '"}}</div>';
                }
                else {
                  _obj.cellTemplate = '<div flex="100" class="grid-cell-text-right" layout="column" layout-align="center end">{{COL_FIELD}}</div>';
                }
                _obj.width = '130';
              }
              else if (controlTypeID == 3 || controlTypeID == 4 || controlTypeID == 20) {  /* Description type fields */
                _obj.cellTemplate = '<md-button class="md-warn md-hue-1 margin-0" ng-click="grid.appScope.$parent.vm.showOperationDataElementDescription(row.entity,\'' + fielditem.replace(/'/g, "\\'") + '\', $event)"> \
                                   View \
                                </md-button>';
              }
              else if (controlTypeID == 5) { /* Date Time field */
                _obj.width = '180';
              }
              else if (controlTypeID == 6) { /* Date Range type field  */
                _obj.width = '210';
              }
              else if (controlTypeID == 8 || controlTypeID == 9 || controlTypeID == 10 || controlTypeID == 11) { /*  choice type field  */
                _obj.width = '300';
              }
              else if (controlTypeID == 12) {  /* Document Upload type fields */
                _obj.exporterSuppressExport = true;
                _obj.cellTemplate = '<md-button ng-if="COL_FIELD" class="md-warn md-hue-1 margin-0" ng-click="grid.appScope.$parent.vm.downloadDocument(row.entity,\'' + fielditem.replace(/'/g, "\\'") + '\')"> \
                                   {{COL_FIELD.split("|")[2]}} \
                                </md-button>';
                _obj.width = '250';
              }
              else if (controlTypeID == 13 || controlTypeID == 15) {  /* Email or URL type fields  */
                _obj.width = '300';
              }
              else if (controlTypeID == 16) {  /* signature field */
                _obj.cellTemplate = '<img ng-if="COL_FIELD" ng-src="{{COL_FIELD}}" alt="Signature">';
                _obj.exporterSuppressExport = true;
              }
              else if (controlTypeID == 18) {  /* sub-form field */
                _obj.exporterSuppressExport = true;
                _obj.cellTemplate = '<md-button class="md-warn md-hue-1 margin-0" ng-click="grid.appScope.$parent.vm.showOperationDataElementSubFormValues(row.entity,\'' + fielditem.replace(/'/g, "\\'") + '\', $event)"> \
                                   View({{COL_FIELD}}) \
                                </md-button>';
              }
              // else if (fielditem == "Transaction Date") {
              //     _obj.width = '180';
              //     _obj.enableSorting = true;
              // }

              if (!_.includes(allowedFieldsControlTypesForSortingFiltering, controlTypeID)) {
                _obj.enableFiltering = false;
                _obj.enableSorting = false;
              }
              if (fielditem == DataElementReportTransFields.Transaction_By) {
                _obj.enableFiltering = true;
                _obj.enableSorting = true;
                _obj.width = '110';
              }
              if (fielditem === DataElementReportTransFields.Transaction_Date) {
                _obj.enableSorting = true;
                _obj.width = '180';
              }
              vm.sourceHeaderForOpDataelementReport.push(_obj);
            });
          }

          if (removeAlreadyAddedFieldList.length > 0) {
            _.each(removeAlreadyAddedFieldList, (removeitem) => {
              return _.remove(vm.sourceHeaderForOpDataelementReport, (obj) => {
                return obj.field == removeitem;
              });
            });
          }
          /* [E] Set code to bind header fields */

          /* [S] to set default format of date time/date range data elements */
          _.each(vm.sourceDataForOpDataelementReport, (item) => {
            _.each(item, (value, key) => {
              if (value && key.includes("-##-")) {
                let fieldNameWithControlType = key.split('-##-');
                let controlTypeID = parseInt(fieldNameWithControlType[1]);
                if (controlTypeID == 5 || controlTypeID == 6) {
                  let dateTimeElement = _.find(SelectedOperationEntity.dataElement, (item) => {
                    return item.dataElementID == fieldNameWithControlType[2];
                  });
                  if (dateTimeElement && dateTimeElement.formatMask) {
                    let defaultDateFormat = dateTimeElement.formatMask;
                    if (controlTypeID == 5) { /* 5 - date time */
                      item[key] = $filter('date')(new Date(value), defaultDateFormat);
                    }
                    else if (controlTypeID == 6) { /* 6 - date range */
                      let fromToDate = value.split('|');
                      if (fromToDate[0] != "null" || fromToDate[1] != "null") {
                        item[key] = `${fromToDate[0] != "null" ? ($filter('date')(new Date(fromToDate[0]), defaultDateFormat)) : ''} | ${fromToDate[1] != "null" ? ($filter('date')(new Date(fromToDate[1]), defaultDateFormat)) : ''}`;
                      }
                      else {
                        item[key] = '';
                      }
                    }
                  }
                }
              }
            });

            // if (item["Transaction Date"]) { /* createdby - date */
            //     item["Transaction Date"] = $filter('date')(item["Transaction Date"], _dateTimeFullTimeDisplayFormat);
            // }
          });
          /* [E] to set default format of date time/date range data elements */

          vm.isNoDataFoundForOpDataelementReport = false;
          vm.emptyStateForOpDataelementReport = null;
        }
        $timeout(() => {
          vm.resetSourceGridForOpDataelementReport();
          if (!vm.gridOptionsForOpDataelementReport.enablePaging && vm.totalSourceDataCountForOpDataelementReport == vm.currentdataForOpDataelementReport) {
            return vm.gridOptionsForOpDataelementReport.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });
      }

      // get down for operation dataelement report
      vm.getDataDownForOpDataelementReport = () => {
        vm.pagingInfoForOpDataelementReport.Page = vm.pagingInfoForOpDataelementReport.Page + 1;
        vm.cgBusyLoading = WorkorderDataelementFactory.getWoTransactionDataElementValuesList().query(vm.pagingInfoForOpDataelementReport).$promise.then((elements) => {
          // _.each(elements.data.woTransDEValuesList, (item) => {
          //     if (item["Transaction Date"]) { /* createdby - date */
          //         item["Transaction Date"] = $filter('date')(item["Transaction Date"], _dateTimeFullTimeDisplayFormat);
          //     }
          // });
          vm.sourceDataForOpDataelementReport = vm.gridOptionsForOpDataelementReport.data = vm.sourceDataForOpDataelementReport.concat(elements.data.woTransDEValuesList);
          vm.currentdataForOpDataelementReport = vm.gridOptionsForOpDataelementReport.currentItem = vm.gridOptionsForOpDataelementReport.data.length;
          vm.gridOptionsForOpDataelementReport.gridApi.infiniteScroll.saveScrollPercentage();
          $timeout(() => {
            vm.resetSourceGridForOpDataelementReport();
            return vm.gridOptionsForOpDataelementReport.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCountForOpDataelementReport != vm.currentdataForOpDataelementReport ? true : false);
          });
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };


      /* Show Description*/
      vm.showOperationDataElementDescription = (object, field, ev) => {
        const data = {
          title: SelectedOperationEntity.entityName,
          description: object[field],
          name: field.split('-##-')[0]
        };
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          data).then(() => {
            vm.loadData();
          }, (err) => BaseService.getErrorLog(err));
      };

      /* Show Sub form Values */
      vm.showOperationDataElementSubFormValues = (object, field, ev) => {
        let data = {
          elementName: field.split('-##-')[0],
          dataElementID: field.split('-##-')[2],
          SelectedEntity: SelectedOperationEntity,
          woTransID: object.woTransID,
          woID: $scope.woId,
          woOPID: $scope.woOpId
        }

        DialogFactory.dialogService(
          REPORTS.VIEW_WO_TRANS_SUBFORM_VALUES_MODAL_CONTROLLER,
          REPORTS.VIEW_WO_TRANS_SUBFORM_VALUES_MODAL_VIEW,
          ev,
          data).then(() => {
          }, (err) => {
            return BaseService.getErrorLog(err);
          });
      };

      /* To download selected document  */
      vm.downloadDocument = (object, field, callingFor) => {
        let fileDetail = object[field].split('|');
        let file = {};
        file.mimetype = fileDetail.length > 1 ? fileDetail[1] : "";
        file.originalname = fileDetail.length > 2 ? fileDetail[2] : "";

        let documentObj = {
          entityID: object.entityID,
          dataElementID: field.split('-##-')[2],
          woTransID: object.woTransID,
          woOPID: $scope.woOpId,
          woTransDataElementIDs: object.woTransDataElementIDs
        }

        vm.cgBusyLoading = WorkorderDataElementTransValueFactory.downloadDocumentByRefID(documentObj).then((response) => {
          if (_.includes([404, 403, 401], response.status)) {
            var model = {
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: '',
              multiple: true
            };
          }
          if (response.status == 404) {
            model.textContent = CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.NotFound;
            DialogFactory.alertDialog(model);
          } else if (response.status == 403) {
            model.textContent = CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.AccessDenied;
            DialogFactory.alertDialog(model);
          } else if (response.status == 401) {
            model.textContent = CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.Unauthorized;
            DialogFactory.alertDialog(model);
          }
          else {
            let blob = new Blob([response.data], { type: file.mimetype });
            if (navigator.msSaveOrOpenBlob) {
              navigator.msSaveOrOpenBlob(blob, file.originalname);
            } else {
              let link = document.createElement("a");
              if (link.download !== undefined) {
                let url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", file.originalname);
                link.style = "visibility:hidden";
                document.body.appendChild(link);
                $timeout(() => {
                  link.click();
                  document.body.removeChild(link);
                });

              }
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };

    }
  }
})();
