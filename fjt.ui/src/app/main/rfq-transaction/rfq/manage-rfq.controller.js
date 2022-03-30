(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('RFQController', RFQController);

  /** @ngInject */
  function RFQController($state, $q, $timeout, $mdDialog, $scope, $filter, $stateParams, USER, CORE, RFQTRANSACTION, BaseService, ComponentStandardDetailsFactory, DialogFactory, EmployeeFactory, MasterFactory, RFQFactory, RFQSettingFactory, AssyTypeFactory, ComponentFactory, DataElementTransactionValueFactory) {
    const vm = this;
    vm.taToolbar = CORE.Toolbar;
    vm.isFormDirty = false;
    vm.disabledExportPriceGroup = true;
    const date = new Date();
    date.setDate(date.getDate() + 7);
    vm.requirement = [];
    vm.entityID = CORE.AllEntityIDS.RFQ.ID;
    vm.Entity = CORE.Entity.RFQ;
    vm.dataElementList = [];
    vm.OtherDetailTitle = CORE.OtherDetail.TabName;
    vm.OtherDetailTabName = CORE.OtherDetailTabName;
    vm.rohsDeviation = CORE.RoHSDeviation;
    vm.RFQ_MESSEGE_CONSTANT = RFQTRANSACTION.RFQ;
    vm.statusGridHeaderDropdown = CORE.RFQStatusGridHeaderDropdown;
    vm.quoteProgressGridHeaderDropdown = CORE.RFQQuoteProgressGridHeaderDropdown;
    vm.rfqAssyStatus = RFQTRANSACTION.RFQ_ASSY_STATUS;
    vm.laborTypes = RFQTRANSACTION.RFQ_ASSY_LABOR_TYPE;
    vm.rfqAssyQuoteProgress = RFQTRANSACTION.RFQ_ASSY_QUOTE_STATUS;
    vm.lebelConstant = CORE.LabelConstant;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.placeHolderFormat = angular.copy(vm.DefaultDateFormat).toUpperCase();
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE;
    vm.requirementCategory = CORE.RequitementCategory;
    vm.IsPickerOpen = {};
    vm.IsPickerOpen[vm.DATE_PICKER.quoteInDate] = false;
    vm.IsPickerOpen[vm.DATE_PICKER.quoteDueDate] = false;
    vm.unitOfTime = RFQTRANSACTION.RFQ_TURN_TYPE;
    vm.lifeExpectancy = RFQTRANSACTION.LIFE_EXPECTANCY;
    vm.quotePriority = RFQTRANSACTION.RFQ_QUOTE_PRIORITY;
    //vm.rfqAssyQuoteStatus = [];
    vm.rfqassyId = $stateParams.rfqAssyId;
    const IsPermanentDelete = CORE.IsPermanentDelete;
    vm.QtytypeOptions = CORE.RFQQtyTypeRadiobutton;
    vm.PartCategory = CORE.PartCategory;
    vm.assyList = [];
    vm.isCustomerAccess = false;

    //Get Assembly List
    const getAssyList = () => {
      const assyIds = _.filter(_.map(_.uniqBy(vm.rfq.rfqAssembly, 'partID'), 'partID'), (item) => item).join();
      return MasterFactory.getAssyPartList().query({ customerID: vm.autoCompleteCustomer.keyColumnId, assyIds: assyIds }).$promise.then((response) => {
        vm.assyList = response.data;
        rfqAssemblyRender();
        vm.cgBusyLoading = $q.all([rfqAssemblyRender()]);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //Get Assembly List
    const getAssyTypeList = () => AssyTypeFactory.getAssyTypeList().query().$promise.then((response) => {
      vm.assyTypeList = response.data;
      return $q.resolve(vm.assyTypeList);
    }).catch((error) => BaseService.getErrorLog(error));
    // get customer List
    const getCustomerList = () => {
      const queryObj = {
        isCustomerCodeRequired: false
      };
      return MasterFactory.getCustomerByEmployeeID().query(queryObj).$promise.then((customer) => {
        if (customer && customer.data) {
          vm.CustomerList = customer.data;
        }
        return $q.resolve(vm.CustomerList);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getRFQProgressCount = (rfqAssy) => {
      const queryObj = {
        partID: rfqAssy.partID,
        rfqAssyID: rfqAssy.rfqAssyID || null
      };
      return RFQFactory.getRFQProgressCount().query(queryObj).$promise.then((resProgressCount) => {
        if (resProgressCount && resProgressCount.data) {
          rfqAssy.bomProgress = resProgressCount.data[0];
          rfqAssy.customPartProgress = resProgressCount.data.length > 1 ? resProgressCount.data[1] : 0;
          rfqAssy.materialProgress = resProgressCount.data.length > 2 ? resProgressCount.data[2] : 0;
          rfqAssy.laborPercentage = resProgressCount.data.length > 3 ? resProgressCount.data[3] : 0;
          return rfqAssy;
        }
        return $q.resolve(resProgressCount.data);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // get JobType List
    const getJobTypeList = () => RFQSettingFactory.getJobTypeList().query().$promise.then((jobtype) => {
      vm.jobTypeList = jobtype.data;
      return $q.resolve(vm.jobTypeList);
    }).catch((error) => BaseService.getErrorLog(error));

    // get RfqType List
    const getRfqTypeList = () => RFQSettingFactory.getRfqTypeList().query().$promise.then((rfqtype) => {
      vm.RfqTypeList = rfqtype.data;
      return $q.resolve(vm.RfqTypeList);
    }).catch((error) => BaseService.getErrorLog(error));

    // get employee List
    const getemployeeList = () => EmployeeFactory.employeeList().query().$promise.then((employees) => {
      vm.employeeList = angular.copy(employees.data);
      _.each(vm.employeeList, (item) => {
        //item.name = (item.firstName ? item.firstName : "") + " " + (item.lastName ? item.lastName : "");
        item.name = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, item.initialName, item.firstName, item.lastName);
        if (item.profileImg) {
          item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + item.profileImg;
        }
        else {
          item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
        }
      });
      return $q.resolve(vm.employeeList);
    }).catch((error) => BaseService.getErrorLog(error));

    // get sales Commission to employee list
    const getSalesCommissionEmployeeListbyCustomer = () => {
      const obj = {
        customerID: vm.autoCompleteCustomer.keyColumnId,
        salesCommissionToID: vm.rfq && vm.rfq.salesCommissionTo ? vm.rfq.salesCommissionTo : null
      };
      return EmployeeFactory.getEmployeeListByCustomer().query(obj).$promise.then((employees) => {
        if (employees && employees.data) {
          vm.SalesCommissionEmployeeList = angular.copy(employees.data);
          _.each(vm.SalesCommissionEmployeeList, (item) => {
            if (item.profileImg && item.profileImg !== null) {
              item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + item.profileImg;
            }
            else {
              item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
            }
          });
          return $q.resolve(vm.SalesCommissionEmployeeList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // get selected Customer details
    const getcustomerdetail = (item) => {
      if (item) {
        vm.customer = item.companyName;
        $scope.ParentNme = item;
        vm.autoCompleteCustomer.keyColumnId = item.id;
        const AssyPromise = [getAssyList(), getSalesCommissionEmployeeListbyCustomer()];
        vm.cgBusyLoading = $q.all(AssyPromise).then(() => {
          initSalesCommissionAutoComplete();
          if (!vm.rfq.id) {
            vm.autoCompleteSalesCommosssionTo.keyColumnId = item.salesCommissionTo;
          } else {
            vm.autoCompleteSalesCommosssionTo.keyColumnId = vm.rfq.salesCommissionTo;
          }
        });
      } else {
        $scope.ParentNme = null;
        vm.customer = null;
        vm.assyList = [];
        vm.SalesCommissionEmployeeList = [];
        _.each(vm.rfq.rfqAssembly, (assy) => {
          assy.partID = null;
          if (assy.autoCompleteAssy) {
            assy.autoCompleteAssy.keyColumnId = null;
          }
        });
        initSalesCommissionAutoComplete();
      }
    };

    // on select callback for rfqType selected item display on header
    function getRFQtypedetail(item, rfqAssembly) {
      if (item) {
        rfqAssembly.RFQTypeID = item.id;
      } else {
        rfqAssembly.RFQTypeID = null;
      }
    }

    // on select callback for jobType selected item display on header
    function getJobTypedetail(item, rfqAssembly) {
      if (item) {
        rfqAssembly.jobTypeID = item.id;
        rfqAssembly.jobTypeName = item.name;
        if (parseInt(item.id) === parseInt(rfqAssembly.oldJobTypeID)) {
          rfqAssembly.oldJobTypeName = item.name;
        }
      } else {
        rfqAssembly.jobTypeID = null;
      }
    }

    // on select callback for Assy.Type selected item display on header
    function getAssyTypedetail(item, rfqAssembly) {
      if (item) {
        rfqAssembly.assemblyTypeID = item.id;
      } else {
        rfqAssembly.assemblyTypeID = null;
      }
    }

    function onSelectAssemblyCallbackFn(item, data) {
      if (data) {
        if (!item) {
          data.partID = null;
          data.PIDCode = null;
          data.rev = null;
          data.assemblyDescription = null;
          data.RoHSStatusID = null;
          data.RoHSIcon = null;
          data.assyCode = null;
          data.nickName = null;
          data.specialNote = null;
          data.rohsName = null;
          data.rfqAssyStandardClass = [];
          data.currentVersion = null;
          data.mfgPN = null;
          data.selectedFunctionalTypeParts = [];
          data.selectedMountingTypeParts = [];
          data.businessRisk = null;
          data.rohsDeviation = null;
          data.custAssyPN = null;
          data.isCustom = null;
          if (!data.isBom && data.autoCompleteAssyType) {
            data.assemblyTypeID = null;
            data.autoCompleteAssyType.keyColumnId = null;
          }
        }
        else {
          data.partID = item.id;
          data.PIDCode = item.PIDCode;
          data.rev = item.rev;
          data.assemblyDescription = item.description;
          data.assyCode = item.assyCode;
          data.RoHSStatusID = item.RoHSStatusID;
          data.RoHSIcon = item.rohsIcon ? CORE.WEB_URL + USER.ROHS_BASE_PATH + item.rohsIcon : CORE.WEB_URL + USER.ROHS_BASE_PATH + CORE.NO_IMAGE_ROHS;
          data.nickName = item.nickName;
          data.mfgPN = item.mfgPN;
          data.rohsName = item.rohsName;
          data.custAssyPN = item.custAssyPN;
          data.isCustom = item.isCustom;
          if (!data.isBom && data.autoCompleteAssyType && !data.autoCompleteAssyType.keyColumnId) {
            const objAssyType = _.find(vm.assyTypeList, (assyType) => assyType.id === parseInt(item.assemblyType));
            if (!objAssyType) {
              const AssyTypePromise = [getAssyTypeList()];
              vm.cgBusyLoading = $q.all(AssyTypePromise).then(() => {
                data.assemblyTypeID = item.assemblyType;
                data.autoCompleteAssyType.keyColumnId = data.assemblyTypeID;
              });
            } else {
              data.assemblyTypeID = item.assemblyType;
              data.autoCompleteAssyType.keyColumnId = data.assemblyTypeID;
            }
          } else if (!data.autoCompleteAssyType) {
            data.autoCompleteAssyType = angular.copy(defaultAutoCompleteAssyType);
            data.autoCompleteAssyType.keyColumnId = data.assemblyTypeID;
          }
          const objdeviation = _.find(vm.rohsDeviation, (x) => x.id === parseInt(item.rohsDeviation));
          if (objdeviation) {
            data.rohsDeviation = objdeviation.name;
          }
          data.specialNote = item.specialNote;
          data.rfqAssyStandardClass = [];
          data.currentVersion = item.liveVersion;
          data.businessRisk = item.businessRisk;
          checksameassy(item, data);
          vm.getRFQProgressCount(data);
          if (data.id) {
            _.each(vm.rfq.rfqPriceGroup, (objPriceGroup) => {
              const obj = _.find(objPriceGroup.rfqPriceGroupDetail, (x) => parseInt(x.rfqAssyID) === parseInt(data.id));
              if (obj) {
                obj.partID = data.partID;
                obj.PIDCode = data.PIDCode;
                obj.RoHSIcon = data.RoHSIcon;
                obj.mfgPN = item.mfgPN;
                obj.rohsName = data.rohsName;
                obj.custAssyPN = data.custAssyPN;
                obj.isCustom = data.isCustom;
              }
            });
          }
        }
      }
    }
    //get component standard data
    function getComponentStandard(cid, data) {
      if (cid) {
        return ComponentStandardDetailsFactory.getcomponentstandardDetail().query({ id: cid }).$promise.then((response) => {
          if (response.data) {
            data.rfqAssyStandardClass = [];
            const rfqAssyStandardClass = response.data;
            _.each(rfqAssyStandardClass, (stdclass) => {
              stdclass.colorCode = CORE.DefaultStandardTagColor;
              stdclass.class = stdclass.Standardclass ? stdclass.Standardclass.className : null;
              stdclass.colorCode = stdclass.Standardclass ? (stdclass.Standardclass.colorCode ? stdclass.Standardclass.colorCode : CORE.DefaultStandardTagColor) : CORE.DefaultStandardTagColor;
              stdclass.standard = stdclass.certificateStandard ? stdclass.certificateStandard.fullName : null;
              stdclass.priority = stdclass.certificateStandard ? stdclass.certificateStandard.priority : null;
              data.rfqAssyStandardClass.push(stdclass);
            });
            data.rfqAssyStandardClass.sort(sortAlphabatically('priority', 'standard', true));
          }
        });
      }
    }
    // get Selected functional type
    function getFunctionalTypePartList(cid, data) {
      if (cid) {
        vm.cgBusyLoading = ComponentFactory.getFunctionalTypePartList().query({
          id: cid
        }).$promise.then((TypePart) => {
          if (TypePart && TypePart.data) {
            //data.selectedFunctionalTypeParts = [];
            const selected = [];
            _.each(TypePart.data, (item) => {
              var newItem = {};
              newItem.id = item.partTypeID;
              newItem.name = item.rfq_parttypemst ? item.rfq_parttypemst.partTypeName : null;
              selected.push(newItem);
            });
            return data.selectedFunctionalTypeParts = selected;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }
    // get Selected Mounting type
    function getMountingTypePartList(cid, data) {
      if (cid) {
        vm.cgBusyLoading = ComponentFactory.getMountingTypePartList().query({
          id: cid
        }).$promise.then((TypePart) => {
          if (TypePart && TypePart.data) {
            //data.selectedMountingTypeParts = [];
            const selected = [];
            _.each(TypePart.data, (item) => {
              var newItem = {};
              newItem.id = item.partTypeID;
              newItem.name = item.rfq_mountingtypemst ? item.rfq_mountingtypemst.name : null;
              selected.push(newItem);
            });
            return data.selectedMountingTypeParts = selected;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    // get rfq detail on page load
    function getRfqDetails() {
      return RFQFactory.getRFQByID().query({
        id: vm.rfq.id
      }).$promise.then((response) => {
        if (response && response.data) {
          vm.rfq = response.data.rfq;
          vm.rfq.deletedrfqPriceGroup = [];

          vm.rfq.rfqAssembly = response.data.rfqDetail.rfqAssemblies;
          vm.rfq.rfqPriceGroup = response.data.rfqDetail.rfqPriceGroup;
          vm.rfq.deletedAssembly = [];
          _.each(vm.rfq.rfqAssembly, (item) => {
            item.quoteInDate = item.quoteInDate ? BaseService.getUIFormatedDate(item.quoteInDate, vm.DefaultDateFormat) : null;
            item.quoteDueDate = item.quoteDueDate ? BaseService.getUIFormatedDate(item.quoteDueDate, vm.DefaultDateFormat) : null;
          });
          const priceGroupObj = _.find(vm.rfq.rfqPriceGroup, (x) => x.id);
          if (priceGroupObj) {
            vm.disabledExportPriceGroup = false;
          } else {
            vm.disabledExportPriceGroup = true;
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function rfqAssemblyRender() {
      _.each(vm.rfq.rfqAssembly, (item) => {
        if (item.id) {
          _.each(vm.rfq.rfqPriceGroup, (objPG) => {
            const isPGAssyDetail = _.find(objPG.rfqPriceGroupDetail, (objPGD) => parseInt(objPGD.rfqAssyID) === parseInt(item.id));
            if (!isPGAssyDetail) {
              const obj = {
                rfqPriceGroupID: objPG.id,
                rfqAssyID: item.id,
                refRFQID: item.rfqrefID,
                qty: null,
                turnTime: null,
                unitOfTime: vm.unitOfTime.BUSINESS_DAY.VALUE
              };
              objPG.rfqPriceGroupDetail.push(obj);
            }
          });
        }
        item.rfqAssyID = item.id || null;
        item.deletedAssyQty = [];
        item.autoCompleteRfqType = angular.copy(defaultAutoCompleteRfqType);
        item.autoCompleteRfqType.keyColumnId = item.RFQTypeID;
        item.autoCompleteJobType = angular.copy(defaultAutoCompleteJobType);
        item.autoCompleteJobType.keyColumnId = item.jobTypeID;
        item.oldJobTypeID = item.jobTypeID;
        //item.statusDisplay = _.find(vm.rfqAssyStatus, () => { return });
        switch (item.status) {
          case vm.rfqAssyStatus.IN_PROGRESS.VALUE:
            item.statusDisplay = vm.statusGridHeaderDropdown[1].value;
            break;
          case vm.rfqAssyStatus.FOLLOW_UP.VALUE:
            item.statusDisplay = vm.statusGridHeaderDropdown[2].value;
            break;
          case vm.rfqAssyStatus.WON.VALUE:
            item.statusDisplay = vm.statusGridHeaderDropdown[3].value;
            break;
          case vm.rfqAssyStatus.LOST.VALUE:
            item.statusDisplay = vm.statusGridHeaderDropdown[4].value;
            break;
          case vm.rfqAssyStatus.CANCEL.VALUE:
            item.statusDisplay = vm.statusGridHeaderDropdown[5].value;
            break;
        };
        switch (parseInt(item.quoteFinalStatus)) {
          case vm.rfqAssyQuoteProgress.PENDING.VALUE:
            item.quoteProgressStatusDisplay = vm.quoteProgressGridHeaderDropdown[1].value;
            break;
          case vm.rfqAssyQuoteProgress.RE_QUOTE.VALUE:
            item.quoteProgressStatusDisplay = vm.quoteProgressGridHeaderDropdown[2].value;
            break;
          case vm.rfqAssyQuoteProgress.SUBMITTED.VALUE:
            item.quoteProgressStatusDisplay = vm.quoteProgressGridHeaderDropdown[3].value;
            break;
          case vm.rfqAssyQuoteProgress.COMPLETED.VALUE:
            item.quoteProgressStatusDisplay = vm.quoteProgressGridHeaderDropdown[4].value;
            break;
        };
        item.currentVersion = (item.componentAssembly && item.componentAssembly.componentbomSetting && item.componentAssembly.componentbomSetting[0].liveVersion) ? item.componentAssembly.componentbomSetting[0].liveVersion : null;
        defaultAutoCompleteAssy.addData.customerID = vm.autoCompleteCustomer ? vm.autoCompleteCustomer.keyColumnId : null;
        item.autoCompleteAssy = angular.copy(defaultAutoCompleteAssy);
        item.autoCompleteAssy.keyColumnId = item.partID;
        item.isBom = (item.componentAssembly && item.componentAssembly.rfqLineitems) ? item.componentAssembly.rfqLineitems.length > 0 ? true : false : false;
        item.autoCompleteAssyType = angular.copy(defaultAutoCompleteAssyType);
        item.autoCompleteAssyType.keyColumnId = item.assemblyTypeID;
        item.GeneratedQtyType = item.GeneratedQtyType || vm.QtytypeOptions[1].value;
        item.generateCombination = false;
        item.rfqAssyQouteStandardClass = [];
        if (item.isSummaryComplete) {
          const orderbyQuote = _.orderBy(item.rfqAssyQuoteSubmitted, ['id'], ['desc']);
          vm.selectedQuoteDeatil = orderbyQuote[0];
          _.each(vm.selectedQuoteDeatil.rfqAssyStandardClass, (stdclass) => {
            stdclass.colorCode = CORE.DefaultStandardTagColor;
            stdclass.class = stdclass.standardClass ? stdclass.standardClass.className : null;
            stdclass.colorCode = stdclass.standardClass ? (stdclass.standardClass.colorCode ? stdclass.standardClass.colorCode : CORE.DefaultStandardTagColor) : CORE.DefaultStandardTagColor;
            stdclass.standard = stdclass.certificateStandards ? stdclass.certificateStandards.fullName : null;
            stdclass.priority = stdclass.certificateStandards ? stdclass.certificateStandards.priority : null;
            item.rfqAssyQouteStandardClass.push(stdclass);
          });
          item.rfqAssyQouteStandardClass.sort(sortAlphabatically('priority', 'standard', true));
          item.quotedVersion = vm.selectedQuoteDeatil ? vm.selectedQuoteDeatil.bomLastVersion : null;
          item.lastQuoteID = vm.selectedQuoteDeatil.id;
        }

        _.each(item.rfqAssyQuantity, (qty) => {
          qty.oldrequestQty = angular.copy(qty.requestQty);
          qty.deletedAssyQtyTurnTime = [];
        });
        item.minDuedate = new Date(item.quoteInDate);
        item.minDuedate.setDate(item.minDuedate.getDate() + 1);
        item.quoteDueDateOptions = {
          minDate: item.minDuedate,
          quoteDueDateOpenFlag: false
        };
        item.quoteInDateOptions = {
          quoteInDateOpenFlag: false
        };
        item.quoteValidTillDateOptions = {
          quoteValidTillDateOpenFlag: false
        };
      });
    }
    const defaultAutoCompleteAssy = {
      columnName: 'PIDCode',
      controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
      viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
      keyColumnName: 'id',
      keyColumnId: null,
      inputName: 'Assembly',
      placeholderName: 'Assy ID',
      isRequired: true,
      isAddnew: true,
      callbackFn: getAssyList,
      onSelectCallbackFn: onSelectAssemblyCallbackFn,
      addData: {
        mfgType: CORE.MFG_TYPE.MFG,
        category: vm.PartCategory.SubAssembly,
        customerID: vm.autoCompleteCustomer ? vm.autoCompleteCustomer.keyColumnId : null,
        popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
        pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName,
        rfqOnlyEntry: true
      }
    };

    const defaultAutoCompleteAssyType = {
      columnName: 'name',
      keyColumnName: 'id',
      keyColumnId: null,
      controllerName: CORE.MANAGE_ASSY_TYPE_MODAL_CONTROLLER,
      viewTemplateURL: CORE.MANAGE_ASSY_TYPE_MODAL_MODAL_VIEW,
      inputName: 'Assy Type',
      placeholderName: 'Assy Type',
      isRequired: true,
      isAddnew: true,
      addData: {
        popupAccessRoutingState: [USER.ADMIN_ASSYTYPE_STATE],
        pageNameAccessLabel: CORE.PageName.assy_type
      },
      callbackFn: getAssyTypeList,
      onSelectCallbackFn: getAssyTypedetail
    };
    const defaultAutoCompleteRfqType = {
      columnName: 'name',
      controllerName: USER.ADMIN_RFQ_TYPE_ADD_UPDATE_MODAL_CONTROLLER,
      viewTemplateURL: USER.ADMIN_RFQ_TYPE_ADD_UPDATE_MODAL_VIEW,
      keyColumnName: 'id',
      keyColumnId: null,
      inputName: 'RFQ Type',
      placeholderName: 'RFQ Type',
      isRequired: true,
      isAddnew: true,
      addData: {
        popupAccessRoutingState: [USER.ADMIN_RFQ_TYPE_STATE],
        pageNameAccessLabel: CORE.PageName.rfq_type
      },
      callbackFn: getRfqTypeList,
      onSelectCallbackFn: getRFQtypedetail
    };
    const defaultAutoCompleteJobType = {
      columnName: 'name',
      controllerName: USER.ADMIN_JOB_TYPE_ADD_UPDATE_MODAL_CONTROLLER,
      viewTemplateURL: USER.ADMIN_JOB_TYPE_ADD_UPDATE_MODAL_VIEW,
      keyColumnName: 'id',
      keyColumnId: null,
      inputName: 'Job Type',
      placeholderName: 'Job Type',
      isRequired: true,
      isAddnew: true,
      addData: {
        popupAccessRoutingState: [USER.ADMIN_JOB_TYPE_STATE],
        pageNameAccessLabel: CORE.PageName.job_type
      },
      callbackFn: getJobTypeList,
      onSelectCallbackFn: getJobTypedetail
    };
    vm.rfq = {
      id: $stateParams.id ? $stateParams.id : null,
      quoteNote: null,
      customerId: null,
      employeeID: BaseService.loginUser.employee.id,
      deletedAssembly: [],
      rfqAssembly: [
        {
          id: null,
          PIDCode: null,
          description: null,
          rev: null,
          assyNote: null,
          RoHSStatusID: 1,
          isRepeat: false,
          repeatExpectedQty: null,
          repeatFrequency: null,
          quotePriority: vm.quotePriority.ONE.VALUE,
          //rfqAssyQuoteStatus: vm.rfqAssyQuoteStatus,
          deletedAssyQty: [],
          autoCompleteAssy: angular.copy(defaultAutoCompleteAssy),
          autoCompleteAssyType: angular.copy(defaultAutoCompleteAssyType),
          autoCompleteJobType: angular.copy(defaultAutoCompleteJobType),
          autoCompleteRfqType: angular.copy(defaultAutoCompleteRfqType),
          partID: null,
          quoteInDate: $stateParams.id ? null : new Date(),
          quoteDueDate: $stateParams.id ? null : date,
          jobtypeID: null,
          rfqtypeID: null,
          selectedFunctionalTypeParts: [],
          selectedMountingTypeParts: [],
          rfqAssyStandardClass: [],
          rfqAssyMiscBuild: [],
          GeneratedQtyType: vm.QtytypeOptions[1].value,
          laborType: vm.laborTypes.SUMMARY.VALUE,
          rfqAssyQuantity: [{
            id: null,
            requestQty: null,
            quantityType: vm.QtytypeOptions[1].value,
            deletedAssyQtyTurnTime: [],
            rfqAssyQtyTurnTime: [{
              id: null,
              turnTime: null,
              unitOfTime: vm.unitOfTime.BUSINESS_DAY.VALUE
            }]
          }]
        }
      ]
    };
    if (!vm.rfq.id) {
      vm.rfq.rfqAssembly[0].minDuedate = new Date();
      vm.rfq.rfqAssembly[0].minDuedate.setDate(vm.rfq.rfqAssembly[0].minDuedate.getDate() + 1);
      vm.rfq.rfqAssembly[0].quoteDueDateOptions = {
        minDate: vm.rfq.rfqAssembly[0].minDuedate,
        quoteDueDateOpenFlag: false
      };
      vm.rfq.rfqAssembly[0].quoteInDateOptions = {
        quoteInDateOpenFlag: false
      };
    }
    vm.onTabChanges = (index, rfqAssyID, rfqForms, rfqAssyForm) => {
      if (rfqForms && rfqAssyForm) {
        const dirtyForms = _.filter(vm.rfq.rfqAssembly, (assy, index) => (rfqForms[rfqAssyForm + index]).$valid === false);
        if (dirtyForms.length === 0) {
          if (rfqAssyID) {
            vm.rfqassyId = rfqAssyID;
            $state.transitionTo($state.$current, { id: vm.rfq.id, rfqAssyId: rfqAssyID }, { location: true, inherit: true, notify: false });
          }
          else {
            vm.rfqassyId = rfqAssyID;
            $state.transitionTo($state.$current, { id: vm.rfq.id, rfqAssyId: null }, { location: true, inherit: true, notify: false });
          }
        }
        else {
          let assyName = null;
          if (dirtyForms[0].PIDCode) {
            assyName = dirtyForms[0].PIDCode;
          } else {
            assyName = 'Assembly #' + (vm.rfq.rfqAssembly.indexOf(dirtyForms[0]) + 1);
          }
          showConfirmationPopupforCompleteAssy(assyName);
        }
      } else {
        if (rfqAssyID) {
          vm.rfqassyId = rfqAssyID;
          $state.transitionTo($state.$current, { id: vm.rfq.id, rfqAssyId: rfqAssyID }, { location: true, inherit: true, notify: false });
        }
        else {
          vm.rfqassyId = rfqAssyID;
          $state.transitionTo($state.$current, { id: vm.rfq.id, rfqAssyId: null }, { location: true, inherit: true, notify: false });
        }
      }
    };

    vm.isAssyStepValid = function () {
      var dirtyForms = _.filter(vm.rfq.rfqAssembly, (assy, index) => (vm.rfqDetails['rfqAssyform_' + index]).$valid === false);
      if (dirtyForms.length > 0) {
        let assyName = null;
        if (dirtyForms[0].PIDCode) {
          assyName = dirtyForms[0].PIDCode;
        } else {
          assyName = 'Assembly #' + (vm.rfq.rfqAssembly.indexOf(dirtyForms[0]) + 1);
        }
        return showAlertPopupforInvalidAssy(assyName);
      }
    };

    function showAlertPopupforInvalidAssy(assyName) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.INVALID_ASSY_DETAIL);
      messageContent.message = stringFormat(messageContent.message, assyName);
      const alertModel = {
        messageContent: messageContent
      };
      return DialogFactory.messageAlertDialog(alertModel).then(() => {

      });
    }
    // on click back button check form dirty for display pop-up
    vm.goBack = (form) => {
      var ischange = BaseService.checkFormDirty(form) || vm.isFormDirty;
      if (ischange) {
        showWithoutSavingAlertforBackButton(form);
      } else {
        $state.go(RFQTRANSACTION.RFQ_RFQ_STATE);
      }
    };
    // display pop-up for form dirty on click back button
    function showWithoutSavingAlertforBackButton(form) {
      var messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messgaeContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          form.$setPristine();
          vm.isFormDirty = false;
          BaseService.currentPageFlagForm = [];
          $state.go(RFQTRANSACTION.RFQ_RFQ_STATE);
        }
      }, (error) => BaseService.getErrorLog(error));
    }

    // check duedate in date validation
    vm.checkDueDate = (rfqAssy, formobj) => {
      if (rfqAssy) {
        const quoteInDate = new Date(rfqAssy.quoteInDate);
        rfqAssy.minDuedate = new Date(rfqAssy.quoteInDate);
        rfqAssy.minDuedate.setDate(rfqAssy.minDuedate.getDate() + 1);
        const quoteDueDate = new Date(rfqAssy.quoteDueDate);
        if (quoteInDate > quoteDueDate) {
          formobj.$setDirty(true);
          formobj.$touched = true;
          formobj.$setValidity('mindate', false);
        } else {
          formobj.$setValidity('mindate', true);
        }
        rfqAssy.quoteDueDateOptions = {
          minDate: rfqAssy.minDuedate,
          quoteDueDateOpenFlag: false
        };
        rfqAssy.quoteInDateOptions = {
          quoteInDateOpenFlag: false
        };
      }
    };

    const selectRFQ = (item) => {
      if (item) {
        $state.go(RFQTRANSACTION.RFQ_MANAGE_STATE, { id: item.rfqrefID, rfqAssyId: item.id }, { reload: true });
        $timeout(() => {
          vm.autoCompleteRFQ.keyColumnId = null;
        }, true);
      }
    };

    const getAllRFQList = () => RFQFactory.getAllRFQList().query().$promise.then((rfqList) => {
      if (rfqList && rfqList.data) {
        vm.rfqList = rfqList.data;
      }
      return $q.resolve(vm.rfqList);
    }).catch((error) => BaseService.getErrorLog(error));

    const getRFQSearch = (searchObj) => RFQFactory.getAllRFQList().query(searchObj).$promise.then((rfq) => {
      if (rfq) {
        return rfq.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    /*Auto-complete for Search RFQ */
    vm.autoCompleteRFQ = {
      columnName: 'rfq',
      keyColumnName: 'id',
      keyColumnId: null,
      inputName: 'RFQ',
      placeholderName: 'Quote Group',
      isRequired: false,
      isAddnew: false,
      callbackFn: getAllRFQList,
      onSelectCallbackFn: selectRFQ,
      onSearchFn: function (query) {
        const searchobj = {
          searchquery: query
        };
        return getRFQSearch(searchobj);
      }
    };

    // initialize auto complete for customer,employee
    const initAutoComplete = () => {
      vm.autoCompleteCustomer = {
        columnName: 'companyName',
        controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.rfq ? (vm.rfq.customerId ? vm.rfq.customerId : null) : null,
        addData: {
          customerType: CORE.CUSTOMER_TYPE.CUSTOMER, popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.customer
        },
        inputName: 'Customer',
        placeholderName: 'Customer',
        isRequired: true,
        isAddnew: true,
        callbackFn: getCustomerList,
        onSelectCallbackFn: getcustomerdetail
      };
      vm.autoCompleteEmployee = {
        columnName: 'name',
        controllerName: USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.rfq ? (vm.rfq.employeeID ? vm.rfq.employeeID : null) : null,
        inputName: 'RFQ Created By',
        placeholderName: 'RFQ Created By',
        isRequired: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.Personnel.PageName
        },
        isAddnew: true,
        callbackFn: getemployeeList
      };
    };
    // initialize auto complete for customer,employee
    const initSalesCommissionAutoComplete = () => {
      vm.autoCompleteSalesCommosssionTo = {
        columnName: 'name',
        keyColumnName: 'id',
        controllerName: USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW,
        keyColumnId: vm.rfq && vm.rfq.salesCommissionTo ? vm.rfq.salesCommissionTo : null,
        inputName: 'RFQ Sales Commission To',
        placeholderName: 'Sales Commission To',
        addData: {
          popupAccessRoutingState: [USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.Personnel.PageName
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getSalesCommissionEmployeeListbyCustomer
      };
    };

    vm.openPicker = (type, ev) => {
      $timeout(() => {
        if (ev.keyCode === 40) {
          vm.IsPickerOpen[type] = true;
        }
      }, 1000);
    };


    // on page load bind autocomplete of customer.
    const autocompletePromise = [getCustomerList(), getJobTypeList(), getRfqTypeList(), getemployeeList(), getAssyTypeList()];
    if (vm.rfq.id) {
      autocompletePromise.push(getRfqDetails());
    }
    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
      _.each(vm.rfq.rfqAssembly, (assy) => {
        assy.minDuedate = new Date(assy.quoteInDate);
        assy.minDuedate.setDate(vm.rfq.rfqAssembly[0].minDuedate.getDate() + 1);
        if (assy.componentAssembly && assy.componentAssembly.rfqLineitems && assy.componentAssembly.rfqLineitems.length > 0) {
          vm.isBOMAdded = true;
        }
      });
      if (vm.rfq.id) {
        if (vm.CustomerList.length > 0) {
          const custobj = _.find(vm.CustomerList, (x) => parseInt(x.id) === parseInt(vm.rfq.customerId));
          vm.isCustomerAccess = custobj ? true : false;
        }
      }
      const assyobj = _.find(vm.rfq.rfqAssembly, (rfqassy) => parseInt(rfqassy.id) === parseInt(vm.rfqassyId));
      if (assyobj) {
        vm.selectedAssyIndex = vm.rfq.rfqAssembly.indexOf(assyobj);
      } else {
        vm.selectedAssyIndex = 0;
        vm.rfqassyId = vm.rfq.rfqAssembly[0].id;
      }
      $timeout(() => {
        initAutoComplete();
        vm.isLoad = true;
      }, _configSelectListTimeout);
    }).catch((error) => BaseService.getErrorLog(error));

    // add new rfq assembly quantity
    vm.addAssyQty = (index, rfqForm, isDisable) => {
      if (isDisable) {
        return false;
      }
      const rfqAssyQty = {
        id: null,
        focus: true,
        requestQty: null,
        quantityType: vm.QtytypeOptions[1].value,
        deletedAssyQtyTurnTime: [],
        rfqAssyQtyTurnTime: [{
          id: null,
          turnTime: null,
          unitOfTime: vm.unitOfTime.BUSINESS_DAY.VALUE
        }]
      };

      var assy = _.find(vm.rfq.rfqAssembly, (item) => item === index);
      assy.rfqAssyQuantity.push(rfqAssyQty);
      rfqForm.$setDirty();
      vm.isFormDirty = true;
      BaseService.currentPageFlagForm = [vm.isFormDirty];
    };

    // remove selected rfq assembly quantity
    vm.removeAssyQty = (Assy, AssyQty, rfqForm, objname, rfqAssyForm) => {
      if (!AssyQty.rfqAssyID) {
        const assyqty = _.find(vm.rfq.rfqAssembly, (item) => item === Assy);

        assyqty.rfqAssyQuantity.splice(assyqty.rfqAssyQuantity.indexOf(AssyQty), 1);
      }
      else {
        const assyqty = _.find(vm.rfq.rfqAssembly, (item) => item === Assy);

        assyqty.deletedAssyQty.push(AssyQty);
        assyqty.rfqAssyQuantity.splice(assyqty.rfqAssyQuantity.indexOf(AssyQty), 1);
      }

      rfqForm.$setDirty();
      vm.isFormDirty = true;
      BaseService.currentPageFlagForm = [vm.isFormDirty];
      $timeout(() => {
        vm.checkSameQty(Assy.rfqAssyQuantity, AssyQty.requestQty, rfqForm, null, objname, rfqAssyForm);
      }, 1000);
    };

    vm.removeAllAssyQty = (rfqAssy, rfqForm, isDisable) => {
      if (isDisable) {
        return false;
      }
      const removedAssyQty = _.filter(rfqAssy.rfqAssyQuantity, (objQty) => !objQty.rfqPriceGroupId);
      if (removedAssyQty.length > 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.RFQ_REMOVE_ALL_ASSEMBLY_QTY_MSG);
        const obj = {
          messageContent: messageContent,
          btnText: RFQTRANSACTION.RFQ.CONFIRM_DELETE_BUTTON,
          canbtnText: RFQTRANSACTION.RFQ.CONFIRM_CANCLE_BUTTON
        };
        DialogFactory.messageConfirmDialog(obj).then(() => {
          _.each(removedAssyQty, (removedAssyQty) => {
            if (!removedAssyQty.rfqAssyID) {
              rfqAssy.rfqAssyQuantity.splice(rfqAssy.rfqAssyQuantity.indexOf(removedAssyQty), 1);
            }
            else {
              rfqAssy.deletedAssyQty.push(removedAssyQty);
              rfqAssy.rfqAssyQuantity.splice(rfqAssy.rfqAssyQuantity.indexOf(removedAssyQty), 1);
            }
          });
          rfqForm.$setDirty();
          vm.isFormDirty = true;
          BaseService.currentPageFlagForm = [vm.isFormDirty];
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // remove selected rfq assembly
    vm.removeAssy = (assembly, rfqform) => {
      let messageContent;
      if (vm.rfq.id && vm.rfq.rfqAssembly.length === 1) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.RFQ_LAST_ASSY_REMOVE_MSG);
      } else if (!vm.rfq.id && vm.rfq.rfqAssembly.length === 1) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.RFQ_LAST_ASSY_REMOVE_MSG);
      } else {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.RFQ_ASSY_REMOVE_MSG);
      }
      const obj = {
        messageContent: messageContent,
        btnText: RFQTRANSACTION.RFQ.CONFIRM_DELETE_BUTTON,
        canbtnText: RFQTRANSACTION.RFQ.CONFIRM_CANCLE_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (vm.rfq.rfqAssembly.length > 1) {
            const assy = _.find(vm.rfq.rfqAssembly, (item) => item === assembly);
            if (assy.id) {
              _.each(vm.rfq.rfqPriceGroup, (objPriceGroup) => {
                const objpgDetail = _.find(objPriceGroup.rfqPriceGroupDetail, (x) => parseInt(x.rfqAssyID) === parseInt(assy.id));
                objPriceGroup.rfqPriceGroupDetail.splice(objPriceGroup.rfqPriceGroupDetail.indexOf(objpgDetail), 1);
              });
            }
            if (assy.rfqrefID) {
              vm.rfq.deletedAssembly.push(assy);
            }
            const assyIndex = vm.rfq.rfqAssembly.indexOf(assy);
            vm.rfq.rfqAssembly.splice(assyIndex, 1);

            if (vm.selectedAssyIndex < vm.rfq.rfqAssembly.length) {
              vm.rfqassyId = vm.rfq.rfqAssembly[vm.selectedAssyIndex].id;
            } else {
              vm.rfqassyId = vm.rfq.rfqAssembly[vm.rfq.rfqAssembly.length - 1].id;
              vm.selectedAssyIndex = vm.rfq.rfqAssembly.length - 1;
            }

            vm.onTabChanges(vm.selectedAssyIndex, vm.rfqassyId);
            rfqform.$setDirty(true);
            vm.isFormDirty = true;
            BaseService.currentPageFlagForm = [vm.isFormDirty];
          } else {
            if (vm.rfq.id) {
              const selectedID = [];
              selectedID.push(vm.rfq.rfqAssembly[0].id);
              const objID = {
                id: selectedID,
                isPermanentDelete: IsPermanentDelete
              };
              vm.cgBusyLoading = RFQFactory.deleteRFQ().query({ objIDs: objID }).$promise.then((res) => {
                if (res && res.data) {
                  if (res.data.TotalCount && res.data.TotalCount > 0) {
                    BaseService.deleteAlertMessage(res.data);
                  } else {
                    $state.go(RFQTRANSACTION.RFQ_RFQ_STATE);
                  }
                }
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              $state.go(RFQTRANSACTION.RFQ_RFQ_STATE);
            }
          }
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // add new rfq assembly
    vm.addAssy = (rfqForms, rfqAssyForm) => {
      var dirtyForms = _.filter(vm.rfq.rfqAssembly, (assy, index) => (rfqForms[rfqAssyForm + index]).$valid === false);
      var minDuedate = new Date();
      minDuedate.setDate(minDuedate.getDate() + 1);
      if (dirtyForms.length === 0) {
        const rfqAssy = {
          id: null,
          PIDCode: null,
          rev: null,
          assyNote: null,
          RoHSStatusID: 1,
          isRepeat: false,
          repeatExpectedQuantity: null,
          repeatFrequency: null,
          quotePriority: vm.quotePriority.ONE.TYPE,
          repeatTime: null,
          // rfqAssyQuoteStatus: vm.rfqAssyQuoteStatus,
          autoCompleteAssy: angular.copy(defaultAutoCompleteAssy),
          partID: null,
          quoteInDate: new Date(),
          quoteDueDate: date,
          minDuedate: minDuedate,
          jobtypeID: null,
          rfqtypeID: null,
          GeneratedQtyType: vm.QtytypeOptions[1].value,
          deletedAssyQty: [],
          selectedFunctionalTypeParts: [],
          selectedMountingTypeParts: [],
          rfqAssyMiscBuild: [],
          laborType: vm.laborTypes.SUMMARY.VALUE,
          rfqAssyQuantity: [{
            id: null,
            quantityType: vm.QtytypeOptions[1].value,
            requestQty: null,
            rfqAssyQtyTurnTime: [{
              id: null,
              turnTime: null,
              unitOfTime: vm.unitOfTime.BUSINESS_DAY.VALUE
            }]
          }]
        };

        vm.rfq.rfqAssembly.push(rfqAssy);
        vm.selectedAssyIndex = vm.rfq.rfqAssembly.length + 1;
        rfqAssemblyRender();
        vm.onTabChanges(vm.selectedAssyIndex, null);
        vm.rfqDetails.$setDirty();
        vm.isFormDirty = true;
        BaseService.currentPageFlagForm = [vm.isFormDirty];
      } else {
        let assyName = null;
        if (dirtyForms[0].PIDCode) {
          assyName = dirtyForms[0].PIDCode;
        } else {
          assyName = 'Assembly #' + (vm.rfq.rfqAssembly.indexOf(dirtyForms[0]) + 1);
        }
        showConfirmationPopupforCompleteAssy(assyName);
      }
    };

    /* confirmation popup for invalid RFQ assembly */
    function showConfirmationPopupforCompleteAssy(assyName) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.FILL_ASSY_DETAIL);
      messageContent.message = stringFormat(messageContent.message, assyName);
      const alertModel = {
        messageContent: messageContent
      };
      DialogFactory.messageAlertDialog(alertModel);
    }

    // Save rfq details
    vm.saveRFQ = (rfq) => {
      rfq.customerId = vm.autoCompleteCustomer ? vm.autoCompleteCustomer.keyColumnId : null;
      rfq.employeeID = vm.autoCompleteEmployee ? vm.autoCompleteEmployee.keyColumnId : null;
      rfq.salesCommissionTo = vm.autoCompleteSalesCommosssionTo ? vm.autoCompleteSalesCommosssionTo.keyColumnId : null;
      rfq.customercontactpersonID = null;
      let jobTypeChange = false;
      const jobtypeChangeAssy = [];
      _.each(rfq.rfqAssembly, (assy) => {
        assy.jobTypeID = assy.autoCompleteJobType ? assy.autoCompleteJobType.keyColumnId : null;
        assy.RFQTypeID = assy.autoCompleteRfqType ? assy.autoCompleteRfqType.keyColumnId : null;
        if (rfq.id && assy.id && assy.oldJobTypeID && assy.jobTypeID !== assy.oldJobTypeID && assy.isReadyForPricing) {
          jobTypeChange = jobTypeChange ? jobTypeChange : true;
          jobtypeChangeAssy.push(assy);
        }
        const additionalRequirement = vm.htmlToPlaintext(assy.additionalRequirement);
        if (!additionalRequirement) {
          assy.additionalRequirement = null;
        }
        if (!assy.id) {
          assy.status = vm.rfqAssyStatus.IN_PROGRESS.VALUE;
          assy.quoteFinalStatus = vm.rfqAssyQuoteProgress.PENDING.VALUE;
        }
      });

      _.each(rfq.rfqAssembly, (item) => {
        item.quoteInDate = BaseService.getAPIFormatedDate(item.quoteInDate);
        item.quoteDueDate = BaseService.getAPIFormatedDate(item.quoteDueDate);
        item.quoteValidTillDate = BaseService.getAPIFormatedDate(item.quoteValidTillDate);
      });

      if (rfq.id) {
        if (jobtypeChangeAssy.length > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.JOBTYPE_CHANGE_MESSAGE);
          const message = messageContent.message + '<br/><br/><table style="width:100%"><thead><tr><th class="border-bottom padding-5">#</th><th class="border-bottom padding-5">Assembly</th><th class="border-bottom padding-5">Old Job Type</th><th class="border-bottom padding-5">New Job Type</th></tr></thead><tbody>{0}</tbody></table>';
          const subMessage = [];
          jobtypeChangeAssy.forEach((item) => {
            subMessage.push('<tr><td class="border-bottom padding-5">' + (jobtypeChangeAssy.indexOf(item) + 1) + '</td><td class="border-bottom padding-5">' + item.PIDCode + '</td><td class="border-bottom padding-5">' + item.oldJobTypeName + '</td><td class="border-bottom padding-5">' + item.jobTypeName + '</td></tr>');
          });

          messageContent.message = stringFormat(message, subMessage.join(''));
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          return DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.cgBusyLoading = RFQFactory.saveRFQ().save(rfq).$promise.then((res) => {
                if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  if (res.data) {
                    vm.rfqDetails.$setPristine();
                    vm.isFormDirty = false;
                    BaseService.currentPageFlagForm = [];
                    if (vm.rfqassyId) {
                      $state.go($state.$current, { id: res.data.id, rfqAssyId: vm.rfqassyId }, { reload: true });
                    } else {
                      $state.go($state.$current, { id: res.data.id, rfqAssyId: null }, { reload: true });
                    }
                  } else {
                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.RFQ_DELETE_MESSAGE);
                    messageContent.message = stringFormat(messageContent.message, null);
                    const alertModel = {
                      messageContent: messageContent
                    };

                    return DialogFactory.messageAlertDialog(alertModel).then(() => {
                      if (vm.rfqassyId) {
                        $state.go($state.$current, { id: $stateParams.id, rfqAssyId: vm.rfqassyId }, { reload: true });
                      } else {
                        $state.go($state.$current, { id: $stateParams.id, rfqAssyId: null }, { reload: true });
                      }
                    }, () => {
                    }).catch((error) => BaseService.getErrorLog(error));
                  }
                }
                else {
                  _.each(vm.rfq.rfqAssembly, (item) => {
                    item.isBom = (item.componentAssembly && item.componentAssembly.rfqLineitems) ? item.componentAssembly.rfqLineitems.length > 0 ? true : false : false;

                    _.each(item.rfqAssyQuantity, (qty) => {
                      qty.deletedAssyQtyTurnTime = [];
                    });
                  });
                }
                vm.saveDisable = false;
              }).catch((error) => {
                vm.saveDisable = false;
                return BaseService.getErrorLog(error);
              });
            }
          }).catch(() => {
            vm.saveDisable = false;
            return;
          });
        } else {
          vm.cgBusyLoading = RFQFactory.saveRFQ().save(rfq).$promise.then((res) => {
            if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              if (res.data) {
                vm.rfqDetails.$setPristine();
                vm.isFormDirty = false;
                BaseService.currentPageFlagForm = [];
                if (vm.rfqassyId) {
                  $state.go($state.$current, { id: res.data.id, rfqAssyId: vm.rfqassyId }, { reload: true });
                } else {
                  $state.go($state.$current, { id: res.data.id, rfqAssyId: null }, { reload: true });
                }
              } else {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.RFQ_DELETE_MESSAGE);
                messageContent.message = stringFormat(messageContent.message, null);
                const alertModel = {
                  messageContent: messageContent
                };
                return DialogFactory.messageAlertDialog(alertModel).then(() => {
                  if (vm.rfqassyId) {
                    $state.go($state.$current, { id: $stateParams.id, rfqAssyId: vm.rfqassyId }, { reload: true });
                  } else {
                    $state.go($state.$current, { id: $stateParams.id, rfqAssyId: null }, { reload: true });
                  }
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }
            else {
              _.each(vm.rfq.rfqAssembly, (item) => {
                item.isBom = (item.componentAssembly && item.componentAssembly.rfqLineitems) ? item.componentAssembly.rfqLineitems.length > 0 ? true : false : false;

                _.each(item.rfqAssyQuantity, (qty) => {
                  qty.deletedAssyQtyTurnTime = [];
                });
              });
            }
            vm.saveDisable = false;
          }).catch((error) => {
            vm.saveDisable = false;
            return BaseService.getErrorLog(error);
          });
        }
      } else {
        vm.cgBusyLoading = RFQFactory.saveRFQ().save(rfq).$promise.then((res) => {
          if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.rfqDetails.$setPristine();
            vm.saveDisable = false;
            vm.isFormDirty = false;
            BaseService.currentPageFlagForm = [];
            $state.go($state.$current, { id: res.data.id, rfqAssyId: null }, { reload: true });
          }
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
    };

    // add new rfq assembly quantity turn-time
    vm.addAssyQtyTurnTime = (rfqAssy, rfqAssyQuantity, isDisable) => {
      if (isDisable) {
        return false;
      }
      const rfqAssyQty = {
        id: null,
        turnTime: null,
        unitOfTime: vm.unitOfTime.BUSINESS_DAY.VALUE,
        focus: true
      };

      const assy = _.find(vm.rfq.rfqAssembly, (a) => a === rfqAssy);

      const assyQty = _.find(assy.rfqAssyQuantity, (q) => q === rfqAssyQuantity);

      assyQty.rfqAssyQtyTurnTime.push(rfqAssyQty);
      vm.rfqDetails.$setDirty();
      vm.isFormDirty = true;
      BaseService.currentPageFlagForm = [vm.isFormDirty];
    };

    // remove selected rfq assembly quantity turntime
    vm.removeAssyQtyTurnTime = (rfqAssy, rfqAssyQty, rfqAssyQtyTurnTime, rfqform) => {
      if (!rfqAssyQtyTurnTime.rfqAssyQtyID) {
        const assy = _.find(vm.rfq.rfqAssembly, (a) => a === rfqAssy);

        const assyQty = _.find(assy.rfqAssyQuantity, (q) => q === rfqAssyQty);

        assyQty.rfqAssyQtyTurnTime.splice(assyQty.rfqAssyQtyTurnTime.indexOf(rfqAssyQtyTurnTime), 1);
      }
      else {
        const assy = _.find(vm.rfq.rfqAssembly, (a) => a === rfqAssy);

        const assyQty = _.find(assy.rfqAssyQuantity, (q) => q === rfqAssyQty);

        assyQty.deletedAssyQtyTurnTime.push(rfqAssyQtyTurnTime);
        assyQty.rfqAssyQtyTurnTime.splice(assyQty.rfqAssyQtyTurnTime.indexOf(rfqAssyQtyTurnTime), 1);
      }
      rfqform.$setDirty();
      vm.isFormDirty = true;
      BaseService.currentPageFlagForm = [vm.isFormDirty];
    };

    // validate rfq assembly quantity for not same quantity not allow in same assembly
    vm.rfqAssyQtyValidate = (rfq, generateQty) => {
      const qtyNotAvilableforAssy = [];
      const sameqtyAssyObj = _.filter(rfq.rfqAssembly, (objAssy) => {
        const availableQty = _.filter(objAssy.rfqAssyQuantity, (x) => !x.rfqPriceGroupId);
        if (availableQty.length > 0) {
          const sameQtyObj = _.filter(objAssy.rfqAssyQuantity, (objassyQty) => {
            if (!objassyQty.rfqPriceGroupId && !objassyQty.rfqPriceGroupDetailId) {
              const sameQtyObj1 = _.filter(objAssy.rfqAssyQuantity, (objassyQty1) => {
                if (!objassyQty1.rfqPriceGroupId && !objassyQty1.rfqPriceGroupDetailId && objAssy.rfqAssyQuantity.indexOf(objassyQty1) !== objAssy.rfqAssyQuantity.indexOf(objassyQty)) {
                  return parseInt(objassyQty.requestQty) === parseInt(objassyQty1.requestQty);
                }
              });
              if (sameQtyObj1.length > 0) {
                return true;
              }
            }
          });

          if (sameQtyObj.length > 0) {
            return true;
          }
        } else {
          qtyNotAvilableforAssy.push(objAssy);
        }
      });
      if (qtyNotAvilableforAssy.length > 0) {
        vm.saveDisable = false;
        showQtyRequireAlertPopup(qtyNotAvilableforAssy);
      } else {
        if (sameqtyAssyObj.length > 0) {
          const AssyTitle = sameqtyAssyObj[0].PIDCode + '|' + sameqtyAssyObj[0].rev;
          showConfirmationPopup(AssyTitle);
          vm.saveDisable = false;
        } else {
          if (!generateQty) {
            changeAssyQty(rfq);
          }
        }
      }
    };

    function showConfirmationPopup(AssyTitle) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.SAME_QUANTITY_EXISTS);
      messageContent.message = stringFormat(messageContent.message, AssyTitle);
      const alertModel = {
        messageContent: messageContent
      };
      DialogFactory.messageAlertDialog(alertModel);
    }

    function showQtyRequireAlertPopup(qtyNotAvilableforAssy) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.RFQ_ASSY_QTY_REQUIRED);
      const message = messageContent.message + '<br/><br/><table style="width:100%"><thead><tr><th class="border-bottom padding-5">#</th><th class="border-bottom padding-5">Assembly</th></tr></thead><tbody>{0}</tbody></table>';
      const subMessage = [];
      qtyNotAvilableforAssy.forEach((item) => {
        subMessage.push('<tr><td class="border-bottom padding-5">' + (qtyNotAvilableforAssy.indexOf(item) + 1) + '</td><td class="border-bottom padding-5">' + item.PIDCode + '</td></tr>');
      });

      messageContent.message = stringFormat(message, subMessage.join(''));
      const obj = {
        messageContent: messageContent
      };
      return DialogFactory.messageAlertDialog(obj);
    }

    // validate rfq assembly quantity for not same quantity not allow in same assembly
    vm.checkSameQty = (rfqAssyQtyArry, assyRequestQty, formobj, obj, objname, assyFormName) => {
      var form = formobj[assyFormName];
      var sameAssyQty = _.filter(rfqAssyQtyArry, (objqty) => parseInt(objqty.requestQty) === parseInt(assyRequestQty) && !objqty.rfqPriceGroupId && !objqty.rfqPriceGroupDetailId);
      if (sameAssyQty.length > 1) {
        let index = null;
        if (obj) {
          index = rfqAssyQtyArry.indexOf(obj);
        } else {
          index = rfqAssyQtyArry.indexOf(sameAssyQty[0]);
        }
        if (form[objname + index]) {
          form[objname + index].$setValidity('duplicate', false);
        }
        validateQty(rfqAssyQtyArry, formobj, objname, assyFormName);
      } else {
        if (obj) {
          const index = rfqAssyQtyArry.indexOf(obj);
          if (form[objname + index]) {
            form[objname + index].$setValidity('duplicate', true);
          }
          validateQty(rfqAssyQtyArry, formobj, objname, assyFormName);
        } else {
          _.each(sameAssyQty, (obj, i) => {
            if (form[objname + i]) {
              form[objname + i].$setValidity('duplicate', true);
            }
          });
          validateQty(rfqAssyQtyArry, formobj, objname, assyFormName);
        }
      }
    };

    // validate rfq assembly quantity for not same quantity not allow in same assembly
    function validateQty(rfqAssyQtyArry, formobj, objname, assyFormName) {
      var form = formobj[assyFormName];
      var sameAssyQty = _.filter(rfqAssyQtyArry, (objqty, i) => {
        if (!objqty.rfqPriceGroupId && !objqty.rfqPriceGroupDetailId) {
          const sameAssyQty1 = _.filter(rfqAssyQtyArry, (objqty1, j) => {
            if (!objqty1.rfqPriceGroupId && !objqty1.rfqPriceGroupDetailId) {
              if (j !== i) {
                return objqty1.requestQty === objqty.requestQty;
              }
            }
          });
          if (sameAssyQty1.length > 0) {
            return true;
          }
        }
      });
      if (sameAssyQty.length > 1) {
        _.each(rfqAssyQtyArry, (obj, i) => {
          var qtyobjIndex = sameAssyQty.indexOf(obj);
          if (qtyobjIndex !== -1 && form[objname + i]) {
            form[objname + i].$setValidity('duplicate', false);
          } else if (form[objname + i]) {
            form[objname + i].$setValidity('duplicate', true);
          }
        });
      } else {
        _.each(rfqAssyQtyArry, (obj, i) => {
          if (form[objname + i]) {
            form[objname + i].$setValidity('duplicate', true);
          }
        });
      }
    }

    // on change repeat switch null expected quantity and frequency
    vm.repeatChange = (rfqAssy) => {
      rfqAssy.proposedBuildQty = rfqAssy.eau = rfqAssy.timePeriod = rfqAssy.noOfBuild = null;
    };

    // validate rfq assembly quantity for not same quantity not allow in same assembly
    function changeAssyQty(rfq) {
      var ischange = false;
      var assyArray = [];
      _.each(rfq.rfqAssembly, (rfqAssy) => {
        if (rfqAssy.isReadyForPricing) {
          _.each(rfqAssy.rfqAssyQuantity, (assyQty) => {
            if (assyQty.oldrequestQty) {
              if (assyQty.oldrequestQty !== assyQty.requestQty) {
                ischange = true;
                const obj = {
                  PIDCode: rfqAssy.PIDCode,
                  AssyRev: rfqAssy.rev,
                  oldQty: assyQty.oldrequestQty,
                  newQty: assyQty.requestQty
                };
                assyArray.push(obj);
              }
            }
          });
        }
      });
      if (ischange) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.PRICING_REMOVE_ON_QTY_CHANGE);
        const message = messageContent.message + '<br/><br/><table style="width:100%"><thead><tr><th class="border-bottom padding-5">#</th><th class="border-bottom padding-5">Assembly</th> <th class="border-bottom padding-5 text-center">New Qty</th> <th class="border-bottom padding-5 text-center">Old Qty</th></tr></thead><tbody>{0}</tbody></table>';
        const subMessage = [];
        assyArray.forEach((item) => {
          subMessage.push('<tr><td class="border-bottom padding-5">' + (assyArray.indexOf(item) + 1) + '</td><td class="border-bottom padding-5">' + item.PIDCode + '</td><td class="border-bottom padding-5 text-right padding-right-30">' + item.newQty + '</td><td class="border-bottom padding-5 text-right padding-right-30">' + item.oldQty + '</td></tr>');
        });

        messageContent.message = stringFormat(message, subMessage.join(''));
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        return DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.saveRFQ(rfq);
          }
        }).catch(() => {
          vm.saveDisable = false;
          return;
        });
      } else {
        vm.saveRFQ(rfq);
      }
    }

    // open pop up and add new rfq assembly standard class
    vm.addStandardClass = (ev, rfqAssy, index, rfqform, partid, isDisable) => {
      if (isDisable) {
        return;
      }
      vm.disableStandardButton = true;
      const obj = {
        //rfqAssyIndex: rfqAssy.PIDCode && rfqAssy.rev ? (rfqAssy.PIDCode + "|" + rfqAssy.rev) : ("Assembly #" + (index + 1)),
        rfqAssyId: rfqAssy.id,
        selectedClassList: rfqAssy.rfqAssyStandardClass,
        cid: partid,
        rfqFormsID: vm.rfq ? vm.rfq.id : null,
        applyFromRFQPage: true
      };
      DialogFactory.dialogService(
        RFQTRANSACTION.RFQ_ASSEMBLY_STANDARD_CLASS_CONTROLLER,
        RFQTRANSACTION.RFQ_ASSEMBLY_STANDARD_CLASS_VIEW,
        ev,
        obj).then((result) => {
          result.standardList.sort(sortAlphabatically('priority', 'standard', true));
          rfqform.$setDirty();
          getComponentStandard(partid, rfqAssy);
          vm.disableStandardButton = false;
          vm.isFormDirty = true;
          BaseService.currentPageFlagForm = [vm.isFormDirty];
        }, (err) => {
          vm.disableStandardButton = false;
          return BaseService.getErrorLog(err);
        });
    };

    // for generate bulk assembly quantity
    vm.generatequentity = (rfqassy) => {
      if (rfqassy.rfqAssyQuantity.length === 1) {
        if (!rfqassy.rfqAssyQuantity[0].requestQty) {
          rfqassy.rfqAssyQuantity = [];
        }
      }
      const GeneratedQuentity = rfqassy.GeneratedQuentity.split(',');
      const GeneratedTurnTime = rfqassy.GeneratedTurnTime.split(',');
      const GeneratedUnitOfTime = rfqassy.GeneratedUnitOfTime;
      const GeneratedQtyType = rfqassy.GeneratedQtyType || vm.QtytypeOptions[1].value;
      _.each(GeneratedQuentity, (qty) => {
        const obj = {
          requestQty: parseInt(qty),
          quantityType: GeneratedQtyType,
          rfqAssyQtyTurnTime: []
        };
        _.each(GeneratedTurnTime, (turntime) => {
          const objTurnTime = {};
          objTurnTime.turnTime = parseInt(turntime);
          objTurnTime.unitOfTime = GeneratedUnitOfTime;
          obj.rfqAssyQtyTurnTime.push(objTurnTime);
        });
        rfqassy.rfqAssyQuantity.push(obj);
      });
      rfqassy.GeneratedQuentity = null;
      rfqassy.GeneratedTurnTime = null;
      rfqassy.GeneratedUnitOfTime = null;
      rfqassy.GeneratedQtyType = vm.QtytypeOptions[1].value;
      vm.rfqAssyQtyValidate(vm.rfq, true);
      rfqassy.generateCombination = false;
      vm.rfqDetails.$setDirty();
      vm.isFormDirty = true;
      BaseService.currentPageFlagForm = [vm.isFormDirty];
    };

    // logic for add proposed build quantity, no Of Build, and eau
    vm.qtyChange = (rfqassy, field) => {
      let BuildDuration = null;
      if (rfqassy.timePeriod === vm.unitOfTime.DAYLY.VALUE) {
        BuildDuration = vm.unitOfTime.DAYLY.DURATION;
      } else if (rfqassy.timePeriod === vm.unitOfTime.WEEKLY.VALUE) {
        BuildDuration = vm.unitOfTime.WEEKLY.DURATION;
      } else if (rfqassy.timePeriod === vm.unitOfTime.MONTHLY.VALUE) {
        BuildDuration = vm.unitOfTime.MONTHLY.DURATION;
      } else if (rfqassy.timePeriod === vm.unitOfTime.QUARTERLY.VALUE) {
        BuildDuration = vm.unitOfTime.QUARTERLY.DURATION;
      } else {
        BuildDuration = vm.unitOfTime.YEARLY.DURATION;
      }
      if (field === 'eau') {
        if (rfqassy.proposedBuildQty && rfqassy.eau && !rfqassy.noOfBuild) {
          rfqassy.noOfBuild = Math.ceil(rfqassy.eau / (rfqassy.proposedBuildQty * BuildDuration));
        } else if (!rfqassy.proposedBuildQty && rfqassy.eau && rfqassy.noOfBuild) {
          rfqassy.proposedBuildQty = Math.ceil(Math.ceil(rfqassy.eau / rfqassy.noOfBuild) / BuildDuration);
        } else if (rfqassy.proposedBuildQty && rfqassy.eau && rfqassy.noOfBuild) {
          if (rfqassy.eau > rfqassy.noOfBuild) {
            rfqassy.proposedBuildQty = Math.ceil(Math.ceil(rfqassy.eau / rfqassy.noOfBuild) / BuildDuration);
          } else {
            rfqassy.proposedBuildQty = rfqassy.eau / BuildDuration;
            rfqassy.noOfBuild = 1;
          }
        }
      } else if (field === 'noOfBuild') {
        if (rfqassy.proposedBuildQty && !rfqassy.eau && rfqassy.noOfBuild) {
          rfqassy.eau = Math.ceil((rfqassy.proposedBuildQty * BuildDuration) * rfqassy.noOfBuild);
        } else if (!rfqassy.proposedBuildQty && rfqassy.eau && rfqassy.noOfBuild) {
          rfqassy.proposedBuildQty = Math.ceil(Math.ceil(rfqassy.eau / rfqassy.noOfBuild) / BuildDuration);
        } else if (rfqassy.proposedBuildQty && rfqassy.eau && rfqassy.noOfBuild) {
          rfqassy.eau = Math.ceil((rfqassy.proposedBuildQty * BuildDuration) * rfqassy.noOfBuild);
        }
      } else if (field === 'proposedBuildQty') {
        if (rfqassy.proposedBuildQty && !rfqassy.eau && rfqassy.noOfBuild) {
          rfqassy.eau = Math.ceil((rfqassy.proposedBuildQty * BuildDuration) * rfqassy.noOfBuild);
        } else if (rfqassy.proposedBuildQty && rfqassy.eau && !rfqassy.noOfBuild) {
          rfqassy.noOfBuild = Math.ceil(rfqassy.eau / (rfqassy.proposedBuildQty * BuildDuration));
        } else if (rfqassy.proposedBuildQty && rfqassy.eau && rfqassy.noOfBuild) {
          rfqassy.eau = Math.ceil((rfqassy.proposedBuildQty * BuildDuration) * rfqassy.noOfBuild);
        }
      }
      else if (field === 'timeperiod') {
        rfqassy.eau = Math.ceil((rfqassy.proposedBuildQty * BuildDuration) * rfqassy.noOfBuild);
      }
    };

    // to open additional requirement popup
    vm.OpenTemplateList = (rfqAssy, form, event) => {
      if (!btnclick) {
        btnclick++;
        if (!rfqAssy.isSummaryComplete) {
          const obj = {};
          obj.isAssy = true;
          DialogFactory.dialogService(
            RFQTRANSACTION.ADDITIONAL_REQUIREMENT_SELECT_POPUP_CONTROLLER,
            RFQTRANSACTION.ADDITIONAL_REQUIREMENT_SELECT_POPUP_VIEW,
            null,
            obj).then(() => {
              btnclick = 0;
            }, (data) => {
              if (data) {
                const string1 = '<ul><li>';
                const string2 = '</li><li>';
                const string3 = '</li></ul>';
                const req = rfqAssy.additionalRequirement ? rfqAssy.additionalRequirement.replace(string3, '') : null;
                data = data ? data.replace(string1, '') : null;
                const str = (req ? req + string2 : string1) + data;
                rfqAssy.additionalRequirement = str;
                form.$setDirty();
                vm.isFormDirty = true;
                BaseService.currentPageFlagForm = [vm.isFormDirty];
              }
              btnclick = 0;
            }, () => {
              btnclick = 0;
            });
        }
      } else {
        event.preventDefault();
      }
    };

    //Check for Duplicate assembly in RFQ
    function checksameassy(item, data) {
      var assy = _.filter(vm.rfq.rfqAssembly, (rfqassy) => parseInt(rfqassy.partID) === parseInt(item.id || 0));

      if (assy.length > 1) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.SAME_ASSY_EXISTS);
        messageContent.message = stringFormat(messageContent.message, item.PIDCode);
        const alertModel = {
          messageContent: messageContent
        };

        DialogFactory.messageAlertDialog(alertModel).then(() => {
          if (data) {
            data.partID = null;
            data.PIDCode = null;
            data.rev = null;
            data.assemblyDescription = null;
            data.RoHSStatusID = null;
            data.RoHSIcon = CORE.WEB_URL + USER.ROHS_BASE_PATH + CORE.NO_IMAGE_ROHS;
            data.assyCode = null;
            data.nickName = null;
            data.specialNote = null;
            data.rohsName = null;
            data.rfqAssyStandardClass = [];
            data.currentVersion = null;
            data.mfgPN = null;
            data.selectedFunctionalTypeParts = [];
            data.selectedMountingTypeParts = [];
            data.businessRisk = null;
            data.autoCompleteAssy.keyColumnId = null;
          }
          return true;
        });
      } else {
        if (data) {
          getComponentStandard(item.id, data);
          getFunctionalTypePartList(item.id, data);
          getMountingTypePartList(item.id, data);
        }
      }
    }
    let btnclick = 0;
    // to open Quote additional requirement popup
    vm.OpenQuoteTemplateList = (rfq, form, event) => {
      if (!btnclick) {
        btnclick++;
        const obj = {};
        obj.isQuote = true;
        DialogFactory.dialogService(
          RFQTRANSACTION.ADDITIONAL_REQUIREMENT_SELECT_POPUP_CONTROLLER,
          RFQTRANSACTION.ADDITIONAL_REQUIREMENT_SELECT_POPUP_VIEW,
          event,
          obj).then(() => {
            btnclick = 0;
          }, (data) => {
            if (data) {
              const string1 = '<ul><li>';
              const string2 = '</li><li>';
              const string3 = '</li></ul>';
              const req = rfq.quoteNote ? rfq.quoteNote.replace(string3, '') : null;
              data = data ? data.replace(string1, '') : null;
              const str = (req ? req + string2 : string1) + data;
              rfq.quoteNote = str;
              form.$setDirty();
              vm.isFormDirty = true;
              BaseService.currentPageFlagForm = [vm.isFormDirty];
            }
            btnclick = 0;
          }, () => {
            btnclick = 0;
          });
      } else {
        event.preventDefault();
      }
    };
    vm.htmlToPlaintext = (text) => text ? String(text).replace(/<[^>]+>/gm, '') : '';

    vm.getMaxLengthValidation = (maxLength, enterTextLength, editorText) => {
      if (editorText) {
        vm.entertext = vm.htmlToPlaintext(editorText);
        return BaseService.getDescrLengthValidation(maxLength, vm.entertext.length);
      } else {
        return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
      }
    };
    // add require functional type
    vm.openFunctionalTypePartPopup = (ev, rfqAssy, index, rfqform, partid, isDisable) => {
      if (isDisable) {
        return false;
      }
      vm.disableFunctionaltypeButton = true;
      const data = [];
      data.SelectedValues = angular.copy(rfqAssy.selectedFunctionalTypeParts);
      data.isFunctionalType = true;
      data.mfgPN = rfqAssy.mfgPN;
      data.partID = partid;
      data.PIDCode = rfqAssy.PIDCode;
      data.RoHSStatusID = rfqAssy.RoHSStatusID;
      data.RoHSIcon = rfqAssy.RoHSIcon;
      data.rohsName = rfqAssy.rohsName;
      data.customer = vm.customer;
      data.customerID = vm.autoCompleteCustomer.keyColumnId;

      DialogFactory.dialogService(
        USER.REQUIRE_ATTRIBUTE_SELECT_POPUP_CONTROLLER,
        USER.REQUIRE_ATTRIBUTE_SELECT_POPUP_VIEW, null, data).then((result) => {
          // if no any changes in mounting type then no need to call this api for save
          if (result) {
            const cobj = {
              refComponentID: partid,
              list: result
            };
            vm.cgBusyLoading = ComponentFactory.saveFunctionalTypePart().query({ componentObj: cobj }).$promise.then((res) => {
              if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                $timeout(() => {
                  getFunctionalTypePartList(partid, rfqAssy);
                }, 200);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
          vm.disableFunctionaltypeButton = false;
        }, () => {
          getFunctionalTypePartList(partid, rfqAssy);
          vm.disableFunctionaltypeButton = false;
        }, (err) => {
          vm.disableFunctionaltypeButton = false;
          return BaseService.getErrorLog(err);
        });
    };

    vm.fileList = {};

    // on main tab change
    vm.onMainTabChanges = (TabName, msWizard) => {
      //vm.selectedIndex = msWizard.selectedIndex;
      if (TabName === vm.OtherDetailTabName) {
        vm.IsOtherDetailTab = true;
        vm.IsDetailTab = false;
        BaseService.currentPageForms = [vm.wizardOtherDetail];
      }
      else {
        vm.IsOtherDetailTab = false;
        vm.IsDetailTab = true;
        BaseService.currentPageForms = [vm.rfqDetails];
      }

      msWizard.selectedIndex = vm.selectedTabIndex;

      $('#content').animate({ scrollTop: 0 }, 200);
    };

    /* Show save alert popup when performing tab change*/
    function showWithoutSavingAlertforTabChange(step) {
      var messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messgaeContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.isSave = false;
          switch (step) {
            case 0:
              vm.rfqDetails.$setPristine();
              vm.isFormDirty = false;
              getRfqDetails();
              return true;
            case 1:
              vm.wizardOtherDetail.$setPristine();
              return true;
          }
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.isStepValid = function (step) {
      var isDirty = false;
      switch (step) {
        case 0: {
          isDirty = (vm.rfqDetails && vm.rfqDetails.$dirty) || vm.isFormDirty;
          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step);
          } else {
            return true;
          }
        }
        case 1: {
          isDirty = vm.wizardOtherDetail && vm.wizardOtherDetail.$dirty;
          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step);
          } else {
            return true;
          }
        }
      }
    };

    // on save check current step form then call save method based on tab
    vm.CheckStepAndAction = (msWizard, isSave) => {
      const checkAssy = _.find(vm.rfq.rfqAssembly, (assy) => assy.id === parseInt(vm.rfqassyId || 0));
      if (checkAssy && checkAssy.isSummaryComplete) {
        return false;
      }
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(msWizard.currentStepForm(), vm.isFormDirty)) {// || !msWizard.currentStepForm().$dirty) {
        vm.saveDisable = false;
        return;
      }
      msWizard.selectedIndex = vm.selectedTabIndex;
      vm.issave = isSave;
      /* Detail tab */
      if (msWizard.selectedIndex === 0) {
        vm.rfqAssyQtyValidate(vm.rfq);
      }
      /* Miscellaneous */
      else if (msWizard.selectedIndex === 1) {
        if (!vm.issave) {
          const isChanged = BaseService.checkFormDirty(vm.wizardOtherDetail, null);
          vm.showWithoutSavingAlertforNextPrevious(msWizard, false, isChanged, false);
          return;
        }
        else {
          vm.finish();
          return;
        }
      }
    };

    vm.finish = () => {
      const dynamicControlList = DataElementTransactionValueFactory.getDataElementTransactionList(vm.dataElementList);
      DataElementTransactionValueFactory.saveTransctionValue({
        referenceTransID: vm.rfq.id,
        entityID: vm.entityID,
        dataElementList: dynamicControlList.dataElementList,
        removeElementList: dynamicControlList.removeElementList,
        subFormTransList: dynamicControlList.subFormTransList,
        deletedsubFormTransIDs: dynamicControlList.deletedsubFormTransIDs,
        removeSubFormTransListConditional: dynamicControlList.removeSubFormTransListConditional
      }, vm.fileList).then(() => {
        // commented as per last discussion on 18/09/2018, no need to move to list will press back button
        //goToSelectedTab();
        vm.wizardOtherDetail.$setPristine();
        // Display success message of each field if assigned on validation options
        DataElementTransactionValueFactory.displaySuccessMessage(dynamicControlList.dataElementList);

        /* code for rebinding document to download - (actually all other details) */
        //if (vm.fileList && !_.isEmpty(vm.fileList)) {
        vm.IsOtherDetailTab = false;
        vm.saveDisable = false;
        vm.fileList = {};
        $timeout(() => {
          vm.IsOtherDetailTab = true;
        }, 0);
        //}
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    };

    /* Show save alert popup when performing next and previous*/
    vm.showWithoutSavingAlertforNextPrevious = (msWizard, isSave, isChanged) => {
      if (!msWizard) {
        msWizard = vm.mvizard;
      }
      if (!isSave) {
        isSave = vm.issave;
      }
      // let selectedIndex = msWizard.selectedIndex;
      if (isSave && isChanged) {
        vm.saveDisable = false;
        return;
      }
      else if (isSave && !isChanged) {
        vm.saveDisable = false;
        return;
      }
      else {
        if (isChanged) {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.isSave = false;
              vm.wizardOtherDetail.$setPristine();
              vm.rfqDetails.$setPristine();
            }
            vm.saveDisable = false;
          }, () => {
            vm.saveDisable = false;
          }).catch((error) => {
            vm.saveDisable = false;
            return BaseService.getErrorLog(error);
          });
        }
      }
    };

    vm.checkFormDirty = (msWizardform) => {
      const result = BaseService.checkFormDirty(msWizardform, null);
      return result;
    };

    // add require mounting type
    vm.openMountingTypePartPopup = (ev, rfqAssy, index, rfqform, partid, isDisable) => {
      if (isDisable) {
        return false;
      }
      vm.disableMountingtypeButton = true;
      const data = [];
      data.SelectedValues = angular.copy(rfqAssy.selectedMountingTypeParts);
      data.isMountingType = true;
      data.partID = partid;
      data.mfgPN = rfqAssy.mfgPN;
      data.PIDCode = rfqAssy.PIDCode;
      data.RoHSStatusID = rfqAssy.RoHSStatusID;
      data.RoHSIcon = rfqAssy.RoHSIcon;
      data.rohsName = rfqAssy.rohsName;
      data.customer = vm.customer;
      data.customerID = vm.autoCompleteCustomer.keyColumnId;

      DialogFactory.dialogService(
        USER.REQUIRE_ATTRIBUTE_SELECT_POPUP_CONTROLLER,
        USER.REQUIRE_ATTRIBUTE_SELECT_POPUP_VIEW, null, data).then((result) => {
          // if no any changes in mountingtype then no need to call this api for save
          if (result) {
            const cobj = {
              refComponentID: partid,
              list: result
            };
            vm.cgBusyLoading = ComponentFactory.saveMountingTypePart().query({ componentObj: cobj }).$promise.then((res) => {
              if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                $timeout(() => {
                  getMountingTypePartList(partid, rfqAssy);
                }, 200);
              }
            }).catch((error) => {
              vm.disableMountingtypeButton = false;
              return BaseService.getErrorLog(error);
            });
          }
          vm.disableMountingtypeButton = false;
        }, () => {
          vm.disableMountingtypeButton = false;
          getMountingTypePartList(partid, rfqAssy);
        }, (err) => {
          vm.disableMountingtypeButton = false;
          return BaseService.getErrorLog(err);
        });
    };
    // add/update Misc Build
    vm.AddMiscBuild = (ev, rfqAssy, form) => {
      vm.disabledMiscBuild = true;
      const data = {
        rfqAssyMiscBuild: angular.copy(rfqAssy.rfqAssyMiscBuild)
      };
      DialogFactory.dialogService(
        RFQTRANSACTION.ADD_RFQ_MISC_BUILD_POPUP_CONTROLLER,
        RFQTRANSACTION.ADD_RFQ_MISC_BUILD_POPUP_VIEW, null, data).then((result) => {
          vm.disabledMiscBuild = false;
          form.$setDirty();
          vm.isFormDirty = true;
          BaseService.currentPageFlagForm = [vm.isFormDirty];
          rfqAssy.rfqAssyMiscBuild = _.filter(result, (item) => item.proposedBuildQty && item.noOfBuild);
        }, () => {
          vm.disabledMiscBuild = false;
        }, (err) => {
          vm.disabledMiscBuild = false;
          return BaseService.getErrorLog(err);
        });
    };

    // Add Price Group Detail
    vm.AddPriceGroup = (ev, rfq, rfqPriceGroup, form, index) => {
      if (vm.disabledPriceGroup || !vm.rfq.id) {
        return false;
      }
      vm.disabledPriceGroup = true;
      const objdata = {
        rfq: rfq,
        rfqPriceGroup: rfqPriceGroup,
        pgIndex: index
      };
      DialogFactory.dialogService(
        RFQTRANSACTION.ADD_RFQ_PRICE_GROUP_POPUP_CONTROLLER,
        RFQTRANSACTION.ADD_RFQ_PRICE_GROUP_POPUP_VIEW, ev, objdata).then((resPriceGroup) => {
          if (rfqPriceGroup) {
            const objrfqPricegroup = _.find(rfq.rfqPriceGroup, (obj, i) => {
              if (rfqPriceGroup.id) {
                if (obj.id === rfqPriceGroup.id) {
                  return true;
                } else if (obj.name === rfqPriceGroup.name) {
                  return true;
                }
              } else if (i === index) {
                return true;
              }
            });
            if (objrfqPricegroup) {
              objrfqPricegroup.name = resPriceGroup.name;
              objrfqPricegroup.rfqPriceGroupDetail = resPriceGroup.rfqPriceGroupDetail;
            }
          } else {
            rfq.rfqPriceGroup.push(resPriceGroup);
          }
          vm.disabledPriceGroup = false;
          form.$setDirty();
          vm.PriceGroupChange = true;
          vm.isFormDirty = true;
          BaseService.currentPageFlagForm = [vm.isFormDirty];
        }, () => {
          vm.disabledPriceGroup = false;
        }, (err) => {
          vm.disabledPriceGroup = false;
          return BaseService.getErrorLog(err);
        });
    };

    // remove Price Group
    vm.removePriceGroup = (priceGroupObj, i, form) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.RFQ_PRICE_GROUP_REMOVE_MSG);
      const obj = {
        messageContent: messageContent,
        btnText: RFQTRANSACTION.RFQ.CONFIRM_DELETE_BUTTON,
        canbtnText: RFQTRANSACTION.RFQ.CONFIRM_CANCLE_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then(() => {
        vm.rfq.deletedrfqPriceGroup.push(priceGroupObj);
        vm.rfq.rfqPriceGroup.splice(i, 1);
        form.$setDirty();
        vm.PriceGroupChange = true;
        vm.isFormDirty = true;
        BaseService.currentPageFlagForm = [vm.isFormDirty];
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // For Show Price group in matrix view
    vm.ShowPriceGroupMatrixView = (ev, isDisable) => {
      if (isDisable) {
        return false;
      }
      vm.isMatrixView = true;
      DialogFactory.dialogService(
        RFQTRANSACTION.RFQ_PRICE_GROUP_MATRIX_VIEW_POPUP_CONTROLLER,
        RFQTRANSACTION.RFQ_PRICE_GROUP_MATRIX_VIEW_POPUP_VIEW, ev, vm.rfq.rfqPriceGroup).then(() => {
        }, () => {
          vm.isMatrixView = false;
        }, (err) => {
          vm.isMatrixView = false;
          return BaseService.getErrorLog(err);
        });
    };
    //  Export Price Group detail
    vm.ExportRFQPriceGroup = (rfqID, isExportTemplate) => {
      if (!vm.rfq.id) {
        return false;
      }
      if (vm.rfqDetails.$dirty || vm.isFormDirty) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.IMPORT_PRICE_GROUP_WITHOUT_SAVING_ALERT_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'export', isExportTemplate ? 'template' : 'detail');
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
      else {
        let messageContent = {};
        const Params = { prfqID: rfqID, pisExportTemplate: isExportTemplate };
        vm.cgBusyLoading = RFQFactory.downloadRFQPriceGroupTemplate(Params).then((response) => {
          if (response.status === 404) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
            DialogFactory.messageAlertDialog({ messageContent: messageContent, multiple: true });
          } else if (response.status === 403) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
            DialogFactory.messageAlertDialog({ messageContent: messageContent, multiple: true });
          } else if (response.status === 401) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
            DialogFactory.messageAlertDialog({ messageContent: messageContent, multiple: true });
          }
          else {
            const filename = stringFormat(CORE.ExportFormat, vm.customer, vm.rfq.id, 'RFQ Price Group ' + isExportTemplate ? 'Template' : 'Detail', $filter('date')(new Date(), CORE.ExportDateFormat));
            const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
            const link = document.createElement('a');
            if (link.download !== undefined) {
              const url = URL.createObjectURL(blob);
              link.setAttribute('href', url);
              link.setAttribute('download', filename);
              link.style = 'visibility:hidden';
              document.body.appendChild(link);
              $timeout(() => {
                link.click();
                document.body.removeChild(link);
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    // Import PriceGroup data
    vm.importPriceGroup = (event) => {
      if (!vm.rfq.id) {
        return false;
      }
      if (vm.rfqDetails.$dirty || vm.isFormDirty) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.IMPORT_PRICE_GROUP_WITHOUT_SAVING_ALERT_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'import', 'detail');
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
      else {
        vm.event = event;
        angular.element('#fiexcel').trigger('click');
      }
    };
    // set Excel reader call back for imported price group
    vm.eroOptions = {
      workstart: function () {
      },
      workend: function () { },
      sheet: function (json, sheetnames, select_sheet_cb, files) {
        var type = files.name.split('.');
        if (_.find(CORE.UPLOAD_DOCUMENT_TYPE, (docType) => docType === type[type.length - 1])) {
          generateModel(json);
        } else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_TYPE_NOT_ALLOWED);
          messageContent.message = stringFormat(messageContent.message, (CORE.UPLOAD_DOCUMENT_TYPE).join());
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        }
      },
      badfile: function () {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_UPLOAD_FAIL_TEXT);
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      },
      pending: function () {
      },
      failed: function () {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_TYPE_NOT_ALLOWED);
        messageContent.message = stringFormat(messageContent.message, (CORE.UPLOAD_DOCUMENT_TYPE).join());
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      },
      large: function () {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_UPLOAD_FAIL_SIZE_TEXT);
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      },
      multiplefile: function () {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SINGLE_FILE_UPLOAD);
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };
    //generate model
    function generateModel(json) {
      var header = json[0];
      var dataList = [];
      if (header.length > 0) {
        let wrongData = false;
        _.each(json, (data, index) => {
          if (index > 0) {
            let i = 0;
            const pObj = {};
            _.each(data, (pricedata) => {
              if (header[i]) {
                pObj[header[i]] = pricedata;
              }
              i++;
            });

            dataList.push(pObj);
          }
          else {
            _.each(data, (headerData, j) => {
              switch (headerData) {
                case RFQTRANSACTION.ExportPriceGroupHeader.PriceGroup.Header:
                  header[j] = RFQTRANSACTION.ExportPriceGroupHeader.PriceGroup.Field;
                  break;
                case RFQTRANSACTION.ExportPriceGroupHeader.AssyID.Header:
                  header[j] = RFQTRANSACTION.ExportPriceGroupHeader.AssyID.Field;
                  break;
                case RFQTRANSACTION.ExportPriceGroupHeader.Qty.Header:
                  header[j] = RFQTRANSACTION.ExportPriceGroupHeader.Qty.Field;
                  break;
                case RFQTRANSACTION.ExportPriceGroupHeader.TurnTime.Header:
                  header[j] = RFQTRANSACTION.ExportPriceGroupHeader.TurnTime.Field;
                  break;
                case RFQTRANSACTION.ExportPriceGroupHeader.UnitOfTime.Header:
                  header[j] = RFQTRANSACTION.ExportPriceGroupHeader.UnitOfTime.Field;
                  break;
                default:
                  wrongData = true;
                  break;
              };
            });
          }
        });
        if (wrongData) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.INVALID_FILE_DATA);
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
        } else {
          RenderPriceGroup(dataList);
        }
      }
    }
    // Map Imported Price group data with Existing rfq Assembly
    function RenderPriceGroup(dataList) {
      const AssyNotAvaiLable = [];
      let WrongData = false;
      _.each(dataList, (objData) => {
        if (_.isNaN(parseInt(objData.qty)) || (parseInt(objData.qty) <= 0)) {
          WrongData = true;
          return;
        }
        if (!new RegExp(CORE.TurnTimeStringPattern).test(objData.turnTime) || !objData.turnTime) {
          WrongData = true;
          return;
        }
        if (!objData.name || objData.name.length > 50) {
          WrongData = true;
          return;
        }
        if (objData.qty.toString().length > 9) {
          WrongData = true;
          return;
        }
        const rfqAssyObj = _.find(vm.rfq.rfqAssembly, (objassy) => objassy.PIDCode === objData.PIDCode && objassy.id);
        if (rfqAssyObj) {
          objData.rfqAssyID = rfqAssyObj.id;
          objData.refRFQID = rfqAssyObj.rfqrefID;
          objData.RoHSIcon = rfqAssyObj.RoHSIcon;
          objData.rohsName = rfqAssyObj.rohsName;
          objData.partID = rfqAssyObj.partID;

          switch (objData.unitOfTime) {
            case vm.unitOfTime.BUSINESS_DAY.TYPE:
              objData.unitOfTime = vm.unitOfTime.BUSINESS_DAY.VALUE;
              break;
            case vm.unitOfTime.WEEK.TYPE:
              objData.unitOfTime = vm.unitOfTime.WEEK.VALUE;
              break;
            case vm.unitOfTime.WEEK_DAY.TYPE:
              objData.unitOfTime = vm.unitOfTime.WEEK_DAY.VALUE;
              break;
            default:
              objData.unitOfTime = vm.unitOfTime.BUSINESS_DAY.VALUE;
              break;
          }
        } else {
          AssyNotAvaiLable.push(objData);
        }
      });
      if (WrongData) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.INVALID_FILE_DATA);
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      } else if (AssyNotAvaiLable.length > 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.RFQ_ASSY_DOES_NOT_EXISTS);
        const message = messageContent.message + '<br/><br/><table style="width:100%"><thead><tr><th class="border-bottom padding-5">#</th><th class="border-bottom padding-5">Price Group</th><th class="border-bottom padding-5">' + vm.lebelConstant.Assembly.ID + '</th></tr></thead><tbody>{0}</tbody></table>';
        const subMessage = [];
        AssyNotAvaiLable.forEach((item) => {
          subMessage.push('<tr><td class="border-bottom padding-5">' + (AssyNotAvaiLable.indexOf(item) + 1) + '</td><td class="border-bottom padding-5">' + item.name + '</td><td class="border-bottom padding-5">' + item.PIDCode + '</td></tr>');
        });
        messageContent.message = stringFormat(message, subMessage.join(''));
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      } else {
        vm.PriceGroupMatrix = _.chain(dataList).groupBy('name').map((value) => {
          var pgDeail = _.first(value) || {};
          return {
            rfqPriceGroupDetail: value,
            name: pgDeail.name.toString(),
            refRFQID: pgDeail.refRFQID
          };
        }).value();
        const duplicatePriceGrouparry = [];
        const duplicateAssemblyInSamePriceGrouparry = [];
        _.each(vm.PriceGroupMatrix, (objPG) => {
          const duplicatePriceGroup = _.find(vm.rfq.rfqPriceGroup, (objrPG) => objrPG.name.trim() === objPG.name.trim());
          if (duplicatePriceGroup) {
            duplicatePriceGrouparry.push(duplicatePriceGroup);
          }
          _.each(objPG.rfqPriceGroupDetail, (objPGAssy, i) => {
            const duplicatePGAssy = _.find(objPG.rfqPriceGroupDetail, (objDupAssy, j) => i !== j && objPGAssy.rfqAssyID === objDupAssy.rfqAssyID);
            if (duplicatePGAssy) {
              duplicateAssemblyInSamePriceGrouparry.push(duplicatePGAssy);
            }
          });
        });
        if (duplicatePriceGrouparry.length > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.RFQ_PRICE_GROUP_ALREADY_EXISTS);
          const message = messageContent.message + '<br/><br/><table style="width:100%"><thead><tr><th class="border-bottom padding-5">#</th><th class="border-bottom padding-5">Price Group</th></tr></thead><tbody>{0}</tbody></table>';
          const subMessage = [];
          duplicatePriceGrouparry.forEach((item) => {
            subMessage.push('<tr><td class="border-bottom padding-5">' + (duplicatePriceGrouparry.indexOf(item) + 1) + '</td><td class="border-bottom padding-5">' + item.name + '</td></tr>');
          });
          messageContent.message = stringFormat(message, subMessage.join(''));
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
        } else if (duplicateAssemblyInSamePriceGrouparry.length > 0) {
          const duplicateAssyInPG = _.chain(duplicateAssemblyInSamePriceGrouparry).groupBy('name').map((value) => {
            var pgDeail = _.first(value) || {};
            return {
              rfqAssy: _.map(_.uniqBy(value, 'PIDCode'), 'PIDCode').join('<br/>'),
              name: pgDeail.name.toString()
            };
          }).value();

          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.SIMILAR_ASSY_IN_PRICE_GROUP_IMPORTED);
          const message = messageContent.message + '<br/><br/><table style="width:100%"><thead><tr><th class="border-bottom padding-5">#</th><th class="border-bottom padding-5">Price Group</th><th class="border-bottom padding-5">Assy ID</th></tr></thead><tbody>{0}</tbody></table>';
          const subMessage = [];
          duplicateAssyInPG.forEach((item) => {
            subMessage.push('<tr><td class="border-bottom padding-5">' + (duplicateAssyInPG.indexOf(item) + 1) + '</td><td class="border-bottom padding-5">' + item.name + '</td><td class="border-bottom padding-5" >' + item.rfqAssy + '</td></tr>');
          });
          messageContent.message = stringFormat(message, subMessage.join(''));
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
        } else {
          _.each(vm.PriceGroupMatrix, (pgObj) => {
            _.each(vm.rfq.rfqAssembly, (assyObj) => {
              if (assyObj.id) {
                const pgDetailObj = _.find(pgObj.rfqPriceGroupDetail, (pgdObj) => parseInt(pgdObj.rfqAssyID) === parseInt(assyObj.id));
                if (!pgDetailObj) {
                  const obj = {
                    rfqAssyID: assyObj.id,
                    refRFQID: assyObj.rfqrefID,
                    RoHSIcon: assyObj.RoHSIcon,
                    rohsName: assyObj.rohsName,
                    partID: assyObj.partID,
                    PIDCode: assyObj.PIDCode,
                    qty: null,
                    turnTime: null,
                    unitOfTime: vm.unitOfTime.BUSINESS_DAY.VALUE
                  };
                  pgObj.rfqPriceGroupDetail.push(obj);
                }
              }
            });
          });
          validateImportedPriceGroup();
        }
      }
    }
    // Validate Imported PriceGroup data
    function validateImportedPriceGroup() {
      const similarPriceGroup = [];
      const similarPriceGroupImported = [];
      _.each(vm.PriceGroupMatrix, (objPG) => {
        _.each(vm.rfq.rfqPriceGroup, (priceGroupObj) => {
          let count = 0;
          _.each(priceGroupObj.rfqPriceGroupDetail, (priceGroupDetailObj) => {
            const currPriceGroupDetailObj = _.find(objPG.rfqPriceGroupDetail, (x) => x.PIDCode.trim() === priceGroupDetailObj.PIDCode.trim());
            if (currPriceGroupDetailObj && currPriceGroupDetailObj.qty === priceGroupDetailObj.qty) {
              count++;
            }
          });
          if (_.isArray(priceGroupObj.rfqPriceGroupDetail) && count === priceGroupObj.rfqPriceGroupDetail.length && priceGroupObj.rfqPriceGroupDetail.length > 0) {
            similarPriceGroup.push({ oldPriceGroup: priceGroupObj, newPriceGroup: objPG });
          }
        });
      });
      _.each(vm.PriceGroupMatrix, (objPG, pgOutIndex) => {
        _.each(vm.PriceGroupMatrix, (priceGroupObj, pgInIndex) => {
          if (pgOutIndex !== pgInIndex) {
            let count = 0;
            _.each(priceGroupObj.rfqPriceGroupDetail, (priceGroupDetailObj) => {
              const currPriceGroupDetailObj = _.find(objPG.rfqPriceGroupDetail, (x) => x.PIDCode.trim() === priceGroupDetailObj.PIDCode.trim());
              if (currPriceGroupDetailObj && currPriceGroupDetailObj.qty === priceGroupDetailObj.qty) {
                count++;
              }
            });
            if (_.isArray(priceGroupObj.rfqPriceGroupDetail) && count === priceGroupObj.rfqPriceGroupDetail.length && priceGroupObj.rfqPriceGroupDetail.length > 0) {
              similarPriceGroupImported.push({ oldPriceGroup: priceGroupObj, newPriceGroup: objPG });
            }
          }
        });
      });
      if (similarPriceGroup.length > 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.SIMILAR_PRICE_GROUP_EXISTS);
        const message = messageContent.message + '<br/><br/><table style="width:100%"><thead><tr><th class="border-bottom padding-5">#</th><th class="border-bottom padding-5">Existing Price Group</th><th class="border-bottom padding-5">Imported Price Group</th></tr></thead><tbody>{0}</tbody></table>';
        const subMessage = [];
        similarPriceGroup.forEach((item) => {
          subMessage.push('<tr><td class="border-bottom padding-5">' + (similarPriceGroup.indexOf(item) + 1) + '</td><td class="border-bottom padding-5">' + item.oldPriceGroup.name + '</td><td class="border-bottom padding-5">' + item.newPriceGroup.name + '</td></tr>');
        });
        messageContent.message = stringFormat(message, subMessage.join(''));
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
        return similarPriceGroup;
      } else if (similarPriceGroupImported.length > 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.SIMILAR_PRICE_GROUP_IMPORTED);
        const message = messageContent.message + '<br/><br/><table style="width:100%"><thead><tr><th class="border-bottom padding-5">#</th><th class="border-bottom padding-5">Imported Price Group</th><th class="border-bottom padding-5">Imported Price Group</th></tr></thead><tbody>{0}</tbody></table>';
        const subMessage = [];
        similarPriceGroupImported.forEach((item) => {
          subMessage.push('<tr><td class="border-bottom padding-5">' + (similarPriceGroupImported.indexOf(item) + 1) + '</td><td class="border-bottom padding-5">' + item.oldPriceGroup.name + '</td><td class="border-bottom padding-5">' + item.newPriceGroup.name + '</td></tr>');
        });
        messageContent.message = stringFormat(message, subMessage.join(''));
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
        return similarPriceGroupImported;
      } else {
        _.each(vm.PriceGroupMatrix, (objPG) => {
          vm.rfq.rfqPriceGroup.push(objPG);
        });
        vm.rfqDetails.$setDirty();
        vm.isFormDirty = true;
        BaseService.currentPageFlagForm = [vm.isFormDirty];
      }
    }

    //hyper link go for list page
    vm.goTocustomerList = () => {
      BaseService.goToCustomerList();
    };
    vm.goToCustomer = () => {
      BaseService.goToCustomer(vm.autoCompleteCustomer.keyColumnId);
    };
    vm.goToEmployeelist = () => {
        BaseService.goToPersonnelList();
    };
    vm.goToAssyTypeList = () => {
      BaseService.goToAssyTypeList();
    };
    vm.goToJobList = () => {
      BaseService.openInNew(USER.ADMIN_JOB_TYPE_STATE, {});
    };
    vm.goToRFQType = () => {
      BaseService.openInNew(USER.ADMIN_RFQ_TYPE_STATE, {});
    };
    vm.goTocomponentList = () => {
      BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE, {});
    };
    vm.goToRequirementTemplate = () => {
      BaseService.openInNew(USER.ADMIN_ADDITIONAL_REQUIREMENT_STATE, {});
    };
    vm.goToBOM = (rfqAssyID, partID) => {
      BaseService.openInNew(RFQTRANSACTION.RFQ_IMPORT_BOM_STATE, { id: rfqAssyID, partId: partID });
    };
    vm.goToComponent = (partID) => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG.toLowerCase(), partID, USER.PartMasterTabs.Detail.Name);
    };

    vm.addRFQ = () => {
      $state.go(RFQTRANSACTION.RFQ_MANAGE_STATE, { id: null, rfqAssyId: null }, { reload: true });
    };

    vm.goToRFQList = () => {
      BaseService.openInNew(RFQTRANSACTION.RFQ_RFQ_STATE, {});
    };
    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      if (vm.rfqDetails) {
        $timeout(() => {
          BaseService.currentPageForms = [vm.rfqDetails];
          BaseService.currentPageFlagForm = [vm.isFormDirty];
        });
      } else {
        BaseService.currentPageForms = [vm.rfqDetails];
        BaseService.currentPageFlagForm = [vm.isFormDirty];
      }
    });

    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, {
        closeAll: true
      });
    });
  }
})();
