import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';

const TaskLabel = sequelize.define('TaskLabel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  task_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tasks',
      key: 'id'
    }
  },
  label_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'labels',
      key: 'id'
    }
  }
}, {
  tableName: 'task_labels',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['task_id']
    },
    {
      fields: ['label_id']
    },
    {
      unique: true,
      fields: ['task_id', 'label_id']
    }
  ]
});

export default TaskLabel;