const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const moment = require('moment');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const resumable = require('../../../assets/resumable/resumable-node.js')(`${__basedir}/uploads/temp`);

const inputFields = ['id', 'name', 'cameraURL', 'cameraGroup', 'isActive', 'isDeleted', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deletedBy', 'deletedAt', 'createByRoleId', 'updateByRoleId', 'deleteByRoleId'];
const cameraModuleName = DATA_CONSTANT.CAMERA.NAME;
module.exports = {
  // get list of camera
  // POST : /api/v1/camera/retrieveCameraList
  // @return list of camera
  retrieveCameraList: (req, res) => {
    const {
      sequelize
    } = req.app.locals.models;
    const filter = COMMON.UiGridFilterSearch(req);
    const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
    sequelize.query('CALL Sproc_RetrieveCameraList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
      replacements: {
        ppageIndex: req.body.page,
        precordPerPage: filter.limit,
        pOrderBy: filter.strOrderBy || null,
        pWhereClause: strWhere
      },
      type: sequelize.QueryTypes.SELECT
    }).then((response) => {
      resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
        CameraList: _.values(response[1]),
        Count: response[0][0]['TotalRecord']
      }, null);
    }).catch((err) => {
      console.trace();
      console.error(err);
      return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
        err: err,
        data: null
      });
    });
  },
  // get detail of Camera by ID
  // GET : /api/v1/camera/getCameraDetailsById/:id
  // @return detail of Camera
  getCameraDetailsById: (req, res) => {
    if (req.params.id) {
      const {
        CameraMst
      } = req.app.locals.models;
      return CameraMst.findOne({
        where: {
          id: req.params.id
        }
      }).then((response) => {
        if (!response) {
          return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
        }
        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
      }).catch((err) => {
        console.trace();
        console.error(err);
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
          messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
          err: err,
          data: null
        });
      });
    } else {
      return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
        messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
        err: null,
        data: null
      });
    }
  },
  // Manage Camera Details
  // POST : /api/v1/camera/saveCameraDetails
  // @return Camera details
  saveCameraDetails: (req, res) => {
    const {
      CameraMst
    } = req.app.locals.models;
    if (req.body.id) {
      // Update
      COMMON.setModelUpdatedByFieldValue(req);
      return CameraMst.update(req.body, {
        where: {
          id: req.body.id
        },
        fields: inputFields
      }).then(() => {
        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(cameraModuleName));
      }).catch((err) => {
        console.trace();
        console.error(err);
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
          messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
          err: err,
          data: null
        });
      });
    } else {
      // Create
      COMMON.setModelCreatedByFieldValue(req);
      return CameraMst.create(req.body, {
        fields: inputFields
      }).then(fobDetails => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, fobDetails, MESSAGE_CONSTANT.CREATED(cameraModuleName))).catch((err) => {
        console.trace();
        console.error(err);
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
          messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
          err: err,
          data: null
        });
      });
    }
  },
  // Check Camera Details exist or not
  // post:/api/v1/camera/checkDuplicateCameraDetails
  // @return API response
  checkDuplicateCameraDetails: (req, res) => {
    const {
      CameraMst
    } = req.app.locals.models;
    if (req.body) {
      const duplicateWhereClause = {};
      if (req.body.objs.name) {
        duplicateWhereClause.name = req.body.objs.name;
      }
      if (req.body.objs.cameraURL) {
        duplicateWhereClause.cameraURL = req.body.objs.cameraURL;
      }
      const whereClause = {
        [Op.or]: duplicateWhereClause
      };
      if (req.body.objs.id) {
        whereClause.id = {
          [Op.notIn]: [req.body.objs.id]
        };
      }
      CameraMst.findAll({
        where: whereClause
      }).then((isExists) => {
        if (isExists.length > 0) {
          return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
            messageContent: null,
            err: null,
            data: {
              isDuplicate: true
            }
          });
        } else {
          return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            isDuplicate: false
          }, null);
        }
      }).catch((err) => {
        console.trace();
        console.error(err);
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
          messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
          err: err,
          data: null
        });
      });
    }
  },
  // Remove Camera Details
  // POST : /api/v1/camera/deleteCameraDetails
  // @return API response
  deleteCameraDetails: (req, res) => {
    const {
      sequelize
    } = req.app.locals.models;
    if (req.body.objIDs.id) {
      return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
        replacements: {
          tableName: COMMON.AllEntityIDS.CAMERA_MASTER.Name,
          IDs: req.body.objIDs.id.toString(),
          deletedBy: COMMON.getRequestUserID(req),
          entityID: null,
          refrenceIDs: null,
          countList: req.body.objIDs.CountList,
          pRoleID: COMMON.getRequestUserLoginRoleID(req)
        }
      }).then((response) => {
        if (response && response.length === 0) {
          return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(cameraModuleName));
        } else {
          return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            transactionDetails: response,
            IDs: req.body.objIDs.id
          }, null);
        }
      }).catch((err) => {
        console.trace();
        console.error(err);
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
          messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
          err: err,
          data: null
        });
      });
    } else {
      return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
        messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
        err: null,
        data: null
      });
    }
  },
  // GET : /api/v1/camera/retriveCameraById
  // @return API Ressponse
  retriveCameraById: (req, res) => {
    const {
      CameraMst
    } = req.app.locals.models;
    if (req.params.id) {
      return CameraMst.findOne({
        where: {
          id: req.params.id
        }
      }).then((cameraType) => {
        if (!cameraType) {
          return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null); // new NotFound(MESSAGE_CONSTANT.NOT_FOUND(MountingTypeModuleName)));
        }
        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, cameraType, null);
      }).catch((err) => {
        console.trace();
        console.error(err);
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
          messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
          err: err,
          data: null
        });
      });
    } else {
      return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
        err: null,
        data: null
      });
    }
  },
  // GET : /api/v1/camera/retriveCameraGroup
  // @return list of camera's groups
  retriveCameraGroup: (req, res) => {
    const {
      CameraMst
    } = req.app.locals.models;
    if (req.query) {
      const where = {
        isDeleted: false
      };
      // for dynamic column based search using Sequelize
      if (req.query.searchQuery) {
        where.cameraGroup = {
          [Op.like]: `%${req.query.searchQuery}%`
        };
      }
      return CameraMst.findAll({
        where,
        attributes: ['cameraGroup'],
        group: ['cameraGroup'],
        order: [
          ['cameraGroup', 'ASC']
        ]
      }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
        console.trace();
        console.error(err);
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
          messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
          err: err,
          data: null
        });
      });
    } else {
      return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
        messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
        err: null,
        data: null
      });
    }
  },
  // GET : /api/v1/camera/retriveCameraByGroup
  // @return camera list for a particular group
  retriveCameraByGroup: (req, res) => {
    const {
      CameraMst
    } = req.app.locals.models;
    if (req.query) {
      const where = {
        isDeleted: false
      };
      // when edit recored
      if (req.query.cameraGroup) {
        where.cameraGroup = req.query.cameraGroup;
      }
      return CameraMst.findAll({
        attributes: ['id', 'name', 'cameraGroup', 'cameraURL'],
        where: where,
        order: [
          ['name', 'ASC']
        ]
      }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
        console.trace();
        console.error(err);
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
          messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
          err: err,
          data: null
        });
      });
    } else {
      return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
        messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
        err: null,
        data: null
      });
    }
  },
  // POST : /api/v1/camera/getPicturesInQueue
  // @return response for file saved in temporary folder
  getPicturesInQueue: (req, res) => {
    if (req.body) {
      // resumable.removeChunkFile(); // Delete Unwanted file which generate during and not delete due to disconnection
      let documentDetail = JSON.parse(req.body.documentDetail);
      const genFilePath = `${DATA_CONSTANT.PART_PICTURE.UPLOAD_PATH}`;
      // eslint-disable-next-line camelcase
      resumable.post(req, (status, filename, original_filename, identifier) => {
        try {
          const fileName = `${moment().format('MMDDYYHHmmss')}-${documentDetail.tags}-${documentDetail.batchName}.png`;
          const gencFileName = `${uuidv1()}.png`;
          documentDetail = {
            ...documentDetail,
            gencOriginalName: fileName,
            imagePath: genFilePath,
            gencFileName: gencFileName,
            createdBy: req.user.id,
            createdByRoleId: req.user.defaultLoginRoleID
          };

          // genFilePath = `${genFilePath}${folder}/`;
          if (!fs.existsSync(genFilePath)) {
            fs.mkdirSync(genFilePath);
          }
          const stream = fs.createWriteStream(`${genFilePath}/${fileName}`);
          resumable.write(req, identifier, stream);
          stream.on('data', () => { });
          stream.on('end', () => { });
          const channel = global.channel;
          const queue = DATA_CONSTANT.PART_PICTURE_SERVICE_QUEUE;
          channel.assertQueue(queue, {
            durable: false,
            autoDelete: false,
            exclusive: false
          });
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(documentDetail)));
        } catch (error) {
          console.trace();
          console.error(error);
          return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
            messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
            err: null,
            data: {
              error
            }
          });
        }
        const response = {
          messsage: documentDetail.tags
        };
        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
      });
    } else {
      resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
        messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
        err: null,
        data: null
      });
    }
  }
};