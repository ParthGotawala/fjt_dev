(function () {
  'use strict';

  angular.module('app.traveler.travelers').directive('logDefect', LogDefectController);
  /** @ngInject */
  function LogDefectController($mdSidenav, DialogFactory, $filter, $timeout) { // eslint-disable-line func-names
    return {
      restrict: 'E',
      scope: {
        logDefectData: '='
      },
      templateUrl: 'app/main/traveler/travelers/log-defect/log-defect.html',
      controllerAs: 'vm',
      controller: ['$scope', '$q', 'TRAVELER', 'CORE', 'LogDefectFactory', 'BaseService', 'WorkorderSerialMstFactory', 'USER', '$mdDialog', function ($scope, $q, TRAVELER, CORE, LogDefectFactory, BaseService, WorkorderSerialMstFactory, USER) {
        const vm = this;
        var employeeID = BaseService.loginUser.employee.id;
        var woID = $scope.logDefectData.woID;
        var opID = $scope.logDefectData.opID;
        var woOPID = $scope.logDefectData.woOPID;
        var woTransID = $scope.logDefectData.transID;
        vm.EmptyMesssageOperation = TRAVELER.TRAVELER_EMPTYSTATE;
        //vm.DefaultListCount = CORE.DefaultListCount;
        vm.WOSerialNoFilterType = CORE.WorkorderSerialNumberFilterType;
        vm.defectMainList = null;
        vm.statusText = CORE.statusTextValue;
        vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.DEFECT_CATEGORY;
        vm.opName = $scope.logDefectData.opName;
        vm.sortByList = CORE.SortOptionDropDown;
        vm.SerialTypeLabel = CORE.SerialTypeLabel;
        vm.disableFromTraveler = $scope.logDefectData.isDisable;
        let DPMOForWO = null;
        vm.isAllExpanded = false;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.headerdata = [];
        vm.addRemoveDefectCountNote = TRAVELER.ADD_REMOVE_DEFECT_COUNT_NOTE;
        vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;
        const travelerLogDefectOrderByPref = getLocalStorageValue('TravelerLogDefectOrderByPref');
        vm.LabelConstant = CORE.LabelConstant;

        if ($scope.logDefectData.isRework) {
          vm.headerdata.push({
            label: CORE.LabelConstant.Workorder.DPMO,
            value: DPMOForWO,
            displayOrder: 1,
            labelTooltip: CORE.LabelConstant.Workorder.DPMOFullName
          });
        }

        // Start Section of bind Serial# dropdown and their function
        vm.isSerialNoRequired = $scope.logDefectData ? ($scope.logDefectData.isOperationTrackBySerialNo || $scope.logDefectData.isTrackBySerialNo) : false;
        vm.isEditSerialNo = true;

        /* get DPMO (Defects per million opportunities) details for all rework operations with defined wo */
        const getDPMOForWo = () => {
          if ($scope.logDefectData.isRework) {
            DPMOForWO = null;
            vm.cgBusyLoading = LogDefectFactory.calculateAndGetDPMOForWoAssy().save({
              woID: woID
            }).$promise.then((response) => {
              DPMOForWO = response && response.data && response.data.DPMO ? response.data.DPMO : '-';
              const DPMOHeaderData = _.find(vm.headerdata, (headerItem) => headerItem.label === CORE.LabelConstant.Workorder.DPMO);
              if (DPMOHeaderData) {
                DPMOHeaderData.value = DPMOForWO;
              }
              refreshWorkOrderHeaderDetails();
            }).catch((error) => BaseService.getErrorLog(error));
          }
        };

        if (vm.isSerialNoRequired) {
          vm.serialNo_Model = {
            from_SerialNo: null,
            to_serialNo: null
          };
          //get Work Order Serial# by WoID
          workOrderSerialList().then(() => {
            initAutoCompleteForWorkorderSerials();
          });
        }
        else {
          init();
        }
        function workOrderSerialList() {
          return WorkorderSerialMstFactory.getAllWorkorderSerialsByWoID().query({ woID: woID }).$promise
            .then((res) => {
              vm.workorderSerialsList = res && res.data && res.data.workorderSerialsList ? res.data.workorderSerialsList : [];
              return vm.workorderSerialsList;
            }).catch((error) => BaseService.getErrorLog(error));
        }
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
          let messageContent;
          if ((e.keyCode === 13)) {
            vm.cgBusyLoading = WorkorderSerialMstFactory.getValidateSerialNumberDetails().query({ woID: woID, serialNo: SerialNo }).$promise.then((response) => {
              if (response && response.data) {
                switch (response.data.currStatus) {
                  case vm.statusText.Passed.Value:
                    response.data.currentStautstext = vm.statusText.Passed.Text;
                    break;
                  case vm.statusText.Reprocessed.Value:
                    response.data.currentStautstext = vm.statusText.Reprocessed.Text;
                    break;
                  case vm.statusText.DefectObserved.Value:
                    response.data.currentStautstext = vm.statusText.DefectObserved.Text;
                    break;
                  case vm.statusText.Scraped.Value:
                    response.data.currentStautstext = vm.statusText.Scraped.Text;
                    break;
                  case vm.statusText.ReworkRequired.Value:
                    response.data.currentStautstext = vm.statusText.ReworkRequired.Text;
                    break;
                  case vm.statusText.BoardWithMissingParts.Value:
                    response.data.currentStautstext = vm.statusText.BoardWithMissingParts.Text;
                    break;
                  case vm.statusText.Bypassed.Value:
                    response.data.currentStautstext = vm.statusText.Bypassed.Text;
                    break;
                  default:
                    response.data.currentStautstext = 'Idle';
                }

                if (field === 'scanSerialNumber') {
                  vm.SerialNoDetail = response.data;
                }
              } else {
                vm.SerialNoDetail = null;
                vm.inValidFormSerialNo = true;
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SCAN_VALID_SERIAL_NUMBER);
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model).then((yes) => {
                  if (yes) {
                    vm.serialNumber = null;
                    setFocus('scanSerialNumber');
                  }
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        };

        // auto complete for serial# and product status
        const initAutoCompleteForWorkorderSerials = () => {
          vm.autoCompleteWorkorderSerialsDetail = {
            columnName: 'SerialNo',
            keyColumnName: 'SerialNo',
            keyColumnId: vm.serialNo_Model.from_SerialNo ? vm.serialNo_Model.from_SerialNo : null,
            inputName: 'WorkorderFromSerials',
            placeholderName: 'Serial#',
            isRequired: true,
            isAddnew: false,
            callbackFn: workOrderSerialList
          };
        };

        vm.changeNo = () => {
          vm.isEditSerialNo = true;
        };

        vm.changeSerialNo = () => {
          vm.selectedSerailNoChange = vm.SerialNoDetail;//_.find(vm.workorderSerialsList, function (item) { return item.SerialNo == vm.autoCompleteWorkorderSerialsDetail.keyColumnId; });
          if (vm.selectedSerailNoChange) {
            vm.isEditSerialNo = false;
            vm.SerialNo = vm.selectedSerailNoChange.SerialNo;
            init();
          }
        };
        vm.discardChange = () => {
          vm.isEditSerialNo = false;
        };
        // End Section of bind Serial# dropdown and their function

        vm.defectMainList = [];
        vm.woDefectList = [];

        vm.getAllDefectCategoryWithList = getAllDefectCategoryWithList;

        //get work order defect designator list
        const getWODefectDesgList = (newlyAddedDesignatorDefect) => {
          var promises = [getWODefectDesigantorWithList()];
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
            var getWODefectDesigantorWithListResp = responses[0];
            if (getWODefectDesigantorWithListResp && getWODefectDesigantorWithListResp.length) {
              vm.woDefectDesignatorList = [];
              _.forEach(getWODefectDesigantorWithListResp, (item) => {
                var model = {
                  defectCnt: item.defectCnt,
                  wodesignatorID: item.wodesignatorID,
                  defectCatid: item.defectCatid,
                  designatorName: item.designatorName,
                  newCnt: null,
                  totalCount: item.totalCount,
                  noOfPin: item.noOfPin
                };
                vm.woDefectDesignatorList.push(model);

                const defectModel = {
                  defectcatName: item.defectcatName,
                  defectCatid: item.defectCatid
                };
                if (vm.woDefectList.length > 0) {
                  const obj = vm.woDefectList.find((x) => x.defectCatid === item.defectCatid);
                  if (!obj) {
                    vm.woDefectList.push(defectModel);
                  }
                }
                else {
                  vm.woDefectList.push(defectModel);
                }
              });

              _.forEach(vm.woDefectList, (item) => {
                if (!item.designators) {
                  item.designators = [];
                }
                item.designators = _.filter(vm.woDefectDesignatorList, (x) => x.defectCatid === item.defectCatid);
                if (item.designators && item.designators.length > 0) {
                  _.map(item.designators, (desigItem) => {
                    desigItem.isHighlightDesignator = false;
                  });

                  // highlight newly added designator
                  if (newlyAddedDesignatorDefect && newlyAddedDesignatorDefect.defectCatid === item.defectCatid) {
                    const addedDesigItem = _.find(item.designators, (filterDesigItem) => filterDesigItem.wodesignatorID === newlyAddedDesignatorDefect.wodesignatorID);
                    if (addedDesigItem) {
                      addedDesigItem.isHighlightDesignator = true; // to highlight box
                    }
                  }
                }
              });

              /* open only added/updated defect category block open */
              if (newlyAddedDesignatorDefect && newlyAddedDesignatorDefect.defectCatid) {
                _.each(vm.defectMainList, (defectCat) => {
                  defectCat.isOpen = defectCat.defectCatId === newlyAddedDesignatorDefect.defectCatid;
                });
                scrollToCurrentDesigDefect(newlyAddedDesignatorDefect); // for scroll moving to selected designator defect
              }
            }
          });
        };

        // init
        function init() {
          /* get DPMO details for all rework operations with defined wo */
          getDPMOForWo();
          const promises = [getAllDefectCategoryWithList(), getWODefectDesigantorWithList()];
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
            vm.woDefectList = [];

            const getWODefectDesigantorWithListResp = responses[1];
            if (getWODefectDesigantorWithListResp && getWODefectDesigantorWithListResp.length) {
              vm.woDefectDesignatorList = [];
              _.forEach(getWODefectDesigantorWithListResp, (item) => {
                var model = {
                  defectCnt: item.defectCnt,
                  wodesignatorID: item.wodesignatorID,
                  defectCatid: item.defectCatid,
                  designatorName: item.designatorName,
                  newCnt: null,
                  totalCount: item.totalCount,
                  noOfPin: item.noOfPin
                };
                vm.woDefectDesignatorList.push(model);

                const defectModel = {
                  defectCatid: item.defectCatid,
                  defectcatName: item.defectcatName
                };
                if (vm.woDefectList.length > 0) {
                  const obj = vm.woDefectList.find((x) => x.defectCatid === item.defectCatid);
                  if (!obj) {
                    vm.woDefectList.push(defectModel);
                  }
                }
                else {
                  vm.woDefectList.push(defectModel);
                }
              });

              _.forEach(vm.woDefectList, (item) => {
                if (!item.designators) {
                  item.designators = [];
                }
                item.designators = _.filter(vm.woDefectDesignatorList, (x) => x.defectCatid === item.defectCatid);
              });
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }

        function getAllDefectCategoryWithList(isSortByPopular) {
          return LogDefectFactory.getAllDefectCategoryWithList().query({
            woID: woID,
            isRework: $scope.logDefectData.isRework
          }).$promise.then((response) => {
            if (response && response.data) {
              _.each(response.data, (item) => {
                var defectcount = 0;
                _.each(item.workorder_assy_designators, (designator) => {
                  defectcount += designator.Count;
                });
                item.totalDefectCount = defectcount;
              });

              vm.defectMainList = response.data;
              if (isSortByPopular || (travelerLogDefectOrderByPref && travelerLogDefectOrderByPref === CORE.SortOption.MostPopular)) {
                vm.sortOption = angular.copy(CORE.SortOption.MostPopular);
                vm.defectMainList = $filter('orderBy')(vm.defectMainList, 'totalDefectCount', true);
              }
              else {
                if (travelerLogDefectOrderByPref) {
                  vm.sortOption = travelerLogDefectOrderByPref;
                }
                else {
                  vm.sortOption = angular.copy(CORE.SortOption.Order);       // Default apply sorting on defect list by their 'order' field
                }
                if (vm.sortOption !== CORE.SortOption.MostPopular) {
                  vm.sortByPopular(vm.sortOption);
                }
              }
              return response.data;
            }
            else {
              vm.defectMainList = [];
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }

        function getWODefectDesigantorWithList() {
          return LogDefectFactory.getWODefectDesigantorWithList().save({ employeeID: employeeID, woTransID: woTransID, woID: woID, opID: opID, serialNo: vm.SerialNo }).$promise.then((response) => {
            if (response && response.data) {
              return response.data;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }

        /* when click on defect category name */
        vm.defClicked = (item) => {
          item.isOpen = !item.isOpen;
          clearDesigBasicDetails(item); // Clear Designator details on close Defect category section
        };

        /* add designator and no of pin details */
        vm.saveDesignator = (defectCat, designatorList) => {
          if (vm.logDefectForm['defectDesigDetForm_' + defectCat.defectCatId].$invalid) {
            BaseService.focusRequiredField(vm.logDefectForm['defectDesigDetForm_' + defectCat.defectCatId]);
            return;
          }

          // allow designatorName name between 1-50 length
          if (!defectCat.designatorName || defectCat.designatorName.length > 50) {
            return;
          }

          const workOrderAssyDesignator = {
            woID: woID,
            designatorName: defectCat.designatorName,
            defectCatid: defectCat.defectCatId,
            opID: opID,
            employeeID: employeeID,
            woOPID: woOPID,
            opName: vm.opName,
            woNumber: $scope.logDefectData.woNumber,
            defectcatName: defectCat.defectcatName,
            noOfPin: defectCat.noOfPin ? defectCat.noOfPin : null
          };

          // UPDATE : designator respected to defect category
          if (defectCat.wodesignatorID) {
            workOrderAssyDesignator.wodesignatorID = defectCat.wodesignatorID;

            vm.cgBusyLoading = LogDefectFactory.updateWorkOrderAssyDesignator().save(workOrderAssyDesignator).$promise.then((response) => {
              if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                const searchDesigText = vm.searchDefectCategory;
                vm.searchDefectCategory = ''; // clear search data

                /* update existing designator binding (right side) */
                const updatedDesignator = _.find(designatorList, (desigItem) => desigItem.wodesignatorID === defectCat.wodesignatorID);
                if (updatedDesignator) {
                  updatedDesignator.designatorName = defectCat.designatorName;
                  updatedDesignator.noOfPin = defectCat.noOfPin;
                }
                const updatedDesignatorDet = {
                  defectCatid: defectCat.defectCatId,
                  wodesignatorID: defectCat.wodesignatorID
                };
                if (searchDesigText) {
                  $timeout(() => {
                    getSetCommonDataAfterSaveDesignator(defectCat, designatorList, updatedDesignatorDet);
                  }, 1500);
                }
                else {
                  getSetCommonDataAfterSaveDesignator(defectCat, designatorList, updatedDesignatorDet);
                }
              }
              else if (response.status === CORE.ApiResponseTypeStatus.EMPTY && response.data) {
                if (response.data.isDefectAlreadyAdded) { // if defect added then not allowed to update designator

                  const errMsgContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WO_DEFECT_DESIGANTOR_ALREADY_IN_USED_FOR_TOTAL);
                  errMsgContent.message = stringFormat(errMsgContent.message, defectCat.designatorName);
                  const alertModel = {
                    messageContent: errMsgContent
                  };

                  const existsDefect = _.find(vm.woDefectList, (defectCatListItem) => defectCatListItem.defectCatid === defectCat.defectCatId);
                  if (existsDefect) {
                    const existsDesig = _.find(existsDefect.designators, (desigListItem) => desigListItem.wodesignatorID === defectCat.wodesignatorID);
                    if (existsDesig) {
                      if (existsDesig.totalCount === existsDesig.defectCnt) {
                        const errMsgContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WO_DEFECT_DESIGANTOR_ALREADY_IN_USED_FOR_CURRENT);
                        errMsgContent.message = stringFormat(errMsgContent.message, existsDesig.designatorName);
                        alertModel.messageContent = errMsgContent;
                      }
                      else {
                        const errMsgContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WO_DEFECT_DESIGANTOR_ALREADY_IN_USED_FOR_TOTAL);
                        errMsgContent.message = stringFormat(errMsgContent.message, existsDesig.designatorName);
                        alertModel.messageContent = errMsgContent;
                      }
                    }
                  }

                  DialogFactory.messageAlertDialog(alertModel).then(() => {
                    focusDefectDesigAddUpdate(defectCat);
                  }).catch((error) => BaseService.getErrorLog(error));
                }
                // if designator already added then not allowed to add same designator
                else if (response.data.isSameDesignatorAlreadyExists && response.data.userDefinedMessage && response.data.woAssyDesigExistsDet) {
                  const alertModel = {
                    messageContent: response.data.userDefinedMessage
                  };

                  DialogFactory.messageAlertDialog(alertModel).then(() => {
                    focusDefectDesigAddUpdate(defectCat);
                  }).catch((error) => BaseService.getErrorLog(error));
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
          // CREATE : add new designator respected to defect category
          else {
            vm.cgBusyLoading = LogDefectFactory.createWorkOrderAssyDesignator().save(workOrderAssyDesignator).$promise.then((response) => {
              if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
                const searchDesigText = vm.searchDefectCategory;
                vm.searchDefectCategory = ''; // clear search data

                const model = {
                  defectCatid: defectCat.defectCatId,
                  designatorName: defectCat.designatorName,
                  noOfPin: defectCat.noOfPin ? defectCat.noOfPin : null,
                  wodesignatorID: response.data.wodesignatorID
                };

                designatorList.push(model);
                const newlyAddedDesignatorDefect = {
                  defectCatid: defectCat.defectCatId,
                  wodesignatorID: response.data.wodesignatorID
                };

                if (searchDesigText) {
                  $timeout(() => {
                    getSetCommonDataAfterSaveDesignator(defectCat, designatorList, newlyAddedDesignatorDefect);
                  }, 1500);
                }
                else {
                  getSetCommonDataAfterSaveDesignator(defectCat, designatorList, newlyAddedDesignatorDefect);
                }
              }
              else if (response && response.status === CORE.ApiResponseTypeStatus.EMPTY && response.data) {
                // if designator already added then not allowed to add same designator
                if (response.data.isSameDesignatorAlreadyExists && response.data.userDefinedMessage && response.data.woAssyDesigExistsDet) {
                  const alertModel = {
                    messageContent: response.data.userDefinedMessage
                  };

                  DialogFactory.messageAlertDialog(alertModel).then(() => {
                    focusDefectDesigAddUpdate(defectCat);
                    /* highlight already added designator */
                    const existsDefect = _.find(vm.woDefectList, (defectCatListItem) => defectCatListItem.defectCatid === workOrderAssyDesignator.defectCatid);
                    if (existsDefect) {
                      const existsDesig = _.find(existsDefect.designators, (desigListItem) => desigListItem.designatorName.trim().toUpperCase() === workOrderAssyDesignator.designatorName.trim().toUpperCase()
                        && desigListItem.noOfPin === workOrderAssyDesignator.noOfPin);
                      if (existsDesig) {
                        resetHighLightedDivForWoDefectList(existsDesig);
                        scrollToCurrentDesigDefect(existsDesig);
                      }
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        };

        const getSetCommonDataAfterSaveDesignator = (defectCat, designatorList, newlyAddedDesignatorDefect) => {
          clearSelectedDesigUpdateMode(defectCat);
          $filter('orderBy')(designatorList, 'designatorName');
          getWODefectDesgList(newlyAddedDesignatorDefect); /* update existing designator binding (left side - with defect count) */
        };

        /* clear desig details */
        vm.cancelDesignatorDet = (defectCat) => {
          const isdirty = checkFormDirty(vm.logDefectForm['defectDesigDetForm_' + defectCat.defectCatId]);
          if (isdirty) {
            const confmMsgContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_LEAVE_SELECTED);
            confmMsgContent.message = stringFormat(confmMsgContent.message, 'selected designator');
            const obj = {
              messageContent: confmMsgContent,
              btnText: CORE.MESSAGE_CONSTANT.LEAVE_BUTTON,
              canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                clearSelectedDesigUpdateMode(defectCat);
              }
            }, (error) => BaseService.getErrorLog(error));
          } else {
            clearSelectedDesigUpdateMode(defectCat);
          }
        };

        const clearSelectedDesigUpdateMode = (defectCat) => {
          clearDesigBasicDetails(defectCat);
          _.each(vm.defectMainList, (defectListItem) => {
            vm.logDefectForm['defectDesigDetForm_' + defectListItem.defectCatId].$setPristine();
            vm.logDefectForm['defectDesigDetForm_' + defectListItem.defectCatId].$setUntouched();
          });
        };

        /* added validation to check defect count allowed to remove   */
        const checkDefectCountRemoveAllowed = (designator) => {
          if (vm.disableFromTraveler || (designator.newCnt <= 0 && ((designator.defectCnt === 0 || designator.totalCount === 0)
            || (Math.abs(designator.newCnt) > designator.defectCnt || Math.abs(designator.newCnt) > designator.totalCount)))) {
            const errMsgContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CHECK_WO_DESIGNATOR_ADDED_DEFECT_INVALID);
            errMsgContent.message = stringFormat(errMsgContent.message, designator.defectCnt, designator.newCnt);
            const alertModel = {
              messageContent: errMsgContent
            };

            DialogFactory.messageAlertDialog(alertModel).then(() => {
              document.querySelector('#defectNewCnt_' + designator.wodesignatorID).focus();
            }).catch((error) => BaseService.getErrorLog(error));
            designator.newCnt = null; //  after add/remove defect count , set blank data
            return false;
          }
          else {
            return true;
          }
        };

        /* called when user press minus(-) button to remove defect count */
        vm.minusTempDefect = (defectCatId, designator) => {
          designator.newCnt = null;
          vm.addDesignatorDefect(defectCatId, designator, -1, false);
        };

        /* called when user press add(+) button to add defect count */
        vm.incrementDefect = (defectCatId, designator) => {
          designator.newCnt = null;
          vm.addDesignatorDefect(defectCatId, designator, 1, false);
        };

        /* called when manually write defect count to add ot minus */
        vm.addDefectCount = ($event, designator) => {
          var keyCode = $event ? ($event.which || $event.keyCode) : '';
          var isAdded = (keyCode) ? ((keyCode === 13) ? true : false) : true;
          if (isAdded && designator.newCnt) {
            if (!checkDefectCountRemoveAllowed(designator)) {
              return;
            }
            vm.addDesignatorDefect(designator.defectCatid, designator, designator.newCnt, false);
          }
        };

        /* to create or update designator details */
        vm.addDesignatorDefect = (defectCatId, woAssDesi, count, isCalledDirectlyFromUI) => {
          resetHighLightedDivForWoDefectList(woAssDesi);
          if (!vm.disableFromTraveler) {
            const model = {
              woID: woID,
              opID: opID,
              woTransID: woTransID,
              employeeID: employeeID,
              wodesignatorID: woAssDesi.wodesignatorID,
              defectCnt: count,
              defectCatId: defectCatId,
              serialNo: vm.SerialNo,
              woOPID: woOPID,
              opName: vm.opName,
              woNumber: $scope.logDefectData.woNumber,
              designatorName: woAssDesi.designatorName,
              isRework: $scope.logDefectData.isRework
            };
            vm.cgBusyLoading = LogDefectFactory.manageWorkOrderAssyDefectDesignators().save(model).$promise.then((response) => {
              if (response && response.data && response.data[0]) {
                getDPMOForWo();
                woAssDesi.newCnt = null; //  after add/remove defect count , set blank data
                const defectDesignator = response.data[0];
                const detailModel = {
                  defectCnt: defectDesignator.defectCnt,
                  wodesignatorID: defectDesignator.wodesignatorID,
                  defectCatid: defectDesignator.defectCatid,
                  designatorName: defectDesignator.designatorName,
                  totalCount: defectDesignator.totalCount,
                  newCnt: null //defectDesignator.defectCnt ? defectDesignator.defectCnt : 1
                };

                // Add or remove designator detail
                const obj = vm.woDefectList.find((x) => x.defectCatid === defectDesignator.defectCatid);
                if (obj) {
                  const defObj = obj.designators.find((x) => x.wodesignatorID === defectDesignator.wodesignatorID);
                  if (defObj) {
                    defObj.isHighlightDesignator = true; // to highlight current designator
                    defObj.defectCnt = defectDesignator.defectCnt;
                    defObj.totalCount = defectDesignator.totalCount;
                    if (defObj.defectCnt < 0) {
                      _.remove(obj.designators, defObj);
                    }
                    if (obj.designators.length < 0) {
                      _.remove(vm.woDefectList, obj);
                    }
                  }
                  else {
                    obj.designators.push(detailModel);
                  }
                }
                else {
                  vm.woDefectList.push({
                    defectCatid: defectDesignator.defectCatid,
                    defectcatName: defectDesignator.defectcatName,
                    designators: [detailModel]
                  });
                }
                if (isCalledDirectlyFromUI) {
                  scrollToCurrentDesigDefect(detailModel); // to scroll move to current div
                }
                vm.logDefectForm['desigDefectCountForm_' + defectDesignator.defectCatid].$setPristine();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        };

        vm.addDefect = function (ev) {
          if (!vm.disableFromTraveler) {
            DialogFactory.dialogService(USER.ADMIN_DEFECTCATEGORY_ADD_MODAL_CONTROLLER, USER.ADMIN_DEFECTCATEGORY_ADD_MODAL_VIEW, ev, null)
              .then(() => {
                // success/true bloack
              }, (insertedData) => {
                if (insertedData) {
                  const isGettingList = vm.isSerialNoRequired ? (vm.SerialNo ? true : false) : true;
                  if (isGettingList) {
                    getAllDefectCategoryWithList();
                  }
                }
              }, (error) => BaseService.getErrorLog(error));
          }
        };

        /* to update designator details like name and no of pin (right click on designator name and click on "UPDATE" button)  */
        vm.updateDesignator = (desigItem, defectCat) => {
          if (desigItem.wodesignatorID) {
            defectCat.designatorName = desigItem.designatorName;
            defectCat.noOfPin = desigItem.noOfPin;
            defectCat.wodesignatorID = desigItem.wodesignatorID;
            focusDefectDesigAddUpdate(defectCat);
          }

          /* highlight designator */
          const selectedDefect = _.find(vm.woDefectList, (defectCatListItem) => defectCat.defectCatId === defectCatListItem.defectCatid);
          if (selectedDefect) {
            const selectedDesig = _.find(selectedDefect.designators, (desigListItem) => desigItem.wodesignatorID === desigListItem.wodesignatorID);
            if (selectedDesig) {
              resetHighLightedDivForWoDefectList(selectedDesig);
              scrollToCurrentDesigDefect(selectedDesig);
            }
          }
        };

        vm.deleteDesignator = (desigItem, defectCat) => {
          var model = {
            woID: woID,
            opID: opID,
            employeeID: employeeID,
            wodesignatorID: desigItem.wodesignatorID,
            designatorName: desigItem.designatorName,
            woOPID: woOPID,
            opName: vm.opName,
            woNumber: $scope.logDefectData.woNumber
          };

          const confmMsgContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_DELETE_CONFIRMATION);
          confmMsgContent.message = stringFormat(confmMsgContent.message, 'Designator' + ' ' + desigItem.designatorName);
          const obj = {
            messageContent: confmMsgContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.cgBusyLoading = LogDefectFactory.deleteWorkOrderAssyDesignators().save(model).$promise.then((response) => {
                if (response && response.data && response.data.isAlreadyUsed) {
                  //resetHighLightedDivForWoDefectList(item);
                  //resetHighLightedDivForDefectMainList(item);

                  /* highlight designator */
                  const selectedDefect = _.find(vm.woDefectList, (defectCatListItem) => defectCat.defectCatId === defectCatListItem.defectCatid);
                  if (selectedDefect) {
                    const selectedDesig = _.find(selectedDefect.designators, (desigListItem) => desigItem.wodesignatorID === desigListItem.wodesignatorID);
                    if (selectedDesig) {
                      resetHighLightedDivForWoDefectList(selectedDesig);
                      scrollToCurrentDesigDefect(selectedDesig);
                    }
                  }

                  //scrollToCurrentDesigDefect(item);
                  const alertModel = {
                    messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WO_DESIGNATOR_ALREADY_USED)
                  };
                  DialogFactory.messageAlertDialog(alertModel);
                  return;
                }
                else {
                  _.each(vm.defectMainList, (defects) => {
                    _.remove(defects.workorder_assy_designators, (designatorItem) => designatorItem.wodesignatorID === desigItem.wodesignatorID);
                    clearDesigBasicDetails(defects);
                  });
                  _.each(vm.woDefectList, (defects) => {
                    _.remove(defects.designators, (designItem) => designItem.wodesignatorID === desigItem.wodesignatorID);
                  });
                  getDPMOForWo();
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
            // cancel block
          }).catch((error) => BaseService.getErrorLog(error));
        };

        // Apply Sorting on Defect category list (LeftSide section)
        vm.sortByPopular = (option) => {
          setLocalStorageValue('TravelerLogDefectOrderByPref', option);
          if (option === CORE.SortOption.Order) {
            vm.defectMainList = $filter('orderBy')(vm.defectMainList, 'order');
          }
          else if (option === CORE.SortOption.MostPopular) {
            vm.cgBusyLoading = getAllDefectCategoryWithList(true);
          }
          else if (option === CORE.SortOption.Name) {
            vm.defectMainList = $filter('orderBy')(vm.defectMainList, 'defectcatName');
          }
        };

        // Socket.io receiver from traveler page
        $scope.$on(CORE.NOTIFICATION_MESSAGETYPE.WO_TRANS_ASSY_DEFECT.TYPE, (event, data) => {
          if (woID === data.woID && opID === data.opID && (!data.serialNo || vm.SerialNoDetail.SerialNo === data.serialNo)) {
            const obj = vm.woDefectList.find((x) => x.defectCatid === data.defectCatid);
            if (obj) {
              const designator = obj.designators.find((x) => x.wodesignatorID === data.wodesignatorID);
              if (designator) {
                designator.totalCount = data.totalCount;
                $scope.$applyAsync();
              }
            }
          }
        });

        // Socket.io receiver from traveler page    for (Added new assambly designator)
        $scope.$on(CORE.NOTIFICATION_MESSAGETYPE.WO_ASSY_DESIGNATOR.TYPE, (event, data) => {
          if (woID === data.woID
            && opID === data.opID) {
            const obj = vm.defectMainList.find((x) => x.defectCatId === data.defectCatid);
            if (obj) {
              let designators = obj.workorder_assy_designators.find((x) => x.wodesignatorID === data.wodesignatorID);
              if (!designators) {
                designators = {
                  defectCatid: data.defectCatid,
                  designatorName: data.designatorName,
                  wodesignatorID: data.wodesignatorID
                };

                obj.workorder_assy_designators.push(designators);

                ////////////////////// Add in main array
                const model = {
                  defectCnt: 0,
                  wodesignatorID: data.wodesignatorID,
                  defectCatid: data.defectCatid,
                  designatorName: data.designatorName,
                  totalCount: 0,
                  newCnt: 1
                };
                vm.woDefectDesignatorList.push(model);
                _.forEach(vm.woDefectList, (item) => {
                  if (!item.designators) {
                    item.designators = [];
                  }
                  item.designators = _.filter(vm.woDefectDesignatorList, (x) => x.defectCatid === item.defectCatid);
                });
                ////////////////////// Add in main array
                $scope.$applyAsync();
              }
            }
          }
        });


        // Socket.io receiver from traveler page : update designator details
        $scope.$on(CORE.NOTIFICATION_MESSAGETYPE.WO_ASSY_DESIGNATOR_UPDATE.TYPE, (event, data) => {
          if (woID === data.woID && opID === data.opID) {
            if (vm.isSerialNoRequired) {
              vm.serialNo_Model = {
                from_SerialNo: null,
                to_serialNo: null
              };
              //get Work Order Serial# by WoID
              workOrderSerialList().then(() => {
                initAutoCompleteForWorkorderSerials();
              });
            }
            else {
              init();
            }
            $scope.$applyAsync();
          }
        });

        // Socket.io receiver from traveler page
        $scope.$on(CORE.NOTIFICATION_MESSAGETYPE.WO_ASSY_DESIGNATOR_REMOVE.TYPE, (event, data) => {
          if (woID === data.woID
            && opID === data.opID) {
            _.each(vm.defectMainList, (defects) => {
              _.remove(defects.workorder_assy_designators, (designatorItem) => designatorItem.wodesignatorID === data.wodesignatorID);
            });
            _.each(vm.woDefectList, (defects) => {
              _.remove(defects.designators, (designItem) => designItem.wodesignatorID === data.wodesignatorID);
            });
            $scope.$applyAsync();
          }
        });

        //vm.ExpandList = (defectDesigantorList) => {
        //    if (defectDesigantorList.workorder_assy_designators == defectDesigantorList.limitQuantity) {
        //        defectDesigantorList.limitQuantity = CORE.DefaultListCount;
        //        defectDesigantorList.expandLabel = "More";
        //        defectDesigantorList.isOpenChild = false;
        //    }
        //    else {
        //        defectDesigantorList.limitQuantity = defectDesigantorList.workorder_assy_designators;
        //        defectDesigantorList.expandLabel = "Less";
        //        defectDesigantorList.isOpenChild = true;
        //    }
        //}

        /* called for max length validation */
        vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

        /* refresh work order header */
        const refreshWorkOrderHeaderDetails = () => {
          $timeout(() => {
            $scope.$emit('refreshWorkOrderHeaderDetails', null);
          }, _configBreadCrumbTimeout);
        };

        /* function for doing all Defect Expand Collapse  */
        vm.setDefectExpandCollapse = () => {
          vm.isAllExpanded = !vm.isAllExpanded;
          _.each(vm.defectMainList, (defectItem) => {
            clearDesigBasicDetails(defectItem);
            defectItem.isOpen = vm.isAllExpanded;
          });
        };

        /* when search text added tjat time called for searching Desig and Defect */
        vm.searchDesigAndDefect = () => {
          if (vm.searchDefectCategory) {
            vm.isSearchDataExists = _.some(vm.defectMainList, (defectCatListItem) =>
              (_.some(defectCatListItem.workorder_assy_designators, (desigItem) =>
                desigItem.designatorName.toLowerCase().indexOf(vm.searchDefectCategory.toLowerCase()) >= 0
              ))
            );
          }
          else {
            vm.isSearchDataExists = true;
          }

          vm.isAllExpanded = vm.searchDefectCategory ? false : true; // put reverse condition
          vm.setDefectExpandCollapse();
        };

        /* to reset border selection div as active div (designator with defect list) */
        const resetHighLightedDivForWoDefectList = (selectedDesignator) => {
          _.each(vm.woDefectList, (defectCat) => {
            _.each(defectCat.designators, (desigItem) => {
              desigItem.isHighlightDesignator = false;
            });
          });
          if (selectedDesignator) {
            selectedDesignator.isHighlightDesignator = true; //
          }
        };

        /* to reset border selection div as active div (designator list) */

        /* function takes scroll to current selection div */
        const scrollToCurrentDesigDefect = (currentDesigItem) => {
          $('#scrollToDesigDefect').animate({
            scrollTop: 0
          });
          $timeout(() => {
            $('#scrollToDesigDefect').animate({
              scrollTop: $('#' + 'curr_desig_defect_div_' + currentDesigItem.wodesignatorID).position().top
            });
          }, 500);
        };

        /* to clear add/updated designator details */
        const clearDesigBasicDetails = (defectCat) => {
          defectCat.wodesignatorID = '';
          defectCat.designatorName = '';
          defectCat.noOfPin = '';
        };

        const focusDefectDesigAddUpdate = (defectCat) => {
          document.querySelector('#desigName_' + defectCat.defectCatId).focus();
        };

        const checkFormDirty = (form) => {
          const checkDirty = BaseService.checkFormDirty(form);
          return checkDirty;
        };

        vm.closeSidenav = () => {
          let isAnyDefectDesigDetFormDirty = false;
          _.each(vm.defectMainList, (defectCat) => {
            const isdirty = checkFormDirty(vm.logDefectForm['defectDesigDetForm_' + defectCat.defectCatId]);
            if (isdirty) {
              isAnyDefectDesigDetFormDirty = true;
              const data = {
                form: vm.logDefectForm
              };
              showWithoutSavingAlertForPopUp(data);
              return false;
            }
          });
          if (!isAnyDefectDesigDetFormDirty) {
            _.each(vm.woDefectList, (defectCat) => {
              const isdirty = checkFormDirty(vm.logDefectForm['desigDefectCountForm_' + defectCat.defectCatid]);
              if (isdirty) {
                isAnyDefectDesigDetFormDirty = true;
                const data = {
                  form: vm.logDefectForm
                };
                showWithoutSavingAlertForPopUp(data);
                return false;
              }
            });
          }
          if (!isAnyDefectDesigDetFormDirty) {
            BaseService.currentPagePopupForm.pop();
            $mdSidenav('log-defect').close();
          }
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
              $mdSidenav('log-defect').close();
            }
          }, () => {
            // cancel block
          }).catch((error) => BaseService.getErrorLog(error));
        };

        // to not display validation message like required for enter key press
        vm.defectMainListRepeatFinished = () => {
          preventFormSubmit(false);
        };
      }]
      // link: function (scope, elem, attr) {
      //   var vm = scope.vm;
      //   //scope.closeSidenav = function () {
      //   //    $mdSidenav('log-defect').close();
      //   //}
      // }
    };
  }
})();
