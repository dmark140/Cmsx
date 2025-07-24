import type { NextApiRequest, NextApiResponse } from 'next';
import { backupDatabase } from '@/lib/dbBackup';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const filename = await backupDatabase();
    res.status(200).json({ message: 'Backup successful', file: filename });
  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({ message: 'Backup failed', error });
  }
}
