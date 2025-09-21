import User from './User.js';
import UserSession from './UserSession.js';
import Project from './Project.js';
import Task from './Task.js';
import Label from './Label.js';
import TaskLabel from './TaskLabel.js';
import sequelize from '../db/sequelize.js';

// User associations
User.hasMany(UserSession, {
  foreignKey: 'user_id',
  as: 'sessions',
  onDelete: 'CASCADE'
});

User.hasMany(Project, {
  foreignKey: 'user_id',
  as: 'projects',
  onDelete: 'CASCADE'
});

User.hasMany(Task, {
  foreignKey: 'user_id',
  as: 'tasks',
  onDelete: 'CASCADE'
});

User.hasMany(Label, {
  foreignKey: 'user_id',
  as: 'labels',
  onDelete: 'CASCADE'
});

// UserSession associations
UserSession.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Project associations
Project.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

Project.hasMany(Task, {
  foreignKey: 'project_id',
  as: 'tasks',
  onDelete: 'SET NULL'
});

// Task associations
Task.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

Task.belongsTo(Project, {
  foreignKey: 'project_id',
  as: 'project'
});

// Self-referencing association for subtasks
Task.hasMany(Task, {
  foreignKey: 'parent_id',
  as: 'subtasks',
  onDelete: 'CASCADE'
});

Task.belongsTo(Task, {
  foreignKey: 'parent_id',
  as: 'parentTask'
});

// Task-Label many-to-many relationship
Task.belongsToMany(Label, {
  through: TaskLabel,
  foreignKey: 'task_id',
  otherKey: 'label_id',
  as: 'labels'
});

Label.belongsToMany(Task, {
  through: TaskLabel,
  foreignKey: 'label_id',
  otherKey: 'task_id',
  as: 'tasks'
});

// Label associations
Label.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// TaskLabel associations
TaskLabel.belongsTo(Task, {
  foreignKey: 'task_id',
  as: 'task'
});

TaskLabel.belongsTo(Label, {
  foreignKey: 'label_id',
  as: 'label'
});

const models = {
  User,
  UserSession,
  Project,
  Task,
  Label,
  TaskLabel,
  sequelize
};

export default models;
export {
  User,
  UserSession,
  Project,
  Task,
  Label,
  TaskLabel,
  sequelize
};