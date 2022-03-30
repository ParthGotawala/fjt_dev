const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderPreprogComp = sequelize.define('WorkorderPreprogComp', {
        woPreProgCompID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        woMultiplier: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        displayOrder: {
            type: Sequelize.DECIMAL(6, 2),
            allowNull: false
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
        programName: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        refStkWOOPID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        mfgPNID: {
            type: Sequelize.INTEGER,
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
        },
        designatorName: {
            type: Sequelize.STRING(50),
            allowNull: false
        }
    }, {
        paranoid: true,
        tableName: 'workorder_preprogcomp'
    });

    WorkorderPreprogComp.associate = (models) => {
        WorkorderPreprogComp.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'woID'
        });
        WorkorderPreprogComp.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'mfgPNID'
        });
    };

    return WorkorderPreprogComp;
};
