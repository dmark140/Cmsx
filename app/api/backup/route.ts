import { NextResponse } from 'next/server';
import { backupDatabase } from '@/lib/dbBackup';

export async function POST() {
  try {
    const filename = await backupDatabase();
    return NextResponse.json({ message: 'Backup successful', file: filename });
  } catch (error) {
    console.error('Backup error:', error);
    return NextResponse.json({ message: 'Backup failed', error }, { status: 500 });
  }
}
