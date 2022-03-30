const resHandler = require('../../resHandler');
const { STATE } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');


// const moduleName = DATA_CONSTANT.PART_CATEGORY.NAME;
module.exports = {
    // Retrive list of Part Category
    // GET : /api/v1/rfqpartcategory/getPartCategoryMstList
    // @return list of Part Category
    getPartCategoryMstList: (req, res) => {
        const { RFQPartCategory } = req.app.locals.models;

        return RFQPartCategory.findAll({
            where : {
                isDeleted: false
            },
            paranoid: false,
            attributes: ['id', 'categoryName', 'colorCode', 'partCategory', 'epicorType']
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            //    new NotFound(MESSAGE_CONSTANT.NOT_FOUND(moduleName)), err.errors, err.fields);
        });
    },
    // Retrive list of epicorType
    // GET : /api/v1/rfqpartcategory/getEpicorTypeList
    // @return list of epicorType
    getEpicorTypeList: (req, res) => {
        const { RFQPartCategory } = req.app.locals.models;

        return RFQPartCategory.findAll({
            attributes: ['epicorType'],
            group: ['epicorType']
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            // new NotFound(MESSAGE_CONSTANT.NOT_FOUND(moduleName)),                err.errors, err.fields);
        });
    }
};
