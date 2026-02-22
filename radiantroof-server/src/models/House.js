const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const House = sequelize.define('House', {
        id: {
            type: DataTypes.INTEGER,   // numeric ID
            allowNull: false,
            autoIncrement: true,       // automatically increments
            primaryKey: true           // set as primary key
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        photo: {
            type: DataTypes.INTEGER,   // numeric photo ID
            allowNull: true
        }
    });

    module.exports = House;