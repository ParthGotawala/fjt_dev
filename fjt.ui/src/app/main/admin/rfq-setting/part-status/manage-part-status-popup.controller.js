(function () {
  'use strict';
  angular
    .module('app.admin.rfqsetting')
    .controller('ManagePartStatusPopupController', ManagePartStatusPopupController);
  /** @ngInject */
  function ManagePartStatusPopupController($mdDialog, data, CORE, USER, RFQSettingFactory, BaseService, $mdColorPicker, $q, DialogFactory, ComponentFactory, $scope, $timeout) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.taToolbar = CORE.Toolbar;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.EmptyMesssageAliaslist = USER.ADMIN_EMPTYSTATE.MFG;
    vm.tables = CORE.TABLE_NAME.COMPONENT_PARTSTATUS;
    vm.checkDirty = false;
    vm.searchType = CORE.RFQ_SETTING.PartStatus;
    vm.isMaster = data ? data.isMaster : false;
    vm.checkDirty = false;
    vm.aliasFieldName = 'partstatusalias';
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.pageInit = (data) => {
      vm.partStatusModel = {
        id: data ? data.id : null,
        name: data ? data.Name : null,
        isActive: true,
        refTableName: vm.tables,
        alias: []
      };
      vm.alias = data && data.aliasText ? data.aliasText : null;
    };
    vm.pageInit(data);
    if (!data || (data && !data.id)) {
      getPartStatusList();
    }

    vm.name = vm.partStatusModel.name;

    vm.getDetails = (id) => {
      vm.partStatusModel.id = id;
      const promises = [retrivePartStatus(), getComponentGenericAlias()];
      vm.cgBusyLoading = $q.all(promises).then((responses) => {
        vm.partStatusModel.alias = responses[1];
        _.each(vm.partStatusModel.alias, (item) => {
          if (item.mfgCodeList) {
            item.mfgCodeList = item.mfgCodeList ? item.mfgCodeList.split('#$#') : null;
          }
          if (vm.partStatusModel.name) {
            item.isDefaultAlias = item.alias.toLowerCase() === vm.partStatusModel.name.toLowerCase();
            item.index = item.alias.toLowerCase() === vm.partStatusModel.name.toLowerCase() ? 1 : 2;
          }
        });
      });
    };
    if (data && (data.id || data.id === 0)) {
      vm.getDetails(data.id);
    }
    if (!vm.isMaster) {
      getPartStatusSearch();
    }
    //retrive part status list
    function retrivePartStatus() {
      return RFQSettingFactory.retrivePartStatus().query({
        id: vm.partStatusModel.id
      }).$promise.then((response) => {
        if (response && response.data) {
          vm.partStatusModel.name = response.data.name;
          vm.partStatusModel.systemGenerated = response.data.systemGenerated;
          vm.partStatusModel.isActive = response.data.isActive ? response.data.isActive : false;
          vm.copyActive = angular.copy(vm.partStatusModel.isActive);
          let color;
          if (response.data.colorCode) {
            const rgbColor = new tinycolor(response.data.colorCode).toRgb();
            color = stringFormat(CORE.MOUNTING_TYPE_COLOR_FORMATE, rgbColor.r, rgbColor.g, rgbColor.b);
          }
          else {
            color = CORE.DEFAULT_MOUNTING_TYPE_COLOR;
          }
          vm.partStatusModel.colorCode = color;
          vm.partStatusModelCopy = _.clone(vm.partStatusModel);
          vm.checkDirtyObject = {
            oldModelName: vm.partStatusModelCopy,
            newModelName: vm.partStatusModel
          };
        }
        return response;
      }).catch((error) => BaseService.getErrorLog(error));
    }
    //get color
    function random_bg_color() {
      return 'rgb(' +
        (Math.floor(Math.random() * 56) + 200) + ', ' +
        (Math.floor(Math.random() * 56) + 200) + ', ' +
        (Math.floor(Math.random() * 56) + 200) +
        ')';
    }

    /* partstatus color list */
    function getPartStatusList() {
      return RFQSettingFactory.getPartStatusList().query().$promise.then((res) => {
        vm.partstatusColorList = res.data;
        let isNewCode = true;
        while (isNewCode) {
          const newCode = random_bg_color();
          if (!_.find(vm.partstatusColorList, (item) => item.colorCode === newCode)) {
            vm.partStatusModel.colorCode = newCode;
            isNewCode = false;
          }
        }
        return res.data;
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //retrive all alis of functional type
    function getComponentGenericAlias() {
      var data = {
        refId: vm.partStatusModel.id,
        refTableName: CORE.TABLE_NAME.COMPONENT_PARTSTATUS
      };
      return ComponentFactory.getComponentGenericAlias().query(data).$promise.then((res) => {
        if (res && res.data) {
          vm.partStatusModel.alias = _.clone(res.data);
          _.each(vm.partStatusModel.alias, (item) => {
            if (item.mfgCodeList) {
              item.mfgCodeList = item.mfgCodeList ? item.mfgCodeList.split('#$#') : null;
            }
            if (vm.partStatusModel.name) {
              item.isDefaultAlias = item.alias.toLowerCase() === vm.partStatusModel.name.toLowerCase();
              item.index = item.alias.toLowerCase() === vm.partStatusModel.name.toLowerCase() ? 1 : 2;
            }
          });
          return res.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    //remove alias
    vm.removeAliasFromList = (item) => {
      const objIndex = vm.partStatusModel.alias.indexOf(item);
      vm.partStatusModel.alias.splice(objIndex, 1);
      vm.AddPartStatusForm.$$controls[0].$setDirty();
      vm.checkDirty = true;
    };
    //add alias for part status
    vm.updateAliasList = ($event, alias) => {
      if (vm.AddPartStatusForm.partstatusalias.$invalid) {
        return;
      }
      if (!vm.alias || (!vm.isMaster && vm.autoCompletepartStatus && !vm.autoCompletepartStatus.searchText)) {
        return;
      }
      if (!vm.isMaster) {
        if (vm.autoCompletepartStatus.keyColumnId || vm.autoCompletepartStatus.keyColumnId === 0) {
          const objStatus = _.find(vm.partStatusList, (status) => status.id === vm.autoCompletepartStatus.keyColumnId);
          vm.partStatusModel.name = objStatus.name;
        }
        else {
          vm.partStatusModel.name = vm.autoCompletepartStatus.searchText;
        }
      }
      const aliasObj = _.find(vm.partStatusModel.alias, (item) => item.alias.toLowerCase() === alias.toLowerCase());
      if (aliasObj) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_TYPE_EXISTS);
        messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, vm.partStatusModel.name);
        const uniqueObj = {
          messageContent: messageContent,
          isSetAliasNull: true,
          controlName: vm.aliasFieldName
        };
        displayCodeAliasUniqueMessage(uniqueObj);
        vm.AddPartStatusForm.$setDirty();
      }
      else {
        vm.cgBusyLoading = RFQSettingFactory.checkUniquePartStatusAlias().save({
          alias: vm.alias,
          id: vm.partStatusModel.id,
          refTableName: CORE.TABLE_NAME.COMPONENT_PARTSTATUS

        }).$promise.then((response) => {
          if (response && response.data && (response.data.partstatusAliasExistsInfo || response.data.partStatusExistsInfo)) {
            if (response.data.partstatusAliasExistsInfo) {
              const aliasobj = _.find(vm.partStatusModel.alias, (alias) => alias.alias.toLowerCase() === response.data.partstatusAliasExistsInfo.alias.toLowerCase());
              if (aliasobj) {
                if (vm.alias) {
                  vm.partStatusModel.alias.unshift({
                    id: aliasobj.id,
                    alias: vm.alias,
                    createdAt: new Date(),
                    fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                  });
                }
                vm.alias = null;
              } else {
                checkValidateAliasDetails(response.data.partstatusAliasExistsInfo);
              }
            }
            else if (response.data.partStatusExistsInfo) {
              const aliasobj = _.find(vm.partStatusModel.alias, (alias) => alias.alias.toLowerCase() === response.data.partStatusExistsInfo.name.toLowerCase());
              if (aliasobj) {
                if (vm.alias) {
                  vm.partStatusModel.alias.unshift({
                    id: aliasobj.id,
                    alias: vm.alias,
                    createdAt: new Date(),
                    fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                  });
                }
                vm.alias = null;
              } else {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_TYPE_EXISTS);
                messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, response.data.partStatusExistsInfo.name);
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
              vm.partStatusModel.alias.unshift({
                alias: vm.alias,
                createdAt: new Date(),
                fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
              });
            }
            vm.alias = null;
            setFocusByName(vm.aliasFieldName);
          }
          vm.isupdated = true;
          vm.AddPartStatusForm.$setDirty();
        });
      }
    };

    function checkValidateAliasDetails(partStatusalias) {
      if (partStatusalias) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
        messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, partStatusalias.partStatusName);
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
    vm.savePartStatus = (buttonCategory) => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.AddPartStatusForm)) {
        vm.saveBtnDisableFlag = false;
        if (vm.partStatusModel.id && !vm.checkFormDirty(vm.AddPartStatusForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          $mdDialog.hide(vm.data);
        }
        return;
      }
      if (vm.partStatusModel.id && vm.copyActive !== vm.partStatusModel.isActive) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.STATUS_CHANGE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.copyActive ? 'Enable' : 'Disable', vm.partStatusModel.isActive ? 'Enable' : 'Disable');
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
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MFG_ALIAS_NOT_ADDED);
        const model = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(model).then((yes) => {
          if (yes) {
            savePartStatus(buttonCategory);
          }
        }, () => {
          vm.saveBtnDisableFlag = false;
        });
      }
      else {
        savePartStatus(buttonCategory);
      }
    };
    function savePartStatus(buttonCategory) {
      vm.isupdated = false;
      if (!vm.isMaster) {
        if (vm.autoCompletepartStatus.keyColumnId || vm.autoCompletepartStatus.keyColumnId === 0) {
          const objStatus = _.find(vm.partStatusList, (status) => status.id === vm.autoCompletepartStatus.keyColumnId);
          if (objStatus) {
            vm.partStatusModel.name = vm.partStatusModel.name ? vm.partStatusModel.name : objStatus.name;
          }
        }
        else {
          vm.partStatusModel.name = vm.autoCompletepartStatus.searchText;
        }
      }
      if (vm.AddPartStatusForm.$invalid || !vm.partStatusModel.name) {
        BaseService.focusRequiredField(vm.AddPartStatusForm);
        vm.saveBtnDisableFlag = false;
        return;
      }
      const alias = _.find(vm.partStatusModel.alias, (als) => als.alias.toLowerCase() === vm.partStatusModel.name.toLowerCase());
      if (!alias) {
        const newalias = {
          alias: vm.partStatusModel.name,
          createdAt: new Date(),
          fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
        };
        vm.partStatusModel.alias.push(newalias);
      }
      $timeout(() => {
        vm.cgBusyLoading = RFQSettingFactory.createPartStatus().save(vm.partStatusModel).$promise.then((res) => {
          vm.saveBtnDisableFlag = false;
          if (res.data) {
            if (res.data.id && !vm.isduplicate) {
              if (vm.partStatusModel.alias) {
                res.data.alias = vm.partStatusModel.alias;
              }
              vm.saveAndProceed(buttonCategory, res.data);
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
        vm.AddPartStatusForm.$setPristine();
        vm.pageInit(data);
        vm.getDetails(data.id);
        vm.checkDirty = false;
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.checkFormDirty(vm.AddPartStatusForm);
        if (isdirty) {
          const data = {
            form: vm.AddPartStatusForm
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
              vm.AddPartStatusForm.$setPristine();
              getPartStatusList().then(() => {
                vm.partStatusModelCopy = angular.copy(vm.partStatusModel);
              });
              if (vm.autoCompletepartStatus) {
                vm.autoCompletepartStatus.searchText = null;
              }
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.pageInit();
          vm.AddPartStatusForm.$setPristine();
          getPartStatusList().then(() => {
            vm.partStatusModelCopy = angular.copy(vm.partStatusModel);
          });
          if (vm.autoCompletepartStatus) {
            vm.autoCompletepartStatus.searchText = null;
          }
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.hide(vm.data);
      }
      setFocusByName('partstatus');
    };

    //update detais
    vm.selectedPart = (data) => {
      $timeout(() => {
        if (!vm.isMaster) {
          vm.partStatusModel.id = data.id;
          vm.autoCompletepartStatus.keyColumnId = vm.partStatusModel.id;
          let color;
          if (data.colorCode) {
            const rgbColor = new tinycolor(data.colorCode).toRgb();
            color = stringFormat(CORE.MOUNTING_TYPE_COLOR_FORMATE, rgbColor.r, rgbColor.g, rgbColor.b);
          }
          else {
            color = CORE.DEFAULT_MOUNTING_TYPE_COLOR;
          }
          vm.partStatusModel.colorCode = color;
          vm.partStatusModel.isActive = data.isActive ? true : false;
          vm.partStatusModel.systemGenerated = data.systemGenerated ? true : false;
          getPartStatusSearch({ id: vm.partStatusModel.id });
        }
        else {
          vm.partStatusModel.id = data.id;
          const promises = [retrivePartStatus(), getComponentGenericAlias()];
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
            vm.partStatusModel.alias = responses[1];
            _.each(vm.partStatusModel.alias, (item) => {
              item.isDefaultAlias = item.alias.toLowerCase() === vm.partStatusModel.name.toLowerCase();
              item.index = item.alias.toLowerCase() === vm.partStatusModel.name.toLowerCase() ? 1 : 2;
            });
            //
          });
        }
      }, true);
    };
    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.AddPartStatusForm);
      if (isdirty || vm.checkDirty) {
        const data = {
          form: vm.AddPartStatusForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.hide(true);
      }
    };

    vm.checkFormDirty = (form) => {
      let checkDirty = BaseService.checkFormDirty(form, vm.checkDirtyObject);
      if (!checkDirty && (vm.partStatusModelCopy && vm.partStatusModel && (vm.partStatusModelCopy.colorCode !== vm.partStatusModel.colorCode) || (vm.isupdated))) {
        checkDirty = true;
      }
      return !vm.checkDirty ? checkDirty : vm.checkDirty;
    };
    //select color code for part status
    vm.getColor = ($event, colorCode) => {
      var color = CORE.DEFAULT_STANDARD_CLASS_COLOR;
      if (colorCode) {
        const rgbColor = new tinycolor(colorCode).toRgb();
        color = stringFormat(CORE.STANDARD_CLASS_COLOR_FORMATE, rgbColor.r, rgbColor.g, rgbColor.b);
      }
      $mdColorPicker.show({
        value: color,
        genericPalette: true,
        $event: $event,
        mdColorHistory: false,
        mdColorAlphaChannel: false,
        mdColorSliders: false,
        mdColorGenericPalette: false,
        mdColorMaterialPalette: false

      }).then((color) => {
        vm.partStatusModel.colorCode = color;
        vm.AddPartStatusForm.$$controls[0].$setDirty();
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    // Function call on part status blue event and check code exist or not
    vm.checkDuplicateName = (buttonCategory) => {
      vm.isduplicate = false;
      if (!vm.isMaster) {
        if (vm.autoCompletepartStatus.keyColumnId || vm.autoCompletepartStatus.keyColumnId === 0) {
          const objStatus = _.find(vm.partStatusList, (status) => status.id === vm.autoCompletepartStatus.keyColumnId);
          vm.partStatusModel.name = objStatus.name;
        }
        else {
          vm.partStatusModel.name = vm.autoCompletepartStatus.searchText;
        }
      }
      if (vm.partStatusModel.name && vm.name !== vm.partStatusModel.name) {
        vm.cgBusyLoading = RFQSettingFactory.checkDuplicatePartStatus().save({
          id: (vm.partStatusModel.id || vm.partStatusModel.id === 0) ? vm.partStatusModel.id : null,
          name: vm.partStatusModel.name,
          refTableName: CORE.TABLE_NAME.COMPONENT_PARTSTATUS
        }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicate) {
            vm.isduplicate = true;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY);
            messageContent.message = stringFormat(messageContent.message, vm.partStatusModel.name);
            const uniqueObj = {
              messageContent: messageContent,
              controlName: 'partstatus'
            };
            vm.partStatusModel.name = null;
            if (!vm.isMaster) {
              vm.autoCompletepartStatus.searchText = null;
            }
            displayCodeAliasUniqueMessage(uniqueObj);
          }
          else if (!vm.isMaster) {
            vm.savePartStatus(buttonCategory);
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
      vm.autoCompletepartStatus = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: vm.partStatusModel.id,
        inputName: 'Search Part Status',
        placeholderName: 'Search Part Status or Add',
        isRequired: true,
        isAddnew: false,
        callbackFn: function (obj) {
          const searchObj = {
            id: obj.id
          };
          return getPartStatusSearch(searchObj);
        },
        onSelectCallbackFn: function (item) {
          getPartStatusDetail(item);
        },
        onSearchFn: function (query) {
          const searchObj = {
            searchQuery: query,
            inputName: vm.autoCompletepartStatus.inputName
          };
          return getPartStatusSearch(searchObj);
        }
      };
      $timeout(() => {
        vm.autoCompletepartStatus.searchText = data.Name;
      });
    }
    // get part status list
    function getPartStatusSearch(searchObj) {
      return RFQSettingFactory.getStatusList().query(searchObj).$promise.then((status) => {
        if (status && status.data) {
          vm.partStatusList = status.data;
          const selectedPartStatus = status.data[0];
          if (!vm.autoCompletepartStatus) {
            initAutoComplete();
          } else {
            vm.partStatusModel.name = vm.autoCompletepartStatus.searchText;
          }
          if (searchObj && (searchObj.id || searchObj.id === 0)) {
            $timeout(() => {
              if (vm.autoCompletepartStatus) {
                vm.autoCompletepartStatus.searchText = selectedPartStatus.name;
                $scope.$broadcast(vm.autoCompletepartStatus.inputName, selectedPartStatus);
              }
            });
          }
          return status.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //on select of part status
    function getPartStatusDetail(item) {
      if (item) {
        vm.partStatusModel.id = item.id;
        const promises = [retrivePartStatus(), getComponentGenericAlias()];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          vm.partStatusModel.alias = responses[1];
          _.each(vm.partStatusModel.alias, (item) => {
            if (item.mfgCodeList) {
              item.mfgCodeList = item.mfgCodeList ? item.mfgCodeList.split('#$#') : null;
            }
            if (vm.partStatusModel.name) {
              item.isDefaultAlias = item.alias.toLowerCase() === vm.partStatusModel.name.toLowerCase();
              item.index = item.alias.toLowerCase() === vm.partStatusModel.name.toLowerCase() ? 1 : 2;
            }
          });
        });
      }
      else {
        vm.partStatusModel.id = null;
        vm.partStatusModel.name = null;
        vm.partStatusModel.alias = [];
        getPartStatusList().then(() => {
          vm.partStatusModelCopy = angular.copy(vm.partStatusModel);
        });
      }
    }

    /* set selected alias as default one and set it as part status  */
    vm.setAliasAsDefault = (aliasItem) => {
      if (aliasItem && aliasItem.id) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SET_ALIAS_AS_DEFAULT_NAME);
        messageContent.message = stringFormat(messageContent.message, aliasItem.alias, 'part status');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.partStatusModel.name = aliasItem.alias;
            const defaultAlias = _.find(vm.partStatusModel.alias, (dAlias) => dAlias.isDefaultAlias);
            if (defaultAlias) {
              defaultAlias.isDefaultAlias = false;
              defaultAlias.index = 2;
            }
            aliasItem.isDefaultAlias = true;
            aliasItem.index = 1;
            vm.AddPartStatusForm.$$controls[0].$setDirty();
          }
        }, () => {
          // empty
        });
      }
    };
    //on load submit form
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.AddPartStatusForm);
    });
  }
})();
