const router = require('express').Router(); // eslint-disable-line
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');
const pricing = require('../controllers/PricingController');


module.exports = (app) => {
        app.get('/api/v1/pricing/getDigikeyAccessToken/:code',
                pricing.getDigikeyAccessToken);

        app.get('/api/v1/pricing/getAndUpdateAccessToken/:code',
                validateToken,

                jwtErrorHandler,
                populateUser,
                pricing.getAndUpdateAccessToken);

        app.post('/api/v1/pricing/getPartDetail',
                pricing.getPartDetail);
        app.post('/api/v1/pricing/getPartDetailVersion3',
                pricing.getPartDetailVersion3);
        app.post('/api/v1/pricing/getAndUpdateAccessTokenExternalDK',
                pricing.getAndUpdateAccessTokenExternalDK);

    app.post('/api/v1/pricing/getAvnetPartDetail',
        pricing.getAvnetPartDetail);

    app.post('/api/v1/pricing/getHeilindPartDetail',
        pricing.getHeilindPartDetail);

    app.post('/api/v1/pricing/getMouserJsonPartDetail',
        pricing.getMouserJsonPartDetail);

    app.post('/api/v1/pricing/getNewarkPartDetail',
            pricing.getNewarkPartDetail);

        app.post('/api/v1/pricing/getMouserPartDetail',
                pricing.getMouserPartDetail);

        app.post('/api/v1/pricing/getArrowPartDetail',
                pricing.getArrowPartDetail);

        app.post('/api/v1/pricing/getTTIPartDetail',
                pricing.getTTIPartDetail);

        app.post('/api/v1/pricing/getOctoPartDetail',
                pricing.getOctoPartDetail);

        app.get('/api/v1/pricing/getDigikeyExternalCardential/:appID',
                pricing.getDigikeyExternalCardential);
        app.get('/api/v1/pricing/getPackingSlipDetails/:salesorderID',
                pricing.getPackingSlipDetails);

        app.use(
                '/api/v1/pricingapi',
                validateToken,

                jwtErrorHandler,
                populateUser,
                router
        );

        router.route('/getComponentVerification')
                .post(pricing.getComponentVerification);

        router.route('/getPartDetailFromExternalApi')
                .post(pricing.getPartDetailFromExternalApi);

        router.route('/digikeyAccessToken')
                .get(pricing.digikeyAccessToken);
        router.route('/checkAccessToken')
                .get(pricing.checkAccessToken);
        router.route('/checkAppAccessToken/:appID')
                .get(pricing.checkAppAccessToken);
        router.route('/checkAppAccessTokenActive')
                .get(pricing.checkAppAccessTokenActive);

        router.route('/retrievePricing')
                .post(pricing.retrievePricing);
        router.route('/retrievePriceBreak')
                .post(pricing.retrievePriceBreak);


        router.route('/savePriceForQuantity')
                .post(pricing.savePriceForQuantity);

        router.route('/saveFinalPrice')
                .post(pricing.saveFinalPrice);

        router.route('/saveCopyPricing')
                .post(pricing.saveCopyPricing);

        router.route('/getComponentPricing')
                .post(pricing.getComponentPricing);

        router.route('/getDigikeyCardential')
                .get(pricing.getDigikeyCardential);

        router.route('/removeComponentStatus')
                .post(pricing.removeComponentStatus);

        router.route('/saveUpdatedPIDCode')
                .post(pricing.saveUpdatedPIDCode);

        router.route('/removePartStatus')
                .post(pricing.removePartStatus);
        router.route('/getSupplierQuotes')
                .get(pricing.getSupplierQuotes);
        router.route('/clearSelectedqtyPrice')
                .post(pricing.clearSelectedqtyPrice);
        router.route('/stopExternalPartUpdate')
                .post(pricing.stopExternalPartUpdate);
};
