'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface UploadFieldProps {
  fieldKey: number;
  value: string;
  onChange: (field: number, value: string) => void;
}

export default function UploadField({ fieldKey, value, onChange }: UploadFieldProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fieldKey', fieldKey.toString());

    try {
      setUploading(true);
      const res = await fetch('/api/filetransfer', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (res.ok && result?.fileUrl) {
        toast.success('File uploaded successfully');
        onChange(fieldKey, result.fileUrl); // Or result.filename depending on API response
      } else {
        toast.error('Upload failed');
      }
    } catch (error) {
      toast.error('Upload error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <Input type="file" onChange={handleFileChange} disabled={uploading} />
      {value && (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 underline"
        >
          View uploaded file
        </a>
      )}
    </div>
  );
}
