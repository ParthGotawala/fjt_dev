(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('AssemblyAtGlancePopupController', AssemblyAtGlancePopupController);

  /** @ngInject */
  function AssemblyAtGlancePopupController($mdDialog, CORE, USER, RFQTRANSACTION, data, BaseService, RFQFactory) {
    const vm = this;
    vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.BOM;
    vm.setScrollClass = 'gridScrollHeight_Unit';
    vm.labelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.MisMatchedText = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.BOM.Mismatched;

    function getAssyDetails() {
      vm.cgBusyLoading = RFQFactory.getAssyGlanceData().query({ partID: data.partID }).$promise.then((response) => {
        if (response && response.data) {
          _.each(response.data.AssyStandardList, (standardClassObj) => {
            standardClassObj.colorCode = standardClassObj.colorCode ? standardClassObj.colorCode : CORE.DefaultStandardTagColor;
          });
          vm.standardClassList = response.data.AssyStandardList;
          vm.mountingTypeList = response.data.mountingTypeList;
          vm.RoHSTypeList = response.data.RohsStatusList;
          vm.RoHSStatusByPartList = response.data.RoHSStatusByPartList;
          vm.RoHSStatusByAllPartInItemWithAssyList = response.data.RoHSStatusByAllPartInItemWithAssyList;
          vm.RoHSStatusByOnePartInItemWithAssyList = response.data.RoHSStatusByOnePartInItemWithAssyList;
          vm.assembly = response.data.AssyDetail[0];
          vm.assembly.id = data ? data.id : null;
          if (vm.mountingTypeList.length > 0 && vm.RoHSTypeList.length > 0) {
            vm.noDataAvailable = false;
          } else {
            vm.noDataAvailable = true;
          }

          const MTobj = {
            title: 'Assembly Detail by Mounting Type',
            xAxisName: 'Mounting Type',
            yAxisName: 'QPA',
            seriesdata: 'ItemCount,QPA,DNPItemCount,DNPQPA,kitItemCount',
            seriesTitle: 'Item Count,QPA,DNP Item Count,DNP QPA,Kit Item Count',
            yAxisVal: 'QPA',
            xAxisVal: 'mountingType'
          };

          const RoHSobj = {
            title: 'Assembly Detail by RoHS Type',
            xAxisName: 'RoHS Status',
            yAxisName: 'QPA',
            seriesdata: 'QPA,ItemCount,DNPItemCount,DNPQPA,kitItemCount',
            seriesTitle: 'QPA,Item Count,DNP Item Count,DNP QPA,Kit Item Count',
            yAxisVal: 'QPA',
            xAxisVal: 'RoHSStatus'
          };

          vm.assyArray = [];
          const rohsByPartList = _.chain(vm.RoHSStatusByPartList).groupBy('partID').map((value) => {
            var partDeail = _.first(value) || {};
            return {
              RoHSByPartList: {
                TotalPartCount: _.sumBy(value, (sum) => sum.partCount),
                RoHSListByPart: value
              },
              partID: partDeail.partID
            };
          }).value();

          const rohsByAllPartInItemWithComAssyRoHSList = _.chain(vm.RoHSStatusByAllPartInItemWithAssyList).groupBy('partID').map((value) => {
            var partDeail = _.first(value) || {};
            return {
              RoHSByPartList: {
                TotalItemCount: _.sumBy(value, (sum) => sum.ItemCount),
                RoHSListByItem: value
              },
              partID: partDeail.partID
            };
          }).value();

          const rohsByOnePartInItemWithComAssyRoHSList = _.chain(vm.RoHSStatusByOnePartInItemWithAssyList).groupBy('partID').map((value) => {
            var partDeail = _.first(value) || {};
            return {
              RoHSByPartList: {
                TotalItemCount: _.sumBy(value, (sum) => sum.ItemCount),
                RoHSListByItem: value
              },
              partID: partDeail.partID
            };
          }).value();

          const rohslist = _.chain(vm.RoHSTypeList).groupBy('partID').map((value) => {
            var partDeail = _.first(value) || {};
            return {
              PartRoHSTypeList: {
                RoHSTotalLine: _.sumBy(value, (sum) => sum.ItemCount),
                RoHSTotalQPA: _.sumBy(value, (sum) => sum.QPA),
                RoHSTotalDNPLine: _.sumBy(value, (sum) => sum.DNPItemCount),
                RoHSTotalDNPQPA: _.sumBy(value, (sum) => sum.DNPQPA),
                RoHSTotalKitItemCount: _.sumBy(value, (sum) => sum.kitItemCount),
                RoHSTypeList: value
              },
              partID: partDeail.partID,
              RoHSchartObj: {
                chartData: value,
                chartSetting: RoHSobj
              }
            };
          }).value();

          vm.assyArray = _.chain(vm.mountingTypeList).groupBy('partID').map((value) => {
            var partDeail = _.first(value) || {};
            var rohsobj = _.find(rohslist, { partID: partDeail.partID }) || {};
            var rohsByPartobj = _.find(rohsByPartList, { partID: partDeail.partID }) || {};
            var rohsByAllPartInItemWithComAssyRoHSobj = _.find(rohsByAllPartInItemWithComAssyRoHSList, { partID: partDeail.partID }) || {};
            var rohsByOnePartInItemWithComAssyRoHSobj = _.find(rohsByOnePartInItemWithComAssyRoHSList, { partID: partDeail.partID }) || {};
            return {
              PartMountingTypeList: {
                mountingTypeList: value,
                MTTotalLine: _.sumBy(value, (sum) => sum.ItemCount),
                MTTotalKitItemCount: _.sumBy(value, (sum) => sum.kitItemCount),
                MTTotalDNPLine: _.sumBy(value, (sum) => sum.DNPItemCount),
                MTTotalQPA: _.sumBy(value, (sum) => sum.QPA),
                MTTotalDNPQPA: _.sumBy(value, (sum) => sum.DNPQPA)
              },
              partID: partDeail.partID,
              assyID: partDeail.AssyID,
              assyPN: partDeail.AssyPN,
              assyType: partDeail.assyType,
              level: partDeail.level,
              rohsName: partDeail.rohsConvertibleValue,
              rohsIcon: vm.rohsImagePath + partDeail.rohsIcon,
              MTchartObj: {
                chartData: value,
                chartSetting: MTobj
              },
              PartRoHSTypeList: rohsobj.PartRoHSTypeList,
              RoHSchartObj: rohsobj.RoHSchartObj,
              rohsByPartobj: rohsByPartobj.RoHSByPartList,
              rohsByAllPartInItemWithComAssyRoHSobj: rohsByAllPartInItemWithComAssyRoHSobj.RoHSByPartList,
              rohsByOnePartInItemWithComAssyRoHSobj: rohsByOnePartInItemWithComAssyRoHSobj.RoHSByPartList
            };
          }).value();
          vm.assyArray = _.orderBy(vm.assyArray, ['level'], ['asc']);
          initHeaderdata();
        }
      });
    }

    //go to manage part number
    vm.goToAssyMaster = (partID) => {
        BaseService.goToComponentDetailTab(null, partID);
      return false;
    };
    //go to assy list
    vm.goToAssyList = () => {
        BaseService.goToPartList();
      return false;
    };
    // go to customer
    vm.goToCustomer = () => {
      BaseService.goToCustomer(vm.assembly.customerID);
      return false;
    };
    //redirect to customer list
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
      return false;
    };
    ///go to standard list
    vm.goToStandardList = () => {
      BaseService.goToStandardList();
      return false;
    };
    vm.goToAssyTypeList = () => {
      BaseService.goToAssyTypeList();
    };
    getAssyDetails();

    vm.headerdata = [];
    function initHeaderdata() {
      vm.headerdata.push({
        label: vm.labelConstant.Assembly.QuoteGroup,
        value: vm.assembly.id,
        displayOrder: 1,
        labelLinkFn: null,
        valueLinkFn: null,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      }, {
        label: vm.labelConstant.Customer.Customer,
        value: vm.assembly.Customer,
        displayOrder: 1,
        labelLinkFn: vm.goToCustomerList,
        valueLinkFn: vm.goToCustomer,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      }, {
        label: vm.labelConstant.Assembly.ID,
        value: vm.assembly.PIDCode,
        displayOrder: 1,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: vm.assembly.partID,
        isCopy: true,
        isCopyAheadLabel: false,
        isAssy: true,
        imgParms: {
          imgPath: vm.rohsImagePath + vm.assembly.rohsIcon,
          imgDetail: vm.assembly.name
        }
      }, {
        label: vm.labelConstant.Assembly.MFGPN,
        value: vm.assembly.mfgPN,
        displayOrder: 1,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: vm.assembly.partID,
        isCopy: true,
        isCopyAheadLabel: false,
        isAssy: true,
        imgParms: {
          imgPath: vm.rohsImagePath + vm.assembly.rohsIcon,
          imgDetail: vm.assembly.name
        }
      });
    }

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
