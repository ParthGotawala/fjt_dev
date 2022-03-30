const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQLaborAssyQPADetail = sequelize.define('RFQLaborAssyQPADetail', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        rfqAssyID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        subAssyID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        perBuildQty: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        bomInternalVersion: {
            type: Sequelize.STRING,
            allowNull: true
        },
        parPartID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        originalQPA: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        isMismatchQPA: {
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
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        }
    },
        {
            paranoid: true,
            tableName: 'rfq_labor_assy_qpa_detail'
        });

    RFQLaborAssyQPADetail.associate = (models) => {
        RFQLaborAssyQPADetail.belongsTo(models.RFQAssemblies, {
            as: 'rfqAssemblies',
            foreignKey: 'rfqAssyID'
        });
        RFQLaborAssyQPADetail.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'partID'
        });
        RFQLaborAssyQPADetail.belongsTo(models.Component, {
            as: 'subComponent',
            foreignKey: 'subAssyID'
        });
    };

    return RFQLaborAssyQPADetail;
};