(function () {
  'use strict';

  angular.module('app.core').controller('FieldMappingController', FieldMappingController);
  function FieldMappingController(data, ImportExportFactory, NotificationFactory, DialogFactory, EmployeeFactory, CORE, USER, Upload, $timeout, $filter, $sce, $injector, $q, BaseService) { // eslint-disable-line func-names
    const vm = this;
    vm.isNoDataFound = true;
    vm.PhonePattern = CORE.PhonePattern;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.IMPORT_FIELDS;
    vm.fieldMappingList = [];
    vm.dbFieldList = data.dbfield;
    vm.dbFieldList = _.orderBy(vm.dbFieldList, ['displayOrder'], ['asc']);
    vm.isMapping = false;
    vm.selectedFile = false;
    vm.entityName = data.entity;
    vm.fileTypeList = CORE.Import_export_FileTypeList;
    let ImportExportEntityObj = CORE.Import_export;
    let MFGTypes = CORE.MFGTypeDropdown;

    vm.documentType = CORE.DocumentType.Document;

    let FileAllow = CORE.FileTypeList;

    var defaultAutoCompleteHeader = {
      columnName: 'key',
      keyColumnName: 'key',
      keyColumnId: null,
      inputName: 'Column',
      placeholderName: 'Column',
      isRequired: false,
      isAddnew: false,
      callbackFn: null,
      onSelectCallbackFn: function (selectedItem) {
      }
    }
    //vm.file.docURL = $sce.trustAsResourceUrl(`https://docs.google.com/gview?url=http://fjt.i-nnate.com/api/uploads/operation/images/abc.docx&embedded=true`);
    vm.documentFiles = (file) => {
      if (file.length > 0) {
        let ext = null;
        _.each(file, (item) => {
          ext = (item.name).substr((item.name).lastIndexOf('.') + 1);
        });
        if (!ext || !(_.some(vm.fileTypeList, { 'extension': ext }))) {
          let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_TYPE_NOT_ALLOWED);
          messageContent.message = stringFormat(messageContent.message, ".xls, .xlsx");
          var model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        };

        if (!data.entity) {
          let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SOMTHING_WRONG);
          var model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        }

        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SURE_TO_IMPORT_GENERICCATEGRY_FILE);
        messageContent.message = stringFormat(messageContent.message, data.entity);

        let obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        vm.excelFieldList = [];
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.fieldMappingList = [];
            vm.cgBusyLoading = Upload.upload({
              url: `${CORE.API_URL}uploadmodelDocuments`,
              method: 'POST',
              data: {
                documents: file,
                entity: data.entity,
                entitymodel: data.entitymodel,
              }
            }).progress((evt) => {
              file.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).then((res) => {
              if (res.data && res.data.status == "SUCCESS") {
                if (res.data.data) {
                  BaseService.currentPagePopupForm.pop();
                  vm.isNoDataFound = false;
                  vm.selectedFile = true;
                  vm.excelFieldList = res.data.data;
                  _.each(vm.excelFieldList, (item) => {
                    if (item.key.includes("*")) {
                      item.key = item.key.slice(0, -1);
                    }
                  });
                  vm.dbFieldList.forEach((item) => {
                    var fieldItem = {
                      header: item.displayName,
                      actualField: item.field,
                      required: item.required
                    }
                    var autoCompleteHeader = angular.copy(defaultAutoCompleteHeader);
                    var excelHeaderObj = vm.excelFieldList.find((x) => {
                      return x.key.replace().toUpperCase() == item.displayName.toUpperCase();
                    });
                    autoCompleteHeader.keyColumnId = excelHeaderObj ? excelHeaderObj.key : null;
                    fieldItem.autoCompleteHeader = autoCompleteHeader;

                    vm.fieldMappingList.push(fieldItem);
                  });
                }
                //NotificationFactory.success("Document Upload Successfully.");
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
      else {
      }
    };
    let querySearchForExcelField = (query) => {
      if (vm.excelFieldList) {
        vm.list = $filter('filter')(vm.excelFieldList, { key: query });
        return vm.list;
      }
      else {
        return [];
      }
    }
    vm.querySearchForExcelField = querySearchForExcelField;

    vm.importFile = () => {
      //ng-disabled="vm.isNoDataFound == true ||!vm.dataElementValueForm.$valid"
      if (vm.isNoDataFound == true || vm.dataElementValueForm.$invalid) {
        BaseService.focusRequiredField(vm.dataElementValueForm);
        return;
      }
      vm.bulkData = [];
      let SelectedFieldsList = _.filter(vm.fieldMappingList, function (data) {
        return data.autoCompleteHeader.keyColumnId != null;
      });
      /* if no any import document field mapped with shown field then error */
      if (SelectedFieldsList.length == 0) {
        var model = {
          messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MAPPING_ERROR),
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }

      /* create/set executable data list from document data to create entity data */
      var result = [];
      SelectedFieldsList.forEach(function (data) {
        var key = data.autoCompleteHeader.keyColumnId;
        var excelData = _.find(vm.excelFieldList, function (item) {
          return item.key == key;
        });
        if (excelData.Data != null) {
          excelData = excelData.Data.map((item) => {
            return {
              [data.actualField]: item
            };
          });
          result.push(excelData);
        }
      });
      _.each(result, (item, i) => {
        _.merge(vm.bulkData, item);
      });

      /* no any record in document to import than error */
      if (vm.bulkData.length == 0) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.IMPORT_FILE_NO_DATA_FOUND);
        var model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }

      /* Check defined validation */
      let API = CORE.Import_export[data.entitymodel];
      let requiredvalidation = API.requiredField || [];
      let validation = API.validateField || [];
      let categoryValidation = API.categoryValidation || [];
      let numbervalidation = API.numberField || [];
      let fixedValueFieldsValidation = API.fixedValueField || [];
      let phonevalidation = API.phoneField || [];
      let maxLengthFieldValidation = API.maxLengthFieldValidation || [];
      let minLengthFieldValidation = API.minLengthFieldValidation || [];
      let emailValidation = API.emailField || [];
      let noSpecialCharValidation = API.specialCharNotInclude || [];
      vm.indvalidData = [];
      vm.data = [];
      _.each(vm.bulkData, (item, inx) => {

        /* Required field Validation */
        _.each(requiredvalidation, (field) => {
          if (!item[field]) {
            if (!item.error) {
              item.error = "";
            }
            /* to display actual field that user define in import document */
            let matchedField = _.find(vm.fieldMappingList, (mappedItem) => {
              return mappedItem.actualField == field;
            });
            item.error += "\n" + " " + (matchedField ? matchedField.header : field) + " " + 'is required. ';
          }
        })

        /* max length validation */
        _.each(maxLengthFieldValidation, (field) => {
          _.forOwn(field, function (value, key) {
            if (item[key]) {
              let fieldFormattedData = item[key];
              if (_.includes(CORE.Import_export.fields_RemoveSpecialCharFromPhoneTypeFieldValue, key)) {
                fieldFormattedData = replaceSpecialCharForPhone(fieldFormattedData);
              }
              if (fieldFormattedData && fieldFormattedData.toString().length > value) {
                if (!item.error) {
                  item.error = "";
                }
                /* to display actual field that user define in import document */
                let matchedField = _.find(vm.fieldMappingList, (mappedItem) => {
                  return mappedItem.actualField == key;
                });
                item.error += "\n" + " " + (matchedField ? matchedField.header : key) + " " + 'max ' + value + ' char, You have entered ' + fieldFormattedData.toString().length + ' char!.';
                fieldFormattedData = null;
              }
            }
          });
        })

        /* min length validation */
        _.each(minLengthFieldValidation, (field) => {
          _.forOwn(field, function (value, key) {
            if (item[key]) {
              if (item[key].length < value) {
                if (!item.error) {
                  item.error = "";
                }
                /* to display actual field that user define in import document */
                let matchedField = _.find(vm.fieldMappingList, (mappedItem) => {
                  return mappedItem.actualField == key;
                });
                item.error += "\n" + " " + (matchedField ? matchedField.header : key) + " " + 'min' + value + ' char, You have entered ' + item[key].length + ' char!.';
              }
            }
          });
        })

        /* Number type field Validation */
        _.each(numbervalidation, (field) => {
          if (item[field]) {
            var val = Number(item[field]);
            if (isNaN(val)) {
              if (!item.error) {
                item.error = "";
              }
              /* to display actual field that user define in import document */
              let matchedField = _.find(vm.fieldMappingList, (mappedItem) => {
                return mappedItem.actualField == field;
              });
              item.error += "\n" + " " + (matchedField ? matchedField.header : field) + " " + 'must be number. ';
            }
          }
        })

        /* Valid field Validation like Unique field value */
        _.each(validation, (data) => {
          if (item[data.field]) {
            let matchFields = [];
            if (data.type) {
              matchFields = _.filter(vm.bulkData, function (obj) {
                return item != obj && obj[data.field] == item[data.field]
                  && obj[data.type] == item[data.type]
              });
            }
            else {
              matchFields = _.filter(vm.bulkData, function (obj) {
                return item != obj && obj[data.field] == item[data.field]
              });
            }

            _.each(matchFields, (match, idx) => {
              if (!match.error) {
                match.error = "";
              }

              /* to display actual field that user define in import document */
              let matchedField = _.find(vm.fieldMappingList, (mappedItem) => {
                return mappedItem.actualField == data.field;
              });
              match.error += "\n" + " " + (matchedField ? matchedField.header : data.field) + " " + 'must be unique. ';
            });
          }
        });

        /* phone number Validation */
        _.each(phonevalidation, (fieldList) => {
          if (item[fieldList.phField]) {
            let fieldFormattedData = replaceSpecialCharForPhone(item[fieldList.phField]);

            if (item[fieldList.matchCountryCodeField]) {
              // check CountryCode is number type
              let countryCodeData = Number(item[fieldList.matchCountryCodeField]);
              if (isNaN(countryCodeData)) {
                if (!item.error) {
                  item.error = "";
                }
                /* to display actual field that user define in import document */
                let matchedField = _.find(vm.fieldMappingList, (mappedItem) => {
                  return mappedItem.actualField == fieldList.matchCountryCodeField;
                });
                item.error += "\n" + " " + (matchedField ? matchedField.header : field) + " " + 'must be number. ';
              }
            }
            else {
              // set default 1 - US country code if blank value
              item[fieldList.matchCountryCodeField] = "1";
            }

            let $newDiv = $('<div class="intel-tel-input-from-import-file-dynamic"><input type="hidden" name="importAllPhoneDiv" type="tel" id="contact_' + inx
              + '" value="' + "+" + item[fieldList.matchCountryCodeField] + " " + fieldFormattedData + '" /></div>');
            //    + '" value="' + "+" + item[fieldList.matchCountryCodeField] + fieldFormattedData + '" />');
            angular.element(document).injector().invoke(['$compile', function ($compile) {
              var div = $compile($newDiv);
              var content = div(vm);  //$scope
              $(document.body).append(content);
            }]);

            $("#contact_" + inx).intlTelInput();

            let telInput = $("#contact_" + inx);
            let iso2CountryShortName = telInput.intlTelInput("getSelectedCountryData").iso2;
            if (iso2CountryShortName) {
              iso2CountryShortName = iso2CountryShortName.toUpperCase();
              let num = telInput.intlTelInput("getNumber", 2);
              let format = intlTelInputUtils.numberFormat.INTERNATIONAL;
              let formatedNumber = intlTelInputUtils.formatNumber(num, iso2CountryShortName, format);
              telInput.intlTelInput("setCountry", iso2CountryShortName);

              if ($.trim(telInput.val())) {

                if (telInput.intlTelInput("isValidNumber")) {
                  //item[fieldList.phField] = formatedNumber;
                  //item[fieldList.matchCountryCodeField] = iso2CountryShortName;
                  //item[fieldList.phField + "_ConvertedData"] = "+" + item[fieldList.matchCountryCodeField] + " " + fieldFormattedData;
                  item[fieldList.phField + "_ConvertedData"] = formatedNumber;
                  item[fieldList.matchCountryCodeField + "_ConvertedData"] = iso2CountryShortName;
                }
                else {
                  if (!item.error) {
                    item.error = "";
                  }

                  /* to display actual field that user define in import document */
                  let matchedField = _.find(vm.fieldMappingList, (mappedItem) => {
                    return mappedItem.actualField == fieldList.phField;
                  });
                  let matchedCountryCodeField = _.find(vm.fieldMappingList, (mappedItem) => {
                    return mappedItem.actualField == fieldList.matchCountryCodeField;
                  });
                  item.error += "\n" + " " + "Please enter valid " + (matchedField ? matchedField.header : field)
                    + "/" + (matchedCountryCodeField ? matchedCountryCodeField.header : fieldList.matchCountryCodeField) + ".";
                }
              }
            }
            else {
              // when country code is not valid then display error message
              if (!item.error) {
                item.error = "";
              }

              /* to display actual field that user define in import document */
              let matchedField = _.find(vm.fieldMappingList, (mappedItem) => {
                return mappedItem.actualField == fieldList.matchCountryCodeField;
              });
              item.error += "\n" + " " + "Please enter valid " + (matchedField ? matchedField.header : field) + ".";
            }
            $("div.intel-tel-input-from-import-file-dynamic").remove(); // to remove dynamically generated phone div
          }
          else {
            // when country code added and phone number not added then display error message
            if (item[fieldList.matchCountryCodeField]) {
              if (!item.error) {
                item.error = "";
              }

              /* to display actual field that user define in import document */
              let matchedField = _.find(vm.fieldMappingList, (mappedItem) => {
                return mappedItem.actualField == fieldList.phField;
              });
              item.error += "\n" + " " + "Please enter valid " + (matchedField ? matchedField.header : field) + ".";
            }
          }
        });
        $("div.intel-tel-input-from-import-file-dynamic").remove(); // to remove dynamically generated phone div


        /* field value is from specific values validation */
        if (fixedValueFieldsValidation && fixedValueFieldsValidation.length > 0) {
          switch (data.entitymodel) {
            case ImportExportEntityObj.Manufacturer.Model:
              _.each(fixedValueFieldsValidation, (field) => {
                switch (field) {
                  case "mfgType":
                    let matchFields = _.filter(MFGTypes, function (obj) { return item[field] == obj.Value });
                    if (!matchFields || matchFields.length == 0) {
                      if (!item.error) {
                        item.error = "";
                      }

                      /* to display actual field that user define in import document */
                      let matchedField = _.find(vm.fieldMappingList, (mappedItem) => {
                        return mappedItem.actualField == field;
                      });
                      item.error += "\n" + " " + (matchedField ? matchedField.header : field) + " " + 'value must be from "' + _.map(MFGTypes, 'Value').toString() + '".';
                    }
                    break;
                  default:
                    break;
                }
              });
              break;
            case ImportExportEntityObj.Equipment.Model:
              _.each(fixedValueFieldsValidation, (field) => {
                switch (field) {
                  case "equipmentAs":
                    let matchFields = _.filter(CORE.EquipmentToolAs, function (value) { return item[field] == value });
                    if (!matchFields || matchFields.length == 0) {
                      if (!item.error) {
                        item.error = "";
                      }

                      /* to display actual field that user define in import document */
                      let matchedField = _.find(vm.fieldMappingList, (mappedItem) => {
                        return mappedItem.actualField == field;
                      });
                      item.error += "\n" + " " + (matchedField ? matchedField.header : field) + " " + 'value must be from "' + CORE.EquipmentToolAs + '".';
                    }
                    break;
                }
              });
              break;
            default:
              break;
          }
        }

        /*Add email address validation */
        if (emailValidation && emailValidation.length > 0) {
          const emailPattern = CORE.EmailPattern;  // /^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,7})$/;
          _.each(emailValidation, (field) => {
            if (item[field].text && !new RegExp(emailPattern).test(item[field].text)) {
              if (!item.error) {
                {
                  item.error = '';
                }
                const matchedField = _.find(vm.fieldMappingList, (mappedItem) => mappedItem.actualField === field);
                item.error += '\n' + ' ' + 'Please enter valid ' + (matchedField ? matchedField.header : field) + '.';
              }
              //if (!item[field].text) {
              //  if (!item.error) {
              //    item.error = '';
              //  }
              //  const matchedField = _.find(vm.fieldMappingList, (mappedItem) => mappedItem.actualField === field);
              //  item.error += '\n' + ' ' + 'Please enter valid ' + (matchedField ? matchedField.header : field) + '.';
              //} else if (!new RegExp(emailPattern).test(item[field].text)) {
              //  if (!item.error) {
              //    item.error = '';
              //  }
              //  const matchedField = _.find(vm.fieldMappingList, (mappedItem) => mappedItem.actualField === field);
              //  item.error += '\n' + ' ' + 'Please enter valid ' + (matchedField ? matchedField.header : field) + '.';
            }
          });

          /** Add validation for not to include special character **/
          if (noSpecialCharValidation && noSpecialCharValidation.length > 0) {
            // const spCharExp =  /^[^`~!@#$%\^*()_+={}[\]\\:';"<>?/]*$/;
            const spCharExp = CORE.restrictSpecialCharatorPattern;
            _.each(noSpecialCharValidation, (field) => {
              if (typeof (item[field]) === 'object') {
                if (!item.error) {
                  item.error = '';
                }
                const matchedField = _.find(vm.fieldMappingList, (mappedItem) => mappedItem.actualField === field);
                item.error += '\n' + ' ' + 'Please enter valid ' + (matchedField ? matchedField.header : field) + '.';
              } else if (!item[field].match(spCharExp)) {  // new RegExp(spCharExp).test(item[field])
                if (!item.error) {
                  item.error = '';
                }
                const matchedField = _.find(vm.fieldMappingList, (mappedItem) => mappedItem.actualField === field);
                item.error += '\n' + ' ' + 'Please enter valid ' + (matchedField ? matchedField.header : field) + '.';
              }
            });
          }
        }
      });

      var isError = _.some(vm.bulkData, (x) => { return x.error != null && x.error != ''; });
      if (isError) {
        // if personnel entity then remove extra added converted field value from excel export
        if (data.entity == CORE.Import_export.Personnel.FileName) {
          _.each(vm.bulkData, (item, inx) => {
            _.each(phonevalidation, (fieldList) => {
              delete item[fieldList.phField + "_ConvertedData"];
              delete item[fieldList.matchCountryCodeField + "_ConvertedData"];
            })
          });
        }

        let errorFileAllData = vm.bulkData;
        let mappedFieldsList = _.filter(vm.fieldMappingList, function (data) {
          return data.autoCompleteHeader.keyColumnId != null;
        });
        let keysOfErrorDataList = Object.keys(errorFileAllData[0]);
        // manually add error field in to keys in case of errorResponseData[0] not contain any error
        if (!_.includes(keysOfErrorDataList, "error")) {
          keysOfErrorDataList.push("error");
        }

        /* create mapped object with replaced from-to key */
        let keyMap = {};
        _.each(keysOfErrorDataList, (key) => {
          let matchedField = _.find(mappedFieldsList, (mappedItem) => {
            return mappedItem.actualField == key;
          });
          keyMap[key] = matchedField ? matchedField.autoCompleteHeader.keyColumnId : key;
        });

        /* replace database field key to Original document display field key */
        errorFileAllData = errorFileAllData.map(function (obj) {
          return _.mapKeys(obj, function (value, key) {
            return keyMap[key];
          });
        });

        //vm.cgBusyLoading = ImportExportFactory.importFile(vm.bulkData).then((res) => {
        vm.cgBusyLoading = ImportExportFactory.importFile(errorFileAllData).then((res) => {
          if (res.data && errorFileAllData.length > 0) {
            let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
            if (navigator.msSaveOrOpenBlob) {
              navigator.msSaveOrOpenBlob(blob, data.entity + ".xls")
            } else {
              let link = document.createElement("a");
              if (link.download !== undefined) {
                let url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", data.entity + ".xls");
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
      }
      else {
        //return;
        if (data.entity == CORE.Entity.Equipment) {
          /* if the entity type is Equipment & Workstation then bello code will execute to convert date*/
          _.each(vm.bulkData, (item) => {
            item.placedInServiceDate = item.placedInServiceDate ? BaseService.getAPIFormatedDate(item.placedInServiceDate) : null;
            item.outOfServiceDate = item.outOfServiceDate ? BaseService.getAPIFormatedDate(item.outOfServiceDate) : null;
          });
        }
        let objList = {
          entity: data.entity,
          model: data.entitymodel,
          importEntityFileData: vm.bulkData,
        }
        vm.cgBusyLoading = ImportExportFactory.createEntity().save(objList).$promise.then((res) => {
          if (res.data && res.data.isError == true && res.data.importEntityFileData && res.data.importEntityFileData.length > 0) {
            let errorResponseData = res.data.importEntityFileData;
            let mappedFieldsList = _.filter(vm.fieldMappingList, function (data) {
              return data.autoCompleteHeader.keyColumnId != null;
            });
            let keysOfErrorDataList = Object.keys(errorResponseData[0]);
            // manually add error field in to keys in case of errorResponseData[0] not contain any error
            if (!_.includes(keysOfErrorDataList, "error")) {
              keysOfErrorDataList.push("error");
            }
            /* create mapped object with replaced from-to key */
            let keyMap = {};
            _.each(keysOfErrorDataList, (key) => {
              let matchedField = _.find(mappedFieldsList, (mappedItem) => {
                return mappedItem.actualField == key;
              });
              keyMap[key] = matchedField ? matchedField.autoCompleteHeader.keyColumnId : key;
            });

            /* replace database field key to Original document display field key */
            errorResponseData = errorResponseData.map(function (obj) {
              return _.mapKeys(obj, function (value, key) {
                return keyMap[key];
              });
            });

            vm.cgBusyLoading = ImportExportFactory.importFile(errorResponseData).then((res) => {
              let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
              if (navigator.msSaveOrOpenBlob) {
                navigator.msSaveOrOpenBlob(blob, data.entity + ".xls")
              } else {
                let link = document.createElement("a");
                if (link.download !== undefined) {
                  let url = URL.createObjectURL(blob);
                  link.setAttribute("href", url);
                  link.setAttribute("download", data.entity + ".xls");
                  link.style = "visibility:hidden";
                  document.body.appendChild(link);
                  $timeout(() => {
                    link.click();
                    document.body.removeChild(link);
                  });

                }
              }
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }
          BaseService.currentPagePopupForm.pop();
          DialogFactory.hideDialogPopup();
        }).catch((error) => {
          $("div.intel-tel-input-from-import-file-dynamic").remove(); // to remove dynamically generated phone div
          return BaseService.getErrorLog(error);
        });
      }
    }

    /*Used to close pop-up*/
    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.dataElementValueForm);
      if (isdirty) {
        let data = {
          form: vm.dataElementValueForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        DialogFactory.closeDialogPopup();
      }
    };

    /* function to relplace valid special character from phone number input */
    let replaceSpecialCharForPhone = (phValue) => {
      if (phValue) {
        let matchedSpecChar = ['*', '-', '.', '(', ')', ' '];
        if (matchedSpecChar.some(word => phValue.includes(word))) {
          return phValue.replace(/[*-.() ]/g, '');
        }
        else {
          return phValue;
        }
      }
      else {
        return phValue;
      }
    }

    /*on load submit form */
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.dataElementValueForm);
    });
    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }

  }
})();
