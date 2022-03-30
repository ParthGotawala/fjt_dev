( function () {
    'use strict';

    angular
           .module('app.admin.dynamicmessage')
           .controller('manageMessageUsageDetailPopupController', manageMessageUsageDetailPopupController);

    /** @ngInject */
    function manageMessageUsageDetailPopupController(CORE, USER, BaseService, data, $mdDialog, DynamicMessageFactory, PageDetailFactory, $q, $timeout) {

        const vm = this;

        vm.messageUsageModel = {
            _id : "",
            message_Id: "",
            pageId: "",
            pageName: "",
            description: "",
            createdBy: "",
            createdDate: "",
            modifiedBy: "",
            modifiedDate: ""
        };


        vm.pageDetailData = [];

        vm.isNoDataFound = false;
        vm.isUpdatable = true;
        vm.isAdd = true;

        vm.getPageDetail = () => {            
            return vm.cgBusyLoading = PageDetailFactory.getPageNameList().query().$promise.then((res) => {
                if (res && res.data) {
                    vm.pageDetailData = res.data;
                }
                return res;
            }).catch((err) => {
                return BaseService.getErrorLog(err);
            });            
        };        
      let getSelectedPageDetail = (item) => {
        if (item) {
          vm.messageUsageModel.pageName = item.menuName;
        }
          
       };

        let initAutoComplete = () => {
            vm.autoCompletePageName = {
                columnName: 'menuName',
                keyColumnName: 'pageId',
                keyColumnId: vm.pageDetailData ? vm.pageDetailData.pageId : null,
                inputName: 'Page Name',
                placeholderName: 'Page Name',
                isRequired: true,
                callbackFn: vm.getPageDetail,
                onSelectCallbackFn: getSelectedPageDetail,
            };
        };

      

        // below code to intialize auto complete controll after getting data list for relavent control
        vm.cgBusyLoading = $q.all([vm.getPageDetail()]).then((res) => {            
            initAutoComplete();
            if (data && data.pageId) { //edit case
                vm.messageUsageModel.messageCode = data.messageCode? data.messageCode : "" ;
                vm.getMessageDetailData(data.message_Id, data.pageId);
                vm.isAdd = false; //for edit
            }            
        }).catch((error) => {
            return BaseService.getErrorLog(error);
        });

        vm.getMessageDetailData = (id, pageId) => {
            var data = {
                id: id,
                pageId : pageId
            };
            vm.cgBusyLoading = DynamicMessageFactory.getWhereUsedListByKey(data).query().$promise.then((res) => {
                if (res && res.data) {                    
                    var data = res.data.messageUsageData;
                    vm.messageUsageModel._id = data._id;
                    vm.messageUsageModel.message_Id = data.message_Id;
                    vm.messageUsageModel.pageId = data.pageId;
                    vm.autoCompletePageName.keyColumnId = data.pageId;                    
                    vm.messageUsageModel.description = data.description;
                    vm.messageUsageModel.createdBy = data.createdBy;
                    vm.messageUsageModel.createdByName = data.createdByName;
                    vm.messageUsageModel.createdDate = data.createdDate;
                    vm.messageUsageModel.modifiedBy = data.modifiedBy;
                    vm.messageUsageModel.modifiedByName = data.modifiedByName;
                    vm.messageUsageModel.modifiedDate = data.modifiedDate;                    
                }
            }).catch((err) => {
                return BaseService.getErrorLog(err);
            });
        };
                
        if (data) { //add case
            vm.messageUsageModel.messageCode = data.messageCode ? data.messageCode : "";
            vm.messageUsageModel.message_Id = data._id;
        }

        vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
          return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
        }


        vm.cancel = () => {
            let isdirty = vm.checkFormDirty(vm.messageUsageForm, vm.checkDirtyObject);

            if (isdirty) {
                BaseService.showWithoutSavingAlertForPopUp();
            } else {
                BaseService.currentPagePopupForm = [];
                $mdDialog.cancel();
            }
        };

        vm.checkFormDirty = (form, columnName) => {            
            return BaseService.checkFormDirty(form, columnName);;
        }

      angular.element(() => {
        BaseService.currentPagePopupForm = [vm.messageUsageForm];
      });

        vm.SaveDetails = () => {
            vm.isSubmit = false;                        
            if (BaseService.focusRequiredField(vm.messageUsageForm)) {
              $mdDialog.hide();
              return;
            }
            if (vm.messageUsageForm.$dirty) {
              if (vm.messageUsageModel && vm.messageUsageModel.message_Id) 
              {              
                  if (vm.isAdd) {
                      vm.messageUsageModel.pageId = vm.autoCompletePageName ? vm.autoCompletePageName.keyColumnId : null;                  
                      vm.cgBusyLoading = DynamicMessageFactory.addWhereUsedData().query(vm.messageUsageModel).$promise.then((res) => {
                        if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                              BaseService.currentPagePopupForm = [];
                              $mdDialog.hide(res);
                          }
                      }).catch((err) => {
                          return BaseService.getErrorLog(err);
                      });
                  } else {
                      vm.messageUsageModel.pageId = vm.autoCompletePageName ? vm.autoCompletePageName.keyColumnId : null;
                      vm.cgBusyLoading = DynamicMessageFactory.updateWhereUsedData().query(vm.messageUsageModel).$promise.then((res) => {
                        if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                              BaseService.currentPagePopupForm = [];
                              $mdDialog.hide(res);
                          }
                      }).catch((err) => {
                          return BaseService.getErrorLog(err);
                      });
                  }                    
              }
          }
        }
    }
})();
