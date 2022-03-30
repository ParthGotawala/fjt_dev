(function () {
  'use strict';

  angular
    .module('fuse')
    .config(config);

  /** @ngInject */
  function config($translateProvider, $httpProvider, $mdColorPickerProvider, $provide, DialogFactoryProvider, CORE, $mdAriaProvider,
    $mdDateLocaleProvider, hotkeysProvider, IdleProvider, KeepaliveProvider) {
    // Put your common app configurations here

    // disable ARIA warnings into console
    $mdAriaProvider.disableWarnings();

    // angular-translate configuration
    $translateProvider.useLoader('$translatePartialLoader', {
      urlTemplate: '{part}/i18n/{lang}.json'
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('sanitize');

    function saveSelection() {
      var sel = window.getSelection(), ranges = [];
      if (sel.rangeCount) {
        for (var x = 0, len = sel.rangeCount; x < len; ++x) {
          ranges.push(sel.getRangeAt(x));
        }
      }
      return ranges;
    };

    function restoreSelection(savedSelection) {
      if (savedSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
        for (var x = 0, len = savedSelection.length; x < len; ++x) {
          sel.addRange(savedSelection[x]);
        }
      }
    };

    // Text Angular options
    $provide.decorator('taOptions', [
      'taRegisterTool', 'taSelection', '$delegate', function (taRegisterTool, taSelection, taOptions) {
        taOptions.toolbar = [
          ['bold', 'italics', 'underline', 'ul', 'ol', 'quote']
        ];
        taOptions.classes = {
          focussed: 'focussed',
          toolbar: 'ta-toolbar',
          toolbarGroup: 'ta-group',
          toolbarButton: 'md-button',
          toolbarButtonActive: 'active',
          disabled: '',
          textEditor: 'form-control',
          htmlEditor: 'form-control'
        };

        // add camara icon to toolbar for web-cam capture
        taRegisterTool('camara', {
          display:'<button type="button" class="md-button" name="camara" id="toolbarCamera"><i class="icon-camera"></i></button>',
          //iconclass: "icon-camera",
          action: function (promise) {
            //create dummy event for Dialog to follow theme
            let ev = angular.element.Event('click');
            angular.element('body').trigger(ev);
            ev.preventDefault();

            var DialogFactory = DialogFactoryProvider.$get();

            DialogFactory.dialogService(
              CORE.CAMERA_CAPTURE.CONTROLLER,
              CORE.CAMERA_CAPTURE.VIEW,
              ev,
              null).then((res) => {
                this.$editor().displayElements.text.trigger('focus');
                let imageDetails = {};
                imageDetails.finaldataURL = res.croppedImage;
                imageDetails.name = `${new Date().getTime()}.png`;
                this.$editor().cameraFileUpload(imageDetails);
                promise.resolve();
              }, () => {
                promise.resolve();
              }, (error) => {
                promise.reject(error);
              });
          }
        });

        taOptions.toolbar[0].push('camara');
        //register tool for upload video
        taRegisterTool('uploadVideo', {
          iconclass: "icon-filmstrip",
          action: function (promise) {
            //create dummy event for Dialog to follow theme
            savedSel = saveSelection();
            let ev = angular.element.Event('click');
            angular.element('body').trigger(ev);
            ev.preventDefault();

            var DialogFactory = DialogFactoryProvider.$get();

            DialogFactory.dialogService(
              CORE.VIDEO_FILE_UPLOAD_POPUP_CONTROLLER,
              CORE.VIDEO_FILE_UPLOAD_POPUP_VIEW,
              ev,
              null).then((res) => {
                //this.$editor().displayElements.text.trigger('focus');
                restoreSelection(savedSel);
                if (res && res.length > 0)
                  this.$editor().videoFileUpload(res);

                promise.resolve();
              }, () => {
                promise.resolve();
              }, (error) => {
                promise.reject(error);
              });
          }
        });

        taOptions.toolbar[0].push('uploadVideo');

        // register tool for set font color
        /* Issue: cannot bind color on selected text 
             it will bind selected color on whole line 
             */

        var savedSel = null;
        taRegisterTool('fontColor', {
          iconclass: "icon-format-color",
          //display: "<div ng-model='color' icon='icon-paint-brush' options='options' attr-new='{{color}}'></div>",
          action: function (color) {

            var me = this;
            savedSel = saveSelection();
            var mdColorPicker = $mdColorPickerProvider.$get();
            var selectedText = '';
            //selectedText = taSelection.getSelectedElement().toString();
            let selectedelement = taSelection.getSelection();
            selectedText = selectedelement.container.innerHTML;
            //create dummy event for Dialog to follow theme
            let ev = angular.element.Event('click');
            angular.element('body').trigger(ev);
            ev.preventDefault();
            mdColorPicker.show({
              value: this.color,
              genericPalette: true,
              $event: ev,
              mdColorHistory: false,
              mdColorAlphaChannel: false,
              mdColorSliders: false,
              mdColorGenericPalette: false,
              mdColorMaterialPalette: false,
            }).then(function (color) {
              restoreSelection(savedSel);
              return me.$editor().wrapSelection('foreColor', color);
            }, function (err) { });
          },
          options: {
            replacerClassName: 'icon-format-color', showButtons: true
          },
          color: "#000"
        });
        taOptions.toolbar[0].push('fontColor');

        // register tool for set Back ground color
        /* Issue: cannot bind color on selected text back ground
             it will bind selected color on whole line 
             */
        taRegisterTool('backGroundColor', {
          iconclass: "icon-format-color-fill",
          //display: "<div ng-model='color' icon='icon-format-color-fill' options='options' attr-new='{{color}}'></div>",
          action: function (color) {
            var me = this;
            savedSel = saveSelection();
            var mdColorPicker = $mdColorPickerProvider.$get();
            var selectedText = '';
            //selectedText = taSelection.getSelectedElement().toString();
            let selectedelement = taSelection.getSelection();
            selectedText = selectedelement.container.innerHTML;
            //create dummy event for Dialog to follow theme
            let ev = angular.element.Event('click');
            angular.element('body').trigger(ev);
            ev.preventDefault();
            mdColorPicker.show({
              value: this.color,
              genericPalette: true,
              $event: ev,
              mdColorHistory: false,
              mdColorAlphaChannel: false,
              mdColorSliders: false,
              mdColorGenericPalette: false,
              mdColorMaterialPalette: false,
            }).then(function (color) {
              restoreSelection(savedSel);
              me.$editor().wrapSelection('backColor', color);
            }, function (err) { });
          },
          options: {
            replacerClassName: 'icon-format-color-fill', showButtons: true
          },
          color: "#000"
        });
        taOptions.toolbar[0].push('backGroundColor');

        taRegisterTool('fontName', {
          display:
            "<md-menu-bar>" +
            "<md-menu>" +
            "<button ng-click='$mdMenu.open()'>" +
            "<div layout='row' layout-align='center center'>" +
            "<span class='username cm-font-name'><md-icon class='mdi mdi-format-font'></md-icon</span>" +
            "<md-icon md-font-icon='icon-chevron-down' class='icon s16'></md-icon>" +
            " </div>" +
            "</button>" +
            "<md-menu-content>" +
            "<md-menu-divider></md-menu-divider>" +
            " <md-menu-item ng-repeat='o in options'>" +
            "<md-button  ng-click='action($event, o.css)'><i ng-if='o.active' class='fa fa-check'></i>{{o.name}}</md-button>" +
            "</md-menu-item>" +
            "</md-menu-content>" +
            "</md-menu>" +
            "</md-menu-bar>",
          action: function (event, font) {
            //Ask if event is really an event.
            if (!!event.stopPropagation) {
              //With this, you stop the event of textAngular.
              event.stopPropagation();
              //Then click in the body to close the dropdown.
              $("body").trigger("click");
            }
            return this.$editor().wrapSelection('fontName', font);
          },
          options: [
            { name: 'Sans-Serif', css: 'Arial, Helvetica, sans-serif' },
            { name: 'Serif', css: "'times new roman', serif" },
            { name: 'Wide', css: "'arial black', sans-serif" },
            { name: 'Narrow', css: "'arial narrow', sans-serif" },
            { name: 'Comic Sans MS', css: "'comic sans ms', sans-serif" },
            { name: 'Courier New', css: "'courier new', monospace" },
            { name: 'Garamond', css: 'garamond, serif' },
            { name: 'Georgia', css: 'georgia, serif' },
            { name: 'Tahoma', css: 'tahoma, sans-serif' },
            { name: 'Trebuchet MS', css: "'trebuchet ms', sans-serif" },
            { name: "Helvetica", css: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
            { name: 'Verdana', css: 'verdana, sans-serif' },
            { name: 'Proxima Nova', css: 'proxima_nova_rgregular' }

          ]
        });
        taRegisterTool('fontSize', {
          display: "<md-menu-bar>" +
            "<md-menu>" +
            "<button ng-click='$mdMenu.open()'>" +
            "<div layout='row' layout-align='center center'>" +
            "<span class='username cm-font-name'><md-icon class='icon-format-text'></md-icon</span>" +
            "<md-icon md-font-icon='icon-chevron-down' class='icon s16'></md-icon>" +
            " </div>" +
            "</button>" +
            "<md-menu-content>" +
            "<md-menu-divider></md-menu-divider>" +
            " <md-menu-item ng-repeat='o in options'>" +
            "<md-button   ng-click='action($event, o.value)'><i ng-if='o.active' class='fa fa-check'></i>{{o.name}}</md-button>" +
            "</md-menu-item>" +
            "</md-menu-content>" +
            "</md-menu>" +
            "</md-menu-bar>",
          action: function (event, size) {
            //Ask if event is really an event.
            if (!!event.stopPropagation) {
              //With this, you stop the event of textAngular.
              event.stopPropagation();
              //Then click in the body to close the dropdown.
              $("body").trigger("click");
            }
            return this.$editor().wrapSelection('fontSize', parseInt(size));
          },
          options: [
            { name: 'xx-small', css: 'xx-small', value: 1 },
            { name: 'x-small', css: 'x-small', value: 2 },
            { name: 'small', css: 'small', value: 3 },
            { name: 'medium', css: 'medium', value: 4 },
            { name: 'large', css: 'large', value: 5 },
            { name: 'x-large', css: 'x-large', value: 6 },
            { name: 'xx-large', css: 'xx-large', value: 7 }
          ]
        });


        //if (showEditorSettings) {
        taRegisterTool('toolsSetting', {
          iconclass: "icon-cog",
          action: function () {
            let _elem = this.$element;
            var _myTargetElement = _elem.parent();
            angular.forEach(_myTargetElement[0].children, function (value, key) {
              if (value.name != "toolsSetting") {
                if (value.style.display == "none") {
                  value.style.display = "block";
                } else {
                  value.style.display = "none";
                }
              }
            });
          }
        });

        //if (showEditorSettings) {
        taRegisterTool('toolbarFullscreen', {
          display: '<button type="button" class="md-button" name="toolbarFullscreen" id="toolbarFullscreen"><i class="icon-fullscreen"></i></button>',
          //iconclass: "icon-fullscreen",
          action: function () {
            let _elem = this.$element;
            if (_elem) {
              let fullScreeenIcon = _elem.find(".icon-fullscreen");
              let fullScreeenExitIcon = _elem.find(".icon-fullscreen-exit");
              if (fullScreeenIcon.length > 0) {
                fullScreeenIcon[0].className = "icon-fullscreen-exit";
              }
              if (fullScreeenExitIcon.length > 0) {
                fullScreeenExitIcon[0].className = "icon-fullscreen";
              }
            }
            $(_elem).parents("text-angular").toggleClass("fullscreen-view");
            $(_elem).parents("md-dialog").toggleClass("ui-grid-fullscreen-view");
          }
        });
        taOptions.toolbar[0].push('toolbarFullscreen');

        // add the button to the default toolbar definition     
        taOptions.toolbar[0].push('fontSize', 'fontName', 'toolsSetting');
        //}
        taRegisterTool('notes', {
          display: "<span id='toolbarNOTES' title='" + CORE.MESSAGE_CONSTANT.EDITOR_DRAG_AND_DROP_MESSAGE + "'>1." + CORE.MESSAGE_CONSTANT.EDITOR_DRAG_AND_DROP_MESSAGE + "</span><span id='toolbarNOTES' title='" + (CORE.MESSAGE_CONSTANT.EDITOR_ADD_IMAGE_MESSAGE || '').replace(/\'/gi,'') + "' class='ph-4 md-truncate'>2." + CORE.MESSAGE_CONSTANT.EDITOR_ADD_IMAGE_MESSAGE + "</span>"
          //action: function () {
          //    this.$editor().wrapSelection('forecolor', 'red');
          //}
        });
        // add the button to the default toolbar definition
        taOptions.toolbar[0].push('notes');
        return taOptions;
      }
    ]);

    // Text Angular tools
    $provide.decorator('taTools', [
      '$delegate', function (taTools) {
        taTools.quote.iconclass = 'icon-format-quote';
        taTools.bold.iconclass = 'icon-format-bold';
        taTools.italics.iconclass = 'icon-format-italic';
        taTools.underline.iconclass = 'icon-format-underline';
        taTools.strikeThrough.iconclass = 'icon-format-strikethrough';
        taTools.ul.iconclass = 'icon-format-list-bulleted';
        taTools.ol.iconclass = 'icon-format-list-numbers';
        taTools.redo.iconclass = 'icon-redo';
        taTools.undo.iconclass = 'icon-undo';
        taTools.clear.iconclass = 'icon-close-circle-outline';
        taTools.justifyLeft.iconclass = 'icon-format-align-left';
        taTools.justifyCenter.iconclass = 'icon-format-align-center';
        taTools.justifyRight.iconclass = 'icon-format-align-right';
        taTools.justifyFull.iconclass = 'icon-format-align-justify';
        taTools.indent.iconclass = 'icon-format-indent-increase';
        taTools.outdent.iconclass = 'icon-format-indent-decrease';
        taTools.html.iconclass = 'icon-code-tags';
        taTools.insertImage.iconclass = 'icon-file-image-box';
        taTools.insertLink.iconclass = 'icon-link';
        taTools.insertVideo.iconclass = 'icon-filmstrip';
        return taTools;
      }
    ]);

    $httpProvider.interceptors.push('CustomHttpInterceptorFactory');

    //Set Default Date Validation
    $mdDateLocaleProvider.formatDate = function (date) {
      return date ? moment(date).format(_dateDisplayFormat.toUpperCase()) : null;
    };

    $mdDateLocaleProvider.parseDate = function (dateString) {
      var m = moment(dateString, _dateDisplayFormat.toUpperCase(), true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };

    IdleProvider.idle(_configIdleTime); // in seconds
    IdleProvider.timeout(_configTimeOutCountdown); // in seconds
    KeepaliveProvider.interval(_configTimeOutCountdown); // in seconds
  }

  // Added new for configuration setting after version upgrader from 1.6.4 to 1.7.4
  angular.module('fuse').config(function (pdfjsViewerConfigProvider) {
    angular.lowercase = angular.$$lowercase;
    angular.uppercase = angular.$$uppercase;

    pdfjsViewerConfigProvider.setWorkerSrc("/bower_components/pdf.js-viewer/pdf.worker.js");
    pdfjsViewerConfigProvider.setCmapDir("/bower_components/pdf.js-viewer/cmaps");
    pdfjsViewerConfigProvider.setImageDir("/bower_components/pdf.js-viewer/images");

    pdfjsViewerConfigProvider.disableWorker();
    pdfjsViewerConfigProvider.setVerbosity("infos"); 
  });
})();
