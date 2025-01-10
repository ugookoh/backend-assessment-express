import "reflect-metadata";
import { DataSource } from "typeorm";
import { User, Note, SharedNote, KeywordToNote } from "../entities";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./database.sqlite",
  synchronize: true,
  logging: true,
  entities: [Note, User, SharedNote, KeywordToNote],
  subscribers: [],
  migrations: [],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected and synchronized!");
  } catch (error) {
    console.error("Error during DataSource initialization:", error);
    process.exit(1);
  }
};
