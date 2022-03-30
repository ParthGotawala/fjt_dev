(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('viewTranWiseWoOpEqpDataElement', viewTranWiseWoOpEqpDataElement);

    /** @ngInject */
    function viewTranWiseWoOpEqpDataElement(CORE, BaseService, WorkorderDataelementFactory, REPORTS,
        WorkorderDataElementTransValueFactory, WorkorderEquipmentDataElementTransValueFactory) {
        var directive = {
            restrict: 'E',
            replace: true,
            scope: {
                woOpId: '@',
                eqpId: '@',
                showEmptyState: '='
            },
            templateUrl: 'app/directives/custom/view-tran-wise-wo-op-eqp-data-element/view-tran-wise-wo-op-eqp-data-element.html',
            controller: viewTranWiseWoOpEqpDataElementCtrl,
            controllerAs: 'vm'
        };
        return directive;


        /** @ngInject */
        /**
        * Controller for text-angular define before load directive
        *
        * @param
        */

        function viewTranWiseWoOpEqpDataElementCtrl($scope, $element, $attrs) {
            var vm = this;
            vm.EmptyMesssage = REPORTS.REPORTS_EMPTYSTATE.EQUIPMENT_DATAELEMENT_REPORT;
            vm.woOPID = $scope.woOpId;
            vm.eqpID = $scope.eqpId;
            vm.showEmptyState = $scope.showEmptyState;
            let EquipmentEntityID = CORE.AllEntityIDS.Equipment.ID;
            vm.InputeFieldKeys = CORE.InputeFieldKeys;
            //let SelectedOperationEntity = null;
            let subFormCount = 1;
            vm.tranwiseEqpDataelementList = [];
            let WoOpEqpTransDataelementValues = [];
            vm.DateFormatArray = CORE.DateFormatArray;

            let updateEmptyState = () => {
                vm.showEmptyState = vm.tranwiseEqpDataelementList.length > 0 ? true : false;
                $scope.showEmptyState = vm.showEmptyState;
            }


            let setDataElements = (data) => {
                let dataList = [];
                if (data) {
                    if (data.length == 0) {
                        vm.dataelementList = data;
                        return;
                    }
                    /* Start - Keep other than entity type data element (check dataelement_use_at field in data element table) */
                    //if (vm.entity == CORE.Entity.Equipment) {
                    data = _.filter(data, (o) => {
                        return ((o.dataelement_use_at != CORE.SHOW_ELEMENT_OPTION[0])
                            && (o.workorderOperationEquipmentDataelement.length > 0 && _.find(o.workorderOperationEquipmentDataelement, (e) => {
                                return e.woOPID == vm.woOPID
                            })))
                    });

                    if (data.length == 0) {
                        vm.dataelementList = data;
                        return;
                    }
                    //subFormControlLists = _.filter(subFormControlLists, (o) => { return o.dataelement_use_at != CORE.SHOW_ELEMENT_OPTION[1] });
                    //}
                    /* End - Keep other than entity type data element (check dataelement_use_at field in data element table) */

                    /* Start - To Set empty state when all element only of sub form type and has no sub element  */
                    let isAllSubFormTrue = _.every(data, ['controlTypeID', CORE.InputeFieldKeys.SubForm]);
                    if (isAllSubFormTrue) {
                        vm.dataelementList = [];
                        return;
                    }
                    /* End - To Set empty state when all element only of subform type and has no sub element  */

                    data = _.orderBy(data, ['displayOrder'], ['asc']);
                    //Sub form list
                    let subFormControlLists = _.remove(data, (o) => {
                        return o.controlTypeID == CORE.InputeFieldKeys.SubForm;
                    });
                    _.each(subFormControlLists, (item) => {
                        item.subFormControls = [];
                        item.dataelementDefault = [];
                        item.subFormCount = subFormCount++;
                        //item.addSubFormItem = true;
                        if (!_.isNull(item.recurring_limit) && !_.isUndefined(item.recurring_limit)) {
                            item.isMultiple = true;
                        }
                        else {
                            item.isMultiple = false;
                            item.recurring_limit = null;
                        }
                    })
                    _.each(data, (dataelement) => {
                        if (dataelement.controlTypeID == vm.InputeFieldKeys.DateTime) {
                            if (dataelement.dateTimeType == null || dataelement.dateTimeType == "" || dataelement.dateTimeType == "0") {
                                dataelement.dateTimeType = "0";

                                if (dataelement.formatMask) {
                                    let DateFormateMast = dataelement.formatMask;
                                    let splitDate = DateFormateMast.split(" ");
                                    let UpperDate = splitDate[0].toUpperCase();
                                    dataelement.DateformatMask = UpperDate + ' ' + splitDate[1];
                                }
                                else {
                                    let DateFormateMast = vm.DateFormatArray[1].format;
                                    let splitDate = DateFormateMast.split(" ");
                                    let UpperDate = splitDate[0].toUpperCase();
                                    dataelement.DateformatMask = UpperDate + ' ' + splitDate[1];
                                }
                            }
                            else if (dataelement.dateTimeType == "1") {
                                dataelement.DateformatMask = dataelement.formatMask.toUpperCase();
                            }
                            else {
                                dataelement.DateformatMask = dataelement.formatMask;
                            }
                        }
                        else if (dataelement.controlTypeID == vm.InputeFieldKeys.DateRange) {
                            if (dataelement.formatMask == null)
                                dataelement.formatMask = vm.DateFormatArray[0].format;
                            dataelement.fromDate = dataelement.fromDate ? BaseService.checkForDateNullValue(dataelement.fromDate) : null;
                            dataelement.toDate = dataelement.toDate ? BaseService.checkForDateNullValue(dataelement.toDate) : null;
                            //else
                            //    dataelement.formatMask = dataelement.formatMask
                        }
                        else if (dataelement.controlTypeID == vm.InputeFieldKeys.FileUpload) {
                            if (dataelement.fileType) {
                                dataelement.fileType = JSON.parse(dataelement.fileType);
                                _.each(vm.FileTypeList, (types) => {
                                    _.each(dataelement.fileType, (file) => {
                                        if (types.mimetype == file) {
                                            types.isDefault = true;
                                        }
                                    });
                                });
                            }
                            else {
                                dataelement.fileType = [];
                            }
                        }

                        if (dataelement.parentDataElementID) {
                            let obj = _.find(subFormControlLists, (o) => {
                                return o.dataElementID == dataelement.parentDataElementID;
                            });
                            if (obj) {
                                dataelement.subFormCount = obj.subFormCount;
                                dataelement.IsSubFormElement = true;
                                obj.dataelementDefault.push(dataelement);
                                //obj.subFormControls.push(dataelement);
                            }
                        }
                    });
                    if (subFormControlLists.length > 0) {
                        _.each(subFormControlLists, (t) => {
                            if (!t.isMultiple) {
                                t.rowNumber = 1;
                                if (t.dataelementDefault) {
                                    _.each(t.dataelementDefault, (dataElement) => {
                                        dataElement.rowNumber = 1;
                                    });
                                }
                                t.subFormControls.push(angular.copy(t.dataelementDefault));
                            }
                            data.push(t);
                        })
                    }
                    data = _.orderBy(data, ['displayOrder'], ['asc']);
                    _.remove(data, (o) => {
                        return o.parentDataElementID != null;
                    })
                    vm.dataelementList = data;
                    getWorkorderTransEquipmentDataElementListValues();
                }
            }

            /**
            * Get EntityElement's Transaction Values
            */
            let getWorkorderTransEquipmentDataElementListValues = () => {
                let objEqpDataelement = {
                    entityID: EquipmentEntityID,
                    woOPID: vm.woOPID,
                    eqpID: vm.eqpID
                };
                vm.cgBusyLoading = WorkorderDataelementFactory.getWoOpEqpAllTransDataElementValuesList(objEqpDataelement).query().$promise.then((res) => {
                    if (res.data && res.data.woTransEqpDEValuesList.length > 0) {
                        WoOpEqpTransDataelementValues = res.data.woTransEqpDEValuesList;
                        WoOpEqpTransDataelementValues = _.groupBy(WoOpEqpTransDataelementValues, 'woTransID');
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                }).finally(() => {
                    _.each(WoOpEqpTransDataelementValues, (elementTransactionList) => {
                        getWorkorder_Trans_Equipment_SubformDataDetail(elementTransactionList);
                    });
                });
            };


            let getWorkorder_Trans_Equipment_SubformDataDetail = (elementTransactionList) => {
                const refWoTransEqpSubFormDataIDs = _.filter(elementTransactionList, (obj) => {
                    return (obj.refWoTransEqpSubFormDataID);
                }).map((obj) => {
                    return obj.refWoTransEqpSubFormDataID
                });
                let subFormTransList = [];
                let dataelementList = angular.copy(vm.dataelementList);
                if (refWoTransEqpSubFormDataIDs.length > 0) {
                    WorkorderEquipmentDataElementTransValueFactory.getworkorderTransEquipmentSubFormDetail().query({ refWoTransEqpSubFormDataIDs: refWoTransEqpSubFormDataIDs }).$promise.then((res) => {
                        subFormTransList = res.data;
                    }).catch((error) => {
                        return BaseService.getErrorLog(error);
                    }).finally(() => {
                        if (subFormTransList.length > 0) {
                            _.each(subFormTransList, (subFormData) => {
                                let objElement = _.find(dataelementList, (itemElement) => { return itemElement.dataElementID == subFormData.parentDataElementID });
                                if (objElement) {
                                    objElement.rowNumber = subFormData.rowNumber;
                                    objElement.woTransEqpSubFormDataID = subFormData.woTransEqpSubFormDataID;
                                    AddNewSubFormRecord(objElement, true);
                                }
                            })
                        }
                        elementTransactionList = elementTransactionList || [];
                        if (elementTransactionList.length > 0) {
                            assigneElementValue(dataelementList, elementTransactionList);
                        }
                        vm.tranwiseEqpDataelementList.push(dataelementList);
                        updateEmptyState();
                    });
                }
                else {
                    elementTransactionList = elementTransactionList || [];
                    if (elementTransactionList.length > 0) {
                        assigneElementValue(dataelementList, elementTransactionList);
                    }
                    vm.tranwiseEqpDataelementList.push(dataelementList);
                    updateEmptyState();
                }
            };

            let AddNewSubFormRecord = (itemElement, IsAuto) => {
                // IsAuto true - while render after getting data from subtransaction values
                if (!IsAuto) {
                    if (!itemElement.rowNumber) {
                        itemElement.rowNumber = 0;
                    }
                    itemElement.rowNumber = itemElement.rowNumber + 1;
                    let objSubForm = itemElement;
                    _.each(objSubForm.dataelementDefault, (dataItem) => {
                        dataItem.refWoTransEqpSubFormDataID = null;
                        dataItem.woTransEqpDataElementID = null;
                        dataItem.woTransEqpSubFormDataID = null;
                        dataItem.rowNumber = itemElement.rowNumber;
                    });
                    itemElement.subFormControls.push(angular.copy(objSubForm.dataelementDefault));
                } else {

                    _.each(itemElement.dataelementDefault, (dataItem) => {
                        dataItem.rowNumber = itemElement.rowNumber;
                        dataItem.woTransEqpSubFormDataID = itemElement.woTransEqpSubFormDataID;
                    });
                    if (!itemElement.isMultiple) {
                        itemElement.rowNumber = 1;
                        _.each(itemElement.subFormControls, (item) => {
                            _.each(item, (subItem) => {
                                subItem.rowNumber = 1;
                                subItem.woTransEqpSubFormDataID = itemElement.woTransEqpSubFormDataID;
                            });
                        })
                        //if (itemElement.subFormControls.length == 0) {
                        //    itemElement.subFormControls.push(angular.copy(itemElement.dataelementDefault));
                        //}
                    }
                    else {
                        itemElement.subFormControls.push(angular.copy(itemElement.dataelementDefault));
                    }

                }
            }

            let assigneElementValue = (dataelementList, elementTransactionList) => {
                _.each(dataelementList, (obj) => {
                    if (obj.controlTypeID == vm.InputeFieldKeys.SubForm) {
                        _.each(obj.subFormControls, (item) => {
                            assigneElementValue(item, elementTransactionList);
                        });
                    }
                    else {
                        let dataelement = _.find(elementTransactionList, (item) => {
                            if (obj.woTransEqpSubFormDataID) {
                                return (item.dataElementID == obj.dataElementID && item.refWoTransEqpSubFormDataID == obj.woTransEqpSubFormDataID)
                            }
                            else {
                                return (item.dataElementID == obj.dataElementID)
                            }
                        });
                        if (dataelement) {

                            if (obj.controlTypeID == vm.InputeFieldKeys.FileUpload) {
                                //FileUpload
                                let fileDetail = dataelement.elementValue.split('|');
                                obj.fileDetail = {
                                    path: fileDetail.length > 0 ? fileDetail[0] : "",
                                    mimetype: fileDetail.length > 1 ? fileDetail[1] : "",
                                    originalname: fileDetail.length > 2 ? fileDetail[2] : "",
                                    filename: fileDetail.length > 3 ? fileDetail[3] : "",
                                };
                            }
                            else {
                                obj.defaultValue = dataelement.elementValue;
                            }
                            obj.refWoTransEqpSubFormDataID = dataelement.refWoTransEqpSubFormDataID;
                            obj.woTransEqpDataElementID = dataelement.woTransEqpDataElementID;
                            obj.woTransID = dataelement.woTransID;
                        }
                    }
                });
            };


            let enityElementDetails = () => {
                WorkorderDataElementTransValueFactory.retrieveWorkorderOperationEquipmentDataElementList().query({
                    id: EquipmentEntityID, woOPID: vm.woOPID, eqpID: vm.eqpID, woID: '0'
                }).$promise.then((res) => {
                    setDataElements(res.data);
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
            enityElementDetails();
        }
    }
})();