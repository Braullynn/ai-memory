import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function initDb() {
  const db = await open({
    filename: './memories.db',
    driver: sqlite3.Database
  });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      summary TEXT NOT NULL,
      embedding TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  return db;
}
