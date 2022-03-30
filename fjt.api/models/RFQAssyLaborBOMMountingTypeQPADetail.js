const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQAssyLaborBOMMountingTypeQPADetail = sequelize.define('RFQAssyLaborBOMMountingTypeQPADetail', {
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
        mountingTypeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        lineCount: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        totalQPA: {
            type: Sequelize.DECIMAL(16, 8),
            allowNull: true
        },
        subAssyID: {
            type: Sequelize.INTEGER,
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
        },
        isInstall: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        }
    },
        {
            paranoid: true,
            tableName: 'rfq_assy_labor_bom_mountingtype_qpa_detail'
        });

    RFQAssyLaborBOMMountingTypeQPADetail.associate = (models) => {
        RFQAssyLaborBOMMountingTypeQPADetail.belongsTo(models.RFQMountingType, {
            as: 'rfqMountingType',
            foreignKey: 'mountingTypeID'
        });
        RFQAssyLaborBOMMountingTypeQPADetail.hasMany(models.RFQAssyQtyWiseBOMLaborCostingDetail, {
            as: 'rfqAssyBOMLaborCostingDetail',
            foreignKey: 'rfqAssyBOMMountingID'
        });
    };

    return RFQAssyLaborBOMMountingTypeQPADetail;
};