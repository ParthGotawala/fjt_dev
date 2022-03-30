(function () {
  'use strict';
  angular
    .module('app.workorder.workorders')
    .controller('WorkorderOperationFirstArticleController', WorkorderOperationFirstArticleController);

  /** @ngInject */
  function WorkorderOperationFirstArticleController($scope, $timeout, CORE, WORKORDER,
    BaseService, WorkorderOperationFactory, WorkorderOperationFirstPieceFactory,
    WorkorderSerialMstFactory, DialogFactory) {
    // Don't Remove this code
    // Don't add any code before this
    $scope.vm = $scope.$parent.$parent.vm;
    //Add form name for check form dirty
    $scope.vm.CurrentForm = 'FirstArticleForm';
    let vm = $scope.vm;
    // add code after this only
    // Don't Remove this code

    vm.WOSerialNoFilterType = CORE.WorkorderSerialNumberFilterType;
    vm.selectedSerialFilterValue = 'SerialNumber';
    vm.WoOpFirstArticleStatus = CORE.WorkOrderOperationFirstArticleStatus;
    vm.DefaultCurrentStatus = CORE.WorkOrderOperationFirstArticleStatus[2].Value;
    vm.operation.firstPcsStatus = vm.operation.firstPcsStatus ? vm.operation.firstPcsStatus : vm.DefaultCurrentStatus;
    vm.SERIALS_MORETHAN_BUILD_QTY_MSG = WORKORDER.SERIALS_MORETHAN_BUILD_QTY_MSG;
    vm.WorkorderSerialNumberSelectionType = CORE.WorkorderSerialNumberSelectionType;
    vm.DateTimeFormat = _dateTimeDisplayFormat;
    vm.LabelConstant = CORE.LabelConstant;
    vm.assyDateCodeFormats = CORE.AssyDateCodeFormats;
    vm.isAllExpanded = false;
    vm.PREFIX_OR_SUFFIX_REQUIRED_MESSAGE = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PREFIX_OR_SUFFIX_REQUIRED_MESSAGE;
    vm.EmptyMesssageForFirstArticleSerials = WORKORDER.WORKORDER_EMPTYSTATE.FIRST_ARTICLE;
    vm.FirstArticleAddSerialMethodConst = angular.copy(WORKORDER.FirstArticleAddSerialMethod);
    vm.addSerialMethod = vm.FirstArticleAddSerialMethodConst.GenerateNew;

    const WoStatusConst = angular.copy(CORE.WoStatus);
    const woSubStatusDet = _.find(WoStatusConst, (item) => item.ID === vm.operation.workorder.woSubStatus);

    // Restrict changes into all fields if work order status is 'under termination'
    //vm.isWOUnderTermination = (vm.operation.workorder.woStatus == CORE.WOSTATUS.UNDER_TERMINATION || vm.operation.workorder.woStatus == CORE.WOSTATUS.TERMINATED);
    //vm.RadioGroup = {
    //  prefixorSuffix: {
    //    array: CORE.WorkOrderPrefixorSuffix
    //  }
    //}

    const initFirstPieceModel = () => {
      vm.woOpFirstPieceModel = {
        //prefixorsuffix: true,
        //Presuffix: null,
        noofDigit: null,
        numOfSerialsToGenerate: null,
        dateCode: null,
        dateCodeFormat: null
      };
    };
    initFirstPieceModel();

    // get wo op first piece created serials
    vm.getWorkorderOperationFirstPiece = () => {
      const woOpdetails = {
        woID: vm.operation.woID,
        woopID: vm.operation.woOPID,
        isRequireToGetAnyOneSerialDet: !vm.operation.workorder.isOperationTrackBySerialNo && !vm.operation.isTrackBySerialNo
      };
      vm.cgBusyLoading = WorkorderOperationFirstPieceFactory.retriveWorkorderOperationFirstPieceByWoOp().query(woOpdetails).$promise
        .then((res) => {
          if (res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data) {
            vm.workorderOperationFirstPieceList = res.data.workorderFirstPieceSerialsList;
            if (vm.workorderOperationFirstPieceList.length > 0) {
              //vm.workorderOperationFirstPieceList[0].isShow = true;
              //vm.woOpFirstPieceModel.prefixorsuffix = vm.workorderOperationFirstPieceList[0].prefixorsuffix;
              //vm.isDisablePrefixorSuffix = true;
              //vm.woOpFirstPieceModel.Presuffix = vm.workorderOperationFirstPieceList[0].Presuffix;
              vm.woOpFirstPieceModel.prefix = vm.workorderOperationFirstPieceList[0].prefix;
              vm.woOpFirstPieceModel.suffix = vm.workorderOperationFirstPieceList[0].suffix;
              vm.isDisablePreSuffix = true;
              vm.woOpFirstPieceModel.noofDigit = vm.workorderOperationFirstPieceList[0].noofDigit;
              vm.isDisableNoOfDigit = true;
              const maxNumber = Math.max.apply(Math, vm.workorderOperationFirstPieceList.map((o) => o.serialIntVal));
              vm.woOpFirstPieceModel.startNumber = maxNumber + 1;
            }
            else if (!vm.operation.workorder.isOperationTrackBySerialNo && !vm.operation.isTrackBySerialNo && res.data.anyOneAddedSerialDet) {
              vm.woOpFirstPieceModel.prefix = res.data.anyOneAddedSerialDet.prefix;
              vm.woOpFirstPieceModel.suffix = res.data.anyOneAddedSerialDet.suffix;
              vm.isDisablePreSuffix = true;
              vm.woOpFirstPieceModel.noofDigit = res.data.anyOneAddedSerialDet.noofDigit;
              vm.isDisableNoOfDigit = true;
            }
            else {
              //vm.isDisablePrefixorSuffix = false;
              vm.isDisablePreSuffix = false;
              vm.isDisableNoOfDigit = false;
            }
            if ((vm.operation.workorder && vm.operation.workorder.isOperationTrackBySerialNo) || vm.operation.isTrackBySerialNo) {
              getAllWorkorderSerialsByWoID();
            }
            checkResetSerialsAllowed();
            checkAllowedNoOfSerialsToAdd();
          }
        }).catch((error) => BaseService.getErrorLog(error));
    };

    const checkResetSerialsAllowed = () => {
      const existsTranSerial = _.find(vm.workorderOperationFirstPieceList, (item) => item.workorderTransFirstPcsDet);
      vm.checkResetSerialsAllowed = existsTranSerial ? false : true;
    };

    // to display start and end serial number
    vm.GenerateStartEndNumber = () => {
      var noofDigit = vm.woOpFirstPieceModel && vm.woOpFirstPieceModel.noofDigit ? vm.woOpFirstPieceModel.noofDigit : 0;
      var numOfSerialsToGenerate = vm.woOpFirstPieceModel && vm.woOpFirstPieceModel.numOfSerialsToGenerate ? vm.woOpFirstPieceModel.numOfSerialsToGenerate : 0;
      var startNumber = vm.woOpFirstPieceModel && vm.woOpFirstPieceModel.startNumber ? vm.woOpFirstPieceModel.startNumber : 0;

      var number = startNumber.toString().padStart(noofDigit, 0);
      var endNumber = (startNumber + (numOfSerialsToGenerate - (numOfSerialsToGenerate ? 1 : 0))).toString().padStart(noofDigit, 0);
      var prefix = vm.woOpFirstPieceModel && vm.woOpFirstPieceModel.prefix ? vm.woOpFirstPieceModel.prefix : '';
      var suffix = vm.woOpFirstPieceModel && vm.woOpFirstPieceModel.suffix ? vm.woOpFirstPieceModel.suffix : '';

      vm.startNumber = prefix + number + suffix;
      vm.endNumber = prefix + endNumber + suffix;
    };

    // check added assembly date code is valid or not
    vm.checkAssyDateCode = () => {
      var isValid = false;
      isValid = !BaseService.validateDateCode(vm.woOpFirstPieceModel.dateCodeFormat, vm.woOpFirstPieceModel.dateCode);
      vm.FirstArticleAddSerialForm.dateCode.$setValidity('invalidDateCode', isValid);
    };

    /* generate workorder_operation_firstpiece serials and add into table */
    vm.generateWoOpFirstPieceSerials = () => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }

      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.FirstArticleAddSerialForm)) {
        vm.saveDisable = false;
        return;
      }

      vm.woOpFirstPieceModel.suffix = vm.woOpFirstPieceModel.suffix ? vm.woOpFirstPieceModel.suffix.trim() : vm.woOpFirstPieceModel.suffix;
      vm.woOpFirstPieceModel.prefix = vm.woOpFirstPieceModel.prefix ? vm.woOpFirstPieceModel.prefix.trim() : vm.woOpFirstPieceModel.prefix;

      if (!vm.woOpFirstPieceModel.suffix && !vm.woOpFirstPieceModel.prefix) {
        const model = {
          messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PREFIX_OR_SUFFIX_REQUIRED_MESSAGE),
          multiple: true
        };
        vm.saveDisable = false;
        DialogFactory.messageAlertDialog(model);
        return;
      }

      const totalSerialToApply = parseInt(vm.woOpFirstPieceModel.numOfSerialsToGenerate) + parseInt(vm.totalSourceDataCount || 0);
      if ((totalSerialToApply.toString()).length > vm.woOpFirstPieceModel.noofDigit) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WORKORDER_SERIAL_VALIDATION);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        vm.saveDisable = false;
        DialogFactory.messageAlertDialog(model);
        return;
      }
      else {
        const defaultValue = '9';
        const endRangeLimit = parseInt(defaultValue.padStart(vm.woOpFirstPieceModel.noofDigit, 9));
        const noofDigit = vm.woOpFirstPieceModel && vm.woOpFirstPieceModel.noofDigit ? vm.woOpFirstPieceModel.noofDigit : 0;
        const numOfSerialsToGenerate = vm.woOpFirstPieceModel && vm.woOpFirstPieceModel.numOfSerialsToGenerate ? vm.woOpFirstPieceModel.numOfSerialsToGenerate : 0;
        const startNumber = vm.woOpFirstPieceModel && vm.woOpFirstPieceModel.startNumber ? vm.woOpFirstPieceModel.startNumber : 0;

        const endnumber = (startNumber + (numOfSerialsToGenerate - (numOfSerialsToGenerate ? 1 : 0))).toString().padStart(noofDigit, 0);

        if (endnumber > endRangeLimit) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SERIAL_NO_LIMIT_EXISTS);
          messageContent.message = stringFormat(messageContent.message, endRangeLimit + 1, vm.woOpFirstPieceModel.noofDigit);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          vm.saveDisable = false;
          DialogFactory.messageAlertDialog(model);
          return;
        }
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SERIAL_NUMBER_COUNT);
        messageContent.message = stringFormat(messageContent.message, vm.woOpFirstPieceModel.numOfSerialsToGenerate, vm.startNumber, vm.endNumber);
        const modelAlert = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
          multiple: true
        };
        return DialogFactory.messageConfirmDialog(modelAlert).then(() => {
          const firstpieceSerialInfo = {
            woID: vm.operation.woID,
            opID: vm.operation.opID,
            woopID: vm.operation.woOPID,
            //prefixorsuffix: vm.woOpFirstPieceModel.prefixorsuffix,
            //Presuffix: vm.woOpFirstPieceModel.Presuffix,
            dateCode: vm.woOpFirstPieceModel.dateCode,
            noofDigit: vm.woOpFirstPieceModel.noofDigit,
            numOfSerialsToGenerate: vm.woOpFirstPieceModel.numOfSerialsToGenerate,
            currStatus: vm.woOpFirstPieceModel.currStatus ? vm.woOpFirstPieceModel.currStatus : vm.DefaultCurrentStatus,
            buildQty: vm.operation.workorder.buildQty,
            woNumber: vm.operation.workorder.woNumber,
            opName: vm.operation.opName,
            dateCodeFormat: vm.woOpFirstPieceModel.dateCodeFormat && vm.woOpFirstPieceModel.dateCodeFormat !== null ? vm.woOpFirstPieceModel.dateCodeFormat : null,
            prefix: vm.woOpFirstPieceModel.prefix,
            suffix: vm.woOpFirstPieceModel.suffix,
            startNumber: vm.woOpFirstPieceModel.startNumber
            //customerID: vm.operation.workorder.customerID,
          };

          vm.cgBusyLoading = WorkorderOperationFirstPieceFactory.workorder_operation_firstpiece().save(firstpieceSerialInfo).$promise.then((res) => {
            if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.getWorkorderOperationFirstPiece();
              vm.woOpFirstPieceModel.numOfSerialsToGenerate = '';
              vm.startNumber = null;
              vm.endNumber = null;
              vm.FirstArticleAddSerialForm.$setPristine();
              vm.FirstArticleAddSerialForm.$setUntouched();
              if (res.data && res.data.woOPExistsFirstArticleSerials && res.data.woOPExistsFirstArticleSerials.length > 0) {
                const existsSerialsData = res.data.woOPExistsFirstArticleSerials;
                displayWOOPAlreadyAddedSerials(existsSerialsData, null);
              }
            }
            // when serial no already added in current/other wo op
            else if (res.status === CORE.ApiResponseTypeStatus.FAILED && res.errors && res.errors.data
              && res.errors.data.woOPExistsFirstArticleSerials && res.errors.data.woOPExistsFirstArticleSerials.length > 0) {
              const existsSerialsData = res.errors.data.woOPExistsFirstArticleSerials;
              displayWOOPAlreadyAddedSerials(existsSerialsData, null);
            }
            vm.saveDisable = false;
          }).catch((error) => {
            vm.saveDisable = false;
            return BaseService.getErrorLog(error);
          });
        }, () => {
          vm.saveDisable = false;
          return;
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
    };

    // to display already added serials
    const displayWOOPAlreadyAddedSerials = (existsSerialsData, callbackFunWithArguments) => {
      _.each(existsSerialsData, (serialItem) => {
        serialItem.workorderOperation = {};
        serialItem.workorderOperation.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT,
          vm.operation.opName, vm.operation.opNumber);
      });

      const data = {
        woOPFirstArticleAddedSerialNoList: existsSerialsData
      };

      DialogFactory.dialogService(
        WORKORDER.WOOP_FIRST_ARTICLE_ALREADY_ADDED_SERIALS_MODAL_CONTROLLER,
        WORKORDER.WOOP_FIRST_ARTICLE_ALREADY_ADDED_SERIALS_MODAL_VIEW,
        event,
        data).then(() => {
          if (callbackFunWithArguments && callbackFunWithArguments.functionName) {
            callbackFunWithArguments.functionName(callbackFunWithArguments.argu1);
          }
        }, () => {
          if (callbackFunWithArguments && callbackFunWithArguments.functionName) {
            callbackFunWithArguments.functionName(callbackFunWithArguments.argu1);
          }
        }).catch((error) => BaseService.getErrorLog(error));
    };

    const checkAllowedNoOfSerialsToAdd = () => {
      vm.allowedSerialsToAdd = parseInt(vm.operation.workorder.buildQty) - vm.workorderOperationFirstPieceList.length;
    };


    const getAllWorkorderSerialsByWoID = () => WorkorderSerialMstFactory.getAllWorkorderSerialsByWoID().query({ woID: vm.operation.woID }).$promise
      .then((res) => {
        if (res && res.data) {
          vm.workorderSerialsList = res.data.workorderSerialsList;
          //removeAddedSerialsFromWOSerialList();
          //if (!vm.autoCompleteWorkorderFromSerialsDetail) {
          //  initAutoCompleteForWorkorderSerials();
          //}
        }
      }).catch((error) => BaseService.getErrorLog(error));

    //let removeAddedSerialsFromWOSerialList = () => {
    //  if (vm.workorderSerialsList.length > 0 && vm.workorderOperationFirstPieceList.length > 0) {
    //    _.each(vm.workorderOperationFirstPieceList, (item) => {
    //      _.some(vm.workorderSerialsList, (obj) => {
    //        if (obj.SerialNo == item.serialno) {
    //          return _.remove(vm.workorderSerialsList, (itemtoremove) => {
    //            return obj == itemtoremove;
    //          });
    //        }
    //      });
    //    });
    //  }
    //}

    vm.changeselectedSerialFilterValue = () => {
      vm.ToSerialNumber = null;
      vm.serialNumber = null;
      vm.Qty = null;
      vm.fromSerialNoDetail = null;
      vm.toSerialNoDetail = null;
      if (vm.selectedSerialFilterValue === vm.WOSerialNoFilterType.Range) {
        vm.selectedRangeValue = vm.WorkorderSerialNumberSelectionType.RangeType.Range;
      }
    };

    // while adding work order serials to first wo op article
    vm.AddSerialNo = () => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }

      const PreSuffixArray = [];
      let woSerialsMatchingList = [];
      if (vm.selectedSerialFilterValue === vm.WOSerialNoFilterType.SerialNumber) {
        if (!vm.fromSerialNoDetail || vm.fromSerialNoDetail.SerialNo !== vm.serialNumber) {
          enterProperDetailToFilter();
          return;
        } else {
          woSerialsMatchingList = vm.workorderSerialsList.filter((obj) => vm.serialNumber === obj.SerialNo);
        }
      }
      else if (vm.selectedSerialFilterValue === vm.WOSerialNoFilterType.Range) {
        if (vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.Range) {
          if (vm.fromSerialNoDetail && vm.fromSerialNoDetail.SerialNo === vm.serialNumber
            && vm.toSerialNoDetail && vm.toSerialNoDetail.SerialNo === vm.ToSerialNumber) {
            const prefix = vm.workorderSerialsList[0].prefix ? vm.workorderSerialsList[0].prefix : '';
            const suffix = vm.workorderSerialsList[0].suffix ? vm.workorderSerialsList[0].suffix : '';

            const startSerialDetail = vm.workorderSerialsList.find((a) => a.SerialNo === vm.serialNumber);
            const endSerialDetail = vm.workorderSerialsList.find((a) => a.SerialNo === vm.ToSerialNumber);

            let startFromNum = startSerialDetail ? startSerialDetail.serialIntVal : 0;
            const endToNum = endSerialDetail ? endSerialDetail.serialIntVal : 0;

            if (parseInt(startFromNum) > parseInt(endToNum)) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.TO_SERIAL_NOT_VALID);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model);
              return;
            }
            for (let i = startFromNum; i <= endToNum; i++) {
              const serialno = prefix + generateSerial((startFromNum++) + '', vm.workorderSerialsList[0].noofDigit) + suffix;
              PreSuffixArray.push(serialno);
            }
            woSerialsMatchingList = vm.workorderSerialsList.filter((obj) => PreSuffixArray.indexOf(obj.SerialNo) !== -1);
          }
          else {
            enterProperDetailToFilter();
            return;
          }
        }
        else if (vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.QtyRange) {
          if (vm.fromSerialNoDetail && vm.fromSerialNoDetail.SerialNo === vm.serialNumberQty && vm.Qty) {
            const prefix = vm.workorderSerialsList[0].prefix ? vm.workorderSerialsList[0].prefix : '';
            const suffix = vm.workorderSerialsList[0].suffix ? vm.workorderSerialsList[0].suffix : '';

            const serialDetail = vm.workorderSerialsList.find((a) => a.SerialNo === vm.serialNumberQty);
            if (serialDetail) {
              let startFromNum = serialDetail.serialIntVal;
              for (let i = 1; i <= vm.Qty; i++) {
                const serialno = prefix + generateSerial((startFromNum++) + '', vm.workorderSerialsList[0].noofDigit) + suffix;
                PreSuffixArray.push(serialno);
              }
              woSerialsMatchingList = vm.workorderSerialsList.filter((obj) => PreSuffixArray.indexOf(obj.SerialNo) !== -1);
            }
          }
          else {
            enterProperDetailToFilter();
            return;
          }
        }
      }

      if (woSerialsMatchingList.length > 0) {
        const woOpFirstPieceSerialList = [];
        _.each(woSerialsMatchingList, (item) => {
          const _obj = {};
          _obj.woID = vm.operation.woID;
          _obj.opID = vm.operation.opID;
          _obj.woopID = vm.operation.woOPID;
          //_obj.prefixorsuffix = item.PrefixorSuffix;
          //_obj.Presuffix = item.PreSuffix;
          _obj.dateCode = item.dateCode;
          _obj.noofDigit = item.noofDigit;
          _obj.serialno = item.SerialNo;
          _obj.currStatus = vm.DefaultCurrentStatus;
          _obj.dateCodeFormat = item.dateCodeFormat;
          _obj.prefix = item.prefix;
          _obj.suffix = item.suffix;
          _obj.serialIntVal = item.serialIntVal;
          woOpFirstPieceSerialList.push(_obj);
        });

        const woOpObj = {
          woNumber: vm.operation.workorder.woNumber,
          opName: vm.operation.opName,
          woOPID: vm.operation.woOPID
        };

        vm.cgBusyLoading = WorkorderOperationFirstPieceFactory.save_Workorder_Operation_Firstpiece().save({ woOpSerialList: woOpFirstPieceSerialList, woOpObj: woOpObj }).$promise.then((res) => {
          if (res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data) {
            vm.workorderOperationFirstPieceList = res.data.workorderFirstPieceSerialsList;
            //removeAddedSerialsFromWOSerialList();
            checkResetSerialsAllowed();
            checkAllowedNoOfSerialsToAdd();
            if (res.data.woOPExistsFirstArticleSerials && res.data.woOPExistsFirstArticleSerials.length > 0) {
              const existsSerialsData = res.data.woOPExistsFirstArticleSerials;
              const callbackFunWithArguments = {
                functionName: clearAndSetFocusOnScanField,
                argu1: ''
              };
              displayWOOPAlreadyAddedSerials(existsSerialsData, callbackFunWithArguments);
            }
            else {
              clearAndSetFocusOnScanField();
            }
            vm.FirstArticleAddSerialForm.$setPristine();
            vm.FirstArticleAddSerialForm.$setUntouched();
          }
          // when serial no already added in current/other wo op
          else if (res.status === CORE.ApiResponseTypeStatus.FAILED && res.errors && res.errors.data
            && res.errors.data.woOPExistsFirstArticleSerials && res.errors.data.woOPExistsFirstArticleSerials.length > 0) {
            vm.FirstArticleAddSerialForm.$setPristine();
            vm.FirstArticleAddSerialForm.$setUntouched();
            const existsSerialsData = res.errors.data.woOPExistsFirstArticleSerials;
            const callbackFunWithArguments = {
              functionName: clearAndSetFocusOnScanField,
              argu1: ''
            };
            displayWOOPAlreadyAddedSerials(existsSerialsData, callbackFunWithArguments);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.NO_MATCHING_WORKORDER_SERIAL_FOUND);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }
    };

    // if found woOP Exists FirstArticle Serials while scan then clear data and set again focus on input for scan
    const clearAndSetFocusOnScanField = () => {
      if (vm.selectedSerialFilterValue === vm.WOSerialNoFilterType.SerialNumber) {
        vm.serialNumber = null;
        vm.fromSerialNoDetail = null;
        setFocus('scanSerialNumber');
      }
      else if (vm.selectedSerialFilterValue === vm.WOSerialNoFilterType.Range) {
        if (vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.Range) {
          vm.serialNumber = null;
          vm.ToSerialNumber = null;
          vm.fromSerialNoDetail = null;
          vm.toSerialNoDetail = null;
          setFocus('scanSerialNumber');
        }
        else if (vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.QtyRange) {
          vm.serialNumberQty = null;
          vm.Qty = null;
          vm.fromSerialNoDetail = null;
          setFocus('scanSerialNumberforQty');
        }
      }
    };

    const generateSerial = (str, len) => {
      var s = '', c = '0', len = len - str.length;
      while (s.length < len) {
        s += c;
      }
      return s + str;
    };

    const enterProperDetailToFilter = () => {
      var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.ADD_PROPER_DETAILS_TO_FILTER_FIRSTPICE_SERIALS);
      var model = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(model);
      return;
    };

    /* delete all serial# of first piece */
    vm.resetWoOpFirstPiece = () => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }

      const woOpObj = {
        woNumber: vm.operation.workorder.woNumber,
        opName: vm.operation.opName
      };
      vm.cgBusyLoading = WorkorderOperationFirstPieceFactory.deleteWorkorderOperationFirstpiece().delete({
        woID: vm.operation.woID,
        woopID: vm.operation.woOPID,
        woOpObj: woOpObj
      }).$promise.then(() => {
        initFirstPieceModel();
        vm.FirstArticleAddSerialForm.$setPristine();
        vm.FirstArticleAddSerialForm.$setUntouched();
        vm.getWorkorderOperationFirstPiece();
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getWorkorderOperationFirstPiece();

    vm.SaveWorkorderOperationFirstArticle = () => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.FirstArticleForm, false)) {
        vm.saveDisable = false;
        return;
      }

      if (vm.isWOUnderTermination) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.NOT_ALLOWED_FOR_WOSTATUS);
        messageContent.message = stringFormat(messageContent.message, woSubStatusDet.Name);
        const obj = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(obj);
        vm.saveDisable = false;
        return;
      }

      const operationInfo = {
        firstPcsModel: vm.operation.firstPcsModel,
        firstPcsStatus: vm.operation.firstPcsStatus,
        woNumber: vm.operation.workorder.woNumber,
        opName: vm.operation.opName,
        opTypeForWOOPTimeLineLog: CORE.Operations_Type_For_WOOPTimeLineLog.firstPcsDet
      };
      if (vm.operation.woOPID) {
        vm.cgBusyLoading = WorkorderOperationFactory.updateOperation().update({
          id: vm.operation.woOPID
        }, operationInfo).$promise.then(() => {
          vm.FirstArticleForm.$setPristine();
          vm.saveDisable = false;
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
    };

    /* Hide/Show First Piece Section*/
    vm.toggleWOOperation = (item) => {
      item.isShow = !item.isShow;
      const isAnyCollapse = _.some(vm.workorderOperationFirstPieceList, (item) => !item.isShow);
      vm.isAllExpanded = !isAnyCollapse;
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);


    // when change range type serial filter (Range | Qty)
    vm.changeselectedRangeSerialFilterValue = () => {
      vm.ToSerialNumber = null;
      vm.serialNumberQty = null;
      vm.serialNumber = null;
      vm.Qty = null;
      vm.fromSerialNoDetail = null;
      vm.toSerialNoDetail = null;
      vm.isRequiredSerialQtyFilter = (vm.selectedSerialFilterValue === vm.WOSerialNoFilterType.Range && vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.QtyRange) ? true : false;
    };

    // to scan serial number
    vm.scanSerialNumberDetail = (SerialNo, field, e) => {
      if (SerialNo) {
        $timeout(() => {
          scanSerialNumber(SerialNo, field, e);
        }, true);
        /** Prevent enter key submit event */
        preventInputEnterKeyEvent(e);
      }
    };

    const scanSerialNumber = (SerialNo, field, e) => {
      if ((e.keyCode === 13)) {
        vm.cgBusyLoading = WorkorderSerialMstFactory.checkMFGScanSerialValidForFirstArticle().save({
          woID: vm.operation.woID,
          serialNo: SerialNo,
          woOPID: vm.operation.woOPID
        }).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (response.data && response.data.workorderSerialData) { // work order serial data available

              if (response.data.woOPFirstPieceExistsData) { // when serial already added in first piece of operation
                const existsSerialsData = response.data.woOPFirstPieceExistsData; // comes asa object so added as list

                const serialCurrStatus = _.find(vm.WoOpFirstArticleStatus, (statusItem) => statusItem.Value === existsSerialsData.currStatus);

                const fromSerialNoDetailObj = {
                  SerialNo: SerialNo,
                  serialCurrStatusText: serialCurrStatus ? serialCurrStatus.Key : null
                };

                if (vm.selectedSerialFilterValue === vm.WOSerialNoFilterType.Range && vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.Range && field === 'scanToSerialNumber') {
                  vm.toSerialNoDetail = fromSerialNoDetailObj;
                }
                else {
                  vm.fromSerialNoDetail = fromSerialNoDetailObj;
                }
              }
              else { // serial number is valid to add as wo op first article
                if (vm.selectedSerialFilterValue === vm.WOSerialNoFilterType.SerialNumber) {
                  vm.fromSerialNoDetail = {
                    SerialNo: SerialNo,
                    serialCurrStatusText: 'Idle'
                  };
                }
                else if (vm.selectedSerialFilterValue === vm.WOSerialNoFilterType.Range) {
                  if (vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.Range) {
                    if (field === 'scanSerialNumber') {
                      vm.fromSerialNoDetail = {
                        SerialNo: SerialNo,
                        serialCurrStatusText: 'Idle'
                      };
                      setFocus('scanToSerialNumber');
                    } else {
                      vm.toSerialNoDetail = {
                        SerialNo: SerialNo,
                        serialCurrStatusText: 'Idle'
                      };
                    }
                  }
                  else if (vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.QtyRange) {
                    if (field === 'scanSerialNumberforQty') {
                      vm.fromSerialNoDetail = {
                        SerialNo: SerialNo,
                        serialCurrStatusText: 'Idle'
                      };
                      setFocus('Qty');
                    }
                  }
                }
              }
            } else {  // when serial not available in work order serial master
              const model = {
                messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SCAN_VALID_SERIAL_NUMBER),
                multiple: true
              };
              DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  clearInValidScanSerialDataAndFocus(field);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // to scan serial number to add from previous operatiin
    vm.scanSerialNumberToAddFromPrevOP = (SerialNo, field, e) => {
      if (SerialNo) {
        $timeout(() => {
          scanSerialNumberDetToAddFromPrevOP(SerialNo, field, e);
        }, true);
        /** Prevent enter key submit event */
        preventInputEnterKeyEvent(e);
      }
    };

    const scanSerialNumberDetToAddFromPrevOP = (SerialNo, field, e) => {
      if ((e.keyCode === 13)) {
        vm.cgBusyLoading = WorkorderOperationFirstPieceFactory.checkScanSerialExistsOnPrevOPFirstArticle().save({
          woID: vm.operation.woID,
          serialNo: SerialNo,
          currOPNumber: vm.operation.opNumber,
          isWOOPTrackBySerialNoConfiguration: vm.operation.isTrackBySerialNo
        }).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data && response.data.prevOPFirstPieceExistsData) {
            const prevOPFirstPieceExistsDet = response.data.prevOPFirstPieceExistsData;

            const alreadyAddedSerialDet = _.find(vm.workorderOperationFirstPieceList, (serialItem) => serialItem.serialno === prevOPFirstPieceExistsDet.serialno);

            let serialCurrStatus = null;
            if (alreadyAddedSerialDet) {
              serialCurrStatus = _.find(vm.WoOpFirstArticleStatus, (statusItem) => statusItem.Value === alreadyAddedSerialDet.currStatus);
            }

            const fromSerialNoData = {
              SerialNo: SerialNo,
              serialCurrStatusText: serialCurrStatus ? serialCurrStatus.Key : 'Idle',
              prefix: prevOPFirstPieceExistsDet.prefix,
              suffix: prevOPFirstPieceExistsDet.suffix,
              noofDigit: prevOPFirstPieceExistsDet.noofDigit,
              serialIntVal: prevOPFirstPieceExistsDet.serialIntVal,
              dateCode: prevOPFirstPieceExistsDet.dateCode,
              dateCodeFormat: prevOPFirstPieceExistsDet.dateCodeFormat
            };
            if (vm.selectedSerialFilterValue === vm.WOSerialNoFilterType.SerialNumber) {
              vm.fromSerialNoDetail = fromSerialNoData;
            }
            else if (vm.selectedSerialFilterValue === vm.WOSerialNoFilterType.Range) {
              if (vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.Range) {
                if (field === 'scanSerialNumber') {
                  vm.fromSerialNoDetail = fromSerialNoData;
                  setFocus('scanToSerialNumber');
                } else {
                  vm.toSerialNoDetail = fromSerialNoData;
                }
              }
              else if (vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.QtyRange) {
                if (field === 'scanSerialNumberforQty') {
                  vm.fromSerialNoDetail = fromSerialNoData;
                  setFocus('Qty');
                }
              }
            }
          } else if (response && response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors && response.errors.data && response.errors.data.isSerialNotFound) {  // when serial not available in any previous operation first article
            let messageContent = null;
            if (vm.operation.isTrackBySerialNo && response.errors.data.isSerialNoGeneratedByBulkQtyOP) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SCAN_VALID_SERIAL_NUMBER);
            }
            else {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PREV_WO_OP_NOT_CONTAIN_FIRST_ARTICLE_SERIAL);
              messageContent.message = stringFormat(messageContent.message, SerialNo);
            }

            const model = {
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                clearInValidScanSerialDataAndFocus(field);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // called when user pick and add serials that picked from previous operation
    vm.AddSerialNoPickedFromPrevOp = () => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }

      if (!vm.fromSerialNoDetail || (!vm.fromSerialNoDetail.prefix && !vm.fromSerialNoDetail.suffix)
        || !vm.fromSerialNoDetail.noofDigit || !vm.fromSerialNoDetail.serialIntVal) {
        return;
      }

      const woOpFirstPieceSerialList = [];
      if (vm.selectedSerialFilterValue === vm.WOSerialNoFilterType.SerialNumber) {
        if (!vm.fromSerialNoDetail || vm.fromSerialNoDetail.SerialNo !== vm.serialNumber) {
          enterProperDetailToFilter();
          return;
        } else {
          const objSerial = {
            serialno: vm.serialNumber,
            serialIntVal: vm.fromSerialNoDetail.serialIntVal
          };
          woOpFirstPieceSerialList.push(objSerial);
        }
      }
      else if (vm.selectedSerialFilterValue === vm.WOSerialNoFilterType.Range) {
        if (vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.Range) {
          if (vm.fromSerialNoDetail && vm.fromSerialNoDetail.SerialNo === vm.serialNumber
            && vm.toSerialNoDetail && vm.toSerialNoDetail.SerialNo === vm.ToSerialNumber) {
            if (!vm.toSerialNoDetail || (!vm.toSerialNoDetail.prefix && !vm.toSerialNoDetail.suffix)
              || !vm.toSerialNoDetail.noofDigit || !vm.toSerialNoDetail.serialIntVal) {
              return;
            }

            const prefix = vm.fromSerialNoDetail.prefix ? vm.fromSerialNoDetail.prefix : '';
            const suffix = vm.fromSerialNoDetail.suffix ? vm.fromSerialNoDetail.suffix : '';

            const startSerialDetail = vm.fromSerialNoDetail;
            const endSerialDetail = vm.toSerialNoDetail;

            let startFromNum = startSerialDetail ? startSerialDetail.serialIntVal : 0;
            const endToNum = endSerialDetail ? endSerialDetail.serialIntVal : 0;
            let startFromNumCopy = angular.copy(startFromNum);

            if (parseInt(startFromNum) > parseInt(endToNum)) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.TO_SERIAL_NOT_VALID);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model);
              return;
            }
            for (let i = startFromNum; i <= endToNum; i++) {
              const objSerial = {
                serialno: prefix + generateSerial((startFromNum++) + '', vm.fromSerialNoDetail.noofDigit) + suffix,
                serialIntVal: startFromNumCopy++
              };
              woOpFirstPieceSerialList.push(objSerial);
            }
          }
          else {
            enterProperDetailToFilter();
            return;
          }
        }
        else if (vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.QtyRange) {
          if (vm.fromSerialNoDetail && vm.fromSerialNoDetail.SerialNo === vm.serialNumberQty && vm.Qty) {
            const prefix = vm.fromSerialNoDetail.prefix ? vm.fromSerialNoDetail.prefix : '';
            const suffix = vm.fromSerialNoDetail.suffix ? vm.fromSerialNoDetail.suffix : '';

            if (vm.fromSerialNoDetail) {
              let startFromNum = vm.fromSerialNoDetail.serialIntVal;
              let startFromNumCopy = angular.copy(startFromNum);

              for (let i = 1; i <= vm.Qty; i++) {
                const objSerial = {
                  serialno: prefix + generateSerial((startFromNum++) + '', vm.fromSerialNoDetail.noofDigit) + suffix,
                  serialIntVal: startFromNumCopy++
                };
                woOpFirstPieceSerialList.push(objSerial);
              }
            }
          }
          else {
            return enterProperDetailToFilter();
          }
        }
        else {
          enterProperDetailToFilter();
          return;
        }
      }
      else {
        return;
      }

      if (woOpFirstPieceSerialList.length > 0) {
        _.each(woOpFirstPieceSerialList, (item) => {
          item.woID = vm.operation.woID;
          item.opID = vm.operation.opID;
          item.woOPID = vm.operation.woOPID;
          item.dateCode = null;
          item.noofDigit = vm.fromSerialNoDetail.noofDigit;
          item.currStatus = vm.DefaultCurrentStatus;
          item.dateCodeFormat = null;
          item.prefix = vm.fromSerialNoDetail.prefix;
          item.suffix = vm.fromSerialNoDetail.suffix;
        });

        const woOpObj = {
          woNumber: vm.operation.workorder.woNumber,
          opName: vm.operation.opName,
          woOPID: vm.operation.woOPID,
          currOPNumber: vm.operation.opNumber,
          woID: vm.operation.woID,
          isWOOPTrackBySerialNoConfiguration: vm.operation.isTrackBySerialNo
        };

        vm.cgBusyLoading = WorkorderOperationFirstPieceFactory.saveWOOPFirstpieceSerialsPickFromPrevOP().save(
          {
            woOpSerialList: woOpFirstPieceSerialList,
            woOpObj: woOpObj
          }).$promise.then((res) => {
            if (res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data) {
              vm.getWorkorderOperationFirstPiece();
              if (res.data.woOPExistsFirstArticleSerials && res.data.woOPExistsFirstArticleSerials.length > 0) {
                const existsSerialsData = res.data.woOPExistsFirstArticleSerials;
                const callbackFunWithArguments = {
                  functionName: clearAndSetFocusOnScanField,
                  argu1: ''
                };
                displayWOOPAlreadyAddedSerials(existsSerialsData, callbackFunWithArguments);
              }
              else {
                clearAndSetFocusOnScanField();
              }
              vm.FirstArticleAddSerialForm.$setPristine();
              vm.FirstArticleAddSerialForm.$setUntouched();
            }
            // when serial no already added in current/other wo op
            else if (res.status === CORE.ApiResponseTypeStatus.FAILED && res.errors && res.errors.data
              && res.errors.data.woOPExistsFirstArticleSerials && res.errors.data.woOPExistsFirstArticleSerials.length > 0) {
              vm.FirstArticleAddSerialForm.$setPristine();
              vm.FirstArticleAddSerialForm.$setUntouched();
              const existsSerialsData = res.errors.data.woOPExistsFirstArticleSerials;
              const callbackFunWithArguments = {
                functionName: clearAndSetFocusOnScanField,
                argu1: ''
              };
              displayWOOPAlreadyAddedSerials(existsSerialsData, callbackFunWithArguments);
            }
          }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // to clear scan serial details when invalid serial scan or already exists serial scan
    const clearInValidScanSerialDataAndFocus = (field) => {
      if (vm.selectedSerialFilterValue === vm.WOSerialNoFilterType.SerialNumber) {
        vm.fromSerialNoDetail = null;
        vm.serialNumber = null;
        setFocus('scanSerialNumber');
      }
      else if (vm.selectedSerialFilterValue === vm.WOSerialNoFilterType.Range) {
        if (vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.Range) {
          if (field === 'scanSerialNumber') {
            vm.fromSerialNoDetail = null;
            vm.serialNumber = null;
            setFocus('scanSerialNumber');
          }
          else {
            vm.toSerialNoDetail = null;
            vm.ToSerialNumber = null;
            setFocus('scanToSerialNumber');
          }
        }
        else if (vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.QtyRange) {
          if (field === 'scanSerialNumberforQty') {
            vm.fromSerialNoDetail = null;
            vm.serialNumberQty = null;
            setFocus('scanSerialNumberforQty');
          }
        }
      }
    };

    // set collapse and expand wo op first piece serials
    vm.setFPSerialsExpandCollapse = () => {
      vm.isAllExpanded = !vm.isAllExpanded;
      _.each(vm.workorderOperationFirstPieceList, (serialItem) => {
        serialItem.isShow = vm.isAllExpanded;
      });
    };

    // to refresh serial list
    vm.refreshWoOpFirstPieceSerials = () => {
      vm.getWorkorderOperationFirstPiece();
    };

    // open pop up to display all operation first article serials
    vm.openAllOperationSerialsPopup = () => {
      const data = {
        woID: vm.operation.woID,
        woNumber: vm.operation.workorder.woNumber,
        woVersion: vm.operation.workorder.woVersion
      };

      DialogFactory.dialogService(
        WORKORDER.WO_OP_ALL_FIRSTARTICLE_SERIALS_MODAL_CONTROLLER,
        WORKORDER.WO_OP_ALL_FIRSTARTICLE_SERIALS_MODAL_VIEW,
        event,
        data).then().catch((error) => BaseService.getErrorLog(error));
    };

    // when change option pick from existing or add new
    vm.changeAddSerialMethod = () => {
      const isdirty = vm.checkFormDirty(vm.FirstArticleAddSerialForm);
      if (isdirty) {
        vm.addSerialMethod = vm.addSerialMethod === vm.FirstArticleAddSerialMethodConst.PickFromExistingOperation ? vm.FirstArticleAddSerialMethodConst.GenerateNew
          : vm.FirstArticleAddSerialMethodConst.PickFromExistingOperation;

        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_LEAVE_SELECTED);
        messageContent.message = stringFormat(messageContent.message, '<b>' + vm.addSerialMethod + '</b>' + ' option');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            resetDataOnChangeAddSerialMethod();
            vm.addSerialMethod = vm.addSerialMethod === vm.FirstArticleAddSerialMethodConst.PickFromExistingOperation ? vm.FirstArticleAddSerialMethodConst.GenerateNew
              : vm.FirstArticleAddSerialMethodConst.PickFromExistingOperation;
          }
        }, () => {
          // cancel
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        resetDataOnChangeAddSerialMethod();
      }
    };

    // to reset data for add serial method option selected
    const resetDataOnChangeAddSerialMethod = () => {
      if (vm.addSerialMethod === vm.FirstArticleAddSerialMethodConst.GenerateNew && !vm.operation.workorder.isOperationTrackBySerialNo && !vm.operation.isTrackBySerialNo) {
        resetGenerateSerialDetForBulk();
      }
      else {
        clearAndSetFocusOnScanField();
      }
    };

    // clear serial details for bulk case
    const resetGenerateSerialDetForBulk = () => {
      vm.woOpFirstPieceModel.numOfSerialsToGenerate = '';
      vm.startNumber = null;
      vm.endNumber = null;
      vm.woOpFirstPieceModel.dateCodeFormat = null;
      vm.woOpFirstPieceModel.dateCode = null;
    };

    /*Used to add form when page load*/
    angular.element(() => {
      BaseService.currentPageForms = [vm.FirstArticleAddSerialForm];
    });
  };
})();
