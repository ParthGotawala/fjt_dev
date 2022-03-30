(function () {
    'use strict';
    angular
        .module('app.admin.employee')
        .controller('ManageEmployeeCertificationPopupController', ManageEmployeeCertificationPopupController);
    /** @ngInject */
    function ManageEmployeeCertificationPopupController($mdDialog, CORE, data, EmployeeCertificationFactory,
        BaseService, DialogFactory, GenericCategoryFactory, $q, USER) {

        const vm = this;
        let employeeID = data.employeeID;
        let employeeName = data.employeeName;
        let loginUserRoleList = [BaseService.loginUser.defaultLoginRoleID];
        vm.CertificateEmptyMesssage = USER.ADMIN_EMPTYSTATE.CERTIFICATE_STANDARD;
        let ispasswordProtected = false;
        let standardTypeConst = CORE.CategoryType.StandardType;
        //let selectedOldStandardList = [];

        vm.headerdata = [];
        vm.headerdata.push({
            label: CORE.MainTitle.Employee,
            value: data.employeeName,
            displayOrder: 1
        });

        /* get all standard type list */
        let getAllStandardTypes = () => {
            return GenericCategoryFactory.getAllGenericCategoryByCategoryType().query({ categoryType: standardTypeConst.Name }).$promise
                .then((genericcategorylist) => {
                    vm.standardTypeList = [];
                    if(genericcategorylist && genericcategorylist.data){
                        vm.standardTypeList = genericcategorylist.data;
                    }
                    return $q.resolve(vm.standardTypeList);
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
        }

        let getEmployeeCertificationList = () => {
            return EmployeeCertificationFactory.getEmployeeAllCertificationList().save({
                employeeID: employeeID
            }).$promise.then((certificate) => {
                vm.allStandardWithClassList = [];
                //selectedOldStandardList = [];

                _.each(certificate.data, (item) => {

                    // add condtion to cehck if standard is inactive and alresdy slected than is display  recored
                    if (item.isActive || item.employeeCertification.length > 0) {
                        if (item.certificateStandardRole.length > 0) {
                            var roleIds = item.certificateStandardRole.map((x) => { return x.roleID; });
                            var sameRoles = _.intersection(roleIds, loginUserRoleList);
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

                        item.selected = item.employeeCertification.length > 0 ? true : false;

                        if (item.CertificateStandard_Class.length > 0) {
                            let StandardClass = [];
                            _.each(item.CertificateStandard_Class, (standardClass) => {
                                if (standardClass.isActive || item.employeeCertification.length > 0) {
                                    standardClass.selected = false;
                                    if (_.some(item.employeeCertification, (empCertiItem) => {
                                        return empCertiItem.classID == standardClass.classID
                                    })) {
                                        standardClass.selected = true;
                                        if (!item.isActive) {
                                            standardClass.disableClass = false;
                                        }
                                    }
                                    else {
                                        if (!item.isActive) {
                                            standardClass.disableClass = true;
                                        }
                                    }
                                    StandardClass.push(standardClass);
                                }
                            });
                            item.CertificateStandard_Class = _.sortBy(StandardClass, ['displayOrder', 'className']);
                            vm.allStandardWithClassList.push(item);
                        }
                        else {
                            vm.allStandardWithClassList.push(item);
                        }
                    }
                });

                //selectedOldStandardList = angular.copy(vm.allStandardWithClassList); // to pass old std to alert popup 
                vm.isNoDataFound = certificate.data.length > 0 ? false : true;
                return $q.resolve(vm.allStandardWithClassList);
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        let initEmployeeCertificationData = () => {
            var promise = [getAllStandardTypes(), getEmployeeCertificationList()];
            vm.cgBusyLoading = $q.all(promise).then((response) => {

                /* remove inactive std type if not contain any transaction data */
                let removeInActiveStdType = [];
                _.each(vm.standardTypeList, (stdTypeItem) => {
                    let isStdTypeContainEmpCerti = _.some(vm.allStandardWithClassList, (stdItem) => {
                        return stdItem.standardTypeID == stdTypeItem.gencCategoryID && stdItem.employeeCertification.length > 0
                    })
                    if (!stdTypeItem.isActive && !isStdTypeContainEmpCerti) {
                        removeInActiveStdType.push(stdTypeItem.gencCategoryID);
                    }
                });

                if (removeInActiveStdType.length > 0) {
                    vm.standardTypeList = vm.standardTypeList.filter(function (el) {
                        return !removeInActiveStdType.includes(el.gencCategoryID);
                    });
                }
                if (vm.employeeCertificationForm) {
                    vm.employeeCertificationForm.$setPristine();
                    vm.employeeCertificationForm.$setUntouched();
                }
            });
        }

        initEmployeeCertificationData();

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
        }

        /* select/deselect standard if required */
        vm.AllowToSelect = (certiClass, cert) => {
            ispasswordProtected = ispasswordProtected ? ispasswordProtected : cert.passwordProtected; // for checking access

            if (certiClass.selected) {
                cert.selected = true;
            }
            else {
                let anyClassSelected = _.some(cert.CertificateStandard_Class, (item) => {
                    return item.selected && item.classID != certiClass.classID
                });
                if (!anyClassSelected) {
                    cert.selected = false;
                }
            }
        }

        /* save employee certification  */
        vm.SaveEmployeeCertification = (event) => {

            /* selected All Old Standards */
            let selectedAllOldStandards = [];
            let selectedOldStandardList = _.filter(vm.allStandardWithClassList, (item) => {
                return item.employeeCertification.length > 0;
            });
            _.each(selectedOldStandardList, (stdwithclassItem) => {
                let stdwithclassObj = {
                    allClassList: []
                };
                _.each(stdwithclassItem.employeeCertification, (empCertiItem) => {
                    if (empCertiItem.classID) {
                        let classObj = {};
                        let selectedClassItem = _.find(stdwithclassItem.CertificateStandard_Class, (classitem) => {
                            return empCertiItem.classID == classitem.classID;
                        });
                        classObj.class = selectedClassItem ? selectedClassItem.className : null;
                        classObj.colorCode = selectedClassItem ? (selectedClassItem.colorCode ? selectedClassItem.colorCode : CORE.DefaultStandardTagColor) : CORE.DefaultStandardTagColor;
                        stdwithclassObj.allClassList.push(classObj);
                    }
                });
                stdwithclassObj.colorCode = CORE.DefaultStandardTagColor;  // default when no any class is there
                stdwithclassObj.standard = stdwithclassItem.fullName;
                stdwithclassObj.priority = stdwithclassItem.priority;
                selectedAllOldStandards.push(stdwithclassObj);
            })
            selectedAllOldStandards.sort(sortAlphabatically('priority', 'standard', true));

            /* selected All New Standards */
            let selectedAllNewStandards = [];
            let selectedNewStandardList = _.filter(angular.copy(vm.allStandardWithClassList), (item) => {
                return item.selected;
            });
            _.each(selectedNewStandardList, (stdwithclassItem) => {
                let stdwithclassObj = {
                    allClassList: []
                };
                _.each(stdwithclassItem.CertificateStandard_Class, (classItem) => {
                    if (classItem.selected) {
                        let classObj = {};
                        classObj.class = classItem.className;
                        classObj.colorCode = classItem.colorCode ? classItem.colorCode : CORE.DefaultStandardTagColor;
                        stdwithclassObj.allClassList.push(classObj);
                    }
                });
                stdwithclassObj.colorCode = CORE.DefaultStandardTagColor;  // default when no any class is there
                stdwithclassObj.standard = stdwithclassItem.fullName;
                stdwithclassObj.priority = stdwithclassItem.priority;
                selectedAllNewStandards.push(stdwithclassObj);
            })
            selectedAllNewStandards.sort(sortAlphabatically('priority', 'standard', true));

            let data = {
                selectedAllOldStandards: selectedAllOldStandards,
                selectedAllNewStandards: selectedAllNewStandards,
                employeeName: employeeName
            }

            DialogFactory.dialogService(
                USER.EMP_STANDARD_CHANGE_ALERT_MODAL_CONTROLLER,
                USER.EMP_STANDARD_CHANGE_ALERT_MODAL_VIEW,
                event,
                data).then((reponseOfApply) => {
                    if (reponseOfApply) {
                        if (ispasswordProtected == true) {
                            let data = {
                                isValidate: true
                            }
                            DialogFactory.dialogService(
                                CORE.MANAGE_PASSWORD_POPUP_CONTROLLER,
                                CORE.MANAGE_PASSWORD_POPUP_VIEW,
                                event, data).then((data) => {
                                    if (data) {
                                        SaveEmployeeStandardDetails();
                                    }
                                }, (cancel) => {

                                }, (err) => {
                                    return BaseService.getErrorLog(err);
                                });
                        }
                        else {
                            SaveEmployeeStandardDetails();
                        }
                    }
                }, (cancel) => {

                }, (err) => {
                    return BaseService.getErrorLog(err);
                });

        }

        let SaveEmployeeStandardDetails = (versionModel) => {
            if (employeeID) {

                let allExitsEmpStdOldList = _.filter(vm.allStandardWithClassList, (allItem) => {
                    return allItem.employeeCertification.length > 0;
                });

                let deleteExistingEmpCertiIDs = [];
                _.each(allExitsEmpStdOldList, (stdItem) => {
                    _.each(stdItem.employeeCertification, (empCertiItem) => {

                        // emp std contain class and checked that now removed by user
                        if (empCertiItem.classID && stdItem.CertificateStandard_Class && stdItem.CertificateStandard_Class.length > 0) {
                            if (_.some(stdItem.CertificateStandard_Class, (classItem) => {
                                return empCertiItem.classID == classItem.classID && !classItem.selected
                                    && empCertiItem.certificateStandardID == classItem.certificateStandardID
                            })) {
                                deleteExistingEmpCertiIDs.push(empCertiItem.id);
                            }
                        }
                        else { // emp std not contain any class and checked that now removed by user
                            if (!stdItem.selected) {
                                deleteExistingEmpCertiIDs.push(empCertiItem.id);
                            }
                        }
                    });
                })


                /* selected All New Standards */
                let selectedNewStandardList = _.filter(vm.allStandardWithClassList, (item) => {
                    return item.selected;
                });

                let addNewEmpCertiIDs = [];
                _.each(selectedNewStandardList, (stdItem) => {
                    // if standard contain any class
                    if (stdItem.CertificateStandard_Class && stdItem.CertificateStandard_Class.length > 0) {
                        let selectedClassList = _.filter(stdItem.CertificateStandard_Class, (classItem) => {
                            return classItem.selected;
                        });
                        if (selectedClassList.length > 0) {
                            _.each(selectedClassList, (classItem) => {
                                let _objItem = {};
                                let existsEmpCertiItem = _.find(stdItem.employeeCertification, (empCertiItem) => {
                                    return empCertiItem.classID == classItem.classID
                                        && empCertiItem.certificateStandardID == classItem.certificateStandardID
                                })
                                if (!existsEmpCertiItem) {
                                    _objItem.id = null;
                                    _objItem.employeeID = employeeID;
                                    _objItem.certificateStandardID = stdItem.certificateStandardID;
                                    _objItem.classID = classItem.classID;
                                    addNewEmpCertiIDs.push(_objItem);
                                }
                            })
                        }
                    } else {  // if standard not contain any class
                        let _objItem = {};
                        if (stdItem.employeeCertification.length == 0) {
                            _objItem.id = null;
                            _objItem.employeeID = employeeID;
                            _objItem.certificateStandardID = stdItem.certificateStandardID;
                            _objItem.classID = null;
                            addNewEmpCertiIDs.push(_objItem);
                        }
                    }
                });

                let _objList = {};
                _objList.employeeID = employeeID;
                _objList.addNewEmpCertiIDs = addNewEmpCertiIDs;
                _objList.deleteExistingEmpCertiIDs = deleteExistingEmpCertiIDs;

                vm.cgBusyLoading = EmployeeCertificationFactory.saveEmployeeCertification().save({ listObj: _objList }).$promise.then((res) => {
                    if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                        //if (vm.employeeCertificationForm) {
                        //    vm.employeeCertificationForm.$setPristine();
                        //    vm.employeeCertificationForm.$setUntouched();
                        //}
                        //$timeout(() => {
                        //    getEmployeeCertificationList();
                        //}, 1000);
                        $mdDialog.cancel();
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
        }

        vm.updatestandard = (cert) => {
            BaseService.openInNew(USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_DETAIL_STATE, { id: cert.certificateStandardID })
        }

        vm.StandardList = () => {
            BaseService.goToStandardList();
        }

        vm.addNewCertificateStandards = (ev) => {
            let popUpData = { popupAccessRoutingState: [USER.CERTIFICATE_STANDARD_STATE], pageNameAccessLabel: CORE.LabelConstant.Standards.PageName };
            let isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
            if (isAccessPopUp) {
                DialogFactory.dialogService(
                    USER.ADMIN_CERTIFICATE_STANDARD_ADD_MODAL_CONTROLLER,
                    USER.ADMIN_CERTIFICATE_STANDARD_ADD_MODAL_VIEW,
                    ev,
                    null).then(() => {
                    }, () => {
                        initEmployeeCertificationData();
                    }, (err) => {
                        return BaseService.getErrorLog(err);
                    });
            }
        }

        vm.StandardCategoryList = () => {
            BaseService.goToStandardCaregoryList();
        }

        /* Add Standard Class*/
        vm.addStandardClass = (ev) => {
            let popUpData = { popupAccessRoutingState: [USER.STANDARD_CLASS_STATE], pageNameAccessLabel: CORE.PageName.Standards_Categories };
            let isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
            if (isAccessPopUp) {
                DialogFactory.dialogService(
                    USER.STANDARD_CLASS_CONTROLLER_UPDATE_MODAL_CONTROLLER,
                    USER.STANDARD_CLASS_CONTROLLER_UPDATE_MODAL_VIEW,
                    ev,
                    null).then(() => {
                    }, () => {
                        initEmployeeCertificationData();
                    }, (err) => {
                        return BaseService.getErrorLog(err);
                    });
            }
        };

        /* refresh all standards */
        vm.refreshStandards = () => {
            initEmployeeCertificationData();
        }

        vm.cancel = () => {
            let isdirty = BaseService.checkFormDirty(vm.employeeCertificationForm, null);
            if (isdirty) {
                BaseService.showWithoutSavingAlertForPopUp();
            } else {
                $mdDialog.cancel();
            }
        };

    }
})();
