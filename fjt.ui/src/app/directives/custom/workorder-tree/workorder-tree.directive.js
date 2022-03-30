(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('workorderTree', workorderTree);

  /** @ngInject */
  function workorderTree($state, $timeout, $mdSidenav,
    CORE, WORKORDER, BaseService, DialogFactory, WorkorderFactory, $mdComponentRegistry) {
    var directive = {
      restrict: 'E',
      scope: {
        woId: '=?',
        isShowSideNav: '='
      },
      templateUrl: 'app/directives/custom/workorder-tree/workorder-tree.html',
      controller: workorderTreeCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for text-angular define before load directive
    *
    * @param
    */

    function workorderTreeCtrl($scope, $element, $attrs) {
      var vm = this;
      let loginUserDetails = BaseService.loginUser;
      vm.Entity = $scope.entity;
      vm.DisplayStatus = CORE.DisplayStatus;
      vm.Workorder_Tabs = CORE.Workorder_Tabs;
      vm.Workorder_Operation_Tabs = CORE.Workorder_Operation_Tabs;
      vm.documentClass = "workorder-js-tree";
      // bind tree based on workorder and workorder operation data
      let bindWorkorderTreeView = () => {
        let woID = vm.workordertreeData ? vm.workordertreeData.woID : '';
        let woNumber = vm.workordertreeData ? vm.workordertreeData.woNumber : "Work Order Number";
        let woStatus = vm.workordertreeData ? vm.workordertreeData.woStatus : vm.DisplayStatus.Draft.ID;
        let woSubStatus = vm.workordertreeData ? vm.workordertreeData.woSubStatus : vm.DisplayStatus.Draft.ID;
        vm.FolderFileList = [];
        vm.isSelected = true;
        // Default Root parent folder for 
        vm.FolderFileList.push({
          "id": "PWO_" + woID, "parent": "#", "text": woNumber, "name": "Work Order", isSelected: false, type: "folder", Route: WORKORDER.MANAGE_WORKORDER_DETAILS_STATE
        });
        let woTabIndex = 0;
        _.each(vm.Workorder_Tabs, (tabObj) => {
            let obj = {};
            obj.id = tabObj.ID;
            obj.parent = "PWO_" + woID;
            obj.name = tabObj.ID;
            obj.state = { disabled: woID ? false : true };
            obj.isSelected = $state.current.name == tabObj.Route;
            obj.type = tabObj.Type;
            obj.route = tabObj.Route;
            obj.keyID = woID;
            obj.keyColumn = 'woID';
            //if (tabObj.Name == CORE.Workorder_Tabs.Operations.Name) {
            //    tabObj.Name = tabObj.Name + ' (' + vm.workordertreeData.workorderOperation.length + ')';
            //}
            obj.text = stringFormat(CORE.TreeTabNameDisplayFormat, (woTabIndex + 1), tabObj.Name);
            vm.FolderFileList.push(obj);
            woTabIndex++;
        });
        if (vm.workordertreeData) {
          vm.workordertreeData.workorderOperation = _.sortBy(vm.workordertreeData.workorderOperation, 'opNumber');
          _.each(vm.workordertreeData.workorderOperation, (woOpObj) => {
            let objOP = {};
            objOP.id = woOpObj.woOPID;
            objOP.parent = vm.Workorder_Tabs.Operations.ID;
            objOP.text = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, woOpObj.opName, woOpObj.opNumber);
            objOP.name = woOpObj.woOPID;
            objOP.isSelected = ($state.current.name == vm.Workorder_Tabs.Operations.Route);
            objOP.type = 'operation';
            objOP.route = vm.Workorder_Operation_Tabs.Details.Route;
            objOP.keyID = woOpObj.woOPID;
            objOP.keyColumn = 'woOPID';
            vm.FolderFileList.push(objOP);
            let woOpTabIndex = 0;
            _.each(vm.Workorder_Operation_Tabs, (tabOpObj) => {
              if (tabOpObj.ID != vm.Workorder_Operation_Tabs.FirstArticle.ID) {
                let objTab = {};
                objTab.id = tabOpObj.ID + '_' + woOpObj.woOPID;
                objTab.parent = woOpObj.woOPID;
                objTab.text = stringFormat(CORE.TreeTabNameDisplayFormat, (woOpTabIndex + 1), tabOpObj.Name);
                objTab.name = tabOpObj.ID;
                objTab.isSelected = ($state.current.name == tabOpObj.Route && $state.params.woOPID == woOpObj.woOPID);
                objTab.type = tabOpObj.Type;
                objTab.route = tabOpObj.Route;
                objTab.keyID = woOpObj.woOPID;
                objTab.keyColumn = 'woOPID';
                vm.FolderFileList.push(objTab);
                woOpTabIndex++;
              } else {
                if (woOpObj.qtyControl) {
                  let objTab = {};
                  objTab.id = tabOpObj.ID + '_' + woOpObj.woOPID;
                  objTab.parent = woOpObj.woOPID;
                  objTab.text = stringFormat(CORE.TreeTabNameDisplayFormat, (woOpTabIndex + 1), tabOpObj.Name);
                  objTab.name = tabOpObj.ID;
                  objTab.isSelected = ($state.current.name == tabOpObj.Route && $state.params.woOPID == woOpObj.woOPID);
                  objTab.type = tabOpObj.Type;
                  objTab.route = tabOpObj.Route;
                  objTab.keyID = woOpObj.woOPID;
                  objTab.keyColumn = 'woOPID';
                  vm.FolderFileList.push(objTab);
                  woOpTabIndex++;
                }
              }
            });
          });
        }
        $timeout(() => {
          $mdComponentRegistry.when('workorder-tree').then(function () {
            $mdSidenav('workorder-tree').open();
            $scope.isShowSideNav = true;
          })
        }, 0);
      }

      // get list of workorder operation by woId
      vm.getWorkorderOperationList = () => {
        if ($scope.woId) {
          vm.workordertreeData = null;
          WorkorderFactory.getWorkorderOperationList().query({
            woID: $scope.woId
          }).$promise.then((response) => {
            if (response && response.data) {
              vm.workordertreeData = response.data;
              bindWorkorderTreeView();
            }

          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        } else {
          vm.workordertreeData = null;
          bindWorkorderTreeView();
        }
      }

      /* go to selected tab */
      function goToSelected(item) {
        if (item.route) {
          let obj = {};
          item.selected = true;
          item.isSelected = true;
          obj[item.keyColumn] = item.keyID;
          vm.currentKey = item.keyID;
          if (item && item.type == 'operation') {
            const findObj = _.find(vm.workordertreeData.workorderOperation, (oprn) => { return (oprn.woOPID === item.keyID && oprn.qtyControl) });
            if ($scope.PreviousOpObject && $scope.PreviousOpObject.name) {
              if (!findObj && $scope.PreviousOpObject.name === vm.Workorder_Operation_Tabs.FirstArticle.ID) {
                $scope.currentRoute = item.route;
                angular.element('.jstree-clicked + ul.jstree-children li:first-child a').addClass('jstree-clicked');
                angular.element('.jstree-anchor.ng-scope.md-tealTheme-theme.jstree-clicked:first').removeClass('jstree-clicked');
              }
              else {
                item.route = $scope.currentRoute;
                if (findObj && $scope.PreviousOpObject.name === vm.Workorder_Operation_Tabs.FirstArticle.ID) {
                  angular.element('.jstree-clicked + ul.jstree-children li:first-child a').addClass('jstree-clicked');
                  angular.element('.jstree-anchor.ng-scope.md-tealTheme-theme.jstree-clicked:first').removeClass('jstree-clicked');
                } else {
                  $('.jstree').jstree(true).deselect_all(true);
                  $('.jstree').jstree(true).select_node($scope.PreviousOpObject.name + '_' + item.keyID);
                }
              }
            } else {
              $scope.currentRoute = item.route;
              angular.element('.jstree-clicked + ul.jstree-children li:first-child a').addClass('jstree-clicked');
              angular.element('.jstree-anchor.ng-scope.md-tealTheme-theme.jstree-clicked:first').removeClass('jstree-clicked');
            }
          } else {
            $scope.currentRoute = item.route;
            if (item.keyColumn == 'woOPID') {
              $scope.PreviousOpObject = item;
            }
          }
          $scope.PreviousObject = item;
          $state.go(item.route, obj);
        }
        else if (vm.workordertreeData && item.parent == "#" && item.text == vm.workordertreeData.woNumber && item.id == "PWO_" + vm.workordertreeData.woID) {
          $('.jstree').jstree(true).deselect_all(true);
          $('.jstree').jstree(true).select_node(CORE.Workorder_Tabs.Details.ID);
        }
      }

      // on selectNode
      vm.selectedNode = (item) => {
        if ($scope.currentRoute != item.route || vm.currentKey != item.keyID) {
          if ($scope.$parent.vm.CurrentForm) {
            var form = $scope.$parent.vm[$scope.$parent.vm.CurrentForm];
            if (form) {
              var isDirty = form.$dirty;
              if (isDirty) {
                showWithoutSavingAlertforTabChange(form, item);
              } else {
                goToSelected(item);
              }
            } else {
              goToSelected(item);
            }
          } else {
            goToSelected(item);
          }
        }
        else {
          if (item && item.type == 'operation') {
            angular.element('.jstree-clicked + ul.jstree-children li:first-child a').addClass('jstree-clicked');
            angular.element('.jstree-anchor.ng-scope.md-tealTheme-theme.jstree-clicked:first').removeClass('jstree-clicked');
          }
        }
      }
      vm.getWorkorderOperationList();

      /* Show save alert popup when performing tab change*/
      function showWithoutSavingAlertforTabChange(form, item) {
        let obj = {
          title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
          textContent: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_BODY_MESSAGE,
          btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
          canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
        };
        return DialogFactory.confirmDiolog(obj).then((yes) => {
          if (yes) {
            form.$setPristine();
            goToSelected(item);
            return true;
          }
        }, (cancel) => {
          if ($scope.PreviousObject) {
            let objFolder = _.find(vm.FolderFileList, (folder) => { return folder.id === $scope.PreviousObject.id });
            // // Harcoded for select details if anyone click on tree parent menu
            // if(objFolder.parent == "#"){
            //     objFolder = vm.FolderFileList[1];
            // }
            if (objFolder) {
              objFolder.selected = true;
              objFolder.isSelected = true;
              $("." + vm.documentClass).jstree('deselect_all', true);
              $("." + vm.documentClass).jstree('select_node', objFolder.id);
            }
          }
          if (item) {
            item.selected = false;
            item.isSelected = false;
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }


      // bind on event to refresh tree view
      let refreshTree = $scope.$on('bindWorkorderTreeView', function (event, args) {
        if (args && args.woID) {
          $scope.woId = args.woID;
        } else {
          $scope.woId = "";
        }
        $timeout(() => {
          vm.getWorkorderOperationList();
        }, 1000);
      });

      // destory on event on controller destroy
      $scope.$on('$destroy', function () {
        refreshTree();
      });

      //hide show side nav.
      vm.HideShowSideNav = () => {
        if ($scope.isShowSideNav) {
          $mdSidenav('workorder-tree').close();
          // added for custom apply z-index
          var myEl = angular.element(document.querySelector('workorder-tree'));
          if (myEl.length > 0)
            myEl.addClass('workorder-tree-hide');
          // added for custom apply z-index
          $scope.isShowSideNav = false;
        }
      }
    }
  }
})();



