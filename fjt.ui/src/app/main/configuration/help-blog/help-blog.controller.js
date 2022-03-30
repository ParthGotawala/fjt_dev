(function () {
  'use strict';

  angular
    .module('app.configuration.helpblog')
    .controller('HelpBlogController', HelpBlogController);

  /** @ngInject */
  function HelpBlogController($filter, $mdDialog, $timeout, $state, $stateParams, $rootScope, uiSortableMultiSelectionMethods,
    CORE, USER, CONFIGURATION, DialogFactory, HelpBlogFactory, PageDetailFactory, BaseService, $location, $q, $scope, HELP_BLOG_DETAIL) {
    const vm = this;
    vm.EmptyMesssage = CONFIGURATION.CONFIGURATION_EMPTYSTATE.HELPBLOG;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.taToolbar = CORE.Toolbar;
    vm.desciption = CORE.LabelConstant.HELP_BLOG_MESSAGES.DESCRIPTION;
    vm.isEdit = false;
    vm.param = $stateParams;
    vm.isView = false;
    vm.isNoDataFound = true;
    vm.isHelpBlogPageFound = false;
    vm.isSearchDataFound = false;
    vm.copyHelpblogList = [];
    vm.oldTitle = null;
    vm.isEnableUpdateHelpBlogNote = false;
    vm.isEnableDeleteHelpBlogNote = false;
    vm.isAllExpanded = false;
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;

    /* dragAndDropSortableOptions*/
    vm.dragAndDropSortableOptions = uiSortableMultiSelectionMethods.extendOptions({
      'multiSelectOnClick': true,
      'ui-floating': true,
      'ui-selection-count': true,
      //cancel: '.cursor-not-allow,:input',
      placeholder: 'dragandDropPlaceholder',
      connectWith: '.apps-container',
      items: '.sortable-item',
      stop: (e, ui) => {
        let displayOrder = 0;
        _.map(vm.helpBlogNoteList, (element) => element.displayOrder = ++displayOrder);
        if (vm.helpBlogNoteList.length > 1) { updateBulkDisplayOrder(); }
      }
    });

    // Search Criteria
    vm.searchQuery = {
      pageName: ''
    };

    // Set state for help blog id
    vm.setState = (data) => {
      vm.currentPageDetail = vm.param = data;
      $state.transitionTo(CONFIGURATION.CONFIGURATION_HELPBLOG_STATE, {
        id: data.id
      }, { location: true, inherit: true, relative: $state.$current, notify: false });
      vm.retriveData(data);
    };

    // on change of page name
    vm.onChangePageName = (data) => {
      const isdirty = vm.checkFormDirty(vm.helpBlogForm);
      if (isdirty) {
        if (vm.manageBlog.keywords && vm.manageBlog.keywords.length > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.NOT_ADDED_CONFRIMATION);
          messageContent.message = stringFormat(messageContent.message, 'Keyword');
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.manageBlog.keywords = [];
              BaseService.currentPageForms.pop();
              vm.helpBlogForm.$setPristine();
              vm.setState(data);
            }
          }, () => {
            setFocus('keyword');
            return;
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              BaseService.currentPageForms.pop();
              vm.helpBlogForm.$setPristine();
              vm.setState(data);
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
      } else {
        vm.setState(data);
      }
    };

    // Intial Method to get all help blog list
    const initHelpBlog = () => {
      vm.cgBusyLoading = HelpBlogFactory.getHelpBlogDetailList().query().$promise.then((helpBlogDetails) => {
        if (helpBlogDetails && helpBlogDetails.data && helpBlogDetails.data.length > 0) {
          vm.ClearSearch();
          vm.helpBlogList = angular.copy(helpBlogDetails.data);
          vm.currentPageDetail = _.find(vm.helpBlogList, (item) => item.id === parseInt(vm.param.id));
          vm.copyHelpblogList = vm.helpBlogList;
          vm.isHelpBlogPageFound = vm.helpBlogList.length > 0 ? true : false;
          vm.initAutoCompletepagedetail();
          _.map(vm.helpBlogList, (data) => data.isSelected = false);
          const firstHelpBlogDetail = _.head(vm.helpBlogList);
          if (vm.param && vm.param.id) {
            vm.setState(vm.param);
          } else if (firstHelpBlogDetail) {
            vm.setState(firstHelpBlogDetail);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // method called on page itntialize to set model
    vm.pageInit = (data) => {
      vm.manageBlog = {
        id: data ? data.id : null,
        pageID: data ? data.pageID : null,
        keywords: data ? data.helpBlogKeyword : [],
        title: data ? data.title : null
      };
      if (!data) {
        initHelpBlog();
      } else {
        vm.initAutoCompletepagedetail();
      }
    };

    // get page list
    getPageDetail().then(() => {
      vm.pageInit();
    });

    // Search page name
    vm.searchPageName = (item) => {
      vm.helpBlogList = [];
      if (item) {
        const searchTxt = angular.copy(item).toLowerCase();
        const searchList = _.filter(vm.copyHelpblogList, (doc) =>
          (doc.title.toLowerCase().indexOf(searchTxt) !== -1)
        );
        vm.helpBlogList = vm.helpBlogList.concat(searchList);
      }
      else {
        vm.helpBlogList = vm.helpBlogList.concat(vm.copyHelpblogList);
      }
    };

    // Clear Search results
    vm.ClearSearch = () => {
      vm.searchQuery.pageName = '';
      vm.RefreshSearch();
    };

    /* Refresh Search results */
    vm.RefreshSearch = () => {
      vm.searchQuery.pageName = '';
      vm.helpBlogList = [];
      vm.helpBlogList = vm.helpBlogList.concat(vm.copyHelpblogList);
    };


    /* Used to check uniqe help blog page on select page */
    const checkUnique = (item) => {
      if (vm.manageBlog.pageID !== item.pageID) {
        vm.cgBusyLoading = HelpBlogFactory.checkUniqueHelpBlog().save(item).$promise.then((response) => {
          vm.cgBusyLoading = false;
          if (response && response.status !== CORE.ApiResponseTypeStatus.SUCCESS && vm.autoCompletepagedetail.keyColumnId !== null
            && response.errors && response.errors.data && response.errors.data.isNotUnique) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, 'Help blog');
            const alertModel = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(alertModel).then((yes) => {
              if (yes) {
                vm.autoCompletepagedetail.keyColumnId = null;
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // bind page detail dropdown
    function getPageDetail() {
      return vm.cgBusyLoading = PageDetailFactory.getPageList().query().$promise.then((res) => {
        vm.pageList = res.data;
      }).catch((err) => BaseService.getErrorLog(err));
    }

    /* declare auto complete for menu name */
    vm.initAutoCompletepagedetail = () => {
      vm.autoCompletepagedetail = {
        columnName: 'menuName',
        keyColumnName: 'pageID',
        keyColumnId: vm.manageBlog ? vm.manageBlog.pageID : null,
        inputName: 'Menu Name',
        placeholderName: 'Menu Name',
        isRequired: true,
        isAddnew: false,
        callbackFn: getPageDetail,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.currentPageName = item.pageName;
            checkUnique(item);
          }
        }
      };
    };

    /* add new keywords */
    vm.newKeyword = (chip, model) => {
      var seperatedString = angular.copy(chip).toString();
      var chipsArray = seperatedString.split(',');
      vm.helpBlogForm.$setDirty(true);
      _.each(chipsArray, (chipToAdd) => {
        vm[model].keywords.push({ id: null, keyword: chipToAdd });
      });
      return null;
    };


    vm.retriveData = (data) => {
      if (data) {
        vm.cgBusyLoading = HelpBlogFactory.getHelpBlogNotesById().query({ Id: data.id }).$promise.then((helpBlogNotes) => {
          if (helpBlogNotes && helpBlogNotes.data) {
            const currentHelpBlog = angular.copy(helpBlogNotes.data);
            vm.pageInit(currentHelpBlog);
            vm.oldTitle = angular.copy(vm.manageBlog.title);
            _.map(vm.helpBlogList, (data) => data.isSelected = false);
            const setIsSelect = _.find(vm.helpBlogList, (item) => item.id === currentHelpBlog.id);
            setIsSelect.isSelected = true;
            document.getElementById(`helpbdet${setIsSelect.id}`).scrollIntoView();
            vm.autoCompletepagedetail.keyColumnId = currentHelpBlog.pageID;
            vm.helpBlogNoteList = angular.copy(currentHelpBlog.helpBlogDetail);
            _.map(vm.helpBlogNoteList, (data) => {
              data.lastModified = BaseService.getUIFormatedDateTime(data.updatedAt, vm.DefaultDateTimeFormat);
              data.displayEditDO = false;
            });
            vm.helpBlogNoteList = _.orderBy(vm.helpBlogNoteList, [(o) => o.displayOrder || ''], ['asc']);
            vm.isNoDataFound = vm.helpBlogNoteList.length > 0 ? false : true;
            const collapsAll = _.every(vm.helpBlogNoteList, (det) => (det.isShow));
            if (collapsAll) {
              vm.isAllExpanded = true;
            } else {
              vm.isAllExpanded = false;
            }
            //vm.isAllExpanded = false;
            //vm.setHBExpandCollapse();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // Help blog history popup
    vm.openHistoryPopup = (data) => {
      let historyObjData = {};
      if (data && data.id) {
        //for list on left pane
        historyObjData = {
          id: data.id,
          title: data.title,
          helpBlogDetId: null
        };
      }
      else {
        // for current open page
        historyObjData = {
          id: vm.currentPageDetail.id,
          title: vm.currentPageDetail.title,
          helpBlogDetId: data ? data.Id : null
        };
      }

      DialogFactory.dialogService(
        CORE.MANGE_HELPBLOG_HISTORY_POPUP_CONTROLLER,
        CORE.MANGE_HELPBLOG_HISTORY_POPUP_VIEW,
        null,
        historyObjData).
        then(() => {
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };

    // delete help notes
    vm.deleteHelpBlogNote = (data) => {
      if (data && data.Id) {
        if (!vm.isEnableDeleteHelpBlogNote) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_RIGHT_FOR_FEATURE);
          messageContent.message = stringFormat(messageContent.message, CORE.FEATURE_NAME.AllowToDeleteHelpBlogNotes);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        } else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, 'Help Blog Section', 1);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          const objID = {
            id: data.Id,
            CountList: false
          };
          DialogFactory.messageConfirmDialog(obj).then((resposne) => {
            if (resposne) {
              vm.cgBusyLoading = HelpBlogFactory.deleteHelpBlogNotes().query({ objID: objID }).$promise.then((data) => {
                if (data && data.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  vm.retriveData(vm.manageBlog);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
      else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'Help Blog Note');
        const alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    // Add/Edit Help Blog Note
    vm.addEditHelpBlogNote = (data) => {
      if (!vm.isEnableUpdateHelpBlogNote) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_RIGHT_FOR_FEATURE);
        messageContent.message = stringFormat(messageContent.message, CORE.FEATURE_NAME.AllowToAddUpdateHelpBlogNotes);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      } else {
        const objdata = {
          helpBlogId: vm.manageBlog.id,
          pageID: vm.manageBlog.pageID,
          description: data ? data.description : null,
          displayOrder: data ? data.displayOrder : null,
          pageTitle: vm.manageBlog.title,
          menuName: vm.currentPageName ? vm.currentPageName : null,
          title: data ? data.title : null,
          isSystemGenerated: data ? data.isSystemGenerated : false,
          id: data ? data.Id : null
        };

        DialogFactory.dialogService(
          CORE.MANGE_HELPBLOG_DETAILS_POPUP_CONTROLLER,
          CORE.MANGE_HELPBLOG_DETAILS_POPUP_VIEW,
          null,
          objdata).
          then(() => {
            vm.retriveData(vm.manageBlog);
          }, () => {
            vm.retriveData(vm.manageBlog);
          }, (error) => BaseService.getErrorLog(error));
      }
    };

    /* Used to check uniqe help blog help blog title */
    vm.checkDuplicateTitle = () => {
      if (vm.manageBlog.title && angular.lowercase(vm.oldTitle) !== angular.lowercase(vm.manageBlog.title)) {
        vm.cgBusyLoading = HelpBlogFactory.checkUniqueHelpBlogTitle().save(vm.manageBlog).$promise.then((response) => {
          vm.cgBusyLoading = false;
          if (response && response.status !== CORE.ApiResponseTypeStatus.SUCCESS && response.errors && response.errors.data && response.errors.data.isNotUnique) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, 'Help blog title');
            const alertModel = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(alertModel).then((yes) => {
              if (yes) {
                vm.manageBlog.title = '';
                setFocus('blogTitle');
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* Save Help Blog */
    vm.Save = () => {
      if (BaseService.focusRequiredField(vm.helpBlogForm)) {
        return;
      }
      vm.manageBlog.pageID = vm.autoCompletepagedetail.keyColumnId;
      vm.cgBusyLoading = HelpBlogFactory.blog().save(vm.manageBlog).$promise.then((response) => {
        if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          BaseService.currentPageForms.pop();
          vm.helpBlogForm.$setPristine();
          initHelpBlog();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Hide/Show  accordian*/
    vm.toggleHBOperation = (item) => {
      item.isShow = !item.isShow;
      // const isAnyCollapse = _.some(vm.helpBlogNoteList, (item) => !item.isShow);
      const collapsAll = _.every(vm.helpBlogNoteList, (det) => (det.isShow));
      if (collapsAll) {
        vm.isAllExpanded = true;
      } else {
        vm.isAllExpanded = false;
      }
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    /* close popup on page destroy */
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });

    // /* toggle Display Order Edit */
    // vm.ToggleDOEdit = (element) => {
    //   if (!element.displayEditDO) {
    //     element.displayEditDO = true;
    //     vm.editDONumber = element.displayOrder;
    //   }
    //   else {
    //     if (parseFloat(vm.editDONumber) !== parseFloat(element.displayOrder)) { vm.updateDisplayNumber(element); }
    //     vm.editDONumber = null;
    //     element.displayEditDO = false;
    //   }
    // };


    /* Download feature */
    vm.downloadNote = (data) => {
      const obj = {
        helpBlogId: data.helpBlogId,
        helpBlogDetailID: data.Id,
        displayOrder: data.displayOrder,
        isFromPrint: false
      };
      if (obj) {
        vm.Download(obj);
      }
    };

    vm.Download = (obj) => {
      vm.cgBusyLoading = HelpBlogFactory.getHelpBlogTemplateDetails(obj).then((res) => {
        if (res && res.data) {
          if (res.data.byteLength > 0) {
            const blob = new Blob([res.data], {
              type: 'application/pdf'
            });
            const fileName = vm.currentPageName + (obj.displayOrder ? '-' + obj.displayOrder : '') + '.pdf';
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            if (obj.isFromPrint) {
              window.open(link);
            } else {
              document.body.appendChild(link);
              $timeout(() => {
                link.click();
                URL.revokeObjectURL(url);
                document.body.removeChild(link);
              });
            }
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };


    /* Print feature */
    vm.printNote = (data) => {
      let selectedIDs = [];
      if (data) {
        const obj = {
          helpBlogId: data.helpBlogId,
          helpBlogDetailID: data.Id,
          isFromPrint: true
        };

        if (obj) {
          vm.Download(obj);
        }
      } else {
        vm.selectedRows = vm.helpBlogNoteList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((itemData) => itemData.Id);
        }
        if (selectedIDs && selectedIDs.length > 0) {
          const obj = {
            helpBlogId: vm.manageBlog.id,
            helpBlogDetailID: selectedIDs,
            isFromPrint: true
          };
          vm.Download(obj);
        }
      }
    };


    /*Update Display Order*/
    vm.updateDisplayNumber = (element) => {
      const blogNotesData = {
        helpBlogId: element.helpBlogId ? element.helpBlogId : null,
        id: element.Id ? element.Id : null,
        displayOrder: element.displayOrder ? parseFloat(element.displayOrder) : null
      };

      vm.cgBusyLoading = HelpBlogFactory.saveHelpBlogNotes().save(blogNotesData).$promise.then((res) => {
        if (res && res.data) {
          vm.retriveData(vm.manageBlog);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Bulk Update Display Order*/
    const updateBulkDisplayOrder = () => {
      vm.cgBusyLoading = HelpBlogFactory.updateBulkDisplayOrder().save({ list: vm.helpBlogNoteList }).$promise.then(() => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Copy all KeyWord */
    vm.copyKeyword = ($event) => {
      var copyKeywords = null;
      if (vm.manageBlog.keywords.length > 0) {
        _.each(vm.manageBlog.keywords, (data) => {
          if (!copyKeywords) {
            copyKeywords = data.keyword;
          } else {
            copyKeywords += ',' + data.keyword;
          }
        }
        );
      }

      $event.stopPropagation();
      copyTextForWindow(copyKeywords);
    };

    /* Expand/collapse Feature */
    vm.setHBExpandCollapse = () => {
      vm.isAllExpanded = !vm.isAllExpanded;
      vm.helpBlogNoteList = _.each(vm.helpBlogNoteList, (item) => { item.isShow = vm.isAllExpanded; });
    };

    /* Redirect To Page */
    vm.redirectToPage = (page) => {
      if (page && page.pageRoute) {
        if (page.paramDet) {
          BaseService.openInNew(page.pageRoute, eval(page.paramDet));
        }
        else {
          BaseService.openInNew(page.pageRoute);
        }
      }
    };


    let reTryCount = 0;
    const getAllRights = () => {
      vm.isEnableUpdateHelpBlogNote = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToAddUpdateHelpBlogNotes);
      vm.isEnableDeleteHelpBlogNote = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToDeleteHelpBlogNotes);
      if ((vm.isEnableUpdateHelpBlogNote === null || vm.isEnableUpdateHelpBlogNote === undefined)
        || (vm.isEnableDeleteHelpBlogNote === null || vm.isEnableDeleteHelpBlogNote === undefined)
        && reTryCount < _configGetFeaturesRetryCount) {
        getAllRights(); //put for hard reload option as it will not get data from feature rights
        reTryCount++;
        // console.log(reTryCount);
      }
    };

    //getAllRights();
    let UpdateFeatureRightsCall = $rootScope.$on('UpdateFeatureRights', (loginUserPageList) => {
      getAllRights();
    });

    $rootScope.$on('$destroy', function () {
      UpdateFeatureRightsCall();
    });

    vm.helpBlogState = HELP_BLOG_DETAIL.HELPBLOGDETAIL_STATE;
    vm.redirectToHelpPage = () => {
      BaseService.openInNew(vm.helpBlogState, { pageID: vm.manageBlog.pageID });
    };

    // Set as current form when page loaded
    angular.element(() => {
      BaseService.currentPageForms = [vm.helpBlogForm];
      getAllRights();
    });
  }
})();
