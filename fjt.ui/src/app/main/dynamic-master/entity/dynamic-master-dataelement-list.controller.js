(function () {
  'use strict';

  angular
    .module('app.customforms.entity')
    .controller('CustomFormsDataElementListController', CustomFormsDataElementListController);

  /** @ngInject */
  function CustomFormsDataElementListController(CORE, $timeout, $scope, BaseService, $state,
    CUSTOMFORMS, DialogFactory, DataElementTransactionValuesManualFactory, $filter, $mdDialog) {
    // Don't Remove this code
    // Don't add any code before this
    //$scope.vm = this;
    //let vm = $scope.vm;
    $scope.vm = $scope.$parent.$parent.vm;
    let vm = $scope.vm;
    // add code after this only
    // Don't Remove this code
    const loginUserDetails = BaseService.loginUser;
    vm.EmptyMesssage = CUSTOMFORMS.CUSTOMFORMS_EMPTYSTATE.DATA_ELEMENT;
    vm.entityID = $state.params.entityID;
    vm.isUpdatable = true;
    //let SelectedEntityName = null;
    vm.sourceHeader = [];
    let allowedFieldsControlTypesForSortingFiltering = [1, 2, 5, 7, 8, 9, 10, 11, 13, 14, 15]; /* id directly taken from core constant-InputeFields */
    //let SelectedEntity = null;
    let DynamicMasterEntityTreeTabs = CORE.DynamicMasterEntityTreeTabs;
    let DataElementReportTransFields = CORE.DataElementReportTransFields;
    vm.DisplayStatusConst = CORE.DisplayStatus;
    vm.isViewCustomFormHistory = true; // to display history
    const isEnablePagination = loginUserDetails.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

    //get custom forms entity status by id
    vm.getEntityStatus = (statusID) => {
      return BaseService.getOpStatus(statusID);
    }

    if (vm.entityID) {
      vm.selectedEntity = _.find(vm.ManualEntities, (item) => {
        return item.entityID == vm.entityID;
      });
      if (!vm.selectedEntity) {
        $state.go(CUSTOMFORMS.CUSTOMFORMS_ENTITY_STATE);
        return;
      }
      //SelectedEntityName = SelectedEntity.entityName;
      vm.SelectedEntityNameToDisplay = vm.selectedEntity.entityName + ' ' + 'List';
      vm.isDisableEntityAccess = vm.selectedEntity.entityStatus == vm.DisplayStatusConst.Draft.ID;
      vm.headerdata = [
        { label: 'Status', value: vm.getEntityStatus(vm.selectedEntity.entityStatus), displayOrder: 1 }
      ];
      vm.SelectedEntityId = vm.selectedEntity.entityID;
    }

    let initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        //ItemsPerPage: CORE.UIGrid.ItemsPerPage(),
        SortColumns: [],
        SearchColumns: [],
        manualEntityID: vm.entityID,
        subFormDataElementID: null,
        refTransID: null,
        isSuperAdmin: loginUserDetails.isUserSuperAdmin,
        employeeID: loginUserDetails.employee.id
      };
    }
    initPageInfo();

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'CustomForms Values.csv',
      flatEntityAccess: true /* To display field data When field contain dot > https://github.com/angular-ui/ui-grid/issues/3900 */
    };

    function setDataAfterGetAPICall(elements, isGetDataDown) {
      if (elements && elements.data.dETransactionValuesManualList) {
        if (!isGetDataDown) {
          vm.sourceData = elements.data.dETransactionValuesManualList;
          vm.currentdata = vm.sourceData.length;
        }
        else if (elements.data.dETransactionValuesManualList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(elements.data.dETransactionValuesManualList);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        let fieldsSelectionList = _.keys(vm.sourceData[0]);

        // must set after new data comes
        vm.totalSourceDataCount = elements.data.Count;
        if (!vm.gridOptions.enablePaging) {
          if (!isGetDataDown) {
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          else {
            vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          }
        }
        if (!isGetDataDown) {
          vm.gridOptions.clearSelectedRows();
        }
        if (vm.totalSourceDataCount === 0) {
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
          fieldsSelectionList = _.difference(fieldsSelectionList, ['refTransID', 'dataElementTransManualIDs', 'entityID']);

          let notAddedFieldList = [], removeAlreadyAddedFieldList = [];
          let sourceHeaderAvailableFieldList = _.map(vm.sourceHeader, 'field');
          notAddedFieldList = fieldsSelectionList.filter(val => !sourceHeaderAvailableFieldList.includes(val));
          removeAlreadyAddedFieldList = sourceHeaderAvailableFieldList.filter(val => !fieldsSelectionList.includes(val));
          if (removeAlreadyAddedFieldList.length > 0) {
            removeAlreadyAddedFieldList = _.difference(removeAlreadyAddedFieldList, ['#', 'Action']); /* as no need to remove these fields */
          }

          if (notAddedFieldList.length > 0) {
            if (sourceHeaderAvailableFieldList.length == 0) {
              let _objAction = {};
              _objAction.field = 'Action';
              _objAction.displayName = 'Action';
              _objAction.width = '100';
              _objAction.cellTemplate = `<grid-action-view grid="grid" row="row"></grid-action-view>`;
              _objAction.enableFiltering = false;
              _objAction.enableSorting = false;
              _objAction.pinnedLeft = true;
              vm.sourceHeader.push(_objAction);

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
                let defaultDecimalNumberItem = _.find(vm.selectedEntity.dataElement, (item) => {
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
                _obj.cellTemplate = '<md-button class="md-warn md-hue-1  underline margin-0" ng-click="grid.appScope.$parent.vm.showDescription(row.entity,\'' + fielditem.replace(/'/g, "\\'") + '\', $event)"> \
                                       View \
                                    </md-button>';
              }
              else if (controlTypeID == 5) { /* Date Time field */
                _obj.width = '180';
              }
              else if (controlTypeID == 6) { /* Date Range type field  */
                _obj.width = '210';
              }
              else if (controlTypeID === 8 || controlTypeID === 9 || controlTypeID == 10 || controlTypeID === 11 || controlTypeID === CORE.InputeFieldKeys.CustomAutoCompleteSearch) { /*  choice type field  */
                _obj.width = '300';
              }
              else if (controlTypeID == 12) {  /* Document Upload type fields */
                _obj.exporterSuppressExport = true;
                _obj.cellTemplate = '<md-button ng-if="COL_FIELD" class="md-warn md-hue-1 underline  margin-0" ng-click="grid.appScope.$parent.vm.downloadDocument(row.entity,\'' + fielditem.replace(/'/g, "\\'") + '\')"> \
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
                _obj.cellTemplate = '<md-button class="md-warn md-hue-1 underline  margin-0" ng-click="grid.appScope.$parent.vm.showSubFormValues(row.entity,\'' + fielditem.replace(/'/g, "\\'") + '\', $event)"> \
                                       View \
                                    </md-button>';
              }
              else if (fielditem == "Transaction Date") {
                _obj.width = '180';
              }

              if (!_.includes(allowedFieldsControlTypesForSortingFiltering, controlTypeID)) {
                _obj.enableFiltering = false;
                _obj.enableSorting = false;
              }
              if (fielditem == DataElementReportTransFields.Transaction_By) {
                _obj.enableFiltering = true;
                _obj.enableSorting = true;
                _obj.width = '110';
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
                if (controlTypeID == 5 || controlTypeID == 6) { /* Date Time | Date Range type field */
                  let dateTimeElement = _.find(vm.selectedEntity.dataElement, (item) => {
                    return item.dataElementID == fieldNameWithControlType[2];
                  });
                  if (dateTimeElement && dateTimeElement.formatMask) {
                    let defaultDateFormat = dateTimeElement.formatMask;
                    if (controlTypeID == 5) {
                      item[key] = $filter('date')(new Date(value), defaultDateFormat);
                    }
                    else if (controlTypeID == 6) {
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
            if (item["Transaction Date"]) { /* createdby - date */
              item["Transaction Date"] = $filter('date')(item["Transaction Date"], _dateTimeDisplayFormat);
            }
          });
          /* [E] to set default format of date time/date range data elements */

          vm.isNoDataFound = false;
          vm.emptyState = null;
        }
        $timeout(() => {
          vm.resetSourceGrid();
          if (!isGetDataDown) {
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          }
          else {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
          }
        });
      }
    }

    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = DataElementTransactionValuesManualFactory.dynamicmasterentity().query(vm.pagingInfo).$promise.then((elements) => {
        if (elements.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(elements, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = DataElementTransactionValuesManualFactory.dynamicmasterentity().query(vm.pagingInfo).$promise.then((elements) => {
        setDataAfterGetAPICall(elements, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.openAddDynamicDataElement = () => {
      //vm.selectedTab = 1;
      $state.go(CUSTOMFORMS.CUSTOMFORMS_MANAGE_ENTITY_STATE, { entityID: vm.entityID });
      //$timeout(() => {
      $scope.$emit('bindDynamicMasterTreeViewMain', { entityID: vm.entityID, tabTypeToSelect: DynamicMasterEntityTreeTabs.ManageDataElement.Type });
      //});
    }

    vm.updateRecord = (row, ev) => {
      //vm.selectedTab = 1;
      $state.go(CUSTOMFORMS.CUSTOMFORMS_MANAGE_ENTITY_STATE, {
        entityID: vm.entityID,
        refTransID: row.entity.refTransID
      });
    };

    /* delete entity*/
    vm.deleteRecord = (entityElement) => {
      let selectedIDs = [];
      if (entityElement) {
        selectedIDs.push(entityElement.dataElementTransManualIDs);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((entityitem) => entityitem.dataElementTransManualIDs);
        }
      }

      if (selectedIDs) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, vm.selectedEntity.entityName, selectedIDs.length);
        let obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        let objIDs = {
          id: selectedIDs,
          entityName: vm.selectedEntity.entityName
        }
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            DataElementTransactionValuesManualFactory.deleteDataElement_TransactionValuesManual().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res) {
                if (res.data && res.data.TotalCount && res.data.TotalCount > 0) {
                  BaseService.deleteAlertMessage(res.data);
                } else {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.gridOptions.clearSelectedRows();
                }
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
        messageContent.message = stringFormat(messageContent.message, "entity");
        let alertModel = {
          messageContent: messageContent,
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    }

    /* Show Description*/
    vm.showDescription = (object, field, ev) => {
      const data = {
        title: vm.selectedEntity.entityName,
        description: object[field],
        name: field.split('-##-')[0]
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data).then(() => {
          if (!vm.gridOptions.enablePaging) {
            initPageInfo();
          }
          vm.loadData();
        }, (err) =>  BaseService.getErrorLog(err));
    };

    /* show sub-form values in new popup */
    vm.showSubFormValues = (object, field, ev) => {
      let data = {
        elementName: field.split('-##-')[0],
        dataElementID: field.split('-##-')[2],
        SelectedEntity: vm.selectedEntity,
        refTransID: object.refTransID
      }
      DialogFactory.dialogService(
        CUSTOMFORMS.VIEW_SUBFORM_VALUES_MODAL_CONTROLLER,
        CUSTOMFORMS.VIEW_SUBFORM_VALUES_MODAL_VIEW,
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
        refTransID: object.refTransID,
        dataElementTransManualIDs: object.dataElementTransManualIDs
      }
      vm.cgBusyLoading = DataElementTransactionValuesManualFactory.downloadDocumentByRefID(documentObj).then((response) => {

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

    /*Refresh the page list */
    vm.refreshDynamicDataElementList = () => {
      vm.pagingInfo.SearchColumns = [];
      vm.loadData();
    }

    //Open pop up to display record level history
    vm.viewCustomFormHistory = (row, ev) => {
      row.entity.entityName = vm.selectedEntity.entityName;
      row.entity.isSubForm = false;
      DialogFactory.dialogService(
        CUSTOMFORMS.CUSTOMFORMS_ENTITY_HISTORY_CONTROLLER,
        CUSTOMFORMS.CUSTOMFORMS_ENTITY_HISTORY_VIEW,
        ev,
        row.entity).then(() => {
          //nothing to refresh
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    }


    //close popup on page destroy 
    $scope.$on('$destroy', function () {
      $mdDialog.hide(false, { closeAll: true });
    });
  }

})();
