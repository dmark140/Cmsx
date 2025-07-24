// lib/dbBackup.ts
import mysqldump from 'mysqldump';
import fs from 'fs';
import path from 'path';

const BACKUP_FOLDER = path.join(process.cwd(), 'public', 'db_backups');

export async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `operationscms_${timestamp}.sql`;
  const filepath = path.join(BACKUP_FOLDER, filename);

  if (!fs.existsSync(BACKUP_FOLDER)) {
    fs.mkdirSync(BACKUP_FOLDER, { recursive: true });
  }

  await mysqldump({
    connection: {
      host: 'localhost',
      user: 'root',
      password: '', 
      database: 'ilil',
    },
    dumpToFile: filepath,
  });

  return filename;
}
