(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('SearchBOMController', SearchBOMController);

  function SearchBOMController($state, $mdDialog, $rootScope, $scope, $stateParams, $timeout, $q, PRICING, ComponentStandardDetailsFactory, DialogFactory, BaseService, CORE, USER, ComponentFactory,
    RFQTRANSACTION, BOMFactory, socketConnectionService) {
    const vm = this;

    vm.PartCategory = CORE.PartCategory;
   
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.SEARCH_BOM;

    function checkExportControlledPart() {
      vm.isExportControlled = false;
      if (vm.displayComponentDetail &&
        vm.displayComponentDetail.componetStandardDetail &&
        vm.displayComponentDetail.componetStandardDetail.length > 0) {
        const exportControlledStandards = _.find(vm.displayComponentDetail.componetStandardDetail, (item) => item.certificateStandard.isExportControlled === true);
        if (exportControlledStandards) {
          vm.isExportControlled = true;
        }
      }
    }

    vm.goToPartStandardTab = () => BaseService.goToPartStandardTab(vm.displayComponentDetail.mfgCodemst.mfgType, vm.cid);

    function getPartDynamicAttributeDetails() {
      if (vm.cid) {
        vm.cgBusyLoading = ComponentFactory.getPartDynamicAttributeDetails().query({ id: vm.cid }).$promise.then((res) => {
          if (res && res.data) {
            res.data.map((item) => {
              if (!item.icon) {
                item.icon = CORE.WEB_URL + USER.DYNAMIC_ATTRIBUTE_BASE_PATH + CORE.NO_IMAGE_ROHS;
              } else {
                item.icon = CORE.WEB_URL + USER.DYNAMIC_ATTRIBUTE_BASE_PATH + item.icon;
              }
            });
            vm.PartOperationalAttributeDetails = res.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    function setTemperatureToolTip() {
      if (vm.displayComponentDetail.componentTemperature && vm.displayComponentDetail.componentTemperature.length > 0) {
        vm.temperatureSensetiveTooltip = stringFormat(USER.ADMIN_EMPTYSTATE.COMPONENT_TEMPERATURE.TOOLTIPMESSAGE, vm.displayComponentDetail.componentTemperature[0].pickTemperatureAbove, ((vm.displayComponentDetail.componentTemperature[0].timeLiquidusSecond) ? vm.displayComponentDetail.componentTemperature[0].timeLiquidusSecond : '?'));
      }
      else if (vm.displayComponentDetail.rfqPartType.isTemperatureSensitive) {
        vm.temperatureSensetiveTooltip = USER.ADMIN_EMPTYSTATE.COMPONENT_TEMPERATURE.TOOLTIPMESSAGE_FOR_YELLOW_ICON;
      }
      else {
        vm.temperatureSensetiveTooltip = null;
      }
    }

    function getComponentMaxTemperatureData() {
      if (vm.cid) {
        return ComponentFactory.getComponentMaxTemperatureData().query({
          id: vm.cid
        }).$promise.then((componentTemperature) => {
          if (componentTemperature && componentTemperature.data) {
            vm.displayComponentDetail.componentTemperature = [];
            vm.displayComponentDetail.componentTemperature = componentTemperature.data;
          }
          setTemperatureToolTip();
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    /*component Standard tab */
    function getComponentStandardDetail() {
      if (vm.cid) {
        return ComponentStandardDetailsFactory.getcomponentstandardDetail().query({ id: vm.cid }).$promise.then((response) => {
          if (response && response.data) {
            vm.componentStandardDetaillist = response.data;
            //fetch selected standard
            vm.selectedStandard = [];
            _.each(vm.componentStandardDetaillist, (stdclass) => {
              stdclass.colorCode = CORE.DefaultStandardTagColor;
              stdclass.class = stdclass.Standardclass ? stdclass.Standardclass.className : null;
              stdclass.colorCode = stdclass.Standardclass ? (stdclass.Standardclass.colorCode ? stdclass.Standardclass.colorCode : CORE.DefaultStandardTagColor) : CORE.DefaultStandardTagColor;
              stdclass.standard = stdclass.certificateStandard ? stdclass.certificateStandard.fullName : null;
              stdclass.priority = stdclass.certificateStandard ? stdclass.certificateStandard.priority : null;
              vm.selectedStandard.push(stdclass);
            });
            vm.selectedStandard.sort(sortAlphabatically('priority', 'standard', true));
          }
        });
      }
    }

    function setRoHSDetails() {
      vm.displayComponentDetail.rohsIcon = '';
      if (vm.displayComponentDetail && vm.displayComponentDetail.RoHSStatusID) {
        if (vm.displayComponentDetail.rfq_rohsmst && vm.displayComponentDetail.rfq_rohsmst.rohsIcon) {
          vm.displayComponentDetail.rohsIcon = CORE.WEB_URL + USER.ROHS_BASE_PATH + vm.displayComponentDetail.rfq_rohsmst.rohsIcon;
        }
        else {
          vm.displayComponentDetail.rohsIcon = CORE.WEB_URL + USER.ROHS_BASE_PATH + CORE.NO_IMAGE_ROHS;
        }
        vm.displayComponentDetail.rohsName = vm.displayComponentDetail.rfq_rohsmst.name;
        if (vm.displayComponentDetail.rfq_rohsmst.refMainCategoryID !== USER.NonRoHSMainCategoryId) {
          vm.displayComponentDetail.isRohs = true;
        }
        else {
          vm.displayComponentDetail.isRohs = false;
        }
      }
    };

    function getComponnetDetails() {
      if (vm.cid) {
        return ComponentFactory.component().query({
          id: vm.cid
        }).$promise.then((component) => {
          if (component && component.data) {
            vm.displayComponentDetail = component.data;
            if (vm.displayComponentDetail.mfgCodemst) {
              vm.displayComponentDetail.customerName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, vm.displayComponentDetail.mfgCodemst.mfgCode, vm.displayComponentDetail.mfgCodemst.mfgName);
            }
            setRoHSDetails();
            getComponentStandardDetail();
            getComponentMaxTemperatureData();
            checkExportControlledPart();
            getPartDynamicAttributeDetails();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }


    const UpdateComponentHeader = $rootScope.$on(RFQTRANSACTION.EVENT_NAME.UpdateComponentHeader, (event, data) => {
      vm.PartOperationalAttributeDetails = data || {};
    });

    function connectSocket() {
      socketConnectionService.on(PRICING.EventName.sendBOMStartStopActivity, getComponnetDetails);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener(PRICING.EventName.sendBOMStartStopActivity, getComponnetDetails);
    }
    //#region On change of tab
    $scope.$on('$destroy', () => {
      removeSocketListener();
      $mdDialog.hide(false, { closeAll: true });
      UpdateComponentHeader();
    });
    //#endregion

    // get all assembly list
    const getAssySearch = (searchObj) => ComponentFactory.getComponentMFGAliasPIDProdPNSearch().query({
      listObj: searchObj
    }).$promise.then((partList) => {
      if (partList && partList.data && partList.data.data) {
        vm.partSearchList = partList.data.data;
        if (searchObj.id != null) {
          $timeout(() => {
            if (vm.autoCompleteSearchAssy && vm.autoCompleteSearchAssy.inputName) {
              $scope.$broadcast(vm.autoCompleteSearchAssy.inputName, partList.data.data[0]);
            }
          });
        }
      }
      else {
        vm.partSearchList = [];
      }
      return vm.partSearchList;
    }).catch((error) => BaseService.getErrorLog(error));

    const initAutoComplete = () => {
      vm.autoCompleteSearchAssy = {
        columnName: 'displayMfgPN',
        keyColumnName: 'id',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnId: $stateParams.assyid ? $stateParams.assyid : undefined,
        inputName: 'SearchPart',
        placeholderName: 'Type here to search assembly',
        callbackFn: () => {
        },
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: CORE.PartCategory.SubAssembly,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.part_master
        },
        onSelectCallbackFn: (partDetail) => {
          if (partDetail) {
            if ($stateParams.subassyid) {
              $state.go(RFQTRANSACTION.RFQ_SEARCH_BOM_STATE, { assyid: partDetail.id, subassyid: $stateParams.subassyid });
            }
            else {
              $state.go(RFQTRANSACTION.RFQ_SEARCH_BOM_STATE, { assyid: partDetail.id, subassyid: partDetail.id });
            }
          }
          else {
            vm.cid = undefined;
            vm.displayComponentDetail = [];
            vm.selectedStandard = [];
            $state.go(RFQTRANSACTION.RFQ_SEARCH_BOM_STATE, { assyid: null, subassyid: null });
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            query: query,
            isAssembly: true
          };
          return getAssySearch(searchObj);
        }
      };
    };

    const methodPromise = [initAutoComplete()];
    $q.all(methodPromise).then(() => {
      if ($stateParams.assyid) {
        vm.cid = $stateParams.assyid ? $stateParams.assyid : undefined;
        vm.subpartid = $stateParams.subassyid ? $stateParams.subassyid : undefined;
        getAssySearch({ id: vm.cid });
        getComponnetDetails();
      }
    }).catch((error) => BaseService.getErrorLog(error));

    vm.AssyAtGlance = () => {
      const obj = {
        partID: vm.cid
      };
      DialogFactory.dialogService(
        RFQTRANSACTION.ASSEMBLY_AT_GLANCE_CONTROLLER,
        RFQTRANSACTION.ASSEMBLY_AT_GLANCE_VIEW,
        null,
        obj).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.createAssemblyRevision = (ev) => {
      vm.displayComponentDetail.mfgCode = vm.displayComponentDetail.mfgCodemst ? vm.displayComponentDetail.mfgCodemst.mfgCode : null;
      vm.displayComponentDetail.manufacturerName = vm.displayComponentDetail.mfgCodemst ? vm.displayComponentDetail.mfgCodemst.mfgName : null;
      vm.displayComponentDetail.rohsComplientConvertedValue = vm.displayComponentDetail.rohsName;
      vm.displayComponentDetail.mfgType = vm.displayComponentDetail.mfgCodemst.mfgType;
      DialogFactory.dialogService(
        USER.ADMIN_CREATE_ASSEMBLY_REVISION_POPUP_CONTROLLER,
        USER.ADMIN_CREATE_ASSEMBLY_REVISION_POPUP_VIEW,
        ev,
        vm.displayComponentDetail).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };


    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });


    //go to part number
    vm.gotoPartNumber = () => {
      if (vm.selectedTabIndex !== 0) {
          BaseService.goToComponentDetailTab(null, vm.cid);
      }
    };

    vm.goToCustomerDetails = () => {
      BaseService.goToCustomer(vm.displayComponentDetail.mfgcodeID);
    };
    vm.goToCustomer = () => {
      BaseService.goToCustomerList();
    };
    vm.goToAssyList = () => {
        BaseService.goToPartList();
    };

    // ---------------------------------- [S] - Manage/View Serial Number Configuration -----------------
    vm.manageSerialNumberConfiguration = (ev) => {
      DialogFactory.dialogService(
        USER.ADMIN_SERIAL_NUMBER_CONFIGURATION_POPUP_CONTROLLER,
        USER.ADMIN_SERIAL_NUMBER_CONFIGURATION_POPUP_VIEW,
        ev,
        vm.displayComponentDetail).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };
    // ---------------------------------- [E] - Manage/View Serial Number Configuration -----------------
  }
})();
