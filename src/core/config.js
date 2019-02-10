if (typeof process.env.NODE_ENV !== 'undefined') {
  process.env.NODE_ENV = process.env.NODE_ENV.trim();
} else {
  process.env.NODE_ENV = 'development';
}

const api = () => {
  const conf = {
    development: {
      protocol: 'http',
      host: 'localhost',
      port: 1337,
      version: '/v1',
    },
    production: {
      protocol: 'https',
      host: 'logger.getleon.ai',
      port: 1337,
      version: '/v1',
    },
  };

  return conf[process.env.NODE_ENV];
};

const db = () => {
  const conf = {
    development: {
      host: process.env.DATA_MAIN_HOST,
      user: process.env.DATA_MAIN_USER,
      password: process.env.DATA_MAIN_PASS,
      database: 'gonano',
    },
    production: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'leon_logger',
    },
  };

  return conf[process.env.NODE_ENV];
};

export {
  api,
  db,
};
