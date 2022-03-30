(function () {
  'use strict';

  angular
    .module('app.reports.workorderdataelement')
    .controller('WorkorderDataelementController', WorkorderDataelementController);

  /** @ngInject */
  function WorkorderDataelementController($timeout, CORE, REPORTS, BaseService, DialogFactory, $filter
    , WorkorderDataelementFactory, EntityFactory, $mdDialog, $scope, WorkorderDataElementTransValueFactory, WorkorderEquipmentDataElementTransValueFactory) {
    const vm = this;
    vm.sourceHeaderForOpDataelementReport = [];
    vm.sourceHeaderForEqpDataelementReport = [];
    let allowedFieldsControlTypesForSortingFiltering = [1, 2, 5, 7, 8, 9, 10, 11, 13, 14, 15]; /* id directly taken from core constant-InputeFields */
    let SelectedOperationEntity = null;
    let SelectedEquipmentEntity = null;
    let OperationEntityID = CORE.AllEntityIDS.Operation.ID;
    let EquipmentEntityID = CORE.AllEntityIDS.Equipment.ID;
    vm.opDataelementReportEmptyState = REPORTS.REPORTS_EMPTYSTATE.OPERATION_DATAELEMENT_REPORT;
    vm.eqpDataelementReportEmptyState = REPORTS.REPORTS_EMPTYSTATE.EQUIPMENT_DATAELEMENT_REPORT;
    vm.isHideDelete = true;
    let DataElementReportTransFields = CORE.DataElementReportTransFields;
    var selecterWorkorder;
    var selectedOperation;
    let selectedEquipment;
    vm.allWorkorders = [];
    vm.allWorkorderOperations = [];
    vm.allWorkorderOperationEquipments = [];
    vm.subFormListOfWoOp = [];
    vm.subFormListOfWoOpEqp = [];
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

    vm.Show = {
      OperationDLReport: true,
      EquipmentDLReport: true,
    }

    let clearWoOpDETransValuesReportData = () => {
      vm.sourceDataForOpDataelementReport = [];
      vm.sourceDataForEqpDataelementReport = [];

      vm.sourceHeaderForOpDataelementReport = [];
      vm.sourceHeaderForEqpDataelementReport = [];

      vm.isNoDataFoundForOpDataelementReport = true;
      vm.isNoDataFoundForEqpDataelementReport = true;

      vm.emptyStateForOpDataelementReport = null;
      vm.emptyStateForEqpDataelementReport = null;

      vm.pagingInfoForOpDataelementReport.Page = vm.gridOptionsForOpDataelementReport.paginationCurrentPage = CORE.UIGrid.Page();
      vm.pagingInfoForOpDataelementReport.SortColumns = [];
      vm.pagingInfoForOpDataelementReport.SearchColumns = [];
      vm.pagingInfoForOpDataelementReport.subFormDataElementID = null;
      vm.subFormListOfWoOp = [];

      vm.pagingInfoForEqpDataelementReport.Page = vm.gridOptionsForEqpDataelementReport.paginationCurrentPage = CORE.UIGrid.Page();
      vm.pagingInfoForEqpDataelementReport.SortColumns = [];
      vm.pagingInfoForEqpDataelementReport.SearchColumns = [];
      vm.allWorkorderOperationEquipments = [];
      vm.subFormListOfWoOpEqp = [];
    }


    /************** Operation Data Element Report Grid *************/


    vm.pagingInfoForOpDataelementReport = {
      Page: CORE.UIGrid.Page(),
      SortColumns: [],
      SearchColumns: [],
      entityID: OperationEntityID,
      subFormDataElementID: null,
      woTransID: null,
      woID: null,
      woOPID: null
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
      flatEntityAccess: true /* To display field data When field contain dot > https://github.com/angular-ui/ui-grid/issues/3900 */
    };

    vm.loadDataForOpDataelementReport = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfoForOpDataelementReport, vm.gridOptionsForOpDataelementReport);
      if (vm.autoCompleteOfWorkorder.keyColumnId && vm.autoCompleteOfWorkorderOperation.keyColumnId) {
        let objSelectedWorkorderOperation = {
          woOPID: vm.autoCompleteOfWorkorderOperation.keyColumnId
        }
        getWoOpDataElementValuesBySelectedWoOp(objSelectedWorkorderOperation);
      }
      else {
        clearWoOpDETransValuesReportData();
        vm.autoCompleteOfWorkorder.keyColumnId = null;
        vm.autoCompleteOfWorkorderOperation.keyColumnId = null;
      }
    }

    /* get operation entity with its all data elements */
    let getEntityWithDataElement = () => {
      vm.cgBusyLoading = EntityFactory.getAllEntityWithDataElements().query().$promise.then((entity) => {
        if (entity && entity.data) {
          SelectedOperationEntity = _.filter(entity.data.entity, (ent) => {
            return ent.entityID == OperationEntityID;
          });
          SelectedOperationEntity = _.first(SelectedOperationEntity);

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

    /*  get all work order to set in autocomplete which contain transaction data element */
    let retrieveAllWorkordersforTransDataElement = () => {
      return WorkorderDataelementFactory.retrieveAllWorkordersforTransDataElement().query().$promise.then((res) => {
        if (res.data && res.data.workorderlist.length > 0) {
          vm.allWorkorders = res.data.workorderlist;
        }
        else {
          vm.allWorkorders = [];
        }
        return vm.allWorkorders;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    retrieveAllWorkordersforTransDataElement();

    /* get all work order operation to set in autocomplete which contain transaction data element */
    let getAllOperationBySelectedWO = (item) => {
      selecterWorkorder = item;
      if (!item || !item.woID) {
        clearWoOpDETransValuesReportData();
        vm.autoCompleteOfWorkorder.keyColumnId = null;
        vm.autoCompleteOfWorkorderOperation.keyColumnId = null;
        vm.allWorkorderOperations = [];
        return;
      }
      getAllOperationByWo();
    }

    function getAllOperationByWo() {
      if (selecterWorkorder.woID) {
        return WorkorderDataelementFactory.retrieveAllWorkorderOperationforTransDataElement().query({ woID: selecterWorkorder.woID }).$promise.then((res) => {
          if (res.data && res.data.workorderOperationlist.length > 0) {
            vm.allWorkorderOperations = res.data.workorderOperationlist;
            vm.allWorkorderOperations = _.sortBy(vm.allWorkorderOperations, 'opNumber');
            _.each(vm.allWorkorderOperations, (item) => {
              item.opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, item.opName, item.opNumber);
            });
          }
          else {
            vm.allWorkorderOperations = [];
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }

    /* get work order transaction data element values to show in grid */
    let getWoOpDataElementValuesBySelectedWoOp = (selectedWorkOrderOperation) => {
      selectedOperation = selectedWorkOrderOperation;
      if (!selectedWorkOrderOperation || !selectedWorkOrderOperation.woOPID || !vm.autoCompleteOfWorkorder.keyColumnId) {
        clearWoOpDETransValuesReportData();
        vm.autoCompleteOfWorkorderOperation.keyColumnId = null;
        vm.autoCompleteOfWoOpSubForms.keyColumnId = null;
        vm.autoCompleteOfWorkorderOperationEquipment.keyColumnId = null;
        vm.Show.OperationDLReport = true;
        vm.Show.EquipmentDLReport = true;
        return;
      }

      vm.opTypeOfDataFieldReport = "Operation";
      vm.pagingInfoForOpDataelementReport.woID = vm.autoCompleteOfWorkorder.keyColumnId;
      vm.pagingInfoForOpDataelementReport.woOPID = selectedWorkOrderOperation.woOPID;


      vm.cgBusyLoading = WorkorderDataelementFactory.getWoTransactionDataElementValuesList().query(vm.pagingInfoForOpDataelementReport).$promise.then((elements) => {
        /* get all operation equipment that used in data-element transaction */
        getAllEquipment();
        vm.gridOptionsForOpDataelementReport.exporterCsvFilename = stringFormat(CORE.FileName_Export_Format.DataTrackingEntity.woOp, selecterWorkorder.woNumber, selecterWorkorder.woVersion, selectedOperation.opName);
        vm.sourceDataForOpDataelementReport = elements.data.woTransDEValuesList;
        vm.totalSourceDataCountForOpDataelementReport = elements.data.Count;
        let allElementFields = _.keys(vm.sourceDataForOpDataelementReport[0]);
        setGridOptionsAfterGetTransDataelementValuesList(allElementFields);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    function getAllEquipment() {
      vm.cgBusyLoading = WorkorderDataelementFactory.retrieveAllWOOPEquipmentforTransDataElement().query({ woID: vm.autoCompleteOfWorkorder.keyColumnId, woOPID: selectedOperation.woOPID })
        .$promise.then((resOfAllEqp) => {
          if (resOfAllEqp.data && resOfAllEqp.data.workorderOperationEquipmentlist.length > 0) {
            vm.allWorkorderOperationEquipments = resOfAllEqp.data.workorderOperationEquipmentlist;
            _.each(vm.allWorkorderOperationEquipments, (item) => {
              let eqpMake = "";
              let eqpModel = "";
              let eqpYear = "";
              eqpMake = item.eqpMake ? '(' + item.eqpMake : '-';
              eqpModel = item.eqpModel ? '|' + item.eqpModel : '-';
              eqpYear = item.eqpYear ? '|' + item.eqpYear + ')' : '-';
              item.eqipmentName = item.assetName + ' ' + eqpMake + eqpModel + eqpYear;
            });
          }
          else {
            vm.allWorkorderOperationEquipments = [];
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
    }

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
            //let _objAction = {};
            //_objAction.field = 'Action';
            //_objAction.displayName = 'Action';
            //_objAction.width = '100';
            //_objAction.cellTemplate = `<grid-action-view grid="grid" row="row"></grid-action-view>`;
            //_objAction.enableFiltering = false;
            //_objAction.enableSorting = false;
            //vm.sourceHeaderForOpDataelementReport.push(_objAction);

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
              let defaultDecimalNumberItem;
              if (SelectedOperationEntity.dataElement) {
                defaultDecimalNumberItem = _.find(SelectedOperationEntity.dataElement, (item) => {
                  return item.dataElementID == fieldNameWithControlType[2];
                });
                if (defaultDecimalNumberItem && parseInt(defaultDecimalNumberItem.decimal_number) >= 0) {
                  _obj.cellTemplate = '<div flex="100" class="grid-cell-text-right" layout="column" layout-align="center end">{{COL_FIELD || 0 | number: "' + defaultDecimalNumberItem.decimal_number + '"}}</div>';
                }
                else {
                  _obj.cellTemplate = '<div flex="100" class="grid-cell-text-right" layout="column" layout-align="center end">{{COL_FIELD}}</div>';
                }
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
              _obj.cellTemplate = '<md-button ng-if="COL_FIELD" class="md-warn md-hue-1 margin-0" ng-click="grid.appScope.$parent.vm.downloadDocument(row.entity,\'' + fielditem.replace(/'/g, "\\'") + '\',\'woopdldoc\')"> \
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
              vm.subFormListOfWoOp.push({
                dataElementID: fieldNameWithControlType[2],
                dataElementName: fieldNameWithControlType[0]
              });
            }
            // else if (fielditem == "Transaction Date") {
            //     _obj.width = '170';
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
                let defaultDateFormat;
                if (SelectedOperationEntity.dataElement) {
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

    vm.autoCompleteOfWorkorder = {
      columnName: 'woNumber',
      keyColumnName: 'woID',
      keyColumnId: null,
      inputName: 'WorkOrder',
      placeholderName: CORE.LabelConstant.Workorder.WO,
      isRequired: false,
      isAddnew: false,
      callbackFn: retrieveAllWorkordersforTransDataElement,
      onSelectCallbackFn: getAllOperationBySelectedWO
    }

    vm.autoCompleteOfWorkorderOperation = {
      columnName: 'opName',
      keyColumnName: 'woOPID',
      keyColumnId: null,
      inputName: 'WorkOrderOperation',
      placeholderName: 'Operation',
      isRequired: false,
      isAddnew: false,
      callbackFn: getAllOperationByWo,
      onSelectCallbackFn: getWoOpDataElementValuesBySelectedWoOp
    }

    /******************** Operation : selected Sub-Form Data Element Report Grid *************/

    let clearWoOpDETransValuesReportDataForSubForm = () => {
      vm.sourceDataForOpDataelementReport = [];
      vm.sourceHeaderForOpDataelementReport = [];
      vm.isNoDataFoundForOpDataelementReport = true;
      vm.emptyStateForOpDataelementReport = null;
      vm.pagingInfoForOpDataelementReport.Page = vm.gridOptionsForOpDataelementReport.paginationCurrentPage = CORE.UIGrid.Page();
      vm.pagingInfoForOpDataelementReport.SortColumns = [];
      vm.pagingInfoForOpDataelementReport.SearchColumns = [];
      vm.pagingInfoForOpDataelementReport.subFormDataElementID = null;
    }

    /* get wo op selected sub form data element values to show in grid */
    let getWoOpSubFormDataElementValuesBySelectedSubForm = (selectedWoOpSubForm) => {
      if (!selectedWoOpSubForm || !selectedWoOpSubForm.dataElementID) {
        if (!vm.autoCompleteOfWorkorder.keyColumnId || !vm.autoCompleteOfWorkorderOperation.keyColumnId) {
          clearWoOpDETransValuesReportData();
          vm.autoCompleteOfWorkorderOperation.keyColumnId = null;
          vm.autoCompleteOfWoOpSubForms.keyColumnId = null;
          vm.autoCompleteOfWorkorderOperationEquipment.keyColumnId = null;
          vm.Show.OperationDLReport = true;
          vm.Show.EquipmentDLReport = true;
        }
        else {
          // reset(get) selected operation data fields data which is selected
          clearWoOpDETransValuesReportDataForSubForm();
          vm.subFormListOfWoOp = [];
          getWoOpDataElementValuesBySelectedWoOp(selectedOperation);
        }
      }
      else {
        vm.opTypeOfDataFieldReport = "Operation SubForm";
        clearWoOpDETransValuesReportDataForSubForm();
        vm.pagingInfoForOpDataelementReport.woID = vm.autoCompleteOfWorkorder.keyColumnId;
        vm.pagingInfoForOpDataelementReport.woOPID = vm.autoCompleteOfWorkorderOperation.keyColumnId;
        vm.pagingInfoForOpDataelementReport.subFormDataElementID = selectedWoOpSubForm.dataElementID;

        vm.cgBusyLoading = WorkorderDataelementFactory.getWoTransactionDataElementValuesList().query(vm.pagingInfoForOpDataelementReport).$promise.then((elements) => {
          vm.gridOptionsForOpDataelementReport.exporterCsvFilename = stringFormat(CORE.FileName_Export_Format.DataTrackingEntity.woOpSubForm, selecterWorkorder.woNumber, selecterWorkorder.woVersion, selectedOperation.opName, selectedWoOpSubForm.dataElementName);

          vm.sourceDataForOpDataelementReport = elements.data.woTransDEValuesList;
          vm.totalSourceDataCountForOpDataelementReport = elements.data.Count;
          let allElementFields = _.keys(vm.sourceDataForOpDataelementReport[0]);
          setGridOptionsAfterGetTransDataelementValuesList(allElementFields);
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }

    vm.autoCompleteOfWoOpSubForms = {
      columnName: 'dataElementName',
      keyColumnName: 'dataElementID',
      keyColumnId: null,
      inputName: 'WorkOrderOperationSubForms',
      placeholderName: 'Operation SubForms',
      isRequired: false,
      isAddnew: false,
      callbackFn: null,
      onSelectCallbackFn: getWoOpSubFormDataElementValuesBySelectedSubForm
    }

    /* ********************** Equipment Data Element Report Grid ****************** */

    let clearWoOpEqpDETransValuesReportData = () => {
      vm.sourceDataForEqpDataelementReport = [];
      vm.sourceHeaderForEqpDataelementReport = [];
      vm.isNoDataFoundForEqpDataelementReport = true;
      vm.emptyStateForEqpDataelementReport = null;
      vm.pagingInfoForEqpDataelementReport.Page = vm.gridOptionsForEqpDataelementReport.paginationCurrentPage = CORE.UIGrid.Page();
      vm.pagingInfoForEqpDataelementReport.SortColumns = [];
      vm.pagingInfoForEqpDataelementReport.SearchColumns = [];
      vm.pagingInfoForEqpDataelementReport.subFormDataElementID = null;
      vm.subFormListOfWoOpEqp = [];
    }

    vm.pagingInfoForEqpDataelementReport = {
      Page: CORE.UIGrid.Page(),
      //ItemsPerPage: CORE.UIGrid.ItemsPerPage(),
      SortColumns: [],
      SearchColumns: [],
      entityID: EquipmentEntityID,
      subFormDataElementID: null,
      woTransID: null,
      woID: null,
      woOPID: null,
      eqpID: null
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
      if (vm.autoCompleteOfWorkorder.keyColumnId && vm.autoCompleteOfWorkorderOperation.keyColumnId
        && vm.autoCompleteOfWorkorderOperationEquipment.keyColumnId) {
        let objSelectedWorkorderOperationEquipment = {
          eqpID: vm.autoCompleteOfWorkorderOperationEquipment.keyColumnId
        }
        getWoOpEqpDataElementValuesBySelectedWoOpEqp(objSelectedWorkorderOperationEquipment);
      }
      else {
        clearWoOpEqpDETransValuesReportData();
        vm.autoCompleteOfWorkorderOperationEquipment.keyColumnId = null;
      }

      //if (!vm.autoCompleteOfWorkorder.keyColumnId || !vm.autoCompleteOfWorkorderOperation.keyColumnId
      //    || !vm.autoCompleteOfWorkorderOperationEquipment.keyColumnId) {
      //    clearWoOpEqpDETransValuesReportData();
      //    vm.autoCompleteOfWorkorderOperationEquipment.keyColumnId = null;
      //}
    }

    /* get work order transaction equipment data element values to show in grid */
    let getWoOpEqpDataElementValuesBySelectedWoOpEqp = (selectedWorkOrderOperationEquipment) => {
      BaseService.setPageSizeOfGrid(vm.pagingInfoForEqpDataelementReport, vm.gridOptionsForEqpDataelementReport);
      if (!selectedWorkOrderOperationEquipment || !selectedWorkOrderOperationEquipment.eqpID
        || !vm.autoCompleteOfWorkorderOperation.keyColumnId || !vm.autoCompleteOfWorkorder.keyColumnId) {
        clearWoOpEqpDETransValuesReportData();
        vm.autoCompleteOfWorkorderOperationEquipment.keyColumnId = null;
        vm.autoCompleteOfWoOpEqpSubForms.keyColumnId = null;
        vm.Show.EquipmentDLReport = true;
        selectedEquipment = null;
        return;
      }
      vm.opEqpTypeOfDataFieldReport = "Equipment";
      selectedEquipment = selectedWorkOrderOperationEquipment;
      vm.pagingInfoForEqpDataelementReport.woID = vm.autoCompleteOfWorkorder.keyColumnId;
      vm.pagingInfoForEqpDataelementReport.woOPID = vm.autoCompleteOfWorkorderOperation.keyColumnId;
      vm.pagingInfoForEqpDataelementReport.eqpID = selectedEquipment.eqpID;

      /* get all operation equipment that used in data-element transaction */
      vm.cgBusyLoading = WorkorderDataelementFactory.getWoTransactionEquipmentDataElementValuesList().query(vm.pagingInfoForEqpDataelementReport).$promise.then((elements) => {
        vm.sourceDataForEqpDataelementReport = elements.data.woTransEqpDEValuesList;
        vm.totalSourceDataCountForEqpDataelementReport = elements.data.Count;
        let allElementFields = _.keys(vm.sourceDataForEqpDataelementReport[0]);
        setGridOptionsAfterGetTransEqpDataelementValuesList(allElementFields);
        vm.gridOptionsForEqpDataelementReport.exporterCsvFilename = stringFormat(CORE.FileName_Export_Format.DataTrackingEntity.woOpEqp, selecterWorkorder.woNumber, selecterWorkorder.woVersion, selectedOperation.opName, selectedEquipment.eqipmentName);
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
                if (defaultDecimalNumberItem && parseInt(defaultDecimalNumberItem.decimal_number) >= 0) {
                  _obj.cellTemplate = '<div flex="100" class="text-right" layout="column" layout-align="center end">{{COL_FIELD || 0 | number: "' + defaultDecimalNumberItem.decimal_number + '"}}</div>';
                }
                else {
                  _obj.cellTemplate = '<div flex="100" class="grid-cell-text-right" layout="column" layout-align="center end">{{COL_FIELD}}</div>';
                }
                _obj.width = '130';
              }
            }
            else if (controlTypeID == 3 || controlTypeID == 4 || controlTypeID == 20) {  /* Description type fields */
              _obj.cellTemplate = '<md-button class="md-warn md-hue-1 margin-0" ng-click="grid.appScope.$parent.vm.showEquipmentDataElementDescription(row.entity,\'' + fielditem.replace(/'/g, "\\'") + '\', $event)"> \
                                   View \
                                </md-button>';
              //_obj.exporterSuppressExport = true;
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
            else if (controlTypeID == 18) {  /* sub-form field */
              _obj.exporterSuppressExport = true;
              _obj.cellTemplate = '<md-button class="md-warn md-hue-1 margin-0" ng-click="grid.appScope.$parent.vm.showEquipmentDataElementSubFormValues(row.entity,\'' + fielditem.replace(/'/g, "\\'") + '\', $event)"> \
                                   View({{COL_FIELD}}) \
                                </md-button>';
              vm.subFormListOfWoOpEqp.push({
                dataElementID: fieldNameWithControlType[2],
                dataElementName: fieldNameWithControlType[0]
              });
            }
            // else if (fielditem == "Transaction Date") {
            //     _obj.width = '170';
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
        // if (item["Transaction Date"]) { /* createdby - date */
        //     item["Transaction Date"] = $filter('date')(item["Transaction Date"], _dateTimeFullTimeDisplayFormat);
        // }
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

    vm.autoCompleteOfWorkorderOperationEquipment = {
      columnName: 'eqipmentName',
      keyColumnName: 'eqpID',
      keyColumnId: null,
      inputName: 'WorkOrderOperationEquipment',
      placeholderName: 'Equipments',
      isRequired: false,
      isAddnew: false,
      callbackFn: getAllEquipment,
      onSelectCallbackFn: getWoOpEqpDataElementValuesBySelectedWoOpEqp
    }


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
        }, (err) => BaseService.getErrorLog(err));
    };

    /* Show Sub form Values */
    vm.showOperationDataElementSubFormValues = (object, field, ev) => {
      let data = {
        elementName: field.split('-##-')[0],
        dataElementID: field.split('-##-')[2],
        SelectedEntity: SelectedOperationEntity,
        woTransID: object.woTransID,
        woID: vm.autoCompleteOfWorkorder.keyColumnId,
        woOPID: vm.autoCompleteOfWorkorderOperation.keyColumnId
      }

      DialogFactory.dialogService(
        REPORTS.VIEW_WO_TRANS_SUBFORM_VALUES_MODAL_CONTROLLER,
        REPORTS.VIEW_WO_TRANS_SUBFORM_VALUES_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    }

    vm.showEquipmentDataElementSubFormValues = (object, field, ev) => {
      let data = {
        elementName: field.split('-##-')[0],
        dataElementID: field.split('-##-')[2],
        SelectedEntity: SelectedEquipmentEntity,
        woTransID: object.woTransID,
        woID: vm.autoCompleteOfWorkorder.keyColumnId,
        woOPID: vm.autoCompleteOfWorkorderOperation.keyColumnId,
        eqpID: vm.autoCompleteOfWorkorderOperationEquipment.keyColumnId
      }

      DialogFactory.dialogService(
        REPORTS.VIEW_WO_TRANS_EQP_SUBFORM_VALUES_MODAL_CONTROLLER,
        REPORTS.VIEW_WO_TRANS_EQP_SUBFORM_VALUES_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    }

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
        woOPID: vm.autoCompleteOfWorkorderOperation.keyColumnId
      }
      if (callingFor == "woopdldoc") { /* wo op dataelement document */
        documentObj.woTransDataElementIDs = object.woTransDataElementIDs;
        vm.cgBusyLoading = WorkorderDataElementTransValueFactory.downloadDocumentByRefID(documentObj);
      }
      else if (callingFor == "woopeqpdldoc") { /* wo op eqp dataelement document */
        documentObj.eqpID = vm.autoCompleteOfWorkorderOperationEquipment.keyColumnId;
        documentObj.woTransEqpDataElementIDs = object.woTransEqpDataElementIDs;
        vm.cgBusyLoading = WorkorderEquipmentDataElementTransValueFactory.downloadDocumentByRefID(documentObj);
      }
      else {
        return;
      }
      vm.cgBusyLoading.then((response) => {
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

    /******************** Equipment: selected Sub-Form Data Element Report Grid *************/

    let clearWoOpEqpDETransValuesReportDataForSubForm = () => {
      vm.sourceDataForEqpDataelementReport = [];
      vm.sourceHeaderForEqpDataelementReport = [];
      vm.isNoDataFoundForEqpDataelementReport = true;
      vm.emptyStateForEqpDataelementReport = null;
      vm.pagingInfoForEqpDataelementReport.Page = vm.gridOptionsForEqpDataelementReport.paginationCurrentPage = CORE.UIGrid.Page();
      vm.pagingInfoForEqpDataelementReport.SortColumns = [];
      vm.pagingInfoForEqpDataelementReport.SearchColumns = [];
      vm.pagingInfoForEqpDataelementReport.subFormDataElementID = null;
    }

    /* get work order transaction equipment sub form data element values to show in grid */
    let getWoOpEqpSubFormDataElementValuesBySelectedSubForm = (selectedWoOpEqpSubForm) => {

      if (!selectedWoOpEqpSubForm || !selectedWoOpEqpSubForm.dataElementID) {
        if (!selectedEquipment || !selectedEquipment.eqpID
          || !vm.autoCompleteOfWorkorderOperation.keyColumnId || !vm.autoCompleteOfWorkorder.keyColumnId) {
          clearWoOpEqpDETransValuesReportData();
          vm.autoCompleteOfWorkorderOperationEquipment.keyColumnId = null;
          vm.Show.EquipmentDLReport = true;
          selectedEquipment = null;
        }
        else {
          // reset(get) selected operation equipment data fields data which is selected
          clearWoOpEqpDETransValuesReportDataForSubForm();
          vm.subFormListOfWoOpEqp = [];
          getWoOpEqpDataElementValuesBySelectedWoOpEqp(selectedEquipment);
        }
      }
      else {
        vm.opEqpTypeOfDataFieldReport = "Equipment SubForm";
        clearWoOpEqpDETransValuesReportDataForSubForm();
        vm.pagingInfoForEqpDataelementReport.woID = vm.autoCompleteOfWorkorder.keyColumnId;
        vm.pagingInfoForEqpDataelementReport.woOPID = vm.autoCompleteOfWorkorderOperation.keyColumnId;
        vm.pagingInfoForEqpDataelementReport.eqpID = vm.autoCompleteOfWorkorderOperationEquipment.keyColumnId;
        vm.pagingInfoForEqpDataelementReport.subFormDataElementID = selectedWoOpEqpSubForm.dataElementID;

        /* get all operation equipment that used in data-element transaction */
        vm.cgBusyLoading = WorkorderDataelementFactory.getWoTransactionEquipmentDataElementValuesList().query(vm.pagingInfoForEqpDataelementReport).$promise.then((elements) => {
          vm.sourceDataForEqpDataelementReport = elements.data.woTransEqpDEValuesList;
          vm.totalSourceDataCountForEqpDataelementReport = elements.data.Count;
          let allElementFields = _.keys(vm.sourceDataForEqpDataelementReport[0]);
          setGridOptionsAfterGetTransEqpDataelementValuesList(allElementFields);
          vm.gridOptionsForEqpDataelementReport.exporterCsvFilename = stringFormat(CORE.FileName_Export_Format.DataTrackingEntity.woOpEqpSubForm,
            selecterWorkorder.woNumber, selecterWorkorder.woVersion, selectedOperation.opName,
            selectedEquipment.eqipmentName, selectedWoOpEqpSubForm.dataElementName);
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }

    vm.autoCompleteOfWoOpEqpSubForms = {
      columnName: 'dataElementName',
      keyColumnName: 'dataElementID',
      keyColumnId: null,
      inputName: 'WorkOrderOperationSubForms',
      placeholderName: 'Equipment SubForms',
      isRequired: false,
      isAddnew: false,
      callbackFn: null,
      onSelectCallbackFn: getWoOpEqpSubFormDataElementValuesBySelectedSubForm
    }

    //close popup on page destroy 
    $scope.$on('$destroy', function () {
      $mdDialog.hide('', { closeAll: true });
    });
  }
})();
