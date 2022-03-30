//(function () {
//    'use strict';

//    angular.module('app.core').directive('pasteImage', ['$timeout',
//    function ($timeout) {
//        return {
//            restrict: 'A',
//            replace: true,
//            scope: {
               
//            },
//            controller: ($scope, $element, $attrs) => {
//                $element.bind('paste', (event) => {
//                    let clipboardData = (event.originalEvent || event).clipboardData;
//                    if (clipboardData.files.length > 0) {
//                        _.each(clipboardData.files, (objFile, index) => {
//                            clipboardData.files[index] = new File([objFile], 'name.png', { type: 'image/png' });
//                        });
//                    }
//                });
//            }
//        }
//    }])
//})();