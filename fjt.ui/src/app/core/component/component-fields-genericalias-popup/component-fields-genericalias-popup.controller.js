(function () {
  'use strict';
  angular
    .module('app.core')
    .controller('ComponentFieldGenericAliasController', ComponentFieldGenericAliasController);
  /** @ngInject */
  function ComponentFieldGenericAliasController($mdDialog, $q, DialogFactory, ComponentFactory, data, CORE, USER, BaseService, $timeout, $scope, $rootScope, RFQSettingFactory, CountryMstFactory, CountryFactory) {

    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.tableName = CORE.TABLE_NAME;
    vm.EmptyMesssageAliaslist = USER.ADMIN_EMPTYSTATE.MFG;
    vm.isSaveDisable = true;
    vm.DefaultDateFormat = _dateDisplayFormat;
    var loginUser = BaseService.loginUser;
    vm.tables = data.refTableName;
    if (vm.tableName.RFQ_MOUNTINGTYPE == data.refTableName) {
      vm.title = CORE.RFQ_SETTING.MountingTypeAlias;
      vm.searchType = CORE.RFQ_SETTING.MountingType;
    }
    else if (vm.tableName.RFQ_PARTTYPE == data.refTableName) {
      vm.title = CORE.RFQ_SETTING.FunctionalTypeAlias;
      vm.searchType = CORE.RFQ_SETTING.FunctionalType;
    }
    else if (vm.tableName.UOM == data.refTableName) {
      vm.title = CORE.RFQ_SETTING.UnitAlias;
      vm.searchType = CORE.RFQ_SETTING.UOM;
    }
    else if (vm.tableName.RFQ_ROHS == data.refTableName) {
      vm.title = CORE.RFQ_SETTING.RoHSAlias;
      vm.searchType = CORE.RFQ_SETTING.RoHS;
    }
    else if (vm.tableName.COUNTRY == data.refTableName) {
      vm.title = CORE.RFQ_SETTING.CountryAlias;
      vm.searchType = CORE.RFQ_SETTING.Country;
    }
    else if (vm.tableName.RFQ_CONNECTERTYPE == data.refTableName) {
      vm.title = CORE.RFQ_SETTING.ConnectorTypeAlias;
      vm.searchType = CORE.RFQ_SETTING.ConnectorType;
    }

    vm.genericAliasModel = {
      refTableName: data.refTableName,
      refId: data.refId,
      id: null,
      alias: [],
      isAliasSmallLetter: data.isAliasSmallLetter
    }
    vm.alias = data.aliasText;
    vm.autoCompleteAlias = null;

    /* unit dropdown fill up */
    let getUomlist = (insertedDataFromPopup) => {
      return ComponentFactory.getUOMsList().query().$promise.then((res) => {
        if (!vm.autoCompleteAlias) {
          vm.autoCompleteAlias = {
            columnName: 'unitName',
            keyColumnName: 'id',
            keyColumnId: (vm.genericAliasModel.refId || vm.genericAliasModel.refId == 0) ? vm.genericAliasModel.refId : null,
            inputName: 'Unit',
            placeholderName: 'Unit',
            isRequired: true,
            isAddnew: false,
            callbackFn: getUomlist,
            isDisabled: false,
            onSelectCallbackFn: getUOM
          }
        }
        vm.tableAliasList = res.data;
        return res.data;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let getUOM = (item) => {
      if (item) {
        vm.isSaveDisable = false;
        vm.genericAliasModel.refId = item.id;
        vm.name = item.unitName;
        var UOMData = {
          refId: item.id,
          refTableName: data.refTableName
        }
        getComponentGenericAlias(UOMData);
      }
      else {
        vm.name = null;
        vm.isSaveDisable = true;
        vm.genericAliasModel.refId = null;
      }
    }

    /* mountingType dropdown fill up */
    let mountingType = (insertedDataFromPopup) => {
      return ComponentFactory.getMountingTypeList().query().$promise.then((res) => {
        if (!vm.autoCompleteAlias) {
          vm.autoCompleteAlias = {
            columnName: 'name',
            keyColumnName: 'id',
            controllerName: USER.ADMIN_MOUNTING_TYPE_ADD_UPDATE_MODAL_CONTROLLER,
            viewTemplateURL: USER.ADMIN_MOUNTING_TYPE_ADD_UPDATE_MODAL_VIEW,
            keyColumnId: (vm.genericAliasModel.refId || vm.genericAliasModel.refId == 0) ? vm.genericAliasModel.refId : null,
            inputName: 'Mounting Type',
            placeholderName: 'Mounting Type',
            isRequired: true,
            isAddnew: true,
            callbackFn: mountingType,
            isDisabled: false,
            onSelectCallbackFn: getmountingType
          }
        }
        vm.tableAliasList = res.data;
        return res.data;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let getmountingType = (item) => {
      if (item) {
        vm.isSaveDisable = false;
        vm.genericAliasModel.refId = item.id;
        vm.name = item.name;
        var mountingTypeData = {
          refId: item.id,
          refTableName: data.refTableName
        }
        getComponentGenericAlias(mountingTypeData);
      }
      else {
        vm.name = null;
        vm.isSaveDisable = true;
        vm.genericAliasModel.refId = null;
      }
    }

    /* rohs dropdown fill up */
    let rohs = (insertedDataFromPopup) => {
      return ComponentFactory.getRohsList().query().$promise.then((res) => {
        if (!vm.autoCompleteAlias) {
          vm.autoCompleteAlias = {
            columnName: 'name',
            keyColumnName: 'id',
            controllerName: USER.ADMIN_ROHS_ADD_UPDATE_MODAL_CONTROLLER,
            viewTemplateURL: USER.ADMIN_ROHS_ADD_UPDATE_MODAL_VIEW,
            keyColumnId: (vm.genericAliasModel.refId || vm.genericAliasModel.refId == 0) ? vm.genericAliasModel.refId : null,
            inputName: 'RoHS',
            placeholderName: 'RoHS',
            isRequired: true,
            isAddnew: false,
            callbackFn: rohs,
            isDisabled: false,
            onSelectCallbackFn: getrohs
          }
        }
        vm.tableAliasList = res.data;
        return res.data;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let getrohs = (item) => {
      // vm.isSaveDisable = true;
      if (item) {
        vm.isSaveDisable = false;
        vm.genericAliasModel.refId = item.id;
        vm.name = item.name;
        var rohsData = {
          refId: item.id,
          refTableName: data.refTableName
        }
        getComponentGenericAlias(rohsData);
      }
      else {
        vm.name = null;
        vm.isSaveDisable = true;
        vm.genericAliasModel.refId = null;
      }
    }

    let getCommonType = $scope.$on('updateType', (ev, data) => {
      $timeout(() => {
        vm.autoCompleteAlias.keyColumnId = data.id;
        vm.genericAliasModel.refId = data.id;
      }, true);
    });

    /* Part Type dropdown fill up */
    let partType = (insertedDataFromPopup) => {
      return ComponentFactory.getPartTypeList().query().$promise.then((res) => {
        if (!vm.autoCompleteAlias) {
          vm.autoCompleteAlias = {
            columnName: 'partTypeName',
            keyColumnName: 'id',
            controllerName: USER.ADMIN_PART_TYPE_ADD_UPDATE_MODAL_CONTROLLER,
            viewTemplateURL: USER.ADMIN_PART_TYPE_ADD_UPDATE_MODAL_VIEW,
            keyColumnId: (vm.genericAliasModel.refId || vm.genericAliasModel.refId == 0) ? vm.genericAliasModel.refId : null,
            inputName: 'Functional Category',
            placeholderName: 'Functional Category',
            isRequired: true,
            isAddnew: true,
            callbackFn: partType,
            isDisabled: false,
            onSelectCallbackFn: getPartType
          }
        }
        vm.tableAliasList = res.data;
        return res.data;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let getPartType = (item) => {
      //  vm.isSaveDisable = true;
      if (item) {
        vm.isSaveDisable = false;
        vm.genericAliasModel.refId = item.id;
        vm.name = item.partTypeName;
        var partTypeData = {
          refId: item.id,
          refTableName: data.refTableName
        }
        getComponentGenericAlias(partTypeData);
      }
      else {
        vm.name = null;
        vm.isSaveDisable = true;
        vm.genericAliasModel.refId = null;
      }
    }

    //update detais
    vm.selectedRoHS = (data, chnage) => {
      $timeout(() => {
        if (vm.tableName.COUNTRY == vm.tables) {
          vm.autoCompleteAlias.keyColumnId = data.countryID;
          vm.genericAliasModel.refId = data.countryID;
        }
        else {
          vm.autoCompleteAlias.keyColumnId = data.id;
          vm.genericAliasModel.refId = data.id;
        }
      }, true);
    }
    /* connecterType dropdown fill up */
    let connecterType = (insertedDataFromPopup) => {
      return ComponentFactory.getConnecterTypeList().query().$promise.then((res) => {
        if (!vm.autoCompleteAlias) {
          vm.autoCompleteAlias = {
            columnName: 'name',
            keyColumnName: 'id',
            controllerName: USER.ADMIN_CONNECTER_TYPE_ADD_UPDATE_MODAL_CONTROLLER,
            viewTemplateURL: USER.ADMIN_CONNECTER_TYPE_ADD_UPDATE_MODAL_VIEW,
            keyColumnId: (vm.genericAliasModel.refId || vm.genericAliasModel.refId == 0) ? vm.genericAliasModel.refId : null,
            inputName: 'Connector Type',
            placeholderName: 'Connector Type',
            isRequired: true,
            isAddnew: true,
            callbackFn: connecterType,
            isDisabled: false,
            onSelectCallbackFn: getconnecterType
          }
        }
        vm.tableAliasList = res.data;
        return res.data;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let getconnecterType = (item) => {
      //  vm.isSaveDisable = true;
      if (item) {
        vm.isSaveDisable = false;
        vm.name = item.name;
        vm.genericAliasModel.refId = item.id;
        var connecterTypeData = {
          refId: item.id,
          refTableName: data.refTableName
        }
        getComponentGenericAlias(connecterTypeData);
      }
      else {
        vm.name = null;
        vm.isSaveDisable = true;
        vm.genericAliasModel.refId = null;
      }
    }

    /* country dropdown fill up */
    let getCountryList = (insertedDataFromPopup) => {
      return CountryMstFactory.getAllCountry().query().$promise.then((res) => {
        if (!vm.autoCompleteAlias) {
          vm.autoCompleteAlias = {
            columnName: 'countryName',
            keyColumnName: 'countryID',
            keyColumnId: (vm.genericAliasModel.refId || vm.genericAliasModel.refId == 0) ? vm.genericAliasModel.refId : null,
            inputName: 'Country',
            placeholderName: 'Country',
            isRequired: true,
            isAddnew: false,
            callbackFn: getCountryList,
            isDisabled: false,
            onSelectCallbackFn: getCountry
          }
        }
        vm.tableAliasList = res.data;
        return res.data;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let getCountry = (item) => {      
      if (item) {
        vm.isSaveDisable = false;
        vm.genericAliasModel.refId = item.countryID;
        vm.name = item.countryName;
        var CountryData = {
          refId: item.countryID,
          refTableName: data.refTableName
        }
        getComponentGenericAlias(CountryData);        
      }
      else {
        vm.name = null;
        vm.isSaveDisable = true;
        vm.genericAliasModel.refId = null;
      }
    }

    if (data.isEdit) {
      switch (data.refTableName) {
        case vm.tableName.RFQ_MOUNTINGTYPE: {
          mountingType();
          break;
        }
        case vm.tableName.RFQ_PARTTYPE: {
          partType();
          break;
        }
        case vm.tableName.UOM: {
          getUomlist();
          break;
        }
        case vm.tableName.RFQ_ROHS: {
          rohs();
          break;
        }
        case vm.tableName.RFQ_CONNECTERTYPE: {
          connecterType();
          break;
        }
        case vm.tableName.COUNTRY: {
          getCountryList();
          break;
        }
      }
    }
    else {
      getComponentGenericAlias(data);
    }
    function checkValidateAliasDetails(commonAlias) {
      if (commonAlias) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
        messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, commonAlias.name);
        let uniqueObj = {
          messageContent: messageContent,
          isSetAliasNull: true
        }
        displayCodeAliasUniqueMessage(uniqueObj);
        return true;
      }
      return false;
    }
    /* common unique message */
    let displayCodeAliasUniqueMessage = (uniqueObj) => {
      let obj = {
        messageContent: uniqueObj.messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
        multiple: true
      };
      DialogFactory.messageAlertDialog(obj).then((yes) => {
        setFocusByName("genericalias");
        if (uniqueObj.isSetAliasNull) {
          vm.alias = null;
        }
      }, (cancel) => {
       
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    vm.updateAliasList = ($event, alias) => {
      
      var aliasObj = _.find(vm.genericAliasModel.alias, (item) => { return item.alias.toLowerCase() == alias.toLowerCase(); });
      if (aliasObj) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_TYPE_EXISTS);
        messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, vm.name);
        let uniqueObj = {
          messageContent: messageContent,
          isSetAliasNull: true
        }
       
        displayCodeAliasUniqueMessage(uniqueObj);
        vm.genericAliasForm.$setDirty();        
      }
      else {
        if (vm.tableName.COUNTRY == data.refTableName) {
          vm.cgBusyLoading = CountryFactory.checkUniqueCountryAlias().save({
            alias: angular.copy(vm.alias),
            id: vm.genericAliasModel.refId,
            refTableName: CORE.TABLE_NAME.COUNTRY,
          }).$promise.then((response) => {
            
            if (response && response.data && (response.data.aliasExistsInfo || response.data.aliasExistsInfo)) {
              if (response.data.aliasExistsInfo) {
                var aliasobj = _.find(vm.aliaslist.alias, (alias) => { return alias.alias.toLowerCase() == response.data.aliasExistsInfo.alias.toLowerCase(); });
                if (aliasobj) {
                  if (vm.alias)
                    vm.genericAliasModel.alias.unshift({
                      id: aliasobj.id,
                      alias: vm.alias,
                      createdAt: new Date(),
                      fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                    });
                  vm.alias = null;
                } else {
                  checkValidateAliasDetails(response.data.aliasExistsInfo);
                }
              }
              else if (response.data.countryExistsInfo) {
                var aliasobj = _.find(vm.aliaslist, (alias) => { return alias.alias.toLowerCase() == response.data.countryExistsInfo.countryName.toLowerCase(); });
                if (aliasobj) {
                  if (vm.alias)
                    vm.genericAliasModel.alias.unshift({
                      id: aliasobj.id,
                      alias: vm.alias,
                      createdAt: new Date(),
                      fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                    });
                  vm.alias = null;
                } else {
                  let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_TYPE_EXISTS);
                  messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, response.data.countryExistsInfo.countryName);
                  let uniqueObj = {
                    messageContent: messageContent,
                    isSetAliasNull: true
                  }
                  displayCodeAliasUniqueMessage(uniqueObj);
                  return;
                }
              }
            } else {
              if (vm.alias)
                vm.genericAliasModel.alias.unshift({
                  alias: vm.alias,
                  createdAt: new Date(),
                  fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                });
              vm.alias = null;
            }
            vm.genericAliasForm.$setDirty();
            vm.isSaveDisable = false;
          })
        }
        else if (vm.tableName.RFQ_PARTTYPE == data.refTableName) {
          vm.cgBusyLoading = RFQSettingFactory.checkUniquePartTypeAlias().save({
            alias: vm.alias,
            id: vm.genericAliasModel.refId,
            refTableName: CORE.TABLE_NAME.RFQ_PARTTYPE,

          }).$promise.then((response) => {
            if (response && response.data && (response.data.partAliasExistsInfo || response.data.partTypeExistsInfo)) {
              if (response.data.partAliasExistsInfo) {
                var aliasobj = _.find(vm.aliaslist, (alias) => { return alias.alias.toLowerCase() == response.data.partAliasExistsInfo.alias.toLowerCase(); });
                if (aliasobj) {
                  if (vm.alias)
                    vm.genericAliasModel.alias.unshift({
                      id: aliasobj.id,
                      alias: vm.alias,
                      createdAt: new Date(),
                      fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                    });                  
                  vm.alias = null;
                } else {
                  checkValidateAliasDetails(response.data.partAliasExistsInfo);
                }
              }
              else if (response.data.partTypeExistsInfo) {
                var aliasobj = _.find(vm.aliaslist, (alias) => { return alias.alias.toLowerCase() == response.data.partTypeExistsInfo.partTypeName.toLowerCase(); });
                if (aliasobj) {
                  if (vm.alias)
                    vm.genericAliasModel.alias.unshift({
                      id: aliasobj.id,
                      alias: vm.alias,
                      createdAt: new Date(),
                      fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                    });
                  vm.alias = null;
                } else {
                  let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_TYPE_EXISTS);
                  messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, response.data.partTypeExistsInfo.partTypeName);
                  let uniqueObj = {
                    messageContent: messageContent,
                    isSetAliasNull: true
                  }
                  displayCodeAliasUniqueMessage(uniqueObj);
                  return;
                }
              }
            } else {
              if (vm.alias)
                vm.genericAliasModel.alias.unshift({
                  alias: vm.alias,
                  createdAt: new Date(),
                  fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                });
              vm.alias = null;
            }
            vm.genericAliasForm.$setDirty();
            vm.isSaveDisable = false;
          })
        }
        else if (vm.tableName.RFQ_CONNECTERTYPE == data.refTableName) {
          vm.cgBusyLoading = RFQSettingFactory.checkUniqueConnectorTypeAlias().save({
            alias: vm.alias,
            id: vm.genericAliasModel.refId,
            refTableName: CORE.TABLE_NAME.RFQ_CONNECTERTYPE,
          }).$promise.then((response) => {
            if (response && response.data && (response.data.connectorAliasExistsInfo || response.data.connectorTypeExistsInfo)) {
              if (response.data.connectorAliasExistsInfo) {
                var aliasobj = _.find(vm.aliaslist, (alias) => { return alias.alias.toLowerCase() == response.data.connectorAliasExistsInfo.alias.toLowerCase(); });
                if (aliasobj) {
                  if (vm.alias)
                    vm.genericAliasModel.alias.unshift({
                      id: aliasobj.id,
                      alias: vm.alias,
                      createdAt: new Date(),
                      fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                    });
                  vm.alias = null;
                } else {
                  checkValidateAliasDetails(response.data.connectorAliasExistsInfo);
                }
              }
              else if (response.data.connectorTypeExistsInfo) {
                var aliasobj = _.find(vm.aliaslist, (alias) => { return alias.alias.toLowerCase() == response.data.connectorTypeExistsInfo.name.toLowerCase(); });
                if (aliasobj) {
                  if (vm.alias)
                    vm.genericAliasModel.alias.unshift({
                      id: aliasobj.id,
                      alias: vm.alias,
                      createdAt: new Date(),
                      fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                    });
                  vm.alias = null;
                } else {
                  let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_TYPE_EXISTS);
                  messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, response.data.connectorTypeName.name);
                  let uniqueObj = {
                    messageContent: messageContent,
                    isSetAliasNull: true
                  }
                  displayCodeAliasUniqueMessage(uniqueObj);
                  return;
                }
              }
            } else {
              if (vm.alias)
                vm.genericAliasModel.alias.unshift({
                  alias: vm.alias,
                  createdAt: new Date(),
                  fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                });
              vm.alias = null;
            }
            vm.genericAliasForm.$setDirty();
          })
        }
        else if (vm.tableName.RFQ_MOUNTINGTYPE == data.refTableName) {
          vm.cgBusyLoading = RFQSettingFactory.checkUniqueMountingTypeAlias().save({
            alias: vm.alias,
            id: vm.genericAliasModel.refId,
            refTableName: CORE.TABLE_NAME.RFQ_MOUNTINGTYPE,

          }).$promise.then((response) => {
            if (response && response.data && (response.data.mountingAliasExistsInfo || response.data.mountingTypeExistsInfo)) {
              if (response.data.mountingAliasExistsInfo) {
                var aliasobj = _.find(vm.aliaslist, (alias) => { return alias.alias.toLowerCase() == response.data.mountingAliasExistsInfo.alias.toLowerCase(); });
                if (aliasobj) {
                  if (vm.alias)
                    vm.genericAliasModel.alias.unshift({
                      id: aliasobj.id,
                      alias: vm.alias,
                      createdAt: new Date(),
                      fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                    });
                  vm.alias = null;
                } else {
                  checkValidateAliasDetails(response.data.mountingAliasExistsInfo);
                }
              }
              else if (response.data.mountingTypeExistsInfo) {
                var aliasobj = _.find(vm.aliaslist, (alias) => { return alias.alias.toLowerCase() == response.data.mountingTypeExistsInfo.name.toLowerCase(); });
                if (aliasobj) {
                  if (vm.alias)
                    vm.genericAliasModel.alias.unshift({
                      id: aliasobj.id,
                      alias: vm.alias,
                      createdAt: new Date(),
                      fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                    });
                  vm.alias = null;
                } else {
                  let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_TYPE_EXISTS);
                  messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, response.data.mountingTypeExistsInfo.name);
                  let uniqueObj = {
                    messageContent: messageContent,
                    isSetAliasNull: true
                  }
                  displayCodeAliasUniqueMessage(uniqueObj);
                  return;
                }
              }
            } else {
              if (vm.alias)
                vm.genericAliasModel.alias.unshift({
                  alias: vm.alias,
                  createdAt: new Date(),
                  fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                });
              vm.alias = null;
            }
            vm.genericAliasForm.$setDirty();
          })
        }
        else {
          vm.isSaveDisable = false;
          var aliasObj = _.find(vm.genericAliasModel.alias, (item) => { return item.alias == alias; });
          if (aliasObj) {
            let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_ALREADY_ADDED);
            var model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
          }
          else {
            if (vm.alias)
              vm.genericAliasModel.alias.unshift({
                alias: vm.alias,
                createdAt: new Date(),
                fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
              });
            setFocusByName("genericalias");
            vm.alias = null;
          }
        }
      }
    }
    vm.removeAliasFromList = (item) => {
      let objIndex = vm.genericAliasModel.alias.indexOf(item);
      vm.genericAliasModel.alias.splice(objIndex, 1);
      vm.checkDirty = true;
      vm.isSaveDisable = false;
      vm.genericAliasForm.$dirty = true;
    }
    /*Used to close pop-up*/
    vm.cancel = () => {
      /*vm.checkDirty flag used for delete alias dirty state*/
      let isdirty = vm.checkFormDirty(vm.genericAliasForm);
      if (isdirty || vm.checkDirty) {
        let data = {
          form: vm.genericAliasForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        DialogFactory.closeDialogPopup(vm.genericAliasModel.alias);
      }
    };
    /*Set as current form when page loaded*/
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.genericAliasForm);
    });
    /*Check for dirty form*/
    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }

    function getComponentGenericAlias(data) {
      vm.cgBusyLoading = ComponentFactory.getComponentGenericAlias().query(data).$promise.then((res) => {
        if (res && res.data) {
          vm.aliaslist = _.clone(res.data);
          vm.genericAliasModel.alias = res.data;
          _.each(vm.genericAliasModel.alias, (item) => {
            item.isDefaultAlias = item.alias.toLowerCase() == vm.name.toLowerCase();
            item.index = item.alias.toLowerCase() == vm.name.toLowerCase() ? 1 : 2;
          });
          vm.genericAliasModelCopy = angular.copy(vm.genericAliasModel);
          vm.checkDirtyObject = {
            oldModelName: vm.genericAliasModelCopy,
            newModelName: vm.genericAliasModel
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      })
    }

    vm.saveGenricAlias = (ev) => {
      
      //vm.genericAliasForm.$invalid || vm.isSaveDisable
      vm.isSaveDisable = true;
      if (vm.genericAliasForm.$invalid) {
        BaseService.focusRequiredField(vm.genericAliasForm);
        return;
      }
      if (vm.alias) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_NOT_ADDED_CONFRIMATION);
        var model = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(model).then((yes) => {
          if (yes)
            saveGenericAlias();            
        }, () => {
          // empty
        });
      }
      else 
        saveGenericAlias();              
      vm.isSaveDisable = false;
    }

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }

    function saveGenericAlias() {
      var columnName = vm.tableName.UOM == data.refTableName ? "unitName" : vm.tableName.RFQ_PARTTYPE == data.refTableName ? "partTypeName" : vm.tableName.COUNTRY == data.refTableName?"countryName": "name";
      var obj = _.find(vm.tableAliasList, (tab) => { return tab.id == vm.genericAliasModel.refId });
      if (vm.tableName.COUNTRY == data.refTableName) {
        obj = _.find(vm.tableAliasList, (tab) => { return tab.countryID == vm.genericAliasModel.refId });
      }
      if (obj) {
        var alias = _.find(vm.genericAliasModel.alias, (als) => { return als.alias.toLowerCase() == obj[columnName].toLowerCase() });
        if (!alias) {
          var newalias = {
            alias: obj[columnName],
            createdAt: new Date(),
            fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
          }
          vm.genericAliasModel.alias.push(newalias);
        }
      }

      vm.cgBusyLoading = ComponentFactory.saveGenericAlias().save(vm.genericAliasModel).$promise.then((res) => {
        if (res.data) {
          if (res.data.status == "alias") {
            var alias = res.data.data;
            var html = '<ul>';
            alias.forEach((x) => {
              html += '<li>' + x.alias + '</li>';
            });
            html += '</ul>'
            let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.COMPONENT_ALIAS_EXISTS);
            messageContent.message = stringFormat(messageContent.message, html);
            let obj = {
              messageContent: messageContent,
              multiple: true,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_CREATENEW_TEXT
            };
            DialogFactory.messageAlertDialog(obj).then((ok) => {
              BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.genericAliasForm);
            });
          }
          else {
            BaseService.currentPagePopupForm.pop();
            DialogFactory.hideDialogPopup(vm.genericAliasModel.alias);
          }
        }

      }).catch((error) => {
        return BaseService.getErrorLog(error);
      })
    }

    /* set selected alias as default one and set it as rohs type */
    vm.setAliasAsDefault = (aliasItem) => {
      if (aliasItem && aliasItem.id) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SET_ALIAS_AS_DEFAULT_NAME);
        messageContent.message = stringFormat(messageContent.message, aliasItem.alias, vm.title);
        let obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.genericAliasModel.name = aliasItem.alias;
            var defaultAlias = _.find(vm.genericAliasModel.alias, (dAlias) => { return dAlias.isDefaultAlias == true });
            if (defaultAlias) {
              defaultAlias.isDefaultAlias = false;
              defaultAlias.index = 2;
            }
            aliasItem.isDefaultAlias = true;
            aliasItem.index = 1;
            vm.genericAliasForm.$$controls[0].$setDirty();
          }
        }, () => {
          // empty
        });
      }
    }
    // on move to other controller destory all event
    $scope.$on('$destroy', function () {
      getCommonType();
    });


  }
})();
