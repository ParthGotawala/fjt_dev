(function () {
  'use strict';
  angular
    .module('app.core')
    .controller('ComponentCommentPopupController', ComponentCommentPopupController);
  /** @nginject */
  function ComponentCommentPopupController($mdDialog, data, CORE, BaseService, DialogFactory, CommentFactory) {
    const vm = this;
    vm.CommentModel = data;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;

    if (vm.CommentModel.commentId) {
      vm.cgBusyLoading = CommentFactory.getCommentByID().query({ commentId: vm.CommentModel.commentId }).$promise.then((response) => {
        if (response && response.data) {
          vm.CommentModel.comment = response.data.comment;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.checkCommentUnique = () => {
      if (vm.CommentModel.comment && vm.CommentModel.comment !== '') {
        CommentFactory.checkCommentUnique().query(vm.CommentModel).$promise.then((response) => {
          if (response && response.data) {
           const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, 'Comment');
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.CommentModel.comment = null;
                setFocus('comment');
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };


    //save comments
    vm.AddUpdateComments = () => {
      if (BaseService.focusRequiredField(vm.commentForm)) {
        return;
      }
      vm.cgBusyLoading = CommentFactory.saveComment().query(vm.CommentModel).$promise.then((response) => {
        if (response && response.data && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.cancel(vm.CommentModel);
        }
        else if (response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors.data && response.errors.data.duplicateComment) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
          messageContent.message = stringFormat(messageContent.message, 'Comment');
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes) {
              vm.CommentModel.comment = null;
              setFocus('comment');
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }).catch((error) => BaseService.getErrorLog(error));
  };

  vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

  vm.cancel = () => {
    if (vm.commentForm.$dirty) {
      BaseService.showWithoutSavingAlertForPopUp();
    } else {
      BaseService.currentPagePopupForm.pop();
      $mdDialog.cancel();
    }
  };
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.commentForm);
    });
}
}) ();
