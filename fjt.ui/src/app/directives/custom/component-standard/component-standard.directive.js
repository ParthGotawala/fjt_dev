(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('componentStandard', componentStandard);
  /** @ngInject */
  function componentStandard(CORE, DialogFactory, $q, ComponentStandardDetailsFactory, CertificateStandardFactory, USER,
    ComponentFactory, BaseService, WorkorderFactory, GenericCategoryFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        componentId: '=',
        isReadOnly: '=?',
        rfqFormsId: '=',
        applyFromRfqPage: '=',
        parentPageForm: '='
      },
      templateUrl: 'app/directives/custom/component-standard/component-standard.html',
      controller: componentStandardCtrl,
      controllerAs: 'vm'
    };
    return directive;
    /** @ngInject */
    function componentStandardCtrl($scope, $element, $attrs) {
      var vm = this;
      var oldStandardList = [];
      vm.isReadOnly = $scope.isReadOnly;
      var newStandardList = [];
      const componentID = $scope.componentId ? parseInt($scope.componentId) : null;
      //vm.loginUserRoleList = BaseService.loginUser.roles.map((item) => { return item.id; });
      vm.loginUserRoleList = [BaseService.loginUser.defaultLoginRoleID];
      let ispasswordProtected = false;
      let componentMstDetails = null;
      const rfqFormsID = $scope.rfqFormsId ? $scope.rfqFormsId : null;
      vm.CertificateEmptyMesssage = USER.ADMIN_EMPTYSTATE.CERTIFICATE_STANDARD;
      const standardTypeConst = CORE.CategoryType.StandardType;

      /* get all standard type list */
      const getAllStandardTypes = () =>
        GenericCategoryFactory.getAllGenericCategoryByCategoryType().query({ categoryType: standardTypeConst.Name }).$promise
          .then((genericcategorylist) => {
            vm.standardTypeList = [];
            if (genericcategorylist.data) {
              vm.standardTypeList = genericcategorylist.data;
            }
            return $q.resolve(vm.standardTypeList);
          }).catch((error) =>
            BaseService.getErrorLog(error)
          );

      /* get all standard Description */
      vm.showDescription = (certObj, certiClassobject, ev, callFrom) => {
        let data = {};
        if (callFrom === 'StandardDescription') {
          data = {
            title: 'Standard Description',
            description: certObj.description,
            headerData: [{
              label: 'Standard',
              value: certObj.fullName,
              displayOrder: 1,
              labelLinkFn: () => {
                BaseService.goToStandardList();
              },
              valueLinkFn: () => {
                BaseService.goToStandardDetails(certObj.certificateStandardID);
              }
            }]
          };
        }
        else if (callFrom === 'CategoryDescription') {
          data = {
            title: 'Standard Category Description',
            description: certiClassobject.description,
            headerData: [{
              label: 'Standard',
              value: certObj.fullName,
              displayOrder: 1,
              labelLinkFn: () => {
                BaseService.goToStandardList();
              },
              valueLinkFn: () => {
                BaseService.goToStandardDetails(certObj.certificateStandardID);
              }
            }, {
              label: 'Standard Category',
              value: certiClassobject.className,
              displayOrder: 2,
              labelLinkFn: () => {
                BaseService.goToStandardCaregoryList();
              }
            }]
          };
        }
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          data).then(() => {
          }, (err) => BaseService.getErrorLog(err));
      };
      /* get all standards from master */
      function getStandard() {
        return CertificateStandardFactory.getCertificateStandardRole().query().$promise.then((response) => {
          vm.allStandardWithClassList = [];
          if (response && response.data) {
            //vm.CertificateList = [];
            //vm.MainCertificateList = [];
            _.each(response.data, (item) => {
              if (item.certificateStandardRole.length > 0) {
                const roleIds = item.certificateStandardRole.map((x) => x.roleID);
                const sameRoles = _.intersection(roleIds, vm.loginUserRoleList);
                if (sameRoles.length > 0) {
                  item.disableStandard = false;
                }
                else {
                  item.disableStandard = true;
                }
              }
              else {
                item.disableStandard = true;
              }
              item.certificateStandard = _.first(item.certificateStandard);
              if (item.certificateStandard) {
                item.selected = true;
              }
              else {
                item.selected = false;
              }
              if (item.CertificateStandard_Class.length > 0) {
                const StandardClass = [];
                _.each(item.CertificateStandard_Class, (standardClass) => {
                  standardClass.selected = false;
                  StandardClass.push(standardClass);
                });
                //display order wise class
                item.CertificateStandard_Class = _.sortBy(StandardClass, ['displayOrder', 'className']);
                //vm.CertificateList.push(item);
                vm.allStandardWithClassList.push(item);
              }
              else {
                //vm.MainCertificateList.push(item);
                vm.allStandardWithClassList.push(item);
              }
            });
            //display order wise standard
            //vm.CertificateList = _.sortBy(vm.CertificateList, 'displayOrder');

            //vm.parentCertificateStandardList = vm.CertificateList;
            //vm.MainCertificateStandardList = vm.MainCertificateList;
            //vm.allStandardWithClassList = _.sortBy(vm.allStandardWithClassList, 'priority');

            if (response.data.length === 0) {
              vm.isNoDataFound = true;
            }
            else {
              vm.isNoDataFound = false;
            }
          }
          return $q.resolve(vm.allStandardWithClassList);
        });
      }

      /* get all selected component standards */
      function getComponentStandardDetail() {
        if (componentID) {
          return ComponentStandardDetailsFactory.getcomponentstandardDetail().query({ id: componentID }).$promise.then((response) => {
            vm.componentStandardDetaillist = response.data;
            //fatch selected standard
            vm.selectedStandard = [];
            _.each(vm.componentStandardDetaillist, (stdclass) => {
              stdclass.class = stdclass.Standardclass ? stdclass.Standardclass.className : null;
              stdclass.standard = stdclass.certificateStandard ? stdclass.certificateStandard.fullName : null;
              vm.selectedStandard.push(stdclass);
            });
          });
        }
      }

      function getComponentDetails() {
        if (componentID) {
          const componentObj = {
            componentID: componentID
          };
          return ComponentFactory.getComponentBasicDetails().save(componentObj).$promise.then((response) => {
            if (response && response.data) {
              componentMstDetails = response.data;
            }
          });
        }
      }

      function getAllData() {
        var promise = [getAllStandardTypes(), getStandard(), getComponentStandardDetail(), getComponentDetails()];
        vm.cgBusyLoading = $q.all(promise).then((response) => {
          // if (vm.componentStandardDetaillist) {
          // _.each(vm.MainCertificateStandardList, (standard) => {
          //_.each(vm.allStandardWithClassList, (standard) => {
          //    var standardObj = _.find(vm.componentStandardDetaillist, (objstd) => {
          //        return objstd.certificateStandardID == standard.certificateStandardID;
          //    })
          //    if (standardObj) {
          //        standard.selected = true;
          //        standard.DetailId = standardObj.id
          //    }
          //})
          //_.each(vm.parentCertificateStandardList, (standardClass) => {

          const removeInactiveStdIDs = [];
          const removeInactiveStdClassIDs = [];
          _.each(vm.allStandardWithClassList, (standardItem) => {
            if (vm.componentStandardDetaillist) { /* if contain component std */
              const standardObj = _.find(vm.componentStandardDetaillist, (objstd) =>
                objstd.certificateStandardID === standardItem.certificateStandardID
              );
              if (standardObj) {
                standardItem.selected = true;
                standardItem.DetailId = standardObj.id;
                if (standardObj.ClassID) {
                  /* set selected std class as selcted */
                  /* and already selected std with class then remove inactive std class that not selected */
                  const selectedClass = standardObj.ClassID;
                  _.each(standardItem.CertificateStandard_Class, (classobj) => {
                    if (selectedClass === classobj.classID) {
                      classobj.selected = true;
                    }
                    else {
                      if (!classobj.isActive) {
                        removeInactiveStdClassIDs.push(classobj.classID);
                      }
                    }
                  });
                }
                else {
                  /* may be new std with class then remove inactive std class */
                  _.each(standardItem.CertificateStandard_Class, (classobj) => {
                    if (!classobj.isActive) {
                      removeInactiveStdClassIDs.push(classobj.classID);
                    }
                  });
                }
              }
              else {
                /* remove inactive stdids collection */
                if (!standardItem.isActive) {
                  removeInactiveStdIDs.push(standardItem.certificateStandardID);
                }
                else {
                  /* remove inactive classids collection */
                  _.each(standardItem.CertificateStandard_Class, (classobj) => {
                    if (!classobj.isActive) {
                      removeInactiveStdClassIDs.push(classobj.classID);
                    }
                  });
                }
              }
            }
            else {
              /* if not contain component std */
              /* remove inactive stdids collection */
              if (!standardItem.isActive) {
                removeInactiveStdIDs.push(standardItem.certificateStandardID);
              }
              else {
                /* remove inactive classids collection */
                _.each(standardItem.CertificateStandard_Class, (classobj) => {
                  if (!classobj.isActive) {
                    removeInactiveStdClassIDs.push(classobj.classID);
                  }
                });
              }
            }
          });

          /* remove inactive standards */
          if (removeInactiveStdIDs.length > 0) {
            vm.allStandardWithClassList = vm.allStandardWithClassList.filter((el) =>
              !removeInactiveStdIDs.includes(el.certificateStandardID)
            );
          }
          /* remove inactive class of standard */
          if (removeInactiveStdClassIDs.length > 0) {
            _.each(vm.allStandardWithClassList, (standardItem) => {
              if (standardItem.CertificateStandard_Class && standardItem.CertificateStandard_Class.length > 0) {
                standardItem.CertificateStandard_Class = standardItem.CertificateStandard_Class.filter((el) =>
                  !removeInactiveStdClassIDs.includes(el.classID)
                );
              }
            });
          }
          //}

          /* expanded div as by default if component std exists */
          const removeInActiveStdType = [];
          _.each(vm.standardTypeList, (stdTypeItem) => {
            const isStdTypeContainCompCerti = _.some(vm.componentStandardDetaillist, (stdItem) =>
              stdItem.certificateStandard.standardTypeID === stdTypeItem.gencCategoryID
            );
            //stdTypeItem.isExpanded = isStdTypeContainCompCerti;
            if (!stdTypeItem.isActive && !isStdTypeContainCompCerti) {
              removeInActiveStdType.push(stdTypeItem.gencCategoryID);
            }
          });

          /* remove inactive std type if not contain any transaction data */
          if (removeInActiveStdType.length > 0) {
            vm.standardTypeList = vm.standardTypeList.filter((el) =>
              !removeInActiveStdType.includes(el.gencCategoryID)
            );
          }
          if ($scope.parentPageForm) {
            $scope.parentPageForm.$setPristine();
            $scope.parentPageForm.$setUntouched();
          }
        });
      }

      getAllData();

      const saveStandardComponent = $scope.$on('standardComponent', (evt) => {
        if (vm.isReadOnly) {
          return;
        }
        const objs = {
          woID: null,
          partID: componentID,
          rfqFormsID: rfqFormsID
        };
        const allStandards = [];
        const newStandards = [];
        /* selected All Old Standards */
        const selectedAllOldStandards = [];
        _.each(vm.componentStandardDetaillist, (stdwithclassItem) => {
          const stdwithclassObj = {};
          stdwithclassObj.colorCode = CORE.DefaultStandardTagColor;
          stdwithclassObj.class = stdwithclassItem.Standardclass ? stdwithclassItem.Standardclass.className : null;
          stdwithclassObj.colorCode = stdwithclassItem.Standardclass ? (stdwithclassItem.Standardclass.colorCode ? stdwithclassItem.Standardclass.colorCode : CORE.DefaultStandardTagColor) : CORE.DefaultStandardTagColor;
          stdwithclassObj.standard = stdwithclassItem.certificateStandard.fullName;
          stdwithclassObj.priority = stdwithclassItem.certificateStandard.priority;
          selectedAllOldStandards.push(stdwithclassObj);
          if (stdwithclassItem.certificateStandard && stdwithclassItem.certificateStandard.isExportControlled) {
            allStandards.push(stdwithclassItem.certificateStandardID);
          }
          oldStandardList.push(stringFormat(CORE.StandardDisplayFormat, stdwithclassObj.class ? stdwithclassObj.class : '', stdwithclassObj.standard));
        });
        selectedAllOldStandards.sort(sortAlphabatically('priority', 'standard', true));


        /* selected All New Standards */
        const selectedAllNewStandards = [];
        const selectedNewStandardList = _.filter(angular.copy(vm.allStandardWithClassList), (item) =>
          item.selected
        );
        _.each(selectedNewStandardList, (stdwithclassItem) => {
          const stdwithclassObj = {};
          let selectedClassItem = {};
          stdwithclassObj.colorCode = CORE.DefaultStandardTagColor;
          if (stdwithclassItem.CertificateStandard_Class && stdwithclassItem.CertificateStandard_Class.length > 0) {
            selectedClassItem = _.find(stdwithclassItem.CertificateStandard_Class, (classitem) =>
              classitem.selected
            );
          }
          stdwithclassObj.class = selectedClassItem ? selectedClassItem.className : null;
          stdwithclassObj.colorCode = selectedClassItem ? (selectedClassItem.colorCode ? selectedClassItem.colorCode : CORE.DefaultStandardTagColor) : CORE.DefaultStandardTagColor;
          stdwithclassObj.standard = stdwithclassItem.fullName;
          stdwithclassObj.priority = stdwithclassItem.priority;
          selectedAllNewStandards.push(stdwithclassObj);
          if (stdwithclassItem.isExportControlled) {
            newStandards.push(stdwithclassItem.certificateStandardID);
          }
          newStandardList.push(stringFormat(CORE.StandardDisplayFormat, stdwithclassObj.class ? stdwithclassObj.class : '', stdwithclassObj.standard));
        });
        selectedAllNewStandards.sort(sortAlphabatically('priority', 'standard', true));
        const deletedStandard = _.differenceWith(allStandards, newStandards, _.isEqual);
        if (deletedStandard && deletedStandard.length > 0) {
          objs.deletedStandard = deletedStandard;
        }
        vm.cgBusyLoading = WorkorderFactory.getAllWORFQContainSamePartID().save({ dataObj: objs }).$promise.then((res) => {
          /* if work order or rfq exists then popup open and show all */
          if (res && res.data && ((res.data.WOListContainSamePartID && res.data.WOListContainSamePartID.length > 0)
            || res.data.RFQListContainSamePartID && res.data.RFQListContainSamePartID.length > 0)
            || $scope.applyFromRfqPage || (deletedStandard && deletedStandard.length > 0 && res.data.DeletedStandardComponent && res.data.DeletedStandardComponent.length > 0)) {
            _.each(res.data.DeletedStandardComponent, (item) => {
              if (item.certificateStandardID) {
                const standard = _.find(vm.componentStandardDetaillist, { certificateStandardID: item.certificateStandardID });
                item.colorCode = CORE.DefaultStandardTagColor;
                item.class = standard.Standardclass ? standard.Standardclass.className : null;
                item.colorCode = standard.Standardclass ? (standard.Standardclass.colorCode ? standard.Standardclass.colorCode : CORE.DefaultStandardTagColor) : CORE.DefaultStandardTagColor;
                item.standard = standard.certificateStandard.fullName;
              }
            });

            const data = {
              workorderDetails: {
                woNumber: null,
                WOListContainSamePartID: res.data.WOListContainSamePartID,
                isCalledFromWorkOrderPage: false
              },
              componentDetails: {
                PIDCode: componentMstDetails.PIDCode,
                mfgPN: componentMstDetails.mfgPN,
                nickName: componentMstDetails.nickName,
                id: componentID,
                isCustom: componentMstDetails.isCustom,
                rohsIcon: componentMstDetails.rfq_rohsmst ? componentMstDetails.rfq_rohsmst.rohsIcon : '',
                rohsStatus: componentMstDetails.rfq_rohsmst ? componentMstDetails.rfq_rohsmst.name : '',
                isCalledFromComponentPage: $scope.applyFromRfqPage ? false : true
              },
              RFQDetails: {
                RFQListContainSamePartID: res.data.RFQListContainSamePartID,
                rfqFormsID: rfqFormsID,
                isCalledFromRFQPage: $scope.applyFromRfqPage ? true : false
              },
              DeletedStandardComponent: res.data.DeletedStandardComponent,
              selectedAllOldStandards: selectedAllOldStandards,
              selectedAllNewStandards: selectedAllNewStandards
            };

            DialogFactory.dialogService(
              CORE.WO_COMPONENT_STANDARD_CHANGE_ALERT_MODAL_CONTROLLER,
              CORE.WO_COMPONENT_STANDARD_CHANGE_ALERT_MODAL_VIEW,
              evt,
              data).then((reponseOfApply) => {
                if (reponseOfApply) {
                  applyComponentStandards(evt);
                }
              }, (cancel) => {

              }, (err) =>
                BaseService.getErrorLog(err)
              );
          }
          else {/* if work order not exists then ask confirmation directly */
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.STANDARD_CHANGE_CONFIRMATION_MESSAGE);
            messageContent.message = stringFormat(messageContent.message, 'Standard');
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                applyComponentStandards(evt);
              }
            }, () => {
            }).catch((error) =>
              BaseService.getErrorLog(error)
            );
          }
        }).catch((error) =>
          BaseService.getErrorLog(error)
        );
      });

      function applyComponentStandards(evt) {
        var standardlist = [];
        let getStandardList = _.each(vm.allStandardWithClassList, (item) => {
          let obj = _.each(item.CertificateStandard_Class, (data) => {
            if (data.selected === true) {
              const model = {
                certificateStandardID: data.certificateStandardID,
                ClassID: data.classID,
                passwordProtected: item.passwordProtected
              };
              standardlist.push(model);
            }
          });
        });
        //let getStandardList = _.each(vm.parentCertificateStandardList, function (item) {
        //let mainStandardList = _.each(vm.MainCertificateStandardList, function (item) {
        let mainStandardList = _.each(vm.allStandardWithClassList, (item) => {
          if (item.selected === true) {
            const model = {
              certificateStandardID: item.certificateStandardID,
              ClassID: null,
              passwordProtected: item.passwordProtected
            };
            standardlist.push(model);
          }
        });
        if (ispasswordProtected === true) {
          DialogFactory.dialogService(
            CORE.MANAGE_PASSWORD_POPUP_CONTROLLER,
            CORE.MANAGE_PASSWORD_POPUP_VIEW,
            evt, null).then((data) => {
              if (data) {
                saveComponent(standardlist, data);
              }
            },
              (err) =>
                BaseService.getErrorLog(err)
            );
        }
        else {
          saveComponent(standardlist);
        }
      }

      function saveComponent(standardlist, password) {
        //var model = {
        //    componentID: componentID,
        //    standardlist: standardlist,
        //    password: password
        //};
        const resList = [];
        //_.each(vm.parentCertificateStandardList, (item) => {
        _.each(vm.allStandardWithClassList, (item) => {
          const ClassId = [];
          const objectItem = {};
          if (item.CertificateStandard_Class && item.CertificateStandard_Class.length > 0) {
            _.each(item.CertificateStandard_Class, (subItem) => {
              if (subItem.selected) {
                ClassId.push(subItem.classID);
              }
            });
            //if standard class selected
            if (ClassId.length > 0) {
              objectItem.id = item.DetailId ? item.DetailId : null;
              objectItem.componentID = componentID;
              objectItem.certificateStandardID = item.certificateStandardID;
              objectItem.ClassID = ClassId.join();
              resList.push(objectItem);
            }
          }
          else {
            if (item.selected) {
              objectItem.id = item.DetailId ? item.DetailId : null;
              objectItem.componentID = componentID;
              objectItem.certificateStandardID = item.certificateStandardID;
              objectItem.ClassID = null;
              resList.push(objectItem);
            }
          }
        });
        ////_.each(vm.MainCertificateStandardList, (item) => {
        //_.each(vm.allStandardWithClassList, (item) => {
        //    let objectItem = {};
        //    if (item.selected) {
        //        objectItem.id = item.DetailId ? item.DetailId : null;
        //        objectItem.componentID = componentID;
        //        objectItem.certificateStandardID = item.certificateStandardID;
        //        objectItem.ClassID = null;
        //        resList.push(objectItem);
        //    }
        //});
        const _objList = {};
        _objList.componentID = componentID;
        _objList.oldStandardList = oldStandardList.join(',');
        _objList.newStandardList = newStandardList.join(',');
        _objList.categoryList = resList;
        _objList.password = password;

        vm.cgBusyLoading = ComponentStandardDetailsFactory.createComponentStandardDetail().save({ listObj: _objList }).$promise.then((response) => {
          if (response.status === 'SUCCESS') {
            $scope.$emit('setstandardFrom', response.status);
          }
          getComponentStandardDetail();
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      }

      // Don't allow to select multiple class from same standard it should work like radio button
      vm.AllowToSelect = (certiClass, cert) => {
        const val = certiClass.selected;
        cert.CertificateStandard_Class = _.each(cert.CertificateStandard_Class, (item) => { item.selected = false; });
        certiClass.selected = val;
        ispasswordProtected = ispasswordProtected ? ispasswordProtected : cert.passwordProtected; // for checking access
        //vm.passwordProtected(cert);

        /* select/deselect class and standard if required */
        if (certiClass.selected) {
          cert.selected = true;
        }
        else {
          cert.selected = false;
        }
      };

      // chgeck standard is password protect than set flag
      vm.passwordProtected = (standardDet) => {
        if (standardDet.passwordProtected) {
          ispasswordProtected = true;
        }

        /* select first default or deselect class */
        if (standardDet.selected) {
          if (standardDet.CertificateStandard_Class && standardDet.CertificateStandard_Class.length > 0) {
            _.each(standardDet.CertificateStandard_Class, (standardClass) => {
              standardClass.selected = false;
            });
            standardDet.CertificateStandard_Class[0].selected = true; // default first selected
          }
        }
        else {
          if (standardDet.CertificateStandard_Class && standardDet.CertificateStandard_Class.length > 0) {
            _.each(standardDet.CertificateStandard_Class, (standardClass) => {
              standardClass.selected = false;
            });
          }
        }
      };

      // destory on event on controller destroy
      $scope.$on('$destroy', () => {
        saveStandardComponent();
      });

      /* Add Standard */
      vm.addNewCertificateStandards = (ev, data) => {
        if (vm.isReadOnly) {
          return;
        }
        const popUpData = { popupAccessRoutingState: [USER.CERTIFICATE_STANDARD_STATE], pageNameAccessLabel: CORE.LabelConstant.Standards.PageName };
        const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
        if (isAccessPopUp) {
          DialogFactory.dialogService(
            USER.ADMIN_CERTIFICATE_STANDARD_ADD_MODAL_CONTROLLER,
            USER.ADMIN_CERTIFICATE_STANDARD_ADD_MODAL_VIEW,
            ev,
            data).then(() => {
              getAllData();
            }, () => {
              getAllData();
            }, (err) =>
              BaseService.getErrorLog(err)
            );
        }
      };

      /* Add Standard Class*/
      vm.addStandardClass = (ev) => {
        if (vm.isReadOnly) {
          return;
        }

        const popUpData = { popupAccessRoutingState: [USER.STANDARD_CLASS_STATE], pageNameAccessLabel: CORE.PageName.Standards_Categories };
        const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
        if (isAccessPopUp) {
          DialogFactory.dialogService(
            USER.STANDARD_CLASS_CONTROLLER_UPDATE_MODAL_CONTROLLER,
            USER.STANDARD_CLASS_CONTROLLER_UPDATE_MODAL_VIEW,
            ev,
            null).then(() => {
              getAllData();
            }, () => {
              getAllData();
            }, (err) =>
              BaseService.getErrorLog(err)
            );
        }
      };

      vm.StandardList = () => {
        BaseService.goToStandardList();
      };

      vm.StandardCategoryList = () => {
        BaseService.goToStandardCaregoryList();
      };
      vm.updatestandard = (cert) => {
        BaseService.openInNew(USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_DETAIL_STATE, { id: cert.certificateStandardID });
      };

      /* refresh all standards */
      vm.refreshStandards = () => {
        getAllData();
      };
    }
  }
})();
