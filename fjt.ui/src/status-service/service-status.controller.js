(function () {
  //'use strict';

  angular
    .module('myApp', ['ngRoute', 'cgBusy'])
    .controller('ServiceStatusController', ServiceStatusController);

  /** @ngInject */
  function ServiceStatusController($scope, $sce, $interval, $http, $q, $filter) {
    var serviceRes = [];
    var status = 0;
    var timer = 0;
    $scope.statusConst = {
      statusRunning: 'Running',
      statusStopped: 'Stopped',
      checking: 'Checking',
      statusUnavailable: 'Unavailable'
    };
    $scope.category = {
      critical: 'Critical',
      intermediate: 'Intermediate'
    };
    $scope.ApplicationDetail = {
      Q2CAPI: {
        displayName: 'Q2C API',
        endPoint: _configRootUrl,
        iisAppName: _Q2CAPI
      },
      Q2CUI: {
        displayName: 'Q2C UI',
        endPoint: WebsiteBaseUrl,
        iisAppName: _Q2CUI
      },
      Q2CIDENTITYSERVER: {
        displayName: 'Q2C Identity Server',
        endPoint: _identityURL + '.well-known/openid-configuration',
        iisAppName: _Q2CIdentityServer
      },
      Q2CREPORTDESIGNER: {
        displayName: 'Q2C Report Designer',
        endPoint: _configReportDesigneUrl + 'api/CheckApplicationStatus',
        iisAppName: _Q2CReportDesigner
      },
      Q2CREPORTVIEWER: {
        displayName: 'Q2C Report Viewer',
        endPoint: _configReportViewerUrl + 'api/CheckApplicationStatus',
        iisAppName: _Q2CReportViewer
      },
      Q2CREPORT: {
        displayName: 'Q2C Report',
        endPoint: _configReportUrl + 'values',
        iisAppName: _Q2CReport
      },
      Q2CSEARCHENGINEAPI: {
        displayName: 'Q2C Enterprise Search',
        endPoint: _configEnterpriseSearchUrl + 'values',
        iisAppName: _Q2CSearchengine
      },
      Q2CPRINTETR: {
        displayName: 'Q2C Brother Printer',
        endPoint: ScanDocumentStorageURL,
        iisAppName: _Q2CReport
      },
      Q2CMONGODBSERVICE: {
        displayName: 'Mongo DB',
        endPoint: 'MongoDB'
      },
      Q2CRABBITMQSERVICE: {
        displayName: 'Rabbit MQ',
        endPoint: 'RabbitMQ'
      },
      Q2CPRICINGSERVICE: {
        displayName: 'Q2C Pricing Service',
        endPoint: 'FJTPricingService'
      },
      Q2CEMAILSERVICE: {
        displayName: 'Q2C Email Service',
        endPoint: 'FJTEmailService'
      },
      Q2CENTERPRISESEARCHSERVICE: {
        displayName: 'Q2C Enterprise Service',
        endPoint: 'FJTEnterPriseService'
      },
      Q2CMYSQLSERVICE: {
        displayName: 'My SQL',
        endPoint: 'MySQL80'
      },
      Q2CELASTICSERVICE: {
        displayName: 'Elastic Search',
        endPoint: 'Elasticsearch'
      }
    };
    $scope.isAPI = false;
    $scope.countDown = 0;
    $scope.ServicesList = [
      {
        id: 1,
        displayName: $scope.ApplicationDetail.Q2CAPI.displayName,
        endPoint: $scope.ApplicationDetail.Q2CAPI.endPoint,
        isService: false,
        displayOrder: 2,
        status: $scope.statusConst.checking,
        category: $scope.category.critical,
        description: $sce.trustAsHtml('This Application is PUBLISHED in IIS. If found Status is STOPPED, Please contact to TGS Team or STOP and START <b>"' + $scope.ApplicationDetail.Q2CAPI.iisAppName + '"</b> from IIS.'),
        iisAppName: $scope.ApplicationDetail.Q2CAPI.iisAppName,
        affectedFunctionality: $sce.trustAsHtml('<b>Q2C Appllication</b> <br/> Note: All Q2C Services may running in background but status on this page is lost due to depndency.')
      }, {
        id: 2,
        displayName: $scope.ApplicationDetail.Q2CUI.displayName,
        endPoint: $scope.ApplicationDetail.Q2CUI.endPoint,
        isService: false,
        displayOrder: 1,
        status: $scope.statusConst.checking,
        category: $scope.category.critical,
        description: $sce.trustAsHtml('This Application is PUBLISHED in IIS. If found Status is STOPPED, Please contact to TGS Team or STOP and START <b>"' + $scope.ApplicationDetail.Q2CUI.iisAppName + '"</b> from IIS.'),
        iisAppName: $scope.ApplicationDetail.Q2CUI.iisAppName,
        affectedFunctionality: $sce.trustAsHtml('<b>Q2C Appllication</b> <br/> Note: All Q2C Services may running in background but status on this page is lost due to depndency.')
      }, {
        id: 3,
        displayName: $scope.ApplicationDetail.Q2CREPORT.displayName,
        endPoint: $scope.ApplicationDetail.Q2CREPORT.endPoint,
        isService: false,
        displayOrder: 11,
        status: $scope.statusConst.checking,
        category: $scope.category.intermediate,
        description: $sce.trustAsHtml('This Application is PUBLISHED in IIS. It is used for display report from Q2C Application and Email Obsolete Part Reports. If found Status is STOPPED, Please contact to TGS Team or STOP and START  <b>"' + $scope.ApplicationDetail.Q2CREPORT.iisAppName + '"</b> from IIS.'),
        iisAppName: $scope.ApplicationDetail.Q2CREPORT.iisAppName,
        affectedFunctionality: $sce.trustAsHtml('<b>Q2C Application:</b> Reports (e.g. Supplier Invoice, Customer Invoice etc..)')
      }, {
        id: 4,
        displayName: $scope.ApplicationDetail.Q2CSEARCHENGINEAPI.displayName,
        endPoint: $scope.ApplicationDetail.Q2CSEARCHENGINEAPI.endPoint,
        isService: false,
        displayOrder: 10,
        status: $scope.statusConst.checking,
        category: $scope.category.critical,
        description: $sce.trustAsHtml('This Application is PUBLISHED in IIS. It is used to get details of search request from Q2C Application.If found Status is STOPPED, Please contact to TGS Team or STOP and START <b>"' + $scope.ApplicationDetail.Q2CSEARCHENGINEAPI.iisAppName + '"</b> from IIS.'),
        iisAppName: $scope.ApplicationDetail.Q2CSEARCHENGINEAPI.iisAppName,
        affectedFunctionality: $sce.trustAsHtml('<b>Q2C Application:</b> Enterprise Search (e.g. Enterprise Search, Configure Search etc..)')
      }, {
        id: 5,
        displayName: $scope.ApplicationDetail.Q2CPRINTETR.displayName,
        endPoint: $scope.ApplicationDetail.Q2CPRINTETR.endPoint,
        isService: false,
        displayOrder: 13,
        status: $scope.statusConst.checking,
        category: $scope.category.intermediate,
        description: $sce.trustAsHtml('This Application is PUBLISHED in IIS. If found Status is STOPPED, Please contact to TGS Team or STOP and START <b>"' + $scope.ApplicationDetail.Q2CPRINTETR.iisAppName + '"</b> from IIS.'),
        iisAppName: $scope.ApplicationDetail.Q2CPRINTETR.iisAppName,
        affectedFunctionality: $sce.trustAsHtml('<b>Q2C Application:</b> Scanner')
      }, {
        id: 6,
        displayName: $scope.ApplicationDetail.Q2CREPORTDESIGNER.displayName,
        endPoint: $scope.ApplicationDetail.Q2CREPORTDESIGNER.endPoint,
        isService: false,
        displayOrder: 11,
        status: $scope.statusConst.checking,
        category: $scope.category.intermediate,
        description: $sce.trustAsHtml('This Application is PUBLISHED in IIS. It is used for design report manually. If found Status is STOPPED, Please contact to TGS Team or STOP and START <b>"' + $scope.ApplicationDetail.Q2CREPORTDESIGNER.iisAppName + '"</b> from IIS.'),
        iisAppName: $scope.ApplicationDetail.Q2CREPORTDESIGNER.iisAppName,
        affectedFunctionality: $sce.trustAsHtml('<b>Q2C Application:</b> Reports (e.g. Supplier Invoice, Customer Invoice etc..)')
      }, {
        id: 7,
        displayName: $scope.ApplicationDetail.Q2CMONGODBSERVICE.displayName,
        endPoint: $scope.ApplicationDetail.Q2CMONGODBSERVICE.endPoint,
        isService: true,
        displayOrder: 6,
        status: $scope.statusConst.checking,
        category: $scope.category.critical,
        description: $sce.trustAsHtml('This Service is used to connect mongodb database, Q2C Application will not perform all action properly if STOPPED. If found Status is STOPPED, Please press START Button or Please contact to TGS Team or START from Services.'),
        affectedFunctionality: $sce.trustAsHtml('<b>Q2C Application:</b> List Pages, Pricing History, Error Log, Message etc..')
      }, {
        id: 8,
        displayName: $scope.ApplicationDetail.Q2CRABBITMQSERVICE.displayName,
        endPoint: $scope.ApplicationDetail.Q2CRABBITMQSERVICE.endPoint,
        isService: true,
        displayOrder: 4,
        status: $scope.statusConst.checking,
        category: $scope.category.critical,
        description: $sce.trustAsHtml('This Service is used for queue all request from Q2C Application for pricing, email and enterprise search. If found Status is STOPPED, Please press START Button or Please contact to TGS Team or START from Services.'),
        affectedFunctionality: $sce.trustAsHtml('<b>Q2C Application <br/> ' + $scope.ApplicationDetail.Q2CPRICINGSERVICE.displayName + ' <br/> ' + $scope.ApplicationDetail.Q2CEMAILSERVICE.displayName + ' <br/> ' + $scope.ApplicationDetail.Q2CSEARCHENGINEAPI.displayName +'</b>')
      }, {
        id: 9,
        displayName: $scope.ApplicationDetail.Q2CPRICINGSERVICE.displayName,
        endPoint: $scope.ApplicationDetail.Q2CPRICINGSERVICE.endPoint,
        isService: true,
        displayOrder: 8,
        status: $scope.statusConst.checking,
        category: $scope.category.critical,
        description: $sce.trustAsHtml('This Service is used to send part request from Q2C Application. If found Status is STOPPED, Please press START Button or Please contact to TGS Team or START from Services.'),
        affectedFunctionality: $sce.trustAsHtml('<b>Q2C Application:</b> Part Cloud Button, BOM Cleaning, Pricing Request')
      }, {
        id: 10,
        displayName: $scope.ApplicationDetail.Q2CEMAILSERVICE.displayName,
        endPoint: $scope.ApplicationDetail.Q2CEMAILSERVICE.endPoint,
        isService: true,
        displayOrder: 7,
        status: $scope.statusConst.checking,
        category: $scope.category.intermediate,
        description: $sce.trustAsHtml('This Service is used to send email from Q2C Application. If found Status is STOPPED, Please press START Button or Please contact to TGS Team or START from Services.'),
        affectedFunctionality: $sce.trustAsHtml('<b>Q2C Application:</b> Email Functionality, Backup Email')
      }, {
        id: 11,
        displayName: $scope.ApplicationDetail.Q2CENTERPRISESEARCHSERVICE.displayName,
        endPoint: $scope.ApplicationDetail.Q2CENTERPRISESEARCHSERVICE.endPoint,
        isService: true,
        displayOrder: 9,
        status: $scope.statusConst.checking,
        category: $scope.category.critical,
        description: $sce.trustAsHtml('This Service is used to consume details from RabbitMQ and save search engine records in elastic search database. If found Status is STOPPED, Please press START Button or Please contact to TGS Team or START from Services.'),
        affectedFunctionality: $sce.trustAsHtml('<b>Q2C Application:</b> Enterprise Search (e.g. Enterprise Search, Configure Search etc..)')
      }, {
        id: 12,
        displayName: $scope.ApplicationDetail.Q2CMYSQLSERVICE.displayName,
        endPoint: $scope.ApplicationDetail.Q2CMYSQLSERVICE.endPoint,
        isService: true,
        displayOrder: 3,
        status: $scope.statusConst.checking,
        category: $scope.category.critical,
        description: $sce.trustAsHtml('This Service is used to connect mysql database, Application will not Run if STOPPED. If found Status is STOPPED, Please press START Button or Please contact to TGS Team or START from Services.'),
        affectedFunctionality: $sce.trustAsHtml('<b>Q2C Application <br/> ' + $scope.ApplicationDetail.Q2CPRICINGSERVICE.displayName + ' <br/> Q2C Auto Backup</b>')
      }, {
        id: 13,
        displayName: $scope.ApplicationDetail.Q2CELASTICSERVICE.displayName,
        endPoint: $scope.ApplicationDetail.Q2CELASTICSERVICE.endPoint,
        isService: true,
        displayOrder: 5,
        status: $scope.statusConst.checking,
        category: $scope.category.critical,
        description: $sce.trustAsHtml('This Service is used for manage search functionality in Q2C Application. Q2C Application new record / update record will not get updated if STOPPED. If found Status is STOPPED, Please press START Button or Please contact to TGS Team or START from Services.'),
        affectedFunctionality: $sce.trustAsHtml('<b>Q2C Application:</b> Enterprise Search (e.g. Enterprise Search, Configure Search etc..) <br/> <b>' + $scope.ApplicationDetail.Q2CENTERPRISESEARCHSERVICE.displayName + '</b> <br/><b>' + $scope.ApplicationDetail.Q2CSEARCHENGINEAPI.displayName + '</b>')
      }, {
        id: 14,
        displayName: $scope.ApplicationDetail.Q2CIDENTITYSERVER.displayName,
        endPoint: $scope.ApplicationDetail.Q2CIDENTITYSERVER.endPoint,
        isService: false,
        displayOrder: 2.5,
        status: $scope.statusConst.checking,
        category: $scope.category.intermediate,
        description: $sce.trustAsHtml('This Application is PUBLISHED in IIS. It is used for centralized application to communicate between multiple application. If found Status is STOPPED, Please contact to TGS Team or STOP and START  <b>"' + $scope.ApplicationDetail.Q2CIDENTITYSERVER.iisAppName + '"</b> from IIS.'),
        iisAppName: $scope.ApplicationDetail.Q2CIDENTITYSERVER.iisAppName,
        affectedFunctionality: $sce.trustAsHtml('<b>Q2C Application:</b> <br/> Note: All Q2C Services may running in background but status on this page is lost due to depndency.')
      }, {
        id: 15,
        displayName: $scope.ApplicationDetail.Q2CREPORTVIEWER.displayName,
        endPoint: $scope.ApplicationDetail.Q2CREPORTVIEWER.endPoint,
        isService: false,
        displayOrder: 12,
        status: $scope.statusConst.checking,
        category: $scope.category.intermediate,
        description: $sce.trustAsHtml('This Application is PUBLISHED in IIS. It is used for display report viewer from Q2C Application. If found Status is STOPPED, Please contact to TGS Team or STOP and START <b>"' + $scope.ApplicationDetail.Q2CREPORTVIEWER.iisAppName + '"</b> from IIS.'),
        iisAppName: $scope.ApplicationDetail.Q2CREPORTVIEWER.iisAppName,
        affectedFunctionality: $sce.trustAsHtml('<b>Q2C Application:</b> Report Viewer (e.g. Supplier Invoice, Customer Invoice etc..)')
      }
    ];
    const loginuser = JSON.parse(localStorage.getItem('loginuser'));
    if (loginuser && loginuser.isUserSuperAdmin) {
      $scope.isSuperAdmin = true;
      $scope.$applyAsync();
    }

    //1-stopped, 2-Running, 3-Unavailable
    $scope.manage = (serviceName, APPstatus) => {
      if ($scope.isSuperAdmin && $scope.isAPI) {
        if (APPstatus === $scope.statusConst.statusRunning) {
          status = false; 
        } else if (APPstatus === $scope.statusConst.statusStopped || APPstatus === $scope.statusConst.statusUnavailable) {
          status = true;
        }
        $scope.cgBusyLoading = fetch(_configRootUrl + 'servicestatus/manageServices', {
          body: JSON.stringify({ serviceName: serviceName, status: status }),
          headers: {
            'Content-Type': 'application/json'
          }, method: 'POST'
        })
          .then((response) => {
            if (response) {
              return response.json();
            } else {
              alert(response.error);
            }
          })
          .then((data) => {
            if (data.data && data.status === 'SUCCESS') {
              const selectedService = $scope.ServicesList.find((item) => item.endPoint === data.data.serviceName);
              if (selectedService) {
                selectedService.status = data.data.status;
                $scope.$applyAsync();
                btnEnablDisable();
                alert(data.data.serviceName + ' Service is ' + data.data.status + ' .');
              } else {
                alert('Service is not found.');
              }
            } else if (data.status === 'ERROR') {
              if (data.errors.messageContent) {
                alert(data.errors.messageContent.message);
              } else {
                alert('Error while updating Service Status.');
              }
            } else if (data.status === 'EMPTY') {
              if (data.errors.messageContent) {
                alert(data.errors.messageContent.message);
              } else {
                alert('Error while updating Service Status.');
              }
            }
            $scope.$applyAsync();
          }).catch(() => alert('Error while updating Service Status.'));
      } else {
        alert('Service can not be Update.');
      }
      $scope.$applyAsync();
    };
    const serviceTrue = $scope.ServicesList.filter((item) =>
      item.isService
    );
    const serviceFalse = $scope.ServicesList.filter((item) =>
      !item.isService
    );
    const GetServiceStatus = () => {
      var ServicesName = serviceTrue.map((item) => item.endPoint);
      const projectPromise = [];
      angular.forEach(serviceFalse, (item) => {
        switch (item.id) {
          case 1:
            projectPromise.push(fetchService(ServicesName, item));
            break;
          case 2:
            //URL = WebsiteBaseUrl;
            projectPromise.push(startStopStatus(item));
            break;
          case 3:
            // URL = _configReportUrl;
            projectPromise.push(startStopStatus(item));
            break;
          case 4:
            // URL = _configEnterpriseSearchUrl + 'values';
            projectPromise.push(startStopStatus(item));
            break;
          case 5:
            // URL = ScanDocumentStorageURL;
            projectPromise.push(startStopStatus(item));
            break;
          case 6:
            // URL = _configReportDesigneUrl;
            projectPromise.push(startStopStatus(item));
            break;
          case 14:
            // URL = _configReportDesigneUrl;
            projectPromise.push(startStopStatus(item));
            break;
          case 15:
            // URL = _configReportDesigneUrl;
            projectPromise.push(startStopStatus(item));
            break;
          default:
        }
      });
      Promise.all(projectPromise).then(() => {
        btnEnablDisable();
        $scope.countDown = 30;
        timer = 0;
        timer = setInterval(() => {
          $scope.countDown--;
          $scope.$applyAsync();
          if ($scope.countDown <= 0) {
            clearInterval(timer);
            GetServiceStatus();
          }
        }, 1000);
        $scope.lastUpdatedOn = $filter('date')(new Date(), 'MM/dd/yyyy HH:mm:ss');
        $scope.$applyAsync();
      });
    };
    GetServiceStatus();
    function startStopStatus(serviceName) {
      return $http.get(serviceName.endPoint).then((res) => {
        serviceName.status = $scope.statusConst.statusRunning;
        return $q.resolve(res);
      }).catch((err) => {
        console.log(err);
        serviceName.status = $scope.statusConst.statusStopped;
      });
    }
    function fetchService(ServicesName, item) {
      return fetch(_configRootUrl + 'servicestatus/getServiceStatus', {
        body: JSON.stringify({ servicesName: ServicesName }),
        headers: {
          'Content-Type': 'application/json',
          withCredentials: true
        }, method: 'POST'
      })
        .then((response) =>
          response.json()
        )
        .then((data) => {
          if (data && data.status === 'SUCCESS') {
            serviceRes = data.data;
            item.status = $scope.statusConst.statusRunning;
            $scope.isAPI = true;
            let listItem = [];
            angular.forEach(serviceRes, (Res) => {
              listItem = $scope.ServicesList.find((item) => item.endPoint === Res.serviceName);
              if (listItem) {
                listItem.status = Res.status;
              }
            });
          }
          else if (data.status === 'ERROR') {
            alert(data.errors.messageContent.message);
          } else if (data.status === 'EMPTY') {
            alert(data.errors.messageContent.message);
          }
          $scope.$applyAsync();
          return $q.resolve(data);
        })
        .catch(() => {
          $scope.isAPI = false;
          item.status = $scope.statusConst.statusStopped;
          let listItem = [];
          angular.forEach(serviceTrue, (Res) => {
            listItem = $scope.ServicesList.find((item) => item.endPoint === Res.endPoint);
            if (listItem) {
              listItem.status = $scope.statusConst.statusStopped;
              $scope.$applyAsync();
            }
          });
        });
    }
    function btnEnablDisable() {
      angular.forEach($scope.ServicesList, (service) => {
        if ($scope.isSuperAdmin && $scope.isAPI && service.isService) {
          if (service.status === $scope.statusConst.statusRunning) {
            service.isStartbtnDisable = true;
            service.isStopbtnDisable = false;
            service.isRefreshbtnDisable = false;
          } else if (service.status === $scope.statusConst.statusStopped) {
            service.isStartbtnDisable = false;
            service.isStopbtnDisable = true;
            service.isRefreshbtnDisable = false;
          } else if (service.status === $scope.statusConst.statusUnavailable) {
            service.isStartbtnDisable = true;
            service.isStopbtnDisable = true;
            service.isRefreshbtnDisable = true;
          }
        } else {
          service.isStartbtnDisable = true;
          service.isStopbtnDisable = true;
          service.isRefreshbtnDisable = true;
        }
      });
      $scope.$applyAsync();
    }
  }
})();
