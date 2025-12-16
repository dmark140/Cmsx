'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'

type FeEntryProps = {
  project_id: number
  evaluation_id: number
  created_by: number
  onAdd?: (data: {
    project_id: number
    created_by: number
    evaluation_id: number
    evaluation: string
    requested: string
    acquired: string
  }) => void
}

export default function FeEntry({ project_id, evaluation_id, created_by, onAdd }: FeEntryProps) {
  const [open, setopen] = useState(false)
  const [evaluation, setEvaluation] = useState('')
  const [requested, setRequested] = useState('')
  const [acquired, setAcquired] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = { project_id, created_by, evaluation_id, evaluation, requested, acquired }
    if (onAdd) onAdd(data) // send data to parent
    setopen(false)
    setEvaluation('')
    setRequested('')
    setAcquired('')
  }

  return (
    <div>
      <Button onClick={() => setopen(true)}>Add Entry</Button>
      <Dialog open={open} onOpenChange={setopen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Fund Entry</DialogTitle>
          </DialogHeader>
          <form className="grid gap-2" onSubmit={handleSubmit}>
            {/* <div>
              <Label>Evaluation #</Label>
              <Input
                required
                value={evaluation}
                onChange={(e) => setEvaluation(e.target.value)}
              />
            </div> */}
            <div>
              <Label className='pb-2'>Requested Fund</Label>
              <Input
                type='number'
                required
                value={requested}
                onChange={(e) => setRequested(e.target.value)}
              />
            </div>
            <div>
              <Label className='pb-2'>Acquired Fund</Label>
              <Input
                type='number'
                required
                value={acquired}
                onChange={(e) => setAcquired(e.target.value)}
              />
            </div>
            <Button type="submit">Add</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
