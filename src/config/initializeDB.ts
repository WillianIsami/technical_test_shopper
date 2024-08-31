import "reflect-metadata";
import { DataSource } from "typeorm";
import { Measure } from "../models/Measure";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST ?? "postgres",
  port: 5432,
  username: process.env.POSTGRES_USER ?? "username",
  password: process.env.POSTGRES_PASSWORD ?? "password123",
  database: process.env.POSTGRES_DATABASE ?? "meterAI",
  entities: [Measure],
  synchronize: true,
  logging: false,
});
