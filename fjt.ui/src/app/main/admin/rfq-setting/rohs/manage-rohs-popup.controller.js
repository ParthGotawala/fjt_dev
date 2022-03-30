(function () {
  'use strict';
  angular
    .module('app.admin.rfqsetting')
    .controller('ManageRoHSPopupController', ManageRoHSPopupController);
  /** @ngInject */
  function ManageRoHSPopupController($mdDialog, data, CORE, USER, RFQSettingFactory, BaseService, $q, DialogFactory, ComponentFactory, $scope, $timeout) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.taToolbar = CORE.Toolbar;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.EmptyMesssageAliaslist = USER.ADMIN_EMPTYSTATE.MFG;
    vm.tables = CORE.TABLE_NAME.RFQ_ROHS;
    vm.checkDirty = false;
    vm.searchType = CORE.RFQ_SETTING.RoHS;
    vm.isMaster = data ? data.isMaster : false;
    vm.checkDirty = false;
    vm.aliasFieldName = 'mountalias';
    vm.DeletedRoHSPeerList = [];
    let oldRoHSPeerData = [];
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.pageInit = (data) => {
      vm.rohsModel = {
        id: data ? data.id : null,
        name: data ? data.Name : null,
        description: null,
        isActive: true,
        isCountTypeEach: false,
        refTableName: vm.tables,
        refMainCategoryID: -1,
        alias: []
      };
      vm.alias = data && data.aliasText ? data.aliasText : null;
    };
    vm.pageInit(data);

    vm.name = vm.rohsModel.name;
    vm.getDetails = (data) => {
      vm.rohsModel.id = data.id;
      vm.rohsModel.refMainCategoryID = data.refMainCategoryID;
      const promises = [retriveRohsList(), getComponentGenericAlias(), getRoHSCategory(), retriveParentRoHSList(), getRoHSPeersList()];
      vm.cgBusyLoading = $q.all(promises).then((responses) => {
        vm.rohsModel.alias = responses[1];
        initParentRoHSAutoComplete();
      });
    };
    if (data && (data.id || data.id === 0)) {
      vm.getDetails(data);
    }
    else {
      getRoHSCategory();
      initParentRoHSAutoComplete();
    }
    if (!vm.isMaster) {
      const promises = [getRoHSSearch(), getRoHSCategory(), retriveParentRoHSList()];
      if (vm.rohsModel.id) {
        getRoHSPeersList();
      }
      vm.cgBusyLoading = $q.all(promises).then(() => {
        initParentRoHSAutoComplete();
      });
    }

    //retrieve RoHS Peer list
    function getRoHSPeersList() {
      return RFQSettingFactory.getRoHSPeer().query({ id: vm.rohsModel.id }).$promise.then((response) => {
        if (response && response.data) {
          vm.RoHSPeersList = oldRoHSPeerData = angular.copy(response.data);
          return $q.resolve(vm.RoHSPeersList);
        }
        return response.data;
      }).catch((error) => BaseService.getErrorLog(error));
    }
    if (vm.rohsModel.id) {
      getRoHSPeersList();
    }
    //retrieve RoHS list for parent RoHS
    function retriveParentRoHSList() {
      return RFQSettingFactory.retrieveParentRoHS().query({ id: vm.rohsModel.id }).$promise.then((response) => {
        if (response && response.data) {
          vm.RoHSListForParent = _.filter(response.data, (x) => x.refMainCategoryID === vm.rohsModel.refMainCategoryID);
        }
        if (!vm.rohsModel.id) {
          initParentRoHSAutoComplete();
        }
        return response;
      }).catch((error) => BaseService.getErrorLog(error));
    }
    retriveParentRoHSList();
    //retrieve RoHS list
    function retriveRohsList() {
      return RFQSettingFactory.retriveRohs().query({
        id: vm.rohsModel.id
      }).$promise.then((response) => {
        if (response && response.data) {
          vm.rohsModel.name = response.data.name;
          vm.rohsModel.systemGenerated = response.data.systemGenerated;
          vm.rohsModel.refMainCategoryID = response.data.refMainCategoryID;
          vm.rohsModel.description = response.data.description;
          vm.rohsModel.refParentID = response.data.refParentID;
          vm.rohsModel.isActive = response.data.isActive ? response.data.isActive : false;
          vm.rohsModel.isCountTypeEach = response.data.isCountTypeEach ? response.data.isCountTypeEach : false;
          vm.copyActive = angular.copy(vm.rohsModel.isActive);
          vm.rohsModelCopy = _.clone(vm.rohsModel);
          vm.checkDirtyObject = {
            oldModelName: vm.rohsModelCopy,
            newModelName: vm.rohsModel
          };
        }
        return response;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //retrieve all alias of functional type
    function getComponentGenericAlias() {
      var data = {
        refId: vm.rohsModel.id,
        refTableName: CORE.TABLE_NAME.RFQ_ROHS
      };
      return ComponentFactory.getComponentGenericAlias().query(data).$promise.then((res) => {
        if (res && res.data) {
          vm.rohsModel.alias = _.clone(res.data);
          _.each(vm.rohsModel.alias, (item) => {
            if (item.mfgCodeList) {
              item.mfgCodeList = item.mfgCodeList ? item.mfgCodeList.split('#$#') : null;
            }
            if (vm.rohsModel.name) {
              item.isDefaultAlias = item.alias.toLowerCase() === vm.rohsModel.name.toLowerCase();
              item.index = item.alias.toLowerCase() === vm.rohsModel.name.toLowerCase() ? 1 : 2;
            }
          });
          return res.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    //remove alias
    vm.removeAliasFromList = (item) => {
      const objIndex = vm.rohsModel.alias.indexOf(item);
      vm.rohsModel.alias.splice(objIndex, 1);
      vm.checkDirty = true;
      vm.AddRoHSForm.$$controls[0].$setDirty();
    };
    //add alias for RoHS
    vm.updateAliasList = ($event, alias) => {
      if (vm.AddRoHSForm.mountalias.$invalid) {
        return;
      }
      if (!vm.alias || (!vm.isMaster && vm.autoCompleteRoHS && !vm.autoCompleteRoHS.searchText)) {
        return;
      }
      if (!vm.isMaster) {
        if (vm.autoCompleteRoHS.keyColumnId || vm.autoCompleteRoHS.keyColumnId === 0) {
          const objRoHS = _.find(vm.rohsList, (rohs) => rohs.id === vm.autoCompleteRoHS.keyColumnId);
          vm.rohsModel.name = objRoHS.name;
        }
        else {
          vm.rohsModel.name = vm.autoCompleteRoHS.searchText;
        }
      }
      const aliasObj = _.find(vm.rohsModel.alias, (item) => item.alias.toLowerCase() === alias.toLowerCase());
      if (aliasObj) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_TYPE_EXISTS);
        messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, vm.rohsModel.name);
        const uniqueObj = {
          messageContent: messageContent,
          isSetAliasNull: true,
          controlName: vm.aliasFieldName
        };
        displayCodeAliasUniqueMessage(uniqueObj);
        vm.AddRoHSForm.$setDirty();
      }
      else {
        vm.cgBusyLoading = RFQSettingFactory.checkUniqueRoHSAlias().save({
          alias: vm.alias,
          id: vm.rohsModel.id,
          refTableName: CORE.TABLE_NAME.RFQ_ROHS

        }).$promise.then((response) => {
          if (response && response.data && (response.data.rohsAliasExistsInfo || response.data.rohsDetAliasExistsInfo)) {
            if (response.data.rohsAliasExistsInfo) {
              const aliasobj = _.find(vm.rohsModel.alias, (alias) => alias.alias.toLowerCase() === response.data.rohsAliasExistsInfo.alias.toLowerCase());
              if (aliasobj) {
                if (vm.alias) {
                  vm.rohsModel.alias.unshift({
                    id: aliasobj.id,
                    alias: vm.alias,
                    createdAt: new Date(),
                    fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                  });
                }
                vm.alias = null;
              } else {
                checkValidateAliasDetails(response.data.rohsAliasExistsInfo);
              }
            }
            else if (response.data.rohsDetAliasExistsInfo) {
              const aliasobj = _.find(vm.rohsModel.alias, (alias) => alias.alias.toLowerCase() === response.data.rohsDetAliasExistsInfo.name.toLowerCase());
              if (aliasobj) {
                if (vm.alias) {
                  vm.rohsModel.alias.unshift({
                    id: aliasobj.id,
                    alias: vm.alias,
                    createdAt: new Date(),
                    fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                  });
                }
                vm.alias = null;
              } else {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_TYPE_EXISTS);
                messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, response.data.rohsDetAliasExistsInfo.name);
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
              vm.rohsModel.alias.unshift({
                alias: vm.alias,
                createdAt: new Date(),
                fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
              });
            }
            vm.alias = null;
            setFocusByName(vm.aliasFieldName);
          }
          vm.isupdated = true;
          vm.AddRoHSForm.$setDirty();
        });
      }
    };
    function checkValidateAliasDetails(rohsalias) {
      if (rohsalias) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
        messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, rohsalias.roHSName);
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
    vm.saveRoHS = (buttonCategory) => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.AddRoHSForm)) {
        vm.saveBtnDisableFlag = false;
        if (vm.rohsModel.id && !vm.checkFormDirty(vm.AddRoHSForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          $mdDialog.hide(vm.data);
        }
        return;
      }
      if (vm.rohsModel.id && vm.copyActive !== vm.rohsModel.isActive) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.STATUS_CHANGE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.copyActive ? 'Enable' : 'Disable', vm.rohsModel.isActive ? 'Enable' : 'Disable');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            confirmAliasAdd(buttonCategory);
          }
          vm.saveBtnDisableFlag = false;
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
            saveRoHS(buttonCategory);
          }
          vm.saveBtnDisableFlag = false;
        }, () => {
          vm.saveBtnDisableFlag = false;
        });
      }
      else {
        saveRoHS(buttonCategory);
      }
    };
    function saveRoHS(buttonCategory) {
      vm.isupdated = false;
      if (!vm.isMaster) {
        if (vm.autoCompleteRoHS.keyColumnId || vm.autoCompleteRoHS.keyColumnId === 0) {
          const objRoHS = _.find(vm.rohsList, (rohs) => rohs.id === vm.autoCompleteRoHS.keyColumnId);
          if (objRoHS) {
            vm.rohsModel.name = vm.rohsModel.name ? vm.rohsModel.name : objRoHS.name;
          }
        }
        else {
          vm.rohsModel.name = vm.autoCompleteRoHS.searchText;
        }
      }
      if (vm.AddRoHSForm.$invalid || !vm.rohsModel.name) {// || (vm.rohsModel.id && !vm.checkFormDirty(vm.AddRoHSForm))
        vm.saveBtnDisableFlag = false;
        BaseService.focusRequiredField(vm.AddRoHSForm);
        return;
      }
      vm.rohsModel.refParentID = vm.autoCompleteParentRoHS.keyColumnId;
      vm.rohsModel.newRoHSPeer = (vm.RoHSPeersList && vm.RoHSPeersList.length > 0) ? vm.RoHSPeersList : [];
      _.each(oldRoHSPeerData, (item) => {
        const rohsPeer = _.find(vm.RoHSPeersList, (x) => x.rohsPeerID === item.rohsPeerID);
        if (!rohsPeer) {
          vm.DeletedRoHSPeerList.push(item.rohsPeerID);
        }
      });
      vm.rohsModel.deletedRoHSPeer = (vm.DeletedRoHSPeerList && vm.DeletedRoHSPeerList.length > 0) ? vm.DeletedRoHSPeerList : [];
      const alias = _.find(vm.rohsModel.alias, (als) => als.alias.toLowerCase() === vm.rohsModel.name.toLowerCase());
      if (!alias) {
        const newalias = {
          alias: vm.rohsModel.name,
          createdAt: new Date(),
          fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
        };
        vm.rohsModel.alias.push(newalias);
      }
      $timeout(() => {
        vm.cgBusyLoading = RFQSettingFactory.rohs().save(vm.rohsModel).$promise.then((res) => {
          vm.saveBtnDisableFlag = false;
          if (res.data) {
            if (res.data.id && !vm.isduplicate) {
              BaseService.currentPagePopupForm = [];
              if (vm.rohsModel.alias) {
                res.data.alias = vm.rohsModel.alias;
                vm.saveAndProceed(buttonCategory, res.data);
              }
            }
          }
          if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.rohsModel) {
            if (!vm.rohsModel.id) {
              vm.rohsModel.id = res.errors.data.rohsModel.id;
              vm.copyActive = res.errors.data.rohsModel.isActive;
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
        vm.AddRoHSForm.$setPristine();
        vm.pageInit(data);
        vm.getDetails(data);
        vm.checkDirty = false;
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.checkFormDirty(vm.AddRoHSForm);
        if (isdirty) {
          const data = {
            form: vm.AddRoHSForm
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
              vm.AddRoHSForm.$setPristine();
              getRoHSCategory().then(() => {
                vm.rohsModelCopy = angular.copy(vm.rohsModel);
              });
              if (vm.autoCompleteRoHS) {
                vm.autoCompleteRoHS.searchText = null;
              }
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.pageInit();
          vm.AddRoHSForm.$setPristine();
          getRoHSCategory().then(() => {
            vm.rohsModelCopy = angular.copy(vm.rohsModel);
          });
          if (vm.autoCompleteRoHS) {
            vm.autoCompleteRoHS.searchText = null;
          }
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.hide(vm.data);
      }
      setFocusByName('rohs');
    };

    //update details
    vm.selectedPart = (data) => {
      $timeout(() => {
        if (!vm.isMaster) {
          vm.rohsModel.id = data.id;
          vm.rohsModel.refMainCategoryID = data.refMainCategoryID;
          vm.rohsModel.description = data.description;
          vm.rohsModel.isActive = data.isActive;
          vm.rohsModel.systemGenerated = data.systemGenerated;
          vm.autoCompleteRoHS.keyColumnId = vm.rohsModel.id;
          getRoHSSearch({ id: vm.rohsModel.id });
        }
        else {
          vm.rohsModel.id = data.id;
          vm.rohsModel.refMainCategoryID = data.refMainCategoryID;
          const promises = [retriveRohsList(), getComponentGenericAlias(), getRoHSCategory(), retriveParentRoHSList()];
          if (vm.rohsModel.id) {
            promises.push(getRoHSPeersList());
          }
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
            vm.rohsModel.alias = responses[1];
            _.each(vm.rohsModel.alias, (item) => {
              item.isDefaultAlias = item.alias.toLowerCase() === vm.rohsModel.name.toLowerCase();
              item.index = item.alias.toLowerCase() === vm.rohsModel.name.toLowerCase() ? 1 : 2;
            });
            initParentRoHSAutoComplete();
          });
        }
      }, true);
    };
    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.AddRoHSForm);
      if (isdirty || vm.checkDirty) {
        const data = {
          form: vm.AddRoHSForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel(true);
      }
    };

    vm.checkFormDirty = (form) => {
      let checkDirty = BaseService.checkFormDirty(form, vm.checkDirtyObject);
      if (!checkDirty && vm.isupdated) {
        checkDirty = true;
      }
      return !vm.checkDirty ? checkDirty : vm.checkDirty;
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    // Function call on RoHS blue event and check code exist or not
    vm.checkDuplicateName = (buttonCategory) => {
      vm.isduplicate = false;
      if (!vm.isMaster) {
        if (vm.autoCompleteRoHS.keyColumnId || vm.autoCompleteRoHS.keyColumnId === 0) {
          const objRoHS = _.find(vm.rohsList, (rohs) => rohs.id === vm.autoCompleteRoHS.keyColumnId);
          vm.rohsModel.name = objRoHS.name;
        }
        else {
          vm.rohsModel.name = vm.autoCompleteRoHS.searchText;
        }
      }
      if (vm.rohsModel.name && vm.name !== vm.rohsModel.name) {
        vm.cgBusyLoading = RFQSettingFactory.checkDuplicateRoHS().save({
          id: (vm.rohsModel.id || vm.rohsModel.id === 0) ? vm.rohsModel.id : null,
          name: vm.rohsModel.name,
          refTableName: CORE.TABLE_NAME.RFQ_ROHS
        }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicate) {
            vm.isduplicate = true;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY);
            messageContent.message = stringFormat(messageContent.message, vm.rohsModel.name);
            const uniqueObj = {
              messageContent: messageContent,
              controlName: 'rohs'
            };
            vm.rohsModel.name = null;
            if (!vm.isMaster) {
              vm.autoCompleteRoHS.searchText = null;
            }
            displayCodeAliasUniqueMessage(uniqueObj);
          }
          else if (!vm.isMaster) {
            vm.saveRoHS(buttonCategory);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* mfg code unique message */
    const displayCodeAliasUniqueMessage = (uniqueObj) => {
      const obj = {
        //title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
        //textContent: uniqueObj.textContent,
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
      vm.autoCompleteRoHS = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: vm.rohsModel.id,
        inputName: 'Search RoHS',
        placeholderName: 'Search RoHS or Add',
        isRequired: true,
        isAddnew: false,
        mdRequiredMatch: false,
        callbackFn: function (obj) {
          const searchObj = {
            id: obj.id
          };
          return getRoHSSearch(searchObj);
        },
        onSelectCallbackFn: function (item) {
          getRoHSDetail(item);
        },
        onSearchFn: function (query) {
          const searchObj = {
            searchQuery: query,
            inputName: vm.autoCompleteRoHS.inputName
          };
          return getRoHSSearch(searchObj);
        }
      };
      if (data.Name) {
        $timeout(() => {
          vm.autoCompleteRoHS.searchText = data.Name;
        });
      }
    }

    function initParentRoHSAutoComplete() {
      vm.autoCompleteParentRoHS = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: vm.rohsModel.refParentID ? vm.rohsModel.refParentID : null,
        inputName: 'Parent RoHS',
        placeholderName: 'Parent RoHS',
        isRequired: false,
        isAddnew: false,
        callbackFn: retriveParentRoHSList
      };
    }
    // get RoHS list
    function getRoHSSearch(searchObj) {
      return RFQSettingFactory.getRoHSList().query(searchObj).$promise.then((rohs) => {
        if (rohs && rohs.data) {
          vm.rohsList = rohs.data;
          const selectedRoHS = rohs.data[0];
          if (!vm.autoCompleteRoHS) {
            initAutoComplete();
          } else {
            vm.rohsModel.name = vm.autoCompleteRoHS.searchText;
          }
          if (searchObj && (searchObj.id || searchObj.id === 0)) {
            $timeout(() => {
              if (vm.autoCompleteRoHS) {
                vm.autoCompleteRoHS.searchText = selectedRoHS.name;
                $scope.$broadcast(vm.autoCompleteRoHS.inputName, selectedRoHS);
              }
            });
          }
          return rohs.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    // get RoHS Category list
    function getRoHSCategory() {
      return RFQSettingFactory.getRohsCategoryList().query().$promise.then((rohsCategory) => {
        if (rohsCategory && rohsCategory.data) {
          vm.rohsCategoryList = rohsCategory.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //on select of RoHS
    function getRoHSDetail(item) {
      if (item) {
        vm.rohsModel.id = item.id;
        vm.rohsModel.refMainCategoryID = item.refMainCategoryID;
        const promises = [retriveRohsList(), getComponentGenericAlias()];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          vm.rohsModel.alias = responses[1];
          _.each(vm.rohsModel.alias, (item) => {
            if (item.mfgCodeList) {
              item.mfgCodeList = item.mfgCodeList ? item.mfgCodeList.split('#$#') : null;
            }
            if (vm.rohsModel.name) {
              item.isDefaultAlias = item.alias.toLowerCase() === vm.rohsModel.name.toLowerCase();
              item.index = item.alias.toLowerCase() === vm.rohsModel.name.toLowerCase() ? 1 : 2;
            }
          });
        });
      }
      else {
        vm.rohsModel.name = null;
        vm.rohsModel.id = null;
        vm.rohsModel.alias = [];
        getRoHSCategory().then(() => {
          vm.rohsModelCopy = angular.copy(vm.rohsModel);
        });
      }
    }
    /* set selected alias as default one and set it as rohs type */
    vm.setAliasAsDefault = (aliasItem) => {
      if (aliasItem && aliasItem.id) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SET_ALIAS_AS_DEFAULT_NAME);
        messageContent.message = stringFormat(messageContent.message, aliasItem.alias, 'RoHS');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.rohsModel.name = aliasItem.alias;
            const defaultAlias = _.find(vm.rohsModel.alias, (dAlias) => dAlias.isDefaultAlias);
            if (defaultAlias) {
              defaultAlias.isDefaultAlias = false;
              defaultAlias.index = 2;
            }
            aliasItem.isDefaultAlias = true;
            aliasItem.index = 1;
            vm.AddRoHSForm.$$controls[0].$setDirty();
          }
        }, () => {
          // empty
        });
      }
    };
    vm.RohsCategoryChange = () => {
      retriveParentRoHSList();
    };
    // Manage RoHS Peer Detail
    vm.ManageRoHSPeers = (ev) => {
      var objdata = {
        id: vm.rohsModel.id,
        name: vm.rohsModel.name,
        category: vm.rohsModel.refMainCategoryID,
        rohsPeerList: vm.RoHSPeersList
      };
      DialogFactory.dialogService(
        CORE.MANAGE_ROHS_PEER_MODAL_CONTROLLER,
        CORE.MANAGE_ROHS_PEER_MODAL_VIEW,
        ev,
        objdata).then((data) => {
          vm.RoHSPeersList = data.newRoHSPeer;
          vm.checkDirty = true;
          vm.AddRoHSForm.$setDirty();
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    //on load submit form
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.AddRoHSForm];
    });
  }
})();
