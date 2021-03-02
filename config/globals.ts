import dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? './.env' : './.env.dev',
});

const env = process.env.NODE_ENV || 'development';
const appEnv = process.env.APP_ENV || 'development';

const globals = {
  'process.env': {
    NODE_ENV: JSON.stringify(env),
    APP_ENV: JSON.stringify(appEnv),
    PORT: process.env.PORT || 3000,
  },
  __DEV__: appEnv === 'development',
  __TEST__: appEnv === 'test',
  __ACC__: appEnv === 'acceptation',
  __PROD__: appEnv === 'production',
  CMS_URL: JSON.stringify(process.env.CMS_URL),
};

export default globals;
