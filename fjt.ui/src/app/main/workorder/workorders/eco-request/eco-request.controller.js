(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ECORequestController', ECORequestController);

  /** @ngInject */
  function ECORequestController($scope, $mdDialog, $state, $stateParams, $filter, $q, USER, CORE, DASHBOARD, REPORTS, DialogFactory,
    DepartmentFactory, EmployeeFactory, ECORequestFactory, WorkorderFactory, GenericCategoryFactory, ComponentFactory, BaseService, MasterFactory, $timeout, ReceivingMaterialFactory, WORKORDER, WorkorderOperationFactory) {  // eslint-disable-line func-names
    const vm = this;
    vm.requestType = WORKORDER.ECO_REQUEST_TYPE;
    vm.InternalName = angular.copy(CORE.FCA.Name).toUpperCase();
    vm.CustomerECO = angular.copy(CORE.workOrderECORequestType.CustomerECO).toUpperCase();
    vm.FCAECO = angular.copy(CORE.workOrderECORequestType.FCAECO).toUpperCase();
    vm.CustomerDFM = angular.copy(CORE.workOrderECORequestType.CustomerDFM).toUpperCase();
    vm.FCADFM = angular.copy(CORE.workOrderECORequestType.FCADFM).toUpperCase();
    vm.PartCategory = CORE.PartCategory;
    vm.categoryArray = CORE.CategoryTypeLabel;
    vm.woStatusDetail = CORE.WorkOrderStatus;
    vm.employeeDetails = BaseService.loginUser.employee;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.ECODFMType = CORE.CategoryType.ECO_DFMType;
    vm.lebelConstant = CORE.LabelConstant;

    if (!vm.employeeDetails) {
      $state.go(DASHBOARD.DASHBOARD_STATE);
      DialogFactory.alertDialog({ title: CORE.MESSAGE_CONSTANT.ALERT_HEADER, textContent: CORE.MESSAGE_CONSTANT.USER_EMPLOYEE_DETAIL, multiple: true });
      return;
    }

    vm.WOAllLabelConstant = CORE.LabelConstant.Workorder;
    vm.assemblyAllLabelConstant = CORE.LabelConstant.Assembly;
    var loginUserFullName = vm.employeeDetails.firstName + ' ' + vm.employeeDetails.lastName;
    vm.woID = $stateParams.woID;
    vm.partID = parseInt($stateParams.partID);
    var ecoReqID = $stateParams.ecoReqID;
    vm.id = ecoReqID;
    vm.workOrder = {};
    vm.category = CORE.ECOTypeCategory;
    vm.ecoRequestFinalStatus = WORKORDER.ECO_REQUEST_FINAL_STATUS;
    vm.dfmRequestFinalStatus = WORKORDER.ECO_REQUEST_FINAL_STATUS;
    vm.ECOImplementTo = WORKORDER.ECO_REQUEST_IMPLEMENT_TO;
    vm.RadioGroup = {
      isActive: {
        array: CORE.ActiveRadioGroup
      }
    }
    vm.entity = CORE.AllEntityIDS.ECORequest.Name;
    vm.EmployeeList = [];
    vm.status = true;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.taToolbar = CORE.Toolbar;
    vm.ecoReqDeptApprovalEmptyState = WORKORDER.WORKORDER_EMPTYSTATE.ECO_REQUEST_DEPT_APPROVAL_LIST;
    if (vm.RadioGroup.isActive.array)
      $scope.$parent.$parent.vm.ECOStatus = vm.RadioGroup.isActive.array[0].Key;
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
      woID: vm.woID ? parseInt(vm.woID) : null,
      finalStatusDate: new Date(),
      initiateBy: vm.employeeDetails.id,
      finalStatusInit: vm.employeeDetails.id,
      initiateFullName: loginUserFullName,
      finalStatusInitFullName: loginUserFullName,
      finalStatus: vm.ecoRequestFinalStatus.Pending.Value,
      isAllProductConf: false,
      isFutureProd: false,
      isTemp: false,
      fromPartID: vm.partID
    };
    $scope.$parent.$parent.vm.ECOFinalStatus = vm.ecoRequestModel.requestType == vm.requestType.ECO.Value ? vm.ecoRequestFinalStatus.Pending.Name : vm.dfmRequestFinalStatus.Pending.Name;
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
    vm.requestFrom = vm.ecoRequestModel.requestType == vm.requestType.ECO.Value ? "CUST" : vm.InternalName;

    vm.ecoCategoryList = [];

    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.placeHolderFormat = angular.copy(vm.DefaultDateFormat).toUpperCase();
    vm.locale = {
      formatDate: function (date) {
        return $filter('date')(date, vm.DefaultDateFormat);
      }
    };
    /* add ECOCategory Attribute */
    vm.addEditRecord = (data, ev) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      vm.disableEcoattributeButton = true;
      data = {
        categoryType: vm.categoryArray[0].id,
        ecoTypeCatID: data.ecoTypeCatID
      };
      DialogFactory.dialogService(
        USER.ADMIN_ECO_CATEGORY_VALUES_ADD_UPDATE_MODAL_CONTROLLER,
        USER.ADMIN_ECO_CATEGORY_VALUES_ADD_UPDATE_MODAL_VIEW,
        ev,
        data).then((data) => {
          vm.disableEcoattributeButton = false;
          getECOCategoryWithValues();
        }, (cancel) => {
          vm.disableEcoattributeButton = false;
        }, (err) => {
          vm.disableEcoattributeButton = false;
          return BaseService.getErrorLog(err);
        });
    }
    /* add ECO Category */
    vm.addECOCategory = (item, ev) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }

      vm.disableEcoCategoryButton = true;
      let data = {};
      if (item) {
        data = item;
        data.categoryType = vm.categoryArray[0].id;
      } else {
        data = {
          categoryType: vm.categoryArray[0].id
        };
      }
      DialogFactory.dialogService(
        USER.ADMIN_ECO_CATEGORY_ADD_UPDATE_MODAL_CONTROLLER,
        USER.ADMIN_ECO_CATEGORY_ADD_UPDATE_MODAL_VIEW,
        ev,
        data).then((data) => {
          vm.disableEcoCategoryButton = false;
          getECOCategoryWithValues();

        }, (cancel) => {
          vm.disableEcoCategoryButton = false;
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
      $timeout(() => {
        vm.disableStockStatusButton = false;
      })
    };
    /* for down arrow key open date-picker */
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.IsPickerOpen = {};
    vm.IsPickerOpen[vm.DATE_PICKER.initiateDate] = false;
    vm.IsPickerOpen[vm.DATE_PICKER.finalStatusDate] = false;

    // Assembly
    vm.goToAssemblyList = (data) => {
        BaseService.goToPartList();
      return false;
    }
    vm.goToAssemblyDetails = (data) => {
        BaseService.goToComponentDetailTab(null, data.partID);
      return false;
    }

    // Get Work order list by assyID
    function getWorkOrderListByAssyID() {
      let model = {
        assyID: vm.partID
      }
      let woStatusDetail = [];
      _.each(vm.woStatusDetail, (objWostatus) => {
        if (objWostatus.Key == '0' || objWostatus.Key == '1' || objWostatus.Key == '5' || objWostatus.Key == '6' || objWostatus.Key == '8') {
          woStatusDetail.push(objWostatus.Key);
        }
      })
      model.woSubStatus = woStatusDetail;
      return WorkorderFactory.getWorkOrderListByAssyID().query(model).$promise.then((response) => {
        vm.WoList = response.data;
        return vm.WoList;
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    }
    function bindWODetail(item) {
      if (item && $scope.$parent.$parent.vm.ecorequesrDetail && $scope.$parent.$parent.vm.ecorequesrDetail.workOrder) {
        $scope.$parent.$parent.vm.ecorequesrDetail.workOrder.woNumber = item.woNumber;
        $scope.$parent.$parent.vm.ecorequesrDetail.workOrder.woVersion = item.woVersion;
        $scope.$parent.$parent.vm.ecorequesrDetail.workOrder.wostatus = _.find(vm.woStatusDetail, x => x.Key == item.woStatus);
        $scope.$parent.$parent.vm.class = vm.getWoStatusClassName(item.woStatus);
      }
      vm.workOrder = item;
      if (vm.woStatusDetail && vm.woStatusDetail.length > 6 && (vm.workOrder.woStatus == vm.woStatusDetail[5].Key || vm.workOrder.woStatus == vm.woStatusDetail[6].Key)) {
        vm.isWOTerminated = true;
        vm.ECOImplementTo.Same_WorkOrder.isDisabled = true;
        if (vm.ecoRequestModel.ECOImplemetTo == vm.ECOImplementTo.Same_WorkOrder.Value)
          vm.ecoRequestModel.ECOImplemetTo = vm.ECOImplementTo.New_WorkOrder.Value;
      }
      //vm.isWoInSpecificStatusNotAllowedToChange = (vm.workOrder.woStatus === CORE.WOSTATUS.TERMINATED || vm.workOrder.woStatus === CORE.WOSTATUS.COMPLETED || vm.workOrder.woStatus === CORE.WOSTATUS.VOID) ? true : false;

      if (vm.workOrder.WoSalesOrderDetails && vm.workOrder.WoSalesOrderDetails.length > 0) {
        vm.workOrder.WoSalesOrderDetails = _.first(vm.workOrder.WoSalesOrderDetails);
      }
      getWorkOrderOperation(item);
      if (vm.ecoRequestModel.ECOImplemetTo == vm.ECOImplementTo.Same_WorkOrder.Value) {
        getImplementToWOOperation(item.woID);
      }
      if (!ecoReqID)
        generateECODFMNumber(item.woID);
    }
    // get selected work order detail
    function getWODetail(item) {
      if (item) {
        if (vm.ecoRequestModel.ECOImplemetTo == vm.ECOImplementTo.New_WorkOrder.Value && vm.autoCompleteImplementTOWorkorder && vm.autoCompleteImplementTOWorkorder.keyColumnId == item.woID) {
          let obj = {
            title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
            textContent: WORKORDER.ECO.WORKORDER_USE_IN_APPLIES_TO,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.confirmDiolog(obj).then((yes) => {
            if (yes) {
              vm.autoCompleteImplementTOWorkorder.keyColumnId = null;
              vm.autoCompleteImplementTOWoOperation.keyColumnId = null;
              $scope.$broadcast(vm.autoCompleteImplementTOWorkorder.inputName + "searchText", null);
              $scope.$broadcast(vm.autoCompleteImplementTOWoOperation.inputName + "searchText", null);
              bindWODetail(item);
            }
          }, (cancel) => {
            vm.autoCompleteWorkorder.keyColumnId = null;
            $scope.$broadcast(vm.autoCompleteWorkorder.inputName + "searchText", null);
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        } else {
          bindWODetail(item);
        }
      } else {
        let woHeaderDetail = _.find($scope.$parent.$parent.vm.headerdata, (item) => { return item.label == vm.WOAllLabelConstant.WO; });
        let woVersionHeaderDetail = _.find($scope.$parent.$parent.vm.headerdata, (item) => { return item.label == vm.WOAllLabelConstant.Version; });
        if (woHeaderDetail) {
          $scope.$parent.$parent.vm.headerdata.splice($scope.$parent.$parent.vm.headerdata.indexOf(woHeaderDetail), 1);

        }
        if (woVersionHeaderDetail) {
          $scope.$parent.$parent.vm.headerdata.splice($scope.$parent.$parent.vm.headerdata.indexOf(woVersionHeaderDetail), 1);
        }
        if (!ecoReqID)
          generateECODFMNumber(vm.woID);
        vm.autoCompleteWorkorder.keyColumnId = null;
        $scope.$broadcast(vm.autoCompleteWorkorder.inputName + "searchText", null);
        vm.autoCompleteRequestedOperation.keyColumnId = null;
        $scope.$broadcast(vm.autoCompleteRequestedOperation.inputName + "searchText", null);
        vm.workOrder = null;
        vm.isWOTerminated = false;
        vm.ECOImplementTo.Same_WorkOrder.isDisabled = false;
      }
    }
    // get work order operation detail
    function getWorkOrderOperation(workorder) {
      let woID = workorder ? workorder.woID : vm.autoCompleteWorkorder.keyColumnId;
      return WorkorderOperationFactory.retriveOPListbyWoID().query({ woID: woID }).$promise.then((response) => {
        if (response && response.data) {
          vm.workOrderOperationList = response.data;
          _.each(vm.workOrderOperationList, (item) => {
            item.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, item.opName, item.opNumber)
          })
          return vm.workOrderOperationList;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    // get work order detail 
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

    // get selected work order
    let getWorkorderDetails = (woID) => {
      vm.headerdata = [];
      return WorkorderFactory.workorder().query({ id: woID }).$promise.then((response) => {
        if (response && response.data) {
          vm.workOrder = _.first(response.data);
          if (vm.workOrder && vm.workOrder.componentAssembly) {
            vm.workOrder.PIDCode = vm.workOrder.componentAssembly.PIDCode;
            vm.workOrder.mfgPN = vm.workOrder.componentAssembly.mfgPN;
            vm.workOrder.nickName = vm.workOrder.componentAssembly.nickName;
          }
          if (vm.workOrder && vm.workOrder.rohs) {
            vm.workOrder.rohsIcon = vm.workOrder.rohs.rohsIcon;
            vm.workOrder.rohsStatus = vm.workOrder.rohs.name;
          }
          if (vm.woStatusDetail && vm.woStatusDetail.length > 6 && (vm.workOrder.woStatus == vm.woStatusDetail[5].Key || vm.workOrder.woStatus == vm.woStatusDetail[6].Key)) {
            vm.isWOTerminated = true;
            vm.ECOImplementTo.Same_WorkOrder.isDisabled = true;
          }
          if (vm.workOrder && vm.workOrder.WoSalesOrderDetails.length > 0) {
            vm.workOrder.WoSalesOrderDetails = _.first(vm.workOrder.WoSalesOrderDetails);
          }
          vm.ecoRequestModel.fromPartID = vm.partID;
          //vm.isWoInSpecificStatusNotAllowedToChange = (vm.workOrder.woStatus === CORE.WOSTATUS.TERMINATED || vm.workOrder.woStatus === CORE.WOSTATUS.COMPLETED || vm.workOrder.woStatus === CORE.WOSTATUS.VOID) ? true : false;
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

    let getECOCategoryWithValues = () => {
      let categoyLabel = _.first(vm.category).value;
      let category = _.find(vm.category, (item) => { return item.value == categoyLabel; }).id;
      if (category)
        return ECORequestFactory.getECOCategoryWithValues().query({ category: category }).$promise.then((response) => {
          vm.ecoCategoryList = response.data;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
    }

    // generate ECO/DFM Number
    function generateECODFMNumber(woID) {
      return ECORequestFactory.generateDFMNumber().query({ woID: woID, requestType: vm.ecoRequestModel.requestType }).$promise.then((response) => {
        if (response && response.data) {
          vm.ecoRequestModel.ecoNumber = response.data.DFMNumber.length > 0 ? response.data.DFMNumber[0] : null;
          vm.requestFromNumber = vm.ecoRequestModel.requestType == vm.requestType.DFM.Value ? vm.ecoRequestModel.ecoNumber : null;
          return;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    // get list of ECO/DFM Type generic master
    let getECODFMTypeList = () => {
      let GencCategoryType = [];
      GencCategoryType.push(vm.ECODFMType.Name);
      let listObj = {
        GencCategoryType: GencCategoryType,
        isActive: vm.id ? true : false
      }
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((genericCategories) => {
        if (genericCategories && genericCategories.data) {
          let GenericCategoryAllData = genericCategories.data;
          vm.ECODFMTypeList = _.filter(GenericCategoryAllData, (item) => {
            return item.parentGencCategoryID == null && item.categoryType == vm.ECODFMType.Name;
          });
        } else {
          vm.ECODFMTypeList = [];
        }
        return $q.resolve(vm.ECODFMTypeList);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    // get List of Mounting 
    let mountingType = () => {
      return ComponentFactory.getMountingTypeList().query().$promise.then((res) => {
        if (res && res.data) {
          vm.mountingTypeList = res.data;
        } else {
          vm.mountingTypeList = [];
        }
        return vm.mountingTypeList;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    // get Work order list for implement ECO
    function getImplementToWorkorderList() {
      let model = {
        woID: vm.ecoRequestModel.woID ? vm.ecoRequestModel.woID : vm.autoCompleteWorkorder ? vm.autoCompleteWorkorder.keyColumnId : null,
        partID: vm.ecoRequestModel.fromPartID
      }
      if (vm.ecoRequestModel.ECOImplemetTo == vm.ECOImplementTo.New_WorkOrder.Value) {
        let woStatusDetail = [];
        _.each(vm.woStatusDetail, (objWostatus) => {
          if (objWostatus.Key == '0' || objWostatus.Key == '1' || objWostatus.Key == '5' || objWostatus.Key == '8') {
            woStatusDetail.push(objWostatus.Key);
          }
        })
        model.woStatus = woStatusDetail;
      }
      return ECORequestFactory.getImplementToWorkorderList().query(model).$promise.then((response) => {
        if (response && response.data) {
          vm.ImplementToWOList = response.data;
          if (vm.ecoRequestModel.ECOImplemetTo == vm.ECOImplementTo.Terminate_Transfer.Value) {
            getImplementToWOOperation();
          }
          return $q.resolve(vm.ImplementToWOList);
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    // get detail of selected implement to work order
    function getImplementToWODetail(item) {
      if (item) {
        getImplementToWOOperation(item.woID);
      } else {
        vm.ImplementToWOOperationList = [];
        vm.autoCompleteImplementTOWoOperation.keyColumnId = null;
        $scope.$broadcast(vm.autoCompleteImplementTOWoOperation.inputName + "searchText", null);
      }
    }

    // get list of operation of Implement to Work order
    function getImplementToWOOperation(woID) {
      let workorderID = null;
      if (woID) {
        workorderID = woID;
      } else if (vm.ecoRequestModel.ECOImplemetTo == vm.ECOImplementTo.Same_WorkOrder.Value) {
        workorderID = vm.autoCompleteWorkorder.keyColumnId;
      } else if (vm.ecoRequestModel.ECOImplemetTo == vm.ECOImplementTo.New_WorkOrder.Value) {
        workorderID = (vm.ecoRequestModel.implemetToWOID ? vm.ecoRequestModel.implemetToWOID : vm.ImplementToWOList && vm.ImplementToWOList.length > 0) ? vm.ImplementToWOList[0].woID : null;
      }
      else if (vm.ecoRequestModel.ECOImplemetTo == vm.ECOImplementTo.Terminate_Transfer.Value) {
        workorderID = (vm.ImplementToWOList && vm.ImplementToWOList.length > 0) ? vm.ImplementToWOList[0].woID : null;
      }
      if (workorderID) {
        return WorkorderOperationFactory.retriveOPListbyWoID().query({ woID: workorderID }).$promise.then((response) => {
          if (response && response.data) {
            vm.ImplementToWOOperationList = response.data;
            _.each(vm.ImplementToWOOperationList, (item) => {
              item.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, item.opName, item.opNumber)
            })
            return $q.resolve(vm.ImplementToWOOperationList);
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }

    if (vm.woID) {
      getWorkorderBasicDetails();
    }

    function getEcoDetail() {
      var promises = [getECOCategoryWithValues(), getECODFMTypeList(), mountingType(), getWorkOrderListByAssyID()];
      if (ecoReqID) {
        promises.push(getECORequest());
      }

      vm.cgBusyLoading = $q.all(promises).then((responses) => {
        //let getWorkorderDetailsResp = responses[0];
        let getECOCategoryWithValuesResp = responses[0];

        let getECORequestResp = responses[4];
        if (getECORequestResp) {
          getECORequestResp.initiateDate = BaseService.getUIFormatedDate(getECORequestResp.initiateDate, vm.DefaultDateFormat);
        }
        getComponentAssyList(vm.partID);
        var bindImplemetTopromises = [];
        if (getECORequestResp) {
          if (getECORequestResp.woID) {
            getWorkorderDetails(getECORequestResp.woID);
          }
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

          ecoRequestTypeValues.forEach((x) => {
            for (var i = 0, len = vm.ecoCategoryList.length; i < len; i++) {
              var item = vm.ecoCategoryList[i];
              if (item.ecoTypeCatID == x.ecoTypeCatID) {
                var obj = item.ecoTypeValues.find((y) => { return y.ecoTypeValID == x.ecoTypeValID });
                if (obj) {
                  obj.selected = true;
                  if (obj.noteRequired && x.note)
                    obj.note = x.note;
                }
                break;
              }
            }
          });
          vm.status = vm.ecoRequestModel.status == "C";

          if (vm.status) {
            if (vm.RadioGroup.isActive.array)
              $scope.$parent.$parent.vm.ECOStatus = vm.RadioGroup.isActive.array[0].Key;
          } else {
            if (vm.RadioGroup.isActive.array)
              $scope.$parent.$parent.vm.ECOStatus = vm.RadioGroup.isActive.array[1].Key;
          }
          vm.requestFrom = vm.ecoRequestModel.custECONumber ? "CUST" : vm.InternalName;
          vm.requestFromNumber = vm.ecoRequestModel.custECONumber || vm.ecoRequestModel.FCAECONumber;
          vm.ecoRequestModelCopy = angular.copy(vm.ecoRequestModel);
          vm.requestFromNumberCopy = angular.copy(vm.requestFromNumber);
          vm.checkDirtyObject = {
            columnName: ["reasonForChange", "description", "comments", "isAllProductConf", "isFutureProd", "isTemp"],
            oldModelName: vm.ecoRequestModelCopy,
            newModelName: vm.ecoRequestModel
          }
          switch (vm.ecoRequestModel.finalStatus) {
            case vm.ecoRequestModel.requestType == vm.requestType.ECO.Value ? vm.ecoRequestFinalStatus.Pending.Value : vm.dfmRequestFinalStatus.Pending.Value:
              $scope.$parent.$parent.vm.ECOFinalStatus = vm.ecoRequestModel.requestType == vm.requestType.ECO.Value ? vm.ecoRequestFinalStatus.Pending.Name : vm.dfmRequestFinalStatus.Pending.Name;
              break;
            case vm.ecoRequestModel.requestType == vm.requestType.ECO.Value ? vm.ecoRequestFinalStatus.Accept.Value : vm.dfmRequestFinalStatus.Accept.Value:
              $scope.$parent.$parent.vm.ECOFinalStatus = vm.ecoRequestModel.requestType == vm.requestType.ECO.Value ? vm.ecoRequestFinalStatus.Accept.Name : vm.dfmRequestFinalStatus.Accept.Name;
              break;
            case vm.ecoRequestModel.requestType == vm.requestType.ECO.Value ? vm.ecoRequestFinalStatus.Reject.Value : vm.dfmRequestFinalStatus.Reject.Value:
              $scope.$parent.$parent.vm.ECOFinalStatus = vm.ecoRequestModel.requestType == vm.requestType.ECO.Value ? vm.ecoRequestFinalStatus.Reject.Name : vm.dfmRequestFinalStatus.Reject.Name;
              break;
          }
          if (vm.ecoRequestModel.woID) {
            bindImplemetTopromises.push(getWorkOrderOperation(vm.ecoRequestModel));
          }
          if (vm.ecoRequestModel.finalStatus == vm.ecoRequestFinalStatus.Accept.Value) {
            bindImplemetTopromises.push(getImplementToWorkorderList());
            bindImplemetTopromises.push(getImplementToWOOperation(vm.ecoRequestModel.implemetToWOID));
          }

        }
        if (!ecoReqID)
          generateECODFMNumber(vm.woID);
        vm.cgBusyLoading = $q.all(bindImplemetTopromises).then((responses) => {
          initImplementToWoAutoComplete();
          initWoAutocomplete();
          vm.autoCompleteWorkorder.keyColumnId = parseInt(vm.ecoRequestModel.woID) || null;
          vm.autoCompleteRequestedOperation.keyColumnId = vm.ecoRequestModel.requestedWOOPID || null;
        })

      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    // get assembly list
    function getComponentAssyList(partID) {
      if (!partID) { partID = vm.partID }
      return ReceivingMaterialFactory.getSubAssemblyOnAssembly().query({ id: partID }).$promise.then((response) => {
        vm.assyList = response.data;
        initAutoCompleteAssy();
        $timeout(() => {
          vm.autoCompleteAssy.keyColumnId = vm.partID;
          if (vm.ecoRequestModel.requestType == vm.requestType.DFM.Value && vm.workOrder) {
            vm.ecoRequestModel.toPartID = vm.partID;
          } else {
            if (ecoReqID) {
              vm.autoCompleteAssy.keyColumnId = vm.ecoRequestModel.toPartID;
            }
          }
        })
        return vm.assyList;
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    }

    getEcoDetail();

    let initAutoCompleteAssy = () => {
      vm.autoCompleteAssy = {
        columnName: 'PIDCode',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.ecoRequestModel.toPartID || null,
        inputName: 'Assembly',
        placeholderName: 'Assy ID',
        isRequired: true,
        isAddnew: true,
        isDisabled: false,
        callbackFn: getComponentAssyList,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: vm.PartCategory.SubAssembly,
          customerID: vm.workOrder ? vm.workOrder.customerID : null,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName
        },
        onSelectCallbackFn: function (item) {
          if (!item) {
            vm.PIDCode = null;
          }
          else {
            vm.PIDCode = item.PIDCode;
          }
        }
      }
      vm.defaultAutoCompleteECODFMType = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.ecoRequestModel ? vm.ecoRequestModel.ecoDfmTypeID : null,
        inputName: vm.ECODFMType.Name,
        placeholderName: vm.ECODFMType.Title,
        addData: {
          headerTitle: vm.ECODFMType.Title,
          popupAccessRoutingState: [USER.ADMIN_ECO_DFM_TYPE_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: stringFormat(CORE.Manage_PageName_Title_Format, CORE.CategoryType.ECO_DFMType.Title)

        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getECODFMTypeList,
      }
      vm.defaultAutoCompleteMountingType = {
        columnName: 'name',
        keyColumnName: 'id',
        controllerName: USER.ADMIN_MOUNTING_TYPE_ADD_UPDATE_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_MOUNTING_TYPE_ADD_UPDATE_MODAL_VIEW,
        keyColumnId: vm.ecoRequestModel ? vm.ecoRequestModel.mountingTypeID : null,
        inputName: 'Mounting Type',
        placeholderName: 'Mounting Type',
        isRequired: true,
        isAddnew: true,
        callbackFn: mountingType
      }
    };
    let initWoAutocomplete = () => {
      vm.autoCompleteWorkorder = {
        columnName: 'woNumber',
        keyColumnName: 'woID',
        keyColumnId: vm.ecoRequestModel ? vm.ecoRequestModel.woID : null,
        inputName: 'Workorder',
        placeholderName: 'Workorder',
        isRequired: false,
        isAddnew: false,
        callbackFn: getWorkOrderListByAssyID,
        onSelectCallbackFn: getWODetail
      }
      vm.autoCompleteRequestedOperation = {
        columnName: 'opFullName',
        keyColumnName: 'woOPID',
        keyColumnId: vm.ecoRequestModel ? vm.ecoRequestModel.requestedWOOPID : null,
        inputName: 'Workorder Operation',
        placeholderName: 'Workorder Operation',
        isRequired: false,
        isAddnew: false,
        callbackFn: getWorkOrderOperation,
      }
    }
    let initImplementToWoAutoComplete = () => {
      vm.autoCompleteImplementTOWorkorder = {
        columnName: 'woNumber',
        keyColumnName: 'woID',
        keyColumnId: vm.ecoRequestModel ? vm.ecoRequestModel.implemetToWOID : null,
        inputName: 'Implement To Workorder',
        placeholderName: 'Implement To Workorder',
        isRequired: true,
        isAddnew: false,
        callbackFn: getImplementToWorkorderList,
        onSelectCallbackFn: getImplementToWODetail
      }
      vm.autoCompleteImplementTOWoOperation = {
        columnName: 'opFullName',
        keyColumnName: 'woOPID',
        keyColumnId: vm.ecoRequestModel ? vm.ecoRequestModel.woOPID : null,
        inputName: 'Implement To Workorder Operation',
        placeholderName: 'Implement To Workorder Operation',
        isRequired: true,
        isAddnew: false,
        callbackFn: getImplementToWOOperation
      }
    }

    function validateECORequest() {
      if (vm.ecoRequestModel.finalStatus == vm.ecoRequestFinalStatus.Accept.Value) {
        if (vm.ecoRequestModel.ECOImplemetTo == vm.ECOImplementTo.Same_WorkOrder.Value) {
          if (vm.isWOTerminated) {
            DialogFactory.alertDialog({
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: WORKORDER.ECO.WORKORDER_IS_TERMINATED,
              multiple: true
            });
            return true;
          } else {
            if (vm.autoCompleteImplementTOWoOperation && !vm.autoCompleteImplementTOWoOperation.keyColumnId) {
              DialogFactory.alertDialog({
                title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                textContent: stringFormat(WORKORDER.ECO.WORKORDER_OPERATION_IS_NOT_SELECTED, vm.ecoRequestModel.requestType == vm.requestType.DFM.Value ? "DFM" : "ECO"),
                multiple: true
              });
              return true;
            } else {
              return false;
            }
          }
        } else if (vm.ecoRequestModel.ECOImplemetTo == vm.ECOImplementTo.New_WorkOrder.Value) {
          if (vm.ImplementToWOList && vm.ImplementToWOList.length == 0) {
            DialogFactory.alertDialog({
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: stringFormat(WORKORDER.ECO.WORKORDER_NOT_AVAILABLE, vm.ecoRequestModel.requestType == vm.requestType.DFM.Value ? "DFM" : "ECO"),
              multiple: true
            });
            return true;
          } else if (vm.ImplementToWOOperationList && vm.ImplementToWOOperationList.length == 0) {
            DialogFactory.alertDialog({
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: stringFormat(WORKORDER.ECO.WORKORDER_OPERATION_NOT_AVAILABLE, vm.ecoRequestModel.requestType == vm.requestType.DFM.Value ? "DFM" : "ECO"),
              multiple: true
            });
            return true;
          } else {
            if (vm.autoCompleteImplementTOWoOperation && !vm.autoCompleteImplementTOWoOperation.keyColumnId) {
              DialogFactory.alertDialog({
                title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                textContent: stringFormat(WORKORDER.ECO.WORKORDER_OPERATION_IS_NOT_SELECTED, vm.ecoRequestModel.requestType == vm.requestType.DFM.Value ? "DFM" : "ECO"),
                multiple: true
              });
              return true;
            } else {
              return false;
            }
          }
        } else if (vm.ecoRequestModel.ECOImplemetTo == vm.ECOImplementTo.Terminate_Transfer.Value) {
          if (!vm.isWOTerminated) {
            DialogFactory.alertDialog({
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: WORKORDER.ECO.WORKORDER_IS_NOT_TERMINATED,
              multiple: true
            });
            return true;
          } else {
            if (vm.ImplementToWOList && vm.ImplementToWOList.length == 0) {
              DialogFactory.alertDialog({
                title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                textContent: WORKORDER.ECO.WORKORDER_STOCK_IS_NOT_TRANSFERED,
                multiple: true
              });
              return true;
            } else if (vm.ImplementToWOOperationList && vm.ImplementToWOOperationList.length == 0) {
              DialogFactory.alertDialog({
                title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                textContent: WORKORDER.ECO.WORKORDER_STOCK_IS_NOT_TRANSFERED,
                multiple: true
              });
              return true;
            } else {
              return false;
            }
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    }

    $scope.$on('SaveECORequest', (ev) => {
      vm.checkNextWizard(true, true);
    });
    /* Show save alert popup when performing next and previous*/
    function showWithoutSavingAlertforNextPrevious(msWizard, isSave, isChanged, isPrevious, $event) {
      if (isSave && isChanged) {
        if (vm.ecoRequestForm.$valid) {
          vm.saveECORequest(null, $event);
        }
      } else if (isSave && !isChanged) {
        return;
      }
      else {
        if (isChanged) {
          let obj = {
            title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
            textContent: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_BODY_MESSAGE,
            btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.confirmDiolog(obj).then((yes) => {
            if (yes) {
              getEcoDetail();
              vm.ecoRequestForm.$setPristine();
            }
          }, (cancel) => {
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
      }
    }
    vm.checkFormDirty = (form, columnName) => {
      let result = form.$dirty;
      $scope.$parent.$parent.vm.formdirty = result;
      return result;
    }

    vm.checkNextWizard = (isUnique, isSave, $event) => {
      if (BaseService.focusRequiredField(vm.ecoRequestForm)) {
        return;
      }
      let isChanged = false;
      isChanged = BaseService.checkFormDirty(vm.ecoRequestForm, vm.checkDirtyObject) || vm.ecoRequestForm.$dirty;
      showWithoutSavingAlertforNextPrevious(null, isSave, isChanged, false, $event);
    }

    let createFilterFor = (query) => {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(contact) {
        return _.remove((angular.lowercase(contact.fullName).indexOf(lowercaseQuery) != -1), function (item) {
        });
      };
    }

    vm.saveECORequest = (msWizard, $event) => {
      if (validateECORequest()) {
        return;
      } else {
        vm.ecoRequestModel.ecoTypeValuesList = [];

        _.each(vm.ecoCategoryList, function (item) {
          _.each(item.ecoTypeValues, function (values) {
            if (values.selected) {
              vm.ecoRequestModel.ecoTypeValuesList.push(values);
            }
          });
        });

        vm.ecoRequestModel.status = vm.status ? 'C' : 'P';
        vm.ecoRequestModel.ecoNumber = vm.ecoRequestModel.ecoNumber.toUpperCase();
        vm.ecoRequestModel.fromPartID = vm.partID;
        vm.ecoRequestModel.toPartID = vm.autoCompleteAssy.keyColumnId;

        if (vm.requestFrom == "CUST") {
          vm.ecoRequestModel.custECONumber = vm.requestFromNumber.toUpperCase();
          vm.ecoRequestModel.FCAECONumber = null;
        }
        else {
          vm.ecoRequestModel.FCAECONumber = vm.requestFromNumber.toUpperCase();
          vm.ecoRequestModel.custECONumber = null;
        }

        if (vm.ecoRequestModel.status != 'P') {
          vm.ecoRequestModel.finalStatusInit = vm.employeeDetails.id;
        }

        if (vm.ecoRequestModel.finalStatus == vm.ecoRequestFinalStatus.Reject.Value && !vm.ecoRequestModel.finalStatusReason) {
          return;
        }

        if (vm.ecoRequestModel.finalStatus == vm.ecoRequestFinalStatus.Accept.Value) {
          if (vm.ecoRequestModel.ECOImplemetTo == vm.ECOImplementTo.Same_WorkOrder.Value) {
            if (vm.autoCompleteImplementTOWoOperation && vm.autoCompleteImplementTOWoOperation.keyColumnId) {
              var woOperation = _.find(vm.ImplementToWOOperationList, (item) => { return item.woOPID == vm.autoCompleteImplementTOWoOperation.keyColumnId; })
              vm.ecoRequestModel.woOPID = vm.autoCompleteImplementTOWoOperation.keyColumnId;
              vm.ecoRequestModel.implemetToWOID = vm.ecoRequestModel.woID;
              vm.ecoRequestModel.opID = woOperation ? woOperation.opID : null;
            } else {
              return;
            }
          } else if (vm.ecoRequestModel.ECOImplemetTo == vm.ECOImplementTo.New_WorkOrder.Value) {
            if (vm.autoCompleteImplementTOWoOperation && vm.autoCompleteImplementTOWoOperation.keyColumnId) {
              var woOperation = _.find(vm.ImplementToWOOperationList, (item) => { return item.woOPID == vm.autoCompleteImplementTOWoOperation.keyColumnId; })
              vm.ecoRequestModel.woOPID = vm.autoCompleteImplementTOWoOperation.keyColumnId;
              vm.ecoRequestModel.implemetToWOID = vm.autoCompleteImplementTOWorkorder.keyColumnId;
              vm.ecoRequestModel.opID = woOperation ? woOperation.opID : null;
            } else {
              return;
            }
          } else if (vm.ecoRequestModel.ECOImplemetTo == vm.ECOImplementTo.Terminate_Transfer.Value) {
            if (vm.ImplementToWOOperationList && vm.ImplementToWOOperationList.length > 0) {
              var woOperation = vm.ImplementToWOOperationList[0];
              vm.ecoRequestModel.woOPID = woOperation.woOPID;
              vm.ecoRequestModel.implemetToWOID = vm.ImplementToWOList[0].woID;
              vm.ecoRequestModel.opID = woOperation.opID;
            } else { return; }
          } else {
            return;
          }
          vm.ecoRequestModel.closedDate = new Date();
        } else if (vm.ecoRequestModel.finalStatus == vm.ecoRequestFinalStatus.Pending.Value || vm.ecoRequestModel.finalStatus == vm.ecoRequestFinalStatus.Reject.Value) {
          vm.ecoRequestModel.woOPID = null;
          vm.ecoRequestModel.implemetToWOID = null;
          vm.ecoRequestModel.opID = null;
          vm.ecoRequestModel.closedDate = null;
        }
        vm.ecoRequestModel.requestedWOOPID = vm.autoCompleteRequestedOperation ? vm.autoCompleteRequestedOperation.keyColumnId : null;
        vm.ecoRequestModel.ecoDfmTypeID = vm.defaultAutoCompleteECODFMType.keyColumnId;
        vm.ecoRequestModel.mountingTypeID = vm.defaultAutoCompleteMountingType.keyColumnId;
        vm.ecoRequestModel.woNumber = vm.workOrder ? vm.workOrder.woNumber : null;
        vm.ecoRequestModel.woID = vm.autoCompleteWorkorder.keyColumnId;
        let woAssyHeaderDetail = _.find($scope.$parent.$parent.vm.headerdata, (item) => { return item.label == vm.assemblyAllLabelConstant.PIDCode; });
        vm.ecoRequestModel.PIDCodeAsWoAssyID = woAssyHeaderDetail ? woAssyHeaderDetail.value : null;
        // vm.ecoRequestModel.initiateDate = BaseService.getAPIFormatedDate(vm.ecoRequestModel.initiateDate);
        let objModel = angular.copy(vm.ecoRequestModel);
        objModel.initiateDate = BaseService.getAPIFormatedDate(objModel.initiateDate);
        vm.cgBusyLoading = ECORequestFactory.saveECORequest().save(objModel).$promise.then((response) => {
          if (response && response.data) {
            if (response.data.ecoReqID) {
              BaseService.currentPageForms = [];
              if (response.data.requestType == vm.requestType.ECO.Value) {
                $state.go(WORKORDER.ECO_REQUEST_DETAIL_STATE, { partID: vm.partID, woID: vm.ecoRequestModel.woID, ecoReqID: response.data.ecoReqID }, { reload: true });
              } else if (response.data.requestType == vm.requestType.DFM.Value) {
                $state.go(WORKORDER.DFM_REQUEST_DETAIL_STATE, { partID: vm.partID, woID: vm.ecoRequestModel.woID, ecoReqID: response.data.ecoReqID }, { reload: true });
              }
            }

            vm.ecoRequestForm.$setPristine();
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    };

    vm.changeEcoFinalStatus = (ecoFinalStatus, selectedEcoImplementTo) => {
      switch (ecoFinalStatus) {
        case vm.ecoRequestModel.requestType == vm.requestType.ECO.Value ? vm.ecoRequestFinalStatus.Pending.Value : vm.dfmRequestFinalStatus.Pending.Value:
          vm.ecoRequestModel.ECOImplemetTo = null;
          $scope.$parent.$parent.vm.ECOFinalStatus = vm.ecoRequestModel.requestType == vm.requestType.ECO.Value ? vm.ecoRequestFinalStatus.Pending.Name : vm.dfmRequestFinalStatus.Pending.Name;
          break;
        case vm.ecoRequestModel.requestType == vm.requestType.ECO.Value ? vm.ecoRequestFinalStatus.Accept.Value : vm.dfmRequestFinalStatus.Accept.Value:
          vm.ecoRequestModel.ECOImplemetTo = vm.isWOTerminated ? vm.ECOImplementTo.New_WorkOrder.Value : vm.ECOImplementTo.Same_WorkOrder.Value;
          $scope.$parent.$parent.vm.ECOFinalStatus = vm.ecoRequestModel.requestType == vm.requestType.ECO.Value ? vm.ecoRequestFinalStatus.Accept.Name : vm.dfmRequestFinalStatus.Accept.Name;
          vm.changeECOImplementTo(vm.ecoRequestModel.ECOImplemetTo);
          break;
        case vm.ecoRequestModel.requestType == vm.requestType.ECO.Value ? vm.ecoRequestFinalStatus.Reject.Value : vm.dfmRequestFinalStatus.Reject.Value:
          $scope.$parent.$parent.vm.ECOFinalStatus = vm.ecoRequestModel.requestType == vm.requestType.ECO.Value ? vm.ecoRequestFinalStatus.Reject.Name : vm.dfmRequestFinalStatus.Reject.Name;
          vm.ecoRequestModel.ECOImplemetTo = null;
          break;
      }
    }
    vm.changeECOImplementTo = (ecoImplementTo) => {
      vm.ecoRequestModel.woOPID = null;
      vm.ecoRequestModel.implemetToWOID = null;
      vm.ecoRequestModel.opID = null;
      vm.ecoRequestModel.finalStatusInitFullName = loginUserFullName;
      vm.ecoRequestModel.finalStatusInit = vm.employeeDetails.id;
      vm.ecoRequestModel.finalStatusReason = null;
      vm.ecoRequestForm.$setDirty();
      vm.ImplementToWOOperationList = [];
      switch (ecoImplementTo) {
        case vm.ECOImplementTo.Same_WorkOrder.Value:
          vm.ImplementToWOList = [];
          getImplementToWOOperation(vm.autoCompleteWorkorder.keyColumnId);
          break;
        case vm.ECOImplementTo.New_WorkOrder.Value:
          getImplementToWorkorderList();
          break;
        case vm.ECOImplementTo.Terminate_Transfer.Value:
          getImplementToWorkorderList();
          break;
      }
      $timeout(() => {
        initImplementToWoAutoComplete();
        //getImplementToWOOperation();
      })
    }

    vm.selectECOTypeValue = () => {
      vm.ecoRequestForm.$setDirty();
    }

    vm.changeStatus = (item) => {
      $scope.$parent.$parent.vm.ECOStatus = item.Key;
    }
    vm.gotoWoDetail = (woId) => {
      BaseService.goToWorkorderDetails(woId);
    }
    vm.goToTaskListDetail = () => {
      BaseService.goToTravelerOperationDetails(vm.workOrderOperationList[0].woOPID, BaseService.loginUser.userid, vm.workOrderOperationList[0].woOPID);
    }
    vm.goToECOCategoryList = () => {
      BaseService.openInNew(USER.ADMIN_ECO_CATEGORY_STATE, { categoryType: vm.categoryArray[0].id });
    };
    vm.goToECOCategoryValueList = () => {
      BaseService.openInNew(USER.ADMIN_ECO_CATEGORY_VALUES_STATE, { categoryType: vm.categoryArray[0].id });
    }
    vm.goTocomponentList = () => {
      BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE, {});
    }
    vm.goToEOCDFMTypeList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_ECO_DFM_TYPE_STATE, {});
    }
    vm.goToMountingTypeList = () => {
      BaseService.openInNew(USER.ADMIN_MOUNTING_TYPE_STATE, {});
    };
    vm.employeelist = () => {
      BaseService.openInNew(USER.ADMIN_EMPLOYEE_STATE, {});
    }
    vm.gotoWorkorderlist = () => {
      BaseService.goToWorkorderList();
    }
    vm.getWoStatusClassName = (statusID) => {
      return BaseService.getWoStatusClassName(statusID);
    }
    vm.gotoWoOperation = (woid) => {
      if (woid) {
          BaseService.goToWorkorderOperations(woid);
      } else {
          BaseService.goToWorkorderOperations(vm.autoCompleteWorkorder.keyColumnId);
      }
    }
    vm.checkStockStatus = () => {
      vm.disableStockStatusButton = true;
      if (vm.workOrder && vm.workOrder.WoSalesOrderDetails && vm.workOrder.WoSalesOrderDetails.salesOrderDetailID) {
        BaseService.openInNew(REPORTS.PO_STATUS_WORKORDER_REPORT_STATE, { salesOrderDetID: vm.workOrder.WoSalesOrderDetails.salesOrderDetailID, woID: vm.woID });
      } else {
        DialogFactory.alertDialog({
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: WORKORDER.ECO.WORKORDER_SALESORDER_NOT_EXISTS,
          multiple: true
        });
      }
      $timeout(() => {
        vm.disableStockStatusButton = false;
      })
    }

    //close popup on page destroy 
    $scope.$on('$destroy', function () {
      $mdDialog.hide(false, { closeAll: true });
    });
    /* Show save alert popup when performing tab change*/
    function showWithoutSavingAlertforTabChange(step) {
      let obj = {
        title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
        textContent: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_BODY_MESSAGE,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.confirmDiolog(obj).then((yes) => {
        if (yes) {
          vm.isSave = false;
          if (step == 0) {
            getEcoDetail();
            vm.ecoRequestForm.$setPristine();
            return true;
          } else if (step == 1) {
            vm.employeeDepartmentForm.$setPristine();
            getECORequestDeptApproval();
            return true;
          }
        }

      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
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
      BaseService.currentPageForms = [vm.ecoRequestForm];
    });
    /** Validate max size */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    };
  }
})();
