(function () {
  'use strict';

  angular.module('app.traveler.travelers').directive('preprogramComponent', PreprogramComponent);
  /** @ngInject */
  function PreprogramComponent($mdSidenav, DialogFactory, $filter, $timeout) { // eslint-disable-line func-names
    return {
      restrict: 'E',
      scope: {
        preProgComponentData: '='
      },
      templateUrl: 'app/main/traveler/travelers/preprogram-component/preprogram-component.html',
      controllerAs: 'vm',
      controller: ['$scope', '$q', 'TRAVELER', 'CORE', 'PreProgramComponentFactory', 'USER', 'BaseService', '$mdDialog',
        'WorkorderOperationFactory', 'TRANSACTION',
        function ($scope, $q, TRAVELER, CORE, PreProgramComponentFactory, USER, BaseService, $mdDialog, WorkorderOperationFactory,
          TRANSACTION) {
          const vm = this;
          var employeeID = BaseService.loginUser.employee.id;
          var woID = $scope.preProgComponentData.woID;
          var opID = $scope.preProgComponentData.opID;
          var woOPID = $scope.preProgComponentData.woOPID;
          var woTransID = $scope.preProgComponentData.transID;
          vm.EmptyMesssageOperation = TRAVELER.TRAVELER_EMPTYSTATE;
          //vm.DefaultListCount = CORE.DefaultListCount;
          vm.componentMainList = null;
          vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
          vm.buildQty = $scope.preProgComponentData.buildQty;
          vm.opName = $scope.preProgComponentData.opName;
          vm.opFullName = $scope.preProgComponentData.opFullName;
          vm.sortByList = CORE.SortComponentOptionDropDown;
          vm.disableFromTraveler = $scope.preProgComponentData.isDisableScan;
          vm.isAllExpanded = false;
          vm.componentMainList = [];
          vm.woTransCompList = [];
          vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;
          vm.EmptyMesssage = TRAVELER.TRAVELER_EMPTYSTATE.PRE_PROGRAMMING_PART;
          vm.addRemoveDefectCountNote = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.ADD_REMOVE_PREPROG_PART_COUNT_NOTE.message);
          const travelerPreProgOrderByPref = getLocalStorageValue('TravelerPreProgOrderByPref');
          vm.verificationType = CORE.VerificationType;
          const errorMesg = $scope.preProgComponentData.isDisableScan ? stringFormat(angular.copy(TRAVELER.SCAN_DISABLE), '<b>Start/Resume Activity</b>') : null;
          let oldScanUMID = null;
          vm.LabelConstant = CORE.LabelConstant;
          vm.woOPListOfEnabledPreProg = [];
          vm.bomMappedRefDesgList = [];
          vm.bomMappedProgramList = [];
          vm.componentProgMainList = [];
          vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
          vm.UMID_MAX_LENGTH = CORE.UMID_MAX_LENGTH;

          vm.umidScan = {
            type: vm.verificationType.ScanUMIDForPreProgramming,
            checkKitAllocation: true,
            isPlacementTracking: false,
            errorText: errorMesg
          };

          const getWOPreProgComponentList = () => {
            const obj = {
              employeeID: employeeID,
              woTransID: woTransID,
              woID: woID,
              opID: opID,
              woOPID: woOPID
            };
            vm.cgBusyLoading = PreProgramComponentFactory.getWOTransPreprogComponentsList().save(obj).$promise.then((resp) => {
              if (resp && resp.data && resp.data.length) {
                const rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
                const woTransCompList = resp.data;
                _.each(woTransCompList, (item) => {
                  item.rohsIcon = rohsImagePath + item.rohsIcon;
                });
                vm.componentProgMainList = _.chain(woTransCompList)
                  // Group the elements of Array based on `color` property
                  .groupBy('programName')
                  // `key` is group's name (programName), `value` is the array of objects
                  .map((value, key) => ({ programName: key, woTransPreprogramCompDet: value }))
                  .value();

                _.each(vm.componentProgMainList, (progItem) => {
                  progItem.CumulativeTotalByAllUMID = _.sumBy(progItem.woTransPreprogramCompDet, 'totalUMIDCumulative');;
                });

                // default sorting
                if (travelerPreProgOrderByPref && travelerPreProgOrderByPref === CORE.SortOption.MostPopular) {
                  vm.sortOption = angular.copy(CORE.SortOption.MostPopular);
                  vm.componentProgMainList = $filter('orderBy')(vm.componentProgMainList, 'CumulativeTotalByAllUMID', true);
                }
                else {
                  if (travelerPreProgOrderByPref) {
                    vm.sortOption = travelerPreProgOrderByPref;
                  }
                  else {
                    vm.sortOption = angular.copy(CORE.SortOption.Order);       // Default apply sorting on defect list by their 'order' field
                  }
                  if (vm.sortOption !== CORE.SortOption.MostPopular) {
                    vm.sortByPopular(vm.sortOption);
                  }
                }
              }
              else {
                vm.componentProgMainList = [];
                vm.resetAll();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          };
          getWOPreProgComponentList();

          // scan label
          vm.scanLabel = (e) => {
            if (!$scope.preProgComponentData.isDisableScan) {
              $timeout(() => {
                scanLabel(e);
              }, true);
            }
            ///** Prevent enter key submit event */
            preventInputEnterKeyEvent(e);
          };

          const scanLabel = (e) => {
            localStorage.removeItem('UnlockFeederDetail');
            oldScanUMID = oldScanUMID || angular.copy(vm.umidScan.umid);
            // set null lineItemsID if not match with new umid
            if (oldScanUMID && oldScanUMID !== vm.umidScan.umid) {
              oldScanUMID = vm.umidScan.umid;
              vm.umidScan.rfqLineItemsID = null;
              vm.umidDetails = null;
              vm.autoCompleteProgramName.keyColumnId = null;
              vm.autoCompleteMFGPartRefDes.keyColumnId = null;
              vm.autoCompleteWOOPOfEnabledPreProg.keyColumnId = null;
              vm.umidScan.woMultiplier = null;
              vm.umidScan.displayOrder = null;
              vm.umidScan.qty = null;
              vm.umidScan.isSuccess = false;
              vm.umidScan.errorText = null;
              vm.umidScan.isConfirmed = false;
            }
            if (e.keyCode === 13) {
              if (vm.umidScan.umid) {
                vm.validateUMIDDetails(e);
              } else {
                // case will not come but in case no umid type selected than display invalid
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INVALID_DYNAMIC);
                messageContent.message = stringFormat(messageContent.message, 'UMID');
                const alertModel = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(alertModel);
              }
            }
          };

          // umid scan - validation
          vm.validateUMIDDetails = (e, authenticationApprovedDet) => {
            const umidObj = {
              UMID: vm.umidScan.umid,
              partID: $scope.preProgComponentData.partID,
              woOPID: $scope.preProgComponentData.woOPID,
              woTransID: $scope.preProgComponentData.transID,
              employeeId: $scope.preProgComponentData.employeeId,
              checkKitAllocation: vm.umidScan.checkKitAllocation ? vm.umidScan.checkKitAllocation : false,
              verificationType: vm.verificationType.ScanUMIDForPreProgramming,
              isVerify: $scope.preProgComponentData.isVerify ? true : false,
              rfqLineItemsID: vm.umidScan.rfqLineItemsID ? vm.umidScan.rfqLineItemsID : null,
              isConfirmed: vm.umidScan.isConfirmed ? vm.umidScan.isConfirmed : false,
              woID: $scope.preProgComponentData.woID,
              transactionType: CORE.TransactionType.UMID,
              authenticationApprovedDet: authenticationApprovedDet,
              isPlacementTracking: false,
              VerificationRequestFrom: CORE.VerificationRequestFrom.TravelerPreProgram
            };
            vm.cgBusyLoading = PreProgramComponentFactory.validateUMIDAndGetPartDetForPreProgram().query({ umidObj: umidObj }).$promise.then((res) => {
              if (res && res.data) {
                oldScanUMID = angular.copy(vm.umidScan.umid);
                let errorMessage = [];
                let confirmationMessage = [];
                vm.umidScan.isSuccess = false;
                vm.isUmidScanned = true;
                if (res.data && res.data.umidDetails && res.data.umidDetails.length > 0) {
                  vm.umidDetails = _.first(res.data.umidDetails);
                }
                else {
                  vm.umidDetails = null;
                }
                if (res.data && res.data.errorObjList && res.data.errorObjList.length > 0) {
                  // display error message on screen
                  errorMessage = _.filter(res.data.errorObjList, (itemObj) => itemObj.isUMIDError);

                  if (errorMessage.length > 0) {
                    // to hide pidcode details if umid details are not correct
                    const findUMIDError = _.find(res.data.errorObjList, (itemObj) => itemObj.isUMIDError);
                    if (!vm.umidScan.umid || findUMIDError) {
                      vm.umidDetails = null;
                    }
                    errorMessage = errorMessage.map((item) => item.errorText).join('<br/>');
                    vm.umidScan.errorText = errorMessage;

                    if (res.data && res.data.uidVerificationDet.length > 0) {
                      vm.uidVerificationDet = _.first(res.data.uidVerificationDet);
                    }
                    if (res.data.umidDetails && res.data.umidDetails.length > 0 && vm.uidVerificationDet) {
                      const umidID = _.first(res.data.umidDetails);
                      vm.uidVerificationDet.umidID = umidID.refsidid ? umidID.refsidid : null;
                    }

                    const obj = {
                      uidVerificationDet: vm.uidVerificationDet,
                      feederScan: vm.umidScan
                    };

                    // lock screen
                    localStorage.setItem('UnlockFeederDetail', JSON.stringify(obj));

                    DialogFactory.dialogService(
                      TRAVELER.FEEDER_SCAN_FAILED_MODAL_CONTROLLER,
                      TRAVELER.FEEDER_SCAN_FAILED_MODAL_VIEW,
                      e,
                      obj).then(() => {
                        localStorage.removeItem('UnlockFeederDetail');
                      }, () => {
                        // cancel block
                      }, (err) => BaseService.getErrorLog(err));
                  }

                  // display confirmation message on screen
                  confirmationMessage = _.filter(res.data.errorObjList, (itemObj) => itemObj.isConfirmation);
                  if (confirmationMessage.length > 0) {
                    const findRestrictErrorMessage = _.find(confirmationMessage, (restObj) => restObj.stringText1 = 'DUP');
                    if (!findRestrictErrorMessage) {
                      if (vm.umidDetails) {
                        let msgText = '';
                        if (vm.umidDetails.partLevelRestrictUSEwithpermission) {
                          msgText = CORE.MESSAGE_CONSTANT.RESTRICT_WITH_PERMISSION.RESTRICT_WITH_PERMISSION_AT_PART_MASTER;
                        } else if (vm.umidDetails.partLevelRestrictPackagingUseWithpermission) {
                          msgText = CORE.MESSAGE_CONSTANT.RESTRICT_WITH_PERMISSION.RESTRICT_WITH_PACKAGING_ALIAS_WITH_PERMISSION_AT_PART_MASTER;
                        } else {
                          msgText = CORE.MESSAGE_CONSTANT.RESTRICT_WITH_PERMISSION.RESTRICT_WITH_PERMISSION_AT_BOM;
                        }
                        const restrictAccessData = {
                          featureName: CORE.FEATURE_NAME.AllowRestrictWithPermission,
                          isAllowSaveDirect: false,
                          msgObject: {
                            msgText: stringFormat(msgText, vm.umidDetails.PIDCode)
                          }
                        };

                        DialogFactory.dialogService(
                          CORE.RESTRICT_ACCESS_CONFIRMATION_MODAL_CONTROLLER,
                          CORE.RESTRICT_ACCESS_CONFIRMATION_MODAL_VIEW,
                          e, restrictAccessData).then((resOfAuthData) => {
                            if (resOfAuthData) {
                              const _restrictPartAuthenticationDet = {
                                refID: null,
                                refTableName: CORE.TABLE_NAME.WORKORDER_TRANS_UMID_DETAILS,
                                isAllowSaveDirect: false,
                                approveFromPage: vm.title,
                                approvedBy: resOfAuthData.approvedBy,
                                confirmationType: CORE.Generic_Confirmation_Type.UMID_SETUP_SCAN,
                                approvalReason: resOfAuthData.approvalReason,
                                createdBy: loginUserDetails.userid,
                                updatedBy: loginUserDetails.userid
                              };

                              const authenticationApprovedDet = angular.copy(_restrictPartAuthenticationDet);
                              authenticationApprovedDet.transactionType = stringFormat(CORE.MESSAGE_CONSTANT.GENERIC_AUTHENTICATION_REASON.UMID_SETUP_SCAN,
                                $scope.preProgComponentData.PIDCode, $scope.preProgComponentData.woNumber, $scope.preProgComponentData.opFullName);
                              authenticationApprovedDet.woOPID = $scope.preProgComponentData.woOPID;

                              vm.umidScan.checkKitAllocation = true;
                              vm.umidScan.isConfirmed = true;
                              vm.validateUMIDDetails(e, authenticationApprovedDet);
                            }
                          }, () => {
                            // cancel block
                          }).catch((error) => BaseService.getErrorLog(error));
                      }
                    } else {
                      confirmationMessage = confirmationMessage.map((item) => item.errorText).join('<br/>');
                      const obj = {
                        title: CORE.MESSAGE_CONSTANT.CONFIRMATION,
                        textContent: confirmationMessage,
                        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                      };
                      DialogFactory.confirmDiolog(obj).then((response) => {
                        if (response) {
                          vm.umidScan.checkKitAllocation = true;
                          vm.umidScan.isConfirmed = true;
                          vm.validateUMIDDetails(e);
                        }
                      }, () => {
                        // cancel block
                      }).catch((error) => BaseService.getErrorLog(error));
                    }
                  }
                }

                if (vm.umidDetails) {
                  updateImagePath(vm.umidDetails);
                  checkExpiryDateValidation(errorMessage, confirmationMessage);
                  if (res.data && res.data.bomLineItemDetails && res.data.bomLineItemDetails.length > 0) {
                    const selectedbomLineItemList = res.data.bomLineItemDetails;
                    vm.bomMappedProgramList = [];
                    _.each(selectedbomLineItemList, (item) => {
                      if (!_.some(vm.bomMappedProgramList, (addedItem) => addedItem.programName === item.programName)
                      ) {
                        const sameProgNameCompList = _.filter(selectedbomLineItemList, (compProgItem) => compProgItem.programName === item.programName);
                        const obj = {
                          programName: item.programName,
                          partRefDesg: _.uniq(_.map(sameProgNameCompList, 'partRefDesg')).toString(),
                          refStkWOOPID: item.refStkWOOPID,
                          displayOrder: item.displayOrder,
                          woTransPreprogramID: item.woTransPreprogramID,
                          woPreProgCompID: item.woPreProgCompID
                        };
                        const allQpaList = obj.partRefDesg.split(',');
                        obj.qpa = allQpaList.length || 0;
                        vm.bomMappedProgramList.push(obj);
                      }
                    });

                    if (vm.bomMappedProgramList.length === 1) {
                      vm.autoCompleteProgramName.keyColumnId = vm.bomMappedProgramList[0].programName;
                    };
                    //if (res.data && res.data.woPreProgCompDetForScannedUMID && res.data.woPreProgCompDetForScannedUMID.length) {
                    //  vm.woPreProgCompDetForScannedUMID = _.first(res.data.woPreProgCompDetForScannedUMID);
                    //  if (vm.woPreProgCompDetForScannedUMID && vm.woPreProgCompDetForScannedUMID.refStkWOOPID) {
                    //    vm.autoCompleteWOOPOfEnabledPreProg.keyColumnId = vm.woPreProgCompDetForScannedUMID.refStkWOOPID;
                    //  }
                    //}
                    //else {
                    //  vm.woPreProgCompDetForScannedUMID = null;
                    //}
                  }
                  if (errorMessage.length === 0 && confirmationMessage.length === 0) {
                    sucessMessage(errorMessage, res);
                  }
                  //if (vm.scanAndAddProgramForm) {
                  //  //vm.scanAndAddProgramForm.$setPristine();
                  //  //vm.scanAndAddProgramForm.$setUntouched();
                  //  vm.scanAndAddProgramForm.$dirty = true;
                  //}
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          };

          const updateImagePath = (details) => {
            if (details) {
              if (!details.imageURL) {
                details.imageURL = CORE.WEB_URL + USER.COMPONENT_DEFAULT_IMAGE_PATH + 'profile.jpg';
              } else {
                if (!details.imageURL.startsWith('http://') && !details.imageURL.startsWith('https://')) {
                  details.imageURL = BaseService.getPartMasterImageURL(details.documentPath, details.imageURL);
                }
              }
            }
          };

          // check for expiry date validation
          const checkExpiryDateValidation = (errorMessage, confirmationMessage) => {
            if (errorMessage.length === 0 && confirmationMessage.length === 0) {
              // check for expiry date added or not
              if (vm.umidDetails.expiryDate) {
                const dayDiff = date_diff_indays(new Date(), new Date(vm.umidDetails.expiryDate));

                // logic to get higher date from system level and part level for alert
                let getHigherDays = null;
                if (vm.ExpireDaysLeft && vm.umidDetails.alertExpiryDays) {
                  getHigherDays = parseInt(vm.ExpireDaysLeft) > parseInt(vm.umidDetails.alertExpiryDays) ? parseInt(vm.ExpireDaysLeft) : parseInt(vm.umidDetails.alertExpiryDays);
                }
                else if (!vm.ExpireDaysLeft) {
                  getHigherDays = parseInt(vm.umidDetails.alertExpiryDays);
                }
                else if (!vm.umidDetails.alertExpiryDays) {
                  getHigherDays = parseInt(vm.ExpireDaysLeft);
                }

                if (vm.ExpireDaysLeft && dayDiff <= getHigherDays) {
                  vm.umidDetails.expiryDateText = stringFormat(TRAVELER.EXPIRYDAYALERT, $filter('date')(new Date(vm.umidDetails.expiryDate), vm.DateFormatArray), dayDiff);
                }
              }
            }
          };

          // common function for success message
          const sucessMessage = (errorMessage, res) => {
            errorMessage = _.filter(res.data.errorObjList, (itemObj) => itemObj.isMessage);
            errorMessage = errorMessage.map((item) => item.errorText).join('<br/>');

            if (!errorMessage) {
              return;
            }
            //NotificationFactory.success(errorMessage);
            vm.umidScan.errorText = errorMessage;
            vm.umidScan.isSuccess = true;
            vm.umidScan.isConfirmed = false;
            vm.umidScan.rfqLineItemsID = null;
            vm.umidScan.checkKitAllocation = true;
            $scope.$applyAsync();
          };

          // reset all added UMID details
          vm.resetAll = () => {
            vm.umidScan = {
              umid: null,
              type: vm.verificationType.ScanUMIDForPreProgramming,
              checkKitAllocation: true,
              isPlacementTracking: false,
              displayOrder: null,
              woMultiplier: null,
              qty: null
            };
            vm.isUmidScanned = false;
            vm.umidDetails = null;
            vm.umidScan.errorText = null;
            vm.umidScan.isConfirmed = false;
            vm.umidScan.isSuccess = false;
            vm.autoCompleteProgramName.keyColumnId = null;
            vm.autoCompleteMFGPartRefDes.keyColumnId = null;
            vm.autoCompleteWOOPOfEnabledPreProg.keyColumnId = null;
            vm.woPreProgCompDetForScannedUMID = null;
            if (vm.scanAndAddProgramForm) {
              vm.scanAndAddProgramForm.$setPristine();
              vm.scanAndAddProgramForm.$setUntouched();
            }
            setFocusByName('umid');
            vm.bomMappedRefDesgList = [];
            vm.bomMappedProgramList = [];
          };

          const getAllWOOPWithEnabledPreProgPartUse = () => {
            vm.woOPListOfEnabledPreProg = [];
            if ($scope.preProgComponentData) {
              return WorkorderOperationFactory.retriveOPListWithTransbyWoID().query({
                woID: $scope.preProgComponentData.woID
              }).$promise.then((oplistResp) => {
                if (oplistResp && oplistResp.data) {
                  // Get opNumber of current operation
                  const opDataNumber = _.find(oplistResp.data, (opItem) => opItem.woOPID === $scope.preProgComponentData.woOPID);
                  // set display name filter for work order operation
                  // Remove operation which has qtyControl false and self operation and previous operation
                  const isAnyEnablePreProgrammingPartOP = _.some(oplistResp.data, (opItem) => opItem.isEnablePreProgrammingPart);
                  if (isAnyEnablePreProgrammingPartOP) {
                    oplistResp.data = _.filter(oplistResp.data, (opItem) => {
                      opItem.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, opItem.opName, opItem.opNumber);
                      return opItem.woOPID !== $scope.preProgComponentData.woOPID && opItem.qtyControl && opItem.opNumber > opDataNumber.opNumber
                        && opItem.isEnablePreProgrammingPart;
                    });
                  }
                  else {
                    oplistResp.data = _.filter(oplistResp.data, (opItem) => {
                      opItem.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, opItem.opName, opItem.opNumber);
                      return opItem.woOPID !== $scope.preProgComponentData.woOPID && opItem.qtyControl && opItem.opNumber > opDataNumber.opNumber;
                    });
                  }
                  vm.woOPListOfEnabledPreProg = oplistResp.data;
                }
                return $q.resolve(oplistResp);
              }).catch((error) => BaseService.getErrorLog(error));
            }
          };
          getAllWOOPWithEnabledPreProgPartUse();

          // initalize all autocomplete
          vm.autoCompleteProgramName = {
            columnName: 'programName',
            keyColumnName: 'programName',
            keyColumnId: null,
            inputName: 'ProgramName',
            placeholderName: 'Program Name',
            isRequired: true,
            isAddnew: false,
            callbackFn: null,
            onSelectCallbackFn: function (selectedProgram) {
              if (selectedProgram) {
                vm.woPreProgCompDetForScannedUMID = selectedProgram;
                vm.bomMappedRefDesgList = _.filter(vm.bomMappedProgramList, (item) => item.programName === selectedProgram.programName);
                if (vm.bomMappedRefDesgList.length === 1) {
                  vm.autoCompleteMFGPartRefDes.keyColumnId = vm.bomMappedRefDesgList[0].partRefDesg;
                }
                if (selectedProgram.refStkWOOPID) {
                  vm.autoCompleteWOOPOfEnabledPreProg.keyColumnId = selectedProgram.refStkWOOPID;
                }
                const maxOrderProgDet = _.maxBy(vm.componentProgMainList, (item) => item.woTransPreprogramCompDet[0].displayOrder);
                vm.umidScan.displayOrder = selectedProgram.displayOrder ? selectedProgram.displayOrder : (maxOrderProgDet ? maxOrderProgDet.woTransPreprogramCompDet[0].displayOrder + 1 : 1);
              }
              else {
                vm.woPreProgCompDetForScannedUMID = null;
                vm.autoCompleteMFGPartRefDes.keyColumnId = null;
                vm.autoCompleteWOOPOfEnabledPreProg.keyColumnId = null;
                vm.umidScan.displayOrder = 0;
              }
            }
          };

          vm.autoCompleteMFGPartRefDes = {
            columnName: 'partRefDesg',
            keyColumnName: 'partRefDesg',
            keyColumnId: null,
            inputName: 'MFGPartRefDes',
            placeholderName: vm.LabelConstant.BOM.REF_DES,
            isRequired: true,
            isAddnew: false,
            callbackFn: null,
            onSelectCallbackFn: function (selectedRefDesg) {
              vm.umidScan.woMultiplier = selectedRefDesg ? selectedRefDesg.qpa : 0;
            }
          };

          vm.autoCompleteWOOPOfEnabledPreProg = {
            columnName: 'opFullName',
            keyColumnName: 'woOPID',
            keyColumnId: null,
            inputName: 'WOOPOfEnabledPreProg',
            placeholderName: 'Operation',
            isRequired: false,
            isAddnew: false,
            callbackFn: getAllWOOPWithEnabledPreProgPartUse,
            onSelectCallbackFn: null
          };

          // to save program , designator and umid details
          vm.savePreProgramDetails = () => {
            vm.isSaveButtonDisable = true;
            if (BaseService.focusRequiredField(vm.scanAndAddProgramForm)) {
              vm.isSaveButtonDisable = false;
              return;
            }

            if (!$scope.preProgComponentData.transID || !$scope.preProgComponentData.woID ||
              !$scope.preProgComponentData.opID || !$scope.preProgComponentData.woOPID ||
              !$scope.preProgComponentData.employeeId || !$scope.preProgComponentData.woID ||
              !$scope.preProgComponentData.transID || !vm.umidDetails.id || !vm.umidDetails.refsidid ||
              !vm.umidScan.woMultiplier || !vm.autoCompleteProgramName.keyColumnId || !vm.autoCompleteMFGPartRefDes.keyColumnId) {
              vm.isSaveButtonDisable = false;
              return;
            }

            const preProgUMIDDet = {
              woTransID: $scope.preProgComponentData.transID,
              woID: $scope.preProgComponentData.woID,
              opID: $scope.preProgComponentData.opID,
              woOPID: $scope.preProgComponentData.woOPID,
              employeeID: $scope.preProgComponentData.employeeId,
              programName: vm.autoCompleteProgramName.keyColumnId,
              designatorName: vm.autoCompleteMFGPartRefDes.keyColumnId,
              refStkWOOPID: vm.woPreProgCompDetForScannedUMID && vm.woPreProgCompDetForScannedUMID.refStkWOOPID ? vm.woPreProgCompDetForScannedUMID.refStkWOOPID : (vm.autoCompleteWOOPOfEnabledPreProg.keyColumnId || null),
              mfgPNID: vm.umidDetails.id,
              refsidid: vm.umidDetails.refsidid,
              woTransPreprogramID: vm.woPreProgCompDetForScannedUMID.woTransPreprogramID || null,
              woPreProgCompID: vm.woPreProgCompDetForScannedUMID.woTransPreprogramID ? vm.woPreProgCompDetForScannedUMID.woPreProgCompID : null,
              compCnt: vm.umidScan.qty || null,
              woMultiplier: vm.umidScan.woMultiplier,
              displayOrder: vm.umidScan.displayOrder || null
            };

            vm.cgBusyLoading = PreProgramComponentFactory.saveWOPreProgramComponent().save(preProgUMIDDet).$promise
              .then((res) => {
                vm.isSaveButtonDisable = false;
                if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  vm.resetAll();
                  getWOPreProgComponentList();
                }
              }).catch((error) => {
                vm.isSaveButtonDisable = false;
                return BaseService.getErrorLog(error);
              });
          };

          // Apply Sorting on Pre-Programming part (program part) list
          vm.sortByPopular = (option) => {
            setLocalStorageValue('TravelerPreProgOrderByPref', option);
            if (option === CORE.SorComponentOption.Order) {
              vm.componentProgMainList = _.orderBy(vm.componentProgMainList, (item) => item.woTransPreprogramCompDet[0].displayOrder);
            }
            else if (option === CORE.SorComponentOption.Name) {
              vm.componentProgMainList = _.orderBy(vm.componentProgMainList, (item) => item.programName);
            }
          };

          /* when search text added that time called for searching Desig and Defect */
          vm.searchDesigAndDefect = () => {
            if (vm.searchComponent) {
              vm.isSearchDataExists = _.some(vm.componentProgMainList, (progItem) => progItem.programName.toLowerCase().indexOf(vm.searchComponent.toLowerCase()) >= 0);
            }
            else {
              vm.isSearchDataExists = true;
            }
          };

          // check to disable button for decrease based on production quantity of selected operation in component
          vm.isDisableToDecrease = (woTransItem) => (woTransItem.OPProdQty < (Math.ceil(woTransItem.totalUMIDCumulative / woTransItem.woMultiplier))) ? false : true;

          /* called when user press minus(-) button to remove component count */
          vm.minusComponentCount = (woTransItem) => {
            woTransItem.newCnt = null;
            vm.addDesignatorComponent(woTransItem, -1, false);
          };

          /* called when user press add(+) button to add component count */
          vm.incrementComponentCount = (woTransItem) => {
            woTransItem.newCnt = null;
            vm.addDesignatorComponent(woTransItem, 1, false);
          };

          /* called when manually write component count to add or minus */
          vm.addComponentCount = ($event, woTransItem) => {
            var keyCode = $event ? ($event.which || $event.keyCode) : '';
            var isAdded = (keyCode) ? ((keyCode === 13) ? true : false) : true;
            if (isAdded && woTransItem.newCnt) {
              if (!checkComponentCountRemoveAllowed(woTransItem)) {
                return;
              }
              vm.isAddNewCntButtonDisable = true;
              vm.addDesignatorComponent(woTransItem, woTransItem.newCnt, false);
            }
          };

          /* added validation to check defect count allowed to remove   */
          const checkComponentCountRemoveAllowed = (woTransItem) => {
            if (vm.disableFromTraveler || (woTransItem.newCnt <= 0 && ((woTransItem.compCnt === 0 || woTransItem.totalUMIDCumulative === 0)
              || (Math.abs(woTransItem.newCnt) > woTransItem.compCnt || Math.abs(woTransItem.newCnt) > woTransItem.totalUMIDCumulative)))) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CHECK_DESIGNATOR_ADDED_PREPROG_PART);
              messageContent.message = stringFormat(messageContent.message, woTransItem.compCnt, woTransItem.newCnt);
              const alertModel = {
                messageContent: messageContent
              };
              DialogFactory.messageAlertDialog(alertModel).then(() => {
                setFocus('partNewCnt_' + woTransItem.refsidid);
              }).catch((error) => BaseService.getErrorLog(error));
              woTransItem.newCnt = null; //  after add/remove component count , set blank data
              return false;
            }
            else {
              return true;
            }
          };

          /* to create or update designator details */
          vm.addDesignatorComponent = (woTransItem, count) => {
            const selectedProgramDet = _.find(vm.componentProgMainList, (item) => woTransItem.programName === item.programName);
            if (!selectedProgramDet) {
              vm.isAddNewCntButtonDisable = false;
              return;
            }

            const model = {
              woID: woID,
              opID: opID,
              woOPID: woOPID,
              woTransID: woTransID,
              employeeID: employeeID,
              compCnt: count,
              woPreProgCompID: woTransItem.woPreProgCompID,
              woNumber: $scope.preProgComponentData.woNumber,
              opName: $scope.preProgComponentData.opName,
              woTransPreprogramID: woTransItem.woTransPreprogramIDOfLoginEmp,
              refsidid: woTransItem.refsidid,
              programName: woTransItem.programName,
              woMultiplier: woTransItem.woMultiplier
              //allWOPreProgCompIDsUnderProgram: _.map(selectedProgramDet.woTransPreprogramCompDet, 'woPreProgCompID')
              // mfgPN: woCompnent.component ? woCompnent.component.mfgPN : woCompnent.mfgPN,
              // designatorName: woComDesi.designatorName
            };
            vm.cgBusyLoading = PreProgramComponentFactory.saveWOPreprogComp().save(model).$promise.then((response) => {
              vm.isAddNewCntButtonDisable = false;
              woTransItem.newCnt = null;
              if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                woTransItem.newCnt = null; //  after add/remove component count , set blank data
                getWOPreProgComponentList();
                if (vm.preProgCompForm['desigPartCountForm_' + woTransItem.refsidid]) {
                  vm.preProgCompForm['desigPartCountForm_' + woTransItem.refsidid].$setPristine();
                }
              }
              else {
                if (checkResponseHasCallBackFunctionPromise(response)) {
                  response.alretCallbackFn.then(() => {
                    setFocus('partNewCnt_' + woTransItem.refsidid);
                  });
                }
              }
            }).catch((error) => {
              vm.isAddNewCntButtonDisable = false;
              return BaseService.getErrorLog(error);
            });
          };
          /* End Add part count*/

          vm.closeSidenav = () => {
            const isdirtyForScanUMIDForm = vm.checkFormDirty(vm.scanAndAddProgramForm);
            if (isdirtyForScanUMIDForm) {
              const data = {
                form: vm.scanAndAddProgramForm
              };
              showWithoutSavingAlertForPopUp(data);
              return;
            }

            let isAnyProgDesigDetFormDirty = false;
            _.each(vm.componentProgMainList, (progItem) => {
              _.each(progItem.woTransPreprogramCompDet, (woTransItem) => {
                const isdirtyForPartCountForm = vm.checkFormDirty(vm.preProgCompForm['desigPartCountForm_' + woTransItem.refsidid]);
                if (isdirtyForPartCountForm) {
                  isAnyProgDesigDetFormDirty = true;
                  const data = {
                    form: vm.preProgCompForm
                  };
                  showWithoutSavingAlertForPopUp(data);
                  return false;
                }
              });
              if (isAnyProgDesigDetFormDirty) {
                return false;
              }
            });

            if (!isAnyProgDesigDetFormDirty) {
              BaseService.currentPagePopupForm.pop();
              $mdSidenav('preprogram-component').close();
            }
          };

          vm.checkFormDirty = (form, Columnobject) => {
            const checkDirty = BaseService.checkFormDirty(form, Columnobject);
            return checkDirty;
          };

          /* alert popup added here instead of using common for using cancel button click */
          const showWithoutSavingAlertForPopUp = (data) => {
            const obj = {
              messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE),
              btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
              canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
            };
            DialogFactory.messageConfirmDialog(obj).then(() => {
              if (data) {
                $mdSidenav('preprogram-component').close();
              }
            }, () => {
              BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.scanAndAddProgramForm);
            }).catch((error) => BaseService.getErrorLog(error));
          };

          /* Start Manage component */
          vm.openComponentProgramPopup = function (ev, programItem) {
            DialogFactory.dialogService(
              TRAVELER.PREPROGRAM_COMPONENT_ADD_MODAL_CONTROLLER,
              TRAVELER.PREPROGRAM_COMPONENT_ADD_MODAL_VIEW,
              ev,
              {
                woID: woID,
                woPreProgCompID: programItem.woTransPreprogramCompDet[0].woPreProgCompID,
                woOPID: woOPID,
                woNumber: $scope.preProgComponentData.woNumber,
                opName: $scope.preProgComponentData.opName,
                employeeID: $scope.preProgComponentData.employeeID,
                partID: $scope.preProgComponentData.partID
              })
              .then(() => {
                // pass/true block
              }, (insertedData) => {
                if (insertedData) {
                  getWOPreProgComponentList();
                }
              }, (error) => BaseService.getErrorLog(error));
          };

          // to delete program component
          vm.deleteProgramComponent = (woPreProgCompID) => {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
            messageContent.message = stringFormat(messageContent.message, 'Program', 1);
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };

            const model = {
              woPreProgCompID: [woPreProgCompID]
            };

            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                vm.cgBusyLoading = PreProgramComponentFactory.deleteWOPreProgramComponent().save(model).$promise.then((response) => {
                  if (response && response.data) {
                    if (response.data.TotalCount && response.data.TotalCount > 0) {
                      BaseService.deleteAlertMessage(response.data);
                    }
                  }
                  else {
                    getWOPreProgComponentList();
                  }
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }, () => {
              // cancel block
            }).catch((error) => BaseService.getErrorLog(error));
          };

          // to move redirection at bill of material
          vm.goToComponentBOM = () => {
            BaseService.goToComponentBOM($scope.preProgComponentData.partID);
            return false;
          };

          // go to umid list
          vm.goToUMIDList = () => {
            BaseService.goToUMIDList();
          };

          // go to wo op list page
          vm.goToWOOPList = () => {
            BaseService.goToWorkorderOperations($scope.preProgComponentData.woID);
          };

          // go to assembly list
          vm.goToAssemblyList = () => BaseService.goToPartList();

          // to go at umid details page
          vm.goToUMIDDetail = (data) => BaseService.goToUMIDDetail(data.refsidid);

          /* called for max length validation */
          vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

          /*Used to open UMID scan history popup*/
          vm.viewUMIDHistoryPopup = (ev) => {
            const popUpHeaderData = {
              equipmentName: null,
              eqpID: null,
              wo: $scope.preProgComponentData.woNumber,
              version: $scope.preProgComponentData.woVersion
            };
            const data = {
              isScanUMIDForPreProgramming: true,
              isScanUMIDOnly: false,
              woID: $scope.preProgComponentData.woID,
              isScanFeederFirstAndUMIDFirstAndChangeReel: false,
              woOPID: $scope.preProgComponentData.woOPID,
              headerData: popUpHeaderData
            };
            DialogFactory.dialogService(
              TRAVELER.SCAN_UMID_VIEW_HISTORY_MODAL_CONTROLLER,
              TRAVELER.SCAN_UMID_VIEW_HISTORY_MODAL_VIEW,
              ev,
              data).then(() => {
                // success/true block
              }, () => {
                // cancel block
              }, (err) => BaseService.getErrorLog(err));
          };

          // go move at work order list page
          vm.goToWorkorderList = () => {
            BaseService.goToWorkorderList();
            return false;
          };

          // go move at work order details page
          vm.goToWorkorderDetails = () => {
            BaseService.goToWorkorderDetails($scope.preProgComponentData.woID);
            return false;
          };

          // to move at assembly bill of material page
          vm.goToComponentBOM = () => {
            BaseService.goToComponentBOM($scope.preProgComponentData.partID);
            return false;
          };

          // to move at kit list page
          vm.goToKitList = () => {
            BaseService.goToKitList($scope.preProgComponentData.salesOrderDetID, $scope.preProgComponentData.partID, null);
            return false;
          };

          // umid transfer
          vm.uidTranfer = (event, data) => {
            data.uid = null;
            if (vm.umidScan.umid) {
              data.uid = vm.umidScan.umid;
            }
            DialogFactory.dialogService(
              TRANSACTION.UID_TRANSFER_CONTROLLER,
              TRANSACTION.UID_TRANSFER_VIEW,
              event,
              data).then(() => {
                // success/true block
              }, (transfer) => {
                if (transfer) {
                  // comming soon
                }
              }, (err) => BaseService.getErrorLog(err));
          };

          //on load submit form
          angular.element(() => {
            //check load
            BaseService.currentPagePopupForm.push(vm.scanAndAddProgramForm);
          });

          //close popup on page destroy
          $scope.$on('$destroy', () => {
            $mdDialog.hide('', { closeAll: true });
          });
        }]
    };
  }
})();
