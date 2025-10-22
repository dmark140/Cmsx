'use client'
import { PrintPreview } from '@/lib/PrintPreview'
import React from 'react'
import Printables from './Printables'
import { Button } from '@/components/ui/button'

type ShowPrintProps = {
  UID: number
  DocEntry: number
  show: boolean
  setShow: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ShowPrint({ UID, DocEntry, show, setShow }: ShowPrintProps) {
  return (
    <div>
      <Button onClick={() => setShow(true)}>Print Preview</Button>
      {show && (
        <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-auto max-h-[90vh] bg-white p-4 rounded-xl shadow-lg">
          <div className="flex justify-end mb-2">
            <Button variant="destructive" onClick={() => setShow(false)}>
              Close
            </Button>
          </div>
          <PrintPreview>
            <Printables userId={UID} evaluationId={DocEntry} />
          </PrintPreview>
        </div>
      )}
    </div>
  )
}
