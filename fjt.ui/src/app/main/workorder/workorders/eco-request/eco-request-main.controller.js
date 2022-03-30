(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ECORequestMainController', ECORequestMainController);

  function ECORequestMainController($mdDialog, $scope, $stateParams, $q, $timeout, $filter, $state, CORE, USER, WORKORDER, WorkorderFactory, ECORequestFactory, DialogFactory, BaseService, MasterFactory) {
    const vm = this;
    vm.currentState = $state.current.name;
    vm.woID = $state.params.woID || '';
    vm.partID = $state.params.partID;
    vm.ecoReqID = $state.params.ecoReqID;
    vm.ecoDfmFinalStatus = WORKORDER.ECO_REQUEST_FINAL_STATUS;
    var requestType = $state.params.requestType;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.requestType = WORKORDER.ECO_REQUEST_TYPE;
    vm.ecotabList = WORKORDER.ECO_TAB_LIST;
    vm.WOAllLabelConstant = CORE.LabelConstant.Workorder;
    vm.woStatusDetail = CORE.WorkOrderStatus;
    vm.assemblyAllLabelConstant = CORE.LabelConstant.Assembly;
    vm.ecofinalstatusheaderdropdown = CORE.ECORequestFinalStatusGridHeaderDropdown;
    vm.dfmfinalstatusheaderdropdown = CORE.DFMRequestFinalStatusGridHeaderDropdown;
    vm.ecostatusheaderdropdown = CORE.ECORequestStatusGridHeaderDropdown;
    vm.ecoRequestModel = {};
    vm.ecorequesrDetail = {
      workOrder: {}
    };
    if (requestType) {
      switch (requestType) {
        case vm.requestType.ECO.Name:
          vm.ecoRequestModel.requestType = vm.requestType.ECO.Value;
          break;
        case vm.requestType.DFM.Name:
          vm.ecoRequestModel.requestType = vm.requestType.DFM.Value;
          break;
      }
    }
    if (vm.ecoReqID != "" && vm.woID != "") {
      var detiltabParam = '({partID: ' + vm.partID + ', woID: ' + vm.woID + ', ecoReqID: ' + vm.ecoReqID + '})';
      var departmenttabPAram = '({partID: ' + vm.partID + ', woID: ' + vm.woID + ', ecoReqID: ' + vm.ecoReqID + '})';
      var documenttabParam = '({partID: ' + vm.partID + ', woID: ' + vm.woID + ', ecoReqID: ' + vm.ecoReqID + '})';
    } else if (vm.ecoReqID != "" && vm.woID == "") {
      var detiltabParam = '({partID: ' + vm.partID + ', ecoReqID: ' + vm.ecoReqID + '})';
      var departmenttabPAram = '({partID: ' + vm.partID + ', ecoReqID: ' + vm.ecoReqID + '})';
      var documenttabParam = '({partID: ' + vm.partID + ', ecoReqID: ' + vm.ecoReqID + '})';
    } else if (vm.ecoReqID == "" && vm.woID != "") {
      var detiltabParam = '({partID: ' + vm.partID + ', woID: ' + vm.woID + '})';
      var departmenttabPAram = '({partID: ' + vm.partID + ', woID: ' + vm.woID + '})';
      var documenttabParam = '({partID: ' + vm.partID + ', woID: ' + vm.woID + '})';
    } else if (vm.woID != "") {
      var detiltabParam = '({partID: ' + vm.partID + ', woID: ' + vm.woID + '})';
      var departmenttabPAram = '({partID: ' + vm.partID + ', woID: ' + vm.woID + '})';
      var documenttabParam = '({partID: ' + vm.partID + ', woID: ' + vm.woID + '})';
    } else {
      var detiltabParam = '({partID: ' + vm.partID + '})';
      var departmenttabPAram = '({partID: ' + vm.partID + '})';
      var documenttabParam = '({partID: ' + vm.partID + '})';
    }
    let reasonTabs = CORE.Reason_Type;
    if (vm.ecoRequestModel.requestType == vm.requestType.ECO.Value) {
      vm.tabList = [
        { id: 0, tabName: "Details", title: vm.ecotabList.DETAIL.title, src: WORKORDER.ECO_REQUEST_DETAIL_STATE + detiltabParam, viewsrc: 'detail', isDisabled: false, displayOrder: vm.ecotabList.DETAIL.DisplayOrder },
        { id: 1, tabName: "Department Approval", title: vm.ecotabList.DEPARTMENT_APPROVAL.title, src: WORKORDER.ECO_REQUEST_DEPARTMENT_APPROVAL_STATE + departmenttabPAram, viewsrc: 'departmentapproval', isDisabled: vm.ecoReqID != "" ? false : true, displayOrder: vm.ecotabList.DEPARTMENT_APPROVAL.DisplayOrder },
        { id: 2, tabName: "Document", title: vm.ecotabList.DOCUMENTS.title, src: WORKORDER.ECO_REQUEST_DOCUMENT_STATE + documenttabParam, viewsrc: 'document', isDisabled: vm.ecoReqID != "" ? false : true, displayOrder: vm.ecotabList.DOCUMENTS.DisplayOrder }
      ];
    } else if (vm.ecoRequestModel.requestType == vm.requestType.DFM.Value) {
      vm.tabList = [
        { id: 0, tabName: "Details", title: vm.ecotabList.DETAIL.title, src: WORKORDER.DFM_REQUEST_DETAIL_STATE + detiltabParam, viewsrc: 'detail', isDisabled: false, displayOrder: vm.ecotabList.DETAIL.DisplayOrder },
        { id: 1, tabName: "Department Approval", title: vm.ecotabList.DEPARTMENT_APPROVAL.title, src: WORKORDER.DFM_REQUEST_DEPARTMENT_APPROVAL_STATE + departmenttabPAram, viewsrc: 'departmentapproval', isDisabled: vm.ecoReqID != "" ? false : true, displayOrder: vm.ecotabList.DEPARTMENT_APPROVAL.DisplayOrder },
        { id: 2, tabName: "Document", title: vm.ecotabList.DOCUMENTS.title, src: WORKORDER.DFM_REQUEST_DOCUMENT_STATE + documenttabParam, viewsrc: 'document', isDisabled: vm.ecoReqID != "" ? false : true, displayOrder: vm.ecotabList.DOCUMENTS.DisplayOrder }
      ];
    }
    vm.tabList = _.orderBy(vm.tabList, 'DisplayOrder', 'asc');



    // set tab active on first time page load
    function active() {
      switch (vm.currentState) {
        case WORKORDER.ECO_REQUEST_DETAIL_STATE:
          vm.activeTab = 0;
          vm.title = vm.tabList[0].title;
          vm.selectedNavItem = vm.tabList[0].title;
          break;
        case WORKORDER.ECO_REQUEST_DEPARTMENT_APPROVAL_STATE:
          vm.activeTab = 1;
          vm.title = vm.tabList[1].title;
          vm.selectedNavItem = vm.tabList[1].title;
          break;
        case WORKORDER.ECO_REQUEST_DOCUMENT_STATE:
          vm.activeTab = 2;
          vm.title = vm.tabList[2].title;
          vm.selectedNavItem = vm.tabList[2].title;
          break;
        case WORKORDER.DFM_REQUEST_DETAIL_STATE:
          vm.activeTab = 0;
          vm.title = vm.tabList[0].title;
          vm.selectedNavItem = vm.tabList[0].title;
          break;
        case WORKORDER.DFM_REQUEST_DEPARTMENT_APPROVAL_STATE:
          vm.activeTab = 1;
          vm.title = vm.tabList[1].title;
          vm.selectedNavItem = vm.tabList[1].title;
          break;
        case WORKORDER.DFM_REQUEST_DOCUMENT_STATE:
          vm.activeTab = 2;
          vm.title = vm.tabList[2].title;
          vm.selectedNavItem = vm.tabList[2].title;
          break;
      }
    }
    active();
    //Tab change event
    vm.onTabChanges = (item) => {
      vm.title = item.title;
    }

    vm.save = (ev) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      $scope.$broadcast('SaveECORequest', ev);
    }
    let getEcoRequestHeaderDetail = () => {
      vm.headerdata = [];
      return ECORequestFactory.getECOHeaderDetail().query({ partID: vm.partID, ecoReqID: vm.ecoReqID, requestType: vm.ecoRequestModel.requestType }).$promise.then((response) => {
        if (response.data) {
          vm.ecoDetail = response.data;
          vm.headerdata.push({
            label: vm.assemblyAllLabelConstant.PIDCode,
            value: angular.copy(response.data.PIDCode),
            displayOrder: 3,
            labelLinkFn: vm.goToAssemblyList,
            valueLinkFn: vm.goToAssemblyDetails,
            valueLinkFnParams: { partID: response.data.id },
            isCopy: true,
            isCopyAheadLabel: true,
            isAssy: true,
            imgParms: {
              imgPath: vm.rohsImagePath + response.data.rfq_rohsmst.rohsIcon,
              imgDetail: response.data.rfq_rohsmst.name
            }
          }, {
            label: vm.assemblyAllLabelConstant.MFGPN,
            value: angular.copy(response.data.mfgPN),
            displayOrder: 3,
            labelLinkFn: vm.goToAssemblyList,
            valueLinkFn: vm.goToAssemblyDetails,
            valueLinkFnParams: { partID: response.data.id },
            isCopy: true,
            isCopyAheadLabel: false,
            isAssy: true,
            imgParms: {
              imgPath: vm.rohsImagePath + response.data.rfq_rohsmst.rohsIcon,
              imgDetail: response.data.rfq_rohsmst.name
            }
          });
          if (response.data.fromEcoRequest) {
            let ecoDetail = vm.ecorequesrDetail = _.first(response.data.fromEcoRequest)
            switch (ecoDetail.finalStatus) {
              case vm.ecoDfmFinalStatus.Pending.Value:
                vm.ECOFinalStatus = vm.ecofinalstatusheaderdropdown[1].value;
                break;
              case vm.ecoDfmFinalStatus.Accept.Value:
                vm.ECOFinalStatus = vm.ecofinalstatusheaderdropdown[2].value;
                break;
              case vm.ecoDfmFinalStatus.Reject.Value:
                vm.ECOFinalStatus = vm.ecofinalstatusheaderdropdown[3].value;
                break;
            }
            if (ecoDetail.status == "C") {
              vm.ECOStatus = vm.ecostatusheaderdropdown[1].value;
            }
            if (ecoDetail.status == "P") {
              vm.ECOStatus = vm.ecostatusheaderdropdown[2].value;
            }

            if (ecoDetail.workOrder) {
              vm.headerdata.push({
                label: vm.WOAllLabelConstant.WO,
                value: ecoDetail.workOrder.woNumber,
                displayOrder: 1
              }, {
                label: vm.WOAllLabelConstant.Version,
                value: ecoDetail.workOrder.woVersion,
                displayOrder: 2
              });
              vm.wostatus = _.find(vm.woStatusDetail, x => x.Key == ecoDetail.workOrder.woStatus);
              vm.class = vm.getWoStatusClassName(ecoDetail.workOrder.woStatus);
              vm.isWoInSpecificStatusNotAllowedToChange = (ecoDetail.workOrder.woStatus === CORE.WOSTATUS.TERMINATED || ecoDetail.workOrder.woStatus === CORE.WOSTATUS.COMPLETED || ecoDetail.workOrder.woStatus === CORE.WOSTATUS.VOID) ? true : false;
            }
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    // get work order details
    const getWorkorderBasicDetails = () => {
      vm.headerdata = [];
      return MasterFactory.getWODetails().query({ woID: vm.woID }).$promise.then((response) => {
        if (response && response.data) {
          const workOrderDet = response.data;
          vm.isWoInSpecificStatusNotAllowedToChange = (workOrderDet.woStatus === CORE.WOSTATUS.TERMINATED || workOrderDet.woStatus === CORE.WOSTATUS.COMPLETED || workOrderDet.woStatus === CORE.WOSTATUS.VOID) ? true : false;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };
    // get eco request detail 
    let getECORequest = () => {
      return ECORequestFactory.getECORequest().query({ ecoReqID: vm.ecoReqID, requestType: vm.ecoRequestModel.requestType }).$promise.then((response) => {
        if (response && response.data) {
          return response.data;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    // bind all detail on page load
    function getEcoDetail() {
      var promises = [getEcoRequestHeaderDetail()];
      if (vm.ecoReqID) {
        promises.push(getECORequest());
      }
      if (vm.woID) {
        getWorkorderBasicDetails();
      }
      vm.cgBusyLoading = $q.all(promises).then((responses) => {

      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    getEcoDetail();
    /* check form dirty validation on tab change */
    vm.isStepValid = function (step) {
      var isDirty = BaseService.checkAllFormDirtyValidation();
      if (isDirty)
        return showWithoutSavingAlertforTabChange(step);
      else {
        BaseService.currentPageForms = [];
        return true;
      }
    }
    // check form dirty validation on back button 
    vm.openEcoRequestList = () => {
      if (BaseService.checkAllFormDirtyValidation()) {
        showWithoutSavingAlertforBackButton();
      } else {
        BaseService.currentPageForms = [];
        if (vm.ecoRequestModel.requestType == vm.requestType.ECO.Value) {
          if (vm.woID) {
            $state.go(WORKORDER.ECO_REQUEST_LIST_STATE, { requestType: WORKORDER.ECO_REQUEST_TYPE.ECO.Name, partID: vm.partID, woID: vm.woID });
          } else {
            $state.go(USER.ADMIN_MANAGECOMPONENT_DFM_STATE, { coid: vm.partID, ecoDfmType: WORKORDER.ECO_REQUEST_TYPE.ECO.Value });
          }
        } else if (vm.ecoRequestModel.requestType == vm.requestType.DFM.Value) {
          if (vm.woID) {
            $state.go(WORKORDER.DFM_REQUEST_LIST_STATE, { requestType: WORKORDER.ECO_REQUEST_TYPE.DFM.Name, partID: vm.partID, woID: vm.woID });
          } else {
            $state.go(USER.ADMIN_MANAGECOMPONENT_DFM_STATE, { coid: vm.partID, ecoDfmType: WORKORDER.ECO_REQUEST_TYPE.DFM.Value });
          }
        }
      }

    }
    // show form dirty validation on back button
    function showWithoutSavingAlertforBackButton() {
      let obj = {
        title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
        textContent: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_BODY_MESSAGE,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.confirmDiolog(obj).then((yes) => {
        if (yes) {
          BaseService.currentPageForms = [];
          if (vm.ecoRequestModel.requestType == vm.requestType.ECO.Value) {
            $state.go(WORKORDER.ECO_REQUEST_LIST_STATE, { requestType: WORKORDER.ECO_REQUEST_TYPE.ECO.Name, partID: vm.partID, woID: vm.woID });
          } else if (vm.ecoRequestModel.requestType == vm.requestType.DFM.Value) {
            $state.go(WORKORDER.DFM_REQUEST_LIST_STATE, { requestType: WORKORDER.ECO_REQUEST_TYPE.DFM.Name, partID: vm.partID, woID: vm.woID });
          }
        }
      }, (error) => {
        return BaseService.getErrorLog(error);
      });
    }
    // show form dirty validation on tab change
    function showWithoutSavingAlertforTabChange(step) {
      let obj = {
        title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
        textContent: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_BODY_MESSAGE,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.confirmDiolog(obj).then((yes) => {
        if (yes) {
          vm.isSave = false;
          if (step == 0) {
            getEcoDetail();
            BaseService.currentPageForms = [];
            return true;
          } else if (step == 1) {
            BaseService.currentPageForms = [];
            return true;
          }
        }

      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }


    let getECODFMSearch = (searchObj) => {
      return ECORequestFactory.getAllECODFMRequestNumber().query(searchObj).$promise.then((rfq) => {
        if (rfq)
          return rfq.data;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    let selectECODFM = (item) => {
      if (item) {
        if (vm.ecoRequestModel.requestType == vm.requestType.ECO.Value) {
          $state.go(WORKORDER.ECO_REQUEST_DETAIL_STATE, { partID: item.fromPartID, ecoReqID: item.ecoReqID, woID: item.woID }, { reload: true });
        } else if (vm.ecoRequestModel.requestType == vm.requestType.DFM.Value) {
          $state.go(WORKORDER.DFM_REQUEST_DETAIL_STATE, { partID: item.fromPartID, ecoReqID: item.ecoReqID, woID: item.woID }, { reload: true });
        }
        $timeout(() => {
          vm.autoCompleteECODFM.keyColumnId = null;
        }, true);
      }
    }

    vm.autoCompleteECODFM = {
      columnName: 'ecoDfmDetail',
      keyColumnName: 'ecoReqID',
      keyColumnId: null,
      inputName: vm.ecoRequestModel.requestType == vm.requestType.ECO.Value ? "ECO Request" : "DFM Request",
      placeholderName: vm.ecoRequestModel.requestType == vm.requestType.ECO.Value ? "ECO Request" : "DFM Request",
      isRequired: false,
      isAddnew: false,
      //callbackFn: getAllECODFMList,
      onSelectCallbackFn: selectECODFM,
      onSearchFn: function (query) {
        const searchobj = {
          searchquery: query,
          requestType: vm.ecoRequestModel.requestType
        };
        return getECODFMSearch(searchobj);
      }
    };

    vm.addECODFM = () => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }

      if (vm.ecoRequestModel.requestType == vm.requestType.ECO.Value) {
        $state.go(WORKORDER.ECO_REQUEST_DETAIL_STATE, { partID: vm.partID, ecoReqID: null, woID: vm.woID }, { reload: true });
      } else if (vm.ecoRequestModel.requestType == vm.requestType.DFM.Value) {
        $state.go(WORKORDER.DFM_REQUEST_DETAIL_STATE, { partID: vm.partID, ecoReqID: null, woID: vm.woID }, { reload: true });
      }
    }

    // Assembly
    vm.goToAssemblyList = (data) => {
      BaseService.goToPartList();
      return false;
    }
    vm.getWoStatusClassName = (statusID) => {
      return BaseService.getWoStatusClassName(statusID);
    }
    vm.goToAssemblyDetails = (data) => {
      BaseService.goToComponentDetailTab(null, data.partID);
      return false;
    }
    vm.gotoWorkorderlist = () => {
      BaseService.goToWorkorderList();
    }
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(vm.woID);
      return false;
    }

    vm.checkFormDirty = (form, columnName) => {
      let result = BaseService.checkFormDirty(form, columnName);
      return result;
    }
  }
})();
