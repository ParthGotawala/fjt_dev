(function () {
  'use strict';
  angular
    .module('app.core')
    .directive('stringToNumber', stringToNumber);

  /** @ngInject */
  function stringToNumber() {
    function link($scope, $element, attrs, ngModel) {
      ngModel.$parsers.push(function (value) {
        return '' + value;
      });
      ngModel.$formatters.push(function (value) {
        return parseFloat(value);
      });
    }

    var directive = {
      restrict: 'A',
      require: 'ngModel',
      link: link
    };
    return directive;
  }

  angular.module('app.core').directive('myCustomDropdown', function () {
    return {
      template: '<select class="form-control ui-grid-filter-input" ng-init="init()" ng-model="colFilter.term" ng-options="option.id as option.value for option in colFilter.options"></select>',
      //ng-init="colFilter.term = colFilter.term || colFilter.options[0].id"
      controller: function ($scope) {
        $scope.init = function () {
          if ($scope.colFilter) {
            $scope.colFilter.term = $scope.colFilter.term == undefined || ($scope.colFilter.term == null && $scope.colFilter.options && Array.isArray($scope.colFilter.options) && $scope.colFilter.options.length > 0) ? _.head($scope.colFilter.options).id : $scope.colFilter.term;
          }
        };
      }
    };
  })

  angular.module('app.core').directive('capitalize', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        var caretPos;
        var capitalize = function (inputValue) {
          caretPos = element[0].selectionStart; // save current caret position
          if (inputValue == undefined) inputValue = '';
          if (inputValue) {
            var capitalized = inputValue.toUpperCase();
            if (capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
              element[0].selectionStart = caretPos; // restore position
              element[0].selectionEnd = caretPos;
            }
            return capitalized;
          }
          return inputValue;
        }
        modelCtrl.$parsers.push(capitalize);
        capitalize(scope[attrs.ngModel]); // capitalize initial value
      }
    };
  });

  angular.module('app.core').directive('lowercase', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        var lowercase = function (inputValue) {
          if (inputValue == undefined) inputValue = '';
          if (inputValue) {
            var lowercased = inputValue.toLowerCase();
            if (lowercased !== inputValue) {
              modelCtrl.$setViewValue(lowercased);
              modelCtrl.$render();
            }
            return lowercased;
          }
          return inputValue;
        }
        modelCtrl.$parsers.push(lowercase);
        lowercase(scope[attrs.ngModel]); // capitalize initial value
      }
    };
  });

  angular.module('app.core').directive('timerClock', function ($interval, BaseService) {
    return {
      template: '<div class="label-warning cm-current-time"> \
                            <p class="cm-time-label">Current Time</p>\
                            <div class="cm-time-section">{{ clock }}</div> \
                       </div>',

      link: function (scope) {
        let tick = () => {
          scope.clock = BaseService.getCurrentTime();
        }
        tick();
        $interval(tick, 1000);
      }
    };
  })


  angular.module('app.core').directive('setClassWhenAtTop', function ($window, $document) {

    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var $win = angular.element(angular.element('#content')); // wrap window object as jQuery object
        var topClass = attrs.setClassWhenAtTop, // get CSS class from directive's attribute value
          offsetTop = element.offset().top; // get element's top relative to the document

        $win.on('scroll', function (e) {
          if ($win.scrollTop() >= offsetTop) {
            element.addClass(topClass);
          } else {
            element.removeClass(topClass);
          }
        });
      }
    };
  });

  angular.module('app.core').directive('myEnter', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if (event.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.myEnter);
          });
          event.preventDefault();
        }
      });
    };
  });

  angular.module('app.core').directive('scrollEnd', function () {
    return {
      restrict: 'A',
      scope: {
        scrollEndFn: '=?'
      },
      link: function (scope, $element, attrs) {
        $element.scroll(scrollFn);

        function scrollFn(e) {
          var divHeight = $(this).scrollTop();

          if (divHeight == 0) {
            scope.scrollEndFn();
          }
        }

        scope.$on('$destroy', function () {
          $element.off("scroll", scrollFn);
        });
      }
    }
  });

  angular.module('app.core').directive('scrollEndBottom', function () {
    return {
      restrict: 'A',
      scope: {
        scrollEndFn: '=?'
      },
      link: function (scope, $element, attrs) {
        $element.scroll(scrollFn);

        function scrollFn(e) {
          if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
            scope.scrollEndFn();
          }
        }

        scope.$on('$destroy', function () {
          $element.off("scroll", scrollFn);
        });

      }
    }
  });

  angular.module('app.core').directive('customAutoFocus', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, $element, attrs) {
        attrs.$observe('customAutoFocus', function (value) {
          if (value == 'true') {
            $timeout(function () {
              // For Apply Autofocus on AutoCompleted Type Element 
              var element = $($element[0]).find("input[type=search]");
              if (element.length > 0) {
                $(element).focus();
                $(element).addClass('md-focused');
              }
              else {
                $($element[0]).focus();
                $($element[0]).addClass('md-focused');
              }
            }, _configTimeout);
          }
        });
      }
    }
  });

  angular.module('app.core').directive('expressionValidator', function (CORE, $filter) {
    return {
      require: 'ngModel',
      link: function (scope, elem, attr, ngModel) {
        if (!attr.expressionValidator)
          return;

        var expressionValidator = JSON.parse(attr.expressionValidator);

        var ALL_OPERATOR = CORE.ALL_OPERATOR_JS_EXP;
        var CONDITIONS = CORE.CONDITIONS_JS_EXP;
        var DefaultDatrFormat = _dateDisplayFormat;

        //For DOM -> model validation
        ngModel.$parsers.unshift(function (value) {
          if (!value) {
            ngModel.$setValidity('expressionvalidator', true);
            return value;
          }
          var expression = generateWhareClause(value);
          var isValid = eval(expression);

          ngModel.$setValidity('expressionvalidator', isValid);
          return isValid ? value : undefined;
        });

        //For model -> DOM validation
        ngModel.$formatters.unshift(function (value) {
          if (!value) {
            ngModel.$setValidity('expressionvalidator', true);
            return value;
          }
          var expression = generateWhareClause(ngModel.$modelValue);
          var isValid = eval(expression);
          ngModel.$setValidity('expressionvalidator', isValid);

          //if (!isValid) {
          //    var formName = elem.closest('form').attr('name');
          //    if (formName) {
          //        var formElem = scope[formName];                            
          //        if (formElem && formElem[attr.name] && !formElem[attr.name].$dirty) {
          //            formElem[attr.name].$setDirty();
          //            //formElem[attr.name].$setTouched();
          //        }
          //    }
          //}

          return value;
        });

        // [S] Display expression as user readable string                

        function generateWhareClause(value) {

          var obj = {
            groupCount: 0,
            count: 0,
            sublevelCount: 0,
            expressionui: "",
            values: {
              "Value": value
            }
          };

          _.each(expressionValidator, function (group) {
            if (group.Nodes.length > 0) {
              getSubExpression(group, obj);
            }
          });
          if (obj.sublevelCount > 0) {
            for (var o = 0; o < obj.sublevelCount; o++) {
              obj.expressionui += ' ) ';
            }
          }
          return obj.expressionui;
        }

        function getSubExpression(group, obj) {
          var optionTypesArr = CORE.OPTIONTYPES_JS_EXP;
          var datatypes = CORE.DATATYPE;

          group.Nodes.forEach(function (node, index) {
            if (index > 0 && group.Condition) {
              obj.expressionui += ' ' + CONDITIONS[node.Condition || group.Condition] + ' ';
            }
            if (node.Selected) {
              if (obj.groupCount > 0 && obj.count !== obj.groupCount) {
                obj.count = obj.groupCount;
                obj.expressionui += ' ( ';
              }
              if (node.Selected.OptionType == optionTypesArr[0]) {
                var valText = "";
                if (datatypes.NUMBER.indexOf(node.datatype) != -1) {
                  valText = node.OperatorValue != null ? node.OperatorValue : "";
                  obj.expressionui += stringFormat(ALL_OPERATOR[node.Selected.Operator.Value], obj.values[node.Selected.FieldName.Column_name], valText);
                }
                else if (datatypes.STRING.indexOf(node.datatype) != -1) {
                  var operatorValue = node.Selected.Operator.Value;
                  valText = node.OperatorValue || "";
                  obj.expressionui += stringFormat(ALL_OPERATOR[node.Selected.Operator.Value], '"' + obj.values[node.Selected.FieldName.Column_name].replace(/"/g, "'") + '"', '"' + valText.replace(/"/g, "'") + '"');
                }
                else if (datatypes.DATE.indexOf(node.datatype) != -1) {
                  var fieldVal = null;
                  if (node.datatype == "date") {
                    if (node.OperatorValue)
                      valText = stringFormat("new Date('{0}')", $filter('date')(new Date(node.OperatorValue), DefaultDatrFormat));
                    fieldVal = stringFormat("new Date('{0}')", $filter('date')(new Date(obj.values[node.Selected.FieldName.Column_name]), DefaultDatrFormat));
                  }
                  else if (node.datatype == "datetime") {
                    if (node.OperatorValue)
                      valText = stringFormat("new Date('{0}')", node.OperatorValue);
                    fieldVal = stringFormat("new Date('{0}')", obj.values[node.Selected.FieldName.Column_name]);
                  }
                  //obj.expressionui += fieldVal + ' ' + node.Selected.Operator.Value.replace('{SYS_DATE}', 'new Date()') + ' ' + valText;
                  obj.expressionui += stringFormat(ALL_OPERATOR[node.Selected.Operator.Value], fieldVal, valText);
                }
                else if (datatypes.TIME.indexOf(node.datatype) != -1) {
                  if (node.OperatorValue)
                    valText = stringFormat("'{0}'", node.OperatorValue);
                  var fieldVal = stringFormat("'{0}'", $filter('date')(new Date(obj.values[node.Selected.FieldName.Column_name]), DefaultDatrFormat));
                  obj.expressionui += stringFormat(ALL_OPERATOR[node.Selected.Operator.Value], fieldVal, valText).replace('new Date()', 'moment().format(\'' + _timeDisplayFormat + '\')');
                }
                else {
                  valText = node.Selected.BooleanVal != null ? node.Selected.BooleanVal.Value : "";
                  obj.expressionui += obj.values[node.Selected.FieldName.Column_name] + ' ' + node.Selected.Operator.Value + ' ' + valText;
                }
              }
              else if (node.Selected.OptionType == optionTypesArr[1]) {
                obj.expressionui += ' ( ' + stringFormat(ALL_OPERATOR[node.Selected.Operator.Value],
                  node.Selected.SelectedExpression.Expression.replace(/{([^}]+)}/g, function (x) { return obj.values[x.replace(/[{}]/g, '')]; }), node.OperatorValue) + ' ) ';
              }
            }

            if (obj.groupCount > 0 && group.ParentGroupLevel != null && index == group.Nodes.length - 1) {
              if (group.SubLevel == 1) {
                obj.expressionui += ' ) ';
              }

              if (group.SubLevel > 1) {
                obj.sublevelCount++;
              }
            }

            if (node.Nodes && node.Nodes.length > 0) {
              obj.groupCount++;
              getSubExpression(node, obj);
            }
          });
        }
        // Ends

      }
    };
  });

  angular.module('app.core').directive('breadcrumbs', function ($state, $timeout, BaseService, DASHBOARD) {
    return {
      restrict: 'E',
      scope: true,
      template: '<md-icon md-font-icon="icon-home" ng-click="GoToHome()" class="s16 cursor-pointer md-accent homelink">\
                        <md-tooltip>Dashboard</md-tooltip></md-icon>\
                        <span class="parent" ng-repeat="item in crumbs">\
                            <md-icon md-font-icon="icon-chevron-right" class="s16 separator">\
                            </md-icon>\
                            <a class="breadcrumbs-link text-underline"  target="_blank" ui-sref="{{item.uisref}}" ng-if="item.uisref">\
                                {{item.title}}\
                            </a>\
                            <span ng-if="!item.uisref">{{item.title}}</span>\
                        </span>',
      link: function (scope) {
        let stateChangeSuccess = scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
          // console.log('stateChanged 3');
          $timeout(() => {
            scope.crumbs = BaseService.getCrumbs();
          }, _configBreadCrumbTimeout);

          scope.GoToHome = () => {
            $state.go(DASHBOARD.DASHBOARD_STATE);
          };
        });
        let getBreadcrumbAfterReload = scope.$on('getBreadcrumbAfterReload', function (event) {
          $timeout(() => {
            scope.crumbs = BaseService.getCrumbs();
          }, _configBreadCrumbTimeout);

          scope.GoToHome = () => {
            $state.go(DASHBOARD.DASHBOARD_STATE);
          };

          //scope.$on('breadcrumb', function () {
          //  scope.crumbs = BaseService.getCrumbs();
          //});
        });
        let setBreadCrumb = scope.$on('breadcrumb', function () {
          scope.crumbs = BaseService.getCrumbs();
        });
        scope.$on('$destroy', function () {          setBreadCrumb();          stateChangeSuccess();          getBreadcrumbAfterReload();        });
      }
    };
  });

  angular.module('app.core').directive('pagetitle', function ($state, $timeout, BaseService, $rootScope) {
    return {
      restrict: 'E',
      scope: {
        isList: '=?',
        prefixContent: '=?',
        isDisplayMenuName: '=?',
        suffixContent: '=',
        prefixPageTitle: '=?'
      },
      template: '<span style="display:flex !important;" ng-if="isList" class="header-title">\
                            <md-icon ng-if="pageDetails.iconClass" md-font-icon="{{pageDetails.iconClass}}"></md-icon>&nbsp;\
                           {{prefixContent}}\
                            <span class="header-title" ng-if="isDisplayMenuName">&nbsp;{{pageDetails.displayMenuName}}</span>\
                       </span>\
                       <span ng-if="!isList" class="header-title">\
                            {{prefixContent}}\
                            <span ng-if="isDisplayMenuName">{{pageDetails.displayMenuName}}</span>{{suffixContent}}\
                       </span>',
      link: function (scope) {
        function setPageTitle(stateName) {
          $timeout(() => {
            let objPage = BaseService.getPageTitle(stateName);
            scope.pageDetails = objPage ? objPage.PageDetails : "";
            $rootScope.pageTitle = null;
            if (objPage && objPage.PageDetails && objPage.PageDetails.displayMenuName) {
              $rootScope.pageTitle = (scope.prefixPageTitle ? (scope.prefixPageTitle + (scope.isDisplayMenuName ? " | " : "")) : "") + (scope.isDisplayMenuName ? objPage.PageDetails.displayMenuName : "");
            }
          }, _configPageTitleTimeout);
        }
        scope.$watch('prefixPageTitle', function (value) {
          setPageTitle(scope.stateDetail);
        });
        scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
          scope.stateDetail = toState.name;
          setPageTitle(scope.stateDetail);
        });
        scope.$on('getPageTitleAfterReload', function (event, toState) {
          scope.stateDetail = toState.name;
          setPageTitle(scope.stateDetail);
        });
      }
    };
  });

  angular.module('app.core').directive('textatcaret', function () {
    return {
      link: function (scope, element, attrs) {
        scope.$on('textatcaret', function (e, val) {
          var domElement = element[0];

          if (document.selection) {
            //  domElement.focus();
            var sel = document.selection.createRange();
            sel.text = val;
            $(domElement).trigger("change").focus();
          } else if (domElement.selectionStart || domElement.selectionStart === 0) {
            var startPos = domElement.selectionStart;
            var endPos = domElement.selectionEnd;
            var scrollTop = domElement.scrollTop;
            domElement.value = domElement.value.substring(0, startPos) + val + domElement.value.substring(endPos, domElement.value.length);
            $(domElement).trigger("change").focus();
            domElement.selectionStart = startPos + val.length;
            domElement.selectionEnd = startPos + val.length;
            domElement.scrollTop = scrollTop;
          } else {
            domElement.value += val;
            $(domElement).trigger("change").focus();
          }

        });
      }
    }
  });

  angular.module('app.core').directive('escKey', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if (event.which === 27) {
          scope.$apply(function () {
            scope.$eval(attrs.escKey);
          });
          event.preventDefault();
        }
      });
    };
  });

  // directive for switch to add notranslate class globally
  angular
    .module('app.core')
    .directive('noTranslateClass', noTranslateClass);

  /** @ngInject */
  function noTranslateClass() {
    function link($scope, $element, attrs, ngModel) {
      if ($element) {
        $($element).addClass("notranslate");
      }
    }

    var directive = {
      restrict: 'A',
      link: link
    };
    return directive;
  }

  angular.module('app.core').directive('datePickerNoTranslateClass', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, $element, attrs) {
        $timeout(function () {
          var myDatePicker = angular.element(document.getElementsByClassName("md-datepicker-calendar-pane"));
          _.each(myDatePicker, (divItem) => {
            divItem.classList.add("notranslate")
          });
        });
      }
    }
  });

  // we have to set 'ADD NEW' button into autocomplete as a fix into scroll
  // for that we require to add class into parent li element of button div
  // which is not possible by CSS, so adding class into li element by directive
  angular.module('app.core').directive('assignliClass', function () {
    return {
      link: function (scope, element, attrs) {
        var isBtn = attrs.assignliClass;
        if (isBtn == 'true') {
          $(element).closest('md-autocomplete-parent-scope').closest('li').addClass('li-autocomp-btn');
        }
      }
    }
  });


  // we have to set 'z-index' of md-dialog popup
  angular.module('app.core').directive('assignMdDailogClass', function () {
    return {
      link: function (scope, element, attrs) {
        $(element).parent().addClass('custom-dialog-class');
        $(element).parent().attr('id', 'timeout-modal-popup');
      }
    }
  });

  angular.module('app.core').directive('includeReplace', function () {
    return {
      require: 'ngInclude',
      restrict: 'A', /* optional */
      link: function (scope, el, attrs) {
        setTimeout(() => {
          el.replaceWith(el.children());
        }, 0)
      }
    };
  });

  // This directive is to override the on click functionality of md-tabs
  // on click on tab, callback function is passed to controller. If return true then and only change the tab.
  angular.module('app.core').directive('mdTabItem', function (CORE, DialogFactory) {
    return {
      link: function (scope, element, attrs) {
        // get form wizard
        var msWizard = scope.tab.parent.msWizard;

        // if form wizard is not used then return as form wizard is necessary for form validation
        if (!msWizard)
          return;

        var mdTabsElem = element.closest('md-tabs');

        // if flag is false then do not check validation 
        var validate = mdTabsElem.attr('validate-step');
        if (validate != 'true')
          return;

        // get scope of 
        var tabScope = angular.element(mdTabsElem).scope();
        var stepValidFn = mdTabsElem.attr('is-valid');

        // ng-click event of tab
        // store into variable to use further
        var ngClick = attrs.ngClick;

        // remove ng-click event of tab
        element.unbind('click');
        // remove ng-click event of tab
        element.unbind('keydown');

        const validateTabChange = (e) => {
          // prevent self click event
          if (e.currentTarget.className.contains('md-active')) {
            return;
          }
          // current active tab index
          var currIndex = msWizard.selectedIndex;

          if (stepValidFn) {
            // execute function which is defined as an attribute into <md-tabs> element
            var callback = tabScope.$eval(`${stepValidFn}(${currIndex})`);

            // if boolean value
            if (typeof callback == 'boolean' && callback) {
              // execute tab ng-click event
              scope.$eval(ngClick);
            }
            // if promise then wait for reposne
            else if (typeof callback == 'object') {
              callback.then((result) => {
                if (typeof result == 'boolean' && result) {
                  // execute tab ng-click event
                  scope.$eval(ngClick);
                }
              });
              //return false;
            }
            else {
              // execute tab ng-click event
              scope.$eval(ngClick);
            }
          }
          else
            // execute tab ng-click event
            scope.$eval(ngClick);
        }
        // add our own keydown event to tab
        element.bind('keydown', function (e) {
          // Validate Tab change by press (Space - 32) and (Enter - 13) Key
          if (e.keyCode === 32 || e.keyCode === 13) {            
            e.preventDefault();
            e.stopPropagation();
            const confiromaionModelOpen = $(".confirmation-model");
            if (confiromaionModelOpen.length === 0) {
              validateTabChange(e);
            }
          }
        });
        // add our own ng-click event to tab
        element.bind('click', function (e) {
          validateTabChange(e);
        });
      }
    }
  });

  //  // directive for text area resize on type
  //  angular
  //  .module('app.core')
  //  .directive('autoResize', autoResize);
  //  autoResize.$inject = ['$timeout'];
  // /** @ngInject */
  // function autoResize($timeout) {
  //     var directive = {
  //         restrict: 'A',
  //         link: function autoResizeLink(scope, element, attributes, controller) {
  //             $timeout(function () {
  //                 expand(element[0]);
  //             }, 100);
  //             element.on('input', function () {
  //                 expand(element[0]);
  //             });
  //             function expand(element){
  //      	        var scrollHeight = element.scrollHeight -60; // replace 60 by the sum of padding-top and padding-bottom
  //                  element.style.height =  scrollHeight + "px";  
  //             }
  //         }
  //     };
  //     return directive;
  // };

  //angular.module('app.core').directive('allowDecimalNumbers', function () {
  //    return {
  //        restrict: 'A',
  //        link: function (scope, elm, attrs, ctrl) {
  //            elm.on('keydown', function (event) {
  //                var $input = $(this);
  //                var value = $input.val();
  //                value = value.replace(/[^0-9\.]/g, '')
  //                var findsDot = new RegExp(/\./g)
  //                var containsDot = value.match(findsDot)
  //                if (containsDot != null && ([46, 110, 190].indexOf(event.which) > -1)) {
  //                    event.preventDefault();
  //                    return false;
  //                }
  //                $input.val(value);
  //                if (event.which == 64 || event.which == 16) {
  //                    // numbers  
  //                    return false;
  //                } if ([8, 9, 13, 27, 37, 38, 39, 40, 110, 17, 86, 67, 189].indexOf(event.which) > -1) {
  //                    // backspace, enter, escape, arrows, ctrl , c ,v  
  //                    return true;
  //                } else if (event.which >= 48 && event.which <= 57) {
  //                    // numbers  
  //                    return true;
  //                } else if (event.which >= 96 && event.which <= 105) {
  //                    // numpad number  
  //                    return true;
  //                } else if ([46, 110, 190].indexOf(event.which) > -1) {
  //                    // dot and numpad dot  
  //                    return true;
  //                } else {
  //                    event.preventDefault();
  //                    return false;
  //                }
  //            });
  //        }
  //    }
  //});

  angular.module('app.core').directive('inputNumberDecimalPlace', function ($timeout) {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        var stepDecimalPlace = countDecimals(parseFloat(attrs.step || 0));

        scope.$watch(attrs.ngModel, (newValue, oldValue) => {
          if (newValue != oldValue) {
            if (typeof newValue != 'undefined' && newValue != null) {
              var inputDecimalPlace = countDecimals(parseFloat(newValue));
              if (inputDecimalPlace > stepDecimalPlace) {
                var convertedValue = newValue.toFixed(stepDecimalPlace);
                modelCtrl.$setViewValue(convertedValue);
                modelCtrl.$render();
              }
            }
          }
        });
      }
    };
  });

  angular.module('app.core').directive('ignoreDirty', function ($timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, elm, attrs, modelCtrl) {
        modelCtrl.$setPristine = function () { };
        modelCtrl.$pristine = false;
      }
    }
  });
  angular.module('app.core').directive('lastElement', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        attrs.$observe('elementcondition', function (condition) {
          condition = (typeof (condition) === "string") ? ((condition.toLowerCase() === "true") ? true : false) : false;

          var isPressShift = false;
          element.data("focus", condition);       // Assign current status of element for bind focus logic
          $timeout(function () {
            /*changes done to manage last element in auto complete, checked with DV on 16-03-21*/
            let lastElement = element && element[0].tagName === 'FORM' ? element.find('input') : element;
            lastElement.on('keydown', function (e) {
              var focusBtnId = $(element).attr("data-focusButton") ? $(element).attr("data-focusButton") : "saveBtn";
              var elementStatus = $(element).data("focus");
              if (elementStatus) {
                isPressShift = false;
                if (e.shiftKey) {
                  isPressShift = true;
                }
                // For revert foucs to last element from "Save" button (Shift + Tab)

                if (e.which == 9 && !isPressShift) {
                  var saveBtnDisable = $("#" + focusBtnId).is(":disabled");
                  if (!saveBtnDisable) {
                    e.stopImmediatePropagation();
                    e.preventDefault();

                    // If their is multiple "Save Button" Whoes (Id = 'saveBtn') then focus will apply to first element
                    $("#" + focusBtnId).focus();

                    $("#" + focusBtnId).off("keydown");
                    $("#" + focusBtnId).on('keydown', function (e) {
                      isPressShift = false;
                      if (e.shiftKey) {
                        isPressShift = true;
                      }
                      if (e.which == 9 && isPressShift) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        // Check last Element "form" or not for (Custom Auto-Complete Directive) and find first (Input element from Form)
                        if (element.is("form")) {
                          var lastElement = element.find(":input").first();
                          if (lastElement.length > 0) { lastElement.focus(); }
                        } else {
                          element.focus();
                        }
                      }
                    });
                  }
                }
              }
            });
          });
        });
      }
    }
  });
  angular.module('app.core').directive('highlightsfont', function ($timeout) {
    return {
      restrict: 'E',
      scope: {
        title: '@'
      },
      link: function (scope, element, attrs) {
        scope.$watch(
          function () { return element[0].children; },
          function (newValue, oldValue) {
            var searchText = $("#enterpriseSearchTxt").val();
            let chatSearch = $("#chatsearch").val();
            if (!chatSearch) {
              chatSearch = $("#chatsearch1").val();
            }
            if (searchText && !chatSearch) {
              searchText = searchText;
            } else if (!searchText && chatSearch) {
              searchText = chatSearch;
            } else if (searchText && chatSearch) {
              searchText = searchText + ' ' + chatSearch;
            } else if (!searchText && !chatSearch) {
              searchText = null;
            }
            if (searchText && newValue.length > 0 && newValue[0]) {
              var searchTextArry = searchText.split(/[\s]/);

              var searchCriteria = "";
              for (var i = 0; i < searchTextArry.length; i++) {
                var searchWords = [];
                if (searchTextArry[i]) {
                  searchWords.push(searchTextArry[i]);
                  var withoutSpecialChar = searchTextArry[i].split(/[\-+]/);
                  searchWords = searchWords.concat(withoutSpecialChar);

                  for (var word = 0; word < searchWords.length; word++) {
                    if (searchWords[word]) {
                      var searchWord = searchWords[word].replace(/[^a-zA-Z0-9 ]/gi, "\\$&");   // Replace Special Character with 'BackSlash'      
                      var specialCharcterExpre = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

                      searchWord = specialCharcterExpre.test(searchWord.charAt(searchWord.length - 1)) ? searchWord + "\\B" : searchWord + "\\b"; // Attach "\B" if last charcter is special character else "\b"

                      searchCriteria = searchCriteria ? searchCriteria + "|" + searchWord : searchWord; // Add white-space with "|" or operation for divide word with "OR" operation
                    }
                  }
                }
              }
              searchCriteria = specialCharcterExpre.test(searchCriteria.charAt(0)) ? searchCriteria : "\\b" + searchCriteria; // Attach "\b" if first charcter is not special character
              searchCriteria = specialCharcterExpre.test(searchCriteria.charAt(searchCriteria.length - 1)) ? searchCriteria + "\\B" : searchCriteria; // Attach "\B" if last charcter is special character else "\b"
              if (chatSearch) {
                newValue[0].innerHTML = newValue[0].innerHTML.replace(new RegExp("(" + searchCriteria + ")(?!([^<]+)?>)", "gi"), '<span class="highlightedChatText">$&</span>');
              } else {
                newValue[0].innerHTML = newValue[0].innerHTML.replace(new RegExp("(" + searchCriteria + ")(?!([^<]+)?>)", "gi"), '<span class="highlightedText">$&</span>');
              }
            }
          });
      }
    }
  });

  angular.module('app.core').directive('readOnlyForm', function ($timeout, BaseService) {
    return {
      restrict: 'A',
      link: (scope, element, attrs) => {
        attrs.$observe('isreadonly', (condition) => {
          let readOnlyMethodTimeout = null;
          angular.element(document).ready(() => {
            condition = (typeof (condition) === 'string') ? ((condition.toLowerCase() === 'true') ? true : false) : false;
            if (condition) {
              if (attrs.$$element[0].length === 1 || attrs.$$element[0].length === undefined) {
                const element = attrs.$$element[0];
                /// Check Data Property of Element for Exclude ReadOnly Configuration
                if (!angular.element(item).data('excludereadonly')) {
                  angular.element(element).removeAttr('ng-disabled');
                  $timeout(() => {
                    angular.element(element).attr('disabled', true);
                  });
                }
                if (element.children && element.children.length > 0) {
                  clearTimeout(readOnlyMethodTimeout);
                  readOnlyMethodTimeout = setTimeout(() => {
                    BaseService.disableReadOnlyControl(element.children);
                  }, _configTimeout);
                }
              } else {
                const observer = new MutationObserver((mutations) => {
                  const updatedElement = mutations[mutations.length - 1];
                  if (condition) {
                    clearTimeout(readOnlyMethodTimeout);
                    readOnlyMethodTimeout = setTimeout(() => {
                      updatedElement.target.children.forEach((item) => {
                        BaseService.disableReadOnlyControl(item.children);
                      });
                    }, _configTimeout);
                  }
                });

                observer.observe(element[0], {
                  attributes: true,
                  childList: true
                });
                readOnlyMethodTimeout = setTimeout(() => {
                  console.log(1);
                  element[0].children.forEach((item) => {
                    BaseService.disableReadOnlyControl(item.children);
                  });
                }, _configTimeout);
              }
            };
          });
        });
      }
    };
  });
  angular.module('app.core').directive('customBlur', function ($parse) {
    return function (scope, element, attrs) {
      element.bind("blur", function (event) {
        if (element && element[0] != document.activeElement) {
          var fn = $parse(attrs.customBlur);
          var callback = function () {
            fn(scope, { $event: event });
          };
          scope.$applyAsync(callback);
          event.preventDefault();
        }
      });
    };
  });

  angular.module('app.core').directive('pricingJsonTable', function () {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        partDet: '=?'
      },
      template: `<table ng-if="vm.isObject || vm.isArray" class="table table-bordered table-condensed" >
          <tr ng-repeat="(key, value) in vm.partDet track by $index">
          <th ng-if="!vm.isArray">{{key}}</th>
          <td ng-if="vm.isArray">
          <pricing-json-table part-det="value"></pricing-json-table>
          </td>
          <td ng-if="vm.isObject"> <pricing-json-table part-det="value"></pricing-json-table></td>
          </tr>
          </table>
          <span ng-if="!vm.isObject && !vm.isArray">{{vm.partDet}}</span>`,
      controllerAs: 'vm',
      controller: function ($scope, $element, $attrs, $filter) {
        const vm = this;
        vm.isArray = _.isArray($scope.partDet) ? true : false;
        vm.isObject = vm.isArray ? false : (typeof $scope.partDet == "object" ? true : false);
        vm.partDet = $scope.partDet;
        //console.log(vm.partDet);
      }
    };
  })

  angular.module('app.core').directive("ngMatch", ["$parse", function ($parse) {
    var directive = {
      link: link,
      restrict: 'A',
      require: '?ngModel'
    };

    return directive;

    /////////////////////////

    function link(scope, elem, attrs, ctrl) {
      // if ngModel is not defined, we don't need to do anything
      if (!ctrl) return;
      if (!attrs["ngMatch"]) return;

      var firstPassword = $parse(attrs["ngMatch"]);

      var validator = function (value) {
        var temp = firstPassword(scope),
          v = value === temp;
        ctrl.$setValidity('match', v);
        return value;
      }

      ctrl.$parsers.unshift(validator);
      ctrl.$formatters.push(validator);
      //attrs.$observe("ngMatch", function () {
      //    validator(ctrl.$viewValue);
      //});

      scope.$watch(attrs.ngMatch, function () {
        validator(ctrl.$viewValue);
      })

    }

  }]);

  angular.module('app.core').directive('mdIcon', function () {
    return {
      restrict: 'E',
      replace: false,
      link: function (scope, element, attrs) {
        $(element).prepend('<span class="t-ic-span"><span class= "ic-first-line" ></span><span class="ic-second-line"></span><span class="ic-border"></span></span>');
      }
    }
  });

  angular
    .module('app.core')
    .directive('mdBlur', function ($timeout) {
      var directive = {
        restrict: 'A',
        link: function (scope, element, attributes) {
          $timeout(function () {
            angular.element(element[0].querySelector("input.md-input")).bind("blur", function () {
              $timeout(function () {
                scope.$eval(attributes.mdBlur);
              }, 100);
            });
          }, 0);
        }
      };

      return directive;
    });
  angular.module('app.core').directive('mdDialog', function ($compile, $timeout) {
    return {
      restrict: 'E',
      replace: false,
      link: function (scope, element, attrs) {
        $timeout(() => {
          //document.querySelector('a')
          //1. Find md toolbar and close button
          //2. Prepend fullscreen button
          //3. Implement click button and apply class in md dialog 
          scope.isFullScreen = false;
          scope.viewfullscreen = () => {
            scope.isFullScreen = !scope.isFullScreen;
            scope.isFullScreen ? $(element).addClass("fullscreen-view") : $(element).removeClass("fullscreen-view");
          }
          var buttonHtml = '<md-button class="md-icon-button" ng-click="viewfullscreen()">\
        <md-icon role="img" class="material-icons font-size-20 width-auto height-auto mat-icon {{isFullScreen ? \'icon-fullscreen-exit\' : \'icon-fullscreen\'}}" ></md-icon> \
        <md-tooltip>{{isFullScreen ? \'Exit Full Screen View\' : \'Full Screen View\'}}</md-tooltip>\
      </md-button>';
          if (element) {
            let toolbarEle = element.find("md-toolbar");
            if (toolbarEle) { 
              $(toolbarEle).addClass('cm-square-icon-btn');
              let closeBtn = toolbarEle.find(".icon-close");
              if (closeBtn) {
                let btnParent = closeBtn.parent();
                if (btnParent) {
                  let btnParentDiv = btnParent.parent();
                  //btnParent.insertAdjacentHTML("beforebegin", $compile(buttonHtml)(scope));
                  btnParent.before($compile(buttonHtml)(scope));
                }
              }
            }
          }
        }, 0);
      }
    }
  });
})();
