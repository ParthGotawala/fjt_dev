(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('employeePerformance', employeePerformance);

  /** @ngInject */
  function employeePerformance() {
    var directive = {
      restrict: 'E',
      scope: {
        startDate: "=",
        endDate: "=",
        startTime: "=?",
        endTime: "=?",
        woId: "=?",
        woOpId: "=?",
        empId: "=?",
        isShow: "=?"
      },
      templateUrl: 'app/directives/custom/employee-performance/employee-performance.html',
      controller: employeePerformanceCtrl,
      controllerAs: 'vm'
    };
    return directive;
    /** @ngInject */
    function employeePerformanceCtrl($scope, ReportMasterFactory, $filter, BaseService, CORE, $timeout, WIDGET, DialogFactory) {
      var vm = this;
      let day = 1000 * 60 * 60 * 24; //1 days's total time in miliseconds.
      let headerDetail = "";
      $scope.EmptyMesssage = WIDGET.WIDGET_EMPTYSTATE.DETAIL;
      $scope.startDate = $scope.startDate ? $scope.startDate : new Date();
      $scope.endDate = $scope.endDate ? $scope.endDate : (new Date($scope.startDate - (day * 30)));// current date's milliseconds - 1,000 ms * 60 s * 60 mins * 24 hrs * (# of days beyond one to go back
      let startTime = $scope.startTime ? (new Date($scope.startTime)).getHours() + (((new Date($scope.startTime)).getMinutes()) / 60) : 9;
      let endTime = $scope.endTime ? (((new Date($scope.endTime)).getHours()) + (((new Date($scope.endTime)).getMinutes()) / 60)) : 19;
      let endDateTime = stringFormat("{0}:{1}:00", (new Date($scope.endTime)).getHours(), (new Date($scope.endTime)).getMinutes());
      //get chart detail for employee
      $scope.getChartData = () => {
        let obj = {
          pStartDate: $filter('date')(new Date($scope.startDate), CORE.MySql_Store_Date_Format),
          pEndDate: $filter('date')(new Date($scope.endDate), CORE.MySql_Store_Date_Format),
          pwoID: $scope.woId,
          poPID: $scope.woOpId,
          pempID: $scope.empId
        };
        let stDate = $filter('date')(new Date($scope.startDate), CORE.DateFormatArray[0].format);
        let endDate = $filter('date')(new Date($scope.endDate), CORE.DateFormatArray[0].format);
        headerDetail = stringFormat("Date Range: <b>{0}</b> to <b>{1}</b>   <br/>Time Range: <b>{2}</b> to <b>{3}</b>", stDate, endDate, startTime, endTime)
        ReportMasterFactory.getEmployeePerformanceDetail().query(obj).$promise.then((Reports) => {
          if (Reports && Reports.data) {
            let employeeDateil = Reports.data.EmployeeDetails;
            let pauseResumeDetail = Reports.data.PauseResumelist;
            vm.empChartList = [];
            if (employeeDateil.length > 0) {
              if ($scope.woId) { headerDetail = stringFormat("{0} <br/> WO#: <b>{1}</b>", headerDetail, employeeDateil[0].woNumber) }
              if ($scope.woOpId) { headerDetail = stringFormat("{0} <br/>Operation: <b>{1}</b>", headerDetail, employeeDateil[0].opName) }
              if ($scope.empId) { headerDetail = stringFormat("{0} <br/> Personnel: <b>{1}</b>", headerDetail, employeeDateil[0].empName) }
              // group by checkin date
              let list = groupByMulti(employeeDateil, ["checkinDate"]);
              //make data to form a chart
              _.each(list, (empDateList) => {
                //craete data for chart
                // group by employee detail
                let empDetailList = groupByMulti(empDateList, ["employeeID"]);
                _.each(empDetailList, (empPerformaceDetail) => {
                  let empTime = [];
                  let totalBurndownHours = 0;
                  _.each(empPerformaceDetail, (item) => {
                    let pauseList = _.filter(pauseResumeDetail, (pDet) => { return pDet.woTransinoutID == item.woTransinoutID && (item.checkinDate == pDet.pausedDate) });
                    if (item.checkinDate != item.checkoutDate) {
                      item.checkoutHour = null;
                      item.checkoutTime = null;
                    }
                    let checkindate = $filter('date')(item.checkinDate, CORE.DateFormatArray[0].format)
                    if (pauseList.length > 0) {
                      let lastfrom = 0;
                      let lastfromCheckinTime = 0;
                      _.each(pauseList, (pauseResume, index) => {
                        index++;
                        if (index == 1 && item.checkinHour <= endTime) {
                          let pauseObj = {
                            date: checkindate,
                            from: (item.checkinHour),
                            to: (pauseResume.pausedTimeHour),
                            fromTime: item.checkinTime,
                            toTime: pauseResume.pausedTimeHour && pauseResume.pausedTimeHour <= endTime ? pauseResume.pausedTime : endDateTime
                          };

                          totalBurndownHours = calculateBurnDownHours(pauseObj.from, pauseObj.to, totalBurndownHours);
                          empTime.push(pauseObj);
                        } else if (index > 1 && lastfrom <= endTime) {
                          let pauseObj = {
                            date: checkindate,
                            from: lastfrom,
                            to: (pauseResume.pausedTimeHour),
                            fromTime: lastfromCheckinTime,
                            toTime: pauseResume.pausedTimeHour && pauseResume.pausedTimeHour <= endTime ? pauseResume.pausedTime : endDateTime
                          };
                          totalBurndownHours = calculateBurnDownHours(pauseObj.from, pauseObj.to, totalBurndownHours);
                          empTime.push(pauseObj);
                        }
                        if (pauseList.length == index && pauseResume.resumeTimeHour && pauseResume.pausedTimeHourfrom <= endTime) {
                          let pauseObj = {
                            date: checkindate,
                            from: (pauseResume.pausedTimeHour),
                            to: item.checkoutHour ? (item.checkoutHour) : (endTime),
                            fromTime: pauseResume.pausedTime,
                            toTime: item.checkoutHour && item.checkoutHour <= endTime ? item.checkoutTime : endDateTime
                          };
                          totalBurndownHours = calculateBurnDownHours(pauseObj.from, pauseObj.to, totalBurndownHours);
                          empTime.push(pauseObj);
                        }
                        lastfrom = pauseResume.resumeTimeHour;
                        lastfromCheckinTime = pauseResume.resumeTime;
                      });
                    } else {
                      if (item.checkinHour <= endTime) {
                        let pauseObj = {
                          date: checkindate,
                          from: (item.checkinHour),
                          to: item.checkoutHour ? (item.checkoutHour) : (endTime),
                          fromTime: item.checkinTime,
                          toTime: item.checkoutHour && item.checkoutHour <= endTime ? item.checkoutTime : endDateTime
                        };
                        totalBurndownHours = calculateBurnDownHours(pauseObj.from, pauseObj.to, totalBurndownHours);
                        empTime.push(pauseObj);
                      }
                    }
                  });
                  if (totalBurndownHours > 0) {
                    let empObj = {
                      name: empPerformaceDetail[0].empName,
                      current: 0,
                      totalBurndownHours: totalBurndownHours,
                      totalIdealHours: (endTime - startTime - totalBurndownHours),
                      data: empTime
                    }
                    vm.empChartList.push(empObj);
                  }
                });
              });
            }
            else {
              $scope.$emit("ispdfdisable");
            }
            DrawChart();
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };

      function DrawChart() {
        var
          map = Highcharts.map,
          series;

        // Parse car data into series.
        series = vm.empChartList.map(function (emp, i) {
          var data = emp.data.map(function (time) {
            return {
              id: 'time-' + i,
              start: time.from * 1000 * 3600,
              end: time.to * 1000 * 3600,
              startTime: time.fromTime,
              endTime: time.toTime,
              y: i
            };
          });
          return {
            name: emp.name,
            data: data,
            current: emp.data[emp.current],
            totalBurndownHours: stringFormat("{0} Hrs", emp.totalBurndownHours.toFixed(2)),
            totalIdealHours: stringFormat("{0} Hrs", emp.totalIdealHours.toFixed(2)),
          };
        });

        Highcharts.ganttChart('container', {
          series: series,
          title: {
            text: 'Personnel Burndown Report'
          },
          subtitle: {
            text: headerDetail,
            align: 'left'
          },
          tooltip: {
            formatter: function () {
              return '<span>Start Time: ' + ((this.point.startTime).split('.'))[0] + '</span><br/><span>End Time: ' + ((this.point.endTime).split('.'))[0] + '</span>';
            }
          },

          exporting: {
            enabled: false,
            filename: stringFormat('personnel_burndown_report_{0}', $filter('date')(new Date(), CORE.DateFormatArray[2].format)),
          },
          colors: [
            '#039be5',
          ],
          credits: {
            enabled: false
          },
          xAxis: [{
            currentDateIndicator: false,
            min: (startTime / 24) * day,
            max: (endTime / 24) * day,
          }, {
            visible: false,
            opposite: false
          }],
          yAxis: {
            type: 'category',
            grid: {
              columns: [{
                title: {
                  text: 'Date'
                },
                categories: map(series, function (s) {
                  return s.current.date;
                }),

              }, {
                title: {
                  text: 'Personnel'
                },
                categories: map(series, function (s) {
                  return s.name;
                })
              },
              {
                title: {
                  text: 'Burndown'
                },
                categories: map(series, function (s) {
                  return s.totalBurndownHours;
                }),
              },
              {
                title: {
                  useHTML: true,
                  text: '<span style="display: inline-block;width:65px">Ideal Time</span>'

                },
                categories: map(series, function (s) {
                  return s.totalIdealHours;
                })
              }]
            }
          }
        });
        if (!$scope.isShow) {
          vm.empChartList = Array.isArray(vm.empChartList) ? vm.empChartList : [];
          vm.exportChart();
        }
      };
      //export chart detail
      vm.exportChart = () => {
        $timeout(() => {
          Highcharts.charts[Highcharts.charts.length - 1].exportChart({
            type: 'application/pdf'
          });
        });
      }
      if ($scope.isShow) { $scope.getChartData(); };
      //save invite employee
      $scope.$on('downloadEmpReport', function (ev, data) {
        $scope.getChartData();
      });
      //calculate ideal hours
      let calculateBurnDownHours = (fTime, tTime, totalHousr) => {
        if (fTime >= startTime && tTime <= endTime) {
          totalHousr = totalHousr + (tTime - fTime);
        } else if (fTime < startTime && tTime <= endTime) {
          totalHousr = totalHousr + (tTime - startTime);
        } else if (fTime >= startTime && tTime > endTime) {
          totalHousr = totalHousr + (endTime - fTime);
        } else if (fTime < startTime && tTime > endTime) {
          totalHousr = totalHousr + (endTime - startTime);
        }
        return totalHousr;
      }
      $scope.$on("exportpdfchart", function (event, data) {
        vm.exportChart();
      });
    }
  }
})();
