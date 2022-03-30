function onlyAlphabets(e, t) {
  try {
    if (window.event) {
      var charCode = window.event.keyCode;
    }
    else if (e) {
      var charCode = e.which;
    }
    else { return true; }
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123))
      return true;
    else
      return false;
  }
  catch (err) {
    alert(err.Description);
  }
}

function formatBytes(bytes, decimals) {
  if (bytes == 0) return '0 Bytes';
  var k = 1024,
    dm = decimals || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
// format string
// use: stringFormat("{0} is {1}","a","b") , result : a is b
function stringFormat() {
  var str = arguments[0];
  for (var i = 1; i < arguments.length; i++) {
    var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
    str = str.replace(regEx, arguments[i]);
  }
  return str;
}

// IfNull
function IfNull(val, returnVal) {
  return val ? val : returnVal;
}
function TorestrictDigit(e, num) {
  if (!OnlyNumeric(e)) {
    e.value = '';
    return false;
  }
  if (num.length >= 4)
    e.preventDefault();
}
function OnlyNumeric(evt) {
  var charCode = (evt.which) ? evt.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57 && charCode != 9)) {
    evt.value = '';
    return false;
  }
  return true;
}

function OnlyNumbersWithDot(e, num) {
  var charCode;
  if (e.keyCode > 0) {
    charCode = e.which || e.keyCode;
  }
  else if (typeof (e.charCode) != "undefined") {
    charCode = e.which || e.keyCode;
  }
  if (!_.isUndefined(num)) {
    if (charCode == 46 && num.value.indexOf('.') != -1) {
      return false;
    }
    if (charCode == 46 && !num.value) {
      return false;
    }
  }
  if (charCode == 46)
    return true;
  if (charCode > 31 && (charCode < 48 || charCode > 57))
    return false;
  return true;
}
function OnlyNumbersWithFirstDot(e, num, type) {
  var charCode;
  if (type && type == 2) {
    if (e.keyCode > 0) {
      charCode = e.which || e.keyCode;
    }
    else if (typeof (e.charCode) != "undefined") {
      charCode = e.which || e.keyCode;
    }
    if (!_.isUndefined(num)) {
      if (charCode == 46 && num.value.indexOf('.') != -1) {
        return false;
      }
    }
    if (charCode == 46)
      return true;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    if (num.value.indexOf('.') != -1) {
      var numValue = num.value.split('.');
      if (numValue[1] && numValue[1].length > 2) {
        return false;
      }
    }
  }
  else {
    if (e.keyCode > 0) {
      charCode = e.which || e.keyCode;
    }
    else if (typeof (e.charCode) != "undefined") {
      charCode = e.which || e.keyCode;
    }
    if (!_.isUndefined(num)) {
      if (charCode == 46 && num.value.indexOf('.') != -1) {
        return false;
      }
    }
    if (charCode == 46)
      return true;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    if (num.value.indexOf('.') != -1) {
      var numValue = num.value.split('.');
      if (numValue[1] && numValue[1].length > 5) {
        return false;
      }
    }
  }
  return true;
}


function ToDecimalTwoDigit(num, isNoDefault) {
  if (!_.isEmpty(num.value) && !_.isUndefined(num.value)) {
    if (!isNoDefault) {
      if (parseFloat(num.value) < 10000) {
        num.value = parseFloat(num.value).toFixed("2").toString();
        return num;
      }
      else {
        num.value = 9999.99
        return num;
      }
    }
    else {
      if (!isNaN(parseFloat(num.value))) {
        num.value = parseFloat(num.value).toFixed("2").toString();
        return num;
      }
    }
  }
  else
    return num;
}

function ToDecimalFourDigit(num, isNoDefault, type) {
  if (type && type == 2) {
    if (!_.isEmpty(num.value) && !_.isUndefined(num.value)) {
      if (!isNoDefault) {
        if (parseFloat(num.value) <= 100) {
          num.value = parseFloat(num.value).toFixed("2").toString();
          return num;
        }
        else {
          num.value = "100.00";
          return num;
        }
      }
      else {
        if (!isNaN(parseFloat(num.value))) {
          num.value = parseFloat(num.value).toFixed("2").toString();
          return num;
        }
      }
    }
    else
      return num;
  }
  else {
    if (!_.isEmpty(num.value) && !_.isUndefined(num.value)) {
      if (!isNoDefault) {
        if (parseFloat(num.value) <= 100000) {
          num.value = parseFloat(num.value).toFixed("2").toString();
          return num;
        }
        else {
          num.value = "100000.00";
          return num;
        }
      }
      else {
        if (!isNaN(parseFloat(num.value))) {
          num.value = parseFloat(num.value).toFixed("2").toString();
          return num;
        }
      }
    }
    else
      return num;
  }
}

function openUrl(url) {
  if (_configOpenInNewTab) {
    window.open(url, '_blank');
  } else {
    window.open(WebsiteBaseUrl + "/" + url, "_blank", "top=10,left=10,resizable=1,scrollbars=1,status=1,titlebar=1,toolbar=1,width=" + (screen.width - 100) + ",height=" + (screen.height - 100));
  }
}

function redirectUrl(url) {
  url = url ? url : "";
  window.open(WebsiteBaseUrl + url, "_blank");
}

function redirectReportDesignerUrl(url) {
  url = url ? url : "";
  window.open(WebsiteBaseUrl + url, "_blank");
}

function ToDecimalDigit(num, isNoDefault) {
  if (!_.isEmpty(num.value) && !_.isUndefined(num.value)) {
    if (!isNoDefault) {
      if (parseFloat(num.value) <= 100000) {
        num.value = parseFloat(num.value).toFixed("2").toString();
        return num;
      }
      else {
        num.value = "100000.00";
        return num;
      }
    }
    else {
      if (!isNaN(parseFloat(num.value))) {
        num.value = parseFloat(num.value).toFixed("2").toString();
        return num;
      }
    }
  }
  else
    return num;
}

let adjustDateByTimezoneOffset = function (date, restore) {
  // Javascript Date object stores the local timezone offset.
  // On tranmission to the server the UTC date is sent. The server 
  // may not be timezone aware, and so this function facilitates
  // adjusting to a date which can then be sent to a .NET web application and
  // be recieved as a Date Time instance that equals the current (local) time on 
  // the client.

  if (date && (date instanceof Date)) {
    var timezoneOffsetMinutes = date.getTimezoneOffset();
    if (restore) timezoneOffsetMinutes *= -1;
    var setMinutes = date.getMinutes() - timezoneOffsetMinutes;
    date.setMinutes(setMinutes);
  }
  else {
    throw "Input variable must be Date";
  }
  return date;
}

function AvoidSpace(event) {
  var k = event ? event.which : window.event.keyCode;
  if (k == 32) return false;
}

function AvoidUnderscore(event) {
  var k = event ? event.which : window.event.keyCode;
  if (k == 95) return false;
}

function timeToSeconds(time) {
  var a = time.split(':'); // split it at the colons
  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60;
  if ((+a[2])) {
    seconds = seconds + (+a[2]);
  }
  return seconds;
}

function timeToMinite(time) {
  var seconds = timeToSeconds(time);
  var minites = seconds ? (seconds / 60) : 0;
  return minites;
}

function groupByMulti(obj, values) {
  if (!values.length)
    return obj;
  var byFirst = _.groupBy(obj, values[0]),
    rest = values.slice(1);
  for (var prop in byFirst) {
    byFirst[prop] = groupByMulti(byFirst[prop], rest);
  }
  return byFirst;
}
function secondsToTime(convertSeconds, isSecond) {
  let hours = Math.floor(convertSeconds / 3600);
  let minutes = Math.floor((convertSeconds % 3600) / 60);
  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (isSecond) {
    let seconds = Math.floor(convertSeconds % 60);
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ":" + minutes + ":" + seconds;
  } else {
    return hours + ":" + minutes;
  }
};
let SeparatorText = "";
function addSpace(event, text) {
  SeparatorText = text;
  return text;
}
function getCookie(name) {
  var re = new RegExp(name + "=([^;]+)");
  var value = re.exec(document.cookie);
  return (value != null) ? unescape(value[1]) : null;
}

function delete_cookie(cookieName) {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    if (name && cookieName) {
      name = name.trim();
      if (name == cookieName) {
        document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
  }
  //document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
function set_cookie(langCookieVal) {
  var origin = location.origin;
  //document.cookie = "googtrans=" + langCookieVal + ";path=/;domain=" + origin;
  document.cookie = "googtrans=" + langCookieVal + ", path=/, domain=" + origin;
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    if (name) {
      name = name.trim();
      if (name == "googtrans") {
        //document.cookie = "googtrans=" + langCookieVal + ";path=/;domain=" + origin;
        document.cookie = name + "=" + langCookieVal + ", path=/, domain=" + origin;
      }
    }
  }
  //var origin = location.origin;
  //document.cookie = "googtrans=" + langCookieVal + ";path=/;domain=" + origin;
  //document.cookie = "googtrans=" + langCookieVal + ", path=/, domain=" + origin;
  //document.cookie = "googtrans=" + langCookieVal;
}
function SetOrignialLangague() {
  var iframe = document.getElementsByClassName('goog-te-banner-frame')[0];
  if (!iframe) return;

  var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
  var restore_el = innerDoc.getElementsByTagName("button");

  for (var i = 0; i < restore_el.length; i++) {
    if (restore_el[i].id.indexOf("restore") >= 0) {
      restore_el[i].click();
      var close_el = innerDoc.getElementsByClassName("goog-close-link");
      close_el[0].click();
      return;
    }
  }
}
function prepandZero(number) {
  if (number < 10)
    return '0' + number;
  return number;
}
function prepandZeroWoNumber(number) {
  if (number < 10)
    return '000' + number;
  else if (number < 100)
    return '00' + number;
  else if (number < 1000)
    return '0' + number;
  return number;
}
function getLocalStorageValue(key) {
  return JSON.parse(localStorage.getItem(key));
}
function removeLocalStorageValue(key) {
  return localStorage.removeItem(key);
}
function setLocalStorageValue(key, object) {
  return localStorage.setItem(key, JSON.stringify(object));
}

function convertToThreeDecimal(number) {
  if (number != null && number != undefined) {
    number = number == "." ? 0 : number;
    var value = parseFloat(number);
    value = value.toFixed(3);
    return value;
  } else {
    return number;
  }
}

function operationDisplayFormat(displayformat, opname, opnumber) {
  return stringFormat(displayformat, opname, convertToThreeDecimal(opnumber));
}

function OnlyPositiveNegativeNumeric(evt) {
  var charCode = (evt.which) ? evt.which : event.keyCode;
  if (charCode > 31 && charCode != 45 && (charCode < 48 || charCode > 57 && charCode != 9)) {
    evt.value = '';
    return false;
  }
  return true;
}

function sortAlphabatically(orderByProperty, orderBySecondProperty, ascending) {
  return function (a, b) {
    if (a[orderByProperty] === b[orderByProperty]) {
      if (orderBySecondProperty) {
        return (a[orderBySecondProperty] < b[orderBySecondProperty]) ? -1 : (a[orderBySecondProperty] > b[orderBySecondProperty]) ? 1 : 0;
      } else {
        return 0;
      }
    }
    else if (a[orderByProperty] === null) {
      return 1;
    }
    else if (b[orderByProperty] === null) {
      return -1;
    }
    else if (ascending) {
      return a[orderByProperty] < b[orderByProperty] ? -1 : 1;
    }
    else if (!ascending) {
      return a[orderByProperty] < b[orderByProperty] ? 1 : -1;
    }
  }
}

function OnlyNumericWithPlus(evt) {
  var charCode = (evt.which) ? evt.which : event.keyCode;
  if (charCode > 31 && charCode != 43 && (charCode < 48 || charCode > 57 && charCode != 9)) {
    evt.value = '';
    return false;
  }
  return true;
}


function convertDisplayTime(time) {
  if (time == null)
    return time;
  if (time >= 0) {
    return secondsToTime(time);
  }
  else {
    return time;
  }
}

var getChar = (function () {

  // object to expose as public properties and methods such as clock.now
  var pub = {};
  var letterArray = [];

  //letters.increment('a')
  pub.increment = function (c) {
    letterArray = c.split("");

    if (isLetters(letterArray)) {
      return (next(c));
    } else {
      throw new Error('Letters Only');
    }
  };

  function isLetters(arr) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].toLowerCase() != arr[i].toUpperCase()) {
      } else {
        return false;
      }
    }
    return true;
  }

  function next(c) {
    var u = c.toUpperCase();
    if (same(u, 'Z')) {
      var txt = '';
      var i = u.length;
      while (i--) {
        txt += 'A';
      }
      return (txt + 'A');
    } else {
      var p = "";
      var q = "";
      if (u.length > 1) {
        p = u.substring(0, u.length - 1);
        q = String.fromCharCode(p.slice(-1).charCodeAt(0));
      }
      var l = u.slice(-1).charCodeAt(0);
      var z = nextLetter(l);
      if (z === 'A') {
        return p.slice(0, -1) + nextLetter(q.slice(-1).charCodeAt(0)) + z;
      } else {
        return p + z;
      }
    }
  }

  function nextLetter(l) {
    if (l < 90) {
      return String.fromCharCode(l + 1);
    }
    else {
      return 'A';
    }
  }

  function same(str, char) {
    var i = str.length;
    while (i--) {
      if (str[i] !== char) {
        return false;
      }
    }
    return true;
  }

  //API
  return pub;
}());

//Receiving material Units/Count
function convertUnitWithDecimalPlace(value) {
  return convertNumberWithDecimalPlace(value, _unitFilterDecimal);
}


//Unit price Units/Count
function convertUnitPriceWithDecimalPlace(value) {
  return convertNumberWithDecimalPlace(value, _unitPriceFilterDecimal);
}

//Amount
function convertAmountWithDecimalPlace(value) {
  return convertNumberWithDecimalPlace(value, _amountFilterDecimal);
}


function convertNumberWithDecimalPlace(value, decimalPlace) {
  if (isNaN(value)) {
    return 0;
  }
  return Number((value).toFixed(decimalPlace));
}

function setFocus(id) {
  setTimeout(() => {
    const element = angular.element(document.querySelector(`#${id}`));
    if (element) {
      if (element.prop('nodeName') === 'MD-CHECKBOX') {
        element.addClass('md-focused');
      }
      element.focus();
    }
  });
}

function setFocusByName(name) {
  setTimeout(() => {
    const element = angular.element(document.querySelector(`[name='${name}']`));
    if (element) {
      if (element.prop('nodeName') === 'MD-CHECKBOX') {
        element.addClass('md-focused');
      }
      element.focus();
    }
  });
}

function setFocusAndValueSelecte(id) {
  setTimeout(() => {
    let element = angular.element(document.querySelector(`#${id}`));
    if (element) {
      element.focus();
      element.select();
    }
  });
}
function padStringFormat(stringVal, numberOfPad, padString) {
  stringVal = typeof (stringVal) === 'string' ? stringVal : stringVal.toString();
  padString = typeof (padString) === 'number' ? padString : (padString) ? padString : '';
  return stringVal.padStart(numberOfPad, padString);
}

//Number.prototype.countDecimals = function () {
//    if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
//    if (this && this.toString() && this.toString().split(".").length > 1) {
//        if (this.toString().split(".")[1]) {
//            return this.toString().split(".")[1].length || 0;
//        }
//        return 0;
//    }
//    return 0;
//}
function countDecimals(value) {
  if (value && value.toString() && value.toString().split(".").length > 1) {
    if (value.toString().split(".")[1]) {
      return value.toString().split(".")[1].length || 0;
    }
    return 0;
  }
  return 0;
}

function getUnitConversion(fromUnit, toUnit, value) {
  if (fromUnit.id == toUnit.id) return value;

  if (fromUnit.isFormula) {
    var unitDetailFormula = _.find(fromUnit.unit_detail_formula, function (item) { return item.toUnitID == toUnit.id; });
    if (unitDetailFormula) {
      var formula = unitDetailFormula.formula.replace(/X/g, value);
      Number(formula);
      var result = eval(formula);
      return convertUnitWithDecimalPlace(result);
    }
  }
  else {
    var fromBasedUnitValues = fromUnit.baseUnitConvertValue;
    var toBasedUnitValues = toUnit.baseUnitConvertValue;
    var ConvertFromValueIntoBasedValue = (value / fromBasedUnitValues);
    var result = ConvertFromValueIntoBasedValue * toBasedUnitValues;
    if (isNaN(result)) {
      result = 0;
    }
    return convertUnitWithDecimalPlace(result);
  }
}

function encryptAES(text) {
  return CryptoJS.AES.encrypt(text, "fl!23net@%$$2!@#");
}
function copyTextForWindow(text) {
  var $temp = $("<textarea>");
  $("body").append($temp);
  $temp.val(text).select();
  document.execCommand("copy");
  $temp.remove();
}

function getPIDsFromString(mfgPN) {
  return _.map((mfgPN || '').split(','), (item) => { return (((item || '').split('@@@')[0] || '').replace('***', ',') || '').replace('..', ',') }).join(', ')
}

function date_diff_indays(date1, date2) {
  var dt1 = new Date(date1);
  var dt2 = new Date(date2);
  return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
}

function getGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function preventFormSubmit(isPopup) {
  angular.element(document).ready(function () {
    var btnRequired = isPopup ? $('md-dialog form').find('#btnRequireColValidation') : $('form').find('#btnRequireColValidation');
    if (btnRequired) {
      btnRequired.each((index, item) => {
        var formName = item.form.getAttribute('name');
        $(`form[name="${formName}"] input, form[name="${formName}"] md-checkbox`).keydown(function (e) {
          //if (["ScanLabel", "fromBinName", "currentBinName", "scanLabel", "trackingNumber", "ScanUID", "ScanWHBin", "uid", "scanMFGPNLabel", "scanPID", "scanCPN", "scanUID", "scanMFGPN", "umid", "feederLocation", "umidOld", "umidNew", "ScanWHBin"].indexOf(e.currentTarget.name) == -1 && e.keyCode == 13) {
          if (["ScanLabel", "fromBinName", "currentBinName", "scanLabel", "trackingNumber", "ScanUID", "ScanWHBin", "uid", "scanMFGPNLabel", "scanPID", "scanCPN", "scanUID", "scanMFGPN", "scanUMID", "packingSlipBinName", "scanWarehouse", "scanBin", "packingSlipNumber", "Samplereaddata", "searchScanUMID", "ScanVerifyUMID", "binName", "scanShelvinCartBin", 'customerpackingSlipNumber', 'searchMaterialString', 'internalRef', 'poscanLabel', 'rmaScanLabel', 'rmaScanPoNumber', 'memoScanLabel', 'transferBinName'].indexOf(e.currentTarget.name) == -1 && e.keyCode == 13) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        });
      });
    }
  });
}

function preventInputEnterKeyEvent(e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}

function convertUptoDecimalPlace(number, decimalPlace) {
  if (number != null && number != undefined && decimalPlace != null && decimalPlace != undefined) {
    return parseFloat((number).toFixed(decimalPlace));
  } else {
    return number;
  }
}

function OnlyNumericWithPlusAndMinus(evt) {
  var charCode = (evt.which) ? evt.which : event.keyCode;
  if (charCode > 31 && charCode != 43 && charCode != 45 && (charCode < 48 || charCode > 57 && charCode != 9)) {
    evt.value = '';
    return false;
  }
  return true;
}

var _inputControlTagName = {
  TextAngular: "TEXT-ANGULAR",
  MdRadioButton: "MD-RADIO-BUTTON",
  MdCheckBox: "MD-CHECKBOX",
  MdSelect: "MD-SELECT",
  Div: "DIV",
  Canvas: "CANVAS",
  MdRadioGroup: "MD-RADIO-GROUP",
  MdInputContainer: "MD-INPUT-CONTAINER"
};

var _inputControlType = [
  "md-switch",
  "input",
  "md-checkbox",
  "md-radio-button",
  "md-select",
  "md-button",
  "textarea"
];

/* set Focus on first enabled field in form */
function focusOnFirstEnabledFormField(form) {
  var formName = form.$name;
  if (!formName) {
    formName = form.attr('name');
  }
  var vMainSections = $('form[name="' + formName + '"]').find(".cm-section-main");
  if (vMainSections && vMainSections.length > 0) {
    var focusElement;
    for (var i = 0; i < vMainSections.length; i++) {
      focusElement = getFirstEnabledField(vMainSections[i]);
      if (focusElement) {
        break;
      }
    }
    if (focusElement) {
      if (focusElement.tagName == _inputControlTagName.TextAngular) {
        var editorScope = textAngularManager.retrieveEditor(focusElement.getAttribute('name')).scope;
        $timeout(function () {
          editorScope.displayElements.text.trigger('focus');
        });
      }
      else {
        focusElement.focus();
      }

      if (focusElement.tagName == _inputControlTagName.MdRadioButton) {
        focusElement.classList.add("md-focused");
        if (focusElement.parentElement) {
          focusElement.parentElement.classList.add("md-focused");
        }
      }
      else if (focusElement.tagName == _inputControlTagName.MdCheckBox) {
        focusElement.classList.add("md-focused");
      }
      else if (focusElement.tagName == _inputControlTagName.MdSelect) {
        angular.element(`[name="${focusElement.getAttribute('name')}"`).trigger('click')
      }
      else if (focusElement.tagName == _inputControlTagName.Div &&
        focusElement.children.length > 0 &&
        focusElement.children[0].tagName == _inputControlTagName.Canvas) {
        focusElement.children[0].style.border = "1px solid #ff0000";
        $('#content').animate({
          scrollTop: focusElement.displayOrderIndex
        }, 2000);
      }
    }
  }
}

/*this method will return first enabled element*
  * to be call internally from focusOnFirstEnabledField() only
  * @param {any} sectionObj
  */
function getFirstEnabledField(sectionObj) {
  if (sectionObj) {
    var elements = $(sectionObj).find(_inputControlType.toString());
    if (elements && elements.length > 0) {
      var enabledElement = _.filter(elements, (item) => {
        if (!item.disabled && $(item).attr('disabled') != 'disabled') {
          return item;
        }
      });
      return (enabledElement && enabledElement.length > 0) ? enabledElement[0] : null;
    }
    else {
      return null;
    }
  }
}

// convert date time format to gmail date time like format
function convertDateTimeFormatLikeGmail($filter, timezonewiseConvertedDate) {
  let dbDate = new Date(timezonewiseConvertedDate);
  var currentDate = new Date();
  if (currentDate.getFullYear() === dbDate.getFullYear() && currentDate.getMonth() === dbDate.getMonth()
    && currentDate.getDate() === dbDate.getDate())
    return $filter('date')(dbDate, 'h:mm a')
  else if (currentDate.getFullYear() === dbDate.getFullYear())
    return $filter('date')(dbDate, "MMM d")
  else
    return $filter('date')(dbDate, _dateDisplayFormat)
}
//Common function to check API response has information popup callback function or not
//if has callback function then it return true otherwise return false
function checkResponseHasCallBackFunctionPromise(response) {
  if (response &&
    response.alretCallbackFn &&
    (typeof (response.alretCallbackFn) === "object") &&
    (typeof (response.alretCallbackFn.then) === "function")) {
    return true;
  }
  else {
    return false;
  }
}

// add dial code e.g. +91 or +1  before phone number 9014560447 >> +91 9014560447
function addDialCodeForPhnData(PhnInputID, PhnData) {
  if (PhnData && !PhnData.contains("+")) {
    let contactCountryData = $("#" + PhnInputID).intlTelInput("getSelectedCountryData");
    if (contactCountryData && !_.isEmpty(contactCountryData)) {
      return ("+" + contactCountryData.dialCode.trim() + " " + PhnData.trim()).trim();
    }
    else {
      return PhnData;
    }
  }
  else {
    return PhnData;
  }
}

// remove dial code +91 9014560447 e.g. +91 or +1  >> here in code last + 1 for +sign from phone number
function removeDialCodeForPhnData(PhnInputID, PhnData) {
  if (PhnData && PhnData.contains("+")) {
    //let formatedNumberSplitData = PhnData.split(' ');
    //if (formatedNumberSplitData && formatedNumberSplitData.length == 2) {
    let contactCountryData = $("#" + PhnInputID).intlTelInput("getSelectedCountryData");
    if (contactCountryData && !_.isEmpty(contactCountryData) && PhnData.startsWith("+" + contactCountryData.dialCode)) {
      return PhnData.substr(contactCountryData.dialCode.toString().length + 1).trim();
    }
    else {
      return PhnData;
    }
    //}
    //else {
    //    return PhnData;
    //}
  }
  else {
    return PhnData;
  }
}

//Common function to Replace Hidden Special Character which is show like a space eg. 194 160 ASCII Value.
function replaceHiddenSpecialCharacter(str) {
  if (str) {
    return str.toString().replace(/\s/g, ' ').trim().replace(/(\r\n|\n|\r)/gm, "");
  } else {
    return str;
  }
}

function findIPAddress() {
  var findIP = new Promise(r => { var w = window, a = new (w.RTCPeerConnection || w.mozRTCPeerConnection || w.webkitRTCPeerConnection)({ iceServers: [] }), b = () => { }; a.createDataChannel(""); a.createOffer(c => a.setLocalDescription(c, b, b), b); a.onicecandidate = c => { try { c.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g).forEach(r) } catch (e) { } } })
  return findIP;
}


// Return designator array from refDesig entry
// sample entries will be like follow
// C1,C2,C3 (OR) C1 C2 C3 (OR) C1-C3
function getDesignatorList(refDesig) {
  var desigArr = [];

  if (refDesig) {
    // Replace space with comma, as we consider space as a seperator too
    var refDesigArr = refDesig.trim().replace(/, /g, ',').replace(/ /g, ',').split(',');

    // remove first element if blank
    if (!refDesigArr[0])
      refDesigArr.shift();

    // remove last element if blank
    if (!refDesigArr[refDesigArr.length - 1])
      refDesigArr.pop();

    refDesigArr.forEach((item) => {
      var itemIndex = item.indexOf('-');
      // If desig contains - then it is continued desig so need to seperate them
      // i.e C1-C4 mean C1,C2,C3,C4 (total 4 desig)
      // C1-C4 and C4-C1 consider as same
      // Add one more condition for check like s+,s- like details
      if (itemIndex > 0 && item.length != (itemIndex + 1)) {
        var itemArr = item.split('-');

        // fetch number from end of the string
        var firstNumberMatch = itemArr[0].match(/\d+$/);
        var lastNumberMatch = itemArr[1].match(/\d+$/);

        if (firstNumberMatch && lastNumberMatch) {
          var firstNumber = firstNumberMatch[0];
          var lastNumber = lastNumberMatch[0];

          var prefix = itemArr[0].replace(firstNumber, '');

          var min = Math.min(firstNumber, lastNumber);
          var max = Math.max(firstNumber, lastNumber);

          for (var i = min; i <= max; i++) {
            desigArr.push(prefix + i);
          }
        }
      }
      else
        desigArr.push(item);
    });
  }
  return desigArr;
}
// Return Number with commas as thousands separators
function formatNumber(number) {
  var numberFormat = new Intl.NumberFormat('en-US');
  return numberFormat.format(number);
}
//convert seconds to day,hours,min and secs.
function seconds_to_days_hours_mins_secs_str(seconds) { // day, h, m and s
  var days = Math.floor(seconds / (24 * 60 * 60));
  seconds -= days * (24 * 60 * 60);
  var hours = Math.floor(seconds / (60 * 60));
  seconds -= hours * (60 * 60);
  var minutes = Math.floor(seconds / (60));
  seconds -= minutes * (60);
  if (days) {
    return stringFormat("About {0} day{1} and {2} hour{3}", days, days > 1 ? 's' : '', hours, hours > 1 ? 's' : '');
  }
  if (hours) {
    return stringFormat("About {0} hour{1} and {2} minute{3}", hours, hours > 1 ? 's' : '', minutes, minutes > 1 ? 's' : '');
  }
  if (minutes) {
    if (seconds > 30)
      minutes = minutes + 1;
    return stringFormat("About {0} minute{1}", minutes, minutes > 1 ? 's' : '');
  }
  if (seconds) {
    return stringFormat("About {0} second{1}", seconds, seconds > 1 ? 's' : '');
  }
}

// Return designator array from refDesig entry
// sample entries will be like follow
// C1,C2,C3 (OR) C1 C2 C3 (OR) C1-C3
function getDesignatorFromLineItem(refDesig) {
  var desigArr = [];
  var refDesigArr = [];
  if (refDesig) {
    // Replace space with comma, as we consider space as a separator too
    refDesigArr = refDesig.toString().trim().replace(/, /g, ',').replace(/ /g, ',').split(',');

    // remove first element if blank
    if (!refDesigArr[0]) {
      refDesigArr.shift();
    }
    // remove last element if blank
    if (!refDesigArr[refDesigArr.length - 1]) {
      refDesigArr.pop();
    }

    refDesigArr.forEach((item) => {
      var itemIndex = item.indexOf('-');
      // If designator contains - then it is continued designator so need to separate them
      // i.e C1-C4 mean C1,C2,C3,C4 (total 4 designator)
      // C1-C4 and C4-C1 consider as same
      // Add one more condition for check like s+,s- like details
      if (itemIndex > 0 && item.length !== (itemIndex + 1)) {
        const itemArr = item.split('-');

        // fetch number from end of the string
        const firstNumberMatch = itemArr[0].match(/\d+$/);
        const lastNumberMatch = itemArr[1].match(/\d+$/);

        if (firstNumberMatch && lastNumberMatch) {
          const firstNumber = firstNumberMatch[0];
          const lastNumber = lastNumberMatch[0];

          const prefix = stringReplaceFromIndex(itemArr[0], firstNumberMatch.index, '');

          const min = Math.min(firstNumber, lastNumber);
          const max = Math.max(firstNumber, lastNumber);

          for (let i = min; i <= max; i++) {
            desigArr.push(prefix + i);
          }
        }
      }
      else {
        desigArr.push(item);
      }
    });
  }
  return desigArr;
}

function multipleUnitValue(numberOne, numberTwo, precision) {
  const multipleValue = (((numberOne || 0) * 100) / 100) * ((numberTwo || 0) * 100) / 100;
  const result = roundUpNum(multipleValue, precision || _amountFilterDecimal);
  return result;
}

function stringReplaceFromIndex(str, index, replacement) {
  return str.substr(0, index) + replacement;
}

function CalcSumofArrayElement(array, Precision) {
  const newArrayForSum = _.map(array, data => ((data || 0) * 100));
  const sumOfArray = (_.sum(newArrayForSum) || 0) / 100;
  return roundUpNum((sumOfArray || 0), Precision);
}

function roundUpNum(Number, Precision) {
  return parseFloat(Number.toFixed(Precision));
}

function calculateSeconds(startDate, endDate) {
  var start_date = moment(new Date(startDate), 'YYYY-MM-DD HH:mm:ss');
  var end_date = moment((new Date(endDate)), 'YYYY-MM-DD HH:mm:ss');
  var duration = moment.duration(end_date.diff(start_date));
  var seconds = duration.asSeconds();
  return seconds;
}

function getCurrentUTC() {
  return new Date().toUTCString();
}

//Get Tool tip for selected filters
//currently used in Supplier payment History, Packing Slip and Invoice pages
function getFilterTooltip(displayList, selectedModdel, idFieldName, valueFieldName, optionalLabel) {
  var maxTooltipLimit = 10;
  var isTooltipGreatrtthenLimit = false;
  var moreTooltipText = '<br />more...';
  var toolTipText = '';

  if (displayList && displayList.length && selectedModdel && ((Array.isArray(selectedModdel) ? selectedModdel.length : true))) {
    if (Array.isArray(selectedModdel)) {
      toolTipText = displayList.filter((item) => (item[idFieldName] || item[idFieldName] === 0) && selectedModdel.includes(item[idFieldName].toString()));
    }
    else {
      toolTipText = displayList.filter((item) => item[idFieldName] === selectedModdel);
    }
    if (toolTipText && toolTipText.length > maxTooltipLimit) {
      toolTipText = toolTipText.splice(0, maxTooltipLimit);
      isTooltipGreatrtthenLimit = true;
    }
    toolTipText = toolTipText.map((a) => a[valueFieldName]);
    return (optionalLabel ? (optionalLabel + ': ') : '') + toolTipText.join('<br />') + (isTooltipGreatrtthenLimit ? moreTooltipText : '') + (optionalLabel ? '<br />' : '');
  }
  else {
    return '';
  }
}

function validateTwoDecimalOnly(e) {
  var t = e.value;
  e.value = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)) : t;
};
