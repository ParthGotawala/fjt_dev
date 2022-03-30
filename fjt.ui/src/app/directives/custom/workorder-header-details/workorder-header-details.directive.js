(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('workorderHeaderDetails', workorderHeaderDetails);

    /** @ngInject */
    function workorderHeaderDetails() {
        var directive = {
            restrict: 'E',
            scope: {
                woId: '=',
                woOpId: '=',
                isWoheaderdetailsChanged: '=',
                woTransId: '=?',
                isTraveler: '=?',
                woAssyId: '=',
                employeeIdOfWoop: '=?'
            },
            templateUrl: 'app/directives/custom/workorder-header-details/workorder-header-details.html',
            controller: workorderHeaderDetailsCtrl,
            controllerAs: 'vm'
        };
        return directive;

        /** @ngInject */
        function workorderHeaderDetailsCtrl($scope, BaseService, WorkorderFactory,
            CORE, DialogFactory, USER, TRANSACTION, RFQTRANSACTION, WORKORDER, socketConnectionService, KitAllocationFactory, ComponentFactory, $timeout) {
            var vm = this;
            vm.requestType = WORKORDER.ECO_REQUEST_TYPE;
            vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
            // changes by VS - 31/01/2020 - for send woID from function to go work order details
            vm.woID = $scope.woId;
            vm.woOPID = $scope.woOpId ? $scope.woOpId : null;
            vm.woAllHeaderDetails = {};
            vm.woECORequestType = CORE.workOrderECORequestType;
            vm.LabelConstant = CORE.LabelConstant;
            vm.FullDateTimeFormat = _dateTimeFullTimeDisplayFormat;
            vm.DefaultDateFormat = _dateTimeDisplayFormat;
            vm.Wo_Op_Cleaning_Type = CORE.Wo_Op_Cleaning_Type;
            vm.isWOHeaderDetailsChanged = false;
            vm.allFormulas = CORE.AllFormulas;
            vm.OpStatus = CORE.OpStatus;
            vm.WoStatus = CORE.WoStatus;
            vm.haltResumePopUp = CORE.HaltResumePopUp;
            // const WoStatusForTimeLine = CORE.WoStatus;
            vm.woAssyID = $scope.woAssyId;
            vm.employeeIDOfWOOP = $scope.employeeIdOfWoop ? $scope.employeeIdOfWoop : null;
            vm.isKitHaltStatus = false;
            vm.woCompletedWithMissing = false;
            vm.MFRCommentsList = [];
            vm.ManufacturingAndProductionComments = CORE.RequirmentCategory.ManufacturingAndProductionComments;
            const rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
            const operationalImagePath = CORE.WEB_URL + USER.DYNAMIC_ATTRIBUTE_BASE_PATH;
            const wrenchIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.WRENCH_ICON);
            const tmaxIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.TMAX_ICON);
            const tmaxYellowIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.TMAX_YELLOW_ICON);
            const nrndIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.OBSOLETE_NRND_ICON);
            const exportIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.EXPORT_CONTROLLED_ICON);
            const badPartIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.BAD_PART_ICON);
            const _rohsImageElem = '<div class="ph-5"><img class="rohs-bom-image" src="rohsImagePath" title="rohsTitle"></div>';
            const _wrenchIconElem = '<div class="ph-5"><img class="rohs-bom-image" src="' + wrenchIcon + '" title="wrenchTitle"></div>';
            const _programingIconElem = '<div md-font-icon="icons-required-program" role="img" class="mh-5 margin-top-3 cm-custom-icon-font icons-required-program color-black" title="programingTitle"></div>';
            const _matingPartIconElem = '<div md-font-icon="icons-require-mating-part" role="img" class="mh-5 margin-top-3 cm-custom-icon-font icons-require-mating-part color-black" title="matingPartTitle"></div>';
            const _pickupPadIconElem = '<div md-font-icon="icons-required-pickup-pad" role="img" class="mh-5 margin-top-3 cm-custom-icon-font icons-required-pickup-pad color-black" title="pickupPadTitle"></div>';
            const _partStatusIconElem = '<div class="ph-5"><img src="' + nrndIcon + '" title="Obsolete or Not Recommended for New Design Part"></div>';
            const _tmaxIconElem = '<div class="ph-5"><img class="pt-5" src="' + tmaxIcon + '" title="Tmax"></div>';
            const _tmaxYellowIconElem = '<div class="ph-5"><img class="pt-5" src="' + tmaxYellowIcon + '" title="Tmax is not defined."></div>';
            const _exportControlledIconElem = '<div class="ph-5"><img src="' + exportIcon + '" title="Export Controlled"></div>';
            const _badPartIconElem = ' <img class="pt-5" src="' + badPartIcon + '" title="Incorrect Part">';

            //get operation status by id
            vm.getOpStatus = (statusID) => BaseService.getOpStatus(statusID);

            //get work order status
            vm.getWoStatus = (statusID) => BaseService.getWoStatus(statusID);

            /* get work order header all details */
            const getWorkorderDetails = () => {
                const workorderInfo = {
                    woID: vm.woID,
                    woOPID: vm.woOPID,
                    woTransID: $scope.woTransId,
                    woAssyID: vm.woAssyID,
                    employeeIDOfWOOP: vm.employeeIDOfWOOP
                };
                vm.cgBusyLoading = WorkorderFactory.getWorkorderHeaderDisplayDetails().save(workorderInfo).$promise.then((res) => {
                    if (res && res.data) {
                        if (res.data.timerData) {
                            updateTimerDetails(res.data.timerData, res.data.timerCurrentData, res.data.woOPEmpWiseTotTimeConsumptionDet);
                        }
                        if (res.data.woAllHeaderDetails) {
                            // get parent work order details for current work order for sub assembly purpose
                            vm.ParentWODetails = [];
                            if (res.data.woAllHeaderDetails.parentWorkorders) {
                                const woDetails = res.data.woAllHeaderDetails.parentWorkorders.split(',');
                                _.each(woDetails, (woItem) => {
                                    if (woItem) {
                                        const woObjArray = woItem.split('######');
                                        const woObj = {};
                                        woObj.woNumberWithVersion = woObjArray[0];
                                        woObj.woID = woObjArray[1];
                                        vm.ParentWODetails.push(woObj);
                                    }
                                });
                            }

                            vm.woAllHeaderDetails = res.data.woAllHeaderDetails;
                            // flux type of Assembly
                            vm.woAllHeaderDetails.assyFluxTypeList = [];
                            vm.woAllHeaderDetails.assyFluxTypeList.push({
                                value: vm.woAllHeaderDetails.assyFluxNotApplicable, icon: CORE.FluxTypeIcon.notApplicableIcon, toolTip: CORE.FluxTypeToolTip.notApplicable, isShowIcon: vm.woAllHeaderDetails.assyFluxNotApplicable
                            });
                            vm.woAllHeaderDetails.assyFluxTypeList.push({
                                value: vm.woAllHeaderDetails.assyNoClean, icon: CORE.FluxTypeIcon.noCleanIcon, toolTip: CORE.FluxTypeToolTip.noClean, isShowIcon: vm.woAllHeaderDetails.assyNoClean
                            });
                            vm.woAllHeaderDetails.assyFluxTypeList.push({
                                value: vm.woAllHeaderDetails.assyWaterSoluble, icon: CORE.FluxTypeIcon.waterSolubleIcon, toolTip: CORE.FluxTypeToolTip.waterSoluble, isShowIcon: vm.woAllHeaderDetails.assyWaterSoluble
                            });
                            // flux type of Operations
                            vm.woAllHeaderDetails.opFluxTypeList = [];
                            vm.woAllHeaderDetails.opFluxTypeList.push({
                                value: vm.woAllHeaderDetails.opFluxNotApplicable, icon: CORE.FluxTypeIcon.notApplicableIcon, toolTip: CORE.FluxTypeToolTip.notApplicable, isShowIcon: vm.woAllHeaderDetails.opFluxNotApplicable
                            });
                            vm.woAllHeaderDetails.opFluxTypeList.push({
                                value: vm.woAllHeaderDetails.opNoClean, icon: CORE.FluxTypeIcon.noCleanIcon, toolTip: CORE.FluxTypeToolTip.noClean, isShowIcon: vm.woAllHeaderDetails.opNoClean
                            });
                            vm.woAllHeaderDetails.opFluxTypeList.push({
                                value: vm.woAllHeaderDetails.opWaterSoluble, icon: CORE.FluxTypeIcon.waterSolubleIcon, toolTip: CORE.FluxTypeToolTip.waterSoluble, isShowIcon: vm.woAllHeaderDetails.opWaterSoluble
                            });
                            // flux type updated at workorder
                            vm.woAllHeaderDetails.woFluxTypeList = [];
                            vm.woAllHeaderDetails.woFluxTypeList.push({
                                value: vm.woAllHeaderDetails.isFluxNotApplicable, icon: CORE.FluxTypeIcon.notApplicableIcon, toolTip: vm.woAllHeaderDetails.isFluxNotAppOpNumbers, isShowIcon: vm.woAllHeaderDetails.isFluxNotApplicable
                            });
                            vm.woAllHeaderDetails.woFluxTypeList.push({
                                value: vm.woAllHeaderDetails.isNoClean, icon: CORE.FluxTypeIcon.noCleanIcon, toolTip: vm.woAllHeaderDetails.isNoCleanOpNumbers, isShowIcon: vm.woAllHeaderDetails.isNoClean
                            });
                            vm.woAllHeaderDetails.woFluxTypeList.push({
                                value: vm.woAllHeaderDetails.isWatersoluble, icon: CORE.FluxTypeIcon.waterSolubleIcon, toolTip: vm.woAllHeaderDetails.isWatersolubleOpNumbers, isShowIcon: vm.woAllHeaderDetails.isWatersoluble
                            });
                            if (vm.woAllHeaderDetails.RoHSStatusID) {
                                vm.woAllHeaderDetails.displayRohsIcon = CORE.WEB_URL + USER.ROHS_BASE_PATH + vm.woAllHeaderDetails.rohsIcon;
                            }
                            if (vm.woOPID) {
                                vm.woAllHeaderDetails.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, vm.woAllHeaderDetails.opName, vm.woAllHeaderDetails.opNumber);
                            }
                            if (vm.woAllHeaderDetails.isNoCleanOpNumbers) {
                                vm.woAllHeaderDetails.isNoCleanOpNumbers = '[ ' + vm.woAllHeaderDetails.isNoCleanOpNumbers.split(',') + ' ]';
                            }
                            if (vm.woAllHeaderDetails.isWatersolubleOpNumbers) {
                                vm.woAllHeaderDetails.isWatersolubleOpNumbers = '[ ' + vm.woAllHeaderDetails.isWatersolubleOpNumbers.split(',') + ' ]';
                            }
                            vm.woCompletedWithMissing = vm.woAllHeaderDetails.woSubStatus === CORE.WoStatus.COMPLETED_WITH_MISSING_PART ? true : false;
                            // vm.isWoInSpecificStatusNotAllowedToChange = (vm.woAllHeaderDetails.woStatus == CORE.WOSTATUS.TERMINATED || vm.woAllHeaderDetails.woStatus == CORE.WOSTATUS.COMPLETED || vm.woAllHeaderDetails.woStatus == CORE.WOSTATUS.VOID) ? true : false;
                            // vm.isDisableStatusMenu = (vm.enableChangeWOStatus && !vm.woAllHeaderDetails.isProductionRunning && !vm.isWoInSpecificStatusNotAllowedToChange && !$scope.isTraveler) ? false : true;
                            // if (vm.woAllHeaderDetails.opStatus == 1) {
                            //     vm.isPublishDisabled = true;
                            //     vm.label = CORE.OPSTATUSLABLEDRAFT;
                            // }
                            // else if (vm.woAllHeaderDetails.opStatus == 0) {
                            //     vm.label = CORE.OPSTATUSLABLEPUBLISH;
                            // }
                            // else {
                            //     vm.label = "";
                            // }
                            vm.woAllHeaderDetails.opStatusText = BaseService.getOpStatus(vm.woAllHeaderDetails.opStatus);
                            vm.woAllHeaderDetails.woStatusText = BaseService.getWoStatus(vm.woAllHeaderDetails.woSubStatus);
                            // // Restrict changes into all fields if work order status is 'under termination'
                            // vm.isWOUnderTermination = vm.woAllHeaderDetails.woStatus == CORE.WOSTATUS.UNDER_TERMINATION;
                            // vm.isWOPublished = vm.woAllHeaderDetails.woStatus == CORE.WOSTATUS.PUBLISHED;
                            // if (vm.isWOUnderTermination) {
                            //     vm.WoStatus = vm.WoStatus.filter((x) => { return x.ID == CORE.WOSTATUS.TERMINATED; });
                            // }

                            if (vm.woAllHeaderDetails.woAllStandardsWithClass) {
                                //vm.woAllHeaderDetails.isExportControlled = false;
                                // show color code in background of class and default color of "label-primary (CORE.DefaultStandardTagColor)"
                                const standardClassArray = [];
                                if (vm.woAllHeaderDetails.woAllStandardsWithClass) {
                                    const classWithColorCode = vm.woAllHeaderDetails.woAllStandardsWithClass.split('@@@@@@');
                                    _.each(classWithColorCode, (item) => {
                                        if (item) {
                                            const objItem = item.split('######');
                                            const standardClassObj = {};
                                            standardClassObj.colorCode = CORE.DefaultStandardTagColor;
                                            //if (objItem[0]) {
                                            //  standardClassObj.isExportControlled = objItem[0];
                                            //}
                                            if (objItem[0]) {
                                                standardClassObj.className = objItem[0];
                                            }
                                            if (objItem[1]) {
                                                standardClassObj.colorCode = objItem[1];
                                            }
                                            standardClassArray.push(standardClassObj);
                                            //if (!vm.woAllHeaderDetails.isExportControlled && standardClassObj.isExportControlled == "1") {
                                            //  vm.woAllHeaderDetails.isExportControlled = true;
                                            //}
                                        }
                                    });
                                    if (classWithColorCode.length > 0) {
                                        vm.woAllHeaderDetails.woAllStandardsWithClass = standardClassArray;
                                    }
                                }
                                // show color code in background of class and default color of "label-primary"
                            }
                            if (vm.woAllHeaderDetails.totalSolderPoints) {
                                vm.woAllHeaderDetails.totalSolderOpportunitiesOfErrorValue = eval(stringFormat(CORE.AllFormulas.TotalSolderOpportunitiesOfError.Format, vm.woAllHeaderDetails.totalSolderPoints, vm.woAllHeaderDetails.buildQty));
                            }
                            getMFRCommentsByPart();
                            vm.class = vm.getWoStatusClassName(vm.woAllHeaderDetails.woSubStatus);
                        }
                        if (res.data.LastECODetail) {
                            vm.ECORequestDetail = res.data.LastECODetail;
                        }
                        if (res.data.LastDFMDetail) {
                            vm.DFMRequestDetail = res.data.LastDFMDetail;
                        }
                        vm.woAllHeaderDetails.isExportControlled = res.data.exportControlledAssemblyDet && res.data.exportControlledAssemblyDet.isExportControlledAssembly ? true : false;
                        if (vm.woAllHeaderDetails.profileImgOfWOCreatedUser) {
                            vm.woAllHeaderDetails.woCreatedByEmpProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + vm.woAllHeaderDetails.profileImgOfWOCreatedUser;
                        }
                        else {
                            vm.woAllHeaderDetails.woCreatedByEmpProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
                        }
                        if (vm.woAllHeaderDetails.fullNameOfWOCreatedUser) {
                            const fullNameOfWOCreatedBySplitData = vm.woAllHeaderDetails.fullNameOfWOCreatedUser.split(' ');
                            if (fullNameOfWOCreatedBySplitData && fullNameOfWOCreatedBySplitData.length === 2) {
                                vm.woAllHeaderDetails.woCreatedByEmpFullName = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, vm.woAllHeaderDetails.initialNameOfWOCreatedUser,
                                    fullNameOfWOCreatedBySplitData[0], fullNameOfWOCreatedBySplitData[1]);
                            }
                        }
                        //console.log("stds - " + vm.woAllHeaderDetails.woAllStandardsWithClass);
                    }
                }).catch((error) => BaseService.getErrorLog(error));
            };

            const getWOHeaderIconList = () => {
                vm.cgBusyLoading = WorkorderFactory.getWOHeaderAllIconList().save({
                    woAssyID: vm.woAssyID,
                    woID: vm.woID
                }).$promise.then((response) => {
                    if (response && response.data) {
                        vm.iconHtml = '';
                        const woAssyIConList = response.data;
                        if (woAssyIConList && woAssyIConList.length > 0) {
                            _.each(woAssyIConList, (item) => {
                                switch (item.iconType) {
                                    case CORE.BOMIconType.RoHS: {
                                        vm.iconHtml += _rohsImageElem.replace('rohsImagePath', (rohsImagePath + (item.icon ? item.icon : CORE.DEFAULT_IMAGE))).replace('rohsTitle', item.tooltip);
                                        break;
                                    }
                                    case CORE.BOMIconType.BadPart: {
                                        vm.iconHtml += _badPartIconElem;
                                        break;
                                    }
                                    case CORE.BOMIconType.ExportControl: {
                                        vm.iconHtml += _exportControlledIconElem;
                                        break;
                                    }
                                    case CORE.BOMIconType.DriverTool: {
                                        vm.iconHtml += _wrenchIconElem.replace('wrenchTitle', CORE.WRENCH_TOOLTIP);
                                        break;
                                    }
                                    case CORE.BOMIconType.MatingPart: {
                                        vm.iconHtml += _matingPartIconElem.replace('matingPartTitle', CORE.MATING_TOOLTIP);
                                        break;
                                    }
                                    case CORE.BOMIconType.PickupPad: {
                                        vm.iconHtml += _pickupPadIconElem.replace('pickupPadTitle', CORE.PICKUPPAD_TOOLTIP);
                                        break;
                                    }
                                    case CORE.BOMIconType.Obsolete: {
                                        vm.iconHtml += _partStatusIconElem;
                                        break;
                                    }
                                    case CORE.BOMIconType.Programing: {
                                        vm.iconHtml += _programingIconElem.replace('programingTitle', CORE.PROGRAMING_REQUIRED_TOOLTIP);
                                        break;
                                    }
                                    case CORE.BOMIconType.TmaxRed: {
                                        vm.iconHtml += _tmaxIconElem;
                                        break;
                                    }
                                    case CORE.BOMIconType.TmaxWarn: {
                                        vm.iconHtml += _tmaxYellowIconElem;
                                        break;
                                    }
                                    case CORE.BOMIconType.OperationalAttribute: {
                                        vm.iconHtml += _rohsImageElem.replace('rohsImagePath', (operationalImagePath + (item.icon ? item.icon : CORE.DEFAULT_IMAGE))).replace('rohsTitle', item.tooltip ? item.tooltip : '');
                                        break;
                                    }
                                }
                            });
                        }
                    }
                });
            };

            //if (woID) {
            //    getWorkorderDetails();
            //}

            /* display work order sales order header all details while click on that link*/
            vm.showSalesOrderDetails = (ev) => {
                if (vm.woAllHeaderDetails.poNumber && vm.woAllHeaderDetails.salesOrderNumber) {
                    const data = angular.copy(vm.woAllHeaderDetails);
                    DialogFactory.dialogService(
                        CORE.WO_SO_HEADER_DETAILS_MODAL_CONTROLLER,
                        CORE.WO_SO_HEADER_DETAILS_MODAL_VIEW,
                        ev,
                        data).then(() => {

                        }, (() => {

                        }), (error) => BaseService.getErrorLog(error));
                }
            };

            //hyperlink go for list page
            vm.goToSalesOrderList = () => {
                BaseService.openInNew(TRANSACTION.TRANSACTION_SALESORDER_STATE, {});
            };
            vm.goToCustomerList = () => {
                BaseService.goToCustomerList();
            };
            //go to manage customer
            vm.goToManageCustomer = () => {
                BaseService.goToCustomer(vm.woAllHeaderDetails.customerID);
            };

            // go to assembly list
            vm.goToAssemblyList = () => {
                BaseService.goToPartList();
            };
            vm.goToAssemblyDetails = () => {
                BaseService.goToComponentDetailTab(null, vm.woAllHeaderDetails.partID);
                return false;
            };

            vm.goToComponentBOM = () => {
                BaseService.goToComponentBOM(vm.woAllHeaderDetails.partID);
                return false;
            };

            vm.goToWorkorderList = () => {
                BaseService.goToWorkorderList();
                return false;
            };
            vm.goToWorkorderDetails = (woID) => {
                BaseService.goToWorkorderDetails(woID);
                return false;
            };


            vm.goToOperationList = (woID) => {
                BaseService.goToOperationList(woID);
                return false;
            };

            // go to work order standard details
            vm.goToWorkorderStandards = (woID) => {
                BaseService.goToWorkorderStandards(woID);
                return false;
            };

            // go to work order operation list
            vm.goToWorkorderOperations = (woID) => {
                BaseService.goToWorkorderOperations(woID);
                return false;
            };

            vm.goToWorkorderOperationDetails = () => {
                BaseService.goToWorkorderOperationDetails(vm.woOPID);
                return false;
            };

            vm.goToStandardList = () => {
                BaseService.goToStandardList();
                return false;
            };

            vm.gotoECODetail = (ecoReqID) => {
                BaseService.openInNew(WORKORDER.ECO_REQUEST_DETAIL_STATE, { partID: vm.woAllHeaderDetails.partID, woID: vm.woID, ecoReqID: ecoReqID });
            };
            vm.gotoDFMDetail = (ecoReqID) => {
                BaseService.openInNew(WORKORDER.DFM_REQUEST_DETAIL_STATE, { partID: vm.woAllHeaderDetails.partID, woID: vm.woID, ecoReqID: ecoReqID });
            };

            vm.gotoECOlist = (requestType) => {
                BaseService.openInNew(USER.ADMIN_MANAGECOMPONENT_DFM_STATE, { coid: vm.woAllHeaderDetails.partID, ecoDfmType: requestType });
            };
            // not in use --- code review VS
            vm.gotoDFMlist = () => {
                BaseService.goToWorkorderDFMRequestList(vm.woID);
            };
            vm.getWoStatusClassName = (statusID) => BaseService.getWoStatusClassName(statusID);

            $scope.$watch('isWoheaderdetailsChanged', () => {
                getWorkorderDetails();
                if (vm.woAssyID) {
                    getWOHeaderIconList();
                }
            }, true);

            //After Check In Start Timer
            // let _setTimeoutProduction;

            const updateTimerDetails = (timerData, timerCurrentData, woOPEmpWiseTotTimeConsumptionDet) => {
                if (timerData) {
                    vm.timerData = {};
                    vm.timerData = timerData;
                    vm.timerData.EstimTotalProcTimeDisplay = secondsToTime(timerData.EstimTotalProcTime, true);
                    vm.timerData.totalConsumptionDisplay = secondsToTime(timerData.TotalConsumptionTime, true);

                    vm.timerCurrentData = {};
                    if (timerCurrentData) {
                        vm.timerCurrentData = timerCurrentData;
                        //vm.timerCurrentData.EstimTotalProcTimeDisplay = secondsToTime(timerCurrentData.EstimTotalProcTime, true);
                        vm.timerCurrentData.totalConsumptionDisplay = secondsToTime(timerCurrentData.TotalConsumptionTime, true);
                    }

                    // set wo op current emp wise total time consumption det
                    vm.woOPEmpWiseTotTimeConsumptionData = {};
                    if (woOPEmpWiseTotTimeConsumptionDet) {
                        vm.woOPEmpWiseTotTimeConsumptionData = woOPEmpWiseTotTimeConsumptionDet;
                        vm.woOPEmpWiseTotTimeConsumptionData.totalConsumptionDisplay = secondsToTime(woOPEmpWiseTotTimeConsumptionDet.TotalConsumptionTime, true);
                    }

                    vm.stopTimer();
                    vm.startTimer(vm.timerData, vm.timerCurrentData, vm.woOPEmpWiseTotTimeConsumptionData);
                }
            };

            let setTimeoutActivity;
            /* Start Timer after checkin start */
            vm.startTimer = (timerData, timerCurrentData, woOPEmpWiseTotTimeConsumptionData) => {
                vm.currentTimerDiff = '';
                // Set interval time based on employee count per transaction
                vm.tickInterval = timerCurrentData.ActiveEmpCnt;

                // Set interval time based on employee count per employee
                vm.tickIntervalEmployee = timerData.ActiveEmpCnt;

                // set interval time based on current working employee on operation (if op active then 1 other wise 0)
                vm.tickIntervalForWOOPEmpTotTimeConsmp = woOPEmpWiseTotTimeConsumptionData.ActiveEmpCnt;

                const tickProduciton = () => {
                    setTimeoutActivity = setInterval(() => {
                        timerData.TotalConsumptionTime = timerData.TotalConsumptionTime + vm.tickIntervalEmployee;
                        timerData.totalConsumptionDisplay = secondsToTime(timerData.TotalConsumptionTime, true);

                        timerCurrentData.TotalConsumptionTime = timerCurrentData.TotalConsumptionTime + vm.tickInterval;

                        woOPEmpWiseTotTimeConsumptionData.TotalConsumptionTime = woOPEmpWiseTotTimeConsumptionData.TotalConsumptionTime + vm.tickIntervalForWOOPEmpTotTimeConsmp;
                        woOPEmpWiseTotTimeConsumptionData.totalConsumptionDisplay = secondsToTime(woOPEmpWiseTotTimeConsumptionData.TotalConsumptionTime, true);

                        if ($scope.woTransId) {
                            vm.currentTimerDiff = secondsToTime(timerCurrentData.TotalConsumptionTime, true);
                        }
                    }, _configSecondTimeout);
                    //_setTimeoutProduction = $timeout(tickProduciton, _configSecondTimeout);
                };
                // update timer every second
                //_setTimeoutProduction = $timeout(tickProduciton, _configSecondTimeout);
                tickProduciton();
            };

            /* Stop Timer after stop activity */
            vm.stopTimer = () => {
                clearInterval(setTimeoutActivity);
                //$timeout.cancel(_setTimeoutProduction);
            };

      // view assembly at glance from costing module
      vm.AssyAtGlance = (e) => {
        const obj = {
          partID: vm.woAllHeaderDetails.partID,
          mfgPNDescription: vm.woAllHeaderDetails.partDescription
        };
        DialogFactory.dialogService(
          RFQTRANSACTION.ASSEMBLY_AT_GLANCE_CONTROLLER,
          RFQTRANSACTION.ASSEMBLY_AT_GLANCE_VIEW,
          e,
          obj).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };
      vm.getHoldResumeStatus = (responseData) => {
        let haltObj = {};
        const woID = responseData.woID ? responseData.woID : _.find(responseData.woIDs, (item) => item === vm.woID);
        if (woID === vm.woID) {
          vm.refType = [vm.haltResumePopUp.refTypePO, vm.haltResumePopUp.refTypeKA, vm.haltResumePopUp.refTypeKR];
          vm.cgBusyLoading = KitAllocationFactory.getHoldResumeStatus().query({
            woID: woID,
            refType: vm.refType,
            isFromWo: true
          }).$promise.then((response) => {
            if (response) {
              vm.haltStatusCheck = response.data ? _.groupBy(response.data, 'refType') : null;
              vm.tooltipData = '';
              vm.haltList = [];
              // refered print-lable-popup line 183
              _.map(_.groupBy(response.data, 'poNumber'), (item, index) => {
                haltObj = {
                  poNumber: index,
                  poHaltStatus: _.find(item, { refType: vm.haltResumePopUp.refTypePO }),
                  kaHaltStatus: _.find(item, { refType: vm.haltResumePopUp.refTypeKA }),
                  krHaltStatus: _.find(item, { refType: vm.haltResumePopUp.refTypeKR })
                };
                vm.haltList.push(haltObj);
              });
              //vm.haltList = response.data;
              if (vm.haltStatusCheck.PO || vm.haltStatusCheck.KA || vm.haltStatusCheck.KR) {
                _.each(vm.haltList, (item) => {
                  if (item.poHaltStatus) {
                    vm.tooltipData += vm.haltResumePopUp.POHaltLabel + ' ' + vm.LabelConstant.Workorder.PO + item.poHaltStatus.poNumber + ' ' + vm.LabelConstant.Workorder.KitNumber + item.poHaltStatus.kitNumber + ': ' + item.poHaltStatus.reason + '<br/ >';
                    vm.tooltipData += 'by ' + item.poHaltStatus.empInitialName + ' on ' + item.poHaltStatus.startDate + '<br/>';
                  }
                  if (item.kaHaltStatus) {
                    vm.tooltipData += vm.haltResumePopUp.KitAllocationHaltLabel + ' ' + vm.LabelConstant.Workorder.PO + item.kaHaltStatus.poNumber + ' ' + vm.LabelConstant.Workorder.KitNumber + item.kaHaltStatus.kitNumber + ': ' + item.kaHaltStatus.reason + '<br/ >';
                    vm.tooltipData += 'by ' + item.kaHaltStatus.empInitialName + ' on ' + item.kaHaltStatus.startDate + '<br/>';
                  }
                  if (item.krHaltStatus) {
                    vm.tooltipData += vm.haltResumePopUp.kitReleaseHaltLabel + ' ' + vm.LabelConstant.Workorder.PO + item.krHaltStatus.poNumber + ' ' + vm.LabelConstant.Workorder.KitNumber + item.krHaltStatus.kitNumber + ': ' + item.krHaltStatus.reason + '<br/ >';
                    vm.tooltipData += 'by ' + item.krHaltStatus.empInitialName + ' on ' + item.krHaltStatus.startDate + '<br/>';
                  }
                });
                vm.isKitHaltStatus = true;
              } else {
                vm.isKitHaltStatus = false;
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      if (vm.woID) {
        vm.getHoldResumeStatus({ woID: vm.woID });
      }

            function connectSocket() {
                socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.PO_START, vm.getHoldResumeStatus);
                socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.PO_STOP, vm.getHoldResumeStatus);
                socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_START, vm.getHoldResumeStatus);
                socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_STOP, vm.getHoldResumeStatus);
                socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.KIT_RELEASE_START, vm.getHoldResumeStatus);
                socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.KIT_RELEASE_STOP, vm.getHoldResumeStatus);
            }
            connectSocket();

            socketConnectionService.on('reconnect', () => {
                connectSocket();
            });
            function removeSocketListener() {
                socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.PO_START);
                socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.PO_STOP);
                socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_START);
                socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_STOP);
                socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_RELEASE_START);
                socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_RELEASE_STOP);
            }

            $scope.$on('$destroy', () => removeSocketListener());
            // on disconnect socket
            socketConnectionService.on('disconnect', () => removeSocketListener());

            //Open part master document directive on click of sample image count
            vm.openDocumentTab = (mfgType, partId, isUpload) => {
                const routeState = mfgType.toUpperCase() === CORE.MFG_TYPE.MFG ? USER.ADMIN_MANAGECOMPONENT_DOCUMENT_STATE : USER.ADMIN_MANAGEDISTCOMPONENT_DOCUMENT_STATE;
                if (isUpload) {
                    BaseService.openInNew(routeState, { coid: partId, docOpenType: 2 });
                }
                else {
                    BaseService.openInNew(routeState, { coid: partId, docOpenType: 1 });
                }
            };

            // to refresh header details
            vm.refreshDetails = () => {
                getWorkorderDetails();
                if (vm.woAssyID) {
                    getWOHeaderIconList();
                }
            };

            // Usage Material Reprot- Open filter pop up
            vm.usageMaterialReport = (ev) => {
                const data = {
                    woID: vm.woID,
                    woNumber: vm.woAllHeaderDetails.woNumber,
                    woSubStatus: vm.woAllHeaderDetails.woStatusText,
                    fromGenerated: CORE.UsageReportGeneratedFrom.WO, //generated from required at SP level
                    PIDCode: vm.woAllHeaderDetails.PIDCode,
                    rohsIcon: stringFormat('{0}{1}', vm.rohsImagePath, vm.woAllHeaderDetails.rohsIcon),
                    rohsName: vm.woAllHeaderDetails.rohsName,
                    partID: vm.woAllHeaderDetails.partID
                };
                DialogFactory.dialogService(
                    WORKORDER.USAGE_MATERIAL_REPORT_POPUP_CONTROLLER,
                    WORKORDER.USAGE_MATERIAL_REPORT_POPUP_VIEW,
                    ev,
                    data).then(() => { // Success Section
                    }, () => { // Cancel  Section
                    }).catch((err) => BaseService.getErrorLog(err));
            };

            vm.showDescription = (object, ev, callFrom) => {
                let data = {};
                if (callFrom === 'Description') {
                    data = {
                        title: 'Description',
                        description: object.partDescription,
                        name: object.woNumberWithVersion
                    };
                }

                data.label = 'Work Order';
                DialogFactory.dialogService(
                    CORE.DESCRIPTION_MODAL_CONTROLLER,
                    CORE.DESCRIPTION_MODAL_VIEW,
                    ev,
                    data).then(() => {
                    }, (err) => BaseService.getErrorLog(err));
            };

            const getMFRCommentsByPart = () => {
                if (vm.woAllHeaderDetails.partID) {
                    vm.cgBusyLoading = ComponentFactory.getPartMasterCommentsByPartId().query({
                        partId: vm.woAllHeaderDetails.partID,
                        category: vm.ManufacturingAndProductionComments.id,
                        requiementType: CORE.RequirmentType[1].id
                    }).$promise.then((MFRComments) => {
                        if (MFRComments && MFRComments.data) {
                            vm.MFRCommentsList = _.map(_.map(MFRComments.data, (item) => item.inspectionmst), 'requirement');
                        }
                    }).catch((error) => BaseService.getErrorLog(error));
                }
            };

            vm.viewPurchaseRequirementList = () => {
                const data = {
                    title: vm.ManufacturingAndProductionComments.value,
                    list: vm.MFRCommentsList
                };
                DialogFactory.dialogService(
                    CORE.VIEW_BULLET_POINT_LIST_POPUP_CONTROLLER,
                    CORE.VIEW_BULLET_POINT_LIST_POPUP_VIEW,
                    null,
                    data).then(() => { }, () => { });
            };
        }
    }
})();
