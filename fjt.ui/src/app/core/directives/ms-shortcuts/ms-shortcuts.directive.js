(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('MsShortcutsController', MsShortcutsController)
    .directive('msShortcuts', msShortcutsDirective);

  /** @ngInject */
  function MsShortcutsController($scope, $document, $timeout, $q, UserPagePermisionFactory, BaseService, uiSortableMultiSelectionMethods) {
    var vm = this;

    // Data
    vm.query = '';
    vm.queryOptions = {
      debounce: 300
    };
    vm.resultsLoading = false;
    vm.selectedResultIndex = 0;
    vm.ignoreMouseEvents = false;
    vm.mobileBarActive = false;
    vm.results = null;
    vm.shortcuts = [];
    vm.loginUser = BaseService.loginUser;

    vm.sortableOptions = {
      ghostClass: 'ghost',
      forceFallback: true,
      fallbackClass: 'dragging',
      onSort: function () {
        vm.saveShortcuts();
      }
    };

    // Methods
    vm.populateResults = populateResults;
    vm.loadShortcuts = loadShortcuts;
    vm.saveShortcuts = saveShortcuts;
    vm.addShortcut = addShortcut;
    vm.removeShortcut = removeShortcut;
    vm.handleResultClick = handleResultClick;

    vm.absorbEvent = absorbEvent;
    vm.handleKeydown = handleKeydown;
    vm.handleMouseenter = handleMouseenter;
    vm.temporarilyIgnoreMouseEvents = temporarilyIgnoreMouseEvents;
    vm.ensureSelectedResultIsVisible = ensureSelectedResultIsVisible;
    vm.toggleMobileBar = toggleMobileBar;
    let pageData;
    let shortCutData;

    init();

    function init(shortCutDetail) {
      // Load the shortcuts
      if (shortCutDetail && shortCutDetail.length > 0) {
        shortCutData = _.reject(shortCutDetail, (item) => {
          if (!item.hasShortcut) {
            return item;
          }
        });
        vm.shortcuts = shortCutData;
        if (vm.shortcuts.length > 0) {
          if (!vm.query) {
            vm.results = shortCutData;
          }
        }
      } else {
        vm.loadShortcuts().then(
          // Success
          function (response) {
            shortCutData = _.reject(response, (item) => {
              if (!item.hasShortcut) {
                return item;
              }
            });
            vm.shortcuts = shortCutData;
            // Add shortcuts as results by default
            if (vm.shortcuts.length > 0) {
              vm.results = shortCutData;
            }
          }
        );
      }


      // Watch the model changes to trigger the search
      $scope.$watch('MsShortcuts.query', function (current, old) {
        if (angular.isUndefined(current)) {
          return;
        }

        if (angular.equals(current, old)) {
          return;
        }

        // Show the loader
        vm.resultsLoading = true;

        // Populate the results
        vm.populateResults().then(
          // Success
          function (response) {
            vm.results = response;
          },
          // Error
          function () {
            vm.results = [];
          }
        ).finally(
          function () {
            // Hide the loader
            vm.resultsLoading = false;
          }
        );
      });
    }


    $scope.MsShortcuts.disableDragging = (value) => {
      this.dragAndDropSortableOptions.disabled = value ? true : false;
    };

    /* dragAndDropSortableOptions*/
    this.dragAndDropSortableOptions = uiSortableMultiSelectionMethods.extendOptions({
      'multiSelectOnClick': true,
      'ui-floating': true,
      'ui-selection-count': true,
      //cancel: '.cursor-not-allow,:input',
      placeholder: 'dragandDropPlaceholder',
      connectWith: '.apps-container',
      items: '.sortable-item',
      stop: (e, ui) => {
        this.onDrag = false;
        const dataObj = {
          userID: vm.loginUser.userid,
          roleID: vm.loginUser.defaultLoginRoleID,
          listObj: $scope.MsShortcuts.shortcuts
        };
        UserPagePermisionFactory.updateBookmarkDisplayOrder().query(dataObj).$promise.then((res) => {
          localStorage.setItem('ApplicationMenuShortcutList', null);
          init();
        }).catch((err) => {
          return BaseService.getErrorLog(err);
        });;
      }
    });

    /**
     * Populate the results
     */
    function populateResults() {
      var results = [],
        // flatNavigation = msNavigationService.getFlatNavigation(),
        flatNavigation = vm.shortcutList,
        deferred = $q.defer();
      _.each(vm.shortcuts, (itemData) => {
        const setShortcut = _.find(flatNavigation, (item) => itemData.title === item.title);
        if (setShortcut) {
          setShortcut.hasShortcut = itemData.hasShortcut;
        }
      });
      // Iterate through the navigation array and
      // make sure it doesn't have any groups or
      // none ui-sref items
      for (var x = 0; x < flatNavigation.length; x++) {
        if (flatNavigation[x].uisref || flatNavigation[x].popupFunName) {
          results.push(flatNavigation[x]);
        }
      }

      // If there is a query, filter the results
      if (vm.query) {
        // let shortCutData;
        if ((_.includes(vm.query, ["\\",])) || (_.includes(vm.query, "*")) ||
          (_.includes(vm.query, "(")) || (_.includes(vm.query, ")")) || (_.includes(vm.query, "+")) ||
          (_.includes(vm.query, "?")) || (_.includes(vm.query, "[")) || (_.includes(vm.query, "]")) ||
          (_.includes(vm.query, "{")) || (_.includes(vm.query, "}"))) {
          results = [];
        }
        else {
          results = results.filter(function (item) {
            if (angular.lowercase(item.title).search(angular.lowercase(vm.query)) > -1) {
              return true;
            }
          });
        }
        // Iterate through one last time and
        // add required properties to items
        for (var i = 0; i < results.length; i++) {
          // Add false to hasShortcut by default
          results[i].hasShortcut = false;

          // Test if the item is in the shortcuts list
          for (var y = 0; y < vm.shortcuts.length; y++) {
            if (vm.shortcuts[y]._id === results[i]._id) {
              results[i].hasShortcut = true;
              break;
            }
          }
        }
      }
      else {
        // If the query is empty, that means
        // there is nothing to search for so
        // we will populate the results with
        // current shortcuts if there is any
        if (vm.shortcuts.length > 0) {
          results = vm.shortcuts;
        }
      }

      // Reset the selected result
      vm.selectedResultIndex = 0;

      // Fake the service delay
      $timeout(function () {
        // Resolve the promise
        deferred.resolve(results);
      }, 250);

      // Return a promise
      return deferred.promise;
    }

    /**
     * Load shortcuts
     */
    function loadShortcuts() {
      var deferred = $q.defer();

      vm.loginUser = BaseService.loginUser;
      vm.userid = vm.loginUser ? vm.loginUser.userid : null;
      const appMenuShortcutList = JSON.parse(localStorage.getItem('ApplicationMenuShortcutList'));
      if (appMenuShortcutList && appMenuShortcutList.length > 0) {
        vm.shortcutList = appMenuShortcutList;
        deferred.resolve(vm.shortcutList);
        return deferred.promise;
      } else {
        // here make an API call
        // to load them from the DB.
        return UserPagePermisionFactory.getShortcutList().query({ id: vm.loginUser.userid, roleId: vm.loginUser.defaultLoginRoleID }).$promise.then((shortcutList) => {
          if (shortcutList && shortcutList.data && shortcutList.data.shortcutList) {
            _.each(shortcutList.data.shortcutList, (item) => {
              Object.assign(item, item.PageDetails);
              item.hasShortcut = item.hasShortcut ? true : false;
            });
            vm.shortcutList = shortcutList.data.shortcutList;
            localStorage.setItem('ApplicationMenuShortcutList', JSON.stringify(vm.shortcutList));
            deferred.resolve(vm.shortcutList);
            return deferred.promise;
          }
        }).catch((err) => BaseService.getErrorLog(err));
        // Resolve the promise
        // deferred.resolve(shortcuts);

        // return deferred.promise;
      }
    }
    /**
     * Save the shortcuts
     */
    function saveShortcuts(pageDetail, status) {
      var deferred = $q.defer();
      //  here make an API call
      // to add/remove them to the DB.
      if (vm.userid) {
        vm.cgBusyLoading = UserPagePermisionFactory.userMenus().query({ id: vm.userid, roleId: vm.loginUser.defaultLoginRoleID }).$promise.then((permisionList) => {
          vm.PermisonList = permisionList.data;
          //if (vm.PermisonList.length > 0 && vm.PermisonList[0].length > 0) {
          if (vm.PermisonList.pageDetailList.length > 0) {
            if (pageDetail.state) {
              pageData = _.find(vm.PermisonList.pageDetailList[0], (item) => {
                if (item.PageDetails && item.PageDetails.pageName) {
                  if (item.PageID === pageDetail.pageID) {
                    return item.PageID;
                  }
                }
              });
            } else if (pageDetail.popupFunName) {
              pageData = _.find(vm.PermisonList.pageDetailList[0], (item) => {
                if (item.PageDetails && item.PageDetails.pageName) {
                  if (item.PageDetails.popupFunName === pageDetail.popupFunName) {
                    return item.PageID;
                  }
                }
              });
            }
            let objMenuArr = [];
            let objBookmarkArr = [];
            let displayOrder = 0;

            if (pageData) {
              let pageObj = {
                'PageID': pageData.PageID, 'userID': vm.userid, 'isShortcut': pageDetail.hasShortcut, 'isShortcutFlag': true, 'RoleID': vm.loginUser.defaultLoginRoleID
              };
              if (!pageDetail.hasShortcut) {
                pageObj['displayOrder'] = null;
              }
              objMenuArr.push(pageObj);
            }

            if (pageData.isShortcut) {
              _.each(vm.shortcuts, (element) => {
                if (element.hasShortcut) {
                  displayOrder = displayOrder + 1;
                  objBookmarkArr.push({
                    userID: vm.userid,
                    roleID: vm.loginUser.defaultLoginRoleID,
                    PageID: element.pageID,
                    displayOrder: displayOrder
                  });
                }
              });
            }
            else {
              objBookmarkArr.push({
                userID: vm.userid,
                roleID: vm.loginUser.defaultLoginRoleID,
                PageID: pageData.PageID,
                displayOrder: vm.shortcuts.length + 1
              });
            }

            if (objMenuArr.length > 0) {
              vm.cgBusyLoading = UserPagePermisionFactory.userPagePermision().update({
                id: vm.userid,
                list: [...objBookmarkArr]
              }, objMenuArr).$promise.then((res) => {
                localStorage.setItem('ApplicationMenuShortcutList', null);
                init();
                //if (status == 'remove') {
                //  init(vm.shortcuts);
                //}
                //else {
                //if (vm.shortcuts.length > 0) {
                //  let t = _.find(vm.shortcuts, (item) => {
                //    if (item.title == pageDetail.title) {
                //      return item;
                //    }
                //  });
                //  if (!t) {
                //    vm.shortcuts.push(pageDetail);
                //  }
                //} else {
                //  vm.shortcuts.push(pageDetail);
                //}
                //}
                return deferred.promise;
              }).catch((err) => {
                return BaseService.getErrorLog(err);
              });
            }
          }
        });
      }
      //Fake the service delay
      $timeout(function () {
        deferred.resolve({ 'success': true });
      }, 250);
    }
    /**
     * Add item as shortcut
     *
     * @param item
     */
    function addShortcut(item) {
      // Update the hasShortcut status
      item.hasShortcut = true;
      // Add the shortcuts
      vm.saveShortcuts(item, 'add');
    }

    /**
     * Remove item from shortcuts
     *
     * @param item
     */
    function removeShortcut(item) {
      // Update the hasShortcut status
      item.hasShortcut = false;
      // Remove the shortcuts
      vm.saveShortcuts(item, 'remove');
    }

    /**
     * Handle the result click
     *
     * @param item
     */
    function handleResultClick(item) {
      // Add or remove the shortcut
      if (item) {
        if (item.hasShortcut) {
          vm.removeShortcut(item);
        }
        else {
          vm.addShortcut(item);
        }
      }
    }

    /**
     * Absorb the given event
     *
     * @param event
     */
    function absorbEvent(event) {
      event.preventDefault();
    }

    /**
     * Handle keydown
     *
     * @param event
     */
    function handleKeydown(event) {
      var keyCode = event.keyCode,
        keys = [38, 40];

      // Prevent the default action if
      // one of the keys are pressed that
      // we are listening
      if (keys.indexOf(keyCode) > -1) {
        event.preventDefault();
      }

      switch (keyCode) {
        // Enter
        case 13:

          // Trigger result click
          if (vm.results && vm.results.length > 0) {
            vm.handleResultClick(vm.results[vm.selectedResultIndex]);
          }

          break;

        // Up Arrow
        case 38:

          // Decrease the selected result index
          if (vm.selectedResultIndex - 1 >= 0) {
            // Decrease the selected index
            vm.selectedResultIndex--;

            // Make sure the selected result is in the view
            vm.ensureSelectedResultIsVisible();
          }

          break;

        // Down Arrow
        case 40:

          // Increase the selected result index
          if (vm.selectedResultIndex + 1 < vm.results.length) {
            // Increase the selected index
            vm.selectedResultIndex++;

            // Make sure the selected result is in the view
            vm.ensureSelectedResultIsVisible();
          }

          break;

        default:
          break;
      }
    }

    /**
     * Handle mouseenter
     *
     * @param index
     */
    function handleMouseenter(index) {
      if (vm.ignoreMouseEvents) {
        return;
      }

      // Update the selected result index
      // with the given index
      vm.selectedResultIndex = index;
    }

    /**
     * Set a variable for a limited time
     * to make other functions to ignore
     * the mouse events
     */
    function temporarilyIgnoreMouseEvents() {
      // Set the variable
      vm.ignoreMouseEvents = true;

      // Cancel the previous timeout
      $timeout.cancel(vm.mouseEventIgnoreTimeout);

      // Set the timeout
      vm.mouseEventIgnoreTimeout = $timeout(function () {
        vm.ignoreMouseEvents = false;
      }, 250);
    }

    /**
     * Ensure the selected result will
     * always be visible on the results
     * area
     */
    function ensureSelectedResultIsVisible() {
      var resultsEl = $document.find('#ms-shortcut-add-menu').find('.results'),
        selectedItemEl = angular.element(resultsEl.find('.result')[vm.selectedResultIndex]);

      if (resultsEl && selectedItemEl) {
        var top, bottom = 0;
        if (selectedItemEl.position()) {
          top = selectedItemEl.position().top - 8;
          bottom = selectedItemEl.position().top + selectedItemEl.outerHeight() + 8;
        }

        // Start ignoring mouse events
        vm.temporarilyIgnoreMouseEvents();

        if (resultsEl.scrollTop() > top) {
          resultsEl.scrollTop(top);
        }

        if (bottom > (resultsEl.height() + resultsEl.scrollTop())) {
          resultsEl.scrollTop(bottom - resultsEl.height());
        }
      }
    }

    /**
     * Toggle mobile bar
     */
    function toggleMobileBar() {
      vm.mobileBarActive = !vm.mobileBarActive;
    }

    /* open directly accessible popup */
    vm.openPopup = (popupFunName) => {
      BaseService[popupFunName].call();
    };
  }

  /** @ngInject */
  function msShortcutsDirective() {
    return {
      restrict: 'E',
      scope: {
      },
      require: 'msShortcuts',
      controller: 'MsShortcutsController as MsShortcuts',
      bindToController: {
      },
      templateUrl: 'app/core/directives/ms-shortcuts/ms-shortcuts.html',
      compile: function (tElement) {
        // Add class
        tElement.addClass('ms-shortcuts');

        return function postLink(scope, iElement) {
          // Data

        };
      }
    };
  }
})();
