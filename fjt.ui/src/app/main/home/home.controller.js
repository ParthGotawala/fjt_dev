(function () {
  'use strict';

  angular
    .module('app.home')
    .controller('HomeController', HomeController);

  /** @ngInject */
  function HomeController($rootScope, $timeout, $filter, CORE, BaseService, USER, UserPagePermisionFactory,
    uiSortableMultiSelectionMethods, $scope, $q, $state, DialogFactory, GenericCategoryFactory) {
    const vm = this;
    let initalHomePageMenuList = [];
    $rootScope.pageTitle = 'Home';
    vm.loginUser = BaseService.loginUser;
    vm.HomePageMenuList = [];
    vm.HomeMenuCategory = [];
    vm.HomeMenuList = [];
    let HomeMenuSearchList = [];
    vm.IsListView = true;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.categoryTypeID = CORE.Category_Type[18].categoryTypeID;
    let CategoryTypeList = [];
    CategoryTypeList = angular.copy(CORE.Category_Type);
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.paymenterm = CategoryTypeObjList.Terms.ID;
    let oldgencCategoryName;
    vm.categoryType = _.find(CategoryTypeList, (cateType) => cateType.categoryTypeID === vm.categoryTypeID);
    vm.HomeMenuMessages = {
      SIDEBAR_HEADER: CORE.HOME_MENU_MESSAGES.SIDEBAR_HEADER,
      EMPTY_MENU: vm.CORE_MESSAGE_CONSTANT.HOME_MENU_MESSAGES.EMPTY_MENU,
      EMPTY_ADD_HOME_MENU: vm.CORE_MESSAGE_CONSTANT.HOME_MENU_MESSAGES.EMPTY_ADD_HOME_MENU,
      DRAG_DROP_MESSAGE: CORE.HOME_MENU_MESSAGES.DRAG_DROP_MESSAGE,
      EMPTY_FILTER_MESSAGE: CORE.HOME_MENU_MESSAGES.EMPTY_FILTER_MESSAGE,
      SEARCH_IMAGE: CORE.HOME_MENU_MESSAGES.SEARCH_IMAGE
    };
    vm.EmptyMessage = USER.ADMIN_EMPTYSTATE.GENERICCATEGORY;
    vm.Message = stringFormat(vm.EmptyMessage.MESSAGE, vm.categoryType.displayName);
    vm.addButtonLabel = vm.categoryType.singleLabel;
    vm.AddnewMessage = stringFormat(vm.EmptyMessage.ADDNEWMESSAGE, vm.categoryType.displayName);
    vm.imageUrl = stringFormat(vm.EmptyMessage.IMAGEURL, vm.categoryType.categoryType.split(' ').join('-') + '.png');
    vm.roleAdmin = CORE.Role.SuperAdmin.toLowerCase();
    vm.roleExecutive = CORE.Role.Executive.toLowerCase();
    vm.noMenuFound = false;
    vm.isShowAllAddedMenuForFilter = false;
    $scope.selectedHomeMenuListAdded = [];
    $scope.selectedCategoryMenuItemListAdded = [];

    //// set selectablefor home menu list
    //const SetHomeMenuSelectable = () => {
    //  angular.element('[ui-sortable]#menuList').on('ui-sortable-selectionschanged', function () {
    //    $scope.selectedCategoryMenuItemListAdded = [];
    //    const $this = $(this);
    //    const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
    //      return $(this).index();
    //    }).toArray();
    //    $scope.selectedHomeMenuListAdded = _.map(selectedItemIndexes, (i) => vm.HomePageMenuList[i]);
    //    $scope.$applyAsync();
    //  });
    //};
    //// SetHomeMenuSelectable();
    //// set selectablefor home menu list
    //const SetHomeMenuCategorySelectable = () => {
    //  angular.element('[ui-sortable]#categoryMenuList').on('ui-sortable-selectionschanged', function () {
    //    $scope.selectedHomeMenuListAdded = [];
    //    const $this = $(this);
    //    const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
    //      return $(this).index();
    //    }).toArray();
    //    $scope.selectedCategoryMenuItemListAdded = _.map(selectedItemIndexes, (i) => vm.HomeMenuList[i]);
    //    $scope.$applyAsync();
    //  });
    //};
    //// SetHomeMenuCategorySelectable();
    /*Get the defualt role of user*/
    _.find(vm.loginUser.roles, (role) => {
      if (role.id === vm.loginUser.defaultLoginRoleID) {
        vm.defaultRole = role.name.toLowerCase();
      }
    });

    // get menu which is reside under genereic category
    vm.getHomeMenuListOrder = () => {
      if (vm.loginUser && vm.loginUser.defaultLoginRoleID) {
        return UserPagePermisionFactory.getHomeMenuListOrderWise().query(vm.loginUser).$promise.then((homeMenuList) => {
          vm.HomeMenuList = homeMenuList.data;
          return $q.resolve(homeMenuList);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // Get home menu category (generic category)
    vm.getHomeMenuCat = () => {
      if (vm.loginUser && vm.loginUser.defaultLoginRoleID) {
        return UserPagePermisionFactory.getHomeMenuCategory().query(vm.loginUser).$promise.then((result) => $q.resolve(result.data)).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // Get default Menu (IsShowInHomePage = 1 in userpagedetails table)
    vm.getUserHomePageMenu = () => {
      if (vm.loginUser && vm.loginUser.defaultLoginRoleID) {
        return UserPagePermisionFactory.getHomePageMenu().query(vm.loginUser).$promise.then((res) => {
          vm.HomePageMenuList = initalHomePageMenuList = res.data;
          HomeMenuSearchList = res.data; // Used to filter record
          vm.IsAddedMenuCount = _.filter(HomeMenuSearchList, (item) => item.isAdded === 1);
          if (vm.HomePageMenuList.length === 0) {
            vm.noMenuFound = true;
          }
          else {
            vm.noMenuFound = false;
          }
          vm.ShowHideMenu();
          if (vm.SearchMenus) {
            vm.SearchMenu(vm.SearchMenus);
          }
          return $q.resolve(vm.HomePageMenuList);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const initLoadData = [vm.getHomeMenuListOrder(), vm.getHomeMenuCat(), vm.getUserHomePageMenu()];
    vm.cgBusyLoading = $q.all(initLoadData).then((responses) => {
      if (responses && responses.length > 0) {
        const HomeMenuCategory = responses[1];
        setHomeMenuCatDataAfterGet(HomeMenuCategory);
      }
    }).catch((error) => BaseService.getErrorLog(error));
    /*Used to set home menu category*/
    const setHomeMenuCatDataAfterGet = (HomeMenuCategory) => {
      _.map(HomeMenuCategory, (item) => {
        item.menuList = [];
        if (vm.HomeMenuList.length > 0) {
          item.menuList = _.filter(vm.HomeMenuList, (Menuitem) => item.gencCategoryID === Menuitem.genericCategoryID);
        }
        item.isShowEdit = false;
        item.isDisableEdit = false;
        item.dropItem = [angular.copy(item)];
      });
      vm.HomeMenuCategory = HomeMenuCategory;
      vm.getUserHomePageMenu();
    };

    // Used to save order of menu which is reside Home Menu Category box
    vm.SaveDisplayOrder = (listObj) => {
      const ListData = [];
      _.each(listObj.menuList, (item) => {
        if (item) {
          ListData.push({ Id: item.Id, userPageID: item.userPageID });
        }
      });

      const SaveMenuList = {
        userId: vm.loginUser.userid,
        roleID: vm.loginUser.defaultLoginRoleID,
        menuList: ListData,
        gencCategoryID: listObj.gencCategoryID ? listObj.gencCategoryID : listObj.genericCategoryID,
        isMenuItemDisplayOrderChanged: listObj.isMenuItemDisplayOrderChanged,
        gencCategoryName: ''
      };

      if (vm.HomeMenuCategory.length > 0) {
        const gencCateObj = _.find(vm.HomeMenuCategory, (item) => item.gencCategoryID === SaveMenuList.gencCategoryID);
        if (gencCateObj) {
          SaveMenuList.gencCategoryName = gencCateObj.gencCategoryName;
        }
      }

      vm.cgBusyLoading = UserPagePermisionFactory.createMenuDisplayOrder().save({ listObj: SaveMenuList }).$promise.then((response) => {
        if (response && response.data && response.data.duplicatePageList) {
          //code for menu exists message popup
          const duplicatePageList = [];
          _.map(response.data.duplicatePageList, (item) => duplicatePageList.push(_.filter(initalHomePageMenuList, (i) => i.userPageID === item)[0].menuName));
          const data = {
            // title: response.data.messageContent,
            messageContent: response.data.messageContent,
            duplicateData: duplicatePageList
          };
          DialogFactory.dialogService(
            CORE.HOME_DUPLICATE_ENTRY_DIALOG_POPUP_CONTROLLER,
            CORE.HOME_DUPLICATE_ENTRY_DIALOG_POPUP_VIEW,
            null,
            data).then(() => { // Empty
            }, () => { // empty
            }, (err) => BaseService.getErrorLog(err));
        }
        $timeout(() => {
          const saveLoadData = [vm.getHomeMenuListOrder(), vm.getHomeMenuCat()]; //, vm.getUserHomePageMenu() -> removed as menu list was loading on save
          vm.cgBusyLoading = $q.all(saveLoadData).then((responses) => {
            if (responses && responses.length > 0) {
              const HomeMenuCategory = responses[1];
              setHomeMenuCatDataAfterGet(HomeMenuCategory);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }, 1000);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Used to save display order of Home Menu Category box
    vm.SaveGenericCategoryDisplayOrder = (objModel) => {
      const ListData = [];
      _.each(objModel, (item) => {
        ListData.push({ gencCategoryID: item.gencCategoryID });
      });
      UserPagePermisionFactory.createGenericCategoryDisplayOrder().save({ objModel: ListData }).$promise.then(() => {
        $timeout(() => {
          const saveLoadData = [vm.getHomeMenuListOrder(), vm.getHomeMenuCat(), vm.getUserHomePageMenu()];
          vm.cgBusyLoading = $q.all(saveLoadData).then((responses) => {
            if (responses && responses.length > 0) {
              const HomeMenuCategory = responses[1];
              setHomeMenuCatDataAfterGet(HomeMenuCategory);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }, 1000);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Remove menu from home category
    vm.DeleteHomeMenuItems = (objModel) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
      messageContent.message = stringFormat(messageContent.message, 'Menu item from the category', objModel.menuName);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.cgBusyLoading = UserPagePermisionFactory.DeleteHomeMenuItems().save({ Id: objModel.Id }).$promise.then(() => {
            const initLoadData = [vm.getHomeMenuListOrder(), vm.getHomeMenuCat()];
            vm.cgBusyLoading = $q.all(initLoadData).then((responses) => {
              if (responses && responses.length > 0) {
                const HomeMenuCategory = responses[1];
                setHomeMenuCatDataAfterGet(HomeMenuCategory);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, () => { // cancel
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Shortable oprions dirctory
    vm.SameDivMenu = false;
    let outside = true;
    vm.sortableOptions = uiSortableMultiSelectionMethods.extendOptions({
      'multiSelectOnClick': true,
      'ui-floating': true,
      'ui-selection-count': true,
      cancel: '.cursor-not-allow,:input',
      placeholder: 'dragandDropPlaceholder',
      connectWith: '.apps-container',
      items: '.sortable-item',
      start: (event, ui) => {
        // console.log("1.1");
      },
      over: function (event, ui) {
        // console.log("1.3");
        outside = false;
      },
      out: function (event, ui) {
        // console.log("1.4");
        outside = true;
      },
      beforeStop: function (event, ui) {
        // console.log("1.5");
        if (outside) {
          ui.item.sortable.cancel();
          return;
        }
      },
      update: (e, ui) => {
        // console.log("1.2");
        const sourceTarget = ui.item.sortable.source ? ui.item.sortable.source[0] : '';
        const dropTarget = ui.item.sortable.droptarget ? ui.item.sortable.droptarget[0] : '';
        //Source: Side Menu Bar - Target: Other than drop area
        if ((sourceTarget && sourceTarget.id === 'menuList') && (dropTarget && dropTarget.id === '')) {
          // console.log("1.2.1");
          ui.item.sortable.cancel();
        }
        //Source: Category Menu List - Target: Other than drop area
        else if ((sourceTarget && sourceTarget.id === 'categoryWiseMenuList') && (dropTarget && dropTarget.id === '')) {
          // console.log("1.2.2");
          ui.item.sortable.cancel();
        }
        //Source: Category Menu List - Target: Side Menu Bar
        else if ((sourceTarget && sourceTarget.id === 'categoryWiseMenuList') && (dropTarget && dropTarget.id === 'menuList')) {
          // console.log("1.2.3");
          ui.item.sortable.cancel();
        }
        else if ((sourceTarget && sourceTarget.id === 'menuList') && (dropTarget && dropTarget.id === 'menuList')) {
          // console.log("1.2.4");
          ui.item.sortable.cancel();
        }
      },
      stop: function (e, ui) {
        // console.log("1.6");
        const droptargetModel = _.first(ui.item.sortable.droptargetModel);
        const sourceModel = ui.item.sortable.sourceModel;

        if (droptargetModel) {
          // console.log("1.6.1");
          const dropCategoryID = parseInt(ui.item.sortable.droptarget.attr('data-gencCategoryID') || 0);
          const sourceTarget = ui.item.sortable.source[0];
          const dropTarget = ui.item.sortable.droptarget[0];

          //Source: Side Menu Bar - Target: Side Menu Bar - Update Display Order
          if ((sourceTarget && sourceTarget.id === 'menuList') && (dropTarget && dropTarget.id === 'menuList')) {
            // console.log("1.6.2");
            //console.log("2.1");
          }
          //Source: Side Menu Bar - Target: Category Menu List - Add New menu in category list
          else if ((sourceTarget && sourceTarget.id === 'menuList') && (dropTarget && dropTarget.id === 'categoryList')) {
            // console.log("1.6.3");
            if (droptargetModel && droptargetModel.menuList) {
              droptargetModel.menuList.push({ userPageID: ui.item.sortable.model.userPageID, genericCategoryID: droptargetModel.gencCategoryID });
            }
            vm.SaveDisplayOrder(droptargetModel);
          }
          //Source: Category Menu List - Target: Category Menu List - Change Category Display Order
          else if ((sourceTarget && sourceTarget.id === 'categoryWiseMenuList') && (dropTarget && dropTarget.id === 'categoryWiseMenuList')) {
            // console.log("1.6.4");
            const obj = {
              menuList: ui.item.sortable.droptargetModel,//sourceModel
              genericCategoryID: dropCategoryID,
              isMenuItemDisplayOrderChanged: sourceModel && sourceModel.length > 0 ? (sourceModel[0].genericCategoryID === dropCategoryID) : false
            };
            vm.SaveDisplayOrder(obj);
          }
          //Source: Category Menu List - Target: Category Menu List - Remove from Source Category Menu List and Add New Menu
          else if ((sourceTarget && sourceTarget.id === 'categoryWiseMenuList') && (dropTarget && dropTarget.id === 'categoryList')) {
            // console.log("1.6.5");
            const arrMenu = []; //
            arrMenu.push(ui.item.sortable.droptargetModel[1]);
            const obj = {
              menuList: arrMenu,//sourceModel
              genericCategoryID: ui.item.sortable.droptargetModel[0].gencCategoryID,
              isMenuItemDisplayOrderChanged: false
            };
            vm.SaveDisplayOrder(obj);
          }
          //Source: Side Menu Bar - Target: Category Menu List - Add New menu in category list
          else if ((sourceTarget && sourceTarget.id === 'menuList') && (dropTarget && dropTarget.id === 'categoryWiseMenuList')) {
            // console.log("1.6.6");
            const obj = {
              menuList: ui.item.sortable.source.prevObject.sortable.droptargetModel,
              genericCategoryID: dropCategoryID,
              isMenuItemDisplayOrderChanged: false
            };
            const newDropObject = _.find(obj.menuList, (menuItem) => !menuItem.Id);
            if (newDropObject) {
              vm.SaveDisplayOrder(obj);
            } else {
              ui.item.sortable.cancel();
            }
          }
        }
        ui.item.sortable.cancel();
      }
    });

    /*Show alert for duplicate menu*/
    vm.showAlertDialog = (menuName) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALREADY_EXISTS);
      messageContent.message = stringFormat(messageContent.message, menuName.menuName);
      const alertModel = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(alertModel);
      vm.getHomeMenuCat();
    };
    /*Shortable option dirctory*/
    vm.sortableOptionsCategory = {
      connectWith: '.apps-container-category',
      items: '.sortable-item-category',
      start: (event, ui) => {
        // console.log("2.1")
      },
      over: function (event, ui) {
        // console.log("2.2");
        outside = false;
      },
      out: function (event, ui) {
        // console.log("2.3");
        outside = true;
      },
      beforeStop: function (event, ui) {
        // console.log("2.4");
        if (outside) {
          ui.item.sortable.cancel();
          return;
        }
      },
      stop: function (e, ui) {
        // console.log("2.5");
        const droptargetModel = ui.item.sortable.droptargetModel;
        if (droptargetModel) {
          vm.SaveGenericCategoryDisplayOrder(droptargetModel);
        }
      }
    };

    /*Used to display menu as list view*/
    vm.ShowListView = () => {
      vm.IsListView = true;
      setLocalStorageValue('HomeListView', { isListView: true });
    };
    /*Used to display menu as grid view*/
    vm.ShowGridView = () => {
      vm.IsListView = false;
      setLocalStorageValue('HomeListView', { isListView: false });
    };

    //Added for default view on load
    const objListView = getLocalStorageValue('HomeListView');
    if (objListView) {
      vm.IsListView = objListView.isListView;
    }
    if (!vm.IsListView) {
      setLocalStorageValue('HomeListView', { isListView: false });
    }
    //Added for default view on load

    /*Refresh data*/
    vm.refreshData = () => {
      vm.searchText = '';
      const refresh = [vm.getHomeMenuListOrder(), vm.getHomeMenuCat(), vm.getUserHomePageMenu()];
      vm.cgBusyLoading = $q.all(refresh).then((responses) => {
        if (responses && responses.length > 0) {
          const HomeMenuCategory = responses[1];
          setHomeMenuCatDataAfterGet(HomeMenuCategory);
          vm.SearchMenus = '';
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    /*Open pop-up to add home menu catgeory*/
    vm.GoToHomeMenuCategories = (e, item) => {
      const popUpData = {
        popupAccessRoutingState: [USER.ADMIN_HOME_MENU_CATEGORY_MANAGEGENERICCATEGORY_STATE],
        pageNameAccessLabel: stringFormat(CORE.Manage_PageName_Title_Format, CORE.CategoryType.HomeMenu.Title)
      };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        const data = {
          Id: CORE.CategoryType.HomeMenu.ID,
          gencCategoryName: CORE.CategoryType.HomeMenu.Name,
          headerTitle: CORE.CategoryType.HomeMenu.Title,
          Title: CORE.CategoryType.HomeMenu.Title,
          IsHideActiveDeActiveFields: true,
          gencCategoryID: item && item.gencCategoryID ? item.gencCategoryID : null
        };

        DialogFactory.dialogService(
          USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
          USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
          e,
          data).then(() => { // Empty
          }, (data) => {
            if (data) {
              const initLoadData = [vm.getHomeMenuListOrder(), vm.getHomeMenuCat()];
              vm.cgBusyLoading = $q.all(initLoadData).then((responses) => {
                if (responses && responses.length > 0) {
                  const HomeMenuCategory = responses[1];
                  setHomeMenuCatDataAfterGet(HomeMenuCategory);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          },
            () => { // Empty
            });
      }
    };
    /*Used to delete home menu category*/
    vm.deleteRecord = (genericcategory) => {
      const popUpData = {
        popupAccessRoutingState: [USER.ADMIN_GENERICCATEGORY_HOME_MENU_CATEGORY_STATE],
        pageNameAccessLabel: CORE.CategoryType.HomeMenu.Title
      };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        const selectedIDs = [];
        let categoryType = null;
        if (genericcategory) {
          selectedIDs.push(genericcategory.gencCategoryID);
          categoryType = genericcategory.categoryType;
        }

        if (selectedIDs) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, genericcategory.categoryType, genericcategory.gencCategoryName);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          const objIDs = {
            id: selectedIDs,
            categoryType: categoryType,
            displayName: genericcategory.categoryType,
            CountList: false,
            isHomePage: true
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.cgBusyLoading = GenericCategoryFactory.deleteGenericCategory().save({
                objIDs: objIDs
              }).$promise.then((res) => {
                if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  const initLoadData = [vm.getHomeMenuListOrder(), vm.getHomeMenuCat()];
                  vm.cgBusyLoading = $q.all(initLoadData).then((responses) => {
                    if (responses && responses.length > 0) {
                      vm.editCategoryForm.$setPristine();
                      const HomeMenuCategory = responses[1];
                      setHomeMenuCatDataAfterGet(HomeMenuCategory);
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => { // Empty
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          //show validation message no data selected
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
          messageContent.message = stringFormat(messageContent.message, vm.categoryType ? vm.categoryType.displayName : 'generic category');
          const alertModel = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(alertModel);
        }
      }
    };
    /*Used to search menu on side bar*/
    vm.SearchMenu = (searchText) => {
      vm.searchText = searchText;
      if (searchText) {
        vm.HomePageMenuList = _.filter(HomeMenuSearchList, (item) => item.menuName.toLowerCase().includes(searchText.toLowerCase())
          || (item.Keywords && item.Keywords.toLowerCase().includes(searchText.toLowerCase())));
        if (!vm.isShowAllAddedMenuForFilter) {
          vm.HomePageMenuList = $filter('filter')(vm.HomePageMenuList, { isAdded: 0 });
        }
      }
      else {
        vm.SearchMenus = '';
        if (vm.isShowAllAddedMenuForFilter) {
          vm.HomePageMenuList = HomeMenuSearchList;
        }
        else {
          vm.HomePageMenuList = $filter('filter')(HomeMenuSearchList, { isAdded: 0 });
        }
      }
    };

    /*Used to show/hide already added menu*/
    vm.ShowHideMenu = () => {
      if (vm.isShowAllAddedMenuForFilter) {
        vm.HomePageMenuList = angular.copy(HomeMenuSearchList);
      } else {
        vm.HomePageMenuList = $filter('filter')(HomeMenuSearchList, { isAdded: 0 });
      }
      if (vm.SearchMenus) {
        vm.SearchMenu(vm.SearchMenus);
      }
    };

    /*Used to edit home menu category*/
    vm.EditMode = (item) => {
      const popUpData = {
        popupAccessRoutingState: [USER.ADMIN_HOME_MENU_CATEGORY_MANAGEGENERICCATEGORY_STATE],
        pageNameAccessLabel: stringFormat(CORE.Manage_PageName_Title_Format, CORE.CategoryType.HomeMenu.Title)
      };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        if (item.isShowEdit) {
          vm.AddgenCategory(item);
        }
        else {
          _.each(vm.HomeMenuCategory, (Catitem) => {
            _.each(Catitem.dropItem, (CatDropitem) => {
              if (item.gencCategoryID !== CatDropitem.gencCategoryID) {
                CatDropitem.isDisableEdit = true;
              }
            });
          });
          item.isShowEdit = true;
          oldgencCategoryName = item.gencCategoryName;
          $timeout(() => {
            vm.SetFocusOnField('GencCategory_' + item.gencCategoryID);
          }, 500);
        }
      }
    };
    /*Used to cancel edit mode of home menu category*/
    vm.cacnelEditMode = (item) => {
      vm.editCategoryForm.$setPristine();
      item.gencCategoryName = oldgencCategoryName;
      item.isShowEdit = false;
      _.each(vm.HomeMenuCategory, (Catitem) => {
        _.each(Catitem.dropItem, (CatDropitem) => {
          CatDropitem.isDisableEdit = false;
        });
      });
    };

    /*Used to edit home menu category*/
    vm.AddgenCategory = (item) => {
      if (vm.editCategoryForm.$invalid) {
        BaseService.focusRequiredField(vm.editCategoryForm);
        return;
      }

      const genericCategoryInfo = {
        gencCategoryName: item.gencCategoryName,
        gencCategoryCode: null,
        categoryType: vm.categoryType ? vm.categoryType.categoryType : null,
        displayName: vm.categoryType ? vm.categoryType.displayName : null,
        displayOrder: null,
        singleLabel: vm.categoryType ? vm.categoryType.singleLabel : null,
        termsDays: null,
        parentGencCategoryID: item.parentGencCategoryID,
        isActive: true,
        systemGenerated: 0,
        isCheckUnique: true
      };
      //Save or update generic category
      if (item.gencCategoryID) {
        vm.cgBusyLoading = GenericCategoryFactory.genericcategory().update({
          id: item.gencCategoryID
        }, genericCategoryInfo).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.editCategoryForm.$setPristine();
            item.isShowEdit = false;
            _.each(vm.HomeMenuCategory, (Catitem) => {
              _.each(Catitem.dropItem, (CatDropitem) => {
                CatDropitem.isDisableEdit = false;
              });
            });
            vm.getHomeMenuCat();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    /* focus on textbox */
    vm.SetFocusOnField = (fieldID) => {
      const element = document.getElementById(fieldID);
      if (element) {
        element.focus();
      }
    };

    /*Used to check duplicate entry of home menu category*/
    vm.checkGenericCategoryAlreadyExists = (item) => {
      if (item.gencCategoryName) {
        if ((oldgencCategoryName.toLowerCase() !== item.gencCategoryName.toLowerCase())) {
          const objs = {
            gencCategoryName: item.gencCategoryName.toLowerCase() ? item.gencCategoryName.toLowerCase() : null,
            categoryType: vm.categoryType ? vm.categoryType.categoryType : null,
            singleLabel: vm.categoryType.singleLabel ? vm.categoryType.singleLabel : null
          };
          vm.cgBusyLoading = GenericCategoryFactory.checkGenericCategoryAlreadyExists().query({ objs: objs }).$promise.then((res) => {
            vm.cgBusyLoading = false;
            if (res.status !== CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.gencCategoryName = null;
              if (checkResponseHasCallBackFunctionPromise(res)) {
                res.alretCallbackFn.then(() => {
                  vm.SetFocusOnField('GencCategory_' + item.gencCategoryID);
                });
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };
    //redirect on page rights form role page
    vm.GoToPageRights = () => {
      BaseService.openInNew(USER.ADMIN_PAGERIGHT_STATE, {});
    };
    /* Set as current form when page loaded */
    angular.element(() => BaseService.currentPageForms = [vm.editCategoryForm]);

    /* open directly accessible popup */
    vm.openPopup = (popupFunName) => {
      BaseService[popupFunName].call();
    };
  }
})();
