(function () {
  'use strict';
  angular
    .module('app.core')
    .directive('requestForShipApproval', requestForShipApproval);

  /** @ngInject */
  function requestForShipApproval(CORE, BaseService, DialogFactory, $q, ManageRequestForShipFactory, EmployeeFactory, TRANSACTION, RequestForShipFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        shippingRequestId: '=?'
      },
      templateUrl: 'app/directives/custom/request-for-ship-approval/request-for-ship-approval.html',
      controller: requestForShipApprovalCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function requestForShipApprovalCtrl($scope) {
      var vm = this;
      vm.LabelConstant = CORE.LabelConstant;
      vm.EmptyMesssageEmpDet = TRANSACTION.TRANSACTION_EMPTYSTATE.SHIPPING_REQ_EMPLOYEEDET;

      vm.shippingRequestID = $scope.shippingRequestId ? parseInt($scope.shippingRequestId) : null;
      vm.shippingRequestModel = {
        shippingRequestID: vm.shippingRequestID,
        requestedBy: ''
      };
      vm.employeeID = BaseService.loginUser.employee.id;
      vm.isPageDisabled = false;
      // [S] Department Approval

      vm.shippingReqEmpList = [];
      vm.allEmployeeList = [];
      const defaultEmployee = {
        id: null,
        employeeID: null,
        shippingRequestID: vm.shippingRequestID,
        isAck: false,
        acceptedDate: null,
        isEditClicked: false,
        initAutoCompleteEmployees: null
      };

      const defaultAutoCompleteEmployees = {
        columnName: 'empCodeName',
        controllerName: null,
        viewTemplateURL: null,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Personnel',
        placeholderName: 'Select Personnel',
        isRequired: true,
        isDisabled: false,
        isAddnew: false,
        callbackFn: getEmployeeList,
        onSelectCallbackFn: function (selectedItem) {
          if (!selectedItem) {
            vm.selectedEmpDet = null;
          }
          else {
            vm.selectedEmpDet = selectedItem;
          }
        }
      };

      vm.deptAcceptedDateOptions = {
        maxDate: vm.todayDate,
        appendToBody: true
      };

      // Get shipping requestedBy and status
      const getShippingRequestDet = () => {
        vm.cgBusyLoading = RequestForShipFactory.getShippingRequestByDet({ id: vm.shippingRequestID }).query().$promise.then((result) => {
          if (result && result.data) {
            vm.shippingRequestModel.requestedBy = result.data.requestedBy;
            if (result.data.status === CORE.SHIPPING_REQUEST_STATUS_DROPDOWN.Published) {
              vm.isPageDisabled = true;
            } else {
              vm.isPageDisabled = false;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      getShippingRequestDet();
      initDepartmentApproval();

      /* Employee dropdown fill up */
      function initDepartmentApproval() {
        $q.all([getEmployeeList(), getShippingRequestEmpDet()]).then((responses) => {
          var getShippingRequestEmpDetResp = responses[1];

          vm.shippingReqEmpList = [];
          if (getShippingRequestEmpDetResp) {
            getShippingRequestEmpDetResp.forEach((x) => {
              var defaultEmployeeCopy = angular.copy(defaultEmployee);
              defaultEmployeeCopy.initAutoCompleteEmployees = angular.copy(defaultAutoCompleteEmployees);

              defaultEmployeeCopy.isEditClicked = false;
              defaultEmployeeCopy.id = x.id;
              defaultEmployeeCopy.employeeID = x.employeeID;
              defaultEmployeeCopy.shippingRequestID = x.shippingRequestID;
              defaultEmployeeCopy.isAck = x.isAck;
              defaultEmployeeCopy.acceptedDate = x.acceptedDate;
              defaultEmployeeCopy.initAutoCompleteEmployees.keyColumnId = x.employeeID;

              vm.shippingReqEmpList.push(defaultEmployeeCopy);
            });
            // need to add  this
            if (vm.employeeID === vm.shippingRequestModel.requestedBy) {
              addDefaultShippingReqEmp();
            }
            vm.isShippingReqNotFound = vm.shippingReqEmpList.length === 0;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

      //Employee list for  dropdown fill
      function getEmployeeList() {
        vm.allEmployeeList = [];
        return EmployeeFactory.GetEmployeeDetail().query({ isOnlyActive: true }).$promise.then((employees) => {
          vm.allEmployeeList = [];
          if (vm.employeeID === vm.shippingRequestModel.requestedBy) {
            vm.allEmployeeList = employees.data.filter((x) => x.id !== vm.employeeID);
          } else {
            vm.allEmployeeList = employees.data;
          }
          return vm.allEmployeeList;
        }).catch((error) => BaseService.getErrorLog(error));
      }

      //Get List of Request sent Employee
      function getShippingRequestEmpDet() {
        return ManageRequestForShipFactory.getShippingRequestEmpDet().query({ shippingRequestID: vm.shippingRequestID }).$promise.then((response) => {
          if (response && response.data) {
            return response.data;
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      }

      function addDefaultShippingReqEmp() {
        var defaultEmployeeCopy = angular.copy(defaultEmployee);
        defaultEmployeeCopy.initAutoCompleteEmployees = angular.copy(defaultAutoCompleteEmployees);
        defaultEmployeeCopy.isEditClicked = true;
        vm.shippingReqEmpList.push(defaultEmployeeCopy);
      }


      //Save Approval list
      vm.saveShippingReqEmpDet = (item) => {
        var employeeID = item.initAutoCompleteEmployees.keyColumnId;
        if (item.isAck) {
          const model = {
            id: item.id,
            shippingRequestID: vm.shippingRequestID,
            isAck: true,
            empName: vm.selectedEmpDet.empCodeName
          };

          vm.cgBusyLoading = ManageRequestForShipFactory.ackShippingRequestEmpDet().save(model).$promise.then((response) => {
            if (response && response.data) {
              item.isEditClicked = false;
              vm.frmShippingReqEmpDet.$setPristine();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else if (vm.employeeID == vm.shippingRequestModel.requestedBy) {
          const index = vm.shippingReqEmpList.findIndex((x) => x.initAutoCompleteEmployees.keyColumnId == employeeID && x.id != item.id);
          if (index !== -1) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SHIPPING_EMP_APPROVAL_EXISTS);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
            return;
          }
          const model = {
            id: item.id,
            employeeID: item.initAutoCompleteEmployees.keyColumnId,
            shippingRequestID: vm.shippingRequestID,
            empName: vm.selectedEmpDet.empCodeName
          };

          vm.cgBusyLoading = ManageRequestForShipFactory.saveShippingRequestEmpDet().save(model).$promise.then((response) => {
            if (response && response.data) {
              switch (response.data.error) {
                case 'employee': {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SHIPPING_EMP_APPROVAL_EXISTS);
                  const model = {
                    messageContent: messageContent,
                    multiple: true
                  };
                  DialogFactory.messageAlertDialog(model);
                  break;
                }
                default: {
                  if (!item.id) {
                    item.id = response.data.id;
                    if (vm.employeeID == vm.shippingRequestModel.requestedBy) {
                      addDefaultShippingReqEmp();
                    }
                  }
                  item.isEditClicked = false;
                  vm.frmShippingReqEmpDet.$setPristine();
                }
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          item.isEditClicked = false;
        }
      };

      //Update approval list data
      vm.editShippingReqEmpDet = (item) => {
        item.isEditClicked = true;
        vm.selectedEmpDet = _.find(vm.allEmployeeList, (emplistitem) => emplistitem.id === item.initAutoCompleteEmployees.keyColumnId);
      };

      //delete approval request Data
      vm.deleteShippingReqEmpDet = (item) => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Shipping request', 1);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = ManageRequestForShipFactory.deleteShippingRequestEmpDet().query({ id: item.id }).$promise.then((response) => {
              if (response && response.data) {
                const index = vm.shippingReqEmpList.indexOf(item);
                if (index !== -1) {
                  vm.shippingReqEmpList.splice(index, 1);
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.isAckClicked = (item) => {
        if (item.isAck) {
          item.acceptedDate = new Date();
        }
        else {
          item.acceptedDate = null;
        }
      };
      // [E] Department Approval

      /* called for max date validation */
      vm.getMaxDateValidation = (FromDateLabel, ToDateLabel) => BaseService.getMaxDateValidation(FromDateLabel, ToDateLabel);

      //catch save braoadcast from manage request
      $scope.$on('saveRequestForShipApproval', () => {
        vm.saveRequestForShipApproval(true);
      });

      //get ready
      angular.element(() => {
        $scope.$parent.vm.frmShippingReqEmpDet = vm.frmShippingReqEmpDet;
        BaseService.currentPageForms.push(vm.frmShippingReqEmpDet);
      });
    }
  }
})();
