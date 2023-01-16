module.exports = {
  host: 'localhost',
  port: 5432,
  type: 'postgres',
  username: 'postgres',
  password: 'root',
  database: 'blog-app',
  synchronize: false,
  migrations: ['dist/migrations/*{.ts,.js}'],
  entities: ['dist/**/*.entity{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
