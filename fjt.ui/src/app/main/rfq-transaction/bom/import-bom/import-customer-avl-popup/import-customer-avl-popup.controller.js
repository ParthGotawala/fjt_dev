(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('ImportCustomerAVLPopupController', ImportCustomerAVLPopupController);

  /** @ngInject */
  function ImportCustomerAVLPopupController($state, $log, $sce, $filter, $rootScope, $mdDialog, $scope, ImportCustomerAVLPopupFactory, $timeout, CORE, USER, RFQTRANSACTION, hotRegisterer, data, BaseService, BOMFactory, DialogFactory, MasterFactory) {
    const vm = this;
    vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.RFQ;
    vm.ispicture = false;
    let rfqAssyID = data.rfqAssyID;
    const partID = data.partID;
    const Documentsize = _configDocumentSize;//CORE.DocumentSize;
    let FileAllow = CORE.FileTypeList;
    vm.FileGroup = CORE.FileGroup;
    vm.DateTimeFormat = _dateDisplayFormat;
    vm.LabelConstant = CORE.LabelConstant;
    let _dummyEvent = null;
    const headerMapping = {
      avlHeader: null,
      avlMFGheader: null
    };
    const _lineItemsHeaders = data.lineItemsHeaders;
    FileAllow = _.filter(FileAllow, (obj) => {
      if (obj.extension === '.xls' || obj.extension === '.csv' || obj.extension === '.xlsx') {
        return true;
      }
    });
    vm.FileTypeList = _.map(FileAllow, 'extension').join(',');
    vm.BOMfile = [];
    vm.BOMAVLfile = [];
    //redirect to customer
    vm.goToCustomer = () => {
      BaseService.goToCustomerList();
      return false;
    };
    //go to assy list
    vm.goToAssyList = () => {
        BaseService.goToPartList();
      return false;
    };
    //go to manage part number
    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, partID);
      return false;
    };
    // go to customer details
    vm.goToCustomerDet = () => {
      BaseService.goToCustomer(vm.customerID);
      return false;
    };

    getAssemblyComponentDetailById();
    function getAssemblyComponentDetailById() {
      return MasterFactory.getAssemblyComponentDetailById().query({ id: partID }).$promise.then((response) => {
        if (response && response.data) {
          const rfqAssy = response.data;
          vm.bom = {
            mfgPNDescription: rfqAssy.mfgPNDescription,
            mfgPN: rfqAssy.mfgPN,
            PIDCode: rfqAssy.PIDCode,
            RoHSStatusID: rfqAssy.RoHSStatusID,
            isBOMVerified: rfqAssy.componentbomSetting && rfqAssy.componentbomSetting[0].isBOMVerified,
            RoHSStatusIcon: CORE.WEB_URL + USER.ROHS_BASE_PATH + 'rohs.jpg'
          };

          if (rfqAssy && rfqAssy.rfqAssemblies && rfqAssy.rfqAssemblies.length > 0) {
            let rfqAssemblyDetails = {};
            if (rfqAssyID) {
              rfqAssemblyDetails = _.find(rfqAssy.rfqAssemblies, (item) => item.id === rfqAssyID);
            }
            else {
              rfqAssemblyDetails = _.head(rfqAssyBOMModel.rfqAssemblies);
              rfqAssyID = rfqAssemblyDetails.id;
            }
            if (rfqAssemblyDetails) {
              vm.bom.reqAssyID = rfqAssemblyDetails.id;
              vm.bom.status = rfqAssemblyDetails.status;
              vm.bom.isSummaryComplete = rfqAssemblyDetails.isSummaryComplete;
              vm.bom.isReadyForPricing = rfqAssemblyDetails.isReadyForPricing;
              vm.bom.quoteFinalStatus = rfqAssemblyDetails.quoteFinalStatus || null;
              vm.bom.quoteindate = rfqAssemblyDetails.quoteInDate;
              vm.bom.rfqNo = rfqAssemblyDetails.rfqForms.id;
              vm.customerID = rfqAssemblyDetails.rfqForms.customerId;
              if (rfqAssemblyDetails.rfqForms.customer) {
                vm.bom.companyName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, rfqAssemblyDetails.rfqForms.customer.mfgCode, rfqAssemblyDetails.rfqForms.customer.mfgName);
              }
            }
          }
          else {
            rfqAssyID = 0;
          }
          if (vm.bom.RoHSStatusID && rfqAssy.rfq_rohsmst) {
            if (rfqAssy.rfq_rohsmst && rfqAssy.rfq_rohsmst.rohsIcon) {
              vm.bom.displayRohsIcon = CORE.WEB_URL + USER.ROHS_BASE_PATH + rfqAssy.rfq_rohsmst.rohsIcon;
              vm.bom.RoHSName = rfqAssy.rfq_rohsmst.name;
            }
          }
          bindHeaderData();
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
        return null;
      });
    };
    vm.save = () => {
      var avlBOMobj = angular.copy(vm.avlBOMobj);
      var avlobj = angular.copy(vm.avlobj);

      var custAVLHeader = avlobj[0];
      var custMFGAVLHeader = avlBOMobj[0];
      var headermappingobj = angular.copy(headerMapping);
      _.each(custAVLHeader, (objHeader, index) => {
        var obj = _.filter(headermappingobj.avlHeader, (x) => x.column === objHeader);
        if (obj.length === 1) {
          custAVLHeader[index] = obj[0].column = obj[0].header;
        }
      });
      const listheadermapping = headermappingobj.avlHeader.concat(headermappingobj.avlMFGheader);

      _.each(custMFGAVLHeader, (objHeader, index) => {
        var obj = _.filter(headermappingobj.avlMFGheader, (x) => x.column === objHeader);
        if (obj.length === 1) {
          _.each(custMFGAVLHeader, (mfgavlobj, objindex) => {
            if (mfgavlobj === objHeader) {
              custMFGAVLHeader[objindex] = obj[0].header;
            }
          });
          obj[0].column = obj[0].header;
        }
      });
      const custAVLCPNIndex = custAVLHeader.indexOf('CPN');
      const custMFGCPNIndex = custMFGAVLHeader.indexOf('CPN');
      const custAVLRevIndex = custAVLHeader.indexOf('CPN Rev');
      const custMFGRevIndex = custMFGAVLHeader.indexOf('CPN Rev');
      _.each(custMFGAVLHeader, (obj1) => {
        custAVLHeader.push(obj1);
      });
      avlobj.splice(0, 1);
      avlBOMobj.splice(0, 1);

      const custMFGAVLGroup = _.groupBy(avlBOMobj, (i) => avlBOMobj[avlBOMobj.indexOf(i)][custMFGCPNIndex]);

      const custAVLFull = [];
      custAVLFull.push(custAVLHeader);

      avlobj.forEach((item) => {
        var cpnList = custMFGAVLGroup[item[custAVLCPNIndex]];
        if (cpnList) {
          if (custMFGCPNIndex >= 0) {
            cpnList.forEach((obj) => {
              if (obj[custMFGRevIndex] === item[custAVLRevIndex]) {
                const list = item.concat(obj);
                custAVLFull.push(list);
              }
            });
          } else {
            const list = item;
            custAVLFull.push(list);
          }
        }
      });
      if (custAVLFull.length > 1) {
        const ImportObj = {
          header: listheadermapping,
          BOMArray: custAVLFull
        };

        $mdDialog.hide(ImportObj);
      } else {
        showWrongFileAlert();
      }
    };

    function columnMappingStepFn(bomArray, ev, table, file) {
      var data = {
        lineItemsHeaders: _lineItemsHeaders,
        excelHeaders: bomArray[0],
        isAvl: table === 'BOMfile' ? true : false,
        isAvlMFG: table === 'BOMAVLfile' ? true : false
      };
      DialogFactory.dialogService(
        RFQTRANSACTION.BOM_COLUMN_MAPPING_CONTROLLER,
        RFQTRANSACTION.BOM_COLUMN_MAPPING_VIEW,
        ev,
        data).then((result) => {
          const files = [];
          files.push(file);
          let wrongData = false;
          _.each(result, (headerData) => {
            if (headerData.header === 'CPN' || headerData.header === 'CPN Rev') {
              const index = bomArray[0].indexOf(headerData.column);

              const noCPN = _.filter(bomArray, (data) => data[index] === null || data[index] === undefined);
              if (noCPN && noCPN.length > 0) {
                wrongData = true;
              }
            }
          });
          if (!wrongData) {
            if (table === 'BOMfile') {
              const itemColumn = _.find(result, (headerData) => headerData.header === 'Item(Line#)');

              const custAVLItemIndex = bomArray[0].indexOf(itemColumn.column);
              const custAVLGroup = _.groupBy(bomArray, (i) => bomArray[bomArray.indexOf(i)][custAVLItemIndex]);
              const itemGroupArray = _.filter(custAVLGroup, (x) => x.length > 1);
              if (itemGroupArray.length > 0) {
                const model = {
                  title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                  textContent: RFQTRANSACTION.BOM.UNIQUE_LINE_ITEM,
                  multiple: true
                };
                DialogFactory.alertDialog(model);
              } else {
                const checkFilter = _.filter(result, (filter) => filter.column && filter.column);
                _.each(bomArray[0], (bArray) => {
                  const itemDet = _.find(checkFilter, (cFilter) => cFilter.column === bArray);
                  if (!itemDet) {
                    const index = _.indexOf(bomArray[0], bArray);
                    bomArray[0].splice(index, 1);
                    removeCommondata(bomArray, index);
                  }
                });
                vm.avlobj = bomArray;
                headerMapping.avlHeader = result;
                vm.documentFiles(files, 'BOMfile');
              }
            }
            if (table === 'BOMAVLfile') {
              vm.avlBOMobj = bomArray;
              headerMapping.avlMFGheader = result;
              vm.documentFiles(files, 'BOMAVLfile');
            }
          } else {
            const model = {
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: RFQTRANSACTION.BOM.CPN_REV_MUST_REQUIRED,
              multiple: true
            };
            DialogFactory.alertDialog(model);
          }
        }, (err) => BaseService.getErrorLog(err));
    };
    // const remove common data
    const removeCommondata = (bomArray, index) => {
      for (let i = 1; i < bomArray.length; i++) {
        bomArray[i].splice(index, 1);
      }
    };
    vm.addBOM = function (event, file) {
      if (file && file.length > 1) {
        const model = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: CORE.MESSAGE_CONSTANT.SELECT_ANYONE_OPTION,
          multiple: true
        };
        DialogFactory.alertDialog(model);
        return;
      } else {
        if (event) {
          _dummyEvent = event;
        }
        angular.element('#div-excel #fi-excel').trigger('click');
      }
    };

    vm.addAVLBOM = function (event, file) {
      if (file && file.length > 1) {
        const model = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: CORE.MESSAGE_CONSTANT.SELECT_ANYONE_OPTION,
          multiple: true
        };
        DialogFactory.alertDialog(model);
        return;
      } else {
        if (event) {
          _dummyEvent = event;
        }
        angular.element('#div-excel1 #fi-excel').trigger('click');
      }
    };

    //Check Selected Document
    vm.documentFiles = (file, type) => {
      if (file && file.length > 1) {
        const model = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: CORE.MESSAGE_CONSTANT.SELECT_ANYONE_OPTION,
          multiple: true
        };
        DialogFactory.alertDialog(model);
        return;
      } else if (file && file.length > 0) {
        if (vm.BOMAVLfile.length > 0 && type === 'BOMAVLfile') {
          vm.removeDocument(0, type);
        } else if (vm.BOMfile.length > 0 && type === 'BOMfile') {
          vm.removeDocument(0, type);
        }
      }
      let messageContent;
      _.each(file, (objFile, index) => {
        if (!messageContent) {
          if (objFile.size > parseInt(Documentsize)) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DocumentSizeError_NotAllowed);
            messageContent.message = stringFormat(messageContent.message, formatBytes(Documentsize));
          }
          else if (objFile.name === CORE.Copy_Image_Name) {
            file[index] = new File([objFile], `${new Date().getTime()}.png`, { type: CORE.Copy_Image_Extension });
          }
        }
      });

      if (messageContent) {
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }

      vm.BOMfile = vm.BOMfile || [];
      vm.BOMAVLfile = vm.BOMAVLfile || [];
      if (file) {
        _.each(file, (objFile) => {
          objFile.progressPercentage = 0;
          if (type === 'BOMfile') {
            vm.BOMfile.push(objFile);
            //vm.addBOM();
          }
          if (type === 'BOMAVLfile') {
            vm.BOMAVLfile.push(objFile);
            //vm.addAVLBOM();
          }
        });
      }
    };

    vm.isImage = (file) => {
      const filename = file.name;
      const ext = filename.split('.').pop();
      $scope.fileObj = _.find(FileAllow, (file) => file.extension === '.' + ext);
      if (file.type.indexOf('image') > -1) {
        return true;
      }
      else {
        if (!$scope.fileObj) {
          const model = {
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: 'Only .csv, .xlx, .xlsx document allow.',
            multiple: true
          };
          DialogFactory.alertDialog(model);
          return;
        } else {
          file.icon = $scope.fileObj.icon;
        }
        return false;
      }
    };
    //Remove Document
    vm.removeDocument = (index, type) => {
      $scope.IsRemove = true;
      if (type === 'BOMfile') {
        vm.BOMfile.splice(index, 1);
        vm.avlobj = [];
      }
      if (type === 'BOMAVLfile') {
        vm.BOMAVLfile.splice(index, 1);
        vm.avlBOMobj = [];
      }
      $timeout(() => {
        $scope.IsRemove = false;
        $scope.$applyAsync();
      }, 0);
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.CopyAssyBOMForm);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };


    vm.erOptions = {
      workstart: function () {
        vm.isNoDataFound = true;
        $scope.$apply();
      },
      workend: function () {
      },
      sheet: function (json, sheetnames, select_sheet_cb, files) {
        var type = files.name.split('.');
        const headerlength = json[0].length;
        if (_.find(CORE.UPLOAD_DOCUMENT_TYPE, (docType) => docType === type[type.length - 1])) {
          json.forEach((item, index) => {
            if (index === 0) {
              return;
            }
            if (headerlength > item.length) {
              json[index] = item.concat(new Array(headerlength - item.length).fill(undefined));
            }
          });
          columnMappingStepFn(json, _dummyEvent, 'BOMfile', files);
        }
        else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_TYPE_NOT_ALLOWED);
          messageContent.message = stringFormat(messageContent.message, (CORE.UPLOAD_DOCUMENT_TYPE).join());
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        }
      },
      badfile: function () {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_UPLOAD_FAIL_TEXT);
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      },
      failed: function () {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_TYPE_NOT_ALLOWED);
        messageContent.message = stringFormat(messageContent.message, (CORE.UPLOAD_DOCUMENT_TYPE).join());
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      },
      multiplefile: function () {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SINGLE_FILE_UPLOAD);
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      },
      large: function () {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_UPLOAD_FAIL_SIZE_TEXT);
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    vm.erOptionsavl = {
      workstart: function () {
        vm.isNoDataFound = true;
        $scope.$apply();
      },
      workend: function () {
      },
      sheet: function (json, sheetnames, select_sheet_cb, files) {
        var type = files.name.split('.');
        if (_.find(CORE.UPLOAD_DOCUMENT_TYPE, (docType) => docType === type[type.length - 1])) {
          const headerlength = json[0].length;
          json.forEach((item, index) => {
            if (index === 0) {
              return;
            }
            if (headerlength > item.length) {
              json[index] = item.concat(new Array(headerlength - item.length).fill(undefined));
            }
          });
          columnMappingStepFn(json, _dummyEvent, 'BOMAVLfile', files);
        } else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_TYPE_NOT_ALLOWED);
          messageContent.message = stringFormat(messageContent.message, (CORE.UPLOAD_DOCUMENT_TYPE).join());
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        }
      },
      badfile: function () {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_UPLOAD_FAIL_TEXT);
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      },
      failed: function () {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_TYPE_NOT_ALLOWED);
        messageContent.message = stringFormat(messageContent.message, (CORE.UPLOAD_DOCUMENT_TYPE).join());
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model);
      },
      multiplefile: function () {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SINGLE_FILE_UPLOAD);
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      },
      large: function () {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_UPLOAD_FAIL_SIZE_TEXT);
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    function showWrongFileAlert() {
      const obj = {
        title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
        textContent: RFQTRANSACTION.BOM.AVL_DATA_NOT_MATCH,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        multiple: true
      };
      DialogFactory.alertDialog(obj).then(() => {
      }, (error) => BaseService.getErrorLog(error));
    }

    vm.downloadDocument = (type) => {
      vm.templateType = { fileType: type };
      vm.cgBusyLoading = ImportCustomerAVLPopupFactory.downloadAVLTemplate(vm.templateType.fileType).then((response) => {
        if (response.status === 404) {
          DialogFactory.alertDialog({ title: CORE.MESSAGE_CONSTANT.ALERT_HEADER, textContent: CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.NotFound, multiple: true });
        } else if (response.status === 403) {
          DialogFactory.alertDialog({ title: CORE.MESSAGE_CONSTANT.ALERT_HEADER, textContent: CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.AccessDenied, multiple: true });
        } else if (response.status === 401) {
          DialogFactory.alertDialog({ title: CORE.MESSAGE_CONSTANT.ALERT_HEADER, textContent: CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.Unauthorized, multiple: true });
        }
        else {
          const blob = new Blob([response.data], { type: 'text/csv' });
          if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, vm.templateType.fileType + '.xlsx');
          } else {
            const link = document.createElement('a');
            if (!link.download) {
              const url = URL.createObjectURL(blob);
              link.setAttribute('href', url);
              link.setAttribute('download', vm.templateType.fileType + '.xlsx');
              link.style = 'visibility:hidden';
              document.body.appendChild(link);
              $timeout(() => {
                link.click();
                document.body.removeChild(link);
              });
            }
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.copyText = (copyText) => {
      var $temp = $('<input>');
      $('body').append($temp);
      $temp.val(copyText).select();
      document.execCommand('copy');
      $temp.remove();
      vm.showstatus = true;
    };

    vm.checkStatus = () => {
      vm.showstatus = false;
    };

    function bindHeaderData() {
      vm.headerdata = [];
      vm.headerdata.push({
        label: vm.LabelConstant.Customer.Customer,
        value: vm.bom.companyName,
        displayOrder: 1,
        labelLinkFn: vm.goToCustomer,
        valueLinkFn: vm.goToCustomerDet,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      }, {
        label: vm.LabelConstant.Assembly.ID,
        value: vm.bom.PIDCode,
        displayOrder: 1,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: null,
        isCopy: true,
        isCopyAheadLabel: false,
        isAssy: true,
        imgParms: {
          imgPath: vm.bom.displayRohsIcon,
          imgDetail: vm.bom.RoHSName
        }
      }, {
        label: vm.LabelConstant.Assembly.MFGPN,
        value: vm.bom.mfgPN,
        displayOrder: 1,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: null,
        isCopy: true,
        isCopyAheadLabel: false,
        isAssy: true,
        imgParms: {
          imgPath: vm.bom.displayRohsIcon,
          imgDetail: vm.bom.RoHSName
        }
      });
    }
  }
})();
