(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('SearchMultipartColumnMappingPopupController', SearchMultipartColumnMappingPopupController);

  /** @ngInject */
  function SearchMultipartColumnMappingPopupController($mdDialog, DialogFactory, data, CORE) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.Headers = [];
    const excelHeaders = [];
    _.each(data.excelHeaders, (item) => {
      if (item) {
        excelHeaders.push(item);
      }
    });
    vm.PartMasterAdvancedFilters = {
      ExcludeIncorrectPart: angular.copy(CORE.PartMasterAdvancedFilters.ExcludeIncorrectPart)
    };
    vm.isExcludeIncorrectPart = data && data.isExcludeIncorrectPart ? data.isExcludeIncorrectPart : false;
    vm.excelHeaders = _.map(_.uniq(excelHeaders), (x) => ({ name: x }));
    vm.excelHeaders = _.filter(vm.excelHeaders, (uniq) => uniq.name);
    vm.headers = angular.copy(CORE.MULTIPART_SEARCH_COLUMN_MAPPING);
    if (Array.isArray(vm.headers) && vm.headers.length > 0) {
      vm.headers[1].fieldName = `${(data.mfgType === CORE.MFG_TYPE.MFG ? '' : (CORE.COMPONENT_MFG_TYPE.SUPPLIER).concat(' '))}${vm.headers[1].fieldName}`;
      vm.headers[2].fieldName = data.mfgType === CORE.MFG_TYPE.MFG ? vm.LabelConstant.MFG.MFGPN : vm.LabelConstant.MFG.SupplierPN;
    }
    vm.filterFieldName = null;

    const defaultAutoCompleteHeader = {
      columnName: 'name',
      keyColumnName: 'name',
      keyColumnId: null,
      inputName: 'Column',
      placeholderName: 'Column',
      isRequired: false,
      isAddnew: false,
      callbackFn: null,
      onSelectCallbackFn: function () {
      }
    };

    _.each(vm.headers, (item) => {
      var pricingItem = {
        header: item
      };
      var autoCompleteHeader = angular.copy(defaultAutoCompleteHeader);
      var excelHeaderObj = vm.excelHeaders.find((x) => x.name && x.name.toString().toUpperCase() === item.fieldName.toUpperCase());
      autoCompleteHeader.keyColumnId = excelHeaderObj ? excelHeaderObj.name : null;
      pricingItem.autoCompleteHeader = autoCompleteHeader;

      vm.Headers.push(pricingItem);
    });

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    /**
     * Method for apply filter On which field
     * @param {any} fieldDetail - Field Detail
     */
    vm.changeAllowSearch = (fieldDetail) => {
      vm.Headers.forEach((item) => {
        if (item.header.fieldName !== fieldDetail.header.fieldName) {
          item.header.isAllowSearch = false;
        }
      });
      vm.filterFieldName = '';
      vm.displayLableFilterFieldName = '';
      if (Array.isArray(vm.headers) && vm.headers.length > 0) {
        switch (fieldDetail.header.fieldName) {
          case vm.headers[0].fieldName:
            vm.filterFieldName = 'SystemID';
            break;
          case vm.headers[1].fieldName:
            vm.filterFieldName = 'PID Code';
            break;
          case vm.headers[2].fieldName:
            vm.filterFieldName = 'MFR PN';
            break;
          default:
          // code block
        }
        vm.displayLableFilterFieldName = fieldDetail.header.fieldName;
      }
    };

    /**
     * return all applied filter detail to component advanced filter
     * */
    vm.ok = () => {
      const allowSearchList = vm.Headers.filter((item) => item.header && item.autoCompleteHeader.keyColumnId && item.header.isAllowSearch);
      if (allowSearchList && Array.isArray(allowSearchList) && allowSearchList.length > 0) {
        const model = allowSearchList.map((item) => (
          {
            header: item.header,
            column: item.autoCompleteHeader.keyColumnId
          }
        ));
        const res = {
          model: model,
          excelHeaders: vm.excelHeaders,
          isExcludeIncorrectPart: vm.isExcludeIncorrectPart,
          displayLableFilterFieldName: vm.displayLableFilterFieldName,
          filterFieldName: vm.filterFieldName
        };
        $mdDialog.hide(res);
      } else {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.INVALID_MFR_MAPPING);
        messageContent.message = stringFormat(messageContent.message, 'Excel Header');
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      }
    };
  }
})();
