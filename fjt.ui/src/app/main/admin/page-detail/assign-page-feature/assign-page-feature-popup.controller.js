(function () {
  'use strict';

  angular
    .module('app.admin.page')
    .controller('AssignPageFeaturePopUpController', AssignPageFeaturePopUpController);

  /** @ngInject */
  function AssignPageFeaturePopUpController($filter, $q, $mdDialog, data, USER,
    FeatureDetailFactory, PageDetailFactory, BaseService, CORE) {
    let loginUserDetails = BaseService.loginUser;
    const vm = this;
    vm.data = data;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.PAGE_DETAIL;

    let getFeatureList = () => {
      vm.FeatureList = [];
      return FeatureDetailFactory.getFeaturesList().query().$promise.then((featurelist) => {
        return featurelist.data;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let getPageList = () => {
      vm.PageList = [];
      return PageDetailFactory.getPageWithFeatureList().query().$promise.then((page) => {
        return page.data;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let initAutoComplete = () => {
      vm.autoCompletePage = {
        columnName: 'pageName',
        keyColumnName: 'pageID',
        keyColumnId: vm.data.data ? vm.data.data.pageID : null,
        inputName: 'Page',
        placeholderName: 'Page Name',
        isRequired: true,
        isAddnew: false,
        isDisabled: true,
        callbackFn: getPageList
      };
    }

    var cgPromise = [getFeatureList(), getPageList()];
    vm.cgBusyLoading = $q.all(cgPromise).then((responses) => {
      vm.FeatureList = responses[0];
      vm.PageList = responses[1];
      _.each(vm.FeatureList, (feature) => {
        _.each(vm.PageList, (page) => {
          let objFound;
          if (page.pageID == vm.data.data.pageID) {
            if (page.featurePageDetail.length > 0) {
              objFound = _.find(page.featurePageDetail, (objF) => {
                return objF.featureID == feature.featureID;
              });
            }
            if (objFound) {
              feature.selected = true;
              feature.featurePageDetailID = objFound.featurePageDetailID;
            }
          }
        });
      });
      initAutoComplete();
    });

    vm.save = () => {
      let _objList = {};
      _objList.pageID = vm.data.data.pageID;
      _objList.featureIDs = _.map(_.filter(vm.FeatureList, (feature) => { return feature.selected == true; }), 'featureID');
      vm.cgBusyLoading = FeatureDetailFactory.AssignFeaturePageRights().query({ listObj: _objList }).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          $mdDialog.cancel();
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.cancel = () => {
      let isdirty = vm.pageForm.$dirty;
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form) => {
      let checkDirty = BaseService.checkFormDirty(form);
      return checkDirty;
    };
  }

})();
