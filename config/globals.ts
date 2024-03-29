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
  PROJECT_NAME: JSON.stringify(process.env.npm_package_name),
  CMS_URL: JSON.stringify('https://cms.sandervispoel.com'),
  HOTJAR_ID: JSON.stringify(2357623),
  HOTJAR_SNIPPET_V: JSON.stringify(6),
  LATEST_GIT_HASH: JSON.stringify(
    require('child_process') // eslint-disable-line @typescript-eslint/no-var-requires
      .execSync('git rev-parse HEAD')
      .toString()
      .trim(),
  ),
};

export default globals;
