(function () {
  'use strict';

  angular
    .module('app.reports.workorderdataelement')
    .controller('ViewWOTransEqpSubFormValuesPopupController', ViewWOTransEqpSubFormValuesPopupController);

  /** @ngInject */
  function ViewWOTransEqpSubFormValuesPopupController($scope, $timeout, $state, $mdDialog, CORE, $filter,
    DialogFactory, data, BaseService, WorkorderDataelementFactory, REPORTS, WorkorderEquipmentDataElementTransValueFactory) {
    const vm = this;
    vm.EmptyMesssage = REPORTS.REPORTS_EMPTYSTATE.MIS_COMMON_REPORT;
    vm.data = data;
    vm.sourceHeader = [];
    vm.isHideDelete = true;
    let allowedFieldsControlTypesForSortingFiltering = [1, 2, 5, 7, 8, 9, 10, 11, 13, 14, 15]; /* id directly taken from core constant-InputeFields */
    let DataElementReportTransFields = CORE.DataElementReportTransFields;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

    vm.cancel = () => {
      $mdDialog.cancel(null);
    };
    vm.pagingInfo = {
      Page: CORE.UIGrid.Page(),
      SortColumns: [],
      SearchColumns: [],
      entityID: vm.data.SelectedEntity.entityID,
      subFormDataElementID: vm.data.dataElementID,
      woTransID: vm.data.woTransID,
      woID: vm.data.woID,
      woOPID: vm.data.woOPID,
      eqpID: vm.data.eqpID
    };

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Work Order Equipment SubForm Transaction Details.csv',
      flatEntityAccess: true /* To display field data When field contain dot > https://github.com/angular-ui/ui-grid/issues/3900 */
    };

    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = WorkorderDataelementFactory.getWoTransactionEquipmentDataElementValuesList().query(vm.pagingInfo).$promise.then((elements) => {
        vm.sourceData = elements.data.woTransEqpDEValuesList;
        vm.totalSourceDataCount = elements.data.Count;
        let allElementFields = _.keys(vm.sourceData[0]);
        setGridOptionsAfterGetTransEqpDataelementValuesList(allElementFields);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let setGridOptionsAfterGetTransEqpDataelementValuesList = (fieldsSelectionList) => {
      if (!vm.gridOptions.enablePaging) {
        vm.currentdata = vm.sourceData.length;
        vm.gridOptions.gridApi.infiniteScroll.resetScroll();
      }
      vm.gridOptions.clearSelectedRows();
      if (vm.totalSourceDataCount == 0) {
        if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
          vm.isNoDataFound = false;
          vm.emptyState = 0;
        }
        else {
          vm.isNoDataFound = true;
          vm.emptyState = null;
        }
      }
      else {
        /* [S] Set code to bind header fields */

        /* as no need to display these fields */
        fieldsSelectionList = _.difference(fieldsSelectionList, ['woTransID', 'woTransEqpDataElementIDs', 'entityID']);

        let notAddedFieldList = [], removeAlreadyAddedFieldList = [];
        let sourceHeaderAvailableFieldList = _.map(vm.sourceHeader, 'field');
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
            //vm.sourceHeader.push(_objAction);

            let _objIndex = {};
            _objIndex.field = '#';
            _objIndex.width = CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN;
            _objIndex.cellTemplate = CORE.UIGrid.ROW_NUM_CELL_TEMPLATE;
            _objIndex.enableFiltering = false;
            _objIndex.enableSorting = false;
            vm.sourceHeader.push(_objIndex);
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
              if (vm.data.SelectedEntity.dataElement) {
                defaultDecimalNumberItem = _.find(vm.data.SelectedEntity.dataElement, (item) => {
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
            else if (controlTypeID == 3 || controlTypeID == 4) {  /* Description type fields */
              _obj.cellTemplate = '<md-button class="md-warn md-hue-1 margin-0" ng-click="grid.appScope.$parent.vm.showDescription(row.entity,\'' + fielditem.replace(/'/g, "\\'") + '\', $event)"> \
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
              _obj.cellTemplate = '<md-button ng-if="COL_FIELD" class="md-warn md-hue-1 margin-0" ng-click="grid.appScope.$parent.vm.downloadDocument(row.entity,\'' + fielditem.replace(/'/g, "\\'") + '\',\'woopeqpdldoc\')"> \
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
            vm.sourceHeader.push(_obj);
          });
        }

        if (removeAlreadyAddedFieldList.length > 0) {
          _.each(removeAlreadyAddedFieldList, (removeitem) => {
            return _.remove(vm.sourceHeader, (obj) => {
              return obj.field == removeitem;
            });
          });
        }
        /* [E] Set code to bind header fields */

        /* [S] to set default format of date time/date range data elements */
        _.each(vm.sourceData, (item) => {
          _.each(item, (value, key) => {
            if (value && key.includes("-##-")) {
              let fieldNameWithControlType = key.split('-##-');
              let controlTypeID = parseInt(fieldNameWithControlType[1]);
              if (controlTypeID == 5 || controlTypeID == 6) {
                let defaultDateFormat;
                if (vm.data.SelectedEntity.dataElement) {
                  let dateTimeElement = _.find(vm.data.SelectedEntity.dataElement, (item) => {
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

        vm.isNoDataFound = false;
        vm.emptyState = null;
      }
      $timeout(() => {
        vm.resetSourceGrid();
        if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount == vm.currentdata) {
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
        }
      });
    }

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = WorkorderDataelementFactory.getWoTransactionEquipmentDataElementValuesList().query(vm.pagingInfo).$promise.then((elements) => {
        // _.each(elements.data.woTransEqpDEValuesList, (item) => {
        //     if (item["Transaction Date"]) { /* createdby - date */
        //         item["Transaction Date"] = $filter('date')(item["Transaction Date"], _dateTimeFullTimeDisplayFormat);
        //     }
        // });
        vm.sourceData = vm.gridOptions.data = vm.sourceData.concat(elements.data.woTransEqpDEValuesList);
        vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
        $timeout(() => {
          vm.resetSourceGrid();
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount != vm.currentdata ? true : false);
        });
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    /* Show Description*/
    vm.showDescription = (object, field, ev) => {
      let data = {
        title: vm.data.SelectedEntity.entityName,
        description: object[field],
        name: field.split('-##-')[0]
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

    /* To download selected document  */
    vm.downloadDocument = (object, field) => {
      let fileDetail = object[field].split('|');
      let file = {};
      file.mimetype = fileDetail.length > 1 ? fileDetail[1] : "";
      file.originalname = fileDetail.length > 2 ? fileDetail[2] : "";

      let documentObj = {
        entityID: object.entityID,
        dataElementID: field.split('-##-')[2],
        woTransID: object.woTransID,
        woOPID: vm.data.woOPID,
        eqpID: vm.data.eqpID,
        woTransEqpDataElementIDs: object.woTransEqpDataElementIDs
      }

      vm.cgBusyLoading = WorkorderEquipmentDataElementTransValueFactory.downloadDocumentByRefID(documentObj).then((response) => {
        if (_.includes([404, 403, 401], response.status)) {
          var model = {
            messageContent: '',
            multiple: true
          };
        }
        if (response.status == 404) {
          model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
          DialogFactory.messageAlertDialog(model);
        } else if (response.status == 403) {
          model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
          DialogFactory.messageAlertDialog(model);
        } else if (response.status == 401) {
          model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
          DialogFactory.messageAlertDialog(model);
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

})();
