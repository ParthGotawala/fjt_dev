(function () {
  'use strict';
  angular.module('app.core').directive('componentCustomerLoa', componentCustomerLoa);

  /** @ngInject */
  function componentCustomerLoa($mdDialog, $timeout, RFQTRANSACTION, PartCostingFactory, BaseService, CORE, DialogFactory, USER) {
    const directive = {
      restrict: 'E',
      replace: true,
      scope: {
        partid: '=?',
        customerid: '=?',
        isReadOnly: '=?'
      },
      templateUrl: 'app/directives/custom/component-customer-loa-directive/component-customer-loa.html',
      controller: ComponentCustomerLOAController,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for view data of Component DFM
    * @param
    */
    function ComponentCustomerLOAController($scope) {
      const vm = this;
      vm.isReadOnly = $scope.isReadOnly;
      vm.partID = $scope.partid;
      vm.customerID = $scope.customerid;
      vm.customerLOAEmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_CUSTOMER_LOA;
      vm.loaEntityname = CORE.AllEntityIDS.COMPONENT_CUSTOMER_LOA.Name;
      vm.LabelConstant = CORE.LabelConstant;
      vm.isHideDelete = true;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      if (vm.partID) {
        vm.customerLOAEmptyMesssage.ADDNEWMESSAGE = stringFormat(vm.customerLOAEmptyMesssage.ADDNEWMESSAGE, 'customer');
        vm.customerLOAEmptyMesssage.MESSAGE = stringFormat(vm.customerLOAEmptyMesssage.MESSAGE, 'customer');
        vm.customerLOAEmptyMesssage.SELECT_MESSAGE = stringFormat(vm.customerLOAEmptyMesssage.SELECT_MESSAGE, 'Customer');
      }
      if (vm.customerID) {
        vm.customerLOAEmptyMesssage.ADDNEWMESSAGE = stringFormat(vm.customerLOAEmptyMesssage.ADDNEWMESSAGE, 'part');
        vm.customerLOAEmptyMesssage.MESSAGE = stringFormat(vm.customerLOAEmptyMesssage.MESSAGE, 'part');
        vm.customerLOAEmptyMesssage.SELECT_MESSAGE = stringFormat(vm.customerLOAEmptyMesssage.SELECT_MESSAGE, 'Part');
      }

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [],
          SearchColumns: [],
          componentID: vm.partID || null,
          customerID: vm.customerID || null
        };
        if (vm.partID) {
          //vm.pagingInfo.pageName = CORE.PAGENAME_CONSTANT[7].PageName;
          vm.sourceHeader = [{
            field: 'Apply',
            displayName: 'Select',
            width: '75',
            cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox"><md-checkbox ng-model="row.entity.isSelected" \
                           ng-change="grid.appScope.$parent.vm.getSelectedRow(row.entity)"></md-checkbox></div>',
            enableFiltering: false,
            enableSorting: false,
            exporterSuppressExport: true,
            enableCellEdit: false,
            pinnedLeft: false,
            enableColumnMoving: false,
            manualAddedCheckbox: true
          }, {
            field: '#',
            width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
            cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
            enableFiltering: false,
            enableSorting: false,
            enableCellEdit: false,
            allowCellFocus: false
          }, {
            field: 'companyName',
            displayName: 'Customer',
            cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
            width: '300',
            enableCellEdit: false,
            allowCellFocus: false
          }, {
            field: 'loa_price',
            displayName: 'Price ($)' + CORE.Modify_Grid_column_Allow_Change_Message,
            cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD | number: 7}}</div>',
            width: '100',
            enableCellEdit: true,
            allowCellFocus: false
          }];
        }
        if (vm.customerID) {
          // vm.pagingInfo.pageName = CORE.PAGENAME_CONSTANT[8].PageName;
          vm.sourceHeader = [{
            field: 'Apply',
            displayName: 'Select',
            width: '75',
            cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox"><md-checkbox ng-model="row.entity.isSelected" \
                           ng-change="grid.appScope.$parent.vm.getSelectedRow(row.entity)"></md-checkbox></div>',
            enableFiltering: false,
            enableSorting: false,
            enableCellEdit: false,
            exporterSuppressExport: true,
            pinnedLeft: false,
            enableColumnMoving: false,
            manualAddedCheckbox: true
          }, {
            field: '#',
            width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
            cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
            enableFiltering: false,
            enableSorting: false,
            enableCellEdit: false
          }, {
            field: 'mfgPN',
            displayName: vm.LabelConstant.MFG.MFGPN,
            cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link component-id="row.entity.ComponentID"\
                            label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN"\
                            value="COL_FIELD"\
                            is-copy="true"\
                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon"\
                            rohs-status="row.entity.rohsComplientConvertedValue"\
                            is-supplier="false"\
                            is-custom-part="row.entity.isCustom"\
                            redirection-disable="row.entity.isDisabledUpdate">\
                        </common-pid-code-label-link></div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
            enableCellEdit: false
          }, {
            field: 'loa_price',
            displayName: 'Price ($)' + CORE.Modify_Grid_column_Allow_Change_Message,
            cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD | number: 7}}</div>',
            width: '100',
            enableCellEdit: true,
            allowCellFocus: false
          }];
        }
      };
      initPageInfo();

      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        hideMultiDeleteButton: true,
        enableCellEdit: true,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'CustomerLOA.csv'
      };

      // to set data in grid after data is retrived from API in loadData() and getDataDown() function
      const setDataAfterGetAPICall = (componentLOA, isGetDataDown) => {
        if (componentLOA && componentLOA.data && componentLOA.data.componentLOA) {
          if (!isGetDataDown) {
            vm.sourceData = componentLOA.data.componentLOA;
            vm.loacurrentdata = vm.sourceData.length;
          }
          else if (componentLOA.data.componentLOA.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(componentLOA.data.componentLOA);
            vm.loacurrentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          // must set after new data comes
          vm.totalloaSourceDataCount = componentLOA.data.Count;
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
            if (!vm.isEditIntigrate && !vm.customerLOANotFound) {
              cellEdit();
            } else {
              vm.isEditIntigrate = false;
            }
          }
          if (vm.totalloaSourceDataCount === 0) {
            if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.customerLOANotFound = false;
              vm.emptyState = 0;
            }
            else {
              vm.customerLOANotFound = true;
              vm.emptyState = null;
            }
          }
          else {
            if (vm.partID) {
              vm.getCustomerLOADetail(vm.partID, vm.sourceData[0].CustomerID);
              vm.selectedCustomerID = vm.sourceData[0].CustomerID;
            }
            if (vm.customerID) {
              vm.getCustomerLOADetail(vm.sourceData[0].ComponentID, vm.customerID);
              vm.selectedComponentID = vm.sourceData[0].ComponentID;
            }
            vm.sourceData[0].isSelected = true;

            vm.LOAID = null;
            vm.customerLOANotFound = false;
            vm.emptyState = null;
          }
          $timeout(() => {
            if (!isGetDataDown) {
              vm.resetSourceGrid();
              if (!vm.gridOptions.enablePaging && vm.totalloaSourceDataCount === vm.loacurrentdata) {
                return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            }
            else {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalloaSourceDataCount !== vm.loacurrentdata ? true : false);
            }
          });
        }
      };


      // load data for ui-grid
      vm.loadData = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = PartCostingFactory.getComponentLOAList().query(vm.pagingInfo).$promise.then((componentLOA) => {
          if (componentLOA && componentLOA.data) {
            setDataAfterGetAPICall(componentLOA, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = PartCostingFactory.getComponentLOAList().query(vm.pagingInfo).$promise.then((componentLOA) => {
          if (componentLOA && componentLOA.data) {
            setDataAfterGetAPICall(componentLOA, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getSelectedRow = (row) => {
        if (row && row.id) {
          if (row.id !== vm.LOAID) {
            _.each(vm.sourceData, (item) => {
              item.isSelected = false;
            });
            vm.LOAID = row.id;
            row.isSelected = true;
          }
          else {
            row.isSelected = true;
          }
          if (row && vm.partID) {
            vm.getCustomerLOADetail(vm.partID, row.CustomerID);
            vm.selectedCustomerID = row.CustomerID;
          }
          if (row && vm.customerID) {
            vm.getCustomerLOADetail(row.ComponentID, vm.customerID);
            vm.selectedComponentID = row.ComponentID;
          }
        }
      };

      vm.getCustomerLOADetail = (componentID, customerID) => {
        var model = {
          customerID: customerID,
          componentID: componentID
        };
        vm.selectedComponentID = componentID;
        vm.selectedCustomerID = customerID;
        vm.LOAID = null;
        vm.cgBusyLoading = PartCostingFactory.getImoprtLOA().save(model).$promise.then((res) => {
          if (res && res.data) {
            vm.LOAID = res.data.id;
            vm.customer = res.data.mfgCodemst.mfgName;
            vm.mfrPN = res.data.Component;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.addCustomerLOA = () => {
        if (vm.isReadOnly) {
          return;
        }

        var data = {
          customerID: vm.customerID,
          componentID: vm.partID
        };
        const ev = angular.element.Event('click');
        angular.element('body').trigger(ev);
        vm.LOAID = null;
        DialogFactory.dialogService(
          RFQTRANSACTION.COMPONENT_CUSTOMER_LOA_POPUP_CONTROLLER,
          RFQTRANSACTION.COMPONENT_CUSTOMER_LOA_POPUP_VIEW,
          ev,
          data).then((data) => {
            if (data) {
              vm.loadData();
            }
          }, () => {
            vm.loadData();
          });
      };
      // let _dummyEvent = null;
      vm.dummyEvent = ($event) => {
        _dummyEvent = $event;
      };
      $scope.$on('AddNew', () => {
        vm.addCustomerLOA();
      });

      //Update cell for LOA price
      function cellEdit() {
        vm.isEditIntigrate = true;
        vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
          var obj = _.find(vm.sourceData, (item) => item.id === rowEntity.id);
          var index = vm.sourceData.indexOf(obj);
          if (colDef.field === 'loa_price') {
            if (newvalue !== oldvalue) {
              if (newvalue && newvalue.toString().length < 10) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SAVE_CUSTOMER_LOA_PRICE_CONFIRMATION_BODY_MESSAGE);
                const objMessage = {
                  messageContent: messageContent,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                DialogFactory.messageConfirmDialog(objMessage).then((yes) => {
                  if (yes) {
                    const customerLoaModel = {
                      id: rowEntity.id,
                      loa_price: newvalue
                    };
                    // commented because evaluate wrong if it gets blank or null value
                    // if (newvalue !== null || newvalue !== '') {
                    if (newvalue !== null && newvalue !== '') {
                      vm.cgBusyLoading = PartCostingFactory.updateComponentCustomerLOAPrice().save(customerLoaModel).$promise.then((res) => {
                        if (res) {
                          if (res.status === 'FAILED' || res.status === 'EMPTY') {
                            rowEntity.loa_price = oldvalue;
                          }
                          $scope.$parent.$parent.vm.customerLOA.$setPristine();
                        }
                      }).catch((error) => BaseService.getErrorLog(error));
                    } else {
                      const obj = _.find(vm.sourceData, (item) => item.id === rowEntity.id);
                      const index = vm.sourceData.indexOf(obj);
                      vm.gridOptions.gridApi.grid.validate.setInvalid(vm.gridOptions.data[index], vm.gridOptions.columnDefs[3]);
                    }
                  }
                }, () => {
                  rowEntity.loa_price = oldvalue;
                  $scope.$parent.$parent.vm.customerLOA.$setPristine();
                }).catch((error) => BaseService.getErrorLog(error));
              } else {
                vm.gridOptions.gridApi.grid.validate.setInvalid(vm.gridOptions.data[index], vm.gridOptions.columnDefs[3]);
              }
            }
          }
        });
      }

      vm.goToComponentDetail = (mfgType, partId) => {
        if (mfgType) {
          mfgType = mfgType.toLowerCase();
        }
        BaseService.goToComponentDetailTab(mfgType, partId, USER.PartMasterTabs.Detail.Name);
      };
      vm.goTocomponentList = () => {
        BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE, {});
      };
      vm.getWoStatusClassName = (statusID) => BaseService.getWoStatusClassName(statusID);

      vm.gotoWorkorderlist = () => {
        BaseService.goToWorkorderList();
      };

      $scope.$on('$destroy', () => {
        $mdDialog.hide(false, {
          closeAll: true
        });
      });
    }
  }
})();
