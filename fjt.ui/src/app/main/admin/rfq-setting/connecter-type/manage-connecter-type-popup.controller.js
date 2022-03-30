(function () {
  'use strict';
  angular
    .module('app.admin.rfqsetting')
    .controller('ManageConnecterTypePopupController', ManageConnecterTypePopupController);
  /** @ngInject */
  function ManageConnecterTypePopupController($mdDialog, $q, data, CORE, USER, RFQSettingFactory, BaseService, DialogFactory, ComponentFactory, $scope, $timeout) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.taToolbar = CORE.Toolbar;
    vm.EmptyMesssageAliaslist = USER.ADMIN_EMPTYSTATE.MFG;
    vm.tables = CORE.TABLE_NAME.RFQ_CONNECTERTYPE;
    vm.isMaster = data ? data.isMaster : false;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.checkDirty = false;
    vm.searchType = CORE.RFQ_SETTING.ConnectorType;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.pageInit = (data) => {
      vm.connecterModel = {
        id: data ? data.id : null,
        name: data ? data.Name : null,
        description: null,
        isActive: true,
        refTableName: CORE.TABLE_NAME.RFQ_CONNECTERTYPE,
        alias: []
      };
      vm.alias = data && data.aliasText ? data.aliasText : null;
    };
    vm.pageInit(data);
    vm.name = vm.connecterModel.name;
    vm.getDetails = (id) => {
      vm.connecterModel.id = id;
      const promises = [retriveConnectorList(), getComponentGenericAlias()];
      vm.cgBusyLoading = $q.all(promises).then((responses) => {
        vm.connecterModel.alias = responses[1];
        _.each(vm.connecterModel.alias, (item) => {
          if (item.mfgCodeList) {
            item.mfgCodeList = item.mfgCodeList ? item.mfgCodeList.split('#$#') : null;
          }
          if (vm.connecterModel.name) {
            item.isDefaultAlias = item.alias.toLowerCase() === vm.connecterModel.name.toLowerCase();
            item.index = item.alias.toLowerCase() === vm.connecterModel.name.toLowerCase() ? 1 : 2;
          }
        });
      });
    };
    if (data && (data.id || data.id === 0)) {
      vm.getDetails(data.id);
    }
    if (!vm.isMaster) {
      getConnectorTypeSearch();
    }

    //get connector deails
    function retriveConnectorList() {
      return RFQSettingFactory.retriveConnecterType().query({
        id: vm.connecterModel.id
      }).$promise.then((response) => {
        if (response && response.data) {
          vm.name = _.clone(response.data.name);
          vm.connecterModel.name = response.data.name;
          vm.connecterModel.description = response.data.description;
          vm.connecterModel.isActive = response.data.isActive ? response.data.isActive : false;
          vm.connecterModel.systemGenerated = response.data.systemGenerated;
          vm.copyActive = angular.copy(vm.connecterModel.isActive);
        }
        return response.data;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //retrive all alis of functional type
    function getComponentGenericAlias() {
      var data = {
        refId: vm.connecterModel.id,
        refTableName: CORE.TABLE_NAME.RFQ_CONNECTERTYPE
      };
      return ComponentFactory.getComponentGenericAlias().query(data).$promise.then((res) => {
        if (res && res.data) {
          vm.connecterModel.alias = _.clone(res.data);
          _.each(vm.connecterModel.alias, (item) => {
            if (item.mfgCodeList) {
              item.mfgCodeList = item.mfgCodeList ? item.mfgCodeList.split('#$#') : null;
            }
            if (vm.connecterModel.name) {
              item.isDefaultAlias = item.alias.toLowerCase() === vm.connecterModel.name.toLowerCase();
              item.index = item.alias.toLowerCase() === vm.connecterModel.name.toLowerCase() ? 1 : 2;
            }
          });
          return res.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //remove alias
    vm.removeAliasFromList = (item) => {
      const objIndex = vm.connecterModel.alias.indexOf(item);
      vm.connecterModel.alias.splice(objIndex, 1);
      vm.checkDirty = true;
      vm.AddConnecterTypeForm.$$controls[0].$setDirty();
    };
    //add alias for connector type
    vm.updateAliasList = ($event, alias) => {
      if (vm.AddConnecterTypeForm.connectorTypealias.$invalid) {
        return;
      }
      if (!vm.alias || (!vm.isMaster && vm.autoCompleteConnectorType && !vm.autoCompleteConnectorType.searchText)) {
        return;
      }
      if (!vm.isMaster) {
        if (vm.autoCompleteConnectorType.keyColumnId || vm.autoCompleteConnectorType.keyColumnId === 0) {
          const objConnector = _.find(vm.connectorTypeList, (connector) => connector.id === vm.autoCompleteConnectorType.keyColumnId);
          vm.connecterModel.name = objConnector.name;
        }
        else {
          vm.connecterModel.name = vm.autoCompleteConnectorType.searchText;
        }
      }
      const aliasObj = _.find(vm.connecterModel.alias, (item) => item.alias.toLowerCase() === alias.toLowerCase());
      if (aliasObj) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
        messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, vm.connecterModel.name);
        const uniqueObj = {
          messageContent: messageContent,
          isSetAliasNull: true,
          controlName: 'connectorTypealias'
        };
        displayCodeAliasUniqueMessage(uniqueObj);
        vm.AddConnecterTypeForm.$setDirty();
      }
      else {
        vm.cgBusyLoading = RFQSettingFactory.checkUniqueConnectorTypeAlias().save({
          alias: vm.alias,
          id: vm.connecterModel.id,
          refTableName: CORE.TABLE_NAME.RFQ_CONNECTERTYPE

        }).$promise.then((response) => {
          if (response && response.data && (response.data.connectorAliasExistsInfo || response.data.connectorTypeExistsInfo)) {
            if (response.data.connectorAliasExistsInfo) {
              const aliasobj = _.find(vm.connecterModel.alias, (alias) => alias.alias.toLowerCase() === response.data.connectorAliasExistsInfo.alias.toLowerCase());
              if (aliasobj) {
                if (vm.alias) {
                  vm.connecterModel.alias.unshift({
                    id: aliasobj.id,
                    alias: vm.alias,
                    createdAt: new Date(),
                    fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                  });
                }
                vm.alias = null;
              } else {
                checkValidateAliasDetails(response.data.connectorAliasExistsInfo);
              }
            }
            else if (response.data.connectorTypeExistsInfo) {
              const aliasobj = _.find(vm.connecterModel.alias, (alias) => alias.alias.toLowerCase() === response.data.connectorTypeExistsInfo.name.toLowerCase());
              if (aliasobj) {
                if (vm.alias) {
                  vm.connecterModel.alias.unshift({
                    id: aliasobj.id,
                    alias: vm.alias,
                    createdAt: new Date(),
                    fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                  });
                }
                vm.alias = null;
              } else {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
                messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, response.data.connectorTypeExistsInfo.name);
                const uniqueObj = {
                  messageContent: messageContent,
                  isSetAliasNull: true,
                  controlName: 'connectorTypealias'
                };
                displayCodeAliasUniqueMessage(uniqueObj);
                return;
              }
            }
          } else {
            if (vm.alias) {
              vm.connecterModel.alias.unshift({
                alias: vm.alias,
                createdAt: new Date(),
                fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
              });
            }
            if (checkResponseHasCallBackFunctionPromise(response)) {
              response.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.AddConnecterTypeForm);
              });
            }
            vm.alias = null;
          }
          vm.AddConnecterTypeForm.$setDirty();
          vm.checkDirty = true;
        });
      }
    };

    function checkValidateAliasDetails(connectoralias) {
      if (connectoralias) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
        messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, connectoralias.connectorTypeName);
        const uniqueObj = {
          messageContent: messageContent,
          isSetAliasNull: true,
          controlName: 'connectorTypealias'
        };
        displayCodeAliasUniqueMessage(uniqueObj);
        return true;
      }
      return false;
    }
    /* connector type unique message */
    const displayCodeAliasUniqueMessage = (uniqueObj) => {
      const obj = {
        messageContent: uniqueObj.messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
        multiple: true
      };
      DialogFactory.messageAlertDialog(obj).then(() => {
        if (uniqueObj.controlName) {
          setFocusByName(uniqueObj.controlName);
          vm.saveBtnDisableFlag = false;
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

    //connector
    vm.saveConnectorType = (buttonCategory) => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.AddConnecterTypeForm)) {
        vm.saveBtnDisableFlag = false;
        if (vm.connecterModel.id && !vm.checkFormDirty(vm.AddConnecterTypeForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          $mdDialog.hide(vm.data);
        }
        return;
      }
      if (vm.connecterModel.id && vm.copyActive !== vm.connecterModel.isActive) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.STATUS_CHANGE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.copyActive ? 'Enable' : 'Disable', vm.connecterModel.isActive ? 'Enable' : 'Disable');
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
            saveConnectorType(buttonCategory);
          }
        }, () => {
          vm.saveBtnDisableFlag = false;
        });
      }
      else {
        saveConnectorType(buttonCategory);
      }
    };
    //save connector type
    function saveConnectorType(buttonCategory) {
      if (!vm.isMaster) {
        if (vm.autoCompleteConnectorType.keyColumnId || vm.autoCompleteConnectorType.keyColumnId === 0) {
          const objConnector = _.find(vm.connectorTypeList, (connector) => connector.id === vm.autoCompleteConnectorType.keyColumnId);
          if (objConnector) {
            vm.connecterModel.name = vm.connecterModel.name ? vm.connecterModel.name : objConnector.name;
          }
        }
        else {
          vm.connecterModel.name = vm.autoCompleteConnectorType.searchText;
        }
      }
      if (vm.AddConnecterTypeForm.$invalid || !vm.connecterModel.name) {
        BaseService.focusRequiredField(vm.AddConnecterTypeForm);
        vm.saveBtnDisableFlag = false;
        return;
      }
      const alias = _.find(vm.connecterModel.alias, (als) => als.alias.toLowerCase() === vm.connecterModel.name.toLowerCase());
      if (!alias) {
        const newalias = {
          alias: vm.connecterModel.name,
          createdAt: new Date(),
          fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
        };
        vm.connecterModel.alias.push(newalias);
      }
      if (!vm.isSaveConnector) {
        vm.isSaveConnector = true;
      } else { return; }
      $timeout(() => {
        vm.cgBusyLoading = RFQSettingFactory.connecterType().save(vm.connecterModel).$promise.then((res) => {
          vm.isSaveConnector = false;
          vm.saveBtnDisableFlag = false;
          if (res.data) {
            if ((res.data.id || res.data.id === 0) && !vm.isduplicate) {
              if (vm.connecterModel.alias) {
                res.data.alias = vm.connecterModel.alias;
                vm.saveAndProceed(buttonCategory, res.data);
              }
            }
          } else {
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.AddConnecterTypeForm);
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
        vm.AddConnecterTypeForm.$setPristine();
        vm.pageInit(data);
        vm.getDetails(data.id);
        vm.checkDirty = false;
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.checkFormDirty(vm.AddConnecterTypeForm);
        if (isdirty) {
          const data = {
            form: vm.AddConnecterTypeForm
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
              vm.AddConnecterTypeForm.$setPristine();
              if (vm.autoCompleteConnectorType) {
                vm.autoCompleteConnectorType.searchText = null;
              }
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.pageInit();
          vm.AddConnecterTypeForm.$setPristine();
          if (vm.autoCompleteConnectorType) {
            vm.autoCompleteConnectorType.searchText = null;
          }
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.hide(vm.data);
      }
      setFocusByName('connectertype');
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.AddConnecterTypeForm);
      if (isdirty) {
        const data = {
          form: vm.AddConnecterTypeForm
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
    //update detais

    vm.selectedConnector = (data) => {
      $timeout(() => {
        if (!vm.isMaster) {
          vm.connecterModel.id = data.id;
          vm.autoCompleteConnectorType.keyColumnId = vm.connecterModel.id;
          vm.connecterModel.description = data.description;
          vm.connecterModel.isActive = data.isActive ? true : false;
          vm.connecterModel.systemGenerated = data.systemGenerated ? true : false;
          getConnectorTypeSearch({ id: vm.connecterModel.id });
        }
        else {
          vm.connecterModel.id = data.id;
          const promises = [retriveConnectorList(), getComponentGenericAlias()];
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
            vm.connecterModel.alias = responses[1];
            _.each(vm.connecterModel.alias, (item) => {
              item.isDefaultAlias = item.alias.toLowerCase() === vm.connecterModel.name.toLowerCase();
              item.index = item.alias.toLowerCase() === vm.connecterModel.name.toLowerCase() ? 1 : 2;
            });
          });
        }
      }, true);
    };

    // Function call on connector type blue event and check name exist or not
    vm.checkDuplicateName = (buttonCategory) => {
      vm.isduplicate = false;
      if (!vm.isMaster) {
        if (vm.autoCompleteConnectorType.keyColumnId || vm.autoCompleteConnectorType.keyColumnId === 0) {
          const objConnector = _.find(vm.connectorTypeList, (connector) => connector.id === vm.autoCompleteConnectorType.keyColumnId);
          vm.connecterModel.name = objConnector.name;
        }
        else {
          vm.connecterModel.name = vm.autoCompleteConnectorType.searchText;
        }
      }
      if (vm.connecterModel.name && vm.name !== vm.connecterModel.name) {
        vm.cgBusyLoading = RFQSettingFactory.checkDuplicateConnectorType().save({
          id: (vm.connecterModel.id || vm.connecterModel.id === 0) ? vm.connecterModel.id : null,
          name: vm.connecterModel.name,
          refTableName: CORE.TABLE_NAME.RFQ_CONNECTERTYPE
        }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.data && res.data.isDuplicate) {
            vm.isduplicate = true;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY);
            messageContent.message = stringFormat(messageContent.message, vm.connecterModel.name);
            const uniqueObj = {
              messageContent: messageContent,
              controlName: 'connectertype'
            };
            vm.connecterModel.name = null;
            if (!vm.isMaster) {
              vm.autoCompleteConnectorType.searchText = null;
            }
            displayCodeAliasUniqueMessage(uniqueObj);
          }
          else if (!vm.isMaster) {
            vm.saveConnectorType(buttonCategory);
          } else {
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.AddConnecterTypeForm);
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    //auto complete initialize
    function initAutoComplete() {
      vm.autoCompleteConnectorType = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: vm.connecterModel.id,
        inputName: 'Search Connector Type',
        placeholderName: 'Search Connector or Add',
        isRequired: true,
        isAddnew: false,
        callbackFn: function (obj) {
          const searchObj = {
            id: obj.id
          };
          return getConnectorTypeSearch(searchObj);
        },
        onSelectCallbackFn: function (item) {
          getConnectorTypeDetail(item);
        },
        onSearchFn: function (query) {
          const searchObj = {
            searchQuery: query,
            inputName: vm.autoCompleteConnectorType.inputName
          };
          return getConnectorTypeSearch(searchObj);
        }
      };
      $timeout(() => {
        vm.autoCompleteConnectorType.searchText = data.Name;
      });
    }
    //get list for connector type from data base
    function getConnectorTypeSearch(searchObj) {
      return RFQSettingFactory.getConnectorTypeList().query(searchObj).$promise.then((connectorTypes) => {
        if (connectorTypes && connectorTypes.data) {
          vm.connectorTypeList = connectorTypes.data;
          const selectedConnectorType = connectorTypes.data[0];
          if (!vm.autoCompleteConnectorType) {
            initAutoComplete();
          } else {
            vm.connecterModel.name = vm.autoCompleteConnectorType.searchText;
          }
          if (searchObj && (searchObj.id || searchObj.id === 0)) {
            $timeout(() => {
              if (vm.autoCompleteConnectorType) {
                vm.autoCompleteConnectorType.searchText = selectedConnectorType.name;
                $scope.$broadcast(vm.autoCompleteConnectorType.inputName, selectedConnectorType);
              }
            });
          }
          return connectorTypes.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //on select of connector type
    function getConnectorTypeDetail(item) {
      if (item) {
        vm.connecterModel.id = item.id;
        const promises = [retriveConnectorList(), getComponentGenericAlias()];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          vm.connecterModel.alias = responses[1];
          _.each(vm.connecterModel.alias, (item) => {
            if (item.mfgCodeList) {
              item.mfgCodeList = item.mfgCodeList ? item.mfgCodeList.split('#$#') : null;
            }
            if (vm.connecterModel.name) {
              item.isDefaultAlias = item.alias.toLowerCase() === vm.connecterModel.name.toLowerCase();
              item.index = item.alias.toLowerCase() === vm.connecterModel.name.toLowerCase() ? 1 : 2;
            }
          });
        });
      }
      else {
        vm.connecterModel.id = null;
        vm.connecterModel.name = null;
        vm.connecterModel.alias = [];
      }
    }
    /* set selected alias as default one and set it as mounting type */
    vm.setAliasAsDefault = (aliasItem) => {
      if (aliasItem && aliasItem.id) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SET_ALIAS_AS_DEFAULT_NAME);
        messageContent.message = stringFormat(messageContent.message, aliasItem.alias, 'connector type');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.connecterModel.name = aliasItem.alias;
            const defaultAlias = _.find(vm.connecterModel.alias, (dAlias) => dAlias.isDefaultAlias);
            if (defaultAlias) {
              defaultAlias.isDefaultAlias = false;
              defaultAlias.index = 2;
            }
            aliasItem.isDefaultAlias = true;
            aliasItem.index = 1;
            vm.AddConnecterTypeForm.$$controls[0].$setDirty();
          }
        }, () => {
          // empty
        });
      }
    };
    //on load submit form
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.AddConnecterTypeForm);
      BaseService.focusOnFirstEnabledField(vm.AddConnecterTypeForm);
    });
  }
})();
