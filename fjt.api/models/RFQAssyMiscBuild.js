const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQAssyMiscBuild = sequelize.define('RFQAssyMiscBuild', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        rfqAssyID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        proposedBuildQty: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        noOfBuild: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        buildDate: {
            type: Sequelize.DATE,
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
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
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
        tableName: 'rfq_assy_miscbuild'
    });

    RFQAssyMiscBuild.associate = (models) => {
        RFQAssyMiscBuild.belongsTo(models.RFQAssemblies, {
            as: 'rfqAssemblies',
            foreignKey: 'rfqAssyID'
        });
    };

    return RFQAssyMiscBuild;
};