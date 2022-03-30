(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('viewTranWiseWoOpDataElement', viewTranWiseWoOpDataElement);

    /** @ngInject */
    function viewTranWiseWoOpDataElement(CORE, $filter, BaseService, WorkorderDataelementFactory, REPORTS,
        EntityFactory, OperationDataelementFactory, WorkorderDataElementTransValueFactory, WorkorderOperationFactory) {
        var directive = {
            restrict: 'E',
            replace: true,
            scope: {
                woOpId: '@',
                showEmptyState:'='
            },
            templateUrl: 'app/directives/custom/view-tran-wise-wo-op-data-element/view-tran-wise-wo-op-data-element.html',
            controller: viewTranWiseWoOpDataElementCtrl,
            controllerAs: 'vm'
        };
        return directive;


        /** @ngInject */
        /**
        * Controller for text-angular define before load directive
        *
        * @param
        */

        function viewTranWiseWoOpDataElementCtrl($scope, $element, $attrs) {
            var vm = this;
            vm.EmptyMesssage = REPORTS.REPORTS_EMPTYSTATE.OPERATION_DATAELEMENT_REPORT;
            vm.woOPID = $scope.woOpId;
            vm.showEmptyState = $scope.showEmptyState;
            let OperationEntityID = CORE.AllEntityIDS.Operation.ID;
            vm.InputeFieldKeys = CORE.InputeFieldKeys;
            let SelectedOperationEntity = null;
            let subFormCount = 1;
            vm.tranwiseDataelementList = [];
            vm.DateFormatArray = CORE.DateFormatArray;

            let WoOpTransDataelementValues = [];

            let updateEmptyState = () => {
                vm.showEmptyState = vm.tranwiseDataelementList.length > 0 ? true : false;
                $scope.showEmptyState = vm.showEmptyState;
            }

            let objOpDataelement = {
                entityID: OperationEntityID,
                woOPID: vm.woOPID
            };


            let getwoOpDataelementListRoleWise = (roleID) => {
                vm.cgBusyLoading = WorkorderOperationFactory.getwoOpDataelementListRoleWise().query({ roleID: roleID }).$promise.then((roleData) => {
                    if (roleData && roleData.data) {
                        vm.roleList = roleData.data;
                    }
                }).catch((err) => {
                    return BaseService.getErrorLog(err);
                });
            }

            let setDataElements = (data) => {
                let dataList = [];
                if (data) {
                    if (data.length == 0) {
                        vm.dataelementList = data;
                        return;
                    }
                    /* Start - Keep other than entity type data element (check dataelement_use_at field in data element table) */
                    //if (vm.entity == CORE.Entity.Operation) {
                    data = _.filter(data, (o) => {
                        return ((o.dataelement_use_at != CORE.SHOW_ELEMENT_OPTION[0])
                            && (o.workorderOperationDataelement.length > 0 && _.find(o.workorderOperationDataelement, (e) => {
                                return e.woOPID == vm.woOPID
                            })))
                    });

                    //data filter for to get role wise data element.
                    _.each(data, (o) => {
                        if (o.dataelement_use_at != CORE.SHOW_ELEMENT_OPTION[0]) {
                            _.each(o.workorderOperationDataelement, (item) => {
                                if (item.workorder_Operation_DataElement_Id && item.workorder_Operation_DataElement_Id.length == 0) {
                                    dataList.push(o);
                                } else {
                                    let filterData = $filter('filter')(vm.roleList, { woOpDataElementID: item.woOpDataElementID });
                                    if (filterData && filterData.length > 0) {
                                        dataList.push(o);
                                    }
                                }
                            });
                        }
                    });
                    if (dataList && dataList.length > 0) {
                        data = dataList;
                    }
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
                    getWorkorderTransDataElementListValues();
                }
            }

            /**
            * Get EntityElement's Transaction Values
            */
            let getWorkorderTransDataElementListValues = () => {
                vm.cgBusyLoading = WorkorderDataelementFactory.getWoOpAllTransDataElementValuesList(objOpDataelement).query().$promise.then((res) => {
                    if (res.data && res.data.woTransDEValuesList.length > 0) {
                        WoOpTransDataelementValues = res.data.woTransDEValuesList;
                        WoOpTransDataelementValues = _.groupBy(WoOpTransDataelementValues, 'woTransID');
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                }).finally(() => {
                    _.each(WoOpTransDataelementValues, (elementTransactionList) => {
                        getWorkorderTransSubformDataDetail(elementTransactionList);
                    });
                });
            };


            let getWorkorderTransSubformDataDetail = (elementTransactionList) => {
                const refWoTransSubFormDataIDs = _.filter(elementTransactionList, (obj) => {
                    return (obj.refWoTransSubFormDataID);
                }).map((obj) => {
                    return obj.refWoTransSubFormDataID
                });
                let subFormTransList = [];
                let dataelementList = angular.copy(vm.dataelementList);
                if (refWoTransSubFormDataIDs.length > 0) {
                    WorkorderDataElementTransValueFactory.getWorkorderTransSubformDataDetail().query({ refWoTransSubFormDataIDs: refWoTransSubFormDataIDs }).$promise.then((res) => {
                        subFormTransList = res.data;
                    }).catch((error) => {
                        return BaseService.getErrorLog(error);
                    }).finally(() => {
                        if (subFormTransList.length > 0) {
                            _.each(subFormTransList, (subFormData) => {
                                let objElement = _.find(dataelementList, (itemElement) => { return itemElement.dataElementID == subFormData.parentDataElementID });
                                if (objElement) {
                                    objElement.rowNumber = subFormData.rowNumber;
                                    objElement.woTransSubFormDataID = subFormData.woTransSubFormDataID;
                                    AddNewSubFormRecord(objElement, true);
                                }
                            })
                        }
                        elementTransactionList = elementTransactionList || [];
                        if (elementTransactionList.length > 0) {
                            assigneElementValue(dataelementList, elementTransactionList);
                        }
                        vm.tranwiseDataelementList.push(dataelementList);
                        updateEmptyState();
                    });
                }
                else {
                    elementTransactionList = elementTransactionList || [];
                    if (elementTransactionList.length > 0) {
                        assigneElementValue(dataelementList, elementTransactionList);
                    }
                    vm.tranwiseDataelementList.push(dataelementList);
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
                        dataItem.refWoTransSubFormDataID = null;
                        dataItem.woTransDataElementID = null;
                        dataItem.woTransSubFormDataID = null;
                        dataItem.rowNumber = itemElement.rowNumber;
                    });
                    itemElement.subFormControls.push(angular.copy(objSubForm.dataelementDefault));
                } else {

                    _.each(itemElement.dataelementDefault, (dataItem) => {
                        dataItem.rowNumber = itemElement.rowNumber;
                        dataItem.woTransSubFormDataID = itemElement.woTransSubFormDataID;
                    });
                    if (!itemElement.isMultiple) {
                        itemElement.rowNumber = 1;
                        _.each(itemElement.subFormControls, (item) => {
                            _.each(item, (subItem) => {
                                subItem.rowNumber = 1;
                                subItem.woTransSubFormDataID = itemElement.woTransSubFormDataID;
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
                            if (obj.woTransSubFormDataID) {
                                return (item.dataElementID == obj.dataElementID && item.refWoTransSubFormDataID == obj.woTransSubFormDataID)
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
                            obj.refWoTransSubFormDataID = dataelement.refWoTransSubFormDataID;
                            obj.woTransDataElementID = dataelement.woTransDataElementID;
                            obj.woTransID = dataelement.woTransID;
                        }
                        else {
                            obj.defaultValue = '';
                        }
                    }
                });
            };

            let loginData = null;
            let roleData = null;
            loginData = BaseService.loginUser;
            roleData = loginData ? _.first(loginData.roles) : null;
            if (roleData && roleData.id) {
                getwoOpDataelementListRoleWise(roleData.id);
            }

            let enityElementDetails = (entityID) => {
                OperationDataelementFactory.retrieveWorkorderOperationDataElementList().query({ woOPID: vm.woOPID, woID: "0" }).$promise.then((res) => {
                    setDataElements(res.data);
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
            enityElementDetails();
        }
    }
})();