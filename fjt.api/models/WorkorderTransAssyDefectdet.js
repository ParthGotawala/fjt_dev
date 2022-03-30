const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderTransAssyDefectdet = sequelize.define('WorkorderTransAssyDefectdet', {
        woTransDefectId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woTransID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        opID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        serialNo: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        wodesignatorID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        defectCnt: {
            type: Sequelize.INTEGER,
            allowNull: true
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
        isRework: {
            type: Sequelize.BOOLEAN,
            allowNull: false
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
        tableName: 'workorder_trans_assy_defectdet',
        indexes: [
            {
                unique: true,
                fields: ['woTransID', 'wodesignatorID', 'serialNo']
            }
        ]
    });

    WorkorderTransAssyDefectdet.associate = (models) => {
        WorkorderTransAssyDefectdet.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'woID'
        });
        WorkorderTransAssyDefectdet.belongsTo(models.WorkorderAssyDesignators, {
            as: 'workorder_assy_designators',
            foreignKey: 'wodesignatorID'
        });
        WorkorderTransAssyDefectdet.belongsTo(models.WorkorderTrans, {
            as: 'workorder_trans',
            foreignKey: 'woTransID'
        });
        WorkorderTransAssyDefectdet.belongsTo(models.Employee, {
            as: 'employees',
            foreignKey: 'employeeID'
        });
    };

    return WorkorderTransAssyDefectdet;
};