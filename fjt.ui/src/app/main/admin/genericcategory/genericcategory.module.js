(function () {
    'use strict';

    angular
        .module('app.admin.genericcategory', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, USER, CORE) {
        // State
        //$stateProvider.state(USER.ADMIN_GENERICCATEGORY_STATE, {
        //    url: USER.ADMIN_GENERICCATEGORY_ROUTE,
        //    views: {
        //        'content@app': {
        //            templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
        //            controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
        //            controllerAs: CORE.CONTROLLER_AS
        //        }
        //    }
        //});

        $stateProvider.state(USER.ADMIN_GENERICCATEGORY_EQPGROUP_STATE, {
            url: USER.ADMIN_GENERICCATEGORY_EQPGROUP_ROUTE,
            params: {
                categoryTypeID: '1'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_GENERICCATEGORY_EQPTYPE_STATE, {
            url: USER.ADMIN_GENERICCATEGORY_EQPTYPE_ROUTE,
            params: {
                categoryTypeID: '2'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_GENERICCATEGORY_EQPOWNER_STATE, {
            url: USER.ADMIN_GENERICCATEGORY_EQPOWNER_ROUTE,
            params: {
                categoryTypeID: '4'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_GENERICCATEGORY_STANDTYPE_STATE, {
            url: USER.ADMIN_GENERICCATEGORY_STANDTYPE_ROUTE,
            params: {
                categoryTypeID: '5'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_GENERICCATEGORY_EMPTITLE_STATE, {
            url: USER.ADMIN_GENERICCATEGORY_EMPTITLE_ROUTE,
            params: {
                categoryTypeID: '7'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });


        $stateProvider.state(USER.ADMIN_GENERICCATEGORY_OPTYPE_STATE, {
            url: USER.ADMIN_GENERICCATEGORY_OPTYPE_ROUTE,
            params: {
                categoryTypeID: '8'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_GENERICCATEGORY_SHIPSTATUS_STATE, {
            url: USER.ADMIN_GENERICCATEGORY_SHIPSTATUS_ROUTE,
            params: {
                categoryTypeID: '9'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_GENERICCATEGORY_VERISTATUS_STATE, {
            url: USER.ADMIN_GENERICCATEGORY_VERISTATUS_ROUTE,
            params: {
                categoryTypeID: '10'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_GENERICCATEGORY_LOCATIONTYPE_STATE, {
            url: USER.ADMIN_GENERICCATEGORY_LOCATIONTYPE_ROUTE,
            params: {
                categoryTypeID: '11'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_GENERICCATEGORY_WORKAREA_STATE, {
            url: USER.ADMIN_GENERICCATEGORY_WORKAREA_ROUTE,
            params: {
                categoryTypeID: '12'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_GENERICCATEGORY_SHIPPINGTYPE_STATE, {
            url: USER.ADMIN_GENERICCATEGORY_SHIPPINGTYPE_ROUTE,
            params: {
                categoryTypeID: '13'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        //$stateProvider.state(USER.ADMIN_MANAGEGENERICCATEGORY_STATE, {
        //    url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
        //    views: {
        //        'content@app': {
        //            templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
        //            controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
        //            controllerAs: CORE.CONTROLLER_AS
        //        }
        //    }
        //});

        $stateProvider.state(USER.ADMIN_GENERICCATEGORY_TERMS_STATE, {
            url: USER.ADMIN_GENERICCATEGORY_TERMS_ROUTE,
            params: {
                categoryTypeID: '14'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_GENERICCATEGORY_PRINTER_TYPE_STATE, {
            url: USER.ADMIN_GENERICCATEGORY_PRINTER_TYPE_ROUTE,
            params: {
                categoryTypeID: '15'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        //$stateProvider.state(USER.ADMIN_GENERICCATEGORY_PRINTER_FORMAT_STATE, {
        //    url: USER.ADMIN_GENERICCATEGORY_PRINTER_FORMAT_ROUTE,
        //    params: {
        //        categoryTypeID: '16'
        //    },
        //    views: {
        //        'content@app': {
        //            templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
        //            controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
        //            controllerAs: CORE.CONTROLLER_AS
        //        }
        //    }
        //});
        //$stateProvider.state(USER.ADMIN_GENERICCATEGORY_PART_STATUS_STATE, {
        //    url: USER.ADMIN_GENERICCATEGORY_PART_STATUS_ROUTE,
        //    params: {
        //        categoryTypeID: '17'
        //    },
        //    views: {
        //        'content@app': {
        //            templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
        //            controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
        //            controllerAs: CORE.CONTROLLER_AS
        //        }
        //    }
        //});

        $stateProvider.state(USER.ADMIN_GENERICCATEGORY_BARCODE_SEPARATOR_STATE, {
            url: USER.ADMIN_GENERICCATEGORY_BARCODE_SEPARATOR_ROUTE,
            params: {
                categoryTypeID: '18'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_GENERICCATEGORY_HOME_MENU_CATEGORY_STATE, {
            url: USER.ADMIN_GENERICCATEGORY_HOME_MENU_CATEGORY_ROUTE,
            params: {
                categoryTypeID: '20'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_GENERICCATEGORY_DOCUMENTTYPE_STATE, {
            url: USER.ADMIN_GENERICCATEGORY_DOCUMENTTYPE_ROUTE,
            params: {
                categoryTypeID: '21'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_GENERICCATEGORY_ECO_DFM_TYPE_STATE, {
            url: USER.ADMIN_GENERICCATEGORY_ECO_DFM_TYPE_ROUTE,
            params: {
                categoryTypeID: '22'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_GENERICCATEGORY_CHARGES_TYPE_STATE, {
          url: USER.ADMIN_GENERICCATEGORY_CHARGES_TYPE_ROUTE,
          params: {
            categoryTypeID: '23'
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
              controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        });
      $stateProvider.state(USER.ADMIN_GENERICCATEGORY_NOTIFICATION_CATEGORY_STATE, {
        url: USER.ADMIN_GENERICCATEGORY_NOTIFICATION_CATEGORY_ROUTE,
        params: {
          categoryTypeID: '24'
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
            controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
      $stateProvider.state(USER.ADMIN_GENERICCATEGORY_PAYMENT_METHODS_STATE, {
        url: USER.ADMIN_GENERICCATEGORY_PAYMENT_METHODS_ROUTE,
        /*params: {
          categoryTypeID: '25'
        },*/
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_PAYMENT_METHODS_VIEW,
            controller: USER.ADMIN_PAYMENT_METHODS_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        data: {
          autoActivateChild: USER.ADMIN_GENERICCATEGORY_PAYABLE_PAYMENT_METHODS_STATE
        }
      });
      $stateProvider
        .state(USER.ADMIN_GENERICCATEGORY_PAYABLE_PAYMENT_METHODS_STATE, {
          url: USER.ADMIN_GENERICCATEGORY_PAYABLE_PAYMENT_METHODS_ROUTE,
          params: {
            tabName: USER.PaymentMethodsTabs.Payable.Name,
            categoryTypeID: '25'
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_PAYMENT_METHODS_VIEW,
              controller: USER.ADMIN_PAYMENT_METHODS_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        }).state(USER.ADMIN_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE, {
          url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
              controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        });

      $stateProvider
        .state(USER.ADMIN_GENERICCATEGORY_RECEIVABLE_PAYMENT_METHODS_STATE, {
          url: USER.ADMIN_GENERICCATEGORY_RECEIVABLE_PAYMENT_METHODS_ROUTE,
          params: {
            tabName: USER.PaymentMethodsTabs.Receivable.Name,
            categoryTypeID: '30'
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_PAYMENT_METHODS_VIEW,
              controller: USER.ADMIN_PAYMENT_METHODS_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        }).state(USER.ADMIN_RECEIVABLE_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE, {
          url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
              controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        });

     /* $stateProvider.state(USER.ADMIN_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE, {
        url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
            controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
      $stateProvider.state(USER.ADMIN_RECEIVABLE_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE, {
        url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
            controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });*/

      $stateProvider.state(USER.ADMIN_GENERICCATEGORY_PAYMENT_TYPE_CATEGORY_STATE, {
        url: USER.ADMIN_GENERICCATEGORY_PAYMENT_TYPE_CATEGORY_ROUTE,
        params: {
          categoryTypeID: '29'
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
            controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
      /*$stateProvider.state(USER.ADMIN_GENERICCATEGORY_RECEIVABLE_PAYMENT_METHODS_STATE, {
        url: USER.ADMIN_GENERICCATEGORY_RECEIVABLE_PAYMENT_METHODS_ROUTE,
        params: {
          categoryTypeID: '30'
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
            controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });*/
        /***** [S] Manage Generic Category all State ******/
        $stateProvider.state(USER.ADMIN_EQPGROUP_MANAGEGENERICCATEGORY_STATE, {
            url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_EQPTYPE_TYPE_MANAGEGENERICCATEGORY_STATE, {
            url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_EQPOWNER_MANAGEGENERICCATEGORY_STATE, {
            url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_STANDTYPE_MANAGEGENERICCATEGORY_STATE, {
            url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        //$stateProvider.state(USER.ADMIN_PART_STATUS_MANAGEGENERICCATEGORY_STATE, {
        //    url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
        //    views: {
        //        'content@app': {
        //            templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
        //            controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
        //            controllerAs: CORE.CONTROLLER_AS
        //        }
        //    }
        //});
        $stateProvider.state(USER.ADMIN_BARCODE_SEPARATOR_MANAGEGENERICCATEGORY_STATE, {
            url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_EMPTITLE_MANAGEGENERICCATEGORY_STATE, {
            url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_OPTYPE_MANAGEGENERICCATEGORY_STATE, {
            url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_SHIPSTATUS_MANAGEGENERICCATEGORY_STATE, {
            url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_LOCATIONTYPE_MANAGEGENERICCATEGORY_STATE, {
            url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_WORKAREA_MANAGEGENERICCATEGORY_STATE, {
            url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_SHIPPINGTYPE_MANAGEGENERICCATEGORY_STATE, {
            url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_TERMS_MANAGEGENERICCATEGORY_STATE, {
            url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_VERISTATUS_MANAGEGENERICCATEGORY_STATE, {
            url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_PRINTER_TYPE_MANAGEGENERICCATEGORY_STATE, {
            url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        //$stateProvider.state(USER.ADMIN_PRINTER_FORMAT_MANAGEGENERICCATEGORY_STATE, {
        //    url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
        //    views: {
        //        'content@app': {
        //            templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
        //            controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
        //            controllerAs: CORE.CONTROLLER_AS
        //        }
        //    }
        //});
        $stateProvider.state(USER.ADMIN_HOME_MENU_CATEGORY_MANAGEGENERICCATEGORY_STATE, {
            url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_DOCUMENT_TYPE_MANAGEGENERICCATEGORY_STATE, {
            url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_ECO_DFM_TYPE_MANAGEGENERICCATEGORY_STATE, {
            url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
                    controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_CHARGES_TYPE_MANAGEGENERICCATEGORY_STATE, {
          url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
              controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        });
      $stateProvider.state(USER.ADMIN_NOTIFICATION_CATEGORY_MANAGEGENERICCATEGORY_STATE, {
        url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
            controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
      
      $stateProvider.state(USER.ADMIN_GENERICCATEGORY_CARRIERMST_STATE, {
        url: USER.ADMIN_GENERICCATEGORY_CARRIERMST_ROUTE,
        params: {
          categoryTypeID: '26'
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
            controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
      $stateProvider.state(USER.ADMIN_CARRIERMST_MANAGEGENERICCATEGORY_STATE, {
        url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
            controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
      $stateProvider.state(USER.ADMIN_GENERICCATEGORY_REPORTCATEGORY_STATE, {
        url: USER.ADMIN_GENERICCATEGORY_REPORTCATEGORY_ROUTE,
        params: {
          categoryTypeID: '27'
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
            controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
      $stateProvider.state(USER.ADMIN_REPORTCATEGORY_MANAGEGENERICCATEGORY_STATE, {
        url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
            controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
      $stateProvider.state(USER.ADMIN_GENERICCATEGORY_PARTREQUIREMENTCATEGORY_STATE, {
        url: USER.ADMIN_GENERICCATEGORY_PARTREQUIREMENTCATEGORY_ROUTE,
        params: {
          categoryTypeID: '28'
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_GENERICCATEGORY_VIEW,
            controller: USER.ADMIN_GENERICCATEGORY_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
      $stateProvider.state(USER.ADMIN_PARTREQUIREMENTCATEGORY_MANAGEGENERICCATEGORY_STATE, {
        url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
            controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
      $stateProvider.state(USER.ADMIN_PAYMENT_TYPE_CATEGORY_MANAGEGENERICCATEGORY_STATE, {
        url: USER.ADMIN_MANAGEGENERICCATEGORY_ROUTE,
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGEGENERICCATEGORY_VIEW,
            controller: USER.ADMIN_MANAGEGENERICCATEGORY_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
        /***** [E] Manage Generic Category all State ******/
    }
})();
