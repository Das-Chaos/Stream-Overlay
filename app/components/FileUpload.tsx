'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

interface FileUploadProps {
  onUpload: (file: File) => void
  accept: string
}

export function FileUpload({ onUpload, accept }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (file) {
      onUpload(file)
      setFile(null)
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <Input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="w-full"
        id="file-upload"
      />
      <Button onClick={handleUpload} disabled={!file}>
        <Upload className="mr-2 h-4 w-4" /> Upload
      </Button>
    </div>
  )
}
