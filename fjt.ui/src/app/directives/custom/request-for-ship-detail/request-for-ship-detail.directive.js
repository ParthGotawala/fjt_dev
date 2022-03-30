(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('requestForShipDetail', requestForShipDetail);

  /** @ngInject */

  function requestForShipDetail(CORE, USER, $state, $filter,BaseService, $q, DialogFactory, RequestForShipFactory, MasterFactory, $timeout, TRANSACTION, $rootScope) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        shippingRequestId: '=?',
      },
      templateUrl: 'app/directives/custom/request-for-ship-detail/request-for-ship-detail.html',
      controller: requestForShipDetailCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    function requestForShipDetailCtrl($scope, $element, $attrs ) {
      var vm = this;
      vm.id = null; //shipping request detail id for each detail row
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.placeHolderFormat = angular.copy(vm.DefaultDateFormat).toUpperCase();
      vm.LabelConstant = CORE.LabelConstant;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;      
      vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.REQUEST_FOR_SHIP;
      vm.isUpdatable = true;
      vm.selectedWOAssy = null;    
      vm.todayDate = new Date();
      vm.sourceData = [];
      vm.isPageDisabled = false;
      
      vm.shippingRequestID = $scope.shippingRequestId ? parseInt($scope.shippingRequestId) : null;      
      vm.requestForShipModel = {
        id: null,
        shippingRequestID: vm.shippingRequestID,
        qty: null,
        woID: null,       
        note: null,        
      };

      vm.isGridChanged = false;
      vm.saveDisable = false;
      //Get Request for Shipping Detail
      function getReqForShipDetails() {
        if (vm.shippingRequestID) {
          return RequestForShipFactory.getShippingRequest(vm.pagingInfo).query({ id: vm.shippingRequestID }).$promise.then((response) => {
            if (response && response.data) {
              return response.data;
            }
          }).catch((error) => {
            BaseService.getErrorLog(error);
          });
        } else return;
      }

      //Get Assembly Lust with WO
      function getAssyDetailList() {
        vm.woAssyList = [];
        return MasterFactory.getWorkorderWithAssyDetails().query({}).$promise.then((response) => {
          var data = [];
          if (response && response.data) {            
            data = response.data;            
            data.forEach((x) => {
              vm.woAssyList.push({
                woID: x.woID,
                buildQty: x.buildQty,
                name: stringFormat("{0}, {1} {2}", (x.componentAssembly ? x.componentAssembly.nickName : null), (x.componentAssembly ? x.componentAssembly.PIDCode : null), x.woNumber)
              });
            });
            return vm.woAssyList;
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      }

      
      function init() {
        vm.cgBusyLoading = $q.all([getReqForShipDetails(), getAssyDetailList()]).then((responses) => {
          if (vm.shippingRequestID) {
            var getReqForShipDetailsResp = responses[0];
            if (getReqForShipDetailsResp) {
              vm.shippingRequestModel = getReqForShipDetailsResp;
            }
          }             
          initAutoCompleteAssy();
          setFocusByName("note");
          if ($scope.$parent.vm.requestForShipModel.status == 1)
            vm.isPageDisabled = true;
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      }

      init();

      //Set selected WO values on Label Box
      function getReadyForShipQtyByWOID(item) {
        let assyDetail;
        vm.cgBusyLoading = RequestForShipFactory.getShippingQtyAndAssyDetailByWOID().query({ woID: item.woID }).$promise.then((response) => {
          if (response && response.data && response.data.length > 0) {
            
            assyDetail = response.data[0][0];            
            vm.selectedWOAssy.shippedQty = response.data[1][0].shippedQty ? response.data[1][0].shippedQty : 0;
            vm.selectedWOAssy.requestedQty = response.data[1][0].requestedQty ? response.data[1][0].requestedQty : 0;            
            //get Assembly detail            
            vm.selectedWOAssy.woID = assyDetail.woID;
            vm.selectedWOAssy.woNumber = assyDetail.woNumber;
            vm.selectedWOAssy.customerID = assyDetail.customerID;
            vm.selectedWOAssy.mfgName = assyDetail.mfgName;
            vm.selectedWOAssy.mfgPNDescription = assyDetail.mfgPNDescription;
            vm.selectedWOAssy.mfgPN = assyDetail.mfgPN;
            vm.selectedWOAssy.PIDCode = assyDetail.PIDCode;
            vm.selectedWOAssy.partID = assyDetail.partID;
            vm.selectedWOAssy.nickName = assyDetail.nickName;
            vm.selectedWOAssy.rev = assyDetail.rev;
            vm.selectedWOAssy.rohsStatus = assyDetail.RoHSStatusID;
            vm.selectedWOAssy.rohsName = assyDetail.rohsName;
            vm.selectedWOAssy.rohsIcon = assyDetail.rohsIcon;            
            vm.selectedWOAssy.poNumber = assyDetail.poNumber;
            vm.selectedWOAssy.soPOQty  = assyDetail.soPOQty;
          }
          
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      }


      //Initiate Autocomplete for assembly list
      let initAutoCompleteAssy = () => {
        vm.autoCompleteAssy = {
          columnName: 'name',
          controllerName: null,
          viewTemplateURL: null,
          keyColumnName: 'woID',
          keyColumnId: null,
          inputName: 'Assy',
          placeholderName: vm.LabelConstant.Assembly.ID,
          isRequired: false, //true
          isDisabled: false,
          isAddnew: false,
          callbackFn: getAssyDetailList,
          onSelectCallbackFn: function (selectedItem) {
            if (!selectedItem) {
              vm.selectedWOAssy = null;
            }
            else {              
              if(!vm.selectedWOAssy)
                vm.selectedWOAssy = selectedItem;      
              getReadyForShipQtyByWOID(selectedItem);              
            }
          }
        }
      };

      // [S] UI GRID      
      vm.sourceHeader = [
        {
          field: 'Action',
          cellClass: 'gridCellColor',
          displayName: 'Action',
          width: '120',
          cellTemplate: `<grid-action-view grid="grid" row="row"></grid-action-view>`,
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: true
        }, {
          field: '#',
          width: '70',
          cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
          enableFiltering: false,
          enableSorting: false,
        }, {
          field: 'qty',
          displayName: 'Shipping Qty',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: 180,
        }, {
          field: 'mfgName',
          displayName: 'Customer',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: 280,
        }, {
          field: 'PIDCode',
          displayName: vm.LabelConstant.Assembly.ID,          
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                component-id="row.entity.partMasterID" \
                                label="grid.appScope.$parent.vm.LabelConstant.Assembly.ID" \
                                value="row.entity.PIDCode" \
                                is-copy="true" \
                                is-mfg="true" \
                                mfg-label="grid.appScope.$parent.vm.LabelConstant.Assembly.MFGPN" \
                                mfg-value="row.entity.mfgPN" \
                                rohs-icon="row.entity.rohsIcon" \
                                rohs-status="row.entity.rohsName" \
                                is-copy-ahead-label="true"\
                                is-assembly="true"></common-pid-code-label-link></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.PID,
        },
        {
          field: 'nickName',
          displayName: vm.LabelConstant.Assembly.NickName,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.ASSY_NICKNAME
        },
        {
          field: 'mfgPNDescription',
          displayName: vm.LabelConstant.Assembly.Description,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '500',
        }, {
          field: 'woNumber',
          displayName: 'WO#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: 100
        }, {
          field: 'poNumber',
          displayName: 'PO#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: 150
        }, {
          field: 'soPOQty',
          displayName: 'PO Qty',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: 100
        }, {
          field: 'buildQty',
          displayName: 'Build Qty',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: 120
        }, {
          field: 'note',
          displayName: 'Note',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: 300
        },
        {
          field: 'updatedAt',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false
        },
        {
          field: 'updatedby',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true,
        },
        {
          field: 'updatedbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true,
        },
        {
          field: 'createdAt',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false
        }
      ];
      
      //Initial Search with RequestedShipId 
      var searchColumn = {
        ColumnDataType: 'Number',
        ColumnName: 'shippingRequestID',
        SearchString: vm.shippingRequestID
      }

      let initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['nickName', 'ASC']],
          SearchColumns: []
        };
      }

      initPageInfo();

      vm.gridOptions = {
        showColumnFooter: false,
        enableRowHeaderSelection: true,
        enableFullRowSelection: false,
        enableRowSelection: true,
        multiSelect: true,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Request For Shipment Details.csv',
        //isDisabledUpdate : true
      }; 
      

      //retrive shiping detail
      let shippingDetail = () => {
        if (vm.shippingRequestID) {
          vm.pagingInfo.SearchColumns.push(searchColumn);
          vm.cgBusyLoading = RequestForShipFactory.getShippingRequestDet(vm.pagingInfo).query().$promise.then((response) => {
            if (response.status == CORE.ApiResponseTypeStatus.SUCCESS) {
              if (vm.frmRequestForShip && vm.frmRequestForShip.$dirty) {
                vm.frmRequestForShip.$dirty = false;
                vm.isGridChanged = false;
                $scope.$parent.vm.isDetailGridChanged = vm.isGridChanged;                
              }
              vm.shippingDetail = response.data.data;
              vm.IsEdit = true;
              grid();
              vm.loadData(vm.pagingInfo);
            }
          });
        }
      }
      shippingDetail();


      /* retrieve Request For Shipping Detail list*/
      function grid() {
        if (!vm.IsEdit) {
          vm.gridOptions.data = vm.sourceData;
        }
        else if (vm.IsEdit && vm.shippingDetail && vm.shippingDetail.length > 0) {
          vm.sourceData = _.clone(vm.shippingDetail);         
        }
        
        
        vm.loadData = (pagingInfo) => {
          if (pagingInfo.SortColumns.length > 0) {
            var column = [];
            var sortBy = [];
            _.each(pagingInfo.SortColumns, function (item) {
              column.push(item[0]);
              sortBy.push(item[1]);
            });
            vm.sourceData = _.orderBy(vm.sourceData, column, sortBy);
          }
          if (pagingInfo.SearchColumns.length > 0) {
            _.each(pagingInfo.SearchColumns, function (item) {
              vm.sourceData = $filter('filter')(vm.sourceData, { [item.ColumnName]: item.SearchString });
            });
            if (vm.sourceData.length == 0)
              vm.emptyState = 0;
          }
          else {
            vm.emptyState = null;
          }
                    
          if (vm.isPageDisabled) {
            vm.gridOptions.enableRowSelection = false;
            vm.gridOptions.enableRowHeaderSelection = false;
            vm.gridOptions.multiSelect = false;
          } else {
            vm.gridOptions.enableRowSelection = true;
            vm.gridOptions.enableRowHeaderSelection = true;           
            vm.gridOptions.multiSelect = true;
          }
          
          _.each(vm.sourceData, (item) => {
            if (!item.rohsIcon.toString().startsWith(vm.rohsImagePath)) {
              item.rohsIcon = vm.rohsImagePath + item.rohsIcon;
            }
            item.isDisabledUpdate = vm.isPageDisabled;
            item.isDisabledDelete = vm.isPageDisabled;
          });



          vm.totalSourceDataCount = vm.sourceData.length;
          vm.currentdata = vm.totalSourceDataCount;          
          $timeout(() => {
            vm.resetSourceGrid();
            $timeout(() => {              
              if (vm.gridOptions && vm.gridOptions.gridApi) {
                return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            }, _configTimeout)
          }, true);
        }
      }

      //Add new detail line in grid on client save
      vm.saveDetailRow = (obj) => {
        var objIndex = -1;
        var reqDtl = {};
        var isDuplicate = false;        
        if (vm.frmRequestForShipDtl.$valid && obj.woID && obj.PIDCode) {
          //check  assyid & woid combination
          vm.saveDisable = true;
          if (vm.sourceData) {
            _.each(vm.sourceData, (item) => {
              if (item.woID == obj.woID && item.PIDCode == obj.PIDCode && !obj.id) {                
                isDuplicate = true;
              }
            });
          }
          
          if (isDuplicate) {
            let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SHIPPING_REQUEST_WORKORDER_EXISTS);
            let model = {
              messageContent: messageContent,
              multiple: true
            }
            DialogFactory.messageAlertDialog(model).then(() => {
              setFocusByName("shippingQty");
              vm.saveDisable = false;
            });            
          } else {
            vm.isGridChanged = true;
            $scope.$parent.vm.isDetailGridChanged = vm.isGridChanged;
            if (!obj.id) {
              //new add option
              reqDtl = {
                PIDCode: obj.PIDCode,
                buildQty: obj.buildQty,
                customerID: obj.customerID,
                id: null,
                mfgName: obj.mfgName,
                mfgPN: obj.mfgPN,
                mfgPNDescription: obj.mfgPNDescription,
                nickName: obj.nickName,
                note: obj.note,
                qty: obj.qty,
                rohsIcon : obj.rohsIcon,
                rohsName: obj.rohsName,
                shippingRequestID: vm.shippingRequestID,
                woID: obj.woID,
                woNumber: obj.woNumber,
                soPOQty: obj.soPOQty,
                poNumber: obj.poNumber,
              }
              vm.sourceData.push(reqDtl);
              objIndex = _.indexOf(vm.sourceData, reqDtl);              
              vm.IsEdit = false;
              grid();
              vm.loadData(vm.pagingInfo);
              vm.saveDisable = false;
              if (vm.gridOptions.gridApi && vm.gridOptions.gridApi.expandable) {
                vm.gridOptions.gridApi.expandable.collapseAllRows();
                vm.gridOptions.gridApi.expandable.expandRow(vm.sourceData[objIndex]);
              }
            }
            else {
              vm.cgBusyLoading = RequestForShipFactory.getShippingRequestDet(vm.pagingInfo).query().$promise.then((data) => {
                
                var objReqShip = _.find(vm.sourceData, (dtl) => { return dtl.id == obj.id });
                
                if (objReqShip) {
                  
                  var index = _.indexOf(vm.sourceData, objReqShip);
                  objReqShip = obj;                  
                  if (!objReqShip.rohsIcon.toString().startsWith(vm.rohsImagePath)) {
                    objReqShip.rohsIcon = vm.rohsImagePath + objReqShip.rohsIcon;
                  }
                  vm.sourceData.splice(index, 1);
                  vm.sourceData.splice(index, 0, objReqShip);
                  objIndex = _.indexOf(vm.sourceData, objReqShip);
                }               
                vm.totalSourceDataCount = vm.sourceData.length;
                vm.currentdata = vm.totalSourceDataCount;
                if (vm.gridOptions.gridApi && vm.gridOptions.gridApi.expandable) {
                  vm.gridOptions.gridApi.expandable.collapseAllRows();
                  vm.gridOptions.gridApi.expandable.expandRow(vm.sourceData[objIndex]);
                }
                vm.saveDisable = false;
              }).catch((error) => {
                return BaseService.getErrorLog(error);
              });
            }
          }
          clearShippingModel();
        } else {
          BaseService.focusRequiredField(vm.frmRequestForShipDtl);          
          vm.saveDisable = false;          
        }//incase form is invalid
        
      }
      
      //update detail record
      vm.updateRecord = (row, ev) => {
            var entity = row.entity;            
            vm.selectedWOAssy = angular.copy(entity);        
            vm.autoCompleteAssy.keyColumnId = entity.woID;
            vm.IsEdit = true;
            vm.autoCompleteAssy.isDisabled = true;        
            vm.frmRequestForShipDtl.shippingQty.$$element.focus();        
        };


      //clear form 
      function clearFormErrors() {
        $timeout(function () {
          vm.frmRequestForShipDtl.shippingQty.$setPristine();
          vm.frmRequestForShipDtl.shippingQty.$setUntouched();
          vm.frmRequestForShipDtl.shippingQty.$error = {};

          vm.frmRequestForShipDtl["vm.autocompleteDetail"].$setPristine();
          vm.frmRequestForShipDtl["vm.autocompleteDetail"].$setUntouched();
          vm.frmRequestForShipDtl["vm.autocompleteDetail"].$error = {};

          vm.frmRequestForShipDtl["vm.autocompleteDetail"].$$controls[0].$setPristine();
          vm.frmRequestForShipDtl["vm.autocompleteDetail"].$$controls[0].$setUntouched();
          vm.frmRequestForShipDtl["vm.autocompleteDetail"].$$controls[0].$error = {};

          vm.frmRequestForShipDtl.$setPristine();
          vm.frmRequestForShipDtl.$setUntouched();
        })
      }

      //clear model
      function clearShippingModel() {
        vm.selectedWOAssy = null;
        vm.autoCompleteAssy.keyColumnId = null;
        vm.autoCompleteAssy.isDisabled = false;
      }

      vm.cancelRequestForShipDet = () => {
        clearShippingModel();
        clearFormErrors();
      }

      //save detail data
      vm.saveRequestForShipDetail = () => {
        var newStatus = $scope.$parent.vm.requestForShipModel.status;
        var oldStatus = vm.shippingRequestModel.status;
        
        if (newStatus != oldStatus) {
          vm.shippingRequestModel.status = newStatus;
        }
       
        if (!vm.sourceData || (vm.sourceData && vm.sourceData.length == 0)) {
          let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.FILL_DET_BEFORE_SAVE);
          messageContent.message = stringFormat(messageContent.message, vm.shippingRequestModel.note);
          let obj = {
            multiple: true,
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(obj).then((res) => {
            setFocusByName('note');
            $scope.$parent.vm.saveDisable = false;            
          });

          vm.frmRequestForShip.$valid = false;
        }
        if (vm.frmRequestForShip.$valid) {
          let dtlList = [];
          _.each(vm.sourceData, (item) => {
            dtlList.push({
              id: item.id,
              shippingRequestID: item.shippingRequestID,
              woID: item.woID,
              note: item.note,
              qty: item.qty              
            });
          });
          
          vm.cgBusyLoading = RequestForShipFactory.saveRequestForShip().save({ dtl: vm.shippingRequestModel, dtlList: dtlList }).$promise.then((response) => {
            if (response) {
              if (!vm.shippingRequestID) {
                vm.shippingRequestID = response.data.id;
              }
              if (newStatus == 1) {
                vm.isPageDisabled = true;
              }
              vm.frmRequestForShip.$setPristine();
              vm.frmRequestForShipDtl.$setPristine();
              $state.go(TRANSACTION.TRANSACTION_MANAGE_DETAIL_STATE, { id: vm.shippingRequestID }, { reload: true });

            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
      }
      //delete detail grid record
      vm.deleteRecord = (entity) => {
          let selectedIDs = [];
          if (entity) {
            selectedIDs.push(entity.id);
          } else {
            vm.selectedRows = vm.selectedRowsList;
            if (vm.selectedRows.length > 0) {
              selectedIDs = vm.selectedRows.map((item) => item.id);
            }
          }
          vm.isChanged = true;
          var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, "Request for Shipping details", selectedIDs.length);
          let objs = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          var obj =[];
          _.each(selectedIDs, (item) => {
            obj.push(_.find(vm.sourceData, function (x) { return x.id == item.id }))
          })
          
          DialogFactory.messageConfirmDialog(objs).then((yes) => {
            if (yes && obj) {
              vm.isGridChanged = true;
              $scope.$parent.vm.isDetailGridChanged = vm.isGridChanged;
              var _index ;              
              _.each(obj, (item) => {
                _index = vm.sourceData.indexOf(item)
                vm.sourceData.splice(_index, 1);
              });              
              vm.totalSourceDataCount = vm.sourceData.length;
              vm.currentdata = vm.totalSourceDataCount;
              $timeout(() => {
                vm.resetSourceGrid();
              }, _configTimeout);
            }
            }, (cancel) => { 
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
      };

      vm.deleteMultipleData = () => {
        vm.deleteRecord();
      }
      /* Used to check max length validation*/
      vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
        return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
      };
      /* to move at work order list page */
      vm.goToWorkorderList = () => {
        BaseService.goToWorkorderList();
        return false;
      };

      //redirect to customer master
      vm.goToCustomerList = () => {
        BaseService.goToCustomerList();
      }

      // go to assembly list
      vm.goToAssemblyList = () => {
          BaseService.goToPartList();
      };

      //redirect to manage customer page
      vm.goToManageCustomer = (customerID) => {
        BaseService.goToCustomer(customerID);
      }


      //catch save broad cast from  manage request
      $scope.$on("saveRequestForShipDetail", function (evt, data) {    
        vm.saveRequestForShipDetail(true);
      });
            

      angular.element(() => {
        $scope.$parent.vm.frmRequestForShip = vm.frmRequestForShip;
        $scope.$parent.vm.isDetailGridChanged = vm.isGridChanged;
        BaseService.currentPageForms.push(vm.frmRequestForShip);
      });
    }
  }
})();
