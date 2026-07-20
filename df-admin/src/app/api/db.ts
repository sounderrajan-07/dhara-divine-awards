import fs from 'fs/promises';
import path from 'path';

export interface DatabaseSchema {
  nominations: any[];
  donations: any[];
  delegates: any[];
  volunteers: any[];
  enquiries: any[];
  activityLogs: any[];
  gallery: any[];
  events: any[];
  siteConfig: any[];
  news?: any[];
}

const dbPath = path.join(process.cwd(), 'data', 'db.json');

export async function readDb(): Promise<DatabaseSchema> {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    const parsed = JSON.parse(data);
    if (!parsed.news) parsed.news = [];
    return parsed;
  } catch (error) {
    console.error("Database read error:", error);
    // If file doesn't exist, return empty scaffold
    return {
      nominations: [],
      donations: [],
      delegates: [],
      volunteers: [],
      enquiries: [],
      activityLogs: [],
      gallery: [],
      events: [],
      siteConfig: [],
      news: []
    };
  }
}

export async function writeDb(data: DatabaseSchema): Promise<void> {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error("Database write error:", error);
    throw error;
  }
}
