(function () {
  'use sctrict';
  angular
    .module('app.core')
    .directive('purchaseSelectedPartsDetail', purchaseSelectedPartsDetail);

  /** @ngInject */
  function purchaseSelectedPartsDetail($mdDialog, $filter) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        partIds: '=?'
      },
      templateUrl: 'app/directives/custom/purchase-selected-parts-detail/purchase-selected-parts-detail.html',
      controller: PurchaseSelectedPartsDetailCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function PurchaseSelectedPartsDetailCtrl($scope, $element, $attrs, $timeout, $filter, $q, CORE, TRANSACTION, USER, DialogFactory, BaseService, PurchaseFactory) {
      var vm = this;
      vm.isHideDelete = true;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.LabelConstant = CORE.LabelConstant;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.PURCHASE_PARTS_DETAILS;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.isNoDataFound = true;
      vm.multiplePartNumbers = $scope.partIds;
      vm.purchaseSelectedPartClass = TRANSACTION.Purchase_Split_UI.SelectedPartGridUI;

      let initPageInfo = () => {
        vm.pagingInfo = {
          Page: 0,
          SortColumns: [['id', 'DESC']],
          SearchColumns: [],
          multiplePartNumbers: vm.multiplePartNumbers
        };
      }
      initPageInfo();
      vm.gridOptions = {
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfo.SearchColumns,
        enableCellEdit: false,
        enablePaging: false,
        enableCellEditOnFocus: false,
        exporterCsvFilename: 'Purchase Selected Parts Detail.csv',
        exporterMenuCsv: true,
        enableGrouping: false,
        enableColumnMenus: false,
          hideFilter:true
      };
      vm.editManufacturer = (mfgType, mfgcodeID) => {
        if (!mfgcodeID || mfgcodeID <= 0) {
          return;
        }
        var data = {
          id: mfgcodeID,
          mfgType: mfgType
        };
        if (data) {
          data.masterPage = true;
          data.isUpdatable = true;
        }
        else {
          data = {
            mfgType: CORE.MFG_TYPE.MFG,
            masterPage: true
          };
        }
        DialogFactory.dialogService(
          CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
          CORE.MANAGE_MFGCODE_MODAL_VIEW,
          null,
          data).then(() => {
          }, (data) => {

          },
            (err) => {
              return BaseService.getErrorLog(err);
            });
      };

      let initUIGrid = () => {
        vm.sourceHeader = [
          {
            field: '#',
            width: '50',
            cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
            enableFiltering: false,
            enableSorting: false,
            allowCellFocus: false,
          },
          {
            field: 'imageURL',
            width: 90,
            displayName: 'Image',
            cellTemplate: '<div class="ui-grid-cell-contents">'
              + '<img class="cm-grid-images" ng-src="{{COL_FIELD}}"></img>'
              + '</div>',
            enableFiltering: false,
            enableSorting: false,
            exporterSuppressExport: true,
            allowCellFocus: false,
          },
          {
            field: 'PIDCode',
            displayName: 'PID',
            width: CORE.UI_GRID_COLUMN_WIDTH.PID,
            cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link component-id="row.entity.id"\
                                             label="grid.appScope.$parent.vm.LabelConstant.MFG.PID"\
                                             value="COL_FIELD"\
                                             is-custom-part="row.entity.isCustom"\
                                             is-copy="true"\>\
                      </common-pid-code-label-link></div>',
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false,
          },
          {
            field: 'mfgCode',
            displayName: vm.LabelConstant.MFG.MFG,
            width: 120,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                            <a class="cm-text-decoration underline" ng-if="row.entity.mfgcodeID > 0"\
                                                ng-click="grid.appScope.$parent.vm.editManufacturer(row.entity.mfgType,row.entity.mfgcodeID);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                                            <span ng-if="row.entity.mfgcodeID <= 0">{{COL_FIELD}}</span>\
                                        </div>',
            allowCellFocus: false,
          },
          {
            field: 'mfgPN',
            width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
            displayName: vm.LabelConstant.MFG.MFGPN,
            cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link component-id="row.entity.id"\
                                             label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN"\
                                             value="COL_FIELD"\
                                             is-copy="true"\
                                             is-custom-part="row.entity.isCustom"\
                                             rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon"\
                                             rohs-status="row.entity.rohsComplientConvertedValue"\
                                             is-search-digi-key="true"\
                                             is-supplier="false"\
                                             redirection-disable="row.entity.isDisabledUpdate">\
                      </common-pid-code-label-link></div>',
            allowCellFocus: false,
          },
          {
            field: 'mfgPNDescription',
            width: 250,
            displayName: vm.LabelConstant.MFG.MFGPNDescription,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          },
          {
            field: 'functionalCategoryName',
            width: 150,
            displayName: 'Functional Type',
            cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{\'cm-input-color-red\' :row.entity.functionalCategoryID==-1}">{{COL_FIELD}}</div>',
          },
          {
            field: 'mountingTypeName',
            width: 150,
            displayName: 'Mounting Type',
            cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{\'cm-input-color-red\' :row.entity.mountingTypeID==-1}">{{COL_FIELD}}</div>',
          },
          {
            field: 'packageQty',
            width: 100,
            displayName: 'SPQ',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
          },
          {
            field: 'unitName',
            width: 100,
            displayName: 'UOM',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            allowCellFocus: false,
          },
          {
            field: 'noOfRows',
            width: 120,
            displayName: 'No. of Rows',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          },
          {
            field: 'noOfPosition',
            width: 120,
            displayName: vm.LabelConstant.MFG.noOfPosition,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          },
          {
            field: 'partStock',
            displayName: 'Available Stock',
            width: 100,
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false,
          },
          {
            field: 'inTransitStock',
            displayName: 'InTransite Purchase Stock',
            width: 100,
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false,
          },
          {
            field: 'nonUMIDStock',
            displayName: 'Non-UMID Stock',
            width: 100,
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false,
          },
          {
            field: 'lastQuoteSupplier',
            displayName: 'Last Quote Supplier',
            width: 120,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false,
          },
          {
            field: 'lastQuoteUnitPrice',
            displayName: 'Last Quote Unit Price',
            width: 110,
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false,
          },
          {
            field: 'lastQuotePackaging',
            displayName: 'Last Quote Packaging',
            width: 120,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false,
          },
          {
            field: 'lastBuySupplier',
            displayName: 'Last Buy Supplier',
            width: 100,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false,
          },
          {
            field: 'lastBuyUnitPrice',
            displayName: 'Last Buy Unit Price',
            width: 100,
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false,
          },
          {
            field: 'lastBuyPackaging',
            displayName: 'Last Buy Packaging',
            width: 100,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false,
          },
          {
            field: 'lastBuyRefPONumber',
            displayName: 'Last Buy Ref PO#',
            width: 150,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false,
          },
          {
            field: 'lastBuyRefSONumber',
            displayName: 'Last Buy Ref SO#',
            width: 150,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            enableFiltering: true,
            enableSorting: true,
            allowCellFocus: false,
          }
        ];
      }
      initUIGrid();

      vm.loadData = () => {
        if (!vm.multiplePartNumbers || !vm.multiplePartNumbers.length > 0) {
          vm.sourceData = [];
          vm.totalSourceDataCount = 0;
          vm.isNoDataFound = true;
          return;
        }
        if (vm.pagingInfo.SortColumns.length == 0)
          vm.pagingInfo.SortColumns = [['id', 'DESC']];
        vm.cgBusyLoading = PurchaseFactory.getPurchaseSelectedPartsList().query(vm.pagingInfo).$promise.then((response) => {
          if (response && response.data) {
            vm.sourceData = response.data.purchaseConsolidatedList;
            vm.totalSourceDataCount = response.data.Count;
            if (vm.sourceData && vm.sourceData.length > 0) {
              _.each(vm.sourceData, function (obj) {
                if (!obj.imageURL) {
                  obj.imageURL = CORE.NO_IMAGE_COMPONENT;
                }
                else if (!obj.imageURL.startsWith("http://") && !obj.imageURL.startsWith("https://")) {
                  obj.imageURL = BaseService.getPartMasterImageURL(obj.documentPath, obj.imageURL);
                }
              });
            }
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
                vm.emptyState = 0;
              }
            }
            else {
              vm.isNoDataFound = false;
              vm.emptyState = null;
            }
            $timeout(() => {
              vm.resetSourceGrid();
              if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount == vm.currentdata) {
                return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
              //$scope.$applyAsync();
              //$timeout(function () { $(window).resize(); }, 3000, false);
            });
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };
      // on scroll down get data 
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = PurchaseFactory.getPurchaseSelectedPartsList().query(vm.pagingInfo).$promise.then((response) => {
          if (response && response.data.components && response.data.components.length > 0) {
            formatStanradrdsOfGridData(response.data.components);
            vm.sourceData = vm.sourceData.concat(response.data.components);
            _.each(vm.sourceData, function (obj) {
              if (!obj.imageURL) {
                obj.imageURL = CORE.NO_IMAGE_COMPONENT;
              }
              else if (!obj.imageURL.startsWith("http://") && !obj.imageURL.startsWith("https://") && obj.imageURL != CORE.NO_IMAGE_COMPONENT) {
                obj.imageURL = BaseService.getPartMasterImageURL(obj.documentPath, obj.imageURL);
              }
              obj.isDisabledDelete = !vm.loginUser.isUserSuperAdmin;
            });
          }

          vm.currentdata = vm.sourceData.length;
          vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          $timeout(() => {
            vm.resetSourceGrid();
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount != vm.currentdata ? true : false);
          });
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };
    }
  }
})();
