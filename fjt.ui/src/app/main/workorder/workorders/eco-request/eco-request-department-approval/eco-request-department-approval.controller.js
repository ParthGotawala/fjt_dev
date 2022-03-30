(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ECORequestDepartmentApprovalController', ECORequestDepartmentApprovalController);

  /** @ngInject */
  function ECORequestDepartmentApprovalController($scope, $mdDialog, $state, $stateParams, $filter, $q, USER, CORE, DASHBOARD, DialogFactory, MasterFactory,
    DepartmentFactory, ECORequestFactory, BaseService, WORKORDER) {
    const vm = this;
    vm.requestType = WORKORDER.ECO_REQUEST_TYPE;

    vm.PartCategory = CORE.PartCategory;
    vm.employeeDetails = BaseService.loginUser.employee;

    if (!vm.employeeDetails) {
      $state.go(DASHBOARD.DASHBOARD_STATE);
      DialogFactory.alertDialog({ title: CORE.MESSAGE_CONSTANT.ALERT_HEADER, textContent: CORE.MESSAGE_CONSTANT.USER_EMPLOYEE_DETAIL, multiple: true });
      return;
    }

    var loginUserFullName = vm.employeeDetails.firstName + ' ' + vm.employeeDetails.lastName;
    vm.woID = $stateParams.woID;
    vm.partID = $stateParams.partID;
    var ecoReqID = $stateParams.ecoReqID;
    vm.requestTypeName = $stateParams.requestType;
    vm.id = ecoReqID;
    vm.category = CORE.ECOTypeCategory;

    vm.EmployeeList = [];
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.ecoReqDeptApprovalEmptyState = WORKORDER.WORKORDER_EMPTYSTATE.ECO_REQUEST_DEPT_APPROVAL_LIST;

    vm.assyRevisionList = [];
    vm.todayDate = new Date();
    vm.initiateDateOptions = {
      appendToBody: true,
      maxDate: vm.todayDate
    }
    vm.finalStatusDateOptions = {
      appendToBody: true,
      maxDate: vm.todayDate
    }

    vm.ecoRequestModel = {
      initiateDate: new Date(),
      status: 'P',
      woID: vm.woID,
      finalStatusDate: new Date(),
      initiateBy: vm.employeeDetails.id,
      finalStatusInit: vm.employeeDetails.id,
      initiateFullName: loginUserFullName,
      finalStatusInitFullName: loginUserFullName,
      finalStatus: 'P',
      isAllProductConf: false,
      isFutureProd: false,
      isTemp: false
    };
    if ($stateParams.requestType) {
      switch ($stateParams.requestType) {
        case vm.requestType.ECO.Name:
          vm.ecoRequestModel.requestType = vm.requestType.ECO.Value;
          break;
        case vm.requestType.DFM.Name:
          vm.ecoRequestModel.requestType = vm.requestType.DFM.Value;
          break;
      }
    }


    vm.departmentList = [];
    let defaultEmpDept = {
      ecoDeptApprovalID: null,
      ecoReqID: null,
      deptID: null,
      employeeID: null,
      employeeFullName: null,
      initiateDate: null,
      isAck: null,
      isEditClicked: false,
      autoCompleteDepartment: {},
      employeeList: []
    }

    var defaultAutoCompleteDept = {
      columnName: 'deptName',
      controllerName: USER.ADMIN_DEPARTMENT_ADD_MODAL_CONTROLLER,
      viewTemplateURL: USER.ADMIN_DEPARTMENT_ADD_MODAL_VIEW,
      keyColumnName: 'deptID',
      keyColumnId: null,
      inputName: 'Department',
      placeholderName: 'Department',
      isRequired: true,
      addData: {
        popupAccessRoutingState: [USER.ADMIN_DEPARTMENT_STATE],
        pageNameAccessLabel: CORE.LabelConstant.Department.PageName
      },
      isAddnew: true,
      callbackFn: getDepartmentWithEmployees,
      onSelectCallbackFn: deptOnSelectionCallback
    }

    vm.ecoDeptApprovedList = [];
    var departmentEmployeeListAll = [];

    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.placeHolderFormat = angular.copy(vm.DefaultDateFormat).toUpperCase();
    vm.locale = {
      formatDate: function (date) {
        return $filter('date')(date, vm.DefaultDateFormat);
      }
    };

    /* for down arrow key open date-picker */
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.IsPickerOpen = {};
    vm.IsPickerOpen[vm.DATE_PICKER.initiateDate] = false;
    vm.IsPickerOpen[vm.DATE_PICKER.finalStatusDate] = false;

    let getEcoRequestHeaderDetail = () => {
      return ECORequestFactory.getECOHeaderDetail().query({ partID: vm.partID, ecoReqID: ecoReqID, requestType: vm.ecoRequestModel.requestType }).$promise.then((response) => {
        if (response.data) {
          vm.assemblyDetail = response.data;
          if (response.data.fromEcoRequest) {
            vm.ecoDetail = _.first(response.data.fromEcoRequest)
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    let getECORequest = () => {
      return ECORequestFactory.getECORequest().query({ ecoReqID: ecoReqID, requestType: vm.ecoRequestModel.requestType }).$promise.then((response) => {
        if (response && response.data) {
          return response.data;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    function getEmployeeDeptApprovalDetails() {
      var promises = [getDepartmentWithEmployees(), getECORequestDeptApproval()];
      vm.cgBusyLoading = $q.all(promises).then((responses) => {
        var getDepartmentWithEmployeesResp = responses[0];
        var getECORequestDeptApprovalResp = responses[1];
        vm.ecoDeptApprovedList = [];

        if (getECORequestDeptApprovalResp && getDepartmentWithEmployeesResp) {

          vm.departmentList = getDepartmentWithEmployeesResp.departmentList;
          departmentEmployeeListAll = getDepartmentWithEmployeesResp.employeeDepartmentList;

          getECORequestDeptApprovalResp.forEach((x) => {

            var ecoDeptApprovedObj = angular.copy(defaultEmpDept);
            ecoDeptApprovedObj.ecoDeptApprovalID = x.ecoDeptApprovalID;
            ecoDeptApprovedObj.ecoReqID = x.ecoReqID;
            ecoDeptApprovedObj.deptID = x.deptID;
            ecoDeptApprovedObj.employeeID = x.employeeID;
            ecoDeptApprovedObj.initiateDate = x.initiateDate;
            ecoDeptApprovedObj.isAck = x.isAck;
            ecoDeptApprovedObj.comment = x.comment;
            ecoDeptApprovedObj.employeeList = [];

            _.forEach(x.eco_request_department_employee, function (empItem) {
              var employeeDeptWiseList = _.filter(departmentEmployeeListAll, { departmentID: x.deptID });
              var employeeDept = _.find(employeeDeptWiseList, function (item) {
                return item.employee.id == empItem.employeeID;
              });
              if (employeeDept) {
                var employee = {
                  fullName: employeeDept.employee.fullName,
                  id: employeeDept.employee.id,
                  departmentID: employeeDept.departmentID
                }
                ecoDeptApprovedObj.employeeList.push(employee);
              }
            });

            if (ecoDeptApprovedObj.employeeID)
              ecoDeptApprovedObj.employeeFullName = x.ecoEmployee.fullName;

            ecoDeptApprovedObj.autoCompleteDepartment = angular.copy(defaultAutoCompleteDept);
            ecoDeptApprovedObj.autoCompleteDepartment.keyColumnId = ecoDeptApprovedObj.deptID;

            vm.ecoDeptApprovedList.push(ecoDeptApprovedObj);
          });

          if (vm.employeeDetails.id == vm.ecoRequestModel.initiateBy)
            addEmptyDeptApproval();
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });

    }

    function addEmptyDeptApproval() {
      var ecoDeptApprovedObj = angular.copy(defaultEmpDept);
      ecoDeptApprovedObj.autoCompleteDepartment = angular.copy(defaultAutoCompleteDept);
      ecoDeptApprovedObj.isEditClicked = true;
      vm.ecoDeptApprovedList.push(ecoDeptApprovedObj);
    }

    // get list of department and employee 
    function getDepartmentWithEmployees() {
      return DepartmentFactory.getDepartmentWithEmployees().query().$promise.then((response) => {
        if (response && response.data) {
          vm.departmentList = response.data.departmentList;
          departmentEmployeeListAll = response.data.employeeDepartmentList;
          return response.data;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    function getECORequestDeptApproval() {
      return ECORequestFactory.getECORequestDeptApproval().query({ ecoReqID: ecoReqID }).$promise.then((response) => {
        if (response && response.data) {
          return response.data;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    // get work order details
    const getWorkorderBasicDetails = () => {
      vm.headerdata = [];
      return MasterFactory.getWODetails().query({ woID: vm.woID }).$promise.then((response) => {
        if (response && response.data) {
          const workOrderDet = response.data;
          vm.isWoInSpecificStatusNotAllowedToChange = (workOrderDet.woStatus === CORE.WOSTATUS.TERMINATED || workOrderDet.woStatus === CORE.WOSTATUS.COMPLETED || workOrderDet.woStatus === CORE.WOSTATUS.VOID) ? true : false;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    function getEcoDetail() {
      var promises = [getEcoRequestHeaderDetail()];
      if (ecoReqID) {
        promises.push(getECORequest());
      }
      vm.cgBusyLoading = $q.all(promises).then((responses) => {
        //let getWorkorderDetailsResp = responses[0];
        let getECORequestResp = responses[1];
        if (getECORequestResp) {
          vm.ecoRequestModel = getECORequestResp;
          if (!vm.ecoRequestModel.finalStatusDate)
            vm.ecoRequestModel.finalStatusDate = new Date();

          vm.ecoRequestModel.initiateFullName = getECORequestResp.employee.fullName;
          if (vm.ecoRequestModel.finalStatusInit)
            vm.ecoRequestModel.finalStatusInitFullName = getECORequestResp.employee_finalStatusInit.fullName;
          else
            vm.ecoRequestModel.finalStatusInitFullName = loginUserFullName;

          var ecoRequestTypeValues = vm.ecoRequestModel.ecoRequestTypeValues;
          delete vm.ecoRequestModel.ecoRequestTypeValues;

          vm.status = vm.ecoRequestModel.status == "C";
          vm.requestFrom = vm.ecoRequestModel.custECONumber ? "CUST" : vm.InternalName;
          vm.requestFromNumber = vm.ecoRequestModel.custECONumber || vm.ecoRequestModel.FCAECONumber;
          vm.ecoRequestModelCopy = angular.copy(vm.ecoRequestModel);
          vm.requestFromNumberCopy = angular.copy(vm.requestFromNumber);
          vm.checkDirtyObject = {
            columnName: ["reasonForChange", "description", "comments", "isAllProductConf", "isFutureProd", "isTemp"],
            oldModelName: vm.ecoRequestModelCopy,
            newModelName: vm.ecoRequestModel
          }
        }
        vm.status = vm.ecoRequestModel.status == "C";
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    getEcoDetail();
    getEmployeeDeptApprovalDetails();
    if (vm.woID) {
      getWorkorderBasicDetails();
    }

    vm.isUserInDepartment = (deptItem) => {
      return isInDepartment(deptItem);
    }

    function deptOnSelectionCallback(selectedItem, deptItem) {
      deptItem.deptID = selectedItem ? selectedItem.deptID : null;
      var isInDept = false;

      for (var i = 0, len = departmentEmployeeListAll.length; i < len; i++) {
        var obj = departmentEmployeeListAll[i];
        if (obj.departmentID == deptItem.deptID) {
          if (deptItem.employeeID) {
            if (deptItem.employeeID == obj.employee.id) {
              isInDept = true;
            }
          }
          else if (vm.employeeDetails && obj.employee && vm.employeeDetails.id == obj.employee.id) {
            isInDept = true;
          }
        }
      }

      if (deptItem.deptID) {
        var isValidEmployeeList = _.some(deptItem.employeeList, function (item) { return item.departmentID != deptItem.deptID })
        if (isValidEmployeeList) {
          deptItem.employeeList = [];
        }
      }

      if (!isInDept) {
        deptItem.isAck = false;
        deptItem.initiateDate = null;
        deptItem.employeeFullName = null;
        deptItem.employeeID = null;
      }
    }

    /**
         * Create filter function for a query string
    */
    let createFilterFor = (query) => {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(contact) {
        return _.remove((angular.lowercase(contact.fullName).indexOf(lowercaseQuery) != -1), function (item) {
        });
      };
    }

    /**
    * Search for employees; use a random delay to simulate a remote call
    */
    vm.querySearch = (criteria, deptItem) => {
      if (!deptItem.deptID) {
        return [];
      }

      var employees = _.map(_.filter(departmentEmployeeListAll, { departmentID: deptItem.deptID }),
        function (item) {
          var employee = {
            fullName: item.employee.fullName,
            id: item.employee.id,
            departmentID: item.departmentID,
            isActive: item.employee.isActive,
          }
          return employee;
        }
      );
      var employees = employees.filter((x) => x.isActive);
      return criteria ? employees.filter(createFilterFor(criteria)) : [];
    }

    function isInDepartment(deptItem) {

      if (deptItem.employeeList.length) {
        var isAbleToEdit = _.some(deptItem.employeeList, function (item) { return item.id == vm.employeeDetails.id });
        return isAbleToEdit;
      }
      return false;
    }

    vm.depApprovalEditClicked = (deptItem) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      deptItem.isEditClicked = true;
    }

    vm.deptIsAckClicked = (deptItem) => {
      if (deptItem.isAck) {
        deptItem.initiateDate = new Date();
        deptItem.employeeFullName = loginUserFullName;
        deptItem.employeeID = vm.employeeDetails.id;
      }
      else {
        deptItem.initiateDate = null;
        deptItem.employeeFullName = null;
        deptItem.employeeID = null;
      }
    }


    vm.saveECORequestDeptApproval = (deptItem) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      var deptID = deptItem.autoCompleteDepartment.keyColumnId;

      if (deptItem.isAck) {
        if (!deptItem.initiateDate)
          return;

        var model = {
          employeeID: deptItem.employeeID,
          ecoReqID: ecoReqID,
          ecoDeptApprovalID: deptItem.ecoDeptApprovalID,
          deptID: deptID,
          partID: vm.partID,
          assyPN: vm.assemblyDetail.mfgPN,
          employeeID: deptItem.employeeID,
          initiateDate: deptItem.initiateDate ? $filter('date')(new Date(deptItem.initiateDate), vm.DefaultDateFormat) : null,
          comment: deptItem.comment,
          requestType: vm.ecoRequestModel.requestType,
          requestTypeName: vm.requestTypeName,
          woID: vm.woID,
          PIDCode: vm.assemblyDetail.PIDCode,
          woNumber: vm.ecoRequestModel.workOrder ? vm.ecoRequestModel.workOrder.woNumber : null,
          woVersion: vm.ecoRequestModel.workOrder ? vm.ecoRequestModel.workOrder.woVersion : null,
          nickName: vm.assemblyDetail.nickName
        };

        vm.cgBusyLoading = ECORequestFactory.ackECODepartmentApproval().save(model).$promise.then((response) => {
          if (response && response.data) {
            deptItem.isEditClicked = false;
            vm.employeeDepartmentForm.$setPristine();
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });

      }
      else {
        var index = vm.ecoDeptApprovedList.findIndex((x) => { return x.autoCompleteDepartment.keyColumnId == deptID && x.ecoDeptApprovalID != deptItem.ecoDeptApprovalID; });
        if (index != -1) {
          var model = {
            title: WORKORDER.ECO_DEPARTMENT_APPROVAL
          };
          DialogFactory.alertDialog(model)
          return;
        }

        var employeeIds = deptItem.employeeList.map((item) => item.id);
        var model = {
          ecoReqID: ecoReqID,
          ecoDeptApprovalID: deptItem.ecoDeptApprovalID,
          deptID: deptID,
          partID: vm.partID,
          employeeIds: employeeIds,
          assyPN: vm.assemblyDetail.mfgPN,
          ecoNumber: vm.ecoRequestModel.ecoNumber,
          requestType: vm.ecoRequestModel.requestType,
          requestTypeName: vm.requestTypeName,
          woID: vm.woID,
          PIDCode: vm.assemblyDetail.PIDCode,
          woNumber: vm.ecoRequestModel.workOrder ? vm.ecoRequestModel.workOrder.woNumber : null,
          woVersion: vm.ecoRequestModel.workOrder ? vm.ecoRequestModel.workOrder.woVersion : null,
          nickName: vm.assemblyDetail.nickName
        };

        vm.cgBusyLoading = ECORequestFactory.saveECORequestDeptApproval().save(model).$promise.then((response) => {
          if (response && response.data) {
            if (!deptItem.ecoDeptApprovalID) {
              deptItem.ecoDeptApprovalID = response.data.data.ecoDeptApprovalID;
              if (vm.employeeDetails.id == vm.ecoRequestModel.initiateBy)
                addEmptyDeptApproval();
              vm.employeeDepartmentForm.$setPristine();
            }
            deptItem.isEditClicked = false;
            deptItem.deptID = deptID;
            deptItem.employeeID = model.employeeID;
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }

    vm.deleteECORequestDeptApproval = (deptItem) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      let obj = {
        title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, "ECO request department"),
        textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_MESSAGE, "1", "ECO request department"),
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.confirmDiolog(obj).then((yes) => {
        if (yes) {
          vm.cgBusyLoading = ECORequestFactory.deleteECORequestDeptApproval().delete({
            ecoDeptApprovalID: deptItem.ecoDeptApprovalID,
            partID: vm.partID,
            assyPN: vm.assemblyDetail.mfgPN,
            ecoNumber: vm.ecoRequestModel.ecoNumber,
            ecoReqID: vm.ecoRequestModel.ecoReqID
          }).$promise.then(() => {
            var index = vm.ecoDeptApprovedList.indexOf(deptItem);
            if (index != -1) {
              vm.ecoDeptApprovedList.splice(index, 1);
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }

      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.gotoDepartment = () => {
      BaseService.openInNew(USER.ADMIN_DEPARTMENT_STATE, {});
    }
    vm.gotoPersonal = () => {
      BaseService.goToPersonnelList();
    }
    //close popup on page destroy 
    $scope.$on('$destroy', function () {
      $mdDialog.hide(false, { closeAll: true });
    });

    /* called for max date validation */
    vm.getMaxDateValidation = (FromDateLabel, ToDateLabel) => {
      return BaseService.getMaxDateValidation(FromDateLabel, ToDateLabel);
    }
    /* called for min date validation */
    vm.getMinDateValidation = (FromDateLabel, ToDateLabel) => {
      return BaseService.getMinDateValidation(FromDateLabel, ToDateLabel);
    }

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPageForms = [vm.employeeDepartmentForm];
    });

    /** Validate max size */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    };
  }
})();
