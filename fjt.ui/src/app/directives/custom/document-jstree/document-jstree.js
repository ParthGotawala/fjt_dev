(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('documentJstree', documentJstree);

  /** @ngInject */
  function documentJstree($state, $compile, $timeout, $document, TRAVELER, REPORTS) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        name: '=',
        source: '=',
        tagList: '=',
        tagListDisplayproperty: '=',
        treeNodeCreator: '&?',
        nodeMap: '=?',
        onItemCreated: '&?',
        onItemRenamed: '&?',
        onItemUpload: '&?',
        onItemRemoved: '&?',
        onItemCopied: '&?',
        onItemMoved: '&?',
        onItemSelected: '&?',
        onItemArchived: '&?',
        onItemDownload: '&?',
        onTreeLoad: '&?',
        addRootItem: '&?',
        sortKey: '=?',
        checkboxes: '=?',
        contextmenu: '=?',
        excludeContextMenuFor: '=?',
        options: '=?',
        isReadOnly: '=?',
        divClass: '=',
        isContextMenu: '=?'
      },
      link: function (scope, element, attrs) {
        (function ($scope, $element) {
          var plugins = ['json_data', 'ui', 'cookies', 'types', 'hotkeys', 'unique', 'contextmenu', 'contextmenubtn', 'search'];
          var selectedNode;
          var isFolderCreating = false;
          // var tree = [];
          if ($scope.checkboxes) {
            plugins.push('checkbox');
            $element.addClass('jstree-checkboxes');
          }
          if ($scope.isReadOnly === undefined) {
            $scope.isReadOnly = false;
          }

          if ($scope.contextmenu === undefined) {
            $scope.contextmenu = true;
          }

          if ($scope.contextmenu) {
            plugins.push('contextmenu');
          }

          // Bind mouse move event
          let pageX = 0;
          let pageY = 0;
          $document.bind('mousemove', mousemove);
          function mousemove(event) {
            pageX = event.pageX + 5;
            pageY = event.pageY + 5;
          }
          // Bind mouse move event

          let IsSupplierPortalScreen = false;
          if (window.location.pathname !== null && (window.location.pathname.indexOf('SupplierPricing') !== -1 || window.location.pathname.indexOf('AlternetPartNumber') !== -1)) { IsSupplierPortalScreen = true; }
          const menu = {
            create: {
              'separator_before': false,
              'separator_after': false,
              'label': 'New Folder',
              'icon': 'fa fa-plus',
              'action': function (obj) {
                onCreateFolder(obj);
              }
            },
            addFiles: {
              'separator_before': false,
              'separator_after': false,
              'label': 'Upload Document',
              'icon': 'fa fa-upload',
              'action': function (obj) {
                onUploadFile(obj);
              }
            },
            copy: {
              'separator_before': false,
              'separator_after': false,
              'label': 'Copy',
              'icon': 'fa fa-copy',
              'action': function (obj) {
                onCopied(obj);
              }
            },
            rename: {
              'separator_before': false,
              'separator_after': false,
              'label': 'Rename',
              'icon': 'fa fa-pencil',
              'action': function () {
                var selected = jstree.get_selected();
                if (!selected.length) {
                  return false;
                }
                selected = selected[0];
                jstree.edit(selected);
              }
            },
            remove: {
              'separator_before': false,
              'separator_after': false,
              'label': 'Remove',
              'icon': 'fa fa-trash-o',
              'action': function () {
                onRemoveFolder();
              }
            },
            archive: {
              'separator_before': false,
              'separator_after': false,
              'label': 'Archive',
              'icon': 'fa fa-file-archive-o',
              'action': function () {
                onArchiveFolder();
              }
            },
            unarchive: {
              'separator_before': false,
              'separator_after': false,
              'label': 'Un-Archive',
              'icon': 'fa fa-file',
              'action': function () {
                onArchiveFolder();
              }
            },
            download: {
              'separator_before': false,
              'separator_after': false,
              'label': 'Download',
              'icon': 'fa fa-download',
              'action': function () {
                onDownloadFolder();
              }
            },
            moveFolder: {
              'separator_before': false,
              'separator_after': false,
              'label': 'Move Folder',
              'icon': 'icon-folder-move',
              'action': function (obj) {
                onMoveFolder(obj);
              }
            }
          };

          function getMenu(node) {
            if (node && $scope.isContextMenu === false) {
              return null;
            }
            // Disable context menu of parent node and for traveler page
            if (node.original.parent === '#' || $state.current.name === TRAVELER.TRAVELER_MANAGE_STATE || node.original.isProtected || node.original.isReadOnly) {
              return [];
            }
            const RetMenu = angular.copy(menu);
            let HasFile = false;
            if (IsSupplierPortalScreen) {
              //$scope.isReadOnly = false;
              delete RetMenu['remove'];
            }
            if (node.original.type === 'Folder') {
              if (node.children.length === 0) {
                HasFile = true;
              }
              else {
                angular.forEach(node.children, (child) => {
                  if (child.type === 'Document') {
                    HasFile = true;
                  }
                });
              }
              if (HasFile) {
                delete RetMenu['archive'];
                delete RetMenu['unarchive'];
              }
            }

            if (node.original.type === 'Document') {
              delete RetMenu['addFiles'];
              delete RetMenu['create'];
            }

            if (node.parent === '#') {
              delete RetMenu['remove'];
            }

            if ($scope.isReadOnly) {
              delete RetMenu['remove'];
              delete RetMenu['rename'];
              delete RetMenu['tags'];
              delete RetMenu['addFiles'];
              delete RetMenu['create'];
              delete RetMenu['unarchive'];
              delete RetMenu['archive'];
              delete RetMenu['moveFolder'];
            }
            if ($scope.$parent.$parent.DocType === 'Design Layout') {
              delete RetMenu['rename'];
              delete RetMenu['tags'];
              delete RetMenu['create'];
              delete RetMenu['unarchive'];
            }
            if (node.original.isParent) {
              delete RetMenu['rename'];
              delete RetMenu['remove'];
              delete RetMenu['moveFolder'];
            }
            // Default remove below option
            delete RetMenu['copy'];
            delete RetMenu['download'];
            delete RetMenu['archive'];
            delete RetMenu['unarchive'];
            return RetMenu;
          }
          const jstreeOptions = {
            'core': {
              'themes': {
                'responsive': true,
                'dots': false
              },
              'multiple': false,
              'check_callback': true,
              'data': typeof $scope.source === 'string' ?
                {
                  url: function () { return $scope.source; }, data: function (node) {
                    return { 'id': node.id };
                  }
                }
                : function () { }
            },
            'sort': function (n1, n2) {
              try {
                const node1 = jstree.get_node(n1).original;
                const node2 = jstree.get_node(n2).original;

                if (node1.sortOrder === undefined || node2.sortOrder === undefined) {
                  return 1;
                }

                return node1.sortOrder > node2.sortOrder ? 1 : -1;
              } catch (e) {
                return 1;
              }
            },
            'contextmenu': {
              'show_at_node': false,
              'items': getMenu
            },
            'checkbox': {
              'visible': !!$scope.checkboxes,
              'three_state': false
            },

            'types': {
              default: {
                icon: 'fa fa-folder icon-category icon-lg'
              },
              'document': {
                icon: 'fa fa-file icon-category icon-lg'
              },
              'folder': {
                icon: 'icon-folder folder-color'
              },
              'detail': {
                icon: 'icon-receipt workorder-tree-icon'
              },
              'otherdetail': {
                icon: 'mdi mdi-format-page-break workorder-tree-icon'
              },
              'dodont': {
                icon: 'icon-format-strikethrough workorder-tree-icon'
              },
              'document': {
                icon: 'icon-library-books workorder-tree-icon'
              },
              'datafields': {
                icon: 'icon-spotlight workorder-tree-icon'
              },
              'supplyandmaterial': {
                icon: 'icon-memory workorder-tree-icon'
              },
              'equipmentandtool': {
                icon: 'icon-etsy workorder-tree-icon'
              },
              'employee': {
                icon: 'icon-account-box-outline workorder-tree-icon'
              },
              '1starticle': {
                icon: 'icon-numeric workorder-tree-icon'
              },
              'standard': {
                icon: 'icon-verified workorder-tree-icon'
              },
              'operationmain': {
                icon: 'icon-cog-box workorder-tree-icon'
              },
              'shipping': {
                icon: 'icon-cart-outline workorder-tree-icon'
              },
              'invitepeople': {
                icon: 'icon-account-multiple-plus workorder-tree-icon'
              },
              'status': {
                icon: 'icon-checkerboard workorder-tree-icon'
              },
              'operation': {
                icon: 'icon-steam workorder-tree-icon'
              },
              'customforms-dataelementlist': {
                icon: 'icon-library-books workorder-tree-icon'
              },
              'customforms-managedataelement': {
                icon: 'icon-spotlight workorder-tree-icon'
              }
            },
            'plugins': plugins
          };

          $scope.options = jstreeOptions;
          let jstree;
          let treeElement;
          const tempNodeId = 99999999;
          const loadingIcon = 'src/app/directives/vendor/js-tree/dist/themes/default/throbber.gif';
          const initUI = function () {
            if (jstree) {
              jstree.destroy();
              treeElement.remove();
            }
            treeElement = $('<div class="' + $scope.divClass + '"></div>').appendTo($element);
            if ($scope.$parent.callFrom !== undefined && $scope.$parent.callFrom === 'Quote') {
              $scope.DocumentAcceptedExtension = $scope.$parent.AllowedExtentions;
            }
            else {
              $scope.DocumentAcceptedExtension = '.GP2,.G2,.xlsx,.csv,.GM15,.xls,.GM16,.xlsm,.RUL,.msg,.docx,.GPT,.BOM,.GG1,.dwg,.GTS,.jpg,.gwk,.GBP,.GM2,.rar,.pdf,.DRR,.GBS,.DRL,.GP1,.GTP,.apr,.par,.GBL,.GPB,.wrk,.brd,.bak,.pcb,.zip,.GBO,.7Z,.pho,.GTL,.tif,.txt,.asc,.TMP,.GTO,.GM13,.APR_LIB,.GM1,.GKO,.REP,.gbr,.bin,.EXTREP,.LDP,.G1,.doc,.htm,.pptx,.png,.GD1';
            }
            treeElement.jstree(jstreeOptions);
            jstree = treeElement.jstree(true);
            bindEvents();
          };

          const bindEvents = function () {
            treeElement.on('rename_node.jstree', (e, data) => {
              onRenameFolder(data);
            })
              .on('set_text.jstree', () => {
                // Set Limit for enter max length of Folder name
                $timeout(() => {
                  $('.jstree-rename-input').attr('maxLength', 255);
                }, 100);
              })
              .on('create_node.jstree', (e, data) => {
                onAfterCreateFolder(data);
              }).on('select_node.jstree', (e, data) => {
                $('.div-tt-zone').remove();
                onFolderSelect(data);
              }).on('changed.jstree', (e, data) => {
                if (data.action === 'select_node' || data.action === 'deselect_node') {
                  $('.div-tt-zone').remove();
                  onSelectionChanged(data);
                }
              })
              .on('hover_node.jstree', (e, data) => {
                if (data && data.node && data.node.original && data.node.original.text) {
                  const table = '<table>\
                                    <tbody>\
                                        <tr>\
                                            <th colspan="2">' + (data.node.original.tooltip ? data.node.original.tooltip : data.node.original.text) + '</th>\
                                        </tr> \
                                    </tbody>\
                                </table>';
                  const div = document.createElement('div');
                  div.className = 'div-tt-zone';
                  div.id = 'EDTooltip';
                  div.style.left = pageX + 'px';
                  div.style.top = pageY + 'px';
                  div.style.zIndex = '99';
                  div.innerHTML = table;
                  document.body.appendChild(div);
                }
              })
              .on('dehover_node.jstree', () => {
                // Added jQuery for removing all tooltips with this class name
                $('.div-tt-zone').remove();
              })
              .on('after_open.jstree', (e, data) => {
                var id = data.node.id;
                var obj = angular.element('#documenttree').find('li[id=' + id + '] > a');
                obj.parent().find('a').each(function () {
                  $compile(this)($scope);
                });
              })
              .on('click.jstree', '.jstree-contextmenubtn', $.proxy((e) => {
                e.stopImmediatePropagation();
                $(e.target).closest('.jstree-node').children('.jstree-anchor').trigger('contextmenu');
              }, this))
              .on('ready.jstree', (e, data) => {
                // invoked after jstree has loaded
                if (selectedNode) {
                  // check selected Node is available or not, if available than set selected node it self.
                  const selectedItem = _.find($scope.source, (node) => node.id === selectedNode.id);
                  if (selectedItem) {
                    selectedNode = selectedItem;
                  } else {
                    // check selected Node parent available or not, if available than set selected node parent.
                    const selectedParent = checkParent(selectedNode.parent);
                    if (selectedParent) {
                      selectedNode = selectedParent;
                    } else {
                      // default selected first item.
                      selectedNode = _.find($scope.source, (node) => node.isSelected === true);
                    }
                  }
                  selectFolderAfterLoadTree(data, selectedNode);
                } else {
                  selectedNode = _.find($scope.source, (node) => node.isSelected === true);
                  if (selectedNode) {
                    selectFolderAfterLoadTree(data, selectedNode);
                  } else {
                    /* when no any node selected then call method without selectedNode */
                    selectFolderAfterLoadTree(data, null);
                  }
                }
              });
          };
          const checkParent = (selectedNodeId) => _.find($scope.source, (node) => node.id === selectedNodeId);
          const fillJsTreeData = function () {
            if (typeof $scope.source === 'string') {
              return;
            }
            jstree.settings.core.data = $scope.source;
            jstree.refresh();
            if ($state.current.name && $state.current.name.indexOf(REPORTS.PO_STATUS_REPORT_STATE) !== -1) {
              _exactSearchForTree = true;
            } else {
              _exactSearchForTree = false;
            }
          };
          function onSelectionChanged(data) {
            angular.forEach($scope.source, (item) => {
              item.selected = $.inArray(item.id, data.selected) >= 0;
            });
            $timeout(() => {
              $scope.$apply();
            });
          };

          function selectFolderAfterLoadTree(data, selectedNode) {
            if ($scope.onTreeLoad) {
              $scope.onTreeLoad({ item: selectedNode });
            } else {
              if (treeElement) {
                /* changed by KS : for postatus report as first may be no any no selected
                    that time also need to call selected node function */
                treeElement.jstree('select_node', (selectedNode ? selectedNode.id : null));
              }
            }
          };

          function onFolderSelect(data) {
            if ($scope.onItemSelected) {
              if (typeof $scope.source === 'string') {
                $scope.onItemSelected({ item: { id: data.node.original.id, name: data.node.original.text, sortOrder: data.node.original.sortOrder } });
              } else {
                $scope.onItemSelected({ item: data.node.original });
              }
              selectedNode = data.node.original;
              $timeout(() => {
                $scope.$apply();
              });
            }
            $('span[name=\'contextButton\']').bind('click', (e) => {
              e.preventDefault();
              e.stopImmediatePropagation();
              e.stopPropagation();
              $(e.target).closest('.jstree-node').children('.jstree-anchor').trigger('contextmenu');
              return false;
            });
          };
          function onDownloadFolder() {
            var selected = jstree.get_selected(true);
            if (!selected.length) {
              return false;
            }
            selected = selected[0];
            if ($scope.onItemDownload) {
              $scope.onItemDownload({
                item: selected.original,
                callback: function () {
                }
              });
            }
          };

          function onMoveFolder() {
            var selected = jstree.get_selected(true);
            if (!selected.length) {
              return false;
            }
            selected = selected[0];
            if ($scope.onItemMoved) {
              selected.original.children = selected.children_d;
              $scope.onItemMoved({
                item: selected.original,
                isfolder: true
              });
            }
          };
          function onArchiveFolder() {
            var selected = jstree.get_selected(true);
            if (selected === null) {
              return;
            }

            const msgText = selected[0].icon === 'jstree-zip' ? 'un-archive' : 'archive';
            const sweetalertData = {
              ConfirmMessage: 'Are you sure you want to ' + msgText + ' ' + selected[0].text + ' ?',
              Type: common.WarningType,
              ConfirmBtn: common.OK,
              CancelBtn: common.Cancel
            };
            common.CommonSweetAlertConfirm(sweetalertData, (yes) => {
              if (!yes) {
                return;
              }
              else {
                if (!selected.length) {
                  return false;
                }
                selected = selected[0];
                jstree.set_icon(selected, loadingIcon);
                if ($scope.onItemArchived) {
                  $scope.onItemArchived({
                    item: selected.original,
                    callback: function (renamedItem) {
                      if (renamedItem.isFile === true) {
                        //if (renamedItem.Archive)
                        //   jstree.set_icon(selected, 'jstree-zip');
                        //else
                        jstree.set_icon(selected, 'jstree-file');
                      }
                      else {
                        SetChildLogo(renamedItem);
                        jstree.select_node(selected.id);
                        jstree.set_icon(selected, 'jstree-folder');
                      }

                      //SetNode($scope.source[0], renamedItem);
                      jstree.select_node(selected.id);
                    }
                  });
                }
              }
            });
          };
          // function SetNode(Source, EditNode) {
          //     if (Source.Id === EditNode.Id) {
          //         Source = angular.copy(EditNode);
          //     }
          //     else {
          //         angular.forEach(Source.children, (data) => {
          //             SetNode(data, EditNode);
          //         });
          //     }
          // }
          function SetChildLogo(nodedata) {
            angular.forEach(nodedata.children, (data) => {
              if (data.isFile === true) {
                const Orgselected = jstree.get_selected(true);
                jstree.deselect_node(Orgselected[0].id);
                jstree.select_node(data.Id);
                const selected = jstree.get_selected(true);
                jstree.set_icon(selected[0], 'jstree-file');
                jstree.deselect_node(selected[0].id);
                jstree.select_node(Orgselected[0].id);
              }
            });
          }

          function onRemoveFolder() {
            var selected = jstree.get_selected(true);
            if (!selected.length) {
              return false;
            }
            selected = selected[0];
            const originalIcon = jstree.get_icon(selected);
            jstree.set_icon(selected, loadingIcon);
            jstree.disable_node(selected);
            $scope.onItemRemoved({
              item: selected.original,
              callback: function (folderDetail) {
                jstree.enable_node(selected);
                jstree.set_icon(selected, originalIcon);
                if (folderDetail) {
                  jstree.delete_node(selected);
                }
              }
            });
          };

          function onAfterCreateFolder() {
            $compile($element.contents())($scope);
          };
          function onRenameFolder(data) {
            var item = angular.copy(data.node.original);
            if (typeof $scope.source === 'string') {
              item = angular.copy(data.node.original);
            }
            item.Name = data.text;
            const iChars = '*:"\\|<>\/?.';
            for (let i = 0; i < item.Name.length; i++) {
              if (iChars.indexOf(item.Name.charAt(i)) !== -1) {
                jstree.set_text(data.node, data.old);
                return;
              }
            }
            const originalIcon = jstree.get_icon(data.node);
            jstree.set_icon(data.node, loadingIcon);
            jstree.disable_node(data.node);
            // Add validation on name not change
            if (item.Name !== data.old) {
              $scope.onItemRenamed({
                item: item,
                callback: function (renamedItem, error) {
                  jstree.enable_node(data.node);
                  jstree.set_icon(data.node, originalIcon);
                  if (error) {
                    // todo: handle errors:
                    let oldText = data.old;
                    oldText = oldText + (typeof data.node.original.totalInnerFileFolder === 'string' ? data.node.original.totalInnerFileFolder : '');
                    oldText = oldText + (typeof data.node.original.contextMenuButton === 'string' ? data.node.original.contextMenuButton : '');
                    jstree.set_text(data.node, oldText);
                    //N.oeError(error);
                    return;
                  } else {
                    let nodeText = renamedItem.Name;
                    if (data && typeof (data.node.original) === 'object') {
                      nodeText = nodeText + (typeof renamedItem.totalInnerFileFolder === 'string' ? renamedItem.totalInnerFileFolder : '');
                      nodeText = nodeText + (typeof renamedItem.contextMenuButton === 'string' ? renamedItem.contextMenuButton : '');
                      renamedItem.name = renamedItem.Name;
                      data.node.original.text = nodeText;
                      data.node.original.tooltip = renamedItem.Name;
                      data.node.original.name = renamedItem.Name;
                    }
                    jstree.set_text(data.node, nodeText);
                    data.node.original = renamedItem;
                  }
                }
              });
            }
            else {
              let nodeText = data.old;
              if (data && typeof (data.node.original) === 'object') {
                nodeText = nodeText + (typeof data.node.original.totalInnerFileFolder === 'string' ? data.node.original.totalInnerFileFolder : '');
                nodeText = nodeText + (typeof data.node.original.contextMenuButton === 'string' ? data.node.original.contextMenuButton : '');
                jstree.set_text(data.node, nodeText);
              }
              jstree.enable_node(data.node);
              jstree.set_icon(data.node, originalIcon);
            }
          };
          function onCreateFolder(Id) {
            var selected = [];
            if (Id !== null && typeof Id !== 'object') {
              SelectCurrentNode(Id);
              const selectedlist = jstree.get_selected(true);
              selected = _.filter(selectedlist, (obj) => obj.id === Id);
              if (selected === undefined) {
                return false;
              }
            }
            else {
              selected = jstree.get_selected(true);
              if (!selected.length) {
                return false;
              }
            }
            selected = selected[0];
            isFolderCreating = true;

            // Appending dialog to document.body to cover sidenav in docs app
            const tempNode = jstree.create_node(selected, { id: tempNodeId, state: { disabled: true }, text: 'saving...', icon: loadingIcon });
            $scope.onItemCreated({
              item: { name: '', parentId: selected.original.id, parentName: selected.text, gencFileOwnerType: selected.gencFileOwnerType, roleId: selected.original.roleId },
              callback: function (createdItem, error) {
                jstree.delete_node(tempNode);
                if (createdItem) {
                  if (error) {
                    return;
                  }
                  const node = {
                    id: createdItem.gencFolderID, state: { disabled: false }, text: createdItem.gencFolderName, type: 'folder',
                    isParent: false, parent: createdItem.refParentId, gencFileOwnerType: createdItem.gencFileOwnerType, roleId: createdItem.roleId
                  };
                  jstree.create_node(selected, node);
                  $('.' + $scope.divClass).jstree('deselect_all', true);
                  $('.' + $scope.divClass).jstree('select_node', node.id);
                }
              }
            });
          };

          function onCopied() {
            var selected = jstree.get_selected(true);
            if (!selected.length) {
              return false;
            }
            selected = selected[0];
            const itemName = prompt('Enter item name:', selected.text + '(copy)');
            if (!itemName) {
              return false;
            }
            $scope.onItemCopied({
              item: { name: itemName, id: selected.id },
              callback: function (createdItem, error) {
                if (error) {
                  //N.oeError(error);
                  return;
                }
              }
            });
          };

          function onUploadFile(Id) {
            if (Id !== null && typeof Id !== 'object') {
              SelectCurrentNode(Id);
            }
            $scope.onItemUpload();
          };

          // function resetDocumentContextById(_selectedNode) {
          //     var documentOpenContext = document.getElementsByName('hidedocumentOpenContext');
          //     for (var i = documentOpenContext.length - 1; i >= 0; --i) {
          //         documentOpenContext[i].className = 'jstree-contextmenubtn hidedocumentOpenContext';
          //     }
          //     var objreplaceClass = angular.element($('.' + $scope.divClass)).find('li[id=' + _selectedNode.id + ']');
          //     if (objreplaceClass !== null && objreplaceClass.hasClass('jstree-contextmenubtn hidedocumentOpenContext')) {

          //         objreplaceClass.removeClass('jstree-contextmenubtn hidedocumentOpenContext');
          //         objreplaceClass.addClass('jstree-contextmenubtn showdocumentOpenContext');
          //     }
          //     else {
          //         var spanOpenMenu = '<span name="hidedocumentOpenContext" class="jstree-contextmenubtn showdocumentOpenContext" title="">...</span>';
          //         var objreplaceClass = angular.element($('.' + $scope.divClass)).find('li[id=' + _selectedNode.id + ']');
          //         if (objreplaceClass !== null) {
          //             objreplaceClass[0].innerHTML = spanOpenMenu + objreplaceClass[0].innerHTML;
          //             jstree.select_node(_selectedNode.id);
          //         }
          //     }
          // }
          $scope.$on('select-node', (currentobj, Id) => { SelectCurrentNode(Id); });

          $scope.$on('createNewFolderManually', (selectedNode) => {
            onCreateFolder(selectedNode);
          });

          function SelectCurrentNode(Id) {
            var selectedlist = jstree.get_selected(true);
            angular.forEach(selectedlist, (objselected) => {
              jstree.deselect_node(objselected);
            });
            jstree.select_node(Id);
          }
          const build = function () {
            initUI();
            if ($scope.source !== null) {
              fillJsTreeData();
              $compile($element.contents())($scope);
            }
          };
          $scope.$on('serachNode', (event, data) => {
            $timeout(() => {
              jstree.settings.search.show_only_matches = true;
              jstree.settings.search.show_only_matches_children = true;
              jstree.search(data ? data.Name : '', false, true, '#');
            });
          });
          /* to search matching main node name */
          $scope.$on('serachNodeByContains', (event, data) => {
            $timeout(() => {
              //jstree.settings.search.show_only_matches = false;
              jstree.search(data ? data.Name : '', false, false, '#');
            });
          });

          $scope.$watchCollection('source', () => {
            if (!isFolderCreating) {
              build();
            }
            else {
              isFolderCreating = false;
            }
          });

          $scope.$on('source', () => {
            build();
          });
          $scope.$on('closeAll', () => {
            $timeout(() => {
              jstree.close_all();
            });
          });
          if ($scope.name === undefined) {
            $scope.name = {};
          }
          $scope.name.refresh = build;

          $scope.$on('$destroy', () => {
            _exactSearchForTree = false;
          });
        })(scope, element, attrs);
      }
    };
    return directive;
  }
})();



