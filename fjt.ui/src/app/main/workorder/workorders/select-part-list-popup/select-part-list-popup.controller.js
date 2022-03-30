(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ShowPartListPopUpController', ShowPartListPopUpController);

  /** @ngInject */
  function ShowPartListPopUpController($filter, $scope, $q, $mdDialog, WORKORDER, data, USER, OPERATION, CORE, $timeout,
    WorkorderOperationFactory, WorkorderOperationPartFactory, DialogFactory, BaseService, NotificationSocketFactory, MasterFactory) {
    let loginUserDetails = BaseService.loginUser;
    const vm = this;
    vm.data = data;
    vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.OPERATION;
    vm.headeTitle = vm.data.isFromWOPartList ? CORE.LabelConstant.SuppliesMaterialsAndTools.PageName : CORE.LabelConstant.Operation.PageName;
    var cgPromise = [];
    var validateFluxTypeErr = 0;
    vm.selectedSMTDetFromAutoComplete = null;
    let restrictPartAuthenticationList = [];
    vm.labelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;

    /* goto Assembly List Page */
    vm.goToAssemblyList = () => {
      BaseService.goToPartList();
      return false;
    };
    /* goto assembly detail page */
    vm.goToAssemblyDetails = () => {
        BaseService.goToComponentDetailTab(null, data.headerdata.partID);
      return false;
    };
    /* go to workorder list */
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };
    /* go to particular workorder detail */
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(data.woID);
      return false;
    };
    if (data.isFromWOPartList) {
      // toDo for header of supplies material & tool selection
      vm.headerdata = [];
      vm.headerdata.push({
        value: data.headerdata.PIDCode,
        label: CORE.LabelConstant.Assembly.ID,
        displayOrder: (vm.headerdata.length + 1),
        labelLinkFn: vm.goToAssemblyList,
        valueLinkFn: vm.goToAssemblyDetails,
        isCopy: true,
        imgParms: {
          imgPath: data.headerdata.rohsIcon,
          imgDetail: data.headerdata.rohsName
        }
      }, {
        value: data.workorderInfo.woNumber,
        label: CORE.LabelConstant.Workorder.WO,
        displayOrder: (vm.headerdata.length + 1),
        labelLinkFn: vm.goToWorkorderList,
        valueLinkFn: data.woID ? vm.goToWorkorderDetails : null
      });
    } else {
      // todo for header of operation selection
      vm.headerdata = data.headerdata;
    }
    // [S] Get WO details for notification
    var workorderDetails = null;
    let getWorkorderByID = () => {
      return MasterFactory.getWODetails().query({ woID: data.woID }).$promise.then((response) => {
        if (response && response.data) {
          workorderDetails = response.data;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    // [E] Get WO details for notification

    /* get selected smt part details that added in wo */
    vm.getPartList = () => {
      vm.selectedSMTDetFromAutoComplete = null;
      vm.PartList = [];
      return WorkorderOperationPartFactory.retrivePartListbyWoID().save({
        woID: vm.data.woID,
        searchText: null,
        woAssyID: vm.data.workorderInfo.partID
      }).$promise.then((part) => {

        //return MasterFactory.getPartList().query({
        //    partID: vm.data.partID
        //}).$promise.then((part) => {

        ///* in refresh auto complete case - remove already added component */
        //if (vm.data.alreadyAddedPartIDsInWo && vm.data.alreadyAddedPartIDsInWo.length > 0) {
        //    part.data = part.data.filter(o1 => !vm.data.alreadyAddedPartIDsInWo.some(o2 => o1.id === o2));
        //}
        //_.each(part.data, (item) => {
        //    if (item.imageURL) {
        //        if (!item.imageURL.startsWith('http://') && !item.imageURL.startsWith('https://')) {
        //            item.imageURL = CORE.WEB_URL + USER.COMPONENT_BASE_PATH + item.imageURL;
        //        }
        //        item.ProfilePic = item.imageURL;
        //    }
        //    else {
        //        item.ProfilePic = item.imageURL = CORE.WEB_URL + USER.COMPONENT_DEFAULT_IMAGE_PATH + 'profile.jpg';
        //    }
        //});
        //return $q.resolve(vm.PartList);

        if (vm.data && vm.data.partID != null) {
          $timeout(function () {
            if (vm.autoCompletePart.inputName) {
              let matchedSelectedPart = _.find(vm.PartList, (partDBItem) => {
                return partDBItem.id == vm.data.partID
              })
              if (matchedSelectedPart) {
                $scope.$broadcast(vm.autoCompletePart.inputName, matchedSelectedPart);
              }
              //$scope.$broadcast(vm.autoCompletePart.inputName, part.data[0]);
            }
          });
        }
        vm.PartList = part.data;
        return $q.resolve(part.data);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    /* get all smt part details that not added in wo */
    let retrieveNotAddedPartList = (searchObj) => {
      vm.selectedSMTDetFromAutoComplete = null;
      vm.PartList = [];
      return WorkorderOperationPartFactory.getNotAddedSMTPartListInWO().save({
        woID: vm.data.woID,
        searchText: searchObj.searchText,
        woAssyID: workorderDetails.partID
      }).$promise.then((res) => {
        _.each(res.data, (item) => {
          if (item.imageURL) {
            if (!item.imageURL.startsWith('http://') && !item.imageURL.startsWith('https://')) {
              item.imageURL = BaseService.getPartMasterImageURL(item.documentPath, item.imageURL);
            }
            item.ProfilePic = item.imageURL;
          }
          else {
            item.ProfilePic = item.imageURL = CORE.WEB_URL + USER.COMPONENT_DEFAULT_IMAGE_PATH + 'profile.jpg';
          }
          item.iconList = [];
          if (item.isFluxNotApplicable === 1) {
            item.iconList.push(CORE.FluxTypeIcon.notApplicableIcon);
          }
          if (item.isNoClean === 1) {
            item.iconList.push(CORE.FluxTypeIcon.noCleanIcon);
            //item.icon = CORE.FluxTypeIcon.noCleanIcon;
          }
          if (item.isWaterSoluble === 1) {
            item.iconList.push(CORE.FluxTypeIcon.waterSolubleIcon);
            //item.icon = CORE.FluxTypeIcon.waterSolubleIcon;
          }
        });
        if (searchObj && searchObj.id != null) {
          $timeout(function () {
            if (vm.autoCompletePart.inputName) {
              let selectedPart = _.find(res.data, (item) => {
                return item.id == searchObj.id;
              })
              if (selectedPart) {
                $scope.$broadcast(vm.autoCompletePart.inputName, selectedPart);
              }
            }
          });
        }
        vm.PartList = res.data;
        return $q.resolve(res.data);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    vm.getOperationList = () => {
      vm.WoOperationList = [];
      return WorkorderOperationFactory.retriveOPListbyWoID().query({ woID: data.woID }).$promise.then((operationlist) => {
        _.each(operationlist.data, (item) => {
          item.opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, item.opName, item.opNumber);
          item.fluxTypeList = [];
          item.fluxTypeList.push({
            value: item.isFluxNotApplicable, icon: CORE.FluxTypeIcon.notApplicableIcon, toolTip: CORE.FluxTypeToolTip.notApplicable, isShowIcon: true
          });
          item.fluxTypeList.push({
            value: item.isNoClean, icon: CORE.FluxTypeIcon.noCleanIcon, toolTip: CORE.FluxTypeToolTip.noClean, isShowIcon: true
          });
          item.fluxTypeList.push({
            value: item.isWaterSoluble, icon: CORE.FluxTypeIcon.waterSolubleIcon, toolTip: CORE.FluxTypeToolTip.waterSoluble, isShowIcon: true
          });
        });
        vm.WoOperationList = operationlist.data;
        return $q.resolve(vm.WoOperationList);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    /* on select part from auto complete smt */
    let getSetSelectedPartAsSMTDetails = (selectedItem) => {
      vm.selectedSMTDetFromAutoComplete = selectedItem;
    }

    let initAutoComplete = () => {
      //vm.autoCompletePart = {
      //    columnName: 'PIDCode',
      //    controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
      //    viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
      //    keyColumnName: 'id',
      //    keyColumnId: vm.selectedPartID ? vm.selectedPartID : null,
      //    inputName: 'Part',
      //    placeholderName: CORE.LabelConstant.SuppliesMaterialsAndTools.PageName,
      //    isRequired: true,
      //    isAddnew: true,
      //    isDisabled: vm.data.isFromWOPartList ? false : true,
      //    addData: { mfgType: CORE.MFG_TYPE.MFG },
      //    callbackFn: vm.getPartList
      //};
      vm.autoCompletePart = {
        columnName: 'PIDCode',
        //parentColumnName: '',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Part',
        placeholderName: CORE.LabelConstant.SuppliesMaterialsAndTools.PageName,
        isRequired: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName
        },
        isAddnew: true,
        isDisabled: vm.data.isFromWOPartList ? false : true,
        callbackFn: function (obj) {
          let searchObj = {
            searchText: obj ? obj.id : ''
          }
          return retrieveNotAddedPartList(searchObj);
        },
        onSelectCallbackFn: getSetSelectedPartAsSMTDetails,
        onSearchFn: function (query) {
          let searchObj = {
            searchText: query
          }
          return retrieveNotAddedPartList(searchObj);
        }
      };
    }



    if (!vm.data.isFromWOPartList) {
      let searchObj = {
        searchText: '',
        id: vm.data.partID
      }
      cgPromise = [getWorkorderByID(), vm.getPartList()];
      vm.cgBusyLoading = $q.all(cgPromise).then((responses) => {
        //vm.selectedPartID = vm.data.partID;
        vm.WoOperationList = data.list;
        initAutoComplete();
      });
    }
    else {
      cgPromise = [getWorkorderByID(), vm.getOperationList()];
      vm.cgBusyLoading = $q.all(cgPromise).then((responses) => {
        initAutoComplete();
      });
    }

    /* save selected part with op details */
    vm.save = (event) => {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.partForm, false)) {
        vm.saveDisable = false;
        return;
      }

      if (vm.WoOperationList.length > 0) {
        restrictPartAuthenticationList = [];
        let opSelectedlist = _.filter(vm.WoOperationList, (op) => { return op.selected == true; });
        let op_part_list = [];
        _.each(opSelectedlist, (item) => {
          let obj = {};
          obj.woID = vm.data.woID;
          obj.opID = item.opID;
          obj.woOPID = item.woOPID;
          obj.partID = vm.autoCompletePart.keyColumnId ? vm.autoCompletePart.keyColumnId : null;
          obj.opFullName = item.opName;
          obj.isFluxNotApplicable = item.isFluxNotApplicable;
          obj.isNoClean = item.isNoClean;
          obj.isWaterSoluble = item.isWaterSoluble;
          obj.partStatus = vm.selectedSMTDetFromAutoComplete.partStatus; // get status of selected part
          obj.PIDCode = vm.selectedSMTDetFromAutoComplete.PIDCode;
          op_part_list.push(obj);
        });
        if (op_part_list.length > 0) {
          /* check if any TBD RoHS part exists then not allowed to add any part */
          if (vm.selectedSMTDetFromAutoComplete.isTBDROHSPart) {
            let TBDRohsPartList = [];
            TBDRohsPartList.push(vm.selectedSMTDetFromAutoComplete);
            let restrictPartDet = {
              restrictedPartList: TBDRohsPartList,
              alertMessage: WORKORDER.SMT.NOT_ALLOW_TBD_ROHS_PART_ACCESS
            }
            openRestrictedPartPopup(restrictPartDet);
            return;
          }

          /* check if any permanent restricted part exists then not allowed to add any part */
          if (vm.selectedSMTDetFromAutoComplete.restrictUsePermanently || vm.selectedSMTDetFromAutoComplete.restrictPackagingUsePermanently
            || vm.selectedSMTDetFromAutoComplete.restrictUseInBOMStep) {
            let permanentlyRestrictedPartList = [];
            permanentlyRestrictedPartList.push(vm.selectedSMTDetFromAutoComplete);
            let restrictPartDet = {
              restrictedPartList: permanentlyRestrictedPartList,
              alertMessage: WORKORDER.SMT.PERMANENT_RESTRICTED_PART_NOT_ALLOWED
            }
            openRestrictedPartPopup(restrictPartDet);
            return;
          }

          /* check if any restricted part with permission exists then ask for authentication */
          if (vm.selectedSMTDetFromAutoComplete.restrictUSEwithpermission || vm.selectedSMTDetFromAutoComplete.restrictPackagingUseWithpermission
            || vm.selectedSMTDetFromAutoComplete.restrictUseInBOMWithPermissionStep) {

            const data = {
              featureName: CORE.FEATURE_NAME.AllowRestrictWithPermission,
              isAllowSaveDirect: false,
              msgObject: {}
            };

            DialogFactory.dialogService(
              CORE.RESTRICT_ACCESS_CONFIRMATION_MODAL_CONTROLLER,
              CORE.RESTRICT_ACCESS_CONFIRMATION_MODAL_VIEW,
              event, data).then((resOfAuthData) => {
                if (resOfAuthData) {
                  let _restrictPartAuthenticationDet = {
                    refID: null,
                    refTableName: CORE.TABLE_NAME.WORKORDER_OPERATION_PART,
                    isAllowSaveDirect: false,
                    approveFromPage: CORE.PageName.FullName.wo_suppliesMaterialsAndTools,
                    approvedBy: resOfAuthData.approvedBy,
                    approvalReason: resOfAuthData.approvalReason,
                    createdBy: loginUserDetails.userid,
                    confirmationType: CORE.Generic_Confirmation_Type.WO_SUPPLIES_MAT_TOOLS_RESTRICT_WITH_PERMISSION_ADD,
                    updatedBy: loginUserDetails.userid
                  }
                  restrictPartAuthenticationList = [];
                  _.each(op_part_list, (opItem) => {
                    let partAuthDet = angular.copy(_restrictPartAuthenticationDet);
                    partAuthDet.transactionType = stringFormat(CORE.MESSAGE_CONSTANT.GENERIC_AUTHENTICATION_REASON.WO_SUPPLIES_MAT_TOOLS_RESTRICT_WITH_PERMISSION_ADD,
                      vm.selectedSMTDetFromAutoComplete.PIDCode, vm.data.workorderInfo.woNumber, opItem.opFullName);
                    partAuthDet.woOPID = opItem.woOPID;
                    restrictPartAuthenticationList.push(partAuthDet);
                  });
                  //askForRevisionPopUp(op_part_list);
                  addNewPart(op_part_list, null);
                }
                else {
                  vm.saveDisable = false;
                }
              }, () => {
                vm.saveDisable = false;
              }).catch((error) => {
                vm.saveDisable = false;
                return BaseService.getErrorLog(error);
              });
          }
          else {
            //askForRevisionPopUp(op_part_list);
            addNewPart(op_part_list, null);
          }

        } else {
          DialogFactory.alertDialog({
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: CORE.MESSAGE_CONSTANT.SELECET_OPERATION,
            multiple: true
          });
          vm.saveDisable = false;
        }
      }
      else {
        DialogFactory.alertDialog({
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: vm.EmptyMesssage.NO_SELECTED,
          multiple: true
        });
        vm.saveDisable = false;
      }
    };

    /* check wo published then ask for revision popup */
    //let askForRevisionPopUp = (op_part_list) => {

    //  if (workorderDetails && workorderDetails.woStatus == CORE.WOSTATUS.PUBLISHED) {
    //    openWORevisionPopup(data.woID, function (versionModel) {
    //      // Added for close revision dialog popup
    //      if (versionModel && versionModel.isCancelled) {
    //        vm.saveDisable = false;
    //        return;
    //      }
    //      addNewPart(op_part_list, versionModel);
    //    }, event);
    //  }
    //  else {
    //    addNewPart(op_part_list, null);
    //  }
    //}
    const validateFluxTypePartAgainstOperation = (op_part_list) => {
      validateFluxTypeErr = 0;
      const errMsg = '<br/>Following operation(s) not allowed:';
      let partConfigMsg;
      let errOp = '<ui>';
      if (vm.selectedSMTDetFromAutoComplete.isNoClean === 0 && vm.selectedSMTDetFromAutoComplete.isWaterSoluble === 0 && vm.selectedSMTDetFromAutoComplete.isFluxNotApplicable === 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PART_FLUX_TYPE_NOT_CONFIGURED);
        messageContent.message = stringFormat(messageContent.message, vm.selectedSMTDetFromAutoComplete.PIDCode);
        const obj = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(obj);
        validateFluxTypeErr = 1;
        return;
      }
      //validate part flux type against each operation
      if (vm.selectedSMTDetFromAutoComplete.isFluxNotApplicable === 1) {
        partConfigMsg = 'Supplies, Materials & Tools configured as Flux Type-not applicable';
      } else if (vm.selectedSMTDetFromAutoComplete.isNoClean === 1 && vm.selectedSMTDetFromAutoComplete.isWaterSoluble === 1) {
        partConfigMsg = 'Supplies, Materials & Tools configured as No-Clean and Water-Soluble.';
      } else if (vm.selectedSMTDetFromAutoComplete.isNoClean === 1 && vm.selectedSMTDetFromAutoComplete.isWaterSoluble === 0) {
        partConfigMsg = 'Supplies, Materials & Tools configured as No-Clean.';
      } else if (vm.selectedSMTDetFromAutoComplete.isNoClean === 0 && vm.selectedSMTDetFromAutoComplete.isWaterSoluble === 1) {
        partConfigMsg = 'Supplies, Materials & Tools configured as Water-Soluble.';
      }

      _.each(op_part_list, (opItem) => {
        // OP: NA
        if (opItem.isFluxNotApplicable === true) {
          if (vm.selectedSMTDetFromAutoComplete.isNoClean === 1 && vm.selectedSMTDetFromAutoComplete.isWaterSoluble === 1) {
            errOp = errOp + '<li>' + opItem.opFullName + '&nbsp;&nbsp;- Flux Type-Not Applicable </li>';
            validateFluxTypeErr = 1;
          } else if (vm.selectedSMTDetFromAutoComplete.isNoClean === 1) {
            errOp = errOp + '<li>' + opItem.opFullName + '&nbsp;&nbsp;- Flux Type-Not Applicable </li> </li>';
            validateFluxTypeErr = 1;
          } else if (vm.selectedSMTDetFromAutoComplete.isWaterSoluble === 1) {
            errOp = errOp + '<li>' + opItem.opFullName + '&nbsp;&nbsp;- Flux Type-Not Applicable </li> </li>';
            validateFluxTypeErr = 1;
          }
        }
        // OP: Both
        if ((opItem.isNoClean === true && opItem.isWaterSoluble === true) && (vm.selectedSMTDetFromAutoComplete.isWaterSoluble === 1 && vm.selectedSMTDetFromAutoComplete.isNoClean === 1)) {
          errOp = errOp + '<li>' + opItem.opFullName + '&nbsp;&nbsp;- No-Clean and Water-Soluble</li>';
          validateFluxTypeErr = 1;
        }
        // OP: No-Clean
        if (opItem.isNoClean === true && opItem.isWaterSoluble === false) {
          if (vm.selectedSMTDetFromAutoComplete.isNoClean === 0 && vm.selectedSMTDetFromAutoComplete.isWaterSoluble === 1) {
            errOp = errOp + '<li>' + opItem.opFullName + '&nbsp;&nbsp;- No-Clean </li>';
            validateFluxTypeErr = 1;
          } else if (vm.selectedSMTDetFromAutoComplete.isNoClean === 1 && vm.selectedSMTDetFromAutoComplete.isWaterSoluble === 1) {
            errOp = errOp + '<li>' + opItem.opFullName + '&nbsp;&nbsp;- No-Clean</li>';
            validateFluxTypeErr = 1;
          }
        }
        // OP: Water-Soluble
        if (opItem.isNoClean === false && opItem.isWaterSoluble === true) {
          if (vm.selectedSMTDetFromAutoComplete.isNoClean === 1 && vm.selectedSMTDetFromAutoComplete.isWaterSoluble === 0) {
            errOp = errOp + '<li>' + opItem.opFullName + '&nbsp;&nbsp;- Water-Soluble</li>';
            validateFluxTypeErr = 1;
          } else if (vm.selectedSMTDetFromAutoComplete.isNoClean === 1 && vm.selectedSMTDetFromAutoComplete.isWaterSoluble === 1) {
            errOp = errOp + '<li>' + opItem.opFullName + '&nbsp;&nbsp;- Water-Soluble </li>';
            validateFluxTypeErr = 1;
          }
        }
      });
      if (validateFluxTypeErr > 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DYNAMIC_ERROR);
        messageContent.message = stringFormat(messageContent.message, partConfigMsg + errMsg + errOp);
        DialogFactory.messageAlertDialog({
          messageContent: messageContent,
          multiple: true
        });
      }
    };

    // add part to  operation after confirmation for Inactive part.
    const addNewPartAfterConfirmation = (op_part_list, versionModel) => {
      vm.cgBusyLoading = WorkorderOperationPartFactory.addPartToWorkOrder().save({
        listObj: op_part_list,
        restrictPartAuthenticationList: restrictPartAuthenticationList
      }).$promise.then((componentSupplyMaterial) => {
        const obj = _.find(vm.PartList, (part) => {
          return part.id === vm.autoCompletePart.keyColumnId;
        });
        if (obj) {
          obj.selected = false;
          BaseService.currentPagePopupForm.pop();
          $mdDialog.hide([obj, versionModel]);
          // Send notification of change to all users
          sendNotification(versionModel);
        }
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    };

    function addNewPart(op_part_list, versionModel) {
      let inactivePart = false;
      const inactivePartList = [];
      validateFluxTypePartAgainstOperation(op_part_list);
      if (validateFluxTypeErr > 0) {
        vm.saveDisable = false;
        return;
      }
      //confirm for part with inactive status
      _.each(op_part_list, (item) => {
        if (item.partStatus === CORE.PartStatusList.InActiveInternal) {
          inactivePart = true;
          inactivePartList.push(item.PIDCode);
        }
      });
      if (inactivePart) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADD_INACTIVE_PART_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, inactivePartList);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            addNewPartAfterConfirmation(op_part_list, versionModel);
          }
        }, () => {
          setFocusByName(vm.autoCompletePart.inputName);
          vm.saveDisable = false;
          return;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        addNewPartAfterConfirmation(op_part_list, versionModel);
      }
    };

    // [S] Notification methods
    function sendNotification(versionModel) {
      if (versionModel) {
        versionModel.employeeID = loginUserDetails.employee.id;
        versionModel.messageType = CORE.NOTIFICATION_MESSAGETYPE.WO_VERSION_CHANGE.TYPE;
        NotificationSocketFactory.sendNotification().save(versionModel).$promise.then((response) => {
          /* empty */
        }).catch((error) => {
          vm.saveDisable = false;
        });
      }
    }

    function openWORevisionPopup(ReftypeID, callbackFn, event) {
      var model = {
        woID: ReftypeID
      };
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_REVISION_POPUP_CONTROLLER,
        WORKORDER.WORKORDER_REVISION_POPUP_VIEW,
        event,
        model).then((versionModel) => {
          callbackFn(versionModel);
        }, (error) => {
          callbackFn();
        });
    }
    // [E] Notification methods

    let openRestrictedPartPopup = (restrictPartDet) => {
      vm.saveDisable = false;
      let data = restrictPartDet;

      DialogFactory.dialogService(
        WORKORDER.PERMANENT_RESTRICT_PART_MODAL_CONTROLLER,
        WORKORDER.PERMANENT_RESTRICT_PART_MODAL_VIEW,
        event, data).then((resData) => {
          //if (resData) {
          //}
        }, (cancel) => {

        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
    }

    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.partForm);
      if (isdirty) {
        let data = {
          form: vm.partForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }
    //Redirect to operation master
    vm.goToOperationList = () => {
      BaseService.openInNew(OPERATION.OPERATION_OPERATIONS_STATE, {});
    }
    //Redirect to part master
    vm.goToPartList = () => {
      BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE, {});
    }


    /*
    * Author :  Vaibhav Shah
    * Purpose : Select All Operations
    */
    vm.SelectAllOp = false;
    vm.SelectAllOperation = () => {
      vm.SelectAllOp = !vm.SelectAllOp;
      if (vm.SelectAllOp) {
        _.each(vm.WoOperationList, (em) => { em.selected = true; });
      }
      else {
        _.each(vm.WoOperationList, (em) => { em.selected = false; });
      }
      if (vm.partForm && vm.WoOperationList.length > 0 && vm.partForm[vm.WoOperationList[0].opName]) {
        vm.partForm.$setDirty();
        vm.partForm[vm.WoOperationList[0].opName].$setDirty();
      }
    }

    // set select all/deselect
    vm.AddToSelectedOperation = () => {
      let opCount = _.countBy(vm.WoOperationList, (op) => { return op.selected == true });
      if (opCount[true] == vm.WoOperationList.length) {
        vm.SelectAllOp = true;
      } else {
        vm.SelectAllOp = false;
      }
    }

    /* to move at operation update page */
    vm.goToManageOperation = (operationID) => {
      BaseService.goToManageOperation(operationID);
    }

    //on load submit form
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.partForm);
    });
  }

})();
