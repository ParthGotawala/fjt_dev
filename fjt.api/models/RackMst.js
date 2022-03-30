const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RackMst = sequelize.define('RackMst', {
        id: {
            allowNUll: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
            allowNUll: false
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNUll: false
        },
        woTransID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        woOPID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        opStatus: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: false
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
        tableName: 'rackmst',
        paranoid: true
    });

    RackMst.associate = (models) => {
        RackMst.belongsTo(models.WorkorderTrans, {
            foreignKey: 'woTransID',
            as: 'workorderTrans'
        });
        RackMst.belongsTo(models.Workorder, {
            foreignKey: 'woID',
            as: 'workorder'
        });
        RackMst.belongsTo(models.WorkorderOperation, {
            foreignKey: 'woOPID',
            as: 'workorderOperation'
        });
        RackMst.hasMany(models.WorkorderTransRack, {
            foreignKey: 'rackID',
            as: 'workorderTransRack'
        });
        RackMst.belongsTo(models.Component, {
            foreignKey: 'partID',
            as: 'component'
        });
        RackMst.hasMany(models.RackMstHistory, {
            foreignKey: 'rackID',
            as: 'rackMstHistory'
        });
    };

    return RackMst;
};