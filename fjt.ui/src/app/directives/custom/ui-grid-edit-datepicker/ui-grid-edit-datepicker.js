angular.module('app.core').directive('uiGridEditDatepicker', ['$rootScope', '$timeout', '$document', 'uiGridConstants', 'uiGridEditConstants', 'CORE', function ($rootScope, $timeout, $document, uiGridConstants, uiGridEditConstants, CORE) {
    return {
        template: function (element, attrs) {
            //var html = '<div class="datepicker-wrapper" ><input type="text" uib-datepicker-popup datepicker-append-to-body="true" is-open="isOpen" ng-model="datePickerValue" ng-change="changeDate($event)" popup-placement="auto top"/></div>';
            var html = '<div class="datepicker-wrapper" >\
                            <input type="text"\
                                    datetime-picker="{{$root.dateDisplayFormat}}"\
                                    datepicker-append-to-body="true"\
                                    is-open="isOpen"\
                                    enable-time="false"\
                                    ng-model="datePickerValue"\
                                    ng-change="changeDate($event)"\
                                    popup-placement="auto top"\
                                    datepicker-options="datepickerOptions"\
                                    model-view-value="true"\
                                    is-open="datepickerOptions.checkinTimeOpenFlag"/>\
                        </div>';
            return html;
        },
        require: ['?^uiGrid', '?^uiGridRenderContainer'],
        scope: {
            datepickerOptions: "=?",
            entityDetails: "=?",
            fieldDetails: "=?",
        },
        compile: function () {
            return {
                pre: function ($scope, $elm, $attrs) {
                },
                post: function ($scope, $elm, $attrs, controllers) {
                    if ($scope.entityDetails && $scope.entityDetails[$scope.fieldDetails]) {
                        $scope.datePickerValue = new Date($scope.entityDetails[$scope.fieldDetails]);
                    }
                    else if ($scope.row && $scope.row.entity && $scope.row.entity[$scope.col.field]) {
                        $scope.datePickerValue = new Date($scope.row.entity[$scope.col.field]);
                    }
                    else{
                        $scope.datePickerValue = new Date();
                    }
                    $scope.isOpen = true;
                    var uiGridCtrl = controllers[0];
                    var renderContainerCtrl = controllers[1];

                    var onWindowClick = function (evt) {
                        var classNamed = angular.element(evt.target).attr('class');
                        if (classNamed) {
                            var inDatepicker = (classNamed.indexOf('datepicker-calendar') > -1);
                            if (!inDatepicker && evt.target.nodeName !== "INPUT") {
                                $scope.stopEdit(evt);
                            }
                        }
                        else {
                            $scope.stopEdit(evt);
                        }
                    };

                    var onCellClick = function (evt) {
                        angular.element(document.querySelectorAll('.ui-grid-cell-contents')).off('click', onCellClick);
                        $scope.stopEdit(evt);
                    };

                    $scope.changeDate = function (evt) {
                        if ($scope.entityDetails && $scope.fieldDetails) {
                            if ($scope.datePickerValue) {
                                $scope.entityDetails[$scope.fieldDetails] = $scope.datePickerValue;
                                $scope.stopEdit(evt);
                            } else {
                                $scope.entityDetails[$scope.fieldDetails] = null;
                                $scope.stopEdit(evt);
                            }
                        }
                        else if ($scope.row && $scope.row.enity && $scope.col) {
                            if ($scope.datePickerValue) {
                                $scope.row.entity[$scope.col.field] = $scope.datePickerValue;
                                $scope.stopEdit(evt);
                            } else {
                                $scope.row.entity[$scope.col.field] = null;
                                $scope.stopEdit(evt);
                            }
                        }
                    };
                    //clear value of datepicker
                    $scope.$watch('datePickerValue', function (newVal, oldVal) {
                        if (newVal != oldVal) {
                            if ($scope.entityDetails && $scope.fieldDetails) {
                                if ($scope.datePickerValue) {
                                    $scope.entityDetails[$scope.fieldDetails] = new Date(newVal);
                                } else {
                                    $scope.entityDetails[$scope.fieldDetails] = null;
                                }
                            }
                            else if ($scope.row && $scope.row.enity && $scope.col) {
                                if ($scope.datePickerValue) {
                                    $scope.row.entity[$scope.col.field] = new Date(newVal);
                                } else {
                                    $scope.row.entity[$scope.col.field] = null;
                                }
                            }
                        }
                    });

                    $scope.$on(uiGridEditConstants.events.BEGIN_CELL_EDIT, function () {
                        if (uiGridCtrl.grid.api.cellNav) {
                            uiGridCtrl.grid.api.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
                                $scope.stopEdit();
                            });
                        } else {
                            angular.element(document.querySelectorAll('.ui-grid-cell-contents')).on('click', onCellClick);
                        }
                        angular.element(window).on('click', onWindowClick);
                    });

                    $scope.$on('$destroy', function () {
                        angular.element(window).off('click', onWindowClick);
                        //$('body > .dropdown-menu, body > div > .dropdown-menu').remove();
                    });

                    $scope.stopEdit = function (evt) {
                        $scope.$emit(uiGridEditConstants.events.END_CELL_EDIT);
                    };

                    $elm.on('keydown', function (evt) {
                        switch (evt.keyCode) {
                            case uiGridConstants.keymap.ESC:
                                evt.stopPropagation();
                                $scope.$emit(uiGridEditConstants.events.CANCEL_CELL_EDIT);
                                break;
                        }
                        if (uiGridCtrl && uiGridCtrl.grid.api.cellNav) {
                            evt.uiGridTargetRenderContainerId = renderContainerCtrl.containerId;
                            if (uiGridCtrl.cellNav.handleKeyDown(evt) !== null) {
                                $scope.stopEdit(evt);
                            }
                        } else {
                            switch (evt.keyCode) {
                                case uiGridConstants.keymap.ENTER:
                                case uiGridConstants.keymap.TAB:
                                    evt.stopPropagation();
                                    evt.preventDefault();
                                    $scope.stopEdit(evt);
                                    break;
                            }
                        }
                        return true;
                    });
                }
            };
        }
    };
}]);
