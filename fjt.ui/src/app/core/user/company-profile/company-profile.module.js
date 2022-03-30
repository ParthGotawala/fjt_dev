(function () {
  'use strict';

  angular
    .module('app.companyprofile', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, CORE) {
    $stateProvider.state(CORE.COMPANY_PROFILE_STATE, {
      url: CORE.COMPANY_PROFILE_ROUTE,
      views: {
        'content@app': {
          templateUrl: CORE.COMPANY_PROFILE_VIEW,
          controller: CORE.COMPANY_PROFILE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(CORE.COMPANY_PROFILE_DETAIL_STATE, {
      url: CORE.COMPANY_PROFILE_DETAIL_ROUTE,
      params: {
        selectedTab: CORE.CompanyProfileTabs.Details.Name
      },
      views: {
        'content@app': {
          templateUrl: CORE.COMPANY_PROFILE_VIEW,
          controller: CORE.COMPANY_PROFILE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(CORE.COMPANY_PROFILE_ADDRESSES_STATE, {
      url: CORE.COMPANY_PROFILE_ADDRESSES_ROUTE,
      params: {
        selectedTab: CORE.CompanyProfileTabs.Addresses.Name
      },
      views: {
        'content@app': {
          templateUrl: CORE.COMPANY_PROFILE_VIEW,
          controller: CORE.COMPANY_PROFILE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(CORE.COMPANY_PROFILE_REMITTANCE_ADDRESS_STATE, {
      url: CORE.COMPANY_PROFILE_REMITTANCE_ADDRESS_ROUTE,
      params: {
        selectedTab: CORE.CompanyProfileTabs.RemittanceAddress.Name
      },
      views: {
        'content@app': {
          templateUrl: CORE.COMPANY_PROFILE_VIEW,
          controller: CORE.COMPANY_PROFILE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(CORE.COMPANY_PROFILE_COMPANY_PREFERENCE_STATE, {
      url: CORE.COMPANY_PROFILE_COMPANY_PREFERENCE_ROUTE,
      params: {
        selectedTab: CORE.CompanyProfileTabs.CompanyPreference.Name
      },
      views: {
        'content@app': {
          templateUrl: CORE.COMPANY_PROFILE_VIEW,
          controller: CORE.COMPANY_PROFILE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(CORE.COMPANY_PROFILE_CONTACTS_STATE, {
      url: CORE.COMPANY_PROFILE_CONTACTS_ROUTE,
      params: {
        selectedTab: CORE.CompanyProfileTabs.Contacts.Name
      },
      views: {
        'content@app': {
          templateUrl: CORE.COMPANY_PROFILE_VIEW,
          controller: CORE.COMPANY_PROFILE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }
})();
