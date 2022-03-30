const resHandler = require('../../resHandler');
const { STATE } = require('../../constant');
const { Failed } = require('../../errors');
const { Op } = require('sequelize');


module.exports = {
    getSubformTransactionDetail: (req, res) => {
        const SubFormTransaction = req.app.locals.models.SubFormTransaction;
        SubFormTransaction.findAll({
            where: {
                subFormTransID: { [Op.in]: req.body.refSubFormTransIDs }
            }
        }).then((subformDetail) => {
            resHandler.successRes(res, 200, STATE.SUCCESS, subformDetail);
        }).catch((err) => {
            console.trace();
            console.error(err);
            resHandler.errorRes(res, 200, new Failed(err.message));
        });
    }
};
