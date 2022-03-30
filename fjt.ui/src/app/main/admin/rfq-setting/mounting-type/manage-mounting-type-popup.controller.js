(function () {
  'use strict';
  angular
    .module('app.admin.rfqsetting')
    .controller('ManageMountingTypePopupController', ManageMountingTypePopupController);
  /** @ngInject */
  function ManageMountingTypePopupController($mdDialog, data, CORE, USER, RFQSettingFactory, BaseService, $mdColorPicker, $q, DialogFactory, ComponentFactory, $scope, $timeout) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.taToolbar = CORE.Toolbar;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.EmptyMesssageAliaslist = USER.ADMIN_EMPTYSTATE.MFG;
    vm.tables = CORE.TABLE_NAME.RFQ_MOUNTINGTYPE;
    vm.checkDirty = false;
    vm.searchType = CORE.RFQ_SETTING.MountingType;
    vm.isMaster = data ? data.isMaster : false;
    vm.aliasFieldName = 'mountalias';
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    //vm.checkDirty = false;
    vm.pageInit = (data) => {
      vm.partCategoryModel = {
        id: data ? data.id : null,
        name: data ? data.Name : null,
        description: null,
        isActive: true,
        numberOfPrintForUMID: 1,
        isCountTypeEach: false,
        hasLimitedShelfLife: false,
        refTableName: vm.tables,
        alias: []
      };
      vm.alias = data && data.aliasText ? data.aliasText : null;
    };
    vm.pageInit(data);
    if (!data || (data && !data.id)) {
      getMountingTypeList();
    }
    vm.name = vm.partCategoryModel.name;
    vm.getDetails = (id) => {
      vm.partCategoryModel.id = id;
      const promises = [retriveMountingType(), getComponentGenericAlias()];
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
      getMountingTypeSearch();
    }
    //retrieve mounting type list
    function retriveMountingType() {
      return RFQSettingFactory.retriveMountingType().query({
        id: vm.partCategoryModel.id
      }).$promise.then((response) => {
        if (response && response.data) {
          vm.partCategoryModel.name = response.data.name;
          vm.partCategoryModel.systemGenerated = response.data.systemGenerated;
          vm.partCategoryModel.description = response.data.description;
          vm.partCategoryModel.numberOfPrintForUMID = response.data.numberOfPrintForUMID;
          vm.partCategoryModel.isActive = response.data.isActive ? response.data.isActive : false;
          vm.copyActive = angular.copy(vm.partCategoryModel.isActive);
          vm.partCategoryModel.isCountTypeEach = response.data.isCountTypeEach ? response.data.isCountTypeEach : false;
          vm.partCategoryModel.hasLimitedShelfLife = response.data.hasLimitedShelfLife ? response.data.hasLimitedShelfLife : false;
          let color;
          if (response.data.colorCode) {
            const rgbColor = new tinycolor(response.data.colorCode).toRgb();
            color = stringFormat(CORE.MOUNTING_TYPE_COLOR_FORMATE, rgbColor.r, rgbColor.g, rgbColor.b);
          }
          else {
            color = CORE.DEFAULT_MOUNTING_TYPE_COLOR;
          }
          vm.partCategoryModel.colorCode = color;
          vm.partCategoryModelCopy = _.clone(vm.partCategoryModel);
          vm.checkDirtyObject = {
            oldModelName: vm.partCategoryModelCopy,
            newModelName: vm.partCategoryModel
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
    //function random_bg_color() {
    //    var x = Math.floor(Math.random() * 256);
    //    var y = Math.floor(Math.random() * 256);
    //    var z = Math.floor(Math.random() * 256);
    //    var bgColor = "rgb(" + x + "," + y + "," + z + ")";
    //    return bgColor;
    //}
    /* mountingType color list */
    function getMountingTypeList() {
      return ComponentFactory.getMountingTypeList().query().$promise.then((res) => {
        vm.mountingColorList = res.data;
        let isNewCode = true;
        while (isNewCode) {
          const newCode = random_bg_color();
          if (!_.find(vm.mountingColorList, (item) => item.colorCode === newCode)) {
            vm.partCategoryModel.colorCode = newCode;
            isNewCode = false;
          }
        }
        return res.data;
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //retrieve all alias of functional type
    function getComponentGenericAlias() {
      var data = {
        refId: vm.partCategoryModel.id,
        refTableName: CORE.TABLE_NAME.RFQ_MOUNTINGTYPE
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
        };
      }).catch((error) => BaseService.getErrorLog(error));
    }
    //remove alias
    vm.removeAliasFromList = (item) => {
      const objIndex = vm.partCategoryModel.alias.indexOf(item);
      vm.partCategoryModel.alias.splice(objIndex, 1);
      vm.checkDirty = true;
      vm.AddMountingTypeForm.$$controls[0].$setDirty();
    };
    //add alias for mounting type
    vm.updateAliasList = ($event, alias) => {
      if (vm.AddMountingTypeForm.mountalias.$invalid) {
        return;
      }
      if (!vm.alias || (!vm.isMaster && vm.autoCompletemountingType && !vm.autoCompletemountingType.searchText)) {
        return;
      }
      if (!vm.isMaster) {
        if (vm.autoCompletemountingType.keyColumnId || vm.autoCompletemountingType.keyColumnId === 0) {
          const objMount = _.find(vm.moutingTypeList, (mount) => mount.id === vm.autoCompletemountingType.keyColumnId);
          vm.partCategoryModel.name = objMount.name;
        }
        else {
          vm.partCategoryModel.name = vm.autoCompletemountingType.searchText;
        }
      }
      const aliasObj = _.find(vm.partCategoryModel.alias, (item) => item.alias.toLowerCase() === alias.toLowerCase());
      if (aliasObj) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_TYPE_EXISTS);
        messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, vm.partCategoryModel.name);
        const uniqueObj = {
          messageContent: messageContent,
          isSetAliasNull: true,
          controlName: vm.aliasFieldName
        };
        displayCodeAliasUniqueMessage(uniqueObj);
        vm.AddMountingTypeForm.$setDirty();
      }
      else {
        vm.cgBusyLoading = RFQSettingFactory.checkUniqueMountingTypeAlias().save({
          alias: vm.alias,
          id: vm.partCategoryModel.id,
          refTableName: CORE.TABLE_NAME.RFQ_MOUNTINGTYPE

        }).$promise.then((response) => {
          if (response && response.data && (response.data.mountingAliasExistsInfo || response.data.mountingTypeExistsInfo)) {
            if (response.data.mountingAliasExistsInfo) {
              const aliasobj = _.find(vm.partCategoryModel.alias, (alias) => alias.alias.toLowerCase() === response.data.mountingAliasExistsInfo.alias.toLowerCase());
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
                checkValidateAliasDetails(response.data.mountingAliasExistsInfo);
              }
            }
            else if (response.data.mountingTypeExistsInfo) {
              const aliasobj = _.find(vm.partCategoryModel.alias, (alias) => alias.alias.toLowerCase() === response.data.mountingTypeExistsInfo.name.toLowerCase());
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
                messageContent.message = stringFormat(messageContent, vm.alias, vm.searchType, response.data.mountingTypeExistsInfo.name);
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
              vm.partCategoryModel.alias.unshift({
                alias: vm.alias,
                createdAt: new Date(),
                fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
              });
            }
            vm.alias = null;
            setFocusByName(vm.aliasFieldName);
          }
          vm.isupdated = true;
          vm.AddMountingTypeForm.$setDirty();
        });
      }
    };
    function checkValidateAliasDetails(mountingTypeealias) {
      if (mountingTypeealias) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
        messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, mountingTypeealias.mountingTypeName);
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
    vm.savePartCategory = (buttonCategory) => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.AddMountingTypeForm)) {
        vm.saveBtnDisableFlag = false;
        if (vm.partCategoryModel.id && !vm.checkFormDirty(vm.AddMountingTypeForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          $mdDialog.hide(vm.data);
        }
        return;
      }
      if (!vm.isMaster) {
        if (vm.autoCompletemountingType.keyColumnId || vm.autoCompletemountingType.keyColumnId === 0) {
          const objMount = _.find(vm.moutingTypeList, (mount) => mount.id === vm.autoCompletemountingType.keyColumnId);
          if (objMount) {
            vm.partCategoryModel.name = vm.partCategoryModel.name ? vm.partCategoryModel.name : objMount.name;
          }
        }
        else {
          vm.partCategoryModel.name = vm.autoCompletemountingType.searchText;
        }
      }
      if (vm.AddMountingTypeForm.$invalid || !vm.partCategoryModel.name) {
        BaseService.focusRequiredField(vm.AddMountingTypeForm);
        vm.saveBtnDisableFlag = false;
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
            savePartCategory(buttonCategory);
          }
        }, () => {
          vm.saveBtnDisableFlag = false;
        });
      }
      else {
        savePartCategory(buttonCategory);
      }
    };
    function savePartCategory(buttonCategory) {
      vm.isupdated = false;
      vm.cgBusyLoading = RFQSettingFactory.mountingType().save(vm.partCategoryModel).$promise.then((res) => {
        vm.saveBtnDisableFlag = false;
        if (res.data) {
          if ((res.data.id || res.data.id === 0) && !vm.isduplicate) {
            if (vm.partCategoryModel.alias) {
              res.data.alias = vm.partCategoryModel.alias;
              vm.saveAndProceed(buttonCategory, res.data);
            }
          }
        }
      }).catch((error) => {
        vm.saveBtnDisableFlag = false;
        return BaseService.getErrorLog(error);
      });
    };

    // save functionality managed by button category
    vm.saveAndProceed = (buttonCategory, data) => {
      if (data) {
        vm.data = data;
      }
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.AddMountingTypeForm.$setPristine();
        vm.pageInit(data);
        vm.getDetails(data.id);
        vm.checkDirty = false;
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.checkFormDirty(vm.AddMountingTypeForm);
        if (isdirty) {
          const data = {
            form: vm.AddMountingTypeForm
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
              vm.AddMountingTypeForm.$setPristine();
              getMountingTypeList().then(() => {
                vm.partCategoryModelCopy = angular.copy(vm.partCategoryModel);
              });
              if (vm.autoCompletemountingType) {
                vm.autoCompletemountingType.searchText = null;
              }
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.pageInit();
          vm.AddMountingTypeForm.$setPristine();
          getMountingTypeList().then(() => {
            vm.partCategoryModelCopy = angular.copy(vm.partCategoryModel);
          });
          if (vm.autoCompletemountingType) {
            vm.autoCompletemountingType.searchText = null;
          }
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.hide(vm.data);
      }
      setFocusByName('mountingtype');
    };

    //update details
    vm.selectedPart = (data) => {
      $timeout(() => {
        if (!vm.isMaster) {
          vm.partCategoryModel.id = data.id;
          vm.autoCompletemountingType.keyColumnId = vm.partCategoryModel.id;
          let color;
          if (data.colorCode) {
            const rgbColor = new tinycolor(data.colorCode).toRgb();
            color = stringFormat(CORE.MOUNTING_TYPE_COLOR_FORMATE, rgbColor.r, rgbColor.g, rgbColor.b);
          }
          else {
            color = CORE.DEFAULT_MOUNTING_TYPE_COLOR;
          }
          vm.partCategoryModel.colorCode = color;
          vm.partCategoryModel.description = data.description;
          vm.partCategoryModel.isCountTypeEach = data.isCountTypeEach ? true : false;
          vm.partCategoryModel.hasLimitedShelfLife = data.hasLimitedShelfLife ? true : false;
          vm.partCategoryModel.isActive = data.isActive ? true : false;
          vm.partCategoryModel.systemGenerated = data.systemGenerated ? true : false;
          getMountingTypeSearch({ id: vm.partCategoryModel.id });
        }
        else {
          vm.partCategoryModel.id = data.id;
          //vm.autoCompletemountingType.keyColumnId = data.id;
          const promises = [retriveMountingType(), getComponentGenericAlias()];
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
            vm.partCategoryModel.alias = responses[1];
            _.each(vm.partCategoryModel.alias, (item) => {
              item.isDefaultAlias = item.alias.toLowerCase() === vm.partCategoryModel.name.toLowerCase();
              item.index = item.alias.toLowerCase() === vm.partCategoryModel.name.toLowerCase() ? 1 : 2;
            });
            //
          });
        }
      }, true);
    };
    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.AddMountingTypeForm);
      if (isdirty || vm.checkDirty) {
        const data = {
          form: vm.AddMountingTypeForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.hide(true);
      }
    };

    vm.checkFormDirty = (form) => {
      let checkDirty = BaseService.checkFormDirty(form, vm.checkDirtyObject);
      if (!checkDirty && (vm.partCategoryModelCopy && vm.partCategoryModel && (vm.partCategoryModelCopy.colorCode !== vm.partCategoryModel.colorCode) || (vm.isupdated))) {
        checkDirty = true;
      }
      return !vm.checkDirty ? checkDirty : vm.checkDirty;
    };
    //select color code for mounting type
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
        vm.partCategoryModel.colorCode = color;
        vm.AddMountingTypeForm.$$controls[0].$setDirty();
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    // Function call on mounting type blue event and check code exist or not
    vm.checkDuplicateName = (buttonCategory) => {
      vm.isduplicate = false;
      if (!vm.isMaster) {
        if (vm.autoCompletemountingType.keyColumnId || vm.autoCompletemountingType.keyColumnId === 0) {
          const objMount = _.find(vm.moutingTypeList, (mount) => mount.id === vm.autoCompletemountingType.keyColumnId);
          vm.partCategoryModel.name = objMount.name;
        }
        else {
          vm.partCategoryModel.name = vm.autoCompletemountingType.searchText;
        }
      }
      if (vm.partCategoryModel.name && vm.name !== vm.partCategoryModel.name) {
        vm.cgBusyLoading = RFQSettingFactory.checkDuplicateMountingType().save({
          id: (vm.partCategoryModel.id || vm.partCategoryModel.id === 0) ? vm.partCategoryModel.id : null,
          name: vm.partCategoryModel.name,
          refTableName: CORE.TABLE_NAME.RFQ_MOUNTINGTYPE
        }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicate) {
            vm.isduplicate = true;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY);
            messageContent.message = stringFormat(messageContent.message, vm.partCategoryModel.name);
            const uniqueObj = {
              messageContent: messageContent,
              controlName: 'mountingtype'
            };
            vm.partCategoryModel.name = null;
            if (!vm.isMaster) {
              vm.autoCompletemountingType.searchText = null;
            }
            displayCodeAliasUniqueMessage(uniqueObj);
          }
          else if (!vm.isMaster) {
            vm.savePartCategory(buttonCategory);
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
      vm.autoCompletemountingType = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: vm.partCategoryModel.id,
        inputName: 'Search Mounting Type',
        placeholderName: 'Search Mounting or Add',
        isRequired: true,
        isAddnew: false,
        callbackFn: function (obj) {
          const searchObj = {
            id: obj.id
          };
          return getMountingTypeSearch(searchObj);
        },
        onSelectCallbackFn: function (item) {
          getMountingTypeDetail(item);
        },
        onSearchFn: function (query) {
          const searchObj = {
            searchQuery: query,
            inputName: vm.autoCompletemountingType.inputName
          };
          return getMountingTypeSearch(searchObj);
        }
      };
      if (data.Name) {
        $timeout(() => {
          vm.autoCompletemountingType.searchText = data.Name;
        });
      }
    }
    // get mounting type list
    function getMountingTypeSearch(searchObj) {
      return RFQSettingFactory.getMountingList().query(searchObj).$promise.then((mounting) => {
        if (mounting && mounting.data) {
          vm.moutingTypeList = mounting.data;
          const selectedMountingType = mounting.data[0];
          if (!vm.autoCompletemountingType) {
            initAutoComplete();
          } else {
            vm.partCategoryModel.name = vm.autoCompletemountingType.searchText;
          }
          if (searchObj && (searchObj.id || searchObj.id === 0)) {
            $timeout(() => {
              if (vm.autoCompletemountingType) {
                vm.autoCompletemountingType.searchText = selectedMountingType.name;
                $scope.$broadcast(vm.autoCompletemountingType.inputName, selectedMountingType);
              }
            });
          }
          return mounting.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //on select of mounting type
    function getMountingTypeDetail(item) {
      if (item) {
        vm.partCategoryModel.id = item.id;
        const promises = [retriveMountingType(), getComponentGenericAlias()];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          vm.partCategoryModel.alias = responses[1];
          _.each(vm.partCategoryModel.alias, (item) => {
            if (item.mfgCodeList) {
              item.mfgCodeList = item.mfgCodeList ? item.mfgCodeList.split('#$#') : null;
            }
            if (vm.partCategoryModel.name) {
              item.isDefaultAlias = item.alias.toLowerCase() === vm.partCategoryModel.name.toLowerCase();
            }
          });
        });
      }
      else {
        vm.partCategoryModel.id = null;
        vm.partCategoryModel.name = null;
        vm.partCategoryModel.alias = [];
        getMountingTypeList().then(() => {
          vm.partCategoryModelCopy = angular.copy(vm.partCategoryModel);
        });
      }
    }

    /* set selected alias as default one and set it as mounting type */
    vm.setAliasAsDefault = (aliasItem) => {
      if (aliasItem && aliasItem.id) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SET_ALIAS_AS_DEFAULT_NAME);
        messageContent.message = stringFormat(messageContent.message, aliasItem.alias, 'mounting type');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.partCategoryModel.name = aliasItem.alias;
            const defaultAlias = _.find(vm.partCategoryModel.alias, (dAlias) => dAlias.isDefaultAlias);
            if (defaultAlias) {
              defaultAlias.isDefaultAlias = false;
              defaultAlias.index = 2;
            }
            aliasItem.isDefaultAlias = true;
            aliasItem.index = 1;
            vm.AddMountingTypeForm.$$controls[0].$setDirty();
          }
        }, () => {
          // empty
        });
      }
    };

    //on load submit form
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.AddMountingTypeForm);
    });
  }
})();
