(function () {
    'use strict';

    angular
        .module('app.admin.customer', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, USER, CORE) {
        // State
        $stateProvider.state(USER.ADMIN_CUSTOMER_STATE, {
            url: USER.ADMIN_CUSTOMER_ROUTE,
            params: {
                customerType: '1'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_CUSTOMER_VIEW,
                    controller: USER.ADMIN_CUSTOMER_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_SUPPLIER_STATE, {
            url: USER.ADMIN_SUPPLIER_ROUTE,
            params: {
                customerType: '0'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_CUSTOMER_VIEW,
                    controller: USER.ADMIN_CUSTOMER_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
      $stateProvider.state(USER.ADMIN_MANAGECUSTOMER_STATE, {
        url: USER.ADMIN_MANAGECUSTOMER_ROUTE,
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECUSTOMER_VIEW,
            controller: USER.ADMIN_MANAGECUSTOMER_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
        .state(USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE, {
          url: USER.ADMIN_MANAGECUSTOMER_DETAIL_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.Detail.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGECUSTOMER_VIEW,
              controller: USER.ADMIN_MANAGECUSTOMER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(USER.ADMIN_MANAGECUSTOMER_ADDRESSES_STATE, {
          url: USER.ADMIN_MANAGECUSTOMER_ADDRESSES_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.Addresses.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGECUSTOMER_VIEW,
              controller: USER.ADMIN_MANAGECUSTOMER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(USER.ADMIN_MANAGECUSTOMER_AUTOMATION_ADDRESSES_STATE, {
          url: USER.ADMIN_MANAGECUSTOMER_AUTOMATION_ADDRESSES_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.AutomationAddresses.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGECUSTOMER_VIEW,
              controller: USER.ADMIN_MANAGECUSTOMER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        //.state(USER.ADMIN_MANAGECUSTOMER_BILLING_ADDRESS_STATE, {
        //  url: USER.ADMIN_MANAGECUSTOMER_BILLING_ADDRESS_ROUTE,
        //  params: {
        //    selectedTab: USER.CustomerTabs.BilingAddress.Name
        //  },
        //  views: {
        //    'content@app': {
        //      templateUrl: USER.ADMIN_MANAGECUSTOMER_VIEW,
        //      controller: USER.ADMIN_MANAGECUSTOMER_CONTROLLER,
        //      controllerAs: CORE.CONTROLLER_AS
        //    }
        //  }
        //})
        //.state(USER.ADMIN_MANAGECUSTOMER_SHIPPING_ADDRESS_STATE, {
        //  url: USER.ADMIN_MANAGECUSTOMER_SHIPPING_ADDRESS_ROUTE,
        //  params: {
        //    selectedTab: USER.CustomerTabs.ShippingAddress.Name
        //  },
        //  views: {
        //    'content@app': {
        //      templateUrl: USER.ADMIN_MANAGECUSTOMER_VIEW,
        //      controller: USER.ADMIN_MANAGECUSTOMER_CONTROLLER,
        //      controllerAs: CORE.CONTROLLER_AS
        //    }
        //  }
        //})
        //.state(USER.ADMIN_MANAGECUSTOMER_RMASHIPPING_ADDRESS_STATE, {
        //  url: USER.ADMIN_MANAGECUSTOMER_RMASHIPPING_ADDRESS_ROUTE,
        //  params: {
        //    selectedTab: USER.CustomerTabs.RMAShippingAddress.Name
        //  },
        //  views: {
        //    'content@app': {
        //      templateUrl: USER.ADMIN_MANAGECUSTOMER_VIEW,
        //      controller: USER.ADMIN_MANAGECUSTOMER_CONTROLLER,
        //      controllerAs: CORE.CONTROLLER_AS
        //    }
        //  }
        //})
        .state(USER.ADMIN_MANAGECUSTOMER_CONTACTS_STATE, {
          url: USER.ADMIN_MANAGECUSTOMER_CONTACTS_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.Contacts.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGECUSTOMER_VIEW,
              controller: USER.ADMIN_MANAGECUSTOMER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(USER.ADMIN_MANAGECUSTOMER_OTHER_DETAIL_STATE, {
          url: USER.ADMIN_MANAGECUSTOMER_OTHER_DETAIL_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.OtherDetail.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGECUSTOMER_VIEW,
              controller: USER.ADMIN_MANAGECUSTOMER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(USER.ADMIN_MANAGECUSTOMER_PERSONNEL_MAPPING_STATE, {
          url: USER.ADMIN_MANAGECUSTOMER_PERSONNEL_MAPPING_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.PersonnelMapping.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGECUSTOMER_VIEW,
              controller: USER.ADMIN_MANAGECUSTOMER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(USER.ADMIN_MANAGECUSTOMER_CPN_STATE, {
          url: USER.ADMIN_MANAGECUSTOMER_CPN_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.CPN.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGECUSTOMER_VIEW,
              controller: USER.ADMIN_MANAGECUSTOMER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(USER.ADMIN_MANAGECUSTOMER_LOA_STATE, {
          url: USER.ADMIN_MANAGECUSTOMER_LOA_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.LOA.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGECUSTOMER_VIEW,
              controller: USER.ADMIN_MANAGECUSTOMER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(USER.ADMIN_MANAGECUSTOMER_EMAIL_REPORT_SETTING_STATE, {
          url: USER.ADMIN_MANAGECUSTOMER_EMAIL_REPORT_SETTING_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.EmailReportSetting.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGECUSTOMER_VIEW,
              controller: USER.ADMIN_MANAGECUSTOMER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(USER.ADMIN_MANAGECUSTOMER_INVENTORY_STATE, {
          url: USER.ADMIN_MANAGECUSTOMER_INVENTORY_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.Inventory.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGECUSTOMER_VIEW,
              controller: USER.ADMIN_MANAGECUSTOMER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        }).state(USER.ADMIN_MANAGECUSTOMER_DOCUMENTS_STATE, {
          url: USER.ADMIN_MANAGECUSTOMER_DOCUMENTS_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.Documents.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGECUSTOMER_VIEW,
              controller: USER.ADMIN_MANAGECUSTOMER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        }).state(USER.ADMIN_MANAGECUSTOMER_COMMENT_STATE, {
          url: USER.ADMIN_MANAGECUSTOMER_COMMENT_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.Comments.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGECUSTOMER_VIEW,
              controller: USER.ADMIN_MANAGECUSTOMER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        }).state(USER.ADMIN_MANAGECUSTOMER_HISTORY_STATE, {
          url: USER.ADMIN_MANAGECUSTOMER_HISTORY_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.History.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGECUSTOMER_VIEW,
              controller: USER.ADMIN_MANAGECUSTOMER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        });
      $stateProvider.state(USER.ADMIN_MANAGESUPPLIER_STATE, {
        url: USER.ADMIN_MANAGESUPPLIER_ROUTE,
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGESUPPLIER_VIEW,
            controller: USER.ADMIN_MANAGESUPPLIER_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
        .state(USER.ADMIN_MANAGESUPPLIER_DETAIL_STATE, {
          url: USER.ADMIN_MANAGESUPPLIER_DETAIL_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.Detail.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGESUPPLIER_VIEW,
              controller: USER.ADMIN_MANAGESUPPLIER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(USER.ADMIN_MANAGESUPPLIER_ADDRESSES_STATE, {
          url: USER.ADMIN_MANAGESUPPLIER_ADDRESSES_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.Addresses.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGESUPPLIER_VIEW,
              controller: USER.ADMIN_MANAGESUPPLIER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(USER.ADMIN_MANAGESUPPLIER_WIRE_TRANSFER_ADDRESSES_STATE, {
          url: USER.ADMIN_MANAGESUPPLIER_WIRE_TRANSFER_ADDRESSES_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.WireTransferAddresses.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGESUPPLIER_VIEW,
              controller: USER.ADMIN_MANAGESUPPLIER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(USER.ADMIN_MANAGESUPPLIER_AUTOMATION_ADDRESSES_STATE, {
          url: USER.ADMIN_MANAGESUPPLIER_AUTOMATION_ADDRESSES_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.AutomationAddresses.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGESUPPLIER_VIEW,
              controller: USER.ADMIN_MANAGESUPPLIER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        //.state(USER.ADMIN_MANAGESUPPLIER_BILLING_ADDRESS_STATE, {
        //  url: USER.ADMIN_MANAGESUPPLIER_BILLING_ADDRESS_ROUTE,
        //  params: {
        //    selectedTab: USER.CustomerTabs.BilingAddress.Name
        //  },
        //  views: {
        //    'content@app': {
        //      templateUrl: USER.ADMIN_MANAGESUPPLIER_VIEW,
        //      controller: USER.ADMIN_MANAGESUPPLIER_CONTROLLER,
        //      controllerAs: CORE.CONTROLLER_AS
        //    }
        //  }
        //})
        //.state(USER.ADMIN_MANAGESUPPLIER_SHIPPING_ADDRESS_STATE, {
        //  url: USER.ADMIN_MANAGESUPPLIER_SHIPPING_ADDRESS_ROUTE,
        //  params: {
        //    selectedTab: USER.CustomerTabs.ShippingAddress.Name
        //  },
        //  views: {
        //    'content@app': {
        //      templateUrl: USER.ADMIN_MANAGESUPPLIER_VIEW,
        //      controller: USER.ADMIN_MANAGESUPPLIER_CONTROLLER,
        //      controllerAs: CORE.CONTROLLER_AS
        //    }
        //  }
        //})
        //.state(USER.ADMIN_MANAGESUPPLIER_RMASHIPPING_ADDRESS_STATE, {
        //  url: USER.ADMIN_MANAGESUPPLIER_RMASHIPPING_ADDRESS_ROUTE,
        //  params: {
        //    selectedTab: USER.CustomerTabs.RMAShippingAddress.Name
        //  },
        //  views: {
        //    'content@app': {
        //      templateUrl: USER.ADMIN_MANAGESUPPLIER_VIEW,
        //      controller: USER.ADMIN_MANAGESUPPLIER_CONTROLLER,
        //      controllerAs: CORE.CONTROLLER_AS
        //    }
        //  }
        //})
        .state(USER.ADMIN_MANAGESUPPLIER_CONTACTS_STATE, {
          url: USER.ADMIN_MANAGESUPPLIER_CONTACTS_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.Contacts.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGESUPPLIER_VIEW,
              controller: USER.ADMIN_MANAGESUPPLIER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(USER.ADMIN_MANAGESUPPLIER_OTHER_DETAIL_STATE, {
          url: USER.ADMIN_MANAGESUPPLIER_OTHER_DETAIL_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.OtherDetail.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGESUPPLIER_VIEW,
              controller: USER.ADMIN_MANAGESUPPLIER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        }).state(USER.ADMIN_MANAGESUPPLIER_STANDARDS_STATE, {
            url: USER.ADMIN_MANAGESUPPLIER_STANDARDS_ROUTE,
            params: {
                selectedTab: USER.CustomerTabs.Standards.Name
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANAGESUPPLIER_VIEW,
                    controller: USER.ADMIN_MANAGESUPPLIER_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        }).state(USER.ADMIN_MANAGESUPPLIER_CUSTOM_COMPONENT_APPROVED_DISAPPROVED_DETAIL_STATE, {
          url: USER.ADMIN_MANAGESUPPLIER_CUSTOM_COMPONENT_APPROVED_DISAPPROVED_DETAIL_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.CustomComponentApprovedDisapprovedDetail.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGESUPPLIER_VIEW,
              controller: USER.ADMIN_MANAGESUPPLIER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        //.state(USER.ADMIN_MANAGESUPPLIER_REMIT_TO_STATE, {
        //  url: USER.ADMIN_MANAGESUPPLIER_REMIT_TO_ROUTE,
        //  params: {
        //    selectedTab: USER.CustomerTabs.RemitTo.Name
        //  },
        //  views: {
        //    'content@app': {
        //      templateUrl: USER.ADMIN_MANAGESUPPLIER_VIEW,
        //      controller: USER.ADMIN_MANAGESUPPLIER_CONTROLLER,
        //      controllerAs: CORE.CONTROLLER_AS
        //    }
        //  }
        //})
        .state(USER.ADMIN_MANAGESUPPLIER_DOCUMENTS_STATE, {
          url: USER.ADMIN_MANAGESUPPLIER_DOCUMENTS_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.Documents.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGESUPPLIER_VIEW,
              controller: USER.ADMIN_MANAGESUPPLIER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        }).state(USER.ADMIN_MANAGESUPPLIER_COMMENT_STATE, {
          url: USER.ADMIN_MANAGESUPPLIER_COMMENT_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.Comments.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGESUPPLIER_VIEW,
              controller: USER.ADMIN_MANAGESUPPLIER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        }).state(USER.ADMIN_MANAGESUPPLIER_HISTORY_STATE, {
          url: USER.ADMIN_MANAGESUPPLIER_HISTORY_ROUTE,
          params: {
            selectedTab: USER.CustomerTabs.History.Name
          },
          views: {
            'content@app': {
              templateUrl: USER.ADMIN_MANAGESUPPLIER_VIEW,
              controller: USER.ADMIN_MANAGESUPPLIER_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        });

        $stateProvider.state(USER.ADMIN_MANAGEMANUFACTURER_STATE, {
            url: USER.ADMIN_MANAGEMANUFACTURER_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANAGEMANUFACTURER_VIEW,
                    controller: USER.ADMIN_MANAGEMANUFACTURER_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        })
          .state(USER.ADMIN_MANAGEMANUFACTURER_DETAIL_STATE, {
            url: USER.ADMIN_MANAGEMANUFACTURER_DETAIL_ROUTE,
            params: {
              selectedTab: USER.CustomerTabs.Detail.Name
            },
            views: {
              'content@app': {
                templateUrl: USER.ADMIN_MANAGEMANUFACTURER_VIEW,
                controller: USER.ADMIN_MANAGEMANUFACTURER_CONTROLLER,
                controllerAs: CORE.CONTROLLER_AS
              }
            }
          })
          .state(USER.ADMIN_MANAGEMANUFACTURER_ADDRESSES_STATE, {
            url: USER.ADMIN_MANAGEMANUFACTURER_ADDRESSES_ROUTE,
            params: {
              selectedTab: USER.CustomerTabs.Addresses.Name
            },
            views: {
              'content@app': {
                templateUrl: USER.ADMIN_MANAGEMANUFACTURER_VIEW,
                controller: USER.ADMIN_MANAGEMANUFACTURER_CONTROLLER,
                controllerAs: CORE.CONTROLLER_AS
              }
            }
          })
          .state(USER.ADMIN_MANAGEMANUFACTURER_AUTOMATION_ADDRESSES_STATE, {
            url: USER.ADMIN_MANAGEMANUFACTURER_AUTOMATION_ADDRESSES_ROUTE,
            params: {
              selectedTab: USER.CustomerTabs.AutomationAddresses.Name
            },
            views: {
              'content@app': {
                templateUrl: USER.ADMIN_MANAGEMANUFACTURER_VIEW,
                controller: USER.ADMIN_MANAGEMANUFACTURER_CONTROLLER,
                controllerAs: CORE.CONTROLLER_AS
              }
            }
          })
          //.state(USER.ADMIN_MANAGEMANUFACTURER_BILLING_ADDRESS_STATE, {
          //  url: USER.ADMIN_MANAGEMANUFACTURER_BILLING_ADDRESS_ROUTE,
          //  params: {
          //    selectedTab: USER.CustomerTabs.BilingAddress.Name
          //  },
          //  views: {
          //    'content@app': {
          //      templateUrl: USER.ADMIN_MANAGEMANUFACTURER_VIEW,
          //      controller: USER.ADMIN_MANAGEMANUFACTURER_CONTROLLER,
          //      controllerAs: CORE.CONTROLLER_AS
          //    }
          //  }
          //})
          //.state(USER.ADMIN_MANAGEMANUFACTURER_SHIPPING_ADDRESS_STATE, {
          //  url: USER.ADMIN_MANAGEMANUFACTURER_SHIPPING_ADDRESS_ROUTE,
          //  params: {
          //    selectedTab: USER.CustomerTabs.ShippingAddress.Name
          //  },
          //  views: {
          //    'content@app': {
          //      templateUrl: USER.ADMIN_MANAGEMANUFACTURER_VIEW,
          //      controller: USER.ADMIN_MANAGEMANUFACTURER_CONTROLLER,
          //      controllerAs: CORE.CONTROLLER_AS
          //    }
          //  }
          //})
          //.state(USER.ADMIN_MANAGEMANUFACTURER_RMASHIPPING_ADDRESS_STATE, {
          //  url: USER.ADMIN_MANAGEMANUFACTURER_RMASHIPPING_ADDRESS_ROUTE,
          //  params: {
          //    selectedTab: USER.CustomerTabs.RMAShippingAddress.Name
          //  },
          //  views: {
          //    'content@app': {
          //      templateUrl: USER.ADMIN_MANAGEMANUFACTURER_VIEW,
          //      controller: USER.ADMIN_MANAGEMANUFACTURER_CONTROLLER,
          //      controllerAs: CORE.CONTROLLER_AS
          //    }
          //  }
          //})
          .state(USER.ADMIN_MANAGEMANUFACTURER_CONTACTS_STATE, {
            url: USER.ADMIN_MANAGEMANUFACTURER_CONTACTS_ROUTE,
            params: {
              selectedTab: USER.CustomerTabs.Contacts.Name
            },
            views: {
              'content@app': {
                templateUrl: USER.ADMIN_MANAGEMANUFACTURER_VIEW,
                controller: USER.ADMIN_MANAGEMANUFACTURER_CONTROLLER,
                controllerAs: CORE.CONTROLLER_AS
              }
            }
          })
          .state(USER.ADMIN_MANAGEMANUFACTURER_EMAIL_REPORT_SETTING_STATE, {
            url: USER.ADMIN_MANAGEMANUFACTURER_EMAIL_REPORT_SETTING_ROUTE,
            params: {
              selectedTab: USER.CustomerTabs.EmailReportSetting.Name
            },
            views: {
              'content@app': {
                templateUrl: USER.ADMIN_MANAGEMANUFACTURER_VIEW,
                controller: USER.ADMIN_MANAGEMANUFACTURER_CONTROLLER,
                controllerAs: CORE.CONTROLLER_AS
              }
            }
          })
          .state(USER.ADMIN_MANAGEMANUFACTURER_DOCUMENTS_STATE, {
            url: USER.ADMIN_MANAGEMANUFACTURER_DOCUMENTS_ROUTE,
            params: {
              selectedTab: USER.CustomerTabs.Documents.Name
            },
            views: {
              'content@app': {
                templateUrl: USER.ADMIN_MANAGEMANUFACTURER_VIEW,
                controller: USER.ADMIN_MANAGEMANUFACTURER_CONTROLLER,
                controllerAs: CORE.CONTROLLER_AS
              }
            }
          })
          .state(USER.ADMIN_MANAGECUSTOMERMFR_DOCUMENTS_STATE, {
            url: USER.ADMIN_MANAGECUSTOMERMFR_DOCUMENTS_ROUTE,
            params: {
              selectedTab: USER.CustomerTabs.ManufacturerDocuments.Name
            },
            views: {
              'content@app': {
                templateUrl: USER.ADMIN_MANAGEMANUFACTURER_VIEW,
                controller: USER.ADMIN_MANAGEMANUFACTURER_CONTROLLER,
                controllerAs: CORE.CONTROLLER_AS
              }
            }
          })
          .state(USER.ADMIN_MANAGEMANUFACTURER_OTHER_DETAIL_STATE, {
            url: USER.ADMIN_MANAGEMANUFACTURER_OTHER_DETAIL_ROUTE,
            params: {
              selectedTab: USER.CustomerTabs.OtherDetail.Name
            },
            views: {
              'content@app': {
                templateUrl: USER.ADMIN_MANAGEMANUFACTURER_VIEW,
                controller: USER.ADMIN_MANAGEMANUFACTURER_CONTROLLER,
                controllerAs: CORE.CONTROLLER_AS
              }
            }
          }).state(USER.ADMIN_MANAGEMANUFACTURER_HISTORY_STATE, {
            url: USER.ADMIN_MANAGEMANUFACTURER_HISTORY_ROUTE,
            params: {
              selectedTab: USER.CustomerTabs.History.Name
            },
            views: {
              'content@app': {
                templateUrl: USER.ADMIN_MANAGEMANUFACTURER_VIEW,
                controller: USER.ADMIN_MANAGEMANUFACTURER_CONTROLLER,
                controllerAs: CORE.CONTROLLER_AS
              }
            }
          }).state(USER.ADMIN_CPN_PARTS_STATE, {
            url: USER.ADMIN_CPN_PARTS_ROUTE,
            views: {
              'content@app': {
                templateUrl: USER.ADMIN_CPN_PARTS_VIEW,
                controller: USER.ADMIN_CPN_PARTS_CONTROLLER,
                controllerAs: CORE.CONTROLLER_AS
              }
            },
            resolve: {
            }
          });
    }
})();
