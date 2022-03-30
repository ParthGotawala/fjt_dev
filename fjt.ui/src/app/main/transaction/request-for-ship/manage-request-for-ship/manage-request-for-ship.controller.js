(function () {
    'use strict';

    angular
        .module('app.transaction.requestforship')
        .controller('ManageRequestForShipController', ManageRequestForShipController);

    /** @ngInject */
  function ManageRequestForShipController($mdDialog, $scope, $timeout, $state, $stateParams, USER, CORE, DialogFactory, TRANSACTION, BaseService, RequestForShipFactory) {
      
        const vm = this;
        vm.woAssyList = [];
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        
        vm.shippingRequestID = $stateParams.id;
        vm.employeeID = BaseService.loginUser.employee.id;
        vm.DefaultDateFormat = _dateDisplayFormat;
        vm.placeHolderFormat = angular.copy(vm.DefaultDateFormat).toUpperCase();
        vm.LabelConstant = CORE.LabelConstant;
        vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
        vm.requestForShipModel = {
            id: null,
            shippingRequestID: vm.shippingRequestID,
            status: 0
        };
        vm.requestShippingTabs = TRANSACTION.RequestShippingTabs;
        vm.todayDate = new Date();
        vm.requestStatus = _.filter(CORE.WoStatus, function (item) { return item.ID == 0 || item.ID == 1 });
        vm.tabName = $stateParams.selectedTab;
        vm.shippingRequestModel = "";
        vm.isPageDisabled = false;
        //In case of Add , Set tab to detail only
        if (vm.tabName) {
          if (!vm.shippingRequestID) {
            if (TRANSACTION.RequestShippingTabs.Detail.Name != vm.tabName) {              
              $state.go(TRANSACTION.TRANSACTION_MANAGE_DETAIL_STATE, { id: vm.shippingRequestID });                
            }
          } else {
            var tab = _.find(TRANSACTION.RequestShippingTabs, (item) => {
              return item.Name == vm.tabName;
            })
            if (tab) {
              vm.selectedTabIndex = tab.ID;
            }            
          }
        }
        vm.pageTabRights =
        {
          DetailTab: false,
          ApprovalTab: false,
        };

        //get Request status
        if (vm.shippingRequestID) {
          vm.cgBusyLoading = RequestForShipFactory.getShippingRequestStatus({ id: vm.shippingRequestID }).query().$promise.then((response) => {
            if (response && response.data) {
              vm.requestForShipModel.status = response.data.status;
              console.log('manage status : ' + vm.requestForShipModel.status);
              if (vm.requestForShipModel.status == 0) {
                vm.label = CORE.OPSTATUSLABLEPUBLISH;
              } else {
                vm.isPageDisabled = true;
              }

            }
          });
        }

        vm.getRequestStatus = (statusID) => {          
          return BaseService.getWoStatus(statusID);
        }
        vm.getWoStatusClassName = (statusID) => {
          return BaseService.getWoStatusClassName(statusID);
        }

        //set tab wise rights
        function setTabWisePageRights(pageList) {
          if (pageList && pageList.length > 0) {
            var tab = pageList.filter(a => a.PageDetails != null && a.PageDetails.pageRoute == TRANSACTION.TRANSACTION_MANAGE_DETAIL_STATE);
            if (tab && tab.length > 0 && tab[0].isActive) {
              vm.pageTabRights.DetailTab = true;
            }
            tab = pageList.filter(a => a.PageDetails != null && a.PageDetails.pageRoute == TRANSACTION.TRANSACTION_MANAGE_APPROVAL_STATE);
            if (tab && tab.length > 0 && tab[0].isActive) {
              vm.pageTabRights.ApprovalTab = true;
            }
          }
        }

      let initAutoCompleteReqShipDtl = () => {  
        vm.autoCompleteReqShipDtl = { 
                columnName: 'note',
                keyColumnName: 'id',
                keyColumnId: null,
                inputName: 'id',
                placeholderName: 'id',
                isRequired: false,
                isDisabled: false,
                isAddnew: false,                      
                onSelectCallbackFn:  selectReqFroShip,
                onSearchFn: function (query) {
                  let searchobj = {
                    searchquery: query
                  }                  
                  return getGetShippingReqList(searchobj);          
                }
              };          
        };

        $timeout(function () {
          $scope.$on(USER.LoginUserPageListBroadcast, function (event, data) {
            var menudata = data;
            setTabWisePageRights(menudata);
            $scope.$applyAsync();
          });
        });

        if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
          setTabWisePageRights(BaseService.loginUserPageList);
        }

        //get data on type in auto-complete-search
        let getGetShippingReqList = (searchobject) => {
          vm.ReqShipList = [];          
          return RequestForShipFactory.getGetShippingReqList().query(searchobject).$promise.then((response) => {
            var data = [];            
            if (response && response.data) {              
              data = response.data;
              data.forEach((x) => {
                vm.ReqShipList.push({
                  id: x.id,
                  note : x.note                  
                });
              });
              return vm.ReqShipList;
            }
          }).catch((error) => {
            BaseService.getErrorLog(error);
          });
        }


        //Select event of auto-complete-search selection
        let selectReqFroShip = (item, msWizard) => {
            if (item) {              
              //$state.go(USER.ADMIN_MANAGEDEPARTMENT_DETAIL_STATE, { deptID: item.deptID }, { reload: true });
              $state.go(TRANSACTION.TRANSACTION_MANAGE_DETAIL_STATE, { id: item.id }, { reload: true });
              $timeout(() => {
                vm.autoCompleteDeptHeaderList.keyColumnId = null;
              }, true);
            }
          }

        getGetShippingReqList();
        initAutoCompleteReqShipDtl();

        //[S] Request Entry
        //[E] Request Entry

        //Back button
        vm.backToList = () => {            
          if (BaseService.checkFormDirty(vm.frmRequestForShip, vm.checkDirtyObject) || vm.isDetailGridChanged) {
              showWithoutSavingAlertforBackButton();
            } else if (vm.frmShippingReqEmpDet && vm.frmShippingReqEmpDet.$dirty) {
              showWithoutSavingAlertforBackButton();
            } else {
              BaseService.currentPageForms = [];
              $state.go(TRANSACTION.TRANSACTION_REQUEST_FOR_SHIP_LIST_STATE);             
            }
        }


        function showWithoutSavingAlertforBackButton() {
            let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
            let obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
                canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                if (vm.tabName == TRANSACTION.RequestShippingTabs.Detail.Name) {
                  vm.frmRequestForShip.$setPristine();
                  //return true;
                } else if (vm.tabName == TRANSACTION.RequestShippingTabs.Approval.Name) {
                  vm.frmShippingReqEmpDet.$setPristine();
                  //return true;                
                }                
              }
              $state.go(TRANSACTION.TRANSACTION_REQUEST_FOR_SHIP_LIST_STATE);
              return true;
            }, (cancel) => {
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        //[S] UI GRID        
        //[E] UI Grid        
        // [E]

        //Transdter route on tab change
        vm.stateTransfer = (tabIndex) => {
          var itemTabName = _.find(TRANSACTION.RequestShippingTabs, function (valItem) {
            return valItem.ID == tabIndex;
          })
          if (itemTabName && itemTabName.Name != vm.tabName) {
            switch (itemTabName.Name) {
              case TRANSACTION.RequestShippingTabs.Detail.Name:                
                $state.go(TRANSACTION.TRANSACTION_MANAGE_DETAIL_STATE, { id: vm.shippingRequestID });                
                break;
              case TRANSACTION.RequestShippingTabs.Approval.Name:                
                $state.go(TRANSACTION.TRANSACTION_MANAGE_APPROVAL_STATE, { id: vm.shippingRequestID });
                break;            
              default: break;
            }
          }
        }


        //Tab chaanges
        vm.onTabChanges = (msWizard) => {
          BaseService.setLoginUserChangeDetail(false); 
          msWizard.selectedIndex = vm.selectedTabIndex;         
          vm.stateTransfer(vm.selectedTabIndex);
          $("#content").animate({ scrollTop: 0 }, 200);         
          vm.isDetailTab = (msWizard.selectedIndex == 0);
          vm.isDeptTab = (msWizard.selectedIndex == 1);
          
          /* for chack form Dirty popup on tab change */
          vm.ischangePage = false;
        }

        vm.cancelRequestForShipDet = () => {
            clearShippingModel();
            clearFormErrors();
        }
        //close popup on page destroy 
        $scope.$on('$destroy', function () {
            $mdDialog.hide(false, { closeAll: true });
        });

        //// [S] Department Approval
        //// [E] Department Approval

        /* fun to check form dirty on tab change */
        vm.isStepValid = function (step) {            
              switch (step) {
                  case 0: {
                  var isDirty = ( (vm.frmRequestForShip.$dirty ? vm.frmRequestForShip.$dirty : false) || vm.isDetailGridChanged )  ;
                      if (isDirty)
                          return showWithoutSavingAlertforTabChange(step);
                      else
                          return true;
                      break;
                  }
                  case 1: {
                  var isDirty = vm.frmShippingReqEmpDet.$dirty ? vm.frmShippingReqEmpDet.$dirty : false ;
                      if (isDirty)
                          return showWithoutSavingAlertforTabChange(step);
                      else
                          return true;
                      break;
                  }
              }
        }

        // Change status of Request
        vm.changeRequestStatus = (statusID, oldStatusID, tabIndex) => {
          if (statusID != oldStatusID) {
            if (vm.frmRequestForShip.$invalid) {
              let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.FILL_DET_BEFORE_STATUS_CHANGE);
              messageContent.message = stringFormat(messageContent.message, "Shipping Request");
              let obj = {
                multiple: true,
                messageContent: messageContent
              };
              DialogFactory.messageAlertDialog(obj);
            }
            else {
              let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.REQ_SHIP_STATUS_CHANGE);
              messageContent.message = stringFormat(messageContent.message, vm.getRequestStatus(oldStatusID), vm.getRequestStatus(statusID));
              let obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes) {
                  vm.isChanged = true;
                 
                  if (tabIndex == 0) {
                    vm.oldStatuspublish = false;                    
                    // Call when sales order Draft To Publish mode
                    if (oldStatusID == CORE.SHIPPING_REQUEST_STATUS_DROPDOWN.Draft && statusID == CORE.SHIPPING_REQUEST_STATUS_DROPDOWN.Published) {
                      vm.oldStatuspublish = true;
                    }
                    updateReqStatusLabel(statusID);                    
                    $scope.$broadcast("saveRequestForShipDetail");
                  }
                }
              }, (cancel) => {
              }).catch((error) => {
                return BaseService.getErrorLog(error);
              });
            }
          }

        }


        //Update status label
        let updateReqStatusLabel = (statusID) => {
          vm.requestForShipModel.status = statusID;
          if (vm.requestForShipModel.status == CORE.SHIPPING_REQUEST_STATUS_DROPDOWN.Draft) {            
            vm.label = CORE.OPSTATUSLABLEDRAFT;
            vm.isPageDisabled = false;
          }
          else if (vm.requestForShipModel.status == CORE.SHIPPING_REQUEST_STATUS_DROPDOWN.Published) {            
            vm.label = CORE.OPSTATUSLABLEPUBLISH;
            vm.isPageDisabled = true;
          }
          else {
            vm.label = "";
          }
        }


        //Check step  and Broadcast save event
        vm.CheckStepAndAction = (msWizard, isSave) => {
          let isChanged = false;
          
          if (vm.tabName == TRANSACTION.RequestShippingTabs.Detail.Name) {           
            if (isSave) {
             
              vm.saveDisable = true;              
              if (!vm.frmRequestForShip.$dirty && !vm.isDetailGridChanged) {
                BaseService.focusRequiredField(vm.frmRequestForShip);
                vm.saveDisable = false;
                return;
              }
            }
            
           if(!vm.isDetailGridChanged) {
              isChanged = BaseService.checkFormDirty(vm.frmRequestForShip, vm.checkDirtyObject);           
            }            
            showWithoutSavingAlertforNextPrevious(vm.selectedTabIndex, isSave, isChanged, false);
          }
          else if (vm.tabName == TRANSACTION.RequestShippingTabs.Approval.Name) {          
            if (isSave) {
              vm.saveDisable = true;
              if (BaseService.focusRequiredField(vm.frmShippingReqEmpDet)) {
                vm.saveDisable = false;
                return;
              }
            }
            isChanged = BaseService.checkFormDirty(vm.frmShippingReqEmpDet, null, null, null);
            showWithoutSavingAlertforNextPrevious(vm.selectedTabIndex, isSave, isChanged, false);          
          }
        }

        // Check form dirty if not saved.
        function showWithoutSavingAlertforNextPrevious(selectedTabIndex, isSave, isChanged, isPrevious) {
          let selectedIndex = selectedTabIndex;
          if (isSave) {
            if (selectedIndex == 0) {
              if (vm.frmRequestForShip.$valid) {
                $scope.$broadcast("saveRequestForShipDetail");
              }
            }
            else if (selectedIndex == 1) {
              if (vm.frmShippingReqEmpDet.$valid) {
                $scope.$broadcast("saveRequestForShipApproval");
              }
            }
          }
          else {
            if (isChanged) {
              var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
              let obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
                canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
              };
              DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes) {
                  if (selectedIndex == 0) {
                    vm.frmRequestForShip.$setPristine();
                    vm.isDetailGridChanged = false;
                  }
                  else if (selectedIndex == 1) {
                    vm.frmShippingReqEmpDet.$setPristine();
                  }
                }
              }, (cancel) => {
              }).catch((error) => {
                return BaseService.getErrorLog(error);
              });

            }
          }
        }
      

        /* Show save alert popup when performing tab change*/
        function showWithoutSavingAlertforTabChange(step) {
            let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
            let obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
                canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
            };
            return DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes) {
                    vm.isSave = false;
                    if (step == 0) {
                        vm.requestForShipModel = {
                            id: null,
                            shippingRequestID: vm.shippingRequestID,
                            qty: null,
                            woID: null,
                            note: null
                        };                        
                        vm.frmRequestForShip.$setPristine();
                        vm.isDetailGridChanged = false
                        return true;
                    } else if (step == 1) {
                        vm.frmShippingReqEmpDet.$setPristine();
                        return true;
                    }
                }

            }, (cancel) => {
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        //Add new request 
        vm.addReqForShip = () => {
          $state.go(TRANSACTION.TRANSACTION_MANAGE_DETAIL_STATE, { id: null });
        }
            /*Add form on load*/
    angular.element(() => {
      switch (vm.tabName) {
        case TRANSACTION.RequestShippingTabs.Detail.Name:
          BaseService.currentPageForms = [vm.frmRequestForShip];
          break;
        case TRANSACTION.RequestShippingTabs.Approval.Name:
          BaseService.currentPageForms = [vm.frmShippingReqEmpDet];
          break;
        default:
      }
    });

    
    }

})();
