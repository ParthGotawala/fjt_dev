(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ManageMFGCodePopupController', ManageMFGCodePopupController);

  /** @ngInject */
  function ManageMFGCodePopupController($scope, $q, $timeout, data, CORE, USER, DialogFactory, ManageMFGCodePopupFactory, ManufacturerFactory, BaseService, MasterFactory, FOBFactory, EmployeeFactory, DCFormatFactory) {
    if (!data || !data.mfgType) {
      DialogFactory.closeDialogPopup();
      return;
    }
    const vm = this;
    const codeFieldName = 'mfgcode';
    const aliasFieldName = 'mfgcodealias';
    const approvalReasonList = [];
    let mappedMFGList = [];
    vm.EmptyMesssageAliaslist = USER.ADMIN_EMPTYSTATE.MFG;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.mfgTypeList = CORE.MFGTypeDropdown;
    vm.mfgTypeDist = CORE.MFG_TYPE.DIST;
    vm.mfgTypeMfg = CORE.MFG_TYPE.MFG;
    vm.mfgLength = CORE.MFG_TYPE_LENGTH.MFG;
    vm.distLength = CORE.MFG_TYPE_LENGTH.DIST;
    vm.supplierAuthorize = CORE.SUPPLIER_AUTHORIZE_TYPE;
    vm.todayDate = new Date();
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.Title = CORE.COMPONENT_MFG_TYPE.MANUFACTURER;
    vm.SUPPLIER_TYPE_TOOLTIP = CORE.SUPPLIER_TYPE_TOOLTIP;
    vm.MFRDateCodeFormat = CORE.LabelConstant.MFG.MFRDateCodeFormat;
    let oldMFGName = '';
    let oldMFGCode = '';
    let isApprove = false;
    let isMapped = false;
    vm.focusDateCode = false;
    vm.isShowAllMFGButton = false;
    vm.isShowAllManufacturers = false;
    vm.mfgTypeLabelForOtherThanMasterPage = !data.masterPage ? (data.mfgType === CORE.MFG_TYPE.MFG
      ? CORE.AllCommonLabels.MFG_SUPPLIER.Manufacturer : CORE.AllCommonLabels.MFG_SUPPLIER.Supplier) : '';
    vm.datePlaceHolderFormat = CORE.DATE_FORMAT;
    vm.dateDisplayFormat = _dateDisplayFormat;
    vm.buyDateOptions = {
      maxDate: vm.todayDate,
      appendToBody: true
    };
    vm.supplierMFRMappingType = CORE.supplierMFRMappingType;
    vm.enableMappingFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.MappingManufacturer);
    vm.ScanDocumentSide = CORE.ScanDocumentSide;
    vm.selectedMfgType = data && data.mfgType ? data.mfgType : null;
    vm.initalData = {
      mfgType: vm.selectedMfgType
    };
    vm.customerTypeList = _.filter(CORE.customerTypeDropdown, (item) => item.id);
    // if popup open from master page then we have to display textbox, not autocomplete
    vm.masterPage = data && data.masterPage ? data.masterPage : false;
    const scanDefaultSide = vm.selectedMfgType === vm.mfgTypeDist ? (data.scanDocumentSide ? data.scanDocumentSide : vm.ScanDocumentSide.D.type) : null; // default Duplex Scan (Double-sided);
    const loginUser = BaseService.loginUser;
    vm.isAllowDelete = false;
    vm.customerMappingLabel = CORE.LabelConstant.COMMON.CustomerMapping;
    vm.customerMappingToooltip = CORE.CustomerMappingTooltip;

    //  check and get accesslevel for delete customer/mfg/supplier alias : DELETEROLEACCESS key used right now
    function getAccessLevelForDeleteAlias() {
      return MasterFactory.getAcessLeval().query({
        access: CORE.ROLE_ACCESS.DELETE_ROLE_ACCESS
      }).$promise.then((response) => {
        if (response && response.data) {
          vm.isAllowDelete = false;
          const currentLoginUserRole = _.find(loginUser.roles, (item) => item.id === loginUser.defaultLoginRoleID);
          if (currentLoginUserRole && currentLoginUserRole.accessLevel <= response.data.accessLevel) {
            vm.isAllowDelete = true;
          }
        }
        return response;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    let selectedMFGCodeAlias = null;
    vm.currentPage = vm.selectedMfgType === CORE.MFG_TYPE.MFG ? CORE.PAGENAME_CONSTANT[21].PageName : CORE.PAGENAME_CONSTANT[22].PageName;

    vm.pageInit = (data) => {
      vm.mfgCodeModel = {
        id: data && data.id ? data.id : null,
        mfgCode: data && data.mfgCode ? data.mfgCode : null,
        alias: [],
        mfgType: data && data.mfgType ? (data.mfgType) : (vm.label === CORE.COMPONENT_MFG_TYPE.SUPPLIER ? vm.mfgTypeDist : null),
        mfgName: data ? (data.mfgName ? data.mfgName : data.Name) : null,
        legalName: data ? (data.legalName ? data.legalName : null) : null,
        comments: data ? (data.comments ? data.comments : null) : null,
        whoAcquiredWho: {
          id: data && data.acquiredID ? data.acquiredID : null,
          buyBy: data && data.buyBy ? data.buyBy : null,
          buyTo: data && data.id ? data.id : null,
          buyDate: data && data.buyDate ? data.buyDate : null,
          description: data && data.description ? data.description : null
        },
        dateCodeFormatID: data && data.dateCodeFormatID ? data.dateCodeFormatID : null,
        isCustOrDisty: vm.isCustOrDisty ? true : data && data.mfgType === CORE.MFG_TYPE.MFG ? false : true,
        authorizeType: data && data.mfgType && data.mfgType === CORE.MFG_TYPE.MFG ? null : vm.supplierAuthorize[0].id,
        scanDocumentSide: scanDefaultSide,
        isOrderQtyRequiredInPackingSlip: data && data.mfgType === CORE.MFG_TYPE.DIST ? true : null,
        supplierMFRMappingType: data && data.mfgType === CORE.MFG_TYPE.DIST ? vm.supplierMFRMappingType.OffTheShelf.key : null,
        manufacturerMapping: [],
        customerMapping: [],
        freeOnBoardId: data && data.freeOnBoardId ? data.freeOnBoardId : null,
        poComment: data && data.poComment ? data.poComment : null,
        invoicesRequireManagementApproval: data && data.invoicesRequireManagementApproval ? data.invoicesRequireManagementApproval : false,
        disableAcquired: false
      };
      if (vm.mfgCodeModel.mfgType === vm.mfgTypeDist) {
        if (vm.autoCompleteFOB) {
          vm.autoCompleteFOB.keyColumnId = vm.mfgCodeModel.freeOnBoardId ? vm.mfgCodeModel.freeOnBoardId : null;
        }
        if (vm.autoCompleteSupplierAuthorize) {
          vm.autoCompleteSupplierAuthorize.keyColumnId = vm.mfgCodeModel.authorizeType ? vm.mfgCodeModel.authorizeType : vm.supplierAuthorize[0].id;
        }
      }
      vm.alias = data && data.Name ? data.Name.toUpperCase() : data.Name;
      if (data) {
        vm.selectedMfgType = data.mfgType ? data.mfgType : null;
        vm.orignalMFGCode = data.mfgCode;
        if (data.Title) {
          vm.Title = data.Title;
        }
        vm.isCustOrDisty = data.isCustOrDisty;
        if (data.buyBy) {
          vm.disableAcquired = true;
          vm.mfgCodeModel.isAcquired = true;
          initAutoComplete();
          getAcquiredBySearch({ mfgcodeID: data.buyBy, mfgType: data.mfgType });
        }
        if (vm.alias) {
          $timeout(() => {
            vm.AddMfgCodeForm.$setDirty();
          });
        }
      }
    };
    vm.pageInit(data);
    vm.label = vm.mfgCodeModel.mfgType === vm.mfgTypeDist ? CORE.COMPONENT_MFG_TYPE.SUPPLIER : 'Manufacturer/Customer';
    vm.isClickonSave = false;
    vm.isAddButtonClicked = false;

    vm.checkDirty = false;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;

    //if (data && data.Button == vm.CORE_MESSAGE_CONSTANT.ADD_NEW) {
    //}
    if (data && data.Button === vm.CORE_MESSAGE_CONSTANT.ADD_NEW_ALIAS) {
      vm.alias = data.Name ? data.Name.toUpperCase() : data.Name;
    }
    const model = {
      accessRole: null,
      accessLevel: null,
      isValidate: true
    };

    //  check and get accessleval for mfgcode change
    function getAccessLevel() {
      return ManufacturerFactory.getAcessLeval().query({
        access: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS
      }).$promise.then((response) => {
        if (response && response.data) {
          model.accessRole = response.data.name;
          model.accessLevel = response.data.accessLevel;
          vm.allowAccess = false;
          const currentLoginUserRole = _.find(loginUser.roles, (item) => item.id === loginUser.defaultLoginRoleID);
          if (currentLoginUserRole && currentLoginUserRole.accessLevel <= response.data.accessLevel) {
            vm.allowAccess = true;
          }
          /* _.each(loginUser.roles, function (item) {
             if (item.accessLevel <= response.data.accessLevel) {
               vm.allowAccess = true;
             }
           });*/
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    const getSalesCommissionEmployeeListbyCustomer = () => {
      return EmployeeFactory.getEmployeeListByCustomer().query().$promise.then((employees) => {
        if (employees && employees.data) {
          vm.SalesCommissionEmployeeList = angular.copy(employees.data);
          _.each(vm.SalesCommissionEmployeeList, (item) => {
            if (!item.profileImg) {
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

    // get mfg details - on select autoCompletemfgCode
    const getMfgDetail = (item) => {
      if (item) {
        vm.mfgCodeModel.id = item.id;
        retriveMfgCode();
      }
      else {
        vm.pageInit(vm.initalData);
      }
    };

    if (data && data.id) {
      vm.mfgCodeModel.id = data.id;
    }

    function init() {
      const promises = [getAccessLevel(), getAccessLevelForDeleteAlias(), getDateCodeFormatList(), getSalesCommissionEmployeeListbyCustomer()];
      if (vm.mfgCodeModel.id) {
        promises.push(retriveMfgCode());
      }
      if (vm.mfgCodeModel.mfgType === vm.mfgTypeDist) {
        promises.push(getFOBList());
      }
      if (!vm.masterPage && vm.mfgCodeModel.id) {
        getMfgSearch({ mfgcodeID: vm.mfgCodeModel.id });
      }
      vm.cgBusyLoading = $q.all(promises).then(() => {
        if (!vm.autoCompletemfgCode) {
          InitautoComplete();
          //vm.AddMfgCodeForm.$setDirty();
        }
        if (vm.mfgCodeModel.mfgType === vm.mfgTypeDist) {
          InitAutoCompleteFOB();
        }
        if (vm.autoCompleteDateCodeFormat && !vm.autoCompleteDateCodeFormat.keyColumnId) {
          vm.autoCompleteDateCodeFormat.keyColumnId = vm.mfgCodeModel ? vm.mfgCodeModel.dateCodeFormatID : null;
        }
        if (!data.id) {
          $timeout(() => {
            if (data.Name && data.Name.length < 9) {
              vm.autoCompletemfgCode.searchText = data.Name;
            }
            vm.alias = data.Name;
            if (vm.Title === CORE.COMPONENT_MFG_TYPE.SUPPLIER) {
              if (vm.mfgCodeModel) {
                vm.autoCompleteMfgType.keyColumnId = vm.mfgTypeList[1].Value;
              }
            }
          }, _configSelectListTimeout); // added as data not fillup in auto complete search in case of text added (BOM case)
        }

        if (data.Button === vm.CORE_MESSAGE_CONSTANT.ADD_NEW_ALIAS) {
          vm.alias = data.Name;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    /* get mfg/supplier details by ID */
    function retriveMfgCode() {
      const mfgInfo = {
        mfgType: vm.selectedMfgType,
        fromPageRequest: vm.selectedMfgType
      };
      return ManufacturerFactory.retriveMfgCode(mfgInfo).query({ id: vm.mfgCodeModel.id, refTableName: CORE.TABLE_NAME.MFG_CODE_MST }).$promise.then((response) => {
        if (response && response.data) {
          vm.mfgCodeModel.mfgType = response.data.mfgType;
          vm.mfgCodeModel.mfgName = response.data.mfgName;
          vm.mfgCodeModel.mfgCode = response.data.mfgCode;
          vm.mfgCodeModel.legalName = response.data.legalName;
          vm.mfgCodeModel.comments = response.data.comments;
          vm.mfgCodeModel.isMfgCodeUsedInFlow = response.data.isMfgCodeUsedInFlow ? true : false;
          vm.mfgCodeModel.isCustOrDisty = response.data.isCustOrDisty;
          vm.mfgCodeModel.customerID = response.data.customerID;
          vm.mfgCodeModel.isPricingApi = response.data.isPricingApi;
          vm.mfgCodeModel.systemGenerated = response.data.systemGenerated;
          vm.mfgCodeModel.scanDocumentSide = response.data.scanDocumentSide;
          vm.mfgCodeModel.isOrderQtyRequiredInPackingSlip = response.data.isOrderQtyRequiredInPackingSlip;
          vm.mfgCodeModel.dateCodeFormatID = response.data.dateCodeFormatID;
          vm.autoCompleteSalesCommosssionTo.keyColumnId = response.data.salesCommissionTo;
          vm.mfgCodeModel.poComment = response.data.poComment;
          oldMFGCode = vm.mfgCodeModel.mfgCode;
          oldMFGName = vm.mfgCodeModel.mfgName;
          vm.mfgCodeModel.isCompany = response.data.isCompany ? response.data.isCompany : false;
          vm.aliaslist = [];
          vm.mfgCodeModel.alias = [];
          vm.mfgCodeModel.supplierMFRMappingType = response.data.supplierMFRMappingType;
          vm.mfgCodeModel.authorizeType = response.data.authorizeType || vm.supplierAuthorize[0].id;
          vm.mfgCodeModel.freeOnBoardId = response.data.freeOnBoardId;
          vm.mfgCodeModel.invoicesRequireManagementApproval = response.data.invoicesRequireManagementApproval ? response.data.invoicesRequireManagementApproval : false;

          if (vm.selectedMfgType === CORE.MFG_TYPE.DIST) {
            if (response.data.supplier_mapping_mstSupplier && response.data.supplier_mapping_mstSupplier.length > 0) {
              vm.mfgCodeModel.manufacturerMapping = _.map(response.data.supplier_mapping_mstSupplier, (item) => ({
                id: item.id,
                refMfgCodeMstID: item.MfgCodeMstManufacturer.id,
                mfgCode: BaseService.getMfgCodeNameFormat(item.MfgCodeMstManufacturer.mfgCode, item.MfgCodeMstManufacturer.mfgName)
              }));
            } else {
              vm.mfgCodeModel.manufacturerMapping = [];
            }
            if (response.data.supplier_mapping_mstCustomerMapping && response.data.supplier_mapping_mstCustomerMapping.length > 0) {
              vm.mfgCodeModel.customerMapping = _.map(response.data.supplier_mapping_mstCustomerMapping, (item) => ({
                id: item.id,
                refMfgCodeMstID: item.MfgCodeMstCustomer.id,
                mfgCode: BaseService.getMfgCodeNameFormat(item.MfgCodeMstCustomer.mfgCode, item.MfgCodeMstCustomer.mfgName)
              }));
            } else {
              vm.mfgCodeModel.customerMapping = [];
            }
          }
          const aliaslist = vm.aliaslist = angular.copy(response.data.mfgCodeAlias);
          _.each(aliaslist, (item) => {
            var objAlis = {
              alias: item.alias,
              id: item.id,
              createdAt: item.createdAt,
              employeeName: item.user && item.user.employee ? (item.user.employee.firstName + ' ' + item.user.employee.lastName) : '',
              isSystemGenerated: vm.mfgCodeModel.systemGenerated || item.alias === vm.mfgCodeModel.mfgName.toUpperCase() || item.alias === vm.mfgCodeModel.mfgCode,
              isDefaultAlias: vm.mfgCodeModel.systemGenerated || item.alias === vm.mfgCodeModel.mfgName.toUpperCase(),
              isMapped: item.invalidMfgMapping.length,
              createdAtValue: item.createdAtValue
            };
            objAlis.index = objAlis.alias.toUpperCase() === vm.mfgCodeModel.mfgCode.toUpperCase() ? 1 : (objAlis.isDefaultAlias ? 2 : 3);
            vm.mfgCodeModel.alias.push(objAlis);
          });
          if (vm.mfgCodeModel.mfgType === vm.mfgTypeDist) {
            if (vm.autoCompleteFOB) {
              vm.autoCompleteFOB.keyColumnId = vm.mfgCodeModel.freeOnBoardId ? vm.mfgCodeModel.freeOnBoardId : null;
            }
            if (vm.autoCompleteSupplierAuthorize) {
              vm.autoCompleteSupplierAuthorize.keyColumnId = vm.mfgCodeModel.authorizeType ? vm.mfgCodeModel.authorizeType : vm.supplierAuthorize[0].id;
            }
          }
          if (vm.autoCompleteDateCodeFormat && !vm.autoCompleteDateCodeFormat.keyColumnId) {
            vm.autoCompleteDateCodeFormat.keyColumnId = vm.mfgCodeModel ? vm.mfgCodeModel.dateCodeFormatID : null;
          }

          if (vm.selectedMfgType === CORE.MFG_TYPE.MFG) {
            /* start - set acquired details */
            vm.mfgCodeModel.whoAcquiredWho = {
              id: response.data.mfgCodeTo ? response.data.mfgCodeTo.id : null,
              buyBy: response.data.mfgCodeTo ? response.data.mfgCodeTo.buyBy : null,
              buyTo: response.data.mfgCodeTo ? response.data.id : null,
              buyDate: response.data.mfgCodeTo ? response.data.mfgCodeTo.buyDate : null,
              description: response.data.mfgCodeTo ? response.data.mfgCodeTo.description : null
            };
            if (response.data.mfgCodeTo && response.data.mfgCodeTo.buyBy) {
              vm.disableAcquired = true;
              vm.mfgCodeModel.isAcquired = true;
              initAutoComplete();
              getAcquiredBySearch({ mfgcodeID: response.data.mfgCodeTo.buyBy, mfgType: response.data.mfgType });
            }
            else {
              vm.disableAcquired = false;
            }
            /* end - set acquired details */
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    //Get list of FOB
    const getFOBList = () =>
      FOBFactory.retrieveFOBList().query().$promise.then((fob) => {
        if (fob && fob.data) {
          vm.FOBList = fob.data;
          return $q.resolve(vm.FOBList);
        }
      }).catch((error) => BaseService.getErrorLog(error));

    vm.goToFOBList = () => {
      BaseService.goToFOB();
    };

    init();

    const InitautoComplete = () => {
      vm.autoCompleteMfgType = {
        columnName: 'Value',
        keyColumnName: 'Value',
        keyColumnId: vm.mfgCodeModel ? vm.mfgCodeModel.mfgType : null,
        inputName: stringFormat('{0} Type', vm.Title),
        placeholderName: stringFormat('{0} Type', vm.Title),
        isRequired: true,
        isAddnew: false
      },
        vm.autoCompleteSupplierAuthorize = {
          columnName: 'Value',
          keyColumnName: 'id',
          keyColumnId: vm.mfgCodeModel ? vm.mfgCodeModel.authorizeType : null,
          inputName: 'Authorize type',
          placeholderName: 'Authorize type',
          isRequired: true,
          isAddnew: false
        },
        vm.autoCompleteDateCodeFormat = {
          columnName: 'dateCodeFormatValue',
          keyColumnName: 'id',
          controllerName: USER.ADMIN_DC_FORMAT_POPUP_CONTROLLER,
          viewTemplateURL: USER.ADMIN_DC_FORMAT_POPUP_VIEW,
          keyColumnId: vm.mfgCodeModel ? vm.mfgCodeModel.dateCodeFormatID : null,
          inputName: 'dateCodeFormatValue',
          placeholderName: vm.MFRDateCodeFormat,
          isRequired: false,
          isAddnew: true,
          callbackFn: getDateCodeFormatList,
          onSelectCallbackFn: (item) => {
            if (item) {
              vm.autoCompleteDateCodeFormat.keyColumnId = item.id;
            }
            else {
              vm.autoCompleteDateCodeFormat.keyColumnId = null;
            }
          }
        };

      vm.autoCompleteCustomerType = {
        columnName: 'value',
        keyColumnName: 'id',
        keyColumnId: 'E',
        inputName: 'value',
        placeholderName: 'Customer Type',
        isRequired: true
      };

      vm.autoCompletemfgCode = {
        columnName: 'mfgCode',
        parentColumnName: 'mfgCodeAlias',
        keyColumnName: 'id',
        keyColumnId: data ? data.id : null,
        inputName: 'Search Manufacturer Code',
        placeholderName: 'Search Code and Add',
        isRequired: true,
        isAddnew: false,
        isUppercaseSearchText: true,
        addData: { mfgType: data ? data.mfgType : null },
        callbackFn: (obj) => {
          const searchObj = {
            mfgcodeID: obj.id
          };
          return getMfgSearch(searchObj);
        },
        onSelectCallbackFn: (item) => {
          selectedMFGCodeAlias = item;
          getMfgDetail(item);
        },
        onSearchFn: (query) => {
          const searchObj = {
            searchQuery: query,
            inputName: vm.autoCompletemfgCode.inputName,
            type: data ? data.mfgType : null
          };
          return getMfgSearch(searchObj);
        }
      };

      vm.autoCompleteSalesCommosssionTo = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: null,
        controllerName: USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.Personnel.PageName
        },
        inputName: 'Customer Sales Commission To',
        placeholderName: CORE.LabelConstant.Customer.SalesCommossionTo,
        isRequired: true,
        isAddnew: true,
        callbackFn: getSalesCommissionEmployeeListbyCustomer
      };
    };

    const InitAutoCompleteFOB = () => {
      vm.autoCompleteFOB = {
        columnName: 'name',
        controllerName: CORE.MANAGE_FOB_POPUP_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_FOB_POPUP_VIEW,
        keyColumnName: 'id',
        addData: {
          popupAccessRoutingState: [USER.ADMIN_FOB_STATE],
          pageNameAccessLabel: CORE.PageName.fob
        },
        keyColumnId: vm.mfgCodeModel && vm.mfgCodeModel.freeOnBoardId ? vm.mfgCodeModel.freeOnBoardId : null,
        inputName: 'FOB',
        placeholderName: 'FOB',
        isRequired: false,
        isAddnew: true,
        callbackFn: getFOBList
      };
    };

    function getDateCodeFormatList() {
      return DCFormatFactory.retriveDateCodeFormatList().query().$promise.then((dcFormatList) => {
        if (dcFormatList && dcFormatList.data) {
          vm.dateCodeFormatList = dcFormatList.data;
          return vm.dateCodeFormatList;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function getMfgSearch(searchObj) {
      return ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((mfgcodes) => {
        if (mfgcodes && mfgcodes.data) {
          mfgcodes.data.forEach((item) => {
            if (item.mfgCodeAlias) {
              item.mfgCodeAlias.forEach((alias) => {
                alias.employeeName = alias.user && alias.user.employee ? (alias.user.employee.firstName + ' ' + alias.user.employee.lastName) : '';
              });
            }
          });
          vm.mfgCodeDetail = mfgcodes.data;
          const selectedMfgCode = mfgcodes.data[0];
          if (!vm.autoCompletemfgCode) {
            InitautoComplete();
          } else {
            vm.mfgCodeModel.mfgCode = vm.autoCompletemfgCode.searchText;
          }
          if (searchObj.mfgcodeID) {
            $timeout(() => {
              if (vm.autoCompletemfgCode) {
                vm.autoCompletemfgCode.searchText = selectedMfgCode && selectedMfgCode.mfgCode;
                $scope.$broadcast(vm.autoCompletemfgCode.inputName, selectedMfgCode);
              }
            });
          }
          return mfgcodes.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    /* when adding new alias from textbox and press enter or save */
    vm.updateAliasList = (alias) => {
      if (vm.AddMfgCodeForm.mfgcodealias.$invalid) {
        return;
      }

      if (!vm.alias || (!vm.masterPage && vm.autoCompletemfgCode && !vm.autoCompletemfgCode.searchText)) {
        return;
      }
      let messageContent = {};
      alias = replaceHiddenSpecialCharacter(alias);
      vm.alias = alias.toUpperCase();

      const aliasObj = _.find(vm.mfgCodeModel.alias, (item) => item.alias === alias);
      if (aliasObj) {
        const uniqueObj = {
          isSetAliasNull: true
        };
        if (vm.mfgCodeModel.id) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
          messageContent.message = stringFormat(messageContent.message, vm.alias, vm.selectedMfgType === CORE.MFG_TYPE.MFG ? 'manufacturer' : 'supplier', '<b>' + vm.mfgCodeModel.mfgCode + '</b>');
          uniqueObj.messageContent = messageContent;
        }
        else {
          uniqueObj.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS_GLOBAL);
        }
        displayCodeAliasUniqueMessage(uniqueObj);
        vm.AddMfgCodeForm.$setDirty();
      }
      else {
        vm.cgBusyLoading = ManageMFGCodePopupFactory.checkUniqueMFGAlias().save({
          alias: vm.alias,
          mfgType: vm.selectedMfgType,
          fromPageRequest: vm.selectedMfgType
        }).$promise.then((response) => {
          if (response && response.data && (response.data.mfgAliasExistsInfo || response.data.mfgCodeExistsInfo)) {
            if (response.data.mfgAliasExistsInfo) {
              const aliasobj = _.find(vm.aliaslist, (alias) => alias.alias === response.data.mfgAliasExistsInfo.alias);
              if (aliasobj) {
                if (vm.alias) {
                  vm.mfgCodeModel.alias.unshift({
                    id: aliasobj.id,
                    alias: vm.alias,
                    createdAt: new Date(),
                    employeeName: BaseService.loginUser && BaseService.loginUser.employee ? (BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName) : ''
                  });
                }
                vm.alias = null;
              } else {
                checkValidateAliasDetails(response.data.mfgAliasExistsInfo);
              }
            }
            else if (response.data.mfgCodeExistsInfo) {
              const aliasobj = _.find(vm.aliaslist, (alias) => alias.alias === response.data.mfgCodeExistsInfo.mfgName);
              if (aliasobj) {
                if (vm.alias) {
                  vm.mfgCodeModel.alias.unshift({
                    id: aliasobj.id,
                    alias: vm.alias,
                    createdAt: new Date(),
                    employeeName: BaseService.loginUser && BaseService.loginUser.employee ? (BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName) : ''
                  });
                }
                vm.alias = null;
              } else {
                const uniqueObj = {
                  messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS),
                  isSetAliasNull: true,
                  fieldName: aliasFieldName
                };
                uniqueObj.messageContent.message = stringFormat(uniqueObj.messageContent.message, vm.alias, vm.selectedMfgType === CORE.MFG_TYPE.MFG ? 'manufacturer' : 'supplier', response.data.mfgCodeExistsInfo.mfgCode);
                displayCodeAliasUniqueMessage(uniqueObj);
                return;
              }
            }
          } else {
            if (vm.alias) {
              vm.mfgCodeModel.alias.unshift({
                alias: vm.alias,
                createdAt: new Date(),
                employeeName: BaseService.loginUser && BaseService.loginUser.employee ? (BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName) : ''
              });
            }
            vm.alias = null;
          }
          vm.AddMfgCodeForm.$setDirty();
          setFocus('mfgcodealias');
        });
      }
    };

    function checkValidateAliasDetails(mfgalias) {
      if (mfgalias) {
        const obj = mfgalias;
        const mfgObj = {};
        mfgObj.mfgCode = obj.mfgCodemst.mfgCode;
        const uniqueObj = {
          messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS),
          isSetAliasNull: true,
          fieldName: aliasFieldName
        };
        uniqueObj.messageContent.message = stringFormat(uniqueObj.messageContent.message, vm.alias, vm.selectedMfgType === CORE.MFG_TYPE.MFG ? 'manufacturer' : 'supplier', mfgObj.mfgCode);
        displayCodeAliasUniqueMessage(uniqueObj);
        return true;
      }
      return false;
    }

    vm.removeAliasFromList = (ev, $index, aliasName) => {
      if (aliasName.id) {
        const objMFGDetail = {
          AccessRole: CORE.ROLE_ACCESS.MFRRemoveAccess,
          refID: aliasName.id,
          refTableName: CORE.TABLE_NAME.MFG_CODE_ALIAS,
          isAllowSaveDirect: false,
          approveFromPage: CORE.PAGENAME_CONSTANT[20].PageName,
          confirmationType: CORE.Generic_Confirmation_Type.MFR_REMOVE_REASON,
          transactionType: stringFormat(CORE.MESSAGE_CONSTANT.GENERIC_AUTHENTICATION_REASON.MFR_REMOVE_REASON, aliasName.alias, vm.mfgCodeModel.mfgCode),
          createdBy: loginUser.userid,
          updatedBy: loginUser.userid
        };
        DialogFactory.dialogService(
          CORE.GENERIC_CONFIRMATION_MODAL_CONTROLLER,
          CORE.GENERIC_CONFIRMATION_MODAL_VIEW,
          ev, objMFGDetail).then((data) => {
            if (data) {
              vm.mfgCodeModel.alias.splice(_.indexOf(vm.mfgCodeModel.alias, aliasName), 1);
              approvalReasonList.push(data);
              vm.AddMfgCodeForm.$setDirty();
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.mfgCodeModel.alias.splice(_.indexOf(vm.mfgCodeModel.alias, aliasName), 1);
        vm.AddMfgCodeForm.$setDirty();
      }
    };
    /*Used to Save Record*/
    vm.saveMfgCode = (ev, buttonCategory) => {
      if (vm.AddMfgCodeForm.$invalid || (!vm.autoCompletemfgCode.searchText && !vm.autoCompletemfgCode.keyColumnId && !vm.masterPage)) {
        BaseService.focusRequiredField(vm.AddMfgCodeForm);
        return;
      }

      if (BaseService.focusRequiredField(vm.AddMfgCodeForm)) {
        if (vm.mfgCodeModel.id && !vm.checkFormDirty(vm.AddMfgCodeForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          closeDialogPopup();
        }
        return;
      }

      if (vm.alias) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MFG_ALIAS_NOT_ADDED);
        const model = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(model).then((yes) => {
          if (yes) {
            saveMfgCodeDetail(ev, buttonCategory);
          }
        }, () => {
          // empty
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        saveMfgCodeDetail(ev, buttonCategory);
      }
    };

    function saveMfgCodeDetail(ev, buttonCategory) {
      if (data.mfgCode !== vm.mfgCodeModel.mfgCode && data.mfgName !== vm.mfgCodeModel.mfgName || (vm.autoCompletemfgCode.keyColumnId && data.id && vm.autoCompletemfgCode.keyColumnId !== data.id)) {
        CheckAnyCustomPartSupplierMFRMapping(ev, buttonCategory);
      }
      else {
        CheckAnyCustomPartSupplierMFRMapping(ev, buttonCategory);
      }
    }

    function CheckAnyCustomPartSupplierMFRMapping(ev, buttonCategory) {
      if (vm.mfgCodeModel.id && vm.autoCompleteDateCodeFormat && vm.autoCompleteDateCodeFormat.keyColumnId) {
        return ManufacturerFactory.CheckAnyCustomPartSupplierMFRMapping().save({ mfgCodeID: vm.mfgCodeModel.id }).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data && response.data > 0) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MFR_SUPPLIER_MAPPING_CUSTOM_PART);
            const model = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            return DialogFactory.messageConfirmDialog(model).then((yes) => {
              if (yes) {
                vm.focusDateCode = false;
                saveChangeMfgCode(ev, buttonCategory);
              }
            }, () => {
              $timeout(() => {
                if (vm.autoCompleteDateCodeFormat) {
                  $scope.$broadcast(vm.autoCompleteDateCodeFormat.inputName, null);
                  vm.autoCompleteDateCodeFormat.keyColumnId = null;
                }
              }, 0);
              vm.mfgCodeModel.dateCodeFormatID = null;
              vm.focusDateCode = true;
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            vm.focusDateCode = false;
            saveChangeMfgCode(ev, buttonCategory);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.focusDateCode = false;
        saveChangeMfgCode(ev, buttonCategory);
      }
    }

    function saveChangeMfgCode(ev, buttonCategory) {
      if (!vm.allowAccess) {
        DialogFactory.dialogService(
          CORE.VERIFY_USER_PASSWORD_POPUP_CONTROLLER,
          CORE.VERIFY_USER_PASSWORD_POPUP_VIEW,
          ev, model).then((data) => {
            if (data) {
              saveMFG(data, buttonCategory);
            }
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      }
      else {
        DialogFactory.dialogService(
          CORE.MANAGE_PASSWORD_POPUP_CONTROLLER,
          CORE.MANAGE_PASSWORD_POPUP_VIEW,
          ev, {
          isValidate: true
        }).then((data) => {
          if (data) {
            saveMFG(data, buttonCategory);
          }
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
      }
    }

    vm.checkFormDirtyForMfgCode = () => {
      if ((vm.autoCompletemfgCode && vm.autoCompletemfgCode.searchText) || (vm.mfgCodeModel.mfgName)) {
        vm.AddMfgCodeForm.$setDirty();
        return true;
      }
      return false;
    };

    // save functionality managed by button category
    vm.saveAndProceed = (buttonCategory, data) => {
      if (data) {
        vm.data = data;
      }
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.AddMfgCodeForm.$setPristine();
        vm.pageInit(data);
        retriveMfgCode();
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.AddMfgCodeForm.$dirty ? true : vm.checkFormDirty(vm.AddMfgCodeForm);
        if (isdirty) {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then((response) => {
            if (response) {
              vm.pageInit(vm.initalData);
              vm.AddMfgCodeForm.$setPristine();
              if (vm.autoCompletemfgCode) {
                vm.autoCompletemfgCode.searchText = null;
              }
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.pageInit(vm.initalData);
          vm.AddMfgCodeForm.$setPristine();
          if (vm.autoCompletemfgCode) {
            vm.autoCompletemfgCode.searchText = null;
          }
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        closeDialogPopup();
      }
      setFocusByName('mfgcode');
    };

    function saveMFG(password, buttonCategory) {
      vm.mfgCodeModel.mfgType = vm.autoCompleteMfgType.keyColumnId;
      vm.mfgCodeModel.password = password;
      vm.mfgCodeModel.mfgName = replaceHiddenSpecialCharacter(vm.mfgCodeModel.mfgName).toUpperCase();
      vm.mfgCodeModel.fromPageRequest = vm.selectedMfgType;
      vm.mfgCodeModel.authorizeType = vm.autoCompleteSupplierAuthorize.keyColumnId;
      vm.mfgCodeModel.dateCodeFormatID = vm.autoCompleteDateCodeFormat.keyColumnId;
      vm.mfgCodeModel.customerType = vm.mfgCodeModel.isCustOrDisty ? vm.autoCompleteCustomerType.keyColumnId : null;
      vm.mfgCodeModel.freeOnBoardId = vm.autoCompleteFOB ? vm.autoCompleteFOB.keyColumnId : null;
      vm.mfgCodeModel.salesCommissionTo = vm.autoCompleteSalesCommosssionTo.keyColumnId;

      vm.mfgCodeModel.alias = vm.mfgCodeModel.alias ? vm.mfgCodeModel.alias : [];
      if (!vm.isMaster) {
        vm.mfgCodeModel.id = vm.autoCompletemfgCode.keyColumnId ? vm.autoCompletemfgCode.keyColumnId : vm.mfgCodeModel.id;
        vm.mfgCodeModel.mfgCode = vm.mfgCodeModel.id && selectedMFGCodeAlias ? selectedMFGCodeAlias.mfgCode.toUpperCase() : vm.autoCompletemfgCode && vm.autoCompletemfgCode.searchText ? vm.autoCompletemfgCode.searchText.toUpperCase() : vm.mfgCodeModel.mfgCode;
      }

      const defaultAliasCode = _.find(vm.mfgCodeModel.alias, (item) => item.alias.toUpperCase() === vm.mfgCodeModel.mfgCode.toUpperCase());
      if (!defaultAliasCode) {
        vm.mfgCodeModel.alias.push({
          alias: vm.mfgCodeModel.mfgCode.toUpperCase(),
          createdAt: new Date(),
          employeeName: BaseService.loginUser && BaseService.loginUser.employee ? (BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName) : ''
        });
      }

      const defaultAliasName = _.find(vm.mfgCodeModel.alias, (item) => item.alias.toUpperCase() === vm.mfgCodeModel.mfgName.toUpperCase());
      if (!defaultAliasName) {
        vm.mfgCodeModel.alias.push({
          alias: vm.mfgCodeModel.mfgName.toUpperCase(),
          createdAt: new Date(),
          employeeName: BaseService.loginUser && BaseService.loginUser.employee ? (BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName) : ''
        });
      }

      if (vm.mfgCodeModel.whoAcquiredWho && vm.mfgCodeModel.whoAcquiredWho.buyDate) {
        vm.mfgCodeModel.whoAcquiredWho.buyDate = BaseService.getAPIFormatedDate(vm.mfgCodeModel.whoAcquiredWho.buyDate);
        vm.mfgCodeModel.whoAcquiredWho.buyTo = !vm.mfgCodeModel.whoAcquiredWho.buyTo ? vm.mfgCodeModel.id : vm.mfgCodeModel.whoAcquiredWho.buyTo; // Added by JK.
      }

      vm.cgBusyLoading = ManageMFGCodePopupFactory.Mfgcode().save(vm.mfgCodeModel).$promise.then((res) => {
        let messageContent = {};
        if (res && res.data && res.data.status === 'alias') {
          const alias = res.data.data;
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
          messageContent.message = stringFormat(messageContent.message, alias[0].alias, vm.selectedMfgType === CORE.MFG_TYPE.MFG ? 'manufacturer' : 'supplier', '<b>' + alias[0].mfgCodemst.mfgCode + '</b>');
          const uniqueObj = {
            messageContent: messageContent,
            isSetAliasNull: false,
            fieldName: aliasFieldName
          };
          displayCodeAliasUniqueMessage(uniqueObj);
        }
        else if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateCustomerMFGCode) {
          oldMFGCode = '';
          setFocus('mfgcode');
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY);
          messageContent.message = stringFormat(messageContent.message, vm.mfgCodeModel.mfgCode);
          const uniqueObj = {
            messageContent: messageContent,
            fieldName: codeFieldName
          };
          vm.mfgCodeModel.mfgCode = null;
          displayCodeAliasUniqueMessage(uniqueObj);
        }
        else if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateCustomerMFGName) {
          displayMFGNameUniqueMessage();
        }
        else if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateMapping) {
          vm.cgBusyLoading = false;
          const duplicateMFR = _.map(res.errors.data.isDuplicateMapping, (item) => item.MfgCodeMstManufacturer.mfgName).join(',');
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALREADY_EXISTS);
          messageContent.message = stringFormat((res.errors.data.isCustomerMapping ? 'Mapped Customer ' : 'Mapped Manufacturer ') + messageContent.message, duplicateMFR);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes) {
              retriveMfgCode();
              vm.formSupplierQuoteDetails.$setPristine();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isContainSpecialCharacter) {
          vm.cgBusyLoading = false;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SPECIAL_CHAR_NOT_ALLOWED);
          messageContent.message = stringFormat(messageContent.message, vm.mfgTypeLabelForOtherThanMasterPage + ' Code');
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes && vm.formSupplierQuoteDetails) {
              vm.formSupplierQuoteDetails.$setPristine();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          if (approvalReasonList.length > 0 || mappedMFGList.length > 0) {
            const savePromise = [];
            if (approvalReasonList.length > 0) {
              savePromise.push(saveApprovalReason(res.data, buttonCategory));
            } else {
              isApprove = true;
            }

            if (mappedMFGList.length > 0) {
              savePromise.push(saveMappedMFGs(buttonCategory, res.data));
            } else {
              isMapped = true;
            }
            vm.cgBusyLoading = $q.all(savePromise).then(() => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
          else {
            vm.saveAndProceed(buttonCategory, res.data);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.cancel = () => {
      const isdirty = vm.AddMfgCodeForm.$dirty;
      //const isDirtyForMfgCode = vm.checkFormDirtyForMfgCode();
      if (isdirty) {
        const data = {
          form: vm.AddMfgCodeForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        DialogFactory.closeDialogPopup(true);
      }
    };

    function closeDialogPopup() {
      BaseService.currentPagePopupForm.pop();
      DialogFactory.closeDialogPopup(vm.data);
    }
    //save mapped mfrs
    function saveMappedMFGs(buttonCategory, data) {
      return ManageMFGCodePopupFactory.saveMappedManufacturer().query({ mappedManufacturerLst: mappedMFGList }).$promise.then((response) => {
        isMapped = true;
        if (isMapped && isApprove) {
          vm.saveAndProceed(buttonCategory, data);
        }
        return response;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //save approval reason list
    function saveApprovalReason(res, buttonCategory) {
      return MasterFactory.saveAllApprovalReasons().query({ objReasonlst: approvalReasonList }).$promise.then((response) => {
        isApprove = true;
        if (isMapped && isApprove) {
          vm.saveAndProceed(buttonCategory, data);
        }
        return response;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    function getAcquiredBySearch(searchObj) {
      return ManageMFGCodePopupFactory.getMfgcodeList().query({
        type: vm.selectedMfgType, searchQuery: searchObj.searchQuery, mfgcodeID: searchObj.mfgcodeID
      }).$promise.then((mfgcodes) => {
        let rejectIndex = -1; // remove 0 id db item as not system generated
        _.each(mfgcodes.data, (item, index) => {
          if (item.id === 0) {
            rejectIndex = index;
          }
          item.mfg = item.mfgCode;
          item.mfgCode = BaseService.getMfgCodeNameFormat(item.mfgCode, item.mfgName);
        });

        if (rejectIndex !== -1) {
          mfgcodes.data.splice(rejectIndex, 1);
        }
        if (vm.mfgCodeModel.id) { // remove same updated record from acquired by list
          _.remove(mfgcodes.data, (item) => item.id === vm.mfgCodeModel.id);
        }

        if (searchObj.mfgcodeID) {
          const selectedBuyBy = mfgcodes.data[0];
          $timeout(() => {
            $scope.$broadcast(vm.autoCompleteBuyBy.inputName, selectedBuyBy);
          });
        }
        vm.mfgCodeDetail = mfgcodes.data;
        return $q.resolve(vm.mfgCodeDetail);
      }).catch((error) => BaseService.getErrorLog(error));
    }



    if (vm.selectedMfgType === CORE.MFG_TYPE.DIST) {
      /** Auto-complete for MFG code */
      vm.autoCompleteMappingMfgCode = {
        columnName: 'mfgCode',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'MFG',
        placeholderName: CORE.LabelConstant.MFG.MFG,
        isRequired: false,
        isAddnew: BaseService.loginUser ? (BaseService.loginUser.isUserManager || BaseService.loginUser.isUserAdmin || BaseService.loginUser.isUserSuperAdmin) : false,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          popupAccessRoutingState: [USER.ADMIN_MANAGEMANUFACTURER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.manufacturer
        },
        callbackFn: (obj) => {
          const searchObj = {
            mfgcodeID: obj.id
          };
          return getMfgMappingSearch(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            item.refMfgCodeMstID = item.id ? item.id : (item.refMfgCodeMstID ? item.refMfgCodeMstID : null);
            if (item.refMfgCodeMstID) {
              manufacturerMapping(item);
            }
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            searchQuery: query,
            type: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompletemfgCode.inputName
          };
          return getMfgMappingSearch(searchObj);
        }
      };
      vm.autoCompleteCustomerMapping = {
        columnName: 'mfgCode',
        controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'CustomerMapping',
        placeholderName: 'Customer Mapping',
        isRequired: false,
        isAddnew: vm.loginUser ? (vm.loginUser.isUserManager || vm.loginUser.isUserAdmin || vm.loginUser.isUserSuperAdmin) : false,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          customerType: CORE.CUSTOMER_TYPE.CUSTOMER,
          popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.customer
        },
        callbackFn: (obj) => {
          const searchObj = {
            mfgcodeID: obj.id,
            type: CORE.MFG_TYPE.MFG,
            isCustomer: true
          };
          return getMfgMappingSearch(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            item.refMfgCodeMstID = item.id ? item.id : (item.refMfgCodeMstID ? item.refMfgCodeMstID : null);
            if (item.refMfgCodeMstID) {
              customerMapping(item);
            }
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            searchQuery: query,
            type: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompleteCustomerMapping.inputName,
            isCustomer: true
          };
          return getMfgMappingSearch(searchObj);
        }
      };
    }


    const manufacturerMapping = (item) => {
      vm.mfgCodeModel.manufacturerMapping.push(item);
      $timeout(() => {
        $scope.$broadcast(vm.autoCompleteMappingMfgCode.inputName, null);
        setFocusByName(vm.autoCompleteMappingMfgCode.inputName);
      }, true);
    };
    vm.removeManufacturer = (item, index) => {
      if (item) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Mapped Manufacturer', '');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.AddMfgCodeForm.$setDirty(true);
            vm.mfgCodeModel.manufacturerMapping.splice(index, 1);
            //setFocusByName(vm.autoCompleteMappingMfgCode.inputName);
          }
        }, () => {
          //setFocusByName(vm.autoCompleteMappingMfgCode.inputName);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const customerMapping = (item) => {
      vm.mfgCodeModel.customerMapping.push(item);
      $timeout(() => {
        $scope.$broadcast(vm.autoCompleteCustomerMapping.inputName, null);
        setFocusByName(vm.autoCompleteCustomerMapping.inputName);
      }, true);
    };

    vm.removeCustomer = (item, index) => {
      if (item) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Mapped Customer', '');

        DialogFactory.messageConfirmDialog({
          messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        }).then(() => {
          vm.AddMfgCodeForm.$setDirty(true);
          vm.mfgCodeModel.customerMapping.splice(index, 1);
        }, () => { });
      }
    };

    const getMfgMappingSearch = (searchObj) => ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((mfgcode) => {
      _.each(mfgcode.data, (item) => {
        item.refMfgCodeMstID = item.id;
        item.id = null;
        item.mfg = item.mfgCode;
        item.mfgCode = BaseService.getMfgCodeNameFormat(item.mfgCode, item.mfgName);
      });
      mfgcode.data = _.differenceWith(mfgcode.data, searchObj.isCustomer ? vm.mfgCodeModel.customerMapping : vm.mfgCodeModel.manufacturerMapping, (arrValue, othValue) => arrValue.refMfgCodeMstID === othValue.refMfgCodeMstID);
      if (searchObj.mfgcodeID || searchObj.mfgcodeID === 0) {
        $timeout(() => {
          if (searchObj.isCustomer) {
            if (vm.autoCompleteCustomerMapping && vm.autoCompleteCustomerMapping.inputName) {
              $scope.$broadcast(vm.autoCompleteCustomerMapping.inputName, mfgcode.data[0]);
            }
          } else {
            if (vm.autoCompleteMappingMfgCode && vm.autoCompleteMappingMfgCode.inputName) {
              $scope.$broadcast(vm.autoCompleteMappingMfgCode.inputName, mfgcode.data[0]);
            }
          }
        }, true);
      }
      return mfgcode.data;
    }).catch((error) => BaseService.getErrorLog(error));

    function initAutoComplete() {
      vm.autoCompleteBuyBy = {
        columnName: 'mfgCode',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.mfgCodeModel.whoAcquiredWho ? vm.mfgCodeModel.whoAcquiredWho.buyBy : null,
        inputName: 'MFG Code',
        placeholderName: 'Acquired By',
        isRequired: true,
        isAddnew: true,
        addData: { mfgType: vm.selectedMfgType },
        callbackFn: (obj) => {
          const searchObj = {
            mfgcodeID: obj.id
          };
          return getAcquiredBySearch(searchObj);
        },
        onSelectCallbackFn: getBuyByMfg,
        onSearchFn: (query) => {
          const searchObj = {
            searchQuery: query,
            inputName: vm.autoCompleteBuyBy.inputName
          };
          return getAcquiredBySearch(searchObj);
        }
      };
    }

    function getBuyByMfg(item) {
      if (item) {
        vm.mfgCodeModel.whoAcquiredWho.buyBy = item.id;
      }
    }

    vm.isAcquiredchange = () => {
      if (vm.mfgCodeModel.isAcquired) {
        initAutoComplete();
      }
      else {
        vm.mfgCodeModel.whoAcquiredWho = {
        };
      }
    };

    vm.viewAllManufacturer = () => {
      vm.isShowAllManufacturers = true;
      if (vm.isShowAllManufacturers) {
        vm.isShowAllMFGButton = false;
      }
    };

    // Function call on customer code blue event and check code exist or not
    vm.checkDuplicateMFGCode = () => {
      if (oldMFGCode !== vm.mfgCodeModel.mfgCode) {
        if (vm.AddMfgCodeForm.mfgcode.$dirty && vm.mfgCodeModel.mfgCode) {
          vm.cgBusyLoading = ManufacturerFactory.checkDuplicateMFGCode().save({
            mfgCodeMstID: vm.mfgCodeModel.id ? vm.mfgCodeModel.id : null,
            mfgCode: vm.mfgCodeModel.mfgCode,
            mfgType: vm.selectedMfgType
          }).$promise.then((res) => {
            oldMFGCode = angular.copy(vm.mfgCodeModel.mfgCode);

            if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateCustomerMFGCode) {
              oldMFGCode = '';
              const uniqueObj = {
                messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY),
                fieldName: codeFieldName
              };
              uniqueObj.messageContent.message = stringFormat(uniqueObj.messageContent.message, vm.mfgCodeModel.mfgCode);
              uniqueObj.fieldName = 'mfgcode';
              vm.mfgCodeModel.mfgCode = null;
              displayCodeAliasUniqueMessage(uniqueObj);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    /* mfg code unique message */
    const displayCodeAliasUniqueMessage = (uniqueObj) => {
      if (!vm.isShowAllManufacturers) {
        vm.isShowAllMFGButton = true;
      }
      const obj = {
        messageContent: uniqueObj.messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
        multiple: true
      };
      DialogFactory.messageAlertDialog(obj).then(() => {
        setFocusByName(uniqueObj.fieldName);
        if (uniqueObj.isSetAliasNull) {
          vm.alias = null;
        }
      }, () => {

      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Function call on mfg name blue event and check mfg name exist or not
    vm.checkDuplicateMFGName = () => {
      if (oldMFGName !== vm.mfgCodeModel.mfgName) {
        if (vm.AddMfgCodeForm.mfgName.$dirty && vm.mfgCodeModel.mfgName) {
          vm.cgBusyLoading = ManufacturerFactory.checkDuplicateMFGName().query({
            mfgCodeMstID: vm.mfgCodeModel.id ? vm.mfgCodeModel.id : null,
            mfgName: vm.mfgCodeModel.mfgName,
            mfgType: vm.selectedMfgType
          }).$promise.then((res) => {
            vm.cgBusyLoading = false;
            oldMFGName = angular.copy(vm.mfgCodeModel.mfgName);
            if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateCustomerMFGName) {
              displayMFGNameUniqueMessage();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    /* mfg name unique message */
    const displayMFGNameUniqueMessage = () => {
      oldMFGName = '';
      if (!vm.isShowAllManufacturers) {
        vm.isShowAllMFGButton = true;
      }
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY);
      messageContent.message = stringFormat(messageContent.message, vm.mfgCodeModel.mfgName);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
        multiple: true
      };
      vm.mfgCodeModel.mfgName = null;
      DialogFactory.messageAlertDialog(obj).then(() => {
        setFocusByName('mfgName');
      }, () => {

      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    /* called for max date validation */
    vm.getMaxDateValidation = (FromDate, ToDate) => BaseService.getMaxDateValidation(FromDate, ToDate);

    /* set selected alias as default one and set it as mfgname */
    vm.setAliasAsDefault = (aliasItem) => {
      if (aliasItem && aliasItem.id) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SET_ALIAS_AS_DEFAULT_NAME);
        messageContent.message = stringFormat(messageContent.message, aliasItem.alias, vm.selectedMfgType === CORE.MFG_TYPE.MFG ? 'manufacturer' : 'supplier');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.mfgCodeModel.mfgName = aliasItem.alias;
            const defaultAlias = _.find(vm.mfgCodeModel.alias, (dAlias) => dAlias.isDefaultAlias === true);
            if (defaultAlias) {
              defaultAlias.index = (defaultAlias.index === 1 ? defaultAlias.index : 3); //mfg code should be come first
              defaultAlias.isDefaultAlias = false;
            }
            aliasItem.isDefaultAlias = true;
            aliasItem.index = (aliasItem.index === 1 ? aliasItem.index : 2);
            // Static code to enable save button
            vm.AddMfgCodeForm.$$controls[0].$setDirty();
          }
        }, () => {
          // empty
        });
      }
    };

    /* called from all mfg/customer checkbox selected to get details */
    vm.getSelectedMFGDetails = (id) => {
      vm.mfgCodeModel = {
        id: id,
        alias: [],
        mfgName: null,
        mfgType: data.mfgType,
        scanDocumentSide: scanDefaultSide, // default Duplex Scan (Double-sided)
        whoAcquiredWho: {
        }
      };
      data.id = id; // After select MFG Code form list given id to this popup
      vm.autoCompletemfgCode.keyColumnId = vm.mfgCodeModel.id;
      // vm.autoCompletemfgCode.searchText = CORE.MFG_TYPE.MFG;
      init();
    };

    //open popup to mapp manufacturer for invalid
    vm.mappManufacturers = (ev, alias) => {
      alias.mfgCodeID = vm.mfgCodeModel.id;
      alias.mappedMFGList = _.filter(mappedMFGList, (mapp) => mapp.refmfgAliasID === alias.id && mapp.refmfgAliasName === alias.alias);
      alias.type = vm.selectedMfgType;
      alias.name = vm.selectedMfgType === CORE.MFG_TYPE.MFG
        ? CORE.PAGENAME_CONSTANT[21].PageName : CORE.PAGENAME_CONSTANT[22].PageName;
      DialogFactory.dialogService(
        CORE.INVALID_MFR_MAPPING_MODAL_CONTROLLER,
        CORE.INVALID_MFR_MAPPING_MODAL_VIEW,
        ev, alias).then((data) => {
          if (data) {
            checkandmappList(data);
            vm.AddMfgCodeForm.$$controls[0].$setDirty();
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
    };

    //mapplist for manufacturers
    function checkandmappList(mfgList) {
      if (mfgList.length > 0) {
        mappedMFGList = _.filter(mappedMFGList, (removeMapp) => removeMapp.refmfgAliasName !== mfgList[0].refmfgAliasName);
      }
      _.each(mfgList, (objMFG) => {
        if (objMFG.isremove) {
          mappedMFGList = _.filter(mappedMFGList, (removeMapp) => removeMapp.refmfgAliasName !== objMFG.refmfgAliasName);
        }
        if (!_.find(mappedMFGList, (mfgDet) => mfgDet.refmfgCodeID === objMFG.refmfgCodeID && mfgDet.refmfgAliasName === objMFG.refmfgAliasName)) {
          mappedMFGList.push(objMFG);
          const objAlias = _.find(vm.mfgCodeModel.alias, (alias) => alias.alias === objMFG.refmfgAliasName);
          if (objAlias) {
            //new added alias
            if (!objMFG.isremove) {
              objAlias.isMapped = 1;
            }
            else {
              objAlias.isMapped = 0;
            }
          }
        }
      });
      //mapping details
    }
    //link to go for customer master list page
    vm.goToMFGList = () => {
      BaseService.goToManufacturerList();
    };
    /* to go at Edit Manufacture Code details page  */
    vm.goToManufacturer = (mfgCodeID) => {
      BaseService.goToManufacturer(mfgCodeID);
      return false;
    };
    vm.employeelist = () => BaseService.goToPersonnelList();
    vm.goToCustomerListPage = () => BaseService.goToCustomerList();
    vm.goToCustomer = (id) => BaseService.goToCustomer(id);
    //manage flag on load
    //check load
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.AddMfgCodeForm);
    });
  }
})();
