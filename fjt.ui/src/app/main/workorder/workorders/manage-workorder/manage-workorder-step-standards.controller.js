(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ManageWorkorderStandardsController', ManageWorkorderStandardsController);

  /** @ngInject */
  function ManageWorkorderStandardsController($state, $scope, USER, CORE, BaseService, WorkorderCertificationFactory,
    DialogFactory, WORKORDER, WorkorderFactory, $timeout, GenericCategoryFactory, $q) {
    // Don't Remove this code
    // Don't add any code before this
    if (!$scope.$parent.$parent.vm.workorder || !$scope.$parent.$parent.vm.workorder.woID) {
      $state.go(WORKORDER.MANAGE_WORKORDER_DETAILS_STATE, { woID: null });
      return;
    }
    $scope.vm = $scope.$parent.$parent.vm;
    const vm = $scope.vm;
    //Add form name for check form dirty
    $scope.vm.CurrentForm = 'frmCertificateDetails';
    // add code after this only
    // Don't Remove this code
    vm.CertificateEmptyMesssage = USER.ADMIN_EMPTYSTATE.CERTIFICATE_STANDARD;
    const loginUserRoleList = [BaseService.loginUser.defaultLoginRoleID];
    let ispasswordProtected = false;

    // Restrict changes into all fields if work order status is 'terminated'
    vm.isWOTerminated = (vm.workorder.woStatus === CORE.WOSTATUS.TERMINATED);
    vm.isWOStatusCompleted = vm.workorder.woStatus === CORE.WOSTATUS.COMPLETED;
    vm.isWOStatusVoid = vm.workorder.woStatus === CORE.WOSTATUS.VOID;
    const allWOStatusCont = CORE.WoStatus;
    const standardTypeConst = CORE.CategoryType.StandardType;
    let selectedOldStandardList = [];

    const woStatusForNotAllowedToChangeStandard = _.filter(allWOStatusCont, (item) => item.ID === CORE.WOSTATUS.TERMINATED || item.ID === CORE.WOSTATUS.COMPLETED || item.ID === CORE.WOSTATUS.VOID);

    /* get all standard type list */
    const getAllStandardTypes = () => GenericCategoryFactory.getAllGenericCategoryByCategoryType().query({ categoryType: standardTypeConst.Name }).$promise
      .then((genericcategorylist) => {
        vm.standardTypeList = [];
        if (genericcategorylist && genericcategorylist.data) {
          vm.standardTypeList = genericcategorylist.data;
        }
        return $q.resolve(vm.standardTypeList);
      }).catch((error) => BaseService.getErrorLog(error));

    vm.CheckIsRequired = (isRequired, classList) => {
      if (isRequired) {
        const selectedClass = _.find(classList, (obj) => obj.selected === true);
        return selectedClass ? false : true;
      } else {
        return false;
      }
    };

    /**
  * Step 2 Select Certification
  *
  * @param
  */
    /*
   * Author :  Vaibhav Shah
   * Purpose : Get Certificate Standard List
   */
    vm.getCertificateStandardList = () => {
      selectedOldStandardList = [];
      const objs = {
        woID: vm.workorder.woID,
        componentID: vm.workorder.partID
      };
      return WorkorderCertificationFactory.getWorkorderAllStandardList().save({ workorderObj: objs }).$promise.then((certificate) => {
        //vm.CertificateList = [];
        vm.allStandardWithClassList = [];
        //vm.MainCertificateList = [];
        _.each(certificate.data, (item) => {
          // add condtion to cehck if standard is inactive and alresdy slected than is display  recored
          if (item.isActive || item.workorderCertification.length > 0) {
            if (item.certificateStandardRole.length > 0) {
              const roleIds = item.certificateStandardRole.map((x) => x.roleID);
              const sameRoles = _.intersection(roleIds, loginUserRoleList);
              if (sameRoles.length > 0) {
                item.disableStandard = false;
              }
              else {
                item.disableStandard = true;
              }
            }
            else {
              item.disableStandard = true;
            }

            item.workorderCertification = _.first(item.workorderCertification);
            if (item.workorderCertification) {
              item.selected = true;
            }
            else {
              item.selected = false;
            }

            // set default selected if item required default from setting
            // item.selected = item.isRequired ? true : item.selected;

            if (item.CertificateStandard_Class.length > 0) {
              // let IDs = [];
              const StandardClass = [];
              //if (item.workorderCertification && item.workorderCertification.classIDs)
              //IDs = item.workorderCertification.classIDs.split(',');
              _.each(item.CertificateStandard_Class, (standardClass) => {
                if (standardClass.isActive || item.workorderCertification) {
                  standardClass.selected = false;
                  if (item.workorderCertification && item.workorderCertification.classIDs === standardClass.classID) {
                    standardClass.selected = true;
                    if (!item.isActive) {
                      standardClass.disableClass = false;
                    }
                  }
                  else {
                    if (!item.isActive) {
                      standardClass.disableClass = true;
                    }
                  }
                  StandardClass.push(standardClass);
                }
              });
              //display order wise class
              item.CertificateStandard_Class = _.sortBy(StandardClass, ['displayOrder', 'className']);
              //vm.CertificateList.push(item);
              vm.allStandardWithClassList.push(item);
            } else {
              //vm.MainCertificateList.push(item);
              vm.allStandardWithClassList.push(item);
            }
          }
        });

        selectedOldStandardList = angular.copy(vm.allStandardWithClassList); // to pass old std to alert popup
        if (certificate.data.length > 0) {
          vm.isNoDataFound = false;
        } else {
          vm.isNoDataFound = true;
        }
        return $q.resolve(vm.allStandardWithClassList);
      }).catch((error) => BaseService.getErrorLog(error));
    };
    /* get all standard Discription */
    vm.showDescription = (certObj, certiClassObj, ev, callFrom) => {
      let data = {};
      if (callFrom === 'StandardDescription') {
        data = {
          title: 'Standard Description',
          description: certObj.description,

          headerData: [{
            label: 'Standard',
            value: certObj.fullName,
            displayOrder: 1,
            labelLinkFn: () => {
              BaseService.goToStandardList();
            },
            valueLinkFn: () => {
              BaseService.goToStandardDetails(certObj.certificateStandardID);
            }
          }]
        };
      }
      else if (callFrom === 'CategoryDescription') {
        data = {
          title: 'Standard Category Description',
          description: certiClassObj.description,

          headerData: [{
            label: 'Standard',
            value: certObj.fullName,
            displayOrder: 1,
            labelLinkFn: () => {
              BaseService.goToStandardList();
            },
            valueLinkFn: () => {
              BaseService.goToStandardDetails(certObj.certificateStandardID);
            }
          }, {
            label: 'Standard Category',
            value: certiClassObj.className,
            displayOrder: 2,
            labelLinkFn: () => {
              BaseService.goToStandardCaregoryList();
            }
          }]
        };
      }
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };
    /*
  * Author :  Vaibhav Shah
  * Purpose : Init Certificate Standard List
  */
    const initCertificateStandardData = () => {
      //vm.parentCertificateStandardList = [];
      //if (vm.parentCertificateStandardList.length == 0) {
      //vm.getCertificateStandardList();
      var promise = [getAllStandardTypes(), vm.getCertificateStandardList()];
      vm.cgBusyLoading = $q.all(promise).then(() => {
        /* expanded div as by default if wo std exists */
        const removeInActiveStdType = [];
        _.each(vm.standardTypeList, (stdTypeItem) => {
          const isStdTypeContainWoCerti = _.some(vm.allStandardWithClassList, (stdItem) => stdItem.standardTypeID === stdTypeItem.gencCategoryID && stdItem.workorderCertification);
          //stdTypeItem.isExpanded = isStdTypeContainWoCerti;
          if (!stdTypeItem.isActive && !isStdTypeContainWoCerti) {
            removeInActiveStdType.push(stdTypeItem.gencCategoryID);
          }
        });

        /* remove inactive std type if not contain any transaction data */
        if (removeInActiveStdType.length > 0) {
          vm.standardTypeList = vm.standardTypeList.filter((el) => !removeInActiveStdType.includes(el.gencCategoryID));
        }
        if (vm.frmCertificateDetails) {
          vm.frmCertificateDetails.$setPristine();
          vm.frmCertificateDetails.$setUntouched();
        }
      });
      //}
    };

    initCertificateStandardData();

    vm.SaveWorkorderStandard = (event) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.frmCertificateDetails, false)) {
        vm.saveDisable = false;
        return;
      }

      if (vm.isWOTerminated || vm.isWOStatusCompleted || vm.isWOStatusVoid) {
        const model = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: stringFormat(WORKORDER.NOT_ALLOWED_TO_CHANGE_STANDARDS, _.map(woStatusForNotAllowedToChangeStandard, 'Name').join(' or ')),
          multiple: true
        };
        DialogFactory.alertDialog(model);
        vm.saveDisable = false;
        return;
      }

      const objs = {
        woID: vm.workorder.woID,
        partID: vm.workorder.partID
      };
      vm.cgBusyLoading = WorkorderFactory.getAllWORFQContainSamePartID().save({ dataObj: objs }).$promise.then((res) => {
        //if (res && res.data && res.data.WOListContainSamePartID) {

        /* selected All Old Standards */
        const selectedAllOldStandards = [];
        selectedOldStandardList = _.filter(selectedOldStandardList, (item) => item.workorderCertification);
        _.each(selectedOldStandardList, (stdwithclassItem) => {
          const stdwithclassObj = {};
          let selectedClassItem = {};
          stdwithclassObj.colorCode = CORE.DefaultStandardTagColor;
          if (stdwithclassItem.CertificateStandard_Class && stdwithclassItem.CertificateStandard_Class.length > 0) {
            selectedClassItem = _.find(stdwithclassItem.CertificateStandard_Class, (classitem) => classitem.selected);
          }
          stdwithclassObj.class = selectedClassItem ? selectedClassItem.className : null;
          stdwithclassObj.colorCode = selectedClassItem ? (selectedClassItem.colorCode ? selectedClassItem.colorCode : CORE.DefaultStandardTagColor) : CORE.DefaultStandardTagColor;
          stdwithclassObj.standard = stdwithclassItem.fullName;
          stdwithclassObj.priority = stdwithclassItem.priority;
          selectedAllOldStandards.push(stdwithclassObj);
        });
        selectedAllOldStandards.sort(sortAlphabatically('priority', 'standard', true));

        /* selected All New Standards */
        const selectedAllNewStandards = [];
        const selectedNewStandardList = _.filter(angular.copy(vm.allStandardWithClassList), (item) => item.selected);
        _.each(selectedNewStandardList, (stdwithclassItem) => {
          const stdwithclassObj = {};
          let selectedClassItem = {};
          stdwithclassObj.colorCode = CORE.DefaultStandardTagColor;
          if (stdwithclassItem.CertificateStandard_Class && stdwithclassItem.CertificateStandard_Class.length > 0) {
            selectedClassItem = _.find(stdwithclassItem.CertificateStandard_Class, (classitem) => classitem.selected);
          }
          stdwithclassObj.class = selectedClassItem ? selectedClassItem.className : null;
          stdwithclassObj.colorCode = selectedClassItem ? (selectedClassItem.colorCode ? selectedClassItem.colorCode : CORE.DefaultStandardTagColor) : CORE.DefaultStandardTagColor;
          stdwithclassObj.standard = stdwithclassItem.fullName;
          stdwithclassObj.priority = stdwithclassItem.priority;
          selectedAllNewStandards.push(stdwithclassObj);
        });
        selectedAllNewStandards.sort(sortAlphabatically('priority', 'standard', true));

        const data = {
          workorderDetails: {
            woID: vm.workorder.woID,
            woNumber: vm.workorder.woNumber,
            woVersion: vm.workorder.woVersion,
            WOListContainSamePartID: res.data.WOListContainSamePartID,
            isCalledFromWorkOrderPage: true
          },
          componentDetails: {
            PIDCode: vm.workorder.PIDCode,
            mfgPN: vm.workorder.mfgPN,
            rohsIcon: vm.workorder.rohs ? vm.workorder.rohs.rohsIcon : '',
            rohsStatus: vm.workorder.rohs ? vm.workorder.rohs.name : '',
            nickName: vm.workorder.nickName,
            isCustom: vm.workorder.isCustom,
            id: vm.workorder.partID,
            isCalledFromComponentPage: false
          },
          RFQDetails: {
            RFQListContainSamePartID: res.data.RFQListContainSamePartID,
            rfqFormsID: null,
            isCalledFromRFQPage: false
          },
          selectedAllOldStandards: selectedAllOldStandards,
          selectedAllNewStandards: selectedAllNewStandards
        };

        DialogFactory.dialogService(
          CORE.WO_COMPONENT_STANDARD_CHANGE_ALERT_MODAL_CONTROLLER,
          CORE.WO_COMPONENT_STANDARD_CHANGE_ALERT_MODAL_VIEW,
          event,
          data).then((reponseOfApply) => {
            if (reponseOfApply) {
              if (ispasswordProtected === true) {
                const data = {
                  isValidate: true
                };
                DialogFactory.dialogService(
                  CORE.MANAGE_PASSWORD_POPUP_CONTROLLER,
                  CORE.MANAGE_PASSWORD_POPUP_VIEW,
                  event, data).then((data) => {
                    if (data) {
                      checkWOVersionModelChanges();
                    }
                  }, () => {
                    vm.saveDisable = false;
                  });
              }
              else {
                checkWOVersionModelChanges();
              }
            }
          }, () => {
            vm.saveDisable = false;
          });
        //}
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    };

    const checkWOVersionModelChanges = () => {
      if (vm.workorder.woStatus === CORE.WOSTATUS.PUBLISHED) {
        let isStandardChanged = false;
        if (vm.frmCertificateDetails.$dirty) {
          vm.frmCertificateDetails.$$controls.forEach((control) => {
            if (control.$dirty && control.$name) {
              isStandardChanged = true;
            }
          });
        }
        if (isStandardChanged) {
          vm.openWORevisionPopup((versionModel) => {
            // Added for close revision dialog popup
            if (versionModel && versionModel.isCancelled) {
              vm.saveDisable = false;
              return;
            }
            if (versionModel) {
              SaveWorkorderStandardDetails(versionModel);
            } else {
              SaveWorkorderStandardDetails(null);
            }
          }, event);
        } else {
          SaveWorkorderStandardDetails(null);
        }
      } else {
        SaveWorkorderStandardDetails(null);
      }
    };

    /*
    * Author :  Vaibhav Shah
    * Purpose : Create new Standards for Work Order from Step 2 and get workorder operation list
    */
    const SaveWorkorderStandardDetails = (versionModel) => {
      if (vm.workorder.woID) {
        const resList = [];
        //_.each(vm.parentCertificateStandardList, (item) => {
        _.each(vm.allStandardWithClassList, (item) => {
          //item.workorderCertification = _.first(item.workorderCertification);
          const ClassId = [];
          const objectItem = {};
          if (item.CertificateStandard_Class && item.CertificateStandard_Class.length > 0) {
            _.each(item.CertificateStandard_Class, (subItem) => {
              if (subItem.selected) {
                ClassId.push(subItem.classID);
              }
            });
            //if standard class selected
            if (ClassId.length > 0) {
              objectItem.woCertificationID = item.workorderCertification ? item.workorderCertification.woCertificationID : null;
              objectItem.woID = vm.workorder.woID;
              objectItem.certificateStandardID = item.certificateStandardID;
              //store ClassIds array into comma seperated string
              objectItem.classIDs = ClassId.join();
              resList.push(objectItem);
            }
          }
          else {
            if (item.selected) {
              objectItem.woCertificationID = item.workorderCertification ? item.workorderCertification.woCertificationID : null;
              objectItem.woID = vm.workorder.woID;
              objectItem.certificateStandardID = item.certificateStandardID;
              objectItem.classIDs = null;
              resList.push(objectItem);
            }
          }
        });
        ////_.each(vm.MainCertificateStandardList, (item) => {
        //_.each(vm.allStandardWithClassList, (item) => {
        //    let objectItem = {};
        //    if (item.selected) {
        //        objectItem.woCertificationID = item.workorderCertification ? item.workorderCertification.woCertificationID : null;
        //        objectItem.woID = vm.workorder.woID;
        //        objectItem.certificateStandardID = item.certificateStandardID;
        //        objectItem.classIDs = null;
        //        resList.push(objectItem);
        //    }
        //});
        const _objList = {};
        _objList.woID = vm.workorder.woID;
        _objList.woNumber = vm.workorder.woNumber;
        _objList.categoryList = resList;
        _objList.partID = vm.workorder.partID;
        vm.cgBusyLoading = WorkorderCertificationFactory.createWorkorder_CertificateList().save({ listObj: _objList }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            // Send details change notification using socket.io
            vm.sendNotification(versionModel);
            vm.frmCertificateDetails.$setPristine();
            $timeout(() => {
              vm.getCertificateStandardList();
              //console.log("isWOHeaderDetailsChanged - " + vm.isWOHeaderDetailsChanged);
              vm.isWOHeaderDetailsChanged = !vm.isWOHeaderDetailsChanged;
            }, _configBreadCrumbTimeout);
          }
          vm.saveDisable = false;
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
    };


    /*
    * Author :  Vaibhav Shah
    * Purpose : Don't allow to select multiple class from same standard
                it should work like radio button
    */
    vm.AllowToSelect = (certiClass, cert) => {
      const  val = certiClass.selected;
      cert.CertificateStandard_Class = _.each(cert.CertificateStandard_Class, (item) => { item.selected = false; });
      certiClass.selected = val;
      ispasswordProtected = ispasswordProtected ? ispasswordProtected : cert.passwordProtected; // for checking access

      /* select/deselect class and standard if required */
      if (certiClass.selected) {
        cert.selected = true;
      }
      else {
        cert.selected = false;
      }
      //let alreadySelected = _.filter(cert.CertificateStandard_Class, { 'selected': true });
      //if (alreadySelected.length > 1) {
      //    certiClass.selected = false;
      //    var model = {
      //        title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
      //        textContent: WORKORDER.ONLY_ONE_CLASS_ALLOW_PER_CATEGORY,
      //        multiple: true
      //    };
      //    DialogFactory.alertDialog(model);
      //    return;
      //}
    };

    /*
    * Author :  Vaibhav Shah
    * Purpose : Add new button for add new certificate standards
    */
    vm.addNewCertificateStandards = (ev) => {
      const popUpData = { popupAccessRoutingState: [USER.CERTIFICATE_STANDARD_STATE], pageNameAccessLabel: CORE.LabelConstant.Standards.PageName };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        DialogFactory.dialogService(
          USER.ADMIN_CERTIFICATE_STANDARD_ADD_MODAL_CONTROLLER,
          USER.ADMIN_CERTIFICATE_STANDARD_ADD_MODAL_VIEW,
          ev,
          null).then(() => {
            vm.refreshStandards();// Success Section
          }, () => {
            initCertificateStandardData();
          });
      }
    };

    /*
    * Author :  Vaibhav Shah
    * Purpose : Refresh button for refresh certificate data
    */
    //vm.RefreshCertificateStandards = (ev) => {
    //    initCertificateStandardData();
    //}

    // chgeck standard is password protect than set flag
    vm.passwordProtected = (standardDet) => {
      if (standardDet.passwordProtected) {
        ispasswordProtected = true;
      }

      /* select first default or deselect class */
      if (standardDet.selected) {
        if (standardDet.CertificateStandard_Class && standardDet.CertificateStandard_Class.length > 0) {
          _.each(standardDet.CertificateStandard_Class, (standardClass) => {
            standardClass.selected = false;
          });
          standardDet.CertificateStandard_Class[0].selected = true; // default first selected
        }
      }
      else {
        if (standardDet.CertificateStandard_Class && standardDet.CertificateStandard_Class.length > 0) {
          _.each(standardDet.CertificateStandard_Class, (standardClass) => {
            standardClass.selected = false;
          });
        }
      }
    };

    /* Add Standard Class*/
    vm.addStandardClass = (ev) => {
      const  popUpData = { popupAccessRoutingState: [USER.STANDARD_CLASS_STATE], pageNameAccessLabel: CORE.PageName.Standards_Categories };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        DialogFactory.dialogService(
          USER.STANDARD_CLASS_CONTROLLER_UPDATE_MODAL_CONTROLLER,
          USER.STANDARD_CLASS_CONTROLLER_UPDATE_MODAL_VIEW,
          ev,
          null).then(() => {
            vm.refreshStandards();
          }, () => {
            initCertificateStandardData();
          }, (err) => BaseService.getErrorLog(err));
      }
    };
    vm.StandardList = () => {
      BaseService.goToStandardList();
    };

    vm.StandardCategoryList = () => {
      BaseService.goToStandardCaregoryList();
    };
    vm.updatestandard = (cert) => {
      BaseService.openInNew(USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_DETAIL_STATE, { id: cert.certificateStandardID });
    };
    /* refresh all standards */
    vm.refreshStandards = () => {
      initCertificateStandardData();
      /* refresh work order header */
      $timeout(() => {
        //console.log("isWOHeaderDetailsChanged - " + vm.isWOHeaderDetailsChanged);
        vm.isWOHeaderDetailsChanged = !vm.isWOHeaderDetailsChanged;
      }, _configBreadCrumbTimeout);
    };

    // Assign Current Forms to service
    angular.element(() => {
      BaseService.currentPageForms = [vm.frmCertificateDetails];
    });
  };
})();
