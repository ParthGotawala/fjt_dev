(function () {
    'use strict';

    /* @ngInject */
    angular.module('app.core').directive('baseLineChart', function (BaseService, WIDGET, PartCostingFactory, $q, RFQTRANSACTION, CORE) {
        return {
            restrict: 'E',
            templateUrl: 'app/directives/custom/widgets/baseline-chart/baseline-chart.html',
            scope: {
                supplier: '=?',
                packaging: '=',
                componentId: '=',
            },
            controller: ['$scope', '$element', '$filter', function ($scope, $element, $filter) {
                var chart = null;
                $scope.EmptyMesssage = WIDGET.WIDGET_EMPTYSTATE.DETAIL;
                $scope.click = false;
                $scope.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
                $scope.fromDateOptions = {
                    fromDateOpenFlag: false
                };
                $scope.toDateOptions = {
                    toDateOpenFlag: false
                };
                var date = new Date();
                date.setDate(date.getDate() - 30);
                $scope.toHistoryDate = (new Date());
              $scope.fromHistoryDate = date;

              $scope.supplier = $scope.supplier ? $scope.supplier : RFQTRANSACTION.PART_COSTING.DK;
             
                let supplierObj = _.find(CORE.Suppliers_Api, (item) => { return item.Code == $scope.supplier });
                if (supplierObj) {
                  $scope.supplierID = supplierObj.ID;
                } else {
                  $scope.supplierID = CORE.DIGIKEYID;
                }
                // get supplier list
                function getSupplierList() {
                  return PartCostingFactory.getSupplierList().query({ isPricing: '' }).$promise.then((suppliers) => {
                      
                        return $scope.Suppliers = _.sortBy(suppliers.data, (o) => { return o.mfgName });
                    }).catch((error) => {
                        return BaseService.getErrorLog(error);
                    });
                }

                //get price breaks
                function getPriceBreak() {
                    var pricingObj = {
                        //timeStamp: new Date($scope.fromHistoryDate).toISOString(), //$scope.fromDate,
                        timeStamp: BaseService.getAPIFormatedDate($scope.fromHistoryDate),
                        componentID: $scope.componentId,
                        supplierID: $scope.supplierID,//$scope.supplier,
                        packagingID: $scope.packaging,
                        //toDate: new Date($scope.toHistoryDate).toISOString()
                        toDate: BaseService.getAPIFormatedDate($scope.toHistoryDate)
                    }
                    $scope.cgBusyLoading = PartCostingFactory.retrievePriceBreak().query({ pricingObj: pricingObj }).$promise.then((qtyBreak) => {
                        var pricebreak = qtyBreak.data;
                        $scope.click = true;
                        if (pricebreak) {
                            $scope.priceBreakList = [];
                            $scope.categoryList = [];
                            var qtyBreakList = _.sortBy(pricebreak.qtyBreak, (o) => { return o.qty; });
                            _.each(qtyBreakList, (pBreak) => {
                                pBreak.price = parseFloat(pBreak.price);
                            });
                            var dataList = groupByMulti(qtyBreakList, ['qty']);
                            _.each(dataList, (breakPrice, key) => {
                                var priceHistory = {
                                    name: key,
                                    data: []
                                }
                                _.each(breakPrice, (supplierBreak) => {
                                    var priceQty = [];
                                    supplierBreak.UpdatedTimeStamp = $filter('date')(new Date(supplierBreak.UpdatedTimeStamp), _dateDisplayFormat);
                                    if (!_.find($scope.categoryList, (item) => { return item == supplierBreak.UpdatedTimeStamp })) {
                                        $scope.categoryList.push(supplierBreak.UpdatedTimeStamp);
                                    }  
                                    priceQty.push(supplierBreak.price);
                                    priceHistory.data.push(priceQty);
                                });
                                $scope.priceBreakList.push(priceHistory);
                            });
                        }
                        if ($scope.priceBreakList.length == 0){
                            var chart = null;
                            $scope.isNoDataFound = true;
                        }  
                        else {
                            $scope.isNoDataFound = false;
                            DrawChart();
                        }
                            
                    }).catch((error) => {
                        return BaseService.getErrorLog(error);
                    });
                }

                var autocompletePromise = [getSupplierList()];
                $scope.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
                    initAutoComplete();
                });
                let getSupplierApi = (item) => {
                    if (item) {
                      $scope.supplierID = item.id;
                      if (item.id == CORE.DIGIKEYID)
                        $scope.supplierName = RFQTRANSACTION.PART_COSTING.DigiKey;
                      else if (item.mfgName == RFQTRANSACTION.PART_COSTING.TTI)
                        $scope.supplierName = item.mfgName;
                      else
                        $scope.supplierName = (item.mfgName.charAt(0).toUpperCase()) + (item.mfgName.slice(1).toLowerCase());
                        if (!$scope.click)
                            getPriceBreak();
                    }
                }

                //draw line chart for price 
                function DrawChart() {
                    chart = new Highcharts.chart({
                        chart: {
                            type: 'line',
                            height: null,
                            renderTo: $element.find('.baseline-chart-container')[0],
                        },
                        title: {
                            text: stringFormat("Price Trending Report ({0})", $scope.supplierName)
                        },
                        yAxis: {
                            title: {
                                text: 'Price ($)'
                            }
                        },
                        xAxis: [{
                            title: {
                                text: "Date"
                            },
                            crosshair: true,
                            labels: {
                                rotation: -45
                            },
                            categories: $scope.categoryList,
                        }],
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle'
                        },
                        tooltip: {
                            formatter: function () {
                                var tooltip = '<span style="font-size:10px"> Date: ' + this.points[0].key + '</span><br/><table>';
                                tooltip += '<tr><td style="padding:0"> <b> Qty </b></td>' +
                                                    '<td style="padding:0"> <b> Price </b>  </td></tr>';
                                $.each(this.points, function () {
                                    tooltip += '<tr><td style="color:' + this.series.color + ';padding:0">' + this.series.userOptions.name + ': </td>' +
                                                    '<td style="padding:0"><b>' + this.y + '</b></td></tr>'
                                });

                                return tooltip += '</table>';
                            },
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            series: {
                                label: {
                                    connectorAllowed: false
                                },
                            },
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        },
                        series: $scope.priceBreakList,
                        responsive: {
                            rules: [{
                                condition: {
                                   // maxWidth: 300
                                },
                                chartOptions: {
                                    legend: {
                                        layout: 'horizontal',
                                        align: 'center',
                                        verticalAlign: 'bottom'
                                    }
                                }
                            }]
                        }
                    });
                };

                let initAutoComplete = () => {
                    $scope.autoCompletePricingDisty = {
                        columnName: 'mfgName',
                        keyColumnName: 'id',
                        keyColumnId: $scope.supplierID,
                        inputName: 'Supplier',
                        placeholderName: 'Supplier',
                        isRequired: true,
                        isAddnew: false,
                        onSelectCallbackFn: getSupplierApi
                    }
                }


                $scope.fromHistoryDateChanged = (fromdate) => {
                    if (fromdate)
                    $scope.fromHistoryDate = new Date(fromdate);
                    if ($scope.fromHistoryDate > $scope.toHistoryDate) {
                        $scope.toHistoryDate = null;
                    }
                    $scope.fromDateOptions = {
                        fromDateOpenFlag: false
                    };
                }

                $scope.toHistoryDateChanged = (toDate) => {
                    if (toDate)
                    $scope.toHistoryDate = new Date(toDate);
                    if ($scope.toHistoryDate < $scope.fromHistoryDate) {
                        $scope.fromHistoryDate = null;
                    }
                    $scope.toDateOptions = {
                        toDateOpenFlag: false
                    };
                }
                //go to supplier
                //link to go supplier list page
                $scope.goToSupplierList = () => {
                    BaseService.goToSupplierList();
                }

                $scope.getPriceBreak = () => {
                    getPriceBreak();
                }
            }],
            link: function (scope, $element, attrs) {

            }
        }
    });
})();
