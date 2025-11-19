import { defineConfig } from 'prisma';
import 'dotenv/config'; // Import dotenv/config to load environment variables

export default defineConfig({
  // Specify the path to your Prisma schema file
  schema: './app/db/schema.prisma',

  // Define the path for your Prisma migrations
  migrations: {
    path: './app/db/migrations', // Custom path for migration files
  },

  // // (Optional) Define the path for your Prisma seed file
  // seed: {
  //   path: './prisma/seed.ts', // Custom path for the seed file
  // },

  // // (Optional) Configure Prisma Client generation
  // client: {
  //   output: './src/generated/prisma-client', // Custom output directory for Prisma Client
  // },

  // // (Optional) Define custom views path (if using Prisma Views)
  // views: {
  //   path: './db/views', // Custom path for view definitions
  // },
});