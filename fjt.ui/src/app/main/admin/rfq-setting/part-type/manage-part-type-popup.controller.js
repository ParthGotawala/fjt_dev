(function () {
  'use strict';
  angular
    .module('app.admin.rfqsetting')
    .controller('ManagePartTypePopupController', ManagePartTypePopupController);
  /** @ngInject */
  function ManagePartTypePopupController($q, $mdDialog, data, CORE, USER, RFQSettingFactory, BaseService, DialogFactory, ComponentFactory, $scope, $timeout) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.EmptyMesssageAliaslist = USER.ADMIN_EMPTYSTATE.MFG;
    vm.taToolbar = CORE.Toolbar;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.tables = CORE.TABLE_NAME.RFQ_PARTTYPE;
    vm.isMaster = data ? data.isMaster : false;
    vm.aliasFieldName = 'partTypealias';
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    if (!vm.isMaster) {
      getFunctionalTypeSearch();
    }
    vm.checkDirty = false;
    vm.searchType = CORE.RFQ_SETTING.FunctionalType;
    vm.pageInit = (data) => {
      vm.partTypeModel = {
        id: data ? data.id : null,
        partTypeName: data ? data.Name : null,
        isActive: true,
        displayOrder: null,
        refTableName: CORE.TABLE_NAME.RFQ_PARTTYPE,
        alias: [],
        isTemperatureSensitive: data ? data.isTemperatureSensitive : false
      };
      vm.alias = data && data.aliasText ? data.aliasText : null;
    };
    vm.pageInit(data);
    vm.name = vm.partTypeModel.partTypeName;
    vm.getDetails = (id) => {
      vm.partTypeModel.id = id;
      const promises = [retrivePartType(), getComponentGenericAlias()];
      vm.cgBusyLoading = $q.all(promises).then((responses) => {
        vm.partTypeModel.alias = responses[1];
        _.each(vm.partTypeModel.alias, (item) => {
          if (item.mfgCodeList) {
            item.mfgCodeList = item.mfgCodeList ? item.mfgCodeList.split('#$#') : null;
          }
          if (vm.partTypeModel.partTypeName) {
            item.isDefaultAlias = item.alias.toLowerCase() === vm.partTypeModel.partTypeName.toLowerCase();
            item.index = item.alias.toLowerCase() === vm.partTypeModel.partTypeName.toLowerCase() ? 1 : 2;
          }
        });
      });
    };
    if (data && (data.id || data.id === 0)) {
      vm.getDetails(data.id);
    }
    //retrive functional type
    function retrivePartType() {
      return RFQSettingFactory.retrivePartType().query({
        id: vm.partTypeModel.id
      }).$promise.then((response) => {
        if (response && response.data) {
          vm.name = _.clone(response.data.partTypeName);
          vm.partTypeModel.partTypeName = response.data.partTypeName;
          vm.partTypeModel.displayOrder = response.data.displayOrder;
          vm.partTypeModel.isActive = response.data.isActive ? response.data.isActive : false;
          vm.partTypeModel.isTemperatureSensitive = response.data.isTemperatureSensitive ? response.data.isTemperatureSensitive : false;
          vm.copyActive = angular.copy(vm.partTypeModel.isActive);
        }
        return response.data;
      }).catch((error) => BaseService.getErrorLog(error));
    }
    //retrive all alis of functional type
    function getComponentGenericAlias() {
      var data = {
        refId: vm.partTypeModel.id,
        refTableName: CORE.TABLE_NAME.RFQ_PARTTYPE
      };
      return ComponentFactory.getComponentGenericAlias().query(data).$promise.then((res) => {
        if (res && res.data) {
          vm.partTypeModel.alias = _.clone(res.data);
          _.each(vm.partTypeModel.alias, (item) => {
            if (item.mfgCodeList) {
              item.mfgCodeList = item.mfgCodeList ? item.mfgCodeList.split('#$#') : null;
            }
            if (vm.partTypeModel.partTypeName) {
              item.isDefaultAlias = item.alias.toLowerCase() === vm.partTypeModel.partTypeName.toLowerCase();
              item.index = item.alias.toLowerCase() === vm.partTypeModel.partTypeName.toLowerCase() ? 1 : 2;
            }
          });
          return res.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    //remove alias
    vm.removeAliasFromList = (item) => {
      const objIndex = vm.partTypeModel.alias.indexOf(item);
      vm.partTypeModel.alias.splice(objIndex, 1);
      vm.checkDirty = true;
      vm.isSaveDisable = false;
      vm.AddPartTypeForm.$$controls[0].$setDirty();
    };
    //add alias for functional type
    vm.updateAliasList = ($event, alias) => {
      if (vm.AddPartTypeForm.partTypealias.$invalid) {
        return;
      }
      if (!vm.alias || (!vm.isMaster && vm.autoCompletepartType && !vm.autoCompletepartType.searchText)) {
        return;
      }
      if (!vm.isMaster) {
        if (vm.autoCompletepartType.keyColumnId || vm.autoCompletepartType.keyColumnId === 0) {
          const objfunctional = _.find(vm.functionalTypeList, (functional) => functional.id === vm.autoCompletepartType.keyColumnId);
          vm.partTypeModel.partTypeName = objfunctional.partTypeName;
        }
        else {
          vm.partTypeModel.partTypeName = vm.autoCompletepartType.searchText;
        }
      }
      const aliasObj = _.find(vm.partTypeModel.alias, (item) => item.alias.toLowerCase() === alias.toLowerCase());
      if (aliasObj) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_TYPE_EXISTS);
        messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, vm.partTypeModel.partTypeName);
        const uniqueObj = {
          messageContent: messageContent,
          isSetAliasNull: true,
          controlName: vm.aliasFieldName
        };
        displayCodeAliasUniqueMessage(uniqueObj);
        vm.AddPartTypeForm.$setDirty();
      } else {
        vm.cgBusyLoading = RFQSettingFactory.checkUniquePartTypeAlias().save({
          alias: vm.alias,
          id: vm.partTypeModel.id,
          refTableName: CORE.TABLE_NAME.RFQ_PARTTYPE

        }).$promise.then((response) => {
          if (response && response.data && (response.data.partAliasExistsInfo || response.data.partTypeExistsInfo)) {
            if (response.data.partAliasExistsInfo) {
              const aliasobj = _.find(vm.aliaslist, (alias) => alias.alias.toLowerCase() === response.data.partAliasExistsInfo.alias.toLowerCase());
              if (aliasobj) {
                if (vm.alias) {
                  vm.partTypeModel.alias.unshift({
                    id: aliasobj.id,
                    alias: vm.alias,
                    createdAt: new Date(),
                    fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                  });
                }
                vm.alias = null;
              } else {
                checkValidateAliasDetails(response.data.partAliasExistsInfo);
              }
            }
            else if (response.data.partTypeExistsInfo) {
              const aliasobj = _.find(vm.aliaslist, (alias) => alias.alias.toLowerCase() === response.data.partTypeExistsInfo.partTypeName.toLowerCase());
              if (aliasobj) {
                if (vm.alias) {
                  vm.partTypeModel.alias.unshift({
                    id: aliasobj.id,
                    alias: vm.alias,
                    createdAt: new Date(),
                    fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                  });
                }
                vm.alias = null;
              } else {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_TYPE_EXISTS);
                messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, response.data.partTypeExistsInfo.partTypeName);

                const uniqueObj = {
                  messageContent: messageContent,
                  isSetAliasNull: true,
                  controlName: vm.aliasFieldName
                };
                displayCodeAliasUniqueMessage(uniqueObj);
                return;
              }
            }
          } else {
            if (vm.alias) {
              vm.partTypeModel.alias.unshift({
                alias: vm.alias,
                createdAt: new Date(),
                fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
              });
            }
            vm.alias = null;
            setFocusByName(vm.aliasFieldName);
          }
          vm.AddPartTypeForm.$setDirty();
          vm.checkDirty = true;
        });
      }
    };

    function checkValidateAliasDetails(partTypealias) {
      if (partTypealias) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
        messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, partTypealias.partTypeName);
        const uniqueObj = {
          messageContent: messageContent,
          isSetAliasNull: true,
          controlName: vm.aliasFieldName
        };
        displayCodeAliasUniqueMessage(uniqueObj);
        return true;
      }
      return false;
    }
    //save part type detail
    vm.savePartType = (buttonCategory) => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.AddPartTypeForm)) {
        vm.saveBtnDisableFlag = false;
        if (vm.partTypeModel.id && !vm.checkFormDirty(vm.AddPartTypeForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          $mdDialog.hide(vm.data);
        }
        return;
      }
      if (vm.partTypeModel.id && vm.copyActive !== vm.partTypeModel.isActive) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.STATUS_CHANGE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.copyActive ? 'Enable' : 'Disable', vm.partTypeModel.isActive ? 'Enable' : 'Disable');
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
            savePartType(buttonCategory);
          }
        }, () => {
          vm.saveBtnDisableFlag = false;
        });
      }
      else {
        savePartType(buttonCategory);
      }
    };
    //save functional type
    function savePartType(buttonCategory) {
      if (!vm.isMaster) {
        if (vm.autoCompletepartType.keyColumnId || vm.autoCompletepartType.keyColumnId === 0) {
          const objfunctional = _.find(vm.functionalTypeList, (functional) => functional.id === vm.autoCompletepartType.keyColumnId);
          if (objfunctional) {
            vm.partTypeModel.partTypeName = vm.partTypeModel.partTypeName ? vm.partTypeModel.partTypeName : objfunctional.partTypeName;
          }
        }
        else {
          vm.partTypeModel.partTypeName = vm.autoCompletepartType.searchText;
        }
      }
      if (vm.AddPartTypeForm.$invalid || !vm.partTypeModel.partTypeName) {
        BaseService.focusRequiredField(vm.AddPartTypeForm);
        vm.saveBtnDisableFlag = false;
        return;
      }
      const alias = _.find(vm.partTypeModel.alias, (als) => als.alias.toLowerCase() === vm.partTypeModel.partTypeName.toLowerCase());
      if (!alias) {
        const newalias = {
          alias: vm.partTypeModel.partTypeName,
          createdAt: new Date(),
          fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
        };
        vm.partTypeModel.alias.push(newalias);
      }
      vm.cgBusyLoading = RFQSettingFactory.partType().save(vm.partTypeModel).$promise.then((res) => {
        vm.saveBtnDisableFlag = false;
        if (res.data) {
          if ((res.data.id || res.data.id === 0) && !vm.isduplicate) {
            if (vm.partTypeModel.alias) {
              res.data.alias = vm.partTypeModel.alias;
            }
            vm.saveAndProceed(buttonCategory, res.data);
          }
        }
      }).catch((error) => {
        vm.saveBtnDisableFlag = false;
        return BaseService.getErrorLog(error);
      });
    };

    vm.saveAndProceed = (buttonCategory, data) => {
      if (data) {
        vm.data = data;
      }
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.AddPartTypeForm.$setPristine();
        vm.pageInit(data);
        vm.getDetails(data.id);
        vm.checkDirty = false;
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.checkFormDirty(vm.AddPartTypeForm);
        if (isdirty) {
          const data = {
            form: vm.AddPartTypeForm
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
              vm.AddPartTypeForm.$setPristine();
              if (vm.autoCompletepartType) {
                vm.autoCompletepartType.searchText = null;
              }
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.pageInit();
          vm.AddPartTypeForm.$setPristine();
          if (vm.autoCompletepartType) {
            vm.autoCompletepartType.searchText = null;
          }
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.hide(vm.data);
      }
      setFocusByName('partTypeName');
    };
    //update detais
    vm.selectedFunctional = (data) => {
      $timeout(() => {
        if (!vm.isMaster) {
          vm.partTypeModel.id = data.id;
          vm.autoCompletepartType.keyColumnId = vm.partTypeModel.id;
          vm.partTypeModel.isActive = data.isActive ? true : false;
          vm.partTypeModel.systemGenerated = data.systemGenerated ? true : false;
          vm.partTypeModel.isTemperatureSensitive = data.isTemperatureSensitive ? true : false;
          getFunctionalTypeSearch({ id: vm.partTypeModel.id });
        }
        else {
          vm.partTypeModel.id = data.id;
          const promises = [retrivePartType(), getComponentGenericAlias()];
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
            vm.partTypeModel.alias = responses[1];
            _.each(vm.partTypeModel.alias, (item) => {
              item.isDefaultAlias = item.alias.toLowerCase() === vm.partTypeModel.partTypeName.toLowerCase();
              item.index = item.alias.toLowerCase() === vm.partTypeModel.partTypeName.toLowerCase() ? 1 : 2;
            });
          });
        }
      }, true);
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.AddPartTypeForm);
      if (isdirty || vm.checkDirty) {
        const data = {
          form: vm.AddPartTypeForm
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

    // Function call on part type blue event and check code exist or not
    vm.checkDuplicateName = (buttonCategory) => {
      vm.isduplicate = false;
      if (!vm.isMaster) {
        if (vm.autoCompletepartType.keyColumnId || vm.autoCompletepartType.keyColumnId === 0) {
          const objfunctional = _.find(vm.functionalTypeList, (functional) => functional.id === vm.autoCompletepartType.keyColumnId);
          vm.partTypeModel.partTypeName = objfunctional.partTypeName;
        }
        else {
          vm.partTypeModel.partTypeName = vm.autoCompletepartType.searchText;
        }
      }
      if (vm.partTypeModel.partTypeName && vm.name !== vm.partTypeModel.partTypeName) {
        vm.cgBusyLoading = RFQSettingFactory.checkDuplicatePartType().save({
          id: (vm.partTypeModel.id || vm.partTypeModel.id === 0) ? vm.partTypeModel.id : null,
          partTypeName: vm.partTypeModel.partTypeName,
          refTableName: CORE.TABLE_NAME.RFQ_PARTTYPE
        }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicate) {
            vm.isduplicate = true;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY);
            messageContent.message = stringFormat(messageContent.message, vm.partTypeModel.partTypeName);
            const uniqueObj = {
              messageContent: messageContent,
              controlName: 'partTypeName'
            };
            vm.partTypeModel.partTypeName = null;
            if (!vm.isMaster) {
              vm.autoCompletepartType.searchText = null;
            }
            displayCodeAliasUniqueMessage(uniqueObj);
          }
          else if (!vm.isMaster) {
            vm.savePartType(buttonCategory);
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
      vm.autoCompletepartType = {
        columnName: 'partTypeName',
        keyColumnName: 'id',
        keyColumnId: data ? data.id : null,
        inputName: 'Search Functional Type',
        placeholderName: 'Search Functional or Add',
        isRequired: true,
        isAddnew: false,
        callbackFn: function (obj) {
          const searchObj = {
            id: obj.id
          };
          return getFunctionalTypeSearch(searchObj);
        },
        onSelectCallbackFn: function (item) {
          getFunctionalTypeDetail(item);
        },
        onSearchFn: function (query) {
          const searchObj = {
            searchQuery: query,
            inputName: vm.autoCompletepartType.inputName
          };
          return getFunctionalTypeSearch(searchObj);
        }
      };
      if (data.Name) {
        $timeout(() => {
          vm.autoCompletepartType.searchText = data.Name;
        });
      }
    }
    //on select of functional type
    function getFunctionalTypeDetail(item) {
      if (item) {
        vm.partTypeModel.id = item.id;
        const promises = [retrivePartType(), getComponentGenericAlias()];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          vm.partTypeModel.alias = responses[1];
          _.each(vm.partTypeModel.alias, (item) => {
            if (item.mfgCodeList) {
              item.mfgCodeList = item.mfgCodeList ? item.mfgCodeList.split('#$#') : null;
            }
            if (vm.partTypeModel.partTypeName) {
              item.isDefaultAlias = item.alias.toLowerCase() === vm.partTypeModel.partTypeName.toLowerCase();
              item.index = item.alias.toLowerCase() === vm.partTypeModel.partTypeName.toLowerCase() ? 1 : 2;
            }
          });
        });
      }
      else {
        vm.partTypeModel.id = null;
        vm.partTypeModel.partTypeName = null;
        vm.partTypeModel.alias = [];
      }
    }
    function getFunctionalTypeSearch(searchObj) {
      return RFQSettingFactory.getFunctionalTypeList().query(searchObj).$promise.then((partTypes) => {
        if (partTypes && partTypes.data) {
          vm.functionalTypeList = partTypes.data;
          const selectedFunctionalType = partTypes.data[0];
          if (!vm.autoCompletepartType) {
            initAutoComplete();
          } else {
            vm.partTypeModel.partTypeName = vm.autoCompletepartType.searchText;
          }
          if (searchObj && (searchObj.id || searchObj.id === 0)) {
            $timeout(() => {
              if (vm.autoCompletepartType) {
                vm.autoCompletepartType.searchText = selectedFunctionalType.partTypeName;
                $scope.$broadcast(vm.autoCompletepartType.inputName, selectedFunctionalType);
              }
            });
          }
          return partTypes.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    /* set selected alias as default one and set it as functional type */
    vm.setAliasAsDefault = (aliasItem) => {
      if (aliasItem && aliasItem.id) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SET_ALIAS_AS_DEFAULT_NAME);
        messageContent.message = stringFormat(messageContent.message, aliasItem.alias, 'functional type');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.partTypeModel.partTypeName = aliasItem.alias;
            const defaultAlias = _.find(vm.partTypeModel.alias, (dAlias) => dAlias.isDefaultAlias);
            if (defaultAlias) {
              defaultAlias.isDefaultAlias = false;
              defaultAlias.index = 2;
            }
            aliasItem.isDefaultAlias = true;
            aliasItem.index = 1;
            vm.AddPartTypeForm.$$controls[0].$setDirty();
          }
        }, () => {
          // empty
        });
      }
    };
    //on load submit form
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.AddPartTypeForm);
    });
  }
})();
