/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQRoHSPeer = sequelize.define('RFQRoHSPeer', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        rohsID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        rohsPeerID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        createByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        updateByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        deleteByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    },
        {
            tableName: 'rfq_rohsmst_peer',
            paranoid: true
        }
    );

    RFQRoHSPeer.associate = (models) => {
        RFQRoHSPeer.belongsTo(models.RFQRoHS, {
            foreignKey: 'rohsID',
            as: 'referenceRoHS'
        });
        RFQRoHSPeer.belongsTo(models.RFQRoHS, {
            foreignKey: 'rohsPeerID',
            as: 'peerRoHS'
        });
    };

    return RFQRoHSPeer;
};
