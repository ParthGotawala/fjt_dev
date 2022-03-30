(function () {
  'use strict';

  angular
    .module('app.core')
    .filter('toTrusted', toTrustedFilter)
    .filter('htmlToPlaintext', htmlToPlainTextFilter)
    .filter('nospace', nospaceFilter)
    .filter('mask', maskFilter)
    .filter('threeDecimal', threeDecmialFilter)
    .filter('twoDecimalDisplayOrder', twoDecmialFilter)
    .filter('fiveDecimalDisplayOrder', fiveDecmialFilter)
    .filter('humanizeDoc', humanizeDocFilter)
    .filter('amount', amountFilter)
    .filter('numberWithoutDecimal', numberWithoutDecimalFilter)
    .filter('unitPrice', unitPriceFilter)
    .filter('unit', unitFilter)
    .filter('convertSecondsToTime', convertSecondsToTimeFilter)
    .filter('mathFloor', mathFloorFilter);


  /** @ngInject */
  function toTrustedFilter($sce) {
    return function (value) {
      return $sce.trustAsHtml(value);
    };
  }

  /** @ngInject */
  function htmlToPlainTextFilter() {
    return function (text) {
      return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
  }

  /** @ngInject */
  function nospaceFilter() {
    return function (value) {
      return (!value) ? '' : value.replace(/ /g, '');
    };
  }


  /** @ngInject */
  function maskFilter(MaskService) {
    return function (text, mask) {
      if (text) {
        var maskService = MaskService.create();
        maskService.generateRegex({ mask: mask });
        return maskService.getViewValue(text).withDivisors();
      }
      else {
        return "";
      }
    };
  }

  /** @ngInject */
  function humanizeDocFilter() {
    return function (doc) {
      if (!doc) {
        return;
      }
      if (doc.type === 'directive') {
        return doc.name.replace(/([A-Z])/g, function ($1) {
          return '-' + $1.toLowerCase();
        });
      }
      return doc.label || doc.name;
    };
  }

  function threeDecmialFilter(BaseService) {
    return function (number) {
      if (number) {
        return BaseService.convertThreeDecimal(number);
      }
      else {
        return BaseService.convertThreeDecimal(0);
      }
    }
  }

  function twoDecmialFilter() {
    return function (floatNum) {
      return floatNum ? String(floatNum.toFixed('2'))
        .split('.')
        .map((d, i) => i ? d.substr(0, 2) : d)
        .join('.') : floatNum;
    };
  };

  function fiveDecmialFilter() {
    return function (floatNum) {
      return floatNum ? parseFloat(String(floatNum.toFixed('5'))) : floatNum;
    };
  };

  // need to check and merge with below one
  function amountFilter($filter) {
    return function (value) {
      if (value > 0) {
        return $filter('currency')(value);
      }
      else if (value < 0) {
        return `(${$filter('currency')(-1 * value)})`;
      }
      else {
        return $filter('currency')(value || 0);
      }
    };
  }

  // e.g. for qty 1,000
  function numberWithoutDecimalFilter($filter) {
    return function (value) {
      if (!isNaN(value)) {
        if (value > 0) {
          return $filter('number')(value, _numberFilterDecimal);
        }
        else if (value < 0) {
          return `(${$filter('number')((-1 * value), _numberFilterDecimal)})`;
        }
        else {
          return $filter('number')(value || 0, _numberFilterDecimal);
        }
      } else {
        return value;
      }
    };
  }

  // price with currency symbol and 5 decimal digits
  function unitPriceFilter($filter) {
    var currencySymbol = '$';
    return function (value) {
      if (value > 0) {
        return `${currencySymbol}${$filter('number')(value, _unitPriceFilterDecimal)}`;
      }
      else if (value < 0) {
        return `(${currencySymbol}${$filter('number')((-1 * value), _unitPriceFilterDecimal)})`;
      }
      else {
        return `${currencySymbol}0`;
      }
    };
  }

  // unit(uom) with 4 decimal digits
  function unitFilter($filter) {
    return function (value) {
      if (value > 0) {
        return `${$filter('number')(value, _unitFilterDecimal)}`;
      }
      else if (value < 0) {
        return `(${$filter('number')((-1 * value), _unitFilterDecimal)})`;
      }
      else {
        return `0`;
      }
    };
  }

  function mathFloorFilter() {
    return function (value) {
      if (!isNaN(value)) {
        return Math.floor(value);
      } else {
        return value;
      }
    };
  }

  function convertSecondsToTimeFilter() {
    return function (value) {
      return convertDisplayTime(value);
    };
  }


})();
