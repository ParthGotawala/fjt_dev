(function () {
  'use strict';
  angular
    .module('app.transaction.rack')
    .controller('RackAddUpdatePopupController', RackAddUpdatePopupController);

  function RackAddUpdatePopupController($rootScope, $timeout, $mdDialog, CORE, data, RackFactory, BaseService, TRANSACTION, DialogFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.rackGenerate = TRANSACTION.binGenerate;
    vm.rackGenerateMethod = TRANSACTION.binGenerateMethod;
    vm.rackPrefixMethod = TRANSACTION.binPrefixMethod;
    vm.transaction = TRANSACTION;
    vm.multipleRackList = [];

    //initialize vm.rack with default values
    vm.rack = {
      isActive: true,
      isSingleRack: true,
      isRange: false,
      isRackPrefix: true
    }

    //Radio button group array for Active/Inactive
    vm.RadioGroup = {
      isActive: {
        array: CORE.ActiveRadioGroup
      }
    }

    //if popup is used for update Rack data, than it will use sent data with Dialog
    if (data && data.id) {
      vm.rack = angular.copy(data);
      vm.rack.isSingleRack = true;
      vm.rackCopy = _.clone(vm.rack);
      vm.checkDirtyObject = {
        columnName: ["name", "isActive"],
        oldModelName: vm.rackCopy,
        newModelName: vm.rack
      }
    }

    //call when radio button value change for Rack Generate => Single/Multiple
    vm.changeRackGenerate = () => {
      vm.rack.name = null;
      vm.rack.rackFrom = null;
      vm.rack.rackTo = null;
      vm.rack.prefix = null;
      vm.multipleRackList = [];
      blankObjForAddRackName();
      if (vm.rack.isSingleRack) {
        vm.rack.isRange = false;
        vm.rackForm.rackFrom.$setValidity("minvalue", true);
      }
    }

    //call when radio button value change for Rack Generate Method => Range/Manual
    vm.changeRackGenerateMethod = () => {
      vm.rack.prefix = null;
      if (vm.rack.isRange) {
        vm.multipleRackList = [];
        blankObjForAddRackName();
      } else {
        vm.rack.rackFrom = null;
        vm.rack.rackTo = null;
        vm.rackForm.rackFrom.$setValidity("minvalue", true);
      }
    }

    //call when save button will click
    vm.saveRack = () => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.rackForm)) {
        vm.saveBtnDisableFlag = false;
        return;
      }

      //if Rack Generate => Single
      if (vm.rack.isSingleRack) {
        let checkUnique = vm.checkNameUnique;
        if (!checkUnique) {
          return;
        }

        //if update any Rack
        if (vm.rack && vm.rack.id) {
          vm.cgBusyLoading = RackFactory.getRack().update({
            id: vm.rack.id,
          }, vm.rack).$promise.then((res) => {
            if (res && res.userMessage) {
              vm.saveBtnDisableFlag = false;
              vm.rackForm.$setPristine();
              BaseService.currentPagePopupForm = [];
              $mdDialog.cancel(res.userMessage);
            } else {
              if (checkResponseHasCallBackFunctionPromise(res)) {
                res.alretCallbackFn.then(() => {
                  setFocus('name');
                });
              }
              vm.saveBtnDisableFlag = false;
            }
          }).catch((error) => {
            vm.saveBtnDisableFlag = false;
            return BaseService.getErrorLog(error);
          });
        }
        //if creating single Rack only
        else {
          vm.cgBusyLoading = RackFactory.createRack().save(vm.rack).$promise.then((res) => {
            if (res && res.userMessage) {
              vm.saveBtnDisableFlag = false;
              vm.rackForm.$setPristine();
              BaseService.currentPagePopupForm = [];
              $mdDialog.cancel(res.userMessage);
            } else {
              if (checkResponseHasCallBackFunctionPromise(res)) {
                res.alretCallbackFn.then(() => {
                  setFocus('name');
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
      //if Rack Generate => Multiple
      else {
        //if generate multiple Racks with Range
        if (vm.rack.isRange) {
          if ((vm.rackFromString && vm.rackFromString.length > 10) || (vm.rackToString && vm.rackToString.length > 10)) {
            let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.LENGTH_CANNOT_GREATER);
            messageContent.message = stringFormat(messageContent.message, 'Rack name', '10');
            let obj = {
              messageContent: messageContent
            };
            return DialogFactory.messageAlertDialog(obj).then((yes) => {
              if (yes) {
                if (vm.rackFromString.length > 10) {
                  setFocus('rackFrom');
                }
                else {
                  setFocus('rackTo');
                }
                vm.saveBtnDisableFlag = false;
              }
            }).catch((error) => {
              vm.saveBtnDisableFlag = false;
              return BaseService.getErrorLog(error);
            });
          }

          let count = (parseInt(vm.rack.rackTo || 0) - parseInt(vm.rack.rackFrom || 0)) + 1;
          let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RACK_COUNT);
          messageContent.message = stringFormat(messageContent.message, count);
          let obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            let rackInfo = {
              id: vm.rack.id ? vm.rack.id : null,
              prefix: vm.rack.isRackPrefix ? (vm.rack.prefix ? vm.rack.prefix.toUpperCase() : '') : '',
              suffix: vm.rack.isRackPrefix ? '' : (vm.rack.prefix ? vm.rack.prefix.toUpperCase() : ''),
              isActive: vm.rack.isActive ? vm.rack.isActive : false,
              rackFrom: vm.rack.rackFrom ? vm.rack.rackFrom : null,
              rackTo: vm.rack.rackTo ? vm.rack.rackTo : null,
              isDuplicate: false,
            }
            vm.cgBusyLoading = RackFactory.generateRack().save(rackInfo).$promise.then((res) => {
              if (res && res.data) {
                vm.saveBtnDisableFlag = false;
                rackInfo.Type = TRANSACTION.TypeWHBin.Rack;
                res.data.push(rackInfo);
                DialogFactory.dialogService(
                  TRANSACTION.DUPLICATE_WAREHOUSE_BIN_CONTROLLER,
                  TRANSACTION.DUPLICATE_WAREHOUSE_BIN_VIEW,
                  event,
                  res.data).then(() => {

                  }, (warehouse_bin_rack) => {
                    if (warehouse_bin_rack) {
                      vm.rackForm.$setPristine();
                      BaseService.currentPagePopupForm = [];
                      $mdDialog.cancel(true);
                    }
                  }, (err) => {
                    return BaseService.getErrorLog(err);
                  });
              }
              else if (checkResponseHasCallBackFunctionPromise(res)) {
                res.alretCallbackFn.then(() => {
                  setFocus('rackFrom');
                });
                vm.saveBtnDisableFlag = false;
              }
              else {
                vm.rackForm.$setPristine();
                BaseService.currentPagePopupForm = [];
                $mdDialog.cancel(true);
              }
            }).catch((error) => {
              vm.saveBtnDisableFlag = false;
              return BaseService.getErrorLog(error);
            });
          }, (cancel) => {
            vm.saveBtnDisableFlag = false;
            return;
          }).catch((error) => {
            vm.saveBtnDisableFlag = false;
            return BaseService.getErrorLog(error);
          });
        }
        //if generate multiple Racks Manually
        else {
          let rackInfo = {
            isActive: vm.rack.isActive ? vm.rack.isActive : false,
            multipleRackList: vm.multipleRackList,
            isDuplicate: false,
          }

          vm.cgBusyLoading = RackFactory.generateMultipleRack().save(rackInfo).$promise.then((res) => {
            if (res && res.data) {
              vm.saveBtnDisableFlag = false;
              rackInfo.Type = TRANSACTION.TypeWHBin.Rack;
              res.data.push(rackInfo);
              DialogFactory.dialogService(TRANSACTION.DUPLICATE_WAREHOUSE_BIN_CONTROLLER, TRANSACTION.DUPLICATE_WAREHOUSE_BIN_VIEW, event, res.data)
                .then(() => {
                }, (warehouse_bin_rack) => {
                  if (warehouse_bin_rack) {
                    vm.rackForm.$setPristine();
                    BaseService.currentPagePopupForm = [];
                    $mdDialog.cancel(true);
                  }
                }, (err) => {
                  return BaseService.getErrorLog(err);
                });
            }
            else if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                setFocus(stringFormat('rackName_{0}', vm.multipleRackList.length - 1));
              });
              vm.saveBtnDisableFlag = false;
            }
            else {
              vm.rackForm.$setPristine();
              BaseService.currentPagePopupForm = [];
              $mdDialog.cancel(true);
            }
          }).catch((error) => {
            vm.saveBtnDisableFlag = false;
            return BaseService.getErrorLog(error);
          });
        }
      }
    }

    //if Cancel button click or close popup
    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.rackForm, vm.checkDirtyObject);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        vm.rackForm.$setPristine();
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    //check if form is dirty or not
    vm.checkFormDirty = (form, columnName) => {
      return BaseService.checkFormDirty(form, columnName);
    }

    //Check if Rack name length is reach to max(10) or not for max length validation
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }

    // Check if Rack name already exist or not in Database
    let checkNameAlreadyExistForMultipleRack = (index) => {
      let rackName = vm.multipleRackList[index].name;
      let objs = {
        id: vm.rack && vm.rack.id ? vm.rack.id : 0,
        name: rackName
      };
      RackFactory.checkNameAlreadyExist().query({ objs: objs }).$promise.then((res) => {
        if (res && res.data) {
          let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_UNIQUE);
          messageContent.message = stringFormat(messageContent.message, 'Rack', rackName);
          let obj = {
            messageContent: messageContent
          };
          return DialogFactory.messageAlertDialog(obj).then((yes) => {
            if (yes) {
              vm.multipleRackList[index].callEnter = false;
              vm.multipleRackList[index].name = null;
              setFocus(stringFormat('rackName_{0}', index));
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        } else {
          if (vm.multipleRackList[index].callEnter == true) {
            blankObjForAddRackName();
            $timeout(function () {
              setFocus(stringFormat('rackName_{0}', vm.multipleRackList.length - 1));
            }, true);
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    //Check if Rack name exist or not at blur event of input
    vm.checkNameAlreadyExist = (columnName) => {
      if (vm.rack && vm.rack.name) {
        let objs = {
          id: vm.rack.id,
          name: vm.rack.name
        };

        vm.cgBusyLoading = RackFactory.checkNameAlreadyExist().query({ objs: objs }).$promise.then((res) => {
          if (res && res.data) {
            vm.cgBusyLoading = false;
            let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_UNIQUE);
            messageContent.message = stringFormat(messageContent.message, 'Rack', vm.rack.name);
            let obj = {
              messageContent: messageContent
            };
            return DialogFactory.messageAlertDialog(obj).then((yes) => {
              if (yes) {
                vm.rack[columnName] = null;
                setFocus('name');
              }
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }

    //generating string for Showing rack name for Rack Generate Method => Range
    //e.g, A-1 To A-10
    vm.genString = () => {
      let preString = vm.rack.prefix ? vm.rack.prefix.toUpperCase() : null;
      if (!preString) {
        vm.rackFromString = vm.rack.rackFrom ? vm.rack.rackFrom : '';
        vm.rackToString = vm.rack.rackTo ? vm.rack.rackTo : '';
      } else {
        var generatedRackFormat = '{1}{0}';
        if (vm.rack.isRackPrefix) {
          generatedRackFormat = '{0}{1}';
        }
        vm.rackFromString = stringFormat(generatedRackFormat, preString ? preString : '', vm.rack.rackFrom ? vm.rack.rackFrom : '');
        vm.rackToString = stringFormat(generatedRackFormat, preString ? preString : '', vm.rack.rackTo ? vm.rack.rackTo : '');
      }
    };

    //Check if previously added Rack name is duplicate or not in current popup
    //for Rack Generate => Multiple & Rack Generate Method => Manually 
    vm.checkDuplicatRandomRack = (index, item, e) => {
      let findDuplicateValue = {};
      if (item) {
        findDuplicateValue = item;
      } else {
        findDuplicateValue = _.find(vm.multipleRackList, (data, i) => {
          return data.name == vm.multipleRackList[index].name && i != index;
        });
      }
      if (findDuplicateValue && findDuplicateValue.name) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_UNIQUE);
        messageContent.message = stringFormat(messageContent.message, 'Rack', findDuplicateValue.rackPrefix ? stringFormat('{0}{1}', findDuplicateValue.rackPrefix, findDuplicateValue.name) : findDuplicateValue.name);
        let obj = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(obj).then((yes) => {
          if (yes) {
            vm.multipleRackList[index].callEnter = false;
            vm.multipleRackList[index].name = null;
            setFocus(stringFormat('rackName_{0}', index));
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else {
        checkNameAlreadyExistForMultipleRack(index);
      }
    }

    //Remove manually added Rack from list with confirmation
    vm.removeRack = (index) => {
      let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
      messageContent.message = stringFormat(messageContent.message, "Rack", 1);
      let obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (index > 0) {
            vm.multipleRackList[index - 1].callEnter = false;
          }
          vm.multipleRackList.splice(index, 1);
          if (vm.multipleRackList.length == 0) {
            blankObjForAddRackName();
          } else {
            setFocus(stringFormat('rackName_{0}', vm.multipleRackList.length - 1));
          }
        }
      }, (cancel) => {
        //do nothing if cancel button click
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.changeTextNickname = () => {
      if (vm.rack.prefix) {
        vm.genString();
      } else {
        vm.rack.name = null;
      }
    }

    //Generate empty Rack and add into array when press enter 
    //for Rack Generate => Multiple & Rack Generate Method => Manually 
    let blankObjForAddRackName = () => {
      let obj = {
        name: null,
        callEnter: false
      };
      vm.multipleRackList.push(obj);
    }

    //Check if Rack name exist or not
    //If not exist than add to array to send while save
    vm.checkAndAddRackName = (index, e) => {
      let findEmptyName = _.find(vm.multipleRackList, (data) => { return !data.name });
      if (findEmptyName) {
        let findIndex = _.findIndex(vm.multipleRackList, findEmptyName);
        setFocus(stringFormat('rackName_{0}', findIndex > -1 ? findIndex : null));
      } else {
        if (index == vm.multipleRackList.length - 1) {
          let findDuplicateValue = _.find(vm.multipleRackList, (data, i) => {
            if (i != index) {
              return data.name == vm.multipleRackList[index].name
            }
          });
          if (findDuplicateValue) {
            vm.checkDuplicatRandomRack(index, findDuplicateValue, e);
          } else {
            checkNameAlreadyExistForMultipleRack(index);
          }
        } else {
          setFocus(stringFormat('rackName_{0}', index + 1));
        }
      }
    }

    //Check if Rack name is unique or not in Database
    vm.checkNameUnique = () => {
      if (vm.rack.name) {
        let rackName = vm.rack.name ? vm.rack.name : null;
        let objs = {
          id: vm.rack && vm.rack.id ? vm.rack.id : 0,
          name: rackName
        };
        RackFactory.checkNameAlreadyExist().query({ objs: objs }).$promise.then((res) => {
          if (res && res.data) {
            let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_UNIQUE);
            messageContent.message = stringFormat(messageContent.message, 'Rack', rackName);
            let obj = {
              messageContent: messageContent
            };
            return DialogFactory.messageAlertDialog(obj).then((yes) => {
              if (yes) {
                vm.rack.name = null;
                setFocus('name');
              }
              return false;
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          } else {
            return true;
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      return true;
    }

    //Use when press enter in Rack name
    vm.addRack = (e, index) => {
      //$timeout(function () {
      if (e.keyCode == 13) {
        e.preventDefault();
        vm.multipleRackList[index].callEnter = true;
        vm.checkAndAddRackName(index, e);
      }
      //});
      preventInputEnterKeyEvent(event);
    };

    //Validation => To value must be greater than From value
    //for Rack Generate => Multiple & Rack Generate Method => Range 
    vm.checkToFromValue = () => {
      if (vm.rack.rackFrom && vm.rack.rackTo) {
        if (parseInt(vm.rack.rackFrom || 0) > parseInt(vm.rack.rackTo || 0)) {
          vm.rackForm.rackFrom.$setDirty(true);
          vm.rackForm.rackFrom.$touched = true;
          vm.rackForm.rackFrom.$setValidity("minvalue", false);
        } else {
          vm.rackForm.rackFrom.$setValidity("minvalue", true);
        }
      }
      vm.genString();
    }

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.rackForm];
    });
  }
})();
