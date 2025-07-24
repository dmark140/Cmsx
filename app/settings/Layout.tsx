// components/BackupButton.tsx
'use client';
import { useState } from 'react';

export default function Layout() {
  const [status, setStatus] = useState('');
  const handleBackup = async () => {
    try {
      setStatus('Backing up...');
      const res = await fetch('/api/backup', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setStatus(`✅ Backup created: ${data.file}`);
      } else {
        setStatus(`❌ Failed: ${data.message}`);
      }
    } catch (error) {
      console.log({error})
    }
  };
return (
  <div>
    <button onClick={handleBackup} className="bg-blue-600 text-white px-4 py-2 rounded">
      Backup Database
    </button>
    <p className="mt-2">{status}</p>
  </div>
);
}
