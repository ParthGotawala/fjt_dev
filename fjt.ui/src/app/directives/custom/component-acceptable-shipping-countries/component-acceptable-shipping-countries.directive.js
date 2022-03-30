(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('componentAcceptableShippingCountries', componentAcceptableShippingCountries);

  /** @ngInject */
  function componentAcceptableShippingCountries(CORE, DialogFactory, USER, $q, $timeout, ComponentFactory, BaseService, CountryMstFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        id: '=?',
        isReadOnly: '=?'
      },
      templateUrl: 'app/directives/custom/component-acceptable-shipping-countries/component-acceptable-shipping-countries.html',
      controller: componentAcceptableShippingCountriesCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function componentAcceptableShippingCountriesCtrl($scope, $element, $attrs) {
      var vm = this;
      vm.componentpartId = $scope.id ? parseInt($scope.id) : null;
      vm.componentAcceptableShippingCountriesData;

      vm.checkFormDirty = (form, columnName) => {
        let checkDirty = BaseService.checkFormDirty(form, columnName);
        return checkDirty;
      }

      // focus on attribute
      function focusAttribute() {
        vm.autoCompleteCountry.focus = false;
        $timeout(() => {
          vm.autoCompleteCountry.focus = true;
        })
      }

      /** Load data in directive */
      vm.getComponentAcceptableShippingCountryList = (ev) => {
        var pagingObj = {
          Page: 0,
          SortColumns: [['countryName', 'ASC']],
          SearchColumns: []
        };
        vm.hlAcceptableCountries = false;
        vm.cgBusyLoading = ComponentFactory.retriveComponentAcceptableShippingCountryList(pagingObj).query({ id: vm.componentpartId }).$promise.then((res) => {
          vm.hlAcceptableCountries = true;
          if (res && res.data) {
            vm.componentAcceptableShippingCountriesData = res.data.acceptibleCoutries;
            vm.componentAcceptableShippingCountriesData.map(item => {
              if (!item.imageName) {
                item.imagePath = stringFormat("{0}{1}flag.jpg", CORE.WEB_URL, USER.COUNTRY_DEFAULT_IMAGE_PATH);
              } else {
                item.imagePath = stringFormat("{0}{1}{2}", CORE.WEB_URL, USER.COUNTRY_BASE_PATH, item.imageName);
              }
            });
          }
          return res;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      
      function getAllCountryList(searchObj) {
        return CountryMstFactory.getAllCountry().query(searchObj).$promise.then((countries) => {
          vm.countryDetail = _.filter(countries.data, (item) => { return item.isActive });
          return vm.countryDetail;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      function init() {
        vm.cgBusyLoading = $q.all([vm.getComponentAcceptableShippingCountryList(), getAllCountryList()]).then((responses) => {
          initAutoComplete();
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      }
      init();
     
      let initAutoComplete = () => {
        vm.autoCompleteCountry = {
          columnName: 'countryName',
          controllerName: USER.ADMIN_COUNTRY_ADD_UPDATE_MODAL_CONTROLLER,
          viewTemplateURL: USER.ADMIN_COUNTRY_ADD_UPDATE_MODAL_VIEW,
          keyColumnName: 'countryID',
          keyColumnId: null,
          inputName: 'Country',
          placeholderName: "Country",
          isRequired: false,
          addData: {
            popupAccessRoutingState: [USER.ADMIN_COUNTRY_STATE],
            pageNameAccessLabel: CORE.PageName.country
          },
          isAddnew: true,
          callbackFn: function (obj) {
            let searchObj = {
              countryID: obj
            }
            return getAllCountryList(searchObj);
          },
          onSelectCallbackFn: null,
          onSearchFn: function (query) {
            let searchObj = {
              searchQuery: query,
              inputName: vm.autoCompleteCountry.inputName
            }
            return getAllCountryList(searchObj);
          }
        }
      };

      /** Clear inputs */
      vm.Cancel = () => {
        vm.autoCompleteCountry.focus = false;
        vm.autoCompleteCountry.keyColumnId = null;
        $timeout(() => {
          vm.componentAcceptableShippingCountriesForm.$setPristine();
          vm.componentAcceptableShippingCountriesForm.$setUntouched();
          focusAttribute();
        }, _configTimeout);
      }

      /** Save/Update attribute mapping details */
      vm.SaveAcceptableShippingCounty = () => {
        var objData = {
          refComponentID: vm.componentpartId,
          countryID: vm.autoCompleteCountry.keyColumnId
        }
        vm.cgBusyLoading = ComponentFactory.createComponentAcceptableShippingCountry()
          .save(objData).$promise.then((res) => {
            if (res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.getComponentAcceptableShippingCountryList();
              vm.Cancel();
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
      }
      
      /** Delete price break details */
      vm.deleteRecord = (item) => {
        if (item.id) {
          var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, "Acceptable Shipping Country", 1);
          let obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          let objData = {
            refComponentID: vm.componentpartId,
            countryID: item.countryID,
          }
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.cgBusyLoading = ComponentFactory.deleteComponentAcceptableShippingCountry().query({ objData: objData }).$promise.then((res) => {
                if (res && res.data) {
                  focusAttribute();
                  vm.getComponentAcceptableShippingCountryList();
                }
              }).catch((error) => {
                return BaseService.getErrorLog(error);
              });
            }
          }, (cancel) => {
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
      };
      angular.element(() => {
        BaseService.currentPageForms.push(vm.componentAcceptableShippingCountriesForm);
      });
      
      //redirect to Country master
      vm.goToCountryList = () => {
        BaseService.openInNew(USER.ADMIN_COUNTRY_STATE, {});
      }
    }
  }
})();
