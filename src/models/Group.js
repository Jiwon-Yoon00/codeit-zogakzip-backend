const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // DB 연결 가져오기

const Group = sequelize.define('Group', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    introduction: {
        type: DataTypes.TEXT
    },
    likeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    postCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    badgeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Group;
