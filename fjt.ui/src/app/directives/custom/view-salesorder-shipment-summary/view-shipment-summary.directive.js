(function () {
  'use sctrict';
  angular
    .module('app.core')
    .directive('viewShipmentSummary', viewShipmentSummary);

  /** @ngInject */
  function viewShipmentSummary() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        searchText: '=?'
      },
      templateUrl: 'app/directives/custom/view-salesorder-shipment-summary/view-shipment-summary.html',
      controller: viewShipmentSummaryCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function viewShipmentSummaryCtrl($scope, $timeout, CORE, USER, BaseService, $q, ManageMFGCodePopupFactory, SalesOrderFactory,
      CustomerFactory, DialogFactory, TRANSACTION, RFQTRANSACTION, HELPER_PAGE) {
      var vm = this;
      vm.loginUser = BaseService.loginUser;
      vm.LabelConstant = CORE.LabelConstant;
      vm.searchText = $scope.searchText;
      vm.SalesOrderMst = {};
      vm.SalesOrderDet = {};
      vm.SalesOrderReleaseDet = {};
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.DefaultDateTimeFormat = _dateTimeFullTimeDisplayFormat;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.maxLengthForDescription = _maxLengthForDescription;
      vm.shipmentHeader = [];
      vm.detailListCopy = [];
      vm.releaseListCopy = [];
      vm.disableScroll = false;
      vm.isPrintDisable = true;
      vm.scrollEle = '#printSection';
      vm.emptyDetailMessage = 'No Sales Order Line Detail added yet.';
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.SOWorkingStatusList = TRANSACTION.SOWorkingStatusList;
      vm.SalesOrderStatus = TRANSACTION.SalesOrderStatus;
      vm.isShowPrint = false;
      vm.CommingSoonEmptyMesssage = HELPER_PAGE.HELPER_PAGE_EMPTYSTATE.COMING_SOON;
      vm.showCommentField = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowViewUpdateCommentsAtShipmentSummary);
      // vm.showCommentField = false;
      vm.SOWorkingStatus = CORE.SOWorkingStatus;
      vm.SOWorkingStatusId = CORE.SOWorkingStatusID;
      vm.EmptyMesssageSalesOrder = angular.copy(TRANSACTION.TRANSACTION_EMPTYSTATE.ADD_SALESORDER);
      vm.EmptyMesssageSalesOrderSearch = TRANSACTION.TRANSACTION_EMPTYSTATE.SEARCHRECORD;
      vm.setfocus = false;
      vm.isAllExpanded = true; // default all expanded
      vm.sortingColumn = CORE.ShipmentSummary.SortingColumn;
      vm.sortingOrder = CORE.SortingOrder;
      vm.custPackingslipSubStatus = CORE.CustomerPackingSlipSubStatusID;
      vm.WOStatusCode = CORE.WOSTATUS;
      vm.restrictQuoteFromSearch = CORE.restrictQuoteInSearch;
      vm.BlanketPODetails = TRANSACTION.BLANKETPOOPTIONDET;
      vm.filterModel = {
        customer: null,
        searchText: vm.searchText || null,
        // includeCompletedPO: false,
        showCompletedLines: false,
        sortingColumn: 1,
        sortingOrder: 1,
        showCompletedRelLines: false,
        soWorkingStatus: 1,
        soStatus: -1
      };
      vm.filterCompletedLines = (item) => {
        // console.log((vm.filterModel.showCompletedLine && !vm.filterModel.showCompletedRelLines && item.soWorkingStatus === vm.SOWorkingStatus.Completed));
        if (vm.filterModel.showCompletedLines && item.soWorkingStatus === vm.SOWorkingStatus.Completed) {
          return true;
        } else if ((vm.filterModel.showCompletedLines && vm.filterModel.showCompletedRelLines && item.soWorkingStatus === vm.SOWorkingStatus.Completed) || item.soWorkingStatus === vm.SOWorkingStatus.InProgress || item.soWorkingStatus === vm.SOWorkingStatus.Canceled) {
          return true;
        } else {
          return false;
        }
      };

      // vm.filterCompletedRelLines = false;
      vm.setCompletedRelLine = () => {
        const partLineDetails = _.flatten(_.map(vm.shipmentHeader, (item) => item.detailList));
        const relData = _.flatten(_.map(partLineDetails, (item) => item.releaseDet));
        _.each(relData, (det) => {
          if (!det.soReleaseQty) {
            det.showReleaseLine = true;
          } else if (det.salesOrderDetStatus === vm.SOWorkingStatusId.Completed) {
            det.showReleaseLine = true;
          } else if ((vm.filterModel.showCompletedRelLines && (det.cpsDetailShippedQty || 0) >= det.soReleaseQty) || (det.cpsDetailShippedQty || 0) < det.soReleaseQty) {
            det.showReleaseLine = true;
          } else {
            det.showReleaseLine = false;
          }
        });
      };

      vm.stickyHeaderTableClass = 'cm-sticky-header-table';
      //vm.releaseLineOrderBy = {
      //  order: ['-requiementType', 'requirement']
      //};
      // vm.shippingLineOrderBy = ['cpsIndex', '-promisedShipDate'];

      const getCustomerAddress = (customerId, addressId) => CustomerFactory.customerAddressList().query({
        customerId: customerId,
        addressType: [CORE.AddressType.ShippingAddress],
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
        addressID: addressId
      }).$promise.then((customeraddress) => {
        if (customeraddress.data) {
          vm.ShippingAddressList = customeraddress.data;
          if ((!vm.ShippingAddressList) || (vm.ShippingAddressList && vm.ShippingAddressList.length === 0)) {
            vm.shipToOtherDet.showAddressEmptyState = true;
          } else {
            vm.shipToOtherDet.showAddressEmptyState = false;
          }
        } else {
          vm.shipToOtherDet.showAddressEmptyState = true;
        }
        return $q.resolve(vm.ShippingAddressList);
      }).catch((error) => BaseService.getErrorLog(error));


      /** Initialize auto-complete */
      const initAutoComplete = () => {
        vm.autoCompleteCustomer = {
          columnName: 'mfgCodeName',
          controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
          viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
          keyColumnName: 'id',
          keyColumnId: null,
          inputName: 'Customer',
          placeholderName: 'Customer',
          isRequired: false,
          isAddnew: false,
          callbackFn: function (obj) {
            const searchObj = {
              mfgcodeID: obj.id,
              isCustomer: true
            };
            return getCustomerSearch(searchObj);
          },
          onSelectCallbackFn: (item) => {
            vm.filterModel.customerID = item ? item.id : null;
            vm.filterModel.customerName = item ? item.mfgCodeName : null;
            //vm.EmptyMesssageSalesOrder.MESSAGE = stringFormat(vm.EmptyMesssageSalesOrder.MESSAGE, item.mfgCodeName);
          },
          onSearchFn: function (query) {
            const searchObj = {
              searchQuery: query,
              type: CORE.MFG_TYPE.MFG,
              inputName: vm.autoCompleteCustomer.inputName,
              isCustomer: true
            };
            return getCustomerSearch(searchObj);
          }
        };
      };

      initAutoComplete();

      const initPaging = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          pageSize: 10
        };
      };
      initPaging();

      // get customer list
      const getCustomerSearch = (searchObj) => ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((customers) => {
        if (searchObj.mfgcodeID || searchObj.mfgcodeID === 0) {
          $timeout(() => {
            if (vm.autoCompleteCustomer && vm.autoCompleteCustomer.inputName) {
              $scope.$broadcast(vm.autoCompleteCustomer.inputName, customers.data[0]);
            }
          });
        }
        return customers.data;
      }).catch((error) => BaseService.getErrorLog(error));

      // Search Data
      vm.LoadShipmentDetail = () => {
        vm.disableScroll = true;
        vm.isPrintDisable = true;
        vm.pagingInfo.Page = vm.shipmentHeader && vm.shipmentHeader.length > 0 ? vm.pagingInfo.Page + 1 : vm.pagingInfo.Page;
        const searchObj = {
          page: vm.pagingInfo.Page,
          pageSize: vm.pagingInfo.pageSize,
          customerID: vm.filterModel.customerID,
          searchText: vm.filterModel.searchText,
          allowToUpdateComment: vm.showCommentField,
          sortingColumn: vm.filterModel.sortingColumn,
          sortingOrder: vm.filterModel.sortingOrder,
          soWorkingStatus: vm.filterModel.soWorkingStatus,
          soStatus: vm.filterModel.soStatus
        };
        vm.cgBusyLoading = SalesOrderFactory.getSalesOrderShipmentSummary().query(searchObj).$promise.then((resList) => {
          if (resList && resList.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            let objAdress = {};
            let objContactPerson = {};
            vm.addShipmentHeader = angular.copy(resList.data.headerData);
            vm.addDetailListCopy = angular.copy(resList.data.detailData);
            vm.addRelListCopy = angular.copy(resList.data.releaseData);
            if (vm.addShipmentHeader && vm.addShipmentHeader.length === 0) {
              vm.pagingInfo.Page = vm.shipmentHeader && vm.shipmentHeader.length > 0 ? vm.pagingInfo.Page - 1 : vm.pagingInfo.Page;
            }
            // vm.totalRecordCount = angular.copy(resList.data.totalRecord[0]);
            vm.currentdata = vm.addShipmentHeader.length;
            // so  header SO mst lines
            _.each(vm.addShipmentHeader, (mstData) => {
              objAdress = null;
              objContactPerson = null;
              if (mstData.shippingAddressID) {
                objAdress = {
                  companyName: mstData.companyName,
                  street1: mstData.street1,
                  street2: mstData.street2,
                  street3: mstData.street3,
                  city: mstData.city,
                  state: mstData.state,
                  postcode: mstData.postcode,
                  countryMst: { countryName: mstData.countryName },
                  isActive: mstData.isAddrActive > 0 ? true : false,
                  isDefault: mstData.isAddrDefault > 0 ? true : false
                };
              }
              if (mstData.shippingContactPersonID) {
                objContactPerson = {
                  personFullName: mstData.personName,
                  title: mstData.title,
                  division: mstData.division,
                  emailList: mstData.emailList,
                  phoneList: mstData.phoneList,
                  mobile: mstData.mobile,
                  faxNumber: mstData.faxNumber
                };
              }
              mstData.shipToOtherDet = {
                showAddressEmptyState: false,
                showContPersonEmptyState: false,
                mfgType: CORE.MFG_TYPE.CUSTOMER,
                customerId: mstData.customerID,
                addressType: 'S',
                addressBlockTitle: vm.LabelConstant.Address.ShippingAddress,
                companyName: mstData.customerName,
                companyNameWithCode: mstData.customerName,
                refTransID: mstData.customerID,
                refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
                alreadySelectedPersonId: mstData.defaultContactPersonID
              };
              mstData.shippingAddress = objAdress; // ? BaseService.generateAddressFormateForStoreInDB(objAdress) : null;
              mstData.shippingContactPerson = objContactPerson;
              mstData.isShow = vm.isAllExpanded;
              //if (mstData.shippingAddress) {
              //  mstData.shippingAddress = mstData.shippingAddress.replace(/\r/g, '<br/>');
              //}

              let className = _.find(CORE.WoStatus, (item) => item.ID === parseInt(mstData.soStatus));
              mstData.soStatusClass = className ? className.ClassName : '';

              className = _.find(CORE.POType, (item) => item.Name === mstData.isBlanketPOText);
              mstData.blanketPOClass = className ? className.ClassName : '';

              className = _.find(CORE.POType, (item) => item.Name === mstData.isRmaPOText);
              mstData.rmaPOClass = className ? className.ClassName : '';

              className = _.find(CORE.POType, (item) => item.Name === mstData.isLegacyPOText);
              mstData.legacyPOClass = className ? className.ClassName : '';

              mstData.blanketPOOptionObj = _.find(TRANSACTION.BLANKETPOOPTION, (item) => item.id === mstData.blanketPOOption);
              mstData.poDate = BaseService.getUIFormatedDate(mstData.poDate, vm.DefaultDateFormat);
              mstData.soDate = BaseService.getUIFormatedDate(mstData.soDate, vm.DefaultDateFormat);
              mstData.lastCPSDate = BaseService.getUIFormatedDate(mstData.lastCPSDate, vm.DefaultDateFormat);
              mstData.poRevisionDate = BaseService.getUIFormatedDate(mstData.poRevisionDate, vm.DefaultDateFormat);
              if (mstData.workingStatus === vm.SOWorkingStatusId.InProgress) {
                mstData.workingStatusText = vm.SOWorkingStatus.InProgress;
              } else if (mstData.workingStatus === vm.SOWorkingStatusId.Completed) {
                mstData.workingStatusText = vm.SOWorkingStatus.Completed;
              } else if (mstData.workingStatus === vm.SOWorkingStatusId.Cancelled) {
                mstData.workingStatusText = vm.SOWorkingStatus.Canceled;
              }
              if (!mstData.detailList) {
                mstData.detailList = [];
              }
              mstData.soStatus = parseInt(mstData.soStatus);
              mstData.showAddCPSHeader = true;
              if (mstData.workingStatus === CORE.SalesOrderDetStatus.COMPLETED || mstData.workingStatus === CORE.SalesOrderDetStatus.CANCELED) {
                mstData.showAddCPSHeader = false;
              }
              //if (mstData.cancelStatus === 1) {
              //  mstData.showAddCPSHeader = false;
              //}
              if (mstData.blanketPOOption === vm.BlanketPODetails.LINKBLANKETPO) {
                mstData.showAddCPSHeader = false;
              }
              if (mstData.soStatus === vm.WOStatusCode.DRAFT) {
                mstData.showAddCPSHeader = false;
              }
              // getCustomerAddress(mstData.customerID, mstData.shippingAddress);

              mstData.detailList = _.filter(resList.data.detailData, (item) => item.refSalesOrderID === mstData.soId);
              // so detail part line
              _.each(mstData.detailList, (soDet) => {
                soDet.releaseDet = _.filter(resList.data.releaseData, (item) => item.refSalesOrderID === soDet.refSalesOrderID && item.soDetId === soDet.soDetId);
                soDet.releaseTotalCnt = soDet.releaseDet ? soDet.releaseDet.length : 0;
                // soDet.releaseInProgCnt = (mstData.blanketPOOption === vm.BlanketPODetails.LINKBLANKETPO) ? 1 : (_.filter(soDet.releaseDet, (item) => (item.cpsDetailShippedQty || 0) < item.soReleaseQty).length);
                if (mstData.blanketPOOption === vm.BlanketPODetails.LINKBLANKETPO && soDet.releaseDet.length === 0) {
                  soDet.releaseInProgCnt = 1;
                  soDet.releaseTotalCnt = 1;
                } else {
                  soDet.releaseInProgCnt = (_.filter(soDet.releaseDet, (item) => (item.cpsDetailShippedQty || 0) < item.soReleaseQty).length || 0);
                }
                soDet.disableWOComment = (soDet.partType !== CORE.PartType.SubAssembly) ? true : false;
                soDet.disableTBDComment = (soDet.partType === CORE.PartType.Other) ? true : false;
                soDet.isAssembly = (soDet.partType === CORE.PartType.SubAssembly) ? true : false;
                soDet.isOtherComponent = (soDet.partType === CORE.PartType.Other) ? true : false;
                soDet.openPOQty = parseFloat(soDet.custPOQty) - parseFloat(soDet.shippedQty || 0);
                soDet.openPOQty = soDet.openPOQty < 0 ? 0 : soDet.openPOQty;

                if (soDet.salesOrderDetStatus === CORE.SalesOrderDetStatus.COMPLETED) {
                  soDet.disableWOComment = true;
                  soDet.disableTBDComment = true;
                }
                if (soDet.cancelStatus === 1) {
                  soDet.disableWOComment = true;
                  soDet.disableTBDComment = true;
                }
                // so detail  release line
                _.each(soDet.releaseDet, (relDet) => {
                  relDet.promisedShipDate = BaseService.getUIFormatedDate(relDet.promisedShipDate, vm.DefaultDateFormat);
                  relDet.packingSlipDate = BaseService.getUIFormatedDate(relDet.packingSlipDate, vm.DefaultDateFormat);
                  relDet.isReadyToShip = relDet.isReadyToShip > 0 ? true : false;
                  relDet.showAddCPS = true;
                  if (soDet.salesOrderDetStatus === CORE.SalesOrderDetStatus.COMPLETED) {
                    relDet.showAddCPS = false;
                  }
                  if (relDet.relCompletedStatus) {
                    relDet.showAddCPS = false;
                  }
                  if (soDet.cancelStatus === 1) {
                    relDet.showAddCPS = false;
                  }
                  if (mstData.blanketPOOption === vm.BlanketPODetails.LINKBLANKETPO) {
                    relDet.showAddCPS = false;
                  }
                  if (mstData.soStatus === vm.WOStatusCode.DRAFT) {
                    relDet.showAddCPS = false;
                  }
                  if (soDet.refSODetID) {
                    relDet.showAddCPS = false;
                  }
                });
              });
            });
            // append data in existting one.
            if (vm.shipmentHeader) {
              vm.shipmentHeader.push(...vm.addShipmentHeader);
              vm.detailListCopy.push(...vm.addDetailListCopy);
              vm.releaseListCopy.push(...vm.addRelListCopy);
            }
            vm.disableScroll = false;
            vm.isPrintDisable = false;
            vm.customerNoDataFound = false;
            vm.searchNoDataFound = false;
            if (vm.addShipmentHeader && vm.addShipmentHeader.length > 0) {
              vm.setCompletedRelLine();
            }
            if (vm.shipmentHeader.length === 0) {
              if (vm.filterModel.customerID && (!vm.filterModel.searchText)) {
                vm.customerNoDataFound = true;
              } else if (vm.filterModel.searchText) {
                vm.searchNoDataFound = true;
              }
            } else {
              vm.customerNoDataFound = false;
              vm.searchNoDataFound = false;
            }
            if (vm.isSearch) {
              vm.EmptyMesssageSalesOrder = angular.copy(TRANSACTION.TRANSACTION_EMPTYSTATE.ADD_SALESORDER);
              vm.EmptyMesssageSalesOrder.MESSAGE = stringFormat(vm.EmptyMesssageSalesOrder.MESSAGE, vm.filterModel.customerName);
            }
            vm.setfocus = true;
          }
        }).catch((error) => BaseService.getErrorLog(error));;
      };
      // vm.LoadShipmentDetail();

      //search data
      vm.searchData = () => {
        vm.isSearch = true;
        vm.shipmentHeader = [];
        vm.detailListCopy = [];
        vm.releaseListCopy = [];
        initPaging();
        vm.LoadShipmentDetail();
      };

      // Clear Data
      vm.clearData = () => {
        vm.isSearch = false;
        vm.filterModel = {
          customer: null,
          searchText: vm.searchText || null,
          showCompletedLines: false,
          sortingColumn: 1,
          sortingOrder: 1,
          showCompletedRelLines: false,
          soWorkingStatus: 1,
          soStatus: -1
        };
        if (vm.autoCompleteCustomer.keyColumnId) {
          vm.autoCompleteCustomer.keyColumnId = null;
          $scope.$broadcast(vm.autoCompleteCustomer.inputName + 'searchText', null);
        }
        vm.refreshData();
      };

      // Refresh Data
      vm.refreshData = () => {
        initPaging();
        vm.shipmentHeader = [];
        vm.detailListCopy = [];
        vm.releaseListCopy = [];
        vm.LoadShipmentDetail();
      };

      // On Pressing enter at search Text
      vm.enterSearchText = (ev) => {
        if (ev && (ev.keyCode === 9 || ev.keyCode === 13)) {
          vm.searchData();
        }
      };

      //change in SO Part Line
      vm.changePartLineData = (detData) => {
        if (vm.detailListCopy) {
          const copyDet = angular.copy(_.find(vm.detailListCopy, (item) => item.refSalesOrderID === detData.refSalesOrderID && item.soDetId === detData.soDetId));
          if (copyDet.woComment !== detData.woComment) {
            detData.isUpdated = true;
          }
          if (copyDet.tbdComment !== detData.tbdComment) {
            detData.isUpdated = true;
          }
        }
        if (detData.isUpdated) {
          vm.saveShipmentSummaryDetail();
        }
      };

      //change in release Line Data
      vm.changeReleaseLineDetails = (relData) => {
        if (vm.releaseListCopy) {
          const copyDet = angular.copy(_.find(vm.releaseListCopy, (item) => item.soDetId === relData.soDetId && item.releaseNumber === relData.releaseNumber));
          if (copyDet.releaseLineComment !== relData.releaseLineComment) {
            relData.isUpdated = true;
            relData.releaseNoteUpdated = true;
          }
          if (copyDet.isReadyToShip !== relData.isReadyToShip) {
            relData.isUpdated = true;
          }
        }
        if (relData.isUpdated) {
          vm.saveShipmentSummaryDetail();
        }
      };

      // save comments
      vm.saveShipmentSummaryDetail = () => {
        if (BaseService.focusRequiredField(vm.frmShipmentSummary)) {
          return;
        }
        const detailData = _.flatten(_.map(vm.shipmentHeader, (item) => item.detailList));
        const filterUpdate = _.filter(detailData, (item) => item.isUpdated);
        const relData = _.flatten(_.map(detailData, (item) => item.releaseDet));
        const filterUpdateRel = _.filter(relData, (item) => item.isUpdated);
        const updateHeaderObj = [];
        let soMst;
        let newRevision;
        let messageBody = '<ui>';
        let isChangeRevision = false;
        let isChangeHeader = false;
        const addSocketIds = [];
        // ask  for revision only in case of rel line notes changes.
        //_.each(filterUpdate, (item) => {
        //  soMst = _.find(vm.shipmentHeader, (hd) => hd.soId === item.refSalesOrderID);
        //  newRevision = soMst && parseInt(soMst.sorevision) < 10 ? stringFormat('0{0}', parseInt(soMst.sorevision) + 1) : parseInt(soMst.sorevision) + 1;
        //  if (soMst && soMst.soStatus === CORE.WOSTATUS.PUBLISHED) {
        //    messageBody = messageBody + '<li> <b>' + soMst.salesOrderNumber + '</b>: [Version: ' + soMst.sorevision + ' to ' + newRevision + ']</li>';
        //    isChangeRevision = true;
        //    updateHeaderObj.push({
        //      id: soMst.soId,
        //      revision: newRevision
        //    });
        //  } else if (soMst && soMst.soStatus === CORE.WOSTATUS.DRAFT && soMst.isAlreadyPublished) {
        //    isChangeHeader = true;
        //    updateHeaderObj.push({
        //      id: soMst.soId,
        //      isAskForVersionConfirmation: true
        //    });
        //    addSocketIds.push(soMst.soId);
        //  }
        //});
        _.each(filterUpdateRel, (item) => {
          if (item.releaseNoteUpdated) {
            soMst = _.find(vm.shipmentHeader, (hd) => hd.soId === item.refSalesOrderID);
            newRevision = soMst && parseInt(soMst.sorevision) < 10 ? stringFormat('0{0}', parseInt(soMst.sorevision) + 1) : parseInt(soMst.sorevision) + 1;
            if (!_.find(updateHeaderObj, (det) => det.id === item.refSalesOrderID)) {
              if (soMst && soMst.soStatus === CORE.WOSTATUS.PUBLISHED) {
                messageBody = messageBody + '<li> <b>' + soMst.salesOrderNumber + '</b>: [Version: ' + soMst.sorevision + ' to ' + newRevision + ']</li>';
                isChangeRevision = true;
                updateHeaderObj.push({
                  id: soMst.soId,
                  revision: newRevision
                });
              } else if (soMst && soMst.soStatus === CORE.WOSTATUS.DRAFT && soMst.isAlreadyPublished) {
                isChangeHeader = true;
                updateHeaderObj.push({
                  id: soMst.soId,
                  isAskForVersionConfirmation: true
                });
                addSocketIds.push(soMst.soId);
              }
            }
          }
        });
        messageBody = messageBody + '</ui>';
        if (isChangeRevision) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.UPGRAGE_MULTI_SO_VERSION_CONFIRMATION);
          messageContent.message = stringFormat(messageContent.message, messageBody);
          const model = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(model).then((yes) => {
            if (yes) {
              isChangeHeader = true;
              saveSOCommentsAfterConfirmation(filterUpdate, filterUpdateRel, isChangeHeader, updateHeaderObj, addSocketIds, isChangeRevision);
            }
          }, () => {
            saveSOCommentsAfterConfirmation(filterUpdate, filterUpdateRel, isChangeHeader, updateHeaderObj, addSocketIds, isChangeRevision);
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          saveSOCommentsAfterConfirmation(filterUpdate, filterUpdateRel, isChangeHeader, updateHeaderObj, addSocketIds, isChangeRevision);
        }
      };

      const saveSOCommentsAfterConfirmation = (filterUpdate, filterUpdateRel, isChangeHeader, updateHeaderObj, addSocketIds, isChangeRevision) => {
        let soMst, relCopy;
        const saveObj = {
          updateDetObj: filterUpdate,
          updateRelObj: filterUpdateRel,
          updateHeaderObj: (isChangeHeader ? updateHeaderObj : null),
          socketIds: addSocketIds && addSocketIds.length > 0 ? addSocketIds : []
        };
        vm.cgBusyLoading = SalesOrderFactory.updateSalesOrderFromShipmentSummary().query(saveObj).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            _.each(filterUpdateRel, (item) => {
              if (isChangeRevision) {
                soMst = _.find(vm.shipmentHeader, (hd) => hd.soId === item.refSalesOrderID);
                relCopy = _.find(vm.releaseListCopy, (det) => det.soDetId === item.soDetId && det.releaseNumber === item.releaseNumber);
                relCopy.releaseLineComment = item.releaseLineComment;
                relCopy.isReadyToShip = item.isReadyToShip;
                newRevision = soMst && parseInt(soMst.sorevision) < 10 ? stringFormat('0{0}', parseInt(soMst.sorevision) + 1) : parseInt(soMst.sorevision) + 1;
                soMst.sorevision = newRevision;
              }
              item.isUpdated = false;
              item.releaseNoteUpdated = false;
            });
            _.each(filterUpdate, (item) => {
              item.isUpdated = false;
              const copyDet = angular.copy(_.find(vm.detailListCopy, (det) => det.refSalesOrderID === item.refSalesOrderID && det.soDetId === item.soDetId));
              copyDet.woComment = item.woComment;
              copyDet.tbdComment = item.tbdComment;
            });
            vm.cgBusyLoading = [];
            vm.frmShipmentSummary.$setPristine();
            //vm.shipmentHeader = [];
            //vm.detailListCopy = [];
            //vm.releaseListCopy = [];
            ////if (addSocketIds && addSocketIds.length > 0) {
            ////  $scope.$broadcast('SetSOVersionConfirmationFlag', addSocketIds);
            ////}
            //initPaging();
            //vm.LoadShipmentDetail();
          } else {
            vm.cgBusyLoading = [];
          }
        }).catch((error) => { vm.cgBusyLoading = []; BaseService.getErrorLog(error); });
      };

      // print Page
      vm.printPage = () => {
        vm.isShowPrint = true;
        if ($scope.$parent && $scope.$parent.vm) {
          $scope.$parent.vm.isShowPrint = vm.isShowPrint;
        }
        //var innerContents = document.getElementById('printSection').innerHTML;
        //var popupWinindow = window.open('', '_blank', 'width=700,height=700,scrollbars=yes,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        //popupWinindow.document.open();
        //popupWinindow.document.write('\
        //        <html>\
        //            <head>\
        //                <style>\
        //                    @page {\
        //                        size: Letter landscape;\
        //                        margin: 0;\
        //                     }\
        //                 </style>\
        //              </head>\
        //         <body onload="window.print()">' + innerContents + '\
        //      </html>');
        //popupWinindow.document.close();
      };

      // close empty state
      vm.closeEmptyState = () => {
        vm.isShowPrint = false;
        if ($scope.$parent && $scope.$parent.vm) {
          $scope.$parent.vm.isShowPrint = vm.isShowPrint;
        }
      };

      const showDescription = (popupData, ev) => {
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          popupData).then(() => {
          }, (err) => BaseService.getErrorLog(err));
      };

      /* to display last packing slip shipping comments */
      vm.showPSComments = (obj, ev) => {
        const popupData = {
          title: 'PS Comment',
          description: obj.lastCPSComment
        };
        showDescription(popupData, ev);
      };

      //show SO shipping comment in pop up
      vm.showShippingComments = (obj, ev) => {
        const popupData = {
          title: 'PO ' + vm.LabelConstant.SalesOrder.ShippingComments,
          description: obj.shippingComment
        };
        showDescription(popupData, ev);
      };

      //show SO internal comment in pop up
      vm.showInternalComments = (obj, ev) => {
        const popupData = {
          title: 'PO ' + vm.LabelConstant.SalesOrder.InternalNotes,
          description: obj.internalComment
        };
        showDescription(popupData, ev);
      };

      //show SO Line shipping comment in pop up
      vm.showLineShippingComment = (obj, ev) => {
        const popupData = {
          title: vm.LabelConstant.SalesOrder.ShippingCommentsLine,
          description: obj.shippingComment
        };
        showDescription(popupData, ev);
      };

      //show SO Line internal comment in pop up
      vm.showLineInternalComment = (obj, ev) => {
        const popupData = {
          title: vm.LabelConstant.SalesOrder.InternalNotesLine,
          description: obj.internalComment
        };
        showDescription(popupData, ev);
      };

      //show SO Assy Description in pop up
      vm.showAssyDescription = (obj, ev) => {
        const popupData = {
          title: 'Part Description',
          description: obj.partDescription
        };
        showDescription(popupData, ev);
      };

      //show SO Assy Special Note in pop up
      vm.showAssySpecialNote = (obj, ev) => {
        const popupData = {
          title: vm.LabelConstant.MFG.SpecialNote,
          description: obj.partSpecialNote
        };
        showDescription(popupData, ev);
      };

      // open packing slip list
      vm.showCustPackingSlipDetail = (item, detItem, isFromDrftPSCnt, ev) => {
        const data = {
          soID: item.soId,
          soNumber: item.salesOrderNumber,
          poNumber: item.poNumber,
          customerId: item.customerID,
          customerName: item.customerName,
          id: detItem && detItem.soDetId ? detItem.soDetId : null,
          cpsStatus: isFromDrftPSCnt ? 1 : null
        };
        DialogFactory.dialogService(
          TRANSACTION.TRANSACTION_SALESORDER_QTY_CONTROLLER,
          TRANSACTION.TRANSACTION_SALESORDER_QTY_VIEW,
          ev,
          data).then(() => {
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
      };

      //view assy details
      vm.ViewAssemblyStockStatus = (detailData, event) => {
        const data = angular.copy(detailData);
        data.rohsIcon = vm.rohsImagePath + detailData.rohsIcon;
        DialogFactory.dialogService(
          CORE.ASSEMBLY_STOCK_STATUS_MODAL_CONTROLLER,
          CORE.ASSEMBLY_STOCK_STATUS_MODAL_VIEW,
          event,
          data).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      // open release line popup
      vm.goToReleaseDetail = (mstData, detData, ev) => {
        const rowDetail = {
          id: detData.soDetId,
          salesOrderDetStatus: detData.salesOrderDetStatus,
          qty: detData.custPOQty,
          poDate: mstData.poDate,
          mfrID: detData.mfgcodeID,
          partID: detData.partID,
          lineID: detData.lineID,
          mfrName: detData.mfrName,
          mfgPN: detData.mfgPN,
          isCustom: detData.isCustomPart,
          rohsIcon: vm.rohsImagePath + detData.rohsIcon,
          rohsText: detData.rohsName,
          PIDCode: detData.PIDCode,
          materialTentitiveDocDate: detData.materialTentitiveDocDate
        };
        const data = {
          rowDetail: _.clone(rowDetail),
          customerID: mstData.customerID,
          soID: mstData.soId,
          soNumber: mstData.salesOrderNumber,
          soDate: mstData.soDate,
          poDate: mstData.poDate,
          isDisable: (mstData.blanketPOOption === vm.BlanketPODetails.LINKBLANKETPO) ? true : false,
          poNumber: mstData.poNumber,
          companyNameWithCode: mstData.customerName,
          companyName: mstData.customerName
        };
        DialogFactory.dialogService(
          CORE.SO_RELEASE_LINE_MODAL_CONTROLLER,
          CORE.SO_RELEASE_LINE_MODAL_VIEW,
          ev,
          data).then(() => {
          }, (response) => {
            if (response) {
              vm.searchData();
            }
          }, (err) => BaseService.getErrorLog(err));
      };

      /* Add/Update Initial Assembly Stock*/
      vm.addEditAssemblyStock = (partID, ev) => {
        const data = {};
        if (partID) {
          data.assyId = partID;
        }
        DialogFactory.dialogService(
          USER.ADMIN_ASSEMBLYSTOCK_UPDATE_MODAL_CONTROLLER,
          USER.ADMIN_ASSEMBLYSTOCK_UPDATE_MODAL_VIEW,
          ev,
          data).then(() => { }, () => { });
      };

      /*Assembly at glance*/
      vm.getAssyAtGlance = (detData, ev) => {
        DialogFactory.dialogService(
          RFQTRANSACTION.ASSEMBLY_AT_GLANCE_CONTROLLER,
          RFQTRANSACTION.ASSEMBLY_AT_GLANCE_VIEW,
          ev,
          detData).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      /* Hide/Show accordian*/
      vm.togglePOHeader = (item) => {
        item.isShow = !item.isShow;
        //  _.some(vm.descriptionList, (item) => !item.isShow);
        const collapsAll = _.every(vm.shipmentHeader, (det) => (det.isShow));
        if (collapsAll) {
          vm.isAllExpanded = true;
        } else {
          vm.isAllExpanded = false;
        }
      };

      /* Expand/collapse Feature */
      vm.setPOHeaderExpandCollapse = () => {
        vm.isAllExpanded = !vm.isAllExpanded;
        vm.shipmentHeader = _.each(vm.shipmentHeader, (item) => { item.isShow = vm.isAllExpanded; });
      };

      /*Open Add Customer Packing Slip pop-up*/
      vm.addCustomerPackingSlip = (soHeaderData, detailItem, releaseItem, isWithSODetail, ev) => {
        const sumTotal = detailItem && detailItem.releaseDet ? _.sumBy(detailItem.releaseDet, (o) => parseInt(o.soReleaseQty || 0)) : 0;

        const dataForCPS = {
          soHeaderData: soHeaderData,
          soDetailId: detailItem ? detailItem.soDetId : null,
          soReleaseId: releaseItem ? releaseItem.releaseId : null,
          isOtherComponent: detailItem ? detailItem.isOtherComponent : null,
          isWithSODetail: isWithSODetail,
          releaseDetailLength: detailItem && detailItem.releaseDet ? detailItem.releaseDet.length || 0 : 0,
          checkRelSumAndColor: (detailItem && detailItem.releaseDet && detailItem.releaseDet.length > 0 && releaseItem.custPOQty > sumTotal) ? true : false
        };
        DialogFactory.dialogService(
          TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_ADD_POPUP_CONTROLLER,
          TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_ADD_POPUP_VIEW,
          ev,
          dataForCPS).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      // open stock adjustment popup to add new adjustment
      vm.addStockAdjustment = (item, ev) => {
        if (!item.isAssembly) {
          return;
        }
        const popUpData = {
          popupAccessRoutingState: [TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_STATE],
          pageNameAccessLabel: CORE.LabelConstant.StockAdjustment.PageName
        };
        const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
        if (isAccessPopUp) {
          const data = {
            isAddDataFromCustomerPackingSlipPage: true,
            customerPackingSlipDet: {
              partID: item.partId,
              PIDCode: item.pidCode
              // woNumber: row.entity.woNumber
            }
          };
          DialogFactory.dialogService(
            TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_POPUP_CONTROLLER,
            TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_POPUP_VIEW,
            ev,
            data).then(() => { }, (err) => BaseService.getErrorLog(err));
        }
      };

      // check sum and color for the release line
      vm.checkSumAndColor = (objDetLine) => {
        const sumTotal = _.sumBy((objDetLine.releaseDet), (o) => parseInt(o.soReleaseQty || 0));
        if (objDetLine.releaseDet.length > 0 && objDetLine.custPOQty > sumTotal) {
          return true;
        }
        return false;
      };

      //open all linked po(s)
      vm.openLinkedBlanketPO = (det, header, ev) => {
        const data = {};
        //const isLine = angular.copy(vm.salesDetail.isLine);
        //vm.copySalsDetail = Object.assign(vm.salesDetail);
        //vm.salesDetail.isLine = isLine;
        data.partID = det.partID;
        data.custPOLineNumber = det.custPOLineNumber;
        data.rohsIcon = det.rohsIcon;
        data.rohsText = det.rohsName;
        data.mfgPN = det.mfgPN;
        data.mfr = det.mfrName;
        data.mfrID = det.mfgcodeID;
        data.partType = det.partType;
        data.PIDCode = det.PIDCode;
        data.id = det.soDetId;
        data.blanketPOID = header.isBlanketPO ? det.soDetId : null;
        data.soNumber = header.salesOrderNumber;
        data.poNumber = header.poNumber;
        data.soDate = header.soDate;
        data.poDate = header.poDate;
        data.revision = header.sorevision;
        data.salesOrderID = header.soId;
        data.isAlert = false;
        data.isBlanketPO = header.isBlanketPO;
        data.blanketPOOption = header.blanketPOOption;
        data.isLegacyPO = header.isLegacyPO;
        data.isRmaPO = header.isRmaPO;
        //  vm.blanketPOAssy(ev, false, true);
        DialogFactory.dialogService(
          CORE.BLANKET_PO_ASSY_MODAL_CONTROLLER,
          CORE.BLANKET_PO_ASSY_MODAL_VIEW,
          ev,
          data).then(() => {
          }, () => {
            // vm.salesDetail = Object.assign(vm.copySalsDetail);
            // const autocompleteSOPromise = [vm.salesOrderDetailsByID(), vm.getHoldUnholdDetail()];
            vm.cgBusyLoading = SalesOrderFactory.getLinkedFuturePODetails().query({ soDetId: det.soDetId }).$promise.then((response) => {
              if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                det.linkdPOCnt = response.data && response.data.salesOrderBlanketPODet && response.data.salesOrderBlanketPODet.length || 0;
              } else {
                det.linkdPOCnt = 0;
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }, (err) => BaseService.getErrorLog(err));
      };

      // go to  sales order list
      vm.goToSalesOrderList = () => BaseService.goToSalesOrderList();

      // go to manage  sales order
      vm.goToManageSalesOrder = (id) => BaseService.goToManageSalesOrder(id);

      // go to CPS List
      vm.goToCustomerPackingSlipList = () => BaseService.goToCustomerPackingSlipList();

      // go to Manage CPS
      vm.goToManageCustomerPackingSlip = (id, sId) => BaseService.goToManageCustomerPackingSlip(id, sId);

      // go to manage custmer page
      vm.goToManageCustomer = (custId) => BaseService.goToCustomer(custId);

      // go to custmer list
      vm.goToCustomerList = (custId) => BaseService.goToCustomerList(custId);

      //go to customer shipping address list page
      vm.goToCustShippingAddressList = (custID) => BaseService.goToCustomerShippingAddressList(CORE.CUSTOMER_TYPE.CUSTOMER, custID);

      // go to part master list
      vm.goToMFGPartList = () => BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE, {});

      // go to manufacturer detail page
      vm.goToManufacturerDetail = (id) => BaseService.goToManufacturer(id);

      // go to manufacturer list page
      vm.gotoManufacturerList = () => BaseService.goToManufacturerList();

      //get max length validations
      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

      angular.element(document).ready(() => {
        //vm.disableScroll = false;
        BaseService.currentPageForms = [vm.frmShipmentSummary];
        if ($scope.$parent && $scope.$parent.vm) {
          $scope.$parent.vm.saveShipmentSummaryDetail = vm.saveShipmentSummaryDetail;
          $scope.$parent.vm.frmShipmentSummary = vm.frmShipmentSummary;
          $scope.$parent.vm.printPage = vm.printPage;
          $scope.$parent.vm.closeEmptyState = vm.closeEmptyState;
          $scope.$parent.vm.isShowPrint = vm.isShowPrint;
        }
      });
    }
  }
})();
