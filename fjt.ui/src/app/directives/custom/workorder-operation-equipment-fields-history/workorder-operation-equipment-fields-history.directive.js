(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('workorderOperationEquipmentFieldsHistory', workorderOperationEquipmentFieldsHistory);

  /** @ngInject */
  function workorderOperationEquipmentFieldsHistory($state, $timeout, $filter, CORE, REPORTS,
    EntityFactory, WorkorderDataelementFactory, BaseService, DialogFactory, WorkorderEquipmentDataElementTransValueFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        woId: '@',
        woOpId: '@',
        eqpId: '@',
        calledFromPage: '=?',  // calledFromPage - not compulsory to pass
        woOpCustomDetails: '='
      },
      templateUrl: 'app/directives/custom/workorder-operation-equipment-fields-history/workorder-operation-equipment-fields-history.html',
      controller: workorderOperationEquipmentFieldsHistoryCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for workorder operation fields directive
    *
    * @param
    */

    function workorderOperationEquipmentFieldsHistoryCtrl($scope, $element, $attrs) {
      var vm = this;
      let EquipmentEntityID = CORE.AllEntityIDS.Equipment.ID;
      vm.eqpDataelementReportEmptyState = REPORTS.REPORTS_EMPTYSTATE.EQUIPMENT_DATAELEMENT_REPORT;
      vm.sourceHeaderForEqpDataelementReport = [];
      let allowedFieldsControlTypesForSortingFiltering = [1, 2, 5, 7, 8, 9, 10, 11, 13, 14, 15]; /* id directly taken from core constant-InputeFields */
      let SelectedEquipmentEntity = null;
      let DataElementReportTransFields = CORE.DataElementReportTransFields;
      vm.isHideDelete = true;
      let woOpCustomDetails = $scope.woOpCustomDetails ? $scope.woOpCustomDetails : {};
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

      /* get operation entity with its all data elements */
      let getEntityWithDataElement = () => {
        let arr = [];
        arr.push(EquipmentEntityID);
        vm.cgBusyLoading = EntityFactory.getWithDataElementsByEntityIds().query({
          EntityIds: arr
        }).$promise.then((entity) => {
          if (entity && entity.data) {
            SelectedEquipmentEntity = _.filter(entity.data.entity, (ent) => {
              return ent.entityID == EquipmentEntityID;
            });
            SelectedEquipmentEntity = _.first(SelectedEquipmentEntity);
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      getEntityWithDataElement();

      vm.pagingInfoForEqpDataelementReport = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: [],
        entityID: EquipmentEntityID,
        subFormDataElementID: null,
        woTransID: null,
        woID: $scope.woId,
        woOPID: $scope.woOpId,
        eqpID: $scope.eqpId
      };

      vm.gridOptionsForEqpDataelementReport = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: true,
        multiSelect: true,
        filterOptions: vm.pagingInfoForEqpDataelementReport.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Work_Order_Operation_Equipment_DataTrackingEntity_Details.csv',
        flatEntityAccess: true /* To display field data When field contain dot > https://github.com/angular-ui/ui-grid/issues/3900 */
      };

      vm.loadDataForEqpDataelementReport = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfoForEqpDataelementReport, vm.gridOptionsForEqpDataelementReport);
        vm.cgBusyLoading = WorkorderDataelementFactory.getWoTransactionEquipmentDataElementValuesList().query(vm.pagingInfoForEqpDataelementReport).$promise.then((elements) => {
          vm.gridOptionsForEqpDataelementReport.exporterCsvFilename = stringFormat(CORE.FileName_Export_Format.DataTrackingEntity.woOpEqp, woOpCustomDetails.woNumber, woOpCustomDetails.woVersion, woOpCustomDetails.opFullName, woOpCustomDetails.eqipmentFullName);
          vm.sourceDataForEqpDataelementReport = elements.data.woTransEqpDEValuesList;
          vm.totalSourceDataCountForEqpDataelementReport = elements.data.Count;
          let allElementFields = _.keys(vm.sourceDataForEqpDataelementReport[0]);
          setGridOptionsAfterGetTransEqpDataelementValuesList(allElementFields);
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }


      let setGridOptionsAfterGetTransEqpDataelementValuesList = (fieldsSelectionList) => {
        if (!vm.gridOptionsForEqpDataelementReport.enablePaging) {
          vm.currentdataForEqpDataelementReport = vm.sourceDataForEqpDataelementReport.length;
          vm.gridOptionsForEqpDataelementReport.gridApi.infiniteScroll.resetScroll();
        }
        vm.gridOptionsForEqpDataelementReport.clearSelectedRows();
        if (vm.totalSourceDataCountForEqpDataelementReport == 0) {
          if (vm.pagingInfoForEqpDataelementReport.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
            vm.isNoDataFoundForEqpDataelementReport = false;
            vm.emptyStateForEqpDataelementReport = 0;
          }
          else {
            vm.isNoDataFoundForEqpDataelementReport = true;
            vm.emptyStateForEqpDataelementReport = null;
          }
        }
        else {
          /* [S] Set code to bind header fields */

          /* as no need to display these fields */
          fieldsSelectionList = _.difference(fieldsSelectionList, ['woTransID', 'woTransEqpDataElementIDs', 'entityID']);

          let notAddedFieldList = [], removeAlreadyAddedFieldList = [];
          let sourceHeaderAvailableFieldList = _.map(vm.sourceHeaderForEqpDataelementReport, 'field');
          notAddedFieldList = fieldsSelectionList.filter(val => !sourceHeaderAvailableFieldList.includes(val));
          removeAlreadyAddedFieldList = sourceHeaderAvailableFieldList.filter(val => !fieldsSelectionList.includes(val));
          if (removeAlreadyAddedFieldList.length > 0) {
            removeAlreadyAddedFieldList = _.difference(removeAlreadyAddedFieldList, ['#', 'Action']); /* as no need to remove these fields */
          }

          if (notAddedFieldList.length > 0) {
            if (sourceHeaderAvailableFieldList.length == 0) {
              //let _objAction = {};
              //_objAction.field = 'Action';
              //_objAction.displayName = 'Action';
              //_objAction.width = '100';
              //_objAction.cellTemplate = `<grid-action-view grid="grid" row="row"></grid-action-view>`;
              //_objAction.enableFiltering = false;
              //_objAction.enableSorting = false;
              //vm.sourceHeaderForEqpDataelementReport.push(_objAction);

              let _objIndex = {};
              _objIndex.field = '#';
              _objIndex.width = CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN;
              _objIndex.cellTemplate = '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference !== \'P\'">\
                            <span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span>\
                            </div>\
                            <div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference === \'P\'">\
                            <span><b>{{(grid.appScope.$parent.vm.pagingInfoForEqpDataelementReport.pageSize * (grid.appScope.$parent.vm.pagingInfoForEqpDataelementReport.Page - 1)) + (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1)}}</b></span>\
                            </div>';
              _objIndex.enableFiltering = false;
              _objIndex.enableSorting = false;
              vm.sourceHeaderForEqpDataelementReport.push(_objIndex);
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
                let defaultDecimalNumberItem;
                if (SelectedEquipmentEntity.dataElement) {
                  defaultDecimalNumberItem = _.find(SelectedEquipmentEntity.dataElement, (item) => {
                    return item.dataElementID == fieldNameWithControlType[2];
                  });
                }
                if (defaultDecimalNumberItem && parseInt(defaultDecimalNumberItem.decimal_number) >= 0) {
                  _obj.cellTemplate = '<div flex="100" class="grid-cell-text-right" layout="column" layout-align="center end">{{COL_FIELD || 0 | number: "' + defaultDecimalNumberItem.decimal_number + '"}}</div>';
                }
                else {
                  _obj.cellTemplate = '<div flex="100" class="grid-cell-text-right" layout="column" layout-align="center end">{{COL_FIELD}}</div>';
                }
                _obj.width = '130';
              }
              else if (controlTypeID == 3 || controlTypeID == 4  || controlTypeID == 20) {  /* Description type fields */
                _obj.cellTemplate = '<md-button class="md-warn md-hue-1 margin-0" ng-click="grid.appScope.$parent.vm.showEquipmentDataElementDescription(row.entity,\'' + fielditem.replace(/'/g, "\\'") + '\', $event)"> \
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
                _obj.cellTemplate = '<md-button class="md-warn md-hue-1 margin-0" ng-click="grid.appScope.$parent.vm.showEquipmentDataElementSubFormValues(row.entity,\'' + fielditem.replace(/'/g, "\\'") + '\', $event)"> \
                                   View({{COL_FIELD}}) \
                                </md-button>';
              }
              // else if (fielditem == "Transaction Date") {
              //     _obj.width = '180';
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
              vm.sourceHeaderForEqpDataelementReport.push(_obj);
            });
          }

          if (removeAlreadyAddedFieldList.length > 0) {
            _.each(removeAlreadyAddedFieldList, (removeitem) => {
              return _.remove(vm.sourceHeaderForEqpDataelementReport, (obj) => {
                return obj.field == removeitem;
              });
            });
          }
          /* [E] Set code to bind header fields */

          /* [S] to set default format of date time/date range data elements */
          _.each(vm.sourceDataForEqpDataelementReport, (item) => {
            _.each(item, (value, key) => {
              if (value && key.includes("-##-")) {
                let fieldNameWithControlType = key.split('-##-');
                let controlTypeID = parseInt(fieldNameWithControlType[1]);
                if (controlTypeID == 5 || controlTypeID == 6) {
                  let defaultDateFormat;
                  if (SelectedEquipmentEntity.dataElement) {
                    let dateTimeElement = _.find(SelectedEquipmentEntity.dataElement, (item) => {
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
              }
            });

            // if (item["Transaction Date"]) { /* createdby - date */
            //     item["Transaction Date"] = $filter('date')(item["Transaction Date"], _dateTimeFullTimeDisplayFormat);
            // }
          });
          /* [E] to set default format of date time/date range data elements */

          vm.isNoDataFoundForEqpDataelementReport = false;
          vm.emptyStateForEqpDataelementReport = null;
        }
        $timeout(() => {
          vm.resetSourceGridForEqpDataelementReport();
          if (!vm.gridOptionsForEqpDataelementReport.enablePaging && vm.totalSourceDataCountForEqpDataelementReport == vm.currentdataForEqpDataelementReport) {
            return vm.gridOptionsForEqpDataelementReport.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });
      }

      vm.getDataDownForEqpDataelementReport = () => {
        vm.pagingInfoForEqpDataelementReport.Page = vm.pagingInfoForEqpDataelementReport.Page + 1;
        vm.cgBusyLoading = WorkorderDataelementFactory.getWoTransactionEquipmentDataElementValuesList().query(vm.pagingInfoForEqpDataelementReport).$promise.then((elements) => {
          // _.each(elements.data.woTransEqpDEValuesList, (item) => {
          //     if (item["Transaction Date"]) { /* createdby - date */
          //         item["Transaction Date"] = $filter('date')(item["Transaction Date"], _dateTimeFullTimeDisplayFormat);
          //     }
          // });
          vm.sourceDataForEqpDataelementReport = vm.gridOptionsForEqpDataelementReport.data = vm.sourceDataForEqpDataelementReport.concat(elements.data.woTransEqpDEValuesList);
          vm.currentdataForEqpDataelementReport = vm.gridOptionsForEqpDataelementReport.currentItem = vm.gridOptionsForEqpDataelementReport.data.length;
          vm.gridOptionsForEqpDataelementReport.gridApi.infiniteScroll.saveScrollPercentage();
          $timeout(() => {
            vm.resetSourceGridForEqpDataelementReport();
            return vm.gridOptionsForEqpDataelementReport.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCountForEqpDataelementReport != vm.currentdataForEqpDataelementReport ? true : false);
          });
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };

      /* Show Description*/
      vm.showEquipmentDataElementDescription = (object, field, ev) => {
        const data = {
          title: SelectedEquipmentEntity.entityName,
          description: object[field],
          name: field.split('-##-')[0]
        };
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          data).then(() => {
          }, (err) =>  BaseService.getErrorLog(err));
      };

      vm.showEquipmentDataElementSubFormValues = (object, field, ev) => {
        let data = {
          elementName: field.split('-##-')[0],
          dataElementID: field.split('-##-')[2],
          SelectedEntity: SelectedEquipmentEntity,
          woTransID: object.woTransID,
          woID: $scope.woId,
          woOPID: $scope.woOpId,
          eqpID: $scope.eqpId
        }

        DialogFactory.dialogService(
          REPORTS.VIEW_WO_TRANS_EQP_SUBFORM_VALUES_MODAL_CONTROLLER,
          REPORTS.VIEW_WO_TRANS_EQP_SUBFORM_VALUES_MODAL_VIEW,
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
          eqpID: $scope.eqpId,
          woTransEqpDataElementIDs: object.woTransEqpDataElementIDs
        }

        vm.cgBusyLoading = WorkorderEquipmentDataElementTransValueFactory.downloadDocumentByRefID(documentObj).then((response) => {
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
