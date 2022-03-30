const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const CustomerPackingSlipTrackNumber = sequelize.define('CustomerPackingSlipTrackNumber', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        refCustPackingSlipID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        trackNumber: {
            type: Sequelize.STRING,
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
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
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
    }, {
        paranoid: true,
        tableName: 'customer_packing_slip_track_number'
    });

    // CustomerPackingSlipTrackNumber.associate = (models) => {
    // };

    return CustomerPackingSlipTrackNumber;
};