(function () {
  'use strict';
  angular
    .module('app.core')
    .directive('assemblyOpeningStockList', AssemblyOpeningStockList);

  /** @ngInject */
  function AssemblyOpeningStockList($state, $rootScope, $timeout, $mdDialog, USER, CORE, AssemblyStockFactory, DialogFactory, BaseService, TRAVELER, TRANSACTION) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        assyId: '=?',
        pWoNumber: '=?',
        isNoDataFound: '=?',
        stockType: '=?'
      },
      templateUrl: 'app/directives/custom/assembly-opening-stock-list/assembly-opening-stock-list.html',
      controller: AssemblyOpeningStockListCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function AssemblyOpeningStockListCtrl($scope) {
      var vm = this;

      vm.popoverPlacement = 'left';
      vm.assyId = $scope.assyId || null;
      vm.pWoNumber = $scope.pWoNumber || null;
      vm.isNoDataFound = $scope.isNoDataFound || false;
      vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.ASSEMBLY_STOCK;
      vm.DateFormatArray = _dateDisplayFormat;
      vm.LabelConstant = CORE.LabelConstant;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.LabelConstant = CORE.LabelConstant;
      vm.loginUser = BaseService.loginUser;
      vm.isViewBoxSerialNo = true;
      vm.isViewAssembly = true;
      vm.isViewAddStockAdjustment = true;
      const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
      vm.stockType = $scope.stockType ? $scope.stockType : 'OS';

      if (vm.stockType === CORE.ASSY_STOCK_TYPE.WorkOrderStock) {
        vm.isHideDelete = true;
        vm.isUpdatable = false;
        vm.gridConfigId = angular.copy(CORE.gridConfig.gridAssemblyProductionStock);
      } else {
        vm.isHideDelete = false;
        vm.isUpdatable = true;
        vm.gridConfigId = angular.copy(CORE.gridConfig.gridAssemblyOpeningStock);
      }
      const isLegacyPOColumn = {
        field: 'isLegacyPOText',
        displayName: 'Legacy PO',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span  ng-class="{\'label-box label-warning\':(!row.entity.isLegacyPO),\
                        \'label-box label-success\':(row.entity.isLegacyPO)}"> \
                            {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        width: '105',
        allowCellFocus: false,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: CORE.MasterTemplateDropdown
        },
        ColumnDataType: 'StringEquals',
        enableFiltering: true,
        enableSorting: true
      };

      const loadSourceHeader = () => {
        let woNumberCellTemplate = '';
        let poNumberCellTemplate = '';
        let soNumberCellTemplate = '';
        if (vm.stockType === CORE.ASSY_STOCK_TYPE.WorkOrderStock) {
          woNumberCellTemplate = '<a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToWorkorderDetails(row.entity.woID);$event.preventDefault();">{{row.entity.woNumber}}</a> ' +
            '<copy-text  label="grid.appScope.$parent.vm.LabelConstant.Workorder.WO" text="row.entity.woNumber" ng-if="row.entity.woNumber"> </copy-text>' +
            '<md-tooltip ng-if="row.entity.woNumber">{{row.entity.woNumber}}</md-tooltip>';
          poNumberCellTemplate = '<div class="ui-grid-cell-contents text-left" ng-repeat="item in row.entity.poNumberList track by $index">' +
            '<a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManageSalesOrder(item.soID)" tabindex="-1">{{item.poNumber}}</a>' +
            '<span ng-if="row.entity.poNumberList.length - 1 > $index">,</span>  </div> ';
          soNumberCellTemplate = '<div class="ui-grid-cell-contents text-left" ng-repeat="item in row.entity.soNumberList track by $index">' +
            '<a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManageSalesOrder(item.soID)" tabindex="-1">{{item.soNumber}}</a>' +
            '<span ng-if="row.entity.soNumberList.length - 1 > $index">,</span>  </div>';
        } else {
          woNumberCellTemplate = '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}' +
            '<copy-text  label="grid.appScope.$parent.vm.LabelConstant.Workorder.WO" text="row.entity.woNumber" ng-if="row.entity.woNumber"> </copy-text>' +
            '</div>';
          poNumberCellTemplate = '<div class="ui-grid-cell-contents text-left">' +
            '<span ng-if="row.entity.soID"><a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManageSalesOrder(row.entity.soID)" tabindex="-1">{{row.entity.poNumber}}</a></span>' +
            '<span ng-if="!row.entity.soID">{{row.entity.poNumber}}</span>' +
            '<copy-text  label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.PO" text="row.entity.poNumber" ng-if="row.entity.poNumber"> </copy-text>' +
            '</div > ';
          soNumberCellTemplate = '<div class="ui-grid-cell-contents text-left">' +
            '<span ng-if="row.entity.soID"><a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManageSalesOrder(row.entity.soID)" tabindex="-1">{{row.entity.salesOrderNumber}}</a></span>' +
            '<span ng-if="!row.entity.soID">{{row.entity.salesOrderNumber}}</span>' +
            '<copy-text  label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.SO" text="row.entity.salesOrderNumber" ng-if="row.entity.salesOrderNumber"> </copy-text>' +
            '</div>';
        }
        vm.sourceHeader = [
          {
            field: 'Action',
            cellClass: 'gridCellColor',
            displayName: 'Action',
            width: '110',
            cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
            enableFiltering: false,
            enableSorting: false,
            exporterSuppressExport: true,
            pinnedLeft: true
          },
          {
            field: '#',
            width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
            cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
            enableFiltering: false,
            enableSorting: false
          },
          {
            field: 'imageURL',
            width: 80,
            displayName: 'Image',
            cellTemplate: '<div class="ui-grid-cell-contents">'
              + '<img class="cm-grid-images image-popover" ng-src="{{COL_FIELD}}"'
              + ' uib-popover-template="\'imagePreviewTemplate.html\'" '
              + ' popover-trigger="\'mouseenter\'" '
              + ' popover-append-to-body ="true" '
              + ' popover-class= "width-400 height-400 cm-center-screen-location cm-component-img" '
              + ' popover-placement="{{grid.appScope.$parent.vm.popoverPlacement}}" '
              + ' /> </div>',
            enableFiltering: false,
            enableSorting: false,
            exporterSuppressExport: true,
            allowCellFocus: false
          },
          {
            field: 'mfgCodeFormated',
            displayName: vm.LabelConstant.MFG.MFG,
            cellTemplate: '<div class="ui-grid-cell-contents ">' +
                  '<a tabindex="-1" class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManufacturerDetail(row.entity);">'+
                  '{{ row.entity.mfgCodeFormated }}'+
                  '</a></div>',
            enableFiltering: true,
            enableSorting: true,
            width: 220
          },
          {
            field: 'PIDCode',
            displayName: vm.LabelConstant.Assembly.ID,
            cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                            component-id="row.entity.partID" \
                            label="grid.appScope.$parent.vm.LabelConstant.Assembly.ID" \
                            value="row.entity.PIDCode" \
                            is-copy="true" \
                            is-mfg="true" \
                            mfg-label="grid.appScope.$parent.vm.LabelConstant.Assembly.MFGPN" \
                            mfg-value="row.entity.mfgPN" \
                            rohs-icon="row.entity.rohsIconPath" \
                            rohs-status="row.entity.rohsName" \
                            is-custom-part="row.entity.isCustomPart" \
                            is-copy-ahead-label="true"\
                            is-assembly="true"></common-pid-code-label-link></div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.PID
          },
          {
            field: 'mfgPN',
            displayName: vm.LabelConstant.Assembly.MFGPN,
            cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                        component-id="row.entity.partID" \
                                        label="grid.appScope.$parent.vm.LabelConstant.Assembly.MFGPN" \
                                        value="row.entity.mfgPN" \
                                        is-copy="true" \
                                        rohs-icon="row.entity.rohsIconPath" \
                                        rohs-status="row.entity.rohsName" \
                                        is-custom-part="row.entity.isCustomPart" \
                                        is-assembly="true"></div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.PID
          },
          {
            field: 'nickname',
            displayName: vm.LabelConstant.Assembly.NickName,
            enableCellEdit: false,
            enableCellEditOnFocus: false,
            width: CORE.UI_GRID_COLUMN_WIDTH.ASSY_NICKNAME
          },
          {
            field: 'custAssyPN',
            displayName: 'Part#',
            enableCellEdit: false,
            enableCellEditOnFocus: false,
            width: '170'
          },
          {
            field: 'mfgPNDescription',
            displayName: vm.LabelConstant.Assembly.Description,
            enableCellEdit: false,
            enableCellEditOnFocus: false,
            width: '250'
          },
          {
            field: 'openingdate',
            displayName: vm.stockType === CORE.ASSY_STOCK_TYPE.WorkOrderStock ? 'Stock Date' : 'Opening Date',
            type: 'date',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{row.entity.openingdate}}</div>',
            enableFiltering: false,
            enableSorting: false,
            width: '100'
          },
          {
            field: 'woNumber',
            displayName: 'WO#',
            cellTemplate: woNumberCellTemplate,
            enableCellEdit: false,
            enableCellEditOnFocus: false,
            width: '150'
          },
          {
            field: 'openingStock',
            displayName: vm.stockType === CORE.ASSY_STOCK_TYPE.WorkOrderStock ? 'Moved to Stock' : 'Initial Stock Qty',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            width: '150'
          },
          {
            field: 'serialNo',
            displayName: 'Notes',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}<md-tooltip md-direction="top" ng-if="row.entity.serialNo">{{COL_FIELD}}</md-tooltip></div>',
            enableCellEdit: false,
            enableCellEditOnFocus: false,
            width: '250'
          },
          {
            field: 'dateCode',
            displayName: 'Date Code',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: '70'
          },
          {
            field: 'dateCodeFormat',
            displayName: 'Date Code Format',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: '100'
          },
          {
            field: 'poNumber',
            displayName: CORE.LabelConstant.Workorder.PO,
            // cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            cellTemplate: poNumberCellTemplate,
            width: '200'
          },
          {
            field: 'totalPOQty',
            displayName: CORE.LabelConstant.Workorder.POQty,
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            width: '100'
          },
          {
            field: 'salesOrderNumber',
            displayName: CORE.LabelConstant.SalesOrder.SO,
            // cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            cellTemplate: soNumberCellTemplate,
            width: '200'
          },
          {
            field: 'qtyBox',
            displayName: 'Box Stock Qty',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: '200'
          },
          {
            field: 'binName',
            displayName: CORE.LabelConstant.TransferStock.Bin,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: '180',
            allowCellFocus: false
          },
          {
            field: 'warehouse',
            displayName: CORE.LabelConstant.TransferStock.WH,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: '220',
            allowCellFocus: false
          },
          {
            field: 'parentWarehouse',
            displayName: CORE.LabelConstant.TransferStock.Department,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: '200',
            allowCellFocus: false
          },
          {
            field: 'updatedAt',
            displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
            type: 'datetime',
            enableFiltering: false,
            visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
          },
          {
            field: 'updatedby',
            displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
            type: 'StringEquals',
            enableFiltering: true,
            visible: CORE.UIGrid.VISIBLE_MODIFIED_BY
          },
          {
            field: 'updatedbyRole',
            displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
            type: 'StringEquals',
            enableFiltering: true,
            visible: CORE.UIGrid.VISIBLE_MODIFIED_BYROLE
          },
          {
            field: 'createdAt',
            displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
            type: 'datetime',
            enableFiltering: false,
            visible: CORE.UIGrid.VISIBLE_CREATED_AT
          },
          {
            field: 'createdby',
            displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
            type: 'StringEquals',
            enableFiltering: true,
            visible: CORE.UIGrid.VISIBLE_CREATED_BY
          },
          {
            field: 'createdbyRole',
            displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
            type: 'StringEquals',
            enableFiltering: true,
            visible: CORE.UIGrid.VISIBLE_CREATED_BYROLE
          }
        ];

        if (vm.stockType === CORE.ASSY_STOCK_TYPE.OpeningStock) {
          vm.sourceHeader.splice(13, 0, isLegacyPOColumn);
        }
      };
      loadSourceHeader();

      const searchColumn = {
        ColumnDataType: 'Number',
        ColumnName: 'partID',
        SearchString: vm.assyId
      };
      const searchColWONumber = {
        ColumnName: 'woNumber',
        SearchString: vm.pWoNumber
      };
      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['PIDCode', 'ASC']],
          SearchColumns: [],
          stockType: vm.stockType
        };
      };
      initPageInfo();
      if (vm.assyId) {
        vm.pagingInfo.SearchColumns.push(searchColumn);
      }
      if (vm.pWoNumber) {
        vm.pagingInfo.SearchColumns.push(searchColWONumber);
      }

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
        exporterCsvFilename: vm.stockType === CORE.ASSY_STOCK_TYPE.WorkOrderStock ? 'Assembly Production Stock List.csv' :  'Assembly Initial Stock List.csv',
        CurrentPage: CORE.PAGENAME_CONSTANT[42].PageName,
        allowToExportAllData: true,
        /* Calls everytime for Export All Data [rowType = ALL] */
        exporterAllDataFn: () => {
          /* For scrolling pagination vm.pagingInfo.Page is increase everytime so we have to set API side pagePerReocrds as NULL for Export All Data */
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.Page = 1;
          vm.gridOptions.isExport = pagingInfoOld.isExport = true;
          return AssemblyStockFactory.assemblyStockList().query(pagingInfoOld).$promise.then((resStk) => {
            if (resStk.status === CORE.ApiResponseTypeStatus.SUCCESS && resStk.data) {
              _.each(resStk.data.stock, (obj) => {               
                obj.openingdate = BaseService.getUIFormatedDate(obj.openingdate, vm.DefaultDateFormat);               
              });
             // formatDataForExport(resStk.data.stock);
              return resStk.data.stock;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      //set data after API call from loadData() and getDataDown() method
      function setDataAfterGetAPICall(stock, isGetDataDown) {
        if (stock && stock.data.stock) {
          if (!isGetDataDown) {
            vm.sourceData = stock.data.stock;
            vm.currentdata = vm.sourceData.length;
          }
          else if (stock.data.stock.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(stock.data.stock);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          // must set after new data comes
          vm.totalSourceDataCount = stock.data.Count;
          if (!vm.gridOptions.enablePaging) {
            if (!isGetDataDown) {
              vm.gridOptions.gridApi.infiniteScroll.resetScroll();
            }
            else {
              vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
            }
          }
          if (vm.sourceData && vm.sourceData.length > 0) {
            _.each(vm.sourceData, (obj) => {
              obj.rohsIconPath = stringFormat('{0}{1}', vm.rohsImagePath, obj.rohsIcon);
              obj.openingdate = BaseService.getUIFormatedDate(obj.openingdate, vm.DefaultDateFormat);
              obj.imageURL = BaseService.getPartMasterImageURL(obj.documentPath, obj.imageURL);
            });
          }
          // format list incase of  multiple po/so in workorder to provide link to each detail
          if (vm.stockType === CORE.ASSY_STOCK_TYPE.WorkOrderStock) {
            formatSONumberListOfGridData(vm.sourceData);
            formatPONumberListOfGridData(vm.sourceData);
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
          $timeout(() => {
            setPopover();
          }, _configSecondTimeout);
        }
      }

      function setPopover() {
        $('.image-popover').on('mouseenter', (e) => {
          vm.popoverPlacement = (e.view.innerWidth / 2);
          if (vm.popoverPlacement < e.clientX) {
            vm.popoverPlacement = 'left';
          }
          else {
            vm.popoverPlacement = 'right';
          }
        });
      };

      $timeout(() => {
        $rootScope.$on(CORE.GRID_COL_PINNED_AND_VISIBLE_CHANGE, () => {
          $timeout(() => {
            setPopover();
          }, _configSecondTimeout);
        });
      });

      vm.loadData = () => {
        if (vm.pagingInfo.SortColumns.length === 0) {
          vm.pagingInfo.SortColumns = [['PIDCode', 'ASC']];
        }
        if (vm.assyId) {
          const isPartIdExists = vm.pagingInfo.SearchColumns.find((a) => a.ColumnName === 'partID');
          if (!isPartIdExists) {
            vm.pagingInfo.SearchColumns.push(searchColumn);
          }
        }
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = AssemblyStockFactory.assemblyStockList().query(vm.pagingInfo).$promise.then((stock) => {
          if (stock.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            setDataAfterGetAPICall(stock, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = AssemblyStockFactory.assemblyStockList().query(vm.pagingInfo).$promise.then((stock) => {
          if (stock) {
            setDataAfterGetAPICall(stock, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* Update Assembly Stock*/
      vm.updateRecord = (row, ev) => {
        const data = {};
        if (row && row.entity && row.entity.id) {
          data.id = row.entity.id;
        }
        if (vm.assyId) {
          data.assyId = vm.assyId;
        }
        vm.addEditAssemblyStock(data, ev);
      };

      /* Add/Update Assembly Stock*/
      vm.addEditAssemblyStock = (data, ev) => {
        DialogFactory.dialogService(
          USER.ADMIN_ASSEMBLYSTOCK_UPDATE_MODAL_CONTROLLER,
          USER.ADMIN_ASSEMBLYSTOCK_UPDATE_MODAL_VIEW,
          ev,
          data).then(() => {
            reloadUIGridWithFilter();
            reloadUIGridWithFilter();
          }, () => reloadUIGridWithFilter());
      };

      /* delete Assembly Stock*/
      vm.deleteRecord = (assemblyStock) => {
        let selectedIDs = [];
        if (assemblyStock) {
          selectedIDs.push(assemblyStock.id);
        } else {
          vm.selectedRows = vm.selectedRowsList;
          if (vm.selectedRows.length > 0) {
            selectedIDs = vm.selectedRows.map((assemblystockItem) => assemblystockItem.id);
          }
        }
        if (selectedIDs) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, 'Initial Stock', selectedIDs.length);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          const objIDs = {
            id: selectedIDs,
            CountList: false
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.cgBusyLoading = AssemblyStockFactory.deleteAssemblyStock().query({ objIDs: objIDs }).$promise.then((resp) => {
                if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  reloadUIGridWithFilter();
                } else if (resp && resp.status === CORE.ApiResponseTypeStatus.FAILED && resp.errors && resp.errors.data) {
                  if (resp.errors.data.notAllowedToDeleteAssyStockList && resp.errors.data.notAllowedToDeleteAssyStockList.length > 0) {
                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INITIAL_STOCK_USED_NOT_ALLOW_DELETE);
                    messageContent.message = stringFormat(messageContent.message, _.map(resp.errors.data.notAllowedToDeleteAssyStockList, 'woNumber'));
                    const model = {
                      messageContent: messageContent,
                      multiple: true
                    };
                    return DialogFactory.messageAlertDialog(model).then(() => {
                      reloadUIGridWithFilter();
                    });
                  }
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      /* View Box Serial no list for current assembly */
      vm.openBoxSerialNoListPopup = (row, ev) => {
        if (!row.entity.id) {
          return;
        }
        const data = {
          assyStockID: row.entity.id,
          assyID: row.entity.partID,
          isTrackbySerialNo: false,
          pidCode: row.entity.PIDCode,
          woNumber: row.entity.woNumber,
          assyRohsIcon: row.entity.rohsIcon,
          assyRohsName: row.entity.rohsName,
          datecode: row.entity.dateCode
        };

        DialogFactory.dialogService(
          TRAVELER.BOX_SERIAL_POPUP_CONTROLLER,
          TRAVELER.BOX_SERIAL_POPUP_VIEW,
          ev,
          data).then(() => {
            vm.loadData();
            // Success Section
          }, (error) => BaseService.getErrorLog(error));
      };

      vm.selectedCategoryType = () => vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;

      /* delete multiple data called from directive of ui-grid*/
      vm.deleteMultipleData = () => {
        vm.deleteRecord();
      };

      const refreshBoxSRNoUIGridList = $rootScope.$on(USER.RefreshBoxSRNoUIGridList, () => {
        reloadUIGridWithFilter();
      });

      $scope.$on(USER.AssemblyStockListReloadBroadcast, () => {
        reloadUIGridWithFilter();
      });

      /* view assembly stock details */
      vm.ViewAssemblyStockStatus = (row, event) => {
        const data = {
          partID: row.entity.partID,
          rohsIcon: stringFormat('{0}{1}', vm.rohsImagePath, row.entity.rohsIcon),
          rohsName: row.entity.rohsName,
          mfgPN: row.entity.mfgPN,
          PIDCode: row.entity.PIDCode
        };
        DialogFactory.dialogService(
          CORE.ASSEMBLY_STOCK_STATUS_MODAL_CONTROLLER,
          CORE.ASSEMBLY_STOCK_STATUS_MODAL_VIEW,
          event,
          data).then(() => { // empty
          }, () => { // empty
          }, (err) => BaseService.getErrorLog(err));
      };

      //close popup on page destroy
      $scope.$on('$destroy', () => {
        refreshBoxSRNoUIGridList();
        // commented below code as it close all popup popup on it
        //if (vm.assyId) { $mdDialog.hide(false, { closeAll: true }); }
      });

      // open stock adjustment popup to add new adjustment
      vm.addStockAdjustment = (row, ev) => {
        const popUpData = {
          popupAccessRoutingState: [TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_STATE],
          pageNameAccessLabel: CORE.LabelConstant.StockAdjustment.PageName
        };
        const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
        if (isAccessPopUp) {
          const data = {
            isAddDataFromCustomerPackingSlipPage: true,
            customerPackingSlipDet: {
              partID: row.entity.partID,
              PIDCode: row.entity.PIDCode,
              woNumber: row.entity.woNumber
            }
          };

          DialogFactory.dialogService(
            TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_POPUP_CONTROLLER,
            TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_POPUP_VIEW,
            ev,
            data).then(() => {
            }, (err) => BaseService.getErrorLog(err));
        }
      };

      //format poNumber List (all in new line) Of Grid Data
      const formatPONumberListOfGridData = (data) => {
        _.each(data, (item) => {
          if (item.poNumber) {
            item.poNumberList = item.poNumber.split('@@@@@') || [];
            _.each(item.poNumberList, (aliasSplit, index) => {
              const poSplitList = aliasSplit.split('#####');
              if (Array.isArray(poSplitList) && poSplitList.length > 0) {
                const objPODet = {
                  poNumber: poSplitList[0],
                  soID: poSplitList[1]
                };
                item.poNumberList[index] = objPODet;
              }
            });
            item.poNumber = item.poNumber ? item.poNumber.replace(/#####\d+@@@@@/g, ', ').replace(/#####\d+/g, '') : null;
          }
        });
      };

      //format soNumber List (all in new line) Of Grid Data
      const formatSONumberListOfGridData = (data) => {
        _.each(data, (item) => {
          if (item.salesOrderNumber) {
            item.soNumberList = item.salesOrderNumber.split('@@@@@') || [];
            _.each(item.soNumberList, (aliasSplit, index) => {
              const soSplitList = aliasSplit.split('#####');
              if (Array.isArray(soSplitList) && soSplitList.length > 0) {
                const objSODet = {
                  soNumber: soSplitList[0],
                  soID: soSplitList[1]
                };
                item.soNumberList[index] = objSODet;
              }
            });
            item.salesOrderNumber = item.salesOrderNumber ? item.salesOrderNumber.replace(/#####\d+@@@@@/g, ', ').replace(/#####\d+/g, '') : null;
          }
        });
      };
      // go to  workorder detail
      vm.goToWorkorderDetails = (woId) => {
        BaseService.goToWorkorderDetails(woId);
      };
      //go to salesordder detail
      vm.goToManageSalesOrder = (soId) => {
        BaseService.goToManageSalesOrder(soId);
      };
      //Go to MFR Detail
      vm.goToManufacturerDetail = (data) => {
        BaseService.goToManufacturer(data.mfgCodeID);
      };
      const reloadUIGridWithFilter = () => {
        if (vm.assyId) {
          vm.pagingInfo.SearchColumns.push(searchColumn);
        }
        if (vm.pWoNumber) {
          vm.pagingInfo.SearchColumns.push(searchColWONumber);
        }
        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
      };
    }
  }
})();
