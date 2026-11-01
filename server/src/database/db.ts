import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import os from 'os';
import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';

dotenv.config();

const DB_TYPE = process.env.DB_TYPE || 'sqlite';
let sqlJsDb: SqlJsDatabase | null = null;
let dbFilePath: string = '';
let mysqlPool: any = null;

function saveDb() {
  if (sqlJsDb && dbFilePath) {
    try {
      const data = sqlJsDb.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(dbFilePath, buffer);
    } catch (err: any) {
      // In-memory fallback
    }
  }
}

export async function initDatabase() {
  if (mysqlPool || sqlJsDb) {
    return mysqlPool ? 'mysql' : 'sqlite';
  }

  if (DB_TYPE === 'mysql') {
    try {
      const mysql = await import('mysql2/promise');
      mysqlPool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'driverondemand',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      await mysqlPool.query('SELECT 1');
      console.log('✅ Connected to MySQL database:', process.env.DB_NAME);
      return 'mysql';
    } catch (err: any) {
      console.warn('⚠️ MySQL connection failed, falling back to embedded SQLite:', err.message);
    }
  }

  // SQLite via WebAssembly (sql.js)
  try {
    const SQL = await initSqlJs();
    const targetDir = os.tmpdir();
    dbFilePath = path.join(targetDir, 'driverondemand.sqlite');
    
    if (fs.existsSync(dbFilePath)) {
      try {
        const filebuffer = fs.readFileSync(dbFilePath);
        sqlJsDb = new SQL.Database(filebuffer);
      } catch {
        sqlJsDb = new SQL.Database();
      }
    } else {
      sqlJsDb = new SQL.Database();
      saveDb();
    }
    console.log('✅ Connected to SQLite database at:', dbFilePath);
    return 'sqlite';
  } catch (err: any) {
    console.error('❌ Failed to initialize SQLite database:', err);
    throw err;
  }
}

export async function query<T = any>(sqlText: string, params: any[] = []): Promise<T[]> {
  if (mysqlPool) {
    const [rows] = await mysqlPool.query(sqlText, params);
    return rows as T[];
  }
  if (sqlJsDb) {
    try {
      const stmt = sqlJsDb.prepare(sqlText);
      stmt.bind(params);
      const results: T[] = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject() as T);
      }
      stmt.free();
      return results;
    } catch (err: any) {
      console.error(`Query error on: "${sqlText}":`, err.message);
      throw err;
    }
  }
  throw new Error('Database not initialized');
}

export async function queryOne<T = any>(sqlText: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sqlText, params);
  return rows.length > 0 ? rows[0] : null;
}

export async function execute(sqlText: string, params: any[] = []): Promise<{ insertId?: number; changes?: number }> {
  if (mysqlPool) {
    const [result]: any = await mysqlPool.execute(sqlText, params);
    return { insertId: result.insertId, changes: result.affectedRows };
  }
  if (sqlJsDb) {
    try {
      sqlJsDb.run(sqlText, params);
      const lastIdRes = sqlJsDb.exec('SELECT last_insert_rowid() as id');
      const lastId = lastIdRes[0]?.values[0]?.[0];
      const changes = sqlJsDb.getRowsModified();
      saveDb();
      return { insertId: lastId !== undefined ? Number(lastId) : 0, changes };
    } catch (err: any) {
      console.error(`Execute error on: "${sqlText}":`, err.message);
      throw err;
    }
  }
  throw new Error('Database not initialized');
}
