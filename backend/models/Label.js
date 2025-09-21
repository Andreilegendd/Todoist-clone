import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';

const Label = sequelize.define('Label', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#808080',
    validate: {
      is: /^#[0-9A-Fa-f]{6}$/
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'labels',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      unique: true,
      fields: ['user_id', 'name']
    }
  ]
});

export default Label;