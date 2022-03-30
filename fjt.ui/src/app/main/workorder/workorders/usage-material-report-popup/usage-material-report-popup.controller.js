(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('UsageMaterialReportPopUpController', UsageMaterialReportPopUpController);

  /** @ngInject */
  function UsageMaterialReportPopUpController($mdDialog, data, CORE, BaseService, WorkorderFactory, $timeout, DialogFactory) {
    const vm = this;
    var isFilerSet = true;
    vm.data = angular.copy(data);
    vm.data.partType = CORE.UsageReportPartType.BOM;
    vm.data.showDoc = CORE.UsageReportDocType.ALL;
    vm.headerData = [];
    vm.partType = {};
    vm.docType = {};
    vm.config = {};
    vm.partType.BOM = true;
    vm.docType.Image = true;
    vm.config.includeSrNo = true;
    vm.disableGenerate = false;
    let messageContentFilter;
    vm.data.fromGenerated = parseInt(vm.data.fromGenerated);
    /* hyperlink go for list page */
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    /* go to particular assy */
    vm.goToPartDetails = () => {
        BaseService.goToComponentDetailTab(null, vm.data.partID);
      return false;
    };
    // go to work order list
    vm.goToWOList = () => {
      BaseService.goToWorkorderList();
      return false;
    };

    // redirect to work order  Detail
    vm.goToWODetail = () => {
      BaseService.goToWorkorderDetails(vm.data.woID);
      return false;
    };

    // go to sales order list
    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
      return false;
    };

    // go to sales order detail
    vm.goToManageSalesOrder = () => {
      BaseService.goToManageSalesOrder(vm.data.soId);
      return false;
    };

    if (vm.data && vm.data.fromGenerated === CORE.UsageReportGeneratedFrom.WO) {
      vm.headerData.push({
        value: vm.data.PIDCode,
        label: CORE.LabelConstant.Assembly.ID,
        displayOrder: (vm.headerData.length + 1),
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToPartDetails,
        isCopy: true,
        imgParms: {
          imgPath: vm.data.rohsIcon,
          imgDetail: vm.data.rohsName
        }
      });
      vm.headerData.push({
        label: CORE.LabelConstant.Workorder.WO,
        value: vm.data.woNumber,
        displayOrder: (vm.headerData.length + 1),
        labelLinkFn: vm.goToWOList,
        valueLinkFn: vm.goToWODetail
      });
      vm.headerData.push({
        label: CORE.LabelConstant.Workorder.Status,
        value: vm.data.woSubStatus,
        displayOrder: (vm.headerData.length + 1)
      });
    } else if (vm.data && vm.data.fromGenerated === CORE.UsageReportGeneratedFrom.SO) {
      vm.headerData.push({
        value: vm.data.PIDCode,
        label: CORE.LabelConstant.SalesOrder.AssyIDPID,
        displayOrder: (vm.headerData.length + 1),
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToPartDetails,
        isCopy: true,
        imgParms: {
          imgPath: vm.data.rohsIcon,
          imgDetail: vm.data.rohsName
        }
      });
      vm.headerData.push({
        label: CORE.LabelConstant.SalesOrder.SO,
        value: vm.data.soNumber,
        displayOrder: (vm.headerData.length + 1),
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.goToManageSalesOrder
      });
      vm.headerData.push({
        label: CORE.LabelConstant.SalesOrder.PO,
        value: vm.data.poNumber,
        displayOrder: (vm.headerData.length + 1),
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.goToManageSalesOrder
      });
    };



    vm.cancel = () => {
      $mdDialog.cancel();
    };

    const setFilter = () => {
      isFilerSet = true;
      messageContentFilter = '';
      if (vm.partType.BOM && vm.partType.SMT) {
        vm.data.partType = CORE.UsageReportPartType.ALL;
      } else if (vm.partType.BOM && !vm.partType.SMT) {
        vm.data.partType = CORE.UsageReportPartType.BOM;
      } else if (!vm.partType.BOM && vm.partType.SMT) {
        vm.data.partType = CORE.UsageReportPartType.SMT;
      } else {
        isFilerSet = false;
        messageContentFilter = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SELECT_ALEAST_ONE_PARTTYPE);
        // stop here and give message atleast one should be selected
      }
      if (vm.docType.Image && vm.docType.COFC) {
        vm.data.showDoc = CORE.UsageReportDocType.ALL;
      } else if (vm.docType.Image && !vm.docType.COFC) {
        vm.data.showDoc = CORE.UsageReportDocType.IMAGE;
      } else if (!vm.docType.Image && vm.docType.COFC) {
        vm.data.showDoc = CORE.UsageReportDocType.DOCUMENT;
      } else {
        isFilerSet = false;
        messageContentFilter = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SELECT_ALEAST_ONE_DOCTYPE);
        // atleast one should be selected
      }
      if (vm.config.ignoreDup) {
        vm.data.ignoreDup = 1;
      } else {
        vm.data.ignoreDup = 0;
      }
      if (vm.config.includeSrNo) {
        vm.data.includeSrNo = 1;
      } else {
        vm.data.includeSrNo = 0;
      }
    };

    vm.generateReport = () => {
      let fileName;
      vm.disableGenerate = true;
      setFilter();
      if (isFilerSet) {
        vm.cgBusyLoading = WorkorderFactory.getWorkorderUsageMaterial({ obj: vm.data }).then((res) => {
          vm.disableGenerate = false;
          if (res && res.data && res.data.byteLength > 0) {
            const blob = new Blob([res.data], {
              type: 'application/pdf'
            });
            if (vm.data.fromGenerated === CORE.UsageReportGeneratedFrom.WO) {
              fileName = vm.data.woNumber + '.pdf';
            } else if (vm.data.fromGenerated === CORE.UsageReportGeneratedFrom.SO) {
              fileName = vm.data.soNumber + '.pdf';
            }
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            //link.style = "visibility:hidden";
            document.body.appendChild(link);
            $timeout(() => {
              link.click();
              document.body.removeChild(link);
            });
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.NO_DATA_FOUND_FOR_USAGE_DETAIL);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        const model = {
          messageContent: messageContentFilter,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then(() => {
          vm.disableGenerate = false;
          setFocusByName('BOMPart');
        });
      }
    };
  }
})();
