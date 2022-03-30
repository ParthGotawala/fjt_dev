const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const PackingSlipTrackNumber = sequelize.define('PackingSlipTrackNumber', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        refPackingSlipMaterialRecID: {
            type: Sequelize.INTEGER,
            allowNull: true
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
        tableName: 'packing_slip_track_number'
    });

    PackingSlipTrackNumber.associate = (models) => {
        PackingSlipTrackNumber.belongsTo(models.PackingSlipMaterialReceive, {
            as: 'packing_slip_material_receive',
            foreignKey: 'refPackingSlipMaterialRecID'
        });
    };

    return PackingSlipTrackNumber;
};