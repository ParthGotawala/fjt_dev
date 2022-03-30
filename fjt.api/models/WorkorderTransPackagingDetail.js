const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderTransPackagingDetail = sequelize.define('WorkorderTransPackagingDetail', {
        woTransPackagingDetailID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        // woSerailID:{
        //     type: Sequelize.INTEGER,
        //     allowNull: false,
        // },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        opID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        woTransID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        serialID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        boxNo: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        boxSize: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        noOfPacketPerBox: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        location: {
            type: Sequelize.STRING(1000),
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        createdBy: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedBy: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING(255),
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
        tableName: 'workorder_trans_packagingDetail'
    });

    WorkorderTransPackagingDetail.associate = (models) => {
        WorkorderTransPackagingDetail.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'woID'
        });
        WorkorderTransPackagingDetail.belongsTo(models.Operation, {
            as: 'operations',
            foreignKey: 'opID'
        });
        WorkorderTransPackagingDetail.belongsTo(models.WorkorderTrans, {
            as: 'workorderTrans',
            foreignKey: 'woTransID'
        });
        WorkorderTransPackagingDetail.belongsTo(models.Employee, {
            as: 'Employees',
            foreignKey: 'employeeID'
        });
    };

    return WorkorderTransPackagingDetail;
};