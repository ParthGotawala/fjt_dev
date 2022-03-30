(function () {
  'use strict';
  angular
    .module('app.core')
    .controller('InvalidMfrMappingPopupController', InvalidMfrMappingPopupController);
  /** @ngInject */
  function InvalidMfrMappingPopupController($q, $mdDialog, data, CORE, USER, BaseService, DialogFactory, ManageMFGCodePopupFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.EmptyMesssageAliaslist = USER.ADMIN_EMPTYSTATE.MFG_MAPP;
    vm.aliasMaster = _.clone(data);
    vm.taToolbar = CORE.Toolbar;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.LabelConstant = CORE.LabelConstant;
    vm.selectedMfgType = vm.aliasMaster.type;
    vm.EmptyMesssageAliaslist.MESSAGE = stringFormat(vm.EmptyMesssageAliaslist.MESSAGE, vm.aliasMaster.name);
    const loginUser = BaseService.loginUser;
    vm.labelHead = vm.selectedMfgType === CORE.MFG_TYPE.MFG ? vm.LabelConstant.MFG.MFG : vm.LabelConstant.MFG.Supplier;
    vm.mappedMfgList = [];
    vm.actualMappList = [];
    if (vm.aliasMaster.id) {
      getMappedMfgList();
    }
    else {
      commonMapping();
    }

    function getMappedMfgList() {
      vm.cgBusyLoading = ManageMFGCodePopupFactory.getMappedManufacturerList().query({ mfgCodeAliasID: vm.aliasMaster.id }).$promise.then((response) => {
        if (response && response.data) {
          vm.mappedMfgList = response.data.mappList;
          vm.actualMappList = _.clone(vm.mappedMfgList);
          if (vm.aliasMaster.mappedMFGList.length > 0) {
            commonMapping();
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //common code for add recently added details
    function commonMapping() {
      const dbMappedMfrslist = _.map(vm.mappedMfgList, 'refmfgCodeID');
      const updateMappMfgList = _.map(vm.aliasMaster.mappedMFGList, 'refmfgCodeID');
      const removemappedMfgIDS = _.difference(dbMappedMfrslist, updateMappMfgList);
      const insertMfgIDS = _.difference(updateMappMfgList, dbMappedMfrslist);
      //remove from list
      _.each(removemappedMfgIDS, (mapper) => {
        vm.mappedMfgList = _.filter(vm.mappedMfgList, (mapp) => mapp.refmfgCodeID != mapper);
      });
      //new inserted
      _.each(insertMfgIDS, (mapper) => {
        var objMapp = _.find(vm.aliasMaster.mappedMFGList, (mapp) => mapp.refmfgCodeID == mapper);
        if (objMapp) {
          vm.mappedMfgList.push(objMapp);
        }
      });
      //check removed details or not
      _.each(vm.aliasMaster.mappedMFGList, (mapper) => {
        var objMapp = _.find(vm.mappedMfgList, (mapp) => mapp.refmfgCodeID == mapper.refmfgCodeID);
        if (objMapp) {
          objMapp.isremove = mapper.isremove;
        }
      });
      vm.mappedMfgList = _.filter(vm.mappedMfgList, (removeMapp) => !removeMapp.isremove);
      vm.actualMappList = _.clone(vm.mappedMfgList);
    }

    vm.cancel = () => {
      if (vm.checkDirty) {
        const data = {
          form: vm.AddMfgCodeForm
        };
        BaseService.currentPageFlagForm.pop();
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPageFlagForm.pop();
        $mdDialog.cancel();
      }
    };

    //link to go for manufacturer master list page
    vm.goToMFGList = () => {
      BaseService.goToManufacturerList();
    };
    //link to go for supplier master list page
    vm.goToSupplierList = () => {
      BaseService.goToSupplierList();
    };
    //go to mfr master
    vm.goToManufacturer = () => {
      BaseService.goToManufacturer(vm.aliasMaster.mfgCodeID);
    };
    //go to supplier master
    vm.goToSupplier = () => {
      BaseService.goToSupplierDetail(vm.aliasMaster.mfgCodeID);
    };
    bindHeaderData();
    vm.checkFormDirty = () => vm.checkDirty;

    initAutoComplete();

    function initAutoComplete() {
      vm.autoCompletemfgCode = {
        columnName: 'mfgCodeName',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: vm.LabelConstant.MFG.MFG,
        placeholderName: vm.LabelConstant.MFG.MFG,
        isRequired: false,
        isAddnew: true,
        addData: { mfgType: vm.selectedMfgType },
        callbackFn: function (obj) {
          const searchObj = {
            mfgcodeID: obj.id
          };
          return getMfgCodeSearch(searchObj);
        },
        onSelectCallbackFn: getmfgCode,
        onSearchFn: function (query) {
          const searchObj = {
            searchQuery: query,
            inputName: vm.autoCompletemfgCode.inputName
          };
          return getMfgCodeSearch(searchObj);
        }
      };
    }
    //search manufacturer details
    function getMfgCodeSearch(searchObj) {
      return ManageMFGCodePopupFactory.getMfgcodeList().query({
        type: vm.selectedMfgType, searchQuery: searchObj.searchQuery, mfgcodeID: searchObj.mfgcodeID
      }).$promise.then((mfgcodes) => {
        var systemGeneratedIds = 0;
        //remove already mapp manufacturer from list
        _.each(vm.mappedMfgList, (objMapp) => {
          mfgcodes.data = _.reject(mfgcodes.data, (o) => (o.id == objMapp.refmfgCodeID || o.id <= systemGeneratedIds));
        });
        vm.mfgCodeDetail = mfgcodes.data;
        if (searchObj.mfgcodeID) {
          getmfgCode(vm.mfgCodeDetail[0]);
        }
        return $q.resolve(vm.mfgCodeDetail);
      }).catch((error) => BaseService.getErrorLog(error));
    }
    //select mfg to add in list
    function getmfgCode(item) {
      if (item) {
        const alreadyMapped = _.find(vm.actualMappList, (mapp) => mapp.refmfgCodeID == item.id && mapp.refmfgAliasID == vm.aliasMaster.id);
        const objMapp = {
          id: alreadyMapped ? alreadyMapped.id : null,
          refmfgCodeID: item.id,
          mfgCode: stringFormat('({0}) {1}', item.mfgCode,item.mfgName) ,
          employeeName: stringFormat('{0} {1}', loginUser.employee.firstName, loginUser.employee.lastName),
          createdAt: BaseService.getCurrentDateTimeUI(),
          refmfgAliasID: vm.aliasMaster.id,
          refmfgAliasName: vm.aliasMaster.alias
        };
        vm.mappedMfgList.push(objMapp);
        vm.checkDirty = true;
        vm.autoCompletemfgCode.keyColumnId = null;
        vm.autoCompletemfgCode.searchText = null;
      }
    }


    //bind label header detail
    function bindHeaderData() {
      vm.headerdata = [];
      vm.headerdata.push({
        label: vm.selectedMfgType === CORE.MFG_TYPE.MFG ? vm.LabelConstant.MFG.MFG : vm.LabelConstant.MFG.Supplier,
        value: vm.aliasMaster.alias,
        displayOrder: 1,
        labelLinkFn: vm.selectedMfgType === CORE.MFG_TYPE.MFG ? vm.goToMFGList : vm.goToSupplierList,
        valueLinkFn: vm.selectedMfgType === CORE.MFG_TYPE.MFG ? vm.goToManufacturer : vm.goToSupplier,
        valueLinkFnParams: null
      });
    }
    //remove mapped mfr
    vm.removeAliasFromList = (ev, index, alias) => {
      if (vm.mappedMfgList[index].id) {
        const obj = {
          title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, stringFormat('Mapped {0}', vm.aliasMaster.name)),
          textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_MESSAGE, 1, stringFormat('Mapped {0}', vm.aliasMaster.name)),
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.confirmDiolog(obj).then(() => {
          vm.mappedMfgList.splice(index, 1);
          vm.checkDirty = true;
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.mappedMfgList.splice(index, 1);
        vm.checkDirty = true;
      }
    };
    //save mfg mapped detail
    vm.saveMfgMappDetail = () => {
      if (vm.actualMappList.length > 0 && vm.mappedMfgList.length === 0) {
        const objnewMapp = vm.actualMappList[0];
        objnewMapp.isremove = true;
        vm.mappedMfgList.push(objnewMapp);
      }
      BaseService.currentPageFlagForm.pop();
      $mdDialog.hide(vm.mappedMfgList);
    };
    //on load submit form
    angular.element(() => {
      BaseService.currentPageFlagForm.push(vm.checkDirty);
    });
  }
})();
