(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('templateTypeList', templateTypeList);

  /** @ngInject */
  function templateTypeList(BaseService, CORE, DialogFactory, CONFIGURATION, AgreementFactory) {
    var directive = {
      restrict: 'E',
      scope: {
        pageName: '=?',
        emptyMesssage: '=?',
        templateType: '=?'
      },
      templateUrl: 'app/directives/custom/template-type-list/template-type-list.html',
      controller: templateTypeListCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of Agreement & Email Template
    *
    * @param
    */
    function templateTypeListCtrl($q, $scope, $timeout, $state) {
      var vm = this;
      vm.isUpdatable = true;
      vm.isViewTemplate = true;
      vm.isUnPublish = true;
      vm.isDownload = true;
      vm.isHideDelete = true;
      vm.isAgridUserList = true;
      vm.isArchieveVersion = true;
      vm.isEditAgreement = true;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.templateType = $scope.templateType;
      vm.EmptyMesssage = $scope.emptyMesssage;
      vm.pageName = $scope.pageName;
      vm.gridConfig = CORE.gridConfig;
      vm.LabelConstant = CORE.LabelConstant;
      vm.templateStatus = CORE.AgreementTemplateStatusGridHeaderDropdown;
      vm.loginUser = BaseService.loginUser;
      vm.userName = vm.loginUser.employee.initialName;
      vm.userRole = _.find(vm.loginUser.roles, (item) => item.id === vm.loginUser.defaultLoginRoleID);
      vm.roleName = vm.userRole.name;

      const defaultRoleDetails = _.find(vm.loginUser.roles, { id: vm.loginUser.defaultLoginRoleID });
      vm.getTemplateStatusClassName = (statusID) => BaseService.getWoStatusClassName(statusID);
      const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

      //Show Purpose of Agreement
      vm.showPurpose = (object, ev) => {
        const obj = {
          title: CONFIGURATION.HEADER_INFORMATION.PURPOSE_OF_AGREEMENT,
          description: object.purpose,
          latestVersion: object.version,
          lastPublishedDate: object.publishedDate,
          isArchieveVersion: true
        };
        const data = obj;
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          data
        ).then(() => {

        }, (err) => {
          BaseService.getErrorLog(err);
        });
      };

      //Show Where Used
      vm.showWhereUsed = (object, ev) => {
        const obj = {
          title: CONFIGURATION.HEADER_INFORMATION.WHERE_USED,
          description: object.where_used,
          latestVersion: object.version,
          lastPublishedDate: object.publishedDate,
          isArchieveVersion: true
        };
        const data = obj;
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          data
        ).then(() => {

        }, (err) => {
          BaseService.getErrorLog(err);
        });
      };

      vm.sourceHeader = [
        {
          field: 'Action',
          cellClass: 'layout-align-center-center',
          displayName: 'Action',
          width: '200',
          cellTemplate: '<grid-action-view grid="grid" row="row" hidden;padding:1px !important; overflow: hidden; white-space: nowrap; number-of-action-button="4"></grid-action-view>',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: false
        }, {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          enableSorting: false,
          maxWidth: '80'
        }, {
          field: 'agreementType',
          displayName: CONFIGURATION.HEADER_INFORMATION.NAME,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '300',
          maxWidth: '400'
        }, {
          field: 'statusConvertedValue',
          displayName: CONFIGURATION.HEADER_INFORMATION.STATUS,
          width: 120,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getTemplateStatusClassName(row.entity.isPublished)">'
            + '{{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.templateStatus
          },
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'draftversion',
          displayName: CONFIGURATION.HEADER_INFORMATION.DRAFT_VERSION,
          cellTemplate: '<div ng-if="!row.entity.isPublished" class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div> \
                          <div ng-if="row.entity.isPublished" class="ui-grid-cell-contents grid-cell-text-left">{{COL_FIELD}}</div>',
          width: '120'
        },
        {
          field: 'version',
          displayName: CONFIGURATION.HEADER_INFORMATION.PUBLISHED_VERSION,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '180'
        },
        {
          field: 'publishedDate',
          displayName: CONFIGURATION.HEADER_INFORMATION.PUBLISHED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{row.entity.publishedDate | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false
        }, {
          field: 'purpose',
          displayName: CONFIGURATION.HEADER_INFORMATION.PURPOSE_OF_AGREEMENT,
          cellTemplate: '<md-button class="md-warn md-hue-1 mt-0 ml-40" ng-click="grid.appScope.$parent.vm.showPurpose(row.entity, $event)">View</md-button>',
          width: '200',
          enableFiltering: false
        }, {
          field: 'where_used',
          displayName: CONFIGURATION.HEADER_INFORMATION.WHERE_USED,
          cellTemplate: '<md-button class="md-warn md-hue-1 mt-0 ml-40" ng-click="grid.appScope.$parent.vm.showWhereUsed(row.entity, $event)">View</md-button>',
          width: '200',
          enableFiltering: false
        }, {
          field: 'updatedby',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }, {
          field: 'updatedAt',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false
        }, {
          field: 'updatedbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }, {
          field: 'createdby',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }, {
          field: 'createdAt',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false
        }, {
          field: 'createdbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }];

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['agreementType', 'ASC']],
          SearchColumns: []
        };
      };

      initPageInfo();

      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: true,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: stringFormat('{0}.csv', vm.pageName),
        CurrentPage: CORE.PAGENAME_CONSTANT[36].PageName
      };

      // bindData for set show agreement flag
      const bindData = (sourceData) => {
        _.each(sourceData, (item) => {
          item.isShowAgreedUser = vm.loginUser.isUserAdmin || false;
        });
      };

      function setDataAfterGetAPICall(template, isGetDataDown) {
        if (template && template.data.TemplateList) {
          bindData(template.data.TemplateList);
          if (!isGetDataDown) {
            vm.sourceData = template.data.TemplateList;
            vm.currentdata = vm.sourceData.length;
          }
          else if (template.data.TemplateList.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(template.data.TemplateList);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          // must set after new data comes
          vm.totalSourceDataCount = template.data.Count;
          if (!vm.gridOptions.enablePaging) {
            if (!isGetDataDown) {
              vm.gridOptions.gridApi.infiniteScroll.resetScroll();
            }
            else {
              vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
            }
          }
          if (!isGetDataDown) {
            vm.gridOptions.clearSelectedRows();
          }
          if (vm.totalSourceDataCount === 0) {
            if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.isNoDataFound = false;
              vm.emptyState = 0;
            }
            else {
              vm.isNoDataFound = true;
              vm.emptyState = null;
            }
          }
          else {
            vm.isNoDataFound = false;
            vm.emptyState = null;
          }
          $timeout(() => {
            vm.resetSourceGrid();
            if (!isGetDataDown) {
              if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
                return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            }
            else {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
            }
          });
        }
      }

      /* retrieve Template list */
      vm.loadData = () => {
        vm.pagingInfo.templateType = vm.templateType;
        vm.pagingInfo.userID = BaseService.loginUser.identityUserId;
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = AgreementFactory.retriveAgreementList().query(vm.pagingInfo).$promise.then((template) => {
          if (template.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            setDataAfterGetAPICall(template, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* load more data on mouse scroll */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = AgreementFactory.retriveAgreementList().query(vm.pagingInfo).$promise.then((template) => {
          if (template) { setDataAfterGetAPICall(template, true); }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // View Agreement/Email Template
      vm.viewTemplate = (data, ev) => {
        const obj = {
          agreementContent: data.entity.agreementContent ? data.entity.agreementContent.replace(CORE.Template_System_Variables.companyLogoHtmlTag, WebsiteBaseUrl + CompanyLogoImage) : '<p></p>',
          isTemplateView: true,
          templateLabel: data.entity.agreementType,
          pageName: vm.pageName,
          templateType: vm.templateType,
          latestVersion: data.entity.version,
          lastPublishedDate: data.entity.newpublishedDate,
          isPublished: data.entity.isPublished
        };
        if (obj) {
          DialogFactory.dialogService(
            CORE.AGREEMENT_MODAL_CONTROLLER,
            CORE.AGREEMENT_MODAL_VIEW,
            ev,
            obj).then(() => {
            }, (error) => {
              BaseService.getErrorLog(error);
            });
        }
      };

      // Publish Agreement/Email Template
      vm.openPublishPopup = (data) => {
        const AgreementTypeID = data.entity.id;
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PUBLISH_TEMPLATE_CONFIRM);

        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_CONFIRM_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.pageParameter = { agreementTypeID: AgreementTypeID, userName: vm.userName, userRoleName: vm.roleName };
            vm.cgBusyLoading = AgreementFactory.PublishAgreementTemplate().save(vm.pageParameter).$promise.then(() => {
              vm.loadData();
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // Edit Agreement/Email Template
      vm.updateRecord = (row) => {
        if (vm.templateType === CONFIGURATION.Agreement_Template_Type.AGREEMENT) {
          $state.go(CONFIGURATION.CONFIGURATION_MANAGE_AGREEMENT_STATE, { agreementTypeID: row.entity.id });
        } else {
          $state.go(CONFIGURATION.CONFIGURATION_MANAGE_EMAIL_STATE, { agreementTypeID: row.entity.id });
        }
      };

      // Archieve Version popup
      vm.openArchieveVersionPopup = (row, ev) => {
        const obj = {
          pageName: vm.pageName,
          agreementTypeID: row.entity.id,
          templateType: vm.templateType,
          templateLabel: row.entity.agreementType,
          latestVersion: row.entity.version,
          lastPublishedDate: row.entity.headerpublishedDate
        };
        DialogFactory.dialogService(
          CORE.ARCHIEVE_VERSION_POPUP_CONTROLLER,
          CORE.ARCHIEVE_VERSION_POPUP_VIEW,
          ev,
          obj).then(() => {
          }, (error) => {
            BaseService.getErrorLog(error);
          });
      };

      // Agreed User popup
      vm.openAgridUserListPopup = (row, ev) => {
        const obj = {
          agreementTypeID: row.entity.id,
          userID: defaultRoleDetails.id,
          templateType: vm.templateType,
          templateLabel: row.entity.agreementType,
          latestVersion: row.entity.version,
          userName: vm.loginUser.username,
          lastPublishedDate: row.entity.headerpublishedDate
        };
        DialogFactory.dialogService(
          CORE.AGREED_USER_POPUP_CONTROLLER,
          CORE.AGREED_USER_POPUP_VIEW,
          ev,
          obj).then(() => {
          }, (error) => {
            BaseService.getErrorLog(error);
          });
      };

      // Download Agreement/Email Template
      vm.onDownload = (data) => {
        const obj = {
          agreementTypeID: data.entity.id,
          isViewSignature: false,
          isDraftversion: !data.entity.isPublished,
          agreementType: data.entity.agreementType,
          version: data.entity.version
        };
        if (obj) {
          vm.cgBusyLoading = AgreementFactory.getAgreementTemplateDetails(obj).then((res) => {
            if (res.data.byteLength > 0) {
              const blob = new Blob([res.data], {
                type: 'application/pdf'
              });
              const fileName = obj.agreementType + '_' + obj.version + '.pdf';
              const link = document.createElement('a');
              const url = URL.createObjectURL(blob);
              link.setAttribute('href', url);
              link.setAttribute('download', fileName);
              document.body.appendChild(link);
              $timeout(() => {
                link.click();
                document.body.removeChild(link);
              });
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      // Edit Areement Name
      vm.openAgreementTypePopup = (row, ev) => {
        const objdata = {
          agreementTypeID: row.entity.id,
          displayName: row.entity.agreementType,
          templateType: vm.templateType
        };
        DialogFactory.dialogService(
          CONFIGURATION.MANAGE_AGREEMENT_TYPE_MODAL_CONTROLLER,
          CONFIGURATION.MANAGE_AGREEMENT_TYPE_MODAL_VIEW,
          ev,
          objdata).
          then((data) => {
            if (data) {
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          }, (error) => BaseService.getErrorLog(error));
      };
    }
  }
})();
