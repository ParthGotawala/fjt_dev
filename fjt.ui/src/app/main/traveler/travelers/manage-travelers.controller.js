(function () {
  'use strict';

  angular
    .module('app.traveler.travelers')
    .controller('ManageTravelerController', ManageTravelerController);

  /** @ngInject */
  function ManageTravelerController($scope, $rootScope, $stateParams, $state, $timeout, $mdSidenav, $q, $filter,
    CORE, USER, TASK, TRAVELER, CHAT, HELPER_PAGE, TravelersFactory, DialogFactory, BaseService, MasterFactory,
    GenericCategoryFactory, WORKORDER, GenericCategoryConstant, WorkorderTransFactory, WorkorderDataElementTransValueFactory,
    WorkorderOperationFactory, $mdDialog, WorkorderSerialMstFactory, WorkorderTransFirstPcsdetFactory, socketConnectionService, NotificationSocketFactory, WorkorderFactory, KitAllocationFactory, WIDGET, WidgetFactory, hotkeys,
    WorkorderTransactionUMIDFactory, ComponentFactory) {
    const vm = this;
    /* Get back to task page */
    vm.goBack = () => {
      $state.go(TASK.TASK_MANAGE_STATE);
    };
    const loginUserDetails = BaseService.loginUser;
    vm.isUserOperator = loginUserDetails.isUserOperator;
    if ($stateParams.woOPID != 'undefined') {
      vm.woOPID = $stateParams.woOPID;
    }
    if ($stateParams.employeeID != 'undefined') {
      vm.employeeID = parseInt($stateParams.employeeID);
    }
    if ($stateParams.homeOPID != 'undefined') {
      vm.homeOPID = $stateParams.homeOPID;
    }
    if (vm.isUserOperator && loginUserDetails
      && parseInt(vm.employeeID) !== parseInt(loginUserDetails.employee.id)) {
      vm.goBack();
    }
    vm.LabelConstant = CORE.LabelConstant;
    vm.employeeDetails = loginUserDetails.employee;
    vm.currentTimerDiff = secondsToTime(0, true);
    vm.haltResumePopUp = CORE.HaltResumePopUp;
    vm.CustomerECO = angular.copy(CORE.workOrderECORequestType.CustomerECO).toUpperCase();
    vm.FCAECO = angular.copy(CORE.workOrderECORequestType.FCAECO).toUpperCase();
    vm.taToolbar = CORE.Toolbar;
    vm.isChecked = true;
    vm.isAboveTerminateWOOP = false;
    vm.isKitHaltStatus = false;
    vm.rohsImagePath = stringFormat('{0}{1}', CORE.WEB_URL, USER.ROHS_BASE_PATH);
    vm.DateTimeFormat = _dateTimeDisplayFormat;
    vm.FullDateTimeFormat = _dateTimeFullTimeDisplayFormat;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.MainTitle = CORE.MainTitle;
    vm.genericCategoryList = null;
    vm.ALLEntities = CORE.AllEntityIDS;
    vm.isdocuments = false;
    vm.workorder_Entity = vm.ALLEntities.Workorder.Name;
    vm.Workorder_operationEntity = vm.ALLEntities.Workorder_operation.Name;
    vm.operation_Entity = vm.ALLEntities.Operation.Name;
    vm.inspectionProcess = false;
    vm.isPackagingProcess = false;
    vm.IsValidEmployee = false;
    vm.showOperationFields = true;
    vm.showWorkOrderDataFields = true;
    vm.WOSerialNoFilterType = CORE.WorkorderSerialNumberFilterType;
    vm.selectedSerialFilterValue = vm.WOSerialNoFilterType.SerialNumber;
    vm.selectedWoOpFPSerialFilterValue = vm.WOSerialNoFilterType.SerialNumber;
    vm.WoOpFirstArticleStatus = CORE.WorkOrderOperationFirstArticleStatus;
    vm.SERIALS_MORETHAN_BUILD_QTY_MSG = WORKORDER.SERIALS_MORETHAN_BUILD_QTY_MSG;
    vm.isTeamOPAllEmpPauseMode = false;
    vm.isProductionStarted = false;
    vm.woDataElementList = [];
    vm.woEntityID = 0;
    vm.terminateOPNumber = 0;
    const FeederVerificationDet = localStorage.getItem('UnlockFeederDetail');
    vm.equipmentSetupMethods = CORE.EQUIPMENT_METHODS.SMTPickAndPlaceSetupAndVerfication;
    vm.isAllExpandedForFPTransSerials = false;
    vm.isShowExpirePart = true;
    vm.expirePartConfigurationOptions = {
      isCalledFromManualButtonClick: false
    };

    vm.popup = {
      checkin_operation: false,
      checkout_operation: false,
      production_stock: false,
      terminate_workorder: false,
      add_serialno: false,
      view_history: false,
      halt_operation: false,
      resume_operation: false,
      log_defects: false,
      pre_programming: false,
      narrativehistory: false
    };

    let reTryCount = 0;
    const getAllRights = () => {
      vm.enableEditOperation = BaseService.checkFeatureRights(CORE.FEATURE_NAME.EditOperation);
      vm.enableToggleOperation = BaseService.checkFeatureRights(CORE.FEATURE_NAME.ToggleOperation);
      vm.enableTerminateWorkorder = BaseService.checkFeatureRights(CORE.FEATURE_NAME.TerminateWorkorder);
      vm.enableTerminateButton();
      vm.enableNarrativeDetails = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowNarrativeDetails);
      vm.enableChangeTravelerHistory = BaseService.checkFeatureRights(CORE.FEATURE_NAME.ChangeTravelerHistory);
      if ((vm.enableChangeTravelerHistory == null || vm.enableChangeTravelerHistory == undefined ||
        vm.enableToggleOperation == null || vm.enableToggleOperation == undefined ||
        vm.enableTerminateWorkorder == null || vm.enableTerminateWorkorder == undefined ||
        vm.enableNarrativeDetails == null || vm.enableNarrativeDetails == undefined ||
        vm.enableChangeTravelerHistory == null || vm.enableChangeTravelerHistory == undefined) && (reTryCount < _configGetFeaturesRetryCount)) {
        getAllRights(); //put for hard reload option as it will not get data from featurerights
        reTryCount++;
        // console.log(reTryCount);
      }
    };
    //open popup to show incoming/outgoing rack#
    //new development task so commented
    vm.inoutRackDet = (ev, type) => {
      const data = angular.copy(vm.woOpEmployeeDetails.workorderOperation);
      data.woTransID = vm.woOpEmployeeDetails ? (vm.woOpEmployeeDetails.wo_transaction ? vm.woOpEmployeeDetails.wo_transaction.woTransID : null) : null;
      data.type = type,
        DialogFactory.dialogService(
          CORE.VIEW_INCOMING_OUTGOING_RACK_MODAL_CONTROLLER,
          CORE.VIEW_INCOMING_OUTGOING_RACK_MODAL_VIEW,
          ev,
          data).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
    };
    // open popup to show empty rack detail
    vm.openEmptyRackDet = (event) => {
      const data = angular.copy(vm.woOpEmployeeDetails.workorderOperation);
      DialogFactory.dialogService(
        CORE.SHOW_EMPTY_RACK_MODAL_CONTROLLER,
        CORE.SHOW_EMPTY_RACK_MODAL_VIEW,
        event,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };
    //open popup to show available rack list page
    vm.openAvailableRack = (event) => {
      const data = angular.copy(vm.woOpEmployeeDetails.workorderOperation);
      DialogFactory.dialogService(
        CORE.SHOW_AVAILABLE_RACK_MODAL_CONTROLLER,
        CORE.SHOW_AVAILABLE_RACK_MODAL_VIEW,
        event,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };
    //open popup to show clear rack detail for operation
    vm.clearRack = (event) => {
      const data = angular.copy(vm.woOpEmployeeDetails.workorderOperation);
      data.woTransID = vm.woOpEmployeeDetails ? (vm.woOpEmployeeDetails.wo_transaction ? vm.woOpEmployeeDetails.wo_transaction.woTransID : null) : null;
      DialogFactory.dialogService(
        CORE.CLEAR_RACK_MODAL_CONTROLLER,
        CORE.CLEAR_RACK_MODAL_VIEW,
        event,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };
    //open popup to get rack history
    vm.rackHistory = (event) => {
      const data = angular.copy(vm.woOpEmployeeDetails.workorderOperation);
      DialogFactory.dialogService(
        CORE.RACK_HISTORY_MODAL_CONTROLLER,
        CORE.RACK_HISTORY_MODAL_VIEW,
        event,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    /*Move to equipment page*/
    vm.goToManageEquipmentWorkstation = (equip) => {
      BaseService.goToManageEquipmentWorkstation(equip.eqpID);
    };

    const stateChangeSuccessCall = $scope.$on('$viewContentLoaded', () => {
      $timeout(() => {
        getAllRights();
      }, _configTimeout);
    });

    vm.opStatus = CORE.OPSTATUS;
    vm.woStatus = CORE.WOSTATUS;

    // [S] Widgets
    vm.analyticsList = [];
    vm.chartType = WIDGET.CHART_TYPE;
    vm.widgetFilter = [];
    vm.isDisplayWidget = false;
    // [E] Widgets



    vm.Show = {
      Dont: true,
      Do: true,
      Equipments: true,
      Part: true,
      Instruction: true,
      Working: true,
      Management: true,
      Deferred: true,
      Operation: true,
      Workorder: true,
      Operationfields: true,
      Workorderfields: true,
      Close: true,
      Document: true,
      Widgets: true
    };
    vm.tabList = [];

    // Create Static list for render Menu Scan Material
    vm.umidScanList = [
      {
        menuName: 'Scan Material',
        isDisable: false,
        isVerify: false,
        callback: viewUMIDDetails
      },
      {
        menuName: 'Verify Material',
        isDisable: false,
        isVerify: true,
        callback: viewUMIDDetails
      },
      {
        menuName: 'Scan Missing Material',
        isDisable: false,
        isVerify: false,
        callback: viewMissingUMIDDetail
      },
      {
        menuName: 'Part Expiry Information',
        isDisable: false,
        isVerify: true,
        callback: viewExpirePartDetails
      }
    ];
    //new development points
    vm.checkDisable = () => !(vm.IsCheckInOperation && vm.isWorkorderOperationAssigned && vm.woOpEmployeeDetails.workorderOperation.opStatus === vm.opStatus.PUBLISHED);


    // Create Static list for render Menu for packing serials
    vm.packingMenuList = [
      {
        menuName: 'Generate Serial#',
        isDisable: false,
        callback: generatePackingSerials
      },
      {
        menuName: vm.LabelConstant.MFG.PackagingBoxSerial,
        isDisable: false,
        callback: boxSerials
      }
    ];
    vm.RadioGroup = {
      prefixorSuffix: {
        array: CORE.WorkOrderPrefixorSuffix
      }
    };

    /*Get Employee Operation History by employeeID*/
    const GetTravelerDetails = () => {
      const _objList = {};
      _objList.employeeID = vm.employeeID;
      _objList.woOPID = vm.woOPID;
      return TravelersFactory.getTravelerDetails().query({
        listObj: _objList
      }).$promise.then((response) => response.data)
        .catch((error) => BaseService.getErrorLog(error));
    };

    /*Get Latest Details by employeeID, woOPID, woID*/
    const GetTravelerLatestDetails = () => {
      const _objList = {};
      _objList.employeeID = vm.employeeID;
      _objList.woOPID = vm.woOPID;
      _objList.woID = vm.woID;
      return TravelersFactory.getTravelerLatestDetails().query({
        listObj: _objList
      }).$promise.then((response) => response.data
      ).catch((error) => BaseService.getErrorLog(error));
    };

    /*Set Active tab */
    const active = () => {
      var item = $filter('filter')(vm.tabList, { woOPID: vm.woOPID });
      if (item[0] && item[0].isActive) {
        vm.activeTab = item[0].id;
      }
      else {
        $state.go(HELPER_PAGE.UNAUTHORIZED_STATE, { pageRoute: $state && $state.current ? $state.current.name : null });
      }
    };

    const SetEmployeeDetails = () => {
      if (vm.woOpEmployeeDetails && vm.woOpEmployeeDetails.wo_transaction) {
        vm.woTransID = vm.woOpEmployeeDetails.wo_transaction.woTransID;
        vm.isSetup = vm.woOpEmployeeDetails.wo_transaction.isSetup;
        vm.woOpEmployeeDetails.wo_transaction = vm.woOpEmployeeDetails.wo_transaction;
        vm.IsCheckInOperation = true;
        resetAllToggleMenu();
        //Enable box serial# menu button
        // vm.packingMenuList[1].isDisable = false;
        // if team operation than bind work-order employee details with transactions
        if (vm.woOpEmployeeDetails.workorderOperation && vm.woOpEmployeeDetails.workorderOperation.isTeamOperation) {
          // bind each employee with name and check-in time
          _.each(vm.woOpEmployeeDetails.woOperationEmployeeList, (employee) => {
            employee.name = (employee.firstName ? employee.firstName : '') + ' ' + (employee.lastName ? employee.lastName : '');
            if (vm.woOpEmployeeDetails.employee && vm.woOpEmployeeDetails.employee.id === employee.employeeID) {
              vm.woOpEmployeeDetails.employee.employeeID = employee.employeeID;
              vm.woOpEmployeeDetails.employee.isPaused = employee.isPaused;
              vm.woOpEmployeeDetails.employee.checkinTime = employee.checkinTime;
              vm.woOpEmployeeDetails.employee.woTransemppausedID = employee.woTransemppausedID;
              vm.woOpEmployeeDetails.employee.woTransinoutID = employee.woTransinoutID;
              vm.woOpEmployeeDetails.employee.woTransID = employee.woTransID;
            }
          });
          const empWithResumeStateInTeamOp = _.find(vm.woOpEmployeeDetails.woOperationEmployeeList, (employee) => !employee.isPaused && employee.checkinTime && !employee.checkoutTime);

          vm.isTeamOPAllEmpPauseMode = empWithResumeStateInTeamOp ? false : true;
        }
        else {
          // bind each employee with name and checkin time
          _.each(vm.woOpEmployeeDetails.woOperationEmployeeList, (employee) => {
            if (employee && vm.woOpEmployeeDetails.employee.id === employee.employeeID) {
              vm.woOpEmployeeDetails.employee.isPaused = employee.isPaused;
              vm.woOpEmployeeDetails.employee.checkinTime = employee.checkinTime;
              vm.woOpEmployeeDetails.employee.woTransemppausedID = employee.woTransemppausedID;
              vm.woOpEmployeeDetails.employee.woTransinoutID = employee.woTransinoutID;
              vm.woOpEmployeeDetails.employee.woTransID = employee.woTransID;
            }
          });
        }
      }
      else {
        vm.woTransID = null;
        vm.woOpEmployeeDetails.wo_transaction = null;
        vm.IsCheckInOperation = false;
        resetAllToggleMenu();
      }
    };

    const updateOperationList = (list, isActive, isPaused) => {
      _.each(list, (op) => {
        if (isActive && !isPaused) {
          op.isRunningOperation = true;
        }
        op.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, op.opName, op.opNumber);
        op.rohsIcon = vm.rohsImagePath + op.rohsIcon;
        if (!op.imageURL) {
          op.imageURL = CORE.WEB_URL + USER.COMPONENT_DEFAULT_IMAGE_PATH + 'profile.jpg';
        } else {
          if (!op.imageURL.startsWith('http://') && !op.imageURL.startsWith('https://')) {
            op.imageURL = BaseService.getPartMasterImageURL(op.documentPath, op.imageURL);
          }
        }
        if (op.employeeID === vm.employeeID && op.woOPID === vm.woOPID) {
          op.currentlyActive = true;
        } else {
          op.currentlyActive = false;
        }
        if (op.employeeID) {
          op.src = TRAVELER.TRAVELER_MANAGE_STATE + '({woOPID:"' + op.woOPID + '", employeeID:"' + op.employeeID + '", homeOPID:"' + vm.homeOPID + '"})';
        }
        else {
          op.src = TRAVELER.TRAVELER_MANAGE_ALL_STATE + '({woOPID:"' + op.woOPID + '"})';
        }
      });
    };

    const updateEmployeeList = (list) => {
      _.each(list, (emp) => {
        if (emp.employeeID === vm.employeeID && emp.woOPID === vm.woOPID) {
          emp.currentlyActive = true;
        } else {
          emp.currentlyActive = false;
        }
      });
    };

    const updateLastObjectTillCluster = (clusterID) => {
      _.each(vm.tabList, (tab) => {
        if (tab.clusterID === clusterID) {
          tab.isActive = true;
        }
      });
    };

    const refreshTabData = () => {
      // need to find solution later on
      if (!_.isNull(activeIndex)) {
        // allow next and previous operation of current operation
        //tabLimitAtTraveler
        const currTab = _.find(vm.tabList, (tab) => (tab.id === activeIndex));
        //// get all prevtab list till tabLimitAtTraveler
        //e.g. activeindex = 3
        // tabLimitAtTraveler = 3
        // prevTabList = tab.id [0,1,2]
        // nextTabList = tab.id [4,5,6]
        currTab.prevTabLimitAtTraveler = currTab.nextTabLimitAtTraveler = currTab.tabLimitAtTraveler;

        let lastActiveTabId = null;
        let lastNextActiveTabLimit = null;
        let lastPreviousActiveTabLimit = null;
        // 1. get all operation list
        _.each(vm.tabList, (tab) => {
          tab.tabColorCodeClassName = '';
          if (vm.isUserOperator) {
            // 2. set is active for all assigned operation
            if (tab.operationAssignedCount > 0) {
              tab.isActive = true;
              lastActiveTabId = tab.id;
              lastNextActiveTabLimit = lastPreviousActiveTabLimit = tab.tabLimitAtTraveler;
            } else {
              _.each(vm.tabList, (opTab) => {
                if (!opTab.isActive) {
                  // if operation assigned than check for next/previous operation
                  if ((opTab.id < lastActiveTabId) && (opTab.id >= (lastActiveTabId - lastPreviousActiveTabLimit))) {
                    // if operation under active tab limit than set active true
                    if (opTab.clusterID > 0) {
                      updateLastObjectTillCluster(opTab.clusterID);
                      lastPreviousActiveTabLimit++;
                    }
                    opTab.isActive = true;
                  }
                  else if ((opTab.id > lastActiveTabId) && (opTab.id <= (lastActiveTabId + lastNextActiveTabLimit))) {
                    // if operation is cluster than update all next cluster operation to active and increment tab value
                    if (opTab.clusterID > 0) {
                      updateLastObjectTillCluster(opTab.clusterID);
                      lastNextActiveTabLimit++;
                    }
                    opTab.isActive = true;
                  } else {
                    opTab.isActive = false;
                  }
                }
              });
            }
          } else {
            tab.isActive = true;
          }
          // to show active operation as color code
          const activeOperationColor = _.find(vm.woOpEmployeeDetails.woActiveOperationList, (op) => op.woOPID === tab.woOPID);
          if (activeOperationColor) {
            if (tab.colorCode && tab.woOPID !== vm.woOPID) {
              tab.tabColorCodeClassName = 'colorCode' + '_' + tab.woOPID;
              setTimeout(() => {
                var element = angular.element(document.getElementById('traveler-tabs'));
                var p = '<style id="' + tab.woOPID + '_colorCode" type="text/css">.' + tab.tabColorCodeClassName + '{background-color: ' + tab.colorCode + '}</style>';
                element.append(p);
                //$compile(element.contents())($scope);
              }, 1000);
            }
          } else {
            tab.tabColorCodeClassName = '';
            const el = angular.element(document.getElementById(tab.woOPID + '_colorCode'));
            if (el) {
              el.remove();
            }
          }
        });
      }
    };

    const bindTravelerPageDetails = (responses) => $timeout(() => {
      vm.woOpEmployeeDetails = {};
      vm.woOpEmployeeDetails.wpOperationList = responses[0].wpOperationList;
      vm.woOpEmployeeDetails.woOperationEmployeeList = responses[0].woOperationEmployeeList;
      updateEmployeeList(responses[0].woOperationEmployeeList);
      updateOperationList(responses[0].woActiveOperationList, true, false);
      vm.woOpEmployeeDetails.woActiveOperationList = responses[0].woActiveOperationList;
      updateOperationList(responses[0].woPausedOperationList, true, true);
      vm.woOpEmployeeDetails.woPausedOperationList = responses[0].woPausedOperationList;
      // get details of employee
      vm.woOpEmployeeDetails.employee = responses[0].employeeDetails;
      // latest stock details
      vm.woOpEmployeeDetails.woLatestStockDetails = responses[0].woLatestStockDetails;
      // disable shortcut
      if (!FeederVerificationDet) {
        bindHotKeys();
      }
      // get sales order detail
      vm.woOpEmployeeDetails.salesOrderDet = responses[0].woSalesOrderDetails || [];
      // get details of workorder operation
      vm.woOpEmployeeDetails.workorderOperation = responses[0].woOperationDetails;
      vm.packingMenuList[1].isDisable = (!vm.woOpEmployeeDetails.workorderOperation.isMoveToStock);
      vm.enableTerminateButton();
      if (vm.woOpEmployeeDetails && vm.woOpEmployeeDetails.workorderOperation) {
        vm.operationFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, vm.woOpEmployeeDetails.workorderOperation.opName, vm.woOpEmployeeDetails.workorderOperation.opNumber);
        if (!vm.woOpEmployeeDetails.workorderOperation.opDoes) {
          vm.Show.Do = false;
        }
        if (!vm.woOpEmployeeDetails.workorderOperation.opDonts) {
          vm.Show.Dont = false;
        }
        if (!vm.woOpEmployeeDetails.workorderOperation.opDescription) {
          vm.Show.Instruction = false;
        }
        vm.woID = vm.woOpEmployeeDetails.workorderOperation.woID;
      }
      vm.woOpEmployeeDetails.workorderOperation.woHoldDetails = responses[0].woHoldDetails;
      vm.woOpEmployeeDetails.workorderOperation.woOPHoldDetails = responses[0].woOPHoldDetails;
      //check rack button should visible or not
      //new development point
      if (vm.woOpEmployeeDetails.workorderOperation && vm.woOpEmployeeDetails.workorderOperation.woOPID === parseInt(vm.woOPID) && vm.woOpEmployeeDetails.workorderOperation.isRackTrackingRequired && vm.woOpEmployeeDetails.workorderOperation.qtyControl) {
        vm.isShowRackDeatil = true;
      }
      // get details of workorder operation transaction
      if (responses[0].woTransactionDetails) {
        vm.woOpEmployeeDetails.wo_transaction = responses[0].woTransactionDetails;
      } else {
        vm.woTransID = null;
        vm.woOpEmployeeDetails.wo_transaction = null;
        vm.IsCheckInOperation = false;
        resetAllToggleMenu();
      }

      if (vm.woOpEmployeeDetails.wo_transaction) { // op wise transaction (if any transaction found - then no need to send notification)
        vm.isProductionStarted = true;
      }
      else {
        checkProductionStarted();
      }

      if (vm.woOpEmployeeDetails.employee) {
        vm.checkInEmployeeID = vm.woOpEmployeeDetails.employee.id;
        if (vm.woOpEmployeeDetails.employee && vm.woOpEmployeeDetails.employee.profileImg) {
          vm.woOpEmployeeDetails.employee.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + vm.woOpEmployeeDetails.employee.profileImg;
        }
        else {
          vm.woOpEmployeeDetails.employee.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
        }
        const assignedEmployeeDetails = _.find(vm.woOpEmployeeDetails.woOperationEmployeeList, { employeeID: vm.woOpEmployeeDetails.employee.id });
        vm.isWorkorderOperationAssigned = (vm.employeeDetails.id === vm.woOpEmployeeDetails.employee.id) && (assignedEmployeeDetails ? true : false);
      }

      if (vm.woOpEmployeeDetails.workorderOperation) {
        if (vm.woOpEmployeeDetails.workorderOperation.woOPHoldDetails) {
          vm.woOpEmployeeDetails.workorderOperation.woOPHoldDetails.opStartDate = $filter('date')(vm.woOpEmployeeDetails.workorderOperation.woOPHoldDetails.opStartDate, vm.DateTimeFormat);
        }
        if (vm.woOpEmployeeDetails.workorderOperation.woHoldDetails) {
          vm.woOpEmployeeDetails.workorderOperation.woHoldDetails.woStartDate = $filter('date')(vm.woOpEmployeeDetails.workorderOperation.woHoldDetails.woStartDate, vm.DateTimeFormat);
        }
        // sort operation list of work order by it's operation number.
        //vm.woOpEmployeeDetails.wpOperationList = _.sortBy(vm.woOpEmployeeDetails.wpOperationList, 'opNumber');
        const tabGroups = _.groupBy(vm.woOpEmployeeDetails.wpOperationList, 'clusterID');
        //
        _.each(tabGroups, (group, value) => {
          if (value !== 'null') {
            group = _.sortBy(group, 'opNumber');
            let gIndex = 1;
            _.each(group, (oprtn) => {
              let tabClass = '';
              if (gIndex === 1) {
                tabClass = 'start-';
              }
              else if (gIndex === group.length) {
                tabClass = 'end-';
              }
              oprtn.tabClass = tabClass + (oprtn.isParellelOperation === 0 ? 'tab-sequential-operation' : 'tab-parallel-operation');
              gIndex++;
            });
          }
        });
        vm.woOpEmployeeDetails.wpOperationList = _.sortBy(vm.woOpEmployeeDetails.wpOperationList, 'opNumber');
        // create tablist with its route of woOPID and empID
        if (vm.woOpEmployeeDetails.wpOperationList.length > 0) {
          let index = 0;
          _.each(vm.woOpEmployeeDetails.wpOperationList, (oprtn) => {
            const obj = {};
            obj.id = index++;
            obj.title = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, oprtn.opName, oprtn.opNumber);
            obj.woOPID = oprtn.woOPID;
            obj.clusterID = oprtn.clusterID;
            obj.colorCode = oprtn.colorCode;
            obj.operationAssignedCount = oprtn.operationAssignedCount; // this given operation assigned or not count for employee
            obj.tabLimitAtTraveler = oprtn.tabLimitAtTraveler;
            obj.tabClass = oprtn.tabClass;
            if (oprtn.woOPID === vm.woOpEmployeeDetails.workorderOperation.woOPID) {
              activeIndex = obj.id;
            }
            // check teminate work order than not allow to enter umid/machine setup
            if (oprtn.woOPID === vm.woOpEmployeeDetails.workorderOperation.terminateWOOPID) {
              vm.terminateOPNumber = oprtn.opNumber;
              if (vm.woOpEmployeeDetails.workorderOperation.opNumber > vm.terminateOPNumber) {
                vm.isAboveTerminateWOOP = true;
              }
            }
            if (vm.employeeID) {
              obj.src = TRAVELER.TRAVELER_MANAGE_STATE + '({woOPID:"' + oprtn.woOPID + '", employeeID:"' + vm.employeeID + '", homeOPID:"' + vm.homeOPID + '"})';
            }
            else {
              obj.src = TRAVELER.TRAVELER_MANAGE_ALL_STATE + '({woOPID:"' + oprtn.woOPID + '"})';
            }
            obj.isStopOperation = oprtn.isStopOperation;
            vm.tabList.push(obj);
          });
          refreshTabData();
        }

        // check operation type is inspection process or not
        vm.inspectionProcess = vm.woOpEmployeeDetails.workorderOperation.operationType === GenericCategoryConstant.OPERATION_TYPE.INSPECTION_PROCESS.gencCategoryName;
        vm.isPackagingProcess = vm.woOpEmployeeDetails.workorderOperation.operationType === GenericCategoryConstant.OPERATION_TYPE.PACKING_PROCESS.gencCategoryName;
        // active tab route
        active();

        SetEmployeeDetails();
        // show certificate standard data
        if (vm.woOpEmployeeDetails && vm.woOpEmployeeDetails.workorderOperation) {
          vm.showDocumentsData();
          vm.showEquipmentsData();
          vm.showPartsData();
        }

        // Getting workOrder RevReq list
        if (vm.employeeDetails && vm.woID) {
          getWORevReqForReview();
        }

        // [S] Widgets

        vm.widgetFilter = [
          { name: 'wo ID Identity', value: vm.woID },
          { name: 'OP ID Identity', value: vm.woOpEmployeeDetails.workorderOperation.opID }
        ];

        getWidgets();
        // [E] Widgets

        vm.isParallelOperation = false;
        // start - check for parallel operation for work order
        const woClusterList = vm.woOpEmployeeDetails.workorderOperation.workorderOperationCluster;
        if (woClusterList && woClusterList.length) {
          const isParellelOperation = woClusterList[0].clusterWorkorder.isParellelOperation;
          if (isParellelOperation) {
            vm.isParallelOperation = true;
          }
        }
        // end - check for parallel operation for work order

        vm.woReviewOtherDetails = {
          woVersion: vm.woOpEmployeeDetails.workorderOperation.woVersion,
          opName: vm.woOpEmployeeDetails.workorderOperation.opName
        };
      }
      vm.getHoldResumeStatus({ woID: vm.woID });
      getWOOPUserWisePendingAckNotifications();
      getOddelyRefDesList();
    }, 0);

    /*Bind Operation Details and Employee Operation History Details*/
    const cgPromise = [];
    let activeIndex = null;
    if (vm.woOPID) {
      cgPromise.push(GetTravelerDetails());
      vm.cgBusyLoading = $q.all(cgPromise).then((responses) => {
        var bindHtmlPromise = [bindTravelerPageDetails(responses)];
        vm.cgBusyLoading = $q.all(bindHtmlPromise).then(() => {
        });
      });
    }

    const updateTravelerLatestDetails = (responses) => $timeout(() => {
      vm.woOpEmployeeDetails.woOperationEmployeeList = responses[0].woOperationEmployeeList || [];
      updateEmployeeList(responses[0].woOperationEmployeeList);
      updateOperationList(responses[0].woActiveOperationList, true, false);
      vm.woOpEmployeeDetails.woActiveOperationList = responses[0].woActiveOperationList || [];
      updateOperationList(responses[0].woPausedOperationList, true, true);
      vm.woOpEmployeeDetails.woPausedOperationList = responses[0].woPausedOperationList || [];
      // latest stock details
      vm.woOpEmployeeDetails.woLatestStockDetails = responses[0].woLatestStockDetails || [];

      if (responses[0].woTransactionDetails) {
        vm.woOpEmployeeDetails.wo_transaction = responses[0].woTransactionDetails;
        SetEmployeeDetails();
      } else {
        vm.woTransID = null;
        vm.woOpEmployeeDetails.wo_transaction = null;
        vm.IsCheckInOperation = false;
        resetAllToggleMenu();
      }

      $timeout(() => {
        //vm.isWOHeaderDetailsChanged = !vm.isWOHeaderDetailsChanged;
        refreshTravelerHeaderDetails();
      }, _configBreadCrumbTimeout);
      refreshTabData();
      reloadOperationDataFields();
    }, 0);


    const updateLoginEmployeeDetails = () => {
      var cgEmployeeDetails = [GetTravelerLatestDetails()];
      vm.cgBusyLoading = $q.all(cgEmployeeDetails).then((responses) => {
        var bindHtmlTravelerPromise = [updateTravelerLatestDetails(responses)];
        vm.cgBusyLoading = $q.all(bindHtmlTravelerPromise).then(() => {
        });
      });
    };

    // get user and woop wise pending acknowledge notifications
    const getWOOPUserWisePendingAckNotifications = () => {
      const woOPDetails = {
        woID: vm.woID,
        woNotiCategoryList: [CORE.NOTIFICATION_MESSAGETYPE.WO_START.TYPE, CORE.NOTIFICATION_MESSAGETYPE.WO_STOP.TYPE, CORE.NOTIFICATION_MESSAGETYPE.WO_VERSION_CHANGE.TYPE],
        woOPID: vm.woOPID,
        userID: loginUserDetails.employee.id
      };
      vm.cgBusyLoading = TravelersFactory.getWOOPUserWiseAckPendingNotificationList().save(woOPDetails).$promise.then((res) => {
        if (res && res.data && res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data && res.data.allPendingAckNotifications && res.data.allPendingAckNotifications.length > 0) {
          const allPendingAckNotificationList = res.data.allPendingAckNotifications;
          _.each(allPendingAckNotificationList, (notiItem) => {
            switch (notiItem.messageType) {
              case CORE.NOTIFICATION_MESSAGETYPE.WO_OP_VERSION_CHANGE.TYPE:
              case CORE.NOTIFICATION_MESSAGETYPE.WO_VERSION_CHANGE.TYPE: {
                DisplayAndAckNotiByLoginUser(notiItem);
                break;
              }
              case CORE.NOTIFICATION_MESSAGETYPE.WO_OP_HOLD.TYPE:
              case CORE.NOTIFICATION_MESSAGETYPE.WO_OP_UNHOLD.TYPE: {
                //if (notiItem.senderID != loginUserDetails.employee.id) {
                DisplayAndAckNotiByLoginUser(notiItem);
                //}
                break;
              }
              case CORE.NOTIFICATION_MESSAGETYPE.WO_START.TYPE:
              case CORE.NOTIFICATION_MESSAGETYPE.WO_STOP.TYPE: {
                //if (notiItem.senderID != loginUserDetails.employee.id) {
                DisplayAndAckNotiByLoginUser(notiItem);
                //}
                break;
              }
            }
          });
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const DisplayAndAckNotiByLoginUser = (notiItem) => {
      const model = {
        title: notiItem.subject,
        textContent: notiItem.message,
        multiple: true
      };
      return DialogFactory.alertDialog(model).then((yes) => {
        if (yes) {
          const acknNotiModel = {
            notificationID: notiItem.notificationID,
            receiverID: loginUserDetails.employee.id,
            requestStatus: CORE.NotificationRequestStatus.Accepted
          };
          NotificationSocketFactory.ackNotification().save(acknNotiModel).$promise.then(() => {
            /* empty */
          }).catch(() => {
            /* empty */
          });
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /*Get Responsibilities For Employee Chat */
    const getWorkAreaList = () => {
      vm.cgBusyLoading = GenericCategoryFactory.getAllGenericCategoryByCategoryType().query({ categoryType: CORE.CategoryType.WorkArea.Name }).$promise
        .then((response) => {
          vm.genericCategoryList = [];
          if (response && response.data) {
            vm.genericCategoryList = response.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
    };
    getWorkAreaList();


    vm.entityID = 0;
    vm.dataElementList = [];
    vm.Entity = CORE.Entity;
    vm.entityID = CORE.AllEntityIDS.Operation.ID;
    vm.entityName = CORE.AllEntityIDS.Operation.Name;

    // Don't Remove this code - For Start/Stop Work Order Operation
    ///*Onclick of start workorder operation*/
    vm.toggleWorkorderOperation = (workorderOperation, ev) => {
      if (vm.enableToggleOperation) {
        const obj = {
          title: stringFormat(CORE.MESSAGE_CONSTANT.ALERT_HEADER),
          textContent: stringFormat(CORE.MESSAGE_CONSTANT.START_WORKORDER_OPERATION_CONFIRM, vm.operationFullName),
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const employeeDetail = BaseService.loginUser.employee;

        const operationStatus = {
          woOPID: workorderOperation.woOPID,
          woID: workorderOperation.woID,
          woTransID: vm.woOpEmployeeDetails ? (vm.woOpEmployeeDetails.wo_transaction ? vm.woOpEmployeeDetails.wo_transaction.woTransID : null) : null,     // As required that field for 'Workorder_Trans_Operation_Hold_Unhold' table
          opID: workorderOperation.opID,
          woTransOpHoldUnholdId: vm.woOpEmployeeDetails.workorderOperation.woOPHoldDetails ? vm.woOpEmployeeDetails.workorderOperation.woOPHoldDetails.woTransOpHoldUnholdId : null,
          unHoldEmployeeId: employeeDetail.id,
          holdEmployeeId: employeeDetail.id,
          woNumber: workorderOperation.woNumber,
          woVersion: workorderOperation.woVersion,
          opName: workorderOperation.opName,
          isStopOperation: !workorderOperation.isStopOperation,
          opNumber: workorderOperation.opNumber ? workorderOperation.opNumber.toFixed(3) : (0).toFixed(3),
          PIDCode: vm.woOpEmployeeDetails.workorderOperation.PIDCode,
          partID: vm.woOpEmployeeDetails.workorderOperation.partID,
          rohsIcon: (vm.woOpEmployeeDetails && vm.woOpEmployeeDetails.workorderOperation && vm.woOpEmployeeDetails.workorderOperation.rohsIcon) ? vm.rohsImagePath + vm.woOpEmployeeDetails.workorderOperation.rohsIcon : null,
          rohsName: (vm.woOpEmployeeDetails && vm.woOpEmployeeDetails.workorderOperation && vm.woOpEmployeeDetails.workorderOperation.rohsStatus) ? vm.woOpEmployeeDetails.workorderOperation.rohsStatus : null
        };

        if (workorderOperation.isStopOperation) {
          vm.popup.resume_operation = true;
        }
        else {
          vm.popup.halt_operation = true;
        }
        operationStatus.isStopOperation = !workorderOperation.isStopOperation;
        DialogFactory.dialogService(
          TRAVELER.OPERATION_HOLD_UNHOLD_MODEL_CONTROLLER,
          TRAVELER.OPERATION_HOLD_UNHOLD_MODEL_VIEW,
          ev,
          operationStatus).then((response) => {
            vm.popup.halt_operation = false;
            if (operationStatus.isStopOperation) {
              vm.woOpEmployeeDetails.workorderOperation.woOPHoldDetails = response;       // Bind Model with Added history detail of Halt Resume operation
              vm.woOpEmployeeDetails.workorderOperation.woOPHoldDetails.opHoldBy = response.holdBy;
              vm.woOpEmployeeDetails.workorderOperation.woOPHoldDetails.opStartDate = $filter('date')(new Date(response.startDate), vm.DateTimeFormat);
            }
            workorderOperation.isStopOperation = operationStatus.isStopOperation;
            if (response) {
              // to update stop icon in tab list
              const findOperation = _.find(vm.tabList, (item) => item.woOPID === response.woOPID);
              if (findOperation) {
                findOperation.isStopOperation = operationStatus.isStopOperation;
              }
            }
          }, (error) => {
            vm.popup.halt_operation = false;
            return BaseService.getErrorLog(error);
          });
      }
      else {
        const msgContentForOpActivity = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.OPERATION_ALREADY_STOPPED);
        msgContentForOpActivity.message = stringFormat(msgContentForOpActivity.message, vm.operationFullName);
        const model = {
          messageContent: msgContentForOpActivity
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }
    };
    // Don't Remove this code - For Start/Stop Work Order Operation

    vm.pauseEmployeeOperation = (employeeData) => {
      const opHistory = {};
      opHistory.checkinTime = employeeData.checkinTime;
      opHistory.woTransinoutID = employeeData.woTransinoutID;
      // used for notification into controller
      opHistory.woID = vm.woOpEmployeeDetails.workorderOperation.woID;
      opHistory.opID = vm.woOpEmployeeDetails.workorderOperation.opID;
      opHistory.woOPID = vm.woOpEmployeeDetails.workorderOperation.woOPID;
      opHistory.employeeID = vm.checkInEmployeeID;
      vm.cgBusyLoading = WorkorderTransFactory.pauseEmployeeFromOperation().save(opHistory).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          updateLoginEmployeeDetails();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.resumeEmployeeOperation = (isSingleEmployee, employeeData, ev) => {
      vm.popup.resume_operation = true;
      const opHistory = {};
      if (employeeData) {
        opHistory.woTransinoutID = employeeData.woTransinoutID;
        opHistory.woTransemppausedID = employeeData.woTransemppausedID;
        opHistory.woID = vm.woOpEmployeeDetails.workorderOperation.woID;
        opHistory.opID = vm.woOpEmployeeDetails.workorderOperation.opID;
        opHistory.woOPID = vm.woOpEmployeeDetails.workorderOperation.woOPID;
        opHistory.employeeID = isSingleEmployee ? employeeData.employeeID : vm.checkInEmployeeID;
      }
      const objOperation = {
        title: vm.MainTitle.Resume,
        opHistory: opHistory,
        opData: vm.woOpEmployeeDetails.workorderOperation,
        employeeID: isSingleEmployee ? employeeData.employeeID : vm.checkInEmployeeID,
        buildQty: vm.woOpEmployeeDetails.workorderOperation.buildQty,
        woNumber: vm.woOpEmployeeDetails.workorderOperation.woNumber,
        woVersion: vm.woOpEmployeeDetails.workorderOperation.woVersion,
        isParallelOperation: vm.isParallelOperation,
        isProductionStarted: vm.isProductionStarted
      };
      const data = objOperation;
      DialogFactory.dialogService(
        TRAVELER.RESUME_MODAL_CONTROLLER,
        TRAVELER.RESUME_MODAL_VIEW,
        ev,
        data).then(() => {
          vm.popup.resume_operation = false;
        }, (insertedData) => {
          vm.popup.resume_operation = false;
          if (insertedData && insertedData.message === CORE.ApiResponseTypeStatus.SUCCESS) {
            updateLoginEmployeeDetails();
          }
        }, () => {
          vm.popup.resume_operation = false;
        });
    };

    const openCheckInDetailPopup = (isSingleEmployee, employeeData, ev) => {
      const objectEmployee = {};
      if (isSingleEmployee && employeeData) {
        objectEmployee.woTransID = vm.woTransID;
        objectEmployee.employeeID = employeeData.employeeID;
      }
      const objOperation = {
        title: vm.MainTitle.CheckIn,
        isSingleEmployee: isSingleEmployee,
        objectEmployee: objectEmployee,
        opData: vm.woOpEmployeeDetails.workorderOperation,
        employeeID: vm.checkInEmployeeID,
        buildQty: vm.woOpEmployeeDetails.workorderOperation.buildQty,
        woNumber: vm.woOpEmployeeDetails.workorderOperation.woNumber,
        woVersion: vm.woOpEmployeeDetails.workorderOperation.woVersion,
        isParallelOperation: vm.isParallelOperation,
        isProductionStarted: vm.isProductionStarted,
        opTransCount: vm.woOpEmployeeDetails.woLatestStockDetails.opTransCount,
        PIDCode: vm.woOpEmployeeDetails.workorderOperation.PIDCode,
        partID: vm.woOpEmployeeDetails.workorderOperation.partID,
        rohsIcon: (vm.woOpEmployeeDetails && vm.woOpEmployeeDetails.workorderOperation && vm.woOpEmployeeDetails.workorderOperation.rohsIcon) ? vm.rohsImagePath + vm.woOpEmployeeDetails.workorderOperation.rohsIcon : null,
        rohsName: (vm.woOpEmployeeDetails && vm.woOpEmployeeDetails.workorderOperation && vm.woOpEmployeeDetails.workorderOperation.rohsStatus) ? vm.woOpEmployeeDetails.workorderOperation.rohsStatus : null
      };
      const data = objOperation;
      DialogFactory.dialogService(
        TRAVELER.CHECKIN_MODAL_CONTROLLER,
        TRAVELER.CHECKIN_MODAL_VIEW,
        ev,
        data).then(() => {
          vm.popup.checkin_operation = false;
        }
          , (insertedData) => {
            vm.popup.checkin_operation = false;
            if (insertedData && insertedData.message === CORE.ApiResponseTypeStatus.SUCCESS) {
              updateLoginEmployeeDetails();
            }
            vm.isProductionStarted = true;
          }, () => {
            vm.popup.checkin_operation = false;
          });
    };

    /*Onclick of checkin workorder operation*/
    vm.CheckInOperation = (isSingleEmployee, employeeData, ev) => {
      let messageContent;
      let model;
      if (vm.woOpEmployeeDetails.workorderOperation.isRevisedWO === 1 && !vm.woOpEmployeeDetails.woLatestStockDetails.BuildQty) {
        // if revised workorder and build quantity not available then first transfer WO.
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.TRANS_BUILD_QTY_FOR_REVISED_WO);
        model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(obj);
      } else if (vm.woOpEmployeeDetails && vm.woOpEmployeeDetails.woLatestStockDetails && vm.woOpEmployeeDetails.woLatestStockDetails.BuildQty === (vm.woOpEmployeeDetails.woLatestStockDetails.ReadyForShippQty + vm.woOpEmployeeDetails.woLatestStockDetails.TotalScrappedQty)) {
        //if work order all qty finished then also not allow to do check-in
        model = {
          title: stringFormat(CORE.MESSAGE_CONSTANT.ALERT_HEADER),
          textContent: CORE.MESSAGE_CONSTANT.ALL_QTY_PASSED_FROM_OPERATION,
          multiple: true
        };
        DialogFactory.alertDialog(model);
        return;
      } else if (vm.woOpEmployeeDetails.workorderOperation.woStatus !== vm.woStatus.PUBLISHED
        && vm.woOpEmployeeDetails.workorderOperation.woStatus !== vm.woStatus.UNDER_TERMINATION) {
        // if work order is completed/void then not allow to check-in
        model = {
          title: stringFormat(CORE.MESSAGE_CONSTANT.ALERT_HEADER),
          textContent: stringFormat(CORE.MESSAGE_CONSTANT.CHECKIN_LOCK, vm.operationFullName),
          multiple: true
        };
        DialogFactory.alertDialog(model);
        return;
      }
      else if (vm.woOpEmployeeDetails.workorderOperation.isStopOperation || vm.woOpEmployeeDetails.workorderOperation.isStopWorkorder || vm.isKitHaltStatus) {
        const msgContentForOpActivity = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.OPERATION_ALREADY_STOPPED);
        msgContentForOpActivity.message = stringFormat(msgContentForOpActivity.message, vm.operationFullName);
        const model = {
          messageContent: msgContentForOpActivity
        };
        DialogFactory.messageAlertDialog(model);
        return;
      } else {
        vm.popup.checkin_operation = true;
        openCheckInDetailPopup(isSingleEmployee, employeeData, ev);
      }
    };

    const CheckoutDetromBoxSerialPopup = $rootScope.$on('CheckoutDetromBoxSerialPopup', (event, boxDetail) => {
      openCheckOutDetailPopup(false, null, boxDetail.ev, boxDetail.updateCheckinOperationFn);
    });

    const openCheckOutDetailPopup = (isSingleEmployee, employeeData, ev, updateBoxFn) => {
      const objectEmployee = {};
      if (isSingleEmployee && employeeData) {
        objectEmployee.woTransID = vm.woTransID;
        objectEmployee.isSetup = vm.isSetup;
        objectEmployee.employeeID = employeeData.employeeID;
        objectEmployee.checkinTime = employeeData.checkinTime;
        objectEmployee.woTransinoutID = employeeData.woTransinoutID;
      }

      const objOperation = {
        title: vm.MainTitle.CheckOut,
        isSingleEmployee: isSingleEmployee,
        objectEmployee: objectEmployee,
        opData: vm.woOpEmployeeDetails.workorderOperation,
        woOPCurrentHistory: vm.woOpEmployeeDetails.wo_transaction,
        buildQty: vm.woOpEmployeeDetails.workorderOperation.buildQty,
        woNumber: vm.woOpEmployeeDetails.workorderOperation.woNumber,
        woVersion: vm.woOpEmployeeDetails.workorderOperation.woVersion,
        employeeID: vm.checkInEmployeeID,
        isParallelOperation: vm.isParallelOperation,
        inspectionProcess: vm.inspectionProcess,
        PIDCode: vm.woOpEmployeeDetails.workorderOperation.PIDCode,
        partID: vm.woOpEmployeeDetails.workorderOperation.partID,
        rohsIcon: (vm.woOpEmployeeDetails && vm.woOpEmployeeDetails.workorderOperation && vm.woOpEmployeeDetails.workorderOperation.rohsIcon) ? vm.rohsImagePath + vm.woOpEmployeeDetails.workorderOperation.rohsIcon : null,
        rohsName: (vm.woOpEmployeeDetails && vm.woOpEmployeeDetails.workorderOperation && vm.woOpEmployeeDetails.workorderOperation.rohsStatus) ? vm.woOpEmployeeDetails.workorderOperation.rohsStatus : null
      };
      const data = objOperation;
      DialogFactory.dialogService(
        TRAVELER.CHECKOUT_MODAL_CONTROLLER,
        TRAVELER.CHECKOUT_MODAL_VIEW,
        ev,
        data).then(() => {
          vm.popup.checkout_operation = false;
        }, (insertedData) => {
          vm.popup.checkout_operation = false;
          if (insertedData && insertedData === CORE.ApiResponseTypeStatus.SUCCESS) {
            // disable box serial# menu button
            // vm.packingMenuList[1].isDisable = true;
            if (updateBoxFn) {
              updateBoxFn();
            }
            updateLoginEmployeeDetails();
            //vm.IsCheckInOperation = false;
          }
        }, () => {
          vm.popup.checkout_operation = false;
          // console.log(err);
        });
    };

    /*Onclick of stop activity workorder operation*/
    vm.CheckOutOperation = (isSingleEmployee, employeeData, ev) => {
      vm.popup.checkout_operation = true;
      if (isSingleEmployee) {
        if (vm.woOpEmployeeDetails.woOperationEmployeeList.length > 1) {
          openCheckOutDetailPopup(isSingleEmployee, employeeData, ev);
        } else {
          vm.CheckOutOperation(false, null, ev);
        }
      } else {
        openCheckOutDetailPopup(isSingleEmployee, employeeData, ev);
      }
    };


    // Manage change review reuest
    vm.manageRequest = (ev, isAddNew) => {
      if (isAddNew) {
        const data = {
          woID: vm.woOpEmployeeDetails.workorderOperation.woID,
          opID: vm.woOpEmployeeDetails.workorderOperation.opID,
          woOPID: vm.woOpEmployeeDetails.workorderOperation.woOPID,
          PIDCode: vm.woOpEmployeeDetails.workorderOperation.PIDCode,
          partID: vm.woOpEmployeeDetails.workorderOperation.partID,
          rohsIcon: (vm.woOpEmployeeDetails && vm.woOpEmployeeDetails.workorderOperation && vm.woOpEmployeeDetails.workorderOperation.rohsIcon) ? vm.rohsImagePath + vm.woOpEmployeeDetails.workorderOperation.rohsIcon : null,
          rohsName: (vm.woOpEmployeeDetails && vm.woOpEmployeeDetails.workorderOperation && vm.woOpEmployeeDetails.workorderOperation.rohsStatus) ? vm.woOpEmployeeDetails.workorderOperation.rohsStatus : null
        };

        DialogFactory.dialogService(
          TRAVELER.CHANGE_REQUEST_MODAL_CONTROLLER,
          TRAVELER.CHANGE_REQUEST_MODAL_VIEW,
          ev,
          data).then(() => {
            // Getting workOrder RevReq list
            if (vm.employeeDetails && vm.woID) {
              getWORevReqForReview();
            }
          }, () => {
            // Getting workOrder RevReq list
            if (vm.employeeDetails && vm.woID) {
              getWORevReqForReview();
            }
          }, (error) => BaseService.getErrorLog(error));
      }
      else {
        // Work Order review sidenav
        //vm.openWorkorderReviewModel = (ev) => {
        $mdSidenav('workorder-review').open();
        vm.isWorkorderReviewSideNavOpen = true;

        $mdSidenav('workorder-review').onClose(() => {
          vm.isWorkorderReviewSideNavOpen = false;
        });
        //}
        // ENDS

        // [E]
      }
    };

    // On click of Add Processed Serial#
    vm.OpenSerialNoPopUp = (ev, isAdd) => {
      if (vm.woOpEmployeeDetails.workorderOperation.qtyControl
        && (vm.woOpEmployeeDetails.workorderOperation.isOperationTrackBySerialNo || vm.woOpEmployeeDetails.workorderOperation.isTrackBySerialNo)) {
        vm.popup.add_serialno = true;
        const data = {
          woID: vm.woOpEmployeeDetails.workorderOperation.woID,
          opID: vm.woOpEmployeeDetails.workorderOperation.opID,
          woOPID: vm.woOpEmployeeDetails.workorderOperation.woOPID,
          woTransID: isAdd ? vm.woTransID : null,
          employeeID: vm.checkInEmployeeID,
          qtyControl: vm.woOpEmployeeDetails.workorderOperation.qtyControl,
          isIssueQty: vm.woOpEmployeeDetails.workorderOperation.isIssueQty,
          issueQty: vm.woOpEmployeeDetails.wo_transaction ? vm.woOpEmployeeDetails.wo_transaction.issueQty : null,
          woNumber: vm.woOpEmployeeDetails.workorderOperation.woNumber,
          woVersion: vm.woOpEmployeeDetails.workorderOperation.woVersion,
          isRework: vm.woOpEmployeeDetails.workorderOperation.isRework,
          isParallelOperation: vm.isParallelOperation,
          opName: vm.woOpEmployeeDetails.workorderOperation.opName,
          isCheckInOperation: isAdd ? vm.IsCheckInOperation : false,
          operationFullName: vm.operationFullName,
          isSetup: isAdd ? ((vm.woOpEmployeeDetails && vm.woOpEmployeeDetails.wo_transaction) ? vm.woOpEmployeeDetails.wo_transaction.isSetup : false) : false,
          isAllowMissingPartQty: vm.woOpEmployeeDetails.workorderOperation.isAllowMissingPartQty,
          isAllowBypassQty: vm.woOpEmployeeDetails.workorderOperation.isAllowBypassQty,
          inspectionProcess: vm.inspectionProcess,
          isMoveToStock: vm.woOpEmployeeDetails.workorderOperation.isMoveToStock,
          PIDCode: vm.woOpEmployeeDetails.workorderOperation.PIDCode,
          partID: vm.woOpEmployeeDetails.workorderOperation.partID,
          rohsIcon: (vm.woOpEmployeeDetails && vm.woOpEmployeeDetails.workorderOperation && vm.woOpEmployeeDetails.workorderOperation.rohsIcon) ? vm.rohsImagePath + vm.woOpEmployeeDetails.workorderOperation.rohsIcon : null,
          rohsName: (vm.woOpEmployeeDetails && vm.woOpEmployeeDetails.workorderOperation && vm.woOpEmployeeDetails.workorderOperation.rohsStatus) ? vm.woOpEmployeeDetails.workorderOperation.rohsStatus : null
        };

        DialogFactory.dialogService(
          TRAVELER.SERIAL_NUMBER_MODEL_CONTROLLER,
          TRAVELER.SERIAL_NUMBER_MODAL_VIEW,
          ev,
          data).then(() => {
            vm.popup.add_serialno = false;
          }, () => {
            vm.popup.add_serialno = false;
          }, (error) => {
            vm.popup.add_serialno = false;
            return BaseService.getErrorLog(error);
          });
      } else {
        return;
      }
    };

    /*Get documents list*/
    vm.showDocumentsData = () => {
      vm.isdocuments = true;
      vm.id = vm.woOpEmployeeDetails.workorderOperation.woOPID;
      vm.entity = vm.Workorder_operationEntity;
    };

    /*Get equipment list*/
    vm.showEquipmentsData = () => {
      const _objList = {};
      _objList.woOPID = vm.woOpEmployeeDetails.workorderOperation.woOPID;
      vm.cgBusyLoadingEquipment = TravelersFactory.getWorkorderEquipmentByWoID().query({ listObj: _objList }).$promise.then((woEquipmentDetails) => {
        vm.woEquipmentDetails = [];
        vm.woEquipmentDetails = woEquipmentDetails.data;
        _.each(vm.woEquipmentDetails, (itemData) => {
          if (itemData.equipment.genericDocument.length > 0) {
            itemData.equipment.ProfilePic = CORE.WEB_URL + USER.EQUIPMENT_BASE_PATH + itemData.equipment.genericDocument[0].gencFileName;
          }
          else {
            itemData.equipment.ProfilePic = CORE.WEB_URL + USER.EQUIPMENT_DEFAULT_IMAGE_PATH + 'profile.jpg';
          }
        });
        vm.Show.Equipment = vm.woEquipmentDetails.length > 0 ? true : false;
        // get UMID count for pending verification
        const promise = [getPendingVerificationCount()];
        $q.all(promise).then((resCnt) => {
          if (resCnt && resCnt.length > 0 && resCnt[0] && resCnt[0].length > 0) {
            _.each(vm.woEquipmentDetails, (pendingItem) => {
              const obj = _.find(resCnt[0], (item) => item.woOpEqpID === pendingItem.woOpEqpID);
              pendingItem.pendingCount = obj ? obj.cnt : 0;
              pendingItem.pendingCountText = pendingItem.pendingCount > 0 ? stringFormat('({0})', pendingItem.pendingCount) : '';
            });
          }
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /*Get part list*/
    vm.showPartsData = () => {
      const _objList = {};
      //_objList.woID = vm.woOpEmployeeDetails.workorderOperation.woID;
      //_objList.opID = vm.woOpEmployeeDetails.workorderOperation.opID;
      _objList.woOPID = vm.woOpEmployeeDetails.workorderOperation.woOPID;
      _objList.woAssyID = vm.woOpEmployeeDetails.workorderOperation.partID;

      vm.cgBusyLoadingParts = TravelersFactory.getWorkorderPartByWoID().query({ listObj: _objList }).$promise.then((woPartDetails) => {
        vm.woPartDetails = [];
        _.each(woPartDetails.data, (itemData) => {
          itemData.rohsIcon = vm.rohsImagePath + itemData.rohsIcon;
          if (!itemData.imageURL) {
            itemData.imageURL = CORE.WEB_URL + USER.COMPONENT_DEFAULT_IMAGE_PATH + 'profile.jpg';
          } else {
            if (!itemData.imageURL.startsWith('http://') && !itemData.imageURL.startsWith('https://')) {
              itemData.imageURL = BaseService.getPartMasterImageURL(itemData.documentPath, itemData.imageURL);
            }
          }
        });
        vm.woPartDetails = woPartDetails.data;
        vm.Show.Part = vm.woPartDetails.length > 0 ? true : false;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /*Show description*/
    vm.ShowDescription = (title, description, name, ev) => {
      const obj = {
        title: title,
        description: description,
        name: name
      };
      const data = obj;
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data).then(() => {
        }
          , () => {
          }, (err) => BaseService.getErrorLog(err));
    };

    /*Update operation*/
    vm.EditOperation = (title, operation, ev) => {
      const obj = {
        title: title,
        name: operation.opName,
        opData: angular.copy(operation),
        opTypeForWOOPTimeLineLog: null
      };

      if (vm.MainTitle.Does === title || vm.MainTitle.Donts === title) {
        obj.opTypeForWOOPTimeLineLog = CORE.Operations_Type_For_WOOPTimeLineLog.DosAndDonts;
      }

      const data = obj;
      DialogFactory.dialogService(
        CORE.EDIT_DESCRIPTION_MODAL_CONTROLLER,
        CORE.EDIT_DESCRIPTION_MODAL_VIEW,
        ev,
        data).then(() => {
        }
          , (insertedData) => {
            if (insertedData && insertedData.opData) {
              if (vm.MainTitle.Does === title) {
                operation.opDoes = insertedData.opData.opDoes;
              }
              else if (vm.MainTitle.Donts === title) {
                operation.opDonts = insertedData.opData.opDonts;
              }
              else if (vm.MainTitle.Instruction === title) {
                operation.opDescription = insertedData.opData.opDescription;
              }
              else if (vm.MainTitle.WorkingCondition === title) {
                operation.opWorkingCondition = insertedData.opData.opWorkingCondition;
              }
              else if (vm.MainTitle.ManagementInstruction === title) {
                operation.opManagementInstruction = insertedData.opData.opManagementInstruction;
              }
              else if (vm.MainTitle.DeferredInstruction === title) {
                operation.opDeferredInstruction = insertedData.opData.opDeferredInstruction;
              }
            }
            refreshTravelerHeaderDetails();
          }, (err) => BaseService.getErrorLog(err));
    };

    /*Show all history*/
    vm.ViewLogHistory = (title, operation, ev) => {
      vm.popup.view_history = true;
      const obj = {
        title: title,
        name: operation.opName,
        opData: operation,
        employeeID: vm.checkInEmployeeID,
        woNumber: vm.woOpEmployeeDetails.workorderOperation.woNumber,
        woVersion: vm.woOpEmployeeDetails.workorderOperation.woVersion,
        isLoad: true,
        partID: vm.woOpEmployeeDetails.workorderOperation.partID,
        rohsIcon: (vm.woOpEmployeeDetails && vm.woOpEmployeeDetails.workorderOperation && vm.woOpEmployeeDetails.workorderOperation.rohsIcon) ? vm.rohsImagePath + vm.woOpEmployeeDetails.workorderOperation.rohsIcon : null,
        rohsName: (vm.woOpEmployeeDetails && vm.woOpEmployeeDetails.workorderOperation && vm.woOpEmployeeDetails.workorderOperation.rohsStatus) ? vm.woOpEmployeeDetails.workorderOperation.rohsStatus : null
      };
      const data = obj;
      $timeout(() => {
        DialogFactory.dialogService(
          TRAVELER.TRAVELER_MODAL_CONTROLLER,
          TRAVELER.TRAVELER_MODAL_VIEW,
          ev,
          data).then(() => {
            vm.popup.view_history = false;
          }, () => {
            vm.popup.view_history = false;
          }, () => {
            vm.popup.view_history = false;
          });
      });
    };

    /*Show All*/
    vm.ShowAll = (title, datalist, operation, ev) => {
      const obj = {
        title: title,
        name: operation.opName,
        datalist: datalist,
        woOpEmployeeDetails: vm.woOpEmployeeDetails,
        woTransID: vm.woTransID,
        isUserOperator: vm.isUserOperator
      };
      const data = obj;
      DialogFactory.dialogService(
        CORE.SHOW_LIST_MODAL_CONTROLLER,
        CORE.SHOW_LIST_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.dateFormat = _dateDisplayFormat;

    /*Show All*/
    vm.ShowAllForDataElement = (title, datalist, object, ev) => {
      const obj = {
        title: title,
        datalist: object,
        woOpEmployeeDetails: vm.woOpEmployeeDetails,
        woTransID: vm.woTransID,
        employeeID: vm.employeeID
      };
      const data = obj;
      DialogFactory.dialogService(
        CORE.SAVE_DATAELEMENT_LIST_MODAL_CONTROLLER,
        CORE.SAVE_DATAELEMENT_LIST_MODAL_VIEW,
        ev,
        data).then(() => {
        }, () => {
          if (obj.title === vm.MainTitle.OperationDataFields) {
            vm.showOperationFields = false;
          }
        }, () => {

        }).finally(() => {
          /* for updating op data element latest value , call directive*/
          if (obj.title === vm.MainTitle.OperationDataFields) {
            $timeout(() => {
              vm.showOperationFields = true;
            }, 0);
          }
        });
    };

    /*Show All*/
    vm.OpenFirstArticle = () => {
      if (!vm.ShowFirstArticle && !vm.IsCheckInOperation) {
        const msgContentForOpActivity = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.TRAVELER_OPERATION_ACTIVITY_NOT_STARTED);
        msgContentForOpActivity.message = stringFormat(msgContentForOpActivity.message, vm.operationFullName);
        const model = {
          messageContent: msgContentForOpActivity
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }
      vm.ShowFirstArticle = !vm.ShowFirstArticle;
      if (vm.ShowFirstArticle) {
        getWorkorderTransFirstPiece();
      }
    };

    // On click of chat button
    vm.openChat = ($event, gencCategoryID) => {
      var data = {
        workAreaID: gencCategoryID,
        woID: vm.woOpEmployeeDetails.workorderOperation.woID,
        opID: vm.woOpEmployeeDetails.workorderOperation.opID
      };

      DialogFactory.dialogService(
        CHAT.CHAT_CONTROLLER,
        CHAT.CHAT_VIEW,
        $event,
        data).then(() => {
        }, (error) => BaseService.getErrorLog(error));
    };

    /*On click of log deffect button*/
    vm.openLogDefectModel = () => {
      vm.popup.log_defects = true;

      vm.logDefectData = {
        woID: vm.woOpEmployeeDetails.workorderOperation.woID,
        opID: vm.woOpEmployeeDetails.workorderOperation.opID,
        woOPID: vm.woOpEmployeeDetails.workorderOperation.woOPID,
        opName: vm.operationFullName,
        transID: vm.woOpEmployeeDetails.wo_transaction ? vm.woOpEmployeeDetails.wo_transaction.woTransID : null,
        isOperationTrackBySerialNo: vm.woOpEmployeeDetails.workorderOperation.isOperationTrackBySerialNo,
        isTrackBySerialNo: vm.woOpEmployeeDetails.workorderOperation.isTrackBySerialNo,
        woNumber: vm.woOpEmployeeDetails.workorderOperation.woNumber,
        woVersion: vm.woOpEmployeeDetails.workorderOperation.woVersion,
        employeeID: vm.employeeID,
        isRework: vm.woOpEmployeeDetails.workorderOperation.isRework,
        isDisable: (!vm.IsCheckInOperation || vm.woOpEmployeeDetails.employee.isPaused || !vm.woOpEmployeeDetails.wo_transaction) ? true : false,
        fullName: (vm.woOpEmployeeDetails.employee.firstName ? vm.woOpEmployeeDetails.employee.firstName : '') + ' ' + (vm.woOpEmployeeDetails.employee.lastName ? vm.woOpEmployeeDetails.employee.lastName : '') + ((vm.woOpEmployeeDetails.employee.employeeDepartment && vm.woOpEmployeeDetails.employee.employeeDepartment.genericCategory) ? '| ' + vm.woOpEmployeeDetails.employee.employeeDepartment.genericCategory.gencCategoryName : '')
      };

      $mdSidenav('log-defect').open();
      vm.isLogDefectOpen = true;

      $mdSidenav('log-defect').onClose(() => {
        vm.isLogDefectOpen = false;
        vm.popup.log_defects = false;
      });
    };
    /*On click of Pre-Programming Parts button*/
    vm.openPreProgComponentModel = () => {
      vm.popup.pre_programming = true;
      if (!vm.IsCheckInOperation) {
        const msgContentForOpActivity = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.TRAVELER_OPERATION_ACTIVITY_NOT_STARTED);
        msgContentForOpActivity.message = stringFormat(msgContentForOpActivity.message, vm.operationFullName);
        const model = {
          messageContent: msgContentForOpActivity
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }

      //vm.preprogComponent = {
      //  woID: vm.woOpEmployeeDetails.workorderOperation.woID,
      //  opID: vm.woOpEmployeeDetails.workorderOperation.opID,
      //  woOPID: vm.woOpEmployeeDetails.workorderOperation.woOPID,
      //  opName: vm.operationFullName,
      //  transID: vm.woOpEmployeeDetails.wo_transaction.woTransID,
      //  buildQty: vm.woOpEmployeeDetails.workorderOperation.buildQty,
      //  woNumber: vm.woOpEmployeeDetails.workorderOperation.woNumber,
      //  woVersion: vm.woOpEmployeeDetails.workorderOperation.woVersion,
      //  //opName: vm.woOpEmployeeDetails.workorderOperation.opName,
      //  employeeID: vm.employeeID,
      //  partID: vm.woOpEmployeeDetails.workorderOperation.partID,
      //  isDisable: (!vm.IsCheckInOperation || vm.woOpEmployeeDetails.employee.isPaused || !vm.woOpEmployeeDetails.wo_transaction) ? true : false,
      //};

      const isSetScanUMIDDisable = checkDisableScan();
      vm.preprogComponent = {
        woID: vm.woOpEmployeeDetails.workorderOperation.woID,
        opID: vm.woOpEmployeeDetails.workorderOperation.opID,
        woOPID: vm.woOpEmployeeDetails.workorderOperation.woOPID,
        transID: vm.woOpEmployeeDetails.wo_transaction.woTransID,
        partID: vm.woOpEmployeeDetails.workorderOperation.partID,
        woNumber: vm.woOpEmployeeDetails.workorderOperation.woNumber,
        woVersion: vm.woOpEmployeeDetails.workorderOperation.woVersion,
        opName: vm.woOpEmployeeDetails.workorderOperation.opName,
        opFullName: vm.operationFullName,
        opNumber: vm.woOpEmployeeDetails.workorderOperation.opNumber,
        opVersion: vm.woOpEmployeeDetails.workorderOperation.opVersion,
        PIDCode: vm.woOpEmployeeDetails.workorderOperation.PIDCode,
        isCustom: vm.woOpEmployeeDetails.workorderOperation.isCustom,
        nickName: vm.woOpEmployeeDetails.workorderOperation.nickName,
        mfgPN: vm.woOpEmployeeDetails.workorderOperation.mfgPN,
        mfgPNDescription: vm.woOpEmployeeDetails.workorderOperation.mfgPNDescription,
        rohsStatus: vm.woOpEmployeeDetails.workorderOperation.rohsStatus,
        rohsIcon: vm.woOpEmployeeDetails.workorderOperation.rohsIcon,
        woTransID: vm.woOpEmployeeDetails.wo_transaction ? vm.woOpEmployeeDetails.wo_transaction.woTransID : null,
        employeeId: vm.employeeID,
        isVerify: false,
        isDisableScan: isSetScanUMIDDisable,
        isFeeder: false,
        isTeamOperation: vm.woOpEmployeeDetails.workorderOperation.isTeamOperation,
        lineID: _.map((vm.woOpEmployeeDetails.salesOrderDet), 'lineID').join(),
        salesOrderMstIDs: _.map((_.uniqBy(vm.woOpEmployeeDetails.salesOrderDet, 'refSalesOrderID')), 'refSalesOrderID').join(),
        salesOrderDetID: vm.woOpEmployeeDetails.salesOrderDet.length > 0 ? vm.woOpEmployeeDetails.salesOrderDet[0].id : null,
        salesOrderNumber: _.map((_.uniqBy(vm.woOpEmployeeDetails.salesOrderDet, 'salesordernumber')), 'salesordernumber').join(),
        poNumber: _.map((_.uniqBy(vm.woOpEmployeeDetails.salesOrderDet, 'poNumber')), 'poNumber').join(),
        SOPOQtyValues: _.map((vm.woOpEmployeeDetails.salesOrderDet), 'qty').join(),
        soMRPQty: _.map((vm.woOpEmployeeDetails.salesOrderDet), 'mrpqty').join(),
        soPOQty: _.map((vm.woOpEmployeeDetails.salesOrderDet), 'poQty').join(),
        buildQty: vm.woOpEmployeeDetails.workorderOperation.buildQty
      };

      $mdSidenav('preprogram-component').open();
      vm.isPreprogCompOpen = true;

      $mdSidenav('preprogram-component').onClose(() => {
        vm.isPreprogCompOpen = false;
        vm.popup.pre_programming = false;
      });
    };

    $timeout(() => {
      $rootScope.$emit('toogleMenu', null);
    }, 0);

    $scope.$on('$destroy', () => {
      $rootScope.$emit('toogleMenu', null);
      // Remove socket listeners
      removeSocketListener();
      stateChangeSuccessCall();
      refreshWOHeaderDetails();
      CheckoutDetromBoxSerialPopup();
      $mdDialog.hide(false, { closeAll: true });
    });

    // on disconnect socket.io
    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });

    vm.ToogleToolbar = () => {
      var elemList = document.getElementsByClassName('first-article-toolbar');
      _.each(elemList, (item) => {
        if (item.style.display === 'none') {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    };

    /* *********  First Article Serial# *********** */

    vm.woTransFirstPieceSerialsModel = {
      prefixorsuffix: true,
      Presuffix: null,
      noofDigit: null,
      numOfSerialsToGenerate: null,
      dateCode: null,
      issue: null,
      resolution: null,
      currStatus: null
    };

    /* get work order transaction first piece details  */
    const getWorkorderTransFirstPiece = () => {
      vm.workorderTransFirstPieceDetList = [];
      const woOpdetails = {
        woOPID: vm.woOpEmployeeDetails.workorderOperation.woOPID
      };
      vm.cgBusyLoading = WorkorderTransFirstPcsdetFactory.getWOTransFirstpcsSerialsDet().query(woOpdetails).$promise.then((res) => {
        if (res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data && res.data.workorderTransFirstPieceDetList &&
          res.data.workorderTransFirstPieceDetList.length > 0) {
          vm.workorderTransFirstPieceDetList = res.data.workorderTransFirstPieceDetList;
          ///* enable/disable serial# generation textbox */
          //if (vm.workorderTransFirstPieceDetList.length > 0) {
          //  //vm.workorderTransFirstPieceDetList[0].isShow = true;
          //  //vm.woTransFirstPieceSerialsModel.prefixorsuffix = vm.workorderTransFirstPieceDetList[0].workorderOperationFirstpiece.prefixorsuffix;
          //  vm.woTransFirstPieceSerialsModel.prefixorsuffix = vm.workorderTransFirstPieceDetList[0].prefixorsuffix;
          //  vm.isDisablePrefixorSuffix = true;
          //  //vm.woTransFirstPieceSerialsModel.Presuffix = vm.workorderTransFirstPieceDetList[0].workorderOperationFirstpiece.Presuffix;
          //  vm.woTransFirstPieceSerialsModel.Presuffix = vm.workorderTransFirstPieceDetList[0].Presuffix;
          //  vm.isDisablePreSuffix = true;
          //  //vm.woTransFirstPieceSerialsModel.noofDigit = vm.workorderTransFirstPieceDetList[0].workorderOperationFirstpiece.noofDigit;
          //  vm.woTransFirstPieceSerialsModel.noofDigit = vm.workorderTransFirstPieceDetList[0].noofDigit;
          //  vm.isDisableNoOfDigit = true;
          //}
          //else {
          //  vm.isDisablePrefixorSuffix = false;
          //  vm.isDisablePreSuffix = false;
          //  vm.isDisableNoOfDigit = false;
          //}
          vm.workorderOperationFirstPieceSerialsList = _.sortBy(vm.workorderOperationFirstPieceSerialsList, 'wofirstpieceID');
          setEditModeForworkorderTransFirstPieceDet();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const checkAllowedNoOfSerialsToGenerate = () => {
      const existsAllWoOpFPAndTranSerials = parseInt(vm.workorderOperationFirstPieceSerialsList.length) + parseInt(vm.workorderTransFirstPieceDetList.length);
      vm.allowedSerialsToGenerate = parseInt(vm.woOpEmployeeDetails.workorderOperation.buildQty) - parseInt(existsAllWoOpFPAndTranSerials);
    };

    /* filter out already added serials from work order serials autocomplete */
    const removeAddedSerialsFromWOSerialList = () => {
      if (vm.workorderSerialsList.length > 0 && vm.workorderTransFirstPieceDetList.length > 0) {
        _.each(vm.workorderTransFirstPieceDetList, (item) => {
          _.some(vm.workorderSerialsList, (obj) => {
            if (obj.SerialNo === item.serialno) {
              return _.remove(vm.workorderSerialsList, (itemtoremove) => obj === itemtoremove);
            }
          });
        });
      }
    };

    /* filter out already added serials from WO OP first Piece serials autocomplete */
    //const removeAddedSerialsFromWoOpFirstPieceSerialList = () => {
    //  if (vm.workorderOperationFirstPieceSerialsList.length > 0 && vm.workorderTransFirstPieceDetList.length > 0) {
    //    _.each(vm.workorderTransFirstPieceDetList, (item) => {
    //      _.some(vm.workorderOperationFirstPieceSerialsList, (obj) => {
    //        if (obj.serialno === item.serialno) {
    //          return _.remove(vm.workorderOperationFirstPieceSerialsList, (itemtoremove) => obj === itemtoremove);
    //        }
    //      });
    //    });
    //  }
    //};

    vm.woTransFirstPieceSerialModel = {
      FromSerialNo: null,
      ToSerialNo: null,
      Qty: null
    };

    const setEditModeForworkorderTransFirstPieceDet = () => {
      _.each(vm.workorderTransFirstPieceDetList, (item) => {
        item.isEditMode = false;
        //item.currStatus = item.workorderOperationFirstpiece.currStatus ? item.workorderOperationFirstpiece.currStatus: vm.WoOpFirstArticleStatus[0].Value;
        item.currStatus = item.currStatus ? item.currStatus : vm.WoOpFirstArticleStatus[2].Value;
      });
    };

    vm.OpenEditDivOfWoTransFirstPcsdet = (wotranfirstpcsdetitem) => {
      if (vm.ShowFirstArticle && !vm.IsCheckInOperation) {
        const msgContentForOpActivity = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.TRAVELER_OPERATION_ACTIVITY_NOT_STARTED);
        msgContentForOpActivity.message = stringFormat(msgContentForOpActivity.message, vm.operationFullName);
        const model = {
          messageContent: msgContentForOpActivity
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }
      wotranfirstpcsdetitem.isEditMode = true;
      wotranfirstpcsdetitem.isShow = true;
    };

    /* Save(update) work order trans first piece details */
    vm.saveWoTransFirstPcsdet = (wotranfirstpcsdetitem) => {
      vm.saveDisable = true;
      if (vm.ShowFirstArticle && !vm.IsCheckInOperation) {
        const msgContentForOpActivity = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.TRAVELER_OPERATION_ACTIVITY_NOT_STARTED);
        msgContentForOpActivity.message = stringFormat(msgContentForOpActivity.message, vm.operationFullName);
        const model = {
          messageContent: msgContentForOpActivity
        };
        vm.saveDisable = false;
        DialogFactory.messageAlertDialog(model);
        return;
      }

      if (BaseService.focusRequiredField(vm.firstartical['wotranFirstPcsForm_' + wotranfirstpcsdetitem.serialno])) {
        vm.saveDisable = false;
        return;
      }

      vm.woTransFirstPcsdetModel = {};
      vm.woTransFirstPcsdetModel.woTransFirstpcsDetID = wotranfirstpcsdetitem.workorderTransFirstPcsDet ? wotranfirstpcsdetitem.workorderTransFirstPcsDet.woTransFirstpcsDetID : null;
      vm.woTransFirstPcsdetModel.woTransFirstPieceID = wotranfirstpcsdetitem.wofirstpieceID;
      vm.woTransFirstPcsdetModel.issue = wotranfirstpcsdetitem.workorderTransFirstPcsDet ? wotranfirstpcsdetitem.workorderTransFirstPcsDet.issue : null;
      vm.woTransFirstPcsdetModel.resolution = wotranfirstpcsdetitem.workorderTransFirstPcsDet ? wotranfirstpcsdetitem.workorderTransFirstPcsDet.resolution : null;
      vm.woTransFirstPcsdetModel.currStatus = wotranfirstpcsdetitem.currStatus;
      vm.woTransFirstPcsdetModel.serialno = wotranfirstpcsdetitem.serialno;
      vm.woTransFirstPcsdetModel.woNumber = vm.woOpEmployeeDetails.workorderOperation.woNumber;
      vm.woTransFirstPcsdetModel.woVersion = vm.woOpEmployeeDetails.workorderOperation.woVersion;
      vm.woTransFirstPcsdetModel.opName = vm.woOpEmployeeDetails.workorderOperation.opName;
      vm.woTransFirstPcsdetModel.woOPID = vm.woOpEmployeeDetails.workorderOperation.woOPID;
      vm.woTransFirstPcsdetModel.employeeID = vm.employeeID;
      vm.woTransFirstPcsdetModel.remark = wotranfirstpcsdetitem.workorderTransFirstPcsDet ? wotranfirstpcsdetitem.workorderTransFirstPcsDet.remark : null;

      vm.cgBusyLoading = WorkorderTransFirstPcsdetFactory.saveWorkorderTransFirstpcsDet().save({ workorderTransFirstPcsDetails: vm.woTransFirstPcsdetModel }).$promise.then((res) => {
        if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          wotranfirstpcsdetitem.isEditMode = false;
          getWorkorderTransFirstPiece();
          vm.firstartical['wotranFirstPcsForm_' + wotranfirstpcsdetitem.serialno].$setPristine();
          vm.firstartical.$setPristine();
        }
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    };

    /* delete/deleteAll first pcs details */
    vm.deleteWoTransFirstPcsdet = (IsSingleDelete, wotranfirstpcsdetitem) => {
      if (vm.ShowFirstArticle && !vm.IsCheckInOperation) {
        const msgContentForOpActivity = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.TRAVELER_OPERATION_ACTIVITY_NOT_STARTED);
        msgContentForOpActivity.message = stringFormat(msgContentForOpActivity.message, vm.operationFullName);
        const model = {
          messageContent: msgContentForOpActivity
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }
      let woTransFirstpcsDetIDs = [];
      let woTransFirstPieceIDs = [];
      if (IsSingleDelete && wotranfirstpcsdetitem) {
        if (wotranfirstpcsdetitem.workorderTransFirstPcsDet) {
          woTransFirstpcsDetIDs.push(wotranfirstpcsdetitem.workorderTransFirstPcsDet.woTransFirstpcsDetID);
        }
        woTransFirstPieceIDs.push(wotranfirstpcsdetitem.wofirstpieceID);
      } else {
        woTransFirstpcsDetIDs = vm.workorderTransFirstPieceDetList.map((item) => item.woTransFirstpcsDetID);
        woTransFirstPieceIDs = vm.workorderTransFirstPieceDetList.map((item) => item.woTransFirstPieceID);
      }
      if (woTransFirstPieceIDs && woTransFirstPieceIDs.length > 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, '1st article serial', woTransFirstPieceIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            const _deleteObj = {
              woTransFirstpcsDetIDs: woTransFirstpcsDetIDs,
              woTransFirstPieceIDs: woTransFirstPieceIDs,
              serialno: IsSingleDelete ? wotranfirstpcsdetitem.serialno : null,
              woNumber: vm.woOpEmployeeDetails.workorderOperation.woNumber,
              woVersion: vm.woOpEmployeeDetails.workorderOperation.woVersion,
              opName: vm.woOpEmployeeDetails.workorderOperation.opName,
              woOPID: vm.woOpEmployeeDetails.workorderOperation.woOPID,
              employeeID: vm.employeeID
            };
            vm.cgBusyLoading = WorkorderTransFirstPcsdetFactory.deleteWorkorderTransFirstpcsdet().query({ deleteObj: _deleteObj }).$promise.then(() => {
              getWorkorderTransFirstPiece();
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE_LABEL);
        messageContent.message = stringFormat(messageContent.message, '1st article serial');
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    /* save final conclusion related details to work order operation */
    vm.saveFirstPieceArticleDetails = () => {
      vm.saveDisable = true;
      if (vm.ShowFirstArticle && !vm.IsCheckInOperation) {
        const msgContentForOpActivity = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.TRAVELER_OPERATION_ACTIVITY_NOT_STARTED);
        msgContentForOpActivity.message = stringFormat(msgContentForOpActivity.message, vm.operationFullName);
        const model = {
          messageContent: msgContentForOpActivity
        };
        vm.saveDisable = false;
        DialogFactory.messageAlertDialog(model);
        return;
      }

      if (BaseService.focusRequiredField(vm.firstArticalConclusionForm)) {
        vm.saveDisable = false;
        return;
      }

      const operationInfo = {
        firstPcsConclusion: vm.woOpEmployeeDetails.workorderOperation.firstPcsConclusion,
        woNumber: vm.woOpEmployeeDetails.workorderOperation.woNumber,
        woVersion: vm.woOpEmployeeDetails.workorderOperation.woVersion,
        opName: vm.woOpEmployeeDetails.workorderOperation.opName,
        opTypeForWOOPTimeLineLog: CORE.Operations_Type_For_WOOPTimeLineLog.firstPcsDet
      };

      if (vm.woOpEmployeeDetails.workorderOperation.woOPID) {
        vm.cgBusyLoading = WorkorderOperationFactory.updateOperation().update({
          id: vm.woOpEmployeeDetails.workorderOperation.woOPID
        }, operationInfo).$promise.then(() => {
          vm.saveDisable = false;
          vm.firstArticalConclusionForm.$setPristine();
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
    };

    // on cancel button click from first article
    vm.cancelWoTransFirstPcsdet = (wotranfirstpcsdetitem) => {
      const isdirty = vm.checkFormDirty(vm.firstartical['wotranFirstPcsForm_' + wotranfirstpcsdetitem.serialno]);
      if (isdirty) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_LEAVE_SELECTED);
        messageContent.message = stringFormat(messageContent.message, 'selected 1st article serial');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            getWorkorderTransFirstPiece();
            vm.firstartical['wotranFirstPcsForm_' + wotranfirstpcsdetitem.serialno].$setPristine();
            wotranfirstpcsdetitem.isEditMode = !wotranfirstpcsdetitem.isEditMode;
          }
        }, (error) => BaseService.getErrorLog(error));
      }
      else {
        wotranfirstpcsdetitem.isEditMode = !wotranfirstpcsdetitem.isEditMode;
      }
    };

    // set collapse and expand for wo op trans first piece serials
    vm.setFPTransSerialsExpandCollapse = () => {
      vm.isAllExpandedForFPTransSerials = !vm.isAllExpandedForFPTransSerials;
      _.each(vm.workorderTransFirstPieceDetList, (serialItem) => {
        serialItem.isShow = vm.isAllExpandedForFPTransSerials;
      });
    };

    // to check any changes in form - with dirty form
    vm.checkFormDirty = (form, columnName) => {
      const result = BaseService.checkFormDirty(form, columnName);
      return result;
    };

    vm.getHoldResumeStatus = (responseData) => {
      const woID = responseData.woID ? responseData.woID : _.find(responseData.woIDs, (item) => item === vm.woID);
      if (woID === vm.woID) {
        vm.refType = [vm.haltResumePopUp.refTypePO, vm.haltResumePopUp.refTypeKA, vm.haltResumePopUp.refTypeKR];
        vm.cgBusyLoading = KitAllocationFactory.getHoldResumeStatus().query({
          woID: woID,
          refType: vm.refType,
          isFromWo: true
        }).$promise.then((response) => {
          if (response) {
            vm.haltStatusCheck = _.groupBy(response.data, 'refType');
            vm.haltList = _.map(_.groupBy(response.data, 'poNumber'), (item, index) => {
              return {
                poNumber: index,
                poHaltStatus: _.find(item, { refType: vm.haltResumePopUp.refTypePO }),
                kaHaltStatus: _.find(item, { refType: vm.haltResumePopUp.refTypeKA }),
                krHaltStatus: _.find(item, { refType: vm.haltResumePopUp.refTypeKR })
              };
            });
            if (vm.haltStatusCheck.PO || vm.haltStatusCheck.KA || vm.haltStatusCheck.KR) {
              vm.isKitHaltStatus = true;
            } else {
              vm.isKitHaltStatus = false;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // [S] Socket Listeners
    function connectSocket() {
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.PO_START, vm.getHoldResumeStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.PO_STOP, vm.getHoldResumeStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_START, vm.getHoldResumeStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_STOP, vm.getHoldResumeStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.KIT_RELEASE_START, vm.getHoldResumeStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.KIT_RELEASE_STOP, vm.getHoldResumeStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.Traveler.Auto_Terminate_WO_On_Transfer, autoTerminateWOOnTransferListener);
      socketConnectionService.on('message:receive', notificationReceiveListener);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener('message:receive', notificationReceiveListener);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.PO_START);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.PO_STOP);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_START);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_STOP);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_RELEASE_START);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_RELEASE_STOP);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.Traveler.Auto_Terminate_WO_On_Transfer);
    }


    function notificationReceiveListener(message) { $timeout(notificationReceive(message)); }

    function notificationReceive(message) {
      switch (message.event) {
        case CORE.NOTIFICATION_MESSAGETYPE.WO_TRANS_PREPROG_COMP.TYPE:
        case CORE.NOTIFICATION_MESSAGETYPE.WO_PREPROG_DESIGNATOR.TYPE:
        case CORE.NOTIFICATION_MESSAGETYPE.WO_PREPROG_DESIGNATOR_REMOVE.TYPE: {
          $scope.$broadcast(message.event, message.data);
          break;
        }
        case CORE.NOTIFICATION_MESSAGETYPE.WO_TRANS_ASSY_DEFECT.TYPE:
        case CORE.NOTIFICATION_MESSAGETYPE.WO_ASSY_DESIGNATOR.TYPE:
        case CORE.NOTIFICATION_MESSAGETYPE.WO_ASSY_DESIGNATOR_REMOVE.TYPE: {
          $scope.$broadcast(message.event, message.data);
          break;
        }
        case CORE.NOTIFICATION_MESSAGETYPE.WO_ASSY_DESIGNATOR_UPDATE.TYPE: {
          $scope.$broadcast(message.event, message.data);
          break;
        }
        case CORE.NOTIFICATION_MESSAGETYPE.WO_OP_VERSION_CHANGE.TYPE:
        case CORE.NOTIFICATION_MESSAGETYPE.WO_VERSION_CHANGE.TYPE: {
          if (vm.woOpEmployeeDetails && vm.woOpEmployeeDetails.workorderOperation) {
            if (message.data.woID === vm.woOpEmployeeDetails.workorderOperation.woID
              && (!message.data.woOPID || (message.data.woOPID === vm.woOpEmployeeDetails.workorderOperation.woOPID))) {
              const model = {
                title: message.data.message,
                multiple: true
              };

              return DialogFactory.alertDialog(model, () => {
                const model = {
                  notificationID: message.data.notificationMst.id,
                  receiverID: loginUserDetails.employee.id,
                  requestStatus: CORE.NotificationRequestStatus.Accepted
                };
                NotificationSocketFactory.ackNotification().save(model).$promise.then(() => {
                  /* empty */
                }).catch(() => {
                  /* empty */
                });
              });
            }
          }
          break;
        }
        case CORE.NOTIFICATION_MESSAGETYPE.WO_OP_TEAM_CHECKIN.TYPE:
        case CORE.NOTIFICATION_MESSAGETYPE.WO_OP_TEAM_CHECKOUT.TYPE:
        case CORE.NOTIFICATION_MESSAGETYPE.WO_OP_TEAM_PAUSE.TYPE:
        case CORE.NOTIFICATION_MESSAGETYPE.WO_OP_TEAM_RESUME.TYPE:
          {
            if (vm.woOpEmployeeDetails.workorderOperation.woID === message.data.woID
              || vm.woOpEmployeeDetails.workorderOperation.woOPID === message.data.woOPID
              || message.data.senderID === loginUserDetails.employee.id
              || (vm.woOpEmployeeDetails.woOperationEmployeeList &&
                _.some(vm.woOpEmployeeDetails.woOperationEmployeeList, (empItem) => empItem.employeeID === loginUserDetails.employee.id))
            ) {
              updateLoginEmployeeDetails();
            }
            break;
          }
        case CORE.NOTIFICATION_MESSAGETYPE.WO_OP_HOLD.TYPE:
        case CORE.NOTIFICATION_MESSAGETYPE.WO_OP_UNHOLD.TYPE: {
          if (message.data.woOPID) {
            const findOperation = _.find(vm.tabList, (item) => item.woOPID === message.data.woOPID);
            if (findOperation) {
              findOperation.isStopOperation = message.data.isStopOperation;
            }
          }
          vm.woOpEmployeeDetails.workorderOperation.woOPHoldDetails = {};
          if (vm.woOpEmployeeDetails.workorderOperation.woID === message.data.woID
            && vm.woOpEmployeeDetails.workorderOperation.woOPID === message.data.woOPID) {
            vm.woOpEmployeeDetails.workorderOperation.isStopOperation = message.data.isStopOperation;
            if (vm.woOpEmployeeDetails.workorderOperation.isStopOperation) {
              vm.woOpEmployeeDetails.workorderOperation.woOPHoldDetails.woTransOpHoldUnholdId = message.data.woTransOpHoldUnholdId;
              vm.woOpEmployeeDetails.workorderOperation.woOPHoldDetails.reason = message.data.reason;
              vm.woOpEmployeeDetails.workorderOperation.woOPHoldDetails.opHoldBy = message.data.holdBy;
              vm.woOpEmployeeDetails.workorderOperation.woOPHoldDetails.opStartDate = $filter('date')(new Date(message.data.startDate), vm.DateTimeFormat);
            }
          }
          if (message.data.notificationMst.senderID !== loginUserDetails.employee.id) {
            const model = {
              title: message.data.subject,
              textContent: 'Reason: ' + (message.data.isStopOperation ? message.data.reason : message.data.resumeReason),
              multiple: true
            };

            return DialogFactory.alertDialog(model, () => {
              const model = {
                notificationID: message.data.notificationMst.id,
                receiverID: loginUserDetails.employee.id,
                requestStatus: CORE.NotificationRequestStatus.Accepted
              };
              NotificationSocketFactory.ackNotification().save(model).$promise.then(() => {
                /* empty */
              }).catch(() => {
                /* empty */
              });
            });
          }
          break;
        }
        case CORE.NOTIFICATION_MESSAGETYPE.WO_START.TYPE:
        case CORE.NOTIFICATION_MESSAGETYPE.WO_STOP.TYPE: {
          vm.woOpEmployeeDetails.workorderOperation.woHoldDetails = {};
          if (vm.woOpEmployeeDetails.workorderOperation.woID === message.data.woID) {
            vm.woOpEmployeeDetails.workorderOperation.isStopWorkorder = message.data.isStopWorkorder;
            if (vm.woOpEmployeeDetails.workorderOperation.isStopWorkorder) {
              vm.woOpEmployeeDetails.workorderOperation.woHoldDetails.reason = message.data.reason;
              vm.woOpEmployeeDetails.workorderOperation.woHoldDetails.woHoldBy = message.data.holdBy;
              vm.woOpEmployeeDetails.workorderOperation.woHoldDetails.woStartDate = $filter('date')(new Date(message.data.startDate), vm.DateTimeFormat);
            }
          }
          if (message.data.notificationMst.senderID !== loginUserDetails.employee.id) {
            const model = {
              title: message.data.subject,
              textContent: 'Reason: ' + (message.data.isStopWorkorder ? message.data.reason : message.data.resumeReason),
              multiple: true
            };
            return DialogFactory.alertDialog(model, () => {
              var model = {
                notificationID: message.data.notificationMst.id,
                receiverID: loginUserDetails.employee.id,
                requestStatus: CORE.NotificationRequestStatus.Accepted
              };
              NotificationSocketFactory.ackNotification().save(model).$promise.then(() => {
                /* empty */
              }).catch(() => {
                /* empty */
              });
            });
          }
          break;
        }
        case CORE.NOTIFICATION_MESSAGETYPE.EQUIPMENT_ONLINE.TYPE:
        case CORE.NOTIFICATION_MESSAGETYPE.EQUIPMENT_OFFLINE.TYPE: {
          const woEqp = _.find(vm.woEquipmentDetails, { 'woOpEqpID': message.data.operationObj.woOpEqpID });
          if (woEqp) {
            woEqp.isOnline = message.data.operationObj.isOnline;
          }
          break;
        }
        case CORE.NOTIFICATION_MESSAGETYPE.WO_OP_TEAM_REPROCESS_QTY_UPDATE.TYPE: {
          //updateLoginEmployeeDetails();
          if ($mdSidenav('operation-reprocess-qty').isOpen()) {
            $mdSidenav('operation-reprocess-qty').close();
            vm.isOpReprocessQtyOpen = false;
            $timeout(() => {
              vm.OpenReprocessQtyModel();
            }, true);
          }
          break;
        }
        case CORE.NOTIFICATION_MESSAGETYPE.WO_REWORK_OP_DEFECT_CHANGE_DPMO.TYPE: {
          refreshTravelerHeaderDetails();
          break;
        }
      }
    }

    // call on socket call of Auto Terminate WO On Transfer
    const actionOnSocketCallAutoTerminateWOOnTransfer = (socketReceiveData) => {
      if (socketReceiveData && socketReceiveData.autoTerminatedWOID === vm.woID) {
        $state.go(WORKORDER.MANAGE_WORKORDER_DETAILS_STATE, { woID: socketReceiveData.revisedWOID });
      }
    };
    function autoTerminateWOOnTransferListener(socketReceiveData) { $timeout(actionOnSocketCallAutoTerminateWOOnTransfer(socketReceiveData)); }

    /*To save other value detail
     Note:If any step added after other detail just remove function body and add logic of last step
     */
    vm.fileList = {};
    vm.SaveDetailsForWoTransOperation = () => {
      const dynamicControlList = WorkorderDataElementTransValueFactory.getWorkorderTransDataElementList(vm.dataElementList);
      WorkorderDataElementTransValueFactory.saveTransctionValue({
        woTransID: vm.woTransID,
        woOPID: vm.woOPID,
        woID: vm.woID,
        entityID: vm.entityID,
        employeeID: vm.employeeID,
        woNumber: vm.woOpEmployeeDetails.workorderOperation.woNumber,
        woVersion: vm.woOpEmployeeDetails.workorderOperation.woVersion,
        opName: vm.woOpEmployeeDetails.workorderOperation.opName,
        dataElementList: dynamicControlList.dataElementList,
        removeElementList: dynamicControlList.removeElementList,
        subFormTransList: dynamicControlList.subFormTransList,
        deletedsubFormTransIDs: dynamicControlList.deletedsubFormTransIDs,
        removeSubFormTransListConditional: dynamicControlList.removeSubFormTransListConditional
      }, vm.fileList).then(() => {
        // Display success message of each field if assigned on validation options
        WorkorderDataElementTransValueFactory.displaySuccessMessage(dynamicControlList.dataElementList);
        reloadOperationDataFields();
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // [S] code for checking wo change review sidebar
    vm.woRevReqForReview = null;
    const woRevReqID = angular.isNumber($stateParams.woRevReqID) ? $stateParams.woRevReqID : null;

    function getWORevReqForReview() {
      WorkorderFactory.getDefaultWORevReqForReview().query({ woID: vm.woID, woRevReqID: woRevReqID, empID: vm.employeeDetails.id }).$promise.then((response) => {
        if (response && response.data) {
          vm.woRevReqForReview = response.data;

          if ($stateParams.openRevReq === 'true') {
            vm.openWorkorderReviewModel();
          }
        }
        resetRequestMenuList();
      }).catch((error) => BaseService.getErrorLog(error));
    }

    // [S] get all pinned Widgets
    function getWidgets() {
      vm.cgBusyLoading = WidgetFactory.getAllChartTemplete().save({ isPinToTraveler: true }).$promise.then((response) => {
        vm.analyticsList = [];
        if (response && response.data) {
          _.each(response.data, (item) => {
            if (item.chartTemplateOperations.length > 0) {
              _.each(item.chartTemplateOperations, (operation) => {
                if (operation.opID === vm.woOpEmployeeDetails.workorderOperation.opID) {
                  vm.analyticsList.push(item);
                }
              });
            }
            else {
              vm.analyticsList.push(item);
            }
          });
        }
        vm.isDisplayWidget = vm.analyticsList.length > 0;
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    }
    // [E] Widgets

    // [S] Terminate Opearation
    vm.terminateOperation = ($event) => {
      var qtyControl = vm.woOpEmployeeDetails.workorderOperation.qtyControl;
      var woID;
      var woOPID;
      var opName;
      var title;
      var model;
      vm.popup.terminate_workorder = true;
      if (!qtyControl) {
        const model = {
          textContent: CORE.MESSAGE_CONSTANT.WORKORDER_TERMINATED_NOT_ALLOW,
          multiple: true
        };
        DialogFactory.alertDialog(model, () => {
          vm.popup.terminate_workorder = false;
        });
        return;
      }
      else if (vm.inspectionProcess || vm.woOpEmployeeDetails.workorderOperation.isRework) {
        const model = {
          textContent: CORE.MESSAGE_CONSTANT.WORKORDER_TERMINATED_OPERATION_NA,
          multiple: true
        };
        DialogFactory.alertDialog(model, () => {
          vm.popup.terminate_workorder = false;
        });
        return;
      }
      else {
        if (vm.isParallelOperation) {
          const model = {
            textContent: CORE.MESSAGE_CONSTANT.WORKORDER_TERMINATED_NA,
            multiple: true
          };
          DialogFactory.alertDialog(model, () => {
            vm.popup.terminate_workorder = false;
          });
          return;
        }
      }

      woID = vm.woOpEmployeeDetails.workorderOperation.woID;
      woOPID = vm.woOpEmployeeDetails.workorderOperation.woOPID;
      MasterFactory.getTerminatedOperationDetail().query({ woID: woID }).$promise.then((response) => {
        if (response) {
          if (response.data) {
            switch (response.data.status) {
              case 'workorder': {
                if (response.data.data.woOPID === woOPID) {
                  openTerminateOPDialog(woID, woOPID, $event);
                } else {
                  opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, response.data.data.opName, response.data.data.opNumber);
                  title = stringFormat(CORE.MESSAGE_CONSTANT.WORKORDER_ALREADY_TERMINATED, opName);
                  model = {
                    title: title,
                    textContent: stringFormat(CORE.MESSAGE_CONSTANT.WORKORDER_ALREADY_TERMINATED_TEXT, opName),
                    multiple: true
                  };
                  DialogFactory.alertDialog(model, () => {
                    vm.popup.terminate_workorder = false;
                  });
                }
                break;
              }
              case 'operation': {
                let str = '<ul class="padding-left-20">';
                response.data.data.forEach((x) => {
                  str += stringFormat('<li><b>({1}) {0}</b> by <b>{2}</b></li>', x.opName, convertToThreeDecimal(x.opNumber), x.employee);
                });
                str += '</ul>';

                const model = {
                  title: response.data.data.length > 1 ? CORE.MESSAGE_CONSTANT.OPERATION_CHECK_IN_MULTI : CORE.MESSAGE_CONSTANT.OPERATION_CHECK_IN,
                  textContent: str,
                  multiple: true
                };
                DialogFactory.alertDialog(model, () => {
                  vm.popup.terminate_workorder = false;
                });
                break;
              }
            }
          }
          else {
            openTerminateOPDialog(woID, woOPID, $event);
          }
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });

      function openTerminateOPDialog(woID, woOPID, event) {
        var model = {
          woOPID: woOPID,
          woID: woID
        };
        DialogFactory.dialogService(
          TRAVELER.TERMINATE_OPERATION_MODAL_CONTROLLER,
          TRAVELER.TERMINATE_OPERATION_MODAL_VIEW,
          event,
          model).then(() => {
            vm.popup.terminate_workorder = false;
            vm.enableTerminateButton();
          }, () => {
            vm.popup.terminate_workorder = false;
          }, (error) => {
            vm.popup.terminate_workorder = false;
            return BaseService.getErrorLog(error);
          });
      }
    };
    // [E] Terminate Operation

    // [S] Packing serials
    function generatePackingSerials($event) {
      var data = {
        woID: vm.woOpEmployeeDetails.workorderOperation.woID,
        woNumber: vm.woOpEmployeeDetails.workorderOperation.woNumber,
        woVersion: vm.woOpEmployeeDetails.workorderOperation.woVersion,
        buildQty: vm.woOpEmployeeDetails.workorderOperation.buildQty,
        serialType: CORE.SERIAL_TYPE.PACKING,
        PIDCode: vm.woOpEmployeeDetails.workorderOperation.PIDCode,
        partID: vm.woOpEmployeeDetails.workorderOperation.partID,
        nickName: vm.woOpEmployeeDetails.workorderOperation.nickName,
        woOPID: vm.woOpEmployeeDetails.workorderOperation.woOPID,
        isTrackBySerialNo: vm.woOpEmployeeDetails.workorderOperation.isTrackBySerialNo,
        IsCheckInOperation: vm.IsCheckInOperation,
        isAllowFinalSerialMapping: vm.woOpEmployeeDetails.workorderOperation.isAllowFinalSerialMapping,
        rohsIcon: vm.woOpEmployeeDetails && vm.woOpEmployeeDetails.workorderOperation && vm.woOpEmployeeDetails.workorderOperation.rohsIcon ? vm.rohsImagePath + vm.woOpEmployeeDetails.workorderOperation.rohsIcon : null,
        rohsName: vm.woOpEmployeeDetails && vm.woOpEmployeeDetails.workorderOperation && vm.woOpEmployeeDetails.workorderOperation.rohsStatus ? vm.woOpEmployeeDetails.workorderOperation.rohsStatus : null
      };

      DialogFactory.dialogService(
        WORKORDER.WORKORDER_GENERATE_SERIAL_POPUP_CONTROLLER,
        WORKORDER.WORKORDER_GENERATE_SERIAL_POPUP_VIEW,
        $event,
        data).then(() => {
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    }
    // [E] Packing serials

    // [S] View Operation Field History
    vm.ViewOperationFieldsHistory = (title, opData, ev) => {
      ev.stopPropagation();
      const obj = {
        title: title,
        name: opData.opName,
        opData: opData,
        woNumber: vm.woOpEmployeeDetails.workorderOperation.woNumber,
        woVersion: vm.woOpEmployeeDetails.workorderOperation.woVersion
      };
      const data = obj;
      $timeout(() => {
        DialogFactory.dialogService(
          CORE.WORKORDER_OPERATION_FIELDS_HISTORY_MODAL_CONTROLLER,
          CORE.WORKORDER_OPERATION_FIELDS_HISTORY_MODAL_VIEW,
          ev,
          data).then(() => {
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
      });
    };
    // [E] View Operation Field History


    // [S] View Operation Equipments Field History
    vm.ViewOperationEquipmentFieldsHistory = (title, equipment, ev) => {
      ev.stopPropagation();
      const obj = {
        title: title,
        name: equipment.eqpMake + ' | ' + equipment.eqpModel + ' | ' + equipment.eqpYear,
        opData: vm.woOpEmployeeDetails.workorderOperation,
        equipment: equipment,
        woNumber: vm.woOpEmployeeDetails.workorderOperation.woNumber,
        woVersion: vm.woOpEmployeeDetails.workorderOperation.woVersion
      };
      const data = obj;
      $timeout(() => {
        DialogFactory.dialogService(
          CORE.WORKORDER_OPERATION_EQUIPMENT_FIELDS_HISTORY_MODAL_CONTROLLER,
          CORE.WORKORDER_OPERATION_EQUIPMENT_FIELDS_HISTORY_MODAL_VIEW,
          ev,
          data).then(() => {
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
      });
    };
    // [E] View Operation Equipments Field History


    // hotkeys adeed
    const bindHotKeys = () => {
      hotkeys.bindTo($scope).add({
        combo: CORE.HOT_KEYS.PAUSE_OPERATION.SHORTCUT_KEY,
        description: CORE.HOT_KEYS.PAUSE_OPERATION.DESCRIPTION,
        callback: ($event) => {
          if (vm.IsCheckInOperation && !vm.woOpEmployeeDetails.workorderOperation.isTeamOperation && !vm.woOpEmployeeDetails.employee.isPaused) {
            $event.stopPropagation();
            $event.preventDefault();
            vm.pauseEmployeeOperation(vm.woOpEmployeeDetails.employee, $event);
          }
        }
      }).add({
        combo: CORE.HOT_KEYS.RESUME_OPERATION.SHORTCUT_KEY,
        description: CORE.HOT_KEYS.RESUME_OPERATION.DESCRIPTION,
        callback: ($event) => {
          if (vm.IsCheckInOperation
            && !vm.woOpEmployeeDetails.workorderOperation.isTeamOperation
            && vm.woOpEmployeeDetails.employee.isPaused) {
            $event.stopPropagation();
            $event.preventDefault();
            vm.resumeEmployeeOperation(false, vm.woOpEmployeeDetails.employee, $event);
          }
        }
      })
        .add({
          combo: CORE.HOT_KEYS.CHECK_OUT_OPERATION.SHORTCUT_KEY,
          description: CORE.HOT_KEYS.CHECK_OUT_OPERATION.DESCRIPTION,
          callback: ($event) => {
            if (!vm.popup.checkout_operation
              && vm.IsCheckInOperation) {
              $event.stopPropagation();
              $event.preventDefault();
              vm.CheckOutOperation(false, null, $event);
            }
          }
        }).add({
          combo: CORE.HOT_KEYS.CHECK_IN_OPERATION.SHORTCUT_KEY,
          description: CORE.HOT_KEYS.CHECK_IN_OPERATION.DESCRIPTION,
          callback: ($event) => {
            if (!vm.popup.checkin_operation
              && !vm.IsCheckInOperation
              && vm.isWorkorderOperationAssigned
              && vm.woOpEmployeeDetails.workorderOperation.opStatus === vm.opStatus.PUBLISHED) {
              $event.stopPropagation();
              $event.preventDefault();
              vm.CheckInOperation(false, null, $event);
            }
          }
        }).add({
          combo: CORE.HOT_KEYS.FIRST_ARTICLE_OPERATION.SHORTCUT_KEY,
          description: CORE.HOT_KEYS.FIRST_ARTICLE_OPERATION.DESCRIPTION,
          callback: ($event) => {
            if (vm.woOpEmployeeDetails.workorderOperation.qtyControl && vm.IsCheckInOperation && !vm.ShowFirstArticle) {
              vm.OpenFirstArticle(vm.MainTitle.FirstArticle, vm.woOpEmployeeDetails.workorderOperation, vm.woOpEmployeeDetails.workorderOperation, $event);
            }
          }
        }).add({
          combo: CORE.HOT_KEYS.BACK_TO_OPERATION.SHORTCUT_KEY,
          description: CORE.HOT_KEYS.BACK_TO_OPERATION.DESCRIPTION,
          callback: ($event) => {
            if (vm.ShowFirstArticle) {
              vm.OpenFirstArticle(vm.MainTitle.FirstArticle, vm.woOpEmployeeDetails.workorderOperation, vm.woOpEmployeeDetails.workorderOperation, $event);
            }
          }
        }).add({
          combo: CORE.HOT_KEYS.TRANSFER_WORKORDER.SHORTCUT_KEY, //ctrl + t not working
          description: CORE.HOT_KEYS.TRANSFER_WORKORDER.DESCRIPTION,
          callback: ($event) => {
            if (!vm.popup.terminate_workorder && vm.enableTerminateWorkorder) {
              vm.terminateOperation($event);
            }
          }
        }).add({
          combo: CORE.HOT_KEYS.ADD_NARRATIVE_DETAILS.SHORTCUT_KEY, //ctrl + t not working
          description: CORE.HOT_KEYS.ADD_NARRATIVE_DETAILS.DESCRIPTION,
          callback: ($event) => {
            if (!vm.popup.narrativehistory && vm.enableNarrativeDetails) {
              vm.addNarrativeDetails($event);
            }
          }
        }).add({
          combo: CORE.HOT_KEYS.ADD_SERIAL_OPERATION.SHORTCUT_KEY,
          description: CORE.HOT_KEYS.ADD_SERIAL_OPERATION.DESCRIPTION,
          callback: ($event) => {
            if (!vm.popup.add_serialno && vm.IsCheckInOperation
              && vm.woOpEmployeeDetails.workorderOperation.qtyControl
              && (vm.woOpEmployeeDetails.workorderOperation.isOperationTrackBySerialNo || vm.woOpEmployeeDetails.workorderOperation.isTrackBySerialNo)) {
              vm.OpenSerialNoPopUp($event);
            }
          }
        }).add({
          combo: CORE.HOT_KEYS.VIEW_HISTORY_OPERATION.SHORTCUT_KEY,
          description: CORE.HOT_KEYS.VIEW_HISTORY_OPERATION.DESCRIPTION,
          callback: ($event) => {
            if (!vm.popup.view_history) {
              vm.ViewLogHistory(vm.MainTitle.History, vm.woOpEmployeeDetails.workorderOperation, $event);
            }
          }
        }).add({
          combo: CORE.HOT_KEYS.HALT_WORKORDER_OPERATION.SHORTCUT_KEY,
          description: CORE.HOT_KEYS.HALT_WORKORDER_OPERATION.DESCRIPTION,
          callback: ($event) => {
            if (!vm.popup.halt_operation && !vm.woOpEmployeeDetails.workorderOperation.isStopOperation && vm.woOpEmployeeDetails.workorderOperation.woOPID && !vm.woOpEmployeeDetails.workorderOperation.isStopWorkorder && (vm.enableToggleOperation)) {
              vm.toggleWorkorderOperation(vm.woOpEmployeeDetails.workorderOperation, $event);
            }
          }
        }).add({
          combo: CORE.HOT_KEYS.RESUME_WORKORDER_OPERATION.SHORTCUT_KEY,
          description: CORE.HOT_KEYS.RESUME_WORKORDER_OPERATION.DESCRIPTION,
          callback: ($event) => {
            if (!vm.popup.resume_operation && vm.woOpEmployeeDetails.workorderOperation.isStopOperation && vm.woOpEmployeeDetails.workorderOperation.woOPID && !vm.woOpEmployeeDetails.workorderOperation.isStopWorkorder && (vm.enableToggleOperation)) {
              vm.toggleWorkorderOperation(vm.woOpEmployeeDetails.workorderOperation, $event);
            }
          }
        }).add({
          combo: CORE.HOT_KEYS.LOG_DEFFECT_OPERATION.SHORTCUT_KEY,
          description: CORE.HOT_KEYS.LOG_DEFFECT_OPERATION.DESCRIPTION,
          callback: ($event) => {
            if (!vm.popup.log_defects && vm.IsCheckInOperation && vm.inspectionProcess) {
              vm.openLogDefectModel($event);
            }
          }
        }).add({
          combo: CORE.HOT_KEYS.PREPROGRAMMING_OPERATION.SHORTCUT_KEY,
          description: CORE.HOT_KEYS.PREPROGRAMMING_OPERATION.DESCRIPTION,
          callback: ($event) => {
            if (!vm.popup.pre_programming && vm.IsCheckInOperation && vm.woOpEmployeeDetails.workorderOperation.isPreProgrammingComponent) {
              vm.openPreProgComponentModel($event);
            }
          }
        });
    };

    function boxSerials($event) {
      var data = {
        woID: vm.woOpEmployeeDetails.workorderOperation.woID,
        employeeId: vm.employeeID,
        opID: vm.woOpEmployeeDetails.workorderOperation.opID,
        woTransId: vm.woTransID,
        woNumber: vm.woOpEmployeeDetails.workorderOperation.woNumber,
        woVersion: vm.woOpEmployeeDetails.workorderOperation.woVersion,
        opName: vm.woOpEmployeeDetails.workorderOperation.opName,
        woOPID: vm.woOpEmployeeDetails.workorderOperation.woOPID,
        assyID: vm.woOpEmployeeDetails.workorderOperation.partID,
        isTrackbySerialNo: vm.woOpEmployeeDetails.workorderOperation.isOperationTrackBySerialNo || vm.woOpEmployeeDetails.workorderOperation.isTrackBySerialNo,
        pidCode: vm.woOpEmployeeDetails.workorderOperation.PIDCode,
        IsCheckInOperation: vm.IsCheckInOperation,
        isSetup: vm.isSetup,
        assyRohsIcon: vm.woOpEmployeeDetails.workorderOperation.rohsIcon,
        assyRohsName: vm.woOpEmployeeDetails.workorderOperation.rohsStatus,
        datecode: vm.woOpEmployeeDetails.workorderOperation.datecode
      };

      DialogFactory.dialogService(
        TRAVELER.BOX_SERIAL_POPUP_CONTROLLER,
        TRAVELER.BOX_SERIAL_POPUP_VIEW,
        $event,
        data).then(() => {
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    }

    vm.PrintWorkOrderTag = () => {
      const printObj = {
        woNumber: vm.woOpEmployeeDetails.workorderOperation.woNumber,
        woVersion: vm.woOpEmployeeDetails.workorderOperation.woVersion,
        nickName: vm.woOpEmployeeDetails.workorderOperation.nickName,
        rev: vm.woOpEmployeeDetails.workorderOperation.rev,
        woRev: vm.woOpEmployeeDetails.workorderOperation.woVersion,
        rohsStatus: vm.woOpEmployeeDetails.workorderOperation.refMainCategoryID === CORE.RoHSMainCategory.RoHS ? true : false,
        isWatersoluble: vm.woOpEmployeeDetails.workorderOperation.cleaningType === CORE.Wo_Op_Cleaning_Type.Water_Soluble,
        isNoClean: vm.woOpEmployeeDetails.workorderOperation.cleaningType === CORE.Wo_Op_Cleaning_Type.No_Clean,
        operationData: vm.woOpEmployeeDetails.wpOperationList,
        woOPID: vm.woOpEmployeeDetails.workorderOperation.woOPID,
        employeeID: vm.woOpEmployeeDetails.employee.id,
        opName: vm.woOpEmployeeDetails.workorderOperation.opName
      };
      const popupWinindow = window.open('', '_blank', 'width=750,height=700,scrollbars=yes,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
      vm.cgBusyLoading = WorkorderFactory.printWoOPDetail().save(printObj).$promise.then((response) => {
        if (response && response.data) {
          if (popupWinindow != null) {
            popupWinindow.document.open();
            popupWinindow.document.write('\
                <html>\
                    <head>\
                        <style>\
                            @page {\
                                size: Letter;\
                                margin-0;\
                             }\
                         </style>\
                      </head>\
                 <body onload="window.print()">' + response.data + '\
              </html>');
            popupWinindow.document.close();
          }
        } else {
          popupWinindow.close();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Hide/Show First Piece Section*/
    vm.toggleWOOperation = (item) => {
      item.isShow = !item.isShow;
      const isAnyCollapse = _.some(vm.workorderTransFirstPieceDetList, (item) => !item.isShow);
      vm.isAllExpandedForFPTransSerials = !isAnyCollapse;
    };

    /* To pause operation for all employees in operation transaction that are already started */
    vm.teamOPAllEmpPause = () => {
      const obj = {
        title: stringFormat(CORE.MESSAGE_CONSTANT.ALERT_HEADER),
        textContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PAUSE_OP_FOR_ALL_EMP_CONFIRM.message,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.confirmDiolog(obj).then((yes) => {
        if (yes) {
          const teamOpTransObj = {};
          teamOpTransObj.woTransID = vm.woTransID;
          // parameter used for send notification too
          teamOpTransObj.woID = vm.woOpEmployeeDetails.workorderOperation.woID;
          teamOpTransObj.opID = vm.woOpEmployeeDetails.workorderOperation.opID;
          teamOpTransObj.woOPID = vm.woOpEmployeeDetails.workorderOperation.woOPID;
          teamOpTransObj.employeeID = vm.checkInEmployeeID;
          vm.cgBusyLoading = WorkorderTransFactory.pauseAllEmployeeFromOperation().save(teamOpTransObj).$promise.then(() => {
            //if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            //  //vm.isTeamOPAllEmpPauseMode = true;
            //  updateLoginEmployeeDetails();
            //}
            //else if (res && res.status === CORE.ApiResponseTypeStatus.FAILED) {
            updateLoginEmployeeDetails();
            //}
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* open reprocess required quantity popup to add */
    vm.OpenReprocessQtyModel = () => {
      if (!vm.IsCheckInOperation) {
        const model = {
          title: stringFormat(CORE.MESSAGE_CONSTANT.ALERT_HEADER),
          textContent: stringFormat(CORE.MESSAGE_CONSTANT.OPERATION_NOT_STARTED, vm.operationFullName),
          multiple: true
        };
        DialogFactory.alertDialog(model, () => {
        });
        return;
      }

      if (vm.woOpEmployeeDetails.workorderOperation.isRework) {
        const model = {
          textContent: TRAVELER.REPROCESS_NOT_ALLOWED_FOR_REWORK_OP,
          multiple: true
        };
        DialogFactory.alertDialog(model);
        return;
      }

      vm.operationReprocessQtyData = {
        //opData: vm.woOpEmployeeDetails.workorderOperation,
        buildQty: vm.woOpEmployeeDetails.workorderOperation.buildQty,
        woID: vm.woOpEmployeeDetails.workorderOperation.woID,
        opID: vm.woOpEmployeeDetails.workorderOperation.opID,
        woOPID: vm.woOpEmployeeDetails.workorderOperation.woOPID,
        opName: vm.operationFullName,
        woTransID: vm.woOpEmployeeDetails.wo_transaction.woTransID,
        isOperationTrackBySerialNo: vm.woOpEmployeeDetails.workorderOperation.isOperationTrackBySerialNo,
        isTrackBySerialNo: vm.woOpEmployeeDetails.workorderOperation.isTrackBySerialNo,
        woNumber: vm.woOpEmployeeDetails.workorderOperation.woNumber,
        woVersion: vm.woOpEmployeeDetails.workorderOperation.woVersion,
        isRework: vm.woOpEmployeeDetails.workorderOperation.isRework,
        isParallelOperation: vm.isParallelOperation,
        isTeamOperation: vm.woOpEmployeeDetails.workorderOperation.isTeamOperation
        //employeeID: vm.employeeID
      };

      $mdSidenav('operation-reprocess-qty').open();
      vm.isOpReprocessQtyOpen = true;

      $mdSidenav('operation-reprocess-qty').onClose(() => {
        vm.isOpReprocessQtyOpen = false;
      });
    };

    const checkProductionStarted = () => {
      const _obj = {
        woID: vm.woOpEmployeeDetails.workorderOperation.woID
      };
      vm.cgBusyLoading = WorkorderTransFactory.checkWorkorderProductionStarted().save(_obj).$promise.then((res) => {
        if (res && res.data) {
          vm.isProductionStarted = res.data.isProductionStarted;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //show color legend on click of pallet icon
    vm.showColorLengend = (ev) => {
      const data = {
        pageName: CORE.LabelConstant.Traveler.PageName,
        legendList: CORE.LegendList.TravelerList
      };
      DialogFactory.dialogService(
        CORE.LEGEND_MODAL_CONTROLLER,
        CORE.LEGEND_MODAL_VIEW,
        ev,
        data).then(() => {
        }
          , () => {
          }, (error) => BaseService.getErrorLog(error));
    };



    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    // Workorder
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };
    vm.goToWorkorderDetails = (data) => {
      BaseService.goToWorkorderDetails(data.woID);
      return false;
    };

    // Assembly
    vm.goToAssemblyList = () => {
      BaseService.goToPartList();
      return false;
    };
    vm.goToAssemblyDetails = (data) => {
      BaseService.goToComponentDetailTab(null, data.partID);
      return false;
    };
    vm.goToWorkorderOperationFirstArticles = () => {
      BaseService.goToWorkorderOperationFirstArticles(vm.woOPID);
      return false;
    };

    // Operation/Traveler
    vm.goToOperationList = (data) => {
      BaseService.goToOperationList(data.woID);
      return false;
    };
    vm.goToTravelerOperationDetails = (data) => {
      BaseService.goToTravelerOperationDetails(data.woOPID, data.employeeID, vm.homeOPID);
      return false;
    };
    vm.setItemActive = (item) => {
      BaseService.goToTravelerOperationDetails(item.woOPID, item.employeeID, vm.homeOPID);
      return false;
    };

    vm.addNarrativeDetails = (ev) => {
      vm.popup.narrativehistory = true;
      const data = {
        partID: vm.woOpEmployeeDetails.workorderOperation.partID,
        woTransID: vm.woOpEmployeeDetails.wo_transaction.woTransID,
        woID: vm.woOpEmployeeDetails.workorderOperation.woID,
        opID: vm.woOpEmployeeDetails.workorderOperation.opID,
        woOPID: vm.woOpEmployeeDetails.workorderOperation.woOPID,
        employeeID: vm.employeeID
      };
      DialogFactory.dialogService(
        TRAVELER.ADD_NARRATIVE_DETAILS_POPUP_CONTROLLER,
        TRAVELER.ADD_NARRATIVE_DETAILS_POPUP_VIEW,
        ev,
        data).then(() => {
          vm.popup.narrativehistory = false;
        }, () => {
          vm.popup.narrativehistory = false;
        }, (err) => {
          vm.popup.narrativehistory = false;
          return BaseService.getErrorLog(err);
        });
      // vm.addEditRecord(row.entity, ev);
    };

    // enable terminate button
    vm.enableTerminateButton = () => {
      if (vm.enableTerminateWorkorder) {
        if (vm.woOpEmployeeDetails && vm.woOpEmployeeDetails.workorderOperation && (vm.woOpEmployeeDetails.workorderOperation.woStatus === vm.woStatus.TERMINATED || vm.woOpEmployeeDetails.workorderOperation.woStatus === vm.woStatus.UNDER_TERMINATION || vm.woOpEmployeeDetails.workorderOperation.woSubStatus === vm.woStatus.COMPLETED_WITH_MISSING_PARTS)) {
          if (vm.woOPID === vm.woOpEmployeeDetails.workorderOperation.terminateWOOPID) {
            vm.enableTerminateWorkorder = true;
          }
          else {
            vm.enableTerminateWorkorder = false;
          }
        } else {
          vm.enableTerminateWorkorder = true;
        }
      }
    };

    // View Feeder Details on Traveler Page
    vm.ViewFeederDetails = (equipment, ev, isVerify) => {
      ev.stopPropagation();
      const isFeederDisable = checkDisableScan();
      const data = {
        equipment: equipment.equipment,
        woID: vm.woOpEmployeeDetails.workorderOperation.woID,
        opID: vm.woOpEmployeeDetails.workorderOperation.opID,
        woOPID: vm.woOpEmployeeDetails.workorderOperation.woOPID,
        eqpID: equipment.eqpID,
        woOpEqpID: equipment.woOpEqpID,
        feederCount: equipment.feederCount,
        partID: vm.woOpEmployeeDetails.workorderOperation.partID,
        woNumber: vm.woOpEmployeeDetails.workorderOperation.woNumber,
        woVersion: vm.woOpEmployeeDetails.workorderOperation.woVersion,
        opName: vm.woOpEmployeeDetails.workorderOperation.opName,
        opNumber: vm.woOpEmployeeDetails.workorderOperation.opNumber,
        opVersion: vm.woOpEmployeeDetails.workorderOperation.opVersion,
        PIDCode: vm.woOpEmployeeDetails.workorderOperation.PIDCode,
        isCustom: vm.woOpEmployeeDetails.workorderOperation.isCustom,
        nickName: vm.woOpEmployeeDetails.workorderOperation.nickName,
        mfgPN: vm.woOpEmployeeDetails.workorderOperation.mfgPN,
        mfgPNDescription: vm.woOpEmployeeDetails.workorderOperation.mfgPNDescription,
        name: vm.woOpEmployeeDetails.workorderOperation.rohsStatus,
        rohsIcon: vm.woOpEmployeeDetails.workorderOperation.rohsIcon,
        woTransID: vm.woOpEmployeeDetails.wo_transaction ? vm.woOpEmployeeDetails.wo_transaction.woTransID : null,
        employeeId: vm.woOpEmployeeDetails.employee.id,
        isVerify: isVerify,
        isDisableScan: isFeederDisable,
        isOnline: equipment.isOnline,
        isFeeder: true,
        lineID: _.map((vm.woOpEmployeeDetails.salesOrderDet), 'lineID').join(),
        salesOrderMstIDs: _.map((_.uniqBy(vm.woOpEmployeeDetails.salesOrderDet, 'refSalesOrderID')), 'refSalesOrderID').join(),
        salesOrderDetID: vm.woOpEmployeeDetails.salesOrderDet.length > 0 ? vm.woOpEmployeeDetails.salesOrderDet[0].id : null,
        salesOrderNumber: _.map((_.uniqBy(vm.woOpEmployeeDetails.salesOrderDet, 'salesordernumber')), 'salesordernumber').join(),
        poNumber: _.map((_.uniqBy(vm.woOpEmployeeDetails.salesOrderDet, 'poNumber')), 'poNumber').join(),
        SOPOQtyValues: _.map((vm.woOpEmployeeDetails.salesOrderDet), 'qty').join(),
        soMRPQty: _.map((vm.woOpEmployeeDetails.salesOrderDet), 'mrpqty').join(),
        soPOQty: _.map((vm.woOpEmployeeDetails.salesOrderDet), 'poQty').join(),
        opFluxNotApplicable: vm.woOpEmployeeDetails.workorderOperation.opFluxNotApplicable,
        opNoClean: vm.woOpEmployeeDetails.workorderOperation.opNoClean,
        opWaterSoluble: vm.woOpEmployeeDetails.workorderOperation.opWaterSoluble
      };
      if (equipment.feederCount > 0) {
        DialogFactory.dialogService(
          TRAVELER.SCAN_FEEDER_COMPONENT_MODAL_CONTROLLER,
          TRAVELER.SCAN_FEEDER_COMPONENT_MODAL_VIEW,
          vm.event,
          data).then(() => {
            vm.showEquipmentsData();
          }, (err) => {
            if (err) {
              BaseService.getErrorLog(err);
            } else {
              vm.showEquipmentsData();
            }
          });
      } else {
        DialogFactory.dialogService(
          WORKORDER.WORKORDER_VIEW_FEEDER_DETAILS_CONTROLLER,
          WORKORDER.WORKORDER_VIEW_FEEDER_DETAILS_VIEW,
          ev,
          data).then(() => {
            vm.showEquipmentsData();
          }, () => {
            vm.showEquipmentsData();
          }, (err) => BaseService.getErrorLog(err));
      }
      ev.preventDefault();
    };

    // open verification popup directly if any error
    if (FeederVerificationDet) {
      vm.FeederVerificationDet = JSON.parse(FeederVerificationDet);
      DialogFactory.dialogService(
        TRAVELER.FEEDER_SCAN_FAILED_MODAL_CONTROLLER,
        TRAVELER.FEEDER_SCAN_FAILED_MODAL_VIEW,
        null,
        vm.FeederVerificationDet).then((verificationDet) => {
          if (verificationDet) {
            vm.FeederVerificationDet = null;
            localStorage.removeItem('UnlockFeederDetail');
          }
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    }

    // disable feeder
    const checkDisableScan = () => {
      if (!vm.IsCheckInOperation || !vm.isWorkorderOperationAssigned || vm.isAboveTerminateWOOP) {
        return true;
      }
      else if (vm.woOpEmployeeDetails.employee && vm.woOpEmployeeDetails.employee.isPaused) {
        return true;
      }
      else if (vm.woOpEmployeeDetails.workorderOperation && (vm.woOpEmployeeDetails.workorderOperation.isStopOperation || vm.woOpEmployeeDetails.workorderOperation.isStopWorkorder)) {
        return true;
      } else {
        return false;
      }
    };

    // view umid scan details
    function viewUMIDDetails(ev, isVerify) {
      ev.stopPropagation();
      let activeEmployeeList = [];
      if (vm.woOpEmployeeDetails.workorderOperation.isTeamOperation) {
        activeEmployeeList = _.filter(vm.woOpEmployeeDetails.woOperationEmployeeList, (empData) => empData.checkinTime && !empData.isPaused);
      } else {
        activeEmployeeList.push(vm.woOpEmployeeDetails.employee);
      }
      const isFeederDisable = checkDisableScan();
      const data = {
        woID: vm.woOpEmployeeDetails.workorderOperation.woID,
        opID: vm.woOpEmployeeDetails.workorderOperation.opID,
        woOPID: vm.woOpEmployeeDetails.workorderOperation.woOPID,
        partID: vm.woOpEmployeeDetails.workorderOperation.partID,
        woNumber: vm.woOpEmployeeDetails.workorderOperation.woNumber,
        woVersion: vm.woOpEmployeeDetails.workorderOperation.woVersion,
        opName: vm.woOpEmployeeDetails.workorderOperation.opName,
        opNumber: vm.woOpEmployeeDetails.workorderOperation.opNumber,
        opVersion: vm.woOpEmployeeDetails.workorderOperation.opVersion,
        PIDCode: vm.woOpEmployeeDetails.workorderOperation.PIDCode,
        isCustom: vm.woOpEmployeeDetails.workorderOperation.isCustom,
        nickName: vm.woOpEmployeeDetails.workorderOperation.nickName,
        mfgPN: vm.woOpEmployeeDetails.workorderOperation.mfgPN,
        mfgPNDescription: vm.woOpEmployeeDetails.workorderOperation.mfgPNDescription,
        name: vm.woOpEmployeeDetails.workorderOperation.rohsStatus,
        rohsIcon: vm.woOpEmployeeDetails.workorderOperation.rohsIcon,
        isPlacementTracking: vm.woOpEmployeeDetails.workorderOperation.isPlacementTracking,
        woTransID: vm.woOpEmployeeDetails.wo_transaction ? vm.woOpEmployeeDetails.wo_transaction.woTransID : null,
        employeeId: vm.woOpEmployeeDetails.employee.id,
        isVerify: isVerify,
        isDisableScan: isFeederDisable,
        isFeeder: false,
        employeeList: activeEmployeeList,
        isTeamOperation: vm.woOpEmployeeDetails.workorderOperation.isTeamOperation,
        lineID: _.map((vm.woOpEmployeeDetails.salesOrderDet), 'lineID').join(),
        salesOrderMstIDs: _.map((_.uniqBy(vm.woOpEmployeeDetails.salesOrderDet, 'refSalesOrderID')), 'refSalesOrderID').join(),
        salesOrderDetID: vm.woOpEmployeeDetails.salesOrderDet.length > 0 ? vm.woOpEmployeeDetails.salesOrderDet[0].id : null,
        salesOrderNumber: _.map((_.uniqBy(vm.woOpEmployeeDetails.salesOrderDet, 'salesordernumber')), 'salesordernumber').join(),
        poNumber: _.map((_.uniqBy(vm.woOpEmployeeDetails.salesOrderDet, 'poNumber')), 'poNumber').join(),
        SOPOQtyValues: _.map((vm.woOpEmployeeDetails.salesOrderDet), 'qty').join(),
        soMRPQty: _.map((vm.woOpEmployeeDetails.salesOrderDet), 'mrpqty').join(),
        soPOQty: _.map((vm.woOpEmployeeDetails.salesOrderDet), 'poQty').join(),
        opFluxNotApplicable: vm.woOpEmployeeDetails.workorderOperation.opFluxNotApplicable,
        opNoClean: vm.woOpEmployeeDetails.workorderOperation.opNoClean,
        opWaterSoluble: vm.woOpEmployeeDetails.workorderOperation.opWaterSoluble,
        woSubStatus: vm.woOpEmployeeDetails.workorderOperation.woSubStatus,
        bomOddlyRefDesList: vm.BomOddelyRefDesList
      };
      DialogFactory.dialogService(
        TRAVELER.SCAN_UMID_COMPONENT_MODAL_CONTROLLER,
        TRAVELER.SCAN_UMID_COMPONENT_MODAL_VIEW,
        vm.event,
        data).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    }

    // view umid scan details for missing material
    function viewMissingUMIDDetail(ev, isVerify) {
      ev.stopPropagation();
      let activeEmployeeList = [];
      if (vm.woOpEmployeeDetails.workorderOperation.isTeamOperation) {
        activeEmployeeList = _.filter(vm.woOpEmployeeDetails.woOperationEmployeeList, (empData) => empData.checkinTime && !empData.isPaused);
      } else {
        activeEmployeeList.push(vm.woOpEmployeeDetails.employee);
      }
      const isFeederDisable = checkDisableScan();
      const data = {
        woID: vm.woOpEmployeeDetails.workorderOperation.woID,
        opID: vm.woOpEmployeeDetails.workorderOperation.opID,
        woOPID: vm.woOpEmployeeDetails.workorderOperation.woOPID,
        partID: vm.woOpEmployeeDetails.workorderOperation.partID,
        woNumber: vm.woOpEmployeeDetails.workorderOperation.woNumber,
        woVersion: vm.woOpEmployeeDetails.workorderOperation.woVersion,
        opName: vm.woOpEmployeeDetails.workorderOperation.opName,
        opNumber: vm.woOpEmployeeDetails.workorderOperation.opNumber,
        opVersion: vm.woOpEmployeeDetails.workorderOperation.opVersion,
        PIDCode: vm.woOpEmployeeDetails.workorderOperation.PIDCode,
        isCustom: vm.woOpEmployeeDetails.workorderOperation.isCustom,
        nickName: vm.woOpEmployeeDetails.workorderOperation.nickName,
        mfgPN: vm.woOpEmployeeDetails.workorderOperation.mfgPN,
        mfgPNDescription: vm.woOpEmployeeDetails.workorderOperation.mfgPNDescription,
        name: vm.woOpEmployeeDetails.workorderOperation.rohsStatus,
        rohsIcon: vm.woOpEmployeeDetails.workorderOperation.rohsIcon,
        isPlacementTracking: vm.woOpEmployeeDetails.workorderOperation.isPlacementTracking,
        woTransID: vm.woOpEmployeeDetails.wo_transaction ? vm.woOpEmployeeDetails.wo_transaction.woTransID : null,
        employeeId: vm.woOpEmployeeDetails.employee.id,
        isVerify: isVerify,
        isDisableScan: isFeederDisable,
        isFeeder: false,
        employeeList: activeEmployeeList,
        isTeamOperation: vm.woOpEmployeeDetails.workorderOperation.isTeamOperation,
        lineID: _.map((vm.woOpEmployeeDetails.salesOrderDet), 'lineID').join(),
        salesOrderMstIDs: _.map((_.uniqBy(vm.woOpEmployeeDetails.salesOrderDet, 'refSalesOrderID')), 'refSalesOrderID').join(),
        salesOrderDetID: vm.woOpEmployeeDetails.salesOrderDet.length > 0 ? vm.woOpEmployeeDetails.salesOrderDet[0].id : null,
        salesOrderNumber: _.map((_.uniqBy(vm.woOpEmployeeDetails.salesOrderDet, 'salesordernumber')), 'salesordernumber').join(),
        poNumber: _.map((_.uniqBy(vm.woOpEmployeeDetails.salesOrderDet, 'poNumber')), 'poNumber').join(),
        SOPOQtyValues: _.map((vm.woOpEmployeeDetails.salesOrderDet), 'qty').join(),
        soMRPQty: _.map((vm.woOpEmployeeDetails.salesOrderDet), 'mrpqty').join(),
        soPOQty: _.map((vm.woOpEmployeeDetails.salesOrderDet), 'poQty').join(),
        opFluxNotApplicable: vm.woOpEmployeeDetails.workorderOperation.opFluxNotApplicable,
        opNoClean: vm.woOpEmployeeDetails.workorderOperation.opNoClean,
        opWaterSoluble: vm.woOpEmployeeDetails.workorderOperation.opWaterSoluble,
        woSubStatus: vm.woOpEmployeeDetails.workorderOperation.woSubStatus,
        bomOddlyRefDesList: vm.BomOddelyRefDesList
      };
      DialogFactory.dialogService(
        TRAVELER.SCAN_UMID_MISSING_COMPONENT_MODAL_CONTROLLER,
        TRAVELER.SCAN_UMID_MISSING_COMPONENT_MODAL_VIEW,
        vm.event,
        data).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    }

    /* to display expired and expiring part details */
    function viewExpirePartDetails() {
      vm.isShowExpirePart = false;
      $timeout(() => {
        vm.isShowExpirePart = true;
        vm.expirePartConfigurationOptions.isCalledFromManualButtonClick = true;
      }, true);
    }

    /* to refresh header all updated details */
    const refreshWOHeaderDetails = $scope.$on('refreshWorkOrderHeaderDetails', () => {
      //vm.isWOHeaderDetailsChanged = !vm.isWOHeaderDetailsChanged;
      refreshTravelerHeaderDetails();
    });

    /*Move to operation do's and dont's page*/
    vm.goToWorkorderOperationDoDonts = () => {
      BaseService.goToWorkorderOperationDoDonts(vm.woOPID);
    };

    /*Move to operation detail page*/
    vm.goToWorkorderOperationDetails = () => {
      BaseService.goToWorkorderOperationDetails(vm.woOPID);
    };

    /*Move to operation parts page*/
    vm.goToWorkorderOperationParts = () => {
      BaseService.goToWorkorderOperationParts(vm.woOPID);
    };

    /*Move to operation equipment page*/
    vm.goToWorkorderOperationEquipments = () => {
      BaseService.goToWorkorderOperationEquipments(vm.woOPID);
    };

    /*Move to work order data fields page*/
    vm.goToWorkorderDataFields = () => {
      BaseService.goToWorkorderDataFields(vm.woID);
    };

    /*Move to work order operation data fields page*/
    vm.goToWorkorderOperationDatafields = () => {
      BaseService.goToWorkorderOperationDatafields(vm.woOPID);
    };

    /*Move to work order operation data fields page*/
    vm.goToWorkorderOperationDocuments = () => {
      BaseService.goToWorkorderOperationDocuments(vm.woOPID);
    };

    vm.goToHomeOperationDetails = () => {
      BaseService.goToTravelerOperationDetails(vm.homeOPID, vm.employeeID, vm.homeOPID);
      return false;
    };

    /* to reload operation data fields */
    const reloadOperationDataFields = () => {
      vm.showOperationFields = false;
      vm.fileList = {};
      $timeout(() => {
        vm.showOperationFields = true;
      }, _configTimeout);
    };

    /* refresh work order header */
    const refreshTravelerHeaderDetails = () => {
      //$timeout(() => {
      vm.isWOHeaderDetailsChanged = !vm.isWOHeaderDetailsChanged;
      //}, _configBreadCrumbTimeout);
    };

    /* to refresh wo op details like do's , don'ts , instruction or process details, Job specific requirement
        Management Communication , Deferred Instruction */
    vm.refreshWOOPBasicDetails = (refreshSectionFor) => {
      if (refreshSectionFor) {
        const woOPDet = {
          woOPID: vm.woOpEmployeeDetails.workorderOperation.woOPID,
          fieldNameForData: null
        };

        switch (refreshSectionFor) {
          case vm.MainTitle.Does:
            woOPDet.fieldNameForData = Object.keys(vm.woOpEmployeeDetails.workorderOperation).find((key) => vm.woOpEmployeeDetails.workorderOperation[key] === vm.woOpEmployeeDetails.workorderOperation.opDoes);
            break;
          case vm.MainTitle.Donts:
            woOPDet.fieldNameForData = Object.keys(vm.woOpEmployeeDetails.workorderOperation).find((key) => vm.woOpEmployeeDetails.workorderOperation[key] === vm.woOpEmployeeDetails.workorderOperation.opDonts);
            break;
          case vm.MainTitle.Instruction:
            woOPDet.fieldNameForData = Object.keys(vm.woOpEmployeeDetails.workorderOperation).find((key) => vm.woOpEmployeeDetails.workorderOperation[key] === vm.woOpEmployeeDetails.workorderOperation.opDescription);
            break;
          case vm.MainTitle.WorkingCondition:
            woOPDet.fieldNameForData = Object.keys(vm.woOpEmployeeDetails.workorderOperation).find((key) => vm.woOpEmployeeDetails.workorderOperation[key] === vm.woOpEmployeeDetails.workorderOperation.opWorkingCondition);
            break;
          case vm.MainTitle.ManagementInstruction:
            woOPDet.fieldNameForData = Object.keys(vm.woOpEmployeeDetails.workorderOperation).find((key) => vm.woOpEmployeeDetails.workorderOperation[key] === vm.woOpEmployeeDetails.workorderOperation.opManagementInstruction);
            break;
          case vm.MainTitle.DeferredInstruction:
            woOPDet.fieldNameForData = Object.keys(vm.woOpEmployeeDetails.workorderOperation).find((key) => vm.woOpEmployeeDetails.workorderOperation[key] === vm.woOpEmployeeDetails.workorderOperation.opDeferredInstruction);
            break;
        }

        if (woOPDet.fieldNameForData) {
          vm.cgBusyLoading = WorkorderOperationFactory.getWOOPFieldDetailsByFieldName().query(woOPDet).$promise.then((res) => {
            if (res && res.data) {
              vm.woOpEmployeeDetails.workorderOperation[woOPDet.fieldNameForData] = res.data[woOPDet.fieldNameForData];
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    // to refresh all traveler pinned widget
    vm.refreshOPPinnedWidgets = () => {
      getWidgets();
    };

    // to refresh work order data fields
    vm.refreshWorkOrderDataFields = () => {
      vm.showWorkOrderDataFields = false;
      vm.fileList = {};
      $timeout(() => {
        vm.showWorkOrderDataFields = true;
      }, _configTimeout);
    };

    // to refresh work order operation data fields
    vm.refreshWorkOrderOperationDataFields = () => {
      reloadOperationDataFields();
    };

    /* refresh traveler header details */
    vm.refreshTravelerHeaderData = () => {
      refreshTravelerHeaderDetails();
    };

    /* called for text editor max length validation */
    vm.getDescrLengthValidation = (maxLength, enteredText) => {
      const enteredPlainText = vm.htmlToPlaintext(enteredText);
      return BaseService.getDescrLengthValidation(maxLength, enteredPlainText.length);
    };

    //convert html text to plain text to calculate max length validation
    vm.htmlToPlaintext = (text) => text ? String(text).replace(/<[^>]+>/gm, '') : '';


    // Create static list for add/view transaction serial#
    const resetSerialMenu = () => {
      vm.transSerailMenuList = [];
      vm.transSerailMenuList = [
        {
          menuName: 'View Processed Serial# Transaction',
          isDisable: false,
          isAdd: false,
          callback: vm.OpenSerialNoPopUp
        },
        {
          menuName: 'Add Processed Serial#',
          isDisable: !vm.IsCheckInOperation,
          isAdd: true,
          callback: vm.OpenSerialNoPopUp
        }
      ];
    };

    const resetRequestMenuList = () => {
      // Create Static list for render Menu for Add/View Change Request
      vm.requestMenuList = [
        {
          menuName: 'Request History',
          isAddNew: false,
          isDisable: vm.woRevReqForReview ? false : true
        },
        {
          menuName: 'New Request',
          isAddNew: true,
          isDisable: false
        }
      ];
    };
    const resetAllToggleMenu = () => {
      resetSerialMenu();
    };

    const getPendingVerificationCount = () => {
      if (vm.woOpEmployeeDetails.wo_transaction && vm.woOpEmployeeDetails.wo_transaction.woTransID) {
        const obj = {
          woID: vm.woOpEmployeeDetails.wo_transaction.woID,
          opID: vm.woOpEmployeeDetails.wo_transaction.opID,
          woTransID: vm.woOpEmployeeDetails.wo_transaction.woTransID,
          transactionType: CORE.TransactionType.Feeder,
          woOpEqpID: null
        };
        return WorkorderTransactionUMIDFactory.getPendingVerificationUMIDCount().query(obj).$promise.then((resCnt) => {
          if (resCnt && resCnt.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            return $q.resolve(resCnt.data.pendingList);
          } else {
            return $q.resolve(false);
          }
        });
      }
    };
    // Get Oddly ref Des list
    const getOddelyRefDesList = () => {
      if (vm.woOpEmployeeDetails.workorderOperation.partID) {
        return ComponentFactory.getOddelyRefDesList().query({ id: vm.woOpEmployeeDetails.workorderOperation.partID }).$promise.then((resOddRefDes) => {
          if (resOddRefDes && resOddRefDes.data) {
            // vm.BomOddelyRefDesList = resOddRefDes.data;
            vm.BomOddelyRefDesList = _.map(resOddRefDes.data, 'refDes');
            return vm.BomOddelyRefDesList;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    resetAllToggleMenu();
    resetRequestMenuList();
  }
})();

