(function () {
  'use strict';

  angular
    .module('app.dbscript')
    .controller('DbScriptController', DbScriptController);

  /** @ngInject */
  function DbScriptController(CORE, BaseService, DbScriptFactory, DialogFactory, $mdDialog, DBSCRIPT, $state, $q, NotificationFactory, ConfigureSearchFactory) {
    const vm = this;
    vm.taToolbar = CORE.Toolbar;
    vm.dbscript = {};
    vm.isAllowedToExecuteDBScript = _isAllowedToExecuteDBScript;
    vm.selectedItems = [];
    vm.printHtmlContent = '';
    let userIPAddress = null;
    var successBranchIndex = 0;
    var isMessageUpdated = false; //to check any update in messageScript

    findIPAddress().then(ip => {
      userIPAddress = ip;
    }).catch(e => console.error(e));


    let displayAlertForUnauthorizedUser = () => {
      var model = {
        title: "Information",
        textContent: "You are not authorized person to execute the script. <br><br> <b>Check Possibilities:</b> \
                            <br> 1. Please check key/value in data keys. \
                            <br> 2. Check/add physical address from connected network. \
                            <br> 3. Connected with another network through NetExtender or VPN etc. \
                            <br><br> or Please contact to administrator.",
        multiple: true
      };
      DialogFactory.alertDialog(model);
    }

    let getCurrDBInfo = () => {
      vm.cgBusyLoading = DbScriptFactory.retrieveCurrDBInfo().query().$promise.then((res) => {
        if (res && res.data) {
          vm.dbscript = res.data.dbObj;
          if (!vm.dbscript.isValidUserToExecuteDbScript) {
            displayAlertForUnauthorizedUser();
          }
        }

      });
    }


    getCurrDBInfo();


    vm.forMatScriptAsStringExecution = () => {
      vm.formattedStringResultArr = [];
      if (!vm.dbscript.script) {
        return;
      }

      let dbScriptWithOutFormat = null;
      dbScriptWithOutFormat = angular.copy(vm.dbscript.script);
      let ScriptIdentifierContainDefinerRoot = CORE.DbScriptIdentifierContainDefinerRoot;
      let uniqueStringForReplacement = '!!!!!!!!!!';

      /* remove in between text like
          e.g. "DEFINER=`root`@`localhost`" from [ CREATE DEFINER=`root`@`localhost` FUNCTION ...] */
      _.each(ScriptIdentifierContainDefinerRoot, (item) => {
        var isContain = RegExp('\\b' + item + '\\b').test(dbScriptWithOutFormat);
        if (isContain) {
          dbScriptWithOutFormat = dbScriptWithOutFormat.replace(/[\n]+/g, uniqueStringForReplacement);
          var subStr = dbScriptWithOutFormat.match("CREATE(.*?)" + item);
          if (subStr && subStr[1]) {
            dbScriptWithOutFormat = dbScriptWithOutFormat.replace(subStr[1], " ").replace(/!!!!!!!!!!/g, '\n');
          } else {
            dbScriptWithOutFormat = dbScriptWithOutFormat.replace(/!!!!!!!!!!/g, '\n');
          }
          return false;
        }
      })

      let splitStringLineArr = [];
      splitStringLineArr = dbScriptWithOutFormat.split('\n');
      if (!splitStringLineArr || splitStringLineArr.length == 0) {
        return;
      }

      _.each(splitStringLineArr, (lineitem) => {
        let replaceCotLineitem = '';
        if (lineitem.trim().length != 0) {

          replaceCotLineitem = lineitem.trimEnd();

          /* (USE `test123_flexjobtracking`$$) or (USE `test123_flexjobtracking`;) 
          -> not to include this in formatted script */
          var reUseStat = /^USE([ ]*)([`]{1})([A-Za-z0-9_-]+)([`]{1})([ ]*)([;]*|[$]*)$/i;

          /* (DELIMITER $$) or (DELIMITER ;)  -> not to include this in formatted script */
          var reDeliStat = /^DELIMITER([ ]*)([$]{2}|[;]{1})$/i;

          /* only ($$) -> not to include this in formatted script */
          var reOnlyDeliCharStat = /^([$]{2})$/;

          /* END$$   -> replace $$ to ; */
          var reEndDeliStat = /^END([ ]*)([$]{2})$/i;

          if (!reUseStat.test(replaceCotLineitem.trim()) && !reDeliStat.test(replaceCotLineitem.trim())
            && !reOnlyDeliCharStat.test(replaceCotLineitem.trim())) {
            if (replaceCotLineitem.contains("DROP") && replaceCotLineitem.contains("IF EXISTS")
              && replaceCotLineitem.contains("$$")) {
              replaceCotLineitem = replaceCotLineitem.replace("$$", " ;");
            }
            else if (reEndDeliStat.test(replaceCotLineitem.trim()) || replaceCotLineitem.trim().slice(-2) == "$$") {
              /* replaced last occurrence of $$ to ; */
              replaceCotLineitem = replaceCotLineitem.substring(0, (replaceCotLineitem.lastIndexOf('$$'))) + ";";
            }
            if (vm.dbscript.dbName && replaceCotLineitem.match(new RegExp("`" + vm.dbscript.dbName.trim() + "`" + ".", "i"))) {
              /* to replace database name --> e.g. FROM `flexjobtracking`.`workorder_trans` `a` */
              replaceCotLineitem = replaceCotLineitem.replace(new RegExp("`" + vm.dbscript.dbName.trim() + "`" + ".", 'gi'), "");
            }
            replaceCotLineitem = replaceCotLineitem.replace(new RegExp('"', "g"), '\\"').replace(/\\\\/g, "\\\\\\");
            vm.formattedStringResultArr.push("\"" + replaceCotLineitem + "  \\n" + "\" \+");
          }
        }
        else {
          vm.formattedStringResultArr.push("\"" + replaceCotLineitem + "  \\n" + "\" \+");
        }
      });
      vm.formattedStringResultArr = vm.formattedStringResultArr.join("\n");
    }

    vm.copyTextToClipBoard = (event) => {
      var copyText = document.getElementById("formattedString");
      copyText.select();
      document.execCommand("copy");

      var model = {
        title: "Copied",
        textContent: "Script content copied to clipboard",
        multiple: true
      };
      DialogFactory.alertDialog(model);
    }

    vm.clearScript = () => {
      vm.dbscript.script = '';
      vm.formattedStringResultArr = [];
    }

    // on click of refresh button 
    vm.refreshForExecuteDbScript = () => {
      $state.go(DBSCRIPT.DBSCRIPT_STATE, {}, { reload: true });
    }

    vm.generateEntityJSON = () => {
      vm.cgBusyLoading = ConfigureSearchFactory.generateJSONofEntity().query().$promise.then((response) => {
        if (response) {
          if (response.isSuccess) {
            NotificationFactory.success(response.message);
          } else if (response.message) {
            NotificationFactory.error(response.message);
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    //generate dynamic message JSON files
    vm.generateJSON = () => {
      let data = { callFromDbScript: true };
      vm.cgBusyLoading = DbScriptFactory.generateJSonFromMongoDBFromDBScript(data).query().$promise.then((result) => {
        if (result && result.status === CORE.ApiResponseTypeStatus.SUCCESS && result.userMessage && result.userMessage.displayDialog) {
          let messageContent = angular.copy(result.userMessage);
          if (messageContent) {
            var model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    vm.executeAllRemainingDbScript = () => {
      let scriptExecutionObj = {
        currentBranchExecution: CORE.ProjectBranches.MainBranch,
        branchwiseCompletedExecution: [],
        fromBuildNumber: null,
        toBuildNumber: null,
        userIPAddress: userIPAddress,
        //isMessageUpdated: isMessageUpdated
      }


      return vm.cgBusyLoading = DbScriptFactory.executeAllRemainingDbScript().save({ scriptExecutionObj }).$promise.then((res) => {
        if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
          if (res.data && res.data.branchwiseCompletedExecution && res.data.branchwiseCompletedExecution.length > 0) {
            _.each(res.data.branchwiseCompletedExecution, function (item, index) {
              vm.printHtmlContent += '<tr md-row> \
                                      <td width="10%" md-cell>' + (successBranchIndex + 1) + '</td> \
                                      <td width="30%" md-cell>' + item.branchName + '</td> \
                                      <td width="30%" md-cell>'+ (item.fromBuildNumber ? item.fromBuildNumber : "-") + '</td> \
                                      <td width="30%" md-cell>'+ (item.toBuildNumber ? item.toBuildNumber : "-") + '</td> \
                                      </tr> ' ;
              successBranchIndex = successBranchIndex + 1;
            });
            return { status: CORE.ApiResponseTypeStatus.SUCCESS, update: true };
          } else if (res && !res.data) {
            return { status: CORE.ApiResponseTypeStatus.SUCCESS, update: false }
          }

        } else if (res && res.status == CORE.ApiResponseTypeStatus.EMPTY && res.errors.errorInScriptExecutionInfo) {
          let errorInfo = res.errors.errorInScriptExecutionInfo;
          vm.printHtmlContent = '<p> <md-table-container flex="100"> \
                                      <table md-table class="md-data-table" ng-model="'+ vm.selectedItems + '"> \
                                          <thead md-head> \
                                              <tr md-row> \
                                                  <th width="10%" md-column>#</th> \
                                                  <th width="30%" md-column>Branch</th> \
                                                  <th width="30%" md-column>From Build Number</th> \
                                                  <th width="30%" md-column>To Build Number</th> \
                                              </tr> \
                                          </thead> \
                                          <tbody class="custom-scroll" md-body> \ ';
          vm.printHtmlContent += '<tr md-row> \
                                        <td width="30%" md-cell>' + errorInfo.branchName + '</td> \
                                        <td width="30%" md-cell>' + (errorInfo.toBuildNumber ? errorInfo.toBuildNumber + 1 : errorInfo.fromBuildNumber) + '</td> \
                                    </tr> ' ;
          var model = {
            title: "Fail",
            textContent: vm.printHtmlContent,
            btnText: "Retry",
            canbtnText: "Ok"
          };
          DialogFactory.confirmDiolog(model).then((yes) => {
            if (yes) {
              $mdDialog.hide('', { closeAll: true });
              vm.executeAllRemainingDbScript();
            }
          });
          return { status: CORE.ApiResponseTypeStatus.EMPTY, update: false }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    // on click of "Execute DB Script" button
    vm.executeMsgDBScript = () => {
      successBranchIndex = 0;
      //let frommsgBuild = (vm.dbScript && vm.dbscript.branches && vm.dbscript.branches[2].schemaVersion === CORE.ProjectBranches.MainBranch) ? vm.dbscript[2].maxBuildNumber : null;
      let msgScriptObj = {
        fromMsgBuild: null,
        toMsgBuild: null,
        schemaVersion: CORE.ProjectBranches.MainBranch
      };
      isMessageUpdated = false;
      let obj = {
        title: CORE.MESSAGE_CONSTANT.PUBLISHTEMPLATE_CONFIRM,
        textContent: CORE.MESSAGE_CONSTANT.SURE_WANT_TO_EXECUTE_DBSCRIPT,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };

      getCurrDBInfo();
      // check user is valid/authenticated to execute db-script
      return vm.cgBusyLoading = DbScriptFactory.checkValidUserToExecuteDbScript().save().$promise.then((res) => {
        if (res && res.data && res.data.isValidUser) {
          DialogFactory.confirmDiolog(obj).then(() => {
            vm.cgBusyLoading = DbScriptFactory.executeMsgDBScript().save({ msgScriptObj }).$promise.then((resMsg) => {
              vm.printHtmlContent = '';
              if (resMsg && resMsg.status === CORE.ApiResponseTypeStatus.FAILED) {
                var model = {
                  title: "Failed",
                  textContent: resMsg.errors.userMessage,
                  multiple: true
                };
                DialogFactory.alertDialog(model);
              } else if (resMsg && resMsg.status === CORE.ApiResponseTypeStatus.SUCCESS) {

                vm.printHtmlContent = '<p> <md-table-container flex="100"> \
                                      <table md-table class="md-data-table" ng-model="'+ vm.selectedItems + '"> \
                                          <thead md-head> \
                                              <tr md-row> \
                                                  <th width="10%" md-column>#</th> \
                                                  <th width="30%" md-column>Branch</th> \
                                                  <th width="30%" md-column>From Build Number</th> \
                                                  <th width="30%" md-column>To Build Number</th> \
                                              </tr> \
                                          </thead> \
                                          <tbody class="custom-scroll" md-body> \ ';
                isMessageUpdated = resMsg.data.msgScriptObj.isMessageUpdated;
                /* Execute SQL db script*/
                vm.cgBusyLoading = $q.all([vm.executeAllRemainingDbScript()]).then((responses) => {
                  if (responses && responses.length > 0 && responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
                    if (resMsg.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                      _.each(resMsg.data.msgScriptObj.branchwiseCompletedExecution, function (item, index) {
                        vm.printHtmlContent += '<tr md-row> \ ' +
                          '<td width="10%" md-cell>' + (successBranchIndex + 1) + '</td>  ' +
                          '<td width="30%" md-cell>' + item.branchName + ' </td>  ' +
                          '<td width = "30%" md - cell >' + (item && item.fromBuildNumber ? item.fromBuildNumber : '-') + '</td>' +
                          '<td width="30%" md-cell>' + (item && item.toBuildNumber ? item.toBuildNumber : "-") + '</td> ' +
                          '</tr > ';
                        successBranchIndex = successBranchIndex + 1;
                      });
                    }
                    if (responses[0].update || isMessageUpdated) {
                      vm.printHtmlContent += ' </tbody> \
                                            </table> \
                                            </md-table-container>';
                      if (vm.printHtmlContent) {
                        var model = {
                          title: "Success",
                          textContent: vm.printHtmlContent,
                          multiple: true
                        };
                        DialogFactory.alertDialog(model);
                        getCurrDBInfo();
                        vm.generateJSON();
                      }
                    } else {
                      NotificationFactory.success(CORE.MESSAGE_CONSTANT.SCRIPT_UPTODATE);
                    }

                  }
                }).catch((error) => {
                  return BaseService.getErrorLog(error);
                });

              }
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });

          }, (cancel) => { }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        } else {
          if (vm.dbscript) {
            vm.dbscript.isValidUserToExecuteDbScript = false;
          }
          displayAlertForUnauthorizedUser();
        }
        getCurrDBInfo();
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    // Execute IdntityDB Scripts.
    vm.confirmExecuteIdentityDBScript = () => {
      successBranchIndex = 0;
      let obj = {
        title: CORE.MESSAGE_CONSTANT.PUBLISHTEMPLATE_CONFIRM,
        textContent: CORE.MESSAGE_CONSTANT.SURE_WANT_TO_EXECUTE_DBSCRIPT,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };

      getCurrDBInfo();
      // check user is valid/authenticated to execute db-script
      return vm.cgBusyLoading = DbScriptFactory.checkValidUserToExecuteDbScript().save().$promise.then((res) => {
        if (res && res.data && res.data.isValidUser) {
          DialogFactory.confirmDiolog(obj).then(() => {
            vm.executeIdentityDBScript();
          }, (cancel) => { }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        } else {
          if (vm.dbscript) {
            vm.dbscript.isValidUserToExecuteDbScript = false;
          }
          displayAlertForUnauthorizedUser();
        }
        getCurrDBInfo();
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    vm.executeIdentityDBScript = () => {
      let scriptExecutionObj = {
        currentBranchExecution: CORE.ProjectBranches.MainBranch,
        branchwiseCompletedExecution: [],
        fromBuildNumber: null,
        toBuildNumber: null,
        userIPAddress: userIPAddress
        //isMessageUpdated: isMessageUpdated
      }
      return vm.cgBusyLoading = DbScriptFactory.executeIdentityDBScript().save({ scriptExecutionObj }).$promise.then((res) => {
        if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
          if (res.data && res.data.branchwiseCompletedExecution && res.data.branchwiseCompletedExecution.length > 0) {
            _.each(res.data.branchwiseCompletedExecution, function (item, index) {
              vm.printHtmlContent += '<tr md-row> \
                                      <td width="10%" md-cell>' + (successBranchIndex + 1) + '</td> \
                                      <td width="30%" md-cell>' + item.branchName + '</td> \
                                      <td width="30%" md-cell>'+ (item.fromBuildNumber ? item.fromBuildNumber : "-") + '</td> \
                                      <td width="30%" md-cell>'+ (item.toBuildNumber ? item.toBuildNumber : "-") + '</td> \
                                      </tr> ' ;
              successBranchIndex = successBranchIndex + 1;
            });
            getCurrDBInfo();
            return { status: CORE.ApiResponseTypeStatus.SUCCESS, update: true };
          } else if (res && !res.data) {
            return { status: CORE.ApiResponseTypeStatus.SUCCESS, update: false }
          }
        }
        else if (res && res.status == CORE.ApiResponseTypeStatus.EMPTY && res.errors.errorInScriptExecutionInfo) {
          let errorInfo = res.errors.errorInScriptExecutionInfo;
          //<th width="10%" md-column>#</th> \
          //<th width="30%" md-column>Branch</th> \
          //<th width="30%" md-column>From Build Number</th> \
          //<th width="30%" md-column>To Build Number</th> \
          vm.printHtmlContent = '<p> <md-table-container flex="100"> \
                                      <table md-table class="md-data-table" ng-model="'+ vm.selectedItems + '"> \
                                          <thead md-head> \
                                              <tr md-row> \
                                                  <th width="30%" md-column>Branch</th> \
                                                  <th width="30%" md-column>Build Number</th> \
                                              </tr> \
                                          </thead> \
                                          <tbody class="custom-scroll" md-body> \ ';
          vm.printHtmlContent += '<tr md-row> \
                                        <td width="30%" md-cell>' + errorInfo.branchName + '</td> \
                                        <td width="30%" md-cell>' + (errorInfo.toBuildNumber ? errorInfo.toBuildNumber + 1 : errorInfo.fromBuildNumber) + '</td> \
                                    </tr> ' ;
          var model = {
            title: "Fail",
            textContent: vm.printHtmlContent,
            btnText: "Retry",
            canbtnText: "Ok"
          };
          getCurrDBInfo();
          return DialogFactory.confirmDiolog(model).then((yes) => {
            if (yes) {
              $mdDialog.hide('', { closeAll: true });
              vm.executeIdentityDBScript();
            }
          });
          return { status: CORE.ApiResponseTypeStatus.EMPTY, update: false }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };
  }
})();
