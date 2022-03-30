/** @ngInject */
(function () {
    'use strict';
    angular.module('app.core').directive('intlTelInput', function ($timeout, CORE) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                intlCountry: '=',
                phoneNumberNote: '=?',
            },
            link: function (scope, element, attrs, ngModel) {
                var elemParent = element.parent();

                scope.$watch('intlCountry', function (newVal, oldVal) {

                    if (newVal && newVal !== oldVal)
                        element.intlTelInput("setCountry", newVal);

                    if (!newVal && !oldVal)
                        scope.intlCountry = 'US';
                });

                function bindIntlTel() {

                    element.intlTelInput({
                        separateDialCode: true,
                        initialCountry: 'US',
                        preferredCountries: ['US', 'CA'],
                        nationalMode: false,
                        customPlaceholder: function (selectedCountryPlaceholder, selectedCountryData) {
                            scope.phoneNumberNote = selectedCountryPlaceholder;
                            return selectedCountryPlaceholder;
                        }
                    });

                    element.on("keyup", function (e) {
                        if (ngModel.$modelValue) {
                            let contactCountryData = element.intlTelInput("getSelectedCountryData");
                            if (contactCountryData && !_.isEmpty(contactCountryData) && ngModel.$modelValue.startsWith("+" + contactCountryData.dialCode)) {
                                ngModel.$setViewValue((ngModel.$modelValue.replace("+" + contactCountryData.dialCode, '')).trim());
                                ngModel.$render();
                            }
                        }
                        $timeout(function () {
                            var caret = e.target.selectionStart;

                            var isLast = true;
                            if (ngModel.$modelValue)
                                isLast = (caret == ngModel.$modelValue.length);

                            if (e.shiftKey || e.ctrlKey || e.altKey || CORE.SpecialKeys.indexOf(e.keyCode) != -1) {
                                setValidity();
                                return;
                            }

                            setValidity();

                            if (ngModel.$modelValue) {
                                var formatedNumber = getFormatedIntlTelNumber();
                                if (formatedNumber.includes('undefined')) {
                                    formatedNumber = ngModel.$modelValue;
                                }
                                ngModel.$setViewValue(formatedNumber);
                                //ngModel.$setViewValue(ngModel.$modelValue);
                                ngModel.$render();
                            }

                            if (!isLast)
                                e.target.setSelectionRange(caret, caret);
                        });
                    });

                    element.on("countrychange", function (e, countryData) {
                        if (ngModel.$modelValue) {
                            var formatedNumber = getFormatedIntlTelNumber();
                            if (formatedNumber.includes('undefined')) {
                                formatedNumber = ngModel.$modelValue;
                            }
                            let contactCountryData = element.intlTelInput("getSelectedCountryData");
                            if (contactCountryData && !_.isEmpty(contactCountryData) && formatedNumber.startsWith("+" + contactCountryData.dialCode)) {
                                formatedNumber = (ngModel.$modelValue.replace("+" + contactCountryData.dialCode, '')).trim();
                            }
                            ngModel.$setViewValue(formatedNumber);
                            ngModel.$render();
                        }

                        if (countryData.iso2)
                            scope.intlCountry = countryData.iso2.toUpperCase();
                        else
                            scope.intlCountry = null;

                        scope.$applyAsync();

                        setValidity();
                    });
                }

                function getFormatedIntlTelNumber() {
                    var num = element.intlTelInput("getNumber", 2);
                    var iso2 = element.intlTelInput("getSelectedCountryData").iso2;
                    var format = intlTelInputUtils.numberFormat.INTERNATIONAL;
                    var formatedNumber = intlTelInputUtils.formatNumber(num, iso2, format);
                    if (formatedNumber) {
                        let contactCountryData = element.intlTelInput("getSelectedCountryData");
                        if (contactCountryData && !_.isEmpty(contactCountryData) && formatedNumber.startsWith("+" + contactCountryData.dialCode)) {
                            formatedNumber = ((formatedNumber.replace("+" + contactCountryData.dialCode, '')).trim());
                        }
                    }
                    return formatedNumber;
                }

                function setValidity() {
                    if (!ngModel.$modelValue) {
                        ngModel.$modelValue = null;
                        ngModel.$setValidity('intltel', true);
                    }
                    else {
                        var isValid = element.intlTelInput("isValidNumber");
                        ngModel.$setValidity('intltel', isValid);
                    }
                }

                window.setTimeout(bindIntlTel);
            }
        };
    })
})();