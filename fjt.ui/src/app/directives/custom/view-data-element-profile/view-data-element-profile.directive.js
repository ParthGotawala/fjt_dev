(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('viewDataElementProfile', viewDataElementProfile);

    /** @ngInject */
    function viewDataElementProfile(CORE, USER, $state, DataElementFactory, Upload, EntityFactory, $timeout,
        BaseService, DataElementTransactionValueFactory, $filter, DialogFactory) {
        var directive = {
            restrict: 'E',
            replace: true,
            scope: {
                entity: '@',
                dataelementList: '=?',
                refTransId: '@',
                entityId: '=?',
                fileList: '=?',
                isData: '=',
            },
            templateUrl: 'app/directives/custom/view-data-element-profile/view-data-element-profile.html',
            controller: viewDataElementCtrl,
            controllerAs: 'vm'
        };
        return directive;

        /** @ngInject */
        /**
        * Controller for text-angular define before load directive
        *
        * @param
        */

        function viewDataElementCtrl($scope, $element, $attrs) {
            var vm = this;
            vm.entity = $scope.entity;
            vm.refTransId = $scope.refTransId ? parseInt($scope.refTransId) : 0;
            vm.dateFormate = _dateDisplayFormat;
            vm.isOtherFieldData = false;
            let subFormCount = 1;
            vm.InputeFieldKeys = CORE.InputeFieldKeys;
            vm.IsEdit = true;
            vm.deletedsubFormTransIDs = [];



            /**
            * Get Entity Details
            */
            if (vm.entity) {
                EntityFactory.getEntityByName().query({ name: vm.entity }).$promise.then((res) => {
                    if (res.data) {
                        $scope.entityId = vm.entityId = res.data.entityID;
                        vm.enityElementDetails(vm.entityId);
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }

            /**
            * retrieve EntityElement Details
            *
            * @param
            */
            vm.enityElementDetails = (entityID) => {
                DataElementFactory.retrieveEntityDataElements().query({ id: entityID }).$promise.then((res) => {
                    vm.otherDetailData = res.data;
                    if (res.data) {
                        res.data = _.orderBy(res.data, ['displayOrder'], ['asc']);
                        //Sub form list
                        let subFormControlLists = _.remove(res.data, (o) => {
                            return o.controlTypeID == 18;
                        });

                        /* Start - Keep only entity type dataelement (check dataelement_use_at field in dataelement table) */
                        if (vm.entity == CORE.Entity.Equipment) {
                            _.remove(subFormControlLists, (o) => { return o.dataelement_use_at == CORE.SHOW_ELEMENT_OPTION[1] });
                            res.data = _.filter(res.data, (o) => {
                                return ((o.dataelement_use_at != CORE.SHOW_ELEMENT_OPTION[1])
                                    && (o.equipmentDataelement.length > 0 && _.find(o.equipmentDataelement, (e) => {
                                        return e.eqpID === vm.refTransId
                                    })))
                            });
                        }
                        /* End - Keep only entity type dataelement (check dataelement_use_at field in dataelement table) */

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

                        _.each(res.data, (dataelement) => {
                            if (dataelement.controlTypeID == vm.InputeFieldKeys.DateTime) {
                                if (dataelement.dateTimeType == null || dataelement.dateTimeType == "") {
                                    dataelement.dateTimeType = "0";
                                }
                                if (dataelement.defaultValue) {
                                    dataelement.defaultValue = new Date(dataelement.defaultValue);
                                }
                                else {
                                    dataelement.defaultValue = new Date();
                                }
                            }
                            else if (dataelement.controlTypeID == vm.InputeFieldKeys.MultipleChoice) {
                                dataelement.anySelected = false;
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
                            if (dataelement) {
                                dataelement.defaultValue = dataelement.defaultValue ?
                                                                ((dataelement.controlTypeID == vm.InputeFieldKeys.Numberbox || dataelement.controlTypeID == vm.InputeFieldKeys.Currency)
                                                                    ? (dataelement.decimal_number > 0 ? parseFloat(dataelement.defaultValue) : parseInt(dataelement.defaultValue))
                                                                    : (dataelement.controlTypeID == vm.InputeFieldKeys.SingleChoice ? dataelement.defaultValue == 'true' : dataelement.defaultValue)) : null;
                                if (dataelement.decimal_number > 0) {
                                    dataelement.isDecimal = true;
                                }
                                dataelement.fieldValue = dataelement.dataElementKeyValues;
                            }
                        });
                        if (subFormControlLists.length > 0) {
                            _.each(subFormControlLists, (t) => {
                                if (!t.isMultiple) {
                                    t.rowNumber = 1;
                                    t.subFormControls.push(angular.copy(t.dataelementDefault));
                                }
                                res.data.push(t);
                            })
                        }
                        res.data = _.orderBy(res.data, ['displayOrder'], ['asc']);
                        _.remove(res.data, (o) => {
                            return o.parentDataElementID != null;
                        })
                        $scope.dataelementList = vm.dataelementList = res.data;
                        if (vm.refTransId) {
                            vm.getDataElementTransactionValues();
                        }
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            };

            /**
            * Get EntityElement's Transaction Values
            */
            vm.getDataElementTransactionValues = () => {
                DataElementTransactionValueFactory.getDataElementTransactionValues().query({ refTransID: vm.refTransId, entityID: vm.entityId }).$promise.then((res) => {
                    vm.elementTransactionList = res.data;
                    vm.isOtherFieldData = vm.elementTransactionList.length > 0 ? true : vm.isOtherFieldData;
                    $scope.isData = vm.isOtherFieldData;
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                }).finally(() => {
                    //vm.elementTransactionList = vm.elementTransactionList || [];
                    //if (vm.elementTransactionList.length > 0) {
                    //    assigneElementValue(vm.dataelementList);
                    //}
                    vm.getSubformTransactionDetail();
                });
            };


            vm.getSubformTransactionDetail = () => {
                const refSubFormTransIDs = _.filter(vm.elementTransactionList, (obj) => {
                    return (obj.refSubFormTransID);
                }).map((obj) => {
                    return obj.refSubFormTransID
                });
                let subFormTransList = [];
                if (refSubFormTransIDs.length > 0) {
                    DataElementTransactionValueFactory.getSubformTransactionDetail().query({ refSubFormTransIDs: refSubFormTransIDs }).$promise.then((res) => {
                        subFormTransList = res.data;
                    }).catch((error) => {
                        return BaseService.getErrorLog(error);
                    }).finally(() => {
                        if (subFormTransList.length > 0) {
                            _.each(subFormTransList, (subFormData) => {
                                let objElement = _.find(vm.dataelementList, (itemElement) => { return itemElement.dataElementID == subFormData.parentDataElementID });
                                if (objElement) {
                                    objElement.rowNumber = subFormData.rowNumber;
                                    objElement.subFormTransID = subFormData.subFormTransID;
                                    vm.AddNewSubFormRecord(objElement, true);
                                }
                            })
                        }
                        vm.elementTransactionList = vm.elementTransactionList || [];
                        if (vm.elementTransactionList.length > 0) {
                            assigneElementValue(vm.dataelementList);
                        }
                    });
                }
                else {
                    vm.elementTransactionList = vm.elementTransactionList || [];
                    if (vm.elementTransactionList.length > 0) {
                        assigneElementValue(vm.dataelementList);
                    }
                }
            };
            let myFilter = () => {
                return [1]

            }
            /**
            * Assign Values to Element
            */
            let assigneElementValue = (dataelementList) => {
                _.each(dataelementList, (obj) => {
                    if (obj.controlTypeID == vm.InputeFieldKeys.SubForm) {
                        _.each(obj.subFormControls, (item) => {
                            assigneElementValue(item);
                        });
                    }
                    else {
                        let dataelement = _.find(vm.elementTransactionList, (item) => {
                            if (obj.subFormTransID) {
                                return (item.dataElementID == obj.dataElementID && item.refSubFormTransID == obj.subFormTransID)
                            }
                            else {
                                return (item.dataElementID == obj.dataElementID)
                            }
                        });
                        if (dataelement) {

                            if (obj.controlTypeID == vm.InputeFieldKeys.DateTime) {
                                obj.defaultValue = dataelement.value ? new Date(dataelement.value) : null;
                            }
                            else if (obj.controlTypeID == vm.InputeFieldKeys.DateRange) {
                                if (dataelement.value) {
                                    let dateRange = dataelement.value.split('|');
                                    obj.fromDate = dateRange.length > 0 ? BaseService.checkForDateNullValue(dateRange[0]) : null;
                                    obj.toDate = dateRange.length > 1 ? BaseService.checkForDateNullValue(dateRange[1]) : null;
                                }
                            }
                            else if (obj.controlTypeID == vm.InputeFieldKeys.SingleChoice) {
                                obj.defaultValue = dataelement.value == 'true' ? true : false;
                            }
                            else if (obj.controlTypeID == vm.InputeFieldKeys.MultipleChoice) {
                                if (dataelement.value) {
                                    let selectedOptions = dataelement.value.split('|').map((o) => { return parseInt(o) });
                                    obj.anySelected = selectedOptions.length > 0 ? true : false;
                                    _.each(obj.fieldValue, (option) => {
                                        if (selectedOptions.indexOf(option.keyValueID) != -1) {
                                            option.defaultValue = true;
                                        }
                                        else {
                                            option.defaultValue = false;
                                        }
                                    })
                                }
                                else {
                                    obj.anySelected = false;
                                }
                            }
                            else if (obj.controlTypeID == vm.InputeFieldKeys.Option || obj.controlTypeID == vm.InputeFieldKeys.Combobox) {
                                let selectedValue = _.find(obj.fieldValue, (option) => { return option.keyValueID == parseInt(dataelement.value) });
                                if (selectedValue) {
                                    obj.defaultValue = selectedValue.value;
                                }
                            }
                            else if (obj.controlTypeID == vm.InputeFieldKeys.MultipleChoiceDropdown) {
                                let selectedOptions = dataelement.value.split('|').map((o) => { return parseInt(o) });
                                obj.defaultValue = _.filter(obj.fieldValue, (o) => { return (selectedOptions.indexOf(o.keyValueID) != -1) }).map((o) => { return o.value });
                            }
                            else if (obj.controlTypeID == vm.InputeFieldKeys.FileUpload) {
                                //FileUpload
                                let fileDetail = dataelement.value.split('|');
                                obj.fileDetail = {
                                    path: fileDetail.length > 0 ? fileDetail[0] : "",
                                    mimetype: fileDetail.length > 1 ? fileDetail[1] : "",
                                    originalname: fileDetail.length > 2 ? fileDetail[2] : "",
                                    filename: fileDetail.length > 3 ? fileDetail[3] : "",
                                };
                            }
                            else if (obj.controlTypeID == vm.InputeFieldKeys.Numberbox || obj.controlTypeID == vm.InputeFieldKeys.Currency) {
                                obj.defaultValue = dataelement.value ? parseFloat(dataelement.value) : null;
                            }
                            else {
                                obj.defaultValue = dataelement.value;
                            }
                            obj.refSubFormTransID = dataelement.refSubFormTransID;
                            obj.dataElementTransID = dataelement.dataElementTransID;
                        }
                    }
                });
            };
            vm.AddNewSubFormRecord = (itemElement, IsAuto) => {
                // IsAuto true - while render after getting data from subtransaction values
                if (!IsAuto) {
                    if (!itemElement.rowNumber) {
                        itemElement.rowNumber = 0;
                    }
                    itemElement.rowNumber = itemElement.rowNumber + 1;
                    let objSubForm = itemElement;
                    _.each(objSubForm.dataelementDefault, (dataItem) => {
                        dataItem.refSubFormTransID = null;
                        dataItem.dataElementTransID = null;
                        dataItem.subFormTransID = null;
                        dataItem.rowNumber = itemElement.rowNumber;
                    });

                    itemElement.subFormControls.push(angular.copy(objSubForm.dataelementDefault));
                    var itemGroup = _.groupBy(itemElement.subFormControls, 'subElement');

                } else {
                    var group = _.groupBy(itemElement.dataelementDefault, 'dataElementName');
                    vm.detafield = [];
                    _.each(group, function (d, i) {
                        var data = i;
                        vm.detafield.push(data);
                    });

                    _.each(itemElement.dataelementDefault, (dataItem) => {
                        dataItem.rowNumber = itemElement.rowNumber;
                        dataItem.subFormTransID = itemElement.subFormTransID;
                    });
                    if (!itemElement.isMultiple) {
                        itemElement.rowNumber = 1;
                        _.each(itemElement.subFormControls, (item) => {
                            _.each(item, (subItem) => {
                                subItem.rowNumber = 1;
                                subItem.subFormTransID = itemElement.subFormTransID;
                            });
                        })
                        //if (itemElement.subFormControls.length == 0) {
                        //    itemElement.subFormControls.push(angular.copy(itemElement.dataelementDefault));
                        //}
                    }
                    else {

                        itemElement.subFormControls.push(angular.copy(itemElement.dataelementDefault));
                        var itemGroup = _.groupBy(itemElement.dataelementDefault, 'subElement');
                        var group = _.groupBy(itemElement.dataelementDefault, 'dataElementName');

                    }

                }
            }
            vm.CheckAnyOneSelected = (itemElementData) => {
                let trues = $filter("filter")(itemElementData.fieldValue, {
                    defaultValue: true
                });
                itemElementData.anySelected = trues.length > 0 ? true : false;
            }

            vm.downloadDocument = (itemElement) => {
                let file = itemElement.fileDetail;
                vm.cgBusyLoading = DataElementTransactionValueFactory.downloadDocument(itemElement.dataElementTransID).then((response) => {;
                    if (_.includes([404, 403, 401], response.status)) {
                        var model = {
                            messageContent: '',
                            multiple: true
                        };
                    }
                    if (response.status == 404) {
                        model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
                        DialogFactory.messageAlertDialog(model);
                    } else if (response.status == 403) {
                        model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);                        
                        DialogFactory.messageAlertDialog(model);
                    } else if (response.status == 401) {
                        model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);                        
                        DialogFactory.messageAlertDialog(model);
                    }
                    else {
                        let blob = new Blob([response.data], { type: file.mimetype });
                        if (navigator.msSaveOrOpenBlob) {
                            navigator.msSaveOrOpenBlob(blob, file.originalname);
                        } else {
                            let link = document.createElement("a");
                            if (link.download !== undefined) {
                                let url = URL.createObjectURL(blob);
                                link.setAttribute("href", url);
                                link.setAttribute("download", file.originalname);
                                link.style = "visibility:hidden";
                                document.body.appendChild(link);
                                $timeout(() => {
                                    link.click();
                                    document.body.removeChild(link);
                                });
                            }
                        }
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            };

        }

    }
})();


angular.module('app.core').filter('myFilter', function () {

    return function (inputs, filterValues) {
        var output = [];
        angular.forEach(inputs, function (input) {
            if (filterValues && filterValues.indexOf(input.value) !== -1)
                output.push(input);
        });
        return output;
    };
});
