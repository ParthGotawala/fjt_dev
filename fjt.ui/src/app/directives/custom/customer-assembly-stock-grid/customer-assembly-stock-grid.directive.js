(function () {

  'use sctrict';
  angular
    .module('app.core')
    .directive('customerAssemblyStockGrid', customerAssemblyStockGrid);

  /** @ngInject */
  function customerAssemblyStockGrid(ManufacturerFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        customerId: "="      
      },
      templateUrl: 'app/directives/custom/customer-assembly-stock-grid/customer-assembly-stock-grid.html',
      controller: customerAssemblyStockGridCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function customerAssemblyStockGridCtrl($scope, $rootScope, $timeout, CORE, USER, BaseService) {
      var vm = this;
      vm.popoverPlacement = 'left';
      vm.gridConfig = CORE.gridConfig;
      vm.LabelConstant = CORE.LabelConstant;
      vm.isHideDelete = true;
      vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.CUSTOMER_ASSEMBLY_STOCK;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      let initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['PIDCode', 'ASC']],
          SearchColumns: [],
          customerId: $scope.customerId
        };
      }
      initPageInfo();

      vm.gridOptions = {        
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Customer Assembly Stock.csv'
      };
      vm.sourceHeader = [       
          {
            field: '#',
            width: '70',
            cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
            enableFiltering: false,
            enableSorting: false,
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
            allowCellFocus: false,
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
                            is-copy-ahead-label="true"\
                            is-assembly="true"></common-pid-code-label-link></div>',
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
            field: 'mfgPNDescription',
            displayName: vm.LabelConstant.Assembly.Description,
            enableCellEdit: false,
            enableCellEditOnFocus: false,
            width: '250'
          },
          {
            field: 'woNumber',
            displayName: "WO#",
            enableCellEdit: false,
            enableCellEditOnFocus: false,
            width: '150'
          },
          {
            field: 'readytoShipQty',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | unit }}</div>',
            displayName: "Ready to Ship Qty",
            enableCellEdit: false,
            enableCellEditOnFocus: false,
            width: '180'
          }
        ];
   

      function setPopover() {
        $('.image-popover').on('mouseenter', function (e) {
          vm.popoverPlacement = (e.view.innerWidth / 2);
          if (vm.popoverPlacement < e.clientX) {
            vm.popoverPlacement = 'left';
          }
          else {
            vm.popoverPlacement = 'right';
          }
        });
      };

      $timeout(function () {
        $rootScope.$on(CORE.GRID_COL_PINNED_AND_VISIBLE_CHANGE, function (event, data) {
          $timeout(() => {
            setPopover();
          }, _configSecondTimeout);
        });
      });

      vm.loadData = () => {
        vm.cgBusyLoading = ManufacturerFactory.getCustomerAssemblyStock(vm.pagingInfo).query().$promise.then((response) => {
          vm.sourceData = [];
          if (response && response.data) {
            vm.sourceData = response.data.customerAssemblyStock;
            vm.totalSourceDataCount = response.data.Count;
            setDataAfterGetAPICall();
          }          
          if (!vm.gridOptions.enablePaging) {
            vm.currentdata = vm.sourceData.length;
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptions.clearSelectedRows();
          if (vm.totalSourceDataCount == 0) {
            if (vm.pagingInfo.SearchColumns.length > 0 ) {
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
          $scope.$emit('CustomerAssemblyStock', vm.isNoDataFound);
          $timeout(() => {
            vm.resetSourceGrid();
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount == vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          });
          $timeout(() => {
            setPopover();
          }, _configSecondTimeout);
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      //set data after API call from loadData() and getDataDown() method
      function setDataAfterGetAPICall() {
        if (vm.sourceData && vm.sourceData.length > 0) {
          _.each(vm.sourceData, function (obj) {
            obj.rohsIconPath = stringFormat('{0}{1}', vm.rohsImagePath, obj.rohsIcon);
            obj.imageURL = BaseService.getPartMasterImageURL(obj.documentPath, obj.imageURL);
          });
        }
      }

      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = ManufacturerFactory.getCustomerAssemblyStock(vm.pagingInfo).query().$promise.then((response) => {
          vm.sourceData = vm.sourceData.concat(response.data.customerAssemblyStock);
          setDataAfterGetAPICall();
          vm.totalSourceDataCount = response.data.Count;
          vm.currentdata = vm.sourceData.length;
          vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          $timeout(() => {
            vm.resetSourceGrid();
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount != vm.currentdata ? true : false);
          });
          $timeout(() => {
            setPopover();
          }, _configSecondTimeout);
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };    
    }
  }
})();
