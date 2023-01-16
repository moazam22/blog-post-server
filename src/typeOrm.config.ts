import { DataSource } from 'typeorm';

export default new DataSource({
  host: 'localhost',
  port: 5432,
  type: 'postgres',
  username: 'postgres',
  password: 'root',
  database: 'blog-app',
  migrationsRun: true,
  logging: true,
  migrations: ['dist/p/*{.ts,.js}'],
  entities: ['dist/**/*.entity{.ts,.js}'],
});
