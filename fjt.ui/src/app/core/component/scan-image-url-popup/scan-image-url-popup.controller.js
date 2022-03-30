(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('ScanImageURLPopupController', ScanImageURLPopupController);

    /** @ngInject */
    function ScanImageURLPopupController($scope, $q,$http, $timeout, $stateParams, $mdDialog, data, CORE, TRANSACTION, DialogFactory, BaseService) {
        const vm = this;

        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        var loginUser = BaseService.loginUser;
        vm.scanlabel = {};
        vm.cancel = () => {
            let isdirty = vm.checkFormDirty(vm.AddMfgCodeForm);
            if (isdirty || vm.checkDirty) {
                BaseService.showWithoutSavingAlertForPopUp();
            } else {
                $mdDialog.cancel();
            }
        };
        vm.checkFormDirty = (form, columnName) => {
            let checkDirty = BaseService.checkFormDirty(form, columnName);
            return checkDirty;
        }
        function toDataURL(url, callback) {
            var httpRequest = new XMLHttpRequest();
            httpRequest.onload = function () {
                var fileReader = new FileReader();
                fileReader.onloadend = function () {
                    callback(fileReader.result);
                }
                fileReader.readAsDataURL(httpRequest.response);
            };
            httpRequest.open('GET', url);
            httpRequest.responseType = 'blob';
            httpRequest.send();
        }
        vm.checkImage=()=> {
            toDataURL('https://www.tutorialspoint.com/videotutorials/images/tutor_connect_home.jpg', function (dataUrl) {
                document.write('Result in string:', dataUrl);
            });
        }

       
        //vm.checkImage = (event) => {
        //    $http({
        //        method: 'GET',
        //        url: vm.scanlabel.url,
        //        responseType: 'arraybuffer'
        //    }).then(function (response) {
        //        console.log(response);
        //        var str = _arrayBufferToBase64(response.data);
        //        console.log(str);
        //        // str is base64 encoded.
        //    }, function (response) {
        //        console.error('error in getting static img.');
        //    });
        //}
    }
})();