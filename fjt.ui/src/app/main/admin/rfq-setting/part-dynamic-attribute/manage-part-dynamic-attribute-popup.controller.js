(function () {
    'use strict';
    angular
        .module('app.admin.rfqsetting')
        .controller('ManagePartDynamicAttributePopupController', ManagePartDynamicAttributePopupController);
    /** @ngInject */
    function ManagePartDynamicAttributePopupController($mdDialog, data, CORE, USER, RFQSettingFactory, BaseService, $q, DialogFactory, ComponentFactory, $scope, $timeout, Upload) {
        const vm = this;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.taToolbar = CORE.Toolbar;
        vm.DefaultDateFormat = _dateDisplayFormat;
        vm.EmptyMesssageAliaslist = USER.ADMIN_EMPTYSTATE.MFG;
        vm.tables = CORE.TABLE_NAME.COMPONENT_PARTSTATUS;
        vm.checkDirty = false;
        vm.searchType = CORE.RFQ_SETTING.PartStatus;
        vm.isMaster = data ? data.isMaster : false;
        vm.valueDateOptions = {
            valueDateOpenFlag: false
        };
        let oldImgfile;
        vm.RadioGroup = {
            isActive: {
                array: CORE.ActiveRadioGroup
            }
        }
        let getAttributeType = (item) => {
            if (item) {
                vm.partDynamicAttributeModel.fieldType = item.fieldType;
                vm.partDynamicAttributeModel.defaultValue = "";
            }
        }
        let getDefaultValue = (item) => {
            if (item) {
                vm.partDynamicAttributeModel.defaultValue = item.defaultValue;
            }
        }
        vm.valueDateChanged = () => {
            vm.valueDateOptions = {
                valueDateOpenFlag: false
            };
        }
        function init() {
            vm.partDynamicAttributeModel = {
                attributeName: data && data.attributeName ? data.attributeName : data && data.Name ? data.Name : null,
                fieldType: data && data.fieldType ? data.fieldType : _.head(CORE.AttributeTypeDropdown).fieldType,
                isActive: data ? data.isActive : true,
                defaultValue: "",
                description: ""
            };
          vm.copyActive = angular.copy(vm.partDynamicAttributeModel.isActive);
            vm.attributeTypeList = CORE.AttributeTypeDropdown;
            vm.boolValueList = CORE.AttributeBoolValueDropdown;
            vm.name = vm.partDynamicAttributeModel.attributeName;
            vm.autoCompleteAttributeType = {
                columnName: 'fieldType',
                keyColumnName: 'fieldType',
                keyColumnId: vm.partDynamicAttributeModel.fieldType ? vm.partDynamicAttributeModel.fieldType : null,
                inputName: 'fieldType',
                placeholderName: 'Data Type',
                isRequired: true,
                isAddnew: false,
                onSelectCallbackFn: getAttributeType
            }
            if (data && data.id) {
                vm.partDynamicAttributeModel.id = data.id;
                vm.attributeId = data.id;
                var promises = [retrivePartAttribute()];
                vm.cgBusyLoading = $q.all(promises).then((responses) => {
                    vm.autoCompleteBoolValue = {
                        columnName: 'defaultValue',
                        keyColumnName: 'defaultValue',
                        keyColumnId: vm.partDynamicAttributeModel.defaultValue ? vm.partDynamicAttributeModel.defaultValue : null,
                        inputName: 'defaultValue',
                        placeholderName: 'Default Value',
                        isRequired: true,
                        isAddnew: false,
                        onSelectCallbackFn: getDefaultValue
                    }
                });
            } else {
              vm.imagefile = stringFormat("{0}{1}", CORE.WEB_URL, CORE.NO_IMAGE_OPERATIONAL_ATTRIBUTES);
                vm.autoCompleteBoolValue = {
                    columnName: 'defaultValue',
                    keyColumnName: 'defaultValue',
                    keyColumnId: null,
                    inputName: 'defaultValue',
                    placeholderName: 'Default Value',
                    isRequired: true,
                    isAddnew: false,
                    onSelectCallbackFn: getDefaultValue
                }
            }
        }
        init();

        vm.cropImage = (file, ev) => {
            if (!file && ev.type == "change") {
                vm.partAttributeForm.flagImage.$dirty = false;
                let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INVALID_FILE_TYPE);
                let alertModel = {
                    messageContent: messageContent,
                    multiple: true
                };
                DialogFactory.messageAlertDialog(alertModel);
                return;
            }
            else if (!file) {
                vm.partAttributeForm.flagImage.$dirty = false;
                return;
            }
            //file.isFlagImage = true;
            DialogFactory.dialogService(
                USER.IMAGE_CROP_CONTROLLER,
			    USER.IMAGE_CROP_VIEW,
			    ev,
			    file).then((res) => {
			        vm.originalFileName = file.name;
			        vm.croppedImage = res.croppedImage;
			        vm.imagefile = vm.croppedImage;
			        vm.partAttributeForm.$$controls[0].$setDirty();
			    }, (cancel) => {
			        vm.partDynamicAttributeModel.icon = "";
			        vm.croppedImage = null;
			        oldImgfile = "";
			        vm.partDynamicAttributeModel.fileArray = "";
			        vm.partAttributeForm.flagImage.$dirty = true;
			    }, (err) => {
			        if (oldImgfile == vm.imagefile) {
			            vm.partAttributeForm.flagImage.$dirty = false;
			        }
			    });
        };

        vm.deleteImage = () => {
            vm.partAttributeForm.$$controls[0].$setDirty();
            if (vm.partAttributeForm.icon || vm.imagefile) {
                vm.partAttributeForm.icon = "";
                vm.croppedImage = null;
                oldImgfile = "";
                vm.partAttributeForm.fileArray = "";
                vm.originalFileName = "";
                vm.partDynamicAttributeModel.icon = "";
              return vm.imagefile = stringFormat("{0}{1}", CORE.WEB_URL, CORE.NO_IMAGE_OPERATIONAL_ATTRIBUTES);
            }
        };

        //retrive part attribute list
        function retrivePartAttribute() {
            return RFQSettingFactory.retrivePartDynamicAttribute().query({
                id: vm.partDynamicAttributeModel.id
            }).$promise.then((response) => {
                if (response && response.data) {
                    vm.partDynamicAttributeModel = response.data;
                    if (vm.partDynamicAttributeModel.fieldType == vm.attributeTypeList[1].fieldType && vm.partDynamicAttributeModel.defaultValue != null && vm.partDynamicAttributeModel.defaultValue != "") {
                        vm.partDynamicAttributeModel.defaultValue = Number(vm.partDynamicAttributeModel.defaultValue);
                    }
                    vm.partDynamicAttributeModel.defaultValue = vm.partDynamicAttributeModel.defaultValue ? vm.partDynamicAttributeModel.defaultValue : "";
                    vm.attributeId = data.id;
                    if (vm.attributeId) {
                        if (vm.partDynamicAttributeModel.icon) {
                            vm.imagefile = stringFormat("{0}{1}{2}", CORE.WEB_URL, USER.DYNAMIC_ATTRIBUTE_BASE_PATH, vm.partDynamicAttributeModel.icon);
                            oldImgfile = vm.partDynamicAttributeModel.icon ? vm.partDynamicAttributeModel.icon : "";
                            vm.originalFileName = vm.partDynamicAttributeModel.icon; // not original - here after saved new unique generated file name
                        } else {
                          vm.imagefile = stringFormat("{0}{1}", CORE.WEB_URL, CORE.NO_IMAGE_OPERATIONAL_ATTRIBUTES);
                        }
                        vm.partDynamicAttributeModelCopy = _.clone(vm.partDynamicAttributeModel);
                    }
                }
                return response;
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

      vm.savePartDynamicAttribute = (ev) => {
        if (BaseService.focusRequiredField(vm.partAttributeForm)) {
          return;
        }
        if (vm.copyActive != vm.partDynamicAttributeModel.isActive && vm.partDynamicAttributeModel.id) {
          let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.STATUS_CHANGE_CONFIRMATION);
          messageContent.message = stringFormat(messageContent.message, vm.copyActive ? 'Active' : 'Inactive', vm.partDynamicAttributeModel.isActive ? 'Active' : 'Inactive');
          let obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              savePartDynamicAttribute(ev);
            }
          }, () => {
            // empty
          });
        } else {
          savePartDynamicAttribute(ev);
        }
            
        }
      
        function savePartDynamicAttribute() {
            if (vm.partAttributeForm.$invalid) {
                BaseService.focusRequiredField(vm.partAttributeForm);
                return;
            }

            if (vm.croppedImage) {
                let filename = vm.originalFileName;
                let originalFileName = filename.substr(0, filename.lastIndexOf('.')) || filename;
                vm.imageName = `${originalFileName}.png`;
                vm.partDynamicAttributeModel.fileArray = Upload.dataUrltoBlob(vm.croppedImage,
                vm.imageName);
            }

            if (vm.partDynamicAttributeModel.fileArray) {
                vm.partDynamicAttributeModel.icon = vm.partDynamicAttributeModel.fileArray;
            }
            vm.partDynamicAttributeModel.imageName = oldImgfile;
            //vm.partDynamicAttributeModel.icon = "";
            vm.partDynamicAttributeModel.defaultValue = vm.partDynamicAttributeModel.defaultValue ? vm.partDynamicAttributeModel.defaultValue : null;
          if (vm.partDynamicAttributeModel.fieldType == vm.attributeTypeList[3].fieldType &&
            vm.partDynamicAttributeModel.defaultValue &&
            vm.partDynamicAttributeModel.defaultValue instanceof Date) {
            vm.partDynamicAttributeModel.defaultValue = BaseService.getAPIFormatedDate(vm.partDynamicAttributeModel.defaultValue);
          }

            if (vm.partDynamicAttributeModel && vm.partDynamicAttributeModel.id) {
                vm.cgBusyLoading = Upload.upload({
                  url: CORE.API_URL + 'operationalattributes/updatePartDynamicAttribute',
                    data: vm.partDynamicAttributeModel,
                }).then((res) => {
                  if (res && res.data && res.data.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                    BaseService.currentPagePopupForm.pop();
                    $mdDialog.hide(vm.partDynamicAttributeModel.id);
                  } else {
                    if (checkResponseHasCallBackFunctionPromise(res)) {
                      res.alretCallbackFn.then(() => {
                        BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.partAttributeForm);
                      });
                    }

                  }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            } else {
                vm.cgBusyLoading = Upload.upload({
                  url: CORE.API_URL + 'operationalattributes/createPartDynamicAttribute',
                    data: vm.partDynamicAttributeModel,
                }).then((res) => {
                  if (res.data.data) {
                    BaseService.currentPagePopupForm.pop();
                    $mdDialog.hide(res.data.data);
                  } else {
                    if (checkResponseHasCallBackFunctionPromise(res)) {
                      res.alretCallbackFn.then(() => {
                        BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.partAttributeForm);
                      });
                    }
                  }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
        };

        vm.cancel = () => {
            let isdirty = BaseService.checkFormDirty(vm.partAttributeForm, vm.checkDirtyObject);
            if (isdirty || vm.checkDirty) {
                let data = {
                    form: vm.partAttributeForm
                }
                BaseService.showWithoutSavingAlertForPopUp(data);
            } else {
                BaseService.currentPagePopupForm.pop();
                $mdDialog.cancel();
            }
        };

        vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
            return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
        }

        // Function call on part Operational attribute blur event and check name exist or not
        vm.checkNameUnique = (data, isExists) => {
            if (data) {
                vm.isduplicate = false;
                let objs = {
                    attributeName: isExists ? data : null,
                    id: vm.partDynamicAttributeModel.id ? vm.partDynamicAttributeModel.id : null
                };
                vm.cgBusyLoading = RFQSettingFactory.checkDuplicatePartDynamicAttribute().query(objs).$promise.then((res) => {
                    if (res && res.status == CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicate) {
                        vm.isduplicate = true;

                      var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY);
                      messageContent.message = stringFormat(messageContent.message, vm.partDynamicAttributeModel.attributeName);
                      messageContent.controlName = "attributeName";
                        vm.partDynamicAttributeModel.attributeName = null;
                      displayCodeAliasUniqueMessage(messageContent);
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
        }

        /* mfg code unique message */
        let displayCodeAliasUniqueMessage = (uniqueObj) => {
            let obj = {
                messageContent: uniqueObj,
                multiple: true
            };
          DialogFactory.messageAlertDialog(obj).then((yes) => {
            setFocus('attributeName');
            }, (cancel) => {
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        //on load submit form 
      angular.element(() => {
        BaseService.currentPagePopupForm.push(vm.partAttributeForm);
      });
    }
})();
