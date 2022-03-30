
(function () {
  'use strict';

  angular
    .module('app.transaction.shipped')
    .controller('ManageShippedAssemblyController', ManageShippedAssemblyController);

  /** @ngInject */
  function ManageShippedAssemblyController($state, $mdDialog, $q, $stateParams, $filter, $timeout, $window, TRANSACTION, $scope, CORE, USER, BaseService, ShippedFactory, SalesOrderFactory, DialogFactory, WorkorderOperationFactory, CustomerFactory) {
    const vm = this;
    vm.owID = $stateParams.owID;
    vm.IsEdit = false;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.placeHolderFormat = angular.copy(vm.DefaultDateFormat).toUpperCase();
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.IsPickerOpen = {};
    vm.IsPickerOpen[vm.DATE_PICKER.owInvoiceDate] = false;
    vm.todayDate = new Date();
    vm.LabelConstant = CORE.LabelConstant;
    vm.shippingMethodLabel = CORE.CategoryType.ShippingType.Title;

    vm.owInvoiceDateOptions = {
      maxDate: vm.todayDate,
      appendToBody: true
    };

    //Get details of site map crumb 
    vm.shipped = {};
    let woNumberForTimelineLog = null;
    var selectedWONumber;

    vm.locale = {
      formatDate: function (date) {
        return $filter('date')(date, vm.DefaultDateFormat);
      }
    };

    /* retrieve Operation Details*/
    vm.shippedAssemblyDetails = (woID) => {
      vm.cgBusyLoading = ShippedFactory.shipped().query({ id: woID }).$promise.then((shippedassembly) => {
        vm.shippedCopy = angular.copy(shippedassembly.data);
        vm.shipped = angular.copy(shippedassembly.data);
        vm.shipped.outwinvoicedate = BaseService.getUIFormatedDate(vm.shipped.outwinvoicedate, vm.DefaultDateFormat);
        vm.checkDirtyObject = {
          oldModelName: vm.shippedCopy,
          newModelName: vm.shipped
        }
        var autocompletePromise = [getShippingDetailList()];
        vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
          initAutoComplete();
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    /**
     * Get WorkOrder Operation detail
     */
    let getWorkOrderOperation = () => {
      woNumberForTimelineLog = selectedWONumber.woNumber;
      return WorkorderOperationFactory.retriveOPListbyWoID().query({ woID: selectedWONumber.woID }).$promise.then((operationlist) => {
        vm.workOperationList = operationlist.data;
        _.each(vm.workOperationList, (opObj) => {
          opObj.opNameDisplay = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, opObj.opName, opObj.opNumber);
        });
        var woOPObj = _.maxBy(vm.workOperationList, function (item) {
          return item.opNumber;
        });
        if (!vm.IsEdit) {
          vm.shipped.woOPID = woOPObj.woOPID;
        }
        if (vm.shipped.woOPID && !vm.autoCompleteWorkorderOperation) {
          vm.autoCompleteWorkorderOperation = {
            columnName: 'opNameDisplay',
            keyColumnName: 'woOPID',
            keyColumnId: vm.shipped ? (vm.shipped.woOPID ? vm.shipped.woOPID : null) : null,
            inputName: 'Work Order Operation',
            placeholderName: 'Work Order Operation',
            isRequired: true,
            isAddnew: false,
            callbackFn: getWorkOrderOperation,
            onSelectCallbackFn: getValidShippedData
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    // get valid shipped data
    let getValidShippedData = (item) => {
      if (item && item.woOPID > 0 && vm.autoCompleteWorkorder.keyColumnId > 0) {
        const workorderInfo = {
          woID: vm.autoCompleteWorkorder.keyColumnId,
          woOPID: item.woOPID,
        };
        vm.cgBusyLoading = SalesOrderFactory.getValidShippedQty().query({ workorderObj: workorderInfo }).$promise.then((res) => {
          if (res && res.data) {
            if (vm.shippedCopy) {
              vm.validShippedQty = angular.copy(res.data.ReadyForShippQty) + vm.shippedCopy.shippedqty;
              vm.shipped.shippedqty = vm.shippedCopy.shippedqty ? vm.shippedCopy.shippedqty : angular.copy(res.data.ReadyForShippQty);
            } else {
              vm.shipped.shippedqty = vm.validShippedQty = angular.copy(res.data.ReadyForShippQty);
            }
          } else {
            vm.shipped.shippedqty = "";
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }

    // Get AutoComplete list for Work Order
    let getShippingDetailList = () => {
      vm.ShippingDetail = [];
      const shippingInfo = {
      };
      return SalesOrderFactory.getShippingList().query({ shippingObj: shippingInfo }).$promise.then((res) => {
        var salesdata = [];
        _.each(res.data, function (item) {
          if (item.componentAssembly) {
            _.each(item.salesShippingDet, function (data) {
              data.shippingQty = data.qty;
              data.price = item.price;
              data.customerID = item.salesOrderMst.customers.id;
              data.customerName = item.salesOrderMst.customers.mfgCode;
              if (data.shippingMethodSalesOrder) {
                data.shippingMethod = data.shippingMethodSalesOrder.gencCategoryCode;
              }
              else {
                data.shippingMethod = item.salesOrderMst.shippingMethod ? item.salesOrderMst.shippingMethod.gencCategoryCode : null;
              }
              if (data.customerSalesShippingAddress && data.customerSalesShippingAddress.ShippingAddress) {
                data.customerShippingAddress = data.customerSalesShippingAddress.ShippingAddress;
              }
              else {
                data.customerShippingAddress = item.salesOrderMst.customerShippingAddress ? item.salesOrderMst.customerShippingAddress.ShippingAddress : null;
              }
              data.partID = item.componentAssembly.id;
              data.PIDCode = item.componentAssembly.PIDCode;
              data.rev = item.componentAssembly.rev;
              data.isCustom = item.componentAssembly.isCustom;
              data.displayRohsIcon = CORE.WEB_URL + USER.ROHS_BASE_PATH + item.componentAssembly.rfq_rohsmst.rohsIcon;
              data.rohsName = item.componentAssembly.rfq_rohsmst.name;
              data.qty = stringFormat("{0} [{1}] [{2}] [{3}] [{4}]", data.qty,
                item.salesOrderMst.customers.mfgCode,
                item.componentAssembly.PIDCode, item.salesOrderMst.salesOrderNumber,
                $filter('date')(new Date(data.shippingDate), vm.DefaultDateFormat));
              salesdata.push(data);
            });
          }
        });
        if (!vm.owID) {
          vm.ShippingDetail = _.filter(salesdata, function (item) {
            let totalShippedQty = _.sumBy(item.shippedAssembly, 'shippedqty');
            return (totalShippedQty < item.shippingQty) ? true : false;
          });
        }
        else {
          // in edit case add shipped data in autocomplete else return only pending quantity list
          vm.ShippingDetail = _.filter(salesdata, function (item) {
            if (item.shippingID == vm.shipped.shippingId) {
              return true;
            } else {
              let totalShippedQty = _.sumBy(item.shippedAssembly, 'shippedqty');
              return (totalShippedQty < item.shippingQty) ? true : false;
            }
          });
        }

        if (vm.IsEdit) {
          vm.autoCompleteShippingQty = {
            columnName: 'qty',
            keyColumnName: 'shippingID',
            keyColumnId: vm.shipped.shippingId ? vm.shipped.shippingId : null,
            inputName: 'ShippingQty',
            placeholderName: 'Shipping Qty',
            isRequired: true,
            isAddnew: false,
            callbackFn: getShippingDetailList,
            onSelectCallbackFn: checkShippingDetail
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    // Get AutoComplete list for Work Order
    let getWorkorderList = () => {
      const workorder = {
        partID: $scope.shipping.partID,
        woStatus: [CORE.WOSTATUS.PUBLISHED
          , CORE.WOSTATUS.COMPLETED
          , CORE.WOSTATUS.VOID
          , CORE.WOSTATUS.UNDER_TERMINATION
          , CORE.WOSTATUS.TERMINATED
          , CORE.WOSTATUS.PUBLISHED_DRAFT
        ]
      };
      return ShippedFactory.getWorkorderList().query({ workorderObj: workorder }).$promise.then((res) => {
        vm.WorkorderList = res.data;
        if (vm.IsEdit) {
          vm.autoCompleteWorkorder = {
            columnName: 'woNumber',
            keyColumnName: 'woID',
            keyColumnId: vm.shipped.workorderID ? vm.shipped.workorderID : null,
            inputName: 'Workorder',
            placeholderName: 'Work Order',
            isRequired: true,
            isAddnew: false,
            callbackFn: getWorkorderList,
            onSelectCallbackFn: function (selectedItem) {
              vm.isExportControlledAssy = false;
              vm.workOperationList = [];
              selectedWONumber = selectedItem;
              if (!selectedWONumber) {
                woNumberForTimelineLog = null;
                return;
              }

              let woObjForExportControlAssy = {
                woID: selectedItem.woID,
                woAssyID: selectedItem.partID,
                shippingID: vm.autoCompleteShippingQty.keyColumnId
              }
              let exportControlledAssyPromise = [checkForExportControlledAssembly(woObjForExportControlAssy)];
              vm.cgBusyLoading = $q.all(exportControlledAssyPromise).then((responses) => {
                let exportControlAllPartResp = responses[0];
                if (exportControlAllPartResp && exportControlAllPartResp.data && exportControlAllPartResp.data.errorMsg) {
                  woNumberForTimelineLog = null;
                  if (exportControlAllPartResp.data.exportControlledAssyParts && exportControlAllPartResp.data.exportControlledAssyParts.length > 0) {

                    vm.isExportControlledAssy = true;
                    // open popup to display all exported controlled part
                    let data = {
                      exportControlledAssyPartList: exportControlAllPartResp.data.exportControlledAssyParts,
                      alertMessage: exportControlAllPartResp.data.errorMsg
                    }
                    openExportControlledPartListPopup(event, data);
                  }
                  else {
                    openExportControlledAssyErrorMsgDialog(exportControlAllPartResp.data.errorMsg);
                  }
                }
                else {
                  woNumberForTimelineLog = selectedWONumber.woNumber;
                  getWorkOrderOperation();
                }
              }).catch((error) => {
                return BaseService.getErrorLog(error);
              });
            }
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.openPicker = (type, ev) => {
      if (ev.keyCode == 40) {
        vm.IsPickerOpen[type] = true;
      }
    };

    /*
    * Author :  Champak Chaudhary
    * Purpose : Go back to Work Order List
    */
    vm.goBack = () => {
      if (vm.frmShippedAssemblyDetails.$dirty) {
        showWithoutSavingAlertforGoback();
      } else {
        $state.go(TRANSACTION.TRANSACTION_SHIPPED_STATE);
      }
    }
    function showWithoutSavingAlertforGoback() {
      let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      let obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.frmShippedAssemblyDetails.$setPristine();
          $state.go(TRANSACTION.TRANSACTION_SHIPPED_STATE);
        }
      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    if (vm.owID > 0) {
      vm.IsEdit = true;
      vm.shippedAssemblyDetails(vm.owID);
    }
    else {
      vm.shipped.outwinvoicedate = new Date();
      var autocompletePromise = [getShippingDetailList()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
        initAutoComplete();
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    //close popup on page destroy 
    $scope.$on('$destroy', function () {
      $mdDialog.hide(false, { closeAll: true });
    });
    let initAutoComplete = () => {
      vm.AssemblyRevList = [];
      vm.WorkOerderOperation = [];
      if (!vm.IsEdit) {
        vm.autoCompleteShippingQty = {
          columnName: 'qty',
          keyColumnName: 'shippingID',
          keyColumnId: vm.shipped.shippingId ? vm.shipped.shippingId : null,
          inputName: 'Estimated Shipping Qty',
          placeholderName: 'Estimated Shipping Qty',
          isRequired: true,
          isAddnew: false,
          callbackFn: getShippingDetailList,
          onSelectCallbackFn: checkShippingDetail
        };
        vm.autoCompleteWorkorder = {
          columnName: 'woNumber',
          keyColumnName: 'woID',
          keyColumnId: vm.shipped.workorderID ? vm.shipped.workorderID : null,
          inputName: 'Workorder',
          placeholderName: 'Work Order',
          isRequired: true,
          isAddnew: false,
          callbackFn: getWorkorderList,
          onSelectCallbackFn: function (selectedItem) {
            vm.isExportControlledAssy = false;
            vm.workOperationList = [];
            selectedWONumber = selectedItem;
            if (!selectedWONumber) {
              woNumberForTimelineLog = null;
              return;
            }

            let woObjForExportControlAssy = {
              woID: selectedItem.woID,
              woAssyID: selectedItem.partID,
              shippingID: vm.autoCompleteShippingQty.keyColumnId
            }
            let exportControlledAssyPromise = [checkForExportControlledAssembly(woObjForExportControlAssy)];
            vm.cgBusyLoading = $q.all(exportControlledAssyPromise).then((responses) => {
              let exportControlAllPartResp = responses[0];
              if (exportControlAllPartResp && exportControlAllPartResp.data && exportControlAllPartResp.data.errorMsg) {
                woNumberForTimelineLog = null;
                if (exportControlAllPartResp.data.exportControlledAssyParts && exportControlAllPartResp.data.exportControlledAssyParts.length > 0) {

                  vm.isExportControlledAssy = true;
                  // open popup to display all exported controlled part
                  let data = {
                    exportControlledAssyPartList: exportControlAllPartResp.data.exportControlledAssyParts,
                    alertMessage: exportControlAllPartResp.data.errorMsg
                  }
                  openExportControlledPartListPopup(event, data);
                }
                else {
                  openExportControlledAssyErrorMsgDialog(exportControlAllPartResp.data.errorMsg);
                }
              }
              else {
                woNumberForTimelineLog = selectedWONumber.woNumber;
                getWorkOrderOperation();
              }
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }
        };
        vm.autoCompleteWorkorderOperation = {
          columnName: 'opName',
          keyColumnName: 'woOPID',
          keyColumnId: vm.shipped ? (vm.shipped.assemblyRevisionID ? vm.shipped.assemblyRevisionID : null) : null,
          inputName: 'Work Order Operation',
          placeholderName: 'Work Order Operation',
          isRequired: true,
          isAddnew: false,
          callbackFn: getWorkOrderOperation,
          onSelectCallbackFn: getValidShippedData
        };
      }
    }

    //get shipped invoice date validation
    vm.checkOWDate = () => {
      //let owDate = vm.shipped.outwinvoicedate;
      //if (moment(owDate).format(vm.DefaultDateFormat.toUpperCase()) < moment(new Date()).format(vm.DefaultDateFormat.toUpperCase())) {
      //    vm.shipped.outwinvoicedate = "";
      //    vm.isGrater = true;
      //}
      //else {
      //    vm.isGrater = false;
      //}
    }
    shipp();
    function shipp() {
      $scope.shipping = {
        price: null,
        date: null,
        type: null,
        address: null,
        shippingQty: 0,
        customerName: '',
        assembly: '',
        customerID: '',
        partID: '',
        shippedNotes: '',
        displayRohsIcon: null,
        rohsName: null,
        isCustom: null
      }
    }
    let checkShippingDetail = (item) => {
      vm.isExportControlledAssy = false;
      if (item) {
        $scope.shipping = {
          price: item.price ? parseFloat(item.price).toFixed(3) : null,
          date: $filter('date')(new Date(item.shippingDate), vm.DefaultDateFormat),
          type: item.shippingMethod,
          address: item.customerShippingAddress,
          shippingQty: item.shippingQty,
          customerName: item.customerName,
          assembly: item.assembly,
          PIDCode: item.PIDCode,
          rev: item.rev,
          customerID: item.customerID,
          partID: item.partID,
          shippedNotes: item.shippedNotes,
          displayRohsIcon: item.displayRohsIcon,
          rohsName: item.rohsName,
          isCustom: item.isCustom
        }
        getWorkorderList();
      }
      else {
        vm.WorkorderList = [];
        vm.workOperationList = [];
        if (vm.autoCompleteWorkorder)
          vm.autoCompleteWorkorder.keyColumnId = null;
        if (vm.autoCompleteWorkorderOperation)
          vm.autoCompleteWorkorderOperation.keyColumnId = null;
        shipp();
      }
    }


    /*
     * Author :  Champak Chaudhary
     * Purpose : Save Shipped detail
     */
    vm.saveShippedAssembly = (msWizard) => {
      //var woOPObj = _.maxBy(vm.workOperationList, function (item) { return item.opNumber; });

      //Used to focus on first error filed of form
      //ng-disabled="msWizard.currentStepInvalid() || !vm.checkFormDirty(msWizard.currentStepForm(),vm.checkDirtyObject)"
      if (vm.frmShippedAssemblyDetails.$invalid) {
        BaseService.focusRequiredField(vm.frmShippedAssemblyDetails);
        return;
      }
      

      let woObjForExportControlAssy = {
        woID: vm.autoCompleteWorkorder.keyColumnId,
        woAssyID: $scope.shipping.partID,
        shippingID: vm.autoCompleteShippingQty.keyColumnId
      }
      let exportControlledAssyPromise = [checkForExportControlledAssembly(woObjForExportControlAssy)];
      vm.cgBusyLoading = $q.all(exportControlledAssyPromise).then((responses) => {
        let exportControlAllPartResp = responses[0];

        // if export controlled part then not allowed to save 
        if (exportControlAllPartResp && exportControlAllPartResp.data && exportControlAllPartResp.data.errorMsg) {
          woNumberForTimelineLog = null;
          if (exportControlAllPartResp.data.exportControlledAssyParts && exportControlAllPartResp.data.exportControlledAssyParts.length > 0) {

            vm.isExportControlledAssy = true;
            // open popup to display all exported controlled part
            let data = {
              exportControlledAssyPartList: exportControlAllPartResp.data.exportControlledAssyParts,
              alertMessage: exportControlAllPartResp.data.errorMsg
            }
            openExportControlledPartListPopup(event, data);
          }
          else {
            openExportControlledAssyErrorMsgDialog(exportControlAllPartResp.data.errorMsg);
          }
        }
        else { // if no any export controlled part then only allowed to save 
          vm.isExportControlledAssy = false;
          const shippedAssembly = {
            id: vm.shipped.id,
            partID: $scope.shipping.partID,
            shippingId: vm.autoCompleteShippingQty.keyColumnId,
            shippedqty: vm.shipped.shippedqty,
            shippedOldQty: vm.shippedCopy ? vm.shippedCopy.shippedqty : 0,
            outwinvoiceno: vm.shipped.outwinvoiceno,
            //outwinvoicedate: vm.shipped.outwinvoicedate ? $filter('date')(new Date(vm.shipped.outwinvoicedate), vm.DefaultDateFormat) : vm.shipped.outwinvoicedate,
            outwinvoicedate: vm.shipped.outwinvoicedate ? (BaseService.getAPIFormatedDate(vm.shipped.outwinvoicedate)) : vm.shipped.outwinvoicedate,
            workorderID: vm.autoCompleteWorkorder.keyColumnId,
            //woOPID: woOPObj ? woOPObj.woOPID : null,
            woOPID: vm.autoCompleteWorkorderOperation.keyColumnId,
            customerID: $scope.shipping.customerID,
            shippedNotes: vm.shipped.shippedNotes,
            woNumber: woNumberForTimelineLog
          };
          if (vm.shipped.id) {
            vm.cgBusyLoading = ShippedFactory.shipped().update({
              id: vm.shipped.id,
            }, shippedAssembly).$promise.then((res) => {
              BaseService.currentPagePopupForm = [];
              $state.go(TRANSACTION.TRANSACTION_SHIPPED_STATE);
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }
          else {
            vm.cgBusyLoading = ShippedFactory.shipped().save(shippedAssembly).$promise.then((res) => {
              if (res.data.id) {
                BaseService.currentPagePopupForm = [];
                $state.go(TRANSACTION.TRANSACTION_SHIPPED_STATE);
              }
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    //Set as current form when page loaded
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.frmShippedAssemblyDetails];
    });

    vm.checkFormDirty = (form, columnName) => {
      let result = BaseService.checkFormDirty(form, columnName);
      return result;
    }
    /* called for max date validation */
    vm.getMaxDateValidation = (FromDateLabel, ToDateLabel) => {
      return BaseService.getMaxDateValidation(FromDateLabel, ToDateLabel);
    }
    /* called for min date validation */
    vm.getMinDateValidation = (FromDateLabel, ToDateLabel) => {
      return BaseService.getMinDateValidation(FromDateLabel, ToDateLabel);
    }
    /** Validate max size */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    };

    let checkForExportControlledAssembly = (woObjForExportControlAssy) => {
      if (woObjForExportControlAssy) {
        let woObj = {
          woID: woObjForExportControlAssy.woID,
          woAssyID: woObjForExportControlAssy.woAssyID,
          shippingID: woObjForExportControlAssy.shippingID
        }
        return ShippedFactory.getExportControlledAssyPartOfWO().save(woObjForExportControlAssy).$promise.then((res) => {
          return res;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }

    /* open popup which display export controlled assemblies/parts */
    let openExportControlledPartListPopup = (event, data) => {
      DialogFactory.dialogService(
        TRANSACTION.EXPORT_CONTROLLED_PART_MODAL_CONTROLLER,
        TRANSACTION.EXPORT_CONTROLLED_PART_MODAL_VIEW,
        event, data).then((resp) => {
        }, (cancel) => {
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
    }

    /* display error message for export controlled assembly */
    let openExportControlledAssyErrorMsgDialog = (errorMsg) => {
      let obj = {
        messageContent : errorMsg,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
        multiple: true
      };
      DialogFactory.messageAlertDialog(obj).then((yes) => {
      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

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

    vm.goShippingMethodList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_SHIPPINGTYPE_STATE)
    }
  }
})();
