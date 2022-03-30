(function () {
  'use strict';
  angular
    .module('app.admin.rfqsetting')
    .controller('ManagePackagingTypePopupController', ManagePackagingTypePopupController);
  /** @ngInject */
  function ManagePackagingTypePopupController($q, $mdDialog, data, CORE, USER, RFQSettingFactory, BaseService, DialogFactory, ComponentFactory, $scope, $timeout) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.EmptyMesssageAliaslist = USER.ADMIN_EMPTYSTATE.MFG;
    vm.taToolbar = CORE.Toolbar;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.tables = CORE.TABLE_NAME.COMPONENT_PACKAGINGTYPE;
    vm.isMaster = data ? data.isMaster : false;
    if (!vm.isMaster) {
      getPackagingTypeSearch();
    }
    vm.checkDirty = false;
    vm.searchType = CORE.RFQ_SETTING.PackagingType;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.pageInit = (data) => {
      vm.packagingTypeModel = {
        id: data ? data.id : null,
        name: data ? data.Name : null,
        isActive: true,
        refTableName: vm.tables,
        alias: [],
        systemGenerated: data ? data.systemGenerated : null
      };
      vm.alias = data && data.aliasText ? data.aliasText : null;
    };
    vm.pageInit(data);
    vm.name = vm.packagingTypeModel.name;
    vm.getDetails = (id) => {
      vm.packagingTypeModel.id = id;
      const promises = [retrivePackagingType(), getComponentGenericAlias()];
      vm.cgBusyLoading = $q.all(promises).then((responses) => {
        vm.packagingTypeModel.alias = responses[1];
        _.each(vm.packagingTypeModel.alias, (item) => {
          if (item.mfgCodeList) {
            item.mfgCodeList = item.mfgCodeList ? item.mfgCodeList.split('#$#') : null;
          }
          if (vm.packagingTypeModel.name) {
            item.isDefaultAlias = item.alias.toLowerCase() === vm.packagingTypeModel.name.toLowerCase();
            item.index = item.alias.toLowerCase() === vm.packagingTypeModel.name.toLowerCase() ? 1 : 2;
          }
        });
      });
    };
    if (data && (data.id || data.id === 0)) {
      vm.getDetails(data.id);
    }

    //retrive packaging type
    function retrivePackagingType() {
      return RFQSettingFactory.retrivePackagingType().query({
        id: vm.packagingTypeModel.id
      }).$promise.then((response) => {
        if (response && response.data) {
          vm.name = _.clone(response.data.name);
          vm.packagingTypeModel.name = response.data.name;
          vm.packagingTypeModel.isActive = response.data.isActive ? response.data.isActive : false;
          vm.copyActive = angular.copy(vm.packagingTypeModel.isActive);
          vm.packagingTypeModel.systemGenerated = response.data ? response.data.systemGenerated : null;
        }
        return response.data;
      }).catch((error) => BaseService.getErrorLog(error));
    }
    //retrive all alis of packaging type
    function getComponentGenericAlias() {
      var data = {
        refId: vm.packagingTypeModel.id,
        refTableName: vm.tables
      };
      return ComponentFactory.getComponentGenericAlias().query(data).$promise.then((res) => {
        if (res && res.data) {
          vm.packagingTypeModel.alias = _.clone(res.data);
          _.each(vm.packagingTypeModel.alias, (item) => {
            if (item.mfgCodeList) {
              item.mfgCodeList = item.mfgCodeList ? item.mfgCodeList.split('#$#') : null;
            }
            if (vm.packagingTypeModel.name) {
              item.isDefaultAlias = item.alias.toLowerCase() === vm.packagingTypeModel.name.toLowerCase();
              item.index = item.alias.toLowerCase() === vm.packagingTypeModel.name.toLowerCase() ? 1 : 2;
            }
          });
          return res.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    //remove alias
    vm.removeAliasFromList = (item) => {
      const objIndex = vm.packagingTypeModel.alias.indexOf(item);
      vm.packagingTypeModel.alias.splice(objIndex, 1);
      vm.checkDirty = true;
      vm.isSaveDisable = false;
      vm.AddPackagingTypeForm.$$controls[0].$setDirty();
    };
    //add alias for packaging type
    vm.updateAliasList = ($event, alias) => {
      if (vm.AddPackagingTypeForm.packagingTypealias.$invalid) {
        return;
      }
      if (!vm.alias || (!vm.isMaster && vm.autoCompletepackagingType && !vm.autoCompletepackagingType.searchText)) {
        return;
      }
      if (!vm.isMaster) {
        if (vm.autoCompletepackagingType.keyColumnId || vm.autoCompletepackagingType.keyColumnId === 0) {
          const objpackaging = _.find(vm.packagingTypeList, (packaging) => packaging.id === vm.autoCompletepackagingType.keyColumnId);
          vm.packagingTypeModel.name = objpackaging.name;
        }
        else {
          vm.packagingTypeModel.name = vm.autoCompletepackagingType.searchText;
        }
      }
      const aliasObj = _.find(vm.packagingTypeModel.alias, (item) => item.alias.toLowerCase() === alias.toLowerCase());
      if (aliasObj) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_TYPE_EXISTS);
        messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, vm.packagingTypeModel.name);
        const uniqueObj = {
          messageContent: messageContent,
          isSetAliasNull: true,
          controlName: 'packagingTypealias'
        };
        displayCodeAliasUniqueMessage(uniqueObj);
        vm.AddPackagingTypeForm.$setDirty();
      }
      else {
        vm.cgBusyLoading = RFQSettingFactory.checkUniquePackagingTypeAlias().save({
          alias: vm.alias,
          id: vm.packagingTypeModel.id,
          refTableName: vm.tables

        }).$promise.then((response) => {
          if (response && response.data && (response.data.packagingAliasExistsInfo || response.data.packagingTypeExistsInfo)) {
            if (response.data.packagingAliasExistsInfo) {
              const aliasobj = _.find(vm.aliaslist, (alias) => alias.alias.toLowerCase() === response.data.packagingAliasExistsInfo.alias.toLowerCase());
              if (aliasobj) {
                if (vm.alias) {
                  vm.packagingTypeModel.alias.unshift({
                    id: aliasobj.id,
                    alias: vm.alias,
                    createdAt: new Date(),
                    fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                  });
                }
                vm.alias = null;
              } else {
                checkValidateAliasDetails(response.data.packagingAliasExistsInfo);
              }
            }
            else if (response.data.packagingTypeExistsInfo) {
              const aliasobj = _.find(vm.aliaslist, (alias) => alias.alias.toLowerCase() === response.data.packagingTypeExistsInfo.name.toLowerCase());
              if (aliasobj) {
                if (vm.alias) {
                  vm.packagingTypeModel.alias.unshift({
                    id: aliasobj.id,
                    alias: vm.alias,
                    createdAt: new Date(),
                    fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                  });
                }
                vm.alias = null;
              } else {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_TYPE_EXISTS);
                messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, response.data.packagingTypeExistsInfo.name);
                const uniqueObj = {
                  messageContent: messageContent,
                  isSetAliasNull: true,
                  controlName: 'packagingTypealias'
                };
                displayCodeAliasUniqueMessage(uniqueObj);
                return;
              }
            }
          } else {
            if (vm.alias) {
              vm.packagingTypeModel.alias.unshift({
                alias: vm.alias,
                createdAt: new Date(),
                fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
              });
            }
            vm.alias = null;
            if (checkResponseHasCallBackFunctionPromise(response)) {
              response.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.AddPackagingTypeForm);
              });
            }
          }
          vm.AddPackagingTypeForm.$setDirty();
          vm.checkDirty = true;
        });
      }
    };

    function checkValidateAliasDetails(packagingTypealias) {
      if (packagingTypealias) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
        messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, packagingTypealias.name);

        const uniqueObj = {
          messageContent: messageContent,
          isSetAliasNull: true
        };
        displayCodeAliasUniqueMessage(uniqueObj);
        return true;
      }
      return false;
    }
    vm.savePackagingType = (buttonCategory) => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.AddPackagingTypeForm)) {
        vm.saveBtnDisableFlag = false;
        if (vm.packagingTypeModel.id && !vm.checkFormDirty(vm.AddPackagingTypeForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          $mdDialog.hide(vm.data);
        }
        return;
      }
      // Used to focus on first error filed of form
      //if (vm.AddPackagingTypeForm.$invalid || vm.packagingTypeModel.id || vm.packagingTypeModel.id == 0) {
      if (vm.AddPackagingTypeForm.$invalid) {
        BaseService.focusRequiredField(vm.AddPackagingTypeForm);
        return;
      }
      if (vm.packagingTypeModel.id && vm.copyActive !== vm.packagingTypeModel.isActive) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.STATUS_CHANGE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.copyActive ? 'Enable' : 'Disable', vm.packagingTypeModel.isActive ? 'Enable' : 'Disable');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            confirmAliasAdd(buttonCategory);
          }
        }, () => {
          vm.saveBtnDisableFlag = false;
        });
      } else { confirmAliasAdd(buttonCategory); }
    };
    //check for alias added or not
    const confirmAliasAdd = (buttonCategory) => {
      if (vm.alias) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_NOT_ADDED_CONFRIMATION);
        const model = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(model).then((yes) => {
          if (yes) {
            savePackagingType(buttonCategory);
          }
        }, () => {
          vm.saveBtnDisableFlag = false;
        });
      }
      else {
        savePackagingType(buttonCategory);
      }
    };
    //save packaging type
    function savePackagingType(buttonCategory) {
      if (!vm.isMaster) {
        if (vm.autoCompletepackagingType.keyColumnId || vm.autoCompletepackagingType.keyColumnId === 0) {
          const objpackaging = _.find(vm.packagingTypeList, (packaging) => packaging.id === vm.autoCompletepackagingType.keyColumnId);
          if (objpackaging) {
            vm.packagingTypeModel.name = vm.packagingTypeModel.name ? vm.packagingTypeModel.name : objpackaging.name;
          }
        }
        else {
          vm.packagingTypeModel.name = vm.autoCompletepackagingType.searchText;
        }
      }
      if (vm.AddPackagingTypeForm.$invalid || !vm.packagingTypeModel.name) {
        BaseService.focusRequiredField(vm.AddPackagingTypeForm);
        vm.saveBtnDisableFlag = false;
        return;
      }
      const alias = _.find(vm.packagingTypeModel.alias, (als) => als.alias.toLowerCase() === vm.packagingTypeModel.name.toLowerCase());
      if (!alias) {
        const newalias = {
          alias: vm.packagingTypeModel.name,
          createdAt: new Date(),
          fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
        };
        vm.packagingTypeModel.alias.push(newalias);
      }
      $timeout(() => {
        vm.cgBusyLoading = RFQSettingFactory.packagingType().save(vm.packagingTypeModel).$promise.then((res) => {
          vm.saveBtnDisableFlag = false;
          if (res.data) {
            if (res.data.id && !vm.isduplicate) {
              if (vm.packagingTypeModel.alias) {
                res.data.alias = vm.packagingTypeModel.alias;
              }
              vm.saveAndProceed(buttonCategory, res.data);
            }
          } else {
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.AddPackagingTypeForm);
              });
            }
          }
        }).catch((error) => {
          vm.saveBtnDisableFlag = false;
          return BaseService.getErrorLog(error);
        });
      }, 1000);
    };
    vm.saveAndProceed = (buttonCategory, data) => {
      if (data) {
        vm.data = data;
      }
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.AddPackagingTypeForm.$setPristine();
        vm.pageInit(data);
        vm.getDetails(data.id);
        vm.checkDirty = false;
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.checkFormDirty(vm.AddPackagingTypeForm);
        if (isdirty) {
          const data = {
            form: vm.AddPackagingTypeForm
          };
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            if (data) {
              vm.pageInit();
              vm.AddPackagingTypeForm.$setPristine();
              if (vm.autoCompletepackagingType) {
                vm.autoCompletepackagingType.searchText = null;
              }
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.pageInit();
          vm.AddPackagingTypeForm.$setPristine();
          if (vm.autoCompletepackagingType) {
            vm.autoCompletepackagingType.searchText = null;
          }
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.hide(vm.data);
      }
      setFocusByName('name');
    };

    //update details
    vm.selectedPackaging = (data) => {
      $timeout(() => {
        if (!vm.isMaster) {
          vm.packagingTypeModel.id = data.id;
          vm.autoCompletepackagingType.keyColumnId = vm.packagingTypeModel.id;
          vm.packagingTypeModel.isActive = data.isActive;
          vm.packagingTypeModel.systemGenerated = data.systemGenerated;
          getPackagingTypeSearch({ id: vm.packagingTypeModel.id });
        }
        else {
          vm.packagingTypeModel.id = data.id;
          const promises = [retrivePackagingType(), getComponentGenericAlias()];
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
            vm.packagingTypeModel.alias = responses[1];
            _.each(vm.packagingTypeModel.alias, (item) => {
              item.isDefaultAlias = item.alias.toLowerCase() === vm.packagingTypeModel.name.toLowerCase();
              item.index = item.alias.toLowerCase() === vm.packagingTypeModel.name.toLowerCase() ? 1 : 2;
            });
          });
        }
      }, true);
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.AddPackagingTypeForm);
      if (isdirty || vm.checkDirty) {
        const data = {
          form: vm.AddPackagingTypeForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.hide(true);
      }
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return !vm.checkDirty ? checkDirty : vm.checkDirty;
    };

    // Function call on packaging type blue event and check code exist or not
    vm.checkDuplicateName = (buttonCategory) => {
      vm.isduplicate = false;
      if (!vm.isMaster) {
        if (vm.autoCompletepackagingType.keyColumnId || vm.autoCompletepackagingType.keyColumnId === 0) {
          const objpackaging = _.find(vm.packagingTypeList, (packaging) => packaging.id === vm.autoCompletepackagingType.keyColumnId);
          vm.packagingTypeModel.name = objpackaging.name;
        }
        else {
          vm.packagingTypeModel.name = vm.autoCompletepackagingType.searchText;
        }
      }
      if (vm.packagingTypeModel.name && vm.name !== vm.packagingTypeModel.name) {
        vm.cgBusyLoading = RFQSettingFactory.checkDuplicatePackagingType().save({
          id: (vm.packagingTypeModel.id || vm.packagingTypeModel.id === 0) ? vm.packagingTypeModel.id : null,
          name: vm.packagingTypeModel.name,
          refTableName: vm.tables
        }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicate) {
            vm.isduplicate = true;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY);
            messageContent.message = stringFormat(messageContent.message, vm.packagingTypeModel.name);
            const uniqueObj = {
              messageContent: messageContent,
              controlName: 'name'
            };
            vm.packagingTypeModel.name = null;
            if (!vm.isMaster) {
              vm.autoCompletepackagingType.searchText = null;
            }
            displayCodeAliasUniqueMessage(uniqueObj);
          }
          else if (!vm.isMaster) {
            vm.savePackagingType(buttonCategory);
          }
          else {
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.AddPackagingTypeForm);
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* mfg code unique message */
    const displayCodeAliasUniqueMessage = (uniqueObj) => {
      const obj = {
        messageContent: uniqueObj.messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
        multiple: true
      };
      DialogFactory.messageAlertDialog(obj).then(() => {
        if (uniqueObj.controlName) {
          setFocusByName(uniqueObj.controlName);
        }
        if (uniqueObj.isSetAliasNull) {
          vm.alias = null;
        }
      }, () => {
        if (uniqueObj.isSetAliasNull) {
          vm.alias = null;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //get

    function initAutoComplete() {
      vm.autoCompletepackagingType = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: data ? data.id : null,
        inputName: 'Search Packaging Type',
        placeholderName: 'Search Packaging or Add',
        isRequired: true,
        isAddnew: false,
        callbackFn: function (obj) {
          const searchObj = {
            id: obj.id
          };
          return getPackagingTypeSearch(searchObj);
        },
        onSelectCallbackFn: function (item) {
          getPackagingTypeDetail(item);
        },
        onSearchFn: function (query) {
          const searchObj = {
            searchQuery: query,
            inputName: vm.autoCompletepackagingType.inputName
          };
          return getPackagingTypeSearch(searchObj);
        }
      };
      $timeout(() => {
        vm.autoCompletepackagingType.searchText = data.Name;
      });
    }
    //on select of packaging type
    function getPackagingTypeDetail(item) {
      if (item) {
        vm.packagingTypeModel.id = item.id;
        const promises = [retrivePackagingType(), getComponentGenericAlias()];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          vm.packagingTypeModel.alias = responses[1];
          _.each(vm.packagingTypeModel.alias, (item) => {
            if (item.mfgCodeList) {
              item.mfgCodeList = item.mfgCodeList ? item.mfgCodeList.split('#$#') : null;
            }
            item.isDefaultAlias = item.alias.toLowerCase() === vm.packagingTypeModel.name.toLowerCase();
            item.index = item.alias.toLowerCase() === vm.packagingTypeModel.name.toLowerCase() ? 1 : 2;
          });
        });
      }
      else {
        vm.packagingTypeModel.id = null;
        vm.packagingTypeModel.name = null;
        vm.packagingTypeModel.alias = [];
      }
    }
    function getPackagingTypeSearch(searchObj) {
      return RFQSettingFactory.getPackagingTypeList().query(searchObj).$promise.then((packagingtype) => {
        if (packagingtype && packagingtype.data) {
          vm.packagingTypeList = packagingtype.data;
          const selectedPackagingType = packagingtype.data[0];
          if (!vm.autoCompletepackagingType) {
            initAutoComplete();
          } else {
            vm.packagingTypeModel.name = vm.autoCompletepackagingType.searchText;
          }
          if (searchObj && (searchObj.id || searchObj.id === 0)) {
            $timeout(() => {
              if (vm.autoCompletepackagingType) {
                vm.autoCompletepackagingType.searchText = selectedPackagingType.name;
                $scope.$broadcast(vm.autoCompletepackagingType.inputName, selectedPackagingType);
              }
            });
          }
          return packagingtype.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    /* set selected alias as default one and set it as packaging type */
    vm.setAliasAsDefault = (aliasItem) => {
      if (aliasItem && aliasItem.id) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SET_ALIAS_AS_DEFAULT_NAME);
        messageContent.message = stringFormat(messageContent.message, aliasItem.alias, 'packaging type');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.packagingTypeModel.name = aliasItem.alias;
            const defaultAlias = _.find(vm.packagingTypeModel.alias, (dAlias) => dAlias.isDefaultAlias);
            if (defaultAlias) {
              defaultAlias.isDefaultAlias = false;
              defaultAlias.index = 2;
            }
            aliasItem.isDefaultAlias = true;
            aliasItem.index = 1;
            vm.AddPackagingTypeForm.$$controls[0].$setDirty();
          }
        }, () => {
          // empty
        });
      }
    };
    //on load submit form
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.AddPackagingTypeForm);
      BaseService.focusOnFirstEnabledField(vm.AddPackagingTypeForm);
    });
  }
})();
