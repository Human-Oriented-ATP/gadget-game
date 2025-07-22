import { runner } from 'node-pg-migrate';

let config; 

if (process.env.GADGET_SELFHOST === 'true') {
 config = {};
} else config = process.env.POSTGRES_URL;

const runnerOptions = { 
  dir: "migrations", 
  direction: "up",
  migrationsTable: "pgmigrations",
  verbose: true,
}

runner({databaseUrl: config, ...runnerOptions})
    .then(() => console.log("Migrations ran successfully."))
    .catch(err => console.error("Migrations failed wtih:", err));