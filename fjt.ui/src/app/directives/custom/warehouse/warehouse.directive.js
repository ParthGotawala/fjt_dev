(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('warehouse', warehouse);

  /** @ngInject */
  function warehouse(BaseService, $rootScope, $mdDialog, $timeout, CORE, USER, TRANSACTION, WarehouseBinFactory, DialogFactory, BinFactory, $q, EquipmentFactory) {
    const directive = {
      restrict: 'E',
      replace: false,
      scope: {
        warehouseData: '=?',
        cancelDialog: '=?'
      },
      templateUrl: 'app/directives/custom/warehouse/warehouse.html',
      controller: warehouseCtrl,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for view data of alternative details
    *
    * @param
    */
    function warehouseCtrl($scope) {
      const vm = this;
      vm.cartType = TRANSACTION.warehouseType;
      vm.binPrefixMethod = TRANSACTION.binPrefixMethod;
      vm.saveBtnDisableFlag = false;
      vm.transaction = TRANSACTION;
      /* Used to disable the equipment autocomplete */
      vm.isFromEquipmentMasterPage = $scope.warehouseData.isFromEquipmentMasterPage ? $scope.warehouseData.isFromEquipmentMasterPage : null;
      //copy part number on click
      const warehouseTemplate = {
        id: null,
        Name: null,
        Description: null,
        isPermanentWH: null,
        isActive: true,
        nickname: null,
        allMovableBin: false,
        uniqueCartID: null,
        userAccessMode: 'S',
        isBinPrifix: true
      };

      /* Used to clear warehouse */
      vm.clearWarehouse = () => {
        vm.data = Object.assign({}, warehouseTemplate);
        vm.data.generateWarehouse = $scope.warehouseData.generateWarehouse;
        vm.data.Name = $scope.warehouseData.Name;
      };

      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.data = $scope.warehouseData;
      vm.RadioGroup = {
        isActive: {
          array: CORE.ActiveRadioGroup
        },
        allMovableBin: {
          array: CORE.BooleanRadioGroup
        }
      };
      //vm.isDisableBinMovable = false;
      vm.WarehouseCartManufacturer = CORE.WarehouseCartManufacturer;

      if (vm.data && vm.data.ID) {
        if (vm.data.isPermanentWH === 1) {
          vm.selectPermanentWH = true;
          //vm.isDisableBinMovable = true;
        } else {
          vm.selectPermanentWH = false;
          //vm.isDisableBinMovable = false;
        }
        //vm.data.userAccessMode = vm.data.userAccessMode == TRANSACTION.userAccessMode.Single ? true : false;
        vm.data.cartName = vm.data.Name;
        //vm.data.isEquipment = vm.data.isEquipment == 1 ? true : false;
      } else {
        //vm.data.isEquipment = false;
        $timeout(() => {
          vm.data.warehouseType = vm.cartType.Equipment.key;
          //vm.data.warehouseType = vm.cartType.SmartCart;
        }, true);
        vm.selectPermanentWH = false;
        vm.clearWarehouse();
      }

      /* Check dirty object */
      vm.checkDirtyObject = {
        columnName: [],
        oldModelName: null,
        newModelName: null
      };

      vm.isUpdatable = true;
      vm.showTransfer = true;
      vm.DefaultDateFormat = _dateDisplayFormat;

      if (vm.data === null) {
        vm.data = {
          isPermanentWH: false
        };
      }

      /* Cancel event of popup */
      vm.cancel = () => {
        // Check vm.isChange flag for color picker dirty object
        let isdirty = vm.checkFormDirty(vm.warehouseForm, vm.checkDirtyObject);
        if (vm.isFromEquipmentMasterPage && (vm.autoCompleteEquipment && vm.autoCompleteEquipment.keyColumnId)) {
          vm.warehouseForm.$dirty = true;
          isdirty = true;
        }

        if (isdirty) {
          BaseService.showWithoutSavingAlertForPopUp();
        } else {
          vm.warehouseForm.$setPristine();
          BaseService.currentPagePopupForm = [];
          $mdDialog.cancel();
        }
      };

      /* Check form dirty */
      vm.checkFormDirty = (form, columnName) => {
        const checkDirty = BaseService.checkFormDirty(form, columnName);
        return checkDirty;
      };

      /* Used to save warehouse */
      vm.saveWarehouse = (binFlag) => {
        vm.saveBtnDisableFlag = true;
        if (vm.isFromEquipmentMasterPage && (vm.autoCompleteEquipment && vm.autoCompleteEquipment.keyColumnId)) {
          vm.warehouseForm.$dirty = true;
        }

        if (BaseService.focusRequiredField(vm.warehouseForm)) {
          vm.saveBtnDisableFlag = false;
          return;
        }
        else {
          vm.data.isActive = vm.data.isActive ? vm.data.isActive : false;
          vm.data.isPermanentWH = vm.selectPermanentWH ? vm.selectPermanentWH : false;
          vm.data.parentWHID = vm.autoCompleteWarehouse.keyColumnId;
          //vm.data.userAccessMode = vm.data.userAccessMode ? TRANSACTION.userAccessMode.Single : TRANSACTION.userAccessMode.Multiple;
          vm.data.binPrifix = vm.data.binPrifix ? vm.data.binPrifix.toUpperCase() : '';
          vm.data.prefix = vm.data.binPrifix ? vm.data.binPrifix.toUpperCase() : '';
          vm.data.refEqpID = vm.autoCompleteEquipment && vm.autoCompleteEquipment.keyColumnId ? vm.autoCompleteEquipment.keyColumnId : null;
          vm.data.nickname = vm.autoCompleteNickName && vm.autoCompleteNickName.keyColumnId ? vm.autoCompleteNickName.keyColumnId.toUpperCase() : vm.data.txtnickname ? vm.data.txtnickname.toUpperCase() : null;
          if (vm.data.warehouseType === vm.cartType.Equipment.key) {
            vm.data.Name = vm.data.Name ? vm.data.Name : vm.data.cartName;
          } else {
            vm.data.Name = vm.data.cartName;
          }

          if (vm.data.Name) {
            vm.cgBusyLoading = WarehouseBinFactory.warehouse().save(vm.data).$promise.then((res) => {
              if (res) {
                vm.saveBtnDisableFlag = false;
                if (res.status === CORE.ApiResponseTypeStatus.FAILED && res.errors) {
                  if (res.errors.data.name) {
                    vm.data.Name = null;
                    if (checkResponseHasCallBackFunctionPromise(res)) {
                      res.alretCallbackFn.then(() => {
                        setFocus('cartname');
                      });
                    }
                  }
                  else if (res.errors.data.domainCart) {
                    vm.data.domain = null;
                    if (checkResponseHasCallBackFunctionPromise(res)) {
                      res.alretCallbackFn.then(() => {
                        setFocus('domain');
                      });
                    }
                  }
                }
                else if (res.data && res.data.ID) {
                  if (binFlag === true) {
                    vm.warehouseForm.$setPristine();
                    BaseService.currentPagePopupForm = [];
                    $scope.cancelDialog(res.data);
                  }
                  else {
                    vm.saveBtnDisableFlag = true;
                    DialogFactory.dialogService(
                      TRANSACTION.TRANSACTION_BIN_ADD_UPDATE_MODAL_CONTROLLER,
                      TRANSACTION.TRANSACTION_BIN_ADD_UPDATE_MODAL_VIEW,
                      null,
                      res.data).then(() => {
                      }, (data) => {
                        if (data) {
                          vm.saveBtnDisableFlag = false;
                          vm.warehouseForm.$setPristine();
                          BaseService.currentPagePopupForm = [];
                          $scope.cancelDialog(res.data);
                          $rootScope.$emit('WarehouseEvent');
                        } else {
                          vm.saveBtnDisableFlag = false;
                          vm.warehouseForm.$setPristine();
                          BaseService.currentPagePopupForm = [];
                          $scope.cancelDialog(res.data);
                          $rootScope.$emit('WarehouseEvent');
                        }
                      }, (err) => {
                        vm.saveBtnDisableFlag = false;
                        return BaseService.getErrorLog(err);
                      });
                  }
                }
              }
            }).catch((error) => {
              vm.saveBtnDisableFlag = false;
              return BaseService.getErrorLog(error);
            });
          } else {
            return;
          }
        }
      };


      /* Max validation */
      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

      const initDeptAutoComplete = () => {
        vm.autoCompleteWarehouse = {
          columnName: 'Name',
          controllerName: TRANSACTION.TRANSACTION_MANAGEWAREHOUSE_CONTROLLER,
          viewTemplateURL: TRANSACTION.TRANSACTION_MANAGEWAREHOUSE_VIEW,
          keyColumnName: 'ID',
          keyColumnId: vm.WarehouseList && vm.WarehouseList.length === 1 ? vm.WarehouseList[0].ID : vm.autoCompleteWarehouse && vm.autoCompleteWarehouse.keyColumnId ? vm.autoCompleteWarehouse.keyColumnId : vm.data && vm.data.parentWHID ? vm.data.parentWHID : null,
          inputName: 'ParentWarehouse',
          placeholderName: 'Department',
          isRequired: true,
          isAddnew: false,
          callbackFn: getWarehouseList
        };
      };

      /* init autocomplete */
      const initAutoComplete = () => {
        vm.autoCompleteNickName = {
          columnName: 'nickName',
          keyColumnName: 'nickName',
          keyColumnId: vm.editNickName ? vm.editNickName : null,
          inputName: 'nickName',
          placeholderName: 'Nickname',
          isRequired: false,
          isAddnew: false,
          callbackFn: getAllNickNameOfAssembly,
          onSelectCallbackFn: (item) => {
            if (item) {
              if (!vm.data.ID) {
                vm.data.txtnickname = null;
                vm.data.cartName = item.nickName;
                vm.data.Name = item.nickName;
              }
            } else {
              if (!vm.data.txtnickname) {
                vm.data.cartName = null;
                vm.data.Name = null;
              }
            };
          }
        };

        vm.autoCompleteEquipment = {
          columnName: 'eqipmentName',
          controllerName: USER.ADMIN_EQUIPMENT_ADD_MODAL_CONTROLLER,
          viewTemplateURL: USER.ADMIN_EQUIPMENT_ADD_MODAL_VIEW,
          keyColumnName: 'eqpID',
          keyColumnId: vm.data && vm.data.refEqpID ? vm.data.refEqpID : null,
          inputName: 'Equipment',
          placeholderName: 'Equipment',
          isDisabled: vm.data.isEquipment ? false : true,
          isRequired: vm.data.isEquipment ? true : false,
          isAddnew: true,
          addData: {
            popupAccessRoutingState: [USER.ADMIN_MANAGEEQUIPMENT_STATE],
            pageNameAccessLabel: CORE.PageName.equipments
          },
          callbackFn: getEquipmentList,
          onSelectCallbackFn: (item) => {
            if (item) {
              vm.data.Name = item.assetName;
              vm.data.cartName = item.assetName;
              vm.data.Name = item.assetName;
              vm.checkNameUnique();
            }
          }
        };
      };

      /* Used to get warehouse list */
      const getWarehouseList = () => {
        vm.WarehouseList = [];
        return BinFactory.getAllWarehouse({ isDepartment: true }).query().$promise.then((whlist) => {
          vm.WarehouseList = whlist.data;
          vm.copyWarehouseList = angular.copy(vm.WarehouseList);
          return $q.resolve(vm.WarehouseList);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* Used to get nickname */
      const getAllNickNameOfAssembly = () => BinFactory.getAllNickNameOfAssembly().query().$promise.then((nickNameList) => {
        vm.NickNameList = nickNameList.data;
        if (vm.data.nickname) {
          const objNickName = _.find(vm.NickNameList, (data) => data.nickName === vm.data.nickname);
          if (objNickName) {
            vm.editNickName = objNickName.nickName;
          } else {
            vm.data.txtnickname = vm.data.nickname;
          }
        }
        return $q.resolve(vm.NickNameList);
      }).catch((error) => BaseService.getErrorLog(error));

      /* Used to get equipment list */
      const getEquipmentList = () => {
        vm.EquipmentList = [];
        return EquipmentFactory.getequipmentlist().query().$promise.then((equipment) => {
          if (vm.data.alreadyAddedEqpIDsInWo && vm.data.alreadyAddedEqpIDsInWo.length > 0) {
            /* in refresh auto complete case - remove already added equipement */
            equipment.data = equipment.data.filter((o1) => !vm.data.alreadyAddedEqpIDsInWo.some((o2) => o1.eqpID === o2));
          }
          _.each(equipment.data, (item) => {
            let eqpMake = '';
            let eqpModel = '';
            let eqpYear = '';
            eqpMake = item.eqpMake ? '(' + item.eqpMake : '-';
            eqpModel = item.eqpModel ? '|' + item.eqpModel : '-';
            eqpYear = item.eqpYear ? '|' + item.eqpYear + ')' : '-';
            item.eqipmentName = item.assetName + ' ' + eqpMake + eqpModel + eqpYear;
          });
          vm.EquipmentList = equipment.data;
          //let objEquipment = _.find(vm.EquipmentList, (data) => { return data.assetName == vm.data.Name });
          //if (objEquipment)
          //    vm.selectedEquipmentID = objEquipment.eqpID;
          return $q.resolve(vm.EquipmentList);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* init autocomplete */
      const autocompletePromise = [getWarehouseList(), getAllNickNameOfAssembly(), getEquipmentList()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        if (vm.data.warehouseType === vm.cartType.Equipment.key) {
          vm.WarehouseList = _.filter(vm.WarehouseList, (data) => data.parentWHType === CORE.ParentWarehouseType.ProductionDepartment);
        }
        initDeptAutoComplete();
        initAutoComplete();
        if ($scope.warehouseData.isFromEquipmentMasterPage) {
          vm.data.warehouseType = vm.cartType.Equipment.key;
          vm.changeWarehouseType();
          vm.autoCompleteEquipment.keyColumnId = $scope.warehouseData.eqpID;
        }
      }).catch((error) => BaseService.getErrorLog(error));

      /* Used to check uniue name */
      vm.checkNameUnique = () => {
        if (vm.data.cartName) {
          if (vm.data.warehouseType === vm.cartType.SmartCart.key) {
            vm.data.leftSideWHLabel = stringFormat('{0}-L', vm.data.cartName).toUpperCase();
            vm.data.rightSideWHLabel = stringFormat('{0}-R', vm.data.cartName).toUpperCase();
          }
          vm.cgBusyLoading = WarehouseBinFactory.checkNameUnique().query({ id: vm.data && vm.data.ID ? vm.data.ID : 0, name: vm.data.cartName, type: TRANSACTION.TypeWHBin.Warehouse, leftside: vm.data.leftSideWHLabel, rightside: vm.data.rightSideWHLabel }).$promise.then((res) => {
            if (res && res.data) {
              const checkName = angular.copy(vm.data.cartName).toUpperCase();
              let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WAREHOUSE_UNIQUE);
              if (checkName === res.data.Name && res.data.WarehouseID) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WAREHOUSE_UNIQUE_IN_BIN);
                messageContent.message = stringFormat(messageContent.message, vm.data.warehouseType === vm.cartType.Equipment.key ? 'Equipment' : 'Warehouse', checkName);
              }
              else if (checkName === res.data.Name) {
                messageContent.message = stringFormat(messageContent.message, vm.data.warehouseType === vm.cartType.Equipment.key ? 'Equipment' : 'Warehouse', checkName);
              }
              else if (checkName === res.data.rightSideWHLabel || vm.data.rightSideWHLabel === res.data.rightSideWHLabel || vm.data.rightSideWHLabel === res.data.Name) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WAREHOUSE_UNIQUE_SIDE2);
                messageContent.message = stringFormat(messageContent.message, vm.data.warehouseType === vm.cartType.Equipment.key ? 'Equipment' : 'Warehouse', checkName);
              }
              else if (checkName === res.data.leftSideWHLabel || vm.data.leftSideWHLabel === res.data.leftSideWHLabel || vm.data.leftSideWHLabel === res.data.Name) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WAREHOUSE_UNIQUE_SIDE1);
                messageContent.message = stringFormat(messageContent.message, vm.data.warehouseType === vm.cartType.Equipment.key ? 'Equipment' : 'Warehouse', checkName);
              }
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  vm.data.Name = null;
                  vm.data.leftSideWHLabel = null;
                  vm.data.rightSideWHLabel = null;
                  if (vm.data.warehouseType === vm.cartType.Equipment.key) {
                    vm.data.Name = null;
                    vm.data.cartName = null;
                    vm.autoCompleteEquipment.keyColumnId = null;
                  } else {
                    vm.data.Name = null;
                    vm.data.cartName = null;
                    setFocus('cartname');
                  }
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              if (vm.data.warehouseType !== vm.cartType.Equipment.key) {
                vm.data.Name = vm.data.cartName;
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      /* Used to get department list */
      vm.goToDepartmentList = () => {
        BaseService.openInNew(TRANSACTION.TRANSACTION_WAREHOUSE_STATE, {});
      };


      /* used to check inque cart */
      vm.checkUniqueIDProcessing = false;
      vm.checkCartIdUnique = () => {
        if (!vm.checkUniqueIDProcessing) {
          vm.checkUniqueIDProcessing = true;
          if (vm.data.uniqueCartID) {
            WarehouseBinFactory.checkCartIdUnique().query({ id: vm.data && vm.data.ID ? vm.data.ID : 0, cartId: vm.data.uniqueCartID }).$promise.then((res) => {
              if (res && res.data) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
                messageContent.message = stringFormat(messageContent.message, 'Cart id');
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                return DialogFactory.messageAlertDialog(model).then((yes) => {
                  if (yes) {
                    setFocus('uniqueCartID');
                    vm.data.uniqueCartID = null;
                    vm.checkUniqueIDProcessing = false;
                  }
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
              } else {
                //vm.data.cartName = vm.data.uniqueCartID;
                //vm.data.Name = vm.data.uniqueCartID;
                vm.checkUniqueIDProcessing = false;
                vm.checkCartWiseUniqueDomain();
                vm.data.allMovableBin = false;
                //vm.isDisableBinMovable = true;
              }
            }).catch((error) => {
              vm.checkUniqueIDProcessing = false;
              return BaseService.getErrorLog(error);
            });
          } else {
            vm.checkUniqueIDProcessing = false;
            vm.data.domain = null;
            vm.data.cartMfr = null;
            //vm.isDisableBinMovable = false;
          }
        }
      };

      /* Used to change status */
      vm.changeStatus = () => {
        if (vm.data && vm.data.ID) {
          if (!vm.data.isActive) {
            WarehouseBinFactory.checkActiveBin().query({ id: vm.data.ID }).$promise.then((res) => {
              if (res && res.data) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.USE_WH_IN_OTHER);
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                return DialogFactory.messageAlertDialog(model).then((yes) => {
                  if (yes) {
                    vm.data.isActive = true;
                  }
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      };

      /* Used to check cart wise unique domain */
      vm.checkCartWiseUniqueDomain = () => {
        if (vm.data && (vm.data.domain || vm.data.cartMfr)) {
          WarehouseBinFactory.checkCartWiseUniqueDomain().query({ id: vm.data ? vm.data.ID : 0, domain: vm.data.domain, uniqueCartID: vm.data.uniqueCartID }).$promise.then((res) => {
            if (res && res.data) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
              messageContent.message = stringFormat(messageContent.message, 'Domain and UniqueCartID');
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  vm.data.domain = null;
                  setFocus('domain');
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      /* Used to check equipment */
      vm.changeEquipment = () => {
        if (vm.data.isEquipment) {
          vm.selectPermanentWH = true;
          vm.data.allMovableBin = false;

          vm.data.Name = null;
          vm.data.uniqueCartID = null;
          vm.data.domain = null;
          vm.data.cartMfr = null;
        } else {
          vm.selectPermanentWH = false;
          vm.data.allMovableBin = true;
          vm.data.Name = null;
          vm.autoCompleteEquipment.keyColumnId = null;
          setFocus('warehousename');
        }
      };

      /* Used to check warehouse type */
      vm.changeWarehouseType = () => {
        if (vm.data.warehouseType === vm.cartType.SmartCart.key) {
          vm.selectPermanentWH = false;
          vm.data.allMovableBin = false;
          vm.autoCompleteNickName.keyColumnId = null;
          //vm.data.userAccessMode = true;
          vm.data.userAccessMode = 'S';
          vm.autoCompleteEquipment.keyColumnId = null;
          if (_.filter(vm.copyWarehouseList, (data) => data.parentWHType === CORE.ParentWarehouseType.MaterialDepartment).length === 1) {
            vm.autoCompleteWarehouse.keyColumnId = vm.copyWarehouseList[0].ID;
          }
          else {
            vm.autoCompleteWarehouse.keyColumnId = null;
          }
          vm.WarehouseList = angular.copy(vm.copyWarehouseList);
          vm.data.cartName = null;
          vm.data.Name = $scope.warehouseData.Name ? $scope.warehouseData.Name : null;
        } else if (vm.data.warehouseType === vm.cartType.ShelvingCart.key) {
          vm.selectPermanentWH = false;
          vm.data.allMovableBin = true;
          vm.data.uniqueCartID = null;
          vm.data.domain = null;
          vm.data.cartMfr = null;
          //vm.data.userAccessMode = true;
          vm.data.userAccessMode = 'N/A';
          vm.autoCompleteEquipment.keyColumnId = null;
          if (_.filter(vm.copyWarehouseList, (data) => data.parentWHType === CORE.ParentWarehouseType.MaterialDepartment).length === 1) {
            vm.autoCompleteWarehouse.keyColumnId = vm.copyWarehouseList[0].ID;
          } else {
            vm.autoCompleteWarehouse.keyColumnId = null;
          }
          vm.WarehouseList = angular.copy(vm.copyWarehouseList);
          vm.data.cartName = null;
          vm.data.Name = $scope.warehouseData.Name ? $scope.warehouseData.Name : null;
        } else if (vm.data.warehouseType === vm.cartType.Equipment.key) {
          vm.selectPermanentWH = true;
          vm.data.allMovableBin = false;
          vm.autoCompleteNickName.keyColumnId = null;
          vm.data.uniqueCartID = null;
          vm.data.domain = null;
          vm.data.cartMfr = null;
          //vm.data.userAccessMode = true;
          vm.data.userAccessMode = 'S';
          vm.WarehouseList = _.filter(vm.WarehouseList, (data) => data.parentWHType === CORE.ParentWarehouseType.ProductionDepartment);
          if (vm.WarehouseList.length !== 1) {
            vm.autoCompleteWarehouse.keyColumnId = null;
          }
          vm.data.cartName = null;
          vm.data.Name = $scope.warehouseData.Name ? $scope.warehouseData.Name : null;
        }
        //vm.autoCompleteWarehouse = null;
        initDeptAutoComplete();
      };

      /* Used to goto nickname list */
      vm.goToNicknameList = () => {
        BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE);
      };

      /* Used to goto equipment list */
      vm.goToEquipmentList = () => {
        BaseService.goToEquipmentWorkstationList();
      };

      /* Used to check text nickname */
      vm.checkTextNickname = () => {
        if (vm.data.txtnickname) {
          vm.autoCompleteNickName.keyColumnId = null;
          vm.data.cartName = vm.data.txtnickname;
          vm.data.Name = vm.data.txtnickname;
        } else {
          if (!vm.autoCompleteNickName.keyColumnId) {
            vm.data.cartName = null;
            vm.data.Name = null;
          }
        }
      };

      /* Used to push form on load */
      angular.element(() => {
        BaseService.currentPagePopupForm = [vm.warehouseForm];
      });
    }
  }
})();
