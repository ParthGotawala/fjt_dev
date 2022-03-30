(function () {
  'use strict';
  angular
    .module('app.transaction.warehousebin')
    .controller('BinAddUpdatePopupController', BinAddUpdatePopupController);
  /** @ngInject */
  function BinAddUpdatePopupController($rootScope, $q, $timeout, $mdDialog, TRANSACTION, CORE, BinFactory, DialogFactory, BaseService, USER, data, WarehouseBinFactory, ReceivingMaterialFactory) {
    const vm = this;
    vm.WarehouseCartManufacturer = CORE.WarehouseCartManufacturer;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.binType = TRANSACTION.binType;
    vm.warehouseType = TRANSACTION.warehouseType;
    vm.binGenerate = TRANSACTION.binGenerate;
    vm.binGenerateType = TRANSACTION.binGenerateType;
    vm.binGenerateMethod = TRANSACTION.binGenerateMethod;
    vm.binPrefixMethod = TRANSACTION.binPrefixMethod;
    vm.transaction = TRANSACTION;
    vm.minLengthMessage = CORE.MESSAGE_CONSTANT.MIN_LENGTH_MESSAGE;
    vm.saveBtnDisableFlag = false;
    vm.isSubmit = false;
    vm.bin = {};
    vm.multipleBinList = [];
    let binPrefix;
    //vm.callEnter = false;
    vm.isFocusOnWH = true;
    let binNickName = null;
    const binTemplate = {
      id: null,
      Name: data ? data.Name : null,
      WarehouseID: null,
      Description: null,
      isPermanentBin: null,
      isActive: true,
      nickname: null,
      isSingleBin: true,
      isRandom: true,
      isRange: false,
      isBinPrifix: true
    };
    vm.objWHAdd = {
      warehouseId: data.ID
    };

    vm.clearBin = () => {
      vm.bin = Object.assign({}, binTemplate);
      vm.bin.generateBin = data.generateBin;
    };

    vm.bin = angular.copy(data);
    vm.selectedWarehouse = {};
    vm.RadioGroup = {
      isActive: {
        array: CORE.ActiveRadioGroup
      }
    };


    if (data && data.id) {
      vm.bin.isPermanentBin = vm.bin && vm.bin.isPermanentBin && vm.bin.isPermanentBin === 1 ? true : false;
      if (data.isRandom === 1) {
        vm.binPrefix = null;
      } else {
        vm.binPrefix = stringFormat('{0}+', data.warehouseName);
        vm.bin.Name = data.Name.replace(vm.binPrefix, '');
      }

      $timeout(() => {
        vm.binCopy = _.clone(vm.bin);
        vm.checkDirtyObject = {
          columnName: ['Name', 'Description', 'WarehouseID', 'isActive', 'isPermanentBin'],
          oldModelName: vm.binCopy,
          newModelName: vm.bin
        };
      });
    }
    else {
      vm.clearBin();
    }

    vm.saveBinRefactored = () => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.binForm)) {
        vm.saveBtnDisableFlag = false;
        return;
      }
      if (vm.bin.isSingleBin) {
        const checkUnique = vm.checkNameUnique;
        if (!checkUnique) {
          return;
        }
        const binInfo = {
          id: vm.bin.id ? vm.bin.id : undefined,
          Name: vm.binPrefix ? stringFormat('{0}{1}', vm.binPrefix, vm.bin.Name) : vm.bin.Name,
          Description: vm.bin.Description ? vm.bin.Description : null,
          WarehouseID: vm.autoCompleteWarehouse.keyColumnId ? vm.autoCompleteWarehouse.keyColumnId : null,
          isActive: vm.bin.isActive ? vm.bin.isActive : false,
          isPermanentBin: vm.bin.isPermanentBin ? vm.bin.isPermanentBin : false,
          nickname: vm.autoCompleteNickName && vm.autoCompleteNickName.keyColumnId ? vm.autoCompleteNickName.keyColumnId.toUpperCase() : null,
          prefix: vm.bin.prefix ? vm.bin.prefix.toUpperCase() : null,
          isRandom: vm.bin.isRandom,
          warehouseType: vm.selectedWarehouse.warehouseType,
          singleBin: true
        };
        if (vm.bin && vm.bin.id) {
          vm.cgBusyLoading = BinFactory.updateBin().query(binInfo).$promise.then((res) => {
            if (res && res.userMessage) {
              vm.saveBtnDisableFlag = false;
              vm.binForm.$setPristine();
              BaseService.currentPagePopupForm = [];
              $mdDialog.cancel(res.userMessage);
            } else {
              vm.saveBtnDisableFlag = false;
            }
          }).catch((error) => {
            vm.saveBtnDisableFlag = false;
            return BaseService.getErrorLog(error);
          });
        } else {
          vm.cgBusyLoading = BinFactory.createBin().query(binInfo).$promise.then((res) => {
            if (res && res.userMessage) {
              vm.saveBtnDisableFlag = false;
              vm.binForm.$setPristine();
              BaseService.currentPagePopupForm = [];
              $mdDialog.cancel(res.userMessage);
              $rootScope.$emit('BinEvent');
            } else {
              if (checkResponseHasCallBackFunctionPromise(res)) {
                res.alretCallbackFn.then(() => {
                  setFocus('binname');
                });
              }
              vm.saveBtnDisableFlag = false;
            }
          }).catch((error) => {
            vm.saveBtnDisableFlag = false;
            return BaseService.getErrorLog(error);
          });
        }
      }
      else {
        if (!vm.bin.isRange) {
          const binInfo = {
            Description: vm.bin.Description ? vm.bin.Description : null,
            WarehouseID: vm.autoCompleteWarehouse.keyColumnId ? vm.autoCompleteWarehouse.keyColumnId : null,
            isActive: vm.bin.isActive ? vm.bin.isActive : false,
            isPermanentBin: vm.bin.isPermanentBin ? vm.bin.isPermanentBin : false,
            nickname: vm.autoCompleteNickName && vm.autoCompleteNickName.keyColumnId ? vm.autoCompleteNickName.keyColumnId.toUpperCase() : null,
            prefix: vm.bin.prefix ? vm.bin.prefix.toUpperCase() : null,
            isRandom: vm.bin.isRandom,
            warehouseType: vm.selectedWarehouse.warehouseType,
            multipleBinList: vm.multipleBinList,
            isDuplicate: false,
            multipleBin: true,
            manualBin: true
          };
          createBin(binInfo);
        } else {
          const count = (parseInt(vm.bin.binTo || 0) - parseInt(vm.bin.binFrom || 0)) + 1;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_COUNT);
          messageContent.message = stringFormat(messageContent.message, count);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
            multiple: true
          };
          return DialogFactory.messageConfirmDialog(obj).then(() => {
            const WHName = _.find(vm.WarehouseList, (data) => data.ID === vm.autoCompleteWarehouse.keyColumnId);
            const binInfo = {
              id: vm.bin.id ? vm.bin.id : undefined,
              binPrifix: vm.autoCompleteNickName && vm.autoCompleteNickName.keyColumnId ? vm.autoCompleteNickName.keyColumnId.toUpperCase() : vm.bin.prefix ? vm.bin.prefix.toUpperCase() : null,
              nickname: vm.autoCompleteNickName && vm.autoCompleteNickName.keyColumnId ? vm.autoCompleteNickName.keyColumnId.toUpperCase() : null,
              prefix: vm.bin.isBinPrifix ? (vm.bin.prefix ? vm.bin.prefix.toUpperCase() : null) : null,
              suffix: vm.bin.isBinPrifix ? null : (vm.bin.prefix ? vm.bin.prefix.toUpperCase() : null),
              WarehouseID: vm.autoCompleteWarehouse.keyColumnId ? vm.autoCompleteWarehouse.keyColumnId : null,
              WarehouseName: WHName ? WHName.Name : null,
              Description: vm.bin.Description ? vm.bin.Description : null,
              isActive: vm.bin.isActive ? vm.bin.isActive : false,
              isPermanentBin: vm.bin.isPermanentBin ? vm.bin.isPermanentBin : false,
              isRandom: vm.bin.isRandom,
              binFrom: vm.bin.binFrom ? vm.bin.binFrom : null,
              binTo: vm.bin.binTo ? vm.bin.binTo : null,
              isDuplicate: false,
              warehouseType: vm.selectedWarehouse.warehouseType,
              isBinPrifix: vm.bin.isBinPrifix,
              multipleBin: true,
              rangeBin: true
            };
            createBin(binInfo);
          }, () => {
            vm.saveBtnDisableFlag = false;
          }).catch((error) => {
            vm.saveBtnDisableFlag = false;
            return BaseService.getErrorLog(error);
          });
        }
      }
    };

    const createBin = (binInfo) => {
      vm.cgBusyLoading = BinFactory.createBin().query(binInfo).$promise.then((res) => {
        if (res && res.data) {
          vm.saveBtnDisableFlag = false;
          binInfo.Type = TRANSACTION.TypeWHBin.Bin;
          res.data.push(binInfo);
          DialogFactory.dialogService(
            TRANSACTION.DUPLICATE_WAREHOUSE_BIN_CONTROLLER,
            TRANSACTION.DUPLICATE_WAREHOUSE_BIN_VIEW,
            event,
            res.data).then(() => {
            }, (warehouse_bin) => {
              if (warehouse_bin) {
                vm.binForm.$setPristine();
                BaseService.currentPagePopupForm = [];
                $mdDialog.cancel(true);
                $rootScope.$emit('BinEvent');
              }
            }, (err) => {
              vm.saveBtnDisableFlag = false;
              return BaseService.getErrorLog(err);
            });
        } else {
          vm.saveBtnDisableFlag = false;
          vm.binForm.$setPristine();
          BaseService.currentPagePopupForm = [];
          $mdDialog.cancel(true);
          $rootScope.$emit('BinEvent');
        }
      }).catch((error) => {
        vm.saveBtnDisableFlag = false;
        return BaseService.getErrorLog(error);
      });
    };

    vm.cancel = () => {
      // Check vm.isChange flag for color picker dirty object
      const isdirty = vm.checkFormDirty(vm.binForm, vm.checkDirtyObject);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        vm.binForm.$setPristine();
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    const getWarehouseList = () => {
      vm.WarehouseList = [];
      return BinFactory.getAllWarehouse().query().$promise.then((binlist) => {
        vm.WarehouseList = binlist.data;
        if (vm.bin.generateBin) {
          vm.WarehouseList = _.filter(vm.WarehouseList, (data) => data.isEquipment === 0);
        }
        return $q.resolve(vm.WarehouseList);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getAllNickNameOfAssembly = () => BinFactory.getAllNickNameOfAssembly().query().$promise.then((nickNameList) => {
        vm.NickNameList = nickNameList.data;
        if (vm.bin.nickname) {
          const objnickname = _.find(vm.nicknamelist, (data) => data.nickname === vm.bin.nickname);
          if (objnickname) {
            vm.editnickname = objnickname.nickname;
          }
          //else {
          //    vm.bin.prefix = vm.bin.nickname;
          //}
        }
        return $q.resolve(vm.NickNameList);
      }).catch((error) => BaseService.getErrorLog(error));

    const autocompletePromise = [getWarehouseList(), getAllNickNameOfAssembly()];
    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
      initAutoComplete();
    }).catch((error) => BaseService.getErrorLog(error));

    const initAutoComplete = () => {
      vm.autoCompleteWarehouse = {
        columnName: 'Name',
        controllerName: TRANSACTION.TRANSACTION_MANAGEWAREHOUSE_CONTROLLER,
        viewTemplateURL: TRANSACTION.TRANSACTION_MANAGEWAREHOUSE_VIEW,
        addData: {
          popupAccessRoutingState: [TRANSACTION.TRANSACTION_WAREHOUSE_STATE],
          pageNameAccessLabel: CORE.PageName.warehouse
        },
        keyColumnName: 'ID',
        keyColumnId: vm.bin && vm.bin.WarehouseID ? vm.bin.WarehouseID : vm.objWHAdd && vm.objWHAdd.warehouseId ? vm.objWHAdd.warehouseId : null,
        inputName: 'Warehouse',
        placeholderName: 'Warehouse',
        isRequired: true,
        isAddnew: true,
        isSearchTextUppercase: true,
        callbackFn: getWarehouseList,
        onSelectCallbackFn: (item) => {
          vm.isFocusOnWH = false;
          $timeout(() => {
            vm.isFocusOnWH = true;
          }, true);
          const warehouseObj = {
            warehouseID: item ? item.ID : null,
            warehouseName: item ? item.Name : null,
            nickName: item ? item.nickname : null,
            allMovableBin: item ? item.allMovableBin : false,
            isPermanentWH: item ? item.isPermanentWH : false,
            isActive: item ? item.isActive : false,
            cartMfr: item ? item.cartMfr : null,
            refEqpID: item ? item.refEqpID : null,
            warehouseType: item ? item.warehouseType : null
          };
          vm.selectedWarehouse = item;
          if (item) {
            vm.genString(null, item);
            if (item.binMst.length > 0) {
              vm.isWarehouseHasBin = true;
              const getFirstBin = _.first(item.binMst);
              if (getFirstBin && !vm.bin.id) {
                vm.bin.isRandom = getFirstBin.isRandom;
              }
            }
            vm.bin.isPermanentBin = !item.allMovableBin;
            if (item.nickname) {
              const objNickName = _.find(vm.NickNameList, (data) => data.nickName === item.nickname);
              if (objNickName) {
                vm.autoCompleteNickName.keyColumnId = item.nickname;
              }
              //else {
              //    vm.bin.prefix = item.nickname;
              //}
            }

            //if ((item.warehouseType == vm.warehouseType.Equipment) || (item.warehouseType == vm.warehouseType.SmartCart && item.cartMfr == vm.WarehouseCartManufacturer[1].name)) {
            //    vm.bin.isSingleBin = true;
            //}

            vm.bin.isSingleBin = true;
            if (item.warehouseType === vm.warehouseType.ShelvingCart.key && !vm.isWarehouseHasBin) {
              vm.bin.isRandom = false;
            } else if (item.warehouseType !== vm.warehouseType.ShelvingCart.key && !vm.isWarehouseHasBin) {
              vm.bin.isRandom = true;
            }
            if (item.warehouseType === vm.warehouseType.Equipment.key) {
              vm.bin.isRandom = false;
            }


            //vm.bin.isRandom = true;

            //if (item.cartMfr != vm.WarehouseCartManufacturer[1].name) {
            //    vm.bin.isRandom = false;
            //} else {
            //    vm.bin.isRandom = true;
            //}
            //if ((item.warehouseType == vm.warehouseType.SmartCart && item.cartMfr != vm.WarehouseCartManufacturer[1].name) ||
            //        item.warehouseType == vm.warehouseType.Equipment ||
            //        item.warehouseType == vm.warehouseType.ShelvingCart ||
            //        item.nickname ||
            //        item.isAddNew) {

            if (item && item.isAddNew && (item.binMst && item.binMst.length === 0)) {
              vm.getBinCountList(warehouseObj);
            } else if (item && item.isAddNew && (item.binMst && item.binMst.length > 0)) {
              getAllGenerateBin(warehouseObj);
            } else if (item && !item.isAddNew) {
              vm.getBinCountList(warehouseObj);
            } else {
              vm.bin.Name = null;
            }
          } else {
            vm.isWarehouseHasBin = false;
            vm.bin.isPermanentBin = null;
            vm.autoCompleteNickName.keyColumnId = null;
            vm.bin.isSingleBin = true;
            vm.bin.binFrom = null;
            vm.bin.binTo = null;
            vm.bin.Name = null;
            vm.binPrefix = null;
            binPrefix = null;
            vm.multipleBinList = [];
            vm.genString(null, null);
          }
        }
      };

      vm.autoCompleteNickName = {
        columnName: 'nickName',
        keyColumnName: 'nickName',
        keyColumnId: vm.bin.nickname ? vm.bin.nickname : null,
        inputName: 'nickName',
        placeholderName: 'Nickname',
        isRequired: false,
        isAddnew: false,
        callbackFn: getAllNickNameOfAssembly,
        onSelectCallbackFn: (item) => {
          if (item) {
            if (!vm.bin.id) {
              vm.bin.prefix = null;
            }
            binNickName = item;
            vm.getBinCountList(vm.selectedWarehouse);
            vm.genString(item, null);
          } else {
            binNickName = null;
            vm.genString(null, null);
            vm.bin.Name = null;
          }
        }
      };
    };

    vm.getBinCountList = (warehouseObj) => {
      if (!vm.bin.id && vm.bin.isSingleBin) {
        vm.cgBusyLoading = BinFactory.getBinCountList().query({ objIDs: warehouseObj.warehouseID ? warehouseObj.warehouseID : warehouseObj.ID }).$promise.then((res) => {
          if (res && res.data) {
            if (warehouseObj.warehouseType === vm.warehouseType.Equipment.key) {
              vm.binPrefix = vm.bin.isRandom ? null : stringFormat('{0}+', warehouseObj.warehouseName ? warehouseObj.warehouseName : warehouseObj.Name);
              vm.bin.isPermanentBin = true;
              binPrefix = vm.binPrefix;
            } else if (warehouseObj.warehouseType === vm.warehouseType.SmartCart.key) { //&& warehouseObj.cartMfr != vm.WarehouseCartManufacturer[1].name
              const data = _.first(res.data);
              let BinCount = data.CountBin;
              BinCount = BinCount + 1;
              vm.binPrefix = vm.bin.isRandom ? null : stringFormat('{0}+', warehouseObj.warehouseName ? warehouseObj.warehouseName : warehouseObj.Name);
              vm.bin.Name = stringFormat('{0}', BinCount);
              vm.bin.isPermanentBin = !warehouseObj.allMovableBin;
              binPrefix = vm.binPrefix;
            } else if (warehouseObj.warehouseType === vm.warehouseType.ShelvingCart.key) {
              const data = _.first(res.data);
              let BinCount = data.CountBin;
              BinCount = BinCount + 1;
              vm.binPrefix = vm.bin.isRandom ? null : stringFormat('{0}+', warehouseObj.warehouseName ? warehouseObj.warehouseName : warehouseObj.Name);
              if ((vm.autoCompleteNickName && vm.autoCompleteNickName.keyColumnId) || vm.bin.prefix) {
                vm.bin.Name = stringFormat('{0}', vm.autoCompleteNickName && vm.autoCompleteNickName.keyColumnId ? vm.autoCompleteNickName.keyColumnId : vm.bin.prefix);
              } else {
                vm.bin.Name = stringFormat('BIN{0}', BinCount);
              }
              vm.bin.isPermanentBin = !warehouseObj.allMovableBin;
              binPrefix = vm.binPrefix;
            }
            //vm.checkNameUnique();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else if (!vm.bin.id && !vm.bin.isSingleBin) {
        vm.binPrefix = vm.bin.isRandom ? null : stringFormat('{0}+', warehouseObj.warehouseName ? warehouseObj.warehouseName : warehouseObj.Name);
        binPrefix = vm.binPrefix;
      }
    };

    const getAllGenerateBin = (warehouseObj) => {
      vm.cgBusyLoading = ReceivingMaterialFactory.getAllBin().query({ warehouseID: warehouseObj.warehouseID ? warehouseObj.warehouseID : warehouseObj.ID }).$promise.then((bin) => {
        if (bin && bin.data) {
          vm.binList = bin.data;
          const firstBin = _.first(vm.binList);
          if (firstBin && firstBin.Name) {
            vm.binPrefix = stringFormat('{0}+', warehouseObj.warehouseName ? warehouseObj.warehouseName : warehouseObj.Name);
            vm.bin.Name = firstBin.Name.replace(vm.binPrefix, '');
            //let splitString = firstBin.Name.split("+");
            //vm.binPrefix = splitString[0];
            //vm.bin.Name = splitString[1];
          }
          vm.bin.isPermanentBin = !warehouseObj.allMovableBin;
          vm.binForm.$setPristine();
          BaseService.currentPagePopupForm = [];
          setFocus('Active');
          $mdDialog.cancel(firstBin);
          $rootScope.$emit('BinEvent');
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.checkNameUnique = () => {
      if (vm.bin.Name) {
        const binName = vm.binPrefix ? stringFormat('{0}{1}', vm.binPrefix, vm.bin.Name) : vm.bin.Name;
        WarehouseBinFactory.checkNameUnique().query({ id: vm.bin && vm.bin.id ? vm.bin.id : 0, name: binName, type: TRANSACTION.TypeWHBin.Bin }).$promise.then((res) => {
          if (res && res.data) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_UNIQUE);
            messageContent.message = stringFormat(messageContent.message, vm.selectedWarehouse.warehouseType === vm.warehouseType.Equipment.key ? 'Feeder' : 'Bin', binName);
            const obj = {
              messageContent: messageContent
            };
            return DialogFactory.messageAlertDialog(obj).then((yes) => {
              if (yes) {
                vm.bin.Name = null;
                setFocus('binname');
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            return true;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.goToWarehouseList = () => {
      BaseService.openInNew(TRANSACTION.TRANSACTION_WAREHOUSE_STATE);
    };

    vm.goToNicknameList = () => {
      BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE);
    };

    vm.changeStatus = () => {
      if (vm.bin && vm.bin.id) {
        if (vm.bin.isActive) {
          if (!vm.selectedWarehouse.isActive) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FIRST_ACTIVE_WH);
            const obj = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(obj).then((yes) => {
              if (yes) {
                vm.bin.isActive = false;
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
        } else {
          const objIds = [];
          objIds.push(vm.bin.id);
          BinFactory.checkBinStatusWithUMID().query(objIds).$promise.then((res) => {
            if (res && res.data) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.USE_BIN_IN_OTHER);
              const obj = {
                messageContent: messageContent,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(obj).then((yes) => {
                if (yes) {
                  vm.bin.isActive = true;
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    vm.changeTextNickname = () => {
      if (vm.bin.prefix) {
        vm.autoCompleteNickName.keyColumnId = null;
        vm.getBinCountList(vm.selectedWarehouse);
        vm.genString(null, null);
      } else {
        if (!vm.autoCompleteNickName.keyColumnId) {
          vm.bin.Name = null;
        }
      }
    };

    const blankObjForAddBinName = () => {
      const obj = {
        binPrefix: vm.bin.isRandom ? null : binPrefix,
        Name: null,
        callEnter: false
      };
      vm.multipleBinList.push(obj);
    };

    vm.changeBinGenerate = () => {
      vm.bin.Name = null;
      vm.binPrefix = null;
      if (vm.bin.isSingleBin) {
        vm.bin.isRange = false;
        vm.getBinCountList(vm.selectedWarehouse);
      } else {
        vm.multipleBinList = [];
        blankObjForAddBinName();
      }
    };

    vm.changeBinGenerateType = () => {
      vm.getBinCountList(vm.selectedWarehouse);
      if (vm.bin.isRandom) {
        vm.bin.isRange = false;
      }
      vm.multipleBinList = [];
      blankObjForAddBinName();
      vm.genString();
    };

    vm.changeBinGenerateMethod = () => {
      if (vm.bin.isRange) {
        vm.multipleBinList = [];
        blankObjForAddBinName();
        vm.genString();
      } else {
        vm.bin.binFrom = null;
        vm.bin.binTo = null;
      }
    };

    vm.checkAndAddBinName = (index) => {
      const findEmptyName = _.find(vm.multipleBinList, (data) => !data.Name);
      if (findEmptyName) {
        const findIndex = _.findIndex(vm.multipleBinList, findEmptyName);
        setFocus(stringFormat('binName_{0}', findIndex > -1 ? findIndex : null));
      } else {
        if (index === vm.multipleBinList.length - 1) {
          const findDuplicateValue = _.find(vm.multipleBinList, (data, i) => {
            if (i !== index) {
              return data.Name === vm.multipleBinList[index].Name;
            }
          });
          if (findDuplicateValue) {
            vm.checkDuplicatRandomBin(index, findDuplicateValue);
          } else {
            checkDuplicateBinInDB(index);
          }
        } else {
          setFocus(stringFormat('binName_{0}', index + 1));
        }
      }
    };

    const checkDuplicateBinInDB = (index) => {
      const binName = vm.multipleBinList[index].binPrefix ? stringFormat('{0}{1}', vm.multipleBinList[index].binPrefix, vm.multipleBinList[index].Name) : vm.multipleBinList[index].Name;
      WarehouseBinFactory.checkNameUnique().query({ id: vm.bin && vm.bin.id ? vm.bin.id : 0, name: binName, type: TRANSACTION.TypeWHBin.Bin }).$promise.then((res) => {
        if (res && res.data) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_UNIQUE);
          messageContent.message = stringFormat(messageContent.message, vm.selectedWarehouse.warehouseType === vm.warehouseType.Equipment.key ? 'Feeder' : 'Bin', binName);
          const obj = {
            messageContent: messageContent
          };
          return DialogFactory.messageAlertDialog(obj).then((yes) => {
            if (yes) {
              vm.multipleBinList[index].Name = null;
              setFocus(stringFormat('binName_{0}', index));
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          if (vm.multipleBinList[index].callEnter === true) {
            blankObjForAddBinName();
            $timeout(() => {
              setFocus(stringFormat('binName_{0}', vm.multipleBinList.length - 1));
             }, true);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.addBin = (e, index) => {
      $timeout(()=> {
        if (e.keyCode === 13) {
          e.preventDefault();
          //vm.callEnter = true;
          vm.multipleBinList[index].callEnter = true;
          vm.checkAndAddBinName(index);
        }
      });
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent(e);
    };

    vm.checkToFromValue = () => {
      if (vm.bin.binFrom && vm.bin.binTo) {
        if (parseInt(vm.bin.binFrom || 0) > parseInt(vm.bin.binTo || 0)) {
          vm.binForm.binFrom.$setDirty(true);
          vm.binForm.binFrom.$touched = true;
          vm.binForm.binFrom.$setValidity('minvalue', false);
          //$timeout(() => {
          //    let myEl = angular.element(document.querySelector('#binFrom'));
          //    myEl.focus();
          //}, true);
        } else {
          vm.binForm.binFrom.$setValidity('minvalue', true);
        }
      }
      vm.genString(binNickName, null);
    };

    vm.genString = function (selectedNickname, selectedWarehouse) {
      const whId = selectedWarehouse ? selectedWarehouse.ID : vm.autoCompleteWarehouse.keyColumnId;
      const WHName = _.find(vm.WarehouseList, (data) => data.ID === whId);
      if (WHName) {
        const preString = selectedNickname ? selectedNickname.nickName.toUpperCase() : (vm.bin.prefix ? vm.bin.prefix.toUpperCase() : null);
        if (!preString) {
          if (vm.bin.isRandom) {
            vm.binFromString = vm.bin.binFrom ? vm.bin.binFrom : '';
            vm.binToString = vm.bin.binTo ? vm.bin.binTo : '';
          } else {
            vm.binFromString = stringFormat('{0}+{1}', WHName.Name, vm.bin.binFrom ? vm.bin.binFrom : '');
            vm.binToString = stringFormat('{0}+{1}', WHName.Name, vm.bin.binTo ? vm.bin.binTo : '');
          }
        } else {
          if (vm.bin.isRandom) {
            let generatedBinFormat = '{1}{0}';
            if (vm.bin.isBinPrifix) {
              generatedBinFormat = '{0}{1}';
            }
            vm.binFromString = stringFormat(generatedBinFormat, preString ? preString : '', vm.bin.binFrom ? vm.bin.binFrom : '');
            vm.binToString = stringFormat(generatedBinFormat, preString ? preString : '', vm.bin.binTo ? vm.bin.binTo : '');
          } else {
            let generatedBinFormat = '{0}+{2}{1}';
            if (vm.bin.isBinPrifix) {
              generatedBinFormat = '{0}+{1}{2}';
            }
            vm.binFromString = stringFormat(generatedBinFormat, WHName.Name, preString ? preString : '', vm.bin.binFrom ? vm.bin.binFrom : '');
            vm.binToString = stringFormat(generatedBinFormat, WHName.Name, preString ? preString : '', vm.bin.binTo ? vm.bin.binTo : '');
          }
        }
      }
    };

    vm.checkPrefix = () => {
      if (vm.bin.prefix && vm.bin.prefix !== vm.bin.Name) {
        vm.bin.prefix = vm.bin.Name;
      }
    };

    vm.checkDuplicatRandomBin = (index, item) => {
      let findDuplicateValue = {};
      if (item) {
        findDuplicateValue = item;
      } else {
        findDuplicateValue = _.find(vm.multipleBinList, (data, i) => data.Name === vm.multipleBinList[index].Name && i !== index);
      }
      if (findDuplicateValue && findDuplicateValue.Name) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_UNIQUE);
        messageContent.message = stringFormat(messageContent.message, vm.selectedWarehouse.warehouseType === vm.warehouseType.Equipment.key ? 'Feeder' : 'Bin', findDuplicateValue.binPrefix ? stringFormat('{0}{1}', findDuplicateValue.binPrefix, findDuplicateValue.Name) : findDuplicateValue.Name);
        const obj = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(obj).then((yes) => {
          if (yes) {
            vm.multipleBinList[index].callEnter = false;
            vm.multipleBinList[index].Name = null;
            setFocus(stringFormat('binName_{0}', index));
           }
        }, () => {

        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        checkDuplicateBinInDB(index);
      }
    };

    vm.removeBin = (index) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
      messageContent.message = stringFormat(messageContent.message, 'Bin', 1);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (index > 0) {
            vm.multipleBinList[index - 1].callEnter = false;
          }
          vm.multipleBinList.splice(index, 1);
          if (vm.multipleBinList.length === 0) {
            blankObjForAddBinName();

            $timeout(() => {
              setFocus('binName_0');
            });
          } else {
            setFocus(stringFormat('binName_{0}', vm.multipleBinList.length - 1));
           }
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Check Form Dirty state on state change and reload browser
    angular.element(document).ready(()=>   {
      BaseService.currentPagePopupForm = [vm.binForm];
      if (vm.objWHAdd.warehouseId) {
        if (vm.binForm.binFrom) {
          vm.binForm.binFrom.$setDirty(true);
        }
      }
    });
  }
})();
