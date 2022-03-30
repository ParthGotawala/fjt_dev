/* eslint-disable global-requries */
const PartPictureSocketController = require('../controllers/PartPictureSocketController');

module.exports = {
    // Send response to UI to indicate picture saved successfully on actual path
    // @return websocket call to ui for update
    // eslint-disable-next-line no-unused-vars
    getFileUploadStatus: (req, res) => {
        if (req.body) {
            PartPictureSocketController.getFileUploadStatus(req, req.body);
        }
    }
}