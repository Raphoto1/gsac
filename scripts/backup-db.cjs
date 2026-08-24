const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { Client } = require("pg");

const rootDir = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(rootDir, ".env") });
dotenv.config({ path: path.join(rootDir, ".env.local"), override: true });

const connectionKey = ["DATABASE_URL", "PRISMA_DATABASE_URL", "POSTGRES_URL"].find(
  (key) => process.env[key]
);

if (!connectionKey) {
  throw new Error(
    "Missing database URL. Define DATABASE_URL, PRISMA_DATABASE_URL, or POSTGRES_URL."
  );
}

function serializeValue(value) {
  if (typeof value === "bigint") {
    return `${value}n`;
  }

  if (Buffer.isBuffer(value)) {
    return { type: "Buffer", base64: value.toString("base64") };
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
}

async function backupDatabase() {
  const backupDir = path.join(rootDir, "backups");
  fs.mkdirSync(backupDir, { recursive: true });

  const timestamp = new Date();
  const filename = `gsac-db-${timestamp.toISOString().replace(/[.:]/g, "-")}.json`;
  const outputPath = path.join(backupDir, filename);
  const client = new Client({
    connectionString: process.env[connectionKey],
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    const databaseInfo = await client.query(
      "select current_database() as database, current_user as user"
    );
    const tableResult = await client.query(`
      select table_name
      from information_schema.tables
      where table_schema = 'public' and table_type = 'BASE TABLE'
      order by table_name
    `);

    const tables = [];

    for (const { table_name: tableName } of tableResult.rows) {
      const columnsResult = await client.query(
        `
          select column_name, data_type, udt_name, is_nullable, column_default
          from information_schema.columns
          where table_schema = 'public' and table_name = $1
          order by ordinal_position
        `,
        [tableName]
      );
      const rowsResult = await client.query({
        text: `select * from public."${tableName.replace(/"/g, '""')}"`,
        rowMode: "array",
      });

      tables.push({
        name: tableName,
        columns: columnsResult.rows,
        rows: rowsResult.rows.map((row) => row.map(serializeValue)),
      });
    }

    const backup = {
      format: "gsac-postgresql-data-backup",
      version: 1,
      capturedAt: timestamp.toISOString(),
      database: databaseInfo.rows[0].database,
      tables,
    };

    fs.writeFileSync(outputPath, `${JSON.stringify(backup, null, 2)}\n`, "utf8");
    console.log(`Backup created: ${path.relative(rootDir, outputPath)}`);
    console.log(`Tables: ${tables.length}`);
    console.log(`Rows: ${tables.reduce((total, table) => total + table.rows.length, 0)}`);
  } finally {
    await client.end();
  }
}

backupDatabase().catch((error) => {
  console.error(`Backup failed: ${error.message}`);
  process.exitCode = 1;
});
