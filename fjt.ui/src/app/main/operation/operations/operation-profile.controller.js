(function () {
  'use strict';

  angular
    .module('app.operation.operations')
    .controller('OperationProfileController', OperationProfileController);

  /** @ngInject */
  function OperationProfileController($scope, $state, $stateParams, $timeout, EmployeeFactory, CORE, $mdDialog, DialogFactory, USER, WORKORDER, Upload, PathService, DepartmentFactory, $filter, $window, OPERATION, DataElementTransactionValueFactory, OperationFactory, WorkorderFactory, BaseService) {
    const vm = this;
    vm.entityID = 0;
    vm.InputeFieldKeys = CORE.InputeFieldKeys;
    vm.inputFields = CORE.InputeFields;
    vm.opID = $stateParams.id;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.DisplayStatus = CORE.DisplayStatus;
    vm.EmptyMesssage = OPERATION.OPERATION_EMPTYSTATE.OPERATIONDETAILS;
    vm.RoHSLeadFreeText = CORE.RoHSLeadFreeText;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.selectedItems = [];

    //if set pagination from controller set true to here
    //vm.ispagination = true;

    vm.queryEmployee = {
      order: '',
      employee_search: '',
      limit: !(vm.ispagination == undefined ? CORE.isPagination : vm.ispagination) ? '' : CORE.datalimit,
      page: 1,
      isPagination: vm.ispagination == undefined ? CORE.isPagination : vm.ispagination
    };
    vm.querySupplyMaterial = {
      order: '',
      supply_material_search: '',
      limit: !(vm.ispagination == undefined ? CORE.isPagination : vm.ispagination) ? '' : CORE.datalimit,
      page: 1,
      isPagination: vm.ispagination == undefined ? CORE.isPagination : vm.ispagination
    };
    vm.queryEquipment = {
      order: '',
      equipment_search: '',
      limit: !(vm.ispagination == undefined ? CORE.isPagination : vm.ispagination) ? '' : CORE.datalimit,
      page: 1,
      isPagination: vm.ispagination == undefined ? CORE.isPagination : vm.ispagination
    };
    vm.queryWorkorder = {
      order: '',
      workorder_search: '',
      limit: !(vm.ispagination == undefined ? CORE.isPagination : vm.ispagination) ? '' : CORE.datalimit,
      page: 1,
      isPagination: vm.ispagination == undefined ? CORE.isPagination : vm.ispagination
    };

    vm.empty = CORE.EMPTYSTATE.EMPTY_SEARCH;
    /*Move to equipment page*/
    vm.goToManageEquipmentWorkstation = (equip) => {
      BaseService.goToManageEquipmentWorkstation(equip.eqpID);
    };

    /*Get operation status from baseservice*/
    vm.getOpStatus = (statusID) => BaseService.getOpStatus(statusID);

    /*Get workorder status from baseservice*/
    vm.getWoStatus = (statusID) => BaseService.getWoStatus(statusID);

    vm.getWoStatusClassName = (statusID) => BaseService.getWoStatusClassName(statusID);

    vm.goToWorkorderDetails = (data) => {
      BaseService.goToWorkorderDetails(data.woID);
      return false;
    };

    /* retreive Operation profile details*/
    if (vm.opID) {
      vm.cgBusyLoading = OperationFactory.retrieveOperationProfile().query({ id: vm.opID }).$promise.then((operations) => {
        vm.operation = angular.copy(operations.data);
        vm.operationEmployee = [];
        vm.operationEquipment = [];
        vm.operationWorkorder = [];
        vm.operationDataElement = [];
        vm.operationParts = [];

        vm.operationDetails = {
          opDescription: vm.operation.operationProfile.opDescription,
          opDoes: vm.operation.operationProfile.opDoes,
          opDonts: vm.operation.operationProfile.opDonts,
          opName: vm.operation.operationProfile.opName,
          opNumber: vm.operation.operationProfile.opNumber,
          colorCode: vm.operation.operationProfile.colorCode,
          opType: (vm.operation.operationProfile.operationType) ? vm.operation.operationProfile.operationType.gencCategoryName : null,
          opParentOperation: (vm.operation.operationProfile.parentOperation) ? vm.operation.operationProfile.parentOperation.opName : null,
          opStatus: vm.getOpStatus(vm.operation.operationProfile.opStatus)
        };
        if (vm.operation.operationProfile.isFluxNotApplicable === true) {
          vm.operationDetails.fluxType = vm.LabelConstant.COMMON.NotApplicable;
        } else if (vm.operation.operationProfile.isNoClean === true && vm.operation.operationProfile.isWaterSoluble === false) {
          vm.operationDetails.fluxType = vm.LabelConstant.Operation.NoClean;
        } else if (vm.operation.operationProfile.isNoClean === false && vm.operation.operationProfile.isWaterSoluble === true) {
          vm.operationDetails.fluxType = vm.LabelConstant.Operation.WaterSoluble;
        } else if (vm.operation.operationProfile.isNoClean === true && vm.operation.operationProfile.isWaterSoluble === true) {
          vm.operationDetails.fluxType = vm.LabelConstant.Operation.FluxTypeBoth;
        }
        vm.operation.operationProfile.operationEmployee.forEach((value) => {
          if (value.Employee) {
            value.Employee.employeeDepartment = _.first(value.Employee.employeeDepartment);
            vm.operationEmployee.push(value.Employee);
          }
        });

        vm.opEmployeeList = vm.operationEmployee;

        vm.operation.operationProfile.operationEquipment.forEach((value) => {
          vm.operationEquipment.push(value.equipment);
        });
        vm.opEquipmentList = vm.operationEquipment;
        vm.operation.operationProfile.operationsParts.forEach((value) => {
          if (!value.componentSupplyMaterial.imageURL) {
            value.componentSupplyMaterial.imageURL = CORE.WEB_URL + USER.COMPONENT_DEFAULT_IMAGE_PATH + 'profile.jpg';
          } else {
            if (!value.componentSupplyMaterial.imageURL.startsWith('http://') && !value.componentSupplyMaterial.imageURL.startsWith('https://')) {
              value.componentSupplyMaterial.imageURL = BaseService.getPartMasterImageURL(value.componentSupplyMaterial.documentPath, value.componentSupplyMaterial.imageURL);
            }
          }
          const rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
          value.componentSupplyMaterial.rfq_rohsmst.rohsIcon = rohsImagePath + value.componentSupplyMaterial.rfq_rohsmst.rohsIcon;
          vm.operationParts.push(value.componentSupplyMaterial);
        });
        vm.opPartsList = vm.operationParts;
        vm.operation.operationProfile.workorderOperation.forEach((value) => {
          if (value.workorder) {
            // update child table data to workorder obj
            if (value.workorder.componentAssembly) {
              value.workorder.partID = value.workorder.componentAssembly.id;
              value.workorder.PIDCode = value.workorder.componentAssembly.PIDCode;
              value.workorder.nickName = value.workorder.componentAssembly.nickName;
              value.workorder.mfgPN = value.workorder.componentAssembly.mfgPN;
              value.workorder.mfgPNDescription = value.workorder.componentAssembly.mfgPNDescription;
            }

            value.workorder.className = vm.getWoStatusClassName(value.workorder.woStatus);
            value.workorder.woStatus = vm.getWoStatus(value.workorder.woStatus);
            if (value.workorder.WoSalesOrderDetails) {
              value.workorder.TotalPOQty = _.sumBy(value.workorder.WoSalesOrderDetails, (item) => item.poQty);
            }
            vm.operationWorkorder.push(value.workorder);
          }
        });

        vm.element = _.orderBy(vm.operation.operationProfile.operationDataelement, ['displayOrder'], ['asc']);

        const subFormControlLists = _.find(vm.element, (o) => o.DataElement && o.DataElement.controlTypeID === 18);
        //let IDs = [];
        //  let StandardClass = [];

        if (vm.operation.operationProfile.workorderOperation) {
          vm.operation.operationProfile.workorderOperation = _.uniqBy(vm.operation.operationProfile.workorderOperation);
          _.each(vm.operation.operationProfile.workorderOperation, (item) => {
            //   item.selectedClasses = [];
            var priority = null;
            if (item.workorder) {
              _.each(item.workorder.workorderCertification, (certificate) => {
                if (priority == null) {
                  priority = certificate.certificateStandards.priority;
                  item.colorCode = certificate.standardsClass ? certificate.standardsClass.colorCode ? certificate.standardsClass.colorCode : null : null;
                  item.className = certificate.standardsClass ? certificate.standardsClass.className ? certificate.standardsClass.className : null : null;
                }
                else {
                  if (priority > certificate.certificateStandards.priority) {
                    priority = certificate.certificateStandards.priority;
                    item.colorCode = certificate.standardsClass ? certificate.standardsClass.colorCode ? certificate.standardsClass.colorCode : null : null;
                    item.className = certificate.standardsClass ? certificate.standardsClass.className ? certificate.standardsClass.className : null : null;
                  }
                }
              });

              if (item.workorder.RoHSStatusID != null && item.workorder.rohs) {
                item.rohsText = item.workorder.rohs.name;
                item.rohsIcon = vm.rohsImagePath + item.workorder.rohs.rohsIcon;
              }
            }
          });
        }
        vm.operation.operationProfile.workorderOperation = _.remove(vm.operation.operationProfile.workorderOperation, (n) => n.workorder);
        vm.opWorkOrder = vm.operation.operationProfile.workorderOperation;
        const dataelementDefault = [];
        _.each(vm.operation.operationProfile.operationDataelement, (dataelement) => {
          if (dataelement.DataElement && dataelement.DataElement.parentDataElementID) {
            if (subFormControlLists.dataElementID === dataelement.DataElement.parentDataElementID) {
              _.remove(vm.element, {
                dataElementID: dataelement.dataElementID
              });
              const input = _.find(vm.inputFields, { ID: dataelement.DataElement.controlTypeID });
              const obj = { 'dataElementID': dataelement.dataElementID, 'dataElementName': dataelement.DataElement.dataElementName, 'DataType': input.DataType, 'controlTypeID': dataelement.DataElement.controlTypeID };
              dataelementDefault.push(obj);
            }
          }
        });
        vm.element.forEach((value) => {
          if (value.DataElement) {
            const input = _.find(vm.inputFields, { ID: value.DataElement.controlTypeID });
            if (subFormControlLists && subFormControlLists.dataElementID === value.dataElementID) {
              vm.dataelements = { 'dataElementID': value.dataElementID, 'dataElementName': value.DataElement.dataElementName, 'DataType': input.DataType, 'controlTypeID': value.DataElement.controlTypeID, 'SubformControl': dataelementDefault };
            } else {
              vm.dataelements = { 'dataElementID': value.dataElementID, 'dataElementName': value.DataElement.dataElementName, 'DataType': input.DataType, 'controlTypeID': value.DataElement.controlTypeID, 'SubformControl': null };
            }
            vm.operationDataElement.push(vm.dataelements);
          }
        });
        /* workorder History*/
        vm.workorderHistory = (row) => {
          BaseService.goToWorkorderProfile(row.woID);
        };
        /* Check empty state*/
        if (vm.operationWorkorder.length > 0) {
          vm.isWorkorder = true;
        } else {
          vm.isWorkorder = false;
        }
        if (vm.operationEquipment.length > 0) {
          vm.isEquipment = true;
        } else {
          vm.isEquipment = false;
        }
        if (vm.operationEmployee.length > 0) {
          vm.isEmployee = true;
        } else {
          vm.isEmployee = false;
        }
        if (vm.operationDataElement.length > 0) {
          vm.isDataelement = true;
        } else {
          vm.isDataelement = false;
        }
        if (vm.operationParts.length > 0) {
          vm.isPart = true;
        } else {
          vm.isPart = false;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.searchParts = (item) => {
      if (item) {
        const searchTxt = angular.copy(item).toLowerCase();
        vm.opPartsList = [];
        vm.opPartsList = _.filter(vm.operationParts, (component) => component.mfgPN.toLowerCase().indexOf(searchTxt) !== -1
          || component.PIDCode.toLowerCase().indexOf(searchTxt) !== -1
          || component.nickName.toLowerCase().indexOf(searchTxt) !== -1
          || component.mfgPNDescription.toLowerCase().indexOf(searchTxt) !== -1);
      }
      else {
        vm.opPartsList = vm.operationParts;
      }
    };

    vm.searchEmployee = (item) => {
      if (item) {
        const searchTxt = angular.copy(item).toLowerCase();
        vm.opEmployeeList = [];
        // console.log(vm.opEmployeeList);
        vm.opEmployeeList = _.filter(vm.operationEmployee, (emp) => (emp.firstName.toLowerCase().indexOf(searchTxt) !== -1)
          || (emp.lastName.toLowerCase().indexOf(searchTxt) !== -1)
          || (emp.fullName.toLowerCase().indexOf(searchTxt) !== -1)
          || (emp.employeeDepartment != null ? (emp.employeeDepartment.genericCategory ? emp.employeeDepartment.genericCategory.gencCategoryName.toLowerCase().indexOf(searchTxt) : false) != -1 : false)
          || (emp.employeeDepartment != null ? (emp.employeeDepartment.department ? emp.employeeDepartment.department.deptName.toLowerCase().indexOf(searchTxt) != -1 : false) : false)
          || (emp.managerEmployee != null ? emp.managerEmployee.firstName.toLowerCase().indexOf(searchTxt) !== -1 : false)
          || (emp.managerEmployee != null ? emp.managerEmployee.lastName.toLowerCase().indexOf(searchTxt) !== -1 : false)
          || (emp.managerEmployee != null ? emp.managerEmployee.fullName.toLowerCase().indexOf(searchTxt) !== -1 : false));
      }
      else {
        vm.opEmployeeList = vm.operationEmployee;
      }
    };

    vm.searchWorkOrder = (item) => {
      if (item) {
        const searchTxt = angular.copy(item).toLowerCase();
        vm.opWorkOrder = [];
        vm.opWorkOrder = _.filter(vm.operation.operationProfile.workorderOperation, (workorder) => workorder.workorder.woNumber.toLowerCase().indexOf(searchTxt) !== -1
          || workorder.workorder.woVersion.toLowerCase().indexOf(searchTxt) !== -1
          || workorder.workorder.PIDCode.toLowerCase().indexOf(searchTxt) !== -1
          || workorder.workorder.nickName.toLowerCase().indexOf(searchTxt) !== -1
          || workorder.workorder.woStatus.toLowerCase().indexOf(searchTxt) !== -1
          || workorder.workorder.mfgPNDescription.toLowerCase().indexOf(searchTxt) !== -1
          || workorder.workorder.mfgPN.toLowerCase().indexOf(searchTxt) !== -1);
      }
      else {
        vm.opWorkOrder = vm.operation.operationProfile.workorderOperation;
      }
    };

    vm.searchEquipment = (item) => {
      if (item) {
        const searchTxt = angular.copy(item).toLowerCase();
        vm.opEquipmentList = [];
        vm.opEquipmentList = _.filter(vm.operationEquipment, (equipment) => (equipment.locationType && equipment.locationType.gencCategoryName && equipment.locationType.gencCategoryName.toLowerCase().indexOf(searchTxt) !== -1)
          || equipment.assetName.toLowerCase().indexOf(searchTxt) !== -1
          || (equipment.equipmentType && equipment.equipmentType.gencCategoryName && equipment.equipmentType.gencCategoryName.toLowerCase().indexOf(searchTxt) !== -1)
          || equipment.eqpMake.toLowerCase().indexOf(searchTxt) !== -1
          || equipment.eqpModel.toLowerCase().indexOf(searchTxt) !== -1
          || equipment.eqpYear.toLowerCase().indexOf(searchTxt) !== -1
          || (equipment.equipmentDepartment && equipment.equipmentDepartment.deptName && equipment.equipmentDepartment.deptName.toLowerCase().indexOf(searchTxt) !== -1)
        );
      } else {
        vm.opEquipmentList = vm.operationEquipment;
      }
    };

    vm.htmlToPlaintext = (text) => text ? String(text).replace(/<[^>]+>/gm, '') : '';

    vm.setHeight = () => {
      setTimeout(() => {
        var ControlBox = document.getElementsByClassName('manage-customer-tabing');
        _.each(ControlBox, (item) => {
          item.setAttribute('style', 'min-height:' + (window.innerHeight - item.offsetTop - 150) + 'px');
        });
      }, 0);
    };

    //Pop up open for operation does and don't description
    vm.ShowDescription = (title, description, name, ev) => {
      const obj = {
        title: title,
        description: description,
        name: name
      };
      const data = obj;
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };
    vm.setHeight();

    vm.goBack = () => {
      $state.go(OPERATION.OPERATION_OPERATIONS_STATE);
    };

    /* workorder profile*/
    vm.workorderProfile = (row) => BaseService.goToWorkorderProfile(row.woID);

    /* employee profile*/
    vm.employeeProfile = (row) => BaseService.goToEmployeeProfile(row.id);

    vm.equipmentProfile = (row) => BaseService.goToEquipmentProfile(row.eqpID);

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide('', { closeAll: true });
    });
  }
})();
