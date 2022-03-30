(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('customAutoCompleteSearch', customAutoCompleteSearch);

  /** @ngInject */
  function customAutoCompleteSearch($q, $filter, $timeout, $window, DialogFactory, CORE, BaseService) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        onSearchFn: '=',
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
        isVisiableLoader: '=?',
        isDisabled: '=?',
        callbackFnParam: '=?',
        isAddalias: '=?',
        searchText: '=?',
        mdRequireMatch: '=?',
        isRefreshDisabled: '=?',
        addData: '=?',
        maxLength: '=?',
        isUppercaseSearchText: '=',
        isDisplayDescription: '=',
        callbackFnForClearSearchText: '=?',
        onBlurCallbackFn: '=?'
      },
      templateUrl: 'app/directives/custom/autocomplete-search/autocomplete-search.html',
      controller: autocompletectrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function autocompletectrl($scope, $element, $attrs, $timeout) {
      var vm = this;
      const _maxlength = 300;  /*(09/03/2021) - Increase length uptp 30o as per discuss with DP. But we have to give provision for exclude max-length As Discuss with VS
       * changed from 100 to 120 as per discussed with DP and DV on 05-01-2021, due to increased length in Part# to 100 char*/
      vm.dataList = [];
      vm.columnName = $scope.columnName;
      vm.isDisplayDescription = $scope.isDisplayDescription ? true : false;
      vm.inputName = $scope.inputName;
      $scope.mdRequireMatch = ($scope.mdRequireMatch == null || $scope.mdRequireMatch == undefined) ? true : $scope.mdRequireMatch;
      vm.placeholderName = $scope.placeholderName;
      vm.isAddnew = $scope.isAddnew;
      vm.isAddalias = $scope.isAddalias;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.PartCorrectList = CORE.PartCorrectList;
      vm.selectedMfg = $scope.addData;
      vm.mfgTypeDist = CORE.MFG_TYPE.DIST;
      vm.mfgTypeMfg = CORE.MFG_TYPE.MFG;
      $scope.maxLength = $scope.maxLength || _maxlength;
      vm.isUppercaseSearchText = $scope.isUppercaseSearchText;
      vm.isSearching = $scope.isVisiableLoader ? true : false;

      $scope.$watch('isVisiableLoader', (newVal, oldval) => {
        vm.isSearching = newVal ? true : false;
      });

      vm.fixedOnes = [];
      if (vm.isAddnew) {
        vm.fixedOnes = [{ [$scope.columnName]: vm.CORE_MESSAGE_CONSTANT.ADD_NEW, type: 'button' }];
      }
      //if (vm.isAddalias) {
      //    vm.fixedOnes = [{ [$scope.columnName]: vm.CORE_MESSAGE_CONSTANT.ADD_NEW, type: 'button' }, { [$scope.columnName]: vm.CORE_MESSAGE_CONSTANT.ADD_NEW_ALIAS, type: 'button' }];
      //}

      // Check max length conditionally if manuallay added text in autocomplete and allow to save.
      vm.checkMaxlength = () => {
        const findObj = _.find(vm.dataList, (item) => {
          if (item && vm.autocompleteDetail[vm.inputName]) {
            return item[$scope.columnName] == vm.autocompleteDetail[vm.inputName].$viewValue;
          }
        });
        return findObj ? _maxlength : $scope.maxLength;
      };
      vm.getMaxLengthValidation = (maxLength) => {
        return BaseService.getMaxLengthValidation(maxLength, (vm.autocompleteDetail[vm.inputName] ? vm.autocompleteDetail[vm.inputName].$viewValue.length : 0));
      };
      $scope.$watch('searchText', (newVal, oldval) => {
        if (newVal != oldval) {
          vm.searchText = newVal;
        }
        vm.searchText = vm.searchText ? (vm.isUppercaseSearchText ? vm.searchText.toUpperCase() : vm.searchText) : vm.searchText;
        // Added following condition on 15-09-2021 by VS
        // Case : When Search Text on autocomplete is cleared then "querySearch" not being call
        // This call back function can be used when need to set functionality in case search text is being blank.
        // Reference : assembly-stock-add-update-popup.controller.js -> autoCompletePO
        // console.log('directive 97: ' + $scope.callbackFnForClearSearchText);
        if (!newVal && newVal != oldval && $scope.callbackFnForClearSearchText) {
          $scope.callbackFnForClearSearchText();
        }
      });

      const querySearch = (query) => {
        $scope.searchText = query;
        if (query) {
          vm.isSearching = true;
          return $scope.onSearchFn(query).then((data) => {
            vm.isSearching = false;
            vm.dataList = vm.fixedOnes.concat(data);
            return vm.dataList;
          });
        }
        else {
          vm.dataList = vm.fixedOnes;
          return vm.dataList;
        }
      };
      vm.querySearch = querySearch;

      $scope.$on(vm.inputName, (event, args) => {
        if (args) {
          vm.selectedItem = args;
          vm.dataList = [args];
        }
        else {
          vm.autocompleteDetail[vm.inputName].$setPristine();
          vm.autocompleteDetail[vm.inputName].$setUntouched();
          $scope.searchText = null;
          vm.selectedItem = null;
          // --------------------- Bug 41304: [Main Branch] Old search result must not show while entering Part# in Part Search pop-hover ----------------
          if ($scope.$$childHead && $scope.$$childHead.$mdAutocompleteCtrl && $scope.$$childHead.$mdAutocompleteCtrl.matches) {
            $scope.$$childHead.$mdAutocompleteCtrl.matches = [];
          }
        }
        $scope.$applyAsync();
      });

      $scope.$on(vm.inputName + 'searchText', (event, args) => {
        if (args) {
          $scope.searchText = args;
        }
        else {
          vm.autocompleteDetail[vm.inputName].$setPristine();
          vm.autocompleteDetail[vm.inputName].$setUntouched();
          $scope.searchText = null;
          vm.selectedItem = null;
          // --------------------- Bug 41304: [Main Branch] Old search result must not show while entering Part# in Part Search pop-hover ----------------
          if ($scope.$$childHead && $scope.$$childHead.$mdAutocompleteCtrl && $scope.$$childHead.$mdAutocompleteCtrl.matches) {
            $scope.$$childHead.$mdAutocompleteCtrl.matches = [];
          }
        }
        $scope.$applyAsync();
      });

      const selectedItemChange = (item, form, controlName) => {
        const ev = angular.element.Event('click');
        angular.element('body').trigger(ev);

        if (item) {
          $scope.keyColumnId = item[$scope.keyColumnName];

          if (item.type === 'button') {
            /* [S] - check user have access to popup (page access rights) */
            if ($scope.addData && $scope.addData.popupAccessRoutingState && $scope.addData.popupAccessRoutingState.length > 0) {

              const loginUserAllAccessPageRoute = _.map(BaseService.loginUserPageList, (item) => {
                return item.PageDetails && item.PageDetails.pageRoute;
              });
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
            /* [E] - check user have access to popup (page access rights) */

            const data = {
              Name: vm.searchText,
              Title: $scope.inputName ? $scope.inputName : null,
              Id: $scope.keyColumnId,
              parentId: $scope.parentId,
              Button: item[$scope.columnName]
            };
            Object.assign(data, $scope.addData);

            // Configure Callback for close Tool bar where display search part autocomplete - SHUBHAM (12/03/2021)
            if ($scope.onSelectCallbackFn && $scope.addData && $scope.addData.closeToolbar) {
              $scope.onSelectCallbackFn(null, $scope.callbackFnParam);
            }

            DialogFactory.dialogService(
              $scope.controllerName,
              $scope.viewTemplateUrl,
              ev,
              data).then((insertedData) => {
                setFocus();
                callbackInsertedData(insertedData);
              }, (insertedData) => {
                setFocus();
                callbackInsertedData(insertedData);
              }, (error) => BaseService.getErrorLog(error));
            //$timeout(() => {
            //    $scope.vm.selectedItem = null;
            //}, 700);
          }
          else {
            if ($scope.onSelectCallbackFn) {
              $scope.onSelectCallbackFn(item, $scope.callbackFnParam);
            }
          }
        }
        else {
          form.$setDirty(true);
          _.each(form.$$controls, (control) => {
            if (control.$name == controlName) {
              control.$setDirty(true);
            }
          });
          $scope.keyColumnId = null;
          if ($scope.onSelectCallbackFn) {
            $scope.onSelectCallbackFn(null, $scope.callbackFnParam);
          }
        }
        // --------------------- Bug 41304: [Main Branch] Old search result must not show while entering Part# in Part Search pop-hover ----------------
        if ($scope.$$childHead && $scope.$$childHead.$mdAutocompleteCtrl && $scope.$$childHead.$mdAutocompleteCtrl.matches) {
          $scope.$$childHead.$mdAutocompleteCtrl.matches = [];
        }
      };

      vm.selectedItemChange = selectedItemChange;
      vm.selectedItem = _.find($scope.datalist, (obj) => {
        return $scope.keyColumnId == obj[$scope.keyColumnName];
      });

      if (vm.selectedItem && $scope.onSelectCallbackFn) {
        $scope.onSelectCallbackFn(vm.selectedItem, $scope.callbackFnParam);
      }

      function callbackInsertedData(insertedData) {
        if (!insertedData) {
          vm.selectedItem = null;
        }
        if (insertedData) {
          $scope.callbackFn(insertedData);
        }
      }

      /** set focus of form control */
      const setFocus = () => {
        $timeout(() => {
          const element = $window.document.getElementsByName(vm.inputName);
          if (element && element[0]) {
            element[0].focus();
          }
        });
      };

      const mdKeyDownEvent = (event) => {
        if (!event.originalEvent.altKey &&
          !event.originalEvent.ctrlKey &&
          !event.originalEvent.shiftKey) {
          if (event.originalEvent.keyCode === 9 && vm.searchText !== '' && !$scope.keyColumnId) {
            const foundSelectedInList = document.querySelector('#selected_option');
            if (!foundSelectedInList) {
              /*as per discussion with Dixitbhai on 21-02-2020
                Old Logic: select value on tab keypress if the list has only one item
                New Logic: if user press tab then select the first value, no matter how many values are there in the list

                keeping comment for refrence*/
              /*var filteredData = $filter('filter')(vm.dataList, { [$scope.columnName]: vm.searchText });
              if (filteredData.length == 1) {
                  vm.selectedItem = filteredData[0];
              }*/
              const filteredData = _.filter(vm.dataList, (item) => {
                return item && !item.type && item[$scope.columnName] &&
                  vm.searchText && item[$scope.columnName].toString().toLowerCase().indexOf(vm.searchText.toLowerCase()) > -1;
              });
              if (filteredData && filteredData.length > 0) {
                vm.selectedItem = filteredData[0];
              }
            }
          }
        }
      };
      vm.mdKeyDownEvent = mdKeyDownEvent;

      vm.onBlurEventFn = () => {
        $scope.onBlurCallbackFn && $scope.onBlurCallbackFn();
      };

      $scope.changeSearch = () => {
        // --------------------- Bug 41304: [Main Branch] Old search result must not show while entering Part# in Part Search pop-hover ----------------
        if ($scope.$$childHead && $scope.$$childHead.$mdAutocompleteCtrl && $scope.$$childHead.$mdAutocompleteCtrl.matches) {
          $scope.$$childHead.$mdAutocompleteCtrl.matches = [];
        }
        if (!vm.autocompleteDetail || !vm.inputName || !vm.autocompleteDetail[vm.inputName] || !vm.autocompleteDetail[vm.inputName].$viewValue) {
          $scope.searchText = null;
        }
        // --------------------- Bug 41304: [Main Branch] Old search result must not show while entering Part# in Part Search pop-hover ----------------
        if ($scope.$$childHead && $scope.$$childHead.$mdAutocompleteCtrl && $scope.$$childHead.$mdAutocompleteCtrl.matches) {
          $scope.$$childHead.$mdAutocompleteCtrl.matches = [];
        }
      };
      /** Prevent form validation on enter key press */
      //preventFormSubmit();
      $element.keydown((e) => {
        preventInputEnterKeyEvent(e);
      });
    }
  }
})();
