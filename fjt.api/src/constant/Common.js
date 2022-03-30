const _ = require("lodash");
var CryptoJS = require("crypto-js");
const moment = require("moment");
const config = require("./../../config/config");
var crypto = require("crypto"),
  CRYPTO_ALGORITHM = "aes-256-ctr",
  CRYPTO_PASSWORD = "Admin@123",
  loggedInUser = null,
  textAngularAPIKeyCode = null,
  textAngularWebKeyCode = null;
const COMMON = Object.freeze({
  DEFAULT_PASSWORD: "Admin@123",
  VALIDATION_ERROR: "Validation error",
  PAGE_SIZE: 1000,
  emojiRegex:
    /\uD83C\uDFF4(?:\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74)\uDB40\uDC7F|\u200D\u2620\uFE0F)|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3]))|\uD83D\uDC69\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83D\uDC69\u200D[\u2695\u2696\u2708])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC68(?:\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDD1-\uDDDD])/g,
  // CONVERTTHREEDECIMAL: (number) =>{
  //     return number ? number.toFixed(3) : number;
  // },
  ENCRYPT: (text) => {
    let cipher = crypto.createCipher(CRYPTO_ALGORITHM, CRYPTO_PASSWORD);
    let crypted = cipher.update(text, "utf8", "hex");
    crypted += cipher.final("hex");
    return crypted;
  },
  DECRYPT: (text) => {
    if (text) {
      var decipher = crypto.createDecipher(CRYPTO_ALGORITHM, CRYPTO_PASSWORD);
      var dec = decipher.update(text, "hex", "utf8");
      dec += decipher.final("utf8");
      return dec;
    }
    return text;
  },
  ENCRYPT_AES: (text) => {
    var iv = CryptoJS.enc.Utf8.parse("fl!23net@%$$2!@#");
    return CryptoJS.AES.encrypt(text, iv, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
  },
  DECRYPT_AES: (text) => {
    // if (text) {
    //     var bytes = CryptoJS.AES.decrypt(text.toString(), 'fl!23net@%$$2!@#');
    //     dec = bytes.toString(CryptoJS.enc.Utf8);
    //     return dec;
    // }
    // return text;
    var iv = CryptoJS.enc.Utf8.parse("fl!23net@%$$2!@#");

    var plaintText = CryptoJS.AES.decrypt(text.toString(), iv, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return plaintText.toString(CryptoJS.enc.Utf8);
  },
  // DecryptAESForIDS: (text) => {
  //     var iv = CryptoJS.enc.Utf8.parse('fl!23net@%$$2!@#');

  //     var plaintText = CryptoJS.AES.decrypt(text.toString(), iv, {
  //         keySize: 128 / 8,
  //         iv: iv,
  //         mode: CryptoJS.mode.CBC,
  //         padding: CryptoJS.pad.Pkcs7
  //     });
  //     return plaintText.toString(CryptoJS.enc.Utf8);
  // },

  TEXT_WORD_CAPITAL: (text, isApply) => {
    if (isApply) {
      text = text.toLowerCase();
      //changed capital logic as it will convert first character in capital
      var re = /(\b[a-z](?!\s))/g;
      return text.replace(re, function (x) {
        return x.toUpperCase();
      });
    } else {
      return text;
    }
  },
  CUSTOMER_ADDRESS_TYPE: {
    BillingAddress: "B",
    ShippingAddress: "S",
    RMAShippingAddress: "R",
    PayToInformation: "P",
  },
  INPUTFIELD_KEYS: {
    Textbox: 1,
    Numberbox: 2,
    Multilinetextbox: 3,
    Editor: 4,
    DateTime: 5,
    DateRange: 6,
    SingleChoice: 7,
    MultipleChoice: 8,
    Option: 9,
    Combobox: 10,
    MultipleChoiceDropdown: 11,
    FileUpload: 12,
    Email: 13,
    Currency: 14,
    URL: 15,
    Signature: 16,
    // Lookup:17,
    SubForm: 18,
    // ControlState: 19
    CustomAutoCompleteSearch: 19,
  },
  GridFilterColumnDataType: {
    Number: "Number",
    StringEquals: "StringEquals",
    Date: "Date",
    Percentage: "Percentage",
    Grater: "Grater",
  },
  GridFilterDateFields: [
    "createdAt",
    "updatedAt",
    "createdAtValue",
    "updatedAtValue",
    "woCreatedAt",
    "woUpdatedAt",
    "convertedHaltDate",
    "convertedResumeDate",
    "expiredStatus",
    "startActivityDate",
    "updatedAtApiValue",
    "createdDate",
    "modifiedDate",
    "timestamp",
    "verifiedAt",
    "entryDate",
    "TimeStamp",
    "startDate",
    "endDate",
    "clearedAt",
    "modifyDate",
    "shippingDate",
    "convertedNotiAckDate",
    "mappingOnDate",
    "changedOn",
    "verifiedOn",
    "expiryDate",
    "transactionDate",
    "roHSApprovedOn",
    "checkinTime",
    "checkoutTime",
    "buyDate",
    "refInvoiceDate",
    "applyDate",
    "receiptDate",
    "debitMemoDate",
    "creditMemoDate",
    "invoiceDate",
    "packingSlipDate",
    "verifiedAt",
    "packingslipDate",
    "soDate",
    "poDate",
    "publishedDate",
    "agreedDate",
    "openingdate",
    "quoteSubmitDate",
    "quoteInDate",
    "quoteDueDate",
    "quoteDate",
    "quoteClosedDate",
    "Date Time1-##-5-##-2021",
    "Transaction Date",
  ],

  /* Put common ui grid filter function for all list  */
  UiGridFilterSearch: (req) => {
    // let reqDetail = req.method == "POST" ? req.body : req.query;
    // if (req.method == "POST") {
    //     reqDetail.page = reqDetail.Page;
    //     reqDetail.order = JSON.stringify(reqDetail.SortColumns);
    //     reqDetail.search = JSON.stringify(reqDetail.SearchColumns);
    // }

    let reqDetail = req.query;
    if (_.isEmpty(reqDetail)) {
      reqDetail = req.body;
    }
    if (reqDetail.page == undefined && req.body) {
      reqDetail.page = req.body.Page || req.body.Page == 0 ? req.body.Page : 1;
    }

    if (reqDetail.pageSize == undefined && req.body && req.body.pageSize) {
      reqDetail.pageSize = req.body.pageSize;
    }

    if (!reqDetail.order && req.body && req.body.SortColumns) {
      reqDetail.order = JSON.stringify(req.body.SortColumns);
    }

    if (!reqDetail.search && req.body && req.body.SearchColumns) {
      reqDetail.search = JSON.stringify(req.body.SearchColumns);
    }

    if (!reqDetail.whereStatus && req.body && req.body.whereStatus) {
      reqDetail.whereStatus = req.body.whereStatus;
    }

    let filter = { limit: COMMON.PAGE_SIZE };
    if (reqDetail.page && reqDetail.pageSize) {
      filter.limit = parseInt(reqDetail.pageSize);
      let page = parseInt(reqDetail.page);
      if (page > 0) {
        filter.offset = (page - 1) * filter.limit;
      }
    }

    if (reqDetail.order && reqDetail.order.length > 0) {
      filter.order = JSON.parse(reqDetail.order);
      filter.strOrderBy = null;
      _.each(filter.order, (item) => {
        if (COMMON.GridFilterDateFields.includes(item[0])) {
          item[0] = `fun_castStringDateTimeToDateTime(${item[0]}) `;
        } else {
          item[0] = `\`${item[0]}\``;
        }
        filter.strOrderBy = `${
          (filter.strOrderBy ? `${filter.strOrderBy},` : "") + item[0]
        } ${item[1]}`;
      });
    }

    // ui-grid filter
    if (reqDetail.search && reqDetail.search.length > 0) {
      let searcharray = JSON.parse(reqDetail.search);
      let whereclause = {};

      _.each(searcharray, (obj, index) => {
        // If column data type is NUMBER
        if (obj && obj.SearchString && typeof obj.SearchString == "string") {
          obj.SearchString = obj.SearchString.replace(COMMON.emojiRegex, "");
        }

        if (
          obj.ColumnDataType &&
          obj.ColumnDataType == COMMON.GridFilterColumnDataType.Number
        ) {
          whereclause[obj.ColumnName] = obj.SearchString;
        } else if (
          obj.ColumnDataType &&
          obj.ColumnDataType == COMMON.GridFilterColumnDataType.StringEquals
        ) {
          whereclause[obj.ColumnName] = { $eq: `${obj.SearchString}` };
        } else if (
          obj.ColumnDataType &&
          obj.ColumnDataType == COMMON.GridFilterColumnDataType.Percentage
        ) {
          //whereclause[obj.ColumnName] = { $lte: `${obj.SearchString}` };
          obj.SearchString = parseFloat(obj.SearchString);
          if (
            !Number.isNaN(obj.SearchString) &&
            typeof obj.SearchString == "number"
          ) {
            filter.whereColumnName = "`" + obj.ColumnName + "`";
            filter.whereFilterValue = obj.SearchString;
            filter.customWhere = true;
          } else {
            whereclause[obj.ColumnName] = obj.SearchString;
          }
        } else if (
          obj.ColumnDataType &&
          obj.ColumnDataType == COMMON.GridFilterColumnDataType.Grater
        ) {
          //whereclause[obj.ColumnName] = { $lte: `${obj.SearchString}` };
          //obj.SearchString = parseFloat(obj.SearchString);
          if (
            !Number.isNaN(parseFloat(obj.SearchString)) &&
            typeof parseFloat(obj.SearchString) == "number"
          ) {
            whereclause[obj.ColumnName] = {
              $gte: parseFloat(obj.SearchString),
            };
          } else {
            whereclause[obj.ColumnName] = obj.SearchString;
          }
        }
        // If column data type is NOT NUMBER
        else {
          whereclause[obj.ColumnName] = { $like: `%${obj.SearchString}%` };
        }
      });
      filter.where = whereclause;
    }

    // If external static filter is applied then push into current where clause
    if (reqDetail.whereStatus && reqDetail.whereStatus.length > 0) {
      // if in whereStatus come string value then check string or object
      if (_.isArray(reqDetail.whereStatus)) {
        filter.where[reqDetail.SearchColumnName] = {
          $in: reqDetail.whereStatus,
        };
        // if multiple values passed then used IN condition
        // if (reqDetail.whereStatus.length > 1) {
        //     filter.where[reqDetail.SearchColumnName] = { $in: reqDetail.whereStatus };
        // } else {
        //     filter.where[reqDetail.SearchColumnName] = {
        //         $eq: reqDetail.whereStatus
        //     };
        // }
      } else {
        filter.where[reqDetail.SearchColumnName] = {
          $eq: reqDetail.whereStatus,
        };
      }
    }
    return filter;
  },

  UIGridMongoDBFilterSearch: (req) => {
    let filter = { limit: COMMON.PAGE_SIZE };
    if (req.query.page && req.query.pageSize) {
      filter.limit = parseInt(req.query.pageSize);
      let page = parseInt(req.query.page);
      if (page > 0) {
        filter.offset = (page - 1) * filter.limit;
      }
    }

    if (req.query.order && req.query.order.length > 0) {
      filter.order = JSON.parse(req.query.order);
    }

    // ui-grid filter
    if (req.query.search && req.query.search.length > 0) {
      let searcharray = JSON.parse(req.query.search);
      let whereclause = {};

      _.each(searcharray, (obj) => {
        // If column data type is NUMBER
        if (
          obj.ColumnDataType &&
          obj.ColumnDataType == COMMON.GridFilterColumnDataType.Number
        ) {
          whereclause[obj.ColumnName] = Number(obj.SearchString);
        } else if (
          obj.ColumnDataType &&
          obj.ColumnDataType == COMMON.GridFilterColumnDataType.StringEquals
        ) {
          whereclause[obj.ColumnName] = obj.SearchString;
        } else {
          whereclause[obj.ColumnName] = new RegExp(`${obj.SearchString}`, "i");
        }
      });
      filter.where = whereclause;
    }
    return filter;
  },

  // Create MySQL where condition from UIGrid filter where condition
  UIGridWhereToQueryWhere: (whereObj) => {
    var whereClause = [];
    for (var item in whereObj) {
      var val = whereObj[item];
      if (val["$eq"])
        whereClause.push(
          COMMON.stringFormat(
            "`{0}` = '{1}'",
            item,
            val["$eq"].replace(/'/g, "''")
          )
        );
      else if (val["$lte"])
        whereClause.push(
          COMMON.stringFormat(
            "`{0}` <= '{1}'",
            item,
            val["$lte"].replace(/'/g, "''")
          )
        );
      else if (val["$like"])
        whereClause.push(
          COMMON.stringFormat(
            "`{0}` like '{1}'",
            item,
            val["$like"].replace(/'/g, "''")
          )
        );
      else if (val["$in"]) {
        whereClause.push(
          COMMON.stringFormat(
            "`{0}` in ({1})",
            item,
            val["$in"]
              .map((x) => {
                return '"' + x.replace(/'/g, "''") + '"';
              })
              .join(",")
          )
        );
      } else if (val["$gte"]) {
        whereClause.push(
          COMMON.stringFormat("`{0}` >= '{1}'", item, val["$gte"])
        );
      } else
        whereClause.push(
          COMMON.stringFormat(
            "`{0}` like '{1}'",
            item,
            val.toString().replace(/'/g, "''")
          )
        );
    }
    return whereClause.join(" AND ");
  },

  // Create MySQL where condition from UIGrid filter where condition with alias in column name
  UIGridWhereToQueryWithAlias: (whereObj) => {
    var whereClause = [];
    if (!_.isEmpty(whereObj)) {
      for (const item in whereObj) {
        const val = whereObj[item];
        if (val["$eq"]) {
          whereClause.push(
            COMMON.stringFormat(
              "{0} = '{1}'",
              item,
              val["$eq"].replace(/'/g, "''")
            )
          );
        } else if (val["$lte"]) {
          whereClause.push(
            COMMON.stringFormat(
              "{0} <= '{1}'",
              item,
              val["$lte"].replace(/'/g, "''")
            )
          );
        } else if (val["$like"]) {
          whereClause.push(
            COMMON.stringFormat(
              "{0} like '{1}'",
              item,
              val["$like"].replace(/'/g, "''")
            )
          );
        } else if (val["$in"]) {
          whereClause.push(
            COMMON.stringFormat(
              "{0} in ({1})",
              item,
              val["$in"]
                .map((x) => {
                  return '"' + x.replace(/'/g, "''") + '"';
                })
                .join(",")
            )
          );
        } else if (val["$gte"]) {
          whereClause.push(
            COMMON.stringFormat("{0} >= '{1}'", item, val["$gte"])
          );
        } else {
          whereClause.push(
            COMMON.stringFormat(
              "{0} like '{1}'",
              item,
              val.toString().replace(/'/g, "''")
            )
          );
        }
      }
    }
    return whereClause.join(" AND ");
  },

  // Create MySQL where condition from UIGrid filter where condition

  // Create MySQL where condition from UIGrid filter where condition with multiple OR
  whereClauseOfMultipleFieldSearchText: (whereObj) => {
    var whereClause = [];
    for (var item in whereObj) {
      var val = whereObj[item];
      if (val["$eq"]) {
        if (val.isCommaSeparatedValues) {
          whereClause.push(
            COMMON.stringFormat(
              "FIND_IN_SET('{0}',`{1}`)",
              val["$eq"].replace(/'/g, "''"),
              item
            )
          );
        } else {
          whereClause.push(
            COMMON.stringFormat(
              "`{0}` = '{1}'",
              item,
              val["$eq"].replace(/'/g, "''")
            )
          );
        }
      } else if (val["$lte"])
        whereClause.push(
          COMMON.stringFormat(
            "`{0}` <= '{1}'",
            item,
            val["$lte"].replace(/'/g, "''")
          )
        );
      else if (val["$like"])
        whereClause.push(
          COMMON.stringFormat(
            "`{0}` like '{1}'",
            item,
            val["$like"].replace(/'/g, "''")
          )
        );
      else if (val["$in"]) {
        whereClause.push(
          COMMON.stringFormat(
            "`{0}` in ({1})",
            item,
            val["$in"]
              .map((x) => {
                return '"' + x.replace(/'/g, "''") + '"';
              })
              .join(",")
          )
        );
      } else
        whereClause.push(
          COMMON.stringFormat(
            "`{0}` = '{1}'",
            item,
            val.toString().replace(/'/g, "''")
          )
        );
    }
    return whereClause.join(" OR ");
  },
  getCurrentUTC: () => {
    return new Date().toUTCString();
  },

  getRequestUserID: (req) => {
    // if (req.user) {
    //     return req.user.id;
    // }
    if (loggedInUser) {
      return loggedInUser.id;
    }
  },
  getRequestUserLoginRoleID: (req) => {
    // if (req.user) {
    //     return req.user.defaultLoginRoleID;
    // }
    if (loggedInUser) {
      return loggedInUser.defaultLoginRoleID;
    }
  },
  getGUID: () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  },

  /* Set login user id any operation by field  */
  setModelCreatedByFieldValue: (req) => {
    if (req && loggedInUser) {
      (req.body || req)["createdBy"] = loggedInUser.id;
      (req.body || req)["updatedBy"] = loggedInUser.id;
      (req.body || req)["updateByRoleId"] = loggedInUser.defaultLoginRoleID;
      (req.body || req)["createByRoleId"] = loggedInUser.defaultLoginRoleID;
      (req.body || req)["createdAt"] = COMMON.getCurrentUTC();
    }
  },

  /* Set login user id any operation by field  - identityDb -- Bhavik Thummar*/
  setModelCreatedByFieldValueIForIdentityDb: (req) => {
    if (req && loggedInUser) {
      const userRole = ((req.body || req)["createdBy"] =
        loggedInUser.employee.initialName);
      (req.body || req)["updatedBy"] = loggedInUser.employee.initialName;
      (req.body || req)["updateByRole"] = loggedInUser.defaultLoginRoleID;
      (req.body || req)["createByRole"] = loggedInUser.defaultLoginRoleID;
      (req.body || req)["createdAt"] = COMMON.getCurrentUTC();
    }
  },

  setModelCreatedArrayFieldValue: (user, list) => {
    _.each(list, (obj) => {
      obj["createdBy"] = loggedInUser.id;
      obj["updatedBy"] = loggedInUser.id;
      obj["createdAt"] = COMMON.getCurrentUTC();
      obj["updatedAt"] = COMMON.getCurrentUTC();
      obj["updateByRoleId"] = loggedInUser.defaultLoginRoleID;
      obj["createByRoleId"] = loggedInUser.defaultLoginRoleID;
    });
  },
  setModelCreatedObjectFieldValue: (user, obj) => {
    obj["createdBy"] = user.id;
    obj["updatedBy"] = user.id;
    obj["createdAt"] = COMMON.getCurrentUTC();
    obj["updatedAt"] = COMMON.getCurrentUTC();
    obj["updateByRoleId"] = user.defaultLoginRoleID;
    obj["createByRoleId"] = user.defaultLoginRoleID;
  },
  setModelUpdatedByFieldValue: (req) => {
    if (req && loggedInUser) {
      (req.body || req)["updatedBy"] = loggedInUser.id;
      (req.body || req)["updateByRoleId"] = loggedInUser.defaultLoginRoleID;
      (req.body || req)["updatedAt"] = COMMON.getCurrentUTC();
    }
  },
  setModelUpdatedByArrayFieldValue: (user, list) => {
    _.each(list, (obj) => {
      obj["updatedBy"] = loggedInUser.id;
      obj["updateByRoleId"] = loggedInUser.defaultLoginRoleID;
      obj["updatedAt"] = COMMON.getCurrentUTC();
    });
  },
  setModelUpdatedByObjectFieldValue: (user, obj) => {
    obj["updatedBy"] = user.id;
    obj["updateByRoleId"] = user.defaultLoginRoleID;
    obj["updatedAt"] = COMMON.getCurrentUTC();
  },
  setModelDeletedByFieldValue: (req) => {
    if (req && loggedInUser) {
      (req.body || req)["deletedBy"] = loggedInUser.id;
      (req.body || req)["deletedAt"] = COMMON.getCurrentUTC();
      (req.body || req)["isDeleted"] = true;
      (req.body || req)["updatedBy"] = loggedInUser.id;
      (req.body || req)["updatedAt"] = COMMON.getCurrentUTC();
      (req.body || req)["updateByRoleId"] = loggedInUser.defaultLoginRoleID;
      (req.body || req)["deleteByRoleId"] = loggedInUser.defaultLoginRoleID;
    }
  },
  setModelDeletedByArrayFieldValue: (user, list) => {
    _.each(list, (obj) => {
      obj["deletedBy"] = loggedInUser.id;
      obj["deletedAt"] = COMMON.getCurrentUTC();
      obj["isDeleted"] = true;
      obj["updatedBy"] = loggedInUser.id;
      obj["updatedAt"] = COMMON.getCurrentUTC();
      obj["updateByRoleId"] = loggedInUser.defaultLoginRoleID;
      obj["deleteByRoleId"] = loggedInUser.defaultLoginRoleID;
    });
  },
  setModelDeletedByObjectFieldValue: (user, obj) => {
    obj["deletedBy"] = user.id;
    obj["deletedAt"] = COMMON.getCurrentUTC();
    obj["isDeleted"] = true;
    obj["updatedBy"] = user.id;
    obj["updatedAt"] = COMMON.getCurrentUTC();
    obj["updateByRoleId"] = user.defaultLoginRoleID;
    obj["deleteByRoleId"] = user.defaultLoginRoleID;
  },
  setSalesOrder: (req, length) => {
    if (req.body) {
      var sodate = req.body["soDate"];
      var res = sodate.split("-");
      var soid = "00";
      if (length > 8) soid = "0";
      else if (length > 98) soid = "";
      var serialNumber = COMMON.stringFormat(
        "S{0}{1}{2}-{3}{4}",
        res[0].substring(res[0].length - 2), // Year
        res[1], // month
        res[2], // date
        soid, // first digit append 0 or not
        length + 1 // nextnumber (date wise sales order count)
      );
      req.body["salesOrderNumber"] = serialNumber;
    }
  },
  PrefixForGeneratePackingSlip: {
    CustomerPackingSlip: "PS",
    invoiceNumberSlip: "INV",
    creditMemo: "CM",
  },
  setCustomerPackingSlip: (req, value) => {
    if (req.body) {
      if (value < 10) value = COMMON.stringFormat("0{0}", value);
      req.body["packingSlipNumber"] = COMMON.stringFormat(
        "{0}{1}{2}",
        COMMON.PrefixForGeneratePackingSlip.CustomerPackingSlip,
        req.body["packingSlipNumber"],
        value
      );
    }
  },
  setPurchaseOrderNumber: (req, value, initName) => {
    if (req.body) {
      if (value < 10) {
        value = COMMON.stringFormat("0{0}", value);
      }
      req.body["poDateFormat"] = COMMON.stringFormat(
        "{0}{1}{2}",
        initName,
        req.body["poDateFormat"],
        value
      );
    }
  },
  getWarehouseType(key) {
    const { DATA_CONSTANT } = require("../../constant");
    let warehouseType = _.find(DATA_CONSTANT.warehouseType, (item) => {
      return item.key == key;
    });
    return warehouseType ? warehouseType.value : "";
  },
  calculateSeconds: (startDate, endDate) => {
    var start_date = moment(new Date(startDate), "YYYY-MM-DD HH:mm:ss");
    var end_date = moment(new Date(endDate), "YYYY-MM-DD HH:mm:ss");
    var duration = moment.duration(end_date.diff(start_date));
    var seconds = duration.asSeconds();
    return seconds;
  },
  AllEntityIDS: {
    Operation: {
      ID: -1,
      Name: "operations",
      displayText: "Operation",
    },
    Customer: {
      ID: -2,
      Name: "customers",
      displayText: "Customer",
    },
    MANUFACTURERS: {
      ID: -21,
      Name: "Manufactures",
      displayText: "Manufactures",
    },
    Equipment: {
      ID: -3,
      Name: "equipment",
      displayText: "Equipment, Workstation & Sample",
    },
    CertificateStandard: {
      ID: -4,
      Name: "certificate_standards",
      displayText: "Standard",
    },
    Employee: {
      ID: -5,
      Name: "employees",
      displayText: "Personnel",
    },
    Department: {
      ID: -6,
      Name: "department",
      displayText: "Department",
    },
    Workorder: {
      ID: -7,
      Name: "workorder",
      displayText: "Work Order",
    },
    Supplier: {
      ID: -8,
      Name: "customers",
      displayText: "Supplier",
    },
    Component: {
      ID: -9,
      Name: "component",
      displayText: "Parts",
    },
    SalesOrder: {
      ID: -10,
      Name: "salesorder",
      displayText: "Sales Order",
    },
    Component_sid_stock: {
      ID: -11,
      Name: "component_sid_stock",
      displayText: "UMID Management",
    },
    Equipment_Task: {
      ID: null,
      Name: "equipment_task",
    },
    Workorder_operation: {
      ID: -22,
      Name: "workorder_operation",
    },
    WORKORDER_OPERATION_DO_DONT: {
      ID: -50,
      Name: "workorder_operation",
    },
    ECORequest: {
      ID: null,
      Name: "eco_request",
    },
    EcoTypeCategory: {
      ID: -45,
      Name: "eco_type_category",
    },
    EcoTypeValues: {
      ID: -46,
      Name: "eco_type_values",
    },
    ECO_DFM_TYPES: {
      ID: -47,
      Name: "genericcategory",
    },
    GenericCategory: {
      ID: null,
      Name: "genericcategory",
    },
    LabelTemplatesMst: {
      ID: null,
      Name: "labeltemplatesmst",
    },
    MasterTemplate: {
      ID: null,
      Name: "master_templates",
    },
    Roles: {
      ID: null,
      Name: "roles",
    },
    StandardClass: {
      ID: -34,
      Name: "standard_class",
    },
    KIT_ALLOCATION: {
      ID: -35,
      Name: "kit_allocation",
    },
    DataElement: {
      ID: null,
      Name: "dataelement",
    },
    PreProgramComponent: {
      ID: null,
      Name: "workorder_preprogcomp",
    },
    WorkorderCluster: {
      ID: null,
      Name: "workorder_cluster",
    },
    WorkorderPart: {
      ID: -38,
      Name: "workorder_operation_part",
    },
    WorkorderEquipment: {
      ID: -36,
      Name: "workorder_operation_equipment",
    },
    WorkorderEmployee: {
      ID: -37,
      Name: "workorder_operation_employee",
    },
    WORKORDER_CHANGE_REQUEST: {
      ID: -39,
      Name: "workorder_reqrevcomments",
    },
    TRAVELER_CHANGE_REQUEST: {
      ID: -40,
      Name: "workorder_reqrevcomments",
    },
    EQUIPMENT_WORKSTATION_SAMPLE_TYPE: {
      ID: -41,
      Name: "genericcategory",
    },
    EQUIPMENT_WORKSTATION_SAMPLE_GROUPS: {
      ID: -42,
      Name: "genericcategory",
    },
    EQUIPMENT_WORKSTATION_SAMPLE_OWNERSHIP: {
      ID: -43,
      Name: "genericcategory",
    },
    GEOLOCATIONS: {
      ID: -44,
      Name: "genericcategory",
    },
    WorkorderOperationCluster: {
      ID: null,
      Name: "workorder_operation_cluster",
    },
    Entity: {
      ID: -52,
      Name: "entity",
    },
    SalesOrderMst: {
      ID: null,
      Name: "salesordermst",
    },
    DataelementTransactionvaluesManual: {
      ID: null,
      Name: "dataelement_transactionvalues_manual",
    },
    MFGCodeMst: {
      ID: null,
      Name: "mfgcodemst",
    },
    WorkorderTransSerialno: {
      ID: null,
      Name: "workorder_trans_serialno",
    },
    BarcodeTemplete: {
      ID: null,
      Name: "br_label_template",
    },
    MeasurementTypes: {
      ID: null,
      Name: "measurement_types",
    },
    UOMs: {
      ID: -25,
      Name: "uoms",
    },
    JobType: {
      ID: null,
      Name: "jobtypes",
    },
    ChartType: {
      ID: null,
      Name: "chartypemst",
    },
    RFQType: {
      ID: null,
      Name: "rfqtype",
    },
    MountingType: {
      ID: -31,
      Name: "rfq_mountingtypemst",
    },
    PackageCaseType: {
      ID: null,
      Name: "rfq_packagecasetypemst",
    },
    ConnecterType: {
      ID: -27,
      Name: "rfq_connectertypemst",
    },
    PART_STATUS: {
      ID: -28,
      Name: "component_partstatusmst",
    },
    RoHS: {
      ID: null,
      Name: "rfq_rohsmst",
    },
    PartType: {
      ID: -30,
      Name: "rfq_parttypemst",
    },
    Reason: {
      ID: null,
      Name: "reasonmst",
    },
    AdditionalRequirement: {
      ID: null,
      Name: "requirement",
    },
    RfqForms: {
      ID: -12,
      Name: "rfqforms",
    },
    ChartTemplateMst: {
      ID: null,
      Name: "chart_templatemst",
    },
    ChartRawdataCategory: {
      ID: null,
      Name: "chart_rawdata_category",
    },
    RFQ_Lineitems_Errorcode: {
      ID: null,
      Name: "rfq_lineitems_errorcode",
    },
    component_logical_group: {
      ID: -29,
      Name: "component_logicalgroup",
    },
    RFQ_Lineitems: {
      ID: null,
      Name: "rfq_lineitems",
    },
    WhoBoughtWho: {
      ID: -26,
      Name: "who_bought_who",
    },
    RFQ_Lineitems_Keywords: {
      ID: null,
      Name: "rfq_lineitems_keywords",
    },
    QuoteDynamicFields: {
      ID: null,
      Name: "quotecharges_dynamic_fields_mst",
    },
    CostCategory: {
      ID: -32,
      Name: "cost_category",
    },
    Country: {
      ID: null,
      Name: "countrymst",
    },
    Warehouse: {
      ID: -23,
      Name: "warehousemst",
    },
    TRAVELER: {
      ID: -24,
      Name: "workorder_trans_empinout",
      Team_Activity: "Team Activity",
      Individual_Activity: "Individual Activity",
    },
    BOM: {
      ID: null,
      Name: "bom",
    },
    ComponentCustomerLOA: {
      ID: null,
      Name: "component_customer_loa",
    },
    CustomerAddresses: {
      ID: null,
      Name: "customer_addresses",
    },
    RFQAssyTypeMst: {
      ID: null,
      Name: "rfq_assy_typemst",
    },
    Bin: {
      ID: null,
      Name: "binmst",
    },
    Rack: {
      ID: null,
      Name: "rackmst",
    },
    SUPPLIER_INVOICE: {
      ID: -13,
      Name: "packing_slip_material_receive",
    },
    Packing_Slip: {
      ID: -14,
      Name: "packing_slip_material_receive",
    },
    CREDIT_MEMO: {
      ID: -15,
      Name: "packing_slip_material_receive",
    },
    DEBIT_MEMO: {
      ID: -16,
      Name: "packing_slip_material_receive",
    },
    Packing_Slip_Detail: {
      ID: null,
      Name: "packing_slip_material_receive_det",
    },
    SUPPLIER_RMA: {
      ID: -19,
      Name: "packing_slip_material_receive_det",
    },
    PackingSlipTrackNumber: {
      ID: null,
      Name: "packing_slip_track_number",
    },
    ReserveStockRequest: {
      ID: -48,
      Name: "reserve_stock_request",
    },
    REQUEST_FOR_SHIPMENTS: {
      ID: -49,
      Name: "shipping_request",
    },
    DEFECT_CATEGORY: {
      ID: -51,
      Name: "defectcategory",
    },
    Packaging_Master: {
      ID: -33,
      Name: "component_packagingmst",
    },
    Workorder_Narrative_Details: {
      ID: null,
      Name: "workorder_trans_narrative_history",
    },
    Scanner: {
      ID: null,
      Name: "scannermst",
    },
    ComponentAlternatepnValidations: {
      ID: null,
      Name: "component_alternatepn_validations",
    },
    WORKORDER_OPERATION_EQUIPMENT_FEEDER_DETAILS: {
      ID: null,
      Name: "workorder_operation_equipment_feeder_details",
    },
    Component_Price_Break_Details: {
      ID: null,
      Name: "component_price_break_details",
    },
    ComponentDynamicAttributeMappingPart: {
      ID: null,
      Name: "component_dynamic_attribute_mapping_part",
    },
    department_location: {
      ID: null,
      Name: "department_location",
    },
    PurchasePartsDetails: {
      ID: null,
      Name: "Purchase_Parts_Details",
    },
    Workorder_Trans_UMID_Details: {
      ID: null,
      Name: "workorder_trans_umid_details",
    },
    Labor_Cost_Template: {
      ID: null,
      Name: "labor_cost_template",
    },
    REPORT_MASTER: {
      ID: null,
      Name: "reportmaster",
    },
    WORORDER_BOX_SERIAL_NUMBER: {
      ID: null,
      Name: "workorder_boxserialno",
    },
    WORKORDER_TRANS_BOX_SERIALNO: {
      ID: null,
      Name: "workorder_trans_boxserialno",
    },
    PurchaseInspectionRequirement: {
      ID: null,
      Name: "componenet_inspection_requirement_det",
    },
    MfgCodeMstCommentDet: {
      ID: null,
      Name: "mfgcodemst_comment_det",
    },
    OPERATING_TEMPERATURE_CONVERSION_MASTER: {
      ID: null,
      Name: "operating_temperature_conversion_mst",
    },
    CALIBRATION_DETAILS: {
      ID: -54,
      Name: "calibration_details",
    },
    CHAT: {
      ID: -55,
      Name: "chat",
    },
    PURCHASE_INSPECTION_REQUIREMENT: {
      ID: null,
      Name: "inspection_mst",
    },
    PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE: {
      ID: null,
      Name: "inspection_template_mst",
    },
    CHART_OF_ACCOUNT: {
      ID: -57,
      Name: "acct_acctmst",
    },
    ACCOUNT_TYPE: {
      ID: -58,
      Name: "acct_classmst",
    },
    PAYMENT_TYPE_CATEGORY: {
      ID: -59,
      Name: "genericcategory",
    },
    CustomerPackingSlip: {
      ID: -17,
      Name: "customer_packingslip",
      displayText: "Customer Packing Slip",
    },
    SUPPLIER_QUOTE_MASTER: {
      ID: null,
      Name: "supplier_quote_mst",
    },
    SUPPLIER_QUOTE_PART_DET: {
      ID: -53,
      Name: "supplier_quote_parts_det",
    },
    Customer_PackingSlip_DET: {
      ID: -17,
      Name: "customer_packingslip_det",
    },
    SUPPLIER_ATTRIBUTE_TEMPLATE_MST: {
      ID: null,
      Name: "supplier_attribute_template_mst",
    },
    FREE_ONBOARD_MASTER: {
      ID: null,
      Name: "freeonboardmst",
    },
    GENERIC_FILE_EXTENSION: {
      ID: null,
      Name: "generic_file_extension",
    },
    AssemblyStock: {
      ID: null,
      Name: "assemblystock",
    },
    CustomerInvoice: {
      ID: -18,
      Name: "customer_invoice",
      displayText: "Customer Invoice",
    },
    CUSTOMER_CREDIT_MEMO: {
      ID: -61,
      Name: "customer_credit_memo",
      displayText: "Customer Credit Memo",
    },
    SOOtherExpense: {
      ID: null,
      Name: "salesorder_otherexpense_details",
    },
    Bank: {
      ID: null,
      Name: "bank_mst",
    },
    CAMERA_MASTER: {
      ID: null,
      Name: "cameramst",
    },
    RELEASE_NOTES: {
      ID: null,
      Name: "release_notes",
    },
    RELEASE_NOTES_DETAILS: {
      ID: null,
      Name: "release_notes_detail",
    },
    PURCHASE_ORDER_DET: {
      ID: null,
      Name: "purchase_order_det",
    },
    PURCHASE_ORDER_MST: {
      ID: -20,
      Name: "purchase_order_mst",
    },
    CustomerPayment: {
      ID: -56,
      Name: "packingslip_invoice_payment",
    },
    APPLIED_CUSTOMER_CREDIT_MEMO: {
      ID: -60,
      Name: "packingslip_invoice_payment",
    },
    CUSTOMER_WRITE_OFFS: {
      ID: -62,
      Name: "packingslip_invoice_payment",
    },
    CUSTOMER_REFUND: {
      ID: -63,
      Name: "packingslip_invoice_payment",
    },
    SUPPLIER_PAYMENT: {
      ID: -64,
      Name: "packingslip_invoice_payment",
    },
    SUPPLIER_REFUND: {
      ID: -65,
      Name: "packingslip_invoice_payment",
    },
    HELP_BLOG_DET: {
      ID: null,
      Name: "help_blog_det",
    },
    TRANSACTIONMODE_MST: {
      ID: -66,
      Name: "generic_transmode_mst",
    },
    RECEIVABLE_TRANSACTIONMODE_MST: {
      ID: -67,
      Name: "generic_transmode_mst",
    },
    SALES_ORDER_DETAIL: {
      ID: -68,
      Name: "salesorderdet",
    },
    ASSEMBLY_TRANS_HISTORY: {
      ID: null,
      Name: "assembly_trans_history",
    },
    CONTACTPERSON: {
      ID: -69,
      Name: "contactperson",
    },
    DC_FORMAT: {
      ID: -70,
      Name: "date_code_format",
    },
  },
  DisplayStatus: {
    Draft: {
      ID: 0,
      Value: "Draft",
    },
    Published: {
      ID: 1,
      Value: "Published",
    },
    Active: {
      ID: 2,
      Value: "Active",
    },
    UnderTermination: {
      ID: 6,
      Value: "Under Termination",
    },
    PurchaseInspectionRequirement: {
      ID: null,
      Name: "componenet_inspection_requirement_det",
    },
  },
  WOSTATUS: {
    DRAFT: 0,
    PUBLISHED: 1,
    COMPLETED: 2,
    VOID: 4,
    UNDER_TERMINATION: 6,
    TERMINATED: 7,
  },
  WOSUBSTATUS: {
    DRAFT: 0,
    PUBLISHED: 1,
    COMPLETED: 2,
    VOID: 4,
    DRAFTREVIEW: 5,
    UNDER_TERMINATION: 6,
    TERMINATED: 7,
    PUBLISHED_DRAFT: 8,
    COMPLETED_WITH_MISSING_PARTS: 9,
  },
  SOSTATUS: {
    INPROGRESS: 1,
    COMPLETED: 2,
  },
  FileErrorMessage: {
    NotFound: "ENOENT",
    AccessDenied: "EACCES",
  },
  DATAELEMENT_USE_AT: {
    Entity: "Entity",
    Both: "Both",
    Operation: "Operation",
  },
  // format string
  // use: stringFormat("{0} is {1}","a","b") , result : a is b
  stringFormat: function () {
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
      var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
      str = str.replace(regEx, arguments[i]);
    }
    return str;
  },
  DefaultVersion: "A",
  formatDate: function (date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  },

  convertToThreeDecimal: function (number) {
    if (number != null && number != undefined) {
      number = number == "." ? 0 : number;
      var value = parseFloat(number);
      value = value.toFixed(3);
      return value;
    } else {
      return number;
    }
  },

  operationDisplayFormat: function (displayformat, opname, opnumber) {
    return this.stringFormat(
      displayformat,
      opname,
      this.convertToThreeDecimal(opnumber)
    );
  },

  VU_workorder_production_report_stk: "vu_workorder_production_report_stk",
  ShippingRequest: "shipping_request",
  ShippingRequestDet: "shipping_requestdet",
  FIELD_DATATYPES: {
    TEXT: "text",
    LONGTEXT: "longtext",
    DATETIME: "datetime",
    DECIMAL: "decimal",
    INT: "int",
    BIGINT: "bigint",
    VARCHAR: "varchar",
  },
  Component_sid_stockTbl: "component_sid_stock",
  DateTimeFormat: "en-US",
  FixedEntityTableNamesForParameterizedFilter: ["workorder_serialmst"],
  FixedEntityTableNames: {
    workorder_serialmst: "workorder_serialmst",
  },
  PRINT_HOST_NAME: "192.168.0.128",
  PRINT_PORT_NAME: "9931",
  BoxSerialsTbl: "workorder_trans_packagingdetail",
  Grid_Date_Filter_Format_For_SP: "YYYY-MM-DD",
  TIMESTAMP_FORMAT_FOR_APPEND_UNIQUE: "yyyy-MM-dd HH:mm:ss.SS",
  TIMESTAMP_COMMON: "MM/DD/YY hh:mm A",
  DATEFORMAT_COMMON: "MM/DD/YYYY",
  MONGO_DB_DATE_FORMAT: "YYYY-MM-DD",
  CORE_MESSAGE: {
    NOT_FOUND: "{0} not found.",
    CREATED: "{0} created successfully.",
    NOT_CREATED: "{0} could not be created.",
    ADDED: "{0} added successfully.",
    NOT_ADDED: "{0} could not be added.",
    UPDATED: "{0} updated successfully.",
    NOT_UPDATED: "{0} could not be updated.",
    DELETED: "{0} deleted successfully.",
    NOT_DELETED: "{0} could not be deleted.",
    REMOVED: "{0} removed successfully.",
    NOT_REMOVED: "{0} could not be removed.",
    SAVED: "{0} saved successfully.",
    NOT_SAVED: "{0} could not be saved.",
    SUBMIT: "{0} submitted successfully.",
    COPY: "{0} copied successfully.",
  },
  Api_Message_Module_Name: "Api Message",
  Api_Message_JSON_File_Read_Path:
    "../constant_json/api_message/api_message.json",
  productStatus: [
    { id: "1", status: "Passed Qty" },
    { id: "2", status: "Reprocess Required Qty" },
    { id: "3", status: "Defect Observed Qty" },
    { id: "4", status: "Scraped Qty" },
    { id: "5", status: "Rework Required Qty" },
  ],
  statusText: {
    Passed: "1",
    Reprocessed: "2",
    DefectObserved: "3",
    Scraped: "4",
    ReworkRequired: "5",
  },
  WorkorderEntryType: {
    TravellerPage: "T",
    Manual: "M",
  },
  Operations_Type_For_WOOPTimeLineLog: {
    DosAndDonts: "DOSANDDONTS",
    firstPcsDet: "FIRSTPCSDET",
    WoOpStatus: "WOOPSTATUS",
  },
  Workorder_Log_Type_For_WOTimeLineLog: {
    MasterTemplate: "MASTERTEMPLATE",
  },
  AgreementTemplateType: {
    ForgotPassword: 2,
    ObsoletePartDetailsReport: 3,
  },
  MailTemplate_SystemVariables: {
    userNameHtmlTag: "<% UserName %>",
    companyNameHtmlTag: "<% CompanyName %>",
    linkURLHtmlTag: "<% Link %>",
    companyLogoHtmlTag: "<% CompanyLogo %>",
    assemblyNameHtmlTag: "<% AssemblyName %>",
    customerCompanyNameHtmlTag: "<% CustomerCompanyName %>",
  },
  MailTemplate_SystemVariables_Replacement: {
    userNameHtmlTag: "&lt;% UserName %&gt;",
    companyNameHtmlTag: "&lt;% CompanyName %&gt;",
    linkURLHtmlTag: "&lt;% Link %gt;",
    companyLogoHtmlTag: "&lt;% CompanyLogo %gt;",
    assemblyNameHtmlTag: "&lt;% AssemblyName %gt;",
    customerCompanyNameHtmlTag: "&lt;% CustomerCompanyName %gt;",
  },
  CompanyName: "Flextron",
  // WebsiteBaseUrl: 'https://192.168.0.208:3000',
  MailServiceUsed: {
    Name: "Mailgun",
    QueueName: "EmailServiceQueue" /* if want to use Mailgun service */,
    //Name: 'Smtp', QueueName: 'EmailServiceQueue'  /* if want to use smtp service */
  },
  CategoryType: {
    EquipmentGroup: {
      ID: 1,
      Name: "Equipment, Workstation & Sample Groups",
    },
    EquipmentType: {
      ID: 2,
      Name: "Equipment, Workstation & Sample Types",
    },
    EquipmentPossession: {
      ID: 3,
      Name: "Equipment & Workstation Possessions",
    },
    EquipmentOwnership: {
      ID: 4,
      Name: "Equipment, Workstation & Sample Ownerships",
    },
    StandardType: {
      ID: 5,
      Name: "Standard Types",
    },
    EmployeeTitle: {
      ID: 7,
      Name: "Titles",
    },
    OperationType: {
      ID: 8,
      Name: "Operation Types",
    },
    ShippingStatus: {
      ID: 9,
      Name: "Shipping Status",
    },
    OperationVerificationStatus: {
      ID: 10,
      Name: "Operation Verification Status",
    },
    LocationType: {
      ID: 11,
      Name: "Geolocations",
    },
    WorkArea: {
      ID: 12,
      Name: "Responsibilities",
    },
    ShippingType: {
      ID: 13,
      Name: "Shipping Methods",
    },
    Terms: {
      ID: 14,
      Name: "Terms",
    },
    Printer: {
      ID: 15,
      Name: "Printers",
    },
    PrintFormat: {
      ID: 16,
      Name: "Label Templates",
    },
    PartStatus: {
      ID: 17,
      Name: "Part Status",
    },
    BarcodeSeparator: {
      ID: 18,
      Name: "Barcode Separators",
    },
    NotificationCategory: {
      ID: 24,
      Name: "Notification Category",
      Title: "Notification Category",
    },
  },
  DBTableName: {
    DynamicReportMst: "dynamicreportmst",
    Entity: "entity",
    WorkorderTransOperationHoldUnhold: "workorder_trans_operation_hold_unhold",
    WorkorderTransHoldUnhold: "workorder_trans_hold_unhold",
    HoldUnholdTrans: "holdunholdtrans",
    WorkorderOperation: "workorder_operation",
  },
  ProjectBranches: {
    MainBranch: "1.00",
    DevBranch: "2.00",
  },
  ProjectBranchesKey: {
    MainBranch: "Main Branch",
    DevBranch: "Dev Branch",
    MainMsgBranch: "Main Message Branch",
    DevMsgBranch: "Dev Message Branch",
  },
  Message_Constant_JSON_File: {
    EMP_TIMELINE: {
      File_Read_Path: "../constant_json/emp_timeline/emp_timeline.json",
    },
  },
  MySqlDateTime: "YYYY-MM-DD HH:mm:ss",

  genrows: function (groups, groupKey) {
    return _.toPairs(groups).map(([key, data]) => ({
      [groupKey]: key,
      data,
    }));
  },

  gengroups: function (arr, iteratee, key) {
    const grouped = _.groupBy(arr, iteratee);
    return this.genrows(grouped, key);
  },

  grouparray: function (data, props) {
    let result = [{ data }];

    props.map((prop, i) => {
      const key = prop.key || `k${i + 1}`;
      const iteratee = prop.iteratee || prop;

      result = _.flatten(
        result.map((row) => {
          return this.gengroups(row.data, iteratee, key).map((group) =>
            Object.assign({}, row, {
              [key]: group[key],
              data: group.data,
            })
          );
        })
      );
    });

    return _.flatten(result);
  },
  //------------------------- [S] Model creation for Elastic Search ---------------------------
  createElasticOject: function (
    isContainHref,
    hrefUrl,
    linkText,
    fieldValue,
    dateFormat,
    numberFormat
  ) {
    //isDateField, dateFormat
    if (dateFormat) {
      linkText = linkText
        ? moment(linkText).utcOffset(linkText).format(dateFormat)
        : linkText;
      fieldValue = fieldValue
        ? moment(fieldValue).utcOffset(fieldValue).format(dateFormat)
        : fieldValue;
    } else if (numberFormat != null) {
      linkText =
        typeof linkText === "number"
          ? linkText.toFixed(numberFormat)
          : linkText;
      fieldValue =
        typeof fieldValue === "number"
          ? fieldValue.toFixed(numberFormat)
          : fieldValue;
    }

    return {
      IsContainHref: isContainHref,
      HrefUrl: hrefUrl,
      LinkText: linkText,
      FieldValue: fieldValue,
    };
  },
  Elastic_Models: {
    PART_MASTER_FIELD: {
      Id: "id",
      MFG_CODE_MST: "mfgCodemst",
      AssyCode: "assyCode",
      MGFPN: "mfgPN",
      Nickname: "nickname",
      PIDCode: "PIDCode",
      MFGPNDescription: "mfgPNDescription",
      SpecialNote: "specialNote",
      RfqPartType: "rfqPartType",
      RfqMountingType: "rfqMountingType",
      ComponentPartStatus: "componentPartStatus",
      Rfq_rohsmst: "rfq_rohsmst",
      LTBDate: "ltbDate",
      EOLDate: "eolDate",
    },
  },
  getLoginUserFullName: function (req) {
    return req
      ? COMMON.stringFormat(
          "({0}) {1} {2}",
          req.user.employee.initialName,
          req.user.firstName,
          req.user.lastName
        )
      : "";
  },
  getLoginUserID: function () {
    return loggedInUser.id.toString();
  },
  //------------------------- [E] Model creation for Elastic Search ---------------------------
  retriveArrayObject: function (detailObj, field) {
    return Array.isArray(detailObj[field])
      ? detailObj[field]
      : detailObj[field]
      ? [detailObj[field]]
      : [];
  },
  setLoggedInUser: function (user) {
    loggedInUser = user;
  },
  DYNAMIC_MESSAGE_CATEGORY: [
    "GLOBAL",
    "USER",
    "EMPLOYEE",
    "MASTER",
    "PARTS",
    "RFQ",
    "RECEIVING",
    "MFG",
    "REPORT",
  ],
  DYNAMIC_MESSAGE_CONFIGURATION: {
    DEFAULT_FOLDER_PATH: "../constant_json/dynamic_message/",
    UPLOAD_FOLDER_PATH: "/constant_json/dynamic_message/",
    BACKUP_FOLDER_UPLOAD_PATH: "/constant_json/dynamic_message/",
    BACKUP_FOLDER: "backup_message_file",
    MODULE_NAME: "DYNAMIC_MESSAGE",
    NAME: "DYNAMIC_MESSAGE",
    USED_AT: "ui",
  },
  ELASTIC_ENTITY_CONFIGURATION: {
    DEFUALT_FOLDER_ENTITY_PATH: "../constant_json/entity_json/",
    UPLOAD_FOLDER_ENTITY_PATH: "/constant_json/entity_json/",
    BACKUP_FOLDER_ENTITY_PATH: "/constant_json/entity_json/",
    FILE_NAME: "ELASTIC_ENTITY",
  },
  setTextAngularAPIKeyCode: function (keyCodeValue) {
    textAngularAPIKeyCode = keyCodeValue;
  },
  setTextAngularWebKeyCode: function (keyCodeValue) {
    textAngularWebKeyCode = keyCodeValue;
  },
  setTextAngularValueForDB: function (description) {
    if (description) {
      if (
        !textAngularAPIKeyCode ||
        !config.APIUrl ||
        !textAngularWebKeyCode ||
        !config.WebsiteBaseUrl
      ) {
        throw new Error(
          "System configuration is missing for text editor. Please contact to administrator/developer."
        );
      }
      if (textAngularAPIKeyCode && config.APIUrl) {
        description = description.replace(
          new RegExp(config.APIUrl, "g"),
          textAngularAPIKeyCode
        );
      }
      if (textAngularWebKeyCode && config.WebsiteBaseUrl) {
        description = description.replace(
          new RegExp(config.WebsiteBaseUrl, "g"),
          textAngularWebKeyCode
        );
      }
    }
    return description;
  },
  getTextAngularValueFromDB: function (description) {
    if (description) {
      if (
        !textAngularAPIKeyCode ||
        !config.APIUrl ||
        !textAngularWebKeyCode ||
        !config.WebsiteBaseUrl
      ) {
        throw new Error(
          "System configuration is missing for text editor. Please contact to administrator/developer."
        );
      }

      if (textAngularAPIKeyCode && config.APIUrl) {
        description = description.replace(
          new RegExp(textAngularAPIKeyCode, "g"),
          config.APIUrl
        );
      }
      if (textAngularWebKeyCode && config.WebsiteBaseUrl) {
        description = description.replace(
          new RegExp(textAngularWebKeyCode, "g"),
          config.WebsiteBaseUrl
        );
      }
    }
    return description;
  },
  CommonCategoryCodeValidation: /^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]*$/,
  CommonCategoryNameValidation: /^[^`~!@#$%\^*()_+={}[\]\\:';"<>?/]*$/,
  CommonGenericCategoryCodeValidation: /^[^`~!@#$%\^*()+={}|[\]\\:';"<>?,./]*$/,

  CalcSumofArrayElement: (array, Precision) => {
    const newArrayForSum = _.map(array, (data) => (data || 0) * 100);
    const sumOfArray = (_.sum(newArrayForSum) || 0) / 100;
    return COMMON.roundUpNum(sumOfArray || 0, Precision);
  },

  multipleUnitValue: (numberOne, numberTwo) => {
    const multipleValue =
      ((((numberOne || 0) * 100) / 100) * ((numberTwo || 0) * 100)) / 100;
    return COMMON.roundUpNum(multipleValue, 2);
  },
  roundUpNum: (Number, Precision) => parseFloat(Number.toFixed(Precision)),
  setCustomerInvoice: (req, value) => {
    if (req.body) {
      if (value < 10) {
        value = COMMON.stringFormat("0{0}", value);
      }
      req.body["invoiceNumber"] = COMMON.stringFormat(
        "{0}{1}{2}",
        COMMON.PrefixForGeneratePackingSlip.invoiceNumberSlip,
        req.body["invoiceNumber"],
        value
      );
    }
  },
  setCustomerCreditMemo: (req, value) => {
    if (req.body) {
      if (value < 10) {
        value = COMMON.stringFormat("0{0}", value);
      }
      req.body["creditMemoNumber"] = COMMON.stringFormat(
        "{0}{1}{2}",
        COMMON.PrefixForGeneratePackingSlip.creditMemo,
        req.body["creditMemoNumber"],
        value
      );
    }
  },
  TRANSACTION_TIMEOUT_ERROR: {
    ERROR: 1205,
    ERRORMESSAGE: "Resource is busy. Please save again",
  },
  removeElementFromArray: (arrayElementsObj, elementNameToRemove) => {
    var idx = arrayElementsObj.indexOf(elementNameToRemove);
    if (idx >= 0) {
      arrayElementsObj.splice(idx, 1);
    }
  },
});

module.exports = COMMON;
