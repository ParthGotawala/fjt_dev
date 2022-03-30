(function () {
  'use strict';

  /**
   * Main module of the Fuse
   */
  angular
    .module('fuse', [

      // Core
      'app.core',

      // Navigation
      'app.navigation',

      // Toolbar
      'app.toolbar',

      // Quick Panel
      'app.quick-panel',

      // Login
      'app.login',

      // Forgot Password
      //'app.forgotpassword',

      // Reset Password
      //'app.resetpassword',

      // Dashboard
      'app.dashboard',

      // Home
      'app.home',

      // Admin
      'app.admin',

      // Configuration
      'app.configuration',

      // Operation
      'app.operation',

      // Job
      //'app.job',


      // Work Order
      'app.workorder',

      // Scanbadege
      'app.task',
      //SalesOrder
      'app.transaction',

      // Traveler
      'app.traveler',

      // Widget
      'app.widget',

      // Helper Page
      'app.helperpage',

      // Reports
      'app.reports',

      //SalesOrder
      //  'app.salesorder',

      //RFQ Transaction
      'app.rfqtransaction',

      //Custom Forms
      'app.customforms',
      //Pricing Test
      'app.pricing',

      // Enterprise Search
      'app.enterprisesearch',

      //DbScript String Formation and Execution
      'app.dbscript',

      //different Checker 
      'app.diffchecker',

      'app.helpblogdetail',

      //user profile
      'app.userprofile',

      //company Profile
      'app.companyprofile',

      // user notification page
      'app.notification',

      // Common 3rd Party Dependencies
      'textAngular',


      'angular-clipboard',

      'ui.sortable',

      'ui.sortable.multiselection',

      'signature',

      'ngMaterialDatePicker',

      'mdColorPicker',

      'ui.bootstrap.contextMenu',

      'btford.socket-io',

      'diff-match-patch',

      'md.data.table',

      'material.components.expansionPanels',
      // to display data as a Excel format
      'ngHandsontable',

      //      'ngInfiniteScroll',
      'infinite-scroll',
      'cfp.hotkeys',
      'jsonFormatter',
      'export.csv',
      // for widget filter expression drag/drop
      angularDragula(angular),
      'ngIdle',
      'ngMaterialCollapsible',
      'pdfjsViewer',
      'fixed.table.header',
      'shagstrom.angular-split-pane',
      'ngSanitize' //for mdDialog HTML Content 
    ]);
})();
