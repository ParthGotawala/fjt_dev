(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('customAutoComplete', customAutoComplete);

  /** @ngInject */
  function customAutoComplete($filter, $timeout, $window, DialogFactory, CORE, BaseService) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        datalist: '=',
        parentColumnName: '=?',
        columnName: '=?',
        controllerName: '=?',
        viewTemplateUrl: '=?',
        keyColumnName: '=?',
        keyColumnId: '=',
        inputName: '=?',
        placeholderName: '=?',
        isRequired: '=?',
        isAddnew: '=?',
        callbackFn: '=',
        onSelectCallbackFn: '=?',
        parentId: '=?',
        isDisabled: '=?',
        callbackFnParam: '=?',
        isAddalias: '=?',
        searchText: '=?',
        addData: '=?',
        mdRequireMatch: '=?',
        isRefreshDisabled: '=?',
        isAddFromRoute: '=?',
        routeName: '=?',
        inputId: '=?',
        maxLength: '=?',
        isSearchTextUppercase: '=?',
        onBlurCallbackFn: '=?'
      },
      templateUrl: 'app/directives/custom/autocomplete/autocomplete.html',
      controller: autocompletectrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function autocompletectrl($scope, $element, $attrs, $timeout) {
      const vm = this;
      const _maxlength = 2000;
      vm.columnName = $scope.columnName;
      vm.inputName = $scope.inputName;
      vm.inputId = $scope.inputId;
      $scope.mdRequireMatch = $scope.mdRequireMatch === null ? true : $scope.mdRequireMatch;
      vm.placeholderName = $scope.placeholderName;
      vm.isAddnew = $scope.isAddnew;
      vm.selectedMfg = $scope.addData;
      vm.isAddalias = $scope.isAddalias;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.PartCorrectList = CORE.PartCorrectList;
      $scope.maxLength = $scope.maxLength || _maxlength;
      const oldkeyColumnid = $scope.keyColumnId;

      //vm.isRequired = $scope.isRequired;
      //vm.isDisabled = $scope.isDisabled;
      const setAddNewButton = () => {
        vm.isAddnew = $scope.isAddnew;
        vm.fixedOnes = [];
        if (vm.isAddnew) {
          vm.fixedOnes = [{ [$scope.columnName]: vm.CORE_MESSAGE_CONSTANT.ADD_NEW, type: 'button' }];
        }
      };
      setAddNewButton();


      if (vm.isAddalias) {
        vm.fixedOnes = [{ [$scope.columnName]: vm.CORE_MESSAGE_CONSTANT.ADD_NEW, type: 'button' },
        { [$scope.columnName]: vm.CORE_MESSAGE_CONSTANT.ADD_NEW_ALIAS, type: 'button' }];
      }

      vm.checkMaxlength = () => {
        const findObj = _.find(vm.dataList, (item) => {
          if (item && vm.autocompleteDetail[vm.inputName]) {
            return item[$scope.columnName] === vm.autocompleteDetail[vm.inputName].$viewValue;
          }
        });
        return findObj ? _maxlength : $scope.maxLength;
      };

      vm.getMaxLengthValidation = (maxLength) => BaseService.getMaxLengthValidation(maxLength, (vm.autocompleteDetail[vm.inputName] ? vm.autocompleteDetail[vm.inputName].$viewValue.length : 0));

      $scope.$watch('searchText', (newVal, oldval) => {
        if (newVal !== oldval) {
          vm.searchText = newVal;
        }
      });
      $scope.$on(vm.inputName + 'searchText', (ev, args) => {
        if (args) {
          $scope.searchText = args;
          vm.autocompleteDetail[vm.inputName].$setTouched();
        }
        else {
          $timeout(() => {
            /* added in time out as >> to clear number type text from auto complete, (sales order page Quote Group) */
            $scope.searchText = '';
          });
          vm.selectedItem = null;
          querySearch();
        }
        $scope.$applyAsync();
      });

      $scope.$on(vm.inputName + 'ResetAutoComplete', () => {
        $scope.searchText = '';
        vm.selectedItem = null;
        vm.autocompleteDetail[vm.inputName].$setTouched();
        vm.autocompleteDetail[vm.inputName].$setUntouched();
        vm.autocompleteDetail[vm.inputName].$error = {};
        $scope.$applyAsync();
        $timeout(() => {
          setAddNewButton();
        }, 0);
      });

      const querySearch = (query) => {
        $scope.searchText = query;

        if (vm.isAddnew || vm.isAddalias) {
          if (vm.isAddnew) {
            vm.fixedOnes[0].previousResult = query;
          }
          if (vm.isAddalias) {
            vm.fixedOnes[0].previousResult = query;
            vm.fixedOnes[1].previousResult = query;
          }
        }
        if ($scope.datalist && $scope.datalist.length > 0) {
          // filter data with isActive =true with old selected
          //          if (($scope.datalist[0] && $scope.datalist[0].hasOwnProperty('isActive')) || ($scope.datalist[0] && $scope.datalist[0].hasOwnProperty('active'))) {

          if (Object.prototype.hasOwnProperty.call($scope.datalist[0], 'isActive') || Object.prototype.hasOwnProperty.call($scope.datalist[0], 'active')) {
            $scope.datalist = _.filter($scope.datalist, (dataobj) => {
              if ((oldkeyColumnid && dataobj[$scope.keyColumnName] === oldkeyColumnid) || dataobj.isActive || dataobj.active) {
                return true;
              }
            });
          }
          if ($scope.parentColumnName) {
            return customFilter(query);
          }
          else {
            return $filter('filter')($scope.datalist, { [$scope.columnName]: query });
          }
        }
        else {
          return [];
        }
      };

      vm.querySearch = querySearch;

      const mdKeyDownEvent = (event) => {
        if (!event.originalEvent.altKey &&
          !event.originalEvent.ctrlKey &&
          !event.originalEvent.shiftKey) {
          if (event.originalEvent.keyCode === 9 && vm.searchText !== '' && vm.searchText !== undefined && vm.searchText !== null && !$scope.keyColumnId) {
            const foundSelectedInList = document.querySelector('#selected_option');
            if (!foundSelectedInList) {
              /*as per discussion with Dixitbhai on 21-02-2020
              Old Logic: select value on tab keypress if the list has only one item
              New Logic: if user press tab then select the first value, no matter how many values are there in the list

              keeping comment for refrence*/
              /*var filteredData = $filter('filter')($scope.datalist, { [$scope.columnName]: vm.searchText });
              if (filteredData.length == 1) {
                  vm.selectedItem = filteredData[0];
              }*/
              const filteredData = _.filter($scope.datalist, (item) => item && !item.type && item[$scope.columnName] &&
                item[$scope.columnName].toString().toLowerCase().indexOf(vm.searchText ? vm.searchText.toLowerCase() : '') > -1);
              if (filteredData && filteredData.length > 0) {
                //added timeout for not able to select while use tab on sales order page 'Quote Group' list
                //vm.selectedItem = filteredData[0];
                $timeout(() => {
                  vm.selectedItem = filteredData[0];
                });
              }
            }
          }
        }
        if ($scope.onBlurCallbackFn) {
          vm.onBlurEventFn(event);
        }
      };

      vm.mdKeyDownEvent = mdKeyDownEvent;

      $scope.$watch('keyColumnId', (newVal, oldVal) => {
        if (newVal !== oldVal && newVal !== undefined) {
          if (newVal || newVal === 0) {
            vm.selectedItem = _.find($scope.datalist, (obj) => newVal === obj[$scope.keyColumnName]);
          }
          else {
            vm.selectedItem = null;
            /* commented $scope.searchText = '' to solve below -
             Bug 34996: [Global] When user type any value to search in Autocomplete then autocomplete gets empty */
            //$scope.searchText = ''; /*added to clear number type text from auto complete, (sales order page Quote Group)*/
          }
        }
      });

      let isAddNew = false;
      const selectedItemChange = (item, form, controlName) => {
        //create dummy event for Dialog to follow theme

        //let ev = $.Event("click");
        //$("body").trigger(ev);

        if (item) {
          $scope.keyColumnId = item[$scope.keyColumnName];
          //vm.selectedItem = _.find($scope.datalist, (obj) => {
          //    return $scope.keyColumnId == obj[$scope.keyColumnName];
          //});
          if (item.type === 'button') {
            if ($scope.isAddFromRoute) {
              $scope.keyColumnId = '';
              BaseService.openInNew($scope.routeName, $scope.addData.routeParams);
            } else {
              /* check user have access to popup (page access rights) */
              if ($scope.addData && $scope.addData.popupAccessRoutingState && $scope.addData.popupAccessRoutingState.length > 0) {
                //let loginUserAllAccessPageRoute = _.map(loginUserAllAccessPages, (item) => {
                const loginUserAllAccessPageRoute = _.map(BaseService.loginUserPageList, (item) => item.PageDetails && item.PageDetails.pageRoute);
                const isAllowToAccessPopup = $scope.addData.popupAccessRoutingState.every((elem) => loginUserAllAccessPageRoute.indexOf(elem) > -1);

                if (!isAllowToAccessPopup) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.POPUP_ACCESS_DENIED);
                  messageContent.message = stringFormat(messageContent.message, $scope.addData.pageNameAccessLabel ? $scope.addData.pageNameAccessLabel.toLowerCase() : 'this');
                  const model = {
                    messageContent: messageContent,
                    multiple: true
                  };
                  DialogFactory.messageAlertDialog(model).then(() => {
                    setFocus();
                    callbackInsertedData(null);
                  });
                  return false;
                }
              }

              const ev = angular.element.Event('click');
              angular.element('body').trigger(ev);
              const data = {
                Name: item.previousResult ? item.previousResult : null,
                Title: $scope.inputName ? $scope.inputName : null,
                Id: $scope.keyColumnId,
                parentId: $scope.parentId,
                Button: item[$scope.columnName]
              };
              Object.assign(data, $scope.addData);
              if (!isAddNew) {
                isAddNew = true;
                DialogFactory.dialogService(
                  $scope.controllerName,
                  $scope.viewTemplateUrl,
                  ev,
                  data).then((insertedData) => {
                    setFocus();
                    callbackInsertedData(insertedData);
                    isAddNew = false;
                  }, (insertedData) => {
                    setFocus();
                    callbackInsertedData(insertedData);
                    isAddNew = false;
                  }, (error) => BaseService.getErrorLog(error));
              }
              //$timeout(() => {
              //    $scope.vm.selectedItem = null;
              //}, 700);
            }
          }
          else {
            if (isAddNew === true) {
              if (item) { item.isAddNew = true; };
              isAddNew = false;
            }
            // while select any list item
            if ($scope.onSelectCallbackFn) {
              $scope.onSelectCallbackFn(item, $scope.callbackFnParam);
            }
          }
        }
        else {
          form.$setDirty(true);
          _.each(form.$$controls, (control) => {
            if (control.$name === controlName) {
              control.$setDirty(true);
            }
          });
          $scope.keyColumnId = null;
          if ($scope.onSelectCallbackFn) {
            $scope.onSelectCallbackFn(null, $scope.callbackFnParam);
          }
        }
      };

      vm.selectedItemChange = selectedItemChange;
      vm.selectedItem = _.find($scope.datalist, (obj) => $scope.keyColumnId === obj[$scope.keyColumnName]);

      if (vm.selectedItem && $scope.onSelectCallbackFn) {
        $scope.onSelectCallbackFn(vm.selectedItem, $scope.callbackFnParam);
      }
      function customFilter(query) {
        const obj = _.filter($scope.datalist, (data) => {
          if (_.includes(_.lowerCase(data.mfgCode), _.lowerCase(query)) || _.find(data.mfgCodeAlias, (item) => _.includes(_.lowerCase(item.alias), _.lowerCase(query)))) {
            return true;
          }
          else {
            return false;
          }
        });
        return obj;
      }

      vm.refresh = () => {
        if (!$scope.callbackFn) {
          return;
        }
        $scope.callbackFn().then(() => {
          $timeout(() => {
            if (vm.selectedItem) {
              vm.selectedItem = _.find($scope.datalist, (obj) => vm.selectedItem[$scope.keyColumnName] === obj[$scope.keyColumnName]);
            }
          });
        });
      };

      function callbackInsertedData(insertedData) {
        if (!insertedData) {
          vm.selectedItem = null;
        }
        if (insertedData) {
          $scope.callbackFn().then(() => {
            $timeout(() => {
              if (insertedData && typeof (insertedData) === 'object') {
                vm.selectedItem = _.find($scope.datalist, (obj) => insertedData[$scope.keyColumnName] === obj[$scope.keyColumnName] && ((obj.hasOwnProperty('isActive') || obj.hasOwnProperty('active')) ? (obj.isActive || obj.active) : true));
              } else {
                vm.selectedItem = _.find($scope.datalist, (obj) => obj[$scope.keyColumnName] === insertedData && ((obj.hasOwnProperty('isActive') || obj.hasOwnProperty('active')) ? (obj.isActive || obj.active) : true));
              }
            });
          });
        }
      }

      /** set focus of form control */
      const setFocus = () => {
        if (vm.inputId) {
          $timeout(() => {
            const element = angular.element(document.querySelector('#' + vm.inputId));
            element.focus();
          });
        } else {
          $timeout(() => {
            const element = $window.document.getElementsByName(vm.inputName);
            if (element && element[0]) {
              element[0].focus();
            }
          });
        }
      };

      vm.onBlurEventFn = ($event) => {
        $scope.onBlurCallbackFn($event);
      };

      /** Prevent form validation on enter key press */
      //preventFormSubmit();
      $element.keydown((e) => {
        preventInputEnterKeyEvent(e);
      });
    }
  }
})();
