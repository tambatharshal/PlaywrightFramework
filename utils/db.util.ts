import mysql, { Pool, PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { getEnvConfig, DbConfig } from '../config/env.config';

/**
 * MySQL DB utility — connection pool based on active ENV config
 *
 * Usage:
 *   const db = new DbUtil();
 *   const rows = await db.query<UserRow>('SELECT * FROM users WHERE id = ?', [1]);
 *   await db.close();
 *
 * Note: For CI, prefer injecting DB_* secrets via env vars (see env.config.ts overrides).
 */
export class DbUtil {
  private pool: Pool;

  constructor(config?: Partial<DbConfig>) {
    const envDb = getEnvConfig().db;
    this.pool = mysql.createPool({
      host: config?.host ?? envDb.host,
      port: config?.port ?? envDb.port,
      user: config?.user ?? envDb.user,
      password: config?.password ?? envDb.password,
      database: config?.database ?? envDb.database,
      waitForConnections: true,
      connectionLimit: 5,
      namedPlaceholders: true,
    });
  }

  async query<T extends RowDataPacket[]>(sql: string, params?: unknown[]): Promise<T> {
    const [rows] = await this.pool.query<T>(sql, params);
    return rows;
  }

  async execute(sql: string, params?: unknown[]): Promise<ResultSetHeader> {
    const [result] = await this.pool.execute<ResultSetHeader>(sql, params);
    return result;
  }

  async queryOne<T extends RowDataPacket>(sql: string, params?: unknown[]): Promise<T | null> {
    const rows = await this.query<T[]>(sql, params);
    return rows[0] ?? null;
  }

  async withTransaction<T>(fn: (conn: PoolConnection) => Promise<T>): Promise<T> {
    const conn = await this.pool.getConnection();
    try {
      await conn.beginTransaction();
      const result = await fn(conn);
      await conn.commit();
      return result;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
