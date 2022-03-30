(function () {
    'use strict';
    angular.module('app.core').factory('socketConnectionService', function (socketFactory, store) {
        let logInUser = getLocalStorageValue('loginuser') || {};
        let userID = logInUser.userid;
        let employeeID = logInUser.employee ? logInUser.employee.id : null;
        
        return socketFactory({
            prefix: '',
            ioSocket: io.connect(stringFormat("{0}?uid={1}&eid={2}", SOCKET_PATH, userID, employeeID), { 'transports': ['websocket'] })
        });
    });
})();