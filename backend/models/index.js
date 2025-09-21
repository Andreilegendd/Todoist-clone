'use strict';

import { readdirSync } from 'fs';
import { basename as _basename, join } from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import configService from '../services/configServices.js';

const dbConfig = configService.getDatabaseConfig();

let sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port || 5432,
    dialect: dbConfig.dialect,
  }
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = _basename(__filename);

const db = {};

const files = readdirSync(__dirname).filter((file) => {
  return (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    file.indexOf('.test.js') === -1 &&
    file !== 'associations.js'
  );
});

const loadModels = async () => {
  for (const file of files) {
    const modelPath = join(__dirname, file);
    const module = await import(`file://${modelPath}`);
    const model = module.default;
    
    if (model && model.name) {
      db[model.name] = model;
    }
  }
  
  await import('./associations.js');
  
  return db;
};

const dbPromise = loadModels().then(() => {
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  return db;
});

export default dbPromise;