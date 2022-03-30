(function () {
    'use strict';

    angular
       .module('app.admin.dynamicmessage')
       .controller('viewDynamicMessageHistoryPopUpController', viewDynamicMessageHistoryPopUpController);
    
    

    /** @ngInject */
    function viewDynamicMessageHistoryPopUpController(USER, CORE, BaseService, DynamicMessageFactory, data, $mdDialog, $timeout)
    {
        
        const vm = this;
        vm.emptyMessage = CORE.EMPTYSTATE.MESSAGE_HISTORY;
        vm.historyData = [];
        let initPageInfo = () => {
            vm.pagingInfo = {
                Page: CORE.UIGrid.Page(),
                SortColumns: [['versionNumber', 'desc']],
                SearchColumns: []
            };
        }

        vm.LabelConstant = angular.copy(CORE.LabelConstant);
        vm.totalDataCount = 0;
        vm.currentdata = 0;
        initPageInfo();
        
        vm.isHideDelete = true;  //to hide global delete column of UI-grid
        vm.isUpdatable = false;
        vm.isNoDataFound = false;        
        vm.messageData = angular.copy(data);      
        vm.headerData = [];// heading lable for popup-header-label 
        vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;

        vm.headerData.push({
            label: vm.LabelConstant.DYNAMIC_MESSAGE.MessageCode,
            value: vm.messageData.messageCode,
            displayOrder: (vm.headerData.length + 1)
        });
        vm.headerData.push({
            label: vm.LabelConstant.DYNAMIC_MESSAGE.MessageType,
            value: vm.messageData.messageType,
            displayOrder: (vm.headerData.length + 1)
        });
        vm.headerData.push({
            label: vm.LabelConstant.DYNAMIC_MESSAGE.Category,
            value: vm.messageData.category,
            displayOrder: (vm.headerData.length + 1)
        });

        vm.gridOptions = {
            showColumnFooter: false,
            enableCellEditOnFocus: true,
            enableRowHeaderSelection: false,
            enableFullRowSelection: false,
            enableRowSelection: false,
            multiSelect: false,
            filterOptions: vm.pagingInfo.SearchColumns,
            exporterMenuCsv: true,
            exporterCsvFilename: 'dynamicmessageHistory.csv',
        };

        

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
                field: 'message',
                width: '1000',
                displayName: 'Message',
                cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}}</div>',
                enableFiltering: false,
                enableSorting: false
            },
            {
                field: 'modifiedByName',
                width:  CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,// 'Modified By',
                cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}}</div>',
                enableFiltering: false,
                enableSorting: false
            },
            {
                field: 'modifiedDate',
                width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
                displayName:  vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,//'Modified Date',                
                cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD |date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',                
                type: 'datetime',
                enableFiltering: false,
                enableSorting: false
            },                      
            
        ];
              

        vm.loadDynamicMessagesHistory = () => {            
            if (vm.messageData && vm.messageData._id) {
                vm.cgBusyLoading = DynamicMessageFactory.getMessageHistoryByKey().query({ ObjId: vm.messageData._id }).$promise.then((result) => {                  
                    if (result && result.data && result.data.dynamicMessageHistory) {                        
                        vm.historyData = result.data.dynamicMessageHistory.map(item => item.previousVersion);     //vm.historyData = result.data.dynamicMessageHistory[0].previousVersion;
                        vm.totalDataCount = result.data.dynamicMessageCount;
                        vm.currentdata = result.data.dynamicMessageHistory.length;
                        
                        angular.forEach(vm.historyData, function (value, key) {
                            if (!value.modifiedDate) {
                                value.modifiedDate = value.createdDate;
                                value.modifiedBy = value.createdBy;
                                value.modifiedByName = value.createdByName;
                            }
                        });


                        if (result.data.dynamicMessageCount > 0) {
                            vm.isNoDataFound = false;
                        } else {
                            vm.isNoDataFound = true;
                        }
                        $timeout(() => { vm.resetSourceGrid(); });
                        
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
        } //end of loadDynamicMessagesHistory()

        vm.cancel = () => {
            BaseService.currentPagePopupForm = [];
            $mdDialog.cancel();            
        };

        

    }
})();
