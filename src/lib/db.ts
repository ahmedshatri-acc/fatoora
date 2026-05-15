import postgres from "postgres";

let _sql: ReturnType<typeof postgres> | null = null;

export function sql() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
  if (!_sql) _sql = postgres(process.env.DATABASE_URL);
  return _sql;
}
