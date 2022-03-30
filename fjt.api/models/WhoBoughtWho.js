/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WhoBoughtWho = sequelize.define('WhoBoughtWho', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        buyBy: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        buyTo: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        buyDate: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        copyMfgPN: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: false,
                len: [0, 1000]
            }
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
            tableName: 'who_bought_who',
            paranoid: true
        }
    );

    WhoBoughtWho.associate = (models) => {
        WhoBoughtWho.belongsTo(models.MfgCodeMst, {
            foreignKey: 'buyBy',
            as: 'mfgCodeBy'
        });

        WhoBoughtWho.belongsTo(models.MfgCodeMst, {
            foreignKey: 'buyTo',
            as: 'mfgCodeTo'
        });
    };

    return WhoBoughtWho;
};
