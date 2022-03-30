const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const VUReadyWOPCBComponent = sequelize.define('VUReadyWOPCBComponent', {
        woID: {
            type: Sequelize.INTEGER
        },
        opID: {
            type: Sequelize.INTEGER
        },
        refStkWOOPID: {
            type: Sequelize.INTEGER
        },
        readyForPCB: {
            type: Sequelize.INTEGER
        }
    }, {
            paranoid: false,
            tableName: 'vu_readywopcbcomponent'
        });
    return VUReadyWOPCBComponent;
};