(function () {
    'use strict';

    angular
      .module('app.admin.equipment')
      .controller('EquipmentProfileController', EquipmentProfileController);

    /** @ngInject */
    function EquipmentProfileController($scope, $state, $stateParams, $timeout, EmployeeFactory, CORE, $mdDialog, DialogFactory, USER, WORKORDER, Upload, PathService, DepartmentFactory, $filter, $window, OPERATION, DataElementTransactionValueFactory, OperationFactory, WorkorderFactory, EquipmentFactory, BaseService) {
        const vm = this;
        vm.entityID = 0;
        vm.Entity = CORE.Entity;
        vm.InputeFieldKeys = CORE.InputeFieldKeys;
        vm.inputFields = CORE.InputeFields;
        vm.eqpID = $stateParams.id;
        vm.EmptyMesssage = OPERATION.OPERATION_EMPTYSTATE.OPERATIONDETAILS;
        vm.equipmentEntityId = CORE.AllEntityIDS.Equipment.ID;
        vm.dataElementList = [];
        vm.isOtherField = true;
        vm.DisplayStatus = CORE.DisplayStatus;
        vm.selectedItems = [];
        vm.empty = CORE.EMPTYSTATE.EMPTY_SEARCH;
        vm.RoHSLeadFreeText = CORE.RoHSLeadFreeText;
        vm.OtherDetailTitle = CORE.OtherDetail.TabName;
        vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
        vm.LabelConstant = angular.copy(CORE.LabelConstant);
        vm.debounceConstant = CORE.Debounce;

        //if set pagination from controller set true to here
        //vm.ispagination = true;
        /*Move to equipment page*/
        vm.goToManageEquipmentWorkstation = (equip) => {
            BaseService.goToManageEquipmentWorkstation(vm.eqpID);
        }

        vm.queryOperation = {
            order: '',
            operation_search: '',
            limit: !(vm.ispagination == undefined ? CORE.isPagination : vm.ispagination) ? '' : CORE.datalimit,
            page: 1,
            isPagination: vm.ispagination == undefined ? CORE.isPagination : vm.ispagination,
        };

        vm.queryWorkorder = {
            order: '',
            workorder_search: '',
            limit: !(vm.ispagination == undefined ? CORE.isPagination : vm.ispagination) ? '' : CORE.datalimit,
            page: 1,
            isPagination: vm.ispagination == undefined ? CORE.isPagination : vm.ispagination,
        };

        vm.getOpStatus = (statusID) => {
            return BaseService.getOpStatus(statusID);
        }
        vm.getWoStatus = (statusID) => {
            return BaseService.getWoStatus(statusID);
        }
        vm.getWoStatusClassName = (statusID) => {
            return BaseService.getWoStatusClassName(statusID);
        }
        vm.ismaintenanceTimeData = true;
        /* retreive Operation profile details*/
        if (vm.eqpID) {
            vm.cgBusyLoading = EquipmentFactory.retrieveEquipmentProfile().query({ id: vm.eqpID }).$promise.then((equipment) => {
                if (!equipment || !equipment.data || !equipment.data.equipmentProfile) {
                    return;
                }
                vm.equipment = angular.copy(equipment.data);
                vm.equipmentOperation = [];
                vm.equipmentWorkorder = [];
                vm.equipmentDataElement = [];
                vm.equipmentDetails = {
                    assetName: vm.equipment.equipmentProfile.assetName,
                    assetNumber: vm.equipment.equipmentProfile.assetNumber,
                    eqpMake: vm.equipment.equipmentProfile.eqpMake,
                    eqpModel: vm.equipment.equipmentProfile.eqpModel,
                    eqpYear: vm.equipment.equipmentProfile.eqpYear,
                    eqpGroup: (vm.equipment.equipmentProfile.equipmentGroup) ? vm.equipment.equipmentProfile.equipmentGroup.gencCategoryName : null,
                    eqpSubGroup: (vm.equipment.equipmentProfile.equipmentSubGroup) ? vm.equipment.equipmentProfile.equipmentSubGroup.gencCategoryName : null,
                    eqpOwnershipType: (vm.equipment.equipmentProfile.equipmentOwnershipType) ? vm.equipment.equipmentProfile.equipmentOwnershipType.gencCategoryName : null,
                    customer: (vm.equipment.equipmentProfile.customer) ? vm.equipment.equipmentProfile.customer.mfgName : null,
                    bankName: vm.equipment.equipmentProfile.bankName,
                    eqpDescription: vm.equipment.equipmentProfile.eqpDescription,
                    scheduleComments: vm.equipment.equipmentProfile.scheduleComments,
                    noOfHours: vm.equipment.equipmentProfile.noOfHours,
                    maintenanceType: vm.equipment.equipmentProfile.maintenanceType
                }
                vm.files = [];
                if (vm.equipment.equipmentProfile.genericFiles) {
                    vm.equipment.equipmentProfile.genericFiles.forEach((value) => {
                        if (value.gencFileName.includes('profile')) {
                            const temp = PathService.basePath(value.gencFileName);
                            vm.imagefile = CORE.WEB_URL + USER.EQUIPMENT_BASE_PATH + value.gencFileName;
                            vm.fileName = value.gencFileName;
                            vm.profileId = value.gencFileID;

                        }
                    });
                }

                vm.equipmentTaskSchedule = vm.equipment.equipmentProfile.equipmentTask;
                /*convert utc time (scheduleStartTime) to local datetime*/
                _.each(vm.equipment.equipmentProfile.equipmentTask, (itemEquipmentTask) => {
                    _.each(itemEquipmentTask.equipmentTaskSchedule, (itemEquipmentTaskSchedule) => {
                        if (itemEquipmentTaskSchedule.scheduleStartTime) {
                            let dateWithTime = new Date($filter('date')(new Date(), _dateDisplayFormat) + " " + itemEquipmentTaskSchedule.scheduleStartTime);
                            itemEquipmentTaskSchedule.scheduleStartTime = adjustDateByTimezoneOffset(dateWithTime, false);
                        }
                    });
                });
                vm.equipment.equipmentProfile.operationEquipment.forEach((value) => {
                    value.operations.opStatus = vm.getOpStatus(value.operations.opStatus);
                    vm.equipmentOperation.push(value.operations);
                });

                vm.equipmentOperationList = vm.equipmentOperation;

                vm.equipment.equipmentProfile.workorderOperationEquipment.forEach((value) => {
                    if (value.workorder) {
                        // update child table data to workorder obj
                        if (value.workorder.componentAssembly) {
                            value.workorder.PIDCode = value.workorder.componentAssembly.PIDCode;
                            value.workorder.nickName = value.workorder.componentAssembly.nickName;
                            value.workorder.mfgPN = value.workorder.componentAssembly.mfgPN;
                            value.workorder.mfgPNDescription = value.workorder.componentAssembly.mfgPNDescription;
                        }

                        value.workorder.className = vm.getWoStatusClassName(value.workorder.woStatus);
                        value.workorder.woStatus = vm.getWoStatus(value.workorder.woStatus);
                        if (value.workorder.WoSalesOrderDetails) {
                            value.workorder.TotalPOQty = _.sumBy(value.workorder.WoSalesOrderDetails, (item) => {
                                return item.poQty;
                            });
                        }
                        vm.equipmentWorkorder.push(value.workorder);
                    }

                });
                //remove workorder related unnecesary field from object due to create issue in search
                vm.equipment.equipmentProfile.workorderOperationEquipment = _.remove(vm.equipment.equipmentProfile.workorderOperationEquipment, function (n) {
                    return n.workorder;
                });
                vm.equipmentWorkorderList = vm.equipment.equipmentProfile.workorderOperationEquipment;
                vm.element = _.orderBy(vm.equipment.equipmentProfile.equipmentDataelement, ['displayOrder'], ['asc']);

                let subFormControlLists = _.find(vm.element, (o) => {
                    return o.dataElement.controlTypeID == 18;
                });
                let dataelementDefault = [];

                _.each(vm.equipment.equipmentProfile.equipmentDataelement, (dataelement) => {
                    if (dataelement.dataElement.parentDataElementID) {
                        if (subFormControlLists && subFormControlLists.dataElementID == dataelement.dataElement.parentDataElementID) {
                            _.remove(vm.element, {
                                dataElementID: dataelement.dataElementID
                            });
                            let input = _.find(vm.inputFields, { ID: dataelement.dataElement.controlTypeID })
                            let obj = { "dataElementID": dataelement.dataElementID, "dataElementName": dataelement.dataElement.dataElementName, "DataType": input.DataType, "controlTypeID": dataelement.dataElement.controlTypeID }
                            dataelementDefault.push(obj);
                        }
                    }
                });

                //  let IDs = [];
                // let StandardClass = [];
                if (vm.equipment.equipmentProfile.workorderOperationEquipment) {
                    vm.equipment.equipmentProfile.workorderOperationEquipment = _.uniqBy(vm.equipment.equipmentProfile.workorderOperationEquipment, 'woID');
                    _.each(vm.equipment.equipmentProfile.workorderOperationEquipment, (item) => {
                        // item.selectedClasses = [];
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
                    })
                }

                vm.equipmentWorkorderList = vm.equipment.equipmentProfile.workorderOperationEquipment;
                /* Check empty state*/
                if (vm.equipmentWorkorder.length != 0)
                    vm.isWorkorder = true
                else
                    vm.isWorkorder = false
                if (vm.equipmentOperation.length != 0)
                    vm.isOperation = true
                else
                    vm.isOperation = false
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });

        }


        vm.searchWorkOrder = (item) => {
            if (item) {
                let searchTxt = angular.copy(item).toLowerCase();
                vm.equipmentWorkorderList = []
                vm.equipmentWorkorderList = _.filter(vm.equipment.equipmentProfile.workorderOperationEquipment, (workorder) => {
                    return workorder.workorder.woNumber.toLowerCase().indexOf(searchTxt) != -1
                      || workorder.workorder.woVersion.toLowerCase().indexOf(searchTxt) != -1
                      || workorder.workorder.PIDCode.toLowerCase().indexOf(searchTxt) != -1
                      || workorder.workorder.mfgPNDescription.toLowerCase().indexOf(searchTxt) != -1
                      || workorder.workorder.mfgPN.toLowerCase().indexOf(searchTxt) != -1
                      || workorder.workorder.nickName.toLowerCase().indexOf(searchTxt) != -1
                      || workorder.workorder.woStatus.toLowerCase().indexOf(searchTxt) != -1;
                });
            }
            else {
                vm.equipmentWorkorderList = vm.equipment.equipmentProfile.workorderOperationEquipment;
            }
        }

        vm.searchOperation = (item) => {
            if (item) {
                let searchTxt = angular.copy(item).toLowerCase();
                vm.equipmentOperationList = []
                vm.equipmentOperationList = _.filter(vm.equipmentOperation, (operation) => {
                    return operation.opName.toLowerCase().indexOf(searchTxt) != -1
                      || operation.opStatus.toLowerCase().indexOf(searchTxt) != -1;
                });
            }
            else {
                vm.equipmentOperationList = vm.equipmentOperation;
            }
        }

        vm.htmlToPlaintext = (text) => {
            return text ? String(text).replace(/<[^>]+>/gm, '') : '';
        }
        vm.setHeight = () => {
            setTimeout(() => {
                var ControlBox = document.getElementsByClassName("manage-customer-tabing");
                _.each(ControlBox, (item) => {
                    item.setAttribute("style", "min-height:" + (window.innerHeight - item.offsetTop - 150) + "px");
                });
            }, 0);
        }

        //Pop up open for operation does and don't description
        vm.ShowDescription = (title, description, name, ev) => {
            let obj = {
                title: title,
                description: description,
                name: name
            }
            let data = obj;
            DialogFactory.dialogService(
              CORE.DESCRIPTION_MODAL_CONTROLLER,
              CORE.DESCRIPTION_MODAL_VIEW,
              ev,
              data).then(() => {
              }, (err) => {
                  return BaseService.getErrorLog(err);
              });
        }
        vm.setHeight();

        vm.goBack = () => {
            $state.go(USER.ADMIN_EQUIPMENT_STATE);
        }
        /* workorder History*/
        vm.workorderProfile = (row, ev) => {
            BaseService.goToWorkorderProfile(row.woID);
        };


        /* operation profile*/
        vm.operationProfile = (row, ev) => {
            BaseService.goToOperationProfile(row.opID);
        };
        vm.equipmentProfile = (row, ev) => {
            BaseService.goToEmployeeProfile(row.id);
        };
        vm.employeeProfile = (row, ev) => {
            BaseService.goToEquipmentProfile(row.id);
        };
        vm.cancel = () => {
            $mdDialog.cancel();
        };
        //close popup on page destroy 
        $scope.$on('$destroy', function () {
            $mdDialog.hide('', { closeAll: true });
        });

    }

})();
