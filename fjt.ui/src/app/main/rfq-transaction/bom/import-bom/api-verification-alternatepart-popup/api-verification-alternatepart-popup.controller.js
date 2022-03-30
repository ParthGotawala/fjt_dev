(function () {
    'use strict';

    angular
        .module('app.rfqtransaction')
        .controller('APIVerificationAlternatePopupController', APIVerificationAlternatePopupController);

    /** @ngInject */
    function APIVerificationAlternatePopupController($mdDialog, $scope,$q, $timeout, CORE, data, BaseService, APIVerificationAlternatePopupFactory, DialogFactory, RFQTRANSACTION, $filter, BOMFactory) {

        const vm = this;
        vm.apiVerificationAlternatePartList = [];
        var rfqAssyID = data.rfqAssyID;
        var customerID;
        vm.ischange = false;
        vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.NOT_MAPPING_PART;
        //get list of alternate parts from pricing api BOMID wise
        let init = () => {
            return APIVerificationAlternatePopupFactory.getApiVerifiedAlternateParts().query({ rfqAssyID: rfqAssyID }).$promise.then((response) => {
                if (response && response.data) {
                    vm.sourceData = [];
                    vm.listPricing = _.filter(response.data, function (item) { return item.Type == "MFG" });
                    vm.apiVerificationAlternatePartList = _.groupBy(vm.listPricing, function (parts) { return parts.SearchPN; });
                    _.each(vm.apiVerificationAlternatePartList, function (item) {
                        var mfgCodeApi = _.find(data.parts, (parts) => { return parts.mfgPN == item[0].SearchPN });
                       
                        if (item.length > 1) {
                            if (!_.find(response.data, function (detailitem) { return detailitem.PN == item[0].SearchPN })) {
                                var isgoodPart = _.find(response.data, function (goodData) { return goodData.SearchPN == item[0].SearchPN && goodData.isGoodPart == true });
                                var obj = {
                                    isBadPN: isgoodPart ? true : false,
                                    SearchPN: item[0].SearchPN,
                                    AlternatePart: item,
                                    rfqAssyID: rfqAssyID,
                                    mfgCodeID:mfgCodeApi? null:0,
                                    IsRoHS: item[0].IsRoHS,
                                    mfgCode: (mfgCodeApi && mfgCodeApi.mfgCode) ? mfgCodeApi.mfgCode : RFQTRANSACTION.FLEXTRON
                                }
                                obj.PIDCode = stringFormat("{0}+{1}", obj.mfgCode, obj.SearchPN);
                                vm.sourceData.push(obj);
                            }
                        }
                        else {
                            if (!_.find(response.data, function (detailitem) { return detailitem.PN == item[0].SearchPN })) {
                                var isgoodPart = _.find(response.data, function (goodData) { return goodData.SearchPN == item[0].SearchPN && goodData.isGoodPart == true });
                                var obj = {
                                    isBadPN: isgoodPart ? true : false,
                                    SearchPN: item[0].SearchPN,
                                    AlternatePart: item,
                                    rfqAssyID: rfqAssyID,
                                    mfgCodeID: mfgCodeApi ? null : 0,
                                    IsRoHS: item[0].IsRoHS,
                                    mfgCode: (mfgCodeApi && mfgCodeApi.mfgCode) ? mfgCodeApi.mfgCode : RFQTRANSACTION.FLEXTRON
                                }
                                obj.PIDCode = stringFormat("{0}+{1}", obj.mfgCode, obj.SearchPN);
                                vm.sourceData.push(obj);
                            }
                        }
                    });
                    vm.isload = true;
                    grid();
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        function grid() {
            vm.pagingInfo = {
                Page: CORE.UIGrid.Page(),
                SortColumns: [['SearchPN', 'DESC']],
                SearchColumns: [],
                pageName: CORE.PAGENAME_CONSTANT[6].PageName
            };
            vm.gridOptions = {
                showColumnFooter: false,
                enableRowHeaderSelection: false,
                enableFullRowSelection: false,
                enableRowSelection: false,
                multiSelect: false,
                filterOptions: vm.pagingInfo.SearchColumns,
                enableCellEdit: false,
                enablePaging: false,
                enableExpandableRowHeader: true,
                expandableRowTemplate: RFQTRANSACTION.RFQTRANSACTION_EXPANDABLEJS,
                expandableRowHeight: 230,
                expandableRowScope: $scope,
                enableCellEditOnFocus: true,
                enableGridMenu: true
            };
            
            vm.search = false;
            vm.loadData = (pagingInfo) => {
                if (pagingInfo.SortColumns.length > 0) {
                    var column = [];
                    var sortBy = [];
                    _.each(pagingInfo.SortColumns, function (item) {
                        column.push(item[0]);
                        sortBy.push(item[1]);
                    });
                    vm.sourceData = _.orderBy(vm.sourceData, column, sortBy);
                    vm.sortData = _.clone(vm.sourceData); 
                }
                else {
                    vm.sourceData = vm.sortData;
                }
                if (pagingInfo.SearchColumns.length > 0) {
                    if (!vm.search) {
                        vm.sourceDataCopy = [];
                        vm.sourceDataCopy = _.clone(vm.sourceData);
                    }   
                    vm.search = true;
                    _.each(pagingInfo.SearchColumns, function (item) {
                        vm.sourceData = $filter('filter')(vm.sourceDataCopy, { [item.ColumnName]: item.SearchString });
                    });
                    if (vm.sourceData.length == 0)
                        vm.emptyState = 0;
                    else
                        vm.emptyState = null;
                }
                else {
                    vm.emptyState = null;
                    if (vm.search) {
                        vm.sourceData = vm.sourceDataCopy ? vm.sourceDataCopy : vm.sourceData;
                        vm.search = false;
                    }
                }
                vm.totalSourceDataCount = vm.sourceData.length;
                if (vm.totalSourceDataCount == 0 && !vm.search) {
                    vm.IsemptyState = true;
                }
                vm.currentdata = vm.totalSourceDataCount;
                $timeout(() => {
                    vm.resetSourceGrid();
                    $timeout(() => {
                        vm.expandableJS();
                    }, true)
                    return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
                });
            }
            vm.isgoodPart = true;
            vm.isHideDelete = true;
            vm.sourceHeader = [
                {
                    field: 'Action',
                    cellClass: 'layout-align-center-center',
                    displayName: 'Action',
                    width: '90',
                    cellTemplate: '<md-button ng-disabled="!row.entity.isNotDisable" class="md-primary grid-button md-icon-button bdrbtn" ng-class="[(!row.entity.isNotDisable)?\'cursor-not-allow\':\'\']"  ng-click="grid.appScope.$parent.vm.goodPart(row.entity, $event)">' +
                                          '<md-icon role="img" md-font-icon="icon-plus"></md-icon><md-tooltip md-direction="top">Add</md-tooltip>' +
                                          '</md-button>',
                    enableFiltering: false,
                    enableSorting: false,
                    enableCellEdit: false,
                    exporterSuppressExport: true,
                    enableColumnMenus: false,
                    enableRowSelection: false,
                    enableFullRowSelection: false,
                    multiSelect: false,
                    allowCellFocus: false,
                    maxWidth: '120',
                },
                  {
                      field: '#',
                      width: '100',
                      cellTemplate: '<div class="ui-grid-cell-contents" ng-disabled="row.Entity.isdisable"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
                      enableFiltering: false,
                      enableSorting: false,
                      enableCellEdit: false,
                      enableCellEditOnFocus: false,
                      allowCellFocus: false,
                      maxWidth: '120',
                  },
                  {
                      field: 'isBadPN',
                      displayName: 'Is BadPN',
                      cellTemplate: '<input type="checkbox" ng-disabled="row.entity.isBadPN" ng-model="row.entity.isBadPN" ng-click="$event.stopPropagation();">',
                      width: '110',
                      enableFiltering: false,
                      enableSorting: false,
                      enableCellEdit: false,
                      maxWidth: '120',
                      
                  },
                  {
                      field: 'mfgCode',
                      displayName: 'MFG Code',
                      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                      width: '300',
                      enableCellEdit: false,
                      allowCellFocus: false,
                      maxWidth: '500',
                      enableCellEditOnFocus: false,
                  },
                   {
                       field: 'SearchPN',
                       displayName: 'SearchPN',
                       cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                       width: '300',
                       enableCellEdit: false,
                       allowCellFocus: false,
                       maxWidth: '600',
                   },
            ];
        }
        //map manual good-bad part mapping 
        vm.goodPart = (row, ev) => {
            var data = row;
            DialogFactory.dialogService(
            RFQTRANSACTION.MANUAL_GOOD_BAD_PART_MAPPING_CONTROLLER,
            RFQTRANSACTION.MANUAL_GOOD_BAD_PART_MAPPING_VIEW,
            ev,
            data).then((respo) => {
            }, (item) =>{
                if (item) {
                    var obj = _.find(vm.sourceData, (parts) => {return parts.SearchPN == data.SearchPN && parts.rfqAssyID == data.rfqAssyID });
                    if (obj) {
                        var subObj = _.find(obj.AlternatePart, (parts) => { return parts.PN == item.PN });
                        if (!subObj) {
                            item.isGoodPart = true;
                            obj.isNotDisable = false;
                            if (vm.isexpand) {
                                vm.subGridgridOptions.data.push(item);
                            }
                            obj.AlternatePart.push(item);
                        }
                        else {
                            subObj.isGoodPart = true;
                            obj.isNotDisable = false;
                        }
                        var index = vm.sourceData.indexOf(obj);
                        vm.gridOptions.gridApi.expandable.expandRow(vm.sourceData[index]);
                        vm.ischange = true;
                    }
                }
            }, (err) => {
                return BaseService.getErrorLog(err);
            });
        }
        /*
         * Author :  Champak Chaudhary
         * Purpose : ui grid expandable
         */
        vm.expandableJS = () => {
            vm.gridOptions.gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                if (row.isExpanded) {
                    vm.isexpand = true;
                    var isExpand = _.find(row.entity.AlternatePart, (item) => { return item.isGoodPart == true });
                    if (isExpand) {
                        row.entity.isNotDisable = false;
                    }
                    else {
                        row.entity.isNotDisable = true;
                    }
                   
                    vm.subGridpagingInfo = {
                        Page: CORE.UIGrid.Page(),
                        SortColumns: [],
                        SearchColumns: []
                    };
                    vm.subGridgridOptions = {
                        showColumnFooter: false,
                        enableRowHeaderSelection: false,
                        enableFullRowSelection: false,
                        enableRowSelection: false,
                        multiSelect: false,
                        filterOptions: vm.subGridpagingInfo.SearchColumns,
                        enableCellEdit: true,
                        enablePaging: false,
                        enableExpandableRowHeader: false,
                        enableGridMenu: false,
                        enableCellEditOnFocus: true,
                        appScopeProvider: $scope,
                        enableCellSelection: false,
                        allowCellFocus: true
                    };

                    vm.subGridsourceHeader = [
                   {
                       field: '#',
                       width: '50',
                       cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
                       enableFiltering: false,
                       enableSorting: false,
                       enableCellEdit: false
                   },
                   {
                       field: 'isGoodPart',
                       displayName: 'Is GoodPN',
                       cellTemplate: '<input type="checkbox" ng-model="row.entity.isGoodPart" ng-change="grid.appScope.changeGoodPart(row,row.entity)">',
                       width: '120',
                       enableFiltering: false,
                       enableSorting: false,
                       enableCellEdit: false
                   },
                   {
                       field: 'mfgCode',
                       displayName: 'MFG Code',
                       cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                       width: '200',
                       enableCellEdit: false,
                       allowCellFocus: false,
                   },
                   {
                       field: 'PN',
                       displayName: 'ResultPN',
                       width: '220',
                       cellTemplate: '<div class=\"ui-grid-cell-contents text-left\">{{COL_FIELD}}</div>',
                       enableCellEdit: false,
                       allowCellFocus: false,
                   },
                   {
                       field: 'reason',
                       displayName: 'Reason',
                       cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                       width: '440',
                   }
                    ];
                    vm.subGridgridOptions.columnDefs = vm.subGridsourceHeader;
                    vm.subGridgridOptions.data = _.uniqBy(row.entity.AlternatePart, 'PN');
                    row.entity.subGridOptions = vm.subGridgridOptions;
                    vm.subGridgridOptions.onRegisterApi = function (gridApi) {
                        vm.gridApi = gridApi;
                    };
                }
                else {
                    row.entity.isNotDisable = false;
                    vm.isexpand = false;
                }
            });
        }
        vm.getDataDown = () => {
        };
        vm.cancel = () => {
            $mdDialog.cancel();
        };
        //save good -bad mapping part
        vm.saveGoodBadPartMapping = (ev) => {
            vm.isfalse = false;
            var goodPartList = [];
            var index = 0;
            var colindex;
            _.each(vm.sourceData, function (item) {
                var objAlternate = _.find(item.AlternatePart, function (parts) { return parts.isGoodPart == true });
                if (!item.isBadPN) {
                    if (objAlternate) {
                        vm.isfalse = true;
                        colindex = index;
                        vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[colindex], vm.sourceHeader[1]);
                        return false;
                    }
                }
                if (item.isBadPN && !objAlternate) {
                    vm.isfalse = true;
                    colindex = index;
                    vm.expandindex = index;
                    return false;
                }
                _.each(item.AlternatePart, function (data, index) {
                    _.each(item.AlternatePart, function (data) {
                        data.$$hashKey = null;
                    })
                });
                if (item.isBadPN) {
                    var obj = {
                        badPN: item.SearchPN,
                        rfqAssyID: item.rfqAssyID,
                        goodPNList: item.AlternatePart,
                        rohsComplient: item.IsRoHS,
                        PIDCode: item.PIDCode,
                        mfgcodeID: item.mfgCodeID,
                        customerID: customerID,
                        mfgCode: item.mfgCode
                    }
                    goodPartList.push(obj);
                }
                index = index + 1;
            });
            if (vm.isfalse) {
                var model = {
                    multiple: true,
                    title: RFQTRANSACTION.BOM.VALID_MAPPING
                };
                DialogFactory.alertDialog(model);
                vm.gridOptions.gridApi.expandable.expandRow(vm.sourceData[colindex]);
                return false;
            }
            else {
                if (goodPartList.length > 0) {
                    vm.cgBusyLoading = APIVerificationAlternatePopupFactory.saveGoodBadPartMapping().query({ goodBadPartOBj: goodPartList }).$promise.then((res) => {
                        if (res.data==1) {
                            var data = {
                                rfqAssyID: rfqAssyID
                            };
                            DialogFactory.dialogService(
                                     RFQTRANSACTION.API_VERIFICATION_ERROR_CONTROLLER,
                                     RFQTRANSACTION.API_VERIFICATION_ERROR_VIEW,
                                     ev,
                                     data).then(() => {
                                         // Empty
                                     }, (err) => {
                                         return BaseService.getErrorLog(err);
                                     });
                        }
                        else
                            $mdDialog.hide();
                    });
                }
                else {
                    var model = {
                        multiple: true,
                        title: RFQTRANSACTION.BOM.GOOD_BAD_PART_MAPPING_SELECT
                    };
                    DialogFactory.alertDialog(model);
                    return false;
                }
            }
        }
        vm.isDisableSave = () => {
            var obj = _.find(vm.sourceData, function (item) { return item.isBadPN == true });
            if (obj) {
                if ((_.find(obj.AlternatePart, function (data) { return data.isGoodPart == true })) && vm.ischange)
                    return false;
                else
                    return true;
            }
            else
                return true;
        }
        //get customer id from assy id
        let getAssyDetails = () => {
            return BOMFactory.getAssyDetails().query({ id: rfqAssyID }).$promise.then((response) => {
                if (response && response.data) {
                    var rfqAssy = response.data;
                    if (rfqAssy.rfqForms) {
                        customerID = rfqAssy.rfqForms.customerId;
                    }
                }
            })
        }
        var autocompletePromise = [init(), getAssyDetails()];
        vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
        });

        //set only one good bad  part mapping
        $scope.changeGoodPart = (list, row) =>{
            _.each(list.grid.parentRow.entity.subGridOptions.data, (item) => {
                if (item.PN == row.PN && item._id == row._id) {
                    item.isGoodPart = true;
                    list.grid.parentRow.entity.isNotDisable = false;
                    vm.ischange = true;
                }
                else {
                    item.isGoodPart = false;
                }
            });
        }
    }

})();