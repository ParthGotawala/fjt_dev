(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('generatedUmidList', generatedUmidList);

  /** @ngInject */
  function generatedUmidList(BaseService, $timeout, CORE, USER) {
    const directive = {
      restrict: 'E',
      replace: true,
      scope: {
        list: '=',
        isShowPrintLabel: '=?'
      },
      templateUrl: 'app/directives/custom/generated-umid-list/generated-umid-list.html',
      controller: generatedUIDListCtrl,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;
    /** @ngInject */
    /**
    * Controller for view data of alternative details
    *
    * @param
    */
    function generatedUIDListCtrl($scope, $element, $attrs, $filter, ReceivingMaterialFactory, TRANSACTION, DialogFactory) {
      const vm = this;
      vm.CORE = CORE;
      vm.setScrollClass = 'gridScrollHeight_UMIDStatus';
      vm.isHideDelete = true;
      vm.isPrintLabel = true;
      vm.isShowPrintLabel = $scope.isShowPrintLabel || false;
      vm.loginUser = BaseService.loginUser;
      vm.LabelConstant = CORE.LabelConstant;
      vm.DefaultDateFormat = _dateTimeDisplayFormat;
      vm.MEASUREMENT_TYPES_COUNT = CORE.MEASUREMENT_TYPES.COUNT;
      vm.selectedRows = [];

      vm.showDescription = (object, ev) => {
        const data = {
          title: vm.LabelConstant.MFG.MFGPNDescription,
          description: object.mfgPNDescription,
          name: object.uid,
          label: vm.LabelConstant.UMIDManagement.UMID
        };
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          data).then(() => {
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.sourceHeader = [
        {
          field: 'Action',
          displayName: 'Action',
          width: '80',
          cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="2"></grid-action-view>',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: true,
          allowCellFocus: false
        },
        {
          field: '#',
          width: '70',
          cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
          enableFiltering: false,
          pinnedLeft: true,
          enableSorting: false
        },
        {
          field: 'uid',
          displayName: vm.LabelConstant.UMIDManagement.UMID,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToUIDManage(row.entity)" class="cm-text-decoration underline cursor-pointer">{{COL_FIELD| uppercase}}</a>\
                       <copy-text label="grid.appScope.$parent.vm.LabelConstant.UMIDManagement.UMID" text="row.entity.uid"></copy-text></div>',
          width: '170',
          allowCellFocus: false
        },
        {
          field: 'PIDCode',
          displayName: vm.LabelConstant.MFG.PID,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                        component-id="row.entity.refcompid" \
                                        label="grid.appScope.$parent.vm.LabelConstant.MFG.PID" \
                                        value="row.entity.PIDCode" \
                                        is-copy="true" \
                                        is-mfg="true" \
                                        mfg-label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.MFGPN" \
                                        mfg-value="row.entity.mfgPN" \
                                        rohs-icon="row.entity.rohsIcon" \
                                        rohs-status="row.entity.partRohsName" \
                                        is-copy-ahead-label="true" \
                                        is-custom-part="row.entity.isCustom"\
                                        cust-part-number="row.entity.custAssyPN" > \
                                    </common-pid-code-label-link></div>',
          width: '300',
          allowCellFocus: false
        },
        {
          field: 'mfgCodeName',
          displayName: vm.LabelConstant.MFG.MFG,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200',
          allowCellFocus: false
        },
        {
          field: 'mfrPN',
          displayName: vm.LabelConstant.MFG.MFGPN,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                    component-id="row.entity.refcompid" \
                                    label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN" \
                                    value="row.entity.mfgPN" \
                                    is-copy="true" \
                                    rohs-icon="row.entity.rohsIcon" \
                                    rohs-status="row.entity.partRohsName" \
                                    is-search-digi-key="true" \
                                    is-custom-part="row.entity.isCustom"\
                                    cust-part-number="row.entity.custAssyPN" > \
                                </common-pid-code-label-link></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          allowCellFocus: false
        },
        {
          field: 'mfgPNDescription',
          displayName: vm.LabelConstant.MFG.MFGPNDescription,
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.mfgPNDescription && row.entity.mfgPNDescription !== \'-\'" ng-click="grid.appScope.$parent.vm.showDescription(row.entity, $event)">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          width: '200',
          allowCellFocus: false
        },
        {
          field: 'binName',
          displayName: vm.LabelConstant.TransferStock.Bin,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '180',
          allowCellFocus: false
        },
        {
          field: 'warehouseName',
          displayName: vm.LabelConstant.TransferStock.WH,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '140',
          allowCellFocus: false
        },
        {
          field: 'parentWHName',
          displayName: vm.LabelConstant.TransferStock.ParentWH,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200',
          allowCellFocus: false
        },
        {
          field: 'pkgQty',
          displayName: 'Count',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'pkgUnit',
          displayName: 'Units',
          cellTemplate: '<div class="ui-grid-cell-contents  grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'unitName',
          displayName: 'UOM',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '100',
          allowCellFocus: false
        },
        {
          field: 'packagingName',
          displayName: 'Packaging',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '120',
          allowCellFocus: false
        }
      ];

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['index', 'DESC']],
          SearchColumns: [],
          pageName: CORE.PAGENAME_CONSTANT[7].PageName
        };
      };

      initPageInfo();

      vm.gridOptions = {
        enableFiltering: false,
        showColumnFooter: false,
        enableRowHeaderSelection: true,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: true,
        hideMultiDeleteButton: true,
        enableCellEdit: false,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'UMID Status.csv',
        allowCellFocus: false
      };

      /* retrieve Receiving Material list*/
      vm.loadData = () => {
        vm.sourceData = $scope.list || [];
        if (vm.pagingInfo.SortColumns.length > 0) {
          const column = [];
          const sortBy = [];
          _.each(vm.pagingInfo.SortColumns, (item) => {
            column.push(item[0]);
            sortBy.push(item[1]);
          });
          vm.sourceData = _.orderBy(vm.sourceData, column, sortBy);
          _.map(vm.sourceData, (data) => {
            data.rohsIcon = data.rohsIcon ? data.rohsIcon : stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, data.partRohsIcon);
          });
        }
        if (vm.pagingInfo.SearchColumns.length > 0) {
          _.each(vm.pagingInfo.SearchColumns, (item) => {
            vm.sourceData = $filter('filter')(vm.sourceData, { [item.ColumnName]: item.SearchString });
          });
          if (vm.sourceData.length === 0) {
            vm.emptyState = 0;
          }
        }
        else {
          vm.emptyState = null;
        }
        vm.totalSourceDataCount = vm.sourceData.length;
        vm.currentdata = vm.totalSourceDataCount;
        if (vm.totalSourceDataCount === 0) {
          if (vm.pagingInfo.SearchColumns.length > 0) {
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
          // set Filter disable default - Given this change by DP to fix Count-material UI [10-03-2021]
          if (vm.gridOptions && vm.gridOptions.gridApi && vm.gridOptions.gridApi.grid) {
            if (vm.gridOptions.gridApi.grid.gridMenuScope) {
              vm.gridOptions.gridApi.grid.gridMenuScope.showFilters = false;
            }
          }
          vm.resetSourceGrid();
          $timeout(() => {
            celledit();
          }, true);
          if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });
      };

      vm.selectAllRows = () => {
        if (!vm.isShowPrintLabel) {
          vm.gridOptions.gridApi.selection.selectAllRows();
        }
      };

      // method to update grid list
      const ScannUMIDStatus = $scope.$on('updateGeneratedUMIDList', (name, data) => {
        vm.sourceData = vm.sourceData.concat(data);
        vm.sourceData = _.orderBy(vm.sourceData, ['index'], ['desc']);
        _.map(vm.sourceData, (data) => {
          data.rohsIcon = data.rohsIcon ? data.rohsIcon : stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, data.partRohsIcon);
        });
        vm.totalSourceDataCount = vm.sourceData.length;
        vm.currentdata = vm.totalSourceDataCount;
        $timeout(() => {
          vm.resetSourceGrid();
        });
      });

      const celledit = () => {
        vm.gridOptions.gridApi.selection.on.rowSelectionChanged($scope, callbackFunction);
        vm.gridOptions.gridApi.selection.on.rowSelectionChangedBatch($scope, callbackFunction);
      };

      const callbackFunction = () => {
        vm.selectedRows = vm.gridOptions.gridApi.selection.getSelectedRows();
        $scope.$emit('selectUMIDListRow', vm.selectedRows);
      };

      $scope.$on('$destroy', () => {
        ScannUMIDStatus();
        callbackFunction();
      });

      vm.printLabelRecord = (row) => {
        if (row && row.entity) {
          const umidDetail = row.entity;
          if (!umidDetail.printerName) {
            const PrinterStorageValue = getLocalStorageValue('Printer');
            if (PrinterStorageValue && PrinterStorageValue.Printer) {
              umidDetail.printerName = umidDetail.printerName ? umidDetail.printerName : PrinterStorageValue.Printer.gencCategoryName;
            }
          }
          if (!umidDetail.printFormateName) {
            const ServiceStorageValue = getLocalStorageValue('PrintFormateOfUMID');
            if (ServiceStorageValue && ServiceStorageValue.PrintFormate) {
              umidDetail.printFormateName = umidDetail.printFormateName ? umidDetail.printFormateName : ServiceStorageValue.PrintFormate.Name;
            }
          }
          const printList = [{
            'uid': umidDetail.uid,
            'id': umidDetail.id,
            'numberOfPrint': 1,
            'reqName': 'Print',
            'PrinterName': umidDetail.printerName,
            'ServiceName': umidDetail.printFormateName,
            'printType': 'Print',
            'pageName': TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LABEL
          }];
          vm.printBarcodeLabel(printList);
        } else {
          const printList = [];
          let printObj;
          _.each(vm.selectedRows, (data) => {
            printObj = {
              'uid': data.UID,
              'id': data.id,
              'numberOfPrint': 1,
              'reqName': 'Print',
              'PrinterName': data.printerName,
              'ServiceName': data.printFormateName,
              'printType': 'Print',
              'pageName': TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LABEL
            };
            printList.push(printObj);
          });
          vm.printBarcodeLabel(printList);
        }
      };

      vm.printBarcodeLabel = (printList) => {
        if (printList && printList.length > 0) {
          $scope.$parent.vm.cgBusyLoading = ReceivingMaterialFactory.getDataForPrintLabelTemplate().query({
            printList: printList
          }).$promise.then((response) => {
            if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data && response.data.messageContent) {
              const messageContent = angular.copy(response.data.messageContent);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      vm.goToUIDManage = (data) => BaseService.goToUMIDDetail(data.id);

      vm.goToUMIDList = (whId, binId) => {
        BaseService.goToUMIDList(whId, binId);
      };
    }
  }
})();
