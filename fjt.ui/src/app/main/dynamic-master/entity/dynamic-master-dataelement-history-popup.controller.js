(function () {
  `use strict`;

  angular
    .module('app.customforms.entity')
    .controller('CustomFormsDataElementHistoryPopupController', CustomFormsDataElementHistoryPopupController);

  /** @ngInject */
  function CustomFormsDataElementHistoryPopupController(CORE, $timeout, $scope, BaseService, $state, data,
    CUSTOMFORMS,  DataElementTransactionValuesManualFactory, $mdDialog, DialogFactory) {

    
    const vm = this;
    vm.EmptyMesssage = CUSTOMFORMS.CUSTOMFORMS_EMPTYSTATE.HISTORY;
    vm.entityID = data && data.entityID ? data.entityID : null;
    vm.refTransID = data && data.refTransID ? data.refTransID : null;
    vm.entityName = data && data.entityName ? data.entityName : null;
    vm.isSubForm = data && data.isSubForm ? data.isSubForm : false;//to show sub form history     
    vm.sourceHeader = [];
    vm.DisplayStatusConst = CORE.DisplayStatus;
    vm.isNoDataFound = false;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.isHideDelete = true;  //to hide global delete column of UI-grid
    vm.isUpdatable = false;
    var setCellTemplateNewValue = ""; // set template after data loading
    var setCellTemplateOldValue = ""; // set template after data loading

    //get custom forms entity status by id
    vm.getEntityStatus = (statusID) => {
      return BaseService.getOpStatus(statusID);
    }

    if (!vm.entityID || !vm.refTransID) {      
        $state.go(CUSTOMFORMS.CUSTOMFORMS_ENTITY_STATE);
        return;
    }

    //init paging info for grid
    let initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        //precordPerPage: CORE.UIGrid.ItemsPerPage(),
        SortColumns: [],
        SearchColumns: [],
        entityID: vm.entityID,
        refTransID: vm.refTransID,
        isSubForm : vm.isSubForm 
      };
    }
    initPageInfo();

    //set grid options    
    vm.gridOptions = {
      showColumnFooter: false,
      enableCellEditOnFocus: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,      
      exporterMenuCsv: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterCsvFilename: 'Custom Form History.csv',
    };

    //Set cell template of grid for Old & New value after Data loading
    let setSourceHeader = () => {
      setCellTemplateNewValue = ""; // For New Value
      setCellTemplateOldValue = ""; // For Old Value
      setCellTemplateNewValue = "<div class=\"ui-grid-cell ui-grid-coluiGrid-005P\" ng-if=\"row.entity.controlTypeID == 16\">\
              <img ng-if=\"COL_FIELD\" ng-src=\"{{ COL_FIELD }}\" alt=\"Signature\">\
          </div> \
          <div ng-if=\"row.entity.controlTypeID == 3 || row.entity.controlTypeID == 4 \"> \
              <md-button  class=\"md-warn md-hue-1 underline  margin-0 !important\" ng-click=\"grid.appScope.$parent.vm.showDescription(row.entity,  COL_FIELD , $event)\"> View </md-button> \
          </div> \
          <div class=\"font-size-12\" ng-if=\"row.entity.controlTypeID == 12\" > \
            {{ COL_FIELD.split(\"|\")[2] }} \
          </div> \
          <div class=\"ui-grid-cell-contents text-left\" ng-if=\"row.entity.controlTypeID != 18  && row.entity.controlTypeID != 3 && row.entity.controlTypeID != 4 && row.entity.controlTypeID != 16  && row.entity.controlTypeID != 12\" > \
            {{ COL_FIELD }} \
          </div>    ";

      setCellTemplateOldValue = "<div class=\"ui-grid-cell ui-grid-coluiGrid-005P\" ng-if=\"row.entity.controlTypeID == 16\">\
              <img ng-if=\"COL_FIELD\" ng-src=\"{{ COL_FIELD }}\" alt=\"Signature\">\
          </div> \
          <div ng-if=\"row.entity.controlTypeID == 3 || row.entity.controlTypeID == 4 \"> \
              <md-button  class=\"md-warn md-hue-1 underline margin-0 !important\" ng-click=\"grid.appScope.$parent.vm.showDescription(row.entity,  COL_FIELD , $event)\"> View </md-button> \
          </div> \
          <div class=\"font-size-12\" ng-if=\"row.entity.controlTypeID == 12\" > \
            {{ COL_FIELD.split(\"|\")[2] }} \
          </div> \
          <div class=\"ui-grid-cell-contents text-left\" ng-if=\"row.entity.controlTypeID != 18  && row.entity.controlTypeID != 3 && row.entity.controlTypeID != 4 && row.entity.controlTypeID != 16 && row.entity.controlTypeID != 12\" > \
            {{ COL_FIELD }} \
          </div>";          
      //class=\"ui-grid-cell-contents text-left\"
      //source header for grid data
      vm.sourceHeader = [
        {
          field: '#',
          width: '60',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
          enableSorting: false,
          enableFiltering: false
        },
        {
          field: 'dataElementName',
          width: '150',
          displayName: 'Form Attribute',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true 
        },
        {
          field: 'oldValue',
          width: '200',
          displayName: 'Last Value',
          cellTemplate: setCellTemplateOldValue,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'newValue',
          width: '200',
          displayName: 'New Value',
          cellTemplate: setCellTemplateNewValue,
          enableFiltering: true,
          enableSorting: true,
          exporterSuppressExport: true
        },
        {
          field: 'updatedAt',
          width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,//'Modified Date',                
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD |date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
          type: 'datetime',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'updatedBy',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,// 'Modified By',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'updatedByRole',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,// 'Modified By Role',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true
        }
      ];

    }

    vm.loadData = () => {      
      
      vm.cgBusyLoading = DataElementTransactionValuesManualFactory.retrieveDataElement_TransValues_Manual_History(vm.pagingInfo).query().$promise.then((elements) => {
        
        if (elements && elements.data && elements.data.history) {
          vm.sourceData = elements.data.history;
          vm.totalSourceDataCount = elements.data ? elements.data.history.length : 0;
          
          if ((vm.pagingInfo.SearchColumns && vm.pagingInfo.SearchColumns.length == 0) && (vm.pagingInfo.SortColumns && vm.pagingInfo.SortColumns.length == 0) )
          {
            setSourceHeader();
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
                vm.emptyState = null;              
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
          });
         
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    /* Show Description*/
    vm.showDescription = function(row ,value, ev) {      
      let data = {
        title: 'Description',
        description: value,
        name: row.dataElementName
      }
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data).then(() => {
          if (!vm.gridOptions.enablePaging) {
            initPageInfo();
          }
          vm.loadData();
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    }
    //close pop up
    vm.cancel = () => {
      BaseService.currentPagePopupForm = [];
      $mdDialog.cancel();
    };

    //Do not add destroy event at pop up close . It will also  close sub form pop up
  } 

})();
