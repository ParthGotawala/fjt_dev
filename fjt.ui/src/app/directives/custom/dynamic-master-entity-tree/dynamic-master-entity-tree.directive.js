(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('dynamicMasterEntityTree', dynamicMasterEntityTree);

    /** @ngInject */
    function dynamicMasterEntityTree($state, $timeout, $mdSidenav, CORE, CUSTOMFORMS, BaseService,
        EntityFactory, $location) {
        var directive = {
            restrict: 'E',
            scope: {
                isShowSideNav: '=',
                selectedTabFromTree:'='
                // manualEntityList: '=?',
            },
            templateUrl: 'app/directives/custom/dynamic-master-entity-tree/dynamic-master-entity-tree.html',
            controller: dynamicMasterEntityTreeCtrl,
            controllerAs: 'vm'
        };
        return directive;

        /** @ngInject */
        /**
        * Controller for text-angular define before load directive
        *
        * @param
        */

        function dynamicMasterEntityTreeCtrl($scope, $element, $attrs) {
            let vm = this;
            let loginUserDetails = BaseService.loginUser;
            //vm.Entity = $scope.entity;
            vm.DynamicMasterEntityTreeTabs = CORE.DynamicMasterEntityTreeTabs;
            vm.documentClass = "workorder-js-tree";
            let manualEntityList = $scope.$parent.$parent.vm.ManualEntities;
            // bind tree based on forms and data elements
            let bindDynamicMasterEntityTreeView = () => {
                //vm.cgBusyLoading = EntityFactory.getAllEntityWithDataElements().query().$promise.then((entity) => {
                //    if (entity && entity.data) {
                //vm.ManualEntities = _.filter(entity.data.entity, (ent) => {
                //    return ent.systemGenerated == false && ent.dataElement.length > 0;
                //});

                vm.FolderFileList = [];
                //vm.isSelected = true;
              if (manualEntityList.length > 0) {                
                    _.each(manualEntityList, (item) => {
                        let objEntity = {};
                        objEntity.id = "ENTITY_" + item.entityID;
                        objEntity.parent = "#";
                        objEntity.text = item.entityName;
                        objEntity.name = item.entityID;
                        objEntity.isSelected = false;
                        objEntity.type = "folder";
                        //objEntity.route = CUSTOMFORMS.CUSTOMFORMS_ENTITY_LIST_STATE;
                        objEntity.route = null;
                        vm.FolderFileList.push(objEntity);

                        let index = 0;
                        _.each(vm.DynamicMasterEntityTreeTabs, function (tabObj) {
                            let objTab = {};
                            objTab.id = tabObj.ID + '_' + "ENTITY_" + item.entityID;
                            objTab.parent = "ENTITY_" + item.entityID;
                            objTab.name = tabObj.ID;
                            objTab.state = { disabled: item.entityID ? false : true };
                            //objTab.isSelected = $state.current.url == tabObj.Route;
                            objTab.isSelected = $state.current.name == tabObj.State && $state.params.entityID == item.entityID;
                            if (objTab.isSelected) {
                                objTab.isManualSelect = true;
                            }
                            /* to set 1st tab as a default tab selected for 1st time page load */
                            if ($state.current.name == CUSTOMFORMS.CUSTOMFORMS_ENTITY_STATE && index == 0) {
                                objTab.isSelected = true;
                                objTab.isManualSelect = false;
                            }
                            objTab.type = tabObj.Type;
                            objTab.route = tabObj.Route;
                            objTab.keyID = item.entityID;
                            objTab.keyColumn = 'entityID';
                            objTab.text = tabObj.Name;
                            objTab.selectedTab = index;
                            vm.FolderFileList.push(objTab);
                            index++;
                        });
                    });

                    $timeout(() => {
                        $mdSidenav('workorder-tree').open();
                        $scope.isShowSideNav = true;
                    }, 0);
                }
                //}
                //}).catch((error) => {
                //    return BaseService.getErrorLog(error);
                //});
            }

            // on selectNode

            vm.selectedNode = (item) => {
                /* condition to delete property for auto select (case - refresh manage custom forms page ) */
                if (item.isManualSelect) {
                    delete item.isManualSelect;
                    return;
                }
                if (item.route) {
                    //$scope.$parent.$parent.vm.selectedTab = item.selectedTab;

                    //let obj = {};
                    item.selected = true;
                    //obj[item.keyColumn] = item.keyID;
                    /* From List page and add new - case routing */
                    $location.path(item.route.replace(":entityID", item.keyID));

                    //$state.go(item.route, obj);
                }

            }

            bindDynamicMasterEntityTreeView();
            //hide show side nav.
            vm.HideShowSideNav = () => {
                if ($scope.isShowSideNav) {
                    $mdSidenav('workorder-tree').close();
                    $scope.isShowSideNav = false;
                }
            }

            // on state change success to set selected 1st tab as a default tab while click from menu/bread cum link
            let stateChangeSuccessCall = $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {                
                $scope.selectedTabFromTree = toState.data.selectedTab;
                if (toState.url == CUSTOMFORMS.CUSTOMFORMS_ENTITY_ROUTE) {
                    bindDynamicMasterEntityTreeView();
                }
            });

            // bind on event to refresh tree view
            let refreshTree = $scope.$on('bindDynamicMasterTreeView', function (event, args) {
                if (args.tabTypeToSelect == vm.DynamicMasterEntityTreeTabs.DataElementList.Type) {
                    $scope.$broadcast('select-node', { id: vm.DynamicMasterEntityTreeTabs.DataElementList.ID + '_' + "ENTITY_" + args.entityID });
                }
                else if (args.tabTypeToSelect == vm.DynamicMasterEntityTreeTabs.ManageDataElement.Type) {
                    $scope.$broadcast('select-node', { id: vm.DynamicMasterEntityTreeTabs.ManageDataElement.ID + '_' + "ENTITY_" + args.entityID });
                }
            });

            /* to get latest all forms qith data and entity status */
            vm.refreshCustomFormTree = () => {
                $scope.$emit('retrieveManualEntityList');
            }

            /* to search matching custom form name */
            vm.filterCustomFormName = () => {
                let searchData = {
                    Name:vm.customForms.formName
                }
              //  $scope.$broadcast('serachNodeByContains', searchData);
              $scope.$broadcast('serachNode', searchData);
              
            }
            /* to close tree */
            vm.closeAll = () => {              
              $scope.$broadcast('closeAll');
            }

            $scope.$on('$destroy', function () {
                refreshTree();
                stateChangeSuccessCall();
            });
        }
    }
})();



