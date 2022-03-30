(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('weekCalculator', weekCalculator);

  /** @ngInject */
  function weekCalculator(CORE, uibDateParser, BaseService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/custom/week-calculator/week-calculator.html',
      controllerAs: 'wcvm',
      controller: ['$scope', function ($scope) {
        var wcvm = this;
        var currentDate = new Date();
        var days = CORE.Day;
        wcvm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;

        wcvm.dateDisplayWeekYearFormat = 'wwyy';
        wcvm.dateDisplayYearWeekFormat = 'yyww';
        wcvm.dateDisplayMonthYearFormat = 'MMyy';
        wcvm.dateDisplayYearMonthFormat = 'yyMM';
        wcvm.dateDisplayFormat = _dateDisplayFormat;

        $scope.$on('$mdMenuClose', () => {
          wcvm.CustomDateOption.isCustomDateOpenFlag = false;
        });
        $scope.$on('$mdMenuOpen', () => {
          setFocusByName('customDate');
        });

        wcvm.weekYear = currentDate;
        wcvm.customDate = currentDate;
        formatedDateAndWeek();
        wcvm.CustomDateOption = {
          isCustomDateOpenFlag: false
        };

        function getStartDate(dateDetail) {
          if (dateDetail.getDay() === 0) {
            return dateDetail;
          } else {
            var dateDetail = moment(dateDetail).add(-1, 'days').toDate();
            return getStartDate(dateDetail);
          }
        }
        function getEndDate(dateDetail) {
          if (dateDetail.getDay() === 6) {
            return dateDetail;
          } else {
            var dateDetail = moment(dateDetail).add(1, 'days').toDate();
            return getEndDate(dateDetail);
          }
        }

        wcvm.openDateSelector = ($event) => {
          $event.preventDefault();
          $event.stopPropagation();
          wcvm.CustomDateOption.isCustomDateOpenFlag = true;
        };
        wcvm.customDateChanged = () => {
          wcvm.CustomDateOption = {
            isCustomDateOpenFlag: false
          };
          formatedDateAndWeek();
        };
        wcvm.focusPreviousElement = (event) => {
          if (event.shiftKey) {
            event.stopImmediatePropagation();
            event.preventDefault();
            setFocusByName('julianDate');
          }
        };
        wcvm.changeJulianNumber = () => {
          if (wcvm.customJulianNumber) {
            julianNumberToCalDate(wcvm.customJulianNumber);
          }
          formatedDateAndWeek();
        };

        wcvm.onEnterConvertValue = (event) => {
          if ((!event || event.keyCode === 13)) {
            wcvm.changeJulianNumber();
          }
        };
        wcvm.onEnterConvertDate = (event) => {
          if ((!event || event.keyCode === 13)) {
            wcvm.changeJulianDate();
          }
          let isPressShift = false;
          if (event.shiftKey) {
            isPressShift = true;
          }
          if ((!event || event.keyCode === 9) && !isPressShift) {
            event.stopImmediatePropagation();
            event.preventDefault();
            setFocusByName('customDate');
          }
        };
        wcvm.changeJulianDate = () => {
          if (wcvm.customJulianDate) {
            julianDateToCalDate();
          }
          formatedDateAndWeek();
        };
        wcvm.getMinNumberValueValidation = (minValue) => BaseService.getMinNumberValueValidation(minValue);
        wcvm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
        wcvm.getMinLengthValidation = (minLength, enterTextLength) => BaseService.getMinLengthValidation(minLength, enterTextLength);

        function julianNumberToCalDate(jd) {
          var j1, j2, j3, j4, j5;               //scratch

          //
          // get the date from the Julian day number
          //
          var intgr = Math.floor(jd);
          var gregjd = 2299161;
          let tempCorrectionVal = 0;
          if (intgr >= gregjd) {                    //Gregorian calendar correction
            tempCorrectionVal = Math.floor(((intgr - 1867216) - 0.25) / 36524.25);
            j1 = intgr + 1 + tempCorrectionVal - Math.floor(0.25 * tempCorrectionVal);
          } else {
            j1 = intgr;
          }

          j2 = j1 + 1524;
          j3 = Math.floor(6680.0 + ((j2 - 2439870) - 122.1) / 365.25);
          j4 = Math.floor(j3 * 365.25);
          j5 = Math.floor((j2 - j4) / 30.6001);

          const day = Math.floor(j2 - j4 - Math.floor(j5 * 30.6001));
          let month = Math.floor(j5 - 1);
          if (month > 12) {
            month -= 12;
          }
          let year = Math.floor(j3 - 4715);
          if (month > 2) {
            --year;
          }
          if (year <= 0) {
            --year;
          }
          const data = new Date(year, month - 1, day, 12, 0, 0);
          wcvm.customDate = data;
        }

        function julianDateToCalDate() {
          // customJulianDate
          const getYear = wcvm.customJulianDate.substring(0, 2);
          const currentYear = (new Date()).getFullYear();
          const year = currentYear.toString().replace(/\d{2}$/, getYear);
          const getDay = wcvm.customJulianDate.substring(2);
          const customDate = new Date(year, 0, getDay, 12, 0, 0);
          wcvm.customDate = customDate;
        }

        function getJulianCalndarDate() {
          if (wcvm.customDate instanceof Date) {
            const year = (wcvm.customDate.getFullYear()).toString().slice(-2);
            const firstDate = new Date(wcvm.customDate.getFullYear(), 0, 1, 12, 0, 0);
            let caluclateDay = Math.round(Math.abs((firstDate - wcvm.customDate) / (24 * 60 * 60 * 1000)));
            caluclateDay = caluclateDay + 1;
            caluclateDay = caluclateDay.toString().padStart(3, 0);
            wcvm.customJulianDate = `${year}${caluclateDay}`;
            wcvm.julianDate = wcvm.customJulianDate;
          }
        }
        // Get Custom Date/Week/Day/(Start/End) Date base on Custom Date
        function formatedDateAndWeek() {
          if (wcvm.customDate instanceof Date) {
            wcvm.customDate.setHours(12, 0, 0, 0);
            const startDate = getStartDate(wcvm.customDate);
            const endDate = getEndDate(wcvm.customDate);
            wcvm.StartDate = startDate;
            wcvm.EndDate = endDate;
            wcvm.SelectedDate = wcvm.customDate;

            wcvm.customDateDay = (wcvm.customDate && (wcvm.customDate instanceof Date)) ? uibDateParser.filter(wcvm.customDate, 'EEEE') : '';
            wcvm.julianNumber = dateToJulianNumber(wcvm.customDate);
            wcvm.customJulianNumber = wcvm.julianNumber;
          }
          getJulianCalndarDate();
        }

        function dateToJulianNumber(dateDetail) {
          const julday = Math.floor((dateDetail.getTime() / 86400000) - (dateDetail.getTimezoneOffset() / 1440) + 2440587.5);
          return Math.round(julday);
        }
      }],
    }
  }
})();
