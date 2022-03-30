(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('WorkorderEquipmentDataElementTransValueFactory', ['$resource', '$http', '$filter', 'CORE', WorkorderEquipmentDataElementTransValueFactory]);

    /** @ngInject */
    function WorkorderEquipmentDataElementTransValueFactory($resource, $http, $filter, CORE) {
        let deletedsubFormTransIDs = [];
        let assignTransactionValues = (dataElementList) => {
            const InputeFieldKeys = CORE.InputeFieldKeys;
            let subFormElementList = [];
            let dynamicControlList = _.map(dataElementList, (obj) => {
                let value;
                if (obj.controlTypeID == InputeFieldKeys.DateTime) {
                    //Date
                    value = $filter('date')(obj.defaultValue, _dateTimeFullTimeDisplayFormat);
                }
                else if (obj.controlTypeID == InputeFieldKeys.DateRange) {
                    //DateRange
                    value = `${$filter('date')(obj.fromDate, _dateDisplayFormat)}|${$filter('date')(obj.toDate, _dateDisplayFormat)}`;
                }
                else if (obj.controlTypeID == InputeFieldKeys.SingleChoice) {
                    //SingleChoice
                    value = obj.defaultValue ? 'true' : 'false';
                }
                else if (obj.controlTypeID == InputeFieldKeys.MultipleChoice) {
                    //Multi-Choice
                    value = _.map(_.filter(obj.fieldValue, (option) => { return option.defaultValue }), 'keyValueID').join('|');
                }
                else if (obj.controlTypeID == InputeFieldKeys.Option) {
                    let selectedValue = _.find(obj.fieldValue, (option) => { return option.value == obj.defaultValue });
                    if (selectedValue) {
                        value = selectedValue.keyValueID;
                    }
                }
                else if (obj.controlTypeID == InputeFieldKeys.Combobox) {
                    let selectedValue = _.find(obj.fieldValue, (option) => { return option.value == obj.defaultValue });
                    if (selectedValue) {
                        value = selectedValue.keyValueID;
                    }
                }
                else if (obj.controlTypeID === InputeFieldKeys.CustomAutoCompleteSearch) {
                  value = (obj.autoCompleteEntity && obj.autoCompleteEntity.keyColumnId) ? obj.autoCompleteEntity.keyColumnId : null;
                }
                else if (obj.controlTypeID == InputeFieldKeys.MultipleChoiceDropdown) {
                    value = _.map(obj.defaultValue, (value) => {
                        let selectedValue = _.find(obj.fieldValue, (option) => { return option.value == value });
                        if (selectedValue) {
                            return selectedValue.keyValueID;
                        }
                    }).join('|');
                }
                else if (obj.controlTypeID == InputeFieldKeys.FileUpload) {
                    if (obj.fileDetail) {
                        value = `${obj.fileDetail.path}|${obj.fileDetail.mimetype}|${obj.fileDetail.originalname}|${obj.fileDetail.filename}`;
                    }
                    else if (obj.defaultValue) {
                        value = obj.defaultValue.name;
                    }
                }
                else if (obj.controlTypeID == InputeFieldKeys.SubForm) {
                    ////Sub Form
                    _.each(obj.subFormControls, (item, index) => {
                        subFormElementList = _.union(subFormElementList, assignTransactionValues(item));
                    })
                }
                else {
                    value = obj.defaultValue;
                }
                if ((value != "" && value != null && typeof value != undefined) || (typeof value == "string" && value.trim() != "") || (obj.woTransEqpDataElementID) || (obj.parentDataElementID)) {
                    return {
                        woTransEqpDataElementID: obj.woTransEqpDataElementID,
                        dataElementID: obj.dataElementID,
                        parentDataElementID: obj.parentDataElementID,
                        refWoTransEqpSubFormDataID: obj.refWoTransEqpSubFormDataID,
                        rowNumber: obj.rowNumber,
                        value: value,
                        controlTypeID: obj.controlTypeID,
                        createdBy: obj.createdBy
                    };
                }
            });

            dynamicControlList = _.filter(dynamicControlList, (obj) => { return obj });
            return _.union(dynamicControlList, subFormElementList);
        };

        return {
            assignDeletedsubFormTransID: (idList) => {
                deletedsubFormTransIDs = idList;
            },

            getDataElementEquipmentTransactionValues: () =>  $resource(CORE.API_URL + 'workorder_trans_equipment_dataelement_values/:woTransID/:woOPID/:entityID/:eqpID', {
                woTransID: '@_woTransID',
                woOPID: '@_woOPID',
                entityID: '@_entityID',
                eqpID: '@_eqpID'
            }, {
                query: {
                    isArray: false
                }
            }),
            saveTransctionValue: (transactionDet, FileList) => {
                return $http({
                    method: 'POST',
                    url: CORE.API_URL + 'workorder_trans_equipment_dataelement_values',
                    headers: { 'Content-Type': undefined },
                    transformRequest: function (data) {
                        var formData = new FormData();
                        formData.append("woTransID", angular.toJson(data.woTransID));
                        formData.append("woOPID", angular.toJson(data.woOPID));
                        formData.append("woID", angular.toJson(data.woID));
                        formData.append("eqpID", angular.toJson(data.eqpID));
                        formData.append("entityID", angular.toJson(data.entityID));
                        formData.append("employeeID", angular.toJson(data.employeeID));
                        formData.append("woNumber", angular.toJson(data.woNumber));
                        formData.append("opName", angular.toJson(data.opName));
                        formData.append("eqpName", angular.toJson(data.eqpName));
                        formData.append("dataElementList", angular.toJson(data.dataElementList));
                        formData.append("removeElementList", angular.toJson(data.removeElementList));
                        formData.append("subFormTransList", angular.toJson(data.subFormTransList));
                        formData.append("deletedsubFormTransIDs", angular.toJson(data.deletedsubFormTransIDs));
                        formData.append("removeSubFormTransListConditional", angular.toJson(data.removeSubFormTransListConditional));
                        _.each(data.files, function (obj, index) {
                            formData.append(`file[${index}]`, obj);
                        });
                        return formData;
                    },
                    data: {
                        woTransID: transactionDet.woTransID,
                        woOPID: transactionDet.woOPID,
                        woID: transactionDet.woID,
                        eqpID: transactionDet.eqpID,
                        entityID: transactionDet.entityID,
                        employeeID: transactionDet.employeeID,
                        woNumber: transactionDet.woNumber,
                        opName: transactionDet.opName,
                        eqpName: transactionDet.eqpName,
                        dataElementList: transactionDet.dataElementList,
                        removeElementList: transactionDet.removeElementList,
                        subFormTransList: transactionDet.subFormTransList,
                        deletedsubFormTransIDs: transactionDet.deletedsubFormTransIDs,
                        removeSubFormTransListConditional: transactionDet.removeSubFormTransListConditional,
                        files: FileList
                    }
                }, (data) => {
                    return data.Data;
                }, (e) => {
                    return e;
                });
            },
            downloadDocument: (documentID) => $http.get(CORE.API_URL + "workorder_trans_equipment_dataelement_values/downloadWoTransEqpElementTransactionDocument/" + documentID, { responseType: 'arraybuffer' }).then(function (response) {
                return response;
            }, function (error) {
                return error;
            }),
            downloadDocumentByRefID: (documentObj) => $http.post(CORE.API_URL + "workorder_trans_equipment_dataelement_values/downloadWoTransEqpDataElementFileByRefID", { documentObj: documentObj }, { responseType: 'arraybuffer' }).then(function (response) {
                return response;
            }, function (error) {
                return error;
            }),
            getWorkorderTransDataElementList: (elementList) => {
                let TransactionList = assignTransactionValues(elementList);
                //console.log(TransactionList);
                let dataElementList = _.filter(TransactionList, (obj) => {
                    return ((obj.value != "" && obj.value != null && typeof obj.value != undefined) || (typeof obj.value == "string" && obj.value.trim() != "") || (obj.parentDataElementID));
                });

                /* newly added sub-form elements value without refWoTransEqpSubFormDataID */
                let listOfNewAddedValueForExistsSubformRow = _.filter(dataElementList, (item) => {
                    return ((item.value != "" && item.value != null && typeof item.value != undefined) || (typeof item.value == "string" && item.value.trim() != ""))
                            && !item.refWoTransEqpSubFormDataID && item.rowNumber && item.rowNumber > 0;
                });

                _.each(listOfNewAddedValueForExistsSubformRow, (newAddedValueItem) => {
                    /* matching rowNumber item from original dataElementList to set refWoTransEqpSubFormDataID into newly added element */
                    let dataElementItemOfRefWoTransEqpSubForm = _.find(dataElementList, (dataElementListItem) => {
                        return dataElementListItem.rowNumber == newAddedValueItem.rowNumber && dataElementListItem.refWoTransEqpSubFormDataID > 0
                        && dataElementListItem.parentDataElementID == newAddedValueItem.parentDataElementID;
                    });

                    if (dataElementItemOfRefWoTransEqpSubForm) {
                        /* get original item from dataElementList to set refWoTransEqpSubFormDataID */
                        let dataElementItemToSetRefWoTransEqpSubForm = _.find(dataElementList, (dataElementListItem) => {
                            return newAddedValueItem == dataElementListItem;
                        });
                        if (dataElementItemToSetRefWoTransEqpSubForm) {
                            dataElementItemToSetRefWoTransEqpSubForm.refWoTransEqpSubFormDataID = dataElementItemOfRefWoTransEqpSubForm.refWoTransEqpSubFormDataID;
                        }
                    }
                });


                /* remove element values which contain no data including sub-form elements  */
                let removeElementList = _.filter(TransactionList, (obj) => {
                    return ((obj.woTransEqpDataElementID) && (obj.value == "" || obj.value == null || typeof obj.value == undefined || (typeof obj.value == "string" && obj.value.trim() == "")));
                }).map((obj) => { return obj.woTransEqpDataElementID });


                /* take ref_sub-form_id of sub-form elements to check any record exists for sub-form.
                 if not then remove sub-form self entry from subform_data - (code in api -> pass ref_sub-form_id ids from here) */
                let removeSubFormTransListConditional = [];
                removeSubFormTransListConditional = _.filter(TransactionList, (obj) => {
                    return ((obj.woTransEqpDataElementID) && (obj.value == "" || obj.value == null || typeof obj.value == undefined || (typeof obj.value == "string" && obj.value.trim() == "")));
                });
                if (removeSubFormTransListConditional && removeSubFormTransListConditional.length > 0) {
                    removeSubFormTransListConditional = _.uniq(_.map(removeSubFormTransListConditional, 'refWoTransEqpSubFormDataID'));
                }


                let subFormTransList = _.filter(TransactionList, (obj) => {
                    return (obj.parentDataElementID);
                })

                if (subFormTransList && subFormTransList.length > 0) {
                    _.each(subFormTransList, (listItem) => {
                        listItem.woTransEqpSubFormDataID = listItem.refWoTransEqpSubFormDataID;
                    });

                    /* [S] code to remove blank rows of sub form */
                    let rowNumWiseSubFormTransList = _.groupBy(subFormTransList, function (elem) { return [elem.rowNumber, elem.parentDataElementID].join(); });
                    _.each(rowNumWiseSubFormTransList, (itemlist) => {
                        let isAllEmpty = _.every(itemlist, (obj) => {
                            return ((!obj.woTransEqpDataElementID) && (obj.value == "" || obj.value == null || typeof obj.value == undefined || (typeof obj.value == "string" && obj.value.trim() == "")));
                        });
                        if (isAllEmpty) {
                            subFormTransList = _.difference(subFormTransList, itemlist); /* get full row that contain values */
                        }
                    })
                    /* [E] code to remove blank rows of sum form */

                    /* set data order wise of "woTransEqpDataElementID" so that in case of sub-form , we get unique rowNumber (as first field empty - case in multiple row of sub-form)*/
                    subFormTransList = _.orderBy(subFormTransList, 'woTransEqpDataElementID');
                    subFormTransList = _.uniqBy(subFormTransList, function (elem) { return [elem.rowNumber, elem.parentDataElementID].join(); });
                }

                return {
                    dataElementList: dataElementList,
                    removeElementList: removeElementList,
                    subFormTransList: subFormTransList,
                    deletedsubFormTransIDs: deletedsubFormTransIDs,
                    removeSubFormTransListConditional: removeSubFormTransListConditional
                };
            },
            getworkorderTransEquipmentSubFormDetail: () =>  $resource(CORE.API_URL + 'workorderTransEquipmentSubFormDetail/getworkorderTransEquipmentSubFormDetail', {
                parentDataElementIDs: '@_parentDataElementIDs',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            retrieveWorkorderOperationEquipmentDataElementList: () => $resource(CORE.API_URL + 'workorder_trans_equipment_dataelement_values/retrieveWorkorderOperationEquipmentDataElementList', {
                woOPID: '@_woOPID',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            clearGlobalTransIDsArrayOnInit: () => {
                deletedsubFormTransIDs = [];
            },
        };
    }
})();