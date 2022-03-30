(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('customTimeline', customTimeline);

    /** @ngInject */
    function customTimeline() {
        let directive = {
            restrict: 'E',
            scope: {
                userId: "=?"
            },
            templateUrl: 'app/directives/custom/timeline/custom-timeline.html',
            controller: customTimelineCtrl,
            controllerAs: 'vm'
        };
        return directive;

        /** @ngInject */
        /**
        * Controller for time-line define before load directive
        *
        * @param
        */

        function customTimelineCtrl($scope, $q, $filter, msApi, TimelineFactory, BaseService,
            CORE) {
            var vm = this;
            vm.DateTimeFormat = _dateTimeDisplayFormat;
            vm.userId = $scope.userId;
            vm.TimelineEmptyMesssage = CORE.EMPTYSTATE.TIMELINE;
            vm.CommonEmptyMesssage = CORE.EMPTYSTATE.EMPTY_SEARCH;
            let urlPrefix = CORE.URL_PREFIX;
            let filterUser = null;
            vm.loginUserDetails = BaseService.loginUser;
            vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;
            vm.isDisplayForAllUser = false;
            if (vm.userId) {
                filterUser = {
                    ColumnName: 'userID',
                    SearchString: vm.userId,
                    ColumnDataType: 'StringEquals'
                }
            }

            vm.pagingInfo = {
                Page: CORE.UIGrid.Page(),
              SortColumns: [['actualeventDateTime', 'DESC']],
                SearchColumns: [],
            };
            vm.gridOptions = {
                filterOptions: vm.pagingInfo.SearchColumns,
            };


            // get icon and details based on event Type
            let getTimeLineEvent = (eventType) => {
                let eventTypeContainSubPart = eventType.toString().split('.');
                /* to access constant object directly or from inner object by - int and decimal event id */
                if (eventTypeContainSubPart && eventTypeContainSubPart[1] && eventTypeContainSubPart[1] > 0) {
                    let mainObj = _.find(CORE.TIMELINE_EVENTS, (obj) => {
                        return eventTypeContainSubPart[0] == obj.id;
                    });
                    if (mainObj) {
                        return _.find(mainObj, (obj) => {
                            return eventType == obj.id;
                        });
                    }
                }
                else {
                    return _.find(CORE.TIMELINE_EVENTS, (obj) => {
                        return eventType == obj.id;
                    });
                }
            }

            // create object for timeline
            let createTimelineObj = (objData) => {
                let eventType = objData.eventType ? getTimeLineEvent(objData.eventType) : null;
                let obj = {
                    "card": {
                        "template": "app/directives/custom/timeline/timeline-template/timeline-template.html",
                        "subtitle": eventType ? eventType.action[0].toUpperCase() : "A",
                        "title": objData.eventTitle,
                        "text": objData.eventDescription,
                        "url": objData.url,
                        "time": $filter('date')(objData.eventDateTime, vm.DateTimeFormat),
                        "urlPrefix": urlPrefix
                    },
                    "icon": eventType ? eventType.icon : objData.icon,
                    "event": objData.eventDescription
                }
                return obj;
            }


            /* retrieve timeline detail list*/
            vm.loadData = (pagingInfo) => {
                if (filterUser && !vm.isDisplayForAllUser) {
                    vm.pagingInfo.SearchColumns.push(filterUser);
                }
                if (vm.pagingInfo.SortColumns.length == 0)
                  vm.pagingInfo.SortColumns = [['actualeventDateTime', 'DESC']];
                vm.cgBusyLoading = TimelineFactory.timeline(vm.pagingInfo).query().$promise.then((timeline) => {
                    vm.timeline = [];
                    if (timeline.data) {
                        _.each(timeline.data.timelines, (objData) => {
                            vm.timeline.push(createTimelineObj(objData));
                        });
                        vm.totalSourceDataCount = timeline.data.Count;
                    }
                    vm.currentdata = vm.timeline.length;
                    if (vm.totalSourceDataCount == 0) {
                        if (vm.pagingInfo.SearchColumns.length > (vm.isDisplayForAllUser ? 0 : 1) || !_.isEmpty(vm.SearchMode)) {
                            vm.isNoDataFound = false;
                            vm.emptyState = 0;
                        }
                        else {
                            vm.isNoDataFound = true;
                            vm.emptyState = null;
                        }
                    }
                    else {
                        vm.isNoDataFound = false;
                        vm.emptyState = null;
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }

            // call on load data more
            vm.getDataDown = () => {
                vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
                vm.cgBusyLoading = TimelineFactory.timeline(vm.pagingInfo).query().$promise.then((timeline) => {
                    if (timeline && timeline.data && timeline.data.timelines) {
                        _.each(timeline.data.timelines, (objData) => {
                            vm.timeline.push(createTimelineObj(objData));
                        })
                    }
                    vm.currentdata = vm.timeline.length;
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            };
            vm.pauseScroll = false;
            vm.timelineOptions = {
                scrollEl: '#emp-timeline'
            };

            vm.loadData(vm.pagingInfo);
            // Methods
            vm.loadNextPage = loadNextPage;

            //////////

            /**
             * Load next page
             * @returns promise
             */
            function loadNextPage() {
                // Create a new deferred object
                var deferred = $q.defer();

                //// Check if we still have data that we can load
                // check total count of data with current length of data if more than current than load data
                if (vm.totalSourceDataCount > vm.currentdata) {
                    let dataPage;
                    vm.getDataDown();
                    deferred.resolve(dataPage);
                } else {
                    deferred.reject('No more pages');
                }
                //// Increase the current page number
                //vm.currentPage = vm.currentPage + 1;

                //// Check if we still have pages that we can load
                //if (vm.currentPage > vm.totalPages) {
                //    // Reject the promise
                //    deferred.reject('No more pages');
                //}
                //else {
                //    //// Emulate the api call and load new timeline items in
                //    let dataPage;
                //    if (vm.currentPage == 2) {
                //        //_.each(objData1, (data) => {
                //        //    vm.timeline.push(data);
                //        //});
                //        vm.getDataDown();
                //    } else if (vm.currentPage == 3) {
                //        //_.each(objData2, (data) => {
                //        //    vm.timeline.push(data);
                //        //});
                //        vm.getDataDown();
                //    }
                //    deferred.resolve(dataPage);
                //    //var pageName = 'timeline.page' + vm.currentPage + '@get';
                //    //msApi.request(pageName, {},
                //    //    // SUCCESS
                //    //    function (response) {
                //    //        for (var i = 0; i < response.data.length; i++) {
                //    //            vm.timeline.push(response.data[i]);
                //    //        }
                //    //        // Resolve the promise
                //    //        deferred.resolve(response);
                //    //    },
                //    //    // ERROR
                //    //    function (response) {
                //    //        // Reject the promise
                //    //        deferred.reject(response);
                //    //    }
                //    //);
                //}
                return deferred.promise;
            }

            vm.SearchTimelineInformation = (searchText) => {
                vm.pagingInfo.SearchColumns = [];
                if (vm.searchTextForTimeData && searchText) {
                    vm.pagingInfo.SearchColumns.push({ ColumnName: 'eventDescription', SearchString: vm.searchTextForTimeData });
                }
                else {
                    vm.searchTextForTimeData = null;
                    //vm.pagingInfo.SearchColumns = [];
                }
                vm.pagingInfo.Page = CORE.UIGrid.Page();
                vm.loadData();
            }

            vm.loadDataBySelectedUserType = () => {
                vm.searchTextForTimeData = null;
                vm.pagingInfo.SearchColumns = [];
                vm.pagingInfo.Page = CORE.UIGrid.Page();
                vm.loadData();
            }
        }
    }
})();
