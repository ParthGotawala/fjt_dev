(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('DataElementTransactionValuesManualFactory', ['$resource', '$http', '$filter', 'CORE', 'NotificationFactory', DataElementTransactionValuesManualFactory]);

  /** @ngInject */
  function DataElementTransactionValuesManualFactory($resource, $http, $filter, CORE, NotificationFactory) {
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
        if ((value != "" && value != null && typeof value != undefined) || (typeof value == "string" && value.trim() != "") || (obj.dataElementTransID) || (obj.parentDataElementID)) {
          return {
            dataElementTransManualID: obj.dataElementTransID,
            dataElementID: obj.dataElementID,
            parentDataElementID: obj.parentDataElementID,
            refSubFormTransID: obj.refSubFormTransID,
            rowNumber: obj.rowNumber,
            value: value,
            isUnique: obj.isUnique,
            isAutoIncrement: obj.isAutoIncrement,
            dataElementName: obj.dataElementName,
            controlTypeID: obj.controlTypeID,
            // Added to display success msg on data save
            validationExprSuccessMsg: obj.validationExprSuccessMsg,
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

      getDataElementTransactionValuesManual: () => $resource(CORE.API_URL + 'dataelement_transactionvalues_manual/:refTransID/:entityID', {
        refTransID: '@_refTransID',
        entityID: '@_entityID',
      }, {
        query: {
          isArray: false
        }
      }),
      saveTransctionValue: (transactionDet, FileList) => {
        return $http({
          method: 'POST',
          url: CORE.API_URL + 'dataelement_transactionvalues_manual',
          headers: { 'Content-Type': undefined },
          transformRequest: function (data) {
            var formData = new FormData();
            formData.append("referenceTransID", angular.toJson(data.referenceTransID));
            formData.append("entityID", angular.toJson(data.entityID));
            formData.append("dataElementList", angular.toJson(data.dataElementList));
            formData.append("removeElementList", angular.toJson(data.removeElementList));
            formData.append("subFormTransList", angular.toJson(data.subFormTransList));
            formData.append("deletedsubFormTransIDs", angular.toJson(data.deletedsubFormTransIDs));
            formData.append("removeSubFormTransListConditional", angular.toJson(data.removeSubFormTransListConditional));
            _.each(data.files, function (obj, index) {
              formData.append(`file[${index}]`, obj);
            });
            formData.append("entityName", angular.toJson(data.entityName));
            return formData;
          },
          data: {
            referenceTransID: transactionDet.referenceTransID,
            entityID: transactionDet.entityID,
            dataElementList: transactionDet.dataElementList,
            removeElementList: transactionDet.removeElementList,
            subFormTransList: transactionDet.subFormTransList,
            deletedsubFormTransIDs: transactionDet.deletedsubFormTransIDs,
            removeSubFormTransListConditional: transactionDet.removeSubFormTransListConditional,
            entityName: transactionDet.entityName,
            files: FileList
          }
        }, (data) => {
          return data.Data;
        }, (e) => {
          return e;
        });
      },
      downloadDocument: (documentID) => $http.get(CORE.API_URL + "dataelement_transactionvalues_manual/downloadCustomFormDataElementDocument/" + documentID, { responseType: 'arraybuffer' }).then(function (response) {
        return response;
      }, function (error) {
        return error;
      }),
      downloadDocumentByRefID: (documentObj) => $http.post(CORE.API_URL + "dataelement_transactionvalues_manual/downloadCustomFormDataElementFileByRefID", { documentObj: documentObj }, { responseType: 'arraybuffer' }).then(function (response) {
        return response;
      }, function (error) {
        return error;
      }),
      getDataElementTransactionList: (elementList) => {
        let TransactionList = assignTransactionValues(elementList);
        //console.log(TransactionList);

        let dataElementList = _.filter(TransactionList, (obj) => {
          return ((obj.value != "" && obj.value != null && typeof obj.value != undefined) || (typeof obj.value == "string" && obj.value.trim() != "") || (obj.parentDataElementID));
        });

        /* newly added sub-form element value without refSubFormTransID */
        let listOfNewAddedValueForExistsSubformRow = _.filter(dataElementList, (item) => {
          return ((item.value != "" && item.value != null && typeof item.value != undefined) || (typeof item.value == "string" && item.value.trim() != ""))
            && !item.refSubFormTransID && item.rowNumber && item.rowNumber > 0;
        });

        _.each(listOfNewAddedValueForExistsSubformRow, (newAddedValueItem) => {
          /* matching rowNumber item from original dataElementList to set refSubFormTransID into newly added element */
          let dataElementItemOfRefSubForm = _.find(dataElementList, (dataElementListItem) => {
            return dataElementListItem.rowNumber == newAddedValueItem.rowNumber && dataElementListItem.refSubFormTransID > 0
              && dataElementListItem.parentDataElementID == newAddedValueItem.parentDataElementID;
          });

          if (dataElementItemOfRefSubForm) {
            /* get original item from dataElementList to set refSubFormTransID */
            let dataElementItemToSetRefSubForm = _.find(dataElementList, (dataElementListItem) => {
              return newAddedValueItem == dataElementListItem;
            });
            if (dataElementItemToSetRefSubForm) {
              dataElementItemToSetRefSubForm.refSubFormTransID = dataElementItemOfRefSubForm.refSubFormTransID;
            }
          }
        });


        /* remove element values which contain no data including sub-form elements  */
        let removeElementList = _.filter(TransactionList, (obj) => {
          return ((obj.dataElementTransManualID) && (obj.value == "" || obj.value == null || typeof obj.value == undefined || (typeof obj.value == "string" && obj.value.trim() == "")));
        }).map((obj) => { return obj.dataElementTransManualID });


        /* take ref_sub-form_id of sub-form elements to check any record exists for sub-form.
         if not then remove sub-form self entry from subform_data - (code in api -> pass ref_sub-form_id ids from here)*/
        let removeSubFormTransListConditional = [];
        removeSubFormTransListConditional = _.filter(TransactionList, (obj) => {
          return ((obj.dataElementTransManualID) && (obj.value == "" || obj.value == null || typeof obj.value == undefined || (typeof obj.value == "string" && obj.value.trim() == "")));
        });
        if (removeSubFormTransListConditional && removeSubFormTransListConditional.length > 0) {
          removeSubFormTransListConditional = _.uniq(_.map(removeSubFormTransListConditional, 'refSubFormTransID'));
        }


        let subFormTransList = _.filter(TransactionList, (obj) => {
          return (obj.parentDataElementID);
        })

        if (subFormTransList && subFormTransList.length > 0) {
          _.each(subFormTransList, (listItem) => {
            listItem.subFormTransID = listItem.refSubFormTransID;
          });

          /* [S] code to remove blank rows of sum form */
          let rowNumWiseSubFormTransList = _.groupBy(subFormTransList, function (elem) { return [elem.rowNumber, elem.parentDataElementID].join(); });
          _.each(rowNumWiseSubFormTransList, (itemlist) => {
            let isAllEmpty = _.every(itemlist, (obj) => {
              return ((!obj.dataElementTransManualID) && (obj.value == "" || obj.value == null || typeof obj.value == undefined || (typeof obj.value == "string" && obj.value.trim() == "")));
            });
            if (isAllEmpty) {
              subFormTransList = _.difference(subFormTransList, itemlist);
            }
          })
          /* [E] code to remove blank rows of sum form */

          /* set data order wise of "dataElementTransManualID" so that in case of sub-form , we get unique rowNumber (as first field empty - case in multiple row of sub-form)*/
          subFormTransList = _.orderBy(subFormTransList, 'dataElementTransManualID');
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
      //getSubformTransactionDetail: () =>  $resource(CORE.API_URL + 'getSubformTransactionDetail', {
      //    parentDataElementIDs: '@_parentDataElementIDs',
      //}, {
      //    query: {
      //        method: 'POST',
      //        isArray: false
      //    }
      //}),

      dynamicmasterentity: () => $resource(CORE.API_URL + 'dataelement_transactionvalues_manual/getDataElement_TransactionValuesManualListByEntity', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      getDETransValuesManualByDataelementFields: () => $resource(CORE.API_URL + 'dataelement_transactionvalues_manual/:dataElementID', {
        dataElementID: '@_dataElementID',
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),

      deleteDataElement_TransactionValuesManual: () => $resource(CORE.API_URL + 'dataelement_transactionvalues_manual/deleteDataElement_TransactionValuesManual', {
        listObj: '@_listObj',
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      clearGlobalTransIDsArrayOnInit: () => {
        deletedsubFormTransIDs = [];
      },
      // Display success message of each field if assigned on validation options
      displaySuccessMessage: function (dataElementList) {
        dataElementList.forEach((item) => {
          if (item.validationExprSuccessMsg)
            NotificationFactory.success(item.validationExprSuccessMsg);
        });
      },
      retrieveDataElement_TransValues_Manual_History: (param) => $resource(CORE.API_URL + 'dataelement_transactionvalues_manual/retrieveDataElement_TransValues_Manual_History', {
      }, {
        query: {
          isArray: false,
          params: {
            page: param && param.Page ? param.Page : 1,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
            entityID: param.entityID ? JSON.stringify(param.entityID) : null,
            refTransID: param.refTransID ? JSON.stringify(param.refTransID) : null,
            isSubForm: param.isSubForm ? param.isSubForm : null
          }
        },

      }),
    };

  }
})();
