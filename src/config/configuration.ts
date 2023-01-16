export default () => {
  let database = {
    host: 'localhost',
    port: 5432,
    type: 'postgres',
    username: 'postgres',
    password: 'root',
    database: 'blog-app',
    migrationsRun: true,
    logging: true,
    migrations: ['dist/migrations/*{.ts,.js}'],
    entities: ['dist/**/*.entity{.ts,.js}'],
  };

  return {
    PORT: parseInt(process.env.PORT || ''),
    JWT_SECRET: 'secret',
    JWT_EXPIRY: '7d',
    ELASTICSEARCH_NODE: process.env.ELASTICSEARCH_NODE,
    ELASTICSEARCH_USERNAME: process.env.ELASTICSEARCH_USERNAME,
    ELASTICSEARCH_PASSWORD: process.env.ELASTICSEARCH_PASSWORD,
    ELASTIC_SEARCH_API_KEY: process.env.ELASTIC_SEARCH_API_KEY,
    database,
  };
};
