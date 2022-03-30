(function () {
  'use strict';
  angular
    .module('app.admin.rfqsetting')
    .controller('ManagePackageCaseTypePopupController', ManagePackageCaseTypePopupController);
  /** @ngInject */
  function ManagePackageCaseTypePopupController($mdDialog, data, CORE, USER, RFQSettingFactory, BaseService, $mdColorPicker, $q, DialogFactory, ComponentFactory, $scope, $timeout) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.taToolbar = CORE.Toolbar;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.EmptyMesssageAliaslist = USER.ADMIN_EMPTYSTATE.MFG;
    vm.tables = CORE.TABLE_NAME.RFQ_PACKAGECASETYPE;
    vm.checkDirty = false;
    vm.searchType = CORE.RFQ_SETTING.PackageCaseType;
    vm.isMaster = data ? data.isMaster : false;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.pageInit = (data) => {
      vm.partCategoryModel = {
        id: data ? data.id : null,
        name: data ? data.Name : null,
        description: null,
        isActive: true,
        isXrayRequired: false,
        refTableName: vm.tables,
        alias: []
      };
      vm.alias = data && data.aliasText ? data.aliasText : null;
    };
    vm.pageInit(data);

    if (!data || (data && !data.id)) {
      getPackageCaseTypeList();
    }

    vm.name = vm.partCategoryModel.name;

    vm.getDetails = (id) => {
      vm.partCategoryModel.id = id;
      const promises = [retrivePackageCaseType(), getComponentGenericAlias()];
      vm.cgBusyLoading = $q.all(promises).then((responses) => {
        vm.partCategoryModel.alias = responses[1];
        _.each(vm.partCategoryModel.alias, (item) => {
          if (item.mfgCodeList) {
            item.mfgCodeList = item.mfgCodeList ? item.mfgCodeList.split('#$#') : null;
          }
          if (vm.partCategoryModel.name) {
            item.isDefaultAlias = item.alias.toLowerCase() === vm.partCategoryModel.name.toLowerCase();
            item.index = item.alias.toLowerCase() === vm.partCategoryModel.name.toLowerCase() ? 1 : 2;
          }
        });
      });
    };

    if (data && (data.id || data.id === 0)) {
      vm.getDetails(data.id);
    }

    if (!vm.isMaster) {
      getPackageCaseTypeSearch();
    }

    //retrive package case type list
    function retrivePackageCaseType() {
      return RFQSettingFactory.retrivePackageCaseType().query({
        id: vm.partCategoryModel.id
      }).$promise.then((response) => {
        if (response && response.data) {
          vm.partCategoryModel.name = response.data.name;
          vm.partCategoryModel.systemGenerated = response.data.systemGenerated;
          vm.partCategoryModel.description = response.data.description;
          vm.partCategoryModel.isActive = response.data.isActive ? response.data.isActive : false;
          vm.partCategoryModel.isXrayRequired = response.data.isXrayRequired ? response.data.isXrayRequired : false;
          vm.copyActive = angular.copy(vm.partCategoryModel.isActive);
          vm.partCategoryModelCopy = _.clone(vm.partCategoryModel);
          vm.checkDirtyObject = {
            oldModelName: vm.partCategoryModelCopy,
            newModelName: vm.partCategoryModel
          };
        }
        return response;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    /* packaging type color list */
    function getPackageCaseTypeList() {
      return ComponentFactory.getPackageCaseTypeList().query().$promise.then((res) => {
        vm.packageCaseColorList = res.data;
        return res.data;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //retrive all alis of functional type
    function getComponentGenericAlias() {
      const data = {
        refId: vm.partCategoryModel.id,
        refTableName: vm.tables
      };
      return ComponentFactory.getComponentGenericAlias().query(data).$promise.then((res) => {
        if (res && res.data) {
          vm.partCategoryModel.alias = _.clone(res.data);
          _.each(vm.partCategoryModel.alias, (item) => {
            if (item.mfgCodeList) {
              item.mfgCodeList = item.mfgCodeList ? item.mfgCodeList.split('#$#') : null;
            }
            if (vm.partCategoryModel.name) {
              item.isDefaultAlias = item.alias.toLowerCase() === vm.partCategoryModel.name.toLowerCase();
              item.index = item.alias.toLowerCase() === vm.partCategoryModel.name.toLowerCase() ? 1 : 2;
            }
          });
          return res.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //remove alias
    vm.removeAliasFromList = (item) => {
      const objIndex = vm.partCategoryModel.alias.indexOf(item);
      vm.partCategoryModel.alias.splice(objIndex, 1);
      vm.checkDirty = true;
      vm.AddPackageCaseTypeForm.$$controls[0].$setDirty();
    };

    //add alias for package case type
    vm.updateAliasList = ($event, alias) => {
      if (vm.AddPackageCaseTypeForm.packagealias.$invalid) {
        return;
      }
      if (!vm.alias || (!vm.isMaster && vm.autoCompletePackageCaseType && !vm.autoCompletePackageCaseType.searchText)) {
        return;
      }
      if (!vm.isMaster) {
        if (vm.autoCompletePackageCaseType.keyColumnId || vm.autoCompletePackageCaseType.keyColumnId === 0) {
          const objPackage = _.find(vm.packageCaseTypeList, (packageCase) => packageCase.id === vm.autoCompletePackageCaseType.keyColumnId);
          vm.partCategoryModel.name = objPackage.name;
        }
        else {
          vm.partCategoryModel.name = vm.autoCompletePackageCaseType.searchText;
        }
      }
      const aliasObj = _.find(vm.partCategoryModel.alias, (item) => item.alias.toLowerCase() === alias.toLowerCase());
      if (aliasObj) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_TYPE_EXISTS);
        messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, vm.partCategoryModel.name);
        const uniqueObj = {
          messageContent: messageContent,
          isSetAliasNull: true,
          controlName: 'packagealias'
        };
        displayCodeAliasUniqueMessage(uniqueObj);
        vm.AddPackageCaseTypeForm.$setDirty();
      } else {
        vm.cgBusyLoading = RFQSettingFactory.checkUniquePackageCaseTypeAlias().save({
          alias: vm.alias,
          id: vm.partCategoryModel.id,
          refTableName: vm.tables
        }).$promise.then((response) => {
          if (response && response.data && (response.data.packageCaseAliasExistsInfo || response.data.packageCaseTypeExistsInfo)) {
            if (response.data.packageCaseAliasExistsInfo) {
              const aliasobj = _.find(vm.partCategoryModel.alias, (alias) => alias.alias.toLowerCase() === response.data.packageCaseAliasExistsInfo.alias.toLowerCase());
              if (aliasobj) {
                if (vm.alias) {
                  vm.partCategoryModel.alias.unshift({
                    id: aliasobj.id,
                    alias: vm.alias,
                    createdAt: new Date(),
                    fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                  });
                }
                vm.alias = null;
              } else {
                checkValidateAliasDetails(response.data.packageCaseAliasExistsInfo);
              }
            }
            else if (response.data.packageCaseTypeExistsInfo) {
              const aliasobj = _.find(vm.partCategoryModel.alias, (alias) => alias.alias.toLowerCase() === response.data.packageCaseTypeExistsInfo.name.toLowerCase());
              if (aliasobj) {
                if (vm.alias) {
                  vm.partCategoryModel.alias.unshift({
                    id: aliasobj.id,
                    alias: vm.alias,
                    createdAt: new Date(),
                    fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                  });
                }
                vm.alias = null;
              } else {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_TYPE_EXISTS);
                messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, response.data.packageCaseTypeExistsInfo.name);
                const uniqueObj = {
                  messageContent: messageContent,
                  isSetAliasNull: true,
                  controlName: 'packagealias'
                };
                displayCodeAliasUniqueMessage(uniqueObj);
                return;
              }
            }
          } else {
            if (vm.alias) {
              vm.partCategoryModel.alias.unshift({
                alias: vm.alias,
                createdAt: new Date(),
                fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
              });
            }
            if (checkResponseHasCallBackFunctionPromise(response)) {
              response.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.AddPackageCaseTypeForm);
              });
            }
            vm.alias = null;
          }
          vm.isupdated = true;
          vm.AddPackageCaseTypeForm.$setDirty();
        });
      }
    };

    function checkValidateAliasDetails(packageCaseTypeealias) {
      if (packageCaseTypeealias) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
        messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, packageCaseTypeealias.packageCaseTypeName);
        const uniqueObj = {
          messageContent: messageContent,
          isSetAliasNull: true,
          controlName: 'packagealias'
        };
        displayCodeAliasUniqueMessage(uniqueObj);
        return true;
      }
      return false;
    }

    vm.savePartCategory = (buttonCategory) => {
      if (BaseService.focusRequiredField(vm.AddPackageCaseTypeForm)) {
        if (vm.partCategoryModel.id && !vm.checkFormDirty(vm.AddPackageCaseTypeForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          $mdDialog.hide(vm.data);
        }
        return;
      }
      if (!vm.isMaster) {
        if (vm.autoCompletePackageCaseType.keyColumnId || vm.autoCompletePackageCaseType.keyColumnId === 0) {
          const objPackage = _.find(vm.packageCaseTypeList, (packageCase) => packageCase.id === vm.autoCompletePackageCaseType.keyColumnId);
          if (objPackage) {
            vm.partCategoryModel.name = vm.partCategoryModel.name ? vm.partCategoryModel.name : objPackage.name;
          }
        } else {
          vm.partCategoryModel.name = vm.autoCompletePackageCaseType.searchText;
        }
      }
      if (vm.AddPackageCaseTypeForm.$invalid || !vm.partCategoryModel.name) {
        BaseService.focusRequiredField(vm.AddPackageCaseTypeForm);
        return;
      }
      const alias = _.find(vm.partCategoryModel.alias, (als) => als.alias.toLowerCase() === vm.partCategoryModel.name.toLowerCase());
      if (!alias) {
        const newalias = {
          alias: vm.partCategoryModel.name,
          createdAt: new Date(),
          fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
        };
        vm.partCategoryModel.alias.push(newalias);
        vm.checkDirty = true;
      }
      if (vm.partCategoryModel.id && vm.copyActive !== vm.partCategoryModel.isActive) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.STATUS_CHANGE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.copyActive ? 'Enable' : 'Disable', vm.partCategoryModel.isActive ? 'Enable' : 'Disable');
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
          // empty
        });
      } else { confirmAliasAdd(buttonCategory); }
    };

    //check for alias added or not
    const confirmAliasAdd = (buttonCategory) => {
      if (vm.alias) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MFG_ALIAS_NOT_ADDED);

        const model = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(model).then((yes) => {
          if (yes) {
            savePartCategory(buttonCategory);
          }
        }, () => {
          // empty
        });
      }
      else {
        savePartCategory(buttonCategory);
      }
    };

    function savePartCategory(buttonCategory) {
      vm.isupdated = false;
      if (!vm.isMaster) {
        if (vm.autoCompletePackageCaseType.keyColumnId || vm.autoCompletePackageCaseType.keyColumnId === 0) {
          const objPackage = _.find(vm.packageCaseTypeList, (packageCase) => packageCase.id === vm.autoCompletePackageCaseType.keyColumnId);
          if (objPackage) {
            vm.partCategoryModel.name = vm.partCategoryModel.name ? vm.partCategoryModel.name : objPackage.name;
          }
        } else {
          vm.partCategoryModel.name = vm.autoCompletePackageCaseType.searchText;
        }
      }
      $timeout(() => {
        vm.cgBusyLoading = RFQSettingFactory.savePackageCaseType().save(vm.partCategoryModel).$promise.then((res) => {
          if (res.data) {
            if ((res.data.id || res.data.id === 0) && !vm.isduplicate) {
              if (vm.partCategoryModel.alias) {
                res.data.alias = vm.partCategoryModel.alias;
              }
              vm.saveAndProceed(buttonCategory, res.data);
            }
          } else {
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.AddPackageCaseTypeForm);
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }, 1000);
    };

    vm.saveAndProceed = (buttonCategory, data) => {
      if (data) {
        vm.data = data;
      }
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.AddPackageCaseTypeForm.$setPristine();
        vm.pageInit(data);
        vm.getDetails(data.id);
        vm.checkDirty = false;
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.checkFormDirty(vm.AddPackageCaseTypeForm);
        if (isdirty) {
          const data = {
            form: vm.AddPackageCaseTypeForm
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
              vm.AddPackageCaseTypeForm.$setPristine();
              if (vm.autoCompletePackageCaseType) {
                vm.autoCompletePackageCaseType.searchText = null;
              }
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.pageInit();
          vm.AddPackageCaseTypeForm.$setPristine();
          if (vm.autoCompletePackageCaseType) {
            vm.autoCompletePackageCaseType.searchText = null;
          }
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.hide(vm.data);
      }
      setFocusByName('packagecasetype');
    };

    //update details
    vm.selectedPart = (data) => {
      $timeout(() => {
        if (!vm.isMaster) {
          vm.partCategoryModel.id = data.id;
          vm.autoCompletePackageCaseType.keyColumnId = vm.partCategoryModel.id;
          let color;
          if (data.colorCode) {
            const rgbColor = new tinycolor(data.colorCode).toRgb();
            color = stringFormat(CORE.PACKAGE_CASE_TYPE_COLOR_FORMATE, rgbColor.r, rgbColor.g, rgbColor.b);
          }
          else {
            color = CORE.DEFAULT_PACKAGE_CASE_TYPE_COLOR;
          }
          vm.partCategoryModel.colorCode = color;
          vm.partCategoryModel.description = data.description;
          vm.partCategoryModel.isXrayRequired = data.isXrayRequired ? true : false;
          vm.partCategoryModel.isActive = data.isActive ? true : false;
          vm.partCategoryModel.systemGenerated = data.systemGenerated ? true : false;
          getPackageCaseTypeSearch({ id: vm.partCategoryModel.id });
        }
        else {
          vm.partCategoryModel.id = data.id;
          const promises = [retrivePackageCaseType(), getComponentGenericAlias()];
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
            vm.partCategoryModel.alias = responses[1];
            _.each(vm.partCategoryModel.alias, (item) => {
              item.isDefaultAlias = item.alias.toLowerCase() === vm.partCategoryModel.name.toLowerCase();
              item.index = item.alias.toLowerCase() === vm.partCategoryModel.name.toLowerCase() ? 1 : 2;
            });
          });
        }
      }, true);
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.AddPackageCaseTypeForm);
      if (isdirty || vm.checkDirty) {
        const data = {
          form: vm.AddPackageCaseTypeForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.hide(true);
      }
    };

    vm.checkFormDirty = (form) => {
      let checkDirty = BaseService.checkFormDirty(form, vm.checkDirtyObject);
      //functionality added as pre requirment, and hided if needed in future will un comment this
      if (!checkDirty && vm.isupdated) {
        checkDirty = true;
      }
      return !vm.checkDirty ? checkDirty : vm.checkDirty;
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    // Function call on package case type blue event and check code exist or not
    vm.checkDuplicateName = (buttonCategory) => {
      vm.isduplicate = false;
      if (!vm.isMaster) {
        if (vm.autoCompletePackageCaseType.keyColumnId || vm.autoCompletePackageCaseType.keyColumnId === 0) {
          const objPackage = _.find(vm.packageCaseTypeList, (packageCase) => packageCase.id === vm.autoCompletePackageCaseType.keyColumnId);
          vm.partCategoryModel.name = objPackage.name;
        }
        else {
          vm.partCategoryModel.name = vm.autoCompletePackageCaseType.searchText;
        }
      }
      if (vm.partCategoryModel.name && vm.name !== vm.partCategoryModel.name) {
        vm.cgBusyLoading = RFQSettingFactory.checkDuplicatePackageCaseType().save({
          id: (vm.partCategoryModel.id || vm.partCategoryModel.id === 0) ? vm.partCategoryModel.id : null,
          name: vm.partCategoryModel.name,
          refTableName: vm.tables
        }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicate) {
            vm.isduplicate = true;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY);
            messageContent.message = stringFormat(messageContent.message, vm.partCategoryModel.name);
            const uniqueObj = {
              messageContent: messageContent,
              controlName: 'packagecasetype'
            };
            vm.partCategoryModel.name = null;
            if (!vm.isMaster) {
              vm.autoCompletePackageCaseType.searchText = null;
            }
            displayCodeAliasUniqueMessage(uniqueObj);
          }
          else if (!vm.isMaster) {
            vm.savePartCategory(buttonCategory);
          } else {
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.AddPackageCaseTypeForm);
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

    function initAutoComplete() {
      vm.autoCompletePackageCaseType = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: vm.partCategoryModel.id,
        inputName: 'Search Package Case Type',
        placeholderName: 'Search Package Case or Add',
        isRequired: true,
        isAddnew: false,
        callbackFn: function (obj) {
          const searchObj = {
            id: obj.id
          };
          return getPackageCaseTypeSearch(searchObj);
        },
        onSelectCallbackFn: function (item) {
          getPackageCaseTypeDetail(item);
        },
        onSearchFn: function (query) {
          const searchObj = {
            searchQuery: query,
            inputName: vm.autoCompletePackageCaseType.inputName
          };
          return getPackageCaseTypeSearch(searchObj);
        }
      };
      if (data.Name) {
        $timeout(() => {
          vm.autoCompletePackageCaseType.searchText = data.Name;
        });
      }
    }
    // get package case type list
    function getPackageCaseTypeSearch(searchObj) {
      return RFQSettingFactory.getPackageCaseList().query(searchObj).$promise.then((packageCase) => {
        if (packageCase && packageCase.data) {
          vm.packageCaseTypeList = packageCase.data;
          const selectedPackageCaseType = packageCase.data[0];
          if (!vm.autoCompletePackageCaseType) {
            initAutoComplete();
          } else {
            vm.partCategoryModel.name = vm.autoCompletePackageCaseType.searchText;
          }
          if (searchObj && (searchObj.id || searchObj.id === 0)) {
            $timeout(() => {
              if (vm.autoCompletePackageCaseType) {
                vm.autoCompletePackageCaseType.searchText = selectedPackageCaseType.name;
                $scope.$broadcast(vm.autoCompletePackageCaseType.inputName, selectedPackageCaseType);
              }
            });
          }
          return packageCase.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //on select of package case type
    function getPackageCaseTypeDetail(item) {
      if (item) {
        vm.partCategoryModel.id = item.id;
        const promises = [retrivePackageCaseType(), getComponentGenericAlias()];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          vm.partCategoryModel.alias = responses[1];
          _.each(vm.partCategoryModel.alias, (item) => {
            if (item.mfgCodeList) {
              item.mfgCodeList = item.mfgCodeList ? item.mfgCodeList.split('#$#') : null;
            }
            if (vm.partCategoryModel.name) {
              item.isDefaultAlias = item.alias.toLowerCase() === vm.partCategoryModel.name.toLowerCase();
              item.index = item.alias.toLowerCase() === vm.partCategoryModel.name.toLowerCase() ? 1 : 2;
            }
          });
        });
      }
      else {
        vm.partCategoryModel.id = null;
        vm.partCategoryModel.name = null;
        vm.partCategoryModel.alias = [];
      }
    }
    /* set selected alias as default one and set it as package/case(shape) type */
    vm.setAliasAsDefault = (aliasItem) => {
      if (aliasItem && aliasItem.id) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SET_ALIAS_AS_DEFAULT_NAME);
        messageContent.message = stringFormat(messageContent.message, aliasItem.alias, 'package/case(shape) type');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.partCategoryModel.name = aliasItem.alias;
            const defaultAlias = _.find(vm.partCategoryModel.alias, (dAlias) => dAlias.isDefaultAlias === true);
            if (defaultAlias) {
              defaultAlias.isDefaultAlias = false;
              defaultAlias.index = 2;
            }
            aliasItem.isDefaultAlias = true;
            aliasItem.index = 1;
            vm.AddPackageCaseTypeForm.$$controls[0].$setDirty();
          }
        }, () => {
          // empty
        });
      }
    };

    //on load submit form
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.AddPackageCaseTypeForm);
    });
  }
})();
