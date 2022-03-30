(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('ActivityHistoryPopupController', ActivityHistoryPopupController);

  /** @ngInject */
  function ActivityHistoryPopupController($mdDialog, $filter, data, BOMFactory, USER, CORE, TRANSACTION, RFQTRANSACTION, BaseService, ComponentFactory, $element) {
    const vm = this;
    vm.refTransID = data.refTransID;
    vm.transactionType = data.transactionType;
    vm.activityTransactionType = TRANSACTION.StartStopActivityTransactionType;
    vm.EmptyMesssageInOut = TRANSACTION.TRANSACTION_EMPTYSTATE.STARTSTOPACTIVITYHISTORY;
    vm.DateTimeFormat = _dateTimeDisplayFormat;
    vm.headerdata = [];
    if (vm.transactionType === vm.activityTransactionType[0].id) {
      vm.labelName = vm.activityTransactionType[0].value;
    } else if (vm.transactionType === vm.activityTransactionType[1].id) {
      vm.labelName = vm.activityTransactionType[1].value;
    } else if (vm.transactionType === vm.activityTransactionType[2].id) {
      vm.labelName = vm.activityTransactionType[2].value;
    }

    //Set md-data table configuration
    vm.selectedItems = [];
    vm.query = {
      order: '',
      search: '',
      stock_search: ''
    };

    //Set md-data table configuration
    vm.selectedGroupWiseItems = [];
    vm.GroupWiseQuery = {
      order: ''
    };
    vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.headerdata = [];
    vm.header = RFQTRANSACTION.ACTIVITY_LABEL.HEADER;
    vm.cancel = (data) => {
      $mdDialog.cancel(data);
    };

    // Get Start/Stop History Data.
    vm.getActivityHistory = () => {
      const objs = {
        refTransID: vm.refTransID
      };
      vm.cgBusyLoading = BOMFactory.retrieveActivityTrackingHistory().query(objs).$promise.then((inoutDetails) => {
        vm.ActivityData = (inoutDetails.data ? inoutDetails.data : []);
        const ChildEmployeeData = vm.ActivityData;
        vm.groupWiseUserTime = [];
        const groupwiseUser = _.groupBy(ChildEmployeeData, 'userName');
        _.each(groupwiseUser, (data, name) => {
          var userObj = {
            name: name,
            totalTime: vm.secondsToTime(_.sumBy(data, (o) => o.totalTime)),
            y: (_.sumBy(data, (o) => o.totalTime) / 3600)
          };
          vm.groupWiseUserTime.push(userObj);
        });
        vm.groupWiseUserTime = _.sortBy(vm.groupWiseUserTime, ['totalTime']).reverse();
        vm.ActivityData.totalTimeInSec = 0;
        _.each(ChildEmployeeData, (item) => {
          item.actualtotalTime = item.totalTime;
          item.checkinTime = $filter('date')(item.checkinTime, vm.DateTimeFormat);
          item.checkoutTime = $filter('date')(item.checkoutTime, vm.DateTimeFormat);
          vm.ActivityData.totalTimeInSec += item.totalTime ? item.totalTime : 0;
          item.totalTime = vm.secondsToTime(item.totalTime);
        });

        if (ChildEmployeeData && ChildEmployeeData.length > 0) {
          vm.ChildEmployeeData = angular.copy(ChildEmployeeData);
        }
        if (vm.ActivityData) {
          vm.headerdata.push({ label: vm.LabelConstant.Traveler.Totaltime, value: vm.secondsToTime(vm.ActivityData.totalTimeInSec), displayOrder: 1 });
        }
        if (vm.groupWiseUserTime.length > 0) {
          DrawChart();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    function getComponentdetailByID() {
      vm.cgBusyLoading = ComponentFactory.getComponentByID().query({ id: vm.refTransID }).$promise.then((response) => {
        vm.selectedComponent = {
          id: vm.refTransID,
          MFGPN: response.data.mfgPN,
          MFG: response.data.mfgCodemst.mfgCode,
          CustomerID: response.data.mfgCodemst.id,
          Customer: response.data && response.data.mfgCodemst && response.data.mfgCodemst.mfgCodeName,
          Component: stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, response.data.mfgCodemst.mfgCode, response.data.mfgPN),
          RoHSStatusIcon: response.data.rfq_rohsmst !== null ? stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, response.data.rfq_rohsmst.rohsIcon) : null,
          RoHSName: response.data.rfq_rohsmst !== null ? response.data.rfq_rohsmst.name : null,
          PIDCode: response.data.PIDCode
        };
        bindHeaderData();
        vm.getActivityHistory();
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function getAssyDetails() {
      if (vm.refTransID) {
        return BOMFactory.getAssyDetails().query({ id: vm.refTransID }).$promise.then((response) => {
          if (response && response.data) {
            const rfqAssy = vm.rfqAssyDetail = response.data;
            if (rfqAssy.rfqForms) {
              vm.getActivityHistory();
            }
          }
        });
      }
    }

    if (vm.transactionType === vm.activityTransactionType[0].id) {
      getComponentdetailByID();
    } else if (vm.transactionType === vm.activityTransactionType[1].id) {
      getAssyDetails();
    } else if (vm.transactionType === vm.activityTransactionType[2].id) {
      vm.getActivityHistory();
    }

    vm.secondsToTime = (time) => {
      if (time === 0) {
        return secondsToTime(time, true);
      } else {
        return time ? secondsToTime(time, true) : '-';
      }
    };

    //go to manage part number
    vm.goToAssyMaster = () => BaseService.goToComponentDetailTab(null, vm.selectedComponent.id);

    //go to assy list
    vm.goToAssyList = () => BaseService.goToPartList();

    // go to customer
    vm.goToCustomer = () => BaseService.goToCustomer(vm.selectedComponent.CustomerID);

    //redirect to customer list
    vm.goToCustomerList = () => BaseService.goToCustomerList();

    function bindHeaderData() {
      vm.headerdata.push({
        label: vm.LabelConstant.Customer.Customer,
        value: vm.selectedComponent.Customer,
        displayOrder: 2,
        labelLinkFn: vm.goToCustomerList,
        valueLinkFn: vm.goToCustomer,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      }, {
        label: vm.LabelConstant.Assembly.ID,
        value: vm.selectedComponent.PIDCode,
        displayOrder: 3,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        isCopy: true,
        isAssy: true,
        imgParms: {
          imgPath: vm.selectedComponent.RoHSStatusIcon,
          imgDetail: vm.selectedComponent.RoHSName
        }
      }, {
        label: vm.LabelConstant.Assembly.MFGPN,
        value: vm.selectedComponent.MFGPN,
        displayOrder: 4,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        isCopy: true,
        isAssy: true,
        imgParms: {
          imgPath: vm.selectedComponent.RoHSStatusIcon,
          imgDetail: vm.selectedComponent.RoHSName
        }
      });
    }

    function DrawChart() {
      const chart = new Highcharts.chart({
        chart: {
          type: 'pie',
          renderTo: $element.find('.pie-chart-container')[0],
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false

        },
        title: {
          text: vm.header,
          align: 'left',
          y: 5,
          x: 69
        },
        tooltip: {
          useHTML: true,
          pointFormat: '{series.name}: <b>{point.y:.2f} hrs</b><br/>&nbsp;Percentage: <b>{point.percentage:.1f} %</b><br/>'
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false,
              useHTML: true,
              format: '<b>{point.name}</b>: {point.y:.2f} hrs'
            },
            showInLegend: true
          }
        },
        legend: {
          enabled: true,
          layout: 'vertical',
          align: 'right',
          useHTML: true,
          labelFormatter: function () {
            return '<div>' + this.name + ' (' + this.y.toFixed(2) + ')</div>';
          }
        },
        series: [{
          name: 'Total Hours',
          colorByPoint: true,
          data: vm.groupWiseUserTime
        }]
      });
    }

    vm.getTotalTime = () => {
      var list = $filter('filter')(vm.ChildEmployeeData, vm.query.search);
      var sum = _.sumBy(list, (o) => o.actualtotalTime);
      return (vm.secondsToTime(sum));
    };
  }
})();
