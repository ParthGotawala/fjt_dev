(function () {
  'use strict';
  angular
    .module('app.core')
    .directive('assemblySamplesList', AssemblySamplesList);

  /** @ngInject */
  function AssemblySamplesList(EquipmentFactory, BaseService, CORE, USER, DialogFactory) {
    let directive = {
      restrict: 'E',
      replace: true,
      scope: {
        assyId: "=",
        woId: "=",
        selectedSampleId: "=",
        woOtherDetails: '='
      },
      templateUrl: 'app/directives/custom/assembly-samples-list/assembly-samples-list.html',
      controller: AssemblySamplesListCtrl,
      controllerAs: 'vm',
      link: function (scope, element, attrs) {
      }
    };
    return directive;

    /** @ngInject */
    function AssemblySamplesListCtrl($scope, $element, $attrs) {
      const vm = this;
      vm.assyId = $scope.assyId;
      vm.woID = $scope.woId;
      vm.woOtherDetails = $scope.woOtherDetails;
      vm.LabelConstant = CORE.LabelConstant;
      vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.SAMPLES;
      vm.isShowAll = true;
      vm.isInitialDataLoading = true;

      //redirect to assembly master
      vm.goToAssemblyList = () => {
          BaseService.goToPartList();
        return false;
      };

      //redirect to bin list
      vm.goToBinList = () => {
        BaseService.goToBinList();
        return false;
      };

      //redirect to warehouse list
      vm.goToWHList = () => {
        BaseService.goToWHList();
        return false;
      };


      vm.getAssemblySamplesList = () => {
        $scope.$parent.vm.cgBusyLoading = EquipmentFactory.getAssemblySamplesList(
          {
            id: vm.assyId,
            woID: vm.woID,
            isShowAll: vm.isShowAll,
            isInitialDataLoading: vm.isInitialDataLoading
          }
        ).query().$promise.then((response) => {
          vm.isInitialDataLoading = false;
          if (response && response.data) {
            vm.assemblySamplesList = [];
            _.each(response.data, function (item) {
              if (item.gencFileName) {
                item.imageURL = CORE.WEB_URL + USER.EQUIPMENT_BASE_PATH + item.gencFileName;
              }
              else {
                item.imageURL = CORE.WEB_URL + CORE.NO_IMAGE_EQUIPMENT;
              }
              item.rohsIcon = CORE.WEB_URL + USER.ROHS_BASE_PATH + item.rohsIcon; 
              if ($scope.selectedSampleId && $scope.selectedSampleId == item.eqpID) {
                item.isSelect = true;
              }
            });
            vm.assemblySamplesList = response.data;
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      vm.getAssemblySamplesList();

      vm.addNewSample = (event) => {
        let pageRightsAccessDet = {
          popupAccessRoutingState: [USER.ADMIN_MANAGEEQUIPMENT_STATE],
          pageNameAccessLabel: CORE.PageName.equipments
        }
        if (BaseService.checkRightToAccessPopUp(pageRightsAccessDet)) {
          var data = {};
          data.Title = CORE.EquipmentAndWorkstation_Title.Sample;
          data.assyId = vm.assyId;

          DialogFactory.dialogService(
            USER.ADMIN_EQUIPMENT_ADD_MODAL_CONTROLLER,
            USER.ADMIN_EQUIPMENT_ADD_MODAL_VIEW,
            event,
            data).then(() => {
            }, (data) => {
              if (data) {
                vm.getAssemblySamplesList();
              }
            },
              (err) => {
              });
        }
      };

      vm.showAssySamples = () => {
        vm.isShowAll = true;
        vm.getAssemblySamplesList();
      }

      vm.showImagesPreview = (index, event) => {
        var imagesList = (vm.assemblySamplesList && vm.assemblySamplesList.length > 0) ? angular.copy(vm.assemblySamplesList) : null;

        /*imagesList = _.filter(imagesList, (item) => {
          return item.isDeleted == false;
        });*/

        if (imagesList && imagesList.length > 0) {
          var data = {
            imagesList: imagesList,
            selectedImageIndex: index ? index : 0,
            headerText: 'Sample'
          }

          DialogFactory.dialogService(
            CORE.COMPONENT_IMAGES_PREVIEW_POPUP_MODAL_CONTROLLER,
            CORE.COMPONENT_IMAGES_PREVIEW_POPUP_MODAL_VIEW,
            event,
            data).then((result) => {
            }, (insertedData) => {
            }, (error) => {
              return BaseService.getErrorLog(error);
            });
        }
      }

      vm.editSamples = (eqpID) => {
          BaseService.goToManageEquipmentWorkstation(eqpID);
      }

      vm.setSelectedSampleForWorkOrder = (item) => {
        $scope.selectedSampleId = undefined;
        if (item) {
          _.map(vm.assemblySamplesList, (data) => {
            if (data.eqpID == item.eqpID) {
              if (item.isSelect) {
                $scope.selectedSampleId = data.eqpID;
              }
            }
            else {
              data.isSelect = false;
            }
          });
        }
      }

      $scope.$on(USER.SampleListRefreshBroadcast, function (evt, data) {
        vm.isInitialDataLoading = true;
        vm.showAssySamples();
      });

      //Redirect to equipment master
      vm.goToEquipmentList = () => {
        BaseService.openInNew(USER.ADMIN_EQUIPMENT_STATE, {});
      }
    }
  }
})();
