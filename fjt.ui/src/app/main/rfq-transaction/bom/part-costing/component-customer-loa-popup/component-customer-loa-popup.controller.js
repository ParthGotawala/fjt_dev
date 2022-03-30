(function () {
    'use strict';

    angular
        .module('app.rfqtransaction')
        .controller('ComponentCustomerLOAPopupController', ComponentCustomerLOAPopupController);

    /** @ngInject */
    function ComponentCustomerLOAPopupController($mdDialog, $scope, $timeout, $filter, $q, CORE, RFQTRANSACTION, USER,
        data, PartCostingFactory, BaseService, DialogFactory, PRICING, MasterFactory, ComponentFactory) {
        const vm = this;
        vm.entityname = CORE.AllEntityIDS.COMPONENT_CUSTOMER_LOA.Name;
        vm.LabelConstant = CORE.LabelConstant;
        vm.customerID = data.customerID || null;
        vm.componentID = data.componentID || null;
        vm.mfgType = data.mfgType || null;
        vm.rfqAssyID = data.rfqAssyID || null;
        vm.refLineitemID = data.refLineitemID || null;
        vm.isBOM = (data.customerID && data.componentID) ? false : true;
        vm.isCustomer = data.customerID ? true : false;
        vm.isComponent = data.componentID ? true : false;
        vm.cancel = (data) => {
            if (!data)
                data = {};
            if (vm.autoCompleteCustomer)
                data.customerID = vm.autoCompleteCustomer.keyColumnId;
            $mdDialog.cancel(data);
        };
        // get customer List
        let getCustomerList = () => {
            let queryObj = {
                isCustomerCodeRequired: false
            }
            //return CustomerFactory.getCustomers().query(queryObj).$promise.then((customer) => {
            return MasterFactory.getCustomerList().query().$promise.then((customer) => {
                if (customer && customer.data) {
                    _.each(customer.data, function (item) {
                        item.companyName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName);
                    });
                    vm.CustomerList = customer.data;
                }
                return $q.resolve(vm.CustomerList);
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }
        
        let setPopupStatus = () => {
            $timeout(function () {
                vm.LOAID = null;
                model.customerID = vm.customerID ? vm.customerID : vm.autoCompleteCustomer.keyColumnId;
                model.componentID = vm.componentID ? vm.componentID : vm.autoCompleteComponentAlias.keyColumnId;
                getImportLOADetail();
            }, 100);
        }

        let initAutoCompleteAlias = () => {
            vm.autoCompleteCustomer = {
                columnName: 'companyName',
                controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
                viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
                keyColumnName: 'id',
                keyColumnId: vm.rfq ? (vm.rfq.customerId ? vm.rfq.customerId : null) : null,
                addData: {
                  customerType: CORE.CUSTOMER_TYPE.CUSTOMER, popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
                    pageNameAccessLabel: CORE.PageName.customer
                },
                inputName: 'Customer',
                placeholderName: 'Customer',
                isRequired: true,
                isAddnew: true,
                callbackFn: getCustomerList,
                onSelectCallbackFn: setPopupStatus,
            },

            vm.autoCompleteComponentAlias = {
                columnName: 'mfgPN',
                keyColumnName: 'id',
                controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
                viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
                keyColumnId: null,
                inputName: vm.LabelConstant.MFG.MFGPN,
                placeholderName:  vm.LabelConstant.MFG.MFGPN,
                isRequired: false,
                isAddnew: true,
                addData: {
                    mfgType: CORE.MFG_TYPE.MFG,
                    popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
                    pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName
                },
                callbackFn: function (obj) {
                    let searchObj = {
                        id: obj.id,
                        mfgType: CORE.MFG_TYPE.MFG,
                        inputName: vm.autoCompleteComponentAlias.inputName
                    }
                    return getAliasSearch(searchObj);
                },
                onSearchFn: function (query) {
                    let searchObj = {
                        mfgType: CORE.MFG_TYPE.MFG,
                        isGoodPart: CORE.PartCorrectList.CorrectPart,
                        query: query,
                        inputName: vm.autoCompleteComponentAlias.inputName
                    }
                    return getAliasSearch(searchObj);
                },
                onSelectCallbackFn: setPopupStatus,
            }

        }

        //go to assy list 
        vm.goToAssyList = () => {
            BaseService.goToPartList();
            return false;
        }

        vm.goToComponentDetail = () => {
            BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG.toLowerCase(), vm.ComponentID, USER.PartMasterTabs.Detail.Name);
        };
        vm.goToCustomer = () => {
            BaseService.goToCustomer(vm.customerID);
            return false;
        }
        //redirect to customer list 
        vm.goToCustomerList = () => {
            BaseService.goToCustomerList();
            return false;
        }
        //get alias for auto-complete-serach
        function getAliasSearch(searchObj) {
            return ComponentFactory.getComponentMFGAliasSearch().query({ listObj: searchObj }).$promise.then((componentlist) => {
                if (componentlist && componentlist.data.data) {
                    var list = _.reject(componentlist.data.data, (comp) => { return !comp.id; })
                    if (searchObj.id) {
                        $timeout(function () {
                            $scope.$broadcast(searchObj.inputName, list[0]);
                        });
                    }
                }
                return list;
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }
        var model = {
            customerID: vm.customerID,
            componentID: vm.componentID,
            rfqAssyID: vm.rfqAssyID || null,
            refLineitemID: vm.refLineitemID || null
        }
        function getImportLOADetail() {
            vm.headerdata = [];
            if (model && model.customerID && model.componentID) {
                vm.cgBusyLoading = PartCostingFactory.getImoprtLOA().save(model).$promise.then((res) => {
                    if (res && res.data) {
                        vm.LOAID = res.data.id;
                        vm.customer = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, res.data.mfgCodemst.mfgCode, res.data.mfgCodemst.mfgName);
                        vm.component = res.data.Component.mfgPN;
                        vm.PID = res.data.Component.PIDCode;
                        vm.ComponentID = res.data.Component.id;
                        vm.customerID = res.data.mfgCodemst.id;
                        vm.RohsIcon = CORE.WEB_URL + USER.ROHS_BASE_PATH + (res.data.Component.rfq_rohsmst ? res.data.Component.rfq_rohsmst.rohsIcon : CORE.NO_IMAGE_ROHS);
                        vm.rohsName = res.data.Component.rfq_rohsmst ? res.data.Component.rfq_rohsmst.rohsIcon : '';

                      vm.headerdata.push({
                          label: vm.LabelConstant.Customer.Customer,
                          value: vm.customer,
                          displayOrder: 1,
                          labelLinkFn: vm.goToCustomerList,
                          valueLinkFn: vm.goToCustomer,
                          valueLinkFnParams: null,
                          isCopy: false,
                          copyParams: null,
                          imgParms: null
                      }, {
                          label: vm.LabelConstant.MFG.PID,
                          value: vm.PID,
                          displayOrder: 1,
                          labelLinkFn: vm.goToAssyList,
                          valueLinkFn: vm.goToComponentDetail,
                          isCopy: true,
                          isCopyAheadLabel: true,
                          isAssy: true,
                          imgParms: {
                              imgPath: vm.RohsIcon,
                              imgDetail: vm.rohsName
                          },
                          isCopyAheadOtherThanValue: true,
                          copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
                          copyAheadValue: vm.component
                      });
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
        }

        if (vm.customerID && vm.componentID)
            getImportLOADetail();
        else
            initAutoCompleteAlias();
        if (!vm.customerID)
            getCustomerList();


        vm.uploadLOA = (ev) => {
            vm.LOAID = null;
            model.customerID = vm.customerID ? vm.customerID : vm.autoCompleteCustomer.keyColumnId;
            model.componentID = vm.componentID ? vm.componentID : vm.autoCompleteComponentAlias.keyColumnId;
            getImportLOADetail();
        }

        vm.goToList = () =>{
            if (!vm.isComponent) {
                vm.goToAssyList();
            }
            if (!vm.isCustomer) {
                vm.goToCustomerList();
            }
        }
    }

})();
