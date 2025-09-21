import { createRequire } from 'module';
import { env as _env } from 'process';

const require = createRequire(import.meta.url);
const config = require('../config/config.json');

class ConfigService {
  getDatabaseConfig() {
    const env = _env.NODE_ENV || 'development';
    return config[env];
  }
}

export default new ConfigService();
