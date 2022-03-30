(function () {
  'use strict';
  angular
    .module('app.rfqtransaction')
    .controller('ManageAssemblyStandardClassPopupController', ManageAssemblyStandardClassPopupController);
  /** @ngInject */
  function ManageAssemblyStandardClassPopupController(ComponentStandardDetailsFactory, $mdDialog, $scope, CORE, USER, CertificateStandardFactory, data, BaseService, ComponentFactory) {
    const vm = this;
    vm.rfqAssyID = data.rfqAssyId;
    vm.cid = data.cid;
    vm.isReadOnly = false;
    vm.selectedstandard = data.selectedClassList;
    //vm.AssyIndex = data.rfqAssyIndex;
    vm.rfqFormsID = data.rfqFormsID;
    vm.applyFromRFQPage = data.applyFromRFQPage ? data.applyFromRFQPage : false;
    vm.LabelConstant = CORE.LabelConstant;
    vm.headerLabelData = [];
    if (vm.rfqFormsID) {
      vm.headerLabelData.push({ label: 'Quote Group #', value: vm.rfqFormsID, displayOrder: 1 });
    }

    function getComponentdetailByID() {
      vm.cgBusyLoading = ComponentFactory.getComponentByID().query({ id: data.cid }).$promise.then((response) => {
        if (response && response.data) {
          const routeState = response.data.mfgType.toUpperCase() === CORE.MFG_TYPE.MFG ? USER.ADMIN_MANAGECOMPONENT_STANDARDS_STATE : USER.ADMIN_MANAGEDISTCOMPONENT_STANDARDS_STATE;

          const tabRightDet = BaseService.getReadOnlyRights(routeState);
          vm.isReadOnly = tabRightDet ? tabRightDet.RO : false;

          vm.headerLabelData.push({
            label: vm.LabelConstant.MFG.PID,
            value: response.data.PIDCode,
            displayOrder: 2, labelLinkFn: vm.goToAssemblyList,
            valueLinkFn: vm.goToAssemblyDetails,
            valueLinkFnParams: {
              partID: data.cid
            },
            isCopy: true,
            isCopyAheadLabel: true,
            isAssy: true,
            isCopyAheadOtherThanValue: true,
            copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
            copyAheadValue: response.data.mfgPN,
            imgParms: {
              imgPath: response.data.rfq_rohsmst ? stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, response.data.rfq_rohsmst.rohsIcon) : null,
              imgDetail: response.data.rfq_rohsmst ? response.data.rfq_rohsmst.name : null
            }
          });
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    getComponentdetailByID();

    function selectedclass() {
      if (vm.selectedstandard) {
        _.each(vm.MainCertificateStandardList, (standard) => {
          var standardObj = _.find(vm.selectedstandard, (objstd) => objstd.standardID === standard.certificateStandardID);
          if (standardObj) {
            standard.selected = true;
            standard.RFQAssyStandardClassid = standardObj.id;
          }
        });
        _.each(vm.parentCertificateStandardList, (standardClass) => {
          var standardObj = _.find(vm.selectedstandard, (objstd) => objstd.standardID === standardClass.certificateStandardID);
          if (standardObj) {
            const selectedClass = standardObj.standardClassIDs;
            _.each(standardClass.CertificateStandard_Class, (classobj) => {
              if (selectedClass === classobj.classID) {
                classobj.selected = true;
              }
            });
            standardClass.RFQAssyStandardClassid = standardObj.id;
          }
        });
      }
    }

    vm.CertificateEmptyMesssage = USER.ADMIN_EMPTYSTATE.CERTIFICATE_STANDARD;

    vm.CheckIsRequired = (isRequired, classList) => {
      if (isRequired) {
        const selectedClass = _.find(classList, (obj) => obj.selected === true);
        return selectedClass ? false : true;
      } else {
        return false;
      }
    };

    vm.parentCertificateStandardList = [];

    vm.getCertificateStandardList = () => {
      vm.cgBusyLoading = CertificateStandardFactory.getCertificateStandard().query().$promise.then((certificate) => {
        vm.CertificateList = [];
        vm.MainCertificateList = [];
        _.each(certificate.data, (item) => {
          if (item.CertificateStandard_Class.length > 0) {
            // let IDs = [];
            const StandardClass = [];
            _.each(item.CertificateStandard_Class, (standardClass) => {
              standardClass.selected = false;
              StandardClass.push(standardClass);
            });
            // vm.sortedData = _.sortBy(StandardClass, 'priority')
            //  item.CertificateStandard_Class = vm.sortedData;
            vm.CertificateList.push(item);
          } else {
            vm.MainCertificateList.push(item);
          }
        });
        vm.CertificateList = _.sortBy(vm.CertificateList, 'displayOrder');

        vm.parentCertificateStandardList = vm.CertificateList;
        vm.MainCertificateStandardList = vm.MainCertificateList;
        if (certificate.data.length > 0) {
          vm.isNoDataFound = false;
        } else {
          vm.isNoDataFound = true;
        }
        selectedclass();
      }).catch((error) => BaseService.getErrorLog(error));
    };
    if (vm.parentCertificateStandardList.length === 0) {
      vm.getCertificateStandardList();
    }

    vm.selectedStandard = [];
    function getComponentStandardDetail() {
      if (vm.cid) {
        return ComponentStandardDetailsFactory.getcomponentstandardDetail().query({ id: vm.cid }).$promise.then((response) => {
          vm.componentStandardDetaillist = response.data;
          //fatch selected standard
          _.each(vm.componentStandardDetaillist, (stdclass) => {
            stdclass.colorCode = CORE.DefaultStandardTagColor;
            stdclass.class = stdclass.Standardclass ? stdclass.Standardclass.className : null;
            stdclass.colorCode = stdclass.Standardclass ? (stdclass.Standardclass.colorCode ? stdclass.Standardclass.colorCode : CORE.DefaultStandardTagColor) : CORE.DefaultStandardTagColor;
            stdclass.standard = stdclass.certificateStandard ? stdclass.certificateStandard.fullName : null;
            stdclass.priority = stdclass.certificateStandard ? stdclass.certificateStandard.priority : null;
            vm.selectedStandard.push(stdclass);
          });
          vm.selectedStandard.sort(sortAlphabatically('priority', 'standard', true));
        });
      }
    }

    vm.save = () => {
      if (vm.isReadOnly) {
        return;
      }
      if (!vm.assemblyStandardClassForm.$dirty) {
        vm.cancel();
        return;
      }
      $scope.$broadcast('standardComponent');
    };
    const saveDetail = $scope.$on('setstandardFrom', (evt, data) => {
      if (data === CORE.ApiResponseTypeStatus.SUCCESS) {
        getComponentStandardDetail();
        const _objList = {
          rfqAssyID: vm.rfqAssyID,
          cid: vm.cid,
          standardList: vm.selectedStandard
        };
        $mdDialog.hide(_objList);
      }
    });

    $scope.$on('$destroy', () => {
      saveDetail();
    });


    // Don't allow to select multiple class from same standard it should work like radio button
    vm.AllowToSelect = (category) => {
      const val = category.selected;
      categoryList = _.each(categoryList, (item) => { item.selected = false; });
      category.selected = val;
    };

    // Add new button for add new certificate standards
    vm.AddNewCertificateStandards = () => {
      BaseService.openInNew(USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_DETAIL_STATE, { id: null });
    };

    // Refresh button for refresh certificate data
    vm.RefreshCertificateStandards = () => {
      vm.getCertificateStandardList();
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.assemblyStandardClassForm);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    // Assembly
    vm.goToAssemblyList = () => {
      BaseService.goToPartList();
    };

    vm.goToAssemblyDetails = (data) => {
      BaseService.goToComponentDetailTab(null, data.partID);
    };
  }
})();
