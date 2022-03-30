'use strict';
/**
 * @ngdoc function
 * @name app.directive:extentionUiGrid
 * @description
 * # extentionUiGrid
 * Directive of the app
 */
/** @ngInject */
angular.module('app.core')
  .directive('uiGridExtention', ['CORE', '$timeout', '$compile', function (CORE, $timeout, $compile) {
    var directive = {};
    directive.template = '<div cg-busy="{promise:gridOption.cgBusyLoadingForExport}" ng-class="{ \'grid-header-height\': gridOption.enableFiltering}" ui-grid="gridOption" class="gridheight" ng-class="scrollClass" ui-grid-infinite-scroll ui-grid-pagination ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-save-state ui-grid-pinning ui-grid-auto-resize ui-grid-draggable-rows ui-grid-grouping ui-grid-edit ui-grid-cellNav ui-grid-expandable ui-grid-validate ui-grid-row-edit ui-grid-custom-cell-select ui-grid-group-columns></div>';

    directive.scope = {
      gridId: "=?",
      changed: "=",
      loadData: '=',
      gridOption: '=',
      header: '=',
      gridData: '=',
      totalDataCount: '=',
      resetGrid: '=',
      selecttedRows: '=',
      pagingInfo: '=',
      emptyState: '=',
      getDataDown: '=',
      currentItem: '=',
      moveGridRowOrder: '=',
      deleteMultipleData: "=",
      scrollClass: '=?',
      getSelectedRow: '=?',
      cloudUpdateMultipleData: "=?",
      verifyLabelTemplateMultipleData: "=?",
      selectAllRows: "=?"
    };

    directive.link = function (scope, elm, attrs) {
      var vm = this;
      scope.activateUiGridExtension();
      var emptyStateTemplate = '<div class="empty-state ui-grid-empty-state full-height layout-row layout-wrap layout-align-center-center">\
                    <div class="emty-icon flex-100">\
                        <img src="assets/images/emptystate/grid-empty.png" />\
                    </div>\
                    <p class="empty-state-title empty-state-title-small flex-100">No result matching your search criteria</p>\
                </div>';

      scope.$watch('emptyState', function (newVal) {
        // state: filter no data              
        if (newVal == 0) {
          $timeout(function () {
            elm.find('.ui-grid-empty-state').remove();
            //elm.find('.ui-grid-viewport').last().append(emptyStateTemplate);
            elm.find('.ui-grid-render-container-body .ui-grid-viewport').last().append(emptyStateTemplate); // Updated by : Rinal Purpose : ui-grid-render-container-body class added due to empty state shown in right pinned tab container
            //In empty state add new class cm-empty-state-viewport for scoll ui
            if (newVal == 0) {
              elm.find('.ui-grid-render-container-body .ui-grid-viewport').addClass('cm-empty-state-viewport');
            } else {
              elm.find('.ui-grid-render-container-body .ui-grid-viewport').removeClass('cm-empty-state-viewport');
            }
          }, 0);
        }
        else {
          elm.find('.ui-grid-empty-state').remove();
          elm.find('.ui-grid-render-container-body .ui-grid-viewport').removeClass('cm-empty-state-viewport');
        }
      });
    }
    directive.controller = ['$scope', '$filter', '$rootScope', '$state', '$timeout', 'uiGridConstants', 'CORE', 'uiGridValidateService', 'DialogFactory', 'ManufacturerFactory', 'BaseService', 'MasterFactory', '$interval',
      function ($scope, $filter, $rootScope, $state, $timeout, uiGridConstants, CORE, uiGridValidateService, DialogFactory, ManufacturerFactory, BaseService, MasterFactory, $interval) {
        // ----- [S] - Navigate to particular column From Menu Item [Shubham - 29 / 12 / 2020]
        $scope.$watchCollection('header', () => {
          if ($scope.header && Array.isArray($scope.header)) {
            $scope.header.forEach((item) => {
              item.isColHeader = true;
            });
          }
        });
        // ----- [E] - Navigate to particular column From Menu Item [Shubham - 29 / 12 / 2020]

        var copyOfHeader = angular.copy($scope.header);
        $scope.activateUiGridExtension = activateUiGridExtension;
        $scope.resetGrid = resetGrid;
        $scope.isResetHeader = true;
        var UIGridConstant = CORE.UIGrid;
        let loginUser = BaseService.loginUser;

        var rowsSelectObj = {
          rowsList: [],
          getCurrentPageRows: function () {
            return $scope.gridApi.core.getVisibleRows($scope.gridApi.grid);
          },
          rowsSelectedFn: function () {
            var key = $scope.gridOption.selectedRowKey;
            var currentPageRows = this.getCurrentPageRows();

            // get new selected and deselected items
            var selectedRows = [];
            var deSelectedRows = [];

            angular.forEach(currentPageRows, function (item) {
              if (item.isSelected) {
                //if generic category page then restrict to add systemGenerated entry into selectedrows list 
                if ($scope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT[0].PageName ||
                  $scope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT[2].PageName
                  || $scope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT[4].PageName
                  || $scope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT[5].PageName) {
                  if (item.entity && !item.entity.systemGenerated) {
                    selectedRows.push(item);
                  }
                  else {
                    item.isSelected = false;
                    deSelectedRows.push(item);
                  }
                }
                else {
                  selectedRows.push(item);
                }
              }
              else {
                deSelectedRows.push(item);
              }
            });
            // ends

            // remove deselected items from list
            var removeItems = [];
            for (var i = 0; i < this.rowsList.length; i++) {
              var row = this.rowsList[i];
              for (var j = 0; j < deSelectedRows.length; j++) {
                var item = deSelectedRows[j];
                if (item.entity[key] == row.entity[key]) {
                  removeItems.push(row);
                  break;
                }
              }
            }

            for (var i = 0; i < removeItems.length; i++)
              this.rowsList.splice(this.rowsList.indexOf(removeItems[i]), 1);
            // ends

            // add new selected items into list
            var newItems = [];
            for (var i = 0; i < selectedRows.length; i++) {
              var row = selectedRows[i];
              var isFound = false;
              for (var j = 0; j < this.rowsList.length; j++) {
                if (this.rowsList[j].entity[key] == row.entity[key]) {
                  isFound = true;
                  break;
                }
              }
              if (!isFound)
                newItems.push(row);
            }
            this.rowsList = this.rowsList.concat(newItems);
            // ends
          },
          rowsRenderedFn: function () {
            $scope.gridApi.grid.selection.selectAll = false;
            //var key = $scope.gridOption.selectedRowKey;
            var currentPageRows = this.getCurrentPageRows();
            //for (var i = 0; i < currentPageRows.length; i++) {
            //  var item = currentPageRows[i];
            //  for (var j = 0; j < this.rowsList.length; j++) {
            //    var row = this.rowsList[j];
            //    if (row.entity[key] == item.entity[key]) {
            //      item.isSelected = true;
            //      break;
            //    }
            //  }
            //}

            if (currentPageRows.length > 0) {

              var isAll = true;
              for (var i = 0; i < currentPageRows.length; i++) {
                if (!currentPageRows[i].isSelected) {
                  isAll = false;
                  break;
                }
              }
              $scope.gridApi.grid.selection.selectAll = isAll;
            }
          },
          getSelectedRows: function () {
            var rows = [];
            angular.forEach(this.rowsList, function (item) {
              if (!item.entity.systemGenerated)
                rows.push(item.entity);
            });
            return rows;
          },
          getSelectedRowsCount: function () {
            return this.rowsList.length;
          },
          clearSelectedRows: function () {
            this.rowsList = [];
          }
        };

        $scope.gridOption = $scope.gridOption || {};
        $scope.gridOption = {
          genericCategoryTypeID: $scope.gridOption.genericCategoryTypeID,
          flatEntityAccess: $scope.gridOption.flatEntityAccess ? true : false,  /* to display field that name contain . like "Flat No." field */
          enableRowHeaderSelection: $scope.gridOption.enableRowHeaderSelection || UIGridConstant.enableRowHeaderSelection, // Added to disable row selection in all grid
          enableRowSelection: $scope.gridOption.enableRowSelection || UIGridConstant.enableRowSelection, // Added to disable row selection in all grid
          multiSelect: $scope.gridOption.multiSelect || UIGridConstant.multiSelect,
          enableFullRowSelection: $scope.gridOption.enableFullRowSelection || UIGridConstant.enableFullRowSelection,
          enableFiltering: $scope.gridOption.enableFiltering != undefined ? $scope.gridOption.enableFiltering : true, //Filter data
          useExternalFiltering: true,
          enableGridMenu: $scope.gridOption.enableGridMenu != false ? true : $scope.gridOption.enableGridMenu,
          enableSorting: $scope.gridOption.enableSorting != undefined ? $scope.gridOption.enableSorting : true, //Filter data
          enableColumnResizing: true, // Column resizing
          useExternalPagination: true, //Date pagination            
          showColumnFooter: $scope.gridOption.showColumnFooter ? $scope.gridOption.showColumnFooter : false,
          showColumnHeader: true,
          showAction: $scope.gridOption.showAction,
          exporterCsvFilename: $scope.gridOption.exporterCsvFilename ? $scope.gridOption.exporterCsvFilename : 'myFile.csv',
          exporterMenuPdf: false,
          //exporterMenuPdf: $scope.gridOption.exporterMenuPdf ? $scope.gridOption.exporterMenuPdf : true, // Added by Leena for POC - 07/02/2020
          useExternalSorting: true, // Data sorting 
          paginationPageSizes: UIGridConstant.paginationPageSizes, // Page size in pagination   
          enablePaging: $scope.gridOption.enablePaging != undefined ? $scope.gridOption.enablePaging : UIGridConstant.enablePaging,
          enableGrouping: $scope.gridOption.enableGrouping != undefined ? $scope.gridOption.enableGrouping : UIGridConstant.enableGrouping,
          enablePaginationControls: $scope.gridOption.enablePaginationControls != undefined ? $scope.gridOption.enablePaginationControls : UIGridConstant.enablePaging,
          // -----  [S] - Configure for manage export functionality  [charmi - 28/08/2021]
          exporterHeaderFilter: ($scope.gridOption.exporterHeaderFilter === true || $scope.gridOption.exporterHeaderFilter === false) ? $scope.gridOption.exporterHeaderFilter : true,
          exporterMenuCsv: $scope.gridOption.exporterMenuCsv ? $scope.gridOption.exporterMenuCsv : false,
          allowToExportAllData: $scope.gridOption.allowToExportAllData ? $scope.gridOption.allowToExportAllData : false,
          exporterAllDataFn: $scope.gridOption.exporterAllDataFn,
          // -----  [E] - Configure for manage export functionality [charmi - 28/08/2021]
          selectedRowKey: $scope.gridOption.selectedRowKey || UIGridConstant.selectedRowKey,
          rowHeight: $scope.gridOption.rowHeight,
          infiniteScrollRowsFromEnd: 20,
          enableSelectAll: $scope.gridOption.enableSelectAll == false ? $scope.gridOption.enableSelectAll : true,
          noUnselect: $scope.gridOption.noUnselect ? $scope.gridOption.noUnselect : false,
          enableFocusRowOnRowHeaderClick: $scope.gridOption.enableFocusRowOnRowHeaderClick ? $scope.gridOption.enableFocusRowOnRowHeaderClick : false,
          infiniteScrollDown: $scope.gridOption.enablePaging != undefined ? !$scope.gridOption.enablePaging : !UIGridConstant.enablePaging,
          rowTemplate: $scope.gridOption.rowTemplate ? $scope.gridOption.rowTemplate : "",
          enableDraggableRows: $scope.gridOption.enableDraggableRows ? $scope.gridOption.enableDraggableRows : false,
          treeRowHeaderAlwaysVisible: true,
          enableCellEdit: $scope.gridOption.enableCellEdit ? true : false,
          enableExpandableRowHeader: $scope.gridOption.enableExpandableRowHeader ? true : false,
          expandableRowTemplate: $scope.gridOption.expandableRowTemplate ? $scope.gridOption.expandableRowTemplate : "salsorderdetail.html",
          expandableRowHeight: $scope.gridOption.expandableRowHeight ? $scope.gridOption.expandableRowHeight : null,
          enableCellEditOnFocus: $scope.gridOption.enableCellEditOnFocus ? true : false,
          rowEditWaitInterval: -1,
          //enableColumnMenus:$scope.gridOption.enableColumnMenus?true:false,
          CurrentPage: $scope.gridOption.CurrentPage ? $scope.gridOption.CurrentPage : null,
          checkDeleteRoleWise: $scope.gridOption.checkDeleteRoleWise ? true : false,
          hideMultiDeleteButton: $scope.gridOption.hideMultiDeleteButton ? $scope.gridOption.hideMultiDeleteButton : false,
          hideAddNew: $scope.gridOption.hideAddNew ? $scope.gridOption.hideAddNew : false,
          showCloudUpdateButton: $scope.gridOption.showCloudUpdateButton ? $scope.gridOption.showCloudUpdateButton : false,
          showVerifyLabelTemplateButton: $scope.gridOption.showVerifyLabelTemplateButton ? $scope.gridOption.showVerifyLabelTemplateButton : false,
          hideFilter: $scope.gridOption.hideFilter,
          isShowDelete: $scope.gridOption.isShowDelete,
          isDeleteFeatureBased: $scope.gridOption.isDeleteFeatureBased,
          exporterSuppressColumns: $scope.gridOption.exporterSuppressColumns ? $scope.gridOption.exporterSuppressColumns : [],
          exporterOlderExcelCompatibility: true, // [03/24/2022] [Dharam] [Bug 42451: Show Invalid character with Special Characters in Exported CSV Files from UI Grid]
          // Added by Leena for POC - 07/02/2020
          //exporterPdfMaxGridWidth: $scope.gridOption.exporterPdfMaxGridWidth ? $scope.gridOption.exporterPdfMaxGridWidth : 720,
          //exporterMenuExcel: $scope.gridOption.exporterMenuExcel ? $scope.gridOption.exporterMenuExcel : true,
          //exporterExcelFilename: $scope.gridOption.exporterExcelFilename ? $scope.gridOption.exporterExcelFilename : "download.xlsx",
          //exporterExcelSheetName: $scope.gridOption.exporterExcelSheetName ? $scope.gridOption.exporterExcelSheetName : "Sheet1",
          //exporterPdfOrientation: $scope.gridOption.exporterPdfOrientation ? $scope.gridOption.exporterPdfOrientation : 'landscape',
          //exporterPdfPageSize: $scope.gridOption.exporterPdfPageSize ? $scope.gridOption.exporterPdfPageSize : 'A4',
          //exporterPdfDefaultStyle: $scope.gridOption.exporterPdfDefaultStyle ? $scope.gridOption.exporterPdfDefaultStyle : { fontSize: 11 },
          //exporterPdfTableHeaderStyle: $scope.gridOption.exporterPdfTableHeaderStyle ? $scope.gridOption.exporterPdfTableHeaderStyle : { fontSize: 10, bold: true },
          //exporterPdfFooter: $scope.gridOption.exporterPdfHeader ? $scope.gridOption.exporterPdfHeader : function (currentPage, pageCount) {
          //  return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle', alignment: 'right', margin: [10, 10, 10, 10] };
          //},
          //exporterPdfCustomFormatter: function (docDefinition) {
          //  docDefinition.styles.headerStyle = { fontSize: 12, bold: true };
          //  docDefinition.styles.footerStyle = { fontSize: 10, bold: true, };
          //  return docDefinition;
          //},
          // Added by Leena for POC - 07/02/2020
          expandableRowScope: {
            subGridVariable: $scope.gridOption.expandableRowScope ? $scope.gridOption.expandableRowScope : null
          },
          appScopeProvider: $scope.gridOption.appScopeProvider ? $scope.gridOption.appScopeProvider : null,
          gridMenuCustomItems: [
          ],
          getSelectedRows: function () {
            return rowsSelectObj.getSelectedRows();
          },
          clearSelectedRows: function () {
            rowsSelectObj.clearSelectedRows();
            $scope.gridApi.selection.clearSelectedRows();
          },
          getSelectedRowsCount: function () {
            return rowsSelectObj.getSelectedRowsCount();
          },
          onRegisterApi: function (gridApi) {
            $scope.gridOption.gridApi = gridApi;
            $scope.gridApi = gridApi;
            if (!$scope.gridOption.enablePaginationControls)
              gridApi.infiniteScroll.on.needLoadMoreData($scope, $scope.getDataDown);

            if (this.enableRowHeaderSelection || this.enableFullRowSelection) {
              $scope.gridApi.core.on.rowsRendered($scope, function (grid, sortColumns) {
                rowsSelectObj.rowsRenderedFn();
                if ($scope.selectAllRows) {
                  $scope.selectAllRows();
                }
              });
            }
            if (!$scope.gridOption.enableExpandableRowHeader) {
              $scope.gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
              });
            }
            $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
              $scope.pagingInfo.SortColumns = [];
              angular.forEach(sortColumns, function (value, key) {
                value.sort.priority = key;
                //$scope.pagingInfo.SortColumns.push({ ColumnName: value.field, Direction: value.sort.direction })
                $scope.pagingInfo.SortColumns.push([value.field, value.sort.direction])
              });
              $scope.isResetHeader = false;
              if (!$scope.gridOption.enablePaging) {
                $scope.gridData = [];
                $scope.pagingInfo.Page = $scope.pagingInfo.Page === 0 ? 0 : 1;
              }
              $scope.loadData($scope.pagingInfo);
            });
            $scope.gridApi.core.on.filterChanged($scope, function () {
              // commned as not remove any external Search like from all mfg contains and exact search
              $scope.pagingInfo.Page = $scope.gridApi.grid.options.paginationCurrentPage = CORE.UIGrid.Page();
              //$scope.pagingInfo.SearchColumns = []; 
              _.remove($scope.pagingInfo.SearchColumns, (item) => {
                return !item.isExternalSearch;
              });
              angular.forEach($scope.gridApi.grid.columns, function (value, key) {
                if (value.filters[0].term != null && value.filters[0].term != "") {
                  for (var i = 0; i < $scope.header.length; i++) {
                    var item = $scope.header[i];
                    if (item.field == value.field) {

                      //let obj = {};
                      //obj[value.field] = value.filters[0].term;
                      //$scope.pagingInfo.SearchColumns.push(obj);
                      $scope.pagingInfo.SearchColumns.push({ ColumnName: value.field, SearchString: value.filters[0].term, ColumnDataType: item.ColumnDataType });
                      break;
                    }
                  }
                }
              });
              $scope.isResetHeader = false;
              if ($rootScope.IsAdvanceSearch != true) {
                if (angular.isDefined($scope.filterTimeout)) {
                  $timeout.cancel($scope.filterTimeout);
                }
                $scope.filterTimeout = $timeout(function () {
                  /* case : "filtering is there and resetGrid(resetGridData)" called that time 
                  this filterTimeout function also called. so to prevent loadData twice issue - 
                  we have put this if condition code with isResetGridCalled flag */
                  if ($scope.isResetGridCalled && $scope.pagingInfo.SearchColumns.length == 0) {
                    $scope.isResetGridCalled = false;
                  }
                  else {
                    if (!$scope.gridOption.enablePaging) {
                      $scope.pagingInfo.Page = $scope.pagingInfo.Page === 0 ? 0 : 1;
                      $scope.gridData = [];
                    }
                    $scope.loadData($scope.pagingInfo);
                    $scope.isResetGridCalled = false;
                  }

                }, 500);

              }
            });
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
              //if generic category type page then restrct to select disable row at delete count 
              if ($scope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT[0].PageName ||
                $scope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT[2].PageName
                || $scope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT[4].PageName
                || $scope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT[5].PageName) {
                if (row.entity.systemGenerated) {
                  row.isSelected = false;
                }
              }

              $scope.selecttedRows = gridApi.selection.getSelectedRows();
              //On Unit Of Measurement page do not unselect row of grid when select on row
              if (($scope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT[12].PageName || $scope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT[13].PageName)
                && $scope.selecttedRows.length == 0) {
                row.isSelected = true;
              }
              rowsSelectObj.rowsSelectedFn();
              if ($scope.selecttedRows && $scope.getSelectedRow) {
                $scope.getSelectedRow($scope.selecttedRows[0]);
              }
            });

            gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
              // if generic category type then retrieve only list which is not system genereted in selected rows
              $scope.selecttedRows = gridApi.selection.getSelectedRows();
              if ($scope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT[0].PageName ||
                $scope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT[2].PageName
                || $scope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT[4].PageName
                || $scope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT[5].PageName)
                //$scope.selecttedRows = _.filter($scope.selecttedRows, ['systemGenerated', false]);
                $scope.selecttedRows = _.filter($scope.selecttedRows, (rowitem) => {
                  return rowitem.systemGenerated == false;
                });

              rowsSelectObj.rowsSelectedFn();
            });

            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
              $scope.pagingInfo.Page = newPage;
              $scope.pagingInfo.ItemsPerPage = pageSize;
              $scope.isResetHeader = false;
              $scope.loadData($scope.pagingInfo);
            });

            if ($scope.gridOption.enableDraggableRows) {
              gridApi.draggableRows.on.rowDropped($scope, function (info, dropTarget) {
                // $scope.moveGridRowOrder();  // getting error in api when calling again n again like 6-7 times
              });
            }

            //Dharam: [01/08/2019] Event raised when column position has changed
            gridApi.colMovable.on.columnPositionChanged($scope, function (colDef, originalPosition, newPosition) {
              colDef.displayOrder = newPosition;
              // When we add 'Multiple Selection' column added then need to Give index of Array
              // Condition "|| $scope.gridOption.enableRowHeaderSelection === false" added to resolve column order issue when grid does not have any checkbox column to select multiple records (multiple delete OR other purpose)
              var isManualCheckBoxAdded = $scope.gridOption.columnDefs.some((item) => item.manualAddedCheckbox == true || $scope.gridOption.enableRowHeaderSelection === false) ? 0 : 1;
              if ($scope.gridOption.enableExpandableRowHeader) {
                isManualCheckBoxAdded = 1;
              }
              BaseService.moveArrayObjToOtherIndex($scope.gridOption.columnDefs, originalPosition - isManualCheckBoxAdded, newPosition - isManualCheckBoxAdded);
              _.each($scope.gridOption.columnDefs, (item, index) => { item.colInitIndex = (index + 1); item.displayOrder = (index + 1); })
              var header = _.sortBy($scope.gridOption.columnDefs, ['displayOrder', 'colInitIndex']);
              var columnDefList = _.map(header, (item, index) => {
                return {
                  field: item.field,
                  displayOrder: (index + 1),
                  pinnedLeft: item.pinnedLeft,
                  pinnedRight: item.pinnedRight,
                  visible: item.visible
                };
              });
              saveColumnSequence(columnDefList);
              $rootScope.$emit(CORE.GRID_COL_PINNED_AND_VISIBLE_CHANGE);
            });


            //Dharam: [01/09/2019] Event raised when column pin state has changed
            gridApi.pinning.on.columnPinned($scope, function (colDef, container) {
              var colDet = _.find($scope.gridOption.columnDefs, { field: colDef.field });
              if (colDet) {
                colDet.pinnedLeft = container == 'left' ? true : false;
                colDet.pinnedRight = container == 'right' ? true : false;
              }
              var columnDefList = _.map($scope.gridOption.columnDefs, (item) => {
                return {
                  field: item.field,
                  displayOrder: item.displayOrder,
                  pinnedLeft: item.pinnedLeft,
                  pinnedRight: item.pinnedRight,
                  visible: item.visible
                };
              });
              saveColumnSequence(columnDefList);
              $rootScope.$emit(CORE.GRID_COL_PINNED_AND_VISIBLE_CHANGE);
            });

            //Dharam: [01/09/2019] Event raised when column visibility has changed
            gridApi.core.on.columnVisibilityChanged($scope, function (column) {
              var colDet = _.find($scope.gridOption.columnDefs, { field: column.field });
              if (colDet) {
                colDet.visible = column && column.colDef.visible ? true : false;
              }
              var columnDefList = _.map($scope.gridOption.columnDefs, (item) => {
                return {
                  field: item.field,
                  displayOrder: item.displayOrder,
                  pinnedLeft: item.pinnedLeft,
                  pinnedRight: item.pinnedRight,
                  visible: item.visible
                };
              });
              saveColumnSequence(columnDefList);
              $rootScope.$emit(CORE.GRID_COL_PINNED_AND_VISIBLE_CHANGE);
            });
          },

          exporterFieldCallback: function (grid, row, col, value) {
            if (col.colDef.type) {
              switch (col.colDef.type) {
                case "date":
                  value = $filter('date')(value, _dateDisplayFormat);
                  break;
                case "datetime":
                  value = $filter('date')(value, _dateTimeDisplayFormat);
                  break;
                case "time":
                  value = $filter('convertSecondsToTime')(value);
                  break;
                case "html":
                  value = htmlToPlaintext(value);
                  break;
                default:
                  break;
              }
            }
            return value;
          }
        };

        // Added by Leena for POC - 07/02/2020
        ////async function getBase64ImageFromUrl(imageUrl) {
        ////  var res = await fetch(imageUrl);
        ////  var blob = await res.blob();

        ////  return new Promise((resolve, reject) => {
        ////    var reader = new FileReader();
        ////    reader.addEventListener("load", function () {
        ////      resolve(reader.result);
        ////    }, false);

        ////    reader.onerror = () => {
        ////      return reject(this);
        ////    };
        ////    reader.readAsDataURL(blob);
        ////  })
        ////}
        ////function getBase64Image(imgUrl, callback) {

        ////  var img = new Image();

        ////  // onload fires when the image is fully loadded, and has width and height

        ////  img.onload = function () {

        ////    var canvas = document.createElement("canvas");
        ////    canvas.width = img.width;
        ////    canvas.height = img.height;
        ////    var ctx = canvas.getContext("2d");
        ////    ctx.drawImage(img, 0, 0);
        ////    var dataURL = canvas.toDataURL("image/png"),
        ////      dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

        ////    callback(dataURL); // the base64 string

        ////  };

        ////  // set attributes and src 
        ////  img.setAttribute('crossOrigin', 'anonymous'); //
        ////  img.src = imgUrl;

        ////}

        //function toDataURL(url, callback) {
        //  var xhr = new XMLHttpRequest();
        //  xhr.onload = function () {
        //    var reader = new FileReader();
        //    reader.onloadend = function () {
        //      callback(reader.result);
        //    }
        //    reader.readAsDataURL(xhr.response);
        //  };
        //  xhr.open('GET', url);
        //  xhr.responseType = 'blob';
        //  xhr.send();
        //}
        // Added by Leena for POC - 07/02/2020

        //Mrp quantity validation
        uiGridValidateService.setValidator('comparemrpqty',
          function (argument) {
            return function (oldValue, newValue, rowEntity, colDef) {
              if (!newValue) {
                return false; // We should not test for existence here
              } else {
                rowEntity.qty = rowEntity.qty ? rowEntity.qty : 0;
                var parentval = parseFloat(rowEntity.qty);
                var newval = parseFloat(newValue);
                if (newval > parentval)
                  return true;
                else
                  return false;
              }
            };
          },
          function () {
            return 'Invalid mrpQty';
          }
        );
        //Date validation
        uiGridValidateService.setValidator('compareDate',
          function (argument) {
            return function (oldValue, newValue, rowEntity, colDef) {
              if (!newValue) {
                return true; // We should not test for existence here
              } else {
                if (argument) {
                  var currentDate = new Date();
                  newValue = new Date(newValue);
                  argument.poDate = new Date(argument.poDate);
                  argument.materialDocDate = argument.materialDocDate ? new Date(argument.materialDocDate) : null;
                  //newValue = $filter('date')(newValue, _dateDisplayFormat);
                  //var currentDate = $filter('date')(new Date(), _dateDisplayFormat);
                  // argument.poDate = $filter('date')(argument.materialDocDate, _dateDisplayFormat);
                  //if (argument.materialDocDate) {
                  //    argument.materialDocDate = $filter('date')(argument.materialDocDate, _dateDisplayFormat);
                  //}
                  if ((newValue < currentDate) || (argument.poDate && newValue < argument.poDate)) {
                    return false;
                  }
                  if (argument.materialDocDate != null && (newValue < argument.materialDocDate)) {
                    return false;
                  } else {
                    return true;
                  }

                } else {
                  return true;
                }

              }
            };
          },
          function () {
            return 'Invalid date';
          }
        );
        //Quantity validation
        uiGridValidateService.setValidator('compareQty',
          function (argument) {
            return function (oldValue, newValue, rowEntity, colDef) {
              if (newValue != undefined) {
                argument.qty = argument.qty ? argument.qty : 0;
                var parentval = parseFloat(argument.qty);
                if (argument.SalesDetail.length == 1) {
                  var newval = parseFloat(newValue);
                  if (newval > parentval && newval == 0)
                    return false;
                  else
                    return true;
                }
                else {
                  var sum = _.sumBy(argument.SalesDetail, function (item) { return parseFloat(item.qty); });
                  if (sum == parentval && newValue != 0) {
                    return true;
                  }
                  else {
                    return false;
                  }
                }
              }
            };
          },
          function () {
            return 'Invalid quantity';
          }
        );

        $scope.gridOption.isRowSelectable = function (row) {
          if ($scope.gridOption.CurrentPage) {
            _.each(CORE.PAGENAME_CONSTANT, (item) => {
              if ($scope.gridOption.CurrentPage == item.PageName) {
                if (row.entity.systemGenerated == true) {
                  row.entity.isDisabledDelete = _.isBoolean(item.isDisabledDelete) ? item.isDisabledDelete : row.entity.isDisabledDelete;
                  // Bug 41376: Payment Type Category and Bank account code should be there while update record
                  if ($scope.gridOption.genericCategoryTypeID === CORE.CategoryType.PayablePaymentMethods.ID ||
                    $scope.gridOption.genericCategoryTypeID === CORE.CategoryType.ReceivablePaymentMethods.ID) {
                    row.entity.isDisabledUpdate = false;
                  } else {
                    row.entity.isDisabledUpdate = _.isBoolean(item.isDisabledUpdate) ? item.isDisabledUpdate : row.entity.isDisabledUpdate;
                  }
                  row.entity.isRowSelectable = false;
                  return false;
                }
                //else if (row.entity.woentrytype && row.entity.woentrytype != CORE.WorkorderEntryType.Manual) {
                //    row.entity.isDisabledDelete = item.isDisabledDelete;
                //    row.entity.isDisabledUpdate = item.isDisabledUpdate;
                //    row.entity.isRowSelectable = false;
                //    return false;
                //}
                else if ($scope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT[14].PageName || $scope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT[6].PageName || $scope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT[44].PageName) {
                  row.entity.isRowSelectable = !row.entity.isDisabledDelete;
                  return false;
                }
                //else {
                //    row.entity.isDisabledUpdate = row.entity.isDisabledUpdate;
                //    row.entity.isDisabledDelete = row.entity.isDisabledDelete;
                //}
              }
            })
          }
          if (row.entity.isRowSelectable === false)
            return false;
          /*
          if ($rootScope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT.GenericCategory.PageName) {
              if (row.entity.systemGenerated == true) {
                  row.entity.isDisabledDelete = row.entity.isDisabledUpdate = true;
                  return false;
              }
              else {
                  row.entity.isDisabledDelete = row.entity.isDisabledUpdate = false;
              }
          } else if ($rootScope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT.RoleList.PageName) {
              if (row.entity.systemGenerated == true) {
                  row.entity.isDisabledDelete = true;
                  return false;
              }
              else {
                  row.entity.isDisabledDelete = row.entity.isDisabledUpdate = false;
              }
          }
          else if ($rootScope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT.WorkorderTransManualEntryList.PageName) {
              if (row.entity.woentrytype !== CORE.WorkorderEntryType.Manual) {
                  row.entity.isDisabledDelete = row.entity.isDisabledUpdate = true;
                  return false;
              }
              else {
                  row.entity.isDisabledDelete = row.entity.isDisabledUpdate = false;
              }
          }
          else if ($rootScope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT.EntityList.PageName) {
              if (row.entity.systemGenerated == true) {
                  row.entity.isDisabledDelete = row.entity.isDisabledUpdate = true;
                  return false;
              }
              else {
                  row.entity.isDisabledDelete = row.entity.isDisabledDelete = false;
              }
          }
          else if ($rootScope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT.RfqPartCategory.PageName) {
              if (row.entity.systemGenerated == true) {
                  row.entity.isDisabledDelete = row.entity.isDisabledUpdate = true;
                  return false;
              }
              else {
                  row.entity.isDisabledDelete = row.entity.isDisabledDelete = false;
              }
          }
          ////else if ($rootScope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT.GenericCategory.PageName ||
          ////                $rootScope.gridOption.CurrentPage === CORE.PAGENAME_CONSTANT.RoleList.PageName) {
          ////    row.entity.isDisabledDelete = row.entity.isDisabledDelete = true;
          ////}
          */
        };
        function activateUiGridExtension() {
          $rootScope.pageName = $scope.pagingInfo.pageName;
          $rootScope.isPrint = $scope.pagingInfo.isPrint;
          if ($scope.loadData)
            $scope.loadData($scope.pagingInfo);
        }

        //$scope.DateFormates = CORE.DateFormatArray;
        //$scope.DateFormate = $scope.DateFormates[10];

        //Reset grid data
        function resetGrid() {
          if ($scope.header && $scope.header.length > 0) {
            if ($scope.isResetHeader) {
              angular.forEach($scope.header, function (data) {
                if (!data.width) {
                  data.width = 150;
                }
              });
            }

            // need to check why added this code for delete hashkey
            angular.forEach($scope.gridData, function (rowData, rowIndex) {
              var index = 0;
              delete rowData["$$hashKey"];
              $scope.gridData[rowIndex] = rowData;
            });
            if (($scope.$parent && (!$scope.$parent.vm.isHideDelete && !$scope.$parent.vm.isSalesDelete)) || $scope.gridOption.isShowDelete) {
              // Added to global add custom delete option in grid - Vaibhav Shah
              // get old object for set old properties
              let oldDeleteColumnObj = _.find($scope.header, { 'field': 'CustomDeleteAtRight' });
              // Remove old object from header while refresh grid
              _.remove($scope.header, {
                field: "CustomDeleteAtRight"
              });
              // Add in header array new column for delete
              // Note: ng-click contains delete function which is applies to controller directly
              var customeDeleteButton = {
                field: "CustomDeleteAtRight",
                displayName: "Delete",
                cellTemplate: "<span class=\"margin-auto pt-2\"><md-button ng-disabled=\"row.entity.isDisabledDelete\" \
                                                    class=\"md-primary grid-button md-icon-button bdrbtn\" \
                                                    ng-class=\"{'item-disabled': row.entity.isDisabledDelete, 'cm-feture-btn-color':grid.appScope.$parent.vm.isDeleteFeatureBased || grid.appScope.gridOption.isDeleteFeatureBased}\" \
                                                    ng-click=\"row.entity.isDisabledDelete || grid.appScope.checkRoleAccessiblity(row.entity)\">    \
                                                <md-icon role=\"img\" md-font-icon=\"icon-trash\"></md-icon>\
                                                <md-tooltip>Delete</md-tooltip>\
                                            </md-button>\
                                            <md-tooltip ng-if=\"grid.appScope.$parent.vm.isDeleteFeatureBased && !grid.appScope.$parent.vm.isDeleteFeatureEnable\">{{grid.appScope.$parent.vm.LabelConstant.SHOW_USER_STATUS.FeatureEnableText}}</md-tooltip></span>",
                enableFiltering: false,
                enableSorting: false,
                exporterSuppressExport: true,
                enableCellEdit: false,
                width: 75,
                visible: oldDeleteColumnObj ? oldDeleteColumnObj.visible : true,
                isColHeader: true
              };
              $scope.header.push(customeDeleteButton);
            }
            copyOfHeader = angular.copy($scope.header);
            $scope.gridOption.columnDefs = $scope.header; // define column list in ui grid

            //[S] Dharam: [01/06/2019] Get header column sequence from db
            getUIGridColumnDetail();
            //[E] Dharam: [01/06/2019] Get header column sequence from db
          }
        }
        let resetGridDataEvent = $scope.$on('resetGridData', resetGridData);
        function resetGridData() {
          //if ($scope.pagingInfo && $scope.gridApi.grid.gridMenuScope && ($scope.pagingInfo.SortColumns || $scope.pagingInfo.SearchColumns)) {
          //if ($scope.pagingInfo.SortColumns.length > 0 || $scope.pagingInfo.SearchColumns.length > 0 || $scope.pagingInfo.Searchtext) {
          $scope.isResetGridCalled = true;
          $scope.pagingInfo.SortColumns = [];
          $scope.pagingInfo.SearchColumns = [];
          $scope.pagingInfo.Searchtext = '';
          $scope.pagingInfo.Page = $scope.pagingInfo.Page === 0 ? 0 : 1;
          $scope.gridOption.paginationCurrentPage = 1;
          $scope.gridApi.grid.clearAllFilters();// newly added
          angular.forEach($scope.gridApi.grid.columns, function (columnobj) {
            columnobj.sort = {};
          });
          $scope.pagingInfo.isReset = true;
          $scope.loadData($scope.pagingInfo);
          //}
          //}
        }
        let deleteEvent = $scope.$on('deleteMultipleGridRows', deleteMultipleGridRows);
        function deleteMultipleGridRows() {
          $scope.deleteMultipleData();
        }
        let cloudUpdateEvent = $scope.$on('cloudUpdateMultipleGridRows', cloudUpdateMultipleGridRows);
        function cloudUpdateMultipleGridRows() {
          if ($scope.cloudUpdateMultipleData) {
            $scope.cloudUpdateMultipleData();
          }
        }
        let verifyLabelTemplateEvent = $scope.$on('verifyLabelTemplateMultipleGridRows', verifyLabelTemplateMultipleGridRows);
        function verifyLabelTemplateMultipleGridRows() {
          if ($scope.verifyLabelTemplateMultipleData) {
            $scope.verifyLabelTemplateMultipleData();
          }
        }
        $scope.checkRoleAccessiblity = (data) => {
          if ($scope.gridOption.checkDeleteRoleWise) {
            ManufacturerFactory.getAcessLeval().query({ access: CORE.ROLE_ACCESS.DELETE_ROLE_ACCESS }).$promise.then((response) => {
              if (response && response.data) {
                let accessLevelDetail = {};
                accessLevelDetail.accessRole = response.data.name;
                accessLevelDetail.accessLevel = response.data.accessLevel;
                let currentUserRole = _.find(loginUser.roles, (data) => { return data.id == loginUser.defaultLoginRoleID });
                if (currentUserRole && currentUserRole.accessLevel <= accessLevelDetail.accessLevel) {
                  $scope.$parent.vm.deleteRecord(data);
                } else {
                  var model = {
                    title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                    textContent: stringFormat(CORE.MESSAGE_CONSTANT.RESTRICT_TO_DELETE, currentUserRole.name),
                    multiple: true
                  };
                  DialogFactory.alertDialog(model);
                  return;
                }
              }
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          } else {
            $scope.$parent.vm.deleteRecord(data);
          }
        }
        $scope.$on("$destroy", function (event) {
          if (angular.isDefined($scope.filterTimeout)) {
            $timeout.cancel($scope.filterTimeout);
          }
        });
        // clean up listener when directive's scope is destroyed
        $scope.$on("$destroy", deleteEvent);
        $scope.$on("$destroy", cloudUpdateEvent);
        $scope.$on("$destroy", resetGridDataEvent);
        $scope.$on("$destroy", verifyLabelTemplateEvent);

        //[S] Dharam: [01/06/2019] Manage header column sequence from db
        function getUIGridColumnDetail() {
          if ($scope.gridId) {
            MasterFactory.getUIGridColumnDetail({ gridId: $scope.gridId }).query().$promise.then((response) => {
              var updateColumn = false, noOfColumn = $scope.header.length, isExistsInDB = (response.data ? response.data.columnDefList : []).length > 0 ? true : false;
              _.each($scope.header, (item, index) => {
                item.colInitIndex = (index + 1);
                var colDet = _.find((response.data ? response.data.columnDefList : []), { field: item.field });
                if (colDet) {
                  item.displayOrder = colDet.displayOrder;
                  item.pinnedLeft = colDet.pinnedLeft;
                  item.pinnedRight = colDet.pinnedRight;
                  /*Set column visibility only if column's visibility is not managed conditionally from page*/
                  if (!item.isConditionallyVisibleColumn) {
                    item.visible = colDet.visible;
                  }
                }
                else {
                  updateColumn = true;
                  item.displayOrder = isExistsInDB ? noOfColumn : (index + 1);
                }
              });

              $scope.gridOption.columnDefs = _.sortBy($scope.header, ['displayOrder', 'colInitIndex']);
              if (updateColumn) {
                var columnDefList = _.map($scope.gridOption.columnDefs, (item, index) => {
                  return {
                    field: item.field,
                    displayOrder: (index + 1),
                    pinnedLeft: item.pinnedLeft,
                    pinnedRight: item.pinnedRight,
                    visible: item.visible
                  };
                });
                saveColumnSequence(columnDefList);
              }
              $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
              // [S] Shubham - [01/30/2020] - After Get data of Column fill Data & Header into UI-Grid
              fillHeaderAndGridData();
            }).catch((error) => {
              //return BaseService.getErrorLog(error);
              // [S] Shubham - [01/30/2020] - After Get data of Column fill Data & Header into UI-Grid
              fillHeaderAndGridData();
            });
          }
          else {
            // [S] Shubham - [01/30/2020] - On not define UI-grid ID and fill data
            fillHeaderAndGridData();
          }
        }

        // [S] Shubham: [01/30/2020] Manage Fill Header & Data into UI-grid Option
        function fillHeaderAndGridData() {
          $scope.gridOption.data = $scope.gridData; // set data in ui grid
          $scope.gridOption.totalItems = $scope.totalDataCount; // set total item in pagination
          $scope.gridOption.currentItem = $scope.currentItem;


          //remove blank option from dropdown in ui-grid header filter
          angular.element('.ui-grid-header-cell div select option:first-child[value="?"]').remove();

        }
        function saveColumnSequence(columnDefList) {
          if ($scope.gridId) {
            MasterFactory.saveUIGridColumnDetail().query({ gridId: $scope.gridId, columnDefList: columnDefList }).$promise.then((response) => {
            }).catch((error) => {
              //return BaseService.getErrorLog(error);
            });
          }
        }

        let resetColumnSequenceEvent = $scope.$on('resetColumnSequence', resetColumnSequence);
        function resetColumnSequence() {
          // [S - SHUBHAM - 08/08/2020] - Clear order cache for reset column
          var columnDefsColMov = $scope.gridApi.grid.moveColumns.orderCache;
          columnDefsColMov.length = 0;
          // [E - SHUBHAM - 08/08/2020] - Clear order cache for reset column

          $scope.gridOption.columnDefs = angular.copy(copyOfHeader);

          _.each($scope.gridOption.columnDefs, (item, index) => {
            item.colInitIndex = (index + 1);
            item.displayOrder = (index + 1);
          });

          var columnDefList = _.sortBy(_.map($scope.gridOption.columnDefs, (item, index) => {
            return {
              field: item.field,
              displayOrder: item.displayOrder,
              colInitIndex: item.colInitIndex,
              pinnedLeft: item.pinnedLeft,
              pinnedRight: item.pinnedRight,
              visible: item.visible
            }
          }), ['displayOrder', 'colInitIndex']);

          saveColumnSequence(columnDefList);
          $rootScope.$emit(CORE.GRID_COL_PINNED_AND_VISIBLE_CHANGE);
        }
        $scope.$on("$destroy", resetColumnSequenceEvent);
        //[E] Dharam: [01/06/2019] Manage header column sequence from db
      }]
    return directive;
  }]);
