(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('BOMColumnMappingPopupController', BOMColumnMappingPopupController);

  /** @ngInject */
  function BOMColumnMappingPopupController($timeout, $mdDialog, DialogFactory, data, CORE, BaseService) {
    const vm = this;
    vm.bomHeaders = [];

    vm.excelHeaderscopy = _.map(_.uniq(data.excelHeaders), (x) => ({ name: x }));
    vm.Exceldataheader = angular.copy(vm.excelHeaderscopy);
    vm.programingStatusList = 'Please add from following options for Requires Programming field.<br/>' + _.map(CORE.ProgramingStatusDropdown, 'value').join('<br/>');
    // Only display active headers into column mapping
    const lineItemsHeaders = _.filter(data.lineItemsHeaders, (x) => x.isActive);

    vm.isAvl = data.isAvl;
    vm.isAvlMFG = data.isAvlMFG;
    vm.isCustRevision = data.isCustRevision;
    vm.isCPNUpload = data.isCPNUpload;
    vm.MfgLabelConstant = CORE.LabelConstant.MFG;

    const defaultAutoCompleteHeader = {
      columnName: 'name',
      keyColumnName: 'name',
      keyColumnId: null,
      placeholderName: 'Column',
      isRequired: false,
      isAddnew: false,
      callbackFn: null,
      onSelectCallbackFn: function () {
        $timeout(() => {
          SetDataList();
        }, 200);
      }
    };

    function init() {
      lineItemsHeaders.forEach((item) => {
        if (vm.isAvl && item.isAvlField) {
          const bomItem = {
            header: item.name,
            field: item.field
          };

          const autoCompleteHeader = angular.copy(defaultAutoCompleteHeader);
          autoCompleteHeader.inputName = item.name;
          const excelHeaderObj = vm.excelHeaderscopy.find((x) => x.name && x.name.toUpperCase().trim() === item.name.toUpperCase());
          autoCompleteHeader.keyColumnId = excelHeaderObj ? excelHeaderObj.name : '';
          autoCompleteHeader.setFocus = false;
          if (excelHeaderObj) {
            excelHeaderObj.isSelected = true;
          }
          bomItem.autoCompleteHeader = autoCompleteHeader;
          if (item.field === 'lineID' || item.field === 'qpa' || item.field === 'refDesig' || item.field === 'mfgCode' || item.field === 'mfgPN' || item.field === 'custPN' || item.field === 'customerRev') {
            autoCompleteHeader.isRequired = true;
          }
          vm.bomHeaders.push(bomItem);
        }
        else if (vm.isAvlMFG && item.isAvlMfgField) {
          const bomItem = {
            header: item.name,
            field: item.field
          };

          const autoCompleteHeader = angular.copy(defaultAutoCompleteHeader);
          const excelHeaderObj = vm.excelHeaderscopy.find((x) => x.name && x.name.toUpperCase().trim() === item.name.toUpperCase());
          autoCompleteHeader.keyColumnId = excelHeaderObj ? excelHeaderObj.name : '';
          if (excelHeaderObj) {
            excelHeaderObj.isSelected = true;
          }
          bomItem.autoCompleteHeader = autoCompleteHeader;
          if (item.field === 'lineID' || item.field === 'qpa' || item.field === 'refDesig' || item.field === 'mfgCode' || item.field === 'mfgPN' || item.field === 'custPN' || item.field === 'customerRev') {
            autoCompleteHeader.isRequired = true;
          }
          vm.bomHeaders.push(bomItem);
        }
        else if (vm.isCustRevision) {
          const bomItem = {
            header: item.name,
            field: item.field
          };
          const autoCompleteHeader = angular.copy(defaultAutoCompleteHeader);
          const excelHeaderObj = vm.excelHeaderscopy.find((x) => x.name && x.name.toUpperCase().trim() === item.name.toUpperCase());
          autoCompleteHeader.keyColumnId = excelHeaderObj ? excelHeaderObj.name : '';
          if (excelHeaderObj) {
            excelHeaderObj.isSelected = true;
          }
          bomItem.autoCompleteHeader = autoCompleteHeader;
          if (item.field === 'lineID' || item.field === 'qpa' || item.field === 'refDesig' || item.field === 'mfgCode' || item.field === 'mfgPN' || item.field === 'cpn') {
            autoCompleteHeader.isRequired = true;
          }
          vm.bomHeaders.push(bomItem);
        }
        else if (!vm.isAvl && !vm.isAvlMFG) {
          const bomItem = {
            header: item.name,
            field: item.field
          };

          const autoCompleteHeader = angular.copy(defaultAutoCompleteHeader);
          const excelHeaderObj = vm.excelHeaderscopy.find((x) => x.name && x.name.toUpperCase().trim() === item.name.toUpperCase());
          autoCompleteHeader.keyColumnId = excelHeaderObj ? excelHeaderObj.name : '';
          if (excelHeaderObj) {
            excelHeaderObj.isSelected = true;
          }
          if (item.field === 'lineID' || item.field === 'qpa' || item.field === 'refDesig' || item.field === 'mfgCode' || item.field === 'mfgPN') {
            autoCompleteHeader.isRequired = true;
          }
          bomItem.autoCompleteHeader = autoCompleteHeader;
          vm.bomHeaders.push(bomItem);
        }
      });
      SetDataList();
      const bomheaderFirstUnmappedobj = _.find(vm.bomHeaders, (x) => x.autoCompleteHeader.keyColumnId === null || x.autoCompleteHeader.keyColumnId === undefined || x.autoCompleteHeader.keyColumnId === '');
      /*condition added because excel upload time giving console error due to object is null
       * by Ashish on 21-05-21, as per discussion with Shirish*/
      if (bomheaderFirstUnmappedobj) {
        bomheaderFirstUnmappedobj.setFocus = true;
      }
    }

    init();
    function SetDataList() {
      _.each(vm.bomHeaders, (objHeader) => {
        let ExelheaderDatalist = [];
        objHeader.setFocus = false;
        ExelheaderDatalist = angular.copy(_.filter(vm.excelHeaderscopy, (objexcelheader) => {
          const selectobj = _.find(vm.bomHeaders, (objbomheader) => objbomheader && objbomheader.autoCompleteHeader && objbomheader.autoCompleteHeader.keyColumnId === objexcelheader.name);
          if (!selectobj && objexcelheader && objexcelheader.name && objexcelheader.name.trim()) {
            return true;
          } else if (selectobj && objexcelheader && objexcelheader.name && selectobj.field === objHeader.field && objexcelheader.name.trim()) {
            return true;
          }
        }));
        objHeader.autoCompleteHeader.datalist = ExelheaderDatalist;
      });
      // for Display Mapping pending List
      vm.pendingExelheaderDatalist = angular.copy(_.filter(vm.excelHeaderscopy, (objexcelheader) => {
        const selectobj = _.find(vm.bomHeaders, (objbomheader) => objbomheader && objbomheader.autoCompleteHeader && objbomheader.autoCompleteHeader.keyColumnId === objexcelheader.name);
        if (!selectobj && objexcelheader && objexcelheader.name && objexcelheader.name.trim()) {
          return true;
        }
      }));
    }

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    vm.checkFormDirty = (form) => {
      const checkDirty = form.$dirty;
      return checkDirty;
    };

    vm.ok = () => {
      if (!vm.frmBomHeader.$valid) {
        BaseService.focusRequiredField(vm.frmBomHeader);
        return;
      }
      const model = vm.bomHeaders.map((item) => (
        {
          header: item.header,
          column: item.autoCompleteHeader.keyColumnId
        }
      ));
      if (vm.isAvl || vm.isAvlMFG) {
        const isCPN = _.filter(model, (obj) => {
          if (obj.header === 'CPN' && obj.column === '') {
            return true;
          }
        });
        if (isCPN.length > 0) {
          const model = {
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: 'CPN (Component) is require field.',
            multiple: true
          };
          DialogFactory.alertDialog(model);
        } else {
          $mdDialog.hide(model);
        }
      } else {
        $mdDialog.hide(model);
      }
    };
  }
})();
